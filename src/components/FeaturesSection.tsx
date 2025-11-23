import { useTranslation } from 'react-i18next';
import { Calendar, Route, Sparkles } from 'lucide-react';

export default function FeaturesSection() {
  const { t } = useTranslation();

  const features = [
    {
      icon: <Calendar className="w-12 h-12 text-primary-500" />,
      title: t('autoSchedulingTitle'),
      description: t('autoSchedulingDesc'),
    },
    {
      icon: <Sparkles className="w-12 h-12 text-primary-500" />,
      title: t('recommendationTitle'),
      description: t('recommendationDesc'),
    },
    {
      icon: <Route className="w-12 h-12 text-primary-500" />,
      title: t('routeOptimizeTitle'),
      description: t('routeOptimizeDesc'),
    },
  ];

  return (
    <div className="bg-white py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-2xl border-2 border-gray-100 hover:border-primary-200 hover:shadow-lg transition-all duration-300"
            >
              <div className="mb-6 flex justify-center">{feature.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-center leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
