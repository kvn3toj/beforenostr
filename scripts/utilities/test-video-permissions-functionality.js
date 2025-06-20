const { chromium } = require('playwright');

async function testVideoPermissionsFunctionality() {
  console.log('🎯 Iniciando test de funcionalidad de Permisos de Video...\n');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 1000 
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();

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

    // 2. NAVEGACIÓN A CONFIGURACIÓN DE VIDEO
    console.log('\n📹 Paso 2: Navegando a configuración de video...');
    
    // Navegar directamente a la configuración de un video específico
    const videoId = '35'; // Usar un video que sabemos que existe
    await page.goto(`http://localhost:3000/items/${videoId}/config`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    console.log('✅ Página de configuración de video cargada');

    // 3. VERIFICAR PESTAÑAS DISPONIBLES
    console.log('\n🔍 Paso 3: Verificando pestañas disponibles...');
    
    const tabs = [
      'Configuración',
      'Subtítulos', 
      'Preguntas',
      'Permisos'
    ];

    for (const tabName of tabs) {
      try {
        const tab = page.getByRole('tab', { name: new RegExp(tabName, 'i') });
        await expect(tab).toBeVisible({ timeout: 5000 });
        console.log(`✅ Pestaña "${tabName}" encontrada`);
      } catch (error) {
        console.log(`❌ Pestaña "${tabName}" no encontrada`);
      }
    }

    // 4. NAVEGAR A PESTAÑA DE PERMISOS
    console.log('\n🔐 Paso 4: Navegando a pestaña de Permisos...');
    
    const permissionsTab = page.getByRole('tab', { name: /Permisos/i });
    await permissionsTab.click();
    await page.waitForTimeout(2000);

    // Verificar que la pestaña está seleccionada
    await expect(permissionsTab).toHaveAttribute('aria-selected', 'true');
    console.log('✅ Pestaña de Permisos seleccionada');

    // 5. VERIFICAR SECCIONES DE PERMISOS
    console.log('\n📋 Paso 5: Verificando secciones de permisos...');
    
    const permissionSections = [
      'Derechos de visualización del jugador',
      'Posición del video en la playlist'
    ];

    for (const section of permissionSections) {
      try {
        await page.waitForSelector(`text=${section}`, { timeout: 5000 });
        console.log(`✅ Sección "${section}" encontrada`);
      } catch (error) {
        console.log(`❌ Sección "${section}" no encontrada`);
      }
    }

    // 6. VERIFICAR SWITCHES DE PERMISOS
    console.log('\n🎛️ Paso 6: Verificando switches de permisos...');
    
    const permissionSwitches = [
      'Visibilidad del número de Öndas',
      'Subtítulos de video',
      'Fecha de publicación'
    ];

    for (const switchName of permissionSwitches) {
      try {
        const switchElement = page.getByLabelText(switchName);
        await expect(switchElement).toBeVisible({ timeout: 5000 });
        console.log(`✅ Switch "${switchName}" encontrado`);
        
        // Verificar que el switch es interactivo
        const isChecked = await switchElement.isChecked();
        console.log(`   Estado inicial: ${isChecked ? 'Activado' : 'Desactivado'}`);
      } catch (error) {
        console.log(`❌ Switch "${switchName}" no encontrado`);
      }
    }

    // 7. PROBAR INTERACCIÓN CON SWITCHES
    console.log('\n🔄 Paso 7: Probando interacción con switches...');
    
    try {
      const waveSwitch = page.getByLabelText('Visibilidad del número de Öndas');
      const initialState = await waveSwitch.isChecked();
      
      await waveSwitch.click();
      await page.waitForTimeout(500);
      
      const newState = await waveSwitch.isChecked();
      if (newState !== initialState) {
        console.log('✅ Switch de Öndas funciona correctamente');
      } else {
        console.log('❌ Switch de Öndas no cambió de estado');
      }
    } catch (error) {
      console.log('❌ Error al probar switch de Öndas:', error.message);
    }

    // 8. VERIFICAR SECCIONES EXPANDIBLES (ACCORDIONS)
    console.log('\n📂 Paso 8: Verificando secciones expandibles...');
    
    try {
      // Buscar y expandir sección de Videos
      const videosAccordion = page.locator('text=Videos').locator('..').locator('button').first();
      await videosAccordion.click();
      await page.waitForTimeout(1000);
      
      // Verificar que se expandió
      const videoDurationSwitch = page.getByLabelText(/Duración de.*videos/i);
      await expect(videoDurationSwitch).toBeVisible({ timeout: 3000 });
      console.log('✅ Sección de Videos se expandió correctamente');
      
      // Probar switch dentro del accordion
      await videoDurationSwitch.click();
      console.log('✅ Switch de duración de videos funciona');
      
    } catch (error) {
      console.log('❌ Error con sección de Videos:', error.message);
    }

    try {
      // Buscar y expandir sección de Comentarios
      const commentsAccordion = page.locator('text=Comentarios').locator('..').locator('button').first();
      await commentsAccordion.click();
      await page.waitForTimeout(1000);
      
      // Verificar que se expandió
      const viewCommentsSwitch = page.getByLabelText('Ver comentarios');
      await expect(viewCommentsSwitch).toBeVisible({ timeout: 3000 });
      console.log('✅ Sección de Comentarios se expandió correctamente');
      
    } catch (error) {
      console.log('❌ Error con sección de Comentarios:', error.message);
    }

    // 9. VERIFICAR BOTONES DE POSICIÓN
    console.log('\n📍 Paso 9: Verificando botones de posición...');
    
    const positions = ['Posición 1', 'Posición 2', 'Posición 3', 'Posición final'];
    
    for (const position of positions) {
      try {
        const positionButton = page.getByRole('button', { name: position });
        await expect(positionButton).toBeVisible({ timeout: 3000 });
        console.log(`✅ Botón "${position}" encontrado`);
        
        // Probar click en el botón
        await positionButton.click();
        await page.waitForTimeout(500);
        console.log(`✅ Botón "${position}" clickeable`);
        
      } catch (error) {
        console.log(`❌ Botón "${position}" no encontrado`);
      }
    }

    // 10. VERIFICAR BOTONES DE ACCIÓN
    console.log('\n💾 Paso 10: Verificando botones de acción...');
    
    const actionButtons = [
      'Guardar en borradores',
      'Publicar video'
    ];

    for (const buttonName of actionButtons) {
      try {
        const button = page.getByRole('button', { name: buttonName });
        await expect(button).toBeVisible({ timeout: 3000 });
        console.log(`✅ Botón "${buttonName}" encontrado`);
        
        // Verificar que no está deshabilitado
        const isDisabled = await button.isDisabled();
        if (!isDisabled) {
          console.log(`✅ Botón "${buttonName}" está habilitado`);
        } else {
          console.log(`⚠️ Botón "${buttonName}" está deshabilitado`);
        }
        
      } catch (error) {
        console.log(`❌ Botón "${buttonName}" no encontrado`);
      }
    }

    // 11. PROBAR FUNCIONALIDAD DE GUARDAR EN BORRADORES
    console.log('\n💾 Paso 11: Probando funcionalidad de guardar en borradores...');
    
    try {
      const draftButton = page.getByRole('button', { name: 'Guardar en borradores' });
      await draftButton.click();
      await page.waitForTimeout(1000);
      
      // Verificar que se abre el dialog
      const dialogTitle = page.getByText('Guardar en borradores');
      await expect(dialogTitle).toBeVisible({ timeout: 3000 });
      console.log('✅ Dialog de borradores se abrió');
      
      // Verificar selector de playlist
      const playlistSelector = page.getByLabelText('Seleccionar playlist');
      await expect(playlistSelector).toBeVisible({ timeout: 3000 });
      console.log('✅ Selector de playlist encontrado');
      
      // Cerrar dialog
      const cancelButton = page.getByRole('button', { name: 'Cancelar' });
      await cancelButton.click();
      await page.waitForTimeout(500);
      console.log('✅ Dialog cerrado correctamente');
      
    } catch (error) {
      console.log('❌ Error con funcionalidad de borradores:', error.message);
    }

    // 12. VERIFICAR MENSAJE DE ESTADO
    console.log('\n📢 Paso 12: Verificando mensajes de estado...');
    
    try {
      await page.waitForSelector('text=Se guardaron los cambios', { timeout: 3000 });
      console.log('✅ Mensaje de estado encontrado');
      
      await page.waitForSelector('text=Carpeta 2024', { timeout: 3000 });
      console.log('✅ Información de ubicación encontrada');
      
    } catch (error) {
      console.log('❌ Mensajes de estado no encontrados:', error.message);
    }

    // Tomar screenshot final
    await page.screenshot({ 
      path: `debug-video-permissions-final-${Date.now()}.png`,
      fullPage: true 
    });

    console.log('\n🎉 Test de funcionalidad de Permisos completado exitosamente');

  } catch (error) {
    console.error('❌ Error durante el test:', error);
    
    // Capturar screenshot en caso de error
    await page.screenshot({ 
      path: `debug-video-permissions-error-${Date.now()}.png`,
      fullPage: true 
    });
    
    // Capturar información adicional de debug
    const currentUrl = page.url();
    console.log('URL actual:', currentUrl);
    
    const pageTitle = await page.title();
    console.log('Título de página:', pageTitle);
    
  } finally {
    await browser.close();
  }
}

// Función auxiliar para expect (simulada para este contexto)
function expect(locator) {
  return {
    toBeVisible: async (options = {}) => {
      try {
        await locator.waitFor({ state: 'visible', ...options });
        return true;
      } catch (error) {
        throw new Error(`Element not visible: ${error.message}`);
      }
    },
    toHaveAttribute: async (attribute, value) => {
      try {
        const actualValue = await locator.getAttribute(attribute);
        if (actualValue === value) {
          return true;
        } else {
          throw new Error(`Expected attribute ${attribute} to be ${value}, but got ${actualValue}`);
        }
      } catch (error) {
        throw new Error(`Attribute check failed: ${error.message}`);
      }
    }
  };
}

testVideoPermissionsFunctionality().catch(console.error); 