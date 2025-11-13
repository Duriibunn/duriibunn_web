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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <TopBar />
      <main className="flex-1 flex flex-col">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/planner" element={<PlannerPage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/myplan" element={<MyPlanPage />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
