import { useCallback } from 'react';
import type { LoadingState, ErrorState, OperationMetrics } from './useLoadingCore';

interface LoadingAnalysisProps {
  loadingStates: LoadingState[];
  errorStates: ErrorState[];
  operationMetrics: Map<string, OperationMetrics>;
  isLoadingOperation: (operation: string) => boolean;
  hasErrorForOperation: (operation: string) => boolean;
}

/**
 * 📊 Hook de Análisis de Loading States
 * Proporciona métricas avanzadas y análisis de patrones
 */
export const useLoadingAnalysis = ({
  loadingStates,
  errorStates,
  operationMetrics,
  isLoadingOperation,
  hasErrorForOperation
}: LoadingAnalysisProps) => {

  // 📈 Estado combinado y métricas avanzadas
  const getOperationStatus = useCallback((operation: string) => {
    if (isLoadingOperation(operation)) return 'loading';
    if (hasErrorForOperation(operation)) return 'error';
    return 'idle';
  }, [isLoadingOperation, hasErrorForOperation]);

  const getGlobalMetrics = useCallback(() => {
    const allMetrics = Array.from(operationMetrics.values());
    
    if (allMetrics.length === 0) {
      return {
        totalOperations: 0,
        successRate: 0,
        averageDuration: 0,
        mostReliableOperation: null,
        leastReliableOperation: null,
      };
    }

    const totalOperations = allMetrics.reduce((sum, m) => sum + m.totalAttempts, 0);
    const totalSuccesses = allMetrics.reduce((sum, m) => sum + m.successCount, 0);
    const successRate = totalOperations > 0 ? (totalSuccesses / totalOperations) * 100 : 0;
    
    const operationsWithDuration = allMetrics.filter(m => m.averageDuration > 0);
    const averageDuration = operationsWithDuration.length > 0
      ? operationsWithDuration.reduce((sum, m) => sum + m.averageDuration, 0) / operationsWithDuration.length
      : 0;

    // Encontrar operaciones más y menos confiables
    const operationsWithAttempts = allMetrics.filter(m => m.totalAttempts > 0);
    const mostReliable = operationsWithAttempts.reduce((best, current) => {
      const currentRate = current.successCount / current.totalAttempts;
      const bestRate = best.successCount / best.totalAttempts;
      return currentRate > bestRate ? current : best;
    }, operationsWithAttempts[0]);

    const leastReliable = operationsWithAttempts.reduce((worst, current) => {
      const currentRate = current.successCount / current.totalAttempts;
      const worstRate = worst.successCount / worst.totalAttempts;
      return currentRate < worstRate ? current : worst;
    }, operationsWithAttempts[0]);

    return {
      totalOperations,
      successRate: Math.round(successRate),
      averageDuration: Math.round(averageDuration),
      mostReliableOperation: mostReliable?.operation || null,
      leastReliableOperation: leastReliable?.operation || null,
    };
  }, [operationMetrics]);

  // 🧠 Estados inteligentes con análisis
  const getLoadingsByType = useCallback((type: LoadingState['type']) => {
    return loadingStates.filter(state => state.type === type);
  }, [loadingStates]);

  const getCriticalLoadings = useCallback(() => {
    return loadingStates.filter(state => 
      state.type === 'navigation' || 
      state.type === 'processing' ||
      (state.startTime && Date.now() - state.startTime > 10000) // Operaciones que toman más de 10s
    );
  }, [loadingStates]);

  const getRecentErrors = useCallback((maxAge = 60000) => { // 1 minuto por defecto
    const cutoff = Date.now() - maxAge;
    return errorStates.filter(error => error.timestamp > cutoff);
  }, [errorStates]);

  const getErrorsByCategory = useCallback((category: ErrorState['category']) => {
    return errorStates.filter(error => error.category === category);
  }, [errorStates]);

  const getRetriableErrors = useCallback(() => {
    return errorStates.filter(error => error.canRetry && error.retry);
  }, [errorStates]);

  return {
    // Análisis de estado
    getOperationStatus,
    getGlobalMetrics,
    
    // Análisis de loading
    getLoadingsByType,
    getCriticalLoadings,
    
    // Análisis de errores
    getRecentErrors,
    getErrorsByCategory,
    getRetriableErrors,
  };
}; 