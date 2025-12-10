import { GameResult, GameMetrics, AxisData, Artist } from '../types';
import { MOCK_ARTISTS } from '../constants';

/**
 * 27명 작가 목록 (AI 프롬프트 및 폴백용)
 */
export const ARTIST_LIST = [
  "Henri Matisse", "Damien Hirst", "Jean-Michel Basquiat",
  "Egon Schiele", "Nam June Paik", "Cindy Sherman",
  "Jackson Pollock", "Mark Rothko", "Frida Kahlo",
  "Andy Warhol", "Lee Ufan", "Louise Bourgeois",
  "David Hockney", "Do Ho Suh", "Ai Weiwei",
  "Jeff Koons", "Kim Tschang-yeul", "Yayoi Kusama",
  "Roy Lichtenstein", "Caravaggio", "Eva Hesse",
  "Ricardo Bofill", "Haegue Yang", "Gerhard Richter",
  "Edvard Munch", "Alberto Giacometti", "Marina Abramović"
];

/**
 * 게임 Metrics를 웹 RadarData 형식으로 변환
 */
export function convertGameMetricsToRadarData(gameMetrics: GameMetrics): AxisData[] {
  return [
    { axis: 'Institutional', value: Math.max(0, Math.min(100, gameMetrics.inst)), fullMark: 100 },
    { axis: 'Market Value', value: Math.max(0, Math.min(100, gameMetrics.net)), fullMark: 100 },
    { axis: 'Critical Acclaim', value: Math.max(0, Math.min(100, gameMetrics.acad)), fullMark: 100 },
    { axis: 'Historical', value: Math.max(0, Math.min(100, gameMetrics.hist)), fullMark: 100 },
    { axis: 'Social Impact', value: Math.max(0, Math.min(100, gameMetrics.disc)), fullMark: 100 },
  ];
}

/**
 * 작가 이름으로 ID 찾기 (정규화 처리 포함)
 */
export function findArtistIdByName(artistName: string): string | null {
  if (!artistName) return null;

  const normalized = artistName.trim().toLowerCase();

  // 정확한 매칭 시도
  const exactMatch = MOCK_ARTISTS.find(
    a => a.name.toLowerCase() === normalized
  );
  if (exactMatch) return exactMatch.id;

  // 부분 매칭 시도 (이름이 포함된 경우)
  const partialMatch = MOCK_ARTISTS.find(
    a => a.name.toLowerCase().includes(normalized) ||
         normalized.includes(a.name.toLowerCase())
  );
  if (partialMatch) return partialMatch.id;

  return null;
}

/**
 * 작가 ID로 작가 찾기
 */
export function findArtistById(artistId: string): Artist | null {
  return MOCK_ARTISTS.find(a => a.id === artistId) || null;
}

/**
 * Metrics 기반으로 가장 유사한 작가 찾기 (유클리드 거리)
 */
export function findMostSimilarArtist(gameMetrics: GameMetrics): Artist {
  let minDistance = Infinity;
  let mostSimilar = MOCK_ARTISTS[0];

  // Metrics 매핑
  const metricMapping: Record<keyof GameMetrics, string> = {
    inst: 'Institutional',
    net: 'Market Value',
    acad: 'Critical Acclaim',
    hist: 'Historical',
    disc: 'Social Impact',
  };

  for (const artist of MOCK_ARTISTS) {
    let distance = 0;

    for (const [gameKey, webAxis] of Object.entries(metricMapping)) {
      const gameValue = gameMetrics[gameKey as keyof GameMetrics] || 0;
      const artistValue = artist.radarData.find(d => d.axis === webAxis)?.value || 0;
      distance += Math.pow(gameValue - artistValue, 2);
    }

    distance = Math.sqrt(distance);

    if (distance < minDistance) {
      minDistance = distance;
      mostSimilar = artist;
    }
  }

  return mostSimilar;
}

/**
 * 게임 결과에 matchedArtistId 추가 (폴백 로직 포함)
 */
export function enrichGameResult(result: GameResult): GameResult {
  // 1. AI match로 ID 찾기 시도
  let matchedId = findArtistIdByName(result.match);
  let matchName = result.match;

  // 2. 실패 시 Metrics 기반 유사도로 찾기
  if (!matchedId) {
    console.warn(`AI returned unknown artist "${result.match}", using metrics-based matching`);
    const similarArtist = findMostSimilarArtist(result.metrics);
    matchedId = similarArtist.id;
    matchName = similarArtist.name;
  }

  return {
    ...result,
    match: matchName,
    matchedArtistId: matchedId,
    timestamp: Date.now(),
  };
}

/**
 * LocalStorage 키
 */
const STORAGE_KEY = 'curator_game_result';

/**
 * LocalStorage에서 게임 결과 로드
 */
export function loadGameResultFromStorage(): GameResult | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    return JSON.parse(stored) as GameResult;
  } catch (e) {
    console.error('Failed to load game result from storage:', e);
    return null;
  }
}

/**
 * LocalStorage에 게임 결과 저장
 */
export function saveGameResultToStorage(result: GameResult): void {
  try {
    const enriched = enrichGameResult(result);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(enriched));
  } catch (e) {
    console.error('Failed to save game result to storage:', e);
  }
}

/**
 * LocalStorage에서 게임 결과 삭제
 */
export function clearGameResultFromStorage(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('Failed to clear game result from storage:', e);
  }
}

/**
 * 랜덤 작가 선택 (스킵 시 사용)
 */
export function getRandomArtist(): Artist {
  const randomIndex = Math.floor(Math.random() * MOCK_ARTISTS.length);
  return MOCK_ARTISTS[randomIndex];
}

/**
 * 랜덤 작가 이름 반환 (스킵 시 사용)
 */
export function getRandomArtistName(): string {
  const randomIndex = Math.floor(Math.random() * ARTIST_LIST.length);
  return ARTIST_LIST[randomIndex];
}
