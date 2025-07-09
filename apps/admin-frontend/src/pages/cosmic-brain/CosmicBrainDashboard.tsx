import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  Chip,
  Alert,
  AlertTitle,
  Fade,
  useTheme,
  alpha,
  CircularProgress,
  Divider
} from '@mui/material';
import {
  Psychology,
  Refresh,
  Settings,
  Timeline,
  Dashboard,
  Insights,
  Speed,
  Favorite,
  TrendingUp,
  Warning,
  CheckCircle,
  Error as ErrorIcon,
  Info
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import GuardianStatusCard from '../../components/cosmic-brain/GuardianStatusCard';
import RealTimeMetricsVisualizer from '../../components/cosmic-brain/RealTimeMetricsVisualizer';

// Types
interface CosmicBrainStatus {
  systemHealth: number;
  activeGuardians: number;
  totalGuardians: number;
  lastSync: string;
  status: 'healthy' | 'warning' | 'critical';
  uptime: number;
}

interface Guardian {
  id: string;
  name: string;
  type: 'Frontend Artist' | 'Harmonic Design' | 'Integration' | 'Narrative' | 'Analytics';
  status: 'active' | 'idle' | 'error' | 'maintenance';
  metrics: {
    health: number;
    efficiency: number;
    harmony: number;
    lastUpdate: string;
    tasksCompleted: number;
    activeConnections: number;
  };
  avatar?: string;
}

interface SystemMetrics {
  performance: Array<{ timestamp: number; value: number; label: string }>;
  harmony: Array<{ timestamp: number; value: number; label: string }>;
  efficiency: Array<{ timestamp: number; value: number; label: string }>;
  connections: Array<{ timestamp: number; value: number; label: string }>;
  tasks: Array<{ timestamp: number; value: number; label: string }>;
  health: Array<{ timestamp: number; value: number; label: string }>;
}

// Mock data - In production, this would come from the backend API
const mockCosmicBrainStatus: CosmicBrainStatus = {
  systemHealth: 92,
  activeGuardians: 4,
  totalGuardians: 5,
  lastSync: new Date().toISOString(),
  status: 'healthy',
  uptime: 99.7
};

const mockGuardians: Guardian[] = [
  {
    id: 'aria',
    name: 'ARIA',
    type: 'Frontend Artist',
    status: 'active',
    metrics: {
      health: 95,
      efficiency: 88,
      harmony: 92,
      lastUpdate: new Date().toISOString(),
      tasksCompleted: 47,
      activeConnections: 12
    }
  },
  {
    id: 'eunoia',
    name: 'EUNOIA',
    type: 'Harmonic Design',
    status: 'active',
    metrics: {
      health: 89,
      efficiency: 94,
      harmony: 96,
      lastUpdate: new Date().toISOString(),
      tasksCompleted: 32,
      activeConnections: 8
    }
  },
  {
    id: 'cosmos',
    name: 'COSMOS',
    type: 'Integration',
    status: 'idle',
    metrics: {
      health: 78,
      efficiency: 82,
      harmony: 85,
      lastUpdate: new Date(Date.now() - 300000).toISOString(),
      tasksCompleted: 23,
      activeConnections: 5
    }
  },
  {
    id: 'kira',
    name: 'KIRA',
    type: 'Narrative',
    status: 'active',
    metrics: {
      health: 91,
      efficiency: 87,
      harmony: 89,
      lastUpdate: new Date().toISOString(),
      tasksCompleted: 38,
      activeConnections: 15
    }
  },
  {
    id: 'ana',
    name: 'ANA',
    type: 'Analytics',
    status: 'maintenance',
    metrics: {
      health: 65,
      efficiency: 70,
      harmony: 72,
      lastUpdate: new Date(Date.now() - 900000).toISOString(),
      tasksCompleted: 18,
      activeConnections: 3
    }
  }
];

const generateMockMetrics = (): SystemMetrics => {
  const now = Date.now();
  const points = 20;
  
  const generateTimeSeries = (baseValue: number, variance: number) => {
    return Array.from({ length: points }, (_, i) => {
      const timestamp = now - (points - i) * 60000; // 1 minute intervals
      const value = Math.max(0, Math.min(100, 
        baseValue + (Math.random() - 0.5) * variance + Math.sin(i * 0.3) * 10
      ));
      return {
        timestamp,
        value,
        label: new Date(timestamp).toLocaleTimeString()
      };
    });
  };
  
  return {
    performance: generateTimeSeries(85, 15),
    harmony: generateTimeSeries(90, 10),
    efficiency: generateTimeSeries(82, 18),
    connections: generateTimeSeries(75, 20),
    tasks: generateTimeSeries(88, 12),
    health: generateTimeSeries(92, 8)
  };
};

const CosmicBrainDashboard: React.FC = () => {
  const theme = useTheme();
  const [realTimeEnabled, setRealTimeEnabled] = useState(true);
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics>(generateMockMetrics());
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  // Simulate API call to get cosmic brain status
  const { data: cosmicBrainStatus, isLoading, error, refetch } = useQuery({
    queryKey: ['cosmic-brain-status'],
    queryFn: async () => {
      // In production, this would be: await apiService.get('/cosmic-brain/status')
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      return mockCosmicBrainStatus;
    },
    refetchInterval: realTimeEnabled ? 30000 : false,
    staleTime: 30000
  });

  // Handle real-time updates
  useEffect(() => {
    if (realTimeEnabled) {
      const interval = setInterval(() => {
        setSystemMetrics(generateMockMetrics());
        setLastRefresh(new Date());
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [realTimeEnabled]);

  const handleRefresh = () => {
    refetch();
    setSystemMetrics(generateMockMetrics());
    setLastRefresh(new Date());
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return theme.palette.success.main;
      case 'warning':
        return theme.palette.warning.main;
      case 'critical':
        return theme.palette.error.main;
      default:
        return theme.palette.grey[500];
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle />;
      case 'warning':
        return <Warning />;
      case 'critical':
        return <ErrorIcon />;
      default:
        return <Info />;
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">
          <AlertTitle>Error de Conexión</AlertTitle>
          No se pudo conectar con el Cosmic Brain. Verificar la conexión con el backend.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Fade in timeout={800}>
        <Box>
          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Psychology 
                  sx={{ 
                    fontSize: 40, 
                    color: theme.palette.primary.main,
                    animation: 'pulse 2s infinite'
                  }} 
                />
                <Box>
                  <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 0.5 }}>
                    Portal Visual del Cosmic Brain
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary">
                    Sistema de Orquestación de Guardianes AI - CoomÜnity
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Chip
                  icon={getStatusIcon(cosmicBrainStatus?.status || 'healthy')}
                  label={`Sistema ${cosmicBrainStatus?.status === 'healthy' ? 'Saludable' : 
                    cosmicBrainStatus?.status === 'warning' ? 'Advertencia' : 'Crítico'}`}
                  sx={{
                    backgroundColor: alpha(getStatusColor(cosmicBrainStatus?.status || 'healthy'), 0.1),
                    color: getStatusColor(cosmicBrainStatus?.status || 'healthy'),
                    border: `1px solid ${alpha(getStatusColor(cosmicBrainStatus?.status || 'healthy'), 0.3)}`,
                    fontWeight: 600
                  }}
                />
                <Tooltip title="Actualizar Dashboard">
                  <IconButton onClick={handleRefresh} sx={{ ml: 1 }}>
                    <Refresh />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Configuración">
                  <IconButton>
                    <Settings />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
            
            <Typography variant="body2" color="text.secondary">
              Última actualización: {lastRefresh.toLocaleTimeString()} • 
              Tiempo de actividad: {cosmicBrainStatus?.uptime}%
            </Typography>
          </Box>

          {/* System Overview Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ 
                      p: 1, 
                      borderRadius: 2, 
                      backgroundColor: alpha(theme.palette.success.main, 0.1) 
                    }}>
                      <Speed sx={{ color: theme.palette.success.main }} />
                    </Box>
                    <Box>
                      <Typography variant="h4" sx={{ fontWeight: 600, color: theme.palette.success.main }}>
                        {cosmicBrainStatus?.systemHealth}%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Salud del Sistema
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ 
                      p: 1, 
                      borderRadius: 2, 
                      backgroundColor: alpha(theme.palette.primary.main, 0.1) 
                    }}>
                      <Psychology sx={{ color: theme.palette.primary.main }} />
                    </Box>
                    <Box>
                      <Typography variant="h4" sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
                        {cosmicBrainStatus?.activeGuardians}/{cosmicBrainStatus?.totalGuardians}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Guardianes Activos
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ 
                      p: 1, 
                      borderRadius: 2, 
                      backgroundColor: alpha(theme.palette.secondary.main, 0.1) 
                    }}>
                      <Favorite sx={{ color: theme.palette.secondary.main }} />
                    </Box>
                    <Box>
                      <Typography variant="h4" sx={{ fontWeight: 600, color: theme.palette.secondary.main }}>
                        {Math.round(systemMetrics.harmony[systemMetrics.harmony.length - 1]?.value || 0)}%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Armonía Global
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ 
                      p: 1, 
                      borderRadius: 2, 
                      backgroundColor: alpha(theme.palette.warning.main, 0.1) 
                    }}>
                      <TrendingUp sx={{ color: theme.palette.warning.main }} />
                    </Box>
                    <Box>
                      <Typography variant="h4" sx={{ fontWeight: 600, color: theme.palette.warning.main }}>
                        {Math.round(systemMetrics.efficiency[systemMetrics.efficiency.length - 1]?.value || 0)}%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Eficiencia
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Real-time Metrics Visualizer */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12}>
              <RealTimeMetricsVisualizer
                metrics={systemMetrics}
                isRealTime={realTimeEnabled}
                onToggleRealTime={setRealTimeEnabled}
                onRefresh={handleRefresh}
              />
            </Grid>
          </Grid>

          {/* Guardians Status Section */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h5" component="h2" sx={{ mb: 2, fontWeight: 600 }}>
              Estado de los Guardianes
            </Typography>
            <Divider sx={{ mb: 3 }} />
          </Box>

          {/* Guardian Cards */}
          <Grid container spacing={3}>
            {mockGuardians.map((guardian) => (
              <Grid item xs={12} sm={6} lg={4} key={guardian.id}>
                <GuardianStatusCard
                  guardianId={guardian.id}
                  name={guardian.name}
                  type={guardian.type}
                  status={guardian.status}
                  metrics={guardian.metrics}
                  onRefresh={() => handleRefresh()}
                  onConfigure={() => console.log(`Configure ${guardian.name}`)}
                  realTimeUpdates={realTimeEnabled}
                />
              </Grid>
            ))}
          </Grid>

          {/* Philosophy Integration */}
          <Box sx={{ mt: 4, p: 3, backgroundColor: alpha(theme.palette.primary.main, 0.05), borderRadius: 2 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              🌌 Filosofía CoomÜnity en Acción
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="body2" color="primary" sx={{ fontWeight: 600 }}>
                    Bien Común
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Dashboard accesible para todo el equipo
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="body2" color="secondary" sx={{ fontWeight: 600 }}>
                    Ayni (Reciprocidad)
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Balance entre información y acción
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="body2" color="success.main" sx={{ fontWeight: 600 }}>
                    Neguentropía
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Orden visual claro y estructurado
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="body2" color="warning.main" sx={{ fontWeight: 600 }}>
                    Metanöia
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Evolución continua del sistema
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Fade>
    </Container>
  );
};

export default CosmicBrainDashboard;