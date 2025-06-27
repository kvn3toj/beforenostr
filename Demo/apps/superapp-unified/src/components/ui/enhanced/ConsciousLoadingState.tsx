import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  useTheme,
  alpha,
  Paper,
  Stack,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import {
  WaterDrop,
  AutoAwesome,
  Psychology,
  Balance,
  Favorite,
  EmojiNature,
} from '@mui/icons-material';

// 🌟 Guardian Collaboration: Conscious Loading State
// Aria (UX/UI) + Kira (Terminology) + ANA (Philosophy) + Zeno (Architecture)

interface ConsciousLoadingStateProps {
  isLoading?: boolean;
  phase?: 'entering' | 'processing' | 'manifesting' | 'complete';
  message?: string;
  showPhilosophy?: boolean;
  variant?: 'fullscreen' | 'inline' | 'modal';
  size?: 'small' | 'medium' | 'large';
}

// 🎨 Kira: CoomÜnity Philosophical Messages
const CONSCIOUS_MESSAGES = {
  entering: [
    'Iniciando conexión consciente...',
    'Abriendo canales de Ayni...',
    'Conectando con el Bien Común...',
    'Activando principios de reciprocidad...',
  ],
  processing: [
    'Procesando con consciencia...',
    'Aplicando principios de Ayni...',
    'Cultivando el Bien Común...',
    'Equilibrando energías...',
  ],
  manifesting: [
    'Manifestando la abundancia...',
    'Materializando el Bien Común...',
    'Creando valor compartido...',
    'Floreciendo en comunidad...',
  ],
  complete: [
    '¡Proceso completado con consciencia!',
    '¡Ayni manifestado exitosamente!',
    '¡Bien Común fortalecido!',
    '¡Reciprocidad activada!',
  ],
};

// 🌱 ANA: Consciousness Phase Icons
const PHASE_ICONS = {
  entering: WaterDrop,
  processing: Psychology,
  manifesting: AutoAwesome,
  complete: Balance,
};

// 🎨 Aria: Phase Color Themes
const PHASE_THEMES = {
  entering: {
    primary: '#2196f3',
    secondary: '#81d4fa',
    glow: '#e3f2fd',
  },
  processing: {
    primary: '#ff9800',
    secondary: '#ffcc02',
    glow: '#fff3e0',
  },
  manifesting: {
    primary: '#9c27b0',
    secondary: '#ce93d8',
    glow: '#f3e5f5',
  },
  complete: {
    primary: '#4caf50',
    secondary: '#81c784',
    glow: '#e8f5e8',
  },
};

export const ConsciousLoadingState: React.FC<ConsciousLoadingStateProps> = ({
  isLoading = true,
  phase = 'entering',
  message,
  showPhilosophy = true,
  variant = 'inline',
  size = 'medium',
}) => {
  const theme = useTheme();
  const [currentMessage, setCurrentMessage] = useState('');
  const [philosophyIndex, setPhilosophyIndex] = useState(0);

  const phaseTheme = PHASE_THEMES[phase];
  const PhaseIcon = PHASE_ICONS[phase];

  // 🌊 Dynamic message cycling
  useEffect(() => {
    if (message) {
      setCurrentMessage(message);
      return;
    }

    const messages = CONSCIOUS_MESSAGES[phase];
    setCurrentMessage(messages[0]);

    const interval = setInterval(() => {
      setPhilosophyIndex((prev) => (prev + 1) % messages.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [message, phase]);

  useEffect(() => {
    if (!message) {
      const messages = CONSCIOUS_MESSAGES[phase];
      setCurrentMessage(messages[philosophyIndex]);
    }
  }, [philosophyIndex, phase, message]);

  // 🎭 Size configurations
  const sizeConfig = {
    small: {
      container: { width: 200, height: 120 },
      progress: 40,
      iconSize: 24,
      titleVariant: 'body1' as const,
      messageVariant: 'caption' as const,
    },
    medium: {
      container: { width: 300, height: 180 },
      progress: 60,
      iconSize: 32,
      titleVariant: 'h6' as const,
      messageVariant: 'body2' as const,
    },
    large: {
      container: { width: 400, height: 240 },
      progress: 80,
      iconSize: 40,
      titleVariant: 'h5' as const,
      messageVariant: 'body1' as const,
    },
  };

  const config = sizeConfig[size];

  // 🎨 Consciousness Animation Variants
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
        staggerChildren: 0.2,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: { duration: 0.4 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  const pulseVariants = {
    pulse: {
      scale: [1, 1.1, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  const consciousContent = (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <Paper
        elevation={variant === 'fullscreen' ? 0 : 8}
        sx={{
          ...config.container,
          borderRadius: 4,
          background: `linear-gradient(135deg,
            ${alpha(phaseTheme.primary, 0.1)} 0%,
            ${alpha(phaseTheme.secondary, 0.05)} 100%)`,
          border: `2px solid ${alpha(phaseTheme.primary, 0.2)}`,
          backdropFilter: 'blur(10px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          p: 3,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* 🌟 Cosmic Background Effect */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `radial-gradient(circle at 50% 50%,
              ${alpha(phaseTheme.glow, 0.3)} 0%,
              transparent 70%)`,
            zIndex: 0,
          }}
        />

        {/* 🎯 Main Content */}
        <Stack spacing={2} alignItems="center" sx={{ zIndex: 1 }}>
          {/* 🔄 Conscious Progress Indicator */}
          <motion.div variants={itemVariants}>
            <Box sx={{ position: 'relative', display: 'inline-flex' }}>
              <CircularProgress
                size={config.progress}
                thickness={3}
                sx={{
                  color: phaseTheme.primary,
                  filter: `drop-shadow(0 0 8px ${alpha(phaseTheme.primary, 0.6)})`,
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  bottom: 0,
                  right: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <motion.div variants={pulseVariants} animate="pulse">
                  <PhaseIcon
                    sx={{
                      fontSize: config.iconSize,
                      color: phaseTheme.primary,
                      filter: `drop-shadow(0 0 4px ${alpha(phaseTheme.primary, 0.4)})`,
                    }}
                  />
                </motion.div>
              </Box>
            </Box>
          </motion.div>

          {/* 💫 Phase Title */}
          <motion.div variants={itemVariants}>
            <Typography
              variant={config.titleVariant}
              fontWeight="bold"
              sx={{
                background: `linear-gradient(45deg, ${phaseTheme.primary}, ${phaseTheme.secondary})`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textAlign: 'center',
                textTransform: 'capitalize',
              }}
            >
              {phase === 'entering' && '🌱 Iniciando'}
              {phase === 'processing' && '🔄 Procesando'}
              {phase === 'manifesting' && '✨ Manifestando'}
              {phase === 'complete' && '🌟 Completado'}
            </Typography>
          </motion.div>

          {/* 📝 Conscious Message */}
          <motion.div variants={itemVariants}>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentMessage}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <Typography
                  variant={config.messageVariant}
                  color="text.primary"
                  sx={{
                    textAlign: 'center',
                    lineHeight: 1.4,
                    maxWidth: config.container.width - 40,
                  }}
                >
                  {currentMessage}
                </Typography>
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* 🌿 Philosophy Footer */}
          {showPhilosophy && (
            <motion.div variants={itemVariants}>
              <Typography
                variant="caption"
                sx={{
                  color: 'text.secondary',
                  textAlign: 'center',
                  fontStyle: 'italic',
                  mt: 1,
                }}
              >
                {phase === 'entering' && '🤝 Reciprocidad • Ayni'}
                {phase === 'processing' && '🌍 Bien Común • CoomÜnity'}
                {phase === 'manifesting' && '⚖️ Equilibrio • Armonía'}
                {phase === 'complete' && '🎯 Mëritos • Crecimiento'}
              </Typography>
            </motion.div>
          )}

          {/* 💖 Floating Hearts Effect for Complete */}
          {phase === 'complete' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                pointerEvents: 'none',
              }}
            >
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ y: '100%', x: Math.random() * 100 + '%', opacity: 0 }}
                  animate={{
                    y: '-20%',
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 3,
                    delay: i * 0.5,
                    ease: 'easeOut',
                  }}
                  style={{
                    position: 'absolute',
                    color: phaseTheme.secondary,
                  }}
                >
                  <Favorite sx={{ fontSize: 16 + i * 4 }} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </Stack>
      </Paper>
    </motion.div>
  );

  // 🎭 Render based on variant
  if (!isLoading && phase !== 'complete') return null;

  if (variant === 'fullscreen') {
    return (
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: alpha(theme.palette.background.paper, 0.8),
          backdropFilter: 'blur(8px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {consciousContent}
      </Box>
    );
  }

  if (variant === 'modal') {
    return (
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 1000,
        }}
      >
        {consciousContent}
      </Box>
    );
  }

  // Default inline variant
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      {consciousContent}
    </Box>
  );
};
