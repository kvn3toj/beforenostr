const { chromium } = require('playwright');

(async () => {
  console.log('🚀 Testing admin login in frontend...\n');
  
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    // Ir a la página de login
    console.log('📄 Navigating to login page...');
    await page.goto('http://localhost:3000/login');
    await page.waitForLoadState('networkidle');
    
    // Llenar las credenciales
    console.log('🔐 Filling login credentials...');
    await page.fill('input[name="email"]', 'admin@gamifier.com');
    await page.fill('input[name="password"]', 'admin123');
    
    // Hacer click en login
    console.log('👆 Clicking login button...');
    await page.click('button[type="submit"]');
    
    // Esperar la redirección o respuesta
    console.log('⏳ Waiting for login response...');
    await page.waitForTimeout(3000);
    
    // Verificar si hubo redirección exitosa
    const currentUrl = page.url();
    console.log('📍 Current URL:', currentUrl);
    
    if (currentUrl.includes('/login')) {
      console.log('❌ Still on login page - login might have failed');
      
      // Buscar mensajes de error
      const errorMessage = await page.locator('text=/error|invalid|incorrect/i').first().textContent().catch(() => null);
      if (errorMessage) {
        console.log('🔴 Error message found:', errorMessage);
      }
    } else {
      console.log('✅ Redirected from login page - login appears successful!');
      
      // Buscar elementos que confirmen que estamos logueados
      const userInfo = await page.locator('text=/admin|usuario|user/i').first().textContent().catch(() => null);
      if (userInfo) {
        console.log('👤 User info found:', userInfo);
      }
    }
    
    await page.waitForTimeout(5000); // Pausa para observar
    
  } catch (error) {
    console.error('❌ Error during test:', error.message);
  }
  
  await browser.close();
  console.log('\n✅ Admin login test completed.');
})(); 