import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, ChevronRight, Search, ArrowLeft } from 'lucide-react';
import TripProgressStepper from '../components/TripProgressStepper';
import { auth } from '../firebase/config';
import { onAuthStateChanged } from 'firebase/auth';

const KOREAN_CITIES = [
  { id: 'seoul', name: '서울', areaCode: 1, description: '역사와 현대가 공존하는 대한민국의 수도' },
  { id: 'busan', name: '부산', areaCode: 6, description: '아름다운 해변과 신선한 해산물의 도시' },
  { id: 'jeju', name: '제주', areaCode: 39, description: '한국의 하와이, 자연이 선물한 섬' },
  { id: 'gangneung', name: '강릉', areaCode: 32, description: '동해 바다와 커피의 도시' },
  { id: 'gyeongju', name: '경주', areaCode: 35, description: '지붕 없는 박물관, 천년 고도' },
  { id: 'jeonju', name: '전주', areaCode: 37, description: '한국 전통 문화와 맛의 본고장' },
  { id: 'incheon', name: '인천', areaCode: 2, description: '국제 관문, 항구와 공항의 도시' },
  { id: 'daegu', name: '대구', areaCode: 4, description: '열정의 도시, 섬유와 패션의 중심지' },
  { id: 'yeosu', name: '여수', areaCode: 38, description: '밤바다가 아름다운 남해의 진주' },
];

export default function SelectCityPage() {
  const navigate = useNavigate();
  const [selectedCity, setSelectedCity] = useState<typeof KOREAN_CITIES[0] | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
      setIsLoading(false);
      
      if (!user) {
        // 로그인하지 않은 경우 로그인 페이지로 리다이렉트
        navigate('/login', { 
          state: { from: '/trip/select-city', message: '여행 일정을 만들려면 먼저 로그인해주세요.' } 
        });
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const filteredCities = KOREAN_CITIES.filter(city =>
    city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    city.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleNext = () => {
    if (selectedCity) {
      navigate('/trip/select-dates', { 
        state: { 
          cityName: selectedCity.name,
          areaCode: selectedCity.areaCode,
        } 
      });
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#52e3c2] mx-auto mb-4"></div>
          <p className="text-gray-600">로그인 상태 확인 중...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // 리다이렉트 중이므로 아무것도 렌더링하지 않음
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white pb-24">
      {/* Progress Stepper */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <TripProgressStepper currentStep={1} />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button - Mobile */}
        <div className="mb-6 md:hidden">
          <button
            onClick={handleBack}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            홈으로 돌아가기
          </button>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            어디로 여행을 떠나시나요?
          </h1>
          <p className="text-lg text-gray-600">
            여행지를 선택하면 맞춤형 여행 일정을 만들어드려요
          </p>
        </div>

        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="도시 이름으로 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-lg"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCities.map((city) => (
            <button
              key={city.id}
              onClick={() => setSelectedCity(city)}
              className={`p-6 rounded-2xl border-2 transition-all ${
                selectedCity?.id === city.id
                  ? 'border-primary-500 bg-primary-50 scale-105'
                  : 'border-gray-200 hover:border-primary-300 hover:scale-105'
              }`}
            >
              <div className="flex items-center mb-3">
                <MapPin className="h-6 w-6 mr-2 text-primary-600" />
                <h3 className="text-2xl font-bold text-gray-900">{city.name}</h3>
              </div>
              <p className="text-gray-600 text-left">{city.description}</p>
              {selectedCity?.id === city.id && (
                <div className="mt-4 flex items-center text-primary-600">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  <span className="font-semibold">선택됨</span>
                </div>
              )}
            </button>
          ))}
        </div>

        {filteredCities.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">검색 결과가 없습니다.</p>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 shadow-lg z-50">
        <div className="max-w-6xl mx-auto">
          <div className="flex gap-3">
            {/* Back Button - Desktop */}
            <button
              onClick={handleBack}
              className="hidden md:flex items-center justify-center px-6 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              이전
            </button>
            
            {/* Next Button */}
            <button
              onClick={handleNext}
              disabled={!selectedCity}
              className={`
                flex-1 flex items-center justify-center py-4 px-6 rounded-xl font-semibold text-lg transition-all
                ${selectedCity
                  ? 'text-white shadow-lg hover:shadow-xl'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }
              `}
              style={selectedCity ? { backgroundColor: '#52e3c2' } : {}}
            >
              <span>
                {selectedCity 
                  ? `${selectedCity.name} 여행 기간 선택하기`
                  : '도시를 선택해주세요'
                }
              </span>
              {selectedCity && (
                <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
