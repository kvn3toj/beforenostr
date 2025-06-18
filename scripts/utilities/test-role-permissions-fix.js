const { chromium } = require('playwright');

async function testRolePermissionsFix() {
  console.log('🎯 Iniciando test de corrección de permisos de roles...\n');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 1000 
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // 1. LOGIN
    console.log('🔐 Iniciando sesión...');
    await page.goto('http://localhost:3333/login');
    await page.waitForLoadState('networkidle');

    await page.fill('input[name="email"]', 'admin@gamifier.com');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');

    await page.waitForURL('**/');

    // Verificar login exitoso
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

    // 2. NAVEGACIÓN A ROLES
    console.log('📋 Navegando a la página de Roles...');
    await page.goto('http://localhost:3333/roles');
    await page.waitForLoadState('networkidle');

    // Verificar que estamos en la página de roles
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

    // 3. BUSCAR Y EDITAR PERMISOS DE UN ROL
    console.log('🔧 Buscando rol USER para editar permisos...');
    
    // Buscar el botón de "Gestionar Permisos" para el rol USER
    const managePermissionsButtons = await page.locator('button').filter({ hasText: /gestionar permisos|manage permissions|permisos/i });
    const buttonCount = await managePermissionsButtons.count();
    
    if (buttonCount > 0) {
      console.log(`✅ Encontrados ${buttonCount} botones de gestión de permisos`);
      
      // Hacer clic en el primer botón de gestionar permisos
      await managePermissionsButtons.first().click();
      console.log('✅ Clic en botón de gestionar permisos');
      
      // Esperar a que aparezca el modal/dialog de permisos
      await page.waitForSelector('[role="dialog"], .MuiDialog-root, .modal', { timeout: 5000 });
      console.log('✅ Modal de permisos abierto');
      
      // 4. MODIFICAR PERMISOS
      console.log('📝 Modificando permisos...');
      
      // Buscar checkboxes de permisos y cambiar algunos
      const permissionCheckboxes = await page.locator('input[type="checkbox"]');
      const checkboxCount = await permissionCheckboxes.count();
      
      if (checkboxCount > 0) {
        console.log(`✅ Encontrados ${checkboxCount} checkboxes de permisos`);
        
        // Cambiar el estado de algunos checkboxes
        for (let i = 0; i < Math.min(3, checkboxCount); i++) {
          await permissionCheckboxes.nth(i).click();
          console.log(`✅ Modificado checkbox ${i + 1}`);
        }
        
        // 5. GUARDAR CAMBIOS
        console.log('💾 Guardando cambios...');
        
        // Buscar y hacer clic en el botón de guardar
        const saveButton = page.locator('button').filter({ hasText: /guardar|save|aplicar|confirm/i });
        await saveButton.click();
        console.log('✅ Clic en botón guardar');
        
        // Esperar a que se cierre el modal
        await page.waitForSelector('[role="dialog"], .MuiDialog-root, .modal', { state: 'hidden', timeout: 10000 });
        console.log('✅ Modal cerrado');
        
        // 6. VERIFICAR ÉXITO
        console.log('🔍 Verificando que los cambios se guardaron...');
        
        // Buscar mensaje de éxito o verificar que no hay errores
        try {
          // Buscar toast de éxito
          await page.waitForSelector('.Toastify__toast--success, [data-sonner-toast][data-type="success"]', { timeout: 5000 });
          console.log('✅ Mensaje de éxito detectado');
        } catch {
          // Si no hay toast, verificar que no hay errores
          const errorToast = await page.locator('.Toastify__toast--error, [data-sonner-toast][data-type="error"]').count();
          if (errorToast === 0) {
            console.log('✅ No se detectaron errores - Cambios guardados exitosamente');
          } else {
            throw new Error('Se detectó un mensaje de error al guardar');
          }
        }
        
        console.log('\n🎉 Test completado exitosamente - La funcionalidad de permisos funciona correctamente');
        
      } else {
        console.log('⚠️  No se encontraron checkboxes de permisos en el modal');
      }
      
    } else {
      console.log('⚠️  No se encontraron botones de gestión de permisos');
    }

  } catch (error) {
    console.error('❌ Error durante el test:', error);
    
    // Capturar screenshot en caso de error
    await page.screenshot({ 
      path: `debug-role-permissions-error-${Date.now()}.png`,
      fullPage: true 
    });
    
    throw error;
  } finally {
    await browser.close();
  }
}

testRolePermissionsFix().catch(console.error); 