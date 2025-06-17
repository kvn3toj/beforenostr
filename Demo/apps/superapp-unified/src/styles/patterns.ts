// 🌌 PATRONES CÓSMICOS CENTRALIZADOS - DESIGN SYSTEM COOMUNITY
// Extraído desde componentes revolucionarios del Dashboard HOME
// Sigue el Plan Maestro Material UI para escalabilidad total

import { alpha, Theme } from '@mui/material';

// 🎨 REVOLUTIONARY PATTERN BASE
export const revolutionaryPattern = {
  // Base glassmorphism
  background: 'var(--revolutionary-glass-medium)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  
  // Bordes cósmicos
  border: '1px solid var(--revolutionary-border)',
  borderRadius: '24px',
  
  // Sombras profundas
  boxShadow: [
    '0 8px 32px rgba(0, 0, 0, 0.12)',
    '0 2px 16px rgba(0, 0, 0, 0.08)',
    'inset 0 1px 0 rgba(255, 255, 255, 0.1)',
  ].join(', '),
  
  // Efectos de profundidad 3D
  transform: 'translateZ(0)',
  transformStyle: 'preserve-3d' as const,
  perspective: '1500px',
  
  // Transiciones fluidas
  transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
  
  // Estados interactivos
  '&:hover': {
    transform: 'translateY(-4px) translateZ(8px)',
    boxShadow: [
      '0 20px 60px rgba(0, 0, 0, 0.15)',
      '0 8px 32px rgba(0, 0, 0, 0.12)',
      'inset 0 1px 0 rgba(255, 255, 255, 0.15)',
    ].join(', '),
  },
};

// 🌟 COSMIC CARD PATTERN
export const cosmicCardPattern = (theme: Theme) => ({
  background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.9)} 0%, ${alpha(theme.palette.background.default, 0.8)} 100%)`,
  border: `1px solid ${alpha('#fff', 0.1)}`,
  borderRadius: '24px',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  boxShadow: [
    '0 8px 32px rgba(0, 0, 0, 0.12)',
    '0 2px 16px rgba(0, 0, 0, 0.08)',
    'inset 0 1px 0 rgba(255, 255, 255, 0.1)',
  ].join(', '),
  transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
  position: 'relative' as const,
  overflow: 'visible' as const,
  
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: [
      '0 20px 60px rgba(0, 0, 0, 0.15)',
      '0 8px 32px rgba(0, 0, 0, 0.12)',
      'inset 0 1px 0 rgba(255, 255, 255, 0.15)',
    ].join(', '),
  },
});

// 🔥 ELEMENTAL PATTERNS
export const elementalPatterns = {
  fuego: {
    gradient: 'linear-gradient(135deg, #FF6B35, #FF8A50, #FFB366)',
    bgGradient: 'radial-gradient(circle at 30% 30%, rgba(255, 107, 53, 0.2) 0%, transparent 60%)',
    particleColor: '#FF6B35',
    glowColor: 'rgba(255, 107, 53, 0.4)',
  },
  agua: {
    gradient: 'linear-gradient(135deg, #00BCD4, #26C6DA, #4DD0E1)',
    bgGradient: 'radial-gradient(circle at 70% 30%, rgba(0, 188, 212, 0.2) 0%, transparent 60%)',
    particleColor: '#00BCD4',
    glowColor: 'rgba(0, 188, 212, 0.4)',
  },
  tierra: {
    gradient: 'linear-gradient(135deg, #66BB6A, #81C784, #A5D6A7)',
    bgGradient: 'radial-gradient(circle at 50% 70%, rgba(102, 187, 106, 0.2) 0%, transparent 60%)',
    particleColor: '#66BB6A',
    glowColor: 'rgba(102, 187, 106, 0.4)',
  },
  aire: {
    gradient: 'linear-gradient(135deg, #FFD54F, #FFEB3B, #FFF176)',
    bgGradient: 'radial-gradient(circle at 80% 80%, rgba(255, 213, 79, 0.2) 0%, transparent 60%)',
    particleColor: '#FFD54F',
    glowColor: 'rgba(255, 213, 79, 0.4)',
  },
  espiritu: {
    gradient: 'linear-gradient(135deg, #9C27B0, #AB47BC, #BA68C8)',
    bgGradient: 'radial-gradient(circle at 40% 60%, rgba(156, 39, 176, 0.2) 0%, transparent 60%)',
    particleColor: '#9C27B0',
    glowColor: 'rgba(156, 39, 176, 0.4)',
  },
};

// 📱 RESPONSIVE PATTERNS
export const responsivePattern = {
  padding: {
    xs: '16px',
    sm: '20px',
    md: '24px',
    lg: '32px',
  },
  borderRadius: {
    xs: '16px',
    sm: '20px',
    md: '24px',
    lg: '32px',
  },
  spacing: {
    xs: 2,
    sm: 3,
    md: 4,
    lg: 5,
  },
};

// ⚡ ANIMATION PATTERNS
export const animationPatterns = {
  gentleFloat: {
    animation: 'gentleFloat 6s ease-in-out infinite',
    '@keyframes gentleFloat': {
      '0%, 100%': { transform: 'translateY(0px)' },
      '50%': { transform: 'translateY(-8px)' },
    },
  },
  cosmicPulse: {
    animation: 'cosmicPulse 2s ease-in-out infinite',
    '@keyframes cosmicPulse': {
      '0%, 100%': { opacity: 1, transform: 'scale(1)' },
      '50%': { opacity: 0.8, transform: 'scale(1.05)' },
    },
  },
  orbitalRotation: {
    animation: 'orbitalRotation 60s linear infinite',
    '@keyframes orbitalRotation': {
      '0%': { transform: 'rotate(0deg)' },
      '100%': { transform: 'rotate(360deg)' },
    },
  },
};

// 🌌 COSMIC UTILITIES
export const cosmicUtils = {
  // Función para crear gradientes dinámicos
  createElementalGradient: (element: keyof typeof elementalPatterns, intensity: number = 1) => {
    const pattern = elementalPatterns[element];
    return pattern.gradient.replace(/0\.\d+/g, (match) => 
      (parseFloat(match) * intensity).toString()
    );
  },
  
  // Función para glassmorphism dinámico
  createGlassmorphism: (opacity: number = 0.9, blur: number = 20) => ({
    background: `rgba(255, 255, 255, ${opacity * 0.1})`,
    backdropFilter: `blur(${blur}px)`,
    WebkitBackdropFilter: `blur(${blur}px)`,
    border: `1px solid rgba(255, 255, 255, ${opacity * 0.2})`,
  }),
  
  // Función para sombras cósmicas
  createCosmicShadow: (color: string, intensity: number = 1) => [
    `0 ${8 * intensity}px ${32 * intensity}px ${color}20`,
    `0 ${2 * intensity}px ${16 * intensity}px ${color}15`,
    `inset 0 1px 0 rgba(255, 255, 255, ${0.1 * intensity})`,
  ].join(', '),
};

// 🎯 COMPONENT VARIANTS
export const componentVariants = {
  primary: {
    ...revolutionaryPattern,
    background: 'var(--revolutionary-glass-primary)',
  },
  secondary: {
    ...revolutionaryPattern,
    background: 'var(--revolutionary-glass-secondary)',
  },
  accent: {
    ...revolutionaryPattern,
    background: 'var(--revolutionary-glass-accent)',
  },
  elevated: {
    ...revolutionaryPattern,
    transform: 'translateZ(16px)',
    boxShadow: [
      '0 16px 64px rgba(0, 0, 0, 0.15)',
      '0 4px 32px rgba(0, 0, 0, 0.12)',
      'inset 0 2px 0 rgba(255, 255, 255, 0.15)',
    ].join(', '),
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