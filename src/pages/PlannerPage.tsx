import { useEffect, useState } from 'react';
import { useItinerary } from '../contexts/ItineraryContext';
import type { Place } from '../types';
import ItineraryList from '../components/ItineraryList';
import TransportModeSwitcher from '../components/TransportModeSwitcher';
import RouteSummary from '../components/RouteSummary';
import MapPanel from '../components/MapPanel';
import PlacePopup from '../components/PlacePopup';
import { Calendar, Save, Navigation } from 'lucide-react';
import { openDirections, openItineraryDirections } from '../utils/navLinks';

export default function PlannerPage() {
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
        <div className="border-b border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-semibold text-gray-900">
              경로 계획
            </h1>
            <div className="flex items-center gap-2">
              <button
                onClick={() => openItineraryDirections(items, transportMode)}
                disabled={items.length === 0}
                className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-primary-700 bg-primary-50 hover:bg-primary-100 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title={items.length === 0 ? '장소를 먼저 추가하세요' : '전체 길찾기'}
              >
                <Navigation className="h-4 w-4" />
                <span>전체 길찾기</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 rounded-xl transition-colors">
                <Save className="h-4 w-4" />
                <span>저장</span>
              </button>
            </div>
          </div>
          
          <div className="flex items-center text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg w-fit">
            <Calendar className="h-4 w-4 mr-2 text-gray-500" />
            <span className="font-medium">2025년 11월 11일</span>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Transport Mode Switcher */}
          <TransportModeSwitcher mode={transportMode} onChange={handleTransportModeChange} />

          {/* Itinerary List */}
          <div>
            <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center">
              <span className="flex items-center justify-center w-6 h-6 bg-gray-100 text-gray-700 rounded-full text-sm font-medium mr-2">
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
          <div className="bg-linear-to-br from-blue-50 to-indigo-50 rounded-xl p-5 text-sm border border-blue-100 shadow-sm">
            <p className="font-bold text-blue-900 mb-2 flex items-center">
              <span className="text-lg mr-2">💡</span>
              도움말
            </p>
            <p className="text-blue-800 leading-relaxed">
              장소 탐색 페이지에서 방문할 장소를 추가하거나, 카드를 드래그하여 순서를 변경하세요.
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel - Map */}
      <div className="flex-1 hidden lg:block">
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
