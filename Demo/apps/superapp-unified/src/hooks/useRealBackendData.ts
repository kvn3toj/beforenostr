/**
 * 🔗 Real Backend Data Hooks
 * 
 * Hooks personalizados que utilizan React Query para conectarse al backend real
 * y reemplazar gradualmente los datos mockeados con datos reales.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService, socialAPI } from '../lib/api-service';
import { userAPI, gameAPI, walletAPI, marketplaceAPI, videosAPI, statsAPI, formsAPI, mundosAPI } from '../lib/api-service';
import { mockMatches, mockPosts } from '../lib/mockData/socialData';

// 🏷️ Tipos de datos del backend
export interface BackendUser {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  role?: 'user' | 'admin';
  created_at: string;
}

export interface BackendGameData {
  id: string;
  name: string;
  avatar: string;
  level: number;
  experience: number;
  nextLevelExp: number;
  title: string;
  journey: {
    currentStage: string;
    completedQuests: number;
    totalQuests: number;
    currentPath: string;
  };
  stats: {
    wisdom: number;
    courage: number;
    compassion: number;
    insight: number;
  };
}

export interface BackendWalletData {
  balance: number;
  currency: string;
  ucoins: number;
  accounts: Array<{
    id: string;
    type: string;
    balance: number;
  }>;
  transactions: Array<{
    id: string;
    type: string;
    amount: number;
    description: string;
    date: string;
  }>;
}

export interface BackendMarketplaceData {
  id: string;
  businessName: string;
  owner: string;
  rating: number;
  products: Array<{
    id: string;
    name: string;
    price: number;
    category: string;
  }>;
}

// 🎯 Query Keys para organización
export const queryKeys = {
  // Usuario
  user: (userId: string) => ['user', userId],
  userProfile: (userId: string) => ['user', 'profile', userId],
  
  // Gamificación
  gameData: (userId: string) => ['game', 'data', userId],
  quests: ['game', 'quests'],
  
  // Wallet
  walletData: (userId: string) => ['wallet', 'data', userId],
  walletTransactions: (userId: string) => ['wallet', 'transactions', userId],
  
  // Méritos
  userMerits: (userId: string) => ['merits', 'user', userId],
  allMerits: ['merits', 'all'],
  meritsLeaderboard: (limit?: number) => ['merits', 'leaderboard', limit || 10],
  meritHistory: (userId: string, page?: number) => ['merits', 'user', userId, 'history', page || 0],
  
  // Marketplace
  marketplaceData: ['marketplace', 'data'],
  merchantProfile: ['marketplace', 'profile'],
  products: ['marketplace', 'products'],
  
  // Videos
  videoCategories: ['videos', 'categories'],
  videos: (category?: string) => ['videos', 'list', category || 'all'],
  playlists: ['videos', 'playlists'],
  
  // Mundos/Worlds
  mundos: ['mundos', 'list'],
  mundo: (mundoId: string) => ['mundos', 'detail', mundoId],
  mundoBySlug: (slug: string) => ['mundos', 'slug', slug],
  mundoPlaylists: (mundoId: string) => ['mundos', mundoId, 'playlists'],
  
  // Stats
  generalStats: ['stats', 'general'],
  searchStats: ['stats', 'search'],
  userStats: (userId: string) => ['stats', 'user', userId],
  
  // Social
  socialMatches: ['social', 'matches'],
  socialMatch: (matchId: string) => ['social', 'match', matchId],
  socialMessages: (matchId: string) => ['social', 'messages', matchId],
  socialNotifications: ['social', 'notifications'],
  
  // Feed Social
  socialPosts: (page?: number) => ['social', 'posts', page || 0],
  socialPost: (postId: string) => ['social', 'post', postId],
  postComments: (postId: string, page?: number) => ['social', 'post', postId, 'comments', page || 0],
  postLikes: (postId: string) => ['social', 'post', postId, 'likes'],
  
  // Health
  backendHealth: ['backend', 'health'],
};

// 🏥 Hook para verificar estado del backend
export function useBackendHealth() {
  return useQuery({
    queryKey: queryKeys.backendHealth,
    queryFn: () => apiService.healthCheck(),
    staleTime: 1000 * 60 * 5, // 5 minutos
    retry: 3,
    retryDelay: 1000,
  });
}

// 👤 Hook para datos del usuario
export function useUserProfile(userId: string) {
  return useQuery({
    queryKey: queryKeys.userProfile(userId),
    queryFn: async () => {
      try {
        return await userAPI.getProfile(userId);
      } catch (error) {
        // Fallback a datos del contexto de auth si el endpoint falla
        console.warn('🔄 Fallback: Endpoint /users/:id no disponible, usando datos de auth');
        throw error; // Permitir que React Query maneje el error
      }
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 10, // 10 minutos
    retry: (failureCount, error: any) => {
      // No reintentar si es 404 (endpoint no implementado)
      if (error?.message?.includes('404') || error?.message?.includes('Cannot GET')) {
        return false;
      }
      return failureCount < 2;
    },
  });
}

// 🎮 Hook para datos de gamificación
export function useGameData(userId: string) {
  return useQuery({
    queryKey: queryKeys.gameData(userId),
    queryFn: async () => {
      try {
        return await gameAPI.getUserStats(userId);
      } catch (error) {
        // Fallback: crear datos básicos de gamificación
        console.warn('🔄 Fallback: Endpoint /game/user/:id no disponible');
        return {
          id: userId,
          name: 'Usuario CoomÜnity',
          avatar: '/assets/images/default-avatar.jpg',
          level: 1,
          experience: 100,
          nextLevelExp: 500,
          title: 'Explorador',
          journey: {
            currentStage: 'Inicio',
            completedQuests: 0,
            totalQuests: 10,
            currentPath: 'Descubrimiento'
          },
          stats: {
            wisdom: 25,
            courage: 20,
            compassion: 30,
            insight: 15
          }
        };
      }
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutos
    retry: false, // No reintentar para fallback inmediato
  });
}

// 🏆 Hook para quests/misiones
export function useQuests() {
  return useQuery({
    queryKey: queryKeys.quests,
    queryFn: () => gameAPI.getLeaderboard(), // Temporal hasta que haya endpoint de quests
    staleTime: 1000 * 60 * 15, // 15 minutos
  });
}

// 💰 Hook para datos del wallet
export function useWalletData(userId: string) {
  return useQuery({
    queryKey: queryKeys.walletData(userId),
    queryFn: async () => {
      try {
        return await walletAPI.getBalance(userId);
      } catch (error) {
        // Fallback: crear datos básicos de wallet
        console.warn('🔄 Fallback: Endpoint /wallet no disponible');
        return {
          balance: 125075,
          currency: 'COP',
          ucoins: 480,
          accounts: [
            {
              id: 'default',
              type: 'checking',
              balance: 125075
            }
          ],
          transactions: []
        };
      }
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 2, // 2 minutos
    retry: false, // No reintentar para fallback inmediato
  });
}

// 💳 Hook para transacciones del wallet
export function useWalletTransactions(userId: string) {
  return useQuery({
    queryKey: queryKeys.walletTransactions(userId),
    queryFn: async () => {
      try {
        return await walletAPI.getTransactions(userId);
      } catch (error) {
        // Fallback: crear transacciones básicas
        console.warn('🔄 Fallback: Endpoint /wallet/:id/transactions no disponible');
        return [
          {
            id: '1',
            type: 'income',
            amount: 50000,
            description: 'Recompensa inicial CoomÜnity',
            date: new Date().toISOString(),
          }
        ];
      }
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 2, // 2 minutos
    retry: false, // No reintentar para fallback inmediato
  });
}

// 🏆 Hook para méritos del usuario
export function useUserMerits(userId: string) {
  return useQuery({
    queryKey: queryKeys.userMerits(userId),
    queryFn: async () => {
      try {
        return await walletAPI.getMerits(userId);
      } catch (error) {
        // Fallback: crear méritos básicos
        console.warn('🔄 Fallback: Endpoint /merits/user/:id no disponible');
        return {
          totalMerits: 150,
          currentLevel: 'Explorador',
          merits: [
            {
              id: '1',
              type: 'collaboration',
              name: 'Colaborador Activo',
              amount: 50,
              description: 'Por participar en proyectos colaborativos',
              earnedAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
            },
            {
              id: '2',
              type: 'ayni',
              name: 'Espíritu Ayni',
              amount: 75,
              description: 'Por demostrar reciprocidad en intercambios',
              earnedAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
            },
            {
              id: '3',
              type: 'community',
              name: 'Constructor de Comunidad',
              amount: 25,
              description: 'Por contribuir al Bien Común',
              earnedAt: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
            }
          ]
        };
      }
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutos
    retry: false, // No reintentar para fallback inmediato
  });
}

// 🏆 Hook para todos los tipos de méritos disponibles
export function useAllMerits() {
  return useQuery({
    queryKey: queryKeys.allMerits,
    queryFn: async () => {
      try {
        return await walletAPI.getAllMerits();
      } catch (error) {
        // Fallback: tipos de méritos básicos
        console.warn('🔄 Fallback: Endpoint /merits no disponible');
        return [
          {
            id: 'collaboration',
            name: 'Colaboración',
            description: 'Méritos por trabajar en equipo y proyectos colaborativos',
            icon: '🤝',
            color: '#4CAF50'
          },
          {
            id: 'ayni',
            name: 'Ayni',
            description: 'Méritos por demostrar reciprocidad y equilibrio',
            icon: '⚖️',
            color: '#2196F3'
          },
          {
            id: 'community',
            name: 'Bien Común',
            description: 'Méritos por contribuir al bienestar de la comunidad',
            icon: '🌍',
            color: '#FF9800'
          },
          {
            id: 'innovation',
            name: 'Innovación',
            description: 'Méritos por aportar ideas creativas y soluciones',
            icon: '💡',
            color: '#9C27B0'
          }
        ];
      }
    },
    staleTime: 1000 * 60 * 30, // 30 minutos
    retry: false,
  });
}

// 🏅 Hook para leaderboard de méritos
export function useMeritsLeaderboard(limit = 10) {
  return useQuery({
    queryKey: queryKeys.meritsLeaderboard(limit),
    queryFn: async () => {
      try {
        return await walletAPI.getMeritsLeaderboard(limit);
      } catch (error) {
        // Fallback: leaderboard básico
        console.warn('🔄 Fallback: Endpoint /merits/leaderboard no disponible');
        return [
          {
            userId: 'user-1',
            userName: 'María González',
            avatar: '/assets/images/avatars/maria.jpg',
            totalMerits: 450,
            level: 'Maestro Colaborador',
            rank: 1
          },
          {
            userId: 'user-2',
            userName: 'Carlos López',
            avatar: '/assets/images/avatars/carlos.jpg',
            totalMerits: 380,
            level: 'Facilitador Ayni',
            rank: 2
          },
          {
            userId: 'user-3',
            userName: 'Ana Martínez',
            avatar: '/assets/images/avatars/ana.jpg',
            totalMerits: 320,
            level: 'Guardián del Bien Común',
            rank: 3
          }
        ].slice(0, limit);
      }
    },
    staleTime: 1000 * 60 * 10, // 10 minutos
    retry: false,
  });
}

// 📜 Hook para historial de méritos del usuario
export function useMeritHistory(userId: string, page = 0, limit = 20) {
  return useQuery({
    queryKey: queryKeys.meritHistory(userId, page),
    queryFn: async () => {
      try {
        return await walletAPI.getMeritHistory(userId, page, limit);
      } catch (error) {
        // Fallback: historial básico
        console.warn('🔄 Fallback: Endpoint /merits/user/:id/history no disponible');
        return {
          history: [
            {
              id: '1',
              type: 'collaboration',
              amount: 25,
              description: 'Completó proyecto colaborativo "Huerto Comunitario"',
              earnedAt: new Date(Date.now() - 86400000).toISOString(),
              awardedBy: 'Sistema CoomÜnity'
            },
            {
              id: '2',
              type: 'ayni',
              amount: 50,
              description: 'Intercambio equilibrado de servicios con otro miembro',
              earnedAt: new Date(Date.now() - 172800000).toISOString(),
              awardedBy: 'Validación Comunitaria'
            }
          ].slice(page * limit, (page + 1) * limit),
          totalCount: 15,
          currentPage: page,
          totalPages: Math.ceil(15 / limit)
        };
      }
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutos
    retry: false,
  });
}

// 🎖️ Mutación para otorgar méritos
export function useAwardMerit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, meritType, amount, description }: { 
      userId: string; 
      meritType: string; 
      amount: number; 
      description?: string 
    }) =>
      walletAPI.awardMerit(userId, meritType, amount, description),
    onSuccess: (_, variables) => {
      // Invalidar cache relacionado con méritos
      queryClient.invalidateQueries({ queryKey: queryKeys.userMerits(variables.userId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.meritsLeaderboard() });
      queryClient.invalidateQueries({ queryKey: queryKeys.meritHistory(variables.userId) });
    },
  });
}

// 🏪 Hook para datos del marketplace
export function useMarketplaceData() {
  return useQuery({
    queryKey: queryKeys.marketplaceData,
    queryFn: () => marketplaceAPI.getProducts(),
    staleTime: 1000 * 60 * 10, // 10 minutos
  });
}

// 🏬 Hook para perfil del merchant
export function useMerchantProfile() {
  return useQuery({
    queryKey: queryKeys.merchantProfile,
    queryFn: () => userAPI.getUsers(), // Temporal hasta que haya endpoint específico de merchant
    staleTime: 1000 * 60 * 10, // 10 minutos
  });
}

// 📦 Hook para productos del marketplace
export function useProducts() {
  return useQuery({
    queryKey: queryKeys.products,
    queryFn: () => marketplaceAPI.getProducts(),
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}

// 🎥 Hook para categorías de videos
export function useVideoCategories() {
  return useQuery({
    queryKey: queryKeys.videoCategories,
    queryFn: async () => {
      try {
        return await videosAPI.getCategories();
      } catch (error) {
        // Fallback: crear categorías básicas extraídas de video-items
        console.warn('🔄 Fallback: Endpoint /videos/categories no disponible, extrayendo de video-items');
        try {
          const videoItems = await videosAPI.getVideos();
          // Extraer categorías únicas de los video-items
          const categories = new Set();
          videoItems.forEach((item: any) => {
            if (item.categories) {
              const itemCategories = JSON.parse(item.categories);
              itemCategories.forEach((cat: string) => categories.add(cat));
            }
          });
          
          return Array.from(categories).map((cat: any, index) => ({
            id: cat.toLowerCase().replace(/\s+/g, '-'),
            name: cat,
            count: videoItems.filter((item: any) => 
              item.categories && JSON.parse(item.categories).includes(cat)
            ).length
          }));
        } catch (innerError) {
          // Double fallback: categorías hardcodeadas
          return [
            { id: 'educacion', name: 'Educación', count: 15 },
            { id: 'tecnologia', name: 'Tecnología', count: 12 },
            { id: 'comunicacion', name: 'Comunicación', count: 8 }
          ];
        }
      }
    },
    staleTime: 1000 * 60 * 15, // 15 minutos
    retry: false, // No reintentar para fallback inmediato
  });
}

// 📺 Hook para videos
export function useVideos(category?: string) {
  return useQuery({
    queryKey: queryKeys.videos(category),
    queryFn: async () => {
      try {
        // Usar el endpoint real de video-items que sabemos que funciona
        const allVideos = await videosAPI.getVideos();
        
        if (category && category !== 'all') {
          // Filtrar por categoría
          return allVideos.filter((video: any) => {
            if (video.categories) {
              const categories = JSON.parse(video.categories);
              return categories.some((cat: string) => 
                cat.toLowerCase().includes(category.toLowerCase())
              );
            }
            return false;
          });
        }
        
        return allVideos;
      } catch (error) {
        console.warn('🔄 Fallback: Error obteniendo videos');
        return [];
      }
    },
    staleTime: 1000 * 60 * 10, // 10 minutos
    retry: 1,
  });
}

// 📋 Hook para playlists
export function useVideoPlaylists() {
  return useQuery({
    queryKey: queryKeys.playlists,
    queryFn: () => videosAPI.getPlaylists(),
    staleTime: 1000 * 60 * 15, // 15 minutos
  });
}

// 📊 Hook para estadísticas generales
export function useGeneralStats() {
  return useQuery({
    queryKey: queryKeys.generalStats,
    queryFn: () => statsAPI.getGeneral(),
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}

// 🔍 Hook para estadísticas de búsqueda
export function useSearchStats() {
  return useQuery({
    queryKey: queryKeys.searchStats,
    queryFn: () => statsAPI.getSearch(),
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}

// 🎮 Mutación para actualizar progreso del juego
export function useUpdateGameProgress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: any }) =>
      gameAPI.updateUserStats(userId, data),
    onSuccess: (_, variables) => {
      // Invalidar cache del usuario
      queryClient.invalidateQueries({ queryKey: queryKeys.gameData(variables.userId) });
    },
  });
}

// 💰 Mutación para agregar transacción al wallet
export function useAddTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, transaction }: { userId: string; transaction: any }) =>
      // Temporal: usar transfer como placeholder hasta tener addTransaction endpoint
      walletAPI.transfer(userId, transaction.toUserId || userId, transaction.amount),
    onSuccess: (_, variables) => {
      // Invalidar cache del wallet
      queryClient.invalidateQueries({ queryKey: queryKeys.walletData(variables.userId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.walletTransactions(variables.userId) });
    },
  });
}

// 📝 Mutation para enviar formularios
export function useSubmitForm() {
  return useMutation({
    mutationFn: ({ formType, data }: { formType: string; data: any }) =>
      formsAPI.submit(formType, data),
  });
}

// 🛠️ Hook para verificar si el backend real está disponible
export function useBackendAvailability() {
  const { data: healthData, isError, isLoading } = useBackendHealth();
  
  return {
    isAvailable: !isError && !!healthData,
    isLoading,
    healthData,
    shouldUseMock: isError || !healthData,
  };
}

// 🎯 Hook combinado para datos del dashboard
export function useDashboardData(userId: string) {
  const gameData = useGameData(userId);
  const walletData = useWalletData(userId);
  const userProfile = useUserProfile(userId);
  
  return {
    gameData: gameData.data,
    walletData: walletData.data,
    userProfile: userProfile.data,
    isLoading: gameData.isLoading || walletData.isLoading || userProfile.isLoading,
    isError: gameData.isError || walletData.isError || userProfile.isError,
    refetch: () => {
      gameData.refetch();
      walletData.refetch();
      userProfile.refetch();
    },
  };
}

// 🔧 Hook para configuración híbrida (mock + real)
export function useHybridData<T>(
  realDataHook: () => any,
  mockData: T,
  fallbackToMock: boolean = true
) {
  const backendAvailability = useBackendAvailability();
  const realDataQuery = realDataHook();
  
  // Decidir qué datos usar
  const shouldUseMock = fallbackToMock && (backendAvailability.shouldUseMock || realDataQuery.isError);
  
  return {
    data: shouldUseMock ? mockData : realDataQuery.data,
    isLoading: backendAvailability.isLoading || realDataQuery.isLoading,
    isError: !shouldUseMock && realDataQuery.isError,
    isUsingMock: shouldUseMock,
    isUsingReal: !shouldUseMock && !!realDataQuery.data,
    refetch: realDataQuery.refetch,
  };
}

// 🤝 Hooks para el módulo Social/Chat
export function useSocialMatches() {
  return useQuery({
    queryKey: queryKeys.socialMatches,
    queryFn: async () => {
      try {
        return await socialAPI.getMatches();
      } catch (error) {
        // Fallback: crear matches básicos
        console.warn('🔄 Fallback: Endpoint /social/matches no disponible');
        return {
          data: mockMatches
        };
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
    retry: false, // No reintentar para fallback inmediato
  });
}

export function useMatchDetails(matchId: string) {
  return useQuery({
    queryKey: ['social', 'matches', matchId],
    queryFn: () => socialAPI.getMatch(matchId),
    enabled: !!matchId,
    staleTime: 1000 * 60 * 10, // 10 minutos
  });
}

export function useMatchMessages(matchId: string, page = 0, limit = 50) {
  return useQuery({
    queryKey: ['social', 'messages', matchId, page],
    queryFn: () => socialAPI.getMessages(matchId, page, limit),
    enabled: !!matchId,
    staleTime: 1000 * 30, // 30 segundos para mensajes
    refetchOnWindowFocus: true,
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ matchId, content, type }: { 
      matchId: string; 
      content: string; 
      type?: 'text' | 'emoji' | 'audio' 
    }) => socialAPI.sendMessage(matchId, content, type),
    
    onSuccess: (data, variables) => {
      // Invalidar mensajes del match específico
      queryClient.invalidateQueries({
        queryKey: ['social', 'messages', variables.matchId]
      });
      
      // Actualizar la lista de matches (para el último mensaje)
      queryClient.invalidateQueries({
        queryKey: ['social', 'matches']
      });
    },
    
    onError: (error) => {
      console.error('Error enviando mensaje:', error);
    }
  });
}

export function useUpdateUserStatus() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (status: 'online' | 'away' | 'offline') => 
      socialAPI.updateUserStatus(status),
    
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['social', 'matches']
      });
    },
    
    onError: (error) => {
      console.error('Error actualizando estado:', error);
    }
  });
}

export function useSocialNotifications() {
  return useQuery({
    queryKey: ['social', 'notifications'],
    queryFn: () => socialAPI.getNotifications(),
    staleTime: 1000 * 60 * 2, // 2 minutos
    refetchInterval: 1000 * 30, // Refetch cada 30 segundos
  });
}

export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (notificationId: string) => 
      socialAPI.markNotificationAsRead(notificationId),
    
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['social', 'notifications']
      });
    }
  });
}

// 📝 Hooks para Feed Social

// Hook para obtener posts del feed
export function useSocialPosts(page = 0, limit = 20) {
  return useQuery({
    queryKey: queryKeys.socialPosts(page),
    queryFn: async () => {
      try {
        return await socialAPI.getPosts(page, limit);
      } catch (error) {
        // Fallback: usar datos mock del feed social
        console.warn('🔄 Fallback: Endpoint /social/posts no disponible');
        const startIndex = page * limit;
        const endIndex = startIndex + limit;
        return {
          posts: mockPosts.slice(startIndex, endIndex),
          totalCount: mockPosts.length,
          currentPage: page,
          totalPages: Math.ceil(mockPosts.length / limit),
          hasNextPage: endIndex < mockPosts.length
        };
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
    refetchOnWindowFocus: false,
    placeholderData: (previousData) => previousData, // Mantener datos previos mientras carga
    retry: false, // No reintentar para fallback inmediato
  });
}

// Hook para obtener un post específico
export function useSocialPost(postId: string) {
  return useQuery({
    queryKey: queryKeys.socialPost(postId),
    queryFn: () => socialAPI.getPost(postId),
    enabled: !!postId,
    staleTime: 1000 * 60 * 10, // 10 minutos
  });
}

// Hook para crear un nuevo post
export function useCreatePost() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ content, type, media }: {
      content: string;
      type?: 'text' | 'image' | 'video';
      media?: File;
    }) => socialAPI.createPost(content, type, media),
    
    onSuccess: () => {
      // Invalidar todas las páginas de posts para mostrar el nuevo post
      queryClient.invalidateQueries({
        queryKey: ['social', 'posts']
      });
      
      // También invalidar notificaciones por si hay menciones
      queryClient.invalidateQueries({
        queryKey: ['social', 'notifications']
      });
    },
    
    onError: (error) => {
      console.error('Error creando post:', error);
    }
  });
}

// Hook para eliminar un post
export function useDeletePost() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (postId: string) => socialAPI.deletePost(postId),
    
    onSuccess: () => {
      // Invalidar posts para actualizar la lista
      queryClient.invalidateQueries({
        queryKey: ['social', 'posts']
      });
    },
    
    onError: (error) => {
      console.error('Error eliminando post:', error);
    }
  });
}

// Hook para dar/quitar like a un post
export function useLikePost() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ postId, action }: {
      postId: string;
      action: 'like' | 'unlike';
    }) => {
      return action === 'like' 
        ? socialAPI.likePost(postId)
        : socialAPI.unlikePost(postId);
    },
    
    onSuccess: (data, variables) => {
      // Invalidar el post específico para actualizar el contador de likes
      queryClient.invalidateQueries({
        queryKey: queryKeys.socialPost(variables.postId)
      });
      
      // También invalidar la lista de posts
      queryClient.invalidateQueries({
        queryKey: ['social', 'posts']
      });
      
      // Invalidar likes del post
      queryClient.invalidateQueries({
        queryKey: queryKeys.postLikes(variables.postId)
      });
    },
    
    onError: (error) => {
      console.error('Error con like de post:', error);
    }
  });
}

// Hook para obtener likes de un post
export function usePostLikes(postId: string) {
  return useQuery({
    queryKey: queryKeys.postLikes(postId),
    queryFn: () => socialAPI.getPostLikes(postId),
    enabled: !!postId,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}

// Hook para obtener comentarios de un post
export function usePostComments(postId: string, page = 0, limit = 10) {
  return useQuery({
    queryKey: queryKeys.postComments(postId, page),
    queryFn: () => socialAPI.getPostComments(postId, page, limit),
    enabled: !!postId,
    staleTime: 1000 * 60 * 2, // 2 minutos
    refetchOnWindowFocus: false,
  });
}

// Hook para crear un comentario
export function useCreateComment() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ postId, content }: {
      postId: string;
      content: string;
    }) => socialAPI.createComment(postId, content),
    
    onSuccess: (data, variables) => {
      // Invalidar comentarios del post
      queryClient.invalidateQueries({
        queryKey: ['social', 'post', variables.postId, 'comments']
      });
      
      // Invalidar el post para actualizar contador de comentarios
      queryClient.invalidateQueries({
        queryKey: queryKeys.socialPost(variables.postId)
      });
      
      // Invalidar lista de posts
      queryClient.invalidateQueries({
        queryKey: ['social', 'posts']
      });
    },
    
    onError: (error) => {
      console.error('Error creando comentario:', error);
    }
  });
}

// Hook para eliminar un comentario
export function useDeleteComment() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ postId, commentId }: {
      postId: string;
      commentId: string;
    }) => socialAPI.deleteComment(postId, commentId),
    
    onSuccess: (data, variables) => {
      // Invalidar comentarios del post
      queryClient.invalidateQueries({
        queryKey: ['social', 'post', variables.postId, 'comments']
      });
      
      // Invalidar el post para actualizar contador
      queryClient.invalidateQueries({
        queryKey: queryKeys.socialPost(variables.postId)
      });
    },
    
    onError: (error) => {
      console.error('Error eliminando comentario:', error);
    }
  });
}

// Hook para dar like a un comentario
export function useLikeComment() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ postId, commentId }: {
      postId: string;
      commentId: string;
    }) => socialAPI.likeComment(postId, commentId),
    
    onSuccess: (data, variables) => {
      // Invalidar comentarios del post
      queryClient.invalidateQueries({
        queryKey: ['social', 'post', variables.postId, 'comments']
      });
    },
    
    onError: (error) => {
      console.error('Error con like de comentario:', error);
    }
  });
}

// 🌍 Hooks para Mundos/Worlds
export function useMundos() {
  return useQuery({
    queryKey: queryKeys.mundos,
    queryFn: () => mundosAPI.getMundos(),
    staleTime: 1000 * 60 * 15, // 15 minutos - Los mundos no cambian frecuentemente
    retry: 3,
    retryDelay: 1000,
  });
}

export function useMundo(mundoId: string) {
  return useQuery({
    queryKey: queryKeys.mundo(mundoId),
    queryFn: () => mundosAPI.getMundo(mundoId),
    enabled: !!mundoId,
    staleTime: 1000 * 60 * 10, // 10 minutos
  });
}

export function useMundoBySlug(slug: string) {
  return useQuery({
    queryKey: queryKeys.mundoBySlug(slug),
    queryFn: () => mundosAPI.getMundoBySlug(slug),
    enabled: !!slug,
    staleTime: 1000 * 60 * 10, // 10 minutos
  });
}

export function useMundoPlaylists(mundoId: string) {
  return useQuery({
    queryKey: queryKeys.mundoPlaylists(mundoId),
    queryFn: () => mundosAPI.getMundoPlaylists(mundoId),
    enabled: !!mundoId,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}

// 🧪 Hook para test de conectividad de mundos
export function useMundosTest() {
  return useQuery({
    queryKey: ['mundos', 'test'],
    queryFn: () => mundosAPI.testMundos(),
    staleTime: 1000 * 60 * 5, // 5 minutos
    retry: 3,
    retryDelay: 1000,
  });
} 