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

export const AppLayout: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { loading } = useAuth();
  const { hasAnyLoading, addLoadingState, removeLoadingState } = useLoadingStates();
  const [showTopLoader, setShowTopLoader] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [performanceInitialized, setPerformanceInitialized] = useState(false);
  const { setupLazyLoading } = useLazyImage();

  // Constante para el ancho del drawer
  const drawerWidth = 280;

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

      {/* Desktop Sidebar */}
      {!isMobile && <Sidebar variant="permanent" drawerWidth={drawerWidth} />}

      {/* Main Content Area */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          overflow: 'hidden',
          // Add margin for desktop sidebar
          marginLeft: isMobile ? 0 : 0, // Drawer handles its own spacing
        }}
      >
        <AppHeader onDrawerToggle={handleDrawerToggle} showTopLoader={showTopLoader} />
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

      {/* Mobile Drawer */}
      {isMobile && (
        <Sidebar
          variant="temporary"
          open={mobileDrawerOpen}
          onClose={handleDrawerToggle}
          drawerWidth={drawerWidth}
        />
      )}

      {/* Agente de Feedback - Solo para administradores en modo prelanzamiento */}
      <FeedbackAgent />
    </Box>
  );
};
