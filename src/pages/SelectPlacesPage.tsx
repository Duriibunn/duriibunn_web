import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Check, MapPin, Star } from 'lucide-react';
import { 
  getPlacesByCity,
  CONTENT_TYPES,
  type TourPlace 
} from '../utils/publicDataApi';
import LoadingSpinner from '../components/LoadingSpinner';
import { mockPlaces } from '../data/mockPlaces';
import { mockHotels } from '../data/mockHotels';
import type { Place } from '../types';

// Convert TourPlace to Place
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
    phone: tourPlace.tel,
  };
}

const CATEGORIES = [
  { id: 'attraction', label: '관광지', emoji: '🏛️', type: CONTENT_TYPES.TOURIST_SPOT },
  { id: 'restaurant', label: '음식점', emoji: '🍴', type: CONTENT_TYPES.RESTAURANT },
  { id: 'culture', label: '문화시설', emoji: '🎭', type: CONTENT_TYPES.CULTURE },
  { id: 'hotel', label: '숙박', emoji: '🏨', type: CONTENT_TYPES.ACCOMMODATION },
];

// 여행 스타일에 맞는 키워드 매핑
const STYLE_KEYWORDS: Record<string, string[]> = {
  activity: ['체험', '액티비티', '레저', '스포츠', '모험', '놀이', '공원', '테마파크'],
  hotplace: ['인스타', '포토존', '카페', '핫플', '전망', '뷰', '맛집', '유명'],
  nature: ['자연', '산', '바다', '숲', '계곡', '폭포', '해변', '트레킹', '등산'],
  tourist: ['관광', '명소', '유명', '랜드마크', '박물관', '전시', '기념관'],
  healing: ['힐링', '휴식', '온천', '스파', '조용', '평화', '여유', '산책'],
  culture: ['문화', '예술', '역사', '전통', '한옥', '사찰', '유적', '갤러리', '공연'],
  local: ['로컬', '골목', '마을', '시장', '전통', '향토', '민속'],
  shopping: ['쇼핑', '백화점', '아울렛', '면세점', '거리', '상가', '몰'],
  food: ['맛집', '음식', '먹거리', '식당', '레스토랑', '카페', '디저트', '특산물'],
};

// 여행 스타일에 따른 추천 카테고리
const STYLE_TO_CATEGORY: Record<string, string[]> = {
  activity: ['attraction', 'culture'],
  hotplace: ['restaurant', 'attraction'],
  nature: ['attraction'],
  tourist: ['attraction', 'culture'],
  healing: ['hotel', 'attraction'],
  culture: ['culture', 'attraction'],
  local: ['restaurant', 'attraction'],
  shopping: ['attraction'],
  food: ['restaurant'],
};

// 장소가 여행 스타일에 맞는지 점수 계산
function calculateStyleScore(place: Place, travelStyles: string[]): number {
  if (!travelStyles || travelStyles.length === 0) return 0;
  
  let score = 0;
  const searchText = `${place.name} ${place.description || ''} ${place.address || ''}`.toLowerCase();
  
  travelStyles.forEach(style => {
    const keywords = STYLE_KEYWORDS[style] || [];
    keywords.forEach(keyword => {
      if (searchText.includes(keyword.toLowerCase())) {
        score += 1;
      }
    });
  });
  
  return score;
}

export default function SelectPlacesPage() {
  const navigate = useNavigate();
  const [tripData, setTripData] = useState<{
    city: string; 
    cityName: string; 
    startDate: string; 
    endDate: string; 
    days: number; 
    title: string;
    companion?: string;
    travelStyle?: string[];
  } | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('attraction');
  const [placesByCategory, setPlacesByCategory] = useState<Record<string, Place[]>>({
    attraction: [],
    restaurant: [],
    culture: [],
    hotel: [],
  });
  const [selectedPlaces, setSelectedPlaces] = useState<Place[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showStyleMatched, setShowStyleMatched] = useState(false); // 처음엔 전체 보기

  useEffect(() => {
    const data = sessionStorage.getItem('newTrip');
    if (!data) {
      navigate('/create-trip');
      return;
    }
    setTripData(JSON.parse(data));
  }, [navigate]);

  // 모든 카테고리 데이터를 한 번에 로드
  useEffect(() => {
    if (tripData) {
      loadAllCategories();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tripData]);

  const loadAllCategories = async () => {
    if (!tripData) return;
    
    setIsLoading(true);
    const newPlacesByCategory: Record<string, Place[]> = {
      attraction: [],
      restaurant: [],
      culture: [],
      hotel: [],
    };

    try {
      // 모든 카테고리를 병렬로 로드
      await Promise.all(
        CATEGORIES.map(async (category) => {
          try {
            console.log(`🔍 Loading ${category.label} for ${tripData.cityName}...`);
            
            // 100개씩 가져오기
            const tourPlaces = await getPlacesByCity(tripData.cityName, category.type, 100);
            console.log(`✅ ${category.label}: ${tourPlaces.length} places`);
            
            const convertedPlaces = tourPlaces.map(convertTourPlaceToPlace);
            
            // API 데이터가 있으면 사용, 없으면 Mock 데이터
            if (convertedPlaces.length > 0) {
              newPlacesByCategory[category.id] = convertedPlaces;
            } else {
              // Fallback to mock data
              if (category.id === 'attraction') {
                newPlacesByCategory[category.id] = mockPlaces.filter(p => p.category === 'attraction');
              } else if (category.id === 'restaurant') {
                newPlacesByCategory[category.id] = mockPlaces.filter(p => p.category === 'restaurant');
              } else if (category.id === 'hotel') {
                newPlacesByCategory[category.id] = mockHotels.map(h => ({
                  id: h.id,
                  name: h.name,
                  lat: h.lat,
                  lng: h.lng,
                  category: 'hotel' as const,
                  description: h.description,
                  address: h.address,
                  rating: h.rating,
                  photos: h.photos,
                }));
              } else {
                newPlacesByCategory[category.id] = mockPlaces;
              }
            }
          } catch (error) {
            console.error(`Failed to load ${category.label}:`, error);
            // 에러 시 Mock 데이터
            if (category.id === 'hotel') {
              newPlacesByCategory[category.id] = mockHotels.map(h => ({
                id: h.id,
                name: h.name,
                lat: h.lat,
                lng: h.lng,
                category: 'hotel' as const,
                description: h.description,
                address: h.address,
                rating: h.rating,
                photos: h.photos,
              }));
            } else {
              newPlacesByCategory[category.id] = mockPlaces.filter(p => p.category === category.id);
            }
          }
        })
      );

      setPlacesByCategory(newPlacesByCategory);
      console.log('🎉 All categories loaded!', {
        attraction: newPlacesByCategory.attraction.length,
        restaurant: newPlacesByCategory.restaurant.length,
        culture: newPlacesByCategory.culture.length,
        hotel: newPlacesByCategory.hotel.length,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 현재 선택된 카테고리의 장소들 (여행 스타일에 맞춰 정렬)
  const currentPlaces = (() => {
    const places = placesByCategory[selectedCategory] || [];
    const travelStyles = tripData?.travelStyle || [];
    
    // 여행 스타일이 없으면 원본 그대로 반환
    if (travelStyles.length === 0) return places;
    
    // 여행 스타일 점수 계산 및 정렬
    const placesWithScore = places.map(place => ({
      place,
      score: calculateStyleScore(place, travelStyles)
    }));
    
    // showStyleMatched가 true면 매칭되는 것만, false면 전체 (점수순 정렬)
    const filtered = showStyleMatched 
      ? placesWithScore.filter(item => item.score > 0)
      : placesWithScore;
    
    // 점수 높은 순으로 정렬
    return filtered
      .sort((a, b) => b.score - a.score)
      .map(item => item.place);
  })();

  const togglePlace = (place: Place) => {
    if (selectedPlaces.find(p => p.id === place.id)) {
      setSelectedPlaces(selectedPlaces.filter(p => p.id !== place.id));
    } else {
      setSelectedPlaces([...selectedPlaces, place]);
    }
  };

  const isSelected = (placeId: string) => {
    return selectedPlaces.some(p => p.id === placeId);
  };

  const handleNext = () => {
    if (selectedPlaces.length === 0) {
      alert('최소 1개 이상의 장소를 선택해주세요!');
      return;
    }

    sessionStorage.setItem('selectedPlaces', JSON.stringify(selectedPlaces));
    navigate('/create-trip/schedule');
  };

  if (!tripData) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-teal-600">2 / 3 단계</span>
            <span className="text-sm text-gray-500">장소 선택</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-teal-500 rounded-full transition-all" style={{ width: '66%' }}></div>
          </div>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {tripData.cityName}에서 방문할 장소를 선택하세요
          </h1>
          <p className="text-lg text-gray-600">
            {tripData.days}일 동안 {selectedPlaces.length}개 장소 선택됨
          </p>
        </div>

        {/* Travel Style Filter (여행 스타일이 있을 때만 표시) */}
        {tripData.travelStyle && tripData.travelStyle.length > 0 && (
          <div className="mb-6 p-4 bg-white rounded-xl border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-gray-900 mb-1">
                  ✨ 선택한 여행 스타일에 맞는 장소 추천
                </h3>
                <div className="flex flex-wrap gap-2">
                  {tripData.travelStyle.map(style => {
                    const styleNames: Record<string, string> = {
                      activity: '🎢 체험 액티비티',
                      hotplace: '📸 SNS 핫플레이스',
                      nature: '🏞️ 자연과 함께',
                      tourist: '🗺️ 유명 관광지는 필수',
                      healing: '🧘 여유롭게 힐링',
                      culture: '🎨 문화 예술 역사',
                      local: '🏘️ 여행지 느낌 물씬',
                      shopping: '🛍️ 쇼핑은 열정적으로',
                      food: '🍜 관광보다 먹방',
                    };
                    return (
                      <span
                        key={style}
                        className="px-3 py-1 bg-teal-50 text-teal-700 text-sm rounded-full"
                      >
                        {styleNames[style] || style}
                      </span>
                    );
                  })}
                </div>
              </div>
              <button
                onClick={() => setShowStyleMatched(!showStyleMatched)}
                className={`ml-4 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                  showStyleMatched
                    ? 'bg-teal-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {showStyleMatched ? '전체 장소 보기' : '맞춤 장소만 보기'}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {showStyleMatched 
                ? `총 ${currentPlaces.length}개의 추천 장소가 있습니다` 
                : `여행 스타일에 맞는 장소를 우선적으로 보여줍니다 (총 ${placesByCategory[selectedCategory]?.length || 0}개)`}
            </p>
          </div>
        )}

        {/* Category Tabs */}
        <div className="flex items-center space-x-2 mb-6 overflow-x-auto pb-2">
          {CATEGORIES.map((cat) => {
            const allPlaces = placesByCategory[cat.id] || [];
            const travelStyles = tripData?.travelStyle || [];
            
            // 현재 카테고리의 필터링된 장소 개수 계산
            let displayCount = allPlaces.length;
            if (cat.id === selectedCategory && travelStyles.length > 0) {
              // 현재 선택된 카테고리면 currentPlaces 사용
              displayCount = currentPlaces.length;
            } else if (travelStyles.length > 0 && showStyleMatched) {
              // 다른 카테고리지만 필터 활성화 시 매칭되는 장소만 카운트
              const placesWithScore = allPlaces.map(place => ({
                place,
                score: calculateStyleScore(place, travelStyles)
              }));
              displayCount = placesWithScore.filter(item => item.score > 0).length;
            }
            
            // 여행 스타일에 따른 추천 카테고리인지 확인
            const isRecommended = travelStyles.some(style => 
              STYLE_TO_CATEGORY[style]?.includes(cat.id)
            );
            
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`relative flex items-center space-x-2 px-5 py-3 rounded-xl font-medium whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-teal-500 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                {isRecommended && (
                  <span className="absolute -top-1 -right-1 text-xs">✨</span>
                )}
                <span className="text-xl">{cat.emoji}</span>
                <span>{cat.label}</span>
                {displayCount > 0 && (
                  <span className={`ml-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
                    selectedCategory === cat.id
                      ? 'bg-teal-600 text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {displayCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Places Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
            {currentPlaces.map((place) => {
              const selected = isSelected(place.id);
              return (
                <button
                  key={place.id}
                  onClick={() => togglePlace(place)}
                  className={`relative text-left p-4 rounded-2xl border-2 transition-all ${
                    selected
                      ? 'border-teal-500 bg-teal-50 shadow-lg'
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                  }`}
                >
                  {/* Image */}
                  {place.photos && place.photos[0] ? (
                    <div className="aspect-video w-full bg-gray-100 rounded-xl overflow-hidden mb-3">
                      <img
                        src={place.photos[0]}
                        alt={place.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="aspect-video w-full bg-linear-to-br from-teal-100 to-teal-50 rounded-xl flex items-center justify-center mb-3">
                      <MapPin className="w-8 h-8 text-teal-400" />
                    </div>
                  )}

                  {/* Check Badge */}
                  {selected && (
                    <div className="absolute top-6 right-6 w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center shadow-lg">
                      <Check className="w-5 h-5 text-white" />
                    </div>
                  )}

                  {/* Style Match Badge */}
                  {tripData?.travelStyle && tripData.travelStyle.length > 0 && (() => {
                    const score = calculateStyleScore(place, tripData.travelStyle);
                    if (score > 0) {
                      return (
                        <div className="absolute top-6 left-6 px-2 py-1 bg-teal-500 text-white text-xs font-bold rounded-full shadow-lg flex items-center space-x-1">
                          <span>✨</span>
                          <span>추천</span>
                        </div>
                      );
                    }
                    return null;
                  })()}

                  {/* Info */}
                  <h3 className="font-bold text-gray-900 mb-1 line-clamp-2">
                    {place.name}
                  </h3>
                  {place.address && (
                    <p className="text-xs text-gray-500 mb-2 line-clamp-1">
                      {place.address}
                    </p>
                  )}
                  {place.rating && (
                    <div className="flex items-center space-x-1 text-xs text-gray-600">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span>{place.rating}</span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {currentPlaces.length === 0 && !isLoading && (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
            <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              장소를 찾을 수 없습니다
            </h3>
            <p className="text-gray-600">다른 카테고리를 선택해보세요</p>
          </div>
        )}

        {/* Selected Places Summary (Sticky Bottom) */}
        {selectedPlaces.length > 0 && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg p-4 z-10">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">선택된 장소</p>
                <p className="text-lg font-bold text-gray-900">
                  {selectedPlaces.length}개
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => navigate('/create-trip')}
                  className="flex items-center space-x-2 px-6 py-3 text-gray-700 hover:bg-gray-100 rounded-xl transition-colors font-medium"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span>이전</span>
                </button>
                <button
                  onClick={handleNext}
                  className="flex items-center space-x-2 px-8 py-3 bg-teal-500 text-white rounded-xl hover:bg-teal-600 transition-colors font-medium shadow-lg"
                >
                  <span>다음</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
