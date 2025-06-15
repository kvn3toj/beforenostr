/**
 * Utilidad para validar contraste de colores según WCAG 2.1
 */

interface ContrastResult {
  ratio: number;
  isValidAA: boolean;
  isValidAAA: boolean;
  level: 'fail' | 'AA' | 'AAA';
}

/**
 * Convierte un color hex a RGB
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

/**
 * Calcula la luminancia relativa de un color
 */
function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Calcula el ratio de contraste entre dos colores
 */
export function getContrastRatio(color1: string, color2: string): number {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  
  if (!rgb1 || !rgb2) {
    throw new Error('Colores hex inválidos');
  }
  
  const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);
  
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  
  return (brightest + 0.05) / (darkest + 0.05);
}

/**
 * Valida el contraste según estándares WCAG
 */
export function validateContrast(
  foreground: string, 
  background: string, 
  isLargeText: boolean = false
): ContrastResult {
  const ratio = getContrastRatio(foreground, background);
  const minRatioAA = isLargeText ? 3 : 4.5;
  const minRatioAAA = isLargeText ? 4.5 : 7;
  
  const isValidAA = ratio >= minRatioAA;
  const isValidAAA = ratio >= minRatioAAA;
  
  let level: 'fail' | 'AA' | 'AAA';
  if (isValidAAA) {
    level = 'AAA';
  } else if (isValidAA) {
    level = 'AA';
  } else {
    level = 'fail';
  }
  
  return {
    ratio: Math.round(ratio * 100) / 100,
    isValidAA,
    isValidAAA,
    level
  };
}

/**
 * Genera un color más oscuro/claro para mejorar contraste
 */
export function adjustColorForContrast(
  color: string, 
  background: string, 
  targetRatio: number = 4.5
): string {
  const originalRgb = hexToRgb(color);
  if (!originalRgb) return color;
  
  // Intentar oscurecer primero
  let bestColor = color;
  let bestRatio = getContrastRatio(color, background);
  
  // Probar diferentes niveles de oscurecimiento/aclarado
  for (let factor = 0.1; factor <= 0.9; factor += 0.1) {
    // Oscurecer
    const darkerColor = `#${Math.floor(originalRgb.r * (1 - factor)).toString(16).padStart(2, '0')}${Math.floor(originalRgb.g * (1 - factor)).toString(16).padStart(2, '0')}${Math.floor(originalRgb.b * (1 - factor)).toString(16).padStart(2, '0')}`;
    const darkerRatio = getContrastRatio(darkerColor, background);
    
    if (darkerRatio >= targetRatio && darkerRatio > bestRatio) {
      bestColor = darkerColor;
      bestRatio = darkerRatio;
    }
    
    // Aclarar
    const lighterColor = `#${Math.min(255, Math.floor(originalRgb.r + (255 - originalRgb.r) * factor)).toString(16).padStart(2, '0')}${Math.min(255, Math.floor(originalRgb.g + (255 - originalRgb.g) * factor)).toString(16).padStart(2, '0')}${Math.min(255, Math.floor(originalRgb.b + (255 - originalRgb.b) * factor)).toString(16).padStart(2, '0')}`;
    const lighterRatio = getContrastRatio(lighterColor, background);
    
    if (lighterRatio >= targetRatio && lighterRatio > bestRatio) {
      bestColor = lighterColor;
      bestRatio = lighterRatio;
    }
  }
  
  return bestColor;
}

/**
 * Valida toda una paleta de colores
 */
export function validateColorPalette(colors: any): { [key: string]: ContrastResult[] } {
  const results: { [key: string]: ContrastResult[] } = {};
  
  // Combinaciones críticas para validar
  const criticalCombinations = [
    { fg: colors.text.primary, bg: colors.background.default, name: 'text-on-background' },
    { fg: colors.text.secondary, bg: colors.background.default, name: 'secondary-text-on-background' },
    { fg: colors.primary.contrastText, bg: colors.primary.main, name: 'primary-button-text' },
    { fg: colors.secondary.contrastText, bg: colors.secondary.main, name: 'secondary-button-text' },
    { fg: colors.error.contrastText, bg: colors.error.main, name: 'error-button-text' },
    { fg: colors.success.contrastText, bg: colors.success.main, name: 'success-button-text' },
    { fg: colors.warning.contrastText, bg: colors.warning.main, name: 'warning-button-text' },
    { fg: colors.info.contrastText, bg: colors.info.main, name: 'info-button-text' },
  ];
  
  criticalCombinations.forEach(combo => {
    if (!results[combo.name]) {
      results[combo.name] = [];
    }
    results[combo.name].push(validateContrast(combo.fg, combo.bg));
  });
  
  return results;
} 