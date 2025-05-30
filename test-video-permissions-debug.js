const { chromium } = require('playwright');

async function testVideoPermissionsDebug() {
  console.log('🎯 Iniciando debug de Video Permissions...\n');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 1000 
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();

  // Capturar errores de consola
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('❌ Console Error:', msg.text());
    }
  });

  page.on('pageerror', error => {
    console.log('❌ Page Error:', error.message);
  });

  try {
    // 1. LOGIN
    console.log('🔐 Paso 1: Realizando login...');
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

    // 2. NAVEGAR A ITEMS
    console.log('\n📋 Paso 2: Navegando a Items...');
    await page.click('text=Items');
    await page.waitForTimeout(2000);

    // Verificar que estamos en la página de items
    try {
      await page.waitForSelector('text=Items', { timeout: 5000 });
      console.log('✅ Página de Items cargada');
    } catch {
      const currentUrl = page.url();
      if (currentUrl.includes('/items')) {
        console.log('✅ Página de Items cargada (verificado por URL)');
      } else {
        throw new Error('No se pudo cargar la página de Items');
      }
    }

    // 3. HACER CLIC EN EL BOTÓN DE EDITAR DEL PRIMER VIDEO
    console.log('\n🎬 Paso 3: Seleccionando primer video...');
    
    const videoRows = await page.locator('table tbody tr').count();
    console.log(`📊 Encontrados ${videoRows} videos en la tabla`);

    if (videoRows === 0) {
      throw new Error('No se encontraron videos en la tabla');
    }

    // Obtener información del primer video antes de hacer clic
    const firstRowData = await page.locator('table tbody tr:first-child').textContent();
    console.log('📝 Datos del primer video:', firstRowData);

    // Hacer clic en el botón de editar del primer video
    const editButton = page.locator('table tbody tr:first-child button[title*="Edit"], table tbody tr:first-child button[aria-label*="Edit"]').first();
    await editButton.click();
    await page.waitForTimeout(2000);

    // Capturar la URL actual para ver el ID
    const currentUrl = page.url();
    console.log('🔗 URL actual:', currentUrl);
    
    // Extraer el ID de la URL
    const urlMatch = currentUrl.match(/\/items\/(\d+)\/config/);
    if (urlMatch) {
      const videoId = urlMatch[1];
      console.log('🆔 Video ID extraído:', videoId);
      
      // Verificar si es un número válido
      const parsedId = parseInt(videoId);
      console.log('🔢 Video ID parseado:', parsedId);
      console.log('✅ Es número válido:', !isNaN(parsedId));
    } else {
      console.log('⚠️ No se pudo extraer el ID de la URL');
    }

    // 4. NAVEGAR A LA PESTAÑA DE PERMISOS
    console.log('\n🔐 Paso 4: Navegando a la pestaña de Permisos...');
    
    try {
      await page.click('button:has-text("Permisos"), [role="tab"]:has-text("Permisos")');
      await page.waitForTimeout(2000);
      console.log('✅ Pestaña de Permisos seleccionada');
    } catch {
      console.log('⚠️ No se encontró pestaña "Permisos", buscando alternativas...');
      
      const permissionsTab = await page.locator('text*=Permiso').first();
      if (await permissionsTab.isVisible()) {
        await permissionsTab.click();
        await page.waitForTimeout(2000);
        console.log('✅ Pestaña de Permisos encontrada y seleccionada');
      } else {
        throw new Error('No se pudo encontrar la pestaña de Permisos');
      }
    }

    // 5. VERIFICAR ERRORES EN LA PESTAÑA DE PERMISOS
    console.log('\n🔍 Paso 5: Verificando errores en Permisos...');
    
    // Buscar mensajes de error (arreglar selector CSS)
    const errorMessages = await page.locator('[role="alert"], .MuiAlert-root').allTextContents();
    const errorTexts = await page.locator('text=Error').allTextContents();
    
    const allErrors = [...errorMessages, ...errorTexts];
    if (allErrors.length > 0) {
      console.log('❌ Errores encontrados:');
      allErrors.forEach((msg, index) => {
        console.log(`   ${index + 1}. ${msg}`);
      });
    } else {
      console.log('✅ No se encontraron errores visibles');
    }

    // 6. VERIFICAR QUE EL COMPONENTE SE CARGA CORRECTAMENTE
    console.log('\n📋 Paso 6: Verificando que el componente de permisos se carga...');
    
    // Buscar elementos que indiquen que el componente se cargó
    const permissionsElements = [
      'text=Configuración de Permisos',
      'text=Permisos de Video',
      'text=Derechos de visualización',
      'text=Guardar',
      'text=Publicar',
      '[role="switch"]', // Switches de permisos
      'button:has-text("Guardar")',
      'button:has-text("Publicar")'
    ];

    let componentLoaded = false;
    for (const selector of permissionsElements) {
      const elements = await page.locator(selector).count();
      if (elements > 0) {
        console.log(`✅ Componente cargado - Encontrado: ${selector}`);
        componentLoaded = true;
        break;
      }
    }

    if (!componentLoaded) {
      console.log('⚠️ No se encontraron elementos del componente de permisos');
      // Capturar screenshot para debug
      await page.screenshot({ 
        path: `debug-permissions-component-${Date.now()}.png`,
        fullPage: true 
      });
    }

    // Verificar requests de red
    console.log('\n🌐 Paso 7: Monitoreando requests de red...');
    
    page.on('response', response => {
      if (response.url().includes('video-permissions')) {
        console.log(`📡 Request: ${response.request().method()} ${response.url()}`);
        console.log(`📊 Status: ${response.status()}`);
      }
    });

    // Esperar un poco para ver si hay requests
    await page.waitForTimeout(3000);

    console.log('\n🎉 Debug completado');

  } catch (error) {
    console.error('❌ Error durante el debug:', error);
    await page.screenshot({ 
      path: `debug-video-permissions-error-${Date.now()}.png`,
      fullPage: true 
    });
  } finally {
    await browser.close();
  }
}

testVideoPermissionsDebug().catch(console.error); 