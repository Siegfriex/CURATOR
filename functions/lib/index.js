"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChatResponse = exports.getArtistList = exports.getArtistImage = exports.getDetailedTrajectory = exports.getComparativeAnalysis = exports.getMasterpieces = exports.getMetricInsight = exports.getArtistTimeline = exports.getArtistReport = exports.getDashboardData = void 0;
const https_1 = require("firebase-functions/v2/https");
const params_1 = require("firebase-functions/params");
const functions = require("firebase-functions");
const app_1 = require("firebase-admin/app");
const storage_1 = require("firebase-admin/storage");
const genai_1 = require("@google/genai");
const logger = require("firebase-functions/logger");
const cache_1 = require("./utils/cache");
const googleSearch_1 = require("./utils/googleSearch");
const imageSearch_1 = require("./utils/imageSearch");
// Initialize Firebase Admin - must be called before any Firestore operations
(0, app_1.initializeApp)();
// Initialize storage lazily
let storageInstance = null;
function getStorageBucket() {
    if (!storageInstance) {
        storageInstance = (0, storage_1.getStorage)().bucket();
    }
    return storageInstance;
}
// Define secrets for Functions 2nd gen
// Uses Secret Manager (firebase functions:secrets:set)
const geminiApiKeySecret = (0, params_1.defineSecret)("GEMINI_API_KEY");
const googleCseApiKeySecret = (0, params_1.defineSecret)("GOOGLE_CSE_API_KEY");
const googleCseIdSecret = (0, params_1.defineSecret)("GOOGLE_CSE_ID");
// Get API key from multiple sources
function getApiKey() {
    var _a;
    // Try Secret Manager first (most secure)
    try {
        const secretValue = geminiApiKeySecret.value();
        if (secretValue)
            return secretValue;
    }
    catch (e) {
        // Secret might not be available in local dev
    }
    // Try functions.config() (legacy but still works)
    try {
        const config = functions.config();
        if (((_a = config === null || config === void 0 ? void 0 : config.gemini) === null || _a === void 0 ? void 0 : _a.api_key) && config.gemini.api_key !== "YOUR_API_KEY") {
            return config.gemini.api_key;
        }
    }
    catch (e) {
        // Ignore if config is not available
    }
    // Try process.env (for local development)
    if (process.env.GEMINI_API_KEY) {
        return process.env.GEMINI_API_KEY;
    }
    return "";
}
// Initialize Gemini AI - lazy initialization
function getAI() {
    const apiKey = getApiKey();
    if (!apiKey) {
        logger.error("GEMINI_API_KEY is not set. Please set it using one of:");
        logger.error("1. Create .env.curatorproto file with GEMINI_API_KEY=your_key");
        logger.error("2. firebase functions:config:set gemini.api_key=\"your_key\"");
        logger.error("3. firebase functions:secrets:set GEMINI_API_KEY");
        throw new Error("GEMINI_API_KEY is not configured");
    }
    return new genai_1.GoogleGenAI({ apiKey });
}
// CORS is handled automatically by Functions 2nd gen with cors: true option
// Helper function to set security headers
function setSecurityHeaders(res) {
    res.set({
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
    });
}
// Dashboard Data Function
exports.getDashboardData = (0, https_1.onRequest)({
    secrets: [geminiApiKeySecret, googleCseApiKeySecret, googleCseIdSecret],
    cors: true
}, async (req, res) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    setSecurityHeaders(res);
    const artistName = req.query.artistName;
    if (!artistName) {
        res.status(400).json({ error: "artistName required" });
        return;
    }
    try {
        // Check cache
        const cacheKey = `dashboard:${artistName}`;
        const cached = await (0, cache_1.getCached)("dashboard", cacheKey);
        if (cached) {
            logger.info(`Cache hit for dashboard: ${artistName}`);
            res.json(cached);
            return;
        }
        // Call AI API
        const ai = getAI();
        const dataResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Research the artist "${artistName}". 
      Provide real-time estimated data for a professional art dashboard.
      
      1. Radar Metrics (0-100): Market Value, Critical Acclaim, Historical, Social Impact, Institutional.
      2. Trajectory (2020-2024): Average Auction Price Index (0-100 scale normalized).
      3. Description: A 1-sentence Curatorial Note in KOREAN.
      4. Nationality & Birth Year.
      
      OUTPUT FORMAT:
      Return STRICTLY valid JSON. Do not include Markdown code blocks (no \`\`\`json).
      {
        "radar": { "market": 0, "critical": 0, "historical": 0, "social": 0, "institutional": 0 },
        "trajectory": [ { "year": "2020", "value": 0 }, { "year": "2021", "value": 0 }, { "year": "2022", "value": 0 }, { "year": "2023", "value": 0 }, { "year": "2024", "value": 0 } ],
        "description": "String",
        "nationality": "String",
        "birthYear": 1900
      }`,
            config: {
                tools: [{ googleSearch: {} }],
            }
        });
        const text = dataResponse.text || "{}";
        let cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            cleanedText = jsonMatch[0];
        }
        let data;
        try {
            data = JSON.parse(cleanedText);
        }
        catch (e) {
            logger.error("Failed to parse dashboard JSON", cleanedText);
            data = {};
        }
        // Try to get real artist image first
        const cseApiKey = googleCseApiKeySecret.value() || ((_b = (_a = functions.config().google) === null || _a === void 0 ? void 0 : _a.cse) === null || _b === void 0 ? void 0 : _b.api_key) || "";
        const cseId = googleCseIdSecret.value() || ((_d = (_c = functions.config().google) === null || _c === void 0 ? void 0 : _c.cse) === null || _d === void 0 ? void 0 : _d.id) || "";
        let imageUrl = null;
        if (cseApiKey && cseId) {
            // Try to get real artist image from Wikipedia or Google Images
            imageUrl = await (0, imageSearch_1.searchArtistImage)(artistName, cseApiKey, cseId);
        }
        // Fallback to AI-generated image if real image not found
        if (!imageUrl) {
            const imagePrompt = `Portrait of artist ${artistName}, artistic black and white photography, studio lighting, high contrast, minimalist composition, editorial style.`;
            imageUrl = await generateImage(imagePrompt);
        }
        // Final fallback to placeholder
        if (!imageUrl) {
            imageUrl = `https://picsum.photos/seed/${artistName}/800/800?grayscale`;
        }
        const result = {
            name: artistName,
            nationality: data.nationality || "Unknown",
            birthYear: data.birthYear || 1900,
            description: data.description || "Data retrieval pending...",
            imageUrl: imageUrl,
            rank: Math.floor(Math.random() * 30) + 1,
            radarData: [
                { axis: 'Market Value', value: ((_e = data.radar) === null || _e === void 0 ? void 0 : _e.market) || 50, fullMark: 100 },
                { axis: 'Critical Acclaim', value: ((_f = data.radar) === null || _f === void 0 ? void 0 : _f.critical) || 50, fullMark: 100 },
                { axis: 'Historical', value: ((_g = data.radar) === null || _g === void 0 ? void 0 : _g.historical) || 50, fullMark: 100 },
                { axis: 'Social Impact', value: ((_h = data.radar) === null || _h === void 0 ? void 0 : _h.social) || 50, fullMark: 100 },
                { axis: 'Institutional', value: ((_j = data.radar) === null || _j === void 0 ? void 0 : _j.institutional) || 50, fullMark: 100 },
            ],
            trajectory: ((_k = data.trajectory) === null || _k === void 0 ? void 0 : _k.map((t) => ({ date: t.year, value: t.value }))) || []
        };
        // Cache result
        await (0, cache_1.setCached)("dashboard", cacheKey, result);
        res.json(result);
    }
    catch (error) {
        logger.error("Error fetching dashboard data:", error);
        res.status(500).json({ error: error.message || "Internal server error" });
    }
});
// Generate Image Helper
async function generateImage(prompt) {
    var _a, _b, _c;
    if (!getApiKey())
        return null;
    try {
        const ai = getAI();
        const response = await ai.models.generateImages({
            model: 'gemini-3-pro-image-preview',
            prompt: `Artistic, high-contrast, black and white archival photography style, grainy, abstract, highly aesthetic: ${prompt}`,
            config: {
                numberOfImages: 1,
                aspectRatio: '4:3',
                outputMimeType: 'image/jpeg'
            }
        });
        const base64Image = (_c = (_b = (_a = response.generatedImages) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.image) === null || _c === void 0 ? void 0 : _c.imageBytes;
        if (base64Image) {
            // Save to Cloud Storage
            const imagePath = `artists/${encodeURIComponent(prompt)}.jpg`;
            const file = getStorageBucket().file(imagePath);
            await file.save(Buffer.from(base64Image, 'base64'), {
                metadata: { contentType: 'image/jpeg' }
            });
            // Get signed URL
            const [url] = await file.getSignedUrl({
                action: 'read',
                expires: '03-01-2500'
            });
            return url;
        }
        return null;
    }
    catch (error) {
        logger.warn("Image generation failed", error.message);
        const seed = prompt.split("").reduce((a, b) => {
            a = ((a << 5) - a) + b.charCodeAt(0);
            return a & a;
        }, 0);
        return `https://picsum.photos/seed/${Math.abs(seed)}/800/600?grayscale`;
    }
}
// Artist Report Function
exports.getArtistReport = (0, https_1.onRequest)({
    secrets: [geminiApiKeySecret, googleCseApiKeySecret, googleCseIdSecret],
    cors: true
}, async (req, res) => {
    var _a, _b, _c;
    setSecurityHeaders(res);
    const artistName = req.query.artistName;
    if (!artistName) {
        res.status(400).json({ error: "artistName required" });
        return;
    }
    try {
        const cacheKey = `report:${artistName}`;
        const cached = await (0, cache_1.getCached)("report", cacheKey);
        if (cached) {
            logger.info(`Cache hit for report: ${artistName}`);
            res.json(cached);
            return;
        }
        const ai = getAI();
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: `Generate a comprehensive, high-end curator report for the artist "${artistName}".
      
      OUTPUT FORMAT:
      1. First, output a valid JSON object for the 'highlights' data.
      2. Then, output the exact delimiter string: "___REPORT_SECTION___"
      3. Finally, output the full editorial report in Markdown format.

      LANGUAGE: KOREAN (한국어) for all values.
      TONE: Professional, Editorial, Artforum-style.

      JSON Structure for Part 1:
      {
         "majorWorks": ["String", "String", "String"],
         "style": ["String", "String"],
         "movements": ["String", "String"],
         "relatedArtists": ["String", "String", "String"],
         "curatorNotes": "String (Concise essence)",
         "personalityKeywords": ["String", "String", "String"]
      }

      The Report (Part 3) must include sections like:
      # 종합 분석 (Comprehensive Analysis)
      ## 최근 전시 동향 (Recent Exhibitions)
      ## 시장 지표 분석 (Market Trends)
      ## 비평적 수용 (Critical Reception)
      
      Use BOLD formatting for key terms.
      `,
            config: {
                tools: [{ googleSearch: {} }],
            },
        });
        const fullText = response.text || "";
        const parts = fullText.split("___REPORT_SECTION___");
        let highlightsPart = parts[0] || "{}";
        let reportTextPart = parts[1] || "";
        if (parts.length < 2) {
            if (fullText.trim().startsWith('{')) {
                highlightsPart = fullText;
                reportTextPart = "# Analysis\n\nDetailed text unavailable due to formatting.";
            }
            else {
                highlightsPart = "{}";
                reportTextPart = fullText;
            }
        }
        highlightsPart = highlightsPart.replace(/```json/g, '').replace(/```/g, '').trim();
        let highlights;
        try {
            const jsonMatch = highlightsPart.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                highlightsPart = jsonMatch[0];
            }
            highlights = JSON.parse(highlightsPart);
        }
        catch (e) {
            logger.error("JSON Parsing failed for highlights section", highlightsPart);
            highlights = {
                majorWorks: [],
                style: [],
                movements: [],
                relatedArtists: [],
                curatorNotes: "Data parsing error.",
                personalityKeywords: []
            };
        }
        const groundingChunks = ((_c = (_b = (_a = response.candidates) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.groundingMetadata) === null || _c === void 0 ? void 0 : _c.groundingChunks) || [];
        const sources = groundingChunks
            .filter((chunk) => chunk.web)
            .map((chunk) => {
            var _a, _b;
            return ({
                web: {
                    uri: (_a = chunk.web) === null || _a === void 0 ? void 0 : _a.uri,
                    title: (_b = chunk.web) === null || _b === void 0 ? void 0 : _b.title,
                }
            });
        });
        const result = {
            text: reportTextPart.trim(),
            highlights: highlights,
            sources
        };
        await (0, cache_1.setCached)("report", cacheKey, result);
        res.json(result);
    }
    catch (error) {
        logger.error("Error generating report:", error);
        res.status(500).json({ error: error.message || "Internal server error" });
    }
});
// Artist Timeline Function
exports.getArtistTimeline = (0, https_1.onRequest)({
    secrets: [geminiApiKeySecret, googleCseApiKeySecret, googleCseIdSecret],
    cors: true,
    timeoutSeconds: 120,
    memory: "512MiB" // 메모리 증가
}, async (req, res) => {
    var _a, _b, _c, _d;
    // CORS 헤더 명시적 설정 (에러 시에도 적용)
    res.set({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
    });
    setSecurityHeaders(res);
    const artistName = req.query.artistName;
    const birthYear = parseInt(req.query.birthYear);
    if (!artistName || !birthYear) {
        res.status(400).json({ error: "artistName and birthYear required" });
        return;
    }
    try {
        const cacheKey = `timeline:${artistName}:${birthYear}`;
        const cached = await (0, cache_1.getCached)("timeline", cacheKey);
        if (cached) {
            logger.info(`Cache hit for timeline: ${artistName}`);
            res.json(cached);
            return;
        }
        const ai = getAI();
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Create a chronological "Life Journey" timeline for the artist "${artistName}" (born ${birthYear}).
      
      IMPORTANT:
      1. All descriptions MUST be in KOREAN (한국어).
      2. 'eraLabel' MUST be a concise English Keyword Title.
      
      Divide career into 4 distinct "Eras".
      For each Era, include 3 MAJOR events.
      
      OUTPUT FORMAT: STRICT VALID JSON. NO MARKDOWN. NO COMMENTS.
      {
        "sources": ["Source 1", "Source 2"],
        "critiques": [{ "text": "Quote", "author": "Name", "source": "Source", "year": "1990" }],
        "masterpieces": [{ "title": "Work", "year": "1990", "visualPrompt": "Desc" }],
        "eras": [
          {
            "eraLabel": "Era Name", "ageRange": "20s-30s", "startYear": 1900, "endYear": 1910, "moodColor": "#555555", "summary": "Summary",
            "events": [
              {
                "year": 1905, "title": "Title", "category": "Masterpiece", "description": "Short Desc", "impactScore": 80, "auctionHigh": 90, "auctionLow": 70, "visualPrompt": "Desc",
                "context": { "marketValue": 50, "criticalAcclaim": 50, "historical": 50, "socialImpact": 50, "institutional": 50 }
              }
            ]
          }
        ]
      }`,
            config: {
                tools: [{ googleSearch: {} }],
            }
        });
        const text = response.text || "{}";
        if (!text || text.trim().length === 0) {
            logger.warn("Empty response from Gemini API");
            res.status(500).json({ error: "Empty response from AI", eras: [] });
            return;
        }
        let cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            logger.error("No JSON found in response", text.substring(0, 200));
            res.status(500).json({ error: "Invalid JSON response", eras: [] });
            return;
        }
        cleanedText = jsonMatch[0];
        cleanedText = cleanedText.replace(/,\s*}/g, '}').replace(/,\s*]/g, ']');
        let result;
        try {
            result = JSON.parse(cleanedText);
        }
        catch (e) {
            logger.error("JSON parse error", { error: e.message, text: cleanedText.substring(0, 200) });
            res.status(500).json({ error: "Failed to parse JSON", eras: [] });
            return;
        }
        // Fetch real artwork images for timeline masterpieces
        const cseApiKey = googleCseApiKeySecret.value() || ((_b = (_a = functions.config().google) === null || _a === void 0 ? void 0 : _a.cse) === null || _b === void 0 ? void 0 : _b.api_key) || "";
        const cseId = googleCseIdSecret.value() || ((_d = (_c = functions.config().google) === null || _c === void 0 ? void 0 : _c.cse) === null || _d === void 0 ? void 0 : _d.id) || "";
        if (cseApiKey && cseId && result.eras) {
            for (const era of result.eras) {
                if (era.events) {
                    for (const event of era.events) {
                        if (event.category === "Masterpiece" && event.title && !event.imageUrl) {
                            const imageUrl = await (0, imageSearch_1.searchArtworkImage)(event.title, artistName, cseApiKey, cseId);
                            if (imageUrl) {
                                event.imageUrl = imageUrl;
                            }
                            else if (event.visualPrompt) {
                                // Fallback to AI-generated image
                                event.imageUrl = await generateImage(event.visualPrompt) || `https://picsum.photos/seed/${event.title}/800/600?grayscale`;
                            }
                        }
                    }
                }
                // Also process masterpieces array if exists
                if (era.masterpieces) {
                    for (const masterpiece of era.masterpieces) {
                        if (masterpiece.title && !masterpiece.imageUrl) {
                            const imageUrl = await (0, imageSearch_1.searchArtworkImage)(masterpiece.title, artistName, cseApiKey, cseId);
                            if (imageUrl) {
                                masterpiece.imageUrl = imageUrl;
                            }
                            else if (masterpiece.visualPrompt) {
                                masterpiece.imageUrl = await generateImage(masterpiece.visualPrompt) || `https://picsum.photos/seed/${masterpiece.title}/800/600?grayscale`;
                            }
                        }
                    }
                }
            }
            // Process top-level masterpieces array if exists
            if (result.masterpieces) {
                for (const masterpiece of result.masterpieces) {
                    if (masterpiece.title && !masterpiece.imageUrl) {
                        const imageUrl = await (0, imageSearch_1.searchArtworkImage)(masterpiece.title, artistName, cseApiKey, cseId);
                        if (imageUrl) {
                            masterpiece.imageUrl = imageUrl;
                        }
                        else if (masterpiece.visualPrompt) {
                            masterpiece.imageUrl = await generateImage(masterpiece.visualPrompt) || `https://picsum.photos/seed/${masterpiece.title}/800/600?grayscale`;
                        }
                    }
                }
            }
        }
        await (0, cache_1.setCached)("timeline", cacheKey, result);
        res.json(result);
    }
    catch (error) {
        logger.error("Error generating timeline:", error);
        // 에러 응답에도 CORS 헤더 보장
        res.set({
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        });
        res.status(500).json({ error: error.message || "Internal server error", eras: [] });
    }
});
// Metric Insight Function
exports.getMetricInsight = (0, https_1.onRequest)({
    secrets: [geminiApiKeySecret, googleCseApiKeySecret, googleCseIdSecret],
    cors: true
}, async (req, res) => {
    setSecurityHeaders(res);
    const artistName = req.query.artistName;
    const metric = req.query.metric;
    const score = parseInt(req.query.score);
    if (!artistName || !metric || isNaN(score)) {
        res.status(400).json({ error: "artistName, metric, and score required" });
        return;
    }
    try {
        const cacheKey = `insight:${artistName}:${metric}:${score}`;
        const cached = await (0, cache_1.getCached)("insight", cacheKey);
        if (cached) {
            logger.info(`Cache hit for insight: ${artistName}:${metric}`);
            res.json({ text: cached });
            return;
        }
        const ai = getAI();
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: `Analyze why the artist "${artistName}" might have a score of ${score}/100 in the metric category: "${metric}".
      IMPORTANT: Output in KOREAN (한국어). Tone: Insightful, analytical, curatorial.
      Provide a concise, single-paragraph explanation citing specific recent real-world examples.`,
            config: {
                tools: [{ googleSearch: {} }],
                temperature: 0.7,
            },
        });
        const text = response.text || "데이터 분석을 사용할 수 없습니다.";
        await (0, cache_1.setCached)("insight", cacheKey, text);
        res.json({ text });
    }
    catch (error) {
        logger.error("Error generating insight:", error);
        res.status(500).json({ error: error.message || "Internal server error", text: "시스템 오류: 실시간 분석을 검색할 수 없습니다." });
    }
});
// Masterpieces Function
exports.getMasterpieces = (0, https_1.onRequest)({
    secrets: [geminiApiKeySecret, googleCseApiKeySecret, googleCseIdSecret],
    cors: true
}, async (req, res) => {
    var _a, _b, _c, _d;
    setSecurityHeaders(res);
    const artistName = req.query.artistName;
    const metric = req.query.metric;
    if (!artistName || !metric) {
        res.status(400).json({ error: "artistName and metric required" });
        return;
    }
    try {
        const cacheKey = `masterpieces:${artistName}:${metric}`;
        const cached = await (0, cache_1.getCached)("masterpieces", cacheKey);
        if (cached) {
            logger.info(`Cache hit for masterpieces: ${artistName}:${metric}`);
            res.json(cached);
            return;
        }
        const ai = getAI();
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Identify 3 masterpieces by "${artistName}" that specifically demonstrate high "${metric}".
      
      OUTPUT FORMAT: Strictly valid JSON array.
      [
        { "title": "Work Title", "year": "1900", "visualPrompt": "Visual description for image gen" }
      ]`,
            config: {
                tools: [{ googleSearch: {} }],
            }
        });
        let cleanedText = (response.text || "[]").replace(/```json/g, '').replace(/```/g, '').trim();
        const arrayMatch = cleanedText.match(/\[[\s\S]*\]/);
        if (arrayMatch)
            cleanedText = arrayMatch[0];
        let result;
        try {
            result = JSON.parse(cleanedText);
        }
        catch (e) {
            logger.error("Failed to parse masterpieces JSON", cleanedText);
            result = [];
        }
        // Fetch real artwork images for each masterpiece
        const cseApiKey = googleCseApiKeySecret.value() || ((_b = (_a = functions.config().google) === null || _a === void 0 ? void 0 : _a.cse) === null || _b === void 0 ? void 0 : _b.api_key) || "";
        const cseId = googleCseIdSecret.value() || ((_d = (_c = functions.config().google) === null || _c === void 0 ? void 0 : _c.cse) === null || _d === void 0 ? void 0 : _d.id) || "";
        if (cseApiKey && cseId && result.length > 0) {
            const imagePromises = result.map(async (artwork) => {
                if (!artwork.imageUrl) {
                    const imageUrl = await (0, imageSearch_1.searchArtworkImage)(artwork.title, artistName, cseApiKey, cseId);
                    if (imageUrl) {
                        artwork.imageUrl = imageUrl;
                    }
                    else {
                        // Fallback to AI-generated image
                        const imagePrompt = artwork.visualPrompt || `${artwork.title} by ${artistName}`;
                        artwork.imageUrl = await generateImage(imagePrompt) || `https://picsum.photos/seed/${artwork.title}/800/600?grayscale`;
                    }
                }
                return artwork;
            });
            result = await Promise.all(imagePromises);
        }
        else {
            // Fallback: generate images using visualPrompt
            for (const artwork of result) {
                if (!artwork.imageUrl) {
                    const imagePrompt = artwork.visualPrompt || `${artwork.title} by ${artistName}`;
                    artwork.imageUrl = await generateImage(imagePrompt) || `https://picsum.photos/seed/${artwork.title}/800/600?grayscale`;
                }
            }
        }
        await (0, cache_1.setCached)("masterpieces", cacheKey, result);
        res.json(result);
    }
    catch (error) {
        logger.error("Error fetching masterpieces:", error);
        res.status(500).json({
            error: error.message || "Internal server error",
            result: [
                { title: "Masterpiece I", year: "N/A", visualPrompt: `Abstract art by ${req.query.artistName}` },
                { title: "Masterpiece II", year: "N/A", visualPrompt: `Famous work by ${req.query.artistName}` },
                { title: "Masterpiece III", year: "N/A", visualPrompt: `Iconic art by ${req.query.artistName}` }
            ]
        });
    }
});
// Comparative Analysis Function
exports.getComparativeAnalysis = (0, https_1.onRequest)({
    secrets: [geminiApiKeySecret, googleCseApiKeySecret, googleCseIdSecret],
    cors: true
}, async (req, res) => {
    var _a, _b, _c;
    setSecurityHeaders(res);
    const artist1 = req.query.artist1;
    const artist2 = req.query.artist2;
    const sharedMetric = req.query.sharedMetric || 'Market Value';
    if (!artist1 || !artist2) {
        res.status(400).json({ error: "artist1 and artist2 required" });
        return;
    }
    try {
        const cacheKey = `comparison:${artist1}:${artist2}:${sharedMetric}`;
        const cached = await (0, cache_1.getCached)("comparison", cacheKey);
        if (cached) {
            logger.info(`Cache hit for comparison: ${artist1}:${artist2}`);
            res.json(cached);
            return;
        }
        const ai = getAI();
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: `Compare the artists "${artist1}" and "${artist2}". 
      Focus specifically on why they are stylistically or conceptually similar, particularly regarding "${sharedMetric}".
      
      IMPORTANT: Output in KOREAN (한국어). Tone: Editorial, Art Criticism, Professional.
      Structure the output in 3 concise paragraphs:
      1. Shared Trajectory (공통 궤적)
      2. Differential Points (차별점)
      3. Future Outlook (전망)
      
      Keep it curatorial and high-level.`,
            config: {
                tools: [{ googleSearch: {} }],
                temperature: 0.7,
            },
        });
        const text = response.text || "비교 분석을 생성할 수 없습니다.";
        const groundingChunks = ((_c = (_b = (_a = response.candidates) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.groundingMetadata) === null || _c === void 0 ? void 0 : _c.groundingChunks) || [];
        const sources = groundingChunks
            .filter((chunk) => chunk.web)
            .map((chunk) => {
            var _a, _b;
            return ({
                web: {
                    uri: (_a = chunk.web) === null || _a === void 0 ? void 0 : _a.uri,
                    title: (_b = chunk.web) === null || _b === void 0 ? void 0 : _b.title,
                }
            });
        });
        const result = { text, sources };
        await (0, cache_1.setCached)("comparison", cacheKey, result);
        res.json(result);
    }
    catch (error) {
        logger.error("Error generating comparison:", error);
        res.status(500).json({ error: error.message || "Internal server error", text: "비교 분석 생성 실패.", sources: [] });
    }
});
// Detailed Trajectory Function
exports.getDetailedTrajectory = (0, https_1.onRequest)({
    secrets: [geminiApiKeySecret, googleCseApiKeySecret, googleCseIdSecret],
    cors: true,
    timeoutSeconds: 300,
    memory: "512MiB",
    maxInstances: 10
}, async (req, res) => {
    var _a, _b, _c, _d;
    // CORS headers are handled by cors: true, but set additional headers
    res.set({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
    });
    setSecurityHeaders(res);
    const artist1 = req.query.artist1;
    const artist2 = req.query.artist2;
    if (!artist1 || !artist2) {
        res.status(400).json({ error: "artist1 and artist2 required" });
        return;
    }
    try {
        const cacheKey = `trajectory:${artist1}:${artist2}`;
        const cached = await (0, cache_1.getCached)("trajectory", cacheKey);
        if (cached) {
            logger.info(`Cache hit for trajectory: ${artist1}:${artist2}`);
            res.json(cached);
            return;
        }
        // Perform Google Custom Search first (faster than Gemini's tool)
        let searchContext = "";
        const cseApiKey = googleCseApiKeySecret.value() || ((_b = (_a = functions.config().google) === null || _a === void 0 ? void 0 : _a.cse) === null || _b === void 0 ? void 0 : _b.api_key) || "";
        const cseId = googleCseIdSecret.value() || ((_d = (_c = functions.config().google) === null || _c === void 0 ? void 0 : _c.cse) === null || _d === void 0 ? void 0 : _d.id) || "";
        if (cseApiKey && cseId) {
            try {
                // Perform parallel searches for both artists
                // Search across multiple art-related sites for comprehensive results
                const searchQueries = [
                    `${artist1} art career trajectory institution discourse academy network`,
                    `${artist2} art career trajectory institution discourse academy network`,
                    `${artist1} ${artist2} comparison art market auction`,
                ];
                const searchPromises = searchQueries.map(query => (0, googleSearch_1.performGoogleSearch)(query, cseApiKey, cseId, 5));
                const searchResults = await Promise.all(searchPromises);
                const combinedResults = searchResults.flat();
                // Remove duplicates based on link
                const uniqueResults = combinedResults.filter((result, index, self) => index === self.findIndex((r) => r.link === result.link));
                // Limit to top 10 most relevant results
                const topResults = uniqueResults.slice(0, 10);
                searchContext = (0, googleSearch_1.formatSearchResultsAsContext)(topResults);
                logger.info(`Google Custom Search completed: ${topResults.length} unique results from ${combinedResults.length} total`);
            }
            catch (error) {
                logger.warn("Google Custom Search failed, falling back to Gemini Search tool:", error.message);
                // Fallback to Gemini's search tool if Custom Search fails
            }
        }
        const ai = getAI();
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Compare the lifelong trajectory of "${artist1}" vs "${artist2}" across 5 specific metrics:
      Institution, Discourse, Academy, Network, and Total (Average).
      
      Provide data points for granular ages: 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 44, 46, 48, 50, 52, 54, 56, 58, 60, 62, 64, 66, 68, 70, 72, 74, 76, 78, 80.
      Values should be 0-100.
      
      For each data point, provide a very brief "context" string (3-5 words max) in KOREAN. Focus on key milestones only.
      ${searchContext}
      
      OUTPUT FORMAT: Strictly valid JSON. No markdown, no comments, just JSON.
      {
        "artist1": "${artist1}",
        "artist2": "${artist2}",
        "data": [
          {
            "age": 20,
            "a1_total": 0, "a1_institution": 0, "a1_discourse": 0, "a1_academy": 0, "a1_network": 0, "a1_context": "Reason...",
            "a2_total": 0, "a2_institution": 0, "a2_discourse": 0, "a2_academy": 0, "a2_network": 0, "a2_context": "Reason..."
          }
        ]
      }`,
            config: {
                temperature: 0.3,
                // Only use Gemini's search tool if Custom Search API is not configured
                tools: (cseApiKey && cseId) ? undefined : [{ googleSearch: {} }]
            }
        });
        let cleanedText = response.text || "{}";
        if (!cleanedText || cleanedText.trim().length === 0) {
            logger.warn("Empty response from Gemini API for trajectory");
            throw new Error("Empty response from AI");
        }
        cleanedText = cleanedText.replace(/```json/g, '').replace(/```/g, '').trim();
        const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            logger.error("No JSON found in trajectory response", cleanedText.substring(0, 200));
            throw new Error("Invalid JSON response");
        }
        cleanedText = jsonMatch[0];
        let result;
        try {
            result = JSON.parse(cleanedText);
        }
        catch (e) {
            logger.error("JSON parse error for trajectory", { error: e.message, text: cleanedText.substring(0, 200) });
            throw new Error(`Failed to parse JSON: ${e.message}`);
        }
        await (0, cache_1.setCached)("trajectory", cacheKey, result);
        res.json(result);
    }
    catch (error) {
        logger.error("Detailed Trajectory Error", error);
        // CORS 헤더 보장
        res.set({
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        });
        const ages = [20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 44, 46, 48, 50, 52, 54, 56, 58, 60, 62, 64, 66, 68, 70, 72, 74, 76, 78, 80];
        const fallback = {
            artist1: req.query.artist1,
            artist2: req.query.artist2,
            data: ages.map(age => ({
                age,
                a1_total: 50 + Math.random() * 40,
                a1_institution: 50 + Math.random() * 40,
                a1_discourse: 50,
                a1_academy: 50,
                a1_network: 50,
                a1_context: "Data unavailable",
                a2_total: 50 + Math.random() * 40,
                a2_institution: 50 + Math.random() * 40,
                a2_discourse: 50,
                a2_academy: 50,
                a2_network: 50,
                a2_context: "Data unavailable"
            }))
        };
        res.status(500).json(Object.assign({ error: error.message || "Internal server error" }, fallback));
    }
});
// Image Generation Function
exports.getArtistImage = (0, https_1.onRequest)({
    secrets: [geminiApiKeySecret, googleCseApiKeySecret, googleCseIdSecret],
    cors: true
}, async (req, res) => {
    setSecurityHeaders(res);
    const prompt = req.query.prompt;
    if (!prompt) {
        res.status(400).json({ error: "prompt required" });
        return;
    }
    try {
        const cacheKey = `image:${prompt}`;
        const cached = await (0, cache_1.getCached)("images", cacheKey);
        if (cached) {
            logger.info(`Cache hit for image: ${prompt}`);
            res.json({ url: cached });
            return;
        }
        const imageUrl = await generateImage(prompt);
        if (imageUrl) {
            await (0, cache_1.setCached)("images", cacheKey, imageUrl);
            res.json({ url: imageUrl });
        }
        else {
            const seed = prompt.split("").reduce((a, b) => {
                a = ((a << 5) - a) + b.charCodeAt(0);
                return a & a;
            }, 0);
            const fallbackUrl = `https://picsum.photos/seed/${Math.abs(seed)}/800/600?grayscale`;
            res.json({ url: fallbackUrl });
        }
    }
    catch (error) {
        logger.error("Error generating image:", error);
        res.status(500).json({ error: error.message || "Internal server error" });
    }
});
// Artist List Function - Generate dynamic artist recommendations
exports.getArtistList = (0, https_1.onRequest)({
    secrets: [geminiApiKeySecret, googleCseApiKeySecret, googleCseIdSecret],
    cors: true,
    timeoutSeconds: 120,
    memory: "512MiB"
}, async (req, res) => {
    // CORS headers
    res.set({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
    });
    setSecurityHeaders(res);
    const offset = parseInt(req.query.offset) || 0;
    const limit = parseInt(req.query.limit) || 20;
    const context = req.query.context || "all";
    try {
        const cacheKey = `artist_list:${offset}:${limit}:${context}`;
        const cached = await (0, cache_1.getCached)("artists", cacheKey);
        if (cached) {
            logger.info(`Cache hit for artist list: offset=${offset}, limit=${limit}`);
            res.json({ artists: cached });
            return;
        }
        const ai = getAI();
        // Generate artist list based on context
        let prompt = `Generate a list of ${limit} famous artists (painters, sculptors, contemporary artists) starting from rank ${offset + 1}.
    
    IMPORTANT:
    1. Include diverse artists from different periods, movements, and nationalities
    2. Focus on artists with significant market value, critical acclaim, or historical importance
    3. Mix well-known masters with contemporary artists
    4. Include artists from various art movements (Impressionism, Modernism, Contemporary, etc.)
    
    ${context !== "all" ? `Context: Focus on ${context} artists.` : ""}
    
    OUTPUT FORMAT: Strictly valid JSON array. No markdown, no comments.
    [
      {
        "name": "Artist Full Name",
        "birthYear": 1900,
        "nationality": "Country",
        "description": "Brief curatorial note in KOREAN (한국어), 1 sentence max",
        "currentRank": 1,
        "radarData": [
          { "axis": "Market Value", "value": 85, "fullMark": 100 },
          { "axis": "Critical Acclaim", "value": 90, "fullMark": 100 },
          { "axis": "Historical", "value": 88, "fullMark": 100 },
          { "axis": "Social Impact", "value": 75, "fullMark": 100 },
          { "axis": "Institutional", "value": 92, "fullMark": 100 }
        ],
        "trajectory": [
          { "date": "2020", "value": 80 },
          { "date": "2021", "value": 82 },
          { "date": "2022", "value": 84 },
          { "date": "2023", "value": 86 },
          { "date": "2024", "value": 88 }
        ]
      }
    ]`;
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                // Remove googleSearch tool for faster response (can be re-enabled if needed)
                temperature: 0.7,
            }
        });
        let cleanedText = response.text || "[]";
        cleanedText = cleanedText.replace(/```json/g, '').replace(/```/g, '').trim();
        const arrayMatch = cleanedText.match(/\[[\s\S]*\]/);
        if (arrayMatch)
            cleanedText = arrayMatch[0];
        let artists;
        try {
            artists = JSON.parse(cleanedText);
        }
        catch (e) {
            logger.error("Failed to parse artist list JSON", cleanedText);
            artists = [];
        }
        // Add IDs and image URLs
        const artistsWithIds = artists.map((artist, index) => (Object.assign(Object.assign({}, artist), { id: `artist_${offset + index + 1}`, imageUrl: `https://picsum.photos/seed/${artist.name}/800/800?grayscale`, currentRank: offset + index + 1 })));
        await (0, cache_1.setCached)("artists", cacheKey, artistsWithIds);
        res.json({ artists: artistsWithIds });
    }
    catch (error) {
        logger.error("Error generating artist list:", error);
        res.status(500).json({ error: error.message || "Internal server error", artists: [] });
    }
});
// Chat Response Function (not cached as it's conversational)
exports.getChatResponse = (0, https_1.onRequest)({
    secrets: [geminiApiKeySecret, googleCseApiKeySecret, googleCseIdSecret],
    cors: true
}, async (req, res) => {
    setSecurityHeaders(res);
    const artistName = req.query.artistName;
    const topic = req.query.topic;
    if (!artistName || !topic) {
        res.status(400).json({ error: "artistName and topic required" });
        return;
    }
    try {
        const ai = getAI();
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: `Act as an expert art curator or AI Analyst. Provide a concise, insightful commentary on "${artistName}" specifically regarding "${topic}".
      
      LANGUAGE: KOREAN (한국어).
      TONE: Conversational yet Professional, like a museum docent.
      LENGTH: 2-3 sentences max.`,
            config: {
                tools: [{ googleSearch: {} }],
                temperature: 0.7,
            },
        });
        const text = response.text || "분석을 생성할 수 없습니다.";
        res.json({ text });
    }
    catch (error) {
        logger.error("Error generating chat response:", error);
        res.status(500).json({ error: error.message || "Internal server error", text: "현재 대화 서비스를 이용할 수 없습니다." });
    }
});
//# sourceMappingURL=index.js.map