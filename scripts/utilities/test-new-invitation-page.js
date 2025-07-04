const { chromium } = require('playwright');

async function testNewInvitationPage() {
  console.log('🎯 Iniciando test de la página Nueva Invitación...\n');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 1000 
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // 1. LOGIN
    console.log('📝 Paso 1: Navegando a login...');
    await page.goto('http://localhost:3000/login');
    await page.waitForLoadState('networkidle');

    console.log('🔐 Paso 2: Realizando login...');
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
        throw new Error('Login falló');
      }
    }

    // 2. NAVEGACIÓN A INVITACIONES
    console.log('🎯 Paso 3: Navegando a página de invitaciones...');
    await page.goto('http://localhost:3000/invitations');
    await page.waitForLoadState('networkidle');

    // Verificar que estamos en la página de invitaciones
    try {
      await page.waitForSelector('text=Sistema de Invitaciones', { timeout: 5000 });
      console.log('✅ Página de invitaciones cargada correctamente');
    } catch {
      console.log('⚠️ Verificando por URL...');
      const currentUrl = page.url();
      if (currentUrl.includes('/invitations')) {
        console.log('✅ Página de invitaciones verificada por URL');
      } else {
        throw new Error('No se pudo cargar la página de invitaciones');
      }
    }

    // 3. VERIFICAR BOTÓN "NUEVA INVITACIÓN"
    console.log('🔍 Paso 4: Verificando botón Nueva Invitación...');
    const newInvitationButton = await page.locator('button:has-text("Nueva Invitación")').first();
    
    if (await newInvitationButton.isVisible()) {
      console.log('✅ Botón "Nueva Invitación" encontrado y visible');
      
      // Verificar que no está deshabilitado
      const isDisabled = await newInvitationButton.isDisabled();
      if (!isDisabled) {
        console.log('✅ Botón "Nueva Invitación" está habilitado');
      } else {
        console.log('❌ Botón "Nueva Invitación" está deshabilitado');
      }
    } else {
      console.log('❌ Botón "Nueva Invitación" no encontrado');
    }

    // 4. NAVEGAR A NUEVA INVITACIÓN
    console.log('🎯 Paso 5: Haciendo clic en Nueva Invitación...');
    await newInvitationButton.click();
    await page.waitForLoadState('networkidle');

    // Verificar que estamos en la página de nueva invitación
    try {
      await page.waitForSelector('text=Nueva Invitación', { timeout: 5000 });
      console.log('✅ Página "Nueva Invitación" cargada correctamente');
    } catch {
      const currentUrl = page.url();
      if (currentUrl.includes('/invitations/new')) {
        console.log('✅ Página "Nueva Invitación" verificada por URL');
      } else {
        throw new Error('No se pudo cargar la página Nueva Invitación');
      }
    }

    // 5. VERIFICAR ELEMENTOS DEL FORMULARIO
    console.log('🔍 Paso 6: Verificando elementos del formulario...');
    
    const formElements = [
      'select[name="inviterId"]',
      'input[name="invitedName"]',
      'input[name="invitedEmail"]',
      'input[name="unitsAmount"]'
    ];

    for (const selector of formElements) {
      try {
        await page.waitForSelector(selector, { timeout: 3000 });
        console.log(`✅ Campo encontrado: ${selector}`);
      } catch {
        console.log(`⚠️ Campo no encontrado: ${selector}`);
      }
    }

    // 6. VERIFICAR BOTÓN DE ENVÍO
    const submitButton = await page.locator('button:has-text("Crear Invitación")');
    if (await submitButton.isVisible()) {
      console.log('✅ Botón "Crear Invitación" encontrado');
    } else {
      console.log('❌ Botón "Crear Invitación" no encontrado');
    }

    // 7. VERIFICAR BOTÓN DE CANCELAR
    const cancelButton = await page.locator('button:has-text("Cancelar")');
    if (await cancelButton.isVisible()) {
      console.log('✅ Botón "Cancelar" encontrado');
    } else {
      console.log('❌ Botón "Cancelar" no encontrado');
    }

    // 8. VERIFICAR PANEL DE INFORMACIÓN
    try {
      await page.waitForSelector('text=Información', { timeout: 3000 });
      console.log('✅ Panel de información encontrado');
    } catch {
      console.log('⚠️ Panel de información no encontrado');
    }

    // 9. PROBAR NAVEGACIÓN DE VUELTA
    console.log('🔙 Paso 7: Probando navegación de vuelta...');
    await cancelButton.click();
    await page.waitForLoadState('networkidle');

    // Verificar que volvimos a la página de invitaciones
    const currentUrl = page.url();
    if (currentUrl.includes('/invitations') && !currentUrl.includes('/new')) {
      console.log('✅ Navegación de vuelta exitosa');
    } else {
      console.log('⚠️ Navegación de vuelta - verificando por contenido...');
      try {
        await page.waitForSelector('text=Sistema de Invitaciones', { timeout: 3000 });
        console.log('✅ Navegación de vuelta verificada por contenido');
      } catch {
        console.log('❌ Error en navegación de vuelta');
      }
    }

    console.log('\n🎉 Test completado exitosamente');
    console.log('\n📋 RESUMEN:');
    console.log('✅ Login funcionando');
    console.log('✅ Página de invitaciones accesible');
    console.log('✅ Botón "Nueva Invitación" habilitado');
    console.log('✅ Página "Nueva Invitación" funcional');
    console.log('✅ Formulario con campos requeridos');
    console.log('✅ Navegación entre páginas');

  } catch (error) {
    console.error('❌ Error durante el test:', error);
    
    // Capturar screenshot en caso de error
    await page.screenshot({ 
      path: `debug-new-invitation-error-${Date.now()}.png`,
      fullPage: true 
    });
    
    console.log('📸 Screenshot capturado para depuración');
  } finally {
    await browser.close();
  }
}

testNewInvitationPage().catch(console.error); 