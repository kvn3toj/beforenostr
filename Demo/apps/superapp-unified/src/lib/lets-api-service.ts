import { apiService } from './api-service';
import type {
  UnitsWallet,
  UnitsTransaction,
  LetsListing,
  TrustRating,
  CopKnowledgeExchange,
  CopHierarchyLevel,
  LetsSearchFilters,
  TransferUnitsRequest,
  CreateLetsListingRequest,
  CreateKnowledgeExchangeRequest,
  LetsAnalytics,
} from '../types/lets';

/**
 * 🔄 LETS API Service
 * Servicio dedicado para operaciones del sistema LETS (Local Exchange Trading System)
 * Conecta con el backend NestJS para todas las operaciones de Ünits y intercambios
 */
export class LetsApiService {
  // 💰 Wallet Operations

  /**
   * Obtener wallet de Ünits de un usuario
   */
  async getUnitsWallet(userId: string): Promise<UnitsWallet> {
    const response = await apiService.get<any>(`/lets/balance/${userId}`);
    return response.data;
  }

  /**
   * Crear wallet inicial para nuevo usuario
   */
  async createInitialWallet(userId: string): Promise<UnitsWallet> {
    const response = await apiService.post<any>('/lets/wallet', { userId });
    return response.data;
  }

  /**
   * Transferir Ünits entre usuarios
   */
  async transferUnits(transferData: TransferUnitsRequest): Promise<UnitsTransaction> {
    const response = await apiService.post<any>('/lets/transfer', transferData);
    return response.data;
  }

  /**
   * Obtener historial de transacciones de un usuario
   */
  async getTransactionHistory(
    userId: string,
    limit: number = 50,
    offset: number = 0
  ): Promise<UnitsTransaction[]> {
    const queryParams = new URLSearchParams({
      limit: limit.toString(),
      offset: offset.toString(),
    });
    const response = await apiService.get<any>(`/lets/history/${userId}?${queryParams}`);
    return response.data;
  }

  // 🏪 Marketplace LETS Operations

  /**
   * Buscar listados LETS (ofertas y demandas)
   */
  async searchLetsListings(filters: LetsSearchFilters): Promise<LetsListing[]> {
    console.warn(
      'searchLetsListings is deprecated and returns mock data. Please update to use a new API.'
    );
    return Promise.resolve([]);
  }

  /**
   * Crear nuevo listado LETS
   */
  async createLetsListing(listingData: CreateLetsListingRequest & { userId: string }): Promise<LetsListing> {
    const response = await apiService.post<any>('/lets/listings', listingData);
    return response.data;
  }

  /**
   * Obtener listado LETS por ID
   */
  async getLetsListing(listingId: string): Promise<LetsListing> {
    const response = await apiService.get<any>(`/lets/listings/${listingId}`);
    return response.data;
  }

  /**
   * Actualizar listado LETS
   */
  async updateLetsListing(
    listingId: string,
    updateData: Partial<CreateLetsListingRequest>
  ): Promise<LetsListing> {
    const response = await apiService.put<any>(`/lets/listings/${listingId}`, updateData);
    return response.data;
  }

  /**
   * Eliminar listado LETS
   */
  async deleteLetsListing(listingId: string): Promise<void> {
    await apiService.delete<any>(`/lets/listings/${listingId}`);
  }

  /**
   * Procesar intercambio LETS en marketplace
   */
  async processLetsExchange(
    buyerId: string,
    sellerId: string,
    itemId: string,
    unitsAmount: number
  ): Promise<UnitsTransaction> {
    const response = await apiService.post<any>('/lets/marketplace/exchange', {
      buyerId,
      sellerId,
      itemId,
      unitsAmount,
    });
    return response.data;
  }

  // 🤝 Trust System Operations

  /**
   * Crear evaluación de confianza
   */
  async createTrustRating(ratingData: {
    ratedId: string;
    transactionId?: string;
    rating: number;
    communicationRating?: number;
    deliveryRating?: number;
    qualityRating?: number;
    comments?: string;
  }): Promise<TrustRating> {
    const response = await apiService.post<any>('/lets/trust/rating', ratingData);
    return response.data;
  }

  /**
   * Obtener evaluaciones de confianza de un usuario
   */
  async getTrustRatings(userId: string): Promise<TrustRating[]> {
    const response = await apiService.get<any>(`/lets/trust/ratings/${userId}`);
    return response.data;
  }

  /**
   * Calcular puntuación de confianza
   */
  async calculateTrustScore(userId: string): Promise<number> {
    const response = await apiService.get<any>(`/lets/trust/score/${userId}`);
    return response.data.trustScore;
  }

  /**
   * Ajustar límite de crédito basado en confianza
   */
  async adjustCreditLimit(userId: string): Promise<void> {
    await apiService.post<any>(`/lets/trust/adjust-credit/${userId}`);
  }

  // 🎓 Communities of Practice (CoPs) LETS Operations

  /**
   * Obtener intercambios de conocimiento en una CoP
   */
  async getKnowledgeExchanges(copId: string): Promise<CopKnowledgeExchange[]> {
    const response = await apiService.get<any>(`/cops/${copId}/knowledge-exchanges`);
    return response.data;
  }

  /**
   * Crear sesión de intercambio de conocimiento
   */
  async createKnowledgeExchange(
    copId: string,
    exchangeData: CreateKnowledgeExchangeRequest
  ): Promise<CopKnowledgeExchange> {
    const response = await apiService.post<any>(
      `/cops/${copId}/knowledge-exchanges`,
      exchangeData
    );
    return response.data;
  }

  /**
   * Unirse a intercambio de conocimiento
   */
  async joinKnowledgeExchange(
    exchangeId: string,
    role: 'learner' | 'observer' = 'learner'
  ): Promise<void> {
    await apiService.post<any>(`/cops/knowledge-exchanges/${exchangeId}/join`, {
      role,
    });
  }

  /**
   * Evaluar participación y otorgar Mëritos
   */
  async evaluateParticipation(
    exchangeId: string,
    participantId: string,
    feedbackRating: number,
    feedbackComment?: string
  ): Promise<void> {
    await apiService.post<any>(
      `/cops/knowledge-exchanges/${exchangeId}/evaluate`,
      {
        participantId,
        feedbackRating,
        feedbackComment,
      }
    );
  }

  /**
   * Obtener nivel jerárquico en CoP
   */
  async getCopHierarchy(userId: string, copId: string): Promise<CopHierarchyLevel> {
    const response = await apiService.get<any>(`/cops/${copId}/hierarchy/${userId}`);
    return response.data;
  }

  /**
   * Evaluar progreso jerárquico
   */
  async evaluateHierarchyProgression(userId: string, copId: string): Promise<void> {
    await apiService.post<any>(`/cops/${copId}/hierarchy/${userId}/evaluate`);
  }

  // 📊 Analytics and Statistics

  /**
   * Obtener analytics del sistema LETS
   */
  async getLetsAnalytics(): Promise<LetsAnalytics> {
    const response = await apiService.get<any>('/lets/analytics');
    return response.data;
  }

  /**
   * Obtener estadísticas de usuario LETS
   */
  async getUserLetsStats(userId: string): Promise<{
    totalTransactions: number;
    totalUnitsEarned: number;
    totalUnitsSpent: number;
    averageRating: number;
    trustScore: number;
    ayniBalance: number;
  }> {
    const response = await apiService.get<any>(`/lets/stats/${userId}`);
    return response.data;
  }

  /**
   * Obtener métricas Ayni
   */
  async getAyniMetrics(userId?: string): Promise<{
    globalAyniIndex: number;
    userAyniBalance?: number;
    communityAyniScore: number;
    recommendations: string[];
  }> {
    const url = userId ? `/lets/ayni-metrics/${userId}` : '/lets/ayni-metrics';
    const response = await apiService.get<any>(url);
    return response.data;
  }

  /**
   * Buscar usuarios por habilidades
   */
  async searchUsersBySkills(skills: string[]): Promise<{
    id: string;
    name: string;
    avatar: string;
    skills: string[];
    trustScore: number;
    availableForExchange: boolean;
  }[]> {
    const queryParams = new URLSearchParams({ skills: skills.join(',') });
    const response = await apiService.get<any>(`/users/search/skills?${queryParams}`);
    return response.data;
  }

  /**
   * Obtener recomendaciones de intercambio
   */
  async getExchangeRecommendations(userId: string): Promise<{
    recommendedOffers: LetsListing[];
    recommendedRequests: LetsListing[];
    potentialMatches: {
      offer: LetsListing;
      request: LetsListing;
      matchScore: number;
    }[];
  }> {
    const response = await apiService.get<any>(`/lets/recommendations/exchange/${userId}`);
    return response.data;
  }

  /**
   * Obtener notificaciones LETS
   */
  async getLetsNotifications(userId: string): Promise<{
    id: string;
    type: 'transaction' | 'listing_match' | 'trust_rating' | 'knowledge_exchange';
    title: string;
    message: string;
    data: any;
    read: boolean;
    createdAt: string;
  }[]> {
    const response = await apiService.get<any>(`/lets/notifications/${userId}`);
    return response.data;
  }

  /**
   * Marcar notificación como leída
   */
  async markNotificationAsRead(notificationId: string): Promise<void> {
    await apiService.post<any>(`/lets/notifications/${notificationId}/read`);
  }
}

// Instancia singleton del servicio LETS
export const letsApiService = new LetsApiService();

// Export default para compatibilidad
export default letsApiService;
