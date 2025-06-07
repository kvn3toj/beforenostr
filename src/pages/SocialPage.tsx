import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Alert,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Button,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { 
  Share, 
  ThumbUp, 
  Comment, 
  Visibility,
  TrendingUp 
} from '@mui/icons-material';
import { socialService, SocialStats, SocialActivity } from '../services/social.service';

const fetchSocialStats = async (): Promise<SocialStats> => {
  return socialService.getSocialStats();
};

const fetchRecentActivity = async (): Promise<SocialActivity[]> => {
  return socialService.getRecentActivity();
};

export const SocialPage: React.FC = () => {
  const {
    data: socialStats,
    isLoading: isLoadingStats,
    error: statsError,
  } = useQuery({
    queryKey: ['social-stats'],
    queryFn: fetchSocialStats,
    retry: false,
  });

  const {
    data: recentActivity,
    isLoading: isLoadingActivity,
    error: activityError,
  } = useQuery({
    queryKey: ['social-activity'],
    queryFn: fetchRecentActivity,
    retry: false,
  });

  if (isLoadingStats) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (statsError) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          Error loading social data: {statsError instanceof Error ? 
            statsError.message : 'Unknown error'}
        </Alert>
      </Box>
    );
  }

  // Fallback values if no data
  const stats = socialStats || {
    totalPosts: 0,
    totalLikes: 0,
    totalComments: 0,
    totalShares: 0,
    totalUsers: 0,
    activeUsers: 0
  };

  const activities = recentActivity || [];

  const getActivityIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'share':
        return <Share sx={{ fontSize: 20, color: 'primary.main' }} />;
      case 'like':
        return <ThumbUp sx={{ fontSize: 20, color: 'success.main' }} />;
      case 'comment':
        return <Comment sx={{ fontSize: 20, color: 'info.main' }} />;
      default:
        return <Visibility sx={{ fontSize: 20 }} />;
    }
  };

  const getActivityDescription = (type: string) => {
    switch (type.toLowerCase()) {
      case 'share':
        return 'compartió contenido';
      case 'like':
        return 'le gustó contenido';
      case 'comment':
        return 'comentó en contenido';
      case 'view':
        return 'visualizó contenido';
      default:
        return 'realizó una acción';
    }
  };

  const getUserInitials = (user: any) => {
    if (user?.name) {
      return user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase();
    }
    if (user?.username) {
      return user.username.substring(0, 2).toUpperCase();
    }
    if (user?.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    return '??';
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
        Red Social
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Actividad social y colaboración entre usuarios
      </Typography>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Publicaciones
                  </Typography>
                  <Typography variant="h4" component="h2">
                    {stats.totalPosts.toLocaleString()}
                  </Typography>
                </Box>
                <Share sx={{ fontSize: 40, color: 'primary.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Me Gusta
                  </Typography>
                  <Typography variant="h4" component="h2">
                    {stats.totalLikes.toLocaleString()}
                  </Typography>
                </Box>
                <ThumbUp sx={{ fontSize: 40, color: 'success.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Comentarios
                  </Typography>
                  <Typography variant="h4" component="h2">
                    {stats.totalComments.toLocaleString()}
                  </Typography>
                </Box>
                <Comment sx={{ fontSize: 40, color: 'info.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Usuarios Activos
                  </Typography>
                  <Typography variant="h4" component="h2">
                    {stats.activeUsers.toLocaleString()}
                  </Typography>
                </Box>
                <TrendingUp sx={{ fontSize: 40, color: 'warning.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Activity */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Actividad Reciente
          </Typography>
          
          {isLoadingActivity ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress size={24} />
              <Typography variant="body2" sx={{ ml: 2 }}>
                Cargando actividad...
              </Typography>
            </Box>
          ) : activityError ? (
            <Alert severity="warning" sx={{ mt: 2 }}>
              No se pudo cargar la actividad reciente. Los datos sociales aún no están disponibles en el backend.
            </Alert>
          ) : activities.length > 0 ? (
            <List>
              {activities.map((activity) => (
                <ListItem key={activity.id}>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      {getUserInitials(activity.user)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {getActivityIcon(activity.type)}
                        <Typography variant="body2">
                          <strong>{activity.user?.name || activity.user?.username || activity.user?.email || 'Usuario'}</strong>{' '}
                          {getActivityDescription(activity.type)}
                        </Typography>
                        {activity.content && (
                          <Chip label={activity.content} size="small" variant="outlined" />
                        )}
                      </Box>
                    }
                    secondary={new Date(activity.createdAt).toLocaleDateString()}
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Alert severity="info" sx={{ mt: 2 }}>
              No hay actividad social registrada en el sistema.
            </Alert>
          )}

          {!activityError && (
            <Alert severity="info" sx={{ mt: 2 }}>
              Funcionalidad social en desarrollo. Próximamente: feed de actividades, sistema de seguimiento y notificaciones sociales.
            </Alert>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}; 