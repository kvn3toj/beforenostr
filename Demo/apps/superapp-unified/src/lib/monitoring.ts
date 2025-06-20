import * as Sentry from "@sentry/react";
import { onCLS, onINP, onFCP, onLCP, onTTFB } from 'web-vitals';

// Configuración de Sentry
export const initSentry = () => {
  if (import.meta.env.VITE_SENTRY_DSN) {
    Sentry.init({
      dsn: import.meta.env.VITE_SENTRY_DSN,
      environment: import.meta.env.MODE || 'development',
      integrations: [
        Sentry.browserTracingIntegration(),
        Sentry.replayIntegration({
          // Capturar solo el 10% de las sesiones normales
          sessionSampleRate: 0.1,
          // Capturar el 100% de las sesiones con errores
          errorSampleRate: 1.0,
          // Configurar para privacidad - enmascarar texto por defecto
          maskAllText: true,
          blockAllMedia: true,
        }),
      ],
      // Performance Monitoring
      tracesSampleRate: import.meta.env.PROD ? 0.1 : 1.0,
      // Session Replay
      replaysSessionSampleRate: import.meta.env.PROD ? 0.1 : 1.0,
      replaysOnErrorSampleRate: 1.0,
      // Release tracking
      release: import.meta.env.VITE_APP_VERSION || '1.0.0',
      beforeSend(event) {
        // Filtrar errores conocidos y menos importantes
        if (event.exception) {
          const error = event.exception.values?.[0];
          if (error?.type === 'ChunkLoadError' || 
              error?.value?.includes('Loading chunk') ||
              error?.value?.includes('Network Error')) {
            // Estos errores son comunes en SPAs y menos críticos
            return null;
          }
        }
        return event;
      },
    });
  }
};

// Configuración de Google Analytics 4
export const initGA4 = () => {
  const measurementId = import.meta.env.VITE_GA4_MEASUREMENT_ID;
  
  if (measurementId && typeof window !== 'undefined') {
    // Cargar gtag script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(script);

    // Configurar gtag
    window.dataLayer = window.dataLayer || [];
    window.gtag = function() {
      window.dataLayer.push(arguments);
    };
    
    window.gtag('js', new Date());
    window.gtag('config', measurementId, {
      // Configuración de privacidad
      anonymize_ip: true,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      // Configuración de performance
      page_title: document.title,
      page_location: window.location.href,
    });
  }
};

// Configuración de Web Vitals
export const initWebVitals = () => {
  const reportWebVital = (metric: any) => {
    // Enviar a Sentry como métricas personalizadas
    if (import.meta.env.VITE_SENTRY_DSN) {
      Sentry.setMeasurement(metric.name, metric.value, metric.unit);
    }

    // Enviar a GA4 como eventos personalizados
    if (import.meta.env.VITE_GA4_MEASUREMENT_ID && window.gtag) {
      window.gtag('event', metric.name, {
        event_category: 'Web Vitals',
        event_label: metric.id,
        value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
        non_interaction: true,
        custom_map: {
          metric_id: metric.id,
          metric_value: metric.value,
          metric_delta: metric.delta,
        }
      });
    }

    // Log para desarrollo
    if (import.meta.env.DEV) {
      console.log(`[Web Vitals] ${metric.name}:`, metric);
    }
  };

  // Medir todas las Core Web Vitals con nueva API v4
  onCLS(reportWebVital);
  onINP(reportWebVital); // Interaction to Next Paint (reemplaza FID)
  onFCP(reportWebVital);
  onLCP(reportWebVital);
  onTTFB(reportWebVital);
};

// Función para reportar errores customizados
export const reportError = (error: Error, context?: Record<string, any>) => {
  if (import.meta.env.VITE_SENTRY_DSN) {
    Sentry.withScope((scope) => {
      if (context) {
        scope.setContext('errorContext', context);
      }
      Sentry.captureException(error);
    });
  }

  // También log en desarrollo
  if (import.meta.env.DEV) {
    console.error('[Custom Error]', error, context);
  }
};

// Función para reportar eventos customizados
export const reportEvent = (eventName: string, properties?: Record<string, any>) => {
  // Enviar a GA4
  if (import.meta.env.VITE_GA4_MEASUREMENT_ID && window.gtag) {
    window.gtag('event', eventName, {
      event_category: 'Custom',
      ...properties,
    });
  }

  // Enviar a Sentry como breadcrumb
  if (import.meta.env.VITE_SENTRY_DSN) {
    Sentry.addBreadcrumb({
      message: eventName,
      category: 'custom',
      data: properties,
      level: 'info',
    });
  }

  // Log en desarrollo
  if (import.meta.env.DEV) {
    console.log(`[Custom Event] ${eventName}:`, properties);
  }
};

// Inicializar todas las herramientas de monitoreo
export const initMonitoring = () => {
  initSentry();
  initGA4();
  initWebVitals();
  
  if (import.meta.env.DEV) {
    console.log('🔍 Monitoring initialized:', {
      sentry: !!import.meta.env.VITE_SENTRY_DSN,
      ga4: !!import.meta.env.VITE_GA4_MEASUREMENT_ID,
      webVitals: true,
    });
  }
};

// Tipos para TypeScript
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
} 