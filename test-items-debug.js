const { chromium } = require('playwright');

async function testItemsPageError() {
  console.log('🎯 Iniciando test de depuración de la página Items...\n');
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 1000
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();

  // Capturar errores de consola y página
  page.on('console', msg => {
    const type = msg.type();
    if (type === 'error' || type === 'warn') {
      console.log(`🔴 CONSOLE ${type.toUpperCase()}: ${msg.text()}`);
    } else {
      console.log(`📋 CONSOLE ${type}: ${msg.text()}`);
    }
  });

  page.on('pageerror', error => {
    console.error('❌ PAGE ERROR:', error.message);
  });

  page.on('requestfailed', request => {
    console.error('❌ REQUEST FAILED:', request.url(), request.failure().errorText);
  });

  try {
    // 1. LOGIN
    console.log('1. Navegando a login...');
    await page.goto('http://localhost:3000/login');
    await page.waitForLoadState('networkidle');

    console.log('2. Llenando credenciales...');
    await page.fill('input[name="email"]', 'admin@gamifier.com');
    await page.fill('input[name="password"]', 'admin123');
    
    console.log('3. Haciendo clic en submit...');
    await page.click('button[type="submit"]');
    
    console.log('4. Esperando redirección...');
    await page.waitForURL('**/');

    // 5. VERIFICAR LOGIN EXITOSO
    try {
      await page.waitForSelector('nav, [role="navigation"], button[aria-label*="menu"]', { timeout: 5000 });
      console.log('✅ Login exitoso - Navegación detectada');
    } catch {
      const currentUrl = page.url();
      if (!currentUrl.includes('/login')) {
        console.log('✅ Login exitoso - Verificado por URL');
      } else {
        throw new Error('Login falló - Aún en página de login');
      }
    }

    // 6. NAVEGAR A ITEMS PAGE
    console.log('5. Navegando a página de Items...');
    await page.goto('http://localhost:3000/items');
    await page.waitForLoadState('networkidle');

    // 7. VERIFICAR SI HAY ERRORES
    console.log('6. Verificando contenido de la página...');
    
    // Esperar un momento para que la página cargue
    await page.waitForTimeout(3000);
    
    // Capturar screenshot para análisis
    await page.screenshot({ 
      path: `debug-items-error-${Date.now()}.png`,
      fullPage: true 
    });

    // Buscar indicadores de error
    const errorElements = await page.locator('text=Error, text=500, text=Internal Server Error').count();
    if (errorElements > 0) {
      console.log('❌ Se detectaron elementos de error en la página');
    } else {
      console.log('✅ No se detectaron elementos de error visibles');
    }

    // Verificar si la tabla de items está presente
    const tableExists = await page.locator('table, [role="grid"]').count();
    if (tableExists > 0) {
      console.log('✅ Tabla de items detectada');
    } else {
      console.log('❌ No se encontró tabla de items');
    }

    console.log('\n🎉 Test de depuración completado');

  } catch (error) {
    console.error('❌ Error durante el test:', error);
    await page.screenshot({ 
      path: `debug-items-error-${Date.now()}.png`,
      fullPage: true 
    });
  } finally {
    await browser.close();
  }
}

testItemsPageError().catch(console.error); 