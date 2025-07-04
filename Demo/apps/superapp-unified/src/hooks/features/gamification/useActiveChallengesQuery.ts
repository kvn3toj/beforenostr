import { useQuery } from '@tanstack/react-query';
import { fetchActiveChallenges } from '../../../services/challenge.service';
import type { Challenge } from '../../../services/challenge.service';

export const useActiveChallengesQuery = () => {
  return useQuery<Challenge[]>({
    queryKey: ['activeChallenges'],
    queryFn: fetchActiveChallenges,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}; 