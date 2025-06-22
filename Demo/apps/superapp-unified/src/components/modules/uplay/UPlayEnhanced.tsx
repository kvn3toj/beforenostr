import React, { useState, useMemo, useCallback, lazy, Suspense, startTransition } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Chip,
  useTheme,
  useMediaQuery,
  IconButton,
  Tooltip,
  LinearProgress,
  Badge,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PlayArrowIcon,
  PauseIcon,
  BookmarkIcon,
  ShareIcon,
  ThumbUpIcon,
  QuizIcon,
  TrendingUpIcon,
  StarIcon,
  AccessTimeIcon,
  VisibilityIcon,
} from '@mui/icons-material';

// 🌌 COSMIC DESIGN SYSTEM
import { RevolutionaryWidget } from '../../../design-system/templates/RevolutionaryWidget';
import { useTheme as useCoomunityTheme } from '../../../contexts/ThemeContext';

// 🚀 PERFORMANCE: Lazy loading components
const VideoPlayerModal = lazy(() => import('./VideoPlayerModal'));
const QuizOverlay = lazy(() => import('./QuizOverlay'));
const ProgressTracker = lazy(() => import('./ProgressTracker'));

// 🎯 TIPOS MEJORADOS
interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: number; // in seconds
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  tags: string[];
  instructor: {
    name: string;
    avatar: string;
    verified: boolean;
    meritos: number;
  };
  stats: {
    views: number;
    likes: number;
    completions: number;
    avgRating: number;
  };
  gamification: {
    meritosReward: number;
    ondasReward: number;
    questionsCount: number;
    hasInteractiveElements: boolean;
  };
  ayniScore: number; // 🌱 Puntuación de reciprocidad
  bienComunScore: number; // 🌍 Contribución al bien común
  createdAt: string;
  featured: boolean;
  trending: boolean;
  userProgress?: {
    completed: boolean;
    watchedPercentage: number;
    lastWatched: string;
    questionsAnswered: number;
  };
}

interface UPlayEnhancedProps {
  initialCategory?: string;
  performanceMode?: 'high' | 'balanced' | 'economy';
  cosmicEffectsEnabled?: boolean;
}

// 🎭 COMPONENTE VIDEO CARD OPTIMIZADO
const VideoCard = React.memo<{
  video: Video;
  onPlay: (video: Video) => void;
  cosmicEffectsEnabled: boolean;
}>(({ video, onPlay, cosmicEffectsEnabled }) => {
  const theme = useTheme();
  const { isDark } = useCoomunityTheme();

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      beginner: '#4CAF50',
      intermediate: '#FF9800',
      advanced: '#F44336'
    };
    return colors[difficulty as keyof typeof colors] || colors.beginner;
  };

  const getDifficultyLabel = (difficulty: string) => {
    const labels = {
      beginner: 'Principiante',
      intermediate: 'Intermedio',
      advanced: 'Avanzado'
    };
    return labels[difficulty as keyof typeof labels] || 'Principiante';
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{
        scale: 1.03,
        boxShadow: cosmicEffectsEnabled
          ? '0 8px 32px rgba(33, 150, 243, 0.3)'
          : '0 4px 20px rgba(0, 0, 0, 0.1)'
      }}
      transition={{ duration: 0.3 }}
    >
      <Card
        sx={{
          height: '100%',
          cursor: 'pointer',
          background: isDark
            ? 'linear-gradient(145deg, rgba(33, 150, 243, 0.1), rgba(3, 169, 244, 0.05))'
            : 'linear-gradient(145deg, rgba(255, 255, 255, 0.95), rgba(240, 248, 255, 0.8))',
          backdropFilter: 'blur(20px)',
          border: cosmicEffectsEnabled
            ? '1px solid rgba(33, 150, 243, 0.3)'
            : '1px solid rgba(0, 0, 0, 0.1)',
          borderRadius: '16px',
          overflow: 'hidden',
          transition: 'all 0.3s ease',
          '&:hover': {
            borderColor: cosmicEffectsEnabled ? 'rgba(33, 150, 243, 0.6)' : 'rgba(0, 0, 0, 0.2)',
          }
        }}
        onClick={() => onPlay(video)}
      >
        {/* 🖼️ THUMBNAIL CON OVERLAYS */}
        <Box sx={{ position: 'relative' }}>
          <CardMedia
            component="img"
            height="200"
            image={video.thumbnail || '/images/video-placeholder.jpg'}
            alt={video.title}
            sx={{ objectFit: 'cover' }}
          />

          {/* 🎬 PLAY OVERLAY */}
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(45deg, rgba(0,0,0,0.3), rgba(0,0,0,0.1))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: 0,
              transition: 'opacity 0.3s ease',
              '&:hover': { opacity: 1 }
            }}
          >
            <IconButton
              sx={{
                backgroundColor: 'rgba(33, 150, 243, 0.9)',
                color: 'white',
                '&:hover': { backgroundColor: 'rgba(33, 150, 243, 1)' },
                width: 60,
                height: 60,
              }}
            >
              <PlayArrowIcon sx={{ fontSize: 32 }} />
            </IconButton>
          </Box>

          {/* 🏷️ BADGES */}
          <Box sx={{ position: 'absolute', top: 8, left: 8, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {video.featured && (
              <Chip
                icon={<StarIcon sx={{ fontSize: '14px' }} />}
                label="Destacado"
                size="small"
                sx={{
                  background: 'linear-gradient(45deg, #FFD700, #FFA500)',
                  color: 'white',
                  fontWeight: 600,
                  fontSize: '10px'
                }}
              />
            )}
            {video.trending && (
              <Chip
                icon={<TrendingUpIcon sx={{ fontSize: '14px' }} />}
                label="Tendencia"
                size="small"
                sx={{
                  background: 'linear-gradient(45deg, #FF6B6B, #FF8E53)',
                  color: 'white',
                  fontWeight: 600,
                  fontSize: '10px'
                }}
              />
            )}
          </Box>

          {/* ⏱️ DURACIÓN Y PROGRESO */}
          <Box sx={{ position: 'absolute', bottom: 8, right: 8 }}>
            <Chip
              icon={<AccessTimeIcon sx={{ fontSize: '12px' }} />}
              label={formatDuration(video.duration)}
              size="small"
              sx={{
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                color: 'white',
                fontSize: '10px'
              }}
            />
          </Box>

          {/* 📊 PROGRESO DEL USUARIO */}
          {video.userProgress && video.userProgress.watchedPercentage > 0 && (
            <LinearProgress
              variant="determinate"
              value={video.userProgress.watchedPercentage}
              sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: 4,
                backgroundColor: 'rgba(255, 255, 255, 0.3)',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: '#4CAF50'
                }
              }}
            />
          )}
        </Box>

        {/* 📝 CONTENIDO */}
        <CardContent sx={{ p: 2 }}>
          {/* 🎯 DIFICULTAD Y CATEGORÍA */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Chip
              label={getDifficultyLabel(video.difficulty)}
              size="small"
              sx={{
                backgroundColor: getDifficultyColor(video.difficulty),
                color: 'white',
                fontSize: '10px',
                fontWeight: 600
              }}
            />
            <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase' }}>
              {video.category}
            </Typography>
          </Box>

          {/* 📖 TÍTULO */}
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              mb: 1,
              fontSize: '1rem',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}
          >
            {video.title}
          </Typography>

          {/* 👨‍🏫 INSTRUCTOR */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Box
              sx={{
                width: 24,
                height: 24,
                borderRadius: '50%',
                backgroundColor: 'primary.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                color: 'white',
                fontWeight: 600
              }}
            >
              {video.instructor.name.charAt(0)}
            </Box>
            <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main' }}>
              {video.instructor.name}
            </Typography>
            {video.instructor.verified && (
              <Tooltip title="Instructor Verificado">
                <StarIcon sx={{ fontSize: '14px', color: 'warning.main' }} />
              </Tooltip>
            )}
          </Box>

          {/* 📊 ESTADÍSTICAS */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <VisibilityIcon sx={{ fontSize: '14px', color: 'text.secondary' }} />
                <Typography variant="caption" color="text.secondary">
                  {video.stats.views.toLocaleString()}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <ThumbUpIcon sx={{ fontSize: '14px', color: 'text.secondary' }} />
                <Typography variant="caption" color="text.secondary">
                  {video.stats.likes}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <QuizIcon sx={{ fontSize: '14px', color: 'text.secondary' }} />
                <Typography variant="caption" color="text.secondary">
                  {video.gamification.questionsCount}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* 🏆 RECOMPENSAS */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Chip
                label={`🏆 ${video.gamification.meritosReward}`}
                size="small"
                sx={{
                  backgroundColor: 'rgba(76, 175, 80, 0.1)',
                  color: 'success.main',
                  fontSize: '10px'
                }}
              />
              <Chip
                label={`🌊 ${video.gamification.ondasReward}`}
                size="small"
                sx={{
                  backgroundColor: 'rgba(33, 150, 243, 0.1)',
                  color: 'primary.main',
                  fontSize: '10px'
                }}
              />
            </Box>

            {/* 🌱 SCORES DE AYNI Y BIEN COMÚN */}
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              <Tooltip title={`Ayni Score: ${video.ayniScore}/100`}>
                <Chip
                  label={`A:${video.ayniScore}`}
                  size="small"
                  sx={{
                    backgroundColor: `rgba(76, 175, 80, ${video.ayniScore / 100})`,
                    color: 'white',
                    fontSize: '9px',
                    minWidth: '40px'
                  }}
                />
              </Tooltip>
              <Tooltip title={`Bien Común Score: ${video.bienComunScore}/100`}>
                <Chip
                  label={`BC:${video.bienComunScore}`}
                  size="small"
                  sx={{
                    backgroundColor: `rgba(33, 150, 243, ${video.bienComunScore / 100})`,
                    color: 'white',
                    fontSize: '9px',
                    minWidth: '40px'
                  }}
                />
              </Tooltip>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
});

VideoCard.displayName = 'VideoCard';

// 🚀 COMPONENTE PRINCIPAL UPLAY ENHANCED
const UPlayEnhanced: React.FC<UPlayEnhancedProps> = ({
  initialCategory = 'all',
  performanceMode = 'balanced',
  cosmicEffectsEnabled = true
}) => {
  const theme = useTheme();
  const { isDark } = useCoomunityTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // 🎯 ESTADO LOCAL
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'popular' | 'trending' | 'progress'>('newest');
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  // 🔄 DATOS MOCK MEJORADOS
  const mockVideos = useMemo<Video[]>(() => [
    {
      id: '1',
      title: 'Introducción a la Permacultura: Principios de Ayni en la Agricultura',
      description: 'Aprende los fundamentos de la permacultura aplicando los principios de reciprocidad y equilibrio con la naturaleza.',
      thumbnail: '/images/permacultura-thumb.jpg',
      duration: 1800, // 30 minutos
      difficulty: 'beginner',
      category: 'agricultura',
      tags: ['permacultura', 'ayni', 'sostenibilidad', 'agricultura'],
      instructor: {
        name: 'María Pachamama',
        avatar: '/avatars/maria.jpg',
        verified: true,
        meritos: 2500
      },
      stats: {
        views: 15420,
        likes: 1240,
        completions: 890,
        avgRating: 4.8
      },
      gamification: {
        meritosReward: 50,
        ondasReward: 30,
        questionsCount: 8,
        hasInteractiveElements: true
      },
      ayniScore: 95,
      bienComunScore: 92,
      createdAt: '2024-01-15',
      featured: true,
      trending: true,
      userProgress: {
        completed: false,
        watchedPercentage: 65,
        lastWatched: '2024-01-20',
        questionsAnswered: 5
      }
    },
    {
      id: '2',
      title: 'Construcción Natural: Técnicas Ancestrales para Viviendas Sustentables',
      description: 'Descubre métodos de construcción que honran la tierra y crean espacios armoniosos con el entorno.',
      thumbnail: '/images/construccion-natural-thumb.jpg',
      duration: 2700, // 45 minutos
      difficulty: 'intermediate',
      category: 'construccion',
      tags: ['construccion', 'natural', 'sustentable', 'ancestral'],
      instructor: {
        name: 'Carlos Earthbuilder',
        avatar: '/avatars/carlos.jpg',
        verified: true,
        meritos: 3200
      },
      stats: {
        views: 8960,
        likes: 760,
        completions: 420,
        avgRating: 4.6
      },
      gamification: {
        meritosReward: 75,
        ondasReward: 45,
        questionsCount: 12,
        hasInteractiveElements: true
      },
      ayniScore: 88,
      bienComunScore: 94,
      createdAt: '2024-01-10',
      featured: false,
      trending: true,
      userProgress: {
        completed: true,
        watchedPercentage: 100,
        lastWatched: '2024-01-18',
        questionsAnswered: 12
      }
    },
    {
      id: '3',
      title: 'Economía Sagrada: Principios del Intercambio Justo en CoomÜnity',
      description: 'Comprende los fundamentos filosóficos y prácticos de una economía basada en el Bien Común.',
      thumbnail: '/images/economia-sagrada-thumb.jpg',
      duration: 2100, // 35 minutos
      difficulty: 'advanced',
      category: 'economia',
      tags: ['economia', 'sagrada', 'intercambio', 'bien-comun'],
      instructor: {
        name: 'Ana Sabiduria',
        avatar: '/avatars/ana.jpg',
        verified: true,
        meritos: 4100
      },
      stats: {
        views: 12340,
        likes: 980,
        completions: 650,
        avgRating: 4.9
      },
      gamification: {
        meritosReward: 100,
        ondasReward: 60,
        questionsCount: 15,
        hasInteractiveElements: true
      },
      ayniScore: 98,
      bienComunScore: 96,
      createdAt: '2024-01-05',
      featured: true,
      trending: false
    }
  ], []);

  // 🎯 FILTRADO Y BÚSQUEDA OPTIMIZADOS
  const filteredVideos = useMemo(() => {
    return mockVideos.filter(video => {
      // Filtro por categoría
      if (selectedCategory !== 'all' && video.category !== selectedCategory) {
        return false;
      }

      // Filtro por búsqueda
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          video.title.toLowerCase().includes(searchLower) ||
          video.description.toLowerCase().includes(searchLower) ||
          video.tags.some(tag => tag.toLowerCase().includes(searchLower)) ||
          video.instructor.name.toLowerCase().includes(searchLower)
        );
      }

      return true;
    }).sort((a, b) => {
      switch (sortBy) {
        case 'popular':
          return b.stats.views - a.stats.views;
        case 'trending':
          return (b.trending ? 1 : 0) - (a.trending ? 1 : 0);
        case 'progress':
          const aProgress = a.userProgress?.watchedPercentage || 0;
          const bProgress = b.userProgress?.watchedPercentage || 0;
          return bProgress - aProgress;
        case 'newest':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });
  }, [mockVideos, selectedCategory, searchTerm, sortBy]);

  // 🎬 CALLBACKS OPTIMIZADOS
  const handleVideoPlay = useCallback((video: Video) => {
    setSelectedVideo(video);
    console.log('Playing video:', video.title);
  }, []);

  const handleCloseVideo = useCallback(() => {
    setSelectedVideo(null);
  }, []);

  const handleCategoryChange = useCallback((category: string) => {
    startTransition(() => {
      setSelectedCategory(category);
    });
  }, []);

  const handleSearchChange = useCallback((term: string) => {
    startTransition(() => {
      setSearchTerm(term);
    });
  }, []);

  const handleSortChange = useCallback((sort: 'newest' | 'popular' | 'trending' | 'progress') => {
    startTransition(() => {
      setSortBy(sort);
    });
  }, []);

  const categories = useMemo(() => [
    { value: 'all', label: 'Todos', count: mockVideos.length },
    { value: 'agricultura', label: 'Agricultura', count: mockVideos.filter(v => v.category === 'agricultura').length },
    { value: 'construccion', label: 'Construcción', count: mockVideos.filter(v => v.category === 'construccion').length },
    { value: 'economia', label: 'Economía', count: mockVideos.filter(v => v.category === 'economia').length },
  ], [mockVideos]);

  return (
    <Container maxWidth="xl" sx={{ py: 2 }}>
      {/* 🌌 HEADER PRINCIPAL */}
      <RevolutionaryWidget
        title="🎬 ÜPlay - GPL Gamified Play List"
        subtitle="Aprendizaje Interactivo Basado en Ayni y Bien Común"
        variant="elevated"
        element="agua" // Azul para video/fluidez
        cosmicEffects={cosmicEffectsEnabled ? {
          enableParticles: true,
          enableGlow: true,
          enableAnimations: true,
          enableOrbitalEffects: true,
          particleConfig: {
            count: performanceMode === 'high' ? 12 : 8,
            size: 6,
            color: '#00BCD4',
            speed: 1.2,
            opacity: 0.7
          },
          glowIntensity: 1.0
        } : {}}
        cosmicIntensity="intense"
        style={{ marginBottom: '2rem' }}
      >
        {/* 🔍 BÚSQUEDA Y FILTROS */}
        <Box sx={{ mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <input
                type="text"
                placeholder="Buscar videos por título, tema o instructor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`
                  w-full px-4 py-3 rounded-lg border transition-all duration-200
                  ${isDark
                    ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-cyan-400'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-cyan-500'
                  }
                  focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-20
                `}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {categories.map((category) => (
                  <Chip
                    key={category.value}
                    label={`${category.label} (${category.count})`}
                    onClick={() => setSelectedCategory(category.value)}
                    variant={selectedCategory === category.value ? 'filled' : 'outlined'}
                    sx={{
                      backgroundColor: selectedCategory === category.value ? 'primary.main' : 'transparent',
                      color: selectedCategory === category.value ? 'white' : 'primary.main',
                      '&:hover': {
                        backgroundColor: selectedCategory === category.value ? 'primary.dark' : 'primary.light',
                        color: 'white'
                      }
                    }}
                  />
                ))}
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* 📊 ESTADÍSTICAS Y ORDENAMIENTO */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            {filteredVideos.length} videos disponibles
          </Typography>

          <Box sx={{ display: 'flex', gap: 1 }}>
            {['newest', 'popular', 'trending', 'progress'].map((sort) => (
              <Chip
                key={sort}
                label={
                  sort === 'newest' ? 'Más recientes' :
                  sort === 'popular' ? 'Más populares' :
                  sort === 'trending' ? 'Tendencia' : 'Mi progreso'
                }
                onClick={() => setSortBy(sort as any)}
                variant={sortBy === sort ? 'filled' : 'outlined'}
                size="small"
                sx={{ backgroundColor: sortBy === sort ? 'secondary.main' : 'transparent' }}
              />
            ))}
          </Box>
        </Box>
      </RevolutionaryWidget>

      {/* 🎬 GRID DE VIDEOS */}
      <Grid container spacing={3}>
        <AnimatePresence mode="popLayout">
          {filteredVideos.map((video) => (
            <Grid key={video.id} item xs={12} sm={6} md={4} lg={3}>
              <VideoCard
                video={video}
                onPlay={handleVideoPlay}
                cosmicEffectsEnabled={cosmicEffectsEnabled && performanceMode !== 'economy'}
              />
            </Grid>
          ))}
        </AnimatePresence>
      </Grid>

      {/* 📝 MENSAJE SI NO HAY RESULTADOS */}
      {filteredVideos.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No se encontraron videos
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Intenta ajustar los filtros o términos de búsqueda
          </Typography>
        </Box>
      )}

      {/* 🎭 MODAL DEL REPRODUCTOR DE VIDEO */}
      <Suspense fallback={null}>
        {selectedVideo && (
          <VideoPlayerModal
            video={selectedVideo}
            open={Boolean(selectedVideo)}
            onClose={handleCloseVideo}
          />
        )}
      </Suspense>
    </Container>
  );
};

export default UPlayEnhanced;
