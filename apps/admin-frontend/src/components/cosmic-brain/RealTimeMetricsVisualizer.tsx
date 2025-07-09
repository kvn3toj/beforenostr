import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  IconButton,
  Tooltip,
  Switch,
  FormControlLabel,
  Chip,
  useTheme,
  alpha,
  LinearProgress
} from '@mui/material';
import {
  Timeline,
  TrendingUp,
  TrendingDown,
  Refresh,
  Pause,
  PlayArrow,
  BarChart,
  ShowChart,
  PieChart,
  Insights,
  Psychology,
  Speed,
  Favorite
} from '@mui/icons-material';

interface MetricData {
  timestamp: number;
  value: number;
  label: string;
}

interface SystemMetrics {
  performance: MetricData[];
  harmony: MetricData[];
  efficiency: MetricData[];
  connections: MetricData[];
  tasks: MetricData[];
  health: MetricData[];
}

interface RealTimeMetricsVisualizerProps {
  metrics: SystemMetrics;
  isRealTime?: boolean;
  onToggleRealTime?: (enabled: boolean) => void;
  onRefresh?: () => void;
  updateInterval?: number;
  maxDataPoints?: number;
}

const RealTimeMetricsVisualizer: React.FC<RealTimeMetricsVisualizerProps> = ({
  metrics,
  isRealTime = true,
  onToggleRealTime,
  onRefresh,
  updateInterval = 5000,
  maxDataPoints = 20
}) => {
  const theme = useTheme();
  const [isPaused, setIsPaused] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState<keyof SystemMetrics>('performance');
  const [chartType, setChartType] = useState<'line' | 'bar' | 'area'>('line');

  // Simulated real-time data generation for demo
  const [simulatedData, setSimulatedData] = useState<SystemMetrics>(metrics);

  useEffect(() => {
    if (!isRealTime || isPaused) return;

    const interval = setInterval(() => {
      setSimulatedData(prev => {
        const newData = { ...prev };
        const now = Date.now();
        
        // Generate new data points for each metric
        Object.keys(newData).forEach(key => {
          const metricKey = key as keyof SystemMetrics;
          const currentMetrics = newData[metricKey];
          const lastValue = currentMetrics[currentMetrics.length - 1]?.value || 50;
          
          // Add some randomness to simulate real data
          const variation = (Math.random() - 0.5) * 10;
          const newValue = Math.max(0, Math.min(100, lastValue + variation));
          
          const newPoint: MetricData = {
            timestamp: now,
            value: newValue,
            label: new Date(now).toLocaleTimeString()
          };
          
          // Keep only the last maxDataPoints
          newData[metricKey] = [...currentMetrics.slice(-(maxDataPoints - 1)), newPoint];
        });
        
        return newData;
      });
    }, updateInterval);

    return () => clearInterval(interval);
  }, [isRealTime, isPaused, updateInterval, maxDataPoints]);

  const currentMetrics = useMemo(() => {
    const data = simulatedData[selectedMetric];
    if (!data.length) return null;
    
    const current = data[data.length - 1];
    const previous = data[data.length - 2];
    const trend = previous ? current.value - previous.value : 0;
    const average = data.reduce((sum, point) => sum + point.value, 0) / data.length;
    
    return {
      current: current.value,
      trend,
      average,
      min: Math.min(...data.map(p => p.value)),
      max: Math.max(...data.map(p => p.value))
    };
  }, [simulatedData, selectedMetric]);

  const getMetricIcon = (metric: keyof SystemMetrics) => {
    switch (metric) {
      case 'performance':
        return <Speed />;
      case 'harmony':
        return <Favorite />;
      case 'efficiency':
        return <TrendingUp />;
      case 'connections':
        return <Psychology />;
      case 'tasks':
        return <BarChart />;
      case 'health':
        return <Insights />;
      default:
        return <ShowChart />;
    }
  };

  const getMetricColor = (metric: keyof SystemMetrics) => {
    switch (metric) {
      case 'performance':
        return theme.palette.primary.main;
      case 'harmony':
        return theme.palette.secondary.main;
      case 'efficiency':
        return theme.palette.success.main;
      case 'connections':
        return theme.palette.info.main;
      case 'tasks':
        return theme.palette.warning.main;
      case 'health':
        return theme.palette.error.main;
      default:
        return theme.palette.grey[500];
    }
  };

  const renderMiniChart = (data: MetricData[], color: string) => {
    const maxValue = Math.max(...data.map(p => p.value));
    const minValue = Math.min(...data.map(p => p.value));
    const range = maxValue - minValue || 1;
    
    return (
      <Box sx={{ height: 40, display: 'flex', alignItems: 'end', gap: 1 }}>
        {data.slice(-10).map((point, index) => {
          const height = ((point.value - minValue) / range) * 30 + 5;
          return (
            <Box
              key={index}
              sx={{
                width: 3,
                height: `${height}px`,
                backgroundColor: color,
                borderRadius: 1,
                opacity: 0.7 + (index / 10) * 0.3,
              }}
            />
          );
        })}
      </Box>
    );
  };

  const renderMainChart = () => {
    const data = simulatedData[selectedMetric];
    const color = getMetricColor(selectedMetric);
    
    return (
      <Box sx={{ height: 200, position: 'relative', p: 2 }}>
        <svg width="100%" height="100%" viewBox="0 0 400 160">
          <defs>
            <linearGradient id={`gradient-${selectedMetric}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={color} stopOpacity={0.3} />
              <stop offset="100%" stopColor={color} stopOpacity={0.1} />
            </linearGradient>
          </defs>
          
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map(y => (
            <line
              key={y}
              x1="0"
              y1={160 - (y * 1.6)}
              x2="400"
              y2={160 - (y * 1.6)}
              stroke={alpha(theme.palette.text.secondary, 0.1)}
              strokeWidth="1"
            />
          ))}
          
          {/* Data visualization */}
          {data.length > 1 && (
            <>
              {/* Area fill */}
              <path
                d={`M 0 160 ${data.map((point, index) => 
                  `L ${(index / (data.length - 1)) * 400} ${160 - (point.value * 1.6)}`
                ).join(' ')} L 400 160 Z`}
                fill={`url(#gradient-${selectedMetric})`}
              />
              
              {/* Line */}
              <path
                d={`M ${data.map((point, index) => 
                  `${(index / (data.length - 1)) * 400} ${160 - (point.value * 1.6)}`
                ).join(' L ')}`}
                fill="none"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              
              {/* Data points */}
              {data.map((point, index) => (
                <circle
                  key={index}
                  cx={(index / (data.length - 1)) * 400}
                  cy={160 - (point.value * 1.6)}
                  r="3"
                  fill={color}
                  stroke="white"
                  strokeWidth="2"
                  opacity={0.8}
                />
              ))}
            </>
          )}
        </svg>
        
        {/* Y-axis labels */}
        <Box sx={{ position: 'absolute', left: -10, top: 0, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          {[100, 75, 50, 25, 0].map(value => (
            <Typography key={value} variant="caption" color="text.secondary" sx={{ lineHeight: 1 }}>
              {value}
            </Typography>
          ))}
        </Box>
      </Box>
    );
  };

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Timeline color="primary" />
            <Typography variant="h6" component="h3">
              Métricas en Tiempo Real
            </Typography>
            {isRealTime && (
              <Chip
                label="LIVE"
                size="small"
                color="success"
                sx={{ animation: 'pulse 2s infinite' }}
              />
            )}
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={isRealTime}
                  onChange={(e) => onToggleRealTime?.(e.target.checked)}
                  size="small"
                />
              }
              label="Tiempo Real"
            />
            <Tooltip title={isPaused ? "Reanudar" : "Pausar"}>
              <IconButton
                size="small"
                onClick={() => setIsPaused(!isPaused)}
                disabled={!isRealTime}
              >
                {isPaused ? <PlayArrow /> : <Pause />}
              </IconButton>
            </Tooltip>
            <Tooltip title="Actualizar">
              <IconButton size="small" onClick={onRefresh}>
                <Refresh />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Metric Selection */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {Object.entries(simulatedData).map(([key, data]) => {
            const metricKey = key as keyof SystemMetrics;
            const isSelected = selectedMetric === metricKey;
            const color = getMetricColor(metricKey);
            const currentValue = data[data.length - 1]?.value || 0;
            
            return (
              <Grid item xs={12} sm={6} md={4} key={key}>
                <Card
                  sx={{
                    cursor: 'pointer',
                    border: isSelected ? `2px solid ${color}` : `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    backgroundColor: isSelected ? alpha(color, 0.05) : 'background.paper',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: theme.shadows[4],
                    },
                  }}
                  onClick={() => setSelectedMetric(metricKey)}
                >
                  <CardContent sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {React.cloneElement(getMetricIcon(metricKey), { 
                          sx: { color, fontSize: 20 } 
                        })}
                        <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                          {key}
                        </Typography>
                      </Box>
                      <Typography variant="h6" sx={{ color, fontWeight: 600 }}>
                        {currentValue.toFixed(1)}%
                      </Typography>
                    </Box>
                    {renderMiniChart(data, color)}
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>

        {/* Main Chart */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ textTransform: 'capitalize' }}>
              {selectedMetric} - Vista Detallada
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {['line', 'bar', 'area'].map(type => (
                <IconButton
                  key={type}
                  size="small"
                  onClick={() => setChartType(type as any)}
                  sx={{
                    backgroundColor: chartType === type ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
                    color: chartType === type ? theme.palette.primary.main : theme.palette.text.secondary,
                  }}
                >
                  {type === 'line' && <ShowChart />}
                  {type === 'bar' && <BarChart />}
                  {type === 'area' && <PieChart />}
                </IconButton>
              ))}
            </Box>
          </Box>
          
          <Box sx={{ border: `1px solid ${alpha(theme.palette.divider, 0.1)}`, borderRadius: 2, p: 2 }}>
            {renderMainChart()}
          </Box>
        </Box>

        {/* Statistics */}
        {currentMetrics && (
          <Grid container spacing={2}>
            <Grid item xs={6} sm={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Actual
                </Typography>
                <Typography variant="h6" sx={{ color: getMetricColor(selectedMetric) }}>
                  {currentMetrics.current.toFixed(1)}%
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Tendencia
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                  {currentMetrics.trend > 0 ? (
                    <TrendingUp color="success" fontSize="small" />
                  ) : (
                    <TrendingDown color="error" fontSize="small" />
                  )}
                  <Typography variant="body2" sx={{ 
                    color: currentMetrics.trend > 0 ? theme.palette.success.main : theme.palette.error.main 
                  }}>
                    {Math.abs(currentMetrics.trend).toFixed(1)}%
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Promedio
                </Typography>
                <Typography variant="body2">
                  {currentMetrics.average.toFixed(1)}%
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Rango
                </Typography>
                <Typography variant="body2">
                  {currentMetrics.min.toFixed(1)}% - {currentMetrics.max.toFixed(1)}%
                </Typography>
              </Box>
            </Grid>
          </Grid>
        )}
      </CardContent>
    </Card>
  );
};

export default RealTimeMetricsVisualizer;