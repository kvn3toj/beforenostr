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
} from '@mui/material';
import {
  Balance,
  TrendingUp,
  TrendingDown,
  Psychology,
  Favorite,
  AutoAwesome,
  ExpandMore,
  ExpandLess,
  Timeline,
  Insights,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

// 🌌 NIRA (Pattern Visionary) - Cosmic Design System
import { CosmicCard } from '../../../../design-system';
import { UNIFIED_COLORS } from '../../../../theme/colors';

interface CosmicReciprocidadCardProps {
  ayniBalance: number; // 0-100
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
 * 🌟 COSMIC RECIPROCIDAD CARD - NIRA (Pattern Visionary)
 * ====================================================
 *
 * Visualización cósmica del **Índice de Equilibrio Ayni (IEA)**
 *
 * Filosofía CoomÜnity:
 * - **Ayni**: Reciprocidad andina - equilibrio perfecto entre dar y recibir
 * - **Medición Consciente**: Métricas que nutren el alma, no el ego
 * - **Sabiduría Ancestral**: Convertir números en insights de transformación
 */
const CosmicReciprocidadCard: React.FC<CosmicReciprocidadCardProps> = React.memo(({
  ayniBalance,
  reciprocidadEfficiency,
  trends,
  insights = [],
  isExpanded = false
}) => {
  const theme = useTheme();
  const [showDetails, setShowDetails] = useState(false);

  // 🎯 Cálculos Filosóficos - NIRA
  const ayniStatus = useMemo(() => {
    if (ayniBalance >= 85) return {
      level: 'Armonía Cósmica',
      color: '#10B981',
      description: 'Perfecto equilibrio entre dar y recibir',
      advice: 'Mantén esta sabiduría y guía a otros'
    };
    if (ayniBalance >= 70) return {
      level: 'Equilibrio Ascendente',
      color: '#3B82F6',
      description: 'En camino hacia la armonía perfecta',
      advice: 'Continúa practicando la reciprocidad consciente'
    };
    if (ayniBalance >= 50) return {
      level: 'Despertar Consciente',
      color: '#F59E0B',
      description: 'Desarrollando consciencia del equilibrio',
      advice: 'Observa el flujo de dar y recibir en tu vida'
    };
    return {
      level: 'Semilla de Transformación',
      color: '#EF4444',
      description: 'Iniciando el viaje hacia el equilibrio',
      advice: 'Cada pequeña acción consciente cuenta'
    };
  }, [ayniBalance]);

  // 🌊 Eficiencia Energética
  const efficiencyColor = reciprocidadEfficiency >= 80 ? '#10B981' :
                          reciprocidadEfficiency >= 60 ? '#3B82F6' :
                          reciprocidadEfficiency >= 40 ? '#F59E0B' : '#EF4444';

  // 📈 Análisis de Tendencias
  const weeklyTrend = trends.weekly > 0 ? 'ascending' : trends.weekly < 0 ? 'descending' : 'stable';

  return (
    <CosmicCard
      variant="primary"
      element="fuego"
      enableGlow={true}
      enableAnimations={true}
      cosmicIntensity="medium"
      sx={{ height: '100%' }}
    >
      {/* 🌟 Header Principal */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              sx={{
                background: `linear-gradient(135deg, ${ayniStatus.color}, ${alpha(ayniStatus.color, 0.7)})`,
                color: 'white',
                width: 56,
                height: 56
              }}
            >
              <Balance sx={{ fontSize: 28 }} />
            </Avatar>

            <Box>
              <Typography variant="h4" sx={{
                fontWeight: 800,
                background: `linear-gradient(135deg, ${ayniStatus.color}, #FFB84D)`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                {ayniBalance}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Índice Equilibrio Ayni
              </Typography>
            </Box>
          </Box>

          <Tooltip title={showDetails ? 'Ocultar detalles' : 'Mostrar detalles filosóficos'}>
            <IconButton
              onClick={() => setShowDetails(!showDetails)}
              sx={{
                color: ayniStatus.color,
                '&:hover': { background: alpha(ayniStatus.color, 0.1) }
              }}
            >
              {showDetails ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          </Tooltip>
        </Box>

        {/* 📊 Barra de Progreso Cósmica */}
        <Box sx={{ mb: 2 }}>
          <LinearProgress
            variant="determinate"
            value={ayniBalance}
            sx={{
              height: 8,
              borderRadius: 4,
              background: alpha(ayniStatus.color, 0.1),
              '& .MuiLinearProgress-bar': {
                borderRadius: 4,
                background: `linear-gradient(90deg, ${ayniStatus.color}, #FFB84D)`
              }
            }}
          />
        </Box>

        {/* 🏷️ Estado Actual */}
        <Chip
          label={ayniStatus.level}
          sx={{
            background: alpha(ayniStatus.color, 0.15),
            color: ayniStatus.color,
            fontWeight: 600,
            border: `1px solid ${alpha(ayniStatus.color, 0.3)}`
          }}
        />
      </Box>

      {/* 📈 Métricas Secundarias */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6}>
          <Box sx={{ textAlign: 'center', p: 2, borderRadius: 2, background: alpha(efficiencyColor, 0.05) }}>
            <Typography variant="h6" sx={{ color: efficiencyColor, fontWeight: 700 }}>
              {reciprocidadEfficiency}%
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Eficiencia Energética
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={6}>
          <Box sx={{ textAlign: 'center', p: 2, borderRadius: 2, background: alpha(ayniStatus.color, 0.05) }}>
            <Stack direction="row" alignItems="center" justifyContent="center" spacing={0.5}>
              {weeklyTrend === 'ascending' ? (
                <TrendingUp sx={{ color: '#10B981', fontSize: 20 }} />
              ) : weeklyTrend === 'descending' ? (
                <TrendingDown sx={{ color: '#EF4444', fontSize: 20 }} />
              ) : (
                <Timeline sx={{ color: '#6B7280', fontSize: 20 }} />
              )}
              <Typography variant="h6" sx={{
                color: weeklyTrend === 'ascending' ? '#10B981' :
                       weeklyTrend === 'descending' ? '#EF4444' : '#6B7280',
                fontWeight: 700
              }}>
                {Math.abs(trends.weekly)}%
              </Typography>
            </Stack>
            <Typography variant="caption" color="text.secondary">
              Crecimiento Semanal
            </Typography>
          </Box>
        </Grid>
      </Grid>

      {/* 🔮 Sección Expandible de Sabiduría Filosófica */}
      <Collapse in={showDetails}>
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Box sx={{
              p: 3,
              borderRadius: 2,
              background: `linear-gradient(135deg, ${alpha(ayniStatus.color, 0.03)}, ${alpha('#FFB84D', 0.02)})`,
              border: `1px solid ${alpha(ayniStatus.color, 0.1)}`,
              mb: 2
            }}>
              <Typography variant="h6" sx={{ mb: 2, color: ayniStatus.color, fontWeight: 600 }}>
                🌿 Sabiduría del Ayni
              </Typography>

              <Typography variant="body2" sx={{ mb: 2, lineHeight: 1.6 }}>
                {ayniStatus.description}
              </Typography>

              <Box sx={{
                p: 2,
                borderRadius: 1,
                background: alpha(ayniStatus.color, 0.05),
                borderLeft: `4px solid ${ayniStatus.color}`
              }}>
                <Typography variant="body2" sx={{ fontWeight: 500, color: ayniStatus.color }}>
                  💡 Consejo Ancestral: {ayniStatus.advice}
                </Typography>
              </Box>

              {/* 📊 Mini-historial */}
              {trends.historical.length > 0 && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="caption" sx={{ mb: 1, display: 'block', fontWeight: 600 }}>
                    Evolución Histórica del Equilibrio
                  </Typography>
                  <Stack direction="row" spacing={1}>
                    {trends.historical.map((value, index) => (
                      <Box
                        key={index}
                        sx={{
                          width: 20,
                          height: Math.max(4, (value / 100) * 40),
                          background: `linear-gradient(to top, ${ayniStatus.color}, ${alpha(ayniStatus.color, 0.5)})`,
                          borderRadius: 1,
                          opacity: index === trends.historical.length - 1 ? 1 : 0.6
                        }}
                      />
                    ))}
                  </Stack>
                </Box>
              )}
            </Box>
          </motion.div>
        </AnimatePresence>
      </Collapse>

      {/* 💫 Insights Personalizados */}
      {insights.length > 0 && (
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: 'text.primary' }}>
            ✨ Insights Personalizados
          </Typography>
          <Stack spacing={1}>
            {insights.slice(0, 2).map((insight) => (
              <Box
                key={insight.id}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  background: alpha(
                    insight.type === 'positive' ? '#10B981' :
                    insight.type === 'improvement' ? '#F59E0B' : '#6B7280',
                    0.05
                  ),
                  border: `1px solid ${alpha(
                    insight.type === 'positive' ? '#10B981' :
                    insight.type === 'improvement' ? '#F59E0B' : '#6B7280',
                    0.15
                  )}`
                }}
              >
                <Typography variant="body2" sx={{ fontSize: '0.875rem', lineHeight: 1.5 }}>
                  {insight.message}
                </Typography>
                {insight.philosophy && (
                  <Typography variant="caption" sx={{
                    display: 'block',
                    mt: 1,
                    fontStyle: 'italic',
                    color: 'text.secondary'
                  }}>
                    🌱 {insight.philosophy}
                  </Typography>
                )}
              </Box>
            ))}
          </Stack>
        </Box>
      )}
    </CosmicCard>
  );
});

CosmicReciprocidadCard.displayName = 'CosmicReciprocidadCard';

export default CosmicReciprocidadCard;
