// Validación rápida de los colores finales ajustados
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

console.log('🔍 VALIDACIÓN FINAL - COLORES AJUSTADOS\n');

// Colores finales ajustados
const tests = [
  { name: 'Botón primario', fg: '#FFFFFF', bg: '#8F6E35' },
  { name: 'Botón de advertencia', fg: '#FFFFFF', bg: '#B84A00' },
  { name: 'Texto de pistas', fg: '#6B6B6B', bg: '#F8F9FA' },
  { name: 'Texto principal', fg: '#2C2C2C', bg: '#F8F9FA' },
  { name: 'Botón secundario', fg: '#FFFFFF', bg: '#272727' }
];

let allPass = true;

tests.forEach(test => {
  const ratio = getContrastRatio(test.fg, test.bg);
  const passes = ratio >= 4.5;
  
  if (!passes) allPass = false;
  
  console.log(`${passes ? '✅' : '❌'} ${test.name}: ${ratio.toFixed(2)}:1 ${passes ? '(PASA AA)' : '(FALLA AA)'}`);
});

console.log(`\n🏆 RESULTADO FINAL: ${allPass ? '¡TODOS LOS COLORES CUMPLEN WCAG AA!' : 'Algunos colores necesitan más ajustes'}`);

if (allPass) {
  console.log('🎉 ¡ÉXITO! Fase 3.1 (Contraste) COMPLETADA');
  console.log('📋 Listos para continuar con Focus Management');
} 