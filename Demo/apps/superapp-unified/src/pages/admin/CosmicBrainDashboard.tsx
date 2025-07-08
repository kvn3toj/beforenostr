import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Tabs,
  Tab,
  Alert,
  CircularProgress,
  Chip,
  Button,
  Stack,
  Divider,
  IconButton,
  Tooltip,
  alpha,
  useTheme,
  Paper,
  LinearProgress,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Psychology as PsychologyIcon,
  MonitorHeart as HealthIcon,
  Assignment as MissionsIcon,
  Tune as HarmonyIcon,
  AutoAwesome as EvolutionIcon,
  Refresh as RefreshIcon,
  Security as GuardiansIcon,
  Analytics as AnalyticsIcon,
  Settings as SettingsIcon,
  Timeline as TimelineIcon,
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
} from '@mui/icons-material';

// 🌌 COSMIC DESIGN SYSTEM IMPORTS
import { CosmicCard, RevolutionaryWidget } from '../../design-system';
import { useCosmicBrainData } from '../../hooks/useCosmicBrainData';
import { useAuth } from '../../contexts/AuthContext';
import { CosmicBrainService } from '../../services/cosmic-brain.service';

// 🎯 COMPONENTS IMPORTS
import CosmicPerformanceAuditor from '../../components/admin/CosmicPerformanceAuditor';
import { CosmicAnalyticsDashboard } from '../../components/advanced/CosmicAnalyticsDashboard';

/**
 * 🌌 AI COSMIC BRAIN DASHBOARD
 *
 * Dashboard completo para administradores del sistema AI Cosmic Brain
 * que integra todos los componentes cosmic brain con el backend NestJS.
 *
 * Características:
 * - Dashboard principal con métricas en tiempo real
 * - Gestión de guardianes (ATLAS, CRONOS, COSMOS, etc.)
 * - Métricas filosóficas (Bien Común, Ayni, Metanöia, etc.)
 * - Salud del sistema y monitoreo
 * - Misiones activas y gestión
 * - Armonía cósmica y resonancia
 * - Trigger de evolución del sistema
 */

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`cosmic-brain-tabpanel-${index}`}
      aria-labelledby={`cosmic-brain-tab-${index}`}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
};

const CosmicBrainDashboard: React.FC = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [showPerformanceAuditor, setShowPerformanceAuditor] = useState(false);
  const [isEvolutionTriggering, setIsEvolutionTriggering] = useState(false);

  // 🎣 Hook principal para datos del cosmic brain
  const {
    dashboardData,
    guardians,
    philosophyMetrics,
    systemHealth,
    missions,
    harmonyMetrics,
    isLoading,
    isError,
    error,
    refreshData,
    lastUpdateTimestamp,
    isAutoRefreshActive,
    pauseAutoRefresh,
    resumeAutoRefresh,
  } = useCosmicBrainData();

  // 🔒 Verificar permisos de administrador
  const isAdmin = user?.roles?.includes('admin');

  useEffect(() => {
    if (!isAdmin) {
      console.warn(
        'User does not have admin privileges for Cosmic Brain Dashboard'
      );
    }
  }, [isAdmin]);

  // 🌟 Trigger evolución del sistema
  const handleTriggerEvolution = async () => {
    setIsEvolutionTriggering(true);
    try {
      const result = await CosmicBrainService.triggerEvolution();
      console.log('Evolution triggered:', result);
      // Refresh data after evolution
      await refreshData();
    } catch (error) {
      console.error('Error triggering evolution:', error);
    } finally {
      setIsEvolutionTriggering(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // 🎨 Calcular métricas generales para el header
  const overallSystemScore = systemHealth?.overall || 0;
  const activeGuardians =
    guardians?.filter((g) => g.status === 'active').length || 0;
  const totalGuardians = guardians?.length || 0;
  const activeMissions =
    missions?.filter((m) => m.status === 'in_progress').length || 0;
  const philosophyAlignment = philosophyMetrics?.overallAlignment || 0;
  const cosmicHarmony = harmonyMetrics?.overall || 0;

  if (!isAdmin) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            🔒 Acceso Restringido
          </Typography>
          <Typography variant="body2">
            Esta página requiere permisos de administrador. Por favor, inicia
            sesión con una cuenta de administrador.
          </Typography>
        </Alert>
      </Container>
    );
  }

  if (isError) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            🚨 Error de Conexión con Cosmic Brain
          </Typography>
          <Typography variant="body2">
            {error?.message ||
              'No se pudo conectar con el backend del Cosmic Brain'}
          </Typography>
          <Button
            variant="contained"
            onClick={refreshData}
            sx={{ mt: 2 }}
            startIcon={<RefreshIcon />}
          >
            Reintentar Conexión
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* 🌌 HEADER PRINCIPAL */}
      <Box sx={{ mb: 4 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 2,
          }}
        >
          <Box>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 'bold',
                background:
                  'linear-gradient(135deg, #392768, #5C2483, #E1BEE7)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 1,
              }}
            >
              🌌 AI Cosmic Brain Dashboard
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Sistema de Administración Cósmica - CoomÜnity SuperApp
            </Typography>
          </Box>

          <Stack direction="row" spacing={2} alignItems="center">
            <Tooltip
              title={
                isAutoRefreshActive
                  ? 'Pausar actualización automática'
                  : 'Reanudar actualización automática'
              }
            >
              <IconButton
                onClick={
                  isAutoRefreshActive ? pauseAutoRefresh : resumeAutoRefresh
                }
                color={isAutoRefreshActive ? 'success' : 'warning'}
              >
                {isAutoRefreshActive ? <CheckCircleIcon /> : <WarningIcon />}
              </IconButton>
            </Tooltip>

            <Tooltip title="Actualizar datos">
              <IconButton onClick={refreshData} disabled={isLoading}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Performance Auditor">
              <IconButton
                onClick={() =>
                  setShowPerformanceAuditor(!showPerformanceAuditor)
                }
                color={showPerformanceAuditor ? 'primary' : 'default'}
              >
                <AnalyticsIcon />
              </IconButton>
            </Tooltip>

            <Button
              variant="contained"
              onClick={handleTriggerEvolution}
              disabled={isEvolutionTriggering}
              startIcon={
                isEvolutionTriggering ? (
                  <CircularProgress size={20} />
                ) : (
                  <EvolutionIcon />
                )
              }
              sx={{
                background: 'linear-gradient(135deg, #392768, #5C2483)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5C2483, #392768)',
                },
              }}
            >
              {isEvolutionTriggering ? 'Evolucionando...' : 'Trigger Evolution'}
            </Button>
          </Stack>
        </Box>

        {/* 🎯 MÉTRICAS PRINCIPALES */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={3}>
            <CosmicCard element="espiritu" variant="elevated" enableGlow>
              <CardContent sx={{ textAlign: 'center' }}>
                <HealthIcon sx={{ fontSize: 40, color: '#E1BEE7', mb: 1 }} />
                <Typography variant="h4" fontWeight="bold" color="#392768">
                  {overallSystemScore}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Salud del Sistema
                </Typography>
                <Chip
                  label={
                    overallSystemScore >= 90
                      ? 'Excelente'
                      : overallSystemScore >= 70
                        ? 'Bueno'
                        : 'Atención'
                  }
                  size="small"
                  color={
                    overallSystemScore >= 90
                      ? 'success'
                      : overallSystemScore >= 70
                        ? 'warning'
                        : 'error'
                  }
                  sx={{ mt: 1 }}
                />
              </CardContent>
            </CosmicCard>
          </Grid>

          <Grid item xs={12} md={3}>
            <CosmicCard element="fuego" variant="elevated" enableGlow>
              <CardContent sx={{ textAlign: 'center' }}>
                <GuardiansIcon sx={{ fontSize: 40, color: '#FF6B35', mb: 1 }} />
                <Typography variant="h4" fontWeight="bold" color="#FF6B35">
                  {activeGuardians}/{totalGuardians}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Guardianes Activos
                </Typography>
                <Chip
                  label={
                    activeGuardians === totalGuardians
                      ? 'Todos Activos'
                      : 'Parcial'
                  }
                  size="small"
                  color={
                    activeGuardians === totalGuardians ? 'success' : 'warning'
                  }
                  sx={{ mt: 1 }}
                />
              </CardContent>
            </CosmicCard>
          </Grid>

          <Grid item xs={12} md={3}>
            <CosmicCard element="agua" variant="elevated" enableGlow>
              <CardContent sx={{ textAlign: 'center' }}>
                <MissionsIcon sx={{ fontSize: 40, color: '#4FC3F7', mb: 1 }} />
                <Typography variant="h4" fontWeight="bold" color="#4FC3F7">
                  {activeMissions}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Misiones Activas
                </Typography>
                <Chip
                  label={activeMissions > 0 ? 'En Progreso' : 'Completas'}
                  size="small"
                  color={activeMissions > 0 ? 'info' : 'success'}
                  sx={{ mt: 1 }}
                />
              </CardContent>
            </CosmicCard>
          </Grid>

          <Grid item xs={12} md={3}>
            <CosmicCard element="aire" variant="elevated" enableGlow>
              <CardContent sx={{ textAlign: 'center' }}>
                <PsychologyIcon
                  sx={{ fontSize: 40, color: '#81C784', mb: 1 }}
                />
                <Typography variant="h4" fontWeight="bold" color="#81C784">
                  {philosophyAlignment}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Alineación Filosófica
                </Typography>
                <Chip
                  label={
                    philosophyAlignment >= 90
                      ? 'Transcendente'
                      : philosophyAlignment >= 70
                        ? 'Alineado'
                        : 'Ajustando'
                  }
                  size="small"
                  color={
                    philosophyAlignment >= 90
                      ? 'success'
                      : philosophyAlignment >= 70
                        ? 'info'
                        : 'warning'
                  }
                  sx={{ mt: 1 }}
                />
              </CardContent>
            </CosmicCard>
          </Grid>
        </Grid>

        {/* 📊 ESTADO DE ÚLTIMA ACTUALIZACIÓN */}
        {lastUpdateTimestamp && (
          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="body2">
              🕐 Última actualización: {lastUpdateTimestamp.toLocaleString()}
              {isAutoRefreshActive &&
                ' • Actualizando automáticamente cada 30 segundos'}
            </Typography>
          </Alert>
        )}
      </Box>

      {/* 🎯 TABS PRINCIPALES */}
      <Paper elevation={1} sx={{ mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="cosmic brain dashboard tabs"
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            '& .MuiTab-root': {
              minHeight: 64,
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 500,
            },
          }}
        >
          <Tab
            icon={<DashboardIcon />}
            label="Dashboard General"
            id="cosmic-brain-tab-0"
            aria-controls="cosmic-brain-tabpanel-0"
          />
          <Tab
            icon={<GuardiansIcon />}
            label="Guardianes"
            id="cosmic-brain-tab-1"
            aria-controls="cosmic-brain-tabpanel-1"
          />
          <Tab
            icon={<PsychologyIcon />}
            label="Filosofía"
            id="cosmic-brain-tab-2"
            aria-controls="cosmic-brain-tabpanel-2"
          />
          <Tab
            icon={<HealthIcon />}
            label="Salud del Sistema"
            id="cosmic-brain-tab-3"
            aria-controls="cosmic-brain-tabpanel-3"
          />
          <Tab
            icon={<MissionsIcon />}
            label="Misiones"
            id="cosmic-brain-tab-4"
            aria-controls="cosmic-brain-tabpanel-4"
          />
          <Tab
            icon={<HarmonyIcon />}
            label="Armonía"
            id="cosmic-brain-tab-5"
            aria-controls="cosmic-brain-tabpanel-5"
          />
          <Tab
            icon={<AnalyticsIcon />}
            label="Analytics"
            id="cosmic-brain-tab-6"
            aria-controls="cosmic-brain-tabpanel-6"
          />
        </Tabs>
      </Paper>

      {/* 📋 CONTENIDO DE TABS */}
      <TabPanel value={tabValue} index={0}>
        <DashboardGeneralTab
          dashboardData={dashboardData}
          isLoading={isLoading}
          onRefresh={refreshData}
        />
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <GuardianesTab
          guardians={guardians}
          isLoading={isLoading}
          onRefresh={refreshData}
        />
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <FilosofiaTab
          philosophyMetrics={philosophyMetrics}
          isLoading={isLoading}
          onRefresh={refreshData}
        />
      </TabPanel>

      <TabPanel value={tabValue} index={3}>
        <SaludSistemaTab
          systemHealth={systemHealth}
          isLoading={isLoading}
          onRefresh={refreshData}
        />
      </TabPanel>

      <TabPanel value={tabValue} index={4}>
        <MisionesTab
          missions={missions}
          isLoading={isLoading}
          onRefresh={refreshData}
        />
      </TabPanel>

      <TabPanel value={tabValue} index={5}>
        <ArmoniaTab
          harmonyMetrics={harmonyMetrics}
          isLoading={isLoading}
          onRefresh={refreshData}
        />
      </TabPanel>

      <TabPanel value={tabValue} index={6}>
        <AnalyticsTab userId={user?.id || 'admin'} />
      </TabPanel>

      {/* 🔧 PERFORMANCE AUDITOR FLOTANTE */}
      {showPerformanceAuditor && (
        <CosmicPerformanceAuditor
          visible={showPerformanceAuditor}
          onToggle={() => setShowPerformanceAuditor(false)}
        />
      )}
    </Container>
  );
};

// 🎯 COMPONENTE TAB: DASHBOARD GENERAL
const DashboardGeneralTab: React.FC<{
  dashboardData: any;
  isLoading: boolean;
  onRefresh: () => void;
}> = ({ dashboardData, isLoading, onRefresh }) => {
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (!dashboardData) {
    return (
      <Alert severity="warning">
        <Typography variant="h6">📊 Dashboard Data No Disponible</Typography>
        <Typography variant="body2">
          No se pudieron cargar los datos del dashboard. Verifica la conexión
          con el backend.
        </Typography>
        <Button onClick={onRefresh} sx={{ mt: 2 }} startIcon={<RefreshIcon />}>
          Reintentar
        </Button>
      </Alert>
    );
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <RevolutionaryWidget
          title="🌌 Estado General del Cosmic Brain"
          subtitle="Resumen ejecutivo de todos los sistemas"
          element="espiritu"
          variant="elevated"
          cosmicIntensity="medium"
          cosmicEffects={{
            enableGlow: true,
            enableAnimations: true,
            enableParticles: false,
          }}
        >
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              🎯 Métricas Clave
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="primary">
                    {dashboardData.systemHealth?.overall || 0}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Salud General
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="success.main">
                    {dashboardData.guardians?.filter(
                      (g: any) => g.status === 'active'
                    ).length || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Guardianes Activos
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="info.main">
                    {dashboardData.missions?.filter(
                      (m: any) => m.status === 'in_progress'
                    ).length || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Misiones Activas
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="warning.main">
                    {dashboardData.philosophy?.overallAlignment || 0}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Alineación Filosófica
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </RevolutionaryWidget>
      </Grid>
    </Grid>
  );
};

// 🎯 COMPONENTE TAB: GUARDIANES
const GuardianesTab: React.FC<{
  guardians: any[];
  isLoading: boolean;
  onRefresh: () => void;
}> = ({ guardians, isLoading, onRefresh }) => {
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Grid container spacing={3}>
      {guardians?.map((guardian, index) => (
        <Grid item xs={12} md={6} lg={4} key={guardian.id}>
          <CosmicCard
            element={index % 2 === 0 ? 'fuego' : 'agua'}
            variant="elevated"
            enableGlow
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <GuardiansIcon sx={{ mr: 2, color: 'primary.main' }} />
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    {guardian.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {guardian.type}
                  </Typography>
                </Box>
              </Box>

              <Chip
                label={guardian.status}
                size="small"
                color={guardian.status === 'active' ? 'success' : 'warning'}
                sx={{ mb: 2 }}
              />

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" gutterBottom>
                  Salud: {guardian.healthScore}%
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={guardian.healthScore}
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>

              {guardian.currentTask && (
                <Typography variant="body2" color="text.secondary">
                  🎯 {guardian.currentTask}
                </Typography>
              )}

              <Typography variant="caption" color="text.secondary">
                Última actividad:{' '}
                {new Date(guardian.lastActivity).toLocaleString()}
              </Typography>
            </CardContent>
          </CosmicCard>
        </Grid>
      ))}
    </Grid>
  );
};

// 🎯 COMPONENTE TAB: FILOSOFÍA
const FilosofiaTab: React.FC<{
  philosophyMetrics: any;
  isLoading: boolean;
  onRefresh: () => void;
}> = ({ philosophyMetrics, isLoading, onRefresh }) => {
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  const principles = [
    { key: 'bienComun', name: 'Bien Común', color: '#4CAF50' },
    { key: 'ayni', name: 'Ayni (Reciprocidad)', color: '#2196F3' },
    { key: 'metanoia', name: 'Metanöia', color: '#9C27B0' },
    { key: 'neguentropia', name: 'Neguentropía', color: '#FF9800' },
    { key: 'vocacion', name: 'Vocación', color: '#E91E63' },
  ];

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <CosmicCard element="aire" variant="elevated" enableGlow>
          <CardContent>
            <Typography
              variant="h5"
              gutterBottom
              sx={{ display: 'flex', alignItems: 'center' }}
            >
              <PsychologyIcon sx={{ mr: 2 }} />
              Alineación Filosófica CoomÜnity
            </Typography>

            <Box sx={{ mb: 3 }}>
              <Typography variant="h3" color="primary" fontWeight="bold">
                {philosophyMetrics?.overallAlignment || 0}%
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Alineación General
              </Typography>
            </Box>

            <Grid container spacing={2}>
              {principles.map((principle) => (
                <Grid item xs={12} md={6} lg={4} key={principle.key}>
                  <Box
                    sx={{
                      p: 2,
                      border: 1,
                      borderColor: 'divider',
                      borderRadius: 2,
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      fontWeight="bold"
                      gutterBottom
                    >
                      {principle.name}
                    </Typography>
                    <Typography
                      variant="h4"
                      sx={{ color: principle.color, mb: 1 }}
                    >
                      {philosophyMetrics?.[principle.key] || 0}%
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={philosophyMetrics?.[principle.key] || 0}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: alpha(principle.color, 0.1),
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: principle.color,
                        },
                      }}
                    />
                  </Box>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </CosmicCard>
      </Grid>
    </Grid>
  );
};

// 🎯 COMPONENTE TAB: SALUD DEL SISTEMA
const SaludSistemaTab: React.FC<{
  systemHealth: any;
  isLoading: boolean;
  onRefresh: () => void;
}> = ({ systemHealth, isLoading, onRefresh }) => {
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  const components = [
    { key: 'backend', name: 'Backend NestJS', icon: <SettingsIcon /> },
    { key: 'frontend', name: 'Frontend React', icon: <DashboardIcon /> },
    { key: 'database', name: 'PostgreSQL', icon: <HealthIcon /> },
    { key: 'cache', name: 'Redis Cache', icon: <TimelineIcon /> },
    { key: 'ai', name: 'AI Systems', icon: <PsychologyIcon /> },
  ];

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <CosmicCard element="tierra" variant="elevated" enableGlow>
          <CardContent>
            <Typography
              variant="h5"
              gutterBottom
              sx={{ display: 'flex', alignItems: 'center' }}
            >
              <HealthIcon sx={{ mr: 2 }} />
              Salud General del Sistema
            </Typography>

            <Box sx={{ mb: 3 }}>
              <Typography variant="h3" color="primary" fontWeight="bold">
                {systemHealth?.overall || 0}%
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Salud General
              </Typography>
            </Box>

            <Grid container spacing={2}>
              {components.map((component) => (
                <Grid item xs={12} md={6} lg={4} key={component.key}>
                  <Box
                    sx={{
                      p: 2,
                      border: 1,
                      borderColor: 'divider',
                      borderRadius: 2,
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      {component.icon}
                      <Typography
                        variant="subtitle1"
                        fontWeight="bold"
                        sx={{ ml: 1 }}
                      >
                        {component.name}
                      </Typography>
                    </Box>
                    <Typography variant="h4" color="primary" sx={{ mb: 1 }}>
                      {systemHealth?.components?.[component.key] || 0}%
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={systemHealth?.components?.[component.key] || 0}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>
                </Grid>
              ))}
            </Grid>

            <Divider sx={{ my: 3 }} />

            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h5" color="success.main">
                    {systemHealth?.uptime || 0}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Uptime
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h5" color="info.main">
                    {systemHealth?.responseTime || 0}ms
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Tiempo de Respuesta
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h5" color="warning.main">
                    {systemHealth?.errors || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Errores
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </CosmicCard>
      </Grid>
    </Grid>
  );
};

// 🎯 COMPONENTE TAB: MISIONES
const MisionesTab: React.FC<{
  missions: any[];
  isLoading: boolean;
  onRefresh: () => void;
}> = ({ missions, isLoading, onRefresh }) => {
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'in_progress':
        return 'info';
      case 'failed':
        return 'error';
      default:
        return 'default';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'error';
      case 'high':
        return 'warning';
      case 'medium':
        return 'info';
      default:
        return 'default';
    }
  };

  return (
    <Grid container spacing={3}>
      {missions?.map((mission, index) => (
        <Grid item xs={12} md={6} key={mission.id}>
          <CosmicCard
            element={
              index % 4 === 0
                ? 'fuego'
                : index % 4 === 1
                  ? 'agua'
                  : index % 4 === 2
                    ? 'tierra'
                    : 'aire'
            }
            variant="elevated"
            enableGlow
          >
            <CardContent>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  mb: 2,
                }}
              >
                <Typography variant="h6" fontWeight="bold">
                  {mission.title}
                </Typography>
                <Stack direction="row" spacing={1}>
                  <Chip
                    label={mission.status}
                    size="small"
                    color={getStatusColor(mission.status) as any}
                  />
                  <Chip
                    label={mission.priority}
                    size="small"
                    color={getPriorityColor(mission.priority) as any}
                    variant="outlined"
                  />
                </Stack>
              </Box>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {mission.description}
              </Typography>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" gutterBottom>
                  Progreso: {mission.progress}%
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={mission.progress}
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  👤 {mission.assignedGuardian}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  📅{' '}
                  {new Date(mission.estimatedCompletion).toLocaleDateString()}
                </Typography>
              </Box>
            </CardContent>
          </CosmicCard>
        </Grid>
      ))}
    </Grid>
  );
};

// 🎯 COMPONENTE TAB: ARMONÍA
const ArmoniaTab: React.FC<{
  harmonyMetrics: any;
  isLoading: boolean;
  onRefresh: () => void;
}> = ({ harmonyMetrics, isLoading, onRefresh }) => {
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  const components = [
    {
      key: 'userExperience',
      name: 'Experiencia de Usuario',
      icon: <DashboardIcon />,
    },
    {
      key: 'systemStability',
      name: 'Estabilidad del Sistema',
      icon: <HealthIcon />,
    },
    {
      key: 'philosophyAlignment',
      name: 'Alineación Filosófica',
      icon: <PsychologyIcon />,
    },
    {
      key: 'performanceOptimization',
      name: 'Optimización de Performance',
      icon: <TrendingUpIcon />,
    },
    {
      key: 'cosmicResonance',
      name: 'Resonancia Cósmica',
      icon: <AutoAwesome />,
    },
  ];

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <CosmicCard element="ether" variant="elevated" enableGlow>
          <CardContent>
            <Typography
              variant="h5"
              gutterBottom
              sx={{ display: 'flex', alignItems: 'center' }}
            >
              <HarmonyIcon sx={{ mr: 2 }} />
              Armonía Cósmica del Sistema
            </Typography>

            <Box sx={{ mb: 3 }}>
              <Typography variant="h3" color="primary" fontWeight="bold">
                {harmonyMetrics?.overall || 0}%
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Armonía General
              </Typography>
              <Chip
                label={harmonyMetrics?.vibration || 'medium'}
                size="small"
                color="secondary"
                sx={{ mt: 1 }}
              />
            </Box>

            <Grid container spacing={2}>
              {components.map((component) => (
                <Grid item xs={12} md={6} key={component.key}>
                  <Box
                    sx={{
                      p: 2,
                      border: 1,
                      borderColor: 'divider',
                      borderRadius: 2,
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      {component.icon}
                      <Typography
                        variant="subtitle1"
                        fontWeight="bold"
                        sx={{ ml: 1 }}
                      >
                        {component.name}
                      </Typography>
                    </Box>
                    <Typography variant="h4" color="primary" sx={{ mb: 1 }}>
                      {harmonyMetrics?.components?.[component.key] || 0}%
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={harmonyMetrics?.components?.[component.key] || 0}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>
                </Grid>
              ))}
            </Grid>

            <Divider sx={{ my: 3 }} />

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>
                🎵 Frecuencia de Resonancia
              </Typography>
              <Typography variant="h4" color="secondary.main">
                {harmonyMetrics?.resonanceFrequency || 0} Hz
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Frecuencia vibracional del sistema
              </Typography>
            </Box>
          </CardContent>
        </CosmicCard>
      </Grid>
    </Grid>
  );
};

// 🎯 COMPONENTE TAB: ANALYTICS
const AnalyticsTab: React.FC<{
  userId: string;
}> = ({ userId }) => {
  return (
    <CosmicAnalyticsDashboard
      userId={userId}
      timeRange="30d"
      viewMode="overview"
      onInsightAction={(insightId, action) => {
        console.log('Insight action:', insightId, action);
      }}
    />
  );
};

export default CosmicBrainDashboard;
