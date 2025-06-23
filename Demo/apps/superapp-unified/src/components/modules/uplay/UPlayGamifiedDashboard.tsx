import React, { useState, useEffect, useCallback, useMemo, useTransition } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Tabs,
  Tab,
  Fab,
  Badge,
  Drawer,
  IconButton,
  AppBar,
  Toolbar,
  useTheme,
  useMediaQuery,
  Chip,
  Avatar,
  LinearProgress,
  Button,
  Divider,
  CircularProgress,
  Fade,
  Skeleton,
} from '@mui/material';
import {
  PlayArrow,
  Dashboard,
  EmojiEvents,
  Settings,
  Notifications,
  Menu,
  Close,
  VideoLibrary,
  TrendingUp,
  Whatshot,
  Diamond,
  Bolt,
  Star,
  AutoAwesome,
  Celebration,
  Groups,
  PartyMode,
  School,
  LiveTv,
} from '@mui/icons-material';

// Importar componentes mejorados
import { PlayerMetricsDashboard } from './components/PlayerMetricsDashboard';
import DynamicMetricsDashboard from './components/DynamicMetricsDashboard';
import { EnhancedRewardFeedback, useRewardFeedback } from './components/EnhancedRewardFeedback';
import UnifiedUPlayPlayer from './UnifiedUPlayPlayer';

// [NUEVO] Funcionalidades Sociales según recomendaciones del review
import { StudyRoomList } from './components/StudyRoomList';
import { ChatBox } from './components/ChatBox';

// Importar hooks y stores
import { useOptimizedQuestions } from '../../../hooks/interactive-video/useOptimizedQuestions';
import {
  useUPlayStore,
  usePlayerMetrics,
  useUnreadNotifications,
  useCurrentSession,
  useUnlockedAchievements
} from '../../../stores/uplayStore';

// [NUEVO] Integración real de rutas de aprendizaje (playlists) y videos
import { useQuery } from '@tanstack/react-query';
import { videosAPI } from '../../../lib/api-service';
import { useVideos } from '../../../hooks/data/useVideoData';
import { usePlaylists } from '../../../hooks/data/usePlaylistData';

// 🌌 Cosmic Design System
import { RevolutionaryWidget } from '../../../design-system/templates/RevolutionaryWidget';

// ============================================================================
// ADAPTADORES Y HELPERS
// ============================================================================

// Adaptador: convierte video del backend al formato VideoItem esperado por VideoCard
const adaptBackendVideoToVideoItem = (backendVideo: any): VideoItem => {
  // Calcular recompensas basadas en la duración y número de preguntas
  const questionsCount = backendVideo.questions?.length || 0;
  const durationMinutes = Math.ceil((backendVideo.duration || 0) / 60);

  // Fórmulas de recompensas CoomÜnity:
  // - Mëritos: base 20 + 5 por pregunta + bonus por duración
  // - Öndas: base 10 + 3 por pregunta + bonus por duración
  const meritosBase = 20 + (questionsCount * 5) + Math.min(durationMinutes * 2, 50);
  const ondasBase = 10 + (questionsCount * 3) + Math.min(durationMinutes * 1, 30);

  // Determinar dificultad basada en preguntas y duración
  let difficulty: 'easy' | 'medium' | 'hard' = 'easy';
  if (questionsCount >= 5 || durationMinutes > 30) {
    difficulty = 'medium';
  }
  if (questionsCount >= 10 || durationMinutes > 60) {
    difficulty = 'hard';
  }

  // Determinar thumbnail emoji basado en categorías o título
  let thumbnail = '🎬'; // default
  const titleLower = (backendVideo.title || '').toLowerCase();
  const categoriesArray = Array.isArray(backendVideo.categories)
    ? backendVideo.categories
    : JSON.parse(backendVideo.categories || '[]');

  if (titleLower.includes('gamific') || categoriesArray.includes('Gamificación')) {
    thumbnail = '🎮';
  } else if (titleLower.includes('narrat') || titleLower.includes('story')) {
    thumbnail = '📖';
  } else if (titleLower.includes('mecán') || titleLower.includes('recompensa')) {
    thumbnail = '⚙️';
  } else if (titleLower.includes('evalua') || titleLower.includes('assess')) {
    thumbnail = '📊';
  } else if (categoriesArray.includes('Educación')) {
    thumbnail = '🎓';
  } else if (categoriesArray.includes('Tecnología')) {
    thumbnail = '💻';
  }

  return {
    id: backendVideo.id?.toString() || 'unknown',
    title: backendVideo.title || 'Video sin título',
    description: backendVideo.description || 'Sin descripción disponible',
    thumbnail,
    duration: backendVideo.duration || 0,
    difficulty,
    category: categoriesArray[0] || 'General',
    rewards: {
      meritos: meritosBase,
      ondas: ondasBase,
    },
    isCompleted: false, // TODO: integrar con progreso del usuario
    progress: 0, // TODO: integrar con progreso del usuario
    questionsCount,
  };
};

// Función defensiva para validar si un video tiene la estructura correcta
const isValidVideoItem = (video: any): video is VideoItem => {
  return (
    video &&
    typeof video.id !== 'undefined' &&
    typeof video.title === 'string' &&
    typeof video.rewards === 'object' &&
    typeof video.rewards.meritos === 'number' &&
    typeof video.rewards.ondas === 'number'
  );
};

// ============================================================================
// INTERFACES
// ============================================================================

// 🔄 TIPOS PARA TRANSICIONES MEJORADAS
interface TransitionState {
  isTabChanging: boolean;
  isVideoLoading: boolean;
  isContentLoading: boolean;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

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
}

interface CategoryData {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  videos: VideoItem[];
  totalRewards: {
    meritos: number;
    ondas: number;
  };
}

// ============================================================================
// COMPONENTES AUXILIARES
// ============================================================================

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index, ...other }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`uplay-tabpanel-${index}`}
      aria-labelledby={`uplay-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
};

const VideoCard: React.FC<{ video: VideoItem; onPlay: (videoId: string) => void }> = ({
  video,
  onPlay
}) => {
  // Validación defensiva adicional
  if (!isValidVideoItem(video)) {
    console.error('❌ VideoCard recibió un video con estructura inválida:', video);
    return (
      <Card sx={{ height: '100%', opacity: 0.5 }}>
        <CardContent>
          <Typography variant="h6" color="error">
            Video no disponible
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Error en la estructura de datos
          </Typography>
        </CardContent>
      </Card>
    );
  }

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
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(145deg, rgba(34,34,34,0.85), rgba(45,45,45,0.95))',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: 3,
        '&:hover': {
          transform: 'translateY(-6px) scale(1.03)',
          boxShadow: `0 10px 20px rgba(0,0,0,0.3), 0 0 15px ${getDifficultyColor(video.difficulty)}70`,
          '& .play-overlay': {
            opacity: 1,
            transform: 'scale(1)',
          },
        },
      }}
      onClick={() => onPlay(video.id)}
    >
      <Box
        sx={{
          height: 180,
          background: `linear-gradient(135deg, ${getDifficultyColor(video.difficulty)}30, ${getDifficultyColor(video.difficulty)}20)`,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '4rem',
        }}
      >
        <Typography variant="h1" sx={{ fontSize: '4rem', filter: 'drop-shadow(0 0 10px rgba(0,0,0,0.5))' }}>
          {video.thumbnail}
        </Typography>

        <Box
          className="play-overlay"
          sx={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'radial-gradient(circle, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.8) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: 0,
            transform: 'scale(1.2)',
            transition: 'all 0.3s ease-in-out',
          }}
        >
          <Fab
            size="large"
            sx={{
              background: 'linear-gradient(45deg, #ff6b6b, #feca57)',
              color: 'white',
              '&:hover': {
                transform: 'scale(1.1)',
                boxShadow: '0 0 20px #ff6b6b'
              },
            }}
          >
            <PlayArrow sx={{ fontSize: '2.5rem' }} />
          </Fab>
        </Box>

        {video.isCompleted && (
          <Chip
            label="✓ Completado"
            color="success"
            size="small"
            sx={{ position: 'absolute', top: 12, right: 12, fontWeight: 'bold' }}
          />
        )}

        <Chip
          label={getDifficultyLabel(video.difficulty)}
          size="small"
          sx={{
            position: 'absolute',
            top: 12, left: 12,
            bgcolor: getDifficultyColor(video.difficulty),
            color: 'white',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}
        />
      </Box>

      <CardContent sx={{ pb: 1, p: 2 }}>
        <Typography variant="h6" component="h3" gutterBottom noWrap sx={{ fontWeight: 600, color: 'white' }}>
          {video.title}
        </Typography>

        <Typography variant="body2" color="rgba(255,255,255,0.7)" sx={{ mb: 2, minHeight: 40 }}>
          {video.description}
        </Typography>

        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="caption" color="rgba(255,255,255,0.5)">
            {Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')}
            {video.questionsCount && ` • ${video.questionsCount} preguntas`}
          </Typography>
        </Box>

        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Box display="flex" gap={1}>
            <Chip
              icon={<Diamond sx={{ fontSize: '16px !important', color: '#d8a4fe !important' }} />}
              label={`${video.rewards?.meritos || 0} Mëritos`}
              size="small"
              variant="outlined"
              sx={{ color: '#d8a4fe', borderColor: '#d8a4fe' }}
            />
            <Chip
              icon={<Bolt sx={{ fontSize: '16px !important', color: '#feca57 !important' }} />}
              label={`${video.rewards?.ondas || 0} Öndas`}
              size="small"
              variant="outlined"
              sx={{ color: '#feca57', borderColor: '#feca57' }}
            />
          </Box>
        </Box>

        {video.progress > 0 && (
          <Box sx={{ mt: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
              <Typography variant="caption" color="rgba(255,255,255,0.5)">
                Progreso
              </Typography>
              <Typography variant="caption" color="rgba(255,255,255,0.7)">
                {Math.round(video.progress)}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={video.progress}
              sx={{
                height: 6,
                borderRadius: 3,
                bgcolor: 'rgba(255,255,255,0.2)',
                '& .MuiLinearProgress-bar': {
                  borderRadius: 3,
                  background: video.isCompleted ? 'linear-gradient(45deg, #4caf50, #81c784)' : 'linear-gradient(45deg, #ff6b6b, #feca57)',
                },
              }}
            />
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

export const UPlayGamifiedDashboard: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  // Estados locales
  const [tabValue, setTabValue] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  // Zustand store
  const playerMetrics = usePlayerMetrics();
  const unreadNotifications = useUnreadNotifications();
  const currentSession = useCurrentSession();
  const unlockedAchievements = useUnlockedAchievements();
  const { showRewardFeedback, setCurrentVideo } = useUPlayStore();

  // Hook de feedback de recompensas
  const { showReward, hideReward } = useRewardFeedback();

  // Fetch playlists (rutas de aprendizaje)
  const {
    data: playlists = [],
    isLoading: isLoadingPlaylists,
    isError: isErrorPlaylists,
    error: errorPlaylists,
  } = usePlaylists();

  // Fetch videos
  const {
    data: videos = [],
    isLoading: isLoadingVideos,
    isError: isErrorVideos,
    error: errorVideos,
  } = useVideos();

  // NUEVO: Adaptar videos del backend al formato VideoItem
  const adaptedVideos = React.useMemo(() => {
    console.log('🔄 Adaptando videos del backend al formato VideoItem...');
    console.log('🔄 Videos crudos del backend:', videos);

    if (!videos) return [];

    const adapted = videos.map((backendVideo: any) => {
      try {
        const adaptedVideo = adaptBackendVideoToVideoItem(backendVideo);
        console.log(`✅ Video "${backendVideo.title}" adaptado exitosamente:`, {
          original: { id: backendVideo.id, title: backendVideo.title, hasRewards: !!backendVideo.rewards },
          adapted: { id: adaptedVideo.id, title: adaptedVideo.title, rewards: adaptedVideo.rewards }
        });
        return adaptedVideo;
      } catch (error) {
        console.error(`❌ Error adaptando video "${backendVideo.title}":`, error);
        // Retornar video con estructura mínima válida
        return {
          id: backendVideo.id?.toString() || 'error',
          title: backendVideo.title || 'Video con error',
          description: 'Error al procesar este video',
          thumbnail: '⚠️',
          duration: 0,
          difficulty: 'easy' as const,
          category: 'Error',
          rewards: { meritos: 0, ondas: 0 },
          isCompleted: false,
          progress: 0,
          questionsCount: 0,
        };
      }
    });

    console.log('🔄 Videos adaptados finales:', adapted);
    return adapted;
  }, [videos]);

  // NUEVO: Preparar datos para DynamicMetricsDashboard con validaciones defensivas
  const dynamicMetricsData = React.useMemo(() => {
    // Datos de métricas actuales con validaciones para evitar NaN
    const metricsData = {
      meritos: Number(playerMetrics?.meritos) || 340, // fallback para demo
      ondas: Number(playerMetrics?.ondas) || 125, // fallback para demo
      nivel: Number(playerMetrics?.level) || 1,
      precision: Number(playerMetrics?.accuracy) || 87, // porcentaje de precisión
      racha: Number(playerMetrics?.streak) || 5, // días consecutivos
      videosCompletados: Number(playerMetrics?.completedVideos) || 2,
      tiempoTotal: Number(playerMetrics?.totalWatchTime) || 95, // minutos
      preguntasRespondidas: Number(playerMetrics?.questionsAnswered) || 18,
      logrosDesbloqueados: Number(unlockedAchievements?.length) || 4,
      rankingComunidad: Number(playerMetrics?.communityRank) || 42, // posición en la comunidad
    };

    // Historial de progreso (simulado para demo, en producción vendría del backend)
    const progressHistory = [
      { date: '15/06', meritos: 200, ondas: 80, precision: 85 },
      { date: '16/06', meritos: 245, ondas: 95, precision: 89 },
      { date: '17/06', meritos: 280, ondas: 105, precision: 86 },
      { date: '18/06', meritos: 320, ondas: 118, precision: 91 },
      { date: '19/06', meritos: 340, ondas: 125, precision: 87 },
    ];

    // Distribución por categorías basada en videos disponibles
    const categoryProgress = (() => {
      if (!adaptedVideos?.length) {
        // Datos de fallback para demo
        return [
          { name: 'Gamificación', value: 35, color: '#2563eb' },
          { name: 'Narrativa', value: 25, color: '#10b981' },
          { name: 'Evaluación', value: 20, color: '#f59e0b' },
          { name: 'Mecánicas', value: 15, color: '#ef4444' },
          { name: 'Otros', value: 5, color: '#8b5cf6' },
        ];
      }

      // Calcular distribución real basada en videos
      const categoryCount: Record<string, number> = {};
      adaptedVideos.forEach(video => {
        const category = video.category || 'Otros';
        categoryCount[category] = (categoryCount[category] || 0) + 1;
      });

      const total = adaptedVideos.length;
      const categoryColors = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#f97316'];

      return Object.entries(categoryCount).map(([name, count], index) => ({
        name,
        value: Math.round((count / total) * 100),
        color: categoryColors[index % categoryColors.length],
      }));
    })();

    return {
      metrics: metricsData,
      progressHistory,
      categoryProgress,
      isLoading: isLoadingVideos || isLoadingPlaylists,
      showAnimations: true,
    };
  }, [playerMetrics, unlockedAchievements, adaptedVideos, isLoadingVideos, isLoadingPlaylists]);

  // Agrupar videos adaptados por playlistId
  const videosByPlaylist = React.useMemo(() => {
    console.log('🎪 Agrupando videos adaptados por playlist...');
    console.log('🎪 Videos adaptados recibidos para agrupar:', adaptedVideos);
    console.log('🎪 Videos originales para referencia:', videos);

    if (!adaptedVideos || !videos) return {};
    const grouped: Record<string, VideoItem[]> = {};

    // Usar índice para mapear videos adaptados con originales
    videos.forEach((originalVideo: any, index: number) => {
      const adaptedVideo = adaptedVideos[index];
      if (!adaptedVideo) return;

      const pid = originalVideo.playlistId || 'unassigned';
      console.log(`🎪 Video ${index + 1} "${adaptedVideo.title}" → playlist: "${pid}"`);
      if (!grouped[pid]) grouped[pid] = [];
      grouped[pid].push(adaptedVideo);
    });

    console.log('🎪 Resultado del agrupamiento:', grouped);
    console.log('🎪 Playlists con videos:', Object.keys(grouped));
    return grouped;
  }, [adaptedVideos, videos]);

  // 🚀 PERFORMANCE: React 18 startTransition para mejor UX
  const [isPending, startTransition] = useTransition();
  const [transitionState, setTransitionState] = useState<TransitionState>({
    isTabChanging: false,
    isVideoLoading: false,
    isContentLoading: false,
  });

  // Helper para obtener nombre de playlist
  const getPlaylistName = (playlistId: string) => {
    if (playlistId === 'unassigned') return 'Sin ruta asignada';
    const pl = playlists?.find((p: any) => p.id === playlistId);
    return pl?.name || 'Ruta desconocida';
  };

  // 🎯 HANDLERS OPTIMIZADOS CON STARTTRANSITION
  const handleTabChange = useCallback((_: React.SyntheticEvent, newValue: number) => {
    // Mostrar indicador inmediatamente
    setTransitionState(prev => ({ ...prev, isTabChanging: true }));

    startTransition(() => {
      setTabValue(newValue);
      // Resetear indicador después de la transición
      setTimeout(() => {
        setTransitionState(prev => ({ ...prev, isTabChanging: false }));
      }, 300);
    });
  }, []);

  const handleVideoPlay = useCallback((videoId: string) => {
    console.log('🎬 Playing video:', videoId);

    // Mostrar indicador de carga inmediatamente
    setTransitionState(prev => ({ ...prev, isVideoLoading: true }));

    startTransition(() => {
      // Buscar el video completo en los datos del backend
      const videoData = videos?.find((v: any) => v.id.toString() === videoId);
      console.log('🎬 Found video data:', videoData);

      if (videoData) {
        // Navegar al reproductor con los datos del video
        navigate(`/uplay/video/${videoId}`, {
          state: {
            from: '/uplay',
            videoData: videoData
          }
        });
      } else {
        console.error('❌ Video not found:', videoId);
        // Navegar de todas formas, el UPlayVideoPlayer manejará la carga
        navigate(`/uplay/video/${videoId}`, {
          state: {
            from: '/uplay'
          }
        });
      }

      setSelectedVideo(videoId);
      setCurrentVideo(videoId);

      // Resetear indicador después de un tiempo breve
      setTimeout(() => {
        setTransitionState(prev => ({ ...prev, isVideoLoading: false }));
      }, 500);
    });
  }, [setCurrentVideo, videos, navigate]);

  const handleCloseSidebar = useCallback(() => {
    startTransition(() => {
      setSidebarOpen(false);
    });
  }, []);

  // 🎯 OPTIMIZADOR DE CONTENT LOADING
  const handleContentLoad = useCallback((loadingFn: () => void) => {
    setTransitionState(prev => ({ ...prev, isContentLoading: true }));

    startTransition(() => {
      loadingFn();
      // Simular tiempo de carga para UX suave
      setTimeout(() => {
        setTransitionState(prev => ({ ...prev, isContentLoading: false }));
      }, 200);
    });
  }, []);

  // Loading state con transiciones mejoradas
  if (isLoadingPlaylists || isLoadingVideos) {
    return (
      <Box sx={{ p: 4 }}>
        <Fade in={true} timeout={800}>
          <Box>
            <LinearProgress
              sx={{
                mb: 2,
                '& .MuiLinearProgress-bar': {
                  background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
                }
              }}
            />
            <Typography sx={{ mt: 2, textAlign: 'center' }}>
              Cargando rutas de aprendizaje...
            </Typography>
            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
              {[1, 2, 3].map((i) => (
                <Skeleton
                  key={i}
                  variant="rectangular"
                  width="100%"
                  height={120}
                  sx={{ borderRadius: 2 }}
                />
              ))}
            </Box>
          </Box>
        </Fade>
      </Box>
    );
  }

  // Error state
  if (isErrorPlaylists || isErrorVideos) {
    return <Box sx={{ p: 4 }}><Typography color="error">Error al cargar rutas o videos: {errorPlaylists?.message || errorVideos?.message}</Typography></Box>;
  }

  // Debug logs (temporal)
  console.log('🔍 DEBUG Dashboard State:', {
    playlists: playlists,
    playlistsLength: playlists?.length,
    videos: videos,
    videosLength: videos?.length,
    adaptedVideos: adaptedVideos,
    adaptedVideosLength: adaptedVideos?.length,
    videosByPlaylist: videosByPlaylist,
    videosByPlaylistKeys: Object.keys(videosByPlaylist),
    isLoadingPlaylists,
    isLoadingVideos,
    isErrorPlaylists,
    isErrorVideos
  });

  // Empty state con animación
  if (!playlists?.length && !Object.keys(videosByPlaylist).length) {
    return (
      <Fade in={true} timeout={600}>
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Typography>
            No hay rutas de aprendizaje ni videos disponibles.
            (playlists: {playlists?.length}, videos: {Object.keys(videosByPlaylist).length})
          </Typography>
        </Box>
      </Fade>
    );
  }

  // ========================================================================
  // RENDER HELPERS CON TRANSICIONES MEJORADAS
  // ========================================================================

  const renderHeader = () => (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: 'background.paper',
        borderBottom: 1,
        borderColor: 'divider',
        transition: 'all 0.3s ease',
      }}
    >
      <Toolbar>
        {isMobile && (
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => handleContentLoad(() => setSidebarOpen(true))}
            sx={{ mr: 2 }}
          >
            <Menu />
          </IconButton>
        )}

        <Box display="flex" alignItems="center" flexGrow={1}>
          <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
            <PlayArrow />
          </Avatar>
          <Box>
            <Typography variant="h6" color="text.primary" fontWeight="bold">
              ÜPlay - GPL Gamified Play List
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Aprendizaje interactivo gamificado
              {isPending && (
                <Chip
                  label="Cargando..."
                  size="small"
                  sx={{ ml: 1, height: 16, fontSize: '0.6rem' }}
                />
              )}
            </Typography>
          </Box>
        </Box>

        {/* Métricas rápidas en el header con animaciones */}
        <Fade in={!transitionState.isTabChanging} timeout={400}>
          <Box display="flex" gap={1} alignItems="center">
            <Chip
              icon={<Diamond />}
              label={playerMetrics.meritos.toLocaleString()}
              size="small"
              sx={{
                color: '#9c27b0',
                fontWeight: 'bold',
                transition: 'all 0.3s ease',
                '&:hover': { transform: 'scale(1.05)' }
              }}
            />
            <Chip
              icon={<Bolt />}
              label={playerMetrics.ondas.toLocaleString()}
              size="small"
              sx={{
                color: '#ff9800',
                fontWeight: 'bold',
                transition: 'all 0.3s ease',
                '&:hover': { transform: 'scale(1.05)' }
              }}
            />
            <Chip
              icon={<Star />}
              label={`Nivel ${playerMetrics.level}`}
              size="small"
              sx={{
                color: '#2196f3',
                fontWeight: 'bold',
                transition: 'all 0.3s ease',
                '&:hover': { transform: 'scale(1.05)' }
              }}
            />

            <IconButton color="inherit">
              <Badge badgeContent={unreadNotifications.length} color="error">
                <Notifications />
              </Badge>
            </IconButton>
          </Box>
        </Fade>
      </Toolbar>

      {/* Indicador de transición global */}
      {(isPending || transitionState.isTabChanging || transitionState.isContentLoading) && (
        <LinearProgress
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 2,
            '& .MuiLinearProgress-bar': {
              background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
            }
          }}
        />
      )}
    </AppBar>
  );

  const renderTabs = () => (
    <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        variant={isMobile ? "scrollable" : "standard"}
        scrollButtons="auto"
        sx={{
          '& .MuiTab-root': {
            minHeight: 64,
            textTransform: 'none',
            fontSize: '1rem',
            fontWeight: 500,
            transition: 'all 0.3s ease',
            opacity: transitionState.isTabChanging ? 0.7 : 1,
          },
          '& .Mui-selected': {
            transform: transitionState.isTabChanging ? 'scale(0.95)' : 'scale(1)',
          }
        }}
      >
        <Tab
          icon={<Dashboard />}
          label="Dashboard"
          iconPosition="start"
        />
        <Tab
          icon={<VideoLibrary />}
          label="Biblioteca"
          iconPosition="start"
        />
        <Tab
          icon={<TrendingUp />}
          label="Métricas"
          iconPosition="start"
        />
        <Tab
          icon={<EmojiEvents />}
          label="Logros"
          iconPosition="start"
        />
        <Tab
          icon={<Groups />}
          label="Salas de Estudio"
          iconPosition="start"
        />
        <Tab
          icon={<LiveTv />}
          label="Video Parties"
          iconPosition="start"
        />
      </Tabs>
    </Box>
  );

  const renderVideoLibrary = () => (
    <Container maxWidth="xl">
      {/* Render video library content here */}
    </Container>
  );

  const renderAchievements = () => (
    <Container maxWidth="lg">
      <Grid container spacing={3}>
        {unlockedAchievements.map((achievement) => (
          <Grid item xs={12} sm={6} md={4} key={achievement.id}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                  <Typography variant="h4">{achievement.icon}</Typography>
                  <Box>
                    <Typography variant="h6" fontWeight="bold">
                      {achievement.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {achievement.description}
                    </Typography>
                  </Box>
                </Box>
                <Divider sx={{ my: 1 }} />
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="caption" color="text.secondary">
                    Desbloqueado: {achievement.unlockedAt?.toLocaleDateString()}
                  </Typography>
                  <Box display="flex" gap={1}>
                    <Chip
                      icon={<Diamond />}
                      label={achievement.reward.meritos}
                      size="small"
                      sx={{ color: '#9c27b0' }}
                    />
                    <Chip
                      icon={<Bolt />}
                      label={achievement.reward.ondas}
                      size="small"
                      sx={{ color: '#ff9800' }}
                    />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );

  const renderSidebar = () => (
    <Drawer
      anchor="left"
      open={sidebarOpen}
      onClose={handleCloseSidebar}
      sx={{
        '& .MuiDrawer-paper': {
          width: 280,
          bgcolor: 'background.default',
        },
      }}
    >
      <Box p={2}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" fontWeight="bold">
            ÜPlay Menu
          </Typography>
          <IconButton onClick={handleCloseSidebar}>
            <Close />
          </IconButton>
        </Box>

        {/* Métricas del jugador en sidebar */}
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="subtitle2" gutterBottom>
              Tu Progreso
            </Typography>
            <Box display="flex" flexDirection="column" gap={1}>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="body2">Mëritos:</Typography>
                <Typography variant="body2" fontWeight="bold" color="primary">
                  {playerMetrics.meritos.toLocaleString()}
                </Typography>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="body2">Öndas:</Typography>
                <Typography variant="body2" fontWeight="bold" color="secondary">
                  {playerMetrics.ondas.toLocaleString()}
                </Typography>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="body2">Nivel:</Typography>
                <Typography variant="body2" fontWeight="bold">
                  {playerMetrics.level}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Drawer>
  );

  // ========================================================================
  // RENDER PRINCIPAL
  // ========================================================================

  return (
    <RevolutionaryWidget
      title="🔥 ÜPlay: Enciende tu Conocimiento"
      subtitle="Sumérgete en Rutas de Aprendizaje gamificadas y transforma tu potencial en acción."
      element="fuego"
      cosmicEffects={{
        enableGlow: true,
        enableParticles: true,
        particleTheme: 'flame'
      }}
      cosmicIntensity="intense"
    >
      <Box sx={{ minHeight: '100vh', bgcolor: 'transparent' }}>
      {renderHeader()}
      {renderTabs()}
      {renderSidebar()}

      <TabPanel value={tabValue} index={1}>
        {playlists?.map((playlist: any) => (
          <Box key={playlist.id} sx={{ mb: 6 }}>
              <Typography
                variant="h4"
                sx={{
                  mb: 2,
                  fontWeight: 'bold',
                  background: 'linear-gradient(90deg, #FF8C00, #FF4500)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  borderBottom: '2px solid #FF4500',
                  pb: 1,
                  display: 'inline-block'
                }}
              >
              {playlist.name}
            </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: '80ch' }}>
              {playlist.description}
            </Typography>
              <Grid container spacing={3}>
              {(videosByPlaylist[playlist.id] || []).map((video: any) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={video.id}>
                  <VideoCard video={video} onPlay={handleVideoPlay} />
                </Grid>
              ))}
              {!(videosByPlaylist[playlist.id]?.length) && (
                  <Grid item xs={12}>
                    <Card sx={{ p: 3, textAlign: 'center', bgcolor: 'rgba(0,0,0,0.2)' }}>
                      <Typography color="text.secondary">No hay videos en esta ruta de aprendizaje todavía.</Typography>
                    </Card>
                  </Grid>
              )}
            </Grid>
          </Box>
        ))}
        {/* Sección para videos sin playlist */}
        {videosByPlaylist['unassigned'] && (
          <Box sx={{ mb: 6 }}>
            <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
                Otros Videos
            </Typography>
              <Grid container spacing={3}>
              {videosByPlaylist['unassigned'].map((video: any) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={video.id}>
                  <VideoCard video={video} onPlay={handleVideoPlay} />
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </TabPanel>

      <TabPanel value={tabValue} index={0}>
        {dynamicMetricsData?.metrics ? (
          <DynamicMetricsDashboard
            metrics={dynamicMetricsData.metrics}
            progressHistory={dynamicMetricsData.progressHistory || []}
            categoryProgress={dynamicMetricsData.categoryProgress || []}
            isLoading={dynamicMetricsData.isLoading || false}
            showAnimations={dynamicMetricsData.showAnimations || true}
          />
        ) : (
          <Container maxWidth="xl" sx={{ py: 4 }}>
            <Card sx={{ textAlign: 'center', p: 4 }}>
              <CircularProgress size={60} />
              <Typography variant="h6" sx={{ mt: 2 }}>
                Cargando Dashboard Dinámico...
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Preparando las métricas de tu progreso en ÜPlay
              </Typography>
            </Card>
          </Container>
        )}

        {/* [NUEVO] FASE 3: Sistema de Misiones Avanzado según recomendaciones del review */}
        <Container maxWidth="xl" sx={{ mt: 4 }}>
          <Card sx={{ mb: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
            <CardContent>
              <Typography variant="h5" fontWeight="bold" mb={2}>
                🎯 Misiones Colaborativas Activas
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                Conecta con otros jugadores para completar desafíos únicos y ganar recompensas exclusivas
              </Typography>
            </CardContent>
          </Card>

          <Grid container spacing={3}>
            {/* Misión Individual */}
            <Grid item xs={12} md={6} lg={4}>
              <Card sx={{ height: '100%', border: '2px solid', borderColor: 'primary.main' }}>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Star sx={{ color: 'primary.main', mr: 1 }} />
                    <Typography variant="h6" fontWeight="bold">
                      Explorador Curioso
                    </Typography>
                    <Chip label="Individual" size="small" sx={{ ml: 'auto' }} />
                  </Box>
                  <Typography variant="body2" color="text.secondary" mb={3}>
                    Completa videos de 3 categorías diferentes en un solo día
                  </Typography>
                  <Box mb={2}>
                    <Box display="flex" justifyContent="space-between" mb={1}>
                      <Typography variant="caption">Progreso</Typography>
                      <Typography variant="caption">2/3 categorías</Typography>
                    </Box>
                    <LinearProgress variant="determinate" value={67} sx={{ height: 6, borderRadius: 3 }} />
                  </Box>
                  <Box display="flex" gap={1}>
                    <Chip icon={<Diamond />} label="+50 Mëritos" size="small" color="primary" />
                    <Chip icon={<Bolt />} label="+25 Öndas" size="small" color="secondary" />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Misión Colaborativa */}
            <Grid item xs={12} md={6} lg={4}>
              <Card sx={{ height: '100%', border: '2px solid', borderColor: 'success.main' }}>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Groups sx={{ color: 'success.main', mr: 1 }} />
                    <Typography variant="h6" fontWeight="bold">
                      Círculo de Ayni
                    </Typography>
                    <Chip label="Colaborativa" size="small" color="success" sx={{ ml: 'auto' }} />
                  </Box>
                  <Typography variant="body2" color="text.secondary" mb={3}>
                    Formar un grupo de estudio de 5 personas y completar una sesión juntos
                  </Typography>
                  <Box mb={2}>
                    <Box display="flex" justifyContent="space-between" mb={1}>
                      <Typography variant="caption">Participantes</Typography>
                      <Typography variant="caption">3/5 unidos</Typography>
                    </Box>
                    <LinearProgress variant="determinate" value={60} sx={{ height: 6, borderRadius: 3 }} />
                  </Box>
                  <Box display="flex" gap={1} mb={2}>
                    <Chip icon={<Diamond />} label="+200 Mëritos" size="small" color="primary" />
                    <Chip icon={<Bolt />} label="+100 Öndas" size="small" color="secondary" />
                  </Box>
                  <Button variant="outlined" color="success" size="small" fullWidth>
                    Invitar Amigos
                  </Button>
                </CardContent>
              </Card>
            </Grid>

            {/* Misión Temporal */}
            <Grid item xs={12} md={6} lg={4}>
              <Card sx={{ height: '100%', border: '2px solid', borderColor: 'warning.main' }}>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Whatshot sx={{ color: 'warning.main', mr: 1 }} />
                    <Typography variant="h6" fontWeight="bold">
                      Evento Solsticio
                    </Typography>
                    <Chip label="Temporal" size="small" color="warning" sx={{ ml: 'auto' }} />
                  </Box>
                  <Typography variant="body2" color="text.secondary" mb={3}>
                    Evento especial: Participar en 3 Video Parties durante el fin de semana
                  </Typography>
                  <Box mb={2}>
                    <Box display="flex" justifyContent="space-between" mb={1}>
                      <Typography variant="caption">Tiempo restante</Typography>
                      <Typography variant="caption" color="warning.main" fontWeight="bold">
                        2 días 14h
                      </Typography>
                    </Box>
                    <LinearProgress variant="determinate" value={33} sx={{ height: 6, borderRadius: 3 }} />
                  </Box>
                  <Box display="flex" gap={1} mb={2}>
                    <Chip icon={<Diamond />} label="+500 Mëritos" size="small" color="primary" />
                    <Chip icon={<AutoAwesome />} label="Logro Exclusivo" size="small" color="warning" />
                  </Box>
                  <Button variant="outlined" color="warning" size="small" fullWidth disabled>
                    Requiere Video Parties
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        {dynamicMetricsData?.metrics ? (
          <DynamicMetricsDashboard
            metrics={dynamicMetricsData.metrics}
            progressHistory={dynamicMetricsData.progressHistory || []}
            categoryProgress={dynamicMetricsData.categoryProgress || []}
            isLoading={dynamicMetricsData.isLoading || false}
            showAnimations={dynamicMetricsData.showAnimations || true}
          />
        ) : (
          <Container maxWidth="xl" sx={{ py: 4 }}>
            <Card sx={{ textAlign: 'center', p: 4 }}>
              <CircularProgress size={60} />
              <Typography variant="h6" sx={{ mt: 2 }}>
                Cargando Métricas Avanzadas...
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Analizando tu rendimiento de aprendizaje
              </Typography>
            </Card>
          </Container>
        )}
      </TabPanel>

      <TabPanel value={tabValue} index={3}>
        {renderAchievements()}
      </TabPanel>

      {/* [NUEVO] FASE 2: Funcionalidades Sociales según recomendaciones del review */}
      <TabPanel value={tabValue} index={4}>
        <Container maxWidth="xl">
          <StudyRoomList
            onJoinRoom={async (roomId) => {
              console.log('Joining study room:', roomId);
              // TODO: Implementar lógica de unirse a sala
            }}
            onCreateRoom={async (roomData) => {
              console.log('Creating study room:', roomData);
              // TODO: Implementar lógica de crear sala
            }}
            currentVideoId={selectedVideo}
          />
        </Container>
      </TabPanel>

      <TabPanel value={tabValue} index={5}>
        <Container maxWidth="xl">
          <Box textAlign="center" py={8}>
            <LiveTv sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h4" fontWeight="bold" mb={2}>
              Video Parties 🎉
            </Typography>
            <Typography variant="h6" color="text.secondary" mb={3}>
              Próximamente: Sesiones sincronizadas con activación temporal
            </Typography>
            <Typography variant="body1" color="text.secondary" mb={4} maxWidth="600px" mx="auto">
              Únete a eventos especiales donde videos se activan solo cuando hay suficientes participantes.
              Experiencia colaborativa única con recompensas exclusivas y efectos de celebración sincronizados.
            </Typography>

            {/* Preview de funcionalidades que vendrán */}
            <Grid container spacing={3} maxWidth="800px" mx="auto">
                             <Grid item xs={12} md={4}>
                 <Card sx={{ textAlign: 'center', p: 3 }}>
                   <PartyMode sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
                   <Typography variant="h6" mb={1}>Activación por Usuarios</Typography>
                   <Typography variant="body2" color="text.secondary">
                     Videos especiales que se activan cuando 10+ usuarios se conectan simultáneamente
                   </Typography>
                 </Card>
               </Grid>
              <Grid item xs={12} md={4}>
                <Card sx={{ textAlign: 'center', p: 3 }}>
                  <Celebration sx={{ fontSize: 40, color: 'secondary.main', mb: 2 }} />
                  <Typography variant="h6" mb={1}>Recompensas Exclusivas</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Mëritos y Öndas especiales solo disponibles en eventos colaborativos
                  </Typography>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card sx={{ textAlign: 'center', p: 3 }}>
                  <AutoAwesome sx={{ fontSize: 40, color: 'warning.main', mb: 2 }} />
                  <Typography variant="h6" mb={1}>Efectos Sincronizados</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Animaciones y celebraciones que ocurren al mismo tiempo para todos
                  </Typography>
                </Card>
              </Grid>
            </Grid>

            <Button
              variant="contained"
              size="large"
              sx={{
                mt: 4,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                px: 4,
                py: 1.5,
              }}
              disabled
            >
              Activar Notificaciones de Video Parties
            </Button>
          </Box>
        </Container>
      </TabPanel>

      {/* Sistema de feedback de recompensas */}
      {showRewardFeedback && (
        <EnhancedRewardFeedback
          reward={{
            meritos: 100,
            ondas: 50,
            experience: 25,
          }}
          isVisible={showRewardFeedback}
          onClose={hideReward}
          variant="celebration"
        />
      )}
    </Box>
  </RevolutionaryWidget>
  );

export default UPlayGamifiedDashboard;
