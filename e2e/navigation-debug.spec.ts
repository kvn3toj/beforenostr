import { test, expect } from '@playwright/test';

test.describe('🔍 Navigation Debug - Investigar Navegación', () => {
  test('Investigar elementos de navegación presentes', async ({ page }) => {
    console.log('🔍 Iniciando investigación de navegación...');
    
    // Navegar a la página principal
    await page.goto('/');
    await page.waitForSelector('#root', { timeout: 10000 });
    
    // Esperar un poco para que todo cargue
    await page.waitForTimeout(2000);
    
    // Capturar screenshot completo
    await page.screenshot({ path: 'navigation-debug-full.png', fullPage: true });
    
    // Obtener todo el texto de la página
    const bodyText = await page.textContent('body');
    console.log('📍 Texto completo de la página (primeros 500 caracteres):');
    console.log(bodyText.substring(0, 500));
    
    // Buscar elementos de navegación específicos
    const navigationElements = await page.locator('nav, [role="navigation"], .MuiAppBar-root, header, .navigation, .sidebar, .menu').all();
    console.log(`📍 Elementos de navegación encontrados: ${navigationElements.length}`);
    
    for (let i = 0; i < navigationElements.length; i++) {
      const element = navigationElements[i];
      const text = await element.textContent();
      const tagName = await element.evaluate(el => el.tagName);
      const className = await element.getAttribute('class');
      console.log(`📍 Elemento ${i + 1}: <${tagName}> class="${className}" text="${text?.substring(0, 100)}"`);
    }
    
    // Buscar enlaces específicos
    const links = await page.locator('a').all();
    console.log(`📍 Enlaces encontrados: ${links.length}`);
    
    for (let i = 0; i < Math.min(links.length, 10); i++) {
      const link = links[i];
      const href = await link.getAttribute('href');
      const text = await link.textContent();
      console.log(`📍 Enlace ${i + 1}: href="${href}" text="${text}"`);
    }
    
    // Buscar texto específico de mundos
    const mundosText = await page.locator('text=Mundos').count();
    const worldsText = await page.locator('text=Worlds').count();
    const mundoText = await page.locator('text=Mundo').count();
    
    console.log(`📍 Ocurrencias de "Mundos": ${mundosText}`);
    console.log(`📍 Ocurrencias de "Worlds": ${worldsText}`);
    console.log(`📍 Ocurrencias de "Mundo": ${mundoText}`);
    
    // Buscar elementos con href que contengan mundos
    const mundosLinks = await page.locator('[href*="mundos"], [href*="worlds"]').all();
    console.log(`📍 Enlaces con href mundos/worlds: ${mundosLinks.length}`);
    
    for (let i = 0; i < mundosLinks.length; i++) {
      const link = mundosLinks[i];
      const href = await link.getAttribute('href');
      const text = await link.textContent();
      console.log(`📍 Enlace mundos ${i + 1}: href="${href}" text="${text}"`);
    }
    
    // Verificar si hay elementos ocultos
    const hiddenMundos = await page.locator('text=Mundos').all();
    for (let i = 0; i < hiddenMundos.length; i++) {
      const element = hiddenMundos[i];
      const isVisible = await element.isVisible();
      const isHidden = await element.isHidden();
      console.log(`📍 Elemento "Mundos" ${i + 1}: visible=${isVisible}, hidden=${isHidden}`);
    }
    
    expect(true).toBe(true); // Test siempre pasa
  });
}); 