import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, MapPin, Clock, Trash2, Eye } from 'lucide-react';
import { showToast } from '../hooks/toastManager';

interface SavedTrip {
  id: string;
  title: string;
  city: string;
  startDate: string;
  endDate: string;
  days: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  itineraries: any[];
  createdAt: string;
}

export default function MyPlanPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [selectedDate] = useState(new Date());
  const [myTrips, setMyTrips] = useState<SavedTrip[]>([]);

  useEffect(() => {
    loadTrips();
  }, []);

  const loadTrips = () => {
    const tripsData = localStorage.getItem('myTrips');
    if (tripsData) {
      const trips = JSON.parse(tripsData);
      setMyTrips(trips);
    }
  };

  const deleteTrip = (tripId: string) => {
    if (!confirm('이 여행 일정을 삭제하시겠습니까?')) return;
    
    const trips = myTrips.filter(t => t.id !== tripId);
    localStorage.setItem('myTrips', JSON.stringify(trips));
    setMyTrips(trips);
    showToast('여행 일정이 삭제되었습니다', 'success');
  };

  const viewTrip = (trip: SavedTrip) => {
    // 첫 번째 날짜의 일정으로 이동
    if (trip.itineraries && trip.itineraries.length > 0) {
      navigate(`/trip/${trip.itineraries[0].id}`);
    }
  };

  const getTotalPlaces = (trip: SavedTrip) => {
    return trip.itineraries.reduce((total, itinerary) => {
      return total + (itinerary.items?.length || 0);
    }, 0);
  };

  return (
    <div className="px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">{t('myTravelPlans')}</h1>
        <p className="text-lg text-gray-600">저장된 여행 일정을 확인하고 관리하세요</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Calendar Section */}
        <div className="lg:col-span-1">
          <div className="p-6 bg-white border border-gray-200 rounded-2xl sticky top-6">
            <h2 className="flex items-center mb-4 text-lg font-semibold text-gray-900">
              <CalendarIcon className="w-5 h-5 mr-2 text-blue-500" />
              {t('calendar')}
            </h2>
            <div className="py-8 text-center bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
              <div className="mb-2 text-5xl font-bold text-blue-600">
                {format(selectedDate, 'd')}
              </div>
              <div className="mb-1 text-xl font-semibold text-gray-900">
                {format(selectedDate, 'yyyy년 M월')}
              </div>
              <div className="text-sm text-gray-600">
                {format(selectedDate, 'EEEE')}
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
              <div className="text-sm font-semibold text-blue-900 mb-2">
                전체 일정
              </div>
              <div className="text-2xl font-bold text-blue-600">
                {myTrips.length}개
              </div>
            </div>
          </div>
        </div>

        {/* Trips List */}
        <div className="lg:col-span-2">
          {myTrips.length === 0 ? (
            <div className="p-12 bg-white border border-gray-200 rounded-2xl text-center">
              <MapPin className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="mb-2 text-xl font-bold text-gray-900">
                {t('noPlansYet')}
              </h3>
              <p className="mb-6 text-gray-500">
                {t('createFirstPlan')}
              </p>
              <button
                onClick={() => navigate('/create-trip')}
                className="px-6 py-3 font-semibold text-white transition-colors bg-blue-600 rounded-xl hover:bg-blue-700"
              >
                {t('createTrip')}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {myTrips.map((trip) => (
                <div
                  key={trip.id}
                  className="p-6 bg-white border border-gray-200 rounded-2xl hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {trip.title}
                      </h3>
                      <div className="flex items-center text-sm text-gray-600 space-x-4">
                        <span className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {trip.city}
                        </span>
                        <span className="flex items-center">
                          <CalendarIcon className="w-4 h-4 mr-1" />
                          {format(new Date(trip.startDate), 'M월 d일')} - {format(new Date(trip.endDate), 'M월 d일')}
                        </span>
                        <span className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {trip.days}일
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4 p-4 bg-gray-50 rounded-xl">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-blue-600">
                          {trip.days}
                        </div>
                        <div className="text-xs text-gray-600">일정</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-teal-600">
                          {getTotalPlaces(trip)}
                        </div>
                        <div className="text-xs text-gray-600">장소</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-purple-600">
                          {trip.itineraries.length}
                        </div>
                        <div className="text-xs text-gray-600">일차</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => viewTrip(trip)}
                      className="flex-1 flex items-center justify-center space-x-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
                    >
                      <Eye className="w-4 h-4" />
                      <span>일정 보기</span>
                    </button>
                    <button
                      onClick={() => deleteTrip(trip.id)}
                      className="px-4 py-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
