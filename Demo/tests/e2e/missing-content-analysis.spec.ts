import { test, expect } from '@playwright/test';
import { readdir, readFile } from 'fs/promises';
import { join } from 'path';

/**
 * Análisis específico de contenido extraído vs contenido presente en la aplicación
 */

test.describe('Análisis de Contenido Faltante - CoomÜnity SuperApp', () => {
  
  test('Analizar datos extraídos vs contenido actual', async ({ page }) => {
    await page.goto('http://localhost:2222');
    await page.waitForLoadState('networkidle');

    // Obtener todo el contenido textual de la página
    const pageText = await page.locator('body').textContent();
    const pageHTML = await page.locator('body').innerHTML();

    console.log('🔍 Analizando contenido extraído vs contenido actual...');

    // Verificar menciones de módulos específicos extraídos
    const extractedModules = {
      'coomunity_pilgrim_demo': {
        expectedElements: ['pilgrim', 'journey', 'viaje', 'peregrinaje'],
        found: false,
        details: []
      },
      'coomunity_gossip': {
        expectedElements: ['gossip', 'chisme', 'chat', 'conversación', 'mensaje'],
        found: false,
        details: []
      },
      'coomunity_matches': {
        expectedElements: ['match', 'encuentro', 'conexión', 'pareja', 'compatibilidad'],
        found: false,
        details: []
      },
      'coomunity_gigs_add': {
        expectedElements: ['gig', 'trabajo', 'tarea', 'proyecto', 'colaboración'],
        found: false,
        details: []
      },
      'coomunity_wallet': {
        expectedElements: ['wallet', 'billetera', 'saldo', 'transacción', 'pago'],
        found: false,
        details: []
      },
      'coomunity_merchant_dev': {
        expectedElements: ['merchant', 'comerciante', 'vendedor', 'tienda', 'producto'],
        found: false,
        details: []
      }
    };

    // Analizar cada módulo
    for (const [moduleName, moduleData] of Object.entries(extractedModules)) {
      const foundElements = [];
      
      for (const element of moduleData.expectedElements) {
        const regex = new RegExp(element, 'gi');
        const matches = pageText?.match(regex) || [];
        if (matches.length > 0) {
          foundElements.push({ element, count: matches.length });
        }
      }
      
      extractedModules[moduleName].found = foundElements.length > 0;
      extractedModules[moduleName].details = foundElements;
    }

    console.log('📋 Análisis de módulos extraídos:');
    Object.entries(extractedModules).forEach(([module, data]) => {
      console.log(`${data.found ? '✅' : '❌'} ${module}:`);
      data.details.forEach(detail => {
        console.log(`   - "${detail.element}": ${detail.count} menciones`);
      });
      if (!data.found) {
        console.log(`   - No se encontraron elementos esperados: [${data.expectedElements.join(', ')}]`);
      }
    });

    // Verificar assets específicos extraídos
    const assetPatterns = [
      '/assets/', '/images/', '/css/', '/js/', 
      '.jpg', '.png', '.svg', '.mp4', '.mov'
    ];

    let foundAssets = [];
    for (const pattern of assetPatterns) {
      if (pageHTML?.includes(pattern)) {
        const regex = new RegExp(`[^\\s"']*${pattern}[^\\s"']*`, 'gi');
        const matches = pageHTML.match(regex) || [];
        foundAssets.push(...matches);
      }
    }

    console.log('🎨 Assets encontrados en la página:');
    foundAssets.forEach(asset => console.log(`   - ${asset}`));

    // Verificar funcionalidades específicas de cada módulo extraído
    await page.screenshot({ 
      path: 'test-results/screenshots/missing-content-analysis.png', 
      fullPage: true 
    });
  });

  test('Verificar estructura de archivos extraídos', async ({ page }) => {
    console.log('📁 Analizando estructura de archivos extraídos...');

    try {
      // Verificar contenido de data/extracted
      const extractedPath = join(process.cwd(), 'data', 'extracted');
      const extractedDirs = await readdir(extractedPath);
      
      console.log('📂 Carpetas extraídas encontradas:');
      extractedDirs.forEach(dir => console.log(`   - ${dir}`));

      // Analizar cada carpeta extraída
      for (const dir of extractedDirs.slice(0, 5)) { // Limitar a 5 para no saturar
        try {
          const dirPath = join(extractedPath, dir);
          const files = await readdir(dirPath);
          
          console.log(`\n📁 Contenido de ${dir}:`);
          console.log(`   - ${files.length} archivos/carpetas`);
          
          // Buscar archivos HTML específicos
          const htmlFiles = files.filter(f => f.endsWith('.html'));
          if (htmlFiles.length > 0) {
            console.log(`   - ${htmlFiles.length} archivos HTML encontrados:`, htmlFiles.slice(0, 3));
          }

          // Buscar carpetas de assets
          const assetDirs = files.filter(f => ['assets', 'css', 'images', 'js'].includes(f));
          if (assetDirs.length > 0) {
            console.log(`   - Carpetas de assets:`, assetDirs);
          }

        } catch (error) {
          console.log(`   - Error accediendo a ${dir}: ${error.message}`);
        }
      }

    } catch (error) {
      console.log('❌ Error accediendo a data/extracted:', error.message);
    }
  });

  test('Comparar funcionalidades implementadas vs extraídas', async ({ page }) => {
    await page.goto('http://localhost:2222');
    
    // Verificar funcionalidades específicas
    const functionalityChecks = [
      {
        name: 'Sistema de Pilgrim/Journey',
        selectors: ['[data-testid*="pilgrim"]', '[class*="journey"]', 'text=/peregrinaje/i'],
        expected: 'Funcionalidad completa de viajes/peregrinajes',
        status: 'unknown'
      },
      {
        name: 'Sistema de Matches/Encuentros',
        selectors: ['[data-testid*="match"]', '[class*="encuentro"]', 'text=/compatibilidad/i'],
        expected: 'Sistema de emparejamiento y encuentros',
        status: 'unknown'
      },
      {
        name: 'Sistema de Gigs/Trabajos',
        selectors: ['[data-testid*="gig"]', '[class*="trabajo"]', 'text=/colaboración/i'],
        expected: 'Plataforma de trabajos colaborativos',
        status: 'unknown'
      },
      {
        name: 'Sistema de Merchant/Comercio',
        selectors: ['[data-testid*="merchant"]', '[class*="tienda"]', 'text=/producto/i'],
        expected: 'Plataforma de comercio',
        status: 'unknown'
      },
      {
        name: 'Sistema de Gossip/Chat',
        selectors: ['[data-testid*="gossip"]', '[class*="chat"]', 'text=/mensaje/i'],
        expected: 'Sistema de mensajería y comunicación',
        status: 'unknown'
      }
    ];

    console.log('🔧 Verificando funcionalidades implementadas vs extraídas:');

    for (const functionality of functionalityChecks) {
      let found = false;
      
      for (const selector of functionality.selectors) {
        try {
          const elements = await page.locator(selector).all();
          if (elements.length > 0) {
            found = true;
            break;
          }
        } catch (error) {
          // Selector no válido, continuar
        }
      }
      
      functionality.status = found ? 'implementado' : 'no-implementado';
      
      console.log(`${found ? '✅' : '❌'} ${functionality.name}: ${functionality.status}`);
      if (!found) {
        console.log(`   - Esperado: ${functionality.expected}`);
        console.log(`   - Estado: Funcionalidad extraída pero no implementada en la app actual`);
      }
    }

    // Generar reporte de gaps
    const notImplemented = functionalityChecks.filter(f => f.status === 'no-implementado');
    
    console.log('\n📊 RESUMEN DE CONTENIDO FALTANTE:');
    console.log(`✅ Funcionalidades implementadas: ${functionalityChecks.length - notImplemented.length}`);
    console.log(`❌ Funcionalidades extraídas pero no implementadas: ${notImplemented.length}`);
    
    if (notImplemented.length > 0) {
      console.log('\n🚨 ACCIONES REQUERIDAS:');
      notImplemented.forEach((func, index) => {
        console.log(`${index + 1}. Implementar: ${func.name}`);
        console.log(`   - ${func.expected}`);
      });
    }
  });
}); 