const { chromium } = require('playwright');

async function testUsersPage() {
  console.log('🔍 Iniciando verificación de la página de Usuarios...\n');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 1000 // Slow down for better observation
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();

  // Enable console logging
  page.on('console', msg => {
    console.log(`[BROWSER CONSOLE] ${msg.type()}: ${msg.text()}`);
  });

  // Enable network request logging
  page.on('request', request => {
    if (request.url().includes('/users') || request.url().includes('/auth')) {
      console.log(`[NETWORK REQUEST] ${request.method()} ${request.url()}`);
    }
  });

  // Enable network response logging
  page.on('response', response => {
    if (response.url().includes('/users') || response.url().includes('/auth')) {
      console.log(`[NETWORK RESPONSE] ${response.status()} ${response.url()}`);
    }
  });

  try {
    // 1. Navegar a la página principal
    console.log('📍 Navegando a http://localhost:2222...');
    await page.goto('http://localhost:2222');
    await page.waitForLoadState('networkidle');

    // 2. Verificar si estamos en la página de login
    const isLoginPage = await page.locator('input[type="email"]').isVisible();
    
    if (isLoginPage) {
      console.log('🔐 Detectada página de login, iniciando sesión...');
      
      // Login con credenciales de admin
      await page.fill('input[type="email"]', 'admin@coomunity.co');
      await page.fill('input[type="password"]', '123456');
      await page.click('button[type="submit"]');
      
      // Esperar a que se complete el login
      await page.waitForLoadState('networkidle');
      console.log('✅ Login completado');
    }

    // 3. Navegar a la página de usuarios
    console.log('📍 Navegando a la página de Usuarios (/users)...');
    await page.goto('http://localhost:2222/users');
    await page.waitForLoadState('networkidle');

    // 4. Verificar que la página cargó correctamente
    const pageTitle = await page.locator('h1, h2, h3, h4, h5, h6').first().textContent();
    console.log(`📄 Título de la página: "${pageTitle}"`);

    // 5. Verificar si hay errores visibles en la UI
    const errorMessages = await page.locator('[role="alert"], .error, .MuiAlert-root').count();
    if (errorMessages > 0) {
      console.log(`⚠️  Se encontraron ${errorMessages} mensajes de error en la UI`);
      const errorTexts = await page.locator('[role="alert"], .error, .MuiAlert-root').allTextContents();
      errorTexts.forEach((text, index) => {
        console.log(`   Error ${index + 1}: ${text}`);
      });
    } else {
      console.log('✅ No se encontraron mensajes de error visibles en la UI');
    }

    // 6. Verificar si hay una tabla o lista de usuarios
    const hasTable = await page.locator('table, [role="table"]').isVisible();
    const hasDataTable = await page.locator('[data-testid*="table"], .MuiDataGrid-root').isVisible();
    const hasUserList = await page.locator('[data-testid*="user"], .user-item').isVisible();

    if (hasTable || hasDataTable || hasUserList) {
      console.log('✅ Se encontró una tabla/lista de usuarios en la página');
      
      // Contar filas de usuarios
      const userRows = await page.locator('tbody tr, [role="row"]:not([role="columnheader"])').count();
      console.log(`📊 Número de filas de usuarios encontradas: ${userRows}`);
      
      if (userRows > 0) {
        // Verificar si hay datos específicos del seeder
        const pageContent = await page.content();
        const hasAdminEmail = pageContent.includes('admin@example.com') || pageContent.includes('admin@coomunity.co');
        const hasUserEmail = pageContent.includes('user@example.com');
        
        console.log(`📧 ¿Contiene admin@example.com o admin@coomunity.co? ${hasAdminEmail}`);
        console.log(`📧 ¿Contiene user@example.com? ${hasUserEmail}`);
        
        if (hasAdminEmail || hasUserEmail) {
          console.log('✅ Se encontraron usuarios del seeder en la página');
        } else {
          console.log('⚠️  No se encontraron usuarios específicos del seeder');
        }
      } else {
        console.log('⚠️  La tabla está vacía - no hay usuarios mostrados');
      }
    } else {
      console.log('❌ No se encontró tabla/lista de usuarios en la página');
    }

    // 7. Verificar loading states
    const isLoading = await page.locator('[data-testid*="loading"], .loading, .MuiCircularProgress-root').isVisible();
    if (isLoading) {
      console.log('⏳ La página está en estado de carga...');
      await page.waitForTimeout(3000); // Esperar un poco más
    }

    // 8. Verificar si hay botones de acción (crear, editar, etc.)
    const hasCreateButton = await page.locator('button:has-text("Crear"), button:has-text("Nuevo"), button:has-text("Agregar")').isVisible();
    console.log(`🔘 ¿Hay botón de crear usuario? ${hasCreateButton}`);

    // 9. Tomar screenshot para documentación
    await page.screenshot({ path: 'debug-users-page-verification.png', fullPage: true });
    console.log('📸 Screenshot guardado como debug-users-page-verification.png');

    // 10. Verificar peticiones de red específicas
    console.log('\n🌐 Resumen de peticiones de red relevantes:');
    console.log('   (Ver logs de [NETWORK REQUEST] y [NETWORK RESPONSE] arriba)');

    console.log('\n✅ Verificación de la página de Usuarios completada');

  } catch (error) {
    console.error('❌ Error durante la verificación:', error);
    await page.screenshot({ path: 'debug-users-page-error.png', fullPage: true });
    console.log('📸 Screenshot de error guardado como debug-users-page-error.png');
  } finally {
    await browser.close();
  }
}

// Ejecutar la verificación
testUsersPage().catch(console.error); 