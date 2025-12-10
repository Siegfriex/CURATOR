/**
 * Preloaded Data Types for Artist Data Pre-loading System
 * 
 * 27명 작가의 Timeline Journey, Lifelong Trajectory, Masterpieces 데이터를
 * 사전 주입하여 로딩 시간을 제거하고 검증된 고품질 데이터를 제공합니다.
 * 
 * @version 1.0.0
 * @lastUpdated 2025-12-03
 */

// ============================================
// Common Types
// ============================================

export type ConfidenceLevel = 'high' | 'medium' | 'low';
export type VerificationStatus = 'verified' | 'pending' | 'ai_generated';
export type EventCategory = 'Masterpiece' | 'Personal' | 'Scandal' | 'Exhibition';

// 27 Combinations Narrative Path
export type Phase1Type = 'SCANDAL' | 'RECOGNITION' | 'OUTSIDER';
export type Phase2Type = 'INSTITUTIONAL' | 'CRITICAL' | 'RESTRUCTURING';
export type Phase3Type = 'DOMESTIC' | 'INTERNATIONAL' | 'POSTHUMOUS';

export interface NarrativePath {
  phase1: Phase1Type;
  phase2: Phase2Type;
  phase3: Phase3Type;
}

export interface DataMetadata {
  version: string;
  lastUpdated: string;
  primarySources: string[];
  verificationStatus: VerificationStatus;
}

export interface ContextMetrics {
  marketValue: number;      // 0-100
  criticalAcclaim: number;  // 0-100
  historical: number;       // 0-100
  socialImpact: number;     // 0-100
  institutional: number;    // 0-100
}

// ============================================
// Lifelong Trajectory Types (2년 주기, 31개 데이터 포인트)
// ============================================

export interface PreloadedTrajectoryPoint {
  age: number;           // 20, 22, 24, ... 78, 80
  year: number;          // 실제 연도 (birthYear + age)
  
  // 5가지 세부 지표 (0-100)
  total: number;
  institution: number;   // 제도적 수용 (미술관 소장, 전시)
  discourse: number;     // 담론적 영향력 (비평, 학술)
  academy: number;       // 학술적 인정 (교과서, 논문)
  network: number;       // 네트워크 영향력 (동료, 후원자)
  
  // 컨텍스트 정보
  context: string;       // 한국어, 10-20자 핵심 이벤트
  keyEvent?: string;     // 주요 이벤트 (있을 경우)
  
  // 메타데이터
  sources: string[];     // 출처 URL/문헌
  confidence: ConfidenceLevel;
}

export interface PreloadedArtistTrajectory {
  artistId: string;
  artistName: string;
  birthYear: number;
  deathYear?: number;
  activeYears: [number, number];  // 활동 시작-종료 연도
  
  // 27 Combinations 분류
  narrativePath: NarrativePath;
  
  data: PreloadedTrajectoryPoint[];  // 31개 포인트
  
  metadata: DataMetadata;
}

// ============================================
// Timeline Journey Types (4개 Era, Era당 3-5개 이벤트)
// ============================================

export interface EventSources {
  primary: string;       // 주요 출처
  secondary?: string[];  // 보조 출처
}

export interface PreloadedTimelineEvent {
  year: number;
  title: string;                    // 한국어
  titleEn: string;                  // 영어 (검색용)
  category: EventCategory;
  description: string;              // 한국어, 50-100자
  
  // 영향도 지표
  impactScore: number;              // 0-100
  auctionHigh: number;              // 0-100 (경매가 상한)
  auctionLow: number;               // 0-100 (경매가 하한)
  
  // 5가지 컨텍스트 지표
  context: ContextMetrics;
  
  // 이미지 관련
  imageUrl?: string;                // 검증된 이미지 URL
  imageSource?: string;             // 이미지 출처
  visualPrompt: string;             // AI 이미지 생성용 프롬프트
  
  // 출처
  sources: EventSources;
}

export interface PreloadedTimelineEra {
  eraLabel: string;                 // 영어 키워드 (예: "Fauvist Revolution")
  eraLabelKo: string;               // 한국어 (예: "야수파 혁명기")
  ageRange: string;                 // "20s-30s"
  startYear: number;
  endYear: number;
  moodColor: string;                // HEX 색상
  summary: string;                  // 한국어, 100-150자
  events: PreloadedTimelineEvent[]; // 3-5개
}

export interface CriticalQuote {
  text: string;
  textKo?: string;                  // 한국어 번역
  author: string;
  source: string;
  year: string;
  sourceUrl?: string;
}

export interface PreloadedTimeline {
  artistId: string;
  artistName: string;
  birthYear: number;
  deathYear?: number;
  
  eras: PreloadedTimelineEra[];     // 4개 Era
  critiques: CriticalQuote[];
  masterpieces: PreloadedMasterpiece[];  // 5-10개
  
  metadata: DataMetadata;
}

// ============================================
// Masterpieces Types (작가당 5-10개)
// ============================================

export interface CollectionInfo {
  museum: string;                   // 소장 기관
  location: string;                 // 위치
  acquisitionYear?: string;         // 소장 연도
}

export interface AuctionRecord {
  price: string;                    // 최고가 (예: "$110.5 million")
  date: string;                     // 경매일
  house: string;                    // 경매사
  source: string;                   // 출처 URL
}

export interface PreloadedMasterpiece {
  id: string;                       // 고유 ID
  title: string;                    // 원제
  titleKo: string;                  // 한국어 제목
  year: string;                     // 제작 연도
  medium: string;                   // 매체 (예: "Oil on canvas")
  dimensions?: string;              // 크기
  
  // 이미지
  imageUrl: string;                 // 검증된 이미지 URL
  imageSource: string;              // 이미지 출처 (Wikipedia, Museum)
  thumbnailUrl?: string;            // 썸네일
  
  // 소장 정보
  collection: CollectionInfo;
  
  // 경매 기록
  auctionRecord?: AuctionRecord;
  
  // 미술사적 의의
  significance: string;             // 한국어, 50-100자
  
  // AI 생성용
  visualPrompt: string;
  
  // 출처
  sources: string[];
}

// ============================================
// Comparison Types (작가 비교 조합)
// ============================================

export interface ComparisonTrajectoryPoint {
  age: number;
  
  // Artist 1 metrics
  a1_total: number;
  a1_institution: number;
  a1_discourse: number;
  a1_academy: number;
  a1_network: number;
  a1_context?: string;
  
  // Artist 2 metrics
  a2_total: number;
  a2_institution: number;
  a2_discourse: number;
  a2_academy: number;
  a2_network: number;
  a2_context?: string;
}

export interface PreloadedComparison {
  comparisonId: string;             // "artist1_id:artist2_id" (정렬된 순서)
  artist1Id: string;
  artist1Name: string;
  artist2Id: string;
  artist2Name: string;
  
  // 비교 분석 텍스트 (한국어)
  analysisText: string;             // 마크다운 형식
  
  // 공유 메트릭 (가장 유사한 지표)
  sharedMetric: string;
  
  // 비교 궤적 데이터 (31개 포인트)
  trajectoryData: ComparisonTrajectoryPoint[];
  
  // 출처 정보
  sources: {
    uri: string;
    title: string;
  }[];
  
  metadata: DataMetadata;
}

// ============================================
// Index Types
// ============================================

export interface ArtistIndexEntry {
  id: string;
  name: string;
  normalizedName: string;           // 정규화된 이름 (snake_case)
  birthYear: number;
  deathYear?: number;
  nationality: string;
  narrativePath: NarrativePath;
  hasTrajectory: boolean;
  hasTimeline: boolean;
  hasMasterpieces: boolean;
}

export interface PreloadedDataIndex {
  version: string;
  lastUpdated: string;
  totalArtists: number;
  totalComparisons: number;
  artists: ArtistIndexEntry[];
  
  // 데이터 파일 경로
  paths: {
    artists: string;
    trajectories: string;
    timelines: string;
    masterpieces: string;
    comparisons: string;
  };
}

// ============================================
// Utility Functions
// ============================================

/**
 * 작가 이름을 정규화된 파일명으로 변환
 * @example normalizeArtistName("Henri Matisse") => "henri_matisse"
 */
export function normalizeArtistName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    // 특수문자를 적절히 변환
    .normalize('NFD') // 유니코드 정규화 (분해)
    .replace(/[\u0300-\u036f]/g, '') // 발음 구별 기호 제거 (ć → c, í → i)
    .replace(/[^\w\s가-힣ㄱ-ㅎㅏ-ㅣ]/g, '') // 나머지 특수문자 제거
    .replace(/\s+/g, '_');
}

/**
 * 비교 조합 키 생성 (정렬된 순서)
 * @example createComparisonKey("Picasso", "Matisse") => "matisse:picasso"
 */
export function createComparisonKey(artist1: string, artist2: string): string {
  const n1 = normalizeArtistName(artist1);
  const n2 = normalizeArtistName(artist2);
  return [n1, n2].sort().join(':');
}

/**
 * 2년 주기 연령 배열 생성 (20-80세, 31개 포인트)
 */
export function generateAgePoints(): number[] {
  const ages: number[] = [];
  for (let age = 20; age <= 80; age += 2) {
    ages.push(age);
  }
  return ages;
}

/**
 * 작가의 활동 연도 범위 계산
 */
export function calculateActiveYears(
  birthYear: number, 
  deathYear?: number
): [number, number] {
  const startYear = birthYear + 20; // 보통 20세부터 활동 시작
  const endYear = deathYear || new Date().getFullYear();
  return [startYear, Math.min(endYear, birthYear + 80)];
}

