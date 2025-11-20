// Language switcher component
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'ko' ? 'en' : 'ko';
    i18n.changeLanguage(newLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
      title={i18n.language === 'ko' ? 'Switch to English' : '한국어로 전환'}
    >
      <Globe className="h-4 w-4" />
      <span className="font-medium">{i18n.language === 'ko' ? 'EN' : 'KO'}</span>
    </button>
  );
}
