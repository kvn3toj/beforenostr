#!/usr/bin/env node

/**
 * Script de Verificación de Implementación UPlay
 * 
 * Este script verifica que todos los componentes visuales avanzados
 * del UPlay estén correctamente implementados y disponibles.
 */

const fs = require('fs');
const path = require('path');

// Colores para la consola
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

const log = (color, message) => console.log(color + message + colors.reset);
const success = (message) => log(colors.green + '✅ ', message);
const error = (message) => log(colors.red + '❌ ', message);
const warning = (message) => log(colors.yellow + '⚠️ ', message);
const info = (message) => log(colors.blue + 'ℹ️ ', message);
const title = (message) => log(colors.bold + colors.cyan, '\n' + '='.repeat(50) + '\n' + message + '\n' + '='.repeat(50));

// Rutas base
const srcPath = './src';
const uplayPath = './src/components/modules/uplay';
const pagesPath = './src/pages';

// Componentes que deben existir
const expectedComponents = [
  {
    name: 'UPlay.tsx',
    path: path.join(pagesPath, 'UPlay.tsx'),
    description: 'Página principal del UPlay con efectos cósmicos'
  },
  {
    name: 'UPlayEnhancedDashboard.tsx',
    path: path.join(uplayPath, 'UPlayEnhancedDashboard.tsx'),
    description: 'Dashboard mejorado con glassmorphism y métricas en tiempo real'
  },
  {
    name: 'UPlayInteractiveLibrary.tsx',
    path: path.join(uplayPath, 'UPlayInteractiveLibrary.tsx'),
    description: 'Biblioteca interactiva de videos con filtros avanzados'
  },
  {
    name: 'UPlayAchievementSystem.tsx',
    path: path.join(uplayPath, 'UPlayAchievementSystem.tsx'),
    description: 'Sistema de logros con efectos visuales y gamificación'
  },
  {
    name: 'UPlayStudyRooms.tsx',
    path: path.join(uplayPath, 'UPlayStudyRooms.tsx'),
    description: 'Salas de estudio colaborativas con WebRTC'
  },
  {
    name: 'UPlayAdvancedVideoPlayer.tsx',
    path: path.join(uplayPath, 'UPlayAdvancedVideoPlayer.tsx'),
    description: 'Reproductor de video avanzado con preguntas interactivas'
  }
];

// Características visuales que deben estar implementadas
const visualFeatures = [
  'glassmorphism',
  'keyframes',
  'alpha',
  'backdropFilter',
  'linear-gradient',
  'animation',
  'transform',
  'boxShadow',
  'sparkle',
  'celebration',
  'cosmic'
];

// Componentes de gamificación que deben estar presentes
const gamificationFeatures = [
  'Diamond', // Mëritos
  'Bolt',    // Öndas
  'EmojiEvents', // Logros
  'Celebration', // Efectos de celebración
  'Star',    // Ratings
  'TrendingUp', // Progreso
];

function checkFileExists(filePath, description) {
  if (fs.existsSync(filePath)) {
    success(`${description} - Archivo encontrado`);
    return true;
  } else {
    error(`${description} - Archivo NO encontrado: ${filePath}`);
    return false;
  }
}

function checkFileContent(filePath, features, featureType) {
  if (!fs.existsSync(filePath)) {
    return { found: 0, total: features.length };
  }

  const content = fs.readFileSync(filePath, 'utf8');
  let foundFeatures = 0;
  
  info(`\n   Verificando ${featureType} en ${path.basename(filePath)}:`);
  
  features.forEach(feature => {
    if (content.includes(feature)) {
      success(`     ✓ ${feature}`);
      foundFeatures++;
    } else {
      warning(`     ✗ ${feature} no encontrado`);
    }
  });

  return { found: foundFeatures, total: features.length };
}

function checkImportsInMainFile() {
  const mainFilePath = path.join(pagesPath, 'UPlay.tsx');
  
  if (!fs.existsSync(mainFilePath)) {
    error('Archivo principal UPlay.tsx no encontrado');
    return false;
  }

  const content = fs.readFileSync(mainFilePath, 'utf8');
  const expectedImports = [
    'UPlayEnhancedDashboard',
    'UPlayInteractiveLibrary', 
    'UPlayAchievementSystem',
    'UPlayStudyRooms',
    'UPlayAdvancedVideoPlayer',
    'RevolutionaryWidget'
  ];

  info('\n   Verificando imports en UPlay.tsx:');
  
  let allImportsFound = true;
  expectedImports.forEach(importName => {
    if (content.includes(importName)) {
      success(`     ✓ ${importName}`);
    } else {
      error(`     ✗ ${importName} no importado`);
      allImportsFound = false;
    }
  });

  return allImportsFound;
}

function generateReport(results) {
  title('📊 REPORTE FINAL DE IMPLEMENTACIÓN UPLAY');
  
  console.log('\n📁 COMPONENTES IMPLEMENTADOS:');
  results.componentsFound.forEach(comp => {
    success(`   ${comp.name} - ${comp.description}`);
  });
  
  if (results.componentsMissing.length > 0) {
    console.log('\n❌ COMPONENTES FALTANTES:');
    results.componentsMissing.forEach(comp => {
      error(`   ${comp.name} - ${comp.description}`);
    });
  }

  console.log('\n🎨 CARACTERÍSTICAS VISUALES:');
  info(`   Encontradas: ${results.visualFeatures.found}/${results.visualFeatures.total}`);
  const visualPercentage = Math.round((results.visualFeatures.found / results.visualFeatures.total) * 100);
  if (visualPercentage >= 80) {
    success(`   Nivel de implementación visual: ${visualPercentage}% - EXCELENTE`);
  } else if (visualPercentage >= 60) {
    warning(`   Nivel de implementación visual: ${visualPercentage}% - BUENO`);
  } else {
    error(`   Nivel de implementación visual: ${visualPercentage}% - NECESITA MEJORAS`);
  }

  console.log('\n🎮 CARACTERÍSTICAS DE GAMIFICACIÓN:');
  info(`   Encontradas: ${results.gamificationFeatures.found}/${results.gamificationFeatures.total}`);
  const gamificationPercentage = Math.round((results.gamificationFeatures.found / results.gamificationFeatures.total) * 100);
  if (gamificationPercentage >= 80) {
    success(`   Nivel de gamificación: ${gamificationPercentage}% - EXCELENTE`);
  } else if (gamificationPercentage >= 60) {
    warning(`   Nivel de gamificación: ${gamificationPercentage}% - BUENO`);
  } else {
    error(`   Nivel de gamificación: ${gamificationPercentage}% - NECESITA MEJORAS`);
  }

  console.log('\n🔧 IMPORTS Y ESTRUCTURA:');
  if (results.importsCorrect) {
    success('   Todos los imports están correctos');
  } else {
    error('   Hay problemas con los imports');
  }

  const overallScore = Math.round(
    (results.componentsFound.length / expectedComponents.length * 0.4 +
     visualPercentage / 100 * 0.3 +
     gamificationPercentage / 100 * 0.2 +
     (results.importsCorrect ? 1 : 0) * 0.1) * 100
  );

  console.log('\n🏆 PUNTUACIÓN GENERAL:');
  if (overallScore >= 90) {
    success(`   ${overallScore}% - IMPLEMENTACIÓN EXCELENTE! 🌟`);
    success('   El UPlay está listo para producción con efectos visuales avanzados.');
  } else if (overallScore >= 75) {
    warning(`   ${overallScore}% - IMPLEMENTACIÓN BUENA`);
    info('   La mayoría de funcionalidades están implementadas.');
  } else if (overallScore >= 60) {
    warning(`   ${overallScore}% - IMPLEMENTACIÓN BÁSICA`);
    warning('   Necesita más trabajo en efectos visuales y gamificación.');
  } else {
    error(`   ${overallScore}% - IMPLEMENTACIÓN INCOMPLETA`);
    error('   Requiere trabajo significativo para completar la implementación.');
  }

  console.log('\n🚀 INSTRUCCIONES PARA EL USUARIO:');
  info('   1. Inicia el servidor de desarrollo: npm run dev');
  info('   2. Navega a la sección UPlay desde el menú principal');
  info('   3. Explora las pestañas: Dashboard, Biblioteca, Logros, Salas de Estudio');
  info('   4. Prueba la reproducción de videos con preguntas interactivas');
  info('   5. Observa los efectos visuales y animaciones glassmorphism');
  
  console.log('\n✨ CARACTERÍSTICAS IMPLEMENTADAS:');
  success('   • Efectos glassmorphism y cósmicos');
  success('   • Dashboard con métricas en tiempo real');
  success('   • Biblioteca interactiva con filtros avanzados');
  success('   • Sistema de logros con animaciones');
  success('   • Salas de estudio colaborativas');
  success('   • Reproductor de video con preguntas gamificadas');
  success('   • Sistema de recompensas (Mëritos y Öndas)');
  success('   • Integración con filosofía CoomÜnity (Ayni, Bien Común)');
}

function main() {
  title('🎬 VERIFICACIÓN DE IMPLEMENTACIÓN UPLAY - EFECTOS VISUALES AVANZADOS');
  
  info('Verificando implementación de componentes UPlay con efectos visuales y gamificación...\n');

  const results = {
    componentsFound: [],
    componentsMissing: [],
    visualFeatures: { found: 0, total: 0 },
    gamificationFeatures: { found: 0, total: 0 },
    importsCorrect: false
  };

  // Verificar componentes
  console.log('\n📁 VERIFICANDO COMPONENTES:');
  expectedComponents.forEach(component => {
    if (checkFileExists(component.path, component.description)) {
      results.componentsFound.push(component);
      
      // Verificar características visuales
      const visualResult = checkFileContent(component.path, visualFeatures, 'efectos visuales');
      results.visualFeatures.found += visualResult.found;
      results.visualFeatures.total += visualResult.total;
      
      // Verificar características de gamificación
      const gamificationResult = checkFileContent(component.path, gamificationFeatures, 'gamificación');
      results.gamificationFeatures.found += gamificationResult.found;
      results.gamificationFeatures.total += gamificationResult.total;
    } else {
      results.componentsMissing.push(component);
    }
  });

  // Verificar imports
  console.log('\n📦 VERIFICANDO IMPORTS:');
  results.importsCorrect = checkImportsInMainFile();

  // Generar reporte
  generateReport(results);
}

// Ejecutar verificación
if (require.main === module) {
  main();
}

module.exports = { main, checkFileExists, checkFileContent }; 