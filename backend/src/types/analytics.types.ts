// Tipos básicos para métricas de conteo
export interface TotalCountMetric {
  count: number;
}

// Tipos para métricas de serie temporal
export interface TimeSeriesDataPoint {
  time_period: string; // ISO string date
  count: number;
}

export type UsersCreatedOverTimeMetric = TimeSeriesDataPoint[];

export type ActiveUsersOverTimeMetric = TimeSeriesDataPoint[];

export type TimeInterval = 'day' | 'week' | 'month';

export interface TimeRangeParams {
  interval: TimeInterval;
  startDate: string; // ISO string date
  endDate: string; // ISO string date
}

// Tipos adicionales que podríamos necesitar en el futuro
export interface TimeSeriesMetric {
  timestamp: string;
  value: number;
}

export interface MetricWithChange extends TotalCountMetric {
  change: number; // Porcentaje de cambio respecto al período anterior
  changeType: 'increase' | 'decrease' | 'neutral';
}

// Podemos expandir estos tipos según necesitemos más métricas
export interface AnalyticsSummary {
  totalUsers: TotalCountMetric;
  totalPlaylists: TotalCountMetric;
  totalMundos: TotalCountMetric;
  usersCreatedOverTime?: UsersCreatedOverTimeMetric; // Opcional por ahora
}

// Tipos para métricas de contenido
export interface ContentViewMetric {
  id: string;
  name: string;
  view_count: number;
  thumbnail_url?: string;
}

export type TopViewedPlaylistsMetric = ContentViewMetric[];

export type TopViewedMundosMetric = ContentViewMetric[];

export type LeastViewedPlaylistsMetric = ContentViewMetric[];

export type LeastViewedMundosMetric = ContentViewMetric[];

export interface ContentInteractionMetric {
  id: string;
  name: string;
  interaction_count: number;
  content_type: 'playlist' | 'mundo';
  thumbnail_url?: string;
}

export type TopInteractedContentMetric = ContentInteractionMetric[];

export type LeastInteractedPlaylistsMetric = ContentInteractionMetric[];

export type LeastInteractedMundosMetric = ContentInteractionMetric[];
