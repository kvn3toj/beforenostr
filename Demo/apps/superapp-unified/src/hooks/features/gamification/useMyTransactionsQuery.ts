import { useQuery } from '@tanstack/react-query';
import { fetchMyTransactions } from '../../../services/transaction.service';
// Import TransactionModel from the domain path
import type { TransactionModel } from '../../../types/domain/wallet.model';
import { useAuth } from '../../useAuth';

/**
 * @deprecated Prefer useWalletTransactions from 'hooks/useWalletIntegration.ts'
 */
export const useMyTransactionsQuery = () => {
  const { user } = useAuth();

  // This hook now returns TransactionModel[]
  return useQuery<TransactionModel[]>({
    queryKey: ['myTransactions', user?.id], // Consider renaming queryKey if it conflicts
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