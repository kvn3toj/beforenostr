import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Container,
  Grid,
  Alert,
  Button,
  Fade,
  Box,
  useTheme,
  alpha,
  Snackbar,
  Fab,
  Skeleton,
  useMediaQuery,
  Tooltip,
  CircularProgress,
} from '@mui/material';
import { 
  Refresh,
  AutoAwesome,
  EmojiEvents,
  Groups,
  KeyboardArrowUp,
  Update,
  Psychology,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  useDashboardData,
  useBackendAvailability,
  type BackendWalletData,
  type BackendGameData,
  type BackendUser,
} from '../hooks/useRealBackendData';
import { toSafeNumber } from '../utils/numberUtils';

// 🎯 Componentes modulares del Home
import {
  WelcomeHeader,
  AyniMetricsCard,
  WalletOverview,
  QuickActionsGrid,
  ModuleCards,
  NotificationCenter,
  // 🚀 Phase 3: Advanced Visual Components
  AdvancedInsightsPanel,
  AyniBalanceVisualization,
} from '../components/home';

// 🎨 Importar estilos Phase 3
import '../styles/home-enhanced.css';

// 🏷️ Tipos para las notificaciones
interface Notification {
  id: string;
  type: 'ayni' | 'meritos' | 'social' | 'marketplace' | 'system';
  title: string;
  message: string;
  time: string;
  icon: React.ReactElement;
  color: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
  isRead?: boolean;
  priority?: 'high' | 'medium' | 'low';
  actionLabel?: string;
  onAction?: () => void;
}

// 🎭 Datos mock con terminología CoomÜnity actualizada
const mockDashboardData = {
  gamification: {
    ondas: 1250, // Öndas (energía vibracional)
    meritos: 485, // Mëritos (logros por Bien Común)
    ayniLevel: 'Colaborador Equilibrado',
    nextLevel: 'Guardián del Bien Común',
    ayniProgress: 78,
    bienComunContributions: 23,
    balanceAyni: 0.85, // Proporción de dar/recibir
    streak: 12,
    elementos: {
      fuego: 85, // Pasión y acción
      agua: 92, // Fluir y adaptabilidad
      tierra: 78, // Estabilidad y confianza
      aire: 88, // Comunicación e ideas
    },
  },
  wallet: {
    lukas: 125075, // Lükas (moneda interna)
    ayniCredits: 480, // Créditos de reciprocidad
    monthlyChange: 15.2,
    pendingTransactions: 3,
    ayniBalance: 0.85, // Balance de dar/recibir
  },
  notifications: [
    {
      id: '1',
      type: 'ayni' as const,
      title: 'Ayni completado',
      message:
        'Has completado un intercambio equilibrado con María. Tu balance Ayni ha mejorado.',
      time: '2h',
      icon: <AutoAwesome />,
      color: 'success' as const,
      priority: 'high' as const,
    },
    {
      id: '2',
      type: 'meritos' as const,
      title: 'Nuevos Mëritos ganados',
      message:
        'Has ganado 50 Mëritos por tu contribución al proyecto "Huerta Comunitaria"',
      time: '4h',
      icon: <EmojiEvents />,
      color: 'warning' as const,
      priority: 'high' as const,
    },
    {
      id: '3',
      type: 'social' as const,
      title: 'Invitación a Comunidad',
      message:
        'Te han invitado a unirte al círculo "Emprendedores Confiables de Medellín"',
      time: '1d',
      icon: <Groups />,
      color: 'primary' as const,
      priority: 'medium' as const,
    },
  ] as Notification[],
};

// 🎯 Hook personalizado para scroll to top
const useScrollToTop = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, []);

  return { showScrollTop, scrollToTop };
};

// 🔄 Hook personalizado para actualizaciones en tiempo real
const useRealTimeUpdates = (refetchFunction?: () => void) => {
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [isUpdating, setIsUpdating] = useState(false);

  const updateData = useCallback(async () => {
    if (!refetchFunction) return;

    setIsUpdating(true);
    try {
      await refetchFunction();
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error updating data:', error);
    } finally {
      setIsUpdating(false);
    }
  }, [refetchFunction]);

  useEffect(() => {
    // Actualizar cada 30 segundos
    const interval = setInterval(updateData, 30000);
    return () => clearInterval(interval);
  }, [updateData]);

  return { lastUpdate, isUpdating, updateData };
};

// 🎯 Componente principal del Home
export const Home: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // 🎯 Estados locales
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [animate, setAnimate] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string>('');
  // 🚀 Phase 3: Advanced Visual States
  const [insightsPanelOpen, setInsightsPanelOpen] = useState(false);
  const [showAyniVisualization, setShowAyniVisualization] = useState(false);

  // 🔗 Conectar al backend real con fallback a mock data
  const backendAvailability = useBackendAvailability();
  const dashboardData = useDashboardData(user?.id || 'mock-user-id');

  // 🎯 Hooks personalizados para funcionalidades avanzadas
  const { showScrollTop, scrollToTop } = useScrollToTop();
  const { lastUpdate, isUpdating, updateData } = useRealTimeUpdates(dashboardData.refetch);

  // 🎯 Decidir qué datos usar basado en disponibilidad del backend
  const gameData = dashboardData.gameData as BackendGameData | undefined;
  const walletData = dashboardData.walletData as BackendWalletData | undefined;
  const userData = dashboardData.userProfile as BackendUser | undefined;

  // 🎨 Animación de entrada
  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // 🔄 Función para refrescar datos con feedback
  const handleRefresh = useCallback(async () => {
    try {
      await updateData();
      setSuccessMessage('Datos actualizados correctamente');
    } catch (error) {
      console.error('Error refreshing data:', error);
    }
  }, [updateData]);

  // 🎯 Handlers para las acciones (optimizados con useCallback)
  const handleNotificationClick = useCallback(() => {
    setNotificationsOpen(!notificationsOpen);
  }, [notificationsOpen]);

  const handleSettingsClick = useCallback(() => {
    navigate('/profile');
  }, [navigate]);

  const handleModuleClick = useCallback((path: string) => {
    // Analytics tracking aquí si es necesario
    navigate(path);
  }, [navigate]);

  const handleQuickActionClick = useCallback((path: string) => {
    navigate(path);
  }, [navigate]);

  // 🚀 Phase 3: Advanced Visual Handlers
  const handleInsightsClick = useCallback(() => {
    setInsightsPanelOpen(true);
  }, []);

  const handleInsightsPanelClose = useCallback(() => {
    setInsightsPanelOpen(false);
  }, []);

  const handleAyniVisualizationToggle = useCallback(() => {
    setShowAyniVisualization(!showAyniVisualization);
  }, [showAyniVisualization]);

  // 🎨 Mapear datos del backend al formato esperado por la UI (optimizado con useMemo)
  const normalizedGameData = useMemo(() => {
    const experience = toSafeNumber(gameData?.experience, mockDashboardData.gamification.ondas);
    const wisdom = toSafeNumber(gameData?.stats?.wisdom, 0);
    const nextLevelExp = toSafeNumber(gameData?.nextLevelExp, 2000);

    return {
      ondas: experience,
      meritos: wisdom > 0 ? wisdom * 10 : mockDashboardData.gamification.meritos,
      ayniLevel: gameData?.title || mockDashboardData.gamification.ayniLevel,
      nextLevel: mockDashboardData.gamification.nextLevel,
      ayniProgress: Math.floor((experience / nextLevelExp) * 100) || mockDashboardData.gamification.ayniProgress,
      bienComunContributions: mockDashboardData.gamification.bienComunContributions,
      balanceAyni: mockDashboardData.gamification.balanceAyni,
      streak: mockDashboardData.gamification.streak,
      elementos: mockDashboardData.gamification.elementos,
    };
  }, [gameData]);

  const normalizedWalletData = useMemo(() => {
    return {
      lukas: toSafeNumber(walletData?.balance, mockDashboardData.wallet.lukas),
      ayniCredits: toSafeNumber(walletData?.ucoins, mockDashboardData.wallet.ayniCredits),
      monthlyChange: mockDashboardData.wallet.monthlyChange,
      pendingTransactions: mockDashboardData.wallet.pendingTransactions,
      ayniBalance: mockDashboardData.wallet.ayniBalance,
    };
  }, [walletData]);

  // 🎯 Componente de esqueleto de carga
  const LoadingSkeleton = () => (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Skeleton variant="rectangular" height={120} sx={{ mb: 3, borderRadius: 2 }} />
      <Grid container spacing={3}>
        <Grid size={{xs:12,lg:8}}>
          <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 2 }} />
        </Grid>
        <Grid size={{xs:12,lg:4}}>
          <Skeleton variant="rectangular" height={200} sx={{ mb: 2, borderRadius: 2 }} />
          <Skeleton variant="rectangular" height={180} sx={{ borderRadius: 2 }} />
        </Grid>
      </Grid>
    </Container>
  );

  // 🎯 Mostrar esqueleto mientras carga
  if (dashboardData.isLoading && !gameData && !walletData) {
    return <LoadingSkeleton />;
  }

  return (
    <Container 
      maxWidth="xl" 
      className="home-container coomunity-container gradient-mesh-bg" 
      sx={{ py: 3, position: 'relative' }}
    >
      {/* 🔗 Estado de conexión al backend */}
      {!backendAvailability.isAvailable && (
        <Fade in={true}>
          <Alert
            severity="warning"
            action={
              <Button
                size="small"
                startIcon={<Refresh />}
                onClick={handleRefresh}
                disabled={isUpdating}
                sx={{ color: 'inherit' }}
              >
                {isUpdating ? <CircularProgress size={16} color="inherit" /> : 'Reintentar'}
              </Button>
            }
            sx={{
              mb: 3,
              borderRadius: 2,
              bgcolor: alpha(theme.palette.warning.main, 0.1),
              border: `1px solid ${alpha(theme.palette.warning.main, 0.3)}`,
            }}
          >
            🔌 Modo Offline - Experimentando con datos simulados de CoomÜnity
          </Alert>
        </Fade>
      )}

      {/* 🔄 Indicador de actualización en tiempo real */}
      {backendAvailability.isAvailable && (
        <Fade in={true}>
          <Alert
            severity="info"
            action={
              <Tooltip title={`Última actualización: ${lastUpdate.toLocaleTimeString()}`}>
                <Button
                  size="small"
                  startIcon={isUpdating ? <CircularProgress size={16} color="inherit" /> : <Update />}
                  onClick={handleRefresh}
                  disabled={isUpdating}
                  sx={{ color: 'inherit' }}
                >
                  {isUpdating ? 'Actualizando...' : 'Actualizar'}
                </Button>
              </Tooltip>
            }
            sx={{
              mb: 3,
              borderRadius: 2,
              bgcolor: alpha(theme.palette.info.main, 0.1),
              border: `1px solid ${alpha(theme.palette.info.main, 0.3)}`,
            }}
          >
            🌐 Conectado al backend - Datos en tiempo real
          </Alert>
        </Fade>
      )}

      {/* 🎯 Header principal con saludo personalizado */}
      <Fade in={animate} timeout={600}>
        <Box sx={{ mb: 4 }}>
          <WelcomeHeader
            userName={
              (userData?.full_name || '').split(' ')[0] ||
              (user?.full_name || '').split(' ')[0] ||
              'CoomÜnity'
            }
            isBackendConnected={backendAvailability.isAvailable}
            notificationCount={mockDashboardData.notifications.length}
            onNotificationClick={handleNotificationClick}
            onSettingsClick={handleSettingsClick}
            ayniLevel={normalizedGameData.ayniLevel}
            progressToNextLevel={normalizedGameData.ayniProgress}
            lastAchievement="Guardián del Agua"
          />
        </Box>
      </Fade>

      <Grid container spacing={3}>
        {/* 🎯 Panel principal - Métricas Ayni */}
        <Grid size={{xs:12,lg:8}}>
          <Fade in={animate} timeout={800}>
            <Box className="">
              <AyniMetricsCard
                ondas={normalizedGameData.ondas}
                meritos={normalizedGameData.meritos}
                ayniLevel={normalizedGameData.ayniLevel}
                nextLevel={normalizedGameData.nextLevel}
                ayniProgress={normalizedGameData.ayniProgress}
                bienComunContributions={
                  normalizedGameData.bienComunContributions
                }
                balanceAyni={normalizedGameData.balanceAyni}
                elementos={normalizedGameData.elementos}
                isLoading={dashboardData.isLoading}
                isConnected={backendAvailability.isAvailable}
              />
            </Box>
          </Fade>
        </Grid>

        {/* 🎯 Panel lateral - Wallet y acciones */}
        <Grid size={{xs:12,lg:4}}>
          <Fade in={animate} timeout={1000}>
            <Grid container spacing={3}>
              {/* 💰 Wallet Overview */}
              <Grid size={{xs:12}}>
                <WalletOverview
                  lukas={normalizedWalletData.lukas}
                  ayniCredits={normalizedWalletData.ayniCredits}
                  monthlyChange={normalizedWalletData.monthlyChange}
                  pendingTransactions={normalizedWalletData.pendingTransactions}
                  ayniBalance={normalizedWalletData.ayniBalance}
                  isLoading={dashboardData.isLoading}
                  isConnected={backendAvailability.isAvailable}
                />
              </Grid>

              {/* 🎯 Acciones Ayni */}
              <Grid size={{xs:12}}>
                <QuickActionsGrid onActionClick={handleQuickActionClick} />
              </Grid>

              {/* 🚀 Phase 3: Ayni Balance Visualization */}
              <Grid size={{xs:12}}>
                <Fade in={animate} timeout={1200}>
                  <Box>
                    <AyniBalanceVisualization
                      balanceAyni={normalizedGameData.balanceAyni}
                      elementos={normalizedGameData.elementos}
                      className=""
                    />
                  </Box>
                </Fade>
              </Grid>
            </Grid>
          </Fade>
        </Grid>

        {/* 🎯 Módulos principales */}
        <Grid size={{xs:12}}>
          <Fade in={animate} timeout={1400}>
                          <Box className="">
              <ModuleCards onModuleClick={handleModuleClick} />
            </Box>
          </Fade>
        </Grid>

        {/* 🔔 Centro de notificaciones */}
        {notificationsOpen && (
          <Grid size={{xs:12}}>
            <NotificationCenter
              notifications={mockDashboardData.notifications}
              isOpen={notificationsOpen}
              onNotificationClick={(notification) => {
                console.log('Notification clicked:', notification);
                // Aquí puedes manejar la navegación específica para cada tipo de notificación
              }}
              onMarkAsRead={(notificationId) => {
                console.log('Mark as read:', notificationId);
                // Aquí puedes actualizar el estado de la notificación
              }}
              onClearAll={() => {
                console.log('Clear all notifications');
                setNotificationsOpen(false);
              }}
            />
          </Grid>
        )}
      </Grid>

      {/* 🌟 Mensaje inspiracional flotante */}
      <Box
        sx={{
          position: 'fixed',
          bottom: isMobile ? 80 : 24,
          right: 24,
          maxWidth: isMobile ? 280 : 300,
          p: 2,
          borderRadius: 3,
          background: `linear-gradient(135deg, ${alpha(
            theme.palette.primary.main,
            0.9
          )} 0%, ${alpha(theme.palette.secondary.main, 0.9)} 100%)`,
          color: 'white',
          boxShadow: theme.shadows[8],
          backdropFilter: 'blur(10px)',
          border: `1px solid ${alpha('#fff', 0.2)}`,
          opacity: animate ? 1 : 0,
          transform: animate ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.6s ease-in-out 2s',
          zIndex: 1000,
        }}
      >
        <Box sx={{ fontSize: '1.2rem', mb: 1 }}>🌟</Box>
        <Box sx={{ fontSize: '0.85rem', fontWeight: 'bold', mb: 0.5 }}>
          Reflexión del día
        </Box>
        <Box sx={{ fontSize: '0.75rem', opacity: 0.9, fontStyle: 'italic' }}>
          "En cada acción de Ayni que realizas, no solo equilibras tu propio
          camino, sino que contribuyes al tejido sagrado del Bien Común"
        </Box>
      </Box>

      {/* 🚀 Phase 3: Floating Action Button for Insights */}
      <Fade in={animate} timeout={2000}>
        <Tooltip title="Ver Insights Inteligentes" placement="left">
          <Fab
            color="secondary"
            size="medium"
            onClick={handleInsightsClick}
            sx={{
              position: 'fixed',
              bottom: isMobile ? 24 : 170,
              right: 24,
              zIndex: 1000,
              background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.primary.main} 100%)`,
              '&:hover': {
                background: `linear-gradient(135deg, ${theme.palette.secondary.dark} 0%, ${theme.palette.primary.dark} 100%)`,
                transform: 'scale(1.1)',
              },
              transition: 'all 0.3s ease-in-out',
              animation: 'gentle-pulse 3s ease-in-out infinite',
            }}
          >
            <Psychology />
          </Fab>
        </Tooltip>
      </Fade>

      {/* 🔝 Botón flotante para scroll to top */}
      <Fade in={showScrollTop}>
        <Fab
          color="primary"
          size="medium"
          onClick={scrollToTop}
          sx={{
            position: 'fixed',
            bottom: isMobile ? 24 : 100,
            right: 24,
            zIndex: 1000,
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
            '&:hover': {
              background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.secondary.dark} 100%)`,
              transform: 'scale(1.1)',
            },
            transition: 'all 0.3s ease-in-out',
          }}
        >
          <KeyboardArrowUp />
        </Fab>
      </Fade>

      {/* 🎯 Snackbar para mensajes de éxito */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={3000}
        onClose={() => setSuccessMessage('')}
        message={successMessage}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />

      {/* 🚀 Phase 3: Advanced Insights Panel */}
      {insightsPanelOpen && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: alpha('#000', 0.5),
            backdropFilter: 'blur(8px)',
            zIndex: 1200,
          }}
          onClick={handleInsightsPanelClose}
        />
      )}
      <AdvancedInsightsPanel
        gameData={normalizedGameData}
        walletData={normalizedWalletData}
        isVisible={insightsPanelOpen}
        onClose={handleInsightsPanelClose}
      />
    </Container>
  );
};

export default Home;
