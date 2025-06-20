import { useQuery } from '@tanstack/react-query';
import { fetchLeastViewedMundos } from '../../services/analytics.service';
import { LeastViewedMundosMetric } from '../../types/analytics.types';

export const useLeastViewedMundosQuery = () => {
  return useQuery<LeastViewedMundosMetric>({
    queryKey: ['analytics', 'leastViewedMundos'],
    queryFn: fetchLeastViewedMundos,
  });
}; 