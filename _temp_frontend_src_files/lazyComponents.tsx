import React, { Suspense, useState, useEffect } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

/**
 * Componente de loading simple para lazy loading
 */
const SimpleLoader: React.FC = () => (
  <Box className="flex items-center justify-center p-8">
    <CircularProgress size={32} />
  </Box>
);

/**
 * Función para crear componentes lazy con fallback personalizado
 */
export const createLazyComponent = <T extends React.ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  fallback: React.ReactNode = <SimpleLoader />
) => {
  const LazyComponent = React.lazy(importFn);
  
  return React.forwardRef<any, React.ComponentProps<T>>((props, ref) => (
    <Suspense fallback={fallback}>
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
    () => import('../pages/HomePage'),
    <SimpleLoader />
  ),
  
  MarketplacePage: createLazyComponent(
    () => import('../pages/MarketplacePage'),
    <SimpleLoader />
  ),
  
  SocialPage: createLazyComponent(
    () => import('../pages/SocialPage'),
    <SimpleLoader />
  ),
  
  ProfilePage: createLazyComponent(
    () => import('../pages/ProfilePage'),
    <SimpleLoader />
  ),
  
  WalletPage: createLazyComponent(
    () => import('../pages/WalletPage'),
    <SimpleLoader />
  ),
  
  SettingsPage: createLazyComponent(
    () => import('../pages/SettingsPage'),
    <SimpleLoader />
  ),
  
  // Login and Auth
  LoginPage: createLazyComponent(
    () => import('../pages/LoginPage'),
    <SimpleLoader />
  ),
  
  RegisterPage: createLazyComponent(
    () => import('../pages/RegisterPage'),
    <SimpleLoader />
  ),
  
  // Other existing pages
  ChallengesPage: createLazyComponent(
    () => import('../pages/ChallengesPage'),
    <SimpleLoader />
  ),
  
  GroupsPage: createLazyComponent(
    () => import('../pages/GroupsPage'),
    <SimpleLoader />
  ),
  
  GamifiedPlaylistsPage: createLazyComponent(
    () => import('../pages/GamifiedPlaylistsPage'),
    <SimpleLoader />
  ),
  
  MundosPage: createLazyComponent(
    () => import('../pages/MundosPage'),
    <SimpleLoader />
  ),
  
  // Design System Components
  DesignSystemShowcase: createLazyComponent(
    () => import('../components/ui/DesignSystemShowcase'),
    <SimpleLoader />
  ),
  
  ThemeTestSuite: createLazyComponent(
    () => import('../components/ui/ThemeTestSuite'),
    <SimpleLoader />
  ),
  
  DesignSystemValidator: createLazyComponent(
    () => import('../components/ui/DesignSystemValidator'),
    <SimpleLoader />
  ),
  
  PerformanceMonitor: createLazyComponent(
    () => import('../components/ui/PerformanceMonitor'),
    <SimpleLoader />
  ),
};

/**
 * Lazy loading de módulos principales que existen
 */
export const LazyModules = {
  // Home modules - verificar si existen
  ModuleCards: createLazyComponent(
    () => import('../components/home/ModuleCards').catch(() => 
      import('../components/modules/ModuleCards')
    )
  ),
  
  // Theme test suite
  ThemeTestSuite: createLazyComponent(
    () => import('../components/ui/ThemeTestSuite')
  ),
};

/**
 * Preload critical components
 */
export const preloadCriticalComponents = () => {
  // Preload most commonly used components
  import('../pages/HomePage');
  import('../pages/LoginPage');
  import('../components/ui/ThemeTestSuite');
};

/**
 * Hook para lazy loading condicional
 */
export const useLazyComponent = <T extends React.ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  condition: boolean = true
) => {
  const [Component, setComponent] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
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
  if (loading) return <SimpleLoader />;
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
      import('../pages/HomePage');
      break;
    case '/marketplace':
      import('../pages/MarketplacePage');
      break;
    case '/social':
      import('../pages/SocialPage');
      break;
    case '/profile':
      import('../pages/ProfilePage');
      break;
    case '/wallet':
      import('../pages/WalletPage');
      break;
    case '/challenges':
      import('../pages/ChallengesPage');
      break;
    case '/groups':
      import('../pages/GroupsPage');
      break;
    case '/settings':
      import('../pages/SettingsPage');
      break;
    case '/design-system':
      import('../components/ui/DesignSystemShowcase');
      break;
    case '/theme-test':
      import('../components/ui/ThemeTestSuite');
      break;
    default:
      break;
  }
}; 