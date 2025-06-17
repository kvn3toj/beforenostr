// 🔢 UTILIDADES MATEMÁTICAS FIBONACCI - DISTRIBUCIÓN ORBITAL PERFECTA
// Implementa las reglas de proporción áurea y distribución Fibonacci para widgets 3D

import { debounce } from 'lodash';

// 🌟 CONSTANTES MATEMÁTICAS FUNDAMENTALES
export const GOLDEN_RATIO = 1.6180339887; // φ = (1 + √5) / 2
export const GOLDEN_RATIO_INVERSE = 0.6180339887; // 1/φ
export const GOLDEN_RATIO_SQUARED = 2.6180339887; // φ²

// 🔢 SECUENCIA DE FIBONACCI HASTA 987 (para distribución orbital)
export const FIBONACCI_SEQUENCE = [
  1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987
];

// 📐 ÁNGULOS FIBONACCI PARA DISTRIBUCIÓN NATURAL
export const FIBONACCI_ANGLES = [
  0,    // Fuego: 0°
  90,   // Agua: 90° (90° de diferencia)
  180,  // Tierra: 180° (90° de diferencia)
  270   // Aire: 270° (90° de diferencia)
];

// 🌀 DISTRIBUCIÓN SPIRAL FIBONACCI (para elementos dinámicos)
export const getFibonacciSpiral = (index: number, totalElements: number): { angle: number, radius: number } => {
  // Ángulo basado en la proporción áurea para distribución natural
  const angle = (index * 137.508) % 360; // 137.508° es el ángulo áureo
  
  // Radio basado en secuencia Fibonacci normalizada
  const fibIndex = Math.min(index, FIBONACCI_SEQUENCE.length - 1);
  const radius = FIBONACCI_SEQUENCE[fibIndex] / FIBONACCI_SEQUENCE[Math.min(7, FIBONACCI_SEQUENCE.length - 1)];
  
  return { angle, radius };
};

// 🎯 POSICIONAMIENTO ORBITAL FIBONACCI
export interface OrbitalPosition {
  x: number;
  y: number;
  angle: number;
  radius: number;
  scale: number;
  opacity: number;
}

export const calculateFibonacciOrbit = (
  elementIndex: number,
  totalElements: number,
  time: number,
  containerWidth: number,
  containerHeight: number,
  options?: {
    speed?: number;
    radiusMultiplier?: number;
    centerOffset?: { x: number; y: number };
    eccentricity?: number;
  }
): OrbitalPosition => {
  const {
    speed = 1,
    radiusMultiplier = 1,
    centerOffset = { x: 0, y: 0 },
    eccentricity = 0.1
  } = options || {};

  // Centro del contenedor
  const centerX = containerWidth / 2 + centerOffset.x;
  const centerY = containerHeight / 2 + centerOffset.y;
  
  // Ángulo base Fibonacci para distribución uniforme
  const baseAngle = (elementIndex * 360) / totalElements;
  
  // Ángulo actual con movimiento temporal
  const currentAngle = (baseAngle + (time * speed)) % 360;
  const radians = (currentAngle * Math.PI) / 180;
  
  // Radio basado en proporción áurea
  const baseRadius = Math.min(containerWidth, containerHeight) * 0.25 * radiusMultiplier;
  const fibonacciRadius = baseRadius * (1 + (elementIndex * GOLDEN_RATIO_INVERSE) * 0.3);
  
  // Aplicar excentricidad para órbita elíptica
  const ellipticalRadius = fibonacciRadius * (1 + eccentricity * Math.cos(radians * 2));
  
  // Posición cartesiana
  const x = centerX + ellipticalRadius * Math.cos(radians);
  const y = centerY + ellipticalRadius * Math.sin(radians);
  
  // Escala basada en proximidad al centro (perspectiva)
  const distanceFromCenter = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
  const maxDistance = Math.max(containerWidth, containerHeight) * 0.4;
  const scale = 0.6 + (0.4 * (1 - Math.min(distanceFromCenter / maxDistance, 1)));
  
  // Opacidad basada en movimiento (efecto de profundidad)
  const opacity = 0.7 + (0.3 * Math.abs(Math.sin(radians)));
  
  return {
    x,
    y,
    angle: currentAngle,
    radius: ellipticalRadius,
    scale,
    opacity
  };
};

// 🌈 DISTRIBUCIÓN DE COLORES FIBONACCI
export const getFibonacciColor = (index: number, baseColors: string[]): string => {
  // Usar secuencia Fibonacci para distribución de colores armoniosa
  const colorIndex = FIBONACCI_SEQUENCE[index % FIBONACCI_SEQUENCE.length] % baseColors.length;
  return baseColors[colorIndex];
};

// ⚡ VELOCIDADES ANIMACIÓN FIBONACCI
export const getFibonacciAnimationSpeed = (elementIndex: number): number => {
  // Velocidades basadas en proporción áurea para movimiento armónico
  const baseSpeed = 1;
  const fibonacciMultiplier = FIBONACCI_SEQUENCE[elementIndex % 8] / 13; // Normalizado a Fibonacci 13
  return baseSpeed * (GOLDEN_RATIO_INVERSE + fibonacciMultiplier * 0.5);
};

// 🎭 INTERPOLACIÓN SUAVE FIBONACCI
export const fibonacciLerp = (start: number, end: number, t: number): number => {
  // Interpolación suave usando función áurea
  const smoothT = t * t * (3 - 2 * t); // Smoothstep
  const goldenT = smoothT * GOLDEN_RATIO_INVERSE; // Aplicar proporción áurea
  return start + (end - start) * Math.min(goldenT, 1);
};

// 🌀 EFECTOS DE PARTÍCULAS FIBONACCI
export interface FibonacciParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  angle: number;
}

export const generateFibonacciParticles = (
  centerX: number,
  centerY: number,
  count: number = 55, // Número Fibonacci
  options?: {
    initialVelocity?: number;
    lifespan?: number;
    sizeRange?: [number, number];
    colors?: string[];
  }
): FibonacciParticle[] => {
  const {
    initialVelocity = 2,
    lifespan = 1000,
    sizeRange = [2, 8],
    colors = ['#FF6B35', '#00BCD4', '#66BB6A', '#FFD54F']
  } = options || {};

  const particles: FibonacciParticle[] = [];
  
  for (let i = 0; i < count; i++) {
    const spiral = getFibonacciSpiral(i, count);
    const angle = (spiral.angle * Math.PI) / 180;
    
    // Velocidad inicial en dirección espiral
    const velocity = initialVelocity * (1 + spiral.radius * 0.5);
    const vx = Math.cos(angle) * velocity;
    const vy = Math.sin(angle) * velocity;
    
    // Tamaño basado en proporción áurea
    const sizeFactor = FIBONACCI_SEQUENCE[i % 8] / 21; // Normalizado
    const size = sizeRange[0] + (sizeRange[1] - sizeRange[0]) * sizeFactor;
    
    // Color usando distribución Fibonacci
    const color = getFibonacciColor(i, colors);
    
    particles.push({
      x: centerX,
      y: centerY,
      vx,
      vy,
      life: lifespan,
      maxLife: lifespan,
      size,
      color,
      angle: spiral.angle
    });
  }
  
  return particles;
};

// 🔄 ACTUALIZACIÓN DE PARTÍCULAS CON FÍSICA
export const updateFibonacciParticles = (
  particles: FibonacciParticle[],
  deltaTime: number
): FibonacciParticle[] => {
  return particles
    .map(particle => ({
      ...particle,
      x: particle.x + particle.vx * deltaTime,
      y: particle.y + particle.vy * deltaTime,
      life: particle.life - deltaTime,
      // Aplicar fricción usando proporción áurea
      vx: particle.vx * (1 - deltaTime * GOLDEN_RATIO_INVERSE * 0.001),
      vy: particle.vy * (1 - deltaTime * GOLDEN_RATIO_INVERSE * 0.001)
    }))
    .filter(particle => particle.life > 0);
};

// 🎯 DETECCIÓN DE COLISIONES FIBONACCI
export const checkFibonacciCollision = (
  pos1: { x: number; y: number; radius: number },
  pos2: { x: number; y: number; radius: number }
): boolean => {
  const dx = pos1.x - pos2.x;
  const dy = pos1.y - pos2.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  const combinedRadius = (pos1.radius + pos2.radius) * GOLDEN_RATIO_INVERSE;
  
  return distance < combinedRadius;
};

// 📊 MÉTRICAS DE RENDIMIENTO FIBONACCI
export interface FibonacciMetrics {
  distributionQuality: number; // 0-100
  visualHarmony: number; // 0-100
  animationSmoothness: number; // 0-100
  overallScore: number; // 0-100
}

export const calculateFibonacciMetrics = (
  positions: OrbitalPosition[],
  frameTime: number
): FibonacciMetrics => {
  // Calcular calidad de distribución
  let distributionQuality = 100;
  if (positions.length > 1) {
    const angles = positions.map(p => p.angle);
    const avgAngleDiff = 360 / positions.length;
    const actualDiffs = angles.map((angle, i) => {
      const nextAngle = angles[(i + 1) % angles.length];
      return Math.abs(nextAngle - angle);
    });
    
    const variance = actualDiffs.reduce((sum, diff) => {
      return sum + Math.pow(diff - avgAngleDiff, 2);
    }, 0) / actualDiffs.length;
    
    distributionQuality = Math.max(0, 100 - variance);
  }
  
  // Calcular armonía visual
  const scales = positions.map(p => p.scale);
  const avgScale = scales.reduce((sum, scale) => sum + scale, 0) / scales.length;
  const scaleVariance = scales.reduce((sum, scale) => {
    return sum + Math.pow(scale - avgScale, 2);
  }, 0) / scales.length;
  
  const visualHarmony = Math.max(0, 100 - (scaleVariance * 1000));
  
  // Calcular suavidad de animación
  const animationSmoothness = Math.max(0, 100 - Math.abs(frameTime - 16.67) * 5);
  
  // Puntaje general usando proporción áurea
  const overallScore = Math.round(
    distributionQuality * GOLDEN_RATIO_INVERSE +
    visualHarmony * 0.3 +
    animationSmoothness * 0.1
  );
  
  return {
    distributionQuality: Math.round(distributionQuality),
    visualHarmony: Math.round(visualHarmony),
    animationSmoothness: Math.round(animationSmoothness),
    overallScore: Math.min(100, overallScore)
  };
};

// 🎛️ OPTIMIZACIÓN DE RENDIMIENTO
export const debouncedCalculateOrbit = debounce(calculateFibonacciOrbit, 16); // ~60fps
export const debouncedUpdateParticles = debounce(updateFibonacciParticles, 16);

// 🔧 CONFIGURACIONES PREDEFINIDAS
export const FIBONACCI_PRESETS = {
  default: {
    speed: 1,
    radiusMultiplier: 1,
    eccentricity: 0.1
  },
  fast: {
    speed: 2,
    radiusMultiplier: 0.8,
    eccentricity: 0.2
  },
  slow: {
    speed: 0.5,
    radiusMultiplier: 1.2,
    eccentricity: 0.05
  },
  cosmic: {
    speed: 0.7,
    radiusMultiplier: 1.5,
    eccentricity: 0.3
  }
} as const;

export default {
  GOLDEN_RATIO,
  FIBONACCI_SEQUENCE,
  calculateFibonacciOrbit,
  getFibonacciSpiral,
  generateFibonacciParticles,
  updateFibonacciParticles,
  calculateFibonacciMetrics,
  FIBONACCI_PRESETS
}; 