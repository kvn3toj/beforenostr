import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Box,
  Chip,
  Typography,
  Card,
  CardContent,
  Fade,
  Slide,
  LinearProgress,
  useTheme,
  alpha,
  keyframes,
  Tooltip,
  IconButton,
} from '@mui/material';
import {
  AutoAwesome,
  Spa as Eco, // Nature/sustainability icon alternative
  Balance,
  Groups,
  Psychology,
  Lightbulb,
  Star,
  Diamond,
  Celebration,
  Close,
  PlayArrow,
  School,
  Healing,
} from '@mui/icons-material';

// 🎨 SUPERAPP VIOLET THEME COLORS
const SUPERAPP_VIOLET_PALETTE = {
  primary: '#6366f1',      // SuperApp primary violet
  secondary: '#8b5cf6',    // SuperApp secondary violet
  light: '#a855f7',        // Light violet
  dark: '#7c3aed',         // Dark violet
  accent: '#c084fc',       // Accent violet
  surface: '#f8fafc',      // Light surface
};

// 🌟 Animaciones Conscientes para ÜPlay
const consciousGlow = keyframes`
  0%, 100% {
    box-shadow: 0 0 20px ${alpha(SUPERAPP_VIOLET_PALETTE.primary, 0.3)};
    transform: scale(1);
  }
  50% {
    box-shadow: 0 0 30px ${alpha(SUPERAPP_VIOLET_PALETTE.primary, 0.6)};
    transform: scale(1.02);
  }
`;

const ayniPulse = keyframes`
  0%, 100% {
    background: linear-gradient(135deg, ${SUPERAPP_VIOLET_PALETTE.primary} 0%, ${SUPERAPP_VIOLET_PALETTE.secondary} 100%);
  }
  50% {
    background: linear-gradient(135deg, ${SUPERAPP_VIOLET_PALETTE.secondary} 0%, ${SUPERAPP_VIOLET_PALETTE.light} 100%);
  }
`;

const learningWave = keyframes`
  0% { transform: translateX(-100%) scaleX(0); }
  50% { transform: translateX(-50%) scaleX(1); }
  100% { transform: translateX(0%) scaleX(0); }
`;

// 🎯 Tipos de Feedback Consciente para ÜPlay
export type ConsciousUPlayFeedbackType =
  | 'learning-flow'          // Flujo de aprendizaje natural
  | 'wisdom-integration'     // Integración de sabiduría
  | 'conscious-engagement'   // Compromiso consciente
  | 'collective-growth'      // Crecimiento colectivo
  | 'mindful-progress'       // Progreso consciente
  | 'ayni-learning'          // Aprendizaje recíproco
  | 'bien-comun-knowledge'   // Conocimiento para el bien común
  | 'metacognition'          // Metacognición
  | 'system';

export interface ConsciousUPlayFeedbackData {
  id?: string;
  type: ConsciousUPlayFeedbackType;
  title: string;
  message: string;
  action?: string;
  duration?: number;
  philosophical_principle?: string;
  learning_insight?: string;
  progress_value?: number;
  rewards?: {
    meritos: number;
    ondas: number;
    wisdom_points: number;
  };
}

interface ConsciousUPlayFeedbackProps {
  feedback: ConsciousUPlayFeedbackData;
  onDismiss?: () => void;
  onAction?: () => void;
  variant?: 'compact' | 'detailed' | 'immersive';
}

// 🎨 Configuración de Feedback Consciente con colores violeta del SuperApp
const getFeedbackConfig = (type: ConsciousUPlayFeedbackType) => {
  const configs = {
    'learning-flow': {
      icon: Psychology,
      color: SUPERAPP_VIOLET_PALETTE.primary,
      bgGradient: `linear-gradient(135deg, ${alpha(SUPERAPP_VIOLET_PALETTE.primary, 0.1)} 0%, ${alpha(SUPERAPP_VIOLET_PALETTE.secondary, 0.1)} 100%)`,
      borderColor: SUPERAPP_VIOLET_PALETTE.primary,
      tooltip: 'Flujo de Aprendizaje Natural: Tu mente está en estado óptimo para absorber conocimiento'
    },
    'wisdom-integration': {
      icon: Lightbulb,
      color: SUPERAPP_VIOLET_PALETTE.secondary,
      bgGradient: `linear-gradient(135deg, ${alpha(SUPERAPP_VIOLET_PALETTE.secondary, 0.1)} 0%, ${alpha(SUPERAPP_VIOLET_PALETTE.light, 0.1)} 100%)`,
      borderColor: SUPERAPP_VIOLET_PALETTE.secondary,
      tooltip: 'Integración de Sabiduría: Conectando nuevos conocimientos con experiencias previas'
    },
    'conscious-engagement': {
      icon: AutoAwesome,
      color: SUPERAPP_VIOLET_PALETTE.light,
      bgGradient: `linear-gradient(135deg, ${alpha(SUPERAPP_VIOLET_PALETTE.light, 0.1)} 0%, ${alpha(SUPERAPP_VIOLET_PALETTE.accent, 0.1)} 100%)`,
      borderColor: SUPERAPP_VIOLET_PALETTE.light,
      tooltip: 'Compromiso Consciente: Presencia plena en el proceso de aprendizaje'
    },
    'collective-growth': {
      icon: Groups,
      color: SUPERAPP_VIOLET_PALETTE.dark,
      bgGradient: `linear-gradient(135deg, ${alpha(SUPERAPP_VIOLET_PALETTE.dark, 0.1)} 0%, ${alpha(SUPERAPP_VIOLET_PALETTE.primary, 0.1)} 100%)`,
      borderColor: SUPERAPP_VIOLET_PALETTE.dark,
      tooltip: 'Crecimiento Colectivo: Tu aprendizaje contribuye al bien común'
    },
    'mindful-progress': {
      icon: Balance,
      color: SUPERAPP_VIOLET_PALETTE.accent,
      bgGradient: `linear-gradient(135deg, ${alpha(SUPERAPP_VIOLET_PALETTE.accent, 0.1)} 0%, ${alpha(SUPERAPP_VIOLET_PALETTE.light, 0.1)} 100%)`,
      borderColor: SUPERAPP_VIOLET_PALETTE.accent,
      tooltip: 'Progreso Consciente: Avanzando con intención y propósito'
    },
    'ayni-learning': {
      icon: Eco,
      color: SUPERAPP_VIOLET_PALETTE.primary,
      bgGradient: `linear-gradient(135deg, ${alpha(SUPERAPP_VIOLET_PALETTE.primary, 0.1)} 0%, ${alpha(SUPERAPP_VIOLET_PALETTE.secondary, 0.1)} 100%)`,
      borderColor: SUPERAPP_VIOLET_PALETTE.primary,
      tooltip: 'Ayni en Aprendizaje: Dar y recibir conocimiento en equilibrio'
    },
    'bien-comun-knowledge': {
      icon: Diamond,
      color: SUPERAPP_VIOLET_PALETTE.dark,
      bgGradient: `linear-gradient(135deg, ${alpha(SUPERAPP_VIOLET_PALETTE.dark, 0.1)} 0%, ${alpha(SUPERAPP_VIOLET_PALETTE.secondary, 0.1)} 100%)`,
      borderColor: SUPERAPP_VIOLET_PALETTE.dark,
      tooltip: 'Conocimiento para el Bien Común: Aprendiendo para beneficiar a todos'
    },
    'metacognition': {
      icon: School,
      color: SUPERAPP_VIOLET_PALETTE.light,
      bgGradient: `linear-gradient(135deg, ${alpha(SUPERAPP_VIOLET_PALETTE.light, 0.1)} 0%, ${alpha(SUPERAPP_VIOLET_PALETTE.accent, 0.1)} 100%)`,
      borderColor: SUPERAPP_VIOLET_PALETTE.light,
      tooltip: 'Metacognición: Reflexionando sobre tu propio proceso de aprendizaje'
    },
    'system': {
      icon: Star,
      color: SUPERAPP_VIOLET_PALETTE.primary,
      bgGradient: `linear-gradient(135deg, ${alpha(SUPERAPP_VIOLET_PALETTE.primary, 0.1)} 0%, ${alpha(SUPERAPP_VIOLET_PALETTE.secondary, 0.1)} 100%)`,
      borderColor: SUPERAPP_VIOLET_PALETTE.primary,
      tooltip: 'Sistema: Mensaje del sistema de aprendizaje'
    }
  };

  return configs[type] || configs.system;
};

export const ConsciousUPlayFeedback: React.FC<ConsciousUPlayFeedbackProps> = ({
  feedback,
  onDismiss,
  onAction,
  variant = 'detailed'
}) => {
  const theme = useTheme();
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const progressRef = useRef<NodeJS.Timeout | null>(null);
  const config = getFeedbackConfig(feedback.type);
  const IconComponent = config.icon;

  // 🛡️ Handle loading state - resolve immediately on mount
  useEffect(() => {
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
    }, 200); // Very short loading time

    return () => clearTimeout(loadingTimer);
  }, []);

  // ⏰ Auto-dismiss y progreso - optimized with useCallback
  const handleProgressUpdate = useCallback(() => {
    if (feedback.duration && feedback.duration > 0 && !isLoading) {
      const increment = 100 / (feedback.duration / 100);

      setProgress(prev => {
        const newProgress = prev + increment;
        if (newProgress >= 100) {
          setVisible(false);
          setTimeout(() => onDismiss?.(), 300);
          return 100;
        }
        return newProgress;
      });
    }
  }, [feedback.duration, onDismiss, isLoading]);

  useEffect(() => {
    if (!isLoading && feedback.duration && feedback.duration > 0) {
      progressRef.current = setInterval(handleProgressUpdate, 100);
    }

    return () => {
      if (progressRef.current) {
        clearInterval(progressRef.current);
      }
    };
  }, [handleProgressUpdate, isLoading, feedback.duration]);

  const handleDismiss = useCallback(() => {
    if (progressRef.current) {
      clearInterval(progressRef.current);
    }
    setVisible(false);
    setTimeout(() => onDismiss?.(), 300);
  }, [onDismiss]);

  const handleAction = useCallback(() => {
    onAction?.();
    handleDismiss();
  }, [onAction, handleDismiss]);

  // 🔄 Show loading state briefly
  if (isLoading) {
    return (
      <Fade in={true} timeout={200}>
        <Card
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            minWidth: 200,
            zIndex: 2000,
            background: `linear-gradient(135deg, ${alpha(SUPERAPP_VIOLET_PALETTE.primary, 0.05)} 0%, ${alpha(SUPERAPP_VIOLET_PALETTE.secondary, 0.05)} 100%)`,
            border: `1px solid ${alpha(SUPERAPP_VIOLET_PALETTE.primary, 0.2)}`,
            borderRadius: 3,
          }}
        >
          <CardContent sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
            <LinearProgress
              sx={{
                flex: 1,
                height: 4,
                borderRadius: 2,
                backgroundColor: alpha(SUPERAPP_VIOLET_PALETTE.primary, 0.1),
                '& .MuiLinearProgress-bar': {
                  backgroundColor: SUPERAPP_VIOLET_PALETTE.primary
                }
              }}
            />
            <Typography variant="caption" sx={{ color: SUPERAPP_VIOLET_PALETTE.primary }}>
              Preparando...
            </Typography>
          </CardContent>
        </Card>
      </Fade>
    );
  }

  if (!visible) return null;

  // 📱 Variant Compact (para mobile o notificaciones discretas)
  if (variant === 'compact') {
    return (
      <Slide direction="left" in={visible} timeout={500}>
        <Card
          sx={{
            position: 'fixed',
            top: 80,
            right: 16,
            minWidth: 300,
            maxWidth: 350,
            zIndex: 2000,
            background: config.bgGradient,
            border: `2px solid ${config.borderColor}`,
            borderRadius: 3,
            animation: `${consciousGlow} 3s ease-in-out infinite`,
          }}
        >
          <CardContent sx={{ py: 2, '&:last-child': { pb: 2 } }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
              <IconComponent
                sx={{
                  color: config.color,
                  fontSize: 28,
                  mt: 0.5
                }}
              />
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="h6" sx={{
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  color: config.color,
                  mb: 0.5
                }}>
                  {feedback.title}
                </Typography>
                <Typography variant="body2" sx={{
                  color: theme.palette.text.secondary,
                  fontSize: '0.85rem'
                }}>
                  {feedback.message}
                </Typography>
              </Box>
              <IconButton
                onClick={handleDismiss}
                size="small"
                sx={{ color: config.color, opacity: 0.7 }}
              >
                <Close fontSize="small" />
              </IconButton>
            </Box>
            {feedback.duration && (
              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{
                  mt: 2,
                  height: 3,
                  borderRadius: 1.5,
                  backgroundColor: alpha(config.color, 0.2),
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: config.color,
                    animation: `${learningWave} 2s ease-in-out infinite`,
                  }
                }}
              />
            )}
          </CardContent>
        </Card>
      </Slide>
    );
  }

  // 🌟 Variant Immersive (para momentos de aprendizaje importantes)
  if (variant === 'immersive') {
    return (
      <Fade in={visible} timeout={800}>
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: alpha(theme.palette.background.default, 0.95),
            zIndex: 3000,
            p: 3,
          }}
        >
          <Card
            sx={{
              maxWidth: 600,
              width: '100%',
              background: config.bgGradient,
              border: `3px solid ${config.borderColor}`,
              borderRadius: 4,
              animation: `${consciousGlow} 4s ease-in-out infinite`,
              boxShadow: `0 20px 60px ${alpha(config.color, 0.3)}`,
            }}
          >
            <CardContent sx={{ p: 4, textAlign: 'center' }}>
              <Box sx={{ mb: 3 }}>
                <IconComponent
                  sx={{
                    fontSize: 64,
                    color: config.color,
                    mb: 2,
                    animation: `${ayniPulse} 3s ease-in-out infinite`,
                  }}
                />
                <Typography variant="h4" sx={{
                  fontWeight: 700,
                  color: config.color,
                  mb: 2
                }}>
                  {feedback.title}
                </Typography>
                <Typography variant="h6" sx={{
                  color: theme.palette.text.secondary,
                  mb: 3,
                  lineHeight: 1.6
                }}>
                  {feedback.message}
                </Typography>
              </Box>

              {/* Principio Filosófico */}
              {feedback.philosophical_principle && (
                <Box sx={{ mb: 3 }}>
                  <Chip
                    icon={<Healing />}
                    label={feedback.philosophical_principle}
                    sx={{
                      backgroundColor: alpha(config.color, 0.15),
                      color: config.color,
                      fontWeight: 600,
                      fontSize: '0.9rem',
                      px: 2,
                      py: 1,
                    }}
                  />
                </Box>
              )}

              {/* Insight de Aprendizaje */}
              {feedback.learning_insight && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body1" sx={{
                    fontStyle: 'italic',
                    color: theme.palette.text.primary,
                    backgroundColor: alpha(config.color, 0.1),
                    p: 2,
                    borderRadius: 2,
                    border: `1px solid ${alpha(config.color, 0.3)}`,
                  }}>
                    💡 "{feedback.learning_insight}"
                  </Typography>
                </Box>
              )}

              {/* Recompensas */}
              {feedback.rewards && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" sx={{ mb: 2, color: config.color }}>
                    Recompensas Conscientes
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                    <Chip
                      icon={<Star />}
                      label={`${feedback.rewards.meritos} Mëritos`}
                      sx={{ backgroundColor: alpha(SUPERAPP_VIOLET_PALETTE.secondary, 0.2), color: SUPERAPP_VIOLET_PALETTE.dark }}
                    />
                    <Chip
                      icon={<Diamond />}
                      label={`${feedback.rewards.ondas} Öndas`}
                      sx={{ backgroundColor: alpha(SUPERAPP_VIOLET_PALETTE.light, 0.2), color: SUPERAPP_VIOLET_PALETTE.dark }}
                    />
                    <Chip
                      icon={<Psychology />}
                      label={`${feedback.rewards.wisdom_points} Sabiduría`}
                      sx={{ backgroundColor: alpha(SUPERAPP_VIOLET_PALETTE.primary, 0.2), color: SUPERAPP_VIOLET_PALETTE.dark }}
                    />
                  </Box>
                </Box>
              )}

              {/* Botones de Acción */}
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                {onAction && feedback.action && (
                  <Tooltip title={config.tooltip}>
                    <Chip
                      icon={<PlayArrow />}
                      label={feedback.action}
                      onClick={handleAction}
                      clickable
                      sx={{
                        backgroundColor: config.color,
                        color: 'white',
                        fontWeight: 600,
                        px: 3,
                        py: 1,
                        fontSize: '1rem',
                        '&:hover': {
                          backgroundColor: alpha(config.color, 0.8),
                          transform: 'scale(1.05)',
                        },
                        transition: 'all 0.3s ease',
                      }}
                    />
                  </Tooltip>
                )}
                <Chip
                  icon={<Close />}
                  label="Continuar"
                  onClick={handleDismiss}
                  clickable
                  sx={{
                    backgroundColor: alpha(theme.palette.text.secondary, 0.1),
                    color: theme.palette.text.secondary,
                    fontWeight: 500,
                    px: 3,
                    py: 1,
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.text.secondary, 0.2),
                    },
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Fade>
    );
  }

  // 📋 Variant Detailed (default)
  return (
    <Slide direction="up" in={visible} timeout={600}>
      <Card
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          minWidth: 400,
          maxWidth: 500,
          zIndex: 2000,
          background: config.bgGradient,
          border: `2px solid ${config.borderColor}`,
          borderRadius: 3,
          animation: `${consciousGlow} 3s ease-in-out infinite`,
          boxShadow: `0 10px 30px ${alpha(config.color, 0.2)}`,
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
            <Tooltip title={config.tooltip}>
              <IconComponent
                sx={{
                  color: config.color,
                  fontSize: 32,
                  mt: 0.5
                }}
              />
            </Tooltip>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="h6" sx={{
                fontWeight: 600,
                color: config.color,
                mb: 1
              }}>
                {feedback.title}
              </Typography>
              <Typography variant="body2" sx={{
                color: theme.palette.text.secondary,
                lineHeight: 1.5,
                mb: 2
              }}>
                {feedback.message}
              </Typography>

              {/* Principio Filosófico */}
              {feedback.philosophical_principle && (
                <Box sx={{ mb: 2 }}>
                  <Chip
                    icon={<Eco />}
                    label={feedback.philosophical_principle}
                    size="small"
                    sx={{
                      backgroundColor: alpha(config.color, 0.15),
                      color: config.color,
                      fontWeight: 500,
                    }}
                  />
                </Box>
              )}

              {/* Progreso de Aprendizaje */}
              {feedback.progress_value !== undefined && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" sx={{ color: config.color, fontWeight: 600 }}>
                    Progreso de Comprensión: {Math.round(feedback.progress_value)}%
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={feedback.progress_value}
                    sx={{
                      mt: 0.5,
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: alpha(config.color, 0.2),
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: config.color,
                        borderRadius: 3,
                      }
                    }}
                  />
                </Box>
              )}
            </Box>
            <IconButton
              onClick={handleDismiss}
              size="small"
              sx={{ color: config.color, opacity: 0.7 }}
            >
              <Close fontSize="small" />
            </IconButton>
          </Box>

          {/* Botones de Acción */}
          {(onAction && feedback.action) && (
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
              <Chip
                icon={<PlayArrow />}
                label={feedback.action}
                onClick={handleAction}
                clickable
                size="small"
                sx={{
                  backgroundColor: config.color,
                  color: 'white',
                  fontWeight: 500,
                  '&:hover': {
                    backgroundColor: alpha(config.color, 0.8),
                  },
                }}
              />
            </Box>
          )}

          {/* Progress Bar Auto-dismiss */}
          {feedback.duration && (
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                mt: 2,
                height: 3,
                borderRadius: 1.5,
                backgroundColor: alpha(config.color, 0.2),
                '& .MuiLinearProgress-bar': {
                  backgroundColor: config.color,
                  animation: `${learningWave} 2s ease-in-out infinite`,
                }
              }}
            />
          )}
        </CardContent>
      </Card>
    </Slide>
  );
};

// 🎯 Hook para Feedback Consciente de ÜPlay - optimized with better state management
export const useConsciousUPlayFeedback = () => {
  const [feedbacks, setFeedbacks] = useState<(ConsciousUPlayFeedbackData & { id: string })[]>([]);
  const feedbackIdRef = useRef(0);

  const showFeedback = useCallback((feedback: ConsciousUPlayFeedbackData) => {
    const feedbackWithId = {
      ...feedback,
      id: `feedback-${++feedbackIdRef.current}-${Date.now()}`
    };

    setFeedbacks(prev => {
      // Limit to maximum 3 popups to prevent stacking
      const newFeedbacks = [...prev, feedbackWithId];
      return newFeedbacks.slice(-3);
    });
  }, []);

  const dismissFeedback = useCallback((index: number) => {
    setFeedbacks(prev => prev.filter((_, i) => i !== index));
  }, []);

  const dismissAllFeedbacks = useCallback(() => {
    setFeedbacks([]);
  }, []);

  // 🌟 Feedback Presets para ÜPlay
  const showLearningFlow = useCallback((message: string, progress?: number) => {
    showFeedback({
      type: 'learning-flow',
      title: 'Flujo de Aprendizaje Activo',
      message,
      duration: 4000,
      philosophical_principle: 'Flujo Natural del Conocimiento',
      progress_value: progress,
    });
  }, [showFeedback]);

  const showWisdomIntegration = useCallback((insight: string, rewards?: any) => {
    showFeedback({
      type: 'wisdom-integration',
      title: 'Sabiduría Integrada',
      message: 'Nueva comprensión alcanzada a través de la reflexión consciente',
      learning_insight: insight,
      duration: 6000,
      philosophical_principle: 'Integración de Conocimiento',
      rewards,
    });
  }, [showFeedback]);

  const showAyniLearning = useCallback((reciprocity_action: string) => {
    showFeedback({
      type: 'ayni-learning',
      title: 'Aprendizaje Recíproco',
      message: reciprocity_action,
      action: 'Continuar Intercambio',
      duration: 5000,
      philosophical_principle: 'Ayni - Reciprocidad Educativa',
    });
  }, [showFeedback]);

  const showCollectiveGrowth = useCallback((contribution: string) => {
    showFeedback({
      type: 'collective-growth',
      title: 'Contribución al Bien Común',
      message: contribution,
      duration: 4000,
      philosophical_principle: 'Crecimiento Colectivo',
    });
  }, [showFeedback]);

  const showMetacognition = useCallback((reflection: string) => {
    showFeedback({
      type: 'metacognition',
      title: 'Reflexión Metacognitiva',
      message: reflection,
      action: 'Explorar Más',
      duration: 5000,
      philosophical_principle: 'Conciencia del Aprendizaje',
    });
  }, [showFeedback]);

  return {
    feedbacks,
    showFeedback,
    dismissFeedback,
    dismissAllFeedbacks,
    // Presets específicos
    showLearningFlow,
    showWisdomIntegration,
    showAyniLearning,
    showCollectiveGrowth,
    showMetacognition,
  };
};

export default ConsciousUPlayFeedback;
