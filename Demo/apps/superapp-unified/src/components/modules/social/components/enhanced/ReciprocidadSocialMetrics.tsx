import React, { useState, useMemo } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  LinearProgress,
  Chip,
  Stack,
  Avatar,
  alpha,
  useTheme,
  Divider,
  CircularProgress,
  Badge,
  Paper,
  IconButton,
  Tooltip,
  Collapse,
  Skeleton,
} from '@mui/material';
import {
  People,
  Favorite,
  EmojiEvents,
  TrendingUp,
  Psychology,
  Handshake,
  Group,
  Star,
  Air,
  Waves,
  LocalFireDepartment,
  Park,
  Notifications,
  AccessTime,
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
  AccountBalance as BalanceIcon,
  Groups as GroupIcon,
  EmojiEvents as EmojiEventsIcon,
  Verified as VerifiedIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import { useMediaQuery } from '@mui/material';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { ReciprocidadSocialMetricsProps } from '@/types/reciprocidad.types';

// 🎨 Componente para elementos sociales
const SocialElementIcon: React.FC<{
  element: string;
  value: number;
  color: string;
}> = ({ element, value, color }) => {
  const theme = useTheme();

  const getElementData = (element: string) => {
    switch (element) {
      case 'comunicacion':
        return {
          icon: <Air />,
          name: 'Comunicación',
          description: 'Claridad en expresión',
        };
      case 'empatia':
        return {
          icon: <Waves />,
          name: 'Empatía',
          description: 'Conexión emocional',
        };
      case 'confianza':
        return {
          icon: <Park />,
          name: 'Confianza',
          description: 'Estabilidad relacional',
        };
      case 'inspiracion':
        return {
          icon: <LocalFireDepartment />,
          name: 'Inspiración',
          description: 'Motivación compartida',
        };
      default:
        return {
          icon: <Star />,
          name: 'Elemento',
          description: 'Equilibrio social',
        };
    }
  };

  const elementData = getElementData(element);

  return (
    <Box sx={{ textAlign: 'center', position: 'relative' }}>
      <Box
        sx={{
          width: 72,
          height: 72,
          borderRadius: '50%',
          background: `conic-gradient(${color} ${
            value * 3.6
          }deg, ${alpha(color, 0.1)} 0deg)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          mb: 1,
          cursor: 'pointer',
          transition: 'transform 0.2s ease-in-out',
          '&:hover': {
            transform: 'scale(1.05)',
          },
        }}
      >
        <Box
          sx={{
            width: 60,
            height: 60,
            borderRadius: '50%',
            bgcolor: 'background.paper',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color,
            fontSize: 28,
          }}
        >
          {elementData.icon}
        </Box>
      </Box>
      <Typography
        variant="caption"
        sx={{
          fontWeight: 'bold',
          display: 'block',
          mb: 0.5,
        }}
      >
        {elementData.name}
      </Typography>
      <Typography variant="caption" display="block" color="text.secondary">
        {value}%
      </Typography>
      <Typography
        variant="caption"
        display="block"
        color="text.secondary"
        sx={{ fontSize: '0.65rem', fontStyle: 'italic' }}
      >
        {elementData.description}
      </Typography>
    </Box>
  );
};

// Componente individual para cada métrica de la comunidad
const MetricCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string | number;
  isLoading?: boolean;
}> = ({ icon, label, value, isLoading = false }) => {
  const theme = useTheme();

  return (
    <Paper
      elevation={2}
      sx={{
        p: 2,
        bgcolor: alpha(theme.palette.background.default, 0.5),
        height: '100%',
        border: `1px solid ${theme.palette.divider}`
      }}
    >
      <Stack direction="row" spacing={2} alignItems="center">
        <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main' }}>
          {icon}
        </Avatar>
        <Box flexGrow={1}>
          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'medium' }}>
            {label}
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            {isLoading ? <Skeleton width={50} /> : value}
          </Typography>
        </Box>
      </Stack>
    </Paper>
  );
};

const ReciprocidadSocialMetrics: React.FC<ReciprocidadSocialMetricsProps> = ({
  userStats,
  communityMetrics,
  notifications,
  isLoading = false,
  isConnected = true,
  showDetailedView = true
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // 🛡️ VALORES POR DEFECTO SEGUROS PARA EVITAR UNDEFINED
  const safeUserStats = useMemo(() => ({
    reciprocidadBalance: userStats?.reciprocidadBalance ?? 0.5,
    socialLevel: userStats?.socialLevel ?? 'Nuevo Miembro',
    nextLevel: userStats?.nextLevel ?? 'Colaborador Equilibrado',
    socialProgress: userStats?.socialProgress ?? 0,
    connectionsCount: userStats?.connectionsCount ?? 0,
    collaborationsCount: userStats?.collaborationsCount ?? 0,
    bienComunContributions: userStats?.bienComunContributions ?? 0,
    socialMeritos: userStats?.socialMeritos ?? 0,
    trustScore: userStats?.trustScore ?? 4.0,
    elementos: {
      comunicacion: userStats?.elementos?.comunicacion ?? 70,
      empatia: userStats?.elementos?.empatia ?? 75,
      confianza: userStats?.elementos?.confianza ?? 65,
      inspiracion: userStats?.elementos?.inspiracion ?? 80,
    }
  }), [userStats]);

  const safeCommunityMetrics = useMemo(() => ({
    activeConnections: communityMetrics?.activeConnections ?? 0,
    onlineMembers: communityMetrics?.onlineMembers ?? 12,
    dailyInteractions: communityMetrics?.dailyInteractions ?? 8,
    reciprocidadExchanges: communityMetrics?.reciprocidadExchanges ?? 3,
    activeCircles: communityMetrics?.activeCircles ?? 2,
    weeklyGrowth: communityMetrics?.weeklyGrowth ?? 5
  }), [communityMetrics]);

  const safeNotifications = useMemo(() =>
    Array.isArray(notifications) ? notifications : [],
    [notifications]
  );

  // 🎨 ESTADOS VISUALES MEJORADOS
  const [showAnimations, setShowAnimations] = useState(true);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const handleToggleSection = (section: string) => {
    setExpandedSection(prev => (prev === section ? null : section));
  };

  // 🎨 COLORES DINÁMICOS BASADOS EN EL ESTADO
  const getReciprocidadColor = (value: number) => {
    if (value > 0.75) return theme.palette.success.main;
    if (value > 0.4) return theme.palette.warning.main;
    return theme.palette.error.main;
  };

  const getElementoColor = (value: number) => {
    if (value > 75) return theme.palette.info.main;
    if (value > 50) return theme.palette.secondary.main;
    return theme.palette.warning.main;
  };

  const UserAvatar = () => (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <CircularProgress
        variant="determinate"
        value={safeUserStats.socialProgress}
        size={80}
        thickness={2}
        sx={{
          position: 'absolute',
          top: -8,
          left: -8,
          color: theme.palette.primary.main,
          zIndex: 1,
        }}
      />
      <Badge
        overlap="circular"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        badgeContent={
          <Tooltip title="Confianza de la comunidad">
            <Chip
              icon={<Star sx={{ color: '#fff !important', fontSize: 14 }} />}
              label={safeUserStats.trustScore.toFixed(1)}
              size="small"
              sx={{
                bgcolor: 'secondary.main',
                color: '#fff',
                height: 20,
                fontSize: '0.7rem',
              }}
            />
          </Tooltip>
        }
      >
        <Avatar
          sx={{
            width: 64,
            height: 64,
            bgcolor: getReciprocidadColor(safeUserStats.reciprocidadBalance),
          }}
        >
          <Psychology />
        </Avatar>
      </Badge>
    </Box>
  );

  if (isLoading) {
    return (
      <Card>
        <CardContent>
          <Skeleton variant="rectangular" width="100%" height={400} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{
      p: 2,
      background: `linear-gradient(to top, ${theme.palette.background.paper}, ${alpha(theme.palette.background.default, 0.5)})`
    }}>
      <CardContent>
        {/* CABECERA */}
        <Box display="flex" alignItems="center" mb={3} flexDirection={isMobile ? 'column' : 'row'}>
          <Box flexGrow={1} textAlign={isMobile ? 'center' : 'left'} mb={isMobile ? 2 : 0}>
            <Typography variant={isMobile ? "h5" : "h4"} fontWeight="bold" gutterBottom>
              Pulso Social de la Comunidad
            </Typography>
            <Chip
              icon={<TrendingUp />}
              label={`Crecimiento semanal: ${safeCommunityMetrics.weeklyGrowth}%`}
              color="primary"
              variant="outlined"
              size="small"
            />
          </Box>
          <Box textAlign="right">
            <Chip
              icon={isConnected ? <Group /> : <Notifications />}
              label={isConnected ? `${safeCommunityMetrics.onlineMembers} en línea` : 'Desconectado'}
              color={isConnected ? 'success' : 'error'}
            />
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* MÉTRICAS DE USUARIO */}
        <Grid container spacing={3} alignItems="stretch">
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 2, textAlign: 'center', height: '100%' }}>
              <UserAvatar />
              <Typography variant="h6" fontWeight="bold" mt={2}>
                {safeUserStats.socialLevel}
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={1}>
                Siguiente nivel: {safeUserStats.nextLevel}
              </Typography>
              <LinearProgress
                variant="determinate"
                value={safeUserStats.socialProgress}
                sx={{ height: 8, borderRadius: 4 }}
              />
            </Paper>
          </Grid>

          <Grid item xs={12} md={8}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Tooltip title="Balance de Reciprocidad: Mide el equilibrio entre dar y recibir en la comunidad. Un valor cercano a 1 indica un balance saludable.">
                  <Paper elevation={2} sx={{ p: 2, bgcolor: alpha(getReciprocidadColor(safeUserStats.reciprocidadBalance), 0.1), height: '100%' }}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <BalanceIcon sx={{ fontSize: 40, color: getReciprocidadColor(safeUserStats.reciprocidadBalance) }} />
                      <Box flexGrow={1}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                          Balance de Reciprocidad
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Equilibrio entre dar y recibir
                        </Typography>
                      </Box>
                      <Typography variant="h4" sx={{ fontWeight: 'bold', color: getReciprocidadColor(safeUserStats.reciprocidadBalance) }}>
                        {safeUserStats.reciprocidadBalance.toFixed(2)}
                      </Typography>
                    </Stack>
                  </Paper>
                </Tooltip>
              </Grid>
              <Grid item xs={6} sm={3}>
                <MetricCard icon={<GroupIcon />} label="Conexiones" value={safeUserStats.connectionsCount} />
              </Grid>
              <Grid item xs={6} sm={3}>
                <MetricCard icon={<Handshake />} label="Colaboraciones" value={safeUserStats.collaborationsCount} />
              </Grid>
              <Grid item xs={6} sm={3}>
                <MetricCard icon={<Favorite />} label="Al Bien Común" value={safeUserStats.bienComunContributions} />
              </Grid>
              <Grid item xs={6} sm={3}>
                <MetricCard icon={<EmojiEvents />} label="Méritos Sociales" value={safeUserStats.socialMeritos} />
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        {/* ELEMENTOS SOCIALES */}
        {showDetailedView && (
          <Box mt={4}>
            <Typography variant="h6" fontWeight="bold" mb={2}>
              Equilibrio Elemental
            </Typography>
            <Grid container spacing={isMobile ? 2 : 3} justifyContent="center">
              {Object.entries(safeUserStats.elementos).map(([key, value]) => (
                <Grid item key={key}>
                  <SocialElementIcon
                    element={key}
                    value={value}
                    color={getElementoColor(value)}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* MÉTRICAS DE LA COMUNIDAD */}
        <Box mt={4}>
            <Typography variant="h6" fontWeight="bold" mb={2}>Métricas de la Comunidad</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <MetricCard
                  icon={<GroupIcon color="primary" />}
                  label="Conexiones Activas"
                  value={safeCommunityMetrics.activeConnections}
                  isLoading={isLoading}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <MetricCard
                  icon={<Handshake color="secondary" />}
                  label="Intercambios de Reciprocidad"
                  value={safeCommunityMetrics.reciprocidadExchanges}
                  isLoading={isLoading}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <MetricCard
                  icon={<People color="info" />}
                  label="Interacciones Diarias"
                  value={safeCommunityMetrics.dailyInteractions}
                  isLoading={isLoading}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <MetricCard
                  icon={<TrendingUp sx={{ color: 'success.main' }} />}
                  label="Círculos Activos"
                  value={safeCommunityMetrics.activeCircles}
                  isLoading={isLoading}
                />
              </Grid>
            </Grid>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ReciprocidadSocialMetrics;
