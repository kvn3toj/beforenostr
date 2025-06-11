import { useCallback, useEffect, useRef } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';
import { reportEvent, reportError } from '../lib/monitoring';

// Interfaces para métricas de rendimiento
interface PerformanceMetrics {
  pageLoadTime: number;
  apiResponseTime: number;
  cacheHitRate: number;
  prefetchSuccess: number;
  optimisticUpdateSuccess: number;
  errorRate: number;
  timestamp: number;
}

interface QueryPerformance {
  queryKey: string;
  duration: number;
  cacheHit: boolean;
  prefetched: boolean;
  timestamp: number;
  endpoint?: string;
  method?: string;
  statusCode?: number;
}

interface UserInteraction {
  type: 'navigation' | 'click' | 'scroll' | 'hover' | 'focus' | 'input';
  target: string;
  timestamp: number;
  duration?: number;
  metadata?: Record<string, any>;
}

interface ApiMetrics {
  endpoint: string;
  method: string;
  duration: number;
  statusCode: number;
  success: boolean;
  timestamp: number;
  retryCount?: number;
  cacheHit?: boolean;
}

interface ErrorMetrics {
  type: 'api' | 'query' | 'mutation' | 'component' | 'network';
  message: string;
  category: string;
  statusCode?: number;
  endpoint?: string;
  timestamp: number;
  resolved?: boolean;
}

/**
 * 📊 Hook para Monitoreo de Performance Optimizado
 * Rastrea métricas específicas de las optimizaciones implementadas
 */
export const usePerformanceMonitoring = () => {
  const location = useLocation();
  const navigationType = useNavigationType();
  const metricsRef = useRef<PerformanceMetrics[]>([]);
  const queryMetricsRef = useRef<QueryPerformance[]>([]);
  const interactionsRef = useRef<UserInteraction[]>([]);
  const apiMetricsRef = useRef<ApiMetrics[]>([]);
  const errorMetricsRef = useRef<ErrorMetrics[]>([]);
  const pageStartTime = useRef<number>(Date.now());

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

      // Enviar métricas a analytics si está configurado
      if (import.meta.env.DEV) {
        console.log('📊 Page Performance:', {
          route: location.pathname,
          loadTime,
          navigationType,
          DOMContentLoaded:
            navigation.domContentLoadedEventEnd -
            navigation.domContentLoadedEventStart,
          firstContentfulPaint:
            navigation.loadEventEnd - navigation.loadEventStart,
        });
      }
    }
  }, [location.pathname, navigationType]);

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
   * 📊 Calcular métricas agregadas
   */
  const getAggregatedMetrics = useCallback(() => {
    const recentQueries = queryMetricsRef.current.slice(-20); // Últimas 20 queries
    const recentApis = apiMetricsRef.current.slice(-20); // Últimas 20 APIs
    const recentErrors = errorMetricsRef.current.slice(-10); // Últimos 10 errores

    const totalQueries = recentQueries.length;
    const totalApis = recentApis.length;
    const totalErrors = recentErrors.length;

    if (totalQueries === 0 && totalApis === 0) {
      return {
        avgQueryTime: 0,
        avgApiTime: 0,
        cacheHitRate: 0,
        prefetchRate: 0,
        successRate: 0,
        errorRate: 0,
        totalQueries: 0,
        totalApis: 0,
        totalErrors: 0,
      };
    }

    // Métricas de queries
    const avgQueryTime =
      totalQueries > 0
        ? recentQueries.reduce((sum, q) => sum + q.duration, 0) / totalQueries
        : 0;
    const cacheHits = recentQueries.filter((q) => q.cacheHit).length;
    const prefetched = recentQueries.filter((q) => q.prefetched).length;
    const cacheHitRate =
      totalQueries > 0 ? (cacheHits / totalQueries) * 100 : 0;
    const prefetchRate =
      totalQueries > 0 ? (prefetched / totalQueries) * 100 : 0;

    // Métricas de APIs
    const avgApiTime =
      totalApis > 0
        ? recentApis.reduce((sum, a) => sum + a.duration, 0) / totalApis
        : 0;
    const successfulApis = recentApis.filter((a) => a.success).length;
    const successRate = totalApis > 0 ? (successfulApis / totalApis) * 100 : 0;

    // Métricas de errores
    const errorRate =
      totalErrors > 0 ? (totalErrors / (totalQueries + totalApis)) * 100 : 0;

    return {
      avgQueryTime: Math.round(avgQueryTime),
      avgApiTime: Math.round(avgApiTime),
      cacheHitRate: Math.round(cacheHitRate),
      prefetchRate: Math.round(prefetchRate),
      successRate: Math.round(successRate),
      errorRate: Math.round(errorRate),
      totalQueries,
      totalApis,
      totalErrors,
    };
  }, []);

  /**
   * 🎯 Detectar patrones de rendimiento
   */
  const analyzePerformancePatterns = useCallback(() => {
    const metrics = getAggregatedMetrics();
    const patterns = [];

    // Detectar problemas de rendimiento
    if (metrics.avgQueryTime > 1000) {
      patterns.push({
        type: 'slow-queries',
        message: `Queries promedio de ${metrics.avgQueryTime}ms (>1s)`,
        severity: 'warning' as const,
        recommendation: 'Considerar optimizar queries o implementar más cache',
      });
    }

    if (metrics.avgApiTime > 2000) {
      patterns.push({
        type: 'slow-apis',
        message: `APIs promedio de ${metrics.avgApiTime}ms (>2s)`,
        severity: 'warning' as const,
        recommendation: 'Verificar latencia de red o optimizar endpoints',
      });
    }

    if (metrics.cacheHitRate < 50) {
      patterns.push({
        type: 'low-cache-hit',
        message: `Cache hit rate bajo: ${metrics.cacheHitRate}% (<50%)`,
        severity: 'warning' as const,
        recommendation: 'Revisar estrategias de cache y staleTime',
      });
    }

    if (metrics.prefetchRate < 20) {
      patterns.push({
        type: 'low-prefetch',
        message: `Prefetch rate bajo: ${metrics.prefetchRate}% (<20%)`,
        severity: 'info' as const,
        recommendation: 'Implementar más prefetching inteligente',
      });
    }

    if (metrics.errorRate > 10) {
      patterns.push({
        type: 'high-error-rate',
        message: `Tasa de errores alta: ${metrics.errorRate}% (>10%)`,
        severity: 'error' as const,
        recommendation: 'Investigar y resolver errores frecuentes',
      });
    }

    if (metrics.successRate < 90) {
      patterns.push({
        type: 'low-success-rate',
        message: `Tasa de éxito baja: ${metrics.successRate}% (<90%)`,
        severity: 'warning' as const,
        recommendation: 'Mejorar manejo de errores y retry logic',
      });
    }

    // Detectar optimizaciones exitosas
    if (metrics.cacheHitRate > 80) {
      patterns.push({
        type: 'excellent-caching',
        message: `Excelente cache hit rate: ${metrics.cacheHitRate}%`,
        severity: 'success' as const,
        recommendation: 'Mantener estrategia actual de cache',
      });
    }

    if (metrics.avgQueryTime < 200) {
      patterns.push({
        type: 'fast-queries',
        message: `Queries rápidas: ${metrics.avgQueryTime}ms promedio`,
        severity: 'success' as const,
        recommendation: 'Excelente performance de queries',
      });
    }

    if (metrics.prefetchRate > 60) {
      patterns.push({
        type: 'excellent-prefetch',
        message: `Excelente prefetch rate: ${metrics.prefetchRate}%`,
        severity: 'success' as const,
        recommendation: 'Estrategia de prefetching muy efectiva',
      });
    }

    return patterns;
  }, [getAggregatedMetrics]);

  /**
   * 📈 Obtener tendencias de performance
   */
  const getPerformanceTrends = useCallback(() => {
    const recentMetrics = metricsRef.current.slice(-10);
    if (recentMetrics.length < 2) return null;

    const first = recentMetrics[0];
    const last = recentMetrics[recentMetrics.length - 1];

    return {
      pageLoadTime: {
        trend:
          last.pageLoadTime > first.pageLoadTime ? 'increasing' : 'decreasing',
        change: Math.abs(last.pageLoadTime - first.pageLoadTime),
        percentage:
          ((last.pageLoadTime - first.pageLoadTime) / first.pageLoadTime) * 100,
      },
      cacheHitRate: {
        trend:
          last.cacheHitRate > first.cacheHitRate ? 'increasing' : 'decreasing',
        change: Math.abs(last.cacheHitRate - first.cacheHitRate),
        percentage:
          first.cacheHitRate > 0
            ? ((last.cacheHitRate - first.cacheHitRate) / first.cacheHitRate) *
              100
            : 0,
      },
      errorRate: {
        trend: last.errorRate > first.errorRate ? 'increasing' : 'decreasing',
        change: Math.abs(last.errorRate - first.errorRate),
        percentage:
          first.errorRate > 0
            ? ((last.errorRate - first.errorRate) / first.errorRate) * 100
            : 0,
      },
    };
  }, []);

  /**
   * 🎯 Configurar listeners de eventos para tracking automático
   */
  useEffect(() => {
    // Listener para errores de API
    const handleApiError = (event: CustomEvent) => {
      const { category, statusCode, endpoint, message } = event.detail;
      recordErrorMetrics('api', message, category, { statusCode, endpoint });
    };

    // Listener para métricas de queries
    const handleQueryMetrics = (event: CustomEvent) => {
      const { queryKey, duration, cacheHit, timestamp } = event.detail;
      recordQueryPerformance(queryKey.join('-'), duration, cacheHit);
    };

    // Listener para métricas de API
    const handleApiMetrics = (event: CustomEvent) => {
      const { endpoint, method, duration, statusCode, success } = event.detail;
      recordApiMetrics(endpoint, method, duration, statusCode, success);
    };

    // Listener para interacciones de usuario
    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const className =
        typeof target.className === 'string' ? target.className : '';
      const targetInfo =
        target.tagName +
        (target.id ? `#${target.id}` : '') +
        (className ? `.${className.split(' ')[0]}` : '');
      recordUserInteraction('click', targetInfo);
    };

    const handleScroll = () => {
      const scrollPercentage =
        (window.scrollY /
          (document.documentElement.scrollHeight - window.innerHeight)) *
        100;
      recordUserInteraction('scroll', window.location.pathname, undefined, {
        scrollPercentage: Math.round(scrollPercentage),
      });
    };

    // Throttle scroll events
    let scrollTimeout: NodeJS.Timeout;
    const throttledScroll = () => {
      if (!scrollTimeout) {
        scrollTimeout = setTimeout(() => {
          handleScroll();
          scrollTimeout = null as any;
        }, 1000); // Throttle a 1 segundo
      }
    };

    // Agregar listeners
    window.addEventListener('api-error', handleApiError as EventListener);
    window.addEventListener(
      'query-success',
      handleQueryMetrics as EventListener
    );
    window.addEventListener(
      'api-request-complete',
      handleApiMetrics as EventListener
    );
    document.addEventListener('click', handleClick);
    window.addEventListener('scroll', throttledScroll);

    // Cleanup
    return () => {
      window.removeEventListener('api-error', handleApiError as EventListener);
      window.removeEventListener(
        'query-success',
        handleQueryMetrics as EventListener
      );
      window.removeEventListener(
        'api-request-complete',
        handleApiMetrics as EventListener
      );
      document.removeEventListener('click', handleClick);
      window.removeEventListener('scroll', throttledScroll);
      if (scrollTimeout) clearTimeout(scrollTimeout);
    };
  }, [
    recordErrorMetrics,
    recordQueryPerformance,
    recordApiMetrics,
    recordUserInteraction,
  ]);

  /**
   * 🧹 Cleanup automático de métricas antiguas
   */
  useEffect(() => {
    const cleanup = setInterval(
      () => {
        const now = Date.now();
        const maxAge = 30 * 60 * 1000; // 30 minutos

        // Limpiar métricas antiguas
        queryMetricsRef.current = queryMetricsRef.current.filter(
          (m) => now - m.timestamp < maxAge
        );
        apiMetricsRef.current = apiMetricsRef.current.filter(
          (m) => now - m.timestamp < maxAge
        );
        errorMetricsRef.current = errorMetricsRef.current.filter(
          (m) => now - m.timestamp < maxAge
        );
        interactionsRef.current = interactionsRef.current.filter(
          (m) => now - m.timestamp < maxAge
        );
      },
      5 * 60 * 1000
    ); // Ejecutar cada 5 minutos

    return () => clearInterval(cleanup);
  }, []);

  return {
    recordPageLoad,
    recordQueryPerformance,
    recordApiMetrics,
    recordErrorMetrics,
    recordUserInteraction,
    getAggregatedMetrics,
    analyzePerformancePatterns,
    getPerformanceTrends,

    // Datos en tiempo real
    queryMetrics: queryMetricsRef.current,
    apiMetrics: apiMetricsRef.current,
    errorMetrics: errorMetricsRef.current,
    userInteractions: interactionsRef.current,
  };
};

/**
 * 📊 Hook de tracking original (mantenido para compatibilidad)
 */
export const usePageViewTracking = () => {
  const location = useLocation();
  const { recordUserInteraction } = usePerformanceMonitoring();

  useEffect(() => {
    // Track page view
    if (import.meta.env.DEV) {
      console.log('📄 Page View:', location.pathname);
    }

    // Registrar navegación como interacción
    recordUserInteraction('navigation', location.pathname);

    // Aquí se puede integrar con Google Analytics u otros servicios
    // gtag('config', 'GA_MEASUREMENT_ID', {
    //   page_path: location.pathname,
    // });
  }, [location, recordUserInteraction]);
};

// Hook para reportar eventos de usuario
export const useUserEvents = () => {
  const reportUserAction = useCallback(
    (action: string, properties?: Record<string, any>) => {
      reportEvent(`user_${action}`, {
        timestamp: new Date().toISOString(),
        user_agent: navigator.userAgent,
        viewport_width: window.innerWidth,
        viewport_height: window.innerHeight,
        ...properties,
      });
    },
    []
  );

  const reportButtonClick = useCallback(
    (buttonName: string, section?: string) => {
      reportUserAction('button_click', {
        button_name: buttonName,
        section: section || 'unknown',
      });
    },
    [reportUserAction]
  );

  const reportFormSubmission = useCallback(
    (formName: string, success: boolean, errors?: string[]) => {
      reportUserAction('form_submission', {
        form_name: formName,
        success,
        errors: errors?.join(', '),
      });
    },
    [reportUserAction]
  );

  const reportModalAction = useCallback(
    (modalName: string, action: 'open' | 'close' | 'submit') => {
      reportUserAction('modal_action', {
        modal_name: modalName,
        action,
      });
    },
    [reportUserAction]
  );

  const reportSearchAction = useCallback(
    (query: string, resultsCount: number, section: string) => {
      reportUserAction('search', {
        search_query: query,
        results_count: resultsCount,
        search_section: section,
      });
    },
    [reportUserAction]
  );

  return {
    reportUserAction,
    reportButtonClick,
    reportFormSubmission,
    reportModalAction,
    reportSearchAction,
  };
};

// Hook para reportar errores de forma simplificada
export const useErrorTracking = () => {
  const reportAsyncError = useCallback(
    async (asyncFn: () => Promise<any>, context?: Record<string, any>) => {
      try {
        return await asyncFn();
      } catch (error) {
        reportError(error as Error, {
          ...context,
          error_type: 'async_operation',
          timestamp: new Date().toISOString(),
        });
        throw error; // Re-throw para que el componente pueda manejar el error
      }
    },
    []
  );

  const reportApiError = useCallback(
    (error: Error, endpoint: string, method: string, statusCode?: number) => {
      reportError(error, {
        error_type: 'api_request',
        api_endpoint: endpoint,
        http_method: method,
        status_code: statusCode,
        timestamp: new Date().toISOString(),
      });
    },
    []
  );

  const reportUIError = useCallback(
    (error: Error, component: string, action?: string) => {
      reportError(error, {
        error_type: 'ui_interaction',
        component_name: component,
        user_action: action,
        timestamp: new Date().toISOString(),
      });
    },
    []
  );

  return {
    reportAsyncError,
    reportApiError,
    reportUIError,
  };
};

// Hook para monitorear performance de componentes
export const usePerformanceTracking = () => {
  const trackComponentRender = useCallback((componentName: string) => {
    const startTime = performance.now();

    return () => {
      const duration = performance.now() - startTime;

      if (duration > 100) {
        // Solo reportar renders lentos (>100ms)
        reportEvent('slow_component_render', {
          component_name: componentName,
          render_duration: Math.round(duration),
          timestamp: new Date().toISOString(),
        });
      }
    };
  }, []);

  const trackAsyncOperation = useCallback(
    async (
      operationName: string,
      asyncFn: () => Promise<any>,
      threshold: number = 1000
    ) => {
      const startTime = performance.now();

      try {
        const result = await asyncFn();
        const duration = performance.now() - startTime;

        if (duration > threshold) {
          reportEvent('slow_async_operation', {
            operation_name: operationName,
            duration: Math.round(duration),
            success: true,
            timestamp: new Date().toISOString(),
          });
        }

        return result;
      } catch (error) {
        const duration = performance.now() - startTime;

        reportEvent('failed_async_operation', {
          operation_name: operationName,
          duration: Math.round(duration),
          success: false,
          error_message: (error as Error).message,
          timestamp: new Date().toISOString(),
        });

        throw error;
      }
    },
    []
  );

  return {
    trackComponentRender,
    trackAsyncOperation,
  };
};

// Hook para rastrear engagement del usuario
export const useEngagementTracking = () => {
  const trackSessionStart = useCallback(() => {
    reportEvent('session_start', {
      timestamp: new Date().toISOString(),
      user_agent: navigator.userAgent,
      screen_resolution: `${screen.width}x${screen.height}`,
      viewport_size: `${window.innerWidth}x${window.innerHeight}`,
    });
  }, []);

  const trackFeatureUsage = useCallback(
    (featureName: string, details?: Record<string, any>) => {
      reportEvent('feature_usage', {
        feature_name: featureName,
        timestamp: new Date().toISOString(),
        ...details,
      });
    },
    []
  );

  const trackScrollDepth = useCallback(
    (percentage: number, pagePath: string) => {
      reportEvent('scroll_depth', {
        scroll_percentage: percentage,
        page_path: pagePath,
        timestamp: new Date().toISOString(),
      });
    },
    []
  );

  const trackTimeOnPage = useCallback((timeSpent: number, pagePath: string) => {
    reportEvent('time_on_page', {
      time_spent_seconds: Math.round(timeSpent / 1000),
      page_path: pagePath,
      timestamp: new Date().toISOString(),
    });
  }, []);

  return {
    trackSessionStart,
    trackFeatureUsage,
    trackScrollDepth,
    trackTimeOnPage,
  };
};

// Hook principal que combina toda la funcionalidad de monitoreo
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
