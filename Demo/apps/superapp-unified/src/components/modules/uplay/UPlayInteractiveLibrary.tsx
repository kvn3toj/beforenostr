import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

// 🎯 Material UI Imports
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Fade from '@mui/material/Fade';
import Zoom from '@mui/material/Zoom';
import { useTheme, alpha } from '@mui/material';

// 🎯 Iconos
import SearchIcon from '@mui/icons-material/Search';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import DiamondIcon from '@mui/icons-material/Diamond';
import BoltIcon from '@mui/icons-material/Bolt';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import FilterListIcon from '@mui/icons-material/FilterList';
import StarIcon from '@mui/icons-material/Star';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import BookmarkIcon from '@mui/icons-material/Bookmark';

// 🎨 Revolutionary Widget
import { RevolutionaryWidget } from '../../../design-system/templates';

// 🎯 Hook para datos reales del backend
import { useVideos } from '../../../hooks/data/useVideoData';
import { useUPlayProgress } from './hooks/useUPlayProgress';

// 🎯 Tipos
interface VideoItem {
  id: string;
  title: string;
  description: string;
  duration: number;
  thumbnailUrl?: string;
  youtubeUrl: string;
  category: string;
  difficulty: 'Principiante' | 'Intermedio' | 'Avanzado';
  rewards: {
    meritos: number;
    ondas: number;
  };
  questions: Array<{
    id: string;
    question: string;
    options: string[];
    correctAnswer: number;
  }>;
  progress?: number;
  isCompleted?: boolean;
  isFavorite?: boolean;
  rating: number;
  views: number;
}

export const UPlayInteractiveLibrary: React.FC = () => {
  const theme = useTheme();
  const [animate, setAnimate] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(null);
  const [hoveredVideo, setHoveredVideo] = useState<string | null>(null);
  const navigate = useNavigate();

  // 🎨 Animación de entrada
  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 400);
    return () => clearTimeout(timer);
  }, []);

  // 🎯 Datos de videos del backend
  const { data: backendVideos, isLoading, error } = useVideos();

  // 🎯 Uso de useUPlayProgress para obtener progreso compartido
  const progress = useUPlayProgress();

  // 🎯 Adaptador Backend → Frontend mejorado
  const adaptBackendVideo = (backendVideo: any): VideoItem => {
    const duration = backendVideo.duration || 0;
    const questionCount = backendVideo.questions?.length || 0;

    // 🎯 CORRECCIÓN CRÍTICA: Usar externalId del backend (no youtubeVideoId)
    const videoId = backendVideo.externalId || 'dQw4w9WgXcQ';

    // Parse categories if it's a JSON string
    let categories = [];
    try {
      categories = backendVideo.categories ? JSON.parse(backendVideo.categories) : ['Educación'];
    } catch (e) {
      categories = [backendVideo.category || 'Educación'];
    }
    const mainCategory = categories[0] || 'Educación';

    // Fórmulas de recompensas CoomÜnity dinámicas
    const baseMeritos = Math.floor(duration / 60) * 10;
    const questionBonus = questionCount * 15;
    const difficultyMultiplier = mainCategory?.includes('Avanzado') ? 1.5 :
                                mainCategory?.includes('Intermedio') ? 1.2 : 1.0;

    return {
      id: backendVideo.id.toString(), // Asegurar que sea string para navegación
      title: backendVideo.title || 'Video Sin Título',
      description: backendVideo.description || 'Explora este contenido educativo interactivo.',
      duration,
      thumbnailUrl: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
      youtubeUrl: `https://www.youtube.com/watch?v=${videoId}`,
      category: mainCategory,
      difficulty: duration > 300 ? 'Avanzado' : duration > 180 ? 'Intermedio' : 'Principiante',
      rewards: {
        meritos: Math.floor((baseMeritos + questionBonus) * difficultyMultiplier),
        ondas: Math.floor(duration / 30) * 5 + questionCount * 8
      },
      questions: backendVideo.questions || [],
      progress: Math.random() * 100,
      isCompleted: Math.random() > 0.7,
      isFavorite: Math.random() > 0.8,
      rating: 4 + Math.random(),
      views: Math.floor(Math.random() * 1000) + 50
    };
  };

  // 🎯 Videos procesados
  const processedVideos = useMemo(() => {
    if (!backendVideos || backendVideos.length === 0) {
      return [];
    }

    return backendVideos.map(adaptBackendVideo);
  }, [backendVideos]);

  // 🎯 Categorías dinámicas
  const categories = useMemo(() => {
    const uniqueCategories = ['all', ...new Set(processedVideos.map(v => v.category))];
    return uniqueCategories;
  }, [processedVideos]);

  // 🎯 Videos filtrados
  const filteredVideos = useMemo(() => {
    return processedVideos.filter(video => {
      const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           video.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || video.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [processedVideos, searchTerm, selectedCategory]);

  // 🎯 Formatear duración
  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // 🎯 Handlers
  const handleFilterClick = (event: React.MouseEvent<HTMLElement>) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    handleFilterClose();
  };

  const handleVideoClick = (videoId: string) => {
    console.log('🎬 Video seleccionado:', videoId);

    // Buscar el video en los datos procesados
    const videoData = processedVideos.find(video => video.id === videoId);

    if (videoData) {
      console.log('🎬 Datos del video encontrados:', videoData);

      // Navegar al reproductor con los datos del video
      navigate(`/uplay/video/${videoId}`, {
        state: {
          from: '/uplay',
          videoData
        }
      });
    } else {
      console.error('❌ Video no encontrado:', videoId);
      // Navegar de todas formas, el reproductor manejará la carga
      navigate(`/uplay/video/${videoId}`, {
        state: {
          from: '/uplay'
        }
      });
    }
  };

  // 🎨 Header de búsqueda mejorado
  const renderSearchHeader = () => (
    <Fade in={animate} timeout={600}>
      <Box sx={{ mb: 4 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 2
            }}
          >
            Biblioteca Interactiva
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Explora {processedVideos.length} videos gamificados diseñados para maximizar tu aprendizaje
          </Typography>
        </Box>

        {/* Barra de búsqueda y filtros */}
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              placeholder="Buscar videos por título o contenido..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#6366f1' }} />
                  </InputAdornment>
                ),
                sx: {
                  background: alpha('#ffffff', 0.05),
                  backdropFilter: 'blur(20px)',
                  border: `1px solid ${alpha('#6366f1', 0.2)}`,
                  borderRadius: 3,
                  '&:hover': {
                    border: `1px solid ${alpha('#6366f1', 0.4)}`
                  },
                  '&.Mui-focused': {
                    border: `2px solid #6366f1`,
                    boxShadow: '0 0 20px rgba(99, 102, 241, 0.3)'
                  }
                }
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<FilterListIcon />}
              onClick={handleFilterClick}
              sx={{
                borderColor: alpha('#6366f1', 0.3),
                color: '#6366f1',
                borderRadius: 3,
                py: 1.5,
                '&:hover': {
                  borderColor: '#6366f1',
                  background: alpha('#6366f1', 0.1)
                }
              }}
            >
              Filtrar ({selectedCategory === 'all' ? 'Todos' : selectedCategory})
            </Button>
            <Menu
              anchorEl={filterAnchorEl}
              open={Boolean(filterAnchorEl)}
              onClose={handleFilterClose}
              PaperProps={{
                sx: {
                  background: alpha('#ffffff', 0.1),
                  backdropFilter: 'blur(20px)',
                  border: `1px solid ${alpha('#ffffff', 0.2)}`,
                  borderRadius: 2
                }
              }}
            >
              {categories.map((category) => (
                <MenuItem
                  key={category}
                  onClick={() => handleCategorySelect(category)}
                  selected={selectedCategory === category}
                >
                  {category === 'all' ? 'Todas las categorías' : category}
                </MenuItem>
              ))}
            </Menu>
          </Grid>
        </Grid>
      </Box>
    </Fade>
  );

  // 🎨 Card de video mejorada
  const renderVideoCard = (video: VideoItem, index: number) => (
    <Grid key={video.id} item xs={12} sm={6} md={4}>
      <Zoom in={animate} timeout={800 + index * 100}>
        <Card
          className="uplay-video-card"
          onMouseEnter={() => setHoveredVideo(video.id)}
          onMouseLeave={() => setHoveredVideo(null)}
          onClick={() => handleVideoClick(video.id)}
          sx={{
            cursor: 'pointer',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            overflow: 'hidden',
            transform: hoveredVideo === video.id ? 'translateY(-8px) scale(1.02)' : 'translateY(0)',
            transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            '&:hover': {
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
            }
          }}
        >
          {/* Thumbnail con overlay */}
          <Box sx={{ position: 'relative' }}>
            <CardMedia
              component="img"
              height="200"
              image={video.thumbnailUrl}
              alt={video.title}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://via.placeholder.com/320x180/6366f1/ffffff?text=Video';
              }}
            />

            {/* Overlay con información */}
            <Box
              className="uplay-video-overlay"
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(135deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.7) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: hoveredVideo === video.id ? 1 : 0,
                transition: 'opacity 0.3s ease'
              }}
            >
              <IconButton
                className="uplay-play-button"
                sx={{
                  background: 'rgba(255, 255, 255, 0.9)',
                  color: '#6366f1',
                  width: 60,
                  height: 60,
                  '&:hover': {
                    background: 'white',
                    transform: 'scale(1.1)'
                  }
                }}
              >
                <PlayArrowIcon sx={{ fontSize: 32 }} />
              </IconButton>
            </Box>

            {/* Badges informativos */}
            <Box sx={{ position: 'absolute', top: 12, left: 12 }}>
              <Chip
                label={video.difficulty}
                size="small"
                sx={{
                  background: video.difficulty === 'Avanzado' ? 'linear-gradient(135deg, #ef4444, #dc2626)' :
                             video.difficulty === 'Intermedio' ? 'linear-gradient(135deg, #f59e0b, #d97706)' :
                             'linear-gradient(135deg, #10b981, #059669)',
                  color: 'white',
                  fontWeight: 600,
                  fontSize: '0.7rem'
                }}
              />
            </Box>

            <Box sx={{ position: 'absolute', top: 12, right: 12 }}>
              {video.isFavorite && (
                <IconButton
                  size="small"
                  sx={{
                    background: alpha('#fbbf24', 0.9),
                    color: 'white',
                    width: 32,
                    height: 32,
                    '&:hover': {
                      background: '#fbbf24'
                    }
                  }}
                >
                  <BookmarkIcon sx={{ fontSize: 16 }} />
                </IconButton>
              )}
            </Box>

            {/* Duración */}
            <Box
              sx={{
                position: 'absolute',
                bottom: 12,
                right: 12,
                background: 'rgba(0, 0, 0, 0.8)',
                color: 'white',
                px: 1,
                py: 0.5,
                borderRadius: 1,
                fontSize: '0.75rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: 0.5
              }}
            >
              <AccessTimeIcon sx={{ fontSize: 14 }} />
              {formatDuration(video.duration)}
            </Box>

            {/* Sparkle effect para videos completados */}
            {video.isCompleted && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 16,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 24,
                  height: 24,
                  background: 'radial-gradient(circle, #10b981, #059669)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  animation: 'uplay-sparkle 3s ease-in-out infinite'
                }}
              >
                <CheckCircleIcon sx={{ color: 'white', fontSize: 16 }} />
              </Box>
            )}
          </Box>

          {/* Contenido de la tarjeta */}
          <CardContent sx={{ flex: 1, p: 3 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                mb: 1,
                lineHeight: 1.3,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              {video.title}
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mb: 2,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                lineHeight: 1.4
              }}
            >
              {video.description}
            </Typography>

            {/* Progreso */}
            {video.progress && video.progress > 0 && (
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="caption" color="text.secondary">
                    Progreso
                  </Typography>
                  <Typography variant="caption" sx={{ fontWeight: 600 }}>
                    {Math.round(video.progress)}%
                  </Typography>
                </Box>
                <Box className="uplay-progress-container" sx={{ height: 6 }}>
                  <Box
                    className="uplay-progress-bar"
                    sx={{
                      width: `${video.progress}%`,
                      height: '100%'
                    }}
                  />
                </Box>
              </Box>
            )}

            {/* Recompensas */}
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <Chip
                icon={<DiamondIcon />}
                label={`${video.rewards.meritos} Mëritos`}
                size="small"
                sx={{
                  background: 'linear-gradient(135deg, #7c3aed, #6366f1)',
                  color: 'white',
                  fontSize: '0.7rem',
                  '& .MuiChip-icon': {
                    color: 'white',
                    fontSize: 14
                  }
                }}
              />
              <Chip
                icon={<BoltIcon />}
                label={`${video.rewards.ondas} Öndas`}
                size="small"
                sx={{
                  background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                  color: 'white',
                  fontSize: '0.7rem',
                  '& .MuiChip-icon': {
                    color: 'white',
                    fontSize: 14
                  }
                }}
              />
            </Box>

            {/* Footer de la tarjeta */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <StarIcon sx={{ color: '#fbbf24', fontSize: 16 }} />
                <Typography variant="caption" sx={{ fontWeight: 600 }}>
                  {video.rating.toFixed(1)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  ({video.views} vistas)
                </Typography>
              </Box>

              {video.questions.length > 0 && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <QuestionAnswerIcon sx={{ color: '#6366f1', fontSize: 16 }} />
                  <Typography variant="caption" sx={{ fontWeight: 600, color: '#6366f1' }}>
                    {video.questions.length} preguntas
                  </Typography>
                </Box>
              )}
            </Box>
          </CardContent>
        </Card>
      </Zoom>
    </Grid>
  );

  // 🎨 Loading state mejorado
  if (isLoading) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <RevolutionaryWidget variant="cosmic" intensity="medium" />
        <Typography variant="h6" sx={{ mt: 2, color: 'text.secondary' }}>
          Cargando biblioteca de videos...
        </Typography>
      </Box>
    );
  }

  // 🎨 Error state mejorado
  if (error) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <AutoAwesomeIcon sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />
        <Typography variant="h6" color="error" sx={{ mb: 1 }}>
          Error al cargar los videos
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Por favor, verifica tu conexión e intenta nuevamente
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ position: 'relative', minHeight: '100vh' }}>
      {/* Efectos de fondo */}
      <RevolutionaryWidget
        variant="subtle"
        intensity="low"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: -1,
          opacity: 0.2
        }}
      />

      {/* Partículas flotantes */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          overflow: 'hidden',
          pointerEvents: 'none',
          zIndex: 0
        }}
      >
        {[...Array(10)].map((_, i) => (
          <Box
            key={i}
            className="uplay-particle sparkle"
            sx={{
              width: Math.random() * 6 + 3,
              height: Math.random() * 6 + 3,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          />
        ))}
      </Box>

      {/* Contenido principal */}
      <Box sx={{ position: 'relative', zIndex: 1, pb: 4 }}>
        {/* Header de búsqueda */}
        {renderSearchHeader()}

        {/* Grid de videos */}
        {filteredVideos.length === 0 ? (
          <Fade in={animate} timeout={1000}>
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <SearchIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                No se encontraron videos
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Intenta ajustar tu búsqueda o filtros
              </Typography>
            </Box>
          </Fade>
        ) : (
          <Grid container spacing={3} sx={{ px: 3 }}>
            {filteredVideos.map((video, index) => renderVideoCard(video, index))}
          </Grid>
        )}
      </Box>
    </Box>
  );
};

export default UPlayInteractiveLibrary;
