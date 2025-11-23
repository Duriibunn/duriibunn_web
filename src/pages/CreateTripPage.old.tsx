import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Calendar, MapPin, ArrowRight, Sparkles, Users, Heart } from 'lucide-react';

export default function CreateTripPage() {
  const { t } = useTranslation();
  
  const KOREAN_CITIES = [
    { id: 'gapyeong', nameKey: 'city_gapyeong', emoji: '🏞️', descKey: 'city_gapyeong_desc' },
    { id: 'yangpyeong', nameKey: 'city_yangpyeong', emoji: '🌳', descKey: 'city_yangpyeong_desc' },
    { id: 'gangneung', nameKey: 'city_gangneung', emoji: '☕', descKey: 'city_gangneung_desc' },
    { id: 'sokcho', nameKey: 'city_sokcho', emoji: '🦑', descKey: 'city_sokcho_desc' },
    { id: 'gyeongju', nameKey: 'city_gyeongju', emoji: '🏰', descKey: 'city_gyeongju_desc' },
    { id: 'busan', nameKey: 'city_busan', emoji: '🏖️', descKey: 'city_busan_desc' },
    { id: 'yeosu', nameKey: 'city_yeosu', emoji: '🌅', descKey: 'city_yeosu_desc' },
    { id: 'incheon', nameKey: 'city_incheon', emoji: '✈️', descKey: 'city_incheon_desc' },
    { id: 'jeonju', nameKey: 'city_jeonju', emoji: '🏛️', descKey: 'city_jeonju_desc' },
    { id: 'jeju', nameKey: 'city_jeju', emoji: '🌴', descKey: 'city_jeju_desc' },
    { id: 'chuncheon', nameKey: 'city_chuncheon', emoji: '🦆', descKey: 'city_chuncheon_desc' },
    { id: 'hongcheon', nameKey: 'city_hongcheon', emoji: '⛷️', descKey: 'city_hongcheon_desc' },
    { id: 'taean', nameKey: 'city_taean', emoji: '🏖️', descKey: 'city_taean_desc' },
    { id: 'tongyeong', nameKey: 'city_tongyeong', emoji: '🚡', descKey: 'city_tongyeong_desc' },
    { id: 'geoje', nameKey: 'city_geoje', emoji: '⚓', descKey: 'city_geoje_desc' },
    { id: 'namhae', nameKey: 'city_namhae', emoji: '🌊', descKey: 'city_namhae_desc' },
    { id: 'pohang', nameKey: 'city_pohang', emoji: '🌅', descKey: 'city_pohang_desc' },
    { id: 'andong', nameKey: 'city_andong', emoji: '🏛️', descKey: 'city_andong_desc' },
  ];

  const TRAVEL_COMPANIONS = [
    { id: 'solo', nameKey: 'companion_solo', emoji: '🧳' },
    { id: 'friends', nameKey: 'companion_friends', emoji: '👥' },
    { id: 'couple', nameKey: 'companion_couple', emoji: '💑' },
    { id: 'spouse', nameKey: 'companion_spouse', emoji: '💏' },
    { id: 'children', nameKey: 'companion_children', emoji: '👨‍👩‍👧' },
    { id: 'parents', nameKey: 'companion_parents', emoji: '👴👵' },
    { id: 'other', nameKey: 'companion_other', emoji: '👨‍👩‍👧‍👦' },
  ];

  const TRAVEL_STYLES = [
    { id: 'activity', nameKey: 'style_activity', emoji: '🎢' },
    { id: 'hotplace', nameKey: 'style_hotplace', emoji: '📸' },
    { id: 'nature', nameKey: 'style_nature', emoji: '🏞️' },
    { id: 'tourist', nameKey: 'style_tourist', emoji: '🗺️' },
    { id: 'healing', nameKey: 'style_healing', emoji: '🧘' },
    { id: 'culture', nameKey: 'style_culture', emoji: '🎨' },
    { id: 'local', nameKey: 'style_local', emoji: '🏘️' },
    { id: 'shopping', nameKey: 'style_shopping', emoji: '🛍️' },
    { id: 'food', nameKey: 'style_food', emoji: '🍜' },
  ];
  const navigate = useNavigate();
  const today = new Date().toISOString().slice(0, 10);
  const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
  
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(tomorrow);
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [tripTitle, setTripTitle] = useState('');
  const [companion, setCompanion] = useState<string>('');
  const [travelStyle, setTravelStyle] = useState<string[]>([]);

  const toggleTravelStyle = (styleId: string) => {
    if (travelStyle.includes(styleId)) {
      setTravelStyle(travelStyle.filter(s => s !== styleId));
    } else {
      setTravelStyle([...travelStyle, styleId]);
    }
  };

  const handleNext = () => {
    if (!selectedCity || !startDate || !endDate) {
      alert(t('fillAllFields'));
      return;
    }

    const city = KOREAN_CITIES.find(c => c.id === selectedCity);
    const cityName = city ? t(city.nameKey) : '';
    const areaCode = {
      'gapyeong': 31, 'yangpyeong': 31, 'gangneung': 32, 'sokcho': 32,
      'gyeongju': 35, 'busan': 6, 'yeosu': 38, 'incheon': 2,
      'jeonju': 37, 'jeju': 39, 'chuncheon': 32, 'hongcheon': 32,
      'taean': 34, 'tongyeong': 36, 'geoje': 36, 'namhae': 36,
      'pohang': 35, 'andong': 35
    }[selectedCity] || 1;
    const days = Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / 86400000) + 1;

    // Navigate to recommendations page with all trip info
    navigate('/trip/recommendations', {
      state: {
        cityName,
        areaCode,
        startDate,
        endDate,
        days,
        title: tripTitle || `${cityName} ${days}${t('daysTrip')}`,
        companion,
        travelStyle,
      }
    });
  };

  const getDayCount = () => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diff = Math.ceil((end.getTime() - start.getTime()) / 86400000) + 1;
    return diff > 0 ? diff : 1;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-teal-600">{t('step1Of3')}</span>
            <span className="text-sm text-gray-500">{t('selectDateAndCity')}</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-teal-500 rounded-full" style={{ width: '33%' }}></div>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-100 rounded-2xl mb-4">
            <Sparkles className="w-8 h-8 text-teal-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            {t('createTripTitle')}
          </h1>
          <p className="text-lg text-gray-600">
            {t('createTripDesc')}
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-6">
          {/* Trip Title */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              {t('tripTitleOptional')}
            </label>
            <input
              type="text"
              value={tripTitle}
              onChange={(e) => setTripTitle(e.target.value)}
              placeholder={t('tripTitlePlaceholder')}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base text-gray-900 placeholder:text-gray-400"
            />
          </div>

          {/* Date Selection */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              <Calendar className="inline w-4 h-4 mr-1" />
              {t('travelPeriod')}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-600 mb-2">{t('departureDate')}</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base text-gray-900"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-2">{t('returnDate')}</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  min={startDate}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base text-gray-900"
                />
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              {t('totalDays')} <span className="font-semibold text-teal-600">{getDayCount()}{t('daysTrip')}</span>
            </p>
          </div>

          {/* City Selection */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              <MapPin className="inline w-4 h-4 mr-1" />
              {t('travelCity')}
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {KOREAN_CITIES.map((city) => (
                <button
                  key={city.id}
                  onClick={() => setSelectedCity(city.id)}
                  className={`p-4 rounded-xl border-2 transition-all text-center ${
                    selectedCity === city.id
                      ? 'border-teal-500 bg-teal-50 shadow-md'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="text-3xl mb-2">{city.emoji}</div>
                  <div className="font-semibold text-gray-900 mb-1">{t(city.nameKey)}</div>
                  <div className="text-xs text-gray-500 leading-tight">{t(city.descKey)}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Travel Companion */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              <Users className="inline w-4 h-4 mr-1" />
              {t('travelWithOptional')}
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2">
              {TRAVEL_COMPANIONS.map((comp) => (
                <button
                  key={comp.id}
                  onClick={() => setCompanion(comp.id)}
                  className={`p-3 rounded-xl border-2 transition-all text-center ${
                    companion === comp.id
                      ? 'border-teal-500 bg-teal-50 shadow-md'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="text-2xl mb-1">{comp.emoji}</div>
                  <div className="text-xs font-medium text-gray-900">{t(comp.nameKey)}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Travel Style */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              <Heart className="inline w-4 h-4 mr-1" />
              {t('travelStyleMultiple')}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {TRAVEL_STYLES.map((style) => (
                <button
                  key={style.id}
                  onClick={() => toggleTravelStyle(style.id)}
                  className={`p-3 rounded-xl border-2 transition-all text-left flex items-center space-x-2 ${
                    travelStyle.includes(style.id)
                      ? 'border-teal-500 bg-teal-50 shadow-md'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <span className="text-xl">{style.emoji}</span>
                  <span className="text-sm font-medium text-gray-900">{t(style.nameKey)}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 text-gray-600 hover:text-gray-900 font-medium transition-colors"
          >
            {t('cancel')}
          </button>
          <button
            onClick={handleNext}
            disabled={!selectedCity}
            className="flex items-center space-x-2 px-8 py-3 bg-teal-500 text-white rounded-xl hover:bg-teal-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
          >
            <span>{t('next')}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
