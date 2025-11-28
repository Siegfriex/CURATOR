import { AIReportResult, TimelineData, DashboardData, Masterpiece, ComparativeTrajectory } from '../types';
import { getCached, setCached } from './cacheService';
import { deduplicateRequest } from './requestDeduplication';

const FUNCTIONS_URL = import.meta.env.VITE_FUNCTIONS_URL || 'https://us-central1-curatorproto.cloudfunctions.net';

export const fetchArtistDashboardData = async (artistName: string): Promise<DashboardData> => {
  return deduplicateRequest(
    `dashboard:${artistName}`,
    async () => {
      const cacheKey = `dashboard:${artistName}`;
      const cached = await getCached<DashboardData>('dashboard', cacheKey);
      if (cached) {
        console.log('Using cached dashboard data for', artistName);
        return cached;
      }

      const response = await fetch(
        `${FUNCTIONS_URL}/getDashboardData?artistName=${encodeURIComponent(artistName)}`
      );
      
      if (!response.ok) {
        throw new Error(`Failed to fetch dashboard data: ${response.statusText}`);
      }
      
      const data = await response.json();
      await setCached('dashboard', cacheKey, data);
      return data;
    }
  );
};

export const generateArtistReport = async (artistName: string): Promise<AIReportResult> => {
  return deduplicateRequest(
    `report:${artistName}`,
    async () => {
      const cacheKey = `report:${artistName}`;
      const cached = await getCached<AIReportResult>('report', cacheKey);
      if (cached) {
        console.log('Using cached report for', artistName);
        return cached;
      }

      const response = await fetch(
        `${FUNCTIONS_URL}/getArtistReport?artistName=${encodeURIComponent(artistName)}`
      );
      
      if (!response.ok) {
        throw new Error(`Failed to generate report: ${response.statusText}`);
      }
      
      const data = await response.json();
      await setCached('report', cacheKey, data);
      return data;
    }
  );
};

export const generateArtistTimeline = async (artistName: string, birthYear: number): Promise<TimelineData> => {
  return deduplicateRequest(
    `timeline:${artistName}:${birthYear}`,
    async () => {
      const cacheKey = `timeline:${artistName}:${birthYear}`;
      const cached = await getCached<TimelineData>('timeline', cacheKey);
      if (cached) {
        console.log('Using cached timeline for', artistName);
        return cached;
      }

      const response = await fetch(
        `${FUNCTIONS_URL}/getArtistTimeline?artistName=${encodeURIComponent(artistName)}&birthYear=${birthYear}`
      );
      
      if (!response.ok) {
        throw new Error(`Failed to generate timeline: ${response.statusText}`);
      }
      
      const data = await response.json();
      await setCached('timeline', cacheKey, data);
      return data;
    }
  );
};

export const generateMetricInsight = async (artistName: string, metric: string, score: number): Promise<string> => {
  return deduplicateRequest(
    `insight:${artistName}:${metric}:${score}`,
    async () => {
      const cacheKey = `insight:${artistName}:${metric}:${score}`;
      const cached = await getCached<string>('insight', cacheKey);
      if (cached) {
        console.log('Using cached insight for', artistName, metric);
        return cached;
      }

      const response = await fetch(
        `${FUNCTIONS_URL}/getMetricInsight?artistName=${encodeURIComponent(artistName)}&metric=${encodeURIComponent(metric)}&score=${score}`
      );
      
      if (!response.ok) {
        throw new Error(`Failed to generate insight: ${response.statusText}`);
      }
      
      const data = await response.json();
      const text = data.text || "데이터 분석을 사용할 수 없습니다.";
      await setCached('insight', cacheKey, text);
      return text;
    }
  );
};

export const fetchMasterpiecesByMetric = async (artistName: string, metric: string): Promise<Masterpiece[]> => {
  return deduplicateRequest(
    `masterpieces:${artistName}:${metric}`,
    async () => {
      const cacheKey = `masterpieces:${artistName}:${metric}`;
      const cached = await getCached<Masterpiece[]>('masterpieces', cacheKey);
      if (cached) {
        console.log('Using cached masterpieces for', artistName, metric);
        return cached;
      }

      const response = await fetch(
        `${FUNCTIONS_URL}/getMasterpieces?artistName=${encodeURIComponent(artistName)}&metric=${encodeURIComponent(metric)}`
      );
      
      if (!response.ok) {
        throw new Error(`Failed to fetch masterpieces: ${response.statusText}`);
      }
      
      const data = await response.json();
      const result = Array.isArray(data) ? data : (data.result || []);
      await setCached('masterpieces', cacheKey, result);
      return result;
    }
  );
};

export const generateComparativeAnalysis = async (artist1: string, artist2: string, sharedMetric?: string): Promise<AIReportResult> => {
  return deduplicateRequest(
    `comparison:${artist1}:${artist2}:${sharedMetric || 'default'}`,
    async () => {
      const cacheKey = `comparison:${artist1}:${artist2}:${sharedMetric || 'default'}`;
      const cached = await getCached<AIReportResult>('comparison', cacheKey);
      if (cached) {
        console.log('Using cached comparison for', artist1, artist2);
        return cached;
      }

      const url = `${FUNCTIONS_URL}/getComparativeAnalysis?artist1=${encodeURIComponent(artist1)}&artist2=${encodeURIComponent(artist2)}${sharedMetric ? `&sharedMetric=${encodeURIComponent(sharedMetric)}` : ''}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Failed to generate comparison: ${response.statusText}`);
      }
      
      const data = await response.json();
      await setCached('comparison', cacheKey, data);
      return data;
    }
  );
};

export const generateDetailedTrajectory = async (artist1: string, artist2: string): Promise<ComparativeTrajectory> => {
  return deduplicateRequest(
    `trajectory:${artist1}:${artist2}`,
    async () => {
      const cacheKey = `trajectory:${artist1}:${artist2}`;
      const cached = await getCached<ComparativeTrajectory>('trajectory', cacheKey);
      if (cached) {
        console.log('Using cached trajectory for', artist1, artist2);
        return cached;
      }

      const response = await fetch(
        `${FUNCTIONS_URL}/getDetailedTrajectory?artist1=${encodeURIComponent(artist1)}&artist2=${encodeURIComponent(artist2)}`
      );
      
      const data = await response.json();
      
      // Even if response is not ok, check if fallback data exists
      if (!response.ok && (!data.data || !Array.isArray(data.data))) {
        throw new Error(`Failed to generate trajectory: ${response.statusText}`);
      }
      
      // Use data even if it's a fallback (has error field)
      if (data.data && Array.isArray(data.data)) {
        await setCached('trajectory', cacheKey, data);
        return data;
      }
      
      throw new Error(`Invalid trajectory data received`);
    }
  );
};

export const generateEventImage = async (prompt: string): Promise<string | null> => {
  return deduplicateRequest(
    `image:${prompt}`,
    async () => {
      const cacheKey = `image:${prompt}`;
      const cached = await getCached<string>('images', cacheKey);
      if (cached) {
        console.log('Using cached image for', prompt);
        return cached;
      }

      const response = await fetch(
        `${FUNCTIONS_URL}/getArtistImage?prompt=${encodeURIComponent(prompt)}`
      );
      
      if (!response.ok) {
        // Fallback to placeholder
        const seed = prompt.split("").reduce((a, b) => {
          a = ((a << 5) - a) + b.charCodeAt(0);
          return a & a;
        }, 0);
        return `https://picsum.photos/seed/${Math.abs(seed)}/800/600?grayscale`;
      }
      
      const data = await response.json();
      const url = data.url || null;
      if (url) {
        await setCached('images', cacheKey, url);
      }
      return url;
    }
  );
};

export const generateChatResponse = async (artistName: string, topic: string): Promise<string> => {
  // Chat responses are not cached as they are conversational
  const response = await fetch(
    `${FUNCTIONS_URL}/getChatResponse?artistName=${encodeURIComponent(artistName)}&topic=${encodeURIComponent(topic)}`
  );
  
  if (!response.ok) {
    return "현재 대화 서비스를 이용할 수 없습니다.";
  }
  
  const data = await response.json();
  return data.text || "분석을 생성할 수 없습니다.";
};

export const findSimilarArtists = async (targetArtist: string): Promise<any[]> => {
  // This function is not used in current codebase, keeping for compatibility
  return [];
};
