/**
 * 🌌 PERFORMANCE MONITOR - Design System Metrics
 * =============================================
 * 
 * Componente de monitoreo en tiempo real para métricas del Design System.
 * Rastrea performance, bundle size, carga de componentes y salud general.
 * 
 * Características:
 * - Métricas en tiempo real del design system
 * - Monitoreo a nivel de componente
 * - Alertas de performance crítica
 * - Visualización con efectos cósmicos
 * - Integración con filosofía elemental
 * - Auto-refresh configurable
 * 
 * Design System Scaling Roadmap - Fase 4 - PRIORITY ALTA
 */

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';

// 🎯 Material UI imports específicos
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  LinearProgress,
  Chip,
  Alert,
  AlertTitle,
  Tooltip,
  IconButton,
  Switch,
  FormControlLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  alpha,
  useTheme,
  Stack,
  Divider,
  Badge
} from '@mui/material';

// 🎯 Icons específicos
import {
  Refresh as RefreshIcon,
  ExpandMore as ExpandMoreIcon,
  Speed as SpeedIcon,
  Memory as MemoryIcon,
  Download as BundleIcon,
  Schedule as TimeIcon,
  Error as ErrorIcon,
  CheckCircle as SuccessIcon,
  Warning as WarningIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Visibility as ViewIcon,
  VisibilityOff as VisibilityOffIcon,
  Insights as AnalyticsIcon,
  Monitor as MonitorIcon,
  Psychology as AIIcon
} from '@mui/icons-material';

// 🌟 Design System imports
import { RevolutionaryWidget } from '../../design-system/templates/RevolutionaryWidget';
import { elementalPatterns, cosmicUtils } from '../../design-system/patterns';

// 🎯 Types y interfaces
interface PerformanceMetric {
  id: string;
  name: string;
  value: number | string;
  unit: string;
  target: number | string;
  status: 'excellent' | 'good' | 'warning' | 'critical';
  trend: 'up' | 'down' | 'stable';
  element?: 'fuego' | 'agua' | 'tierra' | 'aire' | 'espiritu';
}

interface ComponentMetric {
  component: string;
  renderTime: number;
  memoryUsage: number;
  errorRate: number;
  usageFrequency: number;
  loadTime: number;
  status: 'healthy' | 'warning' | 'critical';
}

interface BundleAnalysis {
  totalSize: number;
  gzippedSize: number;
  jsSize: number;
  cssSize: number;
  componentsCount: number;
  treeShakenSize: number;
  duplicateCode: number;
}

interface PerformanceAlert {
  id: string;
  type: 'critical' | 'warning' | 'info';
  message: string;
  metric: string;
  timestamp: Date;
  resolved: boolean;
}

export interface PerformanceMonitorProps {
  autoRefresh?: boolean;
  refreshInterval?: number;
  showComponentDetails?: boolean;
  showBundleAnalysis?: boolean;
  showAlerts?: boolean;
  element?: 'fuego' | 'agua' | 'tierra' | 'aire' | 'espiritu';
  cosmicIntensity?: 'subtle' | 'medium' | 'intense';
  onMetricAlert?: (alert: PerformanceAlert) => void;
  maxAlerts?: number;
}

// 🎨 Cosmic metric animations
const metricAnimations = {
  excellent: {
    background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(139, 195, 74, 0.15) 100%)',
    borderColor: '#4CAF50',
    glow: '0 0 20px rgba(76, 175, 80, 0.3)'
  },
  good: {
    background: 'linear-gradient(135deg, rgba(33, 150, 243, 0.1) 0%, rgba(103, 58, 183, 0.15) 100%)',
    borderColor: '#2196F3',
    glow: '0 0 20px rgba(33, 150, 243, 0.3)'
  },
  warning: {
    background: 'linear-gradient(135deg, rgba(255, 193, 7, 0.1) 0%, rgba(255, 152, 0, 0.15) 100%)',
    borderColor: '#FFC107',
    glow: '0 0 20px rgba(255, 193, 7, 0.3)'
  },
  critical: {
    background: 'linear-gradient(135deg, rgba(244, 67, 54, 0.1) 0%, rgba(255, 87, 34, 0.15) 100%)',
    borderColor: '#F44336',
    glow: '0 0 20px rgba(244, 67, 54, 0.3)'
  }
};

// 🎯 Mock data simulando métricas reales del design system
const useMockPerformanceMetrics = (): {
  metrics: PerformanceMetric[];
  componentMetrics: ComponentMetric[];
  bundleAnalysis: BundleAnalysis;
  alerts: PerformanceAlert[];
  isLoading: boolean;
} => {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simular carga de datos
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);
  
  const metrics: PerformanceMetric[] = useMemo(() => [
    {
      id: 'bundle-size',
      name: 'Bundle Size',
      value: 285,
      unit: 'KB',
      target: 220,
      status: 'warning',
      trend: 'up',
      element: 'tierra'
    },
    {
      id: 'first-paint',
      name: 'First Paint',
      value: 0.8,
      unit: 's',
      target: 0.6,
      status: 'good',
      trend: 'down',
      element: 'aire'
    },
    {
      id: 'component-load',
      name: 'Component Load',
      value: 95,
      unit: 'ms',
      target: 100,
      status: 'excellent',
      trend: 'stable',
      element: 'agua'
    },
    {
      id: 'animation-fps',
      name: 'Animation FPS',
      value: 58,
      unit: 'fps',
      target: 60,
      status: 'good',
      trend: 'up',
      element: 'fuego'
    },
    {
      id: 'memory-usage',
      name: 'Memory Usage',
      value: 32,
      unit: 'MB',
      target: 35,
      status: 'excellent',
      trend: 'down',
      element: 'espiritu'
    },
    {
      id: 'accessibility',
      name: 'Accessibility',
      value: 97,
      unit: '/100',
      target: 95,
      status: 'excellent',
      trend: 'stable',
      element: 'aire'
    }
  ], []);
  
  const componentMetrics: ComponentMetric[] = useMemo(() => [
    {
      component: 'RevolutionaryWidget',
      renderTime: 12,
      memoryUsage: 2.4,
      errorRate: 0,
      usageFrequency: 95,
      loadTime: 45,
      status: 'healthy'
    },
    {
      component: 'CoomunityDataTable',
      renderTime: 28,
      memoryUsage: 5.8,
      errorRate: 0.2,
      usageFrequency: 65,
      loadTime: 120,
      status: 'warning'
    },
    {
      component: 'CosmicCard',
      renderTime: 8,
      memoryUsage: 1.2,
      errorRate: 0,
      usageFrequency: 88,
      loadTime: 25,
      status: 'healthy'
    },
    {
      component: 'PerformanceMonitor',
      renderTime: 35,
      memoryUsage: 4.1,
      errorRate: 0,
      usageFrequency: 15,
      loadTime: 180,
      status: 'healthy'
    }
  ], []);
  
  const bundleAnalysis: BundleAnalysis = useMemo(() => ({
    totalSize: 285,
    gzippedSize: 89,
    jsSize: 220,
    cssSize: 65,
    componentsCount: 47,
    treeShakenSize: 195,
    duplicateCode: 12
  }), []);
  
  const alerts: PerformanceAlert[] = useMemo(() => [
    {
      id: 'bundle-warning',
      type: 'warning',
      message: 'Bundle size excede el target por 65KB',
      metric: 'bundle-size',
      timestamp: new Date(Date.now() - 300000), // 5 min ago
      resolved: false
    },
    {
      id: 'component-slow',
      type: 'warning',
      message: 'CoomunityDataTable tiene tiempo de render elevado',
      metric: 'component-load',
      timestamp: new Date(Date.now() - 600000), // 10 min ago
      resolved: false
    }
  ], []);
  
  return { metrics, componentMetrics, bundleAnalysis, alerts, isLoading };
};

export const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({
  autoRefresh = true,
  refreshInterval = 30000, // 30 seconds
  showComponentDetails = true,
  showBundleAnalysis = true,
  showAlerts = true,
  element = 'aire', // Aire por defecto para visión y análisis
  cosmicIntensity = 'medium',
  onMetricAlert,
  maxAlerts = 10
}) => {
  const theme = useTheme();
  const { metrics, componentMetrics, bundleAnalysis, alerts, isLoading } = useMockPerformanceMetrics();
  
  // 🎭 Estados del componente
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | false>('overview');
  const [showOnlyWarnings, setShowOnlyWarnings] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState('1h');
  const refreshTimerRef = useRef<NodeJS.Timeout>();
  
  // 🔄 Auto-refresh logic
  useEffect(() => {
    if (autoRefresh) {
      refreshTimerRef.current = setInterval(handleRefresh, refreshInterval);
      return () => {
        if (refreshTimerRef.current) {
          clearInterval(refreshTimerRef.current);
        }
      };
    }
  }, [autoRefresh, refreshInterval]);
  
  // 🎯 Event handlers
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    // Simular refresh
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  }, []);
  
  const handleAccordionChange = useCallback((panel: string) => (
    event: React.SyntheticEvent,
    isExpanded: boolean
  ) => {
    setExpandedSection(isExpanded ? panel : false);
  }, []);
  
  // 🎨 Calcular salud general del sistema
  const overallHealth = useMemo(() => {
    const excellentCount = metrics.filter(m => m.status === 'excellent').length;
    const goodCount = metrics.filter(m => m.status === 'good').length;
    const warningCount = metrics.filter(m => m.status === 'warning').length;
    const criticalCount = metrics.filter(m => m.status === 'critical').length;
    
    const score = (excellentCount * 4 + goodCount * 3 + warningCount * 2 + criticalCount * 1) / (metrics.length * 4);
    
    return {
      score: Math.round(score * 100),
      status: score >= 0.9 ? 'excellent' : score >= 0.7 ? 'good' : score >= 0.5 ? 'warning' : 'critical'
    };
  }, [metrics]);
  
  // 🎨 Render métrica individual
  const renderMetricCard = (metric: PerformanceMetric) => {
    const isTargetMet = typeof metric.value === 'number' && typeof metric.target === 'number' 
      ? metric.value <= metric.target 
      : metric.value === metric.target;
    
    const progressValue = typeof metric.value === 'number' && typeof metric.target === 'number'
      ? Math.min((metric.value / metric.target) * 100, 100)
      : 100;
    
    const elementalStyle = metric.element ? elementalPatterns[metric.element] : null;
    
    return (
      <Card
        key={metric.id}
        sx={{
          ...metricAnimations[metric.status],
          border: `2px solid ${metricAnimations[metric.status].borderColor}`,
          boxShadow: metricAnimations[metric.status].glow,
          transition: 'all 0.3s ease',
          height: '100%',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: `${metricAnimations[metric.status].glow}, 0 10px 20px rgba(0,0,0,0.1)`
          }
        }}
      >
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="subtitle2" color="text.secondary">
              {metric.name}
            </Typography>
            <Tooltip title={`Trend: ${metric.trend}`}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {metric.trend === 'up' && <TrendingUpIcon color="error" fontSize="small" />}
                {metric.trend === 'down' && <TrendingDownIcon color="success" fontSize="small" />}
                {metric.trend === 'stable' && <div style={{ width: 16, height: 16 }} />}
              </Box>
            </Tooltip>
          </Box>
          
          <Typography variant="h4" sx={{ 
            color: elementalStyle?.primaryColor || metricAnimations[metric.status].borderColor,
            fontWeight: 700,
            mb: 1
          }}>
            {metric.value}
            <Typography component="span" variant="body2" sx={{ ml: 0.5 }}>
              {metric.unit}
            </Typography>
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Target: {metric.target}{metric.unit}
            </Typography>
            <Chip
              size="small"
              label={metric.status.toUpperCase()}
              color={
                metric.status === 'excellent' ? 'success' :
                metric.status === 'good' ? 'info' :
                metric.status === 'warning' ? 'warning' : 'error'
              }
            />
          </Box>
          
          <LinearProgress
            variant="determinate"
            value={progressValue}
            sx={{
              height: 8,
              borderRadius: 4,
              '& .MuiLinearProgress-bar': {
                background: elementalStyle?.gradient || `linear-gradient(90deg, ${metricAnimations[metric.status].borderColor}, ${alpha(metricAnimations[metric.status].borderColor, 0.7)})`
              }
            }}
          />
        </CardContent>
      </Card>
    );
  };
  
  // 🎨 Render análisis de componentes
  const renderComponentAnalysis = () => (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <AnalyticsIcon />
        Análisis de Componentes
      </Typography>
      
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Componente</TableCell>
              <TableCell align="right">Render (ms)</TableCell>
              <TableCell align="right">Memoria (MB)</TableCell>
              <TableCell align="right">Errores (%)</TableCell>
              <TableCell align="right">Uso (%)</TableCell>
              <TableCell align="center">Estado</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {componentMetrics.map((comp) => (
              <TableRow key={comp.component}>
                <TableCell component="th" scope="row">
                  <Typography variant="body2" fontWeight={500}>
                    {comp.component}
                  </Typography>
                </TableCell>
                <TableCell align="right">{comp.renderTime}</TableCell>
                <TableCell align="right">{comp.memoryUsage}</TableCell>
                <TableCell align="right">{comp.errorRate}</TableCell>
                <TableCell align="right">{comp.usageFrequency}</TableCell>
                <TableCell align="center">
                  <Chip
                    size="small"
                    label={comp.status}
                    color={comp.status === 'healthy' ? 'success' : comp.status === 'warning' ? 'warning' : 'error'}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
  
  // 🎨 Render análisis de bundle
  const renderBundleAnalysis = () => (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <BundleIcon />
        Análisis de Bundle
      </Typography>
      
      <Grid container spacing={2} sx={{ mt: 1 }}>
        <Grid item xs={6} sm={3}>
          <Box sx={{ textAlign: 'center', p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
            <Typography variant="h5" color="primary">{bundleAnalysis.totalSize}KB</Typography>
            <Typography variant="body2" color="text.secondary">Total</Typography>
          </Box>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Box sx={{ textAlign: 'center', p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
            <Typography variant="h5" color="secondary">{bundleAnalysis.gzippedSize}KB</Typography>
            <Typography variant="body2" color="text.secondary">Gzipped</Typography>
          </Box>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Box sx={{ textAlign: 'center', p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
            <Typography variant="h5" color="info.main">{bundleAnalysis.componentsCount}</Typography>
            <Typography variant="body2" color="text.secondary">Componentes</Typography>
          </Box>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Box sx={{ textAlign: 'center', p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
            <Typography variant="h5" color="warning.main">{bundleAnalysis.duplicateCode}KB</Typography>
            <Typography variant="body2" color="text.secondary">Duplicado</Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
  
  // 🎨 Render alertas
  const renderAlerts = () => {
    const filteredAlerts = showOnlyWarnings 
      ? alerts.filter(alert => alert.type === 'warning' || alert.type === 'critical')
      : alerts;
    
    return (
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Badge badgeContent={alerts.filter(a => !a.resolved).length} color="error">
              <WarningIcon />
            </Badge>
            Alertas de Performance
          </Typography>
          <FormControlLabel
            control={
              <Switch
                checked={showOnlyWarnings}
                onChange={(e) => setShowOnlyWarnings(e.target.checked)}
              />
            }
            label="Solo críticas"
          />
        </Box>
        
        <Stack spacing={1}>
          {filteredAlerts.length === 0 ? (
            <Alert severity="success">
              <AlertTitle>¡Todo funcionando perfectamente!</AlertTitle>
              No hay alertas de performance en este momento.
            </Alert>
          ) : (
            filteredAlerts.map((alert) => (
              <Alert
                key={alert.id}
                severity={alert.type}
                action={
                  <IconButton size="small" onClick={() => {}}>
                    {alert.resolved ? <SuccessIcon /> : <ViewIcon />}
                  </IconButton>
                }
              >
                <AlertTitle>{alert.metric}</AlertTitle>
                {alert.message}
                <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
                  {alert.timestamp.toLocaleTimeString()}
                </Typography>
              </Alert>
            ))
          )}
        </Stack>
      </Box>
    );
  };
  
  if (isLoading) {
    return (
      <RevolutionaryWidget
        title="🚀 Design System Performance"
        element={element}
        cosmicIntensity={cosmicIntensity}
      >
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      </RevolutionaryWidget>
    );
  }
  
  return (
    <RevolutionaryWidget
      title="🚀 Design System Performance"
      subtitle={`Salud del sistema: ${overallHealth.score}% - ${overallHealth.status.toUpperCase()}`}
      element={element}
      cosmicIntensity={cosmicIntensity}
      actions={
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Actualizar métricas">
            <IconButton onClick={handleRefresh} disabled={isRefreshing}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Configuración">
            <IconButton>
              <MonitorIcon />
            </IconButton>
          </Tooltip>
        </Box>
      }
      cosmicEffects={{
        enableGlow: true,
        enableAnimations: true,
        glowIntensity: cosmicIntensity === 'intense' ? 1.5 : 1
      }}
    >
      {/* 📊 Overview de métricas principales */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <SpeedIcon />
          Métricas Principales
        </Typography>
        
        <Grid container spacing={2}>
          {metrics.map(renderMetricCard)}
        </Grid>
      </Box>
      
      <Divider sx={{ my: 3 }} />
      
      {/* 🔍 Secciones expandibles */}
      
      {/* Análisis de componentes */}
      {showComponentDetails && (
        <Accordion 
          expanded={expandedSection === 'components'} 
          onChange={handleAccordionChange('components')}
          sx={{ mb: 2 }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Análisis de Componentes</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {renderComponentAnalysis()}
          </AccordionDetails>
        </Accordion>
      )}
      
      {/* Análisis de bundle */}
      {showBundleAnalysis && (
        <Accordion 
          expanded={expandedSection === 'bundle'} 
          onChange={handleAccordionChange('bundle')}
          sx={{ mb: 2 }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Análisis de Bundle</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {renderBundleAnalysis()}
          </AccordionDetails>
        </Accordion>
      )}
      
      {/* Alertas */}
      {showAlerts && (
        <Accordion 
          expanded={expandedSection === 'alerts'} 
          onChange={handleAccordionChange('alerts')}
          sx={{ mb: 2 }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Alertas de Performance</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {renderAlerts()}
          </AccordionDetails>
        </Accordion>
      )}
    </RevolutionaryWidget>
  );
};

export default PerformanceMonitor; 