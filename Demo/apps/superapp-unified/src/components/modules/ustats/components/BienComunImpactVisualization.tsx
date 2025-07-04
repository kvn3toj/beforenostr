import React, { useMemo } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Paper,
  Grid,
  Chip,
  Stack
} from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';

interface BienComunImpactVisualizationProps {
  currentImpact: number; // 0-100 puntos de impacto
  contributionHistory: number[]; // Historial de contribuciones
  communityResonance: number; // 0-100 resonancia con la comunidad
  trends: {
    semanal: number;
    mensual: number;
    anual: number;
  };
  isExpanded?: boolean;
}

/**
 * 🌍 BIEN COMÚN IMPACT VISUALIZATION - MINIMALIST
 * =================================================
 *
 * Visualización simplificada del impacto al Bien Común que muestra:
 * - Puntuación de impacto en un diseño limpio
 * - Resonancia con la comunidad
 * - Historial de contribuciones
 * - Tendencias de crecimiento
 *
 * Filosofía: "Cada acción consciente genera ondas que trascienden
 * al individuo y nutren el Bien Común de toda la comunidad"
 */
const BienComunImpactVisualization: React.FC<BienComunImpactVisualizationProps> = ({
  currentImpact,
  contributionHistory,
  communityResonance,
  trends,
  isExpanded = false
}) => {
  const theme = useTheme();

  // 📊 DETERMINAR NIVEL DE IMPACTO
  const impactLevel = useMemo(() => {
    if (currentImpact >= 90) return { level: 'Transformador', color: theme.palette.success.main };
    if (currentImpact >= 70) return { level: 'Significativo', color: theme.palette.primary.main };
    if (currentImpact >= 50) return { level: 'Positivo', color: theme.palette.info.main };
    if (currentImpact >= 30) return { level: 'Emergente', color: theme.palette.warning.main };
    return { level: 'Inicial', color: theme.palette.error.main };
  }, [currentImpact, theme]);

  // 📈 DETERMINAR TENDENCIA PRINCIPAL
  const mainTrend = useMemo(() => {
    const weeklyTrend = trends.semanal;
    if (weeklyTrend > 5) return { text: 'Creciendo', color: theme.palette.success.main };
    if (weeklyTrend > 0) return { text: 'Estable+', color: theme.palette.primary.main };
    if (weeklyTrend > -5) return { text: 'Estable', color: theme.palette.grey[600] };
    return { text: 'Declinando', color: theme.palette.warning.main };
  }, [trends.semanal, theme]);

  return (
    <Box sx={{ width: '100%', height: 'auto' }}>
      {/* 🎯 MÉTRICA PRINCIPAL */}
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 3,
        mb: 3
      }}>
        {/* Círculo de progreso principal */}
        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
          <CircularProgress
            variant="determinate"
            value={100}
            size={80}
            thickness={4}
            sx={{
              color: alpha(theme.palette.divider, 0.3),
              position: 'absolute',
            }}
          />
          <CircularProgress
            variant="determinate"
            value={currentImpact}
            size={80}
            thickness={4}
            sx={{
              color: impactLevel.color,
              '& .MuiCircularProgress-circle': {
                strokeLinecap: 'round',
              },
            }}
          />
          <Box
            sx={{
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              position: 'absolute',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography
              variant="h6"
              component="div"
              sx={{
                color: theme.palette.text.primary,
                fontWeight: 700,
                fontSize: '1rem'
              }}
            >
              {currentImpact}
            </Typography>
          </Box>
        </Box>

        {/* Información del impacto */}
        <Box>
          <Typography variant="h6" sx={{
            color: impactLevel.color,
            fontWeight: 600,
            mb: 0.5
          }}>
            Impacto {impactLevel.level}
          </Typography>
          <Chip
            label={mainTrend.text}
            size="small"
            sx={{
              backgroundColor: alpha(mainTrend.color, 0.1),
              color: mainTrend.color,
              border: `1px solid ${mainTrend.color}`,
              fontWeight: 600
            }}
          />
        </Box>
      </Box>

      {/* 📈 MÉTRICAS SECUNDARIAS */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={4}>
          <Paper
            variant="outlined"
            sx={{
              p: 1.5,
              textAlign: 'center',
              backgroundColor: alpha(theme.palette.success.main, 0.05),
              borderColor: alpha(theme.palette.success.main, 0.3)
            }}
          >
            <Typography variant="h6" sx={{
              color: theme.palette.success.main,
              fontWeight: 700,
              mb: 0.5
            }}>
              {communityResonance}%
            </Typography>
            <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
              Resonancia Comunitaria
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={4}>
          <Paper
            variant="outlined"
            sx={{
              p: 1.5,
              textAlign: 'center',
              backgroundColor: alpha(theme.palette.primary.main, 0.05),
              borderColor: alpha(theme.palette.primary.main, 0.3)
            }}
          >
            <Typography variant="h6" sx={{
              color: theme.palette.primary.main,
              fontWeight: 700,
              mb: 0.5
            }}>
              {contributionHistory.length}
            </Typography>
            <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
              Contribuciones Totales
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={4}>
          <Paper
            variant="outlined"
            sx={{
              p: 1.5,
              textAlign: 'center',
              backgroundColor: alpha(mainTrend.color, 0.05),
              borderColor: alpha(mainTrend.color, 0.3)
            }}
          >
            <Typography variant="h6" sx={{
              color: mainTrend.color,
              fontWeight: 700,
              mb: 0.5
            }}>
              {trends.semanal > 0 ? '+' : ''}{trends.semanal.toFixed(1)}%
            </Typography>
            <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
              Crecimiento Semanal
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* 📊 MINI HISTORIAL DE CONTRIBUCIONES */}
      {contributionHistory.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" sx={{
            mb: 1,
            fontWeight: 600,
            color: theme.palette.text.primary
          }}>
            📈 Evolución del Impacto
          </Typography>
          <Box sx={{
            display: 'flex',
            gap: 1,
            alignItems: 'end',
            height: 40,
            p: 1,
            backgroundColor: theme.palette.background.default,
            borderRadius: 1,
            border: `1px solid ${theme.palette.divider}`
          }}>
            {contributionHistory.slice(-12).map((contribution, index) => {
              const maxContribution = Math.max(...contributionHistory);
              const height = maxContribution > 0 ? (contribution / maxContribution) * 30 : 5;

              return (
                <Box
                  key={index}
                  sx={{
                    flex: 1,
                    height: `${Math.max(height, 3)}px`,
                    backgroundColor: impactLevel.color,
                    borderRadius: '2px 2px 0 0',
                    opacity: 0.6 + (index / contributionHistory.slice(-12).length) * 0.4,
                    minHeight: 3
                  }}
                />
              );
            })}
          </Box>
        </Box>
      )}

      {/* 🌟 TENDENCIAS DETALLADAS */}
      {isExpanded && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle2" sx={{
            mb: 2,
            fontWeight: 600,
            color: theme.palette.text.primary
          }}>
            🌊 Análisis de Tendencias
          </Typography>
          <Stack direction="row" spacing={2}>
            <Chip
              label={`Semanal: ${trends.semanal > 0 ? '+' : ''}${trends.semanal.toFixed(1)}%`}
              variant="outlined"
              sx={{
                color: trends.semanal >= 0 ? theme.palette.success.main : theme.palette.error.main,
                borderColor: trends.semanal >= 0 ? theme.palette.success.main : theme.palette.error.main
              }}
            />
            <Chip
              label={`Mensual: ${trends.mensual > 0 ? '+' : ''}${trends.mensual.toFixed(1)}%`}
              variant="outlined"
              sx={{
                color: trends.mensual >= 0 ? theme.palette.success.main : theme.palette.error.main,
                borderColor: trends.mensual >= 0 ? theme.palette.success.main : theme.palette.error.main
              }}
            />
            <Chip
              label={`Anual: ${trends.anual > 0 ? '+' : ''}${trends.anual.toFixed(1)}%`}
              variant="outlined"
              sx={{
                color: trends.anual >= 0 ? theme.palette.success.main : theme.palette.error.main,
                borderColor: trends.anual >= 0 ? theme.palette.success.main : theme.palette.error.main
              }}
            />
          </Stack>
        </Box>
      )}
    </Box>
  );
};

export default BienComunImpactVisualization;
