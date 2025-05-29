import { test, expect } from '@playwright/test';

test.describe('Simple Menu Behavior Test', () => {
  test('should check menu behavior during navigation', async ({ page }) => {
    // Capturar errores de consola
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log('❌ Console Error:', msg.text());
      }
    });
    
    page.on('pageerror', error => {
      console.log('❌ Page Error:', error.message);
    });

    console.log('🚀 Starting menu behavior test...');

    // === FLUJO DE AUTENTICACIÓN ===
    await page.goto('/login');
    
    // Rellenar credenciales
    await page.fill('input[name="email"]', 'admin@gamifier.com');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');
    
    // Esperar la redirección
    await page.waitForURL('**/');
    
    // Verificar que hayamos llegado al dashboard (buscar cualquier texto administrativo)
    const dashboardIndicators = [
      'Gamifier Admin',
      'Admin Dashboard',
      'Dashboard',
      'Welcome',
      'Users',
      'Roles',
      'Playlists',
      'Mundos'
    ];
    
    let dashboardFound = false;
    for (const indicator of dashboardIndicators) {
      try {
        await expect(page.getByText(indicator)).toBeVisible({ timeout: 5000 });
        console.log(`✅ Dashboard confirmed with indicator: "${indicator}"`);
        dashboardFound = true;
        break;
      } catch (e) {
        // Continuar probando otros indicadores
      }
    }
    
    if (!dashboardFound) {
      console.log('⚠️ No dashboard indicator found, taking screenshot for debugging');
      await page.screenshot({ path: 'debug-login-result.png' });
    }

    // === ANÁLISIS DEL MENÚ ===
    console.log('🔍 Analyzing menu structure...');
    
    // Buscar el contenedor principal del menú con múltiples selectores
    const menuSelectors = [
      'nav',
      '[role="navigation"]',
      '.menu',
      '.sidebar',
      '.navigation',
      '[data-testid*="menu"]',
      '[data-testid*="sidebar"]',
      '[data-testid*="nav"]'
    ];
    
    let mainMenu = null;
    for (const selector of menuSelectors) {
      const menu = page.locator(selector).first();
      if (await menu.isVisible()) {
        mainMenu = menu;
        console.log(`✅ Found menu with selector: ${selector}`);
        break;
      }
    }
    
    if (!mainMenu) {
      console.log('❌ No menu found, taking screenshot');
      await page.screenshot({ path: 'debug-no-menu-found.png' });
      return;
    }

    // Tomar screenshot inicial del menú
    await page.screenshot({ path: 'debug-menu-initial.png' });
    
    // Obtener dimensiones iniciales del menú
    const initialBox = await mainMenu.boundingBox();
    console.log('📐 Initial menu dimensions:', initialBox);

    // === NAVEGACIÓN Y ANÁLISIS ===
    const testRoutes = ['/users', '/roles', '/playlists', '/mundos'];
    
    for (const route of testRoutes) {
      console.log(`🧪 Testing route: ${route}`);
      
      try {
        // Navegar a la ruta
        await page.goto(route);
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(1000); // Esperar animaciones
        
        // Verificar que el menú siga visible
        const isMenuVisible = await mainMenu.isVisible();
        console.log(`📋 Menu visible after navigating to ${route}: ${isMenuVisible}`);
        
        if (isMenuVisible) {
          // Obtener nuevas dimensiones
          const currentBox = await mainMenu.boundingBox();
          console.log(`📐 Menu dimensions on ${route}:`, currentBox);
          
          // Comparar dimensiones
          if (initialBox && currentBox) {
            const widthDiff = Math.abs(initialBox.width - currentBox.width);
            const heightDiff = Math.abs(initialBox.height - currentBox.height);
            
            console.log(`📊 Size changes on ${route}: width=${widthDiff}px, height=${heightDiff}px`);
            
            // Si hay cambios significativos, tomar screenshot
            if (widthDiff > 50 || heightDiff > 50) {
              console.log(`⚠️ Significant size change detected on ${route}!`);
              await page.screenshot({ path: `debug-menu-size-change-${route.replace('/', '')}.png` });
            }
          }
        } else {
          console.log(`❌ Menu disappeared on ${route}!`);
          await page.screenshot({ path: `debug-menu-disappeared-${route.replace('/', '')}.png` });
        }
        
        // Tomar screenshot de cada página
        await page.screenshot({ path: `debug-navigation-${route.replace('/', '')}.png` });
        
      } catch (error) {
        console.log(`❌ Error navigating to ${route}:`, error.message);
      }
    }

    // === TEST DE ELEMENTOS DEL MENÚ ===
    console.log('🖱️ Testing menu item interactions...');
    
    // Volver al dashboard
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Buscar enlaces de menú
    const menuLinks = await page.locator('nav a, .menu a, [role="navigation"] a').all();
    console.log(`📋 Found ${menuLinks.length} menu links`);
    
    // Probar hover en los primeros elementos del menú
    for (let i = 0; i < Math.min(menuLinks.length, 4); i++) {
      try {
        const link = menuLinks[i];
        const text = await link.textContent() || `Link ${i + 1}`;
        
        console.log(`🖱️ Testing hover on: "${text}"`);
        
        // Hacer hover
        await link.hover();
        await page.waitForTimeout(500);
        
        // Tomar screenshot del estado hover
        await page.screenshot({ path: `debug-hover-${i + 1}.png` });
        
      } catch (error) {
        console.log(`⚠️ Error testing hover on menu item ${i + 1}:`, error.message);
      }
    }

    console.log('✅ Menu behavior test completed!');
  });
}); 