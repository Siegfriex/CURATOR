import { Artist } from '../types';
import { getCached, setCached } from './cacheService';
import { deduplicateRequest } from './requestDeduplication';

const FUNCTIONS_URL = import.meta.env.VITE_FUNCTIONS_URL || 'https://us-central1-curatorproto.cloudfunctions.net';

/**
 * Fetch artist list dynamically
 * Uses AI to generate artist recommendations based on context
 */
export async function fetchArtistList(
  offset: number = 0,
  limit: number = 20,
  context?: string
): Promise<Artist[]> {
  return deduplicateRequest(
    `artist_list:${offset}:${limit}:${context || 'all'}`,
    async () => {
      const cacheKey = `artist_list:${offset}:${limit}:${context || 'all'}`;
      
      // Check cache first
      const cached = await getCached<Artist[]>('artists', cacheKey);
      if (cached) {
        console.log(`Using cached artist list: offset=${offset}, limit=${limit}`);
        return cached;
      }

      try {
        const response = await fetch(
          `${FUNCTIONS_URL}/getArtistList?offset=${offset}&limit=${limit}${context ? `&context=${encodeURIComponent(context)}` : ''}`
        );
        
        if (!response.ok) {
          throw new Error(`Failed to fetch artist list: ${response.statusText}`);
        }
        
        const data = await response.json();
        const artists = data.artists || [];
        
        // Cache the result
        await setCached('artists', cacheKey, artists);
        return artists;
      } catch (error) {
        console.error('Error fetching artist list:', error);
        return [];
      }
    }
  );
}

