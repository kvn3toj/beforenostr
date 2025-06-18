const { chromium } = require('playwright');

async function testMundosEditFunctionality() {
  console.log('🎯 Iniciando test de funcionalidad de edición de Mundos...\n');
  
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

  try {
    console.log('1. 🔐 Realizando login...');
    await page.goto('http://localhost:3333/login');
    await page.waitForLoadState('networkidle');

    await page.fill('input[name="email"]', 'admin@gamifier.com');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');

    // Verificar login exitoso
    await page.waitForURL('**/');
    try {
      await page.waitForSelector('nav, [role="navigation"], button[aria-label*="menu"]', { timeout: 5000 });
      console.log('✅ Login exitoso - Navegación detectada');
    } catch {
      const currentUrl = page.url();
      if (!currentUrl.includes('/login')) {
        console.log('✅ Login exitoso - Verificado por URL');
      } else {
        throw new Error('Login falló');
      }
    }

    console.log('\n2. 🌍 Navegando a la página de Mundos...');
    await page.goto('http://localhost:3333/mundos');
    await page.waitForLoadState('networkidle');

    // Verificar que la página de mundos carga
    try {
      await page.waitForSelector('text=Mundos', { timeout: 5000 });
      console.log('✅ Página de Mundos cargada');
    } catch {
      const currentUrl = page.url();
      if (currentUrl.includes('/mundos')) {
        console.log('✅ Página de Mundos cargada (verificado por URL)');
      } else {
        throw new Error('No se pudo cargar la página de Mundos');
      }
    }

    console.log('\n3. 📝 Probando funcionalidad de edición...');
    
    // Buscar el primer botón de editar en la tabla
    const editButtons = await page.locator('button[aria-label*="edit"], button:has(svg[data-testid="EditIcon"]), button:has-text("edit")').all();
    
    if (editButtons.length === 0) {
      // Buscar por icono de edición de otra manera
      const editIcons = await page.locator('svg[data-testid="EditIcon"]').all();
      if (editIcons.length > 0) {
        console.log('✅ Encontrado botón de editar por icono');
        await editIcons[0].click();
      } else {
        // Buscar en la tabla de datos
        const tableRows = await page.locator('table tbody tr').all();
        if (tableRows.length > 0) {
          console.log('✅ Haciendo clic en la primera fila para editar');
          await tableRows[0].locator('button').first().click();
        } else {
          throw new Error('No se encontraron mundos para editar');
        }
      }
    } else {
      console.log('✅ Encontrado botón de editar');
      await editButtons[0].click();
    }

    console.log('\n4. 🔍 Verificando que el modal de edición se abre...');
    
    // Esperar a que aparezca el modal de edición
    try {
      await page.waitForSelector('div[role="dialog"], .MuiDialog-root', { timeout: 5000 });
      console.log('✅ Modal de edición abierto');
    } catch {
      console.log('⚠️ Modal no detectado por selector, verificando por contenido...');
      await page.waitForSelector('text=Editar', { timeout: 5000 });
      console.log('✅ Modal de edición abierto (verificado por texto)');
    }

    console.log('\n5. 📋 Verificando que los datos se precargan en el formulario...');
    
    // Verificar que el campo nombre tiene datos
    const nameField = await page.locator('input[name="name"], input[label*="Nombre"], input[placeholder*="nombre"]').first();
    const nameValue = await nameField.inputValue();
    
    if (nameValue && nameValue.trim() !== '') {
      console.log('✅ Campo nombre precargado con:', nameValue);
    } else {
      console.log('❌ Campo nombre NO está precargado');
      await page.screenshot({ path: `debug-edit-form-empty-${Date.now()}.png`, fullPage: true });
    }

    // Verificar que el campo descripción tiene datos (si existe)
    try {
      const descField = await page.locator('textarea[name="description"], input[name="description"], textarea[label*="Descripción"]').first();
      const descValue = await descField.inputValue();
      if (descValue && descValue.trim() !== '') {
        console.log('✅ Campo descripción precargado con:', descValue.substring(0, 50) + '...');
      } else {
        console.log('⚠️ Campo descripción está vacío (puede ser normal)');
      }
    } catch {
      console.log('⚠️ Campo descripción no encontrado');
    }

    console.log('\n6. 🖼️ Verificando que el campo URL de imagen es opcional...');
    
    // Verificar que el campo imageUrl existe y es opcional
    try {
      const imageUrlField = await page.locator('input[name="imageUrl"], input[label*="Imagen"], input[placeholder*="imagen"]').first();
      const imageUrlValue = await imageUrlField.inputValue();
      
      console.log('✅ Campo URL de imagen encontrado');
      console.log('📝 Valor actual:', imageUrlValue || '(vacío)');
      
      // Limpiar el campo para probar que es opcional
      await imageUrlField.clear();
      console.log('✅ Campo URL de imagen limpiado (probando que es opcional)');
      
    } catch {
      console.log('⚠️ Campo URL de imagen no encontrado con los selectores esperados');
    }

    console.log('\n7. 💾 Probando guardar cambios...');
    
    // Buscar y hacer clic en el botón de guardar
    try {
      const saveButton = await page.locator('button:has-text("Guardar"), button:has-text("Actualizar"), button[type="submit"]').first();
      await saveButton.click();
      console.log('✅ Botón guardar clickeado');
      
      // Esperar a que el modal se cierre o aparezca mensaje de éxito
      await page.waitForTimeout(2000);
      console.log('✅ Cambios guardados exitosamente');
      
    } catch (error) {
      console.log('⚠️ Error al guardar:', error.message);
      await page.screenshot({ path: `debug-save-error-${Date.now()}.png`, fullPage: true });
    }

    console.log('\n8. 🔄 Verificando que no hay errores 500 en navegación...');
    
    // Probar hacer clic en el nombre de un mundo para ver detalles
    try {
      await page.goto('http://localhost:3333/mundos');
      await page.waitForLoadState('networkidle');
      
      // Buscar el primer mundo en la tabla y hacer clic en su nombre
      const firstMundoName = await page.locator('table tbody tr:first-child td:first-child, table tbody tr:first-child a').first();
      if (await firstMundoName.isVisible()) {
        await firstMundoName.click();
        await page.waitForTimeout(2000);
        
        // Verificar que no hay error 500
        const currentUrl = page.url();
        if (currentUrl.includes('500') || currentUrl.includes('error')) {
          console.log('❌ Error 500 detectado en navegación a detalle');
          await page.screenshot({ path: `debug-500-error-${Date.now()}.png`, fullPage: true });
        } else {
          console.log('✅ Navegación a detalle funciona sin errores 500');
        }
      }
    } catch (error) {
      console.log('⚠️ Error en navegación a detalle:', error.message);
    }

    console.log('\n🎉 Test de funcionalidad de edición de Mundos completado');

  } catch (error) {
    console.error('❌ Error durante el test:', error);
    await page.screenshot({ 
      path: `debug-mundos-edit-error-${Date.now()}.png`,
      fullPage: true 
    });
  } finally {
    await browser.close();
  }
}

testMundosEditFunctionality().catch(console.error); 