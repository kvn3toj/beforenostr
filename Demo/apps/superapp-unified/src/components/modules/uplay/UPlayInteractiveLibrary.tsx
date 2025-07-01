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
import { getVideoThumbnail } from '../../../utils/videoUtils';

// 🎯 IMPORT DEL VIDEO DURATION FIXER para corregir duraciones 0:00
import { useVideosWithCorrectDurations, formatDuration as fixedFormatDuration } from '../../../utils/videoDurationFixer';

// 🎯 Tipos
interface VideoItem {
  id: string;
  title: string;
  description: string;
  duration: number;
  thumbnailUrl?: string;
  externalId?: string; // ID de YouTube para generar thumbnails
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

  // 🎯 Paso 1: Mapear los datos del backend al formato que espera el hook de corrección
  const videosForDurationFix = useMemo(() => {
    if (!backendVideos) return [];
    return backendVideos.map((video: any) => ({
      id: video.id,
      title: video.title,
      content: video.content || video.url,
      duration: video.duration || 0,
    }));
  }, [backendVideos]);

  // 🎯 Paso 2: Llamar al hook en el nivel superior del componente
  const videosWithCorrectedDurations = useVideosWithCorrectDurations(videosForDurationFix);

  // 🎯 Adaptador Backend → Frontend mejorado
  const adaptBackendVideo = (backendVideo: any): VideoItem => {
    // 🎯 Paso 3: Encontrar la duración corregida en lugar de llamar al hook aquí
    const correctedVideo = videosWithCorrectedDurations.find(v => v.id === backendVideo.id);
    const duration = correctedVideo ? correctedVideo.duration : (backendVideo.duration || 0);

    console.log(`[ÜPLAY LIBRARY DEBUG] Video "${backendVideo.title}": ${backendVideo.duration}s → ${duration}s (${fixedFormatDuration(duration)})`);

    const questionCount = backendVideo.questions?.length || 0;

    // 🎯 CORRECCIÓN CRÍTICA: Usar externalId del backend (no youtubeVideoId) y evitar conflictos de declaración
    const extractedVideoId = backendVideo?.externalId;

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

    // 🔧 THUMBNAIL MEJORADO: Usar thumbnailUrl del backend si existe, sino externalId, sino fallback
    let finalThumbnailUrl = undefined;
    let finalYoutubeUrl = undefined;

    if (backendVideo.thumbnailUrl) {
      finalThumbnailUrl = backendVideo.thumbnailUrl;
    } else if (extractedVideoId) {
      finalThumbnailUrl = `https://img.youtube.com/vi/${extractedVideoId}/hqdefault.jpg`;
    }

    if (extractedVideoId) {
      finalYoutubeUrl = `https://www.youtube.com/watch?v=${extractedVideoId}`;
    } else if (backendVideo.url) {
      finalYoutubeUrl = backendVideo.url;
    }

    return {
      id: backendVideo.id.toString(), // Asegurar que sea string para navegación
      title: backendVideo.title || 'Video Sin Título',
      description: backendVideo.description || 'Explora este contenido educativo interactivo.',
      duration,
      thumbnailUrl: finalThumbnailUrl,
      externalId: extractedVideoId, // Pasar el externalId para generar thumbnails
      youtubeUrl: finalYoutubeUrl,
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

    // Usar el array con duraciones ya corregidas para el mapeo
    return backendVideos.map(adaptBackendVideo);
  }, [backendVideos, videosWithCorrectedDurations]);

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

  // 🎯 Formatear duración usando videoDurationFixer mejorado
  const formatDuration = (seconds: number): string => {
    return fixedFormatDuration(seconds);
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
                minHeight: 48,
                minWidth: 48,
                fontWeight: 700,
                boxShadow: '0 2px 8px 0 rgba(99,102,241,0.12)',
                background: 'linear-gradient(135deg, #2563eb 0%, #6c5ce7 100%)',
                '&:hover': {
                  borderColor: '#6366f1',
                  background: 'linear-gradient(135deg, #1e293b 0%, #6366f1 100%)',
                  color: '#fff',
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
            transition: 'all 0.3s ease-in-out',
          }}
        >
          {/* Thumbnail con overlay */}
          <Box sx={{ position: 'relative' }}>
            <CardMedia
              component="img"
              height="200"
              image={getVideoThumbnail({
                thumbnailUrl: video.thumbnailUrl,
                externalId: video.externalId,
                url: video.youtubeUrl,
              }) ?? '/placeholder-video.svg'}
              alt={video.title}
              data-testid="uplay-video-thumbnail"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/placeholder-video.svg';
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
                background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 60%)',
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
                  background: alpha(theme.palette.primary.main, 0.9),
                  color: theme.palette.primary.contrastText,
                  width: 50,
                  height: 50,
                  '&:hover': {
                    background: theme.palette.primary.main,
                    transform: 'scale(1.1)'
                  }
                }}
              >
                <PlayArrowIcon sx={{ fontSize: 30 }} />
              </IconButton>
            </Box>

            {/* Badges informativos */}
            <Box sx={{ position: 'absolute', top: 12, left: 12 }}>
              <Chip
                label={video.difficulty}
                size="small"
                sx={{
                  backgroundColor: alpha(theme.palette.secondary.dark, 0.8),
                  color: 'white',
                  fontWeight: 600,
                  fontSize: '0.7rem',
                  borderRadius: 2,
                  boxShadow: 'none',
                }}
              />
            </Box>

            <Box sx={{ position: 'absolute', top: 12, right: 12 }}>
              {video.isFavorite && (
                <IconButton
                  size="small"
                  sx={{
                    background: alpha(theme.palette.warning.main, 0.9),
                    color: 'white',
                    width: 32,
                    height: 32,
                    '&:hover': {
                      background: theme.palette.warning.main
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
                  background: 'radial-gradient(circle, #6366f1, #7c3aed)',
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
                <Box className="uplay-progress-container" sx={{ height: 4, backgroundColor: theme.palette.divider, borderRadius: 2 }}>
                  <Box
                    className="uplay-progress-bar"
                    sx={{
                      width: `${video.progress}%`,
                      height: '100%',
                      backgroundColor: theme.palette.primary.main,
                      borderRadius: 2,
                    }}
                  />
                </Box>
              </Box>
            )}

            {/* Recompensas */}
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip
                icon={<DiamondIcon />}
                label={`${video.rewards.meritos} Mëritos`}
                size="small"
                variant="outlined"
                sx={{
                  borderColor: theme.palette.primary.light,
                  color: theme.palette.primary.dark,
                  '& .MuiChip-icon': {
                    color: theme.palette.primary.main
                  }
                }}
              />
              <Chip
                icon={<BoltIcon />}
                label={`${video.rewards.ondas} Öndas`}
                size="small"
                variant="outlined"
                sx={{
                  borderColor: theme.palette.secondary.light,
                  color: theme.palette.secondary.dark,
                  '& .MuiChip-icon': {
                    color: theme.palette.secondary.main,
                  }
                }}
              />
            </Box>

            {/* Footer de la tarjeta */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <StarIcon sx={{ color: '#bfae60', fontSize: 16 }} />
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
        <RevolutionaryWidget variant="cosmic" cosmicIntensity="medium">{null}</RevolutionaryWidget>
        <Typography variant="h6" sx={{ mt: 2, color: 'text.secondary' }}>
          Cargando biblioteca de videos...
        </Typography>
      </Box>
    );
  }

  // 🟠 DEBUG LOGS: Estado de carga y error
  console.log('🟠 Estado de carga:', { isLoading, error, backendVideos });
  if (error) {
    console.error('🛑 Error detectado en useVideos:', error, backendVideos);
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
        variant="minimal"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 0,
          opacity: 0.12
        }}
      >{null}</RevolutionaryWidget>

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
