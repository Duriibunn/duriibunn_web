import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  ArrowLeft, 
  Calendar,
  MapPin,
  Heart,
  Navigation,
  StickyNote,
  Image as ImageIcon,
  Trash2,
  Clock
} from 'lucide-react';
import { getTrip, updateTrip } from '../firebase/trips';
import { getUserFavorites, addToFavorites, removeFromFavorites } from '../firebase/trips';

interface Place {
  id: string;
  name: string;
  category: string;
  image?: string;
  address?: string;
  lat?: number;
  lng?: number;
}

interface Trip {
  id: string;
  title: string;
  cityName: string;
  startDate: string;
  endDate: string;
  days: number;
  dailySchedules: { [key: number]: Place[] };
  createdAt: number;
}

export default function TripDetailPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadTrip();
    loadFavorites();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadTrip = useCallback(async () => {
    // location.state에서 trip을 받거나 localStorage에서 로드 (빠른 응답)
    if (location.state?.trip) {
      setTrip(location.state.trip);
      return;
    }
    
    if (!id) {
      navigate('/');
      return;
    }

    // Try localStorage first (fast)
    const storedTrips = localStorage.getItem('myTrips');
    if (storedTrips) {
      const trips: Trip[] = JSON.parse(storedTrips);
      const foundTrip = trips.find(t => t.id === id);
      if (foundTrip) {
        setTrip(foundTrip);
        return;
      }
    }

    // Then try Firebase (slower, requires auth)
    try {
      const firebaseTrip = await getTrip(id);
      if (firebaseTrip) {
        setTrip(firebaseTrip);
        return;
      }
    } catch (error) {
      console.error('Failed to load trip from Firebase:', error);
    }

    // If not found anywhere, go home
    navigate('/');
  }, [id, location.state, navigate]);

  const loadFavorites = async () => {
    try {
      // Try Firebase first
      const firebaseFavorites = await getUserFavorites();
      const favoriteIds = firebaseFavorites.map(fav => fav.id);
      setFavorites(new Set(favoriteIds));
    } catch (error) {
      console.error('Failed to load favorites from Firebase:', error);
      // Fallback to localStorage
      const storedFavorites = localStorage.getItem('favorites');
      if (storedFavorites) {
        setFavorites(new Set(JSON.parse(storedFavorites)));
      }
    }
  };

  const toggleFavorite = async (placeId: string) => {
    if (!trip) return;
    
    const place = Object.values(trip.dailySchedules)
      .flat()
      .find(p => p.id === placeId);
    
    if (!place) return;

    const newFavorites = new Set(favorites);
    const isCurrentlyFavorite = newFavorites.has(placeId);

    try {
      if (isCurrentlyFavorite) {
        await removeFromFavorites(placeId);
        newFavorites.delete(placeId);
      } else {
        await addToFavorites(place);
        newFavorites.add(placeId);
      }
      setFavorites(newFavorites);
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
      // Fallback to localStorage
      if (isCurrentlyFavorite) {
        newFavorites.delete(placeId);
      } else {
        newFavorites.add(placeId);
      }
      setFavorites(newFavorites);
      localStorage.setItem('favorites', JSON.stringify(Array.from(newFavorites)));
    }
  };

  const handleRemovePlace = async (dayIndex: number, placeId: string) => {
    if (!trip) return;

    // 삭제 확인
    if (!confirm('이 장소를 일정에서 삭제하시겠습니까?')) {
      return;
    }

    // dailySchedules에서 해당 장소 제거
    const updatedSchedules = { ...trip.dailySchedules };
    updatedSchedules[dayIndex] = updatedSchedules[dayIndex].filter(
      place => place.id !== placeId
    );

    const updatedTrip = {
      ...trip,
      dailySchedules: updatedSchedules
    };

    // 로컬 상태 즉시 업데이트
    setTrip(updatedTrip);

    // localStorage 업데이트
    try {
      const storedTrips = localStorage.getItem('myTrips');
      if (storedTrips) {
        const trips: Trip[] = JSON.parse(storedTrips);
        const tripIndex = trips.findIndex(t => t.id === trip.id);
        if (tripIndex !== -1) {
          trips[tripIndex] = updatedTrip;
          localStorage.setItem('myTrips', JSON.stringify(trips));
        }
      }
    } catch (error) {
      console.error('Failed to update localStorage:', error);
    }

    // Firebase 업데이트 (인증된 경우)
    try {
      await updateTrip(trip.id, { dailySchedules: updatedSchedules });
    } catch (error) {
      console.error('Failed to update trip in Firebase:', error);
      // Firebase 실패해도 localStorage에는 저장되었으므로 계속 진행
    }
  };

  const getDayLabel = (dayIndex: number) => {
    if (!trip) return '';
    const date = new Date(trip.startDate);
    date.setDate(date.getDate() + dayIndex);
    return date.toLocaleDateString('ko-KR', { 
      month: 'long', 
      day: 'numeric',
      weekday: 'short'
    });
  };

  const getCategoryBadgeColor = (category: string) => {
    if (category.includes('관광지') || category.includes('문화')) return 'bg-blue-100 text-blue-700';
    if (category.includes('음식') || category.includes('맛집')) return 'bg-orange-100 text-orange-700';
    if (category.includes('숙박')) return 'bg-purple-100 text-purple-700';
    return 'bg-gray-100 text-gray-700';
  };

  const openKakaoMap = (place: Place) => {
    // 카카오맵 길찾기 URL (목적지)
    const url = `https://map.kakao.com/link/to/${encodeURIComponent(place.name)},${place.lat},${place.lng}`;
    window.open(url, '_blank');
  };

  if (!trip) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center text-gray-500">
          <p className="mb-4 text-lg">{t('loadingTrip')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl px-4 py-6 mx-auto sm:px-6 lg:px-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center mb-4 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            {t('backToHomeButton')}
          </button>
          
          <div className="mb-4">
            <h1 className="mb-2 text-3xl font-bold text-gray-900">
              {trip.title}
            </h1>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>
                  {new Date(trip.startDate).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })}
                  {' - '}
                  {new Date(trip.endDate).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{trip.cityName}</span>
              </div>
              <div className="px-2 py-1 text-xs font-medium rounded-full bg-primary-100 text-primary-700">
                {trip.days}일
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="max-w-4xl px-4 py-8 mx-auto sm:px-6 lg:px-8">
        <div className="space-y-8">
          {trip && trip.days && Array.from({ length: trip.days }, (_, dayIndex) => {
            const places = trip.dailySchedules?.[dayIndex] || [];
            
            return (
              <div key={dayIndex} className="bg-white border border-gray-200 rounded-xl">
                <div className="p-6 border-b bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="mb-1 text-xl font-bold text-gray-900">
                        {t('dayLabel')} {dayIndex + 1}
                      </h2>
                      <p className="text-sm text-gray-600">
                        {getDayLabel(dayIndex)}
                      </p>
                    </div>
                    <div className="text-sm text-gray-500">
                      {places.length}{t('tripPlacesCount')}
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  {places.length === 0 ? (
                    <div className="py-10 text-center text-gray-400">
                      <p className="text-sm">{t('noPlanToday')}</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {places.map((place, placeIndex) => (
                        <div 
                          key={place.id}
                          className="relative"
                        >
                          {/* Timeline connector */}
                          {placeIndex < places.length - 1 && (
                            <div className="absolute left-5 top-16 bottom-0 w-0.5 bg-gray-200" />
                          )}

                          <div className="flex gap-4">
                            {/* Number Badge */}
                            <div className="relative z-10 flex items-center justify-center w-10 h-10 font-bold text-white rounded-full bg-primary-600">
                              {placeIndex + 1}
                            </div>

                            {/* Place Card */}
                            <div className="flex-1 overflow-hidden bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                              <div className="flex gap-4 p-4">
                                {place.image && (
                                  <img 
                                    src={place.image}
                                    alt={place.name}
                                    className="object-cover w-24 h-24 rounded-lg"
                                  />
                                )}
                                <div className="flex-1">
                                  <div className="flex items-start justify-between mb-2">
                                    <div>
                                      <h3 className="mb-1 text-lg font-bold text-gray-900">
                                        {place.name}
                                      </h3>
                                      <span className={`inline-block px-2 py-1 text-xs font-medium rounded ${getCategoryBadgeColor(place.category)}`}>
                                        {place.category}
                                      </span>
                                    </div>
                                    <div className="flex gap-1">
                                      <button
                                        onClick={() => toggleFavorite(place.id)}
                                        className={`p-2 rounded-full transition-colors ${
                                          favorites.has(place.id)
                                            ? 'text-red-500 bg-red-50'
                                            : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                                        }`}
                                      >
                                        <Heart className={`w-5 h-5 ${favorites.has(place.id) ? 'fill-current' : ''}`} />
                                      </button>
                                      <button
                                        onClick={() => handleRemovePlace(dayIndex, place.id)}
                                        className="p-2 text-gray-400 transition-colors rounded-full hover:text-red-500 hover:bg-red-50"
                                      >
                                        <Trash2 className="w-5 h-5" />
                                      </button>
                                    </div>
                                  </div>
                                  {place.address && (
                                    <p className="mb-3 text-sm text-gray-600 line-clamp-1">
                                      {place.address}
                                    </p>
                                  )}
                                  {place.lat && place.lng && (
                                    <button
                                      onClick={() => openKakaoMap(place)}
                                      className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-primary-700 bg-primary-50 rounded-lg hover:bg-primary-100"
                                    >
                                      <Navigation className="w-4 h-4" />
                                      {t('getDirections')}
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Travel time indicator */}
                          {placeIndex < places.length - 1 && (
                            <div className="flex items-center gap-2 mt-2 ml-14 text-xs text-gray-500">
                              <Clock className="w-3 h-3" />
                              <span>{t('travelTimeAbout')}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Place Detail Modal */}
      {selectedPlace && (
        <div 
          className="fixed inset-0 z-50 flex items-end justify-center bg-black bg-opacity-50 sm:items-center"
          onClick={() => setSelectedPlace(null)}
        >
          <div 
            className="w-full max-w-2xl overflow-hidden bg-white sm:rounded-xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {selectedPlace.image && (
              <img 
                src={selectedPlace.image}
                alt={selectedPlace.name}
                className="object-cover w-full h-48"
              />
            )}
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="mb-2 text-2xl font-bold text-gray-900">
                    {selectedPlace.name}
                  </h2>
                  <span className={`inline-block px-3 py-1 text-sm font-medium rounded-lg ${getCategoryBadgeColor(selectedPlace.category)}`}>
                    {selectedPlace.category}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedPlace(null)}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              {selectedPlace.address && (
                <div className="flex items-start gap-2 mb-4">
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                  <p className="text-gray-700">{selectedPlace.address}</p>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="flex items-center gap-2 mb-2 text-sm font-semibold text-gray-900">
                    <StickyNote className="w-4 h-4" />
                    {t('memoLabel')}
                  </label>
                  <textarea
                    placeholder={t('memoPlaceholder')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    rows={4}
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 mb-2 text-sm font-semibold text-gray-900">
                    <ImageIcon className="w-4 h-4" />
                    {t('photoAttach')}
                  </label>
                  <button className="flex items-center justify-center w-full px-4 py-8 text-gray-500 transition-colors border-2 border-gray-300 border-dashed rounded-lg hover:border-primary-500 hover:text-primary-500">
                    <div className="text-center">
                      <ImageIcon className="w-8 h-8 mx-auto mb-2" />
                      <p className="text-sm">{t('clickToAddPhoto')}</p>
                    </div>
                  </button>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    className="flex items-center justify-center flex-1 gap-2 px-4 py-3 font-semibold text-white transition-colors rounded-lg bg-primary-600 hover:bg-primary-700"
                  >
                    {t('savePlaceButton')}
                  </button>
                  <button
                    className="flex items-center justify-center gap-2 px-4 py-3 font-semibold text-red-600 transition-colors bg-red-50 rounded-lg hover:bg-red-100"
                  >
                    <Trash2 className="w-5 h-5" />
                    {t('deletePlaceButton')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
