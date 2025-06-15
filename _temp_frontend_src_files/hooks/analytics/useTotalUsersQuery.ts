import { useQuery } from '@tanstack/react-query';
import { fetchTotalUsers } from '../../services/analytics.service';
import { TotalCountMetric } from '../../types/analytics.types';

export const useTotalUsersQuery = () => {
  return useQuery<TotalCountMetric, Error>({
    queryKey: ['analytics', 'totalUsers'],
    queryFn: fetchTotalUsers,
  });
}; 