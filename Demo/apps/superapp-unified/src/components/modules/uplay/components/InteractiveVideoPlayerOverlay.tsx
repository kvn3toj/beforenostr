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
} from '@mui/icons-material';

// Importar servicios para integración con backend
import { apiService } from '../../../../lib/api-service';

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
    timestamp: 15,
    endTimestamp: 45,
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
    timestamp: 120,
    endTimestamp: 140,
    type: 'true-false',
    question:
      '¿Las Öndas representan energía vibracional positiva en el ecosistema?',
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
    timestamp: 200,
    endTimestamp: 215,
    type: 'quick-response',
    question: '¿Qué significa "Bien Común" en la filosofía CoomÜnity?',
    timeLimit: 10,
    difficulty: 'hard',
    reward: { merits: 25, ondas: 12 },
    options: [
      {
        id: 'a',
        label: 'A',
        text: 'Beneficio colectivo sobre individual',
        isCorrect: true,
      },
      {
        id: 'b',
        label: 'B',
        text: 'Ganancia personal máxima',
        isCorrect: false,
      },
      {
        id: 'c',
        label: 'C',
        text: 'Neutralidad en decisiones',
        isCorrect: false,
      },
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
  questions = mockQuestions,
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

  // Video state
  const [isPlaying, setIsPlaying] = useState(autoplay);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

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

  // Player metrics state
  const [metrics, setMetrics] = useState<VideoPlayerMetrics>(mockMetrics);
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
    const currentQuestion = questions.find(
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
    questions,
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

    const selectedOption = activeQuestion.options.find(
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
        : `Incorrecto. La respuesta correcta era: ${activeQuestion.options.find((opt) => opt.isCorrect)?.text}`,
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
        if (error.statusCode === 404) {
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
        if (error.statusCode === 404) {
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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Tooltip title="Mëritos ganados">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Typography
                variant="h6"
                sx={{
                  fontFamily: 'Roboto',
                  fontWeight: 500,
                  fontSize: '20px',
                  color: '#fbbf24',
                }}
              >
                {metrics.merits}
              </Typography>
              <DiamondIcon sx={{ color: '#fbbf24', fontSize: 16 }} />
            </Box>
          </Tooltip>

          <Tooltip title="Öndas de energía positiva">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Typography
                variant="h6"
                sx={{
                  fontFamily: 'Roboto',
                  fontWeight: 500,
                  fontSize: '20px',
                  color: '#10b981',
                }}
              >
                {metrics.ondas}
              </Typography>
              <BoltIcon sx={{ color: '#10b981', fontSize: 16 }} />
            </Box>
          </Tooltip>

          {metrics.currentStreak > 0 && (
            <Tooltip title={`Racha actual: ${metrics.currentStreak}`}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontFamily: 'Roboto',
                    fontWeight: 500,
                    fontSize: '18px',
                    color: '#ef4444',
                  }}
                >
                  {metrics.currentStreak}
                </Typography>
                <Box sx={{ fontSize: 16 }}>🔥</Box>
              </Box>
            </Tooltip>
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

      {/* Enhanced Question Overlay */}
      <Fade in={!!activeQuestion} timeout={500}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '90%',
            maxWidth: 700,
            zIndex: 20,
            display: activeQuestion ? 'block' : 'none',
          }}
        >
          {activeQuestion && (
            <Box>
              {/* Question Header */}
              <Box
                sx={{
                  textAlign: 'center',
                  mb: 3,
                  p: 2,
                  backgroundColor: 'rgba(0,0,0,0.8)',
                  borderRadius: 2,
                  backdropFilter: 'blur(10px)',
                }}
              >
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={1}
                >
                  <Chip
                    label={
                      activeQuestion.type === 'quick-response'
                        ? 'Respuesta Rápida'
                        : activeQuestion.type === 'true-false'
                          ? 'Verdadero/Falso'
                          : 'Opción Múltiple'
                    }
                    size="small"
                    sx={{
                      backgroundColor:
                        activeQuestion.difficulty === 'hard'
                          ? '#ef4444'
                          : activeQuestion.difficulty === 'medium'
                            ? '#f59e0b'
                            : '#10b981',
                      color: 'white',
                      fontWeight: 600,
                    }}
                  />

                  {activeQuestion.reward && (
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Chip
                        icon={<DiamondIcon />}
                        label={`+${activeQuestion.reward.merits}`}
                        size="small"
                        sx={{
                          backgroundColor: '#fbbf24',
                          color: 'white',
                          fontWeight: 600,
                        }}
                      />
                      <Chip
                        icon={<BoltIcon />}
                        label={`+${activeQuestion.reward.ondas}`}
                        size="small"
                        sx={{
                          backgroundColor: '#10b981',
                          color: 'white',
                          fontWeight: 600,
                        }}
                      />
                    </Box>
                  )}
                </Stack>

                <Typography
                  variant="h5"
                  sx={{
                    color: 'white',
                    fontFamily: 'Roboto',
                    fontSize: '20px',
                    fontWeight: 500,
                    lineHeight: 1.4,
                  }}
                >
                  {activeQuestion.question}
                </Typography>
              </Box>

              {/* Answer options */}
              <Box
                sx={{
                  display: 'flex',
                  gap: 2,
                  justifyContent: 'center',
                  flexWrap: 'wrap',
                  px: 1,
                }}
              >
                {activeQuestion.options.map((option) => (
                  <Card
                    key={option.id}
                    sx={{
                      minWidth:
                        activeQuestion.type === 'true-false' ? 200 : 240,
                      maxWidth:
                        activeQuestion.type === 'true-false' ? 250 : 320,
                      cursor: 'pointer',
                      borderRadius: '16px',
                      backgroundColor:
                        selectedAnswer === option.id
                          ? 'rgba(103, 80, 164, 0.95)'
                          : 'rgba(255, 255, 255, 0.95)',
                      color:
                        selectedAnswer === option.id
                          ? 'white'
                          : 'rgba(66, 65, 65, 0.87)',
                      transform:
                        selectedAnswer === option.id
                          ? 'scale(1.05)'
                          : 'scale(1)',
                      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                      boxShadow:
                        selectedAnswer === option.id
                          ? '0px 8px 32px rgba(103, 80, 164, 0.5)'
                          : '0px 4px 16px rgba(0, 0, 0, 0.2)',
                      border:
                        selectedAnswer === option.id
                          ? '3px solid rgba(103, 80, 164, 0.8)'
                          : '2px solid rgba(255, 255, 255, 0.3)',
                      backdropFilter: 'blur(12px)',
                      '&:hover': {
                        transform: 'scale(1.03)',
                        backgroundColor:
                          selectedAnswer === option.id
                            ? 'rgba(103, 80, 164, 1)'
                            : 'rgba(255, 255, 255, 1)',
                        boxShadow:
                          selectedAnswer === option.id
                            ? '0px 12px 40px rgba(103, 80, 164, 0.6)'
                            : '0px 6px 20px rgba(0, 0, 0, 0.25)',
                      },
                    }}
                    onClick={() => handleAnswerSelect(option.id)}
                  >
                    <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
                      <Typography
                        variant="h4"
                        sx={{
                          fontFamily: 'Roboto',
                          fontSize: '24px',
                          fontWeight: 700,
                          textAlign: 'center',
                          mb: 1.5,
                          letterSpacing: '1px',
                        }}
                      >
                        {option.label}
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          fontFamily: 'Roboto',
                          fontSize: '15px',
                          fontWeight: 400,
                          lineHeight: 1.4,
                          textAlign: 'center',
                        }}
                      >
                        {option.text}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </Box>

              {/* Action buttons */}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: 2,
                  mt: 3,
                }}
              >
                {selectedAnswer && (
                  <Button
                    variant="contained"
                    onClick={handleAnswerSubmit}
                    startIcon={<CheckCircleIcon />}
                    sx={{
                      backgroundColor: '#10b981',
                      color: 'white',
                      borderRadius: '24px',
                      px: 4,
                      py: 1.5,
                      fontFamily: 'Roboto',
                      fontSize: '16px',
                      fontWeight: 600,
                      textTransform: 'none',
                      boxShadow: '0 4px 16px rgba(16, 185, 129, 0.4)',
                      '&:hover': {
                        backgroundColor: '#059669',
                        boxShadow: '0 6px 20px rgba(16, 185, 129, 0.5)',
                        transform: 'translateY(-2px)',
                      },
                    }}
                  >
                    Confirmar Respuesta
                  </Button>
                )}

                <Button
                  variant="outlined"
                  onClick={handleSkipQuestion}
                  startIcon={<CancelIcon />}
                  sx={{
                    borderColor: 'rgba(255,255,255,0.5)',
                    color: 'white',
                    borderRadius: '24px',
                    px: 3,
                    py: 1.5,
                    fontFamily: 'Roboto',
                    fontSize: '14px',
                    fontWeight: 500,
                    textTransform: 'none',
                    '&:hover': {
                      borderColor: 'white',
                      backgroundColor: 'rgba(255,255,255,0.1)',
                    },
                  }}
                >
                  Omitir
                </Button>
              </Box>

              {/* Hint display */}
              {showQuestionHint && questionTimeRemaining > 5 && (
                <Fade in={true}>
                  <Box
                    sx={{
                      textAlign: 'center',
                      mt: 2,
                      p: 1.5,
                      backgroundColor: 'rgba(245, 158, 11, 0.9)',
                      borderRadius: 2,
                      color: 'white',
                    }}
                  >
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      💡 Recuerda: En CoomÜnity valoramos la reciprocidad y el
                      bien común
                    </Typography>
                  </Box>
                </Fade>
              )}
            </Box>
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
