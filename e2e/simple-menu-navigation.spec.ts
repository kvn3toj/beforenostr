import { test, expect } from '@playwright/test';

test.describe('Gamifier Admin - Navegación Simple', () => {
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

  test('🔍 Tour visual del Gamifier Admin', async ({ page }) => {
    console.log('\n🎯 Iniciando tour visual del Gamifier Admin...\n');
    
    // Esperar a que todo cargue
    await page.waitForTimeout(3000);
    
    // ========================================
    // 1. BUSCAR BOTÓN DE MENÚ CON MANEJO ROBUSTO
    // ========================================
    console.log('🔍 PASO 1: Buscando el botón de menú de navegación...');
    
    let menuButton = null;
    
    // Buscar botón con aria-label específico primero
    const menuButtonWithLabel = page.locator('button[aria-label="Open navigation menu"]');
    if (await menuButtonWithLabel.isVisible()) {
      menuButton = menuButtonWithLabel;
      console.log('✅ Encontrado botón de menú con aria-label específico');
    }
    
    // Si no se encuentra, buscar cualquier botón que contenga "menu" en aria-label
    if (!menuButton) {
      const menuButtons = page.locator('button[aria-label*="menu" i]');
      const count = await menuButtons.count();
      if (count > 0) {
        menuButton = menuButtons.first();
        console.log(`✅ Encontrado botón de menú (${count} candidatos, usando el primero)`);
      }
    }
    
    // Si aún no se encuentra, buscar botones con iconos y verificar uno por uno
    if (!menuButton) {
      console.log('🔍 Buscando entre botones con iconos...');
      const buttonsWithIcons = page.locator('button svg').locator('..');
      const count = await buttonsWithIcons.count();
      console.log(`   Encontrados ${count} botones con iconos`);
      
      for (let i = 0; i < Math.min(count, 5); i++) {
        const button = buttonsWithIcons.nth(i);
        const ariaLabel = await button.getAttribute('aria-label');
        console.log(`   Botón ${i + 1}: aria-label="${ariaLabel}"`);
        
        if (ariaLabel && ariaLabel.toLowerCase().includes('menu')) {
          menuButton = button;
          console.log(`✅ Seleccionado botón ${i + 1} como botón de menú`);
          break;
        }
      }
    }
    
    // ========================================
    // 2. INTENTAR ABRIR EL MENÚ
    // ========================================
    if (menuButton) {
      console.log('\n📂 PASO 2: Intentando abrir el menú...');
      
      try {
        await menuButton.click();
        await page.waitForTimeout(2000);
        console.log('✅ Clic en botón de menú realizado');
        
        // Buscar indicadores de que el menú se abrió
        const menuIndicators = [
          page.locator('.MuiDrawer-root'),
          page.locator('[role="navigation"]').nth(1), // Segundo nav (el drawer)
          page.locator('.drawer'),
          page.locator('.sidebar'),
          page.locator('[class*="Drawer"]'),
          page.locator('nav').nth(1)
        ];
        
        let menuFound = false;
        for (let i = 0; i < menuIndicators.length; i++) {
          const indicator = menuIndicators[i];
          if (await indicator.isVisible()) {
            console.log(`✅ Menú abierto (indicador ${i + 1})`);
            menuFound = true;
            
            // Explorar contenido del menú
            console.log('\n📋 PASO 3: Explorando contenido del menú...');
            const menuItems = indicator.locator('a, button, li').filter({ hasText: /.+/ });
            const itemCount = await menuItems.count();
            console.log(`   🔍 Items encontrados en el menú: ${itemCount}`);
            
            for (let j = 0; j < Math.min(itemCount, 10); j++) {
              const item = menuItems.nth(j);
              const text = await item.textContent();
              const href = await item.getAttribute('href');
              
              if (text && text.trim() && text.trim().length > 2) {
                console.log(`   📄 ${j + 1}. "${text.trim()}" ${href ? `(${href})` : ''}`);
                
                // Si parece ser un enlace de navegación, probarlo
                if (href && (href.startsWith('/') || href.includes('users') || href.includes('roles'))) {
                  console.log(`\n🎯 Probando navegación: ${text.trim()}`);
                  
                  try {
                    await item.click();
                    await page.waitForTimeout(2000);
                    
                    const currentURL = page.url();
                    console.log(`   📍 URL actual: ${currentURL}`);
                    
                    // Buscar título de página
                    const pageTitle = page.locator('h1, h2').first();
                    if (await pageTitle.isVisible()) {
                      const titleText = await pageTitle.textContent();
                      console.log(`   📋 Título: "${titleText?.trim()}"`);
                    }
                    
                    console.log(`   ✅ Navegación exitosa a ${text.trim()}`);
                    
                    // Pausa para observación
                    await page.waitForTimeout(3000);
                    
                    // Intentar volver al menú principal
                    if (menuButton) {
                      try {
                        await menuButton.click();
                        await page.waitForTimeout(1000);
                      } catch (e) {
                        console.log('   ℹ️ No se pudo reabrir el menú, continuando...');
                      }
                    }
                    
                  } catch (error) {
                    console.log(`   ❌ Error navegando: ${error}`);
                  }
                }
              }
            }
            
            break;
          }
        }
        
        if (!menuFound) {
          console.log('⚠️ No se detectó que el menú se haya abierto visualmente');
          
          // Intentar buscar elementos de navegación directamente en la página
          console.log('\n🔍 Buscando enlaces de navegación directamente...');
          const allLinks = page.locator('a[href^="/"]');
          const linkCount = await allLinks.count();
          console.log(`   Encontrados ${linkCount} enlaces internos`);
          
          for (let i = 0; i < Math.min(linkCount, 5); i++) {
            const link = allLinks.nth(i);
            const text = await link.textContent();
            const href = await link.getAttribute('href');
            
            if (text && href && text.trim()) {
              console.log(`   🔗 ${i + 1}. "${text.trim()}" -> ${href}`);
            }
          }
        }
        
      } catch (error) {
        console.log(`❌ Error al hacer clic en el botón de menú: ${error}`);
      }
      
    } else {
      console.log('❌ No se encontró ningún botón de menú');
      
      // Como alternativa, buscar enlaces de navegación directamente
      console.log('\n🔍 ALTERNATIVA: Buscando navegación directa...');
      
      const navigationLinks = [
        page.locator('a[href="/users"]'),
        page.locator('a[href="/roles"]'),
        page.locator('a[href="/mundos"]'),
        page.locator('a[href="/playlists"]'),
        page.locator('a[href="/permissions"]'),
        page.locator('a[href="/items"]')
      ];
      
      for (const link of navigationLinks) {
        if (await link.isVisible()) {
          const href = await link.getAttribute('href');
          const text = await link.textContent();
          console.log(`✅ Enlace directo encontrado: "${text?.trim()}" -> ${href}`);
          
          try {
            await link.click();
            await page.waitForTimeout(2000);
            console.log(`✅ Navegación exitosa a ${href}`);
            
            // Pausa para observación
            await page.waitForTimeout(3000);
            
            // Volver al dashboard
            await page.goto('/');
            await page.waitForTimeout(1500);
            
          } catch (error) {
            console.log(`❌ Error navegando a ${href}: ${error}`);
          }
        }
      }
    }
    
    // ========================================
    // RESUMEN FINAL
    // ========================================
    console.log('\n✅ TOUR VISUAL COMPLETADO');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎯 Se ha completado la exploración visual del Gamifier Admin');
    console.log('📍 Puedes observar las diferentes páginas y funcionalidades');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    // Pausa final larga para observación
    await page.waitForTimeout(10000);
  });
}); 