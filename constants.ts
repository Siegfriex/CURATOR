
import { Artist } from './types';

export const COLORS = {
  primary: '#28317C', // Deep Royal Blue (Reference Artist)
  secondary: '#ffffff',
  text: '#28317C',
  grid: '#e5e5e5', 
  accent: '#a3a3a3',
  comparison: '#3B82F6', // Azure Blue (Target Artist) - Replaces Yellow
  
  // Specific Metric Colors for Dual Chart
  metrics: {
    total: '#ffffff',     // White for shared core
    institution: '#38bdf8', // Light Blue
    discourse: '#818cf8',   // Indigo
    academy: '#c084fc',     // Purple
    network: '#2dd4bf'      // Teal
  }
};

export const METRIC_DETAILS: Record<string, { description: string; context: string }> = {
  'Market Value': {
    description: "경매 낙찰 결과, 1차 시장의 프라이싱 모멘텀, 그리고 2차 시장에서의 유동성을 종합적으로 분석한 지표입니다.",
    context: "최근 지표: 소더비(Sotheby's) 컨템포러리 이브닝 세일에서의 최고가 경신 기록."
  },
  'Critical Acclaim': {
    description: "저명한 미술 비평가들의 평가, 주요 학술지 등재 여부, 그리고 큐레이토리얼 리뷰를 기반으로 한 비평적 성과입니다.",
    context: "최근 지표: 아트포럼(Artforum) 12월호 회고전 리뷰 등재."
  },
  'Historical': {
    description: "미술사적 정전(Canon) 내에서의 위치, 매체적 혁신성, 그리고 장기적인 레거시 잠재력을 의미합니다.",
    context: "최근 지표: 개정된 'Art Since 1900' 커리큘럼 내 작가 등재."
  },
  'Social Impact': {
    description: "디지털 인게이지먼트, 소셜 플랫폼 내 바이럴 지수, 그리고 미술계를 넘어선 대중적 문화 공명도를 측정합니다.",
    context: "최근 지표: 인스타그램 #ContemporaryArt 태그 내 250만 회 이상의 언급량."
  },
  'Institutional': {
    description: "주요 미술관의 소장품(Collection) 수집 현황, 비엔날레 참여 이력, 그리고 기관 대여 빈도를 나타냅니다.",
    context: "최근 지표: 테이트 모던(Tate Modern) 터바인 홀 커미션 단독 전시."
  }
};

// Based on PDF "27 Combinations"
export const MOCK_ARTISTS: Artist[] = [
  {
    id: '1',
    name: 'Henri Matisse',
    birthYear: 1869,
    nationality: 'French',
    currentRank: 1,
    description: '파격적 궤적의 순수 아웃사이더: 구설수와 퇴학, 그리고 군입대를 거쳐 순수성을 추구하며 거장의 반열에 오름.',
    imageUrl: 'https://picsum.photos/seed/Matisse/800/800?grayscale',
    radarData: [{ axis: 'Market Value', value: 98, fullMark: 100 }, { axis: 'Critical Acclaim', value: 100, fullMark: 100 }, { axis: 'Historical', value: 100, fullMark: 100 }, { axis: 'Social Impact', value: 90, fullMark: 100 }, { axis: 'Institutional', value: 100, fullMark: 100 }],
    trajectory: [{ date: '2020', value: 95 }, { date: '2024', value: 98 }]
  },
  {
    id: '2',
    name: 'Damien Hirst',
    birthYear: 1965,
    nationality: 'British',
    currentRank: 2,
    description: '논란 속에서 제도권에 편입되다: 젊은 시절 논란과 파격을 일삼았으나 거대한 스케일로 성공적 제도권 안착.',
    imageUrl: 'https://picsum.photos/seed/Hirst/800/800?grayscale',
    radarData: [{ axis: 'Market Value', value: 95, fullMark: 100 }, { axis: 'Critical Acclaim', value: 70, fullMark: 100 }, { axis: 'Historical', value: 85, fullMark: 100 }, { axis: 'Social Impact', value: 95, fullMark: 100 }, { axis: 'Institutional', value: 90, fullMark: 100 }],
    trajectory: [{ date: '2020', value: 90 }, { date: '2024', value: 95 }]
  },
  {
    id: '3',
    name: 'Jean-Michel Basquiat',
    birthYear: 1960,
    nationality: 'American',
    currentRank: 3,
    description: '제도 이탈 후 국제적 인정: 낙서 예술가로 시작해 제도권 밖에서 급부상, 요절 후 신화가 된 글로벌 아이콘.',
    imageUrl: 'https://picsum.photos/seed/Basquiat/800/800?grayscale',
    radarData: [{ axis: 'Market Value', value: 100, fullMark: 100 }, { axis: 'Critical Acclaim', value: 90, fullMark: 100 }, { axis: 'Historical', value: 95, fullMark: 100 }, { axis: 'Social Impact', value: 100, fullMark: 100 }, { axis: 'Institutional', value: 95, fullMark: 100 }],
    trajectory: [{ date: '2020', value: 98 }, { date: '2024', value: 100 }]
  },
  {
    id: '4',
    name: 'Egon Schiele',
    birthYear: 1890,
    nationality: 'Austrian',
    currentRank: 4,
    description: '초기 구설수, 학술로 만회한 후의 공백: 외설 시비와 단명, 그러나 천재성을 인정받으며 학술적 지지를 획득.',
    imageUrl: 'https://picsum.photos/seed/Schiele/800/800?grayscale',
    radarData: [{ axis: 'Market Value', value: 85, fullMark: 100 }, { axis: 'Critical Acclaim', value: 95, fullMark: 100 }, { axis: 'Historical', value: 92, fullMark: 100 }, { axis: 'Social Impact', value: 80, fullMark: 100 }, { axis: 'Institutional', value: 90, fullMark: 100 }],
    trajectory: [{ date: '2020', value: 85 }, { date: '2024', value: 88 }]
  },
  {
    id: '5',
    name: 'Nam June Paik',
    birthYear: 1932,
    nationality: 'South Korean',
    currentRank: 5,
    description: '논란과 인정의 충돌, 국내 정상 등극: 아방가르드 충격으로 시작해 비평적 승리를 거두고 리움급 기관의 지지를 받음.',
    imageUrl: 'https://picsum.photos/seed/Paik/800/800?grayscale',
    radarData: [{ axis: 'Market Value', value: 85, fullMark: 100 }, { axis: 'Critical Acclaim', value: 98, fullMark: 100 }, { axis: 'Historical', value: 100, fullMark: 100 }, { axis: 'Social Impact', value: 75, fullMark: 100 }, { axis: 'Institutional', value: 95, fullMark: 100 }],
    trajectory: [{ date: '2020', value: 82 }, { date: '2024', value: 88 }]
  },
  {
    id: '6',
    name: 'Cindy Sherman',
    birthYear: 1954,
    nationality: 'American',
    currentRank: 6,
    description: '구설수로 시작, 비평을 거쳐 국제 거장으로: 젠더 담론과 사회적 금기를 건드리며 학술적, 비평적 우위를 점함.',
    imageUrl: 'https://picsum.photos/seed/Sherman/800/800?grayscale',
    radarData: [{ axis: 'Market Value', value: 88, fullMark: 100 }, { axis: 'Critical Acclaim', value: 95, fullMark: 100 }, { axis: 'Historical', value: 90, fullMark: 100 }, { axis: 'Social Impact', value: 85, fullMark: 100 }, { axis: 'Institutional', value: 95, fullMark: 100 }],
    trajectory: [{ date: '2020', value: 85 }, { date: '2024', value: 90 }]
  },
  {
    id: '7',
    name: 'Jackson Pollock',
    birthYear: 1912,
    nationality: 'American',
    currentRank: 7,
    description: '시장에서 버려진 후의 재정비: 초기 불안정과 개인적 침체기를 거쳐 자기 성찰 후 재발견된 액션 페인팅의 대가.',
    imageUrl: 'https://picsum.photos/seed/Pollock/800/800?grayscale',
    radarData: [{ axis: 'Market Value', value: 95, fullMark: 100 }, { axis: 'Critical Acclaim', value: 92, fullMark: 100 }, { axis: 'Historical', value: 98, fullMark: 100 }, { axis: 'Social Impact', value: 90, fullMark: 100 }, { axis: 'Institutional', value: 95, fullMark: 100 }],
    trajectory: [{ date: '2020', value: 92 }, { date: '2024', value: 95 }]
  },
  {
    id: '8',
    name: 'Mark Rothko',
    birthYear: 1903,
    nationality: 'American',
    currentRank: 8,
    description: '시장의 배신을 극복하고 국내 성공: 고독한 예술가로서 상업적 절연을 선택했으나 사후 기관의 재조명을 받음.',
    imageUrl: 'https://picsum.photos/seed/Rothko/800/800?grayscale',
    radarData: [{ axis: 'Market Value', value: 96, fullMark: 100 }, { axis: 'Critical Acclaim', value: 94, fullMark: 100 }, { axis: 'Historical', value: 97, fullMark: 100 }, { axis: 'Social Impact', value: 85, fullMark: 100 }, { axis: 'Institutional', value: 96, fullMark: 100 }],
    trajectory: [{ date: '2020', value: 94 }, { date: '2024', value: 96 }]
  },
  {
    id: '9',
    name: 'Frida Kahlo',
    birthYear: 1907,
    nationality: 'Mexican',
    currentRank: 9,
    description: '논란과 좌절 끝에 세계를 얻다: 고통과 내러티브 강자, 사후 국제 비엔날레급 압도적 명예 획득.',
    imageUrl: 'https://picsum.photos/seed/Kahlo/800/800?grayscale',
    radarData: [{ axis: 'Market Value', value: 92, fullMark: 100 }, { axis: 'Critical Acclaim', value: 90, fullMark: 100 }, { axis: 'Historical', value: 95, fullMark: 100 }, { axis: 'Social Impact', value: 100, fullMark: 100 }, { axis: 'Institutional', value: 92, fullMark: 100 }],
    trajectory: [{ date: '2020', value: 90 }, { date: '2024', value: 95 }]
  },
  {
    id: '10',
    name: 'Andy Warhol',
    birthYear: 1928,
    nationality: 'American',
    currentRank: 10,
    description: '정통 엘리트의 이탈과 재시작: 상업 디자인에서 순수 미술로 전향, 팝 아트 세계를 구축한 이단아.',
    imageUrl: 'https://picsum.photos/seed/Warhol/800/800?grayscale',
    radarData: [{ axis: 'Market Value', value: 100, fullMark: 100 }, { axis: 'Critical Acclaim', value: 95, fullMark: 100 }, { axis: 'Historical', value: 100, fullMark: 100 }, { axis: 'Social Impact', value: 100, fullMark: 100 }, { axis: 'Institutional', value: 100, fullMark: 100 }],
    trajectory: [{ date: '2020', value: 98 }, { date: '2024', value: 100 }]
  },
  {
    id: '11',
    name: 'Lee Ufan',
    birthYear: 1936,
    nationality: 'South Korean',
    currentRank: 11,
    description: '엘리트의 좌절, 국내 기관의 구원: 정규 미술 이탈 후 단색화의 철학적 기반을 다지며 국내외 핵심 기관 지지 획득.',
    imageUrl: 'https://picsum.photos/seed/Ufan/800/800?grayscale',
    radarData: [{ axis: 'Market Value', value: 90, fullMark: 100 }, { axis: 'Critical Acclaim', value: 95, fullMark: 100 }, { axis: 'Historical', value: 92, fullMark: 100 }, { axis: 'Social Impact', value: 70, fullMark: 100 }, { axis: 'Institutional', value: 95, fullMark: 100 }],
    trajectory: [{ date: '2020', value: 88 }, { date: '2024', value: 92 }]
  },
  {
    id: '12',
    name: 'Louise Bourgeois',
    birthYear: 1911,
    nationality: 'French-American',
    currentRank: 12,
    description: '정통 교육의 파기, 국제적 성공: 수학에서 예술로, 아방가르드 반발 후 만년에 이르러 상징적 거장이 됨.',
    imageUrl: 'https://picsum.photos/seed/Bourgeois/800/800?grayscale',
    radarData: [{ axis: 'Market Value', value: 93, fullMark: 100 }, { axis: 'Critical Acclaim', value: 98, fullMark: 100 }, { axis: 'Historical', value: 96, fullMark: 100 }, { axis: 'Social Impact', value: 85, fullMark: 100 }, { axis: 'Institutional', value: 98, fullMark: 100 }],
    trajectory: [{ date: '2020', value: 92 }, { date: '2024', value: 95 }]
  },
  {
    id: '13',
    name: 'David Hockney',
    birthYear: 1937,
    nationality: 'British',
    currentRank: 13,
    description: '정통 엘리트 코스의 일시적 멈춤: 학술적 인정 후 매체 전환을 통해 새로운 예술적 영감을 얻은 현대 미술의 거장.',
    imageUrl: 'https://picsum.photos/seed/Hockney/800/800?grayscale',
    radarData: [{ axis: 'Market Value', value: 98, fullMark: 100 }, { axis: 'Critical Acclaim', value: 90, fullMark: 100 }, { axis: 'Historical', value: 94, fullMark: 100 }, { axis: 'Social Impact', value: 95, fullMark: 100 }, { axis: 'Institutional', value: 95, fullMark: 100 }],
    trajectory: [{ date: '2020', value: 96 }, { date: '2024', value: 98 }]
  },
  {
    id: '14',
    name: 'Do Ho Suh',
    birthYear: 1962,
    nationality: 'South Korean',
    currentRank: 14,
    description: '학술적 기반의 탄탄한 국내 제도권 진입: 엘리트 코스와 건축/개념적 접근으로 리움 등 최정상급 기관에서 인정받음.',
    imageUrl: 'https://picsum.photos/seed/Suh/800/800?grayscale',
    radarData: [{ axis: 'Market Value', value: 85, fullMark: 100 }, { axis: 'Critical Acclaim', value: 92, fullMark: 100 }, { axis: 'Historical', value: 85, fullMark: 100 }, { axis: 'Social Impact', value: 80, fullMark: 100 }, { axis: 'Institutional', value: 94, fullMark: 100 }],
    trajectory: [{ date: '2020', value: 85 }, { date: '2024', value: 88 }]
  },
  {
    id: '15',
    name: 'Ai Weiwei',
    birthYear: 1957,
    nationality: 'Chinese',
    currentRank: 15,
    description: '최정예 엘리트의 국제적 거장 궤적: 제도적 완성, 비평가들의 지지, 국제적 담론을 주도하는 글로벌 거장.',
    imageUrl: 'https://picsum.photos/seed/Weiwei/800/800?grayscale',
    radarData: [{ axis: 'Market Value', value: 88, fullMark: 100 }, { axis: 'Critical Acclaim', value: 95, fullMark: 100 }, { axis: 'Historical', value: 90, fullMark: 100 }, { axis: 'Social Impact', value: 100, fullMark: 100 }, { axis: 'Institutional', value: 96, fullMark: 100 }],
    trajectory: [{ date: '2020', value: 92 }, { date: '2024', value: 95 }]
  },
  {
    id: '16',
    name: 'Jeff Koons',
    birthYear: 1955,
    nationality: 'American',
    currentRank: 16,
    description: '성장통: 시장 실패 후 잠시 숨 고르기. 초기 상업적 논란과 침체를 겪었으나 스타일 재정비로 리브랜딩 성공.',
    imageUrl: 'https://picsum.photos/seed/Koons/800/800?grayscale',
    radarData: [{ axis: 'Market Value', value: 97, fullMark: 100 }, { axis: 'Critical Acclaim', value: 75, fullMark: 100 }, { axis: 'Historical', value: 88, fullMark: 100 }, { axis: 'Social Impact', value: 96, fullMark: 100 }, { axis: 'Institutional', value: 88, fullMark: 100 }],
    trajectory: [{ date: '2020', value: 94 }, { date: '2024', value: 96 }]
  },
  {
    id: '17',
    name: 'Kim Tschang-yeul',
    birthYear: 1929,
    nationality: 'South Korean',
    currentRank: 17,
    description: '엘리트의 시련, 국내 핵심 기관의 지지: 긴 무명과 어려움을 딛고 물방울 작업으로 국내외 거장 인정.',
    imageUrl: 'https://picsum.photos/seed/Kim/800/800?grayscale',
    radarData: [{ axis: 'Market Value', value: 90, fullMark: 100 }, { axis: 'Critical Acclaim', value: 88, fullMark: 100 }, { axis: 'Historical', value: 92, fullMark: 100 }, { axis: 'Social Impact', value: 70, fullMark: 100 }, { axis: 'Institutional', value: 94, fullMark: 100 }],
    trajectory: [{ date: '2020', value: 88 }, { date: '2024', value: 91 }]
  },
  {
    id: '18',
    name: 'Yayoi Kusama',
    birthYear: 1929,
    nationality: 'Japanese',
    currentRank: 18,
    description: '시장의 배신을 딛고 국제적 명예를 얻다: 독창적 시각과 상업적 어려움, 만년에 이르러 국제 비엔날레의 상징이 됨.',
    imageUrl: 'https://picsum.photos/seed/Kusama/800/800?grayscale',
    radarData: [{ axis: 'Market Value', value: 99, fullMark: 100 }, { axis: 'Critical Acclaim', value: 90, fullMark: 100 }, { axis: 'Historical', value: 95, fullMark: 100 }, { axis: 'Social Impact', value: 100, fullMark: 100 }, { axis: 'Institutional', value: 98, fullMark: 100 }],
    trajectory: [{ date: '2020', value: 97 }, { date: '2024', value: 99 }]
  },
  {
    id: '19',
    name: 'Roy Lichtenstein',
    birthYear: 1923,
    nationality: 'American',
    currentRank: 19,
    description: '빠른 스카우트, 하지만 이탈과 공백: 조기 발굴되었으나 학업 중단 등 공백기 후 만화 기법 도입으로 혁신.',
    imageUrl: 'https://picsum.photos/seed/Lichtenstein/800/800?grayscale',
    radarData: [{ axis: 'Market Value', value: 95, fullMark: 100 }, { axis: 'Critical Acclaim', value: 90, fullMark: 100 }, { axis: 'Historical', value: 96, fullMark: 100 }, { axis: 'Social Impact', value: 92, fullMark: 100 }, { axis: 'Institutional', value: 95, fullMark: 100 }],
    trajectory: [{ date: '2020', value: 94 }, { date: '2024', value: 95 }]
  },
  {
    id: '20',
    name: 'Caravaggio',
    birthYear: 1571,
    nationality: 'Italian',
    currentRank: 20,
    description: '천재의 이탈, 국내 큐레이터의 구원: 선택된 천재였으나 통제 불가능한 성격, 사후 혁명적 화풍으로 재조명.',
    imageUrl: 'https://picsum.photos/seed/Caravaggio/800/800?grayscale',
    radarData: [{ axis: 'Market Value', value: 80, fullMark: 100 }, { axis: 'Critical Acclaim', value: 100, fullMark: 100 }, { axis: 'Historical', value: 100, fullMark: 100 }, { axis: 'Social Impact', value: 90, fullMark: 100 }, { axis: 'Institutional', value: 100, fullMark: 100 }],
    trajectory: [{ date: '2020', value: 100 }, { date: '2024', value: 100 }]
  },
  {
    id: '21',
    name: 'Eva Hesse',
    birthYear: 1936,
    nationality: 'German-American',
    currentRank: 21,
    description: '초기 발굴, 시장 이탈 후 세계적 명성: 촉망받는 여성 작가로 아카데미즘 거부, 사후 국제적 담론의 중심.',
    imageUrl: 'https://picsum.photos/seed/Hesse/800/800?grayscale',
    radarData: [{ axis: 'Market Value', value: 88, fullMark: 100 }, { axis: 'Critical Acclaim', value: 98, fullMark: 100 }, { axis: 'Historical', value: 95, fullMark: 100 }, { axis: 'Social Impact', value: 75, fullMark: 100 }, { axis: 'Institutional', value: 96, fullMark: 100 }],
    trajectory: [{ date: '2020', value: 92 }, { date: '2024', value: 95 }]
  },
  {
    id: '22',
    name: 'Ricardo Bofill',
    birthYear: 1939,
    nationality: 'Spanish',
    currentRank: 22,
    description: '초기 발굴, 학술적 인정 후의 재정비: 조기 영재로 인정받았으나 매체 전환과 공백 후 건축 분야로 혁신.',
    imageUrl: 'https://picsum.photos/seed/Bofill/800/800?grayscale',
    radarData: [{ axis: 'Market Value', value: 80, fullMark: 100 }, { axis: 'Critical Acclaim', value: 90, fullMark: 100 }, { axis: 'Historical', value: 88, fullMark: 100 }, { axis: 'Social Impact', value: 85, fullMark: 100 }, { axis: 'Institutional', value: 85, fullMark: 100 }],
    trajectory: [{ date: '2020', value: 85 }, { date: '2024', value: 88 }]
  },
  {
    id: '23',
    name: 'Haegue Yang',
    birthYear: 1971,
    nationality: 'South Korean',
    currentRank: 23,
    description: '최연소 천재의 국내 제도권 완벽 진입: 큐레이터 우위, 비평적 지지를 받으며 리움 등 핵심 기관의 선택을 받음.',
    imageUrl: 'https://picsum.photos/seed/Yang/800/800?grayscale',
    radarData: [{ axis: 'Market Value', value: 85, fullMark: 100 }, { axis: 'Critical Acclaim', value: 95, fullMark: 100 }, { axis: 'Historical', value: 85, fullMark: 100 }, { axis: 'Social Impact', value: 78, fullMark: 100 }, { axis: 'Institutional', value: 96, fullMark: 100 }],
    trajectory: [{ date: '2020', value: 88 }, { date: '2024', value: 92 }]
  },
  {
    id: '24',
    name: 'Gerhard Richter',
    birthYear: 1932,
    nationality: 'German',
    currentRank: 24,
    description: '초기 큐레이터 발굴, 비평-국제적 거장 루트: 전통과 혁신, 비평적 우위로 동시대 최고 거장 등극.',
    imageUrl: 'https://picsum.photos/seed/Richter/800/800?grayscale',
    radarData: [{ axis: 'Market Value', value: 98, fullMark: 100 }, { axis: 'Critical Acclaim', value: 100, fullMark: 100 }, { axis: 'Historical', value: 100, fullMark: 100 }, { axis: 'Social Impact', value: 90, fullMark: 100 }, { axis: 'Institutional', value: 100, fullMark: 100 }],
    trajectory: [{ date: '2020', value: 98 }, { date: '2024', value: 99 }]
  },
  {
    id: '25',
    name: 'Edvard Munch',
    birthYear: 1863,
    nationality: 'Norwegian',
    currentRank: 25,
    description: '최연소 스타의 추락과 재기 모색: 천재의 고독과 외면, 정신적 침체를 겪으며 재기를 모색한 표현주의 선구자.',
    imageUrl: 'https://picsum.photos/seed/Munch/800/800?grayscale',
    radarData: [{ axis: 'Market Value', value: 92, fullMark: 100 }, { axis: 'Critical Acclaim', value: 95, fullMark: 100 }, { axis: 'Historical', value: 98, fullMark: 100 }, { axis: 'Social Impact', value: 95, fullMark: 100 }, { axis: 'Institutional', value: 98, fullMark: 100 }],
    trajectory: [{ date: '2020', value: 95 }, { date: '2024', value: 96 }]
  },
  {
    id: '26',
    name: 'Alberto Giacometti',
    birthYear: 1901,
    nationality: 'Swiss',
    currentRank: 26,
    description: '촉망받던 작가의 시장 실패와 국내 재조명: 과도한 기대와 시장 흐름 불일치, 이후 기관에서 재평가.',
    imageUrl: 'https://picsum.photos/seed/Giacometti/800/800?grayscale',
    radarData: [{ axis: 'Market Value', value: 96, fullMark: 100 }, { axis: 'Critical Acclaim', value: 98, fullMark: 100 }, { axis: 'Historical', value: 99, fullMark: 100 }, { axis: 'Social Impact', value: 85, fullMark: 100 }, { axis: 'Institutional', value: 98, fullMark: 100 }],
    trajectory: [{ date: '2020', value: 96 }, { date: '2024', value: 97 }]
  },
  {
    id: '27',
    name: 'Marina Abramović',
    birthYear: 1946,
    nationality: 'Serbian',
    currentRank: 27,
    description: '초기 스타, 시장 실패를 극복하고 세계적 성공: 퍼포먼스 아트의 난항을 딛고 만년에 퍼포먼스의 대모로 인정.',
    imageUrl: 'https://picsum.photos/seed/Abramovic/800/800?grayscale',
    radarData: [{ axis: 'Market Value', value: 85, fullMark: 100 }, { axis: 'Critical Acclaim', value: 95, fullMark: 100 }, { axis: 'Historical', value: 92, fullMark: 100 }, { axis: 'Social Impact', value: 95, fullMark: 100 }, { axis: 'Institutional', value: 96, fullMark: 100 }],
    trajectory: [{ date: '2020', value: 90 }, { date: '2024', value: 94 }]
  }
];
