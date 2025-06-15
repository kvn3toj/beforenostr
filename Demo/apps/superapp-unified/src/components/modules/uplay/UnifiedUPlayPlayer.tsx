import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  LinearProgress,
  Chip,
  IconButton,
  Fade,
  Zoom,
  Grid,
  Container,
  useTheme,
  useMediaQuery,
  AppBar,
  Toolbar,
  Avatar,
  Stack,
  Paper,
  CircularProgress,
  Alert,
  Tooltip,
  Divider,
  Badge,
  Collapse,
} from '@mui/material';

// Icons - Import only what we need
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import StarIcon from '@mui/icons-material/Star';
import SettingsIcon from '@mui/icons-material/Settings';
import AddIcon from '@mui/icons-material/Add';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import TimerIcon from '@mui/icons-material/Timer';
import BoltIcon from '@mui/icons-material/Bolt';
import DiamondIcon from '@mui/icons-material/Diamond';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import QuizIcon from '@mui/icons-material/Quiz';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import ScreenRotationIcon from '@mui/icons-material/ScreenRotation';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

// Hooks and services
import { useVideos } from '../../../hooks/useRealBackendData';
import { useUPlayMockData } from '../../../hooks/useUPlayMockData';
import { useVideoAnalytics } from '../../../hooks/analytics/useVideoAnalytics';

// Types
interface QuestionOption {
  id: string;
  label: string;
  text: string;
}

interface Question {
  id: number;
  timestamp: number;
  endTimestamp: number;
  type: 'binary-choice' | 'multiple-choice' | 'true-false';
  question: string;
  timeLimit: number;
  difficulty: 'easy' | 'medium' | 'hard';
  options: QuestionOption[];
  correctAnswer: string;
  reward: {
    meritos: number;
    ondas: number;
  };
}

interface PlayerMetrics {
  meritos: number;
  ondas: number;
  level: number;
  questionsAnswered: number;
  correctAnswers: number;
  currentStreak: number;
  totalWatchTime: number;
  completedVideos: number;
  precision: number;
}

interface VideoData {
  id: string;
  title: string;
  description: string;
  url: string;
  thumbnailUrl?: string;
  duration: number;
  questions: Question[];
  meritos: number;
  nivel: string;
  category?: string;
  isCompleted?: boolean;
}

interface UnifiedUPlayPlayerProps {
  videoId?: string;
  mode?: 'standard' | 'horizontal' | 'gamified' | 'unified';
  autoPlay?: boolean;
  showStats?: boolean;
  enableQuestions?: boolean;
  enableGamification?: boolean;
  enableRewards?: boolean;
  enableAnalytics?: boolean;
}

// Mock data for demo - Updated with working video URLs
const mockVideoData: VideoData = {
  id: 'unified-demo',
  title: 'La Reciprocidad: Principio Universal del Ayni',
  description: 'Explora los fundamentos del Ayni en la filosofía CoomÜnity a través de una experiencia interactiva gamificada',
  // Use a working video URL for testing
  url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  duration: 596, // Big Buck Bunny duration in seconds
  meritos: 50,
  nivel: 'Intermedio',
  category: 'Filosofía CoomÜnity',
  questions: [
    {
      id: 1,
      timestamp: 15,
      endTimestamp: 45,
      type: 'binary-choice',
      question: '¿El Ayni representa el principio de reciprocidad equilibrada en la filosofía CoomÜnity?',
      timeLimit: 25,
      difficulty: 'easy',
      options: [
        {
          id: 'a',
          label: 'A',
          text: 'Sí, el Ayni es el fundamento de la reciprocidad justa y equilibrada',
        },
        {
          id: 'b',
          label: 'B',
          text: 'No, el Ayni se refiere únicamente a intercambios comerciales',
        },
      ],
      correctAnswer: 'a',
      reward: { meritos: 15, ondas: 8 },
    },
    {
      id: 2,
      timestamp: 60,
      endTimestamp: 90,
      type: 'multiple-choice',
      question: '¿Cuál es el objetivo principal del sistema de Mëritos en CoomÜnity?',
      timeLimit: 30,
      difficulty: 'medium',
      options: [
        {
          id: 'a',
          label: 'A',
          text: 'Reconocer contribuciones al Bien Común de la comunidad',
        },
        {
          id: 'b',
          label: 'B',
          text: 'Crear competencia entre los miembros de la plataforma',
        },
        {
          id: 'c',
          label: 'C',
          text: 'Generar ingresos económicos para la plataforma',
        },
      ],
      correctAnswer: 'a',
      reward: { meritos: 25, ondas: 12 },
    },
    {
      id: 3,
      timestamp: 120,
      endTimestamp: 150,
      type: 'true-false',
      question: 'Las Öndas representan la energía vibracional positiva generada por contribuciones al Bien Común',
      timeLimit: 20,
      difficulty: 'easy',
      options: [
        {
          id: 'true',
          label: 'V',
          text: 'Verdadero',
        },
        {
          id: 'false',
          label: 'F',
          text: 'Falso',
        },
      ],
      correctAnswer: 'true',
      reward: { meritos: 20, ondas: 8 },
    },
  ],
};

const UnifiedUPlayPlayer: React.FC<UnifiedUPlayPlayerProps> = ({
  videoId,
  mode = 'unified',
  autoPlay = false,
  showStats = true,
  enableQuestions = true,
  enableGamification = true,
  enableRewards = true,
  enableAnalytics = true,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  
  // Safari detection
  const isSafari = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  }, []);

  // Backend data hooks
  const { data: backendVideos, isLoading: isBackendLoading, isError: isBackendError } = useVideos();
  const { formatDuration } = useUPlayMockData();

  // Video player state
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isHorizontalMode, setIsHorizontalMode] = useState(mode === 'horizontal');

  // Question system state
  const [activeQuestion, setActiveQuestion] = useState<Question | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<number>>(new Set());
  const [questionTimeRemaining, setQuestionTimeRemaining] = useState<number>(0);
  const [isQuestionTimerActive, setIsQuestionTimerActive] = useState(false);

  // Gamification state
  const [metrics, setMetrics] = useState<PlayerMetrics>({
    meritos: 6,
    ondas: 12,
    level: 1,
    questionsAnswered: 0,
    correctAnswers: 0,
    currentStreak: 0,
    totalWatchTime: 0,
    completedVideos: 0,
    precision: 0,
  });

  // Feedback state
  const [showRewardFeedback, setShowRewardFeedback] = useState<{
    show: boolean;
    isCorrect: boolean;
    reward?: { meritos: number; ondas: number };
  }>({ show: false, isCorrect: false });

  // Video error state
  const [videoError, setVideoError] = useState<string | null>(null);

  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const questionTimerRef = useRef<NodeJS.Timeout | null>(null);
  const controlsTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Safe play function to handle Safari restrictions
  const safePlay = useCallback(async () => {
    if (!videoRef.current) return false;
    
    try {
      // Clear any previous errors
      setVideoError(null);
      
      const playPromise = videoRef.current.play();
      
      if (playPromise !== undefined) {
        await playPromise;
        setIsPlaying(true);
        return true;
      } else {
        // Fallback for older browsers
        setIsPlaying(true);
        return true;
      }
    } catch (error) {
      console.warn('Video play failed:', error);
      
      // Handle specific Safari errors
      if (error instanceof DOMException) {
        if (error.name === 'NotSupportedError') {
          const errorMsg = 'Formato de video no compatible con Safari. Intentando recargar...';
          console.warn(errorMsg);
          setVideoError(errorMsg);
          
          // Try to reload the video element
          if (videoRef.current) {
            videoRef.current.load();
            // Try again after a short delay
            setTimeout(async () => {
              try {
                await videoRef.current?.play();
                setIsPlaying(true);
                setVideoError(null);
              } catch (retryError) {
                setVideoError('No se pudo reproducir el video. Intenta hacer clic en el botón de reproducir.');
              }
            }, 1000);
          }
        } else if (error.name === 'NotAllowedError') {
          const errorMsg = 'Se requiere interacción del usuario para reproducir el video.';
          console.warn(errorMsg);
          setVideoError(errorMsg);
        } else {
          setVideoError('Error al reproducir el video. Intenta nuevamente.');
        }
      } else {
        setVideoError('Error desconocido al reproducir el video.');
      }
      
      setIsPlaying(false);
      return false;
    }
  }, []);

  // Current video data - combine backend and mock data
  const currentVideoData = useMemo(() => {
    if (videoId && backendVideos) {
      const backendVideo = backendVideos.find((v: any) => v.id.toString() === videoId || v.externalId === videoId);
      if (backendVideo) {
        // Map backend video to our VideoData interface
        return {
          id: backendVideo.id.toString(),
          title: backendVideo.title,
          description: backendVideo.description || '',
          url: backendVideo.url,
          thumbnailUrl: backendVideo.thumbnailUrl,
          duration: backendVideo.duration || 180,
          questions: mockVideoData.questions, // Use mock questions for now
          meritos: 50,
          nivel: 'Intermedio',
          category: backendVideo.playlist?.name || 'General',
          isCompleted: false,
        } as VideoData;
      }
    }
    return mockVideoData;
  }, [videoId, backendVideos]);

  // Analytics hook - after currentVideoData is defined
  const { trackEvent } = useVideoAnalytics({
    videoId: currentVideoData.id,
    enableBatching: true,
    enableRealTimeEvents: true,
  });

  // Question checking logic
  const checkForQuestions = useCallback((time: number) => {
    if (!enableQuestions) return;

    const currentQuestion = currentVideoData.questions.find(
      (q) => time >= q.timestamp && time <= q.endTimestamp && !answeredQuestions.has(q.id)
    );

    if (currentQuestion && currentQuestion.id !== activeQuestion?.id) {
      console.log('🎯 Activating question:', currentQuestion.id, 'at time:', time);
      setActiveQuestion(currentQuestion);
      setSelectedAnswer(null);
      setQuestionTimeRemaining(currentQuestion.timeLimit);
      setIsQuestionTimerActive(true);
      
      // Pause video when question appears
      setIsPlaying(false);
      if (videoRef.current) {
        videoRef.current.pause();
      }

      // Track question appearance
      trackEvent('question_appeared', {
        questionId: currentQuestion.id,
        videoId: currentVideoData.id,
        timestamp: time,
      });
    }
  }, [currentVideoData.questions, answeredQuestions, activeQuestion, enableQuestions, trackEvent]);

  // Video control handlers
  const handlePlayPause = useCallback(async () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        await safePlay();
      }
      
      trackEvent('video_play_pause', {
        action: isPlaying ? 'pause' : 'play',
        videoId: currentVideoData.id,
        timestamp: currentTime,
      });
    }
  }, [isPlaying, currentTime, currentVideoData.id, trackEvent, safePlay]);

  const toggleMute = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  }, [isMuted]);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  const toggleHorizontalMode = useCallback(() => {
    setIsHorizontalMode(!isHorizontalMode);
    trackEvent('orientation_toggle', {
      mode: isHorizontalMode ? 'vertical' : 'horizontal',
      videoId: currentVideoData.id,
    });
  }, [isHorizontalMode, currentVideoData.id, trackEvent]);

  // Question handling
  const handleAnswerSelect = useCallback((answerId: string) => {
    setSelectedAnswer(answerId);
    console.log('🎯 Answer selected:', answerId);
  }, []);

  const handleAnswerSubmit = useCallback(() => {
    if (!activeQuestion || !selectedAnswer) return;

    const isCorrect = selectedAnswer === activeQuestion.correctAnswer;
    const newAnsweredQuestions = new Set(answeredQuestions);
    newAnsweredQuestions.add(activeQuestion.id);
    setAnsweredQuestions(newAnsweredQuestions);

    // Update metrics
    setMetrics(prev => {
      const newQuestionsAnswered = prev.questionsAnswered + 1;
      const newCorrectAnswers = prev.correctAnswers + (isCorrect ? 1 : 0);
      const newStreak = isCorrect ? prev.currentStreak + 1 : 0;
      const newPrecision = Math.round((newCorrectAnswers / newQuestionsAnswered) * 100);
      
      return {
        ...prev,
        questionsAnswered: newQuestionsAnswered,
        correctAnswers: newCorrectAnswers,
        currentStreak: newStreak,
        precision: newPrecision,
        meritos: prev.meritos + (isCorrect ? activeQuestion.reward.meritos : 0),
        ondas: prev.ondas + (isCorrect ? activeQuestion.reward.ondas : 0),
      };
    });

    // Show feedback
    setShowRewardFeedback({
      show: true,
      isCorrect,
      reward: isCorrect ? activeQuestion.reward : undefined,
    });

    // Track answer
    trackEvent('question_answered', {
      questionId: activeQuestion.id,
      videoId: currentVideoData.id,
      selectedAnswer,
      correctAnswer: activeQuestion.correctAnswer,
      isCorrect,
      timeRemaining: questionTimeRemaining,
      reward: isCorrect ? activeQuestion.reward : null,
    });

    // Clear question state
    setActiveQuestion(null);
    setSelectedAnswer(null);
    setIsQuestionTimerActive(false);

    // Resume video after delay
    setTimeout(async () => {
      setShowRewardFeedback({ show: false, isCorrect: false });
      await safePlay();
    }, 3000);

    console.log('🎯 Answer submitted:', { selectedAnswer, isCorrect, reward: activeQuestion.reward });
  }, [activeQuestion, selectedAnswer, answeredQuestions, metrics, questionTimeRemaining, currentVideoData.id, trackEvent, safePlay]);

  // Time update handler
  const handleTimeUpdate = useCallback(() => {
    if (videoRef.current) {
      const time = Math.floor(videoRef.current.currentTime);
      setCurrentTime(time);
      checkForQuestions(time);
    }
  }, [checkForQuestions]);

  // Question timer effect
  useEffect(() => {
    if (isQuestionTimerActive && questionTimeRemaining > 0) {
      questionTimerRef.current = setInterval(() => {
        setQuestionTimeRemaining((prev) => {
          if (prev <= 1) {
            // Time's up - auto-submit or skip question
            setIsQuestionTimerActive(false);
            setActiveQuestion(null);
            setSelectedAnswer(null);
            
            // Resume video
            setTimeout(async () => {
              await safePlay();
            }, 1000);
            
            trackEvent('question_timeout', {
              questionId: activeQuestion?.id,
              videoId: currentVideoData.id,
            });

            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (questionTimerRef.current) {
        clearInterval(questionTimerRef.current);
      }
    };
  }, [isQuestionTimerActive, questionTimeRemaining, activeQuestion, currentVideoData.id, trackEvent, safePlay]);

  // Controls visibility timer
  useEffect(() => {
    const resetControlsTimer = () => {
      setShowControls(true);
      if (controlsTimerRef.current) {
        clearTimeout(controlsTimerRef.current);
      }
      controlsTimerRef.current = setTimeout(() => {
        if (isPlaying && !activeQuestion) {
          setShowControls(false);
        }
      }, 3000);
    };

    const handleMouseMove = () => resetControlsTimer();
    const handleTouchStart = () => resetControlsTimer();

    if (containerRef.current) {
      containerRef.current.addEventListener('mousemove', handleMouseMove);
      containerRef.current.addEventListener('touchstart', handleTouchStart);
    }

    resetControlsTimer();

    return () => {
      if (controlsTimerRef.current) {
        clearTimeout(controlsTimerRef.current);
      }
      if (containerRef.current) {
        containerRef.current.removeEventListener('mousemove', handleMouseMove);
        containerRef.current.removeEventListener('touchstart', handleTouchStart);
      }
    };
  }, [isPlaying, activeQuestion]);

  // Safari-specific video setup
  useEffect(() => {
    if (isSafari && videoRef.current) {
      console.log('Setting up video for Safari');
      
      // Force load the video metadata
      videoRef.current.load();
      
      // Add additional Safari-specific event listeners
      const video = videoRef.current;
      
      const handleCanPlayThrough = () => {
        console.log('Safari: Video can play through');
      };
      
      const handleLoadedData = () => {
        console.log('Safari: Video data loaded');
      };
      
      video.addEventListener('canplaythrough', handleCanPlayThrough);
      video.addEventListener('loadeddata', handleLoadedData);
      
      return () => {
        video.removeEventListener('canplaythrough', handleCanPlayThrough);
        video.removeEventListener('loadeddata', handleLoadedData);
      };
    }
  }, [isSafari, currentVideoData.url]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (questionTimerRef.current) clearInterval(questionTimerRef.current);
      if (controlsTimerRef.current) clearTimeout(controlsTimerRef.current);
    };
  }, []);

  // Loading state
  if (isBackendLoading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
          <CircularProgress size={60} sx={{ color: '#6366f1' }} />
          <Typography variant="h6" color="text.secondary">
            Cargando reproductor ÜPlay...
          </Typography>
        </Box>
      </Container>
    );
  }

  const progress = (currentTime / currentVideoData.duration) * 100;
  const questionProgress = activeQuestion?.timeLimit && isQuestionTimerActive
    ? (questionTimeRemaining / activeQuestion.timeLimit) * 100
    : 100;

  return (
    <Container maxWidth="xl" sx={{ py: 2 }}>
      {/* Enhanced Header with Stats */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box>
            <Typography
              variant="h4"
              component="h1"
              sx={{
                fontWeight: 700,
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #FF5722 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
              }}
            >
              🎬 ÜPlay - GPL Gamified Play List
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {currentVideoData.title}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton onClick={toggleHorizontalMode} color="primary">
              <ScreenRotationIcon />
            </IconButton>
            <IconButton onClick={() => navigate('/uplay')} color="primary">
              <ChevronLeftIcon />
            </IconButton>
          </Box>
        </Box>

        {/* Player Stats */}
        {showStats && (
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
            <Chip
              icon={<DiamondIcon />}
              label={`${metrics.meritos} Mëritos`}
              sx={{
                bgcolor: '#fbbf24',
                color: 'white',
                fontWeight: 600,
              }}
            />
            <Chip
              icon={<BoltIcon />}
              label={`${metrics.ondas} Öndas`}
              sx={{
                bgcolor: '#10b981',
                color: 'white',
                fontWeight: 600,
              }}
            />
            <Chip
              icon={<StarIcon />}
              label={`Nivel: ${metrics.level}`}
              color="secondary"
              variant="filled"
            />
            <Chip
              icon={<CheckCircleIcon />}
              label={`Correctas: ${metrics.correctAnswers}/${currentVideoData.questions.length}`}
              color="success"
              variant="filled"
            />
            <Chip
              icon={<TrendingUpIcon />}
              label={`Precisión: ${metrics.precision}%`}
              color="info"
              variant="filled"
            />
            {metrics.currentStreak > 0 && (
              <Chip
                icon={<LocalFireDepartmentIcon />}
                label={`Racha: ${metrics.currentStreak}`}
                sx={{ bgcolor: '#ef4444', color: 'white', fontWeight: 600 }}
              />
            )}
          </Box>
        )}

        {/* Backend Connection Status */}
        <Alert 
          severity={isBackendError ? "warning" : "success"} 
          icon={<VideoLibraryIcon />}
          sx={{ mb: 2 }}
        >
          {isBackendError ? (
            <>⚠️ Modo demo: Usando datos de demostración</>
          ) : (
            <>✅ Conectado al backend: Video cargado correctamente</>
          )}
        </Alert>
      </Box>

      {/* Unified Video Player */}
      <Box
        ref={containerRef}
        sx={{
          position: 'relative',
          width: '100%',
          maxWidth: isHorizontalMode ? '100%' : { xs: '100%', md: '784px' },
          mx: 'auto',
          borderRadius: 3,
          overflow: 'hidden',
          backgroundColor: '#000',
          boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
          // Horizontal mode transformations
          ...(isHorizontalMode && isMobile && {
            transform: 'rotate(-90deg)',
            transformOrigin: 'center',
            width: '90vh',
            height: '50vw',
            maxHeight: '360px',
            position: 'relative',
            left: '50%',
            marginLeft: '-45vh',
            my: 10,
          }),
        }}
      >
        {/* Video Element */}
        <video
          ref={videoRef}
          src={currentVideoData.url}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={async () => {
            if (autoPlay) {
              await safePlay();
            }
          }}
          onEnded={() => {
            setIsPlaying(false);
            setMetrics(prev => ({ ...prev, completedVideos: prev.completedVideos + 1 }));
            trackEvent('video_completed', {
              videoId: currentVideoData.id,
              duration: currentVideoData.duration,
              questionsAnswered: metrics.questionsAnswered,
              correctAnswers: metrics.correctAnswers,
              finalPrecision: metrics.precision,
            });
          }}
          onError={(e) => {
            console.error('Video error:', e);
            setIsPlaying(false);
            
            // Handle different types of video errors
            const target = e.target as HTMLVideoElement;
            const error = target.error;
            
            if (error) {
              switch (error.code) {
                case MediaError.MEDIA_ERR_ABORTED:
                  setVideoError('Reproducción de video abortada.');
                  break;
                case MediaError.MEDIA_ERR_NETWORK:
                  setVideoError('Error de red al cargar el video.');
                  break;
                case MediaError.MEDIA_ERR_DECODE:
                  setVideoError('Error al decodificar el video.');
                  break;
                case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
                  setVideoError('Formato de video no soportado.');
                  break;
                default:
                  setVideoError('Error desconocido al reproducir el video.');
              }
            }
          }}
          onCanPlay={() => {
            console.log('Video can play');
          }}
          onLoadStart={() => {
            console.log('Video load started');
          }}
          preload="metadata"
          playsInline
          webkit-playsinline="true"
          style={{
            width: '100%',
            height: isHorizontalMode && isMobile ? '50vw' : '360px',
            maxHeight: '360px',
            objectFit: 'cover',
          }}
        />

        {/* Question Overlay */}
        <Fade in={!!activeQuestion} timeout={300}>
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.85)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 20,
              p: 3,
            }}
          >
            {activeQuestion && (
              <Box
                sx={{
                  maxWidth: '600px',
                  width: '100%',
                  textAlign: 'center',
                }}
              >
                {/* Question Timer */}
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 2 }}>
                    <TimerIcon sx={{ color: questionTimeRemaining > 10 ? '#fbbf24' : '#ef4444' }} />
                    <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                      {questionTimeRemaining}s
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={questionProgress}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: questionTimeRemaining > 10 ? '#10b981' : '#ef4444',
                        borderRadius: 4,
                      },
                    }}
                  />
                </Box>

                {/* Question Content */}
                <Typography
                  variant="h5"
                  sx={{
                    color: 'white',
                    fontWeight: 600,
                    mb: 4,
                    lineHeight: 1.4,
                  }}
                >
                  {activeQuestion.question}
                </Typography>

                {/* Answer Options */}
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    gap: 2,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  {activeQuestion.options.map((option) => (
                    <Card
                      key={option.id}
                      sx={{
                        minWidth: { xs: '100%', md: 200 },
                        maxWidth: { xs: '100%', md: 280 },
                        cursor: 'pointer',
                        borderRadius: '16px',
                        backgroundColor:
                          selectedAnswer === option.id
                            ? 'rgba(103, 80, 164, 0.9)'
                            : 'rgba(255, 255, 255, 0.95)',
                        color:
                          selectedAnswer === option.id
                            ? 'white'
                            : 'rgba(66, 65, 65, 1)',
                        transform:
                          selectedAnswer === option.id
                            ? 'scale(1.05)'
                            : 'scale(1)',
                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                        boxShadow:
                          selectedAnswer === option.id
                            ? '0px 8px 32px rgba(103, 80, 164, 0.5)'
                            : '0px 4px 20px rgba(0, 0, 0, 0.1)',
                        border:
                          selectedAnswer === option.id
                            ? '3px solid rgba(103, 80, 164, 0.8)'
                            : 'none',
                        '&:hover': {
                          transform: 'scale(1.03)',
                          boxShadow: '0px 8px 32px rgba(0, 0, 0, 0.2)',
                        },
                      }}
                      onClick={() => handleAnswerSelect(option.id)}
                    >
                      <CardContent sx={{ p: '20px' }}>
                        <Typography
                          variant="h4"
                          sx={{
                            fontSize: '16px',
                            fontWeight: 700,
                            textAlign: 'center',
                            mb: 1,
                          }}
                        >
                          {option.label}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            fontSize: '14px',
                            fontWeight: 500,
                            lineHeight: 1.4,
                          }}
                        >
                          {option.text}
                        </Typography>
                      </CardContent>
                    </Card>
                  ))}
                </Box>

                {/* Submit Button */}
                {selectedAnswer && (
                  <Box sx={{ textAlign: 'center', mt: 4 }}>
                    <Button
                      variant="contained"
                      onClick={handleAnswerSubmit}
                      sx={{
                        backgroundColor: '#10b981',
                        borderRadius: '24px',
                        px: 4,
                        py: 1.5,
                        fontWeight: 600,
                        textTransform: 'none',
                        fontSize: '16px',
                        '&:hover': { backgroundColor: '#059669' },
                      }}
                    >
                      Confirmar Respuesta
                    </Button>
                  </Box>
                )}
              </Box>
            )}
          </Box>
        </Fade>

        {/* Video Controls */}
        <Fade in={showControls || !isPlaying} timeout={300}>
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              background: mode === 'horizontal' 
                ? 'rgba(84, 83, 83, 1)' 
                : 'linear-gradient(transparent, rgba(0, 0, 0, 0.8))',
              padding: mode === 'horizontal' ? '15px 28px' : '20px',
              zIndex: 10,
            }}
          >
            {/* Progress Bar with Question Markers */}
            <Box sx={{ mb: 2 }}>
              <Box
                sx={{
                  position: 'relative',
                  height: '6px',
                  backgroundColor: 'rgba(255, 255, 255, 0.3)',
                  borderRadius: '3px',
                  overflow: 'hidden',
                }}
              >
                <Box
                  sx={{
                    height: '100%',
                    width: `${Math.min(progress, 100)}%`,
                    background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
                    borderRadius: '3px',
                    transition: 'width 0.1s ease',
                  }}
                />
                
                {/* Question Markers */}
                {currentVideoData.questions.map((question) => {
                  const markerPosition = (question.timestamp / currentVideoData.duration) * 100;
                  const isAnswered = answeredQuestions.has(question.id);
                  
                  return (
                    <Box
                      key={question.id}
                      sx={{
                        position: 'absolute',
                        left: `${markerPosition}%`,
                        top: '-2px',
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        backgroundColor: isAnswered ? '#10b981' : '#fbbf24',
                        border: '2px solid white',
                        transform: 'translateX(-50%)',
                        zIndex: 2,
                      }}
                    />
                  );
                })}
              </Box>
            </Box>

            {/* Control Buttons */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              {/* Left Controls */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <IconButton onClick={handlePlayPause} sx={{ color: 'white' }}>
                  {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
                </IconButton>

                <IconButton onClick={toggleMute} sx={{ color: 'white' }}>
                  {isMuted ? <VolumeOffIcon /> : <VolumeUpIcon />}
                </IconButton>

                <Typography variant="body2" sx={{ color: 'white', minWidth: '80px' }}>
                  {Math.floor(currentTime / 60)}:{(Math.floor(currentTime) % 60).toString().padStart(2, '0')} / {Math.floor(currentVideoData.duration / 60)}:{(currentVideoData.duration % 60).toString().padStart(2, '0')}
                </Typography>
              </Box>

              {/* Right Controls */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Tooltip title="Modo Horizontal">
                  <IconButton onClick={toggleHorizontalMode} sx={{ color: 'white' }}>
                    <ScreenRotationIcon />
                  </IconButton>
                </Tooltip>
                
                <Tooltip title="Pantalla Completa">
                  <IconButton onClick={toggleFullscreen} sx={{ color: 'white' }}>
                    {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
                  </IconButton>
                </Tooltip>

                <IconButton sx={{ color: 'white' }}>
                  <SettingsIcon />
                </IconButton>
              </Box>
            </Box>
          </Box>
        </Fade>

        {/* Reward Feedback */}
        {showRewardFeedback.show && (
          <Zoom in={true}>
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 25,
                minWidth: '300px',
                textAlign: 'center',
              }}
            >
              {showRewardFeedback.isCorrect ? (
                <Box
                  sx={{
                    backgroundColor: '#10b981',
                    color: 'white',
                    borderRadius: '24px',
                    p: 3,
                    boxShadow: '0 8px 32px rgba(16, 185, 129, 0.4)',
                  }}
                >
                  <CheckCircleIcon sx={{ fontSize: '48px', mb: 1 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    ¡Respuesta Correcta!
                  </Typography>
                  {showRewardFeedback.reward && (
                    <Typography variant="body1">
                      +{showRewardFeedback.reward.meritos} Mëritos, +{showRewardFeedback.reward.ondas} Öndas
                    </Typography>
                  )}
                </Box>
              ) : (
                <Box
                  sx={{
                    backgroundColor: '#ef4444',
                    color: 'white',
                    borderRadius: '24px',
                    p: 3,
                    boxShadow: '0 8px 32px rgba(239, 68, 68, 0.4)',
                  }}
                >
                  <CancelIcon sx={{ fontSize: '48px', mb: 1 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Respuesta Incorrecta
                  </Typography>
                  <Typography variant="body2">
                    ¡Sigue intentando!
                  </Typography>
                </Box>
              )}
            </Box>
          </Zoom>
        )}

        {/* Video Error Message */}
        {videoError && (
          <Fade in={true}>
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 30,
                minWidth: '300px',
                maxWidth: '500px',
                textAlign: 'center',
              }}
            >
              <Box
                sx={{
                  backgroundColor: 'rgba(239, 68, 68, 0.95)',
                  color: 'white',
                  borderRadius: '16px',
                  p: 3,
                  boxShadow: '0 8px 32px rgba(239, 68, 68, 0.4)',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <ErrorOutlineIcon sx={{ fontSize: '48px', mb: 2 }} />
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  Error de Reproducción
                </Typography>
                <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.5 }}>
                  {videoError}
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                  <Button
                    variant="contained"
                    onClick={async () => {
                      setVideoError(null);
                      await safePlay();
                    }}
                    sx={{
                      backgroundColor: 'white',
                      color: '#ef4444',
                      fontWeight: 600,
                      '&:hover': { backgroundColor: '#f3f4f6' },
                    }}
                  >
                    Reintentar
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => setVideoError(null)}
                    sx={{
                      borderColor: 'white',
                      color: 'white',
                      '&:hover': { borderColor: '#f3f4f6', backgroundColor: 'rgba(255,255,255,0.1)' },
                    }}
                  >
                    Cerrar
                  </Button>
                </Box>
              </Box>
            </Box>
          </Fade>
        )}
      </Box>

      {/* Video Information */}
      <Box sx={{ mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          {currentVideoData.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          {currentVideoData.description}
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Chip label={`Categoría: ${currentVideoData.category}`} variant="outlined" />
          <Chip label={`Nivel: ${currentVideoData.nivel}`} variant="outlined" />
          <Chip label={`Duración: ${formatDuration(currentVideoData.duration)}`} variant="outlined" />
          <Chip label={`Preguntas: ${currentVideoData.questions.length}`} variant="outlined" />
          <Chip label={`Recompensa: ${currentVideoData.meritos} Mëritos`} variant="outlined" />
        </Box>
      </Box>
    </Container>
  );
};

export default UnifiedUPlayPlayer; 