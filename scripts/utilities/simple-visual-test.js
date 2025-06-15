const { chromium } = require('playwright');

async function simpleVisualTest() {
  console.log('📸 Prueba visual simple...\n');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 2000 
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    console.log('1. Navegando a la raíz...');
    await page.goto('http://localhost:3000');
    await page.waitForTimeout(3000);
    await page.screenshot({ path: `visual-root-${Date.now()}.png`, fullPage: true });
    console.log('✅ Screenshot de la raíz guardado');
    
    console.log('2. Navegando a /login...');
    await page.goto('http://localhost:3000/login');
    await page.waitForTimeout(3000);
    await page.screenshot({ path: `visual-login-${Date.now()}.png`, fullPage: true });
    console.log('✅ Screenshot de login guardado');
    
    console.log('3. Navegando a /admin...');
    await page.goto('http://localhost:3000/admin');
    await page.waitForTimeout(3000);
    await page.screenshot({ path: `visual-admin-${Date.now()}.png`, fullPage: true });
    console.log('✅ Screenshot de admin guardado');
    
    // Buscar cualquier enlace o botón
    const links = await page.$$eval('a', links => 
      links.map(link => ({ href: link.href, text: link.textContent?.trim() }))
    );
    console.log('Enlaces encontrados:', links.slice(0, 10));

    const allText = await page.textContent('body');
    console.log('Texto visible (primeros 500 chars):', allText?.substring(0, 500));
    
    console.log('\n📋 Revisando los screenshots para ver el estado actual de la aplicación');

  } catch (error) {
    console.error('❌ Error durante la prueba visual:', error);
  } finally {
    await browser.close();
  }
}

simpleVisualTest().catch(console.error); 