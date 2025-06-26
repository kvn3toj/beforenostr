import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { confirmMatch, getMatch } from '../services/marketplaceService';

export function useMatch(matchId: string) {
  return useQuery({
    queryKey: ['match', matchId],
    queryFn: () => getMatch(matchId),
  });
}

export const useConfirmMatch = (matchId: string, role: 'buyer' | 'seller') => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => confirmMatch(matchId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marketplace-match', matchId] });
    },
  });
};
