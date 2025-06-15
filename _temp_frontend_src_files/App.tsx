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
import { MainLayout } from './layouts/MainLayout';

// Lazy Components
import { LazyPages, preloadCriticalComponents, preloadRouteComponents } from './utils/lazyComponents';

// Error Boundary
import { ErrorBoundary } from 'react-error-boundary';

// Query Client Configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Error Fallback Component
const ErrorFallback: React.FC<{ error: Error; resetErrorBoundary: () => void }> = ({
  error,
  resetErrorBoundary,
}) => (
  <Box className="flex flex-col items-center justify-center min-h-screen p-8 text-center">
    <h2 className="text-2xl font-bold mb-4">¡Oops! Algo salió mal</h2>
    <p className="text-gray-600 mb-4">{error.message}</p>
    <button
      onClick={resetErrorBoundary}
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
    >
      Intentar de nuevo
    </button>
  </Box>
);

// Route Preloader Component
const RoutePreloader: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    preloadRouteComponents(location.pathname);
  }, [location.pathname]);

  return null;
};

function App() {
  // Preload critical components on app start
  useEffect(() => {
    preloadCriticalComponents();
  }, []);

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AuthProvider>
            <CssBaseline />
            <Router>
              <RoutePreloader />
              <Routes>
                {/* Authentication Routes (without layout) */}
                <Route path="/login" element={<LazyPages.LoginPage />} />
                <Route path="/register" element={<LazyPages.RegisterPage />} />
                
                {/* Main Routes (with layout) */}
                <Route element={<MainLayout />}>
                  <Route path="/" element={<LazyPages.HomePage />} />
                  <Route path="/home" element={<LazyPages.HomePage />} />
                  <Route path="/marketplace" element={<LazyPages.MarketplacePage />} />
                  <Route path="/social" element={<LazyPages.SocialPage />} />
                  <Route path="/profile" element={<LazyPages.ProfilePage />} />
                  <Route path="/wallet" element={<LazyPages.WalletPage />} />
                  <Route path="/settings" element={<LazyPages.SettingsPage />} />
                  <Route path="/challenges" element={<LazyPages.ChallengesPage />} />
                  <Route path="/groups" element={<LazyPages.GroupsPage />} />
                  <Route path="/mundos" element={<LazyPages.MundosPage />} />
                  <Route path="/playlists" element={<LazyPages.GamifiedPlaylistsPage />} />
                  
                  {/* Design System Routes */}
                  <Route path="/design-system" element={<LazyPages.DesignSystemShowcase />} />
                  <Route path="/theme-test" element={<LazyPages.ThemeTestSuite />} />
                  <Route path="/design-validator" element={<LazyPages.DesignSystemValidator />} />
                  <Route path="/performance-monitor" element={<LazyPages.PerformanceMonitor />} />
                </Route>
                
                {/* Fallback Route */}
                <Route path="*" element={<LazyPages.HomePage />} />
              </Routes>
              
              {/* Toast Notifications */}
              <Toaster 
                richColors 
                position="top-right"
                toastOptions={{
                  style: {
                    background: 'var(--background)',
                    color: 'var(--foreground)',
                    border: '1px solid var(--border)',
                  },
                }}
              />
            </Router>
            
            {/* React Query DevTools (only in development) */}
            {process.env.NODE_ENV === 'development' && (
              <ReactQueryDevtools initialIsOpen={false} />
            )}
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
