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
      explore: '탐색',
      planner: '플래너',
      myPlan: '내 일정',
      community: '커뮤니티',
      
      // Home page
      whenLeaving: '언제 떠나시나요?',
      createItinerary: '일정 만들기',
      recommendedHotels: '추천 숙소',
      recommendedAttractions: '추천 관광지',
      viewDetails: '자세히 보기',
      addToSchedule: '일정에 추가',
      selectAsHotel: '숙소로 선택',
      
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
    },
  },
  en: {
    translation: {
      // Navigation
      home: 'Home',
      explore: 'Explore',
      planner: 'Planner',
      myPlan: 'My Plan',
      community: 'Community',
      
      // Home page
      whenLeaving: 'When are you leaving?',
      createItinerary: 'Create Itinerary',
      recommendedHotels: 'Recommended Hotels',
      recommendedAttractions: 'Recommended Attractions',
      viewDetails: 'View Details',
      addToSchedule: 'Add to Schedule',
      selectAsHotel: 'Select as Hotel',
      
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
