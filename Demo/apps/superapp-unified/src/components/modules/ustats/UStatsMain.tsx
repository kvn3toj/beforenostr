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
import { useReciprocidadIntelligence, ReciprocidadIntelligenceData } from '../../../hooks/useReciprocidadIntelligence';
import { useElementalBalance, ElementType } from '../../../hooks/home/useElementalBalance';

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
 * el impacto al Bien Común, y la danza armónica de tus elementos internos"
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
  const { reciprocityData } = useReciprocidadIntelligence('current-user');
  const reciprocidadIntelligence = reciprocityData as ReciprocidadIntelligenceData | undefined;

  // 🌪️ BALANCE ELEMENTAL DINÁMICO
  const elementalBalance = useElementalBalance(
    reciprocidadMetrics?.elementos || { fuego: 50, agua: 50, tierra: 50, aire: 50 },
    reciprocidadMetrics?.metricas.ondas || 0,
    reciprocidadMetrics?.metricas.meritos || 0,
    'fuego' as ElementType // ÜStats como módulo fuego
  );

  // 📊 MÉTRICAS FILOSÓFICAS CALCULADAS
  const philosophicalKPIs = useMemo(() => {
    const defaults = {
      reciprocidadBalanceIndex: 75,
      bienComunVector: 82,
      reciprocidadEfficiency: 68,
      communityResonance: 91,
      transcendenceLevel: 'Colaborador Consciente',
      nextMilestone: 'Guardián del Bien Común'
    };

    if (!reciprocidadMetrics) {
      return defaults;
    }

    return {
      reciprocidadBalanceIndex: Math.round(reciprocidadMetrics.metricas.balance * 100),
      bienComunVector: reciprocidadMetrics.metricas.contribucionesBienComun,
      reciprocidadEfficiency: elementalBalance.reciprocidadEfficiency,
      communityResonance: reciprocidadIntelligence?.communityImpact?.networkInfluence ?? defaults.communityResonance,
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

        {/* 🌟 GRID PRINCIPAL DE MÉTRICAS - REESTRUCTURADO PARA MEJOR RESPONSIVIDAD Y ORDEN */}
        <Grid container spacing={4}>

          {/* PRIMERA FILA: MÉTRICAS DE RECIPROCIDAD Y PROGRESO */}
          <Grid item xs={12} container spacing={4}>
            {/* COLUMNA IZQUIERDA: ÍNDICE DE EQUILIBRIO RECIPROCIDAD */}
            <Grid item xs={12} lg={8}>
              <Paper sx={{
                p: { xs: 2, md: 3 },
                height: '100%',
                border: `1px solid ${theme.palette.divider}`,
                display: 'flex',
                flexDirection: 'column'
              }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h5" sx={{ color: theme.palette.text.primary, fontWeight: 700 }}>
                    Índice de Equilibrio Reciprocidad
                  </Typography>
                  <IconButton
                    onClick={() => toggleSection('reciprocidad')}
                    size="small"
                    sx={{ color: theme.palette.text.secondary }}
                  >
                    {expandedSections.reciprocidad ? <ExpandLess /> : <ExpandMore />}
                  </IconButton>
                </Box>

                <Typography variant="subtitle1" sx={{ color: theme.palette.text.secondary, mb: 3 }}>
                  {philosophicalKPIs.reciprocidadBalanceIndex}% - Reciprocidad en armonía.
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

                <Collapse in={expandedSections.reciprocidad} timeout="auto" unmountOnExit>
                  <Box sx={{ mt: 3, borderTop: `1px solid ${theme.palette.divider}`, pt: 3 }}>
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

            {/* COLUMNA DERECHA: PROGRESO CONSCIENTE */}
            <Grid item xs={12} lg={4}>
              <Paper sx={{
                p: { xs: 2, md: 3 },
                height: '100%',
                border: `1px solid ${theme.palette.divider}`,
                display: 'flex',
                flexDirection: 'column'
              }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
                  Progreso Consciente
                </Typography>
                <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ConsciousProgressOrb
                    currentLevel={philosophicalKPIs.transcendenceLevel}
                    nextLevel={philosophicalKPIs.nextMilestone}
                    progress={philosophicalKPIs.reciprocidadBalanceIndex}
                    meritos={reciprocidadMetrics?.metricas.meritos || 0}
                  />
                </Box>
              </Paper>
            </Grid>
          </Grid>

          {/* SEGUNDA FILA: IMPACTO AL BIEN COMÚN Y BALANCE ELEMENTAL */}
          <Grid item xs={12} container spacing={4}>
            {/* COLUMNA IZQUIERDA: IMPACTO AL BIEN COMÚN */}
            <Grid item xs={12} md={6}>
              <Paper sx={{
                p: { xs: 2, md: 3 },
                height: '100%',
                border: `1px solid ${theme.palette.divider}`,
                display: 'flex',
                flexDirection: 'column'
              }}>
                <BienComunImpactVisualization
                  currentImpact={philosophicalKPIs.bienComunVector}
                  contributionHistory={[60, 65, 75, 72, 82]}
                  communityResonance={philosophicalKPIs.communityResonance}
                  trends={{
                    semanal: reciprocidadMetrics?.metricas?.crecimientoSemanal || 0,
                    mensual: 0,
                    anual: 0,
                  }}
                />
              </Paper>
            </Grid>

            {/* COLUMNA DERECHA: BALANCE ELEMENTAL */}
            <Grid item xs={12} md={6}>
              <Paper sx={{
                p: { xs: 2, md: 3 },
                height: '100%',
                border: `1px solid ${theme.palette.divider}`,
                display: 'flex',
                flexDirection: 'column'
              }}>
                <ElementalHarmonyRadar
                  elementos={elementalBalance.elements}
                  dominantElement={elementalBalance.dominantElement}
                />
              </Paper>
            </Grid>
          </Grid>

          {/* TERCERA FILA: FLUJO DE RECIPROCIDAD EN TIEMPO REAL */}
          <Grid item xs={12}>
            <Paper sx={{
              p: { xs: 2, md: 3 },
              border: `1px solid ${theme.palette.divider}`
            }}>
              <RealTimeReciprocidadFlow
                data={{
                  givingFlow: reciprocidadMetrics?.metricas.ondas || 0,
                  receivingFlow: reciprocidadMetrics?.metricas.meritos || 0,
                  balanceIndex: philosophicalKPIs.reciprocidadBalanceIndex,
                  totalTransactions: reciprocidadMetrics?.metricas.transaccionesTotales || 0,
                  activeConnections: reciprocidadMetrics?.metricas.rangoComunidad || 0,
                  networkResonance: philosophicalKPIs.communityResonance,
                  lastActivity: new Date(reciprocidadMetrics?.fechas?.ultimaActualizacion || Date.now()),
                  trend: (reciprocidadMetrics?.metricas?.crecimientoSemanal ?? 0) > 0 ? 'ascending' : ((reciprocidadMetrics?.metricas?.crecimientoSemanal ?? 0) < 0 ? 'descending' : 'stable'),
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

// @ts-ignore
UStatsMain.displayName = 'UStatsMain';

export default UStatsMain;
