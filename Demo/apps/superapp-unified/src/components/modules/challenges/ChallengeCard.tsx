import React, { useState } from 'react';
import {
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
import { safeToString, safeLog } from '../../../utils/safeConversion';

// 🌌 ARIA (Frontend Artist) - Cosmic Design System
import { CosmicCard } from '../../../design-system';
import { UNIFIED_COLORS } from '../../../theme/colors';

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

// 🌟 Mapping de categorías a elementos cósmicos
const getCategoryElement = (category: ChallengeCategory) => {
  switch (category) {
    case 'PERSONAL_DEVELOPMENT':
    case 'MINDFULNESS':
    case 'MEDITATION':
      return 'espiritu'; // Desarrollo personal y mindfulness = espíritu
    case 'FITNESS':
    case 'HEALTH':
      return 'tierra'; // Fitness y salud = tierra (cuerpo físico)
    case 'CREATIVITY':
    case 'ART':
    case 'WRITING':
      return 'fuego'; // Creatividad y arte = fuego (pasión, creación)
    case 'SOCIAL':
    case 'COMMUNITY':
    case 'VOLUNTEERING':
      return 'agua'; // Social y comunidad = agua (fluidez, conexión)
    case 'LEARNING':
    case 'EDUCATION':
    case 'SKILL_BUILDING':
      return 'aire'; // Aprendizaje y educación = aire (ideas, conocimiento)
    default:
      return 'espiritu'; // Default
  }
};

const getDifficultyColor = (difficulty: ChallengeDifficulty) => {
  switch (difficulty) {
    case 'BEGINNER':
      return { color: 'success', label: '🌱 Iniciante' };
    case 'INTERMEDIATE':
      return { color: 'warning', label: '⚡ Intermedio' };
    case 'ADVANCED':
      return { color: 'error', label: '🔥 Avanzado' };
    case 'EXPERT':
      return { color: 'secondary', label: '🌟 Experto' };
    default:
      return { color: 'default', label: difficulty };
  }
};

const getCategoryConfig = (category: ChallengeCategory) => {
  const configs = {
    PERSONAL_DEVELOPMENT: {
      icon: Psychology,
      label: 'Desarrollo Personal',
      color: UNIFIED_COLORS.elements.eter.primary,
    },
    FITNESS: {
      icon: MonetizationOn,
      label: 'Fitness',
      color: UNIFIED_COLORS.elements.tierra.primary,
    },
    CREATIVITY: {
      icon: Lightbulb,
      label: 'Creatividad',
      color: UNIFIED_COLORS.elements.fuego.primary,
    },
    SOCIAL: {
      icon: Group,
      label: 'Social',
      color: UNIFIED_COLORS.elements.agua.primary,
    },
    LEARNING: {
      icon: School,
      label: 'Aprendizaje',
      color: UNIFIED_COLORS.elements.aire.primary,
    },
    HEALTH: {
      icon: Nature,
      label: 'Salud',
      color: UNIFIED_COLORS.elements.tierra.primary,
    },
    MINDFULNESS: {
      icon: Psychology,
      label: 'Mindfulness',
      color: UNIFIED_COLORS.elements.eter.primary,
    },
    COMMUNITY: {
      icon: Public,
      label: 'Comunidad',
      color: UNIFIED_COLORS.elements.agua.primary,
    },
    EDUCATION: {
      icon: School,
      label: 'Educación',
      color: UNIFIED_COLORS.elements.aire.primary,
    },
    VOLUNTEERING: {
      icon: Recycling,
      label: 'Voluntariado',
      color: UNIFIED_COLORS.elements.agua.primary,
    },
    ART: {
      icon: EmojiObjects,
      label: 'Arte',
      color: UNIFIED_COLORS.elements.fuego.primary,
    },
    WRITING: {
      icon: Lightbulb,
      label: 'Escritura',
      color: UNIFIED_COLORS.elements.fuego.primary,
    },
    MEDITATION: {
      icon: Psychology,
      label: 'Meditación',
      color: UNIFIED_COLORS.elements.eter.primary,
    },
    SKILL_BUILDING: {
      icon: Timeline,
      label: 'Desarrollo de Habilidades',
      color: UNIFIED_COLORS.elements.aire.primary,
    },
  };

  return (
    configs[category] || {
      icon: EmojiEvents,
      label: category,
      color: UNIFIED_COLORS.brand.coomunityBlue,
    }
  );
};

const formatDuration = (duration?: number) => {
  if (!duration) return 'Flexible';
  if (duration < 60) return `${duration} min`;
  const hours = Math.floor(duration / 60);
  const minutes = duration % 60;
  return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
};

const formatPoints = (points: number | undefined | null) => {
  if (!points || points === 0) return 'Sin puntos';
  return `${points.toLocaleString()} puntos`;
};

const getChallengeImage = (challenge: Challenge) => {
  if (challenge.imageUrl) return challenge.imageUrl;
  
  // Imagen por defecto basada en categoría
  const category = challenge.category || 'PERSONAL_DEVELOPMENT';
  const images = {
    PERSONAL_DEVELOPMENT: '/images/challenges/personal-development.jpg',
    FITNESS: '/images/challenges/fitness.jpg',
    CREATIVITY: '/images/challenges/creativity.jpg',
    SOCIAL: '/images/challenges/social.jpg',
    LEARNING: '/images/challenges/learning.jpg',
    HEALTH: '/images/challenges/health.jpg',
    MINDFULNESS: '/images/challenges/mindfulness.jpg',
    COMMUNITY: '/images/challenges/community.jpg',
    EDUCATION: '/images/challenges/education.jpg',
    VOLUNTEERING: '/images/challenges/volunteering.jpg',
    ART: '/images/challenges/art.jpg',
    WRITING: '/images/challenges/writing.jpg',
    MEDITATION: '/images/challenges/meditation.jpg',
    SKILL_BUILDING: '/images/challenges/skill-building.jpg',
  };
  
  return images[category] || '/images/challenges/default.jpg';
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
  const [liked, setLiked] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  // 🎨 Configuración visual
  const categoryConfig = getCategoryConfig(challenge.category);
  const difficultyConfig = getDifficultyColor(challenge.difficulty);
  const CategoryIcon = categoryConfig.icon;
  const cosmicElement = getCategoryElement(challenge.category);

  // 🎯 Estado del challenge
  const isCompleted = challenge.status === 'COMPLETED';
  const isParticipating = challenge.userProgress?.isParticipating || false;
  const isFeatured = variant === 'featured';
  const isMinimal = variant === 'minimal';

  // 🎬 Event handlers
  const handleJoinClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onJoin) onJoin(challenge.id);
  };

  const handleViewClick = () => {
    if (onView) onView(challenge.id);
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
      <CosmicCard
        data-testid="challenge-card"
        variant={isFeatured ? 'elevated' : 'primary'}
        element={cosmicElement}
        enableGlow={isFeatured}
        enableAnimations={true}
        enableOrbitalEffects={isFeatured}
        cosmicIntensity={isFeatured ? 'intense' : 'medium'}
        onClick={handleViewClick}
        sx={{
          height: getCardHeight(),
          display: 'flex',
          flexDirection: 'column',
          cursor: onView ? 'pointer' : 'default',
          border: isParticipating ? '2px solid' : '1px solid',
          borderColor: isParticipating ? 'primary.main' : 'divider',
          opacity: challenge.status === 'INACTIVE' ? 0.7 : 1,
          position: 'relative',
          overflow: 'hidden',
        }}
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
              label={difficultyConfig.label}
              size="small"
              color={difficultyConfig.color as any}
              variant="outlined"
              sx={{ fontWeight: 500 }}
            />
          </Box>

          {/* Progress bar for participating challenges */}
          {isParticipating && !isCompleted && challenge.userProgress && (
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  Progreso
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {challenge.userProgress.progress || 0}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={challenge.userProgress.progress || 0}
                sx={{
                  height: 6,
                  borderRadius: 3,
                  bgcolor: `${categoryConfig.color}20`,
                  '& .MuiLinearProgress-bar': {
                    bgcolor: categoryConfig.color,
                    borderRadius: 3,
                  },
                }}
              />
            </Box>
          )}

          {/* Challenge metadata */}
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
            {/* Duration */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Schedule sx={{ fontSize: 16, color: 'text.secondary' }} />
              <Typography variant="caption" color="text.secondary">
                {formatDuration(challenge.duration)}
              </Typography>
            </Box>

            {/* Participants */}
            {challenge.participantCount !== undefined && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Group sx={{ fontSize: 16, color: 'text.secondary' }} />
                <Typography variant="caption" color="text.secondary">
                  {challenge.participantCount.toLocaleString()}
                </Typography>
              </Box>
            )}

            {/* Points/Rewards */}
            {challenge.points && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Star sx={{ fontSize: 16, color: 'warning.main' }} />
                <Typography variant="caption" color="text.secondary">
                  {formatPoints(challenge.points)}
                </Typography>
              </Box>
            )}
          </Box>

          {/* Completion status */}
          {isCompleted && (
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: 'success.main',
                color: 'success.contrastText',
                textAlign: 'center',
                mb: 2,
              }}
            >
              <Typography variant="body2" fontWeight={600}>
                🎉 ¡Challenge Completado!
              </Typography>
              {challenge.userProgress?.completedAt && (
                <Typography variant="caption">
                  Completado el{' '}
                  {new Date(challenge.userProgress.completedAt).toLocaleDateString()}
                </Typography>
              )}
            </Box>
          )}
        </CardContent>

        {/* Action buttons */}
        {showActions && !isMinimal && (
          <CardActions sx={{ p: 2, pt: 0 }}>
            <Box sx={{ display: 'flex', gap: 1, width: '100%' }}>
              {!isParticipating && !isCompleted && (
                <Button
                  variant="contained"
                  fullWidth
                  onClick={handleJoinClick}
                  sx={{
                    bgcolor: categoryConfig.color,
                    '&:hover': {
                      bgcolor: categoryConfig.color,
                      transform: 'scale(1.02)',
                    },
                  }}
                >
                  Unirse al Challenge
                </Button>
              )}

              {isParticipating && !isCompleted && (
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={handleViewClick}
                  sx={{
                    borderColor: categoryConfig.color,
                    color: categoryConfig.color,
                    '&:hover': {
                      bgcolor: `${categoryConfig.color}15`,
                      borderColor: categoryConfig.color,
                    },
                  }}
                >
                  Continuar Challenge
                </Button>
              )}

              {isCompleted && (
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={handleViewClick}
                  color="success"
                >
                  Ver Detalles
                </Button>
              )}

              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDetails(true);
                }}
                sx={{
                  color: categoryConfig.color,
                  '&:hover': {
                    bgcolor: `${categoryConfig.color}15`,
                  },
                }}
              >
                <Info />
              </IconButton>
            </Box>
          </CardActions>
        )}
      </CosmicCard>

      {/* Details Dialog */}
      <Dialog open={showDetails} onClose={() => setShowDetails(false)} maxWidth="md">
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: categoryConfig.color }}>
              <CategoryIcon />
            </Avatar>
            <Box>
              <Typography variant="h6">{challenge.title}</Typography>
              <Typography variant="body2" color="text.secondary">
                {categoryConfig.label} • {difficultyConfig.label}
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
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                🎁 Recompensas:
              </Typography>
              <List dense>
                {challenge.rewards.map((reward, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <WorkspacePremium color="warning" />
                    </ListItemIcon>
                    <ListItemText primary={reward.description} secondary={reward.type} />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setShowDetails(false)}>Cerrar</Button>
          {!isParticipating && !isCompleted && (
            <Button
              variant="contained"
              onClick={(e) => {
                setShowDetails(false);
                handleJoinClick(e);
              }}
              sx={{ bgcolor: categoryConfig.color }}
            >
              Unirse al Challenge
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
};
