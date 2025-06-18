import React from 'react';
import {
  Box,
  LinearProgress,
  Typography,
  Chip,
  Stack,
  Card,
  CardContent,
} from '@mui/material';
import {
  TrendingUp as ProgressIcon,
  EmojiEvents as AchievementIcon,
  Timer as TimerIcon,
} from '@mui/icons-material';

// Tipos para el tracker de progreso
interface ProgressData {
  currentTime: number;
  duration: number;
  questionsAnswered: number;
  totalQuestions: number;
  correctAnswers: number;
  meritosEarned: number;
  ondasEarned: number;
}

interface ProgressTrackerProps {
  progress: ProgressData;
  visible?: boolean;
  position?: 'overlay' | 'sidebar' | 'bottom';
}

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({
  progress,
  visible = true,
  position = 'overlay',
}) => {
  if (!visible) return null;

  const videoProgress = (progress.currentTime / progress.duration) * 100;
  const questionsProgress = progress.totalQuestions > 0 
    ? (progress.questionsAnswered / progress.totalQuestions) * 100 
    : 0;
  const accuracy = progress.questionsAnswered > 0 
    ? (progress.correctAnswers / progress.questionsAnswered) * 100 
    : 0;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getPositionStyles = () => {
    switch (position) {
      case 'overlay':
        return {
          position: 'absolute' as const,
          top: 16,
          right: 16,
          zIndex: 1000,
          width: 280,
        };
      case 'sidebar':
        return {
          width: '100%',
          maxWidth: 300,
        };
      case 'bottom':
        return {
          width: '100%',
          position: 'absolute' as const,
          bottom: 16,
          left: 16,
          right: 16,
          zIndex: 1000,
        };
      default:
        return {};
    }
  };

  return (
    <Box sx={getPositionStyles()}>
      <Card
        elevation={position === 'overlay' ? 8 : 2}
        sx={{
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderRadius: 2,
        }}
      >
        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
          {/* Header */}
          <Box display="flex" alignItems="center" mb={2}>
            <ProgressIcon color="primary" sx={{ mr: 1, fontSize: 20 }} />
            <Typography variant="subtitle2" fontWeight={600}>
              Progreso
            </Typography>
          </Box>

          {/* Video Progress */}
          <Box mb={2}>
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography variant="caption" color="text.secondary">
                Video
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {formatTime(progress.currentTime)} / {formatTime(progress.duration)}
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={videoProgress}
              sx={{
                height: 6,
                borderRadius: 3,
                backgroundColor: 'rgba(0, 0, 0, 0.1)',
                '& .MuiLinearProgress-bar': {
                  borderRadius: 3,
                  background: 'linear-gradient(90deg, #2196F3, #03DAC6)',
                }
              }}
            />
          </Box>

          {/* Questions Progress */}
          {progress.totalQuestions > 0 && (
            <Box mb={2}>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="caption" color="text.secondary">
                  Preguntas
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {progress.questionsAnswered} / {progress.totalQuestions}
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={questionsProgress}
                sx={{
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: 'rgba(0, 0, 0, 0.1)',
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 3,
                    background: 'linear-gradient(90deg, #4CAF50, #8BC34A)',
                  }
                }}
              />
            </Box>
          )}

          {/* Stats */}
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {progress.questionsAnswered > 0 && (
              <Chip
                icon={<TimerIcon sx={{ fontSize: '14px' }} />}
                label={`${Math.round(accuracy)}% exactitud`}
                size="small"
                color={accuracy >= 80 ? 'success' : accuracy >= 60 ? 'warning' : 'error'}
                variant="filled"
              />
            )}
            
            {progress.meritosEarned > 0 && (
              <Chip
                icon={<AchievementIcon sx={{ fontSize: '14px' }} />}
                label={`${progress.meritosEarned} mëritos`}
                size="small"
                sx={{
                  backgroundColor: '#FFD700',
                  color: '#333',
                  fontWeight: 600,
                }}
              />
            )}
            
            {progress.ondasEarned > 0 && (
              <Chip
                label={`${progress.ondasEarned} öndas`}
                size="small"
                sx={{
                  backgroundColor: '#03DAC6',
                  color: '#333',
                  fontWeight: 600,
                }}
              />
            )}
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ProgressTracker; 