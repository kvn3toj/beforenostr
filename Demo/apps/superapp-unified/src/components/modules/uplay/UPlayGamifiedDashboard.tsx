import React, { useState, useCallback, useTransition } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Card,
  Typography,
  Fab,
  Drawer,
  IconButton,
  AppBar,
  Toolbar,
  useTheme,
  useMediaQuery,
  Chip,
  Divider,
  CircularProgress,
  Fade,
  Skeleton,
  Paper,
} from '@mui/material';
import {
  PlayArrow,
  Menu,
  Diamond,
  Bolt,
} from '@mui/icons-material';

// Hooks y Componentes
import DynamicMetricsDashboard from './DynamicMetricsDashboard';
import { EnhancedRewardFeedback, useRewardFeedback } from './components/EnhancedRewardFeedback';
import { usePlaylists, Playlist as BackendPlaylist, Video as BackendVideo } from '../../../hooks/data/usePlaylistData';

// TIPOS LOCALES
interface VideoItem {
  id: string;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  rewards: { meritos: number; ondas: number; };
  thumbnail: string;
}

// ADAPTADOR
const adaptBackendVideoToVideoItem = (backendVideo: BackendVideo): VideoItem => {
    let difficulty: 'easy' | 'medium' | 'hard' = 'easy';
    if (backendVideo.questions?.length >= 5) difficulty = 'medium';
    if (backendVideo.questions?.length >= 10) difficulty = 'hard';

    return {
        id: backendVideo.id,
        title: backendVideo.title,
        difficulty,
        rewards: {
            meritos: backendVideo.rewards?.meritos || 50,
            ondas: backendVideo.rewards?.ondas || 30,
        },
        thumbnail: '🎬',
    };
};

const getDifficultyLabel = (difficulty: 'easy' | 'medium' | 'hard') => {
    if (difficulty === 'easy') return 'Fácil';
    if (difficulty === 'medium') return 'Intermedio';
    return 'Avanzado';
};

const getDifficultyColor = (difficulty: 'easy' | 'medium' | 'hard') => {
    if (difficulty === 'easy') return '#2ecc71';
    if (difficulty === 'medium') return '#f1c40f';
    return '#e74c3c';
};

// COMPONENTE VideoCard
const VideoCard: React.FC<{ video: VideoItem; onPlay: () => void }> = ({ video, onPlay }) => {
  return (
    <Card
      onClick={onPlay}
      sx={{
        height: '100%', cursor: 'pointer', transition: 'all 0.3s',
        position: 'relative', overflow: 'hidden', background: 'rgba(40,40,80,0.85)',
        backdropFilter: 'blur(8px)', border: '1.5px solid rgba(99,102,241,0.18)',
        borderRadius: 3, boxShadow: '0 4px 24px 0 rgba(99,102,241,0.10)',
        '&:hover': {
          transform: 'translateY(-8px) scale(1.04)',
          boxShadow: `0 12px 32px rgba(99,102,241,0.18), 0 0 24px ${getDifficultyColor(video.difficulty)}70`,
        },
      }}
    >
      <Box sx={{ p: 2.5, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, color: '#fff', flexGrow: 1 }}>
          {video.thumbnail} {video.title}
        </Typography>
        <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.2)' }} />
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item><Chip icon={<Diamond />} label={`${video.rewards.meritos} Mëritos`} size="small" sx={{ background: '#3498db20', color: '#3498db' }} /></Grid>
          <Grid item><Chip icon={<Bolt />} label={`${video.rewards.ondas} Öndas`} size="small" sx={{ background: '#9b59b620', color: '#9b59b6' }} /></Grid>
        </Grid>
      </Box>
      <Chip
        label={getDifficultyLabel(video.difficulty)}
        size="small"
        sx={{
            position: 'absolute', top: 12, left: 12,
            background: 'linear-gradient(90deg, #7e22ce 0%, #2563eb 100%)',
            color: '#fff', fontWeight: 'bold', px: 2, py: 1, borderRadius: 2
        }}
      />
    </Card>
  );
};

// DASHBOARD PRINCIPAL
export const UPlayGamifiedDashboard: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const [isPending, startTransition] = useTransition();
  const { reward, showReward } = useRewardFeedback();

  const { data: playlistsData, isLoading: playlistsLoading, error: playlistsError } = usePlaylists();

  const handlePlayAction = useCallback((playlist: BackendPlaylist, video: BackendVideo) => {
    startTransition(() => {
      navigate(`/uplay/journey/${playlist.id}`, {
        state: {
          journeyData: {
            id: playlist.id,
            title: playlist.name,
            inspirationalQuote: playlist.description || 'Un viaje de mil millas comienza con un solo paso.',
            purpose: playlist.description || 'Explora esta colección de videos para expandir tu conciencia.',
            imageUrl: playlist.thumbnailUrl || `https://via.placeholder.com/400x225/E3F2FD/90CAF9?text=${encodeURIComponent(playlist.name)}`,
            rewards: {
              meritos: playlist.videos.reduce((acc, v) => acc + (v.rewards?.meritos || 50), 0),
              ondas: playlist.videos.reduce((acc, v) => acc + (v.rewards?.ondas || 30), 0),
            },
            videos: playlist.videos.map(v => ({ id: v.id, title: v.title })),
            firstVideoId: video.id
          }
        }
      });
    });
  }, [navigate]);

  if (playlistsLoading) {
    return <Container sx={{ py: 4 }}><Grid container spacing={3}>{[...Array(6)].map((_, i) => <Grid item key={i} xs={12} sm={6} md={4}><Skeleton variant="rectangular" height={200} sx={{ borderRadius: 3 }}/></Grid>)}</Grid></Container>;
  }

  if (playlistsError) {
    return <Container sx={{ py: 4 }}><Paper sx={{p: 3, bgcolor: 'error.light'}}><Typography color="error.contrastText">Error al cargar las Sendas.</Typography></Paper></Container>;
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color="transparent" elevation={0}><Toolbar><Typography variant="h6" sx={{ flexGrow: 1 }}>ÜPlay Dashboard</Typography></Toolbar></AppBar>
      <Container maxWidth="xl" sx={{ mt: 4 }}>
        <DynamicMetricsDashboard />
        {playlistsData?.map((playlist) => (
          <Box key={playlist.id} sx={{ my: 5 }}>
            <Fade in={true} timeout={800}>
              <Box>
                <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>Senda: {playlist.name}</Typography>
                <Grid container spacing={isMobile ? 2 : 3}>
                  {playlist.videos.map((video) => (
                    <Grid item key={video.id} xs={12} sm={6} md={4} lg={3}>
                      <VideoCard
                        video={adaptBackendVideoToVideoItem(video)}
                        onPlay={() => handlePlayAction(playlist, video)}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Fade>
          </Box>
        ))}
      </Container>
      <EnhancedRewardFeedback reward={reward} />
    </Box>
  );
};
