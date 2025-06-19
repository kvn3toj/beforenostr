import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  CircularProgress,
  Alert,
  Chip,
  IconButton,
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  Quiz as QuizIcon,
  AccessTime as TimeIcon,
} from '@mui/icons-material';
import { backendApi } from '../../services/backend-api.service';

interface VideoItem {
  id: number;
  title: string;
  description: string;
  youtubeId: string;
  duration: number;
  questionCount?: number;
  thumbnailUrl?: string;
  createdAt: string;
}

interface VideoCardProps {
  video: VideoItem;
  onPlay: (video: VideoItem) => void;
}

const VideoCard: React.FC<VideoCardProps> = ({ video, onPlay }) => {
  // Generar URL del thumbnail de YouTube
  const thumbnailUrl = video.thumbnailUrl || 
    `https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`;

  const formatDuration = (seconds: number): string => {
    if (!seconds) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        transition: 'transform 0.2s ease-in-out',
        '&:hover': {
          transform: 'scale(1.02)',
        }
      }}
    >
      <CardMedia
        component="img"
        height="200"
        image={thumbnailUrl}
        alt={video.title}
        onError={(e) => {
          // Fallback a thumbnail de resolución menor si falla
          const target = e.target as HTMLImageElement;
          if (!target.src.includes('hqdefault')) {
            target.src = `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`;
          }
        }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" component="h3" gutterBottom>
          {video.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          {video.description}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
          {video.duration > 0 && (
            <Chip
              icon={<TimeIcon />}
              label={formatDuration(video.duration)}
              size="small"
              variant="outlined"
            />
          )}
          {(video.questionCount ?? 0) > 0 && (
            <Chip
              icon={<QuizIcon />}
              label={`${video.questionCount} preguntas`}
              size="small"
              variant="outlined"
              color="primary"
            />
          )}
        </Box>
      </CardContent>
      <CardActions>
        <Button
          variant="contained"
          fullWidth
          startIcon={<PlayIcon />}
          onClick={() => onPlay(video)}
        >
          Reproducir
        </Button>
      </CardActions>
    </Card>
  );
};

export const UPlayDashboard: React.FC = () => {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🎬 Cargando videos desde backend NestJS...');
      const videoItems = await backendApi.getVideoItems();
      
      console.log('🎬 Videos recibidos:', videoItems.length);
      
      // Cargar preguntas para cada video
      const videosWithQuestions = await Promise.all(
        videoItems.map(async (video) => {
          try {
            // Solo cargar preguntas si el ID es numérico (válido para backend)
            if (video.id && typeof video.id === 'number') {
              const questions = await backendApi.getQuestionsForVideo(video.id.toString());
              return {
                ...video,
                questionCount: questions?.length || 0,
              };
            }
            return {
              ...video,
              questionCount: 0,
            };
          } catch (questionError) {
            console.warn(`Error cargando preguntas para video ${video.id}:`, questionError);
            return {
              ...video,
              questionCount: 0,
            };
          }
        })
      );

      setVideos(videosWithQuestions);
    } catch (err) {
      console.error('❌ Error cargando videos:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const handlePlayVideo = (video: VideoItem) => {
    console.log('▶️ Reproducir video:', video);
    // TODO: Navegar al reproductor de video o abrir modal
    // navigate(`/uplay/video/${video.id}`);
    alert(`Reproduciendo: ${video.title}\nYouTube ID: ${video.youtubeId}`);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Cargando videos...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert 
        severity="error" 
        action={
          <Button color="inherit" onClick={loadVideos}>
            Reintentar
          </Button>
        }
      >
        Error al cargar videos: {error}
      </Alert>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box py={4}>
        <Typography variant="h3" component="h1" gutterBottom>
          🎮 ÜPlay Dashboard
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          Videos interactivos con gamificación educativa
        </Typography>

        {videos.length === 0 ? (
          <Alert severity="info">
            No hay videos disponibles en este momento.
          </Alert>
        ) : (
          <>
            <Typography variant="h5" sx={{ mb: 3 }}>
              📹 Videos Disponibles ({videos.length})
            </Typography>
            <Grid container spacing={3}>
              {videos.map((video) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={video.id}>
                  <VideoCard video={video} onPlay={handlePlayVideo} />
                </Grid>
              ))}
            </Grid>
          </>
        )}
      </Box>
    </Container>
  );
};