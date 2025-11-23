import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search, MapPin, Plus, Check, ArrowLeft, ChevronRight } from 'lucide-react';
import { getAreaBasedList, searchKeyword, CONTENT_TYPES, type TourPlace } from '../utils/publicDataApi';
import LoadingSpinner from '../components/LoadingSpinner';
import { showToast } from '../hooks/toastManager';
import TripProgressStepper from '../components/TripProgressStepper';
import { auth } from '../firebase/config';
import { onAuthStateChanged } from 'firebase/auth';

interface LocationState {
  cityName: string;
  areaCode: number;
  startDate?: string;
  endDate?: string;
  days?: number;
}

export default function RecommendationsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState;
  const { cityName, areaCode, startDate, endDate, days } = state || { 
    cityName: '서울', 
    areaCode: 1,
    startDate: '',
    endDate: '',
    days: 3
  };

  const [recommendedPlaces, setRecommendedPlaces] = useState<TourPlace[]>([]);
  const [searchResults, setSearchResults] = useState<TourPlace[]>([]);
  const [selectedPlaces, setSelectedPlaces] = useState<TourPlace[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'recommended' | 'search'>('recommended');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  // Check authentication
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
      setIsAuthChecking(false);
      
      if (!user) {
        navigate('/login', { 
          state: { from: '/trip/recommendations', message: '여행 일정을 만들려면 먼저 로그인해주세요.' } 
        });
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  // Load recommended places on mount
  useEffect(() => {
    if (isAuthenticated) {
      loadRecommendedPlaces();
    }
  }, [areaCode, isAuthenticated]);

  const loadRecommendedPlaces = async () => {
    setIsLoading(true);
    try {
      console.log(`🌍 Loading places for area code: ${areaCode} (${cityName})`);
      
      // Rate Limit 방지: 순차적으로 요청 (딜레이 추가)
      // 관광지만 우선 로드 (가장 중요)
      const touristSpots = await getAreaBasedList(areaCode, undefined, CONTENT_TYPES.TOURIST_SPOT, 30);
      
      // 딜레이 추가 (500ms)
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 음식점 로드
      let restaurants: typeof touristSpots = [];
      try {
        restaurants = await getAreaBasedList(areaCode, undefined, CONTENT_TYPES.RESTAURANT, 15);
      } catch (error) {
        console.warn('음식점 데이터 로드 실패 (Rate Limit), 관광지만 표시합니다.', error);
      }
      
      // 딜레이 추가 (500ms)
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 숙박 로드
      let accommodations: typeof touristSpots = [];
      try {
        accommodations = await getAreaBasedList(areaCode, undefined, CONTENT_TYPES.ACCOMMODATION, 15);
      } catch (error) {
        console.warn('숙박 데이터 로드 실패 (Rate Limit), 관광지와 음식점만 표시합니다.', error);
      }
      
      // 모든 장소를 하나의 배열로 합치고, 지역 필터링 확인
      const allPlaces = [...touristSpots, ...restaurants, ...accommodations]
        .filter(place => {
          // areaCode가 일치하는지 확인 (공공데이터 포털 응답에 areacode 포함)
          const placeAreaCode = place.areacode ? parseInt(place.areacode) : null;
          return !placeAreaCode || placeAreaCode === areaCode;
        });
      
      console.log(`✅ Loaded ${allPlaces.length} places for ${cityName} (관광지: ${touristSpots.length}, 음식점: ${restaurants.length}, 숙박: ${accommodations.length})`);
      setRecommendedPlaces(allPlaces);
      
      if (allPlaces.length === 0) {
        showToast(`${cityName} 지역의 추천 장소를 불러올 수 없습니다. 검색 기능을 사용해주세요.`, 'info');
      } else {
        showToast(`${cityName} 지역 추천 장소 ${allPlaces.length}개를 불러왔습니다.`, 'success');
      }
    } catch (error) {
      console.error('Failed to load recommended places:', error);
      showToast('추천 장소를 불러오는데 실패했습니다. 검색을 이용해주세요.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery || searchQuery.length < 2) {
      showToast('2글자 이상 입력해주세요', 'info');
      return;
    }

    setIsSearching(true);
    setActiveTab('search');
    
    try {
      // 지역 코드를 필수로 전달하여 선택한 지역 내에서만 검색
      const results = await searchKeyword(
        searchQuery,
        undefined,
        areaCode,  // 선택한 지역에서만 검색
        30
      );
      
      // 추가로 지역 필터링 (API가 areaCode를 무시하는 경우 대비)
      const filteredResults = results.filter(place => {
        const placeAreaCode = place.areacode ? parseInt(place.areacode) : null;
        return !placeAreaCode || placeAreaCode === areaCode;
      });
      
      setSearchResults(filteredResults);
      
      if (filteredResults.length === 0) {
        showToast(`${cityName} 지역에서 "${searchQuery}" 검색 결과가 없습니다`, 'info');
      } else if (filteredResults.length < results.length) {
        showToast(`${cityName} 지역 내 검색 결과 ${filteredResults.length}개를 찾았습니다 (다른 지역 결과 제외됨)`, 'success');
      } else {
        showToast(`${cityName} 지역에서 ${filteredResults.length}개의 장소를 찾았습니다`, 'success');
      }
    } catch (error) {
      console.error('Search failed:', error);
      showToast('검색 중 오류가 발생했습니다', 'error');
    } finally {
      setIsSearching(false);
    }
  };

  const togglePlaceSelection = (place: TourPlace) => {
    setSelectedPlaces(prev => {
      const isSelected = prev.some(p => p.contentid === place.contentid);
      if (isSelected) {
        return prev.filter(p => p.contentid !== place.contentid);
      } else {
        return [...prev, place];
      }
    });
  };

  const isPlaceSelected = (place: TourPlace) => {
    return selectedPlaces.some(p => p.contentid === place.contentid);
  };

  const handleNext = () => {
    if (selectedPlaces.length === 0) {
      showToast('최소 1개 이상의 장소를 선택해주세요', 'info');
      return;
    }
    
    // TourPlace를 Place 형식으로 변환 (좌표 포함)
    const formattedPlaces = selectedPlaces.map(place => ({
      id: place.contentid,
      placeName: place.title,
      category: place.cat3 || place.cat2 || '관광지',
      image: place.firstimage || place.firstimage2,
      description: place.addr1,
      lat: place.mapy ? parseFloat(place.mapy) : undefined,
      lng: place.mapx ? parseFloat(place.mapx) : undefined,
      addr: place.addr1
    }));
    
    // 3단계 일정배치로 이동
    navigate('/create-trip/arrange', { 
      state: { 
        cityName,
        areaCode,
        startDate: startDate || '',
        endDate: endDate || '',
        days: days || 3,
        selectedPlaces: formattedPlaces
      } 
    });
  };

  const handleBack = () => {
    navigate('/create-trip');
  };

  const displayPlaces = activeTab === 'recommended' ? recommendedPlaces : searchResults;

  if (isAuthChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#52e3c2] mx-auto mb-4"></div>
          <p className="text-gray-600">로그인 상태 확인 중...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen pb-24 bg-gray-50">
      {/* Progress Stepper */}
      <div className="bg-white border-b">
        <div className="max-w-6xl px-4 py-6 mx-auto sm:px-6 lg:px-8">
          <TripProgressStepper currentStep={3} />
        </div>
      </div>

      {/* Header */}
      <div className="bg-white">
        <div className="max-w-6xl px-4 py-12 mx-auto sm:px-6 lg:px-8">
          {/* Back Button - Mobile */}
          <div className="mb-6 md:hidden">
            <button
              onClick={handleBack}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              이전 단계로
            </button>
          </div>

          <div className="mb-8 text-center">
            <div className="inline-flex items-center px-3 py-1 mb-3 text-sm font-medium border rounded-full bg-primary-50 text-primary-700 border-primary-200">
              <MapPin className="w-4 h-4 mr-1.5" />
              {cityName} 지역만 검색
            </div>
            <h1 className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl">
              {cityName}에서 어디에 가볼까요?
            </h1>
            <p className="mb-2 text-lg text-gray-600">
              {days}일 동안 즐길 수 있는 장소를 선택해주세요
            </p>
            {startDate && endDate && (
              <p className="text-sm text-primary-600">
                {new Date(startDate).toLocaleDateString('ko-KR')} ~ {new Date(endDate).toLocaleDateString('ko-KR')}
              </p>
            )}
          </div>

          {/* Search Bar */}
          <div className="flex space-x-2">
            <div className="relative flex-1">
              <Search className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
              <input
                type="text"
                placeholder={`${cityName}에서 장소 검색...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full py-3 pl-10 pr-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={isSearching}
              className="px-6 py-3 font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 disabled:bg-gray-400"
            >
              {isSearching ? '검색중...' : '검색'}
            </button>
          </div>

          {/* Tabs */}
          <div className="flex mt-4 space-x-1">
            <button
              onClick={() => setActiveTab('recommended')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                activeTab === 'recommended'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              추천 장소 ({recommendedPlaces.length})
            </button>
            <button
              onClick={() => setActiveTab('search')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                activeTab === 'search'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              검색 결과 ({searchResults.length})
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-gray-600">{cityName} 추천 장소를 불러오는 중...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {displayPlaces.map((place) => (
              <div
                key={place.contentid}
                className={`bg-white rounded-xl shadow-sm overflow-hidden transition-all ${
                  isPlaceSelected(place) ? 'ring-2 ring-blue-500' : 'hover:shadow-md'
                }`}
              >
                {/* Image */}
                <div className="relative h-48">
                  {place.firstimage ? (
                    <img
                      src={place.firstimage}
                      alt={place.title}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full bg-gray-200">
                      <MapPin className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                  
                  {/* Selection Checkmark */}
                  {isPlaceSelected(place) && (
                    <div className="absolute p-2 text-white bg-blue-600 rounded-full top-3 right-3">
                      <Check className="w-5 h-5" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  {/* Category Badge */}
                  <div className="mb-2">
                    <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded ${
                      place.contenttypeid === '12' ? 'bg-blue-100 text-blue-700' :
                      place.contenttypeid === '39' ? 'bg-orange-100 text-orange-700' :
                      place.contenttypeid === '32' ? 'bg-purple-100 text-purple-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {place.contenttypeid === '12' ? '관광지' :
                       place.contenttypeid === '39' ? '음식점' :
                       place.contenttypeid === '32' ? '숙박' :
                       place.cat3 || '기타'}
                    </span>
                  </div>
                  
                  <h3 className="mb-2 text-lg font-semibold text-gray-900 line-clamp-2">
                    {place.title}
                  </h3>
                  
                  <div className="flex items-center mb-3 text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span className="line-clamp-1">{place.addr1}</span>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => togglePlaceSelection(place)}
                    className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                      isPlaceSelected(place)
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {isPlaceSelected(place) ? (
                      <span className="flex items-center justify-center">
                        <Check className="w-4 h-4 mr-1" />
                        선택됨
                      </span>
                    ) : (
                      <span className="flex items-center justify-center">
                        <Plus className="w-4 h-4 mr-1" />
                        선택하기
                      </span>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && displayPlaces.length === 0 && (
          <div className="py-20 text-center">
            <MapPin className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-lg text-gray-500">
              {activeTab === 'search' ? '검색 결과가 없습니다' : '추천 장소가 없습니다'}
            </p>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white border-t shadow-lg">
        <div className="max-w-6xl mx-auto">
          <div className="flex gap-3">
            {/* Back Button */}
            <button
              onClick={handleBack}
              className="flex items-center justify-center px-6 py-4 font-semibold text-gray-700 transition-colors border-2 border-gray-300 rounded-xl hover:bg-gray-50"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              <span className="hidden md:inline">이전</span>
            </button>
            
            {/* Next Button */}
            <button
              onClick={handleNext}
              disabled={selectedPlaces.length === 0}
              className={`
                flex-1 flex items-center justify-center py-4 px-6 rounded-xl font-semibold text-lg transition-all
                ${selectedPlaces.length > 0
                  ? 'text-white shadow-lg hover:shadow-xl'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }
              `}
              style={selectedPlaces.length > 0 ? { backgroundColor: '#52e3c2' } : {}}
            >
              <span>
                {selectedPlaces.length > 0
                  ? `${selectedPlaces.length}개 장소로 일정 만들기`
                  : '장소를 선택해주세요'
                }
              </span>
              {selectedPlaces.length > 0 && (
                <ChevronRight className="w-5 h-5 ml-2" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
