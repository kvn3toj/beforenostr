import { test, expect } from '@playwright/test';

test.describe('Submenu Expansion Test', () => {
  test('should expand submenus without closing the drawer', async ({ page }) => {
    // Capturar errores
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log('❌ Console Error:', msg.text());
      }
    });
    
    page.on('pageerror', error => {
      console.log('❌ Page Error:', error.message);
    });

    console.log('🚀 Starting submenu expansion test...');

    // === AUTENTICACIÓN ===
    await page.goto('/login');
    await page.fill('input[name="email"]', 'admin@gamifier.com');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/');
    await page.waitForTimeout(2000);
    
    console.log('✅ Authentication completed');

    // === ABRIR EL DRAWER ===
    console.log('🔍 Opening drawer...');
    
    // Buscar y hacer clic en el botón de menú
    const menuButton = page.locator('button[aria-label*="menu"], .MuiIconButton-root:has([data-testid="MenuIcon"])').first();
    await expect(menuButton).toBeVisible();
    await menuButton.click();
    await page.waitForTimeout(1000);
    
    // Verificar que el drawer está abierto
    const drawer = page.locator('.MuiDrawer-root').first();
    await expect(drawer).toBeVisible();
    
    console.log('✅ Drawer opened successfully');
    await page.screenshot({ path: 'debug-submenu-drawer-open.png' });

    // === TEST DE EXPANSIÓN DE SUBMENU "SERVICES" ===
    console.log('🧪 Testing Services submenu expansion...');
    
    // Buscar el item "Services" dentro del drawer
    const servicesItem = drawer.locator('.MuiListItemButton-root').filter({ hasText: 'Services' }).first();
    await expect(servicesItem).toBeVisible();
    
    console.log('✅ Services menu item found');
    
    // Hacer clic en Services para expandir
    await servicesItem.click();
    await page.waitForTimeout(1000); // Esperar animación de expansión
    
    // Verificar que el drawer sigue abierto
    const isDrawerStillOpen = await drawer.isVisible();
    console.log(`📋 Drawer still open after Services click: ${isDrawerStillOpen}`);
    
    if (!isDrawerStillOpen) {
      console.log('❌ PROBLEM: Drawer closed when expanding Services submenu!');
      await page.screenshot({ path: 'debug-submenu-services-failed.png' });
      throw new Error('Drawer closed unexpectedly when expanding Services submenu');
    }
    
    // Verificar que los submenus de Services aparecieron
    const uplayItem = drawer.locator('.MuiListItemButton-root').filter({ hasText: 'UPlay' }).first();
    await expect(uplayItem).toBeVisible({ timeout: 5000 });
    
    console.log('✅ Services submenu expanded correctly');
    await page.screenshot({ path: 'debug-submenu-services-expanded.png' });

    // === TEST DE EXPANSIÓN DE SUBMENU "ADMINISTRATION" ===
    console.log('🧪 Testing Administration submenu expansion...');
    
    // Buscar el item "Administration" dentro del drawer
    const administrationItem = drawer.locator('.MuiListItemButton-root').filter({ hasText: 'Administration' }).first();
    await expect(administrationItem).toBeVisible();
    
    console.log('✅ Administration menu item found');
    
    // Hacer clic en Administration para expandir
    await administrationItem.click();
    await page.waitForTimeout(1000); // Esperar animación de expansión
    
    // Verificar que el drawer sigue abierto
    const isDrawerStillOpenAfterAdmin = await drawer.isVisible();
    console.log(`📋 Drawer still open after Administration click: ${isDrawerStillOpenAfterAdmin}`);
    
    if (!isDrawerStillOpenAfterAdmin) {
      console.log('❌ PROBLEM: Drawer closed when expanding Administration submenu!');
      await page.screenshot({ path: 'debug-submenu-admin-failed.png' });
      throw new Error('Drawer closed unexpectedly when expanding Administration submenu');
    }
    
    // Verificar que los submenus de Administration aparecieron
    const usersItem = drawer.locator('.MuiListItemButton-root').filter({ hasText: 'Users' }).first();
    await expect(usersItem).toBeVisible({ timeout: 5000 });
    
    console.log('✅ Administration submenu expanded correctly');
    await page.screenshot({ path: 'debug-submenu-admin-expanded.png' });

    // === TEST DE NAVEGACIÓN DESDE SUBMENU ===
    console.log('🧪 Testing navigation from submenu...');
    
    // Hacer clic en "Users" (que SÍ debería cerrar el drawer porque navega)
    await usersItem.click();
    await page.waitForTimeout(1000);
    
    // Verificar que navegó a la página de usuarios
    await expect(page).toHaveURL(/.*\/users/);
    console.log('✅ Navigation to Users page successful');
    
    // Verificar que el drawer se cerró después de la navegación (comportamiento esperado)
    const isDrawerClosedAfterNavigation = await drawer.isVisible();
    console.log(`📋 Drawer closed after navigation: ${!isDrawerClosedAfterNavigation}`);
    
    await page.screenshot({ path: 'debug-submenu-after-navigation.png' });

    // === TEST DE CONTRACCIÓN DE SUBMENU ===
    console.log('🧪 Testing submenu collapse...');
    
    // Abrir el drawer de nuevo
    await menuButton.click();
    await page.waitForTimeout(1000);
    
    // Expandir Administration de nuevo
    const administrationItemAgain = drawer.locator('.MuiListItemButton-root').filter({ hasText: 'Administration' }).first();
    await administrationItemAgain.click();
    await page.waitForTimeout(500);
    
    // Verificar que está expandido
    const usersItemVisible = await drawer.locator('.MuiListItemButton-root').filter({ hasText: 'Users' }).first().isVisible();
    expect(usersItemVisible).toBe(true);
    
    // Hacer clic en Administration de nuevo para contraer
    await administrationItemAgain.click();
    await page.waitForTimeout(1000);
    
    // Verificar que el drawer sigue abierto pero el submenu se contrajo
    const isDrawerStillOpenAfterCollapse = await drawer.isVisible();
    const usersItemHiddenAfterCollapse = await drawer.locator('.MuiListItemButton-root').filter({ hasText: 'Users' }).first().isVisible();
    
    console.log(`📋 Drawer still open after collapse: ${isDrawerStillOpenAfterCollapse}`);
    console.log(`📋 Users item hidden after collapse: ${!usersItemHiddenAfterCollapse}`);
    
    if (!isDrawerStillOpenAfterCollapse) {
      throw new Error('Drawer closed unexpectedly when collapsing submenu');
    }
    
    console.log('✅ Submenu collapse test successful');
    await page.screenshot({ path: 'debug-submenu-collapsed.png' });

    console.log('🎉 All submenu tests passed successfully!');
  });
}); 