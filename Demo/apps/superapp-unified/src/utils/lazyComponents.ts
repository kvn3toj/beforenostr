import { lazy } from 'react';

// Lazy loaded pages
const OnboardingDemo = lazy(() => import('../components/onboarding/OnboardingDemo'));

// Preload functions
export const preloadCriticalComponents = () => {
  // Preload critical components for better performance
  console.log('[LazyComponents] Preloading critical components...');
  // Add specific preloading logic here if needed
};

export const preloadRouteComponents = (pathname: string) => {
  // Preload components based on route
  console.log(`[LazyComponents] Preloading components for route: ${pathname}`);
  // Add route-specific preloading logic here if needed
};

export const LazyPages = {
  // Onboarding
  OnboardingDemo,
  
  // Main Pages - Add placeholders for now
  HomePage: lazy(() => import('../pages/HomePage')),
  LoginPage: lazy(() => import('../pages/LoginPage')),
  RegisterPage: lazy(() => import('../pages/RegisterPage')),
  Marketplace: lazy(() => import('../pages/MarketplacePage')),
  UPlayPage: lazy(() => import('../pages/UPlayPage')),
  Social: lazy(() => import('../pages/SocialPage')),
  ProfilePage: lazy(() => import('../pages/ProfilePage')),
  WalletPage: lazy(() => import('../pages/WalletPage')),
  ChallengesPage: lazy(() => import('../pages/ChallengesPage')),
  GroupsPage: lazy(() => import('../pages/GroupsPage')),
  UStatsPage: lazy(() => import('../pages/UStatsPage')),
  AnalyticsPage: lazy(() => import('../pages/AnalyticsPage')),
  
  // Video/UPlay Routes
  UPlayVideoPlayer: lazy(() => import('../components/modules/uplay/UPlayVideoPlayer')),
  UnifiedUPlay: lazy(() => import('../components/modules/uplay/UnifiedUPlay')),
  InteractiveVideoEnhanced: lazy(() => import('../components/modules/uplay/InteractiveVideoEnhanced')),
  InteractiveVideoDemo: lazy(() => import('../components/modules/uplay/InteractiveVideoDemo')),
  VideoHome: lazy(() => import('../pages/VideoHomePage')),
  VideoPlayer: lazy(() => import('../components/modules/uplay/VideoPlayer')),
  
  // Marketplace Routes
  MarketplaceTest: lazy(() => import('../pages/MarketplaceTestPage')),
  
  // LETS Routes
  LetsPage: lazy(() => import('../pages/LetsPage')),
  LetsAnalyticsDashboard: lazy(() => import('../pages/LetsAnalyticsDashboard')),
  
  // Challenge Routes
  ChallengeDetailPage: lazy(() => import('../pages/ChallengeDetailPage')),
  
  // Social Routes
  SocialChat: lazy(() => import('../pages/SocialChatPage')),
  SocialFeed: lazy(() => import('../pages/SocialFeedPage')),
  
  // Special Pages
  DesignSystemShowcase: lazy(() => import('../components/ui/DesignSystemShowcase')),
  ThemeTestSuite: lazy(() => import('../components/ui/ThemeTestSuite')),
  DesignSystemValidator: lazy(() => import('../components/ui/DesignSystemValidator')),
  
  // WebSocket Test
  WebSocketTest: lazy(() => import('../pages/WebSocketTestPage')),
  
  // Settings
  SettingsPage: lazy(() => import('../pages/SettingsPage')),
  HelpPage: lazy(() => import('../pages/HelpPage')),
  
  // New Pages
  NotificationsPage: lazy(() => import('../pages/NotificationsPage')),
  StudyRoomsPage: lazy(() => import('../pages/StudyRoomsPage')),
  
  // PWA Demo
  PWADemo: lazy(() => import('../pages/PWADemoPage')),
  BetaRegister: lazy(() => import('../pages/BetaRegisterPage')),
  HomePageAlternative: lazy(() => import('../pages/HomePageAlternative')),
  
  // 404 Page
  NotFoundPage: lazy(() => import('../pages/NotFoundPage')),
};