import { useQuery } from '@tanstack/react-query';
import { fetchUsersCreatedOverTime } from '../../services/analytics.service';
import { UsersCreatedOverTimeMetric, TimeRangeParams } from '../../types/analytics.types';

export const useUsersCreatedOverTimeQuery = (params: TimeRangeParams) => {
  return useQuery<UsersCreatedOverTimeMetric, Error>({
    queryKey: ['analytics', 'usersCreatedOverTime', params.interval, params.startDate, params.endDate],
    queryFn: () => fetchUsersCreatedOverTime(params),
    // Mantener los datos en caché por 5 minutos
    staleTime: 5 * 60 * 1000,
  });
}; 