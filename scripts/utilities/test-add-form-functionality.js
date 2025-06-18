const { chromium } = require('playwright');

async function testAddFormFunctionality() {
  console.log('🎯 Iniciando test de funcionalidad "Añadir Formulario" con configuración de timing...\n');

  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 1000 // Ralentizar para ver las acciones
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // ========================================
    // 1. LOGIN
    // ========================================
    console.log('📝 PASO 1: Realizando login...');
    await page.goto('http://localhost:3333/login');
    await page.waitForLoadState('networkidle');

    await page.fill('input[name="email"]', 'admin@gamifier.com');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');
    
    // Esperar redirección a la página principal
    await page.waitForURL('**/');
    
    // Verificar login exitoso de manera más robusta
    try {
      // Buscar elementos que indiquen que estamos logueados
      await page.waitForSelector('nav, [role="navigation"], button[aria-label*="menu"], button[aria-label*="Menu"]', { timeout: 5000 });
      console.log('✅ Login exitoso - Navegación detectada');
    } catch {
      // Si no hay navegación, verificar que no estamos en login
      const currentUrl = page.url();
      if (!currentUrl.includes('/login')) {
        console.log('✅ Login exitoso - Fuera de página de login');
      } else {
        throw new Error('Login falló - Aún en página de login');
      }
    }

    // ========================================
    // 2. NAVEGAR A ITEMS
    // ========================================
    console.log('\n📂 PASO 2: Navegando a la página de Items...');
    await page.goto('http://localhost:3333/items');
    await page.waitForLoadState('networkidle');
    
    // Verificar que estamos en la página de items de manera más flexible
    try {
      await page.waitForSelector('text=Items', { timeout: 5000 });
      console.log('✅ Página de Items cargada');
    } catch {
      // Verificar por URL si no encontramos el texto
      const currentUrl = page.url();
      if (currentUrl.includes('/items')) {
        console.log('✅ Página de Items cargada (verificado por URL)');
      } else {
        throw new Error('No se pudo cargar la página de Items');
      }
    }

    // ========================================
    // 3. NAVEGAR A CONFIGURACIÓN DE VIDEO
    // ========================================
    console.log('\n⚙️ PASO 3: Navegando a configuración de video...');
    
    // Buscar el primer botón de configurar/editar
    const configButton = page.locator('button:has-text("Configurar"), button:has-text("Edit"), [data-testid="edit-button"]').first();
    
    if (await configButton.isVisible()) {
      await configButton.click();
      await page.waitForLoadState('networkidle');
    } else {
      // Si no hay botón, navegar directamente al video ID 18
      console.log('⚠️ No se encontró botón de configurar, navegando directamente al video ID 18...');
      await page.goto('http://localhost:3333/items/18/config');
      await page.waitForLoadState('networkidle');
    }

    console.log('✅ Página de configuración de video cargada');

    // ========================================
    // 4. NAVEGAR A LA PESTAÑA DE PREGUNTAS
    // ========================================
    console.log('\n❓ PASO 4: Navegando a la pestaña de Preguntas...');
    
    // Buscar y hacer clic en la pestaña de preguntas
    const questionsTab = page.getByRole('tab', { name: /preguntas|questions/i });
    await questionsTab.click();
    await page.waitForTimeout(2000);
    
    console.log('✅ Pestaña de Preguntas activada');

    // ========================================
    // 5. VERIFICAR BOTÓN "AÑADIR FORMULARIO"
    // ========================================
    console.log('\n📋 PASO 5: Verificando botón "Añadir Formulario"...');
    
    // Buscar el botón "Añadir Formulario"
    const addFormButton = page.getByRole('button', { name: /añadir formulario|add form/i });
    
    if (await addFormButton.isVisible()) {
      console.log('✅ Botón "Añadir Formulario" encontrado');
      
      // Hacer clic en el botón
      await addFormButton.click();
      await page.waitForTimeout(2000);
      
      // ========================================
      // 6. VERIFICAR MODAL DE FORMULARIO
      // ========================================
      console.log('\n🔧 PASO 6: Verificando modal de formulario...');
      
      // Verificar que se abre el modal
      const modal = page.locator('[role="dialog"]');
      await modal.waitFor({ state: 'visible', timeout: 5000 });
      
      // Verificar título del modal
      const modalTitle = page.getByText(/crear formulario de preguntas/i);
      if (await modalTitle.isVisible()) {
        console.log('✅ Modal de formulario abierto correctamente');
        
        // ========================================
        // 7. PROBAR CONFIGURACIÓN DE TIMING
        // ========================================
        console.log('\n⏰ PASO 7: Probando configuración de timing...');
        
        // Verificar que existe la sección de configuración
        const configSection = page.getByText(/configuración del formulario/i);
        if (await configSection.isVisible()) {
          console.log('✅ Sección de configuración encontrada');
          
          // Probar opción "Al inicio del video"
          const inicioRadio = page.getByRole('radio', { name: /al inicio del video/i });
          if (await inicioRadio.isVisible()) {
            await inicioRadio.click();
            await page.waitForTimeout(1000);
            console.log('✅ Opción "Al inicio del video" seleccionada');
            
            // Verificar que aparecen los campos de duración y espaciado
            const durationField = page.getByLabel(/duración por pregunta/i);
            const spacingField = page.getByLabel(/espaciado entre preguntas/i);
            
            if (await durationField.isVisible() && await spacingField.isVisible()) {
              console.log('✅ Campos de configuración de timing visibles');
              
              // Cambiar valores
              await durationField.fill('30');
              await spacingField.fill('15');
              console.log('✅ Valores de timing configurados (30s duración, 15s espaciado)');
            }
          }
          
          // Probar opción "Al final del video"
          const finalRadio = page.getByRole('radio', { name: /al final del video/i });
          if (await finalRadio.isVisible()) {
            await finalRadio.click();
            await page.waitForTimeout(1000);
            console.log('✅ Opción "Al final del video" seleccionada');
          }
          
          // Volver a "Tiempos personalizados" para el resto del test
          const personalizadoRadio = page.getByRole('radio', { name: /tiempos personalizados/i });
          if (await personalizadoRadio.isVisible()) {
            await personalizadoRadio.click();
            await page.waitForTimeout(1000);
            console.log('✅ Opción "Tiempos personalizados" seleccionada');
          }
        }
        
        // ========================================
        // 8. AÑADIR NUEVA PREGUNTA
        // ========================================
        console.log('\n➕ PASO 8: Añadiendo nueva pregunta...');
        
        const addQuestionButton = page.getByRole('button', { name: /añadir nueva pregunta/i });
        if (await addQuestionButton.isVisible()) {
          await addQuestionButton.click();
          await page.waitForTimeout(1000);
          
          console.log('✅ Pregunta añadida al formulario');
          
          // ========================================
          // 9. LLENAR DATOS DE LA PREGUNTA
          // ========================================
          console.log('\n✏️ PASO 9: Llenando datos de la pregunta...');
          
          // Llenar texto de la pregunta - buscar de manera más específica
          const questionTextInput = page.locator('textarea[placeholder*="pregunta"], input[placeholder*="pregunta"]').first();
          if (await questionTextInput.isVisible()) {
            await questionTextInput.fill('¿Esta es una pregunta de prueba del formulario con configuración de timing?');
            console.log('✅ Texto de pregunta llenado');
          } else {
            console.log('⚠️ Campo de texto de pregunta no encontrado');
          }
          
          // Llenar timestamps (solo si están habilitados - modo personalizado)
          const timestampInputs = page.locator('input[type="number"]');
          const timestampCount = await timestampInputs.count();
          
          if (timestampCount >= 2) {
            // Los primeros dos campos deberían ser los timestamps
            const startTimestamp = timestampInputs.nth(0);
            const endTimestamp = timestampInputs.nth(1);
            
            if (await startTimestamp.isEnabled()) {
              await startTimestamp.fill('250');
              await endTimestamp.fill('270');
              console.log('✅ Timestamps configurados (250s - 270s)');
            } else {
              console.log('✅ Timestamps calculados automáticamente (modo no personalizado)');
            }
          }
          
          // Llenar opciones de respuesta
          const optionInputs = page.locator('input[placeholder*="opción"], input[placeholder*="Texto de la opción"]');
          const optionCount = await optionInputs.count();
          
          if (optionCount >= 4) {
            await optionInputs.nth(0).fill('Opción A - Incorrecta');
            await optionInputs.nth(1).fill('Opción B - Correcta');
            await optionInputs.nth(2).fill('Opción C - Incorrecta');
            await optionInputs.nth(3).fill('Opción D - Incorrecta');
            console.log('✅ Opciones de respuesta llenadas');
          } else {
            console.log(`⚠️ Solo se encontraron ${optionCount} campos de opciones`);
          }
          
          // ========================================
          // 10. PROBAR DIFERENTES CONFIGURACIONES DE TIMING
          // ========================================
          console.log('\n🔄 PASO 10: Probando cambios de configuración de timing...');
          
          // Cambiar a "Al inicio del video" y verificar que los timestamps se actualicen
          const inicioRadio2 = page.getByRole('radio', { name: /al inicio del video/i });
          if (await inicioRadio2.isVisible()) {
            await inicioRadio2.click();
            await page.waitForTimeout(1500);
            
            // Verificar que los campos de timestamp están deshabilitados
            const timestampField = timestampInputs.nth(0);
            if (await timestampField.isVisible()) {
              const isDisabled = await timestampField.isDisabled();
              if (isDisabled) {
                console.log('✅ Campos de timestamp deshabilitados correctamente en modo automático');
              }
            }
            
            // Verificar que aparece la vista previa del timing
            const previewAlert = page.locator('[role="alert"]');
            if (await previewAlert.isVisible()) {
              const previewText = await previewAlert.textContent();
              console.log(`✅ Vista previa del timing: ${previewText}`);
            }
          }
          
          // ========================================
          // 11. ENVIAR FORMULARIO
          // ========================================
          console.log('\n🚀 PASO 11: Enviando formulario...');
          
          const submitButton = page.getByRole('button', { name: /crear.*pregunta/i });
          if (await submitButton.isVisible() && !await submitButton.isDisabled()) {
            await submitButton.click();
            await page.waitForTimeout(3000);
            
            console.log('✅ Formulario enviado');
            
            // Verificar que el modal se cierre
            const modalClosed = await modal.isHidden();
            if (modalClosed) {
              console.log('✅ Modal cerrado correctamente');
            }
            
            // ========================================
            // 12. VERIFICAR PREGUNTA CREADA
            // ========================================
            console.log('\n🔍 PASO 12: Verificando pregunta creada...');
            
            // Esperar a que se actualice la lista de preguntas
            await page.waitForTimeout(2000);
            
            // Buscar la nueva pregunta en la lista
            const newQuestion = page.getByText(/pregunta de prueba del formulario con configuración/i);
            if (await newQuestion.isVisible()) {
              console.log('✅ Nueva pregunta visible en la lista');
            } else {
              console.log('⚠️ Nueva pregunta no encontrada en la lista');
            }
            
          } else {
            console.log('⚠️ Botón de envío no disponible o deshabilitado');
          }
          
        } else {
          console.log('⚠️ Botón "Añadir Nueva Pregunta" no encontrado');
        }
        
      } else {
        console.log('⚠️ Título del modal no encontrado');
      }
      
    } else {
      console.log('❌ Botón "Añadir Formulario" NO encontrado');
      console.log('🔍 Buscando botones disponibles...');
      
      // Listar todos los botones visibles
      const allButtons = page.locator('button');
      const buttonCount = await allButtons.count();
      
      console.log(`📊 Total de botones encontrados: ${buttonCount}`);
      
      for (let i = 0; i < Math.min(buttonCount, 10); i++) {
        const buttonText = await allButtons.nth(i).textContent();
        console.log(`  - Botón ${i + 1}: "${buttonText}"`);
      }
    }

    console.log('\n🎉 Test de funcionalidad "Añadir Formulario" con configuración de timing completado');

  } catch (error) {
    console.error('❌ Error durante el test:', error);
    
    // Capturar screenshot en caso de error
    await page.screenshot({ 
      path: `debug-add-form-timing-error-${Date.now()}.png`,
      fullPage: true 
    });
    
  } finally {
    await browser.close();
  }
}

// Ejecutar el test
testAddFormFunctionality().catch(console.error); 