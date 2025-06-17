// 🔄 Hooks para el Sistema LETS (Local Exchange Trading System)
// Integración con React Query para manejo de estado y cache

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { letsApiService } from '../lib/lets-api-service';
import { letsMockService } from '../lib/lets-mock-service';
import { apiService } from '../lib/api-service';

// Switch para usar mock o API real
const USE_MOCK_LETS = true; // Cambiar a false cuando el backend esté listo
const letsService = USE_MOCK_LETS ? letsMockService : letsApiService;
import {
  UnitsWallet,
  UnitsTransaction,
  TransferUnitsData,
  LetsListing,
  LetsSearchFilters,
  CreateLetsListingDto,
  CopKnowledgeExchange,
  CopHierarchyLevel,
  CreateKnowledgeExchangeDto,
  LetsAnalytics,
  TrustRating,
  UserLetsProfile,
  CreateLetsListingRequest,
  TransferUnitsRequest,
  CreateKnowledgeExchangeRequest,
  RateTrustRequest
} from '../types/lets';

// 💰 Hook para wallet de Ünits
export const useUnitsWallet = (userId: string) => {
  return useQuery({
    queryKey: ['units-wallet', userId],
    queryFn: () => letsService.getUnitsWallet(userId),
    staleTime: 30000, // 30 segundos
    enabled: !!userId,
    retry: 2,
    retryDelay: 1000,
  });
};

// 🔄 Hook para transferir Ünits
export const useTransferUnits = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (transferData: TransferUnitsRequest) => letsService.transferUnits(transferData),
    onSuccess: (data, variables) => {
      // Invalidar wallets de ambos usuarios
      queryClient.invalidateQueries({ queryKey: ['units-wallet', variables.toUserId] });
      queryClient.invalidateQueries({ queryKey: ['units-transactions'] });
      
      // Mostrar notificación de éxito
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
    queryKey: ['units-transactions', userId, filters],
    queryFn: async (): Promise<UnitsTransaction[]> => {
      const endpoint = userId ? `/lets/history/${userId}` : '/lets/history';
      const response = await apiService.get(endpoint, { params: filters });
      return response.data || response;
    },
    staleTime: 60000, // 1 minuto
    enabled: true,
  });
};

// 🏪 Hook para listados LETS
export const useLetsListings = (filters?: LetsSearchFilters) => {
  return useQuery({
    queryKey: ['lets-listings', filters],
    queryFn: () => letsService.searchLetsListings(filters || {}),
    staleTime: 60000, // 1 minuto
    enabled: true,
  });
};

// ➕ Hook para crear listado LETS
export const useCreateLetsListing = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (listingData: CreateLetsListingRequest & { userId: string }) => letsService.createLetsListing(listingData),
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

// 🔄 Hook para actualizar listado LETS
export const useUpdateLetsListing = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<CreateLetsListingRequest> }): Promise<LetsListing> => {
      const response = await apiService.put(`/lets/listings/${id}`, data);
      return response.data || response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lets-listings'] });
      console.log('✅ Listado LETS actualizado exitosamente');
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

// 🎓 Hook para intercambios de conocimiento
export const useKnowledgeExchanges = (copId: string) => {
  return useQuery({
    queryKey: ['knowledge-exchanges', copId],
    queryFn: async (): Promise<CopKnowledgeExchange[]> => {
      const response = await apiService.get(`/cops/${copId}/knowledge-exchanges`);
      return response.data || response;
    },
    staleTime: 30000,
    enabled: !!copId,
  });
};

// ➕ Hook para crear intercambio de conocimiento
export const useCreateKnowledgeExchange = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      copId, 
      data 
    }: { 
      copId: string; 
      data: CreateKnowledgeExchangeRequest 
    }): Promise<CopKnowledgeExchange> => {
      const response = await apiService.post(`/cops/${copId}/knowledge-exchanges`, data);
      return response.data || response;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['knowledge-exchanges', variables.copId] });
      console.log('✅ Intercambio de conocimiento creado exitosamente');
    },
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

// 🏆 Hook para jerarquía en CoP
export const useCopHierarchy = (userId: string, copId: string) => {
  return useQuery({
    queryKey: ['cop-hierarchy', userId, copId],
    queryFn: async (): Promise<{
      userLevel: CopHierarchyLevel | null;
      levelProgress: number;
      nextLevelRequirements?: any;
    }> => {
      const response = await apiService.get(`/cops/${copId}/hierarchy/${userId}`);
      return response.data || response;
    },
    staleTime: 300000, // 5 minutos
    enabled: !!userId && !!copId,
  });
};

// ⭐ Hook para evaluar participación
export const useEvaluateParticipation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      exchangeId,
      participantId,
      feedbackRating,
      feedbackComment
    }: {
      exchangeId: string;
      participantId: string;
      feedbackRating: number;
      feedbackComment?: string;
    }): Promise<void> => {
      await apiService.post(`/knowledge-exchanges/${exchangeId}/evaluate`, {
        participantId,
        feedbackRating,
        feedbackComment
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['knowledge-exchanges'] });
      queryClient.invalidateQueries({ queryKey: ['cop-hierarchy'] });
      console.log('✅ Evaluación completada exitosamente');
    },
  });
};

// 🤝 Hook para calificaciones de confianza
export const useTrustRatings = (userId: string) => {
  return useQuery({
    queryKey: ['trust-ratings', userId],
    queryFn: async (): Promise<TrustRating[]> => {
      const response = await apiService.get(`/lets/trust-ratings/${userId}`);
      return response.data || response;
    },
    staleTime: 300000, // 5 minutos
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
      queryClient.invalidateQueries({ queryKey: ['trust-ratings', variables.ratedId] });
      queryClient.invalidateQueries({ queryKey: ['units-wallet', variables.ratedId] });
      console.log('✅ Calificación de confianza enviada');
    },
  });
};

// 📊 Hook para analytics LETS
export const useLetsAnalytics = (timeRange?: 'day' | 'week' | 'month' | 'year') => {
  return useQuery({
    queryKey: ['lets-analytics', timeRange],
    queryFn: () => letsService.getLetsAnalytics(),
    staleTime: 300000, // 5 minutos
    enabled: true,
  });
};

// 🔍 Hook para buscar usuarios por confianza
export const useSearchTrustedUsers = (filters?: {
  minTrustScore?: number;
  location?: string;
  skills?: string[];
}) => {
  return useQuery({
    queryKey: ['trusted-users', filters],
    queryFn: async (): Promise<Array<{
      id: string;
      name: string;
      avatar?: string;
      trustScore: number;
      location?: string;
      skills: string[];
      totalTransactions: number;
    }>> => {
      const response = await apiService.get('/lets/trusted-users', { params: filters });
      return response.data || response;
    },
    staleTime: 120000, // 2 minutos
    enabled: true,
  });
};

// 🎯 Hook para recomendaciones LETS
export const useLetsRecommendations = (userId: string) => {
  return useQuery({
    queryKey: ['lets-recommendations', userId],
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

// 🔔 Hook para notificaciones LETS
export const useLetsNotifications = (userId: string) => {
  return useQuery({
    queryKey: ['lets-notifications', userId],
    queryFn: async (): Promise<Array<{
      id: string;
      type: 'transaction' | 'listing_match' | 'exchange_reminder' | 'trust_rating';
      title: string;
      message: string;
      data?: any;
      read: boolean;
      createdAt: string;
    }>> => {
      const response = await apiService.get(`/lets/notifications/${userId}`);
      return response.data || response;
    },
    staleTime: 30000, // 30 segundos
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
// QUERY KEYS
// ============================================================================

export const LETS_QUERY_KEYS = {
  wallet: (userId: string) => ['lets', 'wallet', userId],
  transactions: (userId: string) => ['lets', 'transactions', userId],
  listings: (filters?: LetsSearchFilters) => ['lets', 'listings', filters],
  listing: (id: string) => ['lets', 'listing', id],
  knowledgeExchanges: (copId: string) => ['lets', 'knowledge-exchanges', copId],
  knowledgeExchange: (id: string) => ['lets', 'knowledge-exchange', id],
  copHierarchy: (copId: string, userId: string) => ['lets', 'cop-hierarchy', copId, userId],
  trustRatings: (userId: string) => ['lets', 'trust-ratings', userId],
  analytics: () => ['lets', 'analytics'],
  userProfile: (userId: string) => ['lets', 'user-profile', userId],
  recommendations: (userId: string) => ['lets', 'recommendations', userId]
} as const;

// ============================================================================
// MARKETPLACE LETS HOOKS
// ============================================================================

/**
 * Hook para obtener un listado específico
 */
export const useLetsListing = (id: string) => {
  return useQuery({
    queryKey: LETS_QUERY_KEYS.listing(id),
    queryFn: async (): Promise<LetsListing> => {
      const response = await apiService.get(`/lets/listings/${id}`);
      return response.data;
    },
    enabled: !!id
  });
};

// ============================================================================
// COMMUNITIES OF PRACTICE KNOWLEDGE EXCHANGE HOOKS
// ============================================================================

/**
 * Hook para obtener un intercambio de conocimiento específico
 */
export const useKnowledgeExchange = (id: string) => {
  return useQuery({
    queryKey: LETS_QUERY_KEYS.knowledgeExchange(id),
    queryFn: async (): Promise<CopKnowledgeExchange> => {
      const response = await apiService.get(`/lets/knowledge-exchanges/${id}`);
      return response.data;
    },
    enabled: !!id
  });
};

// ============================================================================
// HIERARCHY AND PROGRESSION HOOKS
// ============================================================================

/**
 * Hook para promover a un usuario en la jerarquía de CoP
 */
export const usePromoteUserInCop = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      copId, 
      userId, 
      newLevel, 
      requirementsMet 
    }: { 
      copId: string; 
      userId: string; 
      newLevel: number; 
      requirementsMet: any 
    }): Promise<CopHierarchyLevel> => {
      const response = await apiService.post(`/lets/cop/${copId}/promote`, {
        userId,
        newLevel,
        requirementsMet
      });
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ 
        queryKey: LETS_QUERY_KEYS.copHierarchy(data.copId, data.userId) 
      });
    }
  });
};

// ============================================================================
// TRUST SYSTEM HOOKS
// ============================================================================

/**
 * Hook para calificar la confianza de un usuario
 */
export const useRateTrust = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ratingData: RateTrustRequest): Promise<TrustRating> => {
      const response = await apiService.post('/lets/trust-ratings', ratingData);
      return response.data;
    },
    onSuccess: (data) => {
      // Invalidar calificaciones del usuario calificado
      queryClient.invalidateQueries({ 
        queryKey: LETS_QUERY_KEYS.trustRatings(data.ratedId) 
      });
      
      // Invalidar wallet para actualizar trust score
      queryClient.invalidateQueries({ 
        queryKey: LETS_QUERY_KEYS.wallet(data.ratedId) 
      });
    }
  });
};

// ============================================================================
// ANALYTICS AND REPORTING HOOKS
// ============================================================================

/**
 * Hook para obtener el perfil LETS completo de un usuario
 */
export const useUserLetsProfile = (userId: string) => {
  return useQuery({
    queryKey: LETS_QUERY_KEYS.userProfile(userId),
    queryFn: async (): Promise<UserLetsProfile> => {
      const response = await apiService.get(`/lets/users/${userId}/profile`);
      return response.data;
    },
    enabled: !!userId,
    staleTime: 120000 // 2 minutos
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
 * Hook para obtener estadísticas de Ayni (reciprocidad) de un usuario
 */
export const useAyniBalance = (userId: string) => {
  const { data: transactions } = useUnitsTransactions(userId);

  if (!transactions) {
    return {
      given: 0,
      received: 0,
      ayniRatio: 0,
      isBalanced: false,
      recommendation: 'Cargando...'
    };
  }

  const given = transactions
    .filter(t => t.fromUserId === userId)
    .reduce((sum, t) => sum + t.amount, 0);

  const received = transactions
    .filter(t => t.toUserId === userId)
    .reduce((sum, t) => sum + t.amount, 0);

  const ayniRatio = received > 0 ? given / received : given > 0 ? Infinity : 1;
  const isBalanced = ayniRatio >= 0.8 && ayniRatio <= 1.2;

  let recommendation = '';
  if (ayniRatio < 0.8) {
    recommendation = 'Considera ofrecer más servicios para equilibrar tu Ayni';
  } else if (ayniRatio > 1.2) {
    recommendation = 'Podrías recibir más servicios de la comunidad';
  } else {
    recommendation = '¡Excelente balance de reciprocidad!';
  }

  return {
    given,
    received,
    ayniRatio,
    isBalanced,
    recommendation
  };
}; 