import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Stack,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  LinearProgress,
  Tooltip,
  Badge,
  Divider,
  Collapse,
  IconButton,
} from '@mui/material';
import {
  EmojiEvents as TrophyIcon,
  Star as StarIcon,
  Diamond as DiamondIcon,
  LocalFireDepartment as FireIcon,
  School as SchoolIcon,
  Speed as SpeedIcon,
  Quiz as QuizIcon,
  Favorite as FavoriteIcon,
  Share as ShareIcon,
  Lock as LockIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Info as InfoIcon,
} from '@mui/icons-material';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  earnedAt: Date;
  meritsReward: number;
  category: 'learning' | 'engagement' | 'social' | 'streak' | 'special';
}

interface Badge {
  id: string;
  name: string;
  icon: string;
  progress: number;
  maxProgress: number;
  category: string;
  description: string;
  isUnlocked: boolean;
}

interface AchievementSystemProps {
  achievements: Achievement[];
  badges: Badge[];
  totalMerits: number;
  currentLevel: number;
  onShareAchievement?: (achievement: Achievement) => void;
}

const AchievementSystem: React.FC<AchievementSystemProps> = ({
  achievements,
  badges,
  totalMerits,
  currentLevel,
  onShareAchievement,
}) => {
  const [selectedAchievement, setSelectedAchievement] =
    useState<Achievement | null>(null);
  const [showAllAchievements, setShowAllAchievements] = useState(false);
  const [showAllBadges, setShowAllBadges] = useState(false);

  // Mock additional achievements for demonstration
  const allAchievements: Achievement[] = [
    ...achievements,
    {
      id: 'first_question',
      name: 'Primera Pregunta',
      description: 'Respondiste tu primera pregunta interactiva',
      icon: '🎯',
      rarity: 'common',
      earnedAt: new Date(Date.now() - 172800000), // 2 days ago
      meritsReward: 25,
      category: 'engagement',
    },
    {
      id: 'speed_learner',
      name: 'Aprendiz Veloz',
      description: 'Completaste 5 videos en velocidad 1.5x o superior',
      icon: '⚡',
      rarity: 'rare',
      earnedAt: new Date(Date.now() - 86400000), // 1 day ago
      meritsReward: 100,
      category: 'learning',
    },
    {
      id: 'social_butterfly',
      name: 'Mariposa Social',
      description: 'Compartiste 10 videos con la comunidad',
      icon: '🦋',
      rarity: 'epic',
      earnedAt: new Date(Date.now() - 43200000), // 12 hours ago
      meritsReward: 250,
      category: 'social',
    },
  ];

  // Mock additional badges for demonstration
  const allBadges: Badge[] = [
    ...badges,
    {
      id: 'perfectionist',
      name: 'Perfeccionista',
      icon: '💎',
      progress: 8,
      maxProgress: 10,
      category: 'accuracy',
      description: 'Obtén 100% de precisión en 10 videos consecutivos',
      isUnlocked: false,
    },
    {
      id: 'marathon_runner',
      name: 'Maratonista',
      icon: '🏃‍♂️',
      progress: 15,
      maxProgress: 20,
      category: 'endurance',
      description: 'Ve 20 horas de contenido educativo',
      isUnlocked: false,
    },
    {
      id: 'night_owl',
      name: 'Búho Nocturno',
      icon: '🦉',
      progress: 5,
      maxProgress: 7,
      category: 'special',
      description: 'Completa sesiones después de las 10 PM por 7 días',
      isUnlocked: false,
    },
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return '#64748b';
      case 'rare':
        return '#3b82f6';
      case 'epic':
        return '#8b5cf6';
      case 'legendary':
        return '#f59e0b';
      default:
        return '#64748b';
    }
  };

  const getRarityGradient = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return 'linear-gradient(135deg, #64748b 0%, #94a3b8 100%)';
      case 'rare':
        return 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)';
      case 'epic':
        return 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)';
      case 'legendary':
        return 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)';
      default:
        return 'linear-gradient(135deg, #64748b 0%, #94a3b8 100%)';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'learning':
        return <SchoolIcon />;
      case 'engagement':
        return <QuizIcon />;
      case 'social':
        return <ShareIcon />;
      case 'streak':
        return <FireIcon />;
      case 'special':
        return <StarIcon />;
      default:
        return <TrophyIcon />;
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return 'Hace unos minutos';
    if (diffInHours < 24) return `Hace ${diffInHours} horas`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `Hace ${diffInDays} días`;
  };

  const AchievementCard = ({
    achievement,
    isLocked = false,
  }: {
    achievement: Achievement;
    isLocked?: boolean;
  }) => (
    <Card
      sx={{
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        borderRadius: 3,
        overflow: 'hidden',
        background: isLocked ? '#f8fafc' : 'white',
        opacity: isLocked ? 0.6 : 1,
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: `0 12px 40px ${getRarityColor(achievement.rarity)}40`,
        },
        border: `2px solid ${getRarityColor(achievement.rarity)}`,
      }}
      onClick={() => !isLocked && setSelectedAchievement(achievement)}
    >
      <Box
        sx={{
          background: getRarityGradient(achievement.rarity),
          p: 2,
          color: 'white',
          textAlign: 'center',
        }}
      >
        <Typography variant="h3" sx={{ mb: 1 }}>
          {isLocked ? '🔒' : achievement.icon}
        </Typography>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, opacity: 0.9 }}>
          {achievement.rarity.toUpperCase()}
        </Typography>
      </Box>
      <CardContent sx={{ p: 2 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
          {achievement.name}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 2, lineHeight: 1.4 }}
        >
          {achievement.description}
        </Typography>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Chip
            icon={<DiamondIcon />}
            label={`+${achievement.meritsReward}`}
            size="small"
            sx={{
              bgcolor: '#fef3c7',
              color: '#92400e',
              fontWeight: 600,
              '& .MuiChip-icon': { color: '#f59e0b' },
            }}
          />
          {!isLocked && (
            <Typography variant="caption" color="text.secondary">
              {formatTimeAgo(achievement.earnedAt)}
            </Typography>
          )}
        </Stack>
      </CardContent>
    </Card>
  );

  const BadgeCard = ({ badge }: { badge: Badge }) => (
    <Card
      sx={{
        borderRadius: 3,
        overflow: 'hidden',
        background: badge.isUnlocked ? 'white' : '#f8fafc',
        opacity: badge.isUnlocked ? 1 : 0.7,
        border: `2px solid ${badge.isUnlocked ? '#6366f1' : '#e2e8f0'}`,
      }}
    >
      <CardContent sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="h4" sx={{ mb: 1 }}>
          {badge.isUnlocked ? badge.icon : '🔒'}
        </Typography>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
          {badge.name}
        </Typography>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ mb: 2, display: 'block' }}
        >
          {badge.description}
        </Typography>

        <Box sx={{ mt: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="caption" sx={{ fontWeight: 600 }}>
              Progreso
            </Typography>
            <Typography variant="caption" sx={{ fontWeight: 600 }}>
              {badge.progress}/{badge.maxProgress}
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={(badge.progress / badge.maxProgress) * 100}
            sx={{
              height: 6,
              borderRadius: 3,
              bgcolor: '#e5e7eb',
              '& .MuiLinearProgress-bar': {
                borderRadius: 3,
                background: badge.isUnlocked
                  ? 'linear-gradient(90deg, #10b981 0%, #34d399 100%)'
                  : 'linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%)',
              },
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box>
      {/* Header */}
      <Card sx={{ mb: 3, borderRadius: 3, overflow: 'hidden' }}>
        <Box
          sx={{
            background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
            color: 'white',
            p: 3,
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              mb: 1,
            }}
          >
            <TrophyIcon sx={{ mr: 1, fontSize: 32 }} />
            Sistema de Logros
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9 }}>
            {achievements.length} logros desbloqueados •{' '}
            {badges.filter((b) => b.isUnlocked).length} insignias activas
          </Typography>
        </Box>

        <CardContent sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Box textAlign="center">
                <Typography
                  variant="h4"
                  color="warning.main"
                  sx={{ fontWeight: 800 }}
                >
                  {achievements.length}
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  Logros Desbloqueados
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box textAlign="center">
                <Typography
                  variant="h4"
                  color="primary"
                  sx={{ fontWeight: 800 }}
                >
                  {achievements.reduce(
                    (sum, achievement) => sum + achievement.meritsReward,
                    0
                  )}
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  Mëritos por Logros
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box textAlign="center">
                <Typography
                  variant="h4"
                  color="success.main"
                  sx={{ fontWeight: 800 }}
                >
                  {Math.round(
                    (badges.filter((b) => b.isUnlocked).length /
                      allBadges.length) *
                      100
                  )}
                  %
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  Insignias Completadas
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Recent Achievements */}
      <Card sx={{ mb: 3, borderRadius: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              🏆 Logros Recientes
            </Typography>
            <Button
              endIcon={
                showAllAchievements ? <ExpandLessIcon /> : <ExpandMoreIcon />
              }
              onClick={() => setShowAllAchievements(!showAllAchievements)}
              size="small"
            >
              {showAllAchievements ? 'Ver menos' : 'Ver todos'}
            </Button>
          </Box>

          <Grid container spacing={2}>
            {(showAllAchievements
              ? allAchievements
              : achievements.slice(0, 3)
            ).map((achievement) => (
                              <Grid item xs={12} sm={6} md={4} key={achievement.id}>
                <AchievementCard achievement={achievement} />
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Active Badges */}
      <Card sx={{ mb: 3, borderRadius: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              🎖️ Insignias en Progreso
            </Typography>
            <Button
              endIcon={showAllBadges ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              onClick={() => setShowAllBadges(!showAllBadges)}
              size="small"
            >
              {showAllBadges ? 'Ver menos' : 'Ver todas'}
            </Button>
          </Box>

          <Grid container spacing={2}>
            {(showAllBadges ? allBadges : allBadges.slice(0, 3)).map(
              (badge) => (
                <Grid item xs={12} sm={6} md={4} key={badge.id}>
                  <BadgeCard badge={badge} />
                </Grid>
              )
            )}
          </Grid>
        </CardContent>
      </Card>

      {/* Achievement Detail Dialog */}
      <Dialog
        open={!!selectedAchievement}
        onClose={() => setSelectedAchievement(null)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            overflow: 'hidden',
          },
        }}
      >
        {selectedAchievement && (
          <>
            <Box
              sx={{
                background: getRarityGradient(selectedAchievement.rarity),
                color: 'white',
                p: 4,
                textAlign: 'center',
              }}
            >
              <Typography variant="h2" sx={{ mb: 2 }}>
                {selectedAchievement.icon}
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                {selectedAchievement.name}
              </Typography>
              <Chip
                label={selectedAchievement.rarity.toUpperCase()}
                sx={{
                  bgcolor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  fontWeight: 700,
                }}
              />
            </Box>

            <DialogContent sx={{ p: 4 }}>
              <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.6 }}>
                {selectedAchievement.description}
              </Typography>

              <Stack spacing={2}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    Recompensa:
                  </Typography>
                  <Chip
                    icon={<DiamondIcon />}
                    label={`+${selectedAchievement.meritsReward} Mëritos`}
                    sx={{
                      bgcolor: '#fef3c7',
                      color: '#92400e',
                      fontWeight: 600,
                      '& .MuiChip-icon': { color: '#f59e0b' },
                    }}
                  />
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    Categoría:
                  </Typography>
                  <Chip
                    icon={getCategoryIcon(selectedAchievement.category)}
                    label={selectedAchievement.category}
                    size="small"
                    variant="outlined"
                  />
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    Desbloqueado:
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedAchievement.earnedAt.toLocaleDateString()} -{' '}
                    {formatTimeAgo(selectedAchievement.earnedAt)}
                  </Typography>
                </Box>
              </Stack>

              <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
                <Button
                  variant="contained"
                  startIcon={<ShareIcon />}
                  onClick={() => onShareAchievement?.(selectedAchievement)}
                  sx={{
                    background:
                      'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    flex: 1,
                  }}
                >
                  Compartir Logro
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => setSelectedAchievement(null)}
                >
                  Cerrar
                </Button>
              </Stack>
            </DialogContent>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default AchievementSystem;
