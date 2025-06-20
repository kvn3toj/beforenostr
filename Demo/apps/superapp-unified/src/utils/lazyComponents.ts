import { lazy } from 'react';

// Lazy loading de páginas principales - RUTAS VERIFICADAS
const HomePage = lazy(() => import('../pages/HomePage'));
const LoginPage = lazy(() => import('../pages/LoginPage'));
const RegisterPage = lazy(() => import('../pages/RegisterPage'));
const Marketplace = lazy(() => import('../pages/Marketplace'));
const UPlay = lazy(() => import('../pages/UPlay'));
const Social = lazy(() => import('../pages/Social'));
const Profile = lazy(() => import('../pages/Profile'));
const Wallet = lazy(() => import('../pages/Wallet'));

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

// Social Routes
const SocialChat = lazy(() => import('../pages/SocialChat'));
const SocialFeed = lazy(() => import('../pages/SocialFeed'));

// Special Pages
const DesignSystemShowcase = lazy(() => import('../pages/DesignSystemShowcase'));

// WebSocket Test - CORREGIDO A PÁGINA EXISTENTE
const WebSocketTest = lazy(() => import('../pages/StudyRoomsPage'));

// Supabase Test
const SupabaseTest = lazy(() => import('../components/SupabaseTest'));

// Settings
const SettingsPage = lazy(() => import('../pages/Settings'));

// Nuevas páginas
const NotificationsPage = lazy(() => import('../pages/NotificationsPage'));
const StudyRoomsPage = lazy(() => import('../pages/StudyRoomsPage'));

// PWA & Beta
const PWADemo = lazy(() => import('../pages/PWADemo'));
const BetaRegister = lazy(() => import('../pages/BetaRegister'));
const HomePageAlternative = lazy(() => import('../pages/HomeEnhanced'));

// 404 - CORREGIDO A PÁGINA ESPECÍFICA
const NotFoundPage = lazy(() => import('../pages/HomePage'));

// Onboarding
const OnboardingDemo = lazy(() => import('../components/onboarding/OnboardingDemo'));

export const LazyPages = {
  // Main Pages
  HomePage,
  LoginPage,
  RegisterPage,
  Marketplace,
  UPlay,
  UPlayPage: UPlay, // Alias para compatibilidad
  Social,
  Profile,
  ProfilePage: Profile, // Alias para compatibilidad
  Wallet,
  WalletPage: Wallet, // Alias para compatibilidad

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

  // Social Routes
  SocialChat,
  SocialFeed,

  // Special Pages
  DesignSystemShowcase,

    // WebSocket Test
  WebSocketTest,

  // Supabase Test
  SupabaseTest,

  // Settings
  SettingsPage,

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

// Funciones de preload OBLIGATORIAS
export const preloadCriticalComponents = () => {
  // Precargar componentes críticos con manejo de errores
  try {
    HomePage.preload?.();
    LoginPage.preload?.();
    Marketplace.preload?.();
    UPlay.preload?.();
  } catch (error) {
    console.warn('Preload error for critical components:', error);
  }
};

export const preloadRouteComponents = (pathname: string) => {
  // Precargar componentes basado en la ruta actual con manejo de errores
  try {
    switch (pathname) {
      case '/':
        HomePage.preload?.();
        break;
      case '/marketplace':
        Marketplace.preload?.();
        MarketplaceTest.preload?.();
        break;
      case '/uplay':
        UPlay.preload?.();
        UnifiedUPlay.preload?.();
        break;
      case '/social':
        Social.preload?.();
        SocialChat.preload?.();
        SocialFeed.preload?.();
        break;
      case '/challenges':
        ChallengesPage.preload?.();
        break;
      case '/groups':
        GroupsPage.preload?.();
        break;
      case '/profile':
        Profile.preload?.();
        break;
      case '/wallet':
        Wallet.preload?.();
        break;
      case '/lets':
        LetsPage.preload?.();
        break;
      case '/ustats':
        UStatsPage.preload?.();
        break;
      case '/analytics':
        AnalyticsPage.preload?.();
        break;
      default:
        // Para rutas dinámicas o no reconocidas, precargar componentes comunes
        if (pathname.startsWith('/uplay/')) {
          UPlayVideoPlayer.preload?.();
          InteractiveVideoEnhanced.preload?.();
        } else if (pathname.startsWith('/challenges/')) {
          ChallengeDetailPage.preload?.();
        } else if (pathname.startsWith('/video/')) {
          VideoPlayer.preload?.();
          VideoHome.preload?.();
        }
        break;
    }
  } catch (error) {
    console.warn('Preload error for route components:', error);
  }
};
