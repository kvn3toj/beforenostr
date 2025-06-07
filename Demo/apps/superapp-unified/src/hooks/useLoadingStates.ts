import { useState, useEffect, useCallback } from 'react';

interface LoadingState {
  isLoading: boolean;
  operation: string;
  progress?: number;
  message?: string;
  type?: 'default' | 'upload' | 'download' | 'processing' | 'navigation';
  startTime?: number;
  estimatedDuration?: number;
}

interface ErrorState {
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

interface OperationMetrics {
  operation: string;
  totalAttempts: number;
  successCount: number;
  errorCount: number;
  averageDuration: number;
  lastSuccess?: number;
  lastError?: number;
}

export const useLoadingStates = () => {
  const [loadingStates, setLoadingStates] = useState<LoadingState[]>([]);
  const [errorStates, setErrorStates] = useState<ErrorState[]>([]);
  const [operationMetrics, setOperationMetrics] = useState<Map<string, OperationMetrics>>(new Map());

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

  const hasAnyLoading = loadingStates.length > 0;

  // 🔥 ESTADOS DE ERROR AVANZADOS CON CATEGORIZACIÓN Y RETRY INTELIGENTE
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
  }, [errorStates, removeLoadingState]);

  const removeErrorState = useCallback((operation: string) => {
    setErrorStates(prev => prev.filter(state => state.operation !== operation));
  }, []);

  const clearAllErrors = useCallback(() => {
    setErrorStates([]);
  }, []);

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

  // 📊 ESTADO COMBINADO Y MÉTRICAS AVANZADAS
  const getOperationStatus = useCallback((operation: string) => {
    if (isLoadingOperation(operation)) return 'loading';
    if (hasErrorForOperation(operation)) return 'error';
    return 'idle';
  }, [isLoadingOperation, hasErrorForOperation]);

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

  const getOperationMetrics = useCallback((operation: string) => {
    return operationMetrics.get(operation) || null;
  }, [operationMetrics]);

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

  // 🎯 ESTADOS DE CARGA ESPECÍFICOS POR TIPO CON ESTIMACIONES INTELIGENTES
  const addNavigationLoading = useCallback((route: string) => {
    const metrics = getOperationMetrics(`navigation-${route}`);
    const estimatedDuration = metrics?.averageDuration || 2000;
    
    addLoadingState(`navigation-${route}`, 0, {
      type: 'navigation',
      message: `Cargando ${route}...`,
      estimatedDuration,
    });
  }, [addLoadingState, getOperationMetrics]);

  const addUploadLoading = useCallback((fileName: string, fileSize?: number) => {
    // Estimar duración basada en tamaño del archivo (aproximadamente 1MB/segundo)
    const estimatedDuration = fileSize ? Math.max(fileSize / (1024 * 1024) * 1000, 2000) : 10000;
    
    addLoadingState(`upload-${fileName}`, 0, {
      type: 'upload',
      message: `Subiendo ${fileName}...`,
      estimatedDuration,
    });
  }, [addLoadingState]);

  const addProcessingLoading = useCallback((task: string, complexity: 'low' | 'medium' | 'high' = 'medium') => {
    const durationMap = { low: 2000, medium: 5000, high: 10000 };
    const estimatedDuration = durationMap[complexity];
    
    addLoadingState(`processing-${task}`, 0, {
      type: 'processing',
      message: `Procesando ${task}...`,
      estimatedDuration,
    });
  }, [addLoadingState]);

  const addDownloadLoading = useCallback((fileName: string, fileSize?: number) => {
    const estimatedDuration = fileSize ? Math.max(fileSize / (2 * 1024 * 1024) * 1000, 1000) : 5000;
    
    addLoadingState(`download-${fileName}`, 0, {
      type: 'download',
      message: `Descargando ${fileName}...`,
      estimatedDuration,
    });
  }, [addLoadingState]);

  // 🧠 ESTADOS INTELIGENTES CON ANÁLISIS
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

  // 🔄 UTILITY PARA OPERACIONES ASYNC CON TRACKING AVANZADO
  const withLoading = useCallback(async <T>(
    operation: string,
    asyncFn: () => Promise<T>,
    options?: {
      message?: string;
      type?: LoadingState['type'];
      estimatedDuration?: number;
      onProgress?: (progress: number, message?: string) => void;
      retryOnError?: boolean;
      maxRetries?: number;
    }
  ): Promise<T> => {
    let retryCount = 0;
    const maxRetries = options?.maxRetries || 3;

    const executeOperation = async (): Promise<T> => {
      try {
        addLoadingState(operation, 0, options);
        
        // Si hay callback de progreso, configurar mock de progreso
        let progressInterval: NodeJS.Timeout | null = null;
        if (options?.onProgress) {
          let currentProgress = 0;
          progressInterval = setInterval(() => {
            if (currentProgress < 90) {
              currentProgress += Math.random() * 10 + 5; // 5-15% increment
              currentProgress = Math.min(currentProgress, 90);
              updateProgress(operation, currentProgress);
              options.onProgress!(currentProgress);
            }
          }, 500);
        }
        
        const result = await asyncFn();
        
        // Completar progreso
        if (progressInterval) {
          clearInterval(progressInterval);
        }
        updateProgress(operation, 100, 'Completado');
        
        // Pequeño delay para mostrar el 100%
        await new Promise(resolve => setTimeout(resolve, 200));
        
        removeLoadingState(operation, true);
        return result;
        
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
        const errorCategory = (error as any).category || 'unknown';
        const statusCode = (error as any).statusCode;
        
        // Determinar si se puede reintentar
        const canRetry = options?.retryOnError !== false && 
          retryCount < maxRetries &&
          (errorCategory === 'network' || errorCategory === 'server' || statusCode >= 500);
        
        if (canRetry) {
          retryCount++;
          addErrorState(operation, `${errorMessage} (Reintento ${retryCount}/${maxRetries})`, {
            category: errorCategory,
            statusCode,
            canRetry: true,
            retryFn: () => executeOperation(),
            autoRemove: false,
          });
          
          // Esperar antes del reintento (backoff exponencial)
          const delay = Math.min(1000 * Math.pow(2, retryCount - 1), 10000);
          await new Promise(resolve => setTimeout(resolve, delay));
          
          removeErrorState(operation);
          return executeOperation();
        } else {
          addErrorState(operation, errorMessage, {
            category: errorCategory,
            statusCode,
            canRetry: false,
          });
          throw error;
        }
      }
    };

    return executeOperation();
  }, [addLoadingState, updateProgress, removeLoadingState, addErrorState, removeErrorState]);

  // 🧹 CLEANUP AUTOMÁTICO
  useEffect(() => {
    const cleanup = setInterval(() => {
      const now = Date.now();
      
      // Limpiar errores antiguos (más de 5 minutos)
      setErrorStates(prev => prev.filter(error => now - error.timestamp < 300000));
      
      // Limpiar loading states huérfanos (más de 30 segundos sin actualización)
      setLoadingStates(prev => prev.filter(state => 
        !state.startTime || now - state.startTime < 30000
      ));
    }, 60000); // Ejecutar cada minuto

    return () => clearInterval(cleanup);
  }, []);

  return {
    // Estados básicos
    loadingStates,
    errorStates,
    hasAnyLoading,
    
    // Gestión de loading
    addLoadingState,
    removeLoadingState,
    updateProgress,
    updateLoadingMessage,
    isLoadingOperation,
    getLoadingState,
    
    // Gestión de errores
    addErrorState,
    removeErrorState,
    clearAllErrors,
    retryOperation,
    hasErrorForOperation,
    
    // Estados específicos
    addNavigationLoading,
    addUploadLoading,
    addProcessingLoading,
    addDownloadLoading,
    
    // Análisis y métricas
    getOperationStatus,
    getLoadingMetrics,
    getOperationMetrics,
    getGlobalMetrics,
    getLoadingsByType,
    getCriticalLoadings,
    getRecentErrors,
    getErrorsByCategory,
    getRetriableErrors,
    
    // Utilidades
    withLoading,
  };
}; 