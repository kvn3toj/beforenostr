import { apiService } from '../../lib/api-service'; // Updated import path
import type { MeritModel } from '../../types/domain/wallet.model'; // Updated to MeritModel

// API_BASE_URL is already handled by apiService.
// Services should use relative paths.
const TRANSACTIONS_BASE_PATH = '/transactions';

import { TransactionModel } from '../../types/domain/wallet.model'; // Import TransactionModel

// Types
// MeritTransaction interface is removed. TransactionModel will be used.
// CreateTransactionDto might need to be adjusted or a new DTO created based on TransactionModel.

export interface CreateTransactionDto { // This DTO might need to align with TransactionModel fields for creation
  userId: string; // Or fromUserId / toUserId depending on context
  meritId: string; // Or meritSlug
  amount: number;
  source: string;
  sourceId?: string;
  description?: string;
}

// Transaction Service Functions

// Get all transactions for the current user
export const fetchMyTransactions = async (userId: string): Promise<TransactionModel[]> => {
  try {
    const response = await apiService.get<TransactionModel[]>(`${TRANSACTIONS_BASE_PATH}/user/${userId}`);
    return response;
  } catch (error) {
    console.error('Error fetching my transactions:', error);
    throw new Error('Failed to fetch transactions');
  }
};

// Get a specific transaction by ID (Owner or Admin only)
export const fetchTransactionById = async (id: string): Promise<TransactionModel> => {
  try {
    const response = await apiService.get<TransactionModel>(`${TRANSACTIONS_BASE_PATH}/${id}`);
    return response;
  } catch (error) {
    console.error(`Error fetching transaction with id ${id}:`, error);
    throw new Error(`Failed to fetch transaction with id ${id}`);
  }
};

// Admin Functions

// Get any transaction by ID (Admin only)
export const fetchTransactionByIdAdmin = async (id: string): Promise<TransactionModel> => {
  try {
    const response = await apiService.get<TransactionModel>(`${TRANSACTIONS_BASE_PATH}/admin/${id}`);
    return response;
  } catch (error) {
    console.error(`Error fetching transaction with id ${id} (admin):`, error);
    throw new Error(`Failed to fetch transaction with id ${id}`);
  }
};

// Get all transactions (Admin only)
export const fetchAllTransactionsAdmin = async (): Promise<TransactionModel[]> => {
  try {
    const response = await apiService.get<TransactionModel[]>(`${TRANSACTIONS_BASE_PATH}/admin/all`);
    return response;
  } catch (error) {
    console.error('Error fetching all transactions (admin):', error);
    throw new Error('Failed to fetch all transactions');
  }
}; 