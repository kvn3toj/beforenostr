import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { CssBaseline, Box } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'sonner';

// Contexts
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LetsEducationProvider } from './contexts/LetsEducationContext';

// 🎓 Tutorial Discovery System
import { DiscoveryTutorialProvider, TutorialFloatingButton } from './components/tutorials';

// Onboarding Components
import { OnboardingTrigger } from './components/onboarding/OnboardingTrigger';
import { OnboardingChecklist } from './components/onboarding/OnboardingChecklist';
import { ProgressiveTooltips, getStageTooltips } from './components/onboarding/ProgressiveTooltips';
import OnboardingDemo from './components/onboarding/OnboardingDemo';

// Route Protection
import { ProtectedRoute } from './components/ProtectedRoute';
import ErrorBoundary from './components/ui/ErrorBoundary';

// Lazy Components
import { 
  LazyPages, 
  preloadCriticalComponents, 
  preloadRouteComponents 
} from './utils/lazyComponents';

// Performance Monitoring (Development Only)
const PerformanceMonitor = React.lazy(() => import('./components/development/PerformanceMonitor'));

// Styles
// Importar CSS principal
import './index.css';

// Create QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (renamed from cacheTime in v5)
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

// Route preloader component
const RoutePreloader: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    // Preload components for current route
    preloadRouteComponents(location.pathname);
  }, [location.pathname]);

  return null;
};

// Main App Routes
const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* 🔓 Rutas Públicas - No requieren autenticación */}
      <Route path="/login" element={<LazyPages.LoginPage />} />
      <Route path="/register" element={<LazyPages.RegisterPage />} />
      
      {/* 🔒 Rutas Protegidas - Requieren autenticación y usan AppLayout */}
      <Route element={<ProtectedRoute />}>
        {/* Main Pages */}
        <Route path="/" element={<LazyPages.HomePage />} />
        <Route path="/marketplace" element={<LazyPages.Marketplace />} />
        <Route path="/uplay" element={<LazyPages.UPlayPage />} />
        <Route path="/social" element={<LazyPages.Social />} />
        <Route path="/profile" element={<LazyPages.ProfilePage />} />
        <Route path="/wallet" element={<LazyPages.WalletPage />} />
        
        {/* 🎯 Challenge & Group Pages */}
        <Route path="/challenges" element={<LazyPages.ChallengesPage />} />
        <Route path="/groups" element={<LazyPages.GroupsPage />} />
        
        {/* 📊 UStats - Estadísticas y Analytics */}
        <Route path="/ustats" element={<LazyPages.UStatsPage />} />
        <Route path="/analytics" element={<LazyPages.AnalyticsPage />} />
        
        {/* 🎥 Video/UPlay Routes */}
        <Route path="/uplay/video/:videoId" element={<LazyPages.UPlayVideoPlayer />} />
        <Route path="/uplay/unified" element={<LazyPages.UnifiedUPlay />} />
        <Route path="/uplay/interactive" element={<LazyPages.InteractiveVideoEnhanced />} />
        <Route path="/uplay/demo" element={<LazyPages.InteractiveVideoDemo />} />
        <Route path="/videos" element={<LazyPages.VideoHome />} />
        <Route path="/video/:videoId" element={<LazyPages.VideoPlayer />} />
        
        {/* 🏪 Marketplace Routes - Módulo principal de intercambio */}
        <Route path="/marketplace/test" element={<LazyPages.MarketplaceTest />} />
        
        {/* 🔄 LETS Routes - Módulo independiente de intercambio local */}
        <Route path="/lets" element={<LazyPages.LetsPage />} />
        <Route path="/lets/analytics" element={<LazyPages.LetsAnalyticsDashboard />} />
        
        {/* 🎯 Challenge Routes */}
        <Route path="/challenges/:challengeId" element={<LazyPages.ChallengeDetailPage />} />
        
        {/* 👥 Social Routes */}
        <Route path="/social/chat" element={<LazyPages.SocialChat />} />
        <Route path="/social/feed" element={<LazyPages.SocialFeed />} />
        
        {/* Special Pages */}
        <Route path="/design-system" element={<LazyPages.DesignSystemShowcase />} />
        <Route path="/theme-test" element={<LazyPages.ThemeTestSuite />} />
        <Route path="/design-validator" element={<LazyPages.DesignSystemValidator />} />
        
        {/* 🔧 WebSocket Test - Temporal para pruebas */}
        <Route path="/websocket-test" element={<LazyPages.WebSocketTest />} />
        
        {/* Settings */}
        <Route path="/settings" element={<LazyPages.SettingsPage />} />
        <Route path="/help" element={<LazyPages.HelpPage />} />
        
        {/* 🆕 NUEVAS PÁGINAS DESARROLLADAS */}
        <Route path="/notifications" element={<LazyPages.NotificationsPage />} />
        <Route path="/study-rooms" element={<LazyPages.StudyRoomsPage />} />
        
        {/* 🎮 Onboarding Demo */}
        <Route path="/onboarding-demo" element={<OnboardingDemo />} />
        
        {/* PWA Demo */}
        <Route path="/pwa-demo" element={<LazyPages.PWADemo />} />
        <Route path="/beta-register" element={<LazyPages.BetaRegister />} />
        <Route path="/home-alt" element={<LazyPages.HomePageAlternative />} />
      </Route>
      
      {/* 404 - Debe estar fuera de las rutas protegidas */}
      <Route path="*" element={<LazyPages.NotFoundPage />} />
    </Routes>
  );
};

// Onboarding System Wrapper (needs to be inside AuthProvider)
const OnboardingSystem: React.FC = () => {
  const { user } = useAuth();
  const [showChecklist, setShowChecklist] = useState(false);
  const [showTooltips, setShowTooltips] = useState(false);
  const [completedOnboardingItems, setCompletedOnboardingItems] = useState<string[]>([]);
  const [userStage, setUserStage] = useState<'BUYER' | 'SEEKER' | 'SOLVER' | 'PROMOTER'>('BUYER');

  // Load onboarding data from localStorage
  useEffect(() => {
    const completedItems = localStorage.getItem('coomunity_completed_checklist_items');
    if (completedItems) {
      setCompletedOnboardingItems(JSON.parse(completedItems));
    }

    const stage = localStorage.getItem('coomunity_user_stage');
    if (stage) {
      setUserStage(stage as any);
    }
  }, []);

  const handleOnboardingComplete = (data: any) => {
    console.log('Onboarding completed:', data);
    
    // Start progressive tooltips after initial onboarding
    setTimeout(() => {
      setShowTooltips(true);
    }, 2000);
  };

  const handleChecklistItemComplete = (itemId: string, rewards: { ondas: number; meritos?: number }) => {
    const updatedItems = [...completedOnboardingItems, itemId];
    setCompletedOnboardingItems(updatedItems);
    localStorage.setItem('coomunity_completed_checklist_items', JSON.stringify(updatedItems));
    
    console.log(`Completed item ${itemId}:`, rewards);
    
    // Here you could integrate with actual rewards system
    // For now, just show in console
  };

  const handleTooltipsComplete = () => {
    setShowTooltips(false);
    
    // Show checklist after tooltips
    setTimeout(() => {
      setShowChecklist(true);
    }, 1000);
  };

  return (
    <>
      <OnboardingTrigger
        userEmail={user?.email}
        hasCompletedOnboarding={localStorage.getItem('coomunity_onboarding_completed') === 'true'}
        onOnboardingComplete={handleOnboardingComplete}
      />

      <OnboardingChecklist
        isVisible={showChecklist}
        onClose={() => setShowChecklist(false)}
        userStage={userStage}
        completedItems={completedOnboardingItems}
        onItemComplete={handleChecklistItemComplete}
      />

      <ProgressiveTooltips
        isActive={showTooltips}
        steps={getStageTooltips(userStage)}
        onComplete={handleTooltipsComplete}
        onSkip={() => setShowTooltips(false)}
        userStage={userStage}
      />
    </>
  );
};

// Main App Component
const App: React.FC = () => {
  useEffect(() => {
    // Preload critical components on app start
    preloadCriticalComponents();
  }, []);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AuthProvider>
            <LetsEducationProvider>
              <DiscoveryTutorialProvider>
                <CssBaseline />
                <Router>
                  <RoutePreloader />
                  <Box
                    sx={{
                      minHeight: '100vh',
                      background: (theme) =>
                        theme.palette.mode === 'dark'
                          ? 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)'
                          : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)',
                    }}
                  >
                    <AppRoutes />
                  </Box>

                  {/* Onboarding System - Inside AuthProvider */}
                  <OnboardingSystem />

                  {/* 🎓 Tutorial Discovery Floating Button */}
                  <TutorialFloatingButton />
                  
                  {/* Toast Notifications */}
                  <Toaster
                    position="top-right"
                    toastOptions={{
                      duration: 4000,
                      style: {
                        background: 'var(--coomunity-card-bg)',
                        color: 'var(--coomunity-text-primary)',
                        border: '1px solid var(--coomunity-border)',
                      },
                    }}
                  />
                  
                  {/* React Query DevTools */}
                  {process.env.NODE_ENV === 'development' && (
                    <ReactQueryDevtools initialIsOpen={false} />
                  )}
                  
                  {/* 🎯 Performance Monitor - Development Only - Temporalmente deshabilitado */}
                  {/* {process.env.NODE_ENV === 'development' && (
                    <React.Suspense fallback={null}>
                      <PerformanceMonitor />
                    </React.Suspense>
                  )} */}
                </Router>
              </DiscoveryTutorialProvider>
            </LetsEducationProvider>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
