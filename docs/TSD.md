# Curator's Odysseia - 기술 명세 문서 (TSD)

**문서 버전**: 1.1  
**최종 업데이트**: 2025년 1월  
**프로젝트명**: Curator's Odysseia  
**부제**: Data Driven Art Archive  
**문서 유형**: Technical Specification Document (TSD)  
**기준 문서**: BRD v1.2, SRD v1.0  
**상태**: 초기 작성

---

## 목차

1. [문서 개요](#1-문서-개요)
2. [시스템 아키텍처](#2-시스템-아키텍처)
3. [데이터베이스 설계](#3-데이터베이스-설계)
4. [API 명세](#4-api-명세)
5. [프론트엔드 설계](#5-프론트엔드-설계)
6. [백엔드 설계](#6-백엔드-설계)
7. [캐싱 전략](#7-캐싱-전략)
8. [에러 처리 및 폴백](#8-에러-처리-및-폴백)
9. [보안 구현](#9-보안-구현)
10. [성능 최적화](#10-성능-최적화)
11. [배포 및 운영](#11-배포-및-운영)
12. [부록](#12-부록)

---

## 1. 문서 개요

### 1.1 문서 목적

본 문서는 Curator's Odysseia 시스템의 기술적 구현 세부사항을 정의합니다. 개발자가 실제 코드를 작성할 수 있도록 구체적인 기술 명세, API 인터페이스, 데이터 구조, 알고리즘 등을 제공합니다.

### 1.2 문서 범위

본 문서는 다음을 포함합니다:
- 시스템 아키텍처 및 컴포넌트 설계
- 데이터베이스 스키마 및 데이터 구조
- API 엔드포인트 상세 명세
- 프론트엔드 및 백엔드 구현 세부사항
- 캐싱, 에러 처리, 보안 구현 방법

### 1.3 대상 독자

- 백엔드 개발자
- 프론트엔드 개발자
- 시스템 아키텍트
- DevOps 엔지니어

### 1.4 참조 문서

- BRD v1.2: 비즈니스 요구사항 문서
- SRD v1.0: 시스템 요구사항 문서

---

## 2. 시스템 아키텍처

### 2.1 전체 아키텍처

```
┌─────────────────────────────────────────────────────────────────┐
│                    시스템 아키텍처 다이어그램                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              CLIENT LAYER (React + TypeScript)          │  │
│  │                                                          │  │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐       │  │
│  │  │  App.tsx   │  │ Components │  │  Services  │       │  │
│  │  │ (Router)   │  │  (11개)    │  │  (API 호출) │       │  │
│  │  └────────────┘  └────────────┘  └────────────┘       │  │
│  └──────────────────────┬───────────────────────────────────┘  │
│                         │                                       │
│                         │ HTTPS                                 │
│                         ▼                                       │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │         FIREBASE HOSTING (Static Assets)                │  │
│  └──────────────────────┬───────────────────────────────────┘  │
│                         │                                       │
│                         ▼                                       │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │      FIREBASE FUNCTIONS 2세대 (Serverless Backend)      │  │
│  │                                                          │  │
│  │  ┌────────────────────────────────────────────────────┐ │  │
│  │  │  API Endpoints (10개)                             │ │  │
│  │  │  - getDashboardData                               │ │  │
│  │  │  - getArtistReport                                │ │  │
│  │  │  - getComparativeAnalysis                         │ │  │
│  │  │  - getDetailedTrajectory                          │ │  │
│  │  │  - ...                                            │ │  │
│  │  └────────────────────────────────────────────────────┘ │  │
│  │                                                          │  │
│  │  ┌────────────────────────────────────────────────────┐ │  │
│  │  │  Utils                                            │ │  │
│  │  │  - cache.ts (Firestore 캐싱)                     │ │  │
│  │  │  - googleSearch.ts                               │ │  │
│  │  │  - imageSearch.ts                                │ │  │
│  │  │  - artistNormalization.ts                        │ │  │
│  │  │  - schemaValidation.ts (Zod)                     │ │  │
│  │  └────────────────────────────────────────────────────┘ │  │
│  └──────────────────────┬───────────────────────────────────┘  │
│                         │                                       │
│         ┌───────────────┼───────────────┐                      │
│         ▼               ▼               ▼                      │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐                │
│  │Firestore │    │Cloud     │    │External  │                │
│  │(캐싱 +   │    │Storage   │    │APIs      │                │
│  │영구 저장)│    │(이미지)  │    │(Gemini,  │                │
│  │          │    │          │    │CSE, Wiki)│                │
│  └──────────┘    └──────────┘    └──────────┘                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 기술 스택 상세

#### 프론트엔드
```json
{
  "react": "^19.2.0",
  "typescript": "^5.8.2",
  "vite": "^6.2.0",
  "tailwindcss": "^3.x",
  "recharts": "^3.4.1",
  "framer-motion": "^11.13.1",
  "react-markdown": "^10.1.0",
  "tone": "^14.7.77",
  "firebase": "^10.x"
}
```

#### 백엔드
```json
{
  "node": "22.x",
  "firebase-functions": "^5.x",
  "@google/genai": "^1.x",
  "zod": "^3.x"
}
```

### 2.3 컴포넌트 계층 구조

```
프론트엔드
├── App.tsx (라우팅 및 상태 관리)
├── components/
│   ├── RadarChartComponent.tsx
│   ├── LineChartComponent.tsx
│   ├── DualAreaChartComponent.tsx
│   ├── ConnectedTab.tsx
│   ├── DeepDiveTab.tsx
│   ├── DeepDiveChat.tsx
│   ├── TrajectoryTunnel.tsx
│   ├── TimelineJourney.tsx
│   ├── FlashlightGateway.tsx
│   └── AIReport.tsx
├── services/
│   ├── geminiService.ts
│   ├── cacheService.ts
│   ├── artistImageService.ts
│   ├── artistListService.ts
│   └── requestDeduplication.ts
└── types.ts

백엔드
├── functions/
│   └── src/
│       ├── index.ts (10개 엔드포인트)
│       ├── schemas/
│       │   └── aiResponses.ts (Zod 스키마)
│       ├── utils/
│       │   ├── cache.ts
│       │   ├── googleSearch.ts
│       │   ├── imageSearch.ts
│       │   ├── artistNormalization.ts
│       │   ├── schemaValidation.ts
│       │   └── retryStrategy.ts
│       └── storage/
│           └── permanentStorage.ts
```

---

## 3. 데이터베이스 설계

### 3.1 Firestore 컬렉션 구조

#### 세션 캐시 컬렉션 (24시간 TTL)

**컬렉션: `dashboard`**

| 필드명 | 타입 | 제약사항 | 설명 | 예시 |
|--------|------|----------|------|------|
| `value` | object | required | DashboardData 객체 | `{ name: "Henri Matisse", ... }` |
| `timestamp` | number | required | 생성/수정 시간 (milliseconds) | `1704067200000` |

**문서 ID 형식**: `dashboard:{normalizedArtistName}`  
**예시**: `dashboard:henri_matisse`

**TTL 관리**: 
- `timestamp` 기준 24시간(86,400,000ms) 초과 시 자동 삭제
- 조회 시 TTL 검증 후 만료된 문서 삭제

---

**컬렉션: `report`**

| 필드명 | 타입 | 제약사항 | 설명 |
|--------|------|----------|------|
| `value` | object | required | ReportData 객체 |
| `timestamp` | number | required | 생성/수정 시간 (milliseconds) |

**문서 ID 형식**: `report:{normalizedArtistName}`

---

**컬렉션: `timeline`**

| 필드명 | 타입 | 제약사항 | 설명 |
|--------|------|----------|------|
| `value` | object | required | TimelineData 객체 |
| `timestamp` | number | required | 생성/수정 시간 (milliseconds) |

**문서 ID 형식**: `timeline:{normalizedArtistName}`

---

**컬렉션: `comparison`**

| 필드명 | 타입 | 제약사항 | 설명 |
|--------|------|----------|------|
| `value` | object | required | ComparisonData 객체 |
| `timestamp` | number | required | 생성/수정 시간 (milliseconds) |

**문서 ID 형식**: `comparison:{sortedNormalizedKey}`  
**예시**: `comparison:henri_matisse:pablo_picasso`  
**주의**: 아티스트 이름 순서와 무관하게 정렬된 키 사용

---

**컬렉션: `trajectory`**

| 필드명 | 타입 | 제약사항 | 설명 |
|--------|------|----------|------|
| `value` | array | required | ComparativeDataPoint[] 배열 |
| `timestamp` | number | required | 생성/수정 시간 (milliseconds) |

**문서 ID 형식**: `trajectory:{sortedNormalizedKey}`

---

**컬렉션: `images`**

| 필드명 | 타입 | 제약사항 | 설명 |
|--------|------|----------|------|
| `value` | string | required | 이미지 URL |
| `timestamp` | number | required | 생성/수정 시간 (milliseconds) |

**문서 ID 형식**: `images:{cacheKey}`  
**예시**: `images:wiki_image:henri_matisse`, `images:google_image:portrait of Henri Matisse`

---

**컬렉션: `artists`**

| 필드명 | 타입 | 제약사항 | 설명 |
|--------|------|----------|------|
| `value` | array | required | Artist[] 배열 |
| `timestamp` | number | required | 생성/수정 시간 (milliseconds) |

**문서 ID 형식**: `artists:{cacheKey}`  
**예시**: `artists:artist_list:0:20`, `artists:artist_list:20:20`

---

**컬렉션: `search`**

| 필드명 | 타입 | 제약사항 | 설명 |
|--------|------|----------|------|
| `value` | array | required | SearchResult[] 배열 |
| `timestamp` | number | required | 생성/수정 시간 (milliseconds) |

**문서 ID 형식**: `search:{queryHash}`  
**예시**: `search:search:henri matisse trajectory:all`

#### 영구 저장 컬렉션 (Knowledge Base)

**컬렉션: `artists_knowledge`**

| 필드명 | 타입 | 제약사항 | 설명 | 예시 |
|--------|------|----------|------|------|
| `artistName` | string | required, max 100자 | 원본 아티스트 이름 | `"Henri Matisse"` |
| `normalizedName` | string | required, unique | 정규화된 이름 (문서 ID와 동일) | `"henri_matisse"` |
| `basicInfo` | object | required | 기본 정보 객체 | - |
| `basicInfo.nationality` | string | required, max 50자 | 국적 | `"French"` |
| `basicInfo.birthYear` | number | required, 1000-2100 | 출생년도 | `1869` |
| `basicInfo.deathYear` | number | optional, 1000-2100 | 사망년도 | `1954` |
| `basicInfo.movements` | string[] | required, max 20개 | 예술 운동/스타일 | `["Fauvism", "Modernism"]` |
| `basicInfo.majorWorks` | string[] | required, max 50개 | 주요 작품 목록 | `["The Dance", "Woman with a Hat"]` |
| `metrics` | object | required | 메트릭 데이터 객체 | - |
| `metrics.radarData` | AxisData[] | required, length 5 | 5개 축 메트릭 데이터 | `[{axis: "Market Value", value: 85}, ...]` |
| `metrics.trajectory` | TimeSeriesPoint[] | required, length 1-20 | 시계열 궤적 데이터 | `[{year: "2020", value: 70}, ...]` |
| `metrics.lastUpdated` | Timestamp | required | 마지막 업데이트 시간 | `Timestamp` |
| `metrics.updateFrequency` | string | required, enum | 업데이트 주기 | `"monthly"` |
| `reports` | object | required | 리포트 데이터 객체 | - |
| `reports.curatorial` | object | required | 큐레이토리얼 리포트 | - |
| `reports.curatorial.text` | string | required, max 5000자 | 리포트 텍스트 (마크다운) | `"# Henri Matisse\n\n..."` |
| `reports.curatorial.version` | number | required, min 1 | 리포트 버전 | `1` |
| `reports.curatorial.generatedAt` | Timestamp | required | 생성 시간 | `Timestamp` |
| `reports.timeline` | TimelineData | required | 타임라인 데이터 | `{eras: [...]}` |
| `metadata` | object | required | 메타데이터 객체 | - |
| `metadata.createdAt` | Timestamp | required | 생성 시간 | `Timestamp` |
| `metadata.lastAccessed` | Timestamp | required | 마지막 접근 시간 | `Timestamp` |
| `metadata.accessCount` | number | required, min 0 | 접근 횟수 | `42` |
| `metadata.dataQuality` | string | required, enum | 데이터 품질 등급 | `"ai_generated"` |

**문서 ID**: `{normalizedArtistName}` (예: `henri_matisse`)

**인덱스 요구사항**:
- 복합 인덱스: `metadata.lastAccessed` (내림차순) - 인기 아티스트 조회용
- 복합 인덱스: `metadata.accessCount` (내림차순) - 인기 아티스트 조회용

**데이터 신선도 검증**:
```typescript
function isDataFresh(lastUpdated: Timestamp, frequency: string): boolean {
  const age = Date.now() - lastUpdated.toMillis();
  const thresholds = {
    'monthly': 30 * 24 * 60 * 60 * 1000,    // 30일
    'quarterly': 90 * 24 * 60 * 60 * 1000,  // 90일
    'yearly': 365 * 24 * 60 * 60 * 1000     // 365일
  };
  return age < (thresholds[frequency] || thresholds.monthly);
}
```

---

**컬렉션: `permanent_comparisons`**

| 필드명 | 타입 | 제약사항 | 설명 | 예시 |
|--------|------|----------|------|------|
| `artist1` | string | required, max 100자 | 첫 번째 아티스트 이름 | `"Henri Matisse"` |
| `artist2` | string | required, max 100자 | 두 번째 아티스트 이름 | `"Pablo Picasso"` |
| `normalizedKey` | string | required, unique | 정규화된 키 (문서 ID와 동일) | `"henri_matisse:pablo_picasso"` |
| `trajectoryData` | array | required | ComparativeDataPoint[] 배열 | `[{age: 20, a1_total: 60, ...}, ...]` |
| `comparisonReport` | string | required, max 5000자 | 비교 리포트 텍스트 (마크다운) | `"# Comparison\n\n..."` |
| `radarData` | object | required | 듀얼 레이더 차트 데이터 | `{artist1: [...], artist2: [...]}` |
| `combinationType` | string | optional | 27 Combinations 분류 | `"RECOGNITION-INSTITUTIONAL-INTERNATIONAL"` |
| `generatedAt` | Timestamp | required | 생성 시간 | `Timestamp` |
| `accessCount` | number | required, min 0 | 접근 횟수 | `15` |
| `lastAccessedAt` | Timestamp | required | 마지막 접근 시간 | `Timestamp` |
| `version` | number | required, min 1 | 데이터 버전 | `1` |

**문서 ID**: `{sortedNormalizedKey}` (예: `henri_matisse:pablo_picasso`)  
**주의**: 아티스트 이름 순서와 무관하게 정렬된 키 사용

**인덱스 요구사항**:
- 복합 인덱스: `accessCount` (내림차순) - 인기 비교 조합 조회용
- 복합 인덱스: `lastAccessedAt` (내림차순) - 최근 비교 조합 조회용

**자동 업데이트**:
- 조회 시 `accessCount` 자동 증가
- 조회 시 `lastAccessedAt` 자동 업데이트

#### 채팅 히스토리 컬렉션

**컬렉션: `chats`**

| 필드명 | 타입 | 제약사항 | 설명 | 예시 |
|--------|------|----------|------|------|
| `artistName` | string | required, max 100자 | 아티스트 이름 | `"Henri Matisse"` |
| `topic` | string \| null | optional, max 200자 | 채팅 주제 (null 허용) | `"Market Value"` 또는 `null` |
| `messages` | array | required, max 100개 | Message[] 배열 | `[{role: "user", content: "...", ...}, ...]` |
| `timestamp` | Timestamp | required | 생성 시간 | `Timestamp` |

**Message 객체 구조**:

| 필드명 | 타입 | 제약사항 | 설명 | 예시 |
|--------|------|----------|------|------|
| `role` | string | required, enum | 메시지 역할 | `"user"` 또는 `"assistant"` |
| `content` | string | required, max 2000자 | 메시지 내용 | `"What is Henri Matisse's most famous work?"` |
| `timestamp` | Timestamp | required | 메시지 시간 | `Timestamp` |

**문서 ID**: 자동 생성 UUID (예: `Qb6GqnaW0kfCGyTChmtu`)

**인덱스 요구사항**:
- 단일 인덱스: `artistName` - 아티스트별 채팅 조회용
- 복합 인덱스: `artistName` + `timestamp` (오름차순) - 시간순 정렬용 (필요 시)

**정렬 전략**:
- 클라이언트 사이드 정렬: `messages` 배열을 `timestamp` 기준으로 정렬
- Firestore 쿼리 시 `orderBy` 사용 시 복합 인덱스 필요

**데이터 제한**:
- `messages` 배열 최대 길이: 100개
- 초과 시 오래된 메시지 자동 삭제 또는 새 채팅 세션 생성

### 3.2 데이터 타입 정의

#### 기본 타입 정의

```typescript
// types.ts

/**
 * 아티스트 기본 정보
 * 
 * @property name - 아티스트 이름 (1-100자)
 * @property nationality - 국적 (1-50자)
 * @property birthYear - 출생년도 (1000-2100)
 * @property deathYear - 사망년도 (선택, 1000-2100)
 * @property imageUrl - 프로필 이미지 URL (선택)
 */
export interface Artist {
  name: string;              // required, 1-100자
  nationality: string;       // required, 1-50자
  birthYear: number;         // required, 1000-2100
  deathYear?: number;         // optional, 1000-2100
  imageUrl?: string;         // optional, URL 형식
}

/**
 * 대시보드 데이터
 * 
 * @property name - 아티스트 이름
 * @property nationality - 국적
 * @property birthYear - 출생년도
 * @property description - 아티스트 설명 (1-500자)
 * @property radarData - 5개 축 메트릭 데이터 (정확히 5개)
 * @property trajectory - 시계열 궤적 데이터 (1-20개)
 */
export interface DashboardData {
  name: string;                    // required, 1-100자
  nationality: string;             // required, 1-50자
  birthYear: number;               // required, 1000-2100
  description: string;             // required, 1-500자
  radarData: AxisData[];          // required, length === 5
  trajectory: TimeSeriesPoint[];   // required, length 1-20
  imageUrl?: string;              // optional
  _source?: 'cache' | 'knowledge' | 'ai';
  _validationStatus?: 'validated' | 'fallback';
}

/**
 * 레이더 차트 축 데이터
 * 
 * @property axis - 메트릭 이름 (고정값: "Market Value", "Critical Acclaim", "Historical Significance", "Social Impact", "Institutional Recognition")
 * @property value - 메트릭 값 (0-100)
 * @property fullMark - 최대값 (항상 100)
 */
export interface AxisData {
  axis: string;        // required, enum: 5개 고정값 중 하나
  value: number;       // required, 0-100
  fullMark: number;    // required, 항상 100
}

/**
 * 시계열 데이터 포인트
 * 
 * @property date - 연도 (YYYY 형식, 예: "2020")
 * @property value - 값 (0-100)
 */
export interface TimeSeriesPoint {
  date: string;       // required, YYYY 형식 (예: "2020")
  value: number;      // required, 0-100
}

/**
 * 비교 궤적 데이터
 * 
 * @property artist1 - 첫 번째 아티스트 이름
 * @property artist2 - 두 번째 아티스트 이름
 * @property data - 연령대별 비교 데이터 포인트 배열 (1-7개, 연령대: 20, 30, 40, 50, 60, 70, 80)
 */
export interface ComparativeTrajectory {
  artist1: string;                    // required, 1-100자
  artist2: string;                    // required, 1-100자
  data: ComparativeDataPoint[];       // required, length 1-7
}

/**
 * 비교 데이터 포인트
 * 
 * @property age - 연령대 (20, 30, 40, 50, 60, 70, 80 중 하나)
 * @property a1_total - 아티스트 1 총점 (0-100)
 * @property a1_context - 아티스트 1 해당 연령대 컨텍스트 설명 (선택, 최대 200자)
 * @property a2_total - 아티스트 2 총점 (0-100)
 * @property a2_context - 아티스트 2 해당 연령대 컨텍스트 설명 (선택, 최대 200자)
 */
export interface ComparativeDataPoint {
  age: number;              // required, enum: 20, 30, 40, 50, 60, 70, 80
  a1_total: number;         // required, 0-100
  a1_context?: string;      // optional, max 200자
  a2_total: number;         // required, 0-100
  a2_context?: string;      // optional, max 200자
}

/**
 * 타임라인 데이터
 * 
 * @property eras - Era 배열 (최소 1개)
 */
export interface TimelineData {
  eras: Era[];              // required, length >= 1
}

/**
 * Era (시대)
 * 
 * @property name - Era 이름 (예: "Early Career", "Mature Period")
 * @property startYear - 시작 연도 (1000-2100)
 * @property endYear - 종료 연도 (1000-2100, startYear <= endYear)
 * @property events - 타임라인 이벤트 배열 (최소 1개)
 */
export interface Era {
  name: string;             // required, 1-100자
  startYear: number;        // required, 1000-2100
  endYear: number;          // required, 1000-2100, startYear <= endYear
  events: TimelineEvent[];  // required, length >= 1
}

/**
 * 타임라인 이벤트
 * 
 * @property year - 이벤트 연도 (1000-2100)
 * @property title - 이벤트 제목 (1-200자)
 * @property category - 이벤트 카테고리 (enum)
 * @property description - 이벤트 설명 (1-500자)
 * @property impactScore - 영향도 점수 (0-100)
 * @property auctionHigh - 경매 최고가 (0-100, 정규화된 값)
 * @property auctionLow - 경매 최저가 (0-100, 정규화된 값)
 * @property visualPrompt - 이미지 생성용 프롬프트 (선택)
 * @property imageUrl - 이벤트 이미지 URL (선택)
 */
export interface TimelineEvent {
  year: number;                    // required, 1000-2100
  title: string;                   // required, 1-200자
  category: 'Masterpiece' | 'Personal' | 'Scandal' | 'Exhibition';  // required, enum
  description: string;             // required, 1-500자
  impactScore: number;             // required, 0-100
  auctionHigh: number;             // required, 0-100
  auctionLow: number;              // required, 0-100, auctionLow <= auctionHigh
  visualPrompt?: string;           // optional, max 500자
  imageUrl?: string;               // optional, URL 형식
}

/**
 * 대표작 정보
 * 
 * @property title - 작품 제목 (1-200자)
 * @property year - 제작 연도 (YYYY 형식 또는 "c. YYYY")
 * @property visualPrompt - 이미지 생성용 프롬프트 (선택)
 * @property imageUrl - 작품 이미지 URL (선택)
 */
export interface Masterpiece {
  title: string;           // required, 1-200자
  year: string;            // required, YYYY 형식 또는 "c. YYYY"
  visualPrompt: string;    // required, max 500자
  imageUrl?: string;       // optional, URL 형식
}

/**
 * 검색 결과
 * 
 * @property title - 검색 결과 제목
 * @property snippet - 검색 결과 요약
 * @property link - 검색 결과 링크
 */
export interface SearchResult {
  title: string;           // required, 1-200자
  snippet: string;         // required, 1-500자
  link: string;            // required, URL 형식
}
```

#### Zod 스키마 정의

```typescript
// functions/src/schemas/aiResponses.ts

import { z } from 'zod';

/**
 * 레이더 메트릭 스키마
 * 모든 값은 0-100 범위, 기본값 50
 */
export const RadarMetricsSchema = z.object({
  market: z.number().min(0).max(100).default(50),
  critical: z.number().min(0).max(100).default(50),
  historical: z.number().min(0).max(100).default(50),
  social: z.number().min(0).max(100).default(50),
  institutional: z.number().min(0).max(100).default(50),
});

/**
 * 궤적 데이터 포인트 스키마
 */
export const TrajectoryPointSchema = z.object({
  year: z.string().regex(/^\d{4}$/, '연도는 YYYY 형식이어야 합니다'),
  value: z.number().min(0).max(100),
});

/**
 * 대시보드 응답 스키마
 */
export const DashboardResponseSchema = z.object({
  radar: RadarMetricsSchema,
  trajectory: z.array(TrajectoryPointSchema).min(1).max(20),
  description: z.string().min(1).max(500),
  nationality: z.string().min(1).max(50),
  birthYear: z.number().min(1000).max(2100),
});

/**
 * 타임라인 이벤트 스키마
 */
export const TimelineEventSchema = z.object({
  year: z.number().min(1000).max(2100),
  title: z.string().min(1).max(200),
  category: z.enum(['Masterpiece', 'Personal', 'Scandal', 'Exhibition']),
  description: z.string().min(1).max(500),
  impactScore: z.number().min(0).max(100),
  auctionHigh: z.number().min(0).max(100),
  auctionLow: z.number().min(0).max(100),
  visualPrompt: z.string().max(500).optional(),
});

/**
 * 비교 데이터 포인트 스키마
 */
export const ComparativeDataPointSchema = z.object({
  age: z.number().refine((val) => [20, 30, 40, 50, 60, 70, 80].includes(val), {
    message: '연령대는 20, 30, 40, 50, 60, 70, 80 중 하나여야 합니다',
  }),
  a1_total: z.number().min(0).max(100),
  a1_context: z.string().max(200).optional(),
  a2_total: z.number().min(0).max(100),
  a2_context: z.string().max(200).optional(),
});

/**
 * 비교 궤적 스키마
 */
export const ComparativeTrajectorySchema = z.object({
  artist1: z.string().min(1).max(100),
  artist2: z.string().min(1).max(100),
  data: z.array(ComparativeDataPointSchema).min(1).max(7),
});

// TypeScript 타입 추론
export type DashboardResponse = z.infer<typeof DashboardResponseSchema>;
export type ComparativeTrajectory = z.infer<typeof ComparativeTrajectorySchema>;
```

### 3.3 Firestore 인덱스 요구사항

#### 단일 필드 인덱스

**컬렉션: `artists_knowledge`**
- `metadata.lastAccessed` (내림차순) - 인기 아티스트 조회용
- `metadata.accessCount` (내림차순) - 인기 아티스트 조회용

**컬렉션: `permanent_comparisons`**
- `accessCount` (내림차순) - 인기 비교 조합 조회용
- `lastAccessedAt` (내림차순) - 최근 비교 조합 조회용

**컬렉션: `chats`**
- `artistName` (오름차순) - 아티스트별 채팅 조회용

#### 복합 인덱스

**컬렉션: `chats`**
- 필드: `artistName` (오름차순) + `timestamp` (오름차순)
- 용도: 아티스트별 채팅을 시간순으로 정렬하여 조회
- 생성 명령:
```bash
# Firebase Console에서 자동 생성 링크 사용 또는
# firestore.indexes.json에 추가
```

**firestore.indexes.json 예시**:
```json
{
  "indexes": [
    {
      "collectionGroup": "chats",
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "artistName",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "timestamp",
          "order": "ASCENDING"
        }
      ]
    }
  ],
  "fieldOverrides": []
}
```

#### 인덱스 생성 전략

**자동 생성**:
- Firestore Console에서 쿼리 실행 시 인덱스 생성 링크 제공
- 개발 환경에서 쿼리 테스트 시 자동으로 인덱스 생성 제안

**수동 생성**:
- `firestore.indexes.json` 파일에 인덱스 정의
- `firebase deploy --only firestore:indexes` 명령으로 배포

**인덱스 최적화**:
- 자주 사용되는 쿼리 패턴에 맞춰 인덱스 생성
- 불필요한 인덱스는 비용 절감을 위해 제거
- 복합 인덱스는 쿼리 패턴에 정확히 맞춰 생성

#### 인덱스 모니터링

**인덱스 사용량 확인**:
- Firebase Console > Firestore > Indexes에서 확인
- 사용되지 않는 인덱스 식별 및 제거

**인덱스 성능**:
- 인덱스 크기 모니터링
- 인덱스 빌드 시간 확인 (대용량 컬렉션의 경우)

---

## 4. API 명세

### 4.1 API 기본 정보

- **Base URL**: `https://asia-northeast3-curatorproto.cloudfunctions.net`
- **인증**: 현재 없음 (향후 추가 예정)
- **응답 형식**: JSON
- **CORS**: 모든 엔드포인트에서 지원

### 4.2 엔드포인트 상세 명세

#### GET /getDashboardData

**설명**: 아티스트 대시보드 데이터 조회

**쿼리 파라미터**:
- `artistName` (required, string): 아티스트 이름

**응답**:
```typescript
{
  name: string;
  nationality: string;
  birthYear: number;
  description: string;
  radarData: AxisData[];
  trajectory: TimeSeriesPoint[];
  imageUrl?: string;
  _source?: 'cache' | 'knowledge' | 'ai';
  _validationStatus?: 'validated' | 'fallback';
}
```

**에러 응답**:
```typescript
{
  error: string;
  fallbackData?: DashboardData;
}
```

**캐싱 전략**:
1. 세션 캐시 확인 (24시간 TTL)
2. Knowledge Base 확인 (영구 저장)
3. AI 호출 (최후의 수단)

---

#### GET /getArtistReport

**설명**: AI 큐레이토리얼 리포트 생성

**쿼리 파라미터**:
- `artistName` (required, string): 아티스트 이름

**응답**:
```typescript
{
  report: string; // 마크다운 형식
  generatedAt: string;
  _source?: 'cache' | 'ai';
}
```

---

#### GET /getArtistTimeline

**설명**: 아티스트 타임라인 데이터 조회

**쿼리 파라미터**:
- `artistName` (required, string): 아티스트 이름

**응답**:
```typescript
{
  eras: Era[];
  _source?: 'cache' | 'knowledge' | 'ai';
}
```

---

#### GET /getComparativeAnalysis

**설명**: 두 아티스트 비교 분석

**쿼리 파라미터**:
- `artist1` (required, string): 첫 번째 아티스트 이름
- `artist2` (required, string): 두 번째 아티스트 이름

**응답**:
```typescript
{
  artist1: string;
  artist2: string;
  radarData: {
    artist1: AxisData[];
    artist2: AxisData[];
  };
  report: string;
  _source?: 'cache' | 'permanent' | 'ai';
}
```

---

#### GET /getDetailedTrajectory

**설명**: 두 아티스트의 상세 궤적 비교

**쿼리 파라미터**:
- `artist1` (required, string): 첫 번째 아티스트 이름
- `artist2` (required, string): 두 번째 아티스트 이름

**응답**:
```typescript
{
  artist1: string;
  artist2: string;
  data: ComparativeDataPoint[];
  _source?: 'cache' | 'permanent' | 'ai';
}
```

**특수 사항**:
- 타임아웃: 300초
- 메모리: 512MiB
- Streaming Response 지원 (향후)

---

#### GET /getArtistList

**설명**: 작가 목록 조회 (무한 스크롤용)

**쿼리 파라미터**:
- `offset` (required, number): 시작 위치
- `limit` (required, number): 조회 개수

**응답**:
```typescript
{
  artists: Artist[];
  hasMore: boolean;
  _source?: 'cache' | 'ai';
}
```

**특수 사항**:
- 타임아웃: 120초
- 메모리: 512MiB

---

#### POST /getChatResponse

**설명**: 채팅 응답 생성

**요청 본문**:
```typescript
{
  artistName: string;
  message: string;
  chatId?: string;
}
```

**응답**:
```typescript
{
  response: string;
  chatId: string;
}
```

---

### 4.3 API 에러 코드

| 코드 | 설명 | 처리 방법 |
|-----|------|----------|
| 400 | 잘못된 요청 | 요청 파라미터 확인 |
| 429 | Rate Limit 초과 | 지수 백오프 재시도 |
| 500 | 서버 오류 | 폴백 데이터 반환 |
| 503 | 서비스 불가 | 캐시 데이터 반환 |

---

## 5. 프론트엔드 설계

### 5.1 컴포넌트 구조

#### App.tsx
```typescript
// 라우팅 및 상태 관리
type View = 'LANDING' | 'OVERVIEW' | 'CONNECTED' | 'DEEP_DIVE';

function App() {
  const [currentView, setCurrentView] = useState<View>('LANDING');
  const [selectedArtist, setSelectedArtist] = useState<string>('');
  
  // 뷰 전환 로직
  // ...
}
```

#### RadarChartComponent.tsx
```typescript
interface RadarChartProps {
  data: AxisData[];
  dual?: {
    data2: AxisData[];
    artist2Name: string;
  };
  artistName: string;
}

export function RadarChartComponent({ data, dual, artistName }: RadarChartProps) {
  // Recharts RadarChart 사용
  // 접근성: AccessibleChart 래퍼 사용
}
```

#### ConnectedTab.tsx
```typescript
export function ConnectedTab() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  
  // 무한 스크롤 구현
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading) {
          loadMoreArtists();
        }
      },
      { rootMargin: '100px' }
    );
    
    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }
    
    return () => observer.disconnect();
  }, [loading]);
}
```

### 5.2 상태 관리

- **전역 상태**: React Context API 또는 Zustand (향후)
- **로컬 상태**: useState, useReducer
- **서버 상태**: React Query 또는 SWR (향후)

### 5.3 라우팅

- **현재**: 상태 기반 라우팅 (App.tsx 내부)
- **향후**: React Router 도입 검토

### 5.4 스타일링

- **방식**: Tailwind CSS (인라인 클래스)
- **테마**: 다크 모드 기본
- **반응형**: 모바일 우선 접근

---

## 6. 백엔드 설계

### 6.1 Firebase Functions 구조

#### 함수 설정
```typescript
// 고우선순위 함수 (콜드 스타트 제거)
const HIGH_PRIORITY_CONFIG = {
  cors: true,
  minInstances: 1,
  maxInstances: 10,
  concurrency: 80,
  timeoutSeconds: 60,
  memory: '512MiB' as const,
  region: 'asia-northeast3',
};

// 표준 함수
const STANDARD_CONFIG = {
  cors: true,
  minInstances: 0,
  maxInstances: 10,
  concurrency: 80,
  timeoutSeconds: 60,
  memory: '256MiB' as const,
  region: 'asia-northeast3',
};
```

#### 함수 구현 예시
```typescript
export const getDashboardData = onRequest(
  HIGH_PRIORITY_CONFIG,
  async (req, res) => {
    setSecurityHeaders(res);
    
    const artistName = req.query.artistName as string;
    if (!artistName) {
      res.status(400).json({ error: "artistName required" });
      return;
    }

    try {
      // 1. 이름 정규화
      const normalizedName = normalizeArtistName(artistName);
      const cacheKey = createCacheKey('dashboard', artistName);
      
      // 2. 캐시 확인
      const cached = await getCached<any>("dashboard", cacheKey);
      if (cached) {
        logger.info(`Cache hit: ${cacheKey}`);
        res.json({ ...cached, _source: 'cache' });
        return;
      }
      
      // 3. Knowledge Base 확인
      const knowledge = await getKnowledge('artists_knowledge', normalizedName);
      if (knowledge && isDataFresh(knowledge.metrics.lastUpdated, knowledge.metrics.updateFrequency)) {
        await setCached('dashboard', cacheKey, knowledge);
        res.json({ ...knowledge, _source: 'knowledge' });
        return;
      }
      
      // 4. AI 호출
      const ai = getAI();
      const response = await withExponentialBackoff(async () => {
        return await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: `Generate dashboard data for artist: ${artistName}...`,
          config: { tools: [{ googleSearch: {} }] }
        });
      });
      
      // 5. 스키마 검증
      const rawData = parseAIResponse(response);
      const validation = validateAIResponse(
        DashboardResponseSchema,
        rawData,
        DEFAULT_FALLBACKS.dashboard,
        `dashboard:${artistName}`
      );
      
      // 6. 데이터 변환 및 저장
      const dashboardData = transformToDashboardData(validation.data, artistName);
      await saveToKnowledgeBase('artists_knowledge', normalizedName, dashboardData);
      await setCached('dashboard', cacheKey, dashboardData);
      
      res.json({ ...dashboardData, _source: 'ai', _validationStatus: validation.success ? 'validated' : 'fallback' });
      
    } catch (error) {
      logger.error("Dashboard data error:", error);
      const errorResponse = await handleApiError(
        error,
        mockDashboardData,
        GEMINI_RETRY_CONFIG
      );
      
      if (errorResponse.fallbackData) {
        res.json(errorResponse.fallbackData);
      } else {
        res.status(503).json(errorResponse);
      }
    }
  }
);
```

### 6.2 유틸리티 함수

#### 아티스트 이름 정규화
```typescript
// functions/src/utils/artistNormalization.ts
export function normalizeArtistName(name: string): string {
  // 구현 내용 (섹션 14.2 참조)
}

export function createCacheKey(prefix: string, artistName: string): string {
  return `${prefix}:${normalizeArtistName(artistName)}`;
}

export function createComparisonCacheKey(artist1: string, artist2: string): string {
  const n1 = normalizeArtistName(artist1);
  const n2 = normalizeArtistName(artist2);
  const sorted = [n1, n2].sort();
  return `comparison:${sorted[0]}:${sorted[1]}`;
}
```

#### 스키마 검증
```typescript
// functions/src/utils/schemaValidation.ts
export function validateAIResponse<T>(
  schema: ZodSchema<T>,
  data: unknown,
  fallback: T,
  context: string = 'unknown'
): ValidationResult<T> {
  // 구현 내용 (섹션 14.3 참조)
}
```

#### 지수 백오프
```typescript
// functions/src/utils/retryStrategy.ts
export async function withExponentialBackoff<T>(
  fn: () => Promise<T>,
  config: RetryConfig = GEMINI_RETRY_CONFIG
): Promise<T> {
  // 구현 내용 (섹션 10.3 참조)
}
```

---

## 7. 캐싱 전략

### 7.1 3-Tier 스토리지 아키텍처

```
TIER 1: Memory Cache (Optional)
  ↓ Cache Miss
TIER 2: Firestore Session Cache (24시간 TTL)
  ↓ Cache Miss
TIER 3: Firestore Knowledge Base (영구 저장)
  ↓ Knowledge Miss
AI Service (Gemini API)
```

### 7.2 캐시 키 생성 규칙

- 아티스트 이름: 정규화 필수
- 비교 분석: 순서 무관 (정렬된 키 사용)
- 검색 결과: 쿼리 해시 사용

### 7.3 캐시 무효화 전략

- TTL 기반 자동 삭제 (24시간)
- 데이터 신선도 확인 (Knowledge Base)
- 백그라운드 갱신 (Stale-While-Revalidate)

---

## 8. 에러 처리 및 폴백

### 8.1 에러 처리 계층

```
1. API 호출 시도
   ↓ 실패
2. 지수 백오프 재시도 (재시도 가능한 에러만)
   ↓ 실패
3. 캐시 데이터 확인
   ↓ 없음
4. Knowledge Base 확인
   ↓ 없음
5. Mock 데이터 반환
```

### 8.2 폴백 데이터

```typescript
export const DEFAULT_FALLBACKS = {
  dashboard: {
    radar: { market: 50, critical: 50, historical: 50, social: 50, institutional: 50 },
    trajectory: [
      { year: '2020', value: 50 },
      { year: '2021', value: 50 },
      // ...
    ],
    description: '데이터를 가져오는 중 오류가 발생했습니다.',
    nationality: 'Unknown',
    birthYear: 0
  }
};
```

### 8.3 에러 로깅

- Firebase Functions Logger 사용
- 에러 컨텍스트 포함 (아티스트 이름, 요청 ID 등)
- 민감한 정보 제외

---

## 9. 보안 구현

### 9.1 API 키 관리

```typescript
// 환경 변수 사용
const geminiApiKeyParam = defineString("GEMINI_API_KEY", {
  default: "",
});

// 다중 소스 폴백
function getApiKey(): string {
  return geminiApiKeyParam.value() || 
         functions.config().gemini?.api_key || 
         process.env.GEMINI_API_KEY || 
         '';
}
```

### 9.2 보안 헤더

```typescript
function setSecurityHeaders(res: any) {
  res.set({
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
}
```

### 9.3 입력 검증

- Zod 스키마 검증 필수
- 아티스트 이름 정규화
- SQL Injection 방지 (Firestore 사용으로 자동 방지)
- XSS 방지 (React 자동 이스케이프)

### 9.4 Firestore 보안 규칙

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 캐시 컬렉션: 공개 읽기/쓰기
    match /{collection}/{document=**} {
      allow read, write: if true;
    }
    
    // 채팅: 읽기/생성만 허용
    match /chats/{chatId} {
      allow read, create: if true;
      allow update, delete: if false;
    }
  }
}
```

---

## 10. 성능 최적화

### 10.1 프론트엔드 최적화

- **Lazy Loading**: IntersectionObserver 기반
- **이미지 최적화**: 지연 로딩, 결정론적 플레이스홀더
- **코드 스플리팅**: Vite 자동 코드 스플리팅
- **프리로딩**: Connected Tab 진입 시 예측 프리로딩

### 10.2 백엔드 최적화

- **콜드 스타트 최적화**: minInstances 설정
- **캐싱**: 3-Tier 스토리지 아키텍처
- **병렬 처리**: Promise.all 사용
- **지수 백오프**: Rate Limit 대응

### 10.3 네트워크 최적화

- **Request Deduplication**: 중복 요청 방지
- **압축**: Gzip 압축 (Firebase Hosting 자동)
- **CDN**: Firebase Hosting CDN 활용

---

## 11. 배포 및 운영

### 11.1 배포 프로세스

#### 프론트엔드 배포
```bash
# 빌드
npm run build

# Firebase Hosting 배포
firebase deploy --only hosting
```

#### 백엔드 배포
```bash
cd functions
npm run build
firebase deploy --only functions
```

### 11.2 환경 변수 설정

```bash
# Firebase Functions 환경 변수 설정
firebase functions:config:set \
  gemini.api_key="YOUR_API_KEY" \
  google_cse.api_key="YOUR_API_KEY" \
  google_cse.id="YOUR_SEARCH_ENGINE_ID"
```

### 11.3 모니터링

- **Firebase Functions 로그**: Cloud Logging 통합
- **에러 추적**: Firebase Crashlytics (향후)
- **성능 모니터링**: Firebase Performance Monitoring (향후)

### 11.4 백업 및 복구

- **Firestore**: 자동 백업 (향후 설정)
- **Cloud Storage**: 버전 관리 활성화

---

## 12. 부록

### 12.1 코드 스타일 가이드

- **TypeScript**: strict 모드 사용
- **ESLint**: Airbnb 설정 기반
- **Prettier**: 자동 포맷팅

### 12.2 테스트 전략

- **단위 테스트**: Vitest 사용
- **통합 테스트**: 주요 API 엔드포인트
- **E2E 테스트**: Playwright (향후)

### 12.3 문서화

- **코드 주석**: JSDoc 형식
- **API 문서**: 자동 생성 (향후)
- **아키텍처 문서**: 다이어그램 포함

### 12.4 참조 문서

- BRD v1.2: 비즈니스 요구사항 문서
- SRD v1.0: 시스템 요구사항 문서
- Firebase 문서: https://firebase.google.com/docs
- Google Gemini API 문서: https://ai.google.dev/docs

### 12.5 변경 이력

| 버전 | 날짜 | 변경 내용 | 작성자 |
|-----|------|----------|--------|
| 1.1 | 2025-01 | 데이터베이스 스키마 상세화 (필드 제약사항, 인덱스 요구사항 추가), 데이터 타입 정의 구체화 (Zod 스키마 포함) | AI Assistant |
| 1.0 | 2025-01 | 초기 작성 | AI Assistant |

---

**문서 작성일**: 2025년 1월  
**작성자**: AI Assistant  
**검토 상태**: 초기 작성 완료  
**다음 검토 예정일**: 프로젝트 진행에 따라 업데이트  
**문서 버전**: 1.0

---

*Curator's Odysseia - Data Driven Art Archive*  
*© 2025 All Rights Reserved*

