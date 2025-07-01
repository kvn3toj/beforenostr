import React, { useState, useEffect, useCallback, useMemo } from 'react';

// 🎯 REGLA #1: IMPORTS ESPECÍFICOS DE MATERIAL UI
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import { useTheme, alpha } from '@mui/material';

// 🌌 COSMIC DESIGN SYSTEM IMPORTS - ARIA (Frontend Artist)
import { CosmicCard } from '../../design-system';
import { UNIFIED_COLORS } from '../../theme/colors';

// 🎯 REGLA #1: IMPORTS ESPECÍFICOS DE ICONOS
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import StarIcon from '@mui/icons-material/Star';
import DiamondIcon from '@mui/icons-material/Diamond';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TodayIcon from '@mui/icons-material/Today';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactElement;
  color: string;
  progress: number;
  maxProgress: number;
  isCompleted: boolean;
  reward: string;
  category: 'daily' | 'weekly' | 'monthly' | 'special';
}

interface PersonalProgressWidgetProps {
  userLevel: string;
  currentXP: number;
  nextLevelXP: number;
  dailyGoals: number;
  weeklyGoals: number;
  monthlyGoals: number;
  achievements: Achievement[];
  className?: string;
}

export const PersonalProgressWidget: React.FC<PersonalProgressWidgetProps> = ({
  userLevel,
  currentXP,
  nextLevelXP,
  dailyGoals,
  weeklyGoals,
  monthlyGoals,
  achievements,
  className = '',
}) => {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('daily');

  // Calculamos el progreso hacia el próximo nivel
  const levelProgress = useMemo(() =>
    Math.min((currentXP / nextLevelXP) * 100, 100),
    [currentXP, nextLevelXP]
  );

  // Estadísticas de logros por categoría
  const achievementStats = useMemo(() => {
    const categories = ['daily', 'weekly', 'monthly', 'special'];
    const stats: Record<string, { completed: number; total: number; progress: number }> = {};

    categories.forEach(category => {
      const categoryAchievements = achievements.filter(a => a.category === category);
      const completed = categoryAchievements.filter(a => a.isCompleted).length;
      const total = categoryAchievements.length;
      const progress = total > 0 ? (completed / total) * 100 : 0;

      stats[category] = { completed, total, progress };
    });

    return stats;
  }, [achievements]);

  // Configuración de categorías con elementos cósmicos
  const categoryConfig = {
    daily: {
      label: 'Diarios',
      icon: <TodayIcon />,
      color: UNIFIED_COLORS.elements.fuego.primary,
      element: 'fuego' as const,
      goals: dailyGoals,
    },
    weekly: {
      label: 'Semanales',
      icon: <CalendarMonthIcon />,
      color: UNIFIED_COLORS.elements.agua.primary,
      element: 'agua' as const,
      goals: weeklyGoals,
    },
    monthly: {
      label: 'Mensuales',
      icon: <EmojiEventsIcon />,
      color: UNIFIED_COLORS.elements.tierra.primary,
      element: 'tierra' as const,
      goals: monthlyGoals,
    },
    special: {
      label: 'Especiales',
      icon: <WorkspacePremiumIcon />,
      color: UNIFIED_COLORS.elements.eter.primary,
      element: 'espiritu' as const,
      goals: 0,
    },
  };

  // Renderizar estadísticas principales
  const renderMainStats = () => (
    <Grid container spacing={2} sx={{ marginBottom: 3 }}>
      <Grid item xs={12}>
        {/* Progreso de Nivel Cósmico */}
        <CosmicCard
          variant="elevated"
          element="espiritu"
          cosmicIntensity="subtle"
          enableGlow
          enableAnimations
          sx={{ padding: 2, marginBottom: 2 }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, marginBottom: 2 }}>
            <Avatar
              sx={{
                width: 50,
                height: 50,
                background: `linear-gradient(135deg, ${UNIFIED_COLORS.elements.eter.primary} 0%, ${UNIFIED_COLORS.elements.eter.dark} 100%)`,
                color: 'white',
                fontWeight: 'bold',
                fontSize: '1.1rem',
              }}
            >
              {userLevel}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  background: `linear-gradient(135deg, ${UNIFIED_COLORS.elements.eter.primary} 0%, ${UNIFIED_COLORS.elements.agua.primary} 100%)`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Nivel {userLevel}
              </Typography>
              <Typography variant="body2" sx={{ color: alpha('#000', 0.7) }}>
                {currentXP.toLocaleString()} / {nextLevelXP.toLocaleString()} XP
              </Typography>
            </Box>
            <Chip
              icon={<TrendingUpIcon />}
              label={`${levelProgress.toFixed(0)}%`}
              sx={{
                background: `linear-gradient(135deg, ${UNIFIED_COLORS.elements.eter.primary} 0%, ${UNIFIED_COLORS.elements.eter.dark} 100%)`,
                color: 'white',
                fontWeight: 600,
              }}
            />
          </Box>

          <LinearProgress
            variant="determinate"
            value={levelProgress}
            sx={{
              height: 8,
              borderRadius: 4,
              bgcolor: alpha(UNIFIED_COLORS.elements.eter.primary, 0.2),
              '& .MuiLinearProgress-bar': {
                borderRadius: 4,
                background: `linear-gradient(90deg, ${UNIFIED_COLORS.elements.eter.primary} 0%, ${UNIFIED_COLORS.elements.fuego.primary} 100%)`,
              },
            }}
          />
        </CosmicCard>
      </Grid>

      {/* Estadísticas de categorías */}
      {Object.entries(categoryConfig).map(([key, config]) => {
        const stats = achievementStats[key];
        return (
          <Grid item xs={6} sm={3} key={key}>
            <CosmicCard
              variant="elevated"
              element={config.element}
              cosmicIntensity="subtle"
              enableGlow
              sx={{
                padding: 1.5,
                textAlign: 'center',
                cursor: 'pointer',
                border: selectedCategory === key ? `2px solid ${config.color}` : 'none',
                transform: selectedCategory === key ? 'scale(1.05)' : 'scale(1)',
                transition: 'all 0.3s ease',
              }}
              onClick={() => setSelectedCategory(key)}
            >
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  margin: '0 auto',
                  marginBottom: 1,
                  background: `linear-gradient(135deg, ${config.color} 0%, ${alpha(config.color, 0.8)} 100%)`,
                  color: 'white',
                }}
              >
                {config.icon}
              </Avatar>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: config.color,
                  fontSize: '1rem',
                }}
              >
                {stats.completed}/{stats.total}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: alpha('#000', 0.7),
                  fontSize: '0.75rem',
                }}
              >
                {config.label}
              </Typography>
            </CosmicCard>
          </Grid>
        );
      })}
    </Grid>
  );

  // Renderizar logros por categoría
  const renderAchievements = () => {
    const filteredAchievements = achievements.filter(
      achievement => achievement.category === selectedCategory
    );

    if (filteredAchievements.length === 0) {
      return (
        <CosmicCard
          variant="elevated"
          element="aire"
          cosmicIntensity="subtle"
          sx={{ padding: 3, textAlign: 'center' }}
        >
          <Typography sx={{ color: alpha('#000', 0.6) }}>
            No hay logros en esta categoría aún
          </Typography>
        </CosmicCard>
      );
    }

    return (
      <Grid container spacing={2}>
        {filteredAchievements.map((achievement) => (
          <Grid item xs={12} key={achievement.id}>
            <CosmicCard
              variant="elevated"
              element={categoryConfig[achievement.category].element}
              cosmicIntensity="subtle"
              enableGlow={achievement.isCompleted}
              sx={{
                padding: 2,
                opacity: achievement.isCompleted ? 1 : 0.8,
                border: achievement.isCompleted ? `1px solid ${achievement.color}` : 'none',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar
                  sx={{
                    bgcolor: achievement.isCompleted
                      ? achievement.color
                      : alpha(achievement.color, 0.3),
                    color: achievement.isCompleted ? 'white' : alpha('#000', 0.6),
                    width: 40,
                    height: 40,
                  }}
                >
                  {achievement.icon}
                </Avatar>

                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      color: achievement.isCompleted ? achievement.color : alpha('#000', 0.8),
                      fontWeight: 'bold',
                      opacity: achievement.isCompleted ? 1 : 0.8,
                    }}
                  >
                    {achievement.title}
                  </Typography>

                  <LinearProgress
                    variant="determinate"
                    value={(achievement.progress / achievement.maxProgress) * 100}
                    sx={{
                      height: 4,
                      borderRadius: 2,
                      bgcolor: alpha(achievement.color, 0.2),
                      marginTop: 1,
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 2,
                        bgcolor: achievement.color,
                      },
                    }}
                  />

                  <Typography
                    variant="caption"
                    sx={{
                      color: alpha('#000', 0.7),
                      marginTop: 0.5,
                      display: 'block',
                    }}
                  >
                    {achievement.progress}/{achievement.maxProgress}
                    {achievement.isCompleted && ' ✅ Completado'}
                  </Typography>
                </Box>

                {achievement.isCompleted && (
                  <Chip
                    icon={<StarIcon />}
                    label={achievement.reward}
                    size="small"
                    sx={{
                      background: `linear-gradient(135deg, ${achievement.color} 0%, ${alpha(achievement.color, 0.8)} 100%)`,
                      color: 'white',
                      fontWeight: 600,
                    }}
                  />
                )}
              </Box>
            </CosmicCard>
          </Grid>
        ))}
      </Grid>
    );
  };

  return (
    <CosmicCard
      variant="elevated"
      element="espiritu"
      cosmicIntensity="medium"
      enableGlow
      enableAnimations
      sx={{
        minHeight: '400px',
        padding: 3,
      }}
      className={`personal-progress-widget ${className}`}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            background: `linear-gradient(135deg, ${UNIFIED_COLORS.elements.eter.primary} 0%, ${UNIFIED_COLORS.elements.fuego.primary} 100%)`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontSize: '1.3rem'
          }}
        >
          🌟 Progreso Personal
        </Typography>

        <IconButton
          onClick={() => setExpanded(!expanded)}
          sx={{
            color: UNIFIED_COLORS.elements.eter.primary,
            transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s ease',
          }}
        >
          <ExpandMoreIcon />
        </IconButton>
      </Box>

      {/* Estadísticas principales */}
      {renderMainStats()}

      {/* Selector de categorías */}
      <Box sx={{ marginBottom: 3 }}>
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 600,
            marginBottom: 2,
            color: alpha('#000', 0.8)
          }}
        >
          Logros por Categoría
        </Typography>
      </Box>

      {/* Logros filtrados */}
      {renderAchievements()}
    </CosmicCard>
  );
};

export default PersonalProgressWidget;
