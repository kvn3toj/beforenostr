import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  Box,
  LinearProgress,
  Avatar,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  EmojiEvents,
  Group,
  Schedule,
  Star,
  PlayArrow,
  CheckCircle,
  Info,
} from '@mui/icons-material';
import { Challenge, ChallengeDifficulty, ChallengeCategory } from '../../../types/challenges';

interface ChallengeCardProps {
  challenge: Challenge;
  onJoin?: (challengeId: string) => void;
  onView?: (challengeId: string) => void;
  showActions?: boolean;
  compact?: boolean;
}

// Helper functions for styling
const getDifficultyColor = (difficulty: ChallengeDifficulty) => {
  switch (difficulty) {
    case 'BEGINNER':
      return 'success';
    case 'INTERMEDIATE':
      return 'warning';
    case 'ADVANCED':
      return 'error';
    case 'EXPERT':
      return 'secondary';
    default:
      return 'default';
  }
};

const getCategoryColor = (category: ChallengeCategory) => {
  switch (category) {
    case 'LEARNING':
      return '#2196F3';
    case 'SOCIAL':
      return '#FF9800';
    case 'WELLNESS':
      return '#4CAF50';
    case 'CREATIVITY':
      return '#9C27B0';
    case 'COMMUNITY':
      return '#FF5722';
    case 'SUSTAINABILITY':
      return '#8BC34A';
    case 'INNOVATION':
      return '#607D8B';
    default:
      return '#757575';
  }
};

const formatDuration = (duration?: number) => {
  if (!duration) return 'Sin límite';
  if (duration === 1) return '1 día';
  if (duration < 7) return `${duration} días`;
  if (duration < 30) return `${Math.round(duration / 7)} semanas`;
  return `${Math.round(duration / 30)} meses`;
};

export const ChallengeCard: React.FC<ChallengeCardProps> = ({
  challenge,
  onJoin,
  onView,
  showActions = true,
  compact = false,
}) => {
  const completionRate = challenge._count?.participants 
    ? (challenge._count.completions / challenge._count.participants) * 100 
    : 0;

  const isActive = challenge.status === 'ACTIVE';
  const isParticipating = challenge.isParticipating;
  const isCompleted = challenge.isCompleted;

  const handleJoinClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onJoin && !isParticipating) {
      onJoin(challenge.id);
    }
  };

  const handleViewClick = () => {
    if (onView) {
      onView(challenge.id);
    }
  };

  return (
    <Card
      sx={{
        height: compact ? 'auto' : 400,
        display: 'flex',
        flexDirection: 'column',
        cursor: onView ? 'pointer' : 'default',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: onView ? 'translateY(-4px)' : 'none',
          boxShadow: onView ? 4 : 1,
        },
        border: isParticipating ? '2px solid' : '1px solid',
        borderColor: isParticipating ? 'primary.main' : 'divider',
        opacity: challenge.status === 'INACTIVE' ? 0.7 : 1,
      }}
      onClick={handleViewClick}
    >
      {/* Header with image/icon */}
      <Box
        sx={{
          height: compact ? 60 : 120,
          background: `linear-gradient(135deg, ${getCategoryColor(challenge.category)}22, ${getCategoryColor(challenge.category)}44)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        {challenge.imageUrl ? (
          <img
            src={challenge.imageUrl}
            alt={challenge.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        ) : (
          <Avatar
            sx={{
              width: compact ? 40 : 60,
              height: compact ? 40 : 60,
              bgcolor: getCategoryColor(challenge.category),
            }}
          >
            <EmojiEvents sx={{ fontSize: compact ? 24 : 32 }} />
          </Avatar>
        )}

        {/* Status indicators */}
        <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
          {isCompleted && (
            <Tooltip title="Completado">
              <CheckCircle color="success" />
            </Tooltip>
          )}
          {isParticipating && !isCompleted && (
            <Tooltip title="Participando">
              <PlayArrow color="primary" />
            </Tooltip>
          )}
        </Box>
      </Box>

      <CardContent sx={{ flexGrow: 1, p: compact ? 2 : 3 }}>
        {/* Title and description */}
        <Typography
          variant={compact ? 'subtitle1' : 'h6'}
          component="h3"
          gutterBottom
          sx={{
            fontWeight: 600,
            lineHeight: 1.2,
            display: '-webkit-box',
            WebkitLineClamp: compact ? 1 : 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {challenge.title}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            display: '-webkit-box',
            WebkitLineClamp: compact ? 2 : 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            mb: 2,
          }}
        >
          {challenge.shortDescription || challenge.description}
        </Typography>

        {/* Tags/Categories */}
        <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
          <Chip
            label={challenge.category}
            size="small"
            sx={{
              bgcolor: `${getCategoryColor(challenge.category)}22`,
              color: getCategoryColor(challenge.category),
              fontWeight: 600,
            }}
          />
          <Chip
            label={challenge.difficulty}
            size="small"
            color={getDifficultyColor(challenge.difficulty) as any}
            variant="outlined"
          />
        </Box>

        {/* Progress bar for participating challenges */}
        {isParticipating && challenge.userProgress && (
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="caption" color="text.secondary">
                Progreso
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {challenge.userProgress.progress}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={challenge.userProgress.progress}
              sx={{ height: 6, borderRadius: 3 }}
            />
            {challenge.userProgress.currentStep && (
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                {challenge.userProgress.currentStep}
              </Typography>
            )}
          </Box>
        )}

        {/* Stats */}
        {!compact && (
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Star sx={{ fontSize: 16, color: 'warning.main' }} />
              <Typography variant="caption">
                {challenge.points} pts
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Group sx={{ fontSize: 16, color: 'text.secondary' }} />
              <Typography variant="caption">
                {challenge._count?.participants || 0}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Schedule sx={{ fontSize: 16, color: 'text.secondary' }} />
              <Typography variant="caption">
                {formatDuration(challenge.duration)}
              </Typography>
            </Box>
          </Box>
        )}

        {/* Completion rate */}
        {!compact && challenge._count?.participants && challenge._count.participants > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="caption" color="text.secondary">
              Tasa de completitud: {completionRate.toFixed(1)}%
            </Typography>
            <LinearProgress
              variant="determinate"
              value={completionRate}
              sx={{ height: 4, borderRadius: 2, mt: 0.5 }}
              color="success"
            />
          </Box>
        )}
      </CardContent>

      {/* Actions */}
      {showActions && (
        <CardActions sx={{ p: compact ? 1 : 2, pt: 0 }}>
          <Box sx={{ display: 'flex', gap: 1, width: '100%' }}>
            {!isParticipating && !isCompleted && isActive && (
              <Button
                variant="contained"
                size={compact ? 'small' : 'medium'}
                onClick={handleJoinClick}
                sx={{ flexGrow: 1 }}
                disabled={!isActive}
              >
                Unirse
              </Button>
            )}
            
            {isParticipating && !isCompleted && (
              <Button
                variant="outlined"
                size={compact ? 'small' : 'medium'}
                onClick={handleViewClick}
                sx={{ flexGrow: 1 }}
              >
                Continuar
              </Button>
            )}
            
            {isCompleted && (
              <Button
                variant="outlined"
                size={compact ? 'small' : 'medium'}
                onClick={handleViewClick}
                sx={{ flexGrow: 1 }}
                color="success"
              >
                Ver Resultados
              </Button>
            )}
            
            {!isParticipating && !isCompleted && (
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  handleViewClick();
                }}
              >
                <Info />
              </IconButton>
            )}
          </Box>
        </CardActions>
      )}
    </Card>
  );
}; 