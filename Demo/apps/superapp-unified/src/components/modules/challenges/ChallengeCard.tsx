import React, { useState } from 'react';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  Badge,
  Divider,
  Stack,
} from '@mui/material';
import {
  EmojiEvents,
  Group,
  Schedule,
  Star,
  PlayArrow,
  CheckCircle,
  Info,
  ExpandMore,
  ExpandLess,
  Favorite,
  Share,
  Flag,
  TrendingUp,
  WorkspacePremium,
  MonetizationOn,
  Psychology,
  CheckBox,
  Person,
  Timeline,
  School,
  Nature,
  Lightbulb,
  Public,
  Recycling,
  EmojiObjects,
} from '@mui/icons-material';
import {
  Challenge,
  ChallengeDifficulty,
  ChallengeCategory,
} from '../../../types/challenges';

interface ChallengeCardProps {
  challenge: Challenge;
  onJoin?: (challengeId: string) => void;
  onView?: (challengeId: string) => void;
  onLike?: (challengeId: string) => void;
  onShare?: (challengeId: string) => void;
  showActions?: boolean;
  compact?: boolean;
  variant?: 'default' | 'featured' | 'minimal';
}

// Helper functions for styling
const getDifficultyColor = (difficulty: ChallengeDifficulty) => {
  switch (difficulty) {
    case 'BEGINNER':
      return { color: 'success', label: 'Principiante', icon: '🌱' };
    case 'INTERMEDIATE':
      return { color: 'warning', label: 'Intermedio', icon: '⚡' };
    case 'ADVANCED':
      return { color: 'error', label: 'Avanzado', icon: '🔥' };
    case 'EXPERT':
      return { color: 'secondary', label: 'Experto', icon: '💎' };
    default:
      return { color: 'default', label: 'Sin definir', icon: '❓' };
  }
};

const getCategoryConfig = (category: ChallengeCategory) => {
  switch (category) {
    case 'LEARNING':
      return {
        color: '#2196F3',
        label: 'Aprendizaje',
        icon: School,
        description: 'Expande tu conocimiento y sabiduría',
      };
    case 'SOCIAL':
      return {
        color: '#FF9800',
        label: 'Social',
        icon: Group,
        description: 'Fortalece los lazos comunitarios',
      };
    case 'WELLNESS':
      return {
        color: '#4CAF50',
        label: 'Bienestar',
        icon: Favorite,
        description: 'Cuida tu cuerpo, mente y espíritu',
      };
    case 'CREATIVITY':
      return {
        color: '#9C27B0',
        label: 'Creatividad',
        icon: Lightbulb,
        description: 'Expresa tu potencial creativo',
      };
    case 'COMMUNITY':
      return {
        color: '#FF5722',
        label: 'Comunidad',
        icon: Public,
        description: 'Construye el Bien Común',
      };
    case 'SUSTAINABILITY':
      return {
        color: '#8BC34A',
        label: 'Sostenibilidad',
        icon: Nature,
        description: 'Protege nuestro planeta',
      };
    case 'INNOVATION':
      return {
        color: '#607D8B',
        label: 'Innovación',
        icon: EmojiObjects,
        description: 'Crea soluciones transformadoras',
      };
    default:
      return {
        color: '#757575',
        label: 'General',
        icon: EmojiEvents,
        description: 'Desafío general',
      };
  }
};

const formatDuration = (duration?: number) => {
  if (!duration) return 'Sin límite';
  if (duration === 1) return '1 día';
  if (duration < 7) return `${duration} días`;
  if (duration < 30) return `${Math.round(duration / 7)} semanas`;
  return `${Math.round(duration / 30)} meses`;
};

const formatPoints = (points: number | undefined | null) => {
  if (!points || points === 0) {
    return '0';
  }
  if (points >= 1000) {
    return `${(points / 1000).toFixed(1)}k`;
  }
  return points.toString();
};

// Helper function to get challenge image based on category
const getChallengeImage = (challenge: Challenge) => {
  // If challenge already has an image, use it
  if (challenge.imageUrl) {
    return challenge.imageUrl;
  }

  // Default images by category
  const categoryImages = {
    LEARNING: '/assets/images/challenges/learning-challenge.jpg',
    SOCIAL: '/assets/images/challenges/social-challenge.jpg',
    WELLNESS: '/assets/images/challenges/wellness-challenge.jpg',
    CREATIVITY: '/assets/images/challenges/creativity-challenge.jpg',
    COMMUNITY: '/assets/images/challenges/ayni-daily.jpg', // Use the Ayni image for community
    SUSTAINABILITY: '/assets/images/challenges/sustainability-challenge.jpg',
    INNOVATION: '/assets/images/challenges/innovation-challenge.jpg',
  };

  return (
    categoryImages[challenge.category] ||
    '/assets/images/challenges/community-challenge.jpg'
  );
};

export const ChallengeCard: React.FC<ChallengeCardProps> = ({
  challenge,
  onJoin,
  onView,
  onLike,
  onShare,
  showActions = true,
  compact = false,
  variant = 'default',
}) => {
  // Safety check: ensure challenge object is valid
  if (!challenge || !challenge.id || !challenge.title) {
    console.warn(
      '⚠️ ChallengeCard received invalid challenge object:',
      challenge
    );
    return (
      <Card sx={{ height: 400 }}>
        <CardContent>
          <Typography color="error">
            Error: Datos del desafío no válidos
          </Typography>
        </CardContent>
      </Card>
    );
  }

  const [showDetails, setShowDetails] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [liked, setLiked] = useState(false);

  const completionRate = challenge._count?.participants
    ? (challenge._count.completions / challenge._count.participants) * 100
    : 0;

  const isActive = challenge.status === 'ACTIVE';
  const isParticipating = challenge.isParticipating;
  const isCompleted = challenge.isCompleted;
  const isFeatured = variant === 'featured';
  const isMinimal = variant === 'minimal';

  const difficultyConfig = getDifficultyColor(challenge.difficulty);
  const categoryConfig = getCategoryConfig(challenge.category);
  const CategoryIcon = categoryConfig.icon;

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

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLiked(!liked);
    if (onLike) {
      onLike(challenge.id);
    }
  };

  const handleShareClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onShare) {
      onShare(challenge.id);
    }
  };

  const getCardHeight = () => {
    if (isMinimal) return 'auto';
    if (compact) return 350;
    if (isFeatured) return 500;
    return 420;
  };

  return (
    <>
      <Card
        data-testid="challenge-card"
        sx={{
          height: getCardHeight(),
          display: 'flex',
          flexDirection: 'column',
          cursor: onView ? 'pointer' : 'default',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: onView ? 'translateY(-8px)' : 'none',
            boxShadow: onView ? '0 12px 40px rgba(0,0,0,0.15)' : 'none',
          },
          border: isParticipating ? '2px solid' : '1px solid',
          borderColor: isParticipating ? 'primary.main' : 'divider',
          opacity: challenge.status === 'INACTIVE' ? 0.7 : 1,
          background: isFeatured
            ? `linear-gradient(135deg, ${categoryConfig.color}08, ${categoryConfig.color}15)`
            : 'background.paper',
          position: 'relative',
          overflow: 'hidden',
        }}
        onClick={handleViewClick}
      >
        {/* Featured badge */}
        {isFeatured && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              right: 0,
              background: `linear-gradient(135deg, ${categoryConfig.color}, ${categoryConfig.color}CC)`,
              color: 'white',
              px: 2,
              py: 0.5,
              borderBottomLeftRadius: 16,
              zIndex: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
            }}
          >
            <Star sx={{ fontSize: 16 }} />
            <Typography variant="caption" fontWeight={600}>
              Destacado
            </Typography>
          </Box>
        )}

        {/* Header with image/icon */}
        <Box
          sx={{
            height: isMinimal ? 60 : compact ? 100 : isFeatured ? 160 : 120,
            background: 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Box
            component="img"
            src={getChallengeImage(challenge)}
            alt={challenge.title}
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />

          {/* Status indicators */}
          <Box sx={{ position: 'absolute', top: 8, left: 8 }}>
            {isCompleted && (
              <Tooltip title="Completado exitosamente">
                <CheckCircle
                  sx={{
                    color: 'success.main',
                    bgcolor: 'background.paper',
                    borderRadius: '50%',
                    fontSize: 24,
                  }}
                />
              </Tooltip>
            )}
            {isParticipating && !isCompleted && (
              <Tooltip title="En progreso">
                <Badge
                  badgeContent={
                    challenge.userProgress?.progress
                      ? `${challenge.userProgress.progress}%`
                      : ''
                  }
                  color="primary"
                  sx={{
                    '& .MuiBadge-badge': {
                      fontSize: '0.6rem',
                      minWidth: 'auto',
                      height: 16,
                    },
                  }}
                >
                  <PlayArrow
                    sx={{
                      color: 'primary.main',
                      bgcolor: 'background.paper',
                      borderRadius: '50%',
                      fontSize: 24,
                      p: 0.2,
                    }}
                  />
                </Badge>
              </Tooltip>
            )}
          </Box>

          {/* Action buttons overlay */}
          {!isMinimal && (
            <Box
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                display: 'flex',
                gap: 0.5,
              }}
            >
              <IconButton
                size="small"
                onClick={handleLikeClick}
                sx={{
                  bgcolor: 'background.paper',
                  '&:hover': { bgcolor: 'background.default' },
                  boxShadow: 1,
                }}
              >
                <Favorite
                  sx={{
                    color: liked ? 'error.main' : 'text.secondary',
                    fontSize: 18,
                  }}
                />
              </IconButton>
              <IconButton
                size="small"
                onClick={handleShareClick}
                sx={{
                  bgcolor: 'background.paper',
                  '&:hover': { bgcolor: 'background.default' },
                  boxShadow: 1,
                }}
              >
                <Share sx={{ fontSize: 18 }} />
              </IconButton>
            </Box>
          )}
        </Box>

        <CardContent sx={{ flexGrow: 1, p: isMinimal ? 2 : 3 }}>
          {/* Title and description */}
          <Box sx={{ mb: 2 }}>
            <Typography
              data-testid="challenge-title"
              variant={isMinimal ? 'subtitle1' : isFeatured ? 'h5' : 'h6'}
              component="h3"
              gutterBottom
              sx={{
                fontWeight: 700,
                lineHeight: 1.2,
                display: '-webkit-box',
                WebkitLineClamp: isMinimal ? 1 : 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                color: isFeatured ? categoryConfig.color : 'text.primary',
              }}
            >
              {challenge.title}
            </Typography>

            <Typography
              data-testid="challenge-description"
              variant="body2"
              color="text.secondary"
              sx={{
                display: '-webkit-box',
                WebkitLineClamp: isMinimal ? 1 : expanded ? 6 : 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                mb: 1,
                lineHeight: 1.4,
              }}
            >
              {challenge.shortDescription || challenge.description}
            </Typography>

            {!isMinimal &&
              challenge.description &&
              challenge.description.length > 150 && (
                <Button
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    setExpanded(!expanded);
                  }}
                  endIcon={expanded ? <ExpandLess /> : <ExpandMore />}
                  sx={{ p: 0, minWidth: 'auto', textTransform: 'none' }}
                >
                  {expanded ? 'Ver menos' : 'Ver más'}
                </Button>
              )}
          </Box>

          {/* Tags/Categories */}
          <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
            <Chip
              icon={<CategoryIcon sx={{ fontSize: 16 }} />}
              label={categoryConfig.label}
              size="small"
              sx={{
                bgcolor: `${categoryConfig.color}15`,
                color: categoryConfig.color,
                fontWeight: 600,
                '& .MuiChip-icon': {
                  color: categoryConfig.color,
                },
              }}
            />
            <Chip
              label={`${difficultyConfig.icon} ${difficultyConfig.label}`}
              size="small"
              color={difficultyConfig.color as any}
              variant="outlined"
              sx={{ fontWeight: 500 }}
            />
          </Box>

          {/* Progress bar for participating challenges */}
          {isParticipating && challenge.userProgress && !isMinimal && (
            <Box sx={{ mb: 2 }}>
              <Box
                sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}
              >
                <Typography
                  variant="caption"
                  color="text.secondary"
                  fontWeight={600}
                >
                  Progreso del Desafío
                </Typography>
                <Typography
                  variant="caption"
                  color="primary.main"
                  fontWeight={700}
                >
                  {challenge.userProgress.progress}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={challenge.userProgress.progress}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  bgcolor: 'action.hover',
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 4,
                    background: `linear-gradient(90deg, ${categoryConfig.color}, ${categoryConfig.color}CC)`,
                  },
                }}
              />
              {challenge.userProgress.currentStep && (
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ mt: 1, display: 'block' }}
                >
                  📍 {challenge.userProgress.currentStep}
                </Typography>
              )}
            </Box>
          )}

          {/* Stats */}
          {!isMinimal && (
            <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
              <Tooltip title="Mëritos disponibles">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <WorkspacePremium
                    sx={{ fontSize: 18, color: 'warning.main' }}
                  />
                  <Typography
                    variant="body2"
                    fontWeight={600}
                    color="warning.main"
                  >
                    {formatPoints(challenge.points)}
                  </Typography>
                </Box>
              </Tooltip>

              <Tooltip title="Participantes">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Group sx={{ fontSize: 18, color: 'primary.main' }} />
                  <Typography variant="body2" fontWeight={600}>
                    {challenge._count?.participants || 0}
                  </Typography>
                </Box>
              </Tooltip>

              <Tooltip title="Duración">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Schedule sx={{ fontSize: 18, color: 'text.secondary' }} />
                  <Typography variant="body2">
                    {formatDuration(challenge.duration)}
                  </Typography>
                </Box>
              </Tooltip>

              {completionRate > 0 && (
                <Tooltip title="Tasa de éxito">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <TrendingUp sx={{ fontSize: 18, color: 'success.main' }} />
                    <Typography
                      variant="body2"
                      color="success.main"
                      fontWeight={600}
                    >
                      {completionRate.toFixed(0)}%
                    </Typography>
                  </Box>
                </Tooltip>
              )}
            </Stack>
          )}

          {/* Rewards preview */}
          {!isMinimal && challenge.rewards && challenge.rewards.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mb: 1, display: 'block' }}
              >
                🎁 Recompensas incluidas:
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {challenge.rewards.slice(0, 3).map((reward, index) => (
                  <Tooltip key={index} title={reward.description}>
                    <Chip
                      size="small"
                      label={
                        reward.type === 'MERITS'
                          ? `${reward.amount} Mëritos`
                          : reward.type
                      }
                      sx={{
                        fontSize: '0.7rem',
                        height: 20,
                        bgcolor: 'action.hover',
                      }}
                    />
                  </Tooltip>
                ))}
                {challenge.rewards.length > 3 && (
                  <Chip
                    size="small"
                    label={`+${challenge.rewards.length - 3} más`}
                    sx={{
                      fontSize: '0.7rem',
                      height: 20,
                      bgcolor: 'action.hover',
                    }}
                  />
                )}
              </Box>
            </Box>
          )}
        </CardContent>

        {/* Actions */}
        {showActions && (
          <CardActions sx={{ p: isMinimal ? 1 : 2, pt: 0 }}>
            <Stack direction="row" spacing={1} sx={{ width: '100%' }}>
              {!isParticipating && !isCompleted && isActive && (
                <Button
                  variant="contained"
                  size={isMinimal ? 'small' : 'medium'}
                  onClick={handleJoinClick}
                  sx={{
                    flexGrow: 1,
                    background: `linear-gradient(45deg, ${categoryConfig.color}, ${categoryConfig.color}CC)`,
                    '&:hover': {
                      background: `linear-gradient(45deg, ${categoryConfig.color}DD, ${categoryConfig.color}BB)`,
                    },
                  }}
                  disabled={!isActive}
                  startIcon={<Flag />}
                >
                  Unirse al Desafío
                </Button>
              )}

              {isParticipating && !isCompleted && (
                <Button
                  variant="outlined"
                  size={isMinimal ? 'small' : 'medium'}
                  onClick={handleViewClick}
                  sx={{ flexGrow: 1 }}
                  startIcon={<Timeline />}
                  color="primary"
                >
                  Continuar
                </Button>
              )}

              {isCompleted && (
                <Button
                  variant="outlined"
                  size={isMinimal ? 'small' : 'medium'}
                  onClick={handleViewClick}
                  sx={{ flexGrow: 1 }}
                  color="success"
                  startIcon={<CheckCircle />}
                >
                  Ver Resultados
                </Button>
              )}

              {!isMinimal && (
                <Tooltip title="Ver detalles">
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowDetails(true);
                    }}
                    sx={{
                      border: '1px solid',
                      borderColor: 'divider',
                    }}
                  >
                    <Info />
                  </IconButton>
                </Tooltip>
              )}
            </Stack>
          </CardActions>
        )}
      </Card>

      {/* Details Dialog */}
      <Dialog
        open={showDetails}
        onClose={() => setShowDetails(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ pb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              sx={{
                bgcolor: categoryConfig.color,
                width: 48,
                height: 48,
              }}
            >
              <CategoryIcon />
            </Avatar>
            <Box>
              <Typography variant="h6" component="h2">
                {challenge.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {categoryConfig.label} • {difficultyConfig.label} •{' '}
                {formatPoints(challenge.points)} Mëritos
              </Typography>
            </Box>
          </Box>
        </DialogTitle>

        <DialogContent>
          <Typography variant="body1" paragraph>
            {challenge.description}
          </Typography>

          {challenge.requirements && challenge.requirements.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                📋 Requisitos:
              </Typography>
              <List dense>
                {challenge.requirements.map((req, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <CheckBox color="primary" />
                    </ListItemIcon>
                    <ListItemText primary={req} />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}

          {challenge.rewards && challenge.rewards.length > 0 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                🎁 Recompensas:
              </Typography>
              <List dense>
                {challenge.rewards.map((reward, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      {reward.type === 'MERITS' && (
                        <WorkspacePremium color="warning" />
                      )}
                      {reward.type === 'LUKAS' && (
                        <MonetizationOn color="success" />
                      )}
                      {reward.type === 'ONDAS' && <Psychology color="info" />}
                      {reward.type === 'BADGE' && (
                        <EmojiEvents color="primary" />
                      )}
                    </ListItemIcon>
                    <ListItemText
                      primary={reward.description}
                      secondary={
                        reward.amount
                          ? `${reward.amount} ${reward.type}`
                          : undefined
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setShowDetails(false)}>Cerrar</Button>
          {!isParticipating && !isCompleted && isActive && (
            <Button
              variant="contained"
              onClick={(e) => {
                handleJoinClick(e);
                setShowDetails(false);
              }}
              startIcon={<Flag />}
            >
              Unirse al Desafío
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
};
