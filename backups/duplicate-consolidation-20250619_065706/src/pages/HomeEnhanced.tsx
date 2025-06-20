import React, { useState, useEffect, useCallback, useMemo } from 'react';

// 🎯 REGLA #1: IMPORTS ESPECÍFICOS DE MATERIAL UI
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Fade from '@mui/material/Fade';
import Box from '@mui/material/Box';
import Snackbar from '@mui/material/Snackbar';
import Fab from '@mui/material/Fab';
import Skeleton from '@mui/material/Skeleton';
import Tooltip from '@mui/material/Tooltip';
import CircularProgress from '@mui/material/CircularProgress';
import Badge from '@mui/material/Badge';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Slide from '@mui/material/Slide';
import Zoom from '@mui/material/Zoom';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import { useTheme, alpha, useMediaQuery } from '@mui/material';

// 🎯 REGLA #1: IMPORTS ESPECÍFICOS DE ICONOS
import RefreshIcon from '@mui/icons-material/Refresh';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import GroupsIcon from '@mui/icons-material/Groups';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import UpdateIcon from '@mui/icons-material/Update';
import PsychologyIcon from '@mui/icons-material/Psychology';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import InsightsIcon from '@mui/icons-material/Insights';
import SpeedIcon from '@mui/icons-material/Speed';
import WavingHandIcon from '@mui/icons-material/WavingHand';
import BoltIcon from '@mui/icons-material/Bolt';
import DiamondIcon from '@mui/icons-material/Diamond';
import StarIcon from '@mui/icons-material/Star';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import HandshakeIcon from '@mui/icons-material/Handshake';

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

// 🎯 Componentes modulares del Home TODOS
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
  PerformanceMonitor,
  SmartQuickActions,
  IntelligentNotificationCenter,
  // 🌟 Fase Avanzada: Componentes 3D
  EnergyWeatherWidget,
  LiveActivityFeed,
  EnhancedParticles,
  // 🎯 Widgets adicionales
  PersonalProgressWidget,
  ActiveChallengesWidget,
  // 🚀 Componentes revolucionarios
  AyniMetricsCardRevolutionary,
} from '../components/home';

// 🎨 Importar todos los estilos
import '../styles/home-enhanced.css';
import '../styles/home-effects-advanced.css';
import '../styles/home-renovated.css';
import '../styles/home-harmony.css';
import '../styles/ayni-revolutionary.css';

// 🏷️ Tipos para las notificaciones inteligentes
interface Notification {
  id: string;
  type:
    | 'ayni'
    | 'meritos'
    | 'social'
    | 'marketplace'
    | 'system'
    | 'achievement'
    | 'tip';
  title: string;
  message: string;
  time: string;
  icon: React.ReactElement;
  color: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
  isRead?: boolean;
  priority: 'critical' | 'high' | 'medium' | 'low';
  actionLabel?: string;
  onAction?: () => void;
  category: 'urgent' | 'social' | 'achievement' | 'tip' | 'system';
  aiScore?: number;
  userEngagement?: number;
  smartSuggestion?: string;
}

// 🎭 Datos mock completos con terminología CoomÜnity
const enhancedMockData = {
  gamification: {
    ondas: 1250,
    meritos: 485,
    ayniLevel: 'Colaborador Equilibrado',
    nextLevel: 'Guardián del Bien Común',
    ayniProgress: 78,
    bienComunContributions: 23,
    balanceAyni: 0.85,
    streak: 12,
    elementos: {
      fuego: 85,
      agua: 92,
      tierra: 78,
      aire: 88,
    },
  },
  wallet: {
    lukas: 125075,
    ayniCredits: 480,
    monthlyChange: 15.2,
    pendingTransactions: 3,
    ayniBalance: 0.85,
  },
  notifications: [
    {
      id: '1',
      type: 'ayni' as const,
      title: 'Ayni completado',
      message:
        'Has completado un intercambio equilibrado con María. Tu balance Ayni ha mejorado.',
      time: '2h',
      icon: <AutoAwesomeIcon />,
      color: 'success' as const,
      priority: 'high' as const,
      actionLabel: 'Ver detalles',
      onAction: () => console.log('Viewing Ayni details'),
      category: 'achievement' as const,
      aiScore: 95,
      userEngagement: 90,
      smartSuggestion: 'Continúa cultivando intercambios equilibrados',
    },
    {
      id: '2',
      type: 'meritos' as const,
      title: 'Nuevos Mëritos ganados',
      message:
        'Has ganado 50 Mëritos por tu contribución al proyecto "Huerta Comunitaria"',
      time: '4h',
      icon: <EmojiEventsIcon />,
      color: 'warning' as const,
      priority: 'high' as const,
      actionLabel: 'Ver logros',
      onAction: () => console.log('Viewing achievements'),
      category: 'achievement' as const,
      aiScore: 88,
      userEngagement: 85,
      smartSuggestion: 'Explora más proyectos comunitarios',
    },
    {
      id: '3',
      type: 'social' as const,
      title: 'Invitación a Comunidad',
      message:
        'Te han invitado a unirte al círculo "Emprendedores Confiables de Medellín"',
      time: '1d',
      icon: <GroupsIcon />,
      color: 'primary' as const,
      priority: 'medium' as const,
      actionLabel: 'Responder',
      onAction: () => console.log('Responding to invitation'),
      category: 'social' as const,
      aiScore: 78,
      userEngagement: 70,
      smartSuggestion: 'Las conexiones locales potencian tu crecimiento',
    },
  ] as Notification[],
};

// 🎯 Hook personalizado para scroll to top
const useScrollToTop = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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
      console.error('🚨 Error updating data:', error);
    } finally {
      setIsUpdating(false);
    }
  }, [refetchFunction]);

  useEffect(() => {
    const interval = setInterval(updateData, 30000);
    return () => clearInterval(interval);
  }, [updateData]);

  return { lastUpdate, isUpdating, updateData };
};

// 🎯 Componente principal mejorado
export const HomeEnhanced: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.between('md', 'lg'));

  // 🎯 Estados locales
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [animate, setAnimate] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string>('');

  // 🚀 Estados avanzados
  const [insightsPanelOpen, setInsightsPanelOpen] = useState(false);
  const [showAyniVisualization, setShowAyniVisualization] = useState(false);
  const [quickActionsExpanded, setQuickActionsExpanded] = useState(false);
  const [performanceMode, setPerformanceMode] = useState<
    'normal' | 'optimized'
  >('normal');
  const [notificationFilter, setNotificationFilter] = useState<
    'all' | 'high' | 'unread'
  >('all');

  // 🎯 Estados de interacción avanzados
  const [hoveredModule, setHoveredModule] = useState<string | null>(null);
  const [lastInteraction, setLastInteraction] = useState<Date>(new Date());
  const [userPreferences, setUserPreferences] = useState({
    autoRefresh: true,
    showAnimations: true,
    compactMode: false,
  });

  // 🔗 Conectar al backend real
  const backendAvailability = useBackendAvailability();
  const dashboardData = useDashboardData(user?.id || 'mock-user-id');

  // 🎯 Hooks personalizados
  const { showScrollTop, scrollToTop } = useScrollToTop();
  const { lastUpdate, isUpdating, updateData } = useRealTimeUpdates(
    dashboardData.refetch
  );

  // 🎯 Datos del backend
  const gameData = dashboardData.gameData as BackendGameData | undefined;
  const walletData = dashboardData.walletData as BackendWalletData | undefined;
  const userData = dashboardData.userProfile as BackendUser | undefined;

  // 🎯 Notificaciones filtradas
  const filteredNotifications = useMemo(() => {
    const notifications = enhancedMockData.notifications;

    switch (notificationFilter) {
      case 'high':
        return notifications.filter((n) => n.priority === 'high');
      case 'unread':
        return notifications.filter((n) => !n.isRead);
      default:
        return notifications;
    }
  }, [notificationFilter]);

  const notificationStats = useMemo(() => {
    const total = enhancedMockData.notifications.length;
    const unread = enhancedMockData.notifications.filter(
      (n) => !n.isRead
    ).length;
    const high = enhancedMockData.notifications.filter(
      (n) => n.priority === 'high'
    ).length;

    return { total, unread, high };
  }, []);

  // 🎨 Mapear datos del backend al formato esperado
  const normalizedGameData = useMemo(() => {
    const experience = toSafeNumber(
      gameData?.experience,
      enhancedMockData.gamification.ondas
    );
    const wisdom = toSafeNumber(gameData?.stats?.wisdom, 0);
    const nextLevelExp = toSafeNumber(gameData?.nextLevelExp, 2000);

    return {
      ondas: experience,
      meritos: wisdom > 0 ? wisdom * 10 : enhancedMockData.gamification.meritos,
      ayniLevel: gameData?.title || enhancedMockData.gamification.ayniLevel,
      nextLevel: enhancedMockData.gamification.nextLevel,
      ayniProgress:
        Math.floor((experience / nextLevelExp) * 100) ||
        enhancedMockData.gamification.ayniProgress,
      bienComunContributions:
        enhancedMockData.gamification.bienComunContributions,
      balanceAyni: enhancedMockData.gamification.balanceAyni,
      streak: enhancedMockData.gamification.streak,
      elementos: enhancedMockData.gamification.elementos,
    };
  }, [gameData]);

  const normalizedWalletData = useMemo(() => {
    return {
      lukas: toSafeNumber(walletData?.balance, enhancedMockData.wallet.lukas),
      ayniCredits: toSafeNumber(
        walletData?.ucoins,
        enhancedMockData.wallet.ayniCredits
      ),
      monthlyChange: enhancedMockData.wallet.monthlyChange,
      pendingTransactions: enhancedMockData.wallet.pendingTransactions,
      ayniBalance: enhancedMockData.wallet.ayniBalance,
    };
  }, [walletData]);

  // 🎨 Hero personalizado dinámico
  const heroData = useMemo(() => {
    const hour = new Date().getHours();
    let greeting = '¡Buen día!';
    if (hour < 12) greeting = '¡Buenos días!';
    else if (hour < 18) greeting = '¡Buenas tardes!';
    else greeting = '¡Buenas noches!';

    const userName = (
      userData?.full_name ||
      user?.full_name ||
      'CoomÜnity'
    ).split(' ')[0];

    return {
      greeting,
      userName,
      level: normalizedGameData.ayniLevel,
      progress: Math.min(95, (normalizedGameData.ondas / 2000) * 100),
      streak: normalizedGameData.streak,
    };
  }, [userData, user, normalizedGameData]);

  // 🎨 Animación de entrada
  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // 🧹 CLEANUP OBLIGATORIO
  useEffect(() => {
    return () => {
      // Cleanup resources
    };
  }, []);

  // 🛡️ Error boundary para debugging
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      if (
        event.message.includes('Builder') ||
        event.message.includes('hook') ||
        event.filename?.includes('builder')
      ) {
        console.error('🚨 Builder.io Error detectado en HomeEnhanced:', {
          message: event.message,
          filename: event.filename,
          component: 'HomeEnhanced',
        });
      }
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  // 🔄 Función para refrescar datos
  const handleRefresh = useCallback(async () => {
    try {
      setLastInteraction(new Date());
      await updateData();
      setSuccessMessage('Datos actualizados correctamente');
    } catch (error) {
      console.error('🚨 Error refreshing data:', error);
      setSuccessMessage('Error al actualizar. Reintentando...');
    }
  }, [updateData]);

  // 🎯 Handlers básicos
  const handleSettingsClick = useCallback(() => {
    setLastInteraction(new Date());
    navigate('/profile');
  }, [navigate]);

  const handleInsightsClick = useCallback(() => {
    setLastInteraction(new Date());
    setInsightsPanelOpen(true);
  }, []);

  const handleInsightsPanelClose = useCallback(() => {
    setInsightsPanelOpen(false);
  }, []);

  const handleNotificationClick = useCallback(() => {
    setLastInteraction(new Date());
    setNotificationsOpen(!notificationsOpen);
  }, [notificationsOpen]);

  const handleNotificationFilterChange = useCallback(
    (filter: 'all' | 'high' | 'unread') => {
      setNotificationFilter(filter);
    },
    []
  );

  const handleModuleClick = useCallback(
    (moduleId: string, path: string) => {
      setLastInteraction(new Date());
      setHoveredModule(null);
      console.log('🎯 Module clicked:', { moduleId, path });
      navigate(path);
    },
    [navigate]
  );

  const handleQuickActionClick = useCallback(
    (path: string, actionType?: string) => {
      setLastInteraction(new Date());
      console.log('⚡ Quick action:', { path, actionType });
      navigate(path);
    },
    [navigate]
  );

  const handleModuleHover = useCallback((moduleId: string | null) => {
    setHoveredModule(moduleId);
  }, []);

  const handleQuickActionsToggle = useCallback(() => {
    setQuickActionsExpanded(!quickActionsExpanded);
  }, [quickActionsExpanded]);

  const handlePerformanceModeToggle = useCallback(() => {
    const newMode = performanceMode === 'normal' ? 'optimized' : 'normal';
    setPerformanceMode(newMode);
    setUserPreferences((prev) => ({
      ...prev,
      showAnimations: newMode === 'normal',
    }));
  }, [performanceMode]);

  const handleNotificationAction = useCallback((notification: Notification) => {
    setLastInteraction(new Date());
    console.log('���� Notification action:', notification);
    if (notification.onAction) {
      notification.onAction();
    }
  }, []);

  // 🎨 Hero Section Mejorado
  const renderEnhancedHero = () => (
    <Fade in={animate} timeout={600}>
      <Box
        className="harmony-card-hero harmony-section-hero"
        sx={{
          background: `linear-gradient(135deg,
            ${alpha(theme.palette.primary.main, 0.9)} 0%,
            ${alpha(theme.palette.secondary.main, 0.8)} 50%,
            ${alpha(theme.palette.primary.dark, 0.9)} 100%)`,
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            animation: 'float-pattern 20s ease-in-out infinite',
          },
        }}
      >
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={8}>
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Box
                sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}
              >
                <WavingHandIcon sx={{ fontSize: '2rem', color: '#FFD54F' }} />
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 'bold',
                    color: 'white',
                    fontSize: { xs: '1.8rem', md: '2.5rem' },
                  }}
                >
                  {heroData.greeting}
                </Typography>
              </Box>

              <Typography
                variant="h4"
                sx={{
                  color: 'white',
                  mb: 1,
                  fontSize: { xs: '1.5rem', md: '2rem' },
                }}
              >
                {heroData.userName}
              </Typography>

              <Typography
                variant="h6"
                sx={{
                  color: alpha('#fff', 0.9),
                  mb: 3,
                  fontSize: { xs: '1rem', md: '1.25rem' },
                }}
              >
                {heroData.level}
              </Typography>

              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Chip
                  icon={<BoltIcon />}
                  label={`${normalizedGameData.ondas} Öndas`}
                  sx={{
                    bgcolor: alpha('#FFD54F', 0.2),
                    color: '#FFD54F',
                    fontWeight: 'bold',
                  }}
                />
                <Chip
                  icon={<DiamondIcon />}
                  label={`${normalizedGameData.meritos} Mëritos`}
                  sx={{
                    bgcolor: alpha('#4FC3F7', 0.2),
                    color: '#4FC3F7',
                    fontWeight: 'bold',
                  }}
                />
                <Chip
                  icon={<StarIcon />}
                  label={`${heroData.streak} días seguidos`}
                  sx={{
                    bgcolor: alpha('#8BC34A', 0.2),
                    color: '#8BC34A',
                    fontWeight: 'bold',
                  }}
                />
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
              <Box
                sx={{
                  width: 180,
                  height: 180,
                  borderRadius: '50%',
                  background: `conic-gradient(from 0deg, #8BC34A 0deg ${heroData.progress * 3.6}deg, rgba(255,255,255,0.2) ${heroData.progress * 3.6}deg 360deg)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  animation: 'rotate-slow 20s linear infinite',
                }}
              >
                <Box
                  sx={{
                    width: 140,
                    height: 140,
                    borderRadius: '50%',
                    bgcolor: alpha('#fff', 0.1),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  <Typography
                    variant="h4"
                    sx={{ color: 'white', fontWeight: 'bold', mb: 1 }}
                  >
                    {Math.round(normalizedGameData.balanceAyni * 100)}%
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: alpha('#fff', 0.8) }}
                  >
                    Balance Ayni
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Fade>
  );

  // 🎯 Esqueleto de carga
  const LoadingSkeleton = () => (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Skeleton
        variant="rectangular"
        height={120}
        sx={{ mb: 3, borderRadius: 2 }}
      />
      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <Skeleton
            variant="rectangular"
            height={400}
            sx={{ borderRadius: 2 }}
          />
        </Grid>
        <Grid item xs={12} lg={4}>
          <Skeleton
            variant="rectangular"
            height={200}
            sx={{ mb: 2, borderRadius: 2 }}
          />
          <Skeleton
            variant="rectangular"
            height={180}
            sx={{ borderRadius: 2 }}
          />
        </Grid>
      </Grid>
    </Container>
  );

  // 🎯 Mostrar esqueleto mientras carga
  if (dashboardData.isLoading && !gameData && !walletData) {
    return <LoadingSkeleton />;
  }

  return (
    <Box
      className="home-enhanced-container"
      sx={{
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* 🌌 FONDO CÓSMICO - Widget Ayni Balance como fondo de pantalla */}
      {/* TEMPORALMENTE DESHABILITADO PARA EVITAR DUPLICACIÓN */}
      {/*
      <Fade in={animate} timeout={600}>
        <Box
          className="background-ayni-visualization"
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 0, // Fondo
            pointerEvents: 'none', // No interfiere con navegación
          }}
        >
          <AyniBalanceVisualization
            balanceAyni={normalizedGameData.balanceAyni}
            elementos={normalizedGameData.elementos}
            userLevel={normalizedGameData.ayniLevel}
            recentActivity={{
              streak: normalizedGameData.streak,
              lastInteraction: lastInteraction,
              totalContributions: normalizedGameData.bienComunContributions,
            }}
            className="fullscreen-background"
          />
        </Box>
      </Fade>
      */}

      <Container
        maxWidth="xl"
        className="home-container coomunity-container harmony-container"
        sx={{ position: 'relative', zIndex: 10 }}
      >
        {/* 🔗 Estado de conexión al backend */}
        {!backendAvailability.isAvailable && (
          <Fade in={true}>
            <Alert
              severity="warning"
              action={
                <Button
                  size="small"
                  startIcon={
                    isUpdating ? (
                      <CircularProgress size={16} color="inherit" />
                    ) : (
                      <RefreshIcon />
                    )
                  }
                  onClick={handleRefresh}
                  disabled={isUpdating}
                  sx={{ color: 'inherit' }}
                >
                  {isUpdating ? 'Actualizando...' : 'Reintentar'}
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

        {/* 🚀 Sistema Solar Ayni 3D - TEMPORALMENTE DESHABILITADO PARA EVITAR DUPLICACIÓN */}
        {/* Balance Ayni como fondo - Comentado para evitar duplicación */}

        {/*  Hero Section Mejorado */}
        {renderEnhancedHero()}

        <Grid container className="harmony-grid">
          {/* 🎯 Panel principal - Métricas Ayni mejoradas */}
          <Grid item xs={12} lg={8}>
            <Fade in={animate} timeout={800}>
              <Box className="harmony-section">
                <AyniMetricsCardRevolutionary
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

            {/* 🌊 LiveActivityFeed integrado */}
            <Fade in={animate} timeout={1000}>
              <Box className="harmony-section-compact">
                <LiveActivityFeed
                  maxActivities={6}
                  updateInterval={20}
                  className=""
                />
              </Box>
            </Fade>
          </Grid>

          {/* 🎯 Panel lateral mejorado */}
          <Grid item xs={12} lg={4}>
            <Fade in={animate} timeout={1000}>
              <Grid container className="harmony-grid-compact">
                {/* 💰 Wallet Overview */}
                <Grid item xs={12}>
                  <Box className="harmony-widget-compact">
                    <WalletOverview
                      lukas={normalizedWalletData.lukas}
                      ayniCredits={normalizedWalletData.ayniCredits}
                      monthlyChange={normalizedWalletData.monthlyChange}
                      pendingTransactions={
                        normalizedWalletData.pendingTransactions
                      }
                      ayniBalance={normalizedWalletData.ayniBalance}
                      isLoading={dashboardData.isLoading}
                      isConnected={backendAvailability.isAvailable}
                    />
                  </Box>
                </Grid>

                {/* 🚀 Acciones Ayni mejoradas */}
                <Grid item xs={12}>
                  <Box className="harmony-widget">
                    <SmartQuickActions
                      onActionClick={(action) =>
                        handleQuickActionClick(action.path, action.category)
                      }
                      isExpanded={quickActionsExpanded}
                      onToggleExpanded={handleQuickActionsToggle}
                      performanceMode={performanceMode}
                      userLevel={
                        normalizedGameData.ayniProgress > 80
                          ? 'advanced'
                          : normalizedGameData.ayniProgress > 40
                            ? 'intermediate'
                            : 'beginner'
                      }
                    />
                  </Box>
                </Grid>

                {/* 🌤️ EnergyWeatherWidget */}
                <Grid item xs={12}>
                  <Box className="harmony-widget">
                    <EnergyWeatherWidget
                      userMetrics={{
                        ondas: normalizedGameData.ondas,
                        meritos: normalizedGameData.meritos,
                        elementos: normalizedGameData.elementos,
                        balanceAyni: normalizedGameData.balanceAyni,
                        socialConnections: 28,
                      }}
                      className=""
                    />
                  </Box>
                </Grid>

                {/* 🎯 Personal Progress Widget */}
                <Grid item xs={12}>
                  <Box className="harmony-widget-expanded">
                    <PersonalProgressWidget
                      userLevel={normalizedGameData.ayniLevel}
                      currentXP={normalizedGameData.ondas}
                      nextLevelXP={2000}
                      dailyGoals={3}
                      weeklyGoals={8}
                      monthlyGoals={25}
                      achievements={[
                        {
                          id: 'daily-1',
                          title: 'Energía Matutina',
                          description: 'Genera 50 Öndas antes de las 10 AM',
                          icon: <LocalFireDepartmentIcon />,
                          color: '#FF6B35',
                          progress: 35,
                          maxProgress: 50,
                          isCompleted: false,
                          reward: '25 Öndas bonus',
                          category: 'daily',
                        },
                        {
                          id: 'daily-2',
                          title: 'Conector Social',
                          description: 'Realiza 3 intercambios Ayni',
                          icon: <HandshakeIcon />,
                          color: '#4FC3F7',
                          progress: 2,
                          maxProgress: 3,
                          isCompleted: false,
                          reward: '15 Mëritos',
                          category: 'daily',
                        },
                        {
                          id: 'weekly-1',
                          title: 'Maestro del Equilibrio',
                          description:
                            'Mantén balance Ayni > 80% toda la semana',
                          icon: <AutoAwesomeIcon />,
                          color: '#8BC34A',
                          progress: 5,
                          maxProgress: 7,
                          isCompleted: false,
                          reward: 'Badge Equilibrista',
                          category: 'weekly',
                        },
                      ]}
                      className=""
                    />
                  </Box>
                </Grid>
              </Grid>
            </Fade>
          </Grid>

          {/* 🏆 Active Challenges Widget */}
          <Grid item xs={12} lg={6}>
            <Fade in={animate} timeout={1300}>
              <Box className="harmony-widget-expanded">
                <ActiveChallengesWidget
                  challenges={[]}
                  onJoinChallenge={(challengeId) => {
                    console.log('🎯 Joining challenge:', challengeId);
                    setSuccessMessage('¡Te has unido al reto!');
                  }}
                  onStartChallenge={(challengeId) => {
                    console.log('▶️ Starting challenge:', challengeId);
                    navigate('/challenges');
                  }}
                  className=""
                />
              </Box>
            </Fade>
          </Grid>

          {/* 🎯 Módulos principales */}
          <Grid item xs={12} lg={6}>
            <Fade in={animate} timeout={1400}>
              <Box>
                <ModuleCards
                  onModuleClick={handleModuleClick}
                  onModuleHover={handleModuleHover}
                  hoveredModule={hoveredModule}
                  isLoading={dashboardData.isLoading}
                  performanceMode={performanceMode}
                />
              </Box>
            </Fade>
          </Grid>

          {/* 📊 Performance Monitor */}
          {backendAvailability.isAvailable && (
            <Grid item xs={12}>
              <Fade in={animate} timeout={1600}>
                <Box>
                  <PerformanceMonitor
                    metrics={{
                      renderTime: 150,
                      interactiveTime: 200,
                      lastOptimization: new Date(),
                    }}
                    isVisible={true}
                    performanceMode={performanceMode}
                    onToggleMode={handlePerformanceModeToggle}
                  />
                </Box>
              </Fade>
            </Grid>
          )}

          {/* 🔔 Centro de notificaciones inteligente */}
          {notificationsOpen && (
            <Grid item xs={12}>
              <Slide in={notificationsOpen} direction="up" timeout={500}>
                <Box>
                  <IntelligentNotificationCenter
                    notifications={filteredNotifications}
                    isOpen={notificationsOpen}
                    currentFilter={notificationFilter}
                    notificationStats={{
                      ...notificationStats,
                      avgEngagement: 82,
                      byType: {
                        ayni: 1,
                        meritos: 1,
                        social: 1,
                        marketplace: 0,
                        system: 0,
                        achievement: 2,
                        tip: 0,
                      },
                    }}
                    onFilterChange={handleNotificationFilterChange}
                    onNotificationClick={handleNotificationAction}
                    onMarkAsRead={(notificationId) => {
                      console.log('🔔 Mark as read:', notificationId);
                      setLastInteraction(new Date());
                    }}
                    onMarkAllAsRead={() => {
                      console.log('🔔 Mark all as read');
                      setLastInteraction(new Date());
                    }}
                    onClearAll={() => {
                      console.log('🧹 Clear all notifications');
                      setNotificationsOpen(false);
                      setLastInteraction(new Date());
                    }}
                    onClose={() => setNotificationsOpen(false)}
                  />
                </Box>
              </Slide>
            </Grid>
          )}
        </Grid>

        {/* 🌟 Floating Action Buttons mejorados */}
        <Box className="harmony-fab-container">
          <Zoom in={animate} timeout={2000}>
            <Tooltip title="Ver Insights Inteligentes" placement="left">
              <Fab
                color="secondary"
                size="medium"
                onClick={handleInsightsClick}
                sx={{
                  background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.primary.main} 100%)`,
                  '&:hover': {
                    background: `linear-gradient(135deg, ${theme.palette.secondary.dark} 0%, ${theme.palette.primary.dark} 100%)`,
                    transform: 'scale(1.1)',
                  },
                }}
              >
                <PsychologyIcon />
              </Fab>
            </Tooltip>
          </Zoom>

          <Zoom in={animate} timeout={2200}>
            <Tooltip
              title={`${notificationStats.unread} notificaciones sin leer`}
              placement="left"
            >
              <Fab
                size="small"
                onClick={handleNotificationClick}
                sx={{
                  bgcolor: alpha(theme.palette.warning.main, 0.9),
                  color: 'white',
                  '&:hover': {
                    transform: 'scale(1.1)',
                  },
                }}
              >
                <Badge
                  badgeContent={notificationStats.unread}
                  color="error"
                  max={9}
                >
                  <NotificationsIcon />
                </Badge>
              </Fab>
            </Tooltip>
          </Zoom>
        </Box>

        {/* 🔝 Botón scroll to top */}
        <Fade in={showScrollTop}>
          <Fab
            color="primary"
            size="medium"
            onClick={scrollToTop}
            sx={{
              position: 'fixed',
              bottom: isMobile ? 24 : 280,
              right: 24,
              zIndex: 999,
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
              '&:hover': {
                transform: 'scale(1.1)',
              },
            }}
          >
            <KeyboardArrowUpIcon />
          </Fab>
        </Fade>

        {/* 🎯 Snackbar para mensajes */}
        <Snackbar
          open={!!successMessage}
          autoHideDuration={3000}
          onClose={() => setSuccessMessage('')}
          message={successMessage}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        />

        {/* 🚀 Advanced Insights Panel */}
        <AdvancedInsightsPanel
          gameData={normalizedGameData}
          walletData={normalizedWalletData}
          isVisible={insightsPanelOpen}
          onClose={handleInsightsPanelClose}
        />
      </Container>
    </Box>
  );
};

export default HomeEnhanced;
