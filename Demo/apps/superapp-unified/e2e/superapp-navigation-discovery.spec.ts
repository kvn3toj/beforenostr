import { test, expect } from '@playwright/test';

/**
 * 🔍 TEST DE DESCUBRIMIENTO DE NAVEGACIÓN - SUPERAPP
 * 
 * Este test identifica qué elementos de navegación están realmente disponibles
 * en la SuperApp para corregir los tests de integración.
 */

test.describe('🔍 Descubrimiento de Navegación SuperApp', () => {
  
  test.beforeEach(async ({ page }) => {
    // Navegar a la SuperApp
    await page.goto('/');
    
    // Esperar a que React se monte completamente
    await page.waitForSelector('#root', { timeout: 15000 });
    
    // Verificar que la aplicación esté cargada
    await page.waitForTimeout(3000);
  });

  test('🧭 Descubrir elementos de navegación disponibles', async ({ page }) => {
    console.log('🔍 Iniciando descubrimiento de navegación...');
    
    // Tomar screenshot inicial
    await page.screenshot({ path: 'navigation-discovery-initial.png', fullPage: true });
    
    // Buscar elementos de navegación comunes
    const navigationSelectors = [
      'nav',
      '[role="navigation"]',
      '.navigation',
      '.nav',
      '.navbar',
      '.menu',
      '.sidebar',
      '.drawer',
      'header',
      '.header',
      '[data-testid*="nav"]',
      '[data-testid*="menu"]',
      'a[href]',
      'button',
      '[role="button"]'
    ];
    
    console.log('🔍 Buscando elementos de navegación...');
    
    for (const selector of navigationSelectors) {
      const elements = await page.locator(selector).count();
      if (elements > 0) {
        console.log(`✅ Encontrados ${elements} elementos con selector: ${selector}`);
        
        // Obtener texto de los primeros 5 elementos
        for (let i = 0; i < Math.min(elements, 5); i++) {
          try {
            const text = await page.locator(selector).nth(i).textContent();
            if (text && text.trim().length > 0) {
              console.log(`   ${i + 1}. "${text.trim()}"`);
            }
          } catch (error) {
            // Ignorar errores de elementos no visibles
          }
        }
      }
    }
    
    // Buscar texto específico de módulos de SuperApp
    const superappModules = ['ÜPlay', 'Marketplace', 'Social', 'UStats', 'Challenges', 'Groups'];
    
    console.log('\n🎯 Buscando módulos específicos de SuperApp...');
    
    for (const module of superappModules) {
      const elements = await page.locator(`text=${module}`).count();
      if (elements > 0) {
        console.log(`✅ Módulo encontrado: "${module}" (${elements} elementos)`);
        
        // Verificar si es clickeable
        try {
          const firstElement = page.locator(`text=${module}`).first();
          const isVisible = await firstElement.isVisible();
          const isEnabled = await firstElement.isEnabled();
          console.log(`   - Visible: ${isVisible}, Enabled: ${isEnabled}`);
        } catch (error) {
          console.log(`   - Error verificando estado: ${error.message}`);
        }
      } else {
        console.log(`❌ Módulo NO encontrado: "${module}"`);
      }
    }
    
    // Obtener todo el texto visible de la página
    const pageText = await page.textContent('body');
    console.log(`\n📄 Contenido total de la página (${pageText?.length} caracteres):`);
    console.log(pageText?.substring(0, 500) + '...');
    
    // Buscar patrones de CoomÜnity
    const coomunityTerms = ['CoomÜnity', 'Reciprocidad', 'Mëritos', 'Öndas', 'Lükas'];
    console.log('\n🏷️ Buscando terminología CoomÜnity...');
    
    for (const term of coomunityTerms) {
      const found = pageText?.includes(term) || false;
      console.log(`${found ? '✅' : '❌'} "${term}": ${found}`);
    }
    
    // El test siempre pasa, es solo para descubrimiento
    expect(true).toBe(true);
  });

  test('🔗 Verificar rutas disponibles', async ({ page }) => {
    console.log('🔍 Descubriendo rutas disponibles...');
    
    const routesToTest = [
      '/',
      '/uplay',
      '/marketplace', 
      '/social',
      '/ustats',
      '/challenges',
      '/groups',
      '/wallet',
      '/profile',
      '/settings'
    ];
    
    const availableRoutes: string[] = [];
    const unavailableRoutes: string[] = [];
    
    for (const route of routesToTest) {
      try {
        console.log(`🎯 Probando ruta: ${route}`);
        
        await page.goto(route);
        await page.waitForSelector('#root', { timeout: 5000 });
        
        // Verificar que no sea una página 404
        const pageText = await page.textContent('body');
        const is404 = pageText?.includes('404') || pageText?.includes('Not Found') || pageText?.includes('Page not found');
        
        if (!is404) {
          availableRoutes.push(route);
          console.log(`✅ Ruta disponible: ${route}`);
          
          // Tomar screenshot de la ruta
          await page.screenshot({ path: `route-${route.replace('/', 'root')}.png` });
        } else {
          unavailableRoutes.push(route);
          console.log(`❌ Ruta 404: ${route}`);
        }
        
      } catch (error) {
        unavailableRoutes.push(route);
        console.log(`❌ Error en ruta ${route}: ${error.message}`);
      }
    }
    
    console.log(`\n📊 RESUMEN DE RUTAS:`);
    console.log(`✅ Disponibles (${availableRoutes.length}): ${availableRoutes.join(', ')}`);
    console.log(`❌ No disponibles (${unavailableRoutes.length}): ${unavailableRoutes.join(', ')}`);
    
    // Verificar que al menos la ruta raíz funcione
    expect(availableRoutes).toContain('/');
  });

  test('🎮 Verificar interacciones disponibles', async ({ page }) => {
    console.log('🔍 Descubriendo interacciones disponibles...');
    
    // Volver a la página principal
    await page.goto('/');
    await page.waitForSelector('#root');
    await page.waitForTimeout(3000);
    
    // Buscar elementos clickeables
    const clickableElements = await page.locator('a, button, [role="button"], [onclick], [data-testid*="button"]').count();
    console.log(`🖱️ Elementos clickeables encontrados: ${clickableElements}`);
    
    // Listar los primeros 10 elementos clickeables
    for (let i = 0; i < Math.min(clickableElements, 10); i++) {
      try {
        const element = page.locator('a, button, [role="button"], [onclick], [data-testid*="button"]').nth(i);
        const text = await element.textContent();
        const href = await element.getAttribute('href');
        const isVisible = await element.isVisible();
        
        if (isVisible && text && text.trim().length > 0) {
          console.log(`${i + 1}. "${text.trim()}"${href ? ` (href: ${href})` : ''}`);
        }
      } catch (error) {
        // Ignorar errores
      }
    }
    
    // Buscar formularios
    const forms = await page.locator('form').count();
    console.log(`📝 Formularios encontrados: ${forms}`);
    
    // Buscar inputs
    const inputs = await page.locator('input, textarea, select').count();
    console.log(`⌨️ Campos de entrada encontrados: ${inputs}`);
    
    expect(true).toBe(true);
  });
}); 