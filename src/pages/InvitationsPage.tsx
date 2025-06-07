import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Alert,
  Chip,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  CircularProgress,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  CardGiftcard, 
  Send, 
  CheckCircle, 
  Pending,
  ContentCopy 
} from '@mui/icons-material';
import { apiService } from '../services/api.service';

interface InvitationStats {
  total: number;
  pending: number;
  redeemed: number;
  expired: number;
  cancelled: number;
  totalUnitsDistributed: number;
  conversionRate: number;
}

const fetchInvitationStats = async (): Promise<InvitationStats> => {
  return apiService.get<InvitationStats>('/invitations/stats');
};

export const InvitationsPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    data: stats,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['invitations-stats'],
    queryFn: fetchInvitationStats,
  });

  // Mostrar mensaje de éxito si viene de crear invitación
  React.useEffect(() => {
    if (location.state?.message) {
      // Aquí podrías mostrar un toast o snackbar con el mensaje
      console.log(location.state.message);
    }
  }, [location.state]);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          Error loading invitations data: {error instanceof Error ? 
            error.message : 'Unknown error'}
        </Alert>
      </Box>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'REDEEMED':
        return 'success';
      case 'PENDING':
        return 'warning';
      case 'EXPIRED':
        return 'error';
      case 'CANCELLED':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'REDEEMED':
        return <CheckCircle sx={{ fontSize: 16 }} />;
      case 'PENDING':
        return <Pending sx={{ fontSize: 16 }} />;
      default:
        return <Send sx={{ fontSize: 16 }} />;
    }
  };

  const handleNewInvitation = () => {
    navigate('/invitations/new');
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
        <Box>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
            Sistema de Invitaciones
          </Typography>
          
          <Typography variant="body1" color="text.secondary">
            Gestión de invitaciones y gift cards para nuevos usuarios
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<CardGiftcard />}
          onClick={handleNewInvitation}
          size="large"
          sx={{ minWidth: 180 }}
        >
          Nueva Invitación
        </Button>
      </Box>

      {/* Mostrar mensaje de éxito si viene de creación */}
      {location.state?.message && (
        <Alert 
          severity={location.state.severity || 'success'} 
          sx={{ mb: 3 }}
          onClose={() => navigate('/invitations', { replace: true })}
        >
          {location.state.message}
        </Alert>
      )}

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Total Enviadas
                  </Typography>
                  <Typography variant="h4" component="h2">
                    {stats?.total || 0}
                  </Typography>
                </Box>
                <Send sx={{ fontSize: 40, color: 'primary.main' }} />
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
                    Canjeadas
                  </Typography>
                  <Typography variant="h4" component="h2">
                    {stats?.redeemed || 0}
                  </Typography>
                </Box>
                <CheckCircle sx={{ fontSize: 40, color: 'success.main' }} />
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
                    Pendientes
                  </Typography>
                  <Typography variant="h4" component="h2">
                    {stats?.pending || 0}
                  </Typography>
                </Box>
                <Pending sx={{ fontSize: 40, color: 'warning.main' }} />
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
                    Tasa de Conversión
                  </Typography>
                  <Typography variant="h4" component="h2">
                    {stats ? Math.round(stats.conversionRate) : 0}%
                  </Typography>
                </Box>
                <CardGiftcard sx={{ fontSize: 40, color: 'info.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Additional Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Distribución de Estados
              </Typography>
              
              <Box sx={{ mt: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Chip 
                      icon={<CheckCircle sx={{ fontSize: 16 }} />}
                      label="Canjeadas" 
                      color="success" 
                      size="small" 
                    />
                  </Box>
                  <Typography variant="body2">{stats?.redeemed || 0}</Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Chip 
                      icon={<Pending sx={{ fontSize: 16 }} />}
                      label="Pendientes" 
                      color="warning" 
                      size="small" 
                    />
                  </Box>
                  <Typography variant="body2">{stats?.pending || 0}</Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Chip 
                      icon={<Send sx={{ fontSize: 16 }} />}
                      label="Expiradas" 
                      color="error" 
                      size="small" 
                    />
                  </Box>
                  <Typography variant="body2">{stats?.expired || 0}</Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Chip 
                      icon={<Send sx={{ fontSize: 16 }} />}
                      label="Canceladas" 
                      color="error" 
                      size="small" 
                    />
                  </Box>
                  <Typography variant="body2">{stats?.cancelled || 0}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Unidades Distribuidas
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 2 }}>
                <Typography variant="h3" color="primary.main" fontWeight="bold">
                  {stats?.totalUnitsDistributed || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Unidades totales distribuidas
                </Typography>
                
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Promedio por invitación:{' '}
                    {stats && stats.total > 0 
                      ? Math.round(stats.totalUnitsDistributed / stats.total)
                      : 0
                    } unidades
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Actions and Info */}
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              Gestión de Invitaciones
            </Typography>
            <Button
              variant="outlined"
              startIcon={<CardGiftcard />}
              size="small"
              onClick={handleNewInvitation}
            >
              Crear Otra Invitación
            </Button>
          </Box>
          
          {stats && stats.total > 0 ? (
            <Box>
              <Alert severity="success" sx={{ mb: 2 }}>
                Sistema de invitaciones activo con {stats.total} invitaciones procesadas.
                Tasa de conversión actual: {Math.round(stats.conversionRate)}%
              </Alert>
              
              <Typography variant="body2" color="text.secondary">
                Para ver el detalle de invitaciones específicas, utiliza los endpoints de la API:
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText 
                    primary="GET /invitations/gift-cards/user/:userId"
                    secondary="Obtener gift cards de un usuario específico"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="POST /invitations/gift-cards"
                    secondary="Crear nueva gift card de invitación"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="POST /invitations/gift-cards/redeem"
                    secondary="Canjear una gift card (endpoint público)"
                  />
                </ListItem>
              </List>
            </Box>
          ) : (
            <Alert severity="info">
              No hay invitaciones registradas en el sistema. 
              Crea tu primera invitación usando el botón "Nueva Invitación".
            </Alert>
          )}

          <Alert severity="info" sx={{ mt: 2 }}>
            <Typography variant="body2">
              <strong>Funcionalidades disponibles:</strong>
            </Typography>
            <ul style={{ marginTop: 8, marginBottom: 0 }}>
              <li>Creación de gift cards con unidades personalizadas</li>
              <li>Sistema de canje público para nuevos usuarios</li>
              <li>Seguimiento de estados (enviado, canjeado, expirado, cancelado)</li>
              <li>Estadísticas de conversión y distribución</li>
              <li>Gestión por usuario individual</li>
            </ul>
          </Alert>
        </CardContent>
      </Card>
    </Box>
  );
}; 