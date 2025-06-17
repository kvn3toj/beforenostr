/**
 * 🚀 UTILIDADES DE OPTIMIZACIÓN DE PERFORMANCE
 * Herramientas centralizadas para mejorar el rendimiento de la SuperApp
 */

// 🎯 Tipos para web vitals y métricas
export interface WebVitalsMetrics {
  CLS: number | null; // Cumulative Layout Shift
  FCP: number | null; // First Contentful Paint
  FID: number | null; // First Input Delay
  LCP: number | null; // Largest Contentful Paint
  TTFB: number | null; // Time to First Byte
}

export interface CustomMetrics {
  componentRenderTime: number;
  navigationTime: number;
  imageLoadTime: number;
  bundleSize: number;
  memoryUsage: number;
}

// 🎯 Debounce optimizado para scroll y resize
export const createOptimizedDebounce = <T extends (...args: any[]) => void>(
  func: T,
  wait: number,
  immediate: boolean = false
): T => {
  let timeout: NodeJS.Timeout | null = null;

  return ((...args: Parameters<T>) => {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };

    const callNow = immediate && !timeout;

    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);

    if (callNow) func(...args);
  }) as T;
};

// 🎯 Throttle optimizado para eventos frecuentes
export const createOptimizedThrottle = <T extends (...args: any[]) => void>(
  func: T,
  limit: number
): T => {
  let inThrottle: boolean = false;

  return ((...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  }) as T;
};

// 🎯 Intersection Observer optimizado para lazy loading
export const createIntersectionObserver = (
  callback: IntersectionObserverCallback,
  options: IntersectionObserverInit = {}
): IntersectionObserver => {
  const defaultOptions: IntersectionObserverInit = {
    root: null,
    rootMargin: '50px',
    threshold: 0.1,
    ...options,
  };

  return new IntersectionObserver(callback, defaultOptions);
};

// 🎯 Preload de recursos críticos
export const preloadCriticalResources = () => {
  const criticalResources = [
    '/fonts/Inter-Variable.woff2',
    '/icons/coomunity-logo.svg',
  ];

  criticalResources.forEach((resource) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = resource;

    if (resource.endsWith('.woff2')) {
      link.as = 'font';
      link.type = 'font/woff2';
      link.crossOrigin = 'anonymous';
    } else if (resource.endsWith('.svg')) {
      link.as = 'image';
    }

    document.head.appendChild(link);
  });
};

// 🎯 Optimización de imágenes con lazy loading
export const createOptimizedImageLoader = () => {
  const imageObserver = createIntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement;
        const src = img.dataset.src;

        if (src) {
          img.src = src;
          img.classList.remove('lazy');
          img.classList.add('loaded');
          imageObserver.unobserve(img);
        }
      }
    });
  });

  return {
    observe: (img: HTMLImageElement) => imageObserver.observe(img),
    unobserve: (img: HTMLImageElement) => imageObserver.unobserve(img),
    disconnect: () => imageObserver.disconnect(),
  };
};

// 🎯 Optimización de scroll virtual
export const createVirtualScroller = (
  container: HTMLElement,
  itemHeight: number,
  items: any[],
  renderItem: (item: any, index: number) => HTMLElement
) => {
  let startIndex = 0;
  let endIndex = 0;
  const visibleCount = Math.ceil(container.clientHeight / itemHeight) + 2;

  const updateVisibleItems = createOptimizedThrottle(() => {
    const scrollTop = container.scrollTop;
    startIndex = Math.floor(scrollTop / itemHeight);
    endIndex = Math.min(startIndex + visibleCount, items.length);

    // Limpiar contenedor
    container.innerHTML = '';

    // Crear spacer superior
    if (startIndex > 0) {
      const topSpacer = document.createElement('div');
      topSpacer.style.height = `${startIndex * itemHeight}px`;
      container.appendChild(topSpacer);
    }

    // Renderizar items visibles
    for (let i = startIndex; i < endIndex; i++) {
      const element = renderItem(items[i], i);
      container.appendChild(element);
    }

    // Crear spacer inferior
    if (endIndex < items.length) {
      const bottomSpacer = document.createElement('div');
      bottomSpacer.style.height = `${(items.length - endIndex) * itemHeight}px`;
      container.appendChild(bottomSpacer);
    }
  }, 16); // 60fps

  container.addEventListener('scroll', updateVisibleItems, { passive: true });

  // Renderizado inicial
  updateVisibleItems();

  return {
    destroy: () => {
      container.removeEventListener('scroll', updateVisibleItems);
    },
    refresh: () => updateVisibleItems(),
  };
};

// 🎯 Bundle analyzer para desarrollo
export const analyzeBundlePerformance = () => {
  if (process.env.NODE_ENV === 'development') {
    const getLoadingTime = () => {
      const perfData = window.performance.timing;
      const loadTime = perfData.loadEventEnd - perfData.navigationStart;
      const domReadyTime =
        perfData.domContentLoadedEventEnd - perfData.navigationStart;

      return {
        totalLoadTime: loadTime,
        domReadyTime: domReadyTime,
        resourceLoadTime: loadTime - domReadyTime,
      };
    };

    const getMemoryUsage = () => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        return {
          usedJSHeapSize: Math.round(memory.usedJSHeapSize / 1048576), // MB
          totalJSHeapSize: Math.round(memory.totalJSHeapSize / 1048576), // MB
          jsHeapSizeLimit: Math.round(memory.jsHeapSizeLimit / 1048576), // MB
        };
      }
      return null;
    };

    const getBundleSize = async () => {
      try {
        const response = await fetch('/build-manifest.json');
        const manifest = await response.json();

        let totalSize = 0;
        Object.values(manifest).forEach((file: any) => {
          if (typeof file === 'string' && file.endsWith('.js')) {
            // Estimación básica, en producción usar webpack-bundle-analyzer
            totalSize += 100; // KB estimado por chunk
          }
        });

        return totalSize;
      } catch {
        return null;
      }
    };

    return {
      getLoadingTime,
      getMemoryUsage,
      getBundleSize,
      logPerformanceReport: () => {
        console.group('🚀 Bundle Performance Report');
        console.log('📊 Loading Times:', getLoadingTime());
        console.log('💾 Memory Usage:', getMemoryUsage());
        console.groupEnd();
      },
    };
  }

  return null;
};

// 🎯 Web Vitals collector
export const collectWebVitals = (): Promise<WebVitalsMetrics> => {
  return new Promise((resolve) => {
    const metrics: WebVitalsMetrics = {
      CLS: null,
      FCP: null,
      FID: null,
      LCP: null,
      TTFB: null,
    };

    // Función para actualizar métricas
    const updateMetric = (name: keyof WebVitalsMetrics, value: number) => {
      metrics[name] = value;

      // Verificar si todas las métricas están recolectadas
      const allCollected = Object.values(metrics).every((val) => val !== null);
      if (allCollected) {
        resolve(metrics);
      }
    };

    // Observer para LCP
    const lcpObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1] as PerformanceEntry;
      updateMetric('LCP', lastEntry.startTime);
    });

    // Observer para FID
    const fidObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach((entry: any) => {
        updateMetric('FID', entry.processingStart - entry.startTime);
      });
    });

    // Observer para CLS
    const clsObserver = new PerformanceObserver((entryList) => {
      let clsValue = 0;
      entryList.getEntries().forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      });
      updateMetric('CLS', clsValue);
    });

    try {
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      fidObserver.observe({ entryTypes: ['first-input'] });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
    } catch (error) {
      console.warn('Performance observers not supported:', error);
      resolve(metrics);
    }

    // FCP desde Performance Timeline API
    const navigationEntries = performance.getEntriesByType('navigation');
    if (navigationEntries.length > 0) {
      const navEntry = navigationEntries[0] as PerformanceNavigationTiming;
      updateMetric('TTFB', navEntry.responseStart - navEntry.requestStart);
    }

    // Timeout para asegurar resolución
    setTimeout(() => resolve(metrics), 5000);
  });
};

// 🎯 Optimización de fonts
export const optimizeFontLoading = () => {
  // Preload de fonts críticas
  const criticalFonts = [
    { family: 'Inter', weight: '400', display: 'swap' },
    { family: 'Inter', weight: '600', display: 'swap' },
    { family: 'Inter', weight: '700', display: 'swap' },
  ];

  criticalFonts.forEach((font) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = `/fonts/${font.family}-${font.weight}.woff2`;
    link.as = 'font';
    link.type = 'font/woff2';
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });

  // CSS font-display optimization
  const style = document.createElement('style');
  style.textContent = `
    @font-face {
      font-family: 'Inter';
      font-display: swap;
      src: url('/fonts/Inter-Variable.woff2') format('woff2-variations');
      font-weight: 100 900;
    }
  `;
  document.head.appendChild(style);
};

// 🎯 Service Worker para caching optimizado
export const initializeServiceWorker = async () => {
  if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');

      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;

        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (
              newWorker.state === 'installed' &&
              navigator.serviceWorker.controller
            ) {
              // Nueva versión disponible
              console.log(
                'Nueva versión de la app disponible. Recarga para actualizar.'
              );
            }
          });
        }
      });

      return registration;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  }

  return null;
};

// 🎯 Cleanup automático de memoria
export const createMemoryManager = () => {
  const objects = new WeakMap();
  const timers = new Set<NodeJS.Timeout>();
  const observers = new Set<IntersectionObserver | MutationObserver>();

  return {
    track: (obj: object, data: any) => objects.set(obj, data),
    addTimer: (timer: NodeJS.Timeout) => timers.add(timer),
    addObserver: (observer: IntersectionObserver | MutationObserver) =>
      observers.add(observer),

    cleanup: () => {
      // Limpiar timers
      timers.forEach((timer) => clearTimeout(timer));
      timers.clear();

      // Desconectar observers
      observers.forEach((observer) => observer.disconnect());
      observers.clear();

      // Forzar garbage collection si está disponible
      if ('gc' in window && typeof (window as any).gc === 'function') {
        (window as any).gc();
      }
    },
  };
};

export default {
  createOptimizedDebounce,
  createOptimizedThrottle,
  createIntersectionObserver,
  preloadCriticalResources,
  createOptimizedImageLoader,
  createVirtualScroller,
  analyzeBundlePerformance,
  collectWebVitals,
  optimizeFontLoading,
  initializeServiceWorker,
  createMemoryManager,
};
