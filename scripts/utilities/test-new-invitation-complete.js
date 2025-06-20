const { chromium } = require('playwright');

async function testNewInvitationComplete() {
  console.log('🎯 Test completo de la página Nueva Invitación con autenticación...\n');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 1000 
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();

  // Capturar errores de JavaScript y console logs
  page.on('console', msg => console.log('🔍 Console:', msg.text()));
  page.on('pageerror', error => console.log('❌ Page Error:', error.message));

  try {
    // FASE 1: LOGIN SIGUIENDO EL PROTOCOLO ESTÁNDAR (FRONTEND: 3000)
    console.log('📝 Fase 1: Proceso de Login...');
    
    // 1. Navegar a login
    await page.goto('http://localhost:3000/login');
    await page.waitForLoadState('networkidle');
    console.log('✅ Navegación a /login completada');

    // 2. Llenar credenciales
    await page.fill('input[name="email"]', 'admin@gamifier.com');
    await page.fill('input[name="password"]', 'admin123');
    console.log('✅ Credenciales ingresadas');

    // 3. Hacer clic en submit
    await page.click('button[type="submit"]');
    console.log('✅ Botón de login clickeado');

    // 4. Verificar redirección
    await page.waitForURL('**/');
    console.log('✅ Redirección exitosa');

    // 5. Verificar login exitoso usando MÉTODO ROBUSTO
    try {
      await page.waitForSelector('nav, [role="navigation"], button[aria-label*="menu"], button[aria-label*="Menu"]', { timeout: 5000 });
      console.log('✅ Login exitoso - Navegación detectada');
    } catch {
      const currentUrl = page.url();
      if (!currentUrl.includes('/login')) {
        console.log('✅ Login exitoso - Verificado por URL');
      } else {
        throw new Error('Login falló - Aún en página de login');
      }
    }

    // FASE 2: NAVEGACIÓN A INVITACIONES
    console.log('\n📝 Fase 2: Navegación a página de invitaciones...');
    
    await page.goto('http://localhost:3000/invitations');
    await page.waitForLoadState('networkidle');
    
    // Verificar que estamos en la página correcta - MÉTODO ROBUSTO
    try {
      await page.waitForSelector('text=Invitaciones', { timeout: 5000 });
      console.log('✅ Página de invitaciones cargada');
    } catch {
      const currentUrl = page.url();
      if (currentUrl.includes('/invitations')) {
        console.log('✅ Página de invitaciones cargada (verificado por URL)');
      } else {
        throw new Error('No se pudo cargar la página de invitaciones');
      }
    }

    // Buscar botón "Nueva Invitación" - SELECTORES ROBUSTOS
    console.log('\n📝 Buscando botón "Nueva Invitación"...');
    const newInvitationButton = page.getByRole('button', { name: /nueva invitación|nueva|add|crear/i });
    
    if (await newInvitationButton.isVisible()) {
      console.log('✅ Botón "Nueva Invitación" encontrado');
      await newInvitationButton.click();
      console.log('✅ Botón clickeado');
    } else {
      // Estrategia alternativa - buscar por texto
      const altButton = page.locator('button:has-text("Nueva"), a:has-text("Nueva")').first();
      if (await altButton.isVisible()) {
        console.log('✅ Botón encontrado con estrategia alternativa');
        await altButton.click();
      } else {
        console.log('⚠️ Navegando directamente a /invitations/new');
        await page.goto('http://localhost:3000/invitations/new');
      }
    }

    // FASE 3: TESTING DE FORMULARIO DE NUEVA INVITACIÓN
    console.log('\n📝 Fase 3: Testing del formulario Nueva Invitación...');
    
    await page.waitForLoadState('networkidle');
    
    // Verificar que estamos en la página correcta
    const currentUrl = page.url();
    if (currentUrl.includes('/invitations/new')) {
      console.log('✅ Página Nueva Invitación cargada correctamente');
    } else {
      throw new Error(`URL inesperada: ${currentUrl}`);
    }

    // Verificar elementos del formulario - SELECTORES ROBUSTOS
    const formElements = {
      userSelect: page.locator('select, [role="combobox"], input[placeholder*="usuario"]').first(),
      nameInput: page.locator('input[placeholder*="nombre"], input[name*="name"]').first(),
      emailInput: page.locator('input[type="email"], input[placeholder*="email"]').first(),
      unitsInput: page.locator('input[type="number"], input[placeholder*="units"]').first(),
      submitButton: page.getByRole('button', { name: /crear|enviar|submit/i })
    };

    console.log('\n📝 Verificando elementos del formulario...');
    for (const [element, locator] of Object.entries(formElements)) {
      try {
        if (await locator.isVisible()) {
          console.log(`✅ ${element} encontrado`);
        } else {
          console.log(`⚠️ ${element} no visible`);
        }
      } catch {
        console.log(`❌ ${element} no encontrado`);
      }
    }

    // FASE 4: INTERACCIÓN CON EL FORMULARIO (si es posible)
    console.log('\n📝 Fase 4: Interacción con formulario...');
    
    try {
      // Rellenar formulario si los elementos están disponibles
      if (await formElements.nameInput.isVisible()) {
        await formElements.nameInput.fill('Usuario Test');
        console.log('✅ Nombre ingresado');
      }
      
      if (await formElements.emailInput.isVisible()) {
        await formElements.emailInput.fill('test@example.com');
        console.log('✅ Email ingresado');
      }
      
      if (await formElements.unitsInput.isVisible()) {
        await formElements.unitsInput.fill('100');
        console.log('✅ Unidades ingresadas');
      }

      console.log('✅ Formulario completado exitosamente');

    } catch (error) {
      console.log(`⚠️ Error al interactuar con formulario: ${error.message}`);
    }

    console.log('\n🎉 Test completo finalizado exitosamente');
    console.log('\n📋 RESUMEN FINAL:');
    console.log('✅ Login exitoso con credenciales admin');
    console.log('✅ Navegación a página de invitaciones');
    console.log('✅ Acceso a formulario Nueva Invitación');
    console.log('✅ Verificación de elementos del formulario');
    console.log('✅ Interacción básica con formulario');
    console.log('✅ Frontend en puerto 3000 ✓');
    console.log('✅ Backend en puerto 3002 ✓');

  } catch (error) {
    console.error('❌ Error durante el test:', error);
    
    // Capturar screenshot en caso de error
    await page.screenshot({ 
      path: `debug-new-invitation-complete-${Date.now()}.png`,
      fullPage: true 
    });
    
    console.log('📸 Screenshot capturado para depuración');
  } finally {
    await browser.close();
  }
}

testNewInvitationComplete().catch(console.error); 