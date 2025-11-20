import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Clock, MapPin, Calendar } from 'lucide-react';
import { useItinerary } from '../contexts/useItinerary';
import type { Place, ItineraryItem, DailyItinerary } from '../types';
import { showToast } from '../components/Toast';

interface DaySchedule {
  day: number;
  date: string;
  places: Place[];
}

export default function DailySchedulePage() {
  const navigate = useNavigate();
  const { setItinerary } = useItinerary();
  const [tripData, setTripData] = useState<{city: string; cityName: string; startDate: string; endDate: string; days: number; title: string} | null>(null);
  const [selectedPlaces, setSelectedPlaces] = useState<Place[]>([]);
  const [daySchedules, setDaySchedules] = useState<DaySchedule[]>([]);
  const [selectedDay, setSelectedDay] = useState(1);

  useEffect(() => {
    const tripStr = sessionStorage.getItem('newTrip');
    const placesStr = sessionStorage.getItem('selectedPlaces');
    
    if (!tripStr || !placesStr) {
      navigate('/create-trip');
      return;
    }

    const trip = JSON.parse(tripStr);
    const places: Place[] = JSON.parse(placesStr);
    
    setTripData(trip);
    setSelectedPlaces(places);

    // Initialize day schedules
    const schedules: DaySchedule[] = [];
    for (let i = 0; i < trip.days; i++) {
      const date = new Date(trip.startDate);
      date.setDate(date.getDate() + i);
      schedules.push({
        day: i + 1,
        date: date.toISOString().slice(0, 10),
        places: [],
      });
    }
    setDaySchedules(schedules);
  }, [navigate]);

  const addPlaceToDay = (place: Place, day: number) => {
    const newSchedules = [...daySchedules];
    const dayIndex = day - 1;
    
    // Check if place already in this day
    if (newSchedules[dayIndex].places.find(p => p.id === place.id)) {
      showToast('이미 이 날짜에 추가된 장소입니다', 'warning');
      return;
    }

    newSchedules[dayIndex].places.push(place);
    setDaySchedules(newSchedules);
  };

  const removePlaceFromDay = (placeId: string, day: number) => {
    const newSchedules = [...daySchedules];
    newSchedules[day - 1].places = newSchedules[day - 1].places.filter(p => p.id !== placeId);
    setDaySchedules(newSchedules);
  };

  const isPlaceAdded = (placeId: string) => {
    return daySchedules.some(schedule => 
      schedule.places.some(p => p.id === placeId)
    );
  };

  const getTravelTime = (fromPlace: Place, toPlace: Place) => {
    // Simple distance calculation (Haversine formula)
    const R = 6371; // Earth radius in km
    const dLat = (toPlace.lat - fromPlace.lat) * Math.PI / 180;
    const dLon = (toPlace.lng - fromPlace.lng) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(fromPlace.lat * Math.PI / 180) * Math.cos(toPlace.lat * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    
    // Estimate time (assuming 30km/h average speed in city)
    const timeInHours = distance / 30;
    const timeInMins = Math.ceil(timeInHours * 60);
    
    return timeInMins;
  };

  const handleComplete = () => {
    if (!tripData) return;

    // Check if at least one day has places
    const hasPlaces = daySchedules.some(schedule => schedule.places.length > 0);
    if (!hasPlaces) {
      alert('최소 1개 날짜에 장소를 추가해주세요!');
      return;
    }

    // Create itinerary for the first day (can be extended later)
    const firstDay = daySchedules[0];
    const items: ItineraryItem[] = firstDay.places.map((place, index) => ({
      id: `item-${Date.now()}-${index}`,
      place,
      stayDurationMins: 60,
    }));

    const itinerary: DailyItinerary = {
      id: `trip-${Date.now()}`,
      title: tripData.title,
      date: tripData.startDate,
      items,
      transportMode: 'TRANSIT',
    };

    setItinerary(itinerary);
    
    // Clear session storage
    sessionStorage.removeItem('newTrip');
    sessionStorage.removeItem('selectedPlaces');

    showToast('여행 일정이 생성되었습니다!', 'success');
    
    // Navigate to trip detail
    setTimeout(() => {
      navigate(`/trip/${itinerary.id}`);
    }, 500);
  };

  const getUnassignedPlaces = () => {
    return selectedPlaces.filter(place => !isPlaceAdded(place.id));
  };

  if (!tripData) return null;

  const currentSchedule = daySchedules.find(s => s.day === selectedDay);
  const unassignedPlaces = getUnassignedPlaces();

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-teal-600">3 / 3 단계</span>
            <span className="text-sm text-gray-500">일정 구성</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-teal-500 rounded-full transition-all" style={{ width: '100%' }}></div>
          </div>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            하루 일정을 구성해보세요
          </h1>
          <p className="text-lg text-gray-600">
            장소를 날짜별로 배치하고 이동 시간을 확인하세요
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Unassigned Places */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 sticky top-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-teal-500" />
                선택한 장소 ({unassignedPlaces.length})
              </h2>
              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {unassignedPlaces.map((place) => (
                  <button
                    key={place.id}
                    onClick={() => addPlaceToDay(place, selectedDay)}
                    className="w-full text-left p-3 rounded-xl border border-gray-200 hover:border-primary-500 hover:bg-primary-50 transition-all group"
                  >
                    <div className="font-semibold text-gray-900 text-sm mb-1 group-hover:text-primary-700">
                      {place.name}
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                      {place.address}
                    </div>
                  </button>
                ))}
                {unassignedPlaces.length === 0 && (
                  <p className="text-center text-gray-500 py-8 text-sm">
                    모든 장소가 배치되었습니다
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Right: Day Schedule */}
          <div className="lg:col-span-2">
            {/* Day Tabs */}
            <div className="flex items-center space-x-2 mb-6 overflow-x-auto pb-2">
              {daySchedules.map((schedule) => (
                <button
                  key={schedule.day}
                  onClick={() => setSelectedDay(schedule.day)}
                  className={`flex items-center space-x-2 px-5 py-3 rounded-xl font-medium whitespace-nowrap transition-all ${
                    selectedDay === schedule.day
                      ? 'bg-teal-500 text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  <span>Day {schedule.day}</span>
                  {schedule.places.length > 0 && (
                    <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs">
                      {schedule.places.length}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Schedule List */}
            {currentSchedule && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    Day {currentSchedule.day} 일정
                  </h2>
                  <span className="text-sm text-gray-500">
                    {currentSchedule.date}
                  </span>
                </div>

                {currentSchedule.places.length === 0 ? (
                  <div className="text-center py-16">
                    <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">
                      왼쪽에서 장소를 선택하여 일정을 추가하세요
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {currentSchedule.places.map((place, index) => (
                      <div key={place.id}>
                        {/* Place Card */}
                        <div className="flex items-start space-x-4 p-4 rounded-xl bg-gray-50 border border-gray-200">
                          <div className="shrink-0 w-10 h-10 bg-teal-500 text-white rounded-full flex items-center justify-center font-bold">
                            {index + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-gray-900 mb-1">
                              {place.name}
                            </h3>
                            <p className="text-sm text-gray-600 truncate">
                              {place.address}
                            </p>
                          </div>
                          <button
                            onClick={() => removePlaceFromDay(place.id, currentSchedule.day)}
                            className="shrink-0 p-2 text-gray-400 hover:text-red-500 transition-colors"
                          >
                            ✕
                          </button>
                        </div>

                        {/* Travel Time */}
                        {index < currentSchedule.places.length - 1 && (
                          <div className="flex items-center space-x-2 py-3 px-12 text-sm text-gray-600">
                            <Clock className="w-4 h-4" />
                            <span>
                              이동시간: 약 {getTravelTime(place, currentSchedule.places[index + 1])}분
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Action Bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg p-4 z-10">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <button
              onClick={() => navigate('/create-trip/select-places')}
              className="flex items-center space-x-2 px-6 py-3 text-gray-700 hover:bg-gray-100 rounded-xl transition-colors font-medium"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>이전</span>
            </button>
            <button
              onClick={handleComplete}
              className="flex items-center space-x-2 px-8 py-3 bg-teal-500 text-white rounded-xl hover:bg-teal-600 transition-colors font-medium shadow-lg"
            >
              <Check className="w-5 h-5" />
              <span>일정 완성하기</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
