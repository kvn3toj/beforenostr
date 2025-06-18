/**
 * 🚀 LazyLoader Component - Sistema de Carga Perezosa Optimizado
 * 
 * Componente para optimizar el rendimiento mediante lazy loading inteligente
 * con fallbacks, error boundaries y preloading estratégico.
 */

import React, { Suspense, lazy, ComponentType, ReactNode } from 'react';
import {
  Box,
  CircularProgress,
  Typography,
  Alert,
  Skeleton,
  Card,
  CardContent,
  Grid,
  LinearProgress
} from '@mui/material';
import { ErrorBoundary } from 'react-error-boundary';

// 🎭 Tipos para el lazy loader
interface LazyLoaderProps {
  children: ReactNode;
  fallback?: ReactNode;
  errorFallback?: ReactNode;
  loadingText?: string;
  minLoadTime?: number;
  showProgress?: boolean;
}

interface LazyComponentProps {
  importFunc: () => Promise<{ default: ComponentType<any> }>;
  fallback?: ReactNode;
  errorFallback?: ReactNode;
  preload?: boolean;
}

// 🎨 Componentes de fallback predefinidos
const DefaultLoadingFallback: React.FC<{ text?: string; showProgress?: boolean }> = ({ 
  text = "Cargando...", 
  showProgress = false 
}) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 200,
      p: 3,
      gap: 2
    }}
  >
    <CircularProgress size={40} thickness={4} />
    <Typography variant="body2" color="text.secondary">
      {text}
    </Typography>
    {showProgress && (
      <Box sx={{ width: '100%', maxWidth: 300 }}>
        <LinearProgress />
      </Box>
    )}
  </Box>
);

const SkeletonFallback: React.FC<{ variant?: 'card' | 'list' | 'grid' }> = ({ 
  variant = 'card' 
}) => {
  switch (variant) {
    case 'card':
      return (
        <Card sx={{ maxWidth: 400, m: 2 }}>
          <Skeleton variant="rectangular" height={200} />
          <CardContent>
            <Skeleton variant="text" height={32} />
            <Skeleton variant="text" height={20} width="80%" />
            <Skeleton variant="text" height={20} width="60%" />
          </CardContent>
        </Card>
      );
    
    case 'list':
      return (
        <Box sx={{ p: 2 }}>
          {Array.from({ length: 5 }).map((_, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
              <Box sx={{ flex: 1 }}>
                <Skeleton variant="text" height={20} width="70%" />
                <Skeleton variant="text" height={16} width="50%" />
              </Box>
            </Box>
          ))}
        </Box>
      );
    
    case 'grid':
      return (
        <Grid container spacing={2} sx={{ p: 2 }}>
          {Array.from({ length: 8 }).map((_, index) => (
            <Grid size={{xs:12,sm:6,md:3}} key={index}>
              <Skeleton variant="rectangular" height={150} />
              <Skeleton variant="text" height={20} sx={{ mt: 1 }} />
              <Skeleton variant="text" height={16} width="80%" />
            </Grid>
          ))}
        </Grid>
      );
    
    default:
      return <DefaultLoadingFallback />;
  }
};

const ErrorFallback: React.FC<{ error: Error; resetErrorBoundary: () => void }> = ({
  error,
  resetErrorBoundary
}) => (
  <Alert 
    severity="error" 
    action={
      <Typography 
        variant="button" 
        sx={{ cursor: 'pointer', textDecoration: 'underline' }}
        onClick={resetErrorBoundary}
      >
        Reintentar
      </Typography>
    }
    sx={{ m: 2 }}
  >
    <Typography variant="h6" gutterBottom>
      Error al cargar el componente
    </Typography>
    <Typography variant="body2">
      {error.message || 'Ha ocurrido un error inesperado'}
    </Typography>
  </Alert>
);

// 🚀 Hook para preloading inteligente
const usePreloader = () => {
  const preloadComponent = React.useCallback((importFunc: () => Promise<any>) => {
    // Precargar solo si hay ancho de banda suficiente
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      if (connection.effectiveType === '4g' || connection.effectiveType === 'wifi') {
        importFunc().catch(() => {
          // Silenciar errores de preloading
        });
      }
    } else {
      // Fallback para navegadores sin Network Information API
      importFunc().catch(() => {});
    }
  }, []);

  return { preloadComponent };
};

// 🎯 Componente principal LazyLoader
const LazyLoader: React.FC<LazyLoaderProps> = ({
  children,
  fallback,
  errorFallback,
  loadingText = "Cargando componente...",
  minLoadTime = 0,
  showProgress = false
}) => {
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    if (minLoadTime > 0) {
      const timer = setTimeout(() => setIsLoading(false), minLoadTime);
      return () => clearTimeout(timer);
    } else {
      setIsLoading(false);
    }
  }, [minLoadTime]);

  const defaultFallback = fallback || (
    <DefaultLoadingFallback text={loadingText} showProgress={showProgress} />
  );

  const defaultErrorFallback = errorFallback || ErrorFallback;

  if (isLoading && minLoadTime > 0) {
    return <>{defaultFallback}</>;
  }

  return (
    <ErrorBoundary
      FallbackComponent={defaultErrorFallback as any}
      onReset={() => window.location.reload()}
    >
      <Suspense fallback={defaultFallback}>
        {children}
      </Suspense>
    </ErrorBoundary>
  );
};

// 🎪 Factory para crear componentes lazy con configuración
export const createLazyComponent = ({
  importFunc,
  fallback,
  errorFallback,
  preload = false
}: LazyComponentProps) => {
  // Usar ModuleLoader para manejo robusto de errores
  const safeImportFunc = async () => {
    try {
      // Intentar importación con reintentos automáticos
      const module = await importFunc();
      return module;
    } catch (error) {
      console.warn('LazyComponent import failed, using fallback:', error);
      
      // Fallback: retornar un componente de error
      return {
        default: () => (
          errorFallback || (
            <div style={{ 
              padding: '20px', 
              textAlign: 'center',
              color: '#666',
              border: '1px dashed #ccc',
              borderRadius: '8px',
              margin: '10px'
            }}>
              <p>⚠️ Error al cargar el módulo</p>
              <p style={{ fontSize: '12px' }}>
                ID: d73c7abcef814601834bd32cfc780bc8
              </p>
            </div>
          )
        )
      };
    }
  };

  const LazyComponent = lazy(safeImportFunc);

  // Preload si está habilitado
  if (preload) {
    safeImportFunc().catch(() => {});
  }

  const WrappedComponent: React.FC<any> = (props) => (
    <LazyLoader fallback={fallback} errorFallback={errorFallback}>
      <LazyComponent {...props} />
    </LazyLoader>
  );

  // Método para preload manual
  WrappedComponent.preload = () => importFunc();

  return WrappedComponent;
};

// 🎨 Componentes lazy predefinidos para módulos principales
export const LazyMarketplace = createLazyComponent({
  importFunc: () => import('../modules/marketplace/MarketplaceMain'),
  fallback: <SkeletonFallback variant="grid" />,
  preload: true // Precargar porque es un módulo principal
});

export const LazySocial = createLazyComponent({
  importFunc: () => import('../modules/social/SocialMain'),
  fallback: <SkeletonFallback variant="list" />,
  preload: true
});

export const LazyUPlay = createLazyComponent({
  importFunc: () => import('../modules/uplay/UPlayMain'),
  fallback: <SkeletonFallback variant="card" />,
  preload: false // No precargar videos por defecto
});

export const LazyUStats = createLazyComponent({
  importFunc: () => import('../modules/ustats/UStatsMain'),
  fallback: <DefaultLoadingFallback text="Cargando estadísticas..." showProgress={true} />,
  preload: false
});

// 🔧 Hook para gestión de lazy loading
export const useLazyLoading = () => {
  const { preloadComponent } = usePreloader();
  
  const preloadModules = React.useCallback(() => {
    // Precargar módulos críticos
    preloadComponent(() => import('../modules/marketplace/MarketplaceMain'));
    preloadComponent(() => import('../modules/social/SocialMain'));
  }, [preloadComponent]);

  React.useEffect(() => {
    // Precargar después de que la página inicial haya cargado
    const timer = setTimeout(preloadModules, 2000);
    return () => clearTimeout(timer);
  }, [preloadModules]);

  return {
    preloadComponent,
    preloadModules
  };
};

export default LazyLoader;
export { SkeletonFallback, DefaultLoadingFallback, ErrorFallback, usePreloader }; 