# SmartRoute Planner - UI 스타일 가이드

## 프로젝트 개요
- 프레임워크: Vite + React 19 + TypeScript
- 스타일링: Tailwind CSS v4
- 반응형: Tailwind 브레이크포인트만 사용 (sm, md, lg, xl, 2xl)

## 컬러 팔레트

### Primary (Teal/민트 계열)
- primary-50: #f0fdfc (매우 연한 배경)
- primary-100: #ccfbf6 (연한 배경)
- primary-200: #99f6ec
- primary-300: #5eead4
- primary-400: #2dd4bf
- primary-500: #14b8a6 (주요 브랜드 컬러, 버튼/강조)
- primary-600: #0d9488 (호버 상태)
- primary-700: #0f766e
- primary-800: #115e59
- primary-900: #134e4a (진한 텍스트)

### Gray (텍스트 및 배경)
- gray-50: #f9fafb (페이지 배경)
- gray-100: #f3f4f6 (카드 배경)
- gray-200: #e5e7eb (테두리)
- gray-300: #d1d5db
- gray-400: #9ca3af
- gray-500: #6b7280 (보조 텍스트)
- gray-600: #4b5563
- gray-700: #374151 (부제목)
- gray-800: #1f2937
- gray-900: #111827 (주요 텍스트)

### 교통수단별 색상
- 도보(WALK): emerald-500 (#10b981)
- 대중교통(TRANSIT): indigo-500 (#6366f1)
- 차량(DRIVE): amber-500 (#f59e0b)

### 상태 색상
- 성공: green-500
- 오류: red-500
- 경고: yellow-500
- 정보: blue-500

## 타이포그래피

### 폰트 패밀리
- 기본: 시스템 폰트 스택 (Tailwind 기본값)
- 한글: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif

### 텍스트 크기 (Tailwind 클래스)
- text-xs: 12px (캡션, 보조 정보)
- text-sm: 14px (본문 보조)
- text-base: 16px (기본 본문)
- text-lg: 18px (부제목)
- text-xl: 20px (소제목)
- text-2xl: 24px (섹션 제목)
- text-3xl: 30px (페이지 제목)
- text-4xl: 36px (히어로 제목)
- text-5xl: 48px (대형 히어로)

### 폰트 두께
- font-normal: 400 (본문)
- font-medium: 500 (버튼, 강조 텍스트)
- font-semibold: 600 (제목)
- font-bold: 700 (강조 제목)

## 버튼 스타일

### Primary 버튼
```tsx
className="px-6 py-3 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors font-medium"
```
- 배경: primary-500
- 텍스트: white
- 패딩: px-6 py-3
- 모서리: rounded-xl (12px)
- 호버: bg-primary-600
- 전환: transition-colors

### Secondary 버튼
```tsx
className="px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
```
- 배경: white
- 테두리: border-gray-200
- 텍스트: gray-700
- 호버: bg-gray-50

### Icon 버튼
```tsx
className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
```
- 패딩: p-2
- 아이콘 크기: h-4 w-4 또는 h-5 w-5

## 입력 필드 스타일

### Text Input
```tsx
className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
```
- 배경: gray-50
- 테두리: gray-200
- 포커스 링: ring-2 ring-primary-500
- 모서리: rounded-xl

### Date Input
```tsx
className="bg-gray-50 px-3 py-2 rounded-lg text-gray-900 border border-gray-200"
```

## 카드 스타일

### 기본 카드
```tsx
className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
```
- 배경: white
- 모서리: rounded-xl
- 그림자: shadow-sm
- 패딩: p-6
- 호버: shadow-md

### 이미지 카드
```tsx
className="bg-white rounded-xl overflow-hidden shadow-sm"
```

## 간격 (Spacing)

### 일관된 간격 사용
- space-y-2: 8px (밀집)
- space-y-4: 16px (일반)
- space-y-6: 24px (여유)
- space-y-8: 32px (섹션 간)
- space-y-12: 48px (큰 섹션 간)

### 컨테이너 패딩
- 모바일: px-4
- 태블릿: sm:px-6
- 데스크톱: lg:px-8

## 반응형 브레이크포인트

### Tailwind 브레이크포인트만 사용
- sm: 640px (모바일 가로/소형 태블릿)
- md: 768px (태블릿)
- lg: 1024px (데스크톱)
- xl: 1280px (큰 데스크톱)
- 2xl: 1536px (초대형)

### 반응형 패턴 예시
```tsx
className="flex-col md:flex-row" // 모바일 세로, 태블릿 이상 가로
className="hidden lg:block" // 데스크톱에서만 표시
className="w-full lg:w-1/2" // 모바일 전체, 데스크톱 절반
```

## 애니메이션 및 전환

### 기본 전환
```tsx
className="transition-colors" // 색상 전환
className="transition-all" // 모든 속성 전환
className="transition-shadow" // 그림자 전환
```

### 호버 효과
- 버튼: hover:bg-primary-600
- 카드: hover:shadow-md
- 텍스트: hover:text-gray-900

## 로딩/성공/오류 UI

### 로딩 스피너
```tsx
<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500" />
```

### 오류 메시지
```tsx
<div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
  오류 메시지
</div>
```

### 성공 메시지
```tsx
<div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
  성공 메시지
</div>
```

## 지도 (Kakao Maps)

### 마커 색상
- 기본: primary-500
- 선택됨: primary-700

### 폴리라인
- 도보: strokeColor="#10b981", strokeWeight=4
- 대중교통: strokeColor="#6366f1", strokeWeight=4
- 차량: strokeColor="#f59e0b", strokeWeight=4

## 아이콘

### Lucide React 사용
- 크기: h-4 w-4 (소형), h-5 w-5 (중형), h-6 w-6 (대형)
- 색상: text-gray-500 (보조), text-primary-500 (강조)

## 일관성 규칙

1. **색상**: primary-500을 브랜드 컬러로 일관되게 사용
2. **모서리**: rounded-xl (12px)을 표준으로 사용
3. **그림자**: shadow-sm을 기본, 강조 시 shadow-md
4. **간격**: 4의 배수(4px 단위) 사용
5. **폰트**: font-medium을 버튼/강조, font-semibold를 제목에 사용
6. **반응형**: Tailwind 브레이크포인트만 사용, 커스텀 미디어쿼리 금지
7. **전환**: transition-colors를 기본 애니메이션으로 사용
8. **접근성**: 충분한 색상 대비(WCAG AA 준수), 포커스 상태 명확히 표시

## 금지 사항

- 인라인 스타일 사용 금지 (style={{...}})
- Tailwind 외 CSS 파일 추가 금지 (index.css의 base 레이어 제외)
- 커스텀 미디어 쿼리 사용 금지
- !important 사용 최소화
- 임의 값(arbitrary values) 남용 금지 (예: w-[123px])

## 다국어 처리

- UI 텍스트: i18next로 번역 키 사용 (예: t('home'), t('save'))
- 데이터베이스 저장 데이터: 번역하지 않음 (place.name, description 등)
- 언어 전환: TopBar의 LanguageSwitcher 컴포넌트 사용
