import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Chip,
  Stack,
  IconButton,
  Collapse,
  useTheme,
  alpha,
  CircularProgress,
  Paper,
  Grid,
} from '@mui/material';
import {
  Whatshot,
  Waves,
  Terrain,
  Air,
  ExpandMore,
  ExpandLess,
} from '@mui/icons-material';

interface ElementalData {
  fuego: number;
  agua: number;
  tierra: number;
  aire: number;
}

interface PhilosophicalMetricsGalaxyProps {
  elementos: ElementalData;
  dominantElement: keyof ElementalData;
  balanceScore: number; // 0-100
  recommendations?: Array<{
    element: keyof ElementalData;
    action: string;
    philosophy: string;
  }>;
  isExpanded?: boolean;
}

// Configuración Elemental Simplificada
const ELEMENTAL_CONFIG = {
  fuego: {
    name: 'Fuego',
    symbol: '🔥',
    description: 'Pasión y Acción',
    philosophy: 'Energía creativa y manifestación',
    icon: Whatshot,
    keywords: ['creatividad', 'acción', 'pasión', 'liderazgo'],
    balance: 'equilibra con Agua para evitar el agotamiento'
  },
  agua: {
    name: 'Agua',
    symbol: '🌊',
    description: 'Fluidez y Adaptabilidad',
    philosophy: 'Colaboración y inteligencia emocional',
    icon: Waves,
    keywords: ['colaboración', 'empatía', 'fluidez', 'sanación'],
    balance: 'equilibra con Fuego para mantener la dirección'
  },
  tierra: {
    name: 'Tierra',
    symbol: '🌍',
    description: 'Estabilidad y Materialización',
    philosophy: 'Fundamentos sólidos y crecimiento sostenible',
    icon: Terrain,
    keywords: ['estabilidad', 'práctica', 'abundancia', 'crecimiento'],
    balance: 'equilibra con Aire para evitar el estancamiento'
  },
  aire: {
    name: 'Aire',
    symbol: '💨',
    description: 'Comunicación y Visión',
    philosophy: 'Ideas claras y perspectiva elevada',
    icon: Air,
    keywords: ['comunicación', 'visión', 'innovación', 'libertad'],
    balance: 'equilibra con Tierra para materializar las ideas'
  },
};

/**
 * 🌟 PHILOSOPHICAL METRICS GALAXY - Minimalist Version
 * ===================================================
 *
 * Visualización simplificada del equilibrio elemental
 *
 * Filosofía CoomÜnity:
 * - **4 Elementos**: Fuego, Agua, Tierra, Aire como dimensiones del ser
 * - **Balance Dinámico**: No hay elemento "malo", solo desequilibrios temporales
 * - **Sabiduría Ancestral**: Cada elemento tiene su momento y propósito
 * - **Crecimiento Integral**: El desarrollo consciente requiere todos los elementos
 */
const PhilosophicalMetricsGalaxy: React.FC<PhilosophicalMetricsGalaxyProps> = React.memo(({
  elementos,
  dominantElement,
  balanceScore,
  recommendations = [],
}) => {
  const theme = useTheme();
  const [selectedElement, setSelectedElement] = useState<keyof ElementalData | null>(null);
  const [showRecommendations, setShowRecommendations] = useState(false);

  // Análisis del Balance Elemental
  const elementalAnalysis = useMemo(() => {
    const total = elementos.fuego + elementos.agua + elementos.tierra + elementos.aire;
    const percentages = {
      fuego: total > 0 ? (elementos.fuego / total) * 100 : 25,
      agua: total > 0 ? (elementos.agua / total) * 100 : 25,
      tierra: total > 0 ? (elementos.tierra / total) * 100 : 25,
      aire: total > 0 ? (elementos.aire / total) * 100 : 25,
    };

    // Determinar estado del balance
    const variance = Object.values(percentages).reduce((acc, curr) => acc + Math.pow(curr - 25, 2), 0) / 4;
    const balanceStatus = variance < 50 ? 'Armonía' : variance < 150 ? 'Creciendo' : 'Desbalanceado';

    return { percentages, balanceStatus, variance };
  }, [elementos]);

  // Determinar colores basados en el tema
  const getElementColor = (element: keyof ElementalData) => {
    switch (element) {
      case 'fuego':
        return theme.palette.error.main;
      case 'agua':
        return theme.palette.primary.main;
      case 'tierra':
        return theme.palette.success.main;
      case 'aire':
        return theme.palette.secondary.main;
      default:
        return theme.palette.grey[500];
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        height: '100%',
        position: 'relative',
        p: 3,
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 2,
        '&:hover': {
          borderColor: theme.palette.primary.main,
          boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.1)}`,
        }
      }}
    >
      {/* Header con Balance Score */}
      <Box sx={{ mb: 3, textAlign: 'center' }}>
        <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
          🌌 Galaxia Elemental de tu Ser
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 2 }}>
          <CircularProgress
            variant="determinate"
            value={balanceScore}
            size={60}
            thickness={4}
            sx={{
              color: balanceScore >= 80 ? theme.palette.success.main :
                     balanceScore >= 60 ? theme.palette.primary.main :
                     theme.palette.warning.main,
              '& .MuiCircularProgress-circle': {
                strokeLinecap: 'round',
              }
            }}
          />
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              {balanceScore}%
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Balance Cósmico
            </Typography>
          </Box>
        </Box>

        <Chip
          label={elementalAnalysis.balanceStatus}
          variant="outlined"
          sx={{
            borderColor: getElementColor(dominantElement),
            color: getElementColor(dominantElement),
            fontWeight: 600
          }}
        />
      </Box>

      {/* Elementos en Grid */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {(Object.keys(elementos) as Array<keyof ElementalData>).map((element) => {
          if (!element || !ELEMENTAL_CONFIG[element]) {
            return null;
          }

          const config = ELEMENTAL_CONFIG[element];
          const percentage = elementalAnalysis.percentages[element];
          const ElementIcon = config.icon;
          const isDominant = element === dominantElement;
          const color = getElementColor(element);

          return (
            <Grid item xs={6} key={element}>
              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                  textAlign: 'center',
                  cursor: 'pointer',
                  borderColor: selectedElement === element ? color : theme.palette.divider,
                  backgroundColor: selectedElement === element
                    ? alpha(color, 0.05)
                    : 'transparent',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    borderColor: color,
                    backgroundColor: alpha(color, 0.05),
                    transform: 'translateY(-2px)',
                  },
                  ...(isDominant && {
                    boxShadow: `0 0 0 2px ${alpha(color, 0.3)}`,
                  })
                }}
                onClick={() => setSelectedElement(selectedElement === element ? null : element)}
              >
                <Box sx={{ mb: 1 }}>
                  <ElementIcon sx={{ fontSize: 32, color }} />
                </Box>

                <Typography variant="h6" sx={{ fontWeight: 600, color }}>
                  {percentage.toFixed(0)}%
                </Typography>

                <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                  {config.name}
                </Typography>

                <Typography variant="caption" color="text.secondary">
                  {config.description}
                </Typography>

                {isDominant && (
                  <Chip
                    label="Dominante"
                    size="small"
                    sx={{
                      mt: 1,
                      backgroundColor: alpha(color, 0.1),
                      color,
                      fontWeight: 600,
                      fontSize: '0.7rem'
                    }}
                  />
                )}
              </Paper>
            </Grid>
          );
        })}
      </Grid>

      {/* Detalles del Elemento Seleccionado */}
      {selectedElement && ELEMENTAL_CONFIG[selectedElement] && (
        <Paper
          variant="outlined"
          sx={{
            p: 2,
            mb: 3,
            backgroundColor: alpha(getElementColor(selectedElement), 0.05),
            borderColor: getElementColor(selectedElement),
          }}
        >
          <Typography variant="subtitle1" sx={{
            fontWeight: 600,
            color: getElementColor(selectedElement),
            mb: 1
          }}>
            {ELEMENTAL_CONFIG[selectedElement].symbol} {ELEMENTAL_CONFIG[selectedElement].name}
          </Typography>

          <Typography variant="body2" sx={{ mb: 2, color: theme.palette.text.secondary }}>
            {ELEMENTAL_CONFIG[selectedElement].philosophy}
          </Typography>

          <Box sx={{ mb: 2 }}>
            <Typography variant="caption" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
              Palabras clave:
            </Typography>
            <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
              {ELEMENTAL_CONFIG[selectedElement].keywords.map((keyword) => (
                <Chip
                  key={keyword}
                  label={keyword}
                  size="small"
                  variant="outlined"
                  sx={{
                    borderColor: getElementColor(selectedElement),
                    color: getElementColor(selectedElement),
                    fontSize: '0.7rem'
                  }}
                />
              ))}
            </Stack>
          </Box>

          <Typography variant="caption" sx={{
            fontStyle: 'italic',
            color: theme.palette.text.secondary,
          }}>
            💡 {ELEMENTAL_CONFIG[selectedElement].balance}
          </Typography>
        </Paper>
      )}

      {/* Recomendaciones */}
      {recommendations.length > 0 && (
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              💡 Recomendaciones de Equilibrio
            </Typography>
            <IconButton
              size="small"
              onClick={() => setShowRecommendations(!showRecommendations)}
              sx={{ color: theme.palette.text.secondary }}
            >
              {showRecommendations ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          </Box>

          <Collapse in={showRecommendations}>
            <Stack spacing={2}>
              {recommendations.slice(0, 3).map((rec, index) => (
                <Paper
                  key={index}
                  variant="outlined"
                  sx={{
                    p: 2,
                    backgroundColor: alpha(getElementColor(rec.element), 0.05),
                    borderColor: getElementColor(rec.element),
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                    🌟 {rec.action}
                  </Typography>
                  <Typography variant="caption" sx={{
                    color: theme.palette.text.secondary,
                    fontStyle: 'italic'
                  }}>
                    {rec.philosophy}
                  </Typography>
                </Paper>
              ))}
            </Stack>
          </Collapse>
        </Box>
      )}
    </Paper>
  );
});

PhilosophicalMetricsGalaxy.displayName = 'PhilosophicalMetricsGalaxy';

export default PhilosophicalMetricsGalaxy;
