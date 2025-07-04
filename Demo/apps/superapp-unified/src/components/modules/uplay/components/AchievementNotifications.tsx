import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  Typography,
  IconButton,
  Slide,
  Zoom,
  Fade,
  useTheme,
  alpha,
  Chip,
  LinearProgress,
} from '@mui/material';
import {
  Close as CloseIcon,
  Star as StarIcon,
  EmojiEvents as TrophyIcon,
  Celebration as CelebrationIcon,
  AutoAwesome as SparkleIcon,
} from '@mui/icons-material';
import { Achievement } from '../../../../types/video-player.schemas';

// ============================================================================
// TIPOS Y INTERFACES
// ============================================================================

interface AchievementNotification {
  id: string;
  achievement: Achievement;
  timestamp: Date;
  isVisible: boolean;
  celebrationLevel: 'normal' | 'epic' | 'legendary';
}

interface AchievementNotificationsProps {
  notifications: AchievementNotification[];
  onDismiss: (notificationId: string) => void;
  onClearAll: () => void;
  enableAnimations?: boolean;
  enableSounds?: boolean;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'center';
}

interface NotificationCardProps {
  notification: AchievementNotification;
  onDismiss: (id: string) => void;
  enableAnimations: boolean;
  index: number;
}

// ============================================================================
// CONSTANTES Y CONFIGURACIÓN
// ============================================================================

const NOTIFICATION_CONFIG = {
  ANIMATION_DURATION: 500,
  CELEBRATION_DURATION: 3000,
  STAGGER_DELAY: 100,
  MAX_WIDTH: 400,
  SPACING: 16,
} as const;

const RARITY_COLORS = {
  common: {
    primary: '#64748b',
    secondary: '#cbd5e1',
    background: '#f1f5f9',
    glow: '#64748b',
  },
  rare: {
    primary: '#2563eb',
    secondary: '#60a5fa',
    background: '#e0e7ef',
    glow: '#2563eb',
  },
  epic: {
    primary: '#7e22ce',
    secondary: '#a78bfa',
    background: '#ede9fe',
    glow: '#7e22ce',
  },
  legendary: {
    primary: '#bfae60',
    secondary: '#e5e4e2',
    background: '#f5f6fa',
    glow: '#bfae60',
  },
} as const;

const CATEGORY_ICONS = {
  learning: '🧠',
  reciprocidad: '⚖️',
  bien_comun: '🤝',
  engagement: '🔥',
  social: '💡',
  achievement: '🏆',
} as const;

// ============================================================================
// COMPONENTES DE UTILIDAD
// ============================================================================

const CelebrationEffect: React.FC<{
  level: 'normal' | 'epic' | 'legendary';
  isActive: boolean;
}> = ({ level, isActive }) => {
  const theme = useTheme();

  if (!isActive) return null;

  const getParticleCount = () => {
    switch (level) {
      case 'legendary': return 50;
      case 'epic': return 30;
      default: return 15;
    }
  };

  const getAnimationDuration = () => {
    switch (level) {
      case 'legendary': return '2s';
      case 'epic': return '1.5s';
      default: return '1s';
    }
  };

  const getParticleColor = () => {
    switch (level) {
      case 'legendary': return '#e5e4e2';
      case 'epic': return '#7e22ce';
      default: return '#2563eb';
    }
  };

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
        borderRadius: 2,
      }}
    >
      {Array.from({ length: getParticleCount() }).map((_, index) => (
        <Box
          key={index}
          sx={{
            position: 'absolute',
            width: level === 'legendary' ? 8 : level === 'epic' ? 6 : 4,
            height: level === 'legendary' ? 8 : level === 'epic' ? 6 : 4,
            backgroundColor: getParticleColor(),
            borderRadius: '50%',
            animation: `celebration-particle-${level} ${getAnimationDuration()} ease-out forwards`,
            animationDelay: `${Math.random() * 0.5}s`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            '@keyframes celebration-particle-normal': {
              '0%': {
                transform: 'scale(0) rotate(0deg)',
                opacity: 1,
              },
              '50%': {
                transform: 'scale(1) rotate(180deg)',
                opacity: 0.8,
              },
              '100%': {
                transform: 'scale(0) rotate(360deg)',
                opacity: 0,
              },
            },
            '@keyframes celebration-particle-epic': {
              '0%': {
                transform: 'scale(0) rotate(0deg) translateY(0px)',
                opacity: 1,
              },
              '50%': {
                transform: 'scale(1.2) rotate(180deg) translateY(-20px)',
                opacity: 0.9,
              },
              '100%': {
                transform: 'scale(0) rotate(360deg) translateY(-40px)',
                opacity: 0,
              },
            },
            '@keyframes celebration-particle-legendary': {
              '0%': {
                transform: 'scale(0) rotate(0deg) translateY(0px)',
                opacity: 1,
                boxShadow: '0 0 0 rgba(255, 215, 0, 0)',
              },
              '25%': {
                transform: 'scale(1.5) rotate(90deg) translateY(-10px)',
                opacity: 1,
                boxShadow: '0 0 20px rgba(255, 215, 0, 0.8)',
              },
              '50%': {
                transform: 'scale(1.2) rotate(180deg) translateY(-30px)',
                opacity: 0.9,
                boxShadow: '0 0 15px rgba(255, 215, 0, 0.6)',
              },
              '100%': {
                transform: 'scale(0) rotate(360deg) translateY(-60px)',
                opacity: 0,
                boxShadow: '0 0 0 rgba(255, 215, 0, 0)',
              },
            },
          }}
        />
      ))}
    </Box>
  );
};

const RarityBadge: React.FC<{ rarity: Achievement['rarity'] }> = ({ rarity }) => {
  const colors = RARITY_COLORS[rarity];

  const getRarityIcon = () => {
    switch (rarity) {
      case 'legendary': return <SparkleIcon sx={{ fontSize: 16 }} />;
      case 'epic': return <TrophyIcon sx={{ fontSize: 16 }} />;
      case 'rare': return <StarIcon sx={{ fontSize: 16 }} />;
      default: return null;
    }
  };

  return (
    <Chip
      icon={getRarityIcon() || undefined}
      label={rarity.toUpperCase()}
      size="small"
      sx={{
        backgroundColor: colors.primary,
        color: 'white',
        fontWeight: 'bold',
        fontSize: '0.7rem',
        height: 24,
        '& .MuiChip-icon': {
          color: 'white',
        },
      }}
    />
  );
};

const ProgressBar: React.FC<{
  progress: number;
  rarity: Achievement['rarity'];
  animated?: boolean;
}> = ({ progress, rarity, animated = true }) => {
  const colors = RARITY_COLORS[rarity];
  const [animatedProgress, setAnimatedProgress] = useState(0);

  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => {
        setAnimatedProgress(progress);
      }, 200);
      return () => clearTimeout(timer);
    } else {
      setAnimatedProgress(progress);
    }
  }, [progress, animated]);

  return (
    <Box sx={{ width: '100%', mt: 1 }}>
      <LinearProgress
        variant="determinate"
        value={animatedProgress}
        sx={{
          height: 6,
          borderRadius: 3,
          backgroundColor: alpha(colors.primary, 0.2),
          '& .MuiLinearProgress-bar': {
            backgroundColor: colors.primary,
            borderRadius: 3,
            transition: 'transform 1s ease-in-out',
          },
        }}
      />
      <Typography
        variant="caption"
        sx={{
          color: colors.primary,
          fontWeight: 'bold',
          fontSize: '0.7rem',
          mt: 0.5,
          display: 'block',
        }}
      >
        {Math.round(animatedProgress)}% Completado
      </Typography>
    </Box>
  );
};

// ============================================================================
// COMPONENTE DE TARJETA DE NOTIFICACIÓN
// ============================================================================

const NotificationCard: React.FC<NotificationCardProps> = ({
  notification,
  onDismiss,
  enableAnimations,
  index,
}) => {
  const theme = useTheme();
  const { achievement, celebrationLevel, id } = notification;
  const colors = RARITY_COLORS[achievement.rarity];
  const [showCelebration, setShowCelebration] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Stagger animation
    const timer = setTimeout(() => {
      setIsVisible(true);
      if (celebrationLevel !== 'normal') {
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), NOTIFICATION_CONFIG.CELEBRATION_DURATION);
      }
    }, index * NOTIFICATION_CONFIG.STAGGER_DELAY);

    return () => clearTimeout(timer);
  }, [index, celebrationLevel]);

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(() => onDismiss(id), NOTIFICATION_CONFIG.ANIMATION_DURATION);
  };

  const categoryIcon = CATEGORY_ICONS[achievement.category] || '🏆';

  return (
    <Slide
      direction="left"
      in={isVisible}
      timeout={NOTIFICATION_CONFIG.ANIMATION_DURATION}
      style={{ transitionDelay: enableAnimations ? `${index * 100}ms` : '0ms' }}
    >
      <Card
        sx={{
          position: 'relative',
          maxWidth: NOTIFICATION_CONFIG.MAX_WIDTH,
          mb: NOTIFICATION_CONFIG.SPACING / 8,
          overflow: 'visible',
          background: `linear-gradient(135deg, ${colors.background} 0%, ${alpha(colors.secondary, 0.1)} 100%)`,
          border: `2px solid ${colors.primary}`,
          borderRadius: 3,
          boxShadow: celebrationLevel === 'legendary'
            ? `0 8px 32px ${alpha(colors.glow, 0.4)}, 0 0 20px ${alpha(colors.glow, 0.3)}`
            : celebrationLevel === 'epic'
              ? `0 6px 24px ${alpha(colors.glow, 0.3)}, 0 0 15px ${alpha(colors.glow, 0.2)}`
              : `0 4px 16px ${alpha(colors.glow, 0.2)}`,
          transform: celebrationLevel === 'legendary' ? 'scale(1.05)' : 'scale(1)',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: celebrationLevel === 'legendary' ? 'scale(1.08)' : 'scale(1.02)',
            boxShadow: `0 8px 32px ${alpha(colors.glow, 0.4)}`,
          },
        }}
      >
        {/* Efecto de celebración */}
        <CelebrationEffect level={celebrationLevel} isActive={showCelebration} />

        {/* Contenido principal */}
        <Box sx={{ p: 2, position: 'relative', zIndex: 1 }}>
          {/* Header */}
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
              <Typography sx={{ fontSize: '1.5rem' }}>
                {categoryIcon}
              </Typography>
              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 'bold',
                    color: colors.primary,
                    fontSize: '1rem',
                    lineHeight: 1.2,
                  }}
                >
                  ¡Logro Desbloqueado!
                </Typography>
                <RarityBadge rarity={achievement.rarity} />
              </Box>
            </Box>

            <IconButton
              size="small"
              onClick={handleDismiss}
              sx={{
                color: colors.primary,
                '&:hover': {
                  backgroundColor: alpha(colors.primary, 0.1),
                },
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>

          {/* Título del logro */}
          <Typography
            variant="h5"
            sx={{
              fontWeight: 'bold',
              color: theme.palette.text.primary,
              mb: 0.5,
              fontSize: '1.1rem',
            }}
          >
            {achievement.name}
          </Typography>

          {/* Descripción */}
          <Typography
            variant="body2"
            sx={{
              color: theme.palette.text.secondary,
              mb: 1.5,
              lineHeight: 1.4,
            }}
          >
            {achievement.description}
          </Typography>

          {/* Recompensas */}
          <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
            <Chip
              label={`${achievement.points} Mëritos`}
              size="small"
              sx={{
                backgroundColor: alpha(colors.primary, 0.1),
                color: colors.primary,
                fontWeight: 'bold',
              }}
            />
            <Chip
              label={`${achievement.ondas} Öndas`}
              size="small"
              sx={{
                backgroundColor: alpha(colors.secondary, 0.1),
                color: colors.secondary,
                fontWeight: 'bold',
              }}
            />
          </Box>

          {/* Barra de progreso (siempre 100% para logros desbloqueados) */}
          <ProgressBar
            progress={100}
            rarity={achievement.rarity}
            animated={enableAnimations}
          />

          {/* Timestamp */}
          <Typography
            variant="caption"
            sx={{
              color: theme.palette.text.disabled,
              fontSize: '0.7rem',
              mt: 1,
              display: 'block',
            }}
          >
            {notification.timestamp.toLocaleTimeString()}
          </Typography>
        </Box>

        {/* Glow effect para legendary */}
        {celebrationLevel === 'legendary' && (
          <Box
            sx={{
              position: 'absolute',
              top: -2,
              left: -2,
              right: -2,
              bottom: -2,
              background: `linear-gradient(45deg, ${colors.glow}, transparent, ${colors.glow})`,
              borderRadius: 3,
              zIndex: -1,
              animation: 'legendary-glow 2s ease-in-out infinite alternate',
              '@keyframes legendary-glow': {
                '0%': { opacity: 0.3 },
                '100%': { opacity: 0.7 },
              },
            }}
          />
        )}
      </Card>
    </Slide>
  );
};

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

const AchievementNotifications: React.FC<AchievementNotificationsProps> = ({
  notifications,
  onDismiss,
  onClearAll,
  enableAnimations = true,
  enableSounds = true,
  position = 'top-right',
}) => {
  const theme = useTheme();

  // Reproducir sonido de logro (si está habilitado)
  useEffect(() => {
    if (enableSounds && notifications.length > 0) {
      const latestNotification = notifications[notifications.length - 1];
      if (latestNotification.isVisible) {
        // Aquí se podría reproducir un sonido basado en el nivel de celebración
        // playAchievementSound(latestNotification.celebrationLevel);
      }
    }
  }, [notifications, enableSounds]);

  const getPositionStyles = () => {
    const baseStyles = {
      position: 'fixed' as const,
      zIndex: theme.zIndex.snackbar + 1,
      pointerEvents: 'none' as const,
    };

    switch (position) {
      case 'top-right':
        return { ...baseStyles, top: 24, right: 24 };
      case 'top-left':
        return { ...baseStyles, top: 24, left: 24 };
      case 'bottom-right':
        return { ...baseStyles, bottom: 24, right: 24 };
      case 'bottom-left':
        return { ...baseStyles, bottom: 24, left: 24 };
      case 'center':
        return {
          ...baseStyles,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        };
      default:
        return { ...baseStyles, top: 24, right: 24 };
    }
  };

  if (notifications.length === 0) {
    return null;
  }

  return (
    <Box sx={getPositionStyles()}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          maxHeight: '80vh',
          overflowY: 'auto',
          pointerEvents: 'auto',
          '&::-webkit-scrollbar': {
            width: 6,
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: alpha(theme.palette.background.paper, 0.1),
            borderRadius: 3,
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: alpha(theme.palette.primary.main, 0.3),
            borderRadius: 3,
            '&:hover': {
              backgroundColor: alpha(theme.palette.primary.main, 0.5),
            },
          },
        }}
      >
        {notifications
          .filter(notification => notification.isVisible)
          .map((notification, index) => (
            <NotificationCard
              key={notification.id}
              notification={notification}
              onDismiss={onDismiss}
              enableAnimations={enableAnimations}
              index={index}
            />
          ))}

        {/* Botón para limpiar todas las notificaciones */}
        {notifications.length > 2 && (
          <Fade in timeout={500}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
              <Chip
                label="Limpiar Todo"
                onClick={onClearAll}
                onDelete={onClearAll}
                deleteIcon={<CloseIcon />}
                size="small"
                sx={{
                  backgroundColor: alpha(theme.palette.background.paper, 0.9),
                  backdropFilter: 'blur(10px)',
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.background.paper, 1),
                  },
                }}
              />
            </Box>
          </Fade>
        )}
      </Box>
    </Box>
  );
};

export default AchievementNotifications;
