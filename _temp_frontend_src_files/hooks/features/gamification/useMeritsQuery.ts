import { useQuery } from '@tanstack/react-query';
import { fetchMerits } from '../../../services/merit.service';
import type { Merit } from '../../../services/merit.service';

export const useMeritsQuery = () => {
  return useQuery<Merit[]>({
    queryKey: ['merits'],
    queryFn: fetchMerits,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}; 