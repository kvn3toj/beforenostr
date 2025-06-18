import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type UserExperience = 'newcomer' | 'beginner' | 'intermediate' | 'advanced';
type ExplanationStyle = 'visual' | 'textual' | 'interactive';

interface LetsContextData {
  // User experience level
  userLevel: UserExperience;
  setUserLevel: (level: UserExperience) => void;
  
  // UI preferences
  showSimplifiedUI: boolean;
  setShowSimplifiedUI: (show: boolean) => void;
  
  preferredExplanationStyle: ExplanationStyle;
  setPreferredExplanationStyle: (style: ExplanationStyle) => void;
  
  // Onboarding status
  hasCompletedOnboarding: boolean;
  setHasCompletedOnboarding: (completed: boolean) => void;
  
  // Feature discovery
  discoveredFeatures: Set<string>;
  markFeatureAsDiscovered: (feature: string) => void;
  isFeatureDiscovered: (feature: string) => boolean;
  
  // Helper methods
  shouldShowTooltip: (concept: string) => boolean;
  getComplexityLevel: () => number;
  shouldUseHumanizedUI: () => boolean;
}

const LetsContext = createContext<LetsContextData | null>(null);

interface LetsContextProviderProps {
  children: ReactNode;
  userId?: string;
}

const STORAGE_KEYS = {
  userLevel: 'lets_user_level',
  onboardingCompleted: 'lets_onboarding_completed',
  discoveredFeatures: 'lets_discovered_features',
  explanationStyle: 'lets_explanation_style',
  simplifiedUI: 'lets_simplified_ui',
} as const;

// Determinar nivel de usuario basado en datos históricos
const determineUserLevel = (userStats?: {
  totalExchanges: number;
  totalUnitsTransferred: number;
  trustScore: number;
  daysActive: number;
}): UserExperience => {
  if (!userStats || userStats.totalExchanges === 0) {
    return 'newcomer';
  }
  
  const { totalExchanges, totalUnitsTransferred, trustScore, daysActive } = userStats;
  
  // Algoritmo de scoring para determinar nivel
  let score = 0;
  
  // Experiencia en intercambios
  if (totalExchanges >= 1) score += 1;
  if (totalExchanges >= 5) score += 1;
  if (totalExchanges >= 20) score += 1;
  if (totalExchanges >= 50) score += 1;
  
  // Volumen de transacciones
  if (totalUnitsTransferred >= 10) score += 1;
  if (totalUnitsTransferred >= 100) score += 1;
  
  // Confianza comunitaria
  if (trustScore >= 70) score += 1;
  if (trustScore >= 90) score += 1;
  
  // Tiempo en la plataforma
  if (daysActive >= 7) score += 1;
  if (daysActive >= 30) score += 1;
  
  // Mapear score a nivel
  if (score <= 2) return 'beginner';
  if (score <= 5) return 'intermediate';
  return 'advanced';
};

export const LetsContextProvider: React.FC<LetsContextProviderProps> = ({
  children,
  userId,
}) => {
  // Estado del contexto
  const [userLevel, setUserLevel] = useState<UserExperience>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.userLevel);
    return (stored as UserExperience) || 'newcomer';
  });
  
  const [showSimplifiedUI, setShowSimplifiedUI] = useState<boolean>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.simplifiedUI);
    return stored ? JSON.parse(stored) : true;
  });
  
  const [preferredExplanationStyle, setPreferredExplanationStyle] = useState<ExplanationStyle>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.explanationStyle);
    return (stored as ExplanationStyle) || 'visual';
  });
  
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.onboardingCompleted);
    return stored ? JSON.parse(stored) : false;
  });
  
  const [discoveredFeatures, setDiscoveredFeatures] = useState<Set<string>>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.discoveredFeatures);
    return stored ? new Set(JSON.parse(stored)) : new Set();
  });

  // Persistir cambios en localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.userLevel, userLevel);
  }, [userLevel]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.simplifiedUI, JSON.stringify(showSimplifiedUI));
  }, [showSimplifiedUI]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.explanationStyle, preferredExplanationStyle);
  }, [preferredExplanationStyle]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.onboardingCompleted, JSON.stringify(hasCompletedOnboarding));
  }, [hasCompletedOnboarding]);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEYS.discoveredFeatures, 
      JSON.stringify([...discoveredFeatures])
    );
  }, [discoveredFeatures]);

  // Métodos auxiliares
  const markFeatureAsDiscovered = (feature: string) => {
    setDiscoveredFeatures(prev => new Set([...prev, feature]));
  };

  const isFeatureDiscovered = (feature: string) => {
    return discoveredFeatures.has(feature);
  };

  const shouldShowTooltip = (concept: string) => {
    // Mostrar tooltips para newcomers y beginners, y si no han descubierto la feature
    return (
      ['newcomer', 'beginner'].includes(userLevel) &&
      !isFeatureDiscovered(`tooltip_${concept}`)
    );
  };

  const getComplexityLevel = () => {
    const levels = { newcomer: 1, beginner: 2, intermediate: 3, advanced: 4 };
    return levels[userLevel];
  };

  const shouldUseHumanizedUI = () => {
    return showSimplifiedUI || ['newcomer', 'beginner'].includes(userLevel);
  };

  // Auto-detectar nivel de usuario basado en actividad (si hay userId)
  useEffect(() => {
    if (userId && userLevel === 'newcomer') {
      // Aquí podrías hacer una llamada para obtener estadísticas del usuario
      // y auto-determinar su nivel de experiencia
      // const userStats = await getUserLetsStats(userId);
      // const detectedLevel = determineUserLevel(userStats);
      // setUserLevel(detectedLevel);
    }
  }, [userId, userLevel]);

  const contextValue: LetsContextData = {
    userLevel,
    setUserLevel,
    showSimplifiedUI,
    setShowSimplifiedUI,
    preferredExplanationStyle,
    setPreferredExplanationStyle,
    hasCompletedOnboarding,
    setHasCompletedOnboarding,
    discoveredFeatures,
    markFeatureAsDiscovered,
    isFeatureDiscovered,
    shouldShowTooltip,
    getComplexityLevel,
    shouldUseHumanizedUI,
  };

  return (
    <LetsContext.Provider value={contextValue}>
      {children}
    </LetsContext.Provider>
  );
};

// Hook para usar el contexto
export const useLetsContext = (): LetsContextData => {
  const context = useContext(LetsContext);
  if (!context) {
    throw new Error('useLetsContext must be used within a LetsContextProvider');
  }
  return context;
};

// Hook para auto-adaptación de UI
export const useLetsAdaptiveUI = () => {
  const context = useLetsContext();
  
  return {
    // Componentes adaptativos
    WalletComponent: context.shouldUseHumanizedUI() ? 'UnitsWalletHumanized' : 'UnitsWallet',
    
    // Configuraciones de UI
    showAdvancedFeatures: context.userLevel !== 'newcomer',
    showDetailedMetrics: ['intermediate', 'advanced'].includes(context.userLevel),
    autoShowTooltips: context.userLevel === 'newcomer',
    
    // Mensajes contextuales
    getLoadingMessage: (action: string) => {
      const messages = {
        newcomer: `Preparando tu ${action}... 🌟`,
        beginner: `Cargando ${action}...`,
        intermediate: `Obteniendo datos de ${action}...`,
        advanced: `Fetching ${action} data...`,
      };
      return messages[context.userLevel];
    },
    
    // Configuración de explicaciones
    explanationDepth: context.getComplexityLevel(),
    useEmojis: ['newcomer', 'beginner'].includes(context.userLevel),
    showTechnicalDetails: ['intermediate', 'advanced'].includes(context.userLevel),
  };
};

// Configuraciones predefinidas por nivel
export const LEVEL_CONFIGURATIONS = {
  newcomer: {
    showSimplifiedUI: true,
    preferredExplanationStyle: 'visual' as ExplanationStyle,
    autoShowTooltips: true,
    useEmojis: true,
    showTechnicalDetails: false,
  },
  beginner: {
    showSimplifiedUI: true,
    preferredExplanationStyle: 'interactive' as ExplanationStyle,
    autoShowTooltips: false,
    useEmojis: true,
    showTechnicalDetails: false,
  },
  intermediate: {
    showSimplifiedUI: false,
    preferredExplanationStyle: 'textual' as ExplanationStyle,
    autoShowTooltips: false,
    useEmojis: false,
    showTechnicalDetails: true,
  },
  advanced: {
    showSimplifiedUI: false,
    preferredExplanationStyle: 'textual' as ExplanationStyle,
    autoShowTooltips: false,
    useEmojis: false,
    showTechnicalDetails: true,
  },
} as const;

export default LetsContextProvider; 