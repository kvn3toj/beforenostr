import React from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Grid,
  alpha,
  useTheme,
  Paper,
} from '@mui/material';
import {
  Balance,
  VolunteerActivism,
  Favorite,
  TrendingUp,
  SwapHoriz,
  Star,
} from '@mui/icons-material';

import { useReciprocidadMetrics } from '../../../hooks/home';

// 🎨 MINIMALIST METRIC ITEM - ARIA Design
const MinimalistMetricItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string | number;
  accentColor: string;
}> = ({ icon, label, value, accentColor }) => {
  const theme = useTheme();

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2,
        backgroundColor: theme.palette.background.paper, // SIEMPRE BLANCO
        borderColor: theme.palette.divider,
        borderRadius: theme.shape.borderRadius,
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        transition: 'box-shadow 0.2s ease-in-out',
        '&:hover': {
          boxShadow: `0 2px 8px ${alpha(accentColor, 0.08)}`, // Hover sutil
        },
      }}
    >
      <Box
        sx={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: theme.palette.background.paper, // Fondo blanco
          border: `2px solid ${alpha(accentColor, 0.2)}`, // Solo borde con color
          color: accentColor, // Solo el ícono con color
        }}
      >
        {icon}
      </Box>
      <Box sx={{ flex: 1 }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            color: accentColor, // Solo el valor con color
            mb: 0.5,
          }}
        >
          {value}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: theme.palette.text.secondary, // Texto neutro
            fontSize: '0.85rem',
            fontWeight: 500,
          }}
        >
          {label}
        </Typography>
      </Box>
    </Paper>
  );
};

export const ReciprocidadBalanceWidget: React.FC = () => {
  const { data: metrics, isLoading, error } = useReciprocidadMetrics();
  const theme = useTheme();

  if (isLoading) {
    return (
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        p: 4,
        backgroundColor: theme.palette.background.paper, // Fondo blanco
      }}>
        <CircularProgress
          sx={{
            color: theme.palette.primary.main, // Color del tema minimalista
          }}
        />
      </Box>
    );
  }

  if (error || !metrics) {
    return (
      <Alert
        severity="warning"
        sx={{
          backgroundColor: theme.palette.background.paper, // Fondo blanco
          color: theme.palette.text.primary,
          border: `1px solid ${alpha(theme.palette.warning.main, 0.3)}`,
          '& .MuiAlert-icon': {
            color: theme.palette.warning.main // Solo el ícono con color
          }
        }}
      >
        No se pudieron cargar las métricas de Reciprocidad.
      </Alert>
    );
  }

  const reciprocidadMetrics = [
    {
      icon: <Balance sx={{ fontSize: 20 }} />,
      label: 'Balance de Reciprocidad',
      value: `${(metrics.metricas.balance * 100).toFixed(0)}%`,
      accentColor: theme.palette.info.main,
    },
    {
      icon: <Favorite sx={{ fontSize: 20 }} />,
      label: 'Puntaje Reciprocidad',
      value: metrics.metricas.puntuacion.toFixed(1),
      accentColor: theme.palette.error.main,
    },
    {
      icon: <VolunteerActivism sx={{ fontSize: 20 }} />,
      label: 'Aportes al Bien Común',
      value: metrics.metricas.contribucionesBienComun,
      accentColor: theme.palette.success.main,
    },
    {
      icon: <TrendingUp sx={{ fontSize: 20 }} />,
      label: 'Crecimiento Semanal',
      value: `${metrics.metricas.crecimientoSemanal}%`,
      accentColor: theme.palette.warning.main,
    },
    {
      icon: <SwapHoriz sx={{ fontSize: 20 }} />,
      label: 'Transacciones',
      value: metrics.metricas.transaccionesTotales,
      accentColor: theme.palette.primary.main,
    },
     {
      icon: <Star sx={{ fontSize: 20 }} />,
      label: 'Méritos Obtenidos',
      value: metrics.metricas.meritos,
      accentColor: theme.palette.secondary.main,
    },
  ];

  return (
    <Box>
       <Typography
         variant="h6"
         sx={{
           mb: 3,
           fontWeight: 700,
           color: theme.palette.text.primary, // Texto neutro
           display: 'flex',
           alignItems: 'center',
           gap: 1,
         }}
       >
         <Balance sx={{ color: theme.palette.primary.main, fontSize: 20 }} />
         Balance de Reciprocidad Cósmico
       </Typography>

      <Grid container spacing={2}>
        {reciprocidadMetrics.map((metric, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <MinimalistMetricItem
              icon={metric.icon}
              label={metric.label}
              value={metric.value}
              accentColor={metric.accentColor}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
