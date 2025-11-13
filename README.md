# SmartRoute Planner 🗺️# React + TypeScript + Vite



사용자 맞춤형 여행 계획 및 다중 경유지 경로 분석 웹 애플리케이션This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.



## 📋 프로젝트 개요Currently, two official plugins are available:



**SmartRoute Planner**는 여행자가 여러 장소를 방문할 때 이동 경로와 시간을 자동으로 계획해 주는 웹 서비스입니다. 하루 단위로 일정을 생성하고, 장소 정보를 확인하며, 실시간으로 경로를 계산할 수 있습니다.- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh

- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

### 🎯 핵심 기능

## React Compiler

- ✨ **경로 분석**: 출발지부터 여러 경유지를 거쳐 목적지까지 최적 경로 계산

- 🔍 **장소 탐색**: 추천 관광지, 맛집, 카페 등 다양한 장소 검색 및 필터링The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

- 📅 **일정 관리**: 날짜별 여행 일정 저장 및 관리

- 🎨 **드래그 앤 드롭**: 직관적인 UI로 방문 순서 변경## Expanding the ESLint configuration

- 🚗 **교통수단 비교**: 도보, 대중교통, 차량별 경로 및 시간 비교

- 💾 **로컬 저장**: 브라우저 로컬 스토리지를 통한 일정 저장If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:



## 🛠️ 기술 스택```js

export default defineConfig([

- **Frontend**: React 19 + TypeScript  globalIgnores(['dist']),

- **Routing**: React Router DOM v7  {

- **Styling**: Tailwind CSS v4    files: ['**/*.{ts,tsx}'],

- **State Management**: React Context API + useReducer    extends: [

- **Drag & Drop**: @dnd-kit      // Other configs...

- **Date Handling**: date-fns

- **Icons**: lucide-react      // Remove tseslint.configs.recommended and replace with this

- **Build Tool**: Vite 7      tseslint.configs.recommendedTypeChecked,

- **Backend Ready**: Firebase (Firestore, Auth) - 연동 준비 완료      // Alternatively, use this for stricter rules

      tseslint.configs.strictTypeChecked,

## 🚀 빠른 시작      // Optionally, add this for stylistic rules

      tseslint.configs.stylisticTypeChecked,

### 필수 조건

      // Other configs...

- Node.js 18+     ],

- npm 또는 yarn    languageOptions: {

      parserOptions: {

### 설치 및 실행        project: ['./tsconfig.node.json', './tsconfig.app.json'],

        tsconfigRootDir: import.meta.dirname,

```bash      },

# 의존성 설치      // other options...

npm install    },

  },

# 개발 서버 실행])

npm run dev```



# 빌드You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

npm run build

```js

# 프로덕션 미리보기// eslint.config.js

npm run previewimport reactX from 'eslint-plugin-react-x'

```import reactDom from 'eslint-plugin-react-dom'



개발 서버는 기본적으로 `http://localhost:5173`에서 실행됩니다.export default defineConfig([

  globalIgnores(['dist']),

## 📂 프로젝트 구조  {

    files: ['**/*.{ts,tsx}'],

```    extends: [

src/      // Other configs...

├── components/          # 재사용 가능한 컴포넌트      // Enable lint rules for React

│   ├── TopBar.tsx      # 상단 네비게이션 바      reactX.configs['recommended-typescript'],

│   ├── MapPanel.tsx    # 지도 표시 영역      // Enable lint rules for React DOM

│   ├── PlacePopup.tsx  # 장소 상세 정보 팝업      reactDom.configs.recommended,

│   ├── PlaceCard.tsx   # 장소 카드    ],

│   ├── ItineraryCard.tsx    # 일정 카드    languageOptions: {

│   ├── ItineraryList.tsx    # 드래그 가능한 일정 리스트      parserOptions: {

│   ├── TransportModeSwitcher.tsx  # 교통수단 선택기        project: ['./tsconfig.node.json', './tsconfig.app.json'],

│   └── RouteSummary.tsx     # 경로 요약 정보        tsconfigRootDir: import.meta.dirname,

├── pages/              # 페이지 컴포넌트      },

│   ├── HomePage.tsx    # 홈/랜딩 페이지      // other options...

│   ├── PlannerPage.tsx # 경로 분석 페이지 (핵심)    },

│   ├── ExplorePage.tsx # 장소 탐색 페이지  },

│   ├── MyPlanPage.tsx  # 내 일정 관리 페이지])

│   └── CommunityPage.tsx # 커뮤니티 (준비 중)```

├── contexts/           # Context API 상태 관리
│   ├── ItineraryContext.tsx  # 일정 전역 상태
│   └── useItinerary.ts       # 커스텀 훅
├── types/              # TypeScript 타입 정의
│   └── index.ts
├── data/               # 샘플 데이터
│   └── mockPlaces.ts   # 서울 주요 장소 데이터
├── utils/              # 유틸리티 함수
│   └── routeUtils.ts   # 경로 계산 로직
├── App.tsx             # 루트 컴포넌트
├── main.tsx            # 앱 엔트리 포인트
└── index.css           # 전역 스타일
```

## 🎨 주요 페이지

### 1. `/` - 홈 페이지
- 서비스 소개 및 주요 기능 안내
- 각 페이지로 이동할 수 있는 CTA 버튼

### 2. `/planner` - 경로 분석 (핵심 기능)
- **좌측 패널**: 일정 카드 목록, 드래그 앤 드롭으로 순서 변경
- **우측 패널**: 지도에 경로 시각화
- **기능**:
  - 장소 추가/삭제
  - 교통수단 선택 (도보/대중교통/차량)
  - 실시간 경로 재계산
  - 총 소요 시간 및 거리 요약

### 3. `/explore` - 장소 탐색
- 추천 장소 섹션
- 카테고리 필터 (관광지, 맛집, 카페, 쇼핑 등)
- 검색 기능
- 카드 클릭으로 상세 정보 확인
- "일정에 추가" 버튼

### 4. `/myplan` - 내 일정
- 캘린더 뷰
- 날짜별 일정 조회
- 메모 및 사진 추가 (준비 중)

### 5. `/community` - 커뮤니티 (준비 중)
- 다른 사용자 경로 공유
- 좋아요 및 댓글 기능

## 🔧 커스터마이징 가이드

### 지도 API 연동 (Kakao Maps)

이 프로젝트에는 Kakao Maps JavaScript SDK 연동이 기본 포함되어 있습니다. 아래 절차로 바로 사용하세요.

1) 환경 변수 설정

- 루트에 있는 `.env.example`를 복사해 `.env.local`을 만들고, Kakao JavaScript 키를 입력합니다.

```
VITE_KAKAO_JS_KEY=YOUR_KAKAO_JAVASCRIPT_KEY
```

2) 도메인 제한 설정 (강력 권장)

- Kakao Developers 콘솔에서 JavaScript 키의 허용 도메인에 개발/배포 도메인을 등록하세요.
  예) http://localhost:5173, https://your-domain.com

3) 동작 방식

- `src/utils/loadKakaoSdk.ts`가 SDK 스크립트를 autoload=false로 동적 로드합니다.
- `src/components/MapPanel.tsx`가 일정 아이템의 좌표로 마커를 표시하고, 아이템 순서대로 폴리라인을 그립니다.
- 키가 없거나 로드 오류가 발생하면 지도 영역에 안내 메시지가 표시됩니다.

참고: Google Maps 연동이 필요하다면 별도로 구현하세요. 현재 기본 구현은 Kakao Maps 입니다.

### Firebase 연동

```bash
# Firebase SDK 설치 (이미 설치됨)
npm install firebase

# src/firebase/config.ts 생성
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
```

### 샘플 데이터 변경

`src/data/mockPlaces.ts` 파일을 수정하여 다른 지역의 장소를 추가할 수 있습니다:

```typescript
export const mockPlaces: Place[] = [
  {
    id: 'place-new',
    name: '새로운 장소',
    lat: 37.5665,
    lng: 126.9780,
    category: 'attraction',
    description: '장소 설명',
    openingHours: '09:00 - 18:00',
    rating: 4.5,
    address: '서울시 중구',
    photos: ['이미지 URL'],
  },
  // ... 더 많은 장소
];
```

## 🎯 포트폴리오 시연 가이드

### 데모 시나리오 (2-3분)

1. **홈 페이지 소개** (20초)
   - 서비스 개요 및 주요 기능 설명

2. **장소 탐색** (30초)
   - `/explore`로 이동
   - 필터 및 검색 시연
   - 3-4개 장소를 일정에 추가

3. **경로 분석** (60초)
   - `/planner`로 자동 이동
   - 드래그 앤 드롭으로 순서 변경 → 경로 자동 재계산
   - 교통수단 변경 (도보 → 대중교통 → 차량)
   - 카드 클릭하여 장소 상세 정보 확인
   - "길찾기" 버튼 시연

4. **내 일정** (20초)
   - `/myplan`으로 이동
   - 저장된 일정 확인

### 주요 강조 포인트

- ✅ **실시간 반응형 UI**: 드래그 시 즉시 경로 재계산
- ✅ **직관적인 UX**: 카드 기반 인터페이스, 명확한 액션 버튼
- ✅ **TypeScript**: 타입 안전성
- ✅ **모던 React**: Hooks, Context API, 함수형 컴포넌트
- ✅ **확장 가능한 구조**: Firebase/Maps API 연동 준비 완료

## 🐛 알려진 제한사항

- 지도는 플레이스홀더로 표시됩니다 (Google Maps / Kakao Maps API 연동 필요)
- 경로 계산은 Haversine 공식을 사용한 간단한 알고리즘입니다 (실제 Directions API 연동 권장)
- 일정은 로컬 스토리지에 저장됩니다 (Firebase 연동 시 영구 저장 가능)
- 커뮤니티 기능은 UI만 준비되어 있습니다

## 🔜 향후 개선 사항

- [ ] Google Directions API 연동
- [ ] Firebase Authentication 구현
- [ ] Firestore를 통한 데이터 영구 저장
- [ ] 실시간 위치 추적 및 네비게이션
- [ ] 공공데이터 API 연동 (관광지 정보)
- [ ] PWA 지원 (오프라인 모드)
- [ ] 다국어 지원 (i18n)
- [ ] 커뮤니티 기능 완성

## 📄 라이선스

MIT License

## 👤 작성자

- GitHub: [@hdi1021](https://github.com/hdi1021)
- Repository: [TailwindcssTest](https://github.com/hdi1021/TailwindcssTest)

## 🙏 감사의 말

이 프로젝트는 포트폴리오 및 학습 목적으로 제작되었습니다.

---

**🚀 지금 바로 시작하세요!**

```bash
npm install
npm run dev
```

브라우저에서 `http://localhost:5173`을 열어 확인하세요.
