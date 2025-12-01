# Curator Game - Business Requirements Document (BRD)

**문서 버전**: 2.0  
**최종 업데이트**: 2024년  
**프로젝트명**: Curator Game  
**플랫폼**: 웹 브라우저 (WebGL 기반)  
**문서 유형**: Business Requirements Document (BRD)  
**상태**: 확장 버전

---

## 1. 실행 요약 (Executive Summary)

### 1.1 프로젝트 개요
Curator Game은 큐레이터의 여정을 리듬 액션 게임으로 구현한 웹 기반 게임입니다. 플레이어는 손 움직임(또는 키보드/마우스 입력)으로 공중에 떠오르는 노트를 자르며, 큐레이터로서 작품을 선별하고 전시를 구성하는 과정을 체험합니다. Beat Saber 스타일의 게임플레이와 미술관 큐레이션의 개념을 결합하여, 단순한 리듬 게임을 넘어 예술적 가치 판단과 선택의 의미를 전달합니다.

### 1.2 핵심 가치 제안
- **체험적 학습**: 게임을 통해 큐레이터의 역할과 작품 선별 과정을 몰입형으로 경험
- **예술적 감각 개발**: 시각적 아름다움과 리듬감을 통한 미적 판단력 향상
- **신체 활동**: 손 움직임을 통한 몸의 리듬감과 반응 속도 개선
- **선택의 의미**: 게임 내 Gate 시스템을 통한 선택의 중요성 인식

---

## 2. 타겟 오디언스 분석

### 2.1 주요 타겟 그룹

#### 2.1.1 예술 교육 시장
- **대상**: 예술 대학생, 큐레이터 지망생, 예술 교육자
- **연령대**: 18-35세
- **특징**: 예술에 대한 관심과 학습 의욕이 높음
- **니즈**: 큐레이터 역할에 대한 실전적 이해, 작품 선별 과정 학습

#### 2.1.2 캐주얼 게이머
- **대상**: 리듬 게임 애호가, Beat Saber 플레이어
- **연령대**: 15-40세
- **특징**: 새로운 게임 경험을 추구하며, 몰입감 있는 게임플레이 선호
- **니즈**: 재미있는 게임플레이, 도전적인 난이도, 성취감

#### 2.1.3 문화 콘텐츠 소비자
- **대상**: 미술관 방문객, 문화 이벤트 참여자
- **연령대**: 25-50세
- **특징**: 문화적 경험에 관심이 많고, 교육적 가치를 중시
- **니즈**: 예술에 대한 접근성 높은 경험, 교육적 콘텐츠

### 2.2 사용자 페르소나

#### 페르소나 1: "학습형 큐레이터" (Learning Curator)
- **이름**: 김예술 (25세, 예술 대학원생)
- **목표**: 큐레이터가 되는 방법을 실전적으로 배우고 싶음
- **동기**: 게임을 통해 큐레이터의 역할과 작품 선별 과정을 이해
- **행동**: 교육적 콘텐츠를 선호하며, Gate 선택 시 신중하게 고민

#### 페르소나 2: "경쟁형 게이머" (Competitive Gamer)
- **이름**: 박리듬 (22세, 대학생)
- **목표**: 높은 점수와 완벽한 플레이 달성
- **동기**: 리듬 게임의 도전과 성취감 추구
- **행동**: 콤보 유지와 점수 최적화에 집중, 반복 플레이

#### 페르소나 3: "문화 탐험가" (Cultural Explorer)
- **이름**: 이문화 (35세, 직장인)
- **목표**: 새로운 문화 경험과 학습
- **동기**: 예술에 대한 접근성 높은 경험 추구
- **행동**: 게임의 스토리와 의미에 관심, Gate 선택 시 서사적 맥락 고려

### 2.3 시장 분석

#### 2.3.1 시장 규모
- **글로벌 리듬 게임 시장**: 연간 약 $50억 (2024년 기준)
- **예술 교육 게임 시장**: 성장 중인 니치 시장
- **웹 기반 게임 시장**: 모바일 게임 대비 접근성 높음

#### 2.3.2 경쟁 우위
- **독특한 컨셉**: 큐레이터 + 리듬 게임의 독창적 결합
- **교육적 가치**: 단순 오락을 넘어 학습 도구로서의 가치
- **접근성**: 웹 브라우저만으로 접근 가능, 설치 불필요

---

## 3. 게임 컨셉 및 비전

### 2.1 게임 컨셉
**"큐레이터가 되어 작품을 선별하고 전시를 구성하라"**

플레이어는 미술관 큐레이터의 역할을 수행하며, 리듬에 맞춰 나타나는 작품 노트를 자르고 선별합니다. 각 노트는 작품을 상징하며, Tier(등급)와 Axis(축) 시스템을 통해 작품의 가치와 성격을 나타냅니다. 게임 진행 중 나타나는 Chronos Gates(시간의 문)를 통해 플레이어는 큐레이터로서의 선택을 하게 되며, 이는 게임의 서사와 결과에 영향을 미칩니다.

### 2.2 비전
- **예술 교육 도구**: 게임을 통해 예술과 큐레이션에 대한 이해를 높임
- **접근성**: 웹 브라우저만으로 접근 가능한 범용적 경험
- **확장성**: 다양한 작품과 음악으로 확장 가능한 구조
- **몰입감**: 3D 환경과 리듬감 있는 게임플레이로 깊은 몰입 제공

---

## 4. 스토리텔링 및 서사 구조

### 4.1 게임 서사 개요

Curator Game은 큐레이터의 여정을 3단계로 나누어 표현합니다. 각 Phase는 큐레이터가 겪는 현실적인 상황과 선택을 상징하며, 플레이어는 게임플레이를 통해 이 여정을 체험합니다.

### 4.2 Phase별 서사 구조

#### Phase 1: "The Awakening" (각성)
**서사적 맥락**: 젊은 큐레이터가 처음으로 작품 선별의 무게를 느끼는 순간입니다. 각 Gate는 큐레이터가 직면할 수 있는 초기 선택지를 나타냅니다.

- **SCANDAL (NEGATIVE)**: 스캔들에 연루된 작품을 선별하는 선택. 단기적 관심을 끌지만 장기적으로 위험한 경로.
- **ELITE COURSE (POSITIVE)**: 엘리트 코스를 통해 정통 미술사 교육을 받는 선택. 견고한 기초를 쌓는 경로.
- **DISCOVERY (POSITIVE)**: 새로운 작가와 작품을 발견하고 발굴하는 선택. 혁신적이지만 불확실한 경로.

**게임플레이 반영**: Phase 1은 상대적으로 쉬운 난이도로 시작하여 플레이어가 게임에 적응할 수 있도록 합니다.

#### Phase 2: "The Conflict" (갈등)
**서사적 맥락**: 큐레이터로서의 경력이 성장하면서 직면하는 갈등과 선택의 순간입니다. 각 선택은 큐레이터의 정체성과 가치관을 시험합니다.

- **EXPULSION (NEGATIVE)**: 기존 작가를 전시에서 제외하는 선택. 논란을 피하지만 창의성을 제한할 수 있음.
- **ACCLAIM (POSITIVE)**: 작가와 작품에 대한 인정과 찬사를 받는 선택. 성공적이지만 자만의 위험.
- **TERMINATION (NEGATIVE)**: 프로젝트를 중단하는 선택. 실패를 인정하지만 새로운 시작의 기회.

**게임플레이 반영**: Phase 2는 난이도가 증가하며, 더 복잡한 노트 패턴과 빠른 리듬이 나타납니다.

#### Phase 3: "The Establishment" (정착)
**서사적 맥락**: 큐레이터로서의 경력이 안정화되는 단계입니다. 각 Gate는 큐레이터의 최종적 정체성과 영향력을 결정합니다.

- **HIATUS (NEUTRAL)**: 일시적 휴식과 성찰의 시간. 중립적이지만 재정비의 기회.
- **MUSEUM (POSITIVE)**: 전통적인 미술관에서의 정착. 안정적이고 권위 있는 경로.
- **BIENNALE (POSITIVE)**: 국제 비엔날레와 같은 글로벌 무대에서의 활동. 혁신적이고 영향력 있는 경로.

**게임플레이 반영**: Phase 3는 최고 난이도로, 플레이어의 모든 스킬을 시험합니다.

### 4.3 서사적 요소의 게임플레이 통합

#### 4.3.1 시각적 스토리텔링
- Gate의 색상과 형태가 선택의 성격을 시각적으로 전달
- 환경 요소(별, 바다, 파티클)가 게임의 분위기와 서사를 강화
- 노트의 Tier와 Axis가 작품의 가치와 맥락을 상징

#### 4.3.2 선택의 결과
- Gate 선택은 향후 게임플레이에 영향을 줄 수 있음 (구현 예정)
- 예: POSITIVE Gate 선택 시 보너스 점수, NEGATIVE Gate 선택 시 추가 도전
- 선택의 누적이 최종 엔딩에 영향을 미침

### 4.4 메타 서사 (Meta Narrative)

게임 자체가 큐레이터의 여정을 상징합니다:
- **노트 자르기** = 작품 선별의 행위
- **Tier 시스템** = 작품의 가치 판단
- **Axis 시스템** = 작품의 맥락과 성격 이해
- **Gate 선택** = 큐레이터로서의 선택과 책임

---

## 5. 게임 규칙 및 메커니즘

### 3.1 기본 게임플레이

#### 3.1.1 목표
- 리듬에 맞춰 나타나는 노트를 정확한 타이밍과 방향으로 자르기
- 체력을 유지하며 곡을 완주하기
- 높은 점수와 콤보를 달성하기

#### 3.1.2 조작 방법
**실제 웹캠 모드**:
- 웹캠을 통해 손 위치를 실시간 추적
- MediaPipe를 활용한 손 랜드마크 인식
- 왼손과 오른손을 각각 독립적으로 제어

**목업 모드 (프로토타입)**:
- **왼손 제어**: `W`/`A`/`S`/`D` 키 또는 마우스 왼쪽 화면 영역
- **오른손 제어**: `↑`/`←`/`↓`/`→` 키 또는 마우스 오른쪽 화면 영역

### 3.2 노트 시스템

#### 3.2.1 노트 구조
각 노트는 다음 속성을 가집니다:

- **위치**: 
  - `lineIndex` (0-3): 수평 위치 (4개 레인)
  - `lineLayer` (0-2): 수직 위치 (3개 레이어)
  
- **손 구분**: 
  - `left`: 왼손으로 자르기
  - `right`: 오른손으로 자르기

- **절단 방향** (`CutDirection`):
  - `UP` (0): 위로
  - `DOWN` (1): 아래로
  - `LEFT` (2): 왼쪽으로
  - `RIGHT` (3): 오른쪽으로
  - `ANY` (4): 방향 무관 (점 형태)

- **Tier (등급)**:
  - **TIER_1 (Masterpiece)**: 정십이면체 형태, 10점, 희귀함
  - **TIER_2 (Exhibition)**: 박스 형태, 5점, 중간 빈도
  - **TIER_3 (Sketch)**: 원뿔 형태, 2점, 가장 흔함

- **Axis (축)**:
  - **INSTITUTION**: Deep Royal Blue (#28317C) - 기관
  - **ACADEMIC**: Mist Gray (#E5E5E5) - 학술
  - **DISCOURSE**: Void Black (#0A0A0A) - 담론
  - **NETWORK**: Azure Blue (#3B82F6) - 네트워크

#### 3.2.2 노트 판정 시스템
- **Hit Box**: 노트 중심으로부터 0.8 단위 반경
- **타이밍 윈도우**: `PLAYER_Z - 1.5` ~ `PLAYER_Z + 1.0` 범위
- **Good Cut 조건**:
  - 방향이 지정된 노트: 속도 벡터와 요구 방향의 내적 ≥ 0.3, 속도 ≥ 1.5
  - ANY 방향 노트: 속도 ≥ 1.5
- **Bad Cut**: 조건 미충족 시 기본 점수만 획득

### 3.3 점수 시스템

#### 3.3.1 기본 점수
- **Good Cut**: 150점 (기본 100점 + 보너스 50점)
- **Bad Cut**: 100점
- **Miss**: 0점, 체력 -15

#### 3.3.2 콤보 및 배수 시스템
- **콤보**: 연속으로 노트를 성공적으로 자를 때마다 증가
- **배수 (Multiplier)**:
  - 콤보 0-10: 1배
  - 콤보 11-20: 2배
  - 콤보 21-30: 4배
  - 콤보 31+: 8배
- **최종 점수**: 기본 점수 × 배수

#### 3.3.3 체력 시스템
- **초기 체력**: 100
- **노트 성공**: 체력 +2 (최대 100)
- **노트 실패**: 체력 -15
- **체력 0**: 게임 오버

### 3.4 Chronos Gates (시간의 문) 시스템

#### 3.4.1 Gate 개념
게임 진행 중 특정 시점에 나타나는 선택의 문입니다. 큐레이터로서 플레이어는 여러 경로 중 하나를 선택하며, 이는 게임의 서사와 결과에 영향을 미칩니다.

#### 3.4.2 Gate 구조
각 Gate는 다음 속성을 가집니다:
- **Label**: Gate의 이름 (예: "SCANDAL", "ELITE COURSE", "DISCOVERY")
- **SubLabel**: Gate의 부제 (예: "The Awakening", "The Conflict", "The Establishment")
- **Type**: 
  - `POSITIVE`: 긍정적 경로 (녹색)
  - `NEGATIVE`: 부정적 경로 (빨간색)
  - `NEUTRAL`: 중립적 경로 (회색)

#### 3.4.3 Gate 배치
- **Phase 1 (약 12초)**: "The Awakening"
  - Gate 1: SCANDAL (NEGATIVE)
  - Gate 2: ELITE COURSE (POSITIVE)
  - Gate 3: DISCOVERY (POSITIVE)
  
- **Phase 2 (약 34초)**: "The Conflict"
  - Gate 4: EXPULSION (NEGATIVE)
  - Gate 5: ACCLAIM (POSITIVE)
  - Gate 6: TERMINATION (NEGATIVE)
  
- **Phase 3 (약 56초)**: "The Establishment"
  - Gate 7: HIATUS (NEUTRAL)
  - Gate 8: MUSEUM (POSITIVE)
  - Gate 9: BIENNALE (POSITIVE)

#### 3.4.4 Gate 선택 메커니즘
- 각 Phase에서 3개의 Gate가 동시에 나타남
- 플레이어는 Gate를 통과하는 것으로 선택
- Gate 선택은 향후 게임플레이나 엔딩에 영향을 줄 수 있음 (현재는 시각적 표현)

### 3.5 게임 진행 흐름

1. **초기화**: 페이지 로드 후 자동으로 준비 상태
2. **게임 시작**: "Initialize Sequence" 버튼 클릭
3. **플레이**: 음악과 함께 노트가 나타나며 플레이어는 손으로 자름
4. **Gate 선택**: 각 Phase에서 Gate 선택
5. **게임 종료**:
   - **Victory**: 곡 완주 및 체력 유지
   - **Game Over**: 체력 0 도달

### 3.6 게임 밸런싱 상세 분석

#### 3.6.1 난이도 곡선
- **초반 (0-20초)**: 쉬운 패턴, ANY 방향 노트 위주, 플레이어 적응 기간
- **중반 (20-40초)**: 중간 난이도, 방향 지정 노트 증가, 콤보 유지 도전
- **후반 (40-60초)**: 고난이도, 복잡한 패턴, 빠른 리듬, 최종 도전

#### 3.6.2 점수 밸런싱
- **Good Cut 보너스**: 50점 추가로 정확한 플레이 장려
- **콤보 배수**: 연속 성공에 대한 보상으로 몰입감 유지
- **체력 회복**: 성공 시 +2로 실패에 대한 페널티(-15) 완화

#### 3.6.3 Tier별 분포
- **TIER_1 (Masterpiece)**: 전체의 약 5-10%, 희귀성으로 가치 부여
- **TIER_2 (Exhibition)**: 전체의 약 20-30%, 중간 난이도 구간에 집중
- **TIER_3 (Sketch)**: 전체의 약 60-75%, 기본 패턴 구성

---

## 6. UI/UX 설계

### 6.1 화면 구성

#### 6.1.1 메인 게임 화면
- **3D 게임 영역**: 화면 중앙, 전체 화면의 약 80%
- **HUD (Head-Up Display)**:
  - 좌측 상단: 점수, 콤보, 배수
  - 우측 상단: 체력 바
  - 하단: 웹캠 프리뷰 (미니맵)
- **게임 상태 표시**: IDLE, PLAYING, GAME_OVER, VICTORY

#### 6.1.2 컨트롤 UI
- **게임 시작 버튼**: "Initialize Sequence" - 명확하고 액션 지향적
- **재시작 버튼**: 게임 오버/승리 화면에서 표시
- **설정 버튼**: 난이도, 오디오, 조작 방식 설정

### 6.2 시각적 피드백 시스템

#### 6.2.1 노트 피드백
- **성공 시**: 
  - 파티클 효과
  - 화면 진동 (선택적)
  - 사운드 피드백
  - 점수 표시 애니메이션
- **실패 시**:
  - 빨간색 플래시
  - 체력 감소 표시
  - 경고 사운드

#### 6.2.2 콤보 피드백
- **콤보 증가 시**: 화면 상단에 큰 숫자 표시
- **배수 변경 시**: 색상 변화 및 애니메이션
- **콤보 브레이크 시**: 화면 효과로 시각적 강조

### 6.3 접근성 고려사항

#### 6.3.1 시각적 접근성
- 색상 대비: WCAG AA 기준 준수
- 텍스트 크기 조절 옵션
- 색맹 사용자를 위한 패턴/형태 구분

#### 6.3.2 조작 접근성
- 키보드 전용 모드 지원
- 조작 방식 커스터마이징
- 난이도 조절 옵션

#### 6.3.3 청각적 접근성
- 시각적 피드백으로 사운드 보완
- 자막/텍스트 표시 옵션

---

## 7. 음악 및 사운드 디자인

### 7.1 음악 설계

#### 7.1.1 현재 구현 (목업)
- **BPM**: 140 - 빠르고 리듬감 있는 템포
- **길이**: 60초 - 프로토타입 버전
- **스타일**: 사인파 기반 리듬 오디오
- **특징**: 외부 파일 불필요, 프로그래밍 방식 생성

#### 7.1.2 향후 계획
- **다양한 BPM**: 120-160 범위의 다양한 템포
- **음악 스타일**: 
  - 일렉트로닉
  - 앰비언트
  - 클래식 현대적 해석
- **Phase별 음악 변화**: 각 Phase에 맞는 음악적 분위기

### 7.2 사운드 효과

#### 7.2.1 게임플레이 사운드
- **노트 절단**: 날카로운 슬래시 사운드
- **Good Cut**: 만족스러운 "칭" 소리
- **Bad Cut**: 둔탁한 소리
- **Miss**: 실패를 나타내는 경고음

#### 7.2.2 UI 사운드
- **버튼 클릭**: 부드러운 클릭음
- **게임 시작**: 드라마틱한 시작음
- **게임 종료**: 승리/실패에 맞는 음악

### 7.3 오디오 밸런싱
- **음악 볼륨**: 게임플레이에 방해되지 않는 수준
- **효과음 볼륨**: 명확하게 들리지만 과하지 않음
- **사용자 조절**: 볼륨 슬라이더 제공

---

## 8. 기술적 기획

### 8.1 기술 스택
- **프론트엔드**: React 19, TypeScript
- **3D 렌더링**: Three.js (React Three Fiber)
- **빌드 도구**: Vite
- **스타일링**: Tailwind CSS (CDN)
- **손 추적**: MediaPipe (실제 모드) / 키보드/마우스 시뮬레이션 (목업 모드)
- **오디오**: Web Audio API (목업 모드)

### 8.2 게임 월드 설정
- **트랙 길이**: 50 단위
- **노트 생성 위치**: Z = -40 (SPAWN_Z)
- **플레이어 위치**: Z = 0 (PLAYER_Z)
- **노트 실패 위치**: Z = 5 (MISS_Z)
- **노트 속도**: 12 단위/초 (NOTE_SPEED)
- **BPM**: 140 (SONG_BPM)
- **비트 타임**: 60 / 140 = 0.4286초 (BEAT_TIME)

### 8.3 레이아웃
- **레인**: 4개 (수평) - LANE_X_POSITIONS: [-1.2, -0.4, 0.4, 1.2]
- **레이어**: 3개 (수직) - LAYER_Y_POSITIONS: [0.8, 1.6, 2.4]
- **레인 간격**: 0.8 단위 (LANE_WIDTH)
- **레이어 간격**: 0.8 단위 (LAYER_HEIGHT)
- **노트 크기**: 0.5 단위 (NOTE_SIZE)

---

## 8-A. 게임 로직 상세 (Game Logic Deep Dive)

### 8-A.1 노트 스폰 및 생명주기

#### 노트 스폰 시스템
```
노트 생명주기:
[SPAWN] → [ACTIVE] → [HIT/MISS] → [DEBRIS/REMOVE]
   ↑                      ↓
 차트에서 로드     플레이어 판정 영역
```

**스폰 로직**:
```typescript
spawnAheadTime = |SPAWN_Z - PLAYER_Z| / NOTE_SPEED
               = |-40 - 0| / 12
               = 3.33초 (플레이어에게 도달하기까지 소요 시간)

// 노트 스폰 조건
while (nextNoteIndex < chart.length) {
  nextNote = chart[nextNoteIndex]
  if (nextNote.time - spawnAheadTime <= currentTime) {
    activeNotes.push(nextNote)
    nextNoteIndex++
  } else {
    break
  }
}
```

#### 노트 상태 머신
```
┌─────────────┐     스폰      ┌─────────────┐
│   PENDING   │ ──────────> │   ACTIVE    │
└─────────────┘              └─────────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    ↓               ↓               ↓
            ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
            │  GOOD_HIT   │ │  BAD_HIT    │ │   MISSED    │
            └─────────────┘ └─────────────┘ └─────────────┘
                    │               │               │
                    ↓               ↓               ↓
            ┌─────────────────────────────────────────────┐
            │              DEBRIS (0.5초)                 │
            └─────────────────────────────────────────────┘
                                    │
                                    ↓
                            ┌─────────────┐
                            │   REMOVED   │
                            └─────────────┘
```

### 8-A.2 히트 판정 시스템 (Hit Detection System)

#### 충돌 감지 알고리즘
```typescript
// 판정 영역 (Z축 기준)
HIT_WINDOW_START = PLAYER_Z - 1.5  // -1.5
HIT_WINDOW_END = PLAYER_Z + 1.0    // +1.0
HIT_WINDOW_TOTAL = 2.5 단위

// 노트 현재 위치 계산
currentZ = PLAYER_Z - (timeDiff * NOTE_SPEED)
         = 0 - ((noteTime - audioTime) * 12)

// 히트박스 충돌 검사
distance = handPosition.distanceTo(notePosition)
if (distance < 0.8) {  // HIT_RADIUS = 0.8
    // 히트 성공
}
```

#### 히트 판정 결과 매트릭스

| 조건 | 속도 (speed) | 방향 일치 (dot) | 결과 |
|------|-------------|-----------------|------|
| ANY 방향 | ≥ 1.5 | - | GOOD_CUT |
| ANY 방향 | < 1.5 | - | BAD_CUT |
| 방향 지정 | ≥ 1.5 | ≥ 0.3 | GOOD_CUT |
| 방향 지정 | ≥ 1.5 | < 0.3 | BAD_CUT |
| 방향 지정 | < 1.5 | any | BAD_CUT |
| 미스 영역 통과 | - | - | MISS |

#### 방향 벡터 시스템
```typescript
DIRECTION_VECTORS = {
  UP:    Vector3(0, 1, 0),    // 위로
  DOWN:  Vector3(0, -1, 0),   // 아래로
  LEFT:  Vector3(-1, 0, 0),   // 왼쪽으로
  RIGHT: Vector3(1, 0, 0),    // 오른쪽으로
  ANY:   Vector3(0, 0, 0)     // 방향 무관
}

// 방향 일치도 계산
handVelocityNormalized = handVelocity.normalize()
dot = handVelocityNormalized.dot(requiredDirection)
// dot >= 0.3 이면 올바른 방향
```

### 8-A.3 히트맵 및 충돌 영역 시각화

#### 플레이 영역 히트맵
```
         Y (높이)
         │
    2.4  │  ┌───┬───┬───┬───┐
         │  │ L3│ L3│ L3│ L3│  ← 레이어 3 (High)
    1.6  │  ├───┼───┼───┼───┤
         │  │ L2│ L2│ L2│ L2│  ← 레이어 2 (Mid)
    0.8  │  ├───┼───┼───┼───┤
         │  │ L1│ L1│ L1│ L1│  ← 레이어 1 (Low)
         │  └───┴───┴───┴───┘
         └──────────────────────────> X (수평)
           -1.2 -0.4 0.4  1.2
            L0   L1   L2   L3
```

#### 3D 충돌 영역
```
            Z (깊이 - 노트 이동 방향)
            │
            │   SPAWN_Z = -40
            │   ↓
            │   ████████████████  ← 노트 생성
            │        ↓
            │   ████████████████
            │        ↓
   -1.5 ────│── ═══════════════ ← HIT_WINDOW_START
            │        ↓
    0.0 ────│── ═══════════════ ← PLAYER_Z (판정 라인)
            │        ↓
   +1.0 ────│── ═══════════════ ← HIT_WINDOW_END
            │        ↓
   +5.0 ────│── ═══════════════ ← MISS_Z (실패 라인)
```

#### 히트박스 오버랩 매트릭스
```
노트 위치별 히트박스 오버랩 가능성:

       Lane 0   Lane 1   Lane 2   Lane 3
Lane 0   -       20%      0%       0%
Lane 1  20%       -       20%      0%
Lane 2   0%      20%       -       20%
Lane 3   0%       0%      20%       -

* 인접 레인에서 동시 노트 시 오버랩 가능성 존재
* 게임 밸런싱 시 고려 필요
```

### 8-A.4 점수 계산 상세 로직

#### 점수 계산 공식
```typescript
// 기본 점수 계산
basePoints = 100
if (goodCut) basePoints += 50  // 보너스

// 배수 적용
finalScore = basePoints * multiplier

// 배수 결정 로직
function getMultiplier(combo: number): number {
  if (combo > 30) return 8
  if (combo > 20) return 4
  if (combo > 10) return 2
  return 1
}

// 총점 업데이트
totalScore += finalScore
```

#### 점수 시나리오 분석

| 시나리오 | 기본 점수 | 콤보 | 배수 | 최종 점수 |
|----------|----------|------|------|----------|
| Good Cut, 콤보 0 | 150 | 1 | 1 | 150 |
| Good Cut, 콤보 15 | 150 | 16 | 2 | 300 |
| Good Cut, 콤보 25 | 150 | 26 | 4 | 600 |
| Good Cut, 콤보 35 | 150 | 36 | 8 | 1,200 |
| Bad Cut, 콤보 35 | 100 | 36 | 8 | 800 |
| Miss | 0 | 0 | 1 | 0 (콤보 리셋) |

#### 이론적 최대 점수 계산
```
곡 길이: 60초
BPM: 140
비트당 시간: 0.4286초
총 비트 수: 60 / 0.4286 ≈ 140 비트
예상 노트 수: ~70 노트 (2비트당 1노트 가정)

최대 점수 (모두 Good Cut, 콤보 유지):
- 처음 10개: 150 × 1 × 10 = 1,500
- 다음 10개: 150 × 2 × 10 = 3,000
- 다음 10개: 150 × 4 × 10 = 6,000
- 나머지 40개: 150 × 8 × 40 = 48,000
- 이론적 최대: ~58,500점
```

### 8-A.5 체력 시스템 상세

#### 체력 변화 로직
```typescript
// 체력 업데이트
function updateHealth(event: 'hit' | 'miss', currentHealth: number): number {
  switch (event) {
    case 'hit':
      return Math.min(100, currentHealth + 2)  // 최대 100 제한
    case 'miss':
      return Math.max(0, currentHealth - 15)   // 최소 0 제한
  }
}

// 게임 오버 체크
if (newHealth <= 0) {
  endGame(false)  // GAME_OVER
}
```

#### 체력 시나리오 분석

| 초기 체력 | 연속 미스 허용 | 회복에 필요한 히트 |
|----------|---------------|-------------------|
| 100 | 6회 | - |
| 70 | 4회 | 15회 (30 회복) |
| 50 | 3회 | 25회 (50 회복) |
| 30 | 2회 | 35회 (70 회복) |
| 15 | 1회 | 43회 (86 회복) |

---

## 8-B. 백엔드 로직 및 서버 아키텍처 (계획)

### 8-B.1 현재 상태 (프론트엔드 전용)

현재 구현은 100% 클라이언트 사이드입니다:
- 모든 게임 로직이 브라우저에서 실행
- 상태 저장 없음 (세션 종료 시 데이터 소멸)
- 서버 통신 없음

### 8-B.2 향후 백엔드 아키텍처 (계획)

```
┌─────────────────────────────────────────────────────────────┐
│                      클라이언트 (브라우저)                   │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │  게임 엔진  │  │  UI 렌더러  │  │  API 클라이언트│        │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
└───────────────────────────┬─────────────────────────────────┘
                            │ HTTPS / WebSocket
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                       API Gateway                           │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │ 인증/인가   │  │ Rate Limit  │  │  로드 밸런서 │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
└───────────────────────────┬─────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        ↓                   ↓                   ↓
┌───────────────┐  ┌───────────────┐  ┌───────────────┐
│  게임 서비스   │  │ 유저 서비스   │  │ 리더보드 서비스│
│  - 점수 검증  │  │  - 인증       │  │  - 랭킹       │
│  - 차트 제공  │  │  - 프로필     │  │  - 통계       │
└───────────────┘  └───────────────┘  └───────────────┘
        │                   │                   │
        └───────────────────┼───────────────────┘
                            ↓
                    ┌───────────────┐
                    │   Database    │
                    │  (PostgreSQL) │
                    └───────────────┘
```

### 8-B.3 API 엔드포인트 설계 (계획)

#### 게임 API
```
POST /api/v1/game/start
  - Request: { userId, chartId }
  - Response: { sessionId, chartData, serverTimestamp }

POST /api/v1/game/submit
  - Request: { sessionId, score, combo, hits[], misses[], gateChoices[] }
  - Response: { verified, finalScore, rank, achievements[] }

GET /api/v1/game/charts
  - Response: { charts: [{ id, name, bpm, difficulty, duration }] }
```

#### 리더보드 API
```
GET /api/v1/leaderboard/:chartId
  - Query: { limit, offset, timeRange }
  - Response: { entries: [{ rank, userId, score, combo, timestamp }] }

GET /api/v1/leaderboard/:chartId/user/:userId
  - Response: { rank, score, percentile }
```

### 8-B.4 점수 검증 시스템 (Anti-Cheat)

#### 서버 사이드 검증 로직
```typescript
function validateScore(submission: GameSubmission): ValidationResult {
  // 1. 시간 검증
  const expectedDuration = chart.duration
  const actualDuration = submission.endTime - submission.startTime
  if (Math.abs(actualDuration - expectedDuration) > 5) {
    return { valid: false, reason: 'INVALID_DURATION' }
  }

  // 2. 노트 수 검증
  const expectedNotes = chart.notes.length
  const reportedNotes = submission.hits.length + submission.misses.length
  if (reportedNotes !== expectedNotes) {
    return { valid: false, reason: 'NOTE_COUNT_MISMATCH' }
  }

  // 3. 점수 재계산
  const calculatedScore = recalculateScore(submission.hits, submission.misses)
  if (calculatedScore !== submission.score) {
    return { valid: false, reason: 'SCORE_MISMATCH' }
  }

  // 4. 통계적 이상치 탐지
  if (isStatisticalOutlier(submission)) {
    return { valid: false, reason: 'STATISTICAL_ANOMALY' }
  }

  return { valid: true }
}
```

---

## 8-C. 폴백 로직 및 에러 핸들링 (Fallback Logic)

### 8-C.1 입력 시스템 폴백

```
┌─────────────────┐     실패     ┌─────────────────┐
│  MediaPipe      │ ──────────> │  키보드/마우스   │
│  (웹캠 추적)    │              │  (목업 모드)    │
└─────────────────┘              └─────────────────┘
        │                               │
        │ 성공                          │ 항상 성공
        ↓                               ↓
┌─────────────────────────────────────────────────┐
│              게임 플레이 가능                    │
└─────────────────────────────────────────────────┘
```

#### 폴백 조건 및 로직
```typescript
// 웹캠 폴백 로직
async function initializeInput(): Promise<InputSystem> {
  try {
    // 1차: MediaPipe 시도
    const mediapipe = await initMediaPipe()
    if (mediapipe.isReady) {
      return new MediaPipeInput(mediapipe)
    }
    throw new Error('MediaPipe 초기화 실패')
  } catch (error) {
    console.warn('MediaPipe 폴백:', error)
    // 2차: 키보드/마우스 폴백
    return new MockInput()
  }
}
```

### 8-C.2 오디오 시스템 폴백

```typescript
// 오디오 폴백 체인
const audioFallbackChain = [
  async () => loadExternalAudio(SONG_URL),      // 1차: 외부 오디오
  async () => loadLocalAudio('./audio.ogg'),   // 2차: 로컬 오디오
  async () => createMockAudio(60, SONG_BPM)    // 3차: 생성 오디오
]

async function initializeAudio(): Promise<HTMLAudioElement> {
  for (const loadFn of audioFallbackChain) {
    try {
      const audio = await loadFn()
      return audio
    } catch (error) {
      console.warn('오디오 폴백:', error)
      continue
    }
  }
  throw new Error('모든 오디오 소스 실패')
}
```

### 8-C.3 렌더링 폴백

```
┌─────────────────┐     실패     ┌─────────────────┐
│   WebGL 2.0     │ ──────────> │   WebGL 1.0     │
│  (Three.js)     │              │  (폴백 렌더러)  │
└─────────────────┘              └─────────────────┘
        │                               │
        │                               │ 실패
        │                               ↓
        │                        ┌─────────────────┐
        │                        │   Canvas 2D     │
        │                        │  (최소 모드)    │
        │                        └─────────────────┘
        │                               │
        ↓                               ↓
┌─────────────────────────────────────────────────┐
│                게임 렌더링                       │
└─────────────────────────────────────────────────┘
```

### 8-C.4 네트워크 폴백 (향후)

#### 지수 백오프 (Exponential Backoff) 구현
```typescript
interface RetryConfig {
  maxRetries: number
  baseDelay: number      // 밀리초
  maxDelay: number       // 밀리초
  backoffFactor: number
  jitter: boolean
}

const defaultRetryConfig: RetryConfig = {
  maxRetries: 5,
  baseDelay: 1000,       // 1초
  maxDelay: 32000,       // 32초
  backoffFactor: 2,
  jitter: true
}

async function fetchWithRetry<T>(
  url: string,
  options: RequestInit,
  config: RetryConfig = defaultRetryConfig
): Promise<T> {
  let lastError: Error

  for (let attempt = 0; attempt < config.maxRetries; attempt++) {
    try {
      const response = await fetch(url, options)
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      lastError = error as Error
      
      // 재시도 가능한 에러인지 확인
      if (!isRetryableError(error)) {
        throw error
      }

      // 지수 백오프 계산
      let delay = Math.min(
        config.baseDelay * Math.pow(config.backoffFactor, attempt),
        config.maxDelay
      )

      // 지터 추가 (동시 재시도 분산)
      if (config.jitter) {
        delay = delay * (0.5 + Math.random() * 0.5)
      }

      console.log(`재시도 ${attempt + 1}/${config.maxRetries}, ${delay}ms 후`)
      await sleep(delay)
    }
  }

  throw lastError!
}

// 재시도 가능한 에러 판별
function isRetryableError(error: unknown): boolean {
  if (error instanceof TypeError) {
    return true  // 네트워크 에러
  }
  if (error instanceof Error) {
    const message = error.message
    return (
      message.includes('ECONNREFUSED') ||
      message.includes('ETIMEDOUT') ||
      message.includes('ENOTFOUND') ||
      message.includes('429') ||  // Too Many Requests
      message.includes('503') ||  // Service Unavailable
      message.includes('504')     // Gateway Timeout
    )
  }
  return false
}
```

#### 지수 백오프 시각화
```
시도 1: 즉시
  ↓ (실패)
시도 2: 1초 후 (1000ms)
  ↓ (실패)
시도 3: 2초 후 (2000ms)
  ↓ (실패)
시도 4: 4초 후 (4000ms)
  ↓ (실패)
시도 5: 8초 후 (8000ms)
  ↓ (실패)
최종 실패: 총 대기 시간 ~15초
```

### 8-C.5 에러 경계 (Error Boundary)

```typescript
class GameErrorBoundary extends React.Component<Props, State> {
  state = { hasError: false, error: null }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // 에러 로깅
    logError({
      error,
      componentStack: errorInfo.componentStack,
      timestamp: Date.now(),
      userAgent: navigator.userAgent
    })
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorFallbackUI
          error={this.state.error}
          onRetry={() => this.setState({ hasError: false })}
        />
      )
    }
    return this.props.children
  }
}
```

---

## 8-D. 게임 시스템 및 렌더링 강화

### 8-D.1 렌더링 파이프라인

```
┌─────────────────────────────────────────────────────────────┐
│                    렌더링 파이프라인                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. 씬 그래프 업데이트 (useFrame)                           │
│     ↓                                                       │
│  2. 오디오 시간 동기화                                      │
│     ↓                                                       │
│  3. 노트 위치 계산                                          │
│     ↓                                                       │
│  4. 충돌 감지                                               │
│     ↓                                                       │
│  5. 상태 업데이트 (히트/미스)                               │
│     ↓                                                       │
│  6. 시각적 피드백 (파티클, 카메라 쉐이크)                   │
│     ↓                                                       │
│  7. Three.js 렌더링                                         │
│     ↓                                                       │
│  8. 후처리 (fog, bloom 등)                                  │
│     ↓                                                       │
│  9. 프레임 버퍼 출력                                        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 8-D.2 성능 최적화 기법

#### 노트 렌더링 최적화
```typescript
// 가시성 필터링 (Frustum Culling)
const visibleNotes = useMemo(() => {
  return notesState.filter(n => 
    !n.missed && 
    (!n.hit || (currentTime - (n.hitTime || 0) < 0.5)) && 
    (n.time - currentTime) < 5 &&   // 앞으로 5초 이내
    (n.time - currentTime) > -2     // 뒤로 2초 이내
  )
}, [notesState, currentTime])

// 메모이제이션으로 불필요한 리렌더링 방지
export default React.memo(Note, (prev, next) => {
  if (next.data.hit) return false
  return (
    prev.zPos === next.zPos && 
    prev.data.hit === next.data.hit && 
    prev.data.missed === next.data.missed
  )
})
```

#### 파티클 시스템 최적화
```typescript
// 버퍼 기하학 사용
const positions = useMemo(() => {
  const pos = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    pos[i * 3] = (Math.random() - 0.5) * 100     // x
    pos[i * 3 + 1] = Math.random() * 40 + 5      // y
    pos[i * 3 + 2] = (Math.random() - 0.5) * 100 - 20  // z
  }
  return pos
}, [])

// 파티클 수 조절
const PARTICLE_COUNT = {
  high: 5000,    // 고사양
  medium: 2000,  // 중간
  low: 500       // 저사양
}
```

### 8-D.3 동적 바다 렌더링

```typescript
// 정점 쉐이더 애니메이션 (CPU 기반)
useFrame((state) => {
  if (!geometryRef.current) return
  
  const time = state.clock.getElapsedTime()
  const positions = geometryRef.current.attributes.position
  
  for (let i = 0; i < positions.count; i++) {
    const x = positions.getX(i)
    const y = positions.getY(i)
    
    // 복합 사인파로 자연스러운 파도 생성
    const z = 
      0.2 * Math.sin(x * 0.5 + time * 0.5) + 
      0.1 * Math.sin(y * 0.5 + time * 0.8)
    
    positions.setZ(i, z)
  }
  positions.needsUpdate = true
})
```

### 8-D.4 카메라 쉐이크 시스템

```typescript
// Tier별 쉐이크 강도
const SHAKE_INTENSITY = {
  [NoteTier.TIER_1]: 0.4,  // Masterpiece - 강한 쉐이크
  [NoteTier.TIER_2]: 0.2,  // Exhibition - 중간 쉐이크
  [NoteTier.TIER_3]: 0.1   // Sketch - 약한 쉐이크
}

// 쉐이크 적용 및 감쇠
useFrame((state, delta) => {
  if (shakeIntensity.current > 0 && cameraRef.current) {
    const shake = shakeIntensity.current
    
    // 랜덤 오프셋 적용
    cameraRef.current.position.x = (Math.random() - 0.5) * shake
    cameraRef.current.position.y = 1.8 + (Math.random() - 0.5) * shake
    
    // 지수 감쇠
    shakeIntensity.current = THREE.MathUtils.lerp(
      shakeIntensity.current, 
      0, 
      8 * delta
    )
    
    if (shakeIntensity.current < 0.001) {
      shakeIntensity.current = 0
    }
  } else if (cameraRef.current) {
    // 부드럽게 원위치로 복귀
    cameraRef.current.position.lerp(
      new THREE.Vector3(0, 1.8, 4), 
      0.1
    )
  }
})
```

### 8-D.5 조명 비트 동기화

```typescript
// BPM에 맞춘 조명 펄스
useFrame((state, delta) => {
  if (audioRef.current && gameStatus === GameStatus.PLAYING) {
    const time = audioRef.current.currentTime
    const beatPhase = (time % BEAT_TIME) / BEAT_TIME
    const pulse = Math.pow(1 - beatPhase, 3)  // 지수 감쇠로 자연스러운 펄스
    
    if (spotLightRef.current) {
      spotLightRef.current.intensity = 50 + (pulse * 50)
      spotLightRef.current.angle = 0.6 + (pulse * 0.05)
    }
  }
})
```

### 8-D.6 Debris (파편) 시스템

```typescript
// Tier별 파편 수
const DEBRIS_COUNT = {
  [NoteTier.TIER_1]: 12,  // Masterpiece - 많은 파편
  [NoteTier.TIER_2]: 6,   // Exhibition - 중간
  [NoteTier.TIER_3]: 3    // Sketch - 적은 파편
}

// 파편 물리 시뮬레이션
const Shard: React.FC<ShardProps> = ({ dir, flySpeed, tier, axis, color }) => {
  const meshRef = useRef<THREE.Mesh>(null)
  
  useFrame(() => {
    if (meshRef.current) {
      // 방향에 따른 이동
      meshRef.current.position.x += dir[0] * flySpeed * 0.01
      meshRef.current.position.y += dir[1] * flySpeed * 0.01
      meshRef.current.position.z += dir[2] * flySpeed * 0.01
      
      // 회전
      meshRef.current.rotation.x += 0.2
    }
  })
  
  return (
    <Box 
      ref={meshRef} 
      args={tier === NoteTier.TIER_1 ? [0.2, 0.2, 0.2] : [0.1, 0.1, 0.1]}
    >
      <meshBasicMaterial 
        color={isGlitch ? 'white' : color} 
        wireframe={axis === NoteAxis.DISCOURSE} 
      />
    </Box>
  )
}
```

---

## 8-E. 규칙에 따른 경우의 수 분석

### 8-E.1 노트 조합 경우의 수

#### 단일 노트 경우의 수
```
레인 (lineIndex): 4개 (0, 1, 2, 3)
레이어 (lineLayer): 3개 (0, 1, 2)
손 타입 (type): 2개 (left, right)
절단 방향 (cutDirection): 5개 (UP, DOWN, LEFT, RIGHT, ANY)
Tier: 3개 (TIER_1, TIER_2, TIER_3)
Axis: 4개 (INSTITUTION, ACADEMIC, DISCOURSE, NETWORK)

단일 노트 경우의 수 = 4 × 3 × 2 × 5 × 3 × 4 = 1,440가지
```

#### 동시 노트 조합
```
2개 동시 노트 (양손): 
- 왼손 노트 경우의 수: 4 × 3 × 5 × 3 × 4 = 720
- 오른손 노트 경우의 수: 4 × 3 × 5 × 3 × 4 = 720
- 유효 조합 (충돌 제외): ~518,400가지

제약 조건:
- 같은 위치에 두 노트 배치 불가
- 인접 레인 양손 노트 시 크로스오버 고려
```

### 8-E.2 Gate 선택 경우의 수

```
Phase별 Gate 수: 3개
총 Phase 수: 3개

총 Gate 선택 경우의 수 = 3 × 3 × 3 = 27가지

가능한 경로 분류:
- 전체 POSITIVE: 4가지 (2×2×2 중 유효)
- 전체 NEGATIVE: 2가지
- 혼합: 21가지
```

### 8-E.3 게임 결과 경우의 수

```
게임 종료 상태:
1. VICTORY (곡 완주)
2. GAME_OVER (체력 0)

세부 결과:
- VICTORY + 모든 노트 히트 (Perfect)
- VICTORY + 일부 미스 (Clear)
- GAME_OVER + 초반 실패
- GAME_OVER + 중반 실패
- GAME_OVER + 후반 실패
```

### 8-E.4 히트 판정 결정 트리

```
                          ┌──────────────────┐
                          │   노트 접근     │
                          └────────┬─────────┘
                                   │
                    ┌──────────────┴──────────────┐
                    │                              │
              ┌─────▼─────┐                  ┌─────▼─────┐
              │ 히트 영역  │                  │ 미스 영역  │
              │ 진입?     │                  │ 통과?     │
              └─────┬─────┘                  └─────┬─────┘
                    │                              │
         ┌─────────┴─────────┐                    │
         │                    │                    │
   ┌─────▼─────┐        ┌─────▼─────┐        ┌─────▼─────┐
   │ 손 충돌?  │        │ 미충돌    │        │   MISS    │
   └─────┬─────┘        └─────┬─────┘        └───────────┘
         │                    │
    ┌────┴────┐               │
    │         │               │
┌───▼───┐ ┌───▼───┐      ┌────▼────┐
│속도≥1.5│ │속도<1.5│      │대기 계속 │
└───┬───┘ └───┬───┘      └─────────┘
    │         │
┌───┴───┐     │
│       │     │
│ 방향? │     │
│       │     │
└───┬───┘     │
    │         │
┌───┴───┐ ┌───▼───┐
│dot≥0.3│ │   │   │
└───┬───┘ │ BAD   │
    │     │ CUT   │
┌───▼───┐ └───────┘
│ GOOD  │
│ CUT   │
└───────┘
```

### 8-E.5 점수 등급 시스템 (계획)

```
등급 기준 (이론적 최대 점수 대비):
- S+: 95% 이상 (모든 노트 Good Cut, 콤보 유지)
- S:  90% 이상
- A:  80% 이상
- B:  70% 이상
- C:  60% 이상
- D:  50% 이상
- F:  50% 미만

추가 등급 조건:
- Perfect: 0 미스
- Full Combo: 콤보 깨짐 없음
- No Miss: 미스 없음 (Bad Cut 허용)
```

---

### 8.4 기술 아키텍처

#### 8.4.1 컴포넌트 구조
```
App.tsx (루트 컴포넌트)
├── GameScene.tsx (3D 게임 씬)
│   ├── Note.tsx (노트 렌더링)
│   ├── Saber.tsx (손/검 렌더링)
│   ├── Gate.tsx (Gate 렌더링)
│   ├── Ocean.tsx (동적 바다)
│   ├── SkyParticles.tsx (하늘 파티클)
│   └── SunkenMap.tsx (침몰 지도)
├── WebcamPreview.tsx (손 추적 미니맵)
├── hooks/
│   ├── useMediaPipe.ts (실제 손 추적)
│   └── useMediaPipeMock.ts (목업 손 추적)
├── utils/
│   └── mockAudio.ts (목업 오디오 생성)
└── UI 컴포넌트 (점수, 체력, 버튼)
```

#### 8.4.2 상태 관리
- **React State**: 게임 상태, 점수, 체력, 콤보
- **Ref**: 손 위치, 오디오, 비디오, 카메라 참조
- **useFrame**: Three.js 애니메이션 루프 (60fps)
- **useMemo**: 계산 결과 캐싱

#### 8.4.3 성능 최적화 전략
- **노트 렌더링**: 화면에 보이는 노트만 렌더링 (시간 기반 Culling)
- **메모이제이션**: useMemo, React.memo로 계산/렌더링 최적화
- **파티클 시스템**: BufferGeometry로 효율적인 렌더링
- **텍스처 최적화**: 프로그래밍 방식 생성으로 메모리 절약
- **LOD (Level of Detail)**: 거리에 따른 디테일 조절 (계획)

### 8.5 시각적 디자인

#### 8.5.1 컬러 시스템
- **Primary**: Deep Royal Blue (#28317C) - 권위와 전문성
- **Secondary**: Azure Blue (#3B82F6) - 혁신과 역동성
- **Background**: Void Black (#0A0A0A) - 깊이와 집중
- **Grid**: Mist Gray (#E5E5E5) - 구조와 명확성
- **Track**: Dark Gray (#1a1a1a) - 공간 구분
- **Positive Gate**: Green (#22C55E) - 긍정적 선택
- **Negative Gate**: Red (#EF4444) - 부정적 선택
- **Neutral Gate**: Gray (#E5E5E5) - 중립적 선택

#### 8.5.2 환경 요소
- **별 배경**: 5000개 별, 반경 100, 우주적 분위기
- **동적 바다**: 60×120 그리드, 사인파 애니메이션
- **하늘 파티클**: 1000개 파티클, 회전 애니메이션
- **안개**: 10-50 단위 범위, 깊이감 연출
- **조명**: 스포트라이트 + 앰비언트, BPM 동기화

#### 8.5.3 타이포그래피
- **Gate 라벨**: Playfair Display - 우아하고 고전적
- **UI 텍스트**: 시스템 폰트 - 가독성 우선
- **점수 표시**: 큰 숫자, 명확한 가독성

---

## 9. 플레이어 여정 (Player Journey)

### 9.1 온보딩 프로세스

#### 9.1.1 첫 방문 경험
1. **랜딩 페이지**: 게임의 컨셉과 목적 소개
2. **튜토리얼**: 
   - 기본 조작 방법 안내
   - 노트 시스템 설명
   - Tier와 Axis 개념 소개
3. **첫 플레이**: 쉬운 난이도로 시작

#### 9.1.2 학습 곡선
- **초보자**: ANY 방향 노트 위주, 느린 템포
- **중급자**: 방향 지정 노트, 중간 템포
- **고급자**: 복잡한 패턴, 빠른 템포, Gate 선택 전략

### 9.2 플레이어 성장 경로

#### 9.2.1 스킬 발전
1. **기본 조작 숙달**: 손 움직임의 정확도 향상
2. **패턴 인식**: 노트 패턴을 미리 읽는 능력
3. **리듬감 개발**: 음악과 동기화된 움직임
4. **전략적 사고**: Gate 선택과 점수 최적화

#### 9.2.2 동기 부여 요소
- **즉각적 피드백**: 성공/실패에 대한 즉각적인 반응
- **진행 표시**: 점수, 콤보, 체력으로 진행 상황 파악
- **도전 목표**: 더 높은 점수, 더 긴 콤보, 완벽한 플레이

### 9.3 장기 참여 전략

#### 9.3.1 재방문 동기
- **새로운 차트**: 다양한 음악과 패턴
- **도전 과제**: 특정 목표 달성
- **개인 기록**: 자신의 최고 기록 갱신
- **Gate 탐험**: 다양한 선택의 결과 경험

#### 9.3.2 소셜 요소 (향후)
- **리더보드**: 다른 플레이어와 점수 비교
- **공유 기능**: 플레이 영상 공유
- **멀티플레이어**: 동시 플레이 경쟁

---

## 10. 사용자 가치 (User Value)

### 5.1 즉각적 가치
1. **즐거움과 재미**
   - 리듬감 있는 게임플레이로 스트레스 해소
   - 성취감: 높은 점수와 콤보 달성
   - 몰입감: 3D 환경과 시각적 효과

2. **신체 활동**
   - 손 움직임을 통한 경미한 운동
   - 반응 속도와 협응 능력 향상
   - 리듬감 개발

3. **도전과 성장**
   - 점점 어려워지는 난이도
   - 자신의 기록 개선
   - 완벽한 플레이 추구

### 5.2 교육적 가치
1. **예술 이해**
   - 큐레이터의 역할에 대한 인식
   - 작품 선별 과정의 이해
   - 예술적 가치 판단 경험

2. **선택의 의미**
   - Gate 시스템을 통한 선택의 중요성 인식
   - 각 선택이 결과에 미치는 영향 이해
   - 큐레이터로서의 책임감 체험

3. **문화적 이해**
   - 미술관과 전시에 대한 관심 유발
   - 예술 작품의 다양한 성격 (Axis 시스템)
   - 작품의 등급과 가치 (Tier 시스템)

### 5.3 장기적 가치
1. **인지 능력 향상**
   - 공간 인식 능력
   - 멀티태스킹 능력
   - 집중력 향상

2. **예술적 감각 개발**
   - 시각적 아름다움에 대한 감각
   - 리듬감과 타이밍 감각
   - 조화와 균형에 대한 이해

3. **사회적 가치**
   - 예술 교육 도구로서의 활용
   - 접근성 높은 예술 경험 제공
   - 문화 콘텐츠 확산

---

## 11. 개발 기획 의도

### 6.1 핵심 설계 철학

#### 6.1.1 "게임을 통한 예술 교육"
단순한 리듬 게임이 아닌, 큐레이터의 역할과 예술 작품 선별 과정을 게임으로 체험할 수 있도록 설계했습니다. Tier와 Axis 시스템을 통해 작품의 가치와 성격을 시각화하고, Gate 시스템을 통해 선택의 의미를 전달합니다.

#### 6.1.2 "접근성과 확장성"
웹 브라우저만으로 접근 가능하며, 외부 의존성을 최소화했습니다. 목업 모드를 통해 웹캠이 없는 환경에서도 플레이할 수 있으며, 모든 리소스가 프로그래밍 방식으로 생성되어 확장이 용이합니다.

#### 6.1.3 "몰입감 있는 경험"
3D 환경과 리듬감 있는 게임플레이를 통해 깊은 몰입을 제공합니다. 시각적 효과와 오디오를 결합하여 감각적 경험을 극대화합니다.

### 6.2 시스템 설계 의도

#### 6.2.1 Tier 시스템
작품의 등급을 시각적으로 구분하여, 플레이어가 작품의 가치를 직관적으로 이해할 수 있도록 했습니다. Masterpiece, Exhibition, Sketch의 3단계 구조는 실제 미술관의 작품 분류와 유사합니다.

#### 6.2.2 Axis 시스템
작품을 4가지 축(기관, 학술, 담론, 네트워크)으로 분류하여, 예술 작품의 다양한 성격과 맥락을 표현합니다. 각 축은 고유한 색상으로 구분되어 시각적 일관성을 제공합니다.

#### 6.2.3 Gate 시스템
큐레이터로서의 선택을 게임플레이에 통합하여, 단순한 액션 게임을 넘어 서사적 경험을 제공합니다. 각 Gate는 큐레이터의 여정에서 중요한 순간을 상징하며, 선택의 결과를 시각적으로 표현합니다.

#### 6.2.4 점수 및 체력 시스템
플레이어의 성과를 객관적으로 측정하고, 실패에 대한 페널티를 통해 도전감을 유지합니다. 콤보 시스템은 연속 성공에 대한 보상을 제공하여 몰입감을 높입니다.

### 6.3 기술적 의도

#### 6.3.1 모듈화된 구조
컴포넌트 기반 아키텍처로 유지보수와 확장이 용이하도록 설계했습니다. 각 시스템(노트, Gate, 손 추적 등)이 독립적으로 작동하여 테스트와 수정이 쉬워집니다.

#### 6.3.2 성능 최적화
Three.js를 활용한 효율적인 3D 렌더링과, 필요한 노트만 렌더링하는 최적화를 통해 부드러운 게임플레이를 보장합니다.

#### 6.3.3 크로스 플랫폼 호환성
웹 브라우저 기반으로 설계하여 다양한 디바이스와 운영체제에서 접근 가능합니다. 목업 모드를 통해 하드웨어 제약을 최소화했습니다.

### 6.4 향후 확장 계획

#### 6.4.1 콘텐츠 확장
- 다양한 음악과 차트 추가
- 더 많은 Gate와 서사적 요소
- 다양한 작품 스타일과 Tier 조합

#### 6.4.2 기능 확장
- 멀티플레이어 모드
- 리더보드 시스템
- 커스텀 차트 에디터
- 소셜 공유 기능

#### 6.4.3 교육적 확장
- 큐레이터 교육 모듈
- 작품 정보 및 설명 추가
- 역사적 맥락 제공
- 인터랙티브 학습 자료

---

## 12. 게임플레이 루프

### 7.1 핵심 루프
1. **인지**: 노트가 나타나는 것을 시각적으로 인지
2. **판단**: 노트의 위치, 방향, 손 구분을 빠르게 판단
3. **행동**: 적절한 손을 적절한 위치와 방향으로 이동
4. **피드백**: 성공/실패에 대한 즉각적인 시각적/청각적 피드백
5. **학습**: 반복을 통해 패턴을 학습하고 개선

### 7.2 장기 루프
1. **게임 세션**: 곡을 완주하며 점수와 체력을 관리
2. **Gate 선택**: 각 Phase에서 Gate를 선택하며 서사 진행
3. **재도전**: 실패 후 다시 시도하여 개선
4. **기록 갱신**: 더 높은 점수와 콤보를 목표로 도전

---

## 13. 위험 요소 및 대응 방안

### 8.1 기술적 위험
- **웹캠 성능**: MediaPipe의 성능이 낮은 디바이스에서 저하될 수 있음
  - **대응**: 목업 모드 제공으로 하드웨어 제약 완화
- **브라우저 호환성**: WebGL 지원이 필요한 브라우저 제약
  - **대응**: 폴백 렌더링 옵션 제공

### 8.2 게임플레이 위험
- **난이도 불균형**: 초보자에게 너무 어려울 수 있음
  - **대응**: 난이도 조절 옵션 추가 계획
- **반복성**: 동일한 차트로 인한 지루함
  - **대응**: 다양한 차트와 랜덤 생성 옵션 추가 계획

### 8.3 교육적 위험
- **의도 전달 실패**: 게임플레이에만 집중하여 교육적 의도를 놓칠 수 있음
  - **대응**: 튜토리얼과 설명 추가, Gate 시스템 강화

---

## 14. 개발 로드맵

### 14.1 Phase 1: 프로토타입 (완료)
- ✅ 기본 게임플레이 구현
- ✅ 목업 모드 구현
- ✅ 노트 시스템
- ✅ 점수 및 체력 시스템
- ✅ Gate 시스템 기본 구조

### 14.2 Phase 2: 핵심 기능 강화 (진행 중)
- [ ] 실제 웹캠 모드 완성
- [ ] 다양한 음악 및 차트 추가
- [ ] Gate 선택 결과 구현
- [ ] 난이도 조절 시스템
- [ ] 튜토리얼 시스템

### 14.3 Phase 3: 콘텐츠 확장
- [ ] 5개 이상의 다양한 곡 추가
- [ ] 각 곡별 고유한 Gate 시퀀스
- [ ] Tier와 Axis의 다양한 조합
- [ ] 커스텀 차트 에디터 (선택적)

### 14.4 Phase 4: 고급 기능
- [ ] 리더보드 시스템
- [ ] 멀티플레이어 모드
- [ ] 소셜 공유 기능
- [ ] 성취 시스템
- [ ] 통계 및 분석 대시보드

### 14.5 Phase 5: 교육적 확장
- [ ] 큐레이터 교육 모듈
- [ ] 작품 정보 및 설명
- [ ] 역사적 맥락 제공
- [ ] 인터랙티브 학습 자료

---

## 15. 테스트 전략

### 15.1 기능 테스트
- **노트 판정**: 정확한 타이밍과 방향 인식
- **점수 시스템**: 점수 계산의 정확성
- **체력 시스템**: 체력 변화의 정확성
- **Gate 시스템**: Gate 선택 및 결과 처리

### 15.2 성능 테스트
- **프레임 레이트**: 60fps 유지 목표
- **메모리 사용량**: 브라우저 메모리 최적화
- **로딩 시간**: 초기 로딩 3초 이내 목표
- **렌더링 성능**: 다양한 디바이스에서 테스트

### 15.3 사용성 테스트
- **온보딩**: 신규 사용자의 이해도 측정
- **조작성**: 조작 방법의 직관성 평가
- **난이도**: 다양한 스킬 레벨에서 난이도 평가
- **피드백**: 시각적/청각적 피드백의 효과성

### 15.4 접근성 테스트
- **WCAG 준수**: 웹 접근성 가이드라인 준수
- **키보드 접근성**: 키보드만으로 플레이 가능 여부
- **색상 접근성**: 색맹 사용자 테스트
- **모바일 호환성**: 모바일 디바이스에서의 작동 여부

### 15.5 교육적 효과 테스트
- **학습 목표 달성**: 큐레이터 개념 이해도 측정
- **게임플레이 후 설문**: 교육적 가치 인식도 조사
- **장기 효과**: 반복 플레이 후 학습 효과 측정

---

## 16. 성공 지표

### 9.1 사용자 참여 지표
- 게임 세션 평균 플레이 시간
- 재방문률
- 곡 완주율
- 평균 점수 및 콤보

### 9.2 교육적 효과 지표
- Gate 선택 패턴 분석
- Tier별 성공률
- Axis별 선호도

### 16.3 기술적 지표
- **프레임 레이트**: 목표 60fps, 최소 30fps 유지
- **로딩 시간**: 초기 로딩 3초 이내
- **에러 발생률**: 1% 미만 목표
- **브라우저 호환성**: Chrome, Firefox, Safari, Edge 지원

### 16.4 비즈니스 지표
- **사용자 획득**: 월간 신규 사용자 수
- **사용자 유지**: 7일, 30일 리텐션율
- **참여도**: 평균 세션 시간, 세션당 플레이 횟수
- **전환율**: 방문자 대비 실제 플레이어 비율

---

## 17. 경쟁사 분석

### 17.1 직접 경쟁사

#### Beat Saber
- **강점**: VR 기반 몰입감, 넓은 사용자층
- **약점**: VR 헤드셋 필요, 높은 진입 장벽
- **차별화**: 웹 기반 접근성, 교육적 가치, 큐레이터 컨셉

#### OSU!
- **강점**: 다양한 모드, 커뮤니티 활성화
- **약점**: 복잡한 인터페이스, 높은 학습 곡선
- **차별화**: 직관적인 UI, 교육적 목적, 서사적 요소

### 17.2 간접 경쟁사

#### 예술 교육 앱
- **강점**: 전문적인 교육 콘텐츠
- **약점**: 수동적 학습, 낮은 참여도
- **차별화**: 게임화를 통한 능동적 학습, 몰입형 경험

### 17.3 경쟁 우위
1. **독특한 컨셉**: 큐레이터 + 리듬 게임의 독창적 결합
2. **접근성**: 웹 브라우저만으로 접근 가능
3. **교육적 가치**: 단순 오락을 넘어 학습 도구
4. **확장성**: 다양한 콘텐츠 추가 가능

---

## 18. 마케팅 전략

### 18.1 타겟 마케팅

#### 18.1.1 예술 교육 시장
- **채널**: 예술 대학, 미술관, 큐레이터 교육 기관
- **메시지**: "큐레이터가 되는 방법을 게임으로 배우세요"
- **전략**: 교육 기관과의 파트너십, 워크샵 및 세미나

#### 18.1.2 게이머 커뮤니티
- **채널**: 게임 포럼, 소셜 미디어, 스트리밍 플랫폼
- **메시지**: "새로운 리듬 게임 경험"
- **전략**: 인플루언서 협업, 게임 플레이 영상 공유

### 18.2 콘텐츠 마케팅
- **블로그**: 큐레이터의 역할, 예술 작품 선별 과정
- **비디오**: 게임플레이 영상, 교육적 콘텐츠
- **소셜 미디어**: 게임 스크린샷, 사용자 생성 콘텐츠

### 18.3 커뮤니티 구축
- **디스코드/포럼**: 사용자 커뮤니티 형성
- **이벤트**: 온라인 토너먼트, 챌린지
- **피드백 수집**: 사용자 의견 수렴 및 반영

---

## 19. 결론

Curator Game은 단순한 리듬 게임을 넘어, 큐레이터의 역할과 예술 작품 선별 과정을 몰입형으로 체험할 수 있는 독특한 게임입니다. Tier와 Axis 시스템을 통해 작품의 가치와 성격을 시각화하고, Gate 시스템을 통해 선택의 의미를 전달합니다. 웹 브라우저 기반의 접근성과 확장 가능한 구조를 통해, 예술 교육 도구로서의 가치를 제공합니다.

플레이어는 게임을 통해 즐거움과 재미를 느끼며, 동시에 예술에 대한 이해와 감각을 개발할 수 있습니다. 이는 게임이 단순한 오락을 넘어 교육적 가치를 가진 콘텐츠임을 의미합니다.

Curator Game은 다음과 같은 독특한 가치를 제공합니다:

1. **혁신적인 게임플레이**: Beat Saber 스타일의 리듬 게임과 큐레이터 컨셉의 독창적 결합
2. **교육적 가치**: 게임을 통한 예술 교육과 큐레이터 역할 이해
3. **접근성**: 웹 브라우저만으로 접근 가능한 범용적 경험
4. **확장성**: 다양한 콘텐츠와 기능 추가가 가능한 구조
5. **서사적 경험**: Gate 시스템을 통한 선택과 결과의 의미 전달

이 문서는 Curator Game의 기획 의도, 게임 규칙, 기술적 구현, 사용자 가치, 개발 계획을 포괄적으로 다루며, 프로젝트의 방향성과 목표를 명확히 제시합니다.

---

## 부록

### A. 용어집

- **노트 (Note)**: 플레이어가 자르는 작품을 상징하는 게임 오브젝트
- **Tier**: 작품의 등급 (Masterpiece, Exhibition, Sketch)
- **Axis**: 작품의 성격과 맥락 (Institution, Academic, Discourse, Network)
- **Gate**: 큐레이터의 선택을 상징하는 게임 요소
- **콤보 (Combo)**: 연속으로 노트를 성공적으로 자른 횟수
- **배수 (Multiplier)**: 콤보에 따라 적용되는 점수 배수
- **Hit Box**: 노트를 자를 수 있는 범위
- **Good Cut**: 정확한 방향과 속도로 노트를 자른 경우
- **Bad Cut**: 노트를 자르긴 했지만 조건을 완벽히 충족하지 못한 경우
- **Miss**: 노트를 놓친 경우

### B. 참고 자료

- Beat Saber: VR 리듬 게임의 대표작
- MediaPipe: Google의 손 추적 라이브러리
- Three.js: 웹 기반 3D 그래픽 라이브러리
- React Three Fiber: React와 Three.js 통합 라이브러리

### C. 문서 이력

- **v1.0** (2024년): 초기 BRD 작성
- **v2.0** (2024년): 확장 버전 - 타겟 오디언스, 스토리텔링, UI/UX, 개발 로드맵 등 추가

---

**문서 작성일**: 2024년  
**작성자**: 개발팀  
**검토 상태**: 확장 버전  
**다음 검토 예정일**: 프로젝트 진행에 따라 업데이트  
**문서 버전**: 2.0

