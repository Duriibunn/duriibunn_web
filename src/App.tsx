import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { ItineraryProvider } from './contexts/ItineraryContext';
import { useItinerary } from './contexts/useItinerary';
import TopBar from './components/TopBar';
import HomePage from './pages/HomePage';
import PlannerPage from './pages/PlannerPage';
import ExplorePage from './pages/ExplorePage';
import MyPlanPage from './pages/MyPlanPage';
import CommunityPage from './pages/CommunityPage';
import TripDetailPage from './pages/TripDetailPage';
import CreateTripPage from './pages/CreateTripPage';
import SelectPlacesPage from './pages/SelectPlacesPage';
import DailySchedulePage from './pages/DailySchedulePage';
import Toast, { useToast } from './components/Toast';
import type { DailyItinerary } from './types';

function App() {
  return (
    <Router>
      <ItineraryProvider>
        <AppContent />
      </ItineraryProvider>
    </Router>
  );
}

function AppContent() {
  const { setItinerary } = useItinerary();
  const { toasts, removeToast } = useToast();

  // Initialize with a default itinerary on first load
  useEffect(() => {
    const defaultItinerary: DailyItinerary = {
      id: 'default-1',
      date: new Date().toISOString().split('T')[0],
      title: '내 여행 계획',
      items: [],
      transportMode: 'WALK',
    };

    setItinerary(defaultItinerary);
  }, [setItinerary]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <TopBar />
      <main className="flex flex-col flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/planner" element={<PlannerPage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/myplan" element={<MyPlanPage />} />
          <Route path="/trip/:id" element={<TripDetailPage />} />
          <Route path="/create-trip" element={<CreateTripPage />} />
          <Route path="/create-trip/select-places" element={<SelectPlacesPage />} />
          <Route path="/create-trip/schedule" element={<DailySchedulePage />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Toast notifications */}
      {toasts.map((toast) => (
        <Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  );
}

export default App;
