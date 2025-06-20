import { apiService } from './api-service';

// 🔄 LETS Backend Service - Conexión Real con NestJS
// Implementa todas las operaciones LETS contra el backend real

export interface UnitsWallet {
  id: string;
  userId: string;
  balance: number;
  creditLimit: number;
  trustScore: number;
  createdAt: string;
  updatedAt: string;
}

export interface UnitsTransaction {
  id: string;
  fromUserId: string | null;
  toUserId: string;
  amount: number;
  transactionType: 'service' | 'product' | 'knowledge' | 'cop_participation' | 'marketplace_purchase';
  referenceId?: string;
  description: string;
  metadata?: Record<string, any>;
  status: 'pending' | 'completed' | 'failed' | 'disputed';
  createdAt: string;
}

export interface TrustRating {
  id: string;
  raterId: string;
  ratedId: string;
  transactionId?: string;
  rating: number;
  communicationRating?: number;
  deliveryRating?: number;
  qualityRating?: number;
  comments?: string;
  createdAt: string;
}

export interface LetsListing {
  id: string;
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
  status: 'active' | 'fulfilled' | 'expired' | 'cancelled';
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    name: string;
    avatar?: string;
    trustScore: number;
  };
}

export interface KnowledgeExchange {
  id: string;
  copId: string;
  teacherId: string;
  learnerId?: string;
  sessionType: 'one_to_one' | 'workshop' | 'mentoring' | 'group_session';
  title: string;
  description: string;
  knowledgeAreas: string[];
  unitsCost: number;
  durationHours: number;
  maxParticipants: number;
  currentParticipants: number;
  scheduledAt: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  materialsShared?: Record<string, any>;
  feedback?: Record<string, any>;
  createdAt: string;
  teacher?: {
    id: string;
    name: string;
    avatar?: string;
    level: number;
    levelName: string;
  };
}

export interface CopHierarchyLevel {
  id: string;
  copId: string;
  userId: string;
  level: number;
  levelName: string;
  earnedAt: string;
  requirementsMet: Record<string, any>;
  mentorId?: string;
}

export interface LetsAnalytics {
  totalUnitsCirculating: number;
  dailyTransactions: number;
  activeUsers: number;
  ayniIndex: number;
  topCategories: Array<{ name: string; count: number }>;
  transactionTrends: Array<{ date: string; count: number; volume: number }>;
  trustDistribution: Array<{ range: string; count: number }>;
  userGrowth: Array<{ date: string; newUsers: number; activeUsers: number }>;
}

// 💰 Wallet Operations
export const letsBackendService = {
  // Wallet Management
  async getWallet(userId: string): Promise<UnitsWallet> {
    const response = await apiService.get(`/lets/wallet/${userId}`);
    return response.data;
  },

  async createWallet(userId: string): Promise<UnitsWallet> {
    const response = await apiService.post('/lets/wallet', { userId });
    return response.data;
  },

  async updateCreditLimit(userId: string, newLimit: number): Promise<UnitsWallet> {
    const response = await apiService.patch(`/lets/wallet/${userId}/credit-limit`, {
      creditLimit: newLimit
    });
    return response.data;
  },

  // Transactions
  async transferUnits(transferData: {
    fromUserId: string;
    toUserId: string;
    amount: number;
    transactionType: string;
    referenceId?: string;
    description: string;
    metadata?: Record<string, any>;
  }): Promise<UnitsTransaction> {
    const response = await apiService.post('/lets/transfer', transferData);
    return response.data;
  },

  async getTransactionHistory(userId: string, page = 1, limit = 20): Promise<{
    transactions: UnitsTransaction[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const response = await apiService.get(`/lets/history/${userId}`, {
      params: { limit }
    });
    return {
      transactions: response.data,
      total: response.data.length,
      page: 1,
      totalPages: 1
    };
  },

  async getTransactionById(transactionId: string): Promise<UnitsTransaction> {
    // TODO: Implementar endpoint /lets/transactions/detail/:id en el backend
    throw new Error('Transaction detail endpoint not implemented yet');
    // const response = await apiService.get(`/lets/transactions/detail/${transactionId}`);
    // return response.data;
  },

  // Trust System
  async rateTrust(ratingData: {
    raterId: string;
    ratedId: string;
    transactionId?: string;
    rating: number;
    communicationRating?: number;
    deliveryRating?: number;
    qualityRating?: number;
    comments?: string;
  }): Promise<TrustRating> {
    const response = await apiService.post('/lets/trust/rate', ratingData);
    return response.data;
  },

  async getTrustScore(userId: string): Promise<{
    trustScore: number;
    ratingCount: number;
    averageRating: number;
    ratingBreakdown: Record<string, number>;
  }> {
    const response = await apiService.get(`/lets/trust/${userId}`);
    return response.data;
  },

  async getTrustRatings(userId: string): Promise<TrustRating[]> {
    const response = await apiService.get(`/lets/trust/${userId}/ratings`);
    return response.data;
  },

  // Marketplace LETS
  async createListing(listingData: {
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
  }): Promise<LetsListing> {
    const response = await apiService.post('/lets/listings', listingData);
    return response.data;
  },

  async getListings(filters?: {
    type?: 'offer' | 'request';
    category?: string;
    location?: string;
    maxUnitsValue?: number;
    tags?: string[];
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    listings: LetsListing[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const response = await apiService.get('/lets/listings', { params: filters });
    return response.data;
  },

  async getListingById(listingId: string): Promise<LetsListing> {
    const response = await apiService.get(`/lets/listings/${listingId}`);
    return response.data;
  },

  async updateListing(listingId: string, updateData: Partial<LetsListing>): Promise<LetsListing> {
    const response = await apiService.patch(`/lets/listings/${listingId}`, updateData);
    return response.data;
  },

  async deleteListing(listingId: string): Promise<void> {
    await apiService.delete(`/lets/listings/${listingId}`);
  },

  async fulfillListing(listingId: string, fulfillmentData: {
    fulfillerId: string;
    notes?: string;
  }): Promise<UnitsTransaction> {
    const response = await apiService.post(`/lets/listings/${listingId}/fulfill`, fulfillmentData);
    return response.data;
  },

  // Knowledge Exchange (CoPs)
  async createKnowledgeExchange(exchangeData: {
    copId: string;
    teacherId: string;
    sessionType: 'one_to_one' | 'workshop' | 'mentoring' | 'group_session';
    title: string;
    description: string;
    knowledgeAreas: string[];
    unitsCost: number;
    durationHours: number;
    maxParticipants: number;
    scheduledAt: string;
  }): Promise<KnowledgeExchange> {
    const response = await apiService.post('/lets/knowledge-exchange', exchangeData);
    return response.data;
  },

  async getKnowledgeExchanges(copId: string): Promise<KnowledgeExchange[]> {
    const response = await apiService.get(`/lets/knowledge-exchange/cop/${copId}`);
    return response.data;
  },

  async joinKnowledgeExchange(exchangeId: string, participantData: {
    participantId: string;
    role: 'learner' | 'observer';
  }): Promise<void> {
    await apiService.post(`/lets/knowledge-exchange/${exchangeId}/join`, participantData);
  },

  async completeKnowledgeExchange(exchangeId: string, completionData: {
    participantId: string;
    feedbackRating: number;
    feedbackComment?: string;
  }): Promise<void> {
    await apiService.post(`/lets/knowledge-exchange/${exchangeId}/complete`, completionData);
  },

  // Hierarchy System
  async getCopHierarchy(userId: string, copId: string): Promise<CopHierarchyLevel | null> {
    try {
      const response = await apiService.get(`/lets/hierarchy/${copId}/${userId}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },

  async updateHierarchyLevel(userId: string, copId: string): Promise<CopHierarchyLevel> {
    const response = await apiService.post(`/lets/hierarchy/${copId}/${userId}/evaluate`);
    return response.data;
  },

  async getHierarchyRequirements(level: number): Promise<Record<string, any>> {
    const response = await apiService.get(`/lets/hierarchy/requirements/${level}`);
    return response.data;
  },

  // Analytics
  async getLetsAnalytics(timeRange?: '7d' | '30d' | '90d' | '1y'): Promise<LetsAnalytics> {
    const response = await apiService.get('/lets/analytics', {
      params: { timeRange: timeRange || '30d' }
    });
    return response.data;
  },

  async getUserLetsStats(userId: string): Promise<{
    totalTransactions: number;
    totalUnitsEarned: number;
    totalUnitsSpent: number;
    averageTransactionValue: number;
    trustScore: number;
    activeListings: number;
    completedExchanges: number;
    currentLevel: number;
    levelName: string;
  }> {
    const response = await apiService.get(`/lets/analytics/user/${userId}`);
    return response.data;
  },

  // Marketplace Integration
  async processMarketplacePurchase(purchaseData: {
    buyerId: string;
    sellerId: string;
    itemId: string;
    unitsAmount: number;
    itemTitle: string;
    category: string;
  }): Promise<UnitsTransaction> {
    const response = await apiService.post('/lets/marketplace/purchase', purchaseData);
    return response.data;
  },

  async getMarketplaceItemsWithUnits(filters?: {
    category?: string;
    maxUnitsPrice?: number;
    location?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    items: Array<{
      id: string;
      title: string;
      description: string;
      unitsPrice: number;
      estimatedHours?: number;
      category: string;
      seller: {
        id: string;
        name: string;
        trustScore: number;
      };
    }>;
    total: number;
    page: number;
    totalPages: number;
  }> {
    const response = await apiService.get('/lets/marketplace/items', { params: filters });
    return response.data;
  },

  // System Health
  async getSystemHealth(): Promise<{
    status: 'healthy' | 'degraded' | 'down';
    totalWallets: number;
    totalTransactions: number;
    averageResponseTime: number;
    lastUpdated: string;
  }> {
    const response = await apiService.get('/lets/health');
    return response.data;
  }
};

export default letsBackendService; 