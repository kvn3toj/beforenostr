// 🔄 Hooks para el Sistema LETS (Local Exchange Trading System)
// Integración con React Query para manejo de estado y cache

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { letsApiService } from '../lib/lets-api-service';
import { apiService } from '../lib/api-service';

// Switch para usar mock o API real
const USE_MOCK_LETS = false; // ✅ Cambiado a false para usar backend real
const letsService = letsApiService;

import type {
  // Core types
  UnitsWallet,
  UnitsTransaction,
  LetsListing,
  LetsSearchFilters,
  TrustRating,
  LetsNotification,
  CopKnowledgeExchange,
  LetsAnalytics,
  LetsRecommendation,

  // Request types
  TransferUnitsRequest,
  CreateLetsListingRequest,
  CreateKnowledgeExchangeRequest,
  CreateTrustRatingRequest,
  RateTrustRequest,
} from '../types/lets';

// ============================================================================
// QUERY KEYS - Definidos al inicio para evitar conflictos
// ============================================================================

export const LETS_QUERY_KEYS = {
  wallet: (userId: string) => ['lets-wallet', userId] as const,
  transactions: (userId: string) => ['lets-transactions', userId] as const,
  listings: (filters?: LetsSearchFilters) => ['lets-listings', filters] as const,
  listing: (id: string) => ['lets', 'listing', id] as const,
  knowledgeExchanges: (filters?: { copId?: string; category?: string }) =>
    ['lets-knowledge-exchanges', filters] as const,
  knowledgeExchange: (id: string) => ['lets', 'knowledge-exchange', id] as const,
  copHierarchy: (copId: string, userId: string) => ['lets', 'cop-hierarchy', copId, userId] as const,
  trustRatings: (userId: string) => ['lets-trust-ratings', userId] as const,
  analytics: (timeRange?: string) => ['lets-analytics', timeRange] as const,
  userProfile: (userId: string) => ['lets', 'user-profile', userId] as const,
  recommendations: (userId: string) => ['lets-recommendations', userId] as const,
  notifications: (userId: string) => ['lets-notifications', userId] as const,
} as const;

// ============================================================================
// WALLET Y TRANSACCIONES
// ============================================================================

// 💰 Hook para wallet de Ünits
export const useUnitsWallet = (userId: string) => {
  return useQuery({
    queryKey: LETS_QUERY_KEYS.wallet(userId),
    queryFn: async (): Promise<UnitsWallet> => {
      try {
        const response = await apiService.get(`/lets/wallet/${userId}`);
        return response.data || response;
      } catch (error) {
        console.warn('⚠️ LETS wallet API not available, using fallback:', error);
                  // Fallback data para evitar crashes
          return {
            id: `fallback-${userId}`,
            userId,
            balance: 0,
            creditLimit: 1000,
            trustScore: 0.5,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          } as UnitsWallet;
      }
    },
    staleTime: 30000, // 30 segundos
    enabled: !!userId,
    retry: 1, // Reducir reintentos para evitar spam
    retryDelay: 1000,
  });
};

// 🔄 Hook para transferir Ünits
export const useTransferUnits = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (transferData: TransferUnitsRequest): Promise<UnitsTransaction> => {
      const response = await apiService.post('/lets/transfer', transferData);
      return response.data || response;
    },
    onSuccess: (data, variables) => {
      // Invalidar wallets de ambos usuarios
      queryClient.invalidateQueries({ queryKey: LETS_QUERY_KEYS.wallet(variables.toUserId) });
      queryClient.invalidateQueries({ queryKey: LETS_QUERY_KEYS.transactions(variables.toUserId) });

      console.log('✅ Transferencia de Ünits completada:', data);
    },
    onError: (error) => {
      console.error('❌ Error en transferencia de Ünits:', error);
    },
  });
};

// 📊 Hook para historial de transacciones
export const useUnitsTransactions = (userId?: string, filters?: {
  type?: string;
  limit?: number;
  offset?: number
}) => {
  return useQuery({
    queryKey: LETS_QUERY_KEYS.transactions(userId || 'all'),
    queryFn: async (): Promise<UnitsTransaction[]> => {
      const endpoint = userId ? `/lets/history/${userId}` : '/lets/history';
      const response = await apiService.get(endpoint, { params: filters });
      return response.data || response;
    },
    staleTime: 60000, // 1 minuto
    enabled: true,
  });
};

// ============================================================================
// MARKETPLACE LETS
// ============================================================================

// 🏪 Hook para listados LETS
export const useLetsListings = (filters?: LetsSearchFilters) => {
  return useQuery({
    queryKey: LETS_QUERY_KEYS.listings(filters),
    queryFn: async (): Promise<LetsListing[]> => {
      try {
        const response = await apiService.get('/lets/listings', { params: filters });
        const data = response.data || response;

        // 🛡️ VALIDACIÓN: Asegurar que la respuesta sea un array
        if (!Array.isArray(data)) {
          console.warn('⚠️ LETS listings API no devolvió un array:', data);
          return [];
        }

        return data;
      } catch (error) {
        console.warn('⚠️ LETS listings API error, usando fallback:', error);
        // Fallback: array vacío para evitar crashes
        return [];
      }
    },
    staleTime: 60000, // 1 minuto
    enabled: true,
    // Agregar configuración para evitar reintentos excesivos
    retry: 1,
    retryDelay: 2000,
  });
};

// ➕ Hook para crear listado LETS
export const useCreateLetsListing = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (listingData: CreateLetsListingRequest & { userId: string }): Promise<LetsListing> => {
      const response = await apiService.post('/lets/listings', listingData);
      return response.data || response;
    },
    onSuccess: () => {
      // Invalidar lista de listados
      queryClient.invalidateQueries({ queryKey: ['lets-listings'] });
      console.log('✅ Listado LETS creado exitosamente');
    },
    onError: (error) => {
      console.error('❌ Error creando listado LETS:', error);
    },
  });
};

// 🗑️ Hook para eliminar listado LETS
export const useDeleteLetsListing = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      await apiService.delete(`/lets/listings/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lets-listings'] });
      console.log('✅ Listado LETS eliminado exitosamente');
    },
  });
};

// ============================================================================
// KNOWLEDGE EXCHANGES - VERSIÓN CONSOLIDADA ✅
// ============================================================================

// 🎓 Hook para intercambios de conocimiento - ÚNICA IMPLEMENTACIÓN
export const useKnowledgeExchanges = (filters?: { copId?: string; category?: string }) => {
  return useQuery({
    queryKey: LETS_QUERY_KEYS.knowledgeExchanges(filters),
    queryFn: async (): Promise<CopKnowledgeExchange[]> => {
      const params = new URLSearchParams();
      if (filters?.copId) params.append('copId', filters.copId);
      if (filters?.category) params.append('category', filters.category);

      const queryString = params.toString();
      const url = queryString ? `/lets/knowledge-exchanges?${queryString}` : '/lets/knowledge-exchanges';

      const response = await apiService.get(url);
      return response.data || response;
    },
    staleTime: 2 * 60 * 1000, // 2 minutos
  });
};

// ➕ Hook para crear intercambio de conocimiento - ÚNICA IMPLEMENTACIÓN
export const useCreateKnowledgeExchange = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (exchangeData: {
      copId: string;
      teacherId: string;
      sessionType: string;
      title: string;
      description: string;
      knowledgeAreas: string[];
      unitsCost: number;
      durationHours: number;
      maxParticipants: number;
      scheduledAt: string;
    }): Promise<CopKnowledgeExchange> => {
      const response = await apiService.post('/lets/knowledge-exchanges', exchangeData);
      return response.data || response;
    },
    onSuccess: () => {
      // Invalidar lista de knowledge exchanges
      queryClient.invalidateQueries({
        queryKey: LETS_QUERY_KEYS.knowledgeExchanges({})
      });
      console.log('✅ Intercambio de conocimiento creado exitosamente');
    }
  });
};

// 🤝 Hook para unirse a intercambio de conocimiento
export const useJoinKnowledgeExchange = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      exchangeId,
      role = 'learner'
    }: {
      exchangeId: string;
      role?: 'learner' | 'observer'
    }): Promise<void> => {
      await apiService.post(`/knowledge-exchanges/${exchangeId}/join`, { role });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['knowledge-exchanges'] });
      queryClient.invalidateQueries({ queryKey: ['units-wallet'] });
      console.log('✅ Te has unido al intercambio de conocimiento');
    },
  });
};

// ============================================================================
// TRUST SYSTEM - VERSIÓN CONSOLIDADA ✅
// ============================================================================

// 🤝 Hook para calificaciones de confianza - ÚNICA IMPLEMENTACIÓN
export const useTrustRatings = (userId: string) => {
  return useQuery({
    queryKey: LETS_QUERY_KEYS.trustRatings(userId),
    queryFn: async (): Promise<TrustRating[]> => {
      const response = await apiService.get(`/lets/trust-ratings/${userId}`);
      return response.data || response;
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    enabled: !!userId,
  });
};

// ⭐ Hook para crear calificación de confianza
export const useCreateTrustRating = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ratingData: {
      ratedId: string;
      transactionId?: string;
      rating: number;
      communicationRating?: number;
      deliveryRating?: number;
      qualityRating?: number;
      comments?: string;
    }): Promise<TrustRating> => {
      const response = await apiService.post('/lets/trust-ratings', ratingData);
      return response.data || response;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: LETS_QUERY_KEYS.trustRatings(variables.ratedId) });
      queryClient.invalidateQueries({ queryKey: LETS_QUERY_KEYS.wallet(variables.ratedId) });
      console.log('✅ Calificación de confianza enviada');
    },
  });
};

// ============================================================================
// NOTIFICATIONS - VERSIÓN CONSOLIDADA ✅
// ============================================================================

// 📬 Hook para notificaciones LETS - ÚNICA IMPLEMENTACIÓN
export const useLetsNotifications = (userId: string) => {
  return useQuery({
    queryKey: LETS_QUERY_KEYS.notifications(userId),
    queryFn: async (): Promise<Array<{
      id: string;
      type: 'transaction' | 'listing_match' | 'exchange_request' | 'trust_rating';
      title: string;
      message: string;
      read: boolean;
      createdAt: string;
      metadata?: any;
    }>> => {
      const response = await apiService.get(`/lets/notifications/${userId}`);
      return response.data || response;
    },
    staleTime: 60000, // 1 minuto
    enabled: !!userId,
  });
};

// ✅ Hook para marcar notificación como leída
export const useMarkNotificationRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notificationId: string): Promise<void> => {
      await apiService.patch(`/lets/notifications/${notificationId}/read`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lets-notifications'] });
    },
  });
};

// ============================================================================
// RECOMMENDATIONS AND ANALYTICS
// ============================================================================

// 🎯 Hook para recomendaciones LETS
export const useLetsRecommendations = (userId: string) => {
  return useQuery({
    queryKey: LETS_QUERY_KEYS.recommendations(userId),
    queryFn: async (): Promise<{
      recommendedListings: LetsListing[];
      recommendedExchanges: CopKnowledgeExchange[];
      suggestedConnections: Array<{
        id: string;
        name: string;
        avatar?: string;
        commonInterests: string[];
        trustScore: number;
      }>;
    }> => {
      const response = await apiService.get(`/lets/recommendations/${userId}`);
      return response.data || response;
    },
    staleTime: 600000, // 10 minutos
    enabled: !!userId,
  });
};

// 📊 Hook para analytics LETS
export const useLetsAnalytics = (timeRange?: 'day' | 'week' | 'month' | 'year') => {
  return useQuery({
    queryKey: LETS_QUERY_KEYS.analytics(timeRange),
    queryFn: async (): Promise<LetsAnalytics> => {
      const response = await apiService.get('/lets/analytics', {
        params: timeRange ? { timeRange } : {}
      });
      return response.data || response;
    },
    staleTime: 300000, // 5 minutos
    enabled: true,
  });
};

// ============================================================================
// UTILITY HOOKS
// ============================================================================

/**
 * Hook para verificar si un usuario puede realizar una transacción
 */
export const useCanTransferUnits = (userId: string, amount: number) => {
  const { data: wallet } = useUnitsWallet(userId);

  return {
    canTransfer: wallet ? (wallet.balance - amount) >= -wallet.creditLimit : false,
    availableCredit: wallet ? wallet.creditLimit + wallet.balance : 0,
    wouldExceedLimit: wallet ? (wallet.balance - amount) < -wallet.creditLimit : true,
    currentBalance: wallet?.balance || 0,
    creditLimit: wallet?.creditLimit || 0
  };
};

/**
 * Hook para obtener estadísticas de Reciprocidad de un usuario
 */
export const useReciprocidadBalance = (userId: string) => {
  const { data: transactions } = useUnitsTransactions(userId);

  // 🛡️ SOLUCIÓN: Validación robusta de arrays para prevenir errores de filter
  const safeTransactions = (() => {
    if (!transactions) return [];
    if (Array.isArray(transactions.transactions)) return transactions.transactions;
    if (Array.isArray(transactions)) return transactions;
    return [];
  })();

  // ✅ VERIFICACIÓN ADICIONAL: Asegurar que cada transacción es un objeto válido
  const validatedTransactions = safeTransactions.filter((tx: any) =>
    tx &&
    typeof tx === 'object' &&
    typeof tx.fromUserId === 'string' &&
    typeof tx.toUserId === 'string' &&
    typeof tx.amount === 'number'
  );

  if (!validatedTransactions || validatedTransactions.length === 0) {
    return {
      given: 0,
      received: 0,
      reciprocidadRatio: 0,
      isBalanced: false,
      recommendation: 'Cargando...'
    };
  }

  // ✅ Usar validatedTransactions con validación adicional
  const given = validatedTransactions
    .filter((t: any) => t && t.fromUserId === userId)
    .reduce((sum: number, t: any) => sum + (t.amount || 0), 0);

  const received = validatedTransactions
    .filter((t: any) => t && t.toUserId === userId)
    .reduce((sum: number, t: any) => sum + (t.amount || 0), 0);

  const reciprocidadRatio = received > 0 ? given / received : given > 0 ? Infinity : 1;
  const isBalanced = reciprocidadRatio >= 0.8 && reciprocidadRatio <= 1.2;

  let recommendation = '';
  if (reciprocidadRatio < 0.8) {
    recommendation = 'Considera ofrecer más servicios para equilibrar tu Reciprocidad';
  } else if (reciprocidadRatio > 1.2) {
    recommendation = 'Podrías recibir más servicios de la comunidad';
  } else {
    recommendation = '¡Excelente balance de reciprocidad!';
  }

  return {
    given,
    received,
    reciprocidadRatio,
    isBalanced,
    recommendation
  };
};

// ============================================================================
// ALIAS PARA COMPATIBILIDAD CON COMPONENTES EXISTENTES
// ============================================================================

/**

/**
 * Alias para useReciprocidadBalance - Mantiene compatibilidad con componentes
 * que todavía usan la terminología "Ayni" en lugar de "Reciprocidad"
 * @deprecated Use useReciprocidadBalance instead
 */
export const useAyniBalance = useReciprocidadBalance;
