// Test simple para verificar funciones de admin
const { chromium } = require('playwright');

async function testAdminLoginAndNavigation() {
  console.log('🚀 Probando login del administrador en el navegador...');
  console.log('='.repeat(60));

  const browser = await chromium.launch({ 
    headless: false, // Mantener el navegador visible
    slowMo: 1000 // Ralentizar para mejor visualización
  });
  
  const page = await browser.newPage();

  try {
    // Configurar listeners para errores
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log('🚨 Console Error:', msg.text());
      }
    });
    
    page.on('pageerror', error => {
      console.log('🚨 Page Error:', error.message);
    });

    console.log('📄 Navegando a la página de login...');
    await page.goto('http://localhost:3001/login');
    await page.waitForLoadState('networkidle');

    // Verificar que estamos en la página de login
    console.log('🔍 Verificando elementos de login...');
    
    // Buscar campos de login
    const emailField = page.locator('input[name="email"], input[type="email"]');
    const passwordField = page.locator('input[name="password"], input[type="password"]');
    const loginButton = page.locator('button[type="submit"], button:has-text("Login"), button:has-text("Iniciar")');

    await emailField.waitFor({ state: 'visible', timeout: 10000 });
    await passwordField.waitFor({ state: 'visible', timeout: 10000 });
    await loginButton.waitFor({ state: 'visible', timeout: 10000 });

    console.log('✅ Campos de login encontrados');

    // Llenar credenciales
    console.log('🔐 Llenando credenciales del administrador...');
    await emailField.fill('admin@gamifier.com');
    await passwordField.fill('admin123');

    console.log('👆 Haciendo clic en el botón de login...');
    await loginButton.click();

    // Esperar la respuesta del login
    console.log('⏳ Esperando respuesta del login...');
    await page.waitForTimeout(3000);

    // Verificar redirección
    const currentUrl = page.url();
    console.log('📍 URL actual:', currentUrl);

    if (currentUrl.includes('/login')) {
      console.log('⚠️ Aún en la página de login, buscando mensajes de error...');
      
      // Buscar mensajes de error
      const errorElements = page.locator('text=/error|invalid|incorrect|wrong/i');
      const errorCount = await errorElements.count();
      
      if (errorCount > 0) {
        for (let i = 0; i < errorCount; i++) {
          const errorText = await errorElements.nth(i).textContent();
          console.log('🔴 Mensaje de error:', errorText);
        }
      } else {
        console.log('🤔 No se encontraron mensajes de error visibles');
      }
    } else {
      console.log('✅ ¡Redirección exitosa! Login completado');
      
      // Buscar elementos que confirmen que estamos logueados
      console.log('🔍 Buscando elementos del dashboard...');
      
      // Esperar un poco más para que cargue el dashboard
      await page.waitForTimeout(2000);
      
      // Buscar texto de admin o dashboard
      const dashboardElements = [
        'text=/admin|administrator|dashboard|panel/i',
        'text=/bienvenido|welcome/i',
        '[data-testid*="admin"], [id*="admin"], [class*="admin"]',
        'nav, header, .header, .navigation'
      ];
      
      for (const selector of dashboardElements) {
        try {
          const element = page.locator(selector);
          const count = await element.count();
          if (count > 0) {
            const text = await element.first().textContent();
            console.log(`✅ Elemento encontrado (${selector}):`, text?.substring(0, 100) || 'Sin texto');
          }
        } catch (error) {
          // Continuar con el siguiente selector
        }
      }
    }

    // Mantener el navegador abierto por un tiempo para inspección
    console.log('⏸️ Manteniendo navegador abierto por 10 segundos para inspección...');
    await page.waitForTimeout(10000);

  } catch (error) {
    console.error('❌ Error durante la prueba:', error.message);
    
    // Tomar screenshot en caso de error
    try {
      await page.screenshot({ path: 'debug-admin-login-verification.png', fullPage: true });
      console.log('📸 Screenshot guardado como debug-admin-login-verification.png');
    } catch (screenshotError) {
      console.log('❌ No se pudo guardar el screenshot');
    }
  }

  await browser.close();
  console.log('✅ Prueba de login completada');
}

testAdminLoginAndNavigation().catch(console.error); 