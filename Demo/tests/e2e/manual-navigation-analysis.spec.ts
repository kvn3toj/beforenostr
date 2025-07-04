import { test, expect } from '@playwright/test';

/**
 * Análisis manual navegando por cada módulo para ver qué contenido real hay
 */

test.describe('Navegación Manual Detallada - CoomÜnity SuperApp', () => {
  
  test('Analizar cada módulo de navegación detalladamente', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');

    console.log('🔍 Iniciando análisis manual detallado de cada módulo...');

    // Obtener todos los botones/enlaces de navegación
    const navigationButtons = await page.locator('[role="button"], button, a').all();
    const navigationItems = [];

    // Extraer información de navegación
    for (const nav of navigationButtons) {
      try {
        if (await nav.isVisible()) {
          const text = await nav.textContent();
          const role = await nav.getAttribute('role').catch(() => null);
          const href = await nav.getAttribute('href').catch(() => null);
          const className = await nav.getAttribute('class').catch(() => null);
          
          if (text && text.trim() && 
              !text.includes('Usuario') && 
              !text.includes('3') && 
              text.length > 2) {
            navigationItems.push({
              text: text.trim(),
              element: nav,
              role,
              href,
              className
            });
          }
        }
      } catch (error) {
        // Continuar
      }
    }

    console.log('🧭 Elementos de navegación encontrados:');
    navigationItems.forEach((item, index) => {
      console.log(`${index + 1}. "${item.text}" (${item.role || 'no-role'}) - ${item.className?.slice(0, 50) || 'no-class'}`);
    });

    // Analizar cada módulo individualmente
    const moduleAnalysis = [];

    for (const item of navigationItems.slice(0, 10)) { // Limitar para no saturar
      console.log(`\n🔍 Analizando módulo: "${item.text}"`);
      
      try {
        // Hacer click en el elemento
        await item.element.click();
        await page.waitForTimeout(2000); // Esperar carga
        
        // Obtener contenido de la página
        const title = await page.title();
        const bodyText = await page.locator('body').textContent();
        const headings = await page.locator('h1, h2, h3, h4, h5, h6').allTextContents();
        const buttons = await page.locator('button').allTextContents();
        const links = await page.locator('a').allTextContents();
        const forms = await page.locator('form').count();
        const inputs = await page.locator('input').count();
        
        // Buscar indicadores de estado de desarrollo
        const developmentIndicators = [
          'en desarrollo', 'development', 'coming soon', 'próximamente',
          'funcionalidad en desarrollo', 'under construction', 'placeholder',
          'demo', 'beta', 'wip', 'pronto', 'pendiente', 'not implemented'
        ];
        
        let isDevelopment = false;
        let developmentText = [];
        
        for (const indicator of developmentIndicators) {
          if (bodyText?.toLowerCase().includes(indicator.toLowerCase())) {
            isDevelopment = true;
            developmentText.push(indicator);
          }
        }

        // Determinar el nivel de implementación
        let implementationLevel = 'unknown';
        if (isDevelopment) {
          implementationLevel = 'in-development';
        } else if (bodyText && bodyText.length > 2000) {
          implementationLevel = 'fully-implemented';
        } else if (bodyText && bodyText.length > 500) {
          implementationLevel = 'basic-implemented';
        } else {
          implementationLevel = 'minimal-content';
        }

        const analysis = {
          module: item.text,
          title,
          contentLength: bodyText?.length || 0,
          headingsCount: headings.length,
          buttonsCount: buttons.length,
          linksCount: links.length,
          formsCount: forms,
          inputsCount: inputs,
          implementationLevel,
          isDevelopment,
          developmentText,
          topHeadings: headings.slice(0, 3),
          topButtons: buttons.slice(0, 5).filter(b => b.trim().length > 0),
          contentPreview: bodyText?.slice(0, 500) + '...' || 'No content'
        };

        moduleAnalysis.push(analysis);

        console.log(`   - Título: ${title}`);
        console.log(`   - Contenido: ${analysis.contentLength} chars`);
        console.log(`   - Nivel implementación: ${implementationLevel}`);
        console.log(`   - En desarrollo: ${isDevelopment ? 'SÍ' : 'NO'}`);
        if (developmentText.length > 0) {
          console.log(`   - Indicadores desarrollo: ${developmentText.join(', ')}`);
        }
        console.log(`   - Elementos: ${analysis.headingsCount}h, ${analysis.buttonsCount}btn, ${analysis.formsCount}forms`);
        console.log(`   - Preview: "${analysis.contentPreview.slice(0, 100)}..."`);

        // Tomar screenshot del módulo
        await page.screenshot({ 
          path: `test-results/screenshots/module-${item.text.replace(/[^a-zA-Z0-9]/g, '_')}.png`
        });

      } catch (error) {
        console.log(`   ❌ Error analizando "${item.text}": ${error.message}`);
        moduleAnalysis.push({
          module: item.text,
          error: error.message,
          implementationLevel: 'error'
        });
      }

      // Volver al inicio
      await page.goto('http://localhost:3000');
      await page.waitForLoadState('networkidle');
    }

    // Generar resumen final
    console.log('\n📊 RESUMEN DETALLADO DE MÓDULOS:');
    console.log('=' * 60);

    const implementationStats = {};
    moduleAnalysis.forEach(module => {
      implementationStats[module.implementationLevel] = (implementationStats[module.implementationLevel] || 0) + 1;
    });

    console.log('\n📈 Estadísticas de implementación:');
    Object.entries(implementationStats).forEach(([level, count]) => {
      const icon = {
        'fully-implemented': '✅',
        'basic-implemented': '🟡',
        'in-development': '🚧',
        'minimal-content': '⚠️',
        'error': '❌',
        'unknown': '❓'
      }[level] || '❓';
      
      console.log(`   ${icon} ${level}: ${count} módulos`);
    });

    // Identificar módulos en desarrollo o con contenido mínimo
    const needsWork = moduleAnalysis.filter(m => 
      m.implementationLevel === 'in-development' || 
      m.implementationLevel === 'minimal-content' ||
      m.isDevelopment
    );

    if (needsWork.length > 0) {
      console.log('\n🎯 MÓDULOS QUE NECESITAN TRABAJO:');
      needsWork.forEach((module, index) => {
        console.log(`\n${index + 1}. 🚧 ${module.module}:`);
        console.log(`   - Estado: ${module.implementationLevel}`);
        console.log(`   - Contenido: ${module.contentLength} caracteres`);
        if (module.developmentText && module.developmentText.length > 0) {
          console.log(`   - Indicadores: ${module.developmentText.join(', ')}`);
        }
        console.log(`   - Elementos UI: ${module.headingsCount || 0} títulos, ${module.buttonsCount || 0} botones`);
        
        // Sugerir carpeta de contenido extraído
        const extractedSuggestions = {
          'Pilgrim': 'coomunity_pilgrim_demo',
          'Social': 'coomunity_gossip',
          'Marketplace': 'coomunity_merchant_dev',
          'Wallet': 'coomunity_wallet',
          'ÜPlay': 'coomunity_gigs_add', // Posible correlación
          'ÜStats': 'coomunity_search_params' // Posible correlación
        };
        
        const suggestion = extractedSuggestions[module.module];
        if (suggestion) {
          console.log(`   💡 Sugerencia: Usar contenido de data/extracted/${suggestion}/`);
        }
      });
    }

    // Módulos con buena implementación
    const wellImplemented = moduleAnalysis.filter(m => 
      m.implementationLevel === 'fully-implemented' || 
      m.implementationLevel === 'basic-implemented'
    );

    if (wellImplemented.length > 0) {
      console.log('\n✅ MÓDULOS BIEN IMPLEMENTADOS:');
      wellImplemented.forEach((module, index) => {
        console.log(`${index + 1}. ${module.module} (${module.contentLength} chars, ${module.headingsCount} títulos)`);
      });
    }

    console.log('\n🎯 RECOMENDACIONES FINALES:');
    console.log('1. Priorizar módulos con implementación mínima que tienen contenido extraído disponible');
    console.log('2. Revisar módulos marcados como "en desarrollo" para completar funcionalidades');
    console.log('3. Usar assets y contenido de data/extracted/ para enriquecer módulos existentes');
    console.log('4. Mantener la estructura de navegación actual que funciona bien');

  });
}); 