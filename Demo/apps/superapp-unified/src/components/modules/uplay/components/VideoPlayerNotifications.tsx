import React, { useState, useEffect, useCallback } from 'react';
import {
  Snackbar,
  Alert,
  Box,
  Typography,
  IconButton,
  Slide,
  Zoom,
  Card,
  CardContent,
  Stack,
  Avatar,
  Chip,
  LinearProgress,
} from '@mui/material';
import {
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Star as StarIcon,
  Diamond as DiamondIcon,
  Bolt as BoltIcon,
  LocalFireDepartment as FireIcon,
  TrendingUp as TrendingUpIcon,
  EmojiEvents as TrophyIcon,
  School as SchoolIcon,
  Refresh as RefreshIcon,
} from '@mui/material/icons';

// Types
interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info' | 'achievement';
  title: string;
  message: string;
  duration?: number;
  autoHide?: boolean;
  action?: {
    label: string;
    callback: () => void;
  };
  reward?: {
    merits: number;
    ondas: number;
  };
  achievement?: {
    icon: string;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
  };
}

interface FloatingReward {
  id: string;
  type: 'merits' | 'ondas' | 'experience' | 'level';
  amount: number;
  position: { x: number; y: number };
  isVisible: boolean;
}

interface LevelUpAnimation {
  isVisible: boolean;
  newLevel: number;
  previousLevel: number;
}

interface VideoPlayerNotificationsProps {
  notifications: Notification[];
  onDismissNotification: (id: string) => void;
  onRewardAnimationComplete?: (rewardId: string) => void;
  levelUpData?: LevelUpAnimation;
  streakData?: {
    current: number;
    isNew: boolean;
  };
  position?: 'top' | 'bottom';
  maxNotifications?: number;
}

const VideoPlayerNotifications: React.FC<VideoPlayerNotificationsProps> = ({
  notifications,
  onDismissNotification,
  onRewardAnimationComplete,
  levelUpData,
  streakData,
  position = 'top',
  maxNotifications = 3,
}) => {
  const [activeNotifications, setActiveNotifications] = useState<
    Notification[]
  >([]);
  const [floatingRewards, setFloatingRewards] = useState<FloatingReward[]>([]);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [showStreak, setShowStreak] = useState(false);

  // Manage active notifications
  useEffect(() => {
    const latestNotifications = notifications.slice(-maxNotifications);
    setActiveNotifications(latestNotifications);

    // Auto-hide notifications with timeout
    latestNotifications.forEach((notification) => {
      if (notification.autoHide !== false) {
        const timeout = notification.duration || 4000;
        setTimeout(() => {
          onDismissNotification(notification.id);
        }, timeout);
      }
    });
  }, [notifications, maxNotifications, onDismissNotification]);

  // Handle level up animation
  useEffect(() => {
    if (levelUpData?.isVisible) {
      setShowLevelUp(true);
      setTimeout(() => {
        setShowLevelUp(false);
      }, 5000);
    }
  }, [levelUpData]);

  // Handle streak animation
  useEffect(() => {
    if (streakData?.isNew && streakData.current > 0) {
      setShowStreak(true);
      setTimeout(() => {
        setShowStreak(false);
      }, 3000);
    }
  }, [streakData]);

  // Create floating reward animation
  const createFloatingReward = useCallback(
    (
      type: 'merits' | 'ondas' | 'experience' | 'level',
      amount: number,
      startPosition?: { x: number; y: number }
    ) => {
      const id = `reward-${Date.now()}-${Math.random()}`;
      const position = startPosition || {
        x: Math.random() * 200 + 100,
        y: Math.random() * 100 + 100,
      };

      const newReward: FloatingReward = {
        id,
        type,
        amount,
        position,
        isVisible: true,
      };

      setFloatingRewards((prev) => [...prev, newReward]);

      // Remove after animation
      setTimeout(() => {
        setFloatingRewards((prev) => prev.filter((r) => r.id !== id));
        onRewardAnimationComplete?.(id);
      }, 2000);
    },
    [onRewardAnimationComplete]
  );

  // Auto-create floating rewards from notifications
  useEffect(() => {
    notifications.forEach((notification) => {
      if (notification.reward && notification.type === 'success') {
        if (notification.reward.merits > 0) {
          createFloatingReward('merits', notification.reward.merits);
        }
        if (notification.reward.ondas > 0) {
          createFloatingReward('ondas', notification.reward.ondas);
        }
      }
    });
  }, [notifications, createFloatingReward]);

  const getNotificationIcon = (notification: Notification) => {
    switch (notification.type) {
      case 'success':
        return <CheckCircleIcon />;
      case 'error':
        return <CancelIcon />;
      case 'achievement':
        return <TrophyIcon />;
      case 'warning':
        return <RefreshIcon />;
      default:
        return <StarIcon />;
    }
  };

  const getNotificationSeverity = (type: string) => {
    switch (type) {
      case 'achievement':
        return 'success';
      default:
        return type as 'success' | 'error' | 'warning' | 'info';
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary':
        return '#f59e0b';
      case 'epic':
        return '#8b5cf6';
      case 'rare':
        return '#3b82f6';
      default:
        return '#10b981';
    }
  };

  const getRewardIcon = (type: string) => {
    switch (type) {
      case 'merits':
        return <DiamondIcon sx={{ color: '#fbbf24' }} />;
      case 'ondas':
        return <BoltIcon sx={{ color: '#10b981' }} />;
      case 'experience':
        return <StarIcon sx={{ color: '#6366f1' }} />;
      case 'level':
        return <TrendingUpIcon sx={{ color: '#8b5cf6' }} />;
      default:
        return <StarIcon />;
    }
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        [position]: 20,
        right: 20,
        zIndex: 2000,
        maxWidth: 400,
        width: '100%',
        pointerEvents: 'none',
      }}
    >
      {/* Regular Notifications */}
      <Stack spacing={1}>
        {activeNotifications.map((notification, index) => (
          <Slide
            key={notification.id}
            direction="left"
            in={true}
            timeout={300 + index * 100}
          >
            <Box sx={{ pointerEvents: 'auto' }}>
              {notification.type === 'achievement' ? (
                <Card
                  sx={{
                    borderRadius: 3,
                    background: notification.achievement
                      ? `linear-gradient(135deg, ${getRarityColor(notification.achievement.rarity)}20, ${getRarityColor(notification.achievement.rarity)}40)`
                      : 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
                    border: `2px solid ${notification.achievement ? getRarityColor(notification.achievement.rarity) : '#10b981'}`,
                    boxShadow: `0 8px 32px ${notification.achievement ? getRarityColor(notification.achievement.rarity) : '#10b981'}40`,
                  }}
                >
                  <CardContent sx={{ p: 2 }}>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Avatar
                        sx={{
                          bgcolor: notification.achievement
                            ? getRarityColor(notification.achievement.rarity)
                            : '#10b981',
                          width: 48,
                          height: 48,
                          fontSize: '24px',
                        }}
                      >
                        {notification.achievement?.icon || '🏆'}
                      </Avatar>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: 700, mb: 0.5 }}
                        >
                          🎉 {notification.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {notification.message}
                        </Typography>
                        {notification.achievement && (
                          <Chip
                            label={notification.achievement.rarity.toUpperCase()}
                            size="small"
                            sx={{
                              mt: 1,
                              bgcolor: getRarityColor(
                                notification.achievement.rarity
                              ),
                              color: 'white',
                              fontWeight: 600,
                              fontSize: '10px',
                            }}
                          />
                        )}
                      </Box>
                      <IconButton
                        size="small"
                        onClick={() => onDismissNotification(notification.id)}
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </Stack>

                    {notification.reward && (
                      <Box
                        sx={{
                          mt: 2,
                          p: 1.5,
                          bgcolor: 'rgba(255,255,255,0.9)',
                          borderRadius: 2,
                          display: 'flex',
                          justifyContent: 'center',
                          gap: 2,
                        }}
                      >
                        {notification.reward.merits > 0 && (
                          <Chip
                            icon={<DiamondIcon />}
                            label={`+${notification.reward.merits} Mëritos`}
                            sx={{
                              bgcolor: '#fbbf24',
                              color: 'white',
                              fontWeight: 600,
                            }}
                          />
                        )}
                        {notification.reward.ondas > 0 && (
                          <Chip
                            icon={<BoltIcon />}
                            label={`+${notification.reward.ondas} Öndas`}
                            sx={{
                              bgcolor: '#10b981',
                              color: 'white',
                              fontWeight: 600,
                            }}
                          />
                        )}
                      </Box>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <Snackbar
                  open={true}
                  anchorOrigin={{ vertical: position, horizontal: 'right' }}
                  sx={{ position: 'static', transform: 'none' }}
                >
                  <Alert
                    severity={getNotificationSeverity(notification.type)}
                    icon={getNotificationIcon(notification)}
                    action={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {notification.action && (
                          <IconButton
                            color="inherit"
                            size="small"
                            onClick={notification.action.callback}
                            sx={{ mr: 1 }}
                          >
                            <RefreshIcon fontSize="small" />
                          </IconButton>
                        )}
                        <IconButton
                          color="inherit"
                          size="small"
                          onClick={() => onDismissNotification(notification.id)}
                        >
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    }
                    sx={{
                      minWidth: 300,
                      fontSize: '14px',
                      fontWeight: 500,
                      '& .MuiAlert-icon': {
                        fontSize: '20px',
                      },
                    }}
                  >
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {notification.title}
                      </Typography>
                      <Typography variant="body2">
                        {notification.message}
                      </Typography>
                    </Box>
                  </Alert>
                </Snackbar>
              )}
            </Box>
          </Slide>
        ))}
      </Stack>

      {/* Level Up Animation */}
      {levelUpData && (
        <Zoom in={showLevelUp} timeout={500}>
          <Card
            sx={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 2100,
              borderRadius: 4,
              background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
              color: 'white',
              minWidth: 320,
              textAlign: 'center',
              boxShadow: '0 20px 64px rgba(139, 92, 246, 0.5)',
              pointerEvents: 'auto',
              animation: 'levelUpPulse 2s infinite',
              '@keyframes levelUpPulse': {
                '0%': { transform: 'translate(-50%, -50%) scale(1)' },
                '50%': { transform: 'translate(-50%, -50%) scale(1.05)' },
                '100%': { transform: 'translate(-50%, -50%) scale(1)' },
              },
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h3" sx={{ mb: 2, fontSize: '48px' }}>
                🎉
              </Typography>
              <Typography
                variant="h4"
                sx={{ fontWeight: 800, mb: 1, fontSize: '28px' }}
              >
                ¡NIVEL SUPERIOR!
              </Typography>
              <Typography variant="h5" sx={{ mb: 2, opacity: 0.9 }}>
                Has alcanzado el Nivel {levelUpData.newLevel}
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 2,
                  mb: 3,
                }}
              >
                <Box
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.2)',
                    borderRadius: '50%',
                    width: 60,
                    height: 60,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px',
                    fontWeight: 800,
                  }}
                >
                  {levelUpData.previousLevel}
                </Box>
                <TrendingUpIcon sx={{ fontSize: 32 }} />
                <Box
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.3)',
                    borderRadius: '50%',
                    width: 60,
                    height: 60,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px',
                    fontWeight: 800,
                    border: '3px solid rgba(255,255,255,0.5)',
                  }}
                >
                  {levelUpData.newLevel}
                </Box>
              </Box>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                Tu dedicación al aprendizaje de CoomÜnity te ha llevado a un
                nuevo nivel de sabiduría.
              </Typography>
            </CardContent>
          </Card>
        </Zoom>
      )}

      {/* Streak Animation */}
      {streakData && (
        <Zoom in={showStreak} timeout={300}>
          <Card
            sx={{
              position: 'fixed',
              top: '25%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 2050,
              borderRadius: 3,
              background: 'linear-gradient(135deg, #ef4444 0%, #f97316 100%)',
              color: 'white',
              textAlign: 'center',
              boxShadow: '0 12px 40px rgba(239, 68, 68, 0.4)',
              pointerEvents: 'auto',
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h2" sx={{ mb: 1 }}>
                🔥
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
                ¡RACHA ACTIVA!
              </Typography>
              <Typography variant="h6" sx={{ mb: 1 }}>
                {streakData.current} respuestas consecutivas
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                ¡Sigues en llamas! Mantén el momentum.
              </Typography>
            </CardContent>
          </Card>
        </Zoom>
      )}

      {/* Floating Rewards */}
      {floatingRewards.map((reward) => (
        <Zoom key={reward.id} in={reward.isVisible} timeout={200}>
          <Box
            sx={{
              position: 'fixed',
              left: reward.position.x,
              top: reward.position.y,
              zIndex: 2025,
              pointerEvents: 'none',
              animation: 'floatUp 2s ease-out forwards',
              '@keyframes floatUp': {
                '0%': {
                  transform: 'translateY(0) scale(1)',
                  opacity: 1,
                },
                '50%': {
                  transform: 'translateY(-30px) scale(1.2)',
                  opacity: 1,
                },
                '100%': {
                  transform: 'translateY(-60px) scale(0.8)',
                  opacity: 0,
                },
              },
            }}
          >
            <Chip
              icon={getRewardIcon(reward.type)}
              label={`+${reward.amount}`}
              sx={{
                bgcolor:
                  reward.type === 'merits'
                    ? '#fbbf24'
                    : reward.type === 'ondas'
                      ? '#10b981'
                      : '#6366f1',
                color: 'white',
                fontWeight: 700,
                fontSize: '14px',
                height: 32,
                '& .MuiChip-icon': {
                  fontSize: '18px',
                },
                boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
              }}
            />
          </Box>
        </Zoom>
      ))}
    </Box>
  );
};

export default VideoPlayerNotifications;
