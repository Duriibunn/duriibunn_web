# 두리번 (Dooribun) 🗺️

사용자 맞춤형 여행 계획 및 다중 경유지 경로 분석 웹 애플리케이션

## 📋 프로젝트 개요

**두리번 (Dooribun)**은 여행자가 여러 장소를 방문할 때 이동 경로와 시간을 자동으로 계획해 주는 웹 서비스입니다. 하루 단위로 일정을 생성하고, 실시간 공공데이터로 관광지 정보를 확인하며, Kakao Maps로 경로를 시각화할 수 있습니다.

### 🎯 핵심 기능

- ✨ **경로 분석**: Kakao Maps 기반 실시간 경로 계산 및 지도 시각화
- 🔍 **장소 탐색**: 한국관광공사 공공데이터 API 연동으로 실시간 관광지/문화시설/숙박 정보
- 📅 **일정 관리**: Firebase Firestore 기반 일정 저장 및 관리
- 🎨 **드래그 앤 드롭**: 직관적인 UI로 방문 순서 변경
- 🚗 **교통수단 비교**: 도보, 대중교통, 차량별 경로 및 시간 비교
- 🌐 **다국어 지원**: 한국어/영어 UI (i18next)
- 💾 **클라우드 저장**: Firebase Firestore + 로컬 스토리지 백업

### 🆕 최신 업데이트 (2025-11-23)

- ✅ **마이로 스타일 홈페이지 개선** (내 여행 계획 섹션 추가)
  - 여행 계획이 있을 때: 여행 카드 그리드 표시
  - 여행 계획이 없을 때: 빈 상태 UI + CTA 버튼
  - 증언 섹션: "10시간 → 5분" 시간 절약 메시지
- ✅ **트리플 스타일 여행 생성 플로우**
  - 지역 선택 → 추천 여행지 → 검색 기능
  - SelectCityPage: 9개 한국 주요 도시
  - RecommendationsPage: API 기반 추천 + 검색
- ✅ **공공데이터 API 통합** (data.go.kr - 한국관광공사 Tour API)
- ✅ **Firebase CRUD 완료** (일정 생성/읽기/수정/삭제)
- ✅ **다국어 지원** (i18next - 한국어/영어)
- ✅ **글로벌 Toast 알림** (성공/에러/경고/정보)
- ✅ **로딩 스피너** (API 호출 중 피드백)

## 🛠️ 기술 스택

- **Frontend**: React 19.2.0 + TypeScript 5.9.3
- **Build Tool**: Vite 6.4.1
- **Routing**: React Router DOM v7.9.5
- **Styling**: Tailwind CSS v4.1.17
- **State Management**: Context API + useReducer
- **Maps**: Kakao Maps JavaScript SDK
- **Backend**: Firebase 12.5.0 (Firestore, Auth)
- **i18n**: i18next 25.6.2 + react-i18next
- **Drag & Drop**: @dnd-kit/core + @dnd-kit/sortable
- **Date Handling**: date-fns
- **Icons**: lucide-react
- **Public Data**: data.go.kr 한국관광공사 Tour API

## 🚀 빠른 시작

### 필수 조건

- Node.js 22+
- npm 또는 yarn

### 1. 저장소 클론 및 의존성 설치

```bash
# 의존성 설치
npm install
```

### 2. 환경 변수 설정

`.env.example` 파일을 복사하여 `.env.local` 파일을 생성하고 API 키를 입력하세요:

```bash
cp .env.example .env.local
```

#### 필수 API 키 발급 방법:

**1) Firebase 설정**
1. [Firebase Console](https://console.firebase.google.com/) 접속
2. 새 프로젝트 생성
3. 프로젝트 설정 → SDK 설정 및 구성에서 API 키 확인
4. Firestore Database 생성 (테스트 모드 시작)
5. `.env.local`에 Firebase 정보 입력

**2) Kakao Maps API**
1. [Kakao Developers](https://developers.kakao.com/) 가입/로그인
2. 내 애플리케이션 → 애플리케이션 추가
3. 앱 키 → JavaScript 키 확인
4. 플랫폼 설정 → Web 플랫폼 추가 (http://localhost:5173)
5. `.env.local`에 JavaScript 키 입력

**3) 공공데이터 API (data.go.kr)**
1. [공공데이터 포털](https://www.data.go.kr/) 가입/로그인
2. "한국관광공사_국문 관광정보 서비스_GW" 검색
3. 활용신청 (승인까지 1-2시간 소요)
4. 마이페이지 → API 인증키 → 일반 인증키 (Encoding) 확인
5. `.env.local`에 API 키 입력

### 3. 개발 서버 실행

```bash
# 개발 서버 시작 (http://localhost:5173)
npm run dev
```

### 4. 프로덕션 빌드

```bash
# 프로덕션 빌드
npm run build

# 빌드 결과 미리보기
npm run preview
```

## 📂 프로젝트 구조

```
src/
├── components/          # 재사용 가능한 UI 컴포넌트
│   ├── TopBar.tsx      # 상단 네비게이션
│   ├── MapPanel.tsx    # Kakao Maps 지도 컴포넌트
│   ├── PlaceCard.tsx   # 장소 카드
│   ├── Toast.tsx       # 글로벌 알림 시스템
│   └── ...
├── contexts/           # React Context (상태 관리)
│   ├── ItineraryContext.tsx  # 일정 상태 관리
│   └── useItinerary.ts       # 일정 훅
├── firebase/           # Firebase 설정 및 CRUD
│   ├── config.ts       # Firebase 초기화
│   └── itineraries.ts  # Firestore CRUD 함수
├── i18n/               # 다국어 지원
│   └── config.ts       # i18next 설정 (한국어/영어)
├── pages/              # 페이지 컴포넌트
│   ├── HomePage.tsx    # 홈 (여행 일정 시작)
│   ├── PlannerPage.tsx # 경로 계획 (지도 + 일정 관리)
│   ├── ExplorePage.tsx # 장소 탐색 (공공데이터 API)
│   ├── MyPlanPage.tsx  # 내 일정 목록
│   └── CommunityPage.tsx  # 커뮤니티 (준비 중)
├── types/              # TypeScript 타입 정의
│   ├── index.ts        # 공통 타입
│   └── kakao.d.ts      # Kakao Maps 타입
├── utils/              # 유틸리티 함수
│   ├── loadKakaoSdk.ts    # Kakao Maps SDK 동적 로드
│   ├── publicDataApi.ts   # 공공데이터 API 클라이언트
│   └── routeUtils.ts      # 경로 계산 유틸
├── data/               # Mock 데이터
│   ├── mockPlaces.ts   # 샘플 장소 데이터
│   └── mockHotels.ts   # 샘플 호텔 데이터
├── App.tsx             # 메인 앱 컴포넌트
└── main.tsx            # 엔트리 포인트
```

## 🎨 UI 스타일 가이드

프로젝트의 모든 UI는 `readme.txt`에 정의된 디자인 시스템을 따릅니다:

- **컬러 팔레트**: Primary Teal (#14b8a6 기반)
- **타이포그래피**: text-xs ~ text-5xl 스케일
- **버튼 스타일**: Primary, Secondary, Icon 버튼
- **반응형**: Tailwind 브레이크포인트만 사용 (sm/md/lg/xl/2xl)
- **금지 사항**: 인라인 스타일, 커스텀 CSS, !important 남용

자세한 내용은 `readme.txt` 파일을 참조하세요.

## 🌐 다국어 지원

- **지원 언어**: 한국어 (기본), 영어
- **UI 번역**: 모든 UI 텍스트는 i18next로 번역됨
- **DB 데이터**: 사용자 입력 데이터는 번역하지 않음 (원본 유지)
- **언어 전환**: TopBar의 Globe 아이콘 클릭

번역 키는 `src/i18n/config.ts`에서 관리됩니다.

## 🔥 Firebase 설정

### Firestore 데이터 구조

```typescript
// Collection: itineraries
{
  id: string,
  title: string,
  date: string,  // ISO date string
  items: ItineraryItem[],
  transportMode: 'WALK' | 'TRANSIT' | 'DRIVE',
  userId?: string,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### Firestore 보안 규칙 (예시)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /itineraries/{itineraryId} {
      // 모든 사용자 읽기 허용
      allow read: if true;
      
      // 인증된 사용자만 쓰기 허용
      allow create, update, delete: if request.auth != null;
    }
  }
}
```

## 🗺️ Kakao Maps 기능

- **마커 표시**: 일정의 모든 장소에 마커 표시
- **경로 그리기**: Polyline으로 경로 시각화
- **교통수단별 색상**: 도보(녹색), 대중교통(인디고), 차량(황금색)
- **InfoWindow**: 마커 클릭 시 장소 정보 표시
- **줌 컨트롤**: +/− 버튼으로 지도 확대/축소
- **길찾기**: Kakao 내비 → Google Maps 폴백

## 📊 공공데이터 API 활용

### 지원 기능

- **지역 기반 조회**: 서울 관광지/문화시설/숙박/음식점
- **키워드 검색**: 장소 이름으로 검색
- **위치 기반 검색**: GPS 좌표 기반 주변 검색 (5km 반경)
- **캐싱**: 30분 메모리 캐시로 API 호출 최적화

### API 사용 예시

```typescript
import { getSeoulTouristSpots, searchKeyword } from './utils/publicDataApi';

// 서울 관광지 20개 조회
const places = await getSeoulTouristSpots(20);

// 키워드 검색
const results = await searchKeyword('경복궁', CONTENT_TYPES.TOURIST_SPOT);
```

## 🧪 테스트

### 코드 품질 체크
```bash
# ESLint 실행
npm run lint

# TypeScript 타입 체크
npm run tsc
```

### 홈페이지 "내 여행 계획" 기능 테스트

**빈 상태 테스트** (여행 계획이 없을 때):
1. 브라우저에서 http://localhost:5173 접속
2. "내 여행 계획" 섹션에 빈 상태 UI 확인
3. "여행 계획 세우기" 버튼 클릭 → `/trip/select-city` 이동 확인

**여행 계획 있는 상태 테스트**:
1. 브라우저 개발자 도구 (F12) 콘솔 열기
2. 다음 명령어 입력하여 샘플 데이터 추가:
```javascript
localStorage.setItem('myTrips', JSON.stringify([
  {
    id: 'trip-1',
    title: '서울 주말 여행',
    city: '서울',
    startDate: '2025-12-01',
    endDate: '2025-12-03',
    days: 3,
    itineraries: []
  },
  {
    id: 'trip-2',
    title: '제주도 힐링',
    city: '제주',
    startDate: '2025-12-15',
    endDate: '2025-12-18',
    days: 4,
    itineraries: []
  }
]))
```
3. 페이지 새로고침 (F5)
4. "내 여행 계획" 섹션에 여행 카드 2개 + "새 여행 계획 만들기" 카드 확인
5. 여행 카드 클릭 → 상세 페이지 이동 확인
6. "새 여행 계획 만들기" 카드 클릭 → `/trip/select-city` 이동 확인

**데이터 초기화**:
```javascript
localStorage.removeItem('myTrips')
// 페이지 새로고침
```

## 📝 프로젝트 요구사항 체크리스트

- ✅ Vite + TypeScript + React 19
- ✅ Node 22+ 지원
- ✅ Tailwind CSS v4
- ✅ React Router (5개 페이지)
- ✅ 공공데이터 API 연동 (data.go.kr)
- ✅ Firebase CRUD (Firestore)
- ✅ 다국어 지원 (한국어 + 영어)
- ✅ UI 스타일 가이드 (readme.txt)
- ✅ 글로벌 로딩/성공/에러 처리 (Toast + LoadingSpinner)
- ✅ 반응형 디자인 (Tailwind 브레이크포인트만 사용)

## 📄 라이선스

MIT License

## 🤝 기여

프로젝트에 기여하고 싶으시다면 Pull Request를 보내주세요!

## 📞 문의

문제가 발생하거나 질문이 있으시다면 Issue를 등록해주세요.

---

**Made with ❤️ by Dooribun Team**
