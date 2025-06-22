import React, { lazy } from 'react';

// Este archivo centraliza la carga perezosa de componentes de página para el enrutador.
// Los componentes de página usan exportaciones por defecto (export default)

// Helper para crear componentes lazy-loaded con exportaciones por defecto
const createLazyPage = (path: string) => {
  return lazy(() => import(`../pages/${path}.tsx`));
};

// --- Definiciones de Páginas Cargadas Perezosamente ---

// Páginas Principales y de Autenticación (exportaciones por defecto)
const HomePage = createLazyPage('HomePage');
const LoginPage = createLazyPage('LoginPage');
const Login = createLazyPage('Login');
const RegisterPage = createLazyPage('RegisterPage');
const Register = createLazyPage('Register');

// Módulos Principales de la SuperApp (exportaciones por defecto)
const Marketplace = createLazyPage('Marketplace');
const MarketplacePage = createLazyPage('MarketplacePage');
const UPlay = createLazyPage('UPlay');
const Social = createLazyPage('Social');
const Profile = createLazyPage('Profile');
const Wallet = createLazyPage('Wallet');

// Módulos Secundarios (exportaciones por defecto o nombradas según el archivo)
const ChallengesPage = createLazyPage('ChallengesPage');
const GroupsPage = createLazyPage('GroupsPage');
const ChallengeDetailPage = createLazyPage('ChallengeDetailPage');
const UStatsPage = createLazyPage('UStats');
const AnalyticsPage = createLazyPage('Analytics');
const LetsPage = createLazyPage('LetsPage');
const SettingsPage = createLazyPage('Settings');
const NotificationsPage = createLazyPage('NotificationsPage');
const StudyRoomsPage = createLazyPage('StudyRoomsPage');

// Rutas de Video y UPlay (exportaciones por defecto)
const UPlayVideoPlayer = createLazyPage('UPlayVideoPlayer');
const UnifiedUPlay = createLazyPage('UnifiedUPlay');
const InteractiveVideoEnhanced = createLazyPage('InteractiveVideoEnhanced');
const InteractiveVideoDemo = createLazyPage('InteractiveVideoDemo');
const VideoHome = createLazyPage('VideoHome');
const VideoPlayer = createLazyPage('VideoPlayer');

// Rutas de Marketplace (exportaciones por defecto)
const MarketplaceTest = createLazyPage('MarketplaceTest');

// Rutas Sociales (exportaciones por defecto)
const SocialChat = createLazyPage('SocialChat');
const SocialFeed = createLazyPage('SocialFeed');

// Páginas Especiales y de Desarrollo (exportaciones por defecto)
const DesignSystemShowcase = createLazyPage('DesignSystemShowcase');
const WebSocketTest = createLazyPage('StudyRoomsPage'); // Reutiliza una página existente

// PWA & Beta (exportaciones por defecto)
const PWADemo = createLazyPage('PWADemo');
const BetaRegister = createLazyPage('BetaRegister');

// Página de Error (exportación por defecto)
const NotFoundPage = createLazyPage('NotFoundPage');

// Componentes de Onboarding (pueden ser renderizados como páginas)
const OnboardingDemo = lazy(() => import('../components/onboarding/OnboardingDemo'));

// --- Mapa de Componentes para el Enrutador ---

export const LazyPages = {
  // Main Pages
  HomePage,
  LoginPage,
  Login,
  RegisterPage,
  Register,
  Marketplace,
  MarketplacePage,
  UPlay,
  UPlayPage: UPlay, // Alias para compatibilidad
  Social,
  SocialPage: Social, // Alias para compatibilidad
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
};

// --- Funciones de Precarga ---

export const preloadCriticalComponents = () => {
  // Precarga componentes críticos para una experiencia inicial fluida.
  try {
    import('../pages/HomePage.tsx');
    import('../pages/LoginPage.tsx');
    import('../pages/Marketplace.tsx');
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
        import('../pages/Marketplace.tsx');
        import('../pages/MarketplaceTest.tsx');
        break;
      case '/uplay':
        import('../pages/UPlay.tsx');
        import('../pages/UnifiedUPlay.tsx');
        break;
      case '/social':
        import('../pages/Social.tsx');
        import('../pages/SocialChat.tsx');
        import('../pages/SocialFeed.tsx');
        break;
      case '/challenges':
        import('../pages/ChallengesPage.tsx');
        break;
      case '/groups':
        import('../pages/GroupsPage.tsx');
        break;
      case '/profile':
        import('../pages/Profile.tsx');
        break;
      case '/wallet':
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
