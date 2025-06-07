import React, { useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  LinearProgress,
  IconButton,
  Badge,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  Button,
  Stack,
} from '@mui/material';
import {
  Notifications,
  Settings,
  EmojiEvents,
  LocalFireDepartment,
  Park,
  Waves,
  Air,
  Star,
  Store,
  PlayArrow,
  People,
  Refresh,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useHybridData, useDashboardData, useBackendAvailability } from '../hooks/useRealBackendData';

// 🎭 Mock data (fallback when backend is unavailable)
const mockDashboardData = {
  gamification: {
    points: 480,
    happiness: 90,
    level: 'Explorador',
    nextLevel: 'Navegante',
    progress: 75,
    badges: ['Ayni Inicial', 'Colaborador', 'Ecológico'],
    streak: 7,
  },
  wallet: {
    balance: 125075,
    ucoins: 480,
    monthlyChange: 15.2,
  },
  notifications: [
    {
      id: '1',
      type: 'achievement',
      title: 'Nuevo badge conseguido',
      message: 'Has desbloqueado el badge "Colaborador"',
      time: '2h',
    },
    {
      id: '2',
      type: 'marketplace',
      title: 'Producto vendido',
      message: 'Tu servicio de diseño ha sido comprado',
      time: '4h',
    },
    {
      id: '3',
      type: 'social',
      title: 'Nueva conexión',
      message: 'María González quiere conectar contigo',
      time: '1d',
    },
  ],
  quickActions: [
    { icon: <Store />, label: 'Explorar Market', path: '/marketplace', color: 'primary' },
    { icon: <PlayArrow />, label: 'Ver Videos', path: '/play', color: 'secondary' },
    { icon: <People />, label: 'Conectar', path: '/social', color: 'success' },
    { icon: <EmojiEvents />, label: 'Misiones', path: '/pilgrim', color: 'warning' },
  ],
};

const ElementIcon = ({ element }: { element: string }) => {
  const iconProps = { sx: { fontSize: 20 } };
  switch (element) {
    case 'fire':
      return <LocalFireDepartment {...iconProps} sx={{ ...iconProps.sx, color: '#ef4444' }} />;
    case 'earth':
      return <Park {...iconProps} sx={{ ...iconProps.sx, color: '#78716c' }} />;
    case 'water':
      return <Waves {...iconProps} sx={{ ...iconProps.sx, color: '#06b6d4' }} />;
    case 'air':
      return <Air {...iconProps} sx={{ ...iconProps.sx, color: '#8b5cf6' }} />;
    default:
      return <Star {...iconProps} />;
  }
};

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // 🔗 Conectar al backend real con fallback a mock data
  const backendAvailability = useBackendAvailability();
  const dashboardData = useDashboardData(user?.id || 'mock-user-id');

  // 🎯 Decidir qué datos usar basado en disponibilidad del backend
  const gameData = dashboardData.gameData || mockDashboardData.gamification;
  const walletData = dashboardData.walletData || mockDashboardData.wallet;
  const userData = dashboardData.userProfile || user;

  // 🔄 Función para refrescar datos
  const handleRefresh = () => {
    if (dashboardData.refetch) {
      dashboardData.refetch();
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleQuickAction = (path: string) => {
    navigate(path);
  };

  // 🎨 Mapear datos del backend al formato esperado por la UI
  const normalizedGameData = {
    points: gameData.experience || gameData.points || 480,
    happiness: gameData.stats?.wisdom || gameData.happiness || 90,
    level: gameData.title || gameData.level || 'Explorador',
    nextLevel: gameData.nextLevel || 'Navegante',
    progress: Math.floor(((gameData.experience || 480) / (gameData.nextLevelExp || 1500)) * 100) || 75,
    badges: gameData.badges || ['Ayni Inicial', 'Colaborador'],
    streak: gameData.streak || 7,
  };

  const normalizedWalletData = {
    balance: walletData.balance || 125075,
    ucoins: walletData.ucoins || 480,
    monthlyChange: walletData.monthlyChange || 15.2,
  };

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      {/* 🔗 Backend Connection Status */}
      {!backendAvailability.isAvailable && (
        <Card sx={{ mb: 2, bgcolor: 'warning.light', color: 'warning.contrastText' }}>
          <CardContent sx={{ py: 1.5 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Typography variant="body2">
                🔌 Modo Offline - Usando datos simulados
              </Typography>
              <Button
                size="small"
                startIcon={<Refresh />}
                onClick={handleRefresh}
                sx={{ color: 'inherit' }}
              >
                Reintentar
              </Button>
            </Stack>
          </CardContent>
        </Card>
      )}

      {backendAvailability.isAvailable && dashboardData.isLoading && (
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              🔄 Cargando datos del servidor...
            </Typography>
            <LinearProgress />
          </CardContent>
        </Card>
      )}

      {/* Header con saludo y notificaciones */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            ¡Hola, {userData?.full_name?.split(' ')[0] || user?.full_name?.split(' ')[0] || 'CoomÜnity'}! 👋
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {backendAvailability.isAvailable ? 
              '🌐 Conectado al servidor • Datos en tiempo real' :
              '📱 Modo offline • Datos simulados'
            }
          </Typography>
        </Box>
        <Box>
          <IconButton
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            sx={{ mr: 1 }}
          >
            <Badge badgeContent={mockDashboardData.notifications.length} color="primary">
              <Notifications />
            </Badge>
          </IconButton>
          <IconButton onClick={() => navigate('/profile')}>
            <Settings />
          </IconButton>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Gamificación */}
        <Grid item xs={12} md={8}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <EmojiEvents sx={{ fontSize: 30, color: 'primary.main', mr: 2 }} />
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    Tu Progreso CoomÜnity
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {backendAvailability.isAvailable ? 'Datos del servidor' : 'Datos simulados'}
                  </Typography>
                </Box>
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                  <Box textAlign="center">
                    <Typography variant="h3" fontWeight="bold" color="primary.main">
                      {normalizedGameData.points}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Öndas Acumuladas
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box textAlign="center">
                    <Typography variant="h3" fontWeight="bold" color="secondary.main">
                      {normalizedGameData.happiness}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Felicidad
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box textAlign="center">
                    <Chip
                      label={`Nivel: ${normalizedGameData.level}`}
                      color="primary"
                      variant="outlined"
                      sx={{ fontSize: '0.9rem', fontWeight: 'bold' }}
                    />
                  </Box>
                </Grid>
              </Grid>

              <Box sx={{ mt: 3 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Progreso a {normalizedGameData.nextLevel}
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={normalizedGameData.progress}
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>

              <Box sx={{ mt: 3 }}>
                <Typography variant="body2" fontWeight="bold" gutterBottom>
                  Badges Conseguidos
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {normalizedGameData.badges.slice(0, 2).map((badge, index) => (
                    <Chip
                      key={index}
                      label={badge}
                      size="small"
                      color="success"
                      icon={<ElementIcon element={index % 2 === 0 ? 'fire' : 'earth'} />}
                    />
                  ))}
                  {normalizedGameData.badges.length > 2 && (
                    <Chip
                      label={`+${normalizedGameData.badges.length - 2}`}
                      size="small"
                      variant="outlined"
                    />
                  )}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Wallet y Acciones Rápidas */}
        <Grid item xs={12} md={4}>
          <Stack spacing={2}>
            {/* Wallet */}
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" fontWeight="bold">
                    Mi Wallet
                  </Typography>
                  <Avatar sx={{ bgcolor: 'success.main', width: 32, height: 32 }}>
                    $
                  </Avatar>
                </Box>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                  {formatCurrency(normalizedWalletData.balance)}
                </Typography>
                <Typography variant="body2" color="success.main">
                  +{normalizedWalletData.monthlyChange}% este mes
                </Typography>
              </CardContent>
            </Card>

            {/* ÜCoins */}
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    ÜCoins
                  </Typography>
                  <Avatar sx={{ bgcolor: 'warning.main', width: 28, height: 28, fontSize: '0.8rem' }}>
                    Ü
                  </Avatar>
                </Box>
                <Typography variant="h5" fontWeight="bold" color="warning.main">
                  {normalizedWalletData.ucoins} ÜCoins
                </Typography>
              </CardContent>
            </Card>

            {/* Acciones Rápidas */}
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Acciones Rápidas
                </Typography>
                <Grid container spacing={1}>
                  {mockDashboardData.quickActions.map((action, index) => (
                    <Grid item xs={6} key={index}>
                      <Button
                        fullWidth
                        variant="outlined"
                        color={action.color as any}
                        onClick={() => handleQuickAction(action.path)}
                        startIcon={action.icon}
                        sx={{ flexDirection: 'column', py: 1.5, minHeight: 60 }}
                      >
                        <Typography variant="caption" sx={{ mt: 0.5 }}>
                          {action.label}
                        </Typography>
                      </Button>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Stack>
        </Grid>

        {/* Notificaciones */}
        {notificationsOpen && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" fontWeight="bold">
                    Notificaciones Recientes
                  </Typography>
                  <Badge badgeContent={mockDashboardData.notifications.length} color="primary">
                    <Notifications />
                  </Badge>
                </Box>
                <List>
                  {mockDashboardData.notifications.map((notification, index) => (
                    <React.Fragment key={notification.id}>
                      <ListItem>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: 'primary.main' }}>
                            {notification.type === 'achievement' && <EmojiEvents />}
                            {notification.type === 'marketplace' && <Store />}
                            {notification.type === 'social' && <People />}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={notification.title}
                          secondary={notification.message}
                        />
                        <Typography variant="caption" color="text.secondary">
                          {notification.time}
                        </Typography>
                      </ListItem>
                      {index < mockDashboardData.notifications.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Container>
  );
}; 