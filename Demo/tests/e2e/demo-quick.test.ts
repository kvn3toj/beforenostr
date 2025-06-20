import { test, expect } from '@playwright/test';

/**
 * Demostración Rápida - CoomÜnity Website
 * Prueba optimizada para observación visual rápida
 */

test.describe('🚀 Demo Rápido CoomÜnity', () => {
  
  test('Navegación Visual Rápida', async ({ page }) => {
    // Configurar navegador para mejor observación
    await page.setViewportSize({ width: 1200, height: 800 });
    
    console.log('🏠 1. Página Principal...');
    await page.goto('/public/');
    await page.waitForTimeout(2000);
    await expect(page.locator('h1')).toContainText('CoomÜnity');
    
    console.log('🚀 2. Sección Pilgrim...');
    await page.click('a[href*="pilgrim"]:not([href*="variations"]):not([href*="journey"])');
    await page.waitForTimeout(2000);
    await expect(page).toHaveURL(/.*sections\/pilgrim/);
    
    console.log('🏪 3. Sección Merchant...');
    await page.goto('/public/');
    await page.waitForTimeout(1000);
    await page.click('a[href*="merchant"]:not([href*="variations"])');
    await page.waitForTimeout(2000);
    await expect(page).toHaveURL(/.*sections\/merchant/);
    
    console.log('💊 4. Sección Red Pill...');
    await page.goto('/public/');
    await page.waitForTimeout(1000);
    await page.click('a[href*="red-pill"]:not([href*="journey"])');
    await page.waitForTimeout(2000);
    await expect(page).toHaveURL(/.*sections\/red-pill/);
    
    console.log('🎯 5. Journey Red Pill...');
    await page.goto('/sections/red-pill/journey/initial.html');
    await page.waitForTimeout(3000); // Más tiempo para ver el contenido interactivo
    await expect(page.locator('body')).toBeVisible();
    
    console.log('📱 6. Responsive Demo...');
    await page.goto('/public/');
    
    // Mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(2000);
    console.log('   📱 Mobile view');
    
    // Tablet
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(2000);
    console.log('   📟 Tablet view');
    
    // Desktop
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.waitForTimeout(2000);
    console.log('   🖥️  Desktop view');
    
    console.log('✅ Demo completado - Todo funcional!');
  });

  test('Prueba de APIs en Navegador', async ({ page }) => {
    await page.goto('/public/');
    
    // Abrir DevTools Console para mostrar APIs funcionando
    await page.evaluate(() => {
      console.log('🔍 Probando APIs de CoomÜnity...');
      
      // Test Health API
      fetch('/api/health')
        .then(response => response.json())
        .then(data => console.log('✅ Health API:', data))
        .catch(error => console.error('❌ Health API error:', error));
      
      // Test Pilgrim API
      fetch('/api/pilgrim/profile')
        .then(response => response.json())
        .then(data => console.log('✅ Pilgrim API:', data))
        .catch(error => console.error('❌ Pilgrim API error:', error));
      
      // Test Merchant API
      fetch('/api/merchant/profile')
        .then(response => response.json())
        .then(data => console.log('✅ Merchant API:', data))
        .catch(error => console.error('❌ Merchant API error:', error));
      
      // Test Red Pill API
      fetch('/api/red-pill/journey')
        .then(response => response.json())
        .then(data => console.log('✅ Red Pill API:', data))
        .catch(error => console.error('❌ Red Pill API error:', error));
    });
    
    await page.waitForTimeout(3000);
    console.log('📡 APIs ejecutadas en DevTools Console');
  });
}); 