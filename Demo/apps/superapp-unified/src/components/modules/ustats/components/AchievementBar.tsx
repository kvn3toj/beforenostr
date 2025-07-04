import React from 'react';
import { Box, Typography, Paper, LinearProgress } from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import {
  EmojiEvents as TrophyIcon,
  Star as StarIcon,
  Whatshot as FireIcon,
} from '@mui/icons-material';

interface AchievementBarProps {
  title: string;
  description: string;
  current: number;
  target: number;
  color: string;
  inverted?: boolean; // For metrics where lower is better (like load time)
}

const AchievementBar: React.FC<AchievementBarProps> = ({
  title,
  description,
  current,
  target,
  inverted = false,
}) => {
  const theme = useTheme();

  const calculateProgress = () => {
    if (inverted) {
      // For inverted metrics (like load time), progress is better when current is lower
      return Math.max(0, Math.min(100, (target / current) * 100));
    }
    return Math.max(0, Math.min(100, (current / target) * 100));
  };

  const progress = calculateProgress();
  const isCompleted = inverted ? current <= target : current >= target;
  const isNearCompletion = progress >= 80;

  const getAchievementLevel = () => {
    if (isCompleted) return 'COMPLETADO';
    if (progress >= 80) return 'ÉPICO';
    if (progress >= 60) return 'RARO';
    if (progress >= 40) return 'COMÚN';
    return 'INICIAL';
  };

  const getAchievementIcon = () => {
    if (isCompleted) return <TrophyIcon />;
    if (isNearCompletion) return <StarIcon />;
    return <FireIcon />;
  };

  const getAchievementColor = () => {
    if (isCompleted) return theme.palette.success.main;
    if (isNearCompletion) return theme.palette.warning.main;
    return theme.palette.text.secondary;
  };

  const formatValue = (value: number) => {
    if (title.includes('Time') || title.includes('Speed')) {
      return `${value.toFixed(1)}s`;
    }
    if (title.includes('Rate') || title.includes('%')) {
      return `${value.toFixed(1)}%`;
    }
    return value.toLocaleString();
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        backgroundColor: theme.palette.background.paper,
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 2,
        position: 'relative',
        overflow: 'hidden',
        height: '100%',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          borderColor: theme.palette.text.secondary,
          boxShadow: `0 2px 8px ${alpha(theme.palette.common.black, 0.08)}`,
          transform: 'translateY(-1px)',
        },
      }}
    >
      {/* Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="flex-start"
        mb={2}
      >
        <Box>
          <Typography
            variant="h6"
            component="h3"
            sx={{
              color: theme.palette.text.primary,
              fontWeight: 600,
              mb: 0.5,
              fontSize: '1rem',
            }}
          >
            {title}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: theme.palette.text.secondary,
              fontSize: '0.875rem',
            }}
          >
            {description}
          </Typography>
        </Box>

        <Box
          sx={{
            color: getAchievementColor(),
            fontSize: '1.5rem',
            transition: 'color 0.3s ease',
          }}
        >
          {getAchievementIcon()}
        </Box>
      </Box>

      {/* Progress Stats */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography
          variant="h4"
          component="div"
          sx={{
            color: theme.palette.text.primary,
            fontWeight: 600,
            fontSize: { xs: '1.5rem', sm: '2rem' },
          }}
        >
          {formatValue(current)}
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color: theme.palette.text.secondary,
            textAlign: 'right',
          }}
        >
          Objetivo: {formatValue(target)}
        </Typography>
      </Box>

      {/* Progress Bar */}
      <Box mb={2}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={1}
        >
          <Typography
            variant="caption"
            sx={{
              color: getAchievementColor(),
              fontWeight: 600,
              textTransform: 'uppercase',
              fontSize: '0.75rem',
            }}
          >
            {getAchievementLevel()}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: theme.palette.text.primary,
              fontWeight: 600,
            }}
          >
            {progress.toFixed(1)}%
          </Typography>
        </Box>

        <Box position="relative">
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 8,
              borderRadius: 4,
              backgroundColor: alpha(theme.palette.divider, 0.3),
              '& .MuiLinearProgress-bar': {
                borderRadius: 4,
                backgroundColor: getAchievementColor(),
                transition: 'all 0.3s ease-out',
              },
            }}
          />
        </Box>
      </Box>

      {/* Achievement Status */}
      {isCompleted && (
        <Box
          sx={{
            mt: 2,
            p: 1.5,
            backgroundColor: alpha(theme.palette.success.main, 0.1),
            border: `1px solid ${alpha(theme.palette.success.main, 0.3)}`,
            borderRadius: 1,
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: theme.palette.success.main,
              fontWeight: 600,
              textTransform: 'uppercase',
            }}
          >
            ¡Objetivo Completado!
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default AchievementBar;
