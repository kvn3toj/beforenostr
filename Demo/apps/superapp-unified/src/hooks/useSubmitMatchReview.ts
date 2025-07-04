import { useMutation, useQueryClient } from '@tanstack/react-query';
import { submitMatchReview } from '../services/marketplaceService';

export const useSubmitMatchReview = (matchId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (review: any) => submitMatchReview(matchId, review),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marketplace-match-review', matchId] });
    },
  });
};
