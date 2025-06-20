import { useQuery } from '@tanstack/react-query';
import { fetchTopViewedMundos } from '../../services/analytics.service';
import { TopViewedMundosMetric } from '../../types/analytics.types';

export const useTopViewedMundosQuery = () => {
  return useQuery<TopViewedMundosMetric, Error>({
    queryKey: ['analytics', 'topViewedMundos'],
    queryFn: fetchTopViewedMundos,
  });
}; 