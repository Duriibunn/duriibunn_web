import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChevronRight, Calendar, MapPin } from 'lucide-react';
import { useEffect, useState } from 'react';
import LoadingSpinner from '../components/LoadingSpinner';
import FeaturesSection from '../components/FeaturesSection';
import CitySlider from '../components/CitySlider';
import { auth } from '../firebase/config';
import { onAuthStateChanged } from 'firebase/auth';

interface SavedTrip {
  id: string;
  title?: string;
  city?: string;
  startDate?: string;
  endDate?: string;
  days?: number;
  progress?: number;
  status?: 'preparation' | 'ongoing' | 'completed';
}

export default function HomePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [myTrips, setMyTrips] = useState<SavedTrip[]>([]);
  const [tripsLoading, setTripsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
    });

    return () => unsubscribe();
  }, []);

  // Load user's trips
  useEffect(() => {
    const loadUserTrips = async () => {
      try {
        // 로그인하지 않은 경우 여행 목록을 로드하지 않음
        if (!isAuthenticated) {
          setMyTrips([]);
          setTripsLoading(false);
          return;
        }

        // 로그인한 사용자의 여행만 로드
        const tripsData = localStorage.getItem('myTrips');
        if (tripsData) {
          try {
            const trips = JSON.parse(tripsData);
            
            // 유효한 여행 데이터만 필터링 (dailySchedules가 있는 완성된 여행만)
            const validTrips = Array.isArray(trips) 
              ? trips.filter((trip: SavedTrip) => {
                  // 최소한 id와 기본 정보가 있어야 함
                  return trip.id && (trip.title || trip.city);
                })
              : [];
            
            setMyTrips(validTrips);
            
            // 유효하지 않은 데이터가 있었다면 정리
            if (validTrips.length !== trips.length) {
              localStorage.setItem('myTrips', JSON.stringify(validTrips));
            }
          } catch (parseError) {
            console.error('Failed to parse trips data:', parseError);
            // 잘못된 데이터는 제거
            localStorage.removeItem('myTrips');
            setMyTrips([]);
          }
        }
      } catch (error) {
        console.error('Failed to load trips:', error);
      } finally {
        setTripsLoading(false);
      }
    };

    loadUserTrips();
  }, [isAuthenticated]);

  const hasTrips = myTrips.length > 0 && isAuthenticated;

  // State: User HAS trips
  if (tripsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (hasTrips) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Welcome Header */}
        <div className="bg-gradient-to-b from-primary-50 to-white py-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  {t('welcomeBack')}
                </h1>
                <p className="text-gray-600">오늘도 즐거운 여행 되세요!</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">{new Date().toLocaleDateString('ko-KR')}</p>
                <button
                  onClick={() => navigate('/create-trip')}
                  className="mt-2 px-4 py-2 bg-primary-500 text-white text-sm font-medium rounded-xl hover:bg-primary-600 transition-colors"
                >
                  + 새 일정 만들기
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Trips Section */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 mb-12">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">최근 여행 일정</h2>
            <p className="text-gray-600">진행 중인 여행과 예정된 일정을 확인하세요</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myTrips.slice(0, 3).map((trip) => (
              <div
                key={trip.id}
                onClick={() => navigate(`/trip/${trip.id}`)}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{trip.title || `${trip.city} 여행`}</h3>
                    <p className="text-sm text-gray-500">{trip.city}</p>
                  </div>
                  <span className="px-3 py-1 bg-primary-50 text-primary-600 text-xs font-medium rounded-full">
                    {trip.status === 'ongoing' ? '진행중' : trip.status === 'preparation' ? '준비중' : '완료'}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    {trip.startDate} ~ {trip.endDate}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    {trip.days}일 일정
                  </div>
                </div>
                {trip.progress !== undefined && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                      <span>진행률</span>
                      <span>{trip.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary-500 h-2 rounded-full transition-all"
                        style={{ width: `${trip.progress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          {myTrips.length > 3 && (
            <button
              onClick={() => navigate('/myplan')}
              className="mt-6 w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-primary-300 hover:text-primary-600 transition-colors font-medium"
            >
              모든 일정 보기 ({myTrips.length}개)
            </button>
          )}
        </div>

        {/* Today Recommendations */}
        <div className="bg-white py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                  오늘의 추천 여행지
                </h2>
                <p className="text-gray-600">AI가 엄선한 인기 여행지를 확인해보세요</p>
              </div>
              <button
                onClick={() => navigate('/explore')}
                className="text-primary-500 hover:text-primary-600 font-medium flex items-center gap-1"
              >
                {t('viewAll')}
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-100 rounded-2xl aspect-4/3 flex items-center justify-center">
                  <MapPin className="w-12 h-12 text-gray-300" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Features */}
        <FeaturesSection />
      </div>
    );
  }

  // State: User has NO trips (Empty State)
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-b from-primary-100 to-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            {t('noTripsTitle')}
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-10">
            {t('noTripsSubtitle')}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => {
                if (isAuthenticated) {
                  navigate('/trip/select-city');
                } else {
                  navigate('/login', { 
                    state: { from: '/trip/select-city', message: '여행 일정을 만들려면 먼저 로그인해주세요.' } 
                  });
                }
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 text-white rounded-xl transition-all font-semibold text-lg shadow-lg hover:shadow-xl hover:scale-105"
              style={{ backgroundColor: '#52e3c2' }}
            >
              {t('primaryCta')}
              <ChevronRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigate('/explore')}
              className="w-full sm:w-auto px-8 py-4 border-2 border-primary-500 text-primary-500 rounded-xl hover:bg-primary-50 transition-colors font-semibold text-lg"
            >
              {t('secondaryCta')}
            </button>
          </div>
        </div>
      </div>

      {/* City Slider */}
      <CitySlider />

      {/* Features Section */}
      <FeaturesSection />

      {/* Community Courses Preview */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              {t('trendingTitle')}
            </h2>
            <button
              onClick={() => navigate('/community')}
              className="text-primary-500 hover:text-primary-600 font-medium flex items-center gap-1"
            >
              {t('viewAll')}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 hover:shadow-xl transition-shadow"
              >
                <div className="aspect-video bg-gray-100 rounded-xl mb-4 flex items-center justify-center">
                  <MapPin className="w-12 h-12 text-gray-300" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {t('popularCourses')} {i}
                </h3>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>❤️ {Math.floor(Math.random() * 100)}</span>
                  <button className="text-primary-500 font-medium">
                    {t('saveButton')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Final CTA Section */}
      <div className="bg-gradient-to-br from-primary-50 to-blue-50 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            {t('startNow')}
          </h2>
          <p className="text-lg text-gray-700 mb-8">
            위치, 동선, 영업일, 식사시간 등을 고려하며<br />
            평균 10시간에 걸쳐 며칠 동안 짜야 할 일정 계획을<br />
            <span className="font-semibold text-primary-600">단 5분 만에 만들어보세요!</span>
          </p>
          <button
            onClick={() => {
              if (isAuthenticated) {
                navigate('/trip/select-city');
              } else {
                navigate('/login', { 
                  state: { from: '/trip/select-city', message: '여행 일정을 만들려면 먼저 로그인해주세요.' } 
                });
              }
            }}
            className="inline-flex items-center gap-2 px-10 py-4 text-white rounded-xl transition-all font-semibold text-lg shadow-lg hover:shadow-xl hover:scale-105"
            style={{ backgroundColor: '#52e3c2' }}
          >
            {t('startNowButton')}
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
