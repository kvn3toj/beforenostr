/**
 * 🌐 RealTimeMetricsVisualizer Component - Enhanced Version
 * 
 * Visualizador avanzado de métricas en tiempo real del AI Cosmic Brain.
 * Incluye gráficos interactivos, tendencias y alertas inteligentes.
 * 
 * Filosofía CoomÜnity:
 * - Bien Común: Métricas accesibles para todo el equipo
 * - Ayni: Balance entre información y acción
 * - Neguentropía: Visualización clara y organizada
 * - Metanöia: Evolución continua de las métricas
 */

import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  Chip,
  LinearProgress,
  IconButton,
  Tooltip,
  useTheme,
  alpha,
  Stack,
  Divider,
  Button
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Remove,
  Refresh,
  Timeline,
  Analytics,
  Speed,
  Memory,
  CloudQueue,
  Security,
  Notifications,
  AutoAwesome
} from '@mui/icons-material';

// ============================================================================
// 🎯 Types & Interfaces
// ============================================================================

interface MetricData {
  label: string;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  target?: number;
  status: 'excellent' | 'good' | 'warning' | 'critical';
  history?: number[];
}

interface SystemAlert {
  id: string;
  type: 'info' | 'warning' | 'error';
  message: string;
  timestamp: Date;
  resolved: boolean;
}

interface RealTimeMetricsProps {
  onRefresh?: () => void;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

// ============================================================================
// 🎨 Mock Data Generator
// ============================================================================

const generateMockMetrics = (): MetricData[] => {
  const baseTime = Date.now();
  const variance = () => Math.random() * 0.2 - 0.1; // ±10% variance
  
  return [
    {
      label: 'System Health',
      value: 89 + variance() * 10,
      unit: '%',
      trend: 'up',
      target: 95,
      status: 'good',
      history: Array.from({ length: 20 }, (_, i) => 85 + Math.sin(i * 0.3) * 8 + variance() * 5)
    },
    {
      label: 'Response Time',
      value: 172 + variance() * 50,
      unit: 'ms',
      trend: 'stable',
      target: 150,
      status: 'warning',
      history: Array.from({ length: 20 }, (_, i) => 160 + Math.sin(i * 0.4) * 30 + variance() * 10)
    },
    {
      label: 'Accuracy',
      value: 92 + variance() * 5,
      unit: '%',
      trend: 'up',
      target: 95,
      status: 'good',
      history: Array.from({ length: 20 }, (_, i) => 90 + Math.sin(i * 0.2) * 4 + variance() * 3)
    },
    {
      label: 'Uptime',
      value: 99.2 + variance() * 0.5,
      unit: '%',
      trend: 'stable',
      target: 99.9,
      status: 'excellent',
      history: Array.from({ length: 20 }, (_, i) => 99 + Math.sin(i * 0.1) * 0.8 + variance() * 0.3)
    },
    {
      label: 'Memory Usage',
      value: 68 + variance() * 15,
      unit: '%',
      trend: 'down',
      target: 80,
      status: 'good',
      history: Array.from({ length: 20 }, (_, i) => 65 + Math.sin(i * 0.5) * 12 + variance() * 8)
    },
    {
      label: 'Philosophy Alignment',
      value: 94 + variance() * 4,
      unit: '%',
      trend: 'up',
      target: 98,
      status: 'excellent',
      history: Array.from({ length: 20 }, (_, i) => 92 + Math.sin(i * 0.3) * 6 + variance() * 2)
    }
  ];
};

const generateMockAlerts = (): SystemAlert[] => [
  {
    id: '1',
    type: 'warning',
    message: 'PYTHIA Guardian response time above threshold',
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    resolved: false
  },
  {
    id: '2',
    type: 'info',
    message: 'System evolution completed successfully',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    resolved: true
  },
  {
    id: '3',
    type: 'error',
    message: 'Critical issue detected in architecture analysis',
    timestamp: new Date(Date.now() - 45 * 60 * 1000),
    resolved: false
  }
];

// ============================================================================
// 🎯 Main Component
// ============================================================================

const RealTimeMetricsVisualizerEnhanced: React.FC<RealTimeMetricsProps> = ({
  onRefresh,
  autoRefresh = true,
  refreshInterval = 30000
}) => {
  const theme = useTheme();
  const [metrics, setMetrics] = useState<MetricData[]>([]);
  const [alerts, setAlerts] = useState<SystemAlert[]>([]);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [isLoading, setIsLoading] = useState(false);

  // ============================================================================
  // 🔄 Data Management
  // ============================================================================

  const refreshMetrics = async () => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setMetrics(generateMockMetrics());
    setAlerts(generateMockAlerts());
    setLastUpdate(new Date());
    setIsLoading(false);
    
    if (onRefresh) {
      onRefresh();
    }
  };

  useEffect(() => {
    refreshMetrics();
    
    if (autoRefresh) {
      const interval = setInterval(refreshMetrics, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval]);

  // ============================================================================
  // 🎨 Style Helpers
  // ============================================================================

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return theme.palette.success.main;
      case 'good': return theme.palette.info.main;
      case 'warning': return theme.palette.warning.main;
      case 'critical': return theme.palette.error.main;
      default: return theme.palette.grey[500];
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp sx={{ color: theme.palette.success.main, fontSize: 16 }} />;
      case 'down': return <TrendingDown sx={{ color: theme.palette.error.main, fontSize: 16 }} />;
      case 'stable': return <Remove sx={{ color: theme.palette.grey[500], fontSize: 16 }} />;
      default: return null;
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'info': return <Notifications sx={{ color: theme.palette.info.main }} />;
      case 'warning': return <Notifications sx={{ color: theme.palette.warning.main }} />;
      case 'error': return <Notifications sx={{ color: theme.palette.error.main }} />;
      default: return <Notifications />;
    }
  };

  // ============================================================================
  // 🎨 Render Methods
  // ============================================================================

  const renderMetricCard = (metric: MetricData) => (
    <Card
      key={metric.label}
      sx={{
        height: '100%',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: theme.shadows[4]
        },
        borderLeft: `3px solid ${getStatusColor(metric.status)}`
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2" color="text.secondary">
            {metric.label}
          </Typography>
          {getTrendIcon(metric.trend)}
        </Box>
        
        <Typography variant="h4" fontWeight="bold" color={getStatusColor(metric.status)} gutterBottom>
          {metric.value.toFixed(1)}{metric.unit}
        </Typography>
        
        {metric.target && (
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Target: {metric.target}{metric.unit}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {((metric.value / metric.target) * 100).toFixed(0)}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={Math.min((metric.value / metric.target) * 100, 100)}
              sx={{
                height: 6,
                borderRadius: 3,
                backgroundColor: alpha(getStatusColor(metric.status), 0.1),
                '& .MuiLinearProgress-bar': {
                  backgroundColor: getStatusColor(metric.status),
                  borderRadius: 3
                }
              }}
            />
          </Box>
        )}
        
        <Chip
          label={metric.status.toUpperCase()}
          size="small"
          sx={{
            backgroundColor: alpha(getStatusColor(metric.status), 0.1),
            color: getStatusColor(metric.status),
            fontWeight: 'bold'
          }}
        />
      </CardContent>
    </Card>
  );

  const renderSystemAlerts = () => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" fontWeight="bold">
            System Alerts
          </Typography>
          <Chip
            label={alerts.filter(a => !a.resolved).length}
            size="small"
            color="error"
            sx={{ minWidth: 24 }}
          />
        </Box>
        
        <Stack spacing={2}>
          {alerts.slice(0, 3).map((alert) => (
            <Box
              key={alert.id}
              sx={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 2,
                p: 2,
                borderRadius: 2,
                backgroundColor: alpha(
                  alert.type === 'error' ? theme.palette.error.main :
                  alert.type === 'warning' ? theme.palette.warning.main :
                  theme.palette.info.main,
                  0.1
                ),
                opacity: alert.resolved ? 0.6 : 1
              }}
            >
              {getAlertIcon(alert.type)}
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" fontWeight="medium">
                  {alert.message}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {alert.timestamp.toLocaleTimeString()}
                  {alert.resolved && ' • Resolved'}
                </Typography>
              </Box>
            </Box>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );

  const renderSystemOverview = () => {
    const overallHealth = metrics.reduce((sum, m) => sum + m.value, 0) / metrics.length;
    const criticalIssues = alerts.filter(a => a.type === 'error' && !a.resolved).length;
    const warningIssues = alerts.filter(a => a.type === 'warning' && !a.resolved).length;
    
    return (
      <Card
        sx={{
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
          border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`
        }}
      >
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6" fontWeight="bold">
              System Overview
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Tooltip title="Refresh Metrics">
                <IconButton
                  size="small"
                  onClick={refreshMetrics}
                  disabled={isLoading}
                  sx={{
                    animation: isLoading ? 'spin 1s linear infinite' : 'none',
                    '@keyframes spin': {
                      '0%': { transform: 'rotate(0deg)' },
                      '100%': { transform: 'rotate(360deg)' }
                    }
                  }}
                >
                  <Refresh />
                </IconButton>
              </Tooltip>
              <Tooltip title="Auto-refresh enabled">
                <AutoAwesome sx={{ color: theme.palette.primary.main }} />
              </Tooltip>
            </Box>
          </Box>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3" fontWeight="bold" color="primary">
                  {overallHealth.toFixed(0)}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Overall Health
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3" fontWeight="bold" color="success.main">
                  {metrics.filter(m => m.status === 'excellent').length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Excellent Metrics
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3" fontWeight="bold" color="warning.main">
                  {warningIssues}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Warnings
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3" fontWeight="bold" color="error.main">
                  {criticalIssues}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Critical Issues
                </Typography>
              </Box>
            </Grid>
          </Grid>
          
          <Divider sx={{ my: 2 }} />
          
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="body2" color="text.secondary">
              Last Updated: {lastUpdate.toLocaleTimeString()}
            </Typography>
            <Chip
              label={autoRefresh ? 'Auto-refresh ON' : 'Auto-refresh OFF'}
              size="small"
              color={autoRefresh ? 'success' : 'default'}
            />
          </Box>
        </CardContent>
      </Card>
    );
  };

  return (
    <Box sx={{ width: '100%' }}>
      {/* System Overview */}
      <Box sx={{ mb: 3 }}>
        {renderSystemOverview()}
      </Box>
      
      {/* Metrics Grid */}
      <Grid container spacing={3}>
        {/* Metrics Cards */}
        {metrics.map((metric) => (
          <Grid item xs={12} sm={6} md={4} key={metric.label}>
            {renderMetricCard(metric)}
          </Grid>
        ))}
        
        {/* System Alerts */}
        <Grid item xs={12} md={6}>
          {renderSystemAlerts()}
        </Grid>
      </Grid>
    </Box>
  );
};

export default RealTimeMetricsVisualizerEnhanced;
