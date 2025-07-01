import { useQuery } from '@tanstack/react-query';
import { fetchUserReciprocidadMetrics } from '../../../services/user.service';
import { useCurrentUserQuery } from '../../useCurrentUserQuery';
import { ReciprocidadMetrics } from '../../../types/reciprocidad.types';

// A simplified version for the widgets, can be expanded.
export interface UPlayMetrics {
    weeklyProgress: number;
    currentStreak: number; // Mocked until available from a specific endpoint
    rank: number;
    totalUsers: number; // Mocked until a total users endpoint is available
}


export const useUPlayMetrics = () => {
  const { data: currentUser } = useCurrentUserQuery();
  const userId = currentUser?.id;

  const { data, isLoading, error, ...rest } = useQuery<ReciprocidadMetrics, Error, UPlayMetrics>({
    queryKey: ['uplay-metrics', userId],
    queryFn: () => {
      if (!userId) {
        throw new Error('User not found');
      }
      return fetchUserReciprocidadMetrics(userId);
    },
    enabled: !!userId, // The query will not run until the userId is available
    staleTime: 1000 * 60 * 5, // Cache data for 5 minutes
    select: (data) => ({
        // This is a placeholder for data that might not be in ReciprocidadMetrics
        weeklyProgress: data.weeklyGrowth || 0,
        currentStreak: 5, // Mocked until available from backend
        rank: data.communityRank || 0,
        totalUsers: 156, // Mocked until a total users endpoint is consumed
    }),
  });


  return {
    metrics: data, // `data` is now of type UPlayMetrics because of the `select` function
    isLoading,
    error,
    ...rest,
  };
};
