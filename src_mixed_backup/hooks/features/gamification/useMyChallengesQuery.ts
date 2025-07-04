import { useQuery } from '@tanstack/react-query';
import { fetchMyChallenges } from '../../../services/userChallenge.service';
import type { UserChallenge } from '../../../services/userChallenge.service';
import { useAuth } from '../../useAuth';

export const useMyChallengesQuery = () => {
  const { user } = useAuth();

  return useQuery<UserChallenge[]>({
    queryKey: ['myChallenges', user?.id],
    queryFn: fetchMyChallenges,
    enabled: !!user?.id,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}; 