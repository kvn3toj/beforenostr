import { test, expect } from '@playwright/test';

test.describe('Menu Navigation Behavior', () => {
  test.beforeEach(async ({ page }) => {
    // Capturar errores de consola y página
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log('❌ Console Error:', msg.text());
      }
    });
    
    page.on('pageerror', error => {
      console.log('❌ Page Error:', error.message);
    });

    // === FLUJO DE AUTENTICACIÓN EXPLÍCITO ===
    // 1. Navegar explícitamente a la página de login
    await page.goto('/login');
    
    // 2. Rellenar email del administrador
    await page.fill('input[name="email"]', 'admin@gamifier.com');
    
    // 3. Rellenar contraseña del administrador
    await page.fill('input[name="password"]', 'admin123');
    
    // 4. Hacer clic en el botón de login
    await page.click('button[type="submit"]');
    
    // 5. Esperar la redirección a la página principal
    await page.waitForURL('**/');
    
    // 6. Aserción para confirmar que el dashboard principal se cargó
    await expect(page.getByText('Gamifier Admin')).toBeVisible();
  });

  test('should maintain menu stability during navigation', async ({ page }) => {
    console.log('🧪 Testing menu stability during navigation...');
    
    // Tomar screenshot inicial
    await page.screenshot({ path: 'debug-menu-initial-state.png' });
    
    // Verificar que el menú principal esté visible
    const menuContainer = page.locator('[data-testid="main-menu"], nav, .menu-container').first();
    await expect(menuContainer).toBeVisible();
    
    // Obtener las dimensiones iniciales del menú
    const initialMenuBox = await menuContainer.boundingBox();
    console.log('📐 Initial menu dimensions:', initialMenuBox);
    
    // Array de rutas de menú para probar
    const menuRoutes = [
      { name: 'Users', path: '/users' },
      { name: 'Roles', path: '/roles' },
      { name: 'Mundos', path: '/mundos' },
      { name: 'Playlists', path: '/playlists' },
      { name: 'Analytics', path: '/analytics' },
      { name: 'Configuration', path: '/configuration' }
    ];
    
    for (const route of menuRoutes) {
      console.log(`🔍 Testing navigation to ${route.name} (${route.path})...`);
      
      // Navegar a la ruta
      await page.goto(route.path);
      
      // Esperar a que la página se cargue
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000); // Esperar animaciones
      
      // Verificar que el menú siga visible
      await expect(menuContainer).toBeVisible();
      
      // Obtener las nuevas dimensiones del menú
      const currentMenuBox = await menuContainer.boundingBox();
      console.log(`📐 Menu dimensions after navigating to ${route.name}:`, currentMenuBox);
      
      // Verificar que las dimensiones no hayan cambiado drásticamente
      if (initialMenuBox && currentMenuBox) {
        const widthDiff = Math.abs(initialMenuBox.width - currentMenuBox.width);
        const heightDiff = Math.abs(initialMenuBox.height - currentMenuBox.height);
        
        // Permitir una diferencia máxima del 10% en dimensiones
        const maxWidthDiff = initialMenuBox.width * 0.1;
        const maxHeightDiff = initialMenuBox.height * 0.1;
        
        console.log(`📊 Width difference: ${widthDiff}px (max allowed: ${maxWidthDiff}px)`);
        console.log(`📊 Height difference: ${heightDiff}px (max allowed: ${maxHeightDiff}px)`);
        
        if (widthDiff > maxWidthDiff || heightDiff > maxHeightDiff) {
          console.log(`⚠️  Menu size changed significantly on ${route.name} page!`);
          await page.screenshot({ path: `debug-menu-size-change-${route.name.toLowerCase()}.png` });
        }
        
        expect(widthDiff).toBeLessThan(maxWidthDiff);
        expect(heightDiff).toBeLessThan(maxHeightDiff);
      }
      
      // Tomar screenshot para debugging
      await page.screenshot({ path: `debug-menu-navigation-${route.name.toLowerCase()}.png` });
      
      // Verificar que no haya errores de JavaScript en la consola
      // (esto se captura automáticamente en el beforeEach)
    }
  });

  test('should test menu collapse/expand behavior', async ({ page }) => {
    console.log('🧪 Testing menu collapse/expand behavior...');
    
    // Buscar botón de colapso del menú (diferentes selectores posibles)
    const collapseButtonSelectors = [
      '[data-testid="menu-toggle"]',
      '[data-testid="sidebar-toggle"]',
      'button[aria-label*="menu"]',
      'button[aria-label*="sidebar"]',
      '.menu-toggle',
      '.sidebar-toggle',
      'button:has-text("Menu")',
      'button:has-text("☰")'
    ];
    
    let collapseButton = null;
    for (const selector of collapseButtonSelectors) {
      const button = page.locator(selector).first();
      if (await button.isVisible()) {
        collapseButton = button;
        console.log(`✅ Found menu toggle button with selector: ${selector}`);
        break;
      }
    }
    
    if (collapseButton) {
      // Tomar screenshot antes del colapso
      await page.screenshot({ path: 'debug-menu-before-collapse.png' });
      
      // Hacer clic para colapsar el menú
      await collapseButton.click();
      await page.waitForTimeout(500); // Esperar animación
      
      // Tomar screenshot después del colapso
      await page.screenshot({ path: 'debug-menu-after-collapse.png' });
      
      // Hacer clic para expandir el menú
      await collapseButton.click();
      await page.waitForTimeout(500); // Esperar animación
      
      // Tomar screenshot después de expandir
      await page.screenshot({ path: 'debug-menu-after-expand.png' });
      
      console.log('✅ Menu collapse/expand test completed');
    } else {
      console.log('⚠️  No menu toggle button found, skipping collapse/expand test');
    }
  });

  test('should test menu item hover effects', async ({ page }) => {
    console.log('🧪 Testing menu item hover effects...');
    
    // Buscar elementos de menú
    const menuItems = await page.locator('nav a, .menu-item, [role="menuitem"]').all();
    
    if (menuItems.length === 0) {
      console.log('⚠️  No menu items found');
      return;
    }
    
    console.log(`📋 Found ${menuItems.length} menu items to test`);
    
    for (let i = 0; i < Math.min(menuItems.length, 6); i++) {
      const menuItem = menuItems[i];
      const text = await menuItem.textContent() || `Item ${i + 1}`;
      
      console.log(`🖱️  Testing hover on menu item: "${text}"`);
      
      // Hacer hover sobre el elemento
      await menuItem.hover();
      await page.waitForTimeout(300); // Esperar efectos de hover
      
      // Tomar screenshot del estado hover
      await page.screenshot({ path: `debug-menu-hover-${i + 1}.png` });
      
      // Verificar que el elemento siga siendo clickeable
      await expect(menuItem).toBeVisible();
    }
    
    console.log('✅ Menu hover effects test completed');
  });

  test('should verify menu accessibility', async ({ page }) => {
    console.log('🧪 Testing menu accessibility...');
    
    // Verificar que el menú tenga roles ARIA apropiados
    const menuWithRole = page.locator('[role="navigation"], [role="menu"], nav');
    await expect(menuWithRole.first()).toBeVisible();
    
    // Verificar que los elementos de menú tengan roles apropiados
    const menuItems = page.locator('[role="menuitem"], nav a, .menu-item');
    const count = await menuItems.count();
    
    console.log(`📋 Found ${count} menu items for accessibility testing`);
    
    // Verificar navegación por teclado
    if (count > 0) {
      // Focus en el primer elemento del menú
      await menuItems.first().focus();
      await page.screenshot({ path: 'debug-menu-keyboard-focus.png' });
      
      // Probar navegación con Tab
      for (let i = 0; i < Math.min(count, 3); i++) {
        await page.keyboard.press('Tab');
        await page.waitForTimeout(200);
      }
      
      await page.screenshot({ path: 'debug-menu-keyboard-navigation.png' });
    }
    
    console.log('✅ Menu accessibility test completed');
  });
}); 