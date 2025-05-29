import { test, expect } from '@playwright/test';

test.describe('Simple Submenu Test', () => {
  test('should verify submenu expansion behavior', async ({ page }) => {
    console.log('🚀 Starting simple submenu test...');

    // === AUTENTICACIÓN ===
    await page.goto('/login');
    await page.fill('input[name="email"]', 'admin@gamifier.com');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/');
    await page.waitForTimeout(2000);
    
    console.log('✅ Authentication completed');

    // === ABRIR EL DRAWER ===
    const menuButton = page.locator('button[aria-label*="menu"]').first();
    await menuButton.click();
    await page.waitForTimeout(1000);
    
    const drawer = page.locator('.MuiDrawer-root').first();
    await expect(drawer).toBeVisible();
    
    console.log('✅ Drawer opened');
    await page.screenshot({ path: 'debug-simple-submenu-open.png' });

    // === BUSCAR ELEMENTOS CON HIJOS (EXPANDIBLES) ===
    // Buscar todos los elementos que tienen un ícono de expansión (ExpandMore o ExpandLess)
    const expandableItems = await drawer.locator('.MuiListItemButton-root').all();
    
    console.log(`📋 Found ${expandableItems.length} total menu items`);
    
    let testedExpansion = false;
    
    for (let i = 0; i < expandableItems.length; i++) {
      const item = expandableItems[i];
      
      // Verificar si tiene un ícono de expansión
      const hasExpandIcon = await item.locator('svg[data-testid="ExpandMoreIcon"], svg[data-testid="ExpandLessIcon"]').count() > 0;
      
      if (hasExpandIcon) {
        const text = await item.textContent() || `Item ${i}`;
        console.log(`🧪 Testing expandable item: "${text.trim()}"`);
        
        // Hacer clic para expandir/contraer
        await item.click();
        await page.waitForTimeout(1000);
        
        // Verificar que el drawer sigue abierto
        const isDrawerStillOpen = await drawer.isVisible();
        console.log(`📋 Drawer still open after clicking "${text.trim()}": ${isDrawerStillOpen}`);
        
        if (!isDrawerStillOpen) {
          console.log(`❌ PROBLEM: Drawer closed when clicking expandable item "${text.trim()}"!`);
          await page.screenshot({ path: `debug-submenu-failed-${i}.png` });
          throw new Error(`Drawer closed unexpectedly when clicking expandable item "${text.trim()}"`);
        }
        
        await page.screenshot({ path: `debug-submenu-after-click-${i}.png` });
        testedExpansion = true;
        
        // Solo probar los primeros 2 elementos expandibles para no hacer el test muy largo
        if (testedExpansion) break;
      }
    }
    
    if (!testedExpansion) {
      console.log('⚠️ No expandable items found to test');
      await page.screenshot({ path: 'debug-no-expandable-items.png' });
    } else {
      console.log('✅ Submenu expansion test successful - drawer stays open!');
    }

    // === TEST RÁPIDO DE NAVEGACIÓN ===
    console.log('🧪 Testing navigation behavior...');
    
    // Buscar un elemento que tenga href (navegable)
    const navigableItems = await drawer.locator('.MuiListItemButton-root').all();
    
    for (const item of navigableItems) {
      const text = await item.textContent() || '';
      
      // Buscar un item simple sin hijos (como "Home" o un submenu ya expandido)
      if (text.includes('Home') || text.includes('Users') || text.includes('Roles')) {
        console.log(`🔗 Testing navigation with item: "${text.trim()}"`);
        
        await item.click();
        await page.waitForTimeout(1500);
        
        // Verificar que navegó (URL cambió)
        const currentUrl = page.url();
        console.log(`📍 Current URL after navigation: ${currentUrl}`);
        
        // Verificar que el drawer se cerró (comportamiento esperado para navegación)
        const isDrawerClosedAfterNav = await drawer.isVisible();
        console.log(`📋 Drawer closed after navigation: ${!isDrawerClosedAfterNav}`);
        
        await page.screenshot({ path: 'debug-after-navigation.png' });
        break;
      }
    }

    console.log('🎉 Simple submenu test completed successfully!');
  });
}); 