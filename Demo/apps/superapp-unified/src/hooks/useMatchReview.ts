import { useQuery } from '@tanstack/react-query';
import { getMatchReview } from '../services/marketplaceService';

export const useMatchReview = (matchId: string) => {
  return useQuery({
    queryKey: ['marketplace-match-review', matchId],
    queryFn: () => getMatchReview(matchId),
    enabled: !!matchId,
  });
};
