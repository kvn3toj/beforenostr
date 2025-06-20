import { useCallback, useEffect } from 'react';
import type { LoadingState, ErrorState } from './useLoadingCore';

interface LoadingUtilitiesProps {
  addLoadingState: (
    operation: string, 
    progress?: number,
    options?: {
      message?: string;
      type?: LoadingState['type'];
      estimatedDuration?: number;
    }
  ) => void;
  updateProgress: (operation: string, progress: number, message?: string) => void;
  removeLoadingState: (operation: string, success?: boolean) => void;
  addErrorState: (
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
  ) => void;
  removeErrorState: (operation: string) => void;
  setErrorStates: React.Dispatch<React.SetStateAction<ErrorState[]>>;
  setLoadingStates: React.Dispatch<React.SetStateAction<LoadingState[]>>;
}

/**
 * 🔄 Hook de Utilidades Avanzadas de Loading
 * Incluye operaciones async con tracking y cleanup effects obligatorios
 */
export const useLoadingUtilities = ({
  addLoadingState,
  updateProgress,
  removeLoadingState,
  addErrorState,
  removeErrorState,
  setErrorStates,
  setLoadingStates
}: LoadingUtilitiesProps) => {

  // 🔄 Utility para operaciones async con tracking avanzado
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

  // 🧹 CLEANUP AUTOMÁTICO - OBLIGATORIO
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

    return () => {
      // ✅ CLEANUP OBLIGATORIO
      clearInterval(cleanup);
    };
  }, [setErrorStates, setLoadingStates]);

  return {
    // Utilidades avanzadas
    withLoading,
  };
}; 