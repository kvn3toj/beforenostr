import React, { useMemo, useState, useCallback } from 'react';
import { Box, Container, Grid, Typography, Fab, IconButton, Tooltip, Fade, Collapse, Paper } from '@mui/material';
import {
  AutoAwesome,
  Refresh,
  ExpandMore,
  ExpandLess,
} from '@mui/icons-material';
import { useTheme, alpha } from '@mui/material/styles';

// 🧠 PHILOSOPHICAL INTELLIGENCE HOOKS - NIRA
import { useDashboardAnalytics } from '../../../hooks/analytics/useDashboardAnalytics';
import { useReciprocidadMetrics } from '../../../hooks/home/useReciprocidadMetrics';
import { useReciprocidadIntelligence } from '../../../hooks/useReciprocidadIntelligence';
import { useElementalBalance } from '../../../hooks/home/useElementalBalance';

// 🎨 MINIMALIST COMPONENTS
import MinimalistReciprocidadCard from './components/MinimalistReciprocidadCard';
import PhilosophicalMetricsGalaxy from './components/PhilosophicalMetricsGalaxy';
import ConsciousProgressOrb from './components/ConsciousProgressOrb';
import ElementalHarmonyRadar from './components/ElementalHarmonyRadar';
import BienComunImpactVisualization from './components/BienComunImpactVisualization';
import ReciprocidadBalanceIndicator from './components/ReciprocidadBalanceIndicator';
import RealTimeReciprocidadFlow from './components/RealTimeReciprocidadFlow';

/**
 * 🌟 ÜSTATS MAIN - MINIMALIST METRICS MODULE
 * =========================================
 *
 * Transformación a diseño minimalista y limpio que presenta:
 * - Métricas filosóficas de Reciprocidad
 * - Balance elemental armonioso
 * - Impacto al Bien Común
 * - Progreso consciente del usuario
 *
 * Filosofía: "Medir lo que realmente importa - El equilibrio Reciprocidad,
 * el impacto al Bien Común, y la salud del ecosistema"
 */
const UStatsMain: React.FC = React.memo(() => {
  const theme = useTheme();

  // 🎭 Estados del dashboard
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    reciprocidad: false,
    elementos: false,
    impacto: false
  });
  const [isRefreshing, setIsRefreshing] = useState(false);

  // 🧠 HOOKS DE INTELIGENCIA FILOSÓFICA
  const { data: analytics, isLoading: analyticsLoading, refetch: refetchAnalytics } = useDashboardAnalytics();
  const { data: reciprocidadMetrics } = useReciprocidadMetrics();
  const { data: reciprocidadIntelligence } = useReciprocidadIntelligence('current-user');

  // 🌪️ BALANCE ELEMENTAL DINÁMICO
  const elementalBalance = useElementalBalance(
    reciprocidadMetrics?.elementos || { fuego: 50, agua: 50, tierra: 50, aire: 50 },
    reciprocidadMetrics?.metricas.ondas || 0,
    reciprocidadMetrics?.metricas.meritos || 0,
    'fuego' // ÜStats como módulo fuego
  );

  // 📊 MÉTRICAS FILOSÓFICAS CALCULADAS
  const philosophicalKPIs = useMemo(() => {
    if (!reciprocidadMetrics || !reciprocidadIntelligence) {
      return {
        reciprocidadBalanceIndex: 75,
        bienComunVector: 82,
        reciprocidadEfficiency: 68,
        communityResonance: 91,
        transcendenceLevel: 'Colaborador Consciente',
        nextMilestone: 'Guardián del Bien Común'
      };
    }

    return {
      reciprocidadBalanceIndex: Math.round(reciprocidadMetrics.metricas.balance * 100),
      bienComunVector: reciprocidadMetrics.metricas.contribucionesBienComun,
      reciprocidadEfficiency: elementalBalance.reciprocidadEfficiency,
      communityResonance: reciprocidadIntelligence?.impact?.networkInfluence ?? 91,
      transcendenceLevel: reciprocidadMetrics.nivel.actual,
      nextMilestone: reciprocidadMetrics.nivel.siguiente
    };
  }, [reciprocidadMetrics, reciprocidadIntelligence, elementalBalance]);

  // 🔄 REFRESH TOTAL
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([
        refetchAnalytics(),
        // Refresh otros hooks
      ]);
    } finally {
      setTimeout(() => setIsRefreshing(false), 2000);
    }
  }, [refetchAnalytics]);

  // 📐 TOGGLE SECCIONES EXPANDIBLES
  const toggleSection = useCallback((section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  }, []);

  return (
    <Box sx={{
      backgroundColor: theme.palette.background.default,
      minHeight: '100vh',
      py: { xs: 2, md: 4 }
    }}>
      <Container maxWidth="xl">
        {/* 🌟 HEADER MINIMALISTA */}
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontWeight: 800,
              color: theme.palette.text.primary,
              mb: 2,
              letterSpacing: '-0.02em'
            }}
          >
            Tu Cosmos de Transformación Consciente
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: theme.palette.text.secondary,
              fontWeight: 500,
              mb: 3,
              maxWidth: '600px',
              mx: 'auto',
              lineHeight: 1.6
            }}
          >
            Métricas que nutren el alma: Balance Reciprocidad, Impacto al Bien Común,
            y la danza armónica de tus elementos internos
          </Typography>

          {/* 🎛️ CONTROLES SIMPLES */}
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', alignItems: 'center' }}>
            <Tooltip title="Refrescar métricas">
              <IconButton
                onClick={handleRefresh}
                disabled={isRefreshing}
                sx={{
                  backgroundColor: theme.palette.background.paper,
                  color: theme.palette.primary.main,
                  border: `1px solid ${theme.palette.divider}`,
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.05),
                    borderColor: theme.palette.primary.main,
                  }
                }}
              >
                <Refresh sx={{ animation: isRefreshing ? 'spin 1s linear infinite' : 'none' }} />
              </IconButton>
            </Tooltip>

            <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
              Métricas actualizadas
            </Typography>
          </Box>
        </Box>

        {/* 🌟 GRID PRINCIPAL DE MÉTRICAS */}
        <Grid container spacing={3}>

          {/* 🔥 BALANCE RECIPROCIDAD */}
          <Grid item xs={12} lg={8}>
            <Paper sx={{
              p: 3,
              minHeight: '400px',
              border: `1px solid ${theme.palette.divider}`
            }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" sx={{ color: theme.palette.text.primary, fontWeight: 600 }}>
                  🌟 Índice de Equilibrio Reciprocidad (IER)
                </Typography>
                <IconButton
                  onClick={() => toggleSection('reciprocidad')}
                  size="small"
                  sx={{ color: theme.palette.text.secondary }}
                >
                  {expandedSections.reciprocidad ? <ExpandLess /> : <ExpandMore />}
                </IconButton>
              </Box>

              <Typography variant="subtitle2" sx={{ color: theme.palette.text.secondary, mb: 3 }}>
                {philosophicalKPIs.reciprocidadBalanceIndex}% - Reciprocidad en armonía perfecta
              </Typography>

              <MinimalistReciprocidadCard
                reciprocidadBalance={philosophicalKPIs.reciprocidadBalanceIndex}
                reciprocidadEfficiency={philosophicalKPIs.reciprocidadEfficiency}
                trends={{
                  weekly: 0,
                  monthly: 0,
                  historical: []
                }}
                insights={[]}
                isExpanded={expandedSections.reciprocidad}
              />

              <Collapse in={expandedSections.reciprocidad}>
                <Box sx={{ mt: 3 }}>
                  <ReciprocidadBalanceIndicator
                    data={{
                      currentBalance: philosophicalKPIs.reciprocidadBalanceIndex,
                      trend: reciprocidadMetrics?.metricas?.crecimientoSemanal || 0,
                      reciprocidadGiven: reciprocidadMetrics?.metricas?.ondas || 0,
                      reciprocidadReceived: reciprocidadMetrics?.metricas?.meritos || 0,
                      harmonyLevel: philosophicalKPIs.communityResonance,
                      lastUpdate: new Date().toISOString()
                    }}
                  />
                </Box>
              </Collapse>
            </Paper>
          </Grid>

          {/* 🎯 PROGRESO CONSCIENTE */}
          <Grid item xs={12} lg={4}>
            <Paper sx={{
              p: 3,
              minHeight: '400px',
              border: `1px solid ${theme.palette.divider}`
            }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                🎯 Progreso Consciente
              </Typography>

              <ConsciousProgressOrb
                currentLevel={philosophicalKPIs.transcendenceLevel}
                progress={philosophicalKPIs.reciprocidadBalanceIndex}
                meritosCount={reciprocidadMetrics?.metricas.meritos || 0}
              />
            </Paper>
          </Grid>

          {/* 🌍 IMPACTO AL BIEN COMÚN */}
          <Grid item xs={12} lg={6}>
            <Paper sx={{
              p: 3,
              minHeight: '360px',
              border: `1px solid ${theme.palette.divider}`
            }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  🌍 Vector de Impacto al Bien Común
                </Typography>
                <IconButton
                  onClick={() => toggleSection('impacto')}
                  size="small"
                  sx={{ color: theme.palette.text.secondary }}
                >
                  {expandedSections.impacto ? <ExpandLess /> : <ExpandMore />}
                </IconButton>
              </Box>

              <BienComunImpactVisualization
                currentImpact={philosophicalKPIs.bienComunVector}
                contributionHistory={[]}
                communityResonance={philosophicalKPIs.communityResonance}
                trends={{ semanal: reciprocidadMetrics?.metricas?.crecimientoSemanal || 0, mensual: 0, anual: 0 }}
                isExpanded={expandedSections.impacto}
              />
            </Paper>
          </Grid>

          {/* 🌪️ GALAXIA ELEMENTAL */}
          <Grid item xs={12} lg={6}>
            <Paper sx={{
              p: 3,
              minHeight: '360px',
              border: `1px solid ${theme.palette.divider}`
            }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  🌪️ Balance Elemental Dinámico
                </Typography>
                <IconButton
                  onClick={() => toggleSection('elementos')}
                  size="small"
                  sx={{ color: theme.palette.text.secondary }}
                >
                  {expandedSections.elementos ? <ExpandLess /> : <ExpandMore />}
                </IconButton>
              </Box>

              <PhilosophicalMetricsGalaxy
                elementos={elementalBalance.elements}
                dominantElement={elementalBalance.dominantElement}
                balanceScore={elementalBalance.balanceScore}
                recommendations={elementalBalance.recommendations}
                isExpanded={expandedSections.elementos}
              />

              <Collapse in={expandedSections.elementos}>
                <Box sx={{ mt: 3 }}>
                  <ElementalHarmonyRadar
                    elementos={elementalBalance?.elements || { fuego: 50, agua: 50, tierra: 50, aire: 50 }}
                    dominantElement={elementalBalance?.dominantElement || 'fuego'}
                    balanceScore={elementalBalance?.balanceScore || 75}
                    recommendations={elementalBalance?.recommendations?.slice(0, 2).map(rec => ({
                      element: 'fuego' as keyof ElementalData,
                      action: rec,
                      philosophy: 'Mantén el equilibrio y la armonía en tu desarrollo'
                    })) || []}
                    isExpanded={expandedSections.elementos}
                    size={280}
                  />
                </Box>
              </Collapse>
            </Paper>
          </Grid>

          {/* 🌊 FLUJO DE RECIPROCIDAD EN TIEMPO REAL */}
          <Grid item xs={12}>
            <Paper sx={{
              p: 3,
              border: `1px solid ${theme.palette.divider}`
            }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                🌊 Flujo de Reciprocidad en Tiempo Real
              </Typography>

              <RealTimeReciprocidadFlow
                data={{
                  givingFlow: reciprocidadMetrics?.metricas.flujosSalida || [],
                  receivingFlow: reciprocidadMetrics?.metricas.flujosEntrada || [],
                  balanceIndex: philosophicalKPIs.reciprocidadBalanceIndex,
                  totalTransactions: reciprocidadMetrics?.metricas.transaccionesTotales || 0,
                  activeConnections: reciprocidadMetrics?.metricas.conexionesActivas || 0,
                  networkResonance: philosophicalKPIs.communityResonance,
                  lastActivity: reciprocidadMetrics?.metricas.ultimaActividad || new Date().toISOString(),
                  trend: reciprocidadMetrics?.tendencias?.semanal || 0
                }}
              />
            </Paper>
          </Grid>
        </Grid>

        {/* 🎪 FAB DE ACCIÓN RÁPIDA */}
        <Fab
          color="primary"
          aria-label="Métricas avanzadas"
          sx={{
            position: 'fixed',
            bottom: 32,
            right: 32,
            zIndex: 1000,
            '&:hover': {
              backgroundColor: theme.palette.primary.dark,
            }
          }}
          onClick={() => setExpandedSections(prev => ({
            reciprocidad: !prev.reciprocidad,
            elementos: !prev.elementos,
            impacto: !prev.impacto
          }))}
        >
          <AutoAwesome />
        </Fab>
      </Container>

      {/* 🎨 CSS Animaciones */}
      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </Box>
  );
});

UStatsMain.displayName = 'UStatsMain';

export default UStatsMain;
