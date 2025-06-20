import { useState, useCallback } from 'react';
import type { Question } from './useQuestionSystem';

export interface PlayerMetrics {
  meritos: number;
  ondas: number;
  level: number;
  questionsAnswered: number;
  correctAnswers: number;
  currentStreak: number;
  totalWatchTime: number;
  experiencePoints: number;
}

export interface Reward {
  meritos: number;
  ondas: number;
  experienceGained: number;
  achievementUnlocked?: Achievement;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface UseGamificationMetricsProps {
  initialMetrics?: Partial<PlayerMetrics>;
  onMetricsUpdate?: (metrics: PlayerMetrics) => void;
  onAchievementUnlocked?: (achievement: Achievement) => void;
}

export const useGamificationMetrics = ({
  initialMetrics = {},
  onMetricsUpdate,
  onAchievementUnlocked,
}: UseGamificationMetricsProps = {}) => {
  // Initialize metrics with defaults
  const [metrics, setMetrics] = useState<PlayerMetrics>({
    meritos: 6,
    ondas: 12,
    level: 1,
    questionsAnswered: 0,
    correctAnswers: 0,
    currentStreak: 0,
    totalWatchTime: 0,
    experiencePoints: 0,
    ...initialMetrics,
  });

  // Calculate level based on experience points
  const calculateLevel = useCallback((experiencePoints: number): number => {
    // Level formula: level = floor(sqrt(experiencePoints / 100)) + 1
    return Math.floor(Math.sqrt(experiencePoints / 100)) + 1;
  }, []);

  // Calculate speed bonus for Ayni (reciprocity = efficiency + consciousness)
  const calculateSpeedBonus = useCallback((responseTime: number, timeLimit: number): number => {
    const ratio = responseTime / timeLimit;
    if (ratio <= 0.3) return 1.5; // Very fast response
    if (ratio <= 0.6) return 1.2; // Fast response
    if (ratio <= 0.8) return 1.0; // Normal response
    return 0.8; // Slow but valid response
  }, []);

  // Get difficulty multiplier
  const getDifficultyMultiplier = useCallback((difficulty: string): number => {
    switch (difficulty) {
      case 'easy': return 1.0;
      case 'medium': return 1.3;
      case 'hard': return 1.6;
      default: return 1.0;
    }
  }, []);

  // Get streak multiplier
  const getStreakMultiplier = useCallback((streak: number): number => {
    if (streak >= 10) return 2.0; // Ayni Master
    if (streak >= 5) return 1.5;  // Strong flow
    if (streak >= 3) return 1.2;  // Building momentum
    return 1.0; // Base level
  }, []);

  // Calculate experience points from question
  const calculateExperience = useCallback((question: Question, responseTime: number): number => {
    const baseExp = 10;
    const difficultyBonus = getDifficultyMultiplier(question.difficulty);
    const speedBonus = calculateSpeedBonus(responseTime, question.timeLimit);
    
    return Math.round(baseExp * difficultyBonus * speedBonus);
  }, [getDifficultyMultiplier, calculateSpeedBonus]);

  // Check for achievements
  const checkAchievements = useCallback((newMetrics: PlayerMetrics): Achievement | undefined => {
    // Ayni Master - 10 correct answers in a row
    if (newMetrics.currentStreak === 10 && metrics.currentStreak < 10) {
      return {
        id: 'ayni-master',
        name: 'Maestro del Ayni',
        description: 'Responde 10 preguntas consecutivas correctamente',
        icon: '⚖️',
        rarity: 'epic',
      };
    }

    // Wisdom Seeker - First correct answer
    if (newMetrics.correctAnswers === 1 && metrics.correctAnswers === 0) {
      return {
        id: 'first-correct',
        name: 'Primer Paso',
        description: 'Responde tu primera pregunta correctamente',
        icon: '🌱',
        rarity: 'common',
      };
    }

    // Knowledge Guardian - 50 correct answers
    if (newMetrics.correctAnswers === 50 && metrics.correctAnswers < 50) {
      return {
        id: 'knowledge-guardian',
        name: 'Guardián del Conocimiento',
        description: 'Responde 50 preguntas correctamente',
        icon: '🧘',
        rarity: 'rare',
      };
    }

    // Level Up achievements
    if (newMetrics.level > metrics.level) {
      return {
        id: `level-${newMetrics.level}`,
        name: `Nivel ${newMetrics.level}`,
        description: `Alcanzaste el nivel ${newMetrics.level} en tu viaje de aprendizaje`,
        icon: '⭐',
        rarity: newMetrics.level >= 10 ? 'epic' : newMetrics.level >= 5 ? 'rare' : 'common',
      };
    }

    return undefined;
  }, [metrics]);

  // Calculate reward for a question
  const calculateReward = useCallback((
    question: Question,
    isCorrect: boolean,
    responseTime: number
  ): Reward => {
    if (!isCorrect) {
      return {
        meritos: 0,
        ondas: 0,
        experienceGained: 0,
      };
    }

    const baseReward = question.reward;
    
    // Apply multipliers following Ayni principles
    const speedMultiplier = calculateSpeedBonus(responseTime, question.timeLimit);
    const difficultyMultiplier = getDifficultyMultiplier(question.difficulty);
    const levelMultiplier = 1 + (metrics.level - 1) * 0.1; // 10% bonus per level
    const streakMultiplier = getStreakMultiplier(metrics.currentStreak);

    const finalMeritos = Math.round(
      baseReward.meritos * speedMultiplier * difficultyMultiplier * levelMultiplier
    );
    
    const finalOndas = Math.round(
      baseReward.ondas * streakMultiplier
    );

    const experienceGained = calculateExperience(question, responseTime);

    return {
      meritos: finalMeritos,
      ondas: finalOndas,
      experienceGained,
    };
  }, [metrics.level, metrics.currentStreak, calculateSpeedBonus, getDifficultyMultiplier, getStreakMultiplier, calculateExperience]);

  // Update metrics after answering a question
  const updateMetricsFromAnswer = useCallback((
    question: Question,
    isCorrect: boolean,
    responseTime: number
  ) => {
    const reward = calculateReward(question, isCorrect, responseTime);
    
    setMetrics(prevMetrics => {
      const newMetrics: PlayerMetrics = {
        ...prevMetrics,
        meritos: prevMetrics.meritos + reward.meritos,
        ondas: prevMetrics.ondas + reward.ondas,
        questionsAnswered: prevMetrics.questionsAnswered + 1,
        correctAnswers: isCorrect ? prevMetrics.correctAnswers + 1 : prevMetrics.correctAnswers,
        currentStreak: isCorrect ? prevMetrics.currentStreak + 1 : 0,
        experiencePoints: prevMetrics.experiencePoints + reward.experienceGained,
        level: calculateLevel(prevMetrics.experiencePoints + reward.experienceGained),
      };

      // Check for achievements
      const achievement = checkAchievements(newMetrics);
      if (achievement) {
        onAchievementUnlocked?.(achievement);
      }

      // Notify parent of metrics update
      onMetricsUpdate?.(newMetrics);

      return newMetrics;
    });

    return reward;
  }, [calculateReward, calculateLevel, checkAchievements, onAchievementUnlocked, onMetricsUpdate]);

  // Update watch time
  const updateWatchTime = useCallback((seconds: number) => {
    setMetrics(prev => {
      const newMetrics = {
        ...prev,
        totalWatchTime: prev.totalWatchTime + seconds,
      };
      onMetricsUpdate?.(newMetrics);
      return newMetrics;
    });
  }, [onMetricsUpdate]);

  // Reset streak (when user makes a mistake)
  const resetStreak = useCallback(() => {
    setMetrics(prev => {
      const newMetrics = { ...prev, currentStreak: 0 };
      onMetricsUpdate?.(newMetrics);
      return newMetrics;
    });
  }, [onMetricsUpdate]);

  // Get accuracy rate
  const getAccuracyRate = useCallback((): number => {
    if (metrics.questionsAnswered === 0) return 0;
    return (metrics.correctAnswers / metrics.questionsAnswered) * 100;
  }, [metrics.correctAnswers, metrics.questionsAnswered]);

  // Get progress to next level
  const getProgressToNextLevel = useCallback((): { current: number; required: number; percentage: number } => {
    const currentLevelExp = (metrics.level - 1) ** 2 * 100;
    const nextLevelExp = metrics.level ** 2 * 100;
    const progress = metrics.experiencePoints - currentLevelExp;
    const required = nextLevelExp - currentLevelExp;
    const percentage = (progress / required) * 100;

    return {
      current: progress,
      required,
      percentage: Math.min(100, Math.max(0, percentage)),
    };
  }, [metrics.level, metrics.experiencePoints]);

  return {
    // Current metrics
    metrics,
    
    // Actions
    updateMetricsFromAnswer,
    updateWatchTime,
    resetStreak,
    
    // Utilities
    calculateReward,
    getAccuracyRate,
    getProgressToNextLevel,
    
    // Computed values
    accuracyRate: getAccuracyRate(),
    progressToNextLevel: getProgressToNextLevel(),
  };
}; 