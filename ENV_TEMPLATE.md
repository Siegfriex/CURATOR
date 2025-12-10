# 환경 변수 설정 가이드

## 파일 구조

프로젝트에는 두 개의 환경 변수 파일이 필요합니다:

1. **`.env.local`** - 프론트엔드 (Vite)용
2. **`.env.curatorproto`** - Firebase Functions용

## 빠른 설정 방법

### 1. 프론트엔드 환경 변수 (`.env.local`)

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 내용을 복사:

```env
# ============================================
# 프론트엔드 환경 변수 (.env.local)
# Vite에서 사용하는 환경 변수
# ============================================

# Gemini API Key (프론트엔드에서 사용할 경우)
GEMINI_API_KEY=your_gemini_api_key_here

# Firebase 설정 (프론트엔드)
VITE_FIREBASE_API_KEY=your_firebase_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=curatorproto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=curatorproto
VITE_FIREBASE_STORAGE_BUCKET=curatorproto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id_here
VITE_FIREBASE_APP_ID=your_firebase_app_id_here

# Firebase Functions URL (선택사항)
VITE_FUNCTIONS_URL=https://us-central1-curatorproto.cloudfunctions.net
```

### 2. Firebase Functions 환경 변수 (`.env.curatorproto`)

프로젝트 루트에 `.env.curatorproto` 파일을 생성하고 다음 내용을 복사:

```env
# ============================================
# Firebase Functions 환경 변수 (.env.curatorproto)
# Firebase Functions 2nd gen에서 사용
# ============================================

# Gemini API Key (필수)
GEMINI_API_KEY=your_gemini_api_key_here

# Google Custom Search Engine API (선택사항)
# Google Custom Search API를 사용하려면 설정 필요
# 설정 방법: functions/GOOGLE_CSE_SETUP.md 참고
GOOGLE_CSE_API_KEY=your_google_cse_api_key_here
GOOGLE_CSE_ID=your_google_cse_id_here
```

## 값 가져오는 방법

### Firebase 설정 값 가져오기

1. [Firebase Console](https://console.firebase.google.com/) 접속
2. 프로젝트 선택 (`curatorproto`)
3. 프로젝트 설정 (⚙️) → 일반 탭
4. "내 앱" 섹션에서 웹 앱 설정 확인
5. `firebaseConfig` 객체에서 값 복사:
   ```javascript
   const firebaseConfig = {
     apiKey: "AIza...",           // → VITE_FIREBASE_API_KEY
     authDomain: "...",            // → VITE_FIREBASE_AUTH_DOMAIN
     projectId: "curatorproto",    // → VITE_FIREBASE_PROJECT_ID
     storageBucket: "...",         // → VITE_FIREBASE_STORAGE_BUCKET
     messagingSenderId: "...",     // → VITE_FIREBASE_MESSAGING_SENDER_ID
     appId: "..."                  // → VITE_FIREBASE_APP_ID
   };
   ```

### Gemini API Key 가져오기

1. [Google AI Studio](https://aistudio.google.com/app/apikey) 접속
2. "Create API Key" 클릭
3. 생성된 API 키 복사
4. `.env.local`과 `.env.curatorproto` 모두에 동일한 키 입력

### Google Custom Search Engine 설정 (선택사항)

자세한 설정 방법은 `functions/GOOGLE_CSE_SETUP.md` 파일을 참고하세요.

1. [Google Custom Search Engine](https://programmablesearchengine.google.com/) 접속
2. 검색 엔진 생성
3. Search Engine ID 복사 → `GOOGLE_CSE_ID`
4. [Google Cloud Console](https://console.cloud.google.com/apis/credentials)에서 API 키 생성
5. API 키 복사 → `GOOGLE_CSE_API_KEY`

## 배포 시 환경 변수 설정

### Firebase Functions 배포 시

로컬 개발용 `.env.curatorproto` 파일 외에, 배포 환경에서는 다음 방법 중 하나를 사용:

#### 방법 1: Firebase Functions Config (레거시)
```bash
firebase functions:config:set gemini.api_key="your_key"
firebase functions:config:set google.cse.api_key="your_key"
firebase functions:config:set google.cse.id="your_id"
```

#### 방법 2: Firebase Functions Secrets (권장)
```bash
firebase functions:secrets:set GEMINI_API_KEY
firebase functions:secrets:set GOOGLE_CSE_API_KEY
firebase functions:secrets:set GOOGLE_CSE_ID
```

#### 방법 3: .env.curatorproto 파일 (로컬 개발)
- 로컬 개발 및 에뮬레이터에서 자동으로 로드됨

## 보안 주의사항

⚠️ **중요**: 
- `.env.local`과 `.env.curatorproto` 파일은 `.gitignore`에 포함되어 있어야 합니다
- 절대 Git에 커밋하지 마세요
- API 키를 공유하거나 노출하지 마세요

## 확인 방법

환경 변수가 제대로 설정되었는지 확인:

```bash
# 프론트엔드 빌드 테스트
npm run build

# Functions 빌드 테스트
cd functions
npm run build
cd ..
```

