/**
 * 🚀 Configuración de Migración al Backend NestJS - Fase 2.4
 * 
 * Archivo centralizado que define el estado de migración de todos los servicios
 * de la SuperApp desde datos mock al backend NestJS real en puerto 3002.
 */

// 🌐 Configuración del Backend NestJS
export const BACKEND_CONFIG = {
  baseUrl: 'http://localhost:3002',
  timeout: 10000,
  retries: 3,
  enableLogging: true,
} as const;

// 🎯 Estado de migración por módulo
export const MIGRATION_STATUS = {
  // ✅ COMPLETAMENTE MIGRADOS
  auth: {
    status: 'MIGRATED',
    backend: true,
    mock: false,
    description: 'Autenticación JWT completamente migrada'
  },
  videos: {
    status: 'MIGRATED', 
    backend: true,
    mock: false,
    description: 'Gestión de videos y mundos completamente migrada'
  },
  mundos: {
    status: 'MIGRATED',
    backend: true, 
    mock: false,
    description: 'Mundos y playlists completamente migrados'
  },
  
  // 🚀 RECIÉN MIGRADOS - Fase 2.4
  categories: {
    status: 'MIGRATED',
    backend: true,
    mock: false,
    fallback: true,
    description: 'Categorías migradas con fallback inteligente'
  },
  challenges: {
    status: 'MIGRATED',
    backend: true,
    mock: false,
    fallback: true,
    description: 'Challenges migrados con fallback temporal'
  },
  system: {
    status: 'MIGRATED',
    backend: true,
    mock: false, 
    fallback: true,
    description: 'Configuraciones del sistema migradas'
  },
  
  // 🔄 EN PROCESO DE MIGRACIÓN
  wallet: {
    status: 'HYBRID',
    backend: true,
    mock: true,
    fallback: true,
    description: 'Wallet con datos reales y fallbacks optimizados'
  },
  merits: {
    status: 'HYBRID',
    backend: true,
    mock: true,
    fallback: true,
    description: 'Sistema de méritos con implementación híbrida'
  },
  social: {
    status: 'HYBRID',
    backend: true,
    mock: true,
    fallback: true,
    description: 'Módulo social con fallbacks inteligentes'
  },
  users: {
    status: 'HYBRID',
    backend: true,
    mock: true,
    fallback: true,
    description: 'Gestión de usuarios con fallback a datos de auth'
  },
  
  // 📋 PENDIENTES (Si existen)
  notifications: {
    status: 'PLANNED',
    backend: false,
    mock: true,
    description: 'Sistema de notificaciones por migrar'
  },
  analytics: {
    status: 'PLANNED', 
    backend: false,
    mock: true,
    description: 'Analytics y métricas por migrar'
  }
} as const;

// 🔧 Configuración de servicios específicos
export const SERVICE_CONFIG = {
  enableRealBackend: true,
  enableMockFallbacks: true,
  enableDebugLogging: true,
  enableRetries: true,
  enableHybridMode: false, // Deshabilitado para migración completa
} as const;

// 📊 Funciones de utilidad para migración
export const MigrationUtils = {
  /**
   * Verificar si un módulo está completamente migrado
   */
  isFullyMigrated: (module: keyof typeof MIGRATION_STATUS): boolean => {
    const status = MIGRATION_STATUS[module];
    return status.status === 'MIGRATED' && status.backend && !status.mock;
  },

  /**
   * Verificar si un módulo necesita fallbacks
   */
  needsFallback: (module: keyof typeof MIGRATION_STATUS): boolean => {
    const status = MIGRATION_STATUS[module];
    return Boolean((status as any).fallback);
  },

  /**
   * Obtener resumen del estado de migración
   */
  getMigrationSummary: () => {
    const modules = Object.entries(MIGRATION_STATUS);
    const migrated = modules.filter(([_, config]) => config.status === 'MIGRATED').length;
    const hybrid = modules.filter(([_, config]) => config.status === 'HYBRID').length;
    const planned = modules.filter(([_, config]) => config.status === 'PLANNED').length;
    
    return {
      total: modules.length,
      migrated,
      hybrid,
      planned,
      completionPercentage: Math.round((migrated / modules.length) * 100),
      hybridPercentage: Math.round(((migrated + hybrid) / modules.length) * 100)
    };
  },

  /**
   * Log del estado de migración 
   */
  logMigrationStatus: () => {
    const summary = MigrationUtils.getMigrationSummary();
    
    console.group('🚀 Estado de Migración al Backend NestJS - Fase 2.4');
    console.info(`📊 Progreso General: ${summary.completionPercentage}% completamente migrado`);
    console.info(`🔄 Con Backend Real: ${summary.hybridPercentage}% (incluye híbridos)`);
    console.info(`✅ Migrados: ${summary.migrated}/${summary.total}`);
    console.info(`🔄 Híbridos: ${summary.hybrid}/${summary.total}`);
    console.info(`📋 Pendientes: ${summary.planned}/${summary.total}`);
    
    console.groupCollapsed('📋 Detalle por módulo:');
    Object.entries(MIGRATION_STATUS).forEach(([module, config]) => {
      const emoji = config.status === 'MIGRATED' ? '✅' : 
                   config.status === 'HYBRID' ? '🔄' : '📋';
      console.info(`${emoji} ${module}: ${config.description}`);
    });
    console.groupEnd();
    
    console.groupEnd();
  }
};

// 🎯 Configuración por defecto para nuevos servicios
export const DEFAULT_SERVICE_CONFIG = {
  enableBackend: true,
  enableMock: false,
  enableFallback: true,
  enableLogging: true,
  enableRetries: true,
  retryCount: 3,
  timeout: 10000,
} as const;

// 📡 URLs de endpoints del backend NestJS
export const BACKEND_ENDPOINTS = {
  // Core Auth & Users
  auth: '/auth',
  users: '/users',
  profiles: '/profiles',
  
  // Content & Media
  videos: '/videos',
  mundos: '/mundos',
  playlists: '/playlists',
  categories: '/categories',
  
  // Gaming & Gamification
  challenges: '/challenges',
  quests: '/quests',
  achievements: '/achievements',
  
  // Economy & Rewards
  wallet: '/wallet',
  merits: '/merits',
  transactions: '/transactions',
  
  // Social Features
  social: '/social',
  matches: '/social/matches',
  messages: '/social/messages',
  posts: '/social/posts',
  notifications: '/social/notifications',
  
  // Marketplace
  marketplace: '/marketplace',
  products: '/marketplace/products',
  services: '/marketplace/services',
  
  // System & Config
  system: '/system',
  configs: '/system/configs',
  health: '/health',
  
  // Analytics & Stats
  stats: '/stats',
  analytics: '/analytics',
  
  // Forms & Submissions
  forms: '/forms',
} as const;

// 🚀 Exportar configuración principal
export default {
  BACKEND_CONFIG,
  MIGRATION_STATUS,
  SERVICE_CONFIG,
  MigrationUtils,
  DEFAULT_SERVICE_CONFIG,
  BACKEND_ENDPOINTS,
};