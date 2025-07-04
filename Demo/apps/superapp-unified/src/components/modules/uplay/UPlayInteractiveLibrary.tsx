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
import { useTheme, alpha, Paper, LinearProgress, Skeleton, Button as MuiButton } from '@mui/material';

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
import VideocamOffIcon from '@mui/icons-material/VideocamOff';

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

  // 🎯 Videos procesados - SIMPLIFICADO
  // El hook `useVideos` ya se encarga de la adaptación y validación de datos.
  // No es necesario un segundo mapeo aquí. Consumimos los datos directamente.
  const processedVideos: VideoItem[] = useMemo(() => {
    if (!backendVideos) return [];
    // Los datos de 'backendVideos' ya están adaptados y son compatibles con 'VideoItem'.
    // Si se necesitara alguna propiedad extra solo para la UI, se añadiría aquí,
    // pero la estructura principal ya es correcta.
    return backendVideos as VideoItem[];
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
    <Fade in={animate} timeout={500}>
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 3,
          background: `linear-gradient(145deg, ${alpha(
            theme.palette.background.paper,
            0.8
          )}, ${alpha(theme.palette.background.default, 0.8)})`,
          backdropFilter: 'blur(10px)',
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Buscar por título, tema o concepto..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="primary" />
                  </InputAdornment>
                ),
                sx: {
                  borderRadius: 2,
                  backgroundColor: theme.palette.background.default,
                },
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {categories.map(category => (
                <Chip
                  key={category}
                  label={category === 'all' ? 'Todos' : category}
                  clickable
                  onClick={() => handleCategorySelect(category)}
                  color={selectedCategory === category ? 'primary' : 'default'}
                  variant={
                    selectedCategory === category ? 'filled' : 'outlined'
                  }
                  sx={{ fontWeight: 500 }}
                />
              ))}
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Fade>
  );

  const VideoCard: React.FC<{ video: VideoItem; onPlay: () => void }> = ({
    video,
    onPlay,
  }) => {
    const theme = useTheme();
    const difficultyColor =
      video.difficulty === 'Principiante'
        ? theme.palette.success.main
        : video.difficulty === 'Intermedio'
        ? theme.palette.warning.main
        : theme.palette.error.main;

    const hasThumbnail = !!video.thumbnailUrl;

    return (
      <Card
        onClick={onPlay}
        sx={{
          height: '250px',
          cursor: 'pointer',
          transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 3,
          boxShadow: 'none',
          border: `1px solid ${theme.palette.divider}`,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          backgroundImage: hasThumbnail ? `url(${video.thumbnailUrl})` : 'none',
          backgroundColor: hasThumbnail ? 'transparent' : theme.palette.background.paper,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0) 100%)',
            opacity: hasThumbnail ? 1 : 0,
            transition: 'background 0.3s, opacity 0.3s',
          },
          '&:hover': {
            transform: 'scale(1.03)',
            boxShadow: `0 8px 30px ${alpha(difficultyColor, 0.2)}`,
            '& .play-icon': {
              opacity: 1,
              transform: 'scale(1.2)',
            },
            '&::before': {
              background:
                'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.1) 100%)',
            },
          },
        }}
      >
        {!hasThumbnail && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: theme.palette.background.default,
              flexDirection: 'column',
            }}
          >
            <VideocamOffIcon sx={{ fontSize: 60, color: 'text.disabled' }} />
            <Typography variant="caption" color="text.secondary" mt={1}>
              Thumbnail no disponible
            </Typography>
          </Box>
        )}
        <Box
          className="play-icon"
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%) scale(1)',
            color: hasThumbnail ? '#fff' : 'primary.main',
            opacity: 0.8,
            transition: 'all 0.3s ease',
            pointerEvents: 'none',
          }}
        >
          <PlayArrowIcon sx={{ fontSize: 60 }} />
        </Box>

        <CardContent
          sx={{
            position: 'relative',
            zIndex: 1,
            color: '#fff',
            pt: 6,
            pb: '16px !important',
            opacity: hasThumbnail ? 1 : 0,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 'bold',
              lineHeight: 1.3,
              mb: 1,
              textShadow: '1px 1px 3px rgba(0,0,0,0.7)',
            }}
          >
            {video.title}
          </Typography>

          <Grid
            container
            justifyContent="space-between"
            alignItems="center"
            spacing={1}
          >
            <Grid item>
              <Chip
                icon={<DiamondIcon fontSize="small" />}
                label={`${video.rewards?.meritos ?? 0} M`}
                size="small"
                sx={{
                  background: alpha(theme.palette.primary.light, 0.2),
                  color: '#fff',
                  fontWeight: 500,
                  border: `1px solid ${alpha(theme.palette.primary.light, 0.3)}`,
                  backdropFilter: 'blur(4px)',
                }}
              />
            </Grid>
            <Grid item>
              <Chip
                icon={<BoltIcon fontSize="small" />}
                label={`${video.rewards?.ondas ?? 0} Ö`}
                size="small"
                sx={{
                  background: alpha(theme.palette.secondary.light, 0.2),
                  color: '#fff',
                  fontWeight: 500,
                  border: `1px solid ${alpha(theme.palette.secondary.light, 0.3)}`,
                  backdropFilter: 'blur(4px)',
                }}
              />
            </Grid>
          </Grid>
        </CardContent>
        <Chip
          label={video.difficulty}
          size="small"
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            zIndex: 2,
            background: difficultyColor,
            color: theme.palette.getContrastText(difficultyColor),
            fontWeight: 'bold',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            opacity: hasThumbnail ? 1 : 0,
          }}
        />
        <LinearProgress
          variant="determinate"
          value={video.progress || 0}
          sx={{
            height: 6,
            borderBottomLeftRadius: 12,
            borderBottomRightRadius: 12,
            backgroundColor: alpha('#fff', 0.2),
            opacity: hasThumbnail ? 1 : 0,
            '& .MuiLinearProgress-bar': {
              backgroundColor: difficultyColor,
            },
          }}
        />
      </Card>
    );
  };

  const renderLoadingSkeletons = () => (
    <Grid container spacing={3}>
      {Array.from(new Array(6)).map((_, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <Skeleton variant="rectangular" height={250} sx={{ borderRadius: 3 }} />
        </Grid>
      ))}
    </Grid>
  );

  const renderEmptyState = () => (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 10,
        textAlign: 'center',
        color: 'text.secondary',
      }}
    >
      <VideocamOffIcon sx={{ fontSize: 64, mb: 2 }} />
      <Typography variant="h5" gutterBottom>
        No se encontraron videos
      </Typography>
      <Typography>
        Intenta ajustar tu búsqueda o selecciona otra categoría.
      </Typography>
    </Box>
  );

  // 🎨 Video Card
  const renderVideoCard = (video: VideoItem, index: number) => (
    <Grid item xs={12} sm={6} md={4} key={video.id}>
      <Fade in={animate} timeout={(index + 1) * 200}>
        <div>
          <VideoCard
            video={video}
            onPlay={() => handleVideoClick(video.id)}
          />
        </div>
      </Fade>
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
    <Box sx={{ p: { xs: 1, md: 3 } }}>
      {renderSearchHeader()}

      {isLoading && renderLoadingSkeletons()}

      {!isLoading && filteredVideos.length > 0 && (
        <Grid container spacing={3}>
          {filteredVideos.map(renderVideoCard)}
        </Grid>
      )}

      {!isLoading && filteredVideos.length === 0 && renderEmptyState()}

      <RevolutionaryWidget
        title="Tu Biblioteca de Sabiduría"
        subtitle="Cada video es una puerta a un nuevo nivel de conciencia. Explora, aprende y contribuye al Bien Común."
        actions={[
          <MuiButton
            key="discover"
            variant="contained"
            color="primary"
            onClick={() => navigate('/ustats')}
          >
            Descubre tu Potencial
          </MuiButton>,
        ]}
        style={{ marginTop: theme.spacing(5) }}
      >
        {null}
      </RevolutionaryWidget>
    </Box>
  );
};

export default UPlayInteractiveLibrary;
