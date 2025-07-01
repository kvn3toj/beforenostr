import React, { useMemo, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Chip,
  Tooltip,
  useTheme,
  alpha,
  Stack,
  Divider,
} from '@mui/material';
import {
  Psychology,
  Favorite,
  Groups,
  Balance,
  Spa,
  AutoAwesome,
  TrendingUp,
} from '@mui/icons-material';

// 🌪️ REDEFINICIÓN DE INTERFACES PARA DISEÑO MINIMALISTA
interface ElementalData {
  fuego: number;
  agua: number;
  tierra: number;
  aire: number;
}

interface ElementalHarmonyRadarProps {
  elementos?: ElementalData;
  dominantElement?: keyof ElementalData;
  balanceScore?: number;
  recommendations?: Array<{
    element: keyof ElementalData;
    action: string;
    philosophy: string;
  }>;
  isExpanded?: boolean;
  size?: number;
  'data-testid'?: string;
}

interface RadarPoint {
  label: string;
  value: number;
  color: string;
  icon: React.ReactElement;
  description: string;
  angle: number;
  x: number;
  y: number;
}

/**
 * 🌟 ELEMENTAL HARMONY RADAR - MINIMALIST VERSION
 * ===============================================
 *
 * Visualización minimalista del balance elemental del usuario
 * Representa las 4 dimensiones fundamentales en diseño limpio
 *
 * Filosofía Minimalista:
 * - Claridad visual sobre complejidad cósmica
 * - Datos esenciales sin distracciones
 * - Armonía a través de la simplicidad
 */
const ElementalHarmonyRadar: React.FC<ElementalHarmonyRadarProps> = ({
  elementos = { fuego: 50, agua: 50, tierra: 50, aire: 50 },
  dominantElement = 'fuego',
  balanceScore = 75,
  recommendations = [],
  isExpanded = false,
  size = 280,
  'data-testid': testId = 'elemental-harmony-radar'
}) => {
  const theme = useTheme();
  const [hoveredElement, setHoveredElement] = useState<string | null>(null);

  // 🎨 CONFIGURACIÓN DE ELEMENTOS MINIMALISTA
  const radarDimensions: RadarPoint[] = useMemo(() => {
    const centerX = size / 2;
    const centerY = size / 2;
    const radius = (size * 0.35);

    const elements = [
      {
        label: 'Fuego',
        value: elementos.fuego,
        color: theme.palette.error.main,
        icon: <AutoAwesome />,
        description: 'Creatividad y Acción',
        angle: 0 // Top
      },
      {
        label: 'Aire',
        value: elementos.aire,
        color: theme.palette.info.main,
        icon: <Psychology />,
        description: 'Comunicación y Claridad',
        angle: 90 // Right
      },
      {
        label: 'Agua',
        value: elementos.agua,
        color: theme.palette.primary.main,
        icon: <Favorite />,
        description: 'Colaboración y Fluidez',
        angle: 180 // Bottom
      },
      {
        label: 'Tierra',
        value: elementos.tierra,
        color: theme.palette.success.main,
        icon: <Spa />,
        description: 'Estabilidad y Solidez',
        angle: 270 // Left
      }
    ];

    return elements.map(element => {
      const angleRad = (element.angle - 90) * (Math.PI / 180);
      const valueRadius = (element.value / 100) * radius;

      return {
        ...element,
        x: centerX + Math.cos(angleRad) * valueRadius,
        y: centerY + Math.sin(angleRad) * valueRadius,
      };
    });
  }, [elementos, size, theme]);

  // 🎯 ANÁLISIS DE BALANCE SIMPLIFICADO
  const balanceAnalysis = useMemo(() => {
    const values = Object.values(elementos);
    const average = values.reduce((sum, val) => sum + val, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - average, 2), 0) / values.length;
    const standardDeviation = Math.sqrt(variance);

    const harmonyScore = Math.max(0, 100 - (standardDeviation * 2));

    let level = 'En Desarrollo';
    let color = theme.palette.warning.main;

    if (harmonyScore >= 80) {
      level = 'Excelente Armonía';
      color = theme.palette.success.main;
    } else if (harmonyScore >= 60) {
      level = 'Buen Balance';
      color = theme.palette.primary.main;
    } else if (harmonyScore >= 40) {
      level = 'Balance Moderado';
      color = theme.palette.info.main;
    }

    return {
      score: Math.round(harmonyScore),
      level,
      color,
      average: Math.round(average)
    };
  }, [elementos, theme]);

  // 🎨 RENDERIZADO DEL RADAR MINIMALISTA
  const renderRadarChart = () => {
    const centerX = size / 2;
    const centerY = size / 2;
    const maxRadius = size * 0.35;

    // Grid concéntrico minimalista
    const gridLevels = [0.25, 0.5, 0.75, 1.0];

    return (
      <svg width={size} height={size} style={{ background: 'transparent' }}>
        {/* Grid Background */}
        {gridLevels.map((level, index) => (
          <circle
            key={`grid-${index}`}
            cx={centerX}
            cy={centerY}
            r={maxRadius * level}
            fill="none"
            stroke={alpha(theme.palette.divider, 0.3)}
            strokeWidth={1}
          />
        ))}

        {/* Ejes principales */}
        {[0, 90, 180, 270].map((angle, index) => {
          const angleRad = (angle - 90) * (Math.PI / 180);
          const endX = centerX + Math.cos(angleRad) * maxRadius;
          const endY = centerY + Math.sin(angleRad) * maxRadius;

          return (
            <line
              key={`axis-${index}`}
              x1={centerX}
              y1={centerY}
              x2={endX}
              y2={endY}
              stroke={alpha(theme.palette.divider, 0.2)}
              strokeWidth={1}
            />
          );
        })}

        {/* Polígono de valores */}
        <polygon
          points={radarDimensions.map(point => `${point.x},${point.y}`).join(' ')}
          fill={alpha(theme.palette.primary.main, 0.1)}
          stroke={theme.palette.primary.main}
          strokeWidth={2}
          strokeLinejoin="round"
        />

        {/* Puntos de datos */}
        {radarDimensions.map((point, index) => (
          <circle
            key={`point-${index}`}
            cx={point.x}
            cy={point.y}
            r={6}
            fill={point.color}
            stroke={theme.palette.background.paper}
            strokeWidth={2}
            style={{ cursor: 'pointer' }}
            onMouseEnter={() => setHoveredElement(point.label)}
            onMouseLeave={() => setHoveredElement(null)}
          />
        ))}

        {/* Etiquetas de elementos */}
        {radarDimensions.map((point, index) => {
          const angleRad = (point.angle - 90) * (Math.PI / 180);
          const labelRadius = maxRadius + 25;
          const labelX = centerX + Math.cos(angleRad) * labelRadius;
          const labelY = centerY + Math.sin(angleRad) * labelRadius;

          return (
            <g key={`label-${index}`}>
              <text
                x={labelX}
                y={labelY}
                textAnchor="middle"
                dominantBaseline="middle"
                fill={point.color}
                fontSize="12"
                fontWeight="600"
              >
                {point.label}
              </text>
              <text
                x={labelX}
                y={labelY + 14}
                textAnchor="middle"
                dominantBaseline="middle"
                fill={theme.palette.text.secondary}
                fontSize="10"
              >
                {point.value}%
              </text>
            </g>
          );
        })}
      </svg>
    );
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 2,
        border: `1px solid ${theme.palette.divider}`,
        backgroundColor: theme.palette.background.paper,
        transition: 'all 0.3s ease',
        '&:hover': {
          borderColor: theme.palette.primary.main,
          boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.1)}`,
        }
      }}
      data-testid={testId}
    >
      {/* Header */}
      <Box sx={{ mb: 3, textAlign: 'center' }}>
        <Typography variant="h6" sx={{ fontWeight: 600, color: theme.palette.text.primary, mb: 1 }}>
          Balance Elemental
        </Typography>
        <Chip
          label={balanceAnalysis.level}
          sx={{
            backgroundColor: alpha(balanceAnalysis.color, 0.1),
            color: balanceAnalysis.color,
            fontWeight: 500,
          }}
        />
      </Box>

      {/* Radar Chart */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
        {renderRadarChart()}
      </Box>

      {/* Element Summary */}
      <Stack spacing={2}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, textAlign: 'center' }}>
          Puntuación de Armonía: {balanceAnalysis.score}%
        </Typography>

        {/* Element Details */}
        {isExpanded && (
          <>
            <Divider />
            <Stack spacing={1}>
              {radarDimensions.map((element) => (
                <Paper
                  key={element.label}
                  variant="outlined"
                  sx={{
                    p: 2,
                    backgroundColor: hoveredElement === element.label
                      ? alpha(element.color, 0.05)
                      : theme.palette.background.default,
                    border: hoveredElement === element.label
                      ? `1px solid ${element.color}`
                      : `1px solid ${theme.palette.divider}`,
                    transition: 'all 0.2s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={() => setHoveredElement(element.label)}
                  onMouseLeave={() => setHoveredElement(null)}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ color: element.color }}>
                      {element.icon}
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {element.label}: {element.value}%
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {element.description}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              ))}
            </Stack>
          </>
        )}

        {/* Recommendations */}
        {recommendations.length > 0 && isExpanded && (
          <>
            <Divider />
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              💡 Recomendaciones de Balance
            </Typography>
            <Stack spacing={1}>
              {recommendations.slice(0, 2).map((rec, index) => (
                <Paper
                  key={index}
                  variant="outlined"
                  sx={{
                    p: 2,
                    backgroundColor: theme.palette.background.default,
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.5 }}>
                    {rec.element.charAt(0).toUpperCase() + rec.element.slice(1)}: {rec.action}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                    {rec.philosophy}
                  </Typography>
                </Paper>
              ))}
            </Stack>
          </>
        )}
      </Stack>
    </Paper>
  );
};

export default ElementalHarmonyRadar;
