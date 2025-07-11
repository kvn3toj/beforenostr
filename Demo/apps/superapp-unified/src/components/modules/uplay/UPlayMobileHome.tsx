import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  AppBar,
  Toolbar,
  IconButton,
  Avatar,
  Chip,
  Stack,
  Paper,
  CircularProgress,
  Skeleton,
  Button,
  useTheme,
  useMediaQuery,
  Badge,
  Fab,
  Zoom,
  Collapse,
  LinearProgress,
  Tooltip,
  Divider,
  Alert,
  CardMedia,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemButton,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  Message as MessageIcon,
  PlayArrow as PlayIcon,
  Person as PersonIcon,
  Quiz as QuizIcon,
  EmojiEvents as TrophyIcon,
  Star as StarIcon,
  Bolt as BoltIcon,
  Diamond as DiamondIcon,
  LocalFireDepartment as FireIcon,
  TrendingUp as TrendingUpIcon,
  School as SchoolIcon,
  Speed as SpeedIcon,
  Bookmark as BookmarkIcon,
  Share as ShareIcon,
  Favorite as FavoriteIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Psychology as PsychologyIcon,
  Lightbulb as LightbulbIcon,
  VideoLibrary as VideoLibraryIcon,
  OndemandVideo as OndemandVideoIcon,
  PlayCircle as PlayCircleIcon,
  AccessTime as AccessTimeIcon,
  Category as CategoryIcon,
  Groups as GroupsIcon,
} from '@mui/icons-material';
import { getVideoThumbnail } from '../../../utils/videoUtils';

// Import enhanced mock data hook
// import {
//   useUPlayMockData,
//   MockVideo,
//   MockPlaylist,
// } from '../../../hooks/useUPlayMockData';

// Types for mock data compatibility
interface MockVideo {
  id: number;
  title: string;
  thumbnail: string;
  duration: number;
  progress?: number;
  category?: string;
  description?: string;
}

interface MockPlaylist {
  id: number;
  name: string;
  description: string;
  videos: MockVideo[];
}

// 🔥 Hook para datos reales del backend
import { useVideos } from '../../../hooks/useRealBackendData';
import { useGamificationMetrics } from '../../../hooks/useUserProfile';

// 🎯 IMPORT DEL VIDEO DURATION FIXER para corregir duraciones 0:00
import { useVideosWithCorrectDurations, formatDuration as fixedFormatDuration } from '../../../utils/videoDurationFixer';

// 🌌 IMPORT DEL NUEVO DESIGN SYSTEM CÓSMICO
import { CosmicCard } from '../../../design-system/components/cosmic/CosmicCard';

// 🏫 IMPORT DEL PANEL DE FUNCIONALIDADES SOCIALES
import { SocialFeaturesPanel } from './components/SocialFeaturesPanel';

// Enhanced types for mobile experience
interface EnhancedMockUserStats {
  name: string;
  activePlayers: number;
  burnedPlayers: number;
  level: number;
  merits: number;
  ondas: number;
  experience: number;
  experienceToNext: number;
  weeklyGoal: number;
  currentStreak: number;
  completedVideos: number;
  totalWatchTime: number;
  achievements: number;
  ranking: number;
}

interface VideoProgress {
  videoId: number;
  progress: number;
  completed: boolean;
  questionsAnswered: number;
  totalQuestions: number;
  meritsEarned: number;
  lastWatched: Date;
}

// Tipo para videos del backend
interface BackendVideo {
  id: number;
  title: string;
  description: string;
  url: string;
  platform: string;
  externalId: string;
  duration: number;
  categories: string;
  tags: string;
  thumbnailUrl: string;
  playlist?: {
    name: string;
    description: string;
  };
}

// Enhanced placeholder component with better design
const VideoThumbnail: React.FC<{
  width: number | string;
  height: number | string;
  className?: string;
  isPlaying?: boolean;
  progress?: number;
  thumbnailUrl?: string;
}> = React.memo(({ width, height, className, isPlaying = false, progress = 0, thumbnailUrl }) => (
  <Box
    className={className}
    sx={{
      width,
      height,
      backgroundColor: '#E0E0E0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 2,
      position: 'relative',
      overflow: 'hidden',
      background: thumbnailUrl
        ? `url(${thumbnailUrl})`
        : 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }}
  >
    {/* Fallback geometric shapes if no thumbnail */}
    {!thumbnailUrl && (
      <>
        <Box
          sx={{
            position: 'absolute',
            top: '25%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 0,
            height: 0,
            borderLeft: '16px solid transparent',
            borderRight: '16px solid transparent',
            borderBottom: '28px solid #94a3b8',
            opacity: 0.7,
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: '25%',
            left: '30%',
            width: '12px',
            height: '16px',
            backgroundColor: '#64748b',
            borderRadius: 1,
            opacity: 0.6,
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: '25%',
            right: '30%',
            width: '18px',
            height: '18px',
            backgroundColor: '#475569',
            borderRadius: '50%',
            opacity: 0.6,
          }}
        />
      </>
    )}

    {/* Play overlay */}
    {isPlaying && (
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'rgba(99, 102, 241, 0.9)',
          borderRadius: '50%',
          width: 32,
          height: 32,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <PlayIcon sx={{ color: 'white', fontSize: 18 }} />
      </Box>
    )}

    {/* Progress bar */}
    {progress > 0 && (
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 3,
          backgroundColor: 'rgba(0,0,0,0.1)',
        }}
      >
        <Box
          sx={{
            height: '100%',
            width: `${progress}%`,
            backgroundColor: '#6366f1',
            transition: 'width 0.3s ease',
          }}
        />
      </Box>
    )}

    {/* Dark overlay for better text readability */}
    <Box
      sx={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '100%',
        background: 'linear-gradient(transparent 60%, rgba(0,0,0,0.7) 100%)',
        pointerEvents: 'none',
      }}
    />
  </Box>
));

// 🌌 COMPONENTE REFACTORIZADO CON DESIGN SYSTEM CÓSMICO
// Componente para mostrar un video del backend usando CosmicCard
const BackendVideoCard: React.FC<{
  video: BackendVideo;
  onClick?: () => void;
  showFullInfo?: boolean;
}> = React.memo(({ video, onClick, showFullInfo = false }) => {
  // Parsear categorías y tags
  const categories = React.useMemo(() => {
    try {
      return JSON.parse(video.categories || '[]');
    } catch {
      return [];
    }
  }, [video.categories]);

  const tags = React.useMemo(() => {
    try {
      return JSON.parse(video.tags || '[]');
    } catch {
      return [];
    }
  }, [video.tags]);

  // Formatear duración
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleClick = React.useCallback(() => {
    if (onClick) {
      onClick();
    }
  }, [onClick]);

  if (showFullInfo) {
    // 🎬 Vista completa para lista usando CosmicCard
    return (
      <CosmicCard
        variant="elevated"
        element="agua"
        enableAnimations={true}
        enableGlow={true}
        enableParticles={true}
        enableOrbitalEffects={true}
        cosmicIntensity="intense"
        onClick={handleClick}
        sx={{
          mb: 2,
          cursor: onClick ? 'pointer' : 'default',
          width: '100%'
        }}
        className="video-item"
      >
        <Box
          data-testid={`video-item-${video.id}`}
          sx={{ display: 'flex', gap: 2 }}
        >
          <Box sx={{ position: 'relative' }}>
            <VideoThumbnail
              width={120}
              height={90}
              thumbnailUrl={video.thumbnailUrl}
            />

            {/* Platform indicator */}
            <Chip
              label={video.platform.toUpperCase()}
              size="small"
              sx={{
                position: 'absolute',
                bottom: 4,
                right: 4,
                background: 'linear-gradient(135deg, #a0aec0, #bfae60)',
                color: 'white',
                fontSize: '10px',
                height: 16,
                minWidth: 48,
                minHeight: 36,
                padding: 2,
                borderRadius: 2
              }}
            />
          </Box>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                marginBottom: 1,
                fontSize: '16px',
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

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                marginBottom: 1,
                fontSize: '14px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
              }}
            >
              {video.description}
            </Typography>

            <Stack direction="row" spacing={1} alignItems="center" sx={{ marginBottom: 1 }}>
              <Chip
                icon={<AccessTimeIcon />}
                label={formatDuration(video.duration)}
                size="small"
                variant="outlined"
                sx={{ fontSize: '11px', height: 20 }}
              />

              {categories.length > 0 && (
                <Chip
                  icon={<CategoryIcon />}
                  label={categories[0]}
                  size="small"
                  sx={{
                    fontSize: '11px',
                    height: 20,
                    backgroundColor: '#e3f2fd',
                    color: '#1976d2',
                  }}
                />
              )}
            </Stack>

            {video.playlist && (
              <Typography
                variant="caption"
                color="primary"
                sx={{ fontWeight: 600 }}
              >
                📚 {video.playlist.name}
              </Typography>
            )}
          </Box>
        </Box>
      </CosmicCard>
    );
  }

  // 🌌 Vista compacta para carrusel horizontal usando CosmicCard
  return (
    <CosmicCard
      variant="elevated"
      element="agua"
      enableAnimations={true}
      enableGlow={true}
      enableParticles={true}
      cosmicIntensity="intense"
      onClick={handleClick}
      sx={{
        width: 140,
        flexShrink: 0,
        padding: 1
      }}
      className="video-card"
    >
      <Box data-testid={`video-card-${video.id}`}>
      <Box sx={{ position: 'relative' }}>
        <VideoThumbnail
          width={140}
          height={78}
          thumbnailUrl={video.thumbnailUrl}
        />

        {/* Video duration */}
        <Chip
          label={formatDuration(video.duration)}
          size="small"
          sx={{
            position: 'absolute',
            bottom: 8,
            right: 8,
            background: 'linear-gradient(135deg, #6366f1, #7c3aed)',
            color: 'white',
            fontWeight: 600,
            fontSize: '11px',
            height: 20,
            minWidth: 48,
            minHeight: 36,
            padding: 2,
            borderRadius: 2
          }}
        />

        {/* Platform indicator */}
        <Chip
          label={video.platform.toUpperCase()}
          size="small"
          sx={{
            position: 'absolute',
            top: 8,
            left: 8,
            background: 'linear-gradient(135deg, #a0aec0, #bfae60)',
            color: 'white',
            fontWeight: 600,
            fontSize: '10px',
            height: 20,
            minWidth: 48,
            minHeight: 36,
            padding: 2,
            borderRadius: 2
          }}
        />
      </Box>

      <Box sx={{ marginTop: 1.5, padding: 0.5 }}>
        <Typography
          variant="body2"
          sx={{
            color: '#1e293b',
            fontFamily: 'Roboto',
            fontSize: '13px',
            fontWeight: 600,
            lineHeight: 1.3,
            marginBottom: 0.5,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {video.title}
        </Typography>

        {video.playlist && (
          <Typography
            variant="caption"
            sx={{
              color: '#64748b',
              fontFamily: 'Roboto',
              fontSize: '11px',
              fontWeight: 400,
              lineHeight: 1.2,
              marginBottom: 1,
              display: 'block',
            }}
          >
            📚 {video.playlist.name}
          </Typography>
        )}

        {/* Categories */}
        {categories.length > 0 && (
          <Stack direction="row" spacing={0.5} sx={{ flexWrap: 'wrap' }}>
            <Chip
              label={categories[0]}
              size="small"
              sx={{
                height: 18,
                fontSize: '9px',
                backgroundColor: '#e3f2fd',
                color: '#1976d2',
              }}
            />
          </Stack>
        )}
      </Box>
      </Box>
    </CosmicCard>
  );
});

interface UPlayMobileHomeProps {
  isDesktop?: boolean;
}

const UPlayMobileHome: React.FC<UPlayMobileHomeProps> = ({ isDesktop = false }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  // Enhanced state management - ALWAYS call hooks in the same order
  const [showStats, setShowStats] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [currentStreak, setCurrentStreak] = useState(3);
  const [showAllVideos, setShowAllVideos] = useState(false);

  // 🏫 Estado para el panel de funcionalidades sociales
  const [showSocialPanel, setShowSocialPanel] = useState(false);

  // 🎮 Hook para métricas de gamificación REALES del backend
  const {
    data: gamificationMetrics,
    isLoading: metricsLoading,
    error: metricsError,
  } = useGamificationMetrics();

  // 🎯 Datos de estadísticas - usar datos reales del backend o fallback básico
  const userStats = React.useMemo(() => {
    if (gamificationMetrics) {
      return {
        name: 'Usuario', // Obtener del contexto de auth si está disponible
        activePlayers: 150, // Estos datos pueden venir de otro endpoint
        burnedPlayers: 50,
        level: gamificationMetrics.level,
        merits: gamificationMetrics.meritos,
        ondas: gamificationMetrics.ondas,
        experience: gamificationMetrics.meritos * 10, // Cálculo basado en méritos
        experienceToNext: ((gamificationMetrics.level + 1) * 1000) - (gamificationMetrics.meritos * 10),
        weeklyGoal: 7,
        currentStreak: gamificationMetrics.completedChallenges || 0,
        completedVideos: gamificationMetrics.completedChallenges || 0,
        totalWatchTime: 45600, // Esto puede venir de otro endpoint
        achievements: gamificationMetrics.completedChallenges || 0,
        ranking: 47, // Esto puede venir de otro endpoint
      };
    }

    // Fallback básico (NO mock) - valores realistas para un usuario nuevo
    return {
      name: 'Usuario',
      activePlayers: 150,
      burnedPlayers: 50,
      level: 1,
      merits: 0,
      ondas: 0,
      experience: 0,
      experienceToNext: 1000,
      weeklyGoal: 7,
      currentStreak: 0,
      completedVideos: 0,
      totalWatchTime: 0,
      achievements: 0,
      ranking: 999,
    };
  }, [gamificationMetrics]);

  // Enhanced mock data with progress - stable reference
  const mockVideoProgress: VideoProgress[] = React.useMemo(() => [
    {
      videoId: 1,
      progress: 35,
      completed: false,
      questionsAnswered: 3,
      totalQuestions: 7,
      meritsEarned: 45,
      lastWatched: new Date(),
    },
    {
      videoId: 2,
      progress: 100,
      completed: true,
      questionsAnswered: 5,
      totalQuestions: 5,
      meritsEarned: 75,
      lastWatched: new Date(Date.now() - 86400000),
    },
  ], []);

  // Use enhanced mock data hook para fallback
  // const {
  //   isLoading: isMockLoading,
  //   continueWatching,
  //   formatDuration,
  //   getProgressText,
  //   isPreviewEnvironment,
  // } = useUPlayMockData();

  // Mock data fallback while mock hook is disabled
  const isMockLoading = false;
  const continueWatching = {
    title: 'Introducción a CoomÜnity',
    description: 'Conoce los fundamentos de nuestra plataforma colaborativa'
  };
  // 🎯 Usar formatDuration mejorado del videoDurationFixer
  const formatDuration = (seconds: number) => {
    return fixedFormatDuration(seconds);
  };
  const getProgressText = (progress: number) => `${progress}% completado`;
  const isPreviewEnvironment = false;

  // 🔥 Usar datos reales del backend (principal)
  const {
    data: backendVideos,
    isLoading: isBackendLoading,
    isError: isBackendError,
    error: backendError
  } = useVideos();

  // Combinar estados de loading
  const isLoading = isBackendLoading;

  // 🔧 LOGS DE DEBUG EXTENSIVOS PARA DIAGNOSTICAR EL PROBLEMA
  React.useEffect(() => {
    console.log('[ÜPLAY DEBUG] ===== ESTADO DEL HOOK useVideos =====');
    console.log('[ÜPLAY DEBUG] Is Loading:', isBackendLoading);
    console.log('[ÜPLAY DEBUG] Is Error:', isBackendError);
    console.log('[ÜPLAY DEBUG] Error Object:', backendError);
    console.log('[ÜPLAY DEBUG] Data Received:', backendVideos);
    console.log('[ÜPLAY DEBUG] Data Type:', typeof backendVideos);
    console.log('[ÜPLAY DEBUG] Data is Array:', Array.isArray(backendVideos));
    console.log('[ÜPLAY DEBUG] Data Length:', backendVideos?.length);

    if (backendVideos && Array.isArray(backendVideos)) {
      console.log('[ÜPLAY DEBUG] First Video:', backendVideos[0]);
      console.log('[ÜPLAY DEBUG] All Videos:', backendVideos);
    }

    if (isBackendError) {
      console.error('[ÜPLAY DEBUG] ❌ ERROR DETAILS:', {
        error: backendError,
        message: backendError?.message,
        stack: backendError?.stack
      });
    }

    console.log('[ÜPLAY DEBUG] =====================================');
  }, [isBackendLoading, isBackendError, backendVideos, backendError]);

  // Procesar videos del backend
  const processedVideos = React.useMemo(() => {
    console.log('[ÜPLAY DEBUG] ===== PROCESANDO VIDEOS =====');
    console.log('[ÜPLAY DEBUG] backendVideos raw:', backendVideos);
    console.log('[ÜPLAY DEBUG] backendVideos type:', typeof backendVideos);
    console.log('[ÜPLAY DEBUG] backendVideos isArray:', Array.isArray(backendVideos));

    if (!backendVideos || !Array.isArray(backendVideos)) {
      console.log('[ÜPLAY DEBUG] ❌ No hay datos del backend válidos');
      return [];
    }

    console.log('[ÜPLAY DEBUG] Total videos recibidos:', backendVideos.length);

    // Filtrar solo videos activos
    const activeVideos = backendVideos.filter((video: any) => {
      console.log('[ÜPLAY DEBUG] Video:', video.title, 'isActive:', video.isActive);
      return video.isActive;
    });

    console.log('[ÜPLAY DEBUG] ✅ Videos activos filtrados:', activeVideos.length);
    console.log('[ÜPLAY DEBUG] Videos activos:', activeVideos);

    // 🎯 APLICAR CORRECCIÓN DE DURACIONES usando videoDurationFixer
    const videosWithFixedDurations = useVideosWithCorrectDurations(activeVideos);
    console.log('[ÜPLAY DEBUG] 🎯 Videos con duraciones corregidas:', videosWithFixedDurations);

    // Log para debug de duraciones
    videosWithFixedDurations.forEach((video: any) => {
      console.log(`[ÜPLAY DEBUG] Video "${video.title}": ${video.duration}s (${fixedFormatDuration(video.duration)})`);
    });

    console.log('[ÜPLAY DEBUG] =====================================');

    return videosWithFixedDurations as BackendVideo[];
  }, [backendVideos]);

  // Agrupar videos por playlist para mejor organización
  const videosByPlaylist = React.useMemo(() => {
    console.log('[ÜPLAY DEBUG] ===== AGRUPANDO POR PLAYLIST =====');
    console.log('[ÜPLAY DEBUG] processedVideos para agrupar:', processedVideos);
    console.log('[ÜPLAY DEBUG] processedVideos length:', processedVideos.length);

    const grouped: Record<string, BackendVideo[]> = {};

    processedVideos.forEach((video) => {
      const playlistName = video.playlist?.name || 'Sin Playlist';
      console.log('[ÜPLAY DEBUG] Video:', video.title, 'Playlist:', playlistName);

      if (!grouped[playlistName]) {
        grouped[playlistName] = [];
      }
      grouped[playlistName].push(video);
    });

    console.log('[ÜPLAY DEBUG] ✅ Videos agrupados por playlist:', grouped);
    console.log('[ÜPLAY DEBUG] Número de playlists:', Object.keys(grouped).length);
    console.log('[ÜPLAY DEBUG] =====================================');

    return grouped;
  }, [processedVideos]);

  // Memoized handlers to prevent function recreation on every render
  const handleVideoClick = React.useCallback((video: BackendVideo) => {
    console.log('🔥 Playing video from backend:', video.title);
    console.log('🔥 Video URL:', video.url);
    console.log('🔥 Video data:', video);

    // Mapear a rutas existentes o usar ID del video
    const videoId = video.externalId || video.id.toString();

    console.log('🔥 Navigating to video ID:', videoId);
    navigate(`/uplay/video/${videoId}`, {
      state: {
        from: '/uplay',
        videoData: video // Pasar datos del video
      },
    });
  }, [navigate]);

  const handleContinueWatching = React.useCallback(() => {
    // Si hay videos del backend, usar el primero como "continuar viendo"
    if (processedVideos.length > 0) {
      handleVideoClick(processedVideos[0]);
    } else {
      console.log('Continuing with mock video:', continueWatching.title);
      navigate('/uplay/video/coomunity-intro', {
        state: { from: '/uplay' },
      });
    }
  }, [navigate, processedVideos, continueWatching.title, handleVideoClick]);

  const handleShowStats = React.useCallback(() => {
    setShowStats(!showStats);
  }, [showStats]);

  const handleToggleAllVideos = React.useCallback(() => {
    setShowAllVideos(!showAllVideos);
  }, [showAllVideos]);

  // 🏫 Handler para el panel de funcionalidades sociales
  const handleToggleSocialPanel = React.useCallback(() => {
    setShowSocialPanel(!showSocialPanel);
  }, [showSocialPanel]);

  // Enhanced status chip component for cleaner code
  const EnhancedStatusChip: React.FC<{
    icon: React.ReactNode;
    label: string;
    value: string | number;
    color: 'success' | 'error' | 'warning' | 'info';
  }> = React.memo(({ icon, label, value, color }) => (
    <Chip
      icon={icon || undefined}
      label={`${label}: ${value}`}
      sx={{
        height: 28,
        fontSize: '12px',
        fontWeight: 600,
        backgroundColor:
          color === 'success'
            ? '#d1fae5'
            : color === 'error'
            ? '#fee2e2'
            : color === 'warning'
            ? '#fef3c7'
            : '#dbeafe',
        color:
          color === 'success'
            ? '#065f46'
            : color === 'error'
            ? '#991b1b'
            : color === 'warning'
            ? '#92400e'
            : '#1e40af',
        '& .MuiChip-icon': {
          color:
            color === 'success'
              ? '#10b981'
              : color === 'error'
              ? '#ef4444'
              : color === 'warning'
              ? '#f59e0b'
              : '#3b82f6',
        },
      }}
    />
  ));

  // Loading state
  if (isLoading) {
    return (
      <Box>
        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            color: 'white',
          }}
        >
          <Toolbar sx={{ minHeight: 64, px: 2 }}>
            <IconButton edge="start" sx={{ mr: 1, color: 'white' }}>
              <MenuIcon />
            </IconButton>
            <Box sx={{ flexGrow: 1, textAlign: 'center' }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                ÜPlay
              </Typography>
              <Typography variant="caption" sx={{ fontSize: '11px', opacity: 0.9 }}>
                Cargando contenido...
              </Typography>
            </Box>
          </Toolbar>
        </AppBar>

        <Container maxWidth="sm" sx={{ px: 2, py: 4 }}>
          <Stack spacing={3} alignItems="center">
            <CircularProgress size={60} sx={{ color: '#6366f1' }} />
            <Typography variant="h6" color="text.secondary">
              Cargando videos...
            </Typography>

            {/* Loading skeletons */}
            {[1, 2, 3].map((i) => (
              <Skeleton
                key={i}
                variant="rectangular"
                width="100%"
                height={100}
                sx={{ borderRadius: 2 }}
              />
            ))}
          </Stack>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      {/* Enhanced Header */}
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
          color: 'white',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <Toolbar sx={{ minHeight: 64, px: 2 }}>
          <IconButton edge="start" sx={{ mr: 1, color: 'white' }}>
            <MenuIcon />
          </IconButton>

          <Box sx={{ flexGrow: 1, textAlign: 'center' }}>
            <Typography
              variant="h6"
              component="h1"
              sx={{
                fontFamily: 'Roboto',
                fontSize: '22px',
                fontWeight: 700,
                lineHeight: '28px',
              }}
            >
              ÜPlay
            </Typography>
            <Typography
              variant="caption"
              sx={{
                fontSize: '11px',
                opacity: 0.9,
                fontWeight: 500,
              }}
            >
              Reproductor Gamificado
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <IconButton size="small" sx={{ color: 'white' }}>
              <SearchIcon />
            </IconButton>
            <Badge badgeContent={3} color="error">
              <IconButton size="small" sx={{ color: 'white' }}>
                <NotificationsIcon />
              </IconButton>
            </Badge>
            <IconButton size="small" sx={{ color: 'white' }}>
              <MessageIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container
        maxWidth={isDesktop ? "lg" : "sm"}
        sx={{
          px: isDesktop ? 4 : 2,
          py: isDesktop ? 4 : 2,
          pb: 10
        }}
      >
        {/* Desktop-specific layout improvements */}
        {isDesktop && (
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 1
              }}
            >
              Bienvenido a ÜPlay
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 500 }}>
              Experiencia gamificada de aprendizaje colaborativo
            </Typography>
          </Box>
        )}

        {/* Status de conexión con Backend */}
        <Box sx={{ mb: 2 }}>
          <Alert
            severity={isBackendError ? "error" : "success"}
            icon={<VideoLibraryIcon />}
            sx={{
              borderRadius: 2,
              backgroundColor: isBackendError ? '#ffebee' : '#e8f5e8',
              border: `1px solid ${isBackendError ? '#f44336' : '#4caf50'}`,
              fontSize: '14px',
              '& .MuiAlert-message': {
                fontWeight: 600
              }
            }}
          >
            {isBackendError ? (
              <>❌ <strong>Sin conexión al backend:</strong> Usando datos de demostración</>
            ) : (
              <>✅ <strong>Conectado al backend:</strong> {processedVideos.length} videos disponibles</>
            )}
          </Alert>
        </Box>

        {/* Enhanced Status Chips */}
        <Stack
          direction="row"
          spacing={1}
          sx={{
            mb: 3,
            flexWrap: 'wrap',
            gap: 1,
            justifyContent: isDesktop ? 'center' : 'flex-start'
          }}
        >
          <EnhancedStatusChip
            icon={<PersonIcon sx={{ fontSize: 12 }} />}
            label="Activos"
            value={userStats.activePlayers}
            color="success"
          />
          <EnhancedStatusChip
            icon={<FireIcon sx={{ fontSize: 12 }} />}
            label="Quemados"
            value={userStats.burnedPlayers}
            color="error"
          />
          <EnhancedStatusChip
            icon={<OndemandVideoIcon sx={{ fontSize: 12 }} />}
            label="Videos"
            value={processedVideos.length}
            color="info"
          />
        </Stack>

        {/* Desktop vs Mobile Layout */}
        {isDesktop ? (
          // Desktop Layout - Grid-based with improved organization
          <Grid container spacing={4}>
            {/* Left Column - Continue Watching & Featured */}
            <Grid item xs={12} md={8}>
              {/* Continuar viendo - Solo si hay videos del backend */}
              {processedVideos.length > 0 && (
                <Box sx={{ mb: 4 }}>
                  <Typography
                    variant="h5"
                    sx={{
                      color: '#1e293b',
                      fontFamily: 'Roboto',
                      fontWeight: 700,
                      marginBottom: 3,
                    }}
                  >
                    📺 Continuar viendo
                  </Typography>

                  <Card
                    sx={{
                      borderRadius: 3,
                      overflow: 'hidden',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
                      },
                      marginBottom: 4,
                    }}
                    onClick={handleContinueWatching}
                  >
                    <Grid container>
                      <Grid item xs={5}>
                        <VideoThumbnail
                          width="100%"
                          height={200}
                          progress={35}
                          thumbnailUrl={getVideoThumbnail(processedVideos[0] || {})}
                        />
                      </Grid>
                      <Grid item xs={7}>
                        <CardContent sx={{ padding: 3, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                          <Typography variant="h5" sx={{ fontWeight: 700, marginBottom: 2 }}>
                            {processedVideos[0]?.title || 'Video Destacado'}
                          </Typography>
                          <Typography variant="body1" color="text.secondary" sx={{ marginBottom: 2 }}>
                            {processedVideos[0]?.description || 'Continúa donde lo dejaste'}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            <Chip
                              label={`${Math.floor(processedVideos[0]?.duration / 60)}:${(processedVideos[0]?.duration % 60).toString().padStart(2, '0')}`}
                              size="small"
                              color="primary"
                            />
                            <Chip
                              label={processedVideos[0]?.platform.toUpperCase()}
                              size="small"
                              color="secondary"
                            />
                          </Box>
                        </CardContent>
                      </Grid>
                    </Grid>
                  </Card>
                </Box>
              )}
            </Grid>

            {/* Right Column - Stats & Progress */}
            <Grid item xs={12} md={4}>
              {/* User Stats Card - Enhanced for Desktop */}
              <Card sx={{ borderRadius: 3, marginBottom: 3 }}>
                <Box
                  sx={{
                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    color: 'white',
                    padding: 3,
                  }}
                >
                  <Typography variant="h5" sx={{ fontWeight: 700, marginBottom: 2 }}>
                    📊 Tu Progreso
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Box textAlign="center">
                        <Typography variant="h3" sx={{ fontWeight: 800 }}>
                          {userStats.completedVideos}
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                          Videos Completados
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box textAlign="center">
                        <Typography variant="h3" sx={{ fontWeight: 800 }}>
                          {Math.floor(userStats.totalWatchTime / 3600)}h
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                          Tiempo Total
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>

                <CardContent sx={{ padding: 3 }}>
                  <Typography variant="h6" sx={{ marginBottom: 2, fontWeight: 700 }}>
                    🎯 Meta Semanal
                  </Typography>
                  <Box sx={{ marginBottom: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 1 }}>
                      <Typography variant="body2">
                        {userStats.weeklyGoal} videos
                      </Typography>
                      <Typography variant="body2" color="primary">
                        {currentStreak}/{userStats.weeklyGoal}
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={(currentStreak / userStats.weeklyGoal) * 100}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: '#e3f2fd',
                        '& .MuiLinearProgress-bar': {
                          borderRadius: 4,
                          background: 'linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%)',
                        },
                      }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        ) : (
          // Mobile Layout - Original vertical layout
          <>
            {/* Continuar viendo - Solo si hay videos del backend */}
            {processedVideos.length > 0 && (
              <Box sx={{ mb: 4 }}>
                <Typography
                  sx={{
                    color: '#1e293b',
                    fontFamily: 'Roboto',
                    fontSize: '18px',
                    fontWeight: 700,
                    lineHeight: '22px',
                    marginBottom: 2,
                  }}
                >
                  📺 Continuar viendo
                </Typography>

                <Card
                  sx={{
                    borderRadius: 3,
                    overflow: 'hidden',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
                    },
                    marginBottom: 2,
                  }}
                  onClick={handleContinueWatching}
                >
                  <Box sx={{ position: 'relative' }}>
                    <VideoThumbnail
                      width="100%"
                      height={220}
                      progress={35}
                      thumbnailUrl={getVideoThumbnail(processedVideos[0] || {})}
                    />

                    {/* Enhanced play overlay */}
                    <Box
                      sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        background:
                          'linear-gradient(135deg, rgba(99, 102, 241, 0.9) 0%, rgba(139, 92, 246, 0.9) 100%)',
                        borderRadius: '50%',
                        width: 72,
                        height: 72,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 8px 32px rgba(99, 102, 241, 0.4)',
                      }}
                    >
                      <PlayIcon sx={{ color: 'white', fontSize: 36 }} />
                    </Box>

                    {/* Video info overlay */}
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 16,
                        right: 16,
                        display: 'flex',
                        gap: 1,
                      }}
                    >
                      <Chip
                        label={Math.floor(processedVideos[0]?.duration / 60) + ':' + (processedVideos[0]?.duration % 60).toString().padStart(2, '0')}
                        size="small"
                        sx={{
                          backgroundColor: 'rgba(0,0,0,0.8)',
                          color: 'white',
                          fontWeight: 600,
                        }}
                      />
                    </Box>
                  </Box>

                  <CardContent sx={{ padding: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, marginBottom: 1 }}>
                      {processedVideos[0]?.title || 'Video Destacado'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {processedVideos[0]?.description || 'Continúa donde lo dejaste'}
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            )}
          </>
        )}

        {/* Videos disponibles por playlist */}
        {(() => {
          console.log('[ÜPLAY DEBUG] ===== RENDERIZANDO VIDEOS POR PLAYLIST =====');
          console.log('[ÜPLAY DEBUG] videosByPlaylist:', videosByPlaylist);
          console.log('[ÜPLAY DEBUG] Object.entries(videosByPlaylist):', Object.entries(videosByPlaylist));
          console.log('[ÜPLAY DEBUG] Object.entries length:', Object.entries(videosByPlaylist).length);
          console.log('[ÜPLAY DEBUG] =====================================');
          return null;
        })()}
        {Object.entries(videosByPlaylist).map(([playlistName, videos]) => (
          <Box key={playlistName} sx={{ mb: 4 }}>
            <Typography
              sx={{
                color: '#1e293b',
                fontFamily: 'Roboto',
                fontSize: '16px',
                fontWeight: 700,
                lineHeight: '22px',
                marginBottom: 2,
              }}
            >
              🌟 {playlistName}
            </Typography>

            <Stack direction="row" spacing={2} sx={{ overflowX: 'auto', paddingBottom: 2 }}>
              {videos.slice(0, showAllVideos ? videos.length : 5).map((video) => (
                <BackendVideoCard
                  key={video.id}
                  video={video}
                  onClick={() => handleVideoClick(video)}
                />
              ))}
            </Stack>

            {videos.length > 5 && (
              <Button
                onClick={handleToggleAllVideos}
                sx={{ marginTop: 1 }}
                endIcon={showAllVideos ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              >
                {showAllVideos ? 'Mostrar menos' : `Ver todos (${videos.length})`}
              </Button>
            )}
          </Box>
        ))}

        {/* Lista completa de videos */}
        <Box sx={{ mb: 4 }}>
          <Typography
            sx={{
              color: '#1e293b',
              fontFamily: 'Roboto',
              fontSize: '18px',
              fontWeight: 700,
              lineHeight: '22px',
              marginBottom: 2,
            }}
          >
            📋 Todos los Videos Disponibles ({processedVideos.length})
          </Typography>

          {processedVideos.length > 0 ? (
            <Box>
              {processedVideos.map((video) => (
                <BackendVideoCard
                  key={video.id}
                  video={video}
                  onClick={() => handleVideoClick(video)}
                  showFullInfo={true}
                />
              ))}
            </Box>
          ) : (
            <Paper sx={{ padding: 4, textAlign: 'center', borderRadius: 3 }}>
              <OndemandVideoIcon sx={{ fontSize: 48, color: 'text.secondary', marginBottom: 2 }} />
              <Typography variant="h6" color="text.secondary" sx={{ marginBottom: 1 }}>
                No hay videos disponibles
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {isBackendError
                  ? 'Error conectando al backend. Verifica que el servicio esté ejecutándose.'
                  : 'No se encontraron videos en el backend.'
                }
              </Typography>
            </Paper>
          )}
        </Box>

        {/* Enhanced User Stats Section (Collapsible) */}
        <Card sx={{ marginBottom: 3, borderRadius: 3, overflow: 'hidden' }}>
          <Box
            sx={{
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              color: 'white',
              padding: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
            }}
            onClick={handleShowStats}
          >
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              📊 Panel de Estadísticas
            </Typography>
            <IconButton
              sx={{ color: 'white' }}
              onClick={(e) => {
                e.stopPropagation();
                handleShowStats();
              }}
            >
              {showStats ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </Box>

          <Collapse in={showStats}>
            <CardContent sx={{ padding: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={6}>
                  <Box textAlign="center">
                    <Typography
                      variant="h4"
                      color="primary"
                      sx={{ fontWeight: 800 }}
                    >
                      {userStats.completedVideos}
                    </Typography>
                    <Typography variant="caption" sx={{ fontWeight: 600 }}>
                      Videos Completados
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box textAlign="center">
                    <Typography
                      variant="h4"
                      color="success.main"
                      sx={{ fontWeight: 800 }}
                    >
                      {Math.floor(userStats.totalWatchTime / 3600)}h
                    </Typography>
                    <Typography variant="caption" sx={{ fontWeight: 600 }}>
                      Tiempo Total
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box textAlign="center">
                    <Typography
                      variant="h4"
                      color="warning.main"
                      sx={{ fontWeight: 800 }}
                    >
                      {userStats.merits}
                    </Typography>
                    <Typography variant="caption" sx={{ fontWeight: 600 }}>
                      Mëritos
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box textAlign="center">
                    <Typography
                      variant="h4"
                      color="secondary.main"
                      sx={{ fontWeight: 800 }}
                    >
                      {userStats.ondas}
                    </Typography>
                    <Typography variant="caption" sx={{ fontWeight: 600 }}>
                      Öndas
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              <Divider sx={{ margin: 3 }} />

              <Typography variant="h6" sx={{ marginBottom: 2, fontWeight: 700 }}>
                🎯 Progreso Semanal
              </Typography>
              <Box sx={{ marginBottom: 2 }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: 1,
                  }}
                >
                  <Typography variant="body2">
                    Meta semanal: {userStats.weeklyGoal} videos
                  </Typography>
                  <Typography variant="body2" color="primary">
                    {currentStreak}/{userStats.weeklyGoal}
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={(currentStreak / userStats.weeklyGoal) * 100}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: '#e3f2fd',
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 4,
                      background:
                        'linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%)',
                    },
                  }}
                />
              </Box>
            </CardContent>
          </Collapse>
        </Card>
      </Container>

      {/* 🏫 Floating Action Button para Funcionalidades Sociales */}
      <Zoom in={true}>
        <Fab
          color="secondary"
          onClick={handleToggleSocialPanel}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            background: 'linear-gradient(135deg, #8b5cf6, #a78bfa)',
            color: 'white',
            width: 64,
            height: 64,
            zIndex: 1000,
            '&:hover': {
              background: 'linear-gradient(135deg, #7c3aed, #8b5cf6)',
              transform: 'scale(1.1)',
            },
            boxShadow: '0 8px 32px rgba(139, 92, 246, 0.4)',
          }}
        >
          <Badge
            badgeContent={3}
            color="error"
            sx={{
              '& .MuiBadge-badge': {
                fontSize: '10px',
                minWidth: 18,
                height: 18,
              }
            }}
          >
            <GroupsIcon sx={{ fontSize: 28 }} />
          </Badge>
        </Fab>
      </Zoom>

      {/* 🏫 Panel de Funcionalidades Sociales */}
      <SocialFeaturesPanel
        isOpen={showSocialPanel}
        onClose={() => setShowSocialPanel(false)}
        userId="current-user"
        currentVideoId={processedVideos[0]?.id.toString()}
        enableBackdrop={true}
      />
    </Box>
  );
};

export default UPlayMobileHome;
