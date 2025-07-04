import { useState, useEffect } from 'react';
import { apiService } from '../lib/api-service';
import { getVideoQuestions } from '../lib/videoQuestions';

// Import specialized modules
import { 
  useVideoCore, 
  QuestionOverlay, 
  VideoPlayerMetrics, 
  VideoAnalytics 
} from './interactive-video/useVideoCore';
import { useVideoAnalytics } from './interactive-video/useVideoAnalytics';
import { useVideoQuestions } from './interactive-video/useVideoQuestions';
import { useVideoCompletion } from './interactive-video/useVideoCompletion';

interface UseInteractiveVideoProps {
  videoId: string;
  userId?: string;
  enableAnalytics?: boolean;
  onRewardEarned?: (reward: { merits: number; ondas: number }) => void;
  onLevelUp?: (newLevel: number) => void;
  onAchievementUnlocked?: (achievement: string) => void;
}

export const useInteractiveVideo = ({
  videoId,
  userId,
  enableAnalytics = true,
  onRewardEarned,
  onLevelUp,
  onAchievementUnlocked,
}: UseInteractiveVideoProps) => {
  // ✅ ESTADO LOCAL SIN DEPENDENCIAS CIRCULARES
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

  const [analytics, setAnalytics] = useState<VideoAnalytics>({
    videoId,
    userId,
    startTime: new Date(),
    totalWatchTime: 0,
    questionsAnswered: 0,
    correctAnswers: 0,
    skipCount: 0,
    pauseCount: 0,
    seekCount: 0,
    completionRate: 0,
    engagementScore: 0,
  });

  const [questionsData, setQuestionsData] = useState<QuestionOverlay[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ USAR MÓDULOS ESPECIALIZADOS (SIN DEPENDENCIAS CIRCULARES)
  const { getExperienceForLevel, calculateLevel, calculateReward } = useVideoCore();
  
  const {
    trackVideoInteraction,
    updateWatchTime,
    sendQuestionAnalytics,
    sendSkipAnalytics,
    sendCompletionAnalytics,
    sendProgressAnalytics,
  } = useVideoAnalytics(enableAnalytics, userId, videoId);

  const { handleQuestionAnswer, handleQuestionSkip } = useVideoQuestions(
    questionsData,
    metrics,
    setMetrics,
    setAnalytics,
    calculateLevel,
    calculateReward,
    onLevelUp,
    onAchievementUnlocked,
    onRewardEarned
  );

  const { 
    handleVideoComplete, 
    updateVideoWatchTime, 
    trackVideoInteractionWithAnalytics 
  } = useVideoCompletion(
    analytics,
    metrics,
    setAnalytics,
    setMetrics,
    updateWatchTime,
    onRewardEarned,
    onAchievementUnlocked
  );

  // ✅ CARGA INICIAL DE DATOS (SIN DEPENDENCIAS CIRCULARES)
  useEffect(() => {
    const loadVideoData = async () => {
      if (!userId) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // Usar métricas mock para desarrollo
        setMetrics((prev) => ({
          ...prev,
          merits: 125,
          ondas: 34,
          level: 4,
          experience: 680,
          questionsAnswered: 12,
          correctAnswers: 9,
          currentStreak: 3,
          maxStreak: 7,
        }));

        // Use local questions if backend is not available
        const localQuestions = getVideoQuestions(videoId);
        setQuestionsData(localQuestions);
        console.log(
          `📚 Using local questions for video ${videoId}:`,
          localQuestions.length,
          'questions'
        );
      } catch (err: any) {
        console.warn('Failed to load video data:', err.message);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadVideoData();
  }, [videoId, userId]);

  // ✅ ENHANCED QUESTION ANSWER WITH ANALYTICS
  const enhancedQuestionAnswer = async (
    questionId: number,
    answerId: string,
    timeTaken: number = 0
  ) => {
    const result = await handleQuestionAnswer(questionId, answerId, timeTaken);
    
    // Send analytics
    await sendQuestionAnalytics(
      questionId,
      answerId,
      result.isCorrect,
      timeTaken,
      result.reward
    );

    return result;
  };

  // ✅ ENHANCED QUESTION SKIP WITH ANALYTICS
  const enhancedQuestionSkip = async (questionId: number) => {
    await handleQuestionSkip(questionId);
    await sendSkipAnalytics(questionId);
  };

  // ✅ ENHANCED VIDEO COMPLETE WITH ANALYTICS
  const enhancedVideoComplete = async (duration: number) => {
    const result = await handleVideoComplete(duration);
    await sendCompletionAnalytics(
      result.finalAnalytics,
      result.completionBonus,
      metrics
    );
    return result;
  };

  // ✅ ENHANCED TRACK INTERACTION
  const enhancedTrackInteraction = (
    interaction: 'play' | 'pause' | 'seek' | 'speed_change',
    data?: any
  ) => {
    trackVideoInteraction(interaction, data);
    trackVideoInteractionWithAnalytics(interaction, data);
  };

  // ✅ SAVE PROGRESS PERIODICALLY WITH CLEANUP
  useEffect(() => {
    if (!enableAnalytics || !userId) return;

    const saveInterval = setInterval(async () => {
      await sendProgressAnalytics(metrics, analytics);
    }, 60000); // 60 seconds interval

    // ✅ CLEANUP EFFECT OBLIGATORIO
    return () => {
      clearInterval(saveInterval);
      console.log('🧹 Interactive video cleanup - progress saving stopped');
    };
  }, [enableAnalytics, userId, metrics, analytics, sendProgressAnalytics]);

  return {
    // State
    metrics,
    analytics,
    questionsData,
    isLoading,
    error,

    // Actions (enhanced with analytics)
    handleQuestionAnswer: enhancedQuestionAnswer,
    handleQuestionSkip: enhancedQuestionSkip,
    handleVideoComplete: enhancedVideoComplete,
    trackVideoInteraction: enhancedTrackInteraction,
    updateWatchTime: updateVideoWatchTime,

    // Utilities
    calculateLevel,
    getExperienceForLevel,
    calculateReward,

    // Progress indicators
    progressToNextLevel:
      metrics.experience % getExperienceForLevel(metrics.level),
    experienceForNextLevel: getExperienceForLevel(metrics.level),
    accuracyRate:
      metrics.questionsAnswered > 0
        ? (metrics.correctAnswers / metrics.questionsAnswered) * 100
        : 0,
  };
};
