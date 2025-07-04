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
import { safeToString, safeLog } from '../../../utils/safeConversion';
import { useTheme } from '@mui/material/styles';

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
    case ChallengeCategory.CREATIVITY:
    case ChallengeCategory.INNOVATION:
      return 'fuego'; // Creatividad e innovación = fuego
    case ChallengeCategory.SOCIAL:
    case ChallengeCategory.COMMUNITY:
      return 'agua'; // Social y comunidad = agua
    case ChallengeCategory.LEARNING:
      return 'aire'; // Aprendizaje = aire
    case ChallengeCategory.SUSTAINABILITY:
       return 'tierra'; // Sostenibilidad = tierra
    case ChallengeCategory.WELLNESS:
    default:
      return 'espiritu'; // Bienestar y default = espíritu
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
      color: 'primary',
    },
    FITNESS: {
      icon: MonetizationOn,
      label: 'Fitness',
      color: 'primary',
    },
    CREATIVITY: {
      icon: Lightbulb,
      label: 'Creatividad',
      color: 'primary',
    },
    SOCIAL: {
      icon: Group,
      label: 'Social',
      color: 'primary',
    },
    LEARNING: {
      icon: School,
      label: 'Aprendizaje',
      color: 'primary',
    },
    HEALTH: {
      icon: Nature,
      label: 'Salud',
      color: 'primary',
    },
    MINDFULNESS: {
      icon: Psychology,
      label: 'Mindfulness',
      color: 'primary',
    },
    COMMUNITY: {
      icon: Public,
      label: 'Comunidad',
      color: 'primary',
    },
    EDUCATION: {
      icon: School,
      label: 'Educación',
      color: 'primary',
    },
    VOLUNTEERING: {
      icon: Recycling,
      label: 'Voluntariado',
      color: 'primary',
    },
    ART: {
      icon: EmojiObjects,
      label: 'Arte',
      color: 'primary',
    },
    WRITING: {
      icon: Lightbulb,
      label: 'Escritura',
      color: 'primary',
    },
    MEDITATION: {
      icon: Psychology,
      label: 'Meditación',
      color: 'primary',
    },
    SKILL_BUILDING: {
      icon: Timeline,
      label: 'Desarrollo de Habilidades',
      color: 'primary',
    },
  };

  return (
    configs[category] || {
      icon: EmojiEvents,
      label: category,
      color: 'primary',
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
  const theme = useTheme();
  const [liked, setLiked] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  // 🎨 Configuración visual
  const { color: difficultyColor, label: difficultyLabel } = getDifficultyColor(
    challenge.difficulty
  );

  const {
    icon: CategoryIcon,
    label: categoryLabel,
    color: categoryColor,
  } = getCategoryConfig(challenge.category);

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
    if (compact) return 280;
    return expanded ? 520 : 420;
  };

  return (
    <Card
      variant="outlined"
      elevation={0}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        borderRadius: 2,
        transition: 'all 0.2s ease-in-out',
        borderColor: 'divider',
        '&:hover': {
          borderColor: 'primary.main',
        },
      }}
    >
      <CardContent sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Chip
            icon={<CategoryIcon />}
            label={categoryLabel}
            size="small"
            variant="outlined"
            sx={{ borderColor: categoryColor, color: categoryColor }}
          />
          <Chip
            label={difficultyLabel}
            size="small"
            color={difficultyColor as any}
            variant="filled"
            sx={{ color: '#fff' }}
          />
        </Box>

        <Typography variant="h6" component="h2" sx={{ my: 1, fontWeight: 'bold' }}>
          {challenge.title}
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{
          height: 60,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}>
          {challenge.description}
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Stack spacing={1}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <MonetizationOn fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              Recompensa: {formatPoints(challenge.points)}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Schedule fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              Duración: {formatDuration(challenge.duration)}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Group fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              {challenge.participantCount} participantes
            </Typography>
          </Box>
        </Stack>

      </CardContent>

      <CardActions sx={{ p: 2, pt: 0, mt: 'auto' }}>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleJoinClick}
          startIcon={<PlayArrow />}
        >
          Unirse al Desafío
        </Button>
        <Tooltip title={liked ? 'Quitar de favoritos' : 'Añadir a favoritos'}>
          <IconButton onClick={handleLikeClick} color={liked ? 'primary' : 'default'}>
            <Favorite />
          </IconButton>
        </Tooltip>
        <Tooltip title="Compartir">
          <IconButton onClick={handleShareClick}>
            <Share />
          </IconButton>
        </Tooltip>
      </CardActions>
    </Card>
  );
};
