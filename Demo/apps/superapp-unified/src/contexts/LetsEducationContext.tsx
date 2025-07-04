import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// ============================================================================
// INTERFACES Y TIPOS
// ============================================================================

/**
 * Estado de educación LETS del usuario
 * Rastrea el progreso y preferencias para adaptar la UI dinámicamente
 */
interface LetsEducationState {
  /** Nivel de conocimiento del usuario sobre LETS */
  userLevel: 'newcomer' | 'beginner' | 'intermediate' | 'advanced';
  
  /** Si el usuario ha completado el onboarding inicial */
  hasCompletedOnboarding: boolean;
  
  /** Estilo preferido de explicaciones */
  preferredExplanationStyle: 'visual' | 'textual' | 'interactive';
  
  /** Si mostrar la UI simplificada */
  showSimplifiedUI: boolean;
  
  /** Logros completados por el usuario */
  completedAchievements: string[];
  
  /** Paso actual en el proceso de aprendizaje */
  currentStep?: string;
  
  /** Conceptos LETS que el usuario ya comprende */
  understoodConcepts: string[];
  
  /** Preferencias de gamificación */
  gamificationPreferences: {
    enableAnimations: boolean;
    enableSoundEffects: boolean;
    enableCelebrations: boolean;
    difficultyLevel: 'easy' | 'medium' | 'hard';
  };
  
  /** Historial de interacciones para personalización */
  interactionHistory: {
    conceptsViewed: string[];
    tutorialsCompleted: string[];
    errorsEncountered: string[];
    lastActiveDate: string;
  };
}

/**
 * Tipo del contexto de educación LETS
 */
interface LetsEducationContextType {
  state: LetsEducationState;
  
  // Funciones de actualización de nivel
  updateUserLevel: (level: LetsEducationState['userLevel']) => void;
  completeOnboarding: () => void;
  
  // Funciones de logros y progreso
  addAchievement: (achievementId: string) => void;
  markConceptAsUnderstood: (conceptId: string) => void;
  
  // Funciones de preferencias
  setPreferredStyle: (style: LetsEducationState['preferredExplanationStyle']) => void;
  toggleSimplifiedUI: () => void;
  updateGamificationPreferences: (preferences: Partial<LetsEducationState['gamificationPreferences']>) => void;
  
  // Funciones de navegación y progreso
  setCurrentStep: (step: string) => void;
  recordInteraction: (type: 'concept' | 'tutorial' | 'error', id: string) => void;
  
  // Funciones de utilidad
  resetProgress: () => void;
  exportProgress: () => string;
  importProgress: (data: string) => boolean;
  
  // Getters computados
  getRecommendedNextStep: () => string | null;
  shouldShowTooltip: (conceptId: string) => boolean;
  getUIComplexityLevel: () => 'simple' | 'intermediate' | 'advanced';
}

// ============================================================================
// ESTADO INICIAL Y CONSTANTES
// ============================================================================

const STORAGE_KEY = 'lets_education_state';

const initialState: LetsEducationState = {
  userLevel: 'newcomer',
  hasCompletedOnboarding: false,
  preferredExplanationStyle: 'visual',
  showSimplifiedUI: true,
  completedAchievements: [],
  currentStep: 'welcome',
  understoodConcepts: [],
  gamificationPreferences: {
    enableAnimations: true,
    enableSoundEffects: true,
    enableCelebrations: true,
    difficultyLevel: 'easy'
  },
  interactionHistory: {
    conceptsViewed: [],
    tutorialsCompleted: [],
    errorsEncountered: [],
    lastActiveDate: new Date().toISOString()
  }
};

// ============================================================================
// CONTEXTO
// ============================================================================

const LetsEducationContext = createContext<LetsEducationContextType | undefined>(undefined);

// ============================================================================
// PROVEEDOR
// ============================================================================

interface LetsEducationProviderProps {
  children: ReactNode;
}

export const LetsEducationProvider: React.FC<LetsEducationProviderProps> = ({ children }) => {
  const [state, setState] = useState<LetsEducationState>(initialState);

  // ============================================================================
  // EFECTOS DE INICIALIZACIÓN Y PERSISTENCIA
  // ============================================================================

  // Cargar estado desde localStorage al inicializar
  useEffect(() => {
    try {
      const savedState = localStorage.getItem(STORAGE_KEY);
      if (savedState) {
        const parsedState = JSON.parse(savedState);
        // Actualizar la fecha de última actividad
        parsedState.interactionHistory.lastActiveDate = new Date().toISOString();
        setState(parsedState);
      }
    } catch (error) {
      console.warn('Error loading LETS education state from localStorage:', error);
      // Si hay error, usar estado inicial
      setState(initialState);
    }
  }, []);

  // Guardar estado en localStorage cuando cambie
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.warn('Error saving LETS education state to localStorage:', error);
    }
  }, [state]);

  // ============================================================================
  // FUNCIONES DE ACTUALIZACIÓN
  // ============================================================================

  const updateUserLevel = (level: LetsEducationState['userLevel']) => {
    setState(prev => ({
      ...prev,
      userLevel: level,
      // Ajustar UI simplificada basada en el nivel
      showSimplifiedUI: level === 'newcomer' || level === 'beginner'
    }));
  };

  const completeOnboarding = () => {
    setState(prev => ({
      ...prev,
      hasCompletedOnboarding: true,
      userLevel: prev.userLevel === 'newcomer' ? 'beginner' : prev.userLevel,
      currentStep: 'dashboard'
    }));
  };

  const addAchievement = (achievementId: string) => {
    setState(prev => ({
      ...prev,
      completedAchievements: [...new Set([...prev.completedAchievements, achievementId])]
    }));
  };

  const markConceptAsUnderstood = (conceptId: string) => {
    setState(prev => ({
      ...prev,
      understoodConcepts: [...new Set([...prev.understoodConcepts, conceptId])]
    }));
  };

  const setPreferredStyle = (style: LetsEducationState['preferredExplanationStyle']) => {
    setState(prev => ({
      ...prev,
      preferredExplanationStyle: style
    }));
  };

  const toggleSimplifiedUI = () => {
    setState(prev => ({
      ...prev,
      showSimplifiedUI: !prev.showSimplifiedUI
    }));
  };

  const updateGamificationPreferences = (preferences: Partial<LetsEducationState['gamificationPreferences']>) => {
    setState(prev => ({
      ...prev,
      gamificationPreferences: {
        ...prev.gamificationPreferences,
        ...preferences
      }
    }));
  };

  const setCurrentStep = (step: string) => {
    setState(prev => ({
      ...prev,
      currentStep: step
    }));
  };

  const recordInteraction = (type: 'concept' | 'tutorial' | 'error', id: string) => {
    setState(prev => {
      const history = { ...prev.interactionHistory };
      
      switch (type) {
        case 'concept':
          history.conceptsViewed = [...new Set([...history.conceptsViewed, id])];
          break;
        case 'tutorial':
          history.tutorialsCompleted = [...new Set([...history.tutorialsCompleted, id])];
          break;
        case 'error':
          history.errorsEncountered = [...history.errorsEncountered, id];
          break;
      }
      
      history.lastActiveDate = new Date().toISOString();
      
      return {
        ...prev,
        interactionHistory: history
      };
    });
  };

  const resetProgress = () => {
    setState(initialState);
    localStorage.removeItem(STORAGE_KEY);
  };

  const exportProgress = (): string => {
    return JSON.stringify(state, null, 2);
  };

  const importProgress = (data: string): boolean => {
    try {
      const importedState = JSON.parse(data);
      // Validar que tiene la estructura correcta
      if (importedState && typeof importedState.userLevel === 'string') {
        setState(importedState);
        return true;
      }
      return false;
    } catch (error) {
      console.warn('Error importing LETS education progress:', error);
      return false;
    }
  };

  // ============================================================================
  // GETTERS COMPUTADOS
  // ============================================================================

  const getRecommendedNextStep = (): string | null => {
    if (!state.hasCompletedOnboarding) {
      return 'onboarding';
    }
    
    if (state.understoodConcepts.length < 3) {
      return 'basic-concepts';
    }
    
    if (state.userLevel === 'beginner' && state.understoodConcepts.length >= 5) {
      return 'intermediate-features';
    }
    
    return null;
  };

  const shouldShowTooltip = (conceptId: string): boolean => {
    return !state.understoodConcepts.includes(conceptId) && 
           (state.userLevel === 'newcomer' || state.userLevel === 'beginner');
  };

  const getUIComplexityLevel = (): 'simple' | 'intermediate' | 'advanced' => {
    if (state.showSimplifiedUI || state.userLevel === 'newcomer') {
      return 'simple';
    }
    
    if (state.userLevel === 'beginner' || state.userLevel === 'intermediate') {
      return 'intermediate';
    }
    
    return 'advanced';
  };

  // ============================================================================
  // VALOR DEL CONTEXTO
  // ============================================================================

  const contextValue: LetsEducationContextType = {
    state,
    updateUserLevel,
    completeOnboarding,
    addAchievement,
    markConceptAsUnderstood,
    setPreferredStyle,
    toggleSimplifiedUI,
    updateGamificationPreferences,
    setCurrentStep,
    recordInteraction,
    resetProgress,
    exportProgress,
    importProgress,
    getRecommendedNextStep,
    shouldShowTooltip,
    getUIComplexityLevel
  };

  return (
    <LetsEducationContext.Provider value={contextValue}>
      {children}
    </LetsEducationContext.Provider>
  );
};

// ============================================================================
// HOOK PERSONALIZADO
// ============================================================================

/**
 * Hook para acceder al contexto de educación LETS
 * @returns El contexto de educación LETS
 * @throws Error si se usa fuera del LetsEducationProvider
 */
export const useLetsEducation = (): LetsEducationContextType => {
  const context = useContext(LetsEducationContext);
  
  if (context === undefined) {
    throw new Error('useLetsEducation must be used within a LetsEducationProvider');
  }
  
  return context;
};

// ============================================================================
// EXPORTACIONES ADICIONALES
// ============================================================================

export type { LetsEducationState, LetsEducationContextType };
export { STORAGE_KEY as LETS_EDUCATION_STORAGE_KEY }; 