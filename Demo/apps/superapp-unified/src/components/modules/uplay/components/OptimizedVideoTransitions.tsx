import React, { useState, useTransition, useCallback, useEffect, useMemo } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  LinearProgress,
  Chip,
  IconButton,
  Fade,
  Zoom,
  CircularProgress,
  Alert,
  Skeleton,
  Grid,
  useTheme,
  alpha,
  Tooltip,
  Collapse,
} from '@mui/material';

// Icons
import {
  PlayArrow,
  Pause,
  SkipNext,
  SkipPrevious,
  Forward10,
  Replay10,
  VolumeUp,
  VolumeOff,
  Fullscreen,
  FullscreenExit,
  Settings,
  ClosedCaption,
  Speed,
  HighQuality,
  NetworkCheck,
  CheckCircle,
  Star,
  Quiz,
  Timer,
  Lightbulb,
} from '@mui/icons-material';

// ===== 🎯 TIPOS Y INTERFACES ===== //
interface VideoTransitionState {
  isLoadingVideo: boolean;
  isChangingQuality: boolean;
  isSeekingPosition: boolean;
  isChangingPlaylist: boolean;
  isProcessingInteraction: boolean;
  currentAction: string | null;
}

interface VideoMetadata {
  id: string;
  title: string;
  duration: number;
  currentTime: number;
  isPlaying: boolean;
  quality: '360p' | '720p' | '1080p' | 'auto';
  playbackSpeed: 0.5 | 0.75 | 1 | 1.25 | 1.5 | 2;
  volume: number;
  isMuted: boolean;
  hasSubtitles: boolean;
  isFullscreen: boolean;
  bufferProgress: number;
  questionsCount: number;
  completedQuestions: number;
  rewards: {
    meritos: number;
    ondas: number;
  };
}

interface OptimizedVideoTransitionsProps {
  videoId: string;
  onVideoComplete?: (videoId: string) => void;
  onQuestionAnswer?: (questionId: string, answer: any) => void;
  showTransitionIndicators?: boolean;
  enableSmartPreloading?: boolean;
  cosmicEffects?: boolean;
}

// ===== 🎬 MOCK VIDEO DATA ===== //
const mockVideoData: VideoMetadata = {
  id: 'uplay-demo-video',
  title: 'Fundamentos de Gamificación Educativa',
  duration: 480, // 8 minutos en segundos
  currentTime: 0,
  isPlaying: false,
  quality: '720p',
  playbackSpeed: 1,
  volume: 75,
  isMuted: false,
  hasSubtitles: true,
  isFullscreen: false,
  bufferProgress: 0,
  questionsCount: 8,
  completedQuestions: 0,
  rewards: {
    meritos: 85,
    ondas: 55,
  },
};

// ===== 🧠 COMPONENTE PRINCIPAL ===== //
export const OptimizedVideoTransitions: React.FC<OptimizedVideoTransitionsProps> = ({
  videoId,
  onVideoComplete,
  onQuestionAnswer,
  showTransitionIndicators = true,
  enableSmartPreloading = true,
  cosmicEffects = true,
}) => {
  const theme = useTheme();

  // 🔄 ESTADO DEL VIDEO
  const [videoMetadata, setVideoMetadata] = useState<VideoMetadata>(mockVideoData);
  const [showControls, setShowControls] = useState(true);
  const [showSettings, setShowSettings] = useState(false);

  // 🚀 REACT 18 STARTTRANSITION PARA TRANSICIONES SUAVES
  const [isPending, startTransition] = useTransition();
  const [transitionState, setTransitionState] = useState<VideoTransitionState>({
    isLoadingVideo: false,
    isChangingQuality: false,
    isSeekingPosition: false,
    isChangingPlaylist: false,
    isProcessingInteraction: false,
    currentAction: null,
  });

  // 🎯 FUNCIONES DE CONTROL OPTIMIZADAS CON STARTTRANSITION

  // Control de reproducción/pausa
  const togglePlayPause = useCallback(() => {
    setTransitionState(prev => ({
      ...prev,
      isProcessingInteraction: true,
      currentAction: videoMetadata.isPlaying ? 'Pausando video...' : 'Iniciando reproducción...'
    }));

    startTransition(() => {
      setVideoMetadata(prev => ({
        ...prev,
        isPlaying: !prev.isPlaying
      }));

      // Simular tiempo de procesamiento para una UX suave
      setTimeout(() => {
        setTransitionState(prev => ({
          ...prev,
          isProcessingInteraction: false,
          currentAction: null
        }));
      }, 200);
    });
  }, [videoMetadata.isPlaying]);

  // Cambio de calidad de video
  const changeVideoQuality = useCallback((newQuality: VideoMetadata['quality']) => {
    setTransitionState(prev => ({
      ...prev,
      isChangingQuality: true,
      currentAction: `Cambiando a calidad ${newQuality}...`
    }));

    startTransition(() => {
      setVideoMetadata(prev => ({
        ...prev,
        quality: newQuality
      }));

      // Simular tiempo de cambio de calidad
      setTimeout(() => {
        setTransitionState(prev => ({
          ...prev,
          isChangingQuality: false,
          currentAction: null
        }));
      }, 800);
    });
  }, []);

  // Navegación temporal (seek)
  const seekToPosition = useCallback((newTime: number) => {
    setTransitionState(prev => ({
      ...prev,
      isSeekingPosition: true,
      currentAction: `Navegando a ${Math.floor(newTime / 60)}:${(newTime % 60).toString().padStart(2, '0')}...`
    }));

    startTransition(() => {
      setVideoMetadata(prev => ({
        ...prev,
        currentTime: Math.max(0, Math.min(newTime, prev.duration))
      }));

      // Precargar contenido si está habilitado
      if (enableSmartPreloading) {
        setTimeout(() => {
          console.log('🔄 Precargando contenido alrededor de la nueva posición');
        }, 300);
      }

      setTimeout(() => {
        setTransitionState(prev => ({
          ...prev,
          isSeekingPosition: false,
          currentAction: null
        }));
      }, 400);
    });
  }, [enableSmartPreloading]);

  // Cambio de velocidad de reproducción
  const changePlaybackSpeed = useCallback((newSpeed: VideoMetadata['playbackSpeed']) => {
    setTransitionState(prev => ({
      ...prev,
      isProcessingInteraction: true,
      currentAction: `Ajustando velocidad a ${newSpeed}x...`
    }));

    startTransition(() => {
      setVideoMetadata(prev => ({
        ...prev,
        playbackSpeed: newSpeed
      }));

      setTimeout(() => {
        setTransitionState(prev => ({
          ...prev,
          isProcessingInteraction: false,
          currentAction: null
        }));
      }, 300);
    });
  }, []);

  // Avanzar/retroceder 10 segundos
  const skip10Seconds = useCallback((forward: boolean) => {
    const direction = forward ? 'adelante' : 'atrás';
    setTransitionState(prev => ({
      ...prev,
      isSeekingPosition: true,
      currentAction: `Saltando 10s ${direction}...`
    }));

    startTransition(() => {
      const offset = forward ? 10 : -10;
      setVideoMetadata(prev => ({
        ...prev,
        currentTime: Math.max(0, Math.min(prev.currentTime + offset, prev.duration))
      }));

      setTimeout(() => {
        setTransitionState(prev => ({
          ...prev,
          isSeekingPosition: false,
          currentAction: null
        }));
      }, 300);
    });
  }, []);

  // Cargar nuevo video
  const loadNewVideo = useCallback((newVideoId: string) => {
    setTransitionState(prev => ({
      ...prev,
      isLoadingVideo: true,
      currentAction: `Cargando video ${newVideoId}...`
    }));

    startTransition(() => {
      // Simular carga de nuevo video
      setTimeout(() => {
        setVideoMetadata(prev => ({
          ...prev,
          id: newVideoId,
          currentTime: 0,
          isPlaying: false,
          completedQuestions: 0
        }));

        setTransitionState(prev => ({
          ...prev,
          isLoadingVideo: false,
          currentAction: null
        }));

        console.log(`🎬 Video ${newVideoId} cargado con startTransition`);
      }, 1500);
    });
  }, []);

  // 🎯 DATOS COMPUTADOS
  const progressPercentage = useMemo(() =>
    (videoMetadata.currentTime / videoMetadata.duration) * 100,
    [videoMetadata.currentTime, videoMetadata.duration]
  );

  const questionsProgressPercentage = useMemo(() =>
    (videoMetadata.completedQuestions / videoMetadata.questionsCount) * 100,
    [videoMetadata.completedQuestions, videoMetadata.questionsCount]
  );

  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  // 🎨 EFECTOS DE SIMULACIÓN
  useEffect(() => {
    if (videoMetadata.isPlaying) {
      const interval = setInterval(() => {
        setVideoMetadata(prev => {
          const newTime = prev.currentTime + 1;
          if (newTime >= prev.duration) {
            onVideoComplete?.(prev.id);
            return { ...prev, currentTime: prev.duration, isPlaying: false };
          }
          return { ...prev, currentTime: newTime };
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [videoMetadata.isPlaying, onVideoComplete]);

  // 🎨 COMPONENTE DE CARGA OPTIMIZADO
  const TransitionIndicator = () => (
    showTransitionIndicators && transitionState.currentAction && (
      <Fade in={true} timeout={200}>
        <Alert
          severity="info"
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            zIndex: 1000,
            borderRadius: 2,
            backdropFilter: 'blur(10px)',
            backgroundColor: alpha(theme.palette.background.paper, 0.9),
          }}
          icon={<CircularProgress size={20} />}
        >
          <Typography variant="body2">
            {transitionState.currentAction}
          </Typography>
        </Alert>
      </Fade>
    )
  );

  // 📊 BARRA DE PROGRESO PRINCIPAL
  const ProgressBar = () => (
    <Box sx={{ position: 'relative', width: '100%' }}>
      <LinearProgress
        variant="determinate"
        value={progressPercentage}
        sx={{
          height: 6,
          borderRadius: 3,
          backgroundColor: alpha(theme.palette.common.white, 0.3),
          '& .MuiLinearProgress-bar': {
            borderRadius: 3,
            background: cosmicEffects
              ? 'linear-gradient(90deg, #6366f1, #8b5cf6)'
              : theme.palette.primary.main,
            transition: transitionState.isSeekingPosition ? 'none' : 'transform 0.3s ease',
          },
        }}
      />

      {/* Buffer progress */}
      <LinearProgress
        variant="determinate"
        value={videoMetadata.bufferProgress}
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 6,
          borderRadius: 3,
          backgroundColor: 'transparent',
          '& .MuiLinearProgress-bar': {
            borderRadius: 3,
            backgroundColor: alpha(theme.palette.common.white, 0.4),
          },
        }}
      />

      {/* Indicadores de transición en la barra */}
      {(transitionState.isSeekingPosition || isPending) && (
        <Box
          sx={{
            position: 'absolute',
            top: -2,
            left: `${progressPercentage}%`,
            width: 10,
            height: 10,
            borderRadius: '50%',
            backgroundColor: theme.palette.primary.main,
            boxShadow: `0 0 10px ${theme.palette.primary.main}`,
            animation: 'pulse 1s infinite',
            '@keyframes pulse': {
              '0%': { transform: 'scale(1)', opacity: 1 },
              '50%': { transform: 'scale(1.2)', opacity: 0.7 },
              '100%': { transform: 'scale(1)', opacity: 1 },
            },
          }}
        />
      )}
    </Box>
  );

  // 🎮 CONTROLES DEL REPRODUCTOR
  const PlayerControls = () => (
    <Fade in={showControls} timeout={300}>
      <Box
        sx={{
          p: 2,
          background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
          transition: 'all 0.3s ease',
          opacity: transitionState.isProcessingInteraction ? 0.8 : 1,
        }}
      >
        {/* Barra de progreso */}
        <Box sx={{ mb: 2 }}>
          <ProgressBar />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
            <Typography variant="caption" color="white">
              {formatTime(videoMetadata.currentTime)}
            </Typography>
            <Typography variant="caption" color="white">
              {formatTime(videoMetadata.duration)}
            </Typography>
          </Box>
        </Box>

        {/* Controles principales */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Tooltip title="Retroceder 10s">
              <IconButton
                size="small"
                sx={{ color: 'white' }}
                onClick={() => skip10Seconds(false)}
                disabled={transitionState.isSeekingPosition}
              >
                <Replay10 />
              </IconButton>
            </Tooltip>

            <Tooltip title={videoMetadata.isPlaying ? "Pausar" : "Reproducir"}>
              <IconButton
                size="large"
                sx={{
                  color: 'white',
                  backgroundColor: alpha(theme.palette.primary.main, 0.2),
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.3),
                  },
                  transition: 'all 0.3s ease',
                  transform: transitionState.isProcessingInteraction ? 'scale(0.9)' : 'scale(1)',
                }}
                onClick={togglePlayPause}
                disabled={transitionState.isProcessingInteraction}
              >
                {videoMetadata.isPlaying ? <Pause /> : <PlayArrow />}
              </IconButton>
            </Tooltip>

            <Tooltip title="Avanzar 10s">
              <IconButton
                size="small"
                sx={{ color: 'white' }}
                onClick={() => skip10Seconds(true)}
                disabled={transitionState.isSeekingPosition}
              >
                <Forward10 />
              </IconButton>
            </Tooltip>

            <Chip
              icon={<Speed />}
              label={`${videoMetadata.playbackSpeed}x`}
              size="small"
              clickable
              onClick={() => {
                const speeds: VideoMetadata['playbackSpeed'][] = [0.5, 0.75, 1, 1.25, 1.5, 2];
                const currentIndex = speeds.indexOf(videoMetadata.playbackSpeed);
                const nextSpeed = speeds[(currentIndex + 1) % speeds.length];
                changePlaybackSpeed(nextSpeed);
              }}
              sx={{
                color: 'white',
                borderColor: 'white',
                transition: 'all 0.3s ease',
                opacity: transitionState.isProcessingInteraction ? 0.6 : 1,
              }}
            />
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip
              icon={<HighQuality />}
              label={videoMetadata.quality}
              size="small"
              clickable
              onClick={() => {
                const qualities: VideoMetadata['quality'][] = ['360p', '720p', '1080p', 'auto'];
                const currentIndex = qualities.indexOf(videoMetadata.quality);
                const nextQuality = qualities[(currentIndex + 1) % qualities.length];
                changeVideoQuality(nextQuality);
              }}
              sx={{
                color: 'white',
                borderColor: 'white',
                transition: 'all 0.3s ease',
                opacity: transitionState.isChangingQuality ? 0.6 : 1,
              }}
            />

            <Tooltip title="Configuración">
              <IconButton
                size="small"
                sx={{ color: 'white' }}
                onClick={() => setShowSettings(!showSettings)}
              >
                <Settings />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Box>
    </Fade>
  );

  // 📈 PANEL DE MÉTRICAS GAMIFICADAS
  const GamificationMetrics = () => (
    <Collapse in={!transitionState.isLoadingVideo} timeout={500}>
      <Box sx={{ p: 2, backgroundColor: alpha(theme.palette.background.paper, 0.95) }}>
        <Typography variant="h6" gutterBottom>
          Progreso de Aprendizaje
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Preguntas Completadas</Typography>
                <Typography variant="body2" fontWeight="bold">
                  {videoMetadata.completedQuestions}/{videoMetadata.questionsCount}
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={questionsProgressPercentage}
                sx={{
                  height: 6,
                  borderRadius: 3,
                  '& .MuiLinearProgress-bar': {
                    background: 'linear-gradient(90deg, #4caf50, #8bc34a)',
                  },
                }}
              />
            </Box>
          </Grid>

          <Grid item xs={6}>
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
              <Chip
                icon={<Star />}
                label={`${videoMetadata.rewards.meritos} Mëritos`}
                size="small"
                color="primary"
                sx={{
                  transition: 'all 0.3s ease',
                  transform: transitionState.isProcessingInteraction ? 'scale(0.95)' : 'scale(1)',
                }}
              />
              <Chip
                icon={<Lightbulb />}
                label={`${videoMetadata.rewards.ondas} Öndas`}
                size="small"
                color="secondary"
                sx={{
                  transition: 'all 0.3s ease',
                  transform: transitionState.isProcessingInteraction ? 'scale(0.95)' : 'scale(1)',
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Collapse>
  );

  // 🎨 RENDERIZADO PRINCIPAL
  return (
    <Card
      sx={{
        position: 'relative',
        maxWidth: 800,
        mx: 'auto',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        opacity: transitionState.isLoadingVideo ? 0.7 : 1,
      }}
    >
      <Box
        sx={{
          position: 'relative',
          paddingTop: '56.25%', // 16:9 aspect ratio
          backgroundColor: '#000',
          overflow: 'hidden',
        }}
      >
        {/* Video placeholder */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: transitionState.isLoadingVideo
              ? 'linear-gradient(45deg, #1a1a1a, #333)'
              : 'linear-gradient(45deg, #0f0f23, #1a1a3e)',
            transition: 'all 0.5s ease',
          }}
        >
          {transitionState.isLoadingVideo ? (
            <Box sx={{ textAlign: 'center', color: 'white' }}>
              <CircularProgress size={60} sx={{ mb: 2 }} />
              <Typography variant="h6">Cargando video...</Typography>
            </Box>
          ) : (
            <Typography variant="h4" color="white" fontWeight="bold">
              🎬 {videoMetadata.title}
            </Typography>
          )}
        </Box>

        {/* Indicador de transición */}
        <TransitionIndicator />

        {/* Controles del reproductor */}
        <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
          <PlayerControls />
        </Box>

        {/* Indicador de estado global */}
        {(isPending || Object.values(transitionState).some(Boolean)) && (
          <LinearProgress
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 3,
              backgroundColor: 'transparent',
              '& .MuiLinearProgress-bar': {
                background: cosmicEffects
                  ? 'linear-gradient(90deg, #6366f1, #8b5cf6, #ec4899)'
                  : theme.palette.primary.main,
              },
            }}
          />
        )}
      </Box>

      {/* Panel de métricas */}
      <GamificationMetrics />

      {/* Botones de demostración */}
      <Box sx={{ p: 2, backgroundColor: alpha(theme.palette.background.default, 0.5) }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          🚀 Demostración de startTransition en acción:
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Button
            size="small"
            variant="outlined"
            onClick={() => loadNewVideo('demo-video-2')}
            disabled={transitionState.isLoadingVideo}
          >
            Cargar Nuevo Video
          </Button>
          <Button
            size="small"
            variant="outlined"
            onClick={() => seekToPosition(240)} // 4 minutos
            disabled={transitionState.isSeekingPosition}
          >
            Saltar a 4:00
          </Button>
          <Button
            size="small"
            variant="outlined"
            onClick={() => changeVideoQuality('1080p')}
            disabled={transitionState.isChangingQuality}
          >
            Cambiar a 1080p
          </Button>
        </Box>
      </Box>
    </Card>
  );
};

export default OptimizedVideoTransitions;
