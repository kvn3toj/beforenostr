import { useQuery } from '@tanstack/react-query';
import { fetchLeastInteractedMundos } from '../../services/analytics.service';
import { LeastInteractedMundosMetric } from '../../types/analytics.types';

export const useLeastInteractedMundosQuery = () => {
  return useQuery<LeastInteractedMundosMetric, Error>({
    queryKey: ['analytics', 'leastInteractedMundos'],
    queryFn: fetchLeastInteractedMundos
  });
}; 