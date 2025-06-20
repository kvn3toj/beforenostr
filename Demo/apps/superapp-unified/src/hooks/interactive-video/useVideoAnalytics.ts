import { useCallback, useRef } from 'react';
import { apiService } from '../../lib/api-service';
import { VideoAnalytics } from './useVideoCore';

// ✅ FUNCIONES DE ANALYTICS SIN DEPENDENCIAS CIRCULARES
export const useVideoAnalytics = (
  enableAnalytics: boolean,
  userId?: string,
  videoId?: string
) => {
  // Refs for analytics tracking
  const lastUpdateTime = useRef<number>(Date.now());
  const watchTimeSegments = useRef<Array<{ start: number; end: number }>>([]);

  // Track video interactions
  const trackVideoInteraction = useCallback(
    (interaction: 'play' | 'pause' | 'seek' | 'speed_change', data?: any) => {
      const now = Date.now();

      switch (interaction) {
        case 'play':
          // Track watch time segment
          if (data?.currentTime) {
            watchTimeSegments.current.push({
              start: data.currentTime,
              end: data.currentTime,
            });
          }
          break;
      }

      lastUpdateTime.current = now;
    },
    []
  );

  // Update watch time
  const updateWatchTime = useCallback(() => {
    const now = Date.now();
    const timeDiff = (now - lastUpdateTime.current) / 1000;
    lastUpdateTime.current = now;
    
    return timeDiff > 0 && timeDiff < 5 ? timeDiff : 0;
  }, []);

  // Send question answer analytics
  const sendQuestionAnalytics = useCallback(
    async (
      questionId: number,
      answerId: string,
      isCorrect: boolean,
      timeTaken: number,
      reward: { merits: number; ondas: number }
    ) => {
      if (!enableAnalytics || !userId || !videoId) return;

      try {
        await apiService.post('/analytics/question-answer', {
          userId,
          videoId,
          questionId,
          selectedAnswer: answerId,
          isCorrect,
          timeTaken,
          reward,
          timestamp: new Date().toISOString(),
        });
      } catch (error: any) {
        // Gracefully handle missing analytics endpoints during development
        if (error.statusCode === 404) {
          console.info('📊 Question analytics endpoint not yet implemented - this is expected during development');
        } else {
          console.warn('Failed to send question analytics:', error);
        }
      }
    },
    [enableAnalytics, userId, videoId]
  );

  // Send question skip analytics
  const sendSkipAnalytics = useCallback(
    async (questionId: number) => {
      if (!enableAnalytics || !userId || !videoId) return;

      try {
        await apiService.post('/analytics/question-skip', {
          userId,
          videoId,
          questionId,
          timestamp: new Date().toISOString(),
        });
      } catch (error: any) {
        // Gracefully handle missing analytics endpoints during development
        if (error.statusCode === 404) {
          console.info('📊 Question skip analytics endpoint not yet implemented - this is expected during development');
        } else {
          console.warn('Failed to send skip analytics:', error);
        }
      }
    },
    [enableAnalytics, userId, videoId]
  );

  // Send video completion analytics
  const sendCompletionAnalytics = useCallback(
    async (
      finalAnalytics: VideoAnalytics,
      completionBonus: { merits: number; ondas: number },
      metrics: any
    ) => {
      if (!enableAnalytics || !userId || !videoId) return;

      try {
        await apiService.post('/analytics/video-completion', {
          userId,
          videoId,
          ...finalAnalytics,
          completionBonus,
          metrics,
        });
      } catch (error: any) {
        // Gracefully handle missing analytics endpoints during development
        if (error.statusCode === 404) {
          console.info('📊 Video completion analytics endpoint not yet implemented - this is expected during development');
        } else {
          console.warn('Failed to send completion analytics:', error);
        }
      }
    },
    [enableAnalytics, userId, videoId]
  );

  // Send progress analytics
  const sendProgressAnalytics = useCallback(
    async (metrics: any, analytics: VideoAnalytics) => {
      if (!enableAnalytics || !userId || !videoId) return;

      try {
        await apiService.post('/analytics/video-progress', {
          userId,
          videoId,
          metrics,
          analytics,
          timestamp: new Date().toISOString(),
        });
      } catch (error: any) {
        // Gracefully handle missing analytics endpoints during development
        if (error?.statusCode === 404) {
          // Only log once every 5 minutes to reduce spam
          const lastLogKey = `analytics-404-${videoId}`;
          const lastLog = sessionStorage.getItem(lastLogKey);
          const now = Date.now();
          
          if (!lastLog || now - parseInt(lastLog) > 300000) { // 5 minutes
            console.info('📊 Analytics endpoint not yet implemented - this is expected during development');
            sessionStorage.setItem(lastLogKey, now.toString());
          }
        } else {
          console.warn('Failed to save video progress:', error.message || error);
        }
      }
    },
    [enableAnalytics, userId, videoId]
  );

  return {
    trackVideoInteraction,
    updateWatchTime,
    sendQuestionAnalytics,
    sendSkipAnalytics,
    sendCompletionAnalytics,
    sendProgressAnalytics,
    lastUpdateTime,
    watchTimeSegments,
  };
}; 