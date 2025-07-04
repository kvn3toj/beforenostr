// Servicio centralizado de datos mock para la SuperApp
import { mockProducts } from './marketplaceMocks';
import { MOCK_UPLAY_VIDEOS } from './uplayMocks';
import { MOCK_SOCIAL_POSTS } from './socialMocks';
import { MOCK_USTATS } from './ustatsMocks';
import { MOCK_PROFILE } from './profileMocks';

export const mockApiService = {
  // Marketplace
  getMarketplaceItems: async (filters?: any) => {
    // Simula filtrado básico
    return { items: mockProducts, total: mockProducts.length };
  },
  // ÜPlay
  getUPlayVideos: async () => MOCK_UPLAY_VIDEOS,
  // Social
  getSocialPosts: async () => MOCK_SOCIAL_POSTS,
  // UStats
  getUserStats: async () => MOCK_USTATS,
  // Perfil
  getUserProfile: async () => MOCK_PROFILE,
};
