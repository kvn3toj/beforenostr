import React, { useState, useEffect, useCallback, useMemo } from 'react';

// 🎯 REGLA #1: IMPORTS ESPECÍFICOS DE MATERIAL UI
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Fade from '@mui/material/Fade';
import Slide from '@mui/material/Slide';
import Zoom from '@mui/material/Zoom';
import Paper from '@mui/material/Paper';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import LinearProgress from '@mui/material/LinearProgress';
import CircularProgress from '@mui/material/CircularProgress';
import Badge from '@mui/material/Badge';
import Divider from '@mui/material/Divider';
import { useTheme, alpha, useMediaQuery } from '@mui/material';

// 🎯 REGLA #1: IMPORTS ESPECÍFICOS DE ICONOS
import WavingHandIcon from '@mui/icons-material/WavingHand';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import BoltIcon from '@mui/icons-material/Bolt';
import DiamondIcon from '@mui/icons-material/Diamond';
import GroupsIcon from '@mui/icons-material/Groups';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import FavoriteIcon from '@mui/icons-material/Favorite';
import StarIcon from '@mui/icons-material/Star';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import PsychologyIcon from '@mui/icons-material/Psychology';
import HandshakeIcon from '@mui/icons-material/Handshake';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import BarChartIcon from '@mui/icons-material/BarChart';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import WaterIcon from '@mui/icons-material/Water';
import TerrainIcon from '@mui/icons-material/Terrain';
import AirIcon from '@mui/icons-material/Air';

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

// 🎨 Importar estilos renovados
import '../styles/home-renovated.css';

// 🏠 Interfaz para el Hero personalizado
interface HeroMetrics {
  greeting: string;
  streakDays: number;
  nextGoal: string;
  completionPercentage: number;
}

// 🎯 Interfaz para módulos mejorados
interface EnhancedModule {
  id: string;
  title: string;
  description: string;
  icon: React.ReactElement;
  color: string;
  gradient: string;
  path: string;
  metrics: {
    label: string;
    value: string | number;
    trend?: 'up' | 'down' | 'stable';
  };
  isPopular?: boolean;
  isNew?: boolean;
  unlocked: boolean;
}

// 🎭 Interfaz para insights dinámicos
interface DynamicInsight {
  id: string;
  type: 'tip' | 'achievement' | 'opportunity' | 'celebration';
  title: string;
  description: string;
  icon: React.ReactElement;
  color: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const HomeRenovated: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.between('md', 'lg'));

  // 🎯 Estados del componente
  const [loaded, setLoaded] = useState(false);
  const [heroMetrics, setHeroMetrics] = useState<HeroMetrics>({
    greeting: '¡Bienvenido de vuelta!',
    streakDays: 7,
    nextGoal: 'Guardián del Equilibrio',
    completionPercentage: 73,
  });

  // 🔗 Datos del backend
  const backendAvailability = useBackendAvailability();
  const dashboardData = useDashboardData(user?.id || 'mock-user-id');

  // 🎯 Datos normalizados
  const gameData = dashboardData.gameData as BackendGameData | undefined;
  const walletData = dashboardData.walletData as BackendWalletData | undefined;
  const userData = dashboardData.userProfile as BackendUser | undefined;

  const normalizedData = useMemo(
    () => ({
      ondas: toSafeNumber(gameData?.experience, 1250),
      meritos: toSafeNumber(
        gameData?.stats?.wisdom ? gameData.stats.wisdom * 10 : 485,
        485
      ),
      ayniLevel: gameData?.title || 'Colaborador Equilibrado',
      lukas: toSafeNumber(walletData?.balance, 125075),
      ayniCredits: toSafeNumber(walletData?.ucoins, 480),
      userName: (userData?.full_name || user?.full_name || 'CoomÜnity').split(
        ' '
      )[0],
      elementos: {
        fuego: 85,
        agua: 92,
        tierra: 78,
        aire: 88,
      },
      balanceAyni: 0.85,
    }),
    [gameData, walletData, userData, user]
  );

  // 🌟 Módulos rediseñados con mejor visual
  const enhancedModules: EnhancedModule[] = useMemo(
    () => [
      {
        id: 'uplay',
        title: 'ÜPlay',
        description: 'Videos interactivos con gamificación avanzada',
        icon: <PlayArrowIcon />,
        color: '#FF6B35',
        gradient: 'linear-gradient(135deg, #FF6B35 0%, #FF8A65 100%)',
        path: '/uplay',
        metrics: { label: 'Videos vistos', value: 23, trend: 'up' },
        isPopular: true,
        unlocked: true,
      },
      {
        id: 'marketplace',
        title: 'Marketplace',
        description: 'Intercambios y colaboraciones comunitarias',
        icon: <ShoppingCartIcon />,
        color: '#4FC3F7',
        gradient: 'linear-gradient(135deg, #4FC3F7 0%, #29B6F6 100%)',
        path: '/marketplace',
        metrics: { label: 'Intercambios', value: 12, trend: 'up' },
        unlocked: true,
      },
      {
        id: 'social',
        title: 'Social',
        description: 'Conecta con la comunidad CoomÜnity',
        icon: <GroupsIcon />,
        color: '#8BC34A',
        gradient: 'linear-gradient(135deg, #8BC34A 0%, #9CCC65 100%)',
        path: '/social',
        metrics: { label: 'Conexiones', value: 47, trend: 'up' },
        unlocked: true,
      },
      {
        id: 'ustats',
        title: 'ÜStats',
        description: 'Analíticas y métricas personalizadas',
        icon: <BarChartIcon />,
        color: '#BA68C8',
        gradient: 'linear-gradient(135deg, #BA68C8 0%, #AB47BC 100%)',
        path: '/ustats',
        metrics: { label: 'Insights', value: 8, trend: 'stable' },
        unlocked: true,
      },
      {
        id: 'challenges',
        title: 'Desafíos',
        description: 'Retos comunitarios y competencias',
        icon: <EmojiEventsIcon />,
        color: '#FFD54F',
        gradient: 'linear-gradient(135deg, #FFD54F 0%, #FFCA28 100%)',
        path: '/challenges',
        metrics: { label: 'Activos', value: 3, trend: 'up' },
        isNew: true,
        unlocked: normalizedData.ondas > 500,
      },
      {
        id: 'wallet',
        title: 'Wallet',
        description: 'Gestión de Lükas y Ayni Créditos',
        icon: <AccountBalanceWalletIcon />,
        color: '#FF8A65',
        gradient: 'linear-gradient(135deg, #FF8A65 0%, #FF7043 100%)',
        path: '/wallet',
        metrics: { label: 'Balance', value: '125K', trend: 'up' },
        unlocked: true,
      },
    ],
    [normalizedData.ondas]
  );

  // 💡 Insights dinámicos inteligentes
  const dynamicInsights: DynamicInsight[] = useMemo(() => {
    const insights: DynamicInsight[] = [];

    // Insight basado en racha
    if (heroMetrics.streakDays >= 7) {
      insights.push({
        id: 'streak',
        type: 'celebration',
        title: '¡Racha Increíble!',
        description: `${heroMetrics.streakDays} días consecutivos de actividad. ¡Eres imparable!`,
        icon: <RocketLaunchIcon />,
        color: theme.palette.success.main,
      });
    }

    // Insight de balance elemental
    const elementAvg =
      (normalizedData.elementos.fuego +
        normalizedData.elementos.agua +
        normalizedData.elementos.tierra +
        normalizedData.elementos.aire) /
      4;
    if (elementAvg > 85) {
      insights.push({
        id: 'balance',
        type: 'achievement',
        title: 'Maestro del Equilibrio',
        description: 'Tu armonía elemental está en niveles excepcionales',
        icon: <AutoAwesomeIcon />,
        color: theme.palette.primary.main,
      });
    }

    // Insight de oportunidad
    if (normalizedData.ondas > 1000) {
      insights.push({
        id: 'opportunity',
        type: 'opportunity',
        title: 'Momento de Liderazgo',
        description:
          'Tu energía permite liderar proyectos comunitarios importantes',
        icon: <HandshakeIcon />,
        color: theme.palette.warning.main,
        action: {
          label: 'Explorar Desafíos',
          onClick: () => navigate('/challenges'),
        },
      });
    }

    // Tip personalizado
    insights.push({
      id: 'tip',
      type: 'tip',
      title: 'Tip del Día',
      description:
        'Participa en intercambios Ayni para potenciar tu crecimiento personal',
      icon: <PsychologyIcon />,
      color: theme.palette.info.main,
    });

    return insights;
  }, [heroMetrics, normalizedData, theme, navigate]);

  // 🎯 Efectos de inicialización
  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 300);
    return () => clearTimeout(timer);
  }, []);

  // 🎯 Actualizar métricas del hero
  useEffect(() => {
    const hour = new Date().getHours();
    let greeting = '¡Buen día!';
    if (hour < 12) greeting = '¡Buenos días!';
    else if (hour < 18) greeting = '¡Buenas tardes!';
    else greeting = '¡Buenas noches!';

    setHeroMetrics((prev) => ({
      ...prev,
      greeting,
      completionPercentage: Math.min(95, (normalizedData.ondas / 2000) * 100),
    }));
  }, [normalizedData.ondas]);

  // 🧹 CLEANUP OBLIGATORIO según Builder.io
  useEffect(() => {
    return () => {
      // Cleanup resources
    };
  }, []);

  // 🎯 Handlers de navegación
  const handleModuleClick = useCallback(
    (module: EnhancedModule) => {
      if (!module.unlocked) {
        console.log('🔒 Módulo bloqueado:', module.id);
        return;
      }
      console.log('🎯 Navegando a:', module.path);
      navigate(module.path);
    },
    [navigate]
  );

  const handleQuickAction = useCallback(
    (action: string) => {
      console.log('⚡ Acción rápida:', action);
      switch (action) {
        case 'profile':
          navigate('/profile');
          break;
        case 'notifications':
          // Abrir panel de notificaciones
          break;
        case 'settings':
          navigate('/profile');
          break;
        default:
          break;
      }
    },
    [navigate]
  );

  // 🎨 Hero Section Renovado
  const renderHeroSection = () => (
    <Box
      className="hero-section-renovated"
      sx={{
        position: 'relative',
        background: `linear-gradient(135deg, 
          ${alpha(theme.palette.primary.main, 0.9)} 0%, 
          ${alpha(theme.palette.secondary.main, 0.8)} 50%,
          ${alpha(theme.palette.primary.dark, 0.9)} 100%)`,
        borderRadius: 4,
        overflow: 'hidden',
        mb: 4,
        minHeight: 280,
        display: 'flex',
        alignItems: 'center',
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
      <Container maxWidth="xl">
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={8}>
            <Fade in={loaded} timeout={800}>
              <Box>
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
                    {heroMetrics.greeting}
                  </Typography>
                </Box>

                <Typography
                  variant="h4"
                  sx={{
                    color: alpha('#fff', 0.9),
                    mb: 1,
                    fontSize: { xs: '1.5rem', md: '2rem' },
                  }}
                >
                  {normalizedData.userName}
                </Typography>

                <Typography
                  variant="h6"
                  sx={{
                    color: alpha('#fff', 0.8),
                    mb: 3,
                    fontSize: { xs: '1rem', md: '1.25rem' },
                  }}
                >
                  {normalizedData.ayniLevel}
                </Typography>

                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3 }}>
                  <Chip
                    icon={<BoltIcon />}
                    label={`${normalizedData.ondas} Öndas`}
                    sx={{
                      bgcolor: alpha('#FFD54F', 0.2),
                      color: '#FFD54F',
                      fontWeight: 'bold',
                      fontSize: '1rem',
                      height: 36,
                    }}
                  />
                  <Chip
                    icon={<DiamondIcon />}
                    label={`${normalizedData.meritos} Mëritos`}
                    sx={{
                      bgcolor: alpha('#4FC3F7', 0.2),
                      color: '#4FC3F7',
                      fontWeight: 'bold',
                      fontSize: '1rem',
                      height: 36,
                    }}
                  />
                  <Chip
                    icon={<StarIcon />}
                    label={`${heroMetrics.streakDays} días seguidos`}
                    sx={{
                      bgcolor: alpha('#8BC34A', 0.2),
                      color: '#8BC34A',
                      fontWeight: 'bold',
                      fontSize: '1rem',
                      height: 36,
                    }}
                  />
                </Box>

                <Box>
                  <Typography
                    variant="body1"
                    sx={{ color: alpha('#fff', 0.8), mb: 1 }}
                  >
                    Progreso hacia <strong>{heroMetrics.nextGoal}</strong>
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={heroMetrics.completionPercentage}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      bgcolor: alpha('#fff', 0.2),
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 4,
                        bgcolor: '#8BC34A',
                      },
                    }}
                  />
                  <Typography
                    variant="caption"
                    sx={{
                      color: alpha('#fff', 0.7),
                      mt: 0.5,
                      display: 'block',
                    }}
                  >
                    {heroMetrics.completionPercentage}% completado
                  </Typography>
                </Box>
              </Box>
            </Fade>
          </Grid>

          <Grid item xs={12} md={4}>
            <Zoom in={loaded} timeout={1000}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  position: 'relative',
                }}
              >
                <Box
                  sx={{
                    width: 200,
                    height: 200,
                    borderRadius: '50%',
                    background: `conic-gradient(from 0deg, #8BC34A 0deg ${heroMetrics.completionPercentage * 3.6}deg, rgba(255,255,255,0.2) ${heroMetrics.completionPercentage * 3.6}deg 360deg)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    animation: 'rotate-slow 20s linear infinite',
                  }}
                >
                  <Box
                    sx={{
                      width: 160,
                      height: 160,
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
                      {Math.round(normalizedData.balanceAyni * 100)}%
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: alpha('#fff', 0.8) }}
                    >
                      Balance Ayni
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Zoom>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );

  // 📊 Sección de Estadísticas Rápidas
  const renderQuickStats = () => (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      {[
        {
          label: 'Lükas',
          value: `${Math.floor(normalizedData.lukas / 1000)}K`,
          icon: <AccountBalanceWalletIcon />,
          color: '#FFD54F',
        },
        {
          label: 'Ayni Créditos',
          value: normalizedData.ayniCredits,
          icon: <HandshakeIcon />,
          color: '#4FC3F7',
        },
        {
          label: 'Elementos',
          value: `${Math.round((normalizedData.elementos.fuego + normalizedData.elementos.agua + normalizedData.elementos.tierra + normalizedData.elementos.aire) / 4)}%`,
          icon: <AutoAwesomeIcon />,
          color: '#8BC34A',
        },
        {
          label: 'Nivel Social',
          value: 'Alto',
          icon: <GroupsIcon />,
          color: '#BA68C8',
        },
      ].map((stat, index) => (
        <Grid item xs={6} md={3} key={stat.label}>
          <Slide in={loaded} direction="up" timeout={600 + index * 100}>
            <Card
              className="stat-card-hover"
              sx={{
                background: `linear-gradient(135deg, ${alpha(stat.color, 0.1)} 0%, ${alpha(stat.color, 0.05)} 100%)`,
                border: `1px solid ${alpha(stat.color, 0.2)}`,
                borderRadius: 3,
                textAlign: 'center',
                p: 2,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: `0 8px 25px ${alpha(stat.color, 0.3)}`,
                },
              }}
            >
              <Box sx={{ color: stat.color, mb: 1 }}>{stat.icon}</Box>
              <Typography
                variant="h5"
                sx={{ fontWeight: 'bold', color: 'white', mb: 0.5 }}
              >
                {stat.value}
              </Typography>
              <Typography variant="caption" sx={{ color: alpha('#fff', 0.7) }}>
                {stat.label}
              </Typography>
            </Card>
          </Slide>
        </Grid>
      ))}
    </Grid>
  );

  // 🎯 Módulos Rediseñados
  const renderEnhancedModules = () => (
    <Box sx={{ mb: 4 }}>
      <Typography
        variant="h4"
        sx={{
          fontWeight: 'bold',
          color: 'white',
          mb: 3,
          textAlign: 'center',
          background: 'linear-gradient(45deg, #4FC3F7 30%, #8BC34A 90%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        Explora CoomÜnity
      </Typography>

      <Grid container spacing={3}>
        {enhancedModules.map((module, index) => (
          <Grid item xs={12} sm={6} md={4} key={module.id}>
            <Zoom in={loaded} timeout={800 + index * 100}>
              <Card
                className="module-card-enhanced"
                onClick={() => handleModuleClick(module)}
                sx={{
                  background: module.unlocked
                    ? `linear-gradient(135deg, ${alpha(module.color, 0.15)} 0%, ${alpha(module.color, 0.05)} 100%)`
                    : alpha('#666', 0.1),
                  border: `2px solid ${module.unlocked ? alpha(module.color, 0.3) : alpha('#666', 0.2)}`,
                  borderRadius: 4,
                  cursor: module.unlocked ? 'pointer' : 'not-allowed',
                  position: 'relative',
                  overflow: 'hidden',
                  transition:
                    'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                  '&:hover': module.unlocked
                    ? {
                        transform: 'translateY(-8px) scale(1.02)',
                        boxShadow: `0 12px 35px ${alpha(module.color, 0.4)}`,
                        border: `2px solid ${module.color}`,
                      }
                    : {},
                  opacity: module.unlocked ? 1 : 0.6,
                }}
              >
                {(module.isNew || module.isPopular) && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 12,
                      right: 12,
                      zIndex: 2,
                    }}
                  >
                    <Chip
                      label={module.isNew ? 'NUEVO' : 'POPULAR'}
                      size="small"
                      sx={{
                        bgcolor: module.isNew ? '#FF6B35' : '#8BC34A',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '0.7rem',
                        animation: 'pulse 2s ease-in-out infinite',
                      }}
                    />
                  </Box>
                )}

                {!module.unlocked && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      zIndex: 2,
                      textAlign: 'center',
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{ color: alpha('#fff', 0.7) }}
                    >
                      🔒 Requiere {500} Öndas
                    </Typography>
                  </Box>
                )}

                <CardContent sx={{ p: 3 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 64,
                      height: 64,
                      borderRadius: 3,
                      background: module.unlocked
                        ? module.gradient
                        : alpha('#666', 0.3),
                      color: 'white',
                      mb: 2,
                      mx: 'auto',
                      fontSize: '2rem',
                    }}
                  >
                    {module.icon}
                  </Box>

                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 'bold',
                      color: 'white',
                      textAlign: 'center',
                      mb: 1,
                    }}
                  >
                    {module.title}
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      color: alpha('#fff', 0.8),
                      textAlign: 'center',
                      mb: 2,
                      minHeight: 40,
                    }}
                  >
                    {module.description}
                  </Typography>

                  {module.unlocked && (
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        pt: 2,
                        borderTop: `1px solid ${alpha('#fff', 0.1)}`,
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{ color: alpha('#fff', 0.7) }}
                      >
                        {module.metrics.label}
                      </Typography>
                      <Box
                        sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                      >
                        <Typography
                          variant="subtitle2"
                          sx={{ color: 'white', fontWeight: 'bold' }}
                        >
                          {module.metrics.value}
                        </Typography>
                        {module.metrics.trend === 'up' && (
                          <TrendingUpIcon
                            sx={{ fontSize: '1rem', color: '#8BC34A' }}
                          />
                        )}
                      </Box>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Zoom>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  // 💡 Insights Dinámicos
  const renderDynamicInsights = () => (
    <Box sx={{ mb: 4 }}>
      <Typography
        variant="h5"
        sx={{
          fontWeight: 'bold',
          color: 'white',
          mb: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <PsychologyIcon sx={{ color: '#4FC3F7' }} />
        Insights Personalizados
      </Typography>

      <Grid container spacing={2}>
        {dynamicInsights.map((insight, index) => (
          <Grid item xs={12} md={6} key={insight.id}>
            <Slide in={loaded} direction="left" timeout={1000 + index * 200}>
              <Card
                sx={{
                  background: `linear-gradient(135deg, ${alpha(insight.color, 0.15)} 0%, ${alpha(insight.color, 0.05)} 100%)`,
                  border: `1px solid ${alpha(insight.color, 0.3)}`,
                  borderRadius: 3,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: `0 6px 20px ${alpha(insight.color, 0.3)}`,
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box
                    sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}
                  >
                    <Box
                      sx={{
                        color: insight.color,
                        p: 1,
                        borderRadius: 2,
                        bgcolor: alpha(insight.color, 0.1),
                      }}
                    >
                      {insight.icon}
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: 'bold', color: 'white', mb: 1 }}
                      >
                        {insight.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: alpha('#fff', 0.8), mb: 2 }}
                      >
                        {insight.description}
                      </Typography>
                      {insight.action && (
                        <Button
                          size="small"
                          onClick={insight.action.onClick}
                          sx={{
                            color: insight.color,
                            borderColor: insight.color,
                            '&:hover': {
                              bgcolor: alpha(insight.color, 0.1),
                            },
                          }}
                          variant="outlined"
                        >
                          {insight.action.label}
                        </Button>
                      )}
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Slide>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  // 🚀 Acciones Rápidas Flotantes
  const renderFloatingActions = () => (
    <Box
      sx={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        zIndex: 1000,
      }}
    >
      {[
        {
          icon: <NotificationsIcon />,
          action: 'notifications',
          color: '#FF6B35',
          label: 'Notificaciones',
        },
        {
          icon: <SettingsIcon />,
          action: 'settings',
          color: '#BA68C8',
          label: 'Configuración',
        },
      ].map((item, index) => (
        <Zoom in={loaded} timeout={1200 + index * 200} key={item.action}>
          <IconButton
            onClick={() => handleQuickAction(item.action)}
            sx={{
              width: 56,
              height: 56,
              bgcolor: item.color,
              color: 'white',
              '&:hover': {
                bgcolor: item.color,
                transform: 'scale(1.1)',
              },
              transition: 'all 0.3s ease',
              boxShadow: `0 4px 20px ${alpha(item.color, 0.4)}`,
            }}
          >
            {item.icon}
          </IconButton>
        </Zoom>
      ))}
    </Box>
  );

  return (
    <Box
      className="home-renovated-container"
      sx={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, 
          ${alpha('#0D47A1', 0.9)} 0%, 
          ${alpha('#1565C0', 0.8)} 25%,
          ${alpha('#1976D2', 0.7)} 50%,
          ${alpha('#1E88E5', 0.8)} 75%,
          ${alpha('#2196F3', 0.9)} 100%)`,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cg fill-opacity='0.03'%3E%3Cpolygon fill='%23ffffff' points='50 0 60 40 100 50 60 60 50 100 40 60 0 50 40 40'/%3E%3C/g%3E%3C/svg%3E")`,
          animation: 'bg-move 30s ease-in-out infinite',
        },
      }}
    >
      <Container maxWidth="xl" sx={{ py: 4, position: 'relative', zIndex: 1 }}>
        {/* Hero Section */}
        {renderHeroSection()}

        {/* Quick Stats */}
        {renderQuickStats()}

        {/* Enhanced Modules */}
        {renderEnhancedModules()}

        {/* Dynamic Insights */}
        {renderDynamicInsights()}

        {/* Floating Actions */}
        {renderFloatingActions()}
      </Container>
    </Box>
  );
};

export default HomeRenovated;
