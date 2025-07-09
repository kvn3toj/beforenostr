import { useQuery } from '@tanstack/react-query';
import { fetchMerits } from '../../../services/merit.service';
// Import MeritModel from the domain path
import type { MeritModel } from '../../../types/domain/wallet.model';

export const useMeritsQuery = () => {
  // The hook now returns MeritModel[]
  return useQuery<MeritModel[]>({
    queryKey: ['merits'],
    queryFn: fetchMerits,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}; 