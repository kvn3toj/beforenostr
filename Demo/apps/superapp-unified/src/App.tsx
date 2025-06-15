import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { CssBaseline, Box } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'sonner';

// Contexts
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';

// Layout Components
import { AppHeader } from './components/layout/AppHeader';
import { BottomNavigation } from './components/layout/BottomNavigation';
import ErrorBoundary from './components/ui/ErrorBoundary';

// Route Protection
import { ProtectedRoute } from './components/ProtectedRoute';

// Lazy Components
import { 
  LazyPages, 
  preloadCriticalComponents, 
  preloadRouteComponents 
} from './utils/lazyComponents';

// Styles
// Importar CSS principal
import './index.css';
// import './styles/index.css';
// import './styles/design-tokens.css';
// import './styles/animations.css';
// import './styles/typography-consistency.css';

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
      
      {/* 🔒 Rutas Protegidas - Requieren autenticación */}
      <Route element={<ProtectedRoute />}>
        {/* Main Pages */}
        <Route path="/" element={<LazyPages.HomePage />} />
        <Route path="/marketplace" element={<LazyPages.MarketplacePage />} />
        <Route path="/uplay" element={<LazyPages.UPlayPage />} />
        <Route path="/social" element={<LazyPages.SocialPage />} />
        <Route path="/profile" element={<LazyPages.ProfilePage />} />
        <Route path="/wallet" element={<LazyPages.WalletPage />} />
        
        {/* 🔄 LETS Routes */}
        <Route path="/lets" element={<LazyPages.LetsPage />} />
        <Route path="/lets/marketplace" element={<LazyPages.LetsMarketplace />} />
        <Route path="/lets/analytics" element={<LazyPages.LetsAnalyticsDashboard />} />
        <Route path="/marketplace/lets" element={<LazyPages.LetsMarketplace />} />
        
        {/* Special Pages */}
        <Route path="/design-system" element={<LazyPages.DesignSystemShowcase />} />
        <Route path="/theme-test" element={<LazyPages.ThemeTestSuite />} />
        <Route path="/design-validator" element={<LazyPages.DesignSystemValidator />} />
        
        {/* Settings */}
        <Route path="/settings" element={<LazyPages.SettingsPage />} />
        <Route path="/help" element={<LazyPages.HelpPage />} />
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
            <CssBaseline />
              <Router>
                <RoutePreloader />
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: '100vh',
                    background: (theme) =>
                      theme.palette.mode === 'dark'
                        ? 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)'
                        : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)',
                  }}
                >
                  {/* Header */}
                  <AppHeader />
                  
                  {/* Main Content */}
                  <Box
                    component="main"
                    sx={{
                      flex: 1,
                      pt: { xs: 8, sm: 9 }, // Account for header height
                      pb: { xs: 8, sm: 2 }, // Account for bottom navigation on mobile
                    }}
                  >
                    <AppRoutes />
                  </Box>
                  
                  {/* Bottom Navigation (Mobile) */}
                  <BottomNavigation />
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
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
