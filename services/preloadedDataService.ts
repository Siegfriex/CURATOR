/**
 * Preloaded Data Service
 * 
 * 사전 주입된 작가 데이터를 로드하고 관리하는 서비스입니다.
 * AI 호출 없이 즉시 데이터를 제공하여 로딩 시간을 제거합니다.
 * 
 * @version 1.0.0
 * @lastUpdated 2025-12-03
 */

import type {
  PreloadedDataIndex,
  PreloadedArtistTrajectory,
  PreloadedTimeline,
  PreloadedMasterpiece,
  PreloadedComparison,
  ArtistIndexEntry,
} from '../types/PreloadedData';
import { normalizeArtistName, createComparisonKey } from '../types/PreloadedData';

// ============================================
// Cache Management
// ============================================

interface DataCache {
  index: PreloadedDataIndex | null;
  trajectories: Map<string, PreloadedArtistTrajectory>;
  timelines: Map<string, PreloadedTimeline>;
  comparisons: Map<string, PreloadedComparison>;
  lastUpdated: number;
}

const cache: DataCache = {
  index: null,
  trajectories: new Map(),
  timelines: new Map(),
  comparisons: new Map(),
  lastUpdated: 0,
};

// Cache TTL: 1 hour (데이터가 정적이므로 길게 설정)
const CACHE_TTL = 60 * 60 * 1000;

// ============================================
// Index Loading
// ============================================

/**
 * 사전 주입 데이터 인덱스 로드
 */
export async function loadPreloadedIndex(): Promise<PreloadedDataIndex | null> {
  // 캐시 확인
  if (cache.index && Date.now() - cache.lastUpdated < CACHE_TTL) {
    return cache.index;
  }

  try {
    const response = await fetch('/data/preloaded/index.json');
    if (!response.ok) {
      console.warn('Failed to load preloaded index');
      return null;
    }
    
    cache.index = await response.json();
    cache.lastUpdated = Date.now();
    return cache.index;
  } catch (error) {
    console.warn('Error loading preloaded index:', error);
    return null;
  }
}

/**
 * 작가 목록에서 특정 작가 찾기
 */
export async function findArtistInIndex(artistName: string): Promise<ArtistIndexEntry | null> {
  const index = await loadPreloadedIndex();
  if (!index) return null;

  const normalized = normalizeArtistName(artistName);
  return index.artists.find(a => a.normalizedName === normalized) || null;
}

/**
 * 사전 주입된 작가인지 확인
 */
export async function isPreloadedArtist(artistName: string): Promise<boolean> {
  const artist = await findArtistInIndex(artistName);
  return artist !== null;
}

// ============================================
// Trajectory Data Loading
// ============================================

/**
 * 작가의 궤적(Trajectory) 데이터 로드
 */
export async function loadArtistTrajectory(
  artistName: string
): Promise<PreloadedArtistTrajectory | null> {
  const normalized = normalizeArtistName(artistName);
  
  // 캐시 확인
  if (cache.trajectories.has(normalized)) {
    return cache.trajectories.get(normalized)!;
  }

  // 인덱스에서 작가 확인
  const artist = await findArtistInIndex(artistName);
  if (!artist || !artist.hasTrajectory) {
    return null;
  }

  try {
    const response = await fetch(`/data/preloaded/trajectories/${normalized}.json`);
    if (!response.ok) {
      console.warn(`Failed to load trajectory for ${artistName}`);
      return null;
    }
    
    const data: PreloadedArtistTrajectory = await response.json();
    cache.trajectories.set(normalized, data);
    return data;
  } catch (error) {
    console.warn(`Error loading trajectory for ${artistName}:`, error);
    return null;
  }
}

// ============================================
// Timeline Data Loading
// ============================================

/**
 * 작가의 타임라인 데이터 로드
 */
export async function loadArtistTimeline(
  artistName: string
): Promise<PreloadedTimeline | null> {
  const normalized = normalizeArtistName(artistName);
  console.log(`[PreloadedData] Loading timeline for: ${artistName} (normalized: ${normalized})`);
  
  // 캐시 확인
  if (cache.timelines.has(normalized)) {
    console.log(`[PreloadedData] Timeline cache hit for: ${artistName}`);
    return cache.timelines.get(normalized)!;
  }

  // 인덱스에서 작가 확인
  const artist = await findArtistInIndex(artistName);
  if (!artist) {
    console.warn(`[PreloadedData] Artist not found in index: ${artistName}`);
    return null;
  }
  if (!artist.hasTimeline) {
    console.warn(`[PreloadedData] Artist has no timeline data: ${artistName}`);
    return null;
  }

  try {
    const url = `/data/preloaded/timelines/${normalized}.json`;
    console.log(`[PreloadedData] Fetching timeline from: ${url}`);
    const response = await fetch(url);
    
    if (!response.ok) {
      console.warn(`[PreloadedData] Failed to load timeline for ${artistName}: HTTP ${response.status}`);
      return null;
    }
    
    const data: PreloadedTimeline = await response.json();
    cache.timelines.set(normalized, data);
    console.log(`[PreloadedData] ✓ Timeline loaded successfully for: ${artistName}`);
    return data;
  } catch (error) {
    console.error(`[PreloadedData] Error loading timeline for ${artistName}:`, error);
    return null;
  }
}

/**
 * 작가의 대표작 목록 로드 (타임라인에서 추출)
 */
export async function loadArtistMasterpieces(
  artistName: string
): Promise<PreloadedMasterpiece[] | null> {
  const timeline = await loadArtistTimeline(artistName);
  if (!timeline) return null;
  
  return timeline.masterpieces || [];
}

// ============================================
// Comparison Data Loading
// ============================================

/**
 * 두 작가의 비교 데이터 로드
 */
export async function loadComparison(
  artist1: string,
  artist2: string
): Promise<PreloadedComparison | null> {
  const comparisonKey = createComparisonKey(artist1, artist2);
  console.log(`[PreloadedData] Loading comparison: ${artist1} vs ${artist2} (key: ${comparisonKey})`);
  
  // 캐시 확인
  if (cache.comparisons.has(comparisonKey)) {
    console.log(`[PreloadedData] Comparison cache hit`);
    return cache.comparisons.get(comparisonKey)!;
  }

  // 두 작가 모두 사전 주입 데이터 확인
  const [a1, a2] = await Promise.all([
    findArtistInIndex(artist1),
    findArtistInIndex(artist2)
  ]);

  if (!a1 || !a2) {
    console.warn(`[PreloadedData] One or both artists not found in index: ${artist1}, ${artist2}`);
    return null;
  }

  try {
    // 파일명: 정렬된 두 작가 이름
    const fileName = comparisonKey.replace(':', '_');
    const url = `/data/preloaded/comparisons/${fileName}.json`;
    console.log(`[PreloadedData] Fetching comparison from: ${url}`);
    const response = await fetch(url);
    
    if (!response.ok) {
      console.log(`[PreloadedData] Comparison file not found, generating from trajectories`);
      // 비교 데이터 파일이 없으면 두 궤적에서 생성
      return await generateComparisonFromTrajectories(artist1, artist2);
    }
    
    const data: PreloadedComparison = await response.json();
    cache.comparisons.set(comparisonKey, data);
    console.log(`[PreloadedData] ✓ Comparison loaded successfully`);
    return data;
  } catch (error) {
    console.error(`[PreloadedData] Error loading comparison:`, error);
    // 파일 로드 실패 시 궤적에서 생성 시도
    return await generateComparisonFromTrajectories(artist1, artist2);
  }
}

/**
 * 두 작가의 궤적 데이터를 병합하여 비교 데이터 생성
 */
async function generateComparisonFromTrajectories(
  artist1: string,
  artist2: string
): Promise<PreloadedComparison | null> {
  const [traj1, traj2] = await Promise.all([
    loadArtistTrajectory(artist1),
    loadArtistTrajectory(artist2)
  ]);

  if (!traj1 || !traj2) {
    return null;
  }

  // 두 궤적 데이터 병합
  const comparisonData = traj1.data.map((point1, index) => {
    const point2 = traj2.data[index] || {
      total: 0, institution: 0, discourse: 0, academy: 0, network: 0
    };

    return {
      age: point1.age,
      a1_total: point1.total,
      a1_institution: point1.institution,
      a1_discourse: point1.discourse,
      a1_academy: point1.academy,
      a1_network: point1.network,
      a1_context: point1.context,
      a2_total: point2.total,
      a2_institution: point2.institution,
      a2_discourse: point2.discourse,
      a2_academy: point2.academy,
      a2_network: point2.network,
      a2_context: point2.context,
    };
  });

  // 가장 유사한 메트릭 찾기
  const metrics = ['total', 'institution', 'discourse', 'academy', 'network'];
  let minDiff = Infinity;
  let sharedMetric = 'total';

  for (const metric of metrics) {
    const diff = comparisonData.reduce((sum, point) => {
      const key1 = `a1_${metric}` as keyof typeof point;
      const key2 = `a2_${metric}` as keyof typeof point;
      return sum + Math.abs((point[key1] as number) - (point[key2] as number));
    }, 0);

    if (diff < minDiff) {
      minDiff = diff;
      sharedMetric = metric;
    }
  }

  const comparison: PreloadedComparison = {
    comparisonId: createComparisonKey(artist1, artist2),
    artist1Id: traj1.artistId,
    artist1Name: traj1.artistName,
    artist2Id: traj2.artistId,
    artist2Name: traj2.artistName,
    analysisText: `${traj1.artistName}과(와) ${traj2.artistName}의 비교 분석입니다. 두 작가는 ${sharedMetric} 지표에서 가장 유사한 패턴을 보입니다.`,
    sharedMetric,
    trajectoryData: comparisonData,
    sources: [],
    metadata: {
      version: '1.0.0',
      lastUpdated: new Date().toISOString().split('T')[0],
      primarySources: [],
      verificationStatus: 'ai_generated'
    }
  };

  // 캐시에 저장
  cache.comparisons.set(comparison.comparisonId, comparison);
  return comparison;
}

// ============================================
// Data Conversion Utilities
// ============================================

/**
 * 사전 주입 궤적 데이터를 프론트엔드 형식으로 변환
 */
export function convertTrajectoryToChartData(
  trajectory: PreloadedArtistTrajectory,
  metric: 'total' | 'institution' | 'discourse' | 'academy' | 'network' = 'total'
): { age: number; value: number; context?: string }[] {
  return trajectory.data.map(point => ({
    age: point.age,
    value: point[metric],
    context: point.context,
  }));
}

/**
 * 비교 궤적 데이터를 DualAreaChart 형식으로 변환
 */
export function convertComparisonToChartData(
  comparison: PreloadedComparison,
  metric: 'total' | 'institution' | 'discourse' | 'academy' | 'network' = 'total'
): { age: number; a1_value: number; a2_value: number; a1_context?: string; a2_context?: string }[] {
  const key1 = `a1_${metric}` as keyof typeof comparison.trajectoryData[0];
  const key2 = `a2_${metric}` as keyof typeof comparison.trajectoryData[0];

  return comparison.trajectoryData.map(point => ({
    age: point.age,
    a1_value: point[key1] as number,
    a2_value: point[key2] as number,
    a1_context: point.a1_context,
    a2_context: point.a2_context,
  }));
}

/**
 * 타임라인 데이터를 TimelineJourney 형식으로 변환
 */
export function convertTimelineToJourneyData(timeline: PreloadedTimeline) {
  return {
    eras: timeline.eras.map(era => ({
      eraLabel: era.eraLabel,
      ageRange: era.ageRange,
      events: era.events.map(event => ({
        year: event.year,
        title: event.title,
        category: event.category,
        description: event.description,
        impactScore: event.impactScore,
        auctionHigh: event.auctionHigh,
        auctionLow: event.auctionLow,
        context: event.context,
        imageUrl: event.imageUrl,
        visualPrompt: event.visualPrompt,
      })),
      moodColor: era.moodColor,
      summary: era.summary,
    })),
    critiques: timeline.critiques,
    masterpieces: timeline.masterpieces.map(mp => ({
      id: mp.id,
      title: mp.titleKo,
      year: mp.year,
      imageUrl: mp.imageUrl,
      description: mp.significance,
    })),
  };
}

// ============================================
// Cache Management
// ============================================

/**
 * 캐시 초기화
 */
export function clearPreloadedCache(): void {
  cache.index = null;
  cache.trajectories.clear();
  cache.timelines.clear();
  cache.comparisons.clear();
  cache.lastUpdated = 0;
}

/**
 * 캐시 상태 확인
 */
export function getCacheStats() {
  return {
    hasIndex: cache.index !== null,
    trajectoriesCount: cache.trajectories.size,
    timelinesCount: cache.timelines.size,
    comparisonsCount: cache.comparisons.size,
    lastUpdated: cache.lastUpdated,
  };
}

