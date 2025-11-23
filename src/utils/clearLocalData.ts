// 개발용: localStorage 데이터 초기화 유틸리티

export function clearAllLocalData() {
  // 여행 데이터 삭제
  localStorage.removeItem('myTrips');
  
  // 즐겨찾기 데이터 삭제
  localStorage.removeItem('favorites');
  localStorage.removeItem('favoritePlaces');
  
  // 기타 앱 관련 데이터 삭제
  localStorage.removeItem('currentTrip');
  localStorage.removeItem('selectedPlaces');
  
  console.log('✅ 모든 로컬 데이터가 삭제되었습니다.');
}

export function clearTripsData() {
  localStorage.removeItem('myTrips');
  console.log('✅ 여행 데이터가 삭제되었습니다.');
}

export function clearFavoritesData() {
  localStorage.removeItem('favorites');
  localStorage.removeItem('favoritePlaces');
  console.log('✅ 즐겨찾기 데이터가 삭제되었습니다.');
}

// 개발 모드에서만 window 객체에 함수 노출
if (import.meta.env.DEV) {
  (window as unknown as Record<string, () => void>).clearAllLocalData = clearAllLocalData;
  (window as unknown as Record<string, () => void>).clearTripsData = clearTripsData;
  (window as unknown as Record<string, () => void>).clearFavoritesData = clearFavoritesData;
  
  console.log(`
🔧 개발자 도구 사용 가능:
- clearAllLocalData() : 모든 로컬 데이터 삭제
- clearTripsData() : 여행 데이터만 삭제
- clearFavoritesData() : 즐겨찾기 데이터만 삭제
  `);
}
