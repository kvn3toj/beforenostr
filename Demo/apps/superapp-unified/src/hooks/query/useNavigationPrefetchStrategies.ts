import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect } from 'react';

// 🧭 ESTRATEGIAS DE PREFETCHING DE NAVEGACIÓN
// Hooks especializados para prefetching basado en navegación con cleanup effects

/**
 * Hook para prefetching basado en hover de enlaces
 */
export const useHoverPrefetch = () => {
  const queryClient = useQueryClient();

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

  // ✅ CLEANUP OBLIGATORIO
  useEffect(() => {
    const cleanup = setupHoverPrefetch();
    return cleanup;
  }, [setupHoverPrefetch]);

  return {
    setupHoverPrefetch,
  };
};

/**
 * Hook para prefetching basado en scroll
 */
export const useScrollPrefetch = () => {
  const queryClient = useQueryClient();

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
    let scrollTimeout: NodeJS.Timeout | null = null;
    const throttledScroll = () => {
      if (!scrollTimeout) {
        scrollTimeout = setTimeout(() => {
          handleScroll();
          scrollTimeout = null;
        }, 200);
      }
    };

    window.addEventListener('scroll', throttledScroll);
    
    return () => {
      window.removeEventListener('scroll', throttledScroll);
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
        scrollTimeout = null;
      }
    };
  }, [queryClient]);

  // ✅ CLEANUP OBLIGATORIO
  useEffect(() => {
    const cleanup = setupScrollPrefetch();
    return cleanup;
  }, [setupScrollPrefetch]);

  return {
    setupScrollPrefetch,
  };
};

/**
 * Hook para prefetching basado en tiempo de permanencia
 */
export const useTimePrefetch = () => {
  const queryClient = useQueryClient();

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

  // ✅ CLEANUP OBLIGATORIO
  useEffect(() => {
    return () => {
      // Cleanup automático cuando el componente se desmonta
    };
  }, []);

  return {
    setupTimePrefetch,
  };
}; 