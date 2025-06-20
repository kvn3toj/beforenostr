import { useMutation, useQueryClient } from '@tanstack/react-query';
import { completeChallenge } from '../../../services/userChallenge.service';
import type { UserChallenge } from '../../../services/userChallenge.service';
import { useAuth } from '../../useAuth';

export const useCompleteChallengeMutation = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation<UserChallenge, Error, string>({
    mutationFn: completeChallenge,
    onSuccess: () => {
      // Invalidate and refetch user challenges
      queryClient.invalidateQueries({ queryKey: ['myChallenges', user?.id] });
      // Invalidate wallet balances as rewards may have been awarded
      queryClient.invalidateQueries({ queryKey: ['walletBalances', user?.id] });
      // Invalidate transactions as new reward transactions may have been created
      queryClient.invalidateQueries({ queryKey: ['myTransactions', user?.id] });
    },
  });
}; 