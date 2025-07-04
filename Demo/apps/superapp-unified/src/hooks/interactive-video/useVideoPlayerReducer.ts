import { useReducer, useCallback, useMemo } from 'react';
import type { Question } from './useQuestionSystem';
import type { PlayerMetrics, Achievement } from './useGamificationMetrics';

// State interface for the video player
export interface VideoPlayerState {
  // Video state
  isPlaying: boolean;
  currentTime: number;
  volume: number;
  isMuted: boolean;
  isFullscreen: boolean;
  showControls: boolean;
  isLoading: boolean;
  error: string | null;

  // Question state
  activeQuestion: Question | null;
  selectedAnswer: string | null;
  answeredQuestions: Set<number>;
  questionTimeRemaining: number;
  isQuestionTimerActive: boolean;
  questionStartTime: number | null;

  // Gamification state
  metrics: PlayerMetrics;
  showRewardFeedback: {
    show: boolean;
    isCorrect: boolean;
    reward?: { meritos: number; ondas: number };
    achievement?: Achievement;
  };

  // UI state
  lastInteractionTime: number;
  isUserActive: boolean;
}

// Action types for the reducer
export type VideoPlayerAction =
  // Video actions
  | { type: 'SET_PLAYING'; payload: boolean }
  | { type: 'SET_CURRENT_TIME'; payload: number }
  | { type: 'SET_VOLUME'; payload: number }
  | { type: 'SET_MUTED'; payload: boolean }
  | { type: 'SET_FULLSCREEN'; payload: boolean }
  | { type: 'SET_SHOW_CONTROLS'; payload: boolean }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  
  // Question actions
  | { type: 'SET_ACTIVE_QUESTION'; payload: Question | null }
  | { type: 'SET_SELECTED_ANSWER'; payload: string | null }
  | { type: 'ADD_ANSWERED_QUESTION'; payload: number }
  | { type: 'SET_QUESTION_TIME_REMAINING'; payload: number }
  | { type: 'SET_QUESTION_TIMER_ACTIVE'; payload: boolean }
  | { type: 'SET_QUESTION_START_TIME'; payload: number | null }
  | { type: 'RESET_QUESTION_STATE' }
  
  // Gamification actions
  | { type: 'UPDATE_METRICS'; payload: Partial<PlayerMetrics> }
  | { type: 'SET_REWARD_FEEDBACK'; payload: VideoPlayerState['showRewardFeedback'] }
  | { type: 'HIDE_REWARD_FEEDBACK' }
  
  // UI actions
  | { type: 'UPDATE_INTERACTION_TIME' }
  | { type: 'SET_USER_ACTIVE'; payload: boolean }
  
  // Batch actions for performance
  | { type: 'BATCH_UPDATE'; payload: Partial<VideoPlayerState> }
  | { type: 'RESET_STATE'; payload?: Partial<VideoPlayerState> };

// Initial state factory
const createInitialState = (overrides: Partial<VideoPlayerState> = {}): VideoPlayerState => ({
  // Video state
  isPlaying: false,
  currentTime: 0,
  volume: 0.8,
  isMuted: false,
  isFullscreen: false,
  showControls: true,
  isLoading: false,
  error: null,

  // Question state
  activeQuestion: null,
  selectedAnswer: null,
  answeredQuestions: new Set(),
  questionTimeRemaining: 0,
  isQuestionTimerActive: false,
  questionStartTime: null,

  // Gamification state
  metrics: {
    meritos: 6,
    ondas: 12,
    level: 1,
    questionsAnswered: 0,
    correctAnswers: 0,
    currentStreak: 0,
    totalWatchTime: 0,
    experiencePoints: 0,
  },
  showRewardFeedback: {
    show: false,
    isCorrect: false,
  },

  // UI state
  lastInteractionTime: Date.now(),
  isUserActive: true,

  // Apply overrides
  ...overrides,
});

// Reducer function with performance optimizations
const videoPlayerReducer = (state: VideoPlayerState, action: VideoPlayerAction): VideoPlayerState => {
  switch (action.type) {
    // Video actions
    case 'SET_PLAYING':
      if (state.isPlaying === action.payload) return state; // Prevent unnecessary re-renders
      return { ...state, isPlaying: action.payload };

    case 'SET_CURRENT_TIME':
      if (Math.abs(state.currentTime - action.payload) < 0.1) return state; // Debounce small changes
      return { ...state, currentTime: action.payload };

    case 'SET_VOLUME':
      if (state.volume === action.payload) return state;
      return { 
        ...state, 
        volume: action.payload,
        isMuted: action.payload === 0, // Auto-mute when volume is 0
      };

    case 'SET_MUTED':
      if (state.isMuted === action.payload) return state;
      return { ...state, isMuted: action.payload };

    case 'SET_FULLSCREEN':
      if (state.isFullscreen === action.payload) return state;
      return { ...state, isFullscreen: action.payload };

    case 'SET_SHOW_CONTROLS':
      if (state.showControls === action.payload) return state;
      return { ...state, showControls: action.payload };

    case 'SET_LOADING':
      if (state.isLoading === action.payload) return state;
      return { ...state, isLoading: action.payload };

    case 'SET_ERROR':
      if (state.error === action.payload) return state;
      return { ...state, error: action.payload };

    // Question actions
    case 'SET_ACTIVE_QUESTION':
      if (state.activeQuestion?.id === action.payload?.id) return state;
      return { ...state, activeQuestion: action.payload };

    case 'SET_SELECTED_ANSWER':
      if (state.selectedAnswer === action.payload) return state;
      return { ...state, selectedAnswer: action.payload };

    case 'ADD_ANSWERED_QUESTION':
      if (state.answeredQuestions.has(action.payload)) return state;
      return {
        ...state,
        answeredQuestions: new Set([...state.answeredQuestions, action.payload]),
      };

    case 'SET_QUESTION_TIME_REMAINING':
      if (state.questionTimeRemaining === action.payload) return state;
      return { ...state, questionTimeRemaining: action.payload };

    case 'SET_QUESTION_TIMER_ACTIVE':
      if (state.isQuestionTimerActive === action.payload) return state;
      return { ...state, isQuestionTimerActive: action.payload };

    case 'SET_QUESTION_START_TIME':
      if (state.questionStartTime === action.payload) return state;
      return { ...state, questionStartTime: action.payload };

    case 'RESET_QUESTION_STATE':
      return {
        ...state,
        activeQuestion: null,
        selectedAnswer: null,
        questionTimeRemaining: 0,
        isQuestionTimerActive: false,
        questionStartTime: null,
      };

    // Gamification actions
    case 'UPDATE_METRICS':
      return {
        ...state,
        metrics: { ...state.metrics, ...action.payload },
      };

    case 'SET_REWARD_FEEDBACK':
      return { ...state, showRewardFeedback: action.payload };

    case 'HIDE_REWARD_FEEDBACK':
      return {
        ...state,
        showRewardFeedback: { show: false, isCorrect: false },
      };

    // UI actions
    case 'UPDATE_INTERACTION_TIME':
      return {
        ...state,
        lastInteractionTime: Date.now(),
        isUserActive: true,
      };

    case 'SET_USER_ACTIVE':
      if (state.isUserActive === action.payload) return state;
      return { ...state, isUserActive: action.payload };

    // Batch actions for performance
    case 'BATCH_UPDATE':
      return { ...state, ...action.payload };

    case 'RESET_STATE':
      return createInitialState(action.payload);

    default:
      return state;
  }
};

// Custom hook with optimized state management
export const useVideoPlayerReducer = (initialState?: Partial<VideoPlayerState>) => {
  const [state, dispatch] = useReducer(
    videoPlayerReducer,
    createInitialState(initialState)
  );

  // Memoized action creators to prevent unnecessary re-renders
  const actions = useMemo(() => ({
    // Video actions
    setPlaying: (isPlaying: boolean) => dispatch({ type: 'SET_PLAYING', payload: isPlaying }),
    setCurrentTime: (time: number) => dispatch({ type: 'SET_CURRENT_TIME', payload: time }),
    setVolume: (volume: number) => dispatch({ type: 'SET_VOLUME', payload: volume }),
    setMuted: (isMuted: boolean) => dispatch({ type: 'SET_MUTED', payload: isMuted }),
    setFullscreen: (isFullscreen: boolean) => dispatch({ type: 'SET_FULLSCREEN', payload: isFullscreen }),
    setShowControls: (show: boolean) => dispatch({ type: 'SET_SHOW_CONTROLS', payload: show }),
    setLoading: (isLoading: boolean) => dispatch({ type: 'SET_LOADING', payload: isLoading }),
    setError: (error: string | null) => dispatch({ type: 'SET_ERROR', payload: error }),

    // Question actions
    setActiveQuestion: (question: Question | null) => dispatch({ type: 'SET_ACTIVE_QUESTION', payload: question }),
    setSelectedAnswer: (answer: string | null) => dispatch({ type: 'SET_SELECTED_ANSWER', payload: answer }),
    addAnsweredQuestion: (questionId: number) => dispatch({ type: 'ADD_ANSWERED_QUESTION', payload: questionId }),
    setQuestionTimeRemaining: (time: number) => dispatch({ type: 'SET_QUESTION_TIME_REMAINING', payload: time }),
    setQuestionTimerActive: (active: boolean) => dispatch({ type: 'SET_QUESTION_TIMER_ACTIVE', payload: active }),
    setQuestionStartTime: (time: number | null) => dispatch({ type: 'SET_QUESTION_START_TIME', payload: time }),
    resetQuestionState: () => dispatch({ type: 'RESET_QUESTION_STATE' }),

    // Gamification actions
    updateMetrics: (metrics: Partial<PlayerMetrics>) => dispatch({ type: 'UPDATE_METRICS', payload: metrics }),
    setRewardFeedback: (feedback: VideoPlayerState['showRewardFeedback']) => 
      dispatch({ type: 'SET_REWARD_FEEDBACK', payload: feedback }),
    hideRewardFeedback: () => dispatch({ type: 'HIDE_REWARD_FEEDBACK' }),

    // UI actions
    updateInteractionTime: () => dispatch({ type: 'UPDATE_INTERACTION_TIME' }),
    setUserActive: (active: boolean) => dispatch({ type: 'SET_USER_ACTIVE', payload: active }),

    // Batch actions
    batchUpdate: (updates: Partial<VideoPlayerState>) => dispatch({ type: 'BATCH_UPDATE', payload: updates }),
    resetState: (newState?: Partial<VideoPlayerState>) => dispatch({ type: 'RESET_STATE', payload: newState }),
  }), []);

  // Debounced actions for performance-critical operations
  const debouncedActions = useMemo(() => {
    let timeUpdateTimeout: NodeJS.Timeout;
    let interactionTimeout: NodeJS.Timeout;

    return {
      // Debounced time update to prevent excessive re-renders
      debouncedTimeUpdate: (time: number) => {
        clearTimeout(timeUpdateTimeout);
        timeUpdateTimeout = setTimeout(() => {
          actions.setCurrentTime(time);
        }, 100);
      },

      // Debounced interaction update
      debouncedInteractionUpdate: () => {
        clearTimeout(interactionTimeout);
        interactionTimeout = setTimeout(() => {
          actions.updateInteractionTime();
        }, 200);
      },

      // Cleanup function
      cleanup: () => {
        clearTimeout(timeUpdateTimeout);
        clearTimeout(interactionTimeout);
      },
    };
  }, [actions]);

  // Memoized selectors for derived state
  const selectors = useMemo(() => ({
    // Video selectors
    isVideoReady: !state.isLoading && !state.error,
    canPlay: !state.isLoading && !state.error && state.currentTime >= 0,
    progressPercentage: state.currentTime > 0 ? (state.currentTime / 180) * 100 : 0, // Assuming 180s duration
    
    // Question selectors
    hasActiveQuestion: state.activeQuestion !== null,
    canSubmitAnswer: state.selectedAnswer !== null && state.activeQuestion !== null,
    questionProgress: state.activeQuestion 
      ? ((state.activeQuestion.timeLimit - state.questionTimeRemaining) / state.activeQuestion.timeLimit) * 100
      : 0,
    
    // Gamification selectors
    hasRewardToShow: state.showRewardFeedback.show,
    currentLevel: state.metrics.level,
    accuracyRate: state.metrics.questionsAnswered > 0 
      ? (state.metrics.correctAnswers / state.metrics.questionsAnswered) * 100 
      : 0,
    
    // UI selectors
    shouldShowControls: state.showControls && !state.activeQuestion,
    isUserIdle: Date.now() - state.lastInteractionTime > 3000, // 3 seconds idle
  }), [state]);

  // Performance monitoring (development only)
  const performanceMetrics = useMemo(() => {
    if (process.env.NODE_ENV === 'development') {
      return {
        stateSize: JSON.stringify(state).length,
        answeredQuestionsSize: state.answeredQuestions.size,
        lastUpdate: Date.now(),
      };
    }
    return null;
  }, [state]);

  return {
    state,
    actions,
    debouncedActions,
    selectors,
    performanceMetrics,
  };
};

export default useVideoPlayerReducer; 