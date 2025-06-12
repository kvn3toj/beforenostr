import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  IconButton,
  Paper,
  Tabs,
  Tab,
  Avatar,
  LinearProgress,
  Chip,
  AppBar,
  Toolbar,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  Fade,
  Zoom,
  useTheme,
  useMediaQuery,
  Tooltip,
  Badge,
  CircularProgress,
  Divider,
  Skeleton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Collapse,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  Quiz as QuizIcon,
  EmojiEvents as TrophyIcon,
  Star as StarIcon,
  VideogameAsset as GameIcon,
  CheckCircle as CheckIcon,
  Timer as TimerIcon,
  TrendingUp as TrendingIcon,
  School as LearnIcon,
  Bolt as BoltIcon,
  LocalFireDepartment as FireIcon,
  Diamond as DiamondIcon,
  Psychology as PsychologyIcon,
  Lightbulb as InsightIcon,
  Speed as SpeedIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  BookmarkBorder as BookmarkIcon,
  Share as ShareIcon,
  Comment as CommentIcon,
  PlaylistAdd as PlaylistAddIcon,
  Favorite as FavoriteIcon,
  Person as PersonIcon,
  Notifications as NotificationsIcon,
  Message as MessageIcon,
  Search as SearchIcon,
  Menu as MenuIcon,
  FullscreenExit as FullscreenExitIcon,
} from '@mui/icons-material';

// 🔗 Conexión con el backend real
import {
  useVideos,
  useVideoCategories,
} from '../../../hooks/useRealBackendData';

// ✅ Importar el InteractiveVideoPlayer actualizado
import InteractiveVideoPlayer from './components/InteractiveVideoPlayer';

// 📱 Importar la versión móvil
import UPlayMobileHome from './UPlayMobileHome';

// 🎮 Importar hooks de datos mock para playlists
import {
  useUPlayMockData,
  MockVideo,
  MockPlaylist,
} from '../../../hooks/useUPlayMockData';

// 🏷️ Tipos de datos reales del backend
interface RealVideoData {
  id: number;
  title: string;
  description: string;
  duration: number;
  thumbnailUrl?: string;
  url: string;
  platform: string;
  externalId: string;
  categories: string;
  tags: string;
  questions: QuestionData[];
  playlist: PlaylistData;
}

interface QuestionData {
  id: number;
  videoItemId: number;
  timestamp: number;
  endTimestamp: number;
  type: 'multiple-choice' | 'true-false' | 'open-text';
  text: string;
  languageCode: string;
  isActive: boolean;
}

interface PlaylistData {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
}

// 🎮 Enhanced Game State (similar to mobile version)
interface EnhancedGameState {
  // Core metrics
  score: number;
  merits: number;
  ondas: number;
  questionsAnswered: number;
  correctAnswers: number;
  currentStreak: number;
  maxStreak: number;
  level: number;
  experience: number;
  experienceToNext: number;

  // Advanced metrics
  totalWatchTime: number;
  videosCompleted: number;
  averageEngagement: number;
  achievements: Achievement[];
  badges: Badge[];

  // Session metrics
  sessionStartTime: Date;
  sessionWatchTime: number;
  sessionsThisWeek: number;
  weeklyGoal: number;
  ranking: number;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  earnedAt: Date;
  meritsReward: number;
}

interface Badge {
  id: string;
  name: string;
  icon: string;
  progress: number;
  maxProgress: number;
  category: string;
}

// Enhanced Video Progress Interface
interface VideoProgress {
  videoId: number;
  progress: number;
  completed: boolean;
  questionsAnswered: number;
  totalQuestions: number;
  meritsEarned: number;
  lastWatched: Date;
}

// Enhanced placeholder component (similar to mobile)
const VideoThumbnail: React.FC<{
  width: number | string;
  height: number | string;
  progress?: number;
  isPlaying?: boolean;
}> = ({ width, height, progress = 0, isPlaying = false }) => (
  <Box
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
      background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
    }}
  >
    {/* Enhanced geometric shapes */}
    <Box
      sx={{
        position: 'absolute',
        top: '25%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 0,
        height: 0,
        borderLeft: '20px solid transparent',
        borderRight: '20px solid transparent',
        borderBottom: '35px solid #94a3b8',
        opacity: 0.7,
      }}
    />
    <Box
      sx={{
        position: 'absolute',
        bottom: '25%',
        left: '30%',
        width: '16px',
        height: '20px',
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
        width: '22px',
        height: '22px',
        backgroundColor: '#475569',
        borderRadius: '50%',
        opacity: 0.6,
      }}
    />

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
          width: 48,
          height: 48,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <PlayIcon sx={{ color: 'white', fontSize: 28 }} />
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
          height: 4,
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
  </Box>
);

// Enhanced video card for horizontal lists (desktop adaptation)
const EnhancedVideoCard: React.FC<{
  video: MockVideo;
  onClick?: () => void;
  progress?: VideoProgress;
  size?: 'small' | 'medium';
}> = ({ video, onClick, progress, size = 'medium' }) => {
  const cardWidth = size === 'small' ? 180 : 220;
  const cardHeight = size === 'small' ? 100 : 124;

  return (
    <Box
      sx={{
        width: cardWidth,
        flexShrink: 0,
        cursor: onClick ? 'pointer' : 'default',
        transition: 'transform 0.2s ease-in-out',
        '&:hover': onClick
          ? {
              transform: 'translateY(-6px) scale(1.02)',
            }
          : {},
      }}
      onClick={onClick}
    >
      <Box sx={{ position: 'relative' }}>
        <VideoThumbnail
          width={cardWidth}
          height={cardHeight}
          progress={progress?.progress || 0}
          isPlaying={false}
        />

        {/* Video duration */}
        <Chip
          label={`${Math.floor(video.duration / 60)}:${(video.duration % 60).toString().padStart(2, '0')}`}
          size="small"
          sx={{
            position: 'absolute',
            bottom: 8,
            right: 8,
            backgroundColor: 'rgba(0,0,0,0.8)',
            color: 'white',
            fontSize: '10px',
            height: 20,
          }}
        />

        {/* Questions indicator */}
        {progress?.totalQuestions && (
          <Badge
            badgeContent={progress.totalQuestions}
            color="secondary"
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              '& .MuiBadge-badge': {
                fontSize: '9px',
                height: 16,
                minWidth: 16,
              },
            }}
          >
            <QuizIcon sx={{ color: 'white', fontSize: 16 }} />
          </Badge>
        )}
      </Box>

      <Box sx={{ mt: 2, px: 0.5 }}>
        <Typography
          variant="body2"
          sx={{
            color: '#1e293b',
            fontFamily: 'Roboto',
            fontSize: size === 'small' ? '13px' : '14px',
            fontWeight: 600,
            lineHeight: 1.3,
            mb: 0.5,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {video.title}
        </Typography>

        <Typography
          variant="caption"
          sx={{
            color: '#64748b',
            fontFamily: 'Roboto',
            fontSize: '12px',
            fontWeight: 400,
            lineHeight: 1.2,
            display: 'block',
            mb: 1,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {video.description}
        </Typography>

        {/* Progress and rewards */}
        {progress && (
          <Stack direction="row" spacing={0.5} alignItems="center">
            <Chip
              icon={<DiamondIcon />}
              label={`+${progress.meritsEarned}`}
              size="small"
              sx={{
                height: 18,
                fontSize: '9px',
                backgroundColor: '#fef3c7',
                color: '#92400e',
                '& .MuiChip-icon': { fontSize: 10 },
              }}
            />
            {progress.completed && (
              <Chip
                icon={<TrophyIcon />}
                label="✓"
                size="small"
                sx={{
                  height: 18,
                  fontSize: '9px',
                  backgroundColor: '#d1fae5',
                  color: '#065f46',
                  '& .MuiChip-icon': { fontSize: 10 },
                }}
              />
            )}
          </Stack>
        )}
      </Box>
    </Box>
  );
};

// Enhanced status chip (mobile style adapted for desktop)
const EnhancedStatusChip: React.FC<{
  icon: React.ReactNode;
  label: string;
  value?: string | number;
  color?: 'primary' | 'secondary' | 'warning' | 'error' | 'success';
}> = ({ icon, label, value, color = 'primary' }) => (
  <Chip
    icon={
      <Avatar
        sx={{
          width: 24,
          height: 24,
          backgroundColor:
            color === 'primary'
              ? '#6366f1'
              : color === 'warning'
                ? '#f59e0b'
                : color === 'success'
                  ? '#10b981'
                  : color === 'error'
                    ? '#ef4444'
                    : '#8b5cf6',
        }}
      >
        {icon}
      </Avatar>
    }
    label={value ? `${label}: ${value}` : label}
    variant="outlined"
    size="medium"
    sx={{
      borderColor:
        color === 'primary'
          ? '#6366f1'
          : color === 'warning'
            ? '#f59e0b'
            : color === 'success'
              ? '#10b981'
              : color === 'error'
                ? '#ef4444'
                : '#8b5cf6',
      color: '#1e293b',
      fontFamily: 'Roboto',
      fontSize: '14px',
      fontWeight: 600,
      height: 36,
      '& .MuiChip-label': {
        paddingLeft: 1,
      },
    }}
  />
);

const UPlayMain: React.FC = () => {
  // 📱 Detección de dispositivo móvil
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // 🎛️ Estados del reproductor
  const [activeTab, setActiveTab] = useState(0);
  const [currentVideo, setCurrentVideo] = useState<RealVideoData | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  // 🎯 Estados de preguntas
  const [questionDialogOpen, setQuestionDialogOpen] = useState(false);
  const [activeQuestion, setActiveQuestion] = useState<QuestionData | null>(
    null
  );
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(false);

  // 🎮 Enhanced Game State (mobile style)
  const [gameState, setGameState] = useState<EnhancedGameState>({
    score: 0,
    merits: 2350,
    ondas: 1680,
    questionsAnswered: 45,
    correctAnswers: 38,
    currentStreak: 3,
    maxStreak: 12,
    level: 7,
    experience: 2150,
    experienceToNext: 850,
    totalWatchTime: 45600,
    videosCompleted: 28,
    averageEngagement: 0.84,
    achievements: [
      {
        id: 'first_video',
        name: 'Primer Paso',
        description: 'Completaste tu primer video',
        icon: '🎯',
        rarity: 'common',
        earnedAt: new Date(),
        meritsReward: 50,
      },
      {
        id: 'week_streak',
        name: 'Dedicación Semanal',
        description: 'Viste videos 7 días seguidos',
        icon: '🔥',
        rarity: 'rare',
        earnedAt: new Date(),
        meritsReward: 200,
      },
    ],
    badges: [
      {
        id: 'scholar',
        name: 'Erudito',
        icon: '📚',
        progress: 7,
        maxProgress: 10,
        category: 'learning',
      },
      {
        id: 'questioner',
        name: 'Cuestionador',
        icon: '❓',
        progress: 15,
        maxProgress: 25,
        category: 'engagement',
      },
    ],
    sessionStartTime: new Date(),
    sessionWatchTime: 0,
    sessionsThisWeek: 4,
    weeklyGoal: 7,
    ranking: 47,
  });

  // 🔔 Estados de feedback y UI
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    'success' | 'error' | 'info'
  >('info');
  const [showAchievement, setShowAchievement] = useState<Achievement | null>(
    null
  );
  const [showDetailedStats, setShowDetailedStats] = useState(false);

  // 🔗 Hooks de datos reales del backend
  const {
    data: videosData,
    isLoading: videosLoading,
    error: videosError,
  } = useVideos();
  const { data: categoriesData } = useVideoCategories();

  // 🎮 Hook para datos mock de playlists
  const {
    isLoading: playlistsLoading,
    continueWatching,
    staffPlaylists,
    myPlaylists,
    createdPlaylist,
    formatDuration,
    getProgressText,
  } = useUPlayMockData();

  // 🎬 Procesar datos de videos del backend
  const realVideos: RealVideoData[] = videosData || [];

  // Enhanced mock video progress for desktop
  const mockVideoProgress: VideoProgress[] = [
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
    {
      videoId: 3,
      progress: 60,
      completed: false,
      questionsAnswered: 4,
      totalQuestions: 6,
      meritsEarned: 60,
      lastWatched: new Date(Date.now() - 43200000),
    },
    {
      videoId: 4,
      progress: 20,
      completed: false,
      questionsAnswered: 1,
      totalQuestions: 8,
      meritsEarned: 15,
      lastWatched: new Date(Date.now() - 172800000),
    },
  ];

  // 🎮 Enhanced gamification functions
  const handlePlayVideo = (video: RealVideoData) => {
    setCurrentVideo(video);
    setCurrentTime(0);
    setProgress(0);
    setIsPlaying(true);

    setGameState((prev) => ({
      ...prev,
      sessionStartTime: new Date(),
    }));

    showSnackbar(
      `🎬 Reproduciendo "${video.title}" | Prepárate para las preguntas interactivas 🎯`,
      'info'
    );
  };

  const handlePlayMockVideo = (video: MockVideo) => {
    console.log('Playing mock video:', video.title);
    showSnackbar(
      `🎬 Reproduciendo "${video.title}" | Demo interactivo 🎯`,
      'info'
    );
  };

  const handleAnswerQuestion = (answer: string) => {
    setSelectedAnswer(answer);
    setShowAnswer(true);

    const isCorrect = Math.random() > 0.25;
    setIsAnswerCorrect(isCorrect);

    setGameState((prev) => {
      const newQuestionsAnswered = prev.questionsAnswered + 1;
      const newCorrectAnswers = isCorrect
        ? prev.correctAnswers + 1
        : prev.correctAnswers;
      const newStreak = isCorrect ? prev.currentStreak + 1 : 0;
      const newMaxStreak = Math.max(prev.maxStreak, newStreak);

      const baseReward = isCorrect ? 15 : 5;
      const streakBonus = newStreak * 3;
      const speedBonus = playbackSpeed > 1 ? 5 : 0;
      const meritsEarned = baseReward + streakBonus + speedBonus;
      const newMerits = prev.merits + meritsEarned;

      const baseXP = isCorrect ? 35 : 10;
      const streakXP = newStreak * 8;
      const engagementXP = 5;
      const expEarned = baseXP + streakXP + engagementXP;
      const newExperience = prev.experience + expEarned;
      const newLevel = Math.floor(newExperience / 1000) + 1;
      const experienceToNext = newLevel * 1000 - newExperience;

      const newAverageEngagement =
        (prev.averageEngagement + (isCorrect ? 1 : 0.5)) / 2;

      return {
        ...prev,
        questionsAnswered: newQuestionsAnswered,
        correctAnswers: newCorrectAnswers,
        currentStreak: newStreak,
        maxStreak: newMaxStreak,
        merits: newMerits,
        experience: newExperience,
        experienceToNext,
        level: newLevel,
        score: newCorrectAnswers * 15 + newStreak * 8,
        averageEngagement: newAverageEngagement,
      };
    });

    if (isCorrect) {
      const streakMessage =
        gameState.currentStreak > 0
          ? ` | 🔥 Racha x${gameState.currentStreak + 1}`
          : '';
      showSnackbar(
        `✅ ¡Excelente! +${15 + gameState.currentStreak * 3} Mëritos${streakMessage}`,
        'success'
      );
    } else {
      showSnackbar('💪 ¡Sigue aprendiendo! +10 EXP por participar', 'error');
    }
  };

  const closeQuestionDialog = () => {
    setQuestionDialogOpen(false);
    setActiveQuestion(null);
    setSelectedAnswer('');
    setShowAnswer(false);
    setIsAnswerCorrect(false);

    setTimeout(() => {
      setIsPlaying(true);
    }, 1000);
  };

  const showSnackbar = (
    message: string,
    severity: 'success' | 'error' | 'info'
  ) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  // 🎨 Mobile-Style Header for Desktop
  const MobileStyleHeader = () => (
    <Box>
      {/* Status Bar (mobile style) */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          height: 44,
          px: 3,
          py: 1,
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
          color: 'white',
        }}
      >
        <Typography
          sx={{
            fontFamily: 'Roboto',
            fontSize: '14px',
            fontWeight: 600,
            lineHeight: '16px',
          }}
        >
          {new Date().toLocaleTimeString()}
        </Typography>

        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Badge badgeContent={gameState.currentStreak} color="error">
            <FireIcon sx={{ fontSize: 16 }} />
          </Badge>
          <Typography sx={{ fontSize: '12px', fontWeight: 500 }}>
            🔋 ÜPlay Desktop
          </Typography>
        </Box>
      </Box>

      {/* Enhanced Top App Bar (mobile style) */}
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
          color: 'white',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <Toolbar sx={{ minHeight: 80, px: 3 }}>
          <IconButton edge="start" sx={{ mr: 2, color: 'white' }}>
            <MenuIcon />
          </IconButton>

          <Box sx={{ flexGrow: 1 }}>
            <Typography
              variant="h5"
              component="h1"
              sx={{
                fontFamily: 'Roboto',
                fontSize: '28px',
                fontWeight: 700,
                lineHeight: '32px',
                mb: 0.5,
              }}
            >
              ÜPlay
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontSize: '13px',
                opacity: 0.9,
                fontWeight: 500,
              }}
            >
              Reproductor Gamificado • Nivel {gameState.level} •{' '}
              {gameState.videosCompleted} completados
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
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
    </Box>
  );

  // Enhanced Stats Panel (mobile style)
  const MobileStyleStatsPanel = () => (
    <Box sx={{ mb: 3 }}>
      {/* Player metrics summary */}
      <Stack direction="row" spacing={2} sx={{ mb: 3, flexWrap: 'wrap' }}>
        <Chip
          icon={<StarIcon />}
          label={`Nivel ${gameState.level}`}
          size="medium"
          color="secondary"
          sx={{
            fontWeight: 600,
            fontSize: '14px',
            height: 36,
            background: 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)',
            color: 'white',
            border: 'none',
          }}
        />
        <Chip
          icon={<DiamondIcon />}
          label={`${gameState.merits.toLocaleString()} Mëritos`}
          size="medium"
          sx={{
            fontWeight: 600,
            fontSize: '14px',
            height: 36,
            background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
            color: 'white',
            border: 'none',
          }}
        />
        <Chip
          icon={<BoltIcon />}
          label={`${gameState.ondas} Öndas`}
          size="medium"
          sx={{
            fontWeight: 600,
            fontSize: '14px',
            height: 36,
            background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
            color: 'white',
            border: 'none',
          }}
        />
        <Chip
          icon={<TrophyIcon />}
          label={`Ranking #${gameState.ranking}`}
          size="medium"
          sx={{
            fontWeight: 600,
            fontSize: '14px',
            height: 36,
            background: 'linear-gradient(135deg, #ef4444 0%, #f87171 100%)',
            color: 'white',
            border: 'none',
          }}
        />
      </Stack>

      {/* XP Progress */}
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            Progreso al Nivel {gameState.level + 1}
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {gameState.experience}/
            {gameState.experience + gameState.experienceToNext}
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={
            (gameState.experience /
              (gameState.experience + gameState.experienceToNext)) *
            100
          }
          sx={{
            height: 10,
            borderRadius: 5,
            bgcolor: '#e2e8f0',
            '& .MuiLinearProgress-bar': {
              borderRadius: 5,
              background: 'linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%)',
            },
          }}
        />
      </Box>

      {/* Stats Toggle Button */}
      <Button
        variant="outlined"
        onClick={() => setShowDetailedStats(!showDetailedStats)}
        startIcon={<TrendingIcon />}
        endIcon={showDetailedStats ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        fullWidth
        sx={{
          borderColor: '#6366f1',
          color: '#6366f1',
          fontWeight: 600,
          borderRadius: 3,
          py: 1.5,
          '&:hover': {
            background: 'rgba(99, 102, 241, 0.05)',
          },
        }}
      >
        {showDetailedStats
          ? 'Ocultar Estadísticas'
          : 'Ver Estadísticas Detalladas'}
      </Button>
    </Box>
  );

  // Enhanced Continue Watching (mobile style for desktop)
  const MobileStyleContinueWatching = () => (
    <Box sx={{ mb: 4 }}>
      <Typography
        sx={{
          color: '#1e293b',
          fontFamily: 'Roboto',
          fontSize: '18px',
          fontWeight: 700,
          lineHeight: '24px',
          mb: 2,
        }}
      >
        📺 Continuar viendo
      </Typography>

      <Card
        sx={{
          borderRadius: 4,
          overflow: 'hidden',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-6px)',
            boxShadow: '0 16px 48px rgba(0,0,0,0.15)',
          },
          mb: 2,
        }}
        onClick={() => currentVideo && handlePlayVideo(currentVideo)}
      >
        <Box sx={{ position: 'relative' }}>
          <VideoThumbnail width="100%" height={280} progress={35} />

          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              background:
                'linear-gradient(135deg, rgba(99, 102, 241, 0.9) 0%, rgba(139, 92, 246, 0.9) 100%)',
              borderRadius: '50%',
              width: 80,
              height: 80,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 32px rgba(99, 102, 241, 0.4)',
            }}
          >
            <PlayIcon sx={{ color: 'white', fontSize: 40 }} />
          </Box>

          <Box
            sx={{
              position: 'absolute',
              top: 20,
              right: 20,
              display: 'flex',
              gap: 1,
            }}
          >
            <Chip
              label={
                currentVideo
                  ? `${Math.floor(currentVideo.duration / 60)}:${(currentVideo.duration % 60).toString().padStart(2, '0')}`
                  : '10:30'
              }
              size="small"
              sx={{
                backgroundColor: 'rgba(0,0,0,0.8)',
                color: 'white',
                fontWeight: 600,
              }}
            />
            <Chip
              label="35%"
              size="small"
              sx={{
                backgroundColor: 'rgba(99, 102, 241, 0.9)',
                color: 'white',
                fontWeight: 600,
              }}
            />
          </Box>

          <Box
            sx={{
              position: 'absolute',
              top: 20,
              left: 20,
            }}
          >
            <Badge badgeContent={7} color="warning">
              <Chip
                icon={<QuizIcon />}
                label="Preguntas"
                size="small"
                sx={{
                  backgroundColor: 'rgba(0,0,0,0.8)',
                  color: 'white',
                  fontWeight: 600,
                  '& .MuiChip-icon': { color: 'white' },
                }}
              />
            </Badge>
          </Box>
        </Box>
      </Card>

      <Card sx={{ borderRadius: 3, p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            <CircularProgress
              variant="determinate"
              value={35}
              size={64}
              thickness={4}
              sx={{
                color: '#6366f1',
                filter: 'drop-shadow(0 2px 8px rgba(99, 102, 241, 0.3))',
              }}
            />
            <Box
              sx={{
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                position: 'absolute',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography
                variant="h6"
                component="div"
                sx={{ fontWeight: 700, color: '#6366f1' }}
              >
                35%
              </Typography>
            </Box>
          </Box>

          <Box sx={{ flex: 1 }}>
            <Typography
              sx={{
                color: '#1e293b',
                fontFamily: 'Roboto',
                fontSize: '18px',
                fontWeight: 700,
                lineHeight: '24px',
                mb: 1,
              }}
            >
              {currentVideo ? currentVideo.title : 'Introducción a CoomÜnity'}
            </Typography>
            <Typography
              sx={{
                color: '#64748b',
                fontFamily: 'Roboto',
                fontSize: '14px',
                fontWeight: 400,
                lineHeight: '20px',
                mb: 2,
              }}
            >
              {currentVideo
                ? currentVideo.description
                : 'Aprende los conceptos básicos de nuestra plataforma...'}
            </Typography>

            <Stack direction="row" spacing={1} flexWrap="wrap">
              <Chip
                icon={<DiamondIcon />}
                label="+65 Mëritos"
                size="small"
                sx={{
                  backgroundColor: '#fef3c7',
                  color: '#92400e',
                  fontWeight: 600,
                  '& .MuiChip-icon': { color: '#f59e0b' },
                }}
              />
              <Chip
                icon={<BoltIcon />}
                label="+21 Öndas"
                size="small"
                sx={{
                  backgroundColor: '#dcfce7',
                  color: '#166534',
                  fontWeight: 600,
                  '& .MuiChip-icon': { color: '#10b981' },
                }}
              />
              <Chip
                label="3/7 preguntas"
                size="small"
                sx={{
                  backgroundColor: '#e0e7ff',
                  color: '#3730a3',
                  fontWeight: 600,
                }}
              />
            </Stack>
          </Box>

          <Stack direction="column" spacing={1}>
            <IconButton
              size="small"
              sx={{
                bgcolor: '#fef3c7',
                color: '#92400e',
                '&:hover': { bgcolor: '#fed7aa' },
              }}
            >
              <BookmarkIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              sx={{
                bgcolor: '#ddd6fe',
                color: '#5b21b6',
                '&:hover': { bgcolor: '#c4b5fd' },
              }}
            >
              <ShareIcon fontSize="small" />
            </IconButton>
          </Stack>
        </Box>
      </Card>
    </Box>
  );

  // Enhanced Staff Playlists Section (mobile style for desktop)
  const StaffPlaylistsSection = () => (
    <Box sx={{ mb: 4 }}>
      <Typography
        sx={{
          color: '#1e293b',
          fontFamily: 'Roboto',
          fontSize: '18px',
          fontWeight: 700,
          lineHeight: '24px',
          mb: 3,
        }}
      >
        🌟 Playlists del Staff
      </Typography>

      <Stack direction="row" spacing={3} sx={{ overflowX: 'auto', pb: 2 }}>
        {staffPlaylists.map((video) => (
          <EnhancedVideoCard
            key={video.id}
            video={video}
            onClick={() => handlePlayMockVideo(video)}
            progress={mockVideoProgress.find((p) => p.videoId === video.id)}
            size="medium"
          />
        ))}
      </Stack>
    </Box>
  );

  // Enhanced My Playlists Section (mobile style for desktop)
  const MyPlaylistsSection = () => (
    <Box sx={{ mb: 4 }}>
      <Typography
        sx={{
          color: '#1e293b',
          fontFamily: 'Roboto',
          fontSize: '18px',
          fontWeight: 700,
          lineHeight: '24px',
          mb: 3,
        }}
      >
        📚 Mis playlists
      </Typography>

      <Stack
        direction="row"
        spacing={3}
        sx={{ overflowX: 'auto', pb: 2, mb: 3 }}
      >
        {myPlaylists.map((video) => (
          <EnhancedVideoCard
            key={video.id}
            video={video}
            onClick={() => handlePlayMockVideo(video)}
            progress={mockVideoProgress.find((p) => p.videoId === video.id)}
            size="medium"
          />
        ))}
      </Stack>

      {/* Enhanced Created Playlist Card */}
      <Card
        sx={{
          borderRadius: 4,
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
          },
          border: '1px solid #e2e8f0',
        }}
        onClick={() => console.log('Opening playlist:', createdPlaylist.name)}
      >
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            {/* Enhanced Playlist Icon */}
            <Box
              sx={{
                width: 80,
                height: 80,
                position: 'relative',
                borderRadius: 3,
                overflow: 'hidden',
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: 40,
                  height: 40,
                  background:
                    'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: 40,
                  height: 40,
                  background:
                    'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: 40,
                  height: 40,
                  background:
                    'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  width: 40,
                  height: 40,
                  background:
                    'linear-gradient(135deg, #ef4444 0%, #f87171 100%)',
                }}
              />
            </Box>

            {/* Enhanced Playlist Info */}
            <Box sx={{ flex: 1 }}>
              <Typography
                sx={{
                  color: '#1e293b',
                  fontFamily: 'Montserrat',
                  fontSize: '18px',
                  fontWeight: 700,
                  lineHeight: 'normal',
                  mb: 1,
                }}
              >
                {createdPlaylist.name}
              </Typography>
              <Typography
                sx={{
                  color: '#64748b',
                  fontFamily: 'Montserrat',
                  fontSize: '14px',
                  fontWeight: 400,
                  lineHeight: 'normal',
                  mb: 2,
                }}
              >
                {createdPlaylist.videoCount} Videos • Personal • Actualizada
                ayer
              </Typography>
              <Stack direction="row" spacing={1}>
                <Chip
                  icon={<DiamondIcon />}
                  label={createdPlaylist.merits}
                  size="medium"
                  sx={{
                    backgroundColor: '#fef3c7',
                    color: '#92400e',
                    fontWeight: 600,
                    '& .MuiChip-icon': { color: '#f59e0b' },
                  }}
                />
                <Chip
                  icon={<LearnIcon />}
                  label="Aprendizaje"
                  size="medium"
                  sx={{
                    backgroundColor: '#e0e7ff',
                    color: '#3730a3',
                    fontWeight: 600,
                    '& .MuiChip-icon': { color: '#6366f1' },
                  }}
                />
                <Chip
                  label="Favorito"
                  size="medium"
                  sx={{
                    backgroundColor: '#fecaca',
                    color: '#991b1b',
                    fontWeight: 600,
                  }}
                />
              </Stack>
            </Box>

            {/* Playlist actions */}
            <Stack direction="row" spacing={1}>
              <IconButton
                sx={{
                  bgcolor: '#f1f5f9',
                  color: '#6366f1',
                  '&:hover': { bgcolor: '#e2e8f0' },
                  width: 48,
                  height: 48,
                }}
              >
                <PlayIcon />
              </IconButton>
              <IconButton
                sx={{
                  bgcolor: '#f1f5f9',
                  color: '#64748b',
                  '&:hover': { bgcolor: '#e2e8f0' },
                  width: 48,
                  height: 48,
                }}
              >
                <ShareIcon />
              </IconButton>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );

  // Enhanced Video Card (mobile style for desktop)
  const MobileStyleVideoCard = ({ video }: { video: RealVideoData }) => {
    const categories = video.categories ? JSON.parse(video.categories) : [];
    const rewards = {
      merits: 15 + video.questions.length * 5,
      ondas: video.questions.length * 3,
    };

    return (
      <Card
        sx={{
          mb: 2,
          cursor: 'pointer',
          borderRadius: 3,
          overflow: 'hidden',
          transition: 'all 0.3s ease',
          border:
            currentVideo?.id === video.id
              ? '2px solid #6366f1'
              : '1px solid #e2e8f0',
          background:
            currentVideo?.id === video.id
              ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)'
              : 'white',
          '&:hover': {
            transform: 'translateY(-4px) scale(1.01)',
            boxShadow: '0 12px 40px rgba(99, 102, 241, 0.2)',
            border: '2px solid #6366f1',
          },
        }}
        onClick={() => handlePlayVideo(video)}
      >
        <CardContent sx={{ p: 3 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={3}>
              <Box
                sx={{
                  position: 'relative',
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <VideoThumbnail width={120} height={68} />
                {video.questions.length > 0 && (
                  <Badge
                    badgeContent={video.questions.length}
                    color="warning"
                    sx={{
                      position: 'absolute',
                      top: -8,
                      right: 8,
                      '& .MuiBadge-badge': {
                        fontSize: '0.7rem',
                        fontWeight: 600,
                      },
                    }}
                  />
                )}
              </Box>
            </Grid>

            <Grid item xs={6}>
              <Typography
                sx={{
                  color: '#1e293b',
                  fontFamily: 'Roboto',
                  fontSize: '16px',
                  fontWeight: 700,
                  lineHeight: '20px',
                  mb: 1,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {video.title}
              </Typography>
              <Typography
                sx={{
                  color: '#64748b',
                  fontFamily: 'Roboto',
                  fontSize: '13px',
                  fontWeight: 400,
                  lineHeight: '18px',
                  mb: 2,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {video.description}
              </Typography>

              <Stack
                direction="row"
                spacing={1}
                flexWrap="wrap"
                sx={{ gap: 0.5 }}
              >
                <Chip
                  label={video.platform}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
                {categories.slice(0, 2).map((cat: string, index: number) => (
                  <Chip
                    key={index}
                    label={cat}
                    size="small"
                    variant="outlined"
                    sx={{ maxWidth: 100 }}
                  />
                ))}
              </Stack>
            </Grid>

            <Grid item xs={3}>
              <Box sx={{ textAlign: 'right' }}>
                <Typography
                  sx={{
                    color: '#6366f1',
                    fontFamily: 'Roboto',
                    fontSize: '18px',
                    fontWeight: 700,
                    mb: 0.5,
                  }}
                >
                  {Math.floor((video.duration || 0) / 60)}:
                  {((video.duration || 0) % 60).toString().padStart(2, '0')}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: 'block', mb: 2 }}
                >
                  {video.questions.length > 0
                    ? `${video.questions.length} preguntas`
                    : 'Sin preguntas'}
                </Typography>

                <Stack spacing={1} alignItems="flex-end">
                  <Chip
                    icon={<DiamondIcon />}
                    label={`+${rewards.merits}`}
                    size="small"
                    sx={{
                      backgroundColor: '#fef3c7',
                      color: '#92400e',
                      fontWeight: 600,
                      '& .MuiChip-icon': { color: '#f59e0b' },
                    }}
                  />
                  <Chip
                    icon={<BoltIcon />}
                    label={`+${rewards.ondas}`}
                    size="small"
                    sx={{
                      backgroundColor: '#dcfce7',
                      color: '#166534',
                      fontWeight: 600,
                      '& .MuiChip-icon': { color: '#10b981' },
                    }}
                  />
                </Stack>

                <Stack
                  direction="row"
                  spacing={0.5}
                  sx={{ mt: 1 }}
                  justifyContent="flex-end"
                >
                  <IconButton size="small" sx={{ color: '#64748b' }}>
                    <BookmarkIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" sx={{ color: '#64748b' }}>
                    <PlaylistAddIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" sx={{ color: '#64748b' }}>
                    <ShareIcon fontSize="small" />
                  </IconButton>
                </Stack>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
  };

  // Detailed Stats Section (mobile style)
  const DetailedStatsSection = () => (
    <Collapse in={showDetailedStats}>
      <Card sx={{ mb: 3, borderRadius: 3, overflow: 'hidden' }}>
        <Box
          sx={{
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            color: 'white',
            p: 3,
          }}
        >
          <Typography
            variant="h6"
            sx={{ fontWeight: 700, textAlign: 'center' }}
          >
            📊 Panel de Estadísticas Completas
          </Typography>
        </Box>
        <CardContent sx={{ p: 4 }}>
          <Grid container spacing={4}>
            <Grid item xs={6} md={3}>
              <Box textAlign="center">
                <Typography
                  variant="h3"
                  color="primary"
                  sx={{ fontWeight: 800 }}
                >
                  {gameState.videosCompleted}
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  Videos Completados
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} md={3}>
              <Box textAlign="center">
                <Typography
                  variant="h3"
                  color="success.main"
                  sx={{ fontWeight: 800 }}
                >
                  {formatTime(gameState.totalWatchTime)}
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  Tiempo Total
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} md={3}>
              <Box textAlign="center">
                <Typography
                  variant="h3"
                  color="warning.main"
                  sx={{ fontWeight: 800 }}
                >
                  {gameState.achievements.length}
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  Logros
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} md={3}>
              <Box textAlign="center">
                <Typography
                  variant="h3"
                  color="error.main"
                  sx={{ fontWeight: 800 }}
                >
                  {Math.round(gameState.averageEngagement * 100)}%
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  Precisión
                </Typography>
              </Box>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Box>
            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
              Meta Semanal de Aprendizaje
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Box sx={{ flexGrow: 1, mr: 2 }}>
                <LinearProgress
                  variant="determinate"
                  value={
                    (gameState.sessionsThisWeek / gameState.weeklyGoal) * 100
                  }
                  sx={{ height: 8, borderRadius: 4 }}
                  color="success"
                />
              </Box>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {gameState.sessionsThisWeek}/{gameState.weeklyGoal}
              </Typography>
            </Box>
            <Typography variant="caption" color="text.secondary">
              ¡Vas genial! Solo{' '}
              {gameState.weeklyGoal - gameState.sessionsThisWeek} sesiones más
              para completar tu meta semanal
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Collapse>
  );

  // Enhanced Video Player (mobile style for desktop)
  const MobileStyleVideoPlayer = () => (
    <Paper
      sx={{
        bgcolor: '#000',
        position: 'relative',
        mb: 3,
        borderRadius: 4,
        overflow: 'hidden',
        boxShadow: '0 16px 48px rgba(0,0,0,0.4)',
        border: currentVideo ? '3px solid rgba(99, 102, 241, 0.3)' : 'none',
      }}
    >
      {currentVideo ? (
        <Box>
          <InteractiveVideoPlayer
            videoItemId={currentVideo.id}
            autoplay={true}
            onComplete={() => {
              showSnackbar('🎉 ¡Video completado! +100 XP Bonus', 'success');
              setGameState((prev) => ({
                ...prev,
                experience: prev.experience + 100,
                merits: prev.merits + 25,
                videosCompleted: prev.videosCompleted + 1,
              }));
            }}
          />
        </Box>
      ) : (
        <Box
          sx={{
            width: '100%',
            height: '500px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
          }}
        >
          <GameIcon
            sx={{
              fontSize: 100,
              color: '#6366f1',
              mb: 4,
              filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
            }}
          />
          <Typography
            variant="h4"
            color="white"
            sx={{ mb: 3, fontWeight: 700, textAlign: 'center' }}
          >
            Selecciona un video para comenzar tu experiencia gamificada
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: 'rgba(255,255,255,0.8)',
              textAlign: 'center',
              maxWidth: 700,
              mb: 4,
            }}
          >
            Responde preguntas interactivas, gana mëritos y öndas, sube de nivel
            y desbloquea logros mientras aprendes 🚀
          </Typography>

          <Stack
            direction="row"
            spacing={2}
            flexWrap="wrap"
            justifyContent="center"
          >
            <Chip
              label="🎯 Modo Enfoque"
              variant="outlined"
              sx={{
                color: 'white',
                borderColor: 'rgba(255,255,255,0.3)',
                fontSize: '16px',
                height: 40,
                px: 2,
              }}
            />
            <Chip
              label="📚 Modo Aprendizaje"
              variant="outlined"
              sx={{
                color: 'white',
                borderColor: 'rgba(255,255,255,0.3)',
                fontSize: '16px',
                height: 40,
                px: 2,
              }}
            />
            <Chip
              label="🎭 Modo Teatro"
              variant="outlined"
              sx={{
                color: 'white',
                borderColor: 'rgba(255,255,255,0.3)',
                fontSize: '16px',
                height: 40,
                px: 2,
              }}
            />
          </Stack>
        </Box>
      )}
    </Paper>
  );

  // 📱 Renderizar versión móvil si es dispositivo móvil
  if (isMobile) {
    return <UPlayMobileHome />;
  }

  return (
    <Box sx={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <MobileStyleHeader />

      <Container maxWidth="lg" sx={{ py: 3 }}>
        {/* Enhanced Status Chips (mobile style) */}
        <Stack
          direction="row"
          spacing={2}
          sx={{ mb: 3, flexWrap: 'wrap', gap: 1 }}
        >
          <EnhancedStatusChip
            icon={<PersonIcon sx={{ fontSize: 14 }} />}
            label="Activos"
            value={150}
            color="success"
          />
          <EnhancedStatusChip
            icon={<FireIcon sx={{ fontSize: 14 }} />}
            label="Quemados"
            value={50}
            color="error"
          />
          <EnhancedStatusChip
            icon={<TrophyIcon sx={{ fontSize: 14 }} />}
            label="Ranking"
            value={`#${gameState.ranking}`}
            color="warning"
          />
        </Stack>

        {/* Welcome Section (mobile style) */}
        <Box sx={{ mb: 4 }}>
          <Typography
            sx={{
              color: '#1e293b',
              fontFamily: 'Montserrat',
              fontSize: '24px',
              fontWeight: 700,
              lineHeight: 'normal',
              mb: 2,
            }}
          >
            Bienvenida al ÜPlay Desktop,
            <br />
            Lucía
          </Typography>

          <MobileStyleStatsPanel />
          <DetailedStatsSection />
        </Box>

        {/* Interactive Demo Button */}
        <Box sx={{ mb: 4 }}>
          <Button
            variant="contained"
            fullWidth
            startIcon={<QuizIcon />}
            onClick={() => console.log('Interactive demo')}
            sx={{
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              color: 'white',
              borderRadius: 4,
              py: 2,
              fontSize: '18px',
              fontWeight: 700,
              boxShadow: '0 8px 32px rgba(99, 102, 241, 0.4)',
              '&:hover': {
                background: 'linear-gradient(135deg, #5a56eb 0%, #7c3aed 100%)',
                boxShadow: '0 12px 40px rgba(99, 102, 241, 0.5)',
                transform: 'translateY(-2px)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            🎮 Abrir Reproductor Interactivo
          </Button>
        </Box>

        {/* Continue Watching Section */}
        <MobileStyleContinueWatching />

        {/* Staff Playlists Section */}
        <StaffPlaylistsSection />

        {/* My Playlists Section */}
        <MyPlaylistsSection />

        {/* Video Player */}
        <MobileStyleVideoPlayer />

        {/* Video List */}
        <Box>
          <Typography
            sx={{
              color: '#1e293b',
              fontFamily: 'Roboto',
              fontSize: '18px',
              fontWeight: 700,
              lineHeight: '24px',
              mb: 3,
            }}
          >
            📚 Biblioteca de Videos ({realVideos.length} disponibles)
          </Typography>

          {videosLoading ? (
            <Box>
              {[...Array(3)].map((_, i) => (
                <Card key={i} sx={{ mb: 2, borderRadius: 3 }}>
                  <CardContent sx={{ p: 3 }}>
                    <Grid container spacing={3} alignItems="center">
                      <Grid item xs={3}>
                        <Skeleton
                          variant="rectangular"
                          width={120}
                          height={68}
                          sx={{ borderRadius: 2 }}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <Skeleton variant="text" width="80%" height={24} />
                        <Skeleton
                          variant="text"
                          width="60%"
                          height={20}
                          sx={{ mt: 1 }}
                        />
                        <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                          <Skeleton
                            variant="rectangular"
                            width={60}
                            height={24}
                            sx={{ borderRadius: 3 }}
                          />
                          <Skeleton
                            variant="rectangular"
                            width={80}
                            height={24}
                            sx={{ borderRadius: 3 }}
                          />
                        </Stack>
                      </Grid>
                      <Grid item xs={3}>
                        <Skeleton variant="text" width="100%" height={32} />
                        <Skeleton
                          variant="rectangular"
                          width="100%"
                          height={24}
                          sx={{ mt: 1, borderRadius: 3 }}
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              ))}
            </Box>
          ) : videosError ? (
            <Alert
              severity="error"
              sx={{ borderRadius: 3 }}
              action={
                <Button color="inherit" size="small">
                  Reintentar
                </Button>
              }
            >
              Error cargando videos del backend. Verifica la conexión.
            </Alert>
          ) : (
            <Box>
              {realVideos.map((video) => (
                <MobileStyleVideoCard key={video.id} video={video} />
              ))}
            </Box>
          )}
        </Box>
      </Container>

      {/* Question Dialog */}
      <Dialog
        open={questionDialogOpen}
        onClose={() => {}}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            color: 'white',
          },
        }}
      >
        <DialogTitle
          sx={{ display: 'flex', alignItems: 'center', color: 'white', pb: 1 }}
        >
          <QuizIcon sx={{ mr: 2 }} />
          Pregunta Interactiva
          {activeQuestion && (
            <Chip
              label={`Tipo: ${activeQuestion.type}`}
              size="small"
              sx={{ ml: 2, bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
            />
          )}
        </DialogTitle>
        <DialogContent sx={{ color: 'white' }}>
          {activeQuestion && (
            <Box>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
                {activeQuestion.text}
              </Typography>

              {activeQuestion.type === 'true-false' && (
                <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                  <Button
                    variant={
                      selectedAnswer === 'true' ? 'contained' : 'outlined'
                    }
                    onClick={() => !showAnswer && handleAnswerQuestion('true')}
                    disabled={showAnswer}
                    sx={{
                      color: 'white',
                      borderColor: 'white',
                      '&.MuiButton-contained': {
                        bgcolor: 'rgba(255,255,255,0.3)',
                      },
                    }}
                  >
                    Verdadero
                  </Button>
                  <Button
                    variant={
                      selectedAnswer === 'false' ? 'contained' : 'outlined'
                    }
                    onClick={() => !showAnswer && handleAnswerQuestion('false')}
                    disabled={showAnswer}
                    sx={{
                      color: 'white',
                      borderColor: 'white',
                      '&.MuiButton-contained': {
                        bgcolor: 'rgba(255,255,255,0.3)',
                      },
                    }}
                  >
                    Falso
                  </Button>
                </Stack>
              )}

              {activeQuestion.type === 'multiple-choice' && (
                <Stack spacing={1} sx={{ mb: 2 }}>
                  {['Opción A', 'Opción B', 'Opción C', 'Opción D'].map(
                    (option, index) => (
                      <Button
                        key={index}
                        variant={
                          selectedAnswer === option ? 'contained' : 'outlined'
                        }
                        onClick={() =>
                          !showAnswer && handleAnswerQuestion(option)
                        }
                        disabled={showAnswer}
                        sx={{
                          justifyContent: 'flex-start',
                          color: 'white',
                          borderColor: 'white',
                          '&.MuiButton-contained': {
                            bgcolor: 'rgba(255,255,255,0.3)',
                          },
                        }}
                      >
                        {option}
                      </Button>
                    )
                  )}
                </Stack>
              )}

              {activeQuestion.type === 'open-text' && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ mb: 1, opacity: 0.8 }}>
                    Escribe tu respuesta:
                  </Typography>
                  <input
                    type="text"
                    value={selectedAnswer}
                    onChange={(e) => setSelectedAnswer(e.target.value)}
                    placeholder="Tu respuesta aquí..."
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255,255,255,0.3)',
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      color: 'white',
                      fontSize: '16px',
                    }}
                  />
                </Box>
              )}

              {showAnswer && (
                <Alert
                  severity={isAnswerCorrect ? 'success' : 'error'}
                  sx={{
                    mt: 2,
                    bgcolor: isAnswerCorrect
                      ? 'rgba(76, 175, 80, 0.2)'
                      : 'rgba(244, 67, 54, 0.2)',
                    color: 'white',
                    '& .MuiAlert-icon': { color: 'white' },
                  }}
                >
                  {isAnswerCorrect
                    ? `¡Excelente! Has ganado ${10 + gameState.currentStreak * 2} Mëritos 🏆`
                    : 'No es correcto, pero sigues ganando experiencia 💪'}
                </Alert>
              )}
            </Box>
          )}
        </DialogContent>
        {showAnswer && (
          <DialogActions sx={{ p: 2 }}>
            <Button
              onClick={closeQuestionDialog}
              variant="contained"
              sx={{
                bgcolor: 'rgba(255,255,255,0.2)',
                color: 'white',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' },
              }}
            >
              Continuar Video
            </Button>
          </DialogActions>
        )}
      </Dialog>

      {/* Achievement Notification */}
      <Dialog
        open={!!showAchievement}
        onClose={() => setShowAchievement(null)}
        PaperProps={{
          sx: {
            borderRadius: 4,
            textAlign: 'center',
            background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
            color: 'white',
          },
        }}
      >
        <DialogContent sx={{ p: 4 }}>
          <Typography variant="h2" sx={{ mb: 2 }}>
            🏆
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
            ¡Logro Desbloqueado!
          </Typography>
          <Typography variant="h6" sx={{ mb: 2 }}>
            {showAchievement?.name}
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9 }}>
            {showAchievement?.description}
          </Typography>
          <Typography variant="h6" sx={{ mt: 2 }}>
            +{showAchievement?.meritsReward} Mëritos
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
          <Button
            onClick={() => setShowAchievement(null)}
            variant="contained"
            sx={{
              bgcolor: 'rgba(255,255,255,0.2)',
              color: 'white',
              fontWeight: 600,
              px: 4,
              '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' },
            }}
          >
            ¡Genial!
          </Button>
        </DialogActions>
      </Dialog>

      {/* Enhanced Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          severity={snackbarSeverity}
          onClose={() => setSnackbarOpen(false)}
          sx={{
            fontWeight: 600,
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

      {/* Floating Action Button */}
      <Zoom in={true}>
        <Box
          sx={{
            position: 'fixed',
            bottom: 32,
            right: 32,
            width: 64,
            height: 64,
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            color: 'white',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 28,
            cursor: 'pointer',
            boxShadow: '0 8px 25px rgba(99, 102, 241, 0.4)',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'scale(1.1)',
              boxShadow: '0 12px 35px rgba(99, 102, 241, 0.5)',
            },
          }}
          onClick={() => console.log('Floating action')}
        >
          <QuizIcon sx={{ fontSize: 32 }} />
        </Box>
      </Zoom>
    </Box>
  );
};

export default UPlayMain;
