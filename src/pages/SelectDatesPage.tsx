import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, ChevronRight, Calendar, Plus, Minus } from 'lucide-react';
import TripProgressStepper from '../components/TripProgressStepper';
import { auth } from '../firebase/config';
import { onAuthStateChanged } from 'firebase/auth';

interface LocationState {
  cityName: string;
  areaCode: number;
}

const PRESET_DURATIONS = [
  { days: 1, label: '당일치기', description: '하루 동안 알차게' },
  { days: 2, label: '1박 2일', description: '주말 여행에 적합' },
  { days: 3, label: '2박 3일', description: '가장 인기 있는 기간' },
  { days: 4, label: '3박 4일', description: '여유롭게 즐기기' },
  { days: 7, label: '6박 7일', description: '충분한 휴식과 관광' },
];

export default function SelectDatesPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;

  const [selectedDays, setSelectedDays] = useState<number>(3);
  const [startDate, setStartDate] = useState<string>('');
  const [customDays, setCustomDays] = useState<number>(3);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
      setIsLoading(false);
      
      if (!user) {
        navigate('/login', { 
          state: { from: '/trip/select-dates', message: '여행 일정을 만들려면 먼저 로그인해주세요.' } 
        });
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  // 오늘 날짜를 최소값으로 설정
  const today = new Date().toISOString().split('T')[0];

  // 종료 날짜 계산
  const calculateEndDate = (start: string, days: number) => {
    if (!start) return '';
    const startDateObj = new Date(start);
    const endDateObj = new Date(startDateObj);
    endDateObj.setDate(startDateObj.getDate() + days - 1);
    return endDateObj.toISOString().split('T')[0];
  };

  const handleNext = () => {
    if (startDate && selectedDays && state) {
      const endDate = calculateEndDate(startDate, selectedDays);
      navigate('/trip/recommendations', { 
        state: { 
          ...state,
          startDate,
          endDate,
          days: selectedDays
        } 
      });
    }
  };

  const handleBack = () => {
    navigate('/trip/select-city', { state });
  };

  const isFormValid = startDate && selectedDays > 0;

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
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white pb-24">
      {/* Progress Stepper */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <TripProgressStepper currentStep={2} />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button - Mobile */}
        <div className="mb-6 md:hidden">
          <button
            onClick={handleBack}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            이전 단계로
          </button>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {state?.cityName} 여행은 언제 떠나시나요?
          </h1>
          <p className="text-lg text-gray-600">
            여행 날짜와 기간을 설정해주세요
          </p>
        </div>

        <div className="space-y-8">
          {/* 여행 시작 날짜 */}
          <div className="bg-white rounded-2xl p-6 border-2 border-gray-100">
            <div className="flex items-center mb-4">
              <Calendar className="w-6 h-6 text-primary-500 mr-3" />
              <h3 className="text-xl font-bold text-gray-900">여행 시작 날짜</h3>
            </div>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              min={today}
              className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-lg"
            />
            {startDate && (
              <p className="mt-2 text-sm text-primary-600">
                선택한 날짜: {new Date(startDate).toLocaleDateString('ko-KR', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric',
                  weekday: 'long'
                })}
              </p>
            )}
          </div>

          {/* 여행 기간 선택 */}
          <div className="bg-white rounded-2xl p-6 border-2 border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-6">여행 기간</h3>
            
            {/* 미리 설정된 기간 옵션 */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
              {PRESET_DURATIONS.map((duration) => (
                <button
                  key={duration.days}
                  onClick={() => setSelectedDays(duration.days)}
                  className={`
                    p-4 rounded-xl border-2 text-left transition-all
                    ${selectedDays === duration.days
                      ? 'border-primary-500 bg-primary-50 scale-105'
                      : 'border-gray-200 hover:border-primary-300 hover:scale-105'
                    }
                  `}
                >
                  <div className="font-semibold text-gray-900">{duration.label}</div>
                  <div className="text-sm text-gray-600 mt-1">{duration.description}</div>
                </button>
              ))}
            </div>

            {/* 사용자 정의 기간 */}
            <div className="border-t pt-6">
              <h4 className="font-semibold text-gray-900 mb-3">직접 입력</h4>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => {
                    const newDays = Math.max(1, customDays - 1);
                    setCustomDays(newDays);
                    setSelectedDays(newDays);
                  }}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <Minus className="w-4 h-4" />
                </button>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={customDays}
                    onChange={(e) => {
                      const days = parseInt(e.target.value) || 1;
                      setCustomDays(days);
                      setSelectedDays(days);
                    }}
                    className="w-20 p-2 text-center border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                  <span className="text-gray-700 font-medium">일</span>
                </div>

                <button
                  onClick={() => {
                    const newDays = Math.min(30, customDays + 1);
                    setCustomDays(newDays);
                    setSelectedDays(newDays);
                  }}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* 여행 요약 */}
          {startDate && selectedDays && (
            <div className="bg-primary-50 rounded-2xl p-6 border-2 border-primary-100">
              <h3 className="text-lg font-bold text-gray-900 mb-3">여행 요약</h3>
              <div className="space-y-2 text-gray-700">
                <div><span className="font-medium">목적지:</span> {state?.cityName}</div>
                <div><span className="font-medium">출발일:</span> {new Date(startDate).toLocaleDateString('ko-KR')}</div>
                <div><span className="font-medium">귀국일:</span> {calculateEndDate(startDate, selectedDays) && new Date(calculateEndDate(startDate, selectedDays)).toLocaleDateString('ko-KR')}</div>
                <div><span className="font-medium">여행 기간:</span> {selectedDays}일</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 shadow-lg z-50">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-3">
            {/* Back Button */}
            <button
              onClick={handleBack}
              className="flex items-center justify-center px-6 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              <span className="hidden md:inline">이전</span>
            </button>
            
            {/* Next Button */}
            <button
              onClick={handleNext}
              disabled={!isFormValid}
              className={`
                flex-1 flex items-center justify-center py-4 px-6 rounded-xl font-semibold text-lg transition-all
                ${isFormValid
                  ? 'text-white shadow-lg hover:shadow-xl'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }
              `}
              style={isFormValid ? { backgroundColor: '#52e3c2' } : {}}
            >
              <span>
                {isFormValid 
                  ? `${state?.cityName} 여행지 추천받기`
                  : '날짜와 기간을 선택해주세요'
                }
              </span>
              {isFormValid && (
                <ChevronRight className="w-5 h-5 ml-2" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}