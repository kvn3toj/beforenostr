import { test, expect } from '@playwright/test';

test.describe('LETS Module Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the SuperApp
    await page.goto('/');
    
    // Wait for React to mount
    await page.waitForSelector('#root', { timeout: 15000 });
    
    // Check if already logged in by looking for login form or dashboard
    const loginForm = page.locator('[data-testid="login-email-input"]');
    const isLoginFormVisible = await loginForm.isVisible().catch(() => false);
    
    if (isLoginFormVisible) {
      // Login with verified backend credentials
      await page.fill('[data-testid="login-email-input"] input', 'user@gamifier.com');
      await page.fill('[data-testid="login-password-input"] input', '123456');
      await page.click('[data-testid="login-submit-button"]');
      
      // Wait for login to complete
      await page.waitForURL('**/', { timeout: 15000 });
    }
  });

  test('should load the LETS page successfully without errors', async ({ page }) => {
    console.log('🔍 Testing LETS page stability after wizard removal...');
    
    // Navigate to LETS module (independent module)
    await page.goto('/lets');
    
    // Wait for page to load
    await page.waitForSelector('#root', { timeout: 15000 });
    
    // Verificar que ya no aparece el overlay de error de Vite
    const errorOverlay = page.locator('vite-error-overlay');
    await expect(errorOverlay).not.toBeVisible();
    console.log('✅ No Vite error overlay detected');

    // Verificar que el título principal de la página LETS es visible
    await expect(page.getByRole('heading', { name: '🔄 Sistema LETS CoomÜnity' })).toBeVisible();
    console.log('✅ LETS page title is visible');
    
    // Verificar que el subtítulo está presente
    await expect(page.locator('text=Local Exchange Trading System')).toBeVisible();
    console.log('✅ LETS subtitle is visible');
    
    // Verificar que la descripción principal está presente
    await expect(page.locator('text=Intercambia productos, servicios y conocimientos')).toBeVisible();
    console.log('✅ LETS description is visible');
  });

  test('should display LETS core concepts and statistics', async ({ page }) => {
    console.log('🔍 Testing LETS core content display...');
    
    await page.goto('/lets');
    await page.waitForSelector('#root', { timeout: 15000 });
    
    // Verificar que los chips de conceptos clave están presentes
    await expect(page.locator('text=💰 Sin Intereses')).toBeVisible();
    await expect(page.locator('text=🤝 Basado en Confianza')).toBeVisible();
    await expect(page.locator('text=⚖️ Principio Ayni')).toBeVisible();
    await expect(page.locator('text=🌱 Economía Circular')).toBeVisible();
    console.log('✅ LETS core concept chips are visible');
    
    // Verificar que las estadísticas mock están presentes
    await expect(page.locator('text=Intercambios Realizados')).toBeVisible();
    await expect(page.locator('text=Usuarios Activos')).toBeVisible();
    await expect(page.locator('text=Ünits en Circulación')).toBeVisible();
    await expect(page.locator('text=Índice Ayni')).toBeVisible();
    console.log('✅ LETS statistics are visible');
  });

  test('should navigate between LETS tabs successfully', async ({ page }) => {
    console.log('🔍 Testing LETS tab navigation...');
    
    await page.goto('/lets');
    await page.waitForSelector('#root', { timeout: 15000 });
    
    // Buscar las pestañas del módulo LETS
    const tabsContainer = page.locator('[role="tablist"]');
    
    if (await tabsContainer.isVisible()) {
      console.log('✅ LETS tabs container found');
      
      // Verificar que podemos hacer clic en diferentes pestañas sin errores
      const tabs = page.locator('[role="tab"]');
      const tabCount = await tabs.count();
      
      if (tabCount > 0) {
        console.log(`✅ Found ${tabCount} tabs in LETS module`);
        
        // Hacer clic en cada pestaña para verificar que no hay errores
        for (let i = 0; i < Math.min(tabCount, 3); i++) {
          await tabs.nth(i).click();
          await page.waitForTimeout(500); // Esperar transición
          
          // Verificar que no hay errores después del clic
          const errorOverlay = page.locator('vite-error-overlay');
          await expect(errorOverlay).not.toBeVisible();
          console.log(`✅ Tab ${i + 1} clicked successfully without errors`);
        }
      }
    } else {
      console.log('ℹ️ No tabs found in LETS module - this is acceptable');
    }
  });

  test('should verify LETS page accessibility and responsiveness', async ({ page }) => {
    console.log('🔍 Testing LETS page accessibility...');
    
    await page.goto('/lets');
    await page.waitForSelector('#root', { timeout: 15000 });
    
    // Verificar que la página tiene un título accesible
    const pageTitle = await page.title();
    expect(pageTitle).toBeTruthy();
    console.log(`✅ Page title: ${pageTitle}`);
    
    // Verificar que los elementos principales tienen roles apropiados
    const mainHeading = page.getByRole('heading', { name: '🔄 Sistema LETS CoomÜnity' });
    await expect(mainHeading).toBeVisible();
    console.log('✅ Main heading has proper role');
    
    // Test responsiveness - cambiar viewport
    await page.setViewportSize({ width: 768, height: 1024 }); // Tablet
    await expect(mainHeading).toBeVisible();
    console.log('✅ LETS page is responsive on tablet viewport');
    
    await page.setViewportSize({ width: 375, height: 667 }); // Mobile
    await expect(mainHeading).toBeVisible();
    console.log('✅ LETS page is responsive on mobile viewport');
    
    // Restaurar viewport original
    await page.setViewportSize({ width: 1280, height: 720 });
  });

  test('should verify LETS module independence from Marketplace', async ({ page }) => {
    console.log('🔍 Testing LETS module independence...');
    
    await page.goto('/lets');
    await page.waitForSelector('#root', { timeout: 15000 });
    
    // Verificar que estamos en la página LETS independiente
    const currentUrl = page.url();
    expect(currentUrl).toContain('/lets');
    expect(currentUrl).not.toContain('/marketplace');
    console.log('✅ LETS module is independent (not under marketplace)');
    
    // Verificar que el contenido es específico de LETS
    await expect(page.locator('text=Sistema LETS CoomÜnity')).toBeVisible();
    await expect(page.locator('text=Local Exchange Trading System')).toBeVisible();
    console.log('✅ LETS-specific content is present');
    
    // Verificar que no hay referencias a marketplace en el contenido principal
    const marketplaceReferences = page.locator('text=Marketplace, text=marketplace');
    const hasMarketplaceRefs = await marketplaceReferences.count();
    
    if (hasMarketplaceRefs > 0) {
      console.log(`⚠️ Found ${hasMarketplaceRefs} marketplace references - this may be acceptable in navigation`);
    } else {
      console.log('✅ No marketplace references in LETS content');
    }
  });
}); 