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

// Componente principal
export const ReciprocidadSocialMetrics: React.FC<ReciprocidadSocialMetricsProps> = ({
  userStats,
  communityMetrics,
  notifications,
  isLoading = false,
  isConnected = true,
  detailed = false
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
    <Stack spacing={3}>
      {/* 🧩 TARJETA DE PERFIL SOCIAL */}
      <Paper
        variant="outlined"
        sx={{
          p: 3,
          borderRadius: 2,
          backgroundColor: '#ffffff',
          borderColor: alpha(theme.palette.primary.main, 0.1),
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <UserAvatar />
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1" fontWeight="bold">
              {safeUserStats.socialLevel}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
              <LinearProgress
                variant="determinate"
                value={safeUserStats.socialProgress}
                sx={{
                  flexGrow: 1,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: theme.palette.primary.main
                  }
                }}
              />
              <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                {safeUserStats.socialProgress}%
              </Typography>
            </Box>
            <Typography variant="caption" color="text.secondary">
              Próximo nivel: {safeUserStats.nextLevel}
            </Typography>
          </Box>
        </Stack>

        {/* 🧩 MÉTRICAS CLAVE */}
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={6} sm={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h5" fontWeight="bold" color="primary.main">
                {safeUserStats.connectionsCount}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Conexiones
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h5" fontWeight="bold" color="secondary.main">
                {safeUserStats.collaborationsCount}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Colaboraciones
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h5" fontWeight="bold" color="success.main">
                {safeUserStats.bienComunContributions}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Contribuciones
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h5" fontWeight="bold" color="warning.main">
                {safeUserStats.socialMeritos}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Méritos
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* 🧩 ELEMENTOS SOCIALES */}
        <Box sx={{ mt: 3 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2
            }}
          >
            <Typography variant="subtitle2" fontWeight="bold">
              Balance de Elementos Sociales
            </Typography>
            <IconButton
              size="small"
              onClick={() => handleToggleSection('elementos')}
            >
              {expandedSection === 'elementos' ? (
                <ExpandLessIcon fontSize="small" />
              ) : (
                <ExpandMoreIcon fontSize="small" />
              )}
            </IconButton>
          </Box>

          <Collapse in={expandedSection === 'elementos' || !isMobile}>
            <Grid container spacing={2} justifyContent="center">
              {Object.entries(safeUserStats.elementos).map(([key, value]) => (
                <Grid item key={key} xs={6} sm={3}>
                  <SocialElementIcon
                    element={key}
                    value={value}
                    color={
                      key === 'comunicacion'
                        ? theme.palette.info.main
                        : key === 'empatia'
                        ? theme.palette.primary.main
                        : key === 'confianza'
                        ? theme.palette.success.main
                        : theme.palette.warning.main
                    }
                  />
                </Grid>
              ))}
            </Grid>
          </Collapse>
        </Box>
      </Paper>

      {/* 🧩 MÉTRICAS DE LA COMUNIDAD */}
      <Paper
        variant="outlined"
        sx={{
          p: 3,
          borderRadius: 2,
          backgroundColor: '#ffffff',
          borderColor: alpha(theme.palette.secondary.main, 0.1),
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2
          }}
        >
          <Typography variant="subtitle2" fontWeight="bold">
            Métricas de la Comunidad
          </Typography>
          <IconButton
            size="small"
            onClick={() => handleToggleSection('community')}
          >
            {expandedSection === 'community' ? (
              <ExpandLessIcon fontSize="small" />
            ) : (
              <ExpandMoreIcon fontSize="small" />
            )}
          </IconButton>
        </Box>

        <Collapse in={expandedSection === 'community' || !isMobile}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <MetricCard
                icon={<People />}
                label="Conexiones Activas"
                value={safeCommunityMetrics.activeConnections}
                isLoading={isLoading}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <MetricCard
                icon={<Group />}
                label="Miembros Online"
                value={safeCommunityMetrics.onlineMembers}
                isLoading={isLoading}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <MetricCard
                icon={<Handshake />}
                label="Intercambios Reciprocidad"
                value={safeCommunityMetrics.reciprocidadExchanges}
                isLoading={isLoading}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <MetricCard
                icon={<TrendingUp />}
                label="Crecimiento Semanal"
                value={`+${safeCommunityMetrics.weeklyGrowth}%`}
                isLoading={isLoading}
              />
            </Grid>
          </Grid>
        </Collapse>
      </Paper>

      {/* 🧩 SECCIÓN DETALLADA (SOLO SI SE SOLICITA) */}
      {detailed && (
        <Paper
          variant="outlined"
          sx={{
            p: 3,
            borderRadius: 2,
            backgroundColor: '#ffffff',
            borderColor: alpha(theme.palette.info.main, 0.1),
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
            Análisis Detallado de Reciprocidad
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Tu índice de Reciprocidad Social muestra un balance entre dar y recibir que
            contribuye positivamente al ecosistema CoomÜnity.
          </Typography>

          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" fontWeight="medium" gutterBottom>
                  Índice de Confianza
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ flexGrow: 1, mr: 1 }}>
                    <LinearProgress
                      variant="determinate"
                      value={safeUserStats.trustScore * 20}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: alpha(theme.palette.success.main, 0.1),
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: theme.palette.success.main
                        }
                      }}
                    />
                  </Box>
                  <Typography variant="body2" fontWeight="bold">
                    {safeUserStats.trustScore}/5
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" fontWeight="medium" gutterBottom>
                  Balance Reciprocidad
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ flexGrow: 1, mr: 1 }}>
                    <LinearProgress
                      variant="determinate"
                      value={safeUserStats.reciprocidadBalance * 100}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: alpha(
                          getReciprocidadColor(safeUserStats.reciprocidadBalance),
                          0.1
                        ),
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: getReciprocidadColor(
                            safeUserStats.reciprocidadBalance
                          )
                        }
                      }}
                    />
                  </Box>
                  <Typography variant="body2" fontWeight="bold">
                    {Math.round(safeUserStats.reciprocidadBalance * 100)}%
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      )}
    </Stack>
  );
};

export default ReciprocidadSocialMetrics;
