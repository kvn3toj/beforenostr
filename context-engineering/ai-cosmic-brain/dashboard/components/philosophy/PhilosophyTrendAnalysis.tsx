import React, { useState, useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  ToggleButton,
  ToggleButtonGroup,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  TrendingFlat as TrendingFlatIcon,
  Timeline as TimelineIcon,
  DateRange as DateRangeIcon,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { CoomUnityPhilosophyMetrics, TrendData, TimeRange } from '../types';
import {
  formatScoreAsPercentage,
  formatRelativeTime,
} from '../utils/dashboardHelpers';

/**
 * 🔄 PhilosophyTrendAnalysis - Análisis de Tendencias Filosóficas
 *
 * Componente especializado para analizar y visualizar las tendencias
 * históricas de alineación con los principios filosóficos CoomÜnity.
 *
 * Características:
 * - Gráficos de tendencias temporales
 * - Comparación entre principios
 * - Análisis de correlaciones
 * - Predicciones de tendencias
 * - Alertas de degradación filosófica
 * - Períodos de análisis configurables
 *
 * Filosofía aplicada:
 * - Metanöia: Facilita la transformación consciente mediante análisis histórico
 * - Neguentropía: Orden en la evolución temporal de la alineación
 * - Bien Común: Herramienta que beneficia la coherencia a largo plazo
 */

interface PhilosophyTrendAnalysisProps {
  /** Datos históricos de métricas filosóficas */
  historicalData?: PhilosophyHistoricalDataPoint[];
  /** Rango de tiempo por defecto */
  defaultTimeRange?: TimeRange;
  /** Principios a mostrar por defecto */
  defaultPrinciples?: string[];
  /** Callback para cambio de configuración */
  onConfigChange?: (config: TrendAnalysisConfig) => void;
}

// ============================================================================
// 🎯 Types and Interfaces
// ============================================================================

interface PhilosophyHistoricalDataPoint {
  timestamp: Date;
  metrics: CoomUnityPhilosophyMetrics;
  overallAlignment: number;
  context?: {
    commit?: string;
    version?: string;
    event?: string;
  };
}

interface TrendAnalysisConfig {
  timeRange: '1h' | '6h' | '24h' | '7d' | '30d' | '90d';
  viewType: 'line' | 'area' | 'comparison';
  selectedPrinciples: string[];
  showOverallTrend: boolean;
  showPredictions: boolean;
}

interface TrendAnalysisResult {
  principle: string;
  currentScore: number;
  previousScore: number;
  change: number;
  changePercentage: number;
  trend: 'improving' | 'declining' | 'stable';
  significance: 'high' | 'medium' | 'low';
  prediction?: {
    nextWeekScore: number;
    confidence: number;
  };
}

// ============================================================================
// 🎨 Configuration
// ============================================================================

const PRINCIPLE_COLORS = {
  bienComun: '#4caf50',
  ayni: '#2196f3',
  cooperacion: '#ff9800',
  economiaSagrada: '#9c27b0',
  metanoia: '#f44336',
  neguentropia: '#607d8b',
  vocacion: '#795548',
  overall: '#000000',
};

const PRINCIPLE_NAMES = {
  bienComun: 'Bien Común',
  ayni: 'Ayni',
  cooperacion: 'Cooperación',
  economiaSagrada: 'Economía Sagrada',
  metanoia: 'Metanöia',
  neguentropia: 'Neguentropía',
  vocacion: 'Vocación',
  overall: 'Alineación General',
};

const TIME_RANGE_OPTIONS = [
  { value: '1h', label: 'Última Hora' },
  { value: '6h', label: 'Últimas 6 Horas' },
  { value: '24h', label: 'Último Día' },
  { value: '7d', label: 'Última Semana' },
  { value: '30d', label: 'Último Mes' },
  { value: '90d', label: 'Últimos 3 Meses' },
];

// ============================================================================
// 🌟 Main Component
// ============================================================================

export const PhilosophyTrendAnalysis: React.FC<
  PhilosophyTrendAnalysisProps
> = ({
  historicalData = [],
  defaultTimeRange,
  defaultPrinciples = ['bienComun', 'ayni', 'cooperacion'],
  onConfigChange,
}) => {
  // ============================================================================
  // 🔄 State Management
  // ============================================================================

  const [config, setConfig] = useState<TrendAnalysisConfig>({
    timeRange: '24h',
    viewType: 'line',
    selectedPrinciples: defaultPrinciples,
    showOverallTrend: true,
    showPredictions: false,
  });

  // ============================================================================
  // 📊 Data Processing
  // ============================================================================

  const filteredData = useMemo(() => {
    if (!historicalData.length) return [];

    const now = new Date();
    const timeRangeMs = {
      '1h': 60 * 60 * 1000,
      '6h': 6 * 60 * 60 * 1000,
      '24h': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000,
      '90d': 90 * 24 * 60 * 60 * 1000,
    }[config.timeRange];

    const cutoffTime = new Date(now.getTime() - timeRangeMs);

    return historicalData
      .filter((point) => point.timestamp >= cutoffTime)
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }, [historicalData, config.timeRange]);

  const chartData = useMemo(() => {
    return filteredData.map((point) => {
      const dataPoint: any = {
        timestamp: point.timestamp.toISOString(),
        time: point.timestamp.toLocaleTimeString('es-ES', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        date: point.timestamp.toLocaleDateString('es-ES'),
      };

      // Add overall alignment if enabled
      if (config.showOverallTrend) {
        dataPoint.overall = point.overallAlignment * 100;
      }

      // Add selected principles
      config.selectedPrinciples.forEach((principle) => {
        const metric =
          point.metrics[principle as keyof CoomUnityPhilosophyMetrics];
        if (metric) {
          dataPoint[principle] = metric.score * 100;
        }
      });

      return dataPoint;
    });
  }, [filteredData, config.selectedPrinciples, config.showOverallTrend]);

  const trendAnalysis = useMemo((): TrendAnalysisResult[] => {
    if (filteredData.length < 2) return [];

    const latest = filteredData[filteredData.length - 1];
    const previous =
      filteredData[
        Math.max(0, filteredData.length - Math.ceil(filteredData.length * 0.1))
      ];

    const results: TrendAnalysisResult[] = [];

    // Analyze overall trend
    if (config.showOverallTrend) {
      const change = latest.overallAlignment - previous.overallAlignment;
      const changePercentage = (change / previous.overallAlignment) * 100;

      results.push({
        principle: 'overall',
        currentScore: latest.overallAlignment,
        previousScore: previous.overallAlignment,
        change,
        changePercentage,
        trend:
          Math.abs(change) < 0.01
            ? 'stable'
            : change > 0
              ? 'improving'
              : 'declining',
        significance:
          Math.abs(changePercentage) > 5
            ? 'high'
            : Math.abs(changePercentage) > 2
              ? 'medium'
              : 'low',
      });
    }

    // Analyze individual principles
    config.selectedPrinciples.forEach((principle) => {
      const latestMetric =
        latest.metrics[principle as keyof CoomUnityPhilosophyMetrics];
      const previousMetric =
        previous.metrics[principle as keyof CoomUnityPhilosophyMetrics];

      if (latestMetric && previousMetric) {
        const change = latestMetric.score - previousMetric.score;
        const changePercentage = (change / previousMetric.score) * 100;

        results.push({
          principle,
          currentScore: latestMetric.score,
          previousScore: previousMetric.score,
          change,
          changePercentage,
          trend:
            Math.abs(change) < 0.01
              ? 'stable'
              : change > 0
                ? 'improving'
                : 'declining',
          significance:
            Math.abs(changePercentage) > 10
              ? 'high'
              : Math.abs(changePercentage) > 5
                ? 'medium'
                : 'low',
        });
      }
    });

    return results;
  }, [filteredData, config.selectedPrinciples, config.showOverallTrend]);

  // ============================================================================
  // 🎯 Event Handlers
  // ============================================================================

  const handleConfigChange = (newConfig: Partial<TrendAnalysisConfig>) => {
    const updatedConfig = { ...config, ...newConfig };
    setConfig(updatedConfig);
    if (onConfigChange) {
      onConfigChange(updatedConfig);
    }
  };

  const handleTimeRangeChange = (event: any) => {
    handleConfigChange({ timeRange: event.target.value });
  };

  const handleViewTypeChange = (event: any, newViewType: string | null) => {
    if (newViewType) {
      handleConfigChange({ viewType: newViewType as any });
    }
  };

  const handlePrincipleToggle = (principle: string) => {
    const newPrinciples = config.selectedPrinciples.includes(principle)
      ? config.selectedPrinciples.filter((p) => p !== principle)
      : [...config.selectedPrinciples, principle];

    handleConfigChange({ selectedPrinciples: newPrinciples });
  };

  // ============================================================================
  // 🎨 Render Helpers
  // ============================================================================

  const renderControls = () => (
    <Card elevation={1} sx={{ mb: 3 }}>
      <CardContent>
        <Grid container spacing={3} alignItems="center">
          {/* Time Range */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Período</InputLabel>
              <Select
                value={config.timeRange}
                label="Período"
                onChange={handleTimeRangeChange}
              >
                {TIME_RANGE_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* View Type */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <ToggleButtonGroup
              value={config.viewType}
              exclusive
              onChange={handleViewTypeChange}
              size="small"
            >
              <ToggleButton value="line">Líneas</ToggleButton>
              <ToggleButton value="area">Áreas</ToggleButton>
              <ToggleButton value="comparison">Comparación</ToggleButton>
            </ToggleButtonGroup>
          </Grid>

          {/* Principle Selection */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle2" gutterBottom>
              Principios a Mostrar:
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={1}>
              {Object.entries(PRINCIPLE_NAMES)
                .filter(([key]) => key !== 'overall')
                .map(([key, name]) => (
                  <Chip
                    key={key}
                    label={name}
                    onClick={() => handlePrincipleToggle(key)}
                    color={
                      config.selectedPrinciples.includes(key)
                        ? 'primary'
                        : 'default'
                    }
                    variant={
                      config.selectedPrinciples.includes(key)
                        ? 'filled'
                        : 'outlined'
                    }
                    size="small"
                  />
                ))}
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );

  const renderTrendChart = () => {
    if (!chartData.length) {
      return (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <TimelineIcon sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
            <Typography variant="h6" color="textSecondary">
              No hay datos históricos disponibles
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Los datos de tendencias se generarán automáticamente a medida que
              el sistema analice la alineación filosófica
            </Typography>
          </CardContent>
        </Card>
      );
    }

    const ChartComponent = config.viewType === 'area' ? AreaChart : LineChart;

    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Tendencias de Alineación Filosófica
          </Typography>
          <ResponsiveContainer width="100%" height={400}>
            <ChartComponent data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" tick={{ fontSize: 12 }} />
              <YAxis
                domain={[0, 100]}
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `${value}%`}
              />
              <RechartsTooltip
                labelFormatter={(label) => `Tiempo: ${label}`}
                formatter={(value: number, name: string) => [
                  `${value.toFixed(1)}%`,
                  PRINCIPLE_NAMES[name as keyof typeof PRINCIPLE_NAMES] || name,
                ]}
              />
              <Legend />

              {/* Reference line at 70% (good alignment threshold) */}
              <ReferenceLine
                y={70}
                stroke="green"
                strokeDasharray="5 5"
                label="Umbral Bueno"
              />
              <ReferenceLine
                y={50}
                stroke="orange"
                strokeDasharray="5 5"
                label="Umbral Mínimo"
              />

              {/* Overall trend */}
              {config.showOverallTrend &&
                (config.viewType === 'area' ? (
                  <Area
                    type="monotone"
                    dataKey="overall"
                    stroke={PRINCIPLE_COLORS.overall}
                    fill={PRINCIPLE_COLORS.overall}
                    fillOpacity={0.3}
                    strokeWidth={3}
                  />
                ) : (
                  <Line
                    type="monotone"
                    dataKey="overall"
                    stroke={PRINCIPLE_COLORS.overall}
                    strokeWidth={3}
                    dot={{ r: 4 }}
                  />
                ))}

              {/* Individual principles */}
              {config.selectedPrinciples.map((principle) =>
                config.viewType === 'area' ? (
                  <Area
                    key={principle}
                    type="monotone"
                    dataKey={principle}
                    stroke={
                      PRINCIPLE_COLORS[
                        principle as keyof typeof PRINCIPLE_COLORS
                      ]
                    }
                    fill={
                      PRINCIPLE_COLORS[
                        principle as keyof typeof PRINCIPLE_COLORS
                      ]
                    }
                    fillOpacity={0.2}
                    strokeWidth={2}
                  />
                ) : (
                  <Line
                    key={principle}
                    type="monotone"
                    dataKey={principle}
                    stroke={
                      PRINCIPLE_COLORS[
                        principle as keyof typeof PRINCIPLE_COLORS
                      ]
                    }
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                )
              )}
            </ChartComponent>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    );
  };

  const renderTrendSummary = () => {
    if (!trendAnalysis.length) return null;

    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Resumen de Tendencias
          </Typography>
          <Grid container spacing={2}>
            {trendAnalysis.map((analysis) => {
              const TrendIcon =
                analysis.trend === 'improving'
                  ? TrendingUpIcon
                  : analysis.trend === 'declining'
                    ? TrendingDownIcon
                    : TrendingFlatIcon;

              const trendColor =
                analysis.trend === 'improving'
                  ? 'success.main'
                  : analysis.trend === 'declining'
                    ? 'error.main'
                    : 'grey.500';

              return (
                <Grid key={analysis.principle} size={{ xs: 12, sm: 6, md: 4 }}>
                  <Card variant="outlined">
                    <CardContent sx={{ pb: 2 }}>
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        mb={1}
                      >
                        <Typography variant="subtitle2">
                          {
                            PRINCIPLE_NAMES[
                              analysis.principle as keyof typeof PRINCIPLE_NAMES
                            ]
                          }
                        </Typography>
                        <TrendIcon sx={{ color: trendColor }} />
                      </Box>

                      <Typography variant="h6" color={trendColor}>
                        {formatScoreAsPercentage(analysis.currentScore)}
                      </Typography>

                      <Typography variant="body2" color="textSecondary">
                        {analysis.change > 0 ? '+' : ''}
                        {(analysis.change * 100).toFixed(1)}% (
                        {analysis.changePercentage > 0 ? '+' : ''}
                        {analysis.changePercentage.toFixed(1)}%)
                      </Typography>

                      <Chip
                        label={analysis.significance}
                        size="small"
                        color={
                          analysis.significance === 'high'
                            ? 'error'
                            : analysis.significance === 'medium'
                              ? 'warning'
                              : 'default'
                        }
                        sx={{ mt: 1 }}
                      />
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </CardContent>
      </Card>
    );
  };

  // ============================================================================
  // 🖼️ Main Render
  // ============================================================================

  return (
    <Box>
      {renderControls()}

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 8 }}>{renderTrendChart()}</Grid>
        <Grid size={{ xs: 12, lg: 4 }}>{renderTrendSummary()}</Grid>
      </Grid>

      {/* Alerts for significant changes */}
      {trendAnalysis.some(
        (a) => a.significance === 'high' && a.trend === 'declining'
      ) && (
        <Alert severity="warning" sx={{ mt: 3 }}>
          <Typography variant="subtitle2">
            ⚠️ Degradación Filosófica Detectada
          </Typography>
          <Typography variant="body2">
            Se han detectado cambios significativos negativos en la alineación
            filosófica. Considera revisar las implementaciones recientes y
            aplicar las recomendaciones del Philosophy Guardian.
          </Typography>
        </Alert>
      )}
    </Box>
  );
};

export default PhilosophyTrendAnalysis;
