
import { GoogleGenAI, Type } from "@google/genai";
import { AIReportResult, GroundingSource, Artist, AxisData, TimelineData, DashboardData, Masterpiece, ComparativeTrajectory, TrajectoryDataPoint } from '../types';

const API_KEY = process.env.API_KEY || '';

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: API_KEY });

export const generateArtistReport = async (artistName: string): Promise<AIReportResult> => {
  if (!API_KEY) {
    throw new Error("Gemini API Key is missing.");
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
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
       // Fallback if delimiter is missing
       if (fullText.trim().startsWith('{')) {
          // Assume whole response is JSON and text is missing or inside
          highlightsPart = fullText;
          reportTextPart = "# Analysis\n\nDetailed text unavailable due to formatting.";
       } else {
          highlightsPart = "{}";
          reportTextPart = fullText;
       }
    }
    
    // Clean Markdown code blocks if present
    highlightsPart = highlightsPart.replace(/```json/g, '').replace(/```/g, '').trim();
    
    let highlights;
    try {
      // Try to extract JSON object if there is extra text
      const jsonMatch = highlightsPart.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
          highlightsPart = jsonMatch[0];
      }
      highlights = JSON.parse(highlightsPart);
    } catch (e) {
      console.error("JSON Parsing failed for highlights section", highlightsPart);
      highlights = {
          majorWorks: [],
          style: [],
          movements: [],
          relatedArtists: [],
          curatorNotes: "Data parsing error.",
          personalityKeywords: []
      };
    }
    
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources: GroundingSource[] = groundingChunks
      .filter((chunk: any) => chunk.web)
      .map((chunk: any) => ({
        web: {
          uri: chunk.web?.uri,
          title: chunk.web?.title,
        }
      }));

    return {
      text: reportTextPart.trim(),
      highlights: highlights,
      sources
    };

  } catch (error) {
    console.error("Error generating report:", error);
    throw error;
  }
};

export const generateEventImage = async (prompt: string): Promise<string | null> => {
  if (!API_KEY) return null;
  
  try {
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: `Artistic, high-contrast, black and white archival photography style, grainy, abstract, highly aesthetic: ${prompt}`,
      config: {
        numberOfImages: 1,
        aspectRatio: '4:3',
        outputMimeType: 'image/jpeg'
      }
    });

    const base64Image = response.generatedImages?.[0]?.image?.imageBytes;
    if (base64Image) {
      return `data:image/jpeg;base64,${base64Image}`;
    }
    return null;
  } catch (error: any) {
    console.warn("Image generation failed (likely quota exceeded), falling back to placeholder.", error.message);
    
    // Generate a deterministic seed from the prompt so the same event always gets the same placeholder
    const seed = prompt.split("").reduce((a, b) => {
        a = ((a << 5) - a) + b.charCodeAt(0);
        return a & a;
    }, 0);
    
    // Return a high-quality grayscale placeholder from Picsum
    return `https://picsum.photos/seed/${Math.abs(seed)}/800/600?grayscale`;
  }
};

export const fetchArtistDashboardData = async (artistName: string): Promise<DashboardData> => {
  if (!API_KEY) throw new Error("Gemini API Key is missing.");

  try {
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
    
    // Robust JSON extraction
    const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
        cleanedText = jsonMatch[0];
    }

    let data;
    try {
      data = JSON.parse(cleanedText);
    } catch (e) {
      console.error("Failed to parse dashboard JSON", cleanedText);
      data = {};
    }

    const imagePrompt = `Portrait of artist ${artistName}, artistic black and white photography, studio lighting, high contrast, minimalist composition, editorial style.`;
    // This will now return a fallback if quota is exceeded
    const imageUrl = await generateEventImage(imagePrompt);

    return {
      name: artistName,
      nationality: data.nationality || "Unknown",
      birthYear: data.birthYear || 1900,
      description: data.description || "Data retrieval pending...",
      imageUrl: imageUrl || `https://picsum.photos/seed/${artistName}/800/800?grayscale`,
      rank: Math.floor(Math.random() * 30) + 1, 
      radarData: [
        { axis: 'Market Value', value: data.radar?.market || 50, fullMark: 100 },
        { axis: 'Critical Acclaim', value: data.radar?.critical || 50, fullMark: 100 },
        { axis: 'Historical', value: data.radar?.historical || 50, fullMark: 100 },
        { axis: 'Social Impact', value: data.radar?.social || 50, fullMark: 100 },
        { axis: 'Institutional', value: data.radar?.institutional || 50, fullMark: 100 },
      ],
      trajectory: data.trajectory?.map((t: any) => ({ date: t.year, value: t.value })) || []
    };

  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    throw error;
  }
}

export const generateMetricInsight = async (artistName: string, metric: string, score: number): Promise<string> => {
  if (!API_KEY) throw new Error("Gemini API Key is missing.");

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Analyze why the artist "${artistName}" might have a score of ${score}/100 in the metric category: "${metric}".
      IMPORTANT: Output in KOREAN (한국어). Tone: Insightful, analytical, curatorial.
      Provide a concise, single-paragraph explanation citing specific recent real-world examples.`,
      config: {
        tools: [{ googleSearch: {} }],
        temperature: 0.7,
      },
    });

    return response.text || "데이터 분석을 사용할 수 없습니다.";
  } catch (error) {
    console.error("Error generating insight:", error);
    return "시스템 오류: 실시간 분석을 검색할 수 없습니다.";
  }
};

export const generateChatResponse = async (artistName: string, topic: string): Promise<string> => {
  if (!API_KEY) throw new Error("Gemini API Key is missing.");

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Act as an expert art curator or AI Analyst. Provide a concise, insightful commentary on "${artistName}" specifically regarding "${topic}".
      
      LANGUAGE: KOREAN (한국어).
      TONE: Conversational yet Professional, like a museum docent.
      LENGTH: 2-3 sentences max.`,
      config: {
        tools: [{ googleSearch: {} }],
        temperature: 0.7,
      },
    });

    return response.text || "분석을 생성할 수 없습니다.";
  } catch (error) {
    console.error("Error generating chat response:", error);
    return "현재 대화 서비스를 이용할 수 없습니다.";
  }
};

export const generateComparativeAnalysis = async (artist1: string, artist2: string, sharedMetric?: string): Promise<AIReportResult> => {
  if (!API_KEY) throw new Error("Gemini API Key is missing.");

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Compare the artists "${artist1}" and "${artist2}". 
      Focus specifically on why they are stylistically or conceptually similar, particularly regarding "${sharedMetric || 'Market Value'}".
      
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
    
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources: GroundingSource[] = groundingChunks
      .filter((chunk: any) => chunk.web)
      .map((chunk: any) => ({
        web: {
          uri: chunk.web?.uri,
          title: chunk.web?.title,
        }
      }));

    return { text, sources };
  } catch (error) {
    console.error("Error generating comparison:", error);
    return { text: "비교 분석 생성 실패.", sources: [] };
  }
};

export const findSimilarArtists = async (targetArtist: string): Promise<Artist[]> => {
  if (!API_KEY) throw new Error("Gemini API Key is missing.");

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Identify 10 artists who share similar stylistic patterns, market trajectories, or conceptual themes with "${targetArtist}". 
      Estimate 0-100 scores for: Market Value, Critical Acclaim, Historical, Social Impact, Institutional.
      Identify the ONE "Shared Metric". Description MUST be in KOREAN (한국어).
      Provide the result as a structured JSON array.
      
      Format:
      [
        { "name": "Name", "nationality": "Country", "birthYear": 1900, "description": "Korean Description", "sharedMetric": "Metric Name", "scores": { "marketValue": 90, ... } }
      ]`,
      config: {
        // No tools needed for pure knowledge generation, which is faster and less error-prone for lists
      }
    });

    let cleanedText = (response.text || "[]").replace(/```json/g, '').replace(/```/g, '').trim();
    
    // Robust Regex Extraction for Array
    const arrayMatch = cleanedText.match(/\[[\s\S]*\]/);
    if (arrayMatch) {
        cleanedText = arrayMatch[0];
    }

    const rawData = JSON.parse(cleanedText);

    return rawData.map((item: any, index: number) => ({
      id: `generated-${index}-${Date.now()}`,
      name: item.name,
      nationality: item.nationality,
      birthYear: item.birthYear || 1900,
      currentRank: 0, 
      description: item.description,
      imageUrl: `https://picsum.photos/seed/${item.name.replace(/\s/g, '')}/800/800?grayscale`,
      sharedMetric: item.sharedMetric,
      trajectory: [], 
      radarData: [
        { axis: 'Market Value', value: item.scores?.marketValue || 50, fullMark: 100 },
        { axis: 'Critical Acclaim', value: item.scores?.criticalAcclaim || 50, fullMark: 100 },
        { axis: 'Historical', value: item.scores?.historical || 50, fullMark: 100 }, { axis: 'Social Impact', value: item.scores?.socialImpact || 50, fullMark: 100 },
        { axis: 'Institutional', value: item.scores?.institutional || 50, fullMark: 100 },
      ]
    }));

  } catch (error) {
    console.error("Error finding similar artists:", error);
    return [];
  }
};

export const generateArtistTimeline = async (artistName: string, birthYear: number): Promise<TimelineData> => {
  if (!API_KEY) throw new Error("Gemini API Key is missing.");

  try {
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
    let cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    // Robust JSON extraction with stricter bounds
    const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
        cleanedText = jsonMatch[0];
    }
    
    // Final cleanup of potential trailing commas
    cleanedText = cleanedText.replace(/,\s*}/g, '}').replace(/,\s*]/g, ']');

    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("Error generating timeline:", error);
    // Return empty timeline on error to prevent crashes
    return { eras: [] };
  }
};

// New Service for Masterpiece Carousel
export const fetchMasterpiecesByMetric = async (artistName: string, metric: string): Promise<Masterpiece[]> => {
  if (!API_KEY) throw new Error("Gemini API Key is missing.");
  
  try {
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
    if (arrayMatch) cleanedText = arrayMatch[0];
    
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("Error fetching masterpieces:", error);
    return [
      { title: "Masterpiece I", year: "N/A", visualPrompt: `Abstract art by ${artistName}` },
      { title: "Masterpiece II", year: "N/A", visualPrompt: `Famous work by ${artistName}` },
      { title: "Masterpiece III", year: "N/A", visualPrompt: `Iconic art by ${artistName}` }
    ];
  }
};

export const generateDetailedTrajectory = async (artist1: string, artist2: string): Promise<ComparativeTrajectory> => {
   if (!API_KEY) throw new Error("Gemini API Key is missing.");

   try {
     const response = await ai.models.generateContent({
       model: 'gemini-2.5-flash',
       contents: `Compare the lifelong trajectory of "${artist1}" vs "${artist2}" across 5 specific metrics:
       Institution, Discourse, Academy, Network, and Total (Average).
       
       Provide data points for granular ages: 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 44, 46, 48, 50, 52, 54, 56, 58, 60, 62, 64, 66, 68, 70, 72, 74, 76, 78, 80.
       Values should be 0-100.
       
       For each data point, provide a short "context" string (Evidence/Reason) in KOREAN.
       
       OUTPUT FORMAT: Strictly valid JSON.
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
         tools: [{ googleSearch: {} }]
       }
     });

     let cleanedText = response.text || "{}";
     cleanedText = cleanedText.replace(/```json/g, '').replace(/```/g, '').trim();
     const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
     if (jsonMatch) cleanedText = jsonMatch[0];

     return JSON.parse(cleanedText);
   } catch (error) {
     console.error("Detailed Trajectory Error", error);
     // Fallback Mock
     const ages = [20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 44, 46, 48, 50, 52, 54, 56, 58, 60, 62, 64, 66, 68, 70, 72, 74, 76, 78, 80];
     return {
       artist1,
       artist2,
       data: ages.map(age => ({
         age,
         a1_total: 50 + Math.random() * 40, a1_institution: 50 + Math.random()*40, a1_discourse: 50, a1_academy: 50, a1_network: 50, a1_context: "Data unavailable",
         a2_total: 50 + Math.random() * 40, a2_institution: 50 + Math.random()*40, a2_discourse: 50, a2_academy: 50, a2_network: 50, a2_context: "Data unavailable"
       }))
     };
   }
};
