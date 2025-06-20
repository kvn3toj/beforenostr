import { useCallback, useEffect, Dispatch, SetStateAction } from 'react';
import { VideoPlayerMetrics, VideoAnalytics } from './useVideoCore';

// ✅ FUNCIONES DE FINALIZACIÓN CON CLEANUP EFFECTS OBLIGATORIOS
export const useVideoCompletion = (
  analytics: VideoAnalytics,
  metrics: VideoPlayerMetrics,
  setAnalytics: Dispatch<SetStateAction<VideoAnalytics>>,
  setMetrics: Dispatch<SetStateAction<VideoPlayerMetrics>>,
  updateWatchTime: () => number,
  onRewardEarned?: (reward: { merits: number; ondas: number }) => void,
  onAchievementUnlocked?: (achievement: string) => void
) => {
  // Handle video completion
  const handleVideoComplete = useCallback(
    async (duration: number) => {
      const completionRate =
        duration > 0 ? analytics.totalWatchTime / duration : 0;
      const finalEngagementScore =
        metrics.questionsAnswered > 0
          ? metrics.correctAnswers / metrics.questionsAnswered
          : 0;

      // Update final analytics
      const finalAnalytics = {
        ...analytics,
        endTime: new Date(),
        completionRate,
        engagementScore: finalEngagementScore,
      };

      setAnalytics(finalAnalytics);

      // Update completion metrics
      setMetrics((prev) => ({
        ...prev,
        videosCompleted: prev.videosCompleted + 1,
      }));

      // Award completion bonus
      const completionBonus = {
        merits: Math.round(20 * completionRate),
        ondas: Math.round(10 * finalEngagementScore),
      };

      if (completionBonus.merits > 0 || completionBonus.ondas > 0) {
        setMetrics((prev) => ({
          ...prev,
          merits: prev.merits + completionBonus.merits,
          ondas: prev.ondas + completionBonus.ondas,
        }));

        onRewardEarned?.(completionBonus);
      }

      // Check for completion achievements
      if (completionRate >= 0.9) {
        onAchievementUnlocked?.('video_completionist');
      }
      if (finalEngagementScore >= 0.8) {
        onAchievementUnlocked?.('engaged_learner');
      }

      return { finalAnalytics, completionBonus };
    },
    [
      analytics,
      metrics,
      setAnalytics,
      setMetrics,
      onRewardEarned,
      onAchievementUnlocked,
    ]
  );

  // Update watch time with analytics
  const updateVideoWatchTime = useCallback(
    (currentTime: number) => {
      const timeDiff = updateWatchTime();

      if (timeDiff > 0) {
        setAnalytics((prev) => ({
          ...prev,
          totalWatchTime: prev.totalWatchTime + timeDiff,
        }));

        setMetrics((prev) => ({
          ...prev,
          timeSpent: prev.timeSpent + timeDiff,
        }));
      }
    },
    [updateWatchTime, setAnalytics, setMetrics]
  );

  // Track video interactions with analytics updates
  const trackVideoInteractionWithAnalytics = useCallback(
    (interaction: 'play' | 'pause' | 'seek' | 'speed_change', data?: any) => {
      switch (interaction) {
        case 'pause':
          setAnalytics((prev) => ({
            ...prev,
            pauseCount: prev.pauseCount + 1,
          }));
          break;

        case 'seek':
          setAnalytics((prev) => ({
            ...prev,
            seekCount: prev.seekCount + 1,
          }));
          break;
      }
    },
    [setAnalytics]
  );

  // ✅ CLEANUP EFFECT OBLIGATORIO
  useEffect(() => {
    return () => {
      // Cleanup any pending operations
      console.log('🧹 Video completion module cleanup');
    };
  }, []);

  return {
    handleVideoComplete,
    updateVideoWatchTime,
    trackVideoInteractionWithAnalytics,
  };
}; 