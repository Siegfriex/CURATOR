"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatSearchResultsAsContext = exports.performGoogleSearch = void 0;
const logger = require("firebase-functions/logger");
const cache_1 = require("./cache");
/**
 * Recommended art-related sites for Google Custom Search Engine:
 *
 * 1. Art News & Criticism:
 *    - artnet.com
 *    - artsy.net
 *    - artforum.com
 *    - theartnewspaper.com
 *    - hyperallergic.com
 *
 * 2. Museums & Institutions:
 *    - moma.org
 *    - tate.org.uk
 *    - guggenheim.org
 *    - metmuseum.org
 *    - whitney.org
 *    - saatchigallery.com
 *
 * 3. Auction Houses:
 *    - christies.com
 *    - sothebys.com
 *    - phillips.com
 *
 * 4. Artist Databases & Archives:
 *    - artcyclopedia.com
 *    - wikiart.org
 *    - mutualart.com
 *
 * 5. Academic & Reference:
 *    - wikipedia.org (en.wikipedia.org/wiki/*)
 *    - britannica.com
 *    - oxfordartonline.com
 *
 * Setup Instructions:
 * 1. Go to https://programmablesearchengine.google.com/
 * 2. Create a new search engine
 * 3. Add sites: site:artnet.com OR site:artsy.net OR site:artforum.com OR site:moma.org OR site:tate.org.uk OR site:christies.com OR site:sothebys.com OR site:wikipedia.org
 * 4. Or use wildcard: * (searches entire web, but less focused)
 */
// Google Custom Search API helper
// Requires: GOOGLE_CSE_API_KEY and GOOGLE_CSE_ID environment variables
async function performGoogleSearch(query, apiKey, searchEngineId, numResults = 5, siteRestriction // Optional: restrict to specific site (e.g., "artnet.com")
) {
    try {
        // Check cache first
        const cacheKey = `search:${query}:${siteRestriction || 'all'}`;
        const cached = await (0, cache_1.getCached)("search", cacheKey);
        if (cached) {
            logger.info(`Search cache hit for: ${query}`);
            return cached;
        }
        // Build query with optional site restriction
        let searchQuery = query;
        if (siteRestriction) {
            searchQuery = `site:${siteRestriction} ${query}`;
        }
        const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${searchEngineId}&q=${encodeURIComponent(searchQuery)}&num=${numResults}`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Google Search API error: ${response.status}`);
        }
        const data = await response.json();
        const results = (data.items || []).map((item) => ({
            title: item.title || "",
            snippet: item.snippet || "",
            link: item.link || ""
        }));
        // Cache search results for 24 hours
        await (0, cache_1.setCached)("search", cacheKey, results);
        logger.info(`Google Search completed: ${results.length} results for "${query}"`);
        return results;
    }
    catch (error) {
        logger.error("Google Search error:", error);
        return []; // Return empty array on error
    }
}
exports.performGoogleSearch = performGoogleSearch;
// Format search results as context for Gemini
function formatSearchResultsAsContext(results) {
    if (results.length === 0) {
        return "";
    }
    return `\n\nRecent web search results for context:\n${results
        .map((r, i) => `${i + 1}. ${r.title}\n   ${r.snippet}\n   Source: ${r.link}`)
        .join("\n\n")}`;
}
exports.formatSearchResultsAsContext = formatSearchResultsAsContext;
//# sourceMappingURL=googleSearch.js.map