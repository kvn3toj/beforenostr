/**
 * 🏪 Hook para Marketplace LETS
 * 
 * Maneja listings, transacciones y operaciones del marketplace
 * basado en el sistema de intercambio local (LETS)
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { letsBackendService } from '../lib/lets-backend-service';
import type { 
  LetsListing, 
  UnitsTransaction, 
  UnitsWallet,
  TrustRating 
} from '../lib/lets-backend-service';

// ============================================================================
// HOOKS PARA LISTINGS DEL MARKETPLACE
// ============================================================================

export const useLetsListings = (filters?: {
  type?: 'offer' | 'request';
  category?: string;
  location?: string;
  maxUnitsValue?: number;
  tags?: string[];
  search?: string;
  page?: number;
  limit?: number;
}) => {
  return useQuery({
    queryKey: ['lets-listings', filters],
    queryFn: async () => {
      try {
        return await letsBackendService.getListings(filters);
      } catch (error) {
        console.error('Error fetching LETS listings:', error);
        return { listings: [], total: 0, page: 1, totalPages: 0 };
      }
    },
    staleTime: 30000, // 30 segundos
  });
};

export const useLetsListing = (listingId: string) => {
  return useQuery({
    queryKey: ['lets-listing', listingId],
    queryFn: async () => {
      try {
        return await letsBackendService.getListingById(listingId);
      } catch (error) {
        console.error('Error fetching LETS listing:', error);
        return null;
      }
    },
    enabled: !!listingId,
    staleTime: 60000, // 1 minuto
  });
};

export const useCreateLetsListing = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (listingData: {
      userId: string;
      type: 'offer' | 'request';
      title: string;
      description: string;
      category: string;
      unitsValue: number;
      estimatedHours?: number;
      location: string;
      availabilitySchedule?: Record<string, any>;
      tags: string[];
    }) => {
      return await letsBackendService.createListing(listingData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lets-listings'] });
    },
  });
};

export const useUpdateLetsListing = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ listingId, updateData }: {
      listingId: string;
      updateData: Partial<LetsListing>;
    }) => {
      return await letsBackendService.updateListing(listingId, updateData);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['lets-listings'] });
      queryClient.invalidateQueries({ queryKey: ['lets-listing', variables.listingId] });
    },
  });
};

export const useFulfillLetsListing = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ listingId, fulfillerId, notes }: {
      listingId: string;
      fulfillerId: string;
      notes?: string;
    }) => {
      return await letsBackendService.fulfillListing(listingId, { fulfillerId, notes });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['lets-listings'] });
      queryClient.invalidateQueries({ queryKey: ['lets-listing', variables.listingId] });
      queryClient.invalidateQueries({ queryKey: ['units-wallet'] });
      queryClient.invalidateQueries({ queryKey: ['transaction-history'] });
    },
  });
};

// ============================================================================
// HOOKS PARA WALLET Y TRANSACCIONES
// ============================================================================

export const useUnitsWallet = (userId: string) => {
  return useQuery({
    queryKey: ['units-wallet', userId],
    queryFn: async () => {
      try {
        return await letsBackendService.getWallet(userId);
      } catch (error: any) {
        // Si el wallet no existe, intentar crearlo
        if (error.response?.status === 404) {
          try {
            return await letsBackendService.createWallet(userId);
          } catch (createError) {
            console.error('Error creating wallet:', createError);
            throw createError;
          }
        }
        console.error('Error fetching wallet:', error);
        throw error;
      }
    },
    enabled: !!userId,
    staleTime: 60000, // 1 minuto
  });
};

export const useTransferUnits = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (transferData: {
      fromUserId: string;
      toUserId: string;
      amount: number;
      transactionType: string;
      referenceId?: string;
      description: string;
      metadata?: Record<string, any>;
    }) => {
      return await letsBackendService.transferUnits(transferData);
    },
    onSuccess: (_, variables) => {
      // Invalidar wallets de ambos usuarios
      queryClient.invalidateQueries({ queryKey: ['units-wallet', variables.fromUserId] });
      queryClient.invalidateQueries({ queryKey: ['units-wallet', variables.toUserId] });
      // Invalidar historial de transacciones
      queryClient.invalidateQueries({ queryKey: ['transaction-history'] });
    },
  });
};

export const useTransactionHistory = (userId: string, page = 1, limit = 20) => {
  return useQuery({
    queryKey: ['transaction-history', userId, page, limit],
    queryFn: async () => {
      try {
        return await letsBackendService.getTransactionHistory(userId, page, limit);
      } catch (error) {
        console.error('Error fetching transaction history:', error);
        return { transactions: [], total: 0, page: 1, totalPages: 0 };
      }
    },
    enabled: !!userId,
    staleTime: 30000, // 30 segundos
  });
};

// ============================================================================
// HOOKS PARA SISTEMA DE CONFIANZA
// ============================================================================

export const useTrustScore = (userId: string) => {
  return useQuery({
    queryKey: ['trust-score', userId],
    queryFn: async () => {
      try {
        return await letsBackendService.getTrustScore(userId);
      } catch (error) {
        console.error('Error fetching trust score:', error);
        return {
          trustScore: 0,
          ratingCount: 0,
          averageRating: 0,
          ratingBreakdown: {}
        };
      }
    },
    enabled: !!userId,
    staleTime: 300000, // 5 minutos
  });
};

export const useRateTrust = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ratingData: {
      raterId: string;
      ratedId: string;
      transactionId?: string;
      rating: number;
      communicationRating?: number;
      deliveryRating?: number;
      qualityRating?: number;
      comments?: string;
    }) => {
      return await letsBackendService.rateTrust(ratingData);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['trust-score', variables.ratedId] });
      queryClient.invalidateQueries({ queryKey: ['trust-ratings', variables.ratedId] });
    },
  });
};

export const useTrustRatings = (userId: string) => {
  return useQuery({
    queryKey: ['trust-ratings', userId],
    queryFn: async () => {
      try {
        return await letsBackendService.getTrustRatings(userId);
      } catch (error) {
        console.error('Error fetching trust ratings:', error);
        return [];
      }
    },
    enabled: !!userId,
    staleTime: 300000, // 5 minutos
  });
};

// ============================================================================
// HOOKS PARA MARKETPLACE INTEGRATION
// ============================================================================

export const useMarketplaceItemsWithUnits = (filters?: {
  category?: string;
  maxUnitsPrice?: number;
  location?: string;
  page?: number;
  limit?: number;
}) => {
  return useQuery({
    queryKey: ['marketplace-units-items', filters],
    queryFn: async () => {
      try {
        return await letsBackendService.getMarketplaceItemsWithUnits(filters);
      } catch (error) {
        console.error('Error fetching marketplace items with units:', error);
        return { items: [], total: 0, page: 1, totalPages: 0 };
      }
    },
    staleTime: 60000, // 1 minuto
  });
};

export const useProcessMarketplacePurchase = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (purchaseData: {
      buyerId: string;
      sellerId: string;
      itemId: string;
      unitsAmount: number;
      itemTitle: string;
      category: string;
    }) => {
      return await letsBackendService.processMarketplacePurchase(purchaseData);
    },
    onSuccess: (_, variables) => {
      // Invalidar wallets de comprador y vendedor
      queryClient.invalidateQueries({ queryKey: ['units-wallet', variables.buyerId] });
      queryClient.invalidateQueries({ queryKey: ['units-wallet', variables.sellerId] });
      // Invalidar historial de transacciones
      queryClient.invalidateQueries({ queryKey: ['transaction-history'] });
      // Invalidar items del marketplace
      queryClient.invalidateQueries({ queryKey: ['marketplace-units-items'] });
    },
  });
};

// ============================================================================
// HOOKS PARA ANALYTICS
// ============================================================================

export const useLetsAnalytics = (timeRange?: '7d' | '30d' | '90d' | '1y') => {
  return useQuery({
    queryKey: ['lets-analytics', timeRange],
    queryFn: async () => {
      try {
        return await letsBackendService.getLetsAnalytics(timeRange);
      } catch (error) {
        console.error('Error fetching LETS analytics:', error);
        return {
          totalUnitsCirculating: 0,
          dailyTransactions: 0,
          activeUsers: 0,
          ayniIndex: 0,
          topCategories: [],
          transactionTrends: [],
          trustDistribution: [],
          userGrowth: []
        };
      }
    },
    staleTime: 300000, // 5 minutos
  });
};

export const useUserLetsStats = (userId: string) => {
  return useQuery({
    queryKey: ['user-lets-stats', userId],
    queryFn: async () => {
      try {
        return await letsBackendService.getUserLetsStats(userId);
      } catch (error) {
        console.error('Error fetching user LETS stats:', error);
        return {
          totalTransactions: 0,
          totalUnitsEarned: 0,
          totalUnitsSpent: 0,
          averageTransactionValue: 0,
          trustScore: 0,
          activeListings: 0,
          completedExchanges: 0,
          currentLevel: 1,
          levelName: 'Aprendiz'
        };
      }
    },
    enabled: !!userId,
    staleTime: 300000, // 5 minutos
  });
};

// ============================================================================
// HOOKS PARA SYSTEM HEALTH
// ============================================================================

export const useLetsSystemHealth = () => {
  return useQuery({
    queryKey: ['lets-system-health'],
    queryFn: async () => {
      try {
        return await letsBackendService.getSystemHealth();
      } catch (error) {
        console.error('Error fetching LETS system health:', error);
        return {
          status: 'down' as const,
          totalWallets: 0,
          totalTransactions: 0,
          averageResponseTime: 0,
          lastUpdated: new Date().toISOString()
        };
      }
    },
    staleTime: 60000, // 1 minuto
    refetchInterval: 60000, // Refetch cada minuto
  });
}; 