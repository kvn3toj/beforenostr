import { useQuery } from '@tanstack/react-query';
import { fetchTotalMundos } from '../../services/analytics.service';
import { TotalCountMetric } from '../../types/analytics.types';

export const useTotalMundosQuery = () => {
  return useQuery<TotalCountMetric, Error>({
    queryKey: ['analytics', 'totalMundos'],
    queryFn: fetchTotalMundos,
  });
}; 