const { chromium } = require('playwright');

async function testCorsFixVerification() {
  console.log('🔧 === VERIFICACIÓN DE CORRECCIÓN CORS/HEADERS ===\n');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 1000
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();

  // Capturar errores de consola y red
  const errors = [];
  const networkResponses = [];
  
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      console.log(`❌ Console Error: ${msg.text()}`);
      errors.push(`Console: ${msg.text()}`);
    } else if (msg.text().includes('[ApiService]')) {
      console.log(`📡 API: ${msg.text()}`);
    }
  });
  
  page.on('response', (response) => {
    if (response.url().includes('analytics')) {
      console.log(`📊 Analytics Response: ${response.status()} - ${response.url()}`);
      networkResponses.push({
        url: response.url(),
        status: response.status(),
        statusText: response.statusText()
      });
    }
  });

  try {
    console.log('🔐 1. Realizando login...');
    await page.goto('http://localhost:3000/login');
    await page.waitForLoadState('networkidle');
    
    // Login
    await page.fill('input[name="email"]', 'admin@gamifier.com');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');
    
    // Esperar redirección
    await page.waitForURL('**/');
    await page.waitForTimeout(2000);
    
    console.log('✅ Login completado\n');

    console.log('📊 2. Navegando a página de Analytics...');
    await page.goto('http://localhost:3000/analytics');
    await page.waitForLoadState('domcontentloaded');
    
    // Esperar a que se carguen los datos (más tiempo para ver las llamadas)
    console.log('⏳ Esperando 10 segundos para cargar datos de analytics...');
    await page.waitForTimeout(10000);
    
    console.log('\n📋 3. Análisis de resultados...');
    
    // Verificar elementos en la página
    const metricCards = await page.locator('.MuiCard-root').count();
    const loadingSpinners = await page.locator('[role="progressbar"]').count();
    const errorAlerts = await page.locator('.MuiAlert-standardError').count();
    const successData = await page.locator('text=/\\d+/').count(); // Números en la página
    
    console.log(`📊 Tarjetas métricas encontradas: ${metricCards}`);
    console.log(`⏳ Spinners de carga activos: ${loadingSpinners}`);
    console.log(`❌ Alertas de error: ${errorAlerts}`);
    console.log(`📈 Elementos con datos numéricos: ${successData}`);
    
    // Verificar específicamente las tarjetas de métricas totales
    const totalUsersCard = await page.locator('text="Total de Usuarios"').isVisible().catch(() => false);
    const totalPlaylistsCard = await page.locator('text="Total de Playlists"').isVisible().catch(() => false);
    const totalMundosCard = await page.locator('text="Total de Mundos"').isVisible().catch(() => false);
    
    console.log(`👥 Tarjeta "Total de Usuarios": ${totalUsersCard ? '✅ Visible' : '❌ No visible'}`);
    console.log(`📝 Tarjeta "Total de Playlists": ${totalPlaylistsCard ? '✅ Visible' : '❌ No visible'}`);
    console.log(`🌍 Tarjeta "Total de Mundos": ${totalMundosCard ? '✅ Visible' : '❌ No visible'}`);
    
    console.log('\n🌐 4. Análisis de respuestas de red...');
    networkResponses.forEach((response, index) => {
      const status = response.status === 200 ? '✅' : '❌';
      console.log(`${status} ${response.status} - ${response.url}`);
    });
    
    console.log('\n⚠️ 5. Errores detectados:');
    if (errors.length === 0) {
      console.log('✅ No se detectaron errores de CORS o fetch!');
    } else {
      errors.forEach((error, index) => {
        console.log(`❌ Error ${index + 1}: ${error}`);
      });
    }
    
    // Screenshot final
    await page.screenshot({ 
      path: 'debug-cors-fix-verification.png',
      fullPage: true 
    });
    
    console.log('\n🎯 6. Resultado de la verificación:');
    
    const corsErrorsFound = errors.some(error => 
      error.includes('CORS') || 
      error.includes('Failed to fetch') || 
      error.includes('blocked by CORS policy')
    );
    
    const analyticsWorking = networkResponses.some(response => response.status === 200);
    
    if (!corsErrorsFound && analyticsWorking) {
      console.log('🎉 ✅ CORRECCIÓN CORS EXITOSA - Analytics funcionando!');
    } else if (!corsErrorsFound && networkResponses.length === 0) {
      console.log('⚠️ ⚡ Sin errores CORS pero analytics no se está llamando');
    } else if (corsErrorsFound) {
      console.log('❌ 🚫 Aún hay errores CORS detectados');
    } else {
      console.log('❓ 🤔 Estado indeterminado - revisar detalles');
    }
    
    console.log('\n📸 Screenshot guardado: debug-cors-fix-verification.png');
    
  } catch (error) {
    console.error('❌ Error durante la verificación:', error.message);
    
    await page.screenshot({ 
      path: 'debug-cors-fix-error.png',
      fullPage: true 
    });
  } finally {
    await browser.close();
  }
}

testCorsFixVerification().catch(console.error); 