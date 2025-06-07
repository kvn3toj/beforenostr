import { apiService } from './api.service';
import {
  TotalCountMetric,
  UsersCreatedOverTimeMetric,
  TimeRangeParams,
  TimeSeriesDataPoint,
  TopViewedPlaylistsMetric,
  TopViewedMundosMetric,
  ActiveUsersOverTimeMetric,
  TopInteractedContentMetric,
  LeastViewedPlaylistsMetric,
  LeastViewedMundosMetric,
  LeastInteractedPlaylistsMetric,
  LeastInteractedMundosMetric,
} from '../types/analytics.types';

// Configuración de la API
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3002';
const ANALYTICS_ENDPOINT = `${API_BASE_URL}/analytics`;

// Función auxiliar para manejar errores de analíticas
const handleAnalyticsError = (functionName: string, error: unknown, fallbackValue: any) => {
  console.warn(`[Analytics] ${functionName} - Backend no disponible:`, error);
  return fallbackValue;
};

// Funciones principales de métricas
export const fetchTotalUsers = async (): Promise<TotalCountMetric> => {
  try {
    return await apiService.get<TotalCountMetric>('/analytics/total-users');
  } catch (error) {
    return handleAnalyticsError('fetchTotalUsers', error, { count: 0 });
  }
};

export const fetchTotalPlaylists = async (): Promise<TotalCountMetric> => {
  try {
    return await apiService.get<TotalCountMetric>('/analytics/total-playlists');
  } catch (error) {
    return handleAnalyticsError('fetchTotalPlaylists', error, { count: 0 });
  }
};

export const fetchTotalMundos = async (): Promise<TotalCountMetric> => {
  try {
    return await apiService.get<TotalCountMetric>('/analytics/total-mundos');
  } catch (error) {
    return handleAnalyticsError('fetchTotalMundos', error, { count: 0 });
  }
};

export const fetchUsersCreatedOverTime = async ({
  interval,
  startDate,
  endDate,
}: TimeRangeParams): Promise<UsersCreatedOverTimeMetric> => {
  try {
    const params = new URLSearchParams();
    if (interval) params.append('interval', interval);
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const queryString = params.toString();
    const url = queryString ? `/analytics/users-created-over-time?${queryString}` : '/analytics/users-created-over-time';
    
    return await apiService.get<UsersCreatedOverTimeMetric>(url);
  } catch (error) {
    return handleAnalyticsError('fetchUsersCreatedOverTime', error, []);
  }
};

export const fetchPlaylistsCreatedOverTime = async ({
  interval,
  startDate,
  endDate,
}: TimeRangeParams): Promise<TimeSeriesDataPoint[]> => {
  try {
    const params = new URLSearchParams();
    if (interval) params.append('interval', interval);
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const queryString = params.toString();
    const url = queryString ? `/analytics/playlists-created-over-time?${queryString}` : '/analytics/playlists-created-over-time';
    
    return await apiService.get<TimeSeriesDataPoint[]>(url);
  } catch (error) {
    return handleAnalyticsError('fetchPlaylistsCreatedOverTime', error, []);
  }
};

export const fetchMundosCreatedOverTime = async ({
  interval,
  startDate,
  endDate,
}: TimeRangeParams): Promise<TimeSeriesDataPoint[]> => {
  try {
    const params = new URLSearchParams();
    if (interval) params.append('interval', interval);
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const queryString = params.toString();
    const url = queryString ? `/analytics/mundos-created-over-time?${queryString}` : '/analytics/mundos-created-over-time';
    
    return await apiService.get<TimeSeriesDataPoint[]>(url);
  } catch (error) {
    return handleAnalyticsError('fetchMundosCreatedOverTime', error, []);
  }
};

export const fetchTopViewedPlaylists = async (): Promise<TopViewedPlaylistsMetric> => {
  try {
    return await apiService.get<TopViewedPlaylistsMetric>('/analytics/top-viewed-playlists');
  } catch (error) {
    return handleAnalyticsError('fetchTopViewedPlaylists', error, []);
  }
};

export const fetchTopViewedMundos = async (): Promise<TopViewedMundosMetric> => {
  try {
    return await apiService.get<TopViewedMundosMetric>('/analytics/top-viewed-mundos');
  } catch (error) {
    return handleAnalyticsError('fetchTopViewedMundos', error, []);
  }
};

export const fetchActiveUsersOverTime = async ({
  interval,
  startDate,
  endDate,
}: TimeRangeParams): Promise<ActiveUsersOverTimeMetric> => {
  try {
    const params = new URLSearchParams();
    if (interval) params.append('interval', interval);
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const queryString = params.toString();
    const url = queryString ? `/analytics/active-users-over-time?${queryString}` : '/analytics/active-users-over-time';
    
    return await apiService.get<ActiveUsersOverTimeMetric>(url);
  } catch (error) {
    return handleAnalyticsError('fetchActiveUsersOverTime', error, []);
  }
};

export const fetchTopInteractedContent = async (): Promise<TopInteractedContentMetric> => {
  try {
    return await apiService.get<TopInteractedContentMetric>('/analytics/top-interacted-content');
  } catch (error) {
    return handleAnalyticsError('fetchTopInteractedContent', error, []);
  }
};

export const fetchLeastViewedPlaylists = async (): Promise<LeastViewedPlaylistsMetric> => {
  try {
    return await apiService.get<LeastViewedPlaylistsMetric>('/analytics/least-viewed-playlists');
  } catch (error) {
    return handleAnalyticsError('fetchLeastViewedPlaylists', error, []);
  }
};

export const fetchLeastViewedMundos = async (): Promise<LeastViewedMundosMetric> => {
  try {
    return await apiService.get<LeastViewedMundosMetric>('/analytics/least-viewed-mundos');
  } catch (error) {
    return handleAnalyticsError('fetchLeastViewedMundos', error, []);
  }
};

export const fetchLeastInteractedPlaylists = async (): Promise<LeastInteractedPlaylistsMetric> => {
  try {
    return await apiService.get<LeastInteractedPlaylistsMetric>('/analytics/least-interacted-playlists');
  } catch (error) {
    return handleAnalyticsError('fetchLeastInteractedPlaylists', error, []);
  }
};

export const fetchLeastInteractedMundos = async (): Promise<LeastInteractedMundosMetric> => {
  try {
    return await apiService.get<LeastInteractedMundosMetric>('/analytics/least-interacted-mundos');
  } catch (error) {
    return handleAnalyticsError('fetchLeastInteractedMundos', error, []);
  }
};

// Funciones de engagement de usuarios (estas sí están implementadas en el backend)
export const recordUserEngagement = async (engagementData: {
  contentItemId: string;
  engagementType: string;
  duration?: number;
  metadata?: Record<string, any>;
}) => {
  try {
    return await apiService.post('/analytics/events', engagementData);
  } catch (error) {
    return handleAnalyticsError('recordUserEngagement', error, null);
  }
};

export const getMyEngagement = async () => {
  try {
    return await apiService.get('/analytics/me/engagement');
  } catch (error) {
    return handleAnalyticsError('getMyEngagement', error, []);
  }
};

export const getUserEngagement = async (userId: string) => {
  try {
    return await apiService.get(`/analytics/users/${userId}/engagement`);
  } catch (error) {
    return handleAnalyticsError('getUserEngagement', error, []);
  }
};

export const getContentItemEngagement = async (itemId: string) => {
  try {
    return await apiService.get(`/analytics/items/${itemId}/engagement`);
  } catch (error) {
    return handleAnalyticsError('getContentItemEngagement', error, []);
  }
};

// Funciones adicionales simplificadas para compatibilidad
export const getSystemStats = async () => {
  try {
    return await apiService.get('/analytics/system-stats');
  } catch (error) {
    return handleAnalyticsError('getSystemStats', error, {
      totalUsers: 0,
      totalMundos: 0,
      totalPlaylists: 0,
      totalVideos: 0
    });
  }
};

export const getUserStats = async () => {
  try {
    return await apiService.get('/analytics/user-stats');
  } catch (error) {
    return handleAnalyticsError('getUserStats', error, {
      activeUsers: 0,
      newUsers: 0,
      topUsers: []
    });
  }
};

export const getContentStats = async () => {
  try {
    return await apiService.get('/analytics/content-stats');
  } catch (error) {
    return handleAnalyticsError('getContentStats', error, {
      topPlaylists: [],
      topMundos: [],
      recentActivity: []
    });
  }
};

// Alias para compatibilidad con código existente
export const getUsersCreatedOverTime = fetchUsersCreatedOverTime;
export const getPlaylistsCreatedOverTime = fetchPlaylistsCreatedOverTime;
export const getMundosCreatedOverTime = fetchMundosCreatedOverTime;
export const getTopViewedPlaylists = fetchTopViewedPlaylists;
export const getTopViewedMundos = fetchTopViewedMundos;
export const getActiveUsersOverTime = fetchActiveUsersOverTime;
export const getTopInteractedContent = fetchTopInteractedContent;
export const getLeastViewedPlaylists = fetchLeastViewedPlaylists;
export const getLeastViewedMundos = fetchLeastViewedMundos;
export const getLeastInteractedPlaylists = fetchLeastInteractedPlaylists;
export const getLeastInteractedMundos = fetchLeastInteractedMundos;

// Interfaces para tracking de eventos
export interface AnalyticsEvent {
  eventType: string;
  userId: string;
  sessionId?: string;
  metadata?: Record<string, any>;
  videoItemId?: string;
  playlistId?: string;
  mundoId?: string;
}

export interface FunnelStep {
  funnelName: string;
  stepName: string;
  stepOrder: number;
  userId: string;
  success: boolean;
  errorMessage?: string;
  metadata?: Record<string, any>;
}

// Tipos de eventos de funnel para Gamifier Admin
export enum AdminFunnelEvents {
  // User Creation Funnel
  USER_CREATION_STARTED = 'user_creation_started',
  USER_FORM_FILLED = 'user_form_filled',
  USER_CREATION_SUCCESS = 'user_creation_success',
  USER_CREATION_FAILED = 'user_creation_failed',
  
  // Video/Item Creation Funnel
  ITEM_CREATION_STARTED = 'item_creation_started',
  ITEM_FORM_FILLED = 'item_form_filled',
  ITEM_URL_ADDED = 'item_url_added',
  ITEM_DURATION_CALCULATED = 'item_duration_calculated',
  ITEM_CREATION_SUCCESS = 'item_creation_success',
  ITEM_CREATION_FAILED = 'item_creation_failed',
  
  // Role & Permissions Funnel
  ROLES_PAGE_VISITED = 'roles_page_visited',
  ROLE_SELECTED = 'role_selected',
  PERMISSIONS_EDIT_STARTED = 'permissions_edit_started',
  PERMISSIONS_MODIFIED = 'permissions_modified',
  PERMISSIONS_SAVE_SUCCESS = 'permissions_save_success',
  PERMISSIONS_SAVE_FAILED = 'permissions_save_failed',
  
  // Navigation Events
  PAGE_VISITED = 'page_visited',
  COMPONENT_INTERACTION = 'component_interaction',
  ERROR_OCCURRED = 'error_occurred'
}

class AnalyticsService {
  private sessionId: string;
  private currentUserId: string | null = null;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.initializeUserId();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private initializeUserId(): void {
    // Try to get user ID from localStorage or auth context
    const token = localStorage.getItem('auth_token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        this.currentUserId = payload.sub;
      } catch (error) {
        console.warn('[AnalyticsService] Could not parse user ID from token:', error);
      }
    }
  }

  setUserId(userId: string): void {
    this.currentUserId = userId;
  }

  async trackEvent(eventData: Partial<AnalyticsEvent>): Promise<void> {
    try {
      if (!this.currentUserId) {
        console.warn('[AnalyticsService] No user ID available for tracking');
        return;
      }

      const fullEventData: AnalyticsEvent = {
        userId: this.currentUserId,
        sessionId: this.sessionId,
        ...eventData,
        eventType: eventData.eventType || 'unknown_event',
        metadata: {
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          url: window.location.href,
          ...eventData.metadata
        }
      };

      console.log('[AnalyticsService] Tracking event:', fullEventData);

      await apiService.post('/analytics/data', fullEventData);
    } catch (error) {
      console.error('[AnalyticsService] Error tracking event:', error);
      // Don't throw error to avoid breaking user flow
    }
  }

  async trackFunnelStep(step: FunnelStep): Promise<void> {
    const eventType = `funnel_${step.funnelName}_${step.stepName}`;
    
    await this.trackEvent({
      eventType,
      metadata: {
        funnelName: step.funnelName,
        stepName: step.stepName,
        stepOrder: step.stepOrder,
        success: step.success,
        errorMessage: step.errorMessage,
        ...step.metadata
      }
    });
  }

  // Convenience methods for common admin funnel tracking
  async trackUserCreationFunnel(step: keyof typeof AdminFunnelEvents, metadata?: Record<string, any>): Promise<void> {
    const stepMapping = {
      USER_CREATION_STARTED: { stepName: 'started', stepOrder: 1, success: true },
      USER_FORM_FILLED: { stepName: 'form_filled', stepOrder: 2, success: true },
      USER_CREATION_SUCCESS: { stepName: 'success', stepOrder: 3, success: true },
      USER_CREATION_FAILED: { stepName: 'failed', stepOrder: 3, success: false }
    };

    const stepInfo = stepMapping[step];
    if (stepInfo) {
      await this.trackFunnelStep({
        funnelName: 'user_creation',
        userId: this.currentUserId!,
        ...stepInfo,
        metadata
      });
    }
  }

  async trackItemCreationFunnel(step: keyof typeof AdminFunnelEvents, metadata?: Record<string, any>): Promise<void> {
    const stepMapping = {
      ITEM_CREATION_STARTED: { stepName: 'started', stepOrder: 1, success: true },
      ITEM_FORM_FILLED: { stepName: 'form_filled', stepOrder: 2, success: true },
      ITEM_URL_ADDED: { stepName: 'url_added', stepOrder: 3, success: true },
      ITEM_DURATION_CALCULATED: { stepName: 'duration_calculated', stepOrder: 4, success: true },
      ITEM_CREATION_SUCCESS: { stepName: 'success', stepOrder: 5, success: true },
      ITEM_CREATION_FAILED: { stepName: 'failed', stepOrder: 5, success: false }
    };

    const stepInfo = stepMapping[step];
    if (stepInfo) {
      await this.trackFunnelStep({
        funnelName: 'item_creation',
        userId: this.currentUserId!,
        ...stepInfo,
        metadata
      });
    }
  }

  async trackPermissionsFunnel(step: keyof typeof AdminFunnelEvents, metadata?: Record<string, any>): Promise<void> {
    const stepMapping = {
      ROLES_PAGE_VISITED: { stepName: 'page_visited', stepOrder: 1, success: true },
      ROLE_SELECTED: { stepName: 'role_selected', stepOrder: 2, success: true },
      PERMISSIONS_EDIT_STARTED: { stepName: 'edit_started', stepOrder: 3, success: true },
      PERMISSIONS_MODIFIED: { stepName: 'modified', stepOrder: 4, success: true },
      PERMISSIONS_SAVE_SUCCESS: { stepName: 'save_success', stepOrder: 5, success: true },
      PERMISSIONS_SAVE_FAILED: { stepName: 'save_failed', stepOrder: 5, success: false }
    };

    const stepInfo = stepMapping[step];
    if (stepInfo) {
      await this.trackFunnelStep({
        funnelName: 'permissions_management',
        userId: this.currentUserId!,
        ...stepInfo,
        metadata
      });
    }
  }

  // General page tracking
  async trackPageVisit(pageName: string, metadata?: Record<string, any>): Promise<void> {
    await this.trackEvent({
      eventType: AdminFunnelEvents.PAGE_VISITED,
      metadata: {
        pageName,
        ...metadata
      }
    });
  }

  // Component interaction tracking
  async trackInteraction(component: string, action: string, metadata?: Record<string, any>): Promise<void> {
    await this.trackEvent({
      eventType: AdminFunnelEvents.COMPONENT_INTERACTION,
      metadata: {
        component,
        action,
        ...metadata
      }
    });
  }

  // Error tracking
  async trackError(errorMessage: string, context: string, metadata?: Record<string, any>): Promise<void> {
    await this.trackEvent({
      eventType: AdminFunnelEvents.ERROR_OCCURRED,
      metadata: {
        errorMessage,
        context,
        ...metadata
      }
    });
  }
}

export const analyticsService = new AnalyticsService(); 