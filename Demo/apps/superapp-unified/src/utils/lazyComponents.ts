import { lazy } from 'react';

// Lazy loading de páginas principales
const HomePage = lazy(() => import('../pages/HomePage'));
const LoginPage = lazy(() => import('../pages/LoginPage'));
const RegisterPage = lazy(() => import('../pages/RegisterPage'));
const Marketplace = lazy(() => import('../pages/Marketplace'));
const UPlayPage = lazy(() => import('../pages/UPlay'));
const Social = lazy(() => import('../pages/Social'));
const ProfilePage = lazy(() => import('../pages/Profile'));
const WalletPage = lazy(() => import('../pages/Wallet'));

// Challenge & Group Pages
const ChallengesPage = lazy(() => import('../pages/ChallengesPage'));
const GroupsPage = lazy(() => import('../pages/GroupsPage'));
const ChallengeDetailPage = lazy(() => import('../pages/ChallengeDetailPage'));

// UStats & Analytics
const UStatsPage = lazy(() => import('../pages/UStats'));
const AnalyticsPage = lazy(() => import('../pages/Analytics'));

// Video/UPlay Routes
const UPlayVideoPlayer = lazy(() => import('../pages/UPlayVideoPlayer'));
const UnifiedUPlay = lazy(() => import('../pages/UnifiedUPlay'));
const InteractiveVideoEnhanced = lazy(() => import('../pages/InteractiveVideoEnhanced'));
const InteractiveVideoDemo = lazy(() => import('../pages/InteractiveVideoDemo'));
const VideoHome = lazy(() => import('../pages/VideoHome'));
const VideoPlayer = lazy(() => import('../pages/VideoPlayer'));

// Marketplace Routes
const MarketplaceTest = lazy(() => import('../pages/MarketplaceTest'));

// LETS Routes
const LetsPage = lazy(() => import('../pages/LetsPage'));
const LetsAnalyticsDashboard = lazy(() => import('../pages/LetsPage'));

// Social Routes
const SocialChat = lazy(() => import('../pages/SocialChat'));
const SocialFeed = lazy(() => import('../pages/SocialFeed'));

// Special Pages
const DesignSystemShowcase = lazy(() => import('../pages/DesignSystemShowcase'));
const ThemeTestSuite = lazy(() => import('../pages/DesignSystemShowcase'));
const DesignSystemValidator = lazy(() => import('../pages/DesignSystemShowcase'));

// WebSocket Test
const WebSocketTest = lazy(() => import('../pages/StudyRoomsPage'));

// Settings
const SettingsPage = lazy(() => import('../pages/Settings'));
const HelpPage = lazy(() => import('../pages/Settings'));

// Nuevas páginas
const NotificationsPage = lazy(() => import('../pages/NotificationsPage'));
const StudyRoomsPage = lazy(() => import('../pages/StudyRoomsPage'));

// PWA & Beta
const PWADemo = lazy(() => import('../pages/PWADemo'));
const BetaRegister = lazy(() => import('../pages/BetaRegister'));
const HomePageAlternative = lazy(() => import('../pages/HomeEnhanced'));

// 404
const NotFoundPage = lazy(() => import('../pages/HomePage'));

// Onboarding
const OnboardingDemo = lazy(() => import('../components/onboarding/OnboardingDemo'));

export const LazyPages = {
  // Main Pages
  HomePage,
  LoginPage,
  RegisterPage,
  Marketplace,
  UPlayPage,
  Social,
  ProfilePage,
  WalletPage,
  
  // Challenge & Group Pages
  ChallengesPage,
  GroupsPage,
  ChallengeDetailPage,
  
  // UStats & Analytics
  UStatsPage,
  AnalyticsPage,
  
  // Video/UPlay Routes
  UPlayVideoPlayer,
  UnifiedUPlay,
  InteractiveVideoEnhanced,
  InteractiveVideoDemo,
  VideoHome,
  VideoPlayer,
  
  // Marketplace Routes
  MarketplaceTest,
  
  // LETS Routes
  LetsPage,
  LetsAnalyticsDashboard,
  
  // Social Routes
  SocialChat,
  SocialFeed,
  
  // Special Pages
  DesignSystemShowcase,
  ThemeTestSuite,
  DesignSystemValidator,
  
  // WebSocket Test
  WebSocketTest,
  
  // Settings
  SettingsPage,
  HelpPage,
  
  // Nuevas páginas
  NotificationsPage,
  StudyRoomsPage,
  
  // PWA & Beta
  PWADemo,
  BetaRegister,
  HomePageAlternative,
  
  // 404
  NotFoundPage,
  
  // Onboarding
  OnboardingDemo,
};

// Funciones de preload
export const preloadCriticalComponents = () => {
  // Precargar componentes críticos que se usan frecuentemente
  HomePage();
  LoginPage();
  Marketplace();
  UPlayPage();
};

export const preloadRouteComponents = (pathname: string) => {
  // Precargar componentes basado en la ruta actual
  switch (pathname) {
    case '/':
      HomePage();
      break;
    case '/marketplace':
      Marketplace();
      MarketplaceTest();
      break;
    case '/uplay':
      UPlayPage();
      UnifiedUPlay();
      break;
    case '/social':
      Social();
      SocialChat();
      SocialFeed();
      break;
    case '/challenges':
      ChallengesPage();
      break;
    case '/groups':
      GroupsPage();
      break;
    case '/profile':
      ProfilePage();
      break;
    case '/wallet':
      WalletPage();
      break;
    case '/lets':
      LetsPage();
      LetsAnalyticsDashboard();
      break;
    case '/ustats':
      UStatsPage();
      break;
    case '/analytics':
      AnalyticsPage();
      break;
    default:
      // Para rutas dinámicas o no reconocidas, precargar componentes comunes
      if (pathname.startsWith('/uplay/')) {
        UPlayVideoPlayer();
        InteractiveVideoEnhanced();
      } else if (pathname.startsWith('/challenges/')) {
        ChallengeDetailPage();
      } else if (pathname.startsWith('/video/')) {
        VideoPlayer();
      }
      break;
  }
};