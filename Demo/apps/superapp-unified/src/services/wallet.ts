import apiService from '../lib/api-service';
import { WalletWithUser } from './types'; // Asumiremos que este tipo existe o lo crearemos

/**
 * Fetches the wallet details for the currently authenticated user.
 * This includes their Ünits and Toins balance.
 *
 * @returns {Promise<WalletWithUser>} A promise that resolves to the user's wallet data.
 */
export const getMyWallet = async (): Promise<WalletWithUser> => {
  try {
    const response = await apiService.get<WalletWithUser>('/wallets/me');
    return response;
  } catch (error) {
    console.error('Failed to fetch user wallet:', error);
    // Re-throw the error to be handled by React Query
    throw error;
  }
};
