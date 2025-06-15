import { useCallback, useEffect } from 'react';
import { analyticsService, AdminFunnelEvents, type BetaUserProfile } from '../services/analytics';
import { useLocation } from 'react-router-dom';

export interface UseAnalyticsOptions {
  userId?: string;
  trackPageView?: boolean;
  pageName?: string;
}

export const useAnalytics = () => {
  const location = useLocation();

  // Trackear cambios de página automáticamente
  useEffect(() => {
    if (import.meta.env.VITE_ENABLE_ANALYTICS === 'true') {
      const pageName = getPageNameFromPath(location.pathname);
      analyticsService.trackPageView(pageName, {
        page_path: location.pathname,
        page_search: location.search
      });
    }
  }, [location]);

  // Configurar perfil de usuario beta
  const setBetaUser = useCallback((profile: BetaUserProfile) => {
    if (import.meta.env.VITE_ENABLE_ANALYTICS === 'true') {
      analyticsService.setBetaUserProfile(profile);
    }
  }, []);

  // Trackear eventos del programa beta
  const trackBetaEvent = useCallback((eventName: string, parameters?: Record<string, any>) => {
    if (import.meta.env.VITE_ENABLE_ANALYTICS === 'true') {
      analyticsService.trackBetaEvent(eventName, parameters);
    }
  }, []);

  // Eventos específicos del onboarding
  const trackOnboardingStep = useCallback((step: string, completed: boolean) => {
    if (import.meta.env.VITE_ENABLE_ANALYTICS === 'true') {
      analyticsService.trackBetaOnboardingStep(step, completed);
    }
  }, []);

  // Trackear quiz filosófico
  const trackPhilosophyQuiz = useCallback((score: number, answers: Record<string, any>) => {
    if (import.meta.env.VITE_ENABLE_ANALYTICS === 'true') {
      analyticsService.trackBetaPhilosophyQuiz(score, answers);
    }
  }, []);

  // Trackear exploración de mundos
  const trackMundoExploration = useCallback((mundoId: string, timeSpent: number) => {
    if (import.meta.env.VITE_ENABLE_ANALYTICS === 'true') {
      analyticsService.trackBetaFirstMundoExploration(mundoId, timeSpent);
    }
  }, []);

  // Trackear feedback del usuario
  const trackFeedback = useCallback((feedbackType: string, rating: number) => {
    if (import.meta.env.VITE_ENABLE_ANALYTICS === 'true') {
      analyticsService.trackBetaFeedbackSubmission(feedbackType, rating);
    }
  }, []);

  // Trackear milestone de retención
  const trackRetention = useCallback((daysActive: number, actionCount: number) => {
    if (import.meta.env.VITE_ENABLE_ANALYTICS === 'true') {
      analyticsService.trackBetaRetention(daysActive, actionCount);
    }
  }, []);

  // Trackear goals de conversión
  const trackConversionGoal = useCallback((goalName: string, value?: number) => {
    if (import.meta.env.VITE_ENABLE_ANALYTICS === 'true') {
      analyticsService.trackBetaConversionGoal(goalName, value);
    }
  }, []);

  // Trackear registro con código de invitación
  const trackRegistration = useCallback((invitationCode: string, source: string) => {
    if (import.meta.env.VITE_ENABLE_ANALYTICS === 'true') {
      analyticsService.trackBetaRegistration(invitationCode, source);
    }
  }, []);

  return {
    setBetaUser,
    trackBetaEvent,
    trackOnboardingStep,
    trackPhilosophyQuiz,
    trackMundoExploration,
    trackFeedback,
    trackRetention,
    trackConversionGoal,
    trackRegistration
  };
};

/**
 * Convierte rutas de la aplicación en nombres de página legibles
 */
function getPageNameFromPath(pathname: string): string {
  const routes: Record<string, string> = {
    '/': 'Home',
    '/login': 'Login',
    '/register': 'Register',
    '/dashboard': 'Dashboard',
    '/mundos': 'Mundos',
    '/uplay': 'UPlay',
    '/marketplace': 'Marketplace',
    '/social': 'Social',
    '/ustats': 'UStats',
    '/profile': 'Profile',
    '/settings': 'Settings',
    '/pilgrim-journey': 'Pilgrim Journey',
    '/beta-onboarding': 'Beta Onboarding',
    '/philosophy-quiz': 'Philosophy Quiz',
    '/feedback': 'Feedback Form'
  };

  return routes[pathname] || pathname.replace('/', '').replace(/-/g, ' ') || 'Unknown Page';
}

/**
 * Hook para trackear tiempo en página
 * Útil para medir engagement en contenido educativo
 */
export const usePageTimeTracking = (pageName: string) => {
  const { trackBetaEvent } = useAnalytics();

  useEffect(() => {
    const startTime = Date.now();

    const handleBeforeUnload = () => {
      const timeSpent = Math.round((Date.now() - startTime) / 1000);
      trackBetaEvent('page_time_spent', {
        page_name: pageName,
        time_spent_seconds: timeSpent
      });
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      // También trackear cuando el componente se desmonta
      const timeSpent = Math.round((Date.now() - startTime) / 1000);
      if (timeSpent > 5) { // Solo trackear si estuvo más de 5 segundos
        trackBetaEvent('page_time_spent', {
          page_name: pageName,
          time_spent_seconds: timeSpent
        });
      }
    };
  }, [pageName, trackBetaEvent]);
};

/**
 * Hook para trackear interacciones con elementos específicos
 * Útil para entender qué características usan más los beta users
 */
export const useInteractionTracking = () => {
  const { trackBetaEvent } = useAnalytics();

  const trackClick = useCallback((elementName: string, additionalData?: Record<string, any>) => {
    trackBetaEvent('element_clicked', {
      element_name: elementName,
      ...additionalData
    });
  }, [trackBetaEvent]);

  const trackFormSubmission = useCallback((formName: string, success: boolean, errors?: string[]) => {
    trackBetaEvent('form_submitted', {
      form_name: formName,
      submission_success: success,
      errors: errors?.join(', ')
    });
  }, [trackBetaEvent]);

  const trackSearchQuery = useCallback((query: string, resultsCount: number) => {
    trackBetaEvent('search_performed', {
      search_query: query,
      results_count: resultsCount
    });
  }, [trackBetaEvent]);

  return {
    trackClick,
    trackFormSubmission,
    trackSearchQuery
  };
}; 