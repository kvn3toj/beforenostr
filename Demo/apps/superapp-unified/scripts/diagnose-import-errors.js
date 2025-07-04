#!/usr/bin/env node

/**
 * 🔍 SCRIPT DE DIAGNÓSTICO COMPREHENSIVO - IMPORT ERRORS
 * 
 * Detecta y reporta todos los problemas de importación en la SuperApp CoomÜnity
 * incluyendo archivos faltantes, exportaciones duplicadas y rutas incorrectas.
 * 
 * Error ID: 1b4b9c3e18754165aaf27131254bfd2f
 * "Element type is invalid. Received a promise that resolves to: undefined"
 */

const fs = require('fs');
const path = require('path');

// 🎯 CONFIGURACIÓN DEL DIAGNÓSTICO
const config = {
  sourceDir: path.join(__dirname, '../src'),
  outputFile: path.join(__dirname, '../../logs/import-errors-report.md'),
  fileExtensions: ['.tsx', '.ts', '.jsx', '.js'],
  ignorePatterns: [
    'node_modules',
    '.git',
    'dist',
    'build',
    '__tests__',
    '.test.',
    '.spec.'
  ]
};

// 📊 ESTADÍSTICAS DEL ANÁLISIS
const stats = {
  totalFiles: 0,
  totalImports: 0,
  brokenImports: 0,
  missingFiles: new Set(),
  duplicateExports: new Map(),
  criticalErrors: []
};

// 🔍 FUNCIONES DE UTILIDAD
const isIgnored = (filePath) => {
  return config.ignorePatterns.some(pattern => filePath.includes(pattern));
};

const getFileExtension = (fileName) => {
  return path.extname(fileName);
};

const isTargetFile = (fileName) => {
  return config.fileExtensions.includes(getFileExtension(fileName));
};

const normalizeImportPath = (importPath, currentDir) => {
  if (importPath.startsWith('./') || importPath.startsWith('../')) {
    return path.resolve(currentDir, importPath);
  }
  return importPath;
};

const findSimilarFiles = (missingFile, allFiles) => {
  const basename = path.basename(missingFile, path.extname(missingFile));
  return allFiles.filter(file => 
    file.includes(basename) || 
    path.basename(file, path.extname(file)).includes(basename)
  ).slice(0, 3); // Máximo 3 sugerencias
};

// 📂 EXPLORAR DIRECTORIO RECURSIVAMENTE
const getAllFiles = (dir, files = []) => {
  if (!fs.existsSync(dir) || isIgnored(dir)) {
    return files;
  }

  const entries = fs.readdirSync(dir);
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory() && !isIgnored(fullPath)) {
      getAllFiles(fullPath, files);
    } else if (stat.isFile() && isTargetFile(entry) && !isIgnored(fullPath)) {
      files.push(fullPath);
      stats.totalFiles++;
    }
  }
  
  return files;
};

// 🧩 EXTRAER IMPORTS DE UN ARCHIVO
const extractImports = (content, filePath) => {
  const imports = [];
  const currentDir = path.dirname(filePath);
  
  // Patrones para diferentes tipos de import
  const importPatterns = [
    // import ... from '...'
    /import\s+(?:{[^}]*}|\*\s+as\s+\w+|\w+)\s+from\s+['"`]([^'"`]+)['"`]/g,
    // const ... = import('...')
    /import\s*\(\s*['"`]([^'"`]+)['"`]\s*\)/g,
    // React.lazy(() => import('...'))
    /lazy\s*\(\s*\(\)\s*=>\s*import\s*\(\s*['"`]([^'"`]+)['"`]\s*\)\s*\)/g
  ];
  
  for (const pattern of importPatterns) {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      const importPath = match[1];
      if (importPath.startsWith('.')) {
        imports.push({
          path: importPath,
          resolved: normalizeImportPath(importPath, currentDir),
          line: content.substring(0, match.index).split('\n').length,
          raw: match[0]
        });
      }
      stats.totalImports++;
    }
  }
  
  return imports;
};

// 🔍 VERIFICAR ARCHIVO EXISTE
const checkFileExists = (importPath) => {
  const extensions = ['.tsx', '.ts', '.jsx', '.js', '/index.tsx', '/index.ts', '/index.jsx', '/index.js'];
  
  for (const ext of extensions) {
    const fullPath = importPath + ext;
    if (fs.existsSync(fullPath)) {
      return { exists: true, actualPath: fullPath };
    }
  }
  
  return { exists: false, actualPath: null };
};

// 📤 DETECTAR EXPORTACIONES DUPLICADAS
const detectDuplicateExports = (content, filePath) => {
  const exports = [];
  const duplicates = [];
  
  // Patrones para exports
  const exportPatterns = [
    /export\s+(?:const|let|var|function|class)\s+(\w+)/g,
    /export\s+\{\s*([^}]+)\s*\}/g,
    /export\s+default\s+(\w+)/g
  ];
  
  for (const pattern of exportPatterns) {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      if (pattern.source.includes('{')) {
        // Manejar exports con múltiples elementos
        const exportNames = match[1].split(',').map(name => name.trim().split(' as ')[0]);
        exports.push(...exportNames);
      } else {
        exports.push(match[1]);
      }
    }
  }
  
  // Detectar duplicados
  const seen = new Set();
  for (const exportName of exports) {
    if (seen.has(exportName)) {
      duplicates.push(exportName);
      if (!stats.duplicateExports.has(filePath)) {
        stats.duplicateExports.set(filePath, []);
      }
      stats.duplicateExports.get(filePath).push(exportName);
    }
    seen.add(exportName);
  }
  
  return duplicates;
};

// 🔍 ANALIZAR ARCHIVO INDIVIDUAL
const analyzeFile = (filePath, allFiles) => {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const imports = extractImports(content, filePath);
    const duplicateExports = detectDuplicateExports(content, filePath);
    
    const errors = [];
    
    // Verificar imports
    for (const imp of imports) {
      const fileCheck = checkFileExists(imp.resolved);
      if (!fileCheck.exists) {
        errors.push({
          type: 'missing_import',
          file: filePath,
          line: imp.line,
          import: imp.path,
          resolved: imp.resolved,
          suggestions: findSimilarFiles(imp.resolved, allFiles)
        });
        stats.brokenImports++;
        stats.missingFiles.add(imp.resolved);
      }
    }
    
    // Reportar duplicados
    if (duplicateExports.length > 0) {
      errors.push({
        type: 'duplicate_exports',
        file: filePath,
        duplicates: duplicateExports
      });
    }
    
    return errors;
  } catch (error) {
    return [{
      type: 'file_read_error',
      file: filePath,
      error: error.message
    }];
  }
};

// 📝 GENERAR REPORTE
const generateReport = (allErrors, allFiles) => {
  const report = [];
  
  report.push('# 🔍 REPORTE DE DIAGNÓSTICO DE IMPORTACIONES');
  report.push('## SuperApp CoomÜnity - Import Errors Analysis');
  report.push(`Generado: ${new Date().toISOString()}`);
  report.push(`Error ID: 1b4b9c3e18754165aaf27131254bfd2f`);
  report.push('');
  
  // Estadísticas generales
  report.push('## 📊 ESTADÍSTICAS GENERALES');
  report.push(`- **Archivos analizados:** ${stats.totalFiles}`);
  report.push(`- **Imports totales:** ${stats.totalImports}`);
  report.push(`- **Imports rotos:** ${stats.brokenImports}`);
  report.push(`- **Archivos faltantes únicos:** ${stats.missingFiles.size}`);
  report.push(`- **Errores críticos:** ${allErrors.length}`);
  report.push('');
  
  // Archivos faltantes críticos
  if (stats.missingFiles.size > 0) {
    report.push('## ❌ ARCHIVOS FALTANTES CRÍTICOS');
    report.push('');
    Array.from(stats.missingFiles).forEach(file => {
      report.push(`### ${path.basename(file)}`);
      report.push(`- **Ruta esperada:** \`${file}\``);
      
      const suggestions = findSimilarFiles(file, allFiles);
      if (suggestions.length > 0) {
        report.push(`- **Archivos similares encontrados:**`);
        suggestions.forEach(suggestion => {
          report.push(`  - \`${suggestion}\``);
        });
      }
      report.push('');
    });
  }
  
  // Errores de importación detallados
  const importErrors = allErrors.filter(e => e.type === 'missing_import');
  if (importErrors.length > 0) {
    report.push('## 🚫 ERRORES DE IMPORTACIÓN DETALLADOS');
    report.push('');
    importErrors.forEach(error => {
      report.push(`### ${path.relative(config.sourceDir, error.file)}:${error.line}`);
      report.push(`- **Import roto:** \`${error.import}\``);
      report.push(`- **Ruta resuelta:** \`${error.resolved}\``);
      if (error.suggestions.length > 0) {
        report.push(`- **Sugerencias:**`);
        error.suggestions.forEach(suggestion => {
          report.push(`  - \`${suggestion}\``);
        });
      }
      report.push('');
    });
  }
  
  // Exportaciones duplicadas
  if (stats.duplicateExports.size > 0) {
    report.push('## ⚠️ EXPORTACIONES DUPLICADAS');
    report.push('');
    stats.duplicateExports.forEach((duplicates, file) => {
      report.push(`### ${path.relative(config.sourceDir, file)}`);
      report.push(`- **Exports duplicados:** ${duplicates.join(', ')}`);
      report.push('');
    });
  }
  
  // Componentes lazy problemáticos
  const lazyProblems = importErrors.filter(e => 
    e.import.includes('pages/') || 
    e.import.includes('components/') ||
    e.file.includes('lazyComponents') ||
    e.file.includes('lazy')
  );
  
  if (lazyProblems.length > 0) {
    report.push('## 🎭 PROBLEMAS DE LAZY LOADING');
    report.push('*Estos errores pueden causar "Element type is invalid" en React*');
    report.push('');
    lazyProblems.forEach(error => {
      report.push(`- **${path.basename(error.file)}** → \`${error.import}\``);
    });
    report.push('');
  }
  
  // Recomendaciones
  report.push('## 💡 RECOMENDACIONES DE CORRECCIÓN');
  report.push('');
  report.push('1. **Crear archivos faltantes críticos** (ProductGrid, VideoPlayerModal, etc.)');
  report.push('2. **Corregir rutas de importación** en archivos lazy loading');
  report.push('3. **Resolver exportaciones duplicadas** especialmente VideoDataCache');
  report.push('4. **Verificar exports correctos** en todos los componentes lazy');
  report.push('5. **Ejecutar este script después de cada corrección** para verificar progreso');
  report.push('');
  
  return report.join('\n');
};

// 🚀 FUNCIÓN PRINCIPAL
const main = () => {
  console.log('🔍 Iniciando diagnóstico de importaciones...');
  console.log(`📂 Analizando directorio: ${config.sourceDir}`);
  
  // Obtener todos los archivos
  const allFiles = getAllFiles(config.sourceDir);
  console.log(`📊 Encontrados ${allFiles.length} archivos para analizar`);
  
  // Analizar cada archivo
  const allErrors = [];
  for (const file of allFiles) {
    const errors = analyzeFile(file, allFiles);
    allErrors.push(...errors);
  }
  
  // Generar reporte
  const report = generateReport(allErrors, allFiles);
  
  // Crear directorio de logs si no existe
  const logDir = path.dirname(config.outputFile);
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }
  
  // Escribir reporte
  fs.writeFileSync(config.outputFile, report);
  
  console.log('\n📋 RESUMEN DEL DIAGNÓSTICO:');
  console.log(`✅ Archivos analizados: ${stats.totalFiles}`);
  console.log(`🔗 Imports procesados: ${stats.totalImports}`);
  console.log(`❌ Imports rotos: ${stats.brokenImports}`);
  console.log(`📄 Archivos faltantes: ${stats.missingFiles.size}`);
  console.log(`⚠️ Errores críticos: ${allErrors.length}`);
  console.log(`\n📝 Reporte completo: ${config.outputFile}`);
  
  // Mostrar archivos críticos faltantes
  if (stats.missingFiles.size > 0) {
    console.log('\n🚨 ARCHIVOS CRÍTICOS FALTANTES:');
    Array.from(stats.missingFiles).slice(0, 10).forEach(file => {
      console.log(`   - ${path.basename(file)}`);
    });
    if (stats.missingFiles.size > 10) {
      console.log(`   ... y ${stats.missingFiles.size - 10} más`);
    }
  }
  
  return allErrors.length === 0;
};

// Ejecutar si es llamado directamente
if (require.main === module) {
  const success = main();
  process.exit(success ? 0 : 1);
}

module.exports = { main, stats }; 