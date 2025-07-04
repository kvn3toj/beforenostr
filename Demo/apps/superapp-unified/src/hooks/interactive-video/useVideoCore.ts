import { useCallback } from 'react';

// Types
export interface QuestionOverlay {
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

export interface VideoPlayerMetrics {
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

export interface VideoAnalytics {
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

// ✅ FUNCIONES BÁSICAS SIN DEPENDENCIAS (PRIMER NIVEL)
export const useVideoCore = () => {
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

  return {
    getExperienceForLevel,
    calculateLevel,
    calculateReward,
  };
}; 