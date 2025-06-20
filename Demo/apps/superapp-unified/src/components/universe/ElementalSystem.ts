// 🌍 CoomÜnity SuperApp - Sistema Elemental Unificado
// Configuración centralizada para todas las esferas elementales

import { GOLDEN_RATIO } from '../../utils/fibonacci-distribution';

export type ElementType = 'fuego' | 'agua' | 'tierra' | 'aire';

export interface ElementPhysics {
  mass: number;
  magneticField: number;
  temperature: number;
  density: number;
  gravitationalInfluence: number;
  pulseFrequency: number;
  resonanceLevel: number;
}

export interface ElementVisuals {
  primaryColor: string;
  secondaryColor: string;
  gradient: string;
  glowColor: string;
  trailColor: string;
  particleColor: string;
  shadowColor: string;
}

export interface ElementOrbital {
  radius: number;
  radiusY: number;
  inclination: number;
  eccentricity: number;
  rotationSpeed: number;
  orbitSpeed: number;
  tiltAngle: number;
}

export interface ElementInteraction {
  affinities: ElementType[];
  conflicts: ElementType[];
  resonance: number;
  harmonicFrequency: number;
  energyExchange: number;
}

export interface ElementalConfiguration {
  name: string;
  symbol: string;
  physics: ElementPhysics;
  visuals: ElementVisuals;
  orbital: ElementOrbital;
  interaction: ElementInteraction;
}

// 🔥 Configuración Unificada de Elementos CoomÜnity
export const UNIFIED_ELEMENTAL_CONFIG: Record<ElementType, ElementalConfiguration> = {
  fuego: {
    name: 'Fuego',
    symbol: '🔥',
    physics: {
      mass: 0.8,
      magneticField: 0.6,
      temperature: 0.9,
      density: 0.7,
      gravitationalInfluence: 1.1,
      pulseFrequency: 1.5,
      resonanceLevel: 1.3,
    },
    visuals: {
      primaryColor: '#FF6B35',
      secondaryColor: '#FF8A65',
      gradient: 'linear-gradient(135deg, #FF6B35 0%, #FF8A65 50%, #FFB74D 100%)',
      glowColor: 'rgba(255, 107, 53, 0.4)',
      trailColor: 'rgba(255, 107, 53, 0.3)',
      particleColor: '#FF7043',
      shadowColor: 'rgba(255, 87, 34, 0.2)',
    },
    orbital: {
      radius: 140,
      radiusY: 90,
      inclination: 15,
      eccentricity: 0.1,
      rotationSpeed: 0.02,
      orbitSpeed: 1.1,
      tiltAngle: 12,
    },
    interaction: {
      affinities: ['tierra', 'aire'],
      conflicts: ['agua'],
      resonance: 1.2,
      harmonicFrequency: 528, // Hz - Frecuencia de transformación
      energyExchange: 0.9,
    },
  },
  agua: {
    name: 'Agua',
    symbol: '💧',
    physics: {
      mass: 1.0,
      magneticField: 0.8,
      temperature: 0.3,
      density: 1.0,
      gravitationalInfluence: 1.0,
      pulseFrequency: 0.8,
      resonanceLevel: 1.1,
    },
    visuals: {
      primaryColor: '#00BCD4',
      secondaryColor: '#4FC3F7',
      gradient: 'linear-gradient(135deg, #00BCD4 0%, #4FC3F7 50%, #81D4FA 100%)',
      glowColor: 'rgba(0, 188, 212, 0.4)',
      trailColor: 'rgba(0, 188, 212, 0.5)',
      particleColor: '#42A5F5',
      shadowColor: 'rgba(25, 118, 210, 0.2)',
    },
    orbital: {
      radius: 180,
      radiusY: 120,
      inclination: -25,
      eccentricity: 0.15,
      rotationSpeed: 0.018,
      orbitSpeed: 0.7,
      tiltAngle: 8,
    },
    interaction: {
      affinities: ['tierra', 'aire'],
      conflicts: ['fuego'],
      resonance: 1.0,
      harmonicFrequency: 417, // Hz - Frecuencia de limpieza
      energyExchange: 1.1,
    },
  },
  tierra: {
    name: 'Tierra',
    symbol: '🌍',
    physics: {
      mass: 1.4,
      magneticField: 0.9,
      temperature: 0.5,
      density: 1.2,
      gravitationalInfluence: 1.2,
      pulseFrequency: 0.6,
      resonanceLevel: 1.0,
    },
    visuals: {
      primaryColor: '#66BB6A',
      secondaryColor: '#81C784',
      gradient: 'linear-gradient(135deg, #66BB6A 0%, #81C784 50%, #A5D6A7 100%)',
      glowColor: 'rgba(102, 187, 106, 0.4)',
      trailColor: 'rgba(102, 187, 106, 0.3)',
      particleColor: '#5CBF60',
      shadowColor: 'rgba(56, 142, 60, 0.2)',
    },
    orbital: {
      radius: 220,
      radiusY: 140,
      inclination: 35,
      eccentricity: 0.05,
      rotationSpeed: 0.015,
      orbitSpeed: 0.9,
      tiltAngle: 23.5, // Inclinación real de la Tierra
    },
    interaction: {
      affinities: ['fuego', 'agua', 'aire'],
      conflicts: [],
      resonance: 1.0,
      harmonicFrequency: 396, // Hz - Frecuencia de liberación
      energyExchange: 1.0,
    },
  },
  aire: {
    name: 'Aire',
    symbol: '💨',
    physics: {
      mass: 0.6,
      magneticField: 0.4,
      temperature: 0.7,
      density: 0.3,
      gravitationalInfluence: 0.8,
      pulseFrequency: 1.0,
      resonanceLevel: 1.4,
    },
    visuals: {
      primaryColor: '#FFD54F',
      secondaryColor: '#FFEB3B',
      gradient: 'linear-gradient(135deg, #FFD54F 0%, #FFEB3B 50%, #FFF176 100%)',
      glowColor: 'rgba(255, 213, 79, 0.4)',
      trailColor: 'rgba(255, 213, 79, 0.3)',
      particleColor: '#FFCA28',
      shadowColor: 'rgba(255, 160, 0, 0.2)',
    },
    orbital: {
      radius: 120,
      radiusY: 80,
      inclination: 5,
      eccentricity: 0.15,
      rotationSpeed: 0.025,
      orbitSpeed: 1.4,
      tiltAngle: 3,
    },
    interaction: {
      affinities: ['fuego', 'agua', 'tierra'],
      conflicts: [],
      resonance: 1.4,
      harmonicFrequency: 741, // Hz - Frecuencia de expresión
      energyExchange: 1.2,
    },
  },
};

// 🎯 PRESETS ELEMENTALES PARA DIFERENTES ESTADOS
export const ELEMENTAL_PRESETS = {
  balanced: {
    name: 'Balance Cósmico',
    description: 'Distribución armónica de todos los elementos',
    multipliers: { fuego: 1.0, agua: 1.0, tierra: 1.0, aire: 1.0 },
    visualIntensity: 1.0,
    animationSpeed: 1.0,
  },
  dynamic: {
    name: 'Energía Dinámica',
    description: 'Énfasis en elementos activos',
    multipliers: { fuego: 1.3, agua: 0.8, tierra: 0.9, aire: 1.2 },
    visualIntensity: 1.3,
    animationSpeed: 1.4,
  },
  meditative: {
    name: 'Serenidad Meditativa',
    description: 'Énfasis en elementos tranquilos',
    multipliers: { fuego: 0.7, agua: 1.2, tierra: 1.3, aire: 0.9 },
    visualIntensity: 0.8,
    animationSpeed: 0.7,
  },
  cosmic: {
    name: 'Resonancia Cósmica',
    description: 'Máxima intensidad para experiencias profundas',
    multipliers: { fuego: 1.1, agua: 1.1, tierra: 1.1, aire: 1.1 },
    visualIntensity: 1.5,
    animationSpeed: 1.2,
  },
};

// 🛠️ UTILIDADES DEL SISTEMA ELEMENTAL
export class ElementalUtils {
  // 🔄 Calcula la afinidad entre dos elementos
  static calculateAffinity(element1: ElementType, element2: ElementType): number {
    const config1 = UNIFIED_ELEMENTAL_CONFIG[element1];
    const config2 = UNIFIED_ELEMENTAL_CONFIG[element2];
    
    if (config1.interaction.affinities.includes(element2)) {
      return config1.interaction.resonance * config2.interaction.resonance;
    }
    
    if (config1.interaction.conflicts.includes(element2)) {
      return -0.5;
    }
    
    return 0.1; // Neutral
  }

  // 🎵 Calcula la frecuencia armónica resultante de múltiples elementos
  static calculateHarmonicFrequency(elements: ElementType[]): number {
    const frequencies = elements.map(el => UNIFIED_ELEMENTAL_CONFIG[el].interaction.harmonicFrequency);
    return frequencies.reduce((acc, freq) => acc + freq, 0) / frequencies.length;
  }

  // 🌍 Calcula posiciones orbitales usando distribución Fibonacci
  static calculateFibonacciOrbitalPosition(
    element: ElementType,
    timeOffset: number,
    containerWidth: number,
    containerHeight: number
  ): { x: number; y: number; z: number; harmony: number } {
    const config = UNIFIED_ELEMENTAL_CONFIG[element];
    const time = timeOffset * config.orbital.orbitSpeed;
    
    // Posición base usando golden ratio
    const angle = time * GOLDEN_RATIO;
    const radiusX = config.orbital.radius * (containerWidth / 400);
    const radiusY = config.orbital.radiusY * (containerHeight / 300);
    
    const x = Math.cos(angle + config.orbital.inclination * Math.PI / 180) * radiusX;
    const y = Math.sin(angle + config.orbital.inclination * Math.PI / 180) * radiusY;
    const z = Math.sin(time + config.orbital.tiltAngle * Math.PI / 180) * 20;
    
    // Calcula armonía basada en resonancia
    const harmony = config.interaction.resonance * Math.sin(time * config.physics.pulseFrequency);
    
    return { x: x + containerWidth / 2, y: y + containerHeight / 2, z, harmony };
  }

  // 📊 Obtiene información completa de un elemento
  static getElementInfo(element: ElementType): ElementalConfiguration {
    return UNIFIED_ELEMENTAL_CONFIG[element];
  }

  // 📋 Obtiene todos los tipos de elementos disponibles
  static getAllElements(): ElementType[] {
    return ['fuego', 'agua', 'tierra', 'aire'];
  }

  // 🎨 Obtiene el preset aplicado a un elemento específico
  static applyPreset(element: ElementType, presetName: keyof typeof ELEMENTAL_PRESETS): ElementalConfiguration {
    const baseConfig = { ...UNIFIED_ELEMENTAL_CONFIG[element] };
    const preset = ELEMENTAL_PRESETS[presetName];
    
    // Aplica multiplicadores del preset
    const multiplier = preset.multipliers[element];
    
    return {
      ...baseConfig,
      physics: {
        ...baseConfig.physics,
        pulseFrequency: baseConfig.physics.pulseFrequency * multiplier,
        resonanceLevel: baseConfig.physics.resonanceLevel * multiplier,
      },
      orbital: {
        ...baseConfig.orbital,
        orbitSpeed: baseConfig.orbital.orbitSpeed * preset.animationSpeed,
        rotationSpeed: baseConfig.orbital.rotationSpeed * preset.animationSpeed,
      },
    };
  }

  // 🌟 Convierte configuración legacy a formato unificado
  static convertLegacyConfig(legacyConfig: any): ElementalConfiguration {
    return {
      name: legacyConfig.name || 'Unknown',
      symbol: legacyConfig.symbol || '❓',
      physics: {
        mass: legacyConfig.mass || 1.0,
        magneticField: legacyConfig.magneticField || 0.5,
        temperature: legacyConfig.temperature || 0.5,
        density: legacyConfig.visualDensity || 1.0,
        gravitationalInfluence: legacyConfig.gravitationalInfluence || 1.0,
        pulseFrequency: legacyConfig.pulseFrequency || 1.0,
        resonanceLevel: legacyConfig.resonanceFrequency || 1.0,
      },
      visuals: {
        primaryColor: legacyConfig.color || '#888888',
        secondaryColor: legacyConfig.color || '#AAAAAA',
        gradient: legacyConfig.gradient || `linear-gradient(135deg, ${legacyConfig.color || '#888888'} 0%, #AAAAAA 100%)`,
        glowColor: legacyConfig.trailColor || 'rgba(136, 136, 136, 0.4)',
        trailColor: legacyConfig.trailColor || 'rgba(136, 136, 136, 0.3)',
        particleColor: legacyConfig.color || '#888888',
        shadowColor: 'rgba(136, 136, 136, 0.2)',
      },
      orbital: {
        radius: legacyConfig.orbitRadius * 100 || 150,
        radiusY: legacyConfig.orbitRadius * 70 || 100,
        inclination: legacyConfig.orbitInclination || 0,
        eccentricity: legacyConfig.orbitEccentricity || 0.1,
        rotationSpeed: 0.02,
        orbitSpeed: legacyConfig.orbitSpeed || 1.0,
        tiltAngle: 0,
      },
      interaction: {
        affinities: legacyConfig.elementalAffinity || [],
        conflicts: [],
        resonance: legacyConfig.harmonicMultiplier || 1.0,
        harmonicFrequency: 440,
        energyExchange: 1.0,
      },
    };
  }
}

export default UNIFIED_ELEMENTAL_CONFIG; 