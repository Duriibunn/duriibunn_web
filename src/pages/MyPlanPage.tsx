import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Calendar, MapPin, Trash2, Plus, Clock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getUserTrips, deleteTrip as deleteFirebaseTrip } from '../firebase/trips';

interface Place {
  id: string;
  name: string;
  category: string;
  image?: string;
  address?: string;
  lat?: number;
  lng?: number;
}

interface Trip {
  id: string;
  userId: string;
  title: string;
  cityName: string;
  startDate: string;
  endDate: string;
  days: number;
  dailySchedules: { [key: number]: Place[] };
  createdAt: number;
  updatedAt?: number;
}

export default function MyPlanPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [myTrips, setMyTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/myplan' } });
      return;
    }
    
    loadTrips();
  }, [isAuthenticated, navigate]);

  const loadTrips = async () => {
    try {
      setLoading(true);
      const trips = await getUserTrips();
      setMyTrips(trips);
    } catch (error) {
      console.error('Failed to load trips:', error);
      // Fallback to localStorage for development
      const storedTrips = localStorage.getItem('myTrips');
      if (storedTrips) {
        const trips: Trip[] = JSON.parse(storedTrips);
        setMyTrips(trips.sort((a, b) => b.createdAt - a.createdAt));
      }
    } finally {
      setLoading(false);
    }
  };

  const deleteTrip = async (tripId: string) => {
    if (!confirm(t('confirmDeleteTrip'))) return;

    try {
      await deleteFirebaseTrip(tripId);
      setMyTrips(myTrips.filter(trip => trip.id !== tripId));
    } catch (error) {
      console.error('Failed to delete trip:', error);
      // Fallback to localStorage
      const updatedTrips = myTrips.filter(trip => trip.id !== tripId);
      setMyTrips(updatedTrips);
      localStorage.setItem('myTrips', JSON.stringify(updatedTrips));
    }
  };

  const getTotalPlaces = (trip: Trip) => {
    return Object.values(trip.dailySchedules).reduce((sum, places) => sum + places.length, 0);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-t-4 border-gray-200 rounded-full border-t-primary-600 animate-spin"></div>
          <p className="text-gray-600">{t('loadingTrip')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl px-4 py-8 mx-auto sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="mb-2 text-3xl font-bold text-gray-900">
                {t('myTravelPlans')}
              </h1>
              <p className="text-gray-600">
                {t('manageSavedTrips')}
              </p>
            </div>
            <div className="flex gap-2">
              {myTrips.length > 0 && (
                <button
                  onClick={() => {
                    if (confirm('모든 여행 일정을 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.')) {
                      localStorage.removeItem('myTrips');
                      localStorage.removeItem('currentTrip');
                      setMyTrips([]);
                    }
                  }}
                  className="flex items-center gap-2 px-4 py-2 font-semibold text-red-600 transition-colors bg-red-50 rounded-lg hover:bg-red-100"
                >
                  <Trash2 className="w-5 h-5" />
                  모두 삭제
                </button>
              )}
              <button
                onClick={() => navigate('/create-trip')}
                className="flex items-center gap-2 px-4 py-2 font-semibold text-white transition-colors rounded-lg bg-primary-600 hover:bg-primary-700"
              >
                <Plus className="w-5 h-5" />
                {t('newTrip')}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl px-4 py-8 mx-auto sm:px-6 lg:px-8">
        {myTrips.length === 0 ? (
          <div className="py-20 text-center">
            <div className="mb-6 text-6xl">✈️</div>
            <h2 className="mb-3 text-2xl font-bold text-gray-900">
              {t('noTripsYet')}
            </h2>
            <p className="mb-6 text-gray-600">
              {t('planNewTrip')}
            </p>
            <button
              onClick={() => navigate('/create-trip')}
              className="inline-flex items-center gap-2 px-6 py-3 font-semibold text-white transition-colors rounded-lg bg-primary-600 hover:bg-primary-700"
            >
              <Plus className="w-5 h-5" />
              {t('createTravelPlan')}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {myTrips.map((trip) => (
              <div
                key={trip.id}
                className="overflow-hidden transition-shadow bg-white border border-gray-200 cursor-pointer rounded-xl hover:shadow-md"
                onClick={() => navigate(`/trip/${trip.id}`, { state: { trip } })}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="mb-2 text-xl font-bold text-gray-900">
                        {trip.title}
                      </h3>
                      <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{trip.cityName}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {new Date(trip.startDate).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })}
                            {' - '}
                            {new Date(trip.endDate).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{trip.days}{t('tripDays')}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteTrip(trip.id);
                      }}
                      className="p-2 text-gray-400 transition-colors rounded-lg hover:text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-4 pt-4 border-t">
                    <div className="flex items-center gap-2">
                      <div className="px-3 py-1 text-sm font-medium rounded-full bg-primary-100 text-primary-700">
                        {getTotalPlaces(trip)}{t('tripPlacesCount')}
                      </div>
                      {trip.days > 0 && (
                        <div className="px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 rounded-full">
                          {trip.days}{t('tripSchedule')}
                        </div>
                      )}
                    </div>
                    <div className="ml-auto text-sm text-gray-500">
                      {new Date(trip.createdAt).toLocaleDateString('ko-KR', { 
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })} {t('createdOn')}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
