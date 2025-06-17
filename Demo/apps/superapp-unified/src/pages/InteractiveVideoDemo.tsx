import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Chip,
  Stack,
  Alert,
  Paper,
  Divider,
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  Quiz as QuizIcon,
  EmojiEvents as TrophyIcon,
  Star as StarIcon,
} from '@mui/icons-material';

import InteractiveVideoPlayerOverlay from '../components/modules/uplay/components/InteractiveVideoPlayerOverlay';

// Demo video data
const demoVideos = [
  {
    id: 1,
    title: 'Introducción a CoomÜnity: Principios de Ayni',
    description:
      'Aprende sobre el principio fundamental de reciprocidad en nuestra comunidad',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    thumbnail: '/api/placeholder/300/200',
    duration: 596, // 9:56
    level: 'Básico',
    merits: 15,
    category: 'Fundamentos',
  },
  {
    id: 2,
    title: 'Ganando Mëritos: Contribuyendo al Bien Común',
    description:
      'Descubre cómo ganar mëritos contribuyendo positivamente a la comunidad',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    thumbnail: '/api/placeholder/300/200',
    duration: 653, // 10:53
    level: 'Intermedio',
    merits: 25,
    category: 'Gamificación',
  },
  {
    id: 3,
    title: 'Öndas Vibratorias: Energía Positiva en Acción',
    description:
      'Comprende cómo las vibraciones positivas impactan nuestra red',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnail: '/api/placeholder/300/200',
    duration: 15, // Perfect for quick demo
    level: 'Avanzado',
    merits: 35,
    category: 'Filosofía',
  },
];

// Demo questions specific to each video
const demoQuestions = {
  1: [
    {
      id: 1,
      timestamp: 10,
      endTimestamp: 40,
      type: 'multiple-choice' as const,
      question: '¿Qué significa el principio de Ayni en CoomÜnity?',
      options: [
        {
          id: 'option_a',
          label: 'A',
          text: 'Reciprocidad y equilibrio en las relaciones',
        },
        {
          id: 'option_b',
          label: 'B',
          text: 'Competencia entre miembros de la comunidad',
        },
      ],
    },
  ],
  2: [
    {
      id: 2,
      timestamp: 15,
      endTimestamp: 45,
      type: 'true-false' as const,
      question: '¿Los Mëritos se ganan únicamente completando desafíos?',
      options: [
        {
          id: 'option_true',
          label: 'Verdadero',
          text: 'Sí, solo completando desafíos',
        },
        {
          id: 'option_false',
          label: 'Falso',
          text: 'No, también ayudando a otros miembros',
        },
      ],
    },
  ],
  3: [
    {
      id: 3,
      timestamp: 5,
      endTimestamp: 25,
      type: 'multiple-choice' as const,
      question: '¿Cómo se generan las Öndas positivas en CoomÜnity?',
      options: [
        {
          id: 'option_a',
          label: 'A',
          text: 'A través de acciones que benefician a la comunidad',
        },
        {
          id: 'option_b',
          label: 'B',
          text: 'Solo mediante donaciones monetarias',
        },
      ],
    },
  ],
};

const InteractiveVideoDemo: React.FC = () => {
  const [selectedVideo, setSelectedVideo] = useState<
    (typeof demoVideos)[0] | null
  >(null);
  const [playerKey, setPlayerKey] = useState(0); // For forcing re-render
  const [userMetrics, setUserMetrics] = useState({
    merits: 6,
    ondas: 12,
    level: 3,
    experience: 450,
    totalQuestions: 0,
    correctAnswers: 0,
  });

  const handleVideoSelect = (video: (typeof demoVideos)[0]) => {
    setSelectedVideo(video);
    setPlayerKey((prev) => prev + 1); // Force re-render of player
  };

  const handleQuestionAnswer = (questionId: number, answerId: string) => {
    // Update user metrics
    setUserMetrics((prev) => ({
      ...prev,
      merits: prev.merits + 2,
      experience: prev.experience + 25,
      totalQuestions: prev.totalQuestions + 1,
      correctAnswers: prev.correctAnswers + (Math.random() > 0.3 ? 1 : 0), // 70% correct rate for demo
    }));

    console.log('Question answered:', { questionId, answerId });
  };

  const handleVideoComplete = () => {
    setUserMetrics((prev) => ({
      ...prev,
      merits: prev.merits + 10,
      experience: prev.experience + 100,
      ondas: prev.ondas + 2,
    }));

    console.log('Video completed!');
  };

  const handleMetricsUpdate = (metrics: any) => {
    setUserMetrics((prev) => ({ ...prev, ...metrics }));
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          🎮 ÜPlay - Reproductor Interactivo
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Experimenta nuestro reproductor de video gamificado con preguntas
          interactivas
        </Typography>

        {/* User Stats */}
        <Paper
          sx={{
            p: 2,
            mt: 2,
            bgcolor: 'linear-gradient(135deg, #E91E63 0%, #9C27B0 100%)',
          }}
        >
          <Stack direction="row" spacing={3} alignItems="center">
            <Chip
              icon={<TrophyIcon />}
              label={`${userMetrics.merits} Mëritos`}
              sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
            />
            <Chip
              icon={<StarIcon />}
              label={`${userMetrics.ondas} Öndas`}
              sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
            />
            <Chip
              label={`Nivel ${userMetrics.level}`}
              sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
            />
            <Chip
              label={`${userMetrics.correctAnswers}/${userMetrics.totalQuestions} Correctas`}
              sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
            />
          </Stack>
        </Paper>
      </Box>

      <Grid container spacing={3}>
        {/* Video Player */}
        <Grid size={{xs:12,lg:8}}>
          {selectedVideo ? (
            <Box>
              <Card sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    {selectedVideo.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" paragraph>
                    {selectedVideo.description}
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                    <Chip
                      label={selectedVideo.category}
                      color="primary"
                      size="small"
                    />
                    <Chip
                      label={selectedVideo.level}
                      variant="outlined"
                      size="small"
                    />
                    <Chip
                      label={`${selectedVideo.merits} Mëritos`}
                      color="secondary"
                      size="small"
                    />
                    <Chip
                      label={formatDuration(selectedVideo.duration)}
                      size="small"
                    />
                  </Stack>
                </CardContent>
              </Card>

              <InteractiveVideoPlayerOverlay
                key={playerKey}
                videoUrl={selectedVideo.url}
                questions={
                  demoQuestions[
                    selectedVideo.id as keyof typeof demoQuestions
                  ] || []
                }
                onQuestionAnswer={handleQuestionAnswer}
                onVideoComplete={handleVideoComplete}
                onMetricsUpdate={handleMetricsUpdate}
                isLandscape={true}
                autoplay={false}
              />

              <Alert severity="info" sx={{ mt: 2 }}>
                <Typography variant="body2">
                  💡 <strong>Tip:</strong> Las preguntas aparecerán
                  automáticamente durante la reproducción. En el video corto (15
                  segundos), la pregunta aparece a los 5 segundos para una
                  demostración rápida.
                </Typography>
              </Alert>
            </Box>
          ) : (
            <Card
              sx={{
                height: 400,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <CardContent sx={{ textAlign: 'center' }}>
                <QuizIcon
                  sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }}
                />
                <Typography variant="h6" gutterBottom>
                  Selecciona un video para comenzar
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Elige un video de la lista para experimentar el reproductor
                  interactivo
                </Typography>
              </CardContent>
            </Card>
          )}
        </Grid>

        {/* Video List */}
        <Grid size={{xs:12,lg:4}}>
          <Typography variant="h6" gutterBottom>
            📚 Videos Disponibles
          </Typography>

          <Stack spacing={2}>
            {demoVideos.map((video) => (
              <Card
                key={video.id}
                sx={{
                  cursor: 'pointer',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: 4,
                  },
                  border:
                    selectedVideo?.id === video.id
                      ? '2px solid'
                      : '1px solid transparent',
                  borderColor:
                    selectedVideo?.id === video.id
                      ? 'primary.main'
                      : 'transparent',
                }}
                onClick={() => handleVideoSelect(video)}
              >
                <CardContent>
                  <Box
                    sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}
                  >
                    <Box
                      sx={{
                        width: 80,
                        height: 60,
                        backgroundColor: '#E0E0E0',
                        borderRadius: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <PlayIcon sx={{ color: 'text.secondary' }} />
                    </Box>

                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="subtitle2" gutterBottom noWrap>
                        {video.title}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: 'block', mb: 1 }}
                      >
                        {video.description}
                      </Typography>
                      <Stack direction="row" spacing={0.5} flexWrap="wrap">
                        <Chip
                          label={video.level}
                          size="small"
                          variant="outlined"
                        />
                        <Chip
                          label={formatDuration(video.duration)}
                          size="small"
                        />
                        <Chip
                          label={`+${video.merits} Mëritos`}
                          size="small"
                          color="primary"
                        />
                      </Stack>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Stack>

          <Divider sx={{ my: 3 }} />

          {/* Instructions */}
          <Typography variant="h6" gutterBottom>
            🎯 Instrucciones
          </Typography>
          <Card sx={{ bgcolor: 'grey.50' }}>
            <CardContent>
              <Typography variant="body2" paragraph>
                <strong>1.</strong> Selecciona un video de la lista
              </Typography>
              <Typography variant="body2" paragraph>
                <strong>2.</strong> Inicia la reproducción haciendo clic en play
              </Typography>
              <Typography variant="body2" paragraph>
                <strong>3.</strong> Las preguntas aparecerán automáticamente
                durante el video
              </Typography>
              <Typography variant="body2" paragraph>
                <strong>4.</strong> Responde para ganar Mëritos y Öndas
              </Typography>
              <Typography variant="body2">
                <strong>💡 Recomendación:</strong> Prueba el video de 15
                segundos para una demostración rápida
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default InteractiveVideoDemo;
