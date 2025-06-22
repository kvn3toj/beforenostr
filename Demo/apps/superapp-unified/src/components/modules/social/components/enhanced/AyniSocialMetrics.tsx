import React, { useState } from 'react';
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

interface SocialElementStats {
  comunicacion: number; // Aire - Comunicación efectiva
  empatia: number; // Agua - Empatía y fluidez emocional
  confianza: number; // Tierra - Estabilidad y confianza
  inspiracion: number; // Fuego - Pasión e inspiración
}

interface UserStats {
  ayniBalance: number;
  socialLevel: string;
  nextLevel: string;
  socialProgress: number;
  connectionsCount: number;
  collaborationsCount: number;
  bienComunContributions: number;
  socialMeritos: number;
  trustScore: number;
  elementos: SocialElementStats;
}

interface CommunityMetrics {
  activeConnections: number;
  onlineMembers: number;
  dailyInteractions: number;
  ayniExchanges: number;
  activeCircles: number;
  weeklyGrowth: number;
}

interface NotificationData {
  id: string;
  type: string;
  title: string;
  message: string;
  time: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
}

interface AyniSocialMetricsProps {
  userStats: UserStats;
  communityMetrics: CommunityMetrics;
  notifications: NotificationData[];
  isLoading?: boolean;
  isConnected?: boolean;
  showDetailedView?: boolean;
}

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

const AyniSocialMetrics: React.FC<AyniSocialMetricsProps> = ({
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
  const safeUserStats = {
    ayniBalance: userStats?.ayniBalance ?? 0.5,
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
  };

  const safeCommunityMetrics = {
    activeConnections: communityMetrics?.activeConnections ?? 0,
    onlineMembers: communityMetrics?.onlineMembers ?? 12,
    dailyInteractions: communityMetrics?.dailyInteractions ?? 8,
    ayniExchanges: communityMetrics?.ayniExchanges ?? 3,
    activeCircles: communityMetrics?.activeCircles ?? 2,
    weeklyGrowth: communityMetrics?.weeklyGrowth ?? 5
  };

  const safeNotifications = Array.isArray(notifications) ? notifications : [];

  // 🎨 ESTADOS VISUALES MEJORADOS
  const [showAnimations, setShowAnimations] = useState(true);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  // 🌈 COLORES DINÁMICOS BASADOS EN VALORES
  const getAyniColor = (value: number) => {
    if (value >= 0.8) return theme.palette.success.main;
    if (value >= 0.6) return theme.palette.warning.main;
    return theme.palette.error.main;
  };

  const getElementoColor = (value: number) => {
    if (value >= 85) return '#4CAF50';
    if (value >= 70) return '#FF9800';
    return '#F44336';
  };

  // 🔄 LOADING STATE MEJORADO
  if (isLoading) {
    return (
      <Box sx={{ p: 3 }}>
        <Skeleton variant="rectangular" width="100%" height={200} sx={{ mb: 2, borderRadius: 2 }} />
        <Grid container spacing={2}>
          {[1, 2, 3, 4].map((i) => (
            <Grid item xs={6} md={3} key={i}>
              <Skeleton variant="rectangular" height={100} sx={{ borderRadius: 2 }} />
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        background: `linear-gradient(145deg, ${theme.palette.background.paper}, ${alpha(theme.palette.primary.main, 0.05)})`,
        borderRadius: 3,
        p: 3,
        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* 🌟 HEADER CON INDICADOR DE CONEXIÓN */}
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar
            sx={{
              width: 56,
              height: 56,
              background: `linear-gradient(145deg, ${getAyniColor(safeUserStats.ayniBalance)}, ${alpha(getAyniColor(safeUserStats.ayniBalance), 0.7)})`,
              boxShadow: theme.shadows[3]
            }}
          >
            <Handshake sx={{ fontSize: 28, color: 'white' }} />
          </Avatar>
          <Box>
            <Typography variant="h6" fontWeight="bold" color="primary">
              Métricas Ayni
            </Typography>
            <Box display="flex" alignItems="center" gap={1}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: isConnected ? theme.palette.success.main : theme.palette.error.main,
                  animation: isConnected ? 'pulse 2s infinite' : 'none'
                }}
              />
              <Typography variant="caption" color="text.secondary">
                {isConnected ? 'Conectado' : 'Desconectado'}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Tooltip title={showDetailedView ? 'Vista compacta' : 'Vista detallada'}>
          <IconButton
            onClick={() => setExpandedSection(expandedSection ? null : 'main')}
            size="small"
            sx={{
              background: alpha(theme.palette.primary.main, 0.1),
              '&:hover': { background: alpha(theme.palette.primary.main, 0.2) }
            }}
          >
            {expandedSection ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Tooltip>
      </Box>

      {/* 🔢 MÉTRICAS PRINCIPALES */}
      <Grid container spacing={2} mb={3}>
        <Grid item xs={6} md={3}>
          <Card
            elevation={0}
            sx={{
              p: 2,
              background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.1)}, ${alpha(theme.palette.success.main, 0.05)})`,
              border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: theme.shadows[4]
              }
            }}
          >
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <BalanceIcon color="success" fontSize="small" />
              <Typography variant="caption" color="success.main" fontWeight="medium">
                Balance Ayni
              </Typography>
            </Box>
            <Typography variant="h4" fontWeight="bold" color="success.main">
              {(safeUserStats.ayniBalance * 100).toFixed(0)}%
            </Typography>
            <LinearProgress
              variant="determinate"
              value={safeUserStats.ayniBalance * 100}
              sx={{
                mt: 1,
                height: 6,
                borderRadius: 3,
                backgroundColor: alpha(theme.palette.success.main, 0.1),
                '& .MuiLinearProgress-bar': {
                  backgroundColor: getAyniColor(safeUserStats.ayniBalance),
                  borderRadius: 3
                }
              }}
            />
          </Card>
        </Grid>

        <Grid item xs={6} md={3}>
          <Card
            elevation={0}
            sx={{
              p: 2,
              background: `linear-gradient(135deg, ${alpha(theme.palette.info.main, 0.1)}, ${alpha(theme.palette.info.main, 0.05)})`,
              border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: theme.shadows[4]
              }
            }}
          >
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <GroupIcon color="info" fontSize="small" />
              <Typography variant="caption" color="info.main" fontWeight="medium">
                Conexiones
              </Typography>
            </Box>
            <Typography variant="h4" fontWeight="bold" color="info.main">
              {safeUserStats.connectionsCount}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              +{safeCommunityMetrics.activeConnections} activas
            </Typography>
          </Card>
        </Grid>

        <Grid item xs={6} md={3}>
          <Card
            elevation={0}
            sx={{
              p: 2,
              background: `linear-gradient(135deg, ${alpha(theme.palette.warning.main, 0.1)}, ${alpha(theme.palette.warning.main, 0.05)})`,
              border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: theme.shadows[4]
              }
            }}
          >
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <EmojiEventsIcon color="warning" fontSize="small" />
              <Typography variant="caption" color="warning.main" fontWeight="medium">
                Méritos
              </Typography>
            </Box>
            <Typography variant="h4" fontWeight="bold" color="warning.main">
              {safeUserStats.socialMeritos.toLocaleString()}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {safeUserStats.socialLevel}
            </Typography>
          </Card>
        </Grid>

        <Grid item xs={6} md={3}>
          <Card
            elevation={0}
            sx={{
              p: 2,
              background: `linear-gradient(135deg, ${alpha(theme.palette.secondary.main, 0.1)}, ${alpha(theme.palette.secondary.main, 0.05)})`,
              border: `1px solid ${alpha(theme.palette.secondary.main, 0.2)}`,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: theme.shadows[4]
              }
            }}
          >
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <VerifiedIcon color="secondary" fontSize="small" />
              <Typography variant="caption" color="secondary.main" fontWeight="medium">
                Confianza
              </Typography>
            </Box>
            <Typography variant="h4" fontWeight="bold" color="secondary.main">
              {safeUserStats.trustScore.toFixed(1)}
            </Typography>
            <Box display="flex" mt={0.5}>
              {[1, 2, 3, 4, 5].map((star) => (
                <StarIcon
                  key={star}
                  sx={{
                    fontSize: 16,
                    color: star <= safeUserStats.trustScore
                      ? theme.palette.warning.main
                      : alpha(theme.palette.warning.main, 0.3)
                  }}
                />
              ))}
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* 🌱 ELEMENTOS DE CRECIMIENTO - Vista Expandida */}
      <Collapse in={!!expandedSection}>
        <Card
          elevation={0}
          sx={{
            p: 3,
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)}, ${alpha(theme.palette.primary.main, 0.02)})`,
            border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
            borderRadius: 2,
            mb: 3
          }}
        >
          <Typography variant="h6" fontWeight="bold" mb={2} color="primary">
            🌱 Elementos de Crecimiento
          </Typography>

          <Grid container spacing={3}>
            {Object.entries(safeUserStats.elementos).map(([elemento, valor]) => (
              <Grid item xs={6} md={3} key={elemento}>
                <Box>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography variant="body2" fontWeight="medium" textTransform="capitalize">
                      {elemento}
                    </Typography>
                    <Typography variant="body2" fontWeight="bold" color={getElementoColor(valor)}>
                      {valor}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={valor}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: alpha(getElementoColor(valor), 0.1),
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: getElementoColor(valor),
                        borderRadius: 4
                      }
                    }}
                  />
                </Box>
              </Grid>
            ))}
          </Grid>
        </Card>
      </Collapse>

      {/* 📊 MÉTRICAS COMUNITARIAS */}
      <Card
        elevation={0}
        sx={{
          p: 2,
          background: alpha(theme.palette.background.default, 0.5),
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`
        }}
      >
        <Typography variant="subtitle1" fontWeight="bold" mb={2} color="text.primary">
          🌐 Actividad Comunitaria
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Box textAlign="center">
              <Typography variant="h6" fontWeight="bold" color="primary">
                {safeCommunityMetrics.onlineMembers}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Miembros en línea
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box textAlign="center">
              <Typography variant="h6" fontWeight="bold" color="success.main">
                {safeCommunityMetrics.dailyInteractions}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Interacciones hoy
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Card>

      {/* 🔔 NOTIFICACIONES RECIENTES */}
      {safeNotifications.length > 0 && (
        <Box mt={3}>
          <Typography variant="subtitle2" fontWeight="bold" mb={1} color="text.primary">
            🔔 Actividad Reciente
          </Typography>
          {safeNotifications.slice(0, 3).map((notification, index) => (
            <Box
              key={notification.id || index}
              display="flex"
              alignItems="center"
              gap={2}
              p={1.5}
              mb={1}
              sx={{
                background: alpha(theme.palette.info.main, 0.05),
                borderRadius: 1,
                border: `1px solid ${alpha(theme.palette.info.main, 0.1)}`
              }}
            >
              <Avatar sx={{ width: 32, height: 32, fontSize: 14 }}>
                {notification.type === 'achievement' ? '🏆' :
                 notification.type === 'connection' ? '🤝' : '💬'}
              </Avatar>
              <Box flex={1}>
                <Typography variant="body2" color="text.primary">
                  {notification.message || 'Nueva actividad'}
                </Typography>
                                 <Typography variant="caption" color="text.secondary">
                   {notification.time ? formatDistanceToNow(new Date(notification.time), { addSuffix: true, locale: es }) : 'hace un momento'}
                 </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      )}

      {/* 🎨 EFECTOS VISUALES */}
      <Box
        sx={{
          position: 'absolute',
          top: -50,
          right: -50,
          width: 100,
          height: 100,
          background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.1)}, transparent)`,
          borderRadius: '50%',
          zIndex: 0
        }}
      />
    </Box>
  );
};

export { AyniSocialMetrics };
export default AyniSocialMetrics;
