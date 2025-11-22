import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MapPin, Star, TrendingUp, Clock, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { auth } from '../firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { getSeoulTouristSpots, type TourPlace } from '../utils/publicDataApi';
import LoadingSpinner from '../components/LoadingSpinner';

declare global {
  interface Window {
    kakao: {
      maps: {
        load: (callback: () => void) => void;
        LatLng: new (lat: number, lng: number) => unknown;
        Map: new (container: HTMLElement, options: unknown) => unknown;
        Marker: new (options: unknown) => { setMap: (map: unknown) => void };
        event: {
          addListener: (target: unknown, type: string, handler: () => void) => void;
        };
      };
    };
  }
}

export default function HomePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [topPlaces, setTopPlaces] = useState<TourPlace[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  // Load top tourist spots from API
  useEffect(() => {
    const loadTopPlaces = async () => {
      try {
        const places = await getSeoulTouristSpots(6);
        setTopPlaces(places);
      } catch (error) {
        console.error('Failed to load top places:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTopPlaces();
  }, []);

  // Initialize Kakao Map
  useEffect(() => {
    if (topPlaces.length === 0) return;

    const script = document.createElement('script');
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${import.meta.env.VITE_KAKAO_MAP_KEY}&autoload=false`;
    script.async = true;
    
    script.onload = () => {
      window.kakao.maps.load(() => {
        const container = document.getElementById('home-map');
        if (!container) return;

        const options = {
          center: new window.kakao.maps.LatLng(37.5665, 126.9780),
          level: 8,
        };

        const map = new window.kakao.maps.Map(container, options);

        // Add markers for top places
        topPlaces.forEach((place) => {
          const lat = parseFloat(place.mapy);
          const lng = parseFloat(place.mapx);
          
          if (!isNaN(lat) && !isNaN(lng)) {
            const markerPosition = new window.kakao.maps.LatLng(lat, lng);
            const marker = new window.kakao.maps.Marker({
              position: markerPosition,
            });
            marker.setMap(map);

            // Add click event to marker
            window.kakao.maps.event.addListener(marker, 'click', () => {
              navigate('/explore');
            });
          }
        });
      });
    };

    document.head.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [topPlaces, navigate]);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* User Welcome */}
          {user && (
            <div className="mb-4">
              <p className="text-lg font-medium text-primary-600">
                {user.displayName || user.email?.split('@')[0]}{t('welcomeUser')}
              </p>
            </div>
          )}
          
          {/* Main Heading */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            <span className="text-primary-500">두리번</span> {t('smartRoutePlanner')}
          </h1>
          
          <p className="text-lg text-gray-600 mb-8 max-w-2xl">
            {t('aiPoweredDescription')}
          </p>

          {/* CTA Button */}
          <button
            onClick={() => navigate('/create-trip')}
            className="px-6 py-3 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors font-medium inline-flex items-center gap-2"
          >
            {t('startPlanning')}
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Map Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">{t('popularPlaces')}</h2>
                <p className="text-gray-600 mt-1">{t('popularPlacesDesc')}</p>
              </div>
              <div className="flex items-center gap-2 text-primary-600">
                <MapPin className="w-5 h-5" />
                <span className="text-sm font-medium">{topPlaces.length} {t('topPlaces')}</span>
              </div>
            </div>
          </div>
          
          <div className="aspect-video bg-gray-100">
            {isLoading ? (
              <div className="w-full h-full flex items-center justify-center">
                <LoadingSpinner size="lg" />
              </div>
            ) : (
              <div id="home-map" className="w-full h-full"></div>
            )}
          </div>
        </div>
      </div>

      {/* Top Places Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-primary-500" />
            {t('recommendedAttractions')}
          </h2>
          <button
            onClick={() => navigate('/explore')}
            className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center gap-1 transition-colors"
          >
            {t('viewAll')}
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topPlaces.map((place) => (
              <div
                key={place.contentid}
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => navigate('/explore')}
              >
                {/* Place Image */}
                <div className="h-48 bg-gray-100 relative overflow-hidden">
                  {place.firstimage ? (
                    <img
                      src={place.firstimage}
                      alt={place.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <MapPin className="w-12 h-12 text-gray-300" />
                    </div>
                  )}
                  {/* Badge */}
                  <div className="absolute top-3 right-3 bg-white px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                    <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                    <span className="text-xs font-medium text-gray-900">HOT</span>
                  </div>
                </div>

                {/* Place Info */}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">
                    {place.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {place.addr1 || t('noAddress')}
                  </p>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate('/create-trip');
                    }}
                    className="w-full px-4 py-2 bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 font-medium text-sm transition-colors"
                  >
                    {t('addToItinerary')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* How It Works Section */}
      <div className="bg-white border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">{t('simpleSteps')}</h2>
            <p className="text-gray-600">{t('stepsDescription')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step 1 */}
            <div className="bg-gray-50 rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <MapPin className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('step1')}</h3>
              <p className="text-sm text-gray-600">{t('step1Desc')}</p>
            </div>

            {/* Step 2 */}
            <div className="bg-gray-50 rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Clock className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('step2')}</h3>
              <p className="text-sm text-gray-600">{t('step2Desc')}</p>
            </div>

            {/* Step 3 */}
            <div className="bg-gray-50 rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('step3')}</h3>
              <p className="text-sm text-gray-600">{t('step3Desc')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
