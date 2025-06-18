const { chromium } = require('playwright');

async function testMundosDetailNavigation() {
  console.log('🎯 Iniciando test de navegación a detalles de Mundos...\n');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 1000 
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();

  // Capturar errores de consola y página
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('❌ Error de consola:', msg.text());
    }
  });

  page.on('pageerror', error => {
    console.log('❌ Error de página:', error.message);
  });

  // Capturar respuestas de red para detectar errores 500
  page.on('response', response => {
    if (response.status() >= 500) {
      console.log('❌ Error 500 detectado:', response.url(), response.status());
    }
  });

  try {
    console.log('1. 🔐 Realizando login...');
    await page.goto('http://localhost:3333/login');
    await page.waitForLoadState('networkidle');

    await page.fill('input[name="email"]', 'admin@gamifier.com');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');

    // Verificar login exitoso
    await page.waitForURL('**/');
    console.log('✅ Login exitoso');

    console.log('\n2. 🌍 Navegando a la página de Mundos...');
    await page.goto('http://localhost:3333/mundos');
    await page.waitForLoadState('networkidle');
    console.log('✅ Página de Mundos cargada');

    console.log('\n3. 🔍 Probando navegación a detalle mediante clic en fila...');
    
    // Obtener información de los mundos disponibles
    const tableRows = await page.locator('table tbody tr').all();
    console.log(`📊 Encontradas ${tableRows.length} filas en la tabla`);

    if (tableRows.length > 0) {
      // Probar hacer clic en la primera fila
      console.log('🖱️ Haciendo clic en la primera fila...');
      await tableRows[0].click();
      await page.waitForTimeout(2000);
      
      const currentUrl = page.url();
      console.log('📍 URL actual después del clic:', currentUrl);
      
      // Verificar si hay navegación o si se mantiene en la misma página
      if (currentUrl.includes('/mundos') && !currentUrl.endsWith('/mundos')) {
        console.log('✅ Navegación a detalle detectada');
      } else {
        console.log('⚠️ No hay navegación a detalle (puede ser comportamiento esperado)');
      }
    }

    console.log('\n4. 🔍 Probando navegación directa a detalle por ID...');
    
    // Obtener un ID de mundo del backend
    const response = await page.evaluate(async () => {
      try {
        const res = await fetch('http://localhost:1111/content/mundos');
        const mundos = await res.json();
        return mundos.length > 0 ? mundos[0] : null;
      } catch (error) {
        return null;
      }
    });

    if (response && response.id) {
      console.log(`🆔 Probando navegación directa al mundo ID: ${response.id}`);
      
      // Probar navegación directa al detalle
      const detailUrl = `http://localhost:3333/mundos/${response.id}`;
      console.log(`🔗 Navegando a: ${detailUrl}`);
      
      await page.goto(detailUrl);
      await page.waitForTimeout(3000);
      
      const finalUrl = page.url();
      console.log('📍 URL final:', finalUrl);
      
      // Verificar si hay error 500 o página de error
      const pageContent = await page.content();
      if (pageContent.includes('500') || pageContent.includes('Internal Server Error') || pageContent.includes('Error')) {
        console.log('❌ Error 500 o página de error detectada');
        await page.screenshot({ path: `debug-500-detail-${Date.now()}.png`, fullPage: true });
      } else {
        console.log('✅ Navegación a detalle exitosa sin errores 500');
      }
    } else {
      console.log('⚠️ No se pudo obtener ID de mundo para probar navegación directa');
    }

    console.log('\n5. 🔍 Probando botón "Ver detalles"...');
    
    // Volver a la página de mundos
    await page.goto('http://localhost:3333/mundos');
    await page.waitForLoadState('networkidle');
    
    // Buscar botón de "Ver detalles" (icono de ojo)
    try {
      const viewButtons = await page.locator('button[aria-label*="Ver"], button:has(svg[data-testid="VisibilityIcon"]), button:has(svg[data-testid="ViewIcon"])').all();
      
      if (viewButtons.length > 0) {
        console.log('👁️ Encontrado botón "Ver detalles"');
        await viewButtons[0].click();
        await page.waitForTimeout(2000);
        
        const currentUrl = page.url();
        console.log('📍 URL después de clic en "Ver detalles":', currentUrl);
        
        // Verificar si hay navegación
        if (currentUrl !== 'http://localhost:3333/mundos') {
          console.log('✅ Navegación desde botón "Ver detalles" exitosa');
        } else {
          console.log('⚠️ Botón "Ver detalles" no navega (puede estar deshabilitado)');
        }
      } else {
        console.log('⚠️ Botón "Ver detalles" no encontrado');
      }
    } catch (error) {
      console.log('⚠️ Error al buscar botón "Ver detalles":', error.message);
    }

    console.log('\n6. 🧪 Probando endpoints del backend directamente...');
    
    // Probar endpoints del backend
    const backendTests = [
      'http://localhost:1111/content/mundos',
      'http://localhost:1111/content/mundos/11111111-1111-1111-1111-111111111111',
      'http://localhost:1111/mundos',
    ];

    for (const url of backendTests) {
      try {
        const response = await page.evaluate(async (testUrl) => {
          const res = await fetch(testUrl);
          return {
            status: res.status,
            ok: res.ok,
            url: testUrl
          };
        }, url);
        
        if (response.status >= 500) {
          console.log(`❌ Error ${response.status} en: ${response.url}`);
        } else {
          console.log(`✅ Endpoint OK (${response.status}): ${response.url}`);
        }
      } catch (error) {
        console.log(`❌ Error al probar ${url}:`, error.message);
      }
    }

    console.log('\n🎉 Test de navegación a detalles de Mundos completado');

  } catch (error) {
    console.error('❌ Error durante el test:', error);
    await page.screenshot({ 
      path: `debug-mundos-detail-error-${Date.now()}.png`,
      fullPage: true 
    });
  } finally {
    await browser.close();
  }
}

testMundosDetailNavigation().catch(console.error); 