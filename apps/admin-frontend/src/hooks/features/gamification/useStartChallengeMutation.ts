import { useMutation, useQueryClient } from '@tanstack/react-query';
import { startChallenge } from '../../../services/userChallenge.service';
import type { UserChallenge } from '../../../services/userChallenge.service';
import { useAuth } from '../../useAuth';

export const useStartChallengeMutation = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation<UserChallenge, Error, string>({
    mutationFn: startChallenge,
    onSuccess: () => {
      // Invalidate and refetch user challenges
      queryClient.invalidateQueries({ queryKey: ['myChallenges', user?.id] });
      // Also invalidate active challenges to update participant counts
      queryClient.invalidateQueries({ queryKey: ['activeChallenges'] });
    },
  });
}; 