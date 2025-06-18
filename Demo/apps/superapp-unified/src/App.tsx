import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { CssBaseline, Box } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'sonner';

// Contexts
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { LetsEducationProvider } from './contexts/LetsEducationContext';

// Route Protection
import { ProtectedRoute } from './components/ProtectedRoute';
import ErrorBoundary from './components/ui/ErrorBoundary';
import { BuilderIOStatus } from './components/ui';

// Lazy Components
import { 
  LazyPages, 
  preloadCriticalComponents, 
  preloadRouteComponents 
} from './utils/lazyComponents';

// Styles
// Importar CSS principal
import './index.css';

// Create QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
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
              <CssBaseline />
              <Router>
                <RoutePreloader />
                <BuilderIOStatus />
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
              </Router>
            </LetsEducationProvider>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
