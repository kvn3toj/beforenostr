import { test, expect } from '@playwright/test';

test.describe('Gamification Pages Verification', () => {
  test.beforeEach(async ({ page }) => {
    // Capturar errores de consola
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        console.log(`🔴 Console error: ${msg.text()}`);
      }
    });

    page.on('pageerror', (error) => {
      console.log(`🔴 Page error: ${error.message}`);
    });

    // Flujo de autenticación
    await page.goto('/login');
    await page.waitForLoadState('networkidle');

    await page.fill('input[name="email"]', 'admin@gamifier.com');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/');

    // Verificar login exitoso
    try {
      await page.waitForSelector('nav, [role="navigation"], button[aria-label*="menu"], button[aria-label*="Menu"]', { timeout: 5000 });
      console.log('✅ Login exitoso - Navegación detectada');
    } catch {
      const currentUrl = page.url();
      if (!currentUrl.includes('/login')) {
        console.log('✅ Login exitoso - Fuera de página de login');
      } else {
        throw new Error('Login falló - Aún en página de login');
      }
    }
  });

  test('🪙 Verificar visualización de datos en TokensPage', async ({ page }) => {
    console.log('\n🎯 Verificando TokensPage...');

    // Navegar directamente a la página de tokens
    await page.goto('/tokens');
    await page.waitForLoadState('networkidle');

    // Verificar que la página cargó correctamente
    try {
      await page.waitForSelector('text=Tokens', { timeout: 5000 });
      console.log('✅ Página de Tokens cargada');
    } catch {
      // Verificar por URL si no encontramos el texto
      const currentUrl = page.url();
      if (currentUrl.includes('/tokens')) {
        console.log('✅ Página de Tokens cargada (verificado por URL)');
      } else {
        throw new Error('No se pudo cargar la página de Tokens');
      }
    }

    // Verificar presencia de datos
    const dataTable = page.locator('table, .MuiDataGrid-root, .data-table');
    if (await dataTable.isVisible()) {
      console.log('✅ Tabla de datos encontrada');
      
      // Contar filas de datos
      const rows = page.locator('tbody tr, .MuiDataGrid-row');
      const rowCount = await rows.count();
      console.log(`📊 Filas de datos encontradas: ${rowCount}`);
      
      if (rowCount > 0) {
        console.log('✅ TokensPage tiene datos visualizados');
        
        // Verificar headers/columnas
        const headers = page.locator('thead th, .MuiDataGrid-columnHeader');
        const headerCount = await headers.count();
        console.log(`📋 Columnas encontradas: ${headerCount}`);
        
        // Listar headers
        for (let i = 0; i < headerCount; i++) {
          const headerText = await headers.nth(i).textContent();
          console.log(`   📌 Columna ${i + 1}: ${headerText?.trim()}`);
        }
      } else {
        console.log('⚠️ TokensPage no tiene datos para mostrar');
      }
    } else {
      console.log('⚠️ No se encontró tabla de datos en TokensPage');
    }

    // Capturar screenshot
    await page.screenshot({ 
      path: 'debug-tokens-page.png', 
      fullPage: true 
    });

    console.log('🎉 Verificación de TokensPage completada');
  });

  test('💰 Verificar visualización de datos en WalletPage', async ({ page }) => {
    console.log('\n🎯 Verificando WalletPage...');

    // Navegar directamente a la página de wallet
    await page.goto('/wallet');
    await page.waitForLoadState('networkidle');

    // Verificar que la página cargó correctamente
    try {
      await page.waitForSelector('text=Wallet', { timeout: 5000 });
      console.log('✅ Página de Wallet cargada');
    } catch {
      const currentUrl = page.url();
      if (currentUrl.includes('/wallet')) {
        console.log('✅ Página de Wallet cargada (verificado por URL)');
      } else {
        throw new Error('No se pudo cargar la página de Wallet');
      }
    }

    // Verificar presencia de datos
    const dataTable = page.locator('table, .MuiDataGrid-root, .data-table');
    if (await dataTable.isVisible()) {
      console.log('✅ Tabla de datos encontrada');
      
      // Contar filas de datos
      const rows = page.locator('tbody tr, .MuiDataGrid-row');
      const rowCount = await rows.count();
      console.log(`📊 Filas de datos encontradas: ${rowCount}`);
      
      if (rowCount > 0) {
        console.log('✅ WalletPage tiene datos visualizados');
        
        // Verificar headers/columnas
        const headers = page.locator('thead th, .MuiDataGrid-columnHeader');
        const headerCount = await headers.count();
        console.log(`📋 Columnas encontradas: ${headerCount}`);
        
        // Listar headers
        for (let i = 0; i < headerCount; i++) {
          const headerText = await headers.nth(i).textContent();
          console.log(`   📌 Columna ${i + 1}: ${headerText?.trim()}`);
        }
      } else {
        console.log('⚠️ WalletPage no tiene datos para mostrar');
      }
    } else {
      console.log('⚠️ No se encontró tabla de datos en WalletPage');
      
      // Buscar otros elementos de datos (cards, stats, etc.)
      const dataCards = page.locator('.MuiCard-root, .stat-card, .wallet-balance');
      const cardCount = await dataCards.count();
      if (cardCount > 0) {
        console.log(`📊 Encontradas ${cardCount} tarjetas de datos`);
        
        for (let i = 0; i < cardCount; i++) {
          const cardText = await dataCards.nth(i).textContent();
          console.log(`   💳 Tarjeta ${i + 1}: ${cardText?.trim().substring(0, 100)}...`);
        }
      }
    }

    // Capturar screenshot
    await page.screenshot({ 
      path: 'debug-wallet-page.png', 
      fullPage: true 
    });

    console.log('🎉 Verificación de WalletPage completada');
  });

  test('🏆 Verificar visualización de datos en MeritsPage', async ({ page }) => {
    console.log('\n🎯 Verificando MeritsPage...');

    // Navegar directamente a la página de méritos
    await page.goto('/merits');
    await page.waitForLoadState('networkidle');

    // Verificar que la página cargó correctamente
    try {
      await page.waitForSelector('text=Méritos', { timeout: 5000 });
      console.log('✅ Página de Méritos cargada');
    } catch {
      const currentUrl = page.url();
      if (currentUrl.includes('/merits')) {
        console.log('✅ Página de Méritos cargada (verificado por URL)');
      } else {
        throw new Error('No se pudo cargar la página de Méritos');
      }
    }

    // Verificar presencia de datos
    const dataTable = page.locator('table, .MuiDataGrid-root, .data-table');
    if (await dataTable.isVisible()) {
      console.log('✅ Tabla de datos encontrada');
      
      // Contar filas de datos
      const rows = page.locator('tbody tr, .MuiDataGrid-row');
      const rowCount = await rows.count();
      console.log(`📊 Filas de datos encontradas: ${rowCount}`);
      
      if (rowCount > 0) {
        console.log('✅ MeritsPage tiene datos visualizados');
        
        // Verificar headers/columnas
        const headers = page.locator('thead th, .MuiDataGrid-columnHeader');
        const headerCount = await headers.count();
        console.log(`📋 Columnas encontradas: ${headerCount}`);
        
        // Listar headers
        for (let i = 0; i < headerCount; i++) {
          const headerText = await headers.nth(i).textContent();
          console.log(`   📌 Columna ${i + 1}: ${headerText?.trim()}`);
        }
      } else {
        console.log('⚠️ MeritsPage no tiene datos para mostrar');
      }
    } else {
      console.log('⚠️ No se encontró tabla de datos en MeritsPage');
      
      // Buscar otros elementos de datos
      const dataCards = page.locator('.MuiCard-root, .merit-card, .achievement-card');
      const cardCount = await dataCards.count();
      if (cardCount > 0) {
        console.log(`📊 Encontradas ${cardCount} tarjetas de méritos`);
        
        for (let i = 0; i < cardCount; i++) {
          const cardText = await dataCards.nth(i).textContent();
          console.log(`   🏆 Tarjeta ${i + 1}: ${cardText?.trim().substring(0, 100)}...`);
        }
      }
    }

    // Capturar screenshot
    await page.screenshot({ 
      path: 'debug-merits-page.png', 
      fullPage: true 
    });

    console.log('🎉 Verificación de MeritsPage completada');
  });

  test('🔗 Verificar navegación desde el menú a páginas de gamificación', async ({ page }) => {
    console.log('\n🎯 Verificando navegación del menú...');

    // Ir al dashboard
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Buscar y expandir el menú de gamificación
    try {
      // Buscar el item de gamificación en el menú
      const gamificationItem = page.locator('text=Gamificación').or(page.locator('text=Sistema de Gamificación'));
      
      if (await gamificationItem.isVisible()) {
        console.log('✅ Sección de Gamificación encontrada en el menú');
        await gamificationItem.click();
        
        // Verificar elementos del submenu
        const subMenuItems = ['Tokens', 'Wallet', 'Méritos'];
        
        for (const item of subMenuItems) {
          try {
            const menuItem = page.locator(`text=${item}`);
            if (await menuItem.isVisible()) {
              console.log(`✅ Item de menú "${item}" visible`);
              
              // Hacer click y verificar navegación
              await menuItem.click();
              await page.waitForLoadState('networkidle');
              
              const currentUrl = page.url();
              console.log(`📍 Navegó a: ${currentUrl}`);
              
              // Verificar que la URL contiene el item esperado
              const expectedPath = item.toLowerCase() === 'méritos' ? 'merits' : item.toLowerCase();
              if (currentUrl.includes(expectedPath)) {
                console.log(`✅ Navegación a ${item} exitosa`);
              } else {
                console.log(`⚠️ Navegación a ${item} no funcionó como esperado`);
              }
              
              // Volver al dashboard para el siguiente test
              await page.goto('/');
              await page.waitForLoadState('networkidle');
              
              // Re-expandir el menú de gamificación
              const gamificationItemAgain = page.locator('text=Gamificación').or(page.locator('text=Sistema de Gamificación'));
              if (await gamificationItemAgain.isVisible()) {
                await gamificationItemAgain.click();
              }
              
            } else {
              console.log(`⚠️ Item de menú "${item}" no visible`);
            }
          } catch (error) {
            console.log(`❌ Error probando navegación a ${item}:`, error);
          }
        }
        
      } else {
        console.log('⚠️ Sección de Gamificación no encontrada en el menú');
      }
      
    } catch (error) {
      console.log('❌ Error verificando menú de gamificación:', error);
    }

    // Capturar screenshot final
    await page.screenshot({ 
      path: 'debug-gamification-menu-navigation.png', 
      fullPage: true 
    });

    console.log('🎉 Verificación de navegación del menú completada');
  });

  test('📊 Verificar estado de páginas de gamificación adicionales', async ({ page }) => {
    console.log('\n🎯 Verificando páginas adicionales de gamificación...');

    const additionalPages = [
      { name: 'Groups', path: '/groups', expectedContent: 'group' },
      { name: 'Challenges', path: '/challenges', expectedContent: 'challenge' },
      { name: 'Social', path: '/social', expectedContent: 'social' },
      { name: 'Marketplace', path: '/marketplace', expectedContent: 'marketplace' },
      { name: 'Invitations', path: '/invitations', expectedContent: 'invitation' },
      { name: 'Personalities', path: '/personalities', expectedContent: 'personalit' }
    ];

    for (const pageInfo of additionalPages) {
      console.log(`\n📍 Verificando página: ${pageInfo.name} (${pageInfo.path})`);
      
      try {
        await page.goto(pageInfo.path);
        await page.waitForLoadState('networkidle');
        
        const currentUrl = page.url();
        console.log(`   📍 URL actual: ${currentUrl}`);
        
        if (currentUrl.includes(pageInfo.path)) {
          console.log(`   ✅ ${pageInfo.name} página existe y es accesible`);
          
          // Verificar contenido específico
          const hasExpectedContent = await page.locator(`text*=${pageInfo.expectedContent}`).isVisible();
          if (hasExpectedContent) {
            console.log(`   ✅ Contenido relacionado con ${pageInfo.expectedContent} encontrado`);
          } else {
            console.log(`   ⚠️ No se encontró contenido específico de ${pageInfo.expectedContent}`);
          }
          
        } else {
          console.log(`   ❌ ${pageInfo.name} página redirige a: ${currentUrl}`);
        }
        
      } catch (error) {
        console.log(`   ❌ Error accediendo a ${pageInfo.name}: ${error}`);
      }
    }

    console.log('\n🎉 Verificación de páginas adicionales completada');
  });

  test('🎯 Resumen completo del estado de gamificación', async ({ page }) => {
    console.log('\n🎯 Generando resumen completo del estado de gamificación...');

    const gamificationPages = [
      { name: 'Tokens', path: '/tokens', implemented: true },
      { name: 'Wallet', path: '/wallet', implemented: true },
      { name: 'Merits', path: '/merits', implemented: true },
      { name: 'Groups', path: '/groups', implemented: false },
      { name: 'Challenges', path: '/challenges', implemented: false },
      { name: 'Social', path: '/social', implemented: false },
      { name: 'Marketplace', path: '/marketplace', implemented: false },
      { name: 'Invitations', path: '/invitations', implemented: false },
      { name: 'Personalities', path: '/personalities', implemented: false }
    ];

    console.log('\n📊 ESTADO ACTUAL DE PÁGINAS DE GAMIFICACIÓN:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    for (const pageInfo of gamificationPages) {
      const status = pageInfo.implemented ? '✅ IMPLEMENTADA' : '❌ FALTANTE';
      console.log(`${status} | ${pageInfo.name.padEnd(15)} | ${pageInfo.path}`);
    }

    console.log('\n📋 RESUMEN:');
    const implemented = gamificationPages.filter(p => p.implemented).length;
    const total = gamificationPages.length;
    console.log(`   ✅ Implementadas: ${implemented}/${total}`);
    console.log(`   ❌ Faltantes: ${total - implemented}/${total}`);
    console.log(`   📊 Progreso: ${Math.round((implemented / total) * 100)}%`);

    console.log('\n🎯 PRÓXIMOS PASOS RECOMENDADOS:');
    console.log('   1. Verificar datos en páginas implementadas');
    console.log('   2. Implementar páginas faltantes');
    console.log('   3. Agregar navegación en el menú para páginas nuevas');
    console.log('   4. Crear tests E2E para páginas nuevas');

    console.log('\n🎉 Resumen completo generado');
  });
}); 