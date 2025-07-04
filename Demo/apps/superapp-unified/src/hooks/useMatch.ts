import { useQuery } from '@tanstack/react-query';
import { getMatch } from '../services/marketplaceService';
import type { Match } from '../types/marketplace';

export const useMatch = (matchId: string) => {
  return useQuery<Match | undefined>({
    queryKey: ['marketplace-match', matchId],
    queryFn: () => getMatch(matchId),
    enabled: !!matchId,
  });
};
