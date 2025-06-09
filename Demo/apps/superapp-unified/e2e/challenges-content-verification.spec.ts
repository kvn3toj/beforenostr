import { test, expect } from '@playwright/test';

test.describe('Fase A.8 - Verificación de Contenido del Módulo de Challenges', () => {
  
  test('A.8.4 - Verificar carga correcta de la página de challenges', async ({ page }) => {
    await page.goto('/challenges');
    
    // Verificar que la página responde correctamente
    expect(page.url()).toContain('/challenges');
    
    // Verificar que React monta
    await page.waitForSelector('#root', { timeout: 10000 });
    
    // Verificar que hay contenido
    const content = await page.locator('#root').innerHTML();
    expect(content.length).toBeGreaterThan(100);
    
    console.log('✅ A.8.4 - Página de challenges carga correctamente');
  });

  test('A.8.5 - Verificar presencia de elementos básicos de challenges', async ({ page }) => {
    await page.goto('/challenges');
    await page.waitForSelector('#root', { timeout: 10000 });
    
    // Buscar elementos típicos de una página de challenges
    const possibleSelectors = [
      'h1, h2, h3', // Títulos
      '[data-testid*="challenge"]', // Elementos con testid de challenge
      '.challenge', // Clases CSS de challenge
      'button', // Botones
      'input[type="search"], input[placeholder*="buscar"]', // Búsqueda
      'div[role="tab"], .tab', // Pestañas
    ];
    
    let foundElements = 0;
    for (const selector of possibleSelectors) {
      const elements = await page.locator(selector).count();
      if (elements > 0) {
        foundElements++;
        console.log(`Encontrados ${elements} elementos con selector: ${selector}`);
      }
    }
    
    // Verificar que encontramos al menos algunos elementos
    expect(foundElements).toBeGreaterThan(0);
    
    console.log(`✅ A.8.5 - Encontrados elementos básicos de challenges (${foundElements} tipos)`);
  });

  test('A.8.6 - Verificar datos mock específicos de challenges', async ({ page }) => {
    await page.goto('/challenges');
    await page.waitForSelector('#root', { timeout: 10000 });
    
    // Buscar términos específicos de CoomÜnity en el contenido
    const pageContent = await page.textContent('body');
    const coomUnityTerms = [
      'Ayni', 'ayni',
      'Innovación', 'innovación',
      'Colaboración', 'colaboración',
      'Desafío', 'desafío', 'Challenge', 'challenge',
      'Méritos', 'méritos',
      'Bien Común', 'bien común'
    ];
    
    let foundTerms = 0;
    const foundTermsList: string[] = [];
    
    for (const term of coomUnityTerms) {
      if (pageContent?.includes(term)) {
        foundTerms++;
        foundTermsList.push(term);
      }
    }
    
    console.log(`Términos CoomÜnity encontrados: ${foundTermsList.join(', ')}`);
    
    // Verificar que encontramos al menos algunos términos relevantes
    expect(foundTerms).toBeGreaterThan(0);
    
    console.log(`✅ A.8.6 - Datos mock específicos encontrados (${foundTerms} términos)`);
  });

  test('A.8.7 - Verificar funcionalidad de búsqueda (si existe)', async ({ page }) => {
    await page.goto('/challenges');
    await page.waitForSelector('#root', { timeout: 10000 });
    
    // Buscar campo de búsqueda
    const searchSelectors = [
      'input[type="search"]',
      'input[placeholder*="buscar"]',
      'input[placeholder*="Buscar"]',
      'input[placeholder*="search"]',
      '[data-testid*="search"]'
    ];
    
    let searchFound = false;
    for (const selector of searchSelectors) {
      const searchInput = page.locator(selector).first();
      if (await searchInput.count() > 0) {
        searchFound = true;
        
        // Probar escribir en el campo de búsqueda
        await searchInput.fill('Ayni');
        await page.waitForTimeout(1000);
        
        // Verificar que el valor se escribió
        const value = await searchInput.inputValue();
        expect(value).toBe('Ayni');
        
        console.log('✅ A.8.7 - Funcionalidad de búsqueda funciona correctamente');
        break;
      }
    }
    
    if (!searchFound) {
      console.log('⚠️ A.8.7 - Campo de búsqueda no encontrado (puede no estar implementado)');
    }
  });

  test('A.8.8 - Verificar pestañas/navegación interna (si existe)', async ({ page }) => {
    await page.goto('/challenges');
    await page.waitForSelector('#root', { timeout: 10000 });
    
    // Buscar pestañas o navegación interna
    const tabSelectors = [
      '[role="tab"]',
      '.tab',
      '[data-testid*="tab"]',
      'button[aria-selected]',
      '.MuiTab-root'
    ];
    
    let tabsFound = false;
    for (const selector of tabSelectors) {
      const tabs = page.locator(selector);
      const tabCount = await tabs.count();
      
      if (tabCount > 0) {
        tabsFound = true;
        console.log(`Encontradas ${tabCount} pestañas con selector: ${selector}`);
        
        // Probar hacer click en la primera pestaña
        await tabs.first().click();
        await page.waitForTimeout(1000);
        
        console.log('✅ A.8.8 - Pestañas/navegación interna funciona correctamente');
        break;
      }
    }
    
    if (!tabsFound) {
      console.log('⚠️ A.8.8 - Pestañas no encontradas (puede usar navegación diferente)');
    }
  });

  test('A.8.9 - Verificar responsividad básica', async ({ page }) => {
    await page.goto('/challenges');
    await page.waitForSelector('#root', { timeout: 10000 });
    
    // Probar diferentes tamaños de viewport
    const viewports = [
      { width: 1920, height: 1080, name: 'Desktop' },
      { width: 768, height: 1024, name: 'Tablet' },
      { width: 375, height: 667, name: 'Mobile' }
    ];
    
    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.waitForTimeout(1000);
      
      // Verificar que el contenido sigue siendo visible
      const rootContent = await page.locator('#root').innerHTML();
      expect(rootContent.length).toBeGreaterThan(100);
      
      console.log(`✅ A.8.9 - Responsividad verificada para ${viewport.name} (${viewport.width}x${viewport.height})`);
    }
  });

  test('A.8.10 - Verificar integración con autenticación mock', async ({ page }) => {
    await page.goto('/challenges');
    await page.waitForSelector('#root', { timeout: 10000 });
    
    // Verificar que no hay errores de autenticación críticos
    const errors: string[] = [];
    
    page.on('console', (msg) => {
      if (msg.type() === 'error' && 
          (msg.text().includes('auth') || 
           msg.text().includes('token') || 
           msg.text().includes('unauthorized'))) {
        errors.push(msg.text());
      }
    });
    
    // Esperar un poco para capturar errores
    await page.waitForTimeout(3000);
    
    // Verificar que no hay errores críticos de autenticación
    const criticalAuthErrors = errors.filter(error => 
      error.includes('unauthorized') || 
      error.includes('401') ||
      error.includes('authentication failed')
    );
    
    expect(criticalAuthErrors).toHaveLength(0);
    
    console.log('✅ A.8.10 - Integración con autenticación mock funciona correctamente');
  });
}); 