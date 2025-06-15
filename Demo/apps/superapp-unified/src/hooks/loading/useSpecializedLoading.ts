import { useCallback } from 'react';
import type { LoadingState } from './useLoadingCore';

interface SpecializedLoadingProps {
  addLoadingState: (
    operation: string, 
    progress?: number,
    options?: {
      message?: string;
      type?: LoadingState['type'];
      estimatedDuration?: number;
    }
  ) => void;
  getOperationMetrics: (operation: string) => any;
}

/**
 * 🎯 Hook de Loading States Especializados
 * Proporciona funciones específicas por tipo de operación
 */
export const useSpecializedLoading = ({
  addLoadingState,
  getOperationMetrics
}: SpecializedLoadingProps) => {

  // 🧭 Estados de carga específicos por tipo con estimaciones inteligentes
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

  return {
    // Estados especializados
    addNavigationLoading,
    addUploadLoading,
    addProcessingLoading,
    addDownloadLoading,
  };
}; 