import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useItinerary } from '../contexts/ItineraryContext';
import type { Place } from '../types';
import PlaceCard from '../components/PlaceCard';
import PlacePopup from '../components/PlacePopup';
import LoadingSpinner from '../components/LoadingSpinner';
import { Search, AlertCircle } from 'lucide-react';
import { 
  getSeoulTouristSpots, 
  getSeoulCulturalFacilities,
  getSeoulAccommodations,
  searchKeyword,
  getDetailCommon,
  CONTENT_TYPES,
  type TourPlace,
  type TourPlaceDetail
} from '../utils/publicDataApi';
import { showToast } from '../components/Toast';

// Convert TourPlace to Place type
function convertTourPlaceToPlace(tourPlace: TourPlace): Place {
  return {
    id: tourPlace.contentid,
    name: tourPlace.title,
    address: tourPlace.addr1,
    lat: parseFloat(tourPlace.mapy) || 37.5665,
    lng: parseFloat(tourPlace.mapx) || 126.9780,
    category: 'attraction',
    description: tourPlace.addr1,
    photos: tourPlace.firstimage ? [tourPlace.firstimage] : undefined,
    rating: undefined,
    phone: tourPlace.tel,
  };
}

export default function ExplorePage() {
  const { t } = useTranslation();
  const { addItem, state } = useItinerary();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [placeDetail, setPlaceDetail] = useState<TourPlaceDetail | null>(null);
  const [apiPlaces, setApiPlaces] = useState<Place[]>([]);
  const [isLoadingApi, setIsLoadingApi] = useState(false);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const categories = [
    { value: 'all', label: t('allCategory') },
    { value: 'attraction', label: t('attraction'), contentType: CONTENT_TYPES.TOURIST_SPOT },
    { value: 'culture', label: t('culture'), contentType: CONTENT_TYPES.CULTURE },
    { value: 'hotel', label: t('accommodation'), contentType: CONTENT_TYPES.ACCOMMODATION },
    { value: 'restaurant', label: t('restaurant'), contentType: CONTENT_TYPES.RESTAURANT },
    { value: 'shopping', label: t('shopping'), contentType: CONTENT_TYPES.SHOPPING },
  ];

  // Load places from public data API when category changes
  useEffect(() => {
    const loadApiPlaces = async () => {
      setIsLoadingApi(true);
      setApiError(null);
      
      try {
        let tourPlaces: TourPlace[] = [];
        
        if (selectedCategory === 'attraction') {
          tourPlaces = await getSeoulTouristSpots(30);
        } else if (selectedCategory === 'culture') {
          tourPlaces = await getSeoulCulturalFacilities(30);
        } else if (selectedCategory === 'hotel') {
          tourPlaces = await getSeoulAccommodations(30);
        } else if (selectedCategory !== 'all') {
          // Search for other categories by keyword
          const selectedCat = categories.find(c => c.value === selectedCategory);
          if (selectedCat && selectedCat.contentType) {
            tourPlaces = await searchKeyword('서울', selectedCat.contentType, undefined, 30);
          }
        }

        const places = tourPlaces.map(convertTourPlaceToPlace);
        setApiPlaces(places);

        if (tourPlaces.length === 0 && selectedCategory !== 'all') {
          setApiError(t('categoryLoadError'));
        }
      } catch (error) {
        console.error('Failed to load API places:', error);
        setApiError(t('dataLoadError'));
      } finally {
        setIsLoadingApi(false);
      }
    };

    if (selectedCategory !== 'all') {
      loadApiPlaces();
    } else {
      setApiPlaces([]);
      setApiError(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, t]);

  // Search with API when search query changes
  useEffect(() => {
    const searchApiPlaces = async () => {
      if (!searchQuery || searchQuery.length < 2) {
        return;
      }

      setIsLoadingApi(true);
      setApiError(null);

      try {
        const selectedCat = categories.find(c => c.value === selectedCategory);
        const contentType = selectedCat?.contentType;
        
        const tourPlaces = await searchKeyword(
          searchQuery, 
          contentType, 
          undefined, 
          50
        );

        const places = tourPlaces.map(convertTourPlaceToPlace);
        setApiPlaces(places);

        if (tourPlaces.length === 0) {
          setApiError(`"${searchQuery}" ${t('noSearchResults')}`);
        }
      } catch (error) {
        console.error('Failed to search places:', error);
        setApiError(t('searchError'));
      } finally {
        setIsLoadingApi(false);
      }
    };

    const timeoutId = setTimeout(() => {
      searchApiPlaces();
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, selectedCategory, t]);

  // Load place detail when a place is selected
  useEffect(() => {
    const loadPlaceDetail = async () => {
      if (!selectedPlace) {
        setPlaceDetail(null);
        return;
      }

      setIsLoadingDetail(true);
      
      try {
        const detail = await getDetailCommon(selectedPlace.id);
        setPlaceDetail(detail);
      } catch (error) {
        console.error('Failed to load place detail:', error);
      } finally {
        setIsLoadingDetail(false);
      }
    };

    loadPlaceDetail();
  }, [selectedPlace]);

  // Filter API places
  const filteredPlaces = apiPlaces.filter((place: Place) => {
    const matchesSearch =
      searchQuery === '' ||
      place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      place.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      place.address?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const handleAddPlace = (place: Place) => {
    const newItem = {
      id: `item-${Date.now()}`,
      place,
      stayDurationMins: 60,
    };
    addItem(newItem);
    
    showToast(`${place.name} ${t('addedToItinerary')}`, 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {t('placeExploration')}
        </h1>
        <p className="text-lg text-gray-600">{t('findAndAddPlaces')}</p>
      </div>

      {/* Search & Filters */}
      <div className="mb-8 space-y-4">
        {/* Search Bar */}
        <div className="relative h-12">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder={t('searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-full pl-12 pr-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 w-5 h-5 flex items-center justify-center"
              aria-label={t('clearSearch')}
            >
              ✕
            </button>
          )}
        </div>

        {/* Category Filters */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat.value
                  ? 'bg-primary-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {isLoadingApi && (
        <div className="flex flex-col items-center justify-center py-16">
          <LoadingSpinner size="lg" />
          <p className="text-gray-600 mt-4">{t('loadingPlaces')}</p>
        </div>
      )}

      {/* API Error State */}
      {apiError && !isLoadingApi && (
        <div className="flex flex-col items-center justify-center py-12 bg-amber-50 border border-amber-200 rounded-xl">
          <AlertCircle className="h-12 w-12 text-amber-500 mb-3" />
          <p className="text-amber-900 font-medium mb-1">{apiError}</p>
        </div>
      )}

      {/* All Places Grid */}
      {!isLoadingApi && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            {t('allPlaces')} ({filteredPlaces.length})
            {apiPlaces.length > 0 && (
              <span className="ml-2 text-sm font-normal text-primary-600">
                ⚡ {t('publicDataIncluded')} {apiPlaces.length}{t('includedSuffix')}
              </span>
            )}
          </h2>
          {filteredPlaces.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPlaces.map((place) => (
                <PlaceCard
                  key={place.id}
                  place={place}
                  onAdd={handleAddPlace}
                  onClick={setSelectedPlace}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">{t('noResults')}</p>
            </div>
          )}
        </div>
      )}

      {/* Place Detail Popup */}
      {selectedPlace && (
        <PlacePopup
          place={selectedPlace}
          placeDetail={placeDetail}
          isLoadingDetail={isLoadingDetail}
          onClose={() => {
            setSelectedPlace(null);
            setPlaceDetail(null);
          }}
          onNavigate={(place) => {
            window.open(
              `https://map.kakao.com/link/to/${place.name},${place.lat},${place.lng}`,
              '_blank'
            );
          }}
        />
      )}

      {/* Current Itinerary Summary (Sticky Bottom) */}
      {state.currentItinerary && state.currentItinerary.items.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg p-4 lg:hidden">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div>
              <p className="text-sm text-gray-600">{t('currentItinerary')}</p>
              <p className="font-semibold text-gray-900">
                {state.currentItinerary.items.length}{t('placesCount')}
              </p>
            </div>
            <button
              onClick={() => window.location.href = '/planner'}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              {t('viewItinerary')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
