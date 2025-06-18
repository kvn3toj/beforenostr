import { apiService } from './api.service';
import type { Merit } from './merit.service';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:1111';
const TRANSACTIONS_ENDPOINT = `${API_BASE_URL}/transactions`;

// Types
export interface MeritTransaction {
  id: string;
  userId: string;
  meritId: string;
  amount: number;
  source: string; // e.g., 'CHALLENGE', 'ADMIN', 'PURCHASE'
  sourceId?: string; // ID of the source entity (e.g., challengeId)
  description?: string;
  createdAt: string;
  merit?: Merit;
}

export interface CreateTransactionDto {
  userId: string;
  meritId: string;
  amount: number;
  source: string;
  sourceId?: string;
  description?: string;
}

// Transaction Service Functions

// Get all transactions for the current user
export const fetchMyTransactions = async (userId: string): Promise<MeritTransaction[]> => {
  try {
    const response = await apiService.get<MeritTransaction[]>(`${TRANSACTIONS_ENDPOINT}/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching my transactions:', error);
    throw new Error('Failed to fetch transactions');
  }
};

// Get a specific transaction by ID (Owner or Admin only)
export const fetchTransactionById = async (id: string): Promise<MeritTransaction> => {
  try {
    const response = await apiService.get<MeritTransaction>(`${TRANSACTIONS_ENDPOINT}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching transaction with id ${id}:`, error);
    throw new Error(`Failed to fetch transaction with id ${id}`);
  }
};

// Admin Functions

// Get any transaction by ID (Admin only)
export const fetchTransactionByIdAdmin = async (id: string): Promise<MeritTransaction> => {
  try {
    const response = await apiService.get<MeritTransaction>(`${TRANSACTIONS_ENDPOINT}/admin/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching transaction with id ${id} (admin):`, error);
    throw new Error(`Failed to fetch transaction with id ${id}`);
  }
};

// Get all transactions (Admin only)
export const fetchAllTransactionsAdmin = async (): Promise<MeritTransaction[]> => {
  try {
    const response = await apiService.get<MeritTransaction[]>(`${TRANSACTIONS_ENDPOINT}/admin/all`);
    return response.data;
  } catch (error) {
    console.error('Error fetching all transactions (admin):', error);
    throw new Error('Failed to fetch all transactions');
  }
}; 