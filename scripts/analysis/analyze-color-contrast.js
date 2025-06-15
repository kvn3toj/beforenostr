const fs = require('fs');

// Simulación de las funciones de contraste (versión simplificada para Node.js)
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
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

function validateContrast(foreground, background, isLargeText = false) {
  const ratio = getContrastRatio(foreground, background);
  const minRatioAA = isLargeText ? 3 : 4.5;
  const minRatioAAA = isLargeText ? 4.5 : 7;
  
  const isValidAA = ratio >= minRatioAA;
  const isValidAAA = ratio >= minRatioAAA;
  
  let level;
  if (isValidAAA) {
    level = 'AAA';
  } else if (isValidAA) {
    level = 'AA';
  } else {
    level = 'FAIL';
  }
  
  return {
    ratio: Math.round(ratio * 100) / 100,
    isValidAA,
    isValidAAA,
    level
  };
}

// Colores actuales del sistema
const colors = {
  primary: {
    main: '#CEA93A',
    light: '#E4C373',
    dark: '#B8954A',
    contrastText: '#FFFFFF',
  },
  secondary: {
    main: '#272727',
    light: '#3A3A3A',
    dark: '#1A1A1A',
    contrastText: '#FFFFFF',
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
    hint: '#D1D5DB',
  },
  success: {
    main: '#10B981',
    light: '#D1FAE5',
    dark: '#059669',
    contrastText: '#FFFFFF',
  },
  error: {
    main: '#EF4444',
    light: '#FEE2E2',
    dark: '#DC2626',
    contrastText: '#FFFFFF',
  },
  warning: {
    main: '#F59E0B',
    light: '#FEF3C7',
    dark: '#D97706',
    contrastText: '#FFFFFF',
  },
  info: {
    main: '#3B82F6',
    light: '#DBEAFE',
    dark: '#1D4ED8',
    contrastText: '#FFFFFF',
  },
};

console.log('🎨 ANÁLISIS DE CONTRASTE DE COLORES - GAMIFIER ADMIN\n');
console.log('================================================\n');

// Combinaciones críticas para analizar
const criticalCombinations = [
  { 
    name: 'Texto principal sobre fondo', 
    fg: colors.text.primary, 
    bg: colors.background.default,
    importance: 'CRÍTICO'
  },
  { 
    name: 'Texto secundario sobre fondo', 
    fg: colors.text.secondary, 
    bg: colors.background.default,
    importance: 'ALTO'
  },
  { 
    name: 'Botón primario (texto sobre fondo)', 
    fg: colors.primary.contrastText, 
    bg: colors.primary.main,
    importance: 'CRÍTICO'
  },
  { 
    name: 'Botón secundario (texto sobre fondo)', 
    fg: colors.secondary.contrastText, 
    bg: colors.secondary.main,
    importance: 'CRÍTICO'
  },
  { 
    name: 'Botón de error (texto sobre fondo)', 
    fg: colors.error.contrastText, 
    bg: colors.error.main,
    importance: 'ALTO'
  },
  { 
    name: 'Botón de éxito (texto sobre fondo)', 
    fg: colors.success.contrastText, 
    bg: colors.success.main,
    importance: 'ALTO'
  },
  { 
    name: 'Botón de advertencia (texto sobre fondo)', 
    fg: colors.warning.contrastText, 
    bg: colors.warning.main,
    importance: 'ALTO'
  },
  { 
    name: 'Texto deshabilitado sobre fondo', 
    fg: colors.text.disabled, 
    bg: colors.background.default,
    importance: 'MEDIO'
  }
];

let passCount = 0;
let failCount = 0;
let totalCritical = 0;
let passedCritical = 0;

const results = [];

criticalCombinations.forEach(combo => {
  const result = validateContrast(combo.fg, combo.bg);
  
  if (combo.importance === 'CRÍTICO') {
    totalCritical++;
    if (result.isValidAA) passedCritical++;
  }
  
  if (result.isValidAA) {
    passCount++;
  } else {
    failCount++;
  }
  
  const status = result.level === 'FAIL' ? '❌' : result.level === 'AA' ? '✅' : '🌟';
  const priority = combo.importance === 'CRÍTICO' ? '🔴' : combo.importance === 'ALTO' ? '🟡' : '🟢';
  
  console.log(`${status} ${priority} ${combo.name}`);
  console.log(`   Contraste: ${result.ratio}:1 (${result.level})`);
  console.log(`   Foreground: ${combo.fg} | Background: ${combo.bg}`);
  console.log(`   AA: ${result.isValidAA ? 'PASA' : 'FALLA'} | AAA: ${result.isValidAAA ? 'PASA' : 'FALLA'}\n`);
  
  results.push({
    name: combo.name,
    importance: combo.importance,
    foreground: combo.fg,
    background: combo.bg,
    ratio: result.ratio,
    level: result.level,
    passesAA: result.isValidAA,
    passesAAA: result.isValidAAA
  });
});

// Resumen
console.log('📊 RESUMEN DEL ANÁLISIS\n');
console.log('========================\n');
console.log(`Total de combinaciones analizadas: ${criticalCombinations.length}`);
console.log(`✅ Pasaron WCAG AA: ${passCount} (${Math.round(passCount/criticalCombinations.length*100)}%)`);
console.log(`❌ Fallaron WCAG AA: ${failCount} (${Math.round(failCount/criticalCombinations.length*100)}%)`);
console.log(`🔴 Combinaciones críticas que pasaron: ${passedCritical}/${totalCritical} (${Math.round(passedCritical/totalCritical*100)}%)\n`);

// Recomendaciones
console.log('💡 RECOMENDACIONES INMEDIATAS\n');
console.log('==============================\n');

const failedCritical = results.filter(r => r.importance === 'CRÍTICO' && !r.passesAA);
const failedOthers = results.filter(r => r.importance !== 'CRÍTICO' && !r.passesAA);

if (failedCritical.length > 0) {
  console.log('🚨 PROBLEMAS CRÍTICOS (Requieren acción inmediata):');
  failedCritical.forEach(result => {
    console.log(`   • ${result.name}: ${result.ratio}:1 (necesita ${4.5}:1 mínimo)`);
  });
  console.log('');
}

if (failedOthers.length > 0) {
  console.log('⚠️  PROBLEMAS SECUNDARIOS (Mejoras recomendadas):');
  failedOthers.forEach(result => {
    console.log(`   • ${result.name}: ${result.ratio}:1 (necesita ${4.5}:1 mínimo)`);
  });
  console.log('');
}

// Generar reporte JSON para uso programático
const report = {
  timestamp: new Date().toISOString(),
  summary: {
    total: criticalCombinations.length,
    passed: passCount,
    failed: failCount,
    criticalPassed: passedCritical,
    criticalTotal: totalCritical,
    overallScore: Math.round(passCount/criticalCombinations.length*100),
    criticalScore: Math.round(passedCritical/totalCritical*100)
  },
  results: results,
  recommendations: {
    critical: failedCritical,
    secondary: failedOthers
  }
};

fs.writeFileSync(`contrast-analysis-${Date.now()}.json`, JSON.stringify(report, null, 2));

console.log('📄 Reporte detallado guardado en: contrast-analysis-[timestamp].json\n');

if (passedCritical === totalCritical) {
  console.log('🎉 ¡Excelente! Todas las combinaciones críticas pasan WCAG AA.');
} else {
  console.log('🔧 Se requieren ajustes en los colores críticos para cumplir WCAG AA.');
} 