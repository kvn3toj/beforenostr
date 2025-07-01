import React, { useState, useEffect, useCallback } from 'react';

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
import { useTheme, alpha, useMediaQuery } from '@mui/material';

// 🎯 REGLA #1: IMPORTS ESPECÍFICOS DE ICONOS
import RefreshIcon from '@mui/icons-material/Refresh';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';

import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useIntuitiveBehavior } from '../hooks/home/useIntuitiveBehavior';

// 🚀 IMPORTAR COMPONENTES REVOLUCIONARIOS INDIVIDUALES
import { HomeWelcomeHeader } from '../components/home/HomeWelcomeHeader';
import { ReciprocidadMetricsCard } from '../components/home/ReciprocidadMetricsCard';
import { WalletOverview } from '../components/home/WalletOverview';
import { QuickActionsGrid } from '../components/home/QuickActionsGrid';
import { ModuleCards } from '../components/home/ModuleCards';
import { NotificationCenter } from '../components/home/NotificationCenter';

// 🌟 SISTEMA UNIVERSAL GUARDIAN
import { UniversalIntegrator } from '../components/theme/UniversalIntegrator';
import { UniversalComponent, UniversalGrid, UniversalFlex } from '../components/universal/UniversalComponent';

// 🎨 IMPORTAR SISTEMAS REVOLUCIONARIOS Y PROPORCIONES ÁUREAS
import '../styles/home-revolutionary-system.css';
import '../styles/golden-ratio-system.css';
import '../styles/golden-color-system.css';
import '../styles/intuitive-interactions.css';
import '../styles/smart-layout.css';
import '../styles/dashboard-enhancements.css';

// 🏷️ Tipos para las notificaciones
interface Notification {
  id: string;
  type:
    | 'reciprocidad'
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
class HomeRevolutionaryErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    console.error('🚨 HomeRevolutionary Error:', error.message);
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('🚨 HomeRevolutionary Error Stack:', {
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
              🚨 Error en el Dashboard Revolucionario
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

const HomeRevolutionary: React.FC = () => {
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

  // 📊 Mock data completo para componentes revolucionarios
  const mockData = {
    user: {
      nivel: 12,
      xp: 3450,
      nextLevelXP: 4000,
    },
    wallet: {
      totalBalance: 2847.5,
    },
    notifications: 3,
    // 🔥 Datos elementales para Balance de Reciprocidad
    elementos: {
      fuego: 85, // Pasión y acción
      agua: 92, // Fluir y adaptabilidad
      tierra: 78, // Estabilidad y confianza
      aire: 88, // Comunicación e ideas
    },
    // 💎 Métricas de Reciprocidad
    reciprocidad: {
      ondas: 1250,
      meritos: 485,
      nivel: 'Colaborador Equilibrado',
      siguienteNivel: 'Guardián del Bien Común',
      progreso: 78,
      contribucionesBienComun: 23,
      balance: 85, // Corresponde a balanceReciprocidad (0.85 * 100)
    },
  };

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
        setSnackbarMessage('✨ Dashboard Revolucionario cargado exitosamente!');
        setSnackbarOpen(true);
      } catch (error) {
        console.error('🚨 Error inicializando dashboard:', error);
        setIsLoading(false);
      }
    };

    initializeDashboard();
  }, []);

  // 📜 Scroll handler
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
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
          Necesitas iniciar sesión para acceder al Dashboard Revolucionario
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate('/login')}
          className="guardian-button"
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
            className="revolutionary-text-gradient guardian-gradient-elements"
            sx={{
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 700,
              textAlign: 'center',
            }}
          >
            ✨ Cargando Dashboard Revolucionario
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: 'rgba(255, 255, 255, 0.8)',
              textAlign: 'center',
              fontStyle: 'italic',
            }}
          >
            "Preparando la experiencia mágica más avanzada de CoomÜnity..."
          </Typography>
        </Box>
      </Container>
    );
  }

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <HomeRevolutionaryErrorBoundary>
      <UniversalIntegrator
        enableCosmicBackground={true}
        philosophical={true}
        className="home-revolutionary-cosmic"
      >
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
            position: 'relative',
            zIndex: 2,
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
                className="revolutionary-text-gradient guardian-gradient-primary"
                sx={{
                  fontSize: { xs: '1.8rem', sm: '2.5rem', md: '3rem' },
                  fontWeight: 800,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                🚀 Dashboard Revolucionario
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

          {/* 🎯 HEADER OPTIMIZADO CON UX MEJORADA */}
          <Box
            gridArea="header"
            className="enhanced-header enhanced-slide-up enhanced-delay-1"
            sx={{
              position: 'relative',
              zIndex: 10,
              // Altura más compacta pero elegante
              minHeight: {
                xs: '120px',
                sm: '140px',
                md: '160px',
              },
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <HomeWelcomeHeader />
            {/* Indicador de estado activo */}
            <Box className="enhanced-content-indicator" />
          </Box>

          {/* 🎯 DASHBOARD CON DISTRIBUCIÓN VISUAL OPTIMIZADA */}
          <Box
            className="enhanced-dashboard-container enhanced-fade-in"
            sx={{
              // Responsive breakpoints más inteligentes
              gridTemplateColumns: {
                xs: '1fr',
                sm: '1fr',
                md: '1.8fr 1fr', // Proporción más equilibrada
                lg: '2fr 1fr', // En pantallas grandes, más espacio al contenido principal
              },
              // Gaps más balanceados
              gap: {
                xs: 2, // 16px en móvil
                sm: 3, // 24px en tablet
                md: 4, // 32px en desktop
                lg: 5, // 40px en pantallas grandes
              },
              // Padding adaptativo
              padding: {
                xs: 2, // 16px en móvil
                sm: 3, // 24px en tablet
                md: 4, // 32px en desktop
                lg: 6, // 48px en pantallas grandes
              },
            }}
          >
            {/* Grid inteligente que se adapta al contenido */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateAreas: {
                  xs: '"hero" "main" "sidebar" "actions"', // Mobile: stack vertical
                  sm: '"hero" "main" "sidebar" "actions"', // Tablet: stack vertical
                  md: '"hero hero" "main sidebar" "actions actions"', // Desktop: proporción áurea
                  lg: '"hero hero" "main sidebar" "actions actions"', // Large: proporción áurea optimizada
                },
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: '1fr',
                  md: '1.618fr 1fr', // Proporción áurea
                  lg: '1.618fr 1fr',
                },
                gridTemplateRows: {
                  xs: 'auto auto auto auto',
                  md: 'auto 1fr auto',
                },
                gap: {
                  xs: 2, // 16px
                  sm: 3, // 24px
                  md: 4, // 32px
                  lg: 5, // 40px
                },
                padding: {
                  xs: 2,
                  sm: 3,
                  md: 4,
                  lg: 6,
                },
              }}
            >
              {/* 💎 WIDGET PRINCIPAL - BALANCE DE RECIPROCIDAD OPTIMIZADO */}
              <Box
                gridArea="main"
                className="enhanced-main-widget enhanced-glow enhanced-scale enhanced-delay-2"
                sx={{
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  // Altura adaptativa más inteligente
                  minHeight: {
                    xs: '400px', // Compacto en móvil
                    sm: '450px', // Medio en tablet
                    md: '500px', // Completo en desktop
                    lg: '550px', // Expansivo en pantallas grandes
                  },
                  // Padding interno optimizado
                  padding: {
                    xs: '16px',
                    sm: '20px',
                    md: '24px',
                    lg: '28px',
                  },
                }}
              >
                <ReciprocidadMetricsCard
                  ondas={mockData.reciprocidad.ondas}
                  meritos={mockData.reciprocidad.meritos}
                  nivel={mockData.reciprocidad.nivel}
                  siguienteNivel={mockData.reciprocidad.siguienteNivel}
                  progreso={mockData.reciprocidad.progreso}
                  contribucionesBienComun={mockData.reciprocidad.contribucionesBienComun}
                  balance={mockData.reciprocidad.balance}
                  elementos={mockData.elementos}
                  isLoading={isLoading}
                  isConnected={!intuitive.isOffline}
                />

                {/* Overlay sutil para mejor legibilidad */}
                <Box
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    background:
                      'linear-gradient(135deg, rgba(0, 188, 212, 0.02) 0%, transparent 50%, rgba(255, 107, 53, 0.02) 100%)',
                    pointerEvents: 'none',
                    borderRadius: 'inherit',
                  }}
                />
              </Box>

              {/* 📱 SIDEBAR OPTIMIZADO - CONTENIDO BALANCEADO */}
              <Box
                gridArea="sidebar"
                className="enhanced-sidebar enhanced-slide-up enhanced-delay-3"
                sx={{
                  position: 'relative',
                  // En móvil, convertir a horizontal scroll
                  flexDirection: {
                    xs: 'row',
                    md: 'column',
                  },
                  overflowX: {
                    xs: 'auto',
                    md: 'visible',
                  },
                  overflowY: 'visible',
                  gap: {
                    xs: 2, // 16px en móvil
                    md: 3, // 24px en desktop
                  },
                  paddingBottom: {
                    xs: 1, // Espacio para scroll horizontal
                    md: 0,
                  },
                }}
              >
                {/* Wallet - Widget Primario del Sidebar */}
                <Box
                  className="enhanced-sidebar-widget enhanced-card enhanced-delay-1"
                  sx={{
                    minWidth: { xs: '280px', md: 'auto' }, // Ancho mínimo en móvil
                    flex: { xs: '0 0 auto', md: '1' },
                    // Altura más balanceada
                    minHeight: {
                      xs: '180px',
                      md: '220px',
                      lg: '240px',
                    },
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    padding: {
                      xs: '12px',
                      md: '16px',
                      lg: '20px',
                    },
                  }}
                >
                  <WalletOverview
                    onAddFunds={() => navigate('/wallet/add')}
                    onSend={() => navigate('/wallet/send')}
                    onExchange={() => navigate('/wallet/exchange')}
                    onViewTransactions={() => navigate('/wallet/transactions')}
                  />
                  <Box className="enhanced-content-indicator" />
                </Box>

                {/* Notificaciones - Widget Secundario */}
                <Box
                  className="enhanced-sidebar-widget enhanced-scroll enhanced-delay-2"
                  sx={{
                    minWidth: { xs: '300px', md: 'auto' },
                    flex: { xs: '0 0 auto', md: '1' },
                    minHeight: {
                      xs: '160px',
                      md: '200px',
                      lg: '220px',
                    },
                    position: 'relative',
                  }}
                >
                  <NotificationCenter
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

                {/* Módulos Rápidos - Solo Desktop */}
                <Box
                  className="enhanced-sidebar-widget enhanced-delay-3"
                  sx={{
                    display: { xs: 'none', lg: 'flex' }, // Solo en pantallas grandes
                    flexDirection: 'column',
                    justifyContent: 'center',
                    minHeight: '180px',
                    position: 'relative',
                  }}
                >
                  <ModuleCards
                    onModuleClick={(moduleId) => {
                      setSnackbarMessage(
                        `🚀 Abriendo módulo: ${moduleId.toUpperCase()}`
                      );
                      setSnackbarOpen(true);
                    }}
                  />
                  <Box
                    className="enhanced-content-indicator"
                    sx={{ background: '#66BB6A' }}
                  />
                </Box>
              </Box>

              {/* ⚡ CENTRO DE ACCIONES - BARRA INTUITIVA OPTIMIZADA */}
              <Box
                gridArea="actions"
                className="enhanced-actions enhanced-glow enhanced-scale enhanced-delay-4"
                sx={{
                  position: {
                    xs: 'fixed', // Fijo en móvil para fácil acceso
                    md: 'static', // Estático en desktop
                  },
                  bottom: {
                    xs: 16, // Flotante en móvil
                    md: 'auto',
                  },
                  left: {
                    xs: 16,
                    md: 'auto',
                  },
                  right: {
                    xs: 16,
                    md: 'auto',
                  },
                  zIndex: 100,
                  // Altura optimizada
                  minHeight: {
                    xs: '80px', // Compacto en móvil
                    md: '120px', // Normal en desktop
                    lg: '140px', // Amplio en pantallas grandes
                  },
                  // Mejor distribución interna
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: {
                    xs: '8px 16px',
                    md: '12px 20px',
                    lg: '16px 24px',
                  },
                  // Efecto glassmorphism más sutil
                  backdropFilter: 'blur(20px)',
                  // Sombra más prominente en móvil
                  boxShadow: {
                    xs: '0 8px 32px rgba(0, 0, 0, 0.15)',
                    md: '0 4px 16px rgba(0, 0, 0, 0.08)',
                  },
                }}
              >
                <QuickActionsGrid
                  onActionClick={(action) => {
                    setSnackbarMessage(
                      `🚀 Navegando a ${action.toUpperCase()}`
                    );
                    setSnackbarOpen(true);
                  }}
                />

                {/* Indicador de centro de comando */}
                <Box
                  className="enhanced-content-indicator"
                  sx={{
                    background: '#FFD54F',
                    top: '8px',
                    right: '8px',
                  }}
                />
              </Box>

              {/* 📱 MÓDULOS MÓVILES - Distribución horizontal intuitiva */}
              <Box
                sx={{
                  display: { xs: 'block', lg: 'none' }, // Visible solo cuando módulos no están en sidebar
                  gridColumn: '1 / -1',
                  mt: { xs: 0, md: 3 }, // Sin margin top en móvil (por el fixed actions)
                  mb: { xs: 12, md: 0 }, // Margin bottom en móvil para el fixed actions
                }}
                className="enhanced-fade-in enhanced-delay-5"
              >
                <Box
                  sx={{
                    display: 'flex',
                    gap: 2,
                    overflowX: 'auto',
                    padding: '16px 0',
                    '& > *': {
                      minWidth: '250px',
                      flex: '0 0 auto',
                    },
                  }}
                  className="enhanced-scroll"
                >
                  <ModuleCards
                    onModuleClick={(moduleId) => {
                      setSnackbarMessage(
                        `🚀 Abriendo módulo: ${moduleId.toUpperCase()}`
                      );
                      setSnackbarOpen(true);
                    }}
                  />
                </Box>
              </Box>
            </Box>
          </Box>

          {/* 💡 Mensaje Inspiracional */}
          <Fade in timeout={2000}>
            <Box
              sx={{
                mt: { xs: 3, sm: 4 },
                p: 2,
                background: 'rgba(255, 255, 255, 0.08)',
                borderRadius: 'var(--revolutionary-radius-lg)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                textAlign: 'center',
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontSize: '0.95rem',
                  fontStyle: 'italic',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 2,
                }}
              >
                <AutoAwesomeIcon sx={{ color: '#FFD700' }} />
                "En cada acción de Reciprocidad, equilibras tu camino y contribuyes al Bien Común. ¡Sigue así!"
                <AutoAwesomeIcon sx={{ color: '#FFD700' }} />
              </Typography>
            </Box>
          </Fade>
        </Container>

        {/* 🎪 BOTÓN FLOTANTE DE SCROLL */}
        <Fade in={showScrollTop}>
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
            <KeyboardArrowUpIcon sx={{ color: 'white', fontSize: '1.8rem' }} />
          </Fab>
        </Fade>

        {/* 🎊 SNACKBAR */}
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
      </UniversalIntegrator>
    </HomeRevolutionaryErrorBoundary>
  );
};

export default HomeRevolutionary;
