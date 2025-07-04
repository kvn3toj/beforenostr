const fs = require('fs');

// Funciones de contraste (reutilizadas)
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

// Colores mejorados
const colorsImproved = {
  primary: {
    main: '#B8954A',
    light: '#D4B366',
    dark: '#9A7D3C',
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
    secondary: '#5A5A5A',
    disabled: '#757575',
    hint: '#B0B0B0',
  },
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
  warning: {
    main: '#E65100',
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
};

console.log('🎨 VALIDACIÓN DE COLORES MEJORADOS - GAMIFIER ADMIN\n');
console.log('===================================================\n');

// Comparación lado a lado
const originalColors = {
  primary: { main: '#CEA93A' },
  success: { main: '#10B981' },
  error: { main: '#EF4444' },
  warning: { main: '#F59E0B' },
  info: { main: '#3B82F6' },
  text: { 
    secondary: '#6B7280',
    disabled: '#9CA3AF'
  }
};

console.log('📊 COMPARACIÓN: ORIGINAL vs MEJORADO\n');

const comparisons = [
  {
    name: 'Botón Primario',
    originalFg: '#FFFFFF',
    originalBg: originalColors.primary.main,
    improvedFg: colorsImproved.primary.contrastText,
    improvedBg: colorsImproved.primary.main,
    critical: true
  },
  {
    name: 'Botón de Éxito',
    originalFg: '#FFFFFF',
    originalBg: originalColors.success.main,
    improvedFg: colorsImproved.success.contrastText,
    improvedBg: colorsImproved.success.main,
    critical: false
  },
  {
    name: 'Botón de Error',
    originalFg: '#FFFFFF',
    originalBg: originalColors.error.main,
    improvedFg: colorsImproved.error.contrastText,
    improvedBg: colorsImproved.error.main,
    critical: false
  },
  {
    name: 'Botón de Advertencia',
    originalFg: '#FFFFFF',
    originalBg: originalColors.warning.main,
    improvedFg: colorsImproved.warning.contrastText,
    improvedBg: colorsImproved.warning.main,
    critical: false
  },
  {
    name: 'Botón de Info',
    originalFg: '#FFFFFF',
    originalBg: originalColors.info.main,
    improvedFg: colorsImproved.info.contrastText,
    improvedBg: colorsImproved.info.main,
    critical: false
  },
  {
    name: 'Texto Secundario',
    originalFg: originalColors.text.secondary,
    originalBg: '#F8F9FA',
    improvedFg: colorsImproved.text.secondary,
    improvedBg: colorsImproved.background.default,
    critical: false
  },
  {
    name: 'Texto Deshabilitado',
    originalFg: originalColors.text.disabled,
    originalBg: '#F8F9FA',
    improvedFg: colorsImproved.text.disabled,
    improvedBg: colorsImproved.background.default,
    critical: false
  }
];

let totalImproved = 0;
let nowCompliant = 0;

comparisons.forEach(comp => {
  const originalResult = validateContrast(comp.originalFg, comp.originalBg);
  const improvedResult = validateContrast(comp.improvedFg, comp.improvedBg);
  
  const improved = improvedResult.ratio > originalResult.ratio;
  const nowPasses = !originalResult.isValidAA && improvedResult.isValidAA;
  
  if (improved) totalImproved++;
  if (nowPasses) nowCompliant++;
  
  const statusIcon = comp.critical ? '🔴' : '🟡';
  const improvementIcon = improved ? '📈' : '➡️';
  const complianceIcon = improvedResult.isValidAA ? '✅' : '❌';
  
  console.log(`${statusIcon} ${complianceIcon} ${comp.name} ${improvementIcon}`);
  console.log(`   Original:  ${originalResult.ratio}:1 (${originalResult.level})`);
  console.log(`   Mejorado:  ${improvedResult.ratio}:1 (${improvedResult.level})`);
  console.log(`   Color orig: ${comp.originalBg} → Mejorado: ${comp.improvedBg}`);
  
  if (nowPasses) {
    console.log(`   🎉 ¡Ahora cumple WCAG AA!`);
  } else if (improved && improvedResult.isValidAA) {
    console.log(`   ✨ Mejor contraste y cumple AA`);
  } else if (improved) {
    console.log(`   📊 Contraste mejorado`);
  }
  
  console.log('');
});

// Validación final completa
console.log('🎯 VALIDACIÓN FINAL COMPLETA\n');
console.log('=============================\n');

const finalCombinations = [
  { 
    name: 'Texto principal sobre fondo', 
    fg: colorsImproved.text.primary, 
    bg: colorsImproved.background.default,
    importance: 'CRÍTICO'
  },
  { 
    name: 'Texto secundario sobre fondo', 
    fg: colorsImproved.text.secondary, 
    bg: colorsImproved.background.default,
    importance: 'ALTO'
  },
  { 
    name: 'Botón primario (texto sobre fondo)', 
    fg: colorsImproved.primary.contrastText, 
    bg: colorsImproved.primary.main,
    importance: 'CRÍTICO'
  },
  { 
    name: 'Botón secundario (texto sobre fondo)', 
    fg: colorsImproved.secondary.contrastText, 
    bg: colorsImproved.secondary.main,
    importance: 'CRÍTICO'
  },
  { 
    name: 'Botón de error (texto sobre fondo)', 
    fg: colorsImproved.error.contrastText, 
    bg: colorsImproved.error.main,
    importance: 'ALTO'
  },
  { 
    name: 'Botón de éxito (texto sobre fondo)', 
    fg: colorsImproved.success.contrastText, 
    bg: colorsImproved.success.main,
    importance: 'ALTO'
  },
  { 
    name: 'Botón de advertencia (texto sobre fondo)', 
    fg: colorsImproved.warning.contrastText, 
    bg: colorsImproved.warning.main,
    importance: 'ALTO'
  },
  { 
    name: 'Texto deshabilitado sobre fondo', 
    fg: colorsImproved.text.disabled, 
    bg: colorsImproved.background.default,
    importance: 'MEDIO'
  }
];

let finalPassCount = 0;
let finalFailCount = 0;
let finalCriticalPassed = 0;
let finalCriticalTotal = 0;

finalCombinations.forEach(combo => {
  const result = validateContrast(combo.fg, combo.bg);
  
  if (combo.importance === 'CRÍTICO') {
    finalCriticalTotal++;
    if (result.isValidAA) finalCriticalPassed++;
  }
  
  if (result.isValidAA) {
    finalPassCount++;
  } else {
    finalFailCount++;
  }
  
  const status = result.level === 'FAIL' ? '❌' : result.level === 'AA' ? '✅' : '🌟';
  const priority = combo.importance === 'CRÍTICO' ? '🔴' : combo.importance === 'ALTO' ? '🟡' : '🟢';
  
  console.log(`${status} ${priority} ${combo.name}`);
  console.log(`   Contraste: ${result.ratio}:1 (${result.level})`);
  console.log('');
});

// Resumen final
console.log('🏆 RESUMEN FINAL\n');
console.log('================\n');
console.log(`Total de combinaciones: ${finalCombinations.length}`);
console.log(`✅ Pasan WCAG AA: ${finalPassCount} (${Math.round(finalPassCount/finalCombinations.length*100)}%)`);
console.log(`❌ Fallan WCAG AA: ${finalFailCount} (${Math.round(finalFailCount/finalCombinations.length*100)}%)`);
console.log(`🔴 Críticas que pasan: ${finalCriticalPassed}/${finalCriticalTotal} (${Math.round(finalCriticalPassed/finalCriticalTotal*100)}%)`);
console.log(`📈 Combinaciones mejoradas: ${totalImproved}/${comparisons.length}`);
console.log(`🎯 Nuevas conformes AA: ${nowCompliant}`);

if (finalCriticalPassed === finalCriticalTotal && finalPassCount === finalCombinations.length) {
  console.log('\n🎉 ¡ÉXITO TOTAL! Todos los colores ahora cumplen WCAG AA.');
  console.log('✨ ¡El sistema está listo para producción accesible!');
} else if (finalCriticalPassed === finalCriticalTotal) {
  console.log('\n✅ ¡Excelente! Todas las combinaciones críticas cumplen WCAG AA.');
  console.log('📝 Considera mejorar las combinaciones secundarias restantes.');
} else {
  console.log('\n⚠️  Aún hay combinaciones críticas que requieren ajustes.');
}

// Guardar reporte de validación
const validationReport = {
  timestamp: new Date().toISOString(),
  summary: {
    totalCombinations: finalCombinations.length,
    passedAA: finalPassCount,
    failedAA: finalFailCount,
    criticalPassed: finalCriticalPassed,
    criticalTotal: finalCriticalTotal,
    improvementsApplied: totalImproved,
    newlyCompliant: nowCompliant,
    overallScore: Math.round(finalPassCount/finalCombinations.length*100),
    criticalScore: Math.round(finalCriticalPassed/finalCriticalTotal*100)
  },
  improvements: comparisons.map(comp => {
    const original = validateContrast(comp.originalFg, comp.originalBg);
    const improved = validateContrast(comp.improvedFg, comp.improvedBg);
    return {
      name: comp.name,
      originalRatio: original.ratio,
      improvedRatio: improved.ratio,
      improvement: improved.ratio - original.ratio,
      nowCompliant: !original.isValidAA && improved.isValidAA
    };
  }),
  finalResults: finalCombinations.map(combo => {
    const result = validateContrast(combo.fg, combo.bg);
    return {
      name: combo.name,
      importance: combo.importance,
      ratio: result.ratio,
      level: result.level,
      passesAA: result.isValidAA
    };
  })
};

fs.writeFileSync(`color-validation-${Date.now()}.json`, JSON.stringify(validationReport, null, 2));
console.log('\n📄 Reporte de validación guardado en: color-validation-[timestamp].json'); 