// Gamification Service - Consolidated exports for all gamification functionality
// This service provides a single entry point for all gamification-related operations

// Re-export all merit-related functionality
export * from './merit.service';

// Re-export all wallet-related functionality
export * from './wallet.service';

// Re-export all transaction-related functionality
export * from './transaction.service';

// Re-export all challenge-related functionality
export * from './challenge.service';

// Re-export all user challenge-related functionality
export * from './userChallenge.service';

// Additional utility functions for gamification
import type { Merit } from './merit.service';
import type { WalletBalance } from './wallet.service';
import type { MeritTransaction } from './transaction.service';
import type { Challenge } from './challenge.service';
import type { UserChallenge } from './userChallenge.service';

// Utility types for gamification overview
export interface GamificationOverview {
  totalMerits: number;
  walletBalances: WalletBalance[];
  recentTransactions: MeritTransaction[];
  activeChallenges: Challenge[];
  userChallenges: UserChallenge[];
}

export interface UserGamificationStats {
  totalMeritsEarned: number;
  totalMeritsSpent: number;
  currentBalance: number;
  challengesCompleted: number;
  challengesInProgress: number;
  rank?: number;
}

// Helper functions for gamification calculations
export const calculateTotalBalance = (walletBalances: WalletBalance[]): number => {
  return walletBalances.reduce((total, wallet) => total + wallet.balance, 0);
};

export const calculateMeritsEarned = (transactions: MeritTransaction[]): number => {
  return transactions
    .filter(transaction => transaction.amount > 0)
    .reduce((total, transaction) => total + transaction.amount, 0);
};

export const calculateMeritsSpent = (transactions: MeritTransaction[]): number => {
  return Math.abs(
    transactions
      .filter(transaction => transaction.amount < 0)
      .reduce((total, transaction) => total + transaction.amount, 0)
  );
};

export const getActiveChallengesCount = (userChallenges: UserChallenge[]): number => {
  return userChallenges.filter(
    challenge => challenge.status === 'STARTED' || challenge.status === 'IN_PROGRESS'
  ).length;
};

export const getCompletedChallengesCount = (userChallenges: UserChallenge[]): number => {
  return userChallenges.filter(challenge => challenge.status === 'COMPLETED').length;
};

// Generate user gamification stats
export const generateUserStats = (
  walletBalances: WalletBalance[],
  transactions: MeritTransaction[],
  userChallenges: UserChallenge[]
): UserGamificationStats => {
  return {
    totalMeritsEarned: calculateMeritsEarned(transactions),
    totalMeritsSpent: calculateMeritsSpent(transactions),
    currentBalance: calculateTotalBalance(walletBalances),
    challengesCompleted: getCompletedChallengesCount(userChallenges),
    challengesInProgress: getActiveChallengesCount(userChallenges),
  };
}; 