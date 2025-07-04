/**
 * 🌌 COOMUNITY DESIGN SYSTEM - TYPES
 * =================================
 *
 * Tipos centralizados para el Sistema de Diseño revolucionario
 * Extraídos del análisis del Dashboard HOME
 *
 * Fase 2, Semana 1 - Plan Maestro Material UI
 */

// 🔥 TIPOS ELEMENTALES EXTRAÍDOS DEL HOME
export type ElementType = 'fuego' | 'agua' | 'tierra' | 'aire' | 'espiritu';

// 🎨 VARIANTES DE COMPONENTES REVOLUCIONARIOS
export type ComponentVariant = 'primary' | 'secondary' | 'accent' | 'elevated' | 'minimal' | 'cosmic';

// ⚡ INTENSIDAD CÓSMICA
export type CosmicIntensity = 'subtle' | 'medium' | 'intense';

// 🌊 MODOS DE INTERACCIÓN
export type InteractionMode = 'hover' | 'click' | 'auto';

// 📱 BREAKPOINTS RESPONSIVOS
export type BreakpointKey = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

// 🔢 MÉTRICAS FIBONACCI
export interface FibonacciMetrics {
  distributionQuality: number;
  visualHarmony: number;
  animationSmoothness: number;
  overallScore: number;
}

// 🌌 POSICIÓN ORBITAL
export interface OrbitalPosition {
  x: number;
  y: number;
  radius: number;
  angle: number;
  speed: number;
  element?: ElementType;
}

// 🎯 CONFIGURACIÓN ELEMENTAL
export interface ElementalConfiguration {
  gradient: string;
  bgGradient: string;
  particleColor: string;
  glowColor: string;
  border: string;
  shadow: string;
  value?: number;
  icon?: React.ReactNode;
  baseAngle?: number;
}

// 🎨 PATRÓN REVOLUCIONARIO BASE
export interface RevolutionaryPatternConfig {
  background: string;
  backdropFilter: string;
  WebkitBackdropFilter: string;
  border: string;
  borderRadius: string;
  boxShadow: string;
  transform: string;
  transformStyle: 'preserve-3d';
  perspective: string;
  overflow: 'visible';
  transition: string;
}

// 📐 PATRONES RESPONSIVOS
export interface ResponsivePatternConfig {
  padding: Record<BreakpointKey, string>;
  borderRadius: Record<BreakpointKey, string>;
  spacing: Record<BreakpointKey, number>;
  fontSize: Record<BreakpointKey, string>;
}

// ⚡ CONFIGURACIÓN DE ANIMACIONES
export interface AnimationConfig {
  duration: number;
  easing: string;
  delay?: number;
  iterations?: number | 'infinite';
  direction?: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse';
}

// 🌟 CONFIGURACIÓN DE PARTÍCULAS
export interface ParticleConfig {
  count: number;
  size: number;
  color: string;
  speed: number;
  opacity: number;
  blur: boolean;
}

// 🔮 EFECTOS CÓSMICOS
export interface CosmicEffectsConfig {
  enableGlow: boolean;
  enableParticles: boolean;
  enableOrbitalEffects: boolean;
  enableAnimations: boolean;
  glowIntensity: number;
  particleConfig: ParticleConfig;
  orbitalRadius: number;
  orbitalSpeed: number;
}

// 🎭 ESTADOS DE COMPONENTE
export type ComponentState = 'idle' | 'hover' | 'active' | 'focus' | 'disabled';

// 📊 MÉTRICAS DE PERFORMANCE 3D
export interface Performance3DMetrics {
  fps: number;
  renderTime: number;
  gpuUsage: number;
  memoryUsage: number;
  smoothness: number;
}

// 🧪 CONFIGURACIÓN DE TESTING 3D
export interface Testing3DConfig {
  enablePerformanceMonitoring: boolean;
  fpsTarget: number;
  maxRenderTime: number;
  memoryThreshold: number;
  testDuration: number;
}

// 🌈 GRADIENTES DINÁMICOS
export interface DynamicGradientConfig {
  colors: string[];
  direction: number; // en grados
  type: 'linear' | 'radial' | 'conic';
  animationSpeed?: number;
  stops?: number[];
}

// 🔧 UTILIDADES CÓSMICAS
export interface CosmicUtilsConfig {
  elementalIntensity: number;
  glassmorphismOpacity: number;
  glassmorphismBlur: number;
  shadowIntensity: number;
  orbitalRadius: number;
  orbitalSpeed: number;
}

// 📋 TEMPLATE PROPS REVOLUCIONARIOS
export interface RevolutionaryTemplateProps {
  variant?: ComponentVariant;
  element?: ElementType;
  cosmicIntensity?: CosmicIntensity;
  interactionMode?: InteractionMode;
  cosmicEffects?: Partial<CosmicEffectsConfig>;
  responsiveConfig?: Partial<ResponsivePatternConfig>;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

// 🌟 WIDGET REVOLUCIONARIO BASE
export interface RevolutionaryWidgetProps extends RevolutionaryTemplateProps {
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  isLoading?: boolean;
  isConnected?: boolean;
  onRefresh?: () => void;
  onExpand?: () => void;
  onMinimize?: () => void;
}

// 📈 MÉTRICAS DE RECIPROCIDAD
export interface ReciprocidadMetrics {
  ondas: number;
  meritos: number;
  nivel: string;
  siguienteNivel: string;
  progreso: number;
  contribucionesBienComun: number;
  balance: number;
}

// 🌟 ESTADÍSTICAS ELEMENTALES
export interface ElementStats {
  fuego: number;
  agua: number;
  tierra: number;
  aire: number;
  espiritu?: number;
}

// 🎯 CONFIGURACIÓN DE MÓDULOS
export interface ModuleConfig {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  element: ElementType;
  isActive: boolean;
  isNew: boolean;
  progress?: number;
  description?: string;
}

// 📱 CONFIGURACIÓN RESPONSIVE AVANZADA
export interface AdvancedResponsiveConfig {
  breakpoints: Record<BreakpointKey, number>;
  containers: Record<BreakpointKey, string>;
  typography: Record<BreakpointKey, {
    fontSize: string;
    lineHeight: string;
    letterSpacing: string;
  }>;
  spacing: Record<BreakpointKey, {
    padding: string;
    margin: string;
    gap: string;
  }>;
}

// 🌊 FLUJO DE DATOS CÓSMICOS
export interface CosmicDataFlow {
  source: string;
  target: string;
  intensity: number;
  element: ElementType;
  direction: 'in' | 'out' | 'bidirectional';
  isActive: boolean;
}

// 🔮 PRESET CÓSMICO
export interface CosmicPreset {
  name: string;
  description: string;
  elementalBalance: ElementStats;
  visualEffects: CosmicEffectsConfig;
  animationConfig: AnimationConfig;
  responsiveConfig: ResponsivePatternConfig;
}

// 🎨 THEME REVOLUCIONARIO
export interface RevolutionaryTheme {
  palette: {
    elemental: Record<ElementType, ElementalConfiguration>;
    cosmic: {
      primary: string;
      secondary: string;
      accent: string;
      background: string;
      surface: string;
    };
    revolutionary: {
      glassmorphism: string;
      border: string;
      shadow: string;
      glow: string;
    };
  };
  patterns: {
    revolutionary: RevolutionaryPatternConfig;
    responsive: ResponsivePatternConfig;
    animations: Record<string, AnimationConfig>;
  };
  effects: {
    default: CosmicEffectsConfig;
    presets: Record<string, CosmicPreset>;
  };
}
