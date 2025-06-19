// Analytics Service para Programa Beta CoomÜnity
// Integra Google Analytics 4 y Hotjar para tracking completo

interface AnalyticsEvent {
  event_name: string;
  event_category?: string;
  event_label?: string;
  value?: number;
  custom_parameters?: Record<string, any>;
}

interface BetaUserProfile {
  user_id: string;
  beta_cohort: string;
  invitation_code?: string;
  registration_date: string;
  philosophical_alignment_score?: number;
  cooperative_experience?: string;
  geographic_region?: string;
}

class AnalyticsService {
  private gaTrackingId: string;
  private hotjarId: string;
  private isInitialized = false;
  private betaUserProfile: BetaUserProfile | null = null;

  constructor() {
    this.gaTrackingId = import.meta.env.VITE_GA_TRACKING_ID || '';
    this.hotjarId = import.meta.env.VITE_HOTJAR_ID || '';
  }

  // Inicialización de Google Analytics 4
  async initializeGA4() {
    if (!this.gaTrackingId || this.isInitialized) return;

    try {
      // Cargar gtag script
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${this.gaTrackingId}`;
      document.head.appendChild(script);

      // Configurar gtag
      window.dataLayer = window.dataLayer || [];
      window.gtag = function() {
        window.dataLayer.push(arguments);
      };

      window.gtag('js', new Date());
      window.gtag('config', this.gaTrackingId, {
        // Configuración específica para programa beta
        anonymize_ip: true,
        allow_google_signals: true,
        send_page_view: false, // Lo manejaremos manualmente
        custom_map: {
          'custom_parameter_1': 'beta_cohort',
          'custom_parameter_2': 'invitation_code',
          'custom_parameter_3': 'philosophical_alignment',
          'custom_parameter_4': 'cooperative_experience'
        }
      });

      console.log('✅ Google Analytics 4 inicializado para programa beta');
      this.isInitialized = true;
    } catch (error) {
      console.error('❌ Error inicializando GA4:', error);
    }
  }

  // Inicialización de Hotjar
  async initializeHotjar() {
    if (!this.hotjarId) return;

    try {
      // Script de Hotjar
      const hjScript = `
        (function(h,o,t,j,a,r){
          h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
          h._hjSettings={hjid:${this.hotjarId},hjsv:6};
          a=o.getElementsByTagName('head')[0];
          r=o.createElement('script');r.async=1;
          r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
          a.appendChild(r);
        })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
      `;

      const script = document.createElement('script');
      script.innerHTML = hjScript;
      document.head.appendChild(script);

      console.log('✅ Hotjar inicializado para UX tracking');
    } catch (error) {
      console.error('❌ Error inicializando Hotjar:', error);
    }
  }

  // Configurar perfil de usuario beta
  setBetaUserProfile(profile: BetaUserProfile) {
    this.betaUserProfile = profile;
    
    if (window.gtag) {
      window.gtag('config', this.gaTrackingId, {
        user_id: profile.user_id,
        custom_map: {
          beta_cohort: profile.beta_cohort,
          invitation_code: profile.invitation_code,
          philosophical_alignment: profile.philosophical_alignment_score,
          cooperative_experience: profile.cooperative_experience
        }
      });
    }

    if (window.hj) {
      window.hj('identify', profile.user_id, {
        beta_cohort: profile.beta_cohort,
        invitation_code: profile.invitation_code,
        registration_date: profile.registration_date,
        geographic_region: profile.geographic_region
      });
    }
  }

  // Tracking de eventos específicos del programa beta
  trackBetaEvent(eventName: string, parameters: Record<string, any> = {}) {
    const event: AnalyticsEvent = {
      event_name: `beta_${eventName}`,
      event_category: 'Beta Program',
      custom_parameters: {
        ...parameters,
        beta_cohort: this.betaUserProfile?.beta_cohort,
        invitation_code: this.betaUserProfile?.invitation_code,
        timestamp: new Date().toISOString()
      }
    };

    this.trackEvent(event);
  }

  // Tracking de eventos generales
  trackEvent(event: AnalyticsEvent) {
    if (!this.isInitialized) {
      console.warn('Analytics no inicializado, eventos se perderán');
      return;
    }

    try {
      if (window.gtag) {
        window.gtag('event', event.event_name, {
          event_category: event.event_category,
          event_label: event.event_label,
          value: event.value,
          ...event.custom_parameters
        });
      }

      console.log('📊 Evento trackeado:', event.event_name, event.custom_parameters);
    } catch (error) {
      console.error('❌ Error trackeando evento:', error);
    }
  }

  // Tracking de páginas vistas
  trackPageView(pageName: string, additionalData: Record<string, any> = {}) {
    if (!this.isInitialized) return;

    const pageData = {
      page_title: pageName,
      page_location: window.location.href,
      page_path: window.location.pathname,
      ...additionalData,
      beta_cohort: this.betaUserProfile?.beta_cohort,
      user_id: this.betaUserProfile?.user_id
    };

    if (window.gtag) {
      window.gtag('event', 'page_view', pageData);
    }

    console.log('📄 Página vista trackeada:', pageName);
  }

  // Eventos específicos del programa beta
  trackBetaRegistration(invitationCode: string, source: string) {
    this.trackBetaEvent('registration_started', {
      invitation_code: invitationCode,
      traffic_source: source
    });
  }

  trackBetaOnboardingStep(step: string, completed: boolean) {
    this.trackBetaEvent('onboarding_step', {
      step_name: step,
      step_completed: completed,
      step_number: this.getOnboardingStepNumber(step)
    });
  }

  trackBetaPhilosophyQuiz(score: number, answers: Record<string, any>) {
    this.trackBetaEvent('philosophy_quiz_completed', {
      philosophical_alignment_score: score,
      quiz_answers: JSON.stringify(answers),
      passing_score: score >= 70
    });
  }

  trackBetaFirstMundoExploration(mundoId: string, timeSpent: number) {
    this.trackBetaEvent('first_mundo_exploration', {
      mundo_id: mundoId,
      time_spent_seconds: timeSpent,
      exploration_completed: timeSpent > 60
    });
  }

  trackBetaFeedbackSubmission(feedbackType: string, rating: number) {
    this.trackBetaEvent('feedback_submitted', {
      feedback_type: feedbackType,
      rating: rating,
      feedback_positive: rating >= 4
    });
  }

  trackBetaRetention(daysActive: number, actionCount: number) {
    this.trackBetaEvent('retention_milestone', {
      days_active: daysActive,
      total_actions: actionCount,
      engagement_level: this.getEngagementLevel(actionCount)
    });
  }

  // Métodos de utilidad
  private getOnboardingStepNumber(step: string): number {
    const steps = ['profile_setup', 'philosophy_quiz', 'first_mundo_exploration'];
    return steps.indexOf(step) + 1;
  }

  private getEngagementLevel(actionCount: number): string {
    if (actionCount >= 50) return 'high';
    if (actionCount >= 20) return 'medium';
    if (actionCount >= 5) return 'low';
    return 'minimal';
  }

  // Conversion goals específicos para beta
  trackBetaConversionGoal(goalName: string, value?: number) {
    this.trackBetaEvent('conversion_goal', {
      goal_name: goalName,
      goal_value: value,
      conversion_date: new Date().toISOString()
    });

    // Goal específico en GA4
    if (window.gtag) {
      window.gtag('event', 'conversion', {
        send_to: this.gaTrackingId,
        value: value,
        currency: 'USD',
        event_category: 'Beta Conversion',
        event_label: goalName
      });
    }
  }

  // Inicialización completa
  async initialize() {
    await Promise.all([
      this.initializeGA4(),
      this.initializeHotjar()
    ]);

    // Trackear inicio de sesión del programa beta
    this.trackBetaEvent('session_started', {
      user_agent: navigator.userAgent,
      screen_resolution: `${screen.width}x${screen.height}`,
      language: navigator.language
    });

    console.log('🚀 Analytics del Programa Beta completamente inicializado');
  }
}

// Instancia singleton
export const analyticsService = new AnalyticsService();

// Tipos para TypeScript
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
    hj: (...args: any[]) => void;
  }
}

export type { AnalyticsEvent, BetaUserProfile }; 