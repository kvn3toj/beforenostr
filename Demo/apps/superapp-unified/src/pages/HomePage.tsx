import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

// 🎯 REGLA #1: IMPORTS ESPECÍFICOS DE MATERIAL UI
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

// 🎯 REGLA #1: IMPORTS ESPECÍFICOS DE ICONOS
import RefreshIcon from '@mui/icons-material/Refresh';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';

import { useAuth } from '../contexts/AuthContext';
import { useIntuitiveBehavior } from '../hooks/home/useIntuitiveBehavior';

// 🚀 IMPORTAR WIDGETS DE LA NUEVA ESTRUCTURA SEMÁNTICA
import { WelcomeWidget } from '../components/home/widgets/WelcomeWidget';
import { AyniBalanceFullWidget } from '../components/home/widgets/AyniBalanceFullWidget';
import { WalletOnlyWidget } from '../components/home/widgets/WalletOnlyWidget';
import { QuickActionsWidget } from '../components/home/widgets/QuickActionsWidget';
import { NotificationsWidget } from '../components/home/widgets/NotificationsWidget';
import { MainModulesWidget } from '../components/home/widgets/MainModulesWidget';
import { DailyReflectionWidget } from '../components/home/widgets/DailyReflectionWidget';

// 🌌 IMPORTAR FONDO UNIVERSAL CÓSMICO
import UniversalCosmicBackground from '../components/home/UniversalCosmicBackground';

// 🎨 IMPORTAR SISTEMAS REVOLUCIONARIOS Y PROPORCIONES ÁUREAS
import '../styles/home-revolutionary-system.css';
import '../styles/golden-ratio-system.css';
import '../styles/golden-color-system.css';
import '../styles/intuitive-interactions.css';
import '../styles/smart-layout.css';
import '../styles/dashboard-enhancements.css';
import '../styles/cosmic-ayni-effects.css';

// 🏷️ Tipos para las notificaciones
interface Notification {
  id: string;
  type:
    | 'ayni'
    | 'achievement'
    | 'social'
    | 'marketplace'
    | 'system'
    | 'education';
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  avatar?: string;
  actionLabel?: string;
}

// 🚨 ERROR BOUNDARY SIMPLIFICADO
class HomePageErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    console.error('🚨 HomePage Error:', error.message);

    // Manejar específicamente errores de scroll/transición
    if (
      error.message?.includes('scrollTop') ||
      error.message?.includes('node.scrollTop')
    ) {
      console.warn(
        '🔄 Error de transición detectado, reiniciando componente...'
      );
    }

    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('🚨 HomePage Error Stack:', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              🚨 Error en el Dashboard
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Error detectado:{' '}
              {this.state.error?.message || 'Error desconocido'}
            </Typography>
            <Button
              onClick={() => window.location.reload()}
              variant="contained"
              size="small"
            >
              Recargar Dashboard
            </Button>
          </Alert>
        </Container>
      );
    }

    return this.props.children;
  }
}

export function HomePage() {
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

  // 🎛️ Estados básicos
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // 🎯 Inicialización
  useEffect(() => {
    const initializeDashboard = async () => {
      try {
        setIsLoading(true);

        // Simular carga
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

  // 📜 Scroll handler con validaciones
  useEffect(() => {
    const handleScroll = () => {
      try {
        if (typeof window !== 'undefined' && window.scrollY !== undefined) {
          setShowScrollTop(window.scrollY > 400);
        }
      } catch (error) {
        console.warn('🚨 Error en scroll handler:', error);
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, []);

  // 🔄 Handlers
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

  // 🔒 Verificación de autenticación
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
            background: 'linear-gradient(135deg, #E91E63, #F06292)',
            color: 'white',
          }}
        >
          Iniciar Sesión
        </Button>
      </Container>
    );
  }

  // 💀 Loading revolucionario
  if (isLoading) {
    return (
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
              background:
                'conic-gradient(from 0deg, #FF6B35, #00BCD4, #66BB6A, #FFD54F, #FF6B35)',
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
            className="revolutionary-text-gradient"
            sx={{
              background: 'linear-gradient(135deg, #E91E63, #9C27B0, #3F51B5)',
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
    );
  }

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <HomePageErrorBoundary>
      {/* 🌌 FONDO UNIVERSAL CÓSMICO - Cubre toda la página */}
      <UniversalCosmicBackground />

      <Box className="revolutionary-container">
        <Container
          maxWidth="xl"
          className="golden-container"
          sx={{
            py: {
              xs: 'var(--golden-space-21)',
              sm: 'var(--golden-space-34)',
              md: 'var(--golden-space-55)',
            },
            px: { xs: 2, sm: 3, md: 4 },
            position: 'relative',
            zIndex: 2,
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* 🎛️ Panel de Control del Dashboard */}
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
                className="revolutionary-text-gradient"
                sx={{
                  fontSize: { xs: '1.8rem', sm: '2.5rem', md: '3rem' },
                  fontWeight: 800,
                  background:
                    'linear-gradient(135deg, #FF6B35, #E91E63, #9C27B0)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                🚀 Dashboard Semántico
              </Typography>

              {/* 🎯 Controles */}
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <Tooltip title="Actualizar Dashboard">
                  <IconButton
                    onClick={handleRefreshDashboard}
                    disabled={refreshing}
                    sx={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      '&:hover': { background: 'rgba(255, 255, 255, 0.2)' },
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
                      '&:hover': { background: 'rgba(255, 255, 255, 0.2)' },
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
                      '&:hover': { background: 'rgba(255, 255, 255, 0.2)' },
                    }}
                  >
                    <SettingsIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          </Fade>

          {/* 🎯 ESTRUCTURA SEMÁNTICA CÓSMICA CON VISUAL REVOLUCIONARIO */}
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: { xs: 4, sm: 5, md: 8 },
              overflow: 'visible',
              position: 'relative',
              // Fondo de constelaciones sutiles
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: `
                  radial-gradient(circle at 15% 25%, rgba(255, 255, 255, 0.02) 1px, transparent 1px),
                  radial-gradient(circle at 85% 75%, rgba(255, 107, 53, 0.03) 1px, transparent 1px),
                  radial-gradient(circle at 45% 60%, rgba(0, 188, 212, 0.02) 1px, transparent 1px),
                  radial-gradient(circle at 75% 20%, rgba(102, 187, 106, 0.02) 1px, transparent 1px)
                `,
                backgroundSize:
                  '200px 200px, 300px 300px, 250px 250px, 180px 180px',
                animation: 'cosmic-drift 60s linear infinite',
                opacity: 0.4,
                pointerEvents: 'none',
                zIndex: 0,
              },
            }}
          >
            <Grid container spacing={{ xs: 4, sm: 5, md: 8 }}>
              {/* === CAPA 1: BIENVENIDA Y ESTADO PERSONAL (Ocupa toda la fila) === */}
              <Grid size={12}>
                <Fade in timeout={800} appear={false}>
                  <Box
                    className="enhanced-header enhanced-slide-up enhanced-delay-1"
                    sx={{
                      position: 'relative',
                      zIndex: 10,
                      mb: { xs: 2, md: 3 },
                    }}
                  >
                    <WelcomeWidget
                      onNotificationClick={() => navigate('/notifications')}
                      totalNotifications={unreadCount}
                    />
                  </Box>
                </Fade>
              </Grid>

              {/* === CAPA 2: EL CORAZÓN DE TU ECOSISTEMA (Columna principal y secundaria) === */}

              {/* === CAPA 2A: TU BALANCE AYNI - EL CORAZÓN DEL UNIVERSO === */}
              <Grid size={12}>
                <Fade in timeout={800}>
                  <Box
                    className="enhanced-cosmic-widget enhanced-glow enhanced-scale enhanced-delay-2 constellation-bg"
                    sx={{
                      position: 'relative',
                      zIndex: 1000, // ⭐ Z-INDEX MÁS ALTO PARA SER PROTAGONISTA
                      minHeight: {
                        xs: '600px',
                        sm: '700px',
                        md: '800px',
                        lg: '900px',
                      },
                      mb: { xs: 6, md: 8 },
                      mx: { xs: 1, sm: 2, md: 3 },
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: `
                      radial-gradient(circle at 20% 20%, rgba(255, 107, 53, 0.08) 0%, transparent 50%),
                      radial-gradient(circle at 80% 80%, rgba(0, 188, 212, 0.06) 0%, transparent 50%),
                      radial-gradient(circle at 40% 90%, rgba(102, 187, 106, 0.04) 0%, transparent 50%),
                      linear-gradient(135deg, rgba(15, 23, 42, 0.9), rgba(30, 41, 59, 0.8))
                    `,
                      borderRadius: '32px',
                      border: '3px solid transparent',
                      backgroundClip: 'padding-box',
                      boxShadow: `
                      0 25px 80px rgba(0, 0, 0, 0.3),
                      0 0 60px rgba(255, 107, 53, 0.15),
                      inset 0 0 40px rgba(255, 255, 255, 0.05)
                    `,
                      overflow: 'visible',
                      // Borde con gradiente elemental
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: '-3px',
                        left: '-3px',
                        right: '-3px',
                        bottom: '-3px',
                        background:
                          'linear-gradient(45deg, #FF6B35, #00BCD4, #66BB6A, #FFD54F, #FF6B35)',
                        borderRadius: '35px',
                        zIndex: -1,
                        animation:
                          'revolutionary-rotate-continuous 20s linear infinite',
                      },
                      // Efecto de partículas espaciales
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: `
                        radial-gradient(2px 2px at 10% 20%, rgba(255, 255, 255, 0.4), transparent),
                        radial-gradient(1px 1px at 80% 10%, rgba(255, 107, 53, 0.3), transparent),
                        radial-gradient(1px 1px at 20% 80%, rgba(0, 188, 212, 0.3), transparent),
                        radial-gradient(1px 1px at 90% 70%, rgba(102, 187, 106, 0.3), transparent),
                        radial-gradient(2px 2px at 60% 30%, rgba(255, 213, 79, 0.3), transparent)
                      `,
                        backgroundSize:
                          '300px 300px, 200px 200px, 250px 250px, 400px 400px, 180px 180px',
                        animation: 'cosmic-drift 30s linear infinite',
                        borderRadius: '32px',
                        opacity: 0.6,
                        pointerEvents: 'none',
                        zIndex: 0,
                      },
                    }}
                  >
                    <AyniBalanceFullWidget />
                  </Box>
                </Fade>
              </Grid>

              {/* === CAPA 2B: ACCIONES Y MÓDULOS DISTRIBUIDOS === */}
              <Grid size={12}>
                <Grid container spacing={{ xs: 4, sm: 5, md: 6 }}>
                  {/* --- Columna Principal: Acciones Rápidas --- */}
                  <Grid size={{ xs: 12, lg: 8 }}>
                    <Fade in timeout={1200} appear={false}>
                      <Box
                        className="enhanced-actions enhanced-glow enhanced-scale enhanced-delay-3"
                        sx={{
                          position: 'relative',
                          zIndex: 10, // ⚡ Z-INDEX MENOR QUE BALANCE AYNI
                          minHeight: { xs: '280px', sm: '320px', md: '360px' },
                          mb: { xs: 3, md: 4 },
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: 'rgba(255, 255, 255, 0.03)',
                          borderRadius: '20px',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          backdropFilter: 'blur(20px)',
                        }}
                      >
                        <QuickActionsWidget
                          onActionClick={(action) => {
                            setSnackbarMessage(
                              `🚀 Navegando a ${action.toUpperCase()}`
                            );
                            setSnackbarOpen(true);
                          }}
                        />
                      </Box>
                    </Fade>
                  </Grid>

                  {/* --- Columna Secundaria: Notificaciones --- */}
                  <Grid size={{ xs: 12, lg: 4 }}>
                    <Fade in timeout={1400}>
                      <Box
                        className="enhanced-sidebar-widget enhanced-scroll enhanced-delay-4"
                        sx={{
                          position: 'relative',
                          zIndex: 5, // 🔔 Z-INDEX MENOR QUE BALANCE AYNI
                          minHeight: { xs: '280px', sm: '320px', md: '360px' },
                          mb: { xs: 3, md: 4 },
                          background: 'rgba(255, 255, 255, 0.03)',
                          borderRadius: '20px',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          backdropFilter: 'blur(20px)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <NotificationsWidget
                          onNotificationClick={handleNotificationClick}
                          onMarkAllRead={() => {
                            setNotifications((prev) =>
                              prev.map((n) => ({ ...n, isRead: true }))
                            );
                            setSnackbarMessage(
                              '✅ Notificaciones marcadas como leídas'
                            );
                            setSnackbarOpen(true);
                          }}
                          onViewAll={() => navigate('/notifications')}
                        />
                      </Box>
                    </Fade>
                  </Grid>

                  {/* --- Módulos Principales: Fila Completa --- */}
                  <Grid size={12}>
                    <Fade in timeout={1600}>
                      <Box
                        className="enhanced-fade-in enhanced-delay-5"
                        sx={{
                          position: 'relative',
                          zIndex: 3, // 🎯 Z-INDEX MENOR QUE BALANCE AYNI
                          minHeight: { xs: '600px', sm: '700px', md: '800px' },
                          mb: { xs: 4, md: 6 },
                          background: 'rgba(255, 255, 255, 0.02)',
                          borderRadius: '24px',
                          border: '1px solid rgba(255, 255, 255, 0.08)',
                          backdropFilter: 'blur(15px)',
                          padding: { xs: 2, sm: 3, md: 4 },
                        }}
                      >
                        <MainModulesWidget
                          onModuleClick={(moduleId) => {
                            setSnackbarMessage(
                              `🚀 Abriendo módulo: ${moduleId.toUpperCase()}`
                            );
                            setSnackbarOpen(true);
                          }}
                        />
                      </Box>
                    </Fade>
                  </Grid>
                </Grid>
              </Grid>

              {/* === CAPA 2A: TU BALANCE AYNI - EL CORAZÓN DEL UNIVERSO (ANCHO COMPLETO) === */}
              <Grid size={12}>
                <Fade in timeout={800} appear={false}>
                  <Box
                    sx={{
                      mb: { xs: 6, md: 8 },
                      mx: { xs: 1, sm: 2, md: 3 },
                    }}
                  >
                    <AyniBalanceFullWidget className="enhanced-cosmic-widget enhanced-glow enhanced-scale enhanced-delay-2 constellation-bg" />
                  </Box>
                </Fade>
              </Grid>

              {/* === CAPA 2B: WALLET Y ACCIONES === */}
              <Grid size={12}>
                <Grid container spacing={{ xs: 4, sm: 5, md: 6 }}>
                  {/* --- Wallet Individual --- */}
                  <Grid size={{ xs: 12, lg: 4 }}>
                    <Fade in timeout={1000} appear={false}>
                      <Box>
                        <WalletOnlyWidget
                          onAddFunds={() => navigate('/wallet/add')}
                          onSend={() => navigate('/wallet/send')}
                          onExchange={() => navigate('/wallet/exchange')}
                          onViewTransactions={() =>
                            navigate('/wallet/transactions')
                          }
                        />
                      </Box>
                    </Fade>
                  </Grid>

                  {/* --- Acciones Rápidas --- */}
                  <Grid size={{ xs: 12, lg: 8 }}>
                    <Fade in timeout={1200}>
                      <Box
                        className="enhanced-actions enhanced-glow enhanced-scale enhanced-delay-3"
                        sx={{
                          position: 'relative',
                          zIndex: 10,
                          minHeight: { xs: '280px', sm: '320px', md: '360px' },
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: 'rgba(255, 255, 255, 0.03)',
                          borderRadius: '20px',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          backdropFilter: 'blur(20px)',
                        }}
                      >
                        <QuickActionsWidget
                          onActionClick={(action) => {
                            setSnackbarMessage(
                              `🚀 Navegando a ${action.toUpperCase()}`
                            );
                            setSnackbarOpen(true);
                          }}
                        />
                      </Box>
                    </Fade>
                  </Grid>
                </Grid>
              </Grid>

              {/* === REFLEXIÓN FILOSÓFICA === */}
              <Grid size={12}>
                <Box
                  sx={{
                    textAlign: 'center',
                    mt: { xs: 4, md: 6 },
                    mb: { xs: 2, md: 3 },
                  }}
                >
                  <Typography
                    sx={{
                      color: 'rgba(255, 255, 255, 0.98)',
                      fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
                      fontStyle: 'italic',
                      fontWeight: 600,
                      textShadow:
                        '0 2px 8px rgba(0, 0, 0, 0.8), 0 1px 4px rgba(0, 0, 0, 0.9)',
                      letterSpacing: '0.3px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 2,
                    }}
                  >
                    <AutoAwesomeIcon sx={{ color: '#FFD700' }} />
                    "La estructura semántica libera la potencia de cada
                    interacción en el ecosistema CoomÜnity"
                    <AutoAwesomeIcon sx={{ color: '#FFD700' }} />
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Container>

        {/* 🎪 BOTÓN FLOTANTE DE SCROLL REVOLUCIONARIO */}
        <Fade in={showScrollTop} timeout={300} appear={false}>
          <Box>
            <Fab
              onClick={handleScrollToTop}
              sx={{
                position: 'fixed',
                bottom: { xs: 20, sm: 32 },
                right: { xs: 20, sm: 32 },
                background:
                  'conic-gradient(from 0deg, #FF6B35, #00BCD4, #66BB6A, #FFD54F, #FF6B35)',
                width: 56,
                height: 56,
                zIndex: 1000,
                '&:hover': {
                  transform: 'scale(1.1)',
                  boxShadow: '0 12px 40px rgba(255, 107, 53, 0.4)',
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

        {/* 🎊 SNACKBAR REVOLUCIONARIO */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={4000}
          onClose={() => setSnackbarOpen(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        >
          <Alert
            onClose={() => setSnackbarOpen(false)}
            severity="success"
            sx={{
              background: 'linear-gradient(135deg, #4CAF50, #66BB6A)',
              color: 'white',
              '& .MuiAlert-icon': { color: 'white' },
              fontWeight: 600,
            }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Box>
    </HomePageErrorBoundary>
  );
}
