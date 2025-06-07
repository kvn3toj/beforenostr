import { test, expect } from '@playwright/test';

/**
 * Demostración Visual Completa - CoomÜnity Website
 * Esta prueba está diseñada para mostrar visualmente todo el sitio funcionando
 */

test.describe('🎬 Demostración Visual CoomÜnity', () => {
  
  test('Tour Completo del Sitio Web Unificado', async ({ page }) => {
    console.log('🚀 Iniciando tour visual del sitio CoomÜnity...');
    
    // Configurar navegador para observación
    await page.setViewportSize({ width: 1200, height: 800 });
    
    // PASO 1: Página Principal
    console.log('📍 PASO 1: Navegando a la página principal...');
    await page.goto('/');
    await page.waitForTimeout(3000); // Pausa para observar
    
    // Verificar redirección a /public/
    await expect(page).toHaveURL(/.*\/public\//);
    console.log('✅ Redirección automática funcionando');
    
    // Verificar título y elementos principales
    await expect(page.locator('h1')).toContainText('CoomÜnity - Sitio Web Recuperado');
    console.log('✅ Título principal visible');
    
    // Tomar screenshot
    await page.screenshot({ path: 'demo-screenshots/01-homepage.png', fullPage: true });
    
    // PASO 2: Sección Pilgrim
    console.log('📍 PASO 2: Navegando a la sección Pilgrim...');
    await page.click('a[href*="pilgrim"]:not([href*="variations"]):not([href*="journey"])');
    await page.waitForTimeout(3000);
    
    await expect(page).toHaveURL(/.*sections\/pilgrim/);
    await expect(page.locator('body')).toBeVisible();
    console.log('✅ Sección Pilgrim cargada correctamente');
    
    await page.screenshot({ path: 'demo-screenshots/02-pilgrim.png', fullPage: true });
    
    // PASO 3: Volver y navegar a Merchant
    console.log('📍 PASO 3: Navegando a la sección Merchant...');
    await page.goto('/public/');
    await page.waitForTimeout(2000);
    
    await page.click('a[href*="merchant"]:not([href*="variations"])');
    await page.waitForTimeout(3000);
    
    await expect(page).toHaveURL(/.*sections\/merchant/);
    await expect(page.locator('body')).toBeVisible();
    console.log('✅ Sección Merchant cargada correctamente');
    
    await page.screenshot({ path: 'demo-screenshots/03-merchant.png', fullPage: true });
    
    // PASO 4: Explorar variaciones de Merchant
    console.log('📍 PASO 4: Explorando variaciones de Merchant...');
    const variations = [
      { url: '/sections/merchant/variations/initial_load.html', name: 'Initial Load' },
      { url: '/sections/merchant/variations/after_scroll.html', name: 'After Scroll' },
      { url: '/sections/merchant/variations/button_clicked.html', name: 'Button Clicked' }
    ];
    
    for (const [index, variation] of variations.entries()) {
      console.log(`   📄 Probando variación: ${variation.name}`);
      await page.goto(variation.url);
      await page.waitForTimeout(2000);
      await expect(page.locator('body')).toBeVisible();
      await page.screenshot({ 
        path: `demo-screenshots/04-merchant-variation-${index + 1}.png`, 
        fullPage: true 
      });
    }
    
    // PASO 5: Sección Red Pill
    console.log('📍 PASO 5: Navegando a la sección Red Pill...');
    await page.goto('/public/');
    await page.waitForTimeout(2000);
    
    await page.click('a[href*="red-pill"]:not([href*="journey"])');
    await page.waitForTimeout(3000);
    
    await expect(page).toHaveURL(/.*sections\/red-pill/);
    await expect(page.locator('body')).toBeVisible();
    console.log('✅ Sección Red Pill cargada correctamente');
    
    await page.screenshot({ path: 'demo-screenshots/05-red-pill.png', fullPage: true });
    
    // PASO 6: Explorar Journey de Red Pill
    console.log('📍 PASO 6: Explorando el journey de Red Pill...');
    const journeyPages = [
      { url: '/sections/red-pill/journey/initial.html', name: 'Initial' },
      { url: '/sections/red-pill/journey/left_path.html', name: 'Left Path' },
      { url: '/sections/red-pill/journey/right_path.html', name: 'Right Path' },
      { url: '/sections/red-pill/journey/final.html', name: 'Final' }
    ];
    
    for (const [index, journey] of journeyPages.entries()) {
      console.log(`   🎭 Navegando a: ${journey.name}`);
      await page.goto(journey.url);
      await page.waitForTimeout(2500);
      await expect(page.locator('body')).toBeVisible();
      await page.screenshot({ 
        path: `demo-screenshots/06-red-pill-journey-${index + 1}.png`, 
        fullPage: true 
      });
    }
    
    // PASO 7: Prueba responsive
    console.log('📍 PASO 7: Demostrando responsive design...');
    await page.goto('/public/');
    
    const viewports = [
      { width: 1200, height: 800, name: 'Desktop' },
      { width: 768, height: 1024, name: 'Tablet' },
      { width: 375, height: 667, name: 'Mobile' }
    ];
    
    for (const [index, viewport] of viewports.entries()) {
      console.log(`   📱 Probando viewport: ${viewport.name} (${viewport.width}x${viewport.height})`);
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.waitForTimeout(2000);
      await page.screenshot({ 
        path: `demo-screenshots/07-responsive-${index + 1}-${viewport.name.toLowerCase()}.png`, 
        fullPage: true 
      });
    }
    
    // PASO 8: Verificar APIs funcionando
    console.log('📍 PASO 8: Verificando APIs en navegador...');
    await page.setViewportSize({ width: 1200, height: 800 });
    
    // Abrir DevTools programáticamente sería ideal, pero vamos a hacer requests
    const apiResponse = await page.request.get('/api/health');
    expect(apiResponse.status()).toBe(200);
    const apiData = await apiResponse.json();
    console.log('✅ API Health check:', apiData);
    
    // Verificar otras APIs
    const pilgrimProfile = await page.request.get('/api/pilgrim/profile');
    expect(pilgrimProfile.status()).toBe(200);
    console.log('✅ API Pilgrim profile funcionando');
    
    const merchantProfile = await page.request.get('/api/merchant/profile');
    expect(merchantProfile.status()).toBe(200);
    console.log('✅ API Merchant profile funcionando');
    
    const redPillJourney = await page.request.get('/api/red-pill/journey');
    expect(redPillJourney.status()).toBe(200);
    console.log('✅ API Red Pill journey funcionando');
    
    // PASO 9: Volver a la página principal para finalizar
    console.log('📍 PASO 9: Finalizando tour en la página principal...');
    await page.goto('/public/');
    await page.waitForTimeout(2000);
    
    await page.screenshot({ path: 'demo-screenshots/08-final-homepage.png', fullPage: true });
    
    console.log('🎉 ¡Tour visual completado exitosamente!');
    console.log('📸 Screenshots guardados en: demo-screenshots/');
    console.log('🌐 URLs verificadas:');
    console.log('   • Homepage: ✅');
    console.log('   • Pilgrim: ✅');
    console.log('   • Merchant (3 variaciones): ✅');
    console.log('   • Red Pill (4 journey pages): ✅');
    console.log('   • APIs (4 endpoints): ✅');
    console.log('   • Responsive (3 viewports): ✅');
  });

  test('Demo Interactivo - Navegación Manual', async ({ page }) => {
    console.log('🎮 Iniciando demo interactivo...');
    
    // Configurar navegador
    await page.setViewportSize({ width: 1200, height: 800 });
    
    // Ir a la página principal y mantener abierto para exploración manual
    await page.goto('/public/');
    
    console.log('🌐 Navegador abierto en: http://localhost:8080/public/');
    console.log('🖱️  Puedes navegar manualmente por el sitio');
    console.log('⏱️  La prueba se mantendrá abierta por 2 minutos para exploración');
    
    // Verificar que la página está funcionando
    await expect(page.locator('h1')).toContainText('CoomÜnity');
    
    // Mantener el navegador abierto para exploración manual
    await page.waitForTimeout(120000); // 2 minutos
    
    console.log('✅ Demo interactivo completado');
  });
}); 