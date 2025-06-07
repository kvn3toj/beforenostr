import { useQuery, useQueryClient, QueryKey, UseQueryOptions } from '@tanstack/react-query';
import { useCallback } from 'react';

// 🧠 HOOKS DE CACHE INTELIGENTE
// Implementan estrategias de cache optimizadas para diferentes tipos de datos

/**
 * Hook para datos de usuario - Cache agresivo ya que cambian poco
 */
export const useUserDataQuery = <T>(
  queryKey: QueryKey,
  queryFn: () => Promise<T>,
  options?: Omit<UseQueryOptions<T>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey,
    queryFn,
    staleTime: 1000 * 60 * 15, // 15 minutes - Datos de usuario cambian poco
    cacheTime: 1000 * 60 * 60, // 1 hour - Cache largo para datos de usuario
    refetchOnWindowFocus: false,
    refetchOnMount: false, // No refetch automático para datos de usuario
    ...options,
  });
};

/**
 * Hook para datos de gamificación - Cache moderado con refetch periódico
 */
export const useGamificationQuery = <T>(
  queryKey: QueryKey,
  queryFn: () => Promise<T>,
  options?: Omit<UseQueryOptions<T>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey,
    queryFn,
    staleTime: 1000 * 60 * 2, // 2 minutes - Datos de gamificación se actualizan frecuentemente
    cacheTime: 1000 * 60 * 10, // 10 minutes - Cache moderado
    refetchInterval: 1000 * 60 * 5, // Auto-refetch cada 5 minutos
    refetchIntervalInBackground: false, // No refetch en background
    ...options,
  });
};

/**
 * Hook para contenido multimedia - Cache muy agresivo
 */
export const useMediaContentQuery = <T>(
  queryKey: QueryKey,
  queryFn: () => Promise<T>,
  options?: Omit<UseQueryOptions<T>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey,
    queryFn,
    staleTime: 1000 * 60 * 60, // 1 hour - Contenido multimedia no cambia frecuentemente
    cacheTime: 1000 * 60 * 60 * 4, // 4 hours - Cache muy largo para multimedia
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    ...options,
  });
};

/**
 * Hook para datos en tiempo real - Cache mínimo con refetch agresivo
 */
export const useRealTimeQuery = <T>(
  queryKey: QueryKey,
  queryFn: () => Promise<T>,
  options?: Omit<UseQueryOptions<T>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey,
    queryFn,
    staleTime: 1000 * 30, // 30 seconds - Datos en tiempo real se vuelven stale rápido
    cacheTime: 1000 * 60 * 2, // 2 minutes - Cache corto
    refetchInterval: 1000 * 60, // Refetch cada minuto
    refetchOnWindowFocus: true, // Refetch al volver a la ventana
    refetchOnReconnect: true,
    ...options,
  });
};

/**
 * Hook para listas estáticas - Cache muy agresivo
 */
export const useStaticListQuery = <T>(
  queryKey: QueryKey,
  queryFn: () => Promise<T>,
  options?: Omit<UseQueryOptions<T>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey,
    queryFn,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours - Listas estáticas casi nunca cambian
    cacheTime: 1000 * 60 * 60 * 24 * 7, // 7 days - Cache muy largo
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    ...options,
  });
};

/**
 * Hook para prefetching inteligente
 */
export const usePrefetch = () => {
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

  // 🎯 NUEVAS ESTRATEGIAS DE PREFETCHING INTELIGENTE

  /**
   * Prefetch para la navegación típica del dashboard
   */
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

  /**
   * Prefetch para módulos relacionados (UPlay -> Videos, Social -> Matches)
   */
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

  /**
   * Prefetch para contenido que probablemente será visto (siguiente página, videos relacionados)
   */
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

  /**
   * 🎯 Prefetch contextual basado en hora del día y patrones de uso
   */
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
    prefetchUserData,
    prefetchModule,
    prefetchDashboardData,
    prefetchRelatedModules,
    prefetchNextContent,
    prefetchContextualContent,
  };
};

/**
 * Hook para invalidaciones inteligentes
 */
export const useSmartInvalidation = () => {
  const queryClient = useQueryClient();

  const invalidateUserData = useCallback(async (userId?: string) => {
    if (userId) {
      await queryClient.invalidateQueries({ queryKey: ['user', userId] });
    } else {
      await queryClient.invalidateQueries({ queryKey: ['user'] });
    }
  }, [queryClient]);

  const invalidateGamification = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: ['gamification'] });
    await queryClient.invalidateQueries({ queryKey: ['achievements'] });
    await queryClient.invalidateQueries({ queryKey: ['progress'] });
  }, [queryClient]);

  const invalidateModule = useCallback(async (moduleName: string) => {
    await queryClient.invalidateQueries({ queryKey: ['module', moduleName] });
  }, [queryClient]);

  return {
    invalidateUserData,
    invalidateGamification,
    invalidateModule,
  };
};

/**
 * Hook para cache persistence local (LocalStorage)
 */
export const useLocalCache = () => {
  const setLocalCache = useCallback((key: string, data: any, expiryMinutes = 60) => {
    const expiry = Date.now() + (expiryMinutes * 60 * 1000);
    const cacheData = {
      data,
      expiry,
    };
    localStorage.setItem(`cache_${key}`, JSON.stringify(cacheData));
  }, []);

  const getLocalCache = useCallback((key: string) => {
    try {
      const cached = localStorage.getItem(`cache_${key}`);
      if (!cached) return null;

      const { data, expiry } = JSON.parse(cached);
      if (Date.now() > expiry) {
        localStorage.removeItem(`cache_${key}`);
        return null;
      }

      return data;
    } catch {
      return null;
    }
  }, []);

  const clearLocalCache = useCallback((key?: string) => {
    if (key) {
      localStorage.removeItem(`cache_${key}`);
    } else {
      // Clear all cache entries
      const keys = Object.keys(localStorage).filter(k => k.startsWith('cache_'));
      keys.forEach(k => localStorage.removeItem(k));
    }
  }, []);

  return {
    setLocalCache,
    getLocalCache,
    clearLocalCache,
  };
};

/**
 * 🔄 Hook para Optimistic Updates Avanzados
 */
export const useOptimisticUpdates = () => {
  const queryClient = useQueryClient();

  /**
   * Optimistic update para likes/reactions
   */
  const optimisticLike = useCallback(async (
    postId: string, 
    userId: string, 
    isLiked: boolean
  ) => {
    const queryKey = ['posts', postId, 'likes'];
    
    // Cancelar queries en progreso
    await queryClient.cancelQueries({ queryKey });
    
    // Snapshot del estado anterior
    const previousLikes = queryClient.getQueryData(queryKey);
    
    // Optimistic update
    queryClient.setQueryData(queryKey, (old: any) => {
      if (!old) return { likes: isLiked ? 1 : 0, userLiked: isLiked };
      
      return {
        ...old,
        likes: isLiked ? old.likes + 1 : Math.max(0, old.likes - 1),
        userLiked: isLiked,
      };
    });
    
    // También actualizar el post en la lista
    queryClient.setQueryData(['posts', 'list'], (old: any) => {
      if (!old?.data) return old;
      
      return {
        ...old,
        data: old.data.map((post: any) => 
          post.id === postId 
            ? { 
                ...post, 
                likes: isLiked ? post.likes + 1 : Math.max(0, post.likes - 1),
                userLiked: isLiked 
              }
            : post
        ),
      };
    });
    
    return { previousLikes };
  }, [queryClient]);

  /**
   * Optimistic update para comentarios
   */
  const optimisticComment = useCallback(async (
    postId: string,
    comment: { content: string; userId: string; userName: string }
  ) => {
    const queryKey = ['posts', postId, 'comments'];
    
    await queryClient.cancelQueries({ queryKey });
    const previousComments = queryClient.getQueryData(queryKey);
    
    // Crear comentario temporal
    const tempComment = {
      id: `temp-${Date.now()}`,
      ...comment,
      createdAt: new Date().toISOString(),
      isOptimistic: true,
    };
    
    queryClient.setQueryData(queryKey, (old: any) => {
      if (!old?.data) return { data: [tempComment] };
      
      return {
        ...old,
        data: [tempComment, ...old.data],
      };
    });
    
    return { previousComments, tempComment };
  }, [queryClient]);

  /**
   * Optimistic update para progreso de gamificación
   */
  const optimisticGameProgress = useCallback(async (
    userId: string,
    progressUpdate: { xp?: number; level?: number; achievements?: string[] }
  ) => {
    const queryKey = ['game', 'data', userId];
    
    await queryClient.cancelQueries({ queryKey });
    const previousData = queryClient.getQueryData(queryKey);
    
    queryClient.setQueryData(queryKey, (old: any) => {
      if (!old) return progressUpdate;
      
      return {
        ...old,
        xp: progressUpdate.xp ? old.xp + progressUpdate.xp : old.xp,
        level: progressUpdate.level || old.level,
        achievements: progressUpdate.achievements 
          ? [...(old.achievements || []), ...progressUpdate.achievements]
          : old.achievements,
        lastUpdated: Date.now(),
      };
    });
    
    return { previousData };
  }, [queryClient]);

  /**
   * Optimistic update para transacciones de wallet
   */
  const optimisticWalletTransaction = useCallback(async (
    userId: string,
    transaction: { amount: number; type: 'income' | 'expense'; description: string }
  ) => {
    const queryKey = ['wallet', 'data', userId];
    
    await queryClient.cancelQueries({ queryKey });
    const previousData = queryClient.getQueryData(queryKey);
    
    queryClient.setQueryData(queryKey, (old: any) => {
      if (!old) return { balance: transaction.amount, transactions: [transaction] };
      
      const newBalance = transaction.type === 'income' 
        ? old.balance + transaction.amount
        : old.balance - transaction.amount;
      
      const tempTransaction = {
        id: `temp-${Date.now()}`,
        ...transaction,
        timestamp: Date.now(),
        isOptimistic: true,
      };
      
      return {
        ...old,
        balance: newBalance,
        transactions: [tempTransaction, ...(old.transactions || [])],
      };
    });
    
    return { previousData };
  }, [queryClient]);

  /**
   * Rollback function para revertir optimistic updates
   */
  const rollbackOptimisticUpdate = useCallback((
    queryKey: string[],
    previousData: any
  ) => {
    queryClient.setQueryData(queryKey, previousData);
  }, [queryClient]);

  return {
    optimisticLike,
    optimisticComment,
    optimisticGameProgress,
    optimisticWalletTransaction,
    rollbackOptimisticUpdate,
  };
};

/**
 * 🧭 Hook para Prefetching Inteligente basado en Navegación
 */
export const useNavigationPrefetch = () => {
  const queryClient = useQueryClient();

  /**
   * Prefetch basado en hover de enlaces
   */
  const setupHoverPrefetch = useCallback(() => {
    const handleLinkHover = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const link = target.closest('a[href]') as HTMLAnchorElement;
      
      if (!link || !link.href) return;
      
      const url = new URL(link.href);
      const pathname = url.pathname;
      
      // Prefetch basado en la ruta
      if (pathname.includes('/profile/')) {
        const userId = pathname.split('/profile/')[1];
        if (userId) {
          queryClient.prefetchQuery({
            queryKey: ['user', 'profile', userId],
            queryFn: () => fetch(`/api/users/${userId}`).then(res => res.json()),
            staleTime: 1000 * 60 * 10,
          });
        }
      } else if (pathname.includes('/video/')) {
        const videoId = pathname.split('/video/')[1];
        if (videoId) {
          queryClient.prefetchQuery({
            queryKey: ['video', videoId],
            queryFn: () => fetch(`/api/videos/${videoId}`).then(res => res.json()),
            staleTime: 1000 * 60 * 15,
          });
        }
      } else if (pathname.includes('/marketplace/')) {
        queryClient.prefetchQuery({
          queryKey: ['marketplace', 'products'],
          queryFn: () => fetch('/api/marketplace/products').then(res => res.json()),
          staleTime: 1000 * 60 * 10,
        });
      }
    };

    // Agregar listeners con debounce
    let hoverTimeout: NodeJS.Timeout;
    const debouncedHover = (event: MouseEvent) => {
      clearTimeout(hoverTimeout);
      hoverTimeout = setTimeout(() => handleLinkHover(event), 100);
    };

    document.addEventListener('mouseover', debouncedHover);
    
    return () => {
      document.removeEventListener('mouseover', debouncedHover);
      clearTimeout(hoverTimeout);
    };
  }, [queryClient]);

  /**
   * Prefetch basado en scroll y proximidad a elementos
   */
  const setupScrollPrefetch = useCallback(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollPercentage = (scrollPosition / documentHeight) * 100;
      
      // Prefetch contenido cuando el usuario está cerca del final
      if (scrollPercentage > 80) {
        // Prefetch siguiente página de contenido
        queryClient.prefetchQuery({
          queryKey: ['content', 'next-page'],
          queryFn: () => fetch('/api/content/next').then(res => res.json()),
          staleTime: 1000 * 60 * 5,
        });
      }
      
      // Prefetch basado en elementos visibles
      const visibleElements = document.querySelectorAll('[data-prefetch-id]');
      visibleElements.forEach(element => {
        const rect = element.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (isVisible) {
          const prefetchId = element.getAttribute('data-prefetch-id');
          const prefetchType = element.getAttribute('data-prefetch-type');
          
          if (prefetchId && prefetchType) {
            queryClient.prefetchQuery({
              queryKey: [prefetchType, prefetchId],
              queryFn: () => fetch(`/api/${prefetchType}/${prefetchId}`).then(res => res.json()),
              staleTime: 1000 * 60 * 10,
            });
          }
        }
      });
    };

    // Throttle scroll events
    let scrollTimeout: NodeJS.Timeout;
    const throttledScroll = () => {
      if (!scrollTimeout) {
        scrollTimeout = setTimeout(() => {
          handleScroll();
          scrollTimeout = null as any;
        }, 200);
      }
    };

    window.addEventListener('scroll', throttledScroll);
    
    return () => {
      window.removeEventListener('scroll', throttledScroll);
      if (scrollTimeout) clearTimeout(scrollTimeout);
    };
  }, [queryClient]);

  /**
   * Prefetch basado en tiempo de permanencia en página
   */
  const setupTimePrefetch = useCallback((route: string) => {
    const prefetchTimer = setTimeout(() => {
      // Después de 3 segundos en una página, prefetch contenido relacionado
      switch (route) {
        case '/dashboard':
          queryClient.prefetchQuery({
            queryKey: ['recent-activity'],
            queryFn: () => fetch('/api/activity/recent').then(res => res.json()),
            staleTime: 1000 * 60 * 5,
          });
          break;
        
        case '/uplay':
          queryClient.prefetchQuery({
            queryKey: ['recommended-videos'],
            queryFn: () => fetch('/api/videos/recommended').then(res => res.json()),
            staleTime: 1000 * 60 * 10,
          });
          break;
        
        case '/social':
          queryClient.prefetchQuery({
            queryKey: ['trending-posts'],
            queryFn: () => fetch('/api/posts/trending').then(res => res.json()),
            staleTime: 1000 * 60 * 5,
          });
          break;
      }
    }, 3000);

    return () => clearTimeout(prefetchTimer);
  }, [queryClient]);

  return {
    setupHoverPrefetch,
    setupScrollPrefetch,
    setupTimePrefetch,
  };
}; 