import React, { useState, useEffect, useMemo } from 'react';

// 🎯 REGLA #1: IMPORTS ESPECÍFICOS DE MATERIAL UI
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

// 🎯 REGLA #1: IMPORTS ESPECÍFICOS DE ICONOS
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import StarIcon from '@mui/icons-material/Star';
import DiamondIcon from '@mui/icons-material/Diamond';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import TerrainIcon from '@mui/icons-material/Terrain';
import AirIcon from '@mui/icons-material/Air';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import TimelineIcon from '@mui/icons-material/Timeline';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import DateRangeIcon from '@mui/icons-material/DateRange';
import EventIcon from '@mui/icons-material/Event';
import RefreshIcon from '@mui/icons-material/Refresh';

interface Achievement {
  id: string;
  title: string;
  description: string;
  progress: number;
  maxProgress: number;
  icon: string;
  category: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  element?: 'fire' | 'water' | 'earth' | 'air';
  reward: {
    type: 'xp' | 'currency' | 'badge';
    amount: number;
    currency?: string;
  };
}

interface PersonalProgressWidgetRevolutionaryProps {
  onAchievementClick?: (achievement: Achievement) => void;
  onViewAll?: () => void;
}

// 🎯 Achievements simulados
const mockAchievements: Achievement[] = [
  {
    id: '1',
    title: 'Maestro del Equilibrio',
    description: 'Mantén balance elemental por 7 días consecutivos',
    progress: 5,
    maxProgress: 7,
    icon: '⚖️',
    category: 'Balance',
    rarity: 'epic',
    element: 'water',
    reward: { type: 'xp', amount: 500 },
  },
  {
    id: '2',
    title: 'Colaborador Comunitario',
    description: 'Completa 10 acciones de bien común',
    progress: 7,
    maxProgress: 10,
    icon: '🤝',
    category: 'Social',
    rarity: 'rare',
    element: 'earth',
    reward: { type: 'currency', amount: 200, currency: 'BCM' },
  },
  {
    id: '3',
    title: 'Explorador UPlay',
    description: 'Ve 25 videos interactivos completos',
    progress: 18,
    maxProgress: 25,
    icon: '🎮',
    category: 'Entretenimiento',
    rarity: 'common',
    element: 'fire',
    reward: { type: 'xp', amount: 250 },
  },
  {
    id: '4',
    title: 'Sabio del Conocimiento',
    description: 'Completa 3 cursos certificados',
    progress: 2,
    maxProgress: 3,
    icon: '🧠',
    category: 'Educación',
    rarity: 'legendary',
    element: 'air',
    reward: { type: 'badge', amount: 1 },
  },
];

// 📊 Datos de progreso del usuario
const mockUserProgress = {
  currentLevel: 12,
  currentXP: 3450,
  nextLevelXP: 4000,
  totalXP: 15650,
  weeklyGoals: {
    completed: 4,
    total: 7,
    streak: 3,
  },
  monthlyStats: {
    achievements: 8,
    hoursActive: 24.5,
    contributions: 15,
  },
};

const PersonalProgressWidgetRevolutionary: React.FC<
  PersonalProgressWidgetRevolutionaryProps
> = ({ onAchievementClick, onViewAll }) => {
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'monthly'>(
    'weekly'
  );
  const [selectedTab, setSelectedTab] = useState(0);
  const [particles, setParticles] = useState<
    Array<{ id: string; x: number; y: number; element: string }>
  >([]);

  // 🎨 Configuración de rareza
  const rarityConfig = {
    common: {
      color: '#90A4AE',
      gradient: 'linear-gradient(135deg, #90A4AE, #B0BEC5)',
    },
    rare: {
      color: '#2196F3',
      gradient: 'linear-gradient(135deg, #2196F3, #42A5F5)',
    },
    epic: {
      color: '#9C27B0',
      gradient: 'linear-gradient(135deg, #9C27B0, #BA68C8)',
    },
    legendary: {
      color: '#FF9800',
      gradient: 'linear-gradient(135deg, #FF9800, #FFB74D)',
    },
  };

  // 🌟 Configuración de elementos
  const elementConfig = {
    fire: { color: '#FF6B35', icon: LocalFireDepartmentIcon },
    water: { color: '#00BCD4', icon: WaterDropIcon },
    earth: { color: '#66BB6A', icon: TerrainIcon },
    air: { color: '#FFD54F', icon: AirIcon },
  };

  // ✨ Generar partículas elementales
  useEffect(() => {
    const generateParticles = () => {
      const elements = ['fire', 'water', 'earth', 'air'];
      const newParticles = Array.from({ length: 8 }, (_, i) => ({
        id: `progress-particle-${i}`,
        x: Math.random() * 100,
        y: Math.random() * 100,
        element: elements[Math.floor(Math.random() * elements.length)],
      }));
      setParticles(newParticles);
    };

    generateParticles();
    const interval = setInterval(generateParticles, 4000);
    return () => clearInterval(interval);
  }, []);

  // 📈 Cálculos de progreso
  const levelProgress = useMemo(() => {
    const progressInLevel = mockUserProgress.currentXP;
    const totalForLevel = mockUserProgress.nextLevelXP;
    return (progressInLevel / totalForLevel) * 100;
  }, []);

  const weeklyProgress = useMemo(() => {
    return (
      (mockUserProgress.weeklyGoals.completed /
        mockUserProgress.weeklyGoals.total) *
      100
    );
  }, []);

  const handleAchievementClick = (achievement: Achievement) => {
    if (onAchievementClick) {
      onAchievementClick(achievement);
    }
  };

  const getTimeframeIcon = (tf: string) => {
    switch (tf) {
      case 'daily':
        return <CalendarTodayIcon />;
      case 'weekly':
        return <DateRangeIcon />;
      case 'monthly':
        return <EventIcon />;
      default:
        return <TimelineIcon />;
    }
  };

  return (
    <Box
      className="revolutionary-card"
      sx={{
        position: 'relative',
        background: 'var(--revolutionary-glass-medium)',
        backdropFilter: 'var(--revolutionary-blur-medium)',
        border: '2px solid var(--revolutionary-glass-strong)',
        borderRadius: 'var(--revolutionary-radius-xl)',
        padding: { xs: 2, sm: 3 },
        overflow: 'hidden',
        minHeight: 400,
      }}
    >
      {/* ✨ Partículas Elementales */}
      <Box className="revolutionary-particles">
        {particles.map((particle) => {
          const config =
            elementConfig[particle.element as keyof typeof elementConfig];
          return (
            <Box
              key={particle.id}
              sx={{
                position: 'absolute',
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                width: 5,
                height: 5,
                borderRadius: '50%',
                backgroundColor: config.color,
                boxShadow: `0 0 10px ${config.color}`,
                animation: 'revolutionary-sparkle 3s ease-in-out infinite',
                animationDelay: `${Math.random() * 2}s`,
              }}
            />
          );
        })}
      </Box>

      {/* 🎨 Borde Gradiente Superior */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          background:
            'linear-gradient(135deg, #FF6B35, #00BCD4, #66BB6A, #FFD54F)',
          opacity: 0.8,
        }}
      />

      {/* 📱 Header con Level */}
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
              width: 64,
              height: 64,
              borderRadius: '50%',
              background: `conic-gradient(from 0deg, #FF6B35 0deg, #00BCD4 90deg, #66BB6A 180deg, #FFD54F 270deg, #FF6B35 360deg)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              animation: 'revolutionary-rotate-continuous 12s linear infinite',
              position: 'relative',
              boxShadow: '0 8px 32px rgba(255, 107, 53, 0.3)',
            }}
          >
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                background: 'var(--revolutionary-glass-strong)',
                backdropFilter: 'var(--revolutionary-blur-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
              }}
            >
              <Typography
                variant="caption"
                sx={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.6rem' }}
              >
                NIVEL
              </Typography>
              <Typography
                variant="h6"
                sx={{ color: 'white', fontWeight: 700, fontSize: '1.1rem' }}
              >
                {mockUserProgress.currentLevel}
              </Typography>
            </Box>
          </Box>

          <Box>
            <Typography
              variant="h6"
              sx={{
                color: 'rgba(255, 255, 255, 0.9)',
                fontWeight: 600,
                fontSize: { xs: '1.1rem', sm: '1.3rem' },
              }}
            >
              Progreso Personal
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: 'rgba(255, 255, 255, 0.6)',
                fontSize: '0.9rem',
              }}
            >
              XP: {mockUserProgress.currentXP.toLocaleString()} /{' '}
              {mockUserProgress.nextLevelXP.toLocaleString()}
            </Typography>
          </Box>
        </Box>

        {/* 🔄 Refresh */}
        <Tooltip title="Actualizar progreso">
          <IconButton
            sx={{
              background: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.2)',
                transform: 'rotate(180deg)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {/* 📊 Progreso de Nivel */}
      <Box
        sx={{
          mb: 3,
          p: 2,
          background: 'rgba(255, 255, 255, 0.08)',
          borderRadius: 'var(--revolutionary-radius-md)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 1,
          }}
        >
          <Typography
            variant="body2"
            sx={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.9rem' }}
          >
            Progreso al Nivel {mockUserProgress.currentLevel + 1}
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: 'white', fontWeight: 600, fontSize: '0.9rem' }}
          >
            {levelProgress.toFixed(1)}%
          </Typography>
        </Box>

        <Box sx={{ position: 'relative' }}>
          <LinearProgress
            variant="determinate"
            value={levelProgress}
            sx={{
              height: 12,
              borderRadius: 6,
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              '& .MuiLinearProgress-bar': {
                background: 'linear-gradient(90deg, #FF6B35, #00BCD4, #66BB6A)',
                borderRadius: 6,
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background:
                    'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
                  animation: 'revolutionary-shimmer 2s ease-in-out infinite',
                },
              },
            }}
          />

          {/* ✨ Sparkle Effect */}
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: `${levelProgress}%`,
              transform: 'translate(-50%, -50%)',
              color: '#FFD700',
              animation: 'revolutionary-sparkle 2s ease-in-out infinite',
            }}
          >
            <AutoAwesomeIcon sx={{ fontSize: '1rem' }} />
          </Box>
        </Box>

        <Typography
          variant="caption"
          sx={{
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: '0.8rem',
            mt: 1,
            display: 'block',
          }}
        >
          {mockUserProgress.nextLevelXP - mockUserProgress.currentXP} XP
          restante para el siguiente nivel
        </Typography>
      </Box>

      {/* 🎯 Selector de Tiempo */}
      <Box sx={{ mb: 2 }}>
        <Tabs
          value={selectedTab}
          onChange={(_, newValue) => setSelectedTab(newValue)}
          variant="fullWidth"
          sx={{
            '& .MuiTab-root': {
              color: 'rgba(255, 255, 255, 0.7)',
              fontSize: '0.8rem',
              minHeight: 40,
              textTransform: 'none',
            },
            '& .Mui-selected': {
              color: 'white !important',
            },
            '& .MuiTabs-indicator': {
              background: 'linear-gradient(90deg, #FF6B35, #00BCD4)',
              height: 3,
              borderRadius: '2px 2px 0 0',
            },
          }}
        >
          <Tab label="📅 Diario" />
          <Tab label="📊 Semanal" />
          <Tab label="🎯 Mensual" />
        </Tabs>
      </Box>

      {/* 📈 Estadísticas por Tiempo */}
      <Box sx={{ mb: 3 }}>
        {selectedTab === 0 && (
          <Box className="revolutionary-grid-3" sx={{ gap: 1 }}>
            <Box className="revolutionary-metric-card" sx={{ p: 1.5 }}>
              <Typography
                variant="h6"
                sx={{ color: '#4CAF50', fontWeight: 700 }}
              >
                3
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
              >
                Logros hoy
              </Typography>
            </Box>
            <Box className="revolutionary-metric-card" sx={{ p: 1.5 }}>
              <Typography
                variant="h6"
                sx={{ color: '#2196F3', fontWeight: 700 }}
              >
                2.5h
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
              >
                Tiempo activo
              </Typography>
            </Box>
            <Box className="revolutionary-metric-card" sx={{ p: 1.5 }}>
              <Typography
                variant="h6"
                sx={{ color: '#FF9800', fontWeight: 700 }}
              >
                +320
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
              >
                XP ganada
              </Typography>
            </Box>
          </Box>
        )}

        {selectedTab === 1 && (
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
                variant="body1"
                sx={{ color: 'white', fontWeight: 600 }}
              >
                Objetivos Semanales
              </Typography>
              <Chip
                label={`Racha: ${mockUserProgress.weeklyGoals.streak} días`}
                size="small"
                sx={{
                  background: 'linear-gradient(135deg, #FF6B35, #FF8A50)',
                  color: 'white',
                  fontWeight: 600,
                }}
              />
            </Box>

            <Box sx={{ position: 'relative', mb: 2 }}>
              <LinearProgress
                variant="determinate"
                value={weeklyProgress}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  '& .MuiLinearProgress-bar': {
                    background: 'linear-gradient(90deg, #4CAF50, #66BB6A)',
                    borderRadius: 4,
                  },
                }}
              />
            </Box>

            <Typography
              variant="body2"
              sx={{ color: 'rgba(255, 255, 255, 0.8)', textAlign: 'center' }}
            >
              {mockUserProgress.weeklyGoals.completed} de{' '}
              {mockUserProgress.weeklyGoals.total} objetivos completados
            </Typography>
          </Box>
        )}

        {selectedTab === 2 && (
          <Box className="revolutionary-grid-3" sx={{ gap: 1 }}>
            <Box className="revolutionary-metric-card" sx={{ p: 1.5 }}>
              <Typography
                variant="h6"
                sx={{ color: '#FFD700', fontWeight: 700 }}
              >
                {mockUserProgress.monthlyStats.achievements}
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
              >
                Logros este mes
              </Typography>
            </Box>
            <Box className="revolutionary-metric-card" sx={{ p: 1.5 }}>
              <Typography
                variant="h6"
                sx={{ color: '#E91E63', fontWeight: 700 }}
              >
                {mockUserProgress.monthlyStats.hoursActive}h
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
              >
                Horas activas
              </Typography>
            </Box>
            <Box className="revolutionary-metric-card" sx={{ p: 1.5 }}>
              <Typography
                variant="h6"
                sx={{ color: '#9C27B0', fontWeight: 700 }}
              >
                {mockUserProgress.monthlyStats.contributions}
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
              >
                Contribuciones
              </Typography>
            </Box>
          </Box>
        )}
      </Box>

      {/* 🏆 Achievements Cercanos */}
      <Box>
        <Typography
          variant="h6"
          sx={{
            color: 'rgba(255, 255, 255, 0.9)',
            fontWeight: 600,
            fontSize: '1rem',
            mb: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <EmojiEventsIcon sx={{ color: '#FFD700' }} />
          Logros por Desbloquear
        </Typography>

        <Box sx={{ maxHeight: 160, overflowY: 'auto' }}>
          {mockAchievements.slice(0, 3).map((achievement) => {
            const rarity = rarityConfig[achievement.rarity];
            const element = achievement.element
              ? elementConfig[achievement.element]
              : null;
            const progressPercent =
              (achievement.progress / achievement.maxProgress) * 100;

            return (
              <Box
                key={achievement.id}
                className="revolutionary-interactive"
                onClick={() => handleAchievementClick(achievement)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  p: 1.5,
                  mb: 1,
                  background: `${rarity.color}15`,
                  borderRadius: 'var(--revolutionary-radius-md)',
                  border: `1px solid ${rarity.color}40`,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateX(4px)',
                    background: `${rarity.color}25`,
                    borderColor: `${rarity.color}60`,
                  },
                }}
              >
                {/* 🎨 Icono del Achievement */}
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    background: rarity.gradient,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.2rem',
                    boxShadow: `0 4px 16px ${rarity.color}40`,
                    flexShrink: 0,
                  }}
                >
                  {achievement.icon}
                </Box>

                {/* 📝 Información */}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      color: 'white',
                      fontWeight: 600,
                      fontSize: '0.9rem',
                      mb: 0.5,
                    }}
                  >
                    {achievement.title}
                  </Typography>

                  <Typography
                    variant="caption"
                    sx={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '0.75rem',
                      display: 'block',
                      mb: 0.5,
                    }}
                  >
                    {achievement.description}
                  </Typography>

                  {/* 📊 Progreso */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LinearProgress
                      variant="determinate"
                      value={progressPercent}
                      sx={{
                        flex: 1,
                        height: 4,
                        borderRadius: 2,
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        '& .MuiLinearProgress-bar': {
                          background: rarity.gradient,
                          borderRadius: 2,
                        },
                      }}
                    />
                    <Typography
                      variant="caption"
                      sx={{
                        color: 'white',
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        minWidth: 'fit-content',
                      }}
                    >
                      {achievement.progress}/{achievement.maxProgress}
                    </Typography>
                  </Box>
                </Box>

                {/* 🏷️ Elemento */}
                {element && (
                  <Box
                    sx={{
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      background: `linear-gradient(135deg, ${element.color}, ${element.color}CC)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <element.icon sx={{ color: 'white', fontSize: '0.8rem' }} />
                  </Box>
                )}
              </Box>
            );
          })}
        </Box>
      </Box>

      {/* 🎯 Botón Ver Todos */}
      <Button
        onClick={onViewAll}
        variant="text"
        fullWidth
        sx={{
          mt: 2,
          color: 'rgba(255, 255, 255, 0.8)',
          fontSize: '0.9rem',
          textTransform: 'none',
          '&:hover': { background: 'rgba(255, 255, 255, 0.1)' },
        }}
      >
        Ver todos los logros →
      </Button>

      {/* 🌟 Efecto de Resplandor Rotatorio */}
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '140%',
          height: '140%',
          background:
            'conic-gradient(from 0deg, #FF6B3520, #00BCD420, #66BB6A20, #FFD54F20)',
          borderRadius: '50%',
          transform: 'translate(-50%, -50%)',
          animation: 'revolutionary-rotate-continuous 18s linear infinite',
          opacity: 0.6,
          zIndex: 0,
        }}
      />
    </Box>
  );
};

export default PersonalProgressWidgetRevolutionary;
