import { test, expect } from '@playwright/test';

/**
 * Test para verificar qué contenido de todo lo recopilado aparece en la aplicación CoomÜnity SuperApp
 */

test.describe('CoomÜnity SuperApp - Verificación de Contenido Recopilado', () => {
  
  test.beforeEach(async ({ page }) => {
    // Navegar a la aplicación principal
    await page.goto('http://localhost:2222');
    await page.waitForLoadState('networkidle');
  });

  test('Verificar estructura principal de la aplicación', async ({ page }) => {
    // Verificar título de la página
    await expect(page).toHaveTitle(/CoomÜnity|SuperApp|Coomunity/i);
    
    // Tomar screenshot de la página principal
    await page.screenshot({ path: 'test-results/screenshots/homepage.png', fullPage: true });
    
    console.log('✅ Página principal cargada correctamente');
  });

  test('Verificar componentes del header/navegación', async ({ page }) => {
    // Buscar elementos de navegación común
    const navigationElements = [
      'nav', 'header', '[role="navigation"]',
      'a[href*="home"]', 'a[href*="profile"]', 'a[href*="wallet"]',
      'button[aria-label*="menu"]', '[data-testid*="nav"]'
    ];

    let foundElements = [];
    for (const selector of navigationElements) {
      const element = await page.locator(selector).first();
      if (await element.isVisible().catch(() => false)) {
        const text = await element.textContent().catch(() => '');
        foundElements.push({ selector, text: text?.slice(0, 50) });
      }
    }

    console.log('🧭 Elementos de navegación encontrados:', foundElements);
    
    // Verificar que al menos hay algún elemento de navegación
    expect(foundElements.length).toBeGreaterThan(0);
  });

  test('Verificar módulos específicos de CoomÜnity', async ({ page }) => {
    // Buscar elementos específicos de los módulos extraídos
    const coomunityModules = [
      // Pilgrim/Journey elements
      { module: 'Pilgrim', selectors: ['[data-testid*="pilgrim"]', '[class*="pilgrim"]', 'text=/pilgrim/i'] },
      
      // Wallet elements  
      { module: 'Wallet', selectors: ['[data-testid*="wallet"]', '[class*="wallet"]', 'text=/wallet/i', 'text=/saldo/i'] },
      
      // Gossip/Social elements
      { module: 'Social/Gossip', selectors: ['[data-testid*="gossip"]', '[class*="gossip"]', 'text=/gossip/i', 'text=/social/i'] },
      
      // Matches elements
      { module: 'Matches', selectors: ['[data-testid*="match"]', '[class*="match"]', 'text=/match/i', 'text=/encuentro/i'] },
      
      // Gigs/Jobs elements
      { module: 'Gigs', selectors: ['[data-testid*="gig"]', '[class*="gig"]', 'text=/gig/i', 'text=/trabajo/i'] },
      
      // Merchant elements
      { module: 'Merchant', selectors: ['[data-testid*="merchant"]', '[class*="merchant"]', 'text=/merchant/i', 'text=/comercio/i'] },
    ];

    let moduleResults = [];

    for (const { module, selectors } of coomunityModules) {
      let foundInModule = [];
      
      for (const selector of selectors) {
        try {
          const elements = await page.locator(selector).all();
          if (elements.length > 0) {
            for (const element of elements.slice(0, 3)) { // Máximo 3 elementos por selector
              if (await element.isVisible().catch(() => false)) {
                const text = await element.textContent().catch(() => '');
                const tagName = await element.evaluate(el => el.tagName).catch(() => '');
                foundInModule.push({ 
                  selector, 
                  text: text?.slice(0, 100),
                  tag: tagName
                });
              }
            }
          }
        } catch (error) {
          // Selector no válido o error, continuar
        }
      }
      
      moduleResults.push({
        module,
        found: foundInModule.length > 0,
        elements: foundInModule
      });
    }

    console.log('🎯 Resultados de módulos CoomÜnity:');
    moduleResults.forEach(result => {
      console.log(`${result.found ? '✅' : '❌'} ${result.module}: ${result.elements.length} elementos encontrados`);
      result.elements.forEach(elem => {
        console.log(`   - ${elem.tag}: "${elem.text}" (${elem.selector})`);
      });
    });

    // Al menos algunos módulos deberían estar presentes
    const foundModules = moduleResults.filter(r => r.found);
    expect(foundModules.length).toBeGreaterThan(0);
  });

  test('Verificar contenido multimedia y assets', async ({ page }) => {
    // Buscar imágenes, videos y otros assets
    const mediaElements = await page.locator('img, video, audio, svg').all();
    const backgroundImages = await page.locator('[style*="background-image"]').all();
    
    let mediaFound = [];
    
    for (const element of mediaElements) {
      const tagName = await element.evaluate(el => el.tagName).catch(() => '');
      const src = await element.getAttribute('src').catch(() => null);
      const alt = await element.getAttribute('alt').catch(() => null);
      
      if (src || alt) {
        mediaFound.push({ tag: tagName, src, alt });
      }
    }

    console.log('🎨 Elementos multimedia encontrados:');
    mediaFound.forEach(media => {
      console.log(`   - ${media.tag}: ${media.src || 'No src'} (alt: ${media.alt || 'No alt'})`);
    });

    console.log(`📊 Total elementos multimedia: ${mediaFound.length}`);
    console.log(`🖼️  Elementos con background-image: ${backgroundImages.length}`);
  });

  test('Verificar funcionalidades interactivas', async ({ page }) => {
    // Buscar botones, formularios y elementos interactivos
    const interactiveElements = await page.locator('button, input, select, textarea, [role="button"], [onclick], [href]').all();
    
    let interactions = [];
    
    for (const element of interactiveElements.slice(0, 20)) { // Limitar a 20 elementos
      const tagName = await element.evaluate(el => el.tagName).catch(() => '');
      const text = await element.textContent().catch(() => '');
      const type = await element.getAttribute('type').catch(() => null);
      const role = await element.getAttribute('role').catch(() => null);
      
      if (await element.isVisible().catch(() => false)) {
        interactions.push({
          tag: tagName,
          text: text?.slice(0, 50),
          type,
          role
        });
      }
    }

    console.log('🔗 Elementos interactivos encontrados:');
    interactions.forEach(inter => {
      console.log(`   - ${inter.tag}${inter.type ? `[${inter.type}]` : ''}${inter.role ? `[${inter.role}]` : ''}: "${inter.text}"`);
    });

    expect(interactions.length).toBeGreaterThan(0);
  });

  test('Verificar datos y configuración', async ({ page }) => {
    // Verificar si hay datos de configuración o contenido dinámico
    const scripts = await page.locator('script').all();
    
    let configData = [];
    
    for (const script of scripts) {
      const content = await script.textContent().catch(() => '');
      if (content && (content.includes('config') || content.includes('data') || content.includes('window.'))) {
        configData.push(content.slice(0, 200) + '...');
      }
    }

    console.log('⚙️ Scripts de configuración encontrados:', configData.length);
    
    // Verificar variables globales de la aplicación
    const windowVars = await page.evaluate(() => {
      const vars = [];
      for (const key in window) {
        if (key.toLowerCase().includes('config') || 
            key.toLowerCase().includes('data') || 
            key.toLowerCase().includes('coomunity')) {
          vars.push(key);
        }
      }
      return vars;
    });

    console.log('🌐 Variables globales relacionadas:', windowVars);
  });

  test('Análisis completo de la página', async ({ page }) => {
    // Obtener estadísticas generales de la página
    const pageStats = await page.evaluate(() => {
      return {
        title: document.title,
        url: window.location.href,
        totalElements: document.querySelectorAll('*').length,
        totalImages: document.querySelectorAll('img').length,
        totalLinks: document.querySelectorAll('a').length,
        totalButtons: document.querySelectorAll('button').length,
        totalForms: document.querySelectorAll('form').length,
        bodyClasses: document.body.className,
        bodyId: document.body.id,
        metaDescription: document.querySelector('meta[name="description"]')?.content || 'No description',
        hasReact: !!(window.React || document.querySelector('[data-reactroot]') || document.querySelector('#root')),
        hasVue: !!(window.Vue),
        hasAngular: !!(window.angular || window.ng),
      };
    });

    console.log('📊 Estadísticas completas de la página:');
    console.log(JSON.stringify(pageStats, null, 2));

    // Guardar captura completa
    await page.screenshot({ 
      path: 'test-results/screenshots/complete-analysis.png', 
      fullPage: true 
    });

    expect(pageStats.totalElements).toBeGreaterThan(10);
  });
}); 