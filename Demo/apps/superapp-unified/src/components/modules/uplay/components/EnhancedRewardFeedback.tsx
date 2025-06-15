import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Fade,
  Slide,
  Zoom,
  Chip,
  Avatar,
  IconButton,
  Snackbar,
  Alert,
  LinearProgress,
  Divider,
} from '@mui/material';
import {
  Diamond,
  Bolt,
  Star,
  EmojiEvents,
  Whatshot,
  Close,
  TrendingUp,
  Celebration,
  AutoAwesome,
} from '@mui/icons-material';
import { keyframes } from '@mui/system';
import { useUPlayStore } from '../../../../stores/uplayStore';

// ============================================================================
// ANIMACIONES Y ESTILOS
// ============================================================================

const pulseAnimation = keyframes`
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.8;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`;

const sparkleAnimation = keyframes`
  0% {
    transform: rotate(0deg) scale(0);
    opacity: 0;
  }
  50% {
    transform: rotate(180deg) scale(1);
    opacity: 1;
  }
  100% {
    transform: rotate(360deg) scale(0);
    opacity: 0;
  }
`;

const slideUpAnimation = keyframes`
  0% {
    transform: translateY(100px);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
`;

const bounceAnimation = keyframes`
  0%, 20%, 53%, 80%, 100% {
    transform: translate3d(0,0,0);
  }
  40%, 43% {
    transform: translate3d(0, -30px, 0);
  }
  70% {
    transform: translate3d(0, -15px, 0);
  }
  90% {
    transform: translate3d(0, -4px, 0);
  }
`;

// ============================================================================
// INTERFACES
// ============================================================================

interface RewardData {
  meritos: number;
  ondas: number;
  experience?: number;
  level?: number;
  achievement?: {
    id: string;
    title: string;
    icon: string;
    description: string;
  };
  streak?: number;
  bonus?: {
    type: 'speed' | 'precision' | 'streak' | 'level';
    multiplier: number;
    description: string;
  };
}

interface RewardFeedbackProps {
  reward: RewardData;
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
  position?: 'top' | 'center' | 'bottom';
  variant?: 'compact' | 'detailed' | 'celebration';
}

interface FloatingNumberProps {
  value: number;
  type: 'meritos' | 'ondas' | 'experience';
  position: { x: number; y: number };
  onComplete: () => void;
}

// ============================================================================
// COMPONENTES AUXILIARES
// ============================================================================

const FloatingNumber: React.FC<FloatingNumberProps> = ({
  value,
  type,
  position,
  onComplete,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 300);
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  const getIcon = () => {
    switch (type) {
      case 'meritos':
        return <Diamond sx={{ color: '#9c27b0', fontSize: 16 }} />;
      case 'ondas':
        return <Bolt sx={{ color: '#ff9800', fontSize: 16 }} />;
      case 'experience':
        return <Star sx={{ color: '#2196f3', fontSize: 16 }} />;
      default:
        return null;
    }
  };

  const getColor = () => {
    switch (type) {
      case 'meritos':
        return '#9c27b0';
      case 'ondas':
        return '#ff9800';
      case 'experience':
        return '#2196f3';
      default:
        return '#000';
    }
  };

  return (
    <Fade in={isVisible} timeout={300}>
      <Box
        sx={{
          position: 'fixed',
          left: position.x,
          top: position.y,
          zIndex: 9999,
          pointerEvents: 'none',
          animation: `${slideUpAnimation} 2s ease-out`,
        }}
      >
        <Box
          display="flex"
          alignItems="center"
          gap={0.5}
          sx={{
            background: `linear-gradient(135deg, ${getColor()}20, ${getColor()}10)`,
            border: `2px solid ${getColor()}`,
            borderRadius: 2,
            px: 1.5,
            py: 0.5,
            backdropFilter: 'blur(10px)',
            boxShadow: `0 4px 20px ${getColor()}40`,
          }}
        >
          {getIcon()}
          <Typography
            variant="body2"
            fontWeight="bold"
            sx={{ color: getColor() }}
          >
            +{value}
          </Typography>
        </Box>
      </Box>
    </Fade>
  );
};

const SparkleEffect: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  const sparkles = Array.from({ length: 8 }, (_, i) => i);

  if (!isActive) return null;

  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      {sparkles.map((i) => (
        <Box
          key={i}
          sx={{
            position: 'absolute',
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            width: 8,
            height: 8,
            background: '#ffd700',
            borderRadius: '50%',
            animation: `${sparkleAnimation} 1.5s ease-in-out infinite`,
            animationDelay: `${i * 0.2}s`,
          }}
        />
      ))}
    </Box>
  );
};

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

export const EnhancedRewardFeedback: React.FC<RewardFeedbackProps> = ({
  reward,
  isVisible,
  onClose,
  duration = 4000,
  position = 'center',
  variant = 'detailed',
}) => {
  const [showSparkles, setShowSparkles] = useState(false);
  const [floatingNumbers, setFloatingNumbers] = useState<Array<{
    id: string;
    value: number;
    type: 'meritos' | 'ondas' | 'experience';
    position: { x: number; y: number };
  }>>([]);

  const { playerMetrics } = useUPlayStore();

  // Auto-close timer
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  // Sparkle effect for achievements
  useEffect(() => {
    if (isVisible && reward.achievement) {
      setShowSparkles(true);
      const timer = setTimeout(() => setShowSparkles(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, reward.achievement]);

  // Floating numbers effect
  useEffect(() => {
    if (isVisible && variant === 'celebration') {
      const numbers = [];
      
      if (reward.meritos > 0) {
        numbers.push({
          id: 'meritos',
          value: reward.meritos,
          type: 'meritos' as const,
          position: { x: window.innerWidth / 2 - 50, y: window.innerHeight / 2 },
        });
      }
      
      if (reward.ondas > 0) {
        numbers.push({
          id: 'ondas',
          value: reward.ondas,
          type: 'ondas' as const,
          position: { x: window.innerWidth / 2 + 50, y: window.innerHeight / 2 },
        });
      }
      
      if (reward.experience && reward.experience > 0) {
        numbers.push({
          id: 'experience',
          value: reward.experience,
          type: 'experience' as const,
          position: { x: window.innerWidth / 2, y: window.innerHeight / 2 - 50 },
        });
      }
      
      setFloatingNumbers(numbers);
    }
  }, [isVisible, variant, reward]);

  const removeFloatingNumber = useCallback((id: string) => {
    setFloatingNumbers(prev => prev.filter(num => num.id !== id));
  }, []);

  const getPositionStyles = () => {
    switch (position) {
      case 'top':
        return { top: 20, left: '50%', transform: 'translateX(-50%)' };
      case 'bottom':
        return { bottom: 20, left: '50%', transform: 'translateX(-50%)' };
      case 'center':
      default:
        return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
    }
  };

  const renderCompactVariant = () => (
    <Snackbar
      open={isVisible}
      autoHideDuration={duration}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert
        onClose={onClose}
        severity="success"
        variant="filled"
        sx={{
          background: 'linear-gradient(135deg, #4caf50, #2e7d32)',
          '& .MuiAlert-icon': {
            color: '#fff',
          },
        }}
        icon={<EmojiEvents />}
      >
        <Box display="flex" alignItems="center" gap={1}>
          {reward.meritos > 0 && (
            <Chip
              size="small"
              icon={<Diamond />}
              label={`+${reward.meritos}`}
              sx={{ bgcolor: '#9c27b0', color: 'white' }}
            />
          )}
          {reward.ondas > 0 && (
            <Chip
              size="small"
              icon={<Bolt />}
              label={`+${reward.ondas}`}
              sx={{ bgcolor: '#ff9800', color: 'white' }}
            />
          )}
          <Typography variant="body2" color="white">
            ¡Recompensa obtenida!
          </Typography>
        </Box>
      </Alert>
    </Snackbar>
  );

  const renderDetailedVariant = () => (
    <Fade in={isVisible} timeout={500}>
      <Box
        sx={{
          position: 'fixed',
          zIndex: 9999,
          ...getPositionStyles(),
        }}
      >
        <Zoom in={isVisible} timeout={300}>
          <Card
            sx={{
              minWidth: 320,
              maxWidth: 400,
              background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
              border: '2px solid #4caf50',
              borderRadius: 3,
              boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
              position: 'relative',
              overflow: 'visible',
              animation: reward.achievement ? `${bounceAnimation} 1s ease-out` : 'none',
            }}
          >
            <SparkleEffect isActive={showSparkles} />
            
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                <Box display="flex" alignItems="center" gap={1}>
                  <Avatar
                    sx={{
                      bgcolor: reward.achievement ? '#ffd700' : '#4caf50',
                      animation: `${pulseAnimation} 2s infinite`,
                    }}
                  >
                    {reward.achievement ? (
                      <EmojiEvents />
                    ) : reward.streak ? (
                      <Whatshot />
                    ) : (
                      <AutoAwesome />
                    )}
                  </Avatar>
                  <Typography variant="h6" color="white" fontWeight="bold">
                    {reward.achievement ? '¡Logro Desbloqueado!' : '¡Recompensa!'}
                  </Typography>
                </Box>
                
                <IconButton size="small" onClick={onClose} sx={{ color: 'white' }}>
                  <Close />
                </IconButton>
              </Box>

              {reward.achievement && (
                <Box mb={2}>
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <Typography variant="h5">{reward.achievement.icon}</Typography>
                    <Typography variant="h6" color="#ffd700" fontWeight="bold">
                      {reward.achievement.title}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {reward.achievement.description}
                  </Typography>
                </Box>
              )}

              <Divider sx={{ my: 2, borderColor: '#444' }} />

              <Box display="flex" justifyContent="space-around" mb={2}>
                {reward.meritos > 0 && (
                  <Box textAlign="center">
                    <Box display="flex" alignItems="center" justifyContent="center" gap={0.5} mb={0.5}>
                      <Diamond sx={{ color: '#9c27b0', fontSize: 20 }} />
                      <Typography variant="h5" color="#9c27b0" fontWeight="bold">
                        +{reward.meritos}
                      </Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      Mëritos
                    </Typography>
                  </Box>
                )}

                {reward.ondas > 0 && (
                  <Box textAlign="center">
                    <Box display="flex" alignItems="center" justifyContent="center" gap={0.5} mb={0.5}>
                      <Bolt sx={{ color: '#ff9800', fontSize: 20 }} />
                      <Typography variant="h5" color="#ff9800" fontWeight="bold">
                        +{reward.ondas}
                      </Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      Öndas
                    </Typography>
                  </Box>
                )}

                {reward.experience && reward.experience > 0 && (
                  <Box textAlign="center">
                    <Box display="flex" alignItems="center" justifyContent="center" gap={0.5} mb={0.5}>
                      <Star sx={{ color: '#2196f3', fontSize: 20 }} />
                      <Typography variant="h5" color="#2196f3" fontWeight="bold">
                        +{reward.experience}
                      </Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      XP
                    </Typography>
                  </Box>
                )}
              </Box>

              {reward.bonus && (
                <Box mb={2}>
                  <Chip
                    icon={<TrendingUp />}
                    label={`Bonus ${reward.bonus.type}: x${reward.bonus.multiplier}`}
                    color="warning"
                    variant="outlined"
                    size="small"
                    sx={{ mb: 1 }}
                  />
                  <Typography variant="caption" color="text.secondary" display="block">
                    {reward.bonus.description}
                  </Typography>
                </Box>
              )}

              {reward.streak && reward.streak > 1 && (
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <Whatshot sx={{ color: '#f44336' }} />
                  <Typography variant="body2" color="#f44336" fontWeight="bold">
                    ¡Racha de {reward.streak}!
                  </Typography>
                </Box>
              )}

              {reward.level && (
                <Box>
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <Celebration sx={{ color: '#ffd700' }} />
                    <Typography variant="body1" color="#ffd700" fontWeight="bold">
                      ¡Nivel {reward.level} alcanzado!
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={100}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      bgcolor: '#333',
                      '& .MuiLinearProgress-bar': {
                        bgcolor: '#ffd700',
                        animation: `${pulseAnimation} 1s ease-in-out`,
                      },
                    }}
                  />
                </Box>
              )}
            </CardContent>
          </Card>
        </Zoom>
      </Box>
    </Fade>
  );

  const renderCelebrationVariant = () => (
    <>
      {renderDetailedVariant()}
      {floatingNumbers.map((num) => (
        <FloatingNumber
          key={num.id}
          value={num.value}
          type={num.type}
          position={num.position}
          onComplete={() => removeFloatingNumber(num.id)}
        />
      ))}
    </>
  );

  if (!isVisible) return null;

  switch (variant) {
    case 'compact':
      return renderCompactVariant();
    case 'celebration':
      return renderCelebrationVariant();
    case 'detailed':
    default:
      return renderDetailedVariant();
  }
};

// ============================================================================
// HOOK PARA USO SIMPLIFICADO
// ============================================================================

export const useRewardFeedback = () => {
  const [currentReward, setCurrentReward] = useState<RewardData | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const showReward = useCallback((reward: RewardData, variant: 'compact' | 'detailed' | 'celebration' = 'detailed') => {
    setCurrentReward({ ...reward });
    setIsVisible(true);
  }, []);

  const hideReward = useCallback(() => {
    setIsVisible(false);
    setTimeout(() => setCurrentReward(null), 300);
  }, []);

  const RewardComponent = currentReward ? (
    <EnhancedRewardFeedback
      reward={currentReward}
      isVisible={isVisible}
      onClose={hideReward}
    />
  ) : null;

  return {
    showReward,
    hideReward,
    RewardComponent,
    isVisible,
  };
};

export default EnhancedRewardFeedback; 