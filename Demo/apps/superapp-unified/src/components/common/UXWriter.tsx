/**
 * ✍️ UXWriter - Sistema de UX Writing y Diseño Emocional
 *
 * Sistema avanzado para mejorar la experiencia del usuario mediante:
 * - Mensajes contextuales y empáticos
 * - Micro-interacciones emocionales
 * - Feedback humanizado
 * - Guías conversacionales
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Avatar,
  IconButton,
  Tooltip,
  Fade,
  Grow,
  Slide,
  Zoom,
  Alert,
  AlertTitle,
  Snackbar,
  LinearProgress,
  CircularProgress,
  Skeleton,
  Paper,
  Stack,
  Divider
} from '@mui/material';
import {
  Favorite as HeartIcon,
  EmojiEmotions as SmileIcon,
  Psychology as ThinkIcon,
  Lightbulb as IdeaIcon,
  Star as StarIcon,
  Celebration as CelebrationIcon,
  SentimentVeryDissatisfied as SadIcon,
  SentimentSatisfied as HappyIcon,
  SentimentVerySatisfied as VeryHappyIcon,
  ThumbUp as ThumbUpIcon,
  Handshake as HandshakeIcon,
  AutoAwesome as MagicIcon,
  AccountTree as NatureIcon, // Nature/sustainability icon alternative
  Balance as BalanceIcon,
  Close as CloseIcon,
  Help as HelpIcon,
  TipsAndUpdates as TipIcon
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from './NotificationSystem';

// 🎭 Tipos para el sistema UX Writer
export type EmotionalTone =
  | 'encouraging'
  | 'celebratory'
  | 'empathetic'
  | 'motivational'
  | 'friendly'
  | 'professional'
  | 'playful'
  | 'zen'
  | 'inspiring';

export type ContextType =
  | 'onboarding'
  | 'achievement'
  | 'error'
  | 'loading'
  | 'empty_state'
  | 'success'
  | 'progress'
  | 'social'
  | 'learning'
  | 'marketplace'
  | 'ayni';

export interface UXMessage {
  id: string;
  context: ContextType;
  tone: EmotionalTone;
  title: string;
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  icon?: React.ReactNode;
  color?: string;
  duration?: number;
  priority?: 'low' | 'medium' | 'high';
}

interface UXWriterProps {
  context: ContextType;
  tone?: EmotionalTone;
  userName?: string;
  customMessage?: Partial<UXMessage>;
  showAnimation?: boolean;
  autoShow?: boolean;
  onDismiss?: () => void;
}

// 🎨 Biblioteca de mensajes contextuales
const UX_MESSAGES: Record<ContextType, Record<EmotionalTone, UXMessage[]>> = {
  onboarding: {
    encouraging: [
      {
        id: 'onboard_welcome',
        context: 'onboarding',
        tone: 'encouraging',
        title: '¡Bienvenido a CoomÜnity! 🌟',
        message: 'Estás a punto de formar parte de una economía colaborativa basada en el Bien Común. ¡Vamos a crear algo increíble juntos!',
        icon: <HandshakeIcon />,
        color: 'primary'
      }
    ],
    friendly: [
      {
        id: 'onboard_friendly',
        context: 'onboarding',
        tone: 'friendly',
        title: '¡Hola! 👋',
        message: 'Me alegra verte por aquí. Te voy a ayudar a descubrir todo lo que puedes hacer en CoomÜnity.',
        icon: <SmileIcon />,
        color: 'secondary'
      }
    ],
    zen: [
      {
        id: 'onboard_zen',
        context: 'onboarding',
        tone: 'zen',
        title: 'Respira y comienza 🧘‍♀️',
        message: 'Cada gran viaje comienza con un solo paso. Tómate tu tiempo para explorar y conectar con tu propósito.',
        icon: <NatureIcon />,
        color: 'success'
      }
    ],
    inspiring: [
      {
        id: 'onboard_inspiring',
        context: 'onboarding',
        tone: 'inspiring',
        title: 'Tu vocación te espera ✨',
        message: 'En CoomÜnity, cada talento tiene su lugar. Estás aquí para hacer la diferencia y crear valor real.',
        icon: <MagicIcon />,
        color: 'primary'
      }
    ],
    motivational: [
      {
        id: 'onboard_motivational',
        context: 'onboarding',
        tone: 'motivational',
        title: '¡Es hora de brillar! 💫',
        message: 'Tienes todo lo necesario para triunfar. CoomÜnity será tu plataforma para mostrar tu talento al mundo.',
        icon: <StarIcon />,
        color: 'warning'
      }
    ],
    playful: [
      {
        id: 'onboard_playful',
        context: 'onboarding',
        tone: 'playful',
        title: '¡Aventura iniciada! 🚀',
        message: 'Prepárate para una experiencia única donde el trabajo se siente como juego y cada logro es una celebración.',
        icon: <CelebrationIcon />,
        color: 'info'
      }
    ],
    professional: [
      {
        id: 'onboard_professional',
        context: 'onboarding',
        tone: 'professional',
        title: 'Bienvenido a CoomÜnity',
        message: 'Plataforma profesional para emprendedores conscientes. Aquí encontrarás las herramientas para hacer crecer tu negocio de manera ética.',
        icon: <BalanceIcon />,
        color: 'primary'
      }
    ],
    celebratory: [
      {
        id: 'onboard_celebratory',
        context: 'onboarding',
        tone: 'celebratory',
        title: '¡Felicidades por unirte! 🎉',
        message: 'Acabas de tomar una decisión increíble. Eres parte de una comunidad que está cambiando el mundo.',
        icon: <CelebrationIcon />,
        color: 'success'
      }
    ],
    empathetic: [
      {
        id: 'onboard_empathetic',
        context: 'onboarding',
        tone: 'empathetic',
        title: 'Entendemos tu búsqueda 💙',
        message: 'Sabemos que buscas algo más que trabajo. Aquí encontrarás propósito, comunidad y la oportunidad de crear impacto real.',
        icon: <HeartIcon />,
        color: 'info'
      }
    ]
  },
  achievement: {
    celebratory: [
      {
        id: 'achievement_first',
        context: 'achievement',
        tone: 'celebratory',
        title: '¡Primer logro desbloqueado! 🏆',
        message: 'Has dado tu primer paso en CoomÜnity. ¡Esto es solo el comienzo de grandes cosas!',
        icon: <StarIcon />,
        color: 'warning'
      }
    ],
    encouraging: [
      {
        id: 'achievement_progress',
        context: 'achievement',
        tone: 'encouraging',
        title: '¡Vas por buen camino! 🌟',
        message: 'Cada logro te acerca más a tu vocación. Sigue así, estás haciendo un trabajo increíble.',
        icon: <ThumbUpIcon />,
        color: 'success'
      }
    ],
    motivational: [
      {
        id: 'achievement_milestone',
        context: 'achievement',
        tone: 'motivational',
        title: '¡Imparable! 💪',
        message: 'Tu dedicación está dando frutos. Eres un ejemplo de lo que se puede lograr con pasión y propósito.',
        icon: <CelebrationIcon />,
        color: 'primary'
      }
    ]
  },
  ayni: {
    zen: [
      {
        id: 'ayni_balance',
        context: 'ayni',
        tone: 'zen',
        title: 'El equilibrio del Ayni ⚖️',
        message: 'Dar y recibir en armonía. Tu contribución al Bien Común se refleja en la abundancia que recibes.',
        icon: <BalanceIcon />,
        color: 'success'
      }
    ],
    inspiring: [
      {
        id: 'ayni_reciprocity',
        context: 'ayni',
        tone: 'inspiring',
        title: 'La magia de la reciprocidad ✨',
        message: 'Cuando das desde el corazón, el universo conspira para devolverte multiplicado. Así funciona el Ayni.',
        icon: <HeartIcon />,
        color: 'error'
      }
    ]
  },
  error: {
    empathetic: [
      {
        id: 'error_gentle',
        context: 'error',
        tone: 'empathetic',
        title: 'Ups, algo no salió como esperábamos 😔',
        message: 'No te preocupes, estos pequeños obstáculos son parte del camino. Vamos a solucionarlo juntos.',
        icon: <SadIcon />,
        color: 'warning'
      }
    ],
    encouraging: [
      {
        id: 'error_positive',
        context: 'error',
        tone: 'encouraging',
        title: 'Un pequeño tropiezo 🌱',
        message: 'Incluso los mejores tienen días difíciles. Lo importante es levantarse y seguir adelante. ¡Tú puedes!',
        icon: <ThinkIcon />,
        color: 'info'
      }
    ]
  },
  loading: {
    playful: [
      {
        id: 'loading_fun',
        context: 'loading',
        tone: 'playful',
        title: 'Preparando la magia... ✨',
        message: 'Estamos organizando todo para que tengas la mejor experiencia. ¡Vale la pena la espera!',
        icon: <MagicIcon />,
        color: 'primary'
      }
    ],
    zen: [
      {
        id: 'loading_calm',
        context: 'loading',
        tone: 'zen',
        title: 'Un momento de paciencia 🧘‍♀️',
        message: 'Las mejores cosas toman su tiempo. Respira profundo mientras preparamos todo para ti.',
        icon: <NatureIcon />,
        color: 'success'
      }
    ]
  },
  empty_state: {
    encouraging: [
      {
        id: 'empty_start',
        context: 'empty_state',
        tone: 'encouraging',
        title: 'Tu lienzo está listo 🎨',
        message: 'Este espacio está esperando que lo llenes con tus ideas increíbles. ¡Comienza tu primera creación!',
        icon: <IdeaIcon />,
        color: 'warning'
      }
    ],
    inspiring: [
      {
        id: 'empty_potential',
        context: 'empty_state',
        tone: 'inspiring',
        title: 'Infinitas posibilidades ∞',
        message: 'Cada gran historia comienza con una página en blanco. ¿Qué historia vas a escribir hoy?',
        icon: <StarIcon />,
        color: 'primary'
      }
    ]
  },
  success: {
    celebratory: [
      {
        id: 'success_celebration',
        context: 'success',
        tone: 'celebratory',
        title: '¡Misión cumplida! 🎉',
        message: 'Lo lograste de manera espectacular. Tu dedicación y talento brillan en cada resultado.',
        icon: <CelebrationIcon />,
        color: 'success'
      }
    ]
  },
  progress: {
    motivational: [
      {
        id: 'progress_momentum',
        context: 'progress',
        tone: 'motivational',
        title: '¡Momentum imparable! 🚀',
        message: 'Cada paso te acerca más a tu meta. Tu progreso es inspirador y tu determinación admirable.',
        icon: <StarIcon />,
        color: 'primary'
      }
    ]
  },
  social: {
    friendly: [
      {
        id: 'social_connection',
        context: 'social',
        tone: 'friendly',
        title: 'Conectando corazones 💙',
        message: 'Las mejores colaboraciones nacen de conexiones auténticas. ¡Construyamos juntos!',
        icon: <HandshakeIcon />,
        color: 'info'
      }
    ]
  },
  learning: {
    inspiring: [
      {
        id: 'learning_growth',
        context: 'learning',
        tone: 'inspiring',
        title: 'Creciendo cada día 🌱',
        message: 'Cada nuevo conocimiento es una semilla que plantamos para nuestro futuro. ¡Sigue aprendiendo!',
        icon: <NatureIcon />,
        color: 'success'
      }
    ]
  },
  marketplace: {
    professional: [
      {
        id: 'marketplace_opportunity',
        context: 'marketplace',
        tone: 'professional',
        title: 'Oportunidades esperándote 💼',
        message: 'El marketplace está lleno de posibilidades para hacer crecer tu negocio de manera consciente.',
        icon: <BalanceIcon />,
        color: 'primary'
      }
    ]
  }
};

// 🎯 Hook para obtener mensajes contextuales
const useUXMessages = (context: ContextType, tone: EmotionalTone = 'encouraging') => {
  const { user } = useAuth();

  const getRandomMessage = useCallback((ctx: ContextType, tn: EmotionalTone): UXMessage => {
    const messages = UX_MESSAGES[ctx]?.[tn] || UX_MESSAGES[ctx]?.['encouraging'] || [];
    if (messages.length === 0) {
      return {
        id: 'default',
        context: ctx,
        tone: tn,
        title: '¡Hola!',
        message: 'Estamos aquí para ayudarte en tu camino.',
        icon: <SmileIcon />,
        color: 'primary'
      };
    }
    return messages[Math.floor(Math.random() * messages.length)];
  }, []);

  const personalizeMessage = useCallback((message: UXMessage): UXMessage => {
    if (!user?.name) return message;

    const personalizedTitle = message.title.replace(/¡Hola!/g, `¡Hola, ${user.name}!`);
    const personalizedMessage = message.message.replace(/\btu\b/g, user.name);

    return {
      ...message,
      title: personalizedTitle,
      message: personalizedMessage
    };
  }, [user]);

  return {
    getRandomMessage,
    personalizeMessage,
    getContextualMessage: (ctx: ContextType, tn: EmotionalTone = tone) =>
      personalizeMessage(getRandomMessage(ctx, tn))
  };
};

// 🎭 Componente principal UXWriter
const UXWriter: React.FC<UXWriterProps> = ({
  context,
  tone = 'encouraging',
  userName,
  customMessage,
  showAnimation = true,
  autoShow = true,
  onDismiss
}) => {
  const [isVisible, setIsVisible] = useState(autoShow);
  const [currentMessage, setCurrentMessage] = useState<UXMessage | null>(null);
  const { getContextualMessage } = useUXMessages(context, tone);
  const { showInfo } = useNotifications();

  // Generar mensaje contextual
  useEffect(() => {
    if (customMessage) {
      setCurrentMessage({
        id: 'custom',
        context,
        tone,
        title: 'Mensaje personalizado',
        message: '',
        ...customMessage
      });
    } else {
      setCurrentMessage(getContextualMessage(context, tone));
    }
  }, [context, tone, customMessage, getContextualMessage]);

  const handleDismiss = useCallback(() => {
    setIsVisible(false);
    onDismiss?.();
  }, [onDismiss]);

  const handleAction = useCallback(() => {
    if (currentMessage?.action) {
      currentMessage.action.onClick();
    }
    handleDismiss();
  }, [currentMessage, handleDismiss]);

  if (!currentMessage || !isVisible) return null;

  const AnimationWrapper = showAnimation ? Grow : React.Fragment;
  const animationProps = showAnimation ? { in: isVisible, timeout: 500 } : {};

  return (
    <AnimationWrapper {...animationProps}>
      <Card
        sx={{
          maxWidth: 400,
          m: 2,
          position: 'relative',
          background: `linear-gradient(135deg, ${currentMessage.color || 'primary'}.light, ${currentMessage.color || 'primary'}.main)`,
          color: 'white',
          boxShadow: 3,
          '&:hover': {
            boxShadow: 6,
            transform: 'translateY(-2px)',
            transition: 'all 0.3s ease'
          }
        }}
      >
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
            {currentMessage.icon && (
              <Avatar
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.2)',
                  color: 'white'
                }}
              >
                {currentMessage.icon}
              </Avatar>
            )}

            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                {currentMessage.title}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                {currentMessage.message}
              </Typography>
            </Box>

            <IconButton
              size="small"
              onClick={handleDismiss}
              sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>

          {currentMessage.action && (
            <Box sx={{ mt: 2, textAlign: 'right' }}>
              <Button
                variant="contained"
                size="small"
                onClick={handleAction}
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.3)'
                  }
                }}
              >
                {currentMessage.action.label}
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>
    </AnimationWrapper>
  );
};

// 🎪 Componente para tips contextuales
export const ContextualTip: React.FC<{
  context: ContextType;
  trigger?: 'hover' | 'click' | 'auto';
  placement?: 'top' | 'bottom' | 'left' | 'right';
  children: React.ReactElement;
}> = ({ context, trigger = 'hover', placement = 'top', children }) => {
  const [open, setOpen] = useState(false);
  const { getContextualMessage } = useUXMessages(context);
  const message = getContextualMessage(context, 'friendly');

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Tooltip
      title={
        <Box>
          <Typography variant="subtitle2" fontWeight="bold">
            {message.title}
          </Typography>
          <Typography variant="body2">
            {message.message}
          </Typography>
        </Box>
      }
      placement={placement}
      open={trigger === 'auto' ? undefined : open}
      onClose={handleClose}
      onOpen={handleOpen}
      arrow
      componentsProps={{
        tooltip: {
          sx: {
            bgcolor: 'primary.main',
            maxWidth: 300,
            '& .MuiTooltip-arrow': {
              color: 'primary.main'
            }
          }
        }
      }}
    >
      {trigger === 'click' ? (
        React.cloneElement(children, { onClick: handleOpen })
      ) : (
        children
      )}
    </Tooltip>
  );
};

// 🎨 Componente para estados emocionales
export const EmotionalState: React.FC<{
  emotion: 'happy' | 'sad' | 'excited' | 'calm' | 'motivated';
  message?: string;
  action?: () => void;
}> = ({ emotion, message, action }) => {
  const getEmotionConfig = (emotion: string) => {
    switch (emotion) {
      case 'happy':
        return { icon: <HappyIcon />, color: 'success', title: '¡Genial!' };
      case 'sad':
        return { icon: <SadIcon />, color: 'info', title: 'Te entendemos' };
      case 'excited':
        return { icon: <VeryHappyIcon />, color: 'warning', title: '¡Increíble!' };
      case 'calm':
        return { icon: <NatureIcon />, color: 'success', title: 'Tranquilidad' };
      case 'motivated':
        return { icon: <StarIcon />, color: 'primary', title: '¡A por ello!' };
      default:
        return { icon: <SmileIcon />, color: 'primary', title: 'Hola' };
    }
  };

  const config = getEmotionConfig(emotion);

  return (
    <Zoom in={true}>
      <Paper
        elevation={3}
        sx={{
          p: 2,
          textAlign: 'center',
          bgcolor: `${config.color}.light`,
          color: `${config.color}.contrastText`
        }}
      >
        <Box sx={{ mb: 1 }}>
          {config.icon}
        </Box>
        <Typography variant="h6" gutterBottom>
          {config.title}
        </Typography>
        {message && (
          <Typography variant="body2" sx={{ mb: 2 }}>
            {message}
          </Typography>
        )}
        {action && (
          <Button variant="contained" onClick={action} size="small">
            Continuar
          </Button>
        )}
      </Paper>
    </Zoom>
  );
};

export default UXWriter;
export { useUXMessages, UX_MESSAGES };
