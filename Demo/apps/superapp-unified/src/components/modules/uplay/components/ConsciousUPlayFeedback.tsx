import React, { useState, useEffect } from 'react';
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

// 🌟 Animaciones Conscientes para ÜPlay
const consciousGlow = keyframes`
  0%, 100% {
    box-shadow: 0 0 20px rgba(76, 175, 80, 0.3);
    transform: scale(1);
  }
  50% {
    box-shadow: 0 0 30px rgba(76, 175, 80, 0.6);
    transform: scale(1.02);
  }
`;

const ayniPulse = keyframes`
  0%, 100% {
    background: linear-gradient(135deg, #4CAF50 0%, #81C784 100%);
  }
  50% {
    background: linear-gradient(135deg, #66BB6A 0%, #A5D6A7 100%);
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

// 🎨 Configuración de Feedback Consciente
const getFeedbackConfig = (type: ConsciousUPlayFeedbackType) => {
  const configs = {
    'learning-flow': {
      icon: Psychology,
      color: '#4CAF50',
      bgGradient: 'linear-gradient(135deg, #E8F5E8 0%, #C8E6C9 100%)',
      borderColor: '#4CAF50',
      tooltip: 'Flujo de Aprendizaje Natural: Tu mente está en estado óptimo para absorber conocimiento'
    },
    'wisdom-integration': {
      icon: Lightbulb,
      color: '#FF9800',
      bgGradient: 'linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 100%)',
      borderColor: '#FF9800',
      tooltip: 'Integración de Sabiduría: Conectando nuevos conocimientos con experiencias previas'
    },
    'conscious-engagement': {
      icon: AutoAwesome,
      color: '#9C27B0',
      bgGradient: 'linear-gradient(135deg, #F3E5F5 0%, #E1BEE7 100%)',
      borderColor: '#9C27B0',
      tooltip: 'Compromiso Consciente: Presencia plena en el proceso de aprendizaje'
    },
    'collective-growth': {
      icon: Groups,
      color: '#2196F3',
      bgGradient: 'linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)',
      borderColor: '#2196F3',
      tooltip: 'Crecimiento Colectivo: Tu aprendizaje contribuye al bien común'
    },
    'mindful-progress': {
      icon: Balance,
      color: '#00BCD4',
      bgGradient: 'linear-gradient(135deg, #E0F7FA 0%, #B2EBF2 100%)',
      borderColor: '#00BCD4',
      tooltip: 'Progreso Consciente: Avanzando con intención y propósito'
    },
    'ayni-learning': {
      icon: Eco,
      color: '#4CAF50',
      bgGradient: 'linear-gradient(135deg, #E8F5E8 0%, #C8E6C9 100%)',
      borderColor: '#4CAF50',
      tooltip: 'Ayni en Aprendizaje: Dar y recibir conocimiento en equilibrio'
    },
    'bien-comun-knowledge': {
      icon: Diamond,
      color: '#673AB7',
      bgGradient: 'linear-gradient(135deg, #EDE7F6 0%, #D1C4E9 100%)',
      borderColor: '#673AB7',
      tooltip: 'Conocimiento para el Bien Común: Aprendiendo para beneficiar a todos'
    },
    'metacognition': {
      icon: School,
      color: '#795548',
      bgGradient: 'linear-gradient(135deg, #EFEBE9 0%, #D7CCC8 100%)',
      borderColor: '#795548',
      tooltip: 'Metacognición: Reflexionando sobre tu propio proceso de aprendizaje'
    },
    'system': {
      icon: Star,
      color: '#607D8B',
      bgGradient: 'linear-gradient(135deg, #ECEFF1 0%, #CFD8DC 100%)',
      borderColor: '#607D8B',
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
  const config = getFeedbackConfig(feedback.type);
  const IconComponent = config.icon;

  // ⏰ Auto-dismiss y progreso
  useEffect(() => {
    if (feedback.duration && feedback.duration > 0) {
      const interval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + (100 / (feedback.duration! / 100));
          if (newProgress >= 100) {
            setVisible(false);
            setTimeout(() => onDismiss?.(), 300);
            return 100;
          }
          return newProgress;
        });
      }, 100);

      return () => clearInterval(interval);
    }
  }, [feedback.duration, onDismiss]);

  const handleDismiss = () => {
    setVisible(false);
    setTimeout(() => onDismiss?.(), 300);
  };

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
                      sx={{ backgroundColor: alpha('#FFD700', 0.2), color: '#FF8F00' }}
                    />
                    <Chip
                      icon={<Diamond />}
                      label={`${feedback.rewards.ondas} Öndas`}
                      sx={{ backgroundColor: alpha('#00BCD4', 0.2), color: '#00838F' }}
                    />
                    <Chip
                      icon={<Psychology />}
                      label={`${feedback.rewards.wisdom_points} Sabiduría`}
                      sx={{ backgroundColor: alpha('#9C27B0', 0.2), color: '#7B1FA2' }}
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
                      onClick={onAction}
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
                onClick={onAction}
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

// 🎯 Hook para Feedback Consciente de ÜPlay
export const useConsciousUPlayFeedback = () => {
  const [feedbacks, setFeedbacks] = useState<ConsciousUPlayFeedbackData[]>([]);

  const showFeedback = (feedback: ConsciousUPlayFeedbackData) => {
    setFeedbacks(prev => [...prev, { ...feedback, id: Date.now().toString() } as any]);
  };

  const dismissFeedback = (index: number) => {
    setFeedbacks(prev => prev.filter((_, i) => i !== index));
  };

  // 🌟 Feedback Presets para ÜPlay
  const showLearningFlow = (message: string, progress?: number) => {
    showFeedback({
      type: 'learning-flow',
      title: 'Flujo de Aprendizaje Activo',
      message,
      duration: 4000,
      philosophical_principle: 'Flujo Natural del Conocimiento',
      progress_value: progress,
    });
  };

  const showWisdomIntegration = (insight: string, rewards?: any) => {
    showFeedback({
      type: 'wisdom-integration',
      title: 'Sabiduría Integrada',
      message: 'Nueva comprensión alcanzada a través de la reflexión consciente',
      learning_insight: insight,
      duration: 6000,
      philosophical_principle: 'Integración de Conocimiento',
      rewards,
    });
  };

  const showAyniLearning = (reciprocity_action: string) => {
    showFeedback({
      type: 'ayni-learning',
      title: 'Aprendizaje Recíproco',
      message: reciprocity_action,
      action: 'Continuar Intercambio',
      duration: 5000,
      philosophical_principle: 'Ayni - Reciprocidad Educativa',
    });
  };

  const showCollectiveGrowth = (contribution: string) => {
    showFeedback({
      type: 'collective-growth',
      title: 'Contribución al Bien Común',
      message: contribution,
      duration: 4000,
      philosophical_principle: 'Crecimiento Colectivo',
    });
  };

  const showMetacognition = (reflection: string) => {
    showFeedback({
      type: 'metacognition',
      title: 'Reflexión Metacognitiva',
      message: reflection,
      action: 'Explorar Más',
      duration: 5000,
      philosophical_principle: 'Conciencia del Aprendizaje',
    });
  };

  return {
    feedbacks,
    showFeedback,
    dismissFeedback,
    // Presets específicos
    showLearningFlow,
    showWisdomIntegration,
    showAyniLearning,
    showCollectiveGrowth,
    showMetacognition,
  };
};

export default ConsciousUPlayFeedback;
