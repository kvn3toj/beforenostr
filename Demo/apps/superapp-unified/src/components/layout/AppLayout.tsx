import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { AppHeader } from './AppHeader';
import { Sidebar } from './Sidebar';
import { BottomNavigation } from './BottomNavigation';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { UniversalCosmicBackground } from '../home/UniversalCosmicBackground';
import { FeedbackAgent } from '../feedback/FeedbackAgent';
import { useLoadingStates } from '../../hooks/useLoadingStates';
import { preloadCriticalResources, setupResourceCache, useLazyImage, monitorResourcePerformance } from '../../utils/resourceOptimization';

// 🛠️ KIRA + ARIA + ZENO - Definir drawerWidth consistente
const DRAWER_WIDTH = 280;

export const AppLayout: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { loading } = useAuth();
  const { hasAnyLoading, addLoadingState, removeLoadingState } = useLoadingStates();
  const [showTopLoader, setShowTopLoader] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [performanceInitialized, setPerformanceInitialized] = useState(false);
  const { setupLazyLoading } = useLazyImage();

  useEffect(() => {
    const initializePerformanceOptimizations = () => {
      preloadCriticalResources();
      setupResourceCache();
      setupLazyLoading();
      monitorResourcePerformance();
      setPerformanceInitialized(true);
    };

    if (!performanceInitialized) {
      initializePerformanceOptimizations();
    }
  }, [performanceInitialized, setupLazyLoading]);

  const handleDrawerToggle = () => {
    setMobileDrawerOpen(!mobileDrawerOpen);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (loading || hasAnyLoading) {
      setShowTopLoader(true);
    } else {
      timer = setTimeout(() => setShowTopLoader(false), 500);
    }
    return () => clearTimeout(timer);
  }, [loading, hasAnyLoading]);

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <UniversalCosmicBackground />

      {/* Desktop Sidebar - 🛠️ ARIA: Agregar drawerWidth */}
      {!isMobile && <Sidebar variant="permanent" drawerWidth={DRAWER_WIDTH} />}

      {/* Main Content Area - 🛠️ ZENO: Mejorar espaciado para desktop */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          overflow: 'hidden',
          // 🛠️ KIRA + ZENO: Corregir margin para desktop sidebar
          marginLeft: isMobile ? 0 : `${DRAWER_WIDTH}px`,
        }}
      >
        <AppHeader onDrawerToggle={handleDrawerToggle} />
        <Box
          component="main"
          data-contextual="main-content"
          sx={{
            flex: 1,
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Outlet />
        </Box>
      </Box>

      {/* Mobile Navigation */}
      {isMobile && <BottomNavigation />}

      {/* Mobile Drawer - 🛠️ ARIA: Agregar drawerWidth */}
      {isMobile && (
        <Sidebar
          variant="temporary"
          open={mobileDrawerOpen}
          onClose={handleDrawerToggle}
          drawerWidth={DRAWER_WIDTH}
        />
      )}

      {/* Agente de Feedback - Solo para administradores en modo prelanzamiento */}
      <FeedbackAgent />
    </Box>
  );
};
