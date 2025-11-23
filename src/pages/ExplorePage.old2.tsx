import { useState, useEffect } from 'react';
import { Search, Filter, MapPin, TrendingUp } from 'lucide-react';
import { getAreaBasedList, searchKeyword, AREA_CODES, CONTENT_TYPES, type TourPlace } from '../utils/publicDataApi';

const CATEGORIES: Array<{ id: number | 'all'; label: string; icon: string }> = [
  { id: 'all', label: '전체', icon: '🌟' },
  { id: CONTENT_TYPES.TOURIST_SPOT, label: '관광지', icon: '🏛️' },
  { id: CONTENT_TYPES.RESTAURANT, label: '맛집', icon: '🍴' },
  { id: CONTENT_TYPES.ACCOMMODATION, label: '숙박', icon: '🏨' },
  { id: CONTENT_TYPES.CULTURE, label: '문화시설', icon: '🎭' },
  { id: CONTENT_TYPES.FESTIVAL, label: '축제', icon: '🎉' },
];

const POPULAR_CITIES = [
  { name: '서울', code: AREA_CODES['서울'], emoji: '🏙️' },
  { name: '부산', code: AREA_CODES['부산'], emoji: '🌊' },
  { name: '제주', code: AREA_CODES['제주'], emoji: '🏝️' },
  { name: '강릉', code: AREA_CODES['강릉'], emoji: '⛰️' },
  { name: '여수', code: AREA_CODES['여수'], emoji: '🌅' },
  { name: '경주', code: AREA_CODES['경주'], emoji: '🏯' },
];

export default function ExplorePage() {
  const [places, setPlaces] = useState<TourPlace[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | 'all'>('all');
  const [selectedCity, setSelectedCity] = useState(AREA_CODES['서울']);
  const [hasLoaded, setHasLoaded] = useState(false);

  // 초기 로딩은 하지 않고, 사용자가 도시/카테고리를 선택할 때만 로드
  useEffect(() => {
    if (hasLoaded) {
      loadPlaces();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCity, selectedCategory]);

  const loadPlaces = async () => {
    setLoading(true);
    setHasLoaded(true);
    try {
      const contentType = selectedCategory === 'all' ? undefined : selectedCategory;
      const result = await getAreaBasedList(selectedCity, undefined, contentType, 30);
      setPlaces(result);
    } catch (error) {
      console.error('Failed to load places:', error);
      setPlaces([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      loadPlaces();
      return;
    }

    setLoading(true);
    try {
      const contentType = selectedCategory === 'all' ? undefined : selectedCategory;
      const result = await searchKeyword(searchQuery, contentType, selectedCity);
      setPlaces(result);
    } catch (error) {
      console.error('Search failed:', error);
      setPlaces([]);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryBadgeColor = (typeId: string) => {
    switch (typeId) {
      case '12': return 'bg-blue-100 text-blue-700';
      case '14': return 'bg-purple-100 text-purple-700';
      case '15': return 'bg-pink-100 text-pink-700';
      case '32': return 'bg-indigo-100 text-indigo-700';
      case '39': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getCategoryLabel = (typeId: string) => {
    switch (typeId) {
      case '12': return '관광지';
      case '14': return '문화시설';
      case '15': return '축제';
      case '25': return '여행코스';
      case '28': return '레포츠';
      case '32': return '숙박';
      case '38': return '쇼핑';
      case '39': return '음식점';
      default: return '기타';
    }
  };

  return (
    <div className="min-h-screen pb-20 bg-gray-50">
      {/* Header */}
      <div className="bg-linear-to-r from-primary-500 to-primary-600">
        <div className="max-w-6xl px-4 py-12 mx-auto sm:px-6 lg:px-8">
          <h1 className="mb-3 text-4xl font-bold text-gray-900">
            즐겨찾기
          </h1>
          <p className="mb-6 text-lg text-gray-800">
            마음에 드는 여행지를 저장하고 관리하세요
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="장소, 지역, 키워드로 검색..."
              className="w-full px-6 py-4 pr-12 text-lg border-0 rounded-xl focus:ring-2 focus:ring-white"
            />
            <button
              type="submit"
              className="absolute p-3 transition-colors rounded-lg right-2 top-2 text-primary-600 hover:bg-primary-50"
            >
              <Search className="w-6 h-6" />
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-6xl px-4 py-8 mx-auto sm:px-6 lg:px-8">
        {/* City Filter */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-bold text-gray-900">지역 선택</h2>
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {POPULAR_CITIES.map((city) => (
              <button
                key={city.code}
                onClick={() => setSelectedCity(city.code)}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  selectedCity === city.code
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                <span className="mr-1">{city.emoji}</span>
                {city.name}
              </button>
            ))}
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Filter className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-bold text-gray-900">카테고리</h2>
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {CATEGORIES.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                <span className="mr-1">{category.icon}</span>
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 border-4 rounded-full border-primary-600 border-t-transparent animate-spin" />
              <p className="text-gray-600">장소를 찾고 있습니다...</p>
            </div>
          </div>
        ) : places.length === 0 && !hasLoaded ? (
          <div className="py-20 text-center">
            <div className="mb-4 text-6xl">�️</div>
            <p className="mb-2 text-xl font-semibold text-gray-900">
              여행지를 탐색해보세요
            </p>
            <p className="mb-6 text-gray-600">
              위에서 지역과 카테고리를 선택하거나 검색어를 입력하세요
            </p>
            <button
              onClick={loadPlaces}
              className="px-6 py-3 font-semibold text-white transition-colors rounded-lg bg-primary-600 hover:bg-primary-700"
            >
              {selectedCategory === 'all' ? '전체' : CATEGORIES.find(c => c.id === selectedCategory)?.label} 장소 보기
            </button>
          </div>
        ) : places.length === 0 ? (
          <div className="py-20 text-center">
            <div className="mb-4 text-6xl">�🔍</div>
            <p className="mb-2 text-xl font-semibold text-gray-900">
              검색 결과가 없습니다
            </p>
            <p className="text-gray-600">
              다른 키워드나 지역을 선택해보세요
            </p>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                검색 결과 <span className="text-primary-600">{places.length}</span>개
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {places.map((place) => (
                <div
                  key={place.contentid}
                  className="overflow-hidden transition-shadow bg-white border border-gray-200 cursor-pointer rounded-xl hover:shadow-lg"
                >
                  {place.firstimage ? (
                    <img
                      src={place.firstimage}
                      alt={place.title}
                      className="object-cover w-full h-48"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-48 bg-gray-100">
                      <MapPin className="w-12 h-12 text-gray-300" />
                    </div>
                  )}
                  <div className="p-4">
                    <div className="mb-2">
                      <span className={`inline-block px-2 py-1 text-xs font-medium rounded ${getCategoryBadgeColor(place.contenttypeid)}`}>
                        {getCategoryLabel(place.contenttypeid)}
                      </span>
                    </div>
                    <h3 className="mb-2 text-lg font-bold text-gray-900 line-clamp-2">
                      {place.title}
                    </h3>
                    <p className="mb-3 text-sm text-gray-600 line-clamp-2">
                      {place.addr1}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span>{place.areacode === '1' ? '서울' : place.areacode === '6' ? '부산' : place.areacode === '39' ? '제주' : '기타'}</span>
                      </div>
                      {place.tel && (
                        <button className="text-sm font-medium text-primary-600 hover:text-primary-700">
                          연락처 보기
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Floating Action Hint */}
      {places.length > 0 && (
        <div className="fixed bottom-24 right-4">
          <div className="px-4 py-3 text-sm font-medium text-white rounded-lg shadow-lg bg-primary-600">
            <TrendingUp className="inline w-4 h-4 mr-1" />
            {places.length}개의 장소를 발견했어요!
          </div>
        </div>
      )}
    </div>
  );
}
