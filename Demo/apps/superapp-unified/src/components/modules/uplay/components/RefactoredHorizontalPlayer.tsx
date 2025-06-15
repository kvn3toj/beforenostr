import React, { useRef, useEffect, useCallback, useState } from 'react';
import {
  Box,
  Typography,
  Container,
  useTheme,
  useMediaQuery,
  Fade,
  IconButton,
} from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

// Import specialized hooks
import { useVideoPlayer } from '../../../../hooks/interactive-video/useVideoPlayer';
import { useQuestionSystem, type Question } from '../../../../hooks/interactive-video/useQuestionSystem';
import { useGamificationMetrics } from '../../../../hooks/interactive-video/useGamificationMetrics';

// Import UI components
import { QuestionOverlay } from './QuestionOverlay';
import { RewardFeedback } from './RewardFeedback';
import { PlayerMetrics } from './PlayerMetrics';
import { PlayerControls } from './PlayerControls';

// Mock data (will be replaced with real data in Phase 4)
const mockVideoData = {
  id: 'horizontal-demo-refactored',
  title: 'Demo del Reproductor Horizontal ÜPlay Refactorizado',
  description: 'Experiencia gamificada mejorada con arquitectura modular',
  url: '/assets/backup/vid1.mp4',
  duration: 180, // 3 minutes
  meritos: 25,
  nivel: 'Principiante',
  questions: [
    {
      id: 1,
      timestamp: 15,
      endTimestamp: 45,
      type: 'binary-choice',
      question: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry?',
      timeLimit: 25,
      difficulty: 'easy' as const,
      options: [
        {
          id: 'a',
          label: 'A',
          text: 'It is a long established fact that a reader will be distracted',
        },
        {
          id: 'b',
          label: 'B',
          text: 'It is a long established fact that a reader',
        },
      ],
      correctAnswer: 'a',
      reward: { meritos: 15, ondas: 5 },
    },
    {
      id: 2,
      timestamp: 60,
      endTimestamp: 90,
      type: 'multiple-choice',
      question: '¿Te gusta la nueva experiencia del reproductor horizontal refactorizado de ÜPlay?',
      timeLimit: 30,
      difficulty: 'medium' as const,
      options: [
        {
          id: 'a',
          label: 'A',
          text: 'Sí, es increíble cómo la arquitectura modular mejora la experiencia',
        },
        {
          id: 'b',
          label: 'B',
          text: 'Prefiero el reproductor monolítico anterior',
        },
      ],
      correctAnswer: 'a',
      reward: { meritos: 20, ondas: 8 },
    },
  ] as Question[],
};

interface RefactoredHorizontalPlayerProps {
  videoData?: typeof mockVideoData;
  onBack?: () => void;
  className?: string;
}

export const RefactoredHorizontalPlayer: React.FC<RefactoredHorizontalPlayerProps> = ({
  videoData = mockVideoData,
  onBack,
  className,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Local state for UI feedback
  const [showRewardFeedback, setShowRewardFeedback] = useState<{
    show: boolean;
    isCorrect: boolean;
    reward?: { meritos: number; ondas: number };
    achievement?: any;
  }>({ show: false, isCorrect: false });

  // Initialize gamification metrics
  const {
    metrics,
    updateMetricsFromAnswer,
    updateWatchTime,
    resetStreak,
    calculateReward,
  } = useGamificationMetrics({
    initialMetrics: {
      meritos: 6,
      ondas: 12,
      level: 1,
    },
    onAchievementUnlocked: (achievement) => {
      console.log('🏆 Achievement unlocked:', achievement);
      setShowRewardFeedback(prev => ({
        ...prev,
        achievement,
      }));
    },
  });

  // Initialize question system
  const {
    activeQuestion,
    selectedAnswer,
    questionTimeRemaining,
    isQuestionTimerActive,
    checkForQuestions,
    selectAnswer,
    submitAnswer,
    skipQuestion,
    resetQuestionState,
  } = useQuestionSystem({
    questions: videoData.questions,
    onQuestionStart: (question) => {
      console.log('🎯 Question started:', question.id);
    },
    onQuestionEnd: (question, wasAnswered) => {
      console.log('🏁 Question ended:', question.id, 'answered:', wasAnswered);
      if (!wasAnswered) {
        resetStreak();
      }
    },
    onAnswerSubmit: (question, answer, isCorrect, responseTime) => {
      console.log('✅ Answer submitted:', { question: question.id, answer, isCorrect, responseTime });
      
      // Update gamification metrics
      updateMetricsFromAnswer(question, isCorrect, responseTime);
      
      // Calculate and show reward
      const reward = calculateReward(question, isCorrect, responseTime);
      setShowRewardFeedback({
        show: true,
        isCorrect,
        reward: {
          meritos: reward.meritos,
          ondas: reward.ondas,
        },
        achievement: reward.achievementUnlocked,
      });

      // Hide feedback after 3 seconds and reset question state
      setTimeout(() => {
        setShowRewardFeedback({ show: false, isCorrect: false });
        resetQuestionState();
      }, 3000);
    },
  });

  // Initialize video player
  const {
    isPlaying,
    currentTime,
    volume,
    isMuted,
    showControls,
    isLoading,
    error,
    videoRef,
    play,
    pause,
    togglePlayPause,
    setVolume,
    toggleMute,
    seek,
    seekRelative,
    showControlsTemporarily,
    formatTime,
    handleVideoLoadStart,
    handleVideoCanPlay,
    handleVideoError,
  } = useVideoPlayer({
    videoData,
    onTimeUpdate: (time) => {
      // Check for questions at current time
      checkForQuestions(time);
      
      // Update watch time metrics
      updateWatchTime(1);
    },
    onVideoEnd: () => {
      console.log('🎬 Video ended');
      // Could trigger completion achievements here
    },
    onError: (errorMessage) => {
      console.error('🚨 Video error:', errorMessage);
    },
  });

  // Keyboard navigation handler
  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    // Don't handle keyboard events if there's an active question
    if (activeQuestion) {
      switch (event.key) {
        case 'Escape':
          event.preventDefault();
          skipQuestion();
          break;
        case '1':
        case '2':
        case '3':
        case '4':
          event.preventDefault();
          const optionIndex = parseInt(event.key) - 1;
          if (activeQuestion.options[optionIndex]) {
            selectAnswer(activeQuestion.options[optionIndex].id);
          }
          break;
        case 'Enter':
          if (selectedAnswer) {
            event.preventDefault();
            submitAnswer();
          }
          break;
      }
      return;
    }

    // Video control keyboard shortcuts
    switch (event.key) {
      case ' ':
      case 'k':
        event.preventDefault();
        togglePlayPause();
        break;
      case 'ArrowLeft':
        event.preventDefault();
        seekRelative(-10);
        break;
      case 'ArrowRight':
        event.preventDefault();
        seekRelative(10);
        break;
      case 'ArrowUp':
        event.preventDefault();
        setVolume(Math.min(1, volume + 0.1));
        break;
      case 'ArrowDown':
        event.preventDefault();
        setVolume(Math.max(0, volume - 0.1));
        break;
      case 'm':
        event.preventDefault();
        toggleMute();
        break;
    }
  }, [
    activeQuestion,
    selectedAnswer,
    skipQuestion,
    selectAnswer,
    submitAnswer,
    togglePlayPause,
    seekRelative,
    setVolume,
    volume,
    toggleMute,
  ]);

  // Mouse/touch handlers for controls visibility
  const handleMouseMove = useCallback(() => {
    if (!activeQuestion) {
      showControlsTemporarily();
    }
  }, [activeQuestion, showControlsTemporarily]);

  const handleTouchStart = useCallback(() => {
    if (!activeQuestion) {
      showControlsTemporarily();
    }
  }, [activeQuestion, showControlsTemporarily]);

  // Setup keyboard event listeners
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('keydown', handleKeyPress);
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('touchstart', handleTouchStart);

      return () => {
        container.removeEventListener('keydown', handleKeyPress);
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('touchstart', handleTouchStart);
      };
    }
  }, [handleKeyPress, handleMouseMove, handleTouchStart]);

  // Error boundary effect
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error('🚨 Unhandled error in RefactoredHorizontalPlayer:', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error,
      });
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('🚨 Unhandled promise rejection in RefactoredHorizontalPlayer:', event.reason);
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  return (
    <Container
      maxWidth={false}
      disableGutters
      className={className}
      sx={{
        minHeight: '100vh',
        backgroundColor: '#000',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Back Button */}
      {onBack && (
        <IconButton
          onClick={onBack}
          sx={{
            position: 'absolute',
            top: 16,
            left: 16,
            zIndex: 1000,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            color: 'white',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
            },
          }}
          aria-label="Volver"
        >
          <ChevronLeftIcon />
        </IconButton>
      )}

      {/* Main Video Container */}
      <Box
        ref={containerRef}
        tabIndex={0}
        role="application"
        aria-label="Reproductor interactivo ÜPlay refactorizado"
        aria-describedby="player-instructions"
        sx={{
          position: 'relative',
          width: '100%',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          outline: 'none',
        }}
      >
        {/* Screen reader instructions */}
        <div
          id="player-instructions"
          style={{
            position: 'absolute',
            left: '-10000px',
            width: '1px',
            height: '1px',
            overflow: 'hidden',
          }}
        >
          Reproductor de video interactivo refactorizado. Usa espacio para pausar/reproducir,
          flechas para navegar, escape para saltar preguntas, números 1-4 para seleccionar respuestas.
        </div>

        {/* Video Element */}
        <Box
          sx={{
            position: 'relative',
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#000',
          }}
        >
          <video
            ref={videoRef}
            src={videoData.url}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
            }}
            onLoadStart={handleVideoLoadStart}
            onCanPlay={handleVideoCanPlay}
            onError={handleVideoError}
            playsInline
            preload="metadata"
            aria-label={`Video: ${videoData.title}`}
          />

          {/* Loading State */}
          {isLoading && (
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                color: 'white',
                textAlign: 'center',
              }}
            >
              <Typography variant="h6">Cargando video...</Typography>
            </Box>
          )}

          {/* Error State */}
          {error && (
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                color: 'white',
                textAlign: 'center',
                backgroundColor: 'rgba(255, 0, 0, 0.1)',
                padding: 2,
                borderRadius: 1,
              }}
            >
              <Typography variant="h6" color="error">
                Error al cargar el video
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                {error}
              </Typography>
            </Box>
          )}
        </Box>

        {/* Header with Title and Metrics */}
        <Fade in={showControls || activeQuestion !== null}>
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              background: 'linear-gradient(180deg, rgba(0,0,0,0.8) 0%, transparent 100%)',
              padding: { xs: 2, md: 3 },
              paddingTop: onBack ? 8 : 3,
            }}
          >
            <Typography
              variant={isMobile ? 'h5' : 'h4'}
              sx={{
                color: 'white',
                fontWeight: 'bold',
                textAlign: 'center',
                mb: 1,
              }}
            >
              {videoData.title}
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{
                color: 'rgba(255, 255, 255, 0.8)',
                textAlign: 'center',
                mb: 2,
              }}
            >
              GPL - Gamified Play List | Experiencia Inmersiva Refactorizada
            </Typography>

            {/* Player Metrics */}
            <PlayerMetrics
              metrics={metrics}
              compact={isMobile}
              showProgress={true}
            />
          </Box>
        </Fade>

        {/* Question Overlay */}
        {activeQuestion && (
          <QuestionOverlay
            question={activeQuestion}
            selectedAnswer={selectedAnswer}
            timeRemaining={questionTimeRemaining}
            isTimerActive={isQuestionTimerActive}
            onSelectAnswer={selectAnswer}
            onSubmitAnswer={submitAnswer}
            onSkipQuestion={skipQuestion}
            isMobile={isMobile}
          />
        )}

        {/* Reward Feedback */}
        {showRewardFeedback.show && (
          <RewardFeedback
            isCorrect={showRewardFeedback.isCorrect}
            reward={showRewardFeedback.reward}
            achievement={showRewardFeedback.achievement}
            onClose={() => setShowRewardFeedback({ show: false, isCorrect: false })}
          />
        )}

        {/* Player Controls */}
        <Fade in={showControls && !activeQuestion}>
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              background: 'linear-gradient(0deg, rgba(0,0,0,0.8) 0%, transparent 100%)',
              padding: { xs: 2, md: 3 },
            }}
          >
            <PlayerControls
              isPlaying={isPlaying}
              currentTime={currentTime}
              duration={videoData.duration}
              volume={volume}
              isMuted={isMuted}
              onPlayPause={togglePlayPause}
              onSeek={seek}
              onVolumeChange={setVolume}
              onToggleMute={toggleMute}
              formatTime={formatTime}
              compact={isMobile}
            />
          </Box>
        </Fade>

        {/* Live region for screen readers */}
        <div
          role="status"
          aria-live="polite"
          aria-atomic="true"
          style={{
            position: 'absolute',
            left: '-10000px',
            width: '1px',
            height: '1px',
            overflow: 'hidden',
          }}
        >
          {activeQuestion && `Nueva pregunta disponible: ${activeQuestion.question}`}
          {showRewardFeedback.show && showRewardFeedback.isCorrect && 'Respuesta correcta'}
          {showRewardFeedback.show && !showRewardFeedback.isCorrect && 'Respuesta incorrecta'}
        </div>
      </Box>
    </Container>
  );
};

export default RefactoredHorizontalPlayer; 