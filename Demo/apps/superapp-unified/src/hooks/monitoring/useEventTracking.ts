import { useCallback } from 'react';
import { reportEvent, reportError } from '../../lib/monitoring';

/**
 * 📊 Hook para Tracking de Eventos de Usuario
 * Maneja el reporte de eventos sin dependencias circulares
 */
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

/**
 * 🚨 Hook para Tracking de Errores
 * Maneja el reporte de errores de forma simplificada
 */
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

/**
 * ⚡ Hook para Tracking de Performance
 * Monitorea performance de componentes y operaciones asíncronas
 */
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

/**
 * 📈 Hook para Tracking de Engagement
 * Rastrea engagement del usuario con cleanup effects obligatorios
 */
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