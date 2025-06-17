/**
 * 🌌 COOMUNITY DESIGN SYSTEM - REVOLUTIONARY PATTERNS
 * ==================================================
 * 
 * Patrones revolucionarios extraídos del Dashboard HOME
 * Centralizados para escalabilidad a todos los módulos
 * 
 * Basado en análisis de componentes HOME:
 * - AyniMetricsCardRevolutionary.tsx (920 líneas)
 * - ModuleCardsRevolutionary.tsx (663 líneas) 
 * - NotificationCenterRevolutionary.tsx (747 líneas)
 * - LiveActivityFeed.tsx (737 líneas - glassmorphism)
 * 
 * Fase 2, Semana 1 - Plan Maestro Material UI
 */

import { alpha, Theme } from '@mui/material';

// 🎨 REVOLUTIONARY PATTERN BASE - EXTRAÍDO DEL HOME
export const revolutionaryPattern = {
  // Glassmorphism base con configuración probada HOME
  background: 'rgba(255, 254, 251, 0.85)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  
  // Bordes cósmicos perfeccionados
  border: '1px solid rgba(255, 183, 77, 0.2)',
  borderRadius: '24px',
  
  // Sombras profundas en capas (patrón HOME)
  boxShadow: [
    '0 8px 32px rgba(139, 69, 19, 0.1)',
    '0 2px 16px rgba(255, 152, 0, 0.08)',
    'inset 0 1px 0 rgba(255, 255, 255, 0.6)',
    'inset 0 -1px 0 rgba(255, 183, 77, 0.1)',
  ].join(', '),
  
  // Efectos de profundidad 3D (crucial para planetas orbitales)
  transform: 'translateZ(0)',
  transformStyle: 'preserve-3d' as const,
  perspective: '1500px',
  overflow: 'visible' as const, // CRÍTICO: permite órbitas planetarias
  
  // Transiciones fluidas golden ratio
  transition: 'all 0.618s cubic-bezier(0.34, 1.56, 0.64, 1)',
  
  // Estados interactivos con feedback cósmico
  '&:hover': {
    transform: 'translateY(-6px) translateZ(12px) rotateX(2deg)',
    boxShadow: [
      '0 20px 60px rgba(139, 69, 19, 0.15)',
      '0 8px 32px rgba(255, 152, 0, 0.12)',
      'inset 0 2px 0 rgba(255, 255, 255, 0.8)',
      'inset 0 -2px 0 rgba(255, 183, 77, 0.2)',
    ].join(', '),
    background: 'rgba(255, 254, 251, 0.95)',
  },

  '&:active': {
    transform: 'translateY(-2px) translateZ(4px)',
    transition: 'all 0.1s ease-out',
  },
};

// 🌟 COSMIC CARD PATTERN - MEJORADO CON ANÁLISIS HOME
export const cosmicCardPattern = (theme: Theme) => ({
  // Fondo glassmorphism optimizado
  background: `linear-gradient(135deg, 
    ${alpha('#fffefb', 0.9)} 0%, 
    ${alpha('#f8f6f0', 0.85)} 50%, 
    ${alpha('#f1ede3', 0.8)} 100%)`,
  
  // Borde con gradiente sutil
  border: `1px solid transparent`,
  backgroundImage: `
    linear-gradient(135deg, rgba(255, 254, 251, 0.9) 0%, rgba(248, 246, 240, 0.85) 50%, rgba(241, 237, 227, 0.8) 100%),
    linear-gradient(90deg, rgba(255, 183, 77, 0.3), rgba(255, 152, 0, 0.2), rgba(255, 193, 7, 0.1))
  `,
  backgroundOrigin: 'border-box',
  backgroundClip: 'padding-box, border-box',
  
  borderRadius: '24px',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  
  // Sombras cósmicas multicapa
  boxShadow: [
    '0 8px 32px rgba(139, 69, 19, 0.08)',
    '0 2px 16px rgba(255, 152, 0, 0.06)',
    'inset 0 1px 0 rgba(255, 255, 255, 0.7)',
    'inset 0 -1px 0 rgba(255, 183, 77, 0.1)',
  ].join(', '),
  
  // Transición con proporción áurea
  transition: 'all 0.618s cubic-bezier(0.23, 1, 0.32, 1)',
  position: 'relative' as const,
  overflow: 'visible' as const,
  
  // Sistema de interacción cósmica
  '&:hover': {
    transform: 'translateY(-8px) scale(1.02)',
    boxShadow: [
      '0 20px 60px rgba(139, 69, 19, 0.12)',
      '0 8px 32px rgba(255, 152, 0, 0.1)',
      'inset 0 2px 0 rgba(255, 255, 255, 0.9)',
      'inset 0 -2px 0 rgba(255, 183, 77, 0.15)',
    ].join(', '),
    background: `linear-gradient(135deg, 
      ${alpha('#fffefb', 0.95)} 0%, 
      ${alpha('#f8f6f0', 0.9)} 50%, 
      ${alpha('#f1ede3', 0.85)} 100%)`,
  },
});

// 🔥 ELEMENTAL PATTERNS - EXTRAÍDOS Y REFINADOS
export const elementalPatterns = {
  fuego: {
    // Gradientes específicos del análisis HOME
    gradient: 'linear-gradient(145deg, #ff5722 0%, #ff9800 40%, #ffc107 80%, #ffeb3b 100%)',
    bgGradient: 'radial-gradient(circle at 30% 30%, rgba(255, 87, 34, 0.15) 0%, rgba(255, 152, 0, 0.1) 40%, transparent 70%)',
    particleColor: '#ff9800',
    glowColor: 'rgba(255, 152, 0, 0.4)',
    border: 'linear-gradient(90deg, rgba(255, 87, 34, 0.3), rgba(255, 152, 0, 0.2))',
    shadow: '0 0 20px rgba(255, 152, 0, 0.3)',
  },
  agua: {
    gradient: 'linear-gradient(145deg, #2196f3 0%, #03a9f4 40%, #00bcd4 80%, #009688 100%)',
    bgGradient: 'radial-gradient(circle at 70% 30%, rgba(33, 150, 243, 0.15) 0%, rgba(3, 169, 244, 0.1) 40%, transparent 70%)',
    particleColor: '#03a9f4',
    glowColor: 'rgba(3, 169, 244, 0.4)',
    border: 'linear-gradient(90deg, rgba(33, 150, 243, 0.3), rgba(3, 169, 244, 0.2))',
    shadow: '0 0 20px rgba(3, 169, 244, 0.3)',
  },
  tierra: {
    gradient: 'linear-gradient(145deg, #795548 0%, #8d6e63 40%, #a1887f 80%, #bcaaa4 100%)',
    bgGradient: 'radial-gradient(circle at 50% 70%, rgba(121, 85, 72, 0.15) 0%, rgba(141, 110, 99, 0.1) 40%, transparent 70%)',
    particleColor: '#8d6e63',
    glowColor: 'rgba(141, 110, 99, 0.4)',
    border: 'linear-gradient(90deg, rgba(121, 85, 72, 0.3), rgba(141, 110, 99, 0.2))',
    shadow: '0 0 20px rgba(141, 110, 99, 0.3)',
  },
  aire: {
    gradient: 'linear-gradient(145deg, #ffeb3b 0%, #fff176 40%, #fff59d 80%, #fff9c4 100%)',
    bgGradient: 'radial-gradient(circle at 80% 20%, rgba(255, 235, 59, 0.15) 0%, rgba(255, 241, 118, 0.1) 40%, transparent 70%)',
    particleColor: '#fff176',
    glowColor: 'rgba(255, 241, 118, 0.4)',
    border: 'linear-gradient(90deg, rgba(255, 235, 59, 0.3), rgba(255, 241, 118, 0.2))',
    shadow: '0 0 20px rgba(255, 241, 118, 0.3)',
  },
  espiritu: {
    gradient: 'linear-gradient(145deg, #9c27b0 0%, #ab47bc 40%, #ba68c8 80%, #ce93d8 100%)',
    bgGradient: 'radial-gradient(circle at 40% 60%, rgba(156, 39, 176, 0.15) 0%, rgba(171, 71, 188, 0.1) 40%, transparent 70%)',
    particleColor: '#ab47bc',
    glowColor: 'rgba(171, 71, 188, 0.4)',
    border: 'linear-gradient(90deg, rgba(156, 39, 176, 0.3), rgba(171, 71, 188, 0.2))',
    shadow: '0 0 20px rgba(171, 71, 188, 0.3)',
  },
};

// 📱 RESPONSIVE PATTERNS - OPTIMIZADOS PARA TODA LA SUPERAPP
export const responsivePattern = {
  padding: {
    xs: '12px',
    sm: '16px', 
    md: '20px',
    lg: '24px',
    xl: '32px',
  },
  borderRadius: {
    xs: '16px',
    sm: '18px',
    md: '20px', 
    lg: '24px',
    xl: '32px',
  },
  spacing: {
    xs: 1.5,
    sm: 2,
    md: 3,
    lg: 4,
    xl: 5,
  },
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    md: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
  },
};

// ⚡ ANIMATION PATTERNS - PERFECCIONADOS CON FIBONACCI
export const animationPatterns = {
  // Animación float suave con proporción áurea
  gentleFloat: {
    animation: 'gentleFloat 6.18s ease-in-out infinite',
    '@keyframes gentleFloat': {
      '0%, 100%': { transform: 'translateY(0px)' },
      '38.2%': { transform: 'translateY(-4px)' }, // Fibonacci point
      '61.8%': { transform: 'translateY(-8px)' }, // Golden ratio
    },
  },
  
  // Pulso cósmico sincronizado
  cosmicPulse: {
    animation: 'cosmicPulse 3.236s ease-in-out infinite', // Fibonacci timing
    '@keyframes cosmicPulse': {
      '0%, 100%': { 
        opacity: 1, 
        transform: 'scale(1)',
        filter: 'brightness(1)'
      },
      '50%': { 
        opacity: 0.85, 
        transform: 'scale(1.03)',
        filter: 'brightness(1.1)'
      },
    },
  },
  
  // Rotación orbital realista
  orbitalRotation: {
    animation: 'orbitalRotation 89.46s linear infinite', // Fibonacci orbital period
    '@keyframes orbitalRotation': {
      '0%': { transform: 'rotate(0deg)' },
      '100%': { transform: 'rotate(360deg)' },
    },
  },
  
  // Aparición elegante para elementos nuevos
  cosmicAppear: {
    animation: 'cosmicAppear 1.618s cubic-bezier(0.34, 1.56, 0.64, 1)',
    '@keyframes cosmicAppear': {
      '0%': {
        opacity: 0,
        transform: 'translateY(30px) scale(0.8)',
        filter: 'blur(10px)',
      },
      '61.8%': {
        opacity: 0.8,
        transform: 'translateY(-5px) scale(1.02)',
        filter: 'blur(2px)',
      },
      '100%': {
        opacity: 1,
        transform: 'translateY(0) scale(1)',
        filter: 'blur(0)',
      },
    },
  },
};

// 🌌 COSMIC UTILITIES - FUNCIONES AVANZADAS DEL SISTEMA
export const cosmicUtils = {
  // Crear gradientes elementales dinámicos
  createElementalGradient: (element: keyof typeof elementalPatterns, intensity: number = 1) => {
    const pattern = elementalPatterns[element];
    return pattern.gradient.replace(/0\.\d+/g, (match) => 
      Math.min(parseFloat(match) * intensity, 1).toString()
    );
  },
  
  // Glassmorphism dinámico con parámetros
  createGlassmorphism: (opacity: number = 0.85, blur: number = 20, tint: string = '#fffefb') => ({
    background: `${tint}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`,
    backdropFilter: `blur(${blur}px)`,
    WebkitBackdropFilter: `blur(${blur}px)`,
    border: `1px solid ${tint}${Math.round(opacity * 0.3 * 255).toString(16).padStart(2, '0')}`,
  }),
  
  // Sombras cósmicas por elemento
  createCosmicShadow: (element: keyof typeof elementalPatterns, intensity: number = 1) => {
    const pattern = elementalPatterns[element];
    return [
      `0 ${8 * intensity}px ${32 * intensity}px ${pattern.glowColor.replace('0.4', (0.1 * intensity).toString())}`,
      `0 ${2 * intensity}px ${16 * intensity}px ${pattern.glowColor.replace('0.4', (0.08 * intensity).toString())}`,
      `inset 0 1px 0 rgba(255, 255, 255, ${0.7 * intensity})`,
    ].join(', ');
  },
  
  // Crear efectos orbitales 3D
  createOrbitalEffect: (radius: number, speed: number = 1, delay: number = 0) => ({
    position: 'absolute' as const,
    animation: `orbital-${radius} ${60 / speed}s linear infinite ${delay}s`,
    '@keyframes orbital-${radius}': {
      '0%': {
        transform: `rotate(0deg) translateX(${radius}px) rotate(0deg)`,
      },
      '100%': {
        transform: `rotate(360deg) translateX(${radius}px) rotate(-360deg)`,
      },
    },
  }),
  
  // Fibonacci distribution calculator
  calculateFibonacciPosition: (index: number, total: number, containerSize: number) => {
    const phi = (1 + Math.sqrt(5)) / 2; // Golden ratio
    const angle = (index / total) * 2 * Math.PI;
    const radius = (containerSize / 2) * Math.pow(index / total, 1 / phi);
    
    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
    };
  },
};

// 🎯 COMPONENT VARIANTS - SISTEMA COMPLETO DE VARIANTES
export const componentVariants = {
  // Variante principal para elementos hero
  primary: {
    ...revolutionaryPattern,
    background: 'rgba(255, 254, 251, 0.9)',
    border: '1px solid rgba(255, 183, 77, 0.3)',
    boxShadow: [
      '0 12px 40px rgba(139, 69, 19, 0.1)',
      '0 4px 20px rgba(255, 152, 0, 0.08)',
      'inset 0 2px 0 rgba(255, 255, 255, 0.8)',
    ].join(', '),
  },
  
  // Variante secundaria para elementos de soporte
  secondary: {
    ...revolutionaryPattern,
    background: 'rgba(248, 246, 240, 0.8)',
    border: '1px solid rgba(255, 183, 77, 0.2)',
    boxShadow: [
      '0 6px 24px rgba(139, 69, 19, 0.08)',
      '0 2px 12px rgba(255, 152, 0, 0.06)',
      'inset 0 1px 0 rgba(255, 255, 255, 0.6)',
    ].join(', '),
  },
  
  // Variante accent para elementos destacados
  accent: {
    ...revolutionaryPattern,
    background: 'linear-gradient(135deg, rgba(255, 183, 77, 0.15) 0%, rgba(255, 152, 0, 0.1) 100%)',
    border: '1px solid rgba(255, 183, 77, 0.4)',
    boxShadow: [
      '0 8px 32px rgba(255, 152, 0, 0.15)',
      '0 2px 16px rgba(255, 183, 77, 0.1)',
      'inset 0 1px 0 rgba(255, 255, 255, 0.9)',
    ].join(', '),
  },
  
  // Variante elevada para modales y overlays
  elevated: {
    ...revolutionaryPattern,
    transform: 'translateZ(24px)',
    background: 'rgba(255, 254, 251, 0.95)',
    border: '1px solid rgba(255, 183, 77, 0.3)',
    boxShadow: [
      '0 24px 80px rgba(139, 69, 19, 0.15)',
      '0 8px 40px rgba(255, 152, 0, 0.12)',
      'inset 0 2px 0 rgba(255, 255, 255, 0.9)',
      'inset 0 -2px 0 rgba(255, 183, 77, 0.1)',
    ].join(', '),
  },
  
  // Variante minimal para elementos discretos
  minimal: {
    background: 'rgba(255, 254, 251, 0.6)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 183, 77, 0.1)',
    borderRadius: '16px',
    boxShadow: '0 4px 16px rgba(139, 69, 19, 0.05)',
    transition: 'all 0.3s ease',
    
    '&:hover': {
      background: 'rgba(255, 254, 251, 0.8)',
      border: '1px solid rgba(255, 183, 77, 0.2)',
      transform: 'translateY(-2px)',
    },
  },
};

export default {
  revolutionaryPattern,
  cosmicCardPattern,
  elementalPatterns,
  responsivePattern,
  animationPatterns,
  cosmicUtils,
  componentVariants,
}; 