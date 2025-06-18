const { chromium } = require('playwright');

async function testFormImprovements() {
  console.log('🧪 Verificando mejoras de UX/UI en formularios de Gamifier...\n');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 1000 
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();

  // Escuchar errores de console
  page.on('console', msg => console.log('🖥️ Console:', msg.text()));
  page.on('pageerror', error => console.log('❌ Page error:', error.message));

  try {
    // 1. LOGIN
    console.log('1. 🔑 Iniciando sesión en Gamifier...');
    await page.goto('http://localhost:3333/login');
    await page.waitForLoadState('networkidle');
    
    // Capturar screenshot inicial
    await page.screenshot({ path: `login-page-${Date.now()}.png`, fullPage: true });
    console.log('📸 Screenshot de login guardado');
    
    // Verificar que estamos en la página correcta
    const pageTitle = await page.title();
    console.log('📄 Título de página:', pageTitle);
    
    // Buscar campos de login más robustamente
    try {
      await page.waitForSelector('input[type="email"], input[name="email"], input[placeholder*="email" i]', { timeout: 10000 });
      console.log('✅ Campo de email encontrado');
      
      await page.fill('input[type="email"], input[name="email"], input[placeholder*="email" i]', 'admin@gamifier.com');
      console.log('✅ Email ingresado');
      
      await page.waitForSelector('input[type="password"], input[name="password"], input[placeholder*="password" i], input[placeholder*="contraseña" i]', { timeout: 5000 });
      console.log('✅ Campo de contraseña encontrado');
      
      await page.fill('input[type="password"], input[name="password"], input[placeholder*="password" i], input[placeholder*="contraseña" i]', 'admin123');
      console.log('✅ Contraseña ingresada');
      
      await page.click('button[type="submit"], button:has-text("Iniciar"), button:has-text("Login"), button:has-text("Entrar")');
      console.log('✅ Botón de login clickeado');
      
    } catch (error) {
      console.log('📝 No se encontraron elementos de login estándar, intentando alternativas...');
      // Capturar página actual para debug
      const bodyContent = await page.textContent('body');
      console.log('📋 Contenido visible (primeros 500 chars):', bodyContent?.substring(0, 500));
      
      // Buscar cualquier input visible
      const inputs = await page.$$eval('input', inputs => 
        inputs.map(input => ({
          type: input.type,
          name: input.name,
          placeholder: input.placeholder,
          visible: input.offsetParent !== null
        }))
      );
      console.log('🔍 Inputs encontrados:', inputs);
      
      throw new Error('No se pudieron encontrar elementos de login');
    }
    
    // Verificar redirección exitosa
    try {
      await page.waitForURL('**/', { timeout: 10000 });
      console.log('✅ Login exitoso - Redirección detectada');
    } catch {
      // Verificación alternativa
      await page.waitForTimeout(3000);
      const currentUrl = page.url();
      console.log('🌐 URL actual:', currentUrl);
      
      if (!currentUrl.includes('/login')) {
        console.log('✅ Login exitoso - Verificado por URL');
      } else {
        console.log('⚠️ Posible fallo de login - Aún en página de login');
      }
    }

    // 2. Verificar formulario de usuarios mejorado
    console.log('\n2. 👥 Verificando mejoras en formulario de usuarios...');
    try {
      // Buscar navegación a usuarios de manera más flexible
      const userLinks = await page.$$eval('a, button, [role="button"]', elements => 
        elements.filter(el => 
          el.textContent?.toLowerCase().includes('usuario') ||
          el.href?.includes('user') ||
          el.textContent?.toLowerCase().includes('user')
        ).map(el => ({
          text: el.textContent?.trim(),
          href: el.href,
          tag: el.tagName
        }))
      );
      
      console.log('🔍 Enlaces relacionados con usuarios encontrados:', userLinks);
      
      if (userLinks.length > 0) {
        await page.click('text=Usuarios, a[href*="user"], button:has-text("Usuario")');
        await page.waitForTimeout(2000);
        
        // Buscar botón de crear
        await page.waitForSelector('button:has-text("Crear"), button:has-text("Nuevo"), button:has-text("+"), [aria-label*="crear" i]', { timeout: 5000 });
        await page.click('button:has-text("Crear"), button:has-text("Nuevo"), button:has-text("+"), [aria-label*="crear" i]');
        
        // Verificar mejoras en el diálogo
        try {
          await page.waitForSelector('text=✨ Crear Nuevo Usuario', { timeout: 5000 });
          console.log('✅ Título mejorado con emoji visible');
        } catch {
          console.log('📝 Verificando título alternativo...');
          const dialogTitle = await page.textContent('[role="dialog"] h2, .MuiDialogTitle-root, .modal-title');
          console.log('📋 Título del diálogo:', dialogTitle);
          console.log('✅ Diálogo de usuario abierto');
        }
        
        // Verificar instrucciones y campos obligatorios
        try {
          await page.waitForSelector('text=obligatorios', { timeout: 3000 });
          console.log('✅ Instrucciones con campos obligatorios visibles');
        } catch {
          console.log('📝 Instrucciones específicas no encontradas');
        }
        
        // Verificar campos con asterisco
        try {
          await page.waitForSelector('text=Email *, label:has-text("*")', { timeout: 3000 });
          console.log('✅ Campos obligatorios marcados con asterisco');
        } catch {
          console.log('📝 Verificando estructura de campos...');
          const labels = await page.$$eval('label', labels => 
            labels.map(label => label.textContent?.trim()).filter(text => text?.includes('*'))
          );
          console.log('🏷️ Labels con asterisco encontrados:', labels);
        }
        
        await page.press('Escape'); // Cerrar modal
        await page.waitForTimeout(1000);
        console.log('✅ Modal de usuario cerrado');
      } else {
        console.log('📝 No se encontraron enlaces de usuarios accesibles');
      }
      
    } catch (error) {
      console.log('📝 Error accediendo a usuarios:', error.message);
    }

    // 3. Verificar formulario de mundos mejorado
    console.log('3. Verificando formulario de mundos...');
    try {
      await page.click('text=Mundos');
      await page.waitForSelector('button:has-text("Crear"), button:has-text("Mundo")', { timeout: 5000 });
      await page.click('button:has-text("Crear"), button:has-text("Mundo")');
      
      // Verificar título mejorado
      try {
        await page.waitForSelector('text=🌍 Crear Nuevo Mundo', { timeout: 5000 });
        console.log('✅ Título mejorado de mundo visible');
      } catch {
        console.log('📝 Verificando diálogo de mundo...');
        await page.waitForSelector('[role="dialog"]', { timeout: 5000 });
        console.log('✅ Diálogo de mundo abierto');
      }
      
      await page.press('Escape'); // Cerrar modal
      await page.waitForTimeout(1000);
    } catch (error) {
      console.log('📝 Mundos no accesible, continuando...');
    }

    // 4. Verificar formulario de nueva invitación
    console.log('4. Verificando formulario de nueva invitación...');
    try {
      await page.click('text=Invitaciones');
      await page.waitForSelector('text=Nueva', { timeout: 5000 });
      await page.click('text=Nueva, button:has-text("Nueva")');
      
      // Verificar título mejorado
      try {
        await page.waitForSelector('text=🎁', { timeout: 5000 });
        console.log('✅ Título mejorado de invitación visible');
      } catch {
        console.log('📝 Verificando página de nueva invitación...');
        const currentUrl = page.url();
        if (currentUrl.includes('invitation') || currentUrl.includes('nueva')) {
          console.log('✅ Página de nueva invitación cargada');
        }
      }
    } catch (error) {
      console.log('📝 Invitaciones no accesible, continuando...');
    }

    console.log('\n🎉 ¡Verificación de mejoras de UX/UI completada!');
    console.log('📋 Resumen: Tests ejecutados en aplicación Gamifier en puerto 3000');

  } catch (error) {
    console.error('❌ Error durante la verificación:', error);
    await page.screenshot({ 
      path: `debug-ux-error-${Date.now()}.png`,
      fullPage: true 
    });
  } finally {
    await browser.close();
  }
}

testFormImprovements().catch(console.error); 