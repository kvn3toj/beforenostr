import React, { useMemo, useState, useCallback } from 'react';
import { Box, Container, Grid, Typography, Fab, IconButton, Tooltip, Fade, Collapse } from '@mui/material';
import {
  AutoAwesome,
  Refresh,
  ExpandMore,
  ExpandLess,
  Psychology,
  Favorite,
  Diamond,
  Timeline,
  TrendingUp,
  EmojiEvents,
  FlashOn,
  AllInclusive,
} from '@mui/icons-material';

// 🌌 COSMIC DESIGN SYSTEM IMPORTS - NIRA (Pattern Visionary)
import {
  RevolutionaryWidgetFuego,
  REVOLUTIONARY_PRESETS
} from '../../../design-system';
import { UNIFIED_COLORS } from '../../../theme/colors';

// 🧠 PHILOSOPHICAL INTELLIGENCE HOOKS - NIRA
import { useDashboardAnalytics } from '../../../hooks/analytics/useDashboardAnalytics';
import { useReciprocidadMetrics } from '../../../hooks/home/useReciprocidadMetrics';
import { useReciprocidadIntelligence } from '../../../hooks/useReciprocidadIntelligence';
import { useElementalBalance } from '../../../hooks/home/useElementalBalance';

// 🎨 COSMIC COMPONENTS - ARIA & PHOENIX (Frontend Artist & Transformer)
import CosmicReciprocidadCard from './components/CosmicReciprocidadCard';
import PhilosophicalMetricsGalaxy from './components/PhilosophicalMetricsGalaxy';
import ConsciousProgressOrb from './components/ConsciousProgressOrb';
import ElementalHarmonyRadar from './components/ElementalHarmonyRadar';
import BienComunImpactVisualization from './components/BienComunImpactVisualization';
import AyniBalanceIndicator from './components/AyniBalanceIndicator';
import RealTimeReciprocidadFlow from './components/RealTimeReciprocidadFlow';

// 🔮 PERFORMANCE MONITORING - PHOENIX
import { useCosmicPerformance } from '../../../hooks/useCosmicPerformance';

/**
 * 🌟 ÜSTATS MAIN - COSMIC PILOT MODULE
 * ===================================
 *
 * Transformación cósmica completa con el equipo de Guardianes:
 * - NIRA: RevolutionaryWidget + KPIs filosóficos
 * - ARIA & PHOENIX: CosmicCard + optimización React.memo
 * - KIRA & ZENO: Microcopy filosófico + flujos intuitivos
 * - SAGE & COSMOS: Testing E2E + integración armónica
 *
 * Filosofía: "Medir lo que realmente importa - El equilibrio Ayni,
 * el impacto al Bien Común, y la salud del ecosistema"
 */
const UStatsMain: React.FC = React.memo(() => {
  // 🎭 Estados del dashboard cósmico
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    reciprocidad: false,
    elementos: false,
    impacto: false
  });
  const [cosmicIntensity, setCosmicIntensity] = useState<'subtle' | 'medium' | 'intense'>('medium');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // 🧠 HOOKS DE INTELIGENCIA FILOSÓFICA - NIRA
  const { data: analytics, isLoading: analyticsLoading, refetch: refetchAnalytics } = useDashboardAnalytics();
  const { data: reciprocidadMetrics, isLoading: reciprocidadLoading } = useReciprocidadMetrics();
  const { data: reciprocidadIntelligence, isLoading: intelligenceLoading } = useReciprocidadIntelligence('current-user');

  // 🌪️ BALANCE ELEMENTAL DINÁMICO
  const elementalBalance = useElementalBalance(
    reciprocidadMetrics?.elementos || { fuego: 50, agua: 50, tierra: 50, aire: 50 },
    reciprocidadMetrics?.metricas.ondas || 0,
    reciprocidadMetrics?.metricas.meritos || 0,
    'fuego' // ÜStats como módulo fuego
  );

  // 🚀 MONITORING DE PERFORMANCE CÓSMICA - PHOENIX
  const { performance3D, toggleCosmicMode, cosmicMode } = useCosmicPerformance({
    enabledByDefault: true,
    performanceThreshold: 45 // FPS mínimo
  });

  // 📊 MÉTRICAS FILOSÓFICAS CALCULADAS - NIRA
  const philosophicalKPIs = useMemo(() => {
    if (!reciprocidadMetrics || !reciprocidadIntelligence) {
      return {
        ayniBalanceIndex: 75,
        bienComunVector: 82,
        reciprocidadEfficiency: 68,
        communityResonance: 91,
        transcendenceLevel: 'Colaborador Consciente',
        nextMilestone: 'Guardián del Bien Común'
      };
    }

    return {
      ayniBalanceIndex: Math.round(reciprocidadMetrics.metricas.balance * 100),
      bienComunVector: reciprocidadMetrics.metricas.contribucionesBienComun,
      reciprocidadEfficiency: elementalBalance.reciprocidadEfficiency,
      communityResonance: reciprocidadIntelligence.communityImpact.networkInfluence,
      transcendenceLevel: reciprocidadMetrics.nivel.actual,
      nextMilestone: reciprocidadMetrics.nivel.siguiente
    };
  }, [reciprocidadMetrics, reciprocidadIntelligence, elementalBalance]);

  // 🔄 REFRESH CÓSMICO TOTAL - KIRA (Word Weaver)
  const handleCosmicRefresh = useCallback(async () => {
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

  // 📐 TOGGLE SECCIONES EXPANDIBLES - ZENO (Experience Architect)
  const toggleSection = useCallback((section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  }, []);

  // 🎨 EFECTOS CÓSMICOS DINÁMICOS
  const cosmicEffects = useMemo(() => ({
    enableGlow: cosmicMode,
    enableParticles: cosmicIntensity === 'intense',
    enableAnimations: performance3D.fps > 45,
    glowIntensity: cosmicIntensity === 'intense' ? 1.5 : cosmicIntensity === 'medium' ? 1 : 0.5,
    particleConfig: {
      count: 5,
      size: 4,
      color: '#FF6B35',
      speed: 1,
      opacity: 0.6,
      blur: true
    }
  }), [cosmicMode, cosmicIntensity, performance3D.fps]);

  return (
    <Box sx={{
      background: `
        radial-gradient(circle at 20% 20%, rgba(255, 107, 53, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 80% 80%, rgba(255, 184, 77, 0.08) 0%, transparent 50%),
        linear-gradient(180deg,
          rgba(255, 254, 251, 0.95) 0%,
          rgba(255, 248, 240, 0.98) 50%,
          rgba(255, 254, 251, 1) 100%
        )
      `,
      minHeight: '100vh',
      py: { xs: 2, md: 4 },
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* 🌟 PARTÍCULAS CÓSMICAS DE FONDO */}
      {cosmicEffects.enableParticles && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 0,
            '&::before': {
              content: '""',
              position: 'absolute',
              top: '10%',
              left: '15%',
              width: '3px',
              height: '3px',
              background: 'radial-gradient(circle, #FF6B35 0%, transparent 70%)',
              borderRadius: '50%',
              animation: 'cosmic-drift 8s ease-in-out infinite',
              opacity: 0.6
            },
            '&::after': {
              content: '""',
              position: 'absolute',
              top: '60%',
              right: '20%',
              width: '2px',
              height: '2px',
              background: 'radial-gradient(circle, #FFB84D 0%, transparent 70%)',
              borderRadius: '50%',
              animation: 'cosmic-drift 12s ease-in-out infinite reverse',
              opacity: 0.4
            }
          }}
        />
      )}

      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
        {/* 🌌 HEADER CÓSMICO - KIRA (Word Weaver) */}
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontWeight: 800,
              background: 'linear-gradient(135deg, #FF6B35 0%, #FFB84D 50%, #FF8A50 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 4px 20px rgba(255, 107, 53, 0.3)',
              mb: 2,
              letterSpacing: '-0.02em'
            }}
          >
            Tu Cosmos de Transformación Consciente
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: 'rgba(139, 69, 19, 0.8)',
              fontWeight: 500,
              mb: 3,
              maxWidth: '600px',
              mx: 'auto',
              lineHeight: 1.6
            }}
          >
            Métricas que nutren el alma: Balance Ayni, Impacto al Bien Común,
            y la danza armónica de tus elementos internos
          </Typography>

          {/* 🎛️ CONTROLES CÓSMICOS */}
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', alignItems: 'center' }}>
            <Tooltip title="Refrescar métricas cósmicas">
              <IconButton
                onClick={handleCosmicRefresh}
                disabled={isRefreshing}
                sx={{
                  background: 'linear-gradient(135deg, #FF6B35, #FFB84D)',
                  color: 'white',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #E55A2B, #E6A43F)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(255, 107, 53, 0.4)'
                  }
                }}
              >
                <Refresh sx={{ animation: isRefreshing ? 'spin 1s linear infinite' : 'none' }} />
              </IconButton>
            </Tooltip>

            <Tooltip title={`Modo cósmico: ${cosmicMode ? 'Activo' : 'Desactivado'}`}>
              <IconButton
                onClick={toggleCosmicMode}
                sx={{
                  background: cosmicMode
                    ? 'linear-gradient(135deg, #9C27B0, #E91E63)'
                    : 'rgba(156, 39, 176, 0.1)',
                  color: cosmicMode ? 'white' : '#9C27B0',
                  border: !cosmicMode ? '2px solid #9C27B0' : 'none',
                  '&:hover': {
                    background: cosmicMode
                      ? 'linear-gradient(135deg, #8E24AA, #D81B60)'
                      : 'rgba(156, 39, 176, 0.2)'
                  }
                }}
              >
                <AutoAwesome />
              </IconButton>
            </Tooltip>

            <Typography variant="caption" sx={{ color: 'rgba(139, 69, 19, 0.6)' }}>
              Performance: {performance3D.fps} FPS | Suavidad: {performance3D.smoothness}%
            </Typography>
          </Box>
        </Box>

        {/* 🌌 GRID PRINCIPAL DE MÉTRICAS CÓSMICAS */}
        <Grid container spacing={3}>

          {/* 🔥 BALANCE AYNI REVOLUCIONARIO - NIRA */}
          <Grid item xs={12} lg={8}>
            <RevolutionaryWidgetFuego
              title="🌟 Índice de Equilibrio Ayni (IEA)"
              subtitle={`${philosophicalKPIs.ayniBalanceIndex}% - Reciprocidad en armonía perfecta`}
              cosmicIntensity={cosmicIntensity}
              cosmicEffects={cosmicEffects}
              isLoading={reciprocidadLoading}
              onRefresh={handleCosmicRefresh}
              onExpand={() => toggleSection('reciprocidad')}
              style={{ minHeight: '400px' }}
            >
              <CosmicReciprocidadCard
                ayniBalance={philosophicalKPIs.ayniBalanceIndex}
                reciprocidadEfficiency={philosophicalKPIs.reciprocidadEfficiency}
                trends={{
                  weekly: reciprocidadMetrics?.metricas.crecimientoSemanal || 0,
                  monthly: 18.5,
                  historical: [65, 72, 68, 78, philosophicalKPIs.ayniBalanceIndex]
                }}
                insights={reciprocidadIntelligence?.personalizedInsights}
                isExpanded={expandedSections.reciprocidad}
              />
            </RevolutionaryWidgetFuego>
          </Grid>

          {/* 💎 MÉTRICAS TRASCENDENTALES - NIRA */}
          <Grid item xs={12} lg={4}>
            <Grid container spacing={3}>

              {/* 🏆 NIVEL DE CONSCIENCIA */}
              <Grid item xs={12}>
                <RevolutionaryWidgetFuego
                  title="👑 Nivel de Consciencia"
                  subtitle={philosophicalKPIs.transcendenceLevel}
                  cosmicIntensity="subtle"
                  cosmicEffects={{ ...cosmicEffects, enableParticles: false }}
                  style={{ height: '180px' }}
                >
                  <ConsciousProgressOrb
                    currentLevel={philosophicalKPIs.transcendenceLevel}
                    nextLevel={philosophicalKPIs.nextMilestone}
                    progress={reciprocidadMetrics?.nivel.progreso || 73}
                    meritos={reciprocidadMetrics?.metricas.meritos || 0}
                  />
                </RevolutionaryWidgetFuego>
              </Grid>

              {/* 🌍 VECTOR BIEN COMÚN */}
              <Grid item xs={12}>
                <RevolutionaryWidgetFuego
                  title="🌍 Vector Bien Común (VBC)"
                  subtitle={`${philosophicalKPIs.bienComunVector} puntos de impacto`}
                  cosmicIntensity="subtle"
                  cosmicEffects={{ ...cosmicEffects, enableParticles: false }}
                  style={{ height: '180px' }}
                >
                  <BienComunImpactVisualization
                    impact={philosophicalKPIs.bienComunVector}
                    communityResonance={philosophicalKPIs.communityResonance}
                    contributions={reciprocidadMetrics?.metricas.transaccionesTotales || 0}
                  />
                </RevolutionaryWidgetFuego>
              </Grid>

            </Grid>
          </Grid>

          {/* 🌪️ GALAXIA DE ELEMENTOS - ARIA & PHOENIX */}
          <Grid item xs={12} lg={6}>
            <RevolutionaryWidgetFuego
              title="🌌 Galaxia Elemental de tu Ser"
              subtitle="Equilibrio dinámico de Fuego, Agua, Tierra y Aire"
              cosmicIntensity={cosmicIntensity}
              cosmicEffects={cosmicEffects}
              onExpand={() => toggleSection('elementos')}
              style={{ minHeight: '450px' }}
            >
              <PhilosophicalMetricsGalaxy
                elementos={reciprocidadMetrics?.elementos || { fuego: 50, agua: 50, tierra: 50, aire: 50 }}
                dominantElement={elementalBalance.dominantElement}
                balanceScore={elementalBalance.balanceScore}
                recommendations={elementalBalance.recommendations}
                isExpanded={expandedSections.elementos}
                cosmicEffects={cosmicEffects}
              />
            </RevolutionaryWidgetFuego>
          </Grid>

          {/* ⚖️ RADAR DE ARMONÍA - ZENO */}
          <Grid item xs={12} lg={6}>
            <RevolutionaryWidgetFuego
              title="⚖️ Radar de Armonía Consciente"
              subtitle="Visualización multidimensional de tu ecosistema personal"
              cosmicIntensity={cosmicIntensity}
              cosmicEffects={cosmicEffects}
              style={{ minHeight: '450px' }}
            >
              <ElementalHarmonyRadar
                metricas={{
                  reciprocidad: philosophicalKPIs.ayniBalanceIndex,
                  bienComun: philosophicalKPIs.bienComunVector,
                  creatividad: reciprocidadMetrics?.elementos.fuego || 50,
                  colaboracion: reciprocidadMetrics?.elementos.agua || 50,
                  estabilidad: reciprocidadMetrics?.elementos.tierra || 50,
                  comunicacion: reciprocidadMetrics?.elementos.aire || 50
                }}
                recommendations={reciprocidadIntelligence?.recommendations || []}
              />
            </RevolutionaryWidgetFuego>
          </Grid>

          {/* 💫 FLUJO RECIPROCIDAD EN TIEMPO REAL - PHOENIX */}
          <Grid item xs={12}>
            <RevolutionaryWidgetFuego
              title="💫 Flujo de Reciprocidad en Tiempo Real"
              subtitle="Observa cómo tus acciones crean ondas de transformación"
              cosmicIntensity={cosmicIntensity}
              cosmicEffects={cosmicEffects}
              onExpand={() => toggleSection('impacto')}
              style={{ minHeight: '300px' }}
            >
              <Collapse in={!expandedSections.impacto} timeout="auto">
                <AyniBalanceIndicator
                  currentBalance={philosophicalKPIs.ayniBalanceIndex}
                  weeklyFlow={{
                    given: reciprocidadMetrics?.metricas.meritos || 0,
                    received: reciprocidadMetrics?.metricas.ondas || 0,
                    trend: 'ascending'
                  }}
                  compact
                />
              </Collapse>

              <Collapse in={expandedSections.impacto} timeout="auto">
                <RealTimeReciprocidadFlow
                  metrics={{
                    ondas: reciprocidadMetrics?.metricas.ondas || 0,
                    meritos: reciprocidadMetrics?.metricas.meritos || 0,
                    impactoPositivo: reciprocidadMetrics?.metricas.impactoPositivo || 0,
                    rangoComunidad: reciprocidadMetrics?.metricas.rangoComunidad || 0
                  }}
                  realTimeData={analytics?.realTimeData}
                  cosmicEffects={cosmicEffects}
                />
              </Collapse>
            </RevolutionaryWidgetFuego>
          </Grid>

        </Grid>

        {/* 🌟 FAB CÓSMICO DE ACCIONES RÁPIDAS - ZENO */}
        <Fade in={!analyticsLoading}>
          <Fab
            sx={{
              position: 'fixed',
              bottom: 32,
              right: 32,
              background: 'linear-gradient(135deg, #FF6B35, #FFB84D)',
              color: 'white',
              width: 64,
              height: 64,
              zIndex: 1000,
              boxShadow: '0 8px 32px rgba(255, 107, 53, 0.4)',
              '&:hover': {
                background: 'linear-gradient(135deg, #E55A2B, #E6A43F)',
                transform: 'scale(1.1)',
                boxShadow: '0 12px 48px rgba(255, 107, 53, 0.6)'
              }
            }}
            onClick={() => setCosmicIntensity(prev =>
              prev === 'subtle' ? 'medium' : prev === 'medium' ? 'intense' : 'subtle'
            )}
          >
            <AutoAwesome sx={{ fontSize: 28 }} />
          </Fab>
        </Fade>
      </Container>

      {/* 🎨 KEYFRAMES CÓSMICOS */}
      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @keyframes cosmic-drift {
            0%, 100% { transform: translate(0, 0) rotate(0deg); opacity: 0.6; }
            25% { transform: translate(20px, -15px) rotate(90deg); opacity: 0.8; }
            50% { transform: translate(-10px, 20px) rotate(180deg); opacity: 0.4; }
            75% { transform: translate(-25px, -10px) rotate(270deg); opacity: 0.7; }
          }
        `}
      </style>
    </Box>
  );
});

UStatsMain.displayName = 'UStatsMain';

export default UStatsMain;
