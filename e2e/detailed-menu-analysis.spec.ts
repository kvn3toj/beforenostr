import { test, expect } from '@playwright/test';

test.describe('Detailed Menu Analysis', () => {
  test('should analyze Material-UI drawer and navigation behavior', async ({ page }) => {
    // Capturar errores y logs
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log('❌ Console Error:', msg.text());
      }
    });
    
    page.on('pageerror', error => {
      console.log('❌ Page Error:', error.message);
    });

    console.log('🚀 Starting detailed menu analysis...');

    // === AUTENTICACIÓN ===
    await page.goto('/login');
    await page.fill('input[name="email"]', 'admin@gamifier.com');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/');
    
    // Verificar que llegamos al dashboard
    await page.waitForTimeout(2000);
    console.log('✅ Authentication completed');

    // === ANÁLISIS DE ESTRUCTURA DE DRAWER ===
    console.log('🔍 Analyzing MUI Drawer structure...');
    
    // Buscar el drawer de Material-UI
    const drawerSelectors = [
      '.MuiDrawer-root',
      '[data-testid="drawer"]',
      '[role="presentation"]',
      '.MuiDrawer-paper',
      'aside'
    ];
    
    let drawer = null;
    for (const selector of drawerSelectors) {
      const element = page.locator(selector).first();
      if (await element.isVisible()) {
        drawer = element;
        console.log(`✅ Found drawer with selector: ${selector}`);
        break;
      }
    }
    
    if (!drawer) {
      console.log('⚠️ No drawer found, checking for mobile menu button...');
      
      // Buscar botón de menú móvil
      const menuButton = page.locator('button[aria-label*="menu"], .MuiIconButton-root:has([data-testid="MenuIcon"])').first();
      if (await menuButton.isVisible()) {
        console.log('✅ Found mobile menu button, clicking...');
        await menuButton.click();
        await page.waitForTimeout(1000);
        
        // Intentar encontrar el drawer después de hacer clic
        for (const selector of drawerSelectors) {
          const element = page.locator(selector).first();
          if (await element.isVisible()) {
            drawer = element;
            console.log(`✅ Drawer opened with selector: ${selector}`);
            break;
          }
        }
      }
    }
    
    if (!drawer) {
      console.log('❌ No drawer found even after clicking menu button');
      await page.screenshot({ path: 'debug-no-drawer-found.png' });
      return;
    }

    // Tomar screenshot inicial del drawer
    await page.screenshot({ path: 'debug-drawer-initial.png' });
    
    // === ANÁLISIS DEL CONTENIDO DEL DRAWER ===
    console.log('📋 Analyzing drawer content...');
    
    // Obtener dimensiones del drawer
    const drawerBox = await drawer.boundingBox();
    console.log('📐 Drawer dimensions:', drawerBox);
    
    // Buscar el NavigationMenu dentro del drawer
    const navigationMenu = drawer.locator('[role="navigation"], .MuiList-root, nav').first();
    const hasNavigationMenu = await navigationMenu.isVisible();
    console.log('📋 Navigation menu visible:', hasNavigationMenu);
    
    if (hasNavigationMenu) {
      // Analizar elementos de navegación específicos
      const menuItems = await navigationMenu.locator('a, .MuiListItemButton-root, [role="menuitem"]').all();
      console.log(`📋 Found ${menuItems.length} navigation items`);
      
      // Extraer información de cada item
      for (let i = 0; i < Math.min(menuItems.length, 10); i++) {
        const item = menuItems[i];
        const text = await item.textContent();
        const href = await item.getAttribute('href');
        const isVisible = await item.isVisible();
        
        console.log(`📌 Item ${i + 1}: "${text?.trim()}" | href: "${href}" | visible: ${isVisible}`);
      }
    }

    // === TEST DE NAVEGACIÓN CON OBSERVACIÓN DEL DRAWER ===
    console.log('🧪 Testing navigation with drawer observation...');
    
    const testRoutes = [
      { path: '/users', name: 'Users' },
      { path: '/roles', name: 'Roles' },
      { path: '/playlists', name: 'Playlists' },
      { path: '/mundos', name: 'Mundos' }
    ];
    
    for (const route of testRoutes) {
      console.log(`🔄 Testing navigation to ${route.name} (${route.path})`);
      
      try {
        // Navegar
        await page.goto(route.path);
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(1500);
        
        // Verificar si el drawer sigue visible
        const isDrawerVisible = await drawer.isVisible();
        console.log(`📋 Drawer visible on ${route.name}: ${isDrawerVisible}`);
        
        if (isDrawerVisible) {
          // Obtener nuevas dimensiones
          const currentBox = await drawer.boundingBox();
          console.log(`📐 Drawer dimensions on ${route.name}:`, currentBox);
          
          // Comparar con dimensiones iniciales
          if (drawerBox && currentBox) {
            const widthDiff = Math.abs(drawerBox.width - currentBox.width);
            const heightDiff = Math.abs(drawerBox.height - currentBox.height);
            const xDiff = Math.abs(drawerBox.x - currentBox.x);
            const yDiff = Math.abs(drawerBox.y - currentBox.y);
            
            console.log(`📊 Drawer changes on ${route.name}:`);
            console.log(`   Width: ${widthDiff}px, Height: ${heightDiff}px`);
            console.log(`   Position X: ${xDiff}px, Y: ${yDiff}px`);
            
            // Detectar cambios significativos
            if (widthDiff > 10 || heightDiff > 10 || xDiff > 10 || yDiff > 10) {
              console.log(`⚠️ Significant drawer change detected on ${route.name}!`);
              await page.screenshot({ path: `debug-drawer-change-${route.name.toLowerCase()}.png` });
            }
          }
          
          // Verificar si hay elementos de menú que cambian de estado
          if (hasNavigationMenu) {
            const currentMenuItems = await navigationMenu.locator('a, .MuiListItemButton-root').all();
            
            for (let i = 0; i < Math.min(currentMenuItems.length, 5); i++) {
              const item = currentMenuItems[i];
              const isSelected = await item.getAttribute('class')?.then(cls => cls?.includes('Mui-selected') || false) || false;
              const text = await item.textContent();
              
              if (isSelected) {
                console.log(`✅ Active menu item on ${route.name}: "${text?.trim()}"`);
              }
            }
          }
        } else {
          console.log(`❌ Drawer disappeared on ${route.name}!`);
          await page.screenshot({ path: `debug-drawer-disappeared-${route.name.toLowerCase()}.png` });
        }
        
        // Screenshot de cada página
        await page.screenshot({ path: `debug-page-${route.name.toLowerCase()}.png` });
        
      } catch (error) {
        console.log(`❌ Error testing ${route.name}:`, error.message);
      }
    }

    // === TEST DE COLAPSO/EXPANSIÓN DEL DRAWER ===
    console.log('🔄 Testing drawer collapse/expand...');
    
    // Volver al inicio
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    // Buscar botón de colapso específico de Material-UI
    const collapseSelectors = [
      'button[aria-label*="drawer"], button[aria-label*="menu"]',
      '.MuiIconButton-root:has([data-testid="MenuIcon"])',
      'button:has(svg[data-testid="MenuIcon"])',
      '[data-testid="menu-toggle"]'
    ];
    
    for (const selector of collapseSelectors) {
      const button = page.locator(selector).first();
      if (await button.isVisible()) {
        console.log(`✅ Found collapse button: ${selector}`);
        
        // Test colapso
        await page.screenshot({ path: 'debug-drawer-before-toggle.png' });
        await button.click();
        await page.waitForTimeout(800); // Esperar animación MUI
        await page.screenshot({ path: 'debug-drawer-after-toggle.png' });
        
        // Test expansión
        await button.click();
        await page.waitForTimeout(800);
        await page.screenshot({ path: 'debug-drawer-after-expand.png' });
        
        break;
      }
    }

    // === TEST DE HOVER EN ELEMENTOS DEL MENÚ ===
    console.log('🖱️ Testing menu item hover effects...');
    
    if (hasNavigationMenu) {
      const hoverableItems = await navigationMenu.locator('.MuiListItemButton-root').all();
      
      for (let i = 0; i < Math.min(hoverableItems.length, 4); i++) {
        const item = hoverableItems[i];
        const text = await item.textContent();
        
        console.log(`🖱️ Testing hover on: "${text?.trim()}"`);
        
        await item.hover();
        await page.waitForTimeout(300);
        await page.screenshot({ path: `debug-menu-hover-${i + 1}.png` });
      }
    }

    console.log('✅ Detailed menu analysis completed!');
  });
}); 