# Curator's Odysseia - 웹 애플리케이션 BRD (Business Requirements Document)

**문서 버전:** 1.0  
**최종 업데이트:** 2025년 1월  
**프로젝트명:** Curator's Odysseia  
**부제:** Data Driven Art Archive

---

## 1. 실행 요약 (Executive Summary)

### 1.1 프로젝트 개요

**Curator's Odysseia**는 데이터 기반 아티스트 평가 및 궤적 분석 시스템으로, Google Gemini 2.5 Flash와 Google Search Grounding을 활용하여 실시간 아티스트 정보를 수집·분석하고 시각화하는 웹 애플리케이션입니다.

### 1.2 핵심 가치 제안

- **데이터 기반 큐레이토리얼 인텔리전스**: 27가지 내러티브 조합을 기반으로 한 글로벌 랭킹 시스템
- **실시간 정보 통합**: Google Search Grounding을 통한 최신 아티스트 정보 수집
- **인터랙티브 시각화**: 레이더 차트, 트라젝토리 분석, 비교 분석을 통한 직관적 데이터 탐색
- **AI 기반 인사이트**: Gemini 2.5 Flash를 활용한 큐레이토리얼 리포트 및 분석 생성

### 1.3 목표 사용자

- **미술 큐레이터**: 전시 기획 및 아티스트 연구
- **아트 컬렉터**: 작품 수집 전략 수립
- **미술 연구자**: 아티스트 비교 분석 및 학술 연구
- **일반 사용자**: 현대 미술 아티스트 탐색 및 학습

---

## 2. 기획 의도 및 철학

### 2.1 기획 배경

현대 미술 시장에서 아티스트의 가치 평가는 주관적이고 분산된 정보에 의존하는 경우가 많습니다. Curator's Odysseia는 이러한 문제를 해결하기 위해:

1. **정량적 평가 체계 구축**: 5가지 핵심 메트릭(시장 가치, 비평적 인정, 역사적 중요성, 사회적 영향력, 제도적 수용)을 0-100 스케일로 정량화
2. **27가지 내러티브 조합**: PDF 문서 "27 Combinations"를 기반으로 한 아티스트 궤적 분류 시스템
3. **실시간 데이터 통합**: Google Search Grounding을 통해 최신 경매 결과, 전시 정보, 비평 리뷰 등을 실시간 수집

### 2.2 디자인 철학

- **미니멀리즘**: 깔끔하고 전문적인 UI로 데이터에 집중
- **타이포그래피 중심**: Serif 폰트를 활용한 편집 디자인 스타일
- **인터랙티브 스토리텔링**: 스크롤 기반 내러티브와 인터랙티브 차트를 통한 몰입형 경험
- **데이터 신뢰성**: 모든 분석 결과에 Grounding Source를 명시하여 투명성 확보

### 2.3 기술적 의도

- **AI-First 접근**: Gemini 2.5 Flash를 핵심 엔진으로 활용하여 확장 가능한 구조 설계
- **점진적 로딩**: Lazy Loading과 Fade-in 애니메이션으로 성능 최적화
- **반응형 디자인**: 모바일과 데스크톱 모두에서 최적화된 경험 제공
- **오프라인 폴백**: API 실패 시 Mock 데이터를 활용한 안정적인 사용자 경험

---

## 3. Information Architecture (IA) 및 Sitemap

### 3.1 전체 구조

```
Curator's Odysseia
│
├── Landing Page (/)
│   └── 검색 및 진입 포인트
│
├── Overview (/overview)
│   ├── 아티스트 대시보드
│   ├── Valuation Matrix (레이더 차트)
│   └── Trajectory Index (라인 차트)
│
├── Connected (/connected)
│   ├── 아티스트 그리드 뷰
│   ├── 비교 분석 뷰
│   │   ├── Dual Radar Chart
│   │   ├── Trajectory Tunnel
│   │   ├── Comparative Analysis
│   │   └── Masterpieces Gallery
│   └── Deep Dive 진입점
│
└── Deep Dive (/deep-dive)
    ├── AI Report (타이핑 애니메이션)
    ├── Chat Interface
    ├── Flashlight Gateway
    └── Timeline Journey
```

### 3.2 페이지별 상세 구조

#### 3.2.1 Landing Page
- **목적**: 첫인상 형성 및 검색 진입
- **주요 요소**:
  - 브랜드 타이포그래피 (Curator's Odysseia)
  - 검색 입력 필드
  - 아티스트명 또는 키워드 검색
  - "INDEXING 24,912 RECORDS" 상태 표시

#### 3.2.2 Overview Page
- **목적**: 단일 아티스트의 종합 대시보드
- **레이아웃**: 2-Column (이미지 + 정보)
- **주요 섹션**:
  1. **Hero Section**: 아티스트 이미지, 글로벌 랭크, 출생년도
  2. **아티스트 정보**: 이름, 국적, 큐레이토리얼 노트
  3. **Valuation Matrix**: 5축 레이더 차트 (인터랙티브)
  4. **Trajectory Index**: 시간별 가치 추이 라인 차트

#### 3.2.3 Connected Page
- **목적**: 아티스트 간 비교 분석
- **모드**:
  - **Grid Mode**: 5-Column 그리드로 아티스트 카드 표시
  - **Expanded Mode**: 선택된 아티스트의 상세 비교 뷰
- **Expanded View 섹션**:
  1. **Hero Section**: 타겟 아티스트 소개
  2. **Dual Radar Chart**: 두 아티스트의 메트릭 비교
  3. **Trajectory Tunnel**: 생애 궤적 비교 (스크롤 기반)
  4. **Comparative Analysis**: AI 생성 비교 리포트
  5. **Masterpieces Gallery**: 대표 작품 갤러리

#### 3.2.4 Deep Dive Page
- **목적**: 단일 아티스트의 심층 분석
- **주요 기능**:
  1. **AI Report**: Gemini 생성 종합 리포트 (타이핑 애니메이션)
     - 가변 속도 타이핑 효과 (초반 20%: 느림, 중반 20-80%: 빠름, 후반 80%+: 즉시 완료)
     - 리포트 완료 후 HUD 오버레이 활성화
  2. **Chat Interface**: 아티스트 관련 질의응답
     - 로컬 스토리지 기반 채팅 히스토리 저장
     - 5가지 메트릭 칩 (INSTITUTION, DISCOURSE, ACADEMY, NETWORK, MARKET VALUE)
     - Glassmorphism 디자인, 하단 고정 패널
  3. **Flashlight Gateway**: 타임라인 진입 인터페이스
     - 마스크 기반 플래시라이트 효과 (마우스 추적)
     - 데스크톱: 우측 사이드바 (280px)
     - 모바일: 하단 바 (80px)
  4. **Timeline Journey**: 생애 타임라인 시각화
     - 가로 스크롤 기반 타임라인 (각 Era = 100vw)
     - RippleBackground: 파도 효과 (마우스 인터랙션 반응)
     - TimelineCard: 호버/클릭 시 확장되는 이벤트 카드
     - TimelineEventModal: 전체 화면 이벤트 상세 모달
     - Area Chart: 경매 가격 범위 시각화 (auctionHigh/auctionLow)
     - Masterpiece Gallery: 대표 작품 갤러리
     - Critical Quotes: 비평가 인용 섹션

---

## 4. 유저 플로우 및 경험 설계

### 4.1 주요 유저 플로우

#### 플로우 1: 신규 사용자 탐색
```
Landing Page
  ↓ (검색 입력)
Overview Page (검색된 아티스트)
  ↓ (레이더 차트 축 클릭)
Masterpiece Carousel Modal
  ↓ (레이더 차트 포인트 클릭)
Metric Insight Modal
  ↓ (Connected 탭 이동)
Connected Page (Grid View)
  ↓ (아티스트 카드 클릭)
Expanded Comparison View
```

#### 플로우 2: 비교 분석 중심 사용자
```
Overview Page (기준 아티스트 선택)
  ↓ (Connected 탭 이동)
Connected Page (Grid View)
  ↓ (비교 대상 아티스트 선택)
Expanded Comparison View
  ├─ Dual Radar Chart 분석
  ├─ Trajectory Tunnel 스크롤 탐색
  ├─ Comparative Analysis 읽기
  └─ (Deep Dive 버튼 클릭)
      Deep Dive Page (타겟 아티스트)
```

#### 플로우 3: 심층 연구 사용자
```
Overview Page
  ↓ (Deep Dive 탭 이동)
Deep Dive Page
  ├─ AI Report 읽기 (타이핑 애니메이션 감상)
  ├─ Chat Interface로 질문
  └─ Flashlight Gateway 클릭
      Timeline Journey (생애 타임라인 탐색)
```

### 4.2 인터랙션 설계 원칙

#### 4.2.1 인터랙티브 차트
- **레이더 차트**:
  - **축 클릭**: 해당 메트릭의 대표 작품 캐러셀 표시
  - **포인트 클릭**: 해당 메트릭의 상세 인사이트 모달 표시
  - **호버 효과**: 포인트 확대 및 값 강조
- **라인 차트**:
  - **호버**: 특정 시점의 값 표시
  - **이벤트 마커**: 중요 이벤트 시각적 표시
- **듀얼 트라젝토리 차트**:
  - **메트릭 선택**: Total, Institution, Discourse, Academy, Network 전환
  - **포인트 클릭**: 해당 시점의 비교 인사이트 생성

#### 4.2.2 모달 및 오버레이
- **Masterpiece Carousel**: 전체 화면 다크 모달, 좌우 스크롤 캐러셀
- **Metric Insight Modal**: 중앙 정렬 모달, AI 생성 인사이트 표시
- **Rank Explanation Modal**: 랭킹 방법론 설명

#### 4.2.3 스크롤 기반 내러티브
- **Trajectory Tunnel**: 
  - 가로 스크롤 기반 파노라마 뷰
  - 파티클 시스템 (60개 파티클, 마우스 추적)
  - 스포트라이트 효과 (마우스 위치 기반)
  - Dual Area Chart: 5가지 메트릭 전환 가능
  - 포인트 클릭 시 해당 시점의 비교 인사이트 생성
- **Timeline Journey**: 
  - 가로 스크롤 기반 타임라인 (각 Era = 100vw)
  - 이벤트 카드 호버/클릭 시 확장
  - VISUAL/CONTEXT 모드 전환
  - 이벤트 이미지 지연 로딩 (호버 시 생성)
  - Area Chart로 경매 가격 범위 시각화
  - 배경 그라디언트 패럴랙스 효과

### 4.3 애니메이션 및 전환 효과

- **Fade-in Section**: 스크롤 시 섹션별 페이드인 효과 (IntersectionObserver 활용)
- **Typing Animation**: Deep Dive 리포트의 타이핑 효과 (가변 속도)
  - 초반 20%: 20ms 지연 (느림)
  - 중반 20-80%: 2ms 지연 (매우 빠름)
  - 후반 80%+: 즉시 완료
- **Layout Animation**: Framer Motion을 활용한 카드 확장/축소 애니메이션
  - layoutId를 통한 Shared Element Transition
  - Spring 애니메이션 (stiffness: 300, damping: 30)
- **Loading States**: Nautical Spinner (나침반 스타일 로딩 인디케이터)
  - 외부 링: 10초 선형 회전
  - 내부 헬름: 3초 ease-in-out 회전
- **Ripple Background**: Timeline Journey의 파도 효과
  - 15개 수평선, 마우스 거리 기반 상호작용
  - Wave Equation 기반 애니메이션
- **Flashlight Effect**: 마스크 기반 플래시라이트 (120px 반경)
  - 마우스 위치 실시간 추적
  - Radial Gradient 마스크 적용

---

## 5. 차트 및 비교 로직 규칙

### 5.1 Valuation Matrix (레이더 차트)

#### 5.1.1 메트릭 정의

1. **Market Value (시장 가치)**
   - **계산 기준**: 경매 낙찰 결과, 1차 시장 프라이싱 모멘텀, 2차 시장 유동성
   - **스케일**: 0-100 (정규화된 지수)
   - **최근 지표 예시**: 소더비 컨템포러리 이브닝 세일 최고가 경신

2. **Critical Acclaim (비평적 인정)**
   - **계산 기준**: 저명한 미술 비평가 평가, 주요 학술지 등재, 큐레이토리얼 리뷰
   - **스케일**: 0-100
   - **최근 지표 예시**: 아트포럼 12월호 회고전 리뷰 등재

3. **Historical (역사적 중요성)**
   - **계산 기준**: 미술사적 정전 내 위치, 매체적 혁신성, 장기 레거시 잠재력
   - **스케일**: 0-100
   - **최근 지표 예시**: 개정된 'Art Since 1900' 커리큘럼 내 작가 등재

4. **Social Impact (사회적 영향력)**
   - **계산 기준**: 디지털 인게이지먼트, 소셜 플랫폼 바이럴 지수, 대중적 문화 공명도
   - **스케일**: 0-100
   - **최근 지표 예시**: 인스타그램 #ContemporaryArt 태그 내 250만 회 이상 언급

5. **Institutional (제도적 수용)**
   - **계산 기준**: 주요 미술관 소장품 수집, 비엔날레 참여 이력, 기관 대여 빈도
   - **스케일**: 0-100
   - **최근 지표 예시**: 테이트 모던 터바인 홀 커미션 단독 전시

#### 5.1.2 비교 로직

**듀얼 레이더 차트 비교 규칙**:
- **Most Similar Axis 자동 감지**: 두 데이터셋 간 차이값이 가장 작은 축을 자동으로 강조 표시
- **Most Different Axis 감지**: 차이값이 가장 큰 축 식별 (옵션)
- **시각적 강조**: 가장 유사한 축은 볼드체, 언더라인, 점 표시로 강조
- **색상 구분**: 
  - Reference Artist: #28317C (Deep Royal Blue)
  - Target Artist: #3B82F6 (Azure Blue)

**인터랙션 규칙**:
- **축 클릭**: 해당 메트릭의 대표 작품 3개를 Gemini로 생성하여 캐러셀 표시
- **포인트 클릭**: 해당 메트릭의 상세 인사이트를 Gemini Search Grounding으로 생성하여 모달 표시

### 5.2 Trajectory Index (라인 차트)

#### 5.2.1 데이터 구조
- **시간 범위**: 2020-2024 (5년)
- **값 범위**: 0-100 (정규화된 경매 가격 지수)
- **이벤트 마커**: 중요 이벤트(전시, 경매, 비평 등) 시각적 표시

#### 5.2.2 시각화 규칙
- **라인 스타일**: Monotone 커브, 점 없음, 호버 시 Active Dot 표시
- **그리드**: 수평선만 표시 (수직선 제거)
- **축 레이블**: "YEAR (TIME)", "VALUE INDEX"

### 5.3 Trajectory Tunnel (듀얼 트라젝토리 비교)

#### 5.3.1 데이터 구조
- **나이 범위**: 20세부터 80세까지 2세 간격 (31개 데이터 포인트)
- **메트릭**: Total, Institution, Discourse, Academy, Network (5가지)
- **값 범위**: 0-100
- **컨텍스트**: 각 데이터 포인트마다 한국어 설명 제공

#### 5.3.2 비교 로직

**메트릭별 비교 규칙**:
1. **Total (총평균)**: 5개 메트릭의 평균값
2. **Institution**: 제도적 수용도 (미술관, 비엔날레 등)
3. **Discourse**: 담론적 영향력 (비평, 학술 논의)
4. **Academy**: 학술적 인정 (교육 기관, 학위 등)
5. **Network**: 네트워크 영향력 (갤러리, 컬렉터 관계)

**시각화 규칙**:
- **Area Chart**: 두 아티스트의 궤적을 Area로 표시
  - Total 메트릭 선택 시: Gap Range Area 추가 표시 (두 값 사이의 차이)
  - Linear Gradient 적용 (상단 불투명, 하단 투명)
  - Total 메트릭: 양쪽 Y축 (왼쪽: 스코어, 오른쪽: 추정 시장 가치)
- **Gap Range**: 두 값 사이의 차이를 시각적으로 강조
  - Tension Field Gradient (양쪽 색상 혼합)
  - Total 메트릭에서만 활성화
- **가격 매핑**: 0-100 스코어를 $10k-$10M 로그 스케일로 매핑
  - 공식: `minPrice * (maxPrice / minPrice) ^ (score / 100)`
  - Tooltip에 추정 가격 표시
- **인터랙션**: 
  - 포인트 클릭 시 해당 시점의 비교 인사이트 생성
  - Tooltip: 나이, 추정 연도, 각 아티스트의 스코어 및 컨텍스트 표시
  - Total 메트릭: Score Delta 및 Valuation Gap 표시
- **메트릭 전환**: 5가지 메트릭 버튼으로 실시간 전환
  - 각 메트릭별 고유 색상 적용
  - 활성 메트릭은 배경색 및 테두리 색상 변경

**색상 체계**:
- **Total**: White (#ffffff)
- **Institution**: Light Blue (#38bdf8)
- **Discourse**: Indigo (#818cf8)
- **Academy**: Purple (#c084fc)
- **Network**: Teal (#2dd4bf)

### 5.4 Global Ranking System

#### 5.4.1 랭킹 계산 방법론

**27가지 내러티브 조합 기반**:
1. **Early Career Volatility**: 초기 경력의 스캔들 vs 인정 패턴
2. **Institutional Acceptance**: 비엔날레 및 미술관 수용 이력
3. **Market Resilience**: 2차 시장 회복력

**계산 공식**:
- 각 내러티브 조합에 가중치 부여
- 5개 메트릭의 종합 점수와 내러티브 점수를 결합
- 최종 랭크는 1-27 범위로 정규화

#### 5.4.2 랭킹 표시 규칙
- Overview 페이지에서 아티스트 이미지 하단에 "#{rank}" 형식으로 표시
- 클릭 시 Rank Explanation Modal 표시

---

## 6. AI 서비스 통합 규칙

### 6.1 Gemini 2.5 Flash 활용

#### 6.1.1 사용 케이스별 프롬프트 전략

**1. Artist Dashboard Data**
- **목적**: 실시간 아티스트 정보 수집
- **출력 형식**: JSON (radar, trajectory, description, nationality, birthYear)
- **Grounding**: Google Search 활성화
- **언어**: 한국어 (description)

**2. Metric Insight**
- **목적**: 특정 메트릭의 상세 분석
- **출력 형식**: 단일 문단 텍스트
- **Grounding**: Google Search 활성화
- **언어**: 한국어
- **톤**: 큐레이토리얼, 분석적

**3. Comparative Analysis**
- **목적**: 두 아티스트 비교 리포트
- **출력 형식**: 마크다운 (3개 문단 구조)
- **Grounding**: Google Search 활성화
- **언어**: 한국어
- **구조**: 공통 궤적 → 차별점 → 전망

**4. Artist Report**
- **목적**: 종합 큐레이토리얼 리포트
- **출력 형식**: JSON + 마크다운 (구분자: "___REPORT_SECTION___")
- **Grounding**: Google Search 활성화
- **언어**: 한국어
- **구조**: Highlights (JSON) + Full Report (Markdown)

**5. Artist Timeline**
- **목적**: 생애 타임라인 생성
- **출력 형식**: JSON (eras, events, critiques, masterpieces)
- **Grounding**: Google Search 활성화
- **언어**: 한국어 (설명), 영어 (eraLabel)

**6. Masterpieces by Metric**
- **목적**: 특정 메트릭의 대표 작품 3개
- **출력 형식**: JSON 배열
- **Grounding**: Google Search 활성화
- **구조**: { title, year, visualPrompt }

**7. Detailed Trajectory**
- **목적**: 두 아티스트의 생애 궤적 비교 데이터
- **출력 형식**: JSON (31개 데이터 포인트)
- **Grounding**: Google Search 활성화
- **언어**: 한국어 (context)

**8. Chat Response**
- **목적**: 사용자 질문에 대한 답변
- **출력 형식**: 텍스트 (2-3문장)
- **Grounding**: Google Search 활성화
- **언어**: 한국어
- **톤**: 대화형, 전문적

### 6.2 Google Search Grounding 활용

#### 6.2.1 Grounding Source 표시 규칙
- 모든 AI 생성 콘텐츠에 Grounding Source 링크 표시
- Source는 웹사이트 제목과 URI로 구성
- "Verified Grounding Sources" 섹션에 태그 형태로 표시

#### 6.2.2 폴백 전략
- API 실패 시 Mock 데이터 사용
- 이미지 생성 실패 시 Picsum Photos 플레이스홀더 사용 (seed 기반)
- JSON 파싱 실패 시 기본 구조 반환

### 6.3 이미지 생성 (Imagen 4.0)

#### 6.3.1 사용 케이스
- **아티스트 포트레이트**: 대시보드용 프로필 이미지
  - 프롬프트: "Portrait of artist {name}, artistic black and white photography, studio lighting, high contrast, minimalist composition, editorial style"
- **이벤트 이미지**: 타임라인 이벤트 시각화
  - TimelineCard 호버 시 지연 로딩
  - visualPrompt 기반 생성
- **작품 이미지**: Masterpiece Carousel용
  - visualPrompt 기반 생성
  - 4:3 비율, JPEG 형식

#### 6.3.2 프롬프트 규칙
- **스타일**: "Artistic, high-contrast, black and white archival photography style, grainy, abstract, highly aesthetic"
- **폴백**: 쿼터 초과 시 Picsum Photos 사용 (seed 기반 결정론적 이미지)
  - Seed: 이벤트 연도 또는 작품 제목 길이 기반
  - Grayscale 필터 적용

---

## 7. 사용자가 느낄 수 있는 사용 가치

### 7.1 즉각적 가치 (Immediate Value)

#### 7.1.1 정보 접근성
- **통합된 정보**: 분산된 아티스트 정보를 한 곳에서 확인
- **실시간 업데이트**: 최신 경매 결과, 전시 정보, 비평 리뷰 반영
- **신뢰할 수 있는 소스**: Grounding Source를 통한 정보 출처 투명성

#### 7.1.2 시각적 이해
- **직관적 비교**: 레이더 차트와 트라젝토리 차트를 통한 즉각적 패턴 인식
- **인터랙티브 탐색**: 클릭 한 번으로 상세 인사이트 확인
- **아름다운 시각화**: 전문적이고 미학적인 데이터 시각화

### 7.2 중기 가치 (Medium-term Value)

#### 7.2.1 의사결정 지원
- **수집 전략**: 컬렉터가 작품 수집 전략을 수립하는 데 도움
- **전시 기획**: 큐레이터가 아티스트 선택 및 전시 구성에 활용
- **연구 효율성**: 연구자가 아티스트 비교 분석 시간 단축

#### 7.2.2 학습 및 발견
- **새로운 아티스트 발견**: Connected 페이지를 통한 유사 아티스트 탐색
- **심층 학습**: Deep Dive 리포트와 타임라인을 통한 아티스트 생애 이해
- **패턴 인식**: 27가지 내러티브 조합을 통한 아티스트 궤적 패턴 학습

### 7.3 장기 가치 (Long-term Value)

#### 7.3.1 전문성 향상
- **큐레이토리얼 인사이트**: AI 생성 리포트를 통한 전문적 관점 습득
- **시장 이해**: 트라젝토리 분석을 통한 미술 시장 동향 이해
- **비교 분석 능력**: 다양한 아티스트 비교를 통한 분석 역량 강화

#### 7.3.2 네트워크 효과
- **커뮤니티 형성**: 공통 관심사를 가진 사용자 간 연결
- **지식 공유**: Chat Interface를 통한 질의응답 및 지식 공유
- **데이터 축적**: 사용자 행동 데이터를 통한 시스템 개선

---

## 8. 개발 기획 의도

### 8.1 기술적 의도

#### 8.1.1 확장 가능한 아키텍처
- **모듈화된 컴포넌트**: 각 기능을 독립적인 컴포넌트로 분리
- **서비스 레이어 분리**: `geminiService.ts`를 통한 AI 로직 중앙화
- **타입 안정성**: TypeScript를 통한 타입 안정성 확보

#### 8.1.2 성능 최적화
- **Lazy Loading**: FadeInSection 컴포넌트를 통한 지연 로딩
- **이미지 최적화**: Picsum Photos를 활용한 결정론적 플레이스홀더
- **애니메이션 최적화**: Framer Motion을 활용한 하드웨어 가속 애니메이션

#### 8.1.3 사용자 경험 최적화
- **로딩 상태 관리**: 각 비동기 작업마다 적절한 로딩 인디케이터 표시
- **에러 처리**: API 실패 시 폴백 데이터 제공
- **반응형 디자인**: 모바일과 데스크톱 모두에서 최적화된 레이아웃

### 8.2 비즈니스적 의도

#### 8.2.1 시장 포지셔닝
- **프리미엄 브랜드**: 고급스러운 디자인과 전문적 콘텐츠로 프리미엄 포지셔닝
- **차별화**: AI 기반 큐레이토리얼 인텔리전스로 경쟁사와 차별화
- **확장성**: 향후 아티스트 데이터베이스 확장 및 유료 기능 추가 가능

#### 8.2.2 수익 모델 잠재력
- **프리미엄 구독**: 고급 분석 기능 및 무제한 리포트 생성
- **API 라이선싱**: 큐레이토리얼 인텔리전스 API 제공
- **데이터 판매**: 익명화된 사용자 행동 데이터 및 시장 인사이트

### 8.3 제품 진화 의도

#### 8.3.1 단기 개선 계획
- **데이터 정확도 향상**: 더 많은 데이터 소스 통합
- **UI/UX 개선**: 사용자 피드백 기반 인터페이스 개선
- **성능 최적화**: 로딩 시간 단축 및 애니메이션 최적화

#### 8.3.2 중장기 비전
- **커뮤니티 기능**: 사용자 간 아티스트 토론 및 리뷰 공유
- **개인화**: 사용자 관심사 기반 아티스트 추천
- **모바일 앱**: 네이티브 모바일 앱 개발
- **국제화**: 다국어 지원 및 글로벌 확장

---

## 9. 기술 스택 및 아키텍처

### 9.1 프론트엔드
- **프레임워크**: React 19.2.0
- **언어**: TypeScript 5.8.2
- **빌드 도구**: Vite 6.2.0
- **스타일링**: Tailwind CSS (인라인)
- **차트 라이브러리**: Recharts 3.4.1
- **애니메이션**: Framer Motion 11.13.1
- **마크다운**: React Markdown 10.1.0
- **오디오**: Tone.js 14.7.77

### 9.2 백엔드/서비스
- **AI 서비스**: Google Gemini 2.5 Flash
- **검색 Grounding**: Google Search Grounding
- **이미지 생성**: Imagen 4.0
- **호스팅**: Firebase Hosting

### 9.3 데이터 구조
- **타입 정의**: `types.ts`에 중앙화된 타입 정의
  - Artist, DashboardData, TimelineData, ComparativeTrajectory 등
- **상수**: `constants.ts`에 메트릭 상세 정보 및 색상 정의
  - METRIC_DETAILS: 각 메트릭의 설명 및 컨텍스트
  - COLORS: 차트 색상 체계
  - MOCK_ARTISTS: 27명의 Mock 아티스트 데이터
- **Mock 데이터**: 개발 및 폴백용 Mock 아티스트 데이터
  - 27명의 아티스트 (PDF "27 Combinations" 기반)
  - 각 아티스트별 radarData, trajectory, description 포함

### 9.4 오디오 시스템 (Data Sonification)

#### 9.4.1 Tone.js 기반 오디오 엔진
- **초기화**: Tone.start()를 통한 오디오 컨텍스트 활성화
- **구성 요소**:
  - PolySynth: Glassy/Ambient 사인파 오실레이터
  - Filter: Lowpass 필터 (800Hz 기본)
  - Reverb: 4초 decay, 50% wet

#### 9.4.2 데이터 소니피케이션 매핑
- **Institutional (제도적 수용)**: 베이스 음 (C2, G2, D2, A2, E2)
  - 80 이상: C2, G2
  - 50-80: D2, A2
  - 50 미만: E2
- **Market Value (시장 가치)**: 고음 (G5, B5, E5, G5, C5)
  - 90 이상: G5, B5
  - 70-90: E5, G5
  - 70 미만: C5
- **Critical Acclaim (비평적 인정)**: 중음 (C4, E4)
  - 80 이상: C4, E4
- **볼륨**: -12dB (은은한 배경음)

#### 9.4.3 스크롤 효과
- **필터 모듈레이션**: 스크롤 속도에 따라 필터 주파수 조절
  - 기본: 800Hz
  - 빠른 스크롤: 최대 2800Hz까지 증가
- **활성화 시점**: Timeline Journey 진입 시 자동 재생

---

## 10. 성공 지표 (KPI)

### 10.1 사용자 지표
- **월간 활성 사용자 (MAU)**
- **세션당 페이지뷰**
- **평균 세션 시간**
- **이탈률**

### 10.2 기능별 지표
- **차트 인터랙션율**: 레이더 차트 클릭률
- **비교 분석 생성률**: Connected 페이지에서 비교 뷰 진입률
- **Deep Dive 완료율**: 리포트 읽기 완료율
- **Chat 사용률**: 채팅 인터페이스 사용 빈도

### 10.3 비즈니스 지표
- **API 호출 비용**: Gemini API 사용량 및 비용
- **사용자 만족도**: 피드백 및 리뷰 점수
- **재방문율**: 사용자 재방문 빈도

---

## 11. 위험 요소 및 대응 방안

### 11.1 기술적 위험
- **API 비용 증가**: 사용자 증가에 따른 Gemini API 비용 상승
  - **대응**: 캐싱 전략 도입, 사용량 제한 기능 추가
- **데이터 정확도**: AI 생성 콘텐츠의 정확도 문제
  - **대응**: Grounding Source 표시, 사용자 피드백 수집

### 11.2 사용자 경험 위험
- **로딩 시간**: API 응답 지연으로 인한 사용자 이탈
  - **대응**: 로딩 인디케이터 개선, 폴백 데이터 제공
- **복잡성**: 기능이 많아 사용자가 혼란스러울 수 있음
  - **대응**: 온보딩 튜토리얼 추가, 도움말 섹션 강화

---

## 12. 컴포넌트별 상세 기능 명세

### 12.1 Timeline Journey 컴포넌트

#### 12.1.1 구조 및 레이아웃
- **전체 구조**: 가로 스크롤 컨테이너 (각 Era = 100vw)
- **레이어 구성**:
  1. **Background Text Layer**: Era별 나이 범위 대형 텍스트 (30vw, blur)
  2. **Background Gradient Layer**: Era별 moodColor 기반 그라디언트
  3. **Chart Layer**: SVG Area Chart (경매 가격 범위)
  4. **Content Layer**: Era 설명 및 TimelineCard 배치
  5. **RippleBackground**: 파도 효과 오버레이

#### 12.1.2 TimelineCard 인터랙션
- **상태 관리**:
  - `isHovered`: 마우스 호버 상태
  - `locked`: 클릭으로 고정된 상태
  - `viewMode`: 'VISUAL' 또는 'CONTEXT' 모드
- **이미지 로딩**: 
  - 호버 또는 고정 시 지연 로딩 시작
  - Imagen 4.0 또는 Picsum Photos 폴백
- **카드 확장**:
  - 호버/고정 시 카드 확장 (opacity, scale, translate)
  - 위치 자동 조정 (화면 하단 60% 이상 시 하단 배치)
- **모달 연동**: "Open Dossier" 버튼 클릭 시 TimelineEventModal 표시

#### 12.1.3 TimelineEventModal
- **레이아웃**: 2-Column (이미지 + 콘텐츠)
- **표시 정보**:
  - 이벤트 이미지, 연도, 카테고리
  - 제목, 설명
  - Impact Score, Auction Estimate (Low-High)
  - Contextual Data: 5가지 메트릭 바 차트
- **스타일**: 다크 테마, Glassmorphism 효과

#### 12.1.4 Area Chart 시각화
- **데이터 처리**:
  - 각 Era의 이벤트를 연도별로 정렬
  - auctionHigh/auctionLow를 Y 좌표로 변환
  - Impact Score 기반 Y 위치 계산 (60-100 범위 정규화)
- **경로 생성**:
  - 상단 경로: auctionHigh 값들을 Bezier 커브로 연결
  - 하단 경로: auctionLow 값들을 역순으로 연결
  - Z 패스로 닫힌 영역 생성
- **시각 효과**: Linear Gradient, 흰색 스트로크, 드롭 섀도우

#### 12.1.5 RippleBackground
- **파도 생성**: 15개 수평선, 각각 다른 파장과 위상
- **마우스 인터랙션**: 
  - 마우스 위치 300px 반경 내에서 파도 변형
  - 거리 기반 상호작용 강도 계산
- **애니메이션**: requestAnimationFrame 기반 실시간 렌더링

### 12.2 DeepDiveChat 컴포넌트

#### 12.2.1 UI 구조
- **위치**: 화면 하단 고정 (데스크톱: 왼쪽, 모바일: 전체 너비)
- **초기 상태**: 접힘 상태 (translateY로 하단에 숨김)
- **활성화 조건**: 호버, 로딩 중, 메시지 존재 시 확장

#### 12.2.2 메시지 관리
- **로컬 스토리지**: 아티스트별 채팅 히스토리 저장
  - 키 형식: `chat_history_{artistName}`
  - JSON 직렬화/역직렬화
- **메시지 구조**:
  ```typescript
  {
    id: string;
    role: 'user' | 'ai';
    text: string;
    topic?: string;
    timestamp: number;
  }
  ```
- **애니메이션**: Framer Motion AnimatePresence
  - 초기: opacity 0, y: 20, scale: 0.98
  - 애니메이션: opacity 1, y: 0, scale: 1 (0.3초)

#### 12.2.3 메트릭 칩
- **5가지 칩**: INSTITUTION, DISCOURSE, ACADEMY, NETWORK, MARKET VALUE
- **동작**: 클릭 시 자동 질문 생성 및 전송
  - 형식: "Tell me about {artistName}'s {metric}."
- **스타일**: Glassmorphism, 호버 시 색상 변경

#### 12.2.4 입력 처리
- **Enter 키**: 전송 (Shift+Enter: 줄바꿈)
- **로딩 상태**: 입력 비활성화, 스피너 표시
- **자동 포커스**: 응답 수신 후 입력 필드로 포커스 이동

### 12.3 FlashlightGateway 컴포넌트

#### 12.3.1 플래시라이트 효과
- **마스크 기반**: CSS mask-image 활용
  - Radial Gradient: 120px 반경 원형 마스크
  - 마우스 위치 실시간 추적
- **레이어 구조**:
  1. **Base Layer**: 다크 배경 + 패턴 텍스처
  2. **Revealed Layer**: 밝은 콘텐츠 (마스크 적용)
  3. **Cursor Follower**: 커서 위치 표시 원

#### 12.3.2 반응형 처리
- **데스크톱**: 우측 사이드바 (280px 너비)
  - 슬라이드 인 애니메이션 (x: 100% → 0)
- **모바일**: 하단 바 (80px 높이)
  - 슬라이드 업 애니메이션 (y: 100% → 0)
  - 0.2초 지연

#### 12.3.3 인터랙션
- **클릭**: Timeline Journey 진입 트리거
- **마우스 추적**: 실시간 위치 업데이트
- **터치 지원**: 모바일 터치 이벤트 처리

### 12.4 TrajectoryTunnel 컴포넌트

#### 12.4.1 파티클 시스템
- **파티클 수**: 60개
- **속성**: 위치 (x, y), 속도 (vx, vy), 크기
- **동작**: 
  - 랜덤 초기 위치 및 속도
  - 경계 반사
  - 마우스 근처 파티클 가속

#### 12.4.2 스포트라이트 효과
- **마우스 추적**: 실시간 위치 업데이트
- **그라디언트**: 마우스 위치 중심 방사형 그라디언트
- **렌더링**: Canvas 기반 실시간 그리기

#### 12.4.3 Dual Area Chart 통합
- **컨테이너**: 전체 화면 중앙 배치
- **스크롤 연동**: 가로 스크롤과 연동된 배경 이동

### 12.5 ConnectedTab 컴포넌트

#### 12.5.1 Grid Mode
- **레이아웃**: 5-Column 그리드 (반응형: 1-2-3-4-5)
- **카드 구조**:
  - 이미지: Grayscale → 컬러 전환 (호버)
  - 오버레이: 그라디언트 배경, 아티스트 정보
  - Mini Radar Chart: 호버 시 표시
  - "View Comparison" 버튼
- **애니메이션**: Framer Motion layoutId 기반 Shared Element Transition

#### 12.5.2 Expanded Mode
- **전환**: 카드 클릭 시 전체 화면 모달
- **Sticky Stacking**: 
  - Hero Section: z-0, sticky top-0
  - Dual Radar: z-10, sticky top-0
  - Trajectory Tunnel: z-20
  - Comparative Analysis: z-30, sticky top-0
  - Masterpieces Gallery: z-40
- **스크롤 동작**: 각 섹션이 화면에 고정되며 스크롤 시 다음 섹션으로 전환

#### 12.5.3 데이터 로딩
- **병렬 로딩**: 
  1. Comparative Analysis (텍스트 리포트)
  2. Detailed Trajectory (궤적 데이터)
  3. Masterpieces Gallery (작품 목록)
- **로딩 상태**: 각각 독립적인 로딩 인디케이터

---

## 13. 결론

Curator's Odysseia는 데이터 기반 큐레이토리얼 인텔리전스를 제공하는 혁신적인 웹 애플리케이션입니다. Google Gemini 2.5 Flash와 Search Grounding을 활용하여 실시간 아티스트 정보를 수집·분석하고, 인터랙티브한 시각화를 통해 사용자에게 직관적이고 전문적인 경험을 제공합니다.

**핵심 가치**:
- **정량적 평가**: 5가지 메트릭과 27가지 내러티브 조합을 통한 객관적 평가
- **실시간 정보**: Google Search Grounding을 통한 최신 정보 통합
- **인터랙티브 탐색**: 클릭 한 번으로 상세 인사이트 확인
- **AI 기반 인사이트**: 큐레이토리얼 리포트 및 비교 분석 자동 생성

**사용자 가치**:
- 미술 큐레이터, 컬렉터, 연구자에게 실용적인 도구 제공
- 새로운 아티스트 발견 및 학습 기회 제공
- 전문적 인사이트를 통한 의사결정 지원

**개발 의도**:
- 확장 가능한 아키텍처로 향후 기능 추가 용이
- 프리미엄 브랜드 포지셔닝으로 시장 차별화
- 사용자 피드백 기반 지속적 개선

---

---

## 14. 게임 로직 및 규칙 시스템

### 14.1 27 Combinations 랭킹 시스템

#### 14.1.1 내러티브 조합 구조

**3x3x3 매트릭스 (27가지 조합)**:

1. **Phase 1: 초기 경력 (Early Career Volatility)**
   - A: 스캔들/논란 (Scandal-driven)
   - B: 조기 인정 (Early Recognition)
   - C: 아웃사이더 (Outsider Path)

2. **Phase 2: 중기 발전 (Mid-Career Trajectory)**
   - A: 제도권 편입 (Institutional Integration)
   - B: 비평적 우위 (Critical Dominance)
   - C: 시장 이탈/재정비 (Market Restructuring)

3. **Phase 3: 후기 성과 (Late-Career Outcome)**
   - A: 국내 정상 (Domestic Peak)
   - B: 국제적 거장 (International Master)
   - C: 사후 재평가 (Posthumous Revaluation)

#### 14.1.2 랭킹 경우의 수 계산

```
총 경우의 수 = Phase1(3) × Phase2(3) × Phase3(3) = 27
```

**가중치 적용 공식**:
```typescript
// 의사 코드
finalRank = 
  (phase1_weight × phase1_score) +
  (phase2_weight × phase2_score) +
  (phase3_weight × phase3_score) +
  (radar_total × radar_weight)
```

**가중치 분배**:
- Phase 1 (초기 경력): 20%
- Phase 2 (중기 발전): 30%
- Phase 3 (후기 성과): 30%
- Radar Total (5축 합계): 20%

#### 14.1.3 내러티브별 점수 매핑

| Phase 1 | Score | Phase 2 | Score | Phase 3 | Score |
|---------|-------|---------|-------|---------|-------|
| Scandal | 60-75 | Institutional | 80-90 | Domestic | 70-80 |
| Recognition | 80-95 | Critical | 85-95 | International | 90-100 |
| Outsider | 50-70 | Restructuring | 60-80 | Posthumous | 75-90 |

### 14.2 레이더 차트 비교 로직

#### 14.2.1 Most Similar/Different Axis 감지 알고리즘

```typescript
// RadarChartComponent.tsx 내 useMemo 로직
const { mostSimilarAxis, mostDiffAxis } = useMemo(() => {
  if (!data2) return { mostSimilarAxis: null, mostDiffAxis: null };
  
  let minDiff = 100;  // 초기값: 최대 가능 차이
  let maxDiff = -1;   // 초기값: 최소 가능 차이
  let simAxis = null;
  let diffAxis = null;

  data.forEach((d1) => {
    const d2 = data2.find(d => d.axis === d1.axis);
    if (d2) {
      const diff = Math.abs(d1.value - d2.value);
      if (diff < minDiff) {
        minDiff = diff;
        simAxis = d1.axis;
      }
      if (diff > maxDiff) {
        maxDiff = diff;
        diffAxis = d1.axis;
      }
    }
  });

  return { mostSimilarAxis: simAxis, mostDiffAxis: diffAxis };
}, [data, data2]);
```

#### 14.2.2 비교 규칙 경우의 수

| 시나리오 | 조건 | 결과 |
|----------|------|------|
| 완전 일치 | 모든 축 차이 < 5 | "High Correlation" 표시 |
| 부분 일치 | 2-3개 축 차이 < 10 | 유사 축 강조 |
| 대조적 | 2개 이상 축 차이 > 30 | 차별점 강조 |
| 보완적 | 교차 패턴 (A높음-B낮음, A낮음-B높음) | 보완 관계 분석 |

#### 14.2.3 시각적 강조 규칙

```typescript
// CustomTick 컴포넌트 내 조건부 스타일링
const fontWeight = highlighted || isMostSimilar ? 700 : 400;
const fillColor = highlighted || isMostSimilar ? COLORS.primary : fillColor;
const textDecoration = highlighted || isMostSimilar ? 'underline' : 'none';

// 유사 축 인디케이터 (점 표시)
{isMostSimilar && !isMini && (
  <circle cx={0} cy={14} r={3} fill={COLORS.primary} />
)}
```

### 14.3 Trajectory 비교 로직

#### 14.3.1 나이별 데이터 포인트

```typescript
// 31개 데이터 포인트
const ages = [
  20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 
  40, 42, 44, 46, 48, 50, 52, 54, 56, 58, 
  60, 62, 64, 66, 68, 70, 72, 74, 76, 78, 80
];
```

#### 14.3.2 가격 매핑 공식

```typescript
// 로그 스케일 변환 (0-100 → $10k-$10M)
const mapScoreToPrice = (score: number) => {
  const minPrice = 10000;    // $10k
  const maxPrice = 10000000; // $10M
  return Math.round(
    minPrice * Math.pow(maxPrice / minPrice, score / 100)
  );
};
```

**스케일 매핑 표**:

| Score | Price (USD) | Description |
|-------|-------------|-------------|
| 0 | $10,000 | Entry Level |
| 25 | ~$56,000 | Emerging |
| 50 | ~$316,000 | Established |
| 75 | ~$1,780,000 | Blue Chip |
| 100 | $10,000,000 | Market Leader |

#### 14.3.3 Gap Range 계산

```typescript
// DualAreaChartComponent.tsx
const processedData = useMemo(() => {
  return data.map(point => {
    const v1 = point[key1] as number; // Artist 1 value
    const v2 = point[key2] as number; // Artist 2 value
    
    return {
      ...point,
      // [최소값, 최대값] 배열로 Gap 영역 정의
      gap_range: [Math.min(v1, v2), Math.max(v1, v2)],
      price1: mapScoreToPrice(v1),
      price2: mapScoreToPrice(v2),
      delta: Math.abs(v1 - v2)  // 점수 차이
    };
  });
}, [data, key1, key2]);
```

### 14.4 히트맵 및 Area Chart 시각화

#### 14.4.1 Timeline Area Chart (경매 가격 범위)

```typescript
// TimelineJourney.tsx - generateAreaPath 함수
const generateAreaPath = (totalWidthPixels: number, screenHeight: number) => {
  const points: {x: number, highY: number, lowY: number}[] = [];
  
  data.eras.forEach((era, eraIndex) => {
    era.events.forEach((event) => {
      // X 좌표: Era 내 상대 위치
      const percentThroughEra = yearOffset / eraDuration;
      const x = (eraIndex * screenW) + paddingLeft + (percentThroughEra * activeWidth);
      
      // Y 좌표: 경매 가격 범위
      const highVal = event.auctionHigh ?? (event.impactScore + 5);
      const lowVal = event.auctionLow ?? (event.impactScore - 5);
      
      points.push({
        x, 
        highY: calculateY(highVal, screenHeight),
        lowY: calculateY(lowVal, screenHeight)
      });
    });
  });

  // Bezier 커브로 연결
  // 상단 경로 → 하단 경로 (역순) → 닫힘
};
```

#### 14.4.2 Y 좌표 계산 공식

```typescript
const calculateY = (score: number, screenHeight: number) => {
  const availableHeight = screenHeight - HEADER_HEIGHT - FOOTER_HEIGHT - BUFFER;
  const minScore = 60;  // 시각화 최소 스코어
  const maxScore = 100; // 시각화 최대 스코어
  
  const clampedScore = Math.max(minScore, Math.min(maxScore, score));
  const normalizedRatio = (clampedScore - minScore) / (maxScore - minScore);
  
  // 높은 스코어 = 화면 상단, 낮은 스코어 = 화면 하단
  return HEADER_HEIGHT + ((1 - normalizedRatio) * availableHeight);
};
```

#### 14.4.3 Gap Range 그라디언트

```xml
<!-- Tension Field Gradient for Gap -->
<linearGradient id="gapGradient" x1="0" y1="0" x2="0" y2="1">
  <stop offset="5%" stopColor={color1} stopOpacity="0.15" />
  <stop offset="50%" stopColor="#ffffff" stopOpacity="0.35" />
  <stop offset="95%" stopColor={color2} stopOpacity="0.15" />
</linearGradient>
```

---

## 15. 백엔드 로직 및 API 통합

### 15.1 Gemini API 호출 패턴

#### 15.1.1 표준 API 호출 구조

```typescript
// geminiService.ts - 표준 패턴
const response = await ai.models.generateContent({
  model: 'gemini-2.5-flash',
  contents: `프롬프트 내용...`,
  config: {
    tools: [{ googleSearch: {} }],  // Search Grounding 활성화
    temperature: 0.7,                // 창의성 조절
  },
});
```

#### 15.1.2 응답 파싱 전략

**JSON 추출 Regex 패턴**:
```typescript
// Markdown 코드 블록 제거
cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();

// JSON 객체 추출
const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
if (jsonMatch) {
  cleanedText = jsonMatch[0];
}

// JSON 배열 추출
const arrayMatch = cleanedText.match(/\[[\s\S]*\]/);
if (arrayMatch) {
  cleanedText = arrayMatch[0];
}

// Trailing comma 정리
cleanedText = cleanedText.replace(/,\s*}/g, '}').replace(/,\s*]/g, ']');
```

#### 15.1.3 복합 응답 처리 (JSON + Markdown)

```typescript
// generateArtistReport - 구분자 기반 파싱
const fullText = response.text || "";
const parts = fullText.split("___REPORT_SECTION___");

let highlightsPart = parts[0] || "{}";  // JSON
let reportTextPart = parts[1] || "";    // Markdown

// 구분자 없는 경우 폴백 처리
if (parts.length < 2) {
  if (fullText.trim().startsWith('{')) {
    highlightsPart = fullText;
    reportTextPart = "# Analysis\n\nDetailed text unavailable.";
  } else {
    highlightsPart = "{}";
    reportTextPart = fullText;
  }
}
```

### 15.2 Grounding Source 처리

```typescript
// 응답에서 Grounding 메타데이터 추출
const groundingChunks = 
  response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

const sources: GroundingSource[] = groundingChunks
  .filter((chunk: any) => chunk.web)
  .map((chunk: any) => ({
    web: {
      uri: chunk.web?.uri,
      title: chunk.web?.title,
    }
  }));
```

### 15.3 병렬 데이터 로딩

```typescript
// ConnectedTab.tsx - 병렬 API 호출
useEffect(() => {
  if (selectedArtist && currentOverviewArtist) {
    const fetchData = async () => {
      // 3개 API 동시 호출
      setLoadingComparison(true);
      setLoadingTrajectory(true);
      setLoadingGallery(true);
      
      // 1. Comparative Analysis (독립적)
      try {
        const compRes = await generateComparativeAnalysis(...);
        setComparisonResult(compRes);
      } catch(e) { console.error(e) } 
      finally { setLoadingComparison(false) }

      // 2. Trajectory Data (독립적)
      try {
        const trajData = await generateDetailedTrajectory(...);
        setTrajectoryData(trajData);
      } catch(e) { console.error(e) } 
      finally { setLoadingTrajectory(false) }

      // 3. Masterpieces (독립적)
      try {
        const gallery = await fetchMasterpiecesByMetric(...);
        setMasterpieces(gallery);
      } catch(e) { console.error(e) } 
      finally { setLoadingGallery(false) }
    };
    
    fetchData();
  }
}, [selectedArtistId, currentOverviewArtist]);
```

---

## 16. 폴백 로직 및 에러 처리

### 16.1 계층화된 폴백 전략

#### 16.1.1 이미지 생성 폴백

```typescript
// generateEventImage - 3단계 폴백
export const generateEventImage = async (prompt: string): Promise<string | null> => {
  // 1차 시도: Imagen 4.0
  try {
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: `Artistic, high-contrast, black and white...${prompt}`,
      config: { numberOfImages: 1, aspectRatio: '4:3' }
    });

    const base64Image = response.generatedImages?.[0]?.image?.imageBytes;
    if (base64Image) {
      return `data:image/jpeg;base64,${base64Image}`;
    }
    return null; // 2차: null 반환 (호출자에서 처리)
    
  } catch (error: any) {
    console.warn("Image generation failed, falling back to placeholder.", error.message);
    
    // 3차: Picsum 플레이스홀더 (결정론적 seed)
    const seed = prompt.split("").reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    
    return `https://picsum.photos/seed/${Math.abs(seed)}/800/600?grayscale`;
  }
};
```

#### 16.1.2 JSON 파싱 폴백

```typescript
// fetchArtistDashboardData - JSON 파싱 실패 시
let data;
try {
  data = JSON.parse(cleanedText);
} catch (e) {
  console.error("Failed to parse dashboard JSON", cleanedText);
  data = {}; // 빈 객체 폴백
}

// 개별 필드 폴백
return {
  name: artistName,
  nationality: data.nationality || "Unknown",           // 폴백: "Unknown"
  birthYear: data.birthYear || 1900,                    // 폴백: 1900
  description: data.description || "Data retrieval pending...",
  imageUrl: imageUrl || `https://picsum.photos/seed/${artistName}/800/800?grayscale`,
  rank: Math.floor(Math.random() * 30) + 1,             // 임시 랜덤 랭크
  radarData: [
    { axis: 'Market Value', value: data.radar?.market || 50, fullMark: 100 },
    // ... 각 메트릭 기본값 50
  ],
  trajectory: data.trajectory?.map(...) || []           // 빈 배열 폴백
};
```

#### 16.1.3 타임라인 데이터 폴백

```typescript
// generateArtistTimeline - 에러 시 빈 타임라인
try {
  return JSON.parse(cleanedText);
} catch (error) {
  console.error("Error generating timeline:", error);
  return { eras: [] }; // 빈 타임라인으로 크래시 방지
}
```

#### 16.1.4 Trajectory 데이터 폴백

```typescript
// generateDetailedTrajectory - Mock 데이터 폴백
catch (error) {
  console.error("Detailed Trajectory Error", error);
  
  const ages = [20, 22, 24, ...80];
  return {
    artist1,
    artist2,
    data: ages.map(age => ({
      age,
      a1_total: 50 + Math.random() * 40,
      a1_institution: 50 + Math.random() * 40,
      a1_discourse: 50,
      a1_academy: 50,
      a1_network: 50,
      a1_context: "Data unavailable",
      a2_total: 50 + Math.random() * 40,
      // ... 동일 패턴
    }))
  };
}
```

#### 16.1.5 Masterpiece 폴백

```typescript
// fetchMasterpiecesByMetric - 기본 구조 반환
catch (error) {
  console.error("Error fetching masterpieces:", error);
  return [
    { title: "Masterpiece I", year: "N/A", visualPrompt: `Abstract art by ${artistName}` },
    { title: "Masterpiece II", year: "N/A", visualPrompt: `Famous work by ${artistName}` },
    { title: "Masterpiece III", year: "N/A", visualPrompt: `Iconic art by ${artistName}` }
  ];
}
```

### 16.2 폴백 경우의 수 매트릭스

| API 함수 | 1차 시도 | 2차 폴백 | 3차 폴백 | 최종 폴백 |
|----------|----------|----------|----------|-----------|
| `generateEventImage` | Imagen 4.0 | null 반환 | Picsum seed | - |
| `fetchArtistDashboardData` | Gemini JSON | 필드별 기본값 | Mock 전체 | - |
| `generateArtistTimeline` | Gemini JSON | 빈 eras 배열 | - | - |
| `generateDetailedTrajectory` | Gemini JSON | 랜덤 Mock 데이터 | - | - |
| `fetchMasterpiecesByMetric` | Gemini JSON | 기본 3개 작품 | - | - |
| `generateMetricInsight` | Gemini Text | 에러 메시지 | - | - |
| `generateChatResponse` | Gemini Text | "서비스 불가" 메시지 | - | - |

### 16.3 에러 메시지 현지화

```typescript
// 한국어 에러 메시지
const ERROR_MESSAGES = {
  metricInsight: "시스템 오류: 실시간 분석을 검색할 수 없습니다.",
  chatResponse: "현재 대화 서비스를 이용할 수 없습니다.",
  comparison: "비교 분석 생성 실패.",
  dataUnavailable: "데이터 분석을 사용할 수 없습니다."
};
```

---

## 17. 지수 백오프 및 재시도 전략 (권장 구현)

### 17.1 현재 상태 분석

현재 코드베이스에는 명시적인 지수 백오프(Exponential Backoff)가 구현되어 있지 않습니다. 
아래는 권장 구현 전략입니다.

### 17.2 권장 지수 백오프 구현

```typescript
// utils/retry.ts (신규 파일 제안)
interface RetryConfig {
  maxRetries: number;       // 최대 재시도 횟수
  baseDelay: number;        // 기본 지연 시간 (ms)
  maxDelay: number;         // 최대 지연 시간 (ms)
  exponentialBase: number;  // 지수 기저 (보통 2)
  jitter: boolean;          // 지터 추가 여부
}

const DEFAULT_CONFIG: RetryConfig = {
  maxRetries: 3,
  baseDelay: 1000,      // 1초
  maxDelay: 30000,      // 30초
  exponentialBase: 2,
  jitter: true
};

export async function withExponentialBackoff<T>(
  fn: () => Promise<T>,
  config: Partial<RetryConfig> = {}
): Promise<T> {
  const { maxRetries, baseDelay, maxDelay, exponentialBase, jitter } = 
    { ...DEFAULT_CONFIG, ...config };
  
  let lastError: Error;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt === maxRetries) {
        throw lastError;
      }
      
      // 지수 백오프 계산
      let delay = baseDelay * Math.pow(exponentialBase, attempt);
      delay = Math.min(delay, maxDelay);
      
      // 지터 추가 (0.5x ~ 1.5x 범위)
      if (jitter) {
        delay = delay * (0.5 + Math.random());
      }
      
      console.warn(`Retry attempt ${attempt + 1}/${maxRetries} after ${delay}ms`);
      await sleep(delay);
    }
  }
  
  throw lastError!;
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
```

### 17.3 API별 적용 예시

```typescript
// geminiService.ts 개선
import { withExponentialBackoff } from './utils/retry';

export const fetchArtistDashboardData = async (artistName: string): Promise<DashboardData> => {
  return withExponentialBackoff(
    async () => {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `...`,
        config: { tools: [{ googleSearch: {} }] }
      });
      
      // 파싱 로직...
      return dashboardData;
    },
    {
      maxRetries: 3,
      baseDelay: 1000,
      onRetry: (attempt, error) => {
        console.warn(`Dashboard fetch retry ${attempt}:`, error.message);
      }
    }
  );
};
```

### 17.4 재시도 대상 에러 유형

| 에러 유형 | 재시도 여부 | 이유 |
|----------|-------------|------|
| Rate Limit (429) | ✅ 예 | 일시적 제한, 백오프 후 성공 가능 |
| Server Error (5xx) | ✅ 예 | 일시적 서버 장애 |
| Network Error | ✅ 예 | 일시적 네트워크 문제 |
| Quota Exceeded | ❌ 아니오 | 재시도해도 실패, 폴백 사용 |
| Invalid API Key | ❌ 아니오 | 설정 오류, 재시도 불필요 |
| Invalid Request | ❌ 아니오 | 요청 자체 오류 |

### 17.5 지터 전략

```typescript
// 지터 유형
const JITTER_STRATEGIES = {
  // Full Jitter: [0, delay] 범위
  full: (delay: number) => Math.random() * delay,
  
  // Equal Jitter: [delay/2, delay] 범위
  equal: (delay: number) => delay / 2 + Math.random() * delay / 2,
  
  // Decorrelated Jitter: 이전 지연과 연관
  decorrelated: (baseDelay: number, prevDelay: number) => 
    Math.min(maxDelay, Math.random() * (prevDelay * 3 - baseDelay) + baseDelay)
};
```

---

## 18. 렌더링 시스템 및 Canvas 기반 시각화

### 18.1 RippleBackground 파도 효과

#### 18.1.1 Wave Equation 구현

```typescript
// TimelineJourney.tsx - RippleBackground
const draw = () => {
  ctx.clearRect(0, 0, width, height);
  tick += 0.02; // 시간 증분

  // 배경 그라디언트
  const grad = ctx.createLinearGradient(0, 0, 0, height);
  grad.addColorStop(0, '#000000');
  grad.addColorStop(1, '#0a0a0a');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  const lineCount = 15; // 15개 수평선
  
  for (let i = 0; i < lineCount; i++) {
    const yBase = (height / lineCount) * i;
    const alpha = 0.03 + (i / lineCount) * 0.05; // 깊이감
    ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
    
    for (let x = 0; x <= width; x += 40) { // 40px 간격
      // 마우스 인터랙션 계산
      const dx = x - mouseRef.current.x;
      let interaction = 0;
      
      if (Math.abs(dx) < 300) { // 300px 반경
        const dy = yBase - mouseRef.current.y;
        if (Math.abs(dy) < 300) {
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = 300;
          if (dist < maxDist) {
            // 거리 기반 파도 변형
            interaction = Math.sin(dist * 0.05 - tick * 2) * ((maxDist - dist) / 5);
          }
        }
      }
      
      // 기본 파도 + 인터랙션
      const wave = Math.sin(x * 0.01 + tick + i) * 10;
      const y = yBase + wave + interaction;
      
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  animationFrameId = requestAnimationFrame(draw);
};
```

#### 18.1.2 파도 파라미터

| 파라미터 | 값 | 효과 |
|----------|-----|------|
| `tick` 증분 | 0.02 | 파도 속도 |
| `lineCount` | 15 | 수평선 개수 |
| 간격 | 40px | 포인트 밀도 |
| 인터랙션 반경 | 300px | 마우스 영향 범위 |
| 파도 주파수 | 0.01 | 파장 |
| 파도 진폭 | 10px | 높이 |

### 18.2 TrajectoryTunnel 파티클 시스템

#### 18.2.1 파티클 생성 및 애니메이션

```typescript
// TrajectoryTunnel.tsx
const particles: {x: number, y: number, vx: number, vy: number, size: number}[] = [];
const particleCount = 60;

// 초기화
for (let i = 0; i < particleCount; i++) {
  particles.push({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.2,  // -0.1 ~ 0.1
    vy: (Math.random() - 0.5) * 0.2,
    size: Math.random() * 2 + 1       // 1 ~ 3
  });
}

// 애니메이션 루프
const animate = () => {
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = '#0a0a0a';
  ctx.fillRect(0, 0, width, height);

  particles.forEach((p, i) => {
    // 이동
    p.x += p.vx;
    p.y += p.vy;

    // 경계 반사
    if (p.x < 0 || p.x > width) p.vx *= -1;
    if (p.y < 0 || p.y > height) p.vy *= -1;

    // 파티클 그리기
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,255,0.1)';
    ctx.fill();

    // 연결선 (150px 이내)
    for (let j = i + 1; j < particles.length; j++) {
      const p2 = particles[j];
      const dx = p.x - p2.x;
      const dy = p.y - p2.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist < 150) {
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = `rgba(255,255,255,${0.05 * (1 - dist / 150)})`;
        ctx.stroke();
      }
    }
  });
  
  animationFrame = requestAnimationFrame(animate);
};
```

### 18.3 Flashlight Gateway 마스크 효과

```typescript
// FlashlightGateway.tsx - CSS Mask 구현
<div 
  className="absolute inset-0"
  style={{
    maskImage: `radial-gradient(
      circle 120px at ${mousePos.x}px ${mousePos.y}px, 
      black 0%, 
      transparent 100%
    )`,
    WebkitMaskImage: `radial-gradient(
      circle 120px at ${mousePos.x}px ${mousePos.y}px, 
      black 0%, 
      transparent 100%
    )`
  }}
>
  {/* 마스크로 드러나는 콘텐츠 */}
</div>
```

### 18.4 스포트라이트 효과 (TrajectoryTunnel)

```typescript
// CSS 기반 스포트라이트
<div 
  className="absolute inset-0 pointer-events-none mix-blend-overlay"
  style={{
    background: `radial-gradient(
      circle 400px at ${mousePos.x}px ${mousePos.y}px, 
      rgba(59, 130, 246, 0.15),  // Azure Blue 15% 불투명도
      transparent 80%
    )`
  }}
/>
```

### 18.5 커서 팔로워

```typescript
// 커스텀 링 커서 (데스크톱 전용)
<div 
  className="fixed w-8 h-8 border border-[#3B82F6] rounded-full 
             pointer-events-none z-50 hidden md:block mix-blend-screen"
  style={{ 
    left: mousePos.x, 
    top: mousePos.y,
    transform: 'translate(-50%, -50%)',
    transition: 'transform 75ms ease-out'
  }}
/>
```

---

## 19. 상태 관리 및 데이터 흐름

### 19.1 앱 레벨 상태

```typescript
// App.tsx - 핵심 상태
const [activeView, setActiveView] = useState<AppView>(AppView.LANDING);
const [selectedArtistId, setSelectedArtistId] = useState<string>(MOCK_ARTISTS[0].id);
const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
const [loadingDashboard, setLoadingDashboard] = useState(false);

// 모달 상태
const [showRankModal, setShowRankModal] = useState(false);
const [insightData, setInsightData] = useState<InsightData | null>(null);
const [carouselData, setCarouselData] = useState<CarouselData | null>(null);
```

### 19.2 컴포넌트 레벨 상태 흐름

```
App (전역 상태)
├── activeView, selectedArtistId, dashboardData
│
├── Overview
│   └── displayArtist (computed)
│
├── ConnectedTab
│   ├── selectedArtistId (로컬)
│   ├── comparisonResult, trajectoryData, masterpieces
│   └── loading states (comparison, trajectory, gallery)
│
└── DeepDiveTab
    ├── report, timelineData
    ├── showTimeline, chatHistory
    └── DeepDiveChat → FlashlightGateway → TimelineJourney
```

### 19.3 로컬 스토리지 활용

```typescript
// DeepDiveChat.tsx - 채팅 히스토리 저장
const STORAGE_KEY = `chat_history_${artistName}`;

// 로드
const savedHistory = localStorage.getItem(STORAGE_KEY);
if (savedHistory) {
  setMessages(JSON.parse(savedHistory));
}

// 저장
localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
```

---

## 20. 부록

### 14.1 주요 컴포넌트 파일 구조

```
CURATOR/
├── App.tsx                    # 메인 앱 컴포넌트, 라우팅, 상태 관리
├── components/
│   ├── RadarChartComponent.tsx      # 레이더 차트 (단일/듀얼)
│   ├── LineChartComponent.tsx       # 라인 차트 (트라젝토리)
│   ├── DualAreaChartComponent.tsx   # 듀얼 에어리어 차트 (비교)
│   ├── ConnectedTab.tsx             # 연결된 아티스트 비교 뷰
│   ├── DeepDiveTab.tsx               # 심층 분석 탭
│   ├── DeepDiveChat.tsx              # 채팅 인터페이스
│   ├── FlashlightGateway.tsx         # 타임라인 진입 게이트웨이
│   ├── TimelineJourney.tsx           # 타임라인 여정 시각화
│   └── TrajectoryTunnel.tsx          # 트라젝토리 터널 (비교)
├── services/
│   ├── geminiService.ts              # Gemini API 통합
│   └── audioService.ts                # 오디오 서비스 (Tone.js)
├── types.ts                          # TypeScript 타입 정의
└── constants.ts                      # 상수 및 Mock 데이터
```

### 14.2 주요 타입 정의

```typescript
// 핵심 타입들
- Artist: 아티스트 기본 정보
- DashboardData: 대시보드 데이터
- TimelineData: 타임라인 데이터 (Eras, Events, Critiques, Masterpieces)
- ComparativeTrajectory: 비교 트라젝토리 데이터
- AIReportResult: AI 리포트 결과
- AxisData: 레이더 차트 축 데이터
- TimeSeriesPoint: 시계열 데이터 포인트
```

### 14.3 주요 상수

- **COLORS**: 차트 색상 체계
- **METRIC_DETAILS**: 메트릭 상세 설명
- **MOCK_ARTISTS**: 27명의 Mock 아티스트 데이터
- **CHIPS**: 채팅 인터페이스 메트릭 칩

### 14.4 성능 최적화 전략

1. **Lazy Loading**: IntersectionObserver 기반 FadeInSection
2. **이미지 최적화**: 지연 로딩, 결정론적 플레이스홀더
3. **애니메이션 최적화**: Framer Motion 하드웨어 가속
4. **캐싱**: 로컬 스토리지 기반 채팅 히스토리
5. **폴백 전략**: API 실패 시 Mock 데이터 사용

### 14.5 접근성 고려사항

- **키보드 네비게이션**: 모든 인터랙티브 요소 키보드 접근 가능
- **스크린 리더**: ARIA 레이블 및 역할 정의
- **색상 대비**: WCAG AA 기준 준수
- **반응형 디자인**: 모바일 우선 접근

---

**문서 버전**: 1.1  
**문서 작성일**: 2025년 1월  
**작성자**: AI Assistant  
**검토 상태**: 상세 보완 완료

