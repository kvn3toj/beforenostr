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
  Paper,
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
import DynamicMetricsDashboard from './DynamicMetricsDashboard';
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

// [NUEVO] Integración del nuevo componente de gráfica `MinimalistActivityChart`
import MinimalistActivityChart from './components/MinimalistActivityChart';

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

const CompactMetricCard = ({ title, value, icon }: { title: string, value: string | number, icon: React.ReactNode }) => (
  <Paper
    variant="outlined"
    sx={{
      p: 2,
      display: 'flex',
      alignItems: 'center',
      borderRadius: '12px',
      background: '#ffffff',
      borderColor: '#e2e8f0',
    }}
  >
    <Box sx={{ mr: 2, color: '#6366f1' }}>{icon}</Box>
    <Box>
      <Typography sx={{ fontWeight: 600, color: '#1e293b' }}>{value}</Typography>
      <Typography variant="body2" sx={{ color: '#64748b' }}>{title}</Typography>
    </Box>
  </Paper>
);

// ============================================================================
// COMPONENTE PRINCIPAL - VERSIÓN MINIMALISTA
// ============================================================================

export const UPlayGamifiedDashboard: React.FC = () => {
  // Hooks y estado para la funcionalidad que se mantiene
  const { showRewardFeedback } = useUPlayStore();
  const { hideReward } = useRewardFeedback();

  return (
    <Box
      sx={{
        p: { xs: 2, md: 3 },
        backgroundColor: '#f8fafc',
        minHeight: '100vh',
        borderRadius: 4,
      }}
    >
      {/* Header Minimalista */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: 700,
            color: '#1e293b',
          }}
        >
          Dashboard de Actividad
        </Typography>
        <Typography sx={{ color: '#475569', mt: 1, fontSize: '1.1rem' }}>
          Un resumen elegante y directo de tu progreso en CoomÜnity.
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <CompactMetricCard title="Nivel Actual" value="5" icon={<Star />} />
        </Grid>
        <Grid item xs={12} sm={4}>
          <CompactMetricCard title="Racha de Días" value="12" icon={<Whatshot />} />
        </Grid>
        <Grid item xs={12} sm={4}>
          <CompactMetricCard title="Precisión" value="92%" icon={<TrendingUp />} />
        </Grid>
      </Grid>

      <Box sx={{ mb: 4 }}>
        <MinimalistActivityChart />
      </Box>

      {/* El nuevo widget de métricas como protagonista */}
      <Box sx={{ maxWidth: '768px', mx: 'auto' }}>
        <DynamicMetricsDashboard />
      </Box>

      {/* Sistema de feedback de recompensas (se mantiene) */}
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
