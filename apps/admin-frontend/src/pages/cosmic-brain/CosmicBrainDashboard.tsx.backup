/**
 * 🌌 CosmicBrainDashboard Component
 * 
 * Dashboard principal del AI Cosmic Brain para el Gamifier Admin.
 * Proporciona una vista unificada de métricas, misiones, armonía y estado general.
 * 
 * Filosofía CoomÜnity:
 * - Bien Común: Dashboard centralizado para el equipo
 * - Ayni: Balance entre información y acción
 * - Neguentropía: Organización clara y estructurada
 * - Metanöia: Evolución continua del sistema
 */

import React, { useState } from 'react';
import { 
  Box, 
  Tabs, 
  Tab, 
  Alert, 
  Skeleton,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  LinearProgress,
  Button,
  IconButton,
  Tooltip
} from '@mui/material';
import { 
  Refresh, 
  TrendingUp, 
  Warning, 
  CheckCircle,
  Psychology,
  Groups,
  Assignment
} from '@mui/icons-material';
import { 
  useCosmicBrainFullDashboard,
  useCosmicBrainStatus,
  useEvolutionTrigger,
  useInvalidateCosmicBrainQueries
} from '../../hooks/useCosmicBrainData';
import MetricsTab from './MetricsTab';
import MissionsTab from './MissionsTab';
import HarmonyTab from './HarmonyTab';
import CosmicDashboardHeader from '../../components/cosmic-brain/CosmicDashboardHeader';

const CosmicBrainDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);

  // Hooks para datos del dashboard
  const {
    dashboard,
    systemHealth,
    guardians,
    missions,
    isLoading,
    isError,
    error,
    refetch
  } = useCosmicBrainFullDashboard();

  const {
    status: systemStatus,
    score: systemScore,
    activeGuardians,
    totalGuardians,
    isHealthy,
    lastCheck
  } = useCosmicBrainStatus();

  // Hooks para acciones
  const evolutionTrigger = useEvolutionTrigger();
  const invalidateQueries = useInvalidateCosmicBrainQueries();

  // ============================================================================
  // 🎨 Render Functions
  // ============================================================================

  const renderOverviewCards = () => {
    if (isLoading) {
      return (
        <Grid container spacing={2} mb={3}>
          {[...Array(4)].map((_, index) => (
            <Grid item xs={12} md={3} key={index}>
              <Card>
                <CardContent>
                  <Skeleton variant="text" height={40} />
                  <Skeleton variant="rectangular" height={60} />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      );
    }

    if (!dashboard) return null;

    const overviewData = [
      {
        title: 'Usuarios Totales',
        value: dashboard.overview.totalUsers,
        icon: <Groups color="primary" />,
        color: 'primary'
      },
      {
        title: 'Guardianes Activos',
        value: `${dashboard.overview.activeGuardians}/${totalGuardians}`,
        icon: <CheckCircle color="success" />,
        color: 'success'
      },
      {
        title: 'Misiones Completadas',
        value: dashboard.overview.completedMissions,
        icon: <Assignment color="info" />,
        color: 'info'
      },
      {
        title: 'Salud del Sistema',
        value: `${dashboard.overview.systemHealth}%`,
        icon: <TrendingUp color="secondary" />,
        color: 'secondary'
      }
    ];

    return (
      <Grid container spacing={2} mb={3}>
        {overviewData.map((item, index) => (
          <Grid item xs={12} md={3} key={index}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                  {item.icon}
                  <Typography variant="h6" fontWeight="bold">
                    {item.title}
                  </Typography>
                </Box>
                <Typography variant="h3" fontWeight="bold" color={`${item.color}.main`}>
                  {item.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  };

  const renderSystemStatus = () => {
    if (isLoading) {
      return (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Skeleton variant="text" height={40} />
            <Skeleton variant="rectangular" height={80} />
          </CardContent>
        </Card>
      );
    }

    return (
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
            <Box display="flex" alignItems="center" gap={2}>
              <Psychology color="primary" fontSize="large" />
              <Box>
                <Typography variant="h6" fontWeight="bold">
                  Estado General del AI Cosmic Brain
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Última actualización: {lastCheck ? new Date(lastCheck).toLocaleString() : 'N/A'}
                </Typography>
              </Box>
            </Box>
            <Box display="flex" gap={1} alignItems="center">
              <Chip 
                label={isHealthy ? 'Saludable' : 'Necesita Atención'}
                color={isHealthy ? 'success' : 'warning'}
                icon={isHealthy ? <CheckCircle /> : <Warning />}
              />
              <Tooltip title="Actualizar estado">
                <IconButton onClick={() => refetch()} size="small">
                  <Refresh />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          <Grid container spacing={2} mb={2}>
            <Grid item xs={12} md={4}>
              <Typography variant="body2" color="text.secondary" mb={1}>
                Puntuación del Sistema
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={systemScore} 
                color={systemScore >= 80 ? 'success' : systemScore >= 60 ? 'warning' : 'error'}
                sx={{ height: 8, borderRadius: 4, mb: 1 }}
              />
              <Typography variant="h6" fontWeight="bold">
                {systemScore}%
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="body2" color="text.secondary" mb={1}>
                Guardianes Activos
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={(activeGuardians / totalGuardians) * 100} 
                color={activeGuardians === totalGuardians ? 'success' : 'warning'}
                sx={{ height: 8, borderRadius: 4, mb: 1 }}
              />
              <Typography variant="h6" fontWeight="bold">
                {activeGuardians}/{totalGuardians}
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="body2" color="text.secondary" mb={1}>
                Armonía General
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={dashboard?.overview.harmonyLevel || 0} 
                color={(dashboard?.overview.harmonyLevel || 0) >= 80 ? 'success' : 
                       (dashboard?.overview.harmonyLevel || 0) >= 60 ? 'warning' : 'error'}
                sx={{ height: 8, borderRadius: 4, mb: 1 }}
              />
              <Typography variant="h6" fontWeight="bold">
                {dashboard?.overview.harmonyLevel || 0}%
              </Typography>
            </Grid>
          </Grid>

          {/* Botón de Evolución (solo para admins) */}
          <Box display="flex" justifyContent="center" mt={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => evolutionTrigger.mutate()}
              disabled={evolutionTrigger.isLoading}
              startIcon={<TrendingUp />}
            >
              {evolutionTrigger.isLoading ? 'Iniciando Evolución...' : 'Trigger Evolución AI'}
            </Button>
          </Box>
        </CardContent>
      </Card>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 0:
        return <MetricsTab />;
      case 1:
        return <MissionsTab />;
      case 2:
        return <HarmonyTab />;
      default:
        return <MetricsTab />;
    }
  };

  // ============================================================================
  // 🎯 Main Render
  // ============================================================================

  if (isError) {
    return (
      <Box>
        <CosmicDashboardHeader />
        <Alert 
          severity="error" 
          action={
            <Button color="inherit" size="small" onClick={() => refetch()}>
              Reintentar
            </Button>
          }
          sx={{ mb: 3 }}
        >
          Error cargando el dashboard: {error?.message || 'Error desconocido'}
        </Alert>
      </Box>
    );
  }

  return (
    <Box>
      <CosmicDashboardHeader />
      
      {/* Estado del Sistema */}
      {renderSystemStatus()}

      {/* Cards de Resumen */}
      {renderOverviewCards()}

      {/* Navegación por Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs 
          value={activeTab} 
          onChange={(_, newValue) => setActiveTab(newValue)}
          variant="fullWidth"
        >
          <Tab 
            label="Métricas" 
            icon={<Psychology />}
            iconPosition="start"
          />
          <Tab 
            label="Misiones" 
            icon={<Assignment />}
            iconPosition="start"
          />
          <Tab 
            label="Armonía" 
            icon={<Groups />}
            iconPosition="start"
          />
        </Tabs>
      </Box>

      {/* Contenido del Tab Activo */}
      {renderTabContent()}

      {/* Notificación de Evolución */}
      {evolutionTrigger.isSuccess && (
        <Alert severity="success" sx={{ mt: 3 }}>
          ✨ Proceso de evolución iniciado exitosamente. 
          ID: {evolutionTrigger.data?.evolutionId}
        </Alert>
      )}

      {evolutionTrigger.isError && (
        <Alert severity="error" sx={{ mt: 3 }}>
          ❌ Error al iniciar evolución: {evolutionTrigger.error?.message}
        </Alert>
      )}
    </Box>
  );
};

export default CosmicBrainDashboard;
