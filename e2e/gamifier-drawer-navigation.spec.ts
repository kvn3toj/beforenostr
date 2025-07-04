import { test, expect } from '@playwright/test';

test.describe('Gamifier Admin - Navegación con Drawer', () => {
  test.beforeEach(async ({ page }) => {
    // Capturar errores de consola
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        console.log(`🔴 Console error: ${msg.text()}`);
      }
    });

    // Flujo de autenticación
    await page.goto('/login');
    await page.fill('input[name="email"]', 'admin@gamifier.com');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/');
    
    // Verificar login exitoso
    await expect(page.getByRole('heading', { name: 'Welcome to Gamifier Admin' })).toBeVisible();
  });

  test('🚀 Navegación completa a través del Drawer/Menú Lateral', async ({ page }) => {
    console.log('\n🎯 Iniciando navegación completa del Gamifier Admin...\n');
    
    // Esperar a que todo cargue
    await page.waitForTimeout(3000);
    
    // ========================================
    // 1. BUSCAR Y ABRIR EL DRAWER/MENÚ LATERAL
    // ========================================
    console.log('🔍 PASO 1: Buscando el botón para abrir el menú lateral...');
    
    // Posibles selectores para el botón del menú
    const menuButtonSelectors = [
      'button[aria-label*="menu"]',
      'button[aria-label*="Menu"]',
      'button[aria-label*="navigation"]',
      'button[aria-label*="drawer"]',
      'button[aria-label*="toggle"]',
      '[data-testid="menu-button"]',
      '[data-testid="drawer-toggle"]',
      '.menu-button',
      '.drawer-toggle',
      'button:has(svg)',  // Botones con iconos
      'button[aria-expanded]',
      'button[class*="menu"]',
      'button[class*="burger"]',
      'button[class*="hamburger"]'
    ];
    
    let menuButton = null;
    for (const selector of menuButtonSelectors) {
      const element = page.locator(selector);
      if (await element.isVisible()) {
        console.log(`✅ Encontrado botón de menú: ${selector}`);
        menuButton = element;
        break;
      }
    }
    
    // Si no encontramos un botón específico, buscar botones con iconos hamburguesa
    if (!menuButton) {
      console.log('🔍 Buscando botones con iconos...');
      const iconButtons = page.locator('button').filter({ has: page.locator('svg') });
      const iconButtonCount = await iconButtons.count();
      
      for (let i = 0; i < iconButtonCount; i++) {
        const button = iconButtons.nth(i);
        if (await button.isVisible()) {
          const ariaLabel = await button.getAttribute('aria-label');
          console.log(`   🔘 Botón con icono ${i + 1}: aria-label="${ariaLabel}"`);
          
          // Intentar hacer clic si parece ser un botón de menú
          if (!menuButton && (
            ariaLabel?.toLowerCase().includes('menu') ||
            ariaLabel?.toLowerCase().includes('navigation') ||
            ariaLabel?.toLowerCase().includes('drawer') ||
            ariaLabel?.toLowerCase().includes('sidebar')
          )) {
            menuButton = button;
            console.log(`✅ Seleccionado como botón de menú`);
            break;
          }
        }
      }
    }
    
    // ========================================
    // 2. ABRIR EL MENÚ/DRAWER
    // ========================================
    if (menuButton) {
      console.log('\n📂 PASO 2: Abriendo el menú lateral...');
      await menuButton.click();
      await page.waitForTimeout(1500);
      
      // Verificar si el drawer se abrió
      const drawerSelectors = [
        '.MuiDrawer-root',
        '[role="navigation"]',
        '.drawer',
        '.sidebar',
        '[class*="drawer"]',
        '[class*="sidebar"]',
        '[class*="menu"]'
      ];
      
      let drawer = null;
      for (const selector of drawerSelectors) {
        const element = page.locator(selector);
        if (await element.isVisible()) {
          console.log(`✅ Drawer encontrado: ${selector}`);
          drawer = element;
          break;
        }
      }
      
      if (drawer) {
        // ========================================
        // 3. EXPLORAR OPCIONES DEL MENÚ
        // ========================================
        console.log('\n📋 PASO 3: Explorando opciones del menú...');
        
        const menuItems = drawer.locator('a, button, [role="menuitem"], li');
        const itemCount = await menuItems.count();
        console.log(`🔍 Items de menú encontrados: ${itemCount}`);
        
        const menuOptions = [];
        for (let i = 0; i < itemCount; i++) {
          const item = menuItems.nth(i);
          if (await item.isVisible()) {
            const itemText = await item.textContent();
            const href = await item.getAttribute('href');
            const role = await item.getAttribute('role');
            
            if (itemText?.trim()) {
              menuOptions.push({
                index: i,
                text: itemText.trim(),
                href: href,
                role: role,
                element: item
              });
              console.log(`   📄 ${i + 1}. "${itemText.trim()}" ${href ? `(${href})` : ''}`);
            }
          }
        }
        
        // ========================================
        // 4. NAVEGAR A CADA PÁGINA DISPONIBLE
        // ========================================
        console.log('\n🎯 PASO 4: Navegando a cada página disponible...');
        
        for (const option of menuOptions) {
          console.log(`\n📍 Navegando a: ${option.text}`);
          
          try {
            // Abrir el menú si está cerrado
            if (menuButton && !(await drawer.isVisible())) {
              await menuButton.click();
              await page.waitForTimeout(500);
            }
            
            // Hacer clic en la opción
            await option.element.click();
            await page.waitForTimeout(2000);
            
            // Verificar navegación
            const currentURL = page.url();
            console.log(`   📍 URL actual: ${currentURL}`);
            
            // Buscar título de la página
            const pageTitle = page.locator('h1, h2, [role="heading"]').first();
            if (await pageTitle.isVisible()) {
              const titleText = await pageTitle.textContent();
              console.log(`   📋 Título: "${titleText?.trim()}"`);
            }
            
            // Verificar si hay contenido específico
            if (currentURL.includes('/users')) {
              console.log('   👥 Verificando página de usuarios...');
              const usersTable = page.locator('table, .data-table');
              if (await usersTable.isVisible()) {
                console.log('   ✅ Tabla de usuarios encontrada');
              }
            } else if (currentURL.includes('/roles')) {
              console.log('   🔐 Verificando página de roles...');
              const rolesTable = page.locator('table, .data-table');
              if (await rolesTable.isVisible()) {
                console.log('   ✅ Tabla de roles encontrada');
              }
            } else if (currentURL.includes('/mundos')) {
              console.log('   🌍 Verificando página de mundos...');
              const mundosCards = page.locator('.mundo-card, [data-testid*="mundo"]');
              const mundoCount = await mundosCards.count();
              console.log(`   📊 Mundos encontrados: ${mundoCount}`);
            } else if (currentURL.includes('/playlists')) {
              console.log('   📋 Verificando página de playlists...');
              const playlistsCards = page.locator('.playlist-card, [data-testid*="playlist"]');
              const playlistCount = await playlistsCards.count();
              console.log(`   📊 Playlists encontradas: ${playlistCount}`);
            } else if (currentURL.includes('/permissions')) {
              console.log('   🔑 Verificando página de permisos...');
              const permissionsTable = page.locator('table, .data-table');
              if (await permissionsTable.isVisible()) {
                console.log('   ✅ Tabla de permisos encontrada');
              }
            } else if (currentURL.includes('/items')) {
              console.log('   📹 Verificando página de contenido...');
              const itemsTable = page.locator('table, .data-table');
              if (await itemsTable.isVisible()) {
                console.log('   ✅ Tabla de contenido encontrada');
              }
            } else if (currentURL.includes('/config') || currentURL.includes('/video')) {
              console.log('   ⚙️ Verificando página de configuración...');
              const configTabs = page.locator('[role="tab"]');
              const tabCount = await configTabs.count();
              console.log(`   📊 Tabs de configuración: ${tabCount}`);
              
              // Verificar tab de subtítulos
              const subtitleTab = page.getByRole('tab', { name: /subtitle/i });
              if (await subtitleTab.isVisible()) {
                console.log('   ✅ Tab de subtítulos encontrado');
                await subtitleTab.click();
                await page.waitForTimeout(1000);
                
                // Buscar botón de gestión
                const manageBtn = page.getByRole('button', { name: /manage|gestionar/i });
                if (await manageBtn.isVisible()) {
                  console.log('   ✅ Botón de gestión de subtítulos encontrado');
                  await manageBtn.click();
                  await page.waitForTimeout(2000);
                  
                  // Verificar modal
                  const modal = page.locator('[role="dialog"], .modal');
                  if (await modal.isVisible()) {
                    console.log('   ✅ Modal de gestión abierto');
                    await page.keyboard.press('Escape');
                    await page.waitForTimeout(500);
                  }
                }
              }
              
              // Verificar tab de preguntas
              const questionTab = page.getByRole('tab', { name: /question/i });
              if (await questionTab.isVisible()) {
                console.log('   ✅ Tab de preguntas encontrado');
                await questionTab.click();
                await page.waitForTimeout(1000);
              }
            }
            
            console.log(`   ✅ Navegación a "${option.text}" completada`);
            
            // Pausa para observación
            await page.waitForTimeout(2000);
            
          } catch (error) {
            console.log(`   ❌ Error navegando a "${option.text}": ${error}`);
          }
        }
        
        // ========================================
        // 5. RESUMEN FINAL
        // ========================================
        console.log('\n✅ NAVEGACIÓN COMPLETADA');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📊 Páginas navegadas:');
        menuOptions.forEach((option, index) => {
          console.log(`   ${index + 1}. ${option.text} ${option.href ? `(${option.href})` : ''}`);
        });
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        
      } else {
        console.log('❌ No se pudo encontrar el drawer después de hacer clic');
      }
      
    } else {
      console.log('❌ No se encontró botón para abrir el menú');
    }
    
    // Pausa final para observación
    await page.waitForTimeout(5000);
  });
}); 