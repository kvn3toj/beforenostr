import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Box,
  Typography,
  Card,
  CardContent,
  Fade,
  Slide,
  Zoom,
  Paper,
  Avatar,
  Chip,
  IconButton,
  Button,
  LinearProgress,
  CircularProgress,
  Badge,
  Divider,
  useTheme,
  alpha,
  useMediaQuery,
} from '@mui/material';
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
import { useAuth } from '../contexts/AuthContext';
import {
  useDashboardData,
  useBackendAvailability,
  type BackendWalletData,
  type BackendGameData,
  type BackendUser,
} from '../hooks/useRealBackendData';
import { toSafeNumber } from '../utils/numberUtils';
import RevolutionaryWidget from '../design-system/templates/RevolutionaryWidget';
import { ReciprocidadMetricsCard } from '../components/home/ReciprocidadMetricsCard';
import { useReciprocidadMetrics, ReciprocidadMetricsUI } from '../hooks/home/useReciprocidadMetrics';
import { useMeritsQuery } from '../hooks/features/gamification/useMeritsQuery';

import '../styles/home-renovated.css';

interface HeroMetrics {
  greeting: string;
  streakDays: number;
  nextGoal: string;
  completionPercentage: number;
}

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

  const [loaded, setLoaded] = useState(false);
  const [heroMetrics, setHeroMetrics] = useState<HeroMetrics>({
    greeting: '¡Bienvenido de vuelta!',
    streakDays: 7,
    nextGoal: 'Guardián del Equilibrio',
    completionPercentage: 73,
  });

  const backendAvailability = useBackendAvailability();
  const dashboardData = useDashboardData(user?.id || 'mock-user-id');
  const { data: reciprocidadData, isLoading: isLoadingReciprocidad } = useReciprocidadMetrics();
  const { data: meritsData, isLoading: isLoadingMeritos } = useMeritsQuery();

  const gameData = dashboardData.gameData as BackendGameData | undefined;
  const walletData = dashboardData.walletData as BackendWalletData | undefined;
  const userData = dashboardData.userProfile as BackendUser | undefined;

  const totalMeritos = useMemo(() => meritsData?.length || 0, [meritsData]);

  const normalizedData = useMemo(
    () => ({
      ondas: reciprocidadData?.metricas.ondas ?? toSafeNumber(gameData?.experience, 1250),
      meritos: totalMeritos,
      nivelReciprocidad: reciprocidadData?.nivel.actual ?? 'Colaborador Equilibrado',
      units: toSafeNumber(walletData?.balance, 125075),
      creditosReciprocidad: reciprocidadData?.metricas.contribucionesBienComun ?? toSafeNumber(walletData?.ucoins, 480),
      userName: (userData?.full_name || user?.email || 'CoomÜnity').split(' ')[0],
      elementos: reciprocidadData?.elementos ?? {
        fuego: 85,
        agua: 92,
        tierra: 78,
        aire: 88,
      },
      balanceReciprocidad: reciprocidadData?.metricas.balance ?? 0.85,
    }),
    [reciprocidadData, totalMeritos, gameData, walletData, userData, user]
  );

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
        description: 'Gestión de Ünits y Créditos de Reciprocidad',
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

  const dynamicInsights: DynamicInsight[] = useMemo(() => {
    const insights: DynamicInsight[] = [];
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
    const elementAvg = (normalizedData.elementos.fuego + normalizedData.elementos.agua + normalizedData.elementos.tierra + normalizedData.elementos.aire) / 4;
    if (elementAvg < 85 && !isNaN(elementAvg)) {
        insights.push({
            id: 'balance',
            type: 'tip',
            title: 'Busca el Equilibrio',
            description: 'Tus elementos muestran potencial de crecimiento. ¡Explora diferentes tipos de contenido!',
            icon: <PsychologyIcon />,
            color: theme.palette.info.main,
        });
    }
    return insights;
  }, [heroMetrics.streakDays, normalizedData.elementos, theme]);

  useEffect(() => {
    setLoaded(true);
    setHeroMetrics(prev => ({ ...prev, greeting: `¡Hola, ${normalizedData.userName}!` }));
  }, [normalizedData.userName]);

  const renderHeroSection = () => (
    <Card sx={{ mb: 3, p: 3, background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)' }}>
      <Grid container alignItems="center" spacing={2}>
        <Grid item>
          <Avatar sx={{ width: 64, height: 64, bgcolor: alpha(theme.palette.primary.main, 0.2) }}>
            <WavingHandIcon sx={{ fontSize: 40, color: theme.palette.primary.main }} />
          </Avatar>
        </Grid>
        <Grid item xs>
          <Typography variant="h4" component="h1" fontWeight="bold">{heroMetrics.greeting}</Typography>
          <Typography variant="body1" color="text.secondary">Estás en una racha de {heroMetrics.streakDays} días. ¡Sigue así!</Typography>
        </Grid>
        <Grid item>
            { reciprocidadData &&
                <ReciprocidadMetricsCard
                    metrics={reciprocidadData}
                    isLoading={isLoadingReciprocidad}
                />
            }
        </Grid>
      </Grid>
      <Box mt={3}>
        <Box display="flex" justifyContent="space-between" mb={1}>
          <Typography variant="body2" color="text.secondary">Próxima Meta: {heroMetrics.nextGoal}</Typography>
          <Typography variant="body2" fontWeight="bold">{heroMetrics.completionPercentage}%</Typography>
        </Box>
        <LinearProgress variant="determinate" value={heroMetrics.completionPercentage} />
      </Box>
    </Card>
  );

  const renderQuickStats = () => (
     <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} md={3}>
            <RevolutionaryWidget title="Öndas" isLoading={isLoadingReciprocidad}>
                <Typography variant="h4">{normalizedData.ondas}</Typography>
            </RevolutionaryWidget>
        </Grid>
        <Grid item xs={6} md={3}>
            <RevolutionaryWidget title="Méritos" isLoading={isLoadingMeritos}>
                <Typography variant="h4">{normalizedData.meritos}</Typography>
            </RevolutionaryWidget>
        </Grid>
        <Grid item xs={6} md={3}>
            <RevolutionaryWidget title="Ünits" isLoading={dashboardData.isLoading}>
                <Typography variant="h4">{normalizedData.units}</Typography>
            </RevolutionaryWidget>
        </Grid>
        <Grid item xs={6} md={3}>
            <RevolutionaryWidget title="Créditos de Reciprocidad" isLoading={isLoadingReciprocidad}>
                <Typography variant="h4">{normalizedData.creditosReciprocidad}</Typography>
            </RevolutionaryWidget>
        </Grid>
     </Grid>
  );

  const renderEnhancedModules = () => (
    <Box>
      <Typography variant="h5" component="h2" gutterBottom fontWeight="bold">Explora tu Universo</Typography>
      <Grid container spacing={isMobile ? 2 : 3}>
        {enhancedModules.map((module, index) => (
          <Grid item xs={12} sm={6} md={4} key={module.id}>
            <Fade in={loaded} timeout={500 + index * 100}>
              <Card
                onClick={() => module.unlocked && navigate(module.path)}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  borderRadius: 3,
                  boxShadow: `0 8px 32px 0 ${alpha(module.color, 0.3)}`,
                  background: module.gradient,
                  color: 'white',
                  cursor: module.unlocked ? 'pointer' : 'not-allowed',
                  opacity: module.unlocked ? 1 : 0.6,
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: module.unlocked ? 'translateY(-5px)' : 'none',
                    boxShadow: module.unlocked ? `0 12px 40px 0 ${alpha(module.color, 0.5)}` : 'none',
                  }
                }}
              >
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Avatar sx={{ bgcolor: alpha('#ffffff', 0.2), mr: 2 }}>{module.icon}</Avatar>
                    <Typography variant="h6" component="h3" fontWeight="bold">{module.title}</Typography>
                    {module.isPopular && <Chip label="Popular" size="small" sx={{ ml: 'auto', bgcolor: alpha('#ffffff', 0.3), color: 'white' }} />}
                    {module.isNew && <Chip label="Nuevo" size="small" sx={{ ml: 'auto', bgcolor: alpha('#ffffff', 0.3), color: 'white' }} />}
                  </Box>
                  <Typography variant="body2" sx={{ mb: 2 }}>{module.description}</Typography>
                </CardContent>
                <Box sx={{ p: 2, pt: 0 }}>
                  <Divider sx={{ mb: 1, bgcolor: alpha('#ffffff', 0.2) }} />
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="caption">{module.metrics.label}</Typography>
                    <Typography variant="subtitle2" fontWeight="bold">{module.metrics.value}</Typography>
                  </Box>
                </Box>
              </Card>
            </Fade>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  const renderDynamicInsights = () => (
    <Box sx={{ mt: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom fontWeight="bold">Para Ti</Typography>
        <Grid container spacing={2}>
            {dynamicInsights.map((insight, index) => (
                <Grid item xs={12} md={6} key={insight.id}>
                    <Slide direction="up" in={loaded} timeout={700 + index * 150}>
                        <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', background: alpha(insight.color, 0.1) }}>
                            <Avatar sx={{ bgcolor: insight.color, mr: 2 }}>{insight.icon}</Avatar>
                            <Box>
                                <Typography variant="subtitle1" fontWeight="bold">{insight.title}</Typography>
                                <Typography variant="body2" color="text.secondary">{insight.description}</Typography>
                            </Box>
                        </Paper>
                    </Slide>
                </Grid>
            ))}
        </Grid>
    </Box>
  );

  return (
    <Fade in={loaded} timeout={500}>
      <Container maxWidth="xl" sx={{ py: 3 }}>
        {renderHeroSection()}
        {renderQuickStats()}
        {renderEnhancedModules()}
        {renderDynamicInsights()}
      </Container>
    </Fade>
  );
};

export default HomeRenovated;
