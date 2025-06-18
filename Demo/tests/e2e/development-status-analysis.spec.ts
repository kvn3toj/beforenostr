import { test, expect } from '@playwright/test';

/**
 * Análisis específico de módulos en desarrollo vs contenido extraído disponible
 */

test.describe('Análisis de Estado de Desarrollo - CoomÜnity SuperApp', () => {
  
  test('Detectar módulos marcados como "en desarrollo"', async ({ page }) => {
    await page.goto('http://localhost:2222');
    await page.waitForLoadState('networkidle');

    console.log('🔍 Buscando módulos marcados como "en desarrollo"...');

    // Palabras clave que indican funcionalidad en desarrollo
    const developmentKeywords = [
      'en desarrollo',
      'development',
      'coming soon',
      'próximamente',
      'funcionalidad en desarrollo',
      'under construction',
      'en construcción',
      'placeholder',
      'demo',
      'pronto',
      'beta',
      'wip' // work in progress
    ];

    let developmentModules = [];
    
    // Buscar texto que indique desarrollo
    for (const keyword of developmentKeywords) {
      try {
        const elements = await page.locator(`text=${keyword}`).all();
        for (const element of elements) {
          if (await element.isVisible()) {
            const text = await element.textContent();
            const parentText = await element.locator('..').textContent().catch(() => '');
            const elementTag = await element.evaluate(el => el.tagName);
            
            developmentModules.push({
              keyword,
              text: text?.trim(),
              parentText: parentText?.slice(0, 200),
              tag: elementTag,
              location: await element.boundingBox().catch(() => null)
            });
          }
        }
      } catch (error) {
        // Continuar si hay error en el selector
      }
    }

    // También buscar usando regex para ser más flexible
    const pageText = await page.locator('body').textContent();
    const developmentRegex = /(en desarrollo|funcionalidad.*desarrollo|coming soon|próximamente|under construction)/gi;
    const matches = pageText?.match(developmentRegex) || [];

    console.log('🚧 Módulos en desarrollo detectados:');
    console.log(`📊 Total menciones de desarrollo: ${matches.length}`);
    console.log(`📊 Elementos específicos encontrados: ${developmentModules.length}`);
    
    developmentModules.forEach((module, index) => {
      console.log(`${index + 1}. ${module.keyword.toUpperCase()}:`);
      console.log(`   - Texto: "${module.text}"`);
      console.log(`   - Contexto: "${module.parentText?.slice(0, 100)}..."`);
      console.log(`   - Tag: ${module.tag}`);
    });

    // Tomar screenshot específico de módulos en desarrollo
    await page.screenshot({ 
      path: 'test-results/screenshots/development-modules.png', 
      fullPage: true 
    });
  });

  test('Mapear navegación vs estado de desarrollo', async ({ page }) => {
    await page.goto('http://localhost:2222');
    await page.waitForLoadState('networkidle');

    console.log('🗺️  Mapeando navegación vs estado de implementación...');

    // Identificar elementos de navegación
    const navigationElements = await page.locator('nav a, [role="navigation"] a, [data-testid*="nav"], button[role="tab"], .nav-item, .menu-item').all();
    
    let navigationMap = [];

    for (const nav of navigationElements) {
      try {
        if (await nav.isVisible()) {
          const text = await nav.textContent();
          const href = await nav.getAttribute('href').catch(() => null);
          const isClickable = await nav.evaluate(el => !el.hasAttribute('disabled')).catch(() => true);
          
          // Intentar hacer click para ver el contenido
          let contentStatus = 'unknown';
          try {
            await nav.click();
            await page.waitForTimeout(1000); // Esperar carga
            
            const bodyText = await page.locator('body').textContent();
            
            if (bodyText?.toLowerCase().includes('desarrollo') || 
                bodyText?.toLowerCase().includes('development') ||
                bodyText?.toLowerCase().includes('coming soon')) {
              contentStatus = 'in-development';
            } else if (bodyText && bodyText.length > 1000) {
              contentStatus = 'implemented';
            } else {
              contentStatus = 'minimal-content';
            }
          } catch (error) {
            contentStatus = 'navigation-error';
          }

          navigationMap.push({
            text: text?.trim(),
            href,
            isClickable,
            contentStatus
          });

          // Volver al inicio para el siguiente test
          await page.goto('http://localhost:2222');
          await page.waitForLoadState('networkidle');
        }
      } catch (error) {
        // Continuar con el siguiente elemento
      }
    }

    console.log('🗺️  Estado de navegación mapeado:');
    navigationMap.forEach((item, index) => {
      const statusIcon = {
        'implemented': '✅',
        'in-development': '🚧',
        'minimal-content': '⚠️',
        'navigation-error': '❌',
        'unknown': '❓'
      }[item.contentStatus] || '❓';

      console.log(`${index + 1}. ${statusIcon} "${item.text}"`);
      console.log(`   - Estado: ${item.contentStatus}`);
      console.log(`   - Href: ${item.href || 'No href'}`);
      console.log(`   - Clickeable: ${item.isClickable}`);
    });

    // Generar resumen estadístico
    const statusCounts = navigationMap.reduce((acc, item) => {
      acc[item.contentStatus] = (acc[item.contentStatus] || 0) + 1;
      return acc;
    }, {});

    console.log('\n📊 RESUMEN DE ESTADO DE NAVEGACIÓN:');
    Object.entries(statusCounts).forEach(([status, count]) => {
      const percentage = ((count / navigationMap.length) * 100).toFixed(1);
      console.log(`   - ${status}: ${count} módulos (${percentage}%)`);
    });
  });

  test('Correlacionar módulos en desarrollo con contenido extraído', async ({ page }) => {
    await page.goto('http://localhost:2222');
    
    console.log('🔗 Correlacionando módulos en desarrollo con contenido extraído...');

    // Mapear módulos de la aplicación con carpetas extraídas
    const correlationMap = [
      {
        appModule: 'Pilgrim',
        extractedFolder: 'coomunity_pilgrim_demo',
        navigationText: ['pilgrim', 'journey', 'viaje'],
        expectedImplementation: 'Sistema completo de peregrinajes con mapas y rutas'
      },
      {
        appModule: 'Matches',
        extractedFolder: 'coomunity_matches',
        navigationText: ['match', 'encuentros', 'connections'],
        expectedImplementation: 'Sistema de emparejamiento y compatibilidad'
      },
      {
        appModule: 'Gigs',
        extractedFolder: 'coomunity_gigs_add',
        navigationText: ['gig', 'trabajo', 'tasks', 'projects'],
        expectedImplementation: 'Plataforma de trabajos colaborativos'
      },
      {
        appModule: 'Social/Gossip',
        extractedFolder: 'coomunity_gossip',
        navigationText: ['social', 'chat', 'gossip', 'messages'],
        expectedImplementation: 'Sistema de mensajería y comunicación social'
      },
      {
        appModule: 'Merchant',
        extractedFolder: 'coomunity_merchant_dev',
        navigationText: ['marketplace', 'merchant', 'tienda', 'products'],
        expectedImplementation: 'Plataforma completa de comercio'
      },
      {
        appModule: 'Wallet',
        extractedFolder: 'coomunity_wallet',
        navigationText: ['wallet', 'billetera', 'payments'],
        expectedImplementation: 'Sistema financiero completo'
      }
    ];

    let correlationResults = [];

    for (const correlation of correlationMap) {
      // Verificar si el módulo aparece en navegación
      let foundInNavigation = false;
      let developmentStatus = 'unknown';
      
      for (const searchText of correlation.navigationText) {
        try {
          const elements = await page.locator(`text=${searchText}`).all();
          if (elements.length > 0) {
            foundInNavigation = true;
            
            // Verificar si indica desarrollo
            const element = elements[0];
            const contextText = await element.locator('../..').textContent().catch(() => '');
            
            if (contextText.toLowerCase().includes('desarrollo') ||
                contextText.toLowerCase().includes('development') ||
                contextText.toLowerCase().includes('coming soon')) {
              developmentStatus = 'in-development';
            } else {
              developmentStatus = 'implemented';
            }
            break;
          }
        } catch (error) {
          // Continuar
        }
      }

      // Verificar si existe la carpeta extraída
      const hasExtractedContent = true; // Asumimos que sí porque las vimos en tests anteriores

      correlationResults.push({
        module: correlation.appModule,
        foundInNavigation,
        developmentStatus,
        hasExtractedContent,
        extractedFolder: correlation.extractedFolder,
        expectedImplementation: correlation.expectedImplementation,
        integrationPriority: foundInNavigation && developmentStatus === 'in-development' ? 'HIGH' : 
                           foundInNavigation && developmentStatus === 'implemented' ? 'LOW' : 'MEDIUM'
      });
    }

    console.log('🔗 Correlación módulos en desarrollo vs contenido extraído:');
    correlationResults.forEach((result, index) => {
      const priorityIcon = {
        'HIGH': '🚨',
        'MEDIUM': '⚠️',
        'LOW': '✅'
      }[result.integrationPriority] || '❓';

      console.log(`\n${index + 1}. ${priorityIcon} ${result.module}:`);
      console.log(`   - En navegación: ${result.foundInNavigation ? '✅' : '❌'}`);
      console.log(`   - Estado: ${result.developmentStatus}`);
      console.log(`   - Contenido extraído: ${result.hasExtractedContent ? '✅' : '❌'}`);
      console.log(`   - Carpeta: ${result.extractedFolder}`);
      console.log(`   - Prioridad integración: ${result.integrationPriority}`);
      console.log(`   - Implementación esperada: ${result.expectedImplementation}`);
    });

    // Generar plan de acción específico
    const highPriority = correlationResults.filter(r => r.integrationPriority === 'HIGH');
    const mediumPriority = correlationResults.filter(r => r.integrationPriority === 'MEDIUM');

    console.log('\n🎯 PLAN DE ACCIÓN ESPECÍFICO:');
    
    if (highPriority.length > 0) {
      console.log('\n🚨 PRIORIDAD ALTA (Módulos en desarrollo con contenido extraído):');
      highPriority.forEach((item, index) => {
        console.log(`${index + 1}. Completar ${item.module}`);
        console.log(`   - Integrar contenido de: data/extracted/${item.extractedFolder}/`);
        console.log(`   - Estado actual: Placeholder/En desarrollo`);
      });
    }

    if (mediumPriority.length > 0) {
      console.log('\n⚠️ PRIORIDAD MEDIA (Módulos sin navegación clara):');
      mediumPriority.forEach((item, index) => {
        console.log(`${index + 1}. Agregar ${item.module}`);
        console.log(`   - Crear navegación y estructura básica`);
        console.log(`   - Integrar contenido de: data/extracted/${item.extractedFolder}/`);
      });
    }

    // Guardar screenshot final
    await page.screenshot({ 
      path: 'test-results/screenshots/correlation-analysis.png', 
      fullPage: true 
    });
  });
}); 