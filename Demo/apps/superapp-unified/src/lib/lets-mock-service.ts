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
 * 🔄 LETS Mock Service
 * Servicio mock para desarrollo y testing del sistema LETS
 * Proporciona datos realistas mientras se implementa el backend
 */
export class LetsMockService {
  private mockWallets: Map<string, UnitsWallet> = new Map();
  private mockTransactions: UnitsTransaction[] = [];
  private mockListings: LetsListing[] = [];
  private mockKnowledgeExchanges: CopKnowledgeExchange[] = [];
  private mockHierarchyLevels: Map<string, CopHierarchyLevel> = new Map();

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData() {
    // Mock wallets
    this.mockWallets.set('user-1', {
      id: 'wallet-1',
      userId: 'user-1',
      balance: 25.50,
      creditLimit: 50.00,
      trustScore: 0.87,
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-20T15:30:00Z',
    });

    this.mockWallets.set('user-2', {
      id: 'wallet-2',
      userId: 'user-2',
      balance: -12.25,
      creditLimit: 30.00,
      trustScore: 0.72,
      createdAt: '2024-01-10T08:00:00Z',
      updatedAt: '2024-01-20T12:15:00Z',
    });

    // Mock transactions
    this.mockTransactions = [
      {
        id: 'tx-1',
        fromUserId: 'user-1',
        toUserId: 'user-2',
        amount: 15.00,
        transactionType: 'service',
        referenceId: 'listing-1',
        description: 'Clases de yoga - 3 sesiones',
        metadata: {
          itemTitle: 'Clases de Yoga Básico',
          category: 'bienestar',
          estimatedHours: 3,
        },
        status: 'completed',
        createdAt: '2024-01-20T14:00:00Z',
      },
      {
        id: 'tx-2',
        fromUserId: 'user-2',
        toUserId: 'user-1',
        amount: 8.50,
        transactionType: 'product',
        referenceId: 'listing-2',
        description: 'Verduras orgánicas del huerto',
        metadata: {
          itemTitle: 'Verduras Orgánicas',
          category: 'alimentacion',
          estimatedHours: 0.5,
        },
        status: 'completed',
        createdAt: '2024-01-19T16:30:00Z',
      },
    ];

    // Mock listings
    this.mockListings = [
      {
        id: 'listing-1',
        userId: 'user-1',
        type: 'offer',
        title: 'Clases de Yoga y Meditación',
        description: 'Ofrezco clases personalizadas de yoga y meditación para principiantes y avanzados. Incluye técnicas de respiración y relajación.',
        category: 'bienestar',
        unitsValue: 15.00,
        estimatedHours: 1.5,
        location: 'Centro de la ciudad',
        availabilitySchedule: {
          days: ['lunes', 'miércoles', 'viernes'],
          timeSlots: [{ start: '18:00', end: '20:00' }],
        },
        tags: ['yoga', 'meditación', 'bienestar', 'salud'],
        status: 'active',
        expiresAt: '2024-02-20T23:59:59Z',
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
      },
      {
        id: 'listing-2',
        userId: 'user-2',
        type: 'request',
        title: 'Busco clases de programación web',
        description: 'Necesito aprender desarrollo web moderno (React, TypeScript). Dispongo de tiempo los fines de semana.',
        category: 'tecnologia',
        unitsValue: 20.00,
        estimatedHours: 2.0,
        location: 'Online o presencial',
        availabilitySchedule: {
          days: ['sábado', 'domingo'],
          timeSlots: [{ start: '10:00', end: '16:00' }],
        },
        tags: ['programación', 'react', 'typescript', 'web'],
        status: 'active',
        expiresAt: '2024-02-25T23:59:59Z',
        createdAt: '2024-01-18T14:00:00Z',
        updatedAt: '2024-01-18T14:00:00Z',
      },
      {
        id: 'listing-3',
        userId: 'user-3',
        type: 'offer',
        title: 'Verduras orgánicas de mi huerto',
        description: 'Cultivo verduras orgánicas sin pesticidas. Disponible: lechugas, tomates, zanahorias, hierbas aromáticas.',
        category: 'alimentacion',
        unitsValue: 8.00,
        estimatedHours: 0.5,
        location: 'Zona norte',
        availabilitySchedule: {
          days: ['martes', 'jueves', 'sábado'],
          timeSlots: [{ start: '08:00', end: '12:00' }],
        },
        tags: ['orgánico', 'verduras', 'local', 'sustentable'],
        status: 'active',
        expiresAt: '2024-02-15T23:59:59Z',
        createdAt: '2024-01-12T09:00:00Z',
        updatedAt: '2024-01-12T09:00:00Z',
      },
      {
        id: 'listing-4',
        userId: 'user-4',
        type: 'offer',
        title: 'Reparación de bicicletas',
        description: 'Servicio de mantenimiento y reparación de bicicletas. Incluye ajuste de frenos, cambios, y mantenimiento general.',
        category: 'servicios',
        unitsValue: 12.00,
        estimatedHours: 1.0,
        location: 'Taller móvil',
        availabilitySchedule: {
          days: ['lunes', 'martes', 'miércoles', 'jueves', 'viernes'],
          timeSlots: [{ start: '15:00', end: '19:00' }],
        },
        tags: ['bicicletas', 'reparación', 'mantenimiento', 'móvil'],
        status: 'active',
        expiresAt: '2024-03-01T23:59:59Z',
        createdAt: '2024-01-20T11:00:00Z',
        updatedAt: '2024-01-20T11:00:00Z',
      },
      {
        id: 'listing-5',
        userId: 'user-5',
        type: 'request',
        title: 'Necesito ayuda con mudanza',
        description: 'Busco personas para ayudar con mudanza de apartamento. Tengo camión, solo necesito ayuda para cargar/descargar.',
        category: 'servicios',
        unitsValue: 25.00,
        estimatedHours: 4.0,
        location: 'Centro - Zona sur',
        availabilitySchedule: {
          days: ['sábado'],
          timeSlots: [{ start: '08:00', end: '14:00' }],
        },
        tags: ['mudanza', 'ayuda', 'físico', 'puntual'],
        status: 'active',
        expiresAt: '2024-01-30T23:59:59Z',
        createdAt: '2024-01-22T16:00:00Z',
        updatedAt: '2024-01-22T16:00:00Z',
      },
    ];

    // Mock knowledge exchanges
    this.mockKnowledgeExchanges = [
      {
        id: 'ke-1',
        copId: 'cop-tech',
        teacherId: 'user-1',
        learnerId: 'user-2',
        sessionType: 'one_to_one',
        title: 'Introducción a React y TypeScript',
        description: 'Sesión práctica para aprender los fundamentos de React con TypeScript',
        knowledgeAreas: ['react', 'typescript', 'frontend'],
        unitsCost: 20.00,
        durationHours: 2.0,
        maxParticipants: 1,
        currentParticipants: 1,
        scheduledAt: '2024-01-25T15:00:00Z',
        status: 'scheduled',
        materialsShared: {
          links: ['https://react.dev', 'https://typescriptlang.org'],
          files: ['react-basics.pdf'],
        },
        feedback: null,
        createdAt: '2024-01-20T10:00:00Z',
      },
      {
        id: 'ke-2',
        copId: 'cop-wellness',
        teacherId: 'user-3',
        learnerId: null,
        sessionType: 'workshop',
        title: 'Taller de Agricultura Urbana',
        description: 'Aprende a cultivar tus propias verduras en espacios pequeños',
        knowledgeAreas: ['agricultura', 'sustentabilidad', 'alimentacion'],
        unitsCost: 15.00,
        durationHours: 3.0,
        maxParticipants: 8,
        currentParticipants: 5,
        scheduledAt: '2024-01-28T10:00:00Z',
        status: 'scheduled',
        materialsShared: {
          links: ['https://agricultura-urbana.org'],
          files: ['guia-cultivo-urbano.pdf'],
        },
        feedback: null,
        createdAt: '2024-01-18T14:00:00Z',
      },
    ];

    // Mock hierarchy levels
    this.mockHierarchyLevels.set('user-1-cop-tech', {
      id: 'hl-1',
      copId: 'cop-tech',
      userId: 'user-1',
      level: 4,
      levelName: 'Competente',
      earnedAt: '2024-01-15T10:00:00Z',
      requirementsMet: {
        sessionsAttended: 18,
        hoursLearned: 36,
        sessionsTaught: 3,
        averageRating: 4.3,
      },
      mentorId: 'user-mentor-1',
    });
  }

  // 💰 Wallet Operations

  async getUnitsWallet(userId: string): Promise<UnitsWallet> {
    await this.simulateDelay();
    
    const wallet = this.mockWallets.get(userId);
    if (!wallet) {
      // Create default wallet for new user
      const newWallet: UnitsWallet = {
        id: `wallet-${userId}`,
        userId,
        balance: 0.00,
        creditLimit: 20.00,
        trustScore: 0.50,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      this.mockWallets.set(userId, newWallet);
      return newWallet;
    }
    
    return wallet;
  }

  async createInitialWallet(userId: string): Promise<UnitsWallet> {
    await this.simulateDelay();
    
    const wallet: UnitsWallet = {
      id: `wallet-${userId}`,
      userId,
      balance: 0.00,
      creditLimit: 20.00,
      trustScore: 0.50,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    this.mockWallets.set(userId, wallet);
    return wallet;
  }

  async transferUnits(transferData: TransferUnitsRequest): Promise<UnitsTransaction> {
    await this.simulateDelay();
    
    const fromWallet = this.mockWallets.get(transferData.fromUserId);
    const toWallet = this.mockWallets.get(transferData.toUserId);
    
    if (!fromWallet || !toWallet) {
      throw new Error('Wallet no encontrada');
    }
    
    // Verificar límite de crédito
    const newBalance = fromWallet.balance - transferData.amount;
    if (newBalance < -fromWallet.creditLimit) {
      throw new Error(`Límite de crédito excedido. Disponible: ${fromWallet.creditLimit} Ünits`);
    }
    
    // Actualizar balances
    fromWallet.balance = newBalance;
    fromWallet.updatedAt = new Date().toISOString();
    toWallet.balance += transferData.amount;
    toWallet.updatedAt = new Date().toISOString();
    
    // Crear transacción
    const transaction: UnitsTransaction = {
      id: `tx-${Date.now()}`,
      fromUserId: transferData.fromUserId,
      toUserId: transferData.toUserId,
      amount: transferData.amount,
      transactionType: transferData.transactionType,
      referenceId: transferData.referenceId,
      description: transferData.description,
      metadata: transferData.metadata,
      status: 'completed',
      createdAt: new Date().toISOString(),
    };
    
    this.mockTransactions.unshift(transaction);
    return transaction;
  }

  async getTransactionHistory(
    userId: string,
    limit: number = 50,
    offset: number = 0
  ): Promise<UnitsTransaction[]> {
    await this.simulateDelay();
    
    const userTransactions = this.mockTransactions
      .filter(tx => tx.fromUserId === userId || tx.toUserId === userId)
      .slice(offset, offset + limit);
    
    return userTransactions;
  }

  // 🏪 Marketplace LETS Operations

  async searchLetsListings(filters: LetsSearchFilters): Promise<LetsListing[]> {
    await this.simulateDelay();
    
    let filteredListings = [...this.mockListings];
    
    if (filters.type) {
      filteredListings = filteredListings.filter(listing => listing.type === filters.type);
    }
    
    if (filters.category) {
      filteredListings = filteredListings.filter(listing => listing.category === filters.category);
    }
    
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filteredListings = filteredListings.filter(listing =>
        listing.title.toLowerCase().includes(searchLower) ||
        listing.description.toLowerCase().includes(searchLower) ||
        listing.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }
    
    if (filters.location) {
      filteredListings = filteredListings.filter(listing =>
        listing.location?.toLowerCase().includes(filters.location!.toLowerCase())
      );
    }
    
    if (filters.maxUnitsValue) {
      filteredListings = filteredListings.filter(listing =>
        listing.unitsValue <= filters.maxUnitsValue!
      );
    }
    
    return filteredListings;
  }

  async createLetsListing(listingData: CreateLetsListingRequest & { userId: string }): Promise<LetsListing> {
    await this.simulateDelay();
    
    const newListing: LetsListing = {
      id: `listing-${Date.now()}`,
      userId: listingData.userId,
      type: listingData.type,
      title: listingData.title,
      description: listingData.description,
      category: listingData.category,
      unitsValue: listingData.unitsValue,
      estimatedHours: listingData.estimatedHours,
      location: listingData.location,
      availabilitySchedule: listingData.availabilitySchedule,
      tags: listingData.tags || [],
      status: 'active',
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    this.mockListings.unshift(newListing);
    return newListing;
  }

  async getLetsListing(listingId: string): Promise<LetsListing> {
    await this.simulateDelay();
    
    const listing = this.mockListings.find(l => l.id === listingId);
    if (!listing) {
      throw new Error('Listado no encontrado');
    }
    
    return listing;
  }

  // 📊 Analytics

  async getLetsAnalytics(): Promise<LetsAnalytics> {
    await this.simulateDelay();
    
    return {
      totalUnitsInCirculation: 3456.75,
      totalTransactions: 1247,
      averageTransactionValue: 15.2,
      activeListings: 23,
      communityTrustScore: 0.87,
      topCategories: [
        { category: 'Servicios', transactionCount: 45, unitsVolume: 680 },
        { category: 'Alimentación', transactionCount: 32, unitsVolume: 456 },
        { category: 'Tecnología', transactionCount: 28, unitsVolume: 560 },
        { category: 'Bienestar', transactionCount: 21, unitsVolume: 315 },
      ],
      userEngagement: {
        activeUsers: 89,
        newUsersThisMonth: 12,
        retentionRate: 0.78,
      },
      ayniBalance: {
        giversCount: 45,
        receiversCount: 44,
        balanceRatio: 0.98,
      },
    };
  }

  async getUserLetsStats(userId: string): Promise<{
    totalTransactions: number;
    totalUnitsEarned: number;
    totalUnitsSpent: number;
    averageRating: number;
    trustScore: number;
    ayniBalance: number;
  }> {
    await this.simulateDelay();
    
    const userTransactions = this.mockTransactions.filter(
      tx => tx.fromUserId === userId || tx.toUserId === userId
    );
    
    const totalUnitsEarned = userTransactions
      .filter(tx => tx.toUserId === userId)
      .reduce((sum, tx) => sum + tx.amount, 0);
    
    const totalUnitsSpent = userTransactions
      .filter(tx => tx.fromUserId === userId)
      .reduce((sum, tx) => sum + tx.amount, 0);
    
    const wallet = this.mockWallets.get(userId);
    
    return {
      totalTransactions: userTransactions.length,
      totalUnitsEarned,
      totalUnitsSpent,
      averageRating: 4.2,
      trustScore: wallet?.trustScore || 0.5,
      ayniBalance: totalUnitsEarned - totalUnitsSpent,
    };
  }

  // 🎓 Knowledge Exchange (placeholder)

  async getKnowledgeExchanges(copId: string): Promise<CopKnowledgeExchange[]> {
    await this.simulateDelay();
    return this.mockKnowledgeExchanges.filter(ke => ke.copId === copId);
  }

  async getCopHierarchy(userId: string, copId: string): Promise<CopHierarchyLevel> {
    await this.simulateDelay();
    
    const key = `${userId}-${copId}`;
    const hierarchy = this.mockHierarchyLevels.get(key);
    
    if (!hierarchy) {
      // Return default beginner level
      return {
        id: `hl-${key}`,
        copId,
        userId,
        level: 1,
        levelName: 'Aprendiz',
        earnedAt: new Date().toISOString(),
        requirementsMet: {
          sessionsCompleted: 0,
          hoursContributed: 0,
          positiveRatings: 0,
          knowledgeShared: [],
          mentorshipProvided: 0,
        },
        mentorId: undefined,
      };
    }
    
    return hierarchy;
  }

  // Utility method to simulate network delay
  private async simulateDelay(ms: number = 500): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Instancia singleton del servicio mock
export const letsMockService = new LetsMockService();

// Export default para compatibilidad
export default letsMockService; 