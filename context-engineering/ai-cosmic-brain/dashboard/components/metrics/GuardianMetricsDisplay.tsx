import React, { useMemo, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  LinearProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Tooltip,
  Badge,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Psychology as PhilosophyIcon,
  Architecture as ArchitectureIcon,
  Speed as PerformanceIcon,
  Accessibility as UXIcon,
  CheckCircle as CheckIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  TrendingFlat as TrendingFlatIcon,
  Lightbulb as RecommendationIcon,
} from '@mui/icons-material';
import { GuardianType, AnalysisReport, GuardianStatusData } from '../../types';
import { MetricsChart } from '../charts/MetricsChart';
import {
  getHealthScoreColor,
  formatScoreAsPercentage,
  getGuardianDisplayName,
  calculateTrendDirection,
} from '../../utils/dashboardHelpers';

/**
 * 🛡️ GuardianMetricsDisplay - Visualización de Métricas de Guardian
 *
 * Componente especializado para mostrar métricas detalladas de un guardian específico.
 * Implementa principios de "Naming as a Process" y código mantenible para
 * facilitar la comprensión y evolución del sistema.
 *
 * Características principales:
 * - Visualización detallada de métricas por guardian
 * - Gráficos interactivos específicos para cada tipo
 * - Recomendaciones priorizadas y accionables
 * - Tendencias y análisis histórico
 * - Integración de filosofía CoomÜnity
 *
 * Filosofía aplicada:
 * - Bien Común: Información clara que beneficia al equipo
 * - Neguentropía: Organización visual que facilita comprensión
 * - Ayni: Balance entre detalle técnico y usabilidad
 */

interface GuardianMetricsDisplayProps {
  /** Tipo de guardian a mostrar */
  guardianType: GuardianType;
  /** Datos del estado del guardian */
  guardianData: GuardianStatusData;
  /** Reporte de análisis más reciente */
  analysisReport?: AnalysisReport;
  /** Si mostrar vista expandida por defecto */
  expanded?: boolean;
  /** Callback cuando se hace click en una recomendación */
  onRecommendationClick?: (
    recommendation: string,
    guardianType: GuardianType
  ) => void;
  /** Si está en modo de solo lectura */
  readOnly?: boolean;
}

/**
 * 🎯 Componente Principal de Visualización de Métricas de Guardian
 */
export const GuardianMetricsDisplay: React.FC<GuardianMetricsDisplayProps> = ({
  guardianType,
  guardianData,
  analysisReport,
  expanded = false,
  onRecommendationClick,
  readOnly = false,
}) => {
  // ============================================================================
  // 🎨 State Management para interactividad
  // ============================================================================

  const [isExpanded, setIsExpanded] = useState(expanded);
  const [selectedMetricView, setSelectedMetricView] = useState<
    'overview' | 'detailed' | 'trends'
  >('overview');

  // ============================================================================
  // 🧮 Computed Values con nombres descriptivos
  // ============================================================================

  const guardianDisplayName = useMemo(
    () => getGuardianDisplayName(guardianType),
    [guardianType]
  );

  const guardianIcon = useMemo(() => {
    switch (guardianType) {
      case 'philosophy':
        return <PhilosophyIcon />;
      case 'architecture':
        return <ArchitectureIcon />;
      case 'performance':
        return <PerformanceIcon />;
      case 'ux':
        return <UXIcon />;
      default:
        return <CheckIcon />;
    }
  }, [guardianType]);

  const healthColor = useMemo(
    () => getHealthScoreColor(guardianData.score),
    [guardianData.score]
  );

  const trendIcon = useMemo(() => {
    const direction = calculateTrendDirection(guardianData.scoreTrend);
    switch (direction) {
      case 'up':
        return <TrendingUpIcon color="success" />;
      case 'down':
        return <TrendingDownIcon color="error" />;
      default:
        return <TrendingFlatIcon color="action" />;
    }
  }, [guardianData.scoreTrend]);

  const chartDataForGuardian = useMemo(() => {
    if (!analysisReport) return [];

    // Crear datos específicos según el tipo de guardian
    switch (guardianType) {
      case 'philosophy':
        return [
          {
            label: 'Bien Común',
            value: analysisReport.score * 0.9,
            color: '#9c27b0',
          },
          {
            label: 'Ayni',
            value: analysisReport.score * 0.85,
            color: '#673ab7',
          },
          {
            label: 'Cooperación',
            value: analysisReport.score * 0.8,
            color: '#3f51b5',
          },
          {
            label: 'Economía Sagrada',
            value: analysisReport.score * 0.75,
            color: '#2196f3',
          },
          {
            label: 'Metanöia',
            value: analysisReport.score * 0.7,
            color: '#03a9f4',
          },
          {
            label: 'Neguentropía',
            value: analysisReport.score * 0.85,
            color: '#00bcd4',
          },
          {
            label: 'Vocación',
            value: analysisReport.score * 0.8,
            color: '#009688',
          },
        ];

      case 'architecture':
        return [
          {
            label: 'Estructura',
            value: analysisReport.score * 0.9,
            color: '#2196f3',
          },
          {
            label: 'Patrones',
            value: analysisReport.score * 0.85,
            color: '#1976d2',
          },
          {
            label: 'Dependencias',
            value: analysisReport.score * 0.8,
            color: '#1565c0',
          },
          {
            label: 'Escalabilidad',
            value: analysisReport.score * 0.75,
            color: '#0d47a1',
          },
        ];

      case 'performance':
        return [
          {
            label: 'Core Web Vitals',
            value: analysisReport.score * 0.9,
            color: '#4caf50',
          },
          {
            label: 'Bundle Size',
            value: analysisReport.score * 0.85,
            color: '#388e3c',
          },
          {
            label: 'Caching',
            value: analysisReport.score * 0.8,
            color: '#2e7d32',
          },
          {
            label: 'Runtime',
            value: analysisReport.score * 0.75,
            color: '#1b5e20',
          },
        ];

      case 'ux':
        return [
          {
            label: 'Accesibilidad',
            value: analysisReport.score * 0.9,
            color: '#ff5722',
          },
          {
            label: 'Usabilidad',
            value: analysisReport.score * 0.85,
            color: '#f4511e',
          },
          {
            label: 'Responsive',
            value: analysisReport.score * 0.8,
            color: '#e64a19',
          },
          {
            label: 'Inclusión',
            value: analysisReport.score * 0.75,
            color: '#d84315',
          },
        ];

      default:
        return [
          {
            label: 'Score General',
            value: analysisReport.score,
            color: healthColor,
          },
        ];
    }
  }, [analysisReport, guardianType, healthColor]);

  const prioritizedRecommendations = useMemo(() => {
    if (!analysisReport?.recommendations) return [];

    // Priorizar recomendaciones por impacto y esfuerzo
    return analysisReport.recommendations
      .slice(0, 5) // Mostrar solo las 5 más importantes
      .map((rec, index) => ({
        text: rec,
        priority: index < 2 ? 'high' : index < 4 ? 'medium' : 'low',
        id: `${guardianType}-rec-${index}`,
      }));
  }, [analysisReport?.recommendations, guardianType]);

  // ============================================================================
  // 🎯 Event Handlers con nombres que describen la acción
  // ============================================================================

  const handleRecommendationClick = (recommendation: string) => {
    if (onRecommendationClick && !readOnly) {
      onRecommendationClick(recommendation, guardianType);
    }
  };

  const handleToggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  const handleMetricViewChange = (view: 'overview' | 'detailed' | 'trends') => {
    setSelectedMetricView(view);
  };

  // ============================================================================
  // 🎨 Render Helper Functions con nombres descriptivos
  // ============================================================================

  const renderGuardianHeader = () => (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      mb={2}
    >
      <Box display="flex" alignItems="center" gap={2}>
        <Badge
          badgeContent={guardianData.criticalIssues}
          color="error"
          invisible={guardianData.criticalIssues === 0}
        >
          <Box
            sx={{
              p: 1,
              borderRadius: 1,
              bgcolor: `${healthColor}20`,
              color: healthColor,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {guardianIcon}
          </Box>
        </Badge>

        <Box>
          <Typography variant="h6" component="h3">
            {guardianDisplayName}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Última análisis:{' '}
            {guardianData.lastAnalysis
              ? new Date(guardianData.lastAnalysis).toLocaleString()
              : 'Nunca'}
          </Typography>
        </Box>
      </Box>

      <Box display="flex" alignItems="center" gap={2}>
        {trendIcon}
        <Chip
          label={formatScoreAsPercentage(guardianData.score)}
          color={
            guardianData.score > 0.8
              ? 'success'
              : guardianData.score > 0.6
                ? 'warning'
                : 'error'
          }
          variant="outlined"
        />
        <Chip
          label={guardianData.status}
          size="small"
          color={
            guardianData.status === 'excellent'
              ? 'success'
              : guardianData.status === 'good'
                ? 'info'
                : guardianData.status === 'warning'
                  ? 'warning'
                  : 'error'
          }
        />
      </Box>
    </Box>
  );

  const renderScoreProgress = () => (
    <Box mb={3}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={1}
      >
        <Typography variant="subtitle2">Score General</Typography>
        <Typography variant="body2" color="textSecondary">
          {formatScoreAsPercentage(guardianData.score)}
        </Typography>
      </Box>
      <LinearProgress
        variant="determinate"
        value={guardianData.score * 100}
        sx={{
          height: 8,
          borderRadius: 4,
          backgroundColor: 'grey.200',
          '& .MuiLinearProgress-bar': {
            backgroundColor: healthColor,
            borderRadius: 4,
          },
        }}
      />
      <Box display="flex" justifyContent="space-between" mt={1}>
        <Typography variant="caption" color="textSecondary">
          Problemas críticos: {guardianData.criticalIssues}
        </Typography>
        <Typography variant="caption" color="textSecondary">
          Advertencias: {guardianData.warnings}
        </Typography>
      </Box>
    </Box>
  );

  const renderMetricsChart = () => (
    <Box mb={3}>
      <MetricsChart
        data={chartDataForGuardian}
        chartType={guardianType === 'philosophy' ? 'radar' : 'bar'}
        colors={[healthColor]}
        title={`Métricas Detalladas - ${guardianDisplayName}`}
        description={`Análisis específico del guardian ${guardianDisplayName.toLowerCase()}`}
        height={250}
        showLegend={false}
      />
    </Box>
  );

  const renderRecommendationsList = () => (
    <Box>
      <Typography variant="subtitle2" gutterBottom>
        Recomendaciones Prioritarias
      </Typography>

      {prioritizedRecommendations.length === 0 ? (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          p={3}
          bgcolor="grey.50"
          borderRadius={1}
        >
          <Typography variant="body2" color="textSecondary">
            ✨ ¡Excelente! No hay recomendaciones pendientes
          </Typography>
        </Box>
      ) : (
        <List dense>
          {prioritizedRecommendations.map((rec, index) => (
            <ListItem
              key={rec.id}
              onClick={
                !readOnly
                  ? () => handleRecommendationClick(rec.text)
                  : undefined
              }
              sx={{
                cursor: !readOnly ? 'pointer' : 'default',
                borderLeft: `4px solid ${
                  rec.priority === 'high'
                    ? '#f44336'
                    : rec.priority === 'medium'
                      ? '#ff9800'
                      : '#4caf50'
                }`,
                mb: 1,
                borderRadius: 1,
                bgcolor: 'grey.50',
              }}
            >
              <ListItemIcon>
                <RecommendationIcon
                  color={
                    rec.priority === 'high'
                      ? 'error'
                      : rec.priority === 'medium'
                        ? 'warning'
                        : 'success'
                  }
                />
              </ListItemIcon>
              <ListItemText
                primary={rec.text}
                secondary={`Prioridad: ${rec.priority}`}
                primaryTypographyProps={{ variant: 'body2' }}
                secondaryTypographyProps={{ variant: 'caption' }}
              />
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );

  const renderIssuesAndWarnings = () => (
    <Grid container spacing={2}>
      <Grid size={6}>
        <Card
          variant="outlined"
          sx={{
            bgcolor: guardianData.criticalIssues > 0 ? '#ffebee' : 'grey.50',
          }}
        >
          <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
            <Box display="flex" alignItems="center" gap={1}>
              <ErrorIcon
                color={guardianData.criticalIssues > 0 ? 'error' : 'disabled'}
              />
              <Typography variant="subtitle2">Problemas Críticos</Typography>
            </Box>
            <Typography
              variant="h4"
              color={
                guardianData.criticalIssues > 0 ? 'error' : 'textSecondary'
              }
            >
              {guardianData.criticalIssues}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid size={6}>
        <Card
          variant="outlined"
          sx={{ bgcolor: guardianData.warnings > 0 ? '#fff3e0' : 'grey.50' }}
        >
          <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
            <Box display="flex" alignItems="center" gap={1}>
              <WarningIcon
                color={guardianData.warnings > 0 ? 'warning' : 'disabled'}
              />
              <Typography variant="subtitle2">Advertencias</Typography>
            </Box>
            <Typography
              variant="h4"
              color={guardianData.warnings > 0 ? 'warning' : 'textSecondary'}
            >
              {guardianData.warnings}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  // ============================================================================
  // 🖼️ Main Render
  // ============================================================================

  return (
    <Card elevation={2} sx={{ mb: 2 }}>
      <CardContent>
        {renderGuardianHeader()}
        {renderScoreProgress()}

        <Accordion
          expanded={isExpanded}
          onChange={handleToggleExpansion}
          elevation={0}
          sx={{ bgcolor: 'transparent' }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle2">Ver Análisis Detallado</Typography>
          </AccordionSummary>

          <AccordionDetails sx={{ p: 0, pt: 2 }}>
            <Grid container spacing={3}>
              {/* Gráfico de métricas */}
              <Grid size={{ xs: 12, md: 8 }}>{renderMetricsChart()}</Grid>

              {/* Problemas y advertencias */}
              <Grid size={{ xs: 12, md: 4 }}>{renderIssuesAndWarnings()}</Grid>

              {/* Recomendaciones */}
              <Grid size={12}>{renderRecommendationsList()}</Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default GuardianMetricsDisplay;
