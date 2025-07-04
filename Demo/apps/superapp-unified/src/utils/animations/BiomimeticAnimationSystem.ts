/**
 * 🌿 BIOMIMETIC ANIMATION SYSTEM
 * ==============================
 *
 * Sistema de animaciones inspirado en patrones naturales
 * Crea movimientos orgánicos y fluidos basados en comportamientos de la naturaleza
 * Parte de la Fase 6: Innovación Avanzada - Q4 2025
 */

import { Variants, Transition, TargetAndTransition } from 'framer-motion';

interface NaturalPattern {
  name: string;
  description: string;
  basePattern: 'wave' | 'spiral' | 'growth' | 'flow' | 'decay' | 'oscillation';
  parameters: {
    frequency: number;
    amplitude: number;
    damping: number;
    phase: number;
    asymptote?: number;
  };
  easing: string;
  duration: number;
  elements: string[]; // Tierra, Agua, Fuego, Aire
}

interface BiomimeticConfig {
  pattern: NaturalPattern;
  intensity: 'gentle' | 'moderate' | 'dynamic' | 'intense';
  element: 'tierra' | 'agua' | 'fuego' | 'aire';
  context: 'enter' | 'exit' | 'hover' | 'focus' | 'loading' | 'transition';
  performance: 'high' | 'balanced' | 'quality';
}

interface AnimationMetrics {
  fps: number;
  frameDrops: number;
  duration: number;
  complexity: number;
  memoryUsage: number;
  energyEfficiency: number;
}

export class BiomimeticAnimationSystem {
  private static instance: BiomimeticAnimationSystem;
  private naturalPatterns: Map<string, NaturalPattern> = new Map();
  private performanceMetrics: AnimationMetrics = {
    fps: 60,
    frameDrops: 0,
    duration: 0,
    complexity: 0,
    memoryUsage: 0,
    energyEfficiency: 1
  };
  private isPerformanceMonitoringEnabled: boolean = true;

  private constructor() {
    this.initializeNaturalPatterns();
    this.setupPerformanceMonitoring();
  }

  static getInstance(): BiomimeticAnimationSystem {
    if (!BiomimeticAnimationSystem.instance) {
      BiomimeticAnimationSystem.instance = new BiomimeticAnimationSystem();
    }
    return BiomimeticAnimationSystem.instance;
  }

  /**
   * Inicializar patrones naturales base
   */
  private initializeNaturalPatterns(): void {
    // Patrón de crecimiento orgánico (plantas, cristales)
    this.naturalPatterns.set('organic-growth', {
      name: 'Organic Growth',
      description: 'Crecimiento natural como plantas y cristales',
      basePattern: 'growth',
      parameters: {
        frequency: 1.2,
        amplitude: 1.0,
        damping: 0.8,
        phase: 0,
        asymptote: 0.95
      },
      easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      duration: 800,
      elements: ['tierra', 'agua']
    });

    // Patrón de onda oceánica
    this.naturalPatterns.set('ocean-wave', {
      name: 'Ocean Wave',
      description: 'Movimiento fluido como olas del océano',
      basePattern: 'wave',
      parameters: {
        frequency: 0.8,
        amplitude: 1.2,
        damping: 0.6,
        phase: Math.PI / 4
      },
      easing: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
      duration: 1200,
      elements: ['agua', 'aire']
    });

    // Patrón de llama danzante
    this.naturalPatterns.set('flame-dance', {
      name: 'Flame Dance',
      description: 'Movimiento errático y dinámico como llamas',
      basePattern: 'oscillation',
      parameters: {
        frequency: 2.4,
        amplitude: 0.8,
        damping: 0.3,
        phase: 0
      },
      easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      duration: 600,
      elements: ['fuego']
    });

    // Patrón de brisa suave
    this.naturalPatterns.set('gentle-breeze', {
      name: 'Gentle Breeze',
      description: 'Movimiento sutil como una brisa suave',
      basePattern: 'flow',
      parameters: {
        frequency: 0.5,
        amplitude: 0.6,
        damping: 0.9,
        phase: 0
      },
      easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      duration: 1500,
      elements: ['aire']
    });

    // Patrón espiral de Fibonacci
    this.naturalPatterns.set('fibonacci-spiral', {
      name: 'Fibonacci Spiral',
      description: 'Espiral áurea encontrada en la naturaleza',
      basePattern: 'spiral',
      parameters: {
        frequency: 1.618, // Golden ratio
        amplitude: 1.0,
        damping: 0.7,
        phase: 0
      },
      easing: 'cubic-bezier(0.23, 1, 0.32, 1)',
      duration: 1000,
      elements: ['tierra', 'aire']
    });

    // Patrón de caída de hoja
    this.naturalPatterns.set('falling-leaf', {
      name: 'Falling Leaf',
      description: 'Movimiento zigzagueante como hoja cayendo',
      basePattern: 'decay',
      parameters: {
        frequency: 1.8,
        amplitude: 1.4,
        damping: 0.4,
        phase: Math.PI / 6
      },
      easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      duration: 2000,
      elements: ['aire', 'tierra']
    });

    console.log(`🌿 Initialized ${this.naturalPatterns.size} natural patterns`);
  }

  /**
   * Configurar monitoreo de performance
   */
  private setupPerformanceMonitoring(): void {
    if (this.isPerformanceMonitoringEnabled) {
      // Monitorear FPS usando requestAnimationFrame
      let frameCount = 0;
      let lastTime = performance.now();

      const measureFPS = () => {
        frameCount++;
        const currentTime = performance.now();

        if (currentTime - lastTime >= 1000) {
          this.performanceMetrics.fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
          frameCount = 0;
          lastTime = currentTime;
        }

        requestAnimationFrame(measureFPS);
      };

      measureFPS();
    }
  }

  /**
   * Crear animación biomimética personalizada
   */
  createBiomimeticAnimation(config: BiomimeticConfig): Variants {
    const pattern = this.naturalPatterns.get(this.selectPatternForContext(config));

    if (!pattern) {
      console.warn('Pattern not found, using default');
      return this.createDefaultAnimation(config);
    }

    const adaptedPattern = this.adaptPatternToConfig(pattern, config);
    return this.generateFramerMotionVariants(adaptedPattern, config);
  }

  /**
   * Seleccionar patrón según contexto y elemento
   */
  private selectPatternForContext(config: BiomimeticConfig): string {
    const { element, context, intensity } = config;

    // Mapeo inteligente de contexto + elemento a patrón
    const patternMap: Record<string, string> = {
      // Tierra - estabilidad, crecimiento
      'tierra-enter': 'organic-growth',
      'tierra-exit': 'falling-leaf',
      'tierra-hover': 'fibonacci-spiral',
      'tierra-loading': 'organic-growth',

      // Agua - fluidez, continuidad
      'agua-enter': 'ocean-wave',
      'agua-exit': 'ocean-wave',
      'agua-hover': 'gentle-breeze',
      'agua-loading': 'ocean-wave',
      'agua-transition': 'ocean-wave',

      // Fuego - energía, dinamismo
      'fuego-enter': 'flame-dance',
      'fuego-exit': 'flame-dance',
      'fuego-hover': 'flame-dance',
      'fuego-loading': 'flame-dance',

      // Aire - ligereza, libertad
      'aire-enter': 'gentle-breeze',
      'aire-exit': 'falling-leaf',
      'aire-hover': 'gentle-breeze',
      'aire-loading': 'gentle-breeze',
      'aire-transition': 'falling-leaf'
    };

    const key = `${element}-${context}`;
    return patternMap[key] || 'organic-growth';
  }

  /**
   * Adaptar patrón a configuración específica
   */
  private adaptPatternToConfig(pattern: NaturalPattern, config: BiomimeticConfig): NaturalPattern {
    const adapted = { ...pattern };

    // Ajustar según intensidad
    const intensityMultipliers = {
      gentle: { amplitude: 0.6, frequency: 0.8, duration: 1.3 },
      moderate: { amplitude: 1.0, frequency: 1.0, duration: 1.0 },
      dynamic: { amplitude: 1.4, frequency: 1.2, duration: 0.8 },
      intense: { amplitude: 1.8, frequency: 1.5, duration: 0.6 }
    };

    const multiplier = intensityMultipliers[config.intensity];

    adapted.parameters.amplitude *= multiplier.amplitude;
    adapted.parameters.frequency *= multiplier.frequency;
    adapted.duration *= multiplier.duration;

    // Ajustar según performance
    if (config.performance === 'high') {
      adapted.duration *= 0.7; // Animaciones más rápidas
      adapted.parameters.damping *= 1.2; // Menos rebotes
    } else if (config.performance === 'quality') {
      adapted.duration *= 1.3; // Animaciones más lentas y suaves
      adapted.parameters.damping *= 0.8; // Más rebotes
    }

    return adapted;
  }

  /**
   * Generar variants de Framer Motion
   */
  private generateFramerMotionVariants(pattern: NaturalPattern, config: BiomimeticConfig): Variants {
    const { basePattern, parameters, easing, duration } = pattern;

    const variants: Variants = {
      initial: this.generateInitialState(basePattern, config),
      animate: this.generateAnimateState(basePattern, parameters, config),
      exit: this.generateExitState(basePattern, config)
    };

    // Agregar transición personalizada
    const transition: Transition = {
      duration: duration / 1000,
      ease: this.convertEasingToCubicBezier(easing),
      ...this.generatePatternSpecificTransition(basePattern, parameters)
    };

    // Aplicar transición a todos los states
    Object.keys(variants).forEach(key => {
      if (typeof variants[key] === 'object' && variants[key] !== null) {
        (variants[key] as any).transition = transition;
      }
    });

    return variants;
  }

  /**
   * Generar estado inicial según patrón
   */
  private generateInitialState(basePattern: string, config: BiomimeticConfig): TargetAndTransition {
    const commonInitial = {
      opacity: 0,
      scale: 0.8
    };

    switch (basePattern) {
      case 'growth':
        return {
          ...commonInitial,
          scale: 0.3,
          transformOrigin: 'bottom center'
        };

      case 'wave':
        return {
          ...commonInitial,
          x: -50,
          rotateY: -15
        };

      case 'spiral':
        return {
          ...commonInitial,
          rotate: -180,
          scale: 0.1
        };

      case 'flow':
        return {
          ...commonInitial,
          x: -30,
          y: -10
        };

      case 'oscillation':
        return {
          ...commonInitial,
          scale: 0.6,
          rotate: -10
        };

      case 'decay':
        return {
          opacity: 1,
          scale: 1,
          y: -100,
          rotate: 0
        };

      default:
        return commonInitial;
    }
  }

  /**
   * Generar estado animado según patrón
   */
  private generateAnimateState(
    basePattern: string,
    parameters: NaturalPattern['parameters'],
    config: BiomimeticConfig
  ): TargetAndTransition {
    const commonAnimate = {
      opacity: 1,
      scale: 1
    };

    switch (basePattern) {
      case 'growth':
        return {
          ...commonAnimate,
          scale: [0.3, 1.1, 0.95, 1],
          transformOrigin: 'bottom center'
        };

      case 'wave':
        return {
          ...commonAnimate,
          x: [
            -50,
            parameters.amplitude * 20,
            -parameters.amplitude * 10,
            parameters.amplitude * 5,
            0
          ],
          rotateY: [-15, 5, -2, 0]
        };

      case 'spiral':
        return {
          ...commonAnimate,
          rotate: [-180, 0],
          scale: [0.1, 1.2, 1]
        };

      case 'flow':
        return {
          ...commonAnimate,
          x: [
            -30,
            parameters.amplitude * 15,
            -parameters.amplitude * 8,
            0
          ],
          y: [
            -10,
            parameters.amplitude * 8,
            -parameters.amplitude * 4,
            0
          ]
        };

      case 'oscillation':
        return {
          ...commonAnimate,
          scale: [0.6, 1.3, 0.9, 1.1, 1],
          rotate: [
            -10,
            parameters.amplitude * 8,
            -parameters.amplitude * 4,
            parameters.amplitude * 2,
            0
          ]
        };

      case 'decay':
        return {
          opacity: [1, 0.8, 0.3, 0],
          scale: [1, 0.8, 0.6, 0.4],
          y: [
            -100,
            parameters.amplitude * 50,
            parameters.amplitude * 100,
            parameters.amplitude * 150
          ],
          rotate: [
            0,
            parameters.amplitude * 15,
            -parameters.amplitude * 20,
            parameters.amplitude * 25
          ]
        };

      default:
        return commonAnimate;
    }
  }

  /**
   * Generar estado de salida según patrón
   */
  private generateExitState(basePattern: string, config: BiomimeticConfig): TargetAndTransition {
    switch (basePattern) {
      case 'growth':
        return {
          opacity: 0,
          scale: 0.3,
          transformOrigin: 'top center'
        };

      case 'wave':
        return {
          opacity: 0,
          x: 50,
          rotateY: 15
        };

      case 'spiral':
        return {
          opacity: 0,
          rotate: 180,
          scale: 0.1
        };

      case 'flow':
        return {
          opacity: 0,
          x: 30,
          y: 10
        };

      case 'oscillation':
        return {
          opacity: 0,
          scale: 0.6,
          rotate: 10
        };

      case 'decay':
        return {
          opacity: 0,
          scale: 0.2,
          y: 200,
          rotate: 45
        };

      default:
        return {
          opacity: 0,
          scale: 0.8
        };
    }
  }

  /**
   * Generar transición específica del patrón
   */
  private generatePatternSpecificTransition(
    basePattern: string,
    parameters: NaturalPattern['parameters']
  ): Partial<Transition> {
    switch (basePattern) {
      case 'growth':
        return {
          type: 'spring',
          stiffness: 100 * parameters.frequency,
          damping: 20 * parameters.damping,
          mass: 1
        };

      case 'wave':
        return {
          type: 'spring',
          stiffness: 80 * parameters.frequency,
          damping: 15 * parameters.damping,
          restDelta: 0.01
        };

      case 'spiral':
        return {
          type: 'tween',
          ease: [0.25, 0.46, 0.45, 0.94]
        };

      case 'flow':
        return {
          type: 'spring',
          stiffness: 60 * parameters.frequency,
          damping: 25 * parameters.damping
        };

      case 'oscillation':
        return {
          type: 'spring',
          stiffness: 150 * parameters.frequency,
          damping: 10 * parameters.damping,
          restSpeed: 0.1
        };

      case 'decay':
        return {
          type: 'tween',
          ease: 'easeOut'
        };

      default:
        return {
          type: 'spring',
          stiffness: 100,
          damping: 20
        };
    }
  }

  /**
   * Convertir easing CSS a cubic-bezier
   */
  private convertEasingToCubicBezier(easing: string): number[] {
    const easingMap: Record<string, number[]> = {
      'cubic-bezier(0.25, 0.46, 0.45, 0.94)': [0.25, 0.46, 0.45, 0.94],
      'cubic-bezier(0.4, 0.0, 0.2, 1)': [0.4, 0.0, 0.2, 1],
      'cubic-bezier(0.68, -0.55, 0.265, 1.55)': [0.68, -0.55, 0.265, 1.55],
      'cubic-bezier(0.23, 1, 0.32, 1)': [0.23, 1, 0.32, 1]
    };

    return easingMap[easing] || [0.25, 0.46, 0.45, 0.94];
  }

  /**
   * Crear animación por defecto
   */
  private createDefaultAnimation(config: BiomimeticConfig): Variants {
    return {
      initial: { opacity: 0, scale: 0.8 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.8 }
    };
  }

  /**
   * Crear animación de carga biomimética
   */
  createLoadingAnimation(element: BiomimeticConfig['element']): Variants {
    const config: BiomimeticConfig = {
      pattern: this.naturalPatterns.get('organic-growth')!,
      intensity: 'moderate',
      element,
      context: 'loading',
      performance: 'balanced'
    };

    return this.createBiomimeticAnimation(config);
  }

  /**
   * Crear transición de página biomimética
   */
  createPageTransition(
    element: BiomimeticConfig['element'],
    direction: 'enter' | 'exit'
  ): Variants {
    const config: BiomimeticConfig = {
      pattern: this.naturalPatterns.get(direction === 'enter' ? 'ocean-wave' : 'falling-leaf')!,
      intensity: 'dynamic',
      element,
      context: direction,
      performance: 'balanced'
    };

    return this.createBiomimeticAnimation(config);
  }

  /**
   * Crear animación de hover biomimética
   */
  createHoverAnimation(element: BiomimeticConfig['element']): Variants {
    const config: BiomimeticConfig = {
      pattern: this.naturalPatterns.get('gentle-breeze')!,
      intensity: 'gentle',
      element,
      context: 'hover',
      performance: 'high'
    };

    return this.createBiomimeticAnimation(config);
  }

  /**
   * Optimizar animaciones según performance del dispositivo
   */
  optimizeForDevice(): void {
    const deviceMemory = (navigator as any).deviceMemory || 4;
    const connection = (navigator as any).connection;

    let performanceLevel: BiomimeticConfig['performance'] = 'balanced';

    if (deviceMemory <= 2 || (connection && connection.effectiveType === 'slow-2g')) {
      performanceLevel = 'high'; // Priorizar performance
    } else if (deviceMemory >= 8 && (!connection || connection.effectiveType === '4g')) {
      performanceLevel = 'quality'; // Priorizar calidad
    }

    console.log(`🌿 Animation performance optimized for: ${performanceLevel}`);

    // Ajustar patrones globalmente
    this.naturalPatterns.forEach((pattern, key) => {
      if (performanceLevel === 'high') {
        pattern.duration *= 0.7;
        pattern.parameters.damping *= 1.3;
      } else if (performanceLevel === 'quality') {
        pattern.duration *= 1.2;
        pattern.parameters.damping *= 0.8;
      }
    });
  }

  /**
   * Crear secuencia de animaciones coordinadas
   */
  createCoordinatedSequence(
    elements: Array<{
      id: string;
      element: BiomimeticConfig['element'];
      delay: number;
    }>
  ): Record<string, Variants> {
    const sequence: Record<string, Variants> = {};

    elements.forEach(({ id, element, delay }) => {
      const config: BiomimeticConfig = {
        pattern: this.naturalPatterns.get('organic-growth')!,
        intensity: 'moderate',
        element,
        context: 'enter',
        performance: 'balanced'
      };

      const animation = this.createBiomimeticAnimation(config);

      // Agregar delay a la animación
      if (animation.animate && typeof animation.animate === 'object') {
        (animation.animate as any).transition = {
          ...(animation.animate as any).transition,
          delay: delay / 1000
        };
      }

      sequence[id] = animation;
    });

    return sequence;
  }

  /**
   * Obtener métricas de performance
   */
  getPerformanceMetrics(): AnimationMetrics {
    return { ...this.performanceMetrics };
  }

  /**
   * Obtener estadísticas del sistema
   */
  getSystemStats(): {
    patternsLoaded: number;
    averageFPS: number;
    memoryUsage: number;
    recommendedSettings: string;
  } {
    const deviceMemory = (navigator as any).deviceMemory || 4;
    let recommendedSettings = 'balanced';

    if (deviceMemory <= 2 || this.performanceMetrics.fps < 30) {
      recommendedSettings = 'high-performance';
    } else if (deviceMemory >= 8 && this.performanceMetrics.fps >= 55) {
      recommendedSettings = 'high-quality';
    }

    return {
      patternsLoaded: this.naturalPatterns.size,
      averageFPS: this.performanceMetrics.fps,
      memoryUsage: this.performanceMetrics.memoryUsage,
      recommendedSettings
    };
  }
}

/**
 * Instancia singleton exportada
 */
export const biomimeticAnimations = BiomimeticAnimationSystem.getInstance();

/**
 * Hook React para usar animaciones biomiméticas
 */
export const useBiomimeticAnimation = (
  element: BiomimeticConfig['element'],
  context: BiomimeticConfig['context'] = 'enter',
  intensity: BiomimeticConfig['intensity'] = 'moderate'
) => {
  const config: BiomimeticConfig = {
    pattern: biomimeticAnimations['naturalPatterns'].get('organic-growth')!,
    intensity,
    element,
    context,
    performance: 'balanced'
  };

  return biomimeticAnimations.createBiomimeticAnimation(config);
};

/**
 * Presets comunes de animaciones biomiméticas
 */
export const BiomimeticPresets = {
  // Elementos CoomÜnity
  tierra: {
    enter: () => biomimeticAnimations.createBiomimeticAnimation({
      pattern: biomimeticAnimations['naturalPatterns'].get('organic-growth')!,
      intensity: 'moderate',
      element: 'tierra',
      context: 'enter',
      performance: 'balanced'
    }),
    hover: () => biomimeticAnimations.createHoverAnimation('tierra')
  },

  agua: {
    enter: () => biomimeticAnimations.createBiomimeticAnimation({
      pattern: biomimeticAnimations['naturalPatterns'].get('ocean-wave')!,
      intensity: 'moderate',
      element: 'agua',
      context: 'enter',
      performance: 'balanced'
    }),
    flow: () => biomimeticAnimations.createPageTransition('agua', 'enter')
  },

  fuego: {
    enter: () => biomimeticAnimations.createBiomimeticAnimation({
      pattern: biomimeticAnimations['naturalPatterns'].get('flame-dance')!,
      intensity: 'dynamic',
      element: 'fuego',
      context: 'enter',
      performance: 'balanced'
    }),
    pulse: () => biomimeticAnimations.createLoadingAnimation('fuego')
  },

  aire: {
    enter: () => biomimeticAnimations.createBiomimeticAnimation({
      pattern: biomimeticAnimations['naturalPatterns'].get('gentle-breeze')!,
      intensity: 'gentle',
      element: 'aire',
      context: 'enter',
      performance: 'balanced'
    }),
    float: () => biomimeticAnimations.createHoverAnimation('aire')
  }
};
