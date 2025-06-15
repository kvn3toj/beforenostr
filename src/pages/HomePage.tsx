import React from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  Avatar,
  Stack,
  Paper,
  Chip,
  IconButton,
  Divider,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTranslation } from 'react-i18next';
import {
  useTotalUsersQuery,
  useTotalPlaylistsQuery,
  useTotalMundosQuery,
} from '../hooks/analytics';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Public as WorldIcon,
  PlaylistPlay as PlaylistIcon,
  TrendingUp as TrendingUpIcon,
  Settings as SettingsIcon,
  Analytics as AnalyticsIcon,
  Add as AddIcon,
  ArrowForward as ArrowForwardIcon,
  Notifications as NotificationsIcon,
  Schedule as ScheduleIcon,
} from '../components/common/Icons';

// Componente para métricas principales - versión minimalista
interface MetricCardProps {
  title: string;
  value: number | undefined;
  icon: React.ReactNode;
  color: string;
  isLoading: boolean;
  onClick?: () => void;
}

const MinimalMetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  icon,
  color,
  isLoading,
  onClick,
}) => {
  return (
    <Card 
      sx={{ 
        height: '120px',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.2s ease-in-out',
        border: '1px solid #E0E0E0',
        boxShadow: 'none',
        '&:hover': onClick ? {
          transform: 'translateY(-2px)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          borderColor: color,
        } : {},
      }}
      onClick={onClick}
    >
      <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: '8px',
              backgroundColor: `${color}15`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: color,
            }}
          >
            {icon}
          </Box>
          {onClick && (
            <IconButton size="small" sx={{ color: '#999999' }}>
              <ArrowForwardIcon fontSize="small" />
            </IconButton>
          )}
        </Box>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#333333', mb: 0.5 }}>
          {isLoading ? '...' : (value?.toLocaleString() || '0')}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {title}
        </Typography>
      </CardContent>
    </Card>
  );
};

// Componente para acciones rápidas - versión minimalista
interface QuickActionProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  onClick: () => void;
}

const MinimalActionCard: React.FC<QuickActionProps> = ({
  title,
  description,
  icon,
  color,
  onClick,
}) => {
  return (
    <Card 
      sx={{ 
        height: '100px',
        cursor: 'pointer',
        transition: 'all 0.2s ease-in-out',
        border: '1px solid #E0E0E0',
        boxShadow: 'none',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          borderColor: color,
        },
      }}
      onClick={onClick}
    >
      <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: '8px',
              backgroundColor: `${color}15`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: color,
            }}
          >
            {icon}
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#333333', mb: 0.5 }}>
              {title}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {description}
            </Typography>
          </Box>
          <IconButton size="small" sx={{ color: '#999999' }}>
            <ArrowForwardIcon fontSize="small" />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );
};

export const HomePage: React.FC = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Analytics queries
  const { data: usersData, isLoading: isLoadingUsers } = useTotalUsersQuery();
  const { data: playlistsData, isLoading: isLoadingPlaylists } = useTotalPlaylistsQuery();
  const { data: mundosData, isLoading: isLoadingMundos } = useTotalMundosQuery();

  // Acciones rápidas
  const quickActions = [
    {
      title: 'Crear Mundo',
      description: 'Nuevo mundo gamificado',
      icon: <AddIcon />,
      color: '#2196F3',
      onClick: () => navigate('/mundos'),
    },
    {
      title: 'Gestionar Usuarios',
      description: 'Administrar usuarios',
      icon: <PeopleIcon />,
      color: '#4CAF50',
      onClick: () => navigate('/users'),
    },
    {
      title: 'Ver Analytics',
      description: 'Métricas y estadísticas',
      icon: <AnalyticsIcon />,
      color: '#FF9800',
      onClick: () => navigate('/analytics'),
    },
    {
      title: 'Configuración',
      description: 'Ajustes del sistema',
      icon: <SettingsIcon />,
      color: '#9C27B0',
      onClick: () => navigate('/settings'),
    },
  ];

  // Actividad reciente simplificada
  const recentActivity = [
    {
      id: 1,
      message: 'Nuevo usuario registrado',
      time: '30 min',
      type: 'user',
    },
    {
      id: 2,
      message: 'Mundo "Educación" actualizado',
      time: '2 h',
      type: 'mundo',
    },
    {
      id: 3,
      message: 'Playlist creada exitosamente',
      time: '4 h',
      type: 'playlist',
    },
  ];

  return (
    <Box sx={{ backgroundColor: '#F8F9FA', minHeight: '100vh' }}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header de Bienvenida - Minimalista */}
        <Box sx={{ mb: 6 }}>
          <Typography 
            variant="h3" 
            component="h1" 
            sx={{ 
              fontWeight: 'bold', 
              color: '#333333',
              mb: 1,
              fontSize: { xs: '2rem', md: '3rem' }
            }}
          >
            Bienvenido de vuelta
          </Typography>
          <Typography 
            variant="h6" 
            color="text.secondary" 
            sx={{ 
              fontWeight: 400,
              fontSize: { xs: '1rem', md: '1.25rem' }
            }}
          >
            Hola, {user?.email?.split('@')[0] || 'Administrador'} 👋
          </Typography>
        </Box>

        {/* Métricas Principales */}
        <Box sx={{ mb: 6 }}>
          <Typography 
            variant="h5" 
            sx={{ 
              fontWeight: 600, 
              color: '#333333', 
              mb: 3,
              fontSize: { xs: '1.25rem', md: '1.5rem' }
            }}
          >
            Resumen
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <MinimalMetricCard
                title="Usuarios"
                value={usersData?.count}
                icon={<PeopleIcon />}
                color="#2196F3"
                isLoading={isLoadingUsers}
                onClick={() => navigate('/users')}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <MinimalMetricCard
                title="Mundos"
                value={mundosData?.count}
                icon={<WorldIcon />}
                color="#4CAF50"
                isLoading={isLoadingMundos}
                onClick={() => navigate('/mundos')}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <MinimalMetricCard
                title="Playlists"
                value={playlistsData?.count}
                icon={<PlaylistIcon />}
                color="#FF9800"
                isLoading={isLoadingPlaylists}
                onClick={() => navigate('/playlists')}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <MinimalMetricCard
                title="Actividad"
                value={recentActivity.length}
                icon={<TrendingUpIcon />}
                color="#9C27B0"
                isLoading={false}
                onClick={() => navigate('/analytics')}
              />
            </Grid>
          </Grid>
        </Box>

        <Grid container spacing={4}>
          {/* Acciones Rápidas */}
          <Grid item xs={12} lg={8}>
            <Typography 
              variant="h5" 
              sx={{ 
                fontWeight: 600, 
                color: '#333333', 
                mb: 3,
                fontSize: { xs: '1.25rem', md: '1.5rem' }
              }}
            >
              Acciones Rápidas
            </Typography>
            <Grid container spacing={3}>
              {quickActions.map((action, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <MinimalActionCard {...action} />
                </Grid>
              ))}
            </Grid>
          </Grid>

          {/* Panel Lateral - Actividad */}
          <Grid item xs={12} lg={4}>
            <Typography 
              variant="h5" 
              sx={{ 
                fontWeight: 600, 
                color: '#333333', 
                mb: 3,
                fontSize: { xs: '1.25rem', md: '1.5rem' }
              }}
            >
              Actividad Reciente
            </Typography>
            
            <Paper 
              sx={{ 
                p: 3, 
                border: '1px solid #E0E0E0',
                boxShadow: 'none',
                borderRadius: '12px'
              }}
            >
              <Stack spacing={3}>
                {recentActivity.map((activity, index) => (
                  <Box key={activity.id}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          backgroundColor: activity.type === 'user' ? '#2196F3' : 
                                         activity.type === 'mundo' ? '#4CAF50' : '#FF9800',
                        }}
                      />
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" sx={{ color: '#333333', fontWeight: 500 }}>
                          {activity.message}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Hace {activity.time}
                        </Typography>
                      </Box>
                    </Box>
                    {index < recentActivity.length - 1 && (
                      <Divider sx={{ mt: 2 }} />
                    )}
                  </Box>
                ))}
              </Stack>
              
              <Button 
                fullWidth 
                variant="outlined" 
                size="small" 
                sx={{ 
                  mt: 3,
                  borderColor: '#E0E0E0',
                  color: '#666666',
                  '&:hover': {
                    borderColor: '#2196F3',
                    backgroundColor: '#F3F4F6',
                  }
                }}
                onClick={() => navigate('/audit-logs')}
              >
                Ver Todo
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}; 