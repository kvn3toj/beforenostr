import { useQuery } from '@tanstack/react-query';
import { fetchMyWalletBalances } from '../../../services/wallet.service';
// Import UserWalletBalanceModel from the domain path
import type { UserWalletBalanceModel } from '../../../types/domain/wallet.model';
import { useAuth } from '../../useAuth';

export const useWalletBalancesQuery = () => {
  const { user } = useAuth();

  // The hook now returns UserWalletBalanceModel[]
  return useQuery<UserWalletBalanceModel[]>({
    queryKey: ['walletBalances', user?.id],
    queryFn: () => {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }
      return fetchMyWalletBalances(user.id);
    },
    enabled: !!user?.id,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}; 