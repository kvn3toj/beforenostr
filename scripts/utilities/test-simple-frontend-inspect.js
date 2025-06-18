const { chromium } = require('playwright');

async function inspectFrontend() {
  console.log('🔍 Inspeccionando el estado actual del frontend Gamifier...\n');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 2000 
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Configurar listeners para errores
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log('🔴 CONSOLE ERROR:', msg.text());
      }
    });

    page.on('response', response => {
      if (!response.ok()) {
        console.log('🔴 NETWORK ERROR:', response.status(), response.url());
      }
    });

    // 🔒 PROTOCOLO @puertoyflujo: NAVEGAR PRIMERO A /login
    console.log('🔒 Navegando a página de login: http://localhost:3333/login...');
    await page.goto('http://localhost:3333/login');
    await page.waitForLoadState('networkidle');

    // Tomar screenshot de la página de login
    await page.screenshot({ path: 'debug-login-page.png', fullPage: true });
    console.log('📸 Screenshot de login guardado: debug-login-page.png');

    // Obtener el título de la página
    const title = await page.title();
    console.log('📄 Título de la página:', title);

    // Buscar elementos de login en la página correcta
    const emailInputs = await page.locator('input[type="email"], input[name="email"]').count();
    const passwordInputs = await page.locator('input[type="password"], input[name="password"]').count();
    const loginButtons = await page.locator('button[type="submit"], button:has-text("Login"), button:has-text("Iniciar")').count();
    
    console.log('🔐 Elementos de login encontrados en /login:');
    console.log('  - Email inputs:', emailInputs);
    console.log('  - Password inputs:', passwordInputs);
    console.log('  - Login buttons:', loginButtons);

    if (emailInputs > 0 && passwordInputs > 0 && loginButtons > 0) {
      console.log('✅ Página de login detectada correctamente!');
      console.log('🔑 Procediendo con el login...');

      // Realizar login siguiendo el protocolo
      const emailField = page.locator('input[type="email"], input[name="email"]').first();
      const passwordField = page.locator('input[type="password"], input[name="password"]').first();
      const submitButton = page.locator('button[type="submit"], button:has-text("Login"), button:has-text("Iniciar")').first();

      await emailField.fill('admin@gamifier.com');
      await passwordField.fill('admin123');
      await submitButton.click();

      console.log('🔄 Login enviado, esperando redirección...');
      await page.waitForLoadState('networkidle');

      // Tomar screenshot después del login
      await page.screenshot({ path: 'debug-after-login.png', fullPage: true });
      console.log('📸 Screenshot después del login: debug-after-login.png');

      // Verificar si estamos en el dashboard
      const currentUrl = page.url();
      console.log('🌐 URL actual después del login:', currentUrl);

      // Buscar elementos del dashboard/admin
      const dashboardElements = await page.locator('text="Dashboard", text="Admin", text="Items", text="Videos", text="Playlists", text="Users", text="Usuarios"').count();
      console.log('📊 Elementos de dashboard encontrados:', dashboardElements);

      if (dashboardElements > 0) {
        console.log('✅ Login exitoso - Dashboard detectado!');
        
        // Ahora intentar navegar a Items
        console.log('\n🔄 Intentando navegar a sección de Items...');
        
        const itemsLink = page.locator('text="Items", text="Content", text="Videos"').first();
        
        if (await itemsLink.isVisible()) {
          await itemsLink.click();
          await page.waitForLoadState('networkidle');
          
          await page.screenshot({ path: 'debug-items-page-structure.png', fullPage: true });
          console.log('📸 Screenshot de página de items: debug-items-page-structure.png');
          
          // Buscar errores específicos de content items
          const contentError = await page.locator('text="Error loading content items"').isVisible();
          const cannotGetError = await page.locator(':text("Cannot GET")').isVisible();
          const testRouteError = await page.locator(':text("/content/items/test")').isVisible();
          
          console.log('🔍 Errores específicos encontrados:');
          console.log('  - "Error loading content items":', contentError);
          console.log('  - "Cannot GET":', cannotGetError);
          console.log('  - "/content/items/test":', testRouteError);
          
          if (contentError || cannotGetError || testRouteError) {
            console.log('❌ CONFIRMADO: Error de content items detectado!');
            console.log('🔧 El frontend está intentando llamar a una ruta incorrecta');
            console.log('📡 Backend correcto: GET /video-items');
            console.log('📡 Frontend actual: GET /content/items/test (INCORRECTO)');
          } else {
            console.log('✅ No se detectaron errores específicos de content items');
          }
        } else {
          console.log('⚠️  No se encontró enlace directo a Items/Content');
          
          // Intentar navegación directa a /items
          console.log('🔄 Intentando navegación directa a /items...');
          await page.goto('http://localhost:3333/items');
          await page.waitForLoadState('networkidle');
          
          await page.screenshot({ path: 'debug-items-direct-navigation.png', fullPage: true });
          console.log('📸 Screenshot de navegación directa: debug-items-direct-navigation.png');
          
          // Verificar errores después de navegación directa
          const contentError = await page.locator('text="Error loading content items"').isVisible();
          const cannotGetError = await page.locator(':text("Cannot GET")').isVisible();
          const testRouteError = await page.locator(':text("/content/items/test")').isVisible();
          
          console.log('🔍 Errores después de navegación directa:');
          console.log('  - "Error loading content items":', contentError);
          console.log('  - "Cannot GET":', cannotGetError);
          console.log('  - "/content/items/test":', testRouteError);
          
          if (contentError || cannotGetError || testRouteError) {
            console.log('❌ CONFIRMADO: Error de content items detectado!');
            console.log('🔧 El frontend está intentando llamar a una ruta incorrecta');
            console.log('📡 Backend correcto: GET /video-items');
            console.log('📡 Frontend actual: GET /content/items/test (INCORRECTO)');
          }
        }
      } else {
        console.log('⚠️  Login posiblemente falló - no se detectaron elementos de dashboard');
      }
    } else {
      console.log('❌ No se encontraron elementos de login en /login');
      console.log('📝 Contenido de la página:');
      const bodyText = await page.locator('body').textContent();
      console.log(bodyText?.substring(0, 500) || 'No text content found');
    }

    console.log('\n✅ Inspección completada. Revisa los screenshots para más detalles.');

  } catch (error) {
    console.error('❌ Error durante la inspección:', error);
    await page.screenshot({ 
      path: `debug-error-inspection-${Date.now()}.png`,
      fullPage: true 
    });
  } finally {
    await browser.close();
  }
}

inspectFrontend().catch(console.error); 