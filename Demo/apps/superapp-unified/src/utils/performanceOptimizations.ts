import { lazy, ComponentType } from 'react';

// 🎯 PERFORMANCE MODES
export type PerformanceMode = 'high' | 'balanced' | 'economy';

export interface PerformanceConfig {
  mode: PerformanceMode;
  enableLazyLoading: boolean;
  enableImageOptimization: boolean;
  enableCodeSplitting: boolean;
  maxBundleSize: number; // in KB
  prefetchDelay: number; // in ms
  cacheStrategy: 'aggressive' | 'moderate' | 'minimal';
}

// 🔧 DEFAULT PERFORMANCE CONFIGS
export const performanceConfigs: Record<PerformanceMode, PerformanceConfig> = {
  high: {
    mode: 'high',
    enableLazyLoading: true,
    enableImageOptimization: true,
    enableCodeSplitting: true,
    maxBundleSize: 500,
    prefetchDelay: 100,
    cacheStrategy: 'aggressive'
  },
  balanced: {
    mode: 'balanced',
    enableLazyLoading: true,
    enableImageOptimization: true,
    enableCodeSplitting: true,
    maxBundleSize: 250,
    prefetchDelay: 300,
    cacheStrategy: 'moderate'
  },
  economy: {
    mode: 'economy',
    enableLazyLoading: false,
    enableImageOptimization: false,
    enableCodeSplitting: false,
    maxBundleSize: 100,
    prefetchDelay: 1000,
    cacheStrategy: 'minimal'
  }
};

// 🚀 ENHANCED LAZY LOADING WITH PRELOADING
export const createLazyComponentWithPreload = <T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  componentName: string
) => {
  let importPromise: Promise<{ default: T }> | null = null;

  const LazyComponent = lazy(() => {
    if (!importPromise) {
      importPromise = importFn();
    }
    return importPromise;
  });

  // Preload function that can be called before the component is needed
  const preload = () => {
    if (!importPromise) {
      importPromise = importFn();
    }
    return importPromise;
  };

  // Add preload method to the lazy component
  (LazyComponent as any).preload = preload;
  (LazyComponent as any).componentName = componentName;

  return LazyComponent;
};

// 🎭 ROUTE-BASED CODE SPLITTING
export const routeComponents = {
  HomePage: createLazyComponentWithPreload(
    () => import('../pages/Home'),
    'HomePage'
  ),
  MarketplacePage: createLazyComponentWithPreload(
    () => import('../pages/MarketplacePage'),
    'MarketplacePage'
  ),
  UPlayPage: createLazyComponentWithPreload(
    () => import('../pages/UPlay'),
    'UPlayPage'
  ),
  SocialPage: createLazyComponentWithPreload(
    () => import('../pages/Social'),
    'SocialPage'
  ),
  ProfilePage: createLazyComponentWithPreload(
    () => import('../pages/Profile'),
    'ProfilePage'
  ),
  WalletPage: createLazyComponentWithPreload(
    () => import('../pages/Wallet'),
    'WalletPage'
  ),
  SettingsPage: createLazyComponentWithPreload(
    () => import('../pages/Settings'),
    'SettingsPage'
  ),
  ChallengesPage: createLazyComponentWithPreload(
    () => import('../pages/ChallengesPage'),
    'ChallengesPage'
  ),
  GroupsPage: createLazyComponentWithPreload(
    () => import('../pages/GroupsPageEnhanced'),
    'GroupsPage'
  ),
} as const;

// 🎯 INTELLIGENT PRELOADING BASED ON USER BEHAVIOR
export class IntelligentPreloader {
  private preloadedRoutes = new Set<string>();
  private userHistory: string[] = [];
  private config: PerformanceConfig;

  constructor(config: PerformanceConfig) {
    this.config = config;
  }

  // Track user navigation
  trackNavigation(route: string) {
    this.userHistory.push(route);
    if (this.userHistory.length > 10) {
      this.userHistory.shift(); // Keep only last 10 routes
    }
    this.predictAndPreload();
  }

  // Predict next likely routes based on user behavior
  private predictAndPreload() {
    if (!this.config.enableCodeSplitting) return;

    const routeFrequency = this.userHistory.reduce((acc, route) => {
      acc[route] = (acc[route] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Preload most frequently visited routes that haven't been preloaded
    const sortedRoutes = Object.entries(routeFrequency)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3); // Top 3 routes

    sortedRoutes.forEach(([route]) => {
      this.preloadRoute(route);
    });
  }

  // Preload specific route
  preloadRoute(route: string) {
    if (this.preloadedRoutes.has(route)) return;

    const component = this.getComponentByRoute(route);
    if (component && (component as any).preload) {
      setTimeout(() => {
        (component as any).preload();
        this.preloadedRoutes.add(route);
      }, this.config.prefetchDelay);
    }
  }

  // Get component by route name
  private getComponentByRoute(route: string) {
    const routeMap: Record<string, any> = {
      '/': routeComponents.HomePage,
      '/home': routeComponents.HomePage,
      '/marketplace': routeComponents.MarketplacePage,
      '/uplay': routeComponents.UPlayPage,
      '/social': routeComponents.SocialPage,
      '/profile': routeComponents.ProfilePage,
      '/wallet': routeComponents.WalletPage,
      '/settings': routeComponents.SettingsPage,
      '/challenges': routeComponents.ChallengesPage,
      '/groups': routeComponents.GroupsPage,
    };

    return routeMap[route];
  }

  // Preload critical routes immediately
  preloadCriticalRoutes() {
    const criticalRoutes = ['/', '/home', '/marketplace', '/uplay'];
    criticalRoutes.forEach(route => this.preloadRoute(route));
  }
}

// 🗄️ CACHE MANAGEMENT
export class CacheManager {
  private cache = new Map<string, any>();
  private cacheExpiry = new Map<string, number>();
  private config: PerformanceConfig;

  constructor(config: PerformanceConfig) {
    this.config = config;
  }

  // Set cache with TTL based on strategy
  set(key: string, value: any, customTTL?: number) {
    const ttlMap = {
      aggressive: 30 * 60 * 1000, // 30 minutes
      moderate: 15 * 60 * 1000,   // 15 minutes
      minimal: 5 * 60 * 1000      // 5 minutes
    };

    const ttl = customTTL || ttlMap[this.config.cacheStrategy];
    const expiry = Date.now() + ttl;

    this.cache.set(key, value);
    this.cacheExpiry.set(key, expiry);

    // Clean up expired entries
    this.cleanup();
  }

  // Get from cache
  get(key: string) {
    const expiry = this.cacheExpiry.get(key);
    if (!expiry || Date.now() > expiry) {
      this.delete(key);
      return null;
    }
    return this.cache.get(key);
  }

  // Delete from cache
  delete(key: string) {
    this.cache.delete(key);
    this.cacheExpiry.delete(key);
  }

  // Clean up expired entries
  private cleanup() {
    const now = Date.now();
    for (const [key, expiry] of this.cacheExpiry.entries()) {
      if (now > expiry) {
        this.delete(key);
      }
    }
  }

  // Clear all cache
  clear() {
    this.cache.clear();
    this.cacheExpiry.clear();
  }

  // Get cache stats
  getStats() {
    return {
      size: this.cache.size,
      strategy: this.config.cacheStrategy,
      entries: Array.from(this.cache.keys())
    };
  }
}

// 📊 PERFORMANCE MONITOR
export class PerformanceMonitor {
  private metrics = new Map<string, number[]>();

  // Record timing metric
  recordTiming(name: string, duration: number) {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    this.metrics.get(name)!.push(duration);
  }

  // Get average timing for a metric
  getAverageTiming(name: string): number {
    const timings = this.metrics.get(name);
    if (!timings || timings.length === 0) return 0;
    return timings.reduce((sum, time) => sum + time, 0) / timings.length;
  }

  // Measure component render time
  measureComponentRender<T>(name: string, fn: () => T): T {
    const start = performance.now();
    const result = fn();
    const end = performance.now();
    this.recordTiming(`component:${name}`, end - start);
    return result;
  }

  // Get performance report
  getReport() {
    const report: Record<string, { average: number, count: number, total: number }> = {};
    
    for (const [name, timings] of this.metrics.entries()) {
      const total = timings.reduce((sum, time) => sum + time, 0);
      report[name] = {
        average: total / timings.length,
        count: timings.length,
        total
      };
    }

    return report;
  }

  // Check if performance is within acceptable limits
  isPerformanceAcceptable(): boolean {
    const renderTime = this.getAverageTiming('component:render');
    const loadTime = this.getAverageTiming('component:load');
    
    // Acceptable limits in milliseconds
    return renderTime < 100 && loadTime < 500;
  }
}

// 🎯 BUNDLE SIZE ANALYZER
export class BundleSizeAnalyzer {
  private config: PerformanceConfig;

  constructor(config: PerformanceConfig) {
    this.config = config;
  }

  // Estimate bundle size impact of loading a component
  estimateComponentSize(componentName: string): number {
    // Estimated sizes in KB (these would be determined from actual bundle analysis)
    const estimatedSizes: Record<string, number> = {
      HomePage: 45,
      MarketplacePage: 120,
      UPlayPage: 85,
      SocialPage: 90,
      ProfilePage: 75,
      WalletPage: 65,
      SettingsPage: 55,
      ChallengesPage: 95,
      GroupsPage: 110,
    };

    return estimatedSizes[componentName] || 50; // Default 50KB
  }

  // Check if loading a component would exceed bundle size limit
  wouldExceedLimit(componentName: string, currentSize: number): boolean {
    const componentSize = this.estimateComponentSize(componentName);
    return (currentSize + componentSize) > this.config.maxBundleSize;
  }

  // Get recommendations for optimization
  getOptimizationRecommendations(currentBundleSize: number) {
    const recommendations: string[] = [];

    if (currentBundleSize > this.config.maxBundleSize) {
      recommendations.push('Consider enabling more aggressive code splitting');
      recommendations.push('Implement dynamic imports for heavy components');
      recommendations.push('Review and remove unused dependencies');
    }

    if (this.config.mode === 'economy') {
      recommendations.push('Consider upgrading to balanced mode for better UX');
    }

    return recommendations;
  }
}

// 🚀 GLOBAL PERFORMANCE MANAGER
export class PerformanceManager {
  public config: PerformanceConfig;
  public preloader: IntelligentPreloader;
  public cache: CacheManager;
  public monitor: PerformanceMonitor;
  public analyzer: BundleSizeAnalyzer;

  constructor(mode: PerformanceMode = 'balanced') {
    this.config = performanceConfigs[mode];
    this.preloader = new IntelligentPreloader(this.config);
    this.cache = new CacheManager(this.config);
    this.monitor = new PerformanceMonitor();
    this.analyzer = new BundleSizeAnalyzer(this.config);
  }

  // Update performance mode
  setMode(mode: PerformanceMode) {
    this.config = performanceConfigs[mode];
    this.preloader = new IntelligentPreloader(this.config);
    this.cache = new CacheManager(this.config);
    this.analyzer = new BundleSizeAnalyzer(this.config);
  }

  // Get comprehensive performance report
  getComprehensiveReport() {
    return {
      mode: this.config.mode,
      config: this.config,
      monitor: this.monitor.getReport(),
      cache: this.cache.getStats(),
      isPerformanceAcceptable: this.monitor.isPerformanceAcceptable(),
      optimizationRecommendations: this.analyzer.getOptimizationRecommendations(0)
    };
  }

  // Initialize performance optimizations
  initialize() {
    // Preload critical routes
    this.preloader.preloadCriticalRoutes();
    
    // Set up performance monitoring
    if ('performance' in window && 'observer' in window.PerformanceObserver.prototype) {
      const perfObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'navigation') {
            this.monitor.recordTiming('page:load', entry.duration);
          }
          if (entry.entryType === 'paint') {
            this.monitor.recordTiming(`paint:${entry.name}`, entry.startTime);
          }
        }
      });
      
      perfObserver.observe({ entryTypes: ['navigation', 'paint'] });
    }

    console.log(`🚀 Performance Manager initialized in ${this.config.mode} mode`);
  }
}

// 🌟 CREATE GLOBAL INSTANCE
export const performanceManager = new PerformanceManager();

// 🎯 PERFORMANCE HOOKS
export const usePerformanceMode = () => {
  return {
    mode: performanceManager.config.mode,
    config: performanceManager.config,
    setMode: (mode: PerformanceMode) => performanceManager.setMode(mode),
    getReport: () => performanceManager.getComprehensiveReport()
  };
};

// 📊 COMPONENT PERFORMANCE WRAPPER
export const withPerformanceTracking = <P extends object>(
  Component: ComponentType<P>,
  componentName: string
) => {
  return React.memo((props: P) => {
    const start = performance.now();
    
    React.useEffect(() => {
      const end = performance.now();
      performanceManager.monitor.recordTiming(`component:${componentName}:mount`, end - start);
    }, []);

    return performanceManager.monitor.measureComponentRender(
      componentName,
      () => React.createElement(Component, props)
    );
  });
};

export default performanceManager; 