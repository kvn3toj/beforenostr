import { useLoadingCore } from './loading/useLoadingCore';
import { useErrorManagement } from './loading/useErrorManagement';
import { useLoadingAnalysis } from './loading/useLoadingAnalysis';
import { useSpecializedLoading } from './loading/useSpecializedLoading';
import { useLoadingUtilities } from './loading/useLoadingUtilities';

// Re-exportar tipos para compatibilidad
export type { LoadingState, ErrorState, OperationMetrics } from './loading/useLoadingCore';

/**
 * 🔄 Hook Principal de Loading States Refactorizado
 * Combina todos los módulos especializados sin dependencias circulares
 */
export const useLoadingStates = () => {
  // 🔧 Módulo core con funciones básicas
  const loadingCore = useLoadingCore();

  // 🚨 Módulo de gestión de errores
  const errorManagement = useErrorManagement({
    errorStates: loadingCore.errorStates,
    setErrorStates: loadingCore.setErrorStates,
    setLoadingStates: loadingCore.setLoadingStates,
    setOperationMetrics: loadingCore.setOperationMetrics,
  });

  // 📊 Módulo de análisis y métricas
  const loadingAnalysis = useLoadingAnalysis({
    loadingStates: loadingCore.loadingStates,
    errorStates: loadingCore.errorStates,
    operationMetrics: loadingCore.operationMetrics,
    isLoadingOperation: loadingCore.isLoadingOperation,
    hasErrorForOperation: errorManagement.hasErrorForOperation,
  });

  // 🎯 Módulo de loading states especializados
  const specializedLoading = useSpecializedLoading({
    addLoadingState: loadingCore.addLoadingState,
    getOperationMetrics: loadingCore.getOperationMetrics,
  });

  // 🔄 Módulo de utilidades avanzadas con cleanup
  const loadingUtilities = useLoadingUtilities({
    addLoadingState: loadingCore.addLoadingState,
    updateProgress: loadingCore.updateProgress,
    removeLoadingState: errorManagement.removeLoadingState,
    addErrorState: errorManagement.addErrorState,
    removeErrorState: errorManagement.removeErrorState,
    setErrorStates: loadingCore.setErrorStates,
    setLoadingStates: loadingCore.setLoadingStates,
  });

  return {
    // Estados básicos
    loadingStates: loadingCore.loadingStates,
    errorStates: loadingCore.errorStates,
    hasAnyLoading: loadingCore.hasAnyLoading,
    
    // Gestión de loading
    addLoadingState: loadingCore.addLoadingState,
    removeLoadingState: errorManagement.removeLoadingState,
    updateProgress: loadingCore.updateProgress,
    updateLoadingMessage: loadingCore.updateLoadingMessage,
    isLoadingOperation: loadingCore.isLoadingOperation,
    getLoadingState: loadingCore.getLoadingState,
    
    // Gestión de errores
    addErrorState: errorManagement.addErrorState,
    removeErrorState: errorManagement.removeErrorState,
    clearAllErrors: errorManagement.clearAllErrors,
    retryOperation: errorManagement.retryOperation,
    hasErrorForOperation: errorManagement.hasErrorForOperation,
    
    // Estados específicos
    addNavigationLoading: specializedLoading.addNavigationLoading,
    addUploadLoading: specializedLoading.addUploadLoading,
    addProcessingLoading: specializedLoading.addProcessingLoading,
    addDownloadLoading: specializedLoading.addDownloadLoading,
    
    // Análisis y métricas
    getOperationStatus: loadingAnalysis.getOperationStatus,
    getLoadingMetrics: loadingCore.getLoadingMetrics,
    getOperationMetrics: loadingCore.getOperationMetrics,
    getGlobalMetrics: loadingAnalysis.getGlobalMetrics,
    getLoadingsByType: loadingAnalysis.getLoadingsByType,
    getCriticalLoadings: loadingAnalysis.getCriticalLoadings,
    getRecentErrors: loadingAnalysis.getRecentErrors,
    getErrorsByCategory: loadingAnalysis.getErrorsByCategory,
    getRetriableErrors: loadingAnalysis.getRetriableErrors,
    
    // Utilidades
    withLoading: loadingUtilities.withLoading,
  };
}; 