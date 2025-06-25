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

// [IMPORT] Añadir AchievementBar para barra de progreso global
import AchievementBar from '../ustats/components/AchievementBar';

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
            sx={{
              position: 'absolute',
              top: 12,
              right: 12,
              fontWeight: 'bold',
              background: 'linear-gradient(90deg, #2563eb 0%, #6c5ce7 100%)',
              color: '#fff',
              px: 2,
              py: 1,
              borderRadius: 2,
              fontSize: '0.9rem',
              boxShadow: '0 2px 8px 0 rgba(108,92,231,0.12)'
            }}
          />
        )}

        <Chip
          label={getDifficultyLabel(video.difficulty)}
          size="small"
          sx={{
            position: 'absolute',
            top: 12,
            left: 12,
            background: 'linear-gradient(90deg, #7e22ce 0%, #2563eb 100%)',
            color: '#fff',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            px: 2,
            py: 1,
            borderRadius: 2,
            fontSize: '0.9rem',
            boxShadow: '0 2px 8px 0 rgba(108,92,231,0.12)'
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
              icon={<Diamond sx={{ fontSize: '16px !important', color: '#a78bfa !important' }} />}
              label={`${video.rewards?.meritos || 0} Mëritos`}
              size="small"
              variant="outlined"
              sx={{ color: '#a78bfa', borderColor: '#a78bfa', fontWeight: 600, px: 2, py: 1, minHeight: 36, borderRadius: 2 }}
            />
            <Chip
              icon={<Bolt sx={{ fontSize: '16px !important', color: '#60a5fa !important' }} />}
              label={`${video.rewards?.ondas || 0} Öndas`}
              size="small"
              variant="outlined"
              sx={{ color: '#60a5fa', borderColor: '#60a5fa', fontWeight: 600, px: 2, py: 1, minHeight: 36, borderRadius: 2 }}
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
                bgcolor: 'rgba(36,50,80,0.18)',
                '& .MuiLinearProgress-bar': {
                  borderRadius: 3,
                  background: video.isCompleted
                    ? 'linear-gradient(90deg, #bfae60 0%, #e5e4e2 100%)' // dorado-plateado
                    : 'linear-gradient(90deg, #2563eb 0%, #6c5ce7 100%)',
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
  const [progress] = useState(65); // Mock data
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      whileHover={{ scale: 1.03, boxShadow: '0 8px 32px 0 rgba(99,102,241,0.18)' }}
    >
      <Card sx={{
        background: 'linear-gradient(135deg, #6366f1 0%, #a78bfa 100%)',
        color: 'white',
        borderRadius: 5,
        boxShadow: '0 4px 24px 0 rgba(99,102,241,0.18)',
        backdropFilter: 'blur(8px)',
        minHeight: 120,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        transition: 'box-shadow 0.2s',
      }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" mb={1}>
            Progreso Semanal
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            {progress}% completado esta semana
          </Typography>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Widget de racha de días consecutivos
const StreakWidget: React.FC = () => {
  const [streak] = useState(7); // Mock data
  const isOnFire = streak >= 3;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      whileHover={{ scale: 1.03, boxShadow: '0 8px 32px 0 rgba(191,174,96,0.18)' }}
    >
      <Card sx={{
        background: isOnFire
          ? 'linear-gradient(135deg, #bfae60 0%, #e5e4e2 100%)'
          : 'linear-gradient(135deg, #6366f1 0%, #a78bfa 100%)',
        color: isOnFire ? '#3d3d3d' : '#fff',
        borderRadius: 5,
        boxShadow: isOnFire
          ? '0 4px 24px 0 rgba(191,174,96,0.18)'
          : '0 4px 24px 0 rgba(99,102,241,0.18)',
        backdropFilter: 'blur(8px)',
        minHeight: 120,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        transition: 'box-shadow 0.2s',
      }}>
        <CardContent>
          <Box display="flex" alignItems="center" gap={2}>
            <motion.div
              animate={isOnFire ? {
                scale: [1, 1.15, 1],
                rotate: [0, 8, -8, 0]
              } : {}}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              {isOnFire ?
                <span style={{ fontSize: 40, filter: 'drop-shadow(0 0 8px #bfae60)' }}>🔥</span> :
                <span style={{ fontSize: 40, filter: 'drop-shadow(0 0 8px #60a5fa)' }}>⚡</span>
              }
            </motion.div>
            <Box>
              <Typography variant="h4" fontWeight="bold">
                {streak}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                {isOnFire ? '¡En racha!' : 'Días consecutivos'}
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
  const [userRank] = useState(12); // Mock data
  const [totalUsers] = useState(156);
  const getRankIcon = (rank: number) => {
    if (rank <= 3) return <span style={{ fontSize: 32, color: '#ffd700' }}>💎</span>;
    if (rank <= 10) return <span style={{ fontSize: 32, color: '#c0c0c0' }}>⭐</span>;
    return <span style={{ fontSize: 32, color: '#cd7f32' }}>📈</span>;
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      whileHover={{ scale: 1.03, boxShadow: '0 8px 32px 0 rgba(99,102,241,0.18)' }}
    >
      <Card sx={{
        background: 'linear-gradient(135deg, #2563eb 0%, #6c5ce7 100%)',
        color: 'white',
        borderRadius: 5,
        boxShadow: '0 4px 24px 0 rgba(99,102,241,0.18)',
        backdropFilter: 'blur(8px)',
        minHeight: 120,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        transition: 'box-shadow 0.2s',
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
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.max(0, (10 - userRank) / 10 * 100)}%` }}
              transition={{ duration: 1.2, ease: 'easeInOut' }}
              style={{ height: 6, borderRadius: 3, background: 'linear-gradient(90deg, #bfae60 0%, #e5e4e2 100%)' }}
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
      whileHover={{ scale: 1.03, boxShadow: '0 8px 32px 0 rgba(124,58,237,0.18)' }}
    >
      <Card sx={{
        background: 'linear-gradient(135deg, #7e22ce 0%, #2563eb 100%)',
        color: 'white',
        borderRadius: 5,
        boxShadow: '0 4px 24px 0 rgba(124,58,237,0.18)',
        backdropFilter: 'blur(8px)',
        minHeight: 120,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        transition: 'box-shadow 0.2s',
      }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" mb={2}>
            ✨ Próximos Logros
          </Typography>
          {upcomingAchievements.map((achievement, index) => (
            <Box key={index} mb={index < upcomingAchievements.length - 1 ? 2 : 0}>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <motion.span
                  whileHover={{ scale: 1.2, rotate: 8 }}
                  style={{ fontSize: 20 }}
                >{achievement.icon}</motion.span>
                <Typography variant="body2" fontWeight="medium">
                  {achievement.name}
                </Typography>
              </Box>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${achievement.progress}%` }}
                transition={{ duration: 1.2, ease: 'easeInOut' }}
                style={{ height: 4, borderRadius: 2, background: 'linear-gradient(90deg, #bfae60 0%, #e5e4e2 100%)' }}
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
  const [sessionTime] = useState(0);
  const [videosWatched] = useState(3);
  const [questionsAnswered] = useState(12);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      whileHover={{ scale: 1.03, boxShadow: '0 8px 32px 0 rgba(99,102,241,0.18)' }}
    >
      <Card sx={{
        background: 'linear-gradient(135deg, #2563eb 0%, #6c5ce7 100%)',
        color: 'white',
        borderRadius: 5,
        boxShadow: '0 4px 24px 0 rgba(99,102,241,0.18)',
        backdropFilter: 'blur(8px)',
        minHeight: 120,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        transition: 'box-shadow 0.2s',
      }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" mb={2}>
            <motion.span
              animate={{ scale: [1, 1.15, 1], rotate: [0, 8, -8, 0] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
              style={{ display: 'inline-block', marginRight: 8 }}
            >📺</motion.span>
            Sesión Actual
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <Box textAlign="center">
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1.2 }}
                  style={{ fontSize: 24, fontWeight: 700 }}
                >{sessionTime}m</motion.span>
                <Typography variant="caption">Tiempo</Typography>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box textAlign="center">
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1.2, delay: 0.2 }}
                  style={{ fontSize: 24, fontWeight: 700 }}
                >{videosWatched}</motion.span>
                <Typography variant="caption">Videos</Typography>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box textAlign="center">
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1.2, delay: 0.4 }}
                  style={{ fontSize: 24, fontWeight: 700 }}
                >{questionsAnswered}</motion.span>
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

  // --- MÉTRICAS RÁPIDAS ---
  const metrics = dynamicMetricsData.metrics;

  // --- Definición de tabs cósmicos ---
  const dashboardTabs = [
    { label: 'Dashboard', icon: <Dashboard />, id: 0 },
    { label: 'Videoteca', icon: <VideoLibrary />, id: 1 },
    { label: 'Logros', icon: <EmojiEvents />, id: 2 },
    { label: 'Salas de Estudio', icon: <Groups />, id: 3 },
  ];

  return (
    <Box
      sx={{
        p: { xs: 2, md: 6 },
        background: 'linear-gradient(135deg, #181829 0%, #232347 100%)',
        minHeight: '100vh',
        borderRadius: 8,
        boxShadow: '0 0 64px 0 #232347cc, 0 0 0 8px #e5e4e244',
        position: 'relative',
        overflow: 'hidden',
        mt: 2,
        mb: 6,
        '::before': {
          content: '""',
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          background: 'radial-gradient(circle at 60% 0%, #e5e4e222 0%, transparent 80%)',
          pointerEvents: 'none',
        },
      }}
    >
      {/* Header refinado */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            color: '#e5e4e2',
            letterSpacing: 2,
            textShadow: '0 2px 16px #6366f1cc',
          }}
        >
          🚀 Dashboard Cósmico
        </Typography>
        <Typography sx={{ color: '#e5e4e2cc', fontSize: 18, mb: 2, letterSpacing: 1 }}>
          ¡Bienvenido a tu centro de evolución! Aquí puedes visualizar tu progreso, recompensas y próximos desafíos en tu viaje por el Bien Común.
        </Typography>
      </Box>
      {/* Barra de progreso global refinada */}
      <Box sx={{ mt: 2, mb: 4, display: 'flex', justifyContent: 'center' }}>
        <Card sx={{
          background: 'linear-gradient(135deg, #232347 0%, #2d225a 100%)',
          color: '#e5e4e2',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 4px 24px 0 #23234788',
          borderRadius: 6,
          p: 2,
          minWidth: 320,
          maxWidth: 420,
          border: '1.5px solid #e5e4e244',
        }}>
          <CardContent sx={{ pb: '8px !important' }}>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography variant="subtitle1" fontWeight="bold" color="#e5e4e2">
                  Nivel {dynamicMetricsData.metrics.nivel}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9, color: '#e5e4e2' }}>
                  Progreso hacia el siguiente nivel
                </Typography>
              </Box>
            </Box>
            <Box sx={{ mt: 2 }}>
              <LinearProgress
                variant="determinate"
                value={dynamicMetricsData.metrics.precision}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  bgcolor: '#232347',
                  '& .MuiLinearProgress-bar': {
                    bgcolor: 'linear-gradient(90deg, #e5e4e2 0%, #bfc9ca 100%)',
                    boxShadow: '0 0 8px #e5e4e288',
                  },
                }}
              />
            </Box>
          </CardContent>
        </Card>
      </Box>
      {/* Métricas rápidas refinadas */}
      <Box display="flex" flexWrap="wrap" gap={2} mt={3} justifyContent="center">
        {[
          { label: 'Mëritos', value: dynamicMetricsData.metrics.meritos, icon: '🏆', color: 'linear-gradient(90deg, #bfc9ca 0%, #e5e4e2 100%)' },
          { label: 'Öndas', value: dynamicMetricsData.metrics.ondas, icon: '⚡', color: 'linear-gradient(90deg, #232347 0%, #6366f1 100%)' },
          { label: 'Precisión', value: dynamicMetricsData.metrics.precision + '%', icon: '🎯', color: 'linear-gradient(90deg, #232347 0%, #8b5cf6 100%)' },
          { label: 'Racha', value: dynamicMetricsData.metrics.racha, icon: '🔥', color: 'linear-gradient(90deg, #bfc9ca 0%, #e5e4e2 100%)' },
          { label: 'Logros', value: dynamicMetricsData.metrics.logrosDesbloqueados, icon: '🏅', color: 'linear-gradient(90deg, #a1a1aa 0%, #e5e4e2 100%)' },
          { label: 'Ranking', value: '#' + dynamicMetricsData.metrics.rankingComunidad, icon: '⭐', color: 'linear-gradient(90deg, #232347 0%, #e5e4e2 100%)' },
        ].map((item, idx) => (
          <Box key={item.label} sx={{
            minWidth: 90,
            minHeight: 70,
            px: 2,
            py: 1.5,
            borderRadius: 6,
            background: item.color,
            boxShadow: '0 2px 8px 0 #23234744',
            textAlign: 'center',
            color: '#e5e4e2',
            border: '1.5px solid #e5e4e244',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: 18,
            letterSpacing: 1,
            transition: 'box-shadow 0.22s, transform 0.18s',
            '&:hover': {
              boxShadow: '0 8px 32px 0 #e5e4e288',
              transform: 'scale(1.04)',
            },
            '&:focus': {
              outline: '2px solid #e5e4e2',
              boxShadow: '0 0 0 6px #e5e4e244',
            },
          }}>
            <span style={{ fontSize: 28, marginBottom: 4, filter: 'drop-shadow(0 0 6px #e5e4e288)' }}>{item.icon}</span>
            <Typography variant="h5" fontWeight="bold" color="#e5e4e2">{item.value}</Typography>
            <Typography fontSize={13} color="#bfc9ca">{item.label}</Typography>
          </Box>
        ))}
      </Box>
      {/* Widgets refinados */}
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <Grid container spacing={4}>
            <Grid item xs={12} sm={6} lg={4}><WeeklyProgressWidget /></Grid>
            <Grid item xs={12} sm={6} lg={4}><StreakWidget /></Grid>
            <Grid item xs={12} sm={6} lg={4}><RankingWidget /></Grid>
            <Grid item xs={12} md={8}><UpcomingAchievementsWidget /></Grid>
            <Grid item xs={12} md={4}><SessionStatsWidget /></Grid>
            <Grid item xs={12}><DynamicMetricsDashboard metrics={dynamicMetricsData.metrics} progressHistory={dynamicMetricsData.progressHistory} categoryProgress={dynamicMetricsData.categoryProgress} isLoading={dynamicMetricsData.isLoading} showAnimations={dynamicMetricsData.showAnimations} /></Grid>
          </Grid>
        </motion.div>
      </Container>
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
  );
};

export default UPlayGamifiedDashboard;
