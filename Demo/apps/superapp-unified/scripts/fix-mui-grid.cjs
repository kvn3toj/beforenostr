#!/usr/bin/env node

/**
 * Script para corregir automáticamente las props obsoletas de MUI Grid v1 a v2
 * 
 * Cambios que realiza:
 * - <Grid item xs={12} sm={6}> → <Grid size={{ xs: 12, sm: 6 }}>
 * - <Grid item> → <Grid> (cuando no hay props de tamaño)
 * 
 * Uso: node scripts/fix-mui-grid.js
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Directorio base del SuperApp
const BASE_DIR = path.join(__dirname, '../src');

// Función para procesar un archivo
function processFile(filePath) {
  console.log(`🔧 Procesando: ${filePath}`);
  
  let content = fs.readFileSync(filePath, 'utf8');
  let hasChanges = false;
  
  // Patrón para detectar Grid con item y props de tamaño
  const gridItemWithSizePattern = /<Grid\s+item\s+([^>]*?)>/g;
  
  content = content.replace(gridItemWithSizePattern, (match, props) => {
    // Extraer props de tamaño (xs, sm, md, lg, xl)
    const sizeProps = {};
    const sizePattern = /(xs|sm|md|lg|xl)=\{?(\d+)\}?/g;
    let sizeMatch;
    
    while ((sizeMatch = sizePattern.exec(props)) !== null) {
      sizeProps[sizeMatch[1]] = parseInt(sizeMatch[2]);
    }
    
    // Si tiene props de tamaño, convertir a nueva sintaxis
    if (Object.keys(sizeProps).length > 0) {
      // Remover las props de tamaño del string original
      let cleanProps = props.replace(/(xs|sm|md|lg|xl)=\{?\d+\}?/g, '').trim();
      
      // Crear el objeto size
      const sizeObj = JSON.stringify(sizeProps).replace(/"/g, '');
      
      // Construir el nuevo Grid
      const newGrid = cleanProps 
        ? `<Grid size={${sizeObj}} ${cleanProps}>`
        : `<Grid size={${sizeObj}}>`;
      
      hasChanges = true;
      console.log(`  ✅ ${match} → ${newGrid}`);
      return newGrid;
    }
    
    // Si no tiene props de tamaño, solo remover 'item'
    if (props.includes('item')) {
      const cleanProps = props.replace(/\bitem\b/g, '').trim();
      const newGrid = cleanProps ? `<Grid ${cleanProps}>` : `<Grid>`;
      
      hasChanges = true;
      console.log(`  ✅ ${match} → ${newGrid}`);
      return newGrid;
    }
    
    return match;
  });
  
  // Patrón para Grid solo con 'item' (sin props de tamaño)
  const gridItemOnlyPattern = /<Grid\s+item\s*>/g;
  content = content.replace(gridItemOnlyPattern, (match) => {
    hasChanges = true;
    console.log(`  ✅ ${match} → <Grid>`);
    return '<Grid>';
  });
  
  // Guardar cambios si los hay
  if (hasChanges) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`  💾 Archivo actualizado`);
    return true;
  } else {
    console.log(`  ⏭️  Sin cambios necesarios`);
    return false;
  }
}

// Función principal
function main() {
  console.log('🚀 Iniciando corrección de MUI Grid props obsoletas...\n');
  
  // Buscar todos los archivos .tsx en src
  const pattern = path.join(BASE_DIR, '**/*.tsx');
  const files = glob.sync(pattern);
  
  console.log(`📁 Encontrados ${files.length} archivos .tsx\n`);
  
  let processedFiles = 0;
  let modifiedFiles = 0;
  
  files.forEach(file => {
    const relativePath = path.relative(process.cwd(), file);
    
    try {
      const wasModified = processFile(file);
      processedFiles++;
      
      if (wasModified) {
        modifiedFiles++;
      }
      
      console.log(''); // Línea en blanco entre archivos
    } catch (error) {
      console.error(`❌ Error procesando ${relativePath}:`, error.message);
    }
  });
  
  console.log('📊 RESUMEN:');
  console.log(`   Archivos procesados: ${processedFiles}`);
  console.log(`   Archivos modificados: ${modifiedFiles}`);
  console.log(`   Archivos sin cambios: ${processedFiles - modifiedFiles}`);
  
  if (modifiedFiles > 0) {
    console.log('\n✅ Corrección completada exitosamente!');
    console.log('🔄 Recomendación: Reinicia el servidor de desarrollo para ver los cambios');
  } else {
    console.log('\n✨ Todos los archivos ya están actualizados!');
  }
}

// Ejecutar solo si es llamado directamente
if (require.main === module) {
  main();
}

module.exports = { processFile, main }; 