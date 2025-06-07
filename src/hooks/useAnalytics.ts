import { useCallback, useEffect } from 'react';
import { analyticsService, AdminFunnelEvents } from '../services/analytics.service';

export interface UseAnalyticsOptions {
  userId?: string;
  trackPageView?: boolean;
  pageName?: string;
}

export const useAnalytics = (options: UseAnalyticsOptions = {}) => {
  const { userId, trackPageView = false, pageName } = options;

  // Set user ID when provided
  useEffect(() => {
    if (userId) {
      analyticsService.setUserId(userId);
    }
  }, [userId]);

  // Track page view automatically if enabled
  useEffect(() => {
    if (trackPageView && pageName) {
      analyticsService.trackPageVisit(pageName);
    }
  }, [trackPageView, pageName]);

  // Memoized tracking functions
  const trackEvent = useCallback(async (eventType: string, metadata?: Record<string, any>) => {
    return analyticsService.trackEvent({ eventType, metadata });
  }, []);

  const trackFunnelStep = useCallback(async (
    funnelName: string, 
    stepName: string, 
    stepOrder: number, 
    success: boolean, 
    metadata?: Record<string, any>
  ) => {
    return analyticsService.trackFunnelStep({
      funnelName,
      stepName,
      stepOrder,
      userId: userId || '',
      success,
      metadata
    });
  }, [userId]);

  const trackUserCreationFunnel = useCallback(async (
    step: keyof typeof AdminFunnelEvents, 
    metadata?: Record<string, any>
  ) => {
    return analyticsService.trackUserCreationFunnel(step, metadata);
  }, []);

  const trackItemCreationFunnel = useCallback(async (
    step: keyof typeof AdminFunnelEvents, 
    metadata?: Record<string, any>
  ) => {
    return analyticsService.trackItemCreationFunnel(step, metadata);
  }, []);

  const trackPermissionsFunnel = useCallback(async (
    step: keyof typeof AdminFunnelEvents, 
    metadata?: Record<string, any>
  ) => {
    return analyticsService.trackPermissionsFunnel(step, metadata);
  }, []);

  const trackPageVisit = useCallback(async (
    pageName: string, 
    metadata?: Record<string, any>
  ) => {
    return analyticsService.trackPageVisit(pageName, metadata);
  }, []);

  const trackInteraction = useCallback(async (
    component: string, 
    action: string, 
    metadata?: Record<string, any>
  ) => {
    return analyticsService.trackInteraction(component, action, metadata);
  }, []);

  const trackError = useCallback(async (
    errorMessage: string, 
    context: string, 
    metadata?: Record<string, any>
  ) => {
    return analyticsService.trackError(errorMessage, context, metadata);
  }, []);

  return {
    trackEvent,
    trackFunnelStep,
    trackUserCreationFunnel,
    trackItemCreationFunnel,
    trackPermissionsFunnel,
    trackPageVisit,
    trackInteraction,
    trackError
  };
}; 