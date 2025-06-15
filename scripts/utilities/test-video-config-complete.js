const { chromium } = require('playwright');

async function testVideoConfigurationComplete() {
  console.log('🎯 Iniciando test completo de configuración de video...\n');
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
    // 1. LOGIN PRIMERO (como me recuerda el usuario)
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
    console.log('\n5. Navegando a página de Items...');
    await page.goto('http://localhost:3000/items');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    // 7. VERIFICAR TABLA DE ITEMS Y DURACIONES
    console.log('6. Verificando tabla de items y problema de duración...');
    
    // Buscar tabla de items
    const tableExists = await page.locator('table, [role="grid"]').count();
    if (tableExists > 0) {
      console.log('✅ Tabla de items encontrada');
      
      // Verificar duraciones en la tabla
      const durationCells = await page.locator('td:has-text("min"), td:has-text("sec"), td:has-text(":"), [data-testid*="duration"]').count();
      if (durationCells > 0) {
        console.log(`✅ Celdas de duración encontradas: ${durationCells}`);
        
        // Capturar texto de algunas duraciones para análisis
        const durations = await page.locator('td').filter({ hasText: /\d+:\d+|\d+\s*min/ }).allTextContents();
        console.log('📊 Duraciones mostradas en tabla:', durations.slice(0, 5));
      } else {
        console.log('⚠️ No se encontraron celdas de duración en la tabla');
      }
    } else {
      console.log('❌ No se encontró tabla de items');
    }

    // 8. SELECCIONAR UN VIDEO ESPECÍFICO (Video ID 39 - "Introducción a la Gamificación")
    console.log('\n7. Buscando y seleccionando video específico...');
    
    // Buscar el primer video disponible en la tabla
    const firstVideoRow = await page.locator('table tbody tr').first();
    const videoTitle = await firstVideoRow.locator('td').first().textContent();
    console.log(`📹 Seleccionando video: ${videoTitle}`);

    // Buscar botón de acción/configuración (puede ser "View", "Edit", "Config", etc.)
    const actionButtons = await firstVideoRow.locator('button, a').count();
    console.log(`🔘 Botones de acción encontrados: ${actionButtons}`);

    // Intentar hacer clic en el botón de configuración/edición
    const configButton = firstVideoRow.locator('button:has-text("View"), button:has-text("Edit"), button:has-text("Config"), a:has-text("View"), a:has-text("Edit")').first();
    
    if (await configButton.count() > 0) {
      console.log('8. Haciendo clic en botón de configuración...');
      await configButton.click();
      await page.waitForTimeout(2000);
    } else {
      // Si no hay botones, intentar hacer clic directamente en la fila
      console.log('8. Intentando clic directo en la fila del video...');
      await firstVideoRow.click();
      await page.waitForTimeout(2000);
    }

    // 9. VERIFICAR NAVEGACIÓN A CONFIGURACIÓN DEL VIDEO
    console.log('9. Verificando navegación a configuración del video...');
    const currentUrl = page.url();
    console.log(`🔗 URL actual: ${currentUrl}`);

    if (currentUrl.includes('/config') || currentUrl.includes('/edit') || currentUrl.includes('/items/')) {
      console.log('✅ Navegación a configuración exitosa');
    } else {
      console.log('⚠️ Intentando navegación manual a configuración...');
      // Intentar navegación manual a video 39
      await page.goto('http://localhost:3000/items/39/config');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(3000);
    }

    // 10. VERIFICAR ELEMENTOS DE CONFIGURACIÓN DEL VIDEO
    console.log('\n10. Verificando elementos de configuración del video...');
    
    // Capturar screenshot de la página de configuración
    await page.screenshot({ 
      path: `debug-video-config-complete-${Date.now()}.png`,
      fullPage: true 
    });

    // Verificar descripción del video
    const descriptionFields = await page.locator('textarea, input[type="text"]:has([placeholder*="descripción"], [placeholder*="description"]), [data-testid*="description"]').count();
    if (descriptionFields > 0) {
      console.log('✅ Campo de descripción encontrado');
    } else {
      console.log('⚠️ Campo de descripción no encontrado');
    }

    // Verificar sección de preguntas
    const questionsSections = await page.locator('text=Preguntas, text=Questions, [data-testid*="question"], h2:has-text("Preguntas"), h3:has-text("Questions")').count();
    if (questionsSections > 0) {
      console.log('✅ Sección de preguntas encontrada');
      
      // Buscar botón para agregar preguntas
      const addQuestionButton = await page.locator('button:has-text("Añadir"), button:has-text("Add"), button:has-text("Nueva"), button:has-text("New")').count();
      if (addQuestionButton > 0) {
        console.log('✅ Botón para agregar preguntas encontrado');
      } else {
        console.log('⚠️ Botón para agregar preguntas no encontrado');
      }
    } else {
      console.log('⚠️ Sección de preguntas no encontrada');
    }

    // Verificar sección de permisos
    const permissionsSections = await page.locator('text=Permisos, text=Permissions, [data-testid*="permission"], h2:has-text("Permisos"), h3:has-text("Permissions")').count();
    if (permissionsSections > 0) {
      console.log('✅ Sección de permisos encontrada');
    } else {
      console.log('⚠️ Sección de permisos no encontrada');
    }

    // Verificar tabs de configuración
    const tabs = await page.locator('[role="tab"], .MuiTab-root, button[role="tab"]').count();
    if (tabs > 0) {
      console.log(`✅ Tabs de configuración encontradas: ${tabs}`);
      
      // Obtener texto de los tabs
      const tabTexts = await page.locator('[role="tab"], .MuiTab-root').allTextContents();
      console.log('📑 Tabs disponibles:', tabTexts);
    } else {
      console.log('⚠️ Tabs de configuración no encontradas');
    }

    // 11. PROBAR FUNCIONALIDADES ESPECÍFICAS
    console.log('\n11. Probando funcionalidades específicas...');
    
    // Intentar interactuar con tabs si existen
    if (tabs > 0) {
      const tabElements = await page.locator('[role="tab"], .MuiTab-root').all();
      for (let i = 0; i < Math.min(tabElements.length, 4); i++) {
        try {
          const tabText = await tabElements[i].textContent();
          console.log(`📑 Haciendo clic en tab: ${tabText}`);
          await tabElements[i].click();
          await page.waitForTimeout(1500);
          
          // Capturar screenshot del tab
          await page.screenshot({ 
            path: `debug-video-tab-${i+1}-${Date.now()}.png`,
            fullPage: true 
          });
        } catch (error) {
          console.log(`⚠️ Error al hacer clic en tab ${i+1}: ${error.message}`);
        }
      }
    }

    console.log('\n🎉 Test completo de configuración de video finalizado');

  } catch (error) {
    console.error('❌ Error durante el test:', error);
    await page.screenshot({ 
      path: `debug-video-config-error-${Date.now()}.png`,
      fullPage: true 
    });
  } finally {
    await browser.close();
  }
}

testVideoConfigurationComplete().catch(console.error); 