import React, { lazy } from 'react';

// Este archivo centraliza la carga perezosa de componentes de página para el enrutador.
// Utiliza el patrón React.lazy con exportaciones nombradas, ya que nuestros componentes de página
// siguen la convención `export const PageName = ...` en lugar de `export default`.

// Helper para crear componentes lazy-loaded, asumiendo exportación nombrada.
const createLazyPage = (path: string, componentName: string) => {
  return lazy(() => import(`../pages/${path}`).then(module => ({ default: (module as any)[componentName] })));
};

// --- Definiciones de Páginas Cargadas Perezosamente ---

// Páginas Principales y de Autenticación
const HomePage = createLazyPage('HomePage', 'HomePage');
const LoginPage = createLazyPage('LoginPage', 'LoginPage');
const RegisterPage = createLazyPage('RegisterPage', 'RegisterPage');

// Módulos Principales de la SuperApp
const Marketplace = createLazyPage('Marketplace', 'Marketplace');
const UPlay = createLazyPage('UPlay', 'UPlayPage'); // El archivo es UPlay.tsx, el componente es UPlayPage
const Social = createLazyPage('Social', 'SocialPage'); // El archivo es Social.tsx, el componente es SocialPage
const Profile = createLazyPage('Profile', 'ProfilePage');
const Wallet = createLazyPage('Wallet', 'WalletPage');

// Módulos Secundarios (Challenges, Groups, etc.)
const ChallengesPage = createLazyPage('ChallengesPage', 'ChallengesPage');
const GroupsPage = createLazyPage('GroupsPage', 'GroupsPage');
const ChallengeDetailPage = createLazyPage('ChallengeDetailPage', 'ChallengeDetailPage');
const UStatsPage = createLazyPage('UStats', 'UStatsPage');
const AnalyticsPage = createLazyPage('Analytics', 'AnalyticsPage');
const LetsPage = createLazyPage('LetsPage', 'LetsPage');
const SettingsPage = createLazyPage('Settings', 'SettingsPage');
const NotificationsPage = createLazyPage('NotificationsPage', 'NotificationsPage');
const StudyRoomsPage = createLazyPage('StudyRoomsPage', 'StudyRoomsPage');

// Rutas de Video y UPlay (Componentes más específicos)
const UPlayVideoPlayer = createLazyPage('UPlayVideoPlayer', 'UPlayVideoPlayer');
const UnifiedUPlay = createLazyPage('UnifiedUPlay', 'UnifiedUPlay');
const InteractiveVideoEnhanced = createLazyPage('InteractiveVideoEnhanced', 'InteractiveVideoEnhanced');
const InteractiveVideoDemo = createLazyPage('InteractiveVideoDemo', 'InteractiveVideoDemo');
const VideoHome = createLazyPage('VideoHome', 'VideoHome');
const VideoPlayer = createLazyPage('VideoPlayer', 'VideoPlayer');

// Rutas de Marketplace (Componentes más específicos)
const MarketplaceTest = createLazyPage('MarketplaceTest', 'MarketplaceTest');

// Rutas Sociales (Componentes más específicos)
const SocialChat = createLazyPage('SocialChat', 'SocialChat');
const SocialFeed = createLazyPage('SocialFeed', 'SocialFeed');

// Páginas Especiales y de Desarrollo
const DesignSystemShowcase = createLazyPage('DesignSystemShowcase', 'DesignSystemShowcase');
const WebSocketTest = createLazyPage('StudyRoomsPage', 'StudyRoomsPage'); // Reutiliza una página existente

// PWA & Beta
const PWADemo = createLazyPage('PWADemo', 'PWADemo');
const BetaRegister = createLazyPage('BetaRegister', 'BetaRegister');

// Página de Error
const NotFoundPage = createLazyPage('NotFoundPage', 'NotFoundPage');

// Componentes de Onboarding (pueden ser renderizados como páginas)
const OnboardingDemo = lazy(() => import('../components/onboarding/OnboardingDemo').then(module => ({ default: module.OnboardingDemo })));


// --- Mapa de Componentes para el Enrutador ---

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
    import('../pages/HomePage');
    import('../pages/LoginPage');
    import('../pages/Marketplace');
    import('../pages/UPlay');
  } catch (error) {
    console.warn('Error during critical components preload:', error);
  }
};

export const preloadRouteComponents = (pathname: string) => {
  // Precarga componentes de forma oportunista basado en la ruta del usuario.
  try {
    switch (pathname) {
      case '/':
        import('../pages/HomePage');
        break;
      case '/marketplace':
        import('../pages/Marketplace');
        import('../pages/MarketplaceTest');
        break;
      case '/uplay':
        import('../pages/UPlay');
        import('../pages/UnifiedUPlay');
        break;
      case '/social':
        import('../pages/Social');
        import('../pages/SocialChat');
        import('../pages/SocialFeed');
        break;
      case '/challenges':
        import('../pages/ChallengesPage');
        break;
      case '/groups':
        import('../pages/GroupsPage');
        break;
      case '/profile':
        import('../pages/Profile');
        break;
      case '/wallet':
        import('../pages/Wallet');
        break;
      case '/lets':
        import('../pages/LetsPage');
        break;
      case '/ustats':
        import('../pages/UStats');
        break;
      case '/analytics':
        import('../pages/Analytics');
        break;
      default:
        if (pathname.startsWith('/uplay/')) {
          import('../pages/UPlayVideoPlayer');
          import('../pages/InteractiveVideoEnhanced');
        } else if (pathname.startsWith('/challenges/')) {
          import('../pages/ChallengeDetailPage');
        } else if (pathname.startsWith('/video/')) {
          import('../pages/VideoPlayer');
          import('../pages/VideoHome');
        }
        break;
    }
  } catch (error) {
    console.warn(`Error during component preload for path ${pathname}:`, error);
  }
};
