import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Plus, Calendar, MapPin, TrendingUp, Heart } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { auth } from '../firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { type TourPlace } from '../utils/publicDataApi';
import LoadingSpinner from '../components/LoadingSpinner';

interface SavedTrip {
  id: string;
  title: string;
  cityName: string;
  startDate: string;
  endDate: string;
  days: number;
  createdAt: number;
}

interface FavoritePlace {
  id: string;
  name: string;
  category: string;
  image?: string;
  address?: string;
  savedAt: number;
}

export default function HomePage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [todayRecommendations, setTodayRecommendations] = useState<TourPlace[]>([]);
  const [favorites, setFavorites] = useState<FavoritePlace[]>([]);
  const [favoritePlaceIds, setFavoritePlaceIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [tripList, setTripList] = useState<SavedTrip[]>([]);

  // 인증 확인
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
    });
    return () => unsubscribe();
  }, []);

  // 데이터 로드
  useEffect(() => {
    loadPageData();
  }, [isAuthenticated]);

  useEffect(() => {
    const tripsData = localStorage.getItem('myTrips');
    if (tripsData) {
      setTripList(JSON.parse(tripsData));
    } else {
      setTripList([]);
    }
  }, [loading]);

  const loadPageData = async () => {
    setLoading(true);
    try {
      // 최근 일정 로드 (localStorage) - 인증 여부와 관계없이 항상 로드
      const tripsData = localStorage.getItem('myTrips');
      if (tripsData) {
        const trips: SavedTrip[] = JSON.parse(tripsData);
        // setRecentTrips(trips); // 모든 여행 일정 표시
      }

      // 즐겨찾기 로드 - 인증 여부와 관계없이 항상 로드
      const favData = localStorage.getItem('favoritePlaces');
      if (favData) {
        const favs = JSON.parse(favData);
        setFavorites(favs); // 모든 즐겨찾기 표시
        setFavoritePlaceIds(favs.map((f: FavoritePlace) => f.id));
      }

      // 오늘의 추천 - 목 데이터 사용 (API 대신)
      const mockRecommendations: TourPlace[] = [
        {
          contentid: 'rec-1',
          title: '경복궁',
          addr1: '서울특별시 종로구',
          firstimage: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800',
          contenttypeid: '12',
          mapx: '126.9770',
          mapy: '37.5796'
        },
        {
          contentid: 'rec-2',
          title: 'N서울타워',
          addr1: '서울특별시 용산구',
          firstimage: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800',
          contenttypeid: '12',
          mapx: '126.9882',
          mapy: '37.5512'
        },
        {
          contentid: 'rec-3',
          title: '북촌 한옥마을',
          addr1: '서울특별시 종로구',
          firstimage: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800',
          contenttypeid: '12',
          mapx: '126.9835',
          mapy: '37.5824'
        },
        {
          contentid: 'rec-4',
          title: '명동 거리',
          addr1: '서울특별시 중구',
          firstimage: 'https://images.unsplash.com/photo-1555217851-6141535bd771?w=800',
          contenttypeid: '12',
          mapx: '126.9849',
          mapy: '37.5636'
        },
        {
          contentid: 'rec-5',
          title: '한강공원',
          addr1: '서울특별시 영등포구',
          firstimage: 'https://images.unsplash.com/photo-1524850011238-e3d235c7d4c9?w=800',
          contenttypeid: '12',
          mapx: '126.9360',
          mapy: '37.5293'
        },
        {
          contentid: 'rec-6',
          title: '동대문 디자인 플라자',
          addr1: '서울특별시 중구',
          firstimage: 'https://images.unsplash.com/photo-1538485399081-7191377e8241?w=800',
          contenttypeid: '12',
          mapx: '127.0096',
          mapy: '37.5665'
        }
      ];
      setTodayRecommendations(mockRecommendations);
    } catch (error) {
      console.error('Failed to load page data:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = (e: React.MouseEvent, place: TourPlace) => {
    e.stopPropagation();
    
    const stored = localStorage.getItem('favoritePlaces');
    const currentFavorites: FavoritePlace[] = stored ? JSON.parse(stored) : [];
    
    const isFav = currentFavorites.some((f: FavoritePlace) => f.id === place.contentid);
    
    if (isFav) {
      const updated = currentFavorites.filter((f: FavoritePlace) => f.id !== place.contentid);
      localStorage.setItem('favoritePlaces', JSON.stringify(updated));
      setFavorites(updated);
      setFavoritePlaceIds(updated.map((f: FavoritePlace) => f.id));
    } else {
      const newFavorite: FavoritePlace = {
        id: place.contentid,
        name: place.title,
        category: place.contenttypeid === '12' ? '관광지' :
                  place.contenttypeid === '39' ? '음식점' :
                  place.contenttypeid === '32' ? '숙박' : '기타',
        image: place.firstimage,
        address: place.addr1,
        savedAt: Date.now()
      };
      const updated = [...currentFavorites, newFavorite];
      localStorage.setItem('favoritePlaces', JSON.stringify(updated));
      setFavorites(updated);
      setFavoritePlaceIds(updated.map((f: FavoritePlace) => f.id));
    }
  };

  const isFavorite = (placeId: string) => {
    return favoritePlaceIds.includes(placeId);
  };

  const clearAllTrips = () => {
    if (!confirm(t('deleteAllTripsConfirm'))) return;
    try {
      localStorage.removeItem('myTrips');
      localStorage.removeItem('currentTrip');
      localStorage.removeItem('favoritePlaces');
    } catch (e) {
      console.error('Failed to clear localStorage:', e);
    }
    location.reload();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="border-b border-gray-200">
        <div className="max-w-6xl px-4 py-16 mx-auto sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="mb-2 text-4xl font-bold text-gray-900 md:text-5xl">
                두리번
              </h1>
              <p className="text-lg text-gray-800">
                {t('createPerfectItinerary')}
              </p>
            </div>
            <div className="flex items-center">
              <button
                onClick={() => {
                  if (isAuthenticated) {
                    navigate('/create-trip');
                  } else {
                    navigate('/login', { 
                      state: { from: '/create-trip', message: '여행 일정을 만들려면 먼저 로그인해주세요.' } 
                    });
                  }
                }}
                className="flex items-center gap-2 px-6 py-3 font-semibold transition-all bg-white rounded-xl text-primary-600 hover:shadow-lg hover:scale-105"
              >
                <Plus className="w-5 h-5" />
                {t('newTripPlan')}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl px-4 py-12 mx-auto sm:px-6 lg:px-8">
        {/* 저장된 여행 일정 리스트 */}
        <section className="mb-12">
          <h2 className="mb-4 text-xl font-bold text-gray-900">저장된 여행 일정</h2>
          {tripList.length === 0 ? (
            <p className="text-gray-500">저장된 일정이 없습니다.</p>
          ) : (
            <ul className="space-y-2">
              {tripList.map(trip => (
                <li
                  key={trip.id}
                  className="p-3 bg-white border rounded cursor-pointer hover:bg-blue-50"
                  onClick={() => navigate(`/trip/${trip.id}`)}
                >
                  <span className="font-semibold text-primary-700">{trip.title}</span>
                  <span className="mx-2 text-gray-500">|</span>
                  <span>{trip.cityName}</span>
                  <span className="mx-2 text-gray-400">|</span>
                  <span className="text-sm text-gray-600">{trip.startDate} ~ {trip.endDate}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* 오늘의 추천 */}
        <section className="mb-12">
          <div className="flex items-center mb-6">
            <TrendingUp className="w-6 h-6 mr-2 text-primary-600" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{t('todaysRecommendations')}</h2>
              <p className="text-gray-600">{t('popularPlacesDesc')}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {todayRecommendations.map((place, index) => (
              <div
                key={place.contentid || `rec-${index}`}
                onClick={() => navigate('/explore')}
                className="overflow-hidden transition-all bg-white border-2 border-orange-200 cursor-pointer rounded-xl hover:scale-105 hover:shadow-lg hover:border-orange-400"
              >
                <div className="relative h-32">
                  {place.firstimage ? (
                    <img
                      src={place.firstimage}
                      alt={place.title}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full bg-linear-to-br from-orange-100 to-yellow-100">
                      <MapPin className="w-8 h-8 text-orange-400" />
                    </div>
                  )}
                  <button
                    onClick={(e) => toggleFavorite(e, place)}
                    className="absolute flex items-center justify-center w-8 h-8 transition-all bg-white rounded-full shadow-md top-2 right-2 hover:scale-110"
                  >
                    <Heart 
                      className={`w-4 h-4 ${isFavorite(place.contentid) ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
                    />
                  </button>
                </div>
                <div className="p-3 bg-orange-50">
                  <p className="text-sm font-bold text-gray-900 line-clamp-2">
                    {place.title}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 즐겨찾기 */}
        {isAuthenticated && favorites.length > 0 && (
          <section>
            <div className="flex items-center mb-6">
              <Heart className="w-6 h-6 mr-2 text-red-500" />
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{t('favorites')}</h2>
                <p className="text-gray-600">{t('savedPlaces')}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {favorites.map((place, index) => (
                <div
                  key={place.id || `fav-${index}`}
                  onClick={() => navigate('/explore')}
                  className="overflow-hidden transition-all bg-white border border-gray-200 cursor-pointer rounded-xl hover:shadow-lg"
                >
                  <div className="relative h-40">
                    {place.image ? (
                      <img
                        src={place.image}
                        alt={place.name}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="flex items-center justify-center w-full h-full bg-gray-200">
                        <MapPin className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                    <div className="absolute top-3 left-3">
                      <span className="px-2 py-1 text-xs font-medium text-white bg-red-500 rounded">
                        {place.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="mb-1 font-bold text-gray-900">{place.name}</h3>
                    <p className="text-sm text-gray-600 line-clamp-1">
                      <MapPin className="inline w-3 h-3 mr-1" />
                      {place.address}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Empty State */}
        {isAuthenticated && favorites.length === 0 && (
          <div className="py-20 text-center">
            <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 rounded-full bg-primary-100">
              <Plus className="w-10 h-10 text-primary-600" />
            </div>
            <h3 className="mb-2 text-2xl font-bold text-gray-900">
              {t('createFirstTrip')}
            </h3>
            <p className="mb-6 text-gray-600">
              {t('planWithDuriibunn')}
            </p>
            <button
              onClick={() => navigate('/create-trip')}
              className="px-8 py-3 font-semibold text-white transition-colors rounded-xl bg-primary-600 hover:bg-primary-700"
            >
              {t('startCreatingItinerary')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
