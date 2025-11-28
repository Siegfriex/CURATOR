import * as logger from "firebase-functions/logger";
import { getCached, setCached } from "./cache";

/**
 * Search for real artist images using Google Custom Search API (Image Search)
 * and Wikipedia API
 */

// Google Custom Search Image Search
export async function searchArtistImage(
  artistName: string,
  apiKey: string,
  searchEngineId: string
): Promise<string | null> {
  try {
    // Check cache first
    const cacheKey = `artist_image:${artistName}`;
    const cached = await getCached<string>("images", cacheKey);
    if (cached) {
      logger.info(`Artist image cache hit: ${artistName}`);
      return cached;
    }

    // Try Wikipedia first (free, reliable)
    const wikipediaImage = await getWikipediaImage(artistName);
    if (wikipediaImage) {
      await setCached("images", cacheKey, wikipediaImage);
      return wikipediaImage;
    }

    // Fallback to Google Custom Search Image API
    const googleImage = await searchGoogleImage(artistName, apiKey, searchEngineId);
    if (googleImage) {
      await setCached("images", cacheKey, googleImage);
      return googleImage;
    }

    return null;
  } catch (error: any) {
    logger.error(`Error searching artist image for ${artistName}:`, error);
    return null;
  }
}

// Search for artwork images
export async function searchArtworkImage(
  artworkTitle: string,
  artistName: string,
  apiKey: string,
  searchEngineId: string
): Promise<string | null> {
  try {
    const cacheKey = `artwork_image:${artistName}:${artworkTitle}`;
    const cached = await getCached<string>("images", cacheKey);
    if (cached) {
      logger.info(`Artwork image cache hit: ${artworkTitle}`);
      return cached;
    }

    // Search Google Images for artwork
    const query = `${artistName} "${artworkTitle}" artwork painting`;
    const imageUrl = await searchGoogleImage(query, apiKey, searchEngineId);
    
    if (imageUrl) {
      await setCached("images", cacheKey, imageUrl);
      return imageUrl;
    }

    return null;
  } catch (error: any) {
    logger.error(`Error searching artwork image:`, error);
    return null;
  }
}

// Get image from Wikipedia API (free, no API key needed)
async function getWikipediaImage(artistName: string): Promise<string | null> {
  try {
    // Search Wikipedia for the artist
    const searchUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(artistName)}`;
    const response = await fetch(searchUrl);
    
    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    
    // Check if there's a thumbnail image
    if (data.thumbnail && data.thumbnail.source) {
      // Use higher resolution image if available
      const imageUrl = data.thumbnail.source.replace(/\/\d+px-/, '/800px-');
      logger.info(`Found Wikipedia image for ${artistName}`);
      return imageUrl;
    }

    // Try to get full page image
    if (data.originalimage && data.originalimage.source) {
      return data.originalimage.source;
    }

    return null;
  } catch (error: any) {
    logger.warn(`Wikipedia image search failed for ${artistName}:`, error.message);
    return null;
  }
}

// Search Google Custom Search API for images
async function searchGoogleImage(
  query: string,
  apiKey: string,
  searchEngineId: string
): Promise<string | null> {
  try {
    // Use Google Custom Search API with searchType=image
    const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${searchEngineId}&q=${encodeURIComponent(query)}&searchType=image&num=1&safe=active`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Google Image Search API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.items && data.items.length > 0) {
      const imageUrl = data.items[0].link;
      logger.info(`Found Google image for query: ${query}`);
      return imageUrl;
    }

    return null;
  } catch (error: any) {
    logger.warn(`Google Image Search failed:`, error.message);
    return null;
  }
}

