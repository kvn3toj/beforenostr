import React from 'react';
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
} from '@mui/icons-material';

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
            color: color,
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

export const AyniSocialMetrics: React.FC<AyniSocialMetricsProps> = ({
  userStats,
  communityMetrics,
  notifications,
  isLoading = false,
  isConnected = true,
  showDetailedView = false,
}) => {
  const theme = useTheme();

  const getBalanceColor = (balance: number) => {
    if (balance >= 0.8) return 'success';
    if (balance >= 0.6) return 'warning';
    return 'error';
  };

  const getBalanceMessage = (balance: number) => {
    if (balance >= 0.8) return 'Ayni en excelente equilibrio';
    if (balance >= 0.6) return 'Considera dar más para equilibrar';
    return 'Necesitas dar más en tus relaciones';
  };

  return (
    <Stack spacing={3}>
      {/* 📊 Métricas principales Ayni */}
      <Card
        sx={{
          background: `linear-gradient(135deg, ${alpha(
            '#E91E63',
            0.02
          )} 0%, ${alpha('#9C27B0', 0.02)} 100%)`,
          border: `1px solid ${alpha('#E91E63', 0.1)}`,
        }}
      >
        <CardContent>
          <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
            <Avatar
              sx={{
                bgcolor: '#E91E63',
                background: `linear-gradient(45deg, #E91E63, #9C27B0)`,
                width: 48,
                height: 48,
              }}
            >
              <Handshake />
            </Avatar>
            <Box>
              <Typography variant="h6" fontWeight="bold">
                Tu Perfil Social Ayni
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Balance de reciprocidad y colaboración
              </Typography>
            </Box>
            {!isConnected && (
              <Chip
                label="Modo Demo"
                color="warning"
                size="small"
                variant="outlined"
              />
            )}
          </Stack>

          {/* 🎯 Métricas principales */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={6} sm={3}>
              <Box textAlign="center">
                <Typography
                  variant="h4"
                  fontWeight="bold"
                  sx={{
                    background: `linear-gradient(45deg, #E91E63, #9C27B0)`,
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  {userStats.connectionsCount}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  fontWeight="bold"
                >
                  Conexiones
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box textAlign="center">
                <Typography variant="h4" fontWeight="bold" color="success.main">
                  {Math.round(userStats.ayniBalance * 100)}%
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  fontWeight="bold"
                >
                  Balance Ayni
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box textAlign="center">
                <Typography variant="h4" fontWeight="bold" color="warning.main">
                  {userStats.socialMeritos}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  fontWeight="bold"
                >
                  Mëritos Sociales
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box textAlign="center">
                <Typography
                  variant="h4"
                  fontWeight="bold"
                  color="error.main"
                  sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                >
                  <Star sx={{ fontSize: '0.8em' }} />
                  {userStats.trustScore}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  fontWeight="bold"
                >
                  Confianza
                </Typography>
              </Box>
            </Grid>
          </Grid>

          {/* 🎯 Balance Ayni con feedback */}
          <Box sx={{ mb: 3 }}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ mb: 1 }}
            >
              <Chip
                label={userStats.socialLevel}
                color="primary"
                variant="outlined"
                sx={{
                  fontWeight: 'bold',
                  background: `linear-gradient(45deg, ${alpha(
                    '#E91E63',
                    0.1
                  )}, ${alpha('#9C27B0', 0.1)})`,
                }}
              />
              <Typography variant="body2" color="text.secondary">
                Progreso a <strong>{userStats.nextLevel}</strong>
              </Typography>
            </Stack>
            <LinearProgress
              variant="determinate"
              value={userStats.socialProgress}
              sx={{
                height: 10,
                borderRadius: 5,
                bgcolor: alpha('#E91E63', 0.1),
                '& .MuiLinearProgress-bar': {
                  background: `linear-gradient(90deg, #E91E63, #9C27B0)`,
                  borderRadius: 5,
                },
              }}
            />
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ mt: 0.5, display: 'block' }}
            >
              {userStats.socialProgress}% •{' '}
              {getBalanceMessage(userStats.ayniBalance)}
            </Typography>
          </Box>

          {/* 🎯 Elementos sociales */}
          <Box>
            <Typography
              variant="subtitle1"
              fontWeight="bold"
              gutterBottom
              sx={{ mb: 2 }}
            >
              Elementos Sociales en Equilibrio
            </Typography>
            <Grid container spacing={2} justifyContent="center">
              <Grid item>
                <SocialElementIcon
                  element="comunicacion"
                  value={userStats.elementos.comunicacion}
                  color="#8b5cf6"
                />
              </Grid>
              <Grid item>
                <SocialElementIcon
                  element="empatia"
                  value={userStats.elementos.empatia}
                  color="#06b6d4"
                />
              </Grid>
              <Grid item>
                <SocialElementIcon
                  element="confianza"
                  value={userStats.elementos.confianza}
                  color="#78716c"
                />
              </Grid>
              <Grid item>
                <SocialElementIcon
                  element="inspiracion"
                  value={userStats.elementos.inspiracion}
                  color="#ef4444"
                />
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>

      {/* 🌐 Métricas de la comunidad */}
      <Card>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Estado de la Comunidad
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Group color="primary" />
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    {communityMetrics.onlineMembers}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Miembros en línea
                  </Typography>
                </Box>
              </Stack>
            </Grid>
            <Grid item xs={6}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Handshake color="success" />
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    {communityMetrics.ayniExchanges}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Intercambios Ayni hoy
                  </Typography>
                </Box>
              </Stack>
            </Grid>
            <Grid item xs={6}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <People color="secondary" />
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    {communityMetrics.activeCircles}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Círculos activos
                  </Typography>
                </Box>
              </Stack>
            </Grid>
            <Grid item xs={6}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <TrendingUp color="warning" />
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    +{communityMetrics.weeklyGrowth}%
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Crecimiento semanal
                  </Typography>
                </Box>
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* 🔔 Notificaciones recientes */}
      <Card>
        <CardContent>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb: 2 }}
          >
            <Typography variant="h6" fontWeight="bold">
              Actividad Reciente
            </Typography>
            <Badge badgeContent={notifications.length} color="primary">
              <Notifications />
            </Badge>
          </Stack>

          {notifications.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="body2" color="text.secondary">
                No hay actividad reciente
              </Typography>
            </Box>
          ) : (
            <Stack spacing={1}>
              {notifications
                .slice(0, showDetailedView ? 10 : 3)
                .map((notification) => (
                  <Paper
                    key={notification.id}
                    sx={{
                      p: 1.5,
                      border: `1px solid ${alpha('#E91E63', 0.1)}`,
                      bgcolor: alpha('#E91E63', 0.02),
                    }}
                  >
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Avatar
                        sx={{
                          bgcolor: '#E91E63',
                          width: 32,
                          height: 32,
                          fontSize: '0.8rem',
                        }}
                      >
                        {notification.category === 'ayni' && '🤝'}
                        {notification.category === 'collaboration' && '👥'}
                        {notification.category === 'network' && '🌐'}
                      </Avatar>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="subtitle2" fontWeight="bold">
                          {notification.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {notification.message}
                        </Typography>
                      </Box>
                      <Stack direction="row" alignItems="center" spacing={0.5}>
                        <AccessTime
                          sx={{ fontSize: 12, color: 'text.secondary' }}
                        />
                        <Typography variant="caption" color="text.secondary">
                          {notification.time}
                        </Typography>
                      </Stack>
                    </Stack>
                  </Paper>
                ))}
            </Stack>
          )}
        </CardContent>
      </Card>

      {/* 🎯 Vista detallada adicional */}
      {showDetailedView && (
        <Card>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Análisis de Crecimiento Personal
            </Typography>
            <Stack spacing={2}>
              <Box>
                <Typography variant="body2" fontWeight="bold" gutterBottom>
                  Fortalezas Identificadas
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {userStats.elementos.empatia >= 90 && (
                    <Chip label="Alta Empatía" color="primary" size="small" />
                  )}
                  {userStats.elementos.comunicacion >= 85 && (
                    <Chip
                      label="Comunicador Efectivo"
                      color="secondary"
                      size="small"
                    />
                  )}
                  {userStats.trustScore >= 4.5 && (
                    <Chip
                      label="Alta Confiabilidad"
                      color="success"
                      size="small"
                    />
                  )}
                </Stack>
              </Box>

              <Box>
                <Typography variant="body2" fontWeight="bold" gutterBottom>
                  Áreas de Desarrollo
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {userStats.elementos.confianza < 80 && (
                    <Chip
                      label="Fortalecer Confianza"
                      color="warning"
                      size="small"
                    />
                  )}
                  {userStats.ayniBalance < 0.7 && (
                    <Chip label="Equilibrar Ayni" color="error" size="small" />
                  )}
                </Stack>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      )}
    </Stack>
  );
};
