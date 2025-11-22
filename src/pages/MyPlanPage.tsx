import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, MapPin } from 'lucide-react';

export default function MyPlanPage() {
  const { t } = useTranslation();
  const [selectedDate] = useState(new Date());

  return (
    <div className="px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="mb-2 text-2xl font-bold text-gray-900">{t('myTravelPlans')}</h1>
        <p className="text-gray-600">{t('myPlan')}</p>
      </div>

      {/* Calendar & Itinerary Layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Calendar Section */}
        <div className="lg:col-span-1">
          <div className="p-6 bg-white border border-gray-200 rounded-lg">
            <h2 className="flex items-center mb-4 text-lg font-semibold text-gray-900">
              <CalendarIcon className="w-5 h-5 mr-2" />
              {t('calendar')}
            </h2>
            <div className="py-8 text-center">
              <div className="mb-2 text-4xl font-bold text-blue-600">
                {format(selectedDate, 'd')}
              </div>
              <div className="mb-1 text-lg text-gray-900">
                {format(selectedDate, 'yyyy년 M월')}
              </div>
              <div className="text-sm text-gray-500">
                {format(selectedDate, 'EEEE')}
              </div>
            </div>
          </div>
        </div>

        {/* Daily Itinerary Section */}
        <div className="lg:col-span-2">
          <div className="p-6 bg-white border border-gray-200 rounded-lg">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              {format(selectedDate, 'M월 d일')} {t('schedule')}
            </h2>

            {/* Empty State */}
            <div className="py-12 text-center">
              <MapPin className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <h3 className="mb-1 text-base font-medium text-gray-900">
                {t('noPlansYet')}
              </h3>
              <p className="mb-6 text-sm text-gray-500">
                {t('createFirstPlan')}
              </p>
              <button
                onClick={() => window.location.href = '/planner'}
                className="px-6 py-2 font-medium text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                {t('createTrip')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
