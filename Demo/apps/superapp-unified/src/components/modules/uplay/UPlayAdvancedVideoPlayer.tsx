import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Dialog,
  DialogContent,
  IconButton,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  LinearProgress,
  Avatar,
  Fab,
  Slide,
  useTheme,
  useMediaQuery,
  alpha,
  keyframes,
} from '@mui/material';
import {
  Close,
  PlayArrow,
  Pause,
  VolumeUp,
  VolumeOff,
  Fullscreen,
  FullscreenExit,
  Forward10,
  Replay10,
  Settings,
  Diamond,
  Bolt,
  Star,
  CheckCircle,
  AutoAwesome,
  Celebration,
  QuestionMark,
} from '@mui/icons-material';

// Animaciones
const celebrationAnimation = keyframes`
  0% { transform: scale(1) rotate(0deg); opacity: 1; }
  50% { transform: scale(1.2) rotate(180deg); opacity: 0.8; }
  100% { transform: scale(1) rotate(360deg); opacity: 1; }
`;

const rewardPopupAnimation = keyframes`
  0% { transform: translateY(50px) scale(0.8); opacity: 0; }
  50% { transform: translateY(-10px) scale(1.1); opacity: 1; }
  100% { transform: translateY(0) scale(1); opacity: 1; }
`;

const questionPulse = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(255, 193, 7, 0.5); }
  50% { box-shadow: 0 0 40px rgba(255, 193, 7, 0.8); }
`;

interface Question {
  id: string;
  timestamp: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  rewards: {
    meritos: number;
    ondas: number;
  };
}

interface UPlayAdvancedVideoPlayerProps {
  videoId: string;
  open: boolean;
  onClose: () => void;
}

const UPlayAdvancedVideoPlayer: React.FC<UPlayAdvancedVideoPlayerProps> = ({
  videoId,
  open,
  onClose,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const videoRef = useRef<HTMLVideoElement>(null);

  // Estados del reproductor
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [playbackRate, setPlaybackRate] = useState(1);

  // Estados de gamificación
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [showQuestion, setShowQuestion] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answeredCorrectly, setAnsweredCorrectly] = useState<boolean | null>(null);
  const [showRewards, setShowRewards] = useState(false);
  const [earnedRewards, setEarnedRewards] = useState({ meritos: 0, ondas: 0 });
  const [totalRewards, setTotalRewards] = useState({ meritos: 0, ondas: 0 });

  // Datos del video (simulados)
  const [videoData] = useState({
    id: videoId,
    title: 'Introducción a la Gamificación',
    description: 'Aprende los fundamentos de la gamificación aplicada a la educación',
    thumbnail: '🎮',
    duration: 600, // 10 minutos
    category: 'Gamificación',
    difficulty: 'medium' as const,
    instructor: {
      name: 'Dr. María González',
      avatar: '👩‍🏫',
    },
  });

  // Preguntas interactivas (simuladas)
  const [questions] = useState<Question[]>([
    {
      id: 'q1',
      timestamp: 120, // 2 minutos
      question: '¿Cuál es el elemento más importante en la gamificación educativa?',
      options: [
        'Los puntos y recompensas',
        'La motivación intrínseca del estudiante',
        'Los niveles y progresión',
        'La competencia entre usuarios'
      ],
      correctAnswer: 1,
      explanation: 'La motivación intrínseca es fundamental porque genera un aprendizaje duradero y significativo.',
      rewards: { meritos: 25, ondas: 15 },
    },
    {
      id: 'q2',
      timestamp: 300, // 5 minutos
      question: '¿Qué principio de CoomÜnity se refleja mejor en la gamificación colaborativa?',
      options: [
        'Competencia individual',
        'Reciprocidad (reciprocidad)',
        'Acumulación de riqueza',
        'Jerarquías rígidas'
      ],
      correctAnswer: 1,
      explanation: 'El Reciprocidad representa la reciprocidad y el equilibrio, valores fundamentales en el aprendizaje colaborativo.',
      rewards: { meritos: 30, ondas: 20 },
    },
    {
      id: 'q3',
      timestamp: 480, // 8 minutos
      question: '¿Cómo contribuye la gamificación al Bien Común?',
      options: [
        'Creando competencia destructiva',
        'Fomentando el aprendizaje compartido',
        'Priorizando recompensas individuales',
        'Excluyendo a participantes lentos'
      ],
      correctAnswer: 1,
      explanation: 'La gamificación bien aplicada fomenta el aprendizaje compartido y el crecimiento colectivo.',
      rewards: { meritos: 35, ondas: 25 },
    },
  ]);

  // Efectos para el manejo del video
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => setCurrentTime(video.currentTime);
    const updateDuration = () => setDuration(video.duration);

    video.addEventListener('timeupdate', updateTime);
    video.addEventListener('loadedmetadata', updateDuration);

    return () => {
      video.removeEventListener('timeupdate', updateTime);
      video.removeEventListener('loadedmetadata', updateDuration);
    };
  }, []);

  // Verificar preguntas por tiempo
  useEffect(() => {
    const questionToShow = questions.find(
      q => Math.abs(currentTime - q.timestamp) < 1 && !showQuestion
    );

    if (questionToShow && isPlaying) {
      setCurrentQuestion(questionToShow);
      setShowQuestion(true);
      setIsPlaying(false); // Pausar video para pregunta
      setSelectedAnswer(null);
      setAnsweredCorrectly(null);
    }
  }, [currentTime, questions, showQuestion, isPlaying]);

  // Controles del reproductor
  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const seekTo = (time: number) => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = time;
    setCurrentTime(time);
  };

  const skip = (seconds: number) => {
    const video = videoRef.current;
    if (!video) return;

    const newTime = Math.max(0, Math.min(duration, currentTime + seconds));
    seekTo(newTime);
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
    setIsFullscreen(!isFullscreen);
  };

  // Manejar respuesta a pregunta
  const handleAnswerQuestion = (answerIndex: number) => {
    if (!currentQuestion) return;

    setSelectedAnswer(answerIndex);
    const correct = answerIndex === currentQuestion.correctAnswer;
    setAnsweredCorrectly(correct);

    if (correct) {
      // Otorgar recompensas
      const newRewards = {
        meritos: totalRewards.meritos + currentQuestion.rewards.meritos,
        ondas: totalRewards.ondas + currentQuestion.rewards.ondas,
      };
      setTotalRewards(newRewards);
      setEarnedRewards(currentQuestion.rewards);
      setShowRewards(true);

      // Ocultar recompensas después de 3 segundos
      setTimeout(() => {
        setShowRewards(false);
      }, 3000);
    }

    // Continuar video después de 3 segundos
    setTimeout(() => {
      setShowQuestion(false);
      setCurrentQuestion(null);
      setIsPlaying(true);
      if (videoRef.current) {
        videoRef.current.play();
      }
    }, 3000);
  };

  // Formatear tiempo
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Componente de pregunta interactiva
  const InteractiveQuestion = () => {
    if (!currentQuestion || !showQuestion) return null;

    return (
      <Slide direction="up" in={showQuestion} mountOnEnter unmountOnExit>
        <Card
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: isMobile ? '90%' : '60%',
            maxWidth: 600,
            background: alpha('#000', 0.95),
            backdropFilter: 'blur(20px)',
            border: `2px solid ${alpha('#ffc107', 0.5)}`,
            borderRadius: 4,
            zIndex: 1000,
            animation: `${questionPulse} 2s ease-in-out infinite`,
          }}
        >
          <CardContent sx={{ p: 4 }}>
            {/* Icono de pregunta */}
            <Box textAlign="center" mb={3}>
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  bgcolor: alpha('#ffc107', 0.2),
                  color: '#ffc107',
                  mx: 'auto',
                  mb: 2,
                  fontSize: '2rem',
                }}
              >
                <QuestionMark sx={{ fontSize: '2rem' }} />
              </Avatar>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#ffc107' }}>
                Pregunta Interactiva
              </Typography>
            </Box>

            {/* Pregunta */}
            <Typography variant="h6" sx={{ mb: 3, textAlign: 'center', fontWeight: 'bold' }}>
              {currentQuestion.question}
            </Typography>

            {/* Opciones */}
            <Box display="flex" flexDirection="column" gap={2} mb={3}>
              {currentQuestion.options.map((option, index) => (
                <Button
                  key={index}
                  variant={selectedAnswer === index ? 'contained' : 'outlined'}
                  onClick={() => handleAnswerQuestion(index)}
                  disabled={selectedAnswer !== null}
                  sx={{
                    justifyContent: 'flex-start',
                    p: 2,
                    borderRadius: 3,
                    textAlign: 'left',
                    borderColor: selectedAnswer === index 
                      ? answeredCorrectly 
                        ? '#4caf50' 
                        : '#f44336'
                      : alpha('#ffffff', 0.3),
                    bgcolor: selectedAnswer === index 
                      ? answeredCorrectly 
                        ? alpha('#4caf50', 0.2)
                        : alpha('#f44336', 0.2)
                      : 'transparent',
                    '&:hover': {
                      borderColor: selectedAnswer === null ? '#ffc107' : undefined,
                      bgcolor: selectedAnswer === null ? alpha('#ffc107', 0.1) : undefined,
                    }
                  }}
                >
                  <Box display="flex" alignItems="center" gap={2}>
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        bgcolor: alpha('#ffc107', 0.2),
                        color: '#ffc107',
                        fontSize: '0.875rem',
                        fontWeight: 'bold',
                      }}
                    >
                      {String.fromCharCode(65 + index)}
                    </Avatar>
                    <Typography variant="body1">{option}</Typography>
                    {selectedAnswer === index && (
                      <Box ml="auto">
                        {answeredCorrectly ? (
                          <CheckCircle sx={{ color: '#4caf50' }} />
                        ) : (
                          <Close sx={{ color: '#f44336' }} />
                        )}
                      </Box>
                    )}
                  </Box>
                </Button>
              ))}
            </Box>

            {/* Explicación */}
            {selectedAnswer !== null && currentQuestion.explanation && (
              <Card
                sx={{
                  background: alpha(answeredCorrectly ? '#4caf50' : '#2196f3', 0.1),
                  border: `1px solid ${alpha(answeredCorrectly ? '#4caf50' : '#2196f3', 0.3)}`,
                  borderRadius: 2,
                  p: 2,
                  mb: 2,
                }}
              >
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                  💡 Explicación:
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {currentQuestion.explanation}
                </Typography>
              </Card>
            )}

            {/* Recompensas potenciales */}
            <Box display="flex" justifyContent="center" gap={2}>
              <Chip
                icon={<Diamond sx={{ fontSize: '16px !important' }} />}
                label={`${currentQuestion.rewards.meritos} Mëritos`}
                size="small"
                sx={{
                  bgcolor: alpha('#9c27b0', 0.2),
                  color: '#9c27b0',
                  border: `1px solid ${alpha('#9c27b0', 0.3)}`,
                }}
              />
              <Chip
                icon={<Bolt sx={{ fontSize: '16px !important' }} />}
                label={`${currentQuestion.rewards.ondas} Öndas`}
                size="small"
                sx={{
                  bgcolor: alpha('#ff9800', 0.2),
                  color: '#ff9800',
                  border: `1px solid ${alpha('#ff9800', 0.3)}`,
                }}
              />
            </Box>
          </CardContent>
        </Card>
      </Slide>
    );
  };

  // Componente de recompensas
  const RewardPopup = () => {
    if (!showRewards) return null;

    return (
      <Box
        sx={{
          position: 'absolute',
          top: 20,
          right: 20,
          zIndex: 1001,
          animation: `${rewardPopupAnimation} 0.5s ease-out`,
        }}
      >
        <Card
          sx={{
            background: `linear-gradient(135deg, ${alpha('#4caf50', 0.9)}, ${alpha('#8bc34a', 0.9)})`,
            backdropFilter: 'blur(20px)',
            border: `2px solid ${alpha('#4caf50', 0.5)}`,
            borderRadius: 4,
            p: 3,
            textAlign: 'center',
            minWidth: 200,
          }}
        >
          <Box sx={{ animation: `${celebrationAnimation} 1s ease-in-out infinite` }}>
            <Celebration sx={{ fontSize: 48, color: 'white', mb: 1 }} />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'white', mb: 2 }}>
            ¡Correcto! 🎉
          </Typography>
          <Box display="flex" justifyContent="center" gap={1}>
            <Chip
              icon={<Diamond sx={{ fontSize: '16px !important' }} />}
              label={`+${earnedRewards.meritos}`}
              size="small"
              sx={{ bgcolor: 'white', color: '#9c27b0', fontWeight: 'bold' }}
            />
            <Chip
              icon={<Bolt sx={{ fontSize: '16px !important' }} />}
              label={`+${earnedRewards.ondas}`}
              size="small"
              sx={{ bgcolor: 'white', color: '#ff9800', fontWeight: 'bold' }}
            />
          </Box>
        </Card>
      </Box>
    );
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      fullWidth
      PaperProps={{
        sx: {
          width: '100vw',
          height: '100vh',
          maxWidth: 'none',
          maxHeight: 'none',
          m: 0,
          background: '#000',
          position: 'relative',
        }
      }}
    >
      <DialogContent sx={{ p: 0, position: 'relative', height: '100%' }}>
        {/* Video principal */}
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            height: '100%',
            background: '#000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Video placeholder - en implementación real usaríamos la URL del video */}
          <Box
            sx={{
              width: '100%',
              height: '100%',
              background: `linear-gradient(135deg, ${alpha('#1976d2', 0.3)}, ${alpha('#9c27b0', 0.3)})`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
            }}
          >
            <Typography variant="h2" sx={{ fontSize: '8rem' }}>
              {videoData.thumbnail}
            </Typography>
            
            {/* Indicador de tiempo */}
            <Box
              sx={{
                position: 'absolute',
                bottom: 20,
                left: 20,
                background: alpha('#000', 0.7),
                borderRadius: 2,
                p: 1,
              }}
            >
              <Typography variant="body2" color="white">
                {formatTime(currentTime)} / {formatTime(duration || 600)}
              </Typography>
            </Box>
          </Box>

          {/* Video real (oculto para demo) */}
          <video
            ref={videoRef}
            style={{ display: 'none' }}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />

          {/* Controles del reproductor */}
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              background: `linear-gradient(transparent, ${alpha('#000', 0.8)})`,
              p: 3,
              opacity: showControls ? 1 : 0,
              transition: 'opacity 0.3s ease',
            }}
          >
            {/* Barra de progreso */}
            <Box sx={{ mb: 2 }}>
              <LinearProgress
                variant="determinate"
                value={(currentTime / (duration || 600)) * 100}
                sx={{
                  height: 6,
                  borderRadius: 3,
                  bgcolor: alpha('#ffffff', 0.3),
                  '& .MuiLinearProgress-bar': {
                    bgcolor: theme.palette.primary.main,
                    borderRadius: 3,
                  },
                }}
              />
            </Box>

            {/* Controles principales */}
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box display="flex" alignItems="center" gap={2}>
                <IconButton onClick={togglePlay} sx={{ color: 'white' }}>
                  {isPlaying ? <Pause /> : <PlayArrow />}
                </IconButton>
                
                <IconButton onClick={() => skip(-10)} sx={{ color: 'white' }}>
                  <Replay10 />
                </IconButton>
                
                <IconButton onClick={() => skip(10)} sx={{ color: 'white' }}>
                  <Forward10 />
                </IconButton>
                
                <IconButton onClick={toggleMute} sx={{ color: 'white' }}>
                  {isMuted ? <VolumeOff /> : <VolumeUp />}
                </IconButton>

                <Typography variant="body2" color="white">
                  {formatTime(currentTime)} / {formatTime(duration || 600)}
                </Typography>
              </Box>

              <Box display="flex" alignItems="center" gap={2}>
                <Box display="flex" gap={1}>
                  <Chip
                    icon={<Diamond sx={{ fontSize: '16px !important' }} />}
                    label={`${totalRewards.meritos} Mëritos`}
                    size="small"
                    sx={{
                      bgcolor: alpha('#9c27b0', 0.8),
                      color: 'white',
                      fontWeight: 'bold',
                    }}
                  />
                  <Chip
                    icon={<Bolt sx={{ fontSize: '16px !important' }} />}
                    label={`${totalRewards.ondas} Öndas`}
                    size="small"
                    sx={{
                      bgcolor: alpha('#ff9800', 0.8),
                      color: 'white',
                      fontWeight: 'bold',
                    }}
                  />
                </Box>

                <IconButton onClick={toggleFullscreen} sx={{ color: 'white' }}>
                  {isFullscreen ? <FullscreenExit /> : <Fullscreen />}
                </IconButton>

                <IconButton onClick={onClose} sx={{ color: 'white' }}>
                  <Close />
                </IconButton>
              </Box>
            </Box>
          </Box>

          {/* Pregunta interactiva */}
          <InteractiveQuestion />

          {/* Popup de recompensas */}
          <RewardPopup />

          {/* Información del video */}
          <Box
            sx={{
              position: 'absolute',
              top: 20,
              left: 20,
              background: alpha('#000', 0.7),
              backdropFilter: 'blur(20px)',
              borderRadius: 3,
              p: 2,
              maxWidth: 300,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'white', mb: 1 }}>
              {videoData.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {videoData.description}
            </Typography>
            <Box display="flex" alignItems="center" gap={1}>
              <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem' }}>
                {videoData.instructor.avatar}
              </Avatar>
              <Typography variant="caption" color="text.secondary">
                {videoData.instructor.name}
              </Typography>
            </Box>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default UPlayAdvancedVideoPlayer; 