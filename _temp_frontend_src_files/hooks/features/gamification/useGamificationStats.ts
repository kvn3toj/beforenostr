import { useMemo } from 'react';
import { useWalletBalancesQuery } from './useWalletBalancesQuery';
import { useMyTransactionsQuery } from './useMyTransactionsQuery';
import { useMyChallengesQuery } from './useMyChallengesQuery';
import { generateUserStats } from '../../../services/gamification.service';
import type { UserGamificationStats } from '../../../services/gamification.service';

export const useGamificationStats = () => {
  const { data: walletBalances = [], isLoading: isLoadingWallets } = useWalletBalancesQuery();
  const { data: transactions = [], isLoading: isLoadingTransactions } = useMyTransactionsQuery();
  const { data: userChallenges = [], isLoading: isLoadingChallenges } = useMyChallengesQuery();

  const isLoading = isLoadingWallets || isLoadingTransactions || isLoadingChallenges;

  const stats: UserGamificationStats = useMemo(() => {
    if (isLoading) {
      return {
        totalMeritsEarned: 0,
        totalMeritsSpent: 0,
        currentBalance: 0,
        challengesCompleted: 0,
        challengesInProgress: 0,
      };
    }

    return generateUserStats(walletBalances, transactions, userChallenges);
  }, [walletBalances, transactions, userChallenges, isLoading]);

  return {
    stats,
    isLoading,
    walletBalances,
    transactions,
    userChallenges,
  };
}; 