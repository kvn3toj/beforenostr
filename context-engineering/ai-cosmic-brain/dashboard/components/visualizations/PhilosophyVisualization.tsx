import React, { useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  LinearProgress,
} from '@mui/material';
import {
  Psychology as PhilosophyIcon,
  Favorite as BienComunIcon,
  Balance as AyniIcon,
  Group as CooperacionIcon,
  Diamond as EconomiaSagradaIcon,
  Transform as MetanoiaIcon,
  AutoAwesome as NeguentropiaIcon,
  Star as VocacionIcon,
} from '@mui/icons-material';
import { MetricsChart } from '../charts/MetricsChart';
import {
  CoomUnityPhilosophyMetrics,
  PhilosophyPrincipleMetric,
  ImplementationLevel,
} from '../../types';
import {
  formatScoreAsPercentage,
  evaluatePhilosophyPrincipleAlignment,
} from '../../utils/dashboardHelpers';

/**
 * 🌌 PhilosophyVisualization - Visualización de Alineación Filosófica CoomÜnity
 *
 * Componente especializado para mostrar la alineación con los principios
 * fundamentales de la filosofía CoomÜnity. Implementa visualizaciones
 * específicas para cada principio y su nivel de implementación.
 *
 * Principios CoomÜnity visualizados:
 * - Bien Común (25% peso) - Priorización del bien común sobre el particular
 * - Ayni (20% peso) - Reciprocidad y equilibrio
 * - Cooperación (15% peso) - Cooperación sobre competición
 * - Economía Sagrada (15% peso) - Intercambio consciente y ético
 * - Metanöia (10% peso) - Transformación consciente
 * - Neguentropía (10% peso) - Orden consciente que genera vida
 * - Vocación (5% peso) - Propósito auténtico y servicio
 *
 * Filosofía aplicada:
 * - Bien Común: La visualización misma sirve al bien común del equipo
 * - Neguentropía: Orden visual que facilita comprensión
 * - Ayni: Balance entre detalle y simplicidad
 */

interface PhilosophyVisualizationProps {
  /** Métricas de filosofía CoomÜnity */
  philosophyMetrics: CoomUnityPhilosophyMetrics;
  /** Score general de alineación filosófica */
  overallScore: number;
  /** Si mostrar vista detallada */
  showDetailed?: boolean;
  /** Altura del gráfico principal */
  chartHeight?: number;
}

/**
 * 🎯 Componente Principal de Visualización Filosófica
 */
export const PhilosophyVisualization: React.FC<
  PhilosophyVisualizationProps
> = ({
  philosophyMetrics,
  overallScore,
  showDetailed = true,
  chartHeight = 350,
}) => {
  // ============================================================================
  // 🧮 Computed Values para visualización
  // ============================================================================

  const principleDisplayData = useMemo(() => {
    return [
      {
        key: 'bienComun',
        name: 'Bien Común',
        icon: <BienComunIcon />,
        color: '#9c27b0',
        weight: 25,
        metric: philosophyMetrics.bienComun,
        description: 'Priorización del bien común sobre el particular',
      },
      {
        key: 'ayni',
        name: 'Ayni',
        icon: <AyniIcon />,
        color: '#673ab7',
        weight: 20,
        metric: philosophyMetrics.ayni,
        description: 'Reciprocidad y equilibrio en las relaciones',
      },
      {
        key: 'cooperacion',
        name: 'Cooperación',
        icon: <CooperacionIcon />,
        color: '#3f51b5',
        weight: 15,
        metric: philosophyMetrics.cooperacion,
        description: 'Cooperación sobre competición',
      },
      {
        key: 'economiaSagrada',
        name: 'Economía Sagrada',
        icon: <EconomiaSagradaIcon />,
        color: '#2196f3',
        weight: 15,
        metric: philosophyMetrics.economiaSagrada,
        description: 'Intercambio consciente y ético',
      },
      {
        key: 'metanoia',
        name: 'Metanöia',
        icon: <MetanoiaIcon />,
        color: '#03a9f4',
        weight: 10,
        metric: philosophyMetrics.metanoia,
        description: 'Transformación consciente continua',
      },
      {
        key: 'neguentropia',
        name: 'Neguentropía',
        icon: <NeguentropiaIcon />,
        color: '#00bcd4',
        weight: 10,
        metric: philosophyMetrics.neguentropia,
        description: 'Orden consciente que genera vida',
      },
      {
        key: 'vocacion',
        name: 'Vocación',
        icon: <VocacionIcon />,
        color: '#009688',
        weight: 5,
        metric: philosophyMetrics.vocacion,
        description: 'Propósito auténtico y servicio',
      },
    ];
  }, [philosophyMetrics]);

  const radarChartData = useMemo(() => {
    return principleDisplayData.map((principle) => ({
      label: principle.name,
      value: principle.metric.score,
      color: principle.color,
      metadata: {
        weight: principle.weight,
        implementationLevel: principle.metric.implementationLevel,
        description: principle.description,
      },
    }));
  }, [principleDisplayData]);

  const implementationLevelCounts = useMemo(() => {
    const counts = {
      exemplary_implementation: 0,
      excellent_implementation: 0,
      good_implementation: 0,
      basic_implementation: 0,
      not_implemented: 0,
    };

    principleDisplayData.forEach((principle) => {
      counts[principle.metric.implementationLevel]++;
    });

    return counts;
  }, [principleDisplayData]);

  const overallPhilosophyStatus = useMemo(() => {
    if (overallScore >= 0.9)
      return {
        level: 'Excelente',
        color: '#4caf50',
        message: 'Alineación filosófica ejemplar',
      };
    if (overallScore >= 0.8)
      return {
        level: 'Muy Bueno',
        color: '#8bc34a',
        message: 'Sólida alineación filosófica',
      };
    if (overallScore >= 0.7)
      return {
        level: 'Bueno',
        color: '#cddc39',
        message: 'Buena alineación con oportunidades',
      };
    if (overallScore >= 0.6)
      return {
        level: 'Aceptable',
        color: '#ffeb3b',
        message: 'Alineación básica, necesita mejoras',
      };
    if (overallScore >= 0.4)
      return {
        level: 'Deficiente',
        color: '#ff9800',
        message: 'Alineación deficiente, requiere atención',
      };
    return {
      level: 'Crítico',
      color: '#f44336',
      message: 'Desalineación crítica, acción inmediata requerida',
    };
  }, [overallScore]);

  // ============================================================================
  // 🎨 Render Helper Functions
  // ============================================================================

  const renderOverallPhilosophyScore = () => (
    <Card
      elevation={2}
      sx={{ mb: 3, bgcolor: `${overallPhilosophyStatus.color}10` }}
    >
      <CardContent>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mb={2}
        >
          <Box display="flex" alignItems="center" gap={2}>
            <Box
              sx={{
                p: 1.5,
                borderRadius: 2,
                bgcolor: overallPhilosophyStatus.color,
                color: 'white',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <PhilosophyIcon />
            </Box>
            <Box>
              <Typography variant="h6" component="h3">
                Alineación Filosófica CoomÜnity
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {overallPhilosophyStatus.message}
              </Typography>
            </Box>
          </Box>

          <Box textAlign="right">
            <Typography
              variant="h4"
              color={overallPhilosophyStatus.color}
              fontWeight="bold"
            >
              {formatScoreAsPercentage(overallScore)}
            </Typography>
            <Chip
              label={overallPhilosophyStatus.level}
              sx={{
                bgcolor: overallPhilosophyStatus.color,
                color: 'white',
                fontWeight: 'bold',
              }}
            />
          </Box>
        </Box>

        <LinearProgress
          variant="determinate"
          value={overallScore * 100}
          sx={{
            height: 10,
            borderRadius: 5,
            backgroundColor: 'grey.200',
            '& .MuiLinearProgress-bar': {
              backgroundColor: overallPhilosophyStatus.color,
              borderRadius: 5,
            },
          }}
        />
      </CardContent>
    </Card>
  );

  const renderPrincipleCard = (principle: (typeof principleDisplayData)[0]) => {
    const alignment = evaluatePhilosophyPrincipleAlignment(
      principle.metric.score,
      principle.name
    );

    return (
      <Card key={principle.key} elevation={1} sx={{ height: '100%' }}>
        <CardContent>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            mb={2}
          >
            <Box display="flex" alignItems="center" gap={1}>
              <Box
                sx={{
                  p: 0.5,
                  borderRadius: 1,
                  bgcolor: `${principle.color}20`,
                  color: principle.color,
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {principle.icon}
              </Box>
              <Box>
                <Typography variant="subtitle2" fontWeight="bold">
                  {principle.name}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  Peso: {principle.weight}%
                </Typography>
              </Box>
            </Box>

            <Typography variant="h6" color={alignment.color} fontWeight="bold">
              {formatScoreAsPercentage(principle.metric.score)}
            </Typography>
          </Box>

          <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
            {principle.description}
          </Typography>

          <LinearProgress
            variant="determinate"
            value={principle.metric.score * 100}
            sx={{
              mb: 2,
              height: 6,
              borderRadius: 3,
              backgroundColor: 'grey.200',
              '& .MuiLinearProgress-bar': {
                backgroundColor: principle.color,
                borderRadius: 3,
              },
            }}
          />

          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Chip
              label={alignment.level}
              size="small"
              sx={{
                bgcolor: `${alignment.color}20`,
                color: alignment.color,
                fontSize: '0.7rem',
              }}
            />
            <Typography variant="caption" color="textSecondary">
              {principle.metric.implementationLevel.replace('_', ' ')}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  };

  const renderRadarChart = () => (
    <Card elevation={1}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Radar de Principios CoomÜnity
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
          Visualización integral de la alineación con cada principio filosófico
        </Typography>

        <MetricsChart
          data={radarChartData}
          chartType="radar"
          colors={principleDisplayData.map((p) => p.color)}
          title=""
          height={chartHeight}
          showLegend={true}
        />
      </CardContent>
    </Card>
  );

  const renderImplementationSummary = () => {
    const levelLabels = {
      exemplary_implementation: 'Ejemplar',
      excellent_implementation: 'Excelente',
      good_implementation: 'Bueno',
      basic_implementation: 'Básico',
      not_implemented: 'No Implementado',
    };

    const levelColors = {
      exemplary_implementation: '#4caf50',
      excellent_implementation: '#8bc34a',
      good_implementation: '#cddc39',
      basic_implementation: '#ffeb3b',
      not_implemented: '#f44336',
    };

    return (
      <Card elevation={1}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Resumen de Implementación
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
            Distribución de niveles de implementación por principio
          </Typography>

          {Object.entries(implementationLevelCounts).map(([level, count]) => (
            <Box
              key={level}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={1}
            >
              <Box display="flex" alignItems="center" gap={1}>
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    bgcolor: levelColors[level as keyof typeof levelColors],
                  }}
                />
                <Typography variant="body2">
                  {levelLabels[level as keyof typeof levelLabels]}
                </Typography>
              </Box>
              <Chip
                label={count}
                size="small"
                sx={{
                  bgcolor: `${levelColors[level as keyof typeof levelColors]}20`,
                  color: levelColors[level as keyof typeof levelColors],
                }}
              />
            </Box>
          ))}
        </CardContent>
      </Card>
    );
  };

  // ============================================================================
  // 🖼️ Main Render
  // ============================================================================

  return (
    <Box>
      {renderOverallPhilosophyScore()}

      {showDetailed && (
        <Grid container spacing={3}>
          {/* Radar Chart */}
          <Grid size={{ xs: 12, lg: 8 }}>{renderRadarChart()}</Grid>

          {/* Implementation Summary */}
          <Grid size={{ xs: 12, lg: 4 }}>{renderImplementationSummary()}</Grid>

          {/* Individual Principle Cards */}
          {principleDisplayData.map((principle) => (
            <Grid key={principle.key} size={{ xs: 12, sm: 6, md: 4 }}>
              {renderPrincipleCard(principle)}
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default PhilosophyVisualization;
