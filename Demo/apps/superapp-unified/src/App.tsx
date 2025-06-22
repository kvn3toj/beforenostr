import React, { useEffect, Suspense, useTransition } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CssBaseline, Box } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'sonner';

// Contexts
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { LetsEducationProvider } from './contexts/LetsEducationContext';
import { FeedbackProvider } from './contexts/FeedbackContext';

// 🎓 Tutorial Discovery System
import { DiscoveryTutorialProvider, TutorialFloatingButton } from './components/tutorials';

// Route Protection
import { ProtectedRoute } from './components/ProtectedRoute';
import ErrorBoundary from './components/ui/ErrorBoundary';

// Lazy Components
import {
  LazyPages,
  preloadCriticalComponents,
} from './utils/lazyComponents';

// Styles
import './index.css';

// Create QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

// Main App Routes (Simplified for debugging)
const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* 🔓 Rutas Públicas */}
      <Route path="/login" element={<LazyPages.LoginPage />} />
      <Route path="/register" element={<LazyPages.RegisterPage />} />

      {/* 🔒 Rutas Protegidas */}
      <Route element={<ProtectedRoute />}>
        {/* 🏠 Página Principal */}
        <Route path="/" element={<LazyPages.HomePage />} />

        {/* 🛒 Marketplace - GMP Gamified Match Place */}
        <Route path="/marketplace" element={<LazyPages.Marketplace />} />
        <Route path="/marketplace-test" element={<LazyPages.MarketplaceTest />} />

        {/* 🎮 ÜPlay - GPL Gamified Play List */}
        <Route path="/uplay" element={<LazyPages.UPlay />} />
        <Route path="/uplay/video/:videoId" element={<LazyPages.UPlayVideoPlayer />} />
        <Route path="/uplay/unified" element={<LazyPages.UnifiedUPlay />} />
        <Route path="/video/:videoId" element={<LazyPages.VideoPlayer />} />
        <Route path="/video" element={<LazyPages.VideoHome />} />
        <Route path="/interactive-video" element={<LazyPages.InteractiveVideoEnhanced />} />
        <Route path="/interactive-demo" element={<LazyPages.InteractiveVideoDemo />} />

        {/* 👥 Social */}
        <Route path="/social" element={<LazyPages.Social />} />
        <Route path="/social/chat" element={<LazyPages.SocialChat />} />
        <Route path="/social/feed" element={<LazyPages.SocialFeed />} />

        {/* 👤 Perfil y Configuración */}
        <Route path="/profile" element={<LazyPages.Profile />} />
        <Route path="/settings" element={<LazyPages.SettingsPage />} />

        {/* 💰 Wallet y LETS */}
        <Route path="/wallet" element={<LazyPages.Wallet />} />
        <Route path="/lets" element={<LazyPages.LetsPage />} />

        {/* 🏆 Desafíos y Grupos */}
        <Route path="/challenges" element={<LazyPages.ChallengesPage />} />
        <Route path="/challenges/:challengeId" element={<LazyPages.ChallengeDetailPage />} />
        <Route path="/groups" element={<LazyPages.GroupsPage />} />

        {/* 📊 UStats y Analytics */}
        <Route path="/ustats" element={<LazyPages.UStatsPage />} />
        <Route path="/analytics" element={<LazyPages.AnalyticsPage />} />

        {/* 📚 Study Rooms */}
        <Route path="/study-rooms" element={<LazyPages.StudyRoomsPage />} />
        <Route path="/websocket-test" element={<LazyPages.WebSocketTest />} />

        {/* 🔔 Notificaciones */}
        <Route path="/notifications" element={<LazyPages.NotificationsPage />} />

        {/* 📱 PWA Demo */}
        <Route path="/pwa" element={<LazyPages.PWADemo />} />

        {/* 🎨 Design System */}
        <Route path="/design-system" element={<LazyPages.DesignSystemShowcase />} />

        {/* 🚀 Beta Registration */}
        <Route path="/beta" element={<LazyPages.BetaRegister />} />

        {/* 🎓 Onboarding Demo */}
        <Route path="/onboarding" element={<LazyPages.OnboardingDemo />} />

        {/* 🧭 Pilgrim Journey - Experiencia de Descubrimiento Inicial */}
        <Route path="/pilgrim" element={<LazyPages.UPlay />} /> {/* Reutiliza UPlay como experiencia de descubrimiento */}
      </Route>

      {/* 404 */}
      <Route path="*" element={<LazyPages.NotFoundPage />} />
    </Routes>
  );
};

// Main App Component
const App: React.FC = () => {
  const [, startTransition] = useTransition();

  useEffect(() => {
    // Preload critical components on app start
    startTransition(() => {
      preloadCriticalComponents();
    });
  }, []);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AuthProvider>
            <FeedbackProvider>
              <LetsEducationProvider>
              <CssBaseline />
              <Router>
                <DiscoveryTutorialProvider>
                  <Box
                    sx={{
                      minHeight: '100vh',
                      background: (theme) =>
                        theme.palette.mode === 'dark'
                          ? 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)'
                          : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)',
                    }}
                  >
                    <Suspense fallback={<div>Cargando...</div>}>
                      <AppRoutes />
                    </Suspense>

                    {/* El botón flotante del tutorial va aquí para heredar el contexto */}
                    <TutorialFloatingButton />
                  </Box>

                  {/* Onboarding System and other complex components are disabled for now */}

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

                  {process.env.NODE_ENV === 'development' && (
                    <ReactQueryDevtools initialIsOpen={false} />
                  )}
                </DiscoveryTutorialProvider>
              </Router>
            </LetsEducationProvider>
              </FeedbackProvider>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
