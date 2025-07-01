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

// 🌌 COSMIC DESIGN SYSTEM
import { UNIFIED_COLORS } from '../../../../theme/colors';

interface ElementalHarmonyRadarProps {
  metricas: {
    reciprocidad: number;
    bienComun: number;
    creatividad: number;
    colaboracion: number;
    estabilidad: number;
    comunicacion: number;
  };
  recommendations?: string[];
  compact?: boolean;
  showLabels?: boolean;
  'data-testid'?: string;
}

interface RadarPoint {
  label: string;
  value: number;
  color: string;
  icon: React.ReactElement;
  description: string;
}

/**
 * 🌟 ELEMENTAL HARMONY RADAR - ZENO (Experience Architect)
 * =======================================================
 *
 * Radar multidimensional que visualiza el ecosistema personal consciente
 * Representa 6 dimensiones fundamentales del desarrollo integral
 *
 * Filosofía Cósmica:
 * - No busca perfección, sino armonía dinámica
 * - Cada dimensión nutre a las otras en un ciclo virtuoso
 * - El crecimiento consciente es holístico, no fragmentado
 */
export const ElementalHarmonyRadar: React.FC<ElementalHarmonyRadarProps> = ({
  metricas,
  recommendations = [],
  compact = false,
  showLabels = true,
  'data-testid': testId = 'elemental-harmony-radar'
}) => {
  const theme = useTheme();
  const [hoveredDimension, setHoveredDimension] = useState<string | null>(null);

  // 🧠 NIRA - Configuración de dimensiones conscientes
  const radarDimensions: RadarPoint[] = useMemo(() => [
    {
      label: 'Reciprocidad',
      value: metricas.reciprocidad,
      color: UNIFIED_COLORS.primary.main,
      icon: <Balance />,
      description: 'Equilibrio entre dar y recibir'
    },
    {
      label: 'Bien Común',
      value: metricas.bienComun,
      color: UNIFIED_COLORS.success.main,
      icon: <Groups />,
      description: 'Contribución al bienestar colectivo'
    },
    {
      label: 'Creatividad',
      value: metricas.creatividad,
      color: '#FF6B35',
      icon: <AutoAwesome />,
      description: 'Capacidad de innovación y expresión'
    },
    {
      label: 'Colaboración',
      value: metricas.colaboracion,
      color: UNIFIED_COLORS.info.main,
      icon: <Favorite />,
      description: 'Habilidad para trabajar en equipo'
    },
    {
      label: 'Estabilidad',
      value: metricas.estabilidad,
      color: '#8B4513',
      icon: <Spa />,
      description: 'Consistencia y confiabilidad'
    },
    {
      label: 'Comunicación',
      value: metricas.comunicacion,
      color: '#87CEEB',
      icon: <Psychology />,
      description: 'Claridad en la expresión de ideas'
    }
  ], [metricas]);

  // 🎨 ARIA - Cálculo de puntos del polígono radar
  const radarPoints = useMemo(() => {
    const centerX = compact ? 80 : 120;
    const centerY = compact ? 80 : 120;
    const maxRadius = compact ? 60 : 90;

    return radarDimensions.map((dimension, index) => {
      const angle = (index * 60 - 90) * (Math.PI / 180); // Hexágono: 60° por punto
      const radius = (dimension.value / 100) * maxRadius;

      return {
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
        labelX: centerX + Math.cos(angle) * (maxRadius + 25),
        labelY: centerY + Math.sin(angle) * (maxRadius + 25),
        gridX: centerX + Math.cos(angle) * maxRadius,
        gridY: centerY + Math.sin(angle) * maxRadius,
        ...dimension
      };
    });
  }, [radarDimensions, compact]);

  // 🌟 ZENO - Análisis de armonía general
  const harmonyAnalysis = useMemo(() => {
    const values = Object.values(metricas);
    const average = values.reduce((sum, val) => sum + val, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - average, 2), 0) / values.length;
    const standardDeviation = Math.sqrt(variance);

    const harmonyScore = Math.max(0, 100 - (standardDeviation * 2));

    let harmonyLevel = 'Semilla';
    let harmonyColor = theme.palette.warning.main;

    if (harmonyScore >= 85) {
      harmonyLevel = 'Cósmica';
      harmonyColor = '#9C27B0';
    } else if (harmonyScore >= 70) {
      harmonyLevel = 'Elevada';
      harmonyColor = UNIFIED_COLORS.success.main;
    } else if (harmonyScore >= 55) {
      harmonyLevel = 'Equilibrada';
      harmonyColor = UNIFIED_COLORS.info.main;
    } else if (harmonyScore >= 40) {
      harmonyLevel = 'Creciente';
      harmonyColor = UNIFIED_COLORS.warning.main;
    }

    return {
      score: Math.round(harmonyScore),
      level: harmonyLevel,
      color: harmonyColor,
      average: Math.round(average),
      deviation: Math.round(standardDeviation)
    };
  }, [metricas, theme]);

  // 🎨 ARIA - Renderizar grid hexagonal
  const renderRadarGrid = () => {
    const centerX = compact ? 80 : 120;
    const centerY = compact ? 80 : 120;
    const maxRadius = compact ? 60 : 90;

    const gridLevels = [0.2, 0.4, 0.6, 0.8, 1.0];

    return (
      <>
        {/* Círculos de grid concéntricos */}
        {gridLevels.map((level, index) => (
          <polygon
            key={`grid-${index}`}
            points={radarPoints.map((_, pointIndex) => {
              const angle = (pointIndex * 60 - 90) * (Math.PI / 180);
              const radius = maxRadius * level;
              const x = centerX + Math.cos(angle) * radius;
              const y = centerY + Math.sin(angle) * radius;
              return `${x},${y}`;
            }).join(' ')}
            fill="none"
            stroke={alpha(theme.palette.divider, 0.3)}
            strokeWidth={1}
          />
        ))}

        {/* Líneas radiales */}
        {radarPoints.map((point, index) => (
          <line
            key={`line-${index}`}
            x1={centerX}
            y1={centerY}
            x2={point.gridX}
            y2={point.gridY}
            stroke={alpha(theme.palette.divider, 0.3)}
            strokeWidth={1}
          />
        ))}
      </>
    );
  };

  return (
    <Box
      data-testid={testId}
      sx={{
        position: 'relative',
        width: '100%',
        height: compact ? 200 : 300,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
      }}
    >
      {/* 📊 SVG Radar Chart */}
      <Box sx={{ position: 'relative', flex: 1 }}>
        <svg
          width={compact ? 160 : 240}
          height={compact ? 160 : 240}
          style={{ maxWidth: '100%', height: 'auto' }}
        >
          {/* Grid hexagonal */}
          {renderRadarGrid()}

          {/* Área del polígono de datos */}
          <polygon
            points={radarPoints.map(point => `${point.x},${point.y}`).join(' ')}
            fill={alpha(UNIFIED_COLORS.primary.main, 0.2)}
            stroke={UNIFIED_COLORS.primary.main}
            strokeWidth={2}
            style={{
              filter: 'drop-shadow(0 4px 12px rgba(99, 102, 241, 0.3))',
            }}
          />

          {/* Puntos de datos */}
          {radarPoints.map((point, index) => (
            <g key={`point-${index}`}>
              <circle
                cx={point.x}
                cy={point.y}
                r={compact ? 4 : 6}
                fill={point.color}
                stroke="white"
                strokeWidth={2}
                style={{
                  cursor: 'pointer',
                  filter: hoveredDimension === point.label
                    ? 'drop-shadow(0 0 8px rgba(255,255,255,0.8))'
                    : 'none',
                  transform: hoveredDimension === point.label
                    ? 'scale(1.2)'
                    : 'scale(1)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={() => setHoveredDimension(point.label)}
                onMouseLeave={() => setHoveredDimension(null)}
              />

              {/* Labels externos (si no es compacto) */}
              {!compact && showLabels && (
                <text
                  x={point.labelX}
                  y={point.labelY}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill={theme.palette.text.primary}
                  fontSize="11"
                  fontWeight="500"
                >
                  {point.label}
                </text>
              )}
            </g>
          ))}
        </svg>
      </Box>

      {/* 📊 Análisis de Armonía */}
      <Box sx={{ textAlign: 'center', minHeight: compact ? 40 : 60 }}>
        <Chip
          icon={<TrendingUp />}
          label={`Armonía ${harmonyAnalysis.level}: ${harmonyAnalysis.score}%`}
          sx={{
            backgroundColor: alpha(harmonyAnalysis.color, 0.1),
            color: harmonyAnalysis.color,
            border: `1px solid ${alpha(harmonyAnalysis.color, 0.3)}`,
            mb: 1,
          }}
        />

        {!compact && (
          <Typography variant="caption" color="text.secondary" display="block">
            Promedio: {harmonyAnalysis.average}% | Variación: {harmonyAnalysis.deviation}%
          </Typography>
        )}
      </Box>

      {/* 💡 Recomendaciones */}
      {!compact && recommendations.length > 0 && (
        <Stack direction="row" spacing={1} flexWrap="wrap" justifyContent="center">
          {recommendations.slice(0, 2).map((rec, index) => (
            <Tooltip key={index} title={rec}>
              <Chip
                size="small"
                label={`Tip ${index + 1}`}
                sx={{
                  fontSize: '0.7rem',
                  backgroundColor: alpha(UNIFIED_COLORS.info.main, 0.1),
                  color: UNIFIED_COLORS.info.main,
                }}
              />
            </Tooltip>
          ))}
        </Stack>
      )}

      {/* 🎨 CSS para animaciones */}
      <style>
        {`
          @keyframes radar-pulse {
            0%, 100% { transform: scale(1); opacity: 0.7; }
            50% { transform: scale(1.1); opacity: 1; }
          }
        `}
      </style>
    </Box>
  );
};

export default ElementalHarmonyRadar;
