const { chromium } = require('playwright');

async function testFrontendLogin() {
  console.log('🔍 Probando login desde el frontend...\n');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 1000 
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Capturar errores de consola
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('❌ Error de consola:', msg.text());
    }
  });

  try {
    console.log('📍 Navegando a la página de login...');
    await page.goto('http://localhost:3333/login');
    await page.waitForLoadState('networkidle');
    
    console.log('📍 Llenando credenciales...');
    await page.fill('input[name="email"]', 'admin@gamifier.com');
    await page.fill('input[name="password"]', 'admin123');
    
    console.log('📍 Haciendo click en login...');
    await page.click('button[type="submit"]');
    
    console.log('📍 Esperando redirección...');
    await page.waitForURL('**/');
    
    console.log('📍 Verificando login exitoso...');
    
    // Verificar que no estamos en la página de login
    const currentUrl = page.url();
    console.log(`🌐 URL actual: ${currentUrl}`);
    
    if (currentUrl.includes('/login')) {
      console.log('❌ Error: Aún estamos en la página de login');
      
      // Verificar si hay mensajes de error
      const errorMessage = await page.locator('[role="alert"], .error-message, .alert-error').textContent().catch(() => null);
      if (errorMessage) {
        console.log('❌ Mensaje de error encontrado:', errorMessage);
      }
      
      // Tomar screenshot para depuración
      await page.screenshot({ 
        path: `debug-login-error-${Date.now()}.png`,
        fullPage: true 
      });
      
    } else {
      console.log('✅ Login exitoso - Redirigido fuera de la página de login');
      
      // Verificar elementos que indican que estamos logueados
      try {
        await page.waitForSelector('nav, [role="navigation"], button[aria-label*="menu"]', { timeout: 5000 });
        console.log('✅ Elementos de navegación detectados');
      } catch {
        console.log('⚠️ No se detectaron elementos de navegación específicos, pero no estamos en login');
      }
      
      // Tomar screenshot del estado exitoso
      await page.screenshot({ 
        path: `debug-login-success-${Date.now()}.png`,
        fullPage: true 
      });
    }
    
    console.log('\n📋 RESUMEN DE LA PRUEBA:');
    console.log('========================');
    console.log(`✅ Página de login cargada: Sí`);
    console.log(`✅ Credenciales ingresadas: Sí`);
    console.log(`✅ Botón de login clickeado: Sí`);
    console.log(`✅ Redirección exitosa: ${!currentUrl.includes('/login') ? 'Sí' : 'No'}`);
    
    if (!currentUrl.includes('/login')) {
      console.log('\n🎉 ¡El login desde el frontend funciona correctamente!');
      console.log('📧 Email: admin@gamifier.com');
      console.log('🔑 Password: admin123');
    } else {
      console.log('\n⚠️ Hay un problema con el login desde el frontend');
    }

  } catch (error) {
    console.error('❌ Error durante la prueba:', error);
    await page.screenshot({ 
      path: `debug-login-test-error-${Date.now()}.png`,
      fullPage: true 
    });
  } finally {
    await browser.close();
  }
}

testFrontendLogin().catch(console.error); 