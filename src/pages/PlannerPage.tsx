import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useItinerary } from '../contexts/ItineraryContext';
import type { Place } from '../types';
import ItineraryList from '../components/ItineraryList';
import TransportModeSwitcher from '../components/TransportModeSwitcher';
import RouteSummary from '../components/RouteSummary';
import MapPanel from '../components/MapPanel';
import PlacePopup from '../components/PlacePopup';
import { Calendar, Save, Navigation, Eye } from 'lucide-react';
import { openDirections, openItineraryDirections } from '../utils/navLinks';

export default function PlannerPage() {
  const navigate = useNavigate();
  const { state, reorderItems, removeItem, setTransportMode, recomputeRoute } = useItinerary();
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);

  const currentItinerary = state.currentItinerary;
  const items = currentItinerary?.items || [];
  const transportMode = currentItinerary?.transportMode || 'WALK';

  // Recompute route when items or transport mode changes
  useEffect(() => {
    if (items.length >= 2) {
      recomputeRoute();
    }
  }, [items.length, transportMode, recomputeRoute]);

  const handleTransportModeChange = (mode: typeof transportMode) => {
    setTransportMode(mode);
  };

  const handleNavigate = (place: Place) => {
    openDirections(place, transportMode);
  };

  return (
    <div className="flex-1 flex flex-col lg:flex-row h-[calc(100vh-4rem)] overflow-hidden bg-gray-50">
      {/* Left Panel - Itinerary */}
      <div className="w-full lg:w-[35%] flex flex-col border-r border-gray-100 bg-white">
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-semibold text-gray-900">
              경로 계획
            </h1>
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('/trip/current')}
                disabled={items.length === 0}
                className="flex items-center px-4 py-2 space-x-2 text-sm font-medium text-purple-700 transition-colors bg-purple-50 hover:bg-purple-100 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                title={items.length === 0 ? '장소를 먼저 추가하세요' : '여행 상세보기'}
              >
                <Eye className="w-4 h-4" />
                <span className="hidden sm:inline">여행 보기</span>
              </button>
              <button
                onClick={() => openItineraryDirections(items, transportMode)}
                disabled={items.length === 0}
                className="flex items-center px-4 py-2 space-x-2 text-sm font-medium transition-colors text-primary-700 bg-primary-50 hover:bg-primary-100 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                title={items.length === 0 ? '장소를 먼저 추가하세요' : '전체 길찾기'}
              >
                <Navigation className="w-4 h-4" />
                <span className="hidden sm:inline">전체 길찾기</span>
              </button>
              <button className="flex items-center px-4 py-2 space-x-2 text-sm font-medium text-white transition-colors bg-primary-500 hover:bg-primary-600 rounded-xl">
                <Save className="w-4 h-4" />
                <span>저장</span>
              </button>
            </div>
          </div>
          
          <div className="flex items-center px-3 py-2 text-sm text-gray-600 rounded-lg bg-gray-50 w-fit">
            <Calendar className="w-4 h-4 mr-2 text-gray-500" />
            <span className="font-medium">2025년 11월 11일</span>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 p-6 space-y-6 overflow-y-auto">
          {/* Transport Mode Switcher */}
          <TransportModeSwitcher mode={transportMode} onChange={handleTransportModeChange} />

          {/* Itinerary List */}
          <div>
            <h2 className="flex items-center mb-4 text-base font-semibold text-gray-900">
              <span className="flex items-center justify-center w-6 h-6 mr-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-full">
                {items.length}
              </span>
              방문 장소
            </h2>
            <ItineraryList
              items={items}
              onReorder={reorderItems}
              onRemove={removeItem}
              onItemClick={setSelectedPlace}
            />
          </div>

          {/* Route Summary */}
          {state.routes.length > 0 && <RouteSummary segments={state.routes} />}

          {/* Tips */}
          <div className="p-5 text-sm border border-blue-100 shadow-sm bg-linear-to-br from-blue-50 to-indigo-50 rounded-xl">
            <p className="flex items-center mb-2 font-bold text-blue-900">
              <span className="mr-2 text-lg">💡</span>
              도움말
            </p>
            <p className="leading-relaxed text-blue-800">
              장소 탐색 페이지에서 방문할 장소를 추가하거나, 카드를 드래그하여 순서를 변경하세요.
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel - Map */}
      <div className="flex-1 lg:block">
        <MapPanel
          items={items}
          segments={state.routes}
          transportMode={transportMode}
          isLoading={state.isLoading}
          className="h-full"
          onMarkerClick={(it) => setSelectedPlace(it.place)}
        />
      </div>

      {/* Place Detail Popup */}
      {selectedPlace && (
        <PlacePopup
          place={selectedPlace}
          onClose={() => setSelectedPlace(null)}
          onNavigate={handleNavigate}
        />
      )}
    </div>
  );
}
