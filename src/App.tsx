import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { AuthProvider } from './contexts/AuthContext';
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
import RecommendationsPage from './pages/RecommendationsPage';
import DailySchedulePage from './pages/DailySchedulePage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import Toast from './components/Toast';
import { useToast } from './hooks/toastManager';
import type { DailyItinerary } from './types';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ItineraryProvider>
          <AppContent />
        </ItineraryProvider>
      </AuthProvider>
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
      <Routes>
        {/* Auth Pages - No TopBar */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        
        {/* Main App Pages - With TopBar */}
        <Route path="/*" element={
          <>
            <TopBar />
            <main className="flex flex-col flex-1">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/explore" element={<ExplorePage />} />
                <Route path="/myplan" element={<MyPlanPage />} />
                <Route path="/community" element={<CommunityPage />} />
                
                {/* 새 일정 생성 플로우 */}
                <Route path="/create-trip" element={<CreateTripPage />} />
                <Route path="/trip/recommendations" element={<RecommendationsPage />} />
                <Route path="/create-trip/arrange" element={<DailySchedulePage />} />
                <Route path="/create-trip/map" element={<PlannerPage />} />
                
                {/* 일정 상세(타임라인) */}
                <Route path="/trip/:id" element={<TripDetailPage />} />
                
                {/* 레거시 라우트 (리다이렉트) */}
                <Route path="/trip/select-city" element={<Navigate to="/create-trip" replace />} />
                <Route path="/trip/select-dates" element={<Navigate to="/create-trip" replace />} />
                <Route path="/create-trip/select-places" element={<Navigate to="/trip/recommendations" replace />} />
                <Route path="/create-trip/schedule" element={<Navigate to="/create-trip/arrange" replace />} />
                <Route path="/planner" element={<Navigate to="/create-trip/map" replace />} />
                
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
          </>
        } />
      </Routes>

      {/* Toast notifications */}
      {toasts.map((toast) => (
        <Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  );
}

export default App;
