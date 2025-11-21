// i18next configuration
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Translation resources
const resources = {
  ko: {
    translation: {
      // Navigation
      home: '홈',
      createTrip: '일정 생성',
      explore: '탐색',
      planner: '플래너',
      myPlan: '내 일정',
      community: '커뮤니티',
      
      // Home page
      welcomeUser: '님, 환영합니다!',
      smartRoutePlanner: '스마트 여행 루트 플래너',
      aiPoweredDescription: 'AI 기반 여행 경로 최적화로 완벽한 여행을 계획하세요',
      startPlanning: '여행 계획 시작하기',
      recommendedDestinations: '추천 여행지',
      selectHotel: '숙소 선택',
      addToItinerary: '일정에 추가',
      simpleSteps: '간단한 3단계',
      stepsDescription: '장소 선택 → 일정 구성 → 경로 확인',
      whenLeaving: '언제 떠나시나요?',
      createItinerary: '일정 만들기',
      recommendedHotels: '추천 숙소',
      recommendedAttractions: '추천 관광지',
      viewDetails: '자세히 보기',
      addToSchedule: '일정에 추가',
      selectAsHotel: '숙소로 선택',
      reviews: '리뷰',
      
      // Planner page
      routePlanning: '경로 계획',
      save: '저장',
      wholeRoute: '전체 길찾기',
      visitPlaces: '방문 장소',
      transportMode: '이동 수단',
      walk: '도보',
      transit: '대중교통',
      drive: '차량',
      optimize: '최적화',
      
      // Common
      loading: '로딩 중...',
      error: '오류가 발생했습니다',
      success: '성공',
      close: '닫기',
      confirm: '확인',
      cancel: '취소',
      
      // Place details
      openingHours: '운영시간',
      address: '주소',
      phone: '전화',
      rating: '평점',
      directions: '길찾기',
      
      // Auth - Login
      loginTitle: '로그인',
      loginSubtitle: '두리번에 오신 것을 환영합니다',
      username: '아이디',
      usernamePlaceholder: '아이디를 입력하세요',
      email: '이메일',
      emailPlaceholder: 'example@email.com',
      password: '비밀번호',
      passwordPlaceholder: '비밀번호를 입력하세요',
      rememberMe: '로그인 상태 유지',
      forgotPassword: '비밀번호를 잊으셨나요?',
      login: '로그인',
      logout: '로그아웃',
      loggingIn: '로그인 중...',
      or: '또는',
      noAccount: '계정이 없으신가요?',
      backToHome: '홈으로 돌아가기',
      
      // Auth - Sign Up
      signUpTitle: '회원가입',
      signUpSubtitle: '새로운 계정을 만들어보세요',
      signUp: '회원가입',
      name: '이름',
      namePlaceholder: '홍길동',
      confirmPassword: '비밀번호 확인',
      passwordStrength: '비밀번호 강도',
      weak: '약함',
      medium: '보통',
      strong: '강함',
      agreeToTerms: '약관에 동의합니다',
      termsOfService: '이용약관',
      and: '및',
      privacyPolicy: '개인정보처리방침',
      creatingAccount: '계정 생성 중...',
      alreadyHaveAccount: '이미 계정이 있으신가요?',
      
      // Auth - Errors
      invalidEmail: '유효하지 않은 이메일 주소입니다',
      invalidUsername: '유효하지 않은 아이디입니다',
      usernameTooShort: '아이디는 최소 3자 이상이어야 합니다',
      usernameInvalid: '아이디는 영문, 숫자, 밑줄(_)만 사용 가능합니다',
      usernameAlreadyInUse: '이미 사용 중인 아이디입니다',
      userDisabled: '비활성화된 계정입니다',
      userNotFound: '등록되지 않은 아이디입니다',
      wrongPassword: '비밀번호가 일치하지 않습니다',
      invalidCredential: '아이디 또는 비밀번호가 올바르지 않습니다',
      loginFailed: '로그인에 실패했습니다',
      emailAlreadyInUse: '이미 사용 중인 이메일입니다',
      operationNotAllowed: '이 작업은 허용되지 않습니다',
      weakPassword: '비밀번호가 너무 약합니다',
      signUpFailed: '회원가입에 실패했습니다',
      passwordTooShort: '비밀번호는 최소 6자 이상이어야 합니다',
      passwordsDoNotMatch: '비밀번호가 일치하지 않습니다',
      mustAgreeToTerms: '약관에 동의해야 합니다',
    },
  },
  en: {
    translation: {
      // Navigation
      home: 'Home',
      createTrip: 'Create Trip',
      explore: 'Explore',
      planner: 'Planner',
      myPlan: 'My Plan',
      community: 'Community',
      
      // Home page
      welcomeUser: ', Welcome!',
      smartRoutePlanner: 'Smart Travel Route Planner',
      aiPoweredDescription: 'Plan your perfect trip with AI-powered route optimization',
      startPlanning: 'Start Planning',
      recommendedDestinations: 'Recommended Destinations',
      selectHotel: 'Select Hotel',
      addToItinerary: 'Add to Itinerary',
      simpleSteps: '3 Simple Steps',
      stepsDescription: 'Select Places → Build Itinerary → Check Routes',
      whenLeaving: 'When are you leaving?',
      createItinerary: 'Create Itinerary',
      recommendedHotels: 'Recommended Hotels',
      recommendedAttractions: 'Recommended Attractions',
      viewDetails: 'View Details',
      addToSchedule: 'Add to Schedule',
      selectAsHotel: 'Select as Hotel',
      reviews: 'Reviews',
      
      // Planner page
      routePlanning: 'Route Planning',
      save: 'Save',
      wholeRoute: 'Full Route',
      visitPlaces: 'Visit Places',
      transportMode: 'Transport Mode',
      walk: 'Walk',
      transit: 'Transit',
      drive: 'Drive',
      optimize: 'Optimize',
      
      // Common
      loading: 'Loading...',
      error: 'An error occurred',
      success: 'Success',
      close: 'Close',
      confirm: 'Confirm',
      cancel: 'Cancel',
      
      // Place details
      openingHours: 'Opening Hours',
      address: 'Address',
      phone: 'Phone',
      rating: 'Rating',
      directions: 'Directions',
      
      // Auth - Login
      loginTitle: 'Login',
      loginSubtitle: 'Welcome to Duriibunn',
      username: 'Username',
      usernamePlaceholder: 'Enter your username',
      email: 'Email',
      emailPlaceholder: 'example@email.com',
      password: 'Password',
      passwordPlaceholder: 'Enter your password',
      rememberMe: 'Remember me',
      forgotPassword: 'Forgot password?',
      login: 'Login',
      logout: 'Logout',
      loggingIn: 'Logging in...',
      or: 'OR',
      noAccount: "Don't have an account?",
      backToHome: 'Back to Home',
      
      // Auth - Sign Up
      signUpTitle: 'Sign Up',
      signUpSubtitle: 'Create your new account',
      signUp: 'Sign Up',
      name: 'Name',
      namePlaceholder: 'John Doe',
      confirmPassword: 'Confirm Password',
      passwordStrength: 'Password Strength',
      weak: 'Weak',
      medium: 'Medium',
      strong: 'Strong',
      agreeToTerms: 'I agree to the',
      termsOfService: 'Terms of Service',
      and: 'and',
      privacyPolicy: 'Privacy Policy',
      creatingAccount: 'Creating account...',
      alreadyHaveAccount: 'Already have an account?',
      
      // Auth - Errors
      invalidEmail: 'Invalid email address',
      invalidUsername: 'Invalid username',
      usernameTooShort: 'Username must be at least 3 characters',
      usernameInvalid: 'Username can only contain letters, numbers, and underscores',
      usernameAlreadyInUse: 'Username is already taken',
      userDisabled: 'This account has been disabled',
      userNotFound: 'Username not registered',
      wrongPassword: 'Incorrect password',
      invalidCredential: 'Invalid username or password',
      loginFailed: 'Login failed',
      emailAlreadyInUse: 'Email is already in use',
      operationNotAllowed: 'This operation is not allowed',
      weakPassword: 'Password is too weak',
      signUpFailed: 'Sign up failed',
      passwordTooShort: 'Password must be at least 6 characters',
      passwordsDoNotMatch: 'Passwords do not match',
      mustAgreeToTerms: 'You must agree to the terms',
    },
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'ko',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
