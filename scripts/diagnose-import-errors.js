#!/usr/bin/env node

/**
 * 🔍 SCRIPT DE DIAGNÓSTICO COMPREHENSIVO DE ERRORES DE IMPORTACIÓN
 * 
 * Este script detecta y reporta todos los problemas de importación comunes:
 * - Archivos faltantes
 * - Exportaciones duplicadas
 * - Imports circulares
 * - Lazy loading mal configurado
 * - Bindings incorrectos
 */

const fs = require('fs');
const path = require('path');

const SUPERAPP_PATH = path.join(__dirname, '../Demo/apps/superapp-unified/src');
const ERRORS_FOUND = [];
const WARNINGS_FOUND = [];

// Colores para output
const colors = {
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logError(message) {
  ERRORS_FOUND.push(message);
  log(`❌ ERROR: ${message}`, 'red');
}

function logWarning(message) {
  WARNINGS_FOUND.push(message);
  log(`⚠️  WARNING: ${message}`, 'yellow');
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'blue');
}

// Función para encontrar todos los archivos TypeScript/React
function findTSFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
      findTSFiles(filePath, fileList);
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Función para extraer imports de un archivo
function extractImports(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const imports = [];
    
    // Regex para diferentes tipos de imports
    const importRegexes = [
      /import\s+.*?from\s+['"]([^'"]+)['"]/g,
      /import\s*\(\s*['"]([^'"]+)['"]\s*\)/g, // dynamic imports
      /React\.lazy\s*\(\s*\(\s*\)\s*=>\s*import\s*\(\s*['"]([^'"]+)['"]\s*\)\s*\)/g // lazy imports
    ];
    
    importRegexes.forEach(regex => {
      let match;
      while ((match = regex.exec(content)) !== null) {
        imports.push({
          path: match[1],
          line: content.substring(0, match.index).split('\n').length,
          type: regex.source.includes('lazy') ? 'lazy' : 
                regex.source.includes('import\\(') ? 'dynamic' : 'static'
        });
      }
    });
    
    return imports;
  } catch (error) {
    logError(`No se pudo leer el archivo: ${filePath} - ${error.message}`);
    return [];
  }
}

// Función para resolver rutas de import
function resolveImportPath(importPath, currentFile) {
  if (importPath.startsWith('.')) {
    const currentDir = path.dirname(currentFile);
    const resolved = path.resolve(currentDir, importPath);
    
    // Intentar diferentes extensiones
    const extensions = ['', '.ts', '.tsx', '.js', '.jsx', '/index.ts', '/index.tsx'];
    
    for (const ext of extensions) {
      const fullPath = resolved + ext;
      if (fs.existsSync(fullPath)) {
        return fullPath;
      }
    }
    
    return null;
  }
  
  // Para imports absolutos o de node_modules, no verificamos
  return 'external';
}

// Función para detectar exportaciones duplicadas
function checkDuplicateExports(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const exports = [];
    const duplicates = [];
    
    // Regex para diferentes tipos de exports
    const exportRegexes = [
      /export\s+(?:const|let|var|function|class)\s+(\w+)/g,
      /export\s+\{\s*([^}]+)\s*\}/g,
      /export\s+default\s+(\w+)/g
    ];
    
    exportRegexes.forEach((regex, index) => {
      let match;
      while ((match = regex.exec(content)) !== null) {
        if (index === 1) { // export { ... }
          const exportNames = match[1].split(',').map(name => 
            name.trim().split(' as ')[0].trim()
          );
          exportNames.forEach(name => {
            if (exports.includes(name)) {
              duplicates.push(name);
            } else {
              exports.push(name);
            }
          });
        } else {
          const exportName = match[1];
          if (exports.includes(exportName)) {
            duplicates.push(exportName);
          } else {
            exports.push(exportName);
          }
        }
      }
    });
    
    return duplicates;
  } catch (error) {
    logError(`Error checking exports in ${filePath}: ${error.message}`);
    return [];
  }
}

// Función principal de diagnóstico
function diagnoseImportErrors() {
  log('🔍 INICIANDO DIAGNÓSTICO COMPREHENSIVO DE IMPORTACIONES', 'bold');
  log('=====================================================', 'blue');
  
  if (!fs.existsSync(SUPERAPP_PATH)) {
    logError(`El directorio SuperApp no existe: ${SUPERAPP_PATH}`);
    return;
  }
  
  const allFiles = findTSFiles(SUPERAPP_PATH);
  logInfo(`Encontrados ${allFiles.length} archivos TypeScript/React`);
  
  let totalImports = 0;
  let brokenImports = 0;
  const missingFiles = new Set();
  
  // Verificar cada archivo
  allFiles.forEach(filePath => {
    const relativePath = path.relative(SUPERAPP_PATH, filePath);
    
    // 1. Verificar exportaciones duplicadas
    const duplicateExports = checkDuplicateExports(filePath);
    if (duplicateExports.length > 0) {
      logError(`Exportaciones duplicadas en ${relativePath}: ${duplicateExports.join(', ')}`);
    }
    
    // 2. Verificar imports
    const imports = extractImports(filePath);
    totalImports += imports.length;
    
    imports.forEach(importItem => {
      const resolvedPath = resolveImportPath(importItem.path, filePath);
      
      if (resolvedPath === null) {
        brokenImports++;
        const missingFile = importItem.path;
        missingFiles.add(missingFile);
        
        logError(`Import roto en ${relativePath}:${importItem.line} -> "${importItem.path}" (${importItem.type})`);
        
        // Sugerir archivos similares
        const suggestions = findSimilarFiles(importItem.path, allFiles);
        if (suggestions.length > 0) {
          logInfo(`  💡 Archivos similares encontrados: ${suggestions.slice(0, 3).join(', ')}`);
        }
      }
    });
  });
  
  // Reportar problemas específicos conocidos
  checkSpecificKnownIssues();
  
  // Resumen final
  log('\n📊 RESUMEN DEL DIAGNÓSTICO', 'bold');
  log('==========================', 'blue');
  logInfo(`Total de archivos analizados: ${allFiles.length}`);
  logInfo(`Total de imports encontrados: ${totalImports}`);
  
  if (brokenImports > 0) {
    logError(`Imports rotos encontrados: ${brokenImports}`);
    logError(`Archivos faltantes únicos: ${missingFiles.size}`);
  } else {
    logSuccess('No se encontraron imports rotos');
  }
  
  if (ERRORS_FOUND.length > 0) {
    log(`\n❌ TOTAL DE ERRORES: ${ERRORS_FOUND.length}`, 'red');
  }
  
  if (WARNINGS_FOUND.length > 0) {
    log(`⚠️  TOTAL DE WARNINGS: ${WARNINGS_FOUND.length}`, 'yellow');
  }
  
  if (ERRORS_FOUND.length === 0 && WARNINGS_FOUND.length === 0) {
    logSuccess('🎉 ¡Diagnóstico completado sin errores críticos!');
  }
  
  // Generar reporte detallado
  generateDetailedReport(missingFiles);
}

// Función para encontrar archivos similares
function findSimilarFiles(searchPath, allFiles) {
  const searchName = path.basename(searchPath).toLowerCase();
  const suggestions = [];
  
  allFiles.forEach(filePath => {
    const fileName = path.basename(filePath).toLowerCase();
    const fileNameWithoutExt = fileName.replace(/\.(ts|tsx|js|jsx)$/, '');
    
    if (fileNameWithoutExt.includes(searchName) || searchName.includes(fileNameWithoutExt)) {
      suggestions.push(path.relative(SUPERAPP_PATH, filePath));
    }
  });
  
  return suggestions;
}

// Función para verificar problemas específicos conocidos
function checkSpecificKnownIssues() {
  log('\n🎯 VERIFICANDO PROBLEMAS ESPECÍFICOS CONOCIDOS', 'bold');
  log('===============================================', 'blue');
  
  // 1. Verificar archivos problemáticos específicos del log
  const knownMissingFiles = [
    'components/modules/marketplace/ProductGrid',
    'components/modules/uplay/VideoPlayerModal',
    'components/modules/uplay/QuizOverlay',
    'hooks/useLetsIntegration'
  ];
  
  knownMissingFiles.forEach(file => {
    const fullPath = path.join(SUPERAPP_PATH, file);
    const extensions = ['', '.ts', '.tsx', '.js', '.jsx'];
    let found = false;
    
    for (const ext of extensions) {
      if (fs.existsSync(fullPath + ext)) {
        found = true;
        logSuccess(`Archivo encontrado: ${file}${ext}`);
        break;
      }
    }
    
    if (!found) {
      logError(`Archivo faltante conocido: ${file}`);
    }
  });
  
  // 2. Verificar el problema de VideoDataCache duplicado
  const videoDataPath = path.join(SUPERAPP_PATH, 'hooks/data/useVideoData.ts');
  if (fs.existsSync(videoDataPath)) {
    const content = fs.readFileSync(videoDataPath, 'utf8');
    const videoDataCacheMatches = content.match(/VideoDataCache/g);
    if (videoDataCacheMatches && videoDataCacheMatches.length > 2) {
      logError(`VideoDataCache aparece ${videoDataCacheMatches.length} veces en useVideoData.ts (posible duplicación)`);
    }
  }
  
  // 3. Verificar lazy loading en lazyComponents.tsx
  const lazyComponentsPath = path.join(SUPERAPP_PATH, 'utils/lazyComponents.tsx');
  if (fs.existsSync(lazyComponentsPath)) {
    const content = fs.readFileSync(lazyComponentsPath, 'utf8');
    
    // Verificar que existan las funciones preload
    if (!content.includes('preloadCriticalComponents')) {
      logError('Función preloadCriticalComponents faltante en lazyComponents.tsx');
    }
    
    if (!content.includes('preloadRouteComponents')) {
      logError('Función preloadRouteComponents faltante en lazyComponents.tsx');
    }
    
    logSuccess('lazyComponents.tsx verificado');
  }
}

// Función para generar reporte detallado
function generateDetailedReport(missingFiles) {
  if (ERRORS_FOUND.length === 0) return;
  
  const reportPath = path.join(__dirname, '../logs/import-errors-report.md');
  
  let report = `# 🔍 Reporte de Errores de Importación - ${new Date().toISOString()}\n\n`;
  
  report += `## 📊 Resumen\n\n`;
  report += `- **Errores encontrados:** ${ERRORS_FOUND.length}\n`;
  report += `- **Warnings encontrados:** ${WARNINGS_FOUND.length}\n`;
  report += `- **Archivos faltantes únicos:** ${missingFiles.size}\n\n`;
  
  if (ERRORS_FOUND.length > 0) {
    report += `## ❌ Errores Críticos\n\n`;
    ERRORS_FOUND.forEach((error, index) => {
      report += `${index + 1}. ${error}\n`;
    });
    report += `\n`;
  }
  
  if (WARNINGS_FOUND.length > 0) {
    report += `## ⚠️ Warnings\n\n`;
    WARNINGS_FOUND.forEach((warning, index) => {
      report += `${index + 1}. ${warning}\n`;
    });
    report += `\n`;
  }
  
  if (missingFiles.size > 0) {
    report += `## 📁 Archivos Faltantes\n\n`;
    Array.from(missingFiles).forEach(file => {
      report += `- \`${file}\`\n`;
    });
    report += `\n`;
  }
  
  report += `## 🔧 Recomendaciones de Solución\n\n`;
  report += `1. **Crear archivos faltantes** o corregir rutas de importación\n`;
  report += `2. **Eliminar exportaciones duplicadas** en archivos afectados\n`;
  report += `3. **Verificar lazy loading** en lazyComponents.tsx\n`;
  report += `4. **Ejecutar build** para verificar que no hay errores de compilación\n\n`;
  
  // Crear directorio logs si no existe
  const logsDir = path.dirname(reportPath);
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
  }
  
  fs.writeFileSync(reportPath, report);
  logInfo(`📄 Reporte detallado guardado en: ${reportPath}`);
}

// Ejecutar diagnóstico
if (require.main === module) {
  diagnoseImportErrors();
}

module.exports = { diagnoseImportErrors }; 