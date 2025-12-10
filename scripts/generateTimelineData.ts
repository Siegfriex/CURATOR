/**
 * 나머지 작가들의 타임라인 데이터 생성 스크립트
 * 
 * 실행 방법:
 * npm run generate:timelines
 * 
 * 또는 직접:
 * npx tsx scripts/generateTimelineData.ts
 */

import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';
import type { PreloadedTimeline, PreloadedTimelineEra, PreloadedTimelineEvent, CriticalQuote, PreloadedMasterpiece } from '../types/PreloadedData';
import { normalizeArtistName, calculateActiveYears } from '../types/PreloadedData';

// 타임라인이 없는 작가 목록 (24명)
const ARTISTS_WITHOUT_TIMELINES = [
  { id: '6', name: 'Pablo Picasso', birthYear: 1881, deathYear: 1973, nationality: 'Spanish' },
  { id: '7', name: 'Vincent van Gogh', birthYear: 1853, deathYear: 1890, nationality: 'Dutch' },
  { id: '8', name: 'Claude Monet', birthYear: 1840, deathYear: 1926, nationality: 'French' },
  { id: '9', name: 'Frida Kahlo', birthYear: 1907, deathYear: 1954, nationality: 'Mexican' },
  { id: '10', name: 'Egon Schiele', birthYear: 1890, deathYear: 1918, nationality: 'Austrian' },
  { id: '11', name: 'Gerhard Richter', birthYear: 1932, deathYear: undefined, nationality: 'German' },
  { id: '12', name: 'Salvador Dalí', birthYear: 1904, deathYear: 1989, nationality: 'Spanish' },
  { id: '13', name: 'Roy Lichtenstein', birthYear: 1923, deathYear: 1997, nationality: 'American' },
  { id: '14', name: 'David Hockney', birthYear: 1937, deathYear: undefined, nationality: 'British' },
  { id: '15', name: 'Jasper Johns', birthYear: 1930, deathYear: undefined, nationality: 'American' },
  { id: '16', name: 'Louise Bourgeois', birthYear: 1911, deathYear: 2010, nationality: 'French-American' },
  { id: '17', name: 'Francis Bacon', birthYear: 1909, deathYear: 1992, nationality: 'Irish-British' },
  { id: '18', name: 'Yayoi Kusama', birthYear: 1929, deathYear: undefined, nationality: 'Japanese' },
  { id: '19', name: 'Marina Abramović', birthYear: 1946, deathYear: undefined, nationality: 'Serbian' },
  { id: '20', name: 'Jeff Koons', birthYear: 1955, deathYear: undefined, nationality: 'American' },
  { id: '21', name: 'Banksy', birthYear: 1974, deathYear: undefined, nationality: 'British' },
  { id: '22', name: 'Ai Weiwei', birthYear: 1957, deathYear: undefined, nationality: 'Chinese' },
  { id: '23', name: 'Takashi Murakami', birthYear: 1962, deathYear: undefined, nationality: 'Japanese' },
  { id: '24', name: 'KAWS', birthYear: 1974, deathYear: undefined, nationality: 'American' },
  { id: '25', name: 'Yoshitomo Nara', birthYear: 1959, deathYear: undefined, nationality: 'Japanese' },
  { id: '26', name: 'Cindy Sherman', birthYear: 1954, deathYear: undefined, nationality: 'American' },
  { id: '27', name: 'Mark Rothko', birthYear: 1903, deathYear: 1970, nationality: 'American' },
  { id: '28', name: 'Jackson Pollock', birthYear: 1912, deathYear: 1956, nationality: 'American' },
  { id: '5', name: 'Nam June Paik', birthYear: 1932, deathYear: 2006, nationality: 'Korean-American' },
];

// 작가별 Narrative Path (index.json에서 가져옴)
const NARRATIVE_PATHS: Record<string, { phase1: string; phase2: string; phase3: string }> = {
  'Pablo Picasso': { phase1: 'RECOGNITION', phase2: 'INSTITUTIONAL', phase3: 'INTERNATIONAL' },
  'Vincent van Gogh': { phase1: 'OUTSIDER', phase2: 'RESTRUCTURING', phase3: 'POSTHUMOUS' },
  'Claude Monet': { phase1: 'OUTSIDER', phase2: 'CRITICAL', phase3: 'INTERNATIONAL' },
  'Frida Kahlo': { phase1: 'SCANDAL', phase2: 'RESTRUCTURING', phase3: 'INTERNATIONAL' },
  'Egon Schiele': { phase1: 'SCANDAL', phase2: 'CRITICAL', phase3: 'POSTHUMOUS' },
  'Gerhard Richter': { phase1: 'OUTSIDER', phase2: 'INSTITUTIONAL', phase3: 'INTERNATIONAL' },
  'Salvador Dalí': { phase1: 'SCANDAL', phase2: 'INSTITUTIONAL', phase3: 'INTERNATIONAL' },
  'Roy Lichtenstein': { phase1: 'OUTSIDER', phase2: 'INSTITUTIONAL', phase3: 'INTERNATIONAL' },
  'David Hockney': { phase1: 'RECOGNITION', phase2: 'INSTITUTIONAL', phase3: 'INTERNATIONAL' },
  'Jasper Johns': { phase1: 'RECOGNITION', phase2: 'INSTITUTIONAL', phase3: 'INTERNATIONAL' },
  'Louise Bourgeois': { phase1: 'OUTSIDER', phase2: 'RESTRUCTURING', phase3: 'INTERNATIONAL' },
  'Francis Bacon': { phase1: 'OUTSIDER', phase2: 'CRITICAL', phase3: 'INTERNATIONAL' },
  'Yayoi Kusama': { phase1: 'OUTSIDER', phase2: 'RESTRUCTURING', phase3: 'INTERNATIONAL' },
  'Marina Abramović': { phase1: 'OUTSIDER', phase2: 'CRITICAL', phase3: 'INTERNATIONAL' },
  'Jeff Koons': { phase1: 'RECOGNITION', phase2: 'INSTITUTIONAL', phase3: 'INTERNATIONAL' },
  'Banksy': { phase1: 'OUTSIDER', phase2: 'CRITICAL', phase3: 'INTERNATIONAL' },
  'Ai Weiwei': { phase1: 'OUTSIDER', phase2: 'CRITICAL', phase3: 'INTERNATIONAL' },
  'Takashi Murakami': { phase1: 'OUTSIDER', phase2: 'INSTITUTIONAL', phase3: 'INTERNATIONAL' },
  'KAWS': { phase1: 'OUTSIDER', phase2: 'INSTITUTIONAL', phase3: 'INTERNATIONAL' },
  'Yoshitomo Nara': { phase1: 'OUTSIDER', phase2: 'CRITICAL', phase3: 'INTERNATIONAL' },
  'Cindy Sherman': { phase1: 'OUTSIDER', phase2: 'CRITICAL', phase3: 'INTERNATIONAL' },
  'Mark Rothko': { phase1: 'OUTSIDER', phase2: 'INSTITUTIONAL', phase3: 'INTERNATIONAL' },
  'Jackson Pollock': { phase1: 'OUTSIDER', phase2: 'CRITICAL', phase3: 'POSTHUMOUS' },
  'Nam June Paik': { phase1: 'OUTSIDER', phase2: 'CRITICAL', phase3: 'INTERNATIONAL' },
};

/**
 * Era 구조 생성 헬퍼 함수
 */
function generateEraStructure(
  artistName: string,
  birthYear: number,
  deathYear: number | undefined,
  eraIndex: number,
  totalEras: number = 4
): PreloadedTimelineEra {
  const activeYears = calculateActiveYears(birthYear, deathYear);
  const ageRange = activeYears[1] - activeYears[0];
  const eraLength = Math.floor(ageRange / totalEras);
  
  const startAge = 20 + (eraIndex * eraLength);
  const endAge = Math.min(20 + ((eraIndex + 1) * eraLength), deathYear ? deathYear - birthYear : 100);
  const startYear = birthYear + startAge;
  const endYear = birthYear + endAge;

  const eraLabels = [
    { en: 'Early Career', ko: '초기 경력', color: '#E53E3E' },
    { en: 'Mid Career', ko: '중기 발전', color: '#D69E2E' },
    { en: 'Mature Period', ko: '성숙기', color: '#38BDF8' },
    { en: 'Late Career', ko: '후기 경력', color: '#2D3748' },
  ];

  const era = eraLabels[eraIndex] || eraLabels[0];

  return {
    eraLabel: era.en,
    eraLabelKo: era.ko,
    ageRange: `${startAge}s-${endAge}s`,
    startYear,
    endYear,
    moodColor: era.color,
    summary: `${artistName}의 ${era.ko} 시기입니다. 이 시기 동안 작가는 주요 작품을 제작하고 미술계에서의 위치를 확립했습니다.`,
    events: [], // AI로 생성될 이벤트들
  };
}

/**
 * 작가별 타임라인 템플릿 생성
 */
function generateTimelineTemplate(
  artist: typeof ARTISTS_WITHOUT_TIMELINES[0]
): PreloadedTimeline {
  const normalizedName = normalizeArtistName(artist.name);
  const narrativePath = NARRATIVE_PATHS[artist.name] || {
    phase1: 'OUTSIDER',
    phase2: 'CRITICAL',
    phase3: 'INTERNATIONAL'
  };

  const eras: PreloadedTimelineEra[] = [];
  for (let i = 0; i < 4; i++) {
    eras.push(generateEraStructure(artist.name, artist.birthYear, artist.deathYear, i));
  }

  return {
    artistId: artist.id,
    artistName: artist.name,
    birthYear: artist.birthYear,
    deathYear: artist.deathYear,
    eras,
    critiques: [],
    masterpieces: [],
    metadata: {
      version: '1.0.0',
      lastUpdated: new Date().toISOString().split('T')[0],
      primarySources: [],
      verificationStatus: 'ai_generated'
    }
  };
}

/**
 * 템플릿 기반 타임라인 이벤트 생성
 * 
 * 각 Era에 대해 기본적인 이벤트를 생성합니다.
 * 나중에 AI로 보강하거나 수동으로 업데이트할 수 있습니다.
 */
async function generateTimelineEventsWithAI(
  artistName: string,
  era: PreloadedTimelineEra,
  birthYear: number
): Promise<PreloadedTimelineEvent[]> {
  console.log(`Generating events for ${artistName} - ${era.eraLabelKo} (${era.startYear}-${era.endYear})`);
  
  const events: PreloadedTimelineEvent[] = [];
  const eraLength = era.endYear - era.startYear;
  const eventCount = Math.max(2, Math.min(5, Math.floor(eraLength / 10))); // Era 길이에 따라 2-5개 이벤트
  
  // Era 중간 지점들에 이벤트 배치
  for (let i = 0; i < eventCount; i++) {
    const progress = (i + 1) / (eventCount + 1);
    const eventYear = Math.floor(era.startYear + (eraLength * progress));
    
    // Era에 따른 이벤트 카테고리 결정
    let category: 'Masterpiece' | 'Personal' | 'Scandal' | 'Exhibition' = 'Exhibition';
    if (i === 0 && era.eraLabelKo.includes('초기')) {
      category = 'Exhibition';
    } else if (i === Math.floor(eventCount / 2)) {
      category = 'Masterpiece';
    } else if (i === eventCount - 1) {
      category = 'Exhibition';
    }
    
    // 기본 이벤트 생성
    const event: PreloadedTimelineEvent = {
      year: eventYear,
      title: `${eventYear}년 주요 활동`,
      titleEn: `Major Activity in ${eventYear}`,
      category,
      description: `${artistName}이(가) ${era.eraLabelKo} 시기인 ${eventYear}년에 주요 활동을 펼쳤습니다.`,
      impactScore: 50 + (i * 10), // 50-90 범위
      auctionHigh: 0,
      auctionLow: 0,
      context: {
        marketValue: 30 + (i * 15),
        criticalAcclaim: 40 + (i * 10),
        historical: 50 + (i * 10),
        socialImpact: 30 + (i * 15),
        institutional: 40 + (i * 10),
      },
      visualPrompt: `${artistName} in ${eventYear}, ${era.eraLabelEn} period`,
      sources: {
        primary: 'Generated Template',
      },
    };
    
    events.push(event);
  }
  
  return events;
}

/**
 * 작가별 타임라인 데이터 생성 및 저장
 */
async function generateTimelineForArtist(artist: typeof ARTISTS_WITHOUT_TIMELINES[0]): Promise<void> {
  const normalizedName = normalizeArtistName(artist.name);
  const timeline = generateTimelineTemplate(artist);

  // 각 Era에 대해 이벤트 생성 (템플릿 기반)
  for (let i = 0; i < timeline.eras.length; i++) {
    const events = await generateTimelineEventsWithAI(artist.name, timeline.eras[i], artist.birthYear);
    timeline.eras[i].events = events;
    
    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  // 파일 저장
  const outputDir = join(process.cwd(), 'public', 'data', 'preloaded', 'timelines');
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  const filePath = join(outputDir, `${normalizedName}.json`);
  writeFileSync(filePath, JSON.stringify(timeline, null, 2), 'utf-8');
  
  console.log(`✓ Generated timeline for ${artist.name} -> ${filePath}`);
}

/**
 * 메인 실행 함수
 */
async function main() {
  console.log('Starting timeline data generation...');
  console.log(`Generating timelines for ${ARTISTS_WITHOUT_TIMELINES.length} artists\n`);

  for (const artist of ARTISTS_WITHOUT_TIMELINES) {
    try {
      await generateTimelineForArtist(artist);
    } catch (error) {
      console.error(`✗ Failed to generate timeline for ${artist.name}:`, error);
    }
  }

  console.log('\n✓ Timeline generation completed!');
  console.log('\nNext steps:');
  console.log('1. Review generated timeline files');
  console.log('2. Update index.json with hasTimeline: true for all artists');
  console.log('3. Run: npm run generate:comparisons');
}

// 스크립트 직접 실행 시 (ESM 호환)
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);

if (process.argv[1] === __filename || process.argv[1]?.endsWith('generateTimelineData.ts')) {
  main().catch(console.error);
}

export { generateTimelineForArtist, generateTimelineTemplate };

