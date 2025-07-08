import React, { useState, useMemo, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  LinearProgress,
  Chip,
  IconButton,
  Tooltip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
  Button,
  Divider,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Psychology as PhilosophyIcon,
  Favorite as BienComunIcon,
  Balance as AyniIcon,
  Group as CooperacionIcon,
  Diamond as EconomiaSagradaIcon,
  Transform as MetanoiaIcon,
  AutoAwesome as NeguentropiaIcon,
  Star as VocacionIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  TrendingFlat as TrendingFlatIcon,
  Warning as WarningIcon,
  CheckCircle as CheckIcon,
  Info as InfoIcon,
  Lightbulb as RecommendationIcon,
} from '@mui/icons-material';
import {
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
} from 'recharts';
import {
  useCosmicEvent,
  useCosmicWebSocket,
} from '../providers/CosmicWebSocketProvider';
import {
  CoomUnityPhilosophyMetrics,
  PhilosophyPrincipleMetric,
  ImplementationLevel,
  TrendData,
} from '../types';
import {
  formatScoreAsPercentage,
  getHealthScoreColor,
  formatRelativeTime,
} from '../utils/dashboardHelpers';

/**
 * 🌌 PhilosophyAlignmentTracker - Tracker de Alineación Filosófica CoomÜnity
 *
 * Componente especializado para visualizar y monitorear la alineación
 * con los 7 principios fundamentales de la filosofía CoomÜnity.
 *
 * Principios monitoreados:
 * 1. Bien Común (25% peso) - Priorización del bien común sobre el particular
 * 2. Ayni (20% peso) - Reciprocidad y equilibrio
 * 3. Cooperación (15% peso) - Cooperación sobre competición
 * 4. Economía Sagrada (15% peso) - Valor real vs valor artificial
 * 5. Metanöia (10% peso) - Transformación consciente
 * 6. Neguentropía (10% peso) - Orden consciente
 * 7. Vocación (5% peso) - Propósito auténtico
 *
 * Características:
 * - Visualización radar de los 7 principios
 * - Métricas detalladas por principio
 * - Tendencias históricas
 * - Recomendaciones específicas
 * - Alertas de desalineación
 * - Integración con WebSocket en tiempo real
 *
 * Filosofía aplicada:
 * - Transparencia: Visibilidad completa de la alineación filosófica
 * - Bien Común: Herramienta que beneficia la coherencia del proyecto
 * - Metanöia: Facilita la transformación consciente del desarrollo
 */

interface PhilosophyAlignmentTrackerProps {
  /** Métricas de filosofía CoomÜnity */
  philosophyMetrics?: CoomUnityPhilosophyMetrics;
  /** Mostrar vista expandida por defecto */
  expandedByDefault?: boolean;
  /** Habilitar actualizaciones en tiempo real */
  enableRealTimeUpdates?: boolean;
  /** Callback para navegación a detalles */
  onNavigateToDetails?: (principle: string) => void;
  /** Modo de solo lectura */
  readOnly?: boolean;
}

// ============================================================================
// 🎨 Configuration and Constants
// ============================================================================

const PHILOSOPHY_PRINCIPLES = {
  bienComun: {
    key: 'bienComun',
    name: 'Bien Común',
    icon: <BienComunIcon />,
    color: '#4caf50',
    weight: 0.25,
    description: 'Priorización del bien común sobre el particular',
  },
  ayni: {
    key: 'ayni',
    name: 'Ayni',
    icon: <AyniIcon />,
    color: '#2196f3',
    weight: 0.2,
    description: 'Reciprocidad y equilibrio',
  },
  cooperacion: {
    key: 'cooperacion',
    name: 'Cooperación',
    icon: <CooperacionIcon />,
    color: '#ff9800',
    weight: 0.15,
    description: 'Cooperación sobre competición',
  },
  economiaSagrada: {
    key: 'economiaSagrada',
    name: 'Economía Sagrada',
    icon: <EconomiaSagradaIcon />,
    color: '#9c27b0',
    weight: 0.15,
    description: 'Valor real vs valor artificial',
  },
  metanoia: {
    key: 'metanoia',
    name: 'Metanöia',
    icon: <MetanoiaIcon />,
    color: '#f44336',
    weight: 0.1,
    description: 'Transformación consciente',
  },
  neguentropia: {
    key: 'neguentropia',
    name: 'Neguentropía',
    icon: <NeguentropiaIcon />,
    color: '#607d8b',
    weight: 0.1,
    description: 'Orden consciente',
  },
  vocacion: {
    key: 'vocacion',
    name: 'Vocación',
    icon: <VocacionIcon />,
    color: '#795548',
    weight: 0.05,
    description: 'Propósito auténtico',
  },
} as const;

const IMPLEMENTATION_LEVEL_CONFIG = {
  not_implemented: { label: 'No Implementado', color: '#f44336', score: 0 },
  basic_implementation: { label: 'Básico', color: '#ff9800', score: 0.25 },
  good_implementation: { label: 'Bueno', color: '#2196f3', score: 0.5 },
  excellent_implementation: {
    label: 'Excelente',
    color: '#4caf50',
    score: 0.75,
  },
  exemplary_implementation: { label: 'Ejemplar', color: '#8bc34a', score: 1.0 },
};

// ============================================================================
// 🌟 Main Component
// ============================================================================

export const PhilosophyAlignmentTracker: React.FC<
  PhilosophyAlignmentTrackerProps
> = ({
  philosophyMetrics,
  expandedByDefault = false,
  enableRealTimeUpdates = true,
  onNavigateToDetails,
  readOnly = false,
}) => {
  // ============================================================================
  // 🔄 State Management
  // ============================================================================

  const [expanded, setExpanded] = useState(expandedByDefault);
  const [selectedPrinciple, setSelectedPrinciple] = useState<string | null>(
    null
  );
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [realTimeMetrics, setRealTimeMetrics] = useState<
    CoomUnityPhilosophyMetrics | undefined
  >(philosophyMetrics);

  const { requestSystemHealthUpdate, isConnected } = useCosmicWebSocket();

  // ============================================================================
  // 🔄 Real-time Updates
  // ============================================================================

  useCosmicEvent(
    'philosophy_alignment_change',
    (event) => {
      if (enableRealTimeUpdates && event.data?.philosophyMetrics) {
        setRealTimeMetrics(event.data.philosophyMetrics);
        setLastUpdate(new Date(event.timestamp));
      }
    },
    [enableRealTimeUpdates]
  );

  // Use real-time metrics if available, fallback to props
  const currentMetrics = realTimeMetrics || philosophyMetrics;

  // ============================================================================
  // 📊 Data Processing
  // ============================================================================

  const overallAlignment = useMemo(() => {
    if (!currentMetrics) return 0;

    return Object.entries(PHILOSOPHY_PRINCIPLES).reduce(
      (total, [key, config]) => {
        const metric = currentMetrics[key as keyof CoomUnityPhilosophyMetrics];
        return total + (metric?.score || 0) * config.weight;
      },
      0
    );
  }, [currentMetrics]);

  const radarChartData = useMemo(() => {
    if (!currentMetrics) return [];

    return Object.entries(PHILOSOPHY_PRINCIPLES).map(([key, config]) => {
      const metric = currentMetrics[key as keyof CoomUnityPhilosophyMetrics];
      return {
        principle: config.name,
        score: (metric?.score || 0) * 100,
        fullMark: 100,
        color: config.color,
      };
    });
  }, [currentMetrics]);

  const implementationDistribution = useMemo(() => {
    if (!currentMetrics) return [];

    const distribution: Record<ImplementationLevel, number> = {
      not_implemented: 0,
      basic_implementation: 0,
      good_implementation: 0,
      excellent_implementation: 0,
      exemplary_implementation: 0,
    };

    Object.values(currentMetrics).forEach((metric) => {
      if (metric?.implementationLevel) {
        distribution[metric.implementationLevel]++;
      }
    });

    return Object.entries(distribution).map(([level, count]) => ({
      level: IMPLEMENTATION_LEVEL_CONFIG[level as ImplementationLevel].label,
      count,
      color: IMPLEMENTATION_LEVEL_CONFIG[level as ImplementationLevel].color,
    }));
  }, [currentMetrics]);

  // ============================================================================
  // 🎯 Event Handlers
  // ============================================================================

  const handleRefreshAlignment = () => {
    if (isConnected) {
      requestSystemHealthUpdate();
    }
  };

  const handlePrincipleClick = (principleKey: string) => {
    setSelectedPrinciple(
      selectedPrinciple === principleKey ? null : principleKey
    );
    if (onNavigateToDetails) {
      onNavigateToDetails(principleKey);
    }
  };

  const handleToggleExpanded = () => {
    setExpanded(!expanded);
  };

  // ============================================================================
  // 🎨 Render Helpers
  // ============================================================================

  const renderOverallScore = () => (
    <Card
      elevation={2}
      sx={{
        background: `linear-gradient(135deg, ${getHealthScoreColor(overallAlignment)} 0%, ${getHealthScoreColor(overallAlignment)}aa 100%)`,
        color: 'white',
        mb: 2,
      }}
    >
      <CardContent sx={{ textAlign: 'center', py: 3 }}>
        <PhilosophyIcon sx={{ fontSize: 48, mb: 1 }} />
        <Typography variant="h3" fontWeight="bold">
          {formatScoreAsPercentage(overallAlignment)}
        </Typography>
        <Typography variant="h6" sx={{ opacity: 0.9 }}>
          Alineación Filosófica CoomÜnity
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.8, mt: 1 }}>
          Última actualización: {formatRelativeTime(lastUpdate)}
        </Typography>

        {!readOnly && (
          <Button
            variant="outlined"
            size="small"
            onClick={handleRefreshAlignment}
            disabled={!isConnected}
            sx={{
              mt: 2,
              borderColor: 'white',
              color: 'white',
              '&:hover': {
                borderColor: 'white',
                bgcolor: 'rgba(255,255,255,0.1)',
              },
            }}
          >
            Actualizar Alineación
          </Button>
        )}
      </CardContent>
    </Card>
  );

  const renderRadarChart = () => (
    <Card elevation={1} sx={{ height: 400 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Radar de Principios Filosóficos
        </Typography>
        <ResponsiveContainer width="100%" height={320}>
          <RadarChart data={radarChartData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="principle" tick={{ fontSize: 12 }} />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 100]}
              tick={{ fontSize: 10 }}
              tickFormatter={(value) => `${value}%`}
            />
            <Radar
              name="Alineación"
              dataKey="score"
              stroke="#2196f3"
              fill="#2196f3"
              fillOpacity={0.3}
              strokeWidth={2}
            />
          </RadarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );

  const renderImplementationChart = () => (
    <Card elevation={1} sx={{ height: 400 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Distribución de Implementación
        </Typography>
        <ResponsiveContainer width="100%" height={320}>
          <PieChart>
            <Pie
              data={implementationDistribution}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={120}
              dataKey="count"
              label={({ level, count }) =>
                count > 0 ? `${level}: ${count}` : ''
              }
            >
              {implementationDistribution.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <RechartsTooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );

  const renderPrincipleDetails = () => {
    if (!currentMetrics) return null;

    return Object.entries(PHILOSOPHY_PRINCIPLES).map(([key, config]) => {
      const metric = currentMetrics[key as keyof CoomUnityPhilosophyMetrics];
      if (!metric) return null;

      const implementationConfig =
        IMPLEMENTATION_LEVEL_CONFIG[metric.implementationLevel];

      return (
        <Accordion key={key} expanded={selectedPrinciple === key}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            onClick={() => handlePrincipleClick(key)}
            sx={{
              bgcolor:
                selectedPrinciple === key ? `${config.color}15` : 'transparent',
              '&:hover': { bgcolor: `${config.color}10` },
            }}
          >
            <Box display="flex" alignItems="center" width="100%">
              <Box sx={{ color: config.color, mr: 2 }}>{config.icon}</Box>
              <Box flex={1}>
                <Typography variant="subtitle1" fontWeight="bold">
                  {config.name} ({Math.round(config.weight * 100)}%)
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {config.description}
                </Typography>
              </Box>
              <Box textAlign="right" mr={2}>
                <Typography variant="h6" color={config.color}>
                  {formatScoreAsPercentage(metric.score)}
                </Typography>
                <Chip
                  label={implementationConfig.label}
                  size="small"
                  sx={{
                    bgcolor: implementationConfig.color,
                    color: 'white',
                    fontSize: '0.7rem',
                  }}
                />
              </Box>
            </Box>
          </AccordionSummary>

          <AccordionDetails>
            <Grid container spacing={2}>
              {/* Progress Bar */}
              <Grid size={12}>
                <Box mb={2}>
                  <LinearProgress
                    variant="determinate"
                    value={metric.score * 100}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      bgcolor: 'grey.200',
                      '& .MuiLinearProgress-bar': {
                        bgcolor: config.color,
                      },
                    }}
                  />
                </Box>
              </Grid>

              {/* Good Practices */}
              {metric.goodPractices && metric.goodPractices.length > 0 && (
                <Grid size={{ xs: 12, md: 6 }}>
                  <Box>
                    <Typography
                      variant="subtitle2"
                      color="success.main"
                      gutterBottom
                    >
                      <CheckIcon
                        fontSize="small"
                        sx={{ mr: 1, verticalAlign: 'middle' }}
                      />
                      Buenas Prácticas Detectadas
                    </Typography>
                    {metric.goodPractices.map((practice, index) => (
                      <Alert
                        key={index}
                        severity="success"
                        sx={{ mb: 1, py: 0 }}
                      >
                        <Typography variant="body2">{practice}</Typography>
                      </Alert>
                    ))}
                  </Box>
                </Grid>
              )}

              {/* Anti-patterns */}
              {metric.antiPatterns && metric.antiPatterns.length > 0 && (
                <Grid size={{ xs: 12, md: 6 }}>
                  <Box>
                    <Typography
                      variant="subtitle2"
                      color="error.main"
                      gutterBottom
                    >
                      <WarningIcon
                        fontSize="small"
                        sx={{ mr: 1, verticalAlign: 'middle' }}
                      />
                      Antipatrones Detectados
                    </Typography>
                    {metric.antiPatterns.map((antiPattern, index) => (
                      <Alert key={index} severity="error" sx={{ mb: 1, py: 0 }}>
                        <Typography variant="body2">{antiPattern}</Typography>
                      </Alert>
                    ))}
                  </Box>
                </Grid>
              )}

              {/* Recommendations */}
              {metric.recommendations && metric.recommendations.length > 0 && (
                <Grid size={12}>
                  <Divider sx={{ my: 2 }} />
                  <Typography
                    variant="subtitle2"
                    color="primary.main"
                    gutterBottom
                  >
                    <RecommendationIcon
                      fontSize="small"
                      sx={{ mr: 1, verticalAlign: 'middle' }}
                    />
                    Recomendaciones para Mejorar
                  </Typography>
                  {metric.recommendations.map((recommendation, index) => (
                    <Alert key={index} severity="info" sx={{ mb: 1, py: 0 }}>
                      <Typography variant="body2">{recommendation}</Typography>
                    </Alert>
                  ))}
                </Grid>
              )}
            </Grid>
          </AccordionDetails>
        </Accordion>
      );
    });
  };

  // ============================================================================
  // 🖼️ Main Render
  // ============================================================================

  if (!currentMetrics) {
    return (
      <Card>
        <CardContent sx={{ textAlign: 'center', py: 4 }}>
          <PhilosophyIcon sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
          <Typography variant="h6" color="textSecondary">
            No hay datos de alineación filosófica disponibles
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            Ejecuta un análisis del Philosophy Guardian para obtener métricas
          </Typography>
          {!readOnly && isConnected && (
            <Button
              variant="outlined"
              onClick={handleRefreshAlignment}
              sx={{ mt: 2 }}
            >
              Solicitar Análisis
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Box>
      {/* Overall Score */}
      {renderOverallScore()}

      {/* Charts Section */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, lg: 8 }}>{renderRadarChart()}</Grid>
        <Grid size={{ xs: 12, lg: 4 }}>{renderImplementationChart()}</Grid>
      </Grid>

      {/* Detailed Principles */}
      <Card>
        <CardContent>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Typography variant="h6">
              Detalles por Principio Filosófico
            </Typography>
            <IconButton onClick={handleToggleExpanded}>
              <ExpandMoreIcon
                sx={{
                  transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.3s ease',
                }}
              />
            </IconButton>
          </Box>

          {expanded && <Box>{renderPrincipleDetails()}</Box>}
        </CardContent>
      </Card>
    </Box>
  );
};

export default PhilosophyAlignmentTracker;
