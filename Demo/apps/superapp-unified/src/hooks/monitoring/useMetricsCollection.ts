import { useCallback, useRef } from 'react';

// Interfaces para métricas de rendimiento
export interface PerformanceMetrics {
  pageLoadTime: number;
  apiResponseTime: number;
  cacheHitRate: number;
  prefetchSuccess: number;
  optimisticUpdateSuccess: number;
  errorRate: number;
  timestamp: number;
}

export interface QueryPerformance {
  queryKey: string;
  duration: number;
  cacheHit: boolean;
  prefetched: boolean;
  timestamp: number;
  endpoint?: string;
  method?: string;
  statusCode?: number;
}

export interface UserInteraction {
  type: 'navigation' | 'click' | 'scroll' | 'hover' | 'focus' | 'input';
  target: string;
  timestamp: number;
  duration?: number;
  metadata?: Record<string, any>;
}

export interface ApiMetrics {
  endpoint: string;
  method: string;
  duration: number;
  statusCode: number;
  success: boolean;
  timestamp: number;
  retryCount?: number;
  cacheHit?: boolean;
}

export interface ErrorMetrics {
  type: 'api' | 'query' | 'mutation' | 'component' | 'network';
  message: string;
  category: string;
  statusCode?: number;
  endpoint?: string;
  timestamp: number;
  resolved?: boolean;
}

/**
 * 📊 Hook para Colección Básica de Métricas
 * Maneja la recolección y almacenamiento de métricas sin dependencias circulares
 */
export const useMetricsCollection = () => {
  const metricsRef = useRef<PerformanceMetrics[]>([]);
  const queryMetricsRef = useRef<QueryPerformance[]>([]);
  const interactionsRef = useRef<UserInteraction[]>([]);
  const apiMetricsRef = useRef<ApiMetrics[]>([]);
  const errorMetricsRef = useRef<ErrorMetrics[]>([]);
  const pageStartTime = useRef<number>(Date.now());

  /**
   * 🚀 Registrar métricas de queries React Query
   */
  const recordQueryPerformance = useCallback(
    (
      queryKey: string,
      duration: number,
      cacheHit: boolean,
      prefetched: boolean = false,
      metadata?: { endpoint?: string; method?: string; statusCode?: number }
    ) => {
      const queryMetric: QueryPerformance = {
        queryKey,
        duration,
        cacheHit,
        prefetched,
        timestamp: Date.now(),
        endpoint: metadata?.endpoint,
        method: metadata?.method,
        statusCode: metadata?.statusCode,
      };

      queryMetricsRef.current.push(queryMetric);

      // Limitar historia de métricas a las últimas 100 queries
      if (queryMetricsRef.current.length > 100) {
        queryMetricsRef.current = queryMetricsRef.current.slice(-100);
      }

      if (import.meta.env.DEV) {
        console.log('🔍 Query Performance:', queryMetric);
      }
    },
    []
  );

  /**
   * 🌐 Registrar métricas de API
   */
  const recordApiMetrics = useCallback(
    (
      endpoint: string,
      method: string,
      duration: number,
      statusCode: number,
      success: boolean,
      metadata?: { retryCount?: number; cacheHit?: boolean }
    ) => {
      const apiMetric: ApiMetrics = {
        endpoint,
        method,
        duration,
        statusCode,
        success,
        timestamp: Date.now(),
        retryCount: metadata?.retryCount,
        cacheHit: metadata?.cacheHit,
      };

      apiMetricsRef.current.push(apiMetric);

      // Limitar historia a las últimas 200 llamadas API
      if (apiMetricsRef.current.length > 200) {
        apiMetricsRef.current = apiMetricsRef.current.slice(-200);
      }

      if (import.meta.env.DEV) {
        console.log('🌐 API Performance:', apiMetric);
      }
    },
    []
  );

  /**
   * 🚨 Registrar métricas de errores
   */
  const recordErrorMetrics = useCallback(
    (
      type: ErrorMetrics['type'],
      message: string,
      category: string,
      metadata?: { statusCode?: number; endpoint?: string; resolved?: boolean }
    ) => {
      const errorMetric: ErrorMetrics = {
        type,
        message,
        category,
        timestamp: Date.now(),
        statusCode: metadata?.statusCode,
        endpoint: metadata?.endpoint,
        resolved: metadata?.resolved || false,
      };

      errorMetricsRef.current.push(errorMetric);

      // Limitar historia a los últimos 100 errores
      if (errorMetricsRef.current.length > 100) {
        errorMetricsRef.current = errorMetricsRef.current.slice(-100);
      }

      if (import.meta.env.DEV) {
        console.log('🚨 Error Metrics:', errorMetric);
      }
    },
    []
  );

  /**
   * 👆 Registrar interacciones del usuario
   */
  const recordUserInteraction = useCallback(
    (
      type: UserInteraction['type'],
      target: string,
      duration?: number,
      metadata?: Record<string, any>
    ) => {
      const interaction: UserInteraction = {
        type,
        target,
        timestamp: Date.now(),
        duration,
        metadata,
      };

      interactionsRef.current.push(interaction);

      // Limitar historia de interacciones a las últimas 100
      if (interactionsRef.current.length > 100) {
        interactionsRef.current = interactionsRef.current.slice(-100);
      }
    },
    []
  );

  /**
   * 📈 Registrar métricas de carga de página
   */
  const recordPageLoad = useCallback(() => {
    const loadTime = Date.now() - pageStartTime.current;

    // Obtener métricas de Web Vitals si están disponibles
    if ('performance' in window && 'getEntriesByType' in performance) {
      const navigation = performance.getEntriesByType(
        'navigation'
      )[0] as PerformanceNavigationTiming;

      const metrics: PerformanceMetrics = {
        pageLoadTime: loadTime,
        apiResponseTime: 0, // Se actualizará con métricas de API
        cacheHitRate: 0, // Se calculará basado en queries
        prefetchSuccess: 0, // Se actualizará con prefetch stats
        optimisticUpdateSuccess: 0, // Se actualizará con optimistic updates
        errorRate: 0, // Se calculará basado en errores
        timestamp: Date.now(),
      };

      metricsRef.current.push(metrics);

      // Limitar historial a las últimas 50 métricas
      if (metricsRef.current.length > 50) {
        metricsRef.current = metricsRef.current.slice(-50);
      }

      if (import.meta.env.DEV) {
        console.log('📊 Page Performance:', {
          loadTime,
          DOMContentLoaded:
            navigation.domContentLoadedEventEnd -
            navigation.domContentLoadedEventStart,
          firstContentfulPaint:
            navigation.loadEventEnd - navigation.loadEventStart,
        });
      }
    }
  }, []);

  return {
    // Recording functions
    recordPageLoad,
    recordQueryPerformance,
    recordApiMetrics,
    recordErrorMetrics,
    recordUserInteraction,

    // Data access
    queryMetrics: queryMetricsRef.current,
    apiMetrics: apiMetricsRef.current,
    errorMetrics: errorMetricsRef.current,
    userInteractions: interactionsRef.current,
    performanceMetrics: metricsRef.current,
  };
}; 