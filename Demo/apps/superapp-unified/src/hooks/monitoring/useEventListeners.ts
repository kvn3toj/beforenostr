import { useEffect, useRef } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';
import type { UserInteraction } from './useMetricsCollection';

interface EventListenersProps {
  recordErrorMetrics: (
    type: 'api' | 'query' | 'mutation' | 'component' | 'network',
    message: string,
    category: string,
    metadata?: { statusCode?: number; endpoint?: string; resolved?: boolean }
  ) => void;
  recordQueryPerformance: (
    queryKey: string,
    duration: number,
    cacheHit: boolean,
    prefetched?: boolean,
    metadata?: { endpoint?: string; method?: string; statusCode?: number }
  ) => void;
  recordApiMetrics: (
    endpoint: string,
    method: string,
    duration: number,
    statusCode: number,
    success: boolean,
    metadata?: { retryCount?: number; cacheHit?: boolean }
  ) => void;
  recordUserInteraction: (
    type: UserInteraction['type'],
    target: string,
    duration?: number,
    metadata?: Record<string, any>
  ) => void;
}

/**
 * 🎯 Hook para Configurar Event Listeners con Cleanup Obligatorio
 * Maneja todos los event listeners con cleanup effects apropiados
 */
export const useEventListeners = ({
  recordErrorMetrics,
  recordQueryPerformance,
  recordApiMetrics,
  recordUserInteraction,
}: EventListenersProps) => {
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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

    // Throttle scroll events con cleanup obligatorio
    const throttledScroll = () => {
      if (!scrollTimeoutRef.current) {
        scrollTimeoutRef.current = setTimeout(() => {
          handleScroll();
          scrollTimeoutRef.current = null;
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

    // Cleanup obligatorio
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
      
      // Cleanup del timeout de scroll
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
        scrollTimeoutRef.current = null;
      }
    };
  }, [
    recordErrorMetrics,
    recordQueryPerformance,
    recordApiMetrics,
    recordUserInteraction,
  ]);
};

/**
 * 🧹 Hook para Cleanup Automático de Métricas con Timer Cleanup
 * Limpia métricas antiguas con cleanup effects obligatorios
 */
export const useMetricsCleanup = (
  queryMetricsRef: React.MutableRefObject<any[]>,
  apiMetricsRef: React.MutableRefObject<any[]>,
  errorMetricsRef: React.MutableRefObject<any[]>,
  interactionsRef: React.MutableRefObject<any[]>
) => {
  const cleanupIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    cleanupIntervalRef.current = setInterval(
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

    // Cleanup obligatorio del interval
    return () => {
      if (cleanupIntervalRef.current) {
        clearInterval(cleanupIntervalRef.current);
        cleanupIntervalRef.current = null;
      }
    };
  }, [queryMetricsRef, apiMetricsRef, errorMetricsRef, interactionsRef]);
};

/**
 * 📄 Hook de Page View Tracking con Cleanup
 * Rastrea navegación de páginas
 */
export const usePageViewTracking = (
  recordUserInteraction: (
    type: UserInteraction['type'],
    target: string,
    duration?: number,
    metadata?: Record<string, any>
  ) => void
) => {
  const location = useLocation();
  const navigationType = useNavigationType();

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
  }, [location, navigationType, recordUserInteraction]);
}; 