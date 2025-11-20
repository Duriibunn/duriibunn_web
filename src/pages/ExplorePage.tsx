import { useState, useEffect, useCallback } from 'react';
import { useItinerary } from '../contexts/ItineraryContext';
import type { Place } from '../types';
import PlaceCard from '../components/PlaceCard';
import PlacePopup from '../components/PlacePopup';
import LoadingSpinner from '../components/LoadingSpinner';
import { Search, AlertCircle } from 'lucide-react';
import { 
  getSeoulTouristSpots, 
  getSeoulCulturalFacilities,
  getSeoulAccommodations,
  searchKeyword,
  getDetailCommon,
  CONTENT_TYPES,
  type TourPlace,
  type TourPlaceDetail
} from '../utils/publicDataApi';
import { showToast } from '../components/Toast';

const categories = [
  { value: 'all', label: '전체' },
  { value: 'attraction', label: '관광지', contentType: CONTENT_TYPES.TOURIST_SPOT },
  { value: 'culture', label: '문화시설', contentType: CONTENT_TYPES.CULTURE },
  { value: 'hotel', label: '숙박', contentType: CONTENT_TYPES.ACCOMMODATION },
  { value: 'restaurant', label: '음식점', contentType: CONTENT_TYPES.RESTAURANT },
  { value: 'shopping', label: '쇼핑', contentType: CONTENT_TYPES.SHOPPING },
];

// Convert TourPlace to Place type
function convertTourPlaceToPlace(tourPlace: TourPlace): Place {
  return {
    id: tourPlace.contentid,
    name: tourPlace.title,
    address: tourPlace.addr1,
    lat: parseFloat(tourPlace.mapy) || 37.5665,
    lng: parseFloat(tourPlace.mapx) || 126.9780,
    category: 'attraction',
    description: tourPlace.addr1,
    photos: tourPlace.firstimage ? [tourPlace.firstimage] : undefined,
    rating: undefined,
    phone: tourPlace.tel,
  };
}

export default function ExplorePage() {
  const { addItem, state } = useItinerary();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [placeDetail, setPlaceDetail] = useState<TourPlaceDetail | null>(null);
  const [apiPlaces, setApiPlaces] = useState<Place[]>([]);
  const [isLoadingApi, setIsLoadingApi] = useState(false);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Load places from public data API when category changes
  useEffect(() => {
    const loadApiPlaces = async () => {
      setIsLoadingApi(true);
      setApiError(null);
      
      try {
        let tourPlaces: TourPlace[] = [];
        
        if (selectedCategory === 'attraction') {
          tourPlaces = await getSeoulTouristSpots(30);
        } else if (selectedCategory === 'culture') {
          tourPlaces = await getSeoulCulturalFacilities(30);
        } else if (selectedCategory === 'hotel') {
          tourPlaces = await getSeoulAccommodations(30);
        } else if (selectedCategory !== 'all') {
          // Search for other categories by keyword
          const selectedCat = categories.find(c => c.value === selectedCategory);
          if (selectedCat && selectedCat.contentType) {
            tourPlaces = await searchKeyword('서울', selectedCat.contentType, undefined, 30);
          }
        }

        const places = tourPlaces.map(convertTourPlaceToPlace);
        setApiPlaces(places);

        if (tourPlaces.length === 0 && selectedCategory !== 'all') {
          setApiError('해당 카테고리의 데이터를 불러올 수 없습니다.');
        }
      } catch (error) {
        console.error('Failed to load API places:', error);
        setApiError('데이터를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setIsLoadingApi(false);
      }
    };

    if (selectedCategory !== 'all') {
      loadApiPlaces();
    } else {
      setApiPlaces([]);
      setApiError(null);
    }
  }, [selectedCategory]);

  // Search with API when search query changes
  useEffect(() => {
    const searchApiPlaces = async () => {
      if (!searchQuery || searchQuery.length < 2) {
        return;
      }

      setIsLoadingApi(true);
      setApiError(null);

      try {
        const selectedCat = categories.find(c => c.value === selectedCategory);
        const contentType = selectedCat?.contentType;
        
        const tourPlaces = await searchKeyword(
          searchQuery, 
          contentType, 
          undefined, 
          50
        );

        const places = tourPlaces.map(convertTourPlaceToPlace);
        setApiPlaces(places);

        if (tourPlaces.length === 0) {
          setApiError(`"${searchQuery}"에 대한 검색 결과가 없습니다.`);
        }
      } catch (error) {
        console.error('Failed to search places:', error);
        setApiError('검색 중 오류가 발생했습니다.');
      } finally {
        setIsLoadingApi(false);
      }
    };

    const timeoutId = setTimeout(() => {
      searchApiPlaces();
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [searchQuery, selectedCategory]);

  // Load place detail when a place is selected
  useEffect(() => {
    const loadPlaceDetail = async () => {
      if (!selectedPlace) {
        setPlaceDetail(null);
        return;
      }

      setIsLoadingDetail(true);
      
      try {
        const detail = await getDetailCommon(selectedPlace.id);
        setPlaceDetail(detail);
      } catch (error) {
        console.error('Failed to load place detail:', error);
      } finally {
        setIsLoadingDetail(false);
      }
    };

    loadPlaceDetail();
  }, [selectedPlace]);

  // Filter API places
  const filteredPlaces = apiPlaces.filter((place: Place) => {
    const matchesSearch =
      searchQuery === '' ||
      place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      place.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      place.address?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const handleAddPlace = (place: Place) => {
    const newItem = {
      id: `item-${Date.now()}`,
      place,
      stayDurationMins: 60,
    };
    addItem(newItem);
    
    showToast(`${place.name}이(가) 일정에 추가되었습니다!`, 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          장소 탐색
        </h1>
        <p className="text-lg text-gray-600">방문하고 싶은 장소를 찾아 일정에 추가하세요</p>
      </div>

      {/* Search & Filters */}
      <div className="mb-8 space-y-4">
        {/* Search Bar */}
        <div className="relative h-12">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="장소 이름으로 검색 (2글자 이상)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-full pl-12 pr-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 w-5 h-5 flex items-center justify-center"
              aria-label="검색어 삭제"
            >
              ✕
            </button>
          )}
        </div>

        {/* Category Filters */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat.value
                  ? 'bg-primary-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {isLoadingApi && (
        <div className="flex flex-col items-center justify-center py-16">
          <LoadingSpinner size="lg" />
          <p className="text-gray-600 mt-4">공공데이터에서 장소 정보를 불러오는 중...</p>
        </div>
      )}

      {/* API Error State */}
      {apiError && !isLoadingApi && (
        <div className="flex flex-col items-center justify-center py-12 bg-amber-50 border border-amber-200 rounded-xl">
          <AlertCircle className="h-12 w-12 text-amber-500 mb-3" />
          <p className="text-amber-900 font-medium mb-1">{apiError}</p>
          <p className="text-amber-700 text-sm">기본 장소 목록을 표시합니다.</p>
        </div>
      )}

      {/* All Places Grid */}
      {!isLoadingApi && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            모든 장소 ({filteredPlaces.length})
            {apiPlaces.length > 0 && (
              <span className="ml-2 text-sm font-normal text-primary-600">
                ⚡ 공공데이터 {apiPlaces.length}개 포함
              </span>
            )}
          </h2>
          {filteredPlaces.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPlaces.map((place) => (
                <PlaceCard
                  key={place.id}
                  place={place}
                  onAdd={handleAddPlace}
                  onClick={setSelectedPlace}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">검색 결과가 없습니다.</p>
            </div>
          )}
        </div>
      )}

      {/* Place Detail Popup */}
      {selectedPlace && (
        <PlacePopup
          place={selectedPlace}
          placeDetail={placeDetail}
          isLoadingDetail={isLoadingDetail}
          onClose={() => {
            setSelectedPlace(null);
            setPlaceDetail(null);
          }}
          onNavigate={(place) => {
            window.open(
              `https://map.kakao.com/link/to/${place.name},${place.lat},${place.lng}`,
              '_blank'
            );
          }}
        />
      )}

      {/* Current Itinerary Summary (Sticky Bottom) */}
      {state.currentItinerary && state.currentItinerary.items.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg p-4 lg:hidden">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div>
              <p className="text-sm text-gray-600">현재 일정</p>
              <p className="font-semibold text-gray-900">
                {state.currentItinerary.items.length}개 장소
              </p>
            </div>
            <button
              onClick={() => window.location.href = '/planner'}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              일정 보기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
