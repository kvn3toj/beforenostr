// 🔧 Lets Mock Service - Servicio Mock para Sistema de Economía Colaborativa
// Mock temporal para el sistema Lets hasta integración completa con backend

export interface LetsTransaction {
  id: string;
  fromUserId: string;
  toUserId: string;
  amount: number;
  description: string;
  type: 'PAYMENT' | 'EXCHANGE' | 'SERVICE' | 'PRODUCT';
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED';
  createdAt: Date;
  completedAt?: Date;
}

export interface LetsUser {
  id: string;
  name: string;
  email: string;
  balance: number;
  trustScore: number;
  totalTransactions: number;
}

export interface LetsListing {
  id: string;
  userId: string;
  title: string;
  description: string;
  type: 'SERVICE' | 'PRODUCT';
  priceInLets: number;
  status: 'ACTIVE' | 'INACTIVE' | 'COMPLETED';
  createdAt: Date;
}

export interface LetsBalance {
  userId: string;
  balance: number;
  pendingIn: number;
  pendingOut: number;
  lastUpdated: string;
}

export interface LetsOffer {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: string;
  priceInLets: number;
  isActive: boolean;
  createdAt: string;
}

export interface LetsRequest {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: string;
  maxPriceInLets: number;
  isActive: boolean;
  createdAt: string;
}

class LetsMockService {
  // Mock data
  private mockUsers: LetsUser[] = [
    {
      id: '1',
      name: 'Ana Colaborativa',
      email: 'ana@coomunity.com',
      balance: 150,
      trustScore: 95,
      totalTransactions: 23
    },
    {
      id: '2', 
      name: 'Carlos Emprendedor',
      email: 'carlos@coomunity.com',
      balance: 89,
      trustScore: 87,
      totalTransactions: 15
    }
  ];

  private mockTransactions: LetsTransaction[] = [
    {
      id: '1',
      fromUserId: '1',
      toUserId: '2',
      amount: 25,
      description: 'Clases de guitarra',
      type: 'SERVICE',
      status: 'COMPLETED',
      createdAt: new Date('2025-06-15'),
      completedAt: new Date('2025-06-15')
    }
  ];

  private mockListings: LetsListing[] = [
    {
      id: '1',
      userId: '1',
      title: 'Clases de Filosofía CoomÜnity',
      description: 'Enseñanza de principios de Ayni y Bien Común',
      type: 'SERVICE',
      priceInLets: 30,
      status: 'ACTIVE',
      createdAt: new Date('2025-06-10')
    }
  ];

  // 🪙 Balance y transacciones
  async getBalance(userId: string): Promise<LetsBalance> {
    await this.simulateDelay();
    return {
      userId,
      balance: 150,
      pendingIn: 25,
      pendingOut: 50,
      lastUpdated: new Date().toISOString()
    };
  }

  async getTransactions(userId: string): Promise<LetsTransaction[]> {
    await this.simulateDelay();
    return this.mockTransactions.filter(t => 
      t.fromUserId === userId || t.toUserId === userId
    );
  }

  async createTransaction(transaction: Omit<LetsTransaction, 'id' | 'createdAt' | 'status'>): Promise<LetsTransaction> {
    await this.simulateDelay();
    
    const newTransaction: LetsTransaction = {
      ...transaction,
      id: (this.mockTransactions.length + 1).toString(),
      status: 'PENDING',
      createdAt: new Date()
    };
    
    this.mockTransactions.push(newTransaction);
    return newTransaction;
  }

  async completeTransaction(transactionId: string): Promise<LetsTransaction> {
    await this.simulateDelay();
    
    const transaction = this.mockTransactions.find(t => t.id === transactionId);
    if (!transaction) {
      throw new Error('Transacción no encontrada');
    }
    
    transaction.status = 'COMPLETED';
    transaction.completedAt = new Date();
    
    return transaction;
  }

  // 🏪 Ofertas
  async getOffers(): Promise<LetsOffer[]> {
    await this.simulateDelay();
    return this.mockListings.filter(l => l.type === 'SERVICE' && l.status === 'ACTIVE');
  }

  async getUserOffers(userId: string): Promise<LetsOffer[]> {
    await this.simulateDelay();
    return this.mockListings.filter(l => l.userId === userId && l.type === 'SERVICE' && l.status === 'ACTIVE');
  }

  async createOffer(offer: Omit<LetsOffer, 'id' | 'createdAt'>): Promise<LetsOffer> {
    await this.simulateDelay();
    
    const newOffer: LetsOffer = {
      ...offer,
      id: (this.mockListings.length + 1).toString(),
      createdAt: new Date().toISOString()
    };
    
    this.mockListings.push(newOffer as LetsListing);
    return newOffer;
  }

  // 🙏 Solicitudes
  async getRequests(): Promise<LetsRequest[]> {
    await this.simulateDelay();
    return this.mockListings.filter(l => l.type === 'PRODUCT' && l.status === 'ACTIVE');
  }

  async getUserRequests(userId: string): Promise<LetsRequest[]> {
    await this.simulateDelay();
    return this.mockListings.filter(l => l.userId === userId && l.type === 'PRODUCT' && l.status === 'ACTIVE');
  }

  async createRequest(request: Omit<LetsRequest, 'id' | 'createdAt'>): Promise<LetsRequest> {
    await this.simulateDelay();
    
    const newRequest: LetsRequest = {
      ...request,
      id: (this.mockListings.length + 1).toString(),
      createdAt: new Date().toISOString()
    };
    
    this.mockListings.push(newRequest as LetsListing);
    return newRequest;
  }

  // 🔍 Búsqueda
  async searchOffers(query: string): Promise<LetsOffer[]> {
    await this.simulateDelay();
    
    const lowercaseQuery = query.toLowerCase();
    return this.mockListings.filter(l => 
      l.status === 'ACTIVE' && (
        l.title.toLowerCase().includes(lowercaseQuery) ||
        l.description.toLowerCase().includes(lowercaseQuery)
      )
    );
  }

  async searchRequests(query: string): Promise<LetsRequest[]> {
    await this.simulateDelay();
    
    const lowercaseQuery = query.toLowerCase();
    return this.mockListings.filter(l => 
      l.status === 'ACTIVE' && (
        l.title.toLowerCase().includes(lowercaseQuery) ||
        l.description.toLowerCase().includes(lowercaseQuery)
      )
    );
  }

  // 📊 Estadísticas
  async getMarketStats(): Promise<{
    totalOffers: number;
    totalRequests: number;
    totalTransactions: number;
    activeUsers: number;
  }> {
    await this.simulateDelay();
    
    return {
      totalOffers: this.mockListings.filter(l => l.type === 'SERVICE' && l.status === 'ACTIVE').length,
      totalRequests: this.mockListings.filter(l => l.type === 'PRODUCT' && l.status === 'ACTIVE').length,
      totalTransactions: this.mockTransactions.length,
      activeUsers: this.mockUsers.length
    };
  }

  // 🛠 Utilidades
  private async simulateDelay(ms: number = 500): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // User operations
  async getUserBalance(userId: string): Promise<number> {
    await this.simulateDelay();
    const user = this.mockUsers.find(u => u.id === userId);
    return user?.balance || 0;
  }

  async getUserProfile(userId: string): Promise<LetsUser | null> {
    await this.simulateDelay();
    return this.mockUsers.find(u => u.id === userId) || null;
  }

  // Listing operations
  async createListing(listing: Omit<LetsListing, 'id' | 'createdAt' | 'status'>): Promise<LetsListing> {
    await this.simulateDelay();
    
    const newListing: LetsListing = {
      ...listing,
      id: (this.mockListings.length + 1).toString(),
      status: 'ACTIVE',
      createdAt: new Date()
    };
    
    this.mockListings.push(newListing);
    return newListing;
  }

  async getListings(type?: 'SERVICE' | 'PRODUCT'): Promise<LetsListing[]> {
    await this.simulateDelay();
    
    if (type) {
      return this.mockListings.filter(l => l.type === type && l.status === 'ACTIVE');
    }
    
    return this.mockListings.filter(l => l.status === 'ACTIVE');
  }

  async getUserListings(userId: string): Promise<LetsListing[]> {
    await this.simulateDelay();
    return this.mockListings.filter(l => l.userId === userId);
  }

  // Trust score operations
  async updateTrustScore(userId: string, delta: number): Promise<number> {
    await this.simulateDelay();
    
    const user = this.mockUsers.find(u => u.id === userId);
    if (user) {
      user.trustScore = Math.max(0, Math.min(100, user.trustScore + delta));
      return user.trustScore;
    }
    
    throw new Error('Usuario no encontrado');
  }
}

// Export singleton instance
export const letsMockService = new LetsMockService();

// Export types for external use
export type {
  LetsTransaction,
  LetsUser,
  LetsListing,
  LetsBalance,
  LetsOffer,
  LetsRequest
}; 