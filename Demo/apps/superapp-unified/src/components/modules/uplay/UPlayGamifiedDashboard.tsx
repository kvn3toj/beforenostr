import React, { useState, useMemo } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Avatar,
  IconButton,
  Tabs,
  Tab,
  Fab,
  Badge,
  Tooltip,
  Collapse,
  Alert,
  Snackbar,
  LinearProgress,
  Stack,
  Divider,
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  Favorite as FavoriteIcon,
  Share as ShareIcon,
  Add as AddIcon,
  Groups as GroupsIcon,
  Analytics as AnalyticsIcon,
  EmojiEvents as ChallengesIcon,
  Forum as SocialIcon,
  ExpandMore as ExpandIcon,
  ExpandLess as CollapseIcon,
  Notifications as NotificationsIcon,
  Schedule as ScheduleIcon,
  VideoLibrary as VideoLibraryIcon,
  TrendingUp as TrendingUpIcon,
  School as SchoolIcon,
} from '@mui/icons-material';

// Hooks
import { useVideos } from '../../../hooks/data/useVideoData';

// Mock hooks temporales hasta que se implementen los reales
const useUPlayIntegration = () => ({
  availableRooms: [
    {
      id: '1',
      name: 'Estudio Grupal Filosofía',
      description: 'Explorando principios de Ayni',
      participants: 3,
      maxParticipants: 8,
      currentVideo: 'video-1',
      isActive: true,
    },
    {
      id: '2', 
      name: 'Gamificación Avanzada',
      description: 'Mecánicas de juego colaborativo',
      participants: 5,
      maxParticipants: 10,
      currentVideo: 'video-2',
      isActive: true,
    }
  ],
  createVideoRoom: async () => {},
  joinVideoRoom: async () => {},
  isJoiningRoom: false,
  availableChallenges: [
    {
      id: '1',
      title: 'Maestro del Ayni',
      description: 'Completa 5 videos sobre reciprocidad',
      difficulty: 'medium',
      rewards: { merits: 100, ondas: 50 },
      progress: 0,
      total: 5,
      timeLimit: '7 días',
    },
    {
      id: '2',
      title: 'Explorador de Contenido',
      description: 'Mira videos de 3 categorías diferentes',
      difficulty: 'easy',
      rewards: { merits: 50, ondas: 25 },
      progress: 1,
      total: 3,
      timeLimit: '3 días',
    }
  ],
  myChallenges: [],
  startVideoChallenge: async () => {},
  completeVideoChallenge: async () => {},
  shareVideoExperience: async () => {},
  toggleLike: () => {},
  getUPlayInsights: () => ({
    session: null,
    challenges: { active: 2, completed: 0, available: 2 },
    studyRooms: { available: 2, participating: 0 },
    analytics: { totalUsers: 42, engagement: null }
  }),
  dashboardMetrics: {},
  startVideoSession: () => {},
  endVideoSession: () => {},
  currentSession: null,
});

const useSocial = () => ({
  feed: [
    {
      id: '1',
      type: 'video_completion',
      author: { name: 'María González', avatar: '/avatar1.jpg' },
      content: '¡Acabo de completar "Principios del Ayni"! 🌟',
      timestamp: '2 min ago',
      likes: 8,
      comments: 3,
      isLiked: false,
    },
    {
      id: '2',
      type: 'challenge_completed',
      author: { name: 'Carlos Ruiz', avatar: '/avatar2.jpg' },
      content: 'Completé el desafío "Explorador de Contenido" - ¡89 mëritos ganados!',
      timestamp: '15 min ago',
      likes: 12,
      comments: 5,
      isLiked: true,
    }
  ],
  createPublication: async () => {},
  isCreatingPublication: false,
});

// Mock para transformar datos del backend a formato esperado
const useVideosTransformed = () => {
  const { data: backendVideos, isLoading, error } = useVideos();
  
  // Transformar datos del backend al formato esperado
  const videos = (backendVideos || []).map((video: any) => ({
    id: video.id?.toString() || Math.random().toString(),
    title: video.title || 'Video sin título',
    description: video.description || 'Descripción del video',
    url: video.url,
    thumbnailUrl: video.thumbnailUrl,
    duration: video.duration || 0,
    merits: 50, // Valor por defecto
    playlistId: video.playlist?.id || 'default',
  }));

  // Crear playlists mock basadas en los datos
  const playlists = [
    {
      id: 'default',
      title: '🎓 Contenido Principal',
      description: 'Videos principales de aprendizaje'
    },
    {
      id: 'documentales',
      title: '🎬 Documentales',
      description: 'Documentales educativos'
    }
  ];

  return {
    videos,
    playlists,
    isLoading,
    error
  };
};

// Types
interface VideoItem {
  id: string;
  title: string;
  description?: string;
  url?: string;
  thumbnailUrl?: string;
  duration?: number;
  merits?: number;
  playlistId?: string;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`uplay-tabpanel-${index}`}
      aria-labelledby={`uplay-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export const UPlayGamifiedDashboard: React.FC = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [selectedPlaylist, setSelectedPlaylist] = useState<string | null>(null);
  const [expandedPlaylists, setExpandedPlaylists] = useState<Set<string>>(new Set());
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Data hooks
  const { videos, playlists, isLoading, error } = useVideosTransformed();
  const {
    // Study Rooms
    availableRooms,
    createVideoRoom,
    joinVideoRoom,
    isJoiningRoom,
    
    // Challenges
    availableChallenges,
    myChallenges,
    startVideoChallenge,
    completeVideoChallenge,
    
    // Social & Analytics
    shareVideoExperience,
    toggleLike,
    getUPlayInsights,
    dashboardMetrics,
    
    // Session Management
    startVideoSession,
    endVideoSession,
    currentSession,
  } = useUPlayIntegration();

  const { 
    feed, 
    createPublication, 
    isCreatingPublication 
  } = useSocial();

  // Insights
  const insights = getUPlayInsights();

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  const handlePlaylistToggle = (playlistId: string) => {
    const newExpanded = new Set(expandedPlaylists);
    if (newExpanded.has(playlistId)) {
      newExpanded.delete(playlistId);
    } else {
      newExpanded.add(playlistId);
    }
    setExpandedPlaylists(newExpanded);
  };

  const handleVideoPlay = (video: VideoItem) => {
    try {
      startVideoSession(video.id, video.playlistId);
      setNotification({ 
        message: `🎬 Iniciando reproducción: ${video.title}`, 
        type: 'success' 
      });
    } catch (error) {
      setNotification({ 
        message: 'Error al iniciar el video', 
        type: 'error' 
      });
    }
  };

  const handleJoinRoom = async (roomId: string) => {
    try {
      await joinVideoRoom(roomId);
      setNotification({ 
        message: '🎪 Te uniste a la sala de estudio!', 
        type: 'success' 
      });
    } catch (error) {
      setNotification({ 
        message: 'Error al unirse a la sala', 
        type: 'error' 
      });
    }
  };

  const handleJoinChallenge = async (challengeId: string) => {
    try {
      await startVideoChallenge(challengeId);
      setNotification({ 
        message: '🎯 Desafío aceptado!', 
        type: 'success' 
      });
    } catch (error) {
      setNotification({ 
        message: 'Error al aceptar el desafío', 
        type: 'error' 
      });
    }
  };

  const handleLike = (targetId: string, targetType: 'publication' | 'comment') => {
    toggleLike({ targetId, targetType });
  };

  const handleComment = (data: any) => {
    // This would be handled by the SocialFeedCard component
    console.log('Comment submitted:', data);
  };

  const filteredVideos = useMemo(() => {
    if (!selectedPlaylist) return videos;
    return videos.filter(video => video.playlistId === selectedPlaylist);
  }, [videos, selectedPlaylist]);

  const groupedPlaylists = useMemo(() => {
    const grouped = playlists.reduce((acc: Record<string, any>, playlist: any) => {
      const playlistVideos = videos.filter((v: VideoItem) => v.playlistId === playlist.id);
      acc[playlist.id] = {
        ...playlist,
        videos: playlistVideos,
        totalMerits: playlistVideos.reduce((sum: number, v: VideoItem) => sum + (v.merits || 0), 0),
        totalDuration: playlistVideos.reduce((sum: number, v: VideoItem) => sum + (v.duration || 0), 0),
      };
      return acc;
    }, {} as Record<string, any>);
    return grouped;
  }, [playlists, videos]);

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" align="center">
          🎮 Cargando ÜPlay...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">
          Error cargando contenido: {error.message}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 2 }}>
      {/* Header */}
      <Paper 
        elevation={3} 
        sx={{ 
          p: 3, 
          mb: 3, 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
        }}
      >
        <Typography variant="h3" fontWeight="bold" gutterBottom>
          🎮 ÜPlay - Gamified Playlist
        </Typography>
        <Typography variant="h6" sx={{ opacity: 0.9 }}>
          Aprende, juega y conecta en la experiencia de video gamificada más avanzada
        </Typography>
        
        {/* Live Stats */}
        <Box sx={{ display: 'flex', gap: 3, mt: 2, flexWrap: 'wrap' }}>
          <Chip 
            icon={<PlayIcon />} 
            label={`${insights.session ? '🔴 En Sesión' : '⚪ Disponible'}`}
            color={insights.session ? 'error' : 'default'}
            variant="filled"
          />
          <Chip 
            icon={<ChallengesIcon />} 
            label={`${insights.challenges.active} Desafíos Activos`}
            color="warning"
            variant="filled"
          />
          <Chip 
            icon={<GroupsIcon />} 
            label={`${insights.studyRooms.available} Salas Disponibles`}
            color="secondary"
            variant="filled"
          />
          <Chip 
            icon={<AnalyticsIcon />} 
            label={`${insights.analytics.totalUsers} Jugadores`}
            color="info"
            variant="filled"
          />
        </Box>
      </Paper>

      {/* Main Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          variant="fullWidth"
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab 
            icon={<PlayIcon />} 
            label="Videos & Playlists" 
            iconPosition="start"
          />
          <Tab 
            icon={
              <Badge badgeContent={insights.studyRooms.available} color="secondary">
                <GroupsIcon />
              </Badge>
            } 
            label="Study Rooms" 
            iconPosition="start"
          />
          <Tab 
            icon={
              <Badge badgeContent={insights.challenges.active} color="warning">
                <ChallengesIcon />
              </Badge>
            } 
            label="Challenges" 
            iconPosition="start"
          />
          <Tab 
            icon={<SocialIcon />} 
            label="Social Feed" 
            iconPosition="start"
          />
          <Tab 
            icon={<AnalyticsIcon />} 
            label="Analytics" 
            iconPosition="start"
          />
        </Tabs>
      </Paper>

      {/* Tab Panels */}
      
      {/* Videos & Playlists Tab */}
      <TabPanel value={currentTab} index={0}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            🎬 Contenido Gamificado por Playlist
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Explora contenido organizado por temas de aprendizaje. Gana mëritos y completa desafíos.
          </Typography>

          {/* Current Session Alert */}
          {currentSession && (
            <Alert severity="info" sx={{ mb: 3 }}>
              <Typography variant="body2">
                🎬 Sesión activa: {currentSession.videoId} 
                {currentSession.isInStudyRoom && ` (en sala: ${currentSession.studyRoomId})`}
              </Typography>
            </Alert>
          )}

          {/* Playlists */}
          {Object.values(groupedPlaylists).map((playlist: any) => (
            <Card key={playlist.id} sx={{ mb: 3 }}>
              <CardContent>
                <Box 
                  sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    cursor: 'pointer'
                  }}
                  onClick={() => handlePlaylistToggle(playlist.id)}
                >
                  <Box>
                    <Typography variant="h6" fontWeight="bold">
                      {playlist.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {playlist.description}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <Chip 
                        label={`${playlist.videos.length} videos`} 
                        size="small" 
                        color="primary"
                      />
                      <Chip 
                        label={`${playlist.totalMerits} mëritos`} 
                        size="small" 
                        color="warning"
                      />
                      <Chip 
                        label={`${Math.round(playlist.totalDuration / 60)} min`} 
                        size="small" 
                        color="secondary"
                      />
                    </Box>
                  </Box>
                  <IconButton>
                    {expandedPlaylists.has(playlist.id) ? <CollapseIcon /> : <ExpandIcon />}
                  </IconButton>
                </Box>

                <Collapse in={expandedPlaylists.has(playlist.id)}>
                  <Box sx={{ mt: 3 }}>
                    <Grid container spacing={3}>
                      {playlist.videos.map((video: VideoItem) => (
                        <Grid item xs={12} md={6} lg={4} key={video.id}>
                          <Card 
                            sx={{ 
                              height: '100%',
                              '&:hover': { boxShadow: 6 },
                              transition: 'all 0.2s'
                            }}
                          >
                            <Box sx={{ position: 'relative' }}>
                              {video.thumbnailUrl ? (
                                <Box
                                  component="img"
                                  src={video.thumbnailUrl}
                                  alt={video.title}
                                  sx={{ 
                                    width: '100%', 
                                    height: 200, 
                                    objectFit: 'cover' 
                                  }}
                                />
                              ) : (
                                <Box
                                  sx={{
                                    width: '100%',
                                    height: 200,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: 'grey.200',
                                  }}
                                >
                                  <VideoLibraryIcon sx={{ fontSize: 64, color: 'grey.500' }} />
                                </Box>
                              )}
                              <Box
                                sx={{
                                  position: 'absolute',
                                  top: 8,
                                  right: 8,
                                  display: 'flex',
                                  gap: 1,
                                }}
                              >
                                <Chip 
                                  label={`${video.merits || 0} mëritos`}
                                  size="small"
                                  color="warning"
                                  variant="filled"
                                />
                                <Chip 
                                  label={`${Math.round((video.duration || 0) / 60)}min`}
                                  size="small"
                                  color="info"
                                  variant="filled"
                                />
                              </Box>
                            </Box>
                            <CardContent>
                              <Typography variant="h6" fontWeight="bold" gutterBottom>
                                {video.title}
                              </Typography>
                              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                {video.description}
                              </Typography>
                              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                                <Button
                                  variant="contained"
                                  startIcon={<PlayIcon />}
                                  onClick={() => handleVideoPlay(video)}
                                  fullWidth
                                >
                                  Reproducir
                                </Button>
                              </Box>
                              <Box sx={{ display: 'flex', gap: 1 }}>
                                <IconButton size="small" color="error">
                                  <FavoriteIcon />
                                </IconButton>
                                <IconButton size="small" color="primary">
                                  <ShareIcon />
                                </IconButton>
                              </Box>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                </Collapse>
              </CardContent>
            </Card>
          ))}
        </Box>
      </TabPanel>

      {/* Study Rooms Tab */}
      <TabPanel value={currentTab} index={1}>
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                🎪 Salas de Estudio Colaborativo
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Únete o crea salas para ver videos con otros jugadores en tiempo real
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              size="large"
            >
              Crear Sala
            </Button>
          </Box>

          <Grid container spacing={3}>
            {availableRooms.map((room) => (
              <Grid item xs={12} md={6} lg={4} key={room.id}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar sx={{ bgcolor: 'secondary.main', mr: 2 }}>
                        <GroupsIcon />
                      </Avatar>
                      <Box>
                        <Typography variant="h6" fontWeight="bold">
                          {room.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {room.description}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Box sx={{ mb: 2 }}>
                      <Chip 
                        label={`${room.participants}/${room.maxParticipants} participantes`}
                        size="small"
                        color="primary"
                        sx={{ mr: 1 }}
                      />
                      <Chip 
                        label={room.isActive ? 'Activa' : 'Inactiva'}
                        size="small"
                        color={room.isActive ? 'success' : 'default'}
                      />
                    </Box>

                    <LinearProgress 
                      variant="determinate" 
                      value={(room.participants / room.maxParticipants) * 100}
                      sx={{ mb: 2 }}
                    />

                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => handleJoinRoom(room.id)}
                        disabled={isJoiningRoom}
                      >
                        Unirse
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                      >
                        Ver Video
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
            {availableRooms.length === 0 && (
              <Grid item xs={12}>
                <Paper sx={{ p: 4, textAlign: 'center' }}>
                  <GroupsIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No hay salas activas
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    ¡Sé el primero en crear una sala de estudio!
                  </Typography>
                </Paper>
              </Grid>
            )}
          </Grid>
        </Box>
      </TabPanel>

      {/* Challenges Tab */}
      <TabPanel value={currentTab} index={2}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            🎯 Desafíos y Misiones
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Acepta desafíos para ganar mëritos extra y desbloquear contenido especial
          </Typography>

          {/* Available Challenges */}
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            ⚡ Desafíos Disponibles
          </Typography>
          <Grid container spacing={3}>
            {availableChallenges.map((challenge) => (
              <Grid item xs={12} md={6} lg={4} key={challenge.id}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar sx={{ bgcolor: 'warning.main', mr: 2 }}>
                        <ChallengesIcon />
                      </Avatar>
                      <Box>
                        <Typography variant="h6" fontWeight="bold">
                          {challenge.title}
                        </Typography>
                        <Chip 
                          label={challenge.difficulty}
                          size="small"
                          color={challenge.difficulty === 'easy' ? 'success' : 'warning'}
                        />
                      </Box>
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {challenge.description}
                    </Typography>

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="caption" color="text.secondary">
                        Progreso: {challenge.progress}/{challenge.total}
                      </Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={(challenge.progress / challenge.total) * 100}
                        sx={{ mt: 1 }}
                      />
                    </Box>

                    <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                      <Chip 
                        label={`${challenge.rewards.merits} mëritos`}
                        size="small"
                        color="warning"
                      />
                      <Chip 
                        label={`${challenge.rewards.ondas} öndas`}
                        size="small"
                        color="info"
                      />
                    </Box>

                    <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
                      ⏰ {challenge.timeLimit}
                    </Typography>

                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => handleJoinChallenge(challenge.id)}
                      fullWidth
                    >
                      Aceptar Desafío
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </TabPanel>

      {/* Social Feed Tab */}
      <TabPanel value={currentTab} index={3}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            🤝 Feed Social de la Comunidad
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Descubre qué están aprendiendo otros jugadores y comparte tus experiencias
          </Typography>

          {feed.map((publication) => (
            <Card key={publication.id} sx={{ mb: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar src={publication.author.avatar} sx={{ mr: 2 }}>
                    {publication.author.name.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {publication.author.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {publication.timestamp}
                    </Typography>
                  </Box>
                </Box>

                <Typography variant="body1" sx={{ mb: 2 }}>
                  {publication.content}
                </Typography>

                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button
                    size="small"
                    startIcon={<FavoriteIcon color={publication.isLiked ? 'error' : 'inherit'} />}
                    onClick={() => handleLike(publication.id, 'publication')}
                  >
                    {publication.likes}
                  </Button>
                  <Button size="small" startIcon={<SocialIcon />}>
                    {publication.comments}
                  </Button>
                  <Button size="small" startIcon={<ShareIcon />}>
                    Compartir
                  </Button>
                </Box>
              </CardContent>
            </Card>
          ))}

          {feed.length === 0 && (
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <SocialIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No hay publicaciones aún
              </Typography>
              <Typography variant="body2" color="text.secondary">
                ¡Sé el primero en compartir tu experiencia de aprendizaje!
              </Typography>
            </Paper>
          )}
        </Box>
      </TabPanel>

      {/* Analytics Tab */}
      <TabPanel value={currentTab} index={4}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            📊 Analytics del Jugador
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Monitorea tu progreso y estadísticas de aprendizaje
          </Typography>

          <Grid container spacing={3}>
            {/* Personal Stats */}
            <Grid item xs={12} md={6} lg={3}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Avatar sx={{ bgcolor: 'primary.main', mx: 'auto', mb: 2 }}>
                    <SchoolIcon />
                  </Avatar>
                  <Typography variant="h4" fontWeight="bold" color="primary">
                    {videos.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Videos Disponibles
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6} lg={3}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Avatar sx={{ bgcolor: 'warning.main', mx: 'auto', mb: 2 }}>
                    <ChallengesIcon />
                  </Avatar>
                  <Typography variant="h4" fontWeight="bold" color="warning.main">
                    {insights.challenges.active}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Desafíos Activos
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6} lg={3}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Avatar sx={{ bgcolor: 'secondary.main', mx: 'auto', mb: 2 }}>
                    <GroupsIcon />
                  </Avatar>
                  <Typography variant="h4" fontWeight="bold" color="secondary.main">
                    {insights.studyRooms.available}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Salas Disponibles
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6} lg={3}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Avatar sx={{ bgcolor: 'info.main', mx: 'auto', mb: 2 }}>
                    <AnalyticsIcon />
                  </Avatar>
                  <Typography variant="h4" fontWeight="bold" color="info.main">
                    {insights.analytics.totalUsers}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Jugadores Activos
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Activity Summary */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    📈 Resumen de Actividad
                  </Typography>
                  <Box sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="body1" color="text.secondary">
                      ¡Bienvenido a tu panel de analytics! Aquí podrás ver tu progreso detallado una vez que comiences a usar ÜPlay.
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </TabPanel>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        onClick={() => setCurrentTab(4)} // Go to Analytics
        sx={{ 
          position: 'fixed', 
          bottom: 24, 
          right: 24,
          boxShadow: 3 
        }}
      >
        <Badge badgeContent={insights.challenges.active + insights.studyRooms.available} color="error">
          <NotificationsIcon />
        </Badge>
      </Fab>

      {/* Notifications */}
      <Snackbar
        open={!!notification}
        autoHideDuration={4000}
        onClose={() => setNotification(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          severity={notification?.type || 'info'} 
          onClose={() => setNotification(null)}
          sx={{ minWidth: 300 }}
        >
          {notification?.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}; 