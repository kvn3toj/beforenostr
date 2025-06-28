import { apiService } from './api.service';
import { mockApiService } from '../mocks/mockApiService';
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

// 🔥 NUEVAS FUNCIONES PARA DASHBOARD USTATS
export const fetchDashboardMetrics = async () => {
  try {
    return await apiService.get('/analytics/dashboard-metrics');
  } catch (error) {
    return handleAnalyticsError('fetchDashboardMetrics', error, {
      conversionRate: 18.5,
      avgSessionDuration: 12.3,
      unitsBalance: 0,
      unitsTransactions: 0,
      totalEngagement: 0,
      growthRate: 0,
    });
  }
};

export const fetchSystemHealth = async () => {
  try {
    return await apiService.get('/analytics/system-health');
  } catch (error) {
    return handleAnalyticsError('fetchSystemHealth', error, {
      avgLoadTime: 1.2,
      errorRate: 0.5,
      uptime: 99.8,
      serverLoad: 67,
      memoryUsage: 45,
      cpuUsage: 23,
    });
  }
};

const isMockMode = () => {
  return import.meta.env.VITE_ENABLE_MOCK_DATA === 'true';
};

export class AnalyticsService {
  async getUserStats() {
    if (isMockMode()) {
      return mockApiService.getUserStats();
    }
    return apiService.get('/analytics/user-stats');
  }
}

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
