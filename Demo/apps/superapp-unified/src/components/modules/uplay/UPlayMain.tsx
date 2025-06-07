import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  IconButton,
  Paper,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  Avatar,
  LinearProgress,
  Chip,
  AppBar,
  Toolbar,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  Fade,
  Zoom,
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  Replay as ReplayIcon,
  Fullscreen as FullscreenIcon,
  VolumeUp as VolumeIcon,
  Quiz as QuizIcon,
  EmojiEvents as TrophyIcon,
  Star as StarIcon,
  VideogameAsset as GameIcon,
  CheckCircle as CheckIcon,
  Close as CloseIcon,
  Timer as TimerIcon,
  Help as HelpIcon,
} from '@mui/icons-material';

// 🔗 Conexión con el backend real
import { useVideos, useVideoCategories, useVideoPlaylists } from '../../../hooks/useRealBackendData';

// 🏷️ Tipos de datos reales del backend
interface RealVideoData {
  id: number;
  title: string;
  description: string;
  duration: number;
  thumbnailUrl?: string;
  url: string;
  platform: string;
  externalId: string;
  categories: string;
  tags: string;
  questions: QuestionData[];
  playlist: PlaylistData;
}

interface QuestionData {
  id: number;
  videoItemId: number;
  timestamp: number;
  endTimestamp: number;
  type: 'multiple-choice' | 'true-false' | 'open-text';
  text: string;
  languageCode: string;
  isActive: boolean;
}

interface PlaylistData {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
}

// 🎮 Estado del juego gamificado
interface GameState {
  score: number;
  merits: number;
  questionsAnswered: number;
  correctAnswers: number;
  currentStreak: number;
  maxStreak: number;
  level: number;
  experience: number;
}

const UPlayMain: React.FC = () => {
  // 🎛️ Estados del reproductor
  const [activeTab, setActiveTab] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentVideo, setCurrentVideo] = useState<RealVideoData | null>(null);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  
  // 🎮 Estados del juego
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    merits: 0,
    questionsAnswered: 0,
    correctAnswers: 0,
    currentStreak: 0,
    maxStreak: 0,
    level: 1,
    experience: 0,
  });

  // 🎯 Estados de preguntas interactivas
  const [activeQuestion, setActiveQuestion] = useState<QuestionData | null>(null);
  const [questionDialogOpen, setQuestionDialogOpen] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(false);

  // 🔔 Estados de feedback
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'info'>('info');

  // ⏱️ Referencias para el timer
  const videoRef = useRef<HTMLVideoElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // 🔗 Hooks de datos reales del backend
  const { data: videosData, isLoading: videosLoading, error: videosError } = useVideos();
  const { data: categoriesData } = useVideoCategories();
  const { data: playlistsData } = useVideoPlaylists();

  // 🎬 Procesar datos de videos del backend
  const realVideos: RealVideoData[] = videosData || [];

  // ⏰ Efecto para manejar el timer del video y detectar preguntas
  useEffect(() => {
    if (isPlaying && currentVideo) {
      timerRef.current = setInterval(() => {
        setCurrentTime(prev => {
          const newTime = prev + 1;
          setProgress((newTime / (currentVideo.duration || 1)) * 100);
          
          // 🎯 Detectar si hay una pregunta en este timestamp
          const currentQuestion = currentVideo.questions.find(
            q => q.timestamp <= newTime && newTime <= (q.endTimestamp || q.timestamp + 15)
          );
          
          if (currentQuestion && !activeQuestion) {
            setActiveQuestion(currentQuestion);
            setQuestionDialogOpen(true);
            setIsPlaying(false); // Pausar el video para la pregunta
          }
          
          return newTime;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isPlaying, currentVideo, activeQuestion]);

  // 🎮 Funciones de gamificación
  const handlePlayVideo = (video: RealVideoData) => {
    setCurrentVideo(video);
    setCurrentTime(0);
    setProgress(0);
    setIsPlaying(true);
    
    showSnackbar('¡Video iniciado! Prepárate para las preguntas interactivas 🎯', 'info');
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleAnswerQuestion = (answer: string) => {
    setSelectedAnswer(answer);
    setShowAnswer(true);
    
    // 🎯 Simular lógica de respuesta correcta (en producción, esto vendría del backend)
    const isCorrect = Math.random() > 0.3; // 70% de probabilidad de ser correcta
    setIsAnswerCorrect(isCorrect);
    
    // 🎮 Actualizar estado del juego
    setGameState(prev => {
      const newQuestionsAnswered = prev.questionsAnswered + 1;
      const newCorrectAnswers = isCorrect ? prev.correctAnswers + 1 : prev.correctAnswers;
      const newStreak = isCorrect ? prev.currentStreak + 1 : 0;
      const newMaxStreak = Math.max(prev.maxStreak, newStreak);
      const meritsEarned = isCorrect ? 10 + (newStreak * 2) : 0;
      const newMerits = prev.merits + meritsEarned;
      const expEarned = isCorrect ? 25 + (newStreak * 5) : 5;
      const newExperience = prev.experience + expEarned;
      const newLevel = Math.floor(newExperience / 100) + 1;
      
      return {
        ...prev,
        questionsAnswered: newQuestionsAnswered,
        correctAnswers: newCorrectAnswers,
        currentStreak: newStreak,
        maxStreak: newMaxStreak,
        merits: newMerits,
        experience: newExperience,
        level: newLevel,
        score: newCorrectAnswers * 10 + newStreak * 5,
      };
    });
    
    // 🔔 Mostrar feedback
    if (isCorrect) {
      showSnackbar(`¡Correcto! +${10 + (gameState.currentStreak * 2)} Mëritos 🏆`, 'success');
    } else {
      showSnackbar('¡Sigue intentando! +5 EXP por participar 💪', 'error');
    }
  };

  const closeQuestionDialog = () => {
    setQuestionDialogOpen(false);
    setActiveQuestion(null);
    setSelectedAnswer('');
    setShowAnswer(false);
    setIsAnswerCorrect(false);
    
    // Reanudar el video después de 1 segundo
    setTimeout(() => {
      setIsPlaying(true);
    }, 1000);
  };

  const showSnackbar = (message: string, severity: 'success' | 'error' | 'info') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  // 🎨 Componente del Header mejorado
  const UPlayHeader = () => (
    <AppBar position="sticky" sx={{ 
      bgcolor: 'linear-gradient(135deg, #E91E63 0%, #9C27B0 100%)', 
      boxShadow: '0 4px 20px rgba(233, 30, 99, 0.3)' 
    }}>
      <Toolbar>
        <GameIcon sx={{ mr: 2, fontSize: 32 }} />
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h6" component="h1" sx={{ fontWeight: 'bold' }}>
            ÜPlay - Reproductor Gamificado
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.8 }}>
            GPL - Gamified Play List | {realVideos.length} videos disponibles
          </Typography>
        </Box>
        
        {/* 🎮 Panel de estadísticas del juego */}
        <Stack direction="row" spacing={2} alignItems="center">
          <Chip 
            icon={<TrophyIcon />}
            label={`${gameState.merits} Mëritos`}
            size="small" 
            variant="outlined" 
            sx={{ color: 'white', borderColor: 'white' }}
          />
          <Chip 
            icon={<StarIcon />}
            label={`Nivel ${gameState.level}`}
            size="small" 
            variant="outlined" 
            sx={{ color: 'white', borderColor: 'white' }}
          />
          <Chip 
            icon={<CheckIcon />}
            label={`${gameState.correctAnswers}/${gameState.questionsAnswered} Correctas`}
            size="small" 
            variant="outlined" 
            sx={{ color: 'white', borderColor: 'white' }}
          />
        </Stack>
      </Toolbar>
    </AppBar>
  );

  // 🎬 Componente del reproductor mejorado
  const VideoPlayer = () => (
    <Paper sx={{ 
      bgcolor: '#000', 
      position: 'relative', 
      aspectRatio: '16/9', 
      mb: 3,
      borderRadius: 2,
      overflow: 'hidden',
      boxShadow: '0 8px 32px rgba(0,0,0,0.3)' 
    }}>
      {currentVideo ? (
        <Box sx={{ 
          width: '100%', 
          height: '100%', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          position: 'relative',
          background: 'linear-gradient(45deg, #1a1a1a 0%, #2d2d2d 100%)'
        }}>
          {/* 🎬 Título del video */}
          <Typography variant="h5" color="white" sx={{ 
            mb: 2, 
            textAlign: 'center',
            textShadow: '2px 2px 4px rgba(0,0,0,0.7)' 
          }}>
            🎬 {currentVideo.title}
          </Typography>
          
          {/* ⏱️ Indicador de tiempo */}
          <Box sx={{ 
            position: 'absolute', 
            top: 16, 
            left: 16,
            bgcolor: 'rgba(0,0,0,0.7)',
            borderRadius: 1,
            p: 1
          }}>
            <Typography variant="caption" sx={{ color: 'white', display: 'flex', alignItems: 'center' }}>
              <TimerIcon sx={{ mr: 0.5, fontSize: 16 }} />
              {Math.floor(currentTime / 60)}:{(currentTime % 60).toString().padStart(2, '0')} / {Math.floor((currentVideo.duration || 0) / 60)}:{((currentVideo.duration || 0) % 60).toString().padStart(2, '0')}
            </Typography>
          </Box>
          
          {/* 🎮 Controles del reproductor */}
          <Box sx={{ 
            position: 'absolute', 
            bottom: 16, 
            left: 16, 
            right: 16,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            bgcolor: 'rgba(0,0,0,0.7)',
            borderRadius: 2,
            p: 2
          }}>
            <IconButton 
              onClick={togglePlayPause} 
              sx={{ 
                color: 'white',
                bgcolor: 'rgba(233, 30, 99, 0.8)',
                '&:hover': { bgcolor: 'rgba(233, 30, 99, 1)' }
              }}
            >
              {isPlaying ? <PauseIcon /> : <PlayIcon />}
            </IconButton>
            
            <LinearProgress 
              variant="determinate" 
              value={progress} 
              sx={{ 
                flex: 1, 
                height: 8,
                borderRadius: 4,
                bgcolor: 'rgba(255,255,255,0.3)',
                '& .MuiLinearProgress-bar': {
                  bgcolor: '#E91E63',
                  borderRadius: 4
                }
              }}
            />
            
            <IconButton sx={{ color: 'white' }}>
              <VolumeIcon />
            </IconButton>
            <IconButton sx={{ color: 'white' }}>
              <FullscreenIcon />
            </IconButton>
          </Box>

          {/* 🎯 Elementos gamificados flotantes */}
          <Box sx={{ 
            position: 'absolute', 
            top: 16, 
            right: 16,
            display: 'flex',
            flexDirection: 'column',
            gap: 1
          }}>
            <Fade in={true}>
              <Chip 
                icon={<QuizIcon />} 
                label={`${currentVideo.questions.length} Preguntas`}
                size="small"
                sx={{ 
                  bgcolor: 'rgba(156, 39, 176, 0.9)', 
                  color: 'white',
                  fontWeight: 'bold' 
                }}
              />
            </Fade>
            
            <Zoom in={gameState.currentStreak > 0}>
              <Chip 
                icon={<CheckIcon />} 
                label={`Racha: ${gameState.currentStreak}🔥`}
                size="small"
                sx={{ 
                  bgcolor: 'rgba(255, 152, 0, 0.9)', 
                  color: 'white',
                  fontWeight: 'bold' 
                }}
              />
            </Zoom>
          </Box>

          {/* 🎯 Indicador de pregunta próxima */}
          {currentVideo.questions.some(q => q.timestamp > currentTime && q.timestamp <= currentTime + 10) && (
            <Box sx={{
              position: 'absolute',
              bottom: 80,
              right: 16,
              bgcolor: 'rgba(255, 193, 7, 0.9)',
              borderRadius: 2,
              p: 1,
              display: 'flex',
              alignItems: 'center',
              animation: 'pulse 1s infinite'
            }}>
              <HelpIcon sx={{ color: 'white', mr: 1 }} />
              <Typography variant="caption" sx={{ color: 'white', fontWeight: 'bold' }}>
                ¡Pregunta próxima!
              </Typography>
            </Box>
          )}
        </Box>
      ) : (
        <Box sx={{ 
          width: '100%', 
          height: '100%', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          flexDirection: 'column'
        }}>
          <GameIcon sx={{ fontSize: 64, color: '#E91E63', mb: 2 }} />
          <Typography variant="h6" color="white" sx={{ mb: 1 }}>
            Selecciona un video para comenzar tu experiencia gamificada
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
            Responde preguntas, gana mëritos y sube de nivel 🚀
          </Typography>
        </Box>
      )}
    </Paper>
  );

  // 🎯 Dialog de preguntas interactivas
  const QuestionDialog = () => (
    <Dialog 
      open={questionDialogOpen} 
      onClose={() => {}} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          bgcolor: 'linear-gradient(135deg, #E91E63 0%, #9C27B0 100%)',
          color: 'white'
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        alignItems: 'center',
        color: 'white',
        pb: 1
      }}>
        <QuizIcon sx={{ mr: 2 }} />
        Pregunta Interactiva
        {activeQuestion && (
          <Chip 
            label={`Tipo: ${activeQuestion.type}`}
            size="small"
            sx={{ ml: 2, bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
          />
        )}
      </DialogTitle>
      
      <DialogContent sx={{ color: 'white' }}>
        {activeQuestion && (
          <Box>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
              {activeQuestion.text}
            </Typography>
            
            {activeQuestion.type === 'true-false' && (
              <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                <Button 
                  variant={selectedAnswer === 'true' ? 'contained' : 'outlined'}
                  onClick={() => !showAnswer && handleAnswerQuestion('true')}
                  disabled={showAnswer}
                  sx={{ 
                    color: 'white', 
                    borderColor: 'white',
                    '&.MuiButton-contained': { bgcolor: 'rgba(255,255,255,0.3)' }
                  }}
                >
                  Verdadero
                </Button>
                <Button 
                  variant={selectedAnswer === 'false' ? 'contained' : 'outlined'}
                  onClick={() => !showAnswer && handleAnswerQuestion('false')}
                  disabled={showAnswer}
                  sx={{ 
                    color: 'white', 
                    borderColor: 'white',
                    '&.MuiButton-contained': { bgcolor: 'rgba(255,255,255,0.3)' }
                  }}
                >
                  Falso
                </Button>
              </Stack>
            )}
            
            {activeQuestion.type === 'multiple-choice' && (
              <Stack spacing={1} sx={{ mb: 2 }}>
                {['Opción A', 'Opción B', 'Opción C', 'Opción D'].map((option, index) => (
                  <Button 
                    key={index}
                    variant={selectedAnswer === option ? 'contained' : 'outlined'}
                    onClick={() => !showAnswer && handleAnswerQuestion(option)}
                    disabled={showAnswer}
                    sx={{ 
                      justifyContent: 'flex-start',
                      color: 'white', 
                      borderColor: 'white',
                      '&.MuiButton-contained': { bgcolor: 'rgba(255,255,255,0.3)' }
                    }}
                  >
                    {option}
                  </Button>
                ))}
              </Stack>
            )}
            
            {showAnswer && (
              <Alert 
                severity={isAnswerCorrect ? 'success' : 'error'} 
                sx={{ 
                  mt: 2,
                  bgcolor: isAnswerCorrect ? 'rgba(76, 175, 80, 0.2)' : 'rgba(244, 67, 54, 0.2)',
                  color: 'white',
                  '& .MuiAlert-icon': { color: 'white' }
                }}
              >
                {isAnswerCorrect 
                  ? `¡Excelente! Has ganado ${10 + (gameState.currentStreak * 2)} Mëritos 🏆` 
                  : 'No es correcto, pero sigues ganando experiencia 💪'}
              </Alert>
            )}
          </Box>
        )}
      </DialogContent>
      
      {showAnswer && (
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={closeQuestionDialog} 
            variant="contained"
            sx={{ 
              bgcolor: 'rgba(255,255,255,0.2)', 
              color: 'white',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' }
            }}
          >
            Continuar Video
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );

  // 📋 Lista de videos mejorada
  const VideoCard = ({ video }: { video: RealVideoData }) => {
    const categories = video.categories ? JSON.parse(video.categories) : [];
    const tags = video.tags ? JSON.parse(video.tags) : [];
    
    return (
      <Card sx={{ 
        mb: 2, 
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': { 
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 32px rgba(233, 30, 99, 0.3)'
        },
        background: currentVideo?.id === video.id 
          ? 'linear-gradient(135deg, rgba(233, 30, 99, 0.1) 0%, rgba(156, 39, 176, 0.1) 100%)'
          : 'white'
      }}>
        <CardContent onClick={() => handlePlayVideo(video)}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={2}>
              <Avatar 
                sx={{ 
                  width: 56, 
                  height: 56, 
                  bgcolor: '#E91E63',
                  fontSize: '1.5rem'
                }}
              >
                🎬
              </Avatar>
            </Grid>
            <Grid item xs={8}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                {video.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {video.description}
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {categories.slice(0, 2).map((cat: string, index: number) => (
                  <Chip 
                    key={index}
                    label={cat} 
                    size="small" 
                    variant="outlined"
                    sx={{ mb: 0.5 }}
                  />
                ))}
              </Stack>
            </Grid>
            <Grid item xs={2}>
              <Stack alignItems="center" spacing={1}>
                <Chip 
                  icon={<QuizIcon />} 
                  label={video.questions.length}
                  size="small"
                  color="primary"
                />
                <Typography variant="caption" color="text.secondary">
                  {Math.floor((video.duration || 0) / 60)}:{((video.duration || 0) % 60).toString().padStart(2, '0')}
                </Typography>
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
  };

  // 📊 Panel de estadísticas del jugador
  const PlayerStats = () => (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
          <TrophyIcon sx={{ mr: 1, color: '#E91E63' }} />
          Estadísticas del Jugador
        </Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={6} md={3}>
            <Box textAlign="center">
              <Typography variant="h4" color="primary" sx={{ fontWeight: 'bold' }}>
                {gameState.merits}
              </Typography>
              <Typography variant="caption">Mëritos</Typography>
            </Box>
          </Grid>
          <Grid item xs={6} md={3}>
            <Box textAlign="center">
              <Typography variant="h4" color="secondary" sx={{ fontWeight: 'bold' }}>
                {gameState.level}
              </Typography>
              <Typography variant="caption">Nivel</Typography>
            </Box>
          </Grid>
          <Grid item xs={6} md={3}>
            <Box textAlign="center">
              <Typography variant="h4" color="success.main" sx={{ fontWeight: 'bold' }}>
                {gameState.maxStreak}
              </Typography>
              <Typography variant="caption">Mejor Racha</Typography>
            </Box>
          </Grid>
          <Grid item xs={6} md={3}>
            <Box textAlign="center">
              <Typography variant="h4" color="warning.main" sx={{ fontWeight: 'bold' }}>
                {gameState.questionsAnswered > 0 ? Math.round((gameState.correctAnswers / gameState.questionsAnswered) * 100) : 0}%
              </Typography>
              <Typography variant="caption">Precisión</Typography>
            </Box>
          </Grid>
        </Grid>
        
        {/* 📊 Barra de progreso de nivel */}
        <Box sx={{ mt: 3 }}>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Progreso al Nivel {gameState.level + 1}
          </Typography>
          <LinearProgress 
            variant="determinate" 
            value={(gameState.experience % 100)} 
            sx={{ 
              height: 8, 
              borderRadius: 4,
              '& .MuiLinearProgress-bar': { borderRadius: 4 }
            }}
          />
          <Typography variant="caption" color="text.secondary">
            {gameState.experience % 100}/100 EXP
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );

  // 📱 Contenido por pestañas
  const TabContent = () => {
    if (videosLoading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <LinearProgress sx={{ width: '100%' }} />
        </Box>
      );
    }

    if (videosError) {
      return (
        <Alert severity="error" sx={{ m: 2 }}>
          Error cargando videos del backend. Verifica la conexión.
        </Alert>
      );
    }

    switch (activeTab) {
      case 0: // Todos los videos
        return (
          <Box>
            {realVideos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </Box>
        );
      case 1: // Por categorías
        return (
          <Box>
            {categoriesData?.map((category: any) => (
              <Box key={category.id} sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ mb: 2, color: '#E91E63' }}>
                  {category.name} ({category.count})
                </Typography>
                {realVideos
                  .filter(video => {
                    const categories = video.categories ? JSON.parse(video.categories) : [];
                    return categories.some((cat: string) => 
                      cat.toLowerCase().includes(category.name.toLowerCase())
                    );
                  })
                  .map((video) => (
                    <VideoCard key={video.id} video={video} />
                  ))}
              </Box>
            ))}
          </Box>
        );
      case 2: // Estadísticas
        return <PlayerStats />;
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 2 }}>
      <UPlayHeader />
      
      <Box sx={{ mt: 3 }}>
        <Grid container spacing={3}>
          {/* 🎬 Reproductor principal */}
          <Grid item xs={12} lg={8}>
            <VideoPlayer />
            
            {/* 🎮 Estadísticas rápidas durante reproducción */}
            {currentVideo && (
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={6}>
                      <Typography variant="h6">{currentVideo.title}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {currentVideo.description}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Stack direction="row" spacing={2} justifyContent="flex-end">
                        <Chip 
                          icon={<TrophyIcon />}
                          label={`${gameState.merits} Mëritos`}
                          color="primary"
                        />
                        <Chip 
                          icon={<StarIcon />}
                          label={`Nivel ${gameState.level}`}
                          color="secondary"
                        />
                        {gameState.currentStreak > 0 && (
                          <Chip 
                            icon={<CheckIcon />}
                            label={`Racha: ${gameState.currentStreak}🔥`}
                            sx={{ bgcolor: '#FF9800', color: 'white' }}
                          />
                        )}
                      </Stack>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            )}
          </Grid>
          
          {/* 📋 Lista de videos y navegación */}
          <Grid item xs={12} lg={4}>
            <Paper sx={{ p: 2 }}>
              <Tabs 
                value={activeTab} 
                onChange={(_, newValue) => setActiveTab(newValue)}
                variant="fullWidth"
                sx={{ mb: 2 }}
              >
                <Tab label="Videos" />
                <Tab label="Categorías" />
                <Tab label="Stats" />
              </Tabs>
              
              <Box sx={{ maxHeight: '70vh', overflowY: 'auto' }}>
                <TabContent />
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {/* 🎯 Dialog de preguntas interactivas */}
      <QuestionDialog />

      {/* 🔔 Snackbar para feedback */}
      <Snackbar 
        open={snackbarOpen} 
        autoHideDuration={4000} 
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          severity={snackbarSeverity} 
          onClose={() => setSnackbarOpen(false)}
          sx={{ fontWeight: 'bold' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default UPlayMain; 