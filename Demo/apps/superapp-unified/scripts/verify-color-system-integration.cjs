#!/usr/bin/env node

/**
 * 🎨 VERIFICACIÓN DE INTEGRACIÓN DEL SISTEMA CENTRALIZADO DE COLORES
 * ===============================================================================
 * Este script verifica que el sistema centralizado de colores esté correctamente
 * integrado con la aplicación y que los cambios de paleta funcionen correctamente.
 * ===============================================================================
 */

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

console.log(`${colors.cyan}${colors.bright}
🎨 VERIFICANDO INTEGRACIÓN DEL SISTEMA CENTRALIZADO DE COLORES
===============================================================================${colors.reset}
`);

const results = {
  passed: 0,
  failed: 0,
  warnings: 0,
  details: []
};

function checkFile(filePath, description) {
  if (fs.existsSync(filePath)) {
    console.log(`${colors.green}✅ ${description}${colors.reset}`);
    results.passed++;
    return true;
  } else {
    console.log(`${colors.red}❌ ${description}${colors.reset}`);
    results.failed++;
    results.details.push(`Missing file: ${filePath}`);
    return false;
  }
}

function checkFileContent(filePath, searchText, description) {
  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      if (content.includes(searchText)) {
        console.log(`${colors.green}✅ ${description}${colors.reset}`);
        results.passed++;
        return true;
      } else {
        console.log(`${colors.red}❌ ${description}${colors.reset}`);
        results.failed++;
        results.details.push(`File ${filePath} doesn't contain: ${searchText}`);
        return false;
      }
    } else {
      console.log(`${colors.red}❌ ${description} (file not found)${colors.reset}`);
      results.failed++;
      results.details.push(`File not found: ${filePath}`);
      return false;
    }
  } catch (error) {
    console.log(`${colors.red}❌ ${description} (error reading file)${colors.reset}`);
    results.failed++;
    results.details.push(`Error reading ${filePath}: ${error.message}`);
    return false;
  }
}

function warnFileContent(filePath, searchText, description) {
  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      if (content.includes(searchText)) {
        console.log(`${colors.yellow}⚠️  ${description}${colors.reset}`);
        results.warnings++;
        results.details.push(`Warning: ${description} - found in ${filePath}`);
        return true;
      } else {
        console.log(`${colors.green}✅ ${description}${colors.reset}`);
        results.passed++;
        return false;
      }
    }
  } catch (error) {
    console.log(`${colors.yellow}⚠️  ${description} (error reading file)${colors.reset}`);
    results.warnings++;
    return false;
  }
}

console.log(`${colors.blue}📁 Verificando archivos del sistema centralizado...${colors.reset}`);

// 1. Verificar archivos principales del sistema centralizado
checkFile('src/design-system/color-system.ts', 'Sistema centralizado de colores existe');
checkFile('src/theme-centralized.ts', 'Tema centralizado existe');
checkFile('COLOR_SYSTEM_GUIDE.md', 'Documentación del sistema existe');

console.log(`\n${colors.blue}🔧 Verificando integración con ThemeContext...${colors.reset}`);

// 2. Verificar que ThemeContext usa el sistema centralizado
checkFileContent(
  'src/contexts/ThemeContext.tsx',
  'createCentralizedTheme',
  'ThemeContext usa createCentralizedTheme'
);

checkFileContent(
  'src/contexts/ThemeContext.tsx',
  'theme-centralized',
  'ThemeContext importa desde theme-centralized'
);

// 3. Verificar que NO usa el sistema antiguo
warnFileContent(
  'src/contexts/ThemeContext.tsx',
  'createAppTheme',
  'ThemeContext NO debe usar createAppTheme (sistema antiguo)'
);

console.log(`\n${colors.blue}🧪 Verificando TestWrapper...${colors.reset}`);

// 4. Verificar TestWrapper
checkFileContent(
  'src/utils/TestWrapper.tsx',
  'createCentralizedTheme',
  'TestWrapper usa createCentralizedTheme'
);

console.log(`\n${colors.blue}🎨 Verificando configuración de paletas...${colors.reset}`);

// 5. Verificar configuración del sistema de colores
if (fs.existsSync('src/design-system/color-system.ts')) {
  const colorSystemContent = fs.readFileSync('src/design-system/color-system.ts', 'utf8');
  
  // Verificar paletas disponibles
  const palettes = ['gamifier', 'autumn', 'friendly', 'cosmic', 'minimalist'];
  palettes.forEach(palette => {
    if (colorSystemContent.includes(`${palette}:`)) {
      console.log(`${colors.green}✅ Paleta '${palette}' definida${colors.reset}`);
      results.passed++;
    } else {
      console.log(`${colors.red}❌ Paleta '${palette}' faltante${colors.reset}`);
      results.failed++;
      results.details.push(`Missing palette: ${palette}`);
    }
  });

  // Verificar ACTIVE_PALETTE
  const activePaletteMatch = colorSystemContent.match(/ACTIVE_PALETTE:\s*PaletteType\s*=\s*'(\w+)'/);
  if (activePaletteMatch) {
    const activePalette = activePaletteMatch[1];
    console.log(`${colors.green}✅ Paleta activa configurada: '${activePalette}'${colors.reset}`);
    results.passed++;
    
    if (palettes.includes(activePalette)) {
      console.log(`${colors.green}✅ Paleta activa es válida${colors.reset}`);
      results.passed++;
    } else {
      console.log(`${colors.red}❌ Paleta activa no es válida${colors.reset}`);
      results.failed++;
      results.details.push(`Invalid active palette: ${activePalette}`);
    }
  } else {
    console.log(`${colors.red}❌ ACTIVE_PALETTE no encontrada${colors.reset}`);
    results.failed++;
    results.details.push('ACTIVE_PALETTE configuration not found');
  }

  // Verificar funciones helper
  const helperFunctions = [
    'getPrimaryColor',
    'getSemanticColor',
    'getPrimaryGradient',
    'getMaterialUIThemeColors'
  ];
  
  helperFunctions.forEach(func => {
    if (colorSystemContent.includes(`export const ${func}`)) {
      console.log(`${colors.green}✅ Función helper '${func}' exportada${colors.reset}`);
      results.passed++;
    } else {
      console.log(`${colors.red}❌ Función helper '${func}' faltante${colors.reset}`);
      results.failed++;
      results.details.push(`Missing helper function: ${func}`);
    }
  });
}

console.log(`\n${colors.blue}🏗️ Verificando componente de demostración...${colors.reset}`);

// 6. Verificar componente de demostración
checkFile('src/components/demo/ColorSystemDemo.tsx', 'Componente de demostración existe');

console.log(`\n${colors.blue}⚠️  Verificando archivos legacy que deberían ser reemplazados...${colors.reset}`);

// 7. Verificar archivos legacy (warnings)
if (fs.existsSync('src/theme.ts')) {
  console.log(`${colors.yellow}⚠️  Archivo legacy 'src/theme.ts' aún existe (considerar eliminar después de migración completa)${colors.reset}`);
  results.warnings++;
}

if (fs.existsSync('src/styles/theme-autumn.ts')) {
  console.log(`${colors.yellow}⚠️  Archivo legacy 'src/styles/theme-autumn.ts' aún existe (ya no necesario con sistema centralizado)${colors.reset}`);
  results.warnings++;
}

// Resumen final
console.log(`\n${colors.bright}===============================================================================`);
console.log(`📊 RESUMEN DE VERIFICACIÓN:${colors.reset}`);
console.log(`${colors.green}✅ Pasadas: ${results.passed}${colors.reset}`);
console.log(`${colors.red}❌ Fallidas: ${results.failed}${colors.reset}`);
console.log(`${colors.yellow}⚠️  Advertencias: ${results.warnings}${colors.reset}`);

if (results.failed === 0) {
  console.log(`\n${colors.green}${colors.bright}🎉 ¡INTEGRACIÓN EXITOSA! El sistema centralizado de colores está correctamente integrado.${colors.reset}`);
  console.log(`\n${colors.cyan}🎯 Próximos pasos:${colors.reset}`);
  console.log(`1. Probar cambiar ACTIVE_PALETTE en src/design-system/color-system.ts`);
  console.log(`2. Verificar que toda la aplicación se actualiza automáticamente`);
  console.log(`3. Usar el componente ColorSystemDemo para visualizar las paletas`);
  if (results.warnings > 0) {
    console.log(`4. Considerar eliminar archivos legacy cuando ya no se necesiten`);
  }
} else {
  console.log(`\n${colors.red}${colors.bright}❌ INTEGRACIÓN INCOMPLETA${colors.reset}`);
  console.log(`\n${colors.yellow}🔧 Problemas encontrados:${colors.reset}`);
  results.details.forEach(detail => {
    console.log(`   • ${detail}`);
  });
}

console.log(`\n${colors.cyan}📚 Para más información, consulta COLOR_SYSTEM_GUIDE.md${colors.reset}`);

// Exit code
process.exit(results.failed === 0 ? 0 : 1);