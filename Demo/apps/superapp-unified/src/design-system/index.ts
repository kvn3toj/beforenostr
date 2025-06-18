/**
 * 🌌 COOMUNITY DESIGN SYSTEM - MAIN INDEX
 * =====================================
 * 
 * Sistema de Diseño revolucionario para CoomÜnity SuperApp
 * Extracción de patrones cósmicos del Dashboard HOME
 * 
 * Fase 2, Semana 1 - Plan Maestro Material UI
 * ✅ OBJETIVOS COMPLETADOS:
 * - Extraer patrones HOME a design system centralizado
 * - Crear templates cósmicos reutilizables  
 * - Setup testing framework para efectos 3D
 * - Documentar revolutionary patterns
 */

// Import defaults first
import patterns from './patterns';
import cosmicHomeGradients from './styles/gradients/cosmic-home';
import CosmicCard from './components/cosmic/CosmicCard';
import RevolutionaryWidget from './templates/RevolutionaryWidget';

// 🎨 PATRONES BASE REVOLUCIONARIOS
export * from './patterns';
export { patterns };

// 🌈 GRADIENTES Y ESTILOS CÓSMICOS
export * from './styles/gradients/cosmic-home';
export { cosmicHomeGradients };

// 🎴 COMPONENTES CÓSMICOS
export { CosmicCard };
export * from './components/cosmic/CosmicCard';

// 🌟 TEMPLATES REVOLUCIONARIOS
export * from './templates';
export { RevolutionaryWidget };

// 📐 TIPOS DEL SISTEMA
export * from './types';

// 🧪 TESTING 3D Y PERFORMANCE FRAMEWORK
export type {
  Performance3DMetrics,
  Testing3DConfig,
  FibonacciMetrics,
  OrbitalPosition
} from './types';

// 🔧 UTILIDADES DEL DESIGN SYSTEM
export {
  cosmicUtils,
  componentVariants,
  revolutionaryPattern,
  cosmicCardPattern,
  elementalPatterns,
  animationPatterns,
  responsivePattern
} from './patterns';

// Note: Default imports moved to top of file to avoid binding conflicts
import {
  cosmicUtils as cosmicUtilsImport,
  componentVariants as componentVariantsImport,
} from './patterns';

// 🎯 VARIANTES PRE-CONFIGURADAS PARA FÁCIL USO

// Widgets revolucionarios
export {
  RevolutionaryWidgetPrimary,
  RevolutionaryWidgetSecondary,
  RevolutionaryWidgetAccent,
  RevolutionaryWidgetElevated,
  RevolutionaryWidgetFuego,
  RevolutionaryWidgetAgua,
  RevolutionaryWidgetTierra,
  RevolutionaryWidgetAire,
  RevolutionaryWidgetEspiritu
} from './templates';

// Cards cósmicos
export {
  CosmicCardPrimary,
  CosmicCardSecondary,
  CosmicCardAccent,
  CosmicCardElevated,
  CosmicCardFuego,
  CosmicCardAgua,
  CosmicCardTierra,
  CosmicCardAire,
  CosmicCardEspiritu
} from './components/cosmic/CosmicCard';

// 🚀 CONFIGURACIÓN DE PRESETS REVOLUCIONARIOS
export const REVOLUTIONARY_PRESETS = {
  // Preset por defecto para widgets HOME
  homeWidget: {
    variant: 'primary' as const,
    cosmicIntensity: 'medium' as const,
    cosmicEffects: {
      enableGlow: true,
      enableAnimations: true,
      enableParticles: false,
      enableOrbitalEffects: false,
      glowIntensity: 1,
      orbitalRadius: 100,
      orbitalSpeed: 1
    }
  },
  
  // Preset para elementos destacados
  heroWidget: {
    variant: 'elevated' as const,
    cosmicIntensity: 'intense' as const,
    cosmicEffects: {
      enableGlow: true,
      enableAnimations: true,
      enableParticles: true,
      enableOrbitalEffects: true,
      glowIntensity: 1.5,
      orbitalRadius: 120,
      orbitalSpeed: 0.8
    }
  },
  
  // Preset minimalista para elementos secundarios
  subtleWidget: {
    variant: 'minimal' as const,
    cosmicIntensity: 'subtle' as const,
    cosmicEffects: {
      enableGlow: false,
      enableAnimations: false,
      enableParticles: false,
      enableOrbitalEffects: false,
      glowIntensity: 0.5,
      orbitalRadius: 80,
      orbitalSpeed: 1.2
    }
  },
  
  // Preset para widgets de performance crítica
  performanceWidget: {
    variant: 'secondary' as const,
    cosmicIntensity: 'subtle' as const,
    cosmicEffects: {
      enableGlow: true,
      enableAnimations: false, // Deshabilitado para performance
      enableParticles: false,
      enableOrbitalEffects: false,
      glowIntensity: 0.8,
      orbitalRadius: 90,
      orbitalSpeed: 1
    }
  }
} as const;

// 🎨 CONFIGURACIÓN DE ELEMENTOS
export const ELEMENTAL_CONFIGS = {
  fuego: {
    element: 'fuego' as const,
    defaultIntensity: 'intense' as const,
    preferredVariant: 'accent' as const
  },
  agua: {
    element: 'agua' as const,
    defaultIntensity: 'medium' as const,
    preferredVariant: 'primary' as const
  },
  tierra: {
    element: 'tierra' as const,
    defaultIntensity: 'subtle' as const,
    preferredVariant: 'secondary' as const
  },
  aire: {
    element: 'aire' as const,
    defaultIntensity: 'medium' as const,
    preferredVariant: 'elevated' as const
  },
  espiritu: {
    element: 'espiritu' as const,
    defaultIntensity: 'intense' as const,
    preferredVariant: 'elevated' as const
  }
} as const;

// 🧪 CONFIGURACIÓN DE TESTING 3D
export const TESTING_3D_CONFIG: Testing3DConfig = {
  enablePerformanceMonitoring: true,
  fpsTarget: 60,
  maxRenderTime: 16.67, // ~60fps
  memoryThreshold: 100, // MB
  testDuration: 5000, // 5 segundos
};

// 🌟 HELPER FUNCTIONS PARA FÁCIL IMPLEMENTACIÓN

/**
 * 🎯 Crear widget revolucionario con preset
 */
export const createRevolutionaryWidget = (
  preset: keyof typeof REVOLUTIONARY_PRESETS,
  overrides?: Partial<any>
) => ({
  ...REVOLUTIONARY_PRESETS[preset],
  ...overrides
});

/**
 * 🔥 Crear widget elemental con configuración automática
 */
export const createElementalWidget = (
  element: keyof typeof ELEMENTAL_CONFIGS,
  overrides?: Partial<any>
) => ({
  ...ELEMENTAL_CONFIGS[element],
  ...overrides
});

/**
 * 🌌 Aplicar efectos cósmicos según performance del dispositivo
 */
export const applyPerformanceBasedEffects = (baseEffects: any) => {
  // Detectar capacidades del dispositivo
  const isLowEnd = navigator.hardwareConcurrency <= 2;
  const isOnBattery = (navigator as any).getBattery?.()?.charging === false;
  
  if (isLowEnd || isOnBattery) {
    return {
      ...baseEffects,
      enableAnimations: false,
      enableParticles: false,
      enableOrbitalEffects: false,
      glowIntensity: 0.5
    };
  }
  
  return baseEffects;
};

// 📊 MÉTRICAS Y MONITOREO
export const DESIGN_SYSTEM_VERSION = '2.1.0';
export const EXTRACTION_DATE = '2024-01-20';
export const SOURCE_COMPONENTS = [
  'AyniMetricsCardRevolutionary.tsx (920 líneas)',
  'ModuleCardsRevolutionary.tsx (663 líneas)',
  'NotificationCenterRevolutionary.tsx (747 líneas)', 
  'LiveActivityFeed.tsx (737 líneas - glassmorphism)'
];

// 🏆 EXPORT POR DEFECTO CON TODA LA FUNCIONALIDAD
export default {
  // Patrones
  patterns,
  cosmicHomeGradients,
  
  // Componentes
  CosmicCard,
  RevolutionaryWidget,
  
  // Utilidades
  cosmicUtils: cosmicUtilsImport,
  componentVariants: componentVariantsImport,
  
  // Presets
  REVOLUTIONARY_PRESETS,
  ELEMENTAL_CONFIGS,
  TESTING_3D_CONFIG,
  
  // Helpers
  createRevolutionaryWidget,
  createElementalWidget,
  applyPerformanceBasedEffects,
  
  // Metadata
  version: DESIGN_SYSTEM_VERSION,
  extractionDate: EXTRACTION_DATE,
  sourceComponents: SOURCE_COMPONENTS
} as const; 