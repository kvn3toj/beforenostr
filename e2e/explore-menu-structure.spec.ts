import { test, expect } from '@playwright/test';

test.describe('Gamifier Admin - Exploración del Menú', () => {
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

  test('🔍 Explorar estructura completa del menú', async ({ page }) => {
    console.log('\n🔍 Explorando estructura del menú...\n');
    
    // Esperar a que todo cargue
    await page.waitForTimeout(3000);
    
    // ========================================
    // 1. EXPLORAR TODOS LOS BOTONES
    // ========================================
    console.log('📋 PASO 1: Explorando todos los botones disponibles...');
    
    const allButtons = page.locator('button');
    const buttonCount = await allButtons.count();
    console.log(`🔍 Total de botones encontrados: ${buttonCount}`);
    
    for (let i = 0; i < Math.min(buttonCount, 20); i++) {
      const button = allButtons.nth(i);
      if (await button.isVisible()) {
        const buttonText = await button.textContent();
        const buttonRole = await button.getAttribute('role');
        const buttonAria = await button.getAttribute('aria-label');
        console.log(`   🔘 Botón ${i + 1}: "${buttonText?.trim()}" | Role: ${buttonRole} | Aria: ${buttonAria}`);
      }
    }

    // ========================================
    // 2. EXPLORAR NAVEGACIÓN (NAV)
    // ========================================
    console.log('\n🧭 PASO 2: Explorando elementos de navegación...');
    
    const navElements = page.locator('nav, [role="navigation"]');
    const navCount = await navElements.count();
    console.log(`🔍 Elementos de navegación encontrados: ${navCount}`);
    
    for (let i = 0; i < navCount; i++) {
      const nav = navElements.nth(i);
      if (await nav.isVisible()) {
        console.log(`   📍 Nav ${i + 1}: Visible`);
        
        // Buscar links dentro del nav
        const navLinks = nav.locator('a, button');
        const linkCount = await navLinks.count();
        console.log(`     Enlaces en nav: ${linkCount}`);
        
        for (let j = 0; j < Math.min(linkCount, 10); j++) {
          const link = navLinks.nth(j);
          const linkText = await link.textContent();
          const href = await link.getAttribute('href');
          console.log(`       🔗 Link ${j + 1}: "${linkText?.trim()}" (${href})`);
        }
      }
    }

    // ========================================
    // 3. EXPLORAR LINKS/ANCHORS
    // ========================================
    console.log('\n🔗 PASO 3: Explorando todos los enlaces...');
    
    const allLinks = page.locator('a');
    const linkCount = await allLinks.count();
    console.log(`🔍 Total de enlaces encontrados: ${linkCount}`);
    
    for (let i = 0; i < Math.min(linkCount, 15); i++) {
      const link = allLinks.nth(i);
      if (await link.isVisible()) {
        const linkText = await link.textContent();
        const href = await link.getAttribute('href');
        console.log(`   🔗 Enlace ${i + 1}: "${linkText?.trim()}" -> ${href}`);
      }
    }

    // ========================================
    // 4. EXPLORAR MENÚS LATERALES
    // ========================================
    console.log('\n🗂️ PASO 4: Buscando menús laterales o drawers...');
    
    const sideMenus = page.locator('[class*="drawer"], [class*="sidebar"], [class*="menu"], .MuiDrawer-root');
    const sideMenuCount = await sideMenus.count();
    console.log(`🔍 Menús laterales encontrados: ${sideMenuCount}`);
    
    for (let i = 0; i < sideMenuCount; i++) {
      const menu = sideMenus.nth(i);
      if (await menu.isVisible()) {
        console.log(`   📁 Menú lateral ${i + 1}: Visible`);
        
        const menuItems = menu.locator('button, a, [role="menuitem"]');
        const itemCount = await menuItems.count();
        console.log(`     Items en menú: ${itemCount}`);
        
        for (let j = 0; j < Math.min(itemCount, 10); j++) {
          const item = menuItems.nth(j);
          const itemText = await item.textContent();
          console.log(`       📄 Item ${j + 1}: "${itemText?.trim()}"`);
        }
      }
    }

    // ========================================
    // 5. PROBAR NAVEGACIÓN A PÁGINAS CONOCIDAS
    // ========================================
    console.log('\n🎯 PASO 5: Intentando navegar a páginas conocidas...');
    
    const knownPages = [
      { name: 'Users', selectors: ['[href="/users"]', 'button:has-text("Users")', 'a:has-text("Users")'] },
      { name: 'Roles', selectors: ['[href="/roles"]', 'button:has-text("Roles")', 'a:has-text("Roles")'] },
      { name: 'Mundos', selectors: ['[href="/mundos"]', 'button:has-text("Mundos")', 'a:has-text("Mundos")'] },
      { name: 'Playlists', selectors: ['[href="/playlists"]', 'button:has-text("Playlists")', 'a:has-text("Playlists")'] },
      { name: 'Permissions', selectors: ['[href="/permissions"]', 'button:has-text("Permissions")', 'a:has-text("Permissions")'] },
      { name: 'Items', selectors: ['[href="/items"]', 'button:has-text("Items")', 'a:has-text("Items")'] }
    ];
    
    for (const pageInfo of knownPages) {
      console.log(`\n🔍 Buscando navegación a ${pageInfo.name}...`);
      
      let found = false;
      for (const selector of pageInfo.selectors) {
        const element = page.locator(selector);
        if (await element.isVisible()) {
          console.log(`   ✅ Encontrado: ${selector}`);
          
          try {
            await element.click();
            await page.waitForTimeout(2000);
            
            // Verificar si navegó exitosamente
            const currentURL = page.url();
            console.log(`   📍 URL actual: ${currentURL}`);
            
            // Buscar indicadores de la página
            const pageTitle = page.locator('h1, h2, [role="heading"]').first();
            if (await pageTitle.isVisible()) {
              const titleText = await pageTitle.textContent();
              console.log(`   📋 Título de página: "${titleText?.trim()}"`);
            }
            
            found = true;
            
            // Volver al dashboard
            await page.goto('/');
            await page.waitForTimeout(1500);
            break;
            
          } catch (error) {
            console.log(`   ❌ Error navegando: ${error}`);
          }
        }
      }
      
      if (!found) {
        console.log(`   ⚠️ No se encontró navegación para ${pageInfo.name}`);
      }
    }

    // ========================================
    // 6. RESUMEN DE NAVEGACIÓN DISPONIBLE
    // ========================================
    console.log('\n📊 RESUMEN DE NAVEGACIÓN DISPONIBLE:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    // Intentar listar todas las rutas disponibles
    const allHrefs = await page.locator('a[href]').evaluateAll(elements => 
      elements.map(el => el.getAttribute('href')).filter(href => href && href.startsWith('/'))
    );
    
    const uniqueHrefs = [...new Set(allHrefs)];
    console.log('🔗 Rutas encontradas:');
    uniqueHrefs.forEach((href, index) => {
      console.log(`   ${index + 1}. ${href}`);
    });
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    // Pausa final para observación
    await page.waitForTimeout(5000);
  });
}); 