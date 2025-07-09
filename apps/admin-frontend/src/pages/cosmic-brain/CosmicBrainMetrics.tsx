import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  Chip,
  useTheme,
  alpha,
  Tabs,
  Tab,
  Paper
} from '@mui/material';
import {
  Timeline,
  Refresh,
  Settings,
  Analytics,
  Speed,
  TrendingUp,
  Memory,
  Storage,
  NetworkCheck,
  Psychology
} from '@mui/icons-material';
import RealTimeMetricsVisualizer from '../../components/cosmic-brain/RealTimeMetricsVisualizer';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => (
  <div role="tabpanel" hidden={value !== index}>
    {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
  </div>
);

const CosmicBrainMetrics: React.FC = () => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [realTimeEnabled, setRealTimeEnabled] = useState(true);

  // Mock system metrics
  const generateMockMetrics = () => {
    const now = Date.now();
    const points = 30;
    
    const generateTimeSeries = (baseValue: number, variance: number) => {
      return Array.from({ length: points }, (_, i) => {
        const timestamp = now - (points - i) * 60000;
        const value = Math.max(0, Math.min(100, 
          baseValue + (Math.random() - 0.5) * variance + Math.sin(i * 0.2) * 8
        ));
        return {
          timestamp,
          value,
          label: new Date(timestamp).toLocaleTimeString()
        };
      });
    };
    
    return {
      performance: generateTimeSeries(88, 12),
      harmony: generateTimeSeries(92, 8),
      efficiency: generateTimeSeries(85, 15),
      connections: generateTimeSeries(78, 18),
      tasks: generateTimeSeries(90, 10),
      health: generateTimeSeries(94, 6)
    };
  };

  const [systemMetrics] = useState(generateMockMetrics());

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const performanceMetrics = [
    { label: 'CPU Usage', value: 67, icon: <Speed />, color: theme.palette.primary.main },
    { label: 'Memory Usage', value: 45, icon: <Memory />, color: theme.palette.secondary.main },
    { label: 'Storage', value: 23, icon: <Storage />, color: theme.palette.success.main },
    { label: 'Network', value: 89, icon: <NetworkCheck />, color: theme.palette.warning.main }
  ];

  const guardianMetrics = [
    { name: 'ARIA', efficiency: 94, tasks: 47, connections: 12, status: 'active' },
    { name: 'EUNOIA', efficiency: 88, tasks: 32, connections: 8, status: 'active' },
    { name: 'COSMOS', efficiency: 76, tasks: 23, connections: 5, status: 'idle' },
    { name: 'KIRA', efficiency: 91, tasks: 38, connections: 15, status: 'active' },
    { name: 'ANA', efficiency: 65, tasks: 18, connections: 3, status: 'maintenance' }
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Analytics sx={{ fontSize: 40, color: theme.palette.primary.main }} />
            <Box>
              <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 0.5 }}>
                Métricas Avanzadas
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                Análisis detallado del rendimiento del Cosmic Brain
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Chip
              label="Tiempo Real"
              color={realTimeEnabled ? "success" : "default"}
              sx={{ animation: realTimeEnabled ? 'pulse 2s infinite' : 'none' }}
            />
            <Tooltip title="Actualizar Métricas">
              <IconButton>
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
      </Box>

      {/* Tabs */}
      <Paper sx={{ mb: 4 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{
            '& .MuiTab-root': {
              minHeight: 64,
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 500
            }
          }}
        >
          <Tab label="Métricas del Sistema" />
          <Tab label="Rendimiento de Guardianes" />
          <Tab label="Análisis de Armonía" />
        </Tabs>
      </Paper>

      {/* System Metrics Tab */}
      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={3}>
          {/* Performance Cards */}
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Métricas de Rendimiento
            </Typography>
            <Grid container spacing={2}>
              {performanceMetrics.map((metric, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ 
                          p: 1, 
                          borderRadius: 2, 
                          backgroundColor: alpha(metric.color, 0.1) 
                        }}>
                          {React.cloneElement(metric.icon, { sx: { color: metric.color } })}
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="h5" sx={{ fontWeight: 600, color: metric.color }}>
                            {metric.value}%
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {metric.label}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>

          {/* Real-time Visualizer */}
          <Grid item xs={12}>
            <RealTimeMetricsVisualizer
              metrics={systemMetrics}
              isRealTime={realTimeEnabled}
              onToggleRealTime={setRealTimeEnabled}
              onRefresh={() => console.log('Refresh metrics')}
            />
          </Grid>
        </Grid>
      </TabPanel>

      {/* Guardian Performance Tab */}
      <TabPanel value={tabValue} index={1}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Rendimiento Individual de Guardianes
            </Typography>
            <Grid container spacing={2}>
              {guardianMetrics.map((guardian, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Psychology color="primary" />
                          <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            {guardian.name}
                          </Typography>
                        </Box>
                        <Chip
                          label={guardian.status}
                          size="small"
                          color={guardian.status === 'active' ? 'success' : 
                                guardian.status === 'idle' ? 'warning' : 'default'}
                        />
                      </Box>
                      
                      <Grid container spacing={2}>
                        <Grid item xs={4}>
                          <Typography variant="body2" color="text.secondary">
                            Eficiencia
                          </Typography>
                          <Typography variant="h6" color="primary">
                            {guardian.efficiency}%
                          </Typography>
                        </Grid>
                        <Grid item xs={4}>
                          <Typography variant="body2" color="text.secondary">
                            Tareas
                          </Typography>
                          <Typography variant="h6" color="success.main">
                            {guardian.tasks}
                          </Typography>
                        </Grid>
                        <Grid item xs={4}>
                          <Typography variant="body2" color="text.secondary">
                            Conexiones
                          </Typography>
                          <Typography variant="h6" color="secondary">
                            {guardian.connections}
                          </Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Harmony Analysis Tab */}
      <TabPanel value={tabValue} index={2}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Análisis de Armonía del Sistema
            </Typography>
            <Card>
              <CardContent>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                  La armonía del sistema mide la sincronización y colaboración entre los guardianes AI, 
                  reflejando los principios de Ayni y Bien Común de la filosofía CoomÜnity.
                </Typography>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ p: 2, backgroundColor: alpha(theme.palette.secondary.main, 0.05), borderRadius: 2 }}>
                      <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                        Índice de Armonía Global
                      </Typography>
                      <Typography variant="h3" color="secondary" sx={{ fontWeight: 700 }}>
                        92%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Excelente sincronización entre guardianes
                      </Typography>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Box sx={{ p: 2, backgroundColor: alpha(theme.palette.primary.main, 0.05), borderRadius: 2 }}>
                      <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                        Colaboración Activa
                      </Typography>
                      <Typography variant="h3" color="primary" sx={{ fontWeight: 700 }}>
                        87%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Alto nivel de cooperación inter-guardian
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>
    </Container>
  );
};

export default CosmicBrainMetrics;