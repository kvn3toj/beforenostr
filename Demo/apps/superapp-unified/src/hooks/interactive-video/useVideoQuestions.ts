import { useCallback, Dispatch, SetStateAction } from 'react';
import { QuestionOverlay, VideoPlayerMetrics, VideoAnalytics } from './useVideoCore';

// ✅ FUNCIONES DE PREGUNTAS CON DEPENDENCIAS CONTROLADAS
export const useVideoQuestions = (
  questionsData: QuestionOverlay[],
  metrics: VideoPlayerMetrics,
  setMetrics: Dispatch<SetStateAction<VideoPlayerMetrics>>,
  setAnalytics: Dispatch<SetStateAction<VideoAnalytics>>,
  calculateLevel: (experience: number) => number,
  calculateReward: (
    question: QuestionOverlay,
    isCorrect: boolean,
    timeTaken: number,
    currentStreak: number
  ) => { merits: number; ondas: number },
  onLevelUp?: (newLevel: number) => void,
  onAchievementUnlocked?: (achievement: string) => void,
  onRewardEarned?: (reward: { merits: number; ondas: number }) => void
) => {
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
      setMetrics,
      setAnalytics,
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
    },
    [setMetrics, setAnalytics]
  );

  return {
    handleQuestionAnswer,
    handleQuestionSkip,
  };
}; 