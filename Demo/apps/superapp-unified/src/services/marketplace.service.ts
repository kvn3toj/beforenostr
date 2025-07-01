/**
 * 🛒 Marketplace Service - GMP Gamified Match Place
 *
 * Servicio para gestionar el marketplace de CoomÜnity con soporte completo de mocks.
 * Automáticamente detecta si debe usar datos mock o del backend real.
 *
 * 🚨 MODO MOCK ACTIVADO TEMPORALMENTE PARA PRUEBAS DE USUARIO
 */
import { apiService } from './api.service';
import { mockApiService } from '../mocks/mockApiService';
import { MOCK_MARKETPLACE_ITEMS, getMockData } from '../lib/mock-data';

// 🔧 Detectar modo mock
const isMockMode = () => {
  const isProd = import.meta.env.PROD;
  const mockEnabled = import.meta.env.VITE_ENABLE_MOCK_DATA === 'true' ||
                     import.meta.env.VITE_MOCK_MODE === 'true' ||
                     import.meta.env.VITE_MOCK_MARKETPLACE === 'true';
  const useBackend = import.meta.env.VITE_USE_BACKEND === 'true';

  // En producción, si no se especifica usar backend, usar mocks
  if (isProd && !useBackend) {
    return true;
  }

  return mockEnabled;
};

// 📊 Types
export interface MarketplaceItem {
  id: string;
  title: string;
  description: string;
  fullDescription?: string;
  type: 'PRODUCT' | 'SERVICE' | 'EXPERIENCE' | 'SKILL_EXCHANGE';
  price: number;
  originalPrice?: number;
  currency: 'UNIT' | 'ONDAS' | 'MERITOS';
  category: string;
  subcategory?: string;
  tags: string[];
  images: string[];
  mainImage?: string;
  seller: {
    id: string;
    name: string;
    username: string;
    firstName?: string;
    lastName?: string;
    avatarUrl?: string;
    verified: boolean;
    rating: number;
    reviewCount: number;
    responseTime?: string;
    responseRate?: number;
    isOnline?: boolean;
    isActive?: boolean;
    allowMessages?: boolean;
    memberSince?: string;
    location?: string;
    trustLevel?: string;
    meritos?: number;
    badges?: string[];
    contactMethods?: string[];
  };
  location: string;
  rating: number;
  reviewCount: number;
  reviews?: any[];
  status: 'active' | 'inactive' | 'sold' | 'paused';
  featured?: boolean;
  trending?: boolean;
  urgent?: boolean;
  is24Hours?: boolean;
  hasVideo?: boolean;
  viewCount: number;
  favoriteCount: number;
  shareCount?: number;
  discount?: number;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  serviceType?: 'online' | 'in-person' | 'hybrid';
  deliveryOptions?: any[];
  availability?: {
    available: boolean;
    quantity?: number;
    reservations?: number;
    nextAvailable?: string;
  };
  reciprocidadScore?: number;
  bienComunScore?: number;
  impactLevel?: 'local' | 'regional' | 'global';
  sustainabilityScore?: number;
}

export interface MarketplaceResponse {
  items: MarketplaceItem[];
  total: number;
  page?: number;
  limit: number;
  offset?: number;
  hasMore: boolean;
}

export interface MarketplaceFilters {
  category?: string;
  type?: 'PRODUCT' | 'SERVICE' | 'EXPERIENCE' | 'SKILL_EXCHANGE';
  minPrice?: number;
  maxPrice?: number;
  location?: string;
  query?: string;
  tags?: string[];
  featured?: boolean;
  trending?: boolean;
  limit?: number;
  offset?: number;
  sortBy?: 'relevance' | 'price_asc' | 'price_desc' | 'newest' | 'rating' | 'popular';
}

// 🛒 Marketplace Service Class
export class MarketplaceService {
  private logPrefix = '🛒 [MarketplaceService]';

  constructor() {
    const mode = isMockMode() ? 'MOCK' : 'REAL';
    console.log(`${this.logPrefix} Initialized in ${mode} mode`);
  }

  /**
   * 📋 Obtener todos los items del marketplace
   */
  async getItems(filters?: MarketplaceFilters): Promise<MarketplaceResponse> {
    if (isMockMode()) {
      return mockApiService.getMarketplaceItems(filters);
    }
    return apiService.get<MarketplaceResponse>('/marketplace/items', {
      ...(filters && { params: filters })
    });
  }

  /**
   * 🔍 Buscar items en el marketplace
   */
  async searchItems(query: string, filters?: MarketplaceFilters): Promise<MarketplaceResponse> {
    try {
      if (isMockMode()) {
        console.log(`${this.logPrefix} 🟡 Using MOCK data for searchItems: "${query}"`);
        await this.simulateNetworkDelay();

        let items = [...MOCK_MARKETPLACE_ITEMS];

        // Filtrar por query de búsqueda
        if (query.trim()) {
          items = items.filter(item =>
            item.title.toLowerCase().includes(query.toLowerCase()) ||
            item.description.toLowerCase().includes(query.toLowerCase()) ||
            item.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase())) ||
            item.category.toLowerCase().includes(query.toLowerCase())
          );
        }

        // Aplicar filtros adicionales
        if (filters) {
          items = this.applyFiltersToMockData(items, filters);
        }

        const limit = filters?.limit || 20;
        const offset = filters?.offset || 0;

        const paginatedItems = items.slice(offset, offset + limit);

        return {
          items: paginatedItems,
          total: items.length,
          limit,
          offset,
          hasMore: offset + limit < items.length
        };
      }

      // Modo real: llamar al backend
      console.log(`${this.logPrefix} 🌍 Using REAL backend for searchItems: "${query}"`);
      const response = await apiService.get<MarketplaceResponse>(`/marketplace/search`, {
        params: { q: query, ...filters }
      });

      return response;
    } catch (error) {
      console.error(`${this.logPrefix} ❌ Error searching items:`, error);

      // Fallback a datos mock en caso de error del backend
      if (!isMockMode()) {
        console.warn(`${this.logPrefix} 🔄 Falling back to mock data due to backend error`);
        return this.searchItems(query, { ...filters, __forceMock: true } as any);
      }

      throw error;
    }
  }

  /**
   * 📦 Obtener item específico por ID
   */
  async getItemById(itemId: string): Promise<MarketplaceItem | null> {
    try {
      if (isMockMode()) {
        console.log(`${this.logPrefix} 🟡 Using MOCK data for getItemById: ${itemId}`);
        await this.simulateNetworkDelay();

        const item = MOCK_MARKETPLACE_ITEMS.find(item => item.id === itemId);
        return item || null;
      }

      // Modo real: llamar al backend
      console.log(`${this.logPrefix} 🌍 Using REAL backend for getItemById: ${itemId}`);
      const response = await apiService.get<MarketplaceItem>(`/marketplace/items/${itemId}`);

      return response;
    } catch (error) {
      console.error(`${this.logPrefix} ❌ Error getting item by ID:`, error);

      // Fallback a datos mock en caso de error del backend
      if (!isMockMode()) {
        console.warn(`${this.logPrefix} 🔄 Falling back to mock data due to backend error`);
        const item = MOCK_MARKETPLACE_ITEMS.find(item => item.id === itemId);
        return item || null;
      }

      return null;
    }
  }

  /**
   * 🏷️ Obtener categorías disponibles
   */
  async getCategories(): Promise<string[]> {
    try {
      if (isMockMode()) {
        console.log(`${this.logPrefix} 🟡 Using MOCK data for getCategories`);
        await this.simulateNetworkDelay();

        const categories = [...new Set(MOCK_MARKETPLACE_ITEMS.map(item => item.category))];
        return categories.sort();
      }

      // Modo real: llamar al backend
      console.log(`${this.logPrefix} 🌍 Using REAL backend for getCategories`);
      const response = await apiService.get<string[]>('/marketplace/categories');

      return response;
    } catch (error) {
      console.error(`${this.logPrefix} ❌ Error getting categories:`, error);

      // Fallback a datos mock en caso de error del backend
      if (!isMockMode()) {
        console.warn(`${this.logPrefix} 🔄 Falling back to mock data due to backend error`);
        const categories = [...new Set(MOCK_MARKETPLACE_ITEMS.map(item => item.category))];
        return categories.sort();
      }

      return [];
    }
  }

  /**
   * 🔥 Obtener items trending
   */
  async getTrendingItems(limit = 6): Promise<MarketplaceItem[]> {
    try {
      if (isMockMode()) {
        console.log(`${this.logPrefix} 🟡 Using MOCK data for getTrendingItems`);
        await this.simulateNetworkDelay();

        const trendingItems = MOCK_MARKETPLACE_ITEMS
          .filter(item => item.trending)
          .slice(0, limit);

        return trendingItems;
      }

      // Modo real: llamar al backend
      console.log(`${this.logPrefix} 🌍 Using REAL backend for getTrendingItems`);
      const response = await apiService.get<MarketplaceItem[]>(`/marketplace/trending?limit=${limit}`);

      return response;
    } catch (error) {
      console.error(`${this.logPrefix} ❌ Error getting trending items:`, error);

      // Fallback a datos mock en caso de error del backend
      if (!isMockMode()) {
        console.warn(`${this.logPrefix} 🔄 Falling back to mock data due to backend error`);
        const trendingItems = MOCK_MARKETPLACE_ITEMS
          .filter(item => item.trending)
          .slice(0, limit);
        return trendingItems;
      }

      return [];
    }
  }

  /**
   * ⭐ Obtener items featured/destacados
   */
  async getFeaturedItems(limit = 6): Promise<MarketplaceItem[]> {
    try {
      if (isMockMode()) {
        console.log(`${this.logPrefix} 🟡 Using MOCK data for getFeaturedItems`);
        await this.simulateNetworkDelay();

        const featuredItems = MOCK_MARKETPLACE_ITEMS
          .filter(item => item.featured)
          .slice(0, limit);

        return featuredItems;
      }

      // Modo real: llamar al backend
      console.log(`${this.logPrefix} 🌍 Using REAL backend for getFeaturedItems`);
      const response = await apiService.get<MarketplaceItem[]>(`/marketplace/featured?limit=${limit}`);

      return response;
    } catch (error) {
      console.error(`${this.logPrefix} ❌ Error getting featured items:`, error);

      // Fallback a datos mock en caso de error del backend
      if (!isMockMode()) {
        console.warn(`${this.logPrefix} 🔄 Falling back to mock data due to backend error`);
        const featuredItems = MOCK_MARKETPLACE_ITEMS
          .filter(item => item.featured)
          .slice(0, limit);
        return featuredItems;
      }

      return [];
    }
  }

  // 🔧 Métodos de utilidad privados

  /**
   * Aplicar filtros a los datos mock
   */
  private applyFiltersToMockData(items: MarketplaceItem[], filters: MarketplaceFilters): MarketplaceItem[] {
    let filteredItems = [...items];

    if (filters.category) {
      filteredItems = filteredItems.filter(item =>
        item.category.toLowerCase() === filters.category!.toLowerCase()
      );
    }

    if (filters.type) {
      filteredItems = filteredItems.filter(item => item.type === filters.type);
    }

    if (filters.minPrice !== undefined) {
      filteredItems = filteredItems.filter(item => item.price >= filters.minPrice!);
    }

    if (filters.maxPrice !== undefined) {
      filteredItems = filteredItems.filter(item => item.price <= filters.maxPrice!);
    }

    if (filters.location) {
      filteredItems = filteredItems.filter(item =>
        item.location.toLowerCase().includes(filters.location!.toLowerCase())
      );
    }

    if (filters.tags && filters.tags.length > 0) {
      filteredItems = filteredItems.filter(item =>
        filters.tags!.some(tag =>
          item.tags.some(itemTag =>
            itemTag.toLowerCase().includes(tag.toLowerCase())
          )
        )
      );
    }

    if (filters.featured !== undefined) {
      filteredItems = filteredItems.filter(item => item.featured === filters.featured);
    }

    if (filters.trending !== undefined) {
      filteredItems = filteredItems.filter(item => item.trending === filters.trending);
    }

    // Aplicar ordenamiento
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case 'price_asc':
          filteredItems.sort((a, b) => a.price - b.price);
          break;
        case 'price_desc':
          filteredItems.sort((a, b) => b.price - a.price);
          break;
        case 'newest':
          filteredItems.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          break;
        case 'rating':
          filteredItems.sort((a, b) => b.rating - a.rating);
          break;
        case 'popular':
          filteredItems.sort((a, b) => b.viewCount - a.viewCount);
          break;
        default:
          // 'relevance' - mantener orden original
          break;
      }
    }

    return filteredItems;
  }

  /**
   * Simular delay de red para mocks realistas
   */
  private async simulateNetworkDelay(): Promise<void> {
    const delay = Math.random() * 300 + 200; // 200-500ms
    await new Promise(resolve => setTimeout(resolve, delay));
  }
}

// 🚀 Exportar instancia singleton
export const marketplaceService = new MarketplaceService();
