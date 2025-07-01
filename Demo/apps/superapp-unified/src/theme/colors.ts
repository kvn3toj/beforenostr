/**
 * Sistema de Colores Unificado - SuperApp CoomÜnity
 * ===============================================================================
 * Este archivo centraliza todas las definiciones de colores utilizadas en la aplicación,
 * proporcionando una fuente única de verdad para mantener la consistencia visual.
 */

// Paleta de colores principal de CoomÜnity
export const BRAND_COLORS = {
  // Colores primarios
  gold: '#FBBA00',      // Dorado CoomÜnity
  blue: '#005CA9',      // Azul CoomÜnity
  purple: '#5C2483',    // Violeta CoomÜnity
  deepPurple: '#392768', // Morado oscuro
  green: '#3E8638',     // Verde CoomÜnity
  red: '#D6075C',       // Rojo CoomÜnity
  burgundy: '#5D1626',  // Borgoña CoomÜnity
  deepBlue: '#142C46',  // Azul profundo CoomÜnity
  deepGreen: '#004134', // Verde profundo CoomÜnity
  beige: '#D4AA73',     // Beige CoomÜnity

  // Colores neutros
  white: '#FFFFFF',
  black: '#1D1D1B',

  // Grises
  gray50: '#F8F9FA',
  gray100: '#E9ECEF',
  gray200: '#DEE2E6',
  gray300: '#CED4DA',
  gray400: '#ADB5BD',
  gray500: '#706F6F',  // Actualizado según la paleta
  gray600: '#3C3C3B',  // Actualizado según la paleta
  gray700: '#343A40',
  gray800: '#212529',
  gray900: '#121212',
};

// Colores de los elementos filosóficos
export const ELEMENT_COLORS = {
  fuego: {
    primary: '#D6075C',   // Magenta - Fuego
    light: '#FEB2B2',
    dark: '#5D1626',
    contrast: '#FFFFFF',
  },
  agua: {
    primary: '#005CA9',   // Azul
    light: '#BEE3F8',
    dark: '#142C46',
    contrast: '#FFFFFF',
  },
  tierra: {
    primary: '#3E8638',   // Verde
    light: '#C6F6D5',
    dark: '#004134',
    contrast: '#FFFFFF',
  },
  aire: {
    primary: '#FBBA00',   // Dorado
    light: '#FEEBC8',
    dark: '#975A16',
    contrast: '#FFFFFF',
  },
  eter: {
    primary: '#5C2483',   // Púrpura
    light: '#E9D8FD',
    dark: '#392768',
    contrast: '#FFFFFF',
  },
};

// Colores de los módulos principales
export const MODULE_COLORS = {
  uplay: '#005CA9',     // Azul - ÜPlay (GPL Gamified Play List)
  marketplace: '#3E8638', // Verde - Marketplace (GMP Gamified Match Place)
  social: '#5C2483',    // Violeta - Social
  ustats: '#FBBA00',    // Dorado - UStats
  wallet: '#D6075C',    // Magenta - Wallet
};

// Colores semánticos
export const SEMANTIC_COLORS = {
  success: '#3E8638',   // Verde - Éxito
  warning: '#FBBA00',   // Amarillo - Advertencia
  error: '#5D1626',     // Rojo oscuro - Error
  info: '#005CA9',      // Azul - Información
};

// Colores de conceptos filosóficos
export const CONCEPT_COLORS = {
  reciprocidad: '#D6075C',  // Magenta - Reciprocidad (antes Reciprocidad)
  meritos: '#FBBA00',      // Dorado - Mëritos
  ondas: '#5C2483',        // Violeta - Öndas
  lukas: '#005CA9',        // Azul - Lükas
  bienComun: '#D4AA73',    // Beige - Bien Común
};

// Gradientes predefinidos
export const GRADIENTS = {
  primary: `linear-gradient(135deg, ${BRAND_COLORS.gold} 0%, #E6A800 100%)`,
  secondary: `linear-gradient(135deg, ${BRAND_COLORS.blue} 0%, #004080 100%)`,
  reciprocidad: `linear-gradient(135deg, ${CONCEPT_COLORS.reciprocidad} 0%, #5D1626 100%)`,
  meritos: `linear-gradient(135deg, ${CONCEPT_COLORS.meritos} 0%, #E6A800 100%)`,
  uplay: `linear-gradient(135deg, ${MODULE_COLORS.uplay} 0%, ${ELEMENT_COLORS.agua.dark} 100%)`,
  marketplace: `linear-gradient(135deg, ${MODULE_COLORS.marketplace} 0%, ${ELEMENT_COLORS.tierra.dark} 100%)`,
};

// Paletas temáticas completas
export const THEME_PALETTES = {
  // Tema minimalista (tema por defecto)
  minimalist: {
    name: 'Minimalist Unified',
    description: 'Estilo unificado, limpio y minimalista para la SuperApp',
    primary: BRAND_COLORS.deepBlue,
    secondary: BRAND_COLORS.deepPurple,
    accent: BRAND_COLORS.burgundy,
    success: SEMANTIC_COLORS.success,
    warning: SEMANTIC_COLORS.warning,
    info: SEMANTIC_COLORS.info,
    error: SEMANTIC_COLORS.error,
    background: BRAND_COLORS.white,
    surface: BRAND_COLORS.gray50,
    divider: BRAND_COLORS.gray100,
    neutral: CONCEPT_COLORS.bienComun,
    mystic: '#8A7FB9',
    text: {
      primary: BRAND_COLORS.black,
      secondary: BRAND_COLORS.gray600,
      muted: BRAND_COLORS.gray500
    }
  },

  // Tema monocromático
  monochrome: {
    name: 'Pure Monochrome',
    description: 'Elegancia atemporal en escala de grises',
    primary: BRAND_COLORS.black,
    secondary: BRAND_COLORS.gray600,
    accent: BRAND_COLORS.gray500,
    mystic: BRAND_COLORS.gray300,
    neutral: BRAND_COLORS.gray100,
    background: BRAND_COLORS.white,
    surface: BRAND_COLORS.gray50,
    success: BRAND_COLORS.gray600,
    warning: BRAND_COLORS.gray500,
    error: BRAND_COLORS.gray700,
    info: BRAND_COLORS.gray300,
    divider: BRAND_COLORS.gray100,
    text: {
      primary: BRAND_COLORS.black,
      secondary: BRAND_COLORS.gray600,
      muted: BRAND_COLORS.gray500
    }
  }
};

// Exportar todo como un objeto unificado para facilitar importaciones
export const UNIFIED_COLORS = {
  brand: BRAND_COLORS,
  elements: ELEMENT_COLORS,
  modules: MODULE_COLORS,
  semantic: SEMANTIC_COLORS,
  concepts: CONCEPT_COLORS,
  gradients: GRADIENTS,
  themes: THEME_PALETTES,
};
