import React, { useState, useCallback, useEffect } from 'react';
import {
  Box,
  Alert,
  Snackbar,
  LinearProgress,
  Avatar,
  Typography,
  IconButton,
  Chip,
  Fade,
  Slide,
  Paper,
  Stack,
} from '@mui/material';
import {
  Close,
  Favorite,
  Groups,
  AutoAwesome,
  Diversity3,
  FavoriteBorder,
  EmojiPeople,
  ConnectWithoutContact,
  Psychology,
  Nature,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

// 🌱 Tipos de feedback social consciente alineados con CoomÜnity
type ConsciousSocialFeedbackType =
  | 'ayni-connection'        // Conexión basada en reciprocidad
  | 'bien-comun-collaboration' // Colaboración para el bien común
  | 'community-building'     // Construcción de comunidad
  | 'empathy-resonance'      // Resonancia empática
  | 'wisdom-sharing'         // Compartir sabiduría
  | 'trust-deepening'        // Profundización de confianza
  | 'system-harmony'         // Armonía sistémica
  | 'consciousness-expansion'; // Expansión de consciencia

interface ConsciousSocialFeedback {
  id: string;
  type: ConsciousSocialFeedbackType;
  title: string;
  message: string;
  duration: number;
  progress?: number;
  cosmicEffect?: {
    color: string;
    intensity: number;
    pattern: 'ripple' | 'spiral' | 'bloom' | 'wave';
  };
  ayniLevel?: 'seed' | 'growing' | 'flourishing' | 'transcendent';
  consciousness?: 'individual' | 'community' | 'collective' | 'universal';
}

interface ConsciousSocialFeedbackProps {
  feedbacks: ConsciousSocialFeedback[];
  onDismiss: (id: string) => void;
}

// 🎨 Colores filosóficos para cada tipo de feedback
const getFeedbackColor = (type: ConsciousSocialFeedbackType): string => {
  switch (type) {
    case 'ayni-connection':
      return '#E91E63'; // Rosa: amor y reciprocidad
    case 'bien-comun-collaboration':
      return '#4CAF50'; // Verde: crecimiento y bien común
    case 'community-building':
      return '#2196F3'; // Azul: comunicación y conexión
    case 'empathy-resonance':
      return '#FF9800'; // Naranja: calidez y comprensión
    case 'wisdom-sharing':
      return '#9C27B0'; // Púrpura: sabiduría y transformación
    case 'trust-deepening':
      return '#00BCD4'; // Cian: claridad y confianza
    case 'system-harmony':
      return '#795548'; // Marrón: tierra y estabilidad
    case 'consciousness-expansion':
      return '#6366F1'; // Índigo: consciencia y transcendencia
    default:
      return '#64748B';
  }
};

// 🌟 Iconos filosóficos para cada tipo
const getFeedbackIcon = (type: ConsciousSocialFeedbackType) => {
  switch (type) {
    case 'ayni-connection':
      return <FavoriteBorder sx={{ fontSize: 20 }} />;
    case 'bien-comun-collaboration':
      return <Diversity3 sx={{ fontSize: 20 }} />;
    case 'community-building':
      return <Groups sx={{ fontSize: 20 }} />;
    case 'empathy-resonance':
      return <EmojiPeople sx={{ fontSize: 20 }} />;
    case 'wisdom-sharing':
      return <Psychology sx={{ fontSize: 20 }} />;
    case 'trust-deepening':
      return <ConnectWithoutContact sx={{ fontSize: 20 }} />;
    case 'system-harmony':
      return <Nature sx={{ fontSize: 20 }} />;
    case 'consciousness-expansion':
      return <AutoAwesome sx={{ fontSize: 20 }} />;
    default:
      return <Favorite sx={{ fontSize: 20 }} />;
  }
};

// 🌊 Efectos cósmicos por nivel de consciencia
const getCosmicEffectByConsciousness = (consciousness: ConsciousSocialFeedback['consciousness']) => {
  switch (consciousness) {
    case 'individual':
      return { pattern: 'ripple' as const, intensity: 0.6, duration: 2000 };
    case 'community':
      return { pattern: 'bloom' as const, intensity: 0.8, duration: 3000 };
    case 'collective':
      return { pattern: 'spiral' as const, intensity: 0.9, duration: 4000 };
    case 'universal':
      return { pattern: 'wave' as const, intensity: 1.0, duration: 5000 };
    default:
      return { pattern: 'ripple' as const, intensity: 0.5, duration: 1500 };
  }
};

// 🎯 Componente principal
export const ConsciousSocialFeedback: React.FC<ConsciousSocialFeedbackProps> = ({
  feedbacks,
  onDismiss,
}) => {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 80,
        right: 24,
        zIndex: 2000,
        width: 380,
        maxHeight: '70vh',
        overflow: 'auto',
        '&::-webkit-scrollbar': {
          width: '6px',
        },
        '&::-webkit-scrollbar-track': {
          background: 'rgba(0,0,0,0.1)',
          borderRadius: '3px',
        },
        '&::-webkit-scrollbar-thumb': {
          background: 'rgba(0,0,0,0.3)',
          borderRadius: '3px',
        },
      }}
    >
      <AnimatePresence>
        <Stack spacing={2}>
          {feedbacks.map((feedback, index) => (
            <motion.div
              key={feedback.id}
              initial={{ opacity: 0, x: 100, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.8 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 20,
                delay: index * 0.1
              }}
              whileHover={{ scale: 1.02 }}
            >
              <ConsciousSocialFeedbackCard
                feedback={feedback}
                onDismiss={() => onDismiss(feedback.id)}
              />
            </motion.div>
          ))}
        </Stack>
      </AnimatePresence>
    </Box>
  );
};

// 🃏 Tarjeta individual de feedback
const ConsciousSocialFeedbackCard: React.FC<{
  feedback: ConsciousSocialFeedback;
  onDismiss: () => void;
}> = ({ feedback, onDismiss }) => {
  const [progress, setProgress] = useState(100);
  const color = getFeedbackColor(feedback.type);
  const cosmicEffect = getCosmicEffectByConsciousness(feedback.consciousness);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev <= 0) {
          onDismiss();
          return 0;
        }
        return prev - (100 / (feedback.duration / 100));
      });
    }, 100);

    return () => clearInterval(interval);
  }, [feedback.duration, onDismiss]);

  return (
    <Paper
      elevation={8}
      sx={{
        position: 'relative',
        p: 2,
        borderRadius: 3,
        background: `linear-gradient(135deg, ${color}15, ${color}05)`,
        border: `2px solid ${color}30`,
        backdropFilter: 'blur(10px)',
        overflow: 'hidden',
        minHeight: 120,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `radial-gradient(circle at 50% 50%, ${color}20, transparent 70%)`,
          animation: `cosmicPulse${cosmicEffect.pattern} ${cosmicEffect.duration}ms infinite ease-in-out`,
          zIndex: 0,
        },
        '@keyframes cosmicPulseripple': {
          '0%, 100%': { transform: 'scale(1)', opacity: 0.3 },
          '50%': { transform: 'scale(1.1)', opacity: 0.6 },
        },
        '@keyframes cosmicPulsebloom': {
          '0%, 100%': { transform: 'scale(1) rotate(0deg)', opacity: 0.4 },
          '50%': { transform: 'scale(1.2) rotate(180deg)', opacity: 0.7 },
        },
        '@keyframes cosmicPulsespiral': {
          '0%': { transform: 'scale(1) rotate(0deg)', opacity: 0.3 },
          '100%': { transform: 'scale(1.3) rotate(360deg)', opacity: 0.8 },
        },
        '@keyframes cosmicPulsewave': {
          '0%, 100%': { transform: 'scaleX(1) scaleY(1)', opacity: 0.5 },
          '33%': { transform: 'scaleX(1.2) scaleY(0.8)', opacity: 0.8 },
          '66%': { transform: 'scaleX(0.8) scaleY(1.2)', opacity: 0.6 },
        },
      }}
    >
      {/* Barra de progreso de tiempo */}
      <LinearProgress
        variant="determinate"
        value={progress}
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          backgroundColor: `${color}20`,
          '& .MuiLinearProgress-bar': {
            backgroundColor: color,
          },
        }}
      />

      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <Stack direction="row" spacing={2} alignItems="flex-start">
          {/* Avatar con icono filosófico */}
          <Avatar
            sx={{
              bgcolor: color,
              width: 40,
              height: 40,
              boxShadow: `0 4px 12px ${color}40`,
            }}
          >
            {getFeedbackIcon(feedback.type)}
          </Avatar>

          {/* Contenido */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 700,
                  color,
                  fontSize: '0.9rem',
                }}
              >
                {feedback.title}
              </Typography>

              <IconButton
                size="small"
                onClick={onDismiss}
                sx={{
                  color,
                  '&:hover': {
                    backgroundColor: `${color}20`,
                  },
                }}
              >
                <Close sx={{ fontSize: 18 }} />
              </IconButton>
            </Stack>

            <Typography
              variant="body2"
              sx={{
                color: 'text.primary',
                lineHeight: 1.4,
                mb: 1.5,
              }}
            >
              {feedback.message}
            </Typography>

            {/* Chips de nivel y consciencia */}
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {feedback.ayniLevel && (
                <Chip
                  label={`Ayni: ${feedback.ayniLevel}`}
                  size="small"
                  sx={{
                    backgroundColor: `${color}20`,
                    color,
                    fontWeight: 600,
                    fontSize: '0.75rem',
                    height: 24,
                  }}
                />
              )}
              {feedback.consciousness && (
                <Chip
                  label={feedback.consciousness}
                  size="small"
                  sx={{
                    backgroundColor: `${color}15`,
                    color,
                    fontWeight: 500,
                    fontSize: '0.75rem',
                    height: 24,
                  }}
                />
              )}
            </Stack>
          </Box>
        </Stack>
      </Box>
    </Paper>
  );
};

// 🎣 Hook para gestionar el feedback social consciente
export const useConsciousSocialFeedback = () => {
  const [feedbacks, setFeedbacks] = useState<ConsciousSocialFeedback[]>([]);

  const dismissFeedback = useCallback((id: string) => {
    setFeedbacks(prev => prev.filter(f => f.id !== id));
  }, []);

  const addFeedback = useCallback((feedback: Omit<ConsciousSocialFeedback, 'id'>) => {
    const id = `social-feedback-${Date.now()}-${Math.random()}`;
    setFeedbacks(prev => [...prev, { ...feedback, id }]);
  }, []);

  // 🌱 Métodos específicos para diferentes tipos de feedback social
  const showAyniConnection = useCallback((message: string, ayniLevel: ConsciousSocialFeedback['ayniLevel'] = 'growing') => {
    addFeedback({
      type: 'ayni-connection',
      title: 'Conexión Ayni Activada',
      message,
      duration: 4000,
      ayniLevel,
      consciousness: 'community',
    });
  }, [addFeedback]);

  const showBienComunCollaboration = useCallback((message: string) => {
    addFeedback({
      type: 'bien-comun-collaboration',
      title: 'Colaboración para el Bien Común',
      message,
      duration: 5000,
      ayniLevel: 'flourishing',
      consciousness: 'collective',
    });
  }, [addFeedback]);

  const showCommunityBuilding = useCallback((message: string) => {
    addFeedback({
      type: 'community-building',
      title: 'Construcción de Comunidad',
      message,
      duration: 3500,
      ayniLevel: 'growing',
      consciousness: 'community',
    });
  }, [addFeedback]);

  const showEmpathyResonance = useCallback((message: string) => {
    addFeedback({
      type: 'empathy-resonance',
      title: 'Resonancia Empática',
      message,
      duration: 3000,
      ayniLevel: 'flourishing',
      consciousness: 'individual',
    });
  }, [addFeedback]);

  const showWisdomSharing = useCallback((message: string) => {
    addFeedback({
      type: 'wisdom-sharing',
      title: 'Compartir Sabiduría',
      message,
      duration: 4500,
      ayniLevel: 'transcendent',
      consciousness: 'collective',
    });
  }, [addFeedback]);

  const showTrustDeepening = useCallback((message: string) => {
    addFeedback({
      type: 'trust-deepening',
      title: 'Profundización de Confianza',
      message,
      duration: 4000,
      ayniLevel: 'flourishing',
      consciousness: 'community',
    });
  }, [addFeedback]);

  const showSystemHarmony = useCallback((message: string) => {
    addFeedback({
      type: 'system-harmony',
      title: 'Armonía Sistémica',
      message,
      duration: 5000,
      ayniLevel: 'transcendent',
      consciousness: 'universal',
    });
  }, [addFeedback]);

  const showConsciousnessExpansion = useCallback((message: string) => {
    addFeedback({
      type: 'consciousness-expansion',
      title: 'Expansión de Consciencia',
      message,
      duration: 6000,
      ayniLevel: 'transcendent',
      consciousness: 'universal',
    });
  }, [addFeedback]);

  return {
    feedbacks,
    dismissFeedback,
    showAyniConnection,
    showBienComunCollaboration,
    showCommunityBuilding,
    showEmpathyResonance,
    showWisdomSharing,
    showTrustDeepening,
    showSystemHarmony,
    showConsciousnessExpansion,
  };
};

export default ConsciousSocialFeedback;
