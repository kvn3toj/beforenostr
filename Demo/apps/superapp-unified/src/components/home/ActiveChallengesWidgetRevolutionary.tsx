import React, { useState, useEffect, useMemo } from 'react';

// 🎯 REGLA #1: IMPORTS ESPECÍFICOS DE MATERIAL UI
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import LinearProgress from '@mui/material/LinearProgress';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';

// 🎯 REGLA #1: IMPORTS ESPECÍFICOS DE ICONOS
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import TerrainIcon from '@mui/icons-material/Terrain';
import AirIcon from '@mui/icons-material/Air';
import DiamondIcon from '@mui/icons-material/Diamond';
import GroupsIcon from '@mui/icons-material/Groups';
import PersonIcon from '@mui/icons-material/Person';
import StarIcon from '@mui/icons-material/Star';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import RefreshIcon from '@mui/icons-material/Refresh';
import VisibilityIcon from '@mui/icons-material/Visibility';

import SolarSystemSVG from '../universe/SolarSystemSVG';

// 🔢 IMPORTS DE UTILIDADES FIBONACCI
import {
  calculateFibonacciOrbit,
  getFibonacciAnimationSpeed,
  fibonacciLerp,
  GOLDEN_RATIO,
  FIBONACCI_PRESETS,
  type OrbitalPosition,
  type FibonacciMetrics,
  calculateFibonacciMetrics
} from '../../utils/fibonacci-distribution';

interface Challenge {
  id: string;
  title: string;
  description: string;
  category: 'individual' | 'community' | 'collaborative';
  difficulty: 'easy' | 'medium' | 'hard' | 'epic';
  element: 'fire' | 'water' | 'earth' | 'air' | 'power';
  progress: number;
  maxProgress: number;
  timeLeft: string;
  participants: number;
  maxParticipants?: number;
  rewards: {
    xp: number;
    currency: { type: string; amount: number }[];
    badges?: string[];
  };
  status: 'active' | 'starting' | 'ending' | 'completed';
  userParticipating: boolean;
}

interface ActiveChallengesWidgetRevolutionaryProps {
  onChallengeClick?: (challenge: Challenge) => void;
  onJoinChallenge?: (challengeId: string) => void;
  onViewAll?: () => void;
}

// 🏆 Challenges simulados
  // 🔗 Usando datos reales del backend
  const { data: challenges = [] } = useChallenges();
const ActiveChallengesWidgetRevolutionary: React.FC<
  ActiveChallengesWidgetRevolutionaryProps
> = ({ onChallengeClick, onJoinChallenge, onViewAll }) => {
  const [selectedCategory, setSelectedCategory] = useState<
    'all' | 'individual' | 'community' | 'collaborative'
  >('all');
  const [hoveredChallenge, setHoveredChallenge] = useState<string | null>(null);
  const [particles, setParticles] = useState<
    Array<{ id: string; x: number; y: number; difficulty: string }>
  >([]);

  // 🔢 ESTADOS FIBONACCI MEJORADOS
  const [fibonacciTime, setFibonacciTime] = useState(0);
  const [orbitalPositions, setOrbitalPositions] = useState<OrbitalPosition[]>([]);
  const [fibonacciMetrics, setFibonacciMetrics] = useState<FibonacciMetrics>({
    distributionQuality: 100,
    visualHarmony: 100,
    animationSmoothness: 100,
    overallScore: 100
  });
  const [lastFrameTime, setLastFrameTime] = useState(Date.now());
  const [fibonacciPreset, setFibonacciPreset] = useState<keyof typeof FIBONACCI_PRESETS>('fast');

  // 🎨 Configuración de elementos
  const elementConfig = {
    fire: {
      color: '#FF6B35',
      icon: LocalFireDepartmentIcon,
      gradient: 'linear-gradient(135deg, #FF6B35, #FF8A50)',
    },
    water: {
      color: '#00BCD4',
      icon: WaterDropIcon,
      gradient: 'linear-gradient(135deg, #00BCD4, #26C6DA)',
    },
    earth: {
      color: '#66BB6A',
      icon: TerrainIcon,
      gradient: 'linear-gradient(135deg, #66BB6A, #81C784)',
    },
    air: {
      color: '#FFD54F',
      icon: AirIcon,
      gradient: 'linear-gradient(135deg, #FFD54F, #FFEB3B)',
    },
    power: {
      color: '#9C27B0',
      icon: DiamondIcon,
      gradient: 'linear-gradient(135deg, #9C27B0, #BA68C8)',
    },
  };

  // 🏷️ Configuración de dificultades
  const difficultyConfig = {
    easy: { color: '#4CAF50', label: 'Fácil', emoji: '🟢' },
    medium: { color: '#FF9800', label: 'Medio', emoji: '🟡' },
    hard: { color: '#F44336', label: 'Difícil', emoji: '🔴' },
    epic: { color: '#9C27B0', label: 'Épico', emoji: '💎' },
  };

  // 🔖 Configuración de categorías
  const categoryConfig = {
    individual: { color: '#2196F3', label: 'Individual', icon: PersonIcon },
    community: { color: '#4CAF50', label: 'Comunitario', icon: GroupsIcon },
    collaborative: {
      color: '#FF9800',
      label: 'Colaborativo',
      icon: EmojiEventsIcon,
    },
  };

  // ✨ Generar partículas por dificultad
  useEffect(() => {
    const generateParticles = () => {
      const difficulties = ['easy', 'medium', 'hard', 'epic'];
      const newParticles = Array.from({ length: 6 }, (_, i) => ({
        id: `challenge-particle-${i}`,
        x: Math.random() * 100,
        y: Math.random() * 100,
        difficulty:
          difficulties[Math.floor(Math.random() * difficulties.length)],
      }));
      setParticles(newParticles);
    };

    generateParticles();
    const interval = setInterval(generateParticles, 3500);
    return () => clearInterval(interval);
  }, []);

  // 🔢 EFECTO FIBONACCI PARA ACTUALIZACIÓN DE POSICIONES
  useEffect(() => {
    const animationFrame = () => {
      const currentTime = Date.now();
      const deltaTime = currentTime - lastFrameTime;
      
      // Actualizar tiempo Fibonacci
      const newFibonacciTime = fibonacciTime + deltaTime * 0.001; // Convertir a segundos
      setFibonacciTime(newFibonacciTime);
      
      // Calcular nuevas posiciones orbitales usando utilidades Fibonacci para challenges activos
      const activeChallenges = filteredChallenges.slice(0, 4); // Máximo 4 challenges visibles
      const containerWidth = 350; // Tamaño del contenedor de challenges
      const containerHeight = 350;
      
      const newPositions: OrbitalPosition[] = activeChallenges.map((challenge, index) => {
        const animationSpeed = getFibonacciAnimationSpeed(index) * 0.8; // Más lento para challenges
        
        return calculateFibonacciOrbit(
          index,
          activeChallenges.length,
          newFibonacciTime * animationSpeed,
          containerWidth,
          containerHeight,
          FIBONACCI_PRESETS[fibonacciPreset]
        );
      });
      
      setOrbitalPositions(newPositions);
      
      // Calcular métricas de rendimiento Fibonacci
      const metrics = calculateFibonacciMetrics(newPositions, deltaTime);
      setFibonacciMetrics(metrics);
      
      setLastFrameTime(currentTime);
    };

    const animationId = requestAnimationFrame(animationFrame);
    
    // Configurar loop de animación más suave para challenges
    const intervalId = setInterval(animationFrame, 20); // ~50fps para mejor rendimiento
    
    return () => {
      cancelAnimationFrame(animationId);
      clearInterval(intervalId);
    };
  }, [fibonacciTime, lastFrameTime, filteredChallenges, fibonacciPreset]);

  // 🔽 Filtrar challenges
  const filteredChallenges = useMemo(() => {
    if (selectedCategory === 'all') return mockChallenges;
    return mockChallenges.filter(
      (challenge) => challenge.category === selectedCategory
    );
  }, [selectedCategory]);

  // 📊 Estadísticas
  const stats = useMemo(() => {
    const active = mockChallenges.filter((c) => c.userParticipating).length;
    const completed = 12; // Simulado
    const totalRewards = mockChallenges
      .filter((c) => c.userParticipating)
      .reduce((sum, c) => sum + c.rewards.xp, 0);

    return { active, completed, totalRewards };
  }, []);

  const handleChallengeClick = (challenge: Challenge) => {
    if (onChallengeClick) {
      onChallengeClick(challenge);
    }
  };

  const handleJoinChallenge = (
    challengeId: string,
    event: React.MouseEvent
  ) => {
    event.stopPropagation();
    if (onJoinChallenge) {
      onJoinChallenge(challengeId);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return '#4CAF50';
      case 'starting':
        return '#FF9800';
      case 'ending':
        return '#F44336';
      case 'completed':
        return '#9C27B0';
      default:
        return '#607D8B';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return '🟢 Activo';
      case 'starting':
        return '🟡 Iniciando';
      case 'ending':
        return '🔴 Finalizando';
      case 'completed':
        return '💜 Completado';
      default:
        return '⚪ Desconocido';
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
        minHeight: 500,
      }}
    >
      {/* 🌌 Sistema Solar SVG animado */}
      <Box sx={{ maxWidth: 420, mx: 'auto', pb: 3 }}>
        <SolarSystemSVG />
      </Box>
      {/* ✨ Partículas de Challenges */}
      <Box className="revolutionary-particles">
        {particles.map((particle) => {
          const config =
            difficultyConfig[
              particle.difficulty as keyof typeof difficultyConfig
            ];
          return (
            <Box
              key={particle.id}
              sx={{
                position: 'absolute',
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                width: particle.difficulty === 'epic' ? 6 : 4,
                height: particle.difficulty === 'epic' ? 6 : 4,
                borderRadius: '50%',
                backgroundColor: config.color,
                boxShadow: `0 0 12px ${config.color}`,
                animation: `revolutionary-sparkle ${particle.difficulty === 'epic' ? '2s' : '3s'} ease-in-out infinite`,
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
            'linear-gradient(135deg, #4CAF50, #FF9800, #F44336, #9C27B0)',
          opacity: 0.8,
        }}
      />

      {/* 📱 Header */}
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
              width: 56,
              height: 56,
              borderRadius: '50%',
              background:
                'conic-gradient(from 0deg, #4CAF50, #FF9800, #F44336, #9C27B0, #4CAF50)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              animation: 'revolutionary-rotate-continuous 10s linear infinite',
              boxShadow: '0 8px 32px rgba(76, 175, 80, 0.3)',
            }}
          >
            <EmojiEventsIcon sx={{ color: 'white', fontSize: '1.8rem' }} />
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
              Retos Activos
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: 'rgba(255, 255, 255, 0.6)',
                fontSize: '0.9rem',
              }}
            >
              {stats.active} participando • {stats.completed} completados
            </Typography>
          </Box>
        </Box>

        {/* 🔄 Refresh */}
        <Tooltip title="Actualizar retos">
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

      {/* 📊 Estadísticas Rápidas */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 1,
          mb: 3,
        }}
      >
        <Box
          className="revolutionary-metric-card"
          sx={{
            p: 1.5,
            textAlign: 'center',
            background: 'rgba(76, 175, 80, 0.1)',
            border: '1px solid rgba(76, 175, 80, 0.2)',
          }}
        >
          <Typography variant="h6" sx={{ color: '#4CAF50', fontWeight: 700 }}>
            {stats.active}
          </Typography>
          <Typography
            variant="caption"
            sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
          >
            Activos
          </Typography>
        </Box>

        <Box
          className="revolutionary-metric-card"
          sx={{
            p: 1.5,
            textAlign: 'center',
            background: 'rgba(156, 39, 176, 0.1)',
            border: '1px solid rgba(156, 39, 176, 0.2)',
          }}
        >
          <Typography variant="h6" sx={{ color: '#9C27B0', fontWeight: 700 }}>
            {stats.completed}
          </Typography>
          <Typography
            variant="caption"
            sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
          >
            Completados
          </Typography>
        </Box>

        <Box
          className="revolutionary-metric-card"
          sx={{
            p: 1.5,
            textAlign: 'center',
            background: 'rgba(255, 215, 0, 0.1)',
            border: '1px solid rgba(255, 215, 0, 0.2)',
          }}
        >
          <Typography variant="h6" sx={{ color: '#FFD700', fontWeight: 700 }}>
            {stats.totalRewards}
          </Typography>
          <Typography
            variant="caption"
            sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
          >
            XP Pendiente
          </Typography>
        </Box>
      </Box>

      {/* 🔽 Filtros de Categoría */}
      <Box
        sx={{
          display: 'flex',
          gap: 1,
          mb: 3,
          flexWrap: 'wrap',
        }}
      >
        <Chip
          label="Todos"
          onClick={() => setSelectedCategory('all')}
          sx={{
            background:
              selectedCategory === 'all'
                ? 'linear-gradient(135deg, #2196F3, #42A5F5)'
                : 'rgba(255, 255, 255, 0.1)',
            color: 'white',
            fontSize: '0.8rem',
            '&:hover': { background: 'rgba(33, 150, 243, 0.3)' },
          }}
        />
        {Object.entries(categoryConfig).map(([key, config]) => (
          <Chip
            key={key}
            label={config.label}
            icon={<config.icon sx={{ fontSize: '0.9rem' }} />}
            onClick={() => setSelectedCategory(key as any)}
            sx={{
              background:
                selectedCategory === key
                  ? `linear-gradient(135deg, ${config.color}, ${config.color}CC)`
                  : 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              fontSize: '0.8rem',
              '& .MuiChip-icon': { color: 'white' },
              '&:hover': { background: `${config.color}30` },
            }}
          />
        ))}
      </Box>

      {/* 🏆 Lista de Challenges */}
      <Box
        sx={{
          maxHeight: 280,
          overflowY: 'auto',
          '&::-webkit-scrollbar': { width: 6 },
          '&::-webkit-scrollbar-track': {
            background: 'rgba(255, 255, 255, 0.1)',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(255, 255, 255, 0.3)',
            borderRadius: 3,
          },
        }}
      >
        {filteredChallenges.slice(0, 3).map((challenge) => {
          const element = elementConfig[challenge.element];
          const difficulty = difficultyConfig[challenge.difficulty];
          const category = categoryConfig[challenge.category];
          const ElementIcon = element.icon;
          const isHovered = hoveredChallenge === challenge.id;
          const progressPercent =
            (challenge.progress / challenge.maxProgress) * 100;

          return (
            <Box
              key={challenge.id}
              className="revolutionary-interactive"
              onClick={() => handleChallengeClick(challenge)}
              onMouseEnter={() => setHoveredChallenge(challenge.id)}
              onMouseLeave={() => setHoveredChallenge(null)}
              sx={{
                p: 2,
                mb: 2,
                background: isHovered
                  ? `${element.color}15`
                  : 'rgba(255, 255, 255, 0.08)',
                borderRadius: 'var(--revolutionary-radius-lg)',
                border: isHovered
                  ? `2px solid ${element.color}60`
                  : '1px solid rgba(255, 255, 255, 0.15)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* 🎨 Header del Challenge */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 2,
                  mb: 2,
                }}
              >
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    background: element.gradient,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: `0 4px 16px ${element.color}40`,
                    flexShrink: 0,
                  }}
                >
                  <ElementIcon sx={{ color: 'white', fontSize: '1.4rem' }} />
                </Box>

                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      mb: 1,
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      sx={{
                        color: 'white',
                        fontWeight: 700,
                        fontSize: '1rem',
                        lineHeight: 1.2,
                      }}
                    >
                      {challenge.title}
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <Chip
                        label={difficulty.label}
                        size="small"
                        sx={{
                          background: `linear-gradient(135deg, ${difficulty.color}, ${difficulty.color}CC)`,
                          color: 'white',
                          fontSize: '0.7rem',
                          height: 20,
                          '& .MuiChip-label': { px: 0.8 },
                        }}
                      />
                      <Chip
                        label={getStatusLabel(challenge.status)}
                        size="small"
                        sx={{
                          background: `linear-gradient(135deg, ${getStatusColor(challenge.status)}, ${getStatusColor(challenge.status)}CC)`,
                          color: 'white',
                          fontSize: '0.7rem',
                          height: 20,
                          '& .MuiChip-label': { px: 0.8 },
                        }}
                      />
                    </Box>
                  </Box>

                  <Typography
                    variant="body2"
                    sx={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '0.85rem',
                      lineHeight: 1.3,
                      mb: 1,
                    }}
                  >
                    {challenge.description}
                  </Typography>

                  {/* 📊 Progreso */}
                  <Box sx={{ mb: 1.5 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 0.5,
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{
                          color: 'rgba(255, 255, 255, 0.7)',
                          fontSize: '0.75rem',
                        }}
                      >
                        Progreso
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          color: 'white',
                          fontWeight: 600,
                          fontSize: '0.75rem',
                        }}
                      >
                        {challenge.progress}/{challenge.maxProgress}
                      </Typography>
                    </Box>

                    <LinearProgress
                      variant="determinate"
                      value={progressPercent}
                      sx={{
                        height: 6,
                        borderRadius: 3,
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        '& .MuiLinearProgress-bar': {
                          background: element.gradient,
                          borderRadius: 3,
                        },
                      }}
                    />
                  </Box>

                  {/* ⏰ Información Adicional */}
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      mb: 1,
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <AccessTimeIcon
                        sx={{
                          color: 'rgba(255, 255, 255, 0.6)',
                          fontSize: '1rem',
                        }}
                      />
                      <Typography
                        variant="caption"
                        sx={{
                          color: 'rgba(255, 255, 255, 0.8)',
                          fontSize: '0.75rem',
                        }}
                      >
                        {challenge.timeLeft} restante
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <GroupsIcon
                        sx={{
                          color: 'rgba(255, 255, 255, 0.6)',
                          fontSize: '1rem',
                        }}
                      />
                      <Typography
                        variant="caption"
                        sx={{
                          color: 'rgba(255, 255, 255, 0.8)',
                          fontSize: '0.75rem',
                        }}
                      >
                        {challenge.participants}
                        {challenge.maxParticipants
                          ? `/${challenge.maxParticipants}`
                          : ''}{' '}
                        participantes
                      </Typography>
                    </Box>
                  </Box>

                  {/* 🎁 Recompensas */}
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      mb: 1.5,
                    }}
                  >
                    <StarIcon sx={{ color: '#FFD700', fontSize: '1rem' }} />
                    <Typography
                      variant="caption"
                      sx={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontSize: '0.75rem',
                      }}
                    >
                      +{challenge.rewards.xp} XP,{' '}
                      {challenge.rewards.currency
                        .map((c) => `${c.amount} ${c.type}`)
                        .join(', ')}
                    </Typography>
                  </Box>

                  {/* 🎯 Acción */}
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    {challenge.userParticipating ? (
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<VisibilityIcon />}
                        sx={{
                          background: element.gradient,
                          color: 'white',
                          fontSize: '0.8rem',
                          textTransform: 'none',
                          '&:hover': {
                            background: element.gradient,
                            transform: 'scale(1.05)',
                          },
                        }}
                      >
                        Ver Detalles
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<PlayArrowIcon />}
                        onClick={(e) => handleJoinChallenge(challenge.id, e)}
                        sx={{
                          background: `linear-gradient(135deg, ${category.color}, ${category.color}CC)`,
                          color: 'white',
                          fontSize: '0.8rem',
                          textTransform: 'none',
                          '&:hover': {
                            background: `linear-gradient(135deg, ${category.color}DD, ${category.color})`,
                            transform: 'scale(1.05)',
                          },
                        }}
                      >
                        Unirse
                      </Button>
                    )}

                    {challenge.maxParticipants &&
                      challenge.category === 'collaborative' && (
                        <AvatarGroup max={3} sx={{ ml: 1 }}>
                          {Array.from(
                            { length: Math.min(challenge.participants, 3) },
                            (_, i) => (
                              <Avatar
                                key={i}
                                sx={{
                                  width: 24,
                                  height: 24,
                                  fontSize: '0.7rem',
                                  background: element.gradient,
                                }}
                              >
                                {String.fromCharCode(65 + i)}
                              </Avatar>
                            )
                          )}
                        </AvatarGroup>
                      )}
                  </Box>
                </Box>
              </Box>

              {/* ✨ Efecto Shimmer */}
              {isHovered && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: '-100%',
                    width: '100%',
                    height: '100%',
                    background:
                      'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)',
                    animation: 'revolutionary-shimmer 1s ease-in-out',
                    zIndex: 1,
                  }}
                />
              )}
            </Box>
          );
        })}
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
        Ver todos los retos →
      </Button>

      {/* 🌟 Efecto de Resplandor Rotatorio */}
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '150%',
          height: '150%',
          background:
            'conic-gradient(from 0deg, #4CAF5020, #FF980020, #F4433620, #9C27B020)',
          borderRadius: '50%',
          transform: 'translate(-50%, -50%)',
          animation: 'revolutionary-rotate-continuous 15s linear infinite',
          opacity: 0.5,
          zIndex: 0,
        }}
      />
    </Box>
  );
};

export default ActiveChallengesWidgetRevolutionary;
