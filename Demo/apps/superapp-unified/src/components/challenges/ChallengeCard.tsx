import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Chip,
  LinearProgress,
  Avatar,
  Tooltip,
  IconButton,
} from '@mui/material';
import {
  EmojiEvents as TrophyIcon,
  PlayArrow as PlayIcon,
  AccessTime as TimeIcon,
  Star as StarIcon,
  Group as GroupIcon,
  CheckCircle as CheckIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { Challenge, UserChallenge } from '../../hooks/useChallenges';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface ChallengeCardProps {
  challenge: Challenge;
  userChallenge?: UserChallenge;
  onJoin: (challengeId: string) => void;
  onViewDetails: (challengeId: string) => void;
  isJoining?: boolean;
  className?: string;
}

export const ChallengeCard: React.FC<ChallengeCardProps> = ({
  challenge,
  userChallenge,
  onJoin,
  onViewDetails,
  isJoining = false,
  className,
}) => {
  const isParticipating = !!userChallenge;
  const isCompleted = userChallenge?.status === 'completed';
  const progress = userChallenge?.progress || 0;
  
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'success';
      case 'medium': return 'warning';
      case 'hard': return 'error';
      default: return 'default';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'Fácil';
      case 'medium': return 'Medio';
      case 'hard': return 'Difícil';
      default: return difficulty;
    }
  };

  const getStatusChip = () => {
    if (isCompleted) {
      return (
        <Chip
          icon={<CheckIcon />}
          label="Completado"
          color="success"
          size="small"
          variant="filled"
        />
      );
    }
    
    if (isParticipating) {
      return (
        <Chip
          label="En Progreso"
          color="primary"
          size="small"
          variant="filled"
        />
      );
    }

    return (
      <Chip
        label="Disponible"
        color="default"
        size="small"
        variant="outlined"
      />
    );
  };

  const formatTimeRemaining = () => {
    if (!challenge.endDate) return null;
    
    const endDate = new Date(challenge.endDate);
    const now = new Date();
    
    if (endDate <= now) {
      return "Expirado";
    }
    
    return formatDistanceToNow(endDate, { addSuffix: true, locale: es });
  };

  const handleJoinClick = () => {
    if (!isParticipating) {
      onJoin(challenge.id);
    }
  };

  const handleViewClick = () => {
    onViewDetails(challenge.id);
  };

  return (
    <Card 
      className={className}
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        '&:hover': {
          boxShadow: (theme) => theme.shadows[8],
          transform: 'translateY(-2px)',
        },
        transition: 'all 0.2s ease-in-out',
        border: isCompleted ? '2px solid' : '1px solid',
        borderColor: isCompleted ? 'success.main' : 'divider',
      }}
    >
      {/* Status and Difficulty Badges */}
      <Box
        sx={{
          position: 'absolute',
          top: 12,
          right: 12,
          zIndex: 1,
          display: 'flex',
          gap: 1,
        }}
      >
        <Chip
          label={getDifficultyLabel(challenge.difficulty)}
          color={getDifficultyColor(challenge.difficulty) as any}
          size="small"
          variant="filled"
        />
        {getStatusChip()}
      </Box>

      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        {/* Challenge Title */}
        <Typography 
          variant="h6" 
          component="h3"
          gutterBottom
          sx={{ 
            fontWeight: 600,
            lineHeight: 1.3,
            mb: 1,
            pr: 10, // Space for badges
          }}
        >
          {challenge.title}
        </Typography>

        {/* Description */}
        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{ 
            mb: 2,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            minHeight: '4.5em',
          }}
        >
          {challenge.description}
        </Typography>

        {/* Challenge Info */}
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
          {/* Merits */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <TrophyIcon fontSize="small" color="warning" />
            <Typography variant="body2" fontWeight="medium">
              {challenge.merits} mëritos
            </Typography>
          </Box>

          {/* Category */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <StarIcon fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              {challenge.category}
            </Typography>
          </Box>
        </Box>

        {/* Time Remaining */}
        {challenge.endDate && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 2 }}>
            <TimeIcon fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              {formatTimeRemaining()}
            </Typography>
          </Box>
        )}

        {/* Progress Bar (if participating) */}
        {isParticipating && (
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" fontWeight="medium">
                Progreso
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {progress.toFixed(0)}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={progress}
              color={isCompleted ? 'success' : 'primary'}
              sx={{ height: 6, borderRadius: 3 }}
            />
          </Box>
        )}

        {/* Requirements Preview */}
        {challenge.requirements && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="caption" color="text.secondary" fontWeight="medium">
              Requisitos:
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block">
              {challenge.requirements.description || 
               `${challenge.requirements.videoIds?.length || 0} videos, ${challenge.requirements.questionsCorrect || 0} preguntas correctas`}
            </Typography>
          </Box>
        )}
      </CardContent>

      <CardActions sx={{ px: 2, pb: 2, pt: 0 }}>
        <Box sx={{ display: 'flex', gap: 1, width: '100%' }}>
          {/* Main Action Button */}
          {!isParticipating ? (
            <Button
              variant="contained"
              fullWidth
              disabled={!challenge.isActive || isJoining}
              onClick={handleJoinClick}
              startIcon={isJoining ? null : <PlayIcon />}
              sx={{ flexGrow: 1 }}
            >
              {isJoining ? 'Uniéndose...' : 'Aceptar Desafío'}
            </Button>
          ) : isCompleted ? (
            <Button
              variant="outlined"
              fullWidth
              color="success"
              startIcon={<CheckIcon />}
              sx={{ flexGrow: 1 }}
              disabled
            >
              ¡Completado!
            </Button>
          ) : (
            <Button
              variant="contained"
              fullWidth
              onClick={handleViewClick}
              startIcon={<PlayIcon />}
              sx={{ flexGrow: 1 }}
            >
              Continuar
            </Button>
          )}

          {/* Info Button */}
          <Tooltip title="Ver detalles" arrow>
            <IconButton
              color="primary"
              onClick={handleViewClick}
              sx={{ 
                border: '1px solid',
                borderColor: 'primary.main',
                '&:hover': {
                  backgroundColor: 'primary.main',
                  color: 'white',
                }
              }}
            >
              <InfoIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </CardActions>

      {/* Completion Badge Overlay */}
      {isCompleted && (
        <Box
          sx={{
            position: 'absolute',
            top: -10,
            left: -10,
            backgroundColor: 'success.main',
            color: 'white',
            borderRadius: '50%',
            width: 40,
            height: 40,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 2,
            zIndex: 2,
          }}
        >
          <TrophyIcon fontSize="small" />
        </Box>
      )}
    </Card>
  );
};