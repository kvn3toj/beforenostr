import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  LinearProgress,
  Chip,
  IconButton,
  Tooltip,
  useTheme,
  useMediaQuery,
  Fade,
  Skeleton,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  SwapHoriz,
  AccountBalance,
  Group,
  LocalOffer,
  EmojiNature,
  Info,
  Refresh,
} from '@mui/icons-material';
import { useLetsAnalytics } from '../../../../hooks/useLetsIntegration';

interface LetsDashboardProps {
  userId?: string;
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  details?: string;
  color?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  details,
  color = 'text.primary',
}) => (
  <Paper
    variant="outlined"
    sx={{
      p: 2,
      borderRadius: '16px',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      transition: 'box-shadow 0.3s, border-color 0.3s',
      '&:hover': {
        boxShadow: '0 4px 12px 0 rgba(0,0,0,0.05)',
        borderColor: '#cbd5e1',
      },
    }}
  >
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
      {icon}
      <Typography variant="h6" sx={{ ml: 1, fontWeight: 600, color: 'text.secondary' }}>
        {title}
      </Typography>
    </Box>
    <Typography variant="h4" sx={{ fontWeight: 700, color, mt: 'auto' }}>
      {value}
    </Typography>
    {details && (
      <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
        {details}
      </Typography>
    )}
  </Paper>
);

const LetsDashboard: React.FC<LetsDashboardProps> = ({ userId }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [refreshKey, setRefreshKey] = useState(0);

  const {
    data: rawAnalytics,
    isLoading,
    error,
    refetch,
  } = useLetsAnalytics();

  // Adaptar analytics para compatibilidad con la estructura anterior
  const analytics = rawAnalytics ? {
    totalUnitsCirculating: rawAnalytics.totalUnitsInCirculation,
    dailyTransactions: rawAnalytics.totalTransactions,
    activeUsers: rawAnalytics.userEngagement.activeUsers,
    reciprocidadIndex: rawAnalytics.reciprocidadBalance.balanceRatio,
    topCategories: rawAnalytics.topCategories.map(cat => ({
      name: cat.category,
      count: cat.transactionCount
    })),
    userGrowth: {
      ...rawAnalytics.userEngagement,
      growthPercentage: rawAnalytics.userEngagement.retentionRate * 100, // Usar retentionRate como base
      newUsers: rawAnalytics.userEngagement.newUsersThisMonth,
    }
  } : null;

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
    refetch();
  };

  if (isLoading) {
    return (
      <Box sx={{ p: 2 }}>
        <Grid container spacing={3}>
          {[1, 2, 3, 4].map((item) => (
            <Grid item xs={12} sm={6} md={3} key={item}>
              <Paper>
                <Skeleton variant="text" width="60%" height={24} />
                <Skeleton variant="text" width="40%" height={32} />
                <Skeleton variant="rectangular" width="100%" height={8} sx={{ mt: 2 }} />
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography color="error" variant="h6">
          Error cargando estadísticas LETS
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {error.message}
        </Typography>
      </Box>
    );
  }

  if (!analytics) {
    return null;
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('es-ES').format(num);
  };

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('es-ES', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  };

  const getReciprocidadColor = (index: number) => {
    if (index >= 0.8) return theme.palette.success.main;
    if (index >= 0.6) return theme.palette.warning.main;
    return theme.palette.error.main;
  };

  const getReciprocidadLabel = (index: number) => {
    if (index >= 0.8) return 'Excelente';
    if (index >= 0.6) return 'Bueno';
    return 'Mejorable';
  };

  return (
    <Fade in timeout={600}>
      <Box sx={{ p: 2, backgroundColor: '#f8fafc', borderRadius: '16px' }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3,
          }}
        >
          <Box>
            <Typography variant="h5" fontWeight="bold" color="text.primary">
              Dashboard LETS
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Métricas clave del sistema de intercambio
            </Typography>
          </Box>
          <Tooltip title="Actualizar datos">
            <IconButton onClick={handleRefresh} color="primary">
              <Refresh />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Métricas principales */}
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Ünits Totales"
              value={formatCurrency(analytics.totalUnitsCirculating)}
              icon={<AccountBalance color="action" />}
              details="En circulación activa"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Transacciones"
              value={formatNumber(analytics.dailyTransactions)}
              icon={<SwapHoriz color="action" />}
              details="Últimas 24 horas"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Usuarios Activos"
              value={formatNumber(analytics.activeUsers)}
              icon={<Group color="action" />}
              details="Conectados hoy"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Balance Reciprocidad"
              value={`${(analytics.reciprocidadIndex * 100).toFixed(0)}%`}
              icon={<TrendingUp color="action" />}
              details={getReciprocidadLabel(analytics.reciprocidadIndex)}
              color={getReciprocidadColor(analytics.reciprocidadIndex)}
            />
          </Grid>
        </Grid>

        {/* Secciones secundarias */}
        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12} md={6}>
            <Paper variant="outlined" sx={{ p: 2, borderRadius: '16px', height: '100%' }}>
              <Typography variant="h6" fontWeight={600} color="text.secondary" gutterBottom>
                Crecimiento de Usuarios
              </Typography>
              <LinearProgress
                variant="determinate"
                value={(analytics.userGrowth.growthPercentage / 100) * 100} // Usar el valor directamente
                sx={{ height: 10, borderRadius: 5, mb: 1 }}
              />
              <Typography variant="body2" color="text.secondary">
                +{analytics.userGrowth.newUsers} nuevos usuarios este mes (
                {analytics.userGrowth.growthPercentage.toFixed(1)}% de crecimiento)
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper variant="outlined" sx={{ p: 2, borderRadius: '16px', height: '100%' }}>
              <Typography variant="h6" fontWeight={600} color="text.secondary" gutterBottom>
                Categorías Populares
              </Typography>
              <Box>
                {analytics.topCategories.map((cat, index) => (
                  <Chip
                    key={index}
                    label={`${cat.name} (${cat.count})`}
                    variant="outlined"
                    size="small"
                    sx={{ mr: 1, mb: 1 }}
                  />
                ))}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Fade>
  );
};

export default LetsDashboard;
