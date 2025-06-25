import React from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Grid,
  alpha,
  useTheme
} from '@mui/material';
import {
  Balance,
  VolunteerActivism,
  Favorite,
  TrendingUp,
  SwapHoriz,
  Star,
} from '@mui/icons-material';

import { useAyniMetrics } from '../../../hooks/home/useAyniMetrics';

// Un componente de tarjeta de métrica reutilizable
const MetricItem: React.FC<{ icon: React.ReactNode; label: string; value: string | number; color: string }> = ({ icon, label, value, color }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <Box
        sx={{
          width: 48,
          height: 48,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: alpha(color, 0.1),
          color,
        }}
      >
        {icon}
      </Box>
      <Box>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {value}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {label}
        </Typography>
      </Box>
    </Box>
  );
};

export const AyniBalanceWidget: React.FC = () => {
  const { data: metrics, isLoading, error } = useAyniMetrics();
  const theme = useTheme();

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !metrics) {
    return (
      <Alert severity="warning">
        No se pudieron cargar las métricas de Ayni.
      </Alert>
    );
  }

  const ayniMetrics = [
    {
      icon: <Balance sx={{ fontSize: 24 }} />,
      label: 'Balance Ayni',
      value: `${(metrics.balanceAyni * 100).toFixed(0)}%`,
      color: theme.palette.primary.main,
    },
    {
      icon: <Favorite sx={{ fontSize: 24 }} />,
      label: 'Puntaje Reciprocidad',
      value: metrics.reciprocityScore.toFixed(1),
      color: theme.palette.success.main,
    },
    {
      icon: <VolunteerActivism sx={{ fontSize: 24 }} />,
      label: 'Aportes al Bien Común',
      value: metrics.bienComunContributions,
      color: theme.palette.error.main,
    },
    {
      icon: <TrendingUp sx={{ fontSize: 24 }} />,
      label: 'Crecimiento Semanal',
      value: `${metrics.weeklyGrowth}%`,
      color: theme.palette.info.main,
    },
    {
      icon: <SwapHoriz sx={{ fontSize: 24 }} />,
      label: 'Transacciones',
      value: metrics.totalTransactions,
      color: theme.palette.warning.main,
    },
     {
      icon: <Star sx={{ fontSize: 24 }} />,
      label: 'Méritos Obtenidos',
      value: metrics.meritos,
      color: theme.palette.secondary.main,
    },
  ];

  return (
    <Box>
       <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        Balance Ayni
      </Typography>
      <Grid container spacing={{ xs: 2, md: 3 }} >
        {ayniMetrics.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.label}>
            <MetricItem {...item} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
