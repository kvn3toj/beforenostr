import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Grid,
  Typography,
  LinearProgress,
  Chip,
  Box,
  Paper,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  IconButton,
  Tooltip,
  Divider,
} from '@mui/material';
import {
  TrendingUp,
  Psychology,
  Code,
  Speed,
  Favorite,
  AutoAwesome,
  Timeline,
  Refresh,
  Warning,
  CheckCircle,
} from '@mui/icons-material';

// 🌌 TIPOS CÓSMICOS PARA EL DASHBOARD
interface CosmicMetrics {
  // 📊 Métricas de Desarrollo
  development: {
    velocity: number; // Velocidad de desarrollo (0-100)
    qualityScore: number; // Puntuación de calidad (0-100)
    technicalDebt: number; // Deuda técnica (0-100, menor es mejor)
    testCoverage: number; // Cobertura de tests (0-100)
  };

  // 🧠 Métricas Filosóficas
  philosophy: {
    ayniScore: number; // Puntuación de reciprocidad (0-100)
    bienComunScore: number; // Puntuación bien común (0-100)
    harmonyLevel: number; // Nivel de armonía (0-100)
    consciousnessIndex: number; // Índice de consciencia (0-100)
  };

  // 🎯 Métricas de Impacto
  impact: {
    userSatisfaction: number; // Satisfacción del usuario (0-100)
    communityGrowth: number; // Crecimiento de comunidad (0-100)
    systemHealth: number; // Salud del sistema (0-100)
    evolutionRate: number; // Tasa de evolución (0-100)
  };

  // ⏰ Métricas Temporales
  temporal: {
    lastUpdate: Date;
    syncStatus: 'synced' | 'syncing' | 'error';
    nextSync: Date;
    uptime: number; // Tiempo activo en horas
  };
}

interface RecentActivity {
  id: string;
  type: 'philosophy' | 'development' | 'quality' | 'impact';
  title: string;
  description: string;
  score: number;
  timestamp: Date;
  guardian: string;
}

// 🎨 COMPONENTE PRINCIPAL DEL DASHBOARD CÓSMICO
export const CosmicMetricsDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<CosmicMetrics | null>(null);
  const [activities, setActivities] = useState<RecentActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // 🔄 Función para cargar métricas cósmicas
  const loadCosmicMetrics = async () => {
    try {
      setIsLoading(true);

      // Llamada al endpoint de métricas cósmicas
      const response = await fetch('/api/cosmic-metrics');
      const data = await response.json();

      setMetrics(data.metrics);
      setActivities(data.recentActivities);
    } catch (error) {
      console.error('🌌 Error loading cosmic metrics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 🔄 Auto-refresh cada 30 segundos (sincronización cósmica)
  useEffect(() => {
    loadCosmicMetrics();

    if (autoRefresh) {
      const interval = setInterval(loadCosmicMetrics, 30000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  // 🎨 Función para obtener color basado en puntuación
  const getScoreColor = (score: number) => {
    if (score >= 80) return '#4caf50'; // Verde cósmico
    if (score >= 60) return '#ff9800'; // Ámbar cósmico
    return '#f44336'; // Rojo cósmico
  };

  // 🎯 Función para obtener ícono por tipo de actividad
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'philosophy':
        return <Psychology sx={{ color: '#9c27b0' }} />;
      case 'development':
        return <Code sx={{ color: '#2196f3' }} />;
      case 'quality':
        return <AutoAwesome sx={{ color: '#ff9800' }} />;
      case 'impact':
        return <Favorite sx={{ color: '#e91e63' }} />;
      default:
        return <Timeline />;
    }
  };

  if (isLoading || !metrics) {
    return (
      <Card
        sx={{
          height: '400px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box textAlign="center">
          <AutoAwesome sx={{ fontSize: 48, color: '#9c27b0', mb: 2 }} />
          <Typography variant="h6">
            🌌 Sincronizando con el Cosmos...
          </Typography>
        </Box>
      </Card>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* 🌟 HEADER CÓSMICO */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Box>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 'bold',
              background: 'linear-gradient(45deg, #9c27b0, #3f51b5)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
            }}
          >
            🌌 Cosmic Metrics Dashboard
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Pulso del Ecosistema CoomÜnity • Última actualización:{' '}
            {new Date(metrics.temporal.lastUpdate).toLocaleTimeString()}
          </Typography>
        </Box>

        <Box display="flex" gap={1}>
          <Chip
            icon={
              metrics.temporal.syncStatus === 'synced' ? (
                <CheckCircle />
              ) : (
                <Warning />
              )
            }
            label={
              metrics.temporal.syncStatus === 'synced'
                ? 'Sincronizado'
                : 'Sincronizando'
            }
            color={
              metrics.temporal.syncStatus === 'synced' ? 'success' : 'warning'
            }
          />
          <Tooltip title="Actualizar métricas">
            <IconButton onClick={loadCosmicMetrics} color="primary">
              <Refresh />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* 📊 MÉTRICAS DE DESARROLLO */}
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              height: '100%',
              background: 'linear-gradient(135deg, #2196f3 0%, #21cbf3 100%)',
              color: 'white',
            }}
          >
            <CardHeader title="🔧 Métricas de Desarrollo" avatar={<Code />} />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2">Velocidad</Typography>
                  <LinearProgress
                    variant="determinate"
                    value={metrics.development.velocity}
                    sx={{ mt: 1, height: 8, borderRadius: 4 }}
                  />
                  <Typography variant="h6">
                    {metrics.development.velocity}%
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">Calidad</Typography>
                  <LinearProgress
                    variant="determinate"
                    value={metrics.development.qualityScore}
                    sx={{ mt: 1, height: 8, borderRadius: 4 }}
                  />
                  <Typography variant="h6">
                    {metrics.development.qualityScore}%
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">Cobertura Tests</Typography>
                  <LinearProgress
                    variant="determinate"
                    value={metrics.development.testCoverage}
                    sx={{ mt: 1, height: 8, borderRadius: 4 }}
                  />
                  <Typography variant="h6">
                    {metrics.development.testCoverage}%
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">Deuda Técnica</Typography>
                  <LinearProgress
                    variant="determinate"
                    value={100 - metrics.development.technicalDebt}
                    sx={{ mt: 1, height: 8, borderRadius: 4 }}
                    color="warning"
                  />
                  <Typography variant="h6">
                    {metrics.development.technicalDebt}%
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* 🧠 MÉTRICAS FILOSÓFICAS */}
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              height: '100%',
              background: 'linear-gradient(135deg, #9c27b0 0%, #673ab7 100%)',
              color: 'white',
            }}
          >
            <CardHeader
              title="🧠 Métricas Filosóficas"
              avatar={<Psychology />}
            />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2">Ayni (Reciprocidad)</Typography>
                  <LinearProgress
                    variant="determinate"
                    value={metrics.philosophy.ayniScore}
                    sx={{ mt: 1, height: 8, borderRadius: 4 }}
                  />
                  <Typography variant="h6">
                    {metrics.philosophy.ayniScore}%
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">Bien Común</Typography>
                  <LinearProgress
                    variant="determinate"
                    value={metrics.philosophy.bienComunScore}
                    sx={{ mt: 1, height: 8, borderRadius: 4 }}
                  />
                  <Typography variant="h6">
                    {metrics.philosophy.bienComunScore}%
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">Armonía</Typography>
                  <LinearProgress
                    variant="determinate"
                    value={metrics.philosophy.harmonyLevel}
                    sx={{ mt: 1, height: 8, borderRadius: 4 }}
                  />
                  <Typography variant="h6">
                    {metrics.philosophy.harmonyLevel}%
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">Consciencia</Typography>
                  <LinearProgress
                    variant="determinate"
                    value={metrics.philosophy.consciousnessIndex}
                    sx={{ mt: 1, height: 8, borderRadius: 4 }}
                  />
                  <Typography variant="h6">
                    {metrics.philosophy.consciousnessIndex}%
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* 🎯 MÉTRICAS DE IMPACTO */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardHeader
              title="🎯 Métricas de Impacto Cósmico"
              avatar={<TrendingUp />}
            />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={3}>
                  <Paper
                    sx={{
                      p: 2,
                      textAlign: 'center',
                      background: 'linear-gradient(45deg, #4caf50, #8bc34a)',
                    }}
                  >
                    <Typography
                      variant="h4"
                      sx={{ color: 'white', fontWeight: 'bold' }}
                    >
                      {metrics.impact.userSatisfaction}%
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'white' }}>
                      Satisfacción Usuario
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={3}>
                  <Paper
                    sx={{
                      p: 2,
                      textAlign: 'center',
                      background: 'linear-gradient(45deg, #ff9800, #ffc107)',
                    }}
                  >
                    <Typography
                      variant="h4"
                      sx={{ color: 'white', fontWeight: 'bold' }}
                    >
                      {metrics.impact.communityGrowth}%
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'white' }}>
                      Crecimiento Comunidad
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={3}>
                  <Paper
                    sx={{
                      p: 2,
                      textAlign: 'center',
                      background: 'linear-gradient(45deg, #e91e63, #f06292)',
                    }}
                  >
                    <Typography
                      variant="h4"
                      sx={{ color: 'white', fontWeight: 'bold' }}
                    >
                      {metrics.impact.systemHealth}%
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'white' }}>
                      Salud del Sistema
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={3}>
                  <Paper
                    sx={{
                      p: 2,
                      textAlign: 'center',
                      background: 'linear-gradient(45deg, #673ab7, #9c27b0)',
                    }}
                  >
                    <Typography
                      variant="h4"
                      sx={{ color: 'white', fontWeight: 'bold' }}
                    >
                      {metrics.impact.evolutionRate}%
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'white' }}>
                      Tasa de Evolución
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* 📋 ACTIVIDAD RECIENTE */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardHeader
              title="📋 Actividad Cósmica Reciente"
              avatar={<Timeline />}
            />
            <CardContent sx={{ maxHeight: '400px', overflow: 'auto' }}>
              <List>
                {activities.map((activity, index) => (
                  <React.Fragment key={activity.id}>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: getScoreColor(activity.score) }}>
                          {getActivityIcon(activity.type)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={activity.title}
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              {activity.description}
                            </Typography>
                            <Box
                              display="flex"
                              justifyContent="space-between"
                              mt={1}
                            >
                              <Chip
                                label={`${activity.score}%`}
                                size="small"
                                sx={{
                                  bgcolor: getScoreColor(activity.score),
                                  color: 'white',
                                }}
                              />
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {activity.guardian} •{' '}
                                {new Date(
                                  activity.timestamp
                                ).toLocaleTimeString()}
                              </Typography>
                            </Box>
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < activities.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* ⏰ INFORMACIÓN DEL SISTEMA */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Grid container spacing={2} alignItems="center">
                <Grid item>
                  <Speed sx={{ fontSize: 32, color: '#4caf50' }} />
                </Grid>
                <Grid item xs>
                  <Typography variant="h6">Sistema Operativo</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Uptime: {Math.floor(metrics.temporal.uptime)} horas •
                    Próxima sincronización:{' '}
                    {new Date(metrics.temporal.nextSync).toLocaleTimeString()} •
                    Estado:{' '}
                    {metrics.temporal.syncStatus === 'synced'
                      ? '🟢 Sincronizado'
                      : '🟡 Sincronizando'}
                  </Typography>
                </Grid>
                <Grid item>
                  <Chip
                    label={`🌌 Cosmic Engine v${process.env.REACT_APP_VERSION || '1.0.0'}`}
                    color="primary"
                    variant="outlined"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CosmicMetricsDashboard;
