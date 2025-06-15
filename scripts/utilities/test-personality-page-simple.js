const { chromium } = require('playwright');

async function testPersonalityPageSimple() {
  console.log('🎯 Test simple de página de personalidades...\n');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 2000 
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Ir directamente a la página sin login para ver si carga
    console.log('📋 Navegando directamente a personalidades...');
    await page.goto('http://localhost:3000/personalities');
    await page.waitForLoadState('networkidle');
    
    // Verificar si nos redirige al login
    const currentUrl = page.url();
    console.log(`📍 URL actual: ${currentUrl}`);
    
    if (currentUrl.includes('/login')) {
      console.log('🔐 Necesita login, procediendo...');
      
      // Hacer login
      await page.fill('input[name="email"]', 'admin@gamifier.com');
      await page.fill('input[name="password"]', 'admin123');
      await page.click('button[type="submit"]');
      await page.waitForURL('**/');
      
      // Volver a navegar a personalidades
      await page.goto('http://localhost:3000/personalities');
      await page.waitForLoadState('networkidle');
    }
    
    // Verificar que estamos en personalidades
    const finalUrl = page.url();
    console.log(`📍 URL final: ${finalUrl}`);
    
    // Buscar elementos de la página
    const title = await page.textContent('h4, h1, h2, h3, h5, h6').catch(() => 'Título no encontrado');
    console.log(`📄 Título de página: ${title}`);
    
    // Capturar screenshot
    await page.screenshot({ 
      path: `debug-personality-simple-${Date.now()}.png`,
      fullPage: true 
    });
    
    console.log('✅ Screenshot capturado');
    console.log('✅ Test simple completado');

  } catch (error) {
    console.error('❌ Error:', error.message);
    await page.screenshot({ 
      path: `debug-personality-error-simple-${Date.now()}.png`,
      fullPage: true 
    });
  } finally {
    await browser.close();
  }
}

testPersonalityPageSimple().catch(console.error); 