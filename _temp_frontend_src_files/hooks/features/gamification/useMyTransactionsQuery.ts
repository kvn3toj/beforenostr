import { useQuery } from '@tanstack/react-query';
import { fetchMyTransactions } from '../../../services/transaction.service';
import type { MeritTransaction } from '../../../services/transaction.service';
import { useAuth } from '../../useAuth';

export const useMyTransactionsQuery = () => {
  const { user } = useAuth();

  return useQuery<MeritTransaction[]>({
    queryKey: ['myTransactions', user?.id],
    queryFn: () => {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }
      return fetchMyTransactions(user.id);
    },
    enabled: !!user?.id,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}; 