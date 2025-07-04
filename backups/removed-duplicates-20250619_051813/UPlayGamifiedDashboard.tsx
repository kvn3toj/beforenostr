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
} from '@mui/icons-material';

// Hooks
import { useVideos } from '../hooks/useRealBackendData';
import { useUPlayIntegration } from '../hooks/useUPlayIntegration';
import { useSocial } from '../hooks/useSocial';

// Components
import { StudyRoomCard } from '../components/study-rooms/StudyRoomCard';
import { CreateStudyRoomDialog } from '../components/study-rooms/CreateStudyRoomDialog';
import { UPlayAnalyticsPanel } from '../components/analytics/UPlayAnalyticsPanel';
import { ChallengeCard } from '../components/challenges/ChallengeCard';
import { SocialFeedCard } from '../components/social/SocialFeedCard';

// Types
import type { VideoItem } from '../types/video';

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
  const [showCreateRoomDialog, setShowCreateRoomDialog] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Data hooks
  const { videos, playlists, isLoading, error } = useVideos();
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

  const handleCreateRoom = async (data: any) => {
    try {
      await createVideoRoom(data.videoId, data.name, data.description);
      setShowCreateRoomDialog(false);
      setNotification({ 
        message: '🎪 Sala de estudio creada!', 
        type: 'success' 
      });
    } catch (error) {
      setNotification({ 
        message: 'Error al crear la sala', 
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
    const grouped = playlists.reduce((acc, playlist) => {
      const playlistVideos = videos.filter(v => v.playlistId === playlist.id);
      acc[playlist.id] = {
        ...playlist,
        videos: playlistVideos,
        totalMerits: playlistVideos.reduce((sum, v) => sum + (v.merits || 0), 0),
        totalDuration: playlistVideos.reduce((sum, v) => sum + (v.duration || 0), 0),
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
                              {video.thumbnailUrl && (
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
              onClick={() => setShowCreateRoomDialog(true)}
              size="large"
            >
              Crear Sala
            </Button>
          </Box>

          <Grid container spacing={3}>
            {availableRooms.map((room) => (
              <Grid item xs={12} md={6} lg={4} key={room.id}>
                <StudyRoomCard
                  room={room}
                  onJoin={handleJoinRoom}
                  onWatch={handleVideoPlay}
                  isJoining={isJoiningRoom}
                />
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

          {/* My Active Challenges */}
          {myChallenges.filter(uc => uc.status === 'in_progress').length > 0 && (
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                🔥 Mis Desafíos Activos
              </Typography>
              <Grid container spacing={3}>
                {myChallenges
                  .filter(uc => uc.status === 'in_progress')
                  .map((userChallenge) => (
                    <Grid item xs={12} md={6} lg={4} key={userChallenge.id}>
                      <ChallengeCard
                        challenge={userChallenge.challenge!}
                        userChallenge={userChallenge}
                        onJoin={handleJoinChallenge}
                        onViewDetails={(id) => console.log('View challenge:', id)}
                      />
                    </Grid>
                  ))
                }
              </Grid>
            </Box>
          )}

          {/* Available Challenges */}
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            ⚡ Desafíos Disponibles
          </Typography>
          <Grid container spacing={3}>
            {availableChallenges.map((challenge) => {
              const userChallenge = myChallenges.find(uc => uc.challengeId === challenge.id);
              return (
                <Grid item xs={12} md={6} lg={4} key={challenge.id}>
                  <ChallengeCard
                    challenge={challenge}
                    userChallenge={userChallenge}
                    onJoin={handleJoinChallenge}
                    onViewDetails={(id) => console.log('View challenge:', id)}
                  />
                </Grid>
              );
            })}
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
            <SocialFeedCard
              key={publication.id}
              publication={publication}
              onLike={handleLike}
              onComment={handleComment}
              currentUserId="current-user" // TODO: Get from auth
            />
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
        <UPlayAnalyticsPanel />
      </TabPanel>

      {/* Floating Action Buttons */}
      <Box sx={{ position: 'fixed', bottom: 24, right: 24, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {currentTab === 1 && (
          <Fab
            color="secondary"
            onClick={() => setShowCreateRoomDialog(true)}
            sx={{ boxShadow: 3 }}
          >
            <GroupsIcon />
          </Fab>
        )}
        
        <Fab
          color="primary"
          onClick={() => setCurrentTab(4)} // Go to Analytics
          sx={{ boxShadow: 3 }}
        >
          <Badge badgeContent={insights.challenges.active + insights.studyRooms.available} color="error">
            <NotificationsIcon />
          </Badge>
        </Fab>
      </Box>

      {/* Dialogs and Modals */}
      <CreateStudyRoomDialog
        open={showCreateRoomDialog}
        onClose={() => setShowCreateRoomDialog(false)}
        onCreateRoom={handleCreateRoom}
        videos={videos.map(v => ({
          id: v.id,
          title: v.title,
          duration: v.duration,
          thumbnailUrl: v.thumbnailUrl,
        }))}
      />

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