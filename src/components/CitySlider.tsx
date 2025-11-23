import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { MapPin } from 'lucide-react';

interface City {
  id: string;
  nameKey: string;
  areaCode: number;
}

export default function CitySlider() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const cities: City[] = [
    { id: 'seoul', nameKey: 'seoul', areaCode: 1 },
    { id: 'busan', nameKey: 'busan', areaCode: 6 },
    { id: 'jeju', nameKey: 'jeju', areaCode: 39 },
    { id: 'gangneung', nameKey: 'gangneung', areaCode: 32 },
    { id: 'gyeongju', nameKey: 'gyeongju', areaCode: 35 },
    { id: 'incheon', nameKey: 'incheon', areaCode: 2 },
    { id: 'daegu', nameKey: 'daegu', areaCode: 4 },
    { id: 'yeosu', nameKey: 'yeosu', areaCode: 38 },
  ];

  const handleCityClick = (city: City) => {
    navigate('/trip/select-city', { 
      state: { 
        cityName: t(city.nameKey), 
        areaCode: city.areaCode 
      } 
    });
  };

  return (
    <div className="bg-gray-50 py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">
          {t('popularTitle')}
        </h2>

        {/* Grid Layout */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {cities.map((city) => (
            <button
              key={city.id}
              onClick={() => handleCityClick(city)}
              className="group bg-white rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <div className="aspect-square bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl flex items-center justify-center mb-4">
                <MapPin className="w-12 h-12 text-primary-500 group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {t(city.nameKey)}
              </h3>
              <span className="text-sm text-primary-600 font-medium">
                {t('quickStart')} →
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
