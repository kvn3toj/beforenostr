/**
 * 🎨 COLORES OFICIALES DE MARCA COOMUNITY
 * ===============================================================================
 * Paleta de colores oficial de la marca CoomÜnity
 * Estos son los colores sagrados que deben respetarse en toda la aplicación
 * ===============================================================================
 */

// 🌟 COLORES PRIMARIOS DE MARCA
export const COOMUNITY_BRAND_COLORS = {
  // Colores Base Esenciales
  white: '#FFFFFF',        // C: 0 M: 0 Y: 0 K: 0
  black: '#1D1D1B',        // C: 0 M: 0 Y: 0 K: 100
  gold: '#FBBA00',         // C: 0 M: 30 Y: 100 K: 0 (Dorado principal)

  // Azules Corporativos
  navy: '#142C46',         // C: 100 M: 80 Y: 45 K: 45
  blue: '#005CA9',         // C: 100 M: 60 Y: 0 K: 0

  // Púrpuras de Sabiduría
  deepPurple: '#392768',   // C: 95 M: 100 Y: 25 K: 10
  purple: '#5C2483',       // C: 80 M: 100 Y: 0 K: 0

  // Rojos de Pasión
  darkRed: '#5D1626',      // C: 50 M: 100 Y: 70 K: 50
  magenta: '#D6075C',      // C: 10 M: 100 Y: 40 K: 0

  // Verdes de Naturaleza
  darkGreen: '#004134',    // C: 90 M: 40 Y: 70 K: 60
  green: '#3E8638',        // C: 80 M: 30 Y: 100 K: 0
} as const;

// 🎨 MAPEO A ELEMENTOS COOMUNITY
export const BRAND_ELEMENT_MAPPING = {
  fuego: {
    primary: COOMUNITY_BRAND_COLORS.magenta,     // #D6075C - Fuego vibrante
    secondary: COOMUNITY_BRAND_COLORS.darkRed,   // #5D1626 - Fuego profundo
    gradient: `linear-gradient(135deg, ${COOMUNITY_BRAND_COLORS.magenta} 0%, ${COOMUNITY_BRAND_COLORS.darkRed} 100%)`,
  },
  agua: {
    primary: COOMUNITY_BRAND_COLORS.blue,        // #005CA9 - Agua clara
    secondary: COOMUNITY_BRAND_COLORS.navy,      // #142C46 - Agua profunda
    gradient: `linear-gradient(135deg, ${COOMUNITY_BRAND_COLORS.blue} 0%, ${COOMUNITY_BRAND_COLORS.navy} 100%)`,
  },
  tierra: {
    primary: COOMUNITY_BRAND_COLORS.green,       // #3E8638 - Tierra fértil
    secondary: COOMUNITY_BRAND_COLORS.darkGreen, // #004134 - Tierra profunda
    gradient: `linear-gradient(135deg, ${COOMUNITY_BRAND_COLORS.green} 0%, ${COOMUNITY_BRAND_COLORS.darkGreen} 100%)`,
  },
  aire: {
    primary: COOMUNITY_BRAND_COLORS.purple,      // #5C2483 - Aire místico
    secondary: COOMUNITY_BRAND_COLORS.deepPurple,// #392768 - Aire profundo
    gradient: `linear-gradient(135deg, ${COOMUNITY_BRAND_COLORS.purple} 0%, ${COOMUNITY_BRAND_COLORS.deepPurple} 100%)`,
  },
  eter: {
    primary: COOMUNITY_BRAND_COLORS.gold,        // #FBBA00 - Éter dorado
    secondary: COOMUNITY_BRAND_COLORS.white,     // #FFFFFF - Éter puro
    gradient: `linear-gradient(135deg, ${COOMUNITY_BRAND_COLORS.gold} 0%, #F4A900 100%)`,
  },
};

// 🌟 PALETAS TEMÁTICAS OFICIALES
export const COOMUNITY_THEME_PALETTES = {
  // Tema Principal Oficial
  official: {
    primary: {
      main: COOMUNITY_BRAND_COLORS.gold,      // #FBBA00
      light: '#FDCF4A',                       // Versión más clara del dorado
      dark: '#E6A800',                        // Versión más oscura del dorado
      gradient: `linear-gradient(135deg, ${COOMUNITY_BRAND_COLORS.gold} 0%, #E6A800 100%)`,
    },
    secondary: {
      main: COOMUNITY_BRAND_COLORS.blue,      // #005CA9
      light: '#4A8BC2',                       // Azul más claro
      dark: '#004080',                        // Azul más oscuro
      gradient: `linear-gradient(135deg, ${COOMUNITY_BRAND_COLORS.blue} 0%, #004080 100%)`,
    },
    elements: BRAND_ELEMENT_MAPPING,
    consciousness: {
      elevation: COOMUNITY_BRAND_COLORS.purple,     // #5C2483
      harmony: COOMUNITY_BRAND_COLORS.green,        // #3E8638
      growth: COOMUNITY_BRAND_COLORS.blue,          // #005CA9
      community: COOMUNITY_BRAND_COLORS.gold,       // #FBBA00
      wisdom: COOMUNITY_BRAND_COLORS.deepPurple,    // #392768
    },
    surfaces: {
      background: '#FAFAFA',                   // Blanco ligeramente cálido
      paper: COOMUNITY_BRAND_COLORS.white,    // #FFFFFF
      elevated: COOMUNITY_BRAND_COLORS.white,
      overlay: 'rgba(29, 29, 27, 0.5)',       // Negro semi-transparente
    },
    text: {
      primary: COOMUNITY_BRAND_COLORS.black,  // #1D1D1B
      secondary: '#666666',                    // Gris medio
      disabled: '#999999',                     // Gris claro
    },
  },

  // Tema Oscuro Oficial
  dark: {
    primary: {
      main: COOMUNITY_BRAND_COLORS.gold,      // #FBBA00
      light: '#FDCF4A',
      dark: '#E6A800',
      gradient: `linear-gradient(135deg, ${COOMUNITY_BRAND_COLORS.gold} 0%, #E6A800 100%)`,
    },
    secondary: {
      main: COOMUNITY_BRAND_COLORS.blue,      // #005CA9
      light: '#4A8BC2',
      dark: '#004080',
      gradient: `linear-gradient(135deg, ${COOMUNITY_BRAND_COLORS.blue} 0%, #004080 100%)`,
    },
    elements: BRAND_ELEMENT_MAPPING,
    consciousness: {
      elevation: COOMUNITY_BRAND_COLORS.purple,
      harmony: COOMUNITY_BRAND_COLORS.green,
      growth: COOMUNITY_BRAND_COLORS.blue,
      community: COOMUNITY_BRAND_COLORS.gold,
      wisdom: COOMUNITY_BRAND_COLORS.deepPurple,
    },
    surfaces: {
      background: '#121212',                   // Negro suave
      paper: '#1E1E1E',                       // Gris muy oscuro
      elevated: '#2A2A2A',                    // Gris oscuro elevado
      overlay: 'rgba(255, 255, 255, 0.1)',   // Blanco semi-transparente
    },
    text: {
      primary: COOMUNITY_BRAND_COLORS.white,  // #FFFFFF
      secondary: '#CCCCCC',                    // Gris claro
      disabled: '#666666',                     // Gris medio
    },
  },
};

// 🔧 UTILIDADES DE COLORES DE MARCA
export const getBrandColor = (colorName: keyof typeof COOMUNITY_BRAND_COLORS): string => {
  return COOMUNITY_BRAND_COLORS[colorName];
};

export const getElementBrandGradient = (element: keyof typeof BRAND_ELEMENT_MAPPING): string => {
  return BRAND_ELEMENT_MAPPING[element].gradient;
};

export const createBrandGradient = (color1: string, color2: string, direction = '135deg'): string => {
  return `linear-gradient(${direction}, ${color1} 0%, ${color2} 100%)`;
};

// 🌟 GRADIENTES ESPECIALES DE MARCA
export const BRAND_GRADIENTS = {
  primary: createBrandGradient(COOMUNITY_BRAND_COLORS.gold, '#E6A800'),
  secondary: createBrandGradient(COOMUNITY_BRAND_COLORS.blue, COOMUNITY_BRAND_COLORS.navy),
  elements: createBrandGradient(
    COOMUNITY_BRAND_COLORS.magenta,   // Fuego
    COOMUNITY_BRAND_COLORS.blue,      // Agua
    '90deg'
  ),
  consciousness: createBrandGradient(
    COOMUNITY_BRAND_COLORS.purple,    // Aire
    COOMUNITY_BRAND_COLORS.gold,      // Éter
    '45deg'
  ),
  ayni: createBrandGradient(
    COOMUNITY_BRAND_COLORS.green,     // Armonía
    COOMUNITY_BRAND_COLORS.gold,      // Reciprocidad
    '135deg'
  ),
};

// 🎨 VALIDADOR DE MARCA
export const validateBrandColor = (color: string): boolean => {
  return Object.values(COOMUNITY_BRAND_COLORS).includes(color as any);
};

export default {
  COOMUNITY_BRAND_COLORS,
  BRAND_ELEMENT_MAPPING,
  COOMUNITY_THEME_PALETTES,
  BRAND_GRADIENTS,
  getBrandColor,
  getElementBrandGradient,
  createBrandGradient,
  validateBrandColor,
};
