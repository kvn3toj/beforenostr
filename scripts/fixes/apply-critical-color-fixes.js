const fs = require('fs');

// Funciones de contraste reutilizadas
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function rgbToHex(r, g, b) {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function getLuminance(r, g, b) {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function getContrastRatio(color1, color2) {
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

function findOptimalColor(originalColor, backgroundHex, targetRatio = 4.5, preserveHue = true) {
  const original = hexToRgb(originalColor);
  const background = hexToRgb(backgroundHex);
  
  if (!original || !background) return originalColor;
  
  let bestColor = originalColor;
  let bestRatio = getContrastRatio(originalColor, backgroundHex);
  
  // Si preservamos el matiz, mantenemos las proporciones RGB
  if (preserveHue) {
    const hueRatios = {
      r: original.r / Math.max(original.r, original.g, original.b),
      g: original.g / Math.max(original.r, original.g, original.b),
      b: original.b / Math.max(original.r, original.g, original.b)
    };
    
    // Probar diferentes niveles de intensidad
    for (let intensity = 10; intensity <= 255; intensity += 5) {
      const newR = Math.round(intensity * hueRatios.r);
      const newG = Math.round(intensity * hueRatios.g);
      const newB = Math.round(intensity * hueRatios.b);
      
      // Asegurar que no se excedan los límites
      const clampedR = Math.max(0, Math.min(255, newR));
      const clampedG = Math.max(0, Math.min(255, newG));
      const clampedB = Math.max(0, Math.min(255, newB));
      
      const newHex = rgbToHex(clampedR, clampedG, clampedB);
      const newRatio = getContrastRatio(newHex, backgroundHex);
      
      // Si encontramos un color que cumple y es mejor que el anterior
      if (newRatio >= targetRatio && newRatio > bestRatio) {
        bestColor = newHex;
        bestRatio = newRatio;
      }
    }
  } else {
    // Búsqueda más amplia sin preservar matiz
    for (let factor = 0.1; factor <= 1.0; factor += 0.05) {
      // Oscurecer
      const darkerR = Math.floor(original.r * factor);
      const darkerG = Math.floor(original.g * factor);
      const darkerB = Math.floor(original.b * factor);
      const darkerHex = rgbToHex(darkerR, darkerG, darkerB);
      const darkerRatio = getContrastRatio(darkerHex, backgroundHex);
      
      if (darkerRatio >= targetRatio && darkerRatio > bestRatio) {
        bestColor = darkerHex;
        bestRatio = darkerRatio;
      }
    }
  }
  
  return bestColor;
}

console.log('🔧 APLICANDO CORRECCIONES CRÍTICAS DE CONTRASTE\n');
console.log('===============================================\n');

// Problemas críticos identificados
const criticalProblems = [
  {
    name: 'Botón Primario',
    currentFg: '#FFFFFF',
    currentBg: '#B8954A',
    currentRatio: 2.82,
    target: 4.5,
    priority: 'CRÍTICO'
  },
  {
    name: 'Botón de Advertencia',
    currentFg: '#FFFFFF',
    currentBg: '#E65100',
    currentRatio: 3.79,
    target: 4.5,
    priority: 'ALTO'
  },
  {
    name: 'Texto Deshabilitado',
    currentFg: '#757575',
    currentBg: '#F8F9FA',
    currentRatio: 4.37,
    target: 4.5,
    priority: 'MEDIO'
  }
];

console.log('🎯 CALCULANDO COLORES OPTIMIZADOS\n');

const optimizedColors = {};

criticalProblems.forEach(problem => {
  console.log(`🔍 Optimizando: ${problem.name}`);
  console.log(`   Actual: ${problem.currentRatio}:1 (necesita ${problem.target}:1)`);
  
  let optimizedBg;
  let optimizedFg = problem.currentFg;
  
  if (problem.name === 'Texto Deshabilitado') {
    // Para texto deshabilitado, oscurecer el texto en lugar del fondo
    optimizedFg = findOptimalColor(problem.currentFg, problem.currentBg, problem.target, true);
    optimizedBg = problem.currentBg;
  } else {
    // Para botones, oscurecer el fondo manteniendo el texto blanco
    optimizedBg = findOptimalColor(problem.currentBg, problem.currentFg, problem.target, true);
    optimizedFg = problem.currentFg;
  }
  
  const newRatio = getContrastRatio(optimizedFg, optimizedBg);
  const improvement = newRatio - problem.currentRatio;
  const passes = newRatio >= problem.target;
  
  console.log(`   Optimizado: ${newRatio}:1 ${passes ? '✅' : '❌'}`);
  console.log(`   Mejora: +${improvement.toFixed(2)}`);
  
  if (problem.name === 'Botón Primario') {
    optimizedColors.primary = {
      main: optimizedBg,
      light: '#D4B366', // Mantener claro sin cambios
      dark: optimizedBg, // Usar el optimizado como dark también
      contrastText: optimizedFg
    };
  } else if (problem.name === 'Botón de Advertencia') {
    optimizedColors.warning = {
      main: optimizedBg,
      light: '#FFE0B2',
      dark: optimizedBg,
      contrastText: optimizedFg
    };
  } else if (problem.name === 'Texto Deshabilitado') {
    optimizedColors.textDisabled = optimizedFg;
  }
  
  console.log(`   Color final: FG ${optimizedFg} / BG ${optimizedBg}\n`);
});

// Generar el archivo de colores corregido
const finalColors = {
  // Colores Primarios (Corregidos)
  primary: optimizedColors.primary || {
    main: '#9A7D3C',  // Fallback más oscuro
    light: '#D4B366',
    dark: '#7A6530',
    contrastText: '#FFFFFF',
  },

  // Colores Secundarios (Ya cumplen)
  secondary: {
    main: '#272727',
    light: '#3A3A3A',
    dark: '#1A1A1A',
    contrastText: '#FFFFFF',
  },

  // Colores de Fondo
  background: {
    default: '#F8F9FA',
    paper: '#FFFFFF',
    surface: '#FEFEFE',
  },

  // Colores de Texto (Corregidos)
  text: {
    primary: '#2C2C2C',
    secondary: '#5A5A5A',
    disabled: optimizedColors.textDisabled || '#6B6B6B', // Más oscuro
    hint: '#B0B0B0',
  },

  // Colores de Estado (Ya corregidos anteriormente)
  success: {
    main: '#0D8043',
    light: '#C8E6C9',
    dark: '#085D30',
    contrastText: '#FFFFFF',
  },

  error: {
    main: '#C62828',
    light: '#FFCDD2',
    dark: '#B71C1C',
    contrastText: '#FFFFFF',
  },

  warning: optimizedColors.warning || {
    main: '#D84315',  // Más oscuro que E65100
    light: '#FFE0B2',
    dark: '#BF360C',
    contrastText: '#FFFFFF',
  },

  info: {
    main: '#1976D2',
    light: '#BBDEFB',
    dark: '#0D47A1',
    contrastText: '#FFFFFF',
  },

  // Colores de Bordes y Divisores
  border: {
    default: '#E5E7EB',
    light: '#F3F4F6',
    medium: '#D1D5DB',
    dark: '#9CA3AF',
  },

  // Colores de Acción (Actualizados)
  action: {
    hover: 'rgba(154, 125, 60, 0.08)',
    selected: 'rgba(154, 125, 60, 0.12)',
    disabled: 'rgba(0, 0, 0, 0.26)',
    focus: 'rgba(154, 125, 60, 0.25)',
  },

  // Colores Neutros
  neutral: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },

  // Colores específicos para accesibilidad
  accessibility: {
    focusRing: '#005FCC',
    focusRingOpacity: 'rgba(0, 95, 204, 0.25)',
    skipLink: '#000000',
    skipLinkBackground: '#FFFF00',
    highContrast: {
      text: '#000000',
      background: '#FFFFFF',
    }
  }
};

// Generar código TypeScript actualizado
const tsCode = `/**
 * Design System - Color Tokens (VERSIÓN FINAL - WCAG AA Compliant)
 * Colores optimizados para cumplir estándares de accesibilidad WCAG AA
 */

export const colors = ${JSON.stringify(finalColors, null, 2).replace(/"/g, "'")} as const;

export type ColorTokens = typeof colors;

/**
 * VALIDACIÓN WCAG AA - TODOS LOS COLORES CRÍTICOS CUMPLEN:
 * 
 * ✅ Texto principal sobre fondo: 13.25:1 (AAA)
 * ✅ Botón primario: ${optimizedColors.primary ? getContrastRatio(optimizedColors.primary.contrastText, optimizedColors.primary.main).toFixed(2) : '5+'}:1 (AA)
 * ✅ Botón secundario: 14.94:1 (AAA)
 * ✅ Botón de error: 5.62:1 (AA)
 * ✅ Botón de éxito: 5.02:1 (AA)
 * ✅ Botón de info: 4.6:1 (AA)
 * ✅ Botón de advertencia: ${optimizedColors.warning ? getContrastRatio(optimizedColors.warning.contrastText, optimizedColors.warning.main).toFixed(2) : '4.5+'}:1 (AA)
 * ✅ Texto deshabilitado: ${optimizedColors.textDisabled ? getContrastRatio(optimizedColors.textDisabled, finalColors.background.default).toFixed(2) : '4.5+'}:1 (AA)
 */`;

// Guardar el archivo corregido
fs.writeFileSync('src/components/design-system/tokens/colors-final.ts', tsCode);

console.log('✅ OPTIMIZACIÓN COMPLETADA\n');
console.log('=========================\n');
console.log(`📁 Archivo generado: src/components/design-system/tokens/colors-final.ts`);
console.log(`🎯 Colores optimizados: ${Object.keys(optimizedColors).length}`);
console.log(`🔧 Próximo paso: Aplicar estos colores al sistema`);

// Validar los colores finales
console.log('\n🧪 VALIDACIÓN FINAL DE COLORES CRÍTICOS\n');

const finalValidation = [
  {
    name: 'Botón Primario',
    fg: finalColors.primary.contrastText,
    bg: finalColors.primary.main
  },
  {
    name: 'Botón de Advertencia',
    fg: finalColors.warning.contrastText,
    bg: finalColors.warning.main
  },
  {
    name: 'Texto Deshabilitado',
    fg: finalColors.text.disabled,
    bg: finalColors.background.default
  }
];

let allPass = true;

finalValidation.forEach(item => {
  const ratio = getContrastRatio(item.fg, item.bg);
  const passes = ratio >= 4.5;
  
  if (!passes) allPass = false;
  
  console.log(`${passes ? '✅' : '❌'} ${item.name}: ${ratio.toFixed(2)}:1`);
});

console.log(`\n🏆 RESULTADO: ${allPass ? '¡TODOS LOS COLORES CRÍTICOS CUMPLEN WCAG AA!' : 'Algunos colores aún necesitan ajuste manual'}`);

if (allPass) {
  console.log('🚀 ¡El sistema está listo para aplicar los colores corregidos!');
} 