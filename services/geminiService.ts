import { AIReportResult, TimelineData, DashboardData, Masterpiece, ComparativeTrajectory } from '../types';
import { getCached, setCached } from './cacheService';
import { deduplicateRequest } from './requestDeduplication';
import {
  loadArtistTimeline,
  loadComparison,
  loadArtistMasterpieces,
  convertComparisonToChartData,
  convertTimelineToJourneyData,
  isPreloadedArtist,
} from './preloadedDataService';

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
      
      // 1. 사전 주입 데이터 최우선 확인 (Firestore 캐시보다 먼저)
      try {
        const preloadedTimeline = await loadArtistTimeline(artistName);
        if (preloadedTimeline) {
          console.log('✓ Using preloaded timeline for', artistName);
          const converted = convertTimelineToJourneyData(preloadedTimeline);
          // Preloaded 데이터는 캐시하지 않음 (이미 정적 파일)
          return converted as TimelineData;
        }
      } catch (error) {
        console.warn('Failed to load preloaded timeline:', error);
        // Preloaded 실패 시에만 다음 단계로 진행
      }
      
      // 2. Firestore 캐시 확인 (preloaded 데이터가 없을 때만)
      const cached = await getCached<TimelineData>('timeline', cacheKey);
      if (cached) {
        console.log('Using cached timeline for', artistName);
        return cached;
      }

      // 3. AI 호출 (preloaded와 캐시 모두 없을 때만)
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
      
      // 1. 사전 주입 데이터 우선 확인
      try {
        const preloadedMasterpieces = await loadArtistMasterpieces(artistName);
        if (preloadedMasterpieces && preloadedMasterpieces.length > 0) {
          console.log('Using preloaded masterpieces for', artistName);
          // PreloadedMasterpiece를 Masterpiece 형식으로 변환
          return preloadedMasterpieces.map(mp => ({
            id: mp.id,
            title: mp.titleKo || mp.title,
            year: mp.year,
            imageUrl: mp.imageUrl,
            description: mp.significance,
            medium: mp.medium,
            dimensions: mp.dimensions,
            collection: mp.collection?.museum,
            _source: 'preloaded'
          })) as Masterpiece[];
        }
      } catch (error) {
        console.warn('Failed to load preloaded masterpieces:', error);
      }
      
      // 2. Firestore 캐시 확인
      const cached = await getCached<Masterpiece[]>('masterpieces', cacheKey);
      if (cached) {
        console.log('Using cached masterpieces for', artistName, metric);
        return cached;
      }

      // 3. AI 호출
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
  // Normalize cache key (sort artist names for consistency)
  const normalizedArtists = [artist1, artist2].sort();
  const cacheKeyBase = `trajectory:${normalizedArtists[0]}:${normalizedArtists[1]}`;
  
  return deduplicateRequest(
    cacheKeyBase,
    async () => {
      // 1. 사전 주입 데이터 최우선 확인
      try {
        const preloadedComparison = await loadComparison(artist1, artist2);
        if (preloadedComparison && preloadedComparison.trajectoryData.length > 0) {
          console.log('✓ Using preloaded trajectory for', artist1, artist2);
          // 프론트엔드 형식으로 변환
          const chartData = preloadedComparison.trajectoryData.map(point => ({
            age: point.age,
            a1_total: point.a1_total,
            a1_institution: point.a1_institution,
            a1_discourse: point.a1_discourse,
            a1_academy: point.a1_academy,
            a1_network: point.a1_network,
            a1_context: point.a1_context,
            a2_total: point.a2_total,
            a2_institution: point.a2_institution,
            a2_discourse: point.a2_discourse,
            a2_academy: point.a2_academy,
            a2_network: point.a2_network,
            a2_context: point.a2_context,
          }));
          
          return {
            artist1: preloadedComparison.artist1Name,
            artist2: preloadedComparison.artist2Name,
            data: chartData,
            _source: 'preloaded'
          } as ComparativeTrajectory;
        }
      } catch (error) {
        console.warn('Failed to load preloaded trajectory:', error);
      }
      
      // 2. Firestore 캐시 확인 (preloaded 데이터가 없을 때만)
      const cached = await getCached<ComparativeTrajectory>('trajectory', cacheKeyBase);
      if (cached && !cached.error && cached.data && Array.isArray(cached.data) && cached.data.length > 0) {
        console.log('Using cached trajectory for', artist1, artist2);
        return cached;
      }

      // 3. AI 호출
      const response = await fetch(
        `${FUNCTIONS_URL}/getDetailedTrajectory?artist1=${encodeURIComponent(artist1)}&artist2=${encodeURIComponent(artist2)}`
      );
      
      const data = await response.json();
      
      // Don't cache fallback/error data
      if (!response.ok) {
        if (data.data && Array.isArray(data.data) && data.error) {
          console.warn('Received fallback data, not caching:', data.error);
          // Return fallback data but don't cache it
          return data;
        }
        throw new Error(`Failed to generate trajectory: ${response.statusText}`);
      }
      
      // Only cache valid data without error field
      if (data.data && Array.isArray(data.data) && data.data.length > 0 && !data.error) {
        await setCached('trajectory', cacheKeyBase, data);
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
