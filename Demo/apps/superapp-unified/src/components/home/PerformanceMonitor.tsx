import React, { useState, useEffect, useCallback, useMemo } from 'react';

// 🎯 REGLA #1: IMPORTS ESPECÍFICOS DE MATERIAL UI
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import LinearProgress from '@mui/material/LinearProgress';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import Divider from '@mui/material/Divider';
import { useTheme, alpha } from '@mui/material';

// 🎯 REGLA #1: IMPORTS ESPECÍFICOS DE ICONOS
import SpeedIcon from '@mui/icons-material/Speed';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import MemoryIcon from '@mui/icons-material/Memory';
import TimerIcon from '@mui/icons-material/Timer';
import BoltIcon from '@mui/icons-material/Bolt';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import MonitorIcon from '@mui/icons-material/Monitor';
import NetworkCheckIcon from '@mui/icons-material/NetworkCheck';

interface PerformanceMetrics {
  renderTime: number;
  interactiveTime: number;
  lastOptimization: Date;
  memoryUsage?: number;
  networkLatency?: number;
  cacheHitRate?: number;
}

interface PerformanceMonitorProps {
  metrics: PerformanceMetrics;
  isVisible?: boolean;
  performanceMode: 'normal' | 'optimized';
  onToggleMode: () => void;
  className?: string;
}

// 🎯 Hook para monitoreo de performance en tiempo real
const useRealTimePerformance = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    renderTime: 0,
    interactiveTime: 0,
    lastOptimization: new Date(),
  });

  const updateMetrics = useCallback(() => {
    // Simular métricas reales (en producción se conectaría a APIs reales)
    const now = performance.now();
    const memoryInfo = (performance as any).memory;

    setMetrics((prev) => ({
      ...prev,
      renderTime: now,
      interactiveTime: now,
      lastOptimization: new Date(),
      memoryUsage: memoryInfo
        ? Math.round(memoryInfo.usedJSHeapSize / 1024 / 1024)
        : 0,
      networkLatency: Math.random() * 100 + 50, // Simulated
      cacheHitRate: Math.random() * 40 + 60, // Simulated 60-100%
    }));
  }, []);

  useEffect(() => {
    updateMetrics();
    const interval = setInterval(updateMetrics, 5000); // Actualizar cada 5 segundos
    return () => clearInterval(interval);
  }, [updateMetrics]);

  return metrics;
};

const PerformanceMetricCard: React.FC<{
  icon: React.ReactElement;
  label: string;
  value: string | number;
  unit?: string;
  trend?: 'up' | 'down' | 'stable';
  color: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
}> = ({ icon, label, value, unit = '', trend = 'stable', color }) => {
  const theme = useTheme();

  const getColorValue = (colorName: typeof color) => {
    return theme.palette[colorName].main;
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUpIcon sx={{ fontSize: 16, color: 'success.main' }} />;
      case 'down':
        return (
          <TrendingUpIcon
            sx={{
              fontSize: 16,
              color: 'error.main',
              transform: 'rotate(180deg)',
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Card
      elevation={0}
      sx={{
        bgcolor: alpha(getColorValue(color), 0.08),
        border: `1px solid ${alpha(getColorValue(color), 0.2)}`,
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          bgcolor: alpha(getColorValue(color), 0.12),
          transform: 'translateY(-2px)',
          boxShadow: `0 4px 12px ${alpha(getColorValue(color), 0.2)}`,
        },
      }}
    >
      <CardContent sx={{ p: 2 }}>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
          <Box sx={{ color: getColorValue(color) }}>{icon}</Box>
          <Typography
            variant="caption"
            color="text.secondary"
            fontWeight="medium"
          >
            {label}
          </Typography>
          {getTrendIcon()}
        </Stack>
        <Typography
          variant="h6"
          fontWeight="bold"
          sx={{ color: getColorValue(color) }}
        >
          {value}
          {unit}
        </Typography>
      </CardContent>
    </Card>
  );
};

export const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({
  metrics: externalMetrics,
  isVisible = true,
  performanceMode,
  onToggleMode,
  className,
}) => {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(false);
  const realTimeMetrics = useRealTimePerformance();

  // Combinar métricas externas con métricas en tiempo real
  const combinedMetrics = useMemo(
    () => ({
      ...realTimeMetrics,
      ...externalMetrics,
    }),
    [realTimeMetrics, externalMetrics]
  );

  const performanceScore = useMemo(() => {
    const renderScore = Math.max(0, 100 - combinedMetrics.renderTime / 10);
    const memoryScore = combinedMetrics.memoryUsage
      ? Math.max(0, 100 - combinedMetrics.memoryUsage / 2)
      : 100;
    const networkScore = combinedMetrics.networkLatency
      ? Math.max(0, 100 - combinedMetrics.networkLatency / 2)
      : 100;
    const cacheScore = combinedMetrics.cacheHitRate || 100;

    return Math.round(
      (renderScore + memoryScore + networkScore + cacheScore) / 4
    );
  }, [combinedMetrics]);

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'success';
    if (score >= 70) return 'warning';
    return 'error';
  };

  const toggleExpanded = useCallback(() => {
    setExpanded(!expanded);
  }, [expanded]);

  if (!isVisible) return null;

  return (
    <Box className={className}>
      <Card
        elevation={2}
        sx={{
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.03)} 100%)`,
          border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
        }}
      >
        <CardContent>
          {/* Header con score principal */}
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ mb: 2 }}
          >
            <Stack direction="row" alignItems="center" spacing={2}>
              <MonitorIcon sx={{ color: theme.palette.primary.main }} />
              <Box>
                <Typography variant="h6" fontWeight="bold">
                  Performance Monitor
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Tiempo real • Última actualización:{' '}
                  {combinedMetrics.lastOptimization.toLocaleTimeString()}
                </Typography>
              </Box>
            </Stack>

            <Stack direction="row" alignItems="center" spacing={1}>
              <Chip
                icon={<SpeedIcon />}
                label={`Score: ${performanceScore}%`}
                color={getScoreColor(performanceScore)}
                variant="outlined"
                sx={{ fontWeight: 'bold' }}
              />
              <Tooltip
                title={
                  performanceMode === 'normal'
                    ? 'Activar modo optimizado'
                    : 'Modo normal'
                }
              >
                <IconButton
                  onClick={onToggleMode}
                  sx={{
                    bgcolor:
                      performanceMode === 'optimized'
                        ? alpha(theme.palette.success.main, 0.1)
                        : 'transparent',
                    color:
                      performanceMode === 'optimized'
                        ? 'success.main'
                        : 'text.secondary',
                  }}
                >
                  <BoltIcon />
                </IconButton>
              </Tooltip>
              <IconButton onClick={toggleExpanded}>
                {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            </Stack>
          </Stack>

          {/* Progress bar del score principal */}
          <Box sx={{ mb: 2 }}>
            <LinearProgress
              variant="determinate"
              value={performanceScore}
              sx={{
                height: 8,
                borderRadius: 4,
                bgcolor: alpha(theme.palette.grey[500], 0.2),
                '& .MuiLinearProgress-bar': {
                  borderRadius: 4,
                  bgcolor: theme.palette[getScoreColor(performanceScore)].main,
                },
              }}
            />
          </Box>

          {/* Métricas detalladas (expandible) */}
          <Collapse in={expanded}>
            <Divider sx={{ my: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={6} sm={3}>
                <PerformanceMetricCard
                  icon={<TimerIcon />}
                  label="Render Time"
                  value={Math.round(combinedMetrics.renderTime)}
                  unit="ms"
                  color="primary"
                  trend={combinedMetrics.renderTime < 100 ? 'up' : 'down'}
                />
              </Grid>

              <Grid item xs={6} sm={3}>
                <PerformanceMetricCard
                  icon={<MemoryIcon />}
                  label="Memory Usage"
                  value={combinedMetrics.memoryUsage || 0}
                  unit="MB"
                  color="secondary"
                  trend={
                    combinedMetrics.memoryUsage &&
                    combinedMetrics.memoryUsage < 50
                      ? 'up'
                      : 'down'
                  }
                />
              </Grid>

              <Grid item xs={6} sm={3}>
                <PerformanceMetricCard
                  icon={<NetworkCheckIcon />}
                  label="Network"
                  value={Math.round(combinedMetrics.networkLatency || 0)}
                  unit="ms"
                  color="success"
                  trend={
                    combinedMetrics.networkLatency &&
                    combinedMetrics.networkLatency < 100
                      ? 'up'
                      : 'down'
                  }
                />
              </Grid>

              <Grid item xs={6} sm={3}>
                <PerformanceMetricCard
                  icon={<BoltIcon />}
                  label="Cache Hit"
                  value={Math.round(combinedMetrics.cacheHitRate || 0)}
                  unit="%"
                  color="warning"
                  trend={
                    combinedMetrics.cacheHitRate &&
                    combinedMetrics.cacheHitRate > 80
                      ? 'up'
                      : 'down'
                  }
                />
              </Grid>
            </Grid>

            {/* Recomendaciones basadas en performance */}
            <Box
              sx={{
                mt: 2,
                p: 2,
                bgcolor: alpha(theme.palette.info.main, 0.08),
                borderRadius: 2,
              }}
            >
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                💡 Recomendaciones
              </Typography>
              <Stack spacing={1}>
                {performanceScore < 70 && (
                  <Typography variant="caption" color="warning.main">
                    • Considera activar el modo optimizado para mejor
                    rendimiento
                  </Typography>
                )}
                {combinedMetrics.memoryUsage &&
                  combinedMetrics.memoryUsage > 100 && (
                    <Typography variant="caption" color="error.main">
                      • Alto uso de memoria detectado. Cierra pestañas
                      innecesarias
                    </Typography>
                  )}
                {combinedMetrics.networkLatency &&
                  combinedMetrics.networkLatency > 200 && (
                    <Typography variant="caption" color="warning.main">
                      • Conexión lenta detectada. Considera usar modo offline
                    </Typography>
                  )}
                {performanceScore >= 90 && (
                  <Typography variant="caption" color="success.main">
                    • ¡Excelente rendimiento! Todo funciona óptimamente
                  </Typography>
                )}
              </Stack>
            </Box>
          </Collapse>
        </CardContent>
      </Card>
    </Box>
  );
};

export default PerformanceMonitor;
