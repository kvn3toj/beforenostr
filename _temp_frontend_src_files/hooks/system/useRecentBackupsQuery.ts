import { useQuery } from '@tanstack/react-query';
import { fetchRecentBackups } from '../../services/system.service';
import type { RecentBackupsMetric } from '../../types/system.types';

export const useRecentBackupsQuery = () => {
  return useQuery<RecentBackupsMetric>({
    queryKey: ['system', 'recentBackups'],
    queryFn: fetchRecentBackups,
  });
}; 