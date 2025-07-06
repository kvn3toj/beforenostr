// Demo/apps/superapp-unified/src/theme/themeConfig.ts
import {
    getPrimaryColor,
    getSecondaryColor,
    getBackgroundColor,
    getTextColor,
    getSemanticColor,
    activePalette // Para saber si es un tema oscuro o claro por defecto
} from '../design-system/color-system'; // Ajustar ruta si es necesario

// MODULE_COLORS ya no se importará de './colors' sino que se derivarán de la paleta activa si es necesario,
// o se decidirá si estos colores específicos de módulo deben estar en la paleta global.
// Por ahora, los reemplazaré con colores de la paleta activa.

export interface ThemePalette {
  uplayPrimary: string; // Se podría mapear a un color semántico o de acento
  headerBackground: string;
  headerText: string;
  navMenuBackground: string;
  navMenuText: string;
  navMenuItemActive: string;
  mainBackground: string;
  primaryText: string;
  secondaryText: string;
  buttonPrimaryBackground: string;
  buttonPrimaryText: string;
  buttonSecondaryBackground: string;
  buttonSecondaryText: string;
  accentColor: string;
  loadingPlaceholderBackground: string;
}

// Determinar si la paleta activa es inherentemente oscura
// const isCurrentPaletteDark = activePalette.background.default.toLowerCase() < '#aaaaaa'; // Heurística simple
// Para la paleta 'minimalist' unificada, sabemos que es clara.

export const defaultTheme: ThemePalette = {
  // Usar getSemanticColor o getPrimaryColor/getSecondaryColor de la paleta activa.
  // Los MODULE_COLORS originales eran: uplay: azul, social: violeta.
  // Mapearemos uplay a 'info' y social a un 'secondary' o un tono de 'primary' si es apropiado.
  uplayPrimary: getSemanticColor('info', 'main'),
  headerBackground: getBackgroundColor('paper'),
  headerText: getTextColor('primary'),
  navMenuBackground: getBackgroundColor('surface'),
  navMenuText: getTextColor('secondary'),
  navMenuItemActive: getPrimaryColor('500'), // Dorado para activo
  mainBackground: getBackgroundColor('default'),
  primaryText: getTextColor('primary'),
  secondaryText: getTextColor('secondary'),
  buttonPrimaryBackground: getPrimaryColor('500'), // Dorado
  buttonPrimaryText: getTextContrast(getPrimaryColor('500')), // Helper para contraste (asumimos blanco o negro)
  buttonSecondaryBackground: getSecondaryColor('200'),
  buttonSecondaryText: getSecondaryColor('700'),
  accentColor: getPrimaryColor('500'), // Dorado
  loadingPlaceholderBackground: getSecondaryColor('100'),
};

// Función helper para determinar el color de texto de contraste (simplificada)
function getTextContrast(hexcolor: string): string {
  if (!hexcolor) return '#000000';
  hexcolor = hexcolor.replace("#", "");
  const r = parseInt(hexcolor.substring(0, 2), 16);
  const g = parseInt(hexcolor.substring(2, 4), 16);
  const b = parseInt(hexcolor.substring(4, 6), 16);
  const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
  return (yiq >= 128) ? '#000000' : '#FFFFFF';
}


// Dado que la paleta 'minimalist' de color-system.ts es inherentemente clara y es la única que queremos usar,
// lightTheme se vuelve redundante o una copia de defaultTheme.
export const lightTheme: ThemePalette = {
  ...defaultTheme
};

export const themes = {
  // La clave aquí debería ser el nombre de la paleta activa para que coincida si se busca por nombre.
  // O simplemente exportar el tema derivado de la paleta activa.
  [activePalette.name]: defaultTheme,
  // Si queremos mantener una estructura 'light'/'dark' aquí, y 'minimalist' es nuestro 'light':
  light: defaultTheme,
  // dark: {} // Habría que definir un darkTheme derivado de una paleta oscura en color-system.ts
};
