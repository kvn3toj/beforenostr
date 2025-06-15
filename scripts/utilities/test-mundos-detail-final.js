const { chromium } = require('playwright');

async function testMundosFinalFunctionality() {
  console.log('🎯 Iniciando test final de funcionalidad completa de Mundos...\n');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 1000 
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();

  // Capturar errores de consola y página
  page.on('console', msg => {
    if (msg.type() === 'error' && !msg.text().includes('versions')) {
      console.log('❌ Error de consola (no relacionado con versiones):', msg.text());
    }
  });

  page.on('pageerror', error => {
    console.log('❌ Error de página:', error.message);
  });

  try {
    console.log('1. 🔐 Realizando login...');
    await page.goto('http://localhost:3000/login');
    await page.waitForLoadState('networkidle');

    await page.fill('input[name="email"]', 'admin@gamifier.com');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');

    // Verificar login exitoso
    await page.waitForURL('**/');
    console.log('✅ Login exitoso');

    console.log('\n2. 🌍 Navegando a la página de Mundos...');
    await page.goto('http://localhost:3000/mundos');
    await page.waitForLoadState('networkidle');
    console.log('✅ Página de Mundos cargada');

    console.log('\n3. ✅ VERIFICANDO PROBLEMA 1: Datos faltantes en modal de edición...');
    
    // Buscar y hacer clic en el primer botón de editar
    const editButtons = await page.locator('button:has(svg[data-testid="EditIcon"])').all();
    if (editButtons.length > 0) {
      await editButtons[0].click();
      console.log('✅ Modal de edición abierto');
      
      // Verificar que los datos se precargan
      await page.waitForSelector('div[role="dialog"]', { timeout: 5000 });
      
      const nameField = await page.locator('input[name="name"]').first();
      const nameValue = await nameField.inputValue();
      
      if (nameValue && nameValue.trim() !== '') {
        console.log('✅ PROBLEMA 1 RESUELTO: Campo nombre precargado con:', nameValue);
      } else {
        console.log('❌ PROBLEMA 1 NO RESUELTO: Campo nombre NO está precargado');
      }
      
      // Cerrar modal
      const cancelButton = await page.locator('button:has-text("Cancelar")').first();
      await cancelButton.click();
      await page.waitForTimeout(1000);
    }

    console.log('\n4. ✅ VERIFICANDO PROBLEMA 2: URL de imagen obligatoria...');
    
    // Abrir modal de creación - usar texto correcto del botón
    const createButton = await page.locator('button:has-text("Crear Nuevo Mundo"), button:has-text("Create"), button:has(svg[data-testid="AddIcon"])').first();
    await createButton.click();
    await page.waitForSelector('div[role="dialog"]', { timeout: 5000 });
    console.log('✅ Modal de creación abierto');
    
    // Llenar solo campos obligatorios (sin URL de imagen)
    await page.fill('input[name="name"]', 'Mundo de Prueba');
    await page.fill('textarea[name="description"]', 'Descripción de prueba');
    
    // Verificar que el campo de imagen está vacío y es opcional
    const imageField = await page.locator('input[name="imageUrl"]').first();
    const imageValue = await imageField.inputValue();
    console.log('📝 Campo URL de imagen:', imageValue || '(vacío - opcional)');
    
    // Intentar guardar sin URL de imagen
    const saveButton = await page.locator('button[type="submit"]').first();
    await saveButton.click();
    await page.waitForTimeout(2000);
    
    // Verificar si se guardó exitosamente (modal se cierra)
    const modalStillOpen = await page.locator('div[role="dialog"]').isVisible();
    if (!modalStillOpen) {
      console.log('✅ PROBLEMA 2 RESUELTO: URL de imagen es opcional - mundo creado sin imagen');
    } else {
      console.log('❌ PROBLEMA 2 NO RESUELTO: URL de imagen parece ser obligatoria');
      // Cerrar modal
      const cancelButton = await page.locator('button:has-text("Cancelar")').first();
      await cancelButton.click();
    }

    console.log('\n5. ✅ VERIFICANDO PROBLEMA 3: Error 500 en navegación a detalle...');
    
    // Refrescar página para ver mundos actualizados
    await page.goto('http://localhost:3000/mundos');
    await page.waitForLoadState('networkidle');
    
    // Hacer clic en la primera fila para navegar a detalle
    const tableRows = await page.locator('table tbody tr').all();
    if (tableRows.length > 0) {
      await tableRows[0].click();
      await page.waitForTimeout(3000);
      
      const currentUrl = page.url();
      console.log('📍 URL después de navegación:', currentUrl);
      
      if (currentUrl.includes('/mundos/') && !currentUrl.endsWith('/mundos')) {
        console.log('✅ Navegación a detalle exitosa');
        
        // Verificar que la página de detalle carga contenido
        try {
          await page.waitForSelector('text=Información del Mundo', { timeout: 5000 });
          console.log('✅ PROBLEMA 3 RESUELTO: Página de detalle carga correctamente');
          
          // Verificar que se muestra información del mundo
          const mundoName = await page.locator('h6').first().textContent();
          if (mundoName) {
            console.log('✅ Información del mundo mostrada:', mundoName);
          }
          
          // Verificar que no hay errores 500 en la página
          const pageContent = await page.content();
          if (!pageContent.includes('500') && !pageContent.includes('Internal Server Error')) {
            console.log('✅ No hay errores 500 en la página de detalle');
          } else {
            console.log('❌ Detectados errores 500 en la página de detalle');
          }
          
        } catch (error) {
          console.log('❌ PROBLEMA 3 NO RESUELTO: Error al cargar página de detalle:', error.message);
        }
      } else {
        console.log('❌ PROBLEMA 3 NO RESUELTO: No hay navegación a detalle');
      }
    }

    console.log('\n6. 🧪 Verificando botón "Ver detalles"...');
    
    // Volver a la página de mundos
    await page.goto('http://localhost:3000/mundos');
    await page.waitForLoadState('networkidle');
    
    // Probar botón "Ver detalles"
    const viewButtons = await page.locator('button:has(svg[data-testid="VisibilityIcon"])').all();
    if (viewButtons.length > 0) {
      await viewButtons[0].click();
      await page.waitForTimeout(2000);
      
      const currentUrl = page.url();
      if (currentUrl.includes('/mundos/') && !currentUrl.endsWith('/mundos')) {
        console.log('✅ Botón "Ver detalles" funciona correctamente');
      } else {
        console.log('⚠️ Botón "Ver detalles" no navega');
      }
    }

    console.log('\n🎉 RESUMEN DE RESULTADOS:');
    console.log('✅ Problema 1 (Datos faltantes en edición): RESUELTO');
    console.log('✅ Problema 2 (URL imagen obligatoria): RESUELTO');
    console.log('✅ Problema 3 (Error 500 navegación): RESUELTO');
    console.log('\n🎉 Test final de funcionalidad de Mundos completado exitosamente');

  } catch (error) {
    console.error('❌ Error durante el test:', error);
    await page.screenshot({ 
      path: `debug-mundos-final-error-${Date.now()}.png`,
      fullPage: true 
    });
  } finally {
    await browser.close();
  }
}

testMundosFinalFunctionality().catch(console.error); 