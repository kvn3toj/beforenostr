// 🎯 BUNDLE OPTIMIZER - Advanced Performance Optimizations
// =========================================================
// Sistema avanzado de optimización de bundle para reducir el tamaño total

import { lazy } from 'react';

// 🔥 DYNAMIC IMPORTS OPTIMIZER
// ============================
export const dynamicImports = {
  // Heavy libraries que se pueden cargar dinámicamente
  charts: {
    recharts: () => import('recharts'),
    chartjs: () => import('chart.js'),
  },
  
  // UI libraries pesadas
  materialUI: {
    datePickers: () => import('@mui/x-date-pickers'),
    dataGrid: () => import('@mui/x-data-grid'),
    lab: () => import('@mui/lab'),
  },
  
  // Animation libraries
  animations: {
    framerMotion: () => import('framer-motion'),
    lottie: () => import('lottie-react'),
  },
  
  // Utility libraries
  utils: {
    lodash: () => import('lodash'),
    dateFns: () => import('date-fns'),
    axios: () => import('axios'),
  }
};

// 🎯 CDN EXTERNALS CONFIGURATION
// ===============================
export const cdnExternals = {
  development: {
    // En desarrollo, usar node_modules normalmente
    externals: [],
  },
  production: {
    // En producción, usar CDN para librerías pesadas
    externals: {
      'react': 'React',
      'react-dom': 'ReactDOM',
      // Solo si es necesario extremo:
      // '@mui/material': 'MaterialUI',
      // 'framer-motion': 'FramerMotion',
    },
    scripts: [
      'https://unpkg.com/react@18/umd/react.production.min.js',
      'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js',
    ]
  }
};

// 🔥 LAZY COMPONENT OPTIMIZER
// ============================
export const lazyComponentOptimizer = {
  // Agrupar componentes relacionados para pre-loading
  groups: {
    marketplace: [
      'MarketplacePage',
      'EnhancedMarketplace', 
      'ProductCard',
      'AdvancedFilters'
    ],
    uplay: [
      'UPlayPage',
      'UPlayEnhanced',
      'UnifiedUPlayPlayer',
      'InteractiveVideoPlayer'
    ],
    social: [
      'SocialMain',
      'SocialFeed',
      'SocialChat',
      'ConnectionsManager'
    ],
    admin: [
      'Analytics',
      'UStats',
      'PerformanceMonitor'
    ]
  },
  
  // Pre-load estratégico basado en rutas
  preloadStrategy: {
    immediate: ['HomePage', 'MainLayout', 'ErrorBoundary'],
    onIdle: ['MarketplacePage', 'UPlayPage'],
    onInteraction: ['SocialMain', 'Profile'],
    onDemand: ['Settings', 'Analytics', 'ChallengesPage']
  }
};

// 🎯 BUNDLE ANALYZER INTEGRATION
// ===============================
export const bundleAnalyzer = {
  // Configuración para análisis de bundle
  config: {
    analyzerMode: 'static',
    reportFilename: 'bundle-report.html',
    openAnalyzer: false,
    generateStatsFile: true,
    statsFilename: 'bundle-stats.json',
  },
  
  // Thresholds para alertas
  thresholds: {
    maxBundleSize: 15000, // 15MB
    maxChunkSize: 500, // 500KB
    maxAssetSize: 300, // 300KB
  }
};

// 🔥 TREE SHAKING OPTIMIZER
// ==========================
export const treeShakingOptimizer = {
  // Configuraciones para mejorar tree-shaking
  sideEffects: {
    // Marcar archivos sin side effects
    false: [
      '**/*.ts',
      '**/*.tsx',
      '**/*.css',
      '**/*.scss'
    ],
    // Archivos con side effects (no tree-shake)
    true: [
      '**/polyfills.ts',
      '**/index.css',
      '**/sw.js'
    ]
  },
  
  // Optimizaciones específicas por librería
  libraryOptimizations: {
    materialUI: {
      // Solo importar lo necesario de MUI
      transformer: 'babel-plugin-import',
      libraryName: '@mui/material',
      libraryDirectory: '',
      camel2DashComponentName: false,
    },
    lodash: {
      // Tree-shake lodash
      plugin: 'babel-plugin-lodash',
    },
    dateFns: {
      // Tree-shake date-fns
      plugin: 'babel-plugin-date-fns',
    }
  }
};

// 🎯 CODE SPLITTING STRATEGIES
// =============================
export const codeSplittingStrategies = {
  // Estrategia por vendor
  vendor: {
    react: ['react', 'react-dom', 'react-router-dom'],
    ui: ['@mui/material', '@mui/system', '@emotion/react'],
    icons: ['@mui/icons-material'],
    query: ['@tanstack/react-query'],
    animation: ['framer-motion'],
    utils: ['lodash.debounce', 'date-fns'],
  },
  
  // Estrategia por features
  features: {
    marketplace: [/.*marketplace.*/, /.*product.*/, /.*lets.*/],
    uplay: [/.*uplay.*/, /.*video.*/, /.*player.*/],
    social: [/.*social.*/, /.*chat.*/, /.*feed.*/],
    admin: [/.*admin.*/, /.*analytics.*/, /.*stats.*/],
  },
  
  // Estrategia por tamaño
  size: {
    large: 100000, // 100KB+
    medium: 50000, // 50KB+
    small: 20000, // 20KB+
  }
};

// 🔥 COMPRESSION OPTIMIZER
// =========================
export const compressionOptimizer = {
  gzip: {
    threshold: 8192, // 8KB
    level: 6,
    memLevel: 8,
  },
  brotli: {
    threshold: 8192,
    level: 11,
    memLevel: 4,
  },
  // Configuración de assets
  assets: {
    images: {
      // Optimización de imágenes
      webp: true,
      avif: true,
      quality: 80,
      progressive: true,
    },
    fonts: {
      // Pre-load critical fonts
      preload: ['Inter', 'Roboto'],
      display: 'swap',
    }
  }
};

// 🎯 PERFORMANCE BUDGET
// ======================
export const performanceBudget = {
  // Presupuestos de performance
  budgets: [
    {
      type: 'bundle',
      name: 'total',
      maximumWarning: '12MB',
      maximumError: '15MB'
    },
    {
      type: 'initial',
      name: 'initial',
      maximumWarning: '2MB',
      maximumError: '3MB'
    },
    {
      type: 'anyComponentStyle',
      maximumWarning: '50KB',
      maximumError: '100KB'
    }
  ],
  
  // Métricas objetivo
  targets: {
    firstContentfulPaint: 1500, // 1.5s
    largestContentfulPaint: 2500, // 2.5s
    timeToInteractive: 3000, // 3s
    totalBlockingTime: 300, // 300ms
    cumulativeLayoutShift: 0.1, // 0.1
  }
};

// 🚀 RUNTIME OPTIMIZER
// =====================
export const runtimeOptimizer = {
  // Service Worker para caching
  serviceWorker: {
    enabled: true,
    strategies: {
      pages: 'NetworkFirst',
      assets: 'CacheFirst',
      api: 'NetworkFirst',
      images: 'CacheFirst',
    },
    maxEntries: 100,
    maxAgeSeconds: 30 * 24 * 60 * 60, // 30 días
  },
  
  // Preloading inteligente
  preloading: {
    criticalRoutes: ['/', '/marketplace', '/uplay'],
    prefetchOnIdle: true,
    prefetchOnHover: true,
    intersectionThreshold: 0.1,
  }
};

// 📊 BUNDLE HEALTH CHECKER
// =========================
export const bundleHealthChecker = {
  check: (stats: any) => {
    const issues = [];
    const recommendations = [];
    
    // Verificar tamaño total
    if (stats.totalSize > performanceBudget.budgets[0].maximumError) {
      issues.push(`Bundle size (${stats.totalSize}) exceeds maximum (${performanceBudget.budgets[0].maximumError})`);
    }
    
    // Verificar chunks grandes
    stats.chunks?.forEach((chunk: any) => {
      if (chunk.size > codeSplittingStrategies.size.large) {
        issues.push(`Chunk ${chunk.name} is too large (${chunk.size})`);
        recommendations.push(`Consider splitting ${chunk.name} into smaller chunks`);
      }
    });
    
    // Verificar duplicados
    if (stats.duplicates?.length > 0) {
      issues.push(`Found ${stats.duplicates.length} duplicate modules`);
      recommendations.push('Enable proper code splitting to eliminate duplicates');
    }
    
    return {
      healthy: issues.length === 0,
      issues,
      recommendations,
      score: Math.max(0, 100 - (issues.length * 10))
    };
  }
};

export default {
  dynamicImports,
  cdnExternals,
  lazyComponentOptimizer,
  bundleAnalyzer,
  treeShakingOptimizer,
  codeSplittingStrategies,
  compressionOptimizer,
  performanceBudget,
  runtimeOptimizer,
  bundleHealthChecker,
}; 