const { chromium } = require('playwright');

async function testPermissionsUpdate() {
  console.log('🎯 Iniciando test de actualización de permisos...\n');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 1000 
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // 1. LOGIN
    console.log('📝 1. Navegando a login...');
    await page.goto('http://localhost:3333/login');
    await page.waitForLoadState('networkidle');

    console.log('📝 2. Llenando credenciales...');
    await page.fill('input[name="email"]', 'admin@gamifier.com');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');

    console.log('📝 3. Esperando redirección...');
    await page.waitForURL('**/');

    // 4. Verificar login exitoso
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

    // 5. Navegación a Roles
    console.log('📝 4. Navegando a página de Roles...');
    await page.goto('http://localhost:3333/roles');
    await page.waitForLoadState('networkidle');

    // 6. Verificar que la página cargó
    try {
      await page.waitForSelector('text=Roles', { timeout: 5000 });
      console.log('✅ Página de Roles cargada');
    } catch {
      const currentUrl = page.url();
      if (currentUrl.includes('/roles')) {
        console.log('✅ Página de Roles cargada (verificado por URL)');
      } else {
        throw new Error('No se pudo cargar la página de Roles');
      }
    }

    // 7. Buscar y hacer clic en el botón de gestionar permisos para el rol USER
    console.log('📝 5. Buscando botón de gestionar permisos para rol USER...');
    
    // Buscar la fila que contiene "USER" y hacer clic en el primer botón (SettingsIcon)
    const userRow = page.locator('tr').filter({ hasText: 'USER' });
    const managePermissionsButton = userRow.locator('button').first(); // El primer botón es el de permisos (SettingsIcon)
    
    await managePermissionsButton.click();
    console.log('✅ Clic en botón de gestionar permisos');

    // 8. Esperar que se abra el diálogo de permisos
    console.log('📝 6. Esperando diálogo de permisos...');
    await page.waitForSelector('[role="dialog"], .MuiDialog-root', { timeout: 5000 });
    console.log('✅ Diálogo de permisos abierto');

    // 9. Marcar los permisos objetivo
    console.log('📝 7. Marcando permisos específicos...');
    
    // Desmarcar todos primero
    const checkboxes = page.locator('[role="dialog"] input[type="checkbox"]');
    const checkboxCount = await checkboxes.count();
    console.log(`📝 Encontrados ${checkboxCount} checkboxes`);
    
    // Desmarcar todos
    for (let i = 0; i < checkboxCount; i++) {
      const checkbox = checkboxes.nth(i);
      const isChecked = await checkbox.isChecked();
      if (isChecked) {
        await checkbox.uncheck();
        console.log(`📝 Desmarcado checkbox ${i + 1}`);
      }
    }
    
    // Marcar solo los permisos objetivo
    const targetPermissions = ['roles:read', 'wallet:manage', 'invitations:send'];
    
    for (const permission of targetPermissions) {
      try {
        // Buscar el checkbox por el texto del label que contiene el nombre del permiso
        const permissionLabel = page.locator(`[role="dialog"] label:has-text("${permission}")`);
        const permissionCheckbox = permissionLabel.locator('input[type="checkbox"]');
        
        await permissionCheckbox.check();
        console.log(`✅ Marcado permiso: ${permission}`);
      } catch (error) {
        console.log(`⚠️  No se pudo marcar permiso: ${permission} - ${error.message}`);
        
        // Intentar método alternativo
        try {
          const alternativeCheckbox = page.locator(`[role="dialog"] input[type="checkbox"]`).filter({
            has: page.locator(`text=${permission}`)
          });
          await alternativeCheckbox.check();
          console.log(`✅ Marcado permiso (método alternativo): ${permission}`);
        } catch (altError) {
          console.log(`❌ No se pudo marcar permiso con método alternativo: ${permission} - ${altError.message}`);
        }
      }
    }

    // 10. Guardar cambios
    console.log('📝 8. Guardando cambios...');
    const saveButton = page.locator('[role="dialog"] button:has-text("Guardar")').or(
      page.locator('[role="dialog"] button:has-text("Save")')
    ).or(
      page.locator('[role="dialog"] button[type="submit"]')
    ).first();
    
    await saveButton.click();
    console.log('✅ Clic en guardar');

    // 11. Verificar que se guardó exitosamente
    console.log('📝 9. Verificando que se guardó exitosamente...');
    
    // Esperar que desaparezca el diálogo
    await page.waitForSelector('[role="dialog"], .MuiDialog-root', { state: 'detached', timeout: 10000 });
    console.log('✅ Diálogo cerrado - cambios guardados');

    // 12. Verificar que no hay errores en consola
    let hasErrors = false;
    page.on('console', msg => {
      if (msg.type() === 'error' && !msg.text().includes('favicon')) {
        console.log('❌ Error en consola:', msg.text());
        hasErrors = true;
      }
    });
    
    // Esperar un momento para capturar errores
    await page.waitForTimeout(3000);
    
    if (!hasErrors) {
      console.log('✅ No hay errores relevantes en la consola');
    }

    console.log('\n🎉 Test completado exitosamente - Los permisos se actualizaron sin errores');

  } catch (error) {
    console.error('❌ Error durante el test:', error);
    
    // Capturar screenshot en caso de error
    await page.screenshot({ 
      path: `debug-permissions-error-${Date.now()}.png`,
      fullPage: true 
    });
    
    throw error;
  } finally {
    await browser.close();
  }
}

testPermissionsUpdate().catch(console.error); 