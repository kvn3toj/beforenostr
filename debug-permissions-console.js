const { chromium } = require('playwright');

async function debugPermissionsConsole() {
  console.log('🔍 Debug: Verificando logs de consola en página de permisos');
  
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  // Capturar logs de consola
  page.on('console', msg => {
    console.log(`🖥️ [${msg.type()}] ${msg.text()}`);
  });
  
  try {
    await page.goto('http://localhost:3000/login');
    await page.fill('input[name="email"]', 'admin@gamifier.com');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/');
    await page.waitForTimeout(2000);
    
    console.log('\n📄 Navegando a página de permisos...');
    await page.goto('http://localhost:3000/permissions');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    console.log('\n📄 Navegando a página de roles...');
    await page.goto('http://localhost:3000/roles');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    console.log('\n✅ Debug completado');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await browser.close();
  }
}

debugPermissionsConsole().catch(console.error); 