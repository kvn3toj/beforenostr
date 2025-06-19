import { apiService } from './api.service';
import type { Merit } from './merit.service';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3002';
const WALLETS_ENDPOINT = `${API_BASE_URL}/wallets`;

// Types
export interface Wallet {
  id: string;
  userId: string;
  meritId: string;
  balance: number;
  createdAt: string;
  updatedAt: string;
  merit?: Merit;
}

export interface WalletBalance {
  meritId: string;
  meritSlug: string;
  meritName: string;
  balance: number;
  merit?: Merit;
}

// Wallet Service Functions

// Get all wallet balances for the current user
export const fetchMyWalletBalances = async (userId: string): Promise<WalletBalance[]> => {
  try {
    const response = await apiService.get<WalletBalance[]>(`${WALLETS_ENDPOINT}/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching my wallet balances:', error);
    throw new Error('Failed to fetch wallet balances');
  }
};

// Get balance for a specific merit for the current user
export const fetchMyWalletBalance = async (userId: string, meritSlug: string): Promise<WalletBalance> => {
  try {
    const response = await apiService.get<WalletBalance>(`${WALLETS_ENDPOINT}/user/${userId}/${meritSlug}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching wallet balance for merit ${meritSlug}:`, error);
    throw new Error(`Failed to fetch wallet balance for merit ${meritSlug}`);
  }
};

// Admin Functions

// Get all wallet balances for any user (Admin only)
export const fetchUserWalletBalancesAdmin = async (userId: string): Promise<WalletBalance[]> => {
  try {
    const response = await apiService.get<WalletBalance[]>(`${WALLETS_ENDPOINT}/admin/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching wallet balances for user ${userId} (admin):`, error);
    throw new Error(`Failed to fetch wallet balances for user ${userId}`);
  }
};

// Get balance for a specific merit for any user (Admin only)
export const fetchUserWalletBalanceAdmin = async (userId: string, meritSlug: string): Promise<WalletBalance> => {
  try {
    const response = await apiService.get<WalletBalance>(`${WALLETS_ENDPOINT}/admin/user/${userId}/${meritSlug}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching wallet balance for user ${userId} and merit ${meritSlug} (admin):`, error);
    throw new Error(`Failed to fetch wallet balance for user ${userId} and merit ${meritSlug}`);
  }
}; 