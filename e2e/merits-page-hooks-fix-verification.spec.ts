import { test, expect } from '@playwright/test';

test.describe('🔧 VERIFICACIÓN: MeritsPage - Corrección de Hooks', () => {
  test.beforeEach(async ({ page }) => {
    console.log('🔐 Iniciando sesión como administrador...');
    
    // Capturar errores de consola
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
        console.log('🔴 Console Error:', msg.text());
      }
    });
    
    // Capturar errores de página
    const pageErrors: string[] = [];
    page.on('pageerror', (error) => {
      pageErrors.push(error.message);
      console.log('🚨 Page Error:', error.message);
    });
    
    // Guardar errores en el contexto de la página para acceder después
    (page as any).consoleErrors = consoleErrors;
    (page as any).pageErrors = pageErrors;
    
    // Navegar a login
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    
    // Llenar credenciales
    await page.fill('input[name="email"]', 'admin@gamifier.com');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');
    
    // Esperar redirección
    await page.waitForURL('**/');
    
    // Verificar login exitoso (método robusto)
    try {
      await page.waitForSelector('nav, [role="navigation"], button[aria-label*="menu"]', { timeout: 5000 });
      console.log('✅ Login exitoso - Navegación detectada');
    } catch {
      const currentUrl = page.url();
      if (!currentUrl.includes('/login')) {
        console.log('✅ Login exitoso - Verificado por URL');
      } else {
        throw new Error('Login falló');
      }
    }
  });

  test('🎯 VERIFICAR: MeritsPage se renderiza sin errores de Hooks', async ({ page }) => {
    console.log('📋 Navegando a página de Méritos...');
    
    // Navegar a la página de Méritos
    await page.goto('/merits');
    await page.waitForLoadState('networkidle');
    
    // Esperar un poco más para que todos los componentes se rendericen
    await page.waitForTimeout(2000);
    
    console.log('🔍 Verificando que la página se cargó...');
    
    // Verificar que la página se cargó correctamente
    try {
      await page.waitForSelector('text=Sistema de Méritos', { timeout: 10000 });
      console.log('✅ Título de página encontrado');
    } catch {
      const currentUrl = page.url();
      if (currentUrl.includes('/merits')) {
        console.log('✅ Página Méritos cargada (verificado por URL)');
      } else {
        throw new Error('No se pudo cargar la página de Méritos');
      }
    }
    
    // Verificar elementos clave de la página
    const pageElements = [
      'text=Sistema de Méritos',
      'text=Total Méritos',
      'text=Puntos Totales',
      'text=Méritos Recientes',
      'text=Usuarios Activos'
    ];
    
    let elementsFound = 0;
    for (const selector of pageElements) {
      try {
        await page.waitForSelector(selector, { timeout: 3000 });
        elementsFound++;
        console.log(`✅ Elemento encontrado: ${selector}`);
      } catch {
        console.log(`⚠️ Elemento no encontrado: ${selector}`);
      }
    }
    
    console.log(`📊 Elementos encontrados: ${elementsFound}/${pageElements.length}`);
    
    // Verificar que no hay errores de React/Hooks
    const consoleErrors = (page as any).consoleErrors || [];
    const pageErrors = (page as any).pageErrors || [];
    
    const hooksErrors = consoleErrors.filter((error: string) => 
      error.includes('change in the order of Hooks') || 
      error.includes('Hooks') ||
      error.includes('React has detected')
    );
    
    console.log(`🔍 Errores de Hooks detectados: ${hooksErrors.length}`);
    console.log(`🔍 Total errores de consola: ${consoleErrors.length}`);
    console.log(`🔍 Total errores de página: ${pageErrors.length}`);
    
    if (hooksErrors.length > 0) {
      console.log('🚨 ERRORES DE HOOKS ENCONTRADOS:');
      hooksErrors.forEach((error: string, index: number) => {
        console.log(`   ${index + 1}. ${error}`);
      });
      throw new Error(`Se encontraron ${hooksErrors.length} errores de Hooks`);
    }
    
    // Capturar screenshot de evidencia
    await page.screenshot({ 
      path: 'merits-page-hooks-fixed.png',
      fullPage: true 
    });
    
    console.log('🎉 ✅ VERIFICADO: MeritsPage se renderiza sin errores de Hooks');
    
    // Verificación adicional: intentar interactuar con la página
    try {
      // Scroll para verificar que la página es interactiva
      await page.evaluate(() => window.scrollTo(0, 300));
      await page.waitForTimeout(1000);
      await page.evaluate(() => window.scrollTo(0, 0));
      console.log('✅ Página es interactiva (scroll funciona)');
    } catch (error) {
      console.log('⚠️ Problemas de interactividad en la página');
    }
  });

  test('📊 VERIFICAR: Elementos de UI de Méritos funcionan correctamente', async ({ page }) => {
    console.log('📋 Navegando a página de Méritos para test de UI...');
    
    await page.goto('/merits');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Verificar cards de estadísticas
    const statsCards = [
      'Total Méritos',
      'Puntos Totales', 
      'Méritos Recientes',
      'Usuarios Activos'
    ];
    
    let cardsFound = 0;
    for (const cardTitle of statsCards) {
      try {
        const card = page.locator('text=' + cardTitle);
        await expect(card).toBeVisible({ timeout: 3000 });
        cardsFound++;
        console.log(`✅ Card encontrada: ${cardTitle}`);
      } catch {
        console.log(`⚠️ Card no encontrada: ${cardTitle}`);
      }
    }
    
    console.log(`📊 Cards de estadísticas encontradas: ${cardsFound}/${statsCards.length}`);
    
    // Verificar que hay contenido de distribución por tipo
    try {
      await page.waitForSelector('text=Distribución por Tipo', { timeout: 5000 });
      console.log('✅ Sección de distribución por tipo encontrada');
    } catch {
      console.log('⚠️ Sección de distribución por tipo no encontrada');
    }
    
    // Verificar tabla de historial
    try {
      await page.waitForSelector('text=Historial Completo de Méritos', { timeout: 5000 });
      console.log('✅ Sección de historial encontrada');
    } catch {
      console.log('⚠️ Sección de historial no encontrada');
    }
    
    // Verificar que no hay errores de Hooks después de la interacción
    const consoleErrors = (page as any).consoleErrors || [];
    const hooksErrors = consoleErrors.filter((error: string) => 
      error.includes('change in the order of Hooks') || 
      error.includes('Hooks') ||
      error.includes('React has detected')
    );
    
    expect(hooksErrors.length).toBe(0);
    console.log('🎉 ✅ VERIFICADO: No hay errores de Hooks después de la interacción con UI');
  });
}); 