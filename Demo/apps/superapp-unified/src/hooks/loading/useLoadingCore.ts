import { useState, useCallback } from 'react';

// Interfaces para estados de carga
export interface LoadingState {
  isLoading: boolean;
  operation: string;
  progress?: number;
  message?: string;
  type?: 'default' | 'upload' | 'download' | 'processing' | 'navigation';
  startTime?: number;
  estimatedDuration?: number;
}

export interface ErrorState {
  operation: string;
  error: string;
  timestamp: number;
  retry?: () => void;
  canRetry?: boolean;
  category?: 'network' | 'auth' | 'validation' | 'business' | 'server' | 'unknown';
  statusCode?: number;
  retryCount?: number;
  maxRetries?: number;
}

export interface OperationMetrics {
  operation: string;
  totalAttempts: number;
  successCount: number;
  errorCount: number;
  averageDuration: number;
  lastSuccess?: number;
  lastError?: number;
}

/**
 * 🔧 Hook Core de Loading States
 * Funciones básicas sin dependencias circulares
 */
export const useLoadingCore = () => {
  const [loadingStates, setLoadingStates] = useState<LoadingState[]>([]);
  const [errorStates, setErrorStates] = useState<ErrorState[]>([]);
  const [operationMetrics, setOperationMetrics] = useState<Map<string, OperationMetrics>>(new Map());

  // 📝 Funciones básicas de loading (sin dependencias)
  const addLoadingState = useCallback((
    operation: string, 
    progress?: number,
    options?: {
      message?: string;
      type?: LoadingState['type'];
      estimatedDuration?: number;
    }
  ) => {
    setLoadingStates(prev => {
      // Remover estado de loading existente para la misma operación
      const filtered = prev.filter(state => state.operation !== operation);
      
      return [...filtered, { 
        isLoading: true, 
        operation, 
        progress: Math.min(Math.max(progress || 0, 0), 100),
        message: options?.message,
        type: options?.type || 'default',
        startTime: Date.now(),
        estimatedDuration: options?.estimatedDuration,
      }];
    });

    // Actualizar métricas
    setOperationMetrics(prev => {
      const newMetrics = new Map(prev);
      const existing = newMetrics.get(operation) || {
        operation,
        totalAttempts: 0,
        successCount: 0,
        errorCount: 0,
        averageDuration: 0,
      };
      
      newMetrics.set(operation, {
        ...existing,
        totalAttempts: existing.totalAttempts + 1,
      });
      
      return newMetrics;
    });
  }, []);

  const updateProgress = useCallback((operation: string, progress: number, message?: string) => {
    setLoadingStates(prev =>
      prev.map(state =>
        state.operation === operation ? { 
          ...state, 
          progress: Math.min(Math.max(progress, 0), 100), // Clamp entre 0-100
          message: message || state.message
        } : state
      )
    );
  }, []);

  const updateLoadingMessage = useCallback((operation: string, message: string) => {
    setLoadingStates(prev =>
      prev.map(state =>
        state.operation === operation ? { ...state, message } : state
      )
    );
  }, []);

  const isLoadingOperation = useCallback((operation: string) => {
    return loadingStates.some(state => state.operation === operation);
  }, [loadingStates]);

  const getLoadingState = useCallback((operation: string) => {
    return loadingStates.find(state => state.operation === operation);
  }, [loadingStates]);

  // 📊 Funciones básicas de métricas (sin dependencias)
  const getOperationMetrics = useCallback((operation: string) => {
    return operationMetrics.get(operation) || null;
  }, [operationMetrics]);

  const getLoadingMetrics = useCallback((operation: string) => {
    const state = getLoadingState(operation);
    if (!state || !state.startTime) return null;

    const elapsed = Date.now() - state.startTime;
    const estimated = state.estimatedDuration;
    
    return {
      elapsed,
      estimated,
      remaining: estimated ? Math.max(estimated - elapsed, 0) : null,
      percentageTime: estimated ? Math.min((elapsed / estimated) * 100, 100) : null,
      progress: state.progress || 0,
    };
  }, [getLoadingState]);

  return {
    // Estados
    loadingStates,
    errorStates,
    operationMetrics,
    setLoadingStates,
    setErrorStates,
    setOperationMetrics,
    
    // Funciones básicas
    addLoadingState,
    updateProgress,
    updateLoadingMessage,
    isLoadingOperation,
    getLoadingState,
    getOperationMetrics,
    getLoadingMetrics,
    
    // Computed
    hasAnyLoading: loadingStates.length > 0,
  };
}; 