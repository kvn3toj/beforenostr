import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

// 🎯 Interface para métricas de performance
interface PerformanceMetrics {
  renderTime: number;
  componentMountTime: number;
  lastUpdateTime: number;
  memoryUsage?: number;
  scrollPosition: number;
  visibilityState: DocumentVisibilityState;
}

// 🎯 Interface para prefetch de rutas
interface PrefetchConfig {
  routes: string[];
  threshold: number; // Porcentaje de scroll para activar prefetch
  delay: number; // Delay en ms para evitar prefetch excesivo
}

// 🎯 Hook principal de performance para Home
export const useHomePerformance = () => {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    renderTime: 0,
    componentMountTime: Date.now(),
    lastUpdateTime: Date.now(),
    scrollPosition: 0,
    visibilityState: document.visibilityState,
  });

  const [isVisible, setIsVisible] = useState(true);
  const [shouldPrefetch, setShouldPrefetch] = useState(false);
  const renderStartTime = useRef<number>(Date.now());
  const prefetchedRoutes = useRef<Set<string>>(new Set());
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

  // 🎯 Configuración de prefetch por defecto
  const defaultPrefetchConfig: PrefetchConfig = {
    routes: ['/marketplace', '/uplay', '/social', '/ustats'],
    threshold: 30, // 30% de scroll
    delay: 500, // 500ms de delay
  };

  // 🎯 Medir tiempo de render
  const measureRenderTime = useCallback(() => {
    const renderTime = Date.now() - renderStartTime.current;
    setMetrics((prev) => ({
      ...prev,
      renderTime,
      lastUpdateTime: Date.now(),
    }));

    // Log performance en desarrollo
    if (process.env.NODE_ENV === 'development') {
      console.log('🎯 Home render time:', renderTime, 'ms');

      if (renderTime > 100) {
        console.warn('⚠️ Slow render detected:', renderTime, 'ms');
      }
    }
  }, []);

  // 🎯 Monitor de scroll para prefetch inteligente
  const handleScroll = useCallback(() => {
    const scrollPosition = window.scrollY;
    const documentHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercentage = (scrollPosition / documentHeight) * 100;

    // Clear previous timeout
    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current);
    }

    // Debounce scroll updates
    scrollTimeout.current = setTimeout(() => {
      setMetrics((prev) => ({
        ...prev,
        scrollPosition: scrollPercentage,
        lastUpdateTime: Date.now(),
      }));

      // Activar prefetch basado en scroll
      if (
        scrollPercentage > defaultPrefetchConfig.threshold &&
        !shouldPrefetch
      ) {
        setShouldPrefetch(true);
      }
    }, 100);
  }, [shouldPrefetch, defaultPrefetchConfig.threshold]);

  // 🎯 Monitor de visibilidad de página
  const handleVisibilityChange = useCallback(() => {
    const visibilityState = document.visibilityState;
    setIsVisible(visibilityState === 'visible');
    setMetrics((prev) => ({
      ...prev,
      visibilityState,
      lastUpdateTime: Date.now(),
    }));

    // Log visibility changes en desarrollo
    if (process.env.NODE_ENV === 'development') {
      console.log('🔍 Home visibility changed:', visibilityState);
    }
  }, []);

  // 🎯 Prefetch inteligente de rutas
  const prefetchRoute = useCallback(
    async (route: string) => {
      if (prefetchedRoutes.current.has(route)) return;

      try {
        // Marcar como prefetched inmediatamente para evitar duplicados
        prefetchedRoutes.current.add(route);

        // Delay para evitar impacto en performance
        await new Promise((resolve) =>
          setTimeout(resolve, defaultPrefetchConfig.delay)
        );

        // Prefetch basado en la ruta
        switch (route) {
          case '/marketplace':
            await import('../../pages/Marketplace');
            break;
          case '/uplay':
            await import('../../pages/UPlay');
            break;
          case '/social':
            await import('../../pages/Social');
            break;
          case '/ustats':
            await import('../../pages/UStats');
            break;
          default:
            console.log('🎯 Ruta no configurada para prefetch:', route);
        }

        if (process.env.NODE_ENV === 'development') {
          console.log('✅ Prefetched route:', route);
        }
      } catch (error) {
        // Remover de prefetched si falló
        prefetchedRoutes.current.delete(route);
        console.error('❌ Failed to prefetch route:', route, error);
      }
    },
    [defaultPrefetchConfig.delay]
  );

  // 🎯 Ejecutar prefetch cuando sea necesario
  useEffect(() => {
    if (shouldPrefetch && isVisible) {
      defaultPrefetchConfig.routes.forEach((route) => {
        prefetchRoute(route);
      });
    }
  }, [shouldPrefetch, isVisible, prefetchRoute, defaultPrefetchConfig.routes]);

  // 🎯 Setup de event listeners
  useEffect(() => {
    // Medir tiempo inicial
    measureRenderTime();

    // Event listeners
    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('visibilitychange', handleVisibilityChange);

      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
    };
  }, [handleScroll, handleVisibilityChange, measureRenderTime]);

  // 🎯 Monitor de memoria (si está disponible)
  useEffect(() => {
    const updateMemoryUsage = () => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        setMetrics((prev) => ({
          ...prev,
          memoryUsage: memory.usedJSHeapSize / 1048576, // MB
          lastUpdateTime: Date.now(),
        }));
      }
    };

    // Actualizar memoria cada 5 segundos si la página está visible
    const memoryInterval = setInterval(() => {
      if (isVisible) {
        updateMemoryUsage();
      }
    }, 5000);

    return () => clearInterval(memoryInterval);
  }, [isVisible]);

  // 🎯 Reset render timer para nuevos renders
  const resetRenderTimer = useCallback(() => {
    renderStartTime.current = Date.now();
  }, []);

  // 🎯 Navegar con prefetch
  const navigateWithPrefetch = useCallback(
    (path: string) => {
      // Si ya está prefetched, navegación instantánea
      if (prefetchedRoutes.current.has(path)) {
        navigate(path);
      } else {
        // Prefetch y luego navegar
        prefetchRoute(path).finally(() => {
          navigate(path);
        });
      }
    },
    [navigate, prefetchRoute]
  );

  // 🎯 Información de performance para debugging
  const performanceInfo = useMemo(
    () => ({
      isPerformant: metrics.renderTime < 100,
      isSlowRender: metrics.renderTime > 200,
      memoryPressure: metrics.memoryUsage ? metrics.memoryUsage > 50 : false,
      prefetchedCount: prefetchedRoutes.current.size,
      scrollProgress: Math.round(metrics.scrollPosition),
    }),
    [metrics]
  );

  return {
    metrics,
    performanceInfo,
    isVisible,
    shouldPrefetch,
    resetRenderTimer,
    navigateWithPrefetch,
    prefetchRoute,
    measureRenderTime,
  };
};

// 🎯 Hook para optimización de componentes específicos
export const useComponentPerformance = (componentName: string) => {
  const mountTime = useRef<number>(Date.now());
  const renderCount = useRef<number>(0);
  const [isOptimized, setIsOptimized] = useState(true);

  useEffect(() => {
    renderCount.current += 1;

    // Detectar re-renders excesivos
    if (renderCount.current > 10) {
      setIsOptimized(false);
      console.warn(
        `⚠️ Component ${componentName} has re-rendered ${renderCount.current} times`
      );
    }

    // Log en desarrollo
    if (process.env.NODE_ENV === 'development') {
      const timeFromMount = Date.now() - mountTime.current;
      console.log(
        `🎯 ${componentName} render #${renderCount.current} at ${timeFromMount}ms`
      );
    }
  });

  const resetRenderCount = useCallback(() => {
    renderCount.current = 0;
    setIsOptimized(true);
    mountTime.current = Date.now();
  }, []);

  return {
    renderCount: renderCount.current,
    isOptimized,
    timeFromMount: Date.now() - mountTime.current,
    resetRenderCount,
  };
};

// 🎯 Hook para lazy loading inteligente
export const useIntelligentLazyLoading = () => {
  const [loadedComponents, setLoadedComponents] = useState<Set<string>>(
    new Set()
  );
  const observerRef = useRef<IntersectionObserver | null>(null);

  // 🎯 Setup de Intersection Observer
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const componentName = entry.target.getAttribute('data-component');
            if (componentName && !loadedComponents.has(componentName)) {
              setLoadedComponents((prev) => new Set([...prev, componentName]));
            }
          }
        });
      },
      {
        rootMargin: '100px', // Load 100px before component becomes visible
        threshold: 0.1,
      }
    );

    return () => {
      observerRef.current?.disconnect();
    };
  }, [loadedComponents]);

  // 🎯 Función para observar elemento
  const observeElement = useCallback(
    (element: HTMLElement, componentName: string) => {
      if (observerRef.current && element) {
        element.setAttribute('data-component', componentName);
        observerRef.current.observe(element);
      }
    },
    []
  );

  // 🎯 Función para dejar de observar
  const unobserveElement = useCallback((element: HTMLElement) => {
    if (observerRef.current && element) {
      observerRef.current.unobserve(element);
    }
  }, []);

  return {
    loadedComponents,
    observeElement,
    unobserveElement,
    isComponentLoaded: (componentName: string) =>
      loadedComponents.has(componentName),
  };
};

export default {
  useHomePerformance,
  useComponentPerformance,
  useIntelligentLazyLoading,
};
