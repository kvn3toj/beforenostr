import { ElementType } from '../../types';

/**
 * 🌌 COSMIC HOME GRADIENTS - DESIGN SYSTEM
 * ========================================
 * 
 * Gradientes específicos extraídos del Dashboard HOME para reutilización
 * en todo el ecosistema CoomÜnity SuperApp.
 * 
 * Basado en análisis de:
 * - AyniMetricsCardRevolutionary.tsx (920 líneas)
 * - ModuleCardsRevolutionary.tsx 
 * - NotificationCenterRevolutionary.tsx
 * - LiveActivityFeed.tsx (glassmorphism patterns)
 */

// 🎨 GRADIENTES BASE DEL HOME DASHBOARD
export const homeGradients = {
  // Gradiente principal del fondo HOME
  primaryBackground: 'linear-gradient(135deg, #fffefb 0%, #f8f6f0 50%, #f1ede3 100%)',
  
  // Gradiente de las métricas Ayni revolucionarias
  ayniMetrics: 'linear-gradient(145deg, rgba(255,223,186,0.4) 0%, rgba(255,183,77,0.6) 50%, rgba(255,152,0,0.3) 100%)',
  
  // Gradiente del balance cósmico central
  cosmicBalance: 'radial-gradient(circle at center, rgba(255,183,77,0.8) 0%, rgba(255,152,0,0.4) 40%, rgba(139,69,19,0.2) 100%)',
  
  // Gradiente de las tarjetas de módulos
  moduleCards: 'linear-gradient(135deg, rgba(255,254,251,0.9) 0%, rgba(248,246,240,0.7) 100%)',
  
  // Gradiente del centro de notificaciones
  notificationCenter: 'linear-gradient(145deg, rgba(255,248,220,0.6) 0%, rgba(255,228,181,0.4) 100%)',
  
  // Gradiente del feed de actividad en vivo
  activityFeed: 'linear-gradient(135deg, rgba(255,254,251,0.8) 0%, rgba(255,248,220,0.6) 50%, rgba(255,228,181,0.4) 100%)'
} as const;

// 🌟 GRADIENTES ELEMENTALES ESPECÍFICOS DEL HOME
export const homeElementalGradients = {
  // Fuego: Para elementos de acción y energía
  fuego: {
    background: 'linear-gradient(145deg, rgba(255,87,34,0.15) 0%, rgba(255,152,0,0.1) 50%, rgba(255,193,7,0.05) 100%)',
    border: 'linear-gradient(90deg, rgba(255,87,34,0.3), rgba(255,152,0,0.2))',
    glow: '0 0 20px rgba(255,152,0,0.3)'
  },
  
  // Agua: Para elementos fluidos y emocionales  
  agua: {
    background: 'linear-gradient(145deg, rgba(33,150,243,0.15) 0%, rgba(3,169,244,0.1) 50%, rgba(0,188,212,0.05) 100%)',
    border: 'linear-gradient(90deg, rgba(33,150,243,0.3), rgba(3,169,244,0.2))',
    glow: '0 0 20px rgba(3,169,244,0.3)'
  },
  
  // Tierra: Para elementos estables y materiales
  tierra: {
    background: 'linear-gradient(145deg, rgba(121,85,72,0.15) 0%, rgba(156,102,68,0.1) 50%, rgba(188,143,143,0.05) 100%)',
    border: 'linear-gradient(90deg, rgba(121,85,72,0.3), rgba(156,102,68,0.2))',
    glow: '0 0 20px rgba(156,102,68,0.3)'
  },
  
  // Aire: Para elementos mentales y comunicación
  aire: {
    background: 'linear-gradient(145deg, rgba(255,235,59,0.15) 0%, rgba(255,241,118,0.1) 50%, rgba(255,249,196,0.05) 100%)',
    border: 'linear-gradient(90deg, rgba(255,235,59,0.3), rgba(255,241,118,0.2))',
    glow: '0 0 20px rgba(255,241,118,0.3)'
  },
  
  // Espíritu: Para elementos espirituales y transcendentes
  espiritu: {
    background: 'linear-gradient(145deg, rgba(156,39,176,0.15) 0%, rgba(142,36,170,0.1) 50%, rgba(123,31,162,0.05) 100%)',
    border: 'linear-gradient(90deg, rgba(156,39,176,0.3), rgba(142,36,170,0.2))',
    glow: '0 0 20px rgba(142,36,170,0.3)'
  }
} as const;

// 🎭 GRADIENTES DE ESTADO PARA INTERACCIONES
export const homeStateGradients = {
  // Estados de hover para tarjetas
  hover: {
    default: 'linear-gradient(145deg, rgba(255,183,77,0.1) 0%, rgba(255,152,0,0.05) 100%)',
    elevated: 'linear-gradient(145deg, rgba(255,183,77,0.2) 0%, rgba(255,152,0,0.1) 100%)'
  },
  
  // Estados activos/seleccionados
  active: {
    default: 'linear-gradient(145deg, rgba(255,152,0,0.2) 0%, rgba(255,183,77,0.1) 100%)',
    strong: 'linear-gradient(145deg, rgba(255,152,0,0.3) 0%, rgba(255,183,77,0.15) 100%)'
  },
  
  // Estados de enfoque/foco
  focus: {
    ring: 'linear-gradient(90deg, rgba(255,183,77,0.4), rgba(255,152,0,0.6), rgba(255,183,77,0.4))',
    background: 'linear-gradient(145deg, rgba(255,254,251,0.95) 0%, rgba(255,248,220,0.8) 100%)'
  }
} as const;

// 🔮 GRADIENTES CÓSMICOS ESPECÍFICOS
export const cosmicHomeGradients = {
  // Sistema solar del balance Ayni
  solarSystem: {
    center: 'radial-gradient(circle, rgba(255,183,77,1) 0%, rgba(255,152,0,0.8) 30%, rgba(255,193,7,0.4) 70%, transparent 100%)',
    orbit1: 'radial-gradient(circle, rgba(255,241,118,0.6) 0%, transparent 60%)',
    orbit2: 'radial-gradient(circle, rgba(255,213,79,0.4) 0%, transparent 60%)',
    orbit3: 'radial-gradient(circle, rgba(255,183,77,0.3) 0%, transparent 60%)'
  },
  
  // Partículas flotantes cósmicas
  particles: {
    primary: 'radial-gradient(circle, rgba(255,183,77,0.8) 0%, rgba(255,183,77,0.4) 50%, transparent 100%)',
    secondary: 'radial-gradient(circle, rgba(255,152,0,0.6) 0%, rgba(255,152,0,0.2) 50%, transparent 100%)',
    accent: 'radial-gradient(circle, rgba(255,193,7,0.4) 0%, rgba(255,193,7,0.1) 50%, transparent 100%)'
  },
  
  // Ondas de energía Ayni
  energyWaves: {
    wave1: 'linear-gradient(45deg, transparent 0%, rgba(255,183,77,0.1) 50%, transparent 100%)',
    wave2: 'linear-gradient(135deg, transparent 0%, rgba(255,152,0,0.1) 50%, transparent 100%)',
    wave3: 'linear-gradient(225deg, transparent 0%, rgba(255,193,7,0.1) 50%, transparent 100%)'
  }
} as const;

// 🎨 UTILIDADES PARA APLICAR GRADIENTES
export const applyHomeGradient = (type: keyof typeof homeGradients) => ({
  background: homeGradients[type],
  backgroundSize: '100% 100%',
  backgroundRepeat: 'no-repeat'
});

export const applyElementalHomeGradient = (element: ElementType) => ({
  background: homeElementalGradients[element].background,
  border: `1px solid transparent`,
  backgroundImage: `${homeElementalGradients[element].background}, ${homeElementalGradients[element].border}`,
  backgroundOrigin: 'border-box',
  backgroundClip: 'padding-box, border-box',
  boxShadow: homeElementalGradients[element].glow
});

export const applyCosmicHomeGradient = (cosmic: keyof typeof cosmicHomeGradients.solarSystem) => ({
  background: cosmicHomeGradients.solarSystem[cosmic],
  borderRadius: '50%',
  filter: 'blur(0.5px)'
});

// 📱 GRADIENTES RESPONSIVOS PARA DIFERENTES BREAKPOINTS
export const responsiveHomeGradients = {
  mobile: {
    // Gradientes simplificados para móvil
    primaryBackground: 'linear-gradient(180deg, #fffefb 0%, #f8f6f0 100%)',
    ayniMetrics: 'linear-gradient(135deg, rgba(255,183,77,0.3) 0%, rgba(255,152,0,0.2) 100%)'
  },
  
  tablet: {
    // Gradientes intermedio para tablet
    primaryBackground: 'linear-gradient(135deg, #fffefb 0%, #f8f6f0 70%, #f1ede3 100%)',
    ayniMetrics: 'linear-gradient(145deg, rgba(255,183,77,0.35) 0%, rgba(255,152,0,0.4) 100%)'
  },
  
  desktop: homeGradients // Gradientes completos para desktop
} as const;

// 🌈 EXPORT DEFAULT PARA FÁCIL IMPORTACIÓN
export default {
  homeGradients,
  homeElementalGradients,
  homeStateGradients,
  cosmicHomeGradients,
  applyHomeGradient,
  applyElementalHomeGradient,
  applyCosmicHomeGradient,
  responsiveHomeGradients
} as const; 