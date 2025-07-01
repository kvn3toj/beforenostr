/**
 * 🚩 Advanced Feature Flags System
 * Sistema avanzado de banderas de características para CoomÜnity SuperApp
 */

import React from 'react';
import { UserProfile } from '../types/user';

// 🎯 Definición de todas las features disponibles
export interface FeatureFlags {
  // 🔐 Autenticación y Seguridad
  realAuth: boolean;
  mfaEnabled: boolean;
  biometricAuth: boolean;

  // 💰 Sistema de Pagos
  realPayments: boolean;
  cryptoPayments: boolean;
  internationalPayments: boolean;
  
  // 🎮 Gamificación Avanzada
  advancedGamification: boolean;
  reciprocidadScoring: boolean;
  collaborativeGoals: boolean;
  elementalBadges: boolean;

  // 🏪 Marketplace
  fullMarketplace: boolean;
  sellerDashboard: boolean;
  productReviews: boolean;
  aiRecommendations: boolean;

  // 👥 Características Sociales
  socialFeatures: boolean;
  messaging: boolean;
  videoChat: boolean;
  communityGroups: boolean;

  // 📊 Analytics y BI
  advancedAnalytics: boolean;
  realTimeMetrics: boolean;
  predictiveAnalytics: boolean;
  customDashboards: boolean;

  // 🎵 Multimedia
  videoStreaming: boolean;
  audioContent: boolean;
  interactiveMedia: boolean;
  liveEvents: boolean;

  // 🔬 Características Experimentales
  aiAssistant: boolean;
  voiceInterface: boolean;
  arFeatures: boolean;
  blockchainIntegration: boolean;

  // 🌍 Localización
  multiLanguage: boolean;
  regionalContent: boolean;
  currencyLocalization: boolean;

  // 🛠️ Herramientas de Desarrollo
  debugMode: boolean;
  performanceMonitoring: boolean;
  errorBoundaries: boolean;
  mockDataGeneration: boolean;
}

// 🎯 Condiciones para activar features
export interface FeatureCondition {
  userRole?: string[];
  userLevel?: number;
  betaTester?: boolean;
  region?: string[];
  deviceType?: 'mobile' | 'tablet' | 'desktop';
  percentage?: number; // Para A/B testing
  fromDate?: string;
  toDate?: string;
  minAppVersion?: string;
}

export interface FeatureConfig {
  enabled: boolean;
  condition?: FeatureCondition;
  description: string;
  rolloutPercentage: number;
  category: 'stable' | 'beta' | 'experimental' | 'deprecated';
}

// 🚩 Configuración por defecto de todas las features
const defaultFeatureConfigs: Record<keyof FeatureFlags, FeatureConfig> = {
  // 🔐 Autenticación
  realAuth: {
    enabled: false,
    description: 'Autenticación real con Supabase',
    rolloutPercentage: 0,
    category: 'stable',
  },
  mfaEnabled: {
    enabled: false,
    description: 'Autenticación de múltiples factores',
    rolloutPercentage: 0,
    category: 'beta',
  },
  biometricAuth: {
    enabled: false,
    description: 'Autenticación biométrica',
    rolloutPercentage: 0,
    category: 'experimental',
  },

  // 💰 Pagos
  realPayments: {
    enabled: false,
    description: 'Sistema de pagos real',
    rolloutPercentage: 0,
    category: 'stable',
  },
  cryptoPayments: {
    enabled: false,
    description: 'Pagos con criptomonedas',
    rolloutPercentage: 0,
    category: 'beta',
  },
  internationalPayments: {
    enabled: false,
    description: 'Pagos internacionales',
    rolloutPercentage: 0,
    category: 'beta',
  },

  // 🎮 Gamificación
  advancedGamification: {
    enabled: true,
    description: 'Sistema de gamificación avanzado',
    rolloutPercentage: 100,
    category: 'stable',
  },
  reciprocidadScoring: {
    enabled: true,
    description: 'Sistema de puntuación Reciprocidad',
    rolloutPercentage: 100,
    category: 'stable',
  },
  collaborativeGoals: {
    enabled: false,
    description: 'Objetivos colaborativos',
    rolloutPercentage: 25,
    category: 'beta',
  },
  elementalBadges: {
    enabled: true,
    description: 'Insignias elementales (Fuego, Tierra, Agua, Aire)',
    rolloutPercentage: 100,
    category: 'stable',
  },

  // 🏪 Marketplace
  fullMarketplace: {
    enabled: false,
    description: 'Marketplace completo',
    rolloutPercentage: 10,
    category: 'beta',
  },
  sellerDashboard: {
    enabled: false,
    description: 'Dashboard para vendedores',
    rolloutPercentage: 5,
    category: 'beta',
  },
  productReviews: {
    enabled: false,
    description: 'Sistema de reseñas de productos',
    rolloutPercentage: 15,
    category: 'beta',
  },
  aiRecommendations: {
    enabled: false,
    description: 'Recomendaciones con IA',
    rolloutPercentage: 0,
    category: 'experimental',
  },

  // 👥 Social
  socialFeatures: {
    enabled: false,
    description: 'Características sociales básicas',
    rolloutPercentage: 20,
    category: 'beta',
  },
  messaging: {
    enabled: false,
    description: 'Sistema de mensajería',
    rolloutPercentage: 10,
    category: 'beta',
  },
  videoChat: {
    enabled: false,
    description: 'Video chat',
    rolloutPercentage: 0,
    category: 'experimental',
  },
  communityGroups: {
    enabled: false,
    description: 'Grupos comunitarios',
    rolloutPercentage: 15,
    category: 'beta',
  },

  // 📊 Analytics
  advancedAnalytics: {
    enabled: false,
    description: 'Analytics avanzados',
    rolloutPercentage: 0,
    category: 'beta',
  },
  realTimeMetrics: {
    enabled: false,
    description: 'Métricas en tiempo real',
    rolloutPercentage: 0,
    category: 'beta',
  },
  predictiveAnalytics: {
    enabled: false,
    description: 'Analytics predictivos',
    rolloutPercentage: 0,
    category: 'experimental',
  },
  customDashboards: {
    enabled: false,
    description: 'Dashboards personalizables',
    rolloutPercentage: 0,
    category: 'beta',
  },

  // 🎵 Multimedia
  videoStreaming: {
    enabled: false,
    description: 'Streaming de video',
    rolloutPercentage: 0,
    category: 'beta',
  },
  audioContent: {
    enabled: true,
    description: 'Contenido de audio',
    rolloutPercentage: 100,
    category: 'stable',
  },
  interactiveMedia: {
    enabled: true,
    description: 'Medios interactivos',
    rolloutPercentage: 100,
    category: 'stable',
  },
  liveEvents: {
    enabled: false,
    description: 'Eventos en vivo',
    rolloutPercentage: 0,
    category: 'experimental',
  },

  // 🔬 Experimental
  aiAssistant: {
    enabled: false,
    description: 'Asistente de IA',
    rolloutPercentage: 0,
    category: 'experimental',
  },
  voiceInterface: {
    enabled: false,
    description: 'Interfaz de voz',
    rolloutPercentage: 0,
    category: 'experimental',
  },
  arFeatures: {
    enabled: false,
    description: 'Características de Realidad Aumentada',
    rolloutPercentage: 0,
    category: 'experimental',
  },
  blockchainIntegration: {
    enabled: false,
    description: 'Integración con blockchain',
    rolloutPercentage: 0,
    category: 'experimental',
  },

  // 🌍 Localización
  multiLanguage: {
    enabled: false,
    description: 'Soporte multi-idioma',
    rolloutPercentage: 0,
    category: 'beta',
  },
  regionalContent: {
    enabled: false,
    description: 'Contenido regionalizado',
    rolloutPercentage: 0,
    category: 'beta',
  },
  currencyLocalization: {
    enabled: false,
    description: 'Localización de monedas',
    rolloutPercentage: 0,
    category: 'beta',
  },

  // 🛠️ Desarrollo
  debugMode: {
    enabled: true,
    description: 'Modo de depuración',
    rolloutPercentage: 100,
    category: 'stable',
    condition: { userRole: ['developer', 'admin'] },
  },
  performanceMonitoring: {
    enabled: true,
    description: 'Monitoreo de rendimiento',
    rolloutPercentage: 100,
    category: 'stable',
  },
  errorBoundaries: {
    enabled: true,
    description: 'Límites de error avanzados',
    rolloutPercentage: 100,
    category: 'stable',
  },
  mockDataGeneration: {
    enabled: true,
    description: 'Generación de datos mock',
    rolloutPercentage: 100,
    category: 'stable',
    condition: { userRole: ['developer', 'tester'] },
  },
};

// 🎯 Clase principal de Feature Flags
export class FeatureFlagsService {
  private userProfile?: UserProfile;
  private deviceType: 'mobile' | 'tablet' | 'desktop';
  private userSeed: number = 0;

  constructor() {
    this.deviceType = this.getDeviceType();
  }

  // 👤 Configurar usuario para evaluación de condiciones
  setUser(profile: UserProfile) {
    this.userProfile = profile;
    // Generar seed consistente basado en el usuario para A/B testing
    this.userSeed = this.generateUserSeed(profile.id);
  }

  // 🚩 Verificar si una feature está habilitada
  isEnabled(featureName: keyof FeatureFlags): boolean {
    const config = this.getFeatureConfig(featureName);
    
    if (!config.enabled) {
      return false;
    }

    // Verificar condiciones específicas
    if (config.condition && !this.evaluateCondition(config.condition)) {
      return false;
    }

    // Verificar rollout percentage (A/B testing)
    if (config.rolloutPercentage < 100) {
      const userPercentile = this.userSeed % 100;
      return userPercentile < config.rolloutPercentage;
    }

    return true;
  }

  // 📊 Obtener todas las features habilitadas
  getEnabledFeatures(): Partial<FeatureFlags> {
    const enabledFeatures: Partial<FeatureFlags> = {};
    
    Object.keys(defaultFeatureConfigs).forEach((featureName) => {
      const key = featureName as keyof FeatureFlags;
      enabledFeatures[key] = this.isEnabled(key);
    });

    return enabledFeatures;
  }

  // 🔧 Obtener configuración de una feature
  getFeatureConfig(featureName: keyof FeatureFlags): FeatureConfig {
    return defaultFeatureConfigs[featureName];
  }

  // 📈 Obtener estadísticas de features por categoría
  getFeatureStats(): {
    stable: number;
    beta: number;
    experimental: number;
    deprecated: number;
    enabled: number;
    total: number;
  } {
    const stats = {
      stable: 0,
      beta: 0,
      experimental: 0,
      deprecated: 0,
      enabled: 0,
      total: 0,
    };

    Object.values(defaultFeatureConfigs).forEach((config) => {
      stats[config.category]++;
      stats.total++;
      if (config.enabled) stats.enabled++;
    });

    return stats;
  }

  // 🎯 Evaluación de condiciones
  private evaluateCondition(condition: FeatureCondition): boolean {
    // Verificar rol de usuario
    if (condition.userRole && this.userProfile) {
      const userRole = this.userProfile.game_data?.level && this.userProfile.game_data.level > 5 
        ? 'advanced' 
        : 'basic';
      if (!condition.userRole.includes(userRole)) {
        return false;
      }
    }

    // Verificar nivel de usuario
    if (condition.userLevel && this.userProfile?.game_data) {
      if (this.userProfile.game_data.level < condition.userLevel) {
        return false;
      }
    }

    // Verificar tipo de dispositivo
    if (condition.deviceType && condition.deviceType !== this.deviceType) {
      return false;
    }

    // Verificar fechas
    if (condition.fromDate && new Date() < new Date(condition.fromDate)) {
      return false;
    }

    if (condition.toDate && new Date() > new Date(condition.toDate)) {
      return false;
    }

    return true;
  }

  // 🔧 Utilities
  private getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
    const width = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  }

  private generateUserSeed(userId: string): number {
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
      const char = userId.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  // 🔄 Recargar configuración (para testing)
  async reloadConfig(): Promise<void> {
    // En producción, esto cargaría desde una API externa
    console.log('🔄 Feature flags configuration reloaded');
  }

  // 📊 Logging para analytics
  logFeatureUsage(featureName: keyof FeatureFlags, action: 'viewed' | 'used' | 'error') {
    if (import.meta.env.VITE_APP_ENV === 'development') {
      console.log(`🚩 Feature ${featureName} ${action} by user ${this.userProfile?.id || 'anonymous'}`);
    }

    // En producción enviaríamos esto a analytics
    // analytics.trackEvent({
    //   event_name: 'feature_flag_usage',
    //   module: 'core',
    //   action,
    //   custom_parameters: {
    //     feature_name: featureName,
    //     user_id: this.userProfile?.id,
    //   },
    // });
  }
}

// 🚀 Instancia singleton
export const featureFlags = new FeatureFlagsService();

// 🎯 Hook para React
export function useFeatureFlags() {
  return {
    isEnabled: (featureName: keyof FeatureFlags) => featureFlags.isEnabled(featureName),
    getEnabledFeatures: () => featureFlags.getEnabledFeatures(),
    getFeatureConfig: (featureName: keyof FeatureFlags) => featureFlags.getFeatureConfig(featureName),
    getStats: () => featureFlags.getFeatureStats(),
    logUsage: (featureName: keyof FeatureFlags, action: 'viewed' | 'used' | 'error') =>
      featureFlags.logFeatureUsage(featureName, action),
  };
}

// 🎯 Componente HOC para condicional rendering
export function withFeatureFlag<T extends object>(
  featureName: keyof FeatureFlags,
  Component: React.ComponentType<T>,
  FallbackComponent?: React.ComponentType<T>
) {
  return function FeatureFlagWrapper(props: T) {
    const { isEnabled } = useFeatureFlags();
    
    if (isEnabled(featureName)) {
      return <Component {...props} />;
    }

    if (FallbackComponent) {
      return <FallbackComponent {...props} />;
    }

    return null;
  };
} 