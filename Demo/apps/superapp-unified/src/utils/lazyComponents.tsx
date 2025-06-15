import React, { Suspense } from 'react';
import { CircularProgress, Box } from '@mui/material';

// Componente de loading simple para evitar dependencias circulares
const SimpleLoader = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 3 }}>
    <CircularProgress />
  </Box>
);

/**
 * Utility para crear componentes lazy con loading personalizado
 */
export const createLazyComponent = <T extends React.ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  fallback?: React.ReactNode
) => {
  const LazyComponent = React.lazy(importFn);
  
  return React.forwardRef<any, React.ComponentProps<T>>((props, ref) => (
    <Suspense fallback={fallback || <SimpleLoader />}>
      <LazyComponent {...props} ref={ref} />
    </Suspense>
  ));
};

/**
 * Lazy loading de páginas principales que existen
 */
export const LazyPages = {
  // Páginas principales
  HomePage: createLazyComponent(
    () => import('../pages/Home'),
    <SimpleLoader />
  ),
  
  MarketplacePage: createLazyComponent(
    () => import('../pages/Marketplace'),
    <SimpleLoader />
  ),
  
  UPlayPage: createLazyComponent(
    () => import('../pages/UPlay'),
    <SimpleLoader />
  ),
  
  SocialPage: createLazyComponent(
    () => import('../pages/Social'),
    <SimpleLoader />
  ),
  
  ProfilePage: createLazyComponent(
    () => import('../pages/Profile'),
    <SimpleLoader />
  ),
  
  WalletPage: createLazyComponent(
    () => import('../pages/Wallet'),
    <SimpleLoader />
  ),
  
  // Páginas especiales
  DesignSystemShowcase: createLazyComponent(
    () => import('../pages/DesignSystemShowcase'),
    <SimpleLoader />
  ),
  
  ThemeTestSuite: createLazyComponent(
    () => import('../components/modules/ThemeTestSuite'),
    <SimpleLoader />
  ),
  
  // LETS Pages
  LetsPage: createLazyComponent(
    () => import('../pages/LetsPage'),
    <SimpleLoader />
  ),
  
  LetsMarketplace: createLazyComponent(
    () => import('../components/modules/marketplace/components/LetsMarketplace'),
    <SimpleLoader />
  ),
  
  LetsAnalyticsDashboard: createLazyComponent(
    () => import('../components/modules/marketplace/components/LetsAnalyticsDashboard'),
    <SimpleLoader />
  ),
  
  // Login and Auth
  LoginPage: createLazyComponent(
    () => import('../pages/Login'),
    <SimpleLoader />
  ),
  
  RegisterPage: createLazyComponent(
    () => import('../pages/Register'),
    <SimpleLoader />
  ),
  
  // Other existing pages
  ChallengesPage: createLazyComponent(
    () => import('../pages/ChallengesPage'),
    <SimpleLoader />
  ),
  
  GroupsPage: createLazyComponent(
    () => import('../pages/GroupsPageEnhanced'),
    <SimpleLoader />
  ),
  
  SettingsPage: createLazyComponent(
    () => import('../pages/Settings'),
    <SimpleLoader />
  ),
  
  HelpPage: createLazyComponent(
    () => import('../pages/Settings'), // Using Settings as placeholder for Help
    <SimpleLoader />
  ),
  
  NotFoundPage: createLazyComponent(
    () => import('../pages/Home'), // Using Home as placeholder for 404
    <SimpleLoader />
  ),
  
  // Design System Validator
  DesignSystemValidator: createLazyComponent(
    () => import('../components/ui/DesignSystemValidator'),
    <SimpleLoader />
  ),
};

/**
 * Lazy loading de módulos principales que existen
 */
export const LazyModules = {
  // Home modules
  ModuleCards: createLazyComponent(
    () => import('../components/home/ModuleCards')
  ),
  
  // Theme test suite
  ThemeTestSuite: createLazyComponent(
    () => import('../components/modules/ThemeTestSuite')
  ),
};

/**
 * Preload critical components
 */
export const preloadCriticalComponents = () => {
  // Preload most commonly used components
  import('../pages/Home');
  import('../pages/Login');
  import('../components/modules/ThemeTestSuite');
};

/**
 * Hook para lazy loading condicional
 */
export const useLazyComponent = <T extends React.ComponentType<any>>(
  condition: boolean,
  importFn: () => Promise<{ default: T }>,
  fallback?: React.ReactNode
) => {
  const [Component, setComponent] = React.useState<T | null>(null);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (condition && !Component && !loading) {
      setLoading(true);
      importFn()
        .then(module => {
          setComponent(() => module.default);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error loading lazy component:', error);
          setLoading(false);
        });
    }
  }, [condition, Component, loading, importFn]);

  if (!condition) return null;
  if (loading) return fallback || <SimpleLoader />;
  if (!Component) return null;

  return Component;
};

/**
 * Preload components based on route
 */
export const preloadRouteComponents = (route: string) => {
  switch (route) {
    case '/':
    case '/home':
      import('../pages/Home');
      break;
    case '/marketplace':
      import('../pages/Marketplace');
      break;
    case '/uplay':
      import('../pages/UPlay');
      break;
    case '/social':
      import('../pages/Social');
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
    case '/challenges':
      import('../pages/ChallengesPage');
      break;
    case '/groups':
      import('../pages/GroupsPageEnhanced');
      break;
    case '/settings':
      import('../pages/Settings');
      break;
    default:
      break;
  }
};

export default {
  LazyPages,
  LazyModules,
  createLazyComponent,
  preloadCriticalComponents,
  useLazyComponent,
  preloadRouteComponents,
}; 