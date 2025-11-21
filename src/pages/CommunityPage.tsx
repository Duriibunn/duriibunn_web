import { Users, Heart, MessageCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function CommunityPage() {
  const { t } = useTranslation();
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{t('communityTitle')}</h1>
        <p className="text-gray-600">{t('communityDesc')}</p>
      </div>

      {/* Coming Soon */}
      <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
        <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          {t('comingSoon')}
        </h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          {t('comingSoonDesc')}
        </p>

        {/* Feature Preview */}
        <div className="max-w-2xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="p-4 border border-gray-200 rounded-lg">
            <Users className="h-8 w-8 text-blue-600 mb-2" />
            <h3 className="font-semibold text-gray-900 mb-1">{t('shareRoutes')}</h3>
            <p className="text-sm text-gray-600">
              {t('shareRoutesDesc')}
            </p>
          </div>

          <div className="p-4 border border-gray-200 rounded-lg">
            <Heart className="h-8 w-8 text-red-500 mb-2" />
            <h3 className="font-semibold text-gray-900 mb-1">{t('likes')}</h3>
            <p className="text-sm text-gray-600">
              {t('likesDesc')}
            </p>
          </div>

          <div className="p-4 border border-gray-200 rounded-lg">
            <MessageCircle className="h-8 w-8 text-green-600 mb-2" />
            <h3 className="font-semibold text-gray-900 mb-1">{t('comments')}</h3>
            <p className="text-sm text-gray-600">
              {t('commentsDesc')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
