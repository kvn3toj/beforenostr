/**
 * 📊 Advanced Analytics & Monitoring System
 * Sistema completo de análisis y monitoreo para CoomÜnity SuperApp
 */

import { UserProfile } from '../types/user';

// 🔧 Configuración de Analytics
const GA4_MEASUREMENT_ID = import.meta.env.VITE_GOOGLE_ANALYTICS_ID;
const HOTJAR_ID = import.meta.env.VITE_HOTJAR_ID;
const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN;
const IS_PRODUCTION = import.meta.env.VITE_APP_ENV === 'production';

// 🎯 Tipos para eventos personalizados de CoomÜnity
export interface CoomUnityEvent {
  event_name: string;
  user_id?: string;
  module: 'pilgrim' | 'wallet' | 'marketplace' | 'social' | 'uplay' | 'ustats' | 'core';
  action: string;
  value?: number;
  ayni_context?: 'giving' | 'receiving' | 'collaborating';
  element_type?: 'fuego' | 'tierra' | 'agua' | 'aire';
  custom_parameters?: Record<string, any>;
}

export interface UXMetric {
  metric_name: string;
  value: number;
  timestamp: number;
  page: string;
  user_flow: string;
  device_type: 'mobile' | 'tablet' | 'desktop';
}

// 🎯 Clase principal de Analytics
export class CoomUnityAnalytics {
  private isInitialized: boolean = false;
  private sessionId: string;
  private userId?: string;
  private userProfile?: UserProfile;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.initializeAnalytics();
  }

  // 🚀 Inicialización de todos los servicios de analytics
  private async initializeAnalytics() {
    if (!IS_PRODUCTION) {
      console.log('📊 Analytics initialized in development mode');
      this.isInitialized = true;
      return;
    }

    try {
      await Promise.all([
        this.initializeGA4(),
        this.initializeHotjar(),
        this.initializeSentry(),
      ]);
      
      this.isInitialized = true;
      console.log('📊 All analytics services initialized successfully');
    } catch (error) {
      console.error('❌ Analytics initialization failed:', error);
    }
  }

  // 📈 Google Analytics 4
  private async initializeGA4() {
    if (!GA4_MEASUREMENT_ID) return;

    // Cargar gtag dinámicamente
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_MEASUREMENT_ID}`;
    document.head.appendChild(script);

    // Configurar gtag
    window.dataLayer = window.dataLayer || [];
    window.gtag = function() {
      window.dataLayer.push(arguments);
    };

    window.gtag('js', new Date());
    window.gtag('config', GA4_MEASUREMENT_ID, {
      page_title: 'CoomÜnity SuperApp',
      page_location: window.location.href,
      custom_map: {
        'custom_ayni_score': 'ayni_score',
        'custom_ondas': 'ondas_count',
        'custom_happiness': 'happiness_level',
      }
    });
  }

  // 🔥 Hotjar para análisis UX
  private async initializeHotjar() {
    if (!HOTJAR_ID) return;

    (function(h: any, o: any, t: any, j: any, a?: any, r?: any) {
      h.hj = h.hj || function() {
        (h.hj.q = h.hj.q || []).push(arguments);
      };
      h._hjSettings = { hjid: HOTJAR_ID, hjsv: 6 };
      a = o.getElementsByTagName('head')[0];
      r = o.createElement('script');
      r.async = 1;
      r.src = t + h._hjSettings.hjid + j + h._hjSettings.hjsv;
      a.appendChild(r);
    })(window, document, 'https://static.hotjar.com/c/hotjar-', '.js?sv=');
  }

  // 🚨 Sentry para error tracking
  private async initializeSentry() {
    if (!SENTRY_DSN) return;

    // Importación dinámica de Sentry
    const Sentry = await import('@sentry/browser');
    
    Sentry.init({
      dsn: SENTRY_DSN,
      environment: import.meta.env.VITE_APP_ENV,
      tracesSampleRate: 0.1,
      beforeSend(event) {
        // Filtrar errores no críticos
        if (event.exception) {
          const error = event.exception.values?.[0];
          if (error?.value?.includes('Non-Error promise rejection')) {
            return null;
          }
        }
        return event;
      },
    });
  }

  // 👤 Configurar usuario
  setUser(profile: UserProfile) {
    this.userId = profile.id;
    this.userProfile = profile;

    if (!IS_PRODUCTION) {
      console.log('👤 User set for analytics:', profile.username);
      return;
    }

    // GA4 User Properties
    if (window.gtag) {
      window.gtag('config', GA4_MEASUREMENT_ID, {
        user_id: profile.id,
        custom_map: {
          'user_type': profile.game_data ? 'gamified_user' : 'new_user',
          'registration_date': profile.created_at,
        }
      });
    }

    // Hotjar User Attributes
    if (window.hj) {
      window.hj('identify', profile.id, {
        username: profile.username,
        email: profile.email,
        ondas: profile.game_data?.ondas || 0,
        happiness: profile.game_data?.happiness || 0,
      });
    }
  }

  // 🎯 Tracking de eventos específicos de CoomÜnity
  trackCoomUnityEvent(event: CoomUnityEvent) {
    if (!this.isInitialized) {
      console.warn('Analytics not initialized yet');
      return;
    }

    const enrichedEvent = {
      ...event,
      session_id: this.sessionId,
      timestamp: Date.now(),
      user_id: this.userId,
      ...event.custom_parameters,
    };

    if (!IS_PRODUCTION) {
      console.log('🎯 CoomÜnity Event:', enrichedEvent);
      return;
    }

    // Enviar a GA4
    if (window.gtag) {
      window.gtag('event', event.action, {
        event_category: event.module,
        event_label: event.event_name,
        value: event.value,
        ayni_context: event.ayni_context,
        element_type: event.element_type,
        user_id: this.userId,
      });
    }

    // Enviar a Hotjar como evento personalizado
    if (window.hj) {
      window.hj('event', event.event_name);
    }
  }

  // 📊 Métricas UX específicas
  trackUXMetric(metric: UXMetric) {
    const enrichedMetric = {
      ...metric,
      session_id: this.sessionId,
      user_id: this.userId,
    };

    if (!IS_PRODUCTION) {
      console.log('📊 UX Metric:', enrichedMetric);
      return;
    }

    // Enviar a GA4
    if (window.gtag) {
      window.gtag('event', 'ux_metric', {
        metric_name: metric.metric_name,
        metric_value: metric.value,
        page: metric.page,
        user_flow: metric.user_flow,
        device_type: metric.device_type,
      });
    }
  }

  // 🎮 Eventos específicos de gamificación
  trackGameAction(action: string, value?: number, context?: any) {
    this.trackCoomUnityEvent({
      event_name: 'game_action',
      module: 'pilgrim',
      action,
      value,
      custom_parameters: context,
    });
  }

  // 💰 Eventos del wallet
  trackWalletAction(action: string, amount?: number, currency?: string) {
    this.trackCoomUnityEvent({
      event_name: 'wallet_action',
      module: 'wallet',
      action,
      value: amount,
      custom_parameters: { currency },
    });
  }

  // 🛒 Eventos del marketplace
  trackMarketplaceAction(action: string, itemId?: string, value?: number) {
    this.trackCoomUnityEvent({
      event_name: 'marketplace_action',
      module: 'marketplace',
      action,
      value,
      custom_parameters: { item_id: itemId },
    });
  }

  // 🔄 Eventos de navegación
  trackNavigation(from: string, to: string, method: 'click' | 'swipe' | 'keyboard') {
    this.trackCoomUnityEvent({
      event_name: 'navigation',
      module: 'core',
      action: 'navigate',
      custom_parameters: {
        from_page: from,
        to_page: to,
        navigation_method: method,
      },
    });
  }

  // ⚡ Performance tracking
  trackPerformance(metric: string, value: number, context?: any) {
    this.trackUXMetric({
      metric_name: metric,
      value,
      timestamp: Date.now(),
      page: window.location.pathname,
      user_flow: context?.flow || 'unknown',
      device_type: this.getDeviceType(),
    });
  }

  // 🚨 Error tracking
  trackError(error: Error, context?: any) {
    if (!IS_PRODUCTION) {
      console.error('🚨 Error tracked:', error, context);
      return;
    }

    this.trackCoomUnityEvent({
      event_name: 'error_occurred',
      module: context?.module || 'core',
      action: 'error',
      custom_parameters: {
        error_message: error.message,
        error_stack: error.stack,
        context,
      },
    });

    // También enviar a Sentry si está disponible
    if (window.Sentry) {
      window.Sentry.captureException(error, {
        tags: context,
        extra: context,
      });
    }
  }

  // 🔄 Ayni específico - Tracking de reciprocidad
  trackAyniAction(action: 'give' | 'receive' | 'collaborate', value: number, context?: any) {
    this.trackCoomUnityEvent({
      event_name: 'ayni_action',
      module: 'core',
      action,
      value,
      ayni_context: action === 'give' ? 'giving' : action === 'receive' ? 'receiving' : 'collaborating',
      custom_parameters: context,
    });
  }

  // 🔧 Utilities
  private generateSessionId(): string {
    return `coomunity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
    const width = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  }

  // 📊 Obtener métricas del dashboard
  async getDashboardMetrics(): Promise<{
    session_duration: number;
    page_views: number;
    interactions: number;
    ayni_score: number;
  }> {
    // Implementar lógica para obtener métricas del dashboard
    return {
      session_duration: Date.now() - parseInt(this.sessionId.split('_')[1]),
      page_views: 0, // Implementar contador
      interactions: 0, // Implementar contador
      ayni_score: this.userProfile?.game_data?.happiness || 0,
    };
  }
}

// 🚀 Instancia singleton
export const analytics = new CoomUnityAnalytics();

// 🎯 Hook para React
export function useAnalytics() {
  return {
    analytics,
    trackEvent: (event: CoomUnityEvent) => analytics.trackCoomUnityEvent(event),
    trackUX: (metric: UXMetric) => analytics.trackUXMetric(metric),
    trackGame: (action: string, value?: number, context?: any) => 
      analytics.trackGameAction(action, value, context),
    trackWallet: (action: string, amount?: number, currency?: string) => 
      analytics.trackWalletAction(action, amount, currency),
    trackNavigation: (from: string, to: string, method: 'click' | 'swipe' | 'keyboard') => 
      analytics.trackNavigation(from, to, method),
    trackAyni: (action: 'give' | 'receive' | 'collaborate', value: number, context?: any) => 
      analytics.trackAyniAction(action, value, context),
  };
}

// 🌍 Extensiones de tipos globales
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
    hj: (...args: any[]) => void;
    Sentry: any;
  }
} 