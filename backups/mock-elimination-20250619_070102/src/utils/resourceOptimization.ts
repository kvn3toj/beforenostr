// 🖼️ OPTIMIZACIÓN DE RECURSOS ESTÁTICOS
// Utilities para lazy loading de imágenes, preload de recursos críticos, y cache de assets

/**
 * Hook para lazy loading de imágenes con Intersection Observer
 */
export const useLazyImage = () => {
  const loadImage = (img: HTMLImageElement, src: string) => {
    return new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = reject;
      img.src = src;
    });
  };

  const setupLazyLoading = () => {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            const src = img.dataset.src;
            
            if (src) {
              loadImage(img, src)
                .then(() => {
                  img.classList.remove('lazy-loading');
                  img.classList.add('lazy-loaded');
                })
                .catch(() => {
                  img.classList.add('lazy-error');
                });
              
              observer.unobserve(img);
            }
          }
        });
      }, {
        rootMargin: '50px', // Cargar imágenes 50px antes de que entren en viewport
      });

      // Observar todas las imágenes con data-src
      document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
      });

      return imageObserver;
    }
  };

  return { setupLazyLoading };
};

/**
 * Preload de recursos críticos
 */
export const preloadCriticalResources = () => {
  const preloadImage = (src: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = reject;
      img.src = src;
    });
  };

  const preloadFont = (fontFamily: string, src: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const font = new FontFace(fontFamily, `url(${src})`);
      font.load()
        .then(loadedFont => {
          document.fonts.add(loadedFont);
          resolve();
        })
        .catch(reject);
    });
  };

  const preloadScript = (src: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.onload = () => resolve();
      script.onerror = reject;
      script.src = src;
      document.head.appendChild(script);
    });
  };

  // Preload de recursos críticos de CoomÜnity
  const preloadCriticalAssets = async () => {
    const criticalImages = [
      '/images/logo.svg',
      '/images/default-avatar.png',
      '/images/loading-placeholder.svg',
    ];

    const criticalFonts = [
      { family: 'Inter', src: '/fonts/Inter-Regular.woff2' },
      { family: 'Inter', src: '/fonts/Inter-Medium.woff2' },
      { family: 'Inter', src: '/fonts/Inter-Bold.woff2' },
    ];

    try {
      // Preload imágenes críticas
      await Promise.allSettled(
        criticalImages.map(src => preloadImage(src))
      );

      // Preload fonts críticas
      await Promise.allSettled(
        criticalFonts.map(font => preloadFont(font.family, font.src))
      );

      console.log('✅ Critical resources preloaded successfully');
    } catch (error) {
      console.warn('⚠️ Some critical resources failed to preload:', error);
    }
  };

  return {
    preloadImage,
    preloadFont,
    preloadScript,
    preloadCriticalAssets,
  };
};

/**
 * Cache de recursos con Service Worker (preparación para PWA)
 */
export const setupResourceCache = () => {
  const CACHE_NAME = 'coomunity-resources-v1';
  const CACHE_URLS = [
    // Recursos estáticos críticos
    '/images/logo.svg',
    '/images/default-avatar.png',
    '/css/loading-indicators.css',
    '/css/cursor-fix.css',
    '/css/button-consistency.css',
    // Fonts
    '/fonts/Inter-Regular.woff2',
    '/fonts/Inter-Medium.woff2',
    '/fonts/Inter-Bold.woff2',
  ];

  const cacheResources = async () => {
    if ('caches' in window) {
      try {
        const cache = await caches.open(CACHE_NAME);
        await cache.addAll(CACHE_URLS);
        console.log('✅ Resources cached successfully');
      } catch (error) {
        console.warn('⚠️ Failed to cache resources:', error);
      }
    }
  };

  const getCachedResource = async (url: string): Promise<Response | null> => {
    if ('caches' in window) {
      const cache = await caches.open(CACHE_NAME);
      return await cache.match(url) || null;
    }
    return null;
  };

  const clearCache = async () => {
    if ('caches' in window) {
      await caches.delete(CACHE_NAME);
      console.log('✅ Resource cache cleared');
    }
  };

  return {
    cacheResources,
    getCachedResource,
    clearCache,
  };
};

/**
 * Optimización de imágenes responsive
 */
export const getOptimizedImageSrc = (
  baseSrc: string,
  width: number,
  quality: number = 85
): string => {
  // En un entorno de producción, esto se integraría con un servicio de optimización de imágenes
  // como Cloudinary, ImageOptim, o un CDN con optimización automática
  
  const params = new URLSearchParams({
    w: width.toString(),
    q: quality.toString(),
    f: 'webp', // Formato WebP para mejor compresión
  });

  // Simular URL de servicio de optimización de imágenes
  return `${baseSrc}?${params.toString()}`;
};

/**
 * Detección de soporte para formatos de imagen modernos
 */
export const getImageFormatSupport = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;

  const supportsWebP = canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  const supportsAVIF = canvas.toDataURL('image/avif').indexOf('data:image/avif') === 0;

  return {
    webp: supportsWebP,
    avif: supportsAVIF,
    jpeg: true,
    png: true,
  };
};

/**
 * Component para imagen optimizada con lazy loading
 */
export interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  quality?: number;
  lazy?: boolean;
  className?: string;
  placeholder?: string;
}

export const createOptimizedImageElement = ({
  src,
  alt,
  width,
  height,
  quality = 85,
  lazy = true,
  className = '',
  placeholder = '/images/loading-placeholder.svg',
}: OptimizedImageProps): HTMLImageElement => {
  const img = document.createElement('img');
  
  img.alt = alt;
  img.className = `optimized-image ${className}`;
  
  if (width) img.width = width;
  if (height) img.height = height;

  if (lazy) {
    // Configurar lazy loading
    img.src = placeholder;
    img.dataset.src = width ? getOptimizedImageSrc(src, width, quality) : src;
    img.classList.add('lazy-loading');
  } else {
    // Carga inmediata
    img.src = width ? getOptimizedImageSrc(src, width, quality) : src;
  }

  return img;
};

/**
 * Monitor de performance de recursos
 */
export const monitorResourcePerformance = () => {
  const measureResourceTiming = () => {
    if ('performance' in window && 'getEntriesByType' in performance) {
      const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
      
      const imageResources = resources.filter(resource => 
        resource.initiatorType === 'img' || 
        resource.name.match(/\.(jpg|jpeg|png|gif|webp|avif|svg)$/i)
      );

      const slowImages = imageResources.filter(resource => 
        resource.duration > 1000 // Más de 1 segundo
      );

      if (slowImages.length > 0) {
        console.warn('🐌 Slow loading images detected:', slowImages);
      }

      const totalImageSize = imageResources.reduce((total, resource) => 
        total + (resource.transferSize || 0), 0
      );

      console.log(`📊 Image performance stats:
        - Total images: ${imageResources.length}
        - Total size: ${(totalImageSize / 1024).toFixed(2)} KB
        - Slow images: ${slowImages.length}
      `);

      return {
        totalImages: imageResources.length,
        totalSize: totalImageSize,
        slowImages: slowImages.length,
        averageLoadTime: imageResources.reduce((total, resource) => 
          total + resource.duration, 0) / imageResources.length,
      };
    }
  };

  return { measureResourceTiming };
}; 