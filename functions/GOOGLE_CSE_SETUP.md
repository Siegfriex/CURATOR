# Google Custom Search Engine 설정 가이드

## 추천 검색 사이트 목록

### 1. 아트 뉴스 & 비평 사이트 (Art News & Criticism)
- `artnet.com` - 글로벌 아트 뉴스, 경매 정보, 아티스트 프로필
- `artsy.net` - 현대 미술 갤러리, 아티스트, 작품 데이터베이스
- `artforum.com` - 아트 포럼, 비평, 전시 리뷰
- `theartnewspaper.com` - 아트 뉴스페이퍼
- `hyperallergic.com` - 현대 미술 비평 및 뉴스

### 2. 미술관 & 기관 (Museums & Institutions)
- `moma.org` - 뉴욕 현대미술관
- `tate.org.uk` - 테이트 미술관 (영국)
- `guggenheim.org` - 구겐하임 미술관
- `metmuseum.org` - 메트로폴리탄 미술관
- `whitney.org` - 휘트니 미술관
- `saatchigallery.com` - 사치 갤러리

### 3. 경매 하우스 (Auction Houses)
- `christies.com` - 크리스티 경매
- `sothebys.com` - 소더비 경매
- `phillips.com` - 필립스 경매

### 4. 아티스트 데이터베이스 & 아카이브
- `artcyclopedia.com` - 아트 백과사전
- `wikiart.org` - 위키아트 (작품 이미지 및 정보)
- `mutualart.com` - 뮤추얼아트 (경매 기록, 전시 이력)

### 5. 학술 & 참고 자료 (Academic & Reference)
- `wikipedia.org` - 위키피디아 (특히 en.wikipedia.org)
- `britannica.com` - 브리태니커 백과사전
- `oxfordartonline.com` - 옥스포드 아트 온라인 (유료)

## Google Custom Search Engine 설정 방법

### 방법 1: 특정 사이트만 검색 (권장 - 더 정확한 결과)

1. **https://programmablesearchengine.google.com/** 접속
2. "Create a custom search engine" 클릭
3. **Sites to search**에 다음 중 하나 입력:

#### 옵션 A: 주요 아트 사이트만 (빠르고 정확)
```
artnet.com OR artsy.net OR artforum.com OR moma.org OR tate.org.uk OR christies.com OR sothebys.com OR wikipedia.org
```

#### 옵션 B: 더 많은 사이트 포함 (포괄적)
```
artnet.com OR artsy.net OR artforum.com OR theartnewspaper.com OR hyperallergic.com OR moma.org OR tate.org.uk OR guggenheim.org OR metmuseum.org OR whitney.org OR christies.com OR sothebys.com OR phillips.com OR artcyclopedia.com OR wikiart.org OR mutualart.com OR en.wikipedia.org
```

4. **Name**: "CURATOR Art Search Engine"
5. **Language**: English
6. **Create** 클릭
7. **Search Engine ID** 복사 (예: `012345678901234567890:abcdefghijk`)

### 방법 2: 전체 웹 검색 (더 느리지만 포괄적)

1. **Sites to search**에 `*` 입력
2. 나머지 단계는 동일

## API 키 생성

1. **https://console.cloud.google.com/apis/credentials** 접속
2. 프로젝트 선택 (또는 새 프로젝트 생성)
3. **"Create Credentials"** → **"API Key"** 선택
4. API 키 복사
5. (선택) API 키 제한 설정:
   - **Application restrictions**: None
   - **API restrictions**: "Restrict key" → "Custom Search API" 선택

## 환경 변수 설정

### `.env.curatorproto` 파일에 추가:
```env
GOOGLE_CSE_API_KEY=your_api_key_here
GOOGLE_CSE_ID=your_search_engine_id_here
```

### 또는 Firebase Functions 설정:
```bash
firebase functions:config:set google.cse.api_key="your_api_key"
firebase functions:config:set google.cse.id="your_search_engine_id"
```

## 비용

- **무료 할당량**: 일일 100회 검색
- **유료 플랜**: $5/1,000회 (추가)

## 성능 개선 효과

- **현재 (Gemini 도구)**: 60-120초
- **Custom Search API 사용**: 20-40초
- **이유**:
  1. 검색을 먼저 병렬로 수행 (~1-2초)
  2. 검색 결과 캐싱 (24시간)으로 재사용
  3. Gemini 도구 호출 오버헤드 제거

## 캐싱 전략

검색 결과는 **24시간 동안 캐싱**됩니다:
- 동일한 쿼리는 캐시에서 즉시 반환
- Firestore `search` 컬렉션에 저장
- TTL: 24시간

## 문제 해결

### 검색 결과가 없을 때
- Custom Search Engine이 특정 사이트만 검색하도록 설정했는지 확인
- 사이트 URL이 정확한지 확인 (예: `artnet.com` vs `www.artnet.com`)

### API 할당량 초과
- 일일 100회 제한 확인
- 캐싱으로 재사용 빈도 증가
- 필요시 유료 플랜 고려

