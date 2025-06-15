const { chromium } = require('playwright');

async function testContentItemsDirectly() {
  console.log('🎯 Test directo del problema de Content Items...\n');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 1500 
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Configurar listeners para errores de red
    page.on('response', response => {
      if (!response.ok()) {
        console.log('🔴 NETWORK ERROR:', response.status(), response.url());
      }
    });

    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log('🔴 CONSOLE ERROR:', msg.text());
      }
    });

    // 1. PRIMERO: Login siguiendo protocolo @puertoyflujo
    console.log('🔒 PASO 1: Navegando a login...');
    await page.goto('http://localhost:3000/login');
    await page.waitForLoadState('networkidle');

    console.log('🔑 PASO 2: Realizando login...');
    await page.fill('input[type="email"], input[name="email"]', 'admin@gamifier.com');
    await page.fill('input[type="password"], input[name="password"]', 'admin123');
    await page.click('button[type="submit"], button:has-text("Login"), button:has-text("Iniciar")');
    
    await page.waitForLoadState('networkidle');
    console.log('✅ Login completado');

    // 2. NAVEGACIÓN DIRECTA A ITEMS
    console.log('📋 PASO 3: Navegando directamente a /items...');
    await page.goto('http://localhost:3000/items');
    await page.waitForLoadState('networkidle');

    // Tomar screenshot de la página de items
    await page.screenshot({ path: 'debug-items-page-direct.png', fullPage: true });
    console.log('📸 Screenshot guardado: debug-items-page-direct.png');

    // 3. BUSCAR ERRORES ESPECÍFICOS
    console.log('🔍 PASO 4: Buscando errores específicos...');
    
    const errorLoadingContentItems = await page.locator(':text("Error loading content items")').isVisible();
    const cannotGetError = await page.locator(':text("Cannot GET")').isVisible();
    const testRouteError = await page.locator(':text("/content/items/test")').isVisible();
    const apiCallsVisible = await page.locator('[data-testid], .error-message, .api-error').count();

    console.log('📊 Resultados del diagnóstico:');
    console.log('  - "Error loading content items":', errorLoadingContentItems);
    console.log('  - "Cannot GET" error:', cannotGetError);
    console.log('  - "/content/items/test" error:', testRouteError);
    console.log('  - Elementos de error detectados:', apiCallsVisible);

    // 4. CAPTURAR EL CONTENIDO TEXTUAL PARA ANÁLISIS
    const pageText = await page.locator('body').textContent();
    console.log('\n📄 Contenido de la página (primeros 800 caracteres):');
    console.log(pageText?.substring(0, 800) || 'No hay contenido textual');

    // 5. VERIFICAR SI HAY LLAMADAS A LA API INCORRECTA
    if (errorLoadingContentItems || cannotGetError || testRouteError) {
      console.log('\n❌ CONFIRMADO: Problema de Content Items detectado!');
      console.log('🔧 DIAGNÓSTICO: El frontend está llamando a /content/items/test');
      console.log('📡 SOLUCIÓN: Debería llamar a /video-items');
      
      // Verificar que el backend correcto funciona
      console.log('\n🔍 PASO 5: Verificando que el backend funciona...');
      const backendResponse = await page.request.get('http://localhost:3002/video-items');
      console.log('✅ Backend /video-items responde:', backendResponse.status());
      
      if (backendResponse.ok()) {
        const data = await backendResponse.json();
        console.log('📊 Backend tiene', data.length, 'video items disponibles');
        console.log('📋 Primeros items:', data.slice(0, 2).map(item => item.title));
      }

      console.log('\n🛠️  PRÓXIMOS PASOS:');
      console.log('1. Localizar el código del frontend que hace la llamada a /content/items/test');
      console.log('2. Cambiarlo para que llame a /video-items');
      console.log('3. Verificar que la respuesta sea compatible');
      
    } else {
      console.log('\n✅ No se detectaron errores específicos de content items');
      console.log('🔍 Verificando si los items se cargaron correctamente...');
      
      const videoItems = await page.locator('[data-testid*="video"], [data-testid*="item"], .video-item, .content-item').count();
      const tableRows = await page.locator('table tbody tr, .data-table tr').count();
      
      console.log('📊 Elementos de contenido detectados:');
      console.log('  - Video/Content items:', videoItems);
      console.log('  - Filas de tabla:', tableRows);
      
      if (videoItems > 0 || tableRows > 0) {
        console.log('🎉 ¡Items cargados exitosamente!');
      } else {
        console.log('⚠️  No se detectaron items cargados - posible problema de UI');
      }
    }

    console.log('\n✅ Diagnóstico completado.');

  } catch (error) {
    console.error('❌ Error durante el test:', error);
    await page.screenshot({ 
      path: `debug-content-items-error-${Date.now()}.png`,
      fullPage: true 
    });
  } finally {
    await browser.close();
  }
}

testContentItemsDirectly().catch(console.error); 