import React from 'react';
import { Box, Typography, Paper, LinearProgress } from '@mui/material';
import { motion } from 'framer-motion';
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
  color,
  inverted = false,
}) => {
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
    if (isCompleted) return 'LEGENDARY';
    if (progress >= 80) return 'EPIC';
    if (progress >= 60) return 'RARE';
    if (progress >= 40) return 'UNCOMMON';
    return 'COMMON';
  };

  const getAchievementIcon = () => {
    if (isCompleted) return <TrophyIcon />;
    if (isNearCompletion) return <StarIcon />;
    return <FireIcon />;
  };

  const getAchievementColor = () => {
    if (isCompleted) return '#FFD700'; // Gold
    if (isNearCompletion) return '#FF6B35'; // Epic Orange
    return color;
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
    >
      <Paper
        sx={{
          p: 3,
          background: `linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)`,
          border: `1px solid ${getAchievementColor()}40`,
          borderRadius: 2,
          boxShadow: `0 0 20px ${getAchievementColor()}20`,
          position: 'relative',
          overflow: 'hidden',
          height: '100%',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: `0 0 30px ${getAchievementColor()}40`,
            border: `1px solid ${getAchievementColor()}80`,
          },
        }}
      >
        {/* Animated Background Effect */}
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          sx={{
            background: `radial-gradient(circle at top left, ${getAchievementColor()}15 0%, transparent 70%)`,
            zIndex: 1,
          }}
        />

        {/* Completion Celebration Effect */}
        {isCompleted && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 2,
              pointerEvents: 'none',
            }}
          >
            <Box
              position="absolute"
              top="50%"
              left="50%"
              sx={{
                transform: 'translate(-50%, -50%)',
                background: `radial-gradient(circle, ${getAchievementColor()}30 0%, transparent 70%)`,
                width: 200,
                height: 200,
                borderRadius: '50%',
                animation: 'pulse 2s infinite',
              }}
            />
          </motion.div>
        )}

        <Box position="relative" zIndex={3}>
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
                  color: getAchievementColor(),
                  fontWeight: 'bold',
                  textShadow: `0 0 10px ${getAchievementColor()}60`,
                  mb: 0.5,
                }}
              >
                {title}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: '#ccc',
                  fontSize: '0.9rem',
                }}
              >
                {description}
              </Typography>
            </Box>

            <motion.div
              animate={
                isCompleted
                  ? {
                      rotate: [0, 10, -10, 0],
                      scale: [1, 1.2, 1],
                    }
                  : {}
              }
              transition={{
                duration: 1,
                repeat: isCompleted ? Infinity : 0,
                repeatDelay: 2,
              }}
            >
              <Box
                sx={{
                  color: getAchievementColor(),
                  filter: `drop-shadow(0 0 8px ${getAchievementColor()}80)`,
                  fontSize: '1.5rem',
                }}
              >
                {getAchievementIcon()}
              </Box>
            </motion.div>
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
                color: getAchievementColor(),
                fontWeight: 'bold',
                textShadow: `0 0 15px ${getAchievementColor()}80`,
              }}
            >
              {formatValue(current)}
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: '#999',
                textAlign: 'right',
              }}
            >
              Target: {formatValue(target)}
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
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                }}
              >
                {getAchievementLevel()}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: '#fff',
                  fontWeight: 'bold',
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
                  height: 12,
                  borderRadius: 6,
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 6,
                    background: `linear-gradient(90deg, ${getAchievementColor()} 0%, ${getAchievementColor()}80 100%)`,
                    boxShadow: `0 0 12px ${getAchievementColor()}60`,
                    transition: 'all 0.5s ease-out',
                  },
                }}
              />

              {/* Animated Progress Indicator */}
              <motion.div
                initial={{ x: 0 }}
                animate={{ x: `${progress}%` }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: 0,
                  transform: 'translateY(-50%)',
                  marginLeft: '-6px',
                }}
              >
                <Box
                  width={12}
                  height={12}
                  borderRadius="50%"
                  sx={{
                    background: getAchievementColor(),
                    boxShadow: `0 0 12px ${getAchievementColor()}80`,
                    border: '2px solid #fff',
                  }}
                />
              </motion.div>

              {/* Progress Milestones */}
              {[25, 50, 75].map((milestone) => (
                <Box
                  key={milestone}
                  position="absolute"
                  left={`${milestone}%`}
                  top="50%"
                  width={2}
                  height={16}
                  sx={{
                    background:
                      progress >= milestone ? getAchievementColor() : '#555',
                    transform: 'translate(-50%, -50%)',
                    borderRadius: 1,
                    transition: 'background 0.3s ease',
                  }}
                />
              ))}
            </Box>
          </Box>

          {/* Status Message */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Typography
              variant="caption"
              sx={{
                color: isCompleted
                  ? '#00ff88'
                  : isNearCompletion
                    ? '#ffaa00'
                    : '#999',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                fontSize: '0.75rem',
              }}
            >
              {isCompleted
                ? '🏆 ACHIEVEMENT UNLOCKED!'
                : isNearCompletion
                  ? '⚡ ALMOST THERE!'
                  : '🎯 IN PROGRESS'}
            </Typography>
          </motion.div>

          {/* Gaming corner accent */}
          <Box
            position="absolute"
            bottom={0}
            left={0}
            width={16}
            height={16}
            sx={{
              background: `linear-gradient(45deg, ${getAchievementColor()} 0%, transparent 100%)`,
              clipPath: 'polygon(0 100%, 100% 100%, 0 0)',
              opacity: 0.6,
            }}
          />
        </Box>
      </Paper>
    </motion.div>
  );
};

export default AchievementBar;
