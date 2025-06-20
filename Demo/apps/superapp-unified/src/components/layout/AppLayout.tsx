import React, { useEffect, useState, ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import { AppHeader } from './AppHeader';
import { BottomNavigation } from './BottomNavigation';
import { Sidebar } from './Sidebar';
import { Box, useTheme, useMediaQuery, LinearProgress, Drawer } from '@mui/material';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { useAuth } from '../../contexts/AuthContext';
import { useLoadingStates } from '../../hooks/useLoadingStates';

// ⚡ OPTIMIZACIONES DE PERFORMANCE
import { preloadCriticalResources, setupResourceCache, useLazyImage, monitorResourcePerformance } from '../../utils/resourceOptimization';

interface AppLayoutProps {
  children?: ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { loading } = useAuth();
  const { hasAnyLoading, addLoadingState, removeLoadingState } = useLoadingStates();
  const [showTopLoader, setShowTopLoader] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [performanceInitialized, setPerformanceInitialized] = useState(false);

  // ⚡ Corrección del hook: Llamar en el nivel superior del componente
  const { setupLazyLoading } = useLazyImage();

  // ⚡ Inicializar optimizaciones de performance
  useEffect(() => {
    const initializePerformanceOptimizations = async () => {
      if (performanceInitialized) return;

      console.log('🚀 Initializing performance optimizations...');

      try {
        // 1. Preload de recursos críticos
        const { preloadCriticalAssets } = preloadCriticalResources();
        await preloadCriticalAssets();

        // 2. Configurar cache de recursos
        const { cacheResources } = setupResourceCache();
        await cacheResources();

        // 3. Configurar lazy loading de imágenes
        setupLazyLoading();

        // 4. Inicializar monitor de performance (en desarrollo)
        if (process.env.NODE_ENV === 'development') {
          const { measureResourceTiming } = monitorResourcePerformance();
          // Medir performance después de 3 segundos de carga inicial
          setTimeout(() => {
            measureResourceTiming();
          }, 3000);
        }

        setPerformanceInitialized(true);
        console.log('✅ Performance optimizations initialized successfully');
      } catch (error) {
        console.warn('⚠️ Some performance optimizations failed to initialize:', error);
        setPerformanceInitialized(true); // Mark as initialized even if some parts failed
      }
    };

    initializePerformanceOptimizations();
  }, [performanceInitialized, setupLazyLoading]);

  // Handle mobile drawer toggle
  const handleMobileMenuToggle = () => {
    setMobileDrawerOpen(!mobileDrawerOpen);
  };

  // Close mobile drawer when switching to desktop
  useEffect(() => {
    if (!isMobile) {
      setMobileDrawerOpen(false);
    }
  }, [isMobile]);

  // Simulate periodic loading operations for demonstration
  useEffect(() => {
    const interval = setInterval(() => {
      if (!loading && Math.random() < 0.3) { // 30% chance every 10 seconds
        setShowTopLoader(true);
        addLoadingState('sync');
        setTimeout(() => {
          setShowTopLoader(false);
          removeLoadingState('sync');
        }, 2000);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [loading, addLoadingState, removeLoadingState]);

  return (
    <Box
      data-testid="app-layout"
      className="app-layout responsive-container"
      data-responsive="adaptive-layout"
      data-breakpoint-detection={isMobile ? 'mobile' : 'desktop'}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: 'background.default'
      }}
    >
      {/* Top Loading Bar */}
      {(showTopLoader || hasAnyLoading) && (
        <Box
          className="loading-progress loading-bar responsive-element"
          data-loading="true"
          data-contextual="system-loading"
          data-context-type="sync-indicator"
          sx={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9999 }}
        >
          <LinearProgress
            className="loader loading contextual-progress"
            sx={{ height: 3 }}
          />
        </Box>
      )}

      {/* Loading Overlay for authentication and system operations */}
      {loading && (
        <LoadingSpinner
          variant="overlay"
          message="Cargando..."
          data-testid="app-loading-overlay"
          className="contextual-loading system-loading"
        />
      )}

      {/* Header */}
      <AppHeader onMenuClick={handleMobileMenuToggle} />

      {/* Mobile Navigation Drawer */}
      <Drawer
        variant="temporary"
        anchor="left"
        open={mobileDrawerOpen}
        onClose={handleMobileMenuToggle}
        data-testid="mobile-navigation-menu"
        className="mobile-menu-drawer responsive-element mobile-only"
        data-responsive="mobile-only"
        data-breakpoint="md-down"
        data-contextual="navigation-state"
        aria-label="Menú de navegación móvil"
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            width: 280,
            boxSizing: 'border-box',
            backgroundColor: 'background.paper',
            borderRight: '1px solid',
            borderColor: 'divider',
          },
        }}
      >
        <Box
          onClick={handleMobileMenuToggle}
          onKeyDown={handleMobileMenuToggle}
          role="navigation"
          aria-label="Menú de navegación móvil"
          className="mobile-navigation-content responsive-content"
          data-responsive="mobile-navigation"
          sx={{ width: 280, height: '100%' }}
        >
          <Sidebar />
        </Box>
      </Drawer>

      <Box
        className="main-content-wrapper responsive-layout"
        data-responsive="flex-layout"
        data-breakpoint-behavior="adaptive"
        sx={{
          display: 'flex',
          flex: 1,
          overflow: 'hidden'
        }}
      >
        {/* Sidebar for desktop */}
        {!isMobile && (
          <Box
            className="desktop-sidebar responsive-element desktop-only"
            data-responsive="desktop-only"
            data-breakpoint="md-up"
            data-contextual="navigation-sidebar"
            sx={{
              width: 280,
              flexShrink: 0,
              backgroundColor: 'background.paper',
              borderRight: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Sidebar />
          </Box>
        )}

        {/* Main content area */}
        <Box
          component="main"
          className="main-content-area responsive-content"
          data-responsive="content-area"
          data-contextual="main-content"
          sx={{
            flex: 1,
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {children || <Outlet />}
        </Box>
      </Box>

      {/* Bottom navigation for mobile */}
      {isMobile && <BottomNavigation />}

      {/* Additional loading indicator that's always present but hidden */}
      <Box
        className="loading-spinner hidden contextual-loading"
        data-loading="false"
        data-contextual="hidden-loader"
        data-context-type="fallback-loading"
        sx={{ display: 'none' }}
      >
        <div className="spinner loading"></div>
      </Box>
    </Box>
  );
};
