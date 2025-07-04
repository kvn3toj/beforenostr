const { chromium } = require('playwright');

async function testAllAdminPages() {
  console.log('🎯 Iniciando test de todas las páginas de administración...\n');
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 500 
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();

  // Capturar errores críticos
  page.on('pageerror', error => {
    console.error('❌ PAGE ERROR:', error.message);
  });

  page.on('requestfailed', request => {
    console.error('❌ REQUEST FAILED:', request.url(), request.failure().errorText);
  });

  try {
    // 1. LOGIN
    console.log('1. Realizando login...');
    await page.goto('http://localhost:3000/login');
    await page.waitForLoadState('networkidle');
    await page.fill('input[name="email"]', 'admin@gamifier.com');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/');

    // Verificar login exitoso
    try {
      await page.waitForSelector('nav, [role="navigation"], button[aria-label*="menu"]', { timeout: 5000 });
      console.log('✅ Login exitoso');
    } catch {
      const currentUrl = page.url();
      if (!currentUrl.includes('/login')) {
        console.log('✅ Login exitoso - Verificado por URL');
      } else {
        throw new Error('Login falló');
      }
    }

    // 2. VERIFICAR PÁGINAS DE ADMINISTRACIÓN
    const adminPages = [
      { name: 'Users', url: '/users', shouldWork: true },
      { name: 'Roles', url: '/roles', shouldWork: true },
      { name: 'Permissions', url: '/permissions', shouldWork: true },
      { name: 'Items', url: '/items', shouldWork: true },
      { name: 'Mundos', url: '/mundos', shouldWork: true },
      { name: 'Playlists', url: '/playlists', shouldWork: true },
      { name: 'Analytics', url: '/analytics', shouldWork: true },
      { name: 'Audit Logs', url: '/audit-logs', shouldWork: true },
      { name: 'Settings', url: '/settings', shouldWork: true },
    ];

    for (const adminPage of adminPages) {
      console.log(`\n📋 Verificando página: ${adminPage.name}`);
      
      try {
        await page.goto(`http://localhost:3000${adminPage.url}`);
        await page.waitForLoadState('networkidle');
        
        // Verificar si hay errores visibles
        const errorElements = await page.locator('text=Error, text=404, text=500, text=Not Found, text=Unauthorized').count();
        
        if (errorElements > 0) {
          console.log(`❌ ${adminPage.name}: Errores detectados en la página`);
        } else {
          console.log(`✅ ${adminPage.name}: Página carga sin errores visibles`);
        }

        // Verificar si hay contenido útil (tablas, formularios, etc.)
        const contentElements = await page.locator('table, form, [role="grid"], h1, h2').count();
        
        if (contentElements > 0) {
          console.log(`✅ ${adminPage.name}: Contenido detectado`);
        } else {
          console.log(`⚠️ ${adminPage.name}: Página vacía o sin contenido principal`);
        }

      } catch (error) {
        console.log(`❌ ${adminPage.name}: Error navegando - ${error.message}`);
      }
    }

    // 3. VERIFICAR PÁGINAS DE GAMIFICACIÓN
    const gamificationPages = [
      { name: 'Tokens', url: '/tokens', shouldWork: true },
      { name: 'Wallet', url: '/wallet', shouldWork: true },
      { name: 'Merits', url: '/merits', shouldWork: true },
    ];

    console.log('\n🎮 VERIFICANDO PÁGINAS DE GAMIFICACIÓN:');

    for (const gamPage of gamificationPages) {
      console.log(`\n📋 Verificando página: ${gamPage.name}`);
      
      try {
        await page.goto(`http://localhost:3000${gamPage.url}`);
        await page.waitForLoadState('networkidle');
        
        // Verificar si hay errores visibles
        const errorElements = await page.locator('text=Error, text=404, text=500, text=Not Found, text=Unauthorized').count();
        
        if (errorElements > 0) {
          console.log(`❌ ${gamPage.name}: Errores detectados en la página`);
        } else {
          console.log(`✅ ${gamPage.name}: Página carga sin errores visibles`);
        }

        // Verificar si hay contenido útil
        const contentElements = await page.locator('table, form, [role="grid"], h1, h2, .card, .paper').count();
        
        if (contentElements > 0) {
          console.log(`✅ ${gamPage.name}: Contenido detectado`);
        } else {
          console.log(`⚠️ ${gamPage.name}: Página vacía o sin contenido principal`);
        }

        // Capturar screenshot para análisis
        await page.screenshot({ 
          path: `debug-${gamPage.name.toLowerCase()}-page.png`,
          fullPage: true 
        });

      } catch (error) {
        console.log(`❌ ${gamPage.name}: Error navegando - ${error.message}`);
      }
    }

    console.log('\n🎉 Verificación de páginas completada');

  } catch (error) {
    console.error('❌ Error durante el test:', error);
  } finally {
    await browser.close();
  }
}

testAllAdminPages().catch(console.error); 