import { useState } from 'react';
import { useItinerary } from '../contexts/ItineraryContext';
import type { Place } from '../types';
import { mockPlaces, getRecommendedPlaces } from '../data/mockPlaces';
import PlaceCard from '../components/PlaceCard';
import PlacePopup from '../components/PlacePopup';
import { Search, Sparkles } from 'lucide-react';

const categories = [
  { value: 'all', label: '전체' },
  { value: 'attraction', label: '관광지' },
  { value: 'restaurant', label: '맛집' },
  { value: 'cafe', label: '카페' },
  { value: 'shopping', label: '쇼핑' },
  { value: 'hotel', label: '숙박' },
];

export default function ExplorePage() {
  const { addItem, state } = useItinerary();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);

  const recommendedPlaces = getRecommendedPlaces(6);

  const filteredPlaces = mockPlaces.filter((place) => {
    const matchesCategory =
      selectedCategory === 'all' || place.category === selectedCategory;
    const matchesSearch =
      searchQuery === '' ||
      place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      place.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddPlace = (place: Place) => {
    const newItem = {
      id: `item-${Date.now()}`,
      place,
      stayDurationMins: 60,
    };
    addItem(newItem);
    
    // Show toast notification (simplified)
    alert(`${place.name}이(가) 일정에 추가되었습니다!`);
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
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="장소 이름으로 검색"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base"
          />
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

      {/* Recommended Section */}
      {selectedCategory === 'all' && searchQuery === '' && (
        <div className="mb-12">
          <div className="flex items-center space-x-2 mb-6">
            <Sparkles className="h-5 w-5 text-primary-500" />
            <h2 className="text-xl font-semibold text-gray-900">추천 장소</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendedPlaces.map((place) => (
              <PlaceCard
                key={place.id}
                place={place}
                onAdd={handleAddPlace}
                onClick={setSelectedPlace}
              />
            ))}
          </div>
        </div>
      )}

      {/* All Places Grid */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          모든 장소 ({filteredPlaces.length})
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

      {/* Place Detail Popup */}
      {selectedPlace && (
        <PlacePopup
          place={selectedPlace}
          onClose={() => setSelectedPlace(null)}
          onNavigate={(place) => {
            alert(`길찾기: ${place.name}`);
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
