const { chromium } = require('playwright');

async function testAnalyticsPageFix() {
  console.log('🎯 Iniciando test de la página Analytics después de las correcciones...\n');
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

    // 6. NAVEGAR A ANALYTICS PAGE
    console.log('5. Navegando a página de Analytics...');
    await page.goto('http://localhost:3000/analytics');
    
    // Esperar más tiempo para que carguen todas las queries
    console.log('6. Esperando que carguen los datos de analytics...');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(10000); // Esperar 10 segundos para que carguen todas las queries

    // 7. VERIFICAR SI HAY ERRORES
    console.log('7. Verificando contenido de la página...');
    
    // Capturar screenshot para análisis
    await page.screenshot({ 
      path: `debug-analytics-fixed-${Date.now()}.png`,
      fullPage: true 
    });

    // Buscar indicadores de error
    const errorElements = await page.locator('text=Error, text=500, text=Internal Server Error, text=404').count();
    if (errorElements > 0) {
      console.log('❌ Se detectaron elementos de error en la página');
    } else {
      console.log('✅ No se detectaron elementos de error visibles');
    }

    // Verificar si hay gráficos/contenido de analytics
    const chartsExists = await page.locator('svg, canvas, .recharts-wrapper').count();
    if (chartsExists > 0) {
      console.log(`✅ Gráficos de analytics detectados: ${chartsExists}`);
    } else {
      console.log('⚠️ No se encontraron gráficos de analytics');
    }

    // Verificar si hay métricas
    const metricsExists = await page.locator('[data-testid*="metric"], .metric-card, h4').count();
    if (metricsExists > 0) {
      console.log(`✅ Métricas detectadas: ${metricsExists}`);
    } else {
      console.log('⚠️ No se encontraron métricas');
    }

    console.log('\n🎉 Test de Analytics completado');

  } catch (error) {
    console.error('❌ Error durante el test:', error);
    await page.screenshot({ 
      path: `debug-analytics-error-${Date.now()}.png`,
      fullPage: true 
    });
  } finally {
    await browser.close();
  }
}

testAnalyticsPageFix().catch(console.error); 