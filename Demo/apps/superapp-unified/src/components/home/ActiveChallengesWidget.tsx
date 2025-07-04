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
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import Badge from '@mui/material/Badge';
import { useTheme, alpha } from '@mui/material';

// 🌌 COSMIC DESIGN SYSTEM IMPORTS - ARIA (Frontend Artist)
import { RevolutionaryWidget, REVOLUTIONARY_PRESETS } from '../../design-system';

// 🎯 REGLA #1: IMPORTS ESPECÍFICOS DE ICONOS
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import TimerIcon from '@mui/icons-material/Timer';
import GroupsIcon from '@mui/icons-material/Groups';
import StarIcon from '@mui/icons-material/Star';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import NatureIcon from '@mui/icons-material/Nature';
import HandshakeIcon from '@mui/icons-material/Handshake';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PeopleIcon from '@mui/icons-material/People';
import DiamondIcon from '@mui/icons-material/Diamond';

interface Challenge {
  id: string;
  title: string;
  description: string;
  category: 'individual' | 'community' | 'collaborative';
  difficulty: 'easy' | 'medium' | 'hard' | 'epic';
  type: 'daily' | 'weekly' | 'event' | 'special';
  progress: number;
  maxProgress: number;
  timeLeft: number; // en horas
  participants: number;
  maxParticipants?: number;
  rewards: {
    ondas: number;
    meritos: number;
    badges?: string[];
  };
  icon: React.ReactElement;
  color: string;
  isJoined: boolean;
  isCompleted: boolean;
  isPopular?: boolean;
  isNew?: boolean;
}

interface ActiveChallengesWidgetProps {
  challenges: Challenge[];
  onJoinChallenge: (challengeId: string) => void;
  onStartChallenge: (challengeId: string) => void;
  className?: string;
}

export const ActiveChallengesWidget: React.FC<ActiveChallengesWidgetProps> = ({
  challenges,
  onJoinChallenge,
  onStartChallenge,
  className = '',
}) => {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<
    'all' | 'individual' | 'community' | 'collaborative'
  >('all');
  const [animationTick, setAnimationTick] = useState(0);

  // 🎯 Datos mock de retos activos
  const mockChallenges: Challenge[] = useMemo(
    () => [
      {
        id: 'challenge-1',
        title: 'Maestro del Equilibrio',
        description:
          'Mantén todos tus elementos por encima de 80% durante 7 días',
        category: 'individual',
        difficulty: 'medium',
        type: 'weekly',
        progress: 5,
        maxProgress: 7,
        timeLeft: 48,
        participants: 1,
        rewards: { ondas: 500, meritos: 100, badges: ['Equilibrista'] },
        icon: <NatureIcon />,
        color: '#8BC34A',
        isJoined: true,
        isCompleted: false,
      },
      {
        id: 'challenge-2',
        title: 'Intercambio Comunitario',
        description:
          'Participa en 10 intercambios Reciprocidad con diferentes miembros',
        category: 'community',
        difficulty: 'easy',
        type: 'daily',
        progress: 7,
        maxProgress: 10,
        timeLeft: 18,
        participants: 247,
        maxParticipants: 500,
        rewards: { ondas: 300, meritos: 75 },
        icon: <HandshakeIcon />,
        color: '#4FC3F7',
        isJoined: true,
        isCompleted: false,
        isPopular: true,
      },
      {
        id: 'challenge-3',
        title: 'Proyecto Colaborativo',
        description:
          'Únete al proyecto "Huerta Digital" y contribuye con ideas',
        category: 'collaborative',
        difficulty: 'hard',
        type: 'event',
        progress: 0,
        maxProgress: 1,
        timeLeft: 168, // 7 días
        participants: 45,
        maxParticipants: 100,
        rewards: {
          ondas: 1000,
          meritos: 250,
          badges: ['Colaborador Estrella'],
        },
        icon: <GroupsIcon />,
        color: '#FF8A65',
        isJoined: false,
        isCompleted: false,
        isNew: true,
      },
      {
        id: 'challenge-4',
        title: 'Racha de Energía',
        description: 'Genera 100 Öndas durante 5 días consecutivos',
        category: 'individual',
        difficulty: 'epic',
        type: 'special',
        progress: 3,
        maxProgress: 5,
        timeLeft: 36,
        participants: 1,
        rewards: { ondas: 2000, meritos: 500, badges: ['Generador Supremo'] },
        icon: <FlashOnIcon />,
        color: '#FFD54F',
        isJoined: true,
        isCompleted: false,
      },
    ],
    []
  );

  // 🎯 Combinar challenges props con mock data
  const allChallenges = useMemo(() => {
    return challenges.length > 0 ? challenges : mockChallenges;
  }, [challenges, mockChallenges]);

  // 🎯 Filtrar challenges por categoría
  const filteredChallenges = useMemo(() => {
    if (selectedCategory === 'all') return allChallenges;
    return allChallenges.filter(
      (challenge) => challenge.category === selectedCategory
    );
  }, [allChallenges, selectedCategory]);

  // 🎯 Estadísticas de challenges
  const challengeStats = useMemo(() => {
    const active = allChallenges.filter(
      (c) => c.isJoined && !c.isCompleted
    ).length;
    const completed = allChallenges.filter((c) => c.isCompleted).length;
    const available = allChallenges.filter(
      (c) => !c.isJoined && !c.isCompleted
    ).length;

    return { active, completed, available, total: allChallenges.length };
  }, [allChallenges]);

  // 🎯 Configuración de dificultad
  const difficultyConfig = {
    easy: { label: 'Fácil', color: '#8BC34A', multiplier: 1 },
    medium: { label: 'Medio', color: '#FFD54F', multiplier: 1.5 },
    hard: { label: 'Difícil', color: '#FF8A65', multiplier: 2 },
    epic: { label: 'Épico', color: '#BA68C8', multiplier: 3 },
  };

  // 🎯 Configuración de categoría
  const categoryConfig = {
    individual: { label: 'Individual', icon: <StarIcon />, color: '#4FC3F7' },
    community: { label: 'Comunitario', icon: <PeopleIcon />, color: '#8BC34A' },
    collaborative: {
      label: 'Colaborativo',
      icon: <GroupsIcon />,
      color: '#FF8A65',
    },
  };

  // 🎨 Animación continua
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationTick((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // 🧹 CLEANUP OBLIGATORIO según Builder.io
  useEffect(() => {
    return () => {
      // Cleanup widget resources
    };
  }, []);

  // 🎯 Handlers
  const handleExpandToggle = useCallback(() => {
    setExpanded((prev) => !prev);
  }, []);

  const handleCategoryChange = useCallback(
    (category: typeof selectedCategory) => {
      setSelectedCategory(category);
    },
    []
  );

  const handleJoinChallenge = useCallback(
    (challengeId: string) => {
      console.log('🎯 Joining challenge:', challengeId);
      onJoinChallenge(challengeId);
    },
    [onJoinChallenge]
  );

  const handleStartChallenge = useCallback(
    (challengeId: string) => {
      console.log('▶️ Starting challenge:', challengeId);
      onStartChallenge(challengeId);
    },
    [onStartChallenge]
  );

  // 🕒 Formatear tiempo restante
  const formatTimeLeft = useCallback((hours: number): string => {
    if (hours < 24) {
      return `${hours}h`;
    }
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    return remainingHours > 0 ? `${days}d ${remainingHours}h` : `${days}d`;
  }, []);

  // 🎨 Renderizar selector de categorías
  const renderCategorySelector = () => (
    <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
      <Chip
        label="Todos"
        onClick={() => handleCategoryChange('all')}
        sx={{
          bgcolor:
            selectedCategory === 'all'
              ? alpha(theme.palette.primary.main, 0.3)
              : alpha('#fff', 0.1),
          color:
            selectedCategory === 'all'
              ? theme.palette.primary.main
              : alpha('#fff', 0.8),
          border:
            selectedCategory === 'all'
              ? `1px solid ${theme.palette.primary.main}`
              : `1px solid ${alpha('#fff', 0.2)}`,
        }}
      />
      {Object.entries(categoryConfig).map(([key, config]) => (
        <Chip
          key={key}
          icon={config.icon}
          label={config.label}
          onClick={() => handleCategoryChange(key as any)}
          sx={{
            bgcolor:
              selectedCategory === key
                ? alpha(config.color, 0.3)
                : alpha('#fff', 0.1),
            color: selectedCategory === key ? config.color : alpha('#fff', 0.8),
            border:
              selectedCategory === key
                ? `1px solid ${config.color}`
                : `1px solid ${alpha('#fff', 0.2)}`,
          }}
        />
      ))}
    </Box>
  );

  // 🏆 Renderizar challenge individual
  const renderChallenge = (challenge: Challenge) => {
    const diffConfig = difficultyConfig[challenge.difficulty];
    const categoryConfig = {
      individual: { label: 'Individual', icon: <StarIcon />, color: '#4FC3F7' },
      community: {
        label: 'Comunitario',
        icon: <PeopleIcon />,
        color: '#8BC34A',
      },
      collaborative: {
        label: 'Colaborativo',
        icon: <GroupsIcon />,
        color: '#FF8A65',
      },
    }[challenge.category];

    const progressPercentage =
      (challenge.progress / challenge.maxProgress) * 100;
    const timeUrgent = challenge.timeLeft < 24;

    return (
      <Grid item xs={12} key={challenge.id}>
        <Card
          sx={{
            background: `linear-gradient(135deg, ${alpha(challenge.color, 0.15)} 0%, ${alpha(challenge.color, 0.05)} 100%)`,
            border: `1px solid ${alpha(challenge.color, 0.3)}`,
            borderRadius: 3,
            position: 'relative',
            overflow: 'hidden',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: `0 6px 20px ${alpha(challenge.color, 0.3)}`,
              border: `1px solid ${challenge.color}`,
            },
          }}
        >
          {/* Badges de estado */}
          <Box
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              display: 'flex',
              gap: 0.5,
              zIndex: 2,
            }}
          >
            {challenge.isNew && (
              <Chip
                label="NUEVO"
                size="small"
                sx={{
                  bgcolor: '#FF6B35',
                  color: 'white',
                  fontSize: '0.6rem',
                  height: 20,
                  animation: 'pulse 2s ease-in-out infinite',
                }}
              />
            )}
            {challenge.isPopular && (
              <Chip
                label="POPULAR"
                size="small"
                sx={{
                  bgcolor: '#8BC34A',
                  color: 'white',
                  fontSize: '0.6rem',
                  height: 20,
                }}
              />
            )}
            {timeUrgent && (
              <Chip
                label="URGENTE"
                size="small"
                sx={{
                  bgcolor: '#FF5722',
                  color: 'white',
                  fontSize: '0.6rem',
                  height: 20,
                  animation: 'pulse 1.5s ease-in-out infinite',
                }}
              />
            )}
          </Box>

          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              {/* Icono principal */}
              <Avatar
                sx={{
                  bgcolor: challenge.color,
                  color: 'white',
                  width: 48,
                  height: 48,
                }}
              >
                {challenge.icon}
              </Avatar>

              {/* Información principal */}
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="h6"
                  sx={{ color: 'white', fontWeight: 'bold', mb: 0.5 }}
                >
                  {challenge.title}
                </Typography>

                <Typography
                  variant="body2"
                  sx={{ color: alpha('#fff', 0.8), mb: 1 }}
                >
                  {challenge.description}
                </Typography>

                {/* Badges de metadatos */}
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Chip
                    size="small"
                    label={diffConfig.label}
                    sx={{
                      bgcolor: alpha(diffConfig.color, 0.2),
                      color: diffConfig.color,
                      fontSize: '0.7rem',
                    }}
                  />
                  <Chip
                    size="small"
                    icon={categoryConfig.icon}
                    label={categoryConfig.label}
                    sx={{
                      bgcolor: alpha(categoryConfig.color, 0.2),
                      color: categoryConfig.color,
                      fontSize: '0.7rem',
                    }}
                  />
                  <Chip
                    size="small"
                    icon={<TimerIcon />}
                    label={formatTimeLeft(challenge.timeLeft)}
                    sx={{
                      bgcolor: timeUrgent
                        ? alpha('#FF5722', 0.2)
                        : alpha('#fff', 0.1),
                      color: timeUrgent ? '#FF5722' : alpha('#fff', 0.8),
                      fontSize: '0.7rem',
                    }}
                  />
                </Box>
              </Box>
            </Box>

            {/* Progreso */}
            {challenge.isJoined && (
              <Box sx={{ mb: 2 }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 1,
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{ color: alpha('#fff', 0.8) }}
                  >
                    Progreso
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: 'white', fontWeight: 'bold' }}
                  >
                    {challenge.progress}/{challenge.maxProgress}
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={progressPercentage}
                  sx={{
                    height: 6,
                    borderRadius: 3,
                    bgcolor: alpha('#fff', 0.1),
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 3,
                      bgcolor: challenge.color,
                    },
                  }}
                />
              </Box>
            )}

            {/* Participantes y recompensas */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 2,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PeopleIcon
                  sx={{ fontSize: '1rem', color: alpha('#fff', 0.7) }}
                />
                <Typography
                  variant="caption"
                  sx={{ color: alpha('#fff', 0.7) }}
                >
                  {challenge.participants}
                  {challenge.maxParticipants &&
                    ` / ${challenge.maxParticipants}`}{' '}
                  participantes
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <DiamondIcon sx={{ fontSize: '1rem', color: '#FFD54F' }} />
                <Typography
                  variant="caption"
                  sx={{ color: '#FFD54F', fontWeight: 'bold' }}
                >
                  {challenge.rewards.ondas} Öndas
                </Typography>
              </Box>
            </Box>

            {/* Acciones */}
            <Box sx={{ display: 'flex', gap: 1 }}>
              {!challenge.isJoined ? (
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => handleJoinChallenge(challenge.id)}
                  sx={{
                    bgcolor: challenge.color,
                    color: 'white',
                    '&:hover': {
                      bgcolor: challenge.color,
                      filter: 'brightness(1.1)',
                    },
                  }}
                >
                  Unirse al Reto
                </Button>
              ) : challenge.isCompleted ? (
                <Chip
                  label="✅ Completado"
                  sx={{
                    bgcolor: alpha('#8BC34A', 0.2),
                    color: '#8BC34A',
                    fontWeight: 'bold',
                  }}
                />
              ) : (
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<PlayArrowIcon />}
                  onClick={() => handleStartChallenge(challenge.id)}
                  sx={{
                    borderColor: challenge.color,
                    color: challenge.color,
                    '&:hover': {
                      bgcolor: alpha(challenge.color, 0.1),
                      borderColor: challenge.color,
                    },
                  }}
                >
                  Continuar
                </Button>
              )}
            </Box>
          </CardContent>
        </Card>
      </Grid>
    );
  };

  return (
    <RevolutionaryWidget
      title="🏆 Retos Activos"
      subtitle={`${challengeStats.active} activos • ${challengeStats.available} disponibles`}
      variant="elevated"
      element="fuego"
      cosmicIntensity="medium"
      cosmicEffects={{
        enableGlow: true,
        enableAnimations: true,
        enableParticles: true,
        glowIntensity: 1.2,
        particleConfig: {
          count: 5,
          size: 3,
          color: '#FFD54F',
          speed: 0.8,
          opacity: 0.7,
          blur: true
        }
      }}
      interactionMode="hover"
      className={`active-challenges-widget ${className}`}
      style={{ minHeight: '400px' }}
      onRefresh={() => console.log('🔄 Refreshing challenges...')}
      onExpand={() => setExpanded(!expanded)}
    >
        {/* Estadísticas rápidas */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {[
            {
              label: 'Activos',
              value: challengeStats.active,
              color: '#8BC34A',
            },
            {
              label: 'Completados',
              value: challengeStats.completed,
              color: '#4FC3F7',
            },
            {
              label: 'Disponibles',
              value: challengeStats.available,
              color: '#FFD54F',
            },
          ].map((stat) => (
            <Grid item xs={4} key={stat.label}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography
                  variant="h5"
                  sx={{ color: stat.color, fontWeight: 'bold' }}
                >
                  {stat.value}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: alpha('#fff', 0.7) }}
                >
                  {stat.label}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>

        {expanded && (
          <>
            <Divider sx={{ bgcolor: alpha('#fff', 0.1), my: 3 }} />

            {/* Selector de categorías */}
            {renderCategorySelector()}

            {/* Lista de challenges */}
            <Grid container spacing={2}>
              {filteredChallenges
                .slice(0, expanded ? filteredChallenges.length : 2)
                .map(renderChallenge)}
            </Grid>
          </>
        )}

        {/* Vista compacta de challenges activos */}
        {!expanded && filteredChallenges.length > 0 && (
          <Box>
            <Grid container spacing={2}>
              {filteredChallenges.slice(0, 2).map(renderChallenge)}
            </Grid>
          </Box>
        )}
    </RevolutionaryWidget>
  );
};

export default ActiveChallengesWidget;
