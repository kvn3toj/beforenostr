import { useQuery } from '@tanstack/react-query';
import { fetchMyWalletBalances } from '../../../services/wallet.service';
import type { WalletBalance } from '../../../services/wallet.service';
import { useAuth } from '../../useAuth';

export const useWalletBalancesQuery = () => {
  const { user } = useAuth();

  return useQuery<WalletBalance[]>({
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