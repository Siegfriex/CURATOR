/**
 * 작가 비교 데이터 사전 생성 스크립트
 * 
 * 실행 방법:
 * npm run generate:comparisons
 * 
 * 또는 직접:
 * npx tsx scripts/generateComparisonData.ts
 */

import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'fs';
import { join } from 'path';
import type { PreloadedComparison, ComparisonTrajectoryPoint, PreloadedArtistTrajectory } from '../types/PreloadedData';
import { normalizeArtistName, createComparisonKey } from '../types/PreloadedData';

// 모든 작가 목록 (28명)
const ALL_ARTISTS = [
  'Henri Matisse', 'Damien Hirst', 'Jean-Michel Basquiat', 'Andy Warhol',
  'Pablo Picasso', 'Vincent van Gogh', 'Claude Monet', 'Frida Kahlo',
  'Egon Schiele', 'Gerhard Richter', 'Salvador Dalí', 'Roy Lichtenstein',
  'David Hockney', 'Jasper Johns', 'Louise Bourgeois', 'Francis Bacon',
  'Yayoi Kusama', 'Marina Abramović', 'Jeff Koons', 'Banksy',
  'Ai Weiwei', 'Takashi Murakami', 'KAWS', 'Yoshitomo Nara',
  'Cindy Sherman', 'Mark Rothko', 'Jackson Pollock', 'Nam June Paik'
];

/**
 * 모든 작가 조합 생성 (351개)
 * n*(n-1)/2 = 28*27/2 = 378개... 아니다, 28명이면 28*27/2 = 378개
 * 하지만 실제로는 351개라고 했으니 일부 조합을 제외하는 것 같습니다.
 * 일단 모든 조합을 생성하겠습니다.
 */
function generateAllCombinations(): string[][] {
  const combinations: string[][] = [];
  for (let i = 0; i < ALL_ARTISTS.length; i++) {
    for (let j = i + 1; j < ALL_ARTISTS.length; j++) {
      combinations.push([ALL_ARTISTS[i], ALL_ARTISTS[j]]);
    }
  }
  return combinations;
}

/**
 * Trajectory 파일 로드
 */
function loadTrajectoryFile(artistName: string): PreloadedArtistTrajectory | null {
  try {
    const normalizedName = normalizeArtistName(artistName);
    const filePath = join(process.cwd(), 'public', 'data', 'preloaded', 'trajectories', `${normalizedName}.json`);
    
    if (!existsSync(filePath)) {
      console.warn(`Trajectory file not found: ${filePath}`);
      return null;
    }
    
    const content = readFileSync(filePath, 'utf-8');
    return JSON.parse(content) as PreloadedArtistTrajectory;
  } catch (error) {
    console.error(`Error loading trajectory for ${artistName}:`, error);
    return null;
  }
}

/**
 * 두 작가의 궤적 데이터를 병합하여 비교 궤적 데이터 생성
 */
function mergeTrajectories(
  traj1: PreloadedArtistTrajectory,
  traj2: PreloadedArtistTrajectory
): ComparisonTrajectoryPoint[] {
  const maxLength = Math.max(traj1.data.length, traj2.data.length);
  const comparisonData: ComparisonTrajectoryPoint[] = [];

  for (let i = 0; i < maxLength; i++) {
    const point1 = traj1.data[i] || {
      age: traj1.data[0]?.age || 20 + i * 2,
      total: 0,
      institution: 0,
      discourse: 0,
      academy: 0,
      network: 0,
      context: '',
    };
    
    const point2 = traj2.data[i] || {
      age: traj2.data[0]?.age || 20 + i * 2,
      total: 0,
      institution: 0,
      discourse: 0,
      academy: 0,
      network: 0,
      context: '',
    };

    // 나이 정렬 (두 작가의 나이가 다를 수 있으므로)
    const age = Math.min(point1.age, point2.age);

    comparisonData.push({
      age,
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
    });
  }

  return comparisonData;
}

/**
 * 가장 유사한 메트릭 찾기
 */
function findSharedMetric(trajectoryData: ComparisonTrajectoryPoint[]): string {
  const metrics = ['total', 'institution', 'discourse', 'academy', 'network'];
  let minDiff = Infinity;
  let sharedMetric = 'total';

  for (const metric of metrics) {
    const diff = trajectoryData.reduce((sum, point) => {
      const key1 = `a1_${metric}` as keyof ComparisonTrajectoryPoint;
      const key2 = `a2_${metric}` as keyof ComparisonTrajectoryPoint;
      const val1 = point[key1] as number;
      const val2 = point[key2] as number;
      return sum + Math.abs(val1 - val2);
    }, 0);

    if (diff < minDiff) {
      minDiff = diff;
      sharedMetric = metric;
    }
  }

  return sharedMetric;
}

/**
 * 비교 분석 텍스트 생성 (간단한 템플릿)
 * 
 * 실제로는 AI를 호출하여 더 상세한 분석을 생성할 수 있습니다.
 */
function generateAnalysisText(
  artist1: string,
  artist2: string,
  sharedMetric: string
): string {
  const metricNames: Record<string, string> = {
    total: '전체 평균',
    institution: '제도적 수용',
    discourse: '담론적 영향력',
    academy: '학술적 인정',
    network: '네트워크 영향력',
  };

  return `## ${artist1} vs ${artist2} 비교 분석

두 작가는 **${metricNames[sharedMetric]}** 지표에서 가장 유사한 패턴을 보입니다.

### 주요 유사점
- ${sharedMetric} 메트릭에서 유사한 궤적을 보임
- 비슷한 시기에 주요 전환점 경험

### 주요 차이점
- 작가별 고유한 스타일과 접근 방식
- 서로 다른 문화적 배경과 영향

### 큐레이토리얼 인사이트
이 비교는 두 작가의 공통점과 차이점을 명확히 보여줍니다.`;
}

/**
 * 비교 데이터 생성
 */
async function generateComparisonForPair(
  artist1: string,
  artist2: string
): Promise<PreloadedComparison | null> {
  // 1. 두 작가의 trajectory 데이터 로드
  const traj1 = loadTrajectoryFile(artist1);
  const traj2 = loadTrajectoryFile(artist2);

  if (!traj1 || !traj2) {
    console.warn(`Skipping ${artist1} vs ${artist2}: trajectory data not found`);
    return null;
  }

  // 2. 비교 궤적 데이터 병합
  const trajectoryData = mergeTrajectories(traj1, traj2);

  // 3. 가장 유사한 메트릭 찾기
  const sharedMetric = findSharedMetric(trajectoryData);

  // 4. 비교 분석 텍스트 생성
  const analysisText = generateAnalysisText(artist1, artist2, sharedMetric);

  const comparison: PreloadedComparison = {
    comparisonId: createComparisonKey(artist1, artist2),
    artist1Id: traj1.artistId,
    artist1Name: traj1.artistName,
    artist2Id: traj2.artistId,
    artist2Name: traj2.artistName,
    analysisText,
    sharedMetric,
    trajectoryData,
    sources: [],
    metadata: {
      version: '1.0.0',
      lastUpdated: new Date().toISOString().split('T')[0],
      primarySources: [],
      verificationStatus: 'ai_generated'
    }
  };

  return comparison;
}

/**
 * 비교 데이터를 파일로 저장
 */
function saveComparisonToFile(comparison: PreloadedComparison): void {
  const outputDir = join(process.cwd(), 'public', 'data', 'preloaded', 'comparisons');
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  const fileName = comparison.comparisonId.replace(':', '_');
  const filePath = join(outputDir, `${fileName}.json`);
  
  writeFileSync(filePath, JSON.stringify(comparison, null, 2), 'utf-8');
}

/**
 * 배치 생성 (모든 조합)
 */
async function generateAllComparisons(): Promise<void> {
  const combinations = generateAllCombinations();
  const batchSize = 10; // 동시 처리 수
  let successCount = 0;
  let failCount = 0;

  console.log(`Generating ${combinations.length} comparison pairs...\n`);

  for (let i = 0; i < combinations.length; i += batchSize) {
    const batch = combinations.slice(i, i + batchSize);
    const batchNumber = Math.floor(i / batchSize) + 1;
    const totalBatches = Math.ceil(combinations.length / batchSize);

    console.log(`Processing batch ${batchNumber}/${totalBatches} (${batch.length} pairs)...`);

    await Promise.all(
      batch.map(async ([artist1, artist2]) => {
        try {
          const comparison = await generateComparisonForPair(artist1, artist2);
          if (comparison) {
            saveComparisonToFile(comparison);
            successCount++;
            console.log(`  ✓ ${artist1} vs ${artist2}`);
          } else {
            failCount++;
            console.log(`  ✗ ${artist1} vs ${artist2} (skipped)`);
          }
        } catch (error) {
          failCount++;
          console.error(`  ✗ ${artist1} vs ${artist2}:`, error);
        }
      })
    );

    // Rate limiting
    if (i + batchSize < combinations.length) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  console.log(`\n✓ Comparison generation completed!`);
  console.log(`  Success: ${successCount}`);
  console.log(`  Failed/Skipped: ${failCount}`);
  console.log(`  Total: ${combinations.length}`);
  console.log(`\nNext steps:`);
  console.log(`1. Review generated comparison files`);
  console.log(`2. Update index.json with totalComparisons: ${successCount}`);
}

/**
 * 메인 실행 함수
 */
async function main() {
  console.log('Starting comparison data generation...\n');
  await generateAllComparisons();
}

// 스크립트 직접 실행 시 (ESM 호환)
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);

if (process.argv[1] === __filename || process.argv[1]?.endsWith('generateComparisonData.ts')) {
  main().catch(console.error);
}

export { generateComparisonForPair, generateAllCombinations };

