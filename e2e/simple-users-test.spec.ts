const { chromium } = require('playwright');

async function simpleUsersTest() {
  console.log('🎯 Test simple de usuarios...\n');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 2000 
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // 1. Ir directamente a la página principal (sin login por ahora)
    console.log('🏠 Navegando a la página principal...');
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    
    console.log('✅ Página principal cargada');
    console.log('URL actual:', page.url());

    // 2. Verificar si hay un formulario de login
    const loginForm = await page.locator('form').count();
    console.log(`Formularios encontrados: ${loginForm}`);

    // 3. Buscar campos de email y password
    const emailInput = await page.locator('input[name="email"], input[type="email"]').count();
    const passwordInput = await page.locator('input[name="password"], input[type="password"]').count();
    
    console.log(`Campos de email: ${emailInput}`);
    console.log(`Campos de password: ${passwordInput}`);

    if (emailInput > 0 && passwordInput > 0) {
      console.log('🔐 Intentando login...');
      
      await page.fill('input[name="email"], input[type="email"]', 'admin@gamifier.com');
      await page.fill('input[name="password"], input[type="password"]', 'admin123');
      
      // Buscar botón de submit
      const submitButton = page.locator('button[type="submit"], button:has-text("Login"), button:has-text("Iniciar")');
      const submitCount = await submitButton.count();
      console.log(`Botones de submit: ${submitCount}`);
      
      if (submitCount > 0) {
        await submitButton.first().click();
        console.log('✅ Botón de login clickeado');
        
        // Esperar un poco
        await page.waitForTimeout(3000);
        console.log('URL después del login:', page.url());
      }
    }

    // 4. Intentar navegar a usuarios
    console.log('📋 Navegando a usuarios...');
    await page.goto('http://localhost:3000/users');
    await page.waitForLoadState('networkidle');
    
    console.log('URL de usuarios:', page.url());
    
    // 5. Verificar contenido de la página
    const pageContent = await page.textContent('body');
    console.log('Contenido de la página (primeros 500 chars):', pageContent.substring(0, 500));

    // 6. Buscar tabla
    const tables = await page.locator('table').count();
    console.log(`Tablas encontradas: ${tables}`);

    if (tables > 0) {
      const tableContent = await page.locator('table').textContent();
      console.log('Contenido de la tabla:', tableContent.substring(0, 300));
    }

    console.log('\n🎉 Test simple completado');

  } catch (error) {
    console.error('❌ Error:', error.message);
    
    // Capturar screenshot
    await page.screenshot({ 
      path: `debug-simple-${Date.now()}.png`,
      fullPage: true 
    });
  } finally {
    await browser.close();
  }
}

simpleUsersTest().catch(console.error); 