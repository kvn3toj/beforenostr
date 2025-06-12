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
} from '@mui/icons-material';

// Import enhanced mock data hook
import {
  useUPlayMockData,
  MockVideo,
  MockPlaylist,
} from '../../../hooks/useUPlayMockData';

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

// Enhanced placeholder component with better design
const VideoThumbnail: React.FC<{
  width: number | string;
  height: number | string;
  className?: string;
  isPlaying?: boolean;
  progress?: number;
}> = ({ width, height, className, isPlaying = false, progress = 0 }) => (
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
  </Box>
);

// Enhanced status chip with better styling
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
          width: 20,
          height: 20,
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
          '& .MuiAvatar-img': { width: '70%', height: '70%' },
        }}
      >
        {icon}
      </Avatar>
    }
    label={value ? `${label}: ${value}` : label}
    variant="outlined"
    size="small"
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
      fontSize: '12px',
      fontWeight: 600,
      height: 28,
      '& .MuiChip-label': {
        paddingLeft: 1,
      },
    }}
  />
);

// Enhanced video card for horizontal lists
const EnhancedVideoCard: React.FC<{
  video: MockVideo;
  onClick?: () => void;
  progress?: VideoProgress;
}> = ({ video, onClick, progress }) => (
  <Box
    sx={{
      width: 140,
      flexShrink: 0,
      cursor: onClick ? 'pointer' : 'default',
      transition: 'transform 0.2s ease-in-out',
      '&:hover': onClick
        ? {
            transform: 'translateY(-4px) scale(1.02)',
          }
        : {},
    }}
    onClick={onClick}
  >
    <Box sx={{ position: 'relative' }}>
      <VideoThumbnail
        width={140}
        height={78}
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

    <Box sx={{ mt: 1.5, px: 0.5 }}>
      <Typography
        variant="body2"
        sx={{
          color: '#1e293b',
          fontFamily: 'Roboto',
          fontSize: '13px',
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
          fontSize: '11px',
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

const UPlayMobileHome: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  // Enhanced state management
  const [showStats, setShowStats] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [currentStreak, setCurrentStreak] = useState(3);

  // Enhanced mock user stats
  const enhancedUserStats: EnhancedMockUserStats = {
    name: 'Lucía',
    activePlayers: 150,
    burnedPlayers: 50,
    level: 12,
    merits: 2350,
    ondas: 1680,
    experience: 3750,
    experienceToNext: 1250,
    weeklyGoal: 7,
    currentStreak: 3,
    completedVideos: 28,
    totalWatchTime: 45600, // seconds
    achievements: 15,
    ranking: 47,
  };

  // Enhanced mock data with progress
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
  ];

  // Use enhanced mock data hook
  const {
    isLoading,
    continueWatching,
    staffPlaylists,
    myPlaylists,
    createdPlaylist,
    formatDuration,
    getProgressText,
  } = useUPlayMockData();

  const handleVideoClick = (video: MockVideo) => {
    console.log('Playing video:', video.title);
    navigate('/interactive-video');
  };

  const handleContinueWatching = () => {
    console.log('Continuing video:', continueWatching.title);
    navigate('/interactive-video');
  };

  const handleInteractiveDemo = () => {
    navigate('/interactive-video');
  };

  const handleShowStats = () => {
    setShowStats(!showStats);
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          width: '100vw',
          minHeight: '100vh',
          backgroundColor: '#f8fafc',
          p: 2,
        }}
      >
        <Skeleton
          variant="rectangular"
          width="100%"
          height={64}
          sx={{ mb: 2, borderRadius: 2 }}
        />
        <Skeleton variant="text" width="60%" height={28} sx={{ mb: 1 }} />
        <Skeleton variant="text" width="40%" height={24} sx={{ mb: 3 }} />
        <Skeleton
          variant="rectangular"
          width="100%"
          height={220}
          sx={{ mb: 3, borderRadius: 3 }}
        />
        <Stack direction="row" spacing={2}>
          <Skeleton
            variant="rectangular"
            width={140}
            height={78}
            sx={{ borderRadius: 2 }}
          />
          <Skeleton
            variant="rectangular"
            width={140}
            height={78}
            sx={{ borderRadius: 2 }}
          />
          <Skeleton
            variant="rectangular"
            width={140}
            height={78}
            sx={{ borderRadius: 2 }}
          />
        </Stack>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: '100vw',
        minHeight: '100vh',
        backgroundColor: '#f8fafc',
        position: 'relative',
      }}
    >
      {/* Enhanced Status Bar */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
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
          9:30
        </Typography>

        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Badge badgeContent={currentStreak} color="error">
            <FireIcon sx={{ fontSize: 16 }} />
          </Badge>
          <Typography sx={{ fontSize: '12px', fontWeight: 500 }}>
            📶 🔋 85%
          </Typography>
        </Box>
      </Box>

      {/* Enhanced Top App Bar */}
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
      <Container maxWidth="sm" sx={{ px: 2, py: 2, pb: 10 }}>
        {/* Enhanced Status Chips */}
        <Stack
          direction="row"
          spacing={1}
          sx={{ mb: 3, flexWrap: 'wrap', gap: 1 }}
        >
          <EnhancedStatusChip
            icon={<PersonIcon sx={{ fontSize: 12 }} />}
            label="Activos"
            value={enhancedUserStats.activePlayers}
            color="success"
          />
          <EnhancedStatusChip
            icon={<FireIcon sx={{ fontSize: 12 }} />}
            label="Quemados"
            value={enhancedUserStats.burnedPlayers}
            color="error"
          />
          <EnhancedStatusChip
            icon={<TrophyIcon sx={{ fontSize: 12 }} />}
            label="Ranking"
            value={`#${enhancedUserStats.ranking}`}
            color="warning"
          />
        </Stack>

        {/* Enhanced Welcome Section */}
        <Box sx={{ mb: 3 }}>
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
            Bienvenida,
            <br />
            {enhancedUserStats.name}
          </Typography>

          {/* Player metrics summary */}
          <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
            <Chip
              icon={<StarIcon />}
              label={`Nivel ${enhancedUserStats.level}`}
              size="medium"
              color="secondary"
              sx={{ fontWeight: 600 }}
            />
            <Chip
              icon={<DiamondIcon />}
              label={`${enhancedUserStats.merits.toLocaleString()} M`}
              size="medium"
              color="warning"
              sx={{ fontWeight: 600 }}
            />
            <Chip
              icon={<BoltIcon />}
              label={`${enhancedUserStats.ondas} Ö`}
              size="medium"
              color="primary"
              sx={{ fontWeight: 600 }}
            />
          </Stack>

          {/* XP Progress */}
          <Box sx={{ mb: 2 }}>
            <Box
              sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}
            >
              <Typography variant="caption" sx={{ fontWeight: 600 }}>
                Progreso al Nivel {enhancedUserStats.level + 1}
              </Typography>
              <Typography variant="caption" sx={{ fontWeight: 600 }}>
                {enhancedUserStats.experience}/
                {enhancedUserStats.experience +
                  enhancedUserStats.experienceToNext}
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={
                (enhancedUserStats.experience /
                  (enhancedUserStats.experience +
                    enhancedUserStats.experienceToNext)) *
                100
              }
              sx={{
                height: 8,
                borderRadius: 4,
                bgcolor: '#e2e8f0',
                '& .MuiLinearProgress-bar': {
                  borderRadius: 4,
                  background:
                    'linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%)',
                },
              }}
            />
          </Box>
        </Box>

        {/* Stats Toggle Button */}
        <Button
          variant="outlined"
          onClick={handleShowStats}
          startIcon={<TrendingUpIcon />}
          endIcon={showStats ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          fullWidth
          sx={{
            mb: 2,
            borderColor: '#6366f1',
            color: '#6366f1',
            fontWeight: 600,
            borderRadius: 2,
          }}
        >
          {showStats ? 'Ocultar Estadísticas' : 'Ver Estadísticas Detalladas'}
        </Button>

        {/* Detailed Stats Section */}
        <Collapse in={showStats}>
          <Card sx={{ mb: 3, borderRadius: 3, overflow: 'hidden' }}>
            <Box
              sx={{
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                color: 'white',
                p: 2,
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontWeight: 700, textAlign: 'center' }}
              >
                📊 Panel de Estadísticas
              </Typography>
            </Box>
            <CardContent sx={{ p: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={6}>
                  <Box textAlign="center">
                    <Typography
                      variant="h4"
                      color="primary"
                      sx={{ fontWeight: 800 }}
                    >
                      {enhancedUserStats.completedVideos}
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
                      {Math.floor(enhancedUserStats.totalWatchTime / 3600)}h
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
                      {enhancedUserStats.achievements}
                    </Typography>
                    <Typography variant="caption" sx={{ fontWeight: 600 }}>
                      Logros
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box textAlign="center">
                    <Typography
                      variant="h4"
                      color="error.main"
                      sx={{ fontWeight: 800 }}
                    >
                      {enhancedUserStats.currentStreak}
                    </Typography>
                    <Typography variant="caption" sx={{ fontWeight: 600 }}>
                      Racha Actual
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              <Divider sx={{ my: 2 }} />

              {/* Weekly progress */}
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                  Meta Semanal de Aprendizaje
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Box sx={{ flexGrow: 1, mr: 2 }}>
                    <LinearProgress
                      variant="determinate"
                      value={(4 / enhancedUserStats.weeklyGoal) * 100}
                      sx={{ height: 6, borderRadius: 3 }}
                      color="success"
                    />
                  </Box>
                  <Typography variant="caption" sx={{ fontWeight: 600 }}>
                    4/{enhancedUserStats.weeklyGoal}
                  </Typography>
                </Box>
                <Typography variant="caption" color="text.secondary">
                  ��Vas genial! Solo 3 sesiones más para completar tu meta
                  semanal
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Collapse>

        {/* Enhanced Interactive Demo Button */}
        <Box sx={{ mb: 3 }}>
          <Button
            variant="contained"
            fullWidth
            startIcon={<QuizIcon />}
            onClick={handleInteractiveDemo}
            sx={{
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              color: 'white',
              borderRadius: 3,
              py: 2,
              fontSize: '16px',
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
            🎮 Probar Reproductor Interactivo
          </Button>
        </Box>

        {/* Enhanced Continue Watching Section */}
        <Box sx={{ mb: 4 }}>
          <Typography
            sx={{
              color: '#1e293b',
              fontFamily: 'Roboto',
              fontSize: '16px',
              fontWeight: 700,
              lineHeight: '22px',
              mb: 2,
            }}
          >
            📺 Continuar viendo
          </Typography>

          {/* Enhanced Main Video Thumbnail */}
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
              mb: 2,
            }}
            onClick={handleContinueWatching}
          >
            <Box sx={{ position: 'relative' }}>
              <VideoThumbnail width="100%" height={220} progress={35} />

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

              {/* Video duration and progress indicator */}
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
                  label={formatDuration(continueWatching.duration)}
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

              {/* Questions indicator */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 16,
                  left: 16,
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

          {/* Enhanced Video Info with Progress */}
          <Card sx={{ borderRadius: 3, p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {/* Enhanced Progress Circle */}
              <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                <CircularProgress
                  variant="determinate"
                  value={35}
                  size={56}
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
                    variant="caption"
                    component="div"
                    sx={{ fontSize: '12px', fontWeight: 700, color: '#6366f1' }}
                  >
                    35%
                  </Typography>
                </Box>
              </Box>

              {/* Enhanced Video Details */}
              <Box sx={{ flex: 1 }}>
                <Typography
                  sx={{
                    color: '#1e293b',
                    fontFamily: 'Roboto',
                    fontSize: '15px',
                    fontWeight: 700,
                    lineHeight: '20px',
                    mb: 0.5,
                  }}
                >
                  {continueWatching.title}
                </Typography>
                <Typography
                  sx={{
                    color: '#64748b',
                    fontFamily: 'Roboto',
                    fontSize: '13px',
                    fontWeight: 400,
                    lineHeight: '18px',
                    mb: 1,
                  }}
                >
                  {continueWatching.description}
                </Typography>

                <Stack direction="row" spacing={1} flexWrap="wrap">
                  <Chip
                    icon={<DiamondIcon />}
                    label="+45 Mëritos"
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

              {/* Action buttons */}
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

        {/* Enhanced Staff Playlists Section */}
        <Box sx={{ mb: 4 }}>
          <Typography
            sx={{
              color: '#1e293b',
              fontFamily: 'Roboto',
              fontSize: '16px',
              fontWeight: 700,
              lineHeight: '22px',
              mb: 2,
            }}
          >
            🌟 Playlists del Staff
          </Typography>

          <Stack direction="row" spacing={2} sx={{ overflowX: 'auto', pb: 2 }}>
            {staffPlaylists.map((video) => (
              <EnhancedVideoCard
                key={video.id}
                video={video}
                onClick={() => handleVideoClick(video)}
                progress={mockVideoProgress.find((p) => p.videoId === video.id)}
              />
            ))}
          </Stack>
        </Box>

        {/* Enhanced My Playlists Section */}
        <Box sx={{ mb: 4 }}>
          <Typography
            sx={{
              color: '#1e293b',
              fontFamily: 'Roboto',
              fontSize: '16px',
              fontWeight: 700,
              lineHeight: '22px',
              mb: 2,
            }}
          >
            📚 Mis playlists
          </Typography>

          <Stack
            direction="row"
            spacing={2}
            sx={{ overflowX: 'auto', pb: 2, mb: 3 }}
          >
            {myPlaylists.map((video) => (
              <EnhancedVideoCard
                key={video.id}
                video={video}
                onClick={() => handleVideoClick(video)}
                progress={mockVideoProgress.find((p) => p.videoId === video.id)}
              />
            ))}
          </Stack>

          {/* Enhanced Playlist Card */}
          <Card
            sx={{
              borderRadius: 3,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
              },
              border: '1px solid #e2e8f0',
            }}
            onClick={() =>
              console.log('Opening playlist:', createdPlaylist.name)
            }
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {/* Enhanced Playlist Icon */}
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    position: 'relative',
                    borderRadius: 2,
                    overflow: 'hidden',
                  }}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: 30,
                      height: 30,
                      background:
                        'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    }}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      width: 30,
                      height: 30,
                      background:
                        'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
                    }}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      width: 30,
                      height: 30,
                      background:
                        'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
                    }}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      width: 30,
                      height: 30,
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
                      fontSize: '14px',
                      fontWeight: 700,
                      lineHeight: 'normal',
                      mb: 0.5,
                    }}
                  >
                    {createdPlaylist.name}
                  </Typography>
                  <Typography
                    sx={{
                      color: '#64748b',
                      fontFamily: 'Montserrat',
                      fontSize: '12px',
                      fontWeight: 400,
                      lineHeight: 'normal',
                      mb: 1,
                    }}
                  >
                    {createdPlaylist.videoCount} Videos • Personal
                  </Typography>
                  <Stack direction="row" spacing={1}>
                    <Chip
                      icon={<DiamondIcon />}
                      label={createdPlaylist.merits}
                      size="small"
                      sx={{
                        backgroundColor: '#fef3c7',
                        color: '#92400e',
                        fontWeight: 600,
                        '& .MuiChip-icon': { color: '#f59e0b' },
                      }}
                    />
                    <Chip
                      icon={<SchoolIcon />}
                      label="Aprendizaje"
                      size="small"
                      sx={{
                        backgroundColor: '#e0e7ff',
                        color: '#3730a3',
                        fontWeight: 600,
                        '& .MuiChip-icon': { color: '#6366f1' },
                      }}
                    />
                  </Stack>
                </Box>

                {/* Playlist actions */}
                <IconButton
                  sx={{
                    bgcolor: '#f1f5f9',
                    color: '#6366f1',
                    '&:hover': { bgcolor: '#e2e8f0' },
                  }}
                >
                  <PlayIcon />
                </IconButton>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Container>

      {/* Enhanced Floating Action Button */}
      <Zoom in={true}>
        <Fab
          color="primary"
          onClick={handleInteractiveDemo}
          sx={{
            position: 'fixed',
            bottom: 80,
            right: 16,
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            boxShadow: '0 8px 32px rgba(99, 102, 241, 0.4)',
            '&:hover': {
              background: 'linear-gradient(135deg, #5a56eb 0%, #7c3aed 100%)',
              transform: 'scale(1.1)',
            },
            transition: 'all 0.3s ease',
          }}
        >
          <QuizIcon />
        </Fab>
      </Zoom>
    </Box>
  );
};

export default UPlayMobileHome;
