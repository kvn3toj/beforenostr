import React, { useState, useEffect, useMemo } from 'react';
import {
  Paper,
  Box,
  Typography,
  Button,
  Avatar,
  IconButton,
  Fade,
  Slide,
  Chip,
  Card,
  CardContent,
  Collapse,
} from '@mui/material';
import {
  Close as CloseIcon,
  Lightbulb as TipIcon,
  QuestionAnswer as QuestionIcon,
  Favorite as HeartIcon,
  Star as StarIcon,
  ArrowForward as NextIcon,
  School as LearnIcon,
} from '@mui/icons-material';
import { useLetsContext } from './LetsContextProvider';

type AssistantContext = 'wallet' | 'marketplace' | 'transaction' | 'onboarding' | 'trust' | 'general';

interface AssistantTip {
  id: string;
  message: string;
  actionButton?: string;
  action?: () => void;
  priority: 'low' | 'medium' | 'high';
  emoji: string;
  category: 'tip' | 'achievement' | 'warning' | 'encouragement';
}

interface LetsAssistantProps {
  context: AssistantContext;
  visible?: boolean;
  onDismiss?: () => void;
  onTipComplete?: (tipId: string) => void;
  userBalance?: number;
  userTrustScore?: number;
}

const ASSISTANT_TIPS: Record<AssistantContext, Record<string, AssistantTip[]>> = {
  wallet: {
    newcomer: [
      {
        id: 'first_wallet_view',
        message: '¡Bienvenido a tu wallet! Aquí verás cómo contribuyes a la comunidad CoomÜnity.',
        actionButton: 'Entender mi wallet',
        priority: 'high',
        emoji: '💝',
        category: 'tip',
      },
      {
        id: 'zero_balance_explanation',
        message: 'Tu saldo en 0 es perfecto para empezar. ¡Cada intercambio cuenta tu historia!',
        priority: 'medium',
        emoji: '⚖️',
        category: 'encouragement',
      },
      {
        id: 'trust_building_start',
        message: 'Tu confianza se construye con cada buena acción. ¡Sé auténtico y cumple tus promesas!',
        actionButton: 'Ver cómo funciona',
        priority: 'medium',
        emoji: '🌱',
        category: 'tip',
      },
    ],
    beginner: [
      {
        id: 'first_positive_balance',
        message: '¡Felicidades! Tu saldo positivo muestra que estás contribuyendo al Bien Común.',
        priority: 'high',
        emoji: '🌟',
        category: 'achievement',
      },
      {
        id: 'reciprocidad_balance_tip',
        message: 'Intenta mantener un equilibrio entre dar y recibir. ¡El Reciprocidad es reciprocidad!',
        actionButton: 'Aprender sobre Reciprocidad',
        priority: 'medium',
        emoji: '⚖️',
        category: 'tip',
      },
    ],
    intermediate: [
      {
        id: 'credit_optimization',
        message: 'Considera usar tu límite de crédito para apoyar proyectos de alto impacto.',
        priority: 'low',
        emoji: '💡',
        category: 'tip',
      },
    ],
    advanced: [
      {
        id: 'community_leadership',
        message: 'Tu alto nivel de confianza te permite ser mentor de nuevos miembros.',
        actionButton: 'Ser mentor',
        priority: 'medium',
        emoji: '👑',
        category: 'achievement',
      },
    ],
  },
  marketplace: {
    newcomer: [
      {
        id: 'first_marketplace_visit',
        message: 'En el marketplace puedes ofrecer tus habilidades o encontrar lo que necesitas.',
        actionButton: 'Explorar ofertas',
        priority: 'high',
        emoji: '🛍️',
        category: 'tip',
      },
      {
        id: 'creating_first_listing',
        message: '¿Qué habilidad única tienes? ¡Compártela y gana tus primeras Ünits!',
        actionButton: 'Crear mi primera oferta',
        priority: 'high',
        emoji: '✨',
        category: 'encouragement',
      },
    ],
    beginner: [
      {
        id: 'search_filters_tip',
        message: 'Usa los filtros para encontrar exactamente lo que buscas en tu área.',
        priority: 'medium',
        emoji: '🔍',
        category: 'tip',
      },
    ],
  },
  transaction: {
    newcomer: [
      {
        id: 'first_transaction_prep',
        message: 'Tu primer intercambio es especial. ¡Sé claro en tus expectativas y horarios!',
        priority: 'high',
        emoji: '🤝',
        category: 'tip',
      },
      {
        id: 'transaction_completion',
        message: 'Recuerda marcar como completado y dar feedback. ¡Así crece la confianza!',
        actionButton: 'Ver guía completa',
        priority: 'high',
        emoji: '✅',
        category: 'tip',
      },
    ],
  },
  trust: {
    newcomer: [
      {
        id: 'trust_explanation',
        message: 'La confianza es como una planta: crece lentamente pero da frutos duraderos.',
        priority: 'medium',
        emoji: '🌳',
        category: 'tip',
      },
    ],
    beginner: [
      {
        id: 'trust_milestone',
        message: '¡Tu confianza está creciendo! Sigue siendo consistente y auténtico.',
        priority: 'medium',
        emoji: '📈',
        category: 'achievement',
      },
    ],
  },
  onboarding: [
    {
      id: 'welcome_to_lets',
      message: '¡Bienvenido al futuro de la economía colaborativa! Te guiaré paso a paso.',
      priority: 'high',
      emoji: '🚀',
      category: 'encouragement',
    },
  ],
  general: {
    newcomer: [
      {
        id: 'daily_encouragement',
        message: 'Cada día es una oportunidad de contribuir al Bien Común. ¡Tú puedes!',
        priority: 'low',
        emoji: '☀️',
        category: 'encouragement',
      },
    ],
  },
};

const ACHIEVEMENT_MESSAGES = {
  first_exchange: {
    message: '¡Felicidades por tu primer intercambio! Has dado el primer paso hacia el Bien Común.',
    emoji: '🎉',
  },
  trust_milestone_50: {
    message: '¡Has alcanzado 50% de confianza! La comunidad está empezando a conocerte.',
    emoji: '🌟',
  },
  trust_milestone_75: {
    message: '¡75% de confianza! Eres una persona en la que otros pueden confiar.',
    emoji: '⭐',
  },
  balanced_reciprocidad: {
    message: '¡Perfecto equilibrio Reciprocidad! Das y recibes en armonía con la comunidad.',
    emoji: '⚖️',
  },
};

export const LetsAssistant: React.FC<LetsAssistantProps> = ({
  context,
  visible = true,
  onDismiss,
  onTipComplete,
  userBalance = 0,
  userTrustScore = 0,
}) => {
  const { userLevel, markFeatureAsDiscovered, isFeatureDiscovered } = useLetsContext();
  
  const [isVisible, setIsVisible] = useState(visible);
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [showAchievement, setShowAchievement] = useState(false);
  const [achievementType, setAchievementType] = useState<string | null>(null);

  // Obtener tips relevantes para el contexto y nivel de usuario
  const relevantTips = useMemo(() => {
    const contextTips = ASSISTANT_TIPS[context];
    if (!contextTips) return [];
    
    const levelTips = contextTips[userLevel] || [];
    
    // Filtrar tips que ya han sido vistos
    return levelTips.filter(tip => !isFeatureDiscovered(`assistant_tip_${tip.id}`));
  }, [context, userLevel, isFeatureDiscovered]);

  const currentTip = relevantTips[currentTipIndex];

  // Detectar achievements basados en props
  useEffect(() => {
    if (userTrustScore >= 50 && !isFeatureDiscovered('achievement_trust_50')) {
      setAchievementType('trust_milestone_50');
      setShowAchievement(true);
      markFeatureAsDiscovered('achievement_trust_50');
    } else if (userTrustScore >= 75 && !isFeatureDiscovered('achievement_trust_75')) {
      setAchievementType('trust_milestone_75');
      setShowAchievement(true);
      markFeatureAsDiscovered('achievement_trust_75');
    }

    if (Math.abs(userBalance) < 5 && userBalance !== 0 && !isFeatureDiscovered('achievement_balanced_reciprocidad')) {
      setAchievementType('balanced_reciprocidad');
      setShowAchievement(true);
      markFeatureAsDiscovered('achievement_balanced_reciprocidad');
    }
  }, [userTrustScore, userBalance, isFeatureDiscovered, markFeatureAsDiscovered]);

  const handleNextTip = () => {
    if (currentTip) {
      markFeatureAsDiscovered(`assistant_tip_${currentTip.id}`);
      onTipComplete?.(currentTip.id);
    }

    if (currentTipIndex < relevantTips.length - 1) {
      setCurrentTipIndex(prev => prev + 1);
    } else {
      setIsVisible(false);
      onDismiss?.();
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  const handleTipAction = () => {
    if (currentTip?.action) {
      currentTip.action();
    }
    handleNextTip();
  };

  // No mostrar si no hay tips relevantes
  if (!currentTip || !isVisible) {
    return null;
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      tip: 'info.main',
      achievement: 'success.main',
      warning: 'warning.main',
      encouragement: 'secondary.main',
    };
    return colors[category as keyof typeof colors] || 'primary.main';
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      tip: <TipIcon />,
      achievement: <StarIcon />,
      warning: <QuestionIcon />,
      encouragement: <HeartIcon />,
    };
    return icons[category as keyof typeof icons] || <TipIcon />;
  };

  return (
    <>
      {/* Achievement Notification */}
      {showAchievement && achievementType && (
        <Slide direction="up" in={showAchievement}>
          <Card
            sx={{
              position: 'fixed',
              top: 100,
              right: 20,
              width: 350,
              zIndex: 1300,
              background: 'linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)',
              border: '2px solid #ffa000',
              animation: 'pulse 2s infinite',
              '@keyframes pulse': {
                '0%': { transform: 'scale(1)' },
                '50%': { transform: 'scale(1.05)' },
                '100%': { transform: 'scale(1)' },
              },
            }}
          >
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
              <Typography variant="h3" sx={{ mb: 1 }}>
                {ACHIEVEMENT_MESSAGES[achievementType as keyof typeof ACHIEVEMENT_MESSAGES]?.emoji}
              </Typography>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                ¡Logro Desbloqueado!
              </Typography>
              <Typography variant="body2">
                {ACHIEVEMENT_MESSAGES[achievementType as keyof typeof ACHIEVEMENT_MESSAGES]?.message}
              </Typography>
              <Button
                size="small"
                onClick={() => setShowAchievement(false)}
                sx={{ mt: 2 }}
              >
                ¡Genial!
              </Button>
            </CardContent>
          </Card>
        </Slide>
      )}

      {/* Main Assistant */}
      <Fade in={isVisible}>
        <Paper
          sx={{
            position: 'fixed',
            bottom: 100,
            right: 20,
            width: 360,
            p: 2,
            background: 'linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)',
            border: '1px solid #e1bee7',
            borderRadius: 3,
            zIndex: 1200,
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          }}
        >
          {/* Header */}
          <Box display="flex" alignItems="center" gap={1} mb={2}>
            <Avatar 
              sx={{ 
                width: 40, 
                height: 40, 
                bgcolor: getCategoryColor(currentTip.category),
                fontSize: '20px',
              }}
            >
              {currentTip.emoji}
            </Avatar>
            <Box flex={1}>
              <Typography variant="subtitle2" fontWeight="bold">
                Asistente LETS
              </Typography>
              <Chip
                size="small"
                label={currentTip.category}
                icon={getCategoryIcon(currentTip.category)}
                sx={{ 
                  fontSize: '10px',
                  height: 20,
                  bgcolor: getCategoryColor(currentTip.category),
                  color: 'white',
                }}
              />
            </Box>
            <IconButton
              size="small"
              onClick={handleDismiss}
              sx={{ color: 'text.secondary' }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>

          {/* Message */}
          <Typography variant="body2" sx={{ mb: 2, lineHeight: 1.5 }}>
            {currentTip.message}
          </Typography>

          {/* Progress indicator */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="caption" color="text.secondary">
              Consejo {currentTipIndex + 1} de {relevantTips.length}
            </Typography>
            <Box
              sx={{
                width: '100%',
                height: 4,
                bgcolor: 'grey.200',
                borderRadius: 2,
                mt: 0.5,
              }}
            >
              <Box
                sx={{
                  width: `${((currentTipIndex + 1) / relevantTips.length) * 100}%`,
                  height: '100%',
                  bgcolor: getCategoryColor(currentTip.category),
                  borderRadius: 2,
                  transition: 'width 0.3s ease',
                }}
              />
            </Box>
          </Box>

          {/* Actions */}
          <Box display="flex" gap={1} justifyContent="flex-end">
            {currentTip.actionButton && (
              <Button
                size="small"
                variant="outlined"
                onClick={handleTipAction}
                sx={{ 
                  borderColor: getCategoryColor(currentTip.category),
                  color: getCategoryColor(currentTip.category),
                }}
              >
                {currentTip.actionButton}
              </Button>
            )}
            
            <Button
              size="small"
              variant="contained"
              onClick={handleNextTip}
              endIcon={currentTipIndex < relevantTips.length - 1 ? <NextIcon /> : null}
              sx={{ 
                bgcolor: getCategoryColor(currentTip.category),
                '&:hover': {
                  bgcolor: getCategoryColor(currentTip.category),
                  opacity: 0.9,
                }
              }}
            >
              {currentTipIndex < relevantTips.length - 1 ? 'Siguiente' : 'Entendido'}
            </Button>
          </Box>
        </Paper>
      </Fade>
    </>
  );
};

export default LetsAssistant; 