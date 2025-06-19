import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  InputAdornment,
  Chip,
  Avatar,
  Button,
  IconButton,
  Fab,
  Divider,
  Skeleton,
  useTheme,
  useMediaQuery,
  alpha,
  keyframes,
  Collapse,
  LinearProgress,
} from '@mui/material';
import {
  Search,
  FilterList,
  Sort,
  PlayArrow,
  Star,
  Diamond,
  Bolt,
  Schedule,
  Visibility,
  CheckCircle,
  TrendingUp,
  School,
  AutoAwesome,
  Celebration,
  ExpandMore,
  ExpandLess,
  Category,
  VideoLibrary,
} from '@mui/icons-material';

// Animaciones keyframes
const shimmerAnimation = keyframes`
  0% { background-position: -200px 0; }
  100% { background-position: calc(200px + 100%) 0; }
`;

const cardHoverAnimation = keyframes`
  0% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-8px) scale(1.02); }
  100% { transform: translateY(-4px) scale(1.01); }
`;

const sparkleEffect = keyframes`
  0%, 100% { opacity: 0; transform: scale(0.8) rotate(0deg); }
  50% { opacity: 1; transform: scale(1.2) rotate(180deg); }
`;

/**
 * UPlayInteractiveLibrary Component
 * 
 * Biblioteca interactiva de videos con:
 * ✨ Efectos visuales avanzados y glassmorphism
 * 🔍 Búsqueda inteligente y filtros dinámicos
 * 📱 Diseño responsive con animaciones fluidas
 * 🎮 Sistema de progreso y recompensas
 * 🏆 Categorización por dificultad y temas
 * 🌟 Efectos de hover y transiciones suaves
 */

interface VideoItem {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: number;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  rewards: {
    meritos: number;
    ondas: number;
  };
  isCompleted: boolean;
  progress: number;
  questionsCount?: number;
  views?: number;
  rating?: number;
}

interface UPlayInteractiveLibraryProps {
  videos: any[];
  loading: boolean;
  onVideoSelect: (videoId: string) => void;
}

interface FilterState {
  difficulty: string[];
  category: string[];
  completed: boolean | null;
  sortBy: 'title' | 'duration' | 'difficulty' | 'rewards' | 'recent';
  sortOrder: 'asc' | 'desc';
}

const UPlayInteractiveLibrary: React.FC<UPlayInteractiveLibraryProps> = ({
  videos,
  loading,
  onVideoSelect,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Estados locales
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [filters, setFilters] = useState<FilterState>({
    difficulty: [],
    category: [],
    completed: null,
    sortBy: 'recent',
    sortOrder: 'desc',
  });

  // Adaptador: convertir videos del backend al formato VideoItem
  const adaptedVideos = useMemo(() => {
    if (!videos) return [];
    
    return videos.map((backendVideo: any): VideoItem => {
      const questionsCount = backendVideo.questions?.length || 0;
      const durationMinutes = Math.ceil((backendVideo.duration || 0) / 60);
      
      // Calcular recompensas basadas en duración y preguntas
      const meritosBase = 20 + (questionsCount * 5) + Math.min(durationMinutes * 2, 50);
      const ondasBase = 10 + (questionsCount * 3) + Math.min(durationMinutes * 1, 30);

      // Determinar dificultad
      let difficulty: 'easy' | 'medium' | 'hard' = 'easy';
      if (questionsCount >= 5 || durationMinutes > 30) difficulty = 'medium';
      if (questionsCount >= 10 || durationMinutes > 60) difficulty = 'hard';

      // Thumbnail emoji basado en contenido
      let thumbnail = '🎬';
      const titleLower = (backendVideo.title || '').toLowerCase();
      if (titleLower.includes('gamific')) thumbnail = '🎮';
      else if (titleLower.includes('narrat')) thumbnail = '📖';
      else if (titleLower.includes('mecán')) thumbnail = '⚙️';
      else if (titleLower.includes('evalua')) thumbnail = '📊';

      return {
        id: backendVideo.id?.toString() || 'unknown',
        title: backendVideo.title || 'Video sin título',
        description: backendVideo.description || 'Sin descripción disponible',
        thumbnail,
        duration: backendVideo.duration || 0,
        difficulty,
        category: backendVideo.categories?.[0] || 'General',
        rewards: { meritos: meritosBase, ondas: ondasBase },
        isCompleted: Math.random() > 0.7, // Simulando estado de completado
        progress: Math.floor(Math.random() * 100),
        questionsCount,
        views: Math.floor(Math.random() * 1000) + 100,
        rating: 4 + Math.random(),
      };
    });
  }, [videos]);

  // Obtener categorías únicas
  const categories = useMemo(() => {
    const cats = ['all', ...new Set(adaptedVideos.map(video => video.category))];
    return cats;
  }, [adaptedVideos]);

  // Filtrar y ordenar videos
  const filteredVideos = useMemo(() => {
    let filtered = adaptedVideos.filter(video => {
      // Filtro de búsqueda
      if (searchTerm && !video.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !video.description.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }

      // Filtro de categoría
      if (selectedCategory !== 'all' && video.category !== selectedCategory) {
        return false;
      }

      // Filtros avanzados
      if (filters.difficulty.length > 0 && !filters.difficulty.includes(video.difficulty)) {
        return false;
      }

      if (filters.completed !== null && video.isCompleted !== filters.completed) {
        return false;
      }

      return true;
    });

    // Ordenar
    filtered.sort((a, b) => {
      const order = filters.sortOrder === 'asc' ? 1 : -1;
      
      switch (filters.sortBy) {
        case 'title':
          return order * a.title.localeCompare(b.title);
        case 'duration':
          return order * (a.duration - b.duration);
        case 'difficulty':
          const difficultyOrder = { easy: 1, medium: 2, hard: 3 };
          return order * (difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]);
        case 'rewards':
          return order * (a.rewards.meritos - b.rewards.meritos);
        default:
          return order * (a.views! - b.views!);
      }
    });

    return filtered;
  }, [adaptedVideos, searchTerm, selectedCategory, filters]);

  // Componente VideoCard mejorado
  const VideoCard: React.FC<{ video: VideoItem; index: number }> = ({ video, index }) => {
    const [isHovered, setIsHovered] = useState(false);

    const getDifficultyColor = (difficulty: string) => {
      switch (difficulty) {
        case 'easy': return '#4caf50';
        case 'medium': return '#ff9800';
        case 'hard': return '#f44336';
        default: return '#757575';
      }
    };

    const getDifficultyLabel = (difficulty: string) => {
      switch (difficulty) {
        case 'easy': return 'Fácil';
        case 'medium': return 'Medio';
        case 'hard': return 'Difícil';
        default: return difficulty;
      }
    };

    return (
      <Card
        sx={{
          height: '100%',
          background: alpha('#ffffff', 0.05),
          backdropFilter: 'blur(20px)',
          border: `1px solid ${alpha('#ffffff', 0.1)}`,
          borderRadius: 4,
          overflow: 'hidden',
          position: 'relative',
          cursor: 'pointer',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          transformOrigin: 'center',
          '&:hover': {
            transform: 'translateY(-12px) scale(1.02)',
            boxShadow: `0 20px 60px ${alpha(getDifficultyColor(video.difficulty), 0.4)}`,
            border: `1px solid ${alpha(getDifficultyColor(video.difficulty), 0.3)}`,
            '& .video-overlay': {
              opacity: 1,
            },
            '& .sparkle-effect': {
              opacity: 1,
            }
          },
          // Efecto de delay staggered
          animationDelay: `${index * 0.1}s`,
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => onVideoSelect(video.id)}
      >
        {/* Efectos de partículas */}
        <Box
          className="sparkle-effect"
          sx={{
            position: 'absolute',
            top: '10%',
            right: '10%',
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: getDifficultyColor(video.difficulty),
            opacity: 0,
            zIndex: 3,
            animation: `${sparkleEffect} 2s ease-in-out infinite`,
          }}
        />

        {/* Thumbnail mejorado */}
        <Box
          sx={{
            height: 200,
            background: `linear-gradient(135deg, ${alpha(getDifficultyColor(video.difficulty), 0.2)}, ${alpha(getDifficultyColor(video.difficulty), 0.1)})`,
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          {/* Fondo animado */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `
                radial-gradient(circle at 30% 30%, ${alpha(getDifficultyColor(video.difficulty), 0.3)} 0%, transparent 50%),
                radial-gradient(circle at 70% 70%, ${alpha(theme.palette.secondary.main, 0.2)} 0%, transparent 50%)
              `,
              transition: 'all 0.6s ease',
            }}
          />

          {/* Emoji thumbnail */}
          <Typography
            variant="h1"
            sx={{
              fontSize: '4.5rem',
              position: 'relative',
              zIndex: 2,
              transition: 'all 0.3s ease',
              transform: isHovered ? 'scale(1.1) rotate(5deg)' : 'scale(1)',
            }}
          >
            {video.thumbnail}
          </Typography>

          {/* Overlay de play */}
          <Box
            className="video-overlay"
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: 0,
              transition: 'opacity 0.3s ease',
              zIndex: 3,
            }}
          >
            <Fab
              size="large"
              sx={{
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                color: 'white',
                boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.4)}`,
                '&:hover': {
                  transform: 'scale(1.1)',
                  boxShadow: `0 12px 40px ${alpha(theme.palette.primary.main, 0.6)}`,
                },
              }}
            >
              <PlayArrow sx={{ fontSize: '2rem' }} />
            </Fab>
          </Box>

          {/* Badges */}
          <Box sx={{ position: 'absolute', top: 12, left: 12, zIndex: 4 }}>
            <Chip
              label={getDifficultyLabel(video.difficulty)}
              size="small"
              sx={{
                bgcolor: getDifficultyColor(video.difficulty),
                color: 'white',
                fontWeight: 'bold',
                boxShadow: `0 4px 15px ${alpha(getDifficultyColor(video.difficulty), 0.4)}`,
              }}
            />
          </Box>

          {/* Badge de completado */}
          {video.isCompleted && (
            <Box sx={{ position: 'absolute', top: 12, right: 12, zIndex: 4 }}>
              <Chip
                icon={<CheckCircle sx={{ fontSize: '16px !important' }} />}
                label="Completado"
                size="small"
                sx={{
                  bgcolor: '#4caf50',
                  color: 'white',
                  fontWeight: 'bold',
                  boxShadow: '0 4px 15px rgba(76, 175, 80, 0.4)',
                }}
              />
            </Box>
          )}

          {/* Información de duración */}
          <Box sx={{ position: 'absolute', bottom: 12, right: 12, zIndex: 4 }}>
            <Chip
              icon={<Schedule sx={{ fontSize: '14px !important' }} />}
              label={`${Math.floor(video.duration / 60)}:${(video.duration % 60).toString().padStart(2, '0')}`}
              size="small"
              sx={{
                bgcolor: alpha('#000', 0.7),
                color: 'white',
                fontSize: '0.75rem',
              }}
            />
          </Box>
        </Box>

        {/* Contenido de la tarjeta */}
        <CardContent sx={{ p: 3 }}>
          {/* Título y rating */}
          <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
            <Typography
              variant="h6"
              component="h3"
              sx={{
                fontWeight: 'bold',
                flex: 1,
                pr: 1,
                lineHeight: 1.3,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
              }}
            >
              {video.title}
            </Typography>
            <Box display="flex" alignItems="center" gap={0.5}>
              <Star sx={{ color: '#ffc107', fontSize: 16 }} />
              <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                {video.rating?.toFixed(1)}
              </Typography>
            </Box>
          </Box>

          {/* Descripción */}
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 2,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              minHeight: 40,
            }}
          >
            {video.description}
          </Typography>

          {/* Metadatos */}
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Box display="flex" gap={1} alignItems="center">
              <Visibility sx={{ fontSize: 16, color: 'text.secondary' }} />
              <Typography variant="caption" color="text.secondary">
                {video.views?.toLocaleString()} vistas
              </Typography>
            </Box>
            <Typography variant="caption" color="text.secondary">
              {video.questionsCount} preguntas
            </Typography>
          </Box>

          {/* Recompensas */}
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Chip
              icon={<Diamond sx={{ fontSize: '16px !important' }} />}
              label={`${video.rewards.meritos} Mëritos`}
              size="small"
              variant="outlined"
              sx={{
                color: '#9c27b0',
                borderColor: alpha('#9c27b0', 0.5),
                bgcolor: alpha('#9c27b0', 0.1),
                '& .MuiChip-icon': { color: '#9c27b0' },
              }}
            />
            <Chip
              icon={<Bolt sx={{ fontSize: '16px !important' }} />}
              label={`${video.rewards.ondas} Öndas`}
              size="small"
              variant="outlined"
              sx={{
                color: '#ff9800',
                borderColor: alpha('#ff9800', 0.5),
                bgcolor: alpha('#ff9800', 0.1),
                '& .MuiChip-icon': { color: '#ff9800' },
              }}
            />
          </Box>

          {/* Barra de progreso */}
          {video.progress > 0 && (
            <Box>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography variant="caption" color="text.secondary">
                  Progreso
                </Typography>
                <Typography variant="caption" sx={{ fontWeight: 'bold', color: getDifficultyColor(video.difficulty) }}>
                  {video.progress}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={video.progress}
                sx={{
                  height: 6,
                  borderRadius: 3,
                  bgcolor: alpha(getDifficultyColor(video.difficulty), 0.2),
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 3,
                    background: `linear-gradient(90deg, ${getDifficultyColor(video.difficulty)}, ${alpha(getDifficultyColor(video.difficulty), 0.8)})`,
                    boxShadow: `0 0 8px ${alpha(getDifficultyColor(video.difficulty), 0.5)}`,
                  },
                }}
              />
            </Box>
          )}
        </CardContent>
      </Card>
    );
  };

  // Componente de skeleton mejorado
  const VideoCardSkeleton: React.FC = () => (
    <Card
      sx={{
        height: '100%',
        background: alpha('#ffffff', 0.05),
        backdropFilter: 'blur(20px)',
        border: `1px solid ${alpha('#ffffff', 0.1)}`,
        borderRadius: 4,
        overflow: 'hidden',
      }}
    >
      <Skeleton
        variant="rectangular"
        height={200}
        sx={{
          background: `linear-gradient(90deg, ${alpha('#ffffff', 0.1)} 0%, ${alpha('#ffffff', 0.2)} 50%, ${alpha('#ffffff', 0.1)} 100%)`,
          backgroundSize: '200px 100%',
          animation: `${shimmerAnimation} 1.5s ease-in-out infinite`,
        }}
      />
      <CardContent sx={{ p: 3 }}>
        <Skeleton variant="text" height={28} sx={{ mb: 1 }} />
        <Skeleton variant="text" height={20} width="80%" sx={{ mb: 2 }} />
        <Skeleton variant="text" height={16} sx={{ mb: 1 }} />
        <Skeleton variant="text" height={16} width="60%" sx={{ mb: 2 }} />
        <Box display="flex" gap={1}>
          <Skeleton variant="rectangular" width={80} height={24} sx={{ borderRadius: 1 }} />
          <Skeleton variant="rectangular" width={80} height={24} sx={{ borderRadius: 1 }} />
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ position: 'relative' }}>
      {/* Header con controles */}
      <Card
        sx={{
          background: alpha('#ffffff', 0.05),
          backdropFilter: 'blur(20px)',
          border: `1px solid ${alpha('#ffffff', 0.1)}`,
          borderRadius: 4,
          p: 3,
          mb: 3,
        }}
      >
        {/* Barra de búsqueda */}
        <Box display="flex" gap={2} mb={3} flexWrap="wrap">
          <TextField
            fullWidth
            placeholder="Buscar videos por título o descripción..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: 'text.secondary' }} />
                </InputAdornment>
              ),
              sx: {
                background: alpha('#ffffff', 0.05),
                borderRadius: 3,
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: alpha('#ffffff', 0.2),
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: alpha('#ffffff', 0.3),
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: theme.palette.primary.main,
                },
              }
            }}
          />
          <Button
            variant="outlined"
            startIcon={<FilterList />}
            onClick={() => setShowFilters(!showFilters)}
            sx={{
              minWidth: 120,
              borderColor: alpha('#ffffff', 0.2),
              color: 'text.primary',
              '&:hover': {
                borderColor: alpha('#ffffff', 0.4),
                background: alpha('#ffffff', 0.05),
              }
            }}
          >
            Filtros
          </Button>
        </Box>

        {/* Filtros expandibles */}
        <Collapse in={showFilters}>
          <Box sx={{ pt: 2, borderTop: `1px solid ${alpha('#ffffff', 0.1)}` }}>
            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 'bold' }}>
              Filtros Avanzados
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                  Dificultad
                </Typography>
                <Box display="flex" gap={1} flexWrap="wrap">
                  {['easy', 'medium', 'hard'].map((diff) => (
                    <Chip
                      key={diff}
                      label={diff === 'easy' ? 'Fácil' : diff === 'medium' ? 'Medio' : 'Difícil'}
                      variant={filters.difficulty.includes(diff) ? 'filled' : 'outlined'}
                      size="small"
                      onClick={() => {
                        setFilters(prev => ({
                          ...prev,
                          difficulty: prev.difficulty.includes(diff)
                            ? prev.difficulty.filter(d => d !== diff)
                            : [...prev.difficulty, diff]
                        }));
                      }}
                      sx={{
                        borderColor: alpha('#ffffff', 0.3),
                        '&.MuiChip-filled': {
                          bgcolor: theme.palette.primary.main,
                          color: 'white',
                        }
                      }}
                    />
                  ))}
                </Box>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                  Estado
                </Typography>
                <Box display="flex" gap={1}>
                  <Chip
                    label="Completados"
                    variant={filters.completed === true ? 'filled' : 'outlined'}
                    size="small"
                    onClick={() => setFilters(prev => ({ ...prev, completed: prev.completed === true ? null : true }))}
                    sx={{
                      borderColor: alpha('#ffffff', 0.3),
                      '&.MuiChip-filled': {
                        bgcolor: '#4caf50',
                        color: 'white',
                      }
                    }}
                  />
                  <Chip
                    label="Pendientes"
                    variant={filters.completed === false ? 'filled' : 'outlined'}
                    size="small"
                    onClick={() => setFilters(prev => ({ ...prev, completed: prev.completed === false ? null : false }))}
                    sx={{
                      borderColor: alpha('#ffffff', 0.3),
                      '&.MuiChip-filled': {
                        bgcolor: '#ff9800',
                        color: 'white',
                      }
                    }}
                  />
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Collapse>

        {/* Categorías */}
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 'bold' }}>
            Categorías
          </Typography>
          <Box display="flex" gap={1} flexWrap="wrap">
            {categories.map((category) => (
              <Chip
                key={category}
                label={category === 'all' ? 'Todas' : category}
                variant={selectedCategory === category ? 'filled' : 'outlined'}
                onClick={() => setSelectedCategory(category)}
                sx={{
                  borderColor: alpha('#ffffff', 0.3),
                  '&.MuiChip-filled': {
                    bgcolor: theme.palette.secondary.main,
                    color: 'white',
                  },
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: `0 4px 15px ${alpha(theme.palette.secondary.main, 0.3)}`,
                  }
                }}
              />
            ))}
          </Box>
        </Box>

        {/* Estadísticas */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mt={3} pt={2} borderTop={`1px solid ${alpha('#ffffff', 0.1)}`}>
          <Typography variant="body2" color="text.secondary">
            Mostrando {filteredVideos.length} de {adaptedVideos.length} videos
          </Typography>
          <Box display="flex" gap={2} alignItems="center">
            <Typography variant="caption" color="text.secondary">
              Ordenar por:
            </Typography>
            <Chip
              label="Recientes"
              variant={filters.sortBy === 'recent' ? 'filled' : 'outlined'}
              size="small"
              onClick={() => setFilters(prev => ({ ...prev, sortBy: 'recent' }))}
            />
            <Chip
              label="Recompensas"
              variant={filters.sortBy === 'rewards' ? 'filled' : 'outlined'}
              size="small"
              onClick={() => setFilters(prev => ({ ...prev, sortBy: 'rewards' }))}
            />
          </Box>
        </Box>
      </Card>

      {/* Grid de videos */}
      <Grid container spacing={3}>
        {loading ? (
          // Skeletons mientras carga
          Array.from({ length: 8 }, (_, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <VideoCardSkeleton />
            </Grid>
          ))
        ) : filteredVideos.length > 0 ? (
          // Videos filtrados
          filteredVideos.map((video, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={video.id}>
              <VideoCard video={video} index={index} />
            </Grid>
          ))
        ) : (
          // Estado vacío
          <Grid item xs={12}>
            <Card
              sx={{
                background: alpha('#ffffff', 0.05),
                backdropFilter: 'blur(20px)',
                border: `1px solid ${alpha('#ffffff', 0.1)}`,
                borderRadius: 4,
                p: 6,
                textAlign: 'center',
              }}
            >
              <VideoLibrary sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
                No se encontraron videos
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Intenta ajustar los filtros de búsqueda o explorar diferentes categorías
              </Typography>
              <Button
                variant="outlined"
                startIcon={<Search />}
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                  setFilters({
                    difficulty: [],
                    category: [],
                    completed: null,
                    sortBy: 'recent',
                    sortOrder: 'desc',
                  });
                }}
                sx={{
                  borderColor: alpha('#ffffff', 0.3),
                  color: 'text.primary',
                  '&:hover': {
                    borderColor: alpha('#ffffff', 0.5),
                    background: alpha('#ffffff', 0.05),
                  }
                }}
              >
                Limpiar filtros
              </Button>
            </Card>
          </Grid>
        )}
      </Grid>

      {/* FAB para acciones rápidas */}
      <Fab
        sx={{
          position: 'fixed',
          bottom: 24,
          left: 24,
          background: `linear-gradient(135deg, ${theme.palette.secondary.main}, ${theme.palette.secondary.dark})`,
          color: 'white',
          boxShadow: `0 8px 32px ${alpha(theme.palette.secondary.main, 0.4)}`,
          '&:hover': {
            background: `linear-gradient(135deg, ${theme.palette.secondary.dark}, ${theme.palette.secondary.main})`,
            transform: 'scale(1.1)',
          },
        }}
        onClick={() => setShowFilters(!showFilters)}
      >
        {showFilters ? <ExpandLess /> : <FilterList />}
      </Fab>
    </Box>
  );
};

export default UPlayInteractiveLibrary; 