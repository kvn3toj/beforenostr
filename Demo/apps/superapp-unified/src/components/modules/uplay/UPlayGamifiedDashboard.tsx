import React, { useState, useEffect, useCallback } from 'react';
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
} from '@mui/icons-material';

// Importar componentes mejorados
import { PlayerMetricsDashboard } from './components/PlayerMetricsDashboard';
import { EnhancedRewardFeedback, useRewardFeedback } from './components/EnhancedRewardFeedback';
import { UnifiedUPlayPlayer } from './UnifiedUPlayPlayer';

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

// ============================================================================
// INTERFACES
// ============================================================================

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
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
          '& .play-overlay': {
            opacity: 1,
          },
        },
      }}
      onClick={() => onPlay(video.id)}
    >
      <Box
        sx={{
          height: 180,
          background: `linear-gradient(135deg, ${getDifficultyColor(video.difficulty)}20, ${getDifficultyColor(video.difficulty)}10)`,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '4rem',
        }}
      >
        {/* Emoji como thumbnail */}
        <Typography variant="h1" sx={{ fontSize: '4rem' }}>
          {video.thumbnail}
        </Typography>
        
        {/* Overlay de play */}
        <Box
          className="play-overlay"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: 0,
            transition: 'opacity 0.3s ease',
          }}
        >
          <Fab
            size="large"
            color="primary"
            sx={{
              bgcolor: 'rgba(255,255,255,0.95)',
              '&:hover': { bgcolor: 'rgba(255,255,255,1)' },
            }}
          >
            <PlayArrow sx={{ color: '#1976d2', fontSize: '2rem' }} />
          </Fab>
        </Box>
        
        {/* Badge de completado */}
        {video.isCompleted && (
          <Chip
            label="✓ Completado"
            color="success"
            size="small"
            sx={{ 
              position: 'absolute', 
              top: 12, 
              right: 12,
              fontWeight: 'bold',
            }}
          />
        )}
        
        {/* Badge de dificultad */}
        <Chip
          label={getDifficultyLabel(video.difficulty)}
          size="small"
          sx={{ 
            position: 'absolute',
            top: 12,
            left: 12,
            bgcolor: getDifficultyColor(video.difficulty),
            color: 'white',
            fontWeight: 'bold',
          }}
        />
      </Box>
      
      <CardContent sx={{ pb: 1 }}>
        <Typography variant="h6" component="h3" gutterBottom noWrap>
          {video.title}
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: 40 }}>
          {video.description}
        </Typography>
        
        {/* Información del video */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="caption" color="text.secondary">
            {Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')}
            {video.questionsCount && ` • ${video.questionsCount} preguntas`}
          </Typography>
        </Box>
        
        {/* Recompensas */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Box display="flex" gap={1}>
            <Chip
              icon={<Diamond sx={{ fontSize: '16px !important' }} />}
              label={`${video.rewards.meritos} Mëritos`}
              size="small"
              variant="outlined"
              sx={{ 
                color: '#9c27b0',
                borderColor: '#9c27b0',
                '& .MuiChip-icon': { color: '#9c27b0' },
              }}
            />
            <Chip
              icon={<Bolt sx={{ fontSize: '16px !important' }} />}
              label={`${video.rewards.ondas} Öndas`}
              size="small"
              variant="outlined"
              sx={{ 
                color: '#ff9800',
                borderColor: '#ff9800',
                '& .MuiChip-icon': { color: '#ff9800' },
              }}
            />
          </Box>
        </Box>
        
        {/* Barra de progreso */}
        {video.progress > 0 && (
          <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
              <Typography variant="caption" color="text.secondary">
                Progreso
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {Math.round(video.progress)}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={video.progress}
              sx={{
                height: 6,
                borderRadius: 3,
                bgcolor: 'rgba(0,0,0,0.1)',
                '& .MuiLinearProgress-bar': {
                  borderRadius: 3,
                  bgcolor: video.isCompleted ? '#4caf50' : '#1976d2',
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
    data: playlists,
    isLoading: isLoadingPlaylists,
    isError: isErrorPlaylists,
    error: errorPlaylists,
  } = useQuery({
    queryKey: ['playlists'],
    queryFn: videosAPI.getPlaylists,
  });

  // Fetch videos
  const {
    data: videos,
    isLoading: isLoadingVideos,
    isError: isErrorVideos,
    error: errorVideos,
  } = useVideos();

  // Agrupar videos por playlistId
  const videosByPlaylist = React.useMemo(() => {
    if (!videos) return {};
    const grouped: Record<string, any[]> = {};
    videos.forEach((video: any) => {
      const pid = video.playlistId || 'unassigned';
      if (!grouped[pid]) grouped[pid] = [];
      grouped[pid].push(video);
    });
    return grouped;
  }, [videos]);

  // Helper para obtener nombre de playlist
  const getPlaylistName = (playlistId: string) => {
    if (playlistId === 'unassigned') return 'Sin ruta asignada';
    const pl = playlists?.find((p: any) => p.id === playlistId);
    return pl?.name || 'Ruta desconocida';
  };

  // HANDLERS (mover aquí todos los useCallback)
  const handleTabChange = useCallback((_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  }, []);

  const handleVideoPlay = useCallback((videoId: string) => {
    setSelectedVideo(videoId);
    setCurrentVideo(videoId);
    // Aquí podrías navegar a la página del reproductor
    console.log('Playing video:', videoId);
  }, [setCurrentVideo]);

  const handleCloseSidebar = useCallback(() => {
    setSidebarOpen(false);
  }, []);

  // Loading state
  if (isLoadingPlaylists || isLoadingVideos) {
    return <Box sx={{ p: 4 }}><LinearProgress /><Typography sx={{ mt: 2 }}>Cargando rutas de aprendizaje...</Typography></Box>;
  }

  // Error state
  if (isErrorPlaylists || isErrorVideos) {
    return <Box sx={{ p: 4 }}><Typography color="error">Error al cargar rutas o videos: {errorPlaylists?.message || errorVideos?.message}</Typography></Box>;
  }

  // Empty state
  if (!playlists?.length && !Object.keys(videosByPlaylist).length) {
    return <Box sx={{ p: 4 }}><Typography>No hay rutas de aprendizaje ni videos disponibles.</Typography></Box>;
  }

  // ========================================================================
  // RENDER HELPERS
  // ========================================================================

  const renderHeader = () => (
    <AppBar 
      position="sticky" 
      elevation={0}
      sx={{ 
        bgcolor: 'background.paper',
        borderBottom: 1,
        borderColor: 'divider',
      }}
    >
      <Toolbar>
        {isMobile && (
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => setSidebarOpen(true)}
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
            </Typography>
          </Box>
        </Box>

        {/* Métricas rápidas en el header */}
        <Box display="flex" gap={1} alignItems="center">
          <Chip
            icon={<Diamond />}
            label={playerMetrics.meritos.toLocaleString()}
            size="small"
            sx={{ color: '#9c27b0', fontWeight: 'bold' }}
          />
          <Chip
            icon={<Bolt />}
            label={playerMetrics.ondas.toLocaleString()}
            size="small"
            sx={{ color: '#ff9800', fontWeight: 'bold' }}
          />
          <Chip
            icon={<Star />}
            label={`Nivel ${playerMetrics.level}`}
            size="small"
            sx={{ color: '#2196f3', fontWeight: 'bold' }}
          />
          
          <IconButton color="inherit">
            <Badge badgeContent={unreadNotifications.length} color="error">
              <Notifications />
            </Badge>
          </IconButton>
        </Box>
      </Toolbar>
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
          },
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
          <Grid size={{xs:12,sm:6,md:4}} key={achievement.id}>
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
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {renderHeader()}
      {renderTabs()}
      {renderSidebar()}

      <TabPanel value={tabValue} index={1}>
        {playlists?.map((playlist: any) => (
          <Box key={playlist.id} sx={{ mb: 6 }}>
            <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
              {playlist.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {playlist.description}
            </Typography>
            <Grid container spacing={2} sx={{ overflowX: 'auto', flexWrap: 'nowrap' }}>
              {(videosByPlaylist[playlist.id] || []).map((video: any) => (
                <Grid item key={video.id} xs={12} sm={6} md={4} lg={3}>
                  <VideoCard video={video} onPlay={handleVideoPlay} />
                </Grid>
              ))}
              {!(videosByPlaylist[playlist.id]?.length) && (
                <Grid item xs={12}><Typography color="text.secondary">No hay videos en esta ruta.</Typography></Grid>
              )}
            </Grid>
          </Box>
        ))}
        {/* Sección para videos sin playlist */}
        {videosByPlaylist['unassigned'] && (
          <Box sx={{ mb: 6 }}>
            <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
              Sin ruta asignada
            </Typography>
            <Grid container spacing={2} sx={{ overflowX: 'auto', flexWrap: 'nowrap' }}>
              {videosByPlaylist['unassigned'].map((video: any) => (
                <Grid item key={video.id} xs={12} sm={6} md={4} lg={3}>
                  <VideoCard video={video} onPlay={handleVideoPlay} />
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </TabPanel>

      <TabPanel value={tabValue} index={0}>
        <PlayerMetricsDashboard />
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <PlayerMetricsDashboard />
      </TabPanel>

      <TabPanel value={tabValue} index={3}>
        {renderAchievements()}
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
  );
};

export default UPlayGamifiedDashboard; 