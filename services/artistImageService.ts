import { getCached, setCached } from './cacheService';

const FUNCTIONS_URL = import.meta.env.VITE_FUNCTIONS_URL || 'https://us-central1-curatorproto.cloudfunctions.net';

/**
 * Fetch real artist image from Functions
 * Uses caching to avoid repeated API calls
 */
export async function fetchArtistImage(artistName: string): Promise<string> {
  const cacheKey = `artist_image:${artistName}`;
  
  // Check cache first
  const cached = await getCached<string>('images', cacheKey);
  if (cached) {
    return cached;
  }

  try {
    // Call Functions to get real artist image
    const response = await fetch(
      `${FUNCTIONS_URL}/getDashboardData?artistName=${encodeURIComponent(artistName)}`
    );
    
    if (response.ok) {
      const data = await response.json();
      if (data.imageUrl) {
        // Cache the image URL
        await setCached('images', cacheKey, data.imageUrl);
        return data.imageUrl;
      }
    }
  } catch (error) {
    console.error(`Error fetching artist image for ${artistName}:`, error);
  }

  // Fallback to placeholder
  const fallbackUrl = `https://picsum.photos/seed/${artistName}/800/800?grayscale`;
  return fallbackUrl;
}

