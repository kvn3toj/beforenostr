export interface TimeRangeParams {
  interval?: string;
  startDate?: string;
  endDate?: string;
}

export interface TimeSeriesDataPoint {
  time_period: string;
  count: number;
}

export interface ContentViewMetric {
  id: string;
  name: string;
  view_count: number;
  thumbnail_url?: string;
}

export interface ContentInteractionMetric {
  id: string;
  name: string;
  interaction_count: number;
  content_type: 'playlist' | 'mundo';
  thumbnail_url?: string;
}
