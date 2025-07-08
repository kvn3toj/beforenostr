/**
 * 🌌 HarmonyTab Component
 * 
 * Tab de armonía del AI Cosmic Brain Dashboard.
 * Muestra métricas de armonía del equipo, estado de guardianes y bienestar general.
 * 
 * Filosofía CoomÜnity:
 * - Bien Común: Visualización del bienestar colectivo
 * - Ayni: Balance entre métricas individuales y colectivas
 * - Neguentropía: Organización armónica de la información
 * - Metanöia: Evolución continua hacia la armonía
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
  ListItemIcon,
  Avatar,
  Divider,
  Paper
} from '@mui/material';
import { 
  Groups,
  Psychology,
  Favorite,
  TrendingUp,
  TrendingDown,
  TrendingFlat,
  EmojiEvents,
  Lightbulb,
  Chat,
  HealthAndSafety,
  Security,
  CheckCircle,
  Warning,
  Error as ErrorIcon
} from '@mui/icons-material';
import { 
  useHarmonyMetrics, 
  useAllGuardians 
} from '../../hooks/useCosmicBrainData';
import GuardianStatusMonitor from '../../components/cosmic-brain/GuardianStatusMonitor';

const HarmonyTab: React.FC = () => {
  const { 
    data: harmonyMetrics, 
    isLoading: harmonyLoading, 
    error: harmonyError 
  } = useHarmonyMetrics();

  const { 
    data: guardians, 
    isLoading: guardiansLoading, 
    error: guardiansError 
  } = useAllGuardians();

  // ============================================================================
  // 🎨 Render Functions
  // ============================================================================

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp color="success" />;
      case 'down': return <TrendingDown color="error" />;
      case 'stable': return <TrendingFlat color="action" />;
      default: return <TrendingFlat color="action" />;
    }
  };

  const getMetricIcon = (metric: string) => {
    switch (metric) {
      case 'collaboration': return <Groups color="primary" />;
      case 'communication': return <Chat color="primary" />;
      case 'creativity': return <Lightbulb color="primary" />;
      case 'wellbeing': return <Favorite color="primary" />;
      default: return <Psychology color="primary" />;
    }
  };

  const getGuardianStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'error';
      case 'maintenance': return 'warning';
      case 'error': return 'error';
      default: return 'default';
    }
  };

  const getGuardianStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle color="success" />;
      case 'inactive': return <ErrorIcon color="error" />;
      case 'maintenance': return <Warning color="warning" />;
      case 'error': return <ErrorIcon color="error" />;
      default: return <Warning color="action" />;
    }
  };

  const renderHarmonyOverview = () => {
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

    return (
      <Card>
        <CardContent>
          <Box display="flex" alignItems="center" gap={2} mb={3}>
            <Groups color="primary" fontSize="large" />
            <Box>
              <Typography variant="h5" fontWeight="bold">
                Armonía General del Equipo
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Estado global de bienestar y colaboración
              </Typography>
            </Box>
            <Chip 
              label={`${harmonyMetrics.overallHarmony}%`} 
              color={harmonyMetrics.overallHarmony >= 80 ? 'success' : 
                     harmonyMetrics.overallHarmony >= 60 ? 'warning' : 'error'}
              size="large"
            />
          </Box>

          <LinearProgress 
            variant="determinate" 
            value={harmonyMetrics.overallHarmony} 
            sx={{ mb: 3, height: 12, borderRadius: 6 }}
          />

          <Grid container spacing={2}>
            {Object.entries(harmonyMetrics.teamMetrics).map(([key, value]) => (
              <Grid item xs={12} md={6} key={key}>
                <Paper elevation={1} sx={{ p: 2 }}>
                  <Box display="flex" alignItems="center" gap={2} mb={2}>
                    {getMetricIcon(key)}
                    <Typography variant="h6" fontWeight="bold" textTransform="capitalize">
                      {key === 'collaboration' ? 'Colaboración' : 
                       key === 'communication' ? 'Comunicación' : 
                       key === 'creativity' ? 'Creatividad' : 
                       key === 'wellbeing' ? 'Bienestar' : key}
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={value} 
                    color={value >= 80 ? 'success' : 
                           value >= 60 ? 'warning' : 'error'}
                    sx={{ mb: 1, height: 8, borderRadius: 4 }}
                  />
                  <Typography variant="h4" fontWeight="bold" color="primary">
                    {value}%
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    );
  };

  const renderHarmonyIndicators = () => {
    if (!harmonyMetrics || harmonyMetrics.indicators.length === 0) {
      return null;
    }

    return (
      <Card>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" mb={2}>
            📊 Indicadores de Armonía
          </Typography>
          <List>
            {harmonyMetrics.indicators.map((indicator, index) => (
              <React.Fragment key={index}>
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon>
                    {getTrendIcon(indicator.trend)}
                  </ListItemIcon>
                  <ListItemText 
                    primary={
                      <Box display="flex" alignItems="center" justifyContent="space-between">
                        <Typography variant="body1" fontWeight="bold">
                          {indicator.name}
                        </Typography>
                        <Chip 
                          label={`${indicator.value}%`}
                          size="small"
                          color={indicator.value >= 80 ? 'success' : 
                                 indicator.value >= 60 ? 'warning' : 'error'}
                        />
                      </Box>
                    }
                    secondary={indicator.description}
                  />
                </ListItem>
                {index < harmonyMetrics.indicators.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </CardContent>
      </Card>
    );
  };

  const renderGuardiansHarmony = () => {
    if (guardiansLoading) {
      return (
        <Card>
          <CardContent>
            <Skeleton variant="text" height={40} />
            <Skeleton variant="rectangular" height={150} />
          </CardContent>
        </Card>
      );
    }

    if (guardiansError) {
      return (
        <Card>
          <CardContent>
            <Alert severity="error">
              Error cargando estado de guardianes: {guardiansError.message}
            </Alert>
          </CardContent>
        </Card>
      );
    }

    if (!guardians || guardians.length === 0) {
      return (
        <Card>
          <CardContent>
            <Alert severity="info">
              No hay guardianes disponibles
            </Alert>
          </CardContent>
        </Card>
      );
    }

    const activeGuardians = guardians.filter(g => g.status === 'active');
    const avgHealthScore = guardians.reduce((acc, g) => acc + g.healthScore, 0) / guardians.length;

    return (
      <Card>
        <CardContent>
          <Box display="flex" alignItems="center" gap={2} mb={3}>
            <Security color="primary" fontSize="large" />
            <Box>
              <Typography variant="h6" fontWeight="bold">
                Armonía de los Guardianes
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Estado de salud y actividad de los guardianes AI
              </Typography>
            </Box>
          </Box>

          <Grid container spacing={2} mb={3}>
            <Grid item xs={12} md={4}>
              <Paper elevation={1} sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h3" fontWeight="bold" color="primary">
                  {activeGuardians.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Guardianes Activos
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper elevation={1} sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h3" fontWeight="bold" color="secondary">
                  {guardians.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Guardianes
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper elevation={1} sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h3" fontWeight="bold" color="success.main">
                  {Math.round(avgHealthScore)}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Salud Promedio
                </Typography>
              </Paper>
            </Grid>
          </Grid>

          <List>
            {guardians.map((guardian, index) => (
              <React.Fragment key={guardian.type}>
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon>
                    <Avatar sx={{ bgcolor: getGuardianStatusColor(guardian.status) }}>
                      {getGuardianStatusIcon(guardian.status)}
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText 
                    primary={
                      <Box display="flex" alignItems="center" justifyContent="space-between">
                        <Typography variant="body1" fontWeight="bold">
                          {guardian.name}
                        </Typography>
                        <Box display="flex" gap={1}>
                          <Chip 
                            label={guardian.status}
                            color={getGuardianStatusColor(guardian.status)}
                            size="small"
                          />
                          <Chip 
                            label={`${guardian.healthScore}%`}
                            color={guardian.healthScore >= 80 ? 'success' : 
                                   guardian.healthScore >= 60 ? 'warning' : 'error'}
                            size="small"
                          />
                        </Box>
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {guardian.description}
                        </Typography>
                        <LinearProgress 
                          variant="determinate" 
                          value={guardian.healthScore} 
                          sx={{ mt: 1, height: 4, borderRadius: 2 }}
                        />
                      </Box>
                    }
                  />
                </ListItem>
                {index < guardians.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </CardContent>
      </Card>
    );
  };

  const renderRecommendations = () => {
    if (!harmonyMetrics || harmonyMetrics.recommendations.length === 0) {
      return null;
    }

    return (
      <Card>
        <CardContent>
          <Box display="flex" alignItems="center" gap={2} mb={2}>
            <EmojiEvents color="primary" />
            <Typography variant="h6" fontWeight="bold">
              Recomendaciones para Mejorar la Armonía
            </Typography>
          </Box>
          <List>
            {harmonyMetrics.recommendations.map((recommendation, index) => (
              <ListItem key={index} sx={{ px: 0 }}>
                <ListItemIcon>
                  <Lightbulb color="warning" />
                </ListItemIcon>
                <ListItemText 
                  primary={recommendation}
                  primaryTypographyProps={{ variant: 'body1' }}
                />
              </ListItem>
            ))}
          </List>
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
        🎵 Armonía del AI Cosmic Brain
      </Typography>

      <Grid container spacing={3}>
        {/* Armonía General */}
        <Grid item xs={12}>
          {renderHarmonyOverview()}
        </Grid>

        {/* Indicadores de Armonía */}
        <Grid item xs={12} md={6}>
          {renderHarmonyIndicators()}
        </Grid>

        {/* Estado de Guardianes */}
        <Grid item xs={12} md={6}>
          {renderGuardiansHarmony()}
        </Grid>

        {/* Recomendaciones */}
        <Grid item xs={12}>
          {renderRecommendations()}
        </Grid>

        {/* Componente Legacy (si existe) */}
        <Grid item xs={12}>
          <GuardianStatusMonitor />
        </Grid>
      </Grid>
    </Box>
  );
};

export default HarmonyTab;
