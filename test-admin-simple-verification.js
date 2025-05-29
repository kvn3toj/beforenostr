// Test simple para verificar funciones de admin
const { chromium } = require('playwright');

(async () => {
  console.log('🚀 Iniciando test de verificación de admin...');
  
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  // Configurar logs
  page.on('console', (msg) => {
    console.log(`🔍 Console: ${msg.text()}`);
  });
  
  page.on('pageerror', (error) => {
    console.log(`❌ Page Error: ${error.message}`);
  });

  try {
    // Ir a la página de login
    console.log('📱 Navegando a login...');
    await page.goto('http://localhost:3000/login');
    
    // Llenar credenciales de admin
    console.log('🔑 Llenando credenciales...');
    await page.fill('input[name="email"]', 'admin@gamifier.com');
    await page.fill('input[name="password"]', 'admin123');
    
    // Hacer login
    console.log('🔐 Haciendo login...');
    await page.click('button[type="submit"]');
    
    // Esperar la redirección
    await page.waitForURL('**/');
    await page.waitForLoadState('networkidle');
    
    console.log('✅ Login completado, verificando página...');
    
    // Tomar screenshot inicial
    await page.screenshot({ path: 'debug-after-login.png', fullPage: true });
    console.log('📸 Screenshot guardado: debug-after-login.png');
    
    // Verificar que estamos logueados
    const welcomeText = await page.textContent('h1');
    console.log(`📋 Texto de bienvenida: "${welcomeText}"`);
    
    // Verificar los datos del usuario en localStorage
    const userData = await page.evaluate(() => {
      const userStr = localStorage.getItem('auth_user');
      const token = localStorage.getItem('auth_token');
      
      return {
        hasToken: !!token,
        user: userStr ? JSON.parse(userStr) : null
      };
    });
    
    console.log('👤 Datos del usuario:');
    console.log('  - Token presente:', userData.hasToken);
    console.log('  - Usuario:', userData.user?.email);
    console.log('  - Roles:', userData.user?.roles);
    console.log('  - Permisos:', userData.user?.permissions?.slice(0, 3) + '...');
    
    // Buscar elementos de admin en la página
    const adminElements = await page.evaluate(() => {
      const adminButton = document.querySelector('button:has-text("Administration")') || 
                         document.querySelector('*[role="button"]:has-text("Administration")') ||
                         document.querySelector('*:has-text("Administration")');
      
      const allButtons = Array.from(document.querySelectorAll('button')).map(btn => btn.textContent);
      const allLinks = Array.from(document.querySelectorAll('a')).map(link => link.textContent);
      
      return {
        adminButtonFound: !!adminButton,
        adminButtonText: adminButton?.textContent || null,
        allButtons: allButtons.filter(text => text && text.trim()),
        allLinks: allLinks.filter(text => text && text.trim()),
        navigationElements: Array.from(document.querySelectorAll('nav *')).map(el => el.textContent).filter(text => text && text.trim())
      };
    });
    
    console.log('🔍 Elementos encontrados en la página:');
    console.log('  - Botón de admin encontrado:', adminElements.adminButtonFound);
    console.log('  - Texto del botón admin:', adminElements.adminButtonText);
    console.log('  - Botones disponibles:', adminElements.allButtons.slice(0, 10));
    console.log('  - Enlaces disponibles:', adminElements.allLinks.slice(0, 10));
    console.log('  - Elementos de navegación:', adminElements.navigationElements.slice(0, 15));
    
    // Esperar un poco más y verificar de nuevo
    console.log('⏳ Esperando un momento para que la página se estabilice...');
    await page.waitForTimeout(3000);
    
    // Verificar de nuevo después de esperar
    const finalCheck = await page.evaluate(() => {
      const drawer = document.querySelector('[role="navigation"]') || document.querySelector('nav');
      const drawerContent = drawer ? Array.from(drawer.querySelectorAll('*')).map(el => el.textContent).filter(text => text && text.trim()) : [];
      
      return {
        drawerFound: !!drawer,
        drawerContent: drawerContent
      };
    });
    
    console.log('🎯 Verificación final:');
    console.log('  - Drawer encontrado:', finalCheck.drawerFound);
    console.log('  - Contenido del drawer:', finalCheck.drawerContent);
    
    // Tomar screenshot final
    await page.screenshot({ path: 'debug-admin-menu-test.png', fullPage: true });
    console.log('📸 Screenshot final guardado: debug-admin-menu-test.png');
    
    console.log('✨ Test completado');
    
  } catch (error) {
    console.error('❌ Error durante el test:', error);
    await page.screenshot({ path: 'debug-error.png', fullPage: true });
  }
  
  // Mantener el navegador abierto para inspección manual
  console.log('🔄 Manteniendo navegador abierto para inspección manual...');
  console.log('💡 Presiona Ctrl+C cuando termines de revisar');
  
  // Esperar indefinidamente
  await new Promise(() => {});
})(); 