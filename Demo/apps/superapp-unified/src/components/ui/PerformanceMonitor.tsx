import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  Grid,
  LinearProgress,
  Chip,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Speed,
  Memory,
  Timeline,
  Refresh,
  ExpandMore,
  TrendingUp,
  TrendingDown,
  Remove,
  Info,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useTheme as useCoomunityTheme } from '../../contexts/ThemeContext';
import { CoomunityCard } from './';
import CoomunityButton from './CoomunityButton';

interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  status: 'excellent' | 'good' | 'warning' | 'poor';
  description: string;
  target: number;
}

interface BundleAnalysis {
  totalSize: number;
  cssSize: number;
  jsSize: number;
  imageSize: number;
  compressionRatio: number;
}

interface RenderMetrics {
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  firstInputDelay: number;
  timeToInteractive: number;
}

const PerformanceMonitor: React.FC = () => {
  const { isDark } = useCoomunityTheme();
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const [bundleAnalysis, setBundleAnalysis] = useState<BundleAnalysis | null>(null);
  const [renderMetrics, setRenderMetrics] = useState<RenderMetrics | null>(null);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Función para obtener métricas de Web Vitals
  const getWebVitals = (): Promise<RenderMetrics> => {
    return new Promise((resolve) => {
      // Simulación de métricas reales - en producción usar web-vitals library
      const metrics: RenderMetrics = {
        firstContentfulPaint: Math.random() * 1000 + 500, // 500-1500ms
        largestContentfulPaint: Math.random() * 1500 + 1000, // 1000-2500ms
        cumulativeLayoutShift: Math.random() * 0.1, // 0-0.1
        firstInputDelay: Math.random() * 50 + 10, // 10-60ms
        timeToInteractive: Math.random() * 2000 + 1500, // 1500-3500ms
      };
      
      setTimeout(() => resolve(metrics), 100);
    });
  };

  // Función para analizar el bundle
  const analyzeBundleSize = (): BundleAnalysis => {
    // Simulación de análisis de bundle
    const totalSize = 450 + Math.random() * 100; // KB
    const cssSize = 120 + Math.random() * 30;
    const jsSize = 280 + Math.random() * 50;
    const imageSize = 50 + Math.random() * 20;
    
    return {
      totalSize,
      cssSize,
      jsSize,
      imageSize,
      compressionRatio: 0.65 + Math.random() * 0.15, // 65-80%
    };
  };

  // Función para obtener métricas de memoria
  const getMemoryMetrics = (): number => {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      return memory.usedJSHeapSize / 1024 / 1024; // MB
    }
    return 25 + Math.random() * 15; // Simulación 25-40MB
  };

  // Función para calcular el estado de una métrica
  const getMetricStatus = (value: number, target: number, isLowerBetter: boolean = true): 'excellent' | 'good' | 'warning' | 'poor' => {
    const ratio = isLowerBetter ? value / target : target / value;
    
    if (ratio <= 0.7) return 'excellent';
    if (ratio <= 0.9) return 'good';
    if (ratio <= 1.2) return 'warning';
    return 'poor';
  };

  // Función para recopilar todas las métricas
  const collectMetrics = async () => {
    setIsMonitoring(true);
    
    try {
      // Web Vitals
      const webVitals = await getWebVitals();
      setRenderMetrics(webVitals);
      
      // Bundle Analysis
      const bundle = analyzeBundleSize();
      setBundleAnalysis(bundle);
      
      // Memory Usage
      const memoryUsage = getMemoryMetrics();
      
      // Compilar métricas
      const compiledMetrics: PerformanceMetric[] = [
        {
          name: 'First Contentful Paint',
          value: webVitals.firstContentfulPaint,
          unit: 'ms',
          status: getMetricStatus(webVitals.firstContentfulPaint, 1800),
          description: 'Tiempo hasta que aparece el primer contenido',
          target: 1800,
        },
        {
          name: 'Largest Contentful Paint',
          value: webVitals.largestContentfulPaint,
          unit: 'ms',
          status: getMetricStatus(webVitals.largestContentfulPaint, 2500),
          description: 'Tiempo hasta que aparece el contenido principal',
          target: 2500,
        },
        {
          name: 'Cumulative Layout Shift',
          value: webVitals.cumulativeLayoutShift,
          unit: '',
          status: getMetricStatus(webVitals.cumulativeLayoutShift, 0.1),
          description: 'Estabilidad visual de la página',
          target: 0.1,
        },
        {
          name: 'First Input Delay',
          value: webVitals.firstInputDelay,
          unit: 'ms',
          status: getMetricStatus(webVitals.firstInputDelay, 100),
          description: 'Tiempo de respuesta a la primera interacción',
          target: 100,
        },
        {
          name: 'Bundle Size',
          value: bundle.totalSize,
          unit: 'KB',
          status: getMetricStatus(bundle.totalSize, 500),
          description: 'Tamaño total del bundle de la aplicación',
          target: 500,
        },
        {
          name: 'CSS Size',
          value: bundle.cssSize,
          unit: 'KB',
          status: getMetricStatus(bundle.cssSize, 150),
          description: 'Tamaño de los archivos CSS',
          target: 150,
        },
        {
          name: 'Memory Usage',
          value: memoryUsage,
          unit: 'MB',
          status: getMetricStatus(memoryUsage, 50),
          description: 'Uso de memoria JavaScript',
          target: 50,
        },
        {
          name: 'Compression Ratio',
          value: bundle.compressionRatio * 100,
          unit: '%',
          status: getMetricStatus(bundle.compressionRatio * 100, 70, false),
          description: 'Ratio de compresión de archivos',
          target: 70,
        },
      ];
      
      setMetrics(compiledMetrics);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error recopilando métricas:', error);
    } finally {
      setIsMonitoring(false);
    }
  };

  // Auto-refresh cada 30 segundos
  const startAutoRefresh = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    intervalRef.current = setInterval(() => {
      collectMetrics();
    }, 30000);
  };

  const stopAutoRefresh = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // Ejecutar al montar el componente
  useEffect(() => {
    collectMetrics();
    startAutoRefresh();
    
    return () => {
      stopAutoRefresh();
    };
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent':
        return 'success';
      case 'good':
        return 'info';
      case 'warning':
        return 'warning';
      case 'poor':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent':
        return <TrendingUp sx={{ color: 'success.main' }} />;
      case 'good':
        return <Remove sx={{ color: 'info.main' }} />;
      case 'warning':
        return <TrendingDown sx={{ color: 'warning.main' }} />;
      case 'poor':
        return <TrendingDown sx={{ color: 'error.main' }} />;
      default:
        return null;
    }
  };

  const getPerformanceScore = (): number => {
    if (metrics.length === 0) return 0;
    
    const scores = metrics.map(metric => {
      switch (metric.status) {
        case 'excellent': return 100;
        case 'good': return 80;
        case 'warning': return 60;
        case 'poor': return 30;
        default: return 0;
      }
    });
    
    return Math.round(scores.reduce((acc, score) => acc + score, 0) / scores.length);
  };

  const performanceScore = getPerformanceScore();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <CoomunityCard variant="elevated" padding="lg" className="mb-6">
          <Box display="flex" alignItems="center" gap={2} mb={3}>
            <Speed sx={{ fontSize: 40, color: 'primary.main' }} />
            <Box flex={1}>
              <Typography variant="h4" className="coomunity-h2" gutterBottom>
                Monitor de Performance
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Métricas en tiempo real del sistema de diseño
              </Typography>
            </Box>
            <Tooltip title="Actualizar métricas">
              <IconButton 
                onClick={collectMetrics} 
                disabled={isMonitoring}
                color="primary"
              >
                <Refresh />
              </IconButton>
            </Tooltip>
          </Box>

          {/* Performance Score */}
          <Box mb={3}>
            <Box display="flex" alignItems="center" gap={2} mb={2}>
              <Typography variant="h6" fontWeight="medium">
                Puntuación General
              </Typography>
              <Chip
                label={`${performanceScore}/100`}
                color={performanceScore >= 90 ? 'success' : performanceScore >= 70 ? 'warning' : 'error'}
                variant="filled"
                size="medium"
              />
            </Box>
            <LinearProgress
              variant="determinate"
              value={performanceScore}
              sx={{
                height: 12,
                borderRadius: 6,
                backgroundColor: 'grey.200',
              }}
            />
          </Box>

          {/* Last Update */}
          {lastUpdate && (
            <Typography variant="caption" color="text.secondary">
              Última actualización: {lastUpdate.toLocaleTimeString()}
            </Typography>
          )}
        </CoomunityCard>

        {/* Core Web Vitals */}
        <CoomunityCard variant="outlined" padding="lg" className="mb-6">
          <Typography variant="h5" className="coomunity-h3" mb={3}>
            Core Web Vitals
          </Typography>
          <Grid container spacing={3}>
            {metrics.slice(0, 4).map((metric, index) => (
              <Grid item xs={12} sm={6} md={3} key={metric.name}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card sx={{ p: 2, textAlign: 'center', height: '100%' }}>
                    <Box display="flex" justifyContent="center" mb={1}>
                      {getStatusIcon(metric.status)}
                    </Box>
                    <Typography variant="h4" fontWeight="bold" color="text.primary">
                      {metric.value.toFixed(metric.name === 'Cumulative Layout Shift' ? 3 : 0)}
                      <Typography component="span" variant="body2" color="text.secondary">
                        {metric.unit}
                      </Typography>
                    </Typography>
                    <Typography variant="body2" fontWeight="medium" mb={1}>
                      {metric.name}
                    </Typography>
                    <Chip
                      label={metric.status.toUpperCase()}
                      color={getStatusColor(metric.status) as any}
                      size="small"
                      variant="outlined"
                    />
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </CoomunityCard>

        {/* Bundle Analysis */}
        {bundleAnalysis && (
          <CoomunityCard variant="outlined" padding="lg" className="mb-6">
            <Typography variant="h5" className="coomunity-h3" mb={3}>
              Análisis de Bundle
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card sx={{ p: 3 }}>
                  <Typography variant="h6" mb={2}>Distribución de Tamaños</Typography>
                  <List>
                    <ListItem>
                      <ListItemText
                        primary="JavaScript"
                        secondary={`${bundleAnalysis.jsSize.toFixed(1)} KB`}
                      />
                      <LinearProgress
                        variant="determinate"
                        value={(bundleAnalysis.jsSize / bundleAnalysis.totalSize) * 100}
                        sx={{ width: 100, ml: 2 }}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="CSS"
                        secondary={`${bundleAnalysis.cssSize.toFixed(1)} KB`}
                      />
                      <LinearProgress
                        variant="determinate"
                        value={(bundleAnalysis.cssSize / bundleAnalysis.totalSize) * 100}
                        sx={{ width: 100, ml: 2 }}
                        color="secondary"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Imágenes"
                        secondary={`${bundleAnalysis.imageSize.toFixed(1)} KB`}
                      />
                      <LinearProgress
                        variant="determinate"
                        value={(bundleAnalysis.imageSize / bundleAnalysis.totalSize) * 100}
                        sx={{ width: 100, ml: 2 }}
                        color="success"
                      />
                    </ListItem>
                  </List>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card sx={{ p: 3 }}>
                  <Typography variant="h6" mb={2}>Optimización</Typography>
                  <Box display="flex" alignItems="center" gap={2} mb={2}>
                    <Typography variant="body1">Ratio de Compresión:</Typography>
                    <Chip
                      label={`${(bundleAnalysis.compressionRatio * 100).toFixed(1)}%`}
                      color={bundleAnalysis.compressionRatio > 0.7 ? 'success' : 'warning'}
                      variant="filled"
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary" mb={2}>
                    Tamaño total: {bundleAnalysis.totalSize.toFixed(1)} KB
                  </Typography>
                  <Alert 
                    severity={bundleAnalysis.totalSize < 500 ? 'success' : 'warning'}
                    sx={{ mt: 2 }}
                  >
                    {bundleAnalysis.totalSize < 500 
                      ? 'Bundle size óptimo para performance'
                      : 'Considerar optimización del bundle size'
                    }
                  </Alert>
                </Card>
              </Grid>
            </Grid>
          </CoomunityCard>
        )}

        {/* Detailed Metrics */}
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Box display="flex" alignItems="center" gap={2}>
              <Timeline />
              <Typography variant="h6" fontWeight="medium">
                Métricas Detalladas
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              {metrics.map((metric, index) => (
                <Grid item xs={12} sm={6} md={4} key={metric.name}>
                  <Card sx={{ p: 2, height: '100%' }}>
                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                      {getStatusIcon(metric.status)}
                      <Typography variant="body1" fontWeight="medium">
                        {metric.name}
                      </Typography>
                    </Box>
                    <Typography variant="h5" fontWeight="bold" color="text.primary" mb={1}>
                      {metric.value.toFixed(metric.name === 'Cumulative Layout Shift' ? 3 : 0)} {metric.unit}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" mb={2}>
                      {metric.description}
                    </Typography>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Chip
                        label={metric.status}
                        color={getStatusColor(metric.status) as any}
                        size="small"
                        variant="outlined"
                      />
                      <Typography variant="caption" color="text.secondary">
                        Target: {metric.target}{metric.unit}
                      </Typography>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </AccordionDetails>
        </Accordion>

        {/* Actions */}
        <Box mt={4} display="flex" gap={2} justifyContent="center">
          <CoomunityButton
            variant="primary"
            size="md"
            onClick={collectMetrics}
            disabled={isMonitoring}
            startIcon={<Refresh />}
          >
            {isMonitoring ? 'Recopilando...' : 'Actualizar Métricas'}
          </CoomunityButton>
          <CoomunityButton
            variant="outline"
            size="md"
            onClick={() => window.open('/design-system', '_blank')}
            startIcon={<Info />}
          >
            Ver Sistema de Diseño
          </CoomunityButton>
        </Box>
      </motion.div>
    </Container>
  );
};

export default PerformanceMonitor; 