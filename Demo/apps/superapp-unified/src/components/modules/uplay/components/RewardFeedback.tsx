import React from 'react';
import {
  Box,
  Typography,
  Zoom,
  Fade,
  Chip,
} from '@mui/material';
import {
  CheckCircleIcon,
  CancelIcon,
  StarIcon,
  BoltIcon,
} from '@mui/icons-material';
import type { Achievement } from '../../../../hooks/interactive-video/useGamificationMetrics';

interface RewardFeedbackProps {
  show: boolean;
  isCorrect: boolean;
  reward?: {
    meritos: number;
    ondas: number;
    experienceGained?: number;
  };
  achievement?: Achievement;
  responseTime?: number;
  personalizedMessage?: string;
  onAnimationComplete?: () => void;
}

const RewardFeedback: React.FC<RewardFeedbackProps> = ({
  show,
  isCorrect,
  reward,
  achievement,
  responseTime,
  personalizedMessage,
  onAnimationComplete,
}) => {
  const getEmotionalResponse = () => {
    if (achievement) {
      return {
        emoji: achievement.icon,
        title: `¡${achievement.name}!`,
        subtitle: achievement.description,
        animation: 'celebration',
        backgroundColor: '#7c3aed',
        shadowColor: 'rgba(124, 58, 237, 0.4)',
      };
    }

    if (isCorrect) {
      if (responseTime && responseTime <= 5) {
        return {
          emoji: '⚡',
          title: '¡Increíble velocidad!',
          subtitle: 'Tu intuición Ayni está despertando',
          animation: 'lightning',
          backgroundColor: '#f59e0b',
          shadowColor: 'rgba(245, 158, 11, 0.4)',
        };
      }
      return {
        emoji: '✨',
        title: '¡Excelente!',
        subtitle: personalizedMessage || 'Estás en armonía con el conocimiento',
        animation: 'gentle-glow',
        backgroundColor: '#10b981',
        shadowColor: 'rgba(16, 185, 129, 0.4)',
      };
    }

    return {
      emoji: '🌱',
      title: 'Sigue creciendo',
      subtitle: personalizedMessage || 'Cada error es una oportunidad de aprender',
      animation: 'growth',
      backgroundColor: '#ef4444',
      shadowColor: 'rgba(239, 68, 68, 0.4)',
    };
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return '#6b7280';
      case 'rare': return '#3b82f6';
      case 'epic': return '#7c3aed';
      case 'legendary': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const response = getEmotionalResponse();

  if (!show) return null;

  return (
    <Zoom 
      in={show} 
      timeout={500}
      onExited={onAnimationComplete}
    >
      <Box
        sx={{
          position: 'absolute',
          bottom: '30%',
          left: '50%',
          transform: 'translate(-50%, 0)',
          zIndex: 25,
          minWidth: { xs: '280px', md: '350px' },
          maxWidth: { xs: '90%', md: '400px' },
        }}
      >
        <Box
          sx={{
            backgroundColor: response.backgroundColor,
            color: 'white',
            borderRadius: '24px',
            p: { xs: 2.5, md: 3 },
            textAlign: 'center',
            boxShadow: `0 8px 32px ${response.shadowColor}`,
            position: 'relative',
            overflow: 'hidden',
            '&::before': achievement ? {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
              animation: 'shimmer 2s ease-in-out infinite',
            } : {},
            '@keyframes shimmer': {
              '0%': { transform: 'translateX(-100%)' },
              '100%': { transform: 'translateX(100%)' },
            },
          }}
        >
          {/* Achievement badge for special achievements */}
          {achievement && (
            <Fade in={true} timeout={800}>
              <Box
                sx={{
                  position: 'absolute',
                  top: -10,
                  right: -10,
                  backgroundColor: getRarityColor(achievement.rarity),
                  borderRadius: '50%',
                  width: 40,
                  height: 40,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                }}
              >
                <StarIcon sx={{ fontSize: 20, color: 'white' }} />
              </Box>
            </Fade>
          )}

          {/* Main emoji/icon */}
          <Box
            sx={{
              fontSize: { xs: '48px', md: '56px' },
              mb: 1,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '60px',
            }}
          >
            {response.emoji === '⚡' ? (
              <BoltIcon 
                sx={{ 
                  fontSize: { xs: 48, md: 56 }, 
                  color: 'white',
                  filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.8))',
                  animation: 'pulse 1s ease-in-out infinite',
                  '@keyframes pulse': {
                    '0%': { transform: 'scale(1)' },
                    '50%': { transform: 'scale(1.1)' },
                    '100%': { transform: 'scale(1)' },
                  },
                }} 
              />
            ) : (
              <span style={{ 
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
                animation: response.animation === 'celebration' ? 'bounce 0.6s ease-in-out' : 'none',
              }}>
                {response.emoji}
              </span>
            )}
          </Box>

          {/* Title */}
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              fontSize: { xs: '18px', md: '20px' },
              mb: 1,
              textShadow: '0 1px 2px rgba(0,0,0,0.3)',
            }}
          >
            {response.title}
          </Typography>

          {/* Subtitle */}
          <Typography
            variant="body2"
            sx={{
              fontWeight: 500,
              fontSize: { xs: '14px', md: '15px' },
              mb: reward ? 2 : 0,
              opacity: 0.95,
              lineHeight: 1.4,
            }}
          >
            {response.subtitle}
          </Typography>

          {/* Reward details */}
          {reward && isCorrect && (
            <Fade in={true} timeout={1000}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: 1.5,
                  flexWrap: 'wrap',
                }}
              >
                {reward.meritos > 0 && (
                  <Chip
                    label={`+${reward.meritos} Mëritos`}
                    size="small"
                    sx={{
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      fontWeight: 600,
                      fontSize: '12px',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                    }}
                  />
                )}
                {reward.ondas > 0 && (
                  <Chip
                    label={`+${reward.ondas} Öndas`}
                    size="small"
                    sx={{
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      fontWeight: 600,
                      fontSize: '12px',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                    }}
                  />
                )}
                {reward.experienceGained && reward.experienceGained > 0 && (
                  <Chip
                    label={`+${reward.experienceGained} EXP`}
                    size="small"
                    sx={{
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      fontWeight: 600,
                      fontSize: '12px',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                    }}
                  />
                )}
              </Box>
            </Fade>
          )}

          {/* Speed bonus indicator */}
          {isCorrect && responseTime && responseTime <= 5 && (
            <Fade in={true} timeout={1200}>
              <Box
                sx={{
                  mt: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 0.5,
                }}
              >
                <BoltIcon sx={{ fontSize: 16, color: 'white' }} />
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 600,
                    fontSize: '11px',
                    opacity: 0.9,
                  }}
                >
                  Bonus de Velocidad Ayni
                </Typography>
              </Box>
            </Fade>
          )}
        </Box>
      </Box>
    </Zoom>
  );
};

export default RewardFeedback; 