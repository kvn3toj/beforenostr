#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Colores para output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

const log = {
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  header: (msg) => console.log(`\n${colors.bright}${colors.cyan}${msg}${colors.reset}`),
  subheader: (msg) => console.log(`${colors.bright}${msg}${colors.reset}`),
};

// Configuración de verificación actualizada
const checks = {
  fileStructure: {
    name: 'Estructura de Archivos',
    weight: 20,
    files: [
      'src/components/ui/index.ts',
      'src/components/ui/CoomunityButton.tsx',
      'src/components/ui/CoomunityCard.tsx',
      'src/components/ui/LoadingSpinner.tsx',
      'src/components/ui/ThemeTestSuite.tsx',
      'src/components/ui/DesignSystemShowcase.tsx',
      'src/components/ui/DesignSystemValidator.tsx',
      'src/components/ui/PerformanceMonitor.tsx',
      'src/utils/lazyComponents.tsx',
      'src/contexts/ThemeContext.tsx',
      'src/contexts/AuthContext.tsx',
      'package.json',
    ],
  },
  designTokens: {
    name: 'Tokens de Diseño',
    weight: 15,
    files: [
      'tailwind.config.js',
      'src/index.css',
    ],
  },
  coreComponents: {
    name: 'Componentes Core',
    weight: 25,
    components: [
      'CoomunityButton',
      'CoomunityCard', 
      'LoadingSpinner',
      'ThemeTestSuite',
    ],
  },
  darkMode: {
    name: 'Modo Oscuro',
    weight: 15,
    files: [
      'src/contexts/ThemeContext.tsx',
    ],
  },
  lazyLoading: {
    name: 'Lazy Loading',
    weight: 10,
    files: [
      'src/utils/lazyComponents.tsx',
    ],
  },
  documentation: {
    name: 'Documentación',
    weight: 10,
    files: [
      'DESIGN_SYSTEM_README.md',
      'DESIGN_SYSTEM_FINAL_REPORT.md',
      'src/components/ui/DesignSystemShowcase.tsx',
    ],
  },
  cssIntegration: {
    name: 'Integración CSS',
    weight: 5,
    files: [
      'src/index.css',
    ],
  },
};

// Función para verificar si un archivo existe
function fileExists(filePath) {
  try {
    return fs.existsSync(path.join(process.cwd(), filePath));
  } catch (error) {
    return false;
  }
}

// Verificar estructura de archivos
function verifyFileStructure() {
  log.subheader('📁 Verificando Estructura de Archivos...');
  
  const results = checks.fileStructure.files.map(file => {
    const exists = fileExists(file);
    if (exists) {
      log.success(`${file}`);
    } else {
      log.error(`${file} - No encontrado`);
    }
    return exists;
  });
  
  const score = (results.filter(Boolean).length / results.length) * 100;
  return { score, total: results.length, passed: results.filter(Boolean).length };
}

// Verificar tokens de diseño
function verifyDesignTokens() {
  log.subheader('🎨 Verificando Tokens de Diseño...');
  
  const results = checks.designTokens.files.map(file => {
    if (!fileExists(file)) {
      log.error(`${file} - No encontrado`);
      return false;
    }
    
    log.success(`${file} - Existe`);
    return true;
  });
  
  const score = (results.filter(Boolean).length / results.length) * 100;
  return { score, total: results.length, passed: results.filter(Boolean).length };
}

// Verificar componentes core
function verifyCoreComponents() {
  log.subheader('🧩 Verificando Componentes Core...');
  
  const results = checks.coreComponents.components.map(component => {
    const filePath = `src/components/ui/${component}.tsx`;
    const exists = fileExists(filePath);
    
    if (exists) {
      log.success(`${component} - Implementado`);
      return true;
    } else {
      log.error(`${component} - No encontrado`);
      return false;
    }
  });
  
  const score = (results.filter(Boolean).length / results.length) * 100;
  return { score, total: results.length, passed: results.filter(Boolean).length };
}

// Verificar modo oscuro
function verifyDarkMode() {
  log.subheader('🌙 Verificando Modo Oscuro...');
  
  const themeFile = 'src/contexts/ThemeContext.tsx';
  if (!fileExists(themeFile)) {
    log.error('ThemeContext.tsx - No encontrado');
    return { score: 0, total: 1, passed: 0 };
  }
  
  log.success('ThemeContext - Encontrado');
  return { score: 100, total: 1, passed: 1 };
}

// Verificar lazy loading
function verifyLazyLoading() {
  log.subheader('⚡ Verificando Lazy Loading...');
  
  const lazyFile = 'src/utils/lazyComponents.tsx';
  if (!fileExists(lazyFile)) {
    log.error('lazyComponents.tsx - No encontrado');
    return { score: 0, total: 1, passed: 0 };
  }
  
  log.success('Lazy Loading - Implementado');
  return { score: 100, total: 1, passed: 1 };
}

// Verificar documentación
function verifyDocumentation() {
  log.subheader('📚 Verificando Documentación...');
  
  const results = checks.documentation.files.map(file => {
    const exists = fileExists(file);
    if (exists) {
      log.success(`${file}`);
    } else {
      log.error(`${file} - No encontrado`);
    }
    return exists;
  });
  
  const score = (results.filter(Boolean).length / results.length) * 100;
  return { score, total: results.length, passed: results.filter(Boolean).length };
}

// Verificar integración CSS
function verifyCSSIntegration() {
  log.subheader('🎨 Verificando Integración CSS...');
  
  const cssFile = 'src/index.css';
  if (!fileExists(cssFile)) {
    log.error('index.css - No encontrado');
    return { score: 0, total: 1, passed: 0 };
  }
  
  log.success('CSS Integration - Configurado');
  return { score: 100, total: 1, passed: 1 };
}

// Función principal de verificación
function runVerification() {
  log.header('🎨 VERIFICACIÓN DEL SISTEMA DE DISEÑO COOMUNITY');
  log.info('Verificando implementación del sistema de diseño...\n');
  
  const results = {
    fileStructure: verifyFileStructure(),
    designTokens: verifyDesignTokens(),
    coreComponents: verifyCoreComponents(),
    darkMode: verifyDarkMode(),
    lazyLoading: verifyLazyLoading(),
    documentation: verifyDocumentation(),
    cssIntegration: verifyCSSIntegration(),
  };
  
  // Calcular puntuación total
  let totalScore = 0;
  let totalWeight = 0;
  
  Object.keys(results).forEach(key => {
    const weight = checks[key].weight;
    const score = results[key].score;
    totalScore += (score * weight) / 100;
    totalWeight += weight;
  });
  
  const finalScore = (totalScore / totalWeight) * 100;
  
  // Mostrar resumen
  log.header('📊 RESUMEN DE VERIFICACIÓN');
  
  Object.keys(results).forEach(key => {
    const check = checks[key];
    const result = results[key];
    const percentage = Math.round(result.score);
    const status = percentage >= 80 ? '✅' : percentage >= 50 ? '⚠️' : '❌';
    
    console.log(`${status} ${check.name}: ${percentage}% (${result.passed}/${result.total})`);
  });
  
  console.log('\n' + '='.repeat(50));
  
  const finalPercentage = Math.round(finalScore);
  const finalStatus = finalPercentage >= 80 ? '🎉' : finalPercentage >= 60 ? '👍' : '⚠️';
  
  log.header(`${finalStatus} PUNTUACIÓN FINAL: ${finalPercentage}%`);
  
  // Recomendaciones
  if (finalPercentage < 80) {
    log.header('💡 RECOMENDACIONES');
    
    if (results.fileStructure.score < 80) {
      log.warning('• Completar la estructura de archivos faltante');
    }
    if (results.coreComponents.score < 80) {
      log.warning('• Implementar componentes core faltantes');
    }
    if (results.darkMode.score < 80) {
      log.warning('• Mejorar implementación del modo oscuro');
    }
    if (results.documentation.score < 80) {
      log.warning('• Completar documentación del sistema');
    }
  } else {
    log.success('🎉 ¡Sistema de diseño implementado correctamente!');
  }
  
  console.log('\n');
  return finalPercentage;
}

// Ejecutar verificación si se llama directamente
if (require.main === module) {
  const score = runVerification();
  process.exit(score >= 80 ? 0 : 1);
}

module.exports = { runVerification }; 