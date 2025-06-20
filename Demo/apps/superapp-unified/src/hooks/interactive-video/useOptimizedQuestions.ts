import { useState, useCallback, useEffect, useMemo } from 'react';
import { useUPlayStore } from '../../stores/uplayStore';

// ============================================================================
// TIPOS E INTERFACES
// ============================================================================

export interface QuestionOption {
  id: string;
  text: string;
  isCorrect: boolean;
  explanation?: string;
  points?: number;
}

export interface InteractiveQuestion {
  id: string;
  videoId: string;
  timestamp: number;
  type: 'multiple-choice' | 'true-false' | 'open-ended' | 'drag-drop';
  title: string;
  question: string;
  options: QuestionOption[];
  timeLimit?: number;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  hints?: string[];
  feedback: {
    correct: string;
    incorrect: string;
    partial?: string;
  };
  rewards: {
    meritos: number;
    ondas: number;
    bonus?: number;
  };
  prerequisites?: string[];
  unlockConditions?: {
    minLevel?: number;
    requiredAchievements?: string[];
  };
}

export interface QuestionAttempt {
  questionId: string;
  selectedOptions: string[];
  isCorrect: boolean;
  timeSpent: number;
  hintsUsed: number;
  timestamp: Date;
  earnedRewards: {
    meritos: number;
    ondas: number;
  };
}

export interface QuestionSession {
  videoId: string;
  questions: InteractiveQuestion[];
  currentQuestionIndex: number;
  attempts: QuestionAttempt[];
  startTime: Date;
  isActive: boolean;
  totalScore: number;
  accuracy: number;
}

// ============================================================================
// HOOK PRINCIPAL
// ============================================================================

export const useOptimizedQuestions = (videoId: string) => {
  // Estado local del hook
  const [currentSession, setCurrentSession] = useState<QuestionSession | null>(null);
  const [isAnswering, setIsAnswering] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [questionStartTime, setQuestionStartTime] = useState<Date | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);

  // Zustand store
  const {
    playerMetrics,
    activeQuestion,
    setActiveQuestion,
    addMeritos,
    addOndas,
    incrementStreak,
    resetStreak,
    updatePlayerMetrics,
    updateVideoProgress,
    showReward,
  } = useUPlayStore();

  // ========================================================================
  // DATOS MOCK DE PREGUNTAS (En producción vendrían del backend)
  // ========================================================================

  // Eliminar mockQuestions y toda la lógica mock
  // Si el archivo no es usado, eliminarlo. Si es usado, migrar a useVideoQuestions.

  // ========================================================================
  // EFECTOS Y TIMERS
  // ========================================================================

  // Timer para preguntas con límite de tiempo
  useEffect(() => {
    if (timeRemaining !== null && timeRemaining > 0 && isAnswering) {
      const timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeRemaining === 0 && isAnswering) {
      // Tiempo agotado
      handleTimeUp();
    }
  }, [timeRemaining, isAnswering]);

  // ========================================================================
  // FUNCIONES PRINCIPALES
  // ========================================================================

  const initializeSession = useCallback(() => {
    const session: QuestionSession = {
      videoId,
      questions: [],
      currentQuestionIndex: 0,
      attempts: [],
      startTime: new Date(),
      isActive: true,
      totalScore: 0,
      accuracy: 0,
    };
    
    setCurrentSession(session);
    return session;
  }, [videoId]);

  const getQuestionAtTimestamp = useCallback((timestamp: number): InteractiveQuestion | null => {
    if (!currentSession) return null;
    
    return currentSession.questions.find(q => 
      Math.abs(q.timestamp - timestamp) <= 2 // Tolerancia de 2 segundos
    ) || null;
  }, [currentSession]);

  const startQuestion = useCallback((question: InteractiveQuestion) => {
    // Verificar prerrequisitos
    if (question.unlockConditions) {
      const { minLevel, requiredAchievements } = question.unlockConditions;
      
      if (minLevel && playerMetrics.level < minLevel) {
        return false;
      }
      
      // Aquí se verificarían los achievements requeridos
    }

    setActiveQuestion(question);
    setIsAnswering(true);
    setShowFeedback(false);
    setSelectedOptions([]);
    setHintsUsed(0);
    setQuestionStartTime(new Date());
    
    if (question.timeLimit) {
      setTimeRemaining(question.timeLimit);
    }
    
    return true;
  }, [playerMetrics.level, setActiveQuestion]);

  const selectOption = useCallback((optionId: string, isMultiple = false) => {
    if (!isAnswering) return;
    
    setSelectedOptions(prev => {
      if (isMultiple) {
        return prev.includes(optionId) 
          ? prev.filter(id => id !== optionId)
          : [...prev, optionId];
      } else {
        return [optionId];
      }
    });
  }, [isAnswering]);

  const useHint = useCallback(() => {
    if (!activeQuestion || hintsUsed >= (activeQuestion.hints?.length || 0)) {
      return null;
    }
    
    const hint = activeQuestion.hints?.[hintsUsed];
    setHintsUsed(prev => prev + 1);
    
    // Penalización por usar pista
    const penalty = Math.floor(activeQuestion.rewards.meritos * 0.1);
    
    return { hint, penalty };
  }, [activeQuestion, hintsUsed]);

  const submitAnswer = useCallback(() => {
    if (!activeQuestion || !questionStartTime || selectedOptions.length === 0) {
      return;
    }

    setIsAnswering(false);
    
    const timeSpent = (new Date().getTime() - questionStartTime.getTime()) / 1000;
    const correctOptions = activeQuestion.options.filter(opt => opt.isCorrect).map(opt => opt.id);
    const isCorrect = selectedOptions.length === correctOptions.length && 
                     selectedOptions.every(id => correctOptions.includes(id));

    // Calcular recompensas
    let earnedMeritos = 0;
    let earnedOndas = 0;

    if (isCorrect) {
      earnedMeritos = activeQuestion.rewards.meritos;
      earnedOndas = activeQuestion.rewards.ondas;
      
      // Bonificaciones
      if (timeRemaining && timeRemaining > activeQuestion.timeLimit! * 0.5) {
        earnedMeritos += activeQuestion.rewards.bonus || 0;
      }
      
      if (hintsUsed === 0) {
        earnedMeritos += Math.floor(earnedMeritos * 0.2); // 20% bonus sin pistas
      }
      
      // Multiplicador por dificultad
      const difficultyMultiplier = {
        easy: 1,
        medium: 1.2,
        hard: 1.5,
      };
      
      earnedMeritos = Math.floor(earnedMeritos * difficultyMultiplier[activeQuestion.difficulty]);
      earnedOndas = Math.floor(earnedOndas * difficultyMultiplier[activeQuestion.difficulty]);
      
      // Actualizar racha
      incrementStreak();
    } else {
      resetStreak();
    }

    // Penalización por pistas usadas
    const hintPenalty = hintsUsed * Math.floor(activeQuestion.rewards.meritos * 0.1);
    earnedMeritos = Math.max(0, earnedMeritos - hintPenalty);

    // Crear intento
    const attempt: QuestionAttempt = {
      questionId: activeQuestion.id,
      selectedOptions,
      isCorrect,
      timeSpent,
      hintsUsed,
      timestamp: new Date(),
      earnedRewards: {
        meritos: earnedMeritos,
        ondas: earnedOndas,
      },
    };

    // Actualizar sesión
    if (currentSession) {
      const updatedSession = {
        ...currentSession,
        attempts: [...currentSession.attempts, attempt],
        totalScore: currentSession.totalScore + earnedMeritos,
      };
      
      updatedSession.accuracy = updatedSession.attempts.length > 0 
        ? (updatedSession.attempts.filter(a => a.isCorrect).length / updatedSession.attempts.length) * 100
        : 0;
      
      setCurrentSession(updatedSession);
    }

    // Actualizar métricas del jugador
    updatePlayerMetrics({
      questionsAnswered: playerMetrics.questionsAnswered + 1,
      correctAnswers: playerMetrics.correctAnswers + (isCorrect ? 1 : 0),
    });

    // Otorgar recompensas
    if (earnedMeritos > 0) {
      addMeritos(earnedMeritos, `respuesta ${isCorrect ? 'correcta' : 'incorrecta'}`);
    }
    
    if (earnedOndas > 0) {
      addOndas(earnedOndas, `pregunta interactiva`);
    }

    // Actualizar progreso del video
    updateVideoProgress(videoId, {
      questionsAnswered: (currentSession?.attempts.length || 0) + 1,
      meritsEarned: earnedMeritos,
      ondasEarned: earnedOndas,
    });

    // Mostrar feedback
    setShowFeedback(true);
    
    // Mostrar recompensa si es correcta
    if (isCorrect && (earnedMeritos > 0 || earnedOndas > 0)) {
      showReward({ meritos: earnedMeritos, ondas: earnedOndas });
    }

    // Auto-cerrar después de 3 segundos
    setTimeout(() => {
      closeQuestion();
    }, 3000);

    return attempt;
  }, [
    activeQuestion,
    questionStartTime,
    selectedOptions,
    timeRemaining,
    hintsUsed,
    currentSession,
    videoId,
    playerMetrics,
    updatePlayerMetrics,
    addMeritos,
    addOndas,
    incrementStreak,
    resetStreak,
    updateVideoProgress,
    showReward,
  ]);

  const handleTimeUp = useCallback(() => {
    if (isAnswering) {
      // Respuesta automática incorrecta por tiempo agotado
      setIsAnswering(false);
      setShowFeedback(true);
      resetStreak();
      
      setTimeout(() => {
        closeQuestion();
      }, 2000);
    }
  }, [isAnswering, resetStreak]);

  const closeQuestion = useCallback(() => {
    setActiveQuestion(null);
    setIsAnswering(false);
    setShowFeedback(false);
    setSelectedOptions([]);
    setHintsUsed(0);
    setQuestionStartTime(null);
    setTimeRemaining(null);
  }, [setActiveQuestion]);

  const skipQuestion = useCallback(() => {
    if (activeQuestion) {
      // Penalización por saltar pregunta
      resetStreak();
      
      // Actualizar métricas
      updatePlayerMetrics({
        questionsAnswered: playerMetrics.questionsAnswered + 1,
      });
      
      closeQuestion();
    }
  }, [activeQuestion, resetStreak, updatePlayerMetrics, playerMetrics.questionsAnswered, closeQuestion]);

  // ========================================================================
  // FUNCIONES DE UTILIDAD
  // ========================================================================

  const getSessionStats = useCallback(() => {
    if (!currentSession) return null;
    
    const { attempts } = currentSession;
    const correctAnswers = attempts.filter(a => a.isCorrect).length;
    const totalQuestions = attempts.length;
    
    return {
      totalQuestions,
      correctAnswers,
      accuracy: totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0,
      totalScore: currentSession.totalScore,
      averageTime: totalQuestions > 0 
        ? attempts.reduce((sum, a) => sum + a.timeSpent, 0) / totalQuestions 
        : 0,
      hintsUsed: attempts.reduce((sum, a) => sum + a.hintsUsed, 0),
    };
  }, [currentSession]);

  const getQuestionFeedback = useCallback(() => {
    if (!activeQuestion || !showFeedback) return null;
    
    const correctOptions = activeQuestion.options.filter(opt => opt.isCorrect);
    const isCorrect = selectedOptions.length === correctOptions.length && 
                     selectedOptions.every(id => correctOptions.includes(id));
    
    return {
      isCorrect,
      message: isCorrect ? activeQuestion.feedback.correct : activeQuestion.feedback.incorrect,
      correctOptions: correctOptions.map(opt => opt.text),
      explanation: correctOptions[0]?.explanation,
    };
  }, [activeQuestion, showFeedback, selectedOptions]);

  // ========================================================================
  // VALORES DE RETORNO
  // ========================================================================

  return {
    // Estado
    currentSession,
    activeQuestion,
    isAnswering,
    showFeedback,
    selectedOptions,
    hintsUsed,
    timeRemaining,
    
    // Funciones principales
    initializeSession,
    getQuestionAtTimestamp,
    startQuestion,
    selectOption,
    useHint,
    submitAnswer,
    skipQuestion,
    closeQuestion,
    
    // Utilidades
    getSessionStats,
    getQuestionFeedback,
    
    // Estado computado
    canSubmit: selectedOptions.length > 0 && isAnswering,
    hasTimeLimit: activeQuestion?.timeLimit !== undefined,
    isTimeRunningOut: timeRemaining !== null && timeRemaining <= 5,
    availableHints: activeQuestion?.hints?.length || 0,
    remainingHints: Math.max(0, (activeQuestion?.hints?.length || 0) - hintsUsed),
  };
}; 