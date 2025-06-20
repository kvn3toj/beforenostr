import { useQuery } from '@tanstack/react-query';
import { fetchMundosCreatedOverTime } from '../../services/analytics.service';
import type { TimeSeriesDataPoint, TimeRangeParams } from '../../types/analytics.types';

export const useMundosCreatedOverTimeQuery = (params: TimeRangeParams) => {
  return useQuery<TimeSeriesDataPoint[]>({
    queryKey: ['analytics', 'mundosCreatedOverTime', params.interval, params.startDate, params.endDate],
    queryFn: () => fetchMundosCreatedOverTime(params),
  });
}; 