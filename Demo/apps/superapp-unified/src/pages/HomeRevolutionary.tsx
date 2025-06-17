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

// 🚀 IMPORTAR COMPONENTES REVOLUCIONARIOS INDIVIDUALES
import WelcomeHeaderRevolutionary from '../components/home/WelcomeHeaderRevolutionary';
import AyniMetricsCardRevolutionary from '../components/home/AyniMetricsCardRevolutionary';
import WalletOverviewRevolutionary from '../components/home/WalletOverviewRevolutionary';
import QuickActionsGridRevolutionary from '../components/home/QuickActionsGridRevolutionary';
import ModuleCardsRevolutionary from '../components/home/ModuleCardsRevolutionary';
import NotificationCenterRevolutionary from '../components/home/NotificationCenterRevolutionary';

// 🎨 IMPORTAR SISTEMA REVOLUCIONARIO
import '../styles/home-revolutionary-system.css';

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
    // 🔥 Datos elementales para Balance Ayni
    elementos: {
      fuego: 85, // Pasión y acción
      agua: 92, // Fluir y adaptabilidad
      tierra: 78, // Estabilidad y confianza
      aire: 88, // Comunicación e ideas
    },
    // 💎 Métricas Ayni
    ayni: {
      ondas: 1250,
      meritos: 485,
      ayniLevel: 'Colaborador Equilibrado',
      nextLevel: 'Guardián del Bien Común',
      ayniProgress: 78,
      bienComunContributions: 23,
      balanceAyni: 0.85,
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
      <Box className="revolutionary-container">
        <Container
          maxWidth="xl"
          sx={{
            py: { xs: 2, sm: 3, md: 4 },
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

          {/* 🎯 SECCIÓN PRINCIPAL - HERO */}
          <Fade in timeout={800}>
            <Box sx={{ mb: { xs: 2, sm: 3 } }}>
              <WelcomeHeaderRevolutionary
                onNotificationClick={() => navigate('/notifications')}
                totalNotifications={unreadCount}
              />
            </Box>
          </Fade>

          {/* 🎨 GRID PRINCIPAL REVOLUCIONARIO */}
          <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }}>
            {/* 💎 BALANCE AYNI REVOLUCIONARIO */}
            <Grid item xs={12} md={6} lg={4}>
              <Fade in timeout={1000}>
                <Box>
                  <AyniMetricsCardRevolutionary
                    ondas={mockData.ayni.ondas}
                    meritos={mockData.ayni.meritos}
                    ayniLevel={mockData.ayni.ayniLevel}
                    nextLevel={mockData.ayni.nextLevel}
                    ayniProgress={mockData.ayni.ayniProgress}
                    bienComunContributions={
                      mockData.ayni.bienComunContributions
                    }
                    balanceAyni={mockData.ayni.balanceAyni}
                    elementos={mockData.elementos}
                    isLoading={isLoading}
                    isConnected={true}
                  />
                </Box>
              </Fade>
            </Grid>

            {/* 💰 WALLET REVOLUCIONARIO */}
            <Grid item xs={12} md={6} lg={4}>
              <Fade in timeout={1200}>
                <Box>
                  <WalletOverviewRevolutionary
                    onAddFunds={() => navigate('/wallet/add')}
                    onSend={() => navigate('/wallet/send')}
                    onExchange={() => navigate('/wallet/exchange')}
                    onViewTransactions={() => navigate('/wallet/transactions')}
                  />
                </Box>
              </Fade>
            </Grid>

            {/* 🔔 CENTRO DE NOTIFICACIONES */}
            <Grid item xs={12} md={6} lg={4}>
              <Fade in timeout={1400}>
                <Box>
                  <NotificationCenterRevolutionary
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

            {/* ⚡ ACCIONES RÁPIDAS REVOLUCIONARIAS */}
            <Grid item xs={12} lg={8}>
              <Fade in timeout={1600}>
                <Box>
                  <QuickActionsGridRevolutionary
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

            {/* 🎯 MÓDULOS PRINCIPALES REVOLUCIONARIOS */}
            <Grid item xs={12} lg={4}>
              <Fade in timeout={1800}>
                <Box>
                  <ModuleCardsRevolutionary
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
                "En cada acción de Ayni, equilibras tu camino y contribuyes al
                tejido sagrado del Bien Común"
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
    </HomeRevolutionaryErrorBoundary>
  );
};

export default HomeRevolutionary;
