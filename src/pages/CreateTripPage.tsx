import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { AREA_CODES } from '../utils/publicDataApi';

const CITIES = [
  { name: '서울', emoji: '🏙️' },
  { name: '부산', emoji: '🏖️' },
  { name: '제주', emoji: '🌴' },
  { name: '인천', emoji: '✈️' },
];

export default function CreateTripPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(tomorrow);
  const [city, setCity] = useState('');

  const calculateDays = () => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return Math.ceil((end.getTime() - start.getTime()) / 86400000) + 1;
  };

  const handleNext = () => {
    if (!city || !startDate || !endDate) {
      alert(t('fillAllFields'));
      return;
    }

    const areaCode = AREA_CODES[city];
    const days = calculateDays();

    navigate('/trip/recommendations', {
      state: {
        cityName: city,
        areaCode,
        startDate,
        endDate,
        days,
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200">
        <div className="max-w-4xl px-4 py-8 mx-auto sm:px-6 lg:px-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">
            {t('createTripTitle')}
          </h1>
          <p className="text-gray-600">
            {t('createTripDesc')}
          </p>
        </div>
      </div>

      <div className="max-w-4xl px-4 py-12 mx-auto sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* 1. 날짜 선택 */}
          <section className="p-6 bg-white border-2 border-blue-200 shadow-md rounded-xl">
            <div className="flex items-center mb-4">
              <Calendar className="w-6 h-6 mr-2 text-blue-600" />
              <div>
                <h2 className="text-xl font-bold text-gray-900">{t('travelDates')}</h2>
                <p className="text-sm text-gray-600">{t('whenLeavingQuestion')}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  {t('departureDate')}
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  min={today}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  {t('arrivalDate')}
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  min={startDate}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
            {startDate && endDate && (
              <div className="p-3 mt-4 rounded-lg bg-primary-50">
                <p className="font-medium text-primary-700">
                  {t('totalDays')} {calculateDays()}{t('daySchedule')}
                </p>
              </div>
            )}
          </section>

          {/* 2. 지역 선택 */}
          <section className="p-6 bg-white border-2 border-green-200 shadow-md rounded-xl">
            <div className="flex items-center mb-4">
              <MapPin className="w-6 h-6 mr-2 text-green-600" />
              <div>
                <h2 className="text-xl font-bold text-gray-900">{t('travelRegion')}</h2>
                <p className="text-sm text-gray-600">{t('whereGoing')}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {CITIES.map((c) => (
                <button
                  key={c.name}
                  onClick={() => setCity(c.name)}
                  className={`p-4 border-2 rounded-xl transition-all ${
                    city === c.name
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="mb-2 text-3xl">{c.emoji}</div>
                  <div className="font-medium">{c.name}</div>
                </button>
              ))}
            </div>
          </section>

        </div>

        {/* 다음 버튼 */}
        <div className="sticky bottom-0 pt-6 pb-6 mt-8 -mx-4 bg-white shadow-2xl sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
          <button
            onClick={handleNext}
            disabled={!city || !startDate || !endDate}
            className="flex items-center justify-center w-full gap-2 px-6 py-4 text-lg font-bold text-gray-900 transition-all shadow-lg rounded-xl bg-primary-400 hover:bg-primary-500 hover:shadow-xl disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {t('nextGetRecommendations')}
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
