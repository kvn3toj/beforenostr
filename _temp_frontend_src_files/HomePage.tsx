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
        height: '140px',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.3s ease-in-out',
        border: '1px solid #F3F4F6',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
        borderRadius: '16px',
        '&:hover': onClick ? {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 24px rgba(206, 169, 58, 0.15)',
          borderColor: '#CEA93A',
        } : {},
      }}
      onClick={onClick}
    >
      <CardContent sx={{ 
        p: 3, 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        '&:last-child': { pb: 3 } 
      }}>
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: '12px',
            backgroundColor: `${color}15`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: color,
            mb: 2,
          }}
        >
          {icon}
        </Box>
        
        <Typography 
          variant="body2" 
          sx={{ 
            color: '#6B7280', 
            fontWeight: 500,
            fontSize: '0.875rem',
            lineHeight: 1.2,
            mb: 1
          }}
        >
          {title}
        </Typography>
        
        <Typography 
          variant="h5" 
          sx={{ 
            fontWeight: 'bold', 
            color: '#1F2937',
            fontSize: '1.5rem',
            lineHeight: 1,
            letterSpacing: '-0.025em'
          }}
        >
          {isLoading ? '...' : (value?.toLocaleString() || '0')}
        </Typography>
        
        {onClick && (
          <IconButton 
            size="small" 
            sx={{ 
              color: '#9CA3AF',
              position: 'absolute',
              top: 12,
              right: 12,
              '&:hover': {
                color: '#CEA93A',
                backgroundColor: 'rgba(206, 169, 58, 0.1)',
              }
            }}
          >
            <ArrowForwardIcon fontSize="small" />
          </IconButton>
        )}
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
        transition: 'all 0.3s ease-in-out',
        border: '1px solid #F3F4F6',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
        borderRadius: '16px',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 24px rgba(206, 169, 58, 0.15)',
          borderColor: '#CEA93A',
        },
      }}
      onClick={onClick}
    >
      <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: '12px',
              backgroundColor: `${color}10`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: color,
            }}
          >
            {icon}
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1F2937', mb: 0.5 }}>
              {title}
            </Typography>
            <Typography variant="caption" sx={{ color: '#6B7280', fontWeight: 500 }}>
              {description}
            </Typography>
          </Box>
          <IconButton 
            size="small" 
            sx={{ 
              color: '#9CA3AF',
              '&:hover': {
                color: '#CEA93A',
                backgroundColor: 'rgba(206, 169, 58, 0.1)',
              }
            }}
          >
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
      color: '#CEA93A',
      onClick: () => navigate('/mundos'),
    },
    {
      title: 'Gestionar Usuarios',
      description: 'Administrar usuarios',
      icon: <PeopleIcon />,
      color: '#6B7280',
      onClick: () => navigate('/users'),
    },
    {
      title: 'Ver Analytics',
      description: 'Métricas y estadísticas',
      icon: <AnalyticsIcon />,
      color: '#3B82F6',
      onClick: () => navigate('/analytics'),
    },
    {
      title: 'Configuración',
      description: 'Ajustes del sistema',
      icon: <SettingsIcon />,
      color: '#8B5CF6',
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
              color: '#1F2937',
              mb: 1,
              fontSize: { xs: '2rem', md: '3rem' }
            }}
          >
            Bienvenido de vuelta
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 400,
              color: '#6B7280',
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
              color: '#1F2937', 
              mb: 3,
              fontSize: { xs: '1.25rem', md: '1.5rem' }
            }}
          >
            Resumen
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <MinimalMetricCard
                title="Total de Usuarios"
                value={usersData?.count}
                icon={<PeopleIcon />}
                color="#3B82F6"
                isLoading={isLoadingUsers}
                onClick={() => navigate('/users')}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <MinimalMetricCard
                title="Mundos Creados"
                value={mundosData?.count}
                icon={<WorldIcon />}
                color="#CEA93A"
                isLoading={isLoadingMundos}
                onClick={() => navigate('/mundos')}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <MinimalMetricCard
                title="Playlists Activas"
                value={playlistsData?.count}
                icon={<PlaylistIcon />}
                color="#10B981"
                isLoading={isLoadingPlaylists}
                onClick={() => navigate('/playlists')}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <MinimalMetricCard
                title="Eventos Recientes"
                value={recentActivity.length}
                icon={<TrendingUpIcon />}
                color="#8B5CF6"
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
                color: '#1F2937', 
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
                color: '#1F2937', 
                mb: 3,
                fontSize: { xs: '1.25rem', md: '1.5rem' }
              }}
            >
              Actividad Reciente
            </Typography>
            
            <Paper 
              sx={{ 
                p: 3, 
                border: '1px solid #F3F4F6',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                borderRadius: '16px'
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
                          backgroundColor: activity.type === 'user' ? '#3B82F6' : 
                                         activity.type === 'mundo' ? '#CEA93A' : '#10B981',
                        }}
                      />
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" sx={{ color: '#1F2937', fontWeight: 500 }}>
                          {activity.message}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#6B7280' }}>
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
                  borderColor: '#E5E7EB',
                  color: '#6B7280',
                  borderRadius: '12px',
                  '&:hover': {
                    borderColor: '#CEA93A',
                    backgroundColor: 'rgba(206, 169, 58, 0.05)',
                    color: '#CEA93A',
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