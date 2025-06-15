import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

// 🚀 ESTRATEGIAS DE PREFETCHING INTELIGENTE
// Hooks especializados para prefetching sin dependencias circulares

/**
 * Hook para prefetching básico
 */
export const useBasicPrefetch = () => {
  const queryClient = useQueryClient();

  const prefetchUserData = useCallback(async (userId: string) => {
    await queryClient.prefetchQuery({
      queryKey: ['user', userId],
      queryFn: () => fetch(`/api/users/${userId}`).then(res => res.json()),
      staleTime: 1000 * 60 * 15, // 15 minutes
    });
  }, [queryClient]);

  const prefetchModule = useCallback(async (moduleName: string) => {
    await queryClient.prefetchQuery({
      queryKey: ['module', moduleName],
      queryFn: () => fetch(`/api/modules/${moduleName}`).then(res => res.json()),
      staleTime: 1000 * 60 * 10, // 10 minutes
    });
  }, [queryClient]);

  return {
    prefetchUserData,
    prefetchModule,
  };
};

/**
 * Hook para prefetching de dashboard
 */
export const useDashboardPrefetch = () => {
  const queryClient = useQueryClient();

  const prefetchDashboardData = useCallback(async (userId: string) => {
    // Prefetch datos de usuario, gamificación y wallet en paralelo
    const promises = [
      queryClient.prefetchQuery({
        queryKey: ['user', 'profile', userId],
        queryFn: () => fetch(`/api/users/${userId}`).then(res => res.json()),
        staleTime: 1000 * 60 * 10,
      }),
      queryClient.prefetchQuery({
        queryKey: ['game', 'data', userId],
        queryFn: () => fetch(`/api/game/user/${userId}`).then(res => res.json()),
        staleTime: 1000 * 60 * 5,
      }),
      queryClient.prefetchQuery({
        queryKey: ['wallet', 'data', userId],
        queryFn: () => fetch(`/api/wallet/${userId}`).then(res => res.json()),
        staleTime: 1000 * 60 * 5,
      }),
    ];

    await Promise.allSettled(promises);
  }, [queryClient]);

  return {
    prefetchDashboardData,
  };
};

/**
 * Hook para prefetching de módulos relacionados
 */
export const useRelatedModulesPrefetch = () => {
  const queryClient = useQueryClient();

  const prefetchRelatedModules = useCallback(async (currentModule: string) => {
    const relatedModules: Record<string, string[]> = {
      'uplay': ['videos', 'playlists'],
      'social': ['matches', 'notifications'],
      'marketplace': ['products', 'categories'],
      'mundos': ['playlists', 'categories'],
    };

    const related = relatedModules[currentModule];
    if (related) {
      const promises = related.map(module =>
        queryClient.prefetchQuery({
          queryKey: [module, 'list'],
          queryFn: () => fetch(`/api/${module}`).then(res => res.json()),
          staleTime: 1000 * 60 * 5,
        })
      );

      await Promise.allSettled(promises);
    }
  }, [queryClient]);

  return {
    prefetchRelatedModules,
  };
};

/**
 * Hook para prefetching de contenido siguiente
 */
export const useNextContentPrefetch = () => {
  const queryClient = useQueryClient();

  const prefetchNextContent = useCallback(async (contentType: string, currentId?: string, metadata?: any) => {
    switch (contentType) {
      case 'video':
        if (currentId && metadata?.playlistId) {
          // Prefetch siguiente video en la playlist
          await queryClient.prefetchQuery({
            queryKey: ['playlist', metadata.playlistId, 'next', currentId],
            queryFn: () => fetch(`/api/playlists/${metadata.playlistId}/next/${currentId}`).then(res => res.json()),
            staleTime: 1000 * 60 * 10,
          });
        }
        break;
      
      case 'mundo':
        if (currentId) {
          // Prefetch playlists del mundo
          await queryClient.prefetchQuery({
            queryKey: ['mundos', currentId, 'playlists'],
            queryFn: () => fetch(`/api/mundos/${currentId}/playlists`).then(res => res.json()),
            staleTime: 1000 * 60 * 15,
          });
        }
        break;
      
      case 'social':
        if (currentId) {
          // Prefetch comentarios y likes del post
          const promises = [
            queryClient.prefetchQuery({
              queryKey: ['posts', currentId, 'comments'],
              queryFn: () => fetch(`/api/posts/${currentId}/comments`).then(res => res.json()),
              staleTime: 1000 * 60 * 2,
            }),
            queryClient.prefetchQuery({
              queryKey: ['posts', currentId, 'likes'],
              queryFn: () => fetch(`/api/posts/${currentId}/likes`).then(res => res.json()),
              staleTime: 1000 * 60 * 5,
            }),
          ];
          await Promise.allSettled(promises);
        }
        break;
    }
  }, [queryClient]);

  return {
    prefetchNextContent,
  };
};

/**
 * Hook para prefetching contextual basado en hora del día
 */
export const useContextualPrefetch = () => {
  const queryClient = useQueryClient();

  const prefetchContextualContent = useCallback(async (userId: string) => {
    const hour = new Date().getHours();
    
    // Prefetch basado en patrones temporales
    if (hour >= 6 && hour < 12) {
      // Mañana: Stats y progreso
      await queryClient.prefetchQuery({
        queryKey: ['user', userId, 'daily-stats'],
        queryFn: () => fetch(`/api/users/${userId}/daily-stats`).then(res => res.json()),
        staleTime: 1000 * 60 * 30,
      });
    } else if (hour >= 12 && hour < 18) {
      // Tarde: Marketplace y oportunidades
      await queryClient.prefetchQuery({
        queryKey: ['marketplace', 'featured'],
        queryFn: () => fetch('/api/marketplace/featured').then(res => res.json()),
        staleTime: 1000 * 60 * 15,
      });
    } else {
      // Noche: Social y entretenimiento
      await queryClient.prefetchQuery({
        queryKey: ['social', 'feed', userId],
        queryFn: () => fetch(`/api/social/feed/${userId}`).then(res => res.json()),
        staleTime: 1000 * 60 * 5,
      });
    }
  }, [queryClient]);

  return {
    prefetchContextualContent,
  };
}; 