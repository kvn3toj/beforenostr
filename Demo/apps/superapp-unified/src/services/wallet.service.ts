import { apiService } from '../../lib/api-service'; // Updated import path
import type { MeritModel } from '../../types/domain/wallet.model'; // Updated to MeritModel
import { EnvironmentHelpers } from '../lib/environment';
import { mockApiService } from '../mocks/mockApiService'; // Assuming this will be extended

// API_BASE_URL is already handled by apiService.
// Services should use relative paths.
const WALLETS_BASE_PATH = '/wallets';

import { UserWalletBalanceModel } from '../../types/domain/wallet.model'; // Import UserWalletBalanceModel

// Types
export interface Wallet { // This type seems specific to a raw wallet entry, might be deprecated or used for specific low-level ops.
  id: string;          // For now, keeping it as it might be used by other parts not yet refactored.
  userId: string;
  meritId: string;
  balance: number;
  createdAt: string;
  updatedAt: string;
  merit?: MeritModel; // Updated to MeritModel
}

// WalletBalance interface is now removed, UserWalletBalanceModel will be used throughout.

// Wallet Service Functions

// Get all wallet balances for the current user
export const fetchMyWalletBalances = async (userId: string): Promise<UserWalletBalanceModel[]> => {
  if (EnvironmentHelpers.isMockEnabled('WALLET')) {
    if (mockApiService.getMockWalletBalances) {
      return mockApiService.getMockWalletBalances(userId);
    }
    console.warn('[WalletService] Mock mode for WALLET, but getMockWalletBalances not in mockApiService. Returning [].');
    return [];
  }
  try {
    const response = await apiService.get<UserWalletBalanceModel[]>(`${WALLETS_BASE_PATH}/user/${userId}`);
    return response;
  } catch (error) {
    console.error('Error fetching my wallet balances:', error);
    throw error; // Re-throw original error
  }
};

// Get balance for a specific merit for the current user
export const fetchMyWalletBalance = async (userId: string, meritSlug: string): Promise<UserWalletBalanceModel | null> => {
  if (EnvironmentHelpers.isMockEnabled('WALLET')) {
    if (mockApiService.getMockWalletBalance) {
      const balance = await mockApiService.getMockWalletBalance(userId, meritSlug);
      return balance || null; // Return null if mock function returns undefined
    }
    console.warn('[WalletService] Mock mode for WALLET, but getMockWalletBalance not in mockApiService. Returning null.');
    return null;
  }
  try {
    const response = await apiService.get<UserWalletBalanceModel>(`${WALLETS_BASE_PATH}/user/${userId}/${meritSlug}`);
    return response;
  } catch (error: any) {
    if (error.statusCode === 404) { // Example of handling a specific error
      console.warn(`Balance for merit ${meritSlug} not found for user ${userId}`);
      return null;
    }
    console.error(`Error fetching wallet balance for merit ${meritSlug}:`, error);
    throw error; // Re-throw original error
  }
};

// Admin Functions (assuming no mock for admin functions for now, or would follow same pattern)

// Get all wallet balances for any user (Admin only)
export const fetchUserWalletBalancesAdmin = async (userId: string): Promise<UserWalletBalanceModel[]> => {
  try {
    const response = await apiService.get<UserWalletBalanceModel[]>(`${WALLETS_BASE_PATH}/admin/user/${userId}`);
    return response;
  } catch (error) {
    console.error(`Error fetching wallet balances for user ${userId} (admin):`, error);
    throw error; // Re-throw original error
  }
};

// Get balance for a specific merit for any user (Admin only)
export const fetchUserWalletBalanceAdmin = async (userId: string, meritSlug: string): Promise<UserWalletBalanceModel | null> => {
  try {
    const response = await apiService.get<UserWalletBalanceModel>(`${WALLETS_BASE_PATH}/admin/user/${userId}/${meritSlug}`);
    return response;
  } catch (error: any) {
    if (error.statusCode === 404) {
      console.warn(`Admin: Balance for merit ${meritSlug} not found for user ${userId}`);
      return null;
    }
    console.error(`Error fetching wallet balance for user ${userId} and merit ${meritSlug} (admin):`, error);
    throw new Error(`Failed to fetch wallet balance for user ${userId} and merit ${meritSlug}`);
  }
}; 