import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Stack,
  Chip,
  Button,
  IconButton,
  Skeleton,
  Alert,
  Snackbar,
  useTheme,
  useMediaQuery,
  Fab,
  Zoom,
  Paper,
  Grid,
  Divider,
  Avatar,
  Badge,
  LinearProgress,
  CircularProgress,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  PlayArrow as PlayIcon,
  Quiz as QuizIcon,
  Star as StarIcon,
  Diamond as DiamondIcon,
  Bolt as BoltIcon,
  School as SchoolIcon,
  TrendingUp as TrendingUpIcon,
  EmojiEvents as TrophyIcon,
  LocalFireDepartment as FireIcon,
  VideoLibrary as VideoLibraryIcon,
  Share as ShareIcon,
  Bookmark as BookmarkIcon,
  Favorite as FavoriteIcon,
  HelpOutline as HelpOutlineIcon,
  CheckCircleOutline as CheckCircleOutlineIcon,
} from '@mui/icons-material';
import { z } from 'zod';

// Import components and hooks
import InteractiveVideoPlayerOverlay from '../components/modules/uplay/components/InteractiveVideoPlayerOverlay';
import { useVideos, useVideoDetail } from '../hooks/data/useVideoData'; // Hook del backend real
import { apiService } from '../lib/api-service'; // Para analytics
import { getVideoThumbnail } from '../utils/videoUtils';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import {
  VideoDataSchema,
  VideoItem,
} from '../types/video-player.schemas';
import YouTubePlayer from '../components/modules/uplay/components/YouTubePlayer';

// Types - Simplificado gracias a la fuente de verdad única
// interface VideoData { ... } // Eliminado
// interface PlaylistVideo { ... } // Eliminado

interface UserProgress {
  completedVideos: number;
  totalVideos: number;
  currentStreak: number;
  totalMerits: number;
  totalOndas: number;
  level: number;
  accuracyRate: number;
}

// Cache for environment check to avoid repeated computation
let videoPlayerEnvCheckCache: boolean | null = null;
let videoPlayerEnvCheckTime = 0;

// Utility to detect if we're in Builder.io or similar preview environment
const isPreviewEnvironment = (): boolean => {
  const now = Date.now();

  // Use cached result if it's less than 5 seconds old
  if (videoPlayerEnvCheckCache !== null && now - videoPlayerEnvCheckTime < 5000) {
    return videoPlayerEnvCheckCache;
  }

  // Check for common preview environment indicators
  const result = (
    typeof window !== 'undefined' && (
      window.location.hostname.includes('builder.io') ||
      window.location.hostname.includes('preview') ||
      window.parent !== window || // iframe context
      window.location.search.includes('builder-preview') ||
      !window.location.hostname.includes('localhost')
    )
  );

  videoPlayerEnvCheckCache = result;
  videoPlayerEnvCheckTime = now;
  return result;
};

// Direct video data without async loading
const getVideoData = (videoId: string): VideoItem => {
  // console.log('🔍 getVideoData called with videoId:', videoId);

  // Use public videos for preview environments like Builder.io
  const isPreview = isPreviewEnvironment();
  const getVideoUrl = (localUrl: string, videoId: string) => {
    if (isPreview) {
      // Map specific CoomÜnity videos to relevant YouTube content
      const youtubeVideoMap: Record<string, string> = {
        'coomunity-intro': 'https://www.youtube.com/embed/gKA4JjkiU4A', // The Five Minute Communitarian
        'reciprocidad-deep-dive': 'https://www.youtube.com/embed/5J4UaAskcHg', // What is Reciprocity
        'ondas-energia': 'https://www.youtube.com/embed/EwzWTIdhYRQ', // Towards an ontology of the commons
      };

      return youtubeVideoMap[videoId] || 'https://www.youtube.com/embed/gKA4JjkiU4A';
    }
    return localUrl;
  };

  const videoDatabase: Record<string, VideoItem> = {
    'coomunity-intro': {
      id: 'coomunity-intro',
      title: 'Introducción a CoomÜnity: Filosofía y Principios',
      description:
        'Descubre los fundamentos de CoomÜnity: Reciprocidad, Bien Común, Öndas y la economía colaborativa que transforma vidas.',
      url: getVideoUrl('/assets/vid1.mp4', 'coomunity-intro'),
      duration: 240,
      questions: [],
      category: 'Fundamentos',
      difficulty: 'Principiante',
      estimatedRewards: { merits: 120, ondas: 50 },
      tags: ['Filosofía', 'Reciprocidad', 'Bien Común', 'Öndas'],
    },
    'reciprocidad-deep-dive': {
      id: 'reciprocidad-deep-dive',
      title: 'Reciprocidad: El Arte de la Reciprocidad Equilibrada',
      description:
        'Profundiza en el concepto de Reciprocidad y cómo aplicar la reciprocidad en tu vida diaria para crear armonía.',
      url: getVideoUrl('/assets/vid2.mp4', 'reciprocidad-deep-dive'),
      duration: 320,
      questions: [],
      category: 'Principios',
      difficulty: 'Intermedio',
      estimatedRewards: { merits: 180, ondas: 75 },
      tags: ['Reciprocidad', 'Reciprocidad', 'Equilibrio', 'Armonía'],
    },
    'ondas-energia': {
      id: 'ondas-energia',
      title: 'Öndas: Canalizando la Energía Vibracional Positiva',
      description:
        'Aprende a generar, canalizar y multiplicar las Öndas para contribuir al bienestar colectivo.',
      url: getVideoUrl('/assets/vid3.mp4', 'ondas-energia'),
      duration: 280,
      questions: [],
      category: 'Energía',
      difficulty: 'Avanzado',
      estimatedRewards: { merits: 220, ondas: 95 },
      tags: ['Öndas', 'Energía', 'Vibración', 'Bienestar'],
    },
  };

  const result = videoDatabase[videoId] || {
    id: 'default',
    title: 'Video de CoomÜnity',
    description: 'Contenido educativo sobre los principios de CoomÜnity',
    url: getVideoUrl('/assets/vid1.mp4', 'coomunity-intro'),
    duration: 180,
    questions: [],
    category: 'General',
    difficulty: 'Intermedio',
    estimatedRewards: { merits: 100, ondas: 40 },
    tags: ['CoomÜnity'],
  };

  // console.log('🎯 getVideoData result:', {
  //   inputVideoId: videoId,
  //   foundInDatabase: !!videoDatabase[videoId],
  //   resultTitle: result.title,
  //   resultUrl: result.url,
  //   availableKeys: Object.keys(videoDatabase)
  // });

  return result;
};

const getPlaylistVideos = (): VideoItem[] => [
  {
    id: 'coomunity-intro',
    title: 'Introducción a CoomÜnity',
    duration: 240,
    hasQuestions: true,
    difficulty: 'Principiante',
    isCompleted: false,
  },
  {
    id: 'reciprocidad-deep-dive',
    title: 'Reciprocidad: El Arte de la Reciprocidad',
    duration: 320,
    hasQuestions: true,
    difficulty: 'Intermedio',
    isCompleted: false,
  },
  {
    id: 'ondas-energia',
    title: 'Öndas: Energía Vibracional',
    duration: 280,
    hasQuestions: true,
    difficulty: 'Avanzado',
    isCompleted: false,
  },
];

const getUserProgress = (): UserProgress => ({
  completedVideos: 2,
  totalVideos: 8,
  currentStreak: 3,
  totalMerits: 340,
  totalOndas: 125,
  level: 4,
  accuracyRate: 87,
});

// Utility to convert YouTube URLs to a format our enhanced player can use
const convertToVideoPlayerUrl = (url: string): string => {
  // 🎯 CORRECCIÓN: Usar URLs reales de YouTube en lugar de videos de muestra
  if (url && (url.includes('youtube.com') || url.includes('youtu.be'))) {
    console.log('🎬 YouTube URL detected, using REAL YouTube URL for player:', url);

    // Extract video ID from YouTube URL
    let videoId = '';
    if (url.includes('watch?v=')) {
      videoId = url.split('watch?v=')[1].split('&')[0];
    } else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1].split('?')[0];
    }

    if (videoId) {
      // Return YouTube embed URL for iframe integration
      return `https://www.youtube.com/embed/${videoId}?enablejsapi=1&rel=0&modestbranding=1`;
    }
  }
  return url;
};

// =================================================================
// Subcomponentes de la página
// =================================================================

interface GamificationStatusBarProps {
  level: number;
  progress: number;
  streak: number;
  accuracy: number;
}

const GamificationStatusBar: React.FC<GamificationStatusBarProps> = ({ level, progress, streak, accuracy }) => {
  const theme = useTheme();
  return (
    <Paper elevation={0} sx={{ p: 2, mb: 2, borderRadius: 3, background: theme.palette.background.default }}>
      <Grid container alignItems="center" spacing={2}>
        <Grid item>
          <Chip label={`Nivel ${level}`} color="primary" sx={{ fontWeight: 'bold' }} />
        </Grid>
        <Grid item xs>
          <LinearProgress variant="determinate" value={progress} />
        </Grid>
        <Grid item>
          <Chip label={`${progress}%`} variant="outlined" size="small" />
        </Grid>
        <Grid item>
          <Chip icon={<FireIcon />} label={`Racha: ${streak}`} variant="outlined" sx={{ color: theme.palette.warning.main, borderColor: theme.palette.warning.main }} />
        </Grid>
        <Grid item>
          <Chip icon={<CheckCircleOutlineIcon />} label={`${accuracy}% precisión`} variant="outlined" sx={{ color: theme.palette.success.main, borderColor: theme.palette.success.main }} />
        </Grid>
      </Grid>
    </Paper>
  );
};

interface VideoInfoCardProps {
  video: VideoItem;
}

const VideoInfoCard: React.FC<VideoInfoCardProps> = ({ video }) => (
  <Paper elevation={0} sx={{ p: 2, borderRadius: 3, mb: 2 }}>
    <Typography variant="h5" fontWeight="bold" gutterBottom>{video.title}</Typography>
    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
      {video.description}
    </Typography>
    <Box display="flex" gap={1} mb={2}>
      <Chip label={video.category} size="small" />
      <Chip label={video.difficulty} size="small" variant="outlined" />
    </Box>
    <Typography variant="subtitle2" fontWeight="bold">Recompensas Estimadas</Typography>
    <Stack direction="row" spacing={2} mb={2}>
      <Chip icon={<DiamondIcon />} label={`${video.rewards?.meritos ?? 0} Méritos`} />
      <Chip icon={<BoltIcon />} label={`${video.rewards?.ondas ?? 0} Öndas`} />
    </Stack>
    <Stack direction="row" spacing={1}>
      <Button startIcon={<BookmarkIcon />} variant="outlined">Guardar</Button>
      <Button startIcon={<ShareIcon />} variant="outlined">Compartir</Button>
      <Button startIcon={<FavoriteIcon />} variant="outlined" color="error">Me gusta</Button>
    </Stack>
  </Paper>
);

interface PlaylistSidebarProps {
  videos: VideoItem[];
  currentVideoId?: string;
  onVideoSelect: (videoId: string) => void;
}

const PlaylistSidebar: React.FC<PlaylistSidebarProps> = ({
  videos,
  currentVideoId,
  onVideoSelect,
}) => {
  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'Principiante':
        return '#10b981';
      case 'Intermedio':
        return '#f59e0b';
      case 'Avanzado':
        return '#ef4444';
      default:
        return '#6366f1';
    }
  };

  return (
    <Stack spacing={2}>
       {videos.map((video) => (
         <Card
           key={video.id}
           sx={{
             cursor: 'pointer',
             border:
               video.id === currentVideoId
                 ? '2px solid #6366f1'
                 : '2px solid #e2e8f0',
             backgroundColor:
               video.id === currentVideoId ? '#f8fafc' : 'white',
             '&:hover': {
               borderColor: '#6366f1',
               transform: 'translateY(-1px)',
               boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
             },
             transition: 'all 0.2s ease',
           }}
           onClick={() => onVideoSelect(video.id)}
         >
           <CardContent sx={{ p: 2 }}>
             <Stack direction="row" alignItems="center" spacing={2}>
               <Avatar
                 sx={{
                   backgroundColor: video.isCompleted
                     ? '#10b981'
                     : getDifficultyColor(video.difficulty),
                   color: 'white',
                   fontWeight: 700,
                   width: 40,
                   height: 40,
                 }}
               >
                 {video.isCompleted ? '✓' : <PlayIcon />}
               </Avatar>
               <Box sx={{ flex: 1 }}>
                 <Typography
                   variant="subtitle2"
                   sx={{
                     fontWeight: 600,
                     mb: 0.5,
                     color:
                       video.id === currentVideoId
                         ? '#6366f1'
                         : '#1e293b',
                   }}
                 >
                   {video.title}
                 </Typography>
                 <Stack direction="row" spacing={1}>
                   <Chip
                     label={formatDuration(video.duration)}
                     size="small"
                     variant="outlined"
                     sx={{ fontSize: '10px' }}
                   />
                   {(video.questions && video.questions.length > 0) && (
                     <Badge
                       badgeContent="Q"
                       color="secondary"
                       sx={{
                         '& .MuiBadge-badge': {
                           fontSize: '8px',
                           height: 14,
                           minWidth: 14,
                         },
                       }}
                     >
                       <QuizIcon sx={{ fontSize: 16 }} />
                     </Badge>
                   )}
                 </Stack>
               </Box>
             </Stack>
           </CardContent>
         </Card>
       ))}
     </Stack>
  )
};

interface UserStatsSummaryProps {
  meritos: number;
  ondas: number;
}

const UserStatsSummary: React.FC<UserStatsSummaryProps> = ({ meritos, ondas }) => (
  <Paper elevation={0} sx={{ p: 2, borderRadius: 3 }}>
    <Typography variant="h6" fontWeight="bold" mb={1}>Tus Estadísticas</Typography>
    <Stack direction="row" justifyContent="space-around">
      <Box textAlign="center">
        <Typography variant="h5" fontWeight="bold">{meritos}</Typography>
        <Typography variant="caption">Méritos</Typography>
      </Box>
      <Box textAlign="center">
        <Typography variant="h5" fontWeight="bold">{ondas}</Typography>
        <Typography variant="caption">Öndas</Typography>
      </Box>
    </Stack>
  </Paper>
);

// =================================================================
// Componente Principal del Reproductor de Video
// =================================================================

const UPlayVideoPlayer: React.FC = () => {
  const forceYouTube = false; // import.meta.env.VITE_FORCE_YOUTUBE_VIDEOS === 'true';

  const { videoId } = useParams<{ videoId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [searchParams] = useSearchParams();

  // 🔥 Usar datos reales del backend
  const {
    data: backendVideos,
    isLoading: isBackendLoading,
    isError: isBackendError
  } = useVideos();

  // State para el video actual
  const [currentVideo, setCurrentVideo] = useState<VideoItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 🎯 Efecto para cargar el video desde backend o state de navegación
  useEffect(() => {
    console.log('--- 🎬 UPLAY VIDEO PLAYER DEBUG START ---');
    console.log('1. videoId desde useParams:', videoId);
    console.log('2. location.state:', location.state);
    console.log('3. backendVideos (primer video):', backendVideos?.[0]);
    console.log('4. backendVideos length:', backendVideos?.length);
    console.log('5. isBackendLoading:', isBackendLoading);
    console.log('6. isBackendError:', isBackendError);
    console.log('7. VITE_FORCE_YOUTUBE_VIDEOS:', import.meta.env.VITE_FORCE_YOUTUBE_VIDEOS);

    const loadVideoData = () => {
      console.log('🔥 Loading video data for videoId:', videoId);
      console.log('🔥 Location state:', location.state);
      console.log('🔥 Backend videos:', backendVideos);

      // PRIORIDAD 1: Forzar la búsqueda en el backend como prioridad si el videoId existe
      if (videoId && backendVideos && backendVideos.length > 0) {
        console.log('✅ Tomando el camino: Búsqueda PRIORITARIA en backendVideos');
        console.log('🔍 Buscando videoId:', videoId, 'en', backendVideos.length, 'videos del backend');

        const foundVideo = backendVideos.find((video: any) => {
          const matches = video.externalId === videoId ||
                         video.id?.toString() === videoId ||
                         video.id === parseInt(videoId, 10);

          console.log(`🔍 Checking video ${video.id} (externalId: ${video.externalId}): ${matches ? '✅ MATCH' : '❌ no match'}`);
          console.log('  - video.url:', video.url);
          console.log('  - video.platform:', video.platform);
          console.log('  - video.thumbnailUrl:', video.thumbnailUrl);
          return matches;
        });

        if (foundVideo) {
          console.log('✅ [FORZADO] Video encontrado en backendVideos. Usando datos reales:', foundVideo);

          // 🎯 CORRECCIÓN CRÍTICA: Procesar correctamente datos del backend
          const videoExternalId = foundVideo?.externalId;

          // Parse categories if it's a JSON string
          let categories = [];
          try {
            categories = foundVideo.categories ? JSON.parse(foundVideo.categories) : ['General'];
          } catch (e) {
            categories = [foundVideo.category || 'General'];
          }

          // Asegurar que las propiedades existen con fallbacks
          const processedVideo: VideoItem = {
            id: foundVideo.id?.toString() || videoId,
            title: foundVideo.title || 'Video sin título',
            description: foundVideo.description || 'Descripción no disponible',
            url: convertToVideoPlayerUrl(foundVideo.url),
            duration: foundVideo.duration || 0,
            questions: Array.isArray(foundVideo.questions) ? foundVideo.questions : [],
            thumbnailUrl: getVideoThumbnail(foundVideo),
            category: categories[0] || 'General',
            difficulty: foundVideo.difficulty || 'Intermedio',
            rewards: {
              meritos: 100,
              ondas: 50
            },
            tags: Array.isArray(foundVideo.tags)
              ? (typeof foundVideo.tags === 'string' ? JSON.parse(foundVideo.tags) : foundVideo.tags)
              : []
          };

          console.log('🎯 [PRIORITARIO] Processed video data from backend:', processedVideo);
          console.log('🎯 [PRIORITARIO] Final video URL being set:', processedVideo.url);
          setCurrentVideo(processedVideo);
          setIsLoading(false);
          return; // SALIR del useEffect para no caer en el fallback
        } else {
          console.warn('❌ Video no encontrado en backend para videoId:', videoId);
        }
      }

      // PRIORIDAD 2: Intentar usar datos del state de navegación (más eficiente)
      if (location.state?.videoData) {
        console.log('✅ Tomando el camino: location.state.videoData');
        const stateVideo = location.state.videoData;
        console.log('✅ Using video data from navigation state:', stateVideo);

        // 🎯 Usar datos del state que ya vienen procesados desde UPlayInteractiveLibrary
        const processedVideo: VideoItem = {
          id: stateVideo.id?.toString() || videoId,
          title: stateVideo.title || 'Video sin título',
          description: stateVideo.description || 'Descripción no disponible',
          url: stateVideo?.youtubeUrl || stateVideo?.url,
          duration: stateVideo.duration || 0,
          questions: Array.isArray(stateVideo.questions) ? stateVideo.questions : [],
          thumbnailUrl: stateVideo.thumbnailUrl && stateVideo.thumbnailUrl.includes('img.youtube.com')
            ? `${stateVideo.thumbnailUrl}?cb=${Date.now()}`
            : (stateVideo.thumbnailUrl || `https://img.youtube.com/vi/${stateVideo.youtubeId}/hqdefault.jpg?cb=${Date.now()}`),
          category: stateVideo.category || 'General',
          difficulty: stateVideo.difficulty || 'Intermedio',
          rewards: {
            meritos: stateVideo.rewards?.meritos || 100,
            ondas: stateVideo.rewards?.ondas || 50
          },
          tags: Array.isArray(stateVideo.tags) ? stateVideo.tags : []
        };

        console.log('🎯 Processed video data from location.state:', processedVideo);
        setCurrentVideo(processedVideo);
        setIsLoading(false);
        return;
      }

      // PRIORIDAD 3: Fallback: usar datos mock si no se encuentra en backend y no está cargando
      if (!isBackendLoading && !isBackendError) {
        console.log('⚠️ Tomando el camino: Fallback a mock data');
        console.log('🔄 No video found in backend, using fallback mock data for:', videoId);

        // Crear video fallback basado en el videoId
        const fallbackVideo: VideoItem = {
          id: videoId || 'fallback-video',
          title: 'Video de Demostración',
          description: 'Este es un video de demostración mientras se carga el contenido real.',
          url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', // Fallback URL
          duration: 300,
          questions: [],
          thumbnailUrl: '',
          category: 'Demo',
          difficulty: 'Intermedio',
          rewards: {
            meritos: 50,
            ondas: 25
          },
          tags: ['demo', 'fallback']
        };

        console.log('🎯 Using fallback video data:', fallbackVideo);
        setCurrentVideo(fallbackVideo);
        setIsLoading(false);
        return;
      }

      // PRIORIDAD 4: Si está cargando, mantener estado de loading
      if (isBackendLoading) {
        console.log('⏳ Backend still loading, waiting...');
        return;
      }

      // PRIORIDAD 5: Si hay error del backend, mostrar error
      if (isBackendError) {
        console.error('❌ Backend error, cannot load video');
        setError(`Error al cargar el video "${videoId}". Problema de conexión con el backend.`);
        setIsLoading(false);
      }
    };

    loadVideoData();
    console.log('--- 🎬 UPLAY VIDEO PLAYER DEBUG END ---');
  }, [videoId, location.state, backendVideos, isBackendLoading, isBackendError]);

  // Log para debugging
  useEffect(() => {
    console.log('🔥 DEBUG UPlayVideoPlayer:');
    console.log('  - videoId:', videoId);
    console.log('  - isBackendLoading:', isBackendLoading);
    console.log('  - isBackendError:', isBackendError);
    console.log('  - backendVideos length:', backendVideos?.length);
    console.log('  - currentVideo:', currentVideo);
    console.log('  - location.state:', location.state);
  }, [videoId, isBackendLoading, isBackendError, backendVideos, currentVideo, location.state]);

  // State
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Ya no es necesario, se usan los datos del backend directamente
  // const playlistVideos = getPlaylistVideos();
  const userProgress = getUserProgress();

  // Crear un mapa de progreso para la sidebar
  const videoProgressMap = (backendVideos || []).reduce((acc, video) => {
    acc[video.id] = { isCompleted: video.progress === 100 }; // Asumimos 100% es completado
    return acc;
  }, {} as Record<string, { isCompleted: boolean }>);

  // console.log('🎬 UPlayVideoPlayer loaded:', {
  //   videoId,
  //   videoData: videoData?.title,
  //   locationPathname: location.pathname,
  //   allParams: useParams(),
  //   rawVideoId: videoId,
  //   videoExists: !!videoData
  // });

  // Handle video completion
  const handleVideoComplete = () => {
    setShowSuccessMessage(true);
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 5000);
  };

  // Handle video change (playlist navigation)
  const handleVideoChange = (newVideoId: string) => {
    navigate(`/uplay/video/${newVideoId}`, { replace: true });
  };

  // Handle back navigation
  const handleBack = () => {
    const from = location.state?.from;
    if (from) {
      navigate(from);
    } else {
      navigate('/uplay');
    }
  };

  // Format duration helper
  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Get difficulty color
  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'Principiante':
        return '#10b981';
      case 'Intermedio':
        return '#f59e0b';
      case 'Avanzado':
        return '#ef4444';
      default:
        return '#6366f1';
    }
  };

  // Renderizado condicional
  if (isLoading || isBackendLoading) return <LoadingSpinner />;
  if (error || !currentVideo) return <Alert severity="error">Error al cargar el video: {error || 'Video no encontrado'}</Alert>;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#f8fafc',
        p: isMobile ? 0 : 2,
      }}
    >
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Grid container spacing={isMobile ? 2 : 4}>
          {/* Main Content: Video Player */}
          <Grid item xs={12} md={8}>
            <Paper elevation={8} sx={{ borderRadius: 2, overflow: 'hidden', position: 'relative' }}>
              {isLoading && <LoadingSpinner />}
              {error && <Alert severity="error">{error}</Alert>}
              {!isLoading && !error && currentVideo && (
                <InteractiveVideoPlayerOverlay
                  videoUrl={currentVideo.url}
                  videoId={currentVideo.id}
                  questions={currentVideo.questions}
                />
              )}
            </Paper>

            {/* Video Info Card */}
            {!isLoading && !error && currentVideo && (
              <Card sx={{ borderRadius: 3, height: '100%' }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography
                    variant="h5"
                    sx={{ fontWeight: 700, mb: 2, lineHeight: 1.3 }}
                  >
                    {currentVideo?.title || 'Cargando título...'}
                  </Typography>

                  <Typography
                    variant="body1"
                    sx={{
                      color: '#64748b',
                      mb: 3,
                      lineHeight: 1.6,
                    }}
                  >
                    {currentVideo?.description || 'Cargando descripción...'}
                  </Typography>

                  {/* Video metadata */}
                  {currentVideo && (
                    <Stack spacing={2} mb={3}>
                      <Stack direction="row" spacing={1} flexWrap="wrap">
                        <Chip
                          label={`${formatDuration(currentVideo.duration)}`}
                          size="small"
                          icon={<PlayIcon />}
                          sx={{ fontWeight: 600 }}
                        />
                        <Chip
                          label={currentVideo.category}
                          size="small"
                          sx={{
                            backgroundColor: '#e0e7ff',
                            color: '#3730a3',
                            fontWeight: 600,
                          }}
                        />
                        <Chip
                          label={currentVideo.difficulty?.toUpperCase()}
                          size="small"
                          sx={{
                            backgroundColor: getDifficultyColor(
                              currentVideo.difficulty
                            ),
                            color: 'white',
                            fontWeight: 600,
                          }}
                        />
                      </Stack>

                      {/* Estimated rewards */}
                      {currentVideo.estimatedRewards && (
                        <Box>
                          <Typography
                            variant="subtitle2"
                            sx={{ fontWeight: 700, mb: 1 }}
                          >
                            Recompensas Estimadas
                          </Typography>
                          <Stack direction="row" spacing={1}>
                            <Chip
                              icon={<DiamondIcon />}
                              label={`+${currentVideo.estimatedRewards.merits} Mëritos`}
                              size="small"
                              sx={{
                                backgroundColor: '#fef3c7',
                                color: '#92400e',
                                fontWeight: 600,
                              }}
                            />
                            <Chip
                              icon={<BoltIcon />}
                              label={`+${currentVideo.estimatedRewards.ondas} Öndas`}
                              size="small"
                              sx={{
                                backgroundColor: '#dcfce7',
                                color: '#166534',
                                fontWeight: 600,
                              }}
                            />
                          </Stack>
                        </Box>
                      )}

                      {/* Tags */}
                      {currentVideo.tags &&
                        Array.isArray(currentVideo.tags) &&
                        currentVideo.tags.length > 0 && (
                          <Box>
                            <Typography
                              variant="subtitle2"
                              sx={{ fontWeight: 700, mb: 1 }}
                            >
                              Temas
                            </Typography>
                            <Stack
                              direction="row"
                              spacing={1}
                              flexWrap="wrap"
                            >
                              {currentVideo.tags.map((tag) => (
                                <Chip
                                  key={tag}
                                  label={tag}
                                  size="small"
                                  variant="outlined"
                                  sx={{ fontWeight: 600 }}
                                />
                              ))}
                            </Stack>
                          </Box>
                        )}
                    </Stack>
                  )}

                  <Divider sx={{ my: 2 }} />

                  {/* Action buttons */}
                  <Stack direction="row" spacing={1}>
                    <Button
                      variant="outlined"
                      startIcon={<BookmarkIcon />}
                      size="small"
                      sx={{
                        borderColor: '#6366f1',
                        color: '#6366f1',
                        fontWeight: 600,
                        '&:hover': {
                          backgroundColor: 'rgba(99, 102, 241, 0.08)',
                          borderColor: '#4f46e5',
                        },
                      }}
                    >
                      Guardar
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<ShareIcon />}
                      size="small"
                      sx={{
                        borderColor: '#6b7280',
                        color: '#4b5563',
                        fontWeight: 600,
                        '&:hover': {
                          backgroundColor: 'rgba(107, 114, 128, 0.08)',
                          borderColor: '#4b5563',
                        },
                      }}
                    >
                      Compartir
                    </Button>
                    <Button
                      variant="contained"
                      startIcon={<FavoriteIcon />}
                      size="small"
                      sx={{
                        backgroundColor: '#ec4899',
                        fontWeight: 600,
                        '&:hover': {
                          backgroundColor: '#db2777',
                        },
                      }}
                    >
                      Me gusta
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            )}
          </Grid>

          {/* Right Column: Playlist and Stats */}
          <Grid item xs={12} md={4}>
            <Stack spacing={3}>
              {/* Videos de la Serie */}
              <Card sx={{ borderRadius: 3 }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 700, mb: 2 }}
                  >
                    Videos de la Serie
                  </Typography>
                  <PlaylistSidebar
                    videos={backendVideos || []}
                    currentVideoId={currentVideo?.id}
                    onVideoSelect={handleVideoChange}
                  />
                </CardContent>
              </Card>

              {/* User Stats */}
              <Card sx={{ borderRadius: 3 }}>
                <CardContent>
                  <UserStatsSummary
                    meritos={userProgress.totalMerits}
                    ondas={userProgress.totalOndas}
                  />
                </CardContent>
              </Card>
            </Stack>
          </Grid>
        </Grid>

        {/* Floating Action Button for Help/Tour */}
        {!isMobile && (
          <Zoom
            in={true}
            timeout={500}
            style={{
              position: 'fixed',
              bottom: 20,
              right: 20,
            }}
          >
            <Fab
              color="primary"
              onClick={handleBack}
              sx={{
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5a56eb 0%, #7c3aed 100%)',
                },
              }}
            >
              <ArrowBackIcon />
            </Fab>
          </Zoom>
        )}

        {/* Success notification */}
        <Snackbar
          open={showSuccessMessage}
          autoHideDuration={6000}
          onClose={() => setShowSuccessMessage(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={() => setShowSuccessMessage(false)}
            severity="success"
            sx={{ width: '100%', fontWeight: 600, borderRadius: 2 }}
            icon={<TrophyIcon />}
          >
            ¡Felicidades! Has completado el video.
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default UPlayVideoPlayer;
