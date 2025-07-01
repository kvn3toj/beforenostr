import React, { useMemo, useEffect, useState } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Chip,
  Tooltip,
  useTheme,
  alpha,
  keyframes,
} from '@mui/material';
import {
  Psychology,
  AutoAwesome,
  Diamond,
  AllInclusive,
  FlashOn,
  Star,
  EmojiEvents,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

// 🌌 COSMIC DESIGN SYSTEM - ARIA
import { UNIFIED_COLORS } from '../../../../theme/colors';

// 🌟 Animaciones Conscientes - ARIA (Frontend Artist)
const consciousGlow = keyframes`
  0%, 100% {
    box-shadow: 0 0 30px rgba(255, 107, 53, 0.4);
    transform: scale(1);
  }
  50% {
    box-shadow: 0 0 50px rgba(255, 107, 53, 0.8);
    transform: scale(1.05);
  }
`;

const orbitAnimation = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const metanoiaWave = keyframes`
  0%, 100% { opacity: 0.6; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.1); }
`;

interface ConsciousProgressOrbProps {
  currentLevel: string;
  nextLevel: string;
  progress: number; // 0-100
  meritos: number;
  compact?: boolean;
  showMetrics?: boolean;
  className?: string;
  'data-testid'?: string;
}

/**
 * 🌟 CONSCIOUS PROGRESS ORB - ARIA (Frontend Artist)
 * ================================================
 * 
 * Componente visual que representa el progreso del usuario en su viaje
 * hacia la consciencia y transformación personal (Metanöia).
 * 
 * Filosofía Cósmica:
 * - Visualiza el crecimiento consciente como un orbe luminoso
 * - Cada nivel representa un estado de consciencia más elevado
 * - Los méritos son la energía que alimenta la transformación
 * - El progreso no es lineal, sino espiral ascendente
 */
export const ConsciousProgressOrb: React.FC<ConsciousProgressOrbProps> = ({
  currentLevel,
  nextLevel,
  progress = 0,
  meritos = 0,
  compact = false,
  showMetrics = true,
  className = '',
  'data-testid': testId = 'conscious-progress-orb'
}) => {
  const theme = useTheme();
  const [isGlowing, setIsGlowing] = useState(false);
  const [orbIntensity, setOrbIntensity] = useState<'subtle' | 'medium' | 'intense'>('medium');

  // 🧠 NIRA - Cálculos de métricas conscientes
  const orbMetrics = useMemo(() => {
    // Determinar el color y la intensidad basado en el progreso
    const progressColor = progress >= 80 
      ? UNIFIED_COLORS.success.main 
      : progress >= 50 
        ? UNIFIED_COLORS.warning.main 
        : UNIFIED_COLORS.primary.main;

    // Determinar el ícono según el nivel actual
    const levelIcon = currentLevel.toLowerCase().includes('guardián') 
      ? <Diamond />
      : currentLevel.toLowerCase().includes('colaborador')
        ? <Psychology />
        : currentLevel.toLowerCase().includes('maestro')
          ? <EmojiEvents />
          : <AutoAwesome />;

    // Calcular el nivel de luminosidad
    const glowIntensity = Math.min(100, (progress / 100) * 150 + (meritos / 1000) * 50);

    return {
      progressColor,
      levelIcon,
      glowIntensity,
      orbSize: compact ? 120 : 180,
      showOrbitalRings: !compact && progress > 25,
      cosmicResonance: Math.round((progress * 0.7 + meritos * 0.0003) * 100) / 100
    };
  }, [progress, meritos, currentLevel, compact]);

  // 🎨 ARIA - Efectos visuales dinámicos
  useEffect(() => {
    const interval = setInterval(() => {
      setIsGlowing(prev => !prev);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // 🌟 ZENO - Interacción intuitiva
  const handleOrbClick = () => {
    setOrbIntensity(prev => 
      prev === 'subtle' ? 'medium' : 
      prev === 'medium' ? 'intense' : 'subtle'
    );
  };

  return (
    <Box
      data-testid={testId}
      className={`conscious-progress-orb ${className}`}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        minHeight: compact ? 140 : 220,
        cursor: 'pointer',
        userSelect: 'none',
      }}
      onClick={handleOrbClick}
    >
      {/* 🌌 ORBITALES CÓSMICOS - ARIA */}
      <AnimatePresence>
        {orbMetrics.showOrbitalRings && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.8 }}
          >
            {[1, 2, 3].map((ring) => (
              <Box
                key={ring}
                sx={{
                  position: 'absolute',
                  width: orbMetrics.orbSize + ring * 30,
                  height: orbMetrics.orbSize + ring * 30,
                  border: `1px solid ${alpha(orbMetrics.progressColor, 0.2 / ring)}`,
                  borderRadius: '50%',
                  animation: `${orbitAnimation} ${8 + ring * 2}s linear infinite`,
                  zIndex: 1,
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🔮 NÚCLEO DEL ORBE CONSCIENTE - ARIA */}
      <Box
        sx={{
          position: 'relative',
          width: orbMetrics.orbSize,
          height: orbMetrics.orbSize,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: `
            radial-gradient(
              circle at 30% 30%, 
              ${alpha(orbMetrics.progressColor, 0.8)} 0%, 
              ${alpha(orbMetrics.progressColor, 0.4)} 50%,
              transparent 100%
            )
          `,
          border: `3px solid ${alpha(orbMetrics.progressColor, 0.6)}`,
          boxShadow: `
            0 0 ${orbMetrics.glowIntensity}px ${alpha(orbMetrics.progressColor, 0.6)},
            inset 0 0 30px ${alpha(orbMetrics.progressColor, 0.2)}
          `,
          animation: isGlowing && orbIntensity !== 'subtle' 
            ? `${consciousGlow} 2s ease-in-out infinite` 
            : 'none',
          zIndex: 10,
          transition: 'all 0.5s ease-in-out',
          '&:hover': {
            transform: 'scale(1.1)',
            boxShadow: `
              0 0 ${orbMetrics.glowIntensity * 1.5}px ${alpha(orbMetrics.progressColor, 0.8)},
              inset 0 0 40px ${alpha(orbMetrics.progressColor, 0.3)}
            `,
          }
        }}
      >
        {/* 🎯 PROGRESS CIRCULAR - SAGE */}
        <CircularProgress
          variant="determinate"
          value={progress}
          size={orbMetrics.orbSize - 10}
          thickness={compact ? 3 : 4}
          sx={{
            position: 'absolute',
            color: orbMetrics.progressColor,
            '& .MuiCircularProgress-circle': {
              strokeLinecap: 'round',
              filter: `drop-shadow(0 0 8px ${alpha(orbMetrics.progressColor, 0.6)})`,
            }
          }}
        />

        {/* 🌟 ÍCONO CENTRAL - ARIA */}
        <motion.div
          animate={{ 
            rotate: [0, 360],
            scale: orbIntensity === 'intense' ? [1, 1.2, 1] : [1, 1.05, 1]
          }}
          transition={{ 
            duration: orbIntensity === 'intense' ? 4 : 6, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        >
          <Box
            sx={{
              color: orbMetrics.progressColor,
              fontSize: compact ? 24 : 32,
              filter: `drop-shadow(0 0 8px ${alpha(orbMetrics.progressColor, 0.8)})`,
              animation: `${metanoiaWave} 3s ease-in-out infinite`,
            }}
          >
            {orbMetrics.levelIcon}
          </Box>
        </motion.div>

        {/* 💫 PARTÍCULAS FLOTANTES - PHOENIX */}
        {orbIntensity === 'intense' && (
          <Box sx={{ position: 'absolute', inset: 0, borderRadius: '50%', overflow: 'hidden' }}>
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                style={{
                  position: 'absolute',
                  width: 3,
                  height: 3,
                  backgroundColor: orbMetrics.progressColor,
                  borderRadius: '50%',
                  left: '50%',
                  top: '50%',
                }}
                animate={{
                  x: Math.cos(i * 45 * Math.PI / 180) * 40,
                  y: Math.sin(i * 45 * Math.PI / 180) * 40,
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.25,
                  ease: "easeInOut"
                }}
              />
            ))}
          </Box>
        )}
      </Box>

      {/* 📊 MÉTRICAS CONSCIENTES - NIRA */}
      {showMetrics && (
        <Box sx={{ mt: 2, textAlign: 'center', minHeight: 60 }}>
          {/* Nivel Actual */}
          <Tooltip title={`Progreso hacia ${nextLevel}: ${progress}%`}>
            <Typography
              variant={compact ? "caption" : "subtitle2"}
              sx={{
                color: orbMetrics.progressColor,
                fontWeight: 600,
                mb: 0.5,
                textShadow: `0 0 10px ${alpha(orbMetrics.progressColor, 0.5)}`,
              }}
            >
              {currentLevel}
            </Typography>
          </Tooltip>

          {/* Progreso */}
          <Typography
            variant={compact ? "caption" : "body2"}
            sx={{ 
              color: theme.palette.text.secondary,
              mb: 1,
              fontSize: compact ? '0.7rem' : '0.875rem'
            }}
          >
            {progress}% hacia {nextLevel}
          </Typography>

          {/* Chips de métricas */}
          {!compact && (
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Chip
                icon={<FlashOn />}
                label={`${meritos} Méritos`}
                size="small"
                sx={{
                  backgroundColor: alpha(orbMetrics.progressColor, 0.1),
                  color: orbMetrics.progressColor,
                  border: `1px solid ${alpha(orbMetrics.progressColor, 0.3)}`,
                }}
              />
              
              {orbMetrics.cosmicResonance > 0 && (
                <Chip
                  icon={<AllInclusive />}
                  label={`${orbMetrics.cosmicResonance}% Resonancia`}
                  size="small"
                  sx={{
                    backgroundColor: alpha(UNIFIED_COLORS.info.main, 0.1),
                    color: UNIFIED_COLORS.info.main,
                    border: `1px solid ${alpha(UNIFIED_COLORS.info.main, 0.3)}`,
                  }}
                />
              )}
            </Box>
          )}
        </Box>
      )}

      {/* 🎨 CSS para las animaciones */}
      <style>
        {`
          @keyframes cosmic-particle-drift {
            0%, 100% { 
              transform: translate(0, 0) rotate(0deg); 
              opacity: 0.6; 
            }
            25% { 
              transform: translate(15px, -10px) rotate(90deg); 
              opacity: 1; 
            }
            50% { 
              transform: translate(-8px, 15px) rotate(180deg); 
              opacity: 0.4; 
            }
            75% { 
              transform: translate(-20px, -8px) rotate(270deg); 
              opacity: 0.8; 
            }
          }
        `}
      </style>
    </Box>
  );
};

export default ConsciousProgressOrb;