import { useQuery } from '@tanstack/react-query';
import { fetchServiceStatuses } from '../../services/system.service';
import type { SystemHealthMetric } from '../../types/system.types';

export const useServiceStatusesQuery = () => {
  return useQuery<SystemHealthMetric>({
    queryKey: ['system', 'serviceStatuses'],
    queryFn: fetchServiceStatuses,
  });
}; 