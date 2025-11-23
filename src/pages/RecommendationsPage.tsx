import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search, MapPin, Check, ArrowLeft, ArrowRight, Filter, Heart } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { searchKeyword, type TourPlace } from '../utils/publicDataApi';
import LoadingSpinner from '../components/LoadingSpinner';

interface LocationState {
  cityName: string;
  areaCode: number;
  startDate: string;
  endDate: string;
  days: number;
  companion?: string;
  travelStyle?: string[];
}

export default function RecommendationsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState;
  const { t } = useTranslation();

  const [allPlaces, setAllPlaces] = useState<TourPlace[]>([]);
  const [displayPlaces, setDisplayPlaces] = useState<TourPlace[]>([]);
  const [selectedPlaces, setSelectedPlaces] = useState<TourPlace[]>([]);
  const [favoritePlaces, setFavoritePlaces] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'tourist' | 'restaurant' | 'accommodation'>('all');

  if (!state || !state.cityName || !state.areaCode) {
    navigate('/create-trip');
    return null;
  }

  const { cityName, areaCode, startDate, endDate, days, companion, travelStyle } = state;

  const loadFavorites = () => {
    const stored = localStorage.getItem('favoritePlaces');
    if (stored) {
      const parsed = JSON.parse(stored);
      setFavoritePlaces(parsed.map((f: { id: string }) => f.id));
    }
  };

  const filterPlaces = () => {
    if (activeFilter === 'all') {
      setDisplayPlaces(allPlaces);
    } else {
      setDisplayPlaces(allPlaces.filter(p => {
        const placeWithCategory = p as TourPlace & { category?: string };
        return placeWithCategory.category === activeFilter;
      }));
    }
  };

  useEffect(() => {
    loadPlaces();
    loadFavorites();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [areaCode]);

  useEffect(() => {
    filterPlaces();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allPlaces, activeFilter]);

  const toggleFavorite = (e: React.MouseEvent, place: TourPlace) => {
    e.stopPropagation();
    
    const stored = localStorage.getItem('favoritePlaces');
    const currentFavorites = stored ? JSON.parse(stored) : [];
    
    const isFav = currentFavorites.some((f: { id: string }) => f.id === place.contentid);
    
    if (isFav) {
      const updated = currentFavorites.filter((f: { id: string }) => f.id !== place.contentid);
      localStorage.setItem('favoritePlaces', JSON.stringify(updated));
      setFavoritePlaces(updated.map((f: { id: string }) => f.id));
    } else {
      const newFavorite = {
        id: place.contentid,
        name: place.title,
        category: place.contenttypeid === '12' ? t('filterTourist') :
                  place.contenttypeid === '39' ? t('restaurant') :
                  place.contenttypeid === '32' ? t('accommodation') : t('otherCategory'),
        image: place.firstimage,
        address: place.addr1,
        savedAt: Date.now()
      };
      const updated = [...currentFavorites, newFavorite];
      localStorage.setItem('favoritePlaces', JSON.stringify(updated));
      setFavoritePlaces(updated.map((f: { id: string }) => f.id));
    }
  };

  const isFavorite = (placeId: string) => {
    return favoritePlaces.includes(placeId);
  };

  const loadPlaces = async () => {
    setIsLoading(true);
    try {
      // 목 데이터를 즉시 사용 (API 호출 없음)
      const mockData: TourPlace[] = getMockPlacesForArea(cityName);
      const combined = mockData.map(p => ({ ...p, category: 'tourist' }));
      setAllPlaces(combined);
      setDisplayPlaces(combined);
      setActiveFilter('tourist');
    } catch (error) {
      console.error('Failed to load places:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 지역별 목 데이터
  const getMockPlacesForArea = (city: string): TourPlace[] => {
    const cityData: { [key: string]: Array<{ name: string; addr: string; img: string }> } = {
      '제주': [
        { name: '성산일출봉', addr: '제주특별자치도 서귀포시 성산읍', img: 'https://images.unsplash.com/photo-1578987264226-9c6f6d5e5b28?w=800' },
        { name: '한라산 국립공원', addr: '제주특별자치도 제주시', img: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800' },
        { name: '우도', addr: '제주특별자치도 제주시 우도면', img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800' },
        { name: '협재해수욕장', addr: '제주특별자치도 제주시 한림읍', img: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800' },
        { name: '섭지코지', addr: '제주특별자치도 서귀포시 성산읍', img: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=800' },
        { name: '천지연폭포', addr: '제주특별자치도 서귀포시', img: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800' },
        { name: '주상절리대', addr: '제주특별자치도 서귀포시 중문동', img: 'https://images.unsplash.com/photo-1542640244-7e672d6cef4e?w=800' },
        { name: '만장굴', addr: '제주특별자치도 제주시 구좌읍', img: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800' }
      ],
      '서울': [
        { name: '경복궁', addr: '서울특별시 종로구', img: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800' },
        { name: 'N서울타워', addr: '서울특별시 용산구', img: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800' },
        { name: '북촌 한옥마을', addr: '서울특별시 종로구', img: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800' },
        { name: '명동 거리', addr: '서울특별시 중구', img: 'https://images.unsplash.com/photo-1555217851-6141535bd771?w=800' },
        { name: '한강공원', addr: '서울특별시 영등포구', img: 'https://images.unsplash.com/photo-1524850011238-e3d235c7d4c9?w=800' },
        { name: '동대문 디자인 플라자', addr: '서울특별시 중구', img: 'https://images.unsplash.com/photo-1538485399081-7191377e8241?w=800' },
        { name: '창덕궁', addr: '서울특별시 종로구', img: 'https://images.unsplash.com/photo-1534329539061-64caeb388c42?w=800' },
        { name: '홍대 거리', addr: '서울특별시 마포구', img: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800' }
      ],
      '부산': [
        { name: '해운대해수욕장', addr: '부산광역시 해운대구', img: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800' },
        { name: '광안리해수욕장', addr: '부산광역시 수영구', img: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800' },
        { name: '감천문화마을', addr: '부산광역시 사하구', img: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800' },
        { name: '태종대', addr: '부산광역시 영도구', img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800' },
        { name: '자갈치시장', addr: '부산광역시 중구', img: 'https://images.unsplash.com/photo-1555217851-6141535bd771?w=800' },
        { name: '용두산공원', addr: '부산광역시 중구', img: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800' },
        { name: '해동 용궁사', addr: '부산광역시 기장군', img: 'https://images.unsplash.com/photo-1542640244-7e672d6cef4e?w=800' },
        { name: 'BIFF 광장', addr: '부산광역시 중구', img: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800' }
      ],
      '강릉': [
        { name: '경포해변', addr: '강원특별자치도 강릉시', img: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800' },
        { name: '강릉 커피거리', addr: '강원특별자치도 강릉시 안목동', img: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800' },
        { name: '오죽헌', addr: '강원특별자치도 강릉시', img: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800' },
        { name: '정동진', addr: '강원특별자치도 강릉시 강동면', img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800' },
        { name: '주문진항', addr: '강원특별자치도 강릉시 주문진읍', img: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800' },
        { name: '선교장', addr: '강원특별자치도 강릉시', img: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800' }
      ],
      '여수': [
        { name: '오동도', addr: '전라남도 여수시', img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800' },
        { name: '여수 해상케이블카', addr: '전라남도 여수시', img: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800' },
        { name: '향일암', addr: '전라남도 여수시 돌산읍', img: 'https://images.unsplash.com/photo-1542640244-7e672d6cef4e?w=800' },
        { name: '여수 밤바다', addr: '전라남도 여수시', img: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800' },
        { name: '만성리해수욕장', addr: '전라남도 여수시 만흥동', img: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800' },
        { name: '여수엑스포', addr: '전라남도 여수시', img: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800' }
      ],
      '경주': [
        { name: '불국사', addr: '경상북도 경주시', img: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800' },
        { name: '석굴암', addr: '경상북도 경주시', img: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800' },
        { name: '첨성대', addr: '경상북도 경주시', img: 'https://images.unsplash.com/photo-1534329539061-64caeb388c42?w=800' },
        { name: '동궁과 월지', addr: '경상북도 경주시', img: 'https://images.unsplash.com/photo-1542640244-7e672d6cef4e?w=800' },
        { name: '대릉원', addr: '경상북도 경주시', img: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800' },
        { name: '황리단길', addr: '경상북도 경주시', img: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800' },
        { name: '보문단지', addr: '경상북도 경주시', img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800' }
      ],
      '전주': [
        { name: '전주 한옥마을', addr: '전라북도 전주시 완산구', img: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800' },
        { name: '경기전', addr: '전라북도 전주시 완산구', img: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800' },
        { name: '오목대', addr: '전라북도 전주시 완산구', img: 'https://images.unsplash.com/photo-1534329539061-64caeb388c42?w=800' },
        { name: '자만벽화마을', addr: '전라북도 전주시 완산구', img: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800' },
        { name: '덕진공원', addr: '전라북도 전주시 덕진구', img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800' },
        { name: '남부시장', addr: '전라북도 전주시 완산구', img: 'https://images.unsplash.com/photo-1555217851-6141535bd771?w=800' }
      ],
      '인천': [
        { name: '인천 차이나타운', addr: '인천광역시 중구', img: 'https://images.unsplash.com/photo-1555217851-6141535bd771?w=800' },
        { name: '월미도', addr: '인천광역시 중구', img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800' },
        { name: '송도 센트럴파크', addr: '인천광역시 연수구', img: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800' },
        { name: '을왕리 해수욕장', addr: '인천광역시 중구', img: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800' },
        { name: '인천대공원', addr: '인천광역시 남동구', img: 'https://images.unsplash.com/photo-1524850011238-e3d235c7d4c9?w=800' },
        { name: '영종도 씨사이드파크', addr: '인천광역시 중구', img: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800' }
      ]
    };

    const data = cityData[city] || [];
    
    return data.map((place, index) => ({
      contentid: `mock-${city}-${index + 1}`,
      title: place.name,
      addr1: place.addr,
      firstimage: place.img,
      contenttypeid: '12',
      mapx: '126.9780',
      mapy: '37.5665'
    })) as TourPlace[];
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    try {
      const results = await searchKeyword(searchQuery, undefined, areaCode, 30);
      setDisplayPlaces(results);
      setActiveFilter('all');
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePlace = (place: TourPlace) => {
    const isSelected = selectedPlaces.some(p => p.contentid === place.contentid);
    if (isSelected) {
      setSelectedPlaces(prev => prev.filter(p => p.contentid !== place.contentid));
    } else {
      setSelectedPlaces(prev => [...prev, place]);
    }
  };

  const isSelected = (place: TourPlace) => {
    return selectedPlaces.some(p => p.contentid === place.contentid);
  };

  const handleNext = () => {
    if (selectedPlaces.length === 0) {
      alert(t('selectAtLeastOne'));
      return;
    }

    navigate('/create-trip/arrange', {
      state: {
        cityName,
        areaCode,
        startDate,
        endDate,
        days,
        companion,
        travelStyle,
        selectedPlaces: selectedPlaces.map(p => ({
          id: p.contentid,
          name: p.title,
          category: p.cat3 || '관광지',
          image: p.firstimage,
          address: p.addr1,
          lat: parseFloat(p.mapy),
          lng: parseFloat(p.mapx),
        })),
      }
    });
  };

  return (
    <div className="min-h-screen pb-24 bg-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200">
        <div className="max-w-6xl px-4 py-6 mx-auto sm:px-6 lg:px-8">
          <button
            onClick={() => navigate('/create-trip')}
            className="flex items-center mb-4 text-gray-900 hover:text-gray-700"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            {t('previous')}
          </button>
          <div className="mb-4">
            <span className="px-3 py-1 text-sm font-bold text-gray-900 bg-white rounded-full">
              {t('step2Of3')}
            </span>
          </div>
          <h1 className="mb-2 text-3xl font-bold text-gray-900">
            {cityName}{t('whereToGo')}
          </h1>
          <p className="text-gray-800">
            {days}{t('selectPlacesDuring')}
          </p>
          <div className="flex items-center gap-2 mt-2 text-sm font-medium text-gray-900">
            <Calendar className="w-4 h-4" />
            {startDate} ~ {endDate}
          </div>
        </div>
      </div>

      <div className="max-w-6xl px-4 py-8 mx-auto sm:px-6 lg:px-8">
        {/* Search & Filter */}
        <div className="mb-6">
          <div className="flex gap-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder={t('searchByPlaceName')}
                className="w-full py-3 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={handleSearch}
              className="px-6 py-3 font-medium text-white rounded-lg bg-primary-600 hover:bg-primary-700"
            >
              {t('searchButton')}
            </button>
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 overflow-x-auto">
            {[
              { id: 'all', label: t('filterAll'), icon: Filter },
              { id: 'tourist', label: t('filterTourist'), icon: MapPin },
              { id: 'restaurant', label: t('restaurant'), icon: '🍜' },
              { id: 'accommodation', label: t('accommodation'), icon: '🏨' },
            ].map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id as 'all' | 'tourist' | 'restaurant' | 'accommodation')}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  activeFilter === filter.id
                    ? 'bg-primary-600 text-gray-900'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {typeof filter.icon === 'string' ? filter.icon : <filter.icon className="inline w-4 h-4 mr-1" />}
                {' '}{filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Count */}
        {selectedPlaces.length > 0 && (
          <div className="p-4 mb-6 rounded-lg bg-primary-50">
            <p className="font-medium text-primary-700">
              {selectedPlaces.length}{t('placesSelected')}
            </p>
          </div>
        )}

        {/* Places Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <LoadingSpinner size="lg" />
          </div>
        ) : displayPlaces.length === 0 ? (
          <div className="py-20 text-center">
            <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 rounded-full bg-primary-100">
              <MapPin className="w-10 h-10 text-primary-600" />
            </div>
            <h3 className="mb-2 text-2xl font-bold text-gray-900">
              {t('searchForPlaces')}
            </h3>
            <p className="mb-6 text-gray-600">
              {t('searchForPlacesDesc')}
            </p>
            <div className="max-w-md p-4 mx-auto rounded-lg bg-primary-50">
              <p className="text-sm text-primary-700">
                {t('searchExample')}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {displayPlaces.map((place) => {
              const selected = isSelected(place);
              return (
                <div
                  key={place.contentid}
                  onClick={() => togglePlace(place)}
                  className={`bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer transition-all ${
                    selected ? 'ring-2 ring-primary-500' : 'hover:shadow-md'
                  }`}
                >
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
                    {selected && (
                      <div className="absolute flex items-center justify-center w-8 h-8 text-white rounded-full top-3 right-3 bg-primary-600">
                        <Check className="w-5 h-5" />
                      </div>
                    )}
                    <button
                      onClick={(e) => toggleFavorite(e, place)}
                      className="absolute flex items-center justify-center w-10 h-10 transition-all bg-white rounded-full shadow-md top-3 left-3 hover:scale-110"
                    >
                      <Heart 
                        className={`w-5 h-5 ${isFavorite(place.contentid) ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
                      />
                    </button>
                  </div>
                  <div className="p-4">
                    <div className="mb-2">
                      <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded ${
                        place.contenttypeid === '12' ? 'bg-blue-100 text-blue-700' :
                        place.contenttypeid === '39' ? 'bg-orange-100 text-orange-700' :
                        place.contenttypeid === '32' ? 'bg-purple-100 text-purple-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {place.contenttypeid === '12' ? t('filterTourist') :
                         place.contenttypeid === '39' ? t('restaurant') :
                         place.contenttypeid === '32' ? t('accommodation') : t('otherCategory')}
                      </span>
                    </div>
                    <h3 className="mb-2 text-lg font-semibold text-gray-900 line-clamp-2">
                      {place.title}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-1">
                      <MapPin className="inline w-4 h-4 mr-1" />
                      {place.addr1}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Fixed Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t shadow-lg">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={handleNext}
            disabled={selectedPlaces.length === 0}
            className="flex items-center justify-center w-full gap-2 px-6 py-4 font-semibold text-gray-900 transition-colors rounded-xl bg-primary-400 hover:bg-primary-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {t('nextArrangePlaces')}
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

function Calendar({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
}
