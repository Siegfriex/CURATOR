# Curator's Odysseia - 시스템 요구사항 문서 (SRD)

**문서 버전**: 1.1  
**최종 업데이트**: 2025년 1월  
**프로젝트명**: Curator's Odysseia  
**부제**: Data Driven Art Archive  
**문서 유형**: System Requirements Document (SRD)  
**기준 문서**: BRD v1.2  
**상태**: 초기 작성

---

## 목차

1. [문서 개요](#1-문서-개요)
2. [시스템 개요](#2-시스템-개요)
3. [기능 요구사항](#3-기능-요구사항)
4. [비기능 요구사항](#4-비기능-요구사항)
5. [시스템 아키텍처 요구사항](#5-시스템-아키텍처-요구사항)
6. [데이터 요구사항](#6-데이터-요구사항)
7. [인터페이스 요구사항](#7-인터페이스-요구사항)
8. [보안 요구사항](#8-보안-요구사항)
9. [성능 요구사항](#9-성능-요구사항)
10. [사용성 요구사항](#10-사용성-요구사항)
11. [호환성 요구사항](#11-호환성-요구사항)
12. [유지보수 요구사항](#12-유지보수-요구사항)
13. [제약사항](#13-제약사항)
14. [부록](#14-부록)

---

## 1. 문서 개요

### 1.1 문서 목적

본 문서는 Curator's Odysseia 시스템의 시스템 요구사항을 정의합니다. BRD(Business Requirements Document)의 비즈니스 요구사항을 시스템 관점에서 기술적으로 구체화하여, 개발팀이 시스템을 설계하고 구현할 수 있도록 합니다.

### 1.2 문서 범위

본 문서는 다음을 포함합니다:
- 시스템의 기능적 요구사항
- 시스템의 비기능적 요구사항
- 시스템 아키텍처 요구사항
- 데이터 및 인터페이스 요구사항
- 보안, 성능, 사용성 요구사항

### 1.3 대상 독자

- 시스템 아키텍트
- 개발자
- QA 엔지니어
- 프로젝트 매니저
- 기술 리뷰어

### 1.4 참조 문서

- BRD v1.2: 비즈니스 요구사항 문서
- TSD v1.0: 기술 명세 문서 (본 문서와 함께 작성됨)

---

## 2. 시스템 개요

### 2.1 시스템 목적

Curator's Odysseia는 Google Gemini 2.5 Flash와 Search Grounding을 활용하여 아티스트의 가치를 데이터로 분석하고 시각화하는 인터랙티브 웹 플랫폼입니다. 27가지 내러티브 조합과 5가지 메트릭을 기반으로 아티스트를 평가하고 비교 분석합니다.

### 2.2 시스템 범위

#### 포함되는 기능
- 아티스트 대시보드 (메트릭 시각화)
- 아티스트 비교 분석
- AI 큐레이토리얼 리포트 생성
- 타임라인 시각화
- 채팅 인터페이스
- 게임 프로모션 기능 (향후)

#### 제외되는 기능
- 사용자 인증/인가 (현재 단계)
- 결제 시스템
- 소셜 미디어 통합

### 2.3 시스템 컨텍스트

```
┌─────────────────────────────────────────────────────────────┐
│                    시스템 컨텍스트 다이어그램                 │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐                                          │
│  │   사용자     │                                          │
│  │ (브라우저)   │                                          │
│  └──────┬───────┘                                          │
│         │                                                   │
│         ▼                                                   │
│  ┌──────────────────────────────────────┐                  │
│  │   Curator's Odysseia Web App         │                  │
│  │   (React + TypeScript)               │                  │
│  └──────┬───────────────────────────────┘                  │
│         │                                                   │
│         ├─────────────────┬───────────────┐                │
│         ▼                 ▼               ▼                │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐            │
│  │Firebase  │    │Firestore │    │Cloud     │            │
│  │Functions │    │(캐싱)    │    │Storage   │            │
│  └────┬─────┘    └──────────┘    └──────────┘            │
│       │                                                   │
│       ├─────────────────┬───────────────┐                │
│       ▼                 ▼               ▼                │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐            │
│  │Gemini API│    │Google CSE │    │Wikipedia │            │
│  │          │    │API        │    │API       │            │
│  └──────────┘    └──────────┘    └──────────┘            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. 기능 요구사항

### 3.1 FR-001: 아티스트 대시보드 조회

**우선순위**: 높음  
**복잡도**: 중간  
**추정 작업량**: 5일

#### 설명
사용자가 아티스트 이름을 입력하여 해당 아티스트의 대시보드 데이터를 조회할 수 있어야 합니다. 대시보드는 5축 레이더 차트와 시간별 궤적 차트를 포함합니다.

#### 입력
- `artistName` (string, required): 아티스트 이름
  - 최소 길이: 1자
  - 최대 길이: 100자
  - 허용 문자: 영문, 한글, 숫자, 공백, 특수문자 (제한적)
  - 예시: "Henri Matisse", "앙리 마티스", "Pablo Picasso"

#### 처리 흐름
```
1. 입력 검증
   ├─ artistName이 비어있지 않은지 확인
   └─ 특수문자 제거 및 정규화

2. 아티스트 이름 정규화
   ├─ 소문자 변환
   ├─ 공백 정규화 (연속 공백 → 단일 공백)
   ├─ 한글 별칭 매핑 (예: "앙리 마티스" → "henri matisse")
   └─ 캐시 키 생성: "dashboard:{normalizedName}"

3. 캐시 확인 (3-Tier)
   ├─ TIER 1: Memory Cache 확인 (Optional)
   ├─ TIER 2: Firestore Session Cache 확인 (24시간 TTL)
   │   └─ 캐시 히트 시 즉시 반환
   └─ TIER 3: Firestore Knowledge Base 확인 (영구 저장)
       └─ 데이터 신선도 확인 후 반환 또는 백그라운드 갱신

4. AI 호출 (캐시 미스 시)
   ├─ Google Custom Search API로 컨텍스트 수집
   ├─ Gemini 2.5 Flash API 호출
   │   ├─ 지수 백오프 재시도 (최대 3회)
   │   └─ Rate Limit 대응
   └─ 응답 파싱 및 스키마 검증 (Zod)

5. 데이터 변환 및 저장
   ├─ AI 응답을 DashboardData 형식으로 변환
   ├─ Knowledge Base에 영구 저장
   ├─ Session Cache에 저장 (24시간 TTL)
   └─ 결과 반환
```

#### 출력
```typescript
{
  name: string;                    // 원본 아티스트 이름
  nationality: string;             // 국적 (예: "French", "Korean")
  birthYear: number;              // 출생년도 (1000-2100)
  deathYear?: number;             // 사망년도 (선택)
  description: string;            // 아티스트 설명 (최대 500자)
  radarData: AxisData[];          // 5개 메트릭 데이터
  trajectory: TimeSeriesPoint[];   // 시계열 궤적 데이터
  imageUrl?: string;               // 프로필 이미지 URL
  _source: 'cache' | 'knowledge' | 'ai';  // 데이터 출처
  _validationStatus?: 'validated' | 'fallback';  // 검증 상태
}

AxisData {
  axis: string;        // 메트릭 이름 ("Market Value", "Critical Acclaim", etc.)
  value: number;      // 값 (0-100)
  fullMark: number;   // 최대값 (100)
}

TimeSeriesPoint {
  date: string;       // 연도 (YYYY 형식)
  value: number;      // 값 (0-100)
}
```

#### 목표 달성 조건

**성능 목표**:
- 캐시 히트 시 응답 시간: ≤ 2초
- AI 호출 시 응답 시간: ≤ 10초
- 캐시 히트율: ≥ 80%

**정확도 목표**:
- 스키마 검증 통과율: ≥ 95%
- 데이터 품질: 'verified' 또는 'ai_generated' 등급

**비용 목표**:
- AI 호출 비용: Knowledge Base 활용으로 80% 절감
- 중복 호출 방지: 이름 정규화로 30-50% 절감

#### 달성 전략

**캐싱 전략**:
1. 3-Tier 스토리지 아키텍처 구현
   - TIER 1: Memory Cache (Optional, Cloud Memorystore)
   - TIER 2: Session Cache (Firestore, 24시간 TTL)
   - TIER 3: Knowledge Base (Firestore, 영구 저장)
2. 아티스트 이름 정규화로 캐시 키 일관성 확보
3. Stale-While-Revalidate 패턴으로 사용자 경험 개선

**에러 처리 전략**:
1. 지수 백오프로 Rate Limit 대응
2. Zod 스키마 검증으로 데이터 무결성 확보
3. 폴백 데이터 제공으로 서비스 가용성 유지

**성능 최적화 전략**:
1. Firebase Functions 콜드 스타트 최적화 (minInstances: 1)
2. 병렬 처리: Google Search와 Gemini API 동시 호출
3. 프리로딩: Connected Tab 진입 시 예측 프리로딩

#### 사전 조건
- 사용자가 유효한 아티스트 이름을 입력해야 함
- Firebase Functions가 정상 작동해야 함
- Gemini API 키가 설정되어 있어야 함

#### 사후 조건
- 대시보드 데이터가 화면에 표시됨
- 데이터가 Knowledge Base에 영구 저장됨
- Session Cache에 24시간 TTL로 저장됨
- 접근 기록이 업데이트됨 (lastAccessed, accessCount)

#### 예외 처리

| 예외 상황 | 처리 방법 | 사용자 피드백 |
|----------|----------|-------------|
| 아티스트를 찾을 수 없음 | Mock 데이터 반환 | "아티스트 정보를 찾을 수 없습니다. 기본 데이터를 표시합니다." |
| API 호출 실패 (Rate Limit) | 지수 백오프 재시도 (최대 3회) | 재시도 중 표시 |
| API 호출 실패 (기타) | 캐시된 데이터 반환, 없으면 Mock 데이터 | "최신 데이터를 가져오는 중 오류가 발생했습니다. 캐시된 데이터를 표시합니다." |
| 스키마 검증 실패 | 폴백 데이터 사용 | "데이터 검증 중 오류가 발생했습니다. 기본 데이터를 사용합니다." |
| 네트워크 오류 | 오프라인 모드 표시 (PWA) | "오프라인 모드 - 캐시된 데이터를 표시합니다." |

#### 테스트 케이스

**TC-FR-001-01: 정상 조회 (캐시 히트)**
- 입력: "Henri Matisse"
- 예상 결과: 캐시에서 데이터 반환, 응답 시간 ≤ 2초
- 검증: _source === 'cache'

**TC-FR-001-02: 정상 조회 (AI 호출)**
- 입력: "새로운 아티스트" (캐시에 없음)
- 예상 결과: AI API 호출, Knowledge Base 저장, 응답 시간 ≤ 10초
- 검증: _source === 'ai', Knowledge Base에 저장 확인

**TC-FR-001-03: 이름 정규화**
- 입력: "Henri  Matisse", "henri matisse", "Matisse, Henri"
- 예상 결과: 모두 동일한 캐시 키로 처리
- 검증: normalizeArtistName() 결과 일치

**TC-FR-001-04: 한글 별칭 처리**
- 입력: "앙리 마티스", "마티스"
- 예상 결과: "henri_matisse"로 정규화
- 검증: normalizedName === 'henri_matisse'

**TC-FR-001-05: 에러 처리 (API 실패)**
- 입력: 유효한 아티스트 이름
- 시뮬레이션: API 호출 실패
- 예상 결과: 캐시 데이터 또는 Mock 데이터 반환
- 검증: 에러 없이 데이터 표시

---

### 3.2 FR-002: 아티스트 비교 분석

**우선순위**: 높음  
**복잡도**: 높음  
**추정 작업량**: 8일

#### 설명
사용자가 두 아티스트를 선택하여 비교 분석 결과를 조회할 수 있어야 합니다. 비교 분석은 듀얼 레이더 차트, 비교 궤적 데이터, AI 생성 비교 리포트를 포함합니다.

#### 입력
- `artist1` (string, required): 첫 번째 아티스트 이름
- `artist2` (string, required): 두 번째 아티스트 이름
- 두 아티스트 이름이 동일하면 안 됨

#### 처리 흐름
```
1. 입력 검증
   ├─ 두 아티스트 이름이 모두 제공되었는지 확인
   └─ 두 이름이 다른지 확인

2. 아티스트 이름 정규화 및 키 생성
   ├─ 각 아티스트 이름 정규화
   ├─ 정렬된 키 생성: [normalized1, normalized2].sort().join(':')
   └─ 캐시 키: "comparison:{sortedKey}"

3. 캐시 확인 (3-Tier)
   ├─ TIER 1: Memory Cache 확인 (Optional)
   ├─ TIER 2: Session Cache 확인 (24시간 TTL)
   └─ TIER 3: Permanent Comparisons 확인 (영구 저장)
       └─ 캐시 히트 시 접근 횟수 증가 및 반환

4. AI 호출 (캐시 미스 시)
   ├─ Google Custom Search로 두 아티스트 컨텍스트 수집
   ├─ Gemini API로 비교 분석 생성
   │   ├─ 듀얼 레이더 차트 데이터 생성
   │   ├─ 비교 궤적 데이터 생성 (연령대별)
   │   └─ 비교 리포트 텍스트 생성
   └─ 27 Combinations 분류 수행

5. 데이터 저장
   ├─ Permanent Comparisons에 영구 저장
   ├─ Session Cache에 저장 (24시간 TTL)
   └─ 결과 반환
```

#### 출력
```typescript
{
  artist1: string;                    // 첫 번째 아티스트 이름
  artist2: string;                    // 두 번째 아티스트 이름
  radarData: {
    artist1: AxisData[];              // 첫 번째 아티스트 레이더 데이터
    artist2: AxisData[];              // 두 번째 아티스트 레이더 데이터
  };
  trajectory: ComparativeTrajectory;   // 비교 궤적 데이터
  report: string;                      // AI 생성 비교 리포트 (마크다운)
  combinationType?: string;            // 27 Combinations 분류
  _source: 'cache' | 'permanent' | 'ai';
}

ComparativeTrajectory {
  artist1: string;
  artist2: string;
  data: ComparativeDataPoint[];
}

ComparativeDataPoint {
  age: number;              // 연령대 (20, 30, 40, 50, 60, 70, 80)
  a1_total: number;         // 아티스트 1 총점 (0-100)
  a1_context?: string;       // 아티스트 1 해당 연령대 컨텍스트
  a2_total: number;         // 아티스트 2 총점 (0-100)
  a2_context?: string;      // 아티스트 2 해당 연령대 컨텍스트
}
```

#### 목표 달성 조건

**성능 목표**:
- 캐시 히트 시 응답 시간: ≤ 5초
- AI 호출 시 응답 시간: ≤ 30초
- 캐시 히트율: ≥ 70%

**정확도 목표**:
- 비교 분석 리포트 품질: 전문 큐레이터 수준
- 궤적 데이터 정확도: ±5% 오차 범위

**비용 목표**:
- AI 호출 비용: 영구 저장으로 80% 절감
- 중복 호출 방지: 순서 무관 키로 100% 방지

#### 달성 전략

**캐싱 전략**:
1. 영구 저장소 (Permanent Comparisons) 우선 활용
   - 비교 분석은 재사용 가치가 높음
   - 조합별로 영구 저장하여 AI 호출 최소화
2. 순서 무관 키 생성으로 중복 방지
   - "Picasso vs Matisse"와 "Matisse vs Picasso" 동일 처리
3. 접근 횟수 추적으로 인기 비교 조합 분석

**AI 호출 최적화 전략**:
1. Google Custom Search API로 컨텍스트 사전 수집
2. 병렬 처리: 두 아티스트 정보 동시 수집
3. 점진적 로딩: 기본 구조 먼저 반환 후 상세 데이터 점진적 로딩 (향후)

**데이터 품질 전략**:
1. Zod 스키마 검증으로 데이터 무결성 확보
2. 27 Combinations 분류로 패턴 분석
3. 접근 횟수 기반 인기 조합 분석

#### 사전 조건
- 두 아티스트 이름이 모두 입력되어야 함
- 두 아티스트 이름이 서로 달라야 함
- Firebase Functions가 정상 작동해야 함

#### 사후 조건
- 비교 분석 결과가 화면에 표시됨
- 비교 데이터가 Permanent Comparisons에 영구 저장됨
- Session Cache에 24시간 TTL로 저장됨
- 접근 기록이 업데이트됨 (accessCount, lastAccessedAt)

#### 예외 처리

| 예외 상황 | 처리 방법 | 사용자 피드백 |
|----------|----------|-------------|
| 동일한 아티스트 선택 | 에러 메시지 표시 | "서로 다른 두 아티스트를 선택해주세요." |
| 아티스트 중 하나를 찾을 수 없음 | 부분 비교 데이터 반환 | "일부 아티스트 정보를 찾을 수 없습니다." |
| API 호출 실패 | 캐시된 데이터 반환 | "최신 비교 데이터를 가져오는 중 오류가 발생했습니다." |
| 궤적 데이터 생성 실패 | 레이더 차트만 표시 | "궤적 데이터 생성에 실패했습니다. 레이더 차트를 확인해주세요." |

#### 테스트 케이스

**TC-FR-002-01: 정상 비교 분석 (영구 저장 히트)**
- 입력: "Picasso", "Matisse" (이미 영구 저장소에 있음)
- 예상 결과: 영구 저장소에서 데이터 반환, 응답 시간 ≤ 5초
- 검증: _source === 'permanent', accessCount 증가 확인

**TC-FR-002-02: 정상 비교 분석 (AI 호출)**
- 입력: "새로운 아티스트1", "새로운 아티스트2"
- 예상 결과: AI API 호출, 영구 저장소 저장, 응답 시간 ≤ 30초
- 검증: _source === 'ai', Permanent Comparisons에 저장 확인

**TC-FR-002-03: 순서 무관 키 생성**
- 입력: ("Picasso", "Matisse"), ("Matisse", "Picasso")
- 예상 결과: 동일한 캐시 키로 처리
- 검증: createComparisonCacheKey() 결과 일치

**TC-FR-002-04: 27 Combinations 분류**
- 입력: 유효한 두 아티스트
- 예상 결과: combinationType 필드에 분류 결과 포함
- 검증: combinationType이 유효한 27 Combinations 중 하나인지 확인

---

### 3.3 FR-003: AI 큐레이토리얼 리포트 생성

**우선순위**: 중간  
**복잡도**: 중간  
**추정 작업량**: 4일

#### 설명
사용자가 아티스트에 대한 AI 생성 큐레이토리얼 리포트를 조회할 수 있어야 합니다. 리포트는 마크다운 형식으로 생성되며, 타이핑 애니메이션으로 표시됩니다.

#### 입력
- `artistName` (string, required): 아티스트 이름

#### 처리 흐름
```
1. 입력 검증
   └─ artistName이 비어있지 않은지 확인

2. 아티스트 이름 정규화
   └─ 캐시 키 생성: "report:{normalizedName}"

3. 캐시 확인
   ├─ Session Cache 확인 (24시간 TTL)
   └─ Knowledge Base 확인 (artists_knowledge.reports.curatorial)

4. AI 호출 (캐시 미스 시)
   ├─ Google Custom Search로 컨텍스트 수집
   ├─ Gemini API로 리포트 생성
   │   ├─ 마크다운 형식 텍스트 생성
   │   ├─ 최소 500자, 최대 5000자
   │   └─ 큐레이토리얼 관점의 전문적 분석
   └─ 리포트 버전 관리 (version: 1)

5. 데이터 저장
   ├─ Knowledge Base에 저장 (artists_knowledge.reports.curatorial)
   ├─ Session Cache에 저장 (24시간 TTL)
   └─ 결과 반환
```

#### 출력
```typescript
{
  report: string;              // 마크다운 형식 리포트 텍스트 (500-5000자)
  generatedAt: string;         // 생성 시간 (ISO 8601 형식)
  version: number;             // 리포트 버전 (1부터 시작)
  _source: 'cache' | 'knowledge' | 'ai';
}
```

#### 목표 달성 조건

**성능 목표**:
- 캐시 히트 시 응답 시간: ≤ 2초
- AI 호출 시 응답 시간: ≤ 15초
- 캐시 히트율: ≥ 75%

**품질 목표**:
- 리포트 길이: 500-5000자
- 마크다운 형식 준수율: 100%
- 전문성: 큐레이토리얼 관점의 분석 포함

**비용 목표**:
- AI 호출 비용: Knowledge Base 활용으로 80% 절감

#### 달성 전략

**캐싱 전략**:
1. Knowledge Base에 리포트 영구 저장
2. 리포트 버전 관리로 업데이트 추적
3. 7일 TTL로 세션 캐시 관리

**AI 호출 최적화 전략**:
1. Google Custom Search로 컨텍스트 사전 수집
2. 프롬프트 최적화로 응답 품질 향상
3. 리포트 길이 제한으로 토큰 사용량 최적화

**사용자 경험 전략**:
1. 타이핑 애니메이션으로 읽기 경험 향상
2. 마크다운 렌더링으로 가독성 확보
3. 로딩 인디케이터로 진행 상황 표시

#### 사전 조건
- 아티스트 이름이 입력되어야 함
- Firebase Functions가 정상 작동해야 함

#### 사후 조건
- 리포트가 화면에 타이핑 애니메이션으로 표시됨
- 리포트가 Knowledge Base에 저장됨
- 리포트 버전이 기록됨

#### 예외 처리

| 예외 상황 | 처리 방법 | 사용자 피드백 |
|----------|----------|-------------|
| 리포트 생성 실패 | 캐시된 리포트 반환 | "최신 리포트를 생성하는 중 오류가 발생했습니다. 이전 리포트를 표시합니다." |
| 리포트가 너무 짧음 | 재생성 또는 기본 템플릿 사용 | - |
| 리포트가 너무 김 | 자동 요약 또는 잘림 | - |

#### 테스트 케이스

**TC-FR-003-01: 정상 리포트 생성**
- 입력: "Henri Matisse"
- 예상 결과: 마크다운 형식 리포트 생성, 500-5000자 범위
- 검증: 리포트 길이, 마크다운 형식 준수

**TC-FR-003-02: 캐시 히트**
- 입력: "Henri Matisse" (이미 캐시에 있음)
- 예상 결과: 캐시에서 리포트 반환, 응답 시간 ≤ 2초
- 검증: _source === 'cache'

---

### 3.4 FR-004: 타임라인 시각화

**우선순위**: 중간  
**복잡도**: 높음  
**추정 작업량**: 7일

#### 설명
사용자가 아티스트의 생애 타임라인을 가로 스크롤 형식으로 탐색할 수 있어야 합니다. 타임라인은 Era(시대)별로 그룹화되며, 각 이벤트 카드는 호버 시 확장되어 상세 정보와 이미지를 표시합니다.

#### 입력
- `artistName` (string, required): 아티스트 이름

#### 처리 흐름
```
1. 입력 검증
   └─ artistName이 비어있지 않은지 확인

2. 아티스트 이름 정규화
   └─ 캐시 키 생성: "timeline:{normalizedName}"

3. 캐시 확인
   ├─ Session Cache 확인 (24시간 TTL)
   └─ Knowledge Base 확인 (artists_knowledge.reports.timeline)

4. AI 호출 (캐시 미스 시)
   ├─ Google Custom Search로 컨텍스트 수집
   ├─ Gemini API로 타임라인 생성
   │   ├─ Era별로 그룹화
   │   ├─ 각 Era에 최소 1개 이벤트 포함
   │   └─ 이벤트 카테고리 분류 (Masterpiece, Personal, Scandal, Exhibition)
   └─ 이미지 검색 (각 이벤트별)

5. 데이터 저장
   ├─ Knowledge Base에 저장
   ├─ Session Cache에 저장 (24시간 TTL)
   └─ 결과 반환

6. 프론트엔드 렌더링
   ├─ Era별 가로 스크롤 인터페이스
   ├─ 카드 호버 시 확장 애니메이션
   └─ 이미지 지연 로딩
```

#### 출력
```typescript
{
  eras: Era[];                  // Era 배열 (최소 1개)
  _source: 'cache' | 'knowledge' | 'ai';
}

Era {
  name: string;                // Era 이름 (예: "Early Career")
  startYear: number;           // 시작 연도 (1000-2100)
  endYear: number;             // 종료 연도 (1000-2100)
  events: TimelineEvent[];     // 이벤트 배열 (최소 1개)
}

TimelineEvent {
  year: number;                // 이벤트 연도 (1000-2100)
  title: string;               // 이벤트 제목 (1-200자)
  category: 'Masterpiece' | 'Personal' | 'Scandal' | 'Exhibition';
  description: string;          // 이벤트 설명 (1-500자)
  impactScore: number;          // 영향도 점수 (0-100)
  auctionHigh: number;          // 경매 최고가 (0-100)
  auctionLow: number;           // 경매 최저가 (0-100)
  imageUrl?: string;           // 이벤트 이미지 URL
}
```

#### 목표 달성 조건

**성능 목표**:
- 캐시 히트 시 응답 시간: ≤ 3초
- AI 호출 시 응답 시간: ≤ 15초
- 이미지 로딩 시간: 카드 호버 시 ≤ 1초

**품질 목표**:
- Era 최소 개수: 1개
- Era당 이벤트 최소 개수: 1개
- 이미지 로딩 성공률: ≥ 80%

**사용자 경험 목표**:
- 가로 스크롤 부드러움: 60fps 유지
- 카드 확장 애니메이션: 300ms 이내
- 이미지 로딩 지연: 사용자 경험 저하 없음

#### 달성 전략

**데이터 구조 전략**:
1. Era별 그룹화로 타임라인 구조화
2. 이벤트 카테고리 분류로 필터링 가능
3. 영향도 점수로 중요 이벤트 강조

**성능 최적화 전략**:
1. 이미지 지연 로딩: 카드 호버 시에만 로드
2. 가상 스크롤링: 화면에 보이는 Era만 렌더링
3. 이미지 캐싱: Cloud Storage에 저장

**사용자 경험 전략**:
1. 가로 스크롤 인터페이스로 직관적 탐색
2. 카드 호버 확장으로 상세 정보 제공
3. Data Sonification으로 오디오 피드백 (향후)

#### 사전 조건
- 아티스트 이름이 입력되어야 함
- 타임라인 데이터가 생성 가능해야 함

#### 사후 조건
- 타임라인이 가로 스크롤 형식으로 표시됨
- Era별로 그룹화된 이벤트가 표시됨
- 카드 호버 시 확장 및 이미지 로딩됨

#### 예외 처리

| 예외 상황 | 처리 방법 | 사용자 피드백 |
|----------|----------|-------------|
| 타임라인 데이터 없음 | 기본 Era 1개 생성 | "타임라인 데이터를 생성하는 중입니다." |
| 이미지 로딩 실패 | 플레이스홀더 이미지 표시 | - |
| Era가 없음 | 전체 기간을 하나의 Era로 처리 | - |

#### 테스트 케이스

**TC-FR-004-01: 정상 타임라인 생성**
- 입력: "Henri Matisse"
- 예상 결과: 최소 1개 Era, Era당 최소 1개 이벤트
- 검증: Era 구조, 이벤트 카테고리 분류

**TC-FR-004-02: 가로 스크롤 동작**
- 입력: 유효한 타임라인 데이터
- 예상 결과: 부드러운 가로 스크롤, 60fps 유지
- 검증: 스크롤 성능, 애니메이션 부드러움

---

### 3.5 FR-005: 채팅 인터페이스

**우선순위**: 중간  
**복잡도**: 중간  
**추정 작업량**: 5일

#### 설명
사용자가 아티스트에 대해 자연어 질문을 하고 AI 응답을 받을 수 있어야 합니다. 채팅 히스토리는 Firestore에 저장되며, 컨텍스트를 유지하여 대화를 이어갈 수 있습니다.

#### 입력
- `artistName` (string, required): 아티스트 이름
- `message` (string, required): 사용자 메시지 (1-2000자)
- `chatId` (string, optional): 기존 채팅 세션 ID

#### 처리 흐름
```
1. 입력 검증
   ├─ artistName과 message가 제공되었는지 확인
   └─ message 길이 검증 (1-2000자)

2. 채팅 세션 확인/생성
   ├─ chatId가 제공된 경우: 기존 세션 조회
   └─ chatId가 없는 경우: 새 세션 생성

3. 채팅 히스토리 조회
   ├─ Firestore에서 채팅 히스토리 조회
   ├─ 최대 100개 메시지 제한
   └─ 시간순 정렬 (클라이언트 사이드)

4. AI 응답 생성
   ├─ 채팅 히스토리를 컨텍스트로 포함
   ├─ Gemini API 호출
   │   ├─ 아티스트 정보를 컨텍스트로 포함
   │   └─ 자연어 대화 형식으로 응답 생성
   └─ 응답 길이 제한 (최대 2000자)

5. 채팅 히스토리 저장
   ├─ 사용자 메시지 추가
   ├─ AI 응답 추가
   └─ Firestore에 저장 (chats 컬렉션)
```

#### 출력
```typescript
{
  response: string;            // AI 응답 메시지 (1-2000자)
  chatId: string;              // 채팅 세션 ID
  timestamp: string;           // 응답 시간 (ISO 8601)
}
```

#### 목표 달성 조건

**성능 목표**:
- AI 응답 시간: ≤ 10초
- 채팅 히스토리 로딩 시간: ≤ 2초
- 메시지 저장 시간: ≤ 1초

**품질 목표**:
- 응답 관련성: 아티스트와 관련된 답변 제공
- 컨텍스트 유지: 이전 대화 내용 반영
- 응답 길이: 적절한 길이 (100-2000자)

**사용자 경험 목표**:
- 실시간 응답 느낌: 타이핑 애니메이션 (향후)
- 히스토리 표시: 이전 대화 내용 표시
- 에러 처리: 명확한 에러 메시지

#### 달성 전략

**컨텍스트 관리 전략**:
1. 채팅 히스토리 최대 100개 메시지 유지
2. 아티스트 정보를 시스템 프롬프트에 포함
3. 최근 대화 우선 반영

**성능 최적화 전략**:
1. 채팅 히스토리 클라이언트 사이드 정렬 (인덱스 불필요)
2. 메시지 배열 길이 제한으로 쿼리 성능 유지
3. 병렬 처리: 히스토리 조회와 AI 호출 분리

**사용자 경험 전략**:
1. 로딩 인디케이터로 응답 대기 표시
2. 메시지 시간 표시로 대화 흐름 파악
3. 스크롤 자동 이동으로 최신 메시지 표시

#### 사전 조건
- 아티스트가 선택되어 있어야 함
- 사용자 메시지가 입력되어야 함

#### 사후 조건
- AI 응답이 채팅 인터페이스에 표시됨
- 채팅 히스토리가 Firestore에 저장됨
- chatId가 반환되어 다음 메시지에 사용 가능

#### 예외 처리

| 예외 상황 | 처리 방법 | 사용자 피드백 |
|----------|----------|-------------|
| 메시지가 너무 김 | 길이 제한 메시지 | "메시지는 2000자 이하여야 합니다." |
| AI 응답 실패 | 재시도 또는 에러 메시지 | "응답을 생성하는 중 오류가 발생했습니다. 다시 시도해주세요." |
| 채팅 히스토리 로딩 실패 | 빈 히스토리로 시작 | "이전 대화를 불러오는 중 오류가 발생했습니다." |

#### 테스트 케이스

**TC-FR-005-01: 정상 채팅 응답**
- 입력: artistName="Henri Matisse", message="What is his most famous work?"
- 예상 결과: 관련성 있는 AI 응답, chatId 반환
- 검증: 응답 관련성, chatId 유효성

**TC-FR-005-02: 채팅 히스토리 유지**
- 입력: 동일 chatId로 연속 메시지
- 예상 결과: 이전 대화 내용 반영
- 검증: 컨텍스트 유지 확인

---

### 3.6 FR-006: 무한 스크롤 작가 목록

**우선순위**: 중간  
**복잡도**: 낮음  
**추정 작업량**: 3일

#### 설명
Connected Tab에서 작가 목록을 무한 스크롤로 동적으로 로드할 수 있어야 합니다. 사용자가 스크롤하면 자동으로 다음 페이지의 작가 목록이 로드됩니다.

#### 입력
- 스크롤 위치 (IntersectionObserver로 자동 감지)
- `offset` (number, 자동 계산): 현재 로드된 작가 수
- `limit` (number, 고정값): 한 번에 로드할 작가 수 (기본값: 20)

#### 처리 흐름
```
1. 초기 로딩
   ├─ offset=0, limit=20으로 첫 페이지 요청
   └─ 작가 목록 표시

2. 스크롤 감지
   ├─ IntersectionObserver로 하단 감지 영역 모니터링
   ├─ rootMargin: '100px' (미리 로딩)
   └─ 감지 영역 진입 시 다음 페이지 요청

3. 다음 페이지 요청
   ├─ offset = 현재 작가 수
   ├─ limit = 20 (고정)
   ├─ Firebase Functions 호출 (getArtistList)
   └─ 로딩 인디케이터 표시

4. 데이터 추가
   ├─ 기존 목록에 새 작가 목록 추가
   ├─ 중복 제거 (이름 기준)
   └─ 로딩 인디케이터 제거

5. 종료 조건
   ├─ hasMore === false인 경우 더 이상 요청하지 않음
   └─ 감지 영역 제거
```

#### 출력
```typescript
{
  artists: Artist[];          // 작가 배열 (최대 20개)
  hasMore: boolean;           // 더 많은 데이터가 있는지 여부
  _source: 'cache' | 'ai';
}

Artist {
  name: string;              // 작가 이름
  nationality: string;       // 국적
  birthYear: number;         // 출생년도
  imageUrl?: string;         // 프로필 이미지 URL
}
```

#### 목표 달성 조건

**성능 목표**:
- 초기 로딩 시간: ≤ 5초
- 다음 페이지 로딩 시간: ≤ 3초
- 스크롤 부드러움: 60fps 유지

**사용자 경험 목표**:
- 스크롤 감지 정확도: 100% (누락 없음)
- 로딩 인디케이터 표시: 로딩 중 명확히 표시
- 중복 방지: 동일 작가 중복 표시 없음

**데이터 목표**:
- 한 번에 로드할 작가 수: 20명
- 최대 작가 수: 제한 없음 (무한 확장)

#### 달성 전략

**스크롤 감지 전략**:
1. IntersectionObserver 사용으로 성능 최적화
2. rootMargin: '100px'로 미리 로딩하여 끊김 방지
3. 감지 영역은 grid 뷰에서만 렌더링

**성능 최적화 전략**:
1. Request Deduplication으로 중복 요청 방지
2. 캐싱으로 동일 offset/limit 조합 재사용
3. 이미지 지연 로딩으로 초기 로딩 시간 단축

**사용자 경험 전략**:
1. 로딩 인디케이터로 진행 상황 표시
2. 부드러운 스크롤 애니메이션
3. 에러 발생 시 재시도 버튼 제공

#### 사전 조건
- Connected Tab이 활성화되어 있어야 함
- Firebase Functions가 정상 작동해야 함

#### 사후 조건
- 작가 목록이 그리드 형식으로 표시됨
- 스크롤 시 자동으로 다음 페이지 로드됨
- 모든 작가가 로드되면 더 이상 요청하지 않음

#### 예외 처리

| 예외 상황 | 처리 방법 | 사용자 피드백 |
|----------|----------|-------------|
| 네트워크 오류 | 재시도 버튼 표시 | "작가 목록을 불러오는 중 오류가 발생했습니다. 다시 시도해주세요." |
| 더 이상 데이터 없음 | hasMore=false로 종료 | - |
| 중복 작가 발견 | 자동 제거 | - |

#### 테스트 케이스

**TC-FR-006-01: 초기 로딩**
- 입력: Connected Tab 진입
- 예상 결과: 첫 20명 작가 로드, 응답 시간 ≤ 5초
- 검증: artists.length === 20, hasMore === true

**TC-FR-006-02: 무한 스크롤 동작**
- 입력: 스크롤 다운
- 예상 결과: 다음 20명 작가 자동 로드
- 검증: 총 작가 수 증가, 중복 없음

**TC-FR-006-03: 스크롤 감지 정확도**
- 입력: 빠른 스크롤
- 예상 결과: 모든 페이지 누락 없이 로드
- 검증: 누락된 작가 없음

---

### 3.7 FR-007: 아티스트 이미지 검색

**우선순위**: 낮음  
**복잡도**: 낮음  
**추정 작업량**: 2일

#### 설명
아티스트 프로필 이미지를 Wikipedia API 또는 Google Custom Search Image API를 통해 검색하여 표시합니다. Wikipedia를 우선적으로 사용하며, 실패 시 Google Custom Search Image API를 사용합니다.

#### 입력
- `artistName` (string, required): 아티스트 이름

#### 처리 흐름
```
1. 입력 검증
   └─ artistName이 비어있지 않은지 확인

2. 캐시 확인
   ├─ 캐시 키: "images:wiki_image:{normalizedName}"
   └─ 캐시 히트 시 즉시 반환

3. Wikipedia API 검색
   ├─ API 호출: en.wikipedia.org/w/api.php
   ├─ 쿼리 파라미터:
   │   ├─ action=query
   │   ├─ titles={artistName}
   │   ├─ prop=pageimages
   │   ├─ pithumbsize=500
   │   └─ format=json
   └─ 이미지 URL 추출

4. Google Custom Search Image API 검색 (Wikipedia 실패 시)
   ├─ 쿼리: "portrait of {artistName}"
   ├─ searchType=image
   └─ 첫 번째 결과 이미지 URL 사용

5. 이미지 URL 캐싱
   ├─ Firestore images 컬렉션에 저장
   ├─ 캐시 키: "wiki_image:{normalizedName}" 또는 "google_image:{query}"
   └─ TTL: 24시간

6. 폴백 이미지 (모두 실패 시)
   └─ 결정론적 플레이스홀더: picsum.photos/seed/{artistName}/800/800?grayscale
```

#### 출력
```typescript
{
  imageUrl: string;           // 이미지 URL
  source: 'wikipedia' | 'google' | 'fallback';
  cached: boolean;           // 캐시에서 가져왔는지 여부
}
```

#### 목표 달성 조건

**성능 목표**:
- 캐시 히트 시 응답 시간: ≤ 1초
- Wikipedia 검색 시간: ≤ 3초
- Google 검색 시간: ≤ 5초

**성공률 목표**:
- Wikipedia 검색 성공률: ≥ 60%
- 전체 검색 성공률 (Wikipedia + Google): ≥ 90%
- 이미지 로딩 성공률: ≥ 95%

**비용 목표**:
- Google Custom Search Image API 호출: Wikipedia 우선으로 60% 감소
- 캐싱으로 중복 호출 방지

#### 달성 전략

**검색 우선순위 전략**:
1. Wikipedia API 우선 사용 (무료)
2. 실패 시 Google Custom Search Image API 사용
3. 모두 실패 시 결정론적 플레이스홀더 사용

**캐싱 전략**:
1. 이미지 URL을 Firestore에 캐싱 (24시간 TTL)
2. 캐시 키 일관성 확보 (이름 정규화)
3. 브라우저 캐싱 활용 (PWA)

**성능 최적화 전략**:
1. 이미지 지연 로딩으로 초기 로딩 시간 단축
2. 이미지 최적화 (크기 조정, 포맷 변환) - 향후
3. CDN 활용 (Cloud Storage) - 향후

#### 사전 조건
- 아티스트 이름이 입력되어야 함
- Wikipedia API 또는 Google Custom Search Image API가 사용 가능해야 함

#### 사후 조건
- 이미지 URL이 반환됨
- 이미지가 화면에 표시됨
- 이미지 URL이 캐시에 저장됨

#### 예외 처리

| 예외 상황 | 처리 방법 | 사용자 피드백 |
|----------|----------|-------------|
| Wikipedia 검색 실패 | Google Custom Search Image API 사용 | - |
| Google 검색 실패 | 결정론적 플레이스홀더 사용 | - |
| 이미지 로딩 실패 | 에러 이미지 표시 | - |
| 네트워크 오류 | 캐시된 이미지 사용 | - |

#### 테스트 케이스

**TC-FR-007-01: Wikipedia 이미지 검색 성공**
- 입력: "Henri Matisse"
- 예상 결과: Wikipedia 이미지 URL 반환, source='wikipedia'
- 검증: 이미지 URL 유효성, Wikipedia 도메인 확인

**TC-FR-007-02: Wikipedia 실패 후 Google 검색**
- 입력: "알려지지 않은 아티스트" (Wikipedia에 없음)
- 예상 결과: Google Custom Search Image API로 검색, source='google'
- 검증: Google 이미지 URL 반환

**TC-FR-007-03: 캐시 히트**
- 입력: "Henri Matisse" (이미 캐시에 있음)
- 예상 결과: 캐시에서 이미지 URL 반환, 응답 시간 ≤ 1초
- 검증: cached === true

---

### 3.8 FR-008: 게임 프로모션 기능 (향후)

**우선순위**: 낮음  
**복잡도**: 매우 높음  
**추정 작업량**: 30일 (Phase 1), 20일 (Phase 2)

#### 설명
27 Combinations 랭킹 시스템 기반 리듬 액션 게임을 웹 애플리케이션에 통합합니다. 게임은 Tier/Axis 시스템을 활용하여 작품을 분류하고, Gate 선택을 통해 27 Combinations 경로를 결정합니다.

#### 입력
- 게임 플레이 입력 (키보드/마우스 또는 손 추적)
- 게임 설정 (난이도, 모드 등)

#### 처리 흐름
```
Phase 1: 기본 게임플레이
1. 게임 세션 생성
   ├─ Firebase Functions 호출 (getGameSession)
   ├─ 게임 세션 ID 생성
   └─ 초기 상태 설정

2. 게임플레이 진행
   ├─ 노트(Note) 생성 및 이동
   ├─ 사용자 입력 처리 (키보드/마우스)
   ├─ 점수 계산
   └─ 콤보 시스템

3. Gate 선택 (Phase별)
   ├─ Phase 1 Gate 선택 (SCANDAL, RECOGNITION, OUTSIDER)
   ├─ Phase 2 Gate 선택 (INSTITUTIONAL, CRITICAL, RESTRUCTURING)
   └─ Phase 3 Gate 선택 (DOMESTIC, INTERNATIONAL, POSTHUMOUS)

4. 게임 종료
   ├─ 최종 점수 계산
   ├─ 27 Combinations 경로 결정
   └─ 해금 조건 확인

Phase 2: 웹 연동
5. 진행 상황 동기화
   ├─ Firebase Functions 호출 (syncGameProgress)
   ├─ 게임 결과 저장 (game_sessions 컬렉션)
   ├─ 리더보드 업데이트
   └─ 27 Combinations 해금 확인

6. 웹 연동
   ├─ 해금된 조합을 웹에서 추가 인사이트 제공
   ├─ 게임 점수를 리더보드에 반영
   └─ 탐색한 아티스트를 웹에서 추천
```

#### 출력
```typescript
// 게임 화면
{
  score: number;              // 현재 점수
  combo: number;              // 현재 콤보
  gateSelections: GateSelection[];  // Gate 선택 기록
  artistsEncountered: string[];      // 만난 아티스트 목록
}

// 게임 종료 시
{
  finalScore: number;         // 최종 점수
  narrativePath: string;     // 27 Combinations 경로 (예: "RECOGNITION-INSTITUTIONAL-INTERNATIONAL")
  newUnlocks: string[];      // 새로 해금된 조합 목록
  leaderboardRank: number;    // 리더보드 순위
}
```

#### 목표 달성 조건

**게임플레이 목표**:
- 프레임레이트: 60fps 유지
- 입력 지연: ≤ 50ms
- 게임 세션 생성 시간: ≤ 2초

**웹 연동 목표**:
- 게임 결과 동기화 시간: ≤ 3초
- 리더보드 업데이트 시간: ≤ 2초
- 해금 알림 표시 시간: ≤ 1초

**사용자 참여 목표**:
- 게임 플레이율: 전체 사용자의 30% 이상
- 평균 플레이 시간: 10분 이상
- 재방문율: 50% 이상

#### 달성 전략

**게임플레이 전략**:
1. Three.js (React Three Fiber)로 3D 렌더링
2. Web Audio API로 오디오 처리
3. MediaPipe로 손 추적 (실제 모드) 또는 키보드/마우스 시뮬레이션 (목업 모드)

**성능 최적화 전략**:
1. 게임 로직과 렌더링 분리
2. 오브젝트 풀링으로 메모리 최적화
3. 레벨 오브 디테일(LOD)로 렌더링 최적화

**웹 연동 전략**:
1. 게임 결과를 Firestore에 저장
2. 리더보드를 실시간으로 업데이트
3. 해금된 조합을 웹에서 즉시 활용 가능하도록 연동

#### 사전 조건
- 게임 프로모션 기능이 구현되어 있어야 함
- Firebase Functions가 정상 작동해야 함
- 사용자가 게임을 시작해야 함

#### 사후 조건
- 게임 결과가 Firestore에 저장됨
- 리더보드가 업데이트됨
- 해금된 조합이 웹에서 활용 가능해짐

#### 예외 처리

| 예외 상황 | 처리 방법 | 사용자 피드백 |
|----------|----------|-------------|
| 게임 세션 생성 실패 | 재시도 또는 오프라인 모드 | "게임 세션을 생성하는 중 오류가 발생했습니다." |
| 동기화 실패 | 로컬 저장 후 재시도 | "진행 상황을 저장하는 중 오류가 발생했습니다. 나중에 다시 시도해주세요." |
| 리더보드 업데이트 실패 | 백그라운드 재시도 | - |

#### 테스트 케이스

**TC-FR-008-01: 게임 세션 생성**
- 입력: 게임 시작 버튼 클릭
- 예상 결과: 게임 세션 생성, 게임 화면 표시
- 검증: 게임 세션 ID 유효성, 초기 상태 확인

**TC-FR-008-02: 게임 결과 동기화**
- 입력: 게임 종료
- 예상 결과: 게임 결과 저장, 리더보드 업데이트
- 검증: Firestore 저장 확인, 리더보드 반영 확인

**TC-FR-008-03: 27 Combinations 해금**
- 입력: 특정 조건 달성 (예: 점수 10000점)
- 예상 결과: 해당 조합 해금, 웹에서 추가 인사이트 제공
- 검증: 해금 상태 확인, 웹 연동 확인

---

## 4. 비기능 요구사항

### 4.1 NFR-001: 성능 요구사항

#### 응답 시간
- 대시보드 조회: 2초 이내 (캐시 히트 시), 10초 이내 (AI 호출 시)
- 비교 분석: 5초 이내 (캐시 히트 시), 30초 이내 (AI 호출 시)
- 타임라인 조회: 3초 이내

#### 처리량
- 동시 사용자: 100명 이상 지원
- 초당 요청 수: 10 req/s 이상

#### 리소스 사용량
- 클라이언트 메모리: 100MB 이하
- Firebase Functions 메모리: 512MiB (대용량 작업), 256MiB (일반 작업)

---

### 4.2 NFR-002: 가용성 요구사항

#### 가동 시간
- 목표 가동 시간: 99.5% 이상
- 계획된 다운타임: 월 1시간 이하

#### 장애 복구
- 자동 장애 복구: Firebase Functions 자동 재시도
- 폴백 전략: 캐시 데이터 또는 Mock 데이터 제공

---

### 4.3 NFR-003: 확장성 요구사항

#### 수평 확장
- Firebase Functions 자동 스케일링 지원
- Firestore 자동 확장

#### 수직 확장
- 메모리 및 CPU 리소스 동적 조정 가능

---

### 4.4 NFR-004: 보안 요구사항

#### 인증/인가
- 현재 단계: 공개 접근 허용
- 향후: 사용자 인증 시스템 도입 예정

#### 데이터 보안
- API 키는 환경 변수로 관리
- Firestore 보안 규칙 적용
- HTTPS 통신 강제

#### 입력 검증
- 사용자 입력 검증 및 정규화
- SQL Injection 방지 (Firestore 사용으로 자동 방지)
- XSS 방지 (React 자동 이스케이프)

---

### 4.5 NFR-005: 사용성 요구사항

#### 접근성
- WCAG 2.2 AA 준수
- 키보드 네비게이션 지원
- 스크린 리더 호환

#### 반응형 디자인
- 모바일, 태블릿, 데스크톱 지원
- 모바일 우선 접근

#### 오프라인 지원
- PWA 기능으로 오프라인 사용 가능
- 캐시된 데이터 표시

---

### 4.6 NFR-006: 유지보수성 요구사항

#### 코드 품질
- TypeScript 사용으로 타입 안전성 확보
- ESLint 및 Prettier 적용
- 코드 리뷰 필수

#### 테스트
- 단위 테스트 커버리지: 70% 이상
- 통합 테스트 필수 기능에 적용

#### 문서화
- 코드 주석 및 JSDoc 작성
- API 문서 자동 생성

---

## 5. 시스템 아키텍처 요구사항

### 5.1 아키텍처 스타일

- **프론트엔드**: Single Page Application (SPA)
- **백엔드**: Serverless (Firebase Functions)
- **데이터베이스**: NoSQL (Firestore)
- **캐싱**: Multi-tier (Memory → Session Cache → Knowledge Base)

### 5.2 기술 스택 요구사항

#### 프론트엔드
- React 19.2.0 이상
- TypeScript 5.8.2 이상
- Vite 6.2.0 이상
- Tailwind CSS

#### 백엔드
- Node.js 22
- Firebase Functions 2세대
- Google Gemini 2.5 Flash API
- Google Custom Search API

#### 데이터베이스
- Firestore
- Cloud Storage

### 5.3 컴포넌트 구조 요구사항

#### 프론트엔드 컴포넌트
- 컴포넌트 기반 아키텍처
- 재사용 가능한 컴포넌트 설계
- 상태 관리: React Hooks

#### 백엔드 함수
- 함수별 독립적 배포 가능
- 공통 유틸리티 모듈화
- 에러 핸들링 표준화

---

## 6. 데이터 요구사항

### 6.1 데이터 모델 요구사항

#### 아티스트 데이터
- 이름 (정규화 필수)
- 국적
- 출생년도
- 사망년도 (선택)
- 메트릭 데이터 (5개 축)

#### 비교 분석 데이터
- 아티스트 쌍 (정규화된 키)
- 비교 궤적 데이터
- 27 Combinations 분류

#### 캐시 데이터
- TTL: 24시간 (세션 캐시)
- 영구 저장: Knowledge Base (섹션 10.4)

### 6.2 데이터 무결성 요구사항

- 아티스트 이름 정규화 필수
- 스키마 검증 (Zod) 필수
- 타임스탬프 자동 관리

### 6.3 데이터 보관 요구사항

- 세션 캐시: 24시간 TTL
- 영구 저장: Knowledge Base (무기한)
- 채팅 히스토리: 사용자별 영구 저장

---

## 7. 인터페이스 요구사항

### 7.1 사용자 인터페이스 요구사항

#### 화면 구성
- Landing Page
- Overview Page (대시보드)
- Connected Page (비교 분석)
- Deep Dive Page (리포트 및 타임라인)

#### 인터랙션
- 차트 호버 시 상세 정보 표시
- 스크롤 기반 애니메이션
- 타이핑 애니메이션 (리포트)

### 7.2 API 인터페이스 요구사항

#### RESTful API
- 모든 엔드포인트: GET 또는 POST
- CORS 지원 필수
- JSON 형식 응답

#### 엔드포인트 목록
- `/getDashboardData?artistName={name}`
- `/getArtistReport?artistName={name}`
- `/getArtistTimeline?artistName={name}`
- `/getComparativeAnalysis?artist1={name1}&artist2={name2}`
- `/getDetailedTrajectory?artist1={name1}&artist2={name2}`
- `/getArtistList?offset={offset}&limit={limit}`
- `/getChatResponse?artistName={name}&message={message}`

### 7.3 외부 API 인터페이스

#### Google Gemini API
- 모델: gemini-2.5-flash
- Search Grounding 지원

#### Google Custom Search API
- 웹 검색 및 이미지 검색
- 일일 할당량 관리 필요

#### Wikipedia API
- 아티스트 프로필 이미지 검색

---

## 8. 보안 요구사항

### 8.1 인증 및 인가

- 현재: 공개 접근 (인증 불필요)
- 향후: 사용자 인증 시스템 도입 예정

### 8.2 데이터 보안

- API 키: 환경 변수로 관리
- Firestore 보안 규칙 적용
- HTTPS 통신 강제

### 8.3 입력 검증

- 사용자 입력 정규화 및 검증
- Zod 스키마 검증 필수
- XSS 및 Injection 공격 방지

---

## 9. 성능 요구사항

### 9.1 응답 시간

| 기능 | 캐시 히트 | AI 호출 |
|------|----------|---------|
| 대시보드 조회 | ≤ 2초 | ≤ 10초 |
| 비교 분석 | ≤ 5초 | ≤ 30초 |
| 타임라인 조회 | ≤ 3초 | ≤ 15초 |

### 9.2 처리량

- 동시 사용자: 100명 이상
- 초당 요청 수: 10 req/s 이상

### 9.3 리소스 사용량

- 클라이언트 메모리: 100MB 이하
- Firebase Functions 메모리: 256MiB ~ 512MiB

### 9.4 최적화 전략

- 캐싱: 3-Tier 스토리지 아키텍처
- 프리로딩: 예측 프리로딩
- 점진적 로딩: Streaming Response
- 콜드 스타트 최적화: minInstances 설정

---

## 10. 사용성 요구사항

### 10.1 접근성

- WCAG 2.2 AA 준수
- 키보드 네비게이션 지원
- 스크린 리더 호환
- 고대비 모드 지원

### 10.2 반응형 디자인

- 모바일 우선 접근
- 브레이크포인트: mobile, tablet, desktop
- 터치 제스처 지원

### 10.3 오프라인 지원

- PWA 기능
- Service Worker 캐싱
- 오프라인 상태 표시

---

## 11. 호환성 요구사항

### 11.1 브라우저 호환성

- Chrome/Edge: 최신 2개 버전
- Firefox: 최신 2개 버전
- Safari: 최신 2개 버전

### 11.2 디바이스 호환성

- 데스크톱: Windows, macOS, Linux
- 모바일: iOS 14+, Android 8+

### 11.3 API 호환성

- Firebase Functions 2세대
- Google Gemini API v1
- Google Custom Search API v1

---

## 12. 유지보수 요구사항

### 12.1 코드 품질

- TypeScript 사용
- ESLint 및 Prettier 적용
- 코드 리뷰 필수

### 12.2 테스트

- 단위 테스트: Vitest
- 커버리지: 70% 이상
- 통합 테스트: 주요 기능

### 12.3 문서화

- 코드 주석 및 JSDoc
- API 문서 자동 생성
- 아키텍처 문서 유지

### 12.4 모니터링

- Firebase Functions 로그
- 에러 추적 및 알림
- 성능 모니터링

---

## 13. 제약사항

### 13.1 기술적 제약사항

- Firebase Functions 타임아웃: 최대 300초
- Firestore 쿼리 제한: 복합 인덱스 필요 시 수동 생성
- Google API 할당량: 일일 제한 존재

### 13.2 비즈니스 제약사항

- AI API 비용: 사용량 기반 과금
- 스토리지 비용: Firestore 및 Cloud Storage 사용량 기반

### 13.3 시간 제약사항

- 게임 프로모션 기능: 향후 구현 예정
- 사용자 인증: 향후 구현 예정

---

## 14. 부록

### 14.1 용어집

- **Valuation Matrix**: 5축 레이더 차트로 아티스트 메트릭 시각화
- **Trajectory**: 시간별 가치 추이
- **27 Combinations**: Phase 1-3의 3×3×3 매트릭스 랭킹 시스템
- **Knowledge Base**: 영구 저장 계층 (섹션 10.4)

### 14.2 참조 문서

- BRD v1.2: 비즈니스 요구사항 문서
- TSD v1.0: 기술 명세 문서

### 14.3 변경 이력

| 버전 | 날짜 | 변경 내용 | 작성자 |
|-----|------|----------|--------|
| 1.1 | 2025-01 | 기능 요구사항 상세화 (목표 달성 조건, 전략, 테스트 케이스 추가) | AI Assistant |
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

