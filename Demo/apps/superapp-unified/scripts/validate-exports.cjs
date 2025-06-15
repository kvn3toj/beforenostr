#!/usr/bin/env node

/**
 * 🔍 VALIDADOR DE EXPORTACIONES - COOMUNITY SUPERAPP
 * 
 * Script para detectar patrones problemáticos de exportación que causan el error:
 * "Indirectly exported binding name 'default' cannot be resolved by star export entries"
 * 
 * Uso: node scripts/validate-exports.js
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// 🎯 Patrones problemáticos detectados
const PROBLEMATIC_PATTERNS = [
  {
    name: 'Mixed Default and Named Re-export',
    pattern: /export\s*{\s*default\s+as\s+\w+\s*,\s*\w+\s*}\s*from/g,
    description: 'Mezcla exportación default y nombrada en la misma línea',
    example: "export { default as Button, CoomunityButton } from './Button';",
    solution: 'Usar import/export separado para exportaciones nombradas'
  },
  {
    name: 'Re-export Named from Default Module',
    pattern: /export\s*{\s*\w+\s+as\s+\w+\s*}\s*from\s+['"]/g,
    description: 'Re-exporta exportación nombrada desde módulo con default',
    example: "export { Card as CoomunityCard } from './Card';",
    solution: 'Verificar que la exportación nombrada exista o usar import/export separado'
  },
  {
    name: 'Potential Non-existent Export',
    pattern: /export\s*{\s*default\s+as\s+\w+\s*,\s*\w+(?!\s*as)/g,
    description: 'Posible exportación inexistente en re-export',
    example: "export { default as Button, NonExistentExport } from './Button';",
    solution: 'Verificar que todas las exportaciones existan en el archivo fuente'
  }
];

// 🔍 Función principal de validación
function validateExports() {
  console.log('🔍 COOMUNITY SUPERAPP - Validador de Exportaciones\n');
  
  // Encontrar todos los archivos TypeScript/JavaScript
  const files = glob.sync('src/**/*.{ts,tsx,js,jsx}', {
    ignore: ['node_modules/**', 'dist/**', '**/*.d.ts']
  });

  let totalIssues = 0;
  let problematicFiles = 0;

  files.forEach(filePath => {
    const content = fs.readFileSync(filePath, 'utf-8');
    const issues = findIssuesInFile(content, filePath);
    
    if (issues.length > 0) {
      problematicFiles++;
      console.log(`\n❌ ${filePath}`);
      issues.forEach(issue => {
        totalIssues++;
        console.log(`   ${issue.line}: ${issue.type}`);
        console.log(`   📝 ${issue.description}`);
        console.log(`   💡 ${issue.solution}`);
        console.log(`   🔍 Código: ${issue.code.trim()}`);
        console.log('');
      });
    }
  });

  // 📊 Resumen
  console.log('\n📊 RESUMEN DE VALIDACIÓN');
  console.log('─'.repeat(50));
  console.log(`📁 Archivos analizados: ${files.length}`);
  console.log(`🚨 Archivos con problemas: ${problematicFiles}`);
  console.log(`⚠️  Total de problemas: ${totalIssues}`);
  
  if (totalIssues === 0) {
    console.log('\n✅ ¡Todas las exportaciones están correctas!');
    console.log('🎉 No se detectaron patrones problemáticos.');
  } else {
    console.log('\n🔧 RECOMENDACIONES:');
    console.log('1. Usar import/export separado para exports problemáticos');
    console.log('2. Verificar que todas las exportaciones nombradas existan');
    console.log('3. Evitar mezclar default y named exports en la misma línea');
    console.log('4. Ejecutar este script antes de hacer commit');
    
    process.exit(1); // Fallar CI/CD si hay problemas
  }
}

// 🔍 Encontrar problemas en un archivo
function findIssuesInFile(content, filePath) {
  const issues = [];
  const lines = content.split('\n');

  lines.forEach((line, index) => {
    PROBLEMATIC_PATTERNS.forEach(pattern => {
      if (pattern.pattern.test(line)) {
        issues.push({
          line: index + 1,
          type: pattern.name,
          description: pattern.description,
          solution: pattern.solution,
          code: line
        });
      }
    });

    // Reset regex lastIndex para próximas iteraciones
    PROBLEMATIC_PATTERNS.forEach(pattern => {
      pattern.pattern.lastIndex = 0;
    });
  });

  return issues;
}

// 🚀 Ejecutar validación
if (require.main === module) {
  try {
    validateExports();
  } catch (error) {
    console.error('❌ Error ejecutando validación:', error.message);
    process.exit(1);
  }
}

module.exports = { validateExports, findIssuesInFile, PROBLEMATIC_PATTERNS }; 