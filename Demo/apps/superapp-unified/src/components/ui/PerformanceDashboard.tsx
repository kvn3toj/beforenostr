/**
 * 🌌 PERFORMANCE DASHBOARD
 * ========================
 *
 * Dashboard centralizado de performance y optimización para el Design System CoomÜnity
 * Integra CriticalCSSExtractor, ServiceWorkerIntelligence y AutoBundleAnalyzer
 * Parte de la Fase 5: Optimización Extrema - Q3 2025
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  LinearProgress,
  Chip,
  Alert,
  Button,
  Tabs,
  Tab,
  IconButton,
  Tooltip,
  Switch,
  FormControlLabel,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Badge
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Speed as SpeedIcon,
  Memory as MemoryIcon,
  CloudDownload as CacheIcon,
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Refresh as RefreshIcon,
  Settings as SettingsIcon,
  ExpandMore as ExpandMoreIcon,
  Lightbulb as LightbulbIcon,
  Analytics as AnalyticsIcon,
  Cached as CachedIcon,
  NetworkCheck as NetworkIcon,
  BrushIcon,
  Code as CodeIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

// Import optimization systems
import { CriticalCSSExtractor } from '../../utils/performance/CriticalCSSExtractor';
import { serviceWorkerIntelligence } from '../../utils/performance/ServiceWorkerIntelligence';
import { AutoBundleAnalyzer } from '../../utils/performance/AutoBundleAnalyzer';

interface PerformanceScore {
  overall: number;
  bundleSize: number;
  cacheEfficiency: number;
  criticalCSS: number;
  webVitals: number;
}

interface PerformanceAlert {
  id: string;
  type: 'error' | 'warning' | 'info' | 'success';
  title: string;
  description: string;
  action?: string;
  autoFixable: boolean;
}

interface OptimizationSuggestion {
  id: string;
  category: 'critical-css' | 'bundle' | 'cache' | 'network' | 'images';
  title: string;
  description: string;
  estimatedImprovement: number;
  effort: 'low' | 'medium' | 'high';
  priority: number;
  implemented: boolean;
}

const PerformanceDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [isMonitoringEnabled, setIsMonitoringEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [performanceScore, setPerformanceScore] = useState<PerformanceScore>({
    overall: 0,
    bundleSize: 0,
    cacheEfficiency: 0,
    criticalCSS: 0,
    webVitals: 0
  });

  const [alerts, setAlerts] = useState<PerformanceAlert[]>([]);
  const [suggestions, setSuggestions] = useState<OptimizationSuggestion[]>([]);
  const [metricsData, setMetricsData] = useState<any>({});
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  /**
   * Inicialización del dashboard
   */
  useEffect(() => {
    initializeDashboard();

    const interval = setInterval(() => {
      if (isMonitoringEnabled) {
        refreshMetrics();
      }
    }, 30000); // Actualizar cada 30 segundos

    return () => clearInterval(interval);
  }, [isMonitoringEnabled]);

  /**
   * Inicializar sistemas de performance
   */
  const initializeDashboard = async () => {
    setIsLoading(true);

    try {
      // Inicializar Service Worker Intelligence
      await serviceWorkerIntelligence.registerServiceWorker();

      // Cargar métricas iniciales
      await loadPerformanceMetrics();

      // Generar sugerencias de optimización
      await generateOptimizationSuggestions();

      setIsLoading(false);
    } catch (error) {
      console.error('Error initializing performance dashboard:', error);
      setIsLoading(false);
    }
  };

  /**
   * Cargar métricas de performance desde todos los sistemas
   */
  const loadPerformanceMetrics = async () => {
    try {
      // Service Worker metrics
      const swReport = serviceWorkerIntelligence.getPerformanceReport();

      // Bundle analysis
      const bundleAnalysis = await AutoBundleAnalyzer.analyzeBundle();

      // Critical CSS analysis
      const criticalCSSReport = CriticalCSSExtractor.generateOptimizationReport();

      // Calcular score general
      const score = calculateOverallScore(swReport, bundleAnalysis, criticalCSSReport);
      setPerformanceScore(score);

      // Generar alertas
      const generatedAlerts = generateAlerts(swReport, bundleAnalysis, criticalCSSReport);
      setAlerts(generatedAlerts);

      // Almacenar datos para visualización
      setMetricsData({
        serviceWorker: swReport,
        bundle: bundleAnalysis,
        criticalCSS: criticalCSSReport
      });

      setLastUpdate(new Date());

    } catch (error) {
      console.error('Error loading performance metrics:', error);
    }
  };

  /**
   * Calcular score general de performance
   */
  const calculateOverallScore = (swReport: any, bundleAnalysis: any, criticalCSS: any): PerformanceScore => {
    const bundleScore = Math.max(0, 100 - (bundleAnalysis.metrics.totalSize / (250 * 1024)) * 100);
    const cacheScore = (swReport.metrics.cacheHits / (swReport.metrics.cacheHits + swReport.metrics.cacheMisses)) * 100 || 0;
    const criticalScore = Math.min(100, (criticalCSS.totalSavings / 40) * 100); // Target 40% reduction
    const webVitalsScore = Math.max(0, 100 - (swReport.metrics.firstContentfulPaint / 1600) * 100);

    const overall = (bundleScore + cacheScore + criticalScore + webVitalsScore) / 4;

    return {
      overall: Math.round(overall),
      bundleSize: Math.round(bundleScore),
      cacheEfficiency: Math.round(cacheScore),
      criticalCSS: Math.round(criticalScore),
      webVitals: Math.round(webVitalsScore)
    };
  };

  /**
   * Generar alertas basadas en métricas
   */
  const generateAlerts = (swReport: any, bundleAnalysis: any, criticalCSS: any): PerformanceAlert[] => {
    const alerts: PerformanceAlert[] = [];

    // Bundle size alerts
    if (bundleAnalysis.metrics.totalSize > 300 * 1024) {
      alerts.push({
        id: 'bundle-size-large',
        type: 'warning',
        title: 'Bundle Size Excesivo',
        description: `El bundle actual (${Math.round(bundleAnalysis.metrics.totalSize / 1024)}KB) excede el objetivo de 250KB`,
        action: 'Implementar code splitting',
        autoFixable: false
      });
    }

    // Cache efficiency alerts
    const cacheHitRate = (swReport.metrics.cacheHits / (swReport.metrics.cacheHits + swReport.metrics.cacheMisses)) || 0;
    if (cacheHitRate < 0.7) {
      alerts.push({
        id: 'cache-efficiency-low',
        type: 'error',
        title: 'Eficiencia de Cache Baja',
        description: `Cache hit rate (${Math.round(cacheHitRate * 100)}%) está por debajo del objetivo (85%)`,
        action: 'Optimizar estrategia de cache',
        autoFixable: true
      });
    }

    // First Contentful Paint alerts
    if (swReport.metrics.firstContentfulPaint > 1600) {
      alerts.push({
        id: 'fcp-slow',
        type: 'warning',
        title: 'First Contentful Paint Lento',
        description: `FCP (${swReport.metrics.firstContentfulPaint}ms) excede el objetivo de 1.6s`,
        action: 'Implementar Critical CSS',
        autoFixable: false
      });
    }

    // Critical CSS opportunities
    if (criticalCSS.totalSavings < 30) {
      alerts.push({
        id: 'critical-css-opportunity',
        type: 'info',
        title: 'Oportunidad de Critical CSS',
        description: 'Se puede mejorar el First Paint implementando Critical CSS extraction',
        action: 'Configurar extracción automática',
        autoFixable: true
      });
    }

    return alerts;
  };

  /**
   * Generar sugerencias de optimización
   */
  const generateOptimizationSuggestions = async () => {
    const suggestions: OptimizationSuggestion[] = [
      {
        id: 'implement-critical-css',
        category: 'critical-css',
        title: 'Implementar Critical CSS Automation',
        description: 'Automatizar la extracción e inline de CSS crítico para mejorar FCP en 40%',
        estimatedImprovement: 40,
        effort: 'medium',
        priority: 9,
        implemented: false
      },
      {
        id: 'optimize-bundle-splitting',
        category: 'bundle',
        title: 'Optimizar Code Splitting',
        description: 'Implementar dynamic imports para reducir bundle inicial en 30%',
        estimatedImprovement: 30,
        effort: 'high',
        priority: 8,
        implemented: false
      },
      {
        id: 'enhance-caching-strategy',
        category: 'cache',
        title: 'Mejorar Estrategia de Caching',
        description: 'Optimizar Service Worker para incrementar cache hit rate a 90%',
        estimatedImprovement: 25,
        effort: 'medium',
        priority: 7,
        implemented: false
      },
      {
        id: 'implement-image-optimization',
        category: 'images',
        title: 'Optimización Automática de Imágenes',
        description: 'Implementar WebP/AVIF automático y lazy loading inteligente',
        estimatedImprovement: 20,
        effort: 'medium',
        priority: 6,
        implemented: false
      },
      {
        id: 'network-preloading',
        category: 'network',
        title: 'Preloading Inteligente',
        description: 'Implementar preloading predictivo basado en patrones de navegación',
        estimatedImprovement: 15,
        effort: 'low',
        priority: 5,
        implemented: false
      }
    ];

    setSuggestions(suggestions.sort((a, b) => b.priority - a.priority));
  };

  /**
   * Refrescar métricas manualmente
   */
  const refreshMetrics = async () => {
    await loadPerformanceMetrics();
  };

  /**
   * Implementar sugerencia automáticamente
   */
  const implementSuggestion = async (suggestionId: string) => {
    const suggestion = suggestions.find(s => s.id === suggestionId);
    if (!suggestion) return;

    try {
      switch (suggestion.category) {
        case 'cache':
          // Implementar optimización de cache
          await serviceWorkerIntelligence.registerServiceWorker();
          break;
        case 'critical-css':
          // Extraer CSS crítico para ruta actual
          const currentRoute = window.location.pathname;
          const criticalCSS = CriticalCSSExtractor.extractCriticalCSS(currentRoute);
          console.log('Critical CSS extracted:', criticalCSS.length, 'bytes');
          break;
        // Más implementaciones...
      }

      // Marcar como implementado
      setSuggestions(prev =>
        prev.map(s =>
          s.id === suggestionId
            ? { ...s, implemented: true }
            : s
        )
      );

      // Refrescar métricas
      await refreshMetrics();

    } catch (error) {
      console.error('Error implementing suggestion:', error);
    }
  };

  /**
   * Obtener color para score
   */
  const getScoreColor = (score: number): string => {
    if (score >= 90) return '#4caf50'; // Verde
    if (score >= 70) return '#ff9800'; // Naranja
    return '#f44336'; // Rojo
  };

  /**
   * Formatear bytes
   */
  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
        <CircularProgress size={60} sx={{ color: '#9C27B0' }} />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Inicializando Performance Dashboard...
        </Typography>
      </Box>
    );
  }

  return (
    <Box className="performance-dashboard" sx={{ p: 3 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1" sx={{
          background: 'linear-gradient(45deg, #9C27B0, #E1BEE7)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          color: 'transparent',
          fontWeight: 700
        }}>
          🌌 Performance Dashboard
        </Typography>

        <Box display="flex" alignItems="center" gap={2}>
          <FormControlLabel
            control={
              <Switch
                checked={isMonitoringEnabled}
                onChange={(e) => setIsMonitoringEnabled(e.target.checked)}
                color="primary"
              />
            }
            label="Monitoreo Activo"
          />

          <Tooltip title="Refrescar métricas">
            <IconButton
              onClick={refreshMetrics}
              sx={{
                backgroundColor: 'rgba(156, 39, 176, 0.1)',
                '&:hover': { backgroundColor: 'rgba(156, 39, 176, 0.2)' }
              }}
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>

          <Typography variant="body2" color="text.secondary">
            Última actualización: {lastUpdate.toLocaleTimeString()}
          </Typography>
        </Box>
      </Box>

      {/* Score Overview Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={2.4}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card sx={{
              background: 'linear-gradient(135deg, rgba(156, 39, 176, 0.1), rgba(225, 190, 231, 0.1))',
              border: '1px solid rgba(156, 39, 176, 0.2)'
            }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <DashboardIcon sx={{ fontSize: 40, color: '#9C27B0', mb: 1 }} />
                <Typography variant="h3" sx={{
                  color: getScoreColor(performanceScore.overall),
                  fontWeight: 700
                }}>
                  {performanceScore.overall}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Score General
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={performanceScore.overall}
                  sx={{
                    mt: 1,
                    backgroundColor: 'rgba(156, 39, 176, 0.1)',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: getScoreColor(performanceScore.overall)
                    }
                  }}
                />
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        <Grid item xs={12} md={2.4}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <CodeIcon sx={{ fontSize: 40, color: '#FF9800', mb: 1 }} />
                <Typography variant="h4" sx={{
                  color: getScoreColor(performanceScore.bundleSize),
                  fontWeight: 600
                }}>
                  {performanceScore.bundleSize}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Bundle Size
                </Typography>
                <Typography variant="caption" display="block">
                  {formatBytes(metricsData.bundle?.metrics?.totalSize || 0)}
                </Typography>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        <Grid item xs={12} md={2.4}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <CachedIcon sx={{ fontSize: 40, color: '#4CAF50', mb: 1 }} />
                <Typography variant="h4" sx={{
                  color: getScoreColor(performanceScore.cacheEfficiency),
                  fontWeight: 600
                }}>
                  {performanceScore.cacheEfficiency}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Cache Hit Rate
                </Typography>
                <Typography variant="caption" display="block">
                  {metricsData.serviceWorker?.metrics?.cacheHits || 0} hits
                </Typography>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        <Grid item xs={12} md={2.4}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <BrushIcon sx={{ fontSize: 40, color: '#2196F3', mb: 1 }} />
                <Typography variant="h4" sx={{
                  color: getScoreColor(performanceScore.criticalCSS),
                  fontWeight: 600
                }}>
                  {performanceScore.criticalCSS}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Critical CSS
                </Typography>
                <Typography variant="caption" display="block">
                  {Math.round(metricsData.criticalCSS?.totalSavings || 0)}% reducción
                </Typography>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        <Grid item xs={12} md={2.4}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <SpeedIcon sx={{ fontSize: 40, color: '#9C27B0', mb: 1 }} />
                <Typography variant="h4" sx={{
                  color: getScoreColor(performanceScore.webVitals),
                  fontWeight: 600
                }}>
                  {performanceScore.webVitals}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Web Vitals
                </Typography>
                <Typography variant="caption" display="block">
                  FCP: {metricsData.serviceWorker?.metrics?.firstContentfulPaint || 0}ms
                </Typography>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>

      {/* Alerts */}
      {alerts.length > 0 && (
        <Box mb={3}>
          <Typography variant="h6" mb={2}>
            🚨 Alertas de Performance
          </Typography>
          {alerts.map((alert) => (
            <Alert
              key={alert.id}
              severity={alert.type}
              sx={{ mb: 1 }}
              action={
                alert.autoFixable && (
                  <Button color="inherit" size="small">
                    Auto-Fix
                  </Button>
                )
              }
            >
              <strong>{alert.title}</strong> - {alert.description}
            </Alert>
          ))}
        </Box>
      )}

      {/* Main Content Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          aria-label="Performance dashboard tabs"
        >
          <Tab icon={<AnalyticsIcon />} label="Análisis" />
          <Tab icon={<LightbulbIcon />} label="Optimizaciones" />
          <Tab icon={<SettingsIcon />} label="Configuración" />
        </Tabs>
      </Box>

      <AnimatePresence mode="wait">
        {activeTab === 0 && (
          <motion.div
            key="analysis"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Analysis Tab Content */}
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" mb={2}>
                      📊 Métricas de Bundle
                    </Typography>
                    {/* Bundle metrics visualization would go here */}
                    <Typography>Bundle analysis content...</Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" mb={2}>
                      🔄 Service Worker Stats
                    </Typography>
                    {/* Service Worker metrics would go here */}
                    <Typography>Service Worker stats...</Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </motion.div>
        )}

        {activeTab === 1 && (
          <motion.div
            key="optimizations"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Optimization Suggestions */}
            <Typography variant="h6" mb={3}>
              💡 Sugerencias de Optimización
            </Typography>

            {suggestions.map((suggestion) => (
              <Accordion key={suggestion.id}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box display="flex" alignItems="center" width="100%">
                    <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
                      {suggestion.title}
                    </Typography>
                    <Chip
                      label={`+${suggestion.estimatedImprovement}%`}
                      color="primary"
                      size="small"
                      sx={{ mr: 2 }}
                    />
                    <Chip
                      label={suggestion.effort}
                      color={suggestion.effort === 'low' ? 'success' : suggestion.effort === 'medium' ? 'warning' : 'error'}
                      size="small"
                      sx={{ mr: 2 }}
                    />
                    {suggestion.implemented && (
                      <CheckCircleIcon color="success" />
                    )}
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography paragraph>
                    {suggestion.description}
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => implementSuggestion(suggestion.id)}
                    disabled={suggestion.implemented}
                    startIcon={suggestion.implemented ? <CheckCircleIcon /> : <LightbulbIcon />}
                  >
                    {suggestion.implemented ? 'Implementado' : 'Implementar'}
                  </Button>
                </AccordionDetails>
              </Accordion>
            ))}
          </motion.div>
        )}

        {activeTab === 2 && (
          <motion.div
            key="settings"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Typography variant="h6" mb={3}>
              ⚙️ Configuración de Performance
            </Typography>
            <Typography>Configuration options would go here...</Typography>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
};

export default PerformanceDashboard;
