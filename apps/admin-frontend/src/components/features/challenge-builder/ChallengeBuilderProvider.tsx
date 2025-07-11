/**
 * 🎮 Challenge Builder Provider - Context y Estado Global
 *
 * Provider React que gestiona el estado completo del Constructor Visual de Desafíos
 * Implementa Context Engineering para coordinación perfecta ARIA + ATLAS + COSMOS
 */

import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import { 
  BuilderState, 
  BuilderAction, 
  ChallengeFlow, 
  ChallengeElement, 
  ValidationRule,
  ChallengeMetrics,
  OCTALYSIS_CORES,
  UseChallengeBuilderReturn,
  DEFAULT_CANVAS_SIZE,
  DEFAULT_GRID_SIZE,
  VALIDATION_SEVERITY_ORDER,
} from '../../../types/challenge-builder.types';

// Estado inicial
const initialState: BuilderState = {
  currentFlow: null,
  selectedElement: null,
  activeTab: 0,
  previewMode: false,
  validationResults: [],
  isDragging: null,
  canvasSize: DEFAULT_CANVAS_SIZE,
  zoom: 1,
  showGrid: true,
  snapToGrid: true,
  gridSize: DEFAULT_GRID_SIZE,
};

// Reducer
const builderReducer = (state: BuilderState, action: BuilderAction): BuilderState => {
  switch (action.type) {
    case 'SET_FLOW':
      return {
        ...state,
        currentFlow: action.payload,
        selectedElement: null,
      };

    case 'ADD_ELEMENT':
      if (!state.currentFlow) return state;
      return {
        ...state,
        currentFlow: {
          ...state.currentFlow,
          elements: [...state.currentFlow.elements, action.payload],
          metadata: {
            ...state.currentFlow.metadata,
            modifiedAt: new Date().toISOString(),
          },
        },
        selectedElement: action.payload,
      };

    case 'UPDATE_ELEMENT':
      if (!state.currentFlow) return state;
      return {
        ...state,
        currentFlow: {
          ...state.currentFlow,
          elements: state.currentFlow.elements.map(el => 
            el.id === action.payload.id 
              ? { 
                  ...el, 
                  ...action.payload.updates,
                  metadata: {
                    ...el.metadata,
                    modifiedAt: new Date().toISOString(),
                  },
                }
              : el
          ),
          metadata: {
            ...state.currentFlow.metadata,
            modifiedAt: new Date().toISOString(),
          },
        },
        selectedElement: state.selectedElement?.id === action.payload.id
          ? { ...state.selectedElement, ...action.payload.updates }
          : state.selectedElement,
      };

    case 'DELETE_ELEMENT':
      if (!state.currentFlow) return state;
      return {
        ...state,
        currentFlow: {
          ...state.currentFlow,
          elements: state.currentFlow.elements.filter(el => el.id !== action.payload),
          connections: state.currentFlow.connections.filter(
            conn => conn.source !== action.payload && conn.target !== action.payload
          ),
          metadata: {
            ...state.currentFlow.metadata,
            modifiedAt: new Date().toISOString(),
          },
        },
        selectedElement: state.selectedElement?.id === action.payload ? null : state.selectedElement,
      };

    case 'SELECT_ELEMENT':
      return {
        ...state,
        selectedElement: action.payload,
      };

    case 'SET_ACTIVE_TAB':
      return {
        ...state,
        activeTab: action.payload,
      };

    case 'SET_PREVIEW_MODE':
      return {
        ...state,
        previewMode: action.payload,
      };

    case 'SET_VALIDATION_RESULTS':
      return {
        ...state,
        validationResults: action.payload,
      };

    case 'SET_DRAGGING':
      return {
        ...state,
        isDragging: action.payload,
      };

    case 'UPDATE_CANVAS_SIZE':
      return {
        ...state,
        canvasSize: action.payload,
      };

    case 'SET_ZOOM':
      return {
        ...state,
        zoom: Math.max(0.1, Math.min(3, action.payload)),
      };

    case 'TOGGLE_GRID':
      return {
        ...state,
        showGrid: action.payload ?? !state.showGrid,
      };

    case 'TOGGLE_SNAP_TO_GRID':
      return {
        ...state,
        snapToGrid: action.payload ?? !state.snapToGrid,
      };

    default:
      return state;
  }
};

// Context
const ChallengeBuilderContext = createContext<UseChallengeBuilderReturn | null>(null);

// Provider Component
interface ChallengeBuilderProviderProps {
  children: React.ReactNode;
  initialFlow?: ChallengeFlow;
}

export const ChallengeBuilderProvider: React.FC<ChallengeBuilderProviderProps> = ({ 
  children, 
  initialFlow 
}) => {
  const [state, dispatch] = useReducer(builderReducer, {
    ...initialState,
    currentFlow: initialFlow || null,
  });

  // Funciones de validación
  const validateFlow = useCallback(() => {
    if (!state.currentFlow) return;

    const results: ValidationRule[] = [];
    const flow = state.currentFlow;

    // Validaciones de integridad básica
    if (flow.elements.length === 0) {
      results.push({
        id: 'no-elements',
        type: 'required',
        message: 'El flujo necesita al menos un elemento para ser funcional',
        severity: 'error',
      });
    }

    // Validar presencia de trigger inicial
    const triggers = flow.elements.filter(el => el.type === 'trigger');
    if (triggers.length === 0) {
      results.push({
        id: 'no-trigger',
        type: 'required',
        message: 'Todo desafío debe tener un activador de inicio',
        severity: 'error',
      });
    } else if (triggers.length > 1) {
      results.push({
        id: 'multiple-triggers',
        type: 'logic',
        message: 'Múltiples activadores pueden crear confusión en el flujo',
        severity: 'warning',
      });
    }

    // Validar presencia de recompensas
    const rewards = flow.elements.filter(el => el.type === 'reward');
    if (rewards.length === 0) {
      results.push({
        id: 'no-rewards',
        type: 'ux',
        message: 'Considera agregar recompensas para motivar la completitud',
        severity: 'warning',
      });
    }

    // Validación de balance Octalysis
    const octalysisUsage = flow.elements.reduce((acc, element) => {
      element.octalysisElements.forEach(oe => {
        acc[oe.core] = (acc[oe.core] || 0) + oe.weight;
      });
      return acc;
    }, {} as Record<number, number>);

    const activeCores = Object.keys(octalysisUsage).length;
    if (activeCores < 2) {
      results.push({
        id: 'insufficient-octalysis',
        type: 'octalysis',
        message: 'Considera usar múltiples Core Drives de Octalysis para mayor engagement',
        severity: 'info',
      });
    }

    // Validación de balance White Hat vs Black Hat
    const whiteHatCores = [1, 2, 3, 5];
    const blackHatCores = [4, 6, 7, 8];
    
    const whiteHatWeight = whiteHatCores.reduce((sum, core) => sum + (octalysisUsage[core] || 0), 0);
    const blackHatWeight = blackHatCores.reduce((sum, core) => sum + (octalysisUsage[core] || 0), 0);
    
    if (blackHatWeight > whiteHatWeight * 1.5) {
      results.push({
        id: 'black-hat-dominance',
        type: 'philosophy',
        message: 'Desbalance hacia Black Hat Gamification. Considera más elementos positivos.',
        severity: 'warning',
      });
    }

    // Validación de filosofía CoomÜnity
    const hasCollaborativeElements = flow.elements.some(el => el.type === 'social');
    const hasCreativeElements = flow.elements.some(el => 
      el.type === 'content' || 
      el.octalysisElements.some(oe => oe.core === 3)
    );

    if (!hasCollaborativeElements && !hasCreativeElements) {
      results.push({
        id: 'lack-bien-comun',
        type: 'philosophy',
        message: 'Considera elementos que fomenten colaboración o creatividad (Bien Común)',
        severity: 'info',
      });
    }

    // Validación de accesibilidad
    const hasTimers = flow.elements.some(el => el.type === 'timer');
    if (hasTimers && !flow.settings.accessibility.reducedMotion) {
      results.push({
        id: 'accessibility-timers',
        type: 'ux',
        message: 'Los temporizadores pueden crear estrés. Considera opciones de accesibilidad.',
        severity: 'info',
      });
    }

    dispatch({ type: 'SET_VALIDATION_RESULTS', payload: results });
  }, [state.currentFlow]);

  // Calcular métricas de Octalysis
  const calculateOctalysisBalance = useCallback((): Record<number, number> => {
    if (!state.currentFlow) return {};

    return state.currentFlow.elements.reduce((acc, element) => {
      element.octalysisElements.forEach(oe => {
        acc[oe.core] = (acc[oe.core] || 0) + oe.weight;
      });
      return acc;
    }, {} as Record<number, number>);
  }, [state.currentFlow]);

  // Calcular score de Bien Común
  const calculateBienComunScore = useCallback((): number => {
    if (!state.currentFlow) return 0;

    let score = 0;
    const maxScore = state.currentFlow.elements.length * 10;

    // Puntos por elementos colaborativos
    const collaborativeElements = state.currentFlow.elements.filter(el => el.type === 'social');
    score += collaborativeElements.length * 3;

    // Puntos por elementos creativos
    const creativeElements = state.currentFlow.elements.filter(el => 
      el.type === 'content' || el.octalysisElements.some(oe => oe.core === 3)
    );
    score += creativeElements.length * 2;

    // Puntos por balance White Hat
    const octalysisBalance = calculateOctalysisBalance();
    const whiteHatTotal = [1, 2, 3, 5].reduce((sum, core) => sum + (octalysisBalance[core] || 0), 0);
    const blackHatTotal = [4, 6, 7, 8].reduce((sum, core) => sum + (octalysisBalance[core] || 0), 0);
    
    if (whiteHatTotal >= blackHatTotal) {
      score += 2;
    }

    // Penalizaciones por elementos manipulativos
    const manipulativeElements = state.currentFlow.elements.filter(el => 
      el.type === 'timer' || el.octalysisElements.some(oe => oe.core === 6 || oe.core === 8)
    );
    score -= manipulativeElements.length * 1;

    return maxScore > 0 ? Math.max(0, Math.min(10, (score / maxScore) * 10)) : 0;
  }, [state.currentFlow, calculateOctalysisBalance]);

  // Efectos
  useEffect(() => {
    if (state.currentFlow) {
      validateFlow();
    }
  }, [state.currentFlow, validateFlow]);

  // Actions
  const actions = {
    setFlow: useCallback((flow: ChallengeFlow) => {
      dispatch({ type: 'SET_FLOW', payload: flow });
    }, []),

    addElement: useCallback((element: ChallengeElement) => {
      dispatch({ type: 'ADD_ELEMENT', payload: element });
    }, []),

    updateElement: useCallback((id: string, updates: Partial<ChallengeElement>) => {
      dispatch({ type: 'UPDATE_ELEMENT', payload: { id, updates } });
    }, []),

    deleteElement: useCallback((id: string) => {
      dispatch({ type: 'DELETE_ELEMENT', payload: id });
    }, []),

    selectElement: useCallback((element: ChallengeElement | null) => {
      dispatch({ type: 'SELECT_ELEMENT', payload: element });
    }, []),

    setActiveTab: useCallback((tab: number) => {
      dispatch({ type: 'SET_ACTIVE_TAB', payload: tab });
    }, []),

    setPreviewMode: useCallback((preview: boolean) => {
      dispatch({ type: 'SET_PREVIEW_MODE', payload: preview });
    }, []),

    validateFlow: useCallback(() => {
      validateFlow();
    }, [validateFlow]),

    generateCode: useCallback(async () => {
      if (!state.currentFlow) return;
      
      // Simular generación de código
      console.log('Generating code for challenge:', state.currentFlow.name);
      
      // Aquí se integraría con ATLAS para generar el backend
      // y con COSMOS para la integración completa
    }, [state.currentFlow]),

    saveFlow: useCallback(async () => {
      if (!state.currentFlow) return;
      
      // Simular guardado
      console.log('Saving challenge flow:', state.currentFlow.name);
      
      // Aquí se integraría con ATLAS para persistir en backend
    }, [state.currentFlow]),
  };

  // Computed values
  const computed = {
    hasErrors: state.validationResults.some(r => r.severity === 'error'),
    hasWarnings: state.validationResults.some(r => r.severity === 'warning'),
    canGenerateCode: state.currentFlow !== null && 
      !state.validationResults.some(r => r.severity === 'error'),
    canPublish: state.currentFlow !== null && 
      !state.validationResults.some(r => r.severity === 'error') &&
      state.currentFlow.elements.length > 0,
    octalysisBalance: calculateOctalysisBalance(),
    bienComunScore: calculateBienComunScore(),
  };

  const value: UseChallengeBuilderReturn = {
    state,
    actions,
    computed,
  };

  return (
    <ChallengeBuilderContext.Provider value={value}>
      {children}
    </ChallengeBuilderContext.Provider>
  );
};

// Hook para usar el context
export const useChallengeBuilder = (): UseChallengeBuilderReturn => {
  const context = useContext(ChallengeBuilderContext);
  if (!context) {
    throw new Error('useChallengeBuilder must be used within a ChallengeBuilderProvider');
  }
  return context;
};

// Hook para validación específica
export const useValidation = () => {
  const { state, actions } = useChallengeBuilder();
  
  const getValidationSummary = useCallback(() => {
    const errors = state.validationResults.filter(r => r.severity === 'error');
    const warnings = state.validationResults.filter(r => r.severity === 'warning');
    const infos = state.validationResults.filter(r => r.severity === 'info');
    
    return {
      errors,
      warnings,
      infos,
      hasBlockingIssues: errors.length > 0,
      totalIssues: state.validationResults.length,
    };
  }, [state.validationResults]);

  const getValidationsByType = useCallback((type: ValidationRule['type']) => {
    return state.validationResults.filter(r => r.type === type);
  }, [state.validationResults]);

  return {
    validationResults: state.validationResults,
    summary: getValidationSummary(),
    byType: getValidationsByType,
    validate: actions.validateFlow,
  };
};

// Hook para métricas Octalysis
export const useOctalysisMetrics = () => {
  const { computed, state } = useChallengeBuilder();
  
  const getOctalysisAnalysis = useCallback(() => {
    const balance = computed.octalysisBalance;
    const totalWeight = Object.values(balance).reduce((sum, weight) => sum + weight, 0);
    
    const analysis = Object.entries(OCTALYSIS_CORES).map(([coreNum, coreInfo]) => {
      const core = parseInt(coreNum);
      const weight = balance[core] || 0;
      const percentage = totalWeight > 0 ? (weight / totalWeight) * 100 : 0;
      
      return {
        core,
        ...coreInfo,
        weight,
        percentage,
        isActive: weight > 0,
        isBalanced: percentage >= 5 && percentage <= 25, // Rango considerado balanceado
      };
    });
    
    const whiteHatCores = analysis.filter(a => a.type === 'white');
    const blackHatCores = analysis.filter(a => a.type === 'black');
    
    const whiteHatTotal = whiteHatCores.reduce((sum, core) => sum + core.weight, 0);
    const blackHatTotal = blackHatCores.reduce((sum, core) => sum + core.weight, 0);
    
    return {
      cores: analysis,
      totalWeight,
      whiteHatTotal,
      blackHatTotal,
      balance: whiteHatTotal > 0 && blackHatTotal > 0 ? whiteHatTotal / blackHatTotal : 0,
      recommendation: whiteHatTotal >= blackHatTotal ? 'balanced' : 'needs_more_whithat',
    };
  }, [computed.octalysisBalance]);

  return {
    balance: computed.octalysisBalance,
    analysis: getOctalysisAnalysis(),
    bienComunScore: computed.bienComunScore,
  };
};

export default ChallengeBuilderProvider;