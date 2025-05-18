import { useQuery } from '@tanstack/react-query';
import { fetchActiveUsersOverTime } from '../../services/analytics.service';
import { TimeRangeParams } from '../../types/analytics.types';

export const useActiveUsersOverTimeQuery = (params: TimeRangeParams) => {
  return useQuery({
    queryKey: ['analytics', 'activeUsersOverTime', params.interval, params.startDate, params.endDate],
    queryFn: () => fetchActiveUsersOverTime(params),
  });
}; 