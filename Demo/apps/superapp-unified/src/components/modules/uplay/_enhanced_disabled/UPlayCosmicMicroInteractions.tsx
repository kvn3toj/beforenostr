/**
 * 🎨 ARIA GUARDIAN - COSMIC MICRO-INTERACTIONS & VISUAL EXCELLENCE
 *
 * Sistema supremo de micro-interacciones cósmicas para ÜPlay con:
 * - Five Elements Theming System (Fuego, Agua, Tierra, Aire, Éter)
 * - Particle Effect System con física realista
 * - Haptic Feedback Integration
 * - Cosmic-themed styled components
 * - Advanced CSS Keyframe Animations
 * - Glassmorphism Effects
 *
 * Target: Inmersión total, 60+ FPS animations, experiencia sensorial suprema
 */

import React, {
  useState,
  useCallback,
  useMemo,
  useRef,
  useEffect,
  memo,
} from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  useTheme,
  alpha,
  styled,
  keyframes,
  Tooltip,
  IconButton,
  Fab,
} from '@mui/material';
import {
  Star,
  AutoAwesome,
  Celebration,
  Diamond,
  Bolt,
  Whatshot,
  Air,
  Terrain,
  Waves,
  FlashOn,
} from '@mui/icons-material';
import { motion, AnimatePresence, useSpring, useTransform } from 'framer-motion';

// ===== 🌟 FIVE ELEMENTS COSMIC THEMING ===== //
interface FiveElementsTheme {
  fuego: {
    primary: string;
    secondary: string;
    accent: string;
    particle: string;
    glow: string;
  };
  agua: {
    primary: string;
    secondary: string;
    accent: string;
    particle: string;
    glow: string;
  };
  tierra: {
    primary: string;
    secondary: string;
    accent: string;
    particle: string;
    glow: string;
  };
  aire: {
    primary: string;
    secondary: string;
    accent: string;
    particle: string;
    glow: string;
  };
  eter: {
    primary: string;
    secondary: string;
    accent: string;
    particle: string;
    glow: string;
  };
}

const FIVE_ELEMENTS_COSMIC_THEME: FiveElementsTheme = {
  fuego: {
    primary: '#FF6B35',
    secondary: '#FFB74D',
    accent: '#FF8A65',
    particle: '#FFAB91',
    glow: 'rgba(255, 107, 53, 0.6)',
  },
  agua: {
    primary: '#2196F3',
    secondary: '#64B5F6',
    accent: '#42A5F5',
    particle: '#81C784',
    glow: 'rgba(33, 150, 243, 0.6)',
  },
  tierra: {
    primary: '#8BC34A',
    secondary: '#AED581',
    accent: '#9CCC65',
    particle: '#C5E1A5',
    glow: 'rgba(139, 195, 74, 0.6)',
  },
  aire: {
    primary: '#00BCD4',
    secondary: '#4DD0E1',
    accent: '#26C6DA',
    particle: '#80DEEA',
    glow: 'rgba(0, 188, 212, 0.6)',
  },
  eter: {
    primary: '#9C27B0',
    secondary: '#BA68C8',
    accent: '#AB47BC',
    particle: '#CE93D8',
    glow: 'rgba(156, 39, 176, 0.6)',
  },
};

type ElementType = keyof FiveElementsTheme;

// ===== ✨ COSMIC KEYFRAME ANIMATIONS ===== //
const cosmicPulse = keyframes`
  0% {
    transform: scale(1);
    box-shadow: 0 0 20px rgba(156, 39, 176, 0.3);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 0 40px rgba(156, 39, 176, 0.6);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 20px rgba(156, 39, 176, 0.3);
  }
`;

const particleFloat = keyframes`
  0% {
    transform: translateY(0px) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(-100px) rotate(360deg);
    opacity: 0;
  }
`;

const cosmicGlow = keyframes`
  0%, 100% {
    filter: brightness(1) saturate(1);
  }
  50% {
    filter: brightness(1.2) saturate(1.3);
  }
`;

// ===== 🎨 STYLED COSMIC COMPONENTS ===== //
const CosmicContainer = styled(motion.div)<{ element: ElementType }>(({ theme, element }) => ({
  position: 'relative',
  overflow: 'hidden',
  borderRadius: '20px',
  background: `linear-gradient(135deg,
    ${FIVE_ELEMENTS_COSMIC_THEME[element].primary}20,
    ${FIVE_ELEMENTS_COSMIC_THEME[element].secondary}10)`,
  backdropFilter: 'blur(20px)',
  border: `1px solid ${alpha(FIVE_ELEMENTS_COSMIC_THEME[element].accent, 0.3)}`,
  cursor: 'pointer',
  userSelect: 'none',

  '&:hover': {
    animation: `${cosmicPulse} 2s infinite`,
    transform: 'translateY(-2px)',
    background: `linear-gradient(135deg,
      ${FIVE_ELEMENTS_COSMIC_THEME[element].primary}30,
      ${FIVE_ELEMENTS_COSMIC_THEME[element].secondary}20)`,
  },

  '&:active': {
    transform: 'scale(0.98) translateY(0px)',
  },
}));

const CosmicButton = styled(Button)<{ element: ElementType }>(({ theme, element }) => ({
  background: `linear-gradient(45deg,
    ${FIVE_ELEMENTS_COSMIC_THEME[element].primary},
    ${FIVE_ELEMENTS_COSMIC_THEME[element].secondary})`,
  color: 'white',
  fontWeight: 700,
  borderRadius: '15px',
  padding: '12px 24px',
  textTransform: 'none',
  boxShadow: `0 8px 25px ${FIVE_ELEMENTS_COSMIC_THEME[element].glow}`,
  border: 'none',
  position: 'relative',
  overflow: 'hidden',

  '&:hover': {
    background: `linear-gradient(45deg,
      ${FIVE_ELEMENTS_COSMIC_THEME[element].secondary},
      ${FIVE_ELEMENTS_COSMIC_THEME[element].accent})`,
    boxShadow: `0 12px 35px ${FIVE_ELEMENTS_COSMIC_THEME[element].glow}`,
    animation: `${cosmicGlow} 1.5s infinite`,
  },

  '&:before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: `linear-gradient(90deg,
      transparent,
      rgba(255, 255, 255, 0.3),
      transparent)`,
    transition: 'left 0.5s',
  },

  '&:hover:before': {
    left: '100%',
  },
}));

const ParticleContainer = styled(Box)({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  pointerEvents: 'none',
  overflow: 'hidden',
});

const Particle = styled(motion.div)<{ element: ElementType; size: number }>(({ element, size }) => ({
  position: 'absolute',
  width: `${size}px`,
  height: `${size}px`,
  borderRadius: '50%',
  background: FIVE_ELEMENTS_COSMIC_THEME[element].particle,
  animation: `${particleFloat} 3s linear infinite`,
  filter: `drop-shadow(0 0 ${size/2}px ${FIVE_ELEMENTS_COSMIC_THEME[element].glow})`,
}));

// ===== 🌊 PARTICLE SYSTEM ===== //
interface ParticleData {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  element: ElementType;
}

const useParticleSystem = (element: ElementType, enabled: boolean = true) => {
  const [particles, setParticles] = useState<ParticleData[]>([]);
  const particleIdRef = useRef(0);

  const generateParticles = useCallback((count: number = 8) => {
    if (!enabled) return;

    const newParticles: ParticleData[] = Array.from({ length: count }, () => ({
      id: particleIdRef.current++,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 6 + 3,
      delay: Math.random() * 2,
      element,
    }));

    setParticles(prev => [...prev.slice(-10), ...newParticles]);

    // Cleanup old particles
    setTimeout(() => {
      setParticles(prev => prev.filter(p => !newParticles.includes(p)));
    }, 3000);
  }, [element, enabled]);

  return { particles, generateParticles };
};

// ===== 📱 HAPTIC FEEDBACK SYSTEM ===== //
const useHapticFeedback = () => {
  const triggerHapticFeedback = useCallback((intensity: 'light' | 'medium' | 'heavy' = 'medium') => {
    if ('vibrate' in navigator) {
      const patterns = {
        light: [50],
        medium: [100],
        heavy: [200],
      };
      navigator.vibrate(patterns[intensity]);
    }
  }, []);

  return { triggerHapticFeedback };
};

// ===== 🎯 COSMIC MICRO-INTERACTION COMPONENTS ===== //
interface CosmicInteractionButtonProps {
  element: ElementType;
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  enableParticles?: boolean;
  enableHaptic?: boolean;
  tooltip?: string;
}

export const CosmicInteractionButton: React.FC<CosmicInteractionButtonProps> = memo(({
  element,
  children,
  onClick,
  disabled = false,
  enableParticles = true,
  enableHaptic = true,
  tooltip,
}) => {
  const { particles, generateParticles } = useParticleSystem(element, enableParticles);
  const { triggerHapticFeedback } = useHapticFeedback();
  const [isPressed, setIsPressed] = useState(false);

  const handleInteraction = useCallback(() => {
    if (disabled) return;

    // Generate particle burst
    generateParticles(12);

    // Trigger haptic feedback
    if (enableHaptic) {
      triggerHapticFeedback('medium');
    }

    // Call user onClick
    onClick?.();
  }, [disabled, generateParticles, enableHaptic, triggerHapticFeedback, onClick]);

  const handlePress = useCallback(() => {
    setIsPressed(true);
    if (enableHaptic) {
      triggerHapticFeedback('light');
    }
  }, [enableHaptic, triggerHapticFeedback]);

  const handleRelease = useCallback(() => {
    setIsPressed(false);
  }, []);

  const buttonContent = (
    <CosmicContainer
      element={element}
      onMouseDown={handlePress}
      onMouseUp={handleRelease}
      onMouseLeave={handleRelease}
      onClick={handleInteraction}
      whileHover={{ scale: 1.05, rotateY: 5 }}
      whileTap={{ scale: 0.95 }}
      animate={{
        scale: isPressed ? 0.98 : 1,
        rotateX: isPressed ? 2 : 0,
      }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      style={{
        position: 'relative',
        padding: '16px 24px',
        opacity: disabled ? 0.6 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
      }}
    >
      {/* Particle System */}
      {enableParticles && (
        <ParticleContainer>
          <AnimatePresence>
            {particles.map(particle => (
              <Particle
                key={particle.id}
                element={particle.element}
                size={particle.size}
                initial={{
                  x: `${particle.x}%`,
                  y: `${particle.y}%`,
                  scale: 0,
                  opacity: 0,
                }}
                animate={{
                  y: `${particle.y - 100}%`,
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0],
                  rotate: 360,
                }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 3,
                  delay: particle.delay,
                  ease: "easeOut",
                }}
              />
            ))}
          </AnimatePresence>
        </ParticleContainer>
      )}

      {/* Content */}
      <Box sx={{
        position: 'relative',
        zIndex: 1,
        display: 'flex',
        alignItems: 'center',
        gap: 1,
      }}>
        {children}
      </Box>

      {/* Cosmic Glow Effect */}
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '150%',
          height: '150%',
          background: `radial-gradient(circle, ${FIVE_ELEMENTS_COSMIC_THEME[element].glow} 0%, transparent 70%)`,
          opacity: isPressed ? 0.8 : 0.3,
          transition: 'opacity 0.3s',
          borderRadius: '50%',
          filter: 'blur(20px)',
          zIndex: 0,
        }}
      />
    </CosmicContainer>
  );

  if (tooltip) {
    return (
      <Tooltip title={tooltip} arrow placement="top">
        {buttonContent}
      </Tooltip>
    );
  }

  return buttonContent;
});

CosmicInteractionButton.displayName = 'CosmicInteractionButton';

// ===== 🏆 ACHIEVEMENT COSMIC CARD ===== //
interface CosmicAchievementCardProps {
  element: ElementType;
  title: string;
  description: string;
  icon: React.ReactNode;
  unlocked?: boolean;
  progress?: number;
  onClick?: () => void;
}

export const CosmicAchievementCard: React.FC<CosmicAchievementCardProps> = memo(({
  element,
  title,
  description,
  icon,
  unlocked = false,
  progress = 0,
  onClick,
}) => {
  const { particles, generateParticles } = useParticleSystem(element, unlocked);
  const { triggerHapticFeedback } = useHapticFeedback();

  const handleClick = useCallback(() => {
    if (unlocked) {
      generateParticles(20);
      triggerHapticFeedback('heavy');
      onClick?.();
    }
  }, [unlocked, generateParticles, triggerHapticFeedback, onClick]);

  return (
    <motion.div
      whileHover={unlocked ? { scale: 1.03, rotateY: 5 } : {}}
      whileTap={unlocked ? { scale: 0.98 } : {}}
      onClick={handleClick}
    >
      <Card
        sx={{
          position: 'relative',
          background: unlocked
            ? `linear-gradient(135deg,
                ${FIVE_ELEMENTS_COSMIC_THEME[element].primary}20,
                ${FIVE_ELEMENTS_COSMIC_THEME[element].secondary}10)`
            : 'rgba(128, 128, 128, 0.1)',
          backdropFilter: 'blur(20px)',
          border: `2px solid ${unlocked
            ? FIVE_ELEMENTS_COSMIC_THEME[element].accent
            : 'rgba(128, 128, 128, 0.3)'}`,
          borderRadius: '16px',
          overflow: 'hidden',
          cursor: unlocked ? 'pointer' : 'default',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',

          '&:hover': unlocked ? {
            boxShadow: `0 20px 40px ${FIVE_ELEMENTS_COSMIC_THEME[element].glow}`,
          } : {},
        }}
      >
        {/* Particle System */}
        {unlocked && (
          <ParticleContainer>
            <AnimatePresence>
              {particles.map(particle => (
                <Particle
                  key={particle.id}
                  element={particle.element}
                  size={particle.size}
                  initial={{
                    x: `${particle.x}%`,
                    y: `${particle.y}%`,
                    scale: 0,
                  }}
                  animate={{
                    y: `${particle.y - 150}%`,
                    scale: [0, 1, 0],
                    rotate: 360,
                  }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: 4,
                    delay: particle.delay,
                    ease: "easeOut",
                  }}
                />
              ))}
            </AnimatePresence>
          </ParticleContainer>
        )}

        <CardContent sx={{ p: 3, position: 'relative', zIndex: 1 }}>
          {/* Icon */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              mb: 2,
              '& > *': {
                fontSize: '3rem',
                color: unlocked
                  ? FIVE_ELEMENTS_COSMIC_THEME[element].primary
                  : 'rgba(128, 128, 128, 0.6)',
                filter: unlocked
                  ? `drop-shadow(0 0 10px ${FIVE_ELEMENTS_COSMIC_THEME[element].glow})`
                  : 'none',
              },
            }}
          >
            {icon}
          </Box>

          {/* Title */}
          <Typography
            variant="h6"
            align="center"
            sx={{
              fontWeight: 700,
              color: unlocked ? 'text.primary' : 'text.disabled',
              mb: 1,
            }}
          >
            {title}
          </Typography>

          {/* Description */}
          <Typography
            variant="body2"
            align="center"
            sx={{
              color: unlocked ? 'text.secondary' : 'text.disabled',
              mb: 2,
            }}
          >
            {description}
          </Typography>

          {/* Progress Bar */}
          {!unlocked && progress > 0 && (
            <Box sx={{ mb: 2 }}>
              <Box
                sx={{
                  width: '100%',
                  height: '6px',
                  backgroundColor: 'rgba(128, 128, 128, 0.2)',
                  borderRadius: '3px',
                  overflow: 'hidden',
                }}
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  style={{
                    height: '100%',
                    background: `linear-gradient(90deg,
                      ${FIVE_ELEMENTS_COSMIC_THEME[element].primary},
                      ${FIVE_ELEMENTS_COSMIC_THEME[element].secondary})`,
                  }}
                />
              </Box>
              <Typography
                variant="caption"
                sx={{
                  display: 'block',
                  textAlign: 'center',
                  mt: 0.5,
                  color: 'text.secondary',
                }}
              >
                {Math.round(progress)}% complete
              </Typography>
            </Box>
          )}

          {/* Status Badge */}
          {unlocked && (
            <Box
              sx={{
                position: 'absolute',
                top: 16,
                right: 16,
                background: FIVE_ELEMENTS_COSMIC_THEME[element].primary,
                color: 'white',
                borderRadius: '50%',
                width: 32,
                height: 32,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `0 0 20px ${FIVE_ELEMENTS_COSMIC_THEME[element].glow}`,
              }}
            >
              <Star sx={{ fontSize: '1rem' }} />
            </Box>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
});

CosmicAchievementCard.displayName = 'CosmicAchievementCard';

// ===== 📊 ELEMENT ICONS MAPPING ===== //
export const ELEMENT_ICONS = {
  fuego: <Whatshot />,
  agua: <Waves />,
  tierra: <Terrain />,
  aire: <Air />,
  eter: <AutoAwesome />,
};

// ===== 🎨 DEMO COMPONENT ===== //
export const CosmicMicroInteractionsDemo: React.FC = () => {
  const [selectedElement, setSelectedElement] = useState<ElementType>('eter');
  const [interactionCount, setInteractionCount] = useState(0);

  const elements: { key: ElementType; label: string; description: string }[] = [
    { key: 'fuego', label: 'Fuego', description: 'Acción y energía transformadora' },
    { key: 'agua', label: 'Agua', description: 'Fluidez y adaptabilidad' },
    { key: 'tierra', label: 'Tierra', description: 'Estabilidad y fundamentos' },
    { key: 'aire', label: 'Aire', description: 'Comunicación y visión' },
    { key: 'eter', label: 'Éter', description: 'Sabiduría cósmica suprema' },
  ];

  return (
    <Box sx={{ p: 4, maxWidth: '1200px', mx: 'auto' }}>
      <Typography variant="h3" align="center" gutterBottom>
        🌌 Cosmic Micro-Interactions Demo
      </Typography>

      <Typography variant="h6" align="center" color="textSecondary" sx={{ mb: 4 }}>
        ARIA Guardian's Five Elements System
      </Typography>

      {/* Element Selector */}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 4, flexWrap: 'wrap' }}>
        {elements.map((element) => (
          <CosmicInteractionButton
            key={element.key}
            element={element.key}
            onClick={() => setSelectedElement(element.key)}
            tooltip={element.description}
            enableParticles={selectedElement === element.key}
          >
            {ELEMENT_ICONS[element.key]}
            <Typography variant="button" sx={{ ml: 1 }}>
              {element.label}
            </Typography>
          </CosmicInteractionButton>
        ))}
      </Box>

      {/* Demo Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 4, flexWrap: 'wrap' }}>
        <CosmicInteractionButton
          element={selectedElement}
          onClick={() => setInteractionCount(prev => prev + 1)}
          tooltip="Incrementar contador con efectos cósmicos"
        >
          <Diamond />
          <Typography variant="button">
            Interacciones: {interactionCount}
          </Typography>
        </CosmicInteractionButton>
      </Box>

      {/* Achievement Cards Demo */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 3 }}>
        {elements.map((element, index) => (
          <CosmicAchievementCard
            key={element.key}
            element={element.key}
            title={`Maestro del ${element.label}`}
            description={element.description}
            icon={ELEMENT_ICONS[element.key]}
            unlocked={index <= 2}
            progress={index === 3 ? 75 : index === 4 ? 25 : 0}
            onClick={() => console.log(`Achievement clicked: ${element.label}`)}
          />
        ))}
      </Box>
    </Box>
  );
};

// ===== 🚀 EXPORTS ===== //
export {
  FIVE_ELEMENTS_COSMIC_THEME,
  useParticleSystem,
  useHapticFeedback,
};

export default CosmicMicroInteractionsDemo;
