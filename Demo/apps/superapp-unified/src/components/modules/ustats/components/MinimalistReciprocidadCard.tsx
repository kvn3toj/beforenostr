import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  LinearProgress,
  IconButton,
  Tooltip,
  Chip,
  Grid,
  Avatar,
  Stack,
  useTheme,
  alpha,
  Collapse,
  Paper,
} from '@mui/material';
import {
  Balance,
  TrendingUp,
  TrendingDown,
  ExpandMore,
  ExpandLess,
  Timeline,
} from '@mui/icons-material';

interface MinimalistReciprocidadCardProps {
  reciprocidadBalance: number; // 0-100
  reciprocidadEfficiency: number; // 0-100
  trends: {
    weekly: number;
    monthly: number;
    historical: number[];
  };
  insights?: Array<{
    id: string;
    message: string;
    type: 'positive' | 'neutral' | 'improvement';
    philosophy?: string;
  }>;
  isExpanded?: boolean;
}

/**
 * 🌟 RECIPROCIDAD CARD - MINIMALIST VERSION
 * =========================================
 *
 * Visualización minimalista del **Índice de Equilibrio Reciprocidad (IER)**
 *
 * Filosofía CoomÜnity:
 * - **Reciprocidad**: Reciprocidad andina - equilibrio perfecto entre dar y recibir
 * - **Medición Consciente**: Métricas que nutren el alma, no el ego
 * - **Sabiduría Ancestral**: Convertir números en insights de transformación
 */
const MinimalistReciprocidadCard: React.FC<MinimalistReciprocidadCardProps> = React.memo(({
  reciprocidadBalance,
  reciprocidadEfficiency,
  trends,
  insights = [],
  isExpanded = false,
}) => {
  const theme = useTheme();
  const [showDetails, setShowDetails] = useState(isExpanded);

  // 🎯 Cálculos Filosóficos
  const reciprocidadStatus = useMemo(() => {
    if (reciprocidadBalance >= 85) return {
      level: 'Armonía Cósmica',
      color: theme.palette.success.main,
      description: 'Perfecto equilibrio entre dar y recibir',
      advice: 'Mantén esta sabiduría y guía a otros'
    };
    if (reciprocidadBalance >= 70) return {
      level: 'Equilibrio Ascendente',
      color: theme.palette.primary.main,
      description: 'En camino hacia la armonía perfecta',
      advice: 'Continúa practicando la reciprocidad consciente'
    };
    if (reciprocidadBalance >= 50) return {
      level: 'Despertar Consciente',
      color: theme.palette.warning.main,
      description: 'Desarrollando consciencia del equilibrio',
      advice: 'Observa el flujo de dar y recibir en tu vida'
    };
    return {
      level: 'Semilla de Transformación',
      color: theme.palette.error.main,
      description: 'Iniciando el viaje hacia el equilibrio',
      advice: 'Cada pequeña acción consciente cuenta'
    };
  }, [reciprocidadBalance, theme]);

  // 🌊 Eficiencia Energética
  const efficiencyColor = reciprocidadEfficiency >= 80 ? theme.palette.success.main :
                          reciprocidadEfficiency >= 60 ? theme.palette.primary.main :
                          reciprocidadEfficiency >= 40 ? theme.palette.warning.main : theme.palette.error.main;

  // 📈 Análisis de Tendencias
  const weeklyTrend = trends.weekly > 0 ? 'ascending' : trends.weekly < 0 ? 'descending' : 'stable';

  return (
    <Paper
      elevation={0}
      sx={{
        height: '100%',
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
    >
      {/* 🌟 Header Principal */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              sx={{
                backgroundColor: theme.palette.background.default,
                color: reciprocidadStatus.color,
                width: 56,
                height: 56,
                border: `2px solid ${reciprocidadStatus.color}`
              }}
            >
              <Balance sx={{ fontSize: 28 }} />
            </Avatar>

            <Box>
              <Typography variant="h4" sx={{
                fontWeight: 800,
                color: reciprocidadStatus.color
              }}>
                {reciprocidadBalance}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Índice Equilibrio Reciprocidad
              </Typography>
            </Box>
          </Box>

          <Tooltip title={showDetails ? 'Ocultar detalles' : 'Mostrar detalles filosóficos'}>
            <IconButton
              onClick={() => setShowDetails(!showDetails)}
              sx={{
                color: reciprocidadStatus.color,
                '&:hover': { backgroundColor: alpha(reciprocidadStatus.color, 0.1) }
              }}
            >
              {showDetails ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          </Tooltip>
        </Box>

        {/* 📊 Barra de Progreso */}
        <Box sx={{ mb: 2 }}>
          <LinearProgress
            variant="determinate"
            value={reciprocidadBalance}
            sx={{
              height: 8,
              borderRadius: 4,
              backgroundColor: alpha(theme.palette.divider, 0.3),
              '& .MuiLinearProgress-bar': {
                borderRadius: 4,
                backgroundColor: reciprocidadStatus.color
              }
            }}
          />
        </Box>

        {/* 🏷️ Estado Actual */}
        <Chip
          label={reciprocidadStatus.level}
          variant="outlined"
          sx={{
            color: reciprocidadStatus.color,
            borderColor: reciprocidadStatus.color,
            fontWeight: 600,
          }}
        />
      </Box>

      {/* 📈 Métricas Secundarias */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6}>
          <Paper
            variant="outlined"
            sx={{
              textAlign: 'center',
              p: 2,
              borderRadius: 2,
              backgroundColor: theme.palette.background.default,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700, color: efficiencyColor }}>
              {reciprocidadEfficiency}%
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Eficiencia
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={6}>
          <Paper
            variant="outlined"
            sx={{
              textAlign: 'center',
              p: 2,
              borderRadius: 2,
              backgroundColor: theme.palette.background.default,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1
            }}
          >
            {weeklyTrend === 'ascending' && <TrendingUp sx={{ color: theme.palette.success.main }} />}
            {weeklyTrend === 'descending' && <TrendingDown sx={{ color: theme.palette.error.main }} />}
            {weeklyTrend === 'stable' && <Timeline sx={{ color: theme.palette.text.secondary }} />}

            <Box>
              <Typography variant="h6" sx={{
                fontWeight: 700,
                color: weeklyTrend === 'ascending' ? theme.palette.success.main :
                       weeklyTrend === 'descending' ? theme.palette.error.main : theme.palette.text.secondary
              }}>
                {trends.weekly > 0 ? '+' : ''}{trends.weekly.toFixed(1)}%
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Tendencia
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* 🌟 Detalles Expandibles */}
      <Collapse in={showDetails}>
        <Box sx={{ pt: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
          {/* 📜 Descripción Filosófica */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="body1" sx={{
              color: theme.palette.text.primary,
              fontWeight: 500,
              mb: 1
            }}>
              {reciprocidadStatus.description}
            </Typography>
            <Typography variant="body2" sx={{
              color: theme.palette.text.secondary,
              fontStyle: 'italic'
            }}>
              💡 {reciprocidadStatus.advice}
            </Typography>
          </Box>

          {/* 🧠 Insights Personalizados */}
          {insights.length > 0 && (
            <Box>
              <Typography variant="subtitle2" sx={{
                fontWeight: 600,
                color: theme.palette.text.primary,
                mb: 1
              }}>
                🌟 Insights de Transformación
              </Typography>
              <Stack spacing={1}>
                {insights.slice(0, 3).map((insight) => (
                  <Paper
                    key={insight.id}
                    variant="outlined"
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      backgroundColor: theme.palette.background.default,
                    }}
                  >
                    <Typography variant="body2" sx={{
                      color: theme.palette.text.primary,
                      mb: insight.philosophy ? 0.5 : 0
                    }}>
                      {insight.message}
                    </Typography>
                    {insight.philosophy && (
                      <Typography variant="caption" sx={{
                        color: theme.palette.text.secondary,
                        fontStyle: 'italic'
                      }}>
                        {insight.philosophy}
                      </Typography>
                    )}
                  </Paper>
                ))}
              </Stack>
            </Box>
          )}
        </Box>
      </Collapse>
    </Paper>
  );
});

MinimalistReciprocidadCard.displayName = 'MinimalistReciprocidadCard';

export default MinimalistReciprocidadCard;
