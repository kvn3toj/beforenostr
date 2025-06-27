import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import {
  Box,
  Typography,
  IconButton,
  Button,
  Card,
  CardContent,
  Slider,
  Dialog,
  DialogContent,
  Fade,
  Zoom,
  useTheme,
  useMediaQuery,
  Chip,
  CircularProgress,
  LinearProgress,
  Snackbar,
  Alert,
  Stack,
  Tooltip,
  Avatar,
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  VolumeUp as VolumeIcon,
  VolumeOff as VolumeOffIcon,
  SkipNext as SkipNextIcon,
  Settings as SettingsIcon,
  Add as AddIcon,
  ArrowBack as ArrowBackIcon,
  Fullscreen as FullscreenIcon,
  FullscreenExit as ExitFullscreenIcon,
  Timer as TimerIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Star as StarIcon,
  Bolt as BoltIcon,
  Diamond as DiamondIcon,
  Speed as SpeedIcon,
  Close as CloseIcon,
  Refresh as RefreshIcon,
  Quiz as QuizIcon,
  Check as CheckIcon,
} from '@mui/icons-material';

// Importar servicios para integración con backend
import { apiService } from '../../../../lib/api-service';

// Estilos CSS globales para animaciones de accesibilidad
const accessibilityStyles = `
  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    50% { transform: translateX(0%); }
    100% { transform: translateX(100%); }
  }

  @keyframes pulse-gentle {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.02); opacity: 0.95; }
  }

  @keyframes focus-ring {
    0% { box-shadow: 0 0 0 0 rgba(251, 191, 36, 0.8); }
    50% { box-shadow: 0 0 0 6px rgba(251, 191, 36, 0.4); }
    100% { box-shadow: 0 0 0 8px rgba(251, 191, 36, 0.1); }
  }

  @keyframes slide-up-fade {
    0% {
      opacity: 0;
      transform: translateY(30px) scale(0.95);
    }
    50% {
      opacity: 0.8;
      transform: translateY(10px) scale(0.98);
    }
    100% {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  /* Mejoras de accesibilidad para lectores de pantalla */
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  /* Animación específica para preguntas */
  .question-appear {
    animation: slide-up-fade 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  }

  /* Mejor contraste para modo alto contraste */
  @media (prefers-contrast: high) {
    .question-option {
      border-width: 3px !important;
      font-weight: 800 !important;
    }

    .question-header {
      text-shadow: 0 0 4px rgba(0,0,0,0.9) !important;
    }
  }

  /* Respeto por preferencias de movimiento reducido */
  @media (prefers-reduced-motion: reduce) {
    .question-appear,
    .shimmer,
    .pulse-gentle {
      animation: none !important;
      transition: none !important;
    }
  }

  /* Mejoras para modo oscuro */
  @media (prefers-color-scheme: dark) {
    .question-card {
      border: 2px solid rgba(255, 255, 255, 0.3) !important;
    }
  }
`;

// Insertar estilos en el head si no existen
if (typeof document !== 'undefined') {
  const styleId = 'uplay-accessibility-styles';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = accessibilityStyles;
    document.head.appendChild(style);
  }
}

// Types for the interactive video player
interface QuestionOverlay {
  id: number;
  timestamp: number;
  endTimestamp: number;
  type: 'multiple-choice' | 'true-false' | 'quick-response';
  question: string;
  options: {
    id: string;
    text: string;
    label: string; // A, B, C, D
    isCorrect?: boolean;
  }[];
  timeLimit?: number; // seconds
  reward?: {
    merits: number;
    ondas: number;
  };
  difficulty?: 'easy' | 'medium' | 'hard';
}

interface VideoPlayerMetrics {
  merits: number; // Mëritos
  ondas: number; // Öndas (vibrational energy)
  level: number;
  experience: number;
  questionsAnswered: number;
  correctAnswers: number;
  currentStreak: number;
  maxStreak: number;
  sessionScore: number;
  engagementLevel: number; // 0-1
  timeSpent: number; // seconds
  videosCompleted: number;
}

interface AnswerFeedback {
  isVisible: boolean;
  isCorrect: boolean;
  message: string;
  reward?: {
    merits: number;
    ondas: number;
  };
}

interface InteractiveVideoPlayerOverlayProps {
  videoUrl: string;
  videoId?: string;
  questions?: QuestionOverlay[];
  onQuestionAnswer?: (
    questionId: number,
    answerId: string,
    isCorrect: boolean
  ) => void;
  onVideoComplete?: () => void;
  onMetricsUpdate?: (metrics: VideoPlayerMetrics) => void;
  onRewardEarned?: (reward: { merits: number; ondas: number }) => void;
  isLandscape?: boolean;
  autoplay?: boolean;
  enableAnalytics?: boolean;
  userId?: string;
}

// Enhanced mock data with more sophisticated questions
const mockQuestions: QuestionOverlay[] = [
  {
    id: 1,
    timestamp: 5, // Pregunta muy temprana para testing
    endTimestamp: 35,
    type: 'multiple-choice',
    question: '¿Cuál es el principio fundamental de Ayni en CoomÜnity?',
    timeLimit: 20,
    difficulty: 'medium',
    reward: { merits: 15, ondas: 5 },
    options: [
      {
        id: 'a',
        label: 'A',
        text: 'Reciprocidad y equilibrio',
        isCorrect: true,
      },
      { id: 'b', label: 'B', text: 'Competencia individual', isCorrect: false },
      {
        id: 'c',
        label: 'C',
        text: 'Acumulación de recursos',
        isCorrect: false,
      },
      { id: 'd', label: 'D', text: 'Jerarquía social', isCorrect: false },
    ],
  },
  {
    id: 2,
    timestamp: 15, // Segunda pregunta temprana
    endTimestamp: 40,
    type: 'true-false',
    question: '¿Las Öndas representan energía vibracional positiva en el ecosistema?',
    timeLimit: 15,
    difficulty: 'easy',
    reward: { merits: 10, ondas: 8 },
    options: [
      { id: 'true', label: 'V', text: 'Verdadero', isCorrect: true },
      { id: 'false', label: 'F', text: 'Falso', isCorrect: false },
    ],
  },
  {
    id: 3,
    timestamp: 30, // Tercera pregunta
    endTimestamp: 60,
    type: 'multiple-choice',
    question: '¿Cuál de estos elementos representa mejor el Bien Común?',
    timeLimit: 25,
    difficulty: 'hard',
    reward: { merits: 25, ondas: 12 },
    options: [
      { id: 'a', label: 'A', text: 'Colaboración y reciprocidad', isCorrect: true },
      { id: 'b', label: 'B', text: 'Competencia por recursos', isCorrect: false },
      { id: 'c', label: 'C', text: 'Individualismo extremo', isCorrect: false },
      { id: 'd', label: 'D', text: 'Acumulación personal', isCorrect: false },
    ],
  },
];

const mockMetrics: VideoPlayerMetrics = {
  merits: 125,
  ondas: 34,
  level: 4,
  experience: 680,
  questionsAnswered: 12,
  correctAnswers: 9,
  currentStreak: 3,
  maxStreak: 7,
  sessionScore: 0,
  engagementLevel: 0.85,
  timeSpent: 0,
  videosCompleted: 3,
};

const InteractiveVideoPlayerOverlay: React.FC<
  InteractiveVideoPlayerOverlayProps
> = ({
  videoUrl,
  videoId = 'default-video',
  questions = [],
  onQuestionAnswer,
  onVideoComplete,
  onMetricsUpdate,
  onRewardEarned,
  isLandscape = true,
  autoplay = false,
  enableAnalytics = true,
  userId,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const questionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Use mock questions if none provided for better testing
  const effectiveQuestions = questions.length > 0 ? questions : mockQuestions;

  // Video state
  const [isPlaying, setIsPlaying] = useState(autoplay);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLargeViewport, setIsLargeViewport] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  // Debug state
  const [showDebugControls, setShowDebugControls] = useState(process.env.NODE_ENV === 'development');

  // Question overlay state
  const [activeQuestion, setActiveQuestion] = useState<QuestionOverlay | null>(
    null
  );
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<number>>(
    new Set()
  );
  const [questionTimeRemaining, setQuestionTimeRemaining] = useState<number>(0);
  const [isQuestionTimerActive, setIsQuestionTimerActive] = useState(false);
  const [showQuestionHint, setShowQuestionHint] = useState(false);

  // Feedback and rewards state
  const [answerFeedback, setAnswerFeedback] = useState<AnswerFeedback>({
    isVisible: false,
    isCorrect: false,
    message: '',
  });
  const [rewardAnimation, setRewardAnimation] = useState<{
    isVisible: boolean;
    reward: { merits: number; ondas: number };
  }>({
    isVisible: false,
    reward: { merits: 0, ondas: 0 },
  });

  // Player metrics state - usando valores iniciales por defecto
  const [metrics, setMetrics] = useState<VideoPlayerMetrics>({
    merits: 0,
    ondas: 0,
    level: 1,
    experience: 0,
    questionsAnswered: 0,
    correctAnswers: 0,
    currentStreak: 0,
    maxStreak: 0,
    sessionScore: 0,
    engagementLevel: 0,
    timeSpent: 0,
    videosCompleted: 0,
  });
  const [sessionStartTime] = useState<Date>(new Date());

  // Analytics state
  const [watchTimeSegments, setWatchTimeSegments] = useState<
    Array<{ start: number; end: number }>
  >([]);
  const [lastAnalyticsUpdate, setLastAnalyticsUpdate] = useState<number>(0);

  // Format time display
  const formatTime = useCallback((seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  // Enhanced question timer management
  const startQuestionTimer = useCallback((timeLimit: number) => {
    setQuestionTimeRemaining(timeLimit);
    setIsQuestionTimerActive(true);

    const interval = setInterval(() => {
      setQuestionTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsQuestionTimerActive(false);
          // Auto-skip question when time runs out
          handleSkipQuestion();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    questionTimeoutRef.current = interval;
  }, []);

  const clearQuestionTimer = useCallback(() => {
    if (questionTimeoutRef.current) {
      clearInterval(questionTimeoutRef.current);
      questionTimeoutRef.current = null;
    }
    setIsQuestionTimerActive(false);
    setQuestionTimeRemaining(0);
  }, []);

  // Video event handlers
  const handlePlayPause = useCallback(() => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  }, [isPlaying]);

  const handleTimeUpdate = useCallback(() => {
    if (!videoRef.current) return;

    const time = videoRef.current.currentTime;
    setCurrentTime(time);

    // Track watch time for analytics
    const now = Date.now();
    if (now - lastAnalyticsUpdate > 5000) {
      // Update every 5 seconds
      setWatchTimeSegments((prev) => [...prev, { start: time - 5, end: time }]);
      setLastAnalyticsUpdate(now);
    }

    // Check for questions that should be shown
    const currentQuestion = effectiveQuestions.find(
      (q) =>
        time >= q.timestamp &&
        time <= q.endTimestamp &&
        !answeredQuestions.has(q.id)
    );

    if (currentQuestion && !activeQuestion) {
      setActiveQuestion(currentQuestion);
      // Pause video when question appears
      videoRef.current.pause();
      setIsPlaying(false);

      // Start question timer if specified
      if (currentQuestion.timeLimit) {
        startQuestionTimer(currentQuestion.timeLimit);
      }

      // Show hint after a delay
      setTimeout(() => setShowQuestionHint(true), 3000);
    } else if (!currentQuestion && activeQuestion) {
      clearQuestionTimer();
      setActiveQuestion(null);
      setSelectedAnswer(null);
      setShowQuestionHint(false);
    }
  }, [
    effectiveQuestions,
    answeredQuestions,
    activeQuestion,
    lastAnalyticsUpdate,
    startQuestionTimer,
    clearQuestionTimer,
  ]);

  const handleVolumeChange = useCallback((newVolume: number) => {
    if (!videoRef.current) return;

    videoRef.current.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  }, []);

  const handleSeek = useCallback((newTime: number) => {
    if (!videoRef.current) return;

    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  }, []);

  const toggleMute = useCallback(() => {
    if (!videoRef.current) return;

    const newMuted = !isMuted;
    videoRef.current.muted = newMuted;
    setIsMuted(newMuted);
  }, [isMuted]);

  const toggleFullscreen = useCallback(() => {
    if (!isFullscreen) {
      containerRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }, [isFullscreen]);

  const changePlaybackSpeed = useCallback((speed: number) => {
    if (!videoRef.current) return;

    videoRef.current.playbackRate = speed;
    setPlaybackSpeed(speed);
  }, []);

  // Enhanced answer handling with feedback and rewards
  const handleAnswerSelect = useCallback((answerId: string) => {
    setSelectedAnswer(answerId);
  }, []);

  const handleAnswerSubmit = useCallback(async () => {
    if (!activeQuestion || !selectedAnswer) return;

    clearQuestionTimer();

    const selectedOption = effectiveQuestions.find(
      (q) => q.id === activeQuestion.id
    )?.options.find(
      (opt) => opt.id === selectedAnswer
    );
    const isCorrect = selectedOption?.isCorrect || false;
    const timeTaken = activeQuestion.timeLimit
      ? activeQuestion.timeLimit - questionTimeRemaining
      : 0;

    // Mark question as answered
    setAnsweredQuestions((prev) => new Set([...prev, activeQuestion.id]));

    // Calculate dynamic rewards based on performance
    let rewardMultiplier = 1;
    if (isCorrect) {
      // Bonus for quick answers
      if (timeTaken <= (activeQuestion.timeLimit || 20) * 0.3) {
        rewardMultiplier = 1.5;
      } else if (timeTaken <= (activeQuestion.timeLimit || 20) * 0.6) {
        rewardMultiplier = 1.2;
      }

      // Difficulty bonus
      if (activeQuestion.difficulty === 'hard') rewardMultiplier *= 1.3;
      else if (activeQuestion.difficulty === 'medium') rewardMultiplier *= 1.1;
    }

    const finalReward =
      isCorrect && activeQuestion.reward
        ? {
            merits: Math.round(activeQuestion.reward.merits * rewardMultiplier),
            ondas: Math.round(activeQuestion.reward.ondas * rewardMultiplier),
          }
        : { merits: 0, ondas: 0 };

    // Update metrics
    setMetrics((prev) => {
      const newCorrectAnswers = isCorrect
        ? prev.correctAnswers + 1
        : prev.correctAnswers;
      const newStreak = isCorrect ? prev.currentStreak + 1 : 0;
      const newMaxStreak = Math.max(prev.maxStreak, newStreak);

      return {
        ...prev,
        merits: prev.merits + finalReward.merits,
        ondas: prev.ondas + finalReward.ondas,
        questionsAnswered: prev.questionsAnswered + 1,
        correctAnswers: newCorrectAnswers,
        currentStreak: newStreak,
        maxStreak: newMaxStreak,
        sessionScore:
          prev.sessionScore + (isCorrect ? 100 * rewardMultiplier : 0),
        experience: prev.experience + (isCorrect ? 25 : 5),
      };
    });

    // Show feedback
    setAnswerFeedback({
      isVisible: true,
      isCorrect,
      message: isCorrect
        ? `¡Correcto! ${finalReward.merits > 0 ? `+${finalReward.merits} Mëritos, +${finalReward.ondas} Öndas` : ''}`
        : `Incorrecto. La respuesta correcta era: ${effectiveQuestions.find((q) => q.id === activeQuestion.id)?.options.find((opt) => opt.isCorrect)?.text}`,
      reward: finalReward,
    });

    // Show reward animation if earned
    if (isCorrect && finalReward.merits > 0) {
      setRewardAnimation({
        isVisible: true,
        reward: finalReward,
      });

      setTimeout(() => {
        setRewardAnimation((prev) => ({ ...prev, isVisible: false }));
      }, 3000);
    }

    // Call callbacks
    onQuestionAnswer?.(activeQuestion.id, selectedAnswer, isCorrect);
    onMetricsUpdate?.(metrics);
    if (isCorrect && finalReward.merits > 0) {
      onRewardEarned?.(finalReward);
    }

    // Send analytics to backend if enabled
    if (enableAnalytics && userId) {
      try {
        await apiService.post('/analytics/video-question', {
          userId,
          videoId,
          questionId: activeQuestion.id,
          selectedAnswer,
          isCorrect,
          timeTaken,
          reward: finalReward,
          timestamp: new Date().toISOString(),
        });
      } catch (error) {
        // Gracefully handle missing analytics endpoints during development
        const apiError = error as any;
        if (apiError?.statusCode === 404) {
          console.info('📊 Video question analytics endpoint not yet implemented - this is expected during development');
        } else {
          console.warn('Failed to send question analytics:', error);
        }
      }
    }

    // Clear feedback after delay
    setTimeout(() => {
      setAnswerFeedback((prev) => ({ ...prev, isVisible: false }));
    }, 4000);

    // Clear active question and resume video
    setTimeout(
      () => {
        setActiveQuestion(null);
        setSelectedAnswer(null);
        setShowQuestionHint(false);

        // Resume video playback
        if (videoRef.current) {
          videoRef.current.play();
          setIsPlaying(true);
        }
      },
      isCorrect ? 2000 : 4000
    );
  }, [
    activeQuestion,
    selectedAnswer,
    questionTimeRemaining,
    metrics,
    onQuestionAnswer,
    onMetricsUpdate,
    onRewardEarned,
    enableAnalytics,
    userId,
    videoId,
    clearQuestionTimer,
    effectiveQuestions,
  ]);

  const handleSkipQuestion = useCallback(() => {
    if (!activeQuestion) return;

    clearQuestionTimer();

    // Mark as skipped (count as answered to prevent re-showing)
    setAnsweredQuestions((prev) => new Set([...prev, activeQuestion.id]));

    // Show skip feedback
    setAnswerFeedback({
      isVisible: true,
      isCorrect: false,
      message: 'Pregunta omitida. ¡No te rindas, sigue participando!',
    });

    // Update streak (break it)
    setMetrics((prev) => ({ ...prev, currentStreak: 0 }));

    // Clear feedback and resume
    setTimeout(() => {
      setAnswerFeedback((prev) => ({ ...prev, isVisible: false }));
      setActiveQuestion(null);
      setSelectedAnswer(null);
      setShowQuestionHint(false);

      // Resume video
      if (videoRef.current) {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }, 2000);
  }, [activeQuestion, clearQuestionTimer]);

  // Progress calculation
  const progressPercentage = useMemo(() => {
    return duration > 0 ? (currentTime / duration) * 100 : 0;
  }, [currentTime, duration]);

  // Question progress calculation
  const questionProgress = useMemo(() => {
    if (!activeQuestion?.timeLimit || !isQuestionTimerActive) return 100;
    return (questionTimeRemaining / activeQuestion.timeLimit) * 100;
  }, [activeQuestion, questionTimeRemaining, isQuestionTimerActive]);

  // Auto-hide controls
  useEffect(() => {
    let timer: NodeJS.Timeout;

    const resetTimer = () => {
      setShowControls(true);
      clearTimeout(timer);
      timer = setTimeout(() => setShowControls(false), 3000);
    };

    const handleMouseMove = () => resetTimer();

    if (isPlaying && !activeQuestion) {
      containerRef.current?.addEventListener('mousemove', handleMouseMove);
      resetTimer();
    } else {
      setShowControls(true);
    }

    return () => {
      clearTimeout(timer);
      containerRef.current?.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isPlaying, activeQuestion]);

  // Fullscreen event listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () =>
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Large viewport detection
  useEffect(() => {
    const checkViewportSize = () => {
      setIsLargeViewport(window.innerWidth >= 1920); // 4K/Ultra-wide detection
    };

    checkViewportSize();
    window.addEventListener('resize', checkViewportSize);
    return () => window.removeEventListener('resize', checkViewportSize);
  }, []);

  // Video completion handler
  const handleVideoEnd = useCallback(async () => {
    setIsPlaying(false);

    // Update completion metrics
    setMetrics((prev) => ({
      ...prev,
      videosCompleted: prev.videosCompleted + 1,
      timeSpent: duration,
    }));

    // Send completion analytics
    if (enableAnalytics && userId) {
      try {
        await apiService.post('/analytics/video-completion', {
          userId,
          videoId,
          duration,
          questionsAnswered: metrics.questionsAnswered,
          correctAnswers: metrics.correctAnswers,
          sessionScore: metrics.sessionScore,
          watchTimeSegments,
          completedAt: new Date().toISOString(),
        });
      } catch (error) {
        // Gracefully handle missing analytics endpoints during development
        const apiError = error as any;
        if (apiError?.statusCode === 404) {
          console.info('📊 Video completion analytics endpoint not yet implemented - this is expected during development');
        } else {
          console.warn('Failed to send completion analytics:', error);
        }
      }
    }

    onVideoComplete?.();
  }, [
    duration,
    metrics,
    enableAnalytics,
    userId,
    videoId,
    watchTimeSegments,
    onVideoComplete,
  ]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (activeQuestion) return; // Disable shortcuts during questions

      switch (event.key) {
        case ' ':
        case 'k':
          event.preventDefault();
          handlePlayPause();
          break;
        case 'f':
          event.preventDefault();
          toggleFullscreen();
          break;
        case 'm':
          event.preventDefault();
          toggleMute();
          break;
        case 'ArrowLeft':
          event.preventDefault();
          handleSeek(Math.max(0, currentTime - 10));
          break;
        case 'ArrowRight':
          event.preventDefault();
          handleSeek(Math.min(duration, currentTime + 10));
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    activeQuestion,
    handlePlayPause,
    toggleFullscreen,
    toggleMute,
    handleSeek,
    currentTime,
    duration,
  ]);

  return (
    <Box
      ref={containerRef}
      sx={{
        position: 'relative',
        width: '100%',
        height: isLandscape
          ? isFullscreen
            ? '100vh'
            : { xs: '100vw', md: '500px' }
          : '400px',
        backgroundColor: '#000',
        borderRadius: isFullscreen ? 0 : 2,
        overflow: 'hidden',
        transform: isLandscape && !isFullscreen ? 'rotate(-90deg)' : 'none',
        transformOrigin: 'center',
        ...(isLandscape &&
          !isFullscreen && {
            width: { xs: '100vh', md: '700px' },
            height: { xs: '100vw', md: '400px' },
            margin: 'auto',
          }),
      }}
    >
      {/* Video Element */}
      {videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be') ? (
        <iframe
          src={videoUrl.replace('watch?v=', 'embed/')}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{ width: '100%', height: '100%' }}
          title="YouTube video player"
        />
      ) : (
        <video
          ref={videoRef}
          src={videoUrl}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={() => setDuration(videoRef.current?.duration || 0)}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={handleVideoEnd}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            backgroundColor: '#000',
          }}
          autoPlay={autoplay}
          playsInline
        />
      )}

      {/* Status Bar - Top overlay */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 60,
          background:
            'linear-gradient(to bottom, rgba(0,0,0,0.8), transparent)',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          padding: '12px 16px',
          color: 'white',
          zIndex: 10,
          opacity: showControls || activeQuestion ? 1 : 0,
          transition: 'opacity 0.3s ease',
        }}
      >
        {/* Back button */}
        <IconButton
          size="small"
          sx={{ color: 'white', p: 0.5 }}
          onClick={() => window.history.back()}
        >
          <ArrowBackIcon fontSize="small" />
        </IconButton>

        {/* Timer */}
        <Typography
          variant="h6"
          sx={{
            fontFamily: 'Roboto',
            fontWeight: 400,
            fontSize: '18px',
            textAlign: 'center',
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
          }}
        >
          {formatTime(currentTime)}
        </Typography>

        {/* Enhanced Metrics display */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            backgroundColor: 'rgba(0,0,0,0.7)',
            padding: '8px 12px',
            borderRadius: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <DiamondIcon sx={{ color: '#fbbf24', fontSize: 16 }} />
            <Typography variant="caption" sx={{ color: 'white', fontWeight: 600 }}>
              {metrics.merits}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <BoltIcon sx={{ color: '#10b981', fontSize: 16 }} />
            <Typography variant="caption" sx={{ color: 'white', fontWeight: 600 }}>
              {metrics.ondas}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <StarIcon sx={{ color: '#6366f1', fontSize: 16 }} />
            <Typography variant="caption" sx={{ color: 'white', fontWeight: 600 }}>
              Nivel {metrics.level}
            </Typography>
          </Box>

          {/* Debug Controls */}
          {showDebugControls && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, ml: 1 }}>
              <IconButton
                size="small"
                sx={{
                  color: 'white',
                  backgroundColor: 'rgba(99, 102, 241, 0.7)',
                  '&:hover': { backgroundColor: 'rgba(99, 102, 241, 0.9)' },
                  width: 28,
                  height: 28
                }}
                onClick={() => {
                  // Activar primera pregunta disponible para testing
                  const testQuestion = effectiveQuestions.find(q => !answeredQuestions.has(q.id));
                  if (testQuestion && !activeQuestion) {
                    setActiveQuestion(testQuestion);
                    if (videoRef.current) {
                      videoRef.current.pause();
                      setIsPlaying(false);
                    }
                    if (testQuestion.timeLimit) {
                      startQuestionTimer(testQuestion.timeLimit);
                    }
                  }
                }}
                title="Activar pregunta de prueba"
              >
                <QuizIcon sx={{ fontSize: 16 }} />
              </IconButton>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '10px' }}>
                Debug
              </Typography>
            </Box>
          )}
        </Box>
      </Box>

      {/* Question Timer Bar */}
      {activeQuestion && isQuestionTimerActive && (
        <Box
          sx={{
            position: 'absolute',
            top: 60,
            left: 0,
            right: 0,
            zIndex: 15,
          }}
        >
          <LinearProgress
            variant="determinate"
            value={questionProgress}
            sx={{
              height: 4,
              backgroundColor: 'rgba(255,255,255,0.2)',
              '& .MuiLinearProgress-bar': {
                backgroundColor: questionProgress > 30 ? '#10b981' : '#ef4444',
                transition: 'background-color 0.3s ease',
              },
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              top: 8,
              right: 16,
              color: 'white',
              fontSize: '12px',
              backgroundColor: 'rgba(0,0,0,0.7)',
              padding: '2px 8px',
              borderRadius: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
            }}
          >
            <TimerIcon sx={{ fontSize: 14 }} />
            {questionTimeRemaining}s
          </Box>
        </Box>
      )}

      {/* Interactive Question Overlay */}
      <Fade in={!!activeQuestion} timeout={500}>
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
            background: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(12px)',
            zIndex: 20,
            opacity: activeQuestion ? 1 : 0,
            transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
            px: { xs: 1, sm: 2, md: 3 },
            py: { xs: 2, md: 3 },
          }}
        >
          {activeQuestion && (
            <Card
              className="question-card question-appear"
              role="dialog"
              aria-modal="true"
              aria-labelledby="question-title"
              aria-describedby="question-content"
              sx={{
                width: '100%',
                maxWidth: {
                  xs: '95vw',
                  sm: '85vw',
                  md: '75vw',
                  lg: '65vw',
                  xl: '60vw',
                  ...(isFullscreen && {
                    xs: '90vw',
                    sm: '80vw',
                    md: '70vw',
                    lg: '60vw',
                    xl: '55vw',
                  })
                },
                maxHeight: {
                  xs: '85vh',
                  sm: '80vh',
                  md: '75vh',
                  ...(isFullscreen && {
                    xs: '90vh',
                    sm: '85vh',
                    md: '80vh',
                  })
                },
                background: 'linear-gradient(135deg, rgba(139, 69, 19, 0.95) 0%, rgba(101, 67, 33, 0.95) 50%, rgba(160, 82, 45, 0.95) 100%)',
                backdropFilter: 'blur(20px)',
                borderRadius: { xs: 4, md: 6 },
                border: '2px solid rgba(255, 255, 255, 0.25)',
                boxShadow: '0 25px 80px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.1)',
                position: 'relative',
                overflow: 'hidden',
                // Mejor enfoque para lectores de pantalla
                '&:focus-within': {
                  outline: '3px solid #fbbf24',
                  outlineOffset: '4px',
                },
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: -50,
                  left: { xs: -30, md: -50 },
                  width: { xs: 60, md: 100 },
                  height: { xs: 60, md: 100 },
                  background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
                  pointerEvents: 'none',
                },
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -50,
                  right: { xs: -30, md: -50 },
                  width: { xs: 60, md: 100 },
                  height: { xs: 60, md: 100 },
                  background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
                  pointerEvents: 'none',
                }
              }}
            >
              {/* Texto oculto para lectores de pantalla */}
              <Typography className="sr-only" id="question-title">
                Pregunta interactiva número {activeQuestion.id}
              </Typography>

              <CardContent sx={{
                p: {
                  xs: 2,
                  sm: 2.5,
                  md: 3,
                  lg: 4,
                  ...(isFullscreen && { xs: 2.5, sm: 3, md: 4, lg: 5 })
                },
                position: 'relative',
                zIndex: 2
              }}>
                {/* Question Header - Mejorado para accesibilidad */}
                <Box sx={{ textAlign: 'center', mb: { xs: 2.5, md: 3.5 } }}>
                  <Typography
                    variant="h5"
                    component="h2"
                    className="question-header"
                    sx={{
                      color: 'white',
                      fontWeight: 800,
                      textShadow: '0 2px 10px rgba(0,0,0,0.6)',
                      mb: { xs: 1.5, md: 2 },
                      fontSize: {
                        xs: '1.1rem',
                        sm: '1.2rem',
                        md: '1.35rem',
                        lg: '1.5rem',
                        xl: '1.6rem',
                        ...(isFullscreen && {
                          xs: '1.2rem',
                          sm: '1.35rem',
                          md: '1.5rem',
                          lg: '1.65rem',
                          xl: '1.8rem',
                        })
                      },
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: { xs: 1.5, md: 2 },
                      flexWrap: 'wrap',
                    }}
                  >
                    <Box
                      sx={{
                        width: { xs: 42, md: 48, ...(isFullscreen && { xs: 48, md: 54 }) },
                        height: { xs: 42, md: 48, ...(isFullscreen && { xs: 48, md: 54 }) },
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: { xs: '1.3rem', md: '1.5rem' },
                        boxShadow: '0 6px 20px rgba(245, 158, 11, 0.5)',
                        flexShrink: 0,
                      }}
                    >
                      🧠
                    </Box>
                    Pregunta Interactiva
                  </Typography>
                  <Typography
                    variant="h6"
                    component="p"
                    id="question-content"
                    sx={{
                      color: 'white',
                      fontWeight: 600,
                      textShadow: '0 2px 8px rgba(0,0,0,0.5)',
                      lineHeight: { xs: 1.5, md: 1.6 },
                      fontSize: {
                        xs: '1rem',
                        sm: '1.1rem',
                        md: '1.2rem',
                        lg: '1.3rem',
                        xl: '1.4rem',
                        ...(isFullscreen && {
                          xs: '1.1rem',
                          sm: '1.2rem',
                          md: '1.3rem',
                          lg: '1.4rem',
                          xl: '1.5rem',
                        })
                      },
                      px: { xs: 1, md: 2 },
                      maxWidth: { xs: '100%', sm: '95%', md: '90%' },
                      mx: 'auto',
                      // Mejores contrastes para WCAG AAA
                      background: 'linear-gradient(135deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.2) 100%)',
                      borderRadius: 2,
                      py: { xs: 1, md: 1.5 },
                      border: '1px solid rgba(255,255,255,0.2)',
                    }}
                  >
                    {activeQuestion.question}
                  </Typography>
                </Box>

                {/* Question Options - Mejorado para accesibilidad y responsive */}
                <Stack
                  spacing={{ xs: 1.5, sm: 2, md: 2.5 }}
                  sx={{
                    mb: { xs: 3, md: 4 },
                    ...(isFullscreen && {
                      spacing: { xs: 2, sm: 2.5, md: 3 }
                    })
                  }}
                  role="radiogroup"
                  aria-labelledby="question-content"
                  aria-required="true"
                >
                  {(activeQuestion?.options || []).map((option, index) => (
                    <Button
                      key={option.id}
                      variant={selectedAnswer === option.id ? 'contained' : 'outlined'}
                      onClick={() => setSelectedAnswer(option.id)}
                      disabled={!!selectedAnswer}
                      className="question-option"
                      role="radio"
                      aria-checked={selectedAnswer === option.id}
                      aria-label={`Opción ${option.label}: ${option.text}`}
                      aria-describedby={selectedAnswer === option.id ? `option-${option.id}-selected` : undefined}
                      tabIndex={selectedAnswer ? -1 : 0}
                      sx={{
                        borderRadius: { xs: 4, sm: 5, md: 6 },
                        // Garantizar área táctil mínima de 48x48px (WCAG AAA)
                        minHeight: {
                          xs: 56, // 8px más que el mínimo para mejor UX
                          sm: 64,
                          md: 72,
                          lg: 80,
                          xl: 88,
                          ...(isFullscreen && { xs: 64, sm: 72, md: 84, lg: 92, xl: 100 })
                        },
                        py: {
                          xs: 1.5,
                          sm: 2,
                          md: 2.5,
                          lg: 3,
                          ...(isFullscreen && { xs: 2, sm: 2.5, md: 3, lg: 3.5 })
                        },
                        px: {
                          xs: 2,
                          sm: 2.5,
                          md: 3.5,
                          lg: 4,
                          ...(isFullscreen && { xs: 2.5, sm: 3, md: 4, lg: 4.5 })
                        },
                        textAlign: 'left',
                        justifyContent: 'flex-start',
                        background: selectedAnswer === option.id
                          ? 'linear-gradient(135deg, #059669 0%, #10b981 50%, #34d399 100%)'
                          : 'rgba(255, 255, 255, 0.15)',
                        borderColor: selectedAnswer === option.id
                          ? 'rgba(16, 185, 129, 0.8)'
                          : 'rgba(255, 255, 255, 0.4)',
                        borderWidth: { xs: '2px', md: '2.5px' },
                        color: 'white',
                        textTransform: 'none',
                        fontSize: {
                          xs: '0.95rem',
                          sm: '1rem',
                          md: '1.1rem',
                          lg: '1.2rem',
                          ...(isFullscreen && {
                            xs: '1rem',
                            sm: '1.1rem',
                            md: '1.2rem',
                            lg: '1.3rem',
                          })
                        },
                        fontWeight: 600,
                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                        position: 'relative',
                        overflow: 'hidden',
                        // Mejorar estados de focus para accesibilidad
                        '&:focus-visible': {
                          outline: '3px solid #fbbf24',
                          outlineOffset: '2px',
                          boxShadow: '0 0 0 6px rgba(251, 191, 36, 0.3)',
                          animation: 'focus-ring 2s infinite',
                        },
                        '&::before': selectedAnswer === option.id ? {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)',
                          animation: 'shimmer 2.5s infinite',
                        } : {},
                        '&:hover': {
                          background: selectedAnswer === option.id
                            ? 'linear-gradient(135deg, #047857 0%, #059669 50%, #10b981 100%)'
                            : 'rgba(255, 255, 255, 0.25)',
                          transform: 'translateY(-4px) scale(1.02)',
                          boxShadow: selectedAnswer === option.id
                            ? '0 16px 40px rgba(16, 185, 129, 0.5)'
                            : '0 12px 30px rgba(255, 255, 255, 0.2)',
                          borderColor: selectedAnswer === option.id
                            ? 'rgba(16, 185, 129, 1)'
                            : 'rgba(255, 255, 255, 0.6)',
                        },
                        '&:disabled': {
                          opacity: selectedAnswer === option.id ? 1 : 0.7,
                          transform: selectedAnswer === option.id ? 'scale(1.02)' : 'scale(1)',
                        }
                      }}
                    >
                      {/* Indicador de selección oculto para lectores de pantalla */}
                      {selectedAnswer === option.id && (
                        <Typography className="sr-only" id={`option-${option.id}-selected`}>
                          Opción seleccionada
                        </Typography>
                      )}

                      <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        width: '100%',
                        gap: { xs: 1.5, md: 2.5 }
                      }}>
                        <Avatar sx={{
                          width: {
                            xs: 32,
                            sm: 36,
                            md: 40,
                            lg: 44,
                            ...(isFullscreen && { xs: 36, sm: 40, md: 44, lg: 48 })
                          },
                          height: {
                            xs: 32,
                            sm: 36,
                            md: 40,
                            lg: 44,
                            ...(isFullscreen && { xs: 36, sm: 40, md: 44, lg: 48 })
                          },
                          bgcolor: selectedAnswer === option.id
                            ? 'rgba(255, 255, 255, 0.9)'
                            : 'rgba(255, 255, 255, 0.2)',
                          color: selectedAnswer === option.id ? '#059669' : 'white',
                          fontWeight: 800,
                          fontSize: {
                            xs: '0.9rem',
                            sm: '1rem',
                            md: '1.1rem',
                            lg: '1.2rem'
                          },
                          border: selectedAnswer === option.id
                            ? '2px solid rgba(255, 255, 255, 0.8)'
                            : '2px solid rgba(255, 255, 255, 0.3)',
                          flexShrink: 0,
                        }}>
                          {option.label}
                        </Avatar>
                        <Typography
                          variant="body1"
                          sx={{
                            fontWeight: 600,
                            lineHeight: 1.5,
                            flex: 1,
                            // Mejor contraste para legibilidad
                            textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                          }}
                        >
                          {option.text}
                        </Typography>
                        {selectedAnswer === option.id && (
                          <Box sx={{
                            width: 36,
                            height: 36,
                            borderRadius: '50%',
                            background: 'rgba(255, 255, 255, 0.95)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                            animation: 'pulse-gentle 2s infinite',
                          }}>
                            <CheckIcon sx={{ color: '#059669', fontSize: 24, fontWeight: 'bold' }} />
                          </Box>
                        )}
                      </Box>
                    </Button>
                  ))}
                </Stack>

                {/* Action Buttons - Mejorado para accesibilidad */}
                <Box sx={{
                  display: 'flex',
                  gap: { xs: 2, md: 3 },
                  justifyContent: 'center',
                  flexWrap: 'wrap',
                  ...(isFullscreen && {
                    gap: { xs: 2.5, md: 3.5 }
                  })
                }}>
                  <Button
                    variant="contained"
                    onClick={handleAnswerSubmit}
                    disabled={!selectedAnswer}
                    aria-label="Confirmar respuesta seleccionada"
                    sx={{
                      borderRadius: { xs: 4, sm: 5, md: 6 },
                      // Garantizar área táctil accesible
                      minHeight: {
                        xs: 48,
                        sm: 52,
                        md: 56,
                        lg: 60,
                        ...(isFullscreen && { xs: 52, sm: 56, md: 60, lg: 64 })
                      },
                      py: {
                        xs: 1.5,
                        sm: 2,
                        md: 2.5,
                        lg: 3,
                        ...(isFullscreen && { xs: 2, sm: 2.5, md: 3, lg: 3.5 })
                      },
                      px: {
                        xs: 3,
                        sm: 4,
                        md: 6,
                        lg: 7,
                        ...(isFullscreen && { xs: 4, sm: 5, md: 7, lg: 8 })
                      },
                      background: !selectedAnswer
                        ? 'rgba(255, 255, 255, 0.2)'
                        : 'linear-gradient(135deg, #059669 0%, #10b981 50%, #34d399 100%)',
                      boxShadow: !selectedAnswer
                        ? 'none'
                        : '0 10px 30px rgba(16, 185, 129, 0.5)',
                      fontWeight: 800,
                      fontSize: {
                        xs: '0.9rem',
                        sm: '1rem',
                        md: '1.1rem',
                        lg: '1.2rem',
                        xl: '1.25rem',
                        ...(isFullscreen && {
                          xs: '1rem',
                          sm: '1.1rem',
                          md: '1.2rem',
                          lg: '1.3rem',
                          xl: '1.35rem',
                        })
                      },
                      textTransform: 'none',
                      color: 'white',
                      minWidth: {
                        xs: 120,
                        sm: 140,
                        md: 170,
                        lg: 190,
                        xl: 210,
                        ...(isFullscreen && { xs: 140, sm: 160, md: 190, lg: 210, xl: 230 })
                      },
                      transition: 'all 0.4s ease',
                      // Estados de focus mejorados
                      '&:focus-visible': {
                        outline: '3px solid #fbbf24',
                        outlineOffset: '3px',
                        boxShadow: '0 0 0 6px rgba(251, 191, 36, 0.3)',
                      },
                      '&:hover': !selectedAnswer ? {} : {
                        background: 'linear-gradient(135deg, #047857 0%, #059669 50%, #10b981 100%)',
                        boxShadow: '0 16px 45px rgba(16, 185, 129, 0.6)',
                        transform: 'translateY(-4px) scale(1.05)',
                      },
                      '&:disabled': {
                        background: 'rgba(255, 255, 255, 0.15)',
                        color: 'rgba(255, 255, 255, 0.5)',
                        cursor: 'not-allowed',
                      }
                    }}
                  >
                    ✅ Confirmar
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={handleSkipQuestion}
                    aria-label="Omitir esta pregunta"
                    sx={{
                      borderRadius: { xs: 4, sm: 5, md: 6 },
                      minHeight: {
                        xs: 48,
                        sm: 52,
                        md: 56,
                        lg: 60,
                        ...(isFullscreen && { xs: 52, sm: 56, md: 60, lg: 64 })
                      },
                      py: {
                        xs: 1.5,
                        sm: 2,
                        md: 2.5,
                        lg: 3,
                        ...(isFullscreen && { xs: 2, sm: 2.5, md: 3, lg: 3.5 })
                      },
                      px: {
                        xs: 3,
                        sm: 4,
                        md: 5,
                        lg: 6,
                        ...(isFullscreen && { xs: 4, sm: 5, md: 6, lg: 7 })
                      },
                      borderColor: 'rgba(255, 255, 255, 0.5)',
                      borderWidth: { xs: '2px', md: '2.5px' },
                      color: 'white',
                      fontWeight: 700,
                      fontSize: {
                        xs: '0.85rem',
                        sm: '0.9rem',
                        md: '1rem',
                        lg: '1.1rem',
                        xl: '1.15rem',
                        ...(isFullscreen && {
                          xs: '0.9rem',
                          sm: '1rem',
                          md: '1.1rem',
                          lg: '1.2rem',
                          xl: '1.25rem',
                        })
                      },
                      textTransform: 'none',
                      minWidth: {
                        xs: 110,
                        sm: 120,
                        md: 140,
                        lg: 160,
                        xl: 180,
                        ...(isFullscreen && { xs: 120, sm: 140, md: 160, lg: 180, xl: 200 })
                      },
                      transition: 'all 0.3s ease',
                      '&:focus-visible': {
                        outline: '3px solid #fbbf24',
                        outlineOffset: '3px',
                        boxShadow: '0 0 0 6px rgba(251, 191, 36, 0.3)',
                      },
                      '&:hover': {
                        borderColor: 'rgba(255, 255, 255, 0.8)',
                        background: 'rgba(255, 255, 255, 0.2)',
                        transform: 'translateY(-3px) scale(1.03)',
                        boxShadow: '0 8px 25px rgba(255, 255, 255, 0.2)',
                      }
                    }}
                  >
                    ⏭️ Omitir
                  </Button>
                </Box>

                {/* Question Timer Progress */}
                {isQuestionTimerActive && (
                  <Box sx={{ mt: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 500 }}>
                        ⏱️ Tiempo restante
                      </Typography>
                      <Typography variant="body1" sx={{ color: 'white', fontWeight: 700 }}>
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
                          borderRadius: 4,
                          background: questionProgress > 30
                            ? 'linear-gradient(90deg, #10b981 0%, #34d399 100%)'
                            : 'linear-gradient(90deg, #ef4444 0%, #f87171 100%)',
                          transition: 'background 0.3s ease',
                        },
                      }}
                    />
                  </Box>
                )}

                {/* Reward Preview */}
                {activeQuestion.reward && (
                  <Box sx={{
                    mt: 3,
                    p: 2,
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: 2,
                    textAlign: 'center'
                  }}>
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)', mb: 1 }}>
                      🎁 Recompensa por respuesta correcta:
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                      <Chip
                        icon={<DiamondIcon />}
                        label={`+${activeQuestion.reward.merits} Mëritos`}
                        sx={{
                          bgcolor: 'rgba(251, 191, 36, 0.2)',
                          color: '#fbbf24',
                          fontWeight: 600,
                          border: '1px solid rgba(251, 191, 36, 0.3)',
                        }}
                      />
                      <Chip
                        icon={<BoltIcon />}
                        label={`+${activeQuestion.reward.ondas} Öndas`}
                        sx={{
                          bgcolor: 'rgba(16, 185, 129, 0.2)',
                          color: '#10b981',
                          fontWeight: 600,
                          border: '1px solid rgba(16, 185, 129, 0.3)',
                        }}
                      />
                    </Box>
                  </Box>
                )}
              </CardContent>
            </Card>
          )}
        </Box>
      </Fade>

      {/* Answer Feedback Snackbar */}
      <Snackbar
        open={answerFeedback.isVisible}
        autoHideDuration={null}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{ top: { xs: 24, sm: 80 } }}
      >
        <Alert
          severity={answerFeedback.isCorrect ? 'success' : 'error'}
          sx={{
            minWidth: 300,
            fontSize: '16px',
            fontWeight: 600,
            '& .MuiAlert-icon': {
              fontSize: '24px',
            },
          }}
          action={
            <IconButton
              size="small"
              color="inherit"
              onClick={() =>
                setAnswerFeedback((prev) => ({ ...prev, isVisible: false }))
              }
            >
              <CloseIcon />
            </IconButton>
          }
        >
          {answerFeedback.message}
        </Alert>
      </Snackbar>

      {/* Reward Animation */}
      <Zoom in={rewardAnimation.isVisible}>
        <Box
          sx={{
            position: 'absolute',
            top: '30%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 25,
            textAlign: 'center',
            pointerEvents: 'none',
          }}
        >
          <Box
            sx={{
              background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
              borderRadius: '20px',
              p: 3,
              color: 'white',
              boxShadow: '0 8px 32px rgba(251, 191, 36, 0.5)',
              animation: 'pulse 2s infinite',
              '@keyframes pulse': {
                '0%': { transform: 'scale(1)' },
                '50%': { transform: 'scale(1.05)' },
                '100%': { transform: 'scale(1)' },
              },
            }}
          >
            <Typography variant="h4" sx={{ mb: 1, fontWeight: 800 }}>
              🎉 ¡Excelente!
            </Typography>
            <Stack direction="row" justifyContent="center" spacing={2}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <DiamondIcon />
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  +{rewardAnimation.reward.merits}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <BoltIcon />
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  +{rewardAnimation.reward.ondas}
                </Typography>
              </Box>
            </Stack>
          </Box>
        </Box>
      </Zoom>

      {/* Enhanced Video Controls - Bottom overlay */}
      <Fade in={showControls || !isPlaying} timeout={300}>
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            background: 'linear-gradient(transparent, rgba(0, 0, 0, 0.8))',
            padding: '15px 20px',
            zIndex: 10,
          }}
        >
          {/* Progress bar */}
          <Box sx={{ mb: 2 }}>
            <Slider
              value={currentTime}
              max={duration}
              onChange={(_, value) => handleSeek(value as number)}
              sx={{
                color: '#6750A4',
                height: 6,
                '& .MuiSlider-thumb': {
                  width: 16,
                  height: 16,
                  backgroundColor: '#6750A4',
                  border: '2px solid white',
                  boxShadow: '0 2px 8px rgba(103, 80, 164, 0.4)',
                  '&:hover, &.Mui-focusVisible': {
                    boxShadow: '0 4px 12px rgba(103, 80, 164, 0.6)',
                  },
                },
                '& .MuiSlider-track': {
                  height: 6,
                  borderRadius: '3px',
                  background:
                    'linear-gradient(90deg, #6750A4 0%, #8B5CF6 50%, #A855F7 100%)',
                  border: 'none',
                },
                '& .MuiSlider-rail': {
                  height: 6,
                  borderRadius: '3px',
                  backgroundColor: 'rgba(255, 255, 255, 0.3)',
                  opacity: 1,
                },
              }}
            />
          </Box>

          {/* Control buttons */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            {/* Left controls */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <IconButton
                onClick={handlePlayPause}
                sx={{
                  color: 'white',
                  p: 0.5,
                  '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' },
                }}
              >
                {isPlaying ? (
                  <PauseIcon fontSize="large" />
                ) : (
                  <PlayIcon fontSize="large" />
                )}
              </IconButton>

              <IconButton
                sx={{
                  color: 'white',
                  p: 0.5,
                  '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' },
                }}
              >
                <SkipNextIcon />
              </IconButton>

              <IconButton
                onClick={toggleMute}
                sx={{
                  color: 'white',
                  p: 0.5,
                  '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' },
                }}
              >
                {isMuted ? <VolumeOffIcon /> : <VolumeIcon />}
              </IconButton>

              {/* Volume slider */}
              <Slider
                value={isMuted ? 0 : volume}
                max={1}
                step={0.1}
                onChange={(_, value) => handleVolumeChange(value as number)}
                sx={{
                  width: 80,
                  color: 'white',
                  '& .MuiSlider-thumb': {
                    width: 12,
                    height: 12,
                  },
                }}
              />

              {/* Duration display */}
              <Typography
                variant="body2"
                sx={{
                  color: 'white',
                  minWidth: 100,
                  textAlign: 'center',
                  fontSize: '14px',
                  fontWeight: 500,
                }}
              >
                {formatTime(currentTime)} / {formatTime(duration)}
              </Typography>
            </Box>

            {/* Right controls */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {/* Playback speed */}
              <Tooltip title="Velocidad de reproducción">
                <Button
                  size="small"
                  onClick={() => {
                    const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];
                    const currentIndex = speeds.indexOf(playbackSpeed);
                    const nextSpeed =
                      speeds[(currentIndex + 1) % speeds.length];
                    changePlaybackSpeed(nextSpeed);
                  }}
                  sx={{
                    color: 'white',
                    minWidth: 45,
                    fontSize: '12px',
                    fontWeight: 600,
                    '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' },
                  }}
                  startIcon={<SpeedIcon sx={{ fontSize: 16 }} />}
                >
                  {playbackSpeed}x
                </Button>
              </Tooltip>

              <IconButton
                sx={{
                  color: 'white',
                  p: 0.5,
                  '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' },
                }}
              >
                <SettingsIcon />
              </IconButton>

              <IconButton
                onClick={toggleFullscreen}
                sx={{
                  color: 'white',
                  p: 0.5,
                  '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' },
                }}
              >
                {isFullscreen ? <ExitFullscreenIcon /> : <FullscreenIcon />}
              </IconButton>
            </Box>
          </Box>
        </Box>
      </Fade>
    </Box>
  );
};

export default InteractiveVideoPlayerOverlay;
