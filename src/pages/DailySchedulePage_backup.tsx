import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Clock, MapPin, Plus, X, GripVertical, Map } from 'lucide-react';
import TripProgressStepper from '../components/TripProgressStepper';
import MapPanel from '../components/MapPanel';
import { auth } from '../firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import type { ItineraryItem } from '../types';

interface Place {
  id: string;
  placeName: string;
  category: string;
  image?: string;
  description?: string;
  lat?: number;
  lng?: number;
  addr?: string;
}

interface TripData {
  cityName: string;
  areaCode: string;
  startDate: string;
  endDate: string;
  days: number;
  selectedPlaces: Place[];
  dailySchedules?: { [key: number]: Place[] };
}

const DailySchedulePage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const locationState = location.state as { tripData?: TripData; isEdit?: boolean } | TripData;
  
  // 편집 모드인지 확인
  const isEditMode = locationState && 'isEdit' in locationState && locationState.isEdit;
  const tripData = isEditMode && locationState.tripData ? locationState.tripData : locationState as TripData;

  const [selectedDay, setSelectedDay] = useState(0);
  const [dailySchedules, setDailySchedules] = useState<{ [key: number]: Place[] }>({});
  const [unassignedPlaces, setUnassignedPlaces] = useState<Place[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [draggedPlace, setDraggedPlace] = useState<Place | null>(null);
  const [showMap, setShowMap] = useState(true);

  // Check authentication
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
      setIsAuthChecking(false);
      
      if (!user) {
        navigate('/login', { 
          state: { from: '/create-trip/schedule', message: '여행 일정을 만들려면 먼저 로그인해주세요.' } 
        });
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (!tripData && isAuthenticated) {
      navigate('/');
      return;
    }

    if (isAuthenticated && tripData) {
      console.log('🎯 DailySchedulePage - tripData:', tripData);
      console.log('📍 Selected places:', tripData.selectedPlaces);
      
      // 편집 모드인 경우 기존 일정 불러오기
      if (isEditMode && tripData.dailySchedules) {
        setDailySchedules(tripData.dailySchedules);
        
        // 미배치된 장소 계산
        const assignedPlaceIds = new Set<string>();
        Object.values(tripData.dailySchedules).forEach(places => {
          places.forEach(place => assignedPlaceIds.add(place.id));
        });
        
        const unassigned = (tripData.selectedPlaces || []).filter(
          place => !assignedPlaceIds.has(place.id)
        );
        console.log('✅ Edit mode - Unassigned places:', unassigned);
        setUnassignedPlaces(unassigned);
      } else {
        // 새로 만드는 경우
        const places = tripData.selectedPlaces || [];
        console.log('✅ New mode - Setting unassigned places:', places);
        setUnassignedPlaces(places);

        const initialSchedules: { [key: number]: Place[] } = {};
        for (let i = 0; i < tripData.days; i++) {
          initialSchedules[i] = [];
        }
        setDailySchedules(initialSchedules);
      }
    }
  }, [tripData, navigate, isAuthenticated, isEditMode]);

  const getDayDate = (dayIndex: number) => {
    const startDate = new Date(tripData.startDate);
    const dayDate = new Date(startDate);
    dayDate.setDate(startDate.getDate() + dayIndex);
    return dayDate.toLocaleDateString('ko-KR', { 
      month: 'long', 
      day: 'numeric',
      weekday: 'short'
    });
  };

  const addPlaceToDay = (place: Place, dayIndex: number) => {
    setUnassignedPlaces(prev => prev.filter(p => p.id !== place.id));
    
    setDailySchedules(prev => {
      const newSchedules = { ...prev };
      Object.keys(newSchedules).forEach(key => {
        newSchedules[Number(key)] = newSchedules[Number(key)].filter(p => p.id !== place.id);
      });
      
      newSchedules[dayIndex] = [...newSchedules[dayIndex], place];
      return newSchedules;
    });
  };

  const removePlaceFromDay = (place: Place, dayIndex: number) => {
    setDailySchedules(prev => ({
      ...prev,
      [dayIndex]: prev[dayIndex].filter(p => p.id !== place.id)
    }));
    
    setUnassignedPlaces(prev => [...prev, place]);
  };

  // 선택된 날짜의 장소들을 지도용 아이템으로 변환
  const mapItems = useMemo((): ItineraryItem[] => {
    const currentDayPlaces = dailySchedules[selectedDay] || [];
    return currentDayPlaces
      .filter(place => place.lat && place.lng)
      .map((place, index) => ({
        id: place.id,
        place: {
          id: place.id,
          name: place.placeName,
          address: place.addr || place.description || '',
          lat: place.lat!,
          lng: place.lng!,
          category: 'attraction' as const
        },
        arrivalTime: `${9 + index * 2}:00`,
        stayDurationMins: 120
      }));
  }, [dailySchedules, selectedDay]);

  const handleComplete = () => {
    const scheduleData = {
      ...tripData,
      dailySchedules
    };
    
    // currentTrip에 저장
    localStorage.setItem('currentTrip', JSON.stringify(scheduleData));
    
    // myTrips 배열에도 추가 (편집 모드가 아닌 경우에만)
    if (!isEditMode) {
      const myTripsData = localStorage.getItem('myTrips');
      const myTrips = myTripsData ? JSON.parse(myTripsData) : [];
      
      const newTrip = {
        id: `trip-${Date.now()}`,
        title: `${tripData.cityName} 여행`,
        city: tripData.cityName,
        startDate: tripData.startDate,
        endDate: tripData.endDate,
        days: tripData.days,
        itineraries: [],
        createdAt: new Date().toISOString()
      };
      
      const updatedTrips = [...myTrips, newTrip];
      localStorage.setItem('myTrips', JSON.stringify(updatedTrips));
    }
    
    navigate('/myplan');
  };

  if (isAuthChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#52e3c2] mx-auto mb-4"></div>
          <p className="text-gray-600">로그인 상태 확인 중...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !tripData) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white border-b shadow-sm">
        <div className="px-4 py-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <TripProgressStepper currentStep={4} />
          <div className="flex items-center justify-between mt-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {tripData.cityName} 여행 일정
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                {tripData.startDate} ~ {tripData.endDate} · {tripData.days}일
              </p>
            </div>
            <button
              onClick={() => setShowMap(!showMap)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50"
            >
              <Map className="w-4 h-4" />
              {showMap ? '지도 숨기기' : '지도 보기'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel: Schedule */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-4 py-6 mx-auto max-w-4xl">
            {/* Day Tabs */}
            <div className="flex mb-6 space-x-2 overflow-x-auto">
            {/* Day Tabs */}
            <div className="sticky p-4 space-y-3 bg-white border shadow-sm top-24 rounded-2xl">
              <h3 className="text-sm font-semibold text-gray-900">날짜 선택</h3>
              <div className="space-y-2">
                {Array.from({ length: tripData.days }).map((_, dayIndex) => (
                  <button
                    key={dayIndex}
                    onClick={() => setSelectedDay(dayIndex)}
                    className={`w-full text-left px-4 py-3 rounded-xl transition-all ${
                      selectedDay === dayIndex
                        ? 'bg-[#52e3c2] text-white shadow-md'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs font-medium opacity-90">Day {dayIndex + 1}</div>
                        <div className="text-sm">{getDayDate(dayIndex)}</div>
                      </div>
                      <div className="text-xs">
                        {dailySchedules[dayIndex]?.length || 0}개 장소
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Unassigned Places */}
            {unassignedPlaces.length > 0 && (
              <div className="p-4 mt-4 bg-white border shadow-sm rounded-2xl">
                <h3 className="mb-3 text-sm font-semibold text-gray-900">추가할 장소</h3>
                <div className="space-y-2">
                  {unassignedPlaces.map((place) => (
                    <div
                      key={place.id}
                      draggable
                      onDragStart={() => setDraggedPlace(place)}
                      onDragEnd={() => setDraggedPlace(null)}
                      onClick={() => addPlaceToDay(place, selectedDay)}
                      className="flex items-center p-3 space-x-3 transition-all border border-gray-200 cursor-move rounded-xl hover:border-[#52e3c2] hover:shadow-md bg-white"
                    >
                      <GripVertical className="w-4 h-4 text-gray-400" />
                      {place.image ? (
                        <img 
                          src={place.image} 
                          alt={place.placeName}
                          className="object-cover w-12 h-12 rounded-lg"
                        />
                      ) : (
                        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-lg">
                          <MapPin className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 truncate">
                          {place.placeName}
                        </h4>
                        <p className="text-xs text-gray-500">{place.category}</p>
                      </div>
                      <Plus className="w-5 h-5 text-[#52e3c2]" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: Timeline */}
          <div className="lg:col-span-8">
            <div className="p-6 bg-white border shadow-sm rounded-2xl">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Day {selectedDay + 1}
                </h2>
                <p className="text-sm text-gray-600">{getDayDate(selectedDay)}</p>
              </div>

              {/* Drop Zone */}
              <div 
                className="min-h-[400px]"
                onDrop={(e) => {
                  e.preventDefault();
                  if (draggedPlace) {
                    addPlaceToDay(draggedPlace, selectedDay);
                  }
                }}
                onDragOver={(e) => e.preventDefault()}
              >
                {dailySchedules[selectedDay]?.length > 0 ? (
                  <div className="space-y-4">
                    {dailySchedules[selectedDay].map((place, index) => (
                      <div key={place.id} className="relative">
                        {/* Timeline Connector */}
                        {index < dailySchedules[selectedDay].length - 1 && (
                          <div className="absolute left-[52px] top-20 w-0.5 h-8 bg-gray-200"></div>
                        )}

                        {/* Place Card */}
                        <div className="flex space-x-4">
                          {/* Time & Number */}
                          <div className="flex flex-col items-center pt-2">
                            <div className="flex items-center justify-center w-10 h-10 text-sm font-bold text-white rounded-full bg-[#52e3c2] shadow-md">
                              {index + 1}
                            </div>
                            <div className="mt-2 text-xs text-gray-500">
                              <Clock className="inline w-3 h-3 mr-1" />
                              2시간
                            </div>
                          </div>

                          {/* Card Content */}
                          <div className="flex-1 overflow-hidden transition-all border border-gray-200 rounded-2xl hover:shadow-lg">
                            {place.image && (
                              <img 
                                src={place.image} 
                                alt={place.placeName}
                                className="object-cover w-full h-48 bg-gray-100"
                              />
                            )}
                            <div className="p-4">
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex-1">
                                  <h3 className="text-lg font-bold text-gray-900">
                                    {place.placeName}
                                  </h3>
                                  <p className="mt-1 text-sm text-gray-500">
                                    {place.category}
                                  </p>
                                </div>
                                <button
                                  onClick={() => removePlaceFromDay(place, selectedDay)}
                                  className="p-2 text-gray-400 transition-colors rounded-full hover:bg-gray-100 hover:text-red-500"
                                >
                                  <X className="w-5 h-5" />
                                </button>
                              </div>
                              {place.description && (
                                <p className="text-sm text-gray-600 line-clamp-2">
                                  {place.description}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 border-2 border-gray-200 border-dashed rounded-2xl">
                    <MapPin className="w-16 h-16 mb-4 text-gray-300" />
                    <p className="mb-2 text-lg font-medium text-gray-900">일정을 추가해주세요</p>
                    <p className="text-sm text-gray-500">
                      왼쪽 목록에서 장소를 클릭하거나 드래그해주세요
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-30 p-4 bg-white border-t shadow-lg">
        <div className="flex gap-3 mx-auto max-w-7xl">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 text-gray-700 transition-colors bg-white border border-gray-300 rounded-xl hover:bg-gray-50"
          >
            이전
          </button>
          <button
            onClick={handleComplete}
            className="flex-1 px-6 py-3 text-white bg-[#52e3c2] rounded-xl hover:bg-[#45d4b3] transition-colors font-semibold shadow-lg"
          >
            일정 완성하기
          </button>
        </div>
      </div>

      <div className="h-24"></div>
    </div>
  );
};

export default DailySchedulePage;
