/**
 * 🌌 SERVICE WORKER INTELLIGENCE SYSTEM
 * =====================================
 *
 * Sistema inteligente de caching y optimización para el Design System CoomÜnity
 * Parte de la Fase 5: Optimización Extrema - Q3 2025
 */

interface CacheStrategy {
  name: string;
  pattern: RegExp;
  strategy: 'cache-first' | 'network-first' | 'stale-while-revalidate' | 'network-only' | 'cache-only';
  options: {
    cacheName: string;
    expiration?: {
      maxEntries: number;
      maxAgeSeconds: number;
      purgeOnQuotaError?: boolean;
    };
    cacheKeyWillBeUsed?: (request: Request) => string;
    precache?: boolean;
  };
}

interface IntelligentCacheConfig {
  strategies: CacheStrategy[];
  performanceTargets: {
    cacheHitRate: number; // Target: >85%
    firstPaintImprovement: number; // Target: >50% improvement
    bundleSizeReduction: number; // Target: >40% reduction
    memoryUsage: number; // Target: <20MB
  };
  adaptiveSettings: {
    networkSpeed: 'slow' | 'fast' | 'auto';
    deviceMemory: 'low' | 'medium' | 'high' | 'auto';
    batteryLevel: 'low' | 'medium' | 'high' | 'auto';
  };
}

interface PerformanceMetrics {
  cacheHits: number;
  cacheMisses: number;
  networkRequests: number;
  totalBytesSaved: number;
  averageResponseTime: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  timeToInteractive: number;
  totalBlockingTime: number;
  lastUpdated: number;
}

interface OptimizationRecommendation {
  type: 'cache' | 'network' | 'bundle' | 'critical-css' | 'preload';
  priority: 'high' | 'medium' | 'low';
  description: string;
  estimatedImprovement: number;
  implementationEffort: 'easy' | 'medium' | 'hard';
  autoImplementable: boolean;
}

export class ServiceWorkerIntelligence {
  private static instance: ServiceWorkerIntelligence;
  private config: IntelligentCacheConfig;
  private metrics: PerformanceMetrics;
  private isServiceWorkerSupported: boolean;
  private registration: ServiceWorkerRegistration | null = null;

  private constructor() {
    this.isServiceWorkerSupported = 'serviceWorker' in navigator;
    this.config = this.getDefaultConfig();
    this.metrics = this.initializeMetrics();
  }

  static getInstance(): ServiceWorkerIntelligence {
    if (!ServiceWorkerIntelligence.instance) {
      ServiceWorkerIntelligence.instance = new ServiceWorkerIntelligence();
    }
    return ServiceWorkerIntelligence.instance;
  }

  /**
   * Configuración por defecto del sistema inteligente
   */
  private getDefaultConfig(): IntelligentCacheConfig {
    return {
      strategies: [
        {
          name: 'design-tokens',
          pattern: /\/(design-tokens|css|fonts)/,
          strategy: 'cache-first',
          options: {
            cacheName: 'coomunity-design-tokens-v2',
            expiration: {
              maxEntries: 50,
              maxAgeSeconds: 30 * 24 * 60 * 60, // 30 días
              purgeOnQuotaError: true
            },
            precache: true
          }
        },
        {
          name: 'components',
          pattern: /\/(components|chunks|modules)/,
          strategy: 'stale-while-revalidate',
          options: {
            cacheName: 'coomunity-components-v2',
            expiration: {
              maxEntries: 100,
              maxAgeSeconds: 7 * 24 * 60 * 60, // 7 días
              purgeOnQuotaError: true
            }
          }
        },
        {
          name: 'animations',
          pattern: /\/(animations|motion|transitions)/,
          strategy: 'network-first',
          options: {
            cacheName: 'coomunity-animations-v2',
            expiration: {
              maxEntries: 30,
              maxAgeSeconds: 24 * 60 * 60, // 1 día
            }
          }
        },
        {
          name: 'api-data',
          pattern: /\/api\//,
          strategy: 'network-first',
          options: {
            cacheName: 'coomunity-api-v2',
            expiration: {
              maxEntries: 100,
              maxAgeSeconds: 5 * 60, // 5 minutos
            }
          }
        },
        {
          name: 'static-assets',
          pattern: /\.(png|jpg|jpeg|webp|avif|svg|ico)$/,
          strategy: 'cache-first',
          options: {
            cacheName: 'coomunity-images-v2',
            expiration: {
              maxEntries: 200,
              maxAgeSeconds: 90 * 24 * 60 * 60, // 90 días
              purgeOnQuotaError: true
            }
          }
        }
      ],
      performanceTargets: {
        cacheHitRate: 0.85, // 85%
        firstPaintImprovement: 0.5, // 50%
        bundleSizeReduction: 0.4, // 40%
        memoryUsage: 20 * 1024 * 1024 // 20MB
      },
      adaptiveSettings: {
        networkSpeed: 'auto',
        deviceMemory: 'auto',
        batteryLevel: 'auto'
      }
    };
  }

  /**
   * Inicializar métricas de performance
   */
  private initializeMetrics(): PerformanceMetrics {
    const stored = localStorage.getItem('coomunity-sw-metrics');
    if (stored) {
      return JSON.parse(stored);
    }

    return {
      cacheHits: 0,
      cacheMisses: 0,
      networkRequests: 0,
      totalBytesSaved: 0,
      averageResponseTime: 0,
      firstContentfulPaint: 0,
      largestContentfulPaint: 0,
      cumulativeLayoutShift: 0,
      timeToInteractive: 0,
      totalBlockingTime: 0,
      lastUpdated: Date.now()
    };
  }

  /**
   * Registrar e inicializar el Service Worker
   */
  async registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
    if (!this.isServiceWorkerSupported) {
      console.warn('🚫 Service Worker not supported in this browser');
      return null;
    }

    try {
      console.log('🌌 Registering CoomÜnity Design System Service Worker...');

      this.registration = await navigator.serviceWorker.register(
        '/sw-design-system.js',
        {
          scope: '/',
          type: 'module'
        }
      );

      // Configurar comunicación con el SW
      this.setupServiceWorkerCommunication();

      // Analizar condiciones del dispositivo para optimización adaptativa
      await this.analyzeDeviceConditions();

      // Aplicar optimizaciones inteligentes
      await this.applyIntelligentOptimizations();

      console.log('✅ Service Worker registered successfully');
      return this.registration;

    } catch (error) {
      console.error('❌ Service Worker registration failed:', error);
      return null;
    }
  }

  /**
   * Configurar comunicación bidireccional con el Service Worker
   */
  private setupServiceWorkerCommunication(): void {
    if (!this.registration) return;

    navigator.serviceWorker.addEventListener('message', (event) => {
      const { type, data } = event.data;

      switch (type) {
        case 'CACHE_HIT':
          this.metrics.cacheHits++;
          this.metrics.totalBytesSaved += data.size;
          break;
        case 'CACHE_MISS':
          this.metrics.cacheMisses++;
          break;
        case 'NETWORK_REQUEST':
          this.metrics.networkRequests++;
          break;
        case 'PERFORMANCE_UPDATE':
          this.updatePerformanceMetrics(data);
          break;
      }

      this.saveMetrics();
    });

    // Enviar configuración inicial al SW
    this.sendMessageToSW('CONFIG_UPDATE', this.config);
  }

  /**
   * Analizar condiciones del dispositivo para optimización adaptativa
   */
  private async analyzeDeviceConditions(): Promise<void> {
    const conditions = {
      networkSpeed: 'fast' as const,
      deviceMemory: 'high' as const,
      batteryLevel: 'high' as const
    };

    // Detectar velocidad de red
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
        conditions.networkSpeed = 'slow';
      }
    }

    // Detectar memoria del dispositivo
    if ('deviceMemory' in navigator) {
      const memory = (navigator as any).deviceMemory;
      if (memory <= 2) {
        conditions.deviceMemory = 'low';
      } else if (memory <= 4) {
        conditions.deviceMemory = 'medium';
      }
    }

    // Detectar nivel de batería
    if ('getBattery' in navigator) {
      try {
        const battery = await (navigator as any).getBattery();
        if (battery.level < 0.2) {
          conditions.batteryLevel = 'low';
        } else if (battery.level < 0.5) {
          conditions.batteryLevel = 'medium';
        }
      } catch (error) {
        console.warn('Battery API not available');
      }
    }

    // Actualizar configuración basada en condiciones
    this.adaptConfigurationToConditions(conditions);
  }

  /**
   * Adaptar configuración basada en condiciones del dispositivo
   */
  private adaptConfigurationToConditions(conditions: {
    networkSpeed: 'slow' | 'fast';
    deviceMemory: 'low' | 'medium' | 'high';
    batteryLevel: 'low' | 'medium' | 'high';
  }): void {
    // Optimizaciones para red lenta
    if (conditions.networkSpeed === 'slow') {
      this.config.strategies.forEach(strategy => {
        if (strategy.name === 'animations') {
          strategy.strategy = 'cache-first'; // Priorizar cache para animaciones
        }
        if (strategy.options.expiration) {
          strategy.options.expiration.maxAgeSeconds *= 2; // Mantener cache más tiempo
        }
      });
    }

    // Optimizaciones para memoria baja
    if (conditions.deviceMemory === 'low') {
      this.config.strategies.forEach(strategy => {
        if (strategy.options.expiration) {
          strategy.options.expiration.maxEntries = Math.floor(
            strategy.options.expiration.maxEntries * 0.5
          );
        }
      });
    }

    // Optimizaciones para batería baja
    if (conditions.batteryLevel === 'low') {
      this.config.strategies.forEach(strategy => {
        if (strategy.name === 'animations') {
          strategy.strategy = 'cache-only'; // Solo usar cache para animaciones
        }
      });
    }

    console.log('🔧 Configuration adapted to device conditions:', conditions);
  }

  /**
   * Aplicar optimizaciones inteligentes
   */
  private async applyIntelligentOptimizations(): Promise<void> {
    const recommendations = await this.generateOptimizationRecommendations();

    console.log(`🎯 Generated ${recommendations.length} optimization recommendations`);

    // Aplicar automáticamente las optimizaciones simples
    const autoImplementable = recommendations.filter(r => r.autoImplementable);

    for (const recommendation of autoImplementable) {
      await this.implementRecommendation(recommendation);
    }

    // Notificar recomendaciones manuales
    const manualRecommendations = recommendations.filter(r => !r.autoImplementable);
    if (manualRecommendations.length > 0) {
      console.log('📋 Manual optimization recommendations:', manualRecommendations);
    }
  }

  /**
   * Generar recomendaciones de optimización
   */
  private async generateOptimizationRecommendations(): Promise<OptimizationRecommendation[]> {
    const recommendations: OptimizationRecommendation[] = [];

    // Analizar cache hit rate
    const cacheHitRate = this.metrics.cacheHits / (this.metrics.cacheHits + this.metrics.cacheMisses) || 0;

    if (cacheHitRate < this.config.performanceTargets.cacheHitRate) {
      recommendations.push({
        type: 'cache',
        priority: 'high',
        description: `Cache hit rate is ${(cacheHitRate * 100).toFixed(1)}%, target is ${(this.config.performanceTargets.cacheHitRate * 100).toFixed(1)}%`,
        estimatedImprovement: (this.config.performanceTargets.cacheHitRate - cacheHitRate) * 100,
        implementationEffort: 'medium',
        autoImplementable: true
      });
    }

    // Analizar First Contentful Paint
    if (this.metrics.firstContentfulPaint > 1600) {
      recommendations.push({
        type: 'critical-css',
        priority: 'high',
        description: 'First Contentful Paint is too slow, implement critical CSS inlining',
        estimatedImprovement: 40,
        implementationEffort: 'medium',
        autoImplementable: false
      });
    }

    // Analizar bundle size
    const estimatedBundleSize = this.metrics.totalBytesSaved / (this.metrics.cacheHits || 1);
    if (estimatedBundleSize > 200 * 1024) { // 200KB
      recommendations.push({
        type: 'bundle',
        priority: 'medium',
        description: 'Bundle size is large, consider code splitting and tree shaking',
        estimatedImprovement: 30,
        implementationEffort: 'hard',
        autoImplementable: false
      });
    }

    // Analizar preloading opportunities
    if (this.metrics.networkRequests > 50) {
      recommendations.push({
        type: 'preload',
        priority: 'medium',
        description: 'High network request count, implement intelligent preloading',
        estimatedImprovement: 25,
        implementationEffort: 'medium',
        autoImplementable: true
      });
    }

    return recommendations.sort((a, b) => {
      const priorityWeight = { high: 3, medium: 2, low: 1 };
      return priorityWeight[b.priority] - priorityWeight[a.priority];
    });
  }

  /**
   * Implementar recomendación específica
   */
  private async implementRecommendation(recommendation: OptimizationRecommendation): Promise<void> {
    console.log(`🔧 Implementing: ${recommendation.description}`);

    switch (recommendation.type) {
      case 'cache':
        await this.optimizeCacheStrategy();
        break;
      case 'preload':
        await this.implementIntelligentPreloading();
        break;
      case 'network':
        await this.optimizeNetworkStrategy();
        break;
    }
  }

  /**
   * Optimizar estrategia de cache
   */
  private async optimizeCacheStrategy(): Promise<void> {
    // Aumentar duración de cache para recursos estables
    this.config.strategies.forEach(strategy => {
      if (strategy.name === 'design-tokens' || strategy.name === 'static-assets') {
        if (strategy.options.expiration) {
          strategy.options.expiration.maxAgeSeconds *= 1.5;
        }
      }
    });

    this.sendMessageToSW('CONFIG_UPDATE', this.config);
  }

  /**
   * Implementar preloading inteligente
   */
  private async implementIntelligentPreloading(): Promise<void> {
    const criticalResources = [
      '/static/css/critical.css',
      '/static/js/main.chunk.js',
      'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap'
    ];

    criticalResources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = resource;
      link.as = resource.includes('.css') ? 'style' : 'script';
      if (resource.includes('fonts')) {
        link.crossOrigin = 'anonymous';
      }
      document.head.appendChild(link);
    });
  }

  /**
   * Optimizar estrategia de red
   */
  private async optimizeNetworkStrategy(): Promise<void> {
    // Implementar estrategia adaptativa basada en condiciones de red
    this.config.strategies.forEach(strategy => {
      if (strategy.name === 'api-data') {
        strategy.strategy = 'stale-while-revalidate'; // Mejor UX para datos API
      }
    });

    this.sendMessageToSW('CONFIG_UPDATE', this.config);
  }

  /**
   * Actualizar métricas de performance
   */
  private updatePerformanceMetrics(data: Partial<PerformanceMetrics>): void {
    Object.assign(this.metrics, data);
    this.metrics.lastUpdated = Date.now();
  }

  /**
   * Enviar mensaje al Service Worker
   */
  private sendMessageToSW(type: string, data: any): void {
    if (this.registration?.active) {
      this.registration.active.postMessage({ type, data });
    }
  }

  /**
   * Guardar métricas en localStorage
   */
  private saveMetrics(): void {
    localStorage.setItem('coomunity-sw-metrics', JSON.stringify(this.metrics));
  }

  /**
   * Obtener reporte de performance actual
   */
  getPerformanceReport(): {
    metrics: PerformanceMetrics;
    score: number;
    recommendations: OptimizationRecommendation[];
    targets: typeof this.config.performanceTargets;
  } {
    const cacheHitRate = this.metrics.cacheHits / (this.metrics.cacheHits + this.metrics.cacheMisses) || 0;
    const score = Math.round(
      (cacheHitRate * 40) + // 40% weight for cache hit rate
      (Math.min(this.metrics.firstContentfulPaint / 1000, 1) * 30) + // 30% weight for FCP
      (Math.min(this.metrics.totalBytesSaved / (1024 * 1024), 1) * 30) // 30% weight for bytes saved
    );

    return {
      metrics: this.metrics,
      score,
      recommendations: [], // Se llenarían con generateOptimizationRecommendations()
      targets: this.config.performanceTargets
    };
  }

  /**
   * Análisis de Web Vitals en tiempo real
   */
  async collectWebVitals(): Promise<void> {
    if ('web-vitals' in window) {
      const { getCLS, getFID, getFCP, getLCP, getTTFB } = (window as any).webVitals;

      getCLS((metric: any) => {
        this.metrics.cumulativeLayoutShift = metric.value;
      });

      getFCP((metric: any) => {
        this.metrics.firstContentfulPaint = metric.value;
      });

      getLCP((metric: any) => {
        this.metrics.largestContentfulPaint = metric.value;
      });

      this.saveMetrics();
    }
  }

  /**
   * Cleanup y desregistro del Service Worker
   */
  async unregister(): Promise<boolean> {
    if (this.registration) {
      return await this.registration.unregister();
    }
    return false;
  }
}

/**
 * Instancia singleton exportada
 */
export const serviceWorkerIntelligence = ServiceWorkerIntelligence.getInstance();

/**
 * Inicialización automática del sistema
 */
export const initializeServiceWorkerIntelligence = async (): Promise<void> => {
  try {
    const registration = await serviceWorkerIntelligence.registerServiceWorker();
    if (registration) {
      await serviceWorkerIntelligence.collectWebVitals();
      console.log('🌌 Service Worker Intelligence System initialized successfully');
    }
  } catch (error) {
    console.error('❌ Failed to initialize Service Worker Intelligence:', error);
  }
};
