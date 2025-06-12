import { useState, useCallback, useEffect, useRef } from 'react';
import { apiService } from '../lib/api-service';
import { getVideoQuestions, hasQuestions } from '../lib/videoQuestions';

// Types
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

interface VideoPlayerMetrics {
  merits: number;
  ondas: number;
  level: number;
  experience: number;
  questionsAnswered: number;
  correctAnswers: number;
  currentStreak: number;
  maxStreak: number;
  sessionScore: number;
  engagementLevel: number;
  timeSpent: number;
  videosCompleted: number;
}

interface VideoAnalytics {
  videoId: string;
  userId?: string;
  startTime: Date;
  endTime?: Date;
  totalWatchTime: number;
  questionsAnswered: number;
  correctAnswers: number;
  skipCount: number;
  pauseCount: number;
  seekCount: number;
  completionRate: number;
  engagementScore: number;
}

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
  // State
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

  // Refs for analytics tracking
  const lastUpdateTime = useRef<number>(Date.now());
  const watchTimeSegments = useRef<Array<{ start: number; end: number }>>([]);
  const videoStartTime = useRef<Date>(new Date());

  // Load initial data
  useEffect(() => {
    const loadVideoData = async () => {
      if (!userId) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // Load user metrics (temporalmente deshabilitado para desarrollo)
        // const userMetrics = await apiService.get(`/users/${userId}/metrics`);
        // if (userMetrics) {
        //   setMetrics((prev) => ({
        //     ...prev,
        //     ...userMetrics,
        //   }));
        // }
        
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

        // Load video questions from backend first, fallback to local data (temporalmente deshabilitado)
        // try {
        //   const videoQuestions = await apiService.get(
        //     `/videos/${videoId}/questions`
        //   );
        //   if (
        //     videoQuestions &&
        //     Array.isArray(videoQuestions) &&
        //     videoQuestions.length > 0
        //   ) {
        //     setQuestionsData(videoQuestions);
        //   } else {
        //     // Fallback to local questions if backend doesn't have any
        //     const localQuestions = getVideoQuestions(videoId);
        //     setQuestionsData(localQuestions);
        //     console.log(
        //       `📚 Using local questions for video ${videoId}:`,
        //       localQuestions.length,
        //       'questions'
        //     );
        //   }
        // } catch (backendError) {
          // Use local questions if backend is not available
          const localQuestions = getVideoQuestions(videoId);
          setQuestionsData(localQuestions);
          console.log(
            `📚 Backend not available, using local questions for video ${videoId}:`,
            localQuestions.length,
            'questions'
          );
        // }
      } catch (err: any) {
        console.warn('Failed to load video data:', err.message);
        // Continue with mock data in case of error
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadVideoData();
  }, [videoId, userId]);

  // Calculate experience required for next level
  const getExperienceForLevel = useCallback((level: number): number => {
    return level * 500; // 500 XP per level
  }, []);

  // Calculate current level based on experience
  const calculateLevel = useCallback((experience: number): number => {
    return Math.floor(experience / 500) + 1;
  }, []);

  // Generate dynamic rewards based on performance
  const calculateReward = useCallback(
    (
      question: QuestionOverlay,
      isCorrect: boolean,
      timeTaken: number,
      currentStreak: number
    ) => {
      if (!isCorrect || !question.reward) {
        return { merits: 0, ondas: 0 };
      }

      let multiplier = 1;

      // Time bonus (faster answers get more rewards)
      const timeLimit = question.timeLimit || 20;
      if (timeTaken <= timeLimit * 0.3) {
        multiplier += 0.5; // 50% bonus for very fast answers
      } else if (timeTaken <= timeLimit * 0.6) {
        multiplier += 0.2; // 20% bonus for fast answers
      }

      // Difficulty bonus
      switch (question.difficulty) {
        case 'hard':
          multiplier += 0.5;
          break;
        case 'medium':
          multiplier += 0.2;
          break;
        case 'easy':
        default:
          break;
      }

      // Streak bonus
      if (currentStreak >= 5) {
        multiplier += 0.3; // 30% bonus for 5+ streak
      } else if (currentStreak >= 3) {
        multiplier += 0.15; // 15% bonus for 3+ streak
      }

      return {
        merits: Math.round(question.reward.merits * multiplier),
        ondas: Math.round(question.reward.ondas * multiplier),
      };
    },
    []
  );

  // Handle question answer
  const handleQuestionAnswer = useCallback(
    async (
      questionId: number,
      answerId: string,
      timeTaken: number = 0
    ): Promise<{
      isCorrect: boolean;
      reward: { merits: number; ondas: number };
      feedback: string;
    }> => {
      const question = questionsData.find((q) => q.id === questionId);
      if (!question) {
        return {
          isCorrect: false,
          reward: { merits: 0, ondas: 0 },
          feedback: 'Pregunta no encontrada',
        };
      }

      const selectedOption = question.options.find(
        (opt) => opt.id === answerId
      );
      const isCorrect = selectedOption?.isCorrect || false;

      // Calculate rewards
      const reward = calculateReward(
        question,
        isCorrect,
        timeTaken,
        metrics.currentStreak
      );

      // Update metrics
      setMetrics((prev) => {
        const newCorrectAnswers = isCorrect
          ? prev.correctAnswers + 1
          : prev.correctAnswers;
        const newQuestionsAnswered = prev.questionsAnswered + 1;
        const newStreak = isCorrect ? prev.currentStreak + 1 : 0;
        const newMaxStreak = Math.max(prev.maxStreak, newStreak);
        const newExperience =
          prev.experience + (isCorrect ? 25 : 5) + reward.merits;
        const newLevel = calculateLevel(newExperience);
        const newMerits = prev.merits + reward.merits;
        const newOndas = prev.ondas + reward.ondas;

        // Check for level up
        if (newLevel > prev.level) {
          onLevelUp?.(newLevel);
        }

        // Check for achievements
        if (newStreak === 5) {
          onAchievementUnlocked?.('streak_master');
        }
        if (newCorrectAnswers === 10) {
          onAchievementUnlocked?.('knowledge_seeker');
        }
        if (newOndas >= 100) {
          onAchievementUnlocked?.('energy_collector');
        }

        const updatedMetrics = {
          ...prev,
          merits: newMerits,
          ondas: newOndas,
          level: newLevel,
          experience: newExperience,
          questionsAnswered: newQuestionsAnswered,
          correctAnswers: newCorrectAnswers,
          currentStreak: newStreak,
          maxStreak: newMaxStreak,
          sessionScore: prev.sessionScore + (isCorrect ? 100 : 0),
          engagementLevel: Math.min(
            1,
            newCorrectAnswers / newQuestionsAnswered
          ),
        };

        // Notify about rewards
        if (reward.merits > 0 || reward.ondas > 0) {
          onRewardEarned?.(reward);
        }

        return updatedMetrics;
      });

      // Update analytics
      setAnalytics((prev) => ({
        ...prev,
        questionsAnswered: prev.questionsAnswered + 1,
        correctAnswers: prev.correctAnswers + (isCorrect ? 1 : 0),
        engagementScore: prev.engagementScore + (isCorrect ? 1 : 0),
      }));

      // Send to backend if analytics enabled
      if (enableAnalytics && userId) {
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
        } catch (error) {
          // Gracefully handle missing analytics endpoints during development
          if (error.statusCode === 404) {
            console.info('📊 Question analytics endpoint not yet implemented - this is expected during development');
          } else {
            console.warn('Failed to send question analytics:', error);
          }
        }
      }

      // Generate feedback message
      let feedback = '';
      if (isCorrect) {
        const messages = [
          '¡Excelente! Tu conocimiento sobre CoomÜnity es impresionante.',
          '¡Correcto! Sigues demostrando tu comprensión del Ayni.',
          '¡Muy bien! Tu sabiduría contribuye al Bien Común.',
          '¡Perfecto! Las Öndas positivas fluyen a través de ti.',
        ];
        feedback = messages[Math.floor(Math.random() * messages.length)];
        if (reward.merits > 0) {
          feedback += ` Has ganado ${reward.merits} Mëritos y ${reward.ondas} Öndas.`;
        }
      } else {
        const correctAnswer = question.options.find((opt) => opt.isCorrect);
        feedback = `Incorrecto. La respuesta correcta era: ${correctAnswer?.text}. ¡No te desanimes, cada error es una oportunidad de aprender!`;
      }

      return { isCorrect, reward, feedback };
    },
    [
      questionsData,
      metrics.currentStreak,
      calculateReward,
      calculateLevel,
      onLevelUp,
      onAchievementUnlocked,
      onRewardEarned,
      enableAnalytics,
      userId,
      videoId,
    ]
  );

  // Handle question skip
  const handleQuestionSkip = useCallback(
    async (questionId: number) => {
      setMetrics((prev) => ({
        ...prev,
        currentStreak: 0, // Break streak when skipping
      }));

      setAnalytics((prev) => ({
        ...prev,
        skipCount: prev.skipCount + 1,
      }));

      // Send skip analytics
      if (enableAnalytics && userId) {
        try {
          await apiService.post('/analytics/question-skip', {
            userId,
            videoId,
            questionId,
            timestamp: new Date().toISOString(),
          });
        } catch (error) {
          // Gracefully handle missing analytics endpoints during development
          if (error.statusCode === 404) {
            console.info('📊 Question skip analytics endpoint not yet implemented - this is expected during development');
          } else {
            console.warn('Failed to send skip analytics:', error);
          }
        }
      }
    },
    [enableAnalytics, userId, videoId]
  );

  // Track video interactions
  const trackVideoInteraction = useCallback(
    (interaction: 'play' | 'pause' | 'seek' | 'speed_change', data?: any) => {
      const now = Date.now();

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
  const updateWatchTime = useCallback((currentTime: number) => {
    const now = Date.now();
    const timeDiff = (now - lastUpdateTime.current) / 1000;

    if (timeDiff > 0 && timeDiff < 5) {
      // Only count if reasonable time difference
      setAnalytics((prev) => ({
        ...prev,
        totalWatchTime: prev.totalWatchTime + timeDiff,
      }));

      setMetrics((prev) => ({
        ...prev,
        timeSpent: prev.timeSpent + timeDiff,
      }));
    }

    lastUpdateTime.current = now;
  }, []);

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

      // Send completion analytics
      if (enableAnalytics && userId) {
        try {
          await apiService.post('/analytics/video-completion', {
            userId,
            videoId,
            ...finalAnalytics,
            completionBonus,
            metrics,
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

      // Check for completion achievements
      if (completionRate >= 0.9) {
        onAchievementUnlocked?.('video_completionist');
      }
      if (finalEngagementScore >= 0.8) {
        onAchievementUnlocked?.('engaged_learner');
      }
    },
    [
      analytics,
      metrics,
      enableAnalytics,
      userId,
      videoId,
      onRewardEarned,
      onAchievementUnlocked,
    ]
  );

  // Save progress periodically
  useEffect(() => {
    if (!enableAnalytics || !userId) return;

    const saveInterval = setInterval(async () => {
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
    }, 60000); // Increased interval to 60 seconds to reduce API calls

    return () => clearInterval(saveInterval);
  }, [enableAnalytics, userId, videoId, metrics, analytics]);

  return {
    // State
    metrics,
    analytics,
    questionsData,
    isLoading,
    error,

    // Actions
    handleQuestionAnswer,
    handleQuestionSkip,
    handleVideoComplete,
    trackVideoInteraction,
    updateWatchTime,

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
