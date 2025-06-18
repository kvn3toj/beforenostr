const { chromium } = require('playwright');

async function testDesignSystemSimple() {
  console.log('🎨 Test simple del Design System...\n');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 2000 
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    console.log('1. 🔗 Navegando a la página de login...');
    await page.goto('http://localhost:3333/login');
    await page.waitForLoadState('networkidle');
    
    console.log('2. 📸 Tomando screenshot del login con Design System...');
    await page.screenshot({ 
      path: `design-system-login-${Date.now()}.png`,
      fullPage: true 
    });
    
    console.log('3. 🔍 Verificando elementos del Design System...');
    
    // Verificar que existen los campos de input
    const emailExists = await page.locator('input[name="email"]').count() > 0;
    const passwordExists = await page.locator('input[name="password"]').count() > 0;
    const buttonExists = await page.locator('button[type="submit"]').count() > 0;
    
    console.log(`✅ Email field: ${emailExists ? 'Encontrado' : 'No encontrado'}`);
    console.log(`✅ Password field: ${passwordExists ? 'Encontrado' : 'No encontrado'}`);
    console.log(`✅ Submit button: ${buttonExists ? 'Encontrado' : 'No encontrado'}`);
    
    // Intentar navegar a users para verificar otros componentes
    console.log('\n4. 🏠 Navegando a página principal...');
    await page.goto('http://localhost:3333/');
    await page.waitForLoadState('networkidle');
    
    await page.screenshot({ 
      path: `design-system-home-${Date.now()}.png`,
      fullPage: true 
    });
    
    console.log('\n🎉 Test completado exitosamente!');
    console.log('📸 Screenshots guardados para inspección visual');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    await page.screenshot({ 
      path: `design-system-error-${Date.now()}.png`,
      fullPage: true 
    });
  } finally {
    await browser.close();
  }
}

testDesignSystemSimple().catch(console.error); 