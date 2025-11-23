import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Calendar, MapPin, GripVertical, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { createTrip } from '../firebase/trips';
import { auth } from '../firebase/config';

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
}

export default function DailySchedulePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState;
  const { t } = useTranslation();

  const [unassigned, setUnassigned] = useState<Place[]>([]);
  const [dailySchedules, setDailySchedules] = useState<{ [key: number]: Place[] }>({});
  const [selectedDay, setSelectedDay] = useState(0);
  const [draggedItem, setDraggedItem] = useState<{ place: Place; from: 'unassigned' | number } | null>(null);

  useEffect(() => {
    if (!state || !state.selectedPlaces) {
      navigate('/create-trip');
      return;
    }

    // 초기화
    setUnassigned(state.selectedPlaces);
    const initial: { [key: number]: Place[] } = {};
    for (let i = 0; i < state.days; i++) {
      initial[i] = [];
    }
    setDailySchedules(initial);
  }, [state, navigate]);

  if (!state) return null;

  const { startDate, endDate, days } = state;

  const getDayLabel = (dayIndex: number) => {
    const date = new Date(startDate);
    date.setDate(date.getDate() + dayIndex);
    return `Day ${dayIndex + 1} (${date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })})`;
  };

  // 드래그 시작
  const handleDragStart = (place: Place, from: 'unassigned' | number) => {
    setDraggedItem({ place, from });
  };

  // 드롭 처리
  const handleDrop = (to: 'unassigned' | number) => {
    if (!draggedItem) return;

    const { place, from } = draggedItem;

    // 같은 곳에 드롭하면 무시
    if (from === to) {
      setDraggedItem(null);
      return;
    }

    // from에서 제거
    if (from === 'unassigned') {
      setUnassigned(prev => prev.filter(p => p.id !== place.id));
    } else {
      setDailySchedules(prev => ({
        ...prev,
        [from]: prev[from].filter(p => p.id !== place.id),
      }));
    }

    // to에 추가
    if (to === 'unassigned') {
      setUnassigned(prev => [...prev, place]);
    } else {
      setDailySchedules(prev => ({
        ...prev,
        [to]: [...prev[to], place],
      }));
    }

    setDraggedItem(null);
  };

  // 장소 삭제
  const removePlace = (dayIndex: number, placeId: string) => {
    const place = dailySchedules[dayIndex].find(p => p.id === placeId);
    if (place) {
      setDailySchedules(prev => ({
        ...prev,
        [dayIndex]: prev[dayIndex].filter(p => p.id !== placeId),
      }));
      setUnassigned(prev => [...prev, place]);
    }
  };

  const handleNext = async () => {
    // 모든 장소가 배치되었는지 확인
    const totalAssigned = Object.values(dailySchedules).reduce((sum, places) => sum + places.length, 0);
    
    if (totalAssigned === 0) {
      alert(t('selectAtLeastOnePlace'));
      return;
    }

    const newTripData = {
      title: `${state.cityName} 여행`,
      cityName: state.cityName,
      startDate: state.startDate,
      endDate: state.endDate,
      days: state.days,
      dailySchedules,
    };

    // 일단 localStorage에 저장 (Firebase는 나중에)
    const tripId = `trip-${Date.now()}`;
    const newTrip = {
      id: tripId,
      ...newTripData,
      createdAt: Date.now(),
    };
    
    const existingTrips = localStorage.getItem('myTrips');
    const trips = existingTrips ? JSON.parse(existingTrips) : [];
    trips.push(newTrip);
    localStorage.setItem('myTrips', JSON.stringify(trips));
    
    // 상세 페이지로 이동
    navigate(`/trip/${tripId}`, { replace: true });
  };

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
            {t('previous')}
          </button>
          <div className="mb-4">
            <span className="px-3 py-1 text-sm font-bold text-gray-900 bg-white rounded-full">
              {t('step3Of3')}
            </span>
          </div>
          <h1 className="mb-2 text-3xl font-bold text-gray-900">
            {t('arrangeSchedule')}
          </h1>
          <p className="text-gray-800">
            {t('arrangePlacesByDay')}
          </p>
          <div className="flex items-center gap-2 mt-2 text-sm font-medium text-gray-900">
            <Calendar className="w-4 h-4" />
            {startDate} ~ {endDate} ({days}일)
          </div>
        </div>
      </div>

      <div className="max-w-6xl px-4 py-8 mx-auto sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left: Day Tabs + Schedule */}
          <div className="lg:col-span-2">
            {/* Day Tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto">
              {Array.from({ length: days }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedDay(i)}
                  className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                    selectedDay === i
                      ? 'bg-primary-400 text-gray-900 border-2 border-primary-600'
                      : 'bg-white text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {getDayLabel(i)}
                </button>
              ))}
            </div>

            {/* Schedule Drop Zone */}
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(selectedDay)}
              className="min-h-[400px] p-6 bg-white border-2 border-dashed border-gray-300 rounded-xl"
            >
              <h3 className="mb-4 text-lg font-bold text-gray-900">
                {getDayLabel(selectedDay)} {t('scheduleLabel')}
              </h3>
              {dailySchedules[selectedDay]?.length === 0 ? (
                <div className="flex items-center justify-center py-20 text-gray-400">
                  <div className="text-center">
                    <MapPin className="w-12 h-12 mx-auto mb-2" />
                    <p>{t('dragToAdd')}</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {dailySchedules[selectedDay]?.map((place, index) => (
                    <div
                      key={place.id}
                      draggable
                      onDragStart={() => handleDragStart(place, selectedDay)}
                      className="flex items-center gap-4 p-4 transition-shadow bg-white border border-gray-200 cursor-move rounded-xl hover:shadow-md"
                    >
                      <GripVertical className="w-5 h-5 text-gray-400" />
                      <div className="flex items-center justify-center w-8 h-8 font-bold text-white rounded-full bg-primary-600">
                        {index + 1}
                      </div>
                      {place.image && (
                        <img
                          src={place.image}
                          alt={place.name}
                          className="object-cover w-16 h-16 rounded-lg"
                        />
                      )}
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{place.name}</h4>
                        <p className="text-sm text-gray-500">{place.category}</p>
                      </div>
                      <button
                        onClick={() => removePlace(selectedDay, place.id)}
                        className="p-2 text-red-500 transition-colors rounded-lg hover:bg-red-50"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right: Unassigned Places */}
          <div>
            <div className="sticky top-4">
              <h3 className="mb-4 text-lg font-bold text-gray-900">
                {t('unassignedPlaces')} ({unassigned.length})
              </h3>
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDrop('unassigned')}
                className="p-4 bg-white border-2 border-dashed border-gray-300 rounded-xl max-h-[600px] overflow-y-auto"
              >
                {unassigned.length === 0 ? (
                  <div className="py-10 text-center text-gray-400">
                    <p className="text-sm">모든 장소가 배치되었습니다</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {unassigned.map((place) => (
                      <div
                        key={place.id}
                        draggable
                        onDragStart={() => handleDragStart(place, 'unassigned')}
                        className="p-3 transition-shadow bg-white border border-gray-200 rounded-lg cursor-move hover:shadow-md"
                      >
                        {place.image && (
                          <img
                            src={place.image}
                            alt={place.name}
                            className="object-cover w-full h-32 mb-2 rounded-lg"
                          />
                        )}
                        <h4 className="font-semibold text-gray-900 line-clamp-1">{place.name}</h4>
                        <p className="text-xs text-gray-500 line-clamp-1">{place.category}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t shadow-lg">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {t('assignedPlaces')}: {Object.values(dailySchedules).reduce((sum, places) => sum + places.length, 0)} / {state.selectedPlaces.length}
            </div>
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-3 font-semibold text-gray-900 transition-colors rounded-xl bg-primary-400 hover:bg-primary-500"
            >
              {t('finishItinerary')}
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
