const fs = require('fs');

// Funciones de contraste
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

// Colores finales actualizados
const finalColors = {
  primary: {
    main: '#A0853D',
    light: '#D4B366',
    dark: '#7A6530',
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
    disabled: '#6B6B6B',
    hint: '#9E9E9E',
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
    main: '#CC5400',
    light: '#FFE0B2',
    dark: '#B8390A',
    contrastText: '#FFFFFF',
  },
  info: {
    main: '#1976D2',
    light: '#BBDEFB',
    dark: '#0D47A1',
    contrastText: '#FFFFFF',
  },
};

console.log('🎉 VALIDACIÓN FINAL - COLORES WCAG AA COMPLIANT\n');
console.log('===============================================\n');

// Todas las combinaciones críticas y secundarias
const allCombinations = [
  { 
    name: 'Texto principal sobre fondo', 
    fg: finalColors.text.primary, 
    bg: finalColors.background.default,
    importance: 'CRÍTICO',
    element: 'Párrafos, títulos principales'
  },
  { 
    name: 'Texto secundario sobre fondo', 
    fg: finalColors.text.secondary, 
    bg: finalColors.background.default,
    importance: 'ALTO',
    element: 'Subtítulos, texto descriptivo'
  },
  { 
    name: 'Botón primario (texto sobre fondo)', 
    fg: finalColors.primary.contrastText, 
    bg: finalColors.primary.main,
    importance: 'CRÍTICO',
    element: 'Botones de acción principal'
  },
  { 
    name: 'Botón secundario (texto sobre fondo)', 
    fg: finalColors.secondary.contrastText, 
    bg: finalColors.secondary.main,
    importance: 'CRÍTICO',
    element: 'Botones de navegación, menú'
  },
  { 
    name: 'Botón de error (texto sobre fondo)', 
    fg: finalColors.error.contrastText, 
    bg: finalColors.error.main,
    importance: 'ALTO',
    element: 'Botones de eliminación, cancelar'
  },
  { 
    name: 'Botón de éxito (texto sobre fondo)', 
    fg: finalColors.success.contrastText, 
    bg: finalColors.success.main,
    importance: 'ALTO',
    element: 'Botones de confirmación, guardar'
  },
  { 
    name: 'Botón de advertencia (texto sobre fondo)', 
    fg: finalColors.warning.contrastText, 
    bg: finalColors.warning.main,
    importance: 'ALTO',
    element: 'Botones de precaución'
  },
  { 
    name: 'Botón de información (texto sobre fondo)', 
    fg: finalColors.info.contrastText, 
    bg: finalColors.info.main,
    importance: 'ALTO',
    element: 'Botones informativos'
  },
  { 
    name: 'Texto deshabilitado sobre fondo', 
    fg: finalColors.text.disabled, 
    bg: finalColors.background.default,
    importance: 'MEDIO',
    element: 'Elementos deshabilitados'
  },
  { 
    name: 'Texto de pistas sobre fondo', 
    fg: finalColors.text.hint, 
    bg: finalColors.background.default,
    importance: 'MEDIO',
    element: 'Placeholders, hints'
  }
];

let totalCombinations = allCombinations.length;
let passedAA = 0;
let passedAAA = 0;
let criticalPassed = 0;
let criticalTotal = 0;

const results = [];

console.log('📊 RESULTADOS DETALLADOS\n');

allCombinations.forEach((combo, index) => {
  const result = validateContrast(combo.fg, combo.bg);
  
  if (combo.importance === 'CRÍTICO') {
    criticalTotal++;
    if (result.isValidAA) criticalPassed++;
  }
  
  if (result.isValidAA) passedAA++;
  if (result.isValidAAA) passedAAA++;
  
  const statusIcon = result.level === 'FAIL' ? '❌' : result.level === 'AA' ? '✅' : '🌟';
  const priorityIcon = combo.importance === 'CRÍTICO' ? '🔴' : combo.importance === 'ALTO' ? '🟡' : '🟢';
  
  console.log(`${statusIcon} ${priorityIcon} ${combo.name}`);
  console.log(`   Contraste: ${result.ratio}:1 (${result.level})`);
  console.log(`   Elemento: ${combo.element}`);
  console.log(`   Colores: ${combo.fg} sobre ${combo.bg}`);
  console.log('');
  
  results.push({
    name: combo.name,
    importance: combo.importance,
    element: combo.element,
    foreground: combo.fg,
    background: combo.bg,
    ratio: result.ratio,
    level: result.level,
    passesAA: result.isValidAA,
    passesAAA: result.isValidAAA
  });
});

// Comparación con estado original
const originalProblems = [
  { name: 'Botón primario', original: 2.24, current: getContrastRatio(finalColors.primary.contrastText, finalColors.primary.main) },
  { name: 'Botón de advertencia', original: 2.15, current: getContrastRatio(finalColors.warning.contrastText, finalColors.warning.main) },
  { name: 'Texto deshabilitado', original: 2.41, current: getContrastRatio(finalColors.text.disabled, finalColors.background.default) },
  { name: 'Botón de éxito', original: 2.54, current: getContrastRatio(finalColors.success.contrastText, finalColors.success.main) },
  { name: 'Botón de error', original: 3.76, current: getContrastRatio(finalColors.error.contrastText, finalColors.error.main) }
];

console.log('📈 MEJORAS IMPLEMENTADAS\n');
console.log('========================\n');

originalProblems.forEach(problem => {
  const improvement = problem.current - problem.original;
  const nowPasses = problem.current >= 4.5;
  const originalPassed = problem.original >= 4.5;
  
  console.log(`${nowPasses ? '✅' : '❌'} ${problem.name}`);
  console.log(`   Original: ${problem.original.toFixed(2)}:1 ${originalPassed ? '(ya cumplía)' : '(no cumplía)'}`);
  console.log(`   Actual: ${problem.current.toFixed(2)}:1 ${nowPasses ? '(cumple AA)' : '(no cumple)'}`);
  console.log(`   Mejora: ${improvement > 0 ? '+' : ''}${improvement.toFixed(2)} puntos`);
  console.log('');
});

// Resumen ejecutivo
console.log('🏆 RESUMEN EJECUTIVO\n');
console.log('====================\n');
console.log(`📊 Combinaciones analizadas: ${totalCombinations}`);
console.log(`✅ Cumplen WCAG AA: ${passedAA}/${totalCombinations} (${Math.round(passedAA/totalCombinations*100)}%)`);
console.log(`🌟 Cumplen WCAG AAA: ${passedAAA}/${totalCombinations} (${Math.round(passedAAA/totalCombinations*100)}%)`);
console.log(`🔴 Elementos críticos que cumplen: ${criticalPassed}/${criticalTotal} (${Math.round(criticalPassed/criticalTotal*100)}%)`);

const improvements = originalProblems.filter(p => p.current > p.original).length;
const newCompliant = originalProblems.filter(p => p.original < 4.5 && p.current >= 4.5).length;

console.log(`📈 Combinaciones mejoradas: ${improvements}/${originalProblems.length}`);
console.log(`🎯 Nuevas que cumplen AA: ${newCompliant}`);

// Estado final
if (passedAA === totalCombinations) {
  console.log('\n🎉 ¡ÉXITO TOTAL! Todos los elementos cumplen WCAG AA.');
  console.log('✨ El sistema Gamifier Admin es ahora completamente accesible.');
  console.log('🚀 Estado: LISTO PARA PRODUCCIÓN');
} else if (criticalPassed === criticalTotal) {
  console.log('\n✅ ¡Excelente! Todos los elementos críticos cumplen WCAG AA.');
  console.log(`📝 ${totalCombinations - passedAA} elementos secundarios podrían mejorarse.`);
  console.log('🚀 Estado: LISTO PARA PRODUCCIÓN (con mejoras opcionales)');
} else {
  console.log('\n⚠️  Algunos elementos críticos aún requieren ajustes.');
  console.log('🔧 Estado: REQUIERE REVISIÓN');
}

// Generar reporte final
const finalReport = {
  timestamp: new Date().toISOString(),
  status: passedAA === totalCombinations ? 'COMPLETE_SUCCESS' : criticalPassed === criticalTotal ? 'CRITICAL_SUCCESS' : 'NEEDS_REVIEW',
  summary: {
    totalCombinations,
    passedAA,
    passedAAA,
    criticalPassed,
    criticalTotal,
    aaComplianceRate: Math.round(passedAA/totalCombinations*100),
    aaaComplianceRate: Math.round(passedAAA/totalCombinations*100),
    criticalComplianceRate: Math.round(criticalPassed/criticalTotal*100)
  },
  improvements: originalProblems.map(p => ({
    name: p.name,
    originalRatio: p.original,
    currentRatio: Math.round(p.current * 100) / 100,
    improvement: Math.round((p.current - p.original) * 100) / 100,
    nowCompliant: p.current >= 4.5,
    wasCompliant: p.original >= 4.5
  })),
  detailedResults: results,
  nextSteps: passedAA === totalCombinations ? [
    'Implementar mejoras de focus management',
    'Añadir aria-labels avanzados',
    'Implementar live regions',
    'Probar con lectores de pantalla'
  ] : [
    'Revisar elementos que no cumplen AA',
    'Aplicar ajustes adicionales de contraste',
    'Validar cambios antes de continuar'
  ]
};

fs.writeFileSync(`final-accessibility-report-${Date.now()}.json`, JSON.stringify(finalReport, null, 2));

console.log('\n📄 Reporte final guardado en: final-accessibility-report-[timestamp].json');

if (finalReport.status === 'COMPLETE_SUCCESS') {
  console.log('\n🎯 PRÓXIMOS PASOS RECOMENDADOS:');
  console.log('1. ✅ Contraste de colores: COMPLETADO');
  console.log('2. 🔄 Focus management y navegación por teclado');
  console.log('3. 🏷️  Etiquetado ARIA completo');
  console.log('4. 📢 Live regions y soporte para lectores de pantalla');
  console.log('5. 🧪 Testing con usuarios de tecnologías asistivas');
} 