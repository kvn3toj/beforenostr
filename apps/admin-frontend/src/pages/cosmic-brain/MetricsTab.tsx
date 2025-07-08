/**
 * 🌌 MetricsTab Component
 * 
 * Tab de métricas del AI Cosmic Brain Dashboard.
 * Muestra métricas filosóficas, salud del sistema y métricas de armonía.
 * 
 * Filosofía CoomÜnity:
 * - Bien Común: Visualización clara de métricas para el equipo
 * - Ayni: Balance entre información y usabilidad
 * - Neguentropía: Organización estructurada de datos
 * - Metanöia: Evolución continua de la visualización
 */

import React from 'react';
import { 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  LinearProgress, 
  Alert,
  Skeleton,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import { 
  TrendingUp, 
  TrendingDown, 
  TrendingFlat,
  Psychology,
  Health,
  Groups,
  Warning,
  CheckCircle,
  Error as ErrorIcon
} from '@mui/icons-material';
import { 
  usePhilosophyMetrics, 
  useSystemHealth, 
  useHarmonyMetrics 
} from '../../hooks/useCosmicBrainData';
import PhilosophyAlignmentTracker from '../../components/cosmic-brain/PhilosophyAlignmentTracker';

const MetricsTab: React.FC = () => {
  const { 
    data: philosophyMetrics, 
    isLoading: philosophyLoading, 
    error: philosophyError 
  } = usePhilosophyMetrics();

  const { 
    data: systemHealth, 
    isLoading: healthLoading, 
    error: healthError 
  } = useSystemHealth();

  const { 
    data: harmonyMetrics, 
    isLoading: harmonyLoading, 
    error: harmonyError 
  } = useHarmonyMetrics();

  // ============================================================================
  // 🎨 Render Functions
  // ============================================================================

  const renderPhilosophyMetrics = () => {
    if (philosophyLoading) {
      return (
        <Card>
          <CardContent>
            <Skeleton variant="text" height={40} />
            <Skeleton variant="rectangular" height={100} />
          </CardContent>
        </Card>
      );
    }

    if (philosophyError) {
      return (
        <Card>
          <CardContent>
            <Alert severity="error">
              Error cargando métricas filosóficas: {philosophyError.message}
            </Alert>
          </CardContent>
        </Card>
      );
    }

    if (!philosophyMetrics) {
      return (
        <Card>
          <CardContent>
            <Alert severity="info">
              No hay datos de métricas filosóficas disponibles
            </Alert>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card>
        <CardContent>
          <Box display="flex" alignItems="center" gap={2} mb={2}>
            <Psychology color="primary" />
            <Typography variant="h6" fontWeight="bold">
              Alineación Filosófica CoomÜnity
            </Typography>
            <Chip 
              label={`${philosophyMetrics.overallScore}%`} 
              color={philosophyMetrics.overallScore >= 80 ? 'success' : 
                     philosophyMetrics.overallScore >= 60 ? 'warning' : 'error'}
              size="small"
            />
          </Box>

          <LinearProgress 
            variant="determinate" 
            value={philosophyMetrics.overallScore} 
            sx={{ mb: 2, height: 8, borderRadius: 4 }}
          />

          <Grid container spacing={2}>
            {Object.entries(philosophyMetrics.principles).map(([key, principle]) => (
              <Grid item xs={12} md={6} key={key}>
                <Box>
                  <Typography variant="subtitle2" fontWeight="bold" textTransform="capitalize">
                    {key === 'bienComun' ? 'Bien Común' : 
                     key === 'negentropia' ? 'Neguentropía' : 
                     key === 'metanoia' ? 'Metanöia' : 
                     key === 'vocacion' ? 'Vocación' : key}
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={principle.score} 
                    color={principle.score >= 80 ? 'success' : 
                           principle.score >= 60 ? 'warning' : 'error'}
                    sx={{ mb: 1, height: 4 }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    {principle.description}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>

          {philosophyMetrics.recommendations.length > 0 && (
            <Box mt={2}>
              <Typography variant="subtitle2" fontWeight="bold" mb={1}>
                Recomendaciones
              </Typography>
              <List dense>
                {philosophyMetrics.recommendations.map((rec, index) => (
                  <ListItem key={index} divider>
                    <ListItemIcon>
                      <TrendingUp color="primary" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText 
                      primary={rec}
                      primaryTypographyProps={{ variant: 'body2' }}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
        </CardContent>
      </Card>
    );
  };

  const renderSystemHealth = () => {
    if (healthLoading) {
      return (
        <Card>
          <CardContent>
            <Skeleton variant="text" height={40} />
            <Skeleton variant="rectangular" height={100} />
          </CardContent>
        </Card>
      );
    }

    if (healthError) {
      return (
        <Card>
          <CardContent>
            <Alert severity="error">
              Error cargando salud del sistema: {healthError.message}
            </Alert>
          </CardContent>
        </Card>
      );
    }

    if (!systemHealth) {
      return (
        <Card>
          <CardContent>
            <Alert severity="info">
              No hay datos de salud del sistema disponibles
            </Alert>
          </CardContent>
        </Card>
      );
    }

    const getStatusIcon = (status: string) => {
      switch (status) {
        case 'healthy': return <CheckCircle color="success" />;
        case 'warning': return <Warning color="warning" />;
        case 'critical': return <ErrorIcon color="error" />;
        default: return <Warning color="action" />;
      }
    };

    return (
      <Card>
        <CardContent>
          <Box display="flex" alignItems="center" gap={2} mb={2}>
            <Health color="primary" />
            <Typography variant="h6" fontWeight="bold">
              Salud del Sistema
            </Typography>
            <Chip 
              label={`${systemHealth.overallHealth}%`} 
              color={systemHealth.overallHealth >= 80 ? 'success' : 
                     systemHealth.overallHealth >= 60 ? 'warning' : 'error'}
              size="small"
            />
          </Box>

          <LinearProgress 
            variant="determinate" 
            value={systemHealth.overallHealth} 
            sx={{ mb: 2, height: 8, borderRadius: 4 }}
          />

          <Grid container spacing={2}>
            {Object.entries(systemHealth.components).map(([key, component]) => (
              <Grid item xs={12} md={6} key={key}>
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  {getStatusIcon(component.status)}
                  <Typography variant="subtitle2" fontWeight="bold" textTransform="capitalize">
                    {key === 'database' ? 'Base de Datos' : 
                     key === 'api' ? 'API' : 
                     key === 'cache' ? 'Cache' : 
                     key === 'guardians' ? 'Guardianes' : key}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {key === 'database' && `Conexiones: ${component.connections}, Tiempo: ${component.responseTime}ms`}
                  {key === 'api' && `Requests: ${component.requests}, Tiempo: ${component.responseTime}ms`}
                  {key === 'cache' && `Hit Rate: ${component.hitRate}%, Memoria: ${component.memory}MB`}
                  {key === 'guardians' && `Activos: ${component.active}/${component.total}`}
                </Typography>
              </Grid>
            ))}
          </Grid>

          {systemHealth.alerts.length > 0 && (
            <Box mt={2}>
              <Typography variant="subtitle2" fontWeight="bold" mb={1}>
                Alertas del Sistema
              </Typography>
              {systemHealth.alerts.map((alert, index) => (
                <Alert 
                  key={index} 
                  severity={alert.level === 'error' ? 'error' : 
                           alert.level === 'warning' ? 'warning' : 'info'}
                  sx={{ mb: 1 }}
                >
                  {alert.message}
                </Alert>
              ))}
            </Box>
          )}
        </CardContent>
      </Card>
    );
  };

  const renderHarmonyMetrics = () => {
    if (harmonyLoading) {
      return (
        <Card>
          <CardContent>
            <Skeleton variant="text" height={40} />
            <Skeleton variant="rectangular" height={100} />
          </CardContent>
        </Card>
      );
    }

    if (harmonyError) {
      return (
        <Card>
          <CardContent>
            <Alert severity="error">
              Error cargando métricas de armonía: {harmonyError.message}
            </Alert>
          </CardContent>
        </Card>
      );
    }

    if (!harmonyMetrics) {
      return (
        <Card>
          <CardContent>
            <Alert severity="info">
              No hay datos de armonía disponibles
            </Alert>
          </CardContent>
        </Card>
      );
    }

    const getTrendIcon = (trend: string) => {
      switch (trend) {
        case 'up': return <TrendingUp color="success" />;
        case 'down': return <TrendingDown color="error" />;
        case 'stable': return <TrendingFlat color="action" />;
        default: return <TrendingFlat color="action" />;
      }
    };

    return (
      <Card>
        <CardContent>
          <Box display="flex" alignItems="center" gap={2} mb={2}>
            <Groups color="primary" />
            <Typography variant="h6" fontWeight="bold">
              Armonía del Equipo
            </Typography>
            <Chip 
              label={`${harmonyMetrics.overallHarmony}%`} 
              color={harmonyMetrics.overallHarmony >= 80 ? 'success' : 
                     harmonyMetrics.overallHarmony >= 60 ? 'warning' : 'error'}
              size="small"
            />
          </Box>

          <LinearProgress 
            variant="determinate" 
            value={harmonyMetrics.overallHarmony} 
            sx={{ mb: 2, height: 8, borderRadius: 4 }}
          />

          <Grid container spacing={2} mb={2}>
            {Object.entries(harmonyMetrics.teamMetrics).map(([key, value]) => (
              <Grid item xs={12} md={6} key={key}>
                <Box>
                  <Typography variant="subtitle2" fontWeight="bold" textTransform="capitalize">
                    {key === 'collaboration' ? 'Colaboración' : 
                     key === 'communication' ? 'Comunicación' : 
                     key === 'creativity' ? 'Creatividad' : 
                     key === 'wellbeing' ? 'Bienestar' : key}
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={value} 
                    color={value >= 80 ? 'success' : 
                           value >= 60 ? 'warning' : 'error'}
                    sx={{ mb: 1, height: 4 }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    {value}%
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>

          {harmonyMetrics.indicators.length > 0 && (
            <Box>
              <Typography variant="subtitle2" fontWeight="bold" mb={1}>
                Indicadores de Armonía
              </Typography>
              <List dense>
                {harmonyMetrics.indicators.map((indicator, index) => (
                  <ListItem key={index} divider>
                    <ListItemIcon>
                      {getTrendIcon(indicator.trend)}
                    </ListItemIcon>
                    <ListItemText 
                      primary={indicator.name}
                      secondary={indicator.description}
                      primaryTypographyProps={{ variant: 'body2' }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      {indicator.value}%
                    </Typography>
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
        </CardContent>
      </Card>
    );
  };

  // ============================================================================
  // 🎯 Main Render
  // ============================================================================

  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" mb={3}>
        📊 Métricas del AI Cosmic Brain
      </Typography>

      <Grid container spacing={3}>
        {/* Filosofía */}
        <Grid item xs={12} lg={6}>
          {renderPhilosophyMetrics()}
        </Grid>

        {/* Salud del Sistema */}
        <Grid item xs={12} lg={6}>
          {renderSystemHealth()}
        </Grid>

        {/* Armonía del Equipo */}
        <Grid item xs={12}>
          {renderHarmonyMetrics()}
        </Grid>

        {/* Componente Legacy (si existe) */}
        <Grid item xs={12}>
          <PhilosophyAlignmentTracker />
        </Grid>
      </Grid>
    </Box>
  );
};

export default MetricsTab;
