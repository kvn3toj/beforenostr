/**
 * 🔄 LETS Integration Manager
 * 
 * Componente principal que coordina toda la experiencia LETS
 * Maneja onboarding, monitoreo de estado y acceso a funcionalidades
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Avatar,
  Chip,
  LinearProgress,
  Alert,
  Snackbar,
  IconButton,
  Tooltip,
  useTheme,
  alpha,
  CircularProgress,
  Fab
} from '@mui/material';
import {
  AccountBalance,
  TrendingUp,
  Notifications,
  School,
  Store,
  Handshake,
  Info,
  CheckCircle,
  Warning,
  Error,
  Refresh,
  Help
} from '@mui/icons-material';

import { LetsOnboarding } from './LetsOnboarding';
import {
  useUnitsWallet,
  useTrustRatings,
  useLetsNotifications,
  useLetsRecommendations,
  useReciprocidadBalance,
  useLetsAnalytics
} from '../../../hooks/useLetsIntegration';

interface LetsIntegrationManagerProps {
  userId: string;
  onNavigateToMarketplace?: () => void;
  onNavigateToKnowledgeExchange?: () => void;
  onNavigateToTransactions?: () => void;
}

export const LetsIntegrationManager: React.FC<LetsIntegrationManagerProps> = ({
  userId,
  onNavigateToMarketplace,
  onNavigateToKnowledgeExchange,
  onNavigateToTransactions
}) => {
  const theme = useTheme();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  // Hooks para datos LETS
  const { data: wallet, isLoading: walletLoading, error: walletError, refetch: refetchWallet } = useUnitsWallet(userId);
  const { data: trustRatings, isLoading: trustLoading } = useTrustRatings(userId);
  const { data: notifications, isLoading: notificationsLoading } = useLetsNotifications(userId);
  const { data: recommendations, isLoading: recommendationsLoading } = useLetsRecommendations(userId);
  const { data: analytics, isLoading: analyticsLoading } = useLetsAnalytics();
  const reciprocidadBalance = useReciprocidadBalance(userId);

  // Estado de usuario nuevo
  const isNewUser = !hasCompletedOnboarding && (!wallet || wallet.totalTransactions === 0);

  // Verificar si necesita onboarding al cargar
  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem(`lets_onboarding_completed_${userId}`);
    setHasCompletedOnboarding(!!hasSeenOnboarding);
    
    if (!hasSeenOnboarding && wallet && wallet.totalTransactions === 0) {
      setShowOnboarding(true);
    }
  }, [userId, wallet]);

  const handleCompleteOnboarding = () => {
    localStorage.setItem(`lets_onboarding_completed_${userId}`, 'true');
    setHasCompletedOnboarding(true);
    setSnackbarMessage('¡Bienvenido al Sistema LETS! 🎉');
    setSnackbarOpen(true);
  };

  const handleRefreshData = async () => {
    try {
      await refetchWallet();
      setSnackbarMessage('Datos actualizados correctamente');
      setSnackbarOpen(true);
    } catch (error) {
      setSnackbarMessage('Error al actualizar datos');
      setSnackbarOpen(true);
    }
  };

  // Calcular estadísticas del usuario
  const trustScore = trustRatings?.reduce((acc, rating) => acc + rating.rating, 0) / (trustRatings?.length || 1) * 20 || 0;
  const unreadNotifications = notifications?.filter(n => !n.read).length || 0;

  // Determinar estado de salud del sistema LETS del usuario
  const getSystemHealthStatus = () => {
    if (walletError) return { status: 'error', message: 'Error de conexión con el sistema' };
    if (!wallet) return { status: 'loading', message: 'Cargando datos...' };
    
    const issues = [];
    if (wallet.balance < -wallet.creditLimit * 0.8) issues.push('Balance bajo');
    if (trustScore < 20) issues.push('Necesita mejorar confianza');
    if (!reciprocidadBalance.isBalanced) issues.push('Balance Reciprocidad desequilibrado');
    
    if (issues.length === 0) return { status: 'success', message: 'Sistema funcionando perfectamente' };
    if (issues.length <= 1) return { status: 'warning', message: `Atención: ${issues[0]}` };
    return { status: 'error', message: `Múltiples problemas detectados` };
  };

  const systemHealth = getSystemHealthStatus();

  const renderQuickStats = () => (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      {/* Wallet Balance */}
      <Grid item xs={12} sm={6} md={3}>
        <Card 
          sx={{ 
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)}, ${alpha(theme.palette.primary.main, 0.05)})`,
            border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`
          }}
        >
          <CardContent sx={{ pb: '16px !important' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Avatar sx={{ bgcolor: 'primary.main', mr: 1, width: 32, height: 32 }}>
                <AccountBalance sx={{ fontSize: 18 }} />
              </Avatar>
              <Typography variant="body2" color="text.secondary">
                Balance Ünits
              </Typography>
            </Box>
            {walletLoading ? (
              <CircularProgress size={20} />
            ) : (
              <Typography variant="h6" color="primary">
                {wallet?.balance || 0} Ü
              </Typography>
            )}
            <Typography variant="caption" color="text.secondary">
              Límite: {wallet?.creditLimit || 0} Ü
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Trust Score */}
      <Grid item xs={12} sm={6} md={3}>
        <Card 
          sx={{ 
            background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.1)}, ${alpha(theme.palette.success.main, 0.05)})`,
            border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`
          }}
        >
          <CardContent sx={{ pb: '16px !important' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Avatar sx={{ bgcolor: 'success.main', mr: 1, width: 32, height: 32 }}>
                <TrendingUp sx={{ fontSize: 18 }} />
              </Avatar>
              <Typography variant="body2" color="text.secondary">
                Confianza
              </Typography>
            </Box>
            <Typography variant="h6" color="success.main">
              {Math.round(trustScore)}/100
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {trustRatings?.length || 0} calificaciones
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Reciprocidad Balance */}
      <Grid item xs={12} sm={6} md={3}>
        <Card 
          sx={{ 
            background: `linear-gradient(135deg, ${alpha(theme.palette.secondary.main, 0.1)}, ${alpha(theme.palette.secondary.main, 0.05)})`,
            border: `1px solid ${alpha(theme.palette.secondary.main, 0.2)}`
          }}
        >
          <CardContent sx={{ pb: '16px !important' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Avatar sx={{ bgcolor: 'secondary.main', mr: 1, width: 32, height: 32 }}>
                <Handshake sx={{ fontSize: 18 }} />
              </Avatar>
              <Typography variant="body2" color="text.secondary">
                Balance Reciprocidad
              </Typography>
            </Box>
            <Typography variant="h6" color={reciprocidadBalance.isBalanced ? 'success.main' : 'warning.main'}>
              {reciprocidadBalance.reciprocidadRatio.toFixed(2)}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {reciprocidadBalance.isBalanced ? 'Balanceado' : 'Desequilibrado'}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Notifications */}
      <Grid item xs={12} sm={6} md={3}>
        <Card 
          sx={{ 
            background: `linear-gradient(135deg, ${alpha(theme.palette.info.main, 0.1)}, ${alpha(theme.palette.info.main, 0.05)})`,
            border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`
          }}
        >
          <CardContent sx={{ pb: '16px !important' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Avatar sx={{ bgcolor: 'info.main', mr: 1, width: 32, height: 32 }}>
                <Notifications sx={{ fontSize: 18 }} />
              </Avatar>
              <Typography variant="body2" color="text.secondary">
                Notificaciones
              </Typography>
            </Box>
            <Typography variant="h6" color="info.main">
              {unreadNotifications}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Sin leer
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderSystemHealth = () => (
    <Alert 
      severity={systemHealth.status === 'loading' ? 'info' : systemHealth.status as any}
      action={
        <Tooltip title="Actualizar datos">
          <IconButton
            color="inherit"
            size="small"
            onClick={handleRefreshData}
            disabled={walletLoading}
          >
            <Refresh />
          </IconButton>
        </Tooltip>
      }
      sx={{ mb: 3 }}
    >
      <Typography variant="body2">
        {systemHealth.message}
      </Typography>
    </Alert>
  );

  const renderQuickActions = () => (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          🚀 Acciones Rápidas
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<Store />}
              onClick={onNavigateToMarketplace}
              sx={{ justifyContent: 'flex-start' }}
            >
              Explorar Marketplace
            </Button>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<School />}
              onClick={onNavigateToKnowledgeExchange}
              sx={{ justifyContent: 'flex-start' }}
            >
              Intercambios de Conocimiento
            </Button>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<AccountBalance />}
              onClick={onNavigateToTransactions}
              sx={{ justifyContent: 'flex-start' }}
            >
              Ver Transacciones
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );

  const renderRecommendations = () => {
    if (recommendationsLoading || !recommendations) return null;

    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            💡 Recomendaciones Personalizadas
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {reciprocidadBalance.recommendation}
          </Typography>
          
          {recommendations.recommendedListings?.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Servicios Recomendados:
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {recommendations.recommendedListings.slice(0, 3).map((listing, index) => (
                  <Chip 
                    key={index}
                    label={listing.title}
                    size="small"
                    variant="outlined"
                  />
                ))}
              </Box>
            </Box>
          )}

          {recommendations.suggestedConnections?.length > 0 && (
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Conexiones Sugeridas:
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {recommendations.suggestedConnections.slice(0, 3).map((connection, index) => (
                  <Chip 
                    key={index}
                    label={connection.name}
                    size="small"
                    variant="outlined"
                    avatar={<Avatar sx={{ width: 20, height: 20 }}>{connection.name[0]}</Avatar>}
                  />
                ))}
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>
    );
  };

  if (isNewUser && !hasCompletedOnboarding) {
    return (
      <>
        <Box sx={{ textAlign: 'center', py: 6 }}>
          <Avatar
            sx={{
              width: 120,
              height: 120,
              bgcolor: 'primary.main',
              mx: 'auto',
              mb: 3
            }}
          >
            <Handshake sx={{ fontSize: 60 }} />
          </Avatar>
          <Typography variant="h4" gutterBottom color="primary">
            ¡Bienvenido al Sistema LETS!
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}>
            Estás a punto de unirte a una comunidad de intercambio basada en confianza y reciprocidad. 
            Te guiaremos paso a paso para que entiendas cómo funciona.
          </Typography>
          <Button
            variant="contained"
            size="large"
            startIcon={<School />}
            onClick={() => setShowOnboarding(true)}
          >
            Comenzar Tutorial
          </Button>
        </Box>

        <LetsOnboarding
          open={showOnboarding}
          onClose={() => setShowOnboarding(false)}
          onComplete={handleCompleteOnboarding}
          userId={userId}
        />
      </>
    );
  }

  return (
    <Box>
      {/* System Health Status */}
      {renderSystemHealth()}

      {/* Quick Stats */}
      {renderQuickStats()}

      {/* Quick Actions */}
      {renderQuickActions()}

      {/* Recommendations */}
      {renderRecommendations()}

      {/* Help FAB */}
      <Fab
        color="primary"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={() => setShowOnboarding(true)}
      >
        <Help />
      </Fab>

      {/* Onboarding Dialog */}
      <LetsOnboarding
        open={showOnboarding}
        onClose={() => setShowOnboarding(false)}
        onComplete={handleCompleteOnboarding}
        userId={userId}
      />

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </Box>
  );
};

export default LetsIntegrationManager; 