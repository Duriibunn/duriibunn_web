import { useState, useEffect } from 'react';
import { Heart, MapPin, Trash2, Calendar } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface FavoritePlace {
  id: string;
  name: string;
  category: string;
  image?: string;
  address?: string;
  savedAt: number;
}

export default function ExplorePage() {
  const { t } = useTranslation();
  const [favorites, setFavorites] = useState<FavoritePlace[]>([]);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = () => {
    const storedFavorites = localStorage.getItem('favoritePlaces');
    if (storedFavorites) {
      const parsed: FavoritePlace[] = JSON.parse(storedFavorites);
      // 최신순으로 정렬
      setFavorites(parsed.sort((a, b) => b.savedAt - a.savedAt));
    }
  };

  const removeFavorite = (placeId: string) => {
    const updatedFavorites = favorites.filter(f => f.id !== placeId);
    setFavorites(updatedFavorites);
    localStorage.setItem('favoritePlaces', JSON.stringify(updatedFavorites));
  };

  const getCategoryBadgeColor = (category: string) => {
    if (category.includes('관광') || category.includes('문화')) return 'bg-blue-100 text-blue-700';
    if (category.includes('음식') || category.includes('맛집')) return 'bg-orange-100 text-orange-700';
    if (category.includes('숙박')) return 'bg-purple-100 text-purple-700';
    if (category.includes('카페')) return 'bg-amber-100 text-amber-700';
    return 'bg-gray-100 text-gray-700';
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('ko-KR', { 
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen pb-20 bg-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200">
        <div className="max-w-6xl px-4 py-12 mx-auto sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-3">
            <Heart className="w-10 h-10 text-gray-900 fill-current" />
            <h1 className="text-4xl font-bold text-gray-900">
              {t('favorites')}
            </h1>
          </div>
          <p className="text-lg text-gray-800">
            {t('savedDestinations')}
          </p>
        </div>
      </div>

      <div className="max-w-6xl px-4 py-8 mx-auto sm:px-6 lg:px-8">
        {favorites.length === 0 ? (
          <div className="py-20 text-center">
            <div className="mb-6 text-6xl">❤️</div>
            <h2 className="mb-3 text-2xl font-bold text-gray-900">
              {t('noFavoritesYet')}
            </h2>
            <p className="mb-6 text-gray-600">
              {t('savePlacesWhilePlanning')}
            </p>
            <button
              onClick={() => window.location.href = '/create-trip'}
              className="px-6 py-3 font-semibold text-white transition-colors rounded-lg bg-primary-600 hover:bg-primary-700"
            >
              {t('startTripPlanning')}
            </button>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                {t('savedPlaces')} <span className="text-red-500">{favorites.length}</span>{t('countSuffix')}
              </h2>
              <p className="text-sm text-gray-600">
                {t('sortedByLatest')}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {favorites.map((place) => (
                <div
                  key={place.id}
                  className="overflow-hidden transition-all bg-white border-2 border-red-200 shadow-sm rounded-xl hover:shadow-lg hover:border-red-400"
                >
                  {place.image ? (
                    <img
                      src={place.image}
                      alt={place.name}
                      className="object-cover w-full h-48"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-48 bg-linear-to-br from-red-100 to-pink-100">
                      <MapPin className="w-12 h-12 text-red-400" />
                    </div>
                  )}
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <span className={`inline-block px-2 py-1 text-xs font-medium rounded ${getCategoryBadgeColor(place.category)}`}>
                          {place.category}
                        </span>
                      </div>
                      <button
                        onClick={() => removeFavorite(place.id)}
                        className="p-2 text-red-500 transition-colors rounded-lg hover:bg-red-50"
                        title={t('removeFavorite')}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <h3 className="mb-2 text-lg font-bold text-gray-900 line-clamp-2">
                      {place.name}
                    </h3>
                    {place.address && (
                      <p className="mb-3 text-sm text-gray-600 line-clamp-2">
                        <MapPin className="inline w-3 h-3 mr-1" />
                        {place.address}
                      </p>
                    )}
                    <div className="flex items-center pt-3 text-xs text-gray-500 border-t">
                      <Calendar className="w-3 h-3 mr-1" />
                      {formatDate(place.savedAt)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 하단 안내 */}
            <div className="p-6 mt-8 text-center border-2 border-red-200 rounded-xl bg-red-50">
              <p className="text-sm font-medium text-gray-900">
                {t('autoAddToFavorites')}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
