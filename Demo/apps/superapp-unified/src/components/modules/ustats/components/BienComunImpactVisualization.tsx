import React, { useMemo, useState, useEffect } from 'react';
import {
  Box,
  Typography,
  LinearProgress,
  Chip,
  Stack,
  Tooltip,
  useTheme,
  alpha,
  keyframes,
} from '@mui/material';
import {
  Public,
  Groups,
  Favorite,
  TrendingUp,
  Eco,
  AutoAwesome,
  Diamond,
  Waves,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

// 🌌 COSMIC DESIGN SYSTEM
import { UNIFIED_COLORS } from '../../../../theme/colors';

// 🌍 Animaciones del Bien Común
const bienComunPulse = keyframes`
  0%, 100% {
    box-shadow: 0 0 20px rgba(76, 175, 80, 0.4);
    transform: scale(1);
  }
  50% {
    box-shadow: 0 0 40px rgba(76, 175, 80, 0.8);
    transform: scale(1.05);
  }
`;

const impactWave = keyframes`
  0% { transform: translateX(-100%) scaleX(0); opacity: 0; }
  50% { transform: translateX(-50%) scaleX(1); opacity: 1; }
  100% { transform: translateX(0%) scaleX(0); opacity: 0; }
`;

const resonanceGlow = keyframes`
  0%, 100% { opacity: 0.6; filter: brightness(1); }
  50% { opacity: 1; filter: brightness(1.3); }
`;

interface BienComunImpactVisualizationProps {
  impact: number; // 0-100 puntos de impacto
  communityResonance: number; // 0-100 nivel de resonancia
  contributions: number; // número de contribuciones
  compact?: boolean;
  showMetrics?: boolean;
  className?: string;
  'data-testid'?: string;
}

interface ImpactLevel {
  name: string;
  threshold: number;
  color: string;
  icon: React.ReactElement;
  description: string;
  benefits: string[];
}

/**
 * 🌍 BIEN COMÚN IMPACT VISUALIZATION - NIRA (Pattern Visionary)
 * =============================================================
 *
 * Visualización del impacto consciente al Bien Común
 * Mide y celebra las contribuciones al bienestar colectivo
 *
 * Filosofía CoomÜnity:
 * - Bien Común > bien particular
 * - Cada acción genera ondas de transformación
 * - El impacto se mide no solo en cantidad, sino en calidad
 * - La resonancia comunitaria amplifica el efecto positivo
 */
export const BienComunImpactVisualization: React.FC<BienComunImpactVisualizationProps> = ({
  impact,
  communityResonance,
  contributions,
  compact = false,
  showMetrics = true,
  className = '',
  'data-testid': testId = 'bien-comun-impact-visualization'
}) => {
  const theme = useTheme();
  const [isAnimating, setIsAnimating] = useState(false);
  const [showRipples, setShowRipples] = useState(false);

  // 🧠 NIRA - Niveles de impacto al Bien Común
  const impactLevels: ImpactLevel[] = useMemo(() => [
    {
      name: 'Semilla Consciente',
      threshold: 0,
      color: '#FFC107',
      icon: <Eco />,
      description: 'Iniciando el viaje de contribución',
      benefits: ['Consciencia del impacto', 'Primeros pasos']
    },
    {
      name: 'Colaborador Activo',
      threshold: 25,
      color: '#2196F3',
      icon: <Groups />,
      description: 'Participando activamente en la comunidad',
      benefits: ['Reconocimiento comunitario', 'Redes de colaboración']
    },
    {
      name: 'Impulsor del Cambio',
      threshold: 50,
      color: '#FF9800',
      icon: <TrendingUp />,
      description: 'Generando transformaciones medibles',
      benefits: ['Liderazgo comunitario', 'Impacto amplificado']
    },
    {
      name: 'Guardián del Bien',
      threshold: 75,
      color: '#4CAF50',
      icon: <Favorite />,
      description: 'Dedicado al bienestar colectivo',
      benefits: ['Mentoría de otros', 'Impacto sistémico']
    },
    {
      name: 'Agente Cósmico',
      threshold: 90,
      color: '#9C27B0',
      icon: <Diamond />,
      description: 'Transformador global consciente',
      benefits: ['Impacto planetario', 'Inspiración universal']
    }
  ], []);

  // 🎯 ZENO - Determinar nivel actual
  const currentLevel = useMemo(() => {
    const level = impactLevels
      .slice()
      .reverse()
      .find(level => impact >= level.threshold);
    return level || impactLevels[0];
  }, [impact, impactLevels]);

  // 🌊 NIRA - Cálculo de métricas conscientes
  const impactMetrics = useMemo(() => {
    const resonanceMultiplier = communityResonance / 100;
    const amplifiedImpact = impact * (1 + resonanceMultiplier * 0.5);

    // Calcular ondas de transformación (basado en contribuciones y resonancia)
    const transformationWaves = Math.min(10, Math.floor(contributions / 5) + Math.floor(communityResonance / 20));

    // Índice de sostenibilidad (qué tan duradero es el impacto)
    const sustainabilityIndex = Math.min(100, (impact * 0.7) + (communityResonance * 0.3));

    return {
      amplifiedImpact: Math.round(amplifiedImpact),
      transformationWaves,
      sustainabilityIndex: Math.round(sustainabilityIndex),
      nextLevelProgress: impact >= 90 ? 100 : ((impact % 25) / 25) * 100,
      resonanceClass: communityResonance >= 80 ? 'cósmica' :
                     communityResonance >= 60 ? 'elevada' :
                     communityResonance >= 40 ? 'media' : 'emergente'
    };
  }, [impact, communityResonance, contributions]);

  // 🎨 ARIA - Efectos visuales dinámicos
  useEffect(() => {
    const animationInterval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 2000);
    }, 5000);

    return () => clearInterval(animationInterval);
  }, []);

  useEffect(() => {
    if (impactMetrics.transformationWaves > 3) {
      setShowRipples(true);
      const rippleTimeout = setTimeout(() => setShowRipples(false), 3000);
      return () => clearTimeout(rippleTimeout);
    }
  }, [impactMetrics.transformationWaves]);

  return (
    <Box
      data-testid={testId}
      className={`bien-comun-impact ${className}`}
      sx={{
        position: 'relative',
        width: '100%',
        minHeight: compact ? 140 : 180,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: compact ? 1 : 2,
        overflow: 'hidden',
      }}
    >
      {/* 🌍 Núcleo Central del Impacto */}
      <Box
        sx={{
          position: 'relative',
          width: compact ? 80 : 120,
          height: compact ? 80 : 120,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: `
            radial-gradient(
              circle at center,
              ${alpha(currentLevel.color, 0.8)} 0%,
              ${alpha(currentLevel.color, 0.4)} 50%,
              transparent 100%
            )
          `,
          border: `3px solid ${currentLevel.color}`,
          animation: isAnimating ? `${bienComunPulse} 2s ease-in-out` : 'none',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'scale(1.1)',
            boxShadow: `0 0 30px ${alpha(currentLevel.color, 0.6)}`,
          }
        }}
        onClick={() => setIsAnimating(true)}
      >
        {/* 🌟 Ícono Central */}
        <motion.div
          animate={{
            rotate: [0, 360],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Box
            sx={{
              color: currentLevel.color,
              fontSize: compact ? 28 : 40,
              filter: `drop-shadow(0 0 8px ${alpha(currentLevel.color, 0.8)})`,
              animation: `${resonanceGlow} 3s ease-in-out infinite`,
            }}
          >
            {currentLevel.icon}
          </Box>
        </motion.div>

        {/* 💫 Ondas de Transformación */}
        <AnimatePresence>
          {showRipples && (
            <>
              {[...Array(impactMetrics.transformationWaves)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, opacity: 0.8 }}
                  animate={{ scale: 3, opacity: 0 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{
                    duration: 2,
                    delay: i * 0.3,
                    ease: "easeOut"
                  }}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    border: `2px solid ${currentLevel.color}`,
                    borderRadius: '50%',
                    pointerEvents: 'none',
                  }}
                />
              ))}
            </>
          )}
        </AnimatePresence>

        {/* 🌊 Indicador de Impacto */}
        <Box
          sx={{
            position: 'absolute',
            bottom: -5,
            left: '50%',
            transform: 'translateX(-50%)',
            minWidth: 60,
            textAlign: 'center',
          }}
        >
          <Typography
            variant={compact ? "caption" : "body2"}
            sx={{
              color: currentLevel.color,
              fontWeight: 700,
              fontSize: compact ? '0.9rem' : '1.1rem',
              textShadow: `0 0 8px ${alpha(currentLevel.color, 0.6)}`,
            }}
          >
            {impact}
          </Typography>
        </Box>
      </Box>

      {/* 📊 Información del Nivel */}
      {showMetrics && (
        <Box sx={{ textAlign: 'center', minHeight: compact ? 40 : 60 }}>
          <Tooltip title={currentLevel.description}>
            <Typography
              variant={compact ? "caption" : "subtitle2"}
              sx={{
                color: currentLevel.color,
                fontWeight: 600,
                mb: 0.5,
                cursor: 'help',
              }}
            >
              {currentLevel.name}
            </Typography>
          </Tooltip>

          {!compact && (
            <Stack direction="row" spacing={1} justifyContent="center" flexWrap="wrap">
              <Chip
                icon={<Waves />}
                label={`${impactMetrics.transformationWaves} Ondas`}
                size="small"
                sx={{
                  backgroundColor: alpha(currentLevel.color, 0.1),
                  color: currentLevel.color,
                  border: `1px solid ${alpha(currentLevel.color, 0.3)}`,
                }}
              />

              <Chip
                icon={<Public />}
                label={`${communityResonance}% Resonancia`}
                size="small"
                sx={{
                  backgroundColor: alpha(UNIFIED_COLORS.info.main, 0.1),
                  color: UNIFIED_COLORS.info.main,
                  border: `1px solid ${alpha(UNIFIED_COLORS.info.main, 0.3)}`,
                }}
              />
            </Stack>
          )}
        </Box>
      )}

      {/* 📈 Barra de Progreso hacia el Siguiente Nivel */}
      {!compact && impact < 90 && (
        <Box sx={{ width: '80%', mt: 1 }}>
          <Typography variant="caption" color="text.secondary" display="block" mb={0.5}>
            Progreso hacia el siguiente nivel
          </Typography>
          <LinearProgress
            variant="determinate"
            value={impactMetrics.nextLevelProgress}
            sx={{
              height: 4,
              borderRadius: 2,
              backgroundColor: alpha(currentLevel.color, 0.2),
              '& .MuiLinearProgress-bar': {
                backgroundColor: currentLevel.color,
                animation: `${impactWave} 3s ease-in-out infinite`,
              }
            }}
          />
        </Box>
      )}

      {/* 🎨 CSS Adicional para efectos especiales */}
      <style>
        {`
          @keyframes cosmic-orbit {
            0% { transform: rotate(0deg) translateX(40px) rotate(0deg); }
            100% { transform: rotate(360deg) translateX(40px) rotate(-360deg); }
          }

          .bien-comun-impact:hover .cosmic-orbit {
            animation: cosmic-orbit 4s linear infinite;
          }
        `}
      </style>
    </Box>
  );
};

export default BienComunImpactVisualization;
