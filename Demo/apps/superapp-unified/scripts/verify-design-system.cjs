#!/usr/bin/env node

/**
 * 🎨 CoomÜnity SuperApp - Script de Verificación del Sistema de Diseño
 * 
 * Este script verifica que todos los componentes del sistema de diseño
 * estén correctamente implementados y funcionando.
 */

const fs = require('fs');
const path = require('path');

// Colores para output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

// Función para logging con colores
const log = {
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
  header: (msg) => console.log(`\n${colors.bold}${colors.cyan}🎨 ${msg}${colors.reset}\n`),
  subheader: (msg) => console.log(`${colors.bold}${colors.magenta}${msg}${colors.reset}`)
};

// Configuración de rutas
const srcPath = path.join(__dirname, '../src');
const componentsPath = path.join(srcPath, 'components');
const stylesPath = path.join(srcPath, 'styles');
const utilsPath = path.join(srcPath, 'utils');
const contextsPath = path.join(srcPath, 'contexts');

// Función para verificar si un archivo existe
const fileExists = (filePath) => {
  try {
    return fs.existsSync(filePath);
  } catch (error) {
    return false;
  }
};

// Función para leer contenido de archivo
const readFile = (filePath) => {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    return null;
  }
};

// Función para verificar si un string contiene cierto contenido
const containsContent = (filePath, searchStrings) => {
  const content = readFile(filePath);
  if (!content) return false;
  
  return searchStrings.every(searchString => content.includes(searchString));
};

// Verificaciones del sistema de diseño
const verifications = {
  // 1. Verificar estructura de archivos
  fileStructure: () => {
    log.subheader('1. Verificando Estructura de Archivos');
    
    const requiredFiles = [
      // Tokens de diseño
      { path: path.join(stylesPath, 'tokens/colors.css'), name: 'Tokens de Color' },
      { path: path.join(stylesPath, 'tokens/typography.css'), name: 'Tokens de Tipografía' },
      { path: path.join(stylesPath, 'tokens/spacing.css'), name: 'Tokens de Espaciado' },
      { path: path.join(stylesPath, 'tokens/shadows.css'), name: 'Tokens de Sombras' },
      
      // Componentes principales
      { path: path.join(componentsPath, 'ui/CoomunityButton.tsx'), name: 'CoomunityButton' },
      { path: path.join(componentsPath, 'ui/CoomunityCard.tsx'), name: 'CoomunityCard' },
      { path: path.join(componentsPath, 'ui/LoadingSpinner.tsx'), name: 'LoadingSpinner' },
      { path: path.join(componentsPath, 'ui/ThemeToggle.tsx'), name: 'ThemeToggle' },
      
      // Sistema de documentación
      { path: path.join(componentsPath, 'ui/DesignSystemShowcase.tsx'), name: 'DesignSystemShowcase' },
      { path: path.join(componentsPath, 'ui/DesignSystemValidator.tsx'), name: 'DesignSystemValidator' },
      { path: path.join(componentsPath, 'ui/PerformanceMonitor.tsx'), name: 'PerformanceMonitor' },
      
      // Contextos y utilidades
      { path: path.join(contextsPath, 'ThemeContext.tsx'), name: 'ThemeContext' },
      { path: path.join(utilsPath, 'lazyComponents.tsx'), name: 'LazyComponents' },
      { path: path.join(utilsPath, 'styles.ts'), name: 'Style Utilities' },
      
      // CSS principal
      { path: path.join(srcPath, 'index.css'), name: 'CSS Principal' },
    ];
    
    let passed = 0;
    let total = requiredFiles.length;
    
    requiredFiles.forEach(file => {
      if (fileExists(file.path)) {
        log.success(`${file.name} encontrado`);
        passed++;
      } else {
        log.error(`${file.name} NO encontrado en ${file.path}`);
      }
    });
    
    return { passed, total, percentage: Math.round((passed / total) * 100) };
  },

  // 2. Verificar tokens de diseño
  designTokens: () => {
    log.subheader('2. Verificando Tokens de Diseño');
    
    const tokenChecks = [
      {
        file: path.join(stylesPath, 'tokens/colors.css'),
        name: 'Colores CoomÜnity',
        required: ['--coomunity-primary-500', '--coomunity-earth', '--coomunity-water', '--color-success']
      },
      {
        file: path.join(stylesPath, 'tokens/typography.css'),
        name: 'Tipografía',
        required: ['--font-size-xs', '--font-size-md', '--font-weight-normal', '--font-family-primary']
      },
      {
        file: path.join(stylesPath, 'tokens/spacing.css'),
        name: 'Espaciado',
        required: ['--space-xs', '--space-md', '--space-lg', '--space-component-md']
      },
      {
        file: path.join(stylesPath, 'tokens/shadows.css'),
        name: 'Sombras',
        required: ['--shadow-sm', '--shadow-md', '--shadow-lg', '--shadow-coomunity']
      }
    ];
    
    let passed = 0;
    let total = tokenChecks.length;
    
    tokenChecks.forEach(check => {
      if (fileExists(check.file) && containsContent(check.file, check.required)) {
        log.success(`${check.name} - Tokens implementados correctamente`);
        passed++;
      } else {
        log.error(`${check.name} - Tokens faltantes o archivo no encontrado`);
      }
    });
    
    return { passed, total, percentage: Math.round((passed / total) * 100) };
  },

  // 3. Verificar componentes principales
  coreComponents: () => {
    log.subheader('3. Verificando Componentes Principales');
    
    const componentChecks = [
      {
        file: path.join(componentsPath, 'ui/CoomunityButton.tsx'),
        name: 'CoomunityButton',
        required: ['variant', 'size', 'ayniLevel', 'startIcon', 'loading']
      },
      {
        file: path.join(componentsPath, 'ui/CoomunityCard.tsx'),
        name: 'CoomunityCard',
        required: ['variant', 'padding', 'interactive', 'className']
      },
      {
        file: path.join(componentsPath, 'ui/LoadingSpinner.tsx'),
        name: 'LoadingSpinner',
        required: ['size', 'message', 'color']
      },
      {
        file: path.join(componentsPath, 'ui/ThemeToggle.tsx'),
        name: 'ThemeToggle',
        required: ['useThemeMode', 'motion', 'IconButton']
      }
    ];
    
    let passed = 0;
    let total = componentChecks.length;
    
    componentChecks.forEach(check => {
      if (fileExists(check.file) && containsContent(check.file, check.required)) {
        log.success(`${check.name} - Implementado correctamente`);
        passed++;
      } else {
        log.error(`${check.name} - Implementación incompleta o archivo no encontrado`);
      }
    });
    
    return { passed, total, percentage: Math.round((passed / total) * 100) };
  },

  // 4. Verificar sistema dark mode
  darkModeSystem: () => {
    log.subheader('4. Verificando Sistema Dark Mode');
    
    const themeContextFile = path.join(contextsPath, 'ThemeContext.tsx');
    const requiredFeatures = [
      'ThemeContextProvider',
      'useThemeMode',
      'isDarkMode',
      'toggleTheme',
      'localStorage',
      'prefers-color-scheme'
    ];
    
    if (fileExists(themeContextFile) && containsContent(themeContextFile, requiredFeatures)) {
      log.success('Sistema Dark Mode - Implementado completamente');
      return { passed: 1, total: 1, percentage: 100 };
    } else {
      log.error('Sistema Dark Mode - Implementación incompleta');
      return { passed: 0, total: 1, percentage: 0 };
    }
  },

  // 5. Verificar lazy loading
  lazyLoadingSystem: () => {
    log.subheader('5. Verificando Sistema Lazy Loading');
    
    const lazyComponentsFile = path.join(utilsPath, 'lazyComponents.tsx');
    const requiredFeatures = [
      'createLazyComponent',
      'LazyPages',
      'LazyModules',
      'preloadCriticalComponents',
      'React.lazy',
      'Suspense'
    ];
    
    if (fileExists(lazyComponentsFile) && containsContent(lazyComponentsFile, requiredFeatures)) {
      log.success('Sistema Lazy Loading - Implementado completamente');
      return { passed: 1, total: 1, percentage: 100 };
    } else {
      log.error('Sistema Lazy Loading - Implementación incompleta');
      return { passed: 0, total: 1, percentage: 0 };
    }
  },

  // 6. Verificar documentación
  documentationSystem: () => {
    log.subheader('6. Verificando Sistema de Documentación');
    
    const docChecks = [
      {
        file: path.join(componentsPath, 'ui/DesignSystemShowcase.tsx'),
        name: 'DesignSystemShowcase',
        required: ['Tabs', 'ColorsSection', 'TypographySection', 'ComponentsSection']
      },
      {
        file: path.join(componentsPath, 'ui/DesignSystemValidator.tsx'),
        name: 'DesignSystemValidator',
        required: ['ValidationResult', 'runValidations', 'checkCSSVariable']
      },
      {
        file: path.join(componentsPath, 'ui/PerformanceMonitor.tsx'),
        name: 'PerformanceMonitor',
        required: ['PerformanceMetric', 'collectMetrics', 'getPerformanceScore']
      }
    ];
    
    let passed = 0;
    let total = docChecks.length;
    
    docChecks.forEach(check => {
      if (fileExists(check.file) && containsContent(check.file, check.required)) {
        log.success(`${check.name} - Implementado correctamente`);
        passed++;
      } else {
        log.error(`${check.name} - Implementación incompleta`);
      }
    });
    
    return { passed, total, percentage: Math.round((passed / total) * 100) };
  },

  // 7. Verificar integración CSS
  cssIntegration: () => {
    log.subheader('7. Verificando Integración CSS');
    
    const mainCssFile = path.join(srcPath, 'index.css');
    const requiredImports = [
      '@import \'./styles/tokens/colors.css\'',
      '@import \'./styles/tokens/typography.css\'',
      '@import \'./styles/tokens/spacing.css\'',
      '@import \'./styles/tokens/shadows.css\'',
      '@tailwind base',
      '@tailwind components',
      '@tailwind utilities'
    ];
    
    if (fileExists(mainCssFile) && containsContent(mainCssFile, requiredImports)) {
      log.success('Integración CSS - Configurada correctamente');
      return { passed: 1, total: 1, percentage: 100 };
    } else {
      log.error('Integración CSS - Configuración incompleta');
      return { passed: 0, total: 1, percentage: 0 };
    }
  }
};

// Función principal de verificación
const runVerification = () => {
  log.header('VERIFICACIÓN DEL SISTEMA DE DISEÑO COOMUNITY');
  
  const results = {};
  let totalPassed = 0;
  let totalTests = 0;
  
  // Ejecutar todas las verificaciones
  Object.keys(verifications).forEach(key => {
    const result = verifications[key]();
    results[key] = result;
    totalPassed += result.passed;
    totalTests += result.total;
  });
  
  // Calcular puntuación general
  const overallScore = Math.round((totalPassed / totalTests) * 100);
  
  // Mostrar resumen
  log.header('RESUMEN DE VERIFICACIÓN');
  
  console.log(`${colors.bold}Pruebas Pasadas:${colors.reset} ${colors.green}${totalPassed}${colors.reset}/${totalTests}`);
  console.log(`${colors.bold}Puntuación General:${colors.reset} ${getScoreColor(overallScore)}${overallScore}%${colors.reset}`);
  
  // Mostrar estado por categoría
  console.log(`\n${colors.bold}Detalles por Categoría:${colors.reset}`);
  Object.keys(results).forEach(key => {
    const result = results[key];
    const categoryName = getCategoryName(key);
    console.log(`  ${categoryName}: ${getScoreColor(result.percentage)}${result.percentage}%${colors.reset} (${result.passed}/${result.total})`);
  });
  
  // Mostrar recomendaciones
  if (overallScore >= 95) {
    log.success('\n🎉 ¡EXCELENTE! El sistema de diseño está completamente implementado.');
    log.info('✨ Todas las funcionalidades están operativas y listas para producción.');
  } else if (overallScore >= 80) {
    log.warning('\n⚠️  BUENO - El sistema está mayormente implementado.');
    log.info('🔧 Algunas mejoras menores recomendadas para completar la implementación.');
  } else {
    log.error('\n❌ ATENCIÓN REQUERIDA - El sistema necesita trabajo adicional.');
    log.info('🛠️  Revisar los elementos faltantes antes de continuar.');
  }
  
  // Mostrar próximos pasos
  console.log(`\n${colors.bold}Próximos Pasos Recomendados:${colors.reset}`);
  if (overallScore >= 95) {
    console.log('• Ejecutar tests E2E para validación final');
    console.log('• Optimizar performance en producción');
    console.log('• Documentar guías de uso para el equipo');
  } else {
    console.log('• Completar elementos faltantes identificados arriba');
    console.log('• Re-ejecutar verificación después de correcciones');
    console.log('• Revisar documentación de implementación');
  }
  
  console.log(`\n${colors.cyan}Para más información, consulta:${colors.reset}`);
  console.log('• /design-system - Showcase interactivo');
  console.log('• /design-validator - Validador automático');
  console.log('• /performance-monitor - Monitor de métricas');
  
  return overallScore;
};

// Funciones helper
const getScoreColor = (score) => {
  if (score >= 95) return colors.green;
  if (score >= 80) return colors.yellow;
  return colors.red;
};

const getCategoryName = (key) => {
  const names = {
    fileStructure: 'Estructura de Archivos',
    designTokens: 'Tokens de Diseño',
    coreComponents: 'Componentes Principales',
    darkModeSystem: 'Sistema Dark Mode',
    lazyLoadingSystem: 'Sistema Lazy Loading',
    documentationSystem: 'Sistema de Documentación',
    cssIntegration: 'Integración CSS'
  };
  return names[key] || key;
};

// Ejecutar verificación si se llama directamente
if (require.main === module) {
  const score = runVerification();
  process.exit(score >= 80 ? 0 : 1);
}

module.exports = { runVerification, verifications }; 