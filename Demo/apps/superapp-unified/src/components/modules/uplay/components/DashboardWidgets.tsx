import React from 'react';
import { Grid, Card, CardContent, Typography, Box, CircularProgress, Alert } from '@mui/material';
import { motion, TargetAndTransition } from 'framer-motion';
import { useUPlayMetrics } from '../../../../hooks/modules/uplay/useUPlayMetrics';

// These are simplified versions of the original widgets.
// They can be expanded with real data from hooks later.

const MetricWidget: React.FC<{ title: string; children: React.ReactNode; whileHover?: TargetAndTransition }> = ({ title, children, whileHover = { scale: 1.03 } }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} whileHover={whileHover}>
    <Card sx={{ background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.01))', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>{title}</Typography>
        {children}
      </CardContent>
    </Card>
  </motion.div>
);

export const DashboardWidgets: React.FC = () => {
  const { metrics, isLoading, error } = useUPlayMetrics();

  if (isLoading) {
    return (
      <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Grid>
    );
  }

  if (error) {
    return (
      <Grid item xs={12}>
        <Alert severity="error">Error al cargar las métricas: {error.message}</Alert>
      </Grid>
    );
  }

  return (
    <>
      <Grid item xs={12} sm={6} md={4}>
        <MetricWidget title="Progreso Semanal">
          <Typography variant="h4">{metrics?.weeklyProgress.toFixed(1) || 0}%</Typography>
          <Typography variant="caption" color="text.secondary">Crecimiento esta semana</Typography>
        </MetricWidget>
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <MetricWidget title="Racha Actual">
          <Typography variant="h4">{metrics?.currentStreak || 0} 🔥</Typography>
          <Typography variant="caption" color="text.secondary">Días consecutivos</Typography>
        </MetricWidget>
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <MetricWidget title="Ranking Comunitario">
          <Typography variant="h4">#{metrics?.rank || 'N/A'}</Typography>
          <Typography variant="caption" color="text.secondary">de {metrics?.totalUsers || '...'} jugadores</Typography>
        </MetricWidget>
      </Grid>
    </>
  );
};
