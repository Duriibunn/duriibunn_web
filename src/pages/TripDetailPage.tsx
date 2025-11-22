import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useItinerary } from '../contexts/ItineraryContext';
import type { ItineraryItem } from '../types';
import MapPanel from '../components/MapPanel';
import { 
  ChevronDown, 
  Star, 
  Clock, 
  MapPin, 
  Share2, 
  Edit3,
  Navigation,
  Heart
} from 'lucide-react';
import { openDirections } from '../utils/navLinks';

// 장소별 컬러 팔레트 (Triple 스타일)
const PLACE_COLORS = [
  '#FF6B9D', // 핑크
  '#9B59B6', // 보라
  '#3498DB', // 파랑
  '#F39C12', // 주황
  '#1ABC9C', // 청록
  '#E74C3C', // 빨강
  '#95A5A6', // 회색
  '#16A085', // 에메랄드
];

export default function TripDetailPage() {
  const { t } = useTranslation();
  useParams<{ id: string }>(); // For future use
  const navigate = useNavigate();
  const { state } = useItinerary();
  const [selectedDay, setSelectedDay] = useState('day1');
  const [selectedPlace, setSelectedPlace] = useState<ItineraryItem | null>(null);
  const [showDayDropdown, setShowDayDropdown] = useState(false);

  const currentItinerary = state.currentItinerary;
  const items = currentItinerary?.items || [];
  const transportMode = currentItinerary?.transportMode || 'WALK';

  // 선택된 장소 초기화
  useEffect(() => {
    if (items.length > 0 && !selectedPlace) {
      setSelectedPlace(items[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.length]);

  const getCategoryLabel = (category?: string) => {
    const categoryMap: Record<string, string> = {
      attraction: t('attraction'),
      restaurant: t('restaurant'),
      cafe: 'cafe',
      hotel: t('accommodation'),
      shopping: t('shopping'),
      culture: t('culture'),
    };
    return categoryMap[category || ''] || t('place');
  };

  const getCategoryIcon = (category?: string) => {
    switch (category) {
      case 'restaurant':
        return '🍴';
      case 'cafe':
        return '☕';
      case 'hotel':
        return '🏨';
      case 'shopping':
        return '🛍️';
      case 'culture':
        return '🎭';
      case 'attraction':
      default:
        return '📍';
    }
  };

  const getPlaceColor = (index: number) => {
    return PLACE_COLORS[index % PLACE_COLORS.length];
  };

  const formatDuration = (mins?: number) => {
    if (!mins) return t('60minutes');
    const hours = Math.floor(mins / 60);
    const minutes = mins % 60;
    if (hours > 0) {
      return minutes > 0 ? `${hours}${t('hours')} ${minutes}${t('minutes')}` : `${hours}${t('hours')}`;
    }
    return `${minutes}${t('minutes')}`;
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: currentItinerary?.title || t('myTravelPlan'),
        text: `${items.length}${t('placesGreatTrip')}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert(t('linkCopied'));
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <header className="z-20 bg-white border-b border-gray-100">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => navigate('/')}
              className="text-gray-600 hover:text-gray-900"
            >
              ←
            </button>
            <div className="flex items-center space-x-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-linear-to-br from-blue-500 to-primary-500">
                <span className="text-sm font-bold text-white">두</span>
              </div>
              <span className="text-xl font-bold text-gray-900">두리번</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => navigate('/planner')}
              className="p-2 transition-colors rounded-lg hover:bg-gray-100"
              title="편집하기"
            >
              <Edit3 className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={handleShare}
              className="p-2 transition-colors rounded-lg hover:bg-gray-100"
              title="공유하기"
            >
              <Share2 className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
        
        {/* Trip Title */}
        <div className="px-6 pt-2 pb-5">
          <h1 className="mb-1 text-2xl font-bold text-gray-900">
            {currentItinerary?.title || t('myTravelPlan')}
          </h1>
          <p className="text-sm text-gray-500">
            {currentItinerary?.date || '2024년 11월 14일'} · {items.length}{t('placesCount')}
          </p>
        </div>
      </header>

      {/* Main Content: Left Panel + Right Map */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - Place List */}
        <div className="w-full lg:w-[400px] xl:w-[440px] border-r border-gray-100 overflow-y-auto bg-white">
          {/* Day Selector */}
          <div className="sticky top-0 z-10 px-6 py-4 bg-white border-b border-gray-100">
            <div className="relative">
              <button
                onClick={() => setShowDayDropdown(!showDayDropdown)}
                className="flex items-center justify-between w-full px-4 py-3 transition-colors bg-gray-50 hover:bg-gray-100 rounded-xl"
              >
                <span className="font-semibold text-gray-900">{selectedDay}</span>
                <ChevronDown className="w-5 h-5 text-gray-600" />
              </button>
              
              {showDayDropdown && (
                <div className="absolute left-0 right-0 z-20 mt-2 overflow-hidden bg-white border border-gray-200 shadow-lg top-full rounded-xl">
                  {['day1', 'day2', 'day3', 'day4'].map((day) => (
                    <button
                      key={day}
                      onClick={() => {
                        setSelectedDay(day);
                        setShowDayDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors ${
                        selectedDay === day ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-gray-700'
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Place List */}
          <div className="px-4 py-4 space-y-3">
            {items.length === 0 ? (
              <div className="py-16 text-center">
                <MapPin className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="text-gray-500">{t('noPlacesAdded')}</p>
                <button
                  onClick={() => navigate('/explore')}
                  className="px-6 py-2 mt-4 text-white transition-colors bg-primary-500 rounded-xl hover:bg-primary-600"
                >
                  {t('addPlaces')}
                </button>
              </div>
            ) : (
              items.map((item, index) => {
                const isSelected = selectedPlace?.id === item.id;
                const color = getPlaceColor(index);
                
                return (
                  <button
                    key={item.id}
                    onClick={() => setSelectedPlace(item)}
                    className={`w-full text-left p-4 rounded-2xl transition-all ${
                      isSelected
                        ? 'bg-linear-to-br from-blue-50 to-primary-50 border-2 border-primary-500 shadow-md'
                        : 'bg-white hover:bg-gray-50 border-2 border-gray-100 hover:border-gray-200'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      {/* Number Badge */}
                      <div
                        className="flex items-center justify-center w-8 h-8 text-sm font-bold text-white rounded-full shadow-md shrink-0"
                        style={{ backgroundColor: color }}
                      >
                        {index + 1}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center mb-1 space-x-2">
                          <span className="text-lg">{getCategoryIcon(item.place.category)}</span>
                          <span className="text-xs font-medium text-gray-500">
                            {getCategoryLabel(item.place.category)}
                          </span>
                        </div>
                        
                        <h3 className="mb-1 font-bold text-gray-900 truncate">
                          {item.place.name}
                        </h3>
                        
                        {item.place.address && (
                          <p className="mb-2 text-xs text-gray-500 truncate">
                            {item.place.address}
                          </p>
                        )}

                        <div className="flex items-center space-x-3 text-xs text-gray-600">
                          <div className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{formatDuration(item.stayDurationMins)}</span>
                          </div>
                          {item.place.rating && (
                            <div className="flex items-center space-x-1">
                              <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                              <span>{item.place.rating}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Panel - Map */}
        <div className="relative flex-1 hidden lg:block">
          <MapPanel
            items={items}
            segments={state.routes}
            transportMode={transportMode}
            isLoading={state.isLoading}
            className="h-full"
            onMarkerClick={(item) => setSelectedPlace(item)}
          />

          {/* Floating Place Detail Card (Bottom) */}
          {selectedPlace && (
            <div className="absolute overflow-hidden bg-white border border-gray-100 shadow-2xl bottom-6 left-6 right-6 rounded-2xl animate-slide-up">
              {/* Day Tabs */}
              <div className="flex border-b border-gray-100 bg-gray-50">
                {['day1', 'day2', 'day3', 'day4'].map((day) => (
                  <button
                    key={day}
                    onClick={() => setSelectedDay(day)}
                    className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                      selectedDay === day
                        ? 'text-primary-600 border-b-2 border-primary-600 bg-white'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center mb-2 space-x-2">
                      <span className="text-2xl">{getCategoryIcon(selectedPlace.place.category)}</span>
                      <span className="text-sm font-medium text-gray-500">
                        {getCategoryLabel(selectedPlace.place.category)}
                      </span>
                    </div>
                    
                    <h2 className="mb-2 text-2xl font-bold text-gray-900">
                      {selectedPlace.place.name}
                    </h2>
                    
                    {selectedPlace.place.description && (
                      <p className="mb-3 text-gray-600">
                        {selectedPlace.place.description}
                      </p>
                    )}

                    {/* Rating */}
                    {selectedPlace.place.rating && (
                      <div className="flex items-center mb-4 space-x-2">
                        <div className="flex items-center">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-5 h-5 ${
                                star <= (selectedPlace.place.rating || 0)
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">
                          {selectedPlace.place.rating} · {t('reviews')} {Math.floor(Math.random() * 5000) + 100}
                        </span>
                      </div>
                    )}

                    {/* Address */}
                    {selectedPlace.place.address && (
                      <div className="flex items-start mb-4 space-x-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                        <span>{selectedPlace.place.address}</span>
                      </div>
                    )}
                  </div>

                  <button className="p-2 transition-colors rounded-full hover:bg-gray-100">
                    <Heart className="w-6 h-6 text-gray-400" />
                  </button>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <button
                    onClick={() => openDirections(selectedPlace.place, transportMode)}
                    className="flex items-center justify-center flex-1 px-6 py-3 space-x-2 font-medium text-white transition-colors bg-primary-500 rounded-xl hover:bg-primary-600"
                  >
                    <Navigation className="w-5 h-5" />
                    <span>{t('directions')}</span>
                  </button>
                  <button
                    onClick={() => navigate('/planner')}
                    className="flex items-center justify-center px-6 py-3 space-x-2 font-medium text-gray-700 transition-colors bg-gray-100 rounded-xl hover:bg-gray-200"
                  >
                    <Edit3 className="w-5 h-5" />
                    <span>{t('edit')}</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
