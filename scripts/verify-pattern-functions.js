#!/usr/bin/env node

/**
 * 🔍 PATTERN FUNCTIONS VERIFICATION SCRIPT
 * ========================================
 * 
 * Verifica que todas las funciones de patrones estén definidas
 * correctamente y sean utilizadas como funciones en los componentes.
 */

const fs = require('fs');
const path = require('path');

// 📁 Directorios a verificar
const PATTERNS_FILE = 'Demo/apps/superapp-unified/src/design-system/patterns.ts';
const COMPONENTS_DIR = 'Demo/apps/superapp-unified/src';

console.log('🔍 INICIANDO VERIFICACIÓN DE FUNCIONES PATRÓN...\n');

// 🎯 1. Verificar archivo de patrones
console.log('📄 Verificando archivo de patrones:', PATTERNS_FILE);

if (!fs.existsSync(PATTERNS_FILE)) {
  console.error('❌ ERROR: Archivo de patrones no encontrado:', PATTERNS_FILE);
  process.exit(1);
}

const patternsContent = fs.readFileSync(PATTERNS_FILE, 'utf8');

// 🔍 Buscar definiciones de funciones patrón
const functionPatterns = [
  'revolutionaryPattern',
  'cosmicCardPattern', 
  'componentVariants'
];

console.log('\n🎨 FUNCIONES PATRÓN ENCONTRADAS:');
functionPatterns.forEach(pattern => {
  const functionRegex = new RegExp(`export const ${pattern} = \\([^)]*\\) =>`, 'g');
  const matches = patternsContent.match(functionRegex);
  
  if (matches) {
    console.log(`✅ ${pattern}: Definida como función`);
  } else {
    console.log(`❌ ${pattern}: NO definida como función`);
  }
});

// 🔍 2. Verificar uso en componentes
console.log('\n🧩 VERIFICANDO USO EN COMPONENTES:');

function findFilesRecursively(dir, extension) {
  const files = [];
  
  function traverse(currentPath) {
    const items = fs.readdirSync(currentPath);
    
    items.forEach(item => {
      const fullPath = path.join(currentPath, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
        traverse(fullPath);
      } else if (stat.isFile() && fullPath.endsWith(extension)) {
        files.push(fullPath);
      }
    });
  }
  
  traverse(dir);
  return files;
}

const componentFiles = findFilesRecursively(COMPONENTS_DIR, '.tsx');

functionPatterns.forEach(pattern => {
  console.log(`\n🔍 Buscando uso de ${pattern}:`);
  
  let foundUsages = 0;
  let correctUsages = 0;
  let incorrectUsages = 0;
  
  componentFiles.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    
    // Buscar importación del patrón
    const importRegex = new RegExp(`import.*${pattern}.*from`, 'g');
    if (content.match(importRegex)) {
      console.log(`  📦 Importado en: ${file.replace(COMPONENTS_DIR, '')}`);
      
      // Verificar uso correcto como función
      const correctUsageRegex = new RegExp(`${pattern}\\s*\\(`, 'g');
      const incorrectUsageRegex = new RegExp(`\\.\\.\\.${pattern}[^(]`, 'g');
      
      const correctMatches = content.match(correctUsageRegex);
      const incorrectMatches = content.match(incorrectUsageRegex);
      
      if (correctMatches) {
        correctUsages += correctMatches.length;
        console.log(`    ✅ Usado como función: ${correctMatches.length} veces`);
      }
      
      if (incorrectMatches) {
        incorrectUsages += incorrectMatches.length;
        console.log(`    ❌ Usado incorrectamente: ${incorrectMatches.length} veces`);
        incorrectMatches.forEach(match => {
          console.log(`      🔍 Patrón problemático: ${match.trim()}`);
        });
      }
      
      foundUsages++;
    }
  });
  
  console.log(`  📊 Resumen ${pattern}:`);
  console.log(`    - Archivos que lo usan: ${foundUsages}`);
  console.log(`    - Usos correctos: ${correctUsages}`);
  console.log(`    - Usos incorrectos: ${incorrectUsages}`);
});

// 🎯 3. Verificar componentes específicos problemáticos
console.log('\n🎯 VERIFICANDO COMPONENTES ESPECÍFICOS:');

const specificComponents = [
  'Demo/apps/superapp-unified/src/design-system/components/cosmic/CosmicCard.tsx',
  'Demo/apps/superapp-unified/src/design-system/templates/RevolutionaryWidget.tsx',
  'Demo/apps/superapp-unified/src/components/home/AyniMetricsCardRevolutionary.tsx'
];

specificComponents.forEach(componentPath => {
  if (fs.existsSync(componentPath)) {
    console.log(`\n📄 ${componentPath.split('/').pop()}:`);
    const content = fs.readFileSync(componentPath, 'utf8');
    
    // Verificar imports de patrones
    const importMatch = content.match(/import.*{([^}]+)}.*from.*patterns/);
    if (importMatch) {
      const importedPatterns = importMatch[1].split(',').map(p => p.trim());
      console.log(`  📦 Importa: ${importedPatterns.join(', ')}`);
      
      importedPatterns.forEach(pattern => {
        const cleanPattern = pattern.trim();
        const usageRegex = new RegExp(`${cleanPattern}\\s*\\(`, 'g');
        const usages = content.match(usageRegex);
        
        if (usages) {
          console.log(`    ✅ ${cleanPattern}: ${usages.length} usos como función`);
        } else {
          const anyUsage = new RegExp(cleanPattern, 'g');
          const anyMatches = content.match(anyUsage);
          if (anyMatches) {
            console.log(`    ⚠️ ${cleanPattern}: ${anyMatches.length} menciones (verificar si son correctas)`);
          }
        }
      });
    } else {
      console.log(`  ℹ️ No importa patrones directamente`);
    }
  } else {
    console.log(`  ❌ Archivo no encontrado: ${componentPath}`);
  }
});

console.log('\n🏁 VERIFICACIÓN COMPLETADA\n'); 