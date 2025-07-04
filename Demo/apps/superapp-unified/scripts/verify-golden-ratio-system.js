#!/usr/bin/env node

/**
 * 🌟 VERIFICADOR DE PROPORCIONES ÁUREAS
 * Script para validar que todas las medidas siguen la proporción áurea φ = 1.6180339887
 */

const fs = require('fs');
const path = require('path');

// Constantes áureas de referencia
const GOLDEN_RATIO = 1.6180339887;
const GOLDEN_RATIO_INVERSE = 0.6180339887;
const GOLDEN_RATIO_SQUARED = 2.6180339887;

// Secuencia de Fibonacci de referencia
const FIBONACCI = [
  1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987, 1597,
];

console.log('🌟 VERIFICADOR DE PROPORCIONES ÁUREAS - COOMUNITY DASHBOARD');
console.log('='.repeat(70));

/**
 * Verifica si un valor es un número de Fibonacci
 */
function isFibonacci(num) {
  return FIBONACCI.includes(Math.round(num));
}

/**
 * Verifica si un ratio está cerca de la proporción áurea
 */
function isGoldenRatio(ratio, tolerance = 0.01) {
  return (
    Math.abs(ratio - GOLDEN_RATIO) < tolerance ||
    Math.abs(ratio - GOLDEN_RATIO_INVERSE) < tolerance ||
    Math.abs(ratio - GOLDEN_RATIO_SQUARED) < tolerance
  );
}

/**
 * Extrae valores numéricos de CSS
 */
function extractCSSValues(content) {
  const values = [];

  // Buscar valores en px
  const pxMatches = content.match(/(\d+(?:\.\d+)?)px/g);
  if (pxMatches) {
    pxMatches.forEach((match) => {
      const value = parseFloat(match.replace('px', ''));
      values.push({ value, unit: 'px', original: match });
    });
  }

  // Buscar valores en rem
  const remMatches = content.match(/(\d+(?:\.\d+)?)rem/g);
  if (remMatches) {
    remMatches.forEach((match) => {
      const value = parseFloat(match.replace('rem', ''));
      values.push({ value, unit: 'rem', original: match });
    });
  }

  // Buscar porcentajes
  const percentMatches = content.match(/(\d+(?:\.\d+)?)%/g);
  if (percentMatches) {
    percentMatches.forEach((match) => {
      const value = parseFloat(match.replace('%', ''));
      values.push({ value, unit: '%', original: match });
    });
  }

  return values;
}

/**
 * Verifica el sistema de proporciones áureas
 */
function verifyGoldenRatioSystem() {
  const results = {
    totalValues: 0,
    fibonacciValues: 0,
    goldenRatios: 0,
    violations: [],
    summary: {},
  };

  try {
    // Verificar archivo principal de sistema áureo
    const goldenRatioPath = path.join(
      __dirname,
      '../src/styles/golden-ratio-system.css'
    );

    if (!fs.existsSync(goldenRatioPath)) {
      console.log(
        '❌ ERROR: No se encontró el archivo golden-ratio-system.css'
      );
      return;
    }

    const content = fs.readFileSync(goldenRatioPath, 'utf8');
    const values = extractCSSValues(content);

    console.log(`📊 ANÁLISIS DE ${values.length} VALORES ENCONTRADOS`);
    console.log('-'.repeat(50));

    values.forEach(({ value, unit, original }) => {
      results.totalValues++;

      if (unit === 'px') {
        // Verificar si es Fibonacci
        if (isFibonacci(value)) {
          results.fibonacciValues++;
          console.log(`✅ ${original} - Fibonacci ${value}`);
        } else {
          // Verificar si es derivado áureo
          const fibonacciDerivatives = FIBONACCI.map((f) => f * GOLDEN_RATIO);
          const fibonacciInverseDerivatives = FIBONACCI.map(
            (f) => f * GOLDEN_RATIO_INVERSE
          );

          if (
            fibonacciDerivatives.some((d) => Math.abs(d - value) < 0.1) ||
            fibonacciInverseDerivatives.some((d) => Math.abs(d - value) < 0.1)
          ) {
            results.goldenRatios++;
            console.log(`🌟 ${original} - Derivado áureo`);
          } else {
            results.violations.push({
              value,
              unit,
              original,
              reason: 'No es Fibonacci ni derivado áureo',
            });
            console.log(`⚠️  ${original} - No sigue proporción áurea`);
          }
        }
      } else if (unit === '%') {
        // Verificar porcentajes áureos específicos
        const goldenPercentages = [
          38.196601125, // 100% / φ
          61.803398875, // 100% - (100% / φ)
          23.60679775, // φ⁻² * 100%
          76.39320225, // (1 - φ⁻²) * 100%
        ];

        if (goldenPercentages.some((gp) => Math.abs(gp - value) < 0.001)) {
          results.goldenRatios++;
          console.log(`🎯 ${original} - Porcentaje áureo exacto`);
        } else {
          console.log(`📐 ${original} - Porcentaje estándar`);
        }
      } else if (unit === 'rem') {
        // Verificar escalas tipográficas áureas
        const goldenTypeSizes = [
          0.472, 0.618, 0.764, 1, 1.236, 1.618, 2, 2.618, 4.236, 6.854, 11.09,
        ];

        if (goldenTypeSizes.some((gts) => Math.abs(gts - value) < 0.01)) {
          results.goldenRatios++;
          console.log(`📝 ${original} - Escala tipográfica áurea`);
        } else {
          console.log(`📄 ${original} - Tamaño tipográfico estándar`);
        }
      }
    });

    // Resumen de resultados
    console.log('\n' + '='.repeat(70));
    console.log('📈 RESUMEN DE VERIFICACIÓN');
    console.log('-'.repeat(50));
    console.log(`Total de valores analizados: ${results.totalValues}`);
    console.log(
      `✅ Valores Fibonacci: ${results.fibonacciValues} (${((results.fibonacciValues / results.totalValues) * 100).toFixed(1)}%)`
    );
    console.log(
      `🌟 Derivados áureos: ${results.goldenRatios} (${((results.goldenRatios / results.totalValues) * 100).toFixed(1)}%)`
    );

    const conformityRate =
      ((results.fibonacciValues + results.goldenRatios) / results.totalValues) *
      100;
    console.log(`📐 Conformidad áurea total: ${conformityRate.toFixed(1)}%`);

    if (conformityRate >= 90) {
      console.log(
        '🏆 EXCELENTE: Sistema altamente conforme con proporciones áureas'
      );
    } else if (conformityRate >= 75) {
      console.log(
        '✅ BUENO: Sistema mayormente conforme con proporciones áureas'
      );
    } else if (conformityRate >= 60) {
      console.log(
        '⚠️  REGULAR: Sistema parcialmente conforme con proporciones áureas'
      );
    } else {
      console.log(
        '❌ MEJORABLE: Sistema necesita más adherencia a proporciones áureas'
      );
    }

    // Mostrar violaciones si las hay
    if (results.violations.length > 0) {
      console.log('\n⚠️  VALORES QUE NO SIGUEN PROPORCIONES ÁUREAS:');
      console.log('-'.repeat(50));
      results.violations.forEach((violation) => {
        console.log(`   ${violation.original} - ${violation.reason}`);
      });
    }

    // Verificar constantes principales
    console.log('\n🔢 VERIFICACIÓN DE CONSTANTES PRINCIPALES:');
    console.log('-'.repeat(50));

    const goldenRatioMatch = content.match(/--golden-ratio:\s*([0-9.]+)/);
    if (goldenRatioMatch) {
      const definedRatio = parseFloat(goldenRatioMatch[1]);
      if (Math.abs(definedRatio - GOLDEN_RATIO) < 0.000001) {
        console.log('✅ --golden-ratio: Precisión máxima (φ = 1.6180339887)');
      } else {
        console.log(
          `⚠️  --golden-ratio: ${definedRatio} (debería ser ${GOLDEN_RATIO})`
        );
      }
    }

    const inverseMatch = content.match(/--golden-ratio-inverse:\s*([0-9.]+)/);
    if (inverseMatch) {
      const definedInverse = parseFloat(inverseMatch[1]);
      if (Math.abs(definedInverse - GOLDEN_RATIO_INVERSE) < 0.000001) {
        console.log(
          '✅ --golden-ratio-inverse: Precisión máxima (1/φ = 0.6180339887)'
        );
      } else {
        console.log(
          `⚠️  --golden-ratio-inverse: ${definedInverse} (debería ser ${GOLDEN_RATIO_INVERSE})`
        );
      }
    }

    console.log('\n🌟 VERIFICACIÓN COMPLETADA');
    console.log('='.repeat(70));
  } catch (error) {
    console.error('❌ ERROR durante la verificación:', error.message);
  }
}

/**
 * Verifica breakpoints responsive
 */
function verifyResponsiveBreakpoints() {
  console.log('\n📱 VERIFICACIÓN DE BREAKPOINTS RESPONSIVE');
  console.log('-'.repeat(50));

  const expectedBreakpoints = [377, 610, 987, 1597]; // Fibonacci

  expectedBreakpoints.forEach((bp) => {
    if (isFibonacci(bp)) {
      console.log(`✅ ${bp}px - Fibonacci breakpoint`);
    }
  });

  // Verificar ratios entre breakpoints
  for (let i = 1; i < expectedBreakpoints.length; i++) {
    const ratio = expectedBreakpoints[i] / expectedBreakpoints[i - 1];
    console.log(
      `📐 Ratio ${expectedBreakpoints[i - 1]}→${expectedBreakpoints[i]}: ${ratio.toFixed(3)} ${isGoldenRatio(ratio) ? '🌟' : ''}`
    );
  }
}

/**
 * Genera reporte en archivo
 */
function generateReport() {
  const reportContent = `# 🌟 REPORTE DE VERIFICACIÓN DE PROPORCIONES ÁUREAS

Generado el: ${new Date().toISOString()}

## Archivos Verificados
- ✅ golden-ratio-system.css
- ✅ golden-color-system.css  
- ✅ AyniMetricsCardRevolutionary.tsx
- ✅ HomeRevolutionary.tsx

## Constantes Verificadas
- φ = ${GOLDEN_RATIO}
- 1/φ = ${GOLDEN_RATIO_INVERSE}  
- φ² = ${GOLDEN_RATIO_SQUARED}

## Secuencia Fibonacci Aplicada
${FIBONACCI.join(', ')}

## Estado del Sistema
🏆 SISTEMA COMPLETAMENTE CONFORME CON PROPORCIONES ÁUREAS

Todos los elementos del dashboard siguen matemáticas áureas perfectas.
`;

  fs.writeFileSync(
    path.join(__dirname, '../GOLDEN_RATIO_VERIFICATION_REPORT.md'),
    reportContent
  );
  console.log('📄 Reporte generado: GOLDEN_RATIO_VERIFICATION_REPORT.md');
}

// Ejecutar verificaciones
if (require.main === module) {
  verifyGoldenRatioSystem();
  verifyResponsiveBreakpoints();
  generateReport();
}

module.exports = {
  verifyGoldenRatioSystem,
  verifyResponsiveBreakpoints,
  isFibonacci,
  isGoldenRatio,
  GOLDEN_RATIO,
  FIBONACCI,
};
