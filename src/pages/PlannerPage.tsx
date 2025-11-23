import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, MapPin, Navigation, Car, Footprints } from 'lucide-react';

interface Place {
  id: string;
  name: string;
  category: string;
  image?: string;
  address?: string;
  lat?: number;
  lng?: number;
}

interface LocationState {
  cityName: string;
  areaCode: number;
  startDate: string;
  endDate: string;
  days: number;
  companion?: string;
  travelStyle?: string[];
  selectedPlaces: Place[];
  dailySchedules: { [key: number]: Place[] };
}

type TransportMode = 'walking' | 'driving' | 'transit';

export default function PlannerPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState;

  const [selectedDay, setSelectedDay] = useState(0);
  const [transportMode, setTransportMode] = useState<TransportMode>('walking');

  if (!state || !state.dailySchedules) {
    navigate('/create-trip');
    return null;
  }

  const { cityName, startDate, endDate, days, dailySchedules } = state;

  const getDayLabel = (dayIndex: number) => {
    const date = new Date(startDate);
    date.setDate(date.getDate() + dayIndex);
    return `Day ${dayIndex + 1} (${date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })})`;
  };

  const handleSaveTrip = () => {
    // localStorage에 여행 저장
    const tripId = `trip_${Date.now()}`;
    const trip = {
      id: tripId,
      title: `${cityName} 여행`,
      cityName,
      startDate,
      endDate,
      days,
      dailySchedules,
      createdAt: Date.now(),
    };

    const existingTrips = localStorage.getItem('myTrips');
    const trips = existingTrips ? JSON.parse(existingTrips) : [];
    trips.unshift(trip);
    localStorage.setItem('myTrips', JSON.stringify(trips));

    // TripDetailPage로 이동
    navigate(`/trip/${tripId}`, { state: { trip } });
  };

  const currentPlaces = dailySchedules[selectedDay] || [];

  return (
    <div className="min-h-screen pb-24 bg-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200">
        <div className="max-w-6xl px-4 py-6 mx-auto sm:px-6 lg:px-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center mb-4 text-gray-900 hover:text-gray-700"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            이전
          </button>
          <div className="mb-4">
            <span className="px-3 py-1 text-sm font-bold text-gray-900 bg-white rounded-full">
              4단계
            </span>
          </div>
          <h1 className="mb-2 text-3xl font-bold text-gray-900">
            지도에서 확인하기
          </h1>
          <p className="text-gray-800">
            일정을 지도에서 확인하고 이동 수단을 선택하세요
          </p>
        </div>
      </div>

      <div className="max-w-6xl px-4 py-8 mx-auto sm:px-6 lg:px-8">
        {/* Day Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {Array.from({ length: days }, (_, i) => (
            <button
              key={i}
              onClick={() => setSelectedDay(i)}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                selectedDay === i
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {getDayLabel(i)}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left: Map Area (Placeholder) */}
          <div className="lg:col-span-2">
            <div className="p-6 bg-white border-2 shadow-sm border-primary-200 rounded-xl">
              <div className="mb-4">
                <h3 className="text-lg font-bold text-gray-900">
                  {getDayLabel(selectedDay)} 경로
                </h3>
                <p className="text-sm text-gray-600">
                  {currentPlaces.length}개 장소
                </p>
              </div>

              {/* Transport Mode Selector */}
              <div className="flex gap-2 mb-6">
                <button
                  onClick={() => setTransportMode('walking')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    transportMode === 'walking'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Footprints className="w-4 h-4" />
                  도보
                </button>
                <button
                  onClick={() => setTransportMode('driving')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    transportMode === 'driving'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Car className="w-4 h-4" />
                  자동차
                </button>
                <button
                  onClick={() => setTransportMode('transit')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    transportMode === 'transit'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Navigation className="w-4 h-4" />
                  대중교통
                </button>
              </div>

              {/* Map Placeholder */}
              <div className="flex items-center justify-center bg-gray-100 h-96 rounded-xl">
                <div className="text-center text-gray-500">
                  <MapPin className="w-16 h-16 mx-auto mb-4" />
                  <p className="text-lg font-medium">지도 영역</p>
                  <p className="text-sm">카카오맵 API 연동 예정</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Places List */}
          <div>
            <div className="sticky top-4">
              <div className="p-6 bg-white border-2 border-blue-200 shadow-sm rounded-xl">
                <h3 className="mb-4 text-lg font-bold text-gray-900">
                  방문 순서
                </h3>
                {currentPlaces.length === 0 ? (
                  <div className="py-10 text-center text-gray-400">
                    <p className="text-sm">이 날은 일정이 없습니다</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {currentPlaces.map((place, index) => (
                      <div
                        key={place.id}
                        className="flex items-center gap-3 p-3 rounded-lg bg-gray-50"
                      >
                        <div className="flex items-center justify-center w-8 h-8 font-bold text-white rounded-full bg-primary-600">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 line-clamp-1">
                            {place.name}
                          </h4>
                          <p className="text-xs text-gray-500 line-clamp-1">
                            {place.category}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="pt-4 mt-4 border-t">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>이동 수단</span>
                    <span className="font-medium">
                      {transportMode === 'walking' ? '도보' :
                       transportMode === 'driving' ? '자동차' : '대중교통'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t-4 shadow-xl border-primary-500">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={handleSaveTrip}
            className="flex items-center justify-center w-full gap-2 px-6 py-4 text-lg font-bold text-white transition-all rounded-xl bg-primary-600 hover:bg-primary-700 hover:shadow-lg"
          >
            일정 저장하기
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
