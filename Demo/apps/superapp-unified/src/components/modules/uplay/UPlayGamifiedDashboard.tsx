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
  useMediaQuery,
  Chip,
  Divider,
  CircularProgress,
  Fade,
  Skeleton,
  Paper,
  useTheme,
  Theme,
} from '@mui/material';
import {
  PlayArrow,
  Menu,
  Diamond,
  Bolt,
} from '@mui/icons-material';

// Hooks y Componentes
import DynamicMetricsDashboard from './DynamicMetricsDashboard';
import { useRewardFeedback } from './components/EnhancedRewardFeedback';
import { usePlaylists, Playlist, Video } from '../../../hooks/data/usePlaylistData';

// TIPOS LOCALES (ADAPTADOR)
interface VideoItem {
  id: string;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  rewards: { meritos: number; ondas: number; };
  thumbnail: string;
}

// ADAPTADOR
const adaptBackendVideoToVideoItem = (backendVideo: Video): VideoItem => {
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
    if (difficulty === 'easy') return '#3E8638'; // Verde - success
    if (difficulty === 'medium') return '#FBBA00'; // Amarillo - warning
    return '#5D1626'; // Rojo oscuro - error
};

// COMPONENTE VideoCard
const VideoCard: React.FC<{ video: VideoItem; onPlay: () => void }> = ({ video, onPlay }) => {
  const theme = useTheme();

  return (
    <Card
      onClick={onPlay}
      sx={{
        height: '100%',
        cursor: 'pointer',
        transition: 'all 0.2s',
        position: 'relative',
        overflow: 'hidden',
        background: theme.palette.background.paper,
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 2,
        boxShadow: 'none',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 1px 4px rgba(0, 0, 0, 0.03)',
          borderColor: 'rgba(92, 36, 131, 0.1)',
        },
      }}
    >
      <Box sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h6" sx={{ fontWeight: 500, mb: 1, color: theme.palette.text.primary, flexGrow: 1 }}>
          {video.thumbnail} {video.title}
        </Typography>
        <Divider sx={{ my: 1.5, borderColor: theme.palette.divider }} />
        <Grid container justifyContent="space-between" alignItems="center" spacing={1}>
          <Grid item>
            <Chip
              icon={<Diamond fontSize="small" />}
              label={`${video.rewards.meritos}`}
              size="small"
              sx={{
                background: 'rgba(92, 36, 131, 0.02)',
                border: 'none',
                color: theme.palette.text.secondary,
                fontWeight: 400,
              }}
            />
          </Grid>
          <Grid item>
            <Chip
              icon={<Bolt fontSize="small" />}
              label={`${video.rewards.ondas}`}
              size="small"
              sx={{
                background: 'rgba(92, 36, 131, 0.02)',
                border: 'none',
                color: theme.palette.text.secondary,
                fontWeight: 400,
              }}
            />
          </Grid>
        </Grid>
      </Box>
      <Chip
        label={getDifficultyLabel(video.difficulty)}
        size="small"
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          background: 'white',
          color: getDifficultyColor(video.difficulty),
          fontWeight: 500,
          border: `1px solid ${getDifficultyColor(video.difficulty)}10`,
          borderRadius: 1,
          height: 20,
          fontSize: '0.7rem',
        }}
      />
    </Card>
  );
};

// DASHBOARD PRINCIPAL
export const UPlayGamifiedDashboard: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery('(max-width: 600px)');
  const navigate = useNavigate();
  const [isPending, startTransition] = useTransition();
  const { showReward } = useRewardFeedback();

  const { data: playlistsData, isLoading: playlistsLoading, error: playlistsError } = usePlaylists();

  const handlePlayAction = useCallback((playlist: Playlist, video: Video) => {
    startTransition(() => {
      navigate(`/uplay/journey/${playlist.id}`, {
        state: {
          journeyData: {
            id: playlist.id,
            title: playlist.name,
            inspirationalQuote: playlist.description || 'Un viaje de mil millas comienza con un solo paso.',
            purpose: playlist.description || 'Explora esta colección de videos para expandir tu conciencia.',
            imageUrl: playlist.imageUrl || `https://via.placeholder.com/400x225/E3F2FD/90CAF9?text=${encodeURIComponent(playlist.name)}`,
            rewards: {
              meritos: playlist.videoItems.reduce((acc, v) => acc + (v.rewards?.meritos || 50), 0),
              ondas: playlist.videoItems.reduce((acc, v) => acc + (v.rewards?.ondas || 30), 0),
            },
            videos: playlist.videoItems.map(v => ({ id: v.id, title: v.title })),
            firstVideoId: video.id
          }
        }
      });
    });
  }, [navigate]);

  if (playlistsLoading) {
    return (
      <Container sx={{ py: 4 }}>
        <Grid container spacing={2}>
          {[...Array(6)].map((_, i) => (
            <Grid item key={i} xs={12} sm={6} md={4}>
              <Skeleton variant="rectangular" height={160} sx={{ borderRadius: 2 }}/>
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  }

  if (playlistsError) {
    return (
      <Container sx={{ py: 4 }}>
        <Paper sx={{ p: 3, bgcolor: 'rgba(93, 22, 38, 0.02)', border: '1px solid rgba(93, 22, 38, 0.1)', borderRadius: 2 }}>
          <Typography color="#5D1626">Error al cargar las Sendas.</Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, bgcolor: theme.palette.background.default, minHeight: '100%' }} data-testid="uplay-dashboard">
      {/* Contenido principal */}
      <Container maxWidth="xl" sx={{ mt: 2 }}>
        <DynamicMetricsDashboard />

        {/* Sendas de Aprendizaje */}
        <Typography variant="h4" sx={{ mt: 5, mb: 3, fontWeight: 600, color: theme.palette.text.primary }}>
          Sendas de Aprendizaje
        </Typography>
        <Grid container spacing={3}>
          {playlistsData?.map((playlist) => (
            <React.Fragment key={playlist.id}>
              <Grid item xs={12}>
                <Typography variant="h5" sx={{ mt: 2, mb: 1, fontWeight: 500, color: theme.palette.text.primary }}>
                  {playlist.name}
                </Typography>
                <Typography variant="body2" sx={{ mb: 2, color: theme.palette.text.secondary }}>
                  {playlist.description || 'Explora esta colección de videos para expandir tu conciencia.'}
                </Typography>
              </Grid>
              {playlist.videoItems.map((video) => (
                <Grid item xs={12} sm={6} md={4} key={video.id}>
                  <VideoCard
                    video={adaptBackendVideoToVideoItem(video)}
                    onPlay={() => handlePlayAction(playlist, video)}
                  />
                </Grid>
              ))}
            </React.Fragment>
          ))}
        </Grid>

        <Box sx={{ position: 'fixed', bottom: 24, right: 24 }}>
          <Fab
            color="primary"
            aria-label="play"
            sx={{
              width: 48,
              height: 48,
              boxShadow: '0 1px 4px rgba(0, 0, 0, 0.05)',
              bgcolor: theme.palette.primary.main,
              '&:hover': {
                bgcolor: theme.palette.primary.dark,
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
              }
            }}
          >
            <PlayArrow />
          </Fab>
        </Box>
      </Container>
    </Box>
  );
};
