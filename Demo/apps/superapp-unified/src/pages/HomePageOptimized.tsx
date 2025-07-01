import React, { useState, useEffect, useCallback, memo } from 'react';
import { useNavigate } from 'react-router-dom';

// 🎯 IMPORTS ESPECÍFICOS DE MATERIAL UI (OPTIMIZADOS)
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Fade from '@mui/material/Fade';
import Box from '@mui/material/Box';
import Snackbar from '@mui/material/Snackbar';
import Fab from '@mui/material/Fab';
import Tooltip from '@mui/material/Tooltip';
import CircularProgress from '@mui/material/CircularProgress';
import Badge from '@mui/material/Badge';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { useTheme, useMediaQuery } from '@mui/material';

// 🎯 ICONOS ESPECÍFICOS
import RefreshIcon from '@mui/icons-material/Refresh';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';

// 🎨 SISTEMA DE COLORES CENTRALIZADO
import {
  getPrimaryGradient,
  getSemanticGradient,
  getPrimaryColor,
  getSemanticColor,
  createGradient,
  COOMUNITY_ELEMENTS
} from '../design-system/color-system';

import { useAuth } from '../contexts/AuthContext';
import { useIntuitiveBehavior } from '../hooks/home/useIntuitiveBehavior';

// 🚀 WIDGETS OPTIMIZADOS
import { WelcomeWidget } from '../components/home/widgets/WelcomeWidget';
import { ReciprocidadBalanceWidget } from '../components/home/widgets/ReciprocidadBalanceWidget';
import { WalletWidget } from '../components/home/widgets/WalletWidget';
import { QuickActionsWidget } from '../components/home/widgets/QuickActionsWidget';
import { NotificationsWidget } from '../components/home/widgets/NotificationsWidget';
import { MainModulesWidget } from '../components/home/widgets/MainModulesWidget';

// 🌌 FONDO UNIVERSAL CÓSMICO
import UniversalCosmicBackground from '../components/home/UniversalCosmicBackground';

// 🎨 CSS CONSOLIDADO (SOLO LOS ESENCIALES)
import '../styles/home-revolutionary-system.css';
import '../styles/cosmic-reciprocidad-effects.css';
import '../styles/performance-optimizations.css';

// 🏷️ TIPOS OPTIMIZADOS
interface Notification {
  id: string;
  type: 'reciprocidad' | 'achievement' | 'social' | 'marketplace' | 'system' | 'education';
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  avatar?: string;
  actionLabel?: string;
}

// 🚨 ERROR BOUNDARY OPTIMIZADO
const OptimizedErrorBoundary = memo(({ children }: { children: React.ReactNode }) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const handleError = (error: ErrorEvent) => {
      console.error('🚨 HomePage Error:', error.message);
      setHasError(true);
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  if (hasError) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            🚨 Error en el Dashboard
          </Typography>
          <Button
            onClick={() => window.location.reload()}
            variant="contained"
            size="small"
            sx={{
              background: getPrimaryGradient(),
              color: 'white'
            }}
          >
            Recargar Dashboard
          </Button>
        </Alert>
      </Container>
    );
  }

  return <>{children}</>;
});

// 💀 COMPONENTE DE LOADING OPTIMIZADO
const OptimizedLoader = memo(() => (
  <Container maxWidth="xl" className="revolutionary-container">
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '80vh',
        gap: 3,
      }}
    >
      <Box
        sx={{
          width: 120,
          height: 120,
          borderRadius: '50%',
          background: `conic-gradient(from 0deg, ${getPrimaryColor(500 as any)}, ${getSemanticColor('info', 'main')}, ${getSemanticColor('success', 'main')}, ${getSemanticColor('warning', 'main')}, ${getPrimaryColor(500 as any)})`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          animation: 'revolutionary-rotate-continuous 2s linear infinite',
        }}
      >
        <CircularProgress size={80} thickness={2} sx={{ color: 'white' }} />
      </Box>

      <Typography
        variant="h5"
        sx={{
          background: getPrimaryGradient(),
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: 700,
          textAlign: 'center',
        }}
      >
        ✨ Cargando Dashboard Semántico
      </Typography>

      <Typography
        variant="body1"
        sx={{
          color: 'rgba(255, 255, 255, 0.8)',
          textAlign: 'center',
          fontStyle: 'italic',
        }}
      >
        "Preparando la experiencia más intuitiva de CoomÜnity..."
      </Typography>
    </Box>
  </Container>
));

// 🎛️ PANEL DE CONTROL OPTIMIZADO
const DashboardControls = memo(({
  onRefresh,
  refreshing,
  unreadCount
}: {
  onRefresh: () => void;
  refreshing: boolean;
  unreadCount: number;
}) => {
  const navigate = useNavigate();

  return (
    <Fade in timeout={600}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: { xs: 2, sm: 3, md: 4 },
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Typography
          variant="h3"
          sx={{
            fontSize: { xs: '1.8rem', sm: '2.5rem', md: '3rem' },
            fontWeight: 800,
            background: getPrimaryGradient(),
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          🚀 Dashboard Semántico
        </Typography>

        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Tooltip title="Actualizar Dashboard">
            <IconButton
              onClick={onRefresh}
              disabled={refreshing}
              sx={{
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.2)',
                  transform: 'scale(1.05)',
                },
                transition: 'all 0.2s ease'
              }}
            >
              {refreshing ? (
                <CircularProgress size={20} sx={{ color: 'white' }} />
              ) : (
                <RefreshIcon />
              )}
            </IconButton>
          </Tooltip>

          <Tooltip title={`Notificaciones (${unreadCount})`}>
            <IconButton
              onClick={() => navigate('/notifications')}
              sx={{
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.2)',
                  transform: 'scale(1.05)',
                },
                transition: 'all 0.2s ease'
              }}
            >
              <Badge badgeContent={unreadCount} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>

          <Tooltip title="Configuración">
            <IconButton
              onClick={() => navigate('/settings')}
              sx={{
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.2)',
                  transform: 'scale(1.05)',
                },
                transition: 'all 0.2s ease'
              }}
            >
              <SettingsIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </Fade>
  );
});

// 📱 BOTÓN FLOTANTE OPTIMIZADO
const ScrollToTopFab = memo(({
  visible,
  onClick
}: {
  visible: boolean;
  onClick: () => void;
}) => (
  <Fade in={visible} timeout={300} appear={false}>
    <Box>
      <Fab
        onClick={onClick}
        sx={{
          position: 'fixed',
          bottom: { xs: 20, sm: 32 },
          right: { xs: 20, sm: 32 },
          background: `conic-gradient(from 0deg, ${getPrimaryColor(500 as any)}, ${getSemanticColor('info', 'main')}, ${getSemanticColor('success', 'main')}, ${getSemanticColor('warning', 'main')}, ${getPrimaryColor(500 as any)})`,
          width: 56,
          height: 56,
          zIndex: 1000,
          '&:hover': {
            transform: 'scale(1.1)',
            boxShadow: `0 12px 40px ${getPrimaryColor(500 as any)}40`,
          },
          transition: 'all 0.3s ease',
        }}
      >
        <KeyboardArrowUpIcon
          sx={{ color: 'white', fontSize: '1.8rem' }}
        />
      </Fab>
    </Box>
  </Fade>
));

// 🎊 SNACKBAR OPTIMIZADO
const OptimizedSnackbar = memo(({
  open,
  message,
  onClose
}: {
  open: boolean;
  message: string;
  onClose: () => void;
}) => (
  <Snackbar
    open={open}
    autoHideDuration={4000}
    onClose={onClose}
    anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
  >
    <Alert
      onClose={onClose}
      severity="success"
      sx={{
        background: getSemanticGradient('success'),
        color: 'white',
        '& .MuiAlert-icon': { color: 'white' },
        fontWeight: 600,
      }}
    >
      {message}
    </Alert>
  </Snackbar>
));

// 🏠 COMPONENTE PRINCIPAL OPTIMIZADO
export function HomePageOptimized() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // 🧠 Sistema de micro-interacciones inteligentes
  const intuitive = useIntuitiveBehavior({
    enableProgressiveReveal: true,
    enableHoverEffects: true,
    revealThreshold: 0.1,
  });

  // 🎛️ Estados optimizados
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // 🎯 Inicialización optimizada
  useEffect(() => {
    const initializeDashboard = async () => {
      try {
        setIsLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 800));

        setNotifications([
          {
            id: '1',
            type: 'achievement',
            title: '🎉 ¡Nuevo Logro!',
            message: 'Has alcanzado el nivel Maestro Elemental',
            timestamp: new Date(Date.now() - 300000),
            isRead: false,
            priority: 'high',
            actionLabel: 'Ver logro',
          },
        ]);

        setIsLoading(false);
        setSnackbarMessage('✨ Dashboard Semántico cargado exitosamente!');
        setSnackbarOpen(true);
      } catch (error) {
        console.error('🚨 Error inicializando dashboard:', error);
        setIsLoading(false);
      }
    };

    initializeDashboard();
  }, []);

  // 📜 Scroll handler optimizado
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleScroll = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        try {
          if (typeof window !== 'undefined' && window.scrollY !== undefined) {
            setShowScrollTop(window.scrollY > 400);
          }
        } catch (error) {
          console.warn('🚨 Error en scroll handler:', error);
        }
      }, 16); // Throttle a 60fps
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => {
        window.removeEventListener('scroll', handleScroll);
        clearTimeout(timeoutId);
      };
    }
  }, []);

  // 🔄 Handlers optimizados
  const handleRefreshDashboard = useCallback(async () => {
    setRefreshing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      setSnackbarMessage('🔄 Dashboard actualizado exitosamente');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('🚨 Error actualizando dashboard:', error);
    } finally {
      setRefreshing(false);
    }
  }, []);

  const handleScrollToTop = useCallback(() => {
    try {
      if (typeof window !== 'undefined' && window.scrollTo) {
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
      }
    } catch (error) {
      console.warn('🚨 Error en scroll to top:', error);
    }
  }, []);

  const handleNotificationClick = useCallback((notification: Notification) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notification.id ? { ...n, isRead: true } : n))
    );
  }, []);

  const handleActionClick = useCallback((action: string) => {
    setSnackbarMessage(`🚀 Navegando a ${action.toUpperCase()}`);
    setSnackbarOpen(true);
  }, []);

  const handleModuleClick = useCallback((moduleId: string) => {
    setSnackbarMessage(`🚀 Abriendo módulo: ${moduleId.toUpperCase()}`);
    setSnackbarOpen(true);
  }, []);

  // 🔒 Verificación de autenticación optimizada
  if (!isAuthenticated) {
    return (
      <Container maxWidth="sm" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          🔐 Acceso Requerido
        </Typography>
        <Typography variant="body1" sx={{ mb: 4 }}>
          Necesitas iniciar sesión para acceder al Dashboard
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate('/login')}
          sx={{
            background: getPrimaryGradient(),
            color: 'white',
            '&:hover': {
              background: getPrimaryGradient('45deg'),
              transform: 'translateY(-2px)',
            },
            transition: 'all 0.2s ease'
          }}
        >
          Iniciar Sesión
        </Button>
      </Container>
    );
  }

  // 💀 Loading optimizado
  if (isLoading) {
    return <OptimizedLoader />;
  }

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <OptimizedErrorBoundary>
      {/* 🌌 FONDO UNIVERSAL CÓSMICO */}
      <UniversalCosmicBackground />

      <Box className="revolutionary-container">
        <Container
          maxWidth="xl"
          sx={{
            py: { xs: 2, sm: 3, md: 4 },
            px: { xs: 2, sm: 3, md: 4 },
            position: 'relative',
            zIndex: 2,
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* 🎛️ Panel de Control */}
          <DashboardControls
            onRefresh={handleRefreshDashboard}
            refreshing={refreshing}
            unreadCount={unreadCount}
          />

          {/* 🎯 ESTRUCTURA OPTIMIZADA */}
          <Box sx={{ flex: 1, overflow: 'visible', position: 'relative' }}>
            <Grid
              container
              spacing={{ xs: 2, sm: 3, md: 4, lg: 5 }}
              sx={{
                width: '100%',
                margin: 0,
                '& .MuiGrid-item': {
                  paddingLeft: { xs: '8px', sm: '12px', md: '16px', lg: '20px' },
                  paddingTop: { xs: '8px', sm: '12px', md: '16px', lg: '20px' },
                },
              }}
            >
              {/* === BIENVENIDA === */}
              <Grid item xs={12}>
                <Fade in timeout={600}>
                  <Box sx={{ mb: { xs: 1, sm: 2, md: 3 } }}>
                    <WelcomeWidget />
                  </Box>
                </Fade>
              </Grid>

              {/* === BALANCE RECIPROCIDAD - PROTAGONISTA === */}
              <Grid item xs={12}>
                <Fade in timeout={800}>
                  <Box
                    sx={{
                      position: 'relative',
                      minHeight: { xs: '500px', sm: '600px', md: '700px', lg: '800px' },
                      mb: { xs: 2, sm: 3, md: 4 },
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <ReciprocidadBalanceWidget />
                  </Box>
                </Fade>
              </Grid>

              {/* === ACCIONES Y NOTIFICACIONES === */}
              <Grid item xs={12} lg={8}>
                <Fade in timeout={1000}>
                  <Box sx={{ mb: { xs: 2, sm: 3, md: 4 } }}>
                    <QuickActionsWidget />
                  </Box>
                </Fade>
              </Grid>

              <Grid item xs={12} lg={4}>
                <Fade in timeout={1200}>
                  <Box sx={{ mb: { xs: 2, sm: 3, md: 4 } }}>
                    <NotificationsWidget />
                  </Box>
                </Fade>
              </Grid>

              {/* === MÓDULOS PRINCIPALES === */}
              <Grid item xs={12}>
                <Fade in timeout={1400}>
                  <Box sx={{ mb: { xs: 2, sm: 3, md: 4 } }}>
                    <MainModulesWidget />
                  </Box>
                </Fade>
              </Grid>

              {/* === WALLET === */}
              <Grid item xs={12} md={6}>
                <Fade in timeout={1600}>
                  <Box sx={{ mb: { xs: 2, sm: 3, md: 4 } }}>
                    <WalletWidget />
                  </Box>
                </Fade>
              </Grid>

              {/* === REFLEXIÓN FINAL OPTIMIZADA === */}
              <Grid item xs={12} md={6}>
                <Fade in timeout={1800}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minHeight: { xs: '200px', md: '300px' },
                      textAlign: 'center',
                      p: { xs: 2, sm: 3, md: 4 },
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: 2,
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                  >
                    <Typography
                      sx={{
                        color: 'rgba(255, 255, 255, 0.9)',
                        fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
                        fontStyle: 'italic',
                        fontWeight: 500,
                        lineHeight: 1.6,
                        maxWidth: '400px',
                      }}
                    >
                      <AutoAwesomeIcon sx={{ color: getSemanticColor('warning', 'main'), mr: 1 }} />
                      "El equilibrio de Reciprocidad transforma cada interacción en un paso hacia el bien común"
                      <AutoAwesomeIcon sx={{ color: getSemanticColor('warning', 'main'), ml: 1 }} />
                    </Typography>
                  </Box>
                </Fade>
              </Grid>
            </Grid>
          </Box>
        </Container>

        {/* 🎪 BOTÓN FLOTANTE OPTIMIZADO */}
        <ScrollToTopFab visible={showScrollTop} onClick={handleScrollToTop} />

        {/* 🎊 SNACKBAR OPTIMIZADO */}
        <OptimizedSnackbar
          open={snackbarOpen}
          message={snackbarMessage}
          onClose={() => setSnackbarOpen(false)}
        />
      </Box>
    </OptimizedErrorBoundary>
  );
}

export default HomePageOptimized;
