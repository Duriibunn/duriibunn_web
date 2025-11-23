import { useTranslation } from 'react-i18next';
import { Calendar, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface TripCardProps {
  trip: {
    id: string;
    title?: string;
    city?: string;
    startDate?: string;
    endDate?: string;
    days?: number;
    progress?: number;
    status?: 'preparation' | 'ongoing' | 'completed';
  };
}

export default function CurrentTripCard({ trip }: TripCardProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const getDDay = () => {
    if (!trip.startDate) return null;
    const start = new Date(trip.startDate);
    const today = new Date();
    const diff = Math.ceil((start.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diff < 0) return t('onTrip');
    return t('dDay', { days: diff });
  };

  const getProgressColor = () => {
    if (!trip.progress) return 'bg-gray-200';
    if (trip.progress < 30) return 'bg-red-400';
    if (trip.progress < 70) return 'bg-yellow-400';
    return 'bg-primary-500';
  };

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
      <div className="md:flex">
        {/* Image Section */}
        <div className="md:w-2/5 bg-gradient-to-br from-primary-100 to-primary-200 aspect-video md:aspect-auto min-h-[200px] flex items-center justify-center">
          <MapPin className="w-20 h-20 text-primary-500" />
        </div>

        {/* Content Section */}
        <div className="md:w-3/5 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">
              {trip.title || trip.city || t('myCurrentTrip')}
            </h2>
            {getDDay() && (
              <span className="px-4 py-1 bg-primary-100 text-primary-600 rounded-full text-sm font-semibold">
                {getDDay()}
              </span>
            )}
          </div>

          {/* Date Range */}
          {trip.startDate && (
            <div className="flex items-center gap-2 text-gray-600 mb-3">
              <Calendar className="w-5 h-5" />
              <span>
                {new Date(trip.startDate).toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
                {trip.endDate && ` - ${new Date(trip.endDate).toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })}`}
              </span>
            </div>
          )}

          {/* City */}
          {trip.city && (
            <div className="flex items-center gap-2 text-gray-600 mb-4">
              <MapPin className="w-5 h-5" />
              <span>{trip.city}</span>
            </div>
          )}

          {/* Progress Bar */}
          {trip.progress !== undefined && (
            <div className="mb-4">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                <span>{t('progressLabel')}</span>
                <span>{trip.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${getProgressColor()}`}
                  style={{ width: `${trip.progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={() => navigate(`/trip/${trip.id}`)}
              className="flex-1 px-6 py-3 text-white rounded-xl transition-colors font-semibold shadow-md hover:shadow-lg"
              style={{ backgroundColor: '#52e3c2' }}
            >
              {t('viewTripItinerary')}
            </button>
            <button
              onClick={() => navigate(`/planner?tripId=${trip.id}`)}
              className="flex-1 px-6 py-3 border-2 border-primary-500 text-primary-500 rounded-xl hover:bg-primary-50 transition-colors font-semibold"
            >
              {t('viewFullRoute')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
