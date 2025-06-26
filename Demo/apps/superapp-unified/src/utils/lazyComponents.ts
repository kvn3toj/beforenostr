import React, { lazy } from 'react';

// Este archivo centraliza la carga perezosa de componentes de página para el enrutador.
// Los componentes de página usan exportaciones por defecto (export default)

// Helper para crear componentes lazy-loaded con exportaciones por defecto
const createLazyPage = (path: string) => {
  return lazy(() => import(`../pages/${path}.tsx`));
};

// --- Definiciones de Páginas Cargadas Perezosamente ---

// Páginas Principales y de Autenticación
const HomePage = createLazyPage('HomePage');
const LoginPage = createLazyPage('LoginPage');
const RegisterPage = createLazyPage('RegisterPage');

// Módulos Principales de la SuperApp
const MarketplacePage = createLazyPage('MarketplacePage');
const UPlay = createLazyPage('UPlay');
const Social = createLazyPage('Social');
const Profile = createLazyPage('Profile');
const Wallet = createLazyPage('Wallet');

// Módulos Secundarios
const ChallengesPage = createLazyPage('ChallengesPage');
const GroupsPage = createLazyPage('GroupsPage');
const ChallengeDetailPage = createLazyPage('ChallengeDetailPage');
const UStatsPage = createLazyPage('UStats');
const AnalyticsPage = createLazyPage('Analytics');
const LetsPage = createLazyPage('LetsPage');
const SettingsPage = createLazyPage('Settings');
const NotificationsPage = createLazyPage('NotificationsPage');
const StudyRoomsPage = createLazyPage('StudyRoomsPage');
const ConsciousnessPage = createLazyPage('Consciousness');

// Rutas de Video y UPlay
const UPlayVideoPlayer = createLazyPage('UPlayVideoPlayer');
const InteractiveVideoEnhanced = createLazyPage('InteractiveVideoEnhanced');
const InteractiveVideoDemo = createLazyPage('InteractiveVideoDemo');
const VideoHome = createLazyPage('VideoHome');
const VideoPlayer = createLazyPage('VideoPlayer');

// Rutas de Marketplace
const MarketplaceTest = createLazyPage('MarketplaceTest');
const ProductDetail = createLazyPage('ProductDetail');

// Rutas Sociales
const SocialChat = createLazyPage('SocialChat');
const SocialFeed = createLazyPage('SocialFeed');

// Páginas Especiales y de Desarrollo
const DesignSystemShowcase = createLazyPage('DesignSystemShowcase');
const WebSocketTest = createLazyPage('StudyRoomsPage');

// PWA & Beta
const PWADemo = createLazyPage('PWADemo');
const BetaRegister = createLazyPage('BetaRegister');

// Página de Error
const NotFoundPage = createLazyPage('NotFoundPage');

// Componentes de Onboarding
const OnboardingDemo = lazy(() => import('../components/onboarding/OnboardingDemo'));

// [NUEVO] Portal del Viaje en UPlay
const UPlayJourneyPortal = lazy(() => import('../components/modules/uplay/UPlayJourneyPortal'));
const UPlayHarvestReflection = lazy(() => import('../components/modules/uplay/UPlayHarvestReflection'));

// [ATLAS/ANA] Lazy loading: Asegurado que UPlayInteractiveLibrary y UPlayWithStartTransition usan React.lazy
export const UPlayInteractiveLibrary = React.lazy(() => import('../components/modules/uplay/UPlayInteractiveLibrary'));
export const UPlayWithStartTransition = React.lazy(() => import('../components/modules/uplay/UPlayWithStartTransition'));

// --- Mapa de Componentes para el Enrutador ---

export const LazyPages = {
  // Main Pages
  HomePage,
  LoginPage,
  Login: LoginPage,
  RegisterPage,
  Register: RegisterPage,
  MarketplacePage,
  Marketplace: MarketplacePage,
  UPlay,
  UPlayPage: UPlay,
  Social,
  SocialPage: Social,
  Profile,
  ProfilePage: Profile,
  Wallet,
  WalletPage: Wallet,

  // Challenge & Group Pages
  ChallengesPage,
  GroupsPage,
  ChallengeDetailPage,

  // UStats & Analytics
  UStatsPage,
  AnalyticsPage,

  // Consciousness & Cosmic Archive
  ConsciousnessPage,

  // Video/UPlay Routes
  UPlayVideoPlayer,
  InteractiveVideoEnhanced,
  InteractiveVideoDemo,
  VideoHome,
  VideoPlayer,
  UPlayJourneyPortal,

  // Marketplace Routes
  MarketplaceTest,
  ProductDetail,

  // LETS Routes
  LetsPage,

  // Social Routes
  SocialChat,
  SocialFeed,

  // Special Pages
  DesignSystemShowcase,
  WebSocketTest,

  // Settings
  SettingsPage,

  // Nuevas páginas
  NotificationsPage,
  StudyRoomsPage,

  // PWA & Beta
  PWADemo,
  BetaRegister,

  // 404
  NotFoundPage,

  // Onboarding
  OnboardingDemo,

  // [NUEVO]
  UPlayHarvestReflection,
};

// --- Funciones de Precarga ---

export const preloadCriticalComponents = () => {
  // Precarga componentes críticos para una experiencia inicial fluida.
  try {
    import('../pages/HomePage.tsx');
    import('../pages/LoginPage.tsx');
    import('../pages/MarketplacePage.tsx');
    import('../pages/UPlay.tsx');
  } catch (error) {
    console.warn('Error during critical components preload:', error);
  }
};

export const preloadRouteComponents = (pathname: string) => {
  // Precarga componentes de forma oportunista basado en la ruta del usuario.
  try {
    switch (pathname) {
      case '/':
        import('../pages/HomePage.tsx');
        break;
      case '/marketplace':
        import('../pages/MarketplacePage.tsx');
        break;
      case '/uplay':
        import('../pages/UPlay.tsx');
        break;
      case '/social':
        import('../pages/Social.tsx');
        import('../pages/SocialChat.tsx');
        break;
      case '/challenges':
        import('../pages/ChallengesPage.tsx');
        break;
      case '/groups':
        import('../pages/GroupsPage.tsx');
        break;
      case '/profile':
        import('../pages/Profile.tsx');
        import('../pages/Wallet.tsx');
        break;
      case '/lets':
        import('../pages/LetsPage.tsx');
        break;
      case '/ustats':
        import('../pages/UStats.tsx');
        break;
      case '/analytics':
        import('../pages/Analytics.tsx');
        break;
      case '/consciousness':
        import('../pages/Consciousness.tsx');
        break;
      default:
        if (pathname.startsWith('/uplay/')) {
          import('../pages/UPlayVideoPlayer.tsx');
          import('../pages/InteractiveVideoEnhanced.tsx');
        } else if (pathname.startsWith('/challenges/')) {
          import('../pages/ChallengeDetailPage.tsx');
        } else if (pathname.startsWith('/video/')) {
          import('../pages/VideoPlayer.tsx');
          import('../pages/VideoHome.tsx');
        }
        break;
    }
  } catch (error) {
    console.warn(`Error during component preload for path ${pathname}:`, error);
  }
};
