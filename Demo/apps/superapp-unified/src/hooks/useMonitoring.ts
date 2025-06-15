import { useLocation } from 'react-router-dom';
import { useMetricsCollection } from './monitoring/useMetricsCollection';
import { useMetricsAnalysis } from './monitoring/useMetricsAnalysis';
import { useUserEvents, useErrorTracking, usePerformanceTracking, useEngagementTracking } from './monitoring/useEventTracking';
import { useEventListeners, useMetricsCleanup, usePageViewTracking } from './monitoring/useEventListeners';

/**
 * 📊 Hook Principal de Monitoreo de Performance Optimizado
 * Combina todas las funcionalidades de monitoreo sin dependencias circulares
 */
export const usePerformanceMonitoring = () => {
  const location = useLocation();
  
  // Módulos especializados
  const metricsCollection = useMetricsCollection();
  const metricsAnalysis = useMetricsAnalysis();

  // Configurar event listeners con cleanup automático
  useEventListeners({
    recordErrorMetrics: metricsCollection.recordErrorMetrics,
    recordQueryPerformance: metricsCollection.recordQueryPerformance,
    recordApiMetrics: metricsCollection.recordApiMetrics,
    recordUserInteraction: metricsCollection.recordUserInteraction,
  });

  // Configurar cleanup automático de métricas
  useMetricsCleanup(
    { current: metricsCollection.queryMetrics } as React.MutableRefObject<any[]>,
    { current: metricsCollection.apiMetrics } as React.MutableRefObject<any[]>,
    { current: metricsCollection.errorMetrics } as React.MutableRefObject<any[]>,
    { current: metricsCollection.userInteractions } as React.MutableRefObject<any[]>
  );

  // Funciones de análisis que usan los datos actuales
  const getAggregatedMetrics = () => {
    return metricsAnalysis.getAggregatedMetrics(
      metricsCollection.queryMetrics,
      metricsCollection.apiMetrics,
      metricsCollection.errorMetrics
    );
  };

  const analyzePerformancePatterns = () => {
    const metrics = getAggregatedMetrics();
    return metricsAnalysis.analyzePerformancePatterns(metrics);
  };

  const getPerformanceTrends = () => {
    return metricsAnalysis.getPerformanceTrends(metricsCollection.performanceMetrics);
  };

  return {
    // Funciones de recolección
    recordPageLoad: metricsCollection.recordPageLoad,
    recordQueryPerformance: metricsCollection.recordQueryPerformance,
    recordApiMetrics: metricsCollection.recordApiMetrics,
    recordErrorMetrics: metricsCollection.recordErrorMetrics,
    recordUserInteraction: metricsCollection.recordUserInteraction,

    // Funciones de análisis
    getAggregatedMetrics,
    analyzePerformancePatterns,
    getPerformanceTrends,

    // Datos en tiempo real
    queryMetrics: metricsCollection.queryMetrics,
    apiMetrics: metricsCollection.apiMetrics,
    errorMetrics: metricsCollection.errorMetrics,
    userInteractions: metricsCollection.userInteractions,
  };
};

/**
 * 📊 Hook de tracking original (mantenido para compatibilidad)
 * ✅ FIXED: Removed recursive call and simplified implementation
 */
export const usePageViewTracking = () => {
  // Simple implementation without recursion
  // The actual page view tracking is handled by useEventListeners
  return;
};

/**
 * 🎯 Hook principal que combina toda la funcionalidad de monitoreo
 * Proporciona una interfaz unificada para todas las funciones de tracking
 */
export const useMonitoring = () => {
  const userEvents = useUserEvents();
  const errorTracking = useErrorTracking();
  const performanceTracking = usePerformanceTracking();
  const engagementTracking = useEngagementTracking();

  return {
    ...userEvents,
    ...errorTracking,
    ...performanceTracking,
    ...engagementTracking,
  };
};

// Re-exportar hooks individuales para compatibilidad
export { useUserEvents } from './monitoring/useEventTracking';
export { useErrorTracking } from './monitoring/useEventTracking';
export { usePerformanceTracking } from './monitoring/useEventTracking';
export { useEngagementTracking } from './monitoring/useEventTracking';

// Re-exportar tipos para uso externo
export type {
  PerformanceMetrics,
  QueryPerformance,
  UserInteraction,
  ApiMetrics,
  ErrorMetrics,
} from './monitoring/useMetricsCollection';
