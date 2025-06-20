/**
 * 🎨 SISTEMA CENTRALIZADO DE COLORES - COOMUNITY SUPERAPP
 * ===============================================================================
 * Un solo archivo para controlar TODA la paleta de colores de la aplicación
 * Cambiar aquí = cambia automáticamente en TODA la app
 * ===============================================================================
 */

import { alpha } from '@mui/material/styles';

// 🎨 DEFINICIÓN DE PALETAS COMPLETAS
export interface ColorScale {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
}

export interface SemanticColor {
  main: string;
  light: string;
  dark: string;
}

export interface BackgroundColors {
  default: string;
  paper: string;
  surface: string;
}

export interface TextColors {
  primary: string;
  secondary: string;
  disabled: string;
}

export interface ColorPalette {
  name: string;
  description: string;
  primary: ColorScale;
  secondary: ColorScale;
  semantic: {
    success: SemanticColor;
    error: SemanticColor;
    warning: SemanticColor;
    info: SemanticColor;
  };
  background: BackgroundColors;
  text: TextColors;
}

//  CONFIGURACIÓN DE PALETAS DISPONIBLES
export type PaletteType = 'gamifier' | 'autumn' | 'friendly' | 'cosmic' | 'minimalist';

// 🎨 DEFINICIÓN DE PALETAS COMPLETAS
export const COLOR_PALETTES: Record<PaletteType, ColorPalette> = {
  // 🏆 GAMIFIER - Dorado/Lujo (Original)
  gamifier: {
    name: 'Gamifier Gold',
    description: 'Paleta dorada elegante y premium del Gamifier original',
    primary: {
      50: '#fffbeb',
      100: '#fef3c7',
      200: '#fde68a',
      300: '#fcd34d',
      400: '#fbbf24',
      500: '#CDAB5A', // Dorado principal
      600: '#B8954A',
      700: '#92400e',
      800: '#78350f',
      900: '#451a03',
    },
    secondary: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#272727', // Gris oscuro navegación
      600: '#1a1a1a',
      700: '#0f172a',
      800: '#020617',
      900: '#000000',
    },
    semantic: {
      success: { main: '#10B981', light: '#D1FAE5', dark: '#059669' },
      error: { main: '#EF4444', light: '#FEE2E2', dark: '#DC2626' },
      warning: { main: '#F59E0B', light: '#FEF3C7', dark: '#D97706' },
      info: { main: '#3B82F6', light: '#DBEAFE', dark: '#1D4ED8' },
    },
    background: {
      default: '#F8F9FA',
      paper: '#FFFFFF',
      surface: '#FEFEFE',
    },
    text: {
      primary: '#2C2C2C',
      secondary: '#6B7280',
      disabled: '#9CA3AF',
    }
  },

  // 🍂 AUTUMN - Otoñal/Cálido
  autumn: {
    name: 'Autumn Warmth',
    description: 'Colores cálidos y terrosos inspirados en el otoño',
    primary: {
      50: '#fff7ed',
      100: '#ffedd5',
      200: '#fed7aa',
      300: '#fdba74',
      400: '#fb923c',
      500: '#f97316', // Naranja otoñal
      600: '#ea580c',
      700: '#c2410c',
      800: '#9a3412',
      900: '#7c2d12',
    },
    secondary: {
      50: '#fef2f2',
      100: '#fee2e2',
      200: '#fecaca',
      300: '#fca5a5',
      400: '#f87171',
      500: '#dc2626', // Rojo otoñal
      600: '#b91c1c',
      700: '#991b1b',
      800: '#7f1d1d',
      900: '#450a0a',
    },
    semantic: {
      success: { main: '#16a34a', light: '#dcfce7', dark: '#15803d' },
      error: { main: '#dc2626', light: '#fee2e2', dark: '#991b1b' },
      warning: { main: '#f59e0b', light: '#fef3c7', dark: '#d97706' },
      info: { main: '#8b5a2b', light: '#fed7aa', dark: '#92400e' },
    },
    background: {
      default: '#fffefb', // Blanco cálido
      paper: '#ffffff',
      surface: '#fafaf9',
    },
    text: {
      primary: '#292524',
      secondary: '#57534e',
      disabled: '#a8a29e',
    }
  },

  // 😊 FRIENDLY - Azul/Verde amigable
  friendly: {
    name: 'Friendly Nature',
    description: 'Colores suaves y confiables, siguiendo heurísticas UX/UI',
    primary: {
      50: '#eef2ff',
      100: '#e0e7ff',
      200: '#c7d2fe',
      300: '#a5b4fc',
      400: '#818cf8',
      500: '#6366f1', // Azul amigable
      600: '#4f46e5',
      700: '#4338ca',
      800: '#3730a3',
      900: '#312e81',
    },
    secondary: {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      300: '#86efac',
      400: '#4ade80',
      500: '#22c55e', // Verde equilibrado
      600: '#16a34a',
      700: '#15803d',
      800: '#166534',
      900: '#14532d',
    },
    semantic: {
      success: { main: '#22c55e', light: '#dcfce7', dark: '#15803d' },
      error: { main: '#ef4444', light: '#fee2e2', dark: '#dc2626' },
      warning: { main: '#f59e0b', light: '#fef3c7', dark: '#d97706' },
      info: { main: '#3b82f6', light: '#dbeafe', dark: '#1d4ed8' },
    },
    background: {
      default: '#ffffff',
      paper: '#ffffff',
      surface: '#fefefe',
    },
    text: {
      primary: '#374151',
      secondary: '#6b7280',
      disabled: '#9ca3af',
    }
  },

  // 🌌 COSMIC - Espacial/Futurista (para Dashboard 3D)
  cosmic: {
    name: 'Cosmic Space',
    description: 'Paleta espacial y futurista para el sistema solar 3D',
    primary: {
      50: '#f0f9ff',
      100: '#e0f2fe',
      200: '#bae6fd',
      300: '#7dd3fc',
      400: '#38bdf8',
      500: '#0ea5e9', // Azul cósmico
      600: '#0284c7',
      700: '#0369a1',
      800: '#075985',
      900: '#0c4a6e',
    },
    secondary: {
      50: '#faf5ff',
      100: '#f3e8ff',
      200: '#e9d5ff',
      300: '#d8b4fe',
      400: '#c084fc',
      500: '#a855f7', // Violeta espacial
      600: '#9333ea',
      700: '#7c3aed',
      800: '#6b21a8',
      900: '#581c87',
    },
    semantic: {
      success: { main: '#10b981', light: '#d1fae5', dark: '#047857' },
      error: { main: '#f43f5e', light: '#ffe4e6', dark: '#be123c' },
      warning: { main: '#f59e0b', light: '#fef3c7', dark: '#d97706' },
      info: { main: '#06b6d4', light: '#cffafe', dark: '#0891b2' },
    },
    background: {
      default: '#020617', // Azul espacial muy oscuro
      paper: '#0f172a',
      surface: '#1e293b',
    },
    text: {
      primary: '#f8fafc',
      secondary: '#cbd5e1',
      disabled: '#64748b',
    }
  },

  // 🎯 MINIMALIST - Minimalista/Monocromático
  minimalist: {
    name: 'Pure Minimalist',
    description: 'Diseño limpio y minimalista, alto contraste',
    primary: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b', // Gris azulado
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
    },
    secondary: {
      50: '#fafafa',
      100: '#f4f4f5',
      200: '#e4e4e7',
      300: '#d4d4d8',
      400: '#a1a1aa',
      500: '#71717a', // Gris neutro
      600: '#52525b',
      700: '#3f3f46',
      800: '#27272a',
      900: '#18181b',
    },
    semantic: {
      success: { main: '#059669', light: '#ecfdf5', dark: '#047857' },
      error: { main: '#dc2626', light: '#fef2f2', dark: '#b91c1c' },
      warning: { main: '#d97706', light: '#fffbeb', dark: '#b45309' },
      info: { main: '#0284c7', light: '#f0f9ff', dark: '#0369a1' },
    },
    background: {
      default: '#ffffff',
      paper: '#ffffff',
      surface: '#fafafa',
    },
    text: {
      primary: '#18181b',
      secondary: '#52525b',
      disabled: '#a1a1aa',
    }
  },
};

// ️ CONFIGURACIÓN ACTIVA (CAMBIAR AQUÍ PARA TODA LA APP)
export const ACTIVE_PALETTE: PaletteType = 'autumn'; // 👈 REGRESADO A AUTUMN PARA VERIFICACIÓN

// 🎨 PALETA ACTUALMENTE SELECCIONADA
export const activePalette = COLOR_PALETTES[ACTIVE_PALETTE];

// 🔧 FUNCIONES HELPER PARA USAR EN COMPONENTES
export const getPrimaryColor = (shade: keyof ColorScale = '500'): string => 
  activePalette.primary[shade];

export const getSecondaryColor = (shade: keyof ColorScale = '500'): string => 
  activePalette.secondary[shade];

export const getBackgroundColor = (type: keyof BackgroundColors = 'default'): string => 
  activePalette.background[type];

export const getTextColor = (type: keyof TextColors = 'primary'): string => 
  activePalette.text[type];

export const getSemanticColor = (
  type: keyof ColorPalette['semantic'], 
  variant: 'main' | 'light' | 'dark' = 'main'
): string => activePalette.semantic[type][variant];

// 🌈 GENERADOR DE GRADIENTES AUTOMÁTICO
export const createGradient = (
  color1: string, 
  color2: string, 
  direction: string = '135deg'
): string => `linear-gradient(${direction}, ${color1} 0%, ${color2} 100%)`;

export const getPrimaryGradient = (direction: string = '135deg'): string => 
  createGradient(getPrimaryColor('400'), getPrimaryColor('600'), direction);

export const getSemanticGradient = (
  type: keyof ColorPalette['semantic'], 
  direction: string = '135deg'
): string => createGradient(
  getSemanticColor(type, 'light'),
  getSemanticColor(type, 'main'),
  direction
);

// 🎭 FUNCIONES DE TRANSPARENCIA
export const alphaColor = (color: string, opacity: number): string => alpha(color, opacity);

export const getPrimaryAlpha = (shade: keyof ColorScale, opacity: number): string => 
  alphaColor(getPrimaryColor(shade), opacity);

// 🎯 ELEMENTOS ESPECÍFICOS COOMUNITY
export const COOMUNITY_ELEMENTS = {
  fuego: {
    color: getPrimaryColor('500' as unknown as keyof ColorScale),
    gradient: createGradient(getPrimaryColor('400' as unknown as keyof ColorScale), getPrimaryColor('600' as unknown as keyof ColorScale)),
    light: getPrimaryAlpha('100' as unknown as keyof ColorScale, 0.8),
  },
  agua: {
    color: getSemanticColor('info', 'main'),
    gradient: createGradient(getSemanticColor('info', 'light'), getSemanticColor('info', 'main')),
    light: alphaColor(getSemanticColor('info', 'light'), 0.8),
  },
  tierra: {
    color: getSemanticColor('success', 'main'),
    gradient: createGradient(getSemanticColor('success', 'light'), getSemanticColor('success', 'main')),
    light: alphaColor(getSemanticColor('success', 'light'), 0.8),
  },
  aire: {
    color: getSemanticColor('warning', 'main'),
    gradient: createGradient(getSemanticColor('warning', 'light'), getSemanticColor('warning', 'main')),
    light: alphaColor(getSemanticColor('warning', 'light'), 0.8),
  },
} as const;

// 📊 MÉTRICAS ESPECÍFICAS COOMUNITY
export const COOMUNITY_METRICS = {
  ondas: getPrimaryColor('600' as unknown as keyof ColorScale),
  meritos: getSemanticColor('success', 'main'),
  ayni: getSemanticColor('info', 'main'),
  balance: getPrimaryColor('500' as unknown as keyof ColorScale),
  lükas: getSemanticColor('warning', 'main'),
} as const;

// 🎨 EXPORTAR CONFIGURACIÓN PARA MATERIAL UI
export const getMaterialUIThemeColors = (mode: 'light' | 'dark' = 'light') => ({
  primary: {
    main: getPrimaryColor('500'),
    light: getPrimaryColor('300'),
    dark: getPrimaryColor('700'),
    contrastText: '#FFFFFF',
  },
  secondary: {
    main: getSecondaryColor('500'),
    light: getSecondaryColor('300'),
    dark: getSecondaryColor('700'),
    contrastText: '#FFFFFF',
  },
  success: {
    main: getSemanticColor('success', 'main'),
    light: getSemanticColor('success', 'light'),
    dark: getSemanticColor('success', 'dark'),
    contrastText: '#FFFFFF',
  },
  error: {
    main: getSemanticColor('error', 'main'),
    light: getSemanticColor('error', 'light'),
    dark: getSemanticColor('error', 'dark'),
    contrastText: '#FFFFFF',
  },
  warning: {
    main: getSemanticColor('warning', 'main'),
    light: getSemanticColor('warning', 'light'),
    dark: getSemanticColor('warning', 'dark'),
    contrastText: '#FFFFFF',
  },
  info: {
    main: getSemanticColor('info', 'main'),
    light: getSemanticColor('info', 'light'),
    dark: getSemanticColor('info', 'dark'),
    contrastText: '#FFFFFF',
  },
  background: {
    default: getBackgroundColor('default'),
    paper: getBackgroundColor('paper'),
  },
  text: {
    primary: getTextColor('primary'),
    secondary: getTextColor('secondary'),
    disabled: getTextColor('disabled'),
  },
  divider: getPrimaryAlpha('200', 0.4),
  action: {
    hover: getPrimaryAlpha('500', 0.08),
    selected: getPrimaryAlpha('500', 0.12),
    disabled: alphaColor(getTextColor('disabled'), 0.26),
    focus: getPrimaryAlpha('500', 0.25),
  },
});

// 🔍 INFORMACIÓN DE DEBUG
export const debugColorSystem = () => {
  console.group('🎨 CoomÜnity Color System Debug');
  console.log('Active Palette:', ACTIVE_PALETTE);
  console.log('Palette Info:', {
    name: activePalette.name,
    description: activePalette.description,
  });
  console.log('Primary Color:', getPrimaryColor());
  console.log('Secondary Color:', getSecondaryColor());
  console.log('Available Palettes:', Object.keys(COLOR_PALETTES));
  console.groupEnd();
  
  return {
    activePalette: ACTIVE_PALETTE,
    paletteInfo: activePalette,
    availablePalettes: Object.keys(COLOR_PALETTES),
  };
};

/**
 * 🎯 CÓMO CAMBIAR LA PALETA COMPLETA:
 * ===================================
 * 
 * 1. Cambiar ACTIVE_PALETTE arriba (línea 295)
 * 2. Automáticamente se aplicará en TODA la app
 * 3. Usar las funciones helper en componentes:
 *    - getPrimaryColor('500') 
 *    - getSemanticColor('success', 'main')
 *    - createGradient(color1, color2)
 * 
 * 4. Para Material UI: importar getMaterialUIThemeColors()
 * 5. Para elementos específicos: usar COOMUNITY_ELEMENTS
 * 
 * ¡Un solo cambio = toda la app actualizada! 🎉
 */