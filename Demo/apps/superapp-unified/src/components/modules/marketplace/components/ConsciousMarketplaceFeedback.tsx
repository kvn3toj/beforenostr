import React, { useState, useEffect } from 'react';
import {
  Box,
  Alert,
  AlertTitle,
  Snackbar,
  Typography,
  Button,
  Chip,
  Stack,
  Paper,
  Grow,
  Fade,
  Slide,
  useTheme,
  alpha,
  IconButton,
  Tooltip,
  CircularProgress,
  LinearProgress,
} from '@mui/material';
import {
  CheckCircle,
  Info,
  Warning,
  Error,
  FavoriteRounded,
  Balance,
  AutoAwesome,
  Close,
  TrendingUp,
  EmojiNature,
  VolunteerActivism,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

// 🌱 Tipos para Feedback Consciente
interface ConsciousFeedback {
  id: string;
  type: 'ayni' | 'bien-común' | 'reciprocidad' | 'impacto' | 'system';
  severity: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  filosofia?: string; // Principio filosófico relacionado
  duracion?: number; // Duración personalizada
  showProgress?: boolean;
}

interface ConsciousMarketplaceFeedbackProps {
  feedbacks: ConsciousFeedback[];
  onDismiss: (id: string) => void;
  cosmicEffects?: boolean;
}

// 🎨 Estilos Filosóficos para cada tipo de feedback
const getPhilosophicalStyle = (type: ConsciousFeedback['type'], theme: any) => {
  switch (type) {
    case 'ayni':
      return {
        color: theme.palette.success.main,
        bgColor: alpha(theme.palette.success.main, 0.1),
        icon: <Balance />,
        title: 'Reciprocidad (Ayni)',
        description: 'Balance perfecto entre dar y recibir'
      };
    case 'bien-común':
      return {
        color: theme.palette.primary.main,
        bgColor: alpha(theme.palette.primary.main, 0.1),
        icon: <VolunteerActivism />,
        title: 'Bien Común',
        description: 'Beneficio colectivo por encima del individual'
      };
    case 'reciprocidad':
      return {
        color: theme.palette.secondary.main,
        bgColor: alpha(theme.palette.secondary.main, 0.1),
        icon: <FavoriteRounded />,
        title: 'Reciprocidad Sagrada',
        description: 'Intercambio consciente y equilibrado'
      };
    case 'impacto':
      return {
        color: '#2e7d32',
        bgColor: alpha('#2e7d32', 0.1),
        icon: <EmojiNature />,
        title: 'Impacto Positivo',
        description: 'Contribución a la regeneración del ecosistema'
      };
    case 'system':
    default:
      return {
        color: theme.palette.info.main,
        bgColor: alpha(theme.palette.info.main, 0.1),
        icon: <Info />,
        title: 'Sistema',
        description: 'Información del ecosistema'
      };
  }
};

// 🌟 Feedback Individual Consciente
const ConsciousFeedbackItem: React.FC<{
  feedback: ConsciousFeedback;
  onDismiss: (id: string) => void;
  cosmicEffects?: boolean;
}> = ({ feedback, onDismiss, cosmicEffects = true }) => {
  const theme = useTheme();
  const [progress, setProgress] = useState(100);
  const philosophicalStyle = getPhilosophicalStyle(feedback.type, theme);

  const severityIcon = {
    success: <CheckCircle />,
    info: <Info />,
    warning: <Warning />,
    error: <Error />,
  };

  // ⏱️ Progreso de auto-dismiss
  useEffect(() => {
    if (feedback.duracion && feedback.showProgress) {
      const duration = feedback.duracion;
      const interval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev - (100 / (duration / 100));
          if (newProgress <= 0) {
            clearInterval(interval);
            onDismiss(feedback.id);
            return 0;
          }
          return newProgress;
        });
      }, 100);

      return () => clearInterval(interval);
    }
  }, [feedback.duracion, feedback.showProgress, feedback.id, onDismiss]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 300, scale: 0.9 }}
      animate={{
        opacity: 1,
        x: 0,
        scale: 1,
        ...(cosmicEffects && {
          boxShadow: `0 4px 20px ${alpha(philosophicalStyle.color, 0.2)}`
        })
      }}
      exit={{ opacity: 0, x: 300, scale: 0.9 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <Paper
        elevation={cosmicEffects ? 8 : 3}
        sx={{
          p: 2,
          mb: 1,
          maxWidth: 400,
          borderLeft: `4px solid ${philosophicalStyle.color}`,
          background: cosmicEffects
            ? `linear-gradient(135deg, ${philosophicalStyle.bgColor}, ${alpha(philosophicalStyle.color, 0.05)})`
            : philosophicalStyle.bgColor,
          backdropFilter: cosmicEffects ? 'blur(10px)' : 'none',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* 📊 Barra de Progreso (si está habilitada) */}
        {feedback.showProgress && feedback.duracion && (
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 2,
              bgcolor: 'transparent',
              '& .MuiLinearProgress-bar': {
                bgcolor: philosophicalStyle.color,
              }
            }}
          />
        )}

        <Stack direction="row" spacing={2} alignItems="flex-start">
          {/* 🎯 Icono Filosófico + Severidad */}
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
            <Box
              sx={{
                color: philosophicalStyle.color,
                mr: 1,
                fontSize: '1.2rem'
              }}
            >
              {philosophicalStyle.icon}
            </Box>
            <Box sx={{ color: `${feedback.severity}.main` }}>
              {severityIcon[feedback.severity]}
            </Box>
          </Box>

          {/* 📝 Contenido */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle2" fontWeight="bold" color="text.primary">
              {feedback.title}
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {feedback.message}
            </Typography>

            {/* 🌱 Principio Filosófico */}
            {feedback.filosofia && (
              <Chip
                size="small"
                label={feedback.filosofia}
                sx={{
                  bgcolor: alpha(philosophicalStyle.color, 0.2),
                  color: philosophicalStyle.color,
                  fontSize: '0.7rem',
                  height: 20,
                  mb: 1
                }}
              />
            )}

            {/* 🔄 Acción (si existe) */}
            {feedback.action && (
              <Button
                size="small"
                variant="outlined"
                onClick={feedback.action.onClick}
                sx={{
                  borderColor: philosophicalStyle.color,
                  color: philosophicalStyle.color,
                  fontSize: '0.75rem',
                  '&:hover': {
                    borderColor: philosophicalStyle.color,
                    bgcolor: alpha(philosophicalStyle.color, 0.1),
                  }
                }}
              >
                {feedback.action.label}
              </Button>
            )}
          </Box>

          {/* ✕ Botón de Cerrar */}
          <IconButton
            size="small"
            onClick={() => onDismiss(feedback.id)}
            sx={{
              color: 'text.secondary',
              '&:hover': { color: 'text.primary' }
            }}
          >
            <Close fontSize="small" />
          </IconButton>
        </Stack>
      </Paper>
    </motion.div>
  );
};

// 🌌 Componente Principal de Feedback Consciente
export const ConsciousMarketplaceFeedback: React.FC<ConsciousMarketplaceFeedbackProps> = ({
  feedbacks,
  onDismiss,
  cosmicEffects = true
}) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 80,
        right: 16,
        zIndex: theme.zIndex.snackbar + 1,
        maxHeight: 'calc(100vh - 100px)',
        overflow: 'auto',
        '&::-webkit-scrollbar': {
          width: 4,
        },
        '&::-webkit-scrollbar-track': {
          background: alpha(theme.palette.common.black, 0.05),
          borderRadius: 2,
        },
        '&::-webkit-scrollbar-thumb': {
          background: alpha(theme.palette.primary.main, 0.3),
          borderRadius: 2,
        },
      }}
    >
      <AnimatePresence mode="popLayout">
        {feedbacks.map((feedback) => (
          <ConsciousFeedbackItem
            key={feedback.id}
            feedback={feedback}
            onDismiss={onDismiss}
            cosmicEffects={cosmicEffects}
          />
        ))}
      </AnimatePresence>
    </Box>
  );
};

// 🎣 Hook personalizado para gestionar feedback consciente
export const useConsciousMarketplaceFeedback = () => {
  const [feedbacks, setFeedbacks] = useState<ConsciousFeedback[]>([]);

  const addFeedback = (feedback: Omit<ConsciousFeedback, 'id'>) => {
    const newFeedback: ConsciousFeedback = {
      ...feedback,
      id: `feedback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      duracion: feedback.duracion || 5000,
      showProgress: feedback.showProgress ?? true,
    };

    setFeedbacks(prev => [...prev, newFeedback]);

    // Auto-dismiss después de la duración especificada
    if (newFeedback.duracion && newFeedback.duracion > 0) {
      setTimeout(() => {
        setFeedbacks(prev => prev.filter(f => f.id !== newFeedback.id));
      }, newFeedback.duracion);
    }

    return newFeedback.id;
  };

  const dismissFeedback = (id: string) => {
    setFeedbacks(prev => prev.filter(f => f.id !== id));
  };

  const clearAllFeedbacks = () => {
    setFeedbacks([]);
  };

  // 🌱 Métodos específicos para diferentes tipos de feedback filosóficos
  const showAyniFeedback = (message: string, severity: ConsciousFeedback['severity'] = 'success') => {
    return addFeedback({
      type: 'ayni',
      severity,
      title: 'Equilibrio Ayni',
      message,
      filosofia: 'Reciprocidad Sagrada',
      duracion: 4000,
    });
  };

  const showBienComunFeedback = (message: string, action?: ConsciousFeedback['action']) => {
    return addFeedback({
      type: 'bien-común',
      severity: 'info',
      title: 'Contribución al Bien Común',
      message,
      filosofia: 'Bien Común > bien particular',
      action,
      duracion: 6000,
    });
  };

  const showImpactoPositivo = (message: string, impactLevel: 'local' | 'comunitario' | 'global' = 'local') => {
    const filosofias = {
      local: 'Impacto Local Consciente',
      comunitario: 'Regeneración Comunitaria',
      global: 'Transformación Global'
    };

    return addFeedback({
      type: 'impacto',
      severity: 'success',
      title: 'Impacto Positivo Detectado',
      message,
      filosofia: filosofias[impactLevel],
      duracion: 5000,
    });
  };

  return {
    feedbacks,
    addFeedback,
    dismissFeedback,
    clearAllFeedbacks,
    showAyniFeedback,
    showBienComunFeedback,
    showImpactoPositivo,
  };
};

export default ConsciousMarketplaceFeedback;
