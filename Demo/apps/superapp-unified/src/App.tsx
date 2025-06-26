import React, { useEffect, Suspense, useTransition, createContext, useState, useContext, ReactNode, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CssBaseline, Box } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'sonner';
import { AnimatePresence } from 'framer-motion';
import { AchievementNotification } from './components/notifications/AchievementNotification';

// Contexts
import { ThemeProvider } from './contexts/ThemeContext';
import { ThemeProvider as StylesThemeProvider } from './styles/theme.context';
import { AuthProvider } from './contexts/AuthContext';
import { LetsEducationProvider } from './contexts/LetsEducationContext';
import { FeedbackProvider } from './contexts/FeedbackContext';
import { NotificationProvider } from './components/common/NotificationSystem';

// 🌟 GUARDIAN AGENTS - Universal Harmony System
import { GuardianColorProvider, GuardianThemeSelector } from './components/theme/GuardianColorProvider';
import { UniversalIntegrator } from './components/theme/UniversalIntegrator';

// My new Theme Provider and Selector
import { DynamicThemeProvider } from './context/DynamicThemeContext';
import ThemeSelector from './components/theme/ThemeSelector';

// 🎓 Tutorial Discovery System
import { DiscoveryTutorialProvider, TutorialFloatingButton } from './components/tutorials';

// 🔍 Guardian Feedback System - Para recopilación de información de usuarios
import { FeedbackAgent } from './components/feedback/FeedbackAgent';

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

// El sistema de notificaciones centralizado se proporciona a través de NotificationProvider
// importado de './components/common/NotificationSystem'.

const EnvironmentBanner: React.FC = () => {
  const env = import.meta.env.VITE_APP_ENV || 'development';
  const isMock = import.meta.env.VITE_ENABLE_MOCK_AUTH === 'true';

  if (env === 'production') {
    return null;
  }

  const bannerStyle: React.CSSProperties = {
    position: 'fixed',
    bottom: '10px',
    left: '10px',
    padding: '4px 10px',
    borderRadius: '6px',
    fontSize: '0.8rem',
    fontWeight: 'bold',
    zIndex: 9999,
    textTransform: 'uppercase',
    opacity: 0.8,
  };

  const environments: Record<string, { text: string; style: React.CSSProperties }> = {
    development: {
      text: 'Dev',
      style: { ...bannerStyle, backgroundColor: '#4caf50', color: 'white' },
    },
    staging: {
      text: 'Staging',
      style: { ...bannerStyle, backgroundColor: '#ff9800', color: 'white' },
    },
  };

  const { text, style } = environments[env] || environments.development;

  return (
    <div style={style}>
      {text} {isMock && '| Mock'}
    </div>
  );
};

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

        {/* 🛒 Marketplace - GMP Gamified Match Place ⚜️ CONCILIO DE GUARDIANES ACTIVADO */}
        <Route path="/marketplace" element={<LazyPages.MarketplacePage />} />
        <Route path="/marketplace/item/:id" element={<LazyPages.ProductDetail />} />
        <Route path="/marketplace-test" element={<LazyPages.MarketplaceTest />} />

        {/* 🎮 ÜPlay - GPL Gamified Play List */}
        <Route path="/uplay" element={<LazyPages.UPlay />} />
        <Route path="/uplay/journey/:journeyId" element={<LazyPages.UPlayJourneyPortal />} />
        <Route path="/uplay/harvest/:videoId" element={<LazyPages.UPlayHarvestReflection />} />
        <Route path="/uplay/video/:videoId" element={<LazyPages.UPlayVideoPlayer />} />
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

        {/* 🧠 Consciousness & Cosmic Archive */}
        <Route path="/consciousness" element={<LazyPages.ConsciousnessPage />} />

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
      <Router>
        <QueryClientProvider client={queryClient}>
          <DynamicThemeProvider>
            <StylesThemeProvider>
              <GuardianColorProvider initialTheme="guardian">
                <CssBaseline />
                <AuthProvider>
                  <FeedbackProvider>
                    <NotificationProvider>
                      <LetsEducationProvider>
                        <DiscoveryTutorialProvider>
                          <Box
                            sx={{
                              minHeight: '100vh',
                              background: 'var(--guardian-bg-primary)',
                              transition: 'background 300ms ease',
                            }}
                          >
                            <Suspense fallback={<div>Cargando...</div>}>
                              <AppRoutes />
                            </Suspense>

                            <div style={{ position: 'fixed', bottom: '80px', right: '10px', zIndex: 10000 }}>
                              <ThemeSelector />
                            </div>

                            <TutorialFloatingButton />

                            <FeedbackAgent />

                            <EnvironmentBanner />

                            <Toaster
                              position="top-right"
                              toastOptions={{
                                style: {
                                  background: 'var(--guardian-bg-surface)',
                                  color: 'var(--guardian-text-primary)',
                                  border: '1px solid var(--guardian-primary)',
                                  borderRadius: '16px',
                                },
                              }}
                            />
                          </Box>
                        </DiscoveryTutorialProvider>
                      </LetsEducationProvider>
                    </NotificationProvider>
                  </FeedbackProvider>
                </AuthProvider>
              </GuardianColorProvider>
            </StylesThemeProvider>
          </DynamicThemeProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </Router>
    </ErrorBoundary>
  );
};

export default App;
