import React, { useEffect, useCallback, useState } from 'react';
import { Box, Alert, Snackbar } from '@mui/material';
import { RefactoredHorizontalPlayer } from './RefactoredHorizontalPlayer';
import AchievementNotifications from './AchievementNotifications';
import { useVideoAnalytics } from '../../../../hooks/analytics/useVideoAnalytics';
import { useAdvancedAchievements } from '../../../../hooks/gamification/useAdvancedAchievements';
import { useLocalProgress } from '../../../../hooks/data/useLocalProgress';
import { useVideoDetail } from '../../../../hooks/data/useVideoData';
import {
  VideoData,
  PlayerMetrics,
  Achievement,
  EngagementMetrics
} from '../../../../types/video-player.schemas';

// ============================================================================
// TIPOS Y INTERFACES
// ============================================================================

interface EnhancedHorizontalPlayerProps {
  videoId: string;
  userId?: string;
  autoPlay?: boolean;
  enableAnalytics?: boolean;
  enableAchievements?: boolean;
  enableLocalPersistence?: boolean;
  onVideoComplete?: (metrics: PlayerMetrics) => void;
  onAchievementUnlocked?: (achievement: Achievement) => void;
  onError?: (error: Error) => void;
}

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

const EnhancedHorizontalPlayer: React.FC<EnhancedHorizontalPlayerProps> = ({
  videoId,
  userId,
  autoPlay = false,
  enableAnalytics = true,
  enableAchievements = true,
  enableLocalPersistence = true,
  onVideoComplete,
  onAchievementUnlocked,
  onError,
}) => {
  // ============================================================================
  // ESTADO LOCAL
  // ============================================================================

  const [error, setError] = useState<string | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // ============================================================================
  // HOOKS DE DATOS
  // ============================================================================

  // Datos del video desde el backend
  const {
    data: videoData,
    isLoading: videoLoading,
    error: videoError,
    refetch: refetchVideo,
  } = useVideoDetail(videoId, {
    enabled: !!videoId,
  });

  // Persistencia local del progreso
  const {
    data: localProgress,
    isLoading: progressLoading,
    saveProgress,
    clearProgress,
    syncWithServer,
    getVideoProgress,
    updateVideoProgress,
  } = useLocalProgress({
    userId,
    enableAutoSave: true,
    enableSync: true,
    onError: (error) => {
      console.error('Local progress error:', error);
      setError('Error guardando progreso local');
    },
  });

  // ============================================================================
  // HOOKS DE ANALYTICS
  // ============================================================================

  // Analytics de video
  const analytics = useVideoAnalytics({
    videoId,
    userId,
    enableBatching: true,
    enableRealTimeEvents: true,
    onError: (error) => {
      console.error('Analytics error:', error);
      setError('Error en analytics');
    },
    onBatchSent: (batch) => {
      console.log('Analytics batch sent:', batch.events.length, 'events');
    },
  });

  // ============================================================================
  // HOOKS DE GAMIFICACIÓN
  // ============================================================================

  // Sistema de logros avanzado
  const achievements = useAdvancedAchievements({
    userId,
    enableAutoCheck: true,
    enableNotifications: true,
    enableCelebrations: true,
    onAchievementUnlocked: (achievement) => {
      console.log('Achievement unlocked:', achievement.name);
      setShowSuccessMessage(true);
      onAchievementUnlocked?.(achievement);

      // Track achievement unlock
      analytics.trackAchievementUnlocked(achievement.id, achievement.name);
    },
    onLevelUp: (newLevel, rewards) => {
      console.log('Level up!', newLevel, rewards);
      analytics.trackEvent('level_up', { newLevel, rewards });
    },
    onError: (error) => {
      console.error('Achievements error:', error);
      setError('Error en sistema de logros');
    },
  });

  // ============================================================================
  // HANDLERS DE EVENTOS
  // ============================================================================

  const handleVideoStart = useCallback(() => {
    analytics.trackVideoStart();

    // Actualizar progreso de achievements
    achievements.updateProgress({
      videosIniciados: (localProgress?.playerMetrics?.videosIniciados || 0) + 1,
    });
  }, [analytics, achievements, localProgress]);

  const handleVideoComplete = useCallback((metrics: PlayerMetrics) => {
    analytics.trackVideoComplete();

    // Guardar progreso local
    updateVideoProgress(videoId, {
      completed: true,
      completedAt: new Date(),
      finalMetrics: metrics,
    });

    // Actualizar métricas de achievements
    achievements.updateProgress({
      videosCompletados: (localProgress?.playerMetrics?.videosCompletados || 0) + 1,
      tiempoTotalVisto: (localProgress?.playerMetrics?.tiempoTotalVisto || 0) + metrics.tiempoVisto,
    });

    // Sincronizar con servidor
    syncWithServer();

    onVideoComplete?.(metrics);
  }, [analytics, achievements, localProgress, updateVideoProgress, syncWithServer, videoId, onVideoComplete]);

  const handleQuestionAnswered = useCallback((
    questionId: string,
    selectedOption: string,
    isCorrect: boolean,
    timeSpent: number
  ) => {
    analytics.trackQuestionAnswered(questionId, selectedOption, isCorrect, timeSpent);

    // Actualizar métricas de achievements
    const currentCorrect = localProgress?.playerMetrics?.preguntasCorrectas || 0;
    const currentAttempted = localProgress?.playerMetrics?.preguntasRespondidas || 0;

    achievements.updateProgress({
      preguntasRespondidas: currentAttempted + 1,
      preguntasCorrectas: isCorrect ? currentCorrect + 1 : currentCorrect,
    });

    // Calcular recompensas
    if (isCorrect) {
      const baseReward = 10;
      const speedBonus = timeSpent < 5 ? 1.5 : 1.0;
      const finalReward = Math.floor(baseReward * speedBonus);

      analytics.trackRewardEarned('question_correct', finalReward, {
        speedBonus,
        timeSpent,
      });
    }
  }, [analytics, achievements, localProgress]);

  const handleError = useCallback((error: Error) => {
    console.error('Enhanced Player error:', error);
    setError(error.message);
    analytics.trackError('player_error', error.message, {
      videoId,
      userId,
      timestamp: new Date().toISOString(),
    });
    onError?.(error);
  }, [analytics, videoId, userId, onError]);

  // ============================================================================
  // EFECTOS
  // ============================================================================

  // Manejo de errores globales
  useEffect(() => {
    if (videoError) {
      handleError(new Error(`Error loading video: ${videoError.message}`));
    }
  }, [videoError, handleError]);

  // Auto-clear error messages
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Auto-clear success messages
  useEffect(() => {
    if (showSuccessMessage) {
      const timer = setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessMessage]);

  // Inicializar analytics session
  useEffect(() => {
    if (videoId && !analytics.isTracking) {
      analytics.startSession();
    }

    return () => {
      if (analytics.isTracking) {
        analytics.endSession();
      }
    };
  }, [videoId, analytics]);

  // ============================================================================
  // HANDLERS ADICIONALES
  // ============================================================================

  const handleVideoProgress = useCallback((currentTime: number, duration: number) => {
    // Actualizar progreso local cada 10 segundos
    if (Math.floor(currentTime) % 10 === 0) {
      updateVideoProgress(videoId, {
        currentTime,
        duration,
        lastWatched: new Date(),
        progressPercentage: (currentTime / duration) * 100,
      });
    }

    // Actualizar métricas de engagement
    analytics.updateEngagementMetrics({
      watchTime: currentTime,
      completionRate: currentTime / duration,
      engagementRate: analytics.calculateEngagementRate(),
    });
  }, [analytics, updateVideoProgress, videoId]);

  const handleVideoSeek = useCallback((fromTime: number, toTime: number) => {
    analytics.trackVideoSeek(fromTime, toTime);

    // Actualizar contador de seeks en achievements
    achievements.updateProgress({
      totalSeeks: (localProgress?.playerMetrics?.totalSeeks || 0) + 1,
    });
  }, [analytics, achievements, localProgress]);

  const handleVideoPause = useCallback(() => {
    analytics.trackVideoPause();
  }, [analytics]);

  const handleVideoResume = useCallback(() => {
    analytics.trackVideoResume();
  }, [analytics]);

  // ============================================================================
  // RENDER
  // ============================================================================

  // Loading state
  if (videoLoading || progressLoading || achievements.isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: 400,
          backgroundColor: 'background.paper',
          borderRadius: 2,
        }}
      >
        <Box sx={{ textAlign: 'center' }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              border: '4px solid',
              borderColor: 'primary.main',
              borderTopColor: 'transparent',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              mb: 2,
              '@keyframes spin': {
                '0%': { transform: 'rotate(0deg)' },
                '100%': { transform: 'rotate(360deg)' },
              },
            }}
          />
          <Box sx={{ color: 'text.secondary', fontSize: '0.9rem' }}>
            Cargando experiencia ÜPlay...
          </Box>
        </Box>
      </Box>
    );
  }

  // Error state
  if (!videoData && videoError) {
    return (
      <Box
        sx={{
          p: 3,
          textAlign: 'center',
          backgroundColor: 'error.light',
          borderRadius: 2,
          color: 'error.contrastText',
        }}
      >
        <Box sx={{ fontSize: '2rem', mb: 1 }}>⚠️</Box>
        <Box sx={{ fontWeight: 'bold', mb: 1 }}>
          Error cargando video
        </Box>
        <Box sx={{ fontSize: '0.9rem', opacity: 0.8 }}>
          {videoError.message}
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ position: 'relative', width: '100%' }}>
      {/* Player principal */}
      <RefactoredHorizontalPlayer
        videoData={videoData!}
        autoPlay={autoPlay}
        onVideoStart={handleVideoStart}
        onVideoComplete={handleVideoComplete}
        onVideoProgress={handleVideoProgress}
        onVideoSeek={handleVideoSeek}
        onVideoPause={handleVideoPause}
        onVideoResume={handleVideoResume}
        onQuestionAnswered={handleQuestionAnswered}
        onError={handleError}
        // Pasar datos de progreso local si están disponibles
        initialProgress={getVideoProgress(videoId)}
        // Pasar métricas de analytics
        analyticsMetrics={analytics.metrics}
        // Pasar datos de achievements
        achievementProgress={achievements.achievements}
      />

      {/* Notificaciones de logros */}
      {enableAchievements && (
        <AchievementNotifications
          notifications={achievements.activeNotifications}
          onDismiss={achievements.dismissNotification}
          onClearAll={achievements.clearAllNotifications}
          enableAnimations={true}
          enableSounds={true}
          position="top-right"
        />
      )}

      {/* Snackbar para errores */}
      <Snackbar
        open={!!error}
        autoHideDuration={5000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setError(null)}
          severity="error"
          sx={{ width: '100%' }}
        >
          {error}
        </Alert>
      </Snackbar>

      {/* Snackbar para mensajes de éxito */}
      <Snackbar
        open={showSuccessMessage}
        autoHideDuration={3000}
        onClose={() => setShowSuccessMessage(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setShowSuccessMessage(false)}
          severity="success"
          sx={{ width: '100%' }}
        >
          ¡Nuevo logro desbloqueado! 🎉
        </Alert>
      </Snackbar>

      {/* Debug info (solo en desarrollo) */}
      {process.env.NODE_ENV === 'development' && (
        <Box
          sx={{
            position: 'fixed',
            bottom: 16,
            left: 16,
            backgroundColor: 'background.paper',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1,
            p: 1,
            fontSize: '0.75rem',
            fontFamily: 'monospace',
            maxWidth: 300,
            opacity: 0.8,
            zIndex: 1000,
          }}
        >
          <Box sx={{ fontWeight: 'bold', mb: 0.5 }}>Debug Info:</Box>
          <Box>Session: {analytics.sessionId.slice(-8)}</Box>
          <Box>Events: {analytics.pendingEvents}</Box>
          <Box>Achievements: {achievements.unlockedAchievements.length}/{achievements.achievements.length}</Box>
          <Box>Level: {achievements.levelProgress.currentLevel}</Box>
          <Box>XP: {achievements.levelProgress.currentXP}/{achievements.levelProgress.xpForNextLevel}</Box>
        </Box>
      )}
    </Box>
  );
};

export default EnhancedHorizontalPlayer;
