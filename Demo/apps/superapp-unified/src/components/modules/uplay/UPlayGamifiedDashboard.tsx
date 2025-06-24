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
import { motion } from 'framer-motion';

// Importar componentes mejorados
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

// [PHOENIX/ANA] Uso de useUPlayProgress para obtener progreso compartido
import { useUPlayProgress } from './hooks/useUPlayProgress';

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
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        overflow: 'hidden',
        background: 'rgba(40,40,80,0.85)', // glassmorphism base
        backdropFilter: 'blur(8px)',
        border: '1.5px solid rgba(99,102,241,0.18)',
        borderRadius: 3,
        boxShadow: '0 4px 24px 0 rgba(99,102,241,0.10)',
        '&:hover': {
          transform: 'translateY(-8px) scale(1.04)',
          boxShadow: `0 12px 32px rgba(99,102,241,0.18), 0 0 24px ${getDifficultyColor(video.difficulty)}70`,
          '& .play-overlay': {
            opacity: 1,
            transform: 'scale(1)',
          },
        },
      }}
      onClick={() => onPlay(video.id)}
      aria-label={`Ver video: ${video.title}`}
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
          <motion.button
            whileTap={{ scale: 0.85 }}
            whileHover={{ scale: 1.1, boxShadow: '0 0 20px #ff6b6b' }}
            style={{
              border: 'none',
              background: 'linear-gradient(45deg, #ff6b6b, #feca57)',
              borderRadius: '50%',
              width: 64,
              height: 64,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              cursor: 'pointer',
              outline: 'none',
              boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
            }}
            aria-label="Reproducir video"
            onClick={(e) => {
              e.stopPropagation();
              onPlay(video.id);
            }}
          >
            <PlayArrow style={{ fontSize: '2.5rem' }} />
          </motion.button>
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

// Widget de progreso semanal
const WeeklyProgressWidget: React.FC = () => {
  const [progress, setProgress] = useState(65); // Mock data - conectar con backend
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <Card sx={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <CardContent>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box>
              <Typography variant="h6" fontWeight="bold">
                Progreso Semanal
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                {progress}% completado
              </Typography>
            </Box>
            <Box position="relative">
              <CircularProgress
                variant="determinate"
                value={progress}
                size={60}
                thickness={4}
                sx={{
                  color: '#4ade80',
                  '& .MuiCircularProgress-circle': {
                    strokeLinecap: 'round',
                  },
                }}
              />
              <Box
                position="absolute"
                top={0}
                left={0}
                bottom={0}
                right={0}
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Typography variant="caption" fontWeight="bold">
                  {progress}%
                </Typography>
              </Box>
            </Box>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={progress} 
            sx={{ 
              mt: 2, 
              height: 8, 
              borderRadius: 4,
              backgroundColor: 'rgba(255,255,255,0.2)',
              '& .MuiLinearProgress-bar': {
                background: 'linear-gradient(90deg, #4ade80, #22c55e)',
                borderRadius: 4,
              }
            }} 
          />
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Widget de racha de días consecutivos
const StreakWidget: React.FC = () => {
  const [streak, setStreak] = useState(7); // Mock data
  const [isOnFire, setIsOnFire] = useState(streak >= 3);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Card sx={{ 
        background: isOnFire 
          ? 'linear-gradient(135deg, #ff6b6b 0%, #ff8e53 100%)'
          : 'linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)',
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <CardContent>
          <Box display="flex" alignItems="center" gap={2}>
            <motion.div
              animate={isOnFire ? {
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              } : {}}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              {isOnFire ? 
                <Whatshot sx={{ fontSize: 40, color: '#ffeb3b' }} /> :
                <Bolt sx={{ fontSize: 40, color: '#e3f2fd' }} />
              }
            </motion.div>
            <Box>
              <Typography variant="h4" fontWeight="bold">
                {streak}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                {isOnFire ? '🔥 ¡En racha!' : 'Días consecutivos'}
              </Typography>
            </Box>
          </Box>
          {isOnFire && (
            <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
              ¡Increíble! Mantén el momentum
            </Typography>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Widget de ranking/clasificación
const RankingWidget: React.FC = () => {
  const [userRank, setUserRank] = useState(12); // Mock data
  const [totalUsers, setTotalUsers] = useState(156);
  
  const getRankIcon = (rank: number) => {
    if (rank <= 3) return <Diamond sx={{ color: '#ffd700' }} />;
    if (rank <= 10) return <Star sx={{ color: '#c0c0c0' }} />;
    return <TrendingUp sx={{ color: '#cd7f32' }} />;
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <Card sx={{ 
        background: 'linear-gradient(135deg, #a29bfe 0%, #6c5ce7 100%)',
        color: 'white'
      }}>
        <CardContent>
          <Box display="flex" alignItems="center" gap={2}>
            {getRankIcon(userRank)}
            <Box>
              <Typography variant="h6" fontWeight="bold">
                Posición #{userRank}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                de {totalUsers} usuarios
              </Typography>
            </Box>
          </Box>
          <Box mt={2}>
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography variant="caption">Progreso al Top 10</Typography>
              <Typography variant="caption">
                {Math.max(0, 10 - userRank)} posiciones
              </Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={Math.max(0, (10 - userRank) / 10 * 100)} 
              sx={{ 
                height: 6, 
                borderRadius: 3,
                backgroundColor: 'rgba(255,255,255,0.2)',
                '& .MuiLinearProgress-bar': {
                  background: 'linear-gradient(90deg, #ffecd2, #fcb69f)',
                  borderRadius: 3,
                }
              }} 
            />
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Widget de próximos logros
const UpcomingAchievementsWidget: React.FC = () => {
  const upcomingAchievements = [
    { name: 'Maestro del Conocimiento', progress: 80, icon: '🎓' },
    { name: 'Explorador Incansable', progress: 45, icon: '🧭' },
    { name: 'Colaborador Estrella', progress: 60, icon: '⭐' }
  ];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <Card sx={{ 
        background: 'linear-gradient(135deg, #fd79a8 0%, #fdcb6e 100%)',
        color: 'white'
      }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" mb={2}>
            <AutoAwesome sx={{ mr: 1 }} />
            Próximos Logros
          </Typography>
          {upcomingAchievements.map((achievement, index) => (
            <Box key={index} mb={index < upcomingAchievements.length - 1 ? 2 : 0}>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <Typography variant="body2">{achievement.icon}</Typography>
                <Typography variant="body2" fontWeight="medium">
                  {achievement.name}
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={achievement.progress} 
                sx={{ 
                  height: 4, 
                  borderRadius: 2,
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  '& .MuiLinearProgress-bar': {
                    background: 'linear-gradient(90deg, #00b894, #00cec9)',
                    borderRadius: 2,
                  }
                }} 
              />
              <Typography variant="caption" sx={{ opacity: 0.8 }}>
                {achievement.progress}% completado
              </Typography>
            </Box>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Widget de estadísticas de sesión actual
const SessionStatsWidget: React.FC = () => {
  const [sessionTime, setSessionTime] = useState(0);
  const [videosWatched, setVideosWatched] = useState(3);
  const [questionsAnswered, setQuestionsAnswered] = useState(12);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setSessionTime(prev => prev + 1);
    }, 60000); // Actualizar cada minuto
    
    return () => clearInterval(timer);
  }, []);
  
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <Card sx={{ 
        background: 'linear-gradient(135deg, #00b09b 0%, #96c93d 100%)',
        color: 'white'
      }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" mb={2}>
            <LiveTv sx={{ mr: 1 }} />
            Sesión Actual
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <Box textAlign="center">
                <Typography variant="h5" fontWeight="bold">
                  {formatTime(sessionTime)}
                </Typography>
                <Typography variant="caption">Tiempo</Typography>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box textAlign="center">
                <Typography variant="h5" fontWeight="bold">
                  {videosWatched}
                </Typography>
                <Typography variant="caption">Videos</Typography>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box textAlign="center">
                <Typography variant="h5" fontWeight="bold">
                  {questionsAnswered}
                </Typography>
                <Typography variant="caption">Preguntas</Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </motion.div>
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

  // [PHOENIX/ANA] Uso de useUPlayProgress para obtener progreso compartido
  const progress = useUPlayProgress();

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
      precision: Number(playerMetrics?.precision) || 87, // porcentaje de precisión
      racha: Number(playerMetrics?.currentStreak) || 5, // días consecutivos
      videosCompletados: Number(playerMetrics?.completedVideos) || 2,
      tiempoTotal: Number(playerMetrics?.totalWatchTime) || 95, // minutos
      preguntasRespondidas: Number(playerMetrics?.questionsAnswered) || 18,
      logrosDesbloqueados: unlockedAchievements?.length || 0,
      rankingComunidad: 42,
      // ... otras métricas si es necesario
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

  // �� PRELOAD INTELIGENTE - predecir el siguiente tab más probable
  const [preloadedTabs, setPreloadedTabs] = useState<Set<number>>(new Set([0])); // Dashboard siempre cargado

  const preloadTabContent = useCallback((tabIndex: number) => {
    if (!preloadedTabs.has(tabIndex)) {
      setPreloadedTabs(prev => new Set([...prev, tabIndex]));
      console.log(`🚀 Preloading tab ${tabIndex} content...`);
      
      // Simular preload según el tipo de tab
      setTimeout(() => {
        console.log(`✅ Tab ${tabIndex} content preloaded`);
      }, 100);
    }
  }, [preloadedTabs]);

  // 🎯 PREDICCIÓN INTELIGENTE: precargar tabs adyacentes
  useEffect(() => {
    const adjacentTabs = [
      Math.max(0, tabValue - 1),
      Math.min(3, tabValue + 1) // Asumiendo 4 tabs (0-3)
    ];
    
    adjacentTabs.forEach(tabIndex => {
      if (tabIndex !== tabValue) {
        preloadTabContent(tabIndex);
      }
    });
  }, [tabValue, preloadTabContent]);

  // Helper para obtener nombre de playlist
  const getPlaylistName = (playlistId: string) => {
    if (playlistId === 'unassigned') return 'Sin ruta asignada';
    const pl = playlists?.find((p: any) => p.id === playlistId);
    return pl?.name || 'Ruta desconocida';
  };

  // 🎯 HANDLERS OPTIMIZADOS CON PRELOAD Y TRANSICIONES MEJORADAS
  const handleTabChange = useCallback((_: React.SyntheticEvent, newValue: number) => {
    // Mostrar indicador inmediatamente
    setTransitionState(prev => ({ ...prev, isTabChanging: true }));

    // Preload del tab de destino si no está cargado
    preloadTabContent(newValue);

    startTransition(() => {
      setTabValue(newValue);
      
      // Predicar y precargar tabs adyacentes al nuevo tab
      const adjacentTabs = [
        Math.max(0, newValue - 1),
        Math.min(3, newValue + 1)
      ];
      
      adjacentTabs.forEach(tabIndex => {
        if (tabIndex !== newValue) {
          setTimeout(() => preloadTabContent(tabIndex), 200);
        }
      });

      // Resetear indicador después de la transición
      setTimeout(() => {
        setTransitionState(prev => ({ ...prev, isTabChanging: false }));
      }, 400); // Aumentado para transiciones más suaves
    });
  }, [preloadTabContent]);

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
            videoData
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
    playlists,
    playlistsLength: playlists?.length,
    videos,
    videosLength: videos?.length,
    adaptedVideos,
    adaptedVideosLength: adaptedVideos?.length,
    videosByPlaylist,
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
        bgcolor: 'rgba(34,34,64,0.85)', // glassmorphism base
        backdropFilter: 'blur(12px)',
        borderBottom: 1,
        borderColor: 'divider',
        boxShadow: '0 4px 32px 0 rgba(99,102,241,0.10)',
        background: 'linear-gradient(90deg, #6366f1 0%, #8b5cf6 50%, #FF5722 100%)',
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
            aria-label="Abrir menú lateral"
          >
            <Menu />
          </IconButton>
        )}
        <Box display="flex" alignItems="center" flexGrow={1}>
          <Avatar sx={{ bgcolor: 'primary.main', mr: 2, boxShadow: '0 0 12px #8b5cf6' }}>
            <PlayArrow />
          </Avatar>
          <Box>
            <Typography variant="h5" color="white" fontWeight="bold" sx={{ letterSpacing: 1 }}>
              ÜPlay – GPL Gamified Play List
            </Typography>
            <Typography variant="caption" color="#e0e7ff">
              Aprendizaje interactivo gamificado
              {isPending && (
                <Chip
                  label="Cargando..."
                  size="small"
                  sx={{ ml: 1, height: 16, fontSize: '0.6rem', bgcolor: '#6366f1', color: 'white' }}
                  aria-label="Cargando"
                />
              )}
            </Typography>
          </Box>
        </Box>
        <Fade in={!transitionState.isTabChanging} timeout={400}>
          <Box display="flex" gap={1} alignItems="center">
            <Chip
              icon={<Diamond />}
              label={playerMetrics.meritos.toLocaleString()}
              size="small"
              sx={{
                color: '#fff',
                bgcolor: '#9c27b0',
                fontWeight: 'bold',
                boxShadow: '0 0 8px #9c27b0',
                '&:hover': { transform: 'scale(1.08)' },
              }}
              aria-label="Mëritos acumulados"
            />
            <Chip
              icon={<Bolt />}
              label={playerMetrics.ondas.toLocaleString()}
              size="small"
              sx={{
                color: '#fff',
                bgcolor: '#ff9800',
                fontWeight: 'bold',
                boxShadow: '0 0 8px #ff9800',
                '&:hover': { transform: 'scale(1.08)' },
              }}
              aria-label="Öndas acumuladas"
            />
            <Chip
              icon={<Star />}
              label={`Nivel ${playerMetrics.level}`}
              size="small"
              sx={{
                color: '#fff',
                bgcolor: '#2196f3',
                fontWeight: 'bold',
                boxShadow: '0 0 8px #2196f3',
                '&:hover': { transform: 'scale(1.08)' },
              }}
              aria-label="Nivel actual"
            />
            <IconButton color="inherit" aria-label="Notificaciones">
              <Badge badgeContent={unreadNotifications.length} color="error">
                <Notifications />
              </Badge>
            </IconButton>
          </Box>
        </Fade>
      </Toolbar>
      {(isPending || transitionState.isTabChanging || transitionState.isContentLoading) && (
        <LinearProgress
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 2,
            '& .MuiLinearProgress-bar': {
              background: 'linear-gradient(90deg, #6366f1, #8b5cf6, #FF5722)',
            }
          }}
          aria-label="Cargando contenido"
        />
      )}
    </AppBar>
  );

  // 🎨 RENDERIZADO DE TABS MEJORADO CON EFECTOS VISUALES
  const renderTabs = () => (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card sx={{ 
        mb: 3, 
        background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 3,
        overflow: 'hidden'
      }}>
        {/* Indicador de carga durante transición */}
        {transitionState.isTabChanging && (
          <LinearProgress 
            sx={{ 
              height: 2,
              background: 'linear-gradient(90deg, #6366f1, #8b5cf6, #ec4899)',
              '& .MuiLinearProgress-bar': {
                background: 'linear-gradient(90deg, #ffffff, #f3f4f6)',
              }
            }} 
          />
        )}
        
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{
            '& .MuiTabs-indicator': {
              background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
              height: 3,
              borderRadius: '3px 3px 0 0'
            },
            '& .MuiTab-root': {
              minHeight: 64,
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 500,
              color: 'rgba(255,255,255,0.7)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                color: 'rgba(255,255,255,0.9)',
                background: 'rgba(255,255,255,0.05)',
              },
              '&.Mui-selected': {
                color: '#ffffff',
                fontWeight: 600,
              }
            }
          }}
        >
          <Tab 
            icon={
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Dashboard />
              </motion.div>
            } 
            label="Dashboard" 
          />
          <Tab 
            icon={
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <VideoLibrary />
              </motion.div>
            } 
            label="Videoteca" 
          />
          <Tab 
            icon={
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Badge badgeContent={unlockedAchievements.length} color="secondary">
                  <EmojiEvents />
                </Badge>
              </motion.div>
            } 
            label="Logros" 
          />
          <Tab 
            icon={
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Groups />
              </motion.div>
            } 
            label="Salas de Estudio" 
          />
        </Tabs>
      </Card>
    </motion.div>
  );

  // 🎨 RENDERIZADO DE VIDEOTECA MEJORADO
  const renderVideoLibrary = () => (
    <Container maxWidth="xl" sx={{ py: 3 }}>
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
    </Container>
  );

  // 🎨 RENDERIZADO DE LOGROS MEJORADO
  const renderAchievements = () => (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Typography variant="h4" fontWeight="bold" mb={4} textAlign="center">
          🏆 Logros y Mëritos
        </Typography>
        
        <Grid container spacing={3}>
          {/* Logros desbloqueados */}
          {unlockedAchievements.map((achievement: any, index: number) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ 
                height: '100%',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                transition: 'transform 0.3s ease',
                '&:hover': { transform: 'translateY(-4px)' }
              }}>
                <CardContent>
                  <Box display="flex" alignItems="center" gap={2} mb={2}>
                    <EmojiEvents sx={{ fontSize: 32, color: '#ffd700' }} />
                    <Typography variant="h6" fontWeight="bold">
                      {achievement.name || 'Logro Desbloqueado'}
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    {achievement.description || 'Has completado este desafío exitosamente'}
                  </Typography>
                  <Box mt={2} display="flex" gap={1}>
                    <Chip 
                      icon={<Star />} 
                      label={`+${achievement.meritos || 50} Mëritos`} 
                      size="small" 
                      sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}
                    />
                    <Chip 
                      icon={<Bolt />} 
                      label={`+${achievement.ondas || 25} Öndas`} 
                      size="small" 
                      sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}

          {/* Mensaje si no hay logros */}
          {unlockedAchievements.length === 0 && (
            <Grid item xs={12}>
              <Card sx={{ p: 4, textAlign: 'center', bgcolor: 'rgba(0,0,0,0.1)' }}>
                <Typography variant="h6" color="text.secondary" mb={2}>
                  ¡Comienza tu aventura de aprendizaje!
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Completa videos y desafíos para desbloquear logros únicos y ganar Mëritos
                </Typography>
              </Card>
            </Grid>
          )}
        </Grid>
      </motion.div>
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

  // 🎨 COMPONENTE TABPANEL MEJORADO CON TRANSICIONES SLIDE
  const EnhancedTabPanel: React.FC<TabPanelProps & { direction?: 'left' | 'right' }> = ({ 
    children, 
    value, 
    index, 
    direction = 'left',
    ...other 
  }) => {
    const isActive = value === index;
    const isPreloaded = preloadedTabs.has(index);
    
    return (
      <div
        role="tabpanel"
        hidden={!isActive}
        id={`uplay-tabpanel-${index}`}
        aria-labelledby={`uplay-tab-${index}`}
        {...other}
      >
        {isActive && (
          <motion.div
            key={`tab-${index}`}
            initial={{ 
              opacity: 0, 
              x: direction === 'left' ? -30 : 30,
              scale: 0.98 
            }}
            animate={{ 
              opacity: 1, 
              x: 0,
              scale: 1 
            }}
            exit={{ 
              opacity: 0, 
              x: direction === 'left' ? 30 : -30,
              scale: 0.98 
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
              duration: 0.4
            }}
          >
            {/* Indicador de carga específico del tab */}
            {(!isPreloaded || transitionState.isContentLoading) && (
              <Box sx={{ mb: 2 }}>
                <LinearProgress 
                  sx={{ 
                    height: 1,
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    '& .MuiLinearProgress-bar': {
                      background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
                    }
                  }} 
                />
              </Box>
            )}
            {children}
          </motion.div>
        )}
      </div>
    );
  };

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
      }}
      cosmicIntensity="intense"
    >
      <Box sx={{ minHeight: '100vh', bgcolor: 'transparent' }}>
      {renderHeader()}
      {renderTabs()}
      {renderSidebar()}

      <EnhancedTabPanel value={tabValue} index={0}>
        <Container maxWidth="xl" sx={{ py: 3 }}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <Grid container spacing={3}>
              {/* Primera fila - Métricas principales */}
              <Grid item xs={12} sm={6} lg={4}>
                <WeeklyProgressWidget />
              </Grid>
              <Grid item xs={12} sm={6} lg={4}>
                <StreakWidget />
              </Grid>
              <Grid item xs={12} sm={12} lg={4}>
                <RankingWidget />
              </Grid>
              
              {/* Segunda fila - Logros y sesión */}
              <Grid item xs={12} lg={8}>
                <UpcomingAchievementsWidget />
              </Grid>
              <Grid item xs={12} lg={4}>
                <SessionStatsWidget />
              </Grid>
              
              {/* Tercera fila - Dashboard dinámico original (opcional) */}
              <Grid item xs={12}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  {dynamicMetricsData?.metrics ? (
                    <DynamicMetricsDashboard
                      metrics={dynamicMetricsData.metrics}
                      progressHistory={dynamicMetricsData.progressHistory || []}
                      categoryProgress={dynamicMetricsData.categoryProgress || []}
                      isLoading={dynamicMetricsData.isLoading || false}
                      showAnimations={dynamicMetricsData.showAnimations || true}
                    />
                  ) : (
                    <Card sx={{ textAlign: 'center', p: 4, background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
                      <CircularProgress size={60} sx={{ color: 'white' }} />
                      <Typography variant="h6" sx={{ mt: 2 }}>
                        Cargando Métricas Avanzadas...
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 1, opacity: 0.9 }}>
                        Analizando tu rendimiento de aprendizaje
                      </Typography>
                    </Card>
                  )}
                </motion.div>
              </Grid>
            </Grid>
          </motion.div>
        </Container>
      </EnhancedTabPanel>

      <EnhancedTabPanel value={tabValue} index={1}>
        {renderVideoLibrary()}
      </EnhancedTabPanel>

      <EnhancedTabPanel value={tabValue} index={2}>
        {renderAchievements()}
      </EnhancedTabPanel>

      <EnhancedTabPanel value={tabValue} index={3}>
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={8}>
              <StudyRoomList />
            </Grid>
            <Grid item xs={12} lg={4}>
              <ChatBox />
            </Grid>
          </Grid>
        </Container>
      </EnhancedTabPanel>

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
};

export default UPlayGamifiedDashboard;
