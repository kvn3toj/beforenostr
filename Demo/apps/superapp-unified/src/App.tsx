import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Toaster } from 'sonner';

// Importar hook de monitoreo
import { usePageViewTracking } from './hooks/useMonitoring';

// Importar corrección CSS para cursor pointer
import './styles/cursor-fix.css';
// Importar CSS para indicadores de carga
import './styles/loading-indicators.css';
// Importar CSS para consistencia de border-radius en botones
import './styles/button-consistency.css';
// Importar CSS para optimizaciones de performance
import './styles/performance-optimizations.css';

// Layout Components
import { AppLayout } from './components/layout/AppLayout';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';

// Core Pages
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Home } from './pages/Home';

// Skeleton loaders for lazy-loaded components
import { DashboardSkeleton, AppLayoutSkeleton } from './components/ui/SkeletonLoaders';

// ⚡ LAZY LOADED PAGES - Code Splitting Implementation
// These components will be loaded on-demand when user navigates to them

// Profile Module - Heavy component (34KB, 958 lines)
const Profile = lazy(() => import('./pages/Profile').then(module => ({ default: module.Profile })));

// Wallet Module - Heavy component (32KB, 929 lines) 
const Wallet = lazy(() => import('./pages/Wallet').then(module => ({ default: module.Wallet })));

// Video Home Module - Heavy component (41KB, 1,175 lines)
const VideoHome = lazy(() => import('./pages/VideoHome').then(module => ({ default: module.VideoHome })));

// Module Pages - Medium priority lazy loading
const Marketplace = lazy(() => import('./pages/Marketplace').then(module => ({ default: module.Marketplace })));
const ProductDetails = lazy(() => import('./pages/ProductDetails').then(module => ({ default: module.ProductDetails })));
const UPlay = lazy(() => import('./pages/UPlay').then(module => ({ default: module.UPlay })));
const VideoPlayer = lazy(() => import('./pages/VideoPlayer').then(module => ({ default: module.VideoPlayer })));
const Analytics = lazy(() => import('./pages/Analytics').then(module => ({ default: module.Analytics })));
const Social = lazy(() => import('./pages/Social').then(module => ({ default: module.Social })));

// Admin Pages - High priority lazy loading (admin-only access)
const AdminLayout = lazy(() => import('./components/admin/AdminLayout').then(module => ({ default: module.AdminLayout })));
const AdminProtectedRoute = lazy(() => import('./components/admin/AdminProtectedRoute').then(module => ({ default: module.AdminProtectedRoute })));

// Pilgrim Experience - Medium priority lazy loading
const PilgrimJourney = lazy(() => import('./components/pilgrim/PilgrimJourney').then(module => ({ default: module.PilgrimJourney })));

// Additional components not already declared above
const SocialChat = lazy(() => import('./pages/SocialChat').then(module => ({ default: module.SocialChat })));
const SocialFeed = lazy(() => import('./pages/SocialFeed').then(module => ({ default: module.SocialFeed })));
const Mundos = lazy(() => import('./pages/Mundos').then(module => ({ default: module.Mundos })));
const PWADemo = lazy(() => import('./pages/PWADemo').then(module => ({ default: module.default })));

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 🧠 CACHE INTELIGENTE - Configuración Avanzada Optimizada
      staleTime: 1000 * 60 * 5, // 5 minutes - Datos considerados "frescos"
      gcTime: 1000 * 60 * 30, // 30 minutes - Tiempo en cache después de ser "stale" (antes cacheTime)
      retry: (failureCount, error) => {
        // Retry strategy personalizada basada en el tipo de error
        if (failureCount >= 3) return false;
        
        // Categorizar errores por tipo
        const errorMessage = error?.message || '';
        const isNetworkError = errorMessage.includes('Network') || errorMessage.includes('fetch');
        const isTimeoutError = errorMessage.includes('timeout') || errorMessage.includes('Timeout');
        const isServerError = error instanceof Error && 
          ((error as any).statusCode >= 500 || (error as any).category === 'server');
        
        // Más reintentos para errores de red y servidor
        if (isNetworkError || isServerError) {
          return failureCount < 5;
        }
        if (isTimeoutError) {
          return failureCount < 4;
        }
        
        // Menos reintentos para errores de autenticación y validación
        if ((error as any).category === 'auth' || (error as any).category === 'validation') {
          return false;
        }
        
        return failureCount < 3;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Backoff exponencial
      refetchOnWindowFocus: false, // Evitar refetch automático al volver a la ventana
      refetchOnReconnect: true, // Refetch al reconectar a internet
      refetchOnMount: true, // Refetch al montar componente si los datos están stale
      // Cache strategies por tipo de query
      networkMode: 'online', // Solo hacer queries cuando hay conexión
      // Configuración para prefetching inteligente
      refetchInterval: false, // Deshabilitado por defecto, habilitado específicamente por query
      refetchIntervalInBackground: false, // No refetch en background por defecto
      // Configuración para detectar datos obsoletos
      structuralSharing: true, // Optimización para evitar re-renders innecesarios
    },
    mutations: {
      // 🔄 MUTACIONES - Configuración Optimizada
      retry: (failureCount, error) => {
        // Solo reintentar mutaciones para errores de red/servidor
        if (failureCount >= 2) return false;
        
        const isRetriable = (error as any).isRetriable || 
          (error as any).category === 'network' || 
          (error as any).category === 'server';
        
        return isRetriable;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
      networkMode: 'online',
      // Configuración global para optimistic updates
      onMutate: async () => {
        // Cancelar queries relacionadas para evitar condiciones de carrera
        // Esta función será sobrescrita en mutaciones específicas
      },
      onError: (error, variables, context) => {
        // Rollback optimistic updates en caso de error
        console.error('Mutation error:', error);
        
        // Disparar evento para notificaciones de usuario
        window.dispatchEvent(new CustomEvent('mutation-error', {
          detail: { error, variables, context }
        }));
      },
      onSuccess: (data, variables, context) => {
        // Log de éxito y métricas
        if (import.meta.env.DEV) {
          console.log('Mutation success:', { data, variables });
        }
        
        // Disparar evento para tracking de éxito
        window.dispatchEvent(new CustomEvent('mutation-success', {
          detail: { data, variables, context }
        }));
      },
      onSettled: () => {
        // Invalidar queries relacionadas después de la mutación
        // Esta función será sobrescrita en mutaciones específicas
      },
      // Configuración para mutaciones en lote
      throwOnError: false, // Permitir manejo de errores personalizado
    },
  },
});

// 📊 Configurar event listeners para manejo global de errores de React Query
queryClient.getQueryCache().subscribe(event => {
  if (event.type === 'queryError') {
    const { query, error } = event;
    const errorCategory = (error as any).category || 'unknown';
    const statusCode = (error as any).statusCode;
    
    console.error('Query error:', {
      error: error.message,
      category: errorCategory,
      statusCode,
      queryKey: query.queryKey,
      timestamp: new Date().toISOString()
    });
    
    // Disparar evento para monitoring y notificaciones
    window.dispatchEvent(new CustomEvent('query-error', {
      detail: { 
        error, 
        query: query.queryKey, 
        category: errorCategory,
        statusCode,
        timestamp: Date.now()
      }
    }));
  }
  
  if (event.type === 'querySuccess') {
    const { query } = event;
    const queryDuration = Date.now() - (query.state.dataUpdatedAt || Date.now());
    
    if (import.meta.env.DEV) {
      console.log('Query success:', {
        queryKey: query.queryKey,
        duration: queryDuration,
        cacheHit: query.state.isFetching === false,
      });
    }
    
    // Disparar evento para métricas de performance
    window.dispatchEvent(new CustomEvent('query-success', {
      detail: {
        queryKey: query.queryKey,
        duration: queryDuration,
        cacheHit: query.state.isFetching === false,
        timestamp: Date.now()
      }
    }));
  }
});

queryClient.getMutationCache().subscribe(event => {
  if (event.type === 'mutationError') {
    const { mutation, error } = event;
    const errorCategory = (error as any).category || 'unknown';
    
    console.error('Mutation error:', {
      error: error.message,
      category: errorCategory,
      mutationKey: mutation.options.mutationKey
    });
    
    // Notificar error solo si es relevante para el usuario
    if (errorCategory !== 'validation' && errorCategory !== 'business') {
      window.dispatchEvent(new CustomEvent('user-notification', {
        detail: {
          type: 'error',
          message: error.message,
          category: errorCategory
        }
      }));
    }
  }
  
  if (event.type === 'mutationSuccess') {
    const { mutation } = event;
    
    if (import.meta.env.DEV) {
      console.log('Mutation success:', {
        mutationKey: mutation.options.mutationKey,
      });
    }
    
    // Disparar evento para tracking de mutaciones exitosas
    window.dispatchEvent(new CustomEvent('mutation-metrics', {
      detail: {
        mutationKey: mutation.options.mutationKey,
        success: true,
        timestamp: Date.now()
      }
    }));
  }
});

// CoomÜnity Theme
const coomunityTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#6366f1', // Índigo CoomÜnity
      light: '#818cf8',
      dark: '#4f46e5',
    },
    secondary: {
      main: '#8b5cf6', // Violeta
      light: '#a78bfa',
      dark: '#7c3aed',
    },
    success: {
      main: '#10b981', // Verde
    },
    warning: {
      main: '#f59e0b', // Dorado
    },
    error: {
      main: '#ef4444', // Rojo
    },
    background: {
      default: '#fafafa',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    },
    h2: {
      fontWeight: 600,
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    },
    h3: {
      fontWeight: 600,
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    },
    h4: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    },
    h5: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    },
    h6: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    },
    body1: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    },
    body2: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    },
    subtitle1: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    },
    subtitle2: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    },
    button: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    },
    caption: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    },
    overline: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '12px !important',
          padding: '8px 16px',
          fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif !important',
          '&.btn': {
            borderRadius: '12px !important',
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: '12px !important',
          '&.circular': {
            borderRadius: '50% !important',
          },
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: '12px !important',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif !important',
        },
      },
    },
    MuiListItemText: {
      styleOverrides: {
        root: {
          fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif !important',
        },
        primary: {
          fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif !important',
        },
        secondary: {
          fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif !important',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif !important',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif !important',
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif !important',
        },
      },
    },
  },
});

// Componente interno para tracking dentro del Router
const AppWithTracking: React.FC = () => {
  // Hook para tracking automático de navegación
  usePageViewTracking();

  return (
    <>
      <Toaster 
        position="top-center"
        richColors
        closeButton
      />
      <Routes>
        {/* 🔐 Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* 🏠 Protected Main App Routes */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          {/* Dashboard - Keep synchronous for fast initial load */}
          <Route index element={<Home />} />
          <Route path="home" element={<Home />} />

          {/* 👤 Profile Module - Lazy Loaded */}
          <Route 
            path="profile" 
            element={
              <Suspense fallback={<DashboardSkeleton />}>
                <Profile />
              </Suspense>
            } 
          />

          {/* 🏪 Marketplace Module - Lazy Loaded */}
          <Route 
            path="marketplace" 
            element={
              <Suspense fallback={<DashboardSkeleton />}>
                <Marketplace />
              </Suspense>
            } 
          />
          <Route 
            path="marketplace/product/:id" 
            element={
              <Suspense fallback={<DashboardSkeleton />}>
                <ProductDetails />
              </Suspense>
            } 
          />

          {/* 🎵 ÜPlay Module - Lazy Loaded */}
          <Route 
            path="play" 
            element={
              <Suspense fallback={<DashboardSkeleton />}>
                <VideoHome />
              </Suspense>
            } 
          />
          <Route 
            path="play/video/:id" 
            element={
              <Suspense fallback={<DashboardSkeleton />}>
                <VideoPlayer videoId="1" />
              </Suspense>
            } 
          />

          {/* 📹 Videos Module - Lazy Loaded */}
          <Route 
            path="videos" 
            element={
              <Suspense fallback={<DashboardSkeleton />}>
                <VideoHome />
              </Suspense>
            } 
          />
          <Route 
            path="videos/player/:id" 
            element={
              <Suspense fallback={<DashboardSkeleton />}>
                <VideoPlayer videoId="1" />
              </Suspense>
            } 
          />

          {/* 🌍 Mundos Module - Lazy Loaded */}
          <Route 
            path="mundos" 
            element={
              <Suspense fallback={<DashboardSkeleton />}>
                <Mundos />
              </Suspense>
            } 
          />

          {/* 🤝 Social Module - Lazy Loaded */}
          <Route 
            path="social" 
            element={
              <Suspense fallback={<DashboardSkeleton />}>
                <SocialFeed />
              </Suspense>
            } 
          />
          <Route 
            path="social/matches" 
            element={
              <Suspense fallback={<DashboardSkeleton />}>
                <Social />
              </Suspense>
            } 
          />
          <Route 
            path="social/gigs" 
            element={
              <Suspense fallback={<DashboardSkeleton />}>
                <Social />
              </Suspense>
            } 
          />
          <Route 
            path="social/gossip" 
            element={
              <Suspense fallback={<DashboardSkeleton />}>
                <Social />
              </Suspense>
            } 
          />

          {/* 💰 Wallet Module - Lazy Loaded */}
          <Route 
            path="wallet" 
            element={
              <Suspense fallback={<DashboardSkeleton />}>
                <Wallet />
              </Suspense>
            } 
          />
          <Route 
            path="wallet/transactions" 
            element={
              <Suspense fallback={<DashboardSkeleton />}>
                <Wallet />
              </Suspense>
            } 
          />

          {/* 📊 Analytics Module - Lazy Loaded */}
          <Route 
            path="analytics" 
            element={
              <Suspense fallback={<DashboardSkeleton />}>
                <Analytics />
              </Suspense>
            } 
          />
          <Route 
            path="stats" 
            element={
              <Suspense fallback={<DashboardSkeleton />}>
                <Analytics />
              </Suspense>
            } 
          />

          {/* 🎮 Pilgrim Module - Lazy Loaded */}
          <Route 
            path="pilgrim" 
            element={
              <Suspense fallback={<DashboardSkeleton />}>
                <PilgrimJourney />
              </Suspense>
            } 
          />
          <Route 
            path="pilgrim/journey" 
            element={
              <Suspense fallback={<DashboardSkeleton />}>
                <PilgrimJourney />
              </Suspense>
            } 
          />

          {/* 📱 PWA Demo Module - Lazy Loaded */}
          <Route 
            path="pwa" 
            element={
              <Suspense fallback={<DashboardSkeleton />}>
                <PWADemo />
              </Suspense>
            } 
          />
          <Route 
            path="pwa-demo" 
            element={
              <Suspense fallback={<DashboardSkeleton />}>
                <PWADemo />
              </Suspense>
            } 
          />
        </Route>

        {/* ⚙️ Admin Routes - Lazy Loaded */}
        <Route 
          path="/admin" 
          element={
            <Suspense fallback={<AppLayoutSkeleton />}>
              <AdminProtectedRoute />
            </Suspense>
          }
        >
          <Route 
            element={
              <Suspense fallback={<DashboardSkeleton />}>
                <AdminLayout />
              </Suspense>
            }
          >
            <Route index element={<div>Admin Dashboard</div>} />
            <Route path="users" element={<div>User Management</div>} />
            <Route path="content" element={<div>Content Management</div>} />
            <Route path="analytics" element={<div>Analytics Dashboard</div>} />
          </Route>
        </Route>
      </Routes>
    </>
  );
};

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={coomunityTheme}>
        <CssBaseline />
        <AuthProvider>
          <Router>
            <AppWithTracking />
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App; 