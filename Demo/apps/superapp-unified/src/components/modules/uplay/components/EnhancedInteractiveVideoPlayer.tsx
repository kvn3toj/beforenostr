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
  Backdrop,
  Paper,
  Avatar,
  ButtonGroup,
  Collapse,
  Divider,
  Grid,
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  VolumeUp as VolumeIcon,
  VolumeOff as VolumeOffIcon,
  SkipNext as SkipNextIcon,
  Settings as SettingsIcon,
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
  School as SchoolIcon,
  TrendingUp as TrendingUpIcon,
  EmojiEvents as TrophyIcon,
  LocalFireDepartment as FireIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Psychology as PsychologyIcon,
  Lightbulb as LightbulbIcon,
  VideoLibrary as VideoLibraryIcon,
} from '@mui/icons-material';
import ReactPlayer from 'react-player';

// Import hooks and services
import { useInteractiveVideo } from '../../../../hooks/useInteractiveVideo';
import { useVideoQuestions } from '../../../../hooks/uplay/useVideoQuestions';
import { apiService } from '../../../../lib/api-service';
import { getVideoQuestions } from '../../../../lib/videoQuestions';
import {
  findWorkingVideoUrl,
  checkVideoAvailability,
} from '../../../../utils/videoUtils';

// Import Design System Cósmico
import { CosmicCardAire } from '../../../../design-system/components/cosmic/CosmicCard';

// Enhanced types for better video player
interface QuestionOverlay {
  id: number;
  timestamp: number;
  endTimestamp: number;
  type: 'multiple-choice' | 'true-false' | 'quick-response';
  question: string;
  options: {
    id: string;
    text: string;
    label: string;
    isCorrect?: boolean;
  }[];
  timeLimit?: number;
  reward?: {
    merits: number;
    ondas: number;
  };
  difficulty?: 'easy' | 'medium' | 'hard';
}

interface VideoData {
  id: string;
  title: string;
  description: string;
  url: string;
  duration: number;
  questions: QuestionOverlay[];
  thumbnail?: string;
}

interface EnhancedInteractiveVideoPlayerProps {
  videoData: VideoData;
  onBack?: () => void;
  onVideoComplete?: () => void;
  onVideoChange?: (videoId: string) => void;
  userId?: string;
  autoplay?: boolean;
  enableAnalytics?: boolean;
  showBackButton?: boolean;
}

// 🎯 [INTEGRACIÓN BACKEND] Las preguntas ahora se obtienen dinámicamente del backend NestJS
// usando el hook useVideoQuestions que conecta con /video-items/:videoId/questions

// 🎯 [NUEVO] Componente interno con toda la lógica de hooks
const VideoPlayerContent: React.FC<EnhancedInteractiveVideoPlayerProps> = ({
  videoData,
  onBack,
  onVideoComplete,
  onVideoChange,
  userId = 'demo-user',
  autoplay = false,
  enableAnalytics = true,
  showBackButton = true,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // 🎯 [NUEVO] Hook para obtener preguntas dinámicas del backend
  const {
    data: questionsFromBackend,
    isLoading: questionsLoading,
    isError: questionsError,
    error: questionsErrorDetails,
  } = useVideoQuestions(videoData.id);

  console.log('🎯 [VideoPlayer] Questions hook state:', {
    videoId: videoData.id,
    questionsLoading,
    questionsError,
    questionsCount: questionsFromBackend?.length || 0,
    errorDetails: questionsErrorDetails,
  });

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const questionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Enhanced video state
  const [isPlaying, setIsPlaying] = useState(autoplay);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [videoError, setVideoError] = useState<string | null>(null);
  const [actualVideoUrl, setActualVideoUrl] = useState<string>(videoData.url || '');

  // Enhanced question state
  const [activeQuestion, setActiveQuestion] = useState<QuestionOverlay | null>(
    null
  );
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<number>>(
    new Set()
  );
  const [questionTimeRemaining, setQuestionTimeRemaining] = useState<number>(0);
  const [isQuestionTimerActive, setIsQuestionTimerActive] = useState(false);
  const [questionStartTime, setQuestionStartTime] = useState<number>(0);
  const [questionsData, setQuestionsData] = useState<QuestionOverlay[]>([]);

  // Enhanced feedback state
  const [answerFeedback, setAnswerFeedback] = useState<{
    isVisible: boolean;
    isCorrect: boolean;
    message: string;
    reward?: { merits: number; ondas: number };
  }>({
    isVisible: false,
    isCorrect: false,
    message: '',
  });

  // UI state
  const [showVideoInfo, setShowVideoInfo] = useState(false);
  const [showQuestionsList, setShowQuestionsList] = useState(false);

  // Use enhanced interactive video hook
  const {
    metrics,
    analytics,
    handleQuestionAnswer,
    handleQuestionSkip,
    handleVideoComplete: onVideoCompleteHook,
    trackVideoInteraction,
    updateWatchTime,
    progressToNextLevel,
    experienceForNextLevel,
    accuracyRate,
  } = useInteractiveVideo({
    videoId: videoData.id,
    userId,
    enableAnalytics,
    onRewardEarned: (reward) => {
      setAnswerFeedback((prev) => ({
        ...prev,
        reward,
      }));
    },
    onLevelUp: (newLevel) => {
      console.log('Level up!', newLevel);
    },
    onAchievementUnlocked: (achievement) => {
      console.log('Achievement unlocked!', achievement);
    },
  });

  // Resolve working video URL on mount
  useEffect(() => {
    const resolveVideoUrl = async () => {
      console.log('🎬 Resolving video URL for:', videoData.id);

      // 🎯 PRIORIDAD MÁXIMA: Si la URL es de YouTube, usarla directamente con embed format
      const isYouTubeUrl = videoData.url && (
        videoData.url.includes('youtube.com') || 
        videoData.url.includes('youtu.be')
      );

      if (isYouTubeUrl) {
        console.log('🎯 [YOUTUBE] Detected YouTube URL, using embed format:', videoData.url);
        
        // Validate YouTube URL first
        const isValidYouTubeUrl = await checkVideoAvailability(videoData.url);
        
        if (isValidYouTubeUrl) {
          console.log('✅ YouTube URL is valid, setting as actual URL');
          setActualVideoUrl(videoData.url);
        } else {
          console.warn('⚠️ YouTube URL validation failed, but proceeding anyway:', videoData.url);
          setActualVideoUrl(videoData.url);
        }
        return;
      }

      // For non-YouTube videos, check if the direct URL works
      if (videoData.url) {
        console.log('🔍 Checking non-YouTube video URL availability:', videoData.url);
        
        const isAvailable = await checkVideoAvailability(videoData.url);
        
        if (isAvailable) {
          console.log('✅ Direct video URL is available:', videoData.url);
          setActualVideoUrl(videoData.url);
        } else {
          console.error('🚫 Direct video URL is not available, using anyway:', videoData.url);
          setActualVideoUrl(videoData.url);
        }
      } else {
        console.error('🚫 No video URL provided for videoData.id:', videoData.id);
        setActualVideoUrl('');
      }
    };

    resolveVideoUrl();
  }, [videoData.id, videoData.url]);

  // 🎯 [NUEVO] Transformador de datos: Backend → Frontend
  const transformBackendQuestions = useCallback((backendQuestions: any[]): QuestionOverlay[] => {
    if (!backendQuestions || !Array.isArray(backendQuestions)) {
      console.warn('🔄 [VideoPlayer] Invalid backend questions data:', backendQuestions);
      return [];
    }

    return backendQuestions.map((backendQ, index) => {
      // Transformar opciones: agregar campo 'label' faltante
      const transformedOptions = (backendQ.options || []).map((option: any, optionIndex: number) => ({
        id: String(option.id), // Convertir number → string
        text: option.text,
        label: String.fromCharCode(65 + optionIndex), // A, B, C, D
        isCorrect: option.isCorrect,
      }));

      // Transformar pregunta principal
      const transformed: QuestionOverlay = {
        id: backendQ.id,
        timestamp: backendQ.timestamp,
        endTimestamp: backendQ.endTimestamp || (backendQ.timestamp + 30), // +30s si es null
        type: backendQ.type === 'MULTIPLE_CHOICE' ? 'multiple-choice' : 'true-false', // Convertir formato
        question: backendQ.question,
        options: transformedOptions,
        timeLimit: backendQ.timeLimit || 20, // Default 20s
        reward: {
          merits: backendQ.reward?.merits || 5,
          ondas: backendQ.reward?.ondas || 3,
        },
        difficulty: backendQ.difficulty || 'medium',
      };

      console.log(`✅ [VideoPlayer] Transformed question ${backendQ.id}:`, {
        originalType: backendQ.type,
        transformedType: transformed.type,
        originalOptionsCount: backendQ.options?.length || 0,
        transformedOptionsCount: transformed.options.length,
        endTimestamp: transformed.endTimestamp,
      });

      return transformed;
    });
  }, []);

  // 🎯 [REFACTORIZADO] Integración con hook de preguntas dinámicas
  useEffect(() => {
    console.log('🎯 [VideoPlayer] Questions loading state:', {
      questionsLoading,
      questionsError,
      questionsCount: questionsFromBackend?.length || 0,
      videoId: videoData.id,
    });

    // Si las preguntas del backend están disponibles, transformarlas y usarlas
    if (questionsFromBackend && questionsFromBackend.length > 0) {
      const transformedQuestions = transformBackendQuestions(questionsFromBackend);
      setQuestionsData(transformedQuestions);
      console.log(
        '✅ [VideoPlayer] Using transformed backend questions for video:',
        videoData.id,
        transformedQuestions.length,
        'questions transformed'
      );
      return;
    }

    // Si hay error o no hay preguntas del backend, usar fallback
    if (questionsError || (!questionsLoading && (!questionsFromBackend || questionsFromBackend.length === 0))) {
      console.log('🔄 [VideoPlayer] Backend questions not available, using fallback');
      
      // Fallback to configured questions
      const configuredQuestions = getVideoQuestions(videoData.id);
      if (configuredQuestions.length > 0) {
        setQuestionsData(configuredQuestions);
        console.log(
          '📚 [VideoPlayer] Using configured questions for video:',
          videoData.id,
          configuredQuestions.length,
          'questions'
        );
      } else {
        // Si no hay preguntas configuradas, usar array vacío
        setQuestionsData([]);
        console.log(
          '⚠️ [VideoPlayer] No questions available for video:',
          videoData.id
        );
      }
    }
  }, [questionsFromBackend, questionsLoading, questionsError, videoData.id, transformBackendQuestions]);

  // Format time helper
  const formatTime = useCallback((seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  // Enhanced question timing logic con mejoras del UPLAY_ENVIRONMENT_REVIEW
  const startQuestionTimer = useCallback((timeLimit: number) => {
    console.log('🎯 [VideoPlayer] Starting question timer:', timeLimit, 'seconds');
    setQuestionTimeRemaining(timeLimit);
    setIsQuestionTimerActive(true);
    setQuestionStartTime(Date.now());

    const interval = setInterval(() => {
      setQuestionTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsQuestionTimerActive(false);
          console.log('⏰ [VideoPlayer] Question timer expired, auto-skipping');
          handleSkipQuestion();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    questionTimeoutRef.current = interval;
  }, []);

  const stopQuestionTimer = useCallback(() => {
    if (questionTimeoutRef.current) {
      clearInterval(questionTimeoutRef.current);
      questionTimeoutRef.current = null;
    }
    setIsQuestionTimerActive(false);
    console.log('⏹️ [VideoPlayer] Question timer stopped');
  }, []);

  // 🎯 [MEJORADO] Enhanced question handling según UPLAY_ENVIRONMENT_REVIEW
  const handleAnswerSelect = useCallback(
    async (optionId: string) => {
      if (!activeQuestion || selectedAnswer) return;

      console.log('✅ [VideoPlayer] Answer selected:', {
        questionId: activeQuestion.id,
        optionId,
        timeRemaining: questionTimeRemaining,
      });

      setSelectedAnswer(optionId);
      stopQuestionTimer();

      const timeTaken = (Date.now() - questionStartTime) / 1000;
      const result = await handleQuestionAnswer(
        activeQuestion.id,
        optionId,
        timeTaken
      );

      console.log('🎊 [VideoPlayer] Answer result:', result);

      setAnswerFeedback({
        isVisible: true,
        isCorrect: result.isCorrect,
        message: result.feedback,
        reward: result.reward,
      });

      setAnsweredQuestions((prev) => new Set([...prev, activeQuestion.id]));

      // Mejorar feedback visual según diseño Figma (UPLAY_ENVIRONMENT_REVIEW)
      setTimeout(() => {
        console.log('🔄 [VideoPlayer] Hiding question overlay, resuming video');
        setActiveQuestion(null);
        setSelectedAnswer(null);
        setAnswerFeedback({ isVisible: false, isCorrect: false, message: '' });
        if (videoRef.current) {
          videoRef.current.play();
          setIsPlaying(true);
        }
      }, 3000);
    },
    [
      activeQuestion,
      selectedAnswer,
      questionTimeRemaining,
      questionStartTime,
      handleQuestionAnswer,
      stopQuestionTimer,
    ]
  );

  const handleSkipQuestion = useCallback(() => {
    if (!activeQuestion) return;

    console.log('⏭️ [VideoPlayer] Skipping question:', activeQuestion.id);
    stopQuestionTimer();
    handleQuestionSkip(activeQuestion.id);
    setAnsweredQuestions((prev) => new Set([...prev, activeQuestion.id]));
    setActiveQuestion(null);
    setSelectedAnswer(null);

    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  }, [activeQuestion, handleQuestionSkip, stopQuestionTimer]);

  // 🎯 [CRÍTICO] Video event handlers con mejoras de timing del UPLAY_ENVIRONMENT_REVIEW
  const handleTimeUpdate = useCallback(() => {
    if (!videoRef.current) return;

    const time = videoRef.current.currentTime;
    setCurrentTime(time);
    updateWatchTime(time);

    // 🎯 [MEJORADO] Algoritmo de detección de preguntas con logs detallados
    console.log('🕐 [VideoPlayer] Time update:', {
      currentTime: time.toFixed(2),
      questionsAvailable: questionsData.length,
      activeQuestionId: activeQuestion?.id || 'none',
      answeredCount: answeredQuestions.size,
    });

    // Buscar preguntas para activar con lógica mejorada
    const candidateQuestion = questionsData.find(
      (q) => {
        const isInTimeRange = time >= q.timestamp && time <= q.endTimestamp;
        const notAnswered = !answeredQuestions.has(q.id);
        const noActiveQuestion = !activeQuestion;
        
        if (isInTimeRange) {
          console.log('🎯 [VideoPlayer] Question candidate found:', {
            questionId: q.id,
            timestamp: q.timestamp,
            endTimestamp: q.endTimestamp,
            currentTime: time.toFixed(2),
            isInTimeRange,
            notAnswered,
            noActiveQuestion,
            willTrigger: isInTimeRange && notAnswered && noActiveQuestion,
          });
        }
        
        return isInTimeRange && notAnswered && noActiveQuestion;
      }
    );

    if (candidateQuestion) {
      console.log('🚀 [VideoPlayer] ACTIVATING QUESTION:', {
        questionId: candidateQuestion.id,
        question: candidateQuestion.question.substring(0, 50) + '...',
        timestamp: candidateQuestion.timestamp,
        timeLimit: candidateQuestion.timeLimit,
      });
      
      setActiveQuestion(candidateQuestion);
      setSelectedAnswer(null);
      videoRef.current.pause();
      setIsPlaying(false);
      startQuestionTimer(candidateQuestion.timeLimit || 20);
    }
  }, [
    questionsData,
    answeredQuestions,
    activeQuestion,
    updateWatchTime,
    startQuestionTimer,
  ]);

  const handleLoadedMetadata = useCallback(() => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      setIsLoading(false);
    }
  }, []);

  const handleVideoEnd = useCallback(() => {
    setIsPlaying(false);
    onVideoCompleteHook(duration);
    onVideoComplete?.();
  }, [duration, onVideoCompleteHook, onVideoComplete]);

  const handleVideoError = useCallback(
    (event: any) => {
      console.error('Video loading error:', event);
      console.error('Video src (original):', videoData.url);
      console.error('Video src (actual):', actualVideoUrl);
      console.error('Video element:', videoRef.current);

      // Try to get more specific error information
      const video = videoRef.current;
      if (video) {
        console.error('Video error code:', video.error?.code);
        console.error('Video error message:', video.error?.message);
        console.error('Video network state:', video.networkState);
        console.error('Video ready state:', video.readyState);

        // Map error codes to user-friendly messages
        let errorMessage = 'Error loading video. ';
        switch (video.error?.code) {
          case 1: // MEDIA_ERR_ABORTED
            errorMessage += 'Video loading was aborted.';
            break;
          case 2: // MEDIA_ERR_NETWORK
            errorMessage += 'Network error occurred while loading video.';
            break;
          case 3: // MEDIA_ERR_DECODE
            errorMessage += 'Video file is corrupted or in unsupported format.';
            break;
          case 4: // MEDIA_ERR_SRC_NOT_SUPPORTED
            errorMessage += 'Video format not supported or file not found.';
            break;
          default:
            errorMessage += 'Unknown error occurred.';
        }

        setVideoError(`${errorMessage} (URL: ${actualVideoUrl})`);
      } else {
        setVideoError(
          `Error loading video: ${actualVideoUrl}. Please check that the video file exists.`
        );
      }

      setIsLoading(false);
    },
    [videoData.url, actualVideoUrl]
  );
  // Enhanced playback controls
  const togglePlayPause = useCallback(() => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
      trackVideoInteraction('pause');
    } else {
      videoRef.current.play();
      trackVideoInteraction('play', { currentTime });
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying, currentTime, trackVideoInteraction]);

  const handleSeek = useCallback(
    (newTime: number) => {
      if (!videoRef.current) return;

      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
      trackVideoInteraction('seek', { from: currentTime, to: newTime });
    },
    [currentTime, trackVideoInteraction]
  );

  const handleVolumeChange = useCallback((newVolume: number) => {
    if (!videoRef.current) return;

    setVolume(newVolume);
    videoRef.current.volume = newVolume;
    setIsMuted(newVolume === 0);
  }, []);

  const toggleMute = useCallback(() => {
    if (!videoRef.current) return;

    if (isMuted) {
      videoRef.current.volume = volume;
      setIsMuted(false);
    } else {
      videoRef.current.volume = 0;
      setIsMuted(true);
    }
  }, [isMuted, volume]);

  const changePlaybackSpeed = useCallback(
    (speed: number) => {
      if (!videoRef.current) return;

      setPlaybackSpeed(speed);
      videoRef.current.playbackRate = speed;
      trackVideoInteraction('speed_change', { speed });
    },
    [trackVideoInteraction]
  );

  // Enhanced controls visibility
  const showControlsTemporarily = useCallback(() => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
  }, [isPlaying]);

  // Mouse move handler for controls
  const handleMouseMove = useCallback(() => {
    showControlsTemporarily();
  }, [showControlsTemporarily]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (activeQuestion) return; // Don't handle shortcuts during questions

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          togglePlayPause();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          handleSeek(Math.max(0, currentTime - 10));
          break;
        case 'ArrowRight':
          e.preventDefault();
          handleSeek(Math.min(duration, currentTime + 10));
          break;
        case 'KeyM':
          e.preventDefault();
          toggleMute();
          break;
        case 'KeyF':
          e.preventDefault();
          // Toggle fullscreen would go here
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [
    togglePlayPause,
    handleSeek,
    currentTime,
    duration,
    toggleMute,
    activeQuestion,
  ]);

  // Cleanup timeouts
  useEffect(() => {
    return () => {
      if (questionTimeoutRef.current) {
        clearInterval(questionTimeoutRef.current);
      }
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, []);

  // Difficulty color mapping
  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'easy':
        return '#10b981';
      case 'medium':
        return '#f59e0b';
      case 'hard':
        return '#ef4444';
      default:
        return '#6366f1';
    }
  };

  // Question progress
  const totalQuestions = questionsData.length;
  const answeredCount = answeredQuestions.size;
  const questionProgress =
    totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0;

  return (
    <Box
      ref={containerRef}
      sx={{
        position: 'relative',
        width: '100%',
        height: isMobile ? '100vh' : '80vh',
        backgroundColor: '#000',
        borderRadius: isMobile ? 0 : 3,
        overflow: 'hidden',
        cursor: showControls ? 'default' : 'none',
      }}
      onMouseMove={handleMouseMove}
      onClick={showControlsTemporarily}
    >
      {/* Enhanced Video Element */}
      {actualVideoUrl?.includes('youtube.com') || actualVideoUrl?.includes('youtu.be') ? (
        /* Usar ReactPlayer para YouTube */
        <ReactPlayer
          url={actualVideoUrl}
          playing={isPlaying}
          controls={false} // Usamos controles personalizados
          volume={volume}
          muted={isMuted}
          playbackRate={playbackSpeed}
          onPlay={() => {
            setIsPlaying(true);
            trackVideoInteraction('play');
          }}
          onPause={() => {
            setIsPlaying(false);
            trackVideoInteraction('pause');
          }}
          onProgress={(state) => {
            const currentTime = state.playedSeconds;
            setCurrentTime(currentTime);
            updateWatchTime(currentTime);
            
            // 🎯 [CORREGIDO] Manejar preguntas con la lógica correcta
            if (questionsData.length > 0) {
              const candidateQuestion = questionsData.find(
                (q) => {
                  const isInTimeRange = currentTime >= q.timestamp && currentTime <= q.endTimestamp;
                  const notAnswered = !answeredQuestions.has(q.id);
                  const noActiveQuestion = !activeQuestion;
                  
                  return isInTimeRange && notAnswered && noActiveQuestion;
                }
              );

              if (candidateQuestion) {
                console.log('🚀 [ReactPlayer] ACTIVATING QUESTION:', {
                  questionId: candidateQuestion.id,
                  question: candidateQuestion.question.substring(0, 50) + '...',
                  timestamp: candidateQuestion.timestamp,
                  currentTime: currentTime.toFixed(2),
                });
                
                setActiveQuestion(candidateQuestion);
                setSelectedAnswer(null);
                setIsPlaying(false);
                startQuestionTimer(candidateQuestion.timeLimit || 20);
              }
            }
          }}
          onDuration={(duration) => {
            setDuration(duration);
            setIsLoading(false);
          }}
          onError={(error) => {
            console.error('ReactPlayer YouTube error:', error);
            setVideoError(`Error loading YouTube video. Please check the video URL: ${actualVideoUrl}`);
            setIsLoading(false);
          }}
          onReady={() => {
            console.log('✅ ReactPlayer YouTube video ready');
            setIsLoading(false);
          }}
          onEnded={handleVideoEnd}
          width="100%"
          height="100%"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
          }}
          config={{
            youtube: {
              playerVars: {
                showinfo: 0,
                controls: 0,
                disablekb: 1,
                rel: 0,
                modestbranding: 1,
                iv_load_policy: 3,
                fs: 1,
                cc_load_policy: 0,
                enablejsapi: 1,
                origin: window.location.origin,
                autoplay: autoplay ? 1 : 0,
              },
            },
          }}
        />
      ) : (
        /* Usar video nativo para archivos locales */
        <video
          ref={videoRef}
          src={actualVideoUrl}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
          }}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={handleVideoEnd}
          onError={handleVideoError}
          autoPlay={autoplay}
          playsInline
          preload="metadata"
          crossOrigin="anonymous"
        />
      )}

      {/* Loading State */}
      {isLoading && (
        <Backdrop
          open={true}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.8)',
            zIndex: 10,
          }}
        >
          <Stack alignItems="center" spacing={2}>
            <CircularProgress size={60} sx={{ color: '#6366f1' }} />
            <Typography color="white" variant="h6">
              Cargando video...
            </Typography>
          </Stack>
        </Backdrop>
      )}

      {/* Error State */}
      {videoError && (
        <Backdrop
          open={true}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.9)',
            zIndex: 10,
          }}
        >
          <Stack alignItems="center" spacing={3}>
            <CancelIcon sx={{ fontSize: 80, color: '#ef4444' }} />
            <Typography color="white" variant="h6" textAlign="center">
              {videoError}
            </Typography>
            <Button
              variant="contained"
              onClick={() => window.location.reload()}
              startIcon={<RefreshIcon />}
              sx={{
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                '&:hover': {
                  background:
                    'linear-gradient(135deg, #5a56eb 0%, #7c3aed 100%)',
                },
              }}
            >
              Reintentar
            </Button>
          </Stack>
        </Backdrop>
      )}

      {/* Enhanced Header with Navigation */}
      <Fade in={showControls || activeQuestion}>
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            background:
              'linear-gradient(180deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 70%, transparent 100%)',
            zIndex: 20,
            p: 2,
          }}
        >
          <Stack direction="row" alignItems="center" spacing={2}>
            {showBackButton && (
              <IconButton
                onClick={onBack}
                sx={{
                  color: 'white',
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' },
                }}
              >
                <ArrowBackIcon />
              </IconButton>
            )}

            <Box sx={{ flex: 1 }}>
              <Typography
                variant={isMobile ? 'h6' : 'h5'}
                sx={{
                  color: 'white',
                  fontWeight: 700,
                  textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                  mb: 0.5,
                }}
              >
                {videoData.title}
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center">
                <Chip
                  icon={questionsLoading ? <CircularProgress size={16} sx={{ color: 'white' }} /> : <QuizIcon />}
                  label={
                    questionsLoading 
                      ? 'Cargando preguntas...' 
                      : questionsError 
                        ? 'Error en preguntas'
                        : `${answeredCount}/${totalQuestions} preguntas`
                  }
                  size="small"
                  sx={{
                    backgroundColor: questionsError ? 'rgba(239, 68, 68, 0.9)' : 'rgba(99, 102, 241, 0.9)',
                    color: 'white',
                    fontWeight: 600,
                  }}
                />
                <Chip
                  icon={<SchoolIcon />}
                  label={`${Math.round(accuracyRate)}% precisión`}
                  size="small"
                  sx={{
                    backgroundColor: 'rgba(16, 185, 129, 0.9)',
                    color: 'white',
                    fontWeight: 600,
                  }}
                />
              </Stack>
            </Box>

            <Stack direction="row" spacing={1}>
              <IconButton
                onClick={() => setShowQuestionsList(!showQuestionsList)}
                sx={{
                  color: 'white',
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' },
                }}
              >
                <VideoLibraryIcon />
              </IconButton>
              <IconButton
                onClick={() => setShowVideoInfo(!showVideoInfo)}
                sx={{
                  color: 'white',
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' },
                }}
              >
                <SettingsIcon />
              </IconButton>
            </Stack>
          </Stack>
        </Box>
      </Fade>

      {/* 🎯 [MEJORADO] Enhanced Question Overlay - Diseño Figma según UPLAY_ENVIRONMENT_REVIEW */}
      <Dialog
        open={!!activeQuestion}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(15px)',
            borderRadius: 4, // Más redondeado según Figma
            border: `3px solid ${getDifficultyColor(activeQuestion?.difficulty)}`,
            boxShadow: '0 24px 48px rgba(0,0,0,0.15), 0 8px 16px rgba(0,0,0,0.1)', // Material Design 3
            m: 2,
            // Implementar posicionamiento A/B centrado como en Figma
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: -3,
              left: -3,
              right: -3,
              bottom: -3,
              background: `linear-gradient(135deg, ${getDifficultyColor(activeQuestion?.difficulty)}, ${getDifficultyColor(activeQuestion?.difficulty)}80)`,
              borderRadius: 4,
              zIndex: -1,
            },
          },
        }}
        BackdropProps={{
          sx: {
            backgroundColor: 'rgba(0,0,0,0.85)', // Más opaco para mejor contraste
            backdropFilter: 'blur(8px)',
          },
        }}
        // Mejoras de animación según UPLAY_ENVIRONMENT_REVIEW
        TransitionProps={{
          timeout: {
            enter: 400,
            exit: 300,
          },
        }}
      >
        <DialogContent sx={{ p: 5 }}> {/* Más padding para el diseño Figma */}
          {activeQuestion && (
            <CosmicCardAire
              element="aire"
              enableGlow
              enableAnimations
              cosmicIntensity={0.8}
              sx={{
                p: 4,
                borderRadius: 3,
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                border: 'none', // El Dialog ya tiene borde
                boxShadow: 'none', // Usar el shadow del Dialog
              }}
            >
              <Stack spacing={4}> {/* Más espaciado entre elementos */}
              {/* 🎯 [MEJORADO] Question Header con diseño Material Design 3 */}
              <Box>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={3} // Más margen según Figma
                >
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Chip
                      icon={<QuizIcon />}
                      label={`Pregunta ${activeQuestion.id}`}
                      sx={{
                        backgroundColor: getDifficultyColor(
                          activeQuestion.difficulty
                        ),
                        color: 'white',
                        fontWeight: 700,
                        fontSize: '14px',
                        height: 36, // Más altura para mejor presencia visual
                        '& .MuiChip-icon': {
                          color: 'white',
                        },
                      }}
                    />
                    <Chip
                      label={
                        activeQuestion.difficulty?.toUpperCase() || 'MEDIUM'
                      }
                      size="medium" // Cambiar de small a medium
                      variant="outlined"
                      sx={{
                        borderColor: getDifficultyColor(
                          activeQuestion.difficulty
                        ),
                        color: getDifficultyColor(activeQuestion.difficulty),
                        fontWeight: 600,
                        borderWidth: 2, // Borde más grueso
                      }}
                    />
                  </Stack>

                  {/* 🎯 [MEJORADO] Enhanced Timer con diseño más visual */}
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                      <CircularProgress
                        variant="determinate"
                        value={
                          (((activeQuestion.timeLimit || 20) -
                            questionTimeRemaining) /
                            (activeQuestion.timeLimit || 20)) *
                          100
                        }
                        size={48} // Más grande para mejor visibilidad
                        thickness={5} // Más grueso
                        sx={{
                          color:
                            questionTimeRemaining <= 5 ? '#ef4444' : getDifficultyColor(activeQuestion.difficulty),
                          // Animación de pulso cuando queda poco tiempo
                          animation: questionTimeRemaining <= 5 ? 'pulse 1s infinite' : 'none',
                          '@keyframes pulse': {
                            '0%': {
                              transform: 'scale(1)',
                            },
                            '50%': {
                              transform: 'scale(1.05)',
                            },
                            '100%': {
                              transform: 'scale(1)',
                            },
                          },
                        }}
                      />
                      <Box
                        sx={{
                          top: 0,
                          left: 0,
                          bottom: 0,
                          right: 0,
                          position: 'absolute',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Typography
                          variant="body2" // Más grande que caption
                          component="div"
                          sx={{
                            fontSize: '14px',
                            fontWeight: 700,
                            color:
                              questionTimeRemaining <= 5
                                ? '#ef4444'
                                : getDifficultyColor(activeQuestion.difficulty),
                          }}
                        >
                          {questionTimeRemaining}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography
                      variant="body2"
                      sx={{
                        color:
                          questionTimeRemaining <= 5 ? '#ef4444' : '#64748b',
                        fontWeight: 600,
                      }}
                    >
                      segundos
                    </Typography>
                  </Stack>
                </Stack>

                {/* 🎯 [MEJORADO] Question Text con mejor tipografía */}
                <Typography
                  variant="h5" // Más grande que h6
                  sx={{
                    fontWeight: 700,
                    color: '#1e293b',
                    mb: 2,
                    lineHeight: 1.3, // Mejor legibilidad
                    textAlign: 'center', // Centrado como en Figma
                  }}
                >
                  {activeQuestion.question}
                </Typography>

                {/* 🎯 [MEJORADO] Reward Info con mejor diseño visual */}
                {activeQuestion.reward && (
                  <Stack direction="row" spacing={2} justifyContent="center" mb={3}>
                    <Chip
                      icon={<DiamondIcon />}
                      label={`+${activeQuestion.reward.merits} Mëritos`}
                      sx={{
                        backgroundColor: '#fbbf24', // Color más vibrante
                        color: 'white',
                        fontWeight: 700,
                        fontSize: '13px',
                        height: 32,
                        '& .MuiChip-icon': {
                          color: 'white',
                        },
                      }}
                    />
                    <Chip
                      icon={<BoltIcon />}
                      label={`+${activeQuestion.reward.ondas} Öndas`}
                      sx={{
                        backgroundColor: '#10b981', // Color más vibrante
                        color: 'white',
                        fontWeight: 700,
                        fontSize: '13px',
                        height: 32,
                        '& .MuiChip-icon': {
                          color: 'white',
                        },
                      }}
                    />
                  </Stack>
                )}
              </Box>

              {/* 🎯 [MEJORADO] Answer Options con diseño A/B centrado según Figma */}
              <Stack spacing={3}> {/* Más espaciado entre opciones */}
                {activeQuestion.options.map((option) => (
                  <Button
                    key={option.id}
                    variant={
                      selectedAnswer === option.id ? 'contained' : 'outlined'
                    }
                    onClick={() => handleAnswerSelect(option.id)}
                    disabled={!!selectedAnswer}
                    sx={{
                      p: 3, // Más padding
                      justifyContent: 'flex-start',
                      textAlign: 'left',
                      borderRadius: 3, // Más redondeado según Figma
                      textTransform: 'none',
                      fontSize: '16px',
                      fontWeight: 600,
                      minHeight: 72, // Más altura para mejor presencia
                      border:
                        selectedAnswer === option.id
                          ? 'none'
                          : `3px solid ${getDifficultyColor(activeQuestion.difficulty)}20`, // Borde sutil
                      backgroundColor:
                        selectedAnswer === option.id
                          ? getDifficultyColor(activeQuestion.difficulty)
                          : 'rgba(255,255,255,0.9)',
                      color: selectedAnswer === option.id ? 'white' : '#1e293b',
                      boxShadow: selectedAnswer === option.id 
                        ? `0 8px 24px ${getDifficultyColor(activeQuestion.difficulty)}40`
                        : '0 2px 8px rgba(0,0,0,0.1)',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', // Transición suave
                      '&:hover': {
                        backgroundColor:
                          selectedAnswer === option.id
                            ? getDifficultyColor(activeQuestion.difficulty)
                            : `${getDifficultyColor(activeQuestion.difficulty)}10`,
                        borderColor: getDifficultyColor(
                          activeQuestion.difficulty
                        ),
                        transform: 'translateY(-2px)', // Efecto hover elevado
                        boxShadow: `0 12px 32px ${getDifficultyColor(activeQuestion.difficulty)}30`,
                      },
                      '&:disabled': {
                        backgroundColor:
                          selectedAnswer === option.id
                            ? getDifficultyColor(activeQuestion.difficulty)
                            : 'rgba(255,255,255,0.7)',
                        color:
                          selectedAnswer === option.id ? 'white' : '#64748b',
                      },
                    }}
                  >
                    <Stack
                      direction="row"
                      spacing={3} // Más espaciado
                      alignItems="center"
                      width="100%"
                    >
                      <Avatar
                        sx={{
                          width: 40, // Más grande
                          height: 40,
                          backgroundColor:
                            selectedAnswer === option.id
                              ? 'rgba(255,255,255,0.25)'
                              : getDifficultyColor(activeQuestion.difficulty),
                          color: 'white',
                          fontWeight: 700,
                          fontSize: '16px',
                          border: selectedAnswer === option.id 
                            ? '2px solid rgba(255,255,255,0.5)'
                            : 'none',
                        }}
                      >
                        {option.label}
                      </Avatar>
                      <Typography
                        sx={{
                          flex: 1,
                          lineHeight: 1.4,
                          fontSize: '16px',
                        }}
                      >
                        {option.text}
                      </Typography>
                    </Stack>
                  </Button>
                ))}
              </Stack>

              {/* 🎯 [MEJORADO] Skip Button con mejor posicionamiento */}
              <Box sx={{ textAlign: 'center', mt: 3 }}>
                <Button
                  variant="text"
                  onClick={handleSkipQuestion}
                  disabled={!!selectedAnswer}
                  sx={{
                    color: '#64748b',
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: '14px',
                    '&:hover': {
                      backgroundColor: 'rgba(100, 116, 139, 0.1)',
                    },
                  }}
                >
                  Saltar pregunta (perderás la racha)
                </Button>
              </Box>
              </Stack>
            </CosmicCardAire>
          )}
        </DialogContent>
      </Dialog>

      {/* Enhanced Answer Feedback */}
      <Snackbar
        open={answerFeedback.isVisible}
        autoHideDuration={3000}
        onClose={() =>
          setAnswerFeedback({ ...answerFeedback, isVisible: false })
        }
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity={answerFeedback.isCorrect ? 'success' : 'error'}
          sx={{
            width: '100%',
            maxWidth: 500,
            backgroundColor: answerFeedback.isCorrect ? '#dcfce7' : '#fecaca',
            color: answerFeedback.isCorrect ? '#166534' : '#dc2626',
            fontWeight: 600,
            '& .MuiAlert-icon': {
              color: answerFeedback.isCorrect ? '#10b981' : '#ef4444',
            },
          }}
          action={
            answerFeedback.reward && (
              <Stack direction="row" spacing={1}>
                <Chip
                  icon={<DiamondIcon />}
                  label={`+${answerFeedback.reward.merits}`}
                  size="small"
                  sx={{
                    backgroundColor: '#fef3c7',
                    color: '#92400e',
                    fontWeight: 600,
                  }}
                />
                <Chip
                  icon={<BoltIcon />}
                  label={`+${answerFeedback.reward.ondas}`}
                  size="small"
                  sx={{
                    backgroundColor: '#dcfce7',
                    color: '#166534',
                    fontWeight: 600,
                  }}
                />
              </Stack>
            )
          }
        >
          {answerFeedback.message}
        </Alert>
      </Snackbar>

      {/* Enhanced Video Controls */}
      <Fade in={showControls && !activeQuestion}>
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            background:
              'linear-gradient(0deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.6) 70%, transparent 100%)',
            zIndex: 20,
            p: 2,
          }}
        >
          <Stack spacing={2}>
            {/* Progress Bar */}
            <Box sx={{ px: 1 }}>
              <Slider
                value={currentTime}
                max={duration}
                onChange={(_, value) => handleSeek(value as number)}
                sx={{
                  color: '#6366f1',
                  height: 6,
                  '& .MuiSlider-thumb': {
                    width: 16,
                    height: 16,
                    backgroundColor: 'white',
                    border: '2px solid #6366f1',
                    '&:hover': {
                      boxShadow: '0 0 0 8px rgba(99, 102, 241, 0.16)',
                    },
                  },
                  '& .MuiSlider-track': {
                    backgroundColor: '#6366f1',
                    border: 'none',
                  },
                  '& .MuiSlider-rail': {
                    backgroundColor: 'rgba(255, 255, 255, 0.3)',
                  },
                }}
              />
              <Box
                sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}
              >
                <Typography
                  variant="caption"
                  sx={{ color: 'white', fontWeight: 600 }}
                >
                  {formatTime(currentTime)}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: 'white', fontWeight: 600 }}
                >
                  {formatTime(duration)}
                </Typography>
              </Box>
            </Box>

            {/* Control Buttons */}
            <Stack direction="row" alignItems="center" spacing={2}>
              {/* Play/Pause */}
              <IconButton
                onClick={togglePlayPause}
                sx={{
                  color: 'white',
                  backgroundColor: 'rgba(99, 102, 241, 0.9)',
                  '&:hover': { backgroundColor: 'rgba(99, 102, 241, 1)' },
                  width: 48,
                  height: 48,
                }}
              >
                {isPlaying ? <PauseIcon /> : <PlayIcon />}
              </IconButton>

              {/* Volume Control */}
              <Stack direction="row" alignItems="center" spacing={1}>
                <IconButton onClick={toggleMute} sx={{ color: 'white' }}>
                  {isMuted || volume === 0 ? <VolumeOffIcon /> : <VolumeIcon />}
                </IconButton>
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
              </Stack>

              {/* Playback Speed */}
              <ButtonGroup variant="outlined" size="small">
                {[0.5, 1, 1.25, 1.5, 2].map((speed) => (
                  <Button
                    key={speed}
                    onClick={() => changePlaybackSpeed(speed)}
                    variant={playbackSpeed === speed ? 'contained' : 'outlined'}
                    sx={{
                      color: 'white',
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                      backgroundColor:
                        playbackSpeed === speed
                          ? 'rgba(99, 102, 241, 0.9)'
                          : 'transparent',
                      '&:hover': {
                        backgroundColor: 'rgba(99, 102, 241, 0.7)',
                        borderColor: 'rgba(255, 255, 255, 0.5)',
                      },
                      minWidth: 40,
                      fontSize: '12px',
                    }}
                  >
                    {speed}x
                  </Button>
                ))}
              </ButtonGroup>

              <Box sx={{ flex: 1 }} />

              {/* Metrics Display */}
              <Stack direction="row" spacing={1} alignItems="center">
                <Chip
                  icon={<DiamondIcon />}
                  label={(metrics.merits || 0).toLocaleString()}
                  size="small"
                  sx={{
                    backgroundColor: 'rgba(245, 158, 11, 0.9)',
                    color: 'white',
                    fontWeight: 600,
                  }}
                />
                <Chip
                  icon={<BoltIcon />}
                  label={metrics.ondas}
                  size="small"
                  sx={{
                    backgroundColor: 'rgba(16, 185, 129, 0.9)',
                    color: 'white',
                    fontWeight: 600,
                  }}
                />
                <Chip
                  icon={<StarIcon />}
                  label={`Nv ${metrics.level}`}
                  size="small"
                  sx={{
                    backgroundColor: 'rgba(139, 92, 246, 0.9)',
                    color: 'white',
                    fontWeight: 600,
                  }}
                />
              </Stack>
            </Stack>
          </Stack>
        </Box>
      </Fade>

      {/* Questions List Sidebar */}
      <Collapse in={showQuestionsList} orientation="horizontal">
        <Paper
          sx={{
            position: 'absolute',
            top: 80,
            right: 16,
            width: 320,
            maxHeight: 400,
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: 2,
            overflow: 'auto',
            zIndex: 30,
          }}
        >
          <Box sx={{ p: 2 }}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              mb={2}
            >
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Preguntas ({totalQuestions})
              </Typography>
              <IconButton
                size="small"
                onClick={() => setShowQuestionsList(false)}
              >
                <CloseIcon />
              </IconButton>
            </Stack>

            <LinearProgress
              variant="determinate"
              value={questionProgress}
              sx={{
                mb: 2,
                height: 8,
                borderRadius: 4,
                backgroundColor: '#e2e8f0',
                '& .MuiLinearProgress-bar': {
                  borderRadius: 4,
                  background:
                    'linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%)',
                },
              }}
            />

            <Stack spacing={1}>
              {questionsData.map((question, index) => (
                <Card
                  key={question.id}
                  sx={{
                    cursor: 'pointer',
                    border: answeredQuestions.has(question.id)
                      ? '2px solid #10b981'
                      : '2px solid #e2e8f0',
                    backgroundColor: answeredQuestions.has(question.id)
                      ? '#f0fdf4'
                      : 'white',
                    '&:hover': {
                      borderColor: '#6366f1',
                    },
                  }}
                  onClick={() => handleSeek(question.timestamp)}
                >
                  <CardContent sx={{ p: 2 }}>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          backgroundColor: answeredQuestions.has(question.id)
                            ? '#10b981'
                            : getDifficultyColor(question.difficulty),
                          color: 'white',
                          fontWeight: 700,
                          fontSize: '12px',
                        }}
                      >
                        {answeredQuestions.has(question.id) ? '✓' : index + 1}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 600,
                            mb: 0.5,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}
                        >
                          {question.question}
                        </Typography>
                        <Stack direction="row" spacing={1}>
                          <Chip
                            label={`${formatTime(question.timestamp)}`}
                            size="small"
                            variant="outlined"
                            sx={{ fontSize: '10px' }}
                          />
                          <Chip
                            label={
                              question.difficulty?.toUpperCase() || 'MEDIUM'
                            }
                            size="small"
                            sx={{
                              backgroundColor: getDifficultyColor(
                                question.difficulty
                              ),
                              color: 'white',
                              fontSize: '10px',
                            }}
                          />
                        </Stack>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          </Box>
        </Paper>
      </Collapse>

      {/* Video Info Sidebar */}
      <Collapse in={showVideoInfo} orientation="horizontal">
        <Paper
          sx={{
            position: 'absolute',
            top: 80,
            right: 16,
            width: 320,
            maxHeight: 400,
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: 2,
            overflow: 'auto',
            zIndex: 30,
          }}
        >
          <Box sx={{ p: 3 }}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              mb={2}
            >
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Información del Video
              </Typography>
              <IconButton size="small" onClick={() => setShowVideoInfo(false)}>
                <CloseIcon />
              </IconButton>
            </Stack>

            <Stack spacing={3}>
              {/* Video Details */}
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                  Descripción
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: '#64748b', lineHeight: 1.6 }}
                >
                  {videoData.description}
                </Typography>
              </Box>

              <Divider />

              {/* Player Metrics */}
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>
                  Estadísticas de Sesión
                </Typography>
                <Grid container spacing={2}>
                  <Grid size={6}>
                    <Stack alignItems="center">
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 700, color: '#6366f1' }}
                      >
                        {metrics.currentStreak}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ textAlign: 'center' }}
                      >
                        Racha Actual
                      </Typography>
                    </Stack>
                  </Grid>
                  <Grid size={6}>
                    <Stack alignItems="center">
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 700, color: '#10b981' }}
                      >
                        {Math.round(accuracyRate)}%
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ textAlign: 'center' }}
                      >
                        Precisión
                      </Typography>
                    </Stack>
                  </Grid>
                  <Grid size={6}>
                    <Stack alignItems="center">
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 700, color: '#f59e0b' }}
                      >
                        {metrics.merits}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ textAlign: 'center' }}
                      >
                        Mëritos
                      </Typography>
                    </Stack>
                  </Grid>
                  <Grid size={6}>
                    <Stack alignItems="center">
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 700, color: '#8b5cf6' }}
                      >
                        {metrics.ondas}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ textAlign: 'center' }}
                      >
                        Öndas
                      </Typography>
                    </Stack>
                  </Grid>
                </Grid>
              </Box>

              <Divider />

              {/* Level Progress */}
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                  Progreso al Nivel {metrics.level + 1}
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={(progressToNextLevel / experienceForNextLevel) * 100}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: '#e2e8f0',
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 4,
                      background:
                        'linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%)',
                    },
                  }}
                />
                <Typography
                  variant="caption"
                  sx={{ color: '#64748b', mt: 1, display: 'block' }}
                >
                  {progressToNextLevel} / {experienceForNextLevel} XP
                </Typography>
              </Box>
            </Stack>
          </Box>
        </Paper>
      </Collapse>
    </Box>
  );
};

// 🎯 [NUEVO] Componente wrapper con validación y manejo de estados
const EnhancedInteractiveVideoPlayer: React.FC<
  EnhancedInteractiveVideoPlayerProps
> = (props) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Validación inicial del videoData
  if (!props.videoData || !props.videoData.id || !props.videoData.url) {
    console.warn('❌ EnhancedInteractiveVideoPlayer: videoData is invalid:', props.videoData);
    return (
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: isMobile ? '100vh' : '80vh',
          backgroundColor: '#000',
          borderRadius: isMobile ? 0 : 3,
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Stack alignItems="center" spacing={2}>
          <Typography color="white" variant="h6">
            Error: Datos de video inválidos
          </Typography>
          <Typography color="white" variant="body2">
            No se pueden cargar los datos del video
          </Typography>
          {props.onBack && (
            <Button
              variant="contained"
              onClick={props.onBack}
              sx={{
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5a56eb 0%, #7c3aed 100%)',
                },
              }}
            >
              Volver
            </Button>
          )}
        </Stack>
      </Box>
    );
  }

  // Si la validación pasa, renderizar el componente principal
  return <VideoPlayerContent {...props} />;
};

export default EnhancedInteractiveVideoPlayer;
