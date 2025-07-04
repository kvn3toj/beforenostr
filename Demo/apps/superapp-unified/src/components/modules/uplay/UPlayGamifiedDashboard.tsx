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
  LinearProgress,
} from '@mui/material';
import {
  PlayArrow,
  Menu,
  Diamond,
  Bolt,
  WorkspacePremium,
  Whatshot,
} from '@mui/icons-material';
import { alpha } from '@mui/material/styles';

// Hooks y Componentes
import DynamicMetricsDashboard from './DynamicMetricsDashboard';
import { useRewardFeedback } from './components/EnhancedRewardFeedback';
import { usePlaylists, Playlist, Video } from '../../../hooks/data/usePlaylistData';

// TIPOS LOCALES (ADAPTADOR)
interface VideoItem {
  id: string;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  rewards: { meritos: number; ondas: number };
  thumbnailUrl: string;
  progress: number;
}

// ADAPTADOR
const adaptBackendVideoToVideoItem = (
  backendVideo: Video,
  playlistImageUrl?: string
): VideoItem => {
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
    thumbnailUrl: backendVideo.thumbnailUrl || playlistImageUrl || '',
    progress: Math.floor(Math.random() * 80) + 10,
  };
};

const getDifficultyLabel = (difficulty: 'easy' | 'medium' | 'hard') => {
  if (difficulty === 'easy') return 'Fácil';
  if (difficulty === 'medium') return 'Intermedio';
  return 'Avanzado';
};

const getDifficultyColor = (
  difficulty: 'easy' | 'medium' | 'hard',
  theme: Theme
) => {
  if (difficulty === 'easy') return theme.palette.success.main;
  if (difficulty === 'medium') return theme.palette.warning.main;
  return theme.palette.error.main;
};

// COMPONENTE VideoCard MEJORADO
const VideoCard: React.FC<{ video: VideoItem; onPlay: () => void }> = ({
  video,
  onPlay,
}) => {
  const theme = useTheme();
  const difficultyColor = getDifficultyColor(video.difficulty, theme);
  const hasThumbnail = !!video.thumbnailUrl;

  return (
    <Card
      onClick={onPlay}
      sx={{
        height: '250px',
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 3,
        boxShadow: 'none',
        border: `1px solid ${theme.palette.divider}`,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        backgroundImage: hasThumbnail ? `url(${video.thumbnailUrl})` : 'none',
        backgroundColor: hasThumbnail ? 'transparent' : theme.palette.background.paper,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0) 100%)',
          opacity: hasThumbnail ? 1 : 0.7,
          transition: 'background 0.3s, opacity 0.3s',
        },
        '&:hover': {
          transform: 'scale(1.03)',
          boxShadow: `0 8px 30px ${alpha(difficultyColor, 0.3)}`,
          '& .play-icon': {
            opacity: 1,
            transform: 'scale(1.2)',
          },
          '&::before': {
            background:
              'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.1) 100%)',
          },
        },
      }}
    >
      <Box
        className="play-icon"
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%) scale(1)',
          color: '#fff',
          opacity: 0.8,
          transition: 'all 0.3s ease',
          pointerEvents: 'none',
        }}
      >
        <PlayArrow sx={{ fontSize: 60 }} />
      </Box>

      <Box sx={{ p: 2, zIndex: 1, color: '#fff' }}>
        <Typography
          variant="h6"
          sx={{ fontWeight: 'bold', mb: 1, textShadow: '1px 1px 3px #000' }}
        >
          {video.title}
        </Typography>
        <Grid
          container
          justifyContent="space-between"
          alignItems="center"
          spacing={1}
        >
          <Grid item>
            <Chip
              icon={<Diamond fontSize="small" />}
              label={`${video.rewards.meritos} M`}
              size="small"
              sx={{
                background: alpha(theme.palette.primary.light, 0.2),
                color: '#fff',
                fontWeight: 500,
                border: `1px solid ${alpha(theme.palette.primary.light, 0.3)}`,
              }}
            />
          </Grid>
          <Grid item>
            <Chip
              icon={<Bolt fontSize="small" />}
              label={`${video.rewards.ondas} Ö`}
              size="small"
              sx={{
                background: alpha(theme.palette.secondary.light, 0.2),
                color: '#fff',
                fontWeight: 500,
                border: `1px solid ${alpha(theme.palette.secondary.light, 0.3)}`,
              }}
            />
          </Grid>
        </Grid>
      </Box>
      <LinearProgress
        variant="determinate"
        value={video.progress}
        sx={{
          height: 6,
          borderBottomLeftRadius: 12,
          borderBottomRightRadius: 12,
          backgroundColor: alpha('#fff', 0.2),
          '& .MuiLinearProgress-bar': {
            backgroundColor: difficultyColor,
          },
        }}
      />
      <Chip
        label={getDifficultyLabel(video.difficulty)}
        size="small"
        sx={{
          position: 'absolute',
          top: 12,
          right: 12,
          zIndex: 2,
          background: difficultyColor,
          color: theme.palette.getContrastText(difficultyColor),
          fontWeight: 'bold',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
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
        <Typography
          variant="h4"
          sx={{
            mt: 5,
            mb: 3,
            fontWeight: 'bold',
            color: theme.palette.text.primary,
            letterSpacing: '-0.5px',
          }}
        >
          Explora tus Sendas de Aprendizaje
        </Typography>
        <Grid container spacing={4}>
          {playlistsData?.map(playlist => (
            <Grid item xs={12} key={playlist.id}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  background: 'transparent',
                  border: `1px solid ${theme.palette.divider}`,
                }}
              >
                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="h5"
                    sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}
                  >
                    {playlist.name}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      mb: 2,
                      color: theme.palette.text.secondary,
                      maxWidth: '80ch',
                    }}
                  >
                    {playlist.description ||
                      'Explora esta colección de videos para expandir tu conciencia.'}
                  </Typography>
                </Box>
                <Divider
                  sx={{
                    mb: 3,
                    '&::before, &::after': {
                      borderColor: theme.palette.divider,
                    },
                  }}
                >
                  <Chip
                    label="Contenido"
                    icon={<WorkspacePremium />}
                    size="small"
                  />
                </Divider>
                <Grid container spacing={3}>
                  {playlist.videoItems.map(video => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={video.id}>
                      <VideoCard
                        video={adaptBackendVideoToVideoItem(
                          video,
                          playlist.imageUrl
                        )}
                        onPlay={() => handlePlayAction(playlist, video)}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ position: 'fixed', bottom: 24, right: 24, zIndex: 1000 }}>
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
