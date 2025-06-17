import React, { useState, useEffect, useCallback, useMemo } from 'react';

// 🎯 REGLA #1: IMPORTS ESPECÍFICOS DE MATERIAL UI
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import { useTheme, alpha } from '@mui/material';

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
  const [selectedPeriod, setSelectedPeriod] = useState<
    'daily' | 'weekly' | 'monthly'
  >('daily');

  // 🎯 Calcular progreso hacia siguiente nivel
  const levelProgress = useMemo(() => {
    return Math.min(100, (currentXP / nextLevelXP) * 100);
  }, [currentXP, nextLevelXP]);

  // 🎯 Filtrar achievements por período seleccionado
  const filteredAchievements = useMemo(() => {
    return achievements.filter(
      (achievement) => achievement.category === selectedPeriod
    );
  }, [achievements, selectedPeriod]);

  // 🎯 Calcular estadísticas de achievements
  const achievementStats = useMemo(() => {
    const completed = filteredAchievements.filter((a) => a.isCompleted).length;
    const total = filteredAchievements.length;
    const percentage = total > 0 ? (completed / total) * 100 : 0;

    return { completed, total, percentage };
  }, [filteredAchievements]);

  // 🎯 Datos de progreso por período
  const progressData = useMemo(() => {
    switch (selectedPeriod) {
      case 'daily':
        return {
          current: dailyGoals,
          target: 5,
          label: 'Objetivos Diarios',
          icon: <TodayIcon />,
          color: '#FF6B35',
        };
      case 'weekly':
        return {
          current: weeklyGoals,
          target: 15,
          label: 'Objetivos Semanales',
          icon: <CalendarMonthIcon />,
          color: '#4FC3F7',
        };
      case 'monthly':
        return {
          current: monthlyGoals,
          target: 50,
          label: 'Objetivos Mensuales',
          icon: <CalendarMonthIcon />,
          color: '#8BC34A',
        };
    }
  }, [selectedPeriod, dailyGoals, weeklyGoals, monthlyGoals]);

  // 🧹 CLEANUP OBLIGATORIO según Builder.io
  useEffect(() => {
    return () => {
      console.log('🧹 Cleaning up PersonalProgressWidget');
    };
  }, []);

  // 🎯 Handlers
  const handleExpandToggle = useCallback(() => {
    setExpanded((prev) => !prev);
  }, []);

  const handlePeriodChange = useCallback(
    (period: 'daily' | 'weekly' | 'monthly') => {
      setSelectedPeriod(period);
    },
    []
  );

  // 🎨 Renderizar nivel y progreso principal
  const renderLevelProgress = () => (
    <Box sx={{ mb: 3 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
        }}
      >
        <Box>
          <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
            {userLevel}
          </Typography>
          <Typography variant="body2" sx={{ color: alpha('#fff', 0.7) }}>
            Nivel Actual
          </Typography>
        </Box>
        <Box sx={{ textAlign: 'right' }}>
          <Typography
            variant="h6"
            sx={{ color: '#8BC34A', fontWeight: 'bold' }}
          >
            {currentXP.toLocaleString()} XP
          </Typography>
          <Typography variant="caption" sx={{ color: alpha('#fff', 0.7) }}>
            {(nextLevelXP - currentXP).toLocaleString()} para siguiente nivel
          </Typography>
        </Box>
      </Box>

      <LinearProgress
        variant="determinate"
        value={levelProgress}
        sx={{
          height: 12,
          borderRadius: 6,
          bgcolor: alpha('#fff', 0.1),
          '& .MuiLinearProgress-bar': {
            borderRadius: 6,
            background: 'linear-gradient(90deg, #8BC34A 0%, #4FC3F7 100%)',
          },
        }}
      />

      <Typography
        variant="caption"
        sx={{
          color: alpha('#fff', 0.8),
          mt: 1,
          display: 'block',
          textAlign: 'center',
        }}
      >
        {Math.round(levelProgress)}% progreso hacia siguiente nivel
      </Typography>
    </Box>
  );

  // 🎯 Renderizar selector de período
  const renderPeriodSelector = () => (
    <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
      {[
        { key: 'daily' as const, label: 'Hoy', icon: <TodayIcon /> },
        {
          key: 'weekly' as const,
          label: 'Semana',
          icon: <CalendarMonthIcon />,
        },
        { key: 'monthly' as const, label: 'Mes', icon: <CalendarMonthIcon /> },
      ].map((period) => (
        <Chip
          key={period.key}
          icon={period.icon}
          label={period.label}
          onClick={() => handlePeriodChange(period.key)}
          sx={{
            bgcolor:
              selectedPeriod === period.key
                ? alpha(progressData.color, 0.3)
                : alpha('#fff', 0.1),
            color:
              selectedPeriod === period.key
                ? progressData.color
                : alpha('#fff', 0.8),
            border:
              selectedPeriod === period.key
                ? `1px solid ${progressData.color}`
                : `1px solid ${alpha('#fff', 0.2)}`,
            '&:hover': {
              bgcolor: alpha(progressData.color, 0.2),
            },
          }}
        />
      ))}
    </Box>
  );

  // 📊 Renderizar progreso de objetivos
  const renderGoalsProgress = () => (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <Box sx={{ color: progressData.color }}>{progressData.icon}</Box>
        <Typography
          variant="subtitle1"
          sx={{ color: 'white', fontWeight: 'bold' }}
        >
          {progressData.label}
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 1,
        }}
      >
        <Typography
          variant="h4"
          sx={{ color: progressData.color, fontWeight: 'bold' }}
        >
          {progressData.current}
        </Typography>
        <Typography variant="body2" sx={{ color: alpha('#fff', 0.7) }}>
          de {progressData.target} objetivos
        </Typography>
      </Box>

      <LinearProgress
        variant="determinate"
        value={(progressData.current / progressData.target) * 100}
        sx={{
          height: 8,
          borderRadius: 4,
          bgcolor: alpha('#fff', 0.1),
          '& .MuiLinearProgress-bar': {
            borderRadius: 4,
            bgcolor: progressData.color,
          },
        }}
      />
    </Box>
  );

  // 🏆 Renderizar achievements
  const renderAchievements = () => (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{ color: 'white', fontWeight: 'bold' }}
        >
          Logros{' '}
          {selectedPeriod === 'daily'
            ? 'Diarios'
            : selectedPeriod === 'weekly'
              ? 'Semanales'
              : 'Mensuales'}
        </Typography>
        <Typography variant="caption" sx={{ color: alpha('#fff', 0.7) }}>
          {achievementStats.completed}/{achievementStats.total} completados
        </Typography>
      </Box>

      <Grid container spacing={2}>
        {filteredAchievements
          .slice(0, expanded ? filteredAchievements.length : 3)
          .map((achievement) => (
            <Grid item xs={12} key={achievement.id}>
              <Tooltip
                title={
                  <Box>
                    <Typography variant="subtitle2">
                      {achievement.title}
                    </Typography>
                    <Typography variant="caption">
                      {achievement.description}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ display: 'block', mt: 1, fontWeight: 'bold' }}
                    >
                      🎁 Recompensa: {achievement.reward}
                    </Typography>
                  </Box>
                }
                arrow
              >
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    background: achievement.isCompleted
                      ? `linear-gradient(135deg, ${alpha(achievement.color, 0.2)} 0%, ${alpha(achievement.color, 0.1)} 100%)`
                      : alpha('#fff', 0.05),
                    border: `1px solid ${
                      achievement.isCompleted
                        ? alpha(achievement.color, 0.4)
                        : alpha('#fff', 0.1)
                    }`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: achievement.isCompleted
                        ? `linear-gradient(135deg, ${alpha(achievement.color, 0.3)} 0%, ${alpha(achievement.color, 0.15)} 100%)`
                        : alpha('#fff', 0.1),
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  <Avatar
                    sx={{
                      bgcolor: achievement.isCompleted
                        ? achievement.color
                        : alpha('#fff', 0.1),
                      color: achievement.isCompleted
                        ? 'white'
                        : alpha('#fff', 0.6),
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
                        color: 'white',
                        fontWeight: 'bold',
                        opacity: achievement.isCompleted ? 1 : 0.8,
                      }}
                    >
                      {achievement.title}
                    </Typography>

                    <LinearProgress
                      variant="determinate"
                      value={
                        (achievement.progress / achievement.maxProgress) * 100
                      }
                      sx={{
                        height: 4,
                        borderRadius: 2,
                        bgcolor: alpha('#fff', 0.1),
                        mt: 1,
                        '& .MuiLinearProgress-bar': {
                          borderRadius: 2,
                          bgcolor: achievement.color,
                        },
                      }}
                    />

                    <Typography
                      variant="caption"
                      sx={{
                        color: alpha('#fff', 0.7),
                        mt: 0.5,
                        display: 'block',
                      }}
                    >
                      {achievement.progress}/{achievement.maxProgress}
                      {achievement.isCompleted && ' ✅ Completado'}
                    </Typography>
                  </Box>

                  {achievement.isCompleted && (
                    <Box sx={{ color: achievement.color }}>
                      <WorkspacePremiumIcon />
                    </Box>
                  )}
                </Box>
              </Tooltip>
            </Grid>
          ))}
      </Grid>
    </Box>
  );

  return (
    <Card
      className={`glassmorphism-card interactive-card-advanced personal-progress-widget ${className}`}
      sx={{
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.background.paper, 0.8)} 100%)`,
        border: `1px solid ${alpha('#fff', 0.1)}`,
        borderRadius: 3,
        overflow: 'hidden',
        position: 'relative',
        transition: 'all 0.4s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.3)}`,
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 3,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                p: 1.5,
                borderRadius: 2,
                background: 'linear-gradient(135deg, #8BC34A 0%, #4FC3F7 100%)',
                color: 'white',
                animation: 'pulse 2s ease-in-out infinite',
              }}
            >
              <TrendingUpIcon />
            </Box>
            <Box>
              <Typography
                variant="h6"
                sx={{ fontWeight: 'bold', color: 'white' }}
              >
                Progreso Personal
              </Typography>
              <Typography variant="body2" sx={{ color: alpha('#fff', 0.8) }}>
                Tu evolución en CoomÜnity
              </Typography>
            </Box>
          </Box>

          <IconButton
            onClick={handleExpandToggle}
            sx={{
              color: theme.palette.primary.main,
              transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.3s ease',
            }}
          >
            <ExpandMoreIcon />
          </IconButton>
        </Box>

        {/* Progreso de nivel */}
        {renderLevelProgress()}

        <Divider sx={{ bgcolor: alpha('#fff', 0.1), my: 3 }} />

        {/* Selector de período */}
        {renderPeriodSelector()}

        {/* Progreso de objetivos */}
        {renderGoalsProgress()}

        {/* Achievements expandibles */}
        {expanded && (
          <>
            <Divider sx={{ bgcolor: alpha('#fff', 0.1), my: 3 }} />
            {renderAchievements()}
          </>
        )}

        {/* Estadísticas de logros compacta */}
        {!expanded && (
          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              background: alpha(theme.palette.success.main, 0.1),
              border: `1px solid ${alpha(theme.palette.success.main, 0.3)}`,
              textAlign: 'center',
            }}
          >
            <Typography variant="caption" sx={{ color: alpha('#fff', 0.9) }}>
              🏆 {achievementStats.completed} logros completados hoy
              {achievementStats.percentage > 0 &&
                ` (${Math.round(achievementStats.percentage)}%)`}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default PersonalProgressWidget;
