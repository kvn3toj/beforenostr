import { useState, useRef, useCallback, useEffect } from 'react';

export interface QuestionOption {
  id: string;
  label: string;
  text: string;
}

export interface Question {
  id: number;
  timestamp: number;
  endTimestamp: number;
  type: string;
  question: string;
  timeLimit: number;
  difficulty: 'easy' | 'medium' | 'hard';
  options: QuestionOption[];
  correctAnswer: string;
  reward: {
    meritos: number;
    ondas: number;
  };
}

interface UseQuestionSystemProps {
  questions: Question[];
  onQuestionStart?: (question: Question) => void;
  onQuestionEnd?: (question: Question, wasAnswered: boolean) => void;
  onAnswerSubmit?: (question: Question, answer: string, isCorrect: boolean, responseTime: number) => void;
}

interface QuestionSystemState {
  activeQuestion: Question | null;
  selectedAnswer: string | null;
  answeredQuestions: Set<number>;
  questionTimeRemaining: number;
  isQuestionTimerActive: boolean;
  questionStartTime: number | null;
}

export const useQuestionSystem = ({
  questions,
  onQuestionStart,
  onQuestionEnd,
  onAnswerSubmit,
}: UseQuestionSystemProps) => {
  // Question state
  const [state, setState] = useState<QuestionSystemState>({
    activeQuestion: null,
    selectedAnswer: null,
    answeredQuestions: new Set(),
    questionTimeRemaining: 0,
    isQuestionTimerActive: false,
    questionStartTime: null,
  });

  // Refs
  const questionTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Clear question timer
  const clearQuestionTimer = useCallback(() => {
    if (questionTimerRef.current) {
      clearInterval(questionTimerRef.current);
      questionTimerRef.current = null;
    }
    setState(prev => ({
      ...prev,
      isQuestionTimerActive: false,
      questionTimeRemaining: 0,
    }));
  }, []);

  // Start question timer
  const startQuestionTimer = useCallback(
    (timeLimit: number) => {
      console.log('⏰ Iniciando timer de pregunta:', timeLimit);
      setState(prev => ({
        ...prev,
        questionTimeRemaining: timeLimit,
        isQuestionTimerActive: true,
        questionStartTime: Date.now(),
      }));

      questionTimerRef.current = setInterval(() => {
        setState(prev => {
          if (prev.questionTimeRemaining <= 1) {
            clearInterval(questionTimerRef.current!);
            questionTimerRef.current = null;
            
            // Auto-skip question when time runs out
            if (prev.activeQuestion) {
              onQuestionEnd?.(prev.activeQuestion, false);
            }
            
            return {
              ...prev,
              isQuestionTimerActive: false,
              questionTimeRemaining: 0,
              activeQuestion: null,
              selectedAnswer: null,
              answeredQuestions: new Set([...prev.answeredQuestions, prev.activeQuestion?.id || 0]),
              questionStartTime: null,
            };
          }
          return {
            ...prev,
            questionTimeRemaining: prev.questionTimeRemaining - 1,
          };
        });
      }, 1000);
    },
    [onQuestionEnd]
  );

  // Check for questions at current time
  const checkForQuestions = useCallback(
    (currentTime: number) => {
      console.log('🔍 Verificando preguntas para tiempo:', currentTime);
      console.log('📋 Preguntas disponibles:', questions.map(q => ({
        id: q.id,
        timestamp: q.timestamp,
        endTimestamp: q.endTimestamp,
      })));
      console.log('✅ Preguntas ya respondidas:', Array.from(state.answeredQuestions));
      console.log('🎯 Pregunta activa actual:', state.activeQuestion?.id);

      const question = questions.find(
        (q) =>
          currentTime >= q.timestamp &&
          currentTime <= q.endTimestamp &&
          !state.answeredQuestions.has(q.id) &&
          !state.activeQuestion
      );

      if (question) {
        console.log('🎯 ¡Pregunta encontrada!:', question);
        setState(prev => ({ ...prev, activeQuestion: question }));
        startQuestionTimer(question.timeLimit);
        onQuestionStart?.(question);
      } else {
        console.log('❌ No hay preguntas para mostrar en este momento');
      }
    },
    [questions, state.answeredQuestions, state.activeQuestion, startQuestionTimer, onQuestionStart]
  );

  // Select answer
  const selectAnswer = useCallback((answerId: string) => {
    setState(prev => ({ ...prev, selectedAnswer: answerId }));
  }, []);

  // Submit answer
  const submitAnswer = useCallback(() => {
    if (!state.activeQuestion || !state.selectedAnswer) return;

    console.log('✅ Enviando respuesta:', state.selectedAnswer, 'para pregunta:', state.activeQuestion.id);
    
    const isCorrect = state.selectedAnswer === state.activeQuestion.correctAnswer;
    const responseTime = state.questionStartTime 
      ? Math.round((Date.now() - state.questionStartTime) / 1000)
      : 0;

    // Clear timer
    clearQuestionTimer();

    // Mark question as answered
    setState(prev => ({
      ...prev,
      answeredQuestions: new Set([...prev.answeredQuestions, prev.activeQuestion!.id]),
    }));

    // Notify parent
    onAnswerSubmit?.(state.activeQuestion, state.selectedAnswer, isCorrect, responseTime);
    onQuestionEnd?.(state.activeQuestion, true);

    // Reset question state after a delay (handled by parent component)
  }, [state.activeQuestion, state.selectedAnswer, state.questionStartTime, clearQuestionTimer, onAnswerSubmit, onQuestionEnd]);

  // Skip question
  const skipQuestion = useCallback(() => {
    if (!state.activeQuestion) return;

    console.log('⏭️ Saltando pregunta:', state.activeQuestion.id);
    
    // Clear timer
    clearQuestionTimer();
    
    // Mark question as answered (skipped)
    setState(prev => ({
      ...prev,
      answeredQuestions: new Set([...prev.answeredQuestions, prev.activeQuestion!.id]),
      activeQuestion: null,
      selectedAnswer: null,
      questionStartTime: null,
    }));

    onQuestionEnd?.(state.activeQuestion, false);
  }, [state.activeQuestion, clearQuestionTimer, onQuestionEnd]);

  // Reset question state (called by parent after feedback)
  const resetQuestionState = useCallback(() => {
    setState(prev => ({
      ...prev,
      activeQuestion: null,
      selectedAnswer: null,
      questionStartTime: null,
    }));
  }, []);

  // Get question statistics
  const getQuestionStats = useCallback(() => {
    const totalQuestions = questions.length;
    const answeredCount = state.answeredQuestions.size;
    const remainingCount = totalQuestions - answeredCount;
    const completionRate = totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0;

    return {
      totalQuestions,
      answeredCount,
      remainingCount,
      completionRate,
    };
  }, [questions.length, state.answeredQuestions.size]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      if (questionTimerRef.current) {
        clearInterval(questionTimerRef.current);
      }
    };
  }, []);

  return {
    // State
    activeQuestion: state.activeQuestion,
    selectedAnswer: state.selectedAnswer,
    answeredQuestions: state.answeredQuestions,
    questionTimeRemaining: state.questionTimeRemaining,
    isQuestionTimerActive: state.isQuestionTimerActive,
    
    // Actions
    checkForQuestions,
    selectAnswer,
    submitAnswer,
    skipQuestion,
    resetQuestionState,
    
    // Utilities
    getQuestionStats,
    
    // Computed values
    hasActiveQuestion: !!state.activeQuestion,
    canSubmitAnswer: !!(state.activeQuestion && state.selectedAnswer),
  };
}; 