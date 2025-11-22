import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MapPin } from 'lucide-react';
import { useEffect, useState } from 'react';
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
  const [topPlaces, setTopPlaces] = useState<TourPlace[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-8 leading-tight">
            나만의 여행 일정,<br />
            <span className="text-primary-500">두리번</span>으로<br />
            간편해졌어요
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-12">
            {t('aiPoweredDescription')}
          </p>

          {/* CTA Button */}
          <button
            onClick={() => navigate('/create-trip')}
            className="px-8 py-4 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors font-semibold text-lg"
          >
            {t('startPlanning')}
          </button>
        </div>
      </div>

      {/* Map Section */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 text-center mb-16">
            여행을 한눈에,<br />그리고 한 번에!
          </h2>
          
          <div className="rounded-2xl overflow-hidden shadow-xl bg-white">
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
      </div>

      {/* Places Section */}
      <div className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              어떤 취향이든,<br />다 맞춰주니까
            </h2>
            <p className="text-xl text-gray-600">
              {t('popularPlacesDesc')}
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {topPlaces.map((place) => (
                <div
                  key={place.contentid}
                  className="group cursor-pointer"
                  onClick={() => navigate('/explore')}
                >
                  {/* Place Image */}
                  <div className="aspect-4/3 bg-gray-100 rounded-2xl overflow-hidden mb-4">
                    {place.firstimage ? (
                      <img
                        src={place.firstimage}
                        alt={place.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <MapPin className="w-12 h-12 text-gray-300" />
                      </div>
                    )}
                  </div>

                  {/* Place Info */}
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {place.title}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {place.addr1 || t('noAddress')}
                  </p>
                </div>
              ))}
            </div>
          )}
          
          <div className="text-center mt-12">
            <button
              onClick={() => navigate('/explore')}
              className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:border-gray-400 transition-colors font-medium"
            >
              {t('viewAll')}
            </button>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            나를 아는 여행 앱<br />
            <span className="text-primary-500">두리번</span>
          </h2>
          <p className="text-xl text-gray-600 mb-10">
            지금 바로 다운로드하고 여행을 떠나세요
          </p>
          <button
            onClick={() => navigate('/create-trip')}
            className="px-10 py-4 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors font-semibold text-lg"
          >
            {t('createTripNow')}
          </button>
        </div>
      </div>
    </div>
  );
}
