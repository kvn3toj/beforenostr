const { chromium } = require('playwright');

async function testVideoQuestionsFunctionality() {
  console.log('🎯 Test específico de funcionalidad de preguntas en video...\n');
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 1500
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();

  // Capturar errores y eventos
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
    console.log('1. Realizando login...');
    await page.goto('http://localhost:3000/login');
    await page.waitForLoadState('networkidle');
    await page.fill('input[name="email"]', 'admin@gamifier.com');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/');
    
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

    // 2. NAVEGAR DIRECTAMENTE AL VIDEO 39 CONFIG
    console.log('\n2. Navegando directamente a configuración del video 39...');
    await page.goto('http://localhost:3000/items/39/config');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    console.log('3. Verificando carga de la página de configuración...');
    const currentUrl = page.url();
    console.log(`🔗 URL actual: ${currentUrl}`);

    // 3. VERIFICAR INFORMACIÓN DEL VIDEO
    console.log('\n4. Verificando información del video...');
    
    // Buscar título del video
    const videoTitle = await page.locator('h1, h2, [data-testid*="title"]').first().textContent();
    if (videoTitle) {
      console.log(`📹 Título del video: ${videoTitle}`);
    }

    // 4. VERIFICAR Y PROBAR TABS
    console.log('\n5. Verificando tabs de configuración...');
    const tabs = await page.locator('[role="tab"], .MuiTab-root').count();
    console.log(`📑 Tabs encontradas: ${tabs}`);

    if (tabs > 0) {
      const tabTexts = await page.locator('[role="tab"], .MuiTab-root').allTextContents();
      console.log('📑 Tabs disponibles:', tabTexts);

      // Buscar y hacer clic en el tab de Questions
      const questionsTab = page.locator('[role="tab"]:has-text("Questions"), .MuiTab-root:has-text("Questions")');
      if (await questionsTab.count() > 0) {
        console.log('\n6. Haciendo clic en tab Questions...');
        await questionsTab.click();
        await page.waitForTimeout(2000);

        // Capturar screenshot del tab de preguntas
        await page.screenshot({ 
          path: `debug-questions-tab-${Date.now()}.png`,
          fullPage: true 
        });

        // 5. VERIFICAR CONTENIDO DEL TAB DE PREGUNTAS
        console.log('7. Verificando contenido del tab de preguntas...');
        
        // Buscar preguntas existentes
        const existingQuestions = await page.locator('[data-testid*="question"], .question-item, li:has-text("¿")').count();
        console.log(`❓ Preguntas existentes encontradas: ${existingQuestions}`);

        // Buscar botón para agregar nueva pregunta
        const addQuestionButton = await page.locator('button:has-text("Añadir"), button:has-text("Add"), button:has-text("Nueva"), button:has-text("New"), button[data-testid*="add-question"]').first();
        
        if (await addQuestionButton.count() > 0) {
          console.log('✅ Botón para agregar pregunta encontrado');
          
          // 6. INTENTAR AGREGAR UNA NUEVA PREGUNTA
          console.log('\n8. Intentando agregar nueva pregunta...');
          await addQuestionButton.click();
          await page.waitForTimeout(2000);

          // Verificar si se abrió modal/formulario
          const modal = await page.locator('[role="dialog"], .MuiDialog-root, .modal').count();
          if (modal > 0) {
            console.log('✅ Modal de nueva pregunta abierto');
            
            // Buscar campos del formulario
            const questionTextField = page.locator('textarea[placeholder*="pregunta"], input[placeholder*="question"], textarea[name*="text"], input[name*="text"]').first();
            const timestampField = page.locator('input[placeholder*="timestamp"], input[name*="timestamp"], input[type="number"]').first();

            if (await questionTextField.count() > 0) {
              console.log('✅ Campo de texto de pregunta encontrado');
              await questionTextField.fill('¿Cuál es el elemento más importante de la gamificación educativa?');
              await page.waitForTimeout(1000);
            }

            if (await timestampField.count() > 0) {
              console.log('✅ Campo de timestamp encontrado');
              await timestampField.fill('180'); // 3 minutos
              await page.waitForTimeout(1000);
            }

            // Buscar botón de guardar
            const saveButton = page.locator('button:has-text("Guardar"), button:has-text("Save"), button[type="submit"]').first();
            if (await saveButton.count() > 0) {
              console.log('✅ Botón de guardar encontrado');
              console.log('9. Guardando nueva pregunta...');
              await saveButton.click();
              await page.waitForTimeout(3000);
            }

            // Capturar screenshot después de intentar guardar
            await page.screenshot({ 
              path: `debug-after-add-question-${Date.now()}.png`,
              fullPage: true 
            });

          } else {
            console.log('⚠️ No se detectó modal, puede que se haya abierto formulario inline');
            
            // Buscar campos inline
            const inlineFields = await page.locator('input, textarea').count();
            console.log(`📝 Campos de formulario detectados: ${inlineFields}`);
          }

        } else {
          console.log('⚠️ Botón para agregar pregunta no encontrado');
        }

      } else {
        console.log('⚠️ Tab Questions no encontrado');
      }

      // 7. PROBAR TAB DE PERMISOS
      console.log('\n10. Probando tab de Permisos...');
      const permissionsTab = page.locator('[role="tab"]:has-text("Permisos"), .MuiTab-root:has-text("Permisos")');
      if (await permissionsTab.count() > 0) {
        await permissionsTab.click();
        await page.waitForTimeout(2000);
        
        // Verificar contenido de permisos
        const permissionElements = await page.locator('input[type="checkbox"], [role="checkbox"], .permission-item').count();
        console.log(`🔒 Elementos de permisos encontrados: ${permissionElements}`);

        // Capturar screenshot del tab de permisos
        await page.screenshot({ 
          path: `debug-permissions-tab-${Date.now()}.png`,
          fullPage: true 
        });
      }
    }

    console.log('\n🎉 Test de funcionalidad de preguntas completado');

  } catch (error) {
    console.error('❌ Error durante el test:', error);
    await page.screenshot({ 
      path: `debug-questions-error-${Date.now()}.png`,
      fullPage: true 
    });
  } finally {
    await browser.close();
  }
}

testVideoQuestionsFunctionality().catch(console.error); 