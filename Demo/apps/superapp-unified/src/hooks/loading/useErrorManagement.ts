import { useCallback } from 'react';
import type { ErrorState, LoadingState, OperationMetrics } from './useLoadingCore';

interface ErrorManagementProps {
  errorStates: ErrorState[];
  setErrorStates: React.Dispatch<React.SetStateAction<ErrorState[]>>;
  setLoadingStates: React.Dispatch<React.SetStateAction<LoadingState[]>>;
  setOperationMetrics: React.Dispatch<React.SetStateAction<Map<string, OperationMetrics>>>;
}

/**
 * 🚨 Hook de Gestión de Errores
 * Maneja errores con categorización y retry inteligente
 */
export const useErrorManagement = ({
  errorStates,
  setErrorStates,
  setLoadingStates,
  setOperationMetrics
}: ErrorManagementProps) => {

  // 🔧 Función para remover loading state (independiente)
  const removeLoadingState = useCallback((operation: string, success: boolean = true) => {
    setLoadingStates(prev => {
      const loadingState = prev.find(state => state.operation === operation);
      
      if (loadingState && loadingState.startTime) {
        const duration = Date.now() - loadingState.startTime;
        
        // Actualizar métricas con duración
        setOperationMetrics(prevMetrics => {
          const newMetrics = new Map(prevMetrics);
          const existing = newMetrics.get(operation);
          
          if (existing) {
            const newSuccessCount = success ? existing.successCount + 1 : existing.successCount;
            const newErrorCount = success ? existing.errorCount : existing.errorCount + 1;
            const totalSuccessfulOps = success ? newSuccessCount : existing.successCount;
            
            // Calcular promedio de duración solo para operaciones exitosas
            const newAverageDuration = totalSuccessfulOps > 0 
              ? ((existing.averageDuration * (totalSuccessfulOps - (success ? 1 : 0))) + (success ? duration : 0)) / totalSuccessfulOps
              : existing.averageDuration;
            
            newMetrics.set(operation, {
              ...existing,
              successCount: newSuccessCount,
              errorCount: newErrorCount,
              averageDuration: newAverageDuration,
              lastSuccess: success ? Date.now() : existing.lastSuccess,
              lastError: success ? existing.lastError : Date.now(),
            });
          }
          
          return newMetrics;
        });
      }
      
      return prev.filter(state => state.operation !== operation);
    });
  }, [setLoadingStates, setOperationMetrics]);

  // 🚨 Funciones de gestión de errores (sin dependencias circulares)
  const addErrorState = useCallback((
    operation: string,
    error: string,
    options?: {
      retryFn?: () => void;
      canRetry?: boolean;
      category?: ErrorState['category'];
      statusCode?: number;
      autoRemove?: boolean;
      autoRemoveDelay?: number;
    }
  ) => {
    // Remover loading state si existe
    removeLoadingState(operation, false);
    
    // Obtener retry count actual
    const existingError = errorStates.find(e => e.operation === operation);
    const retryCount = (existingError?.retryCount || 0) + 1;
    const maxRetries = options?.category === 'network' ? 5 : 3;
    
    setErrorStates(prev => {
      // Remover error existente para la misma operación
      const filtered = prev.filter(e => e.operation !== operation);
      
      return [...filtered, {
        operation,
        error,
        timestamp: Date.now(),
        retry: options?.retryFn,
        canRetry: options?.canRetry !== false && retryCount < maxRetries,
        category: options?.category || 'unknown',
        statusCode: options?.statusCode,
        retryCount,
        maxRetries,
      }];
    });

    // Auto-remover error después del tiempo especificado
    const autoRemoveDelay = options?.autoRemoveDelay || 
      (options?.category === 'validation' ? 5000 : 10000);
    
    if (options?.autoRemove !== false) {
      setTimeout(() => {
        setErrorStates(prev => prev.filter(e => 
          !(e.operation === operation && e.timestamp === Date.now())
        ));
      }, autoRemoveDelay);
    }
  }, [errorStates, removeLoadingState, setErrorStates]);

  const removeErrorState = useCallback((operation: string) => {
    setErrorStates(prev => prev.filter(state => state.operation !== operation));
  }, [setErrorStates]);

  const clearAllErrors = useCallback(() => {
    setErrorStates([]);
  }, [setErrorStates]);

  const retryOperation = useCallback((operation: string) => {
    const errorState = errorStates.find(e => e.operation === operation);
    if (errorState?.retry && errorState.canRetry) {
      removeErrorState(operation);
      errorState.retry();
    }
  }, [errorStates, removeErrorState]);

  const hasErrorForOperation = useCallback((operation: string) => {
    return errorStates.some(state => state.operation === operation);
  }, [errorStates]);

  return {
    // Funciones principales
    addErrorState,
    removeErrorState,
    clearAllErrors,
    retryOperation,
    hasErrorForOperation,
    removeLoadingState,
  };
}; 