const { chromium } = require('playwright');

async function testAdminMenu() {
  console.log('🚀 Iniciando test del menú de administración...');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 1000 
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    // Navegar a la página de login
    console.log('📍 Navegando a login...');
    await page.goto('http://localhost:3000/login');
    await page.waitForLoadState('networkidle');
    
    // Realizar login
    console.log('🔐 Realizando login...');
    await page.fill('input[name="email"]', 'admin@coomunity.co');
    await page.fill('input[name="password"]', '123456');
    await page.click('button[type="submit"]');
    
    // Esperar redirección
    console.log('⏳ Esperando redirección...');
    await page.waitForURL('http://localhost:3000/', { timeout: 10000 });
    await page.waitForLoadState('networkidle');
    
    console.log('✅ Login exitoso, URL actual:', page.url());
    
    // Esperar un poco más para que el authStore se actualice
    await page.waitForTimeout(3000);
    
    // Verificar el estado del authStore
    const authData = await page.evaluate(() => {
      const stored = localStorage.getItem('auth-store');
      console.log('LocalStorage auth-store:', stored);
      return stored ? JSON.parse(stored) : null;
    });
    
    console.log('\n=== ESTADO DEL AUTH STORE ===');
    if (authData && authData.state && authData.state.user) {
      const user = authData.state.user;
      console.log('👤 Usuario:', user.name);
      console.log('📧 Email:', user.email);
      console.log('🎭 Roles:', user.roles);
      console.log('🔑 Permisos:', user.permissions ? user.permissions.slice(0, 5) + '...' : 'No definidos');
      console.log('👑 ¿Es Admin?:', user.roles && user.roles.includes('admin'));
    } else {
      console.log('❌ No se encontró información del usuario en authStore');
      console.log('📋 Contenido completo del localStorage:', authData);
    }
    
    // Verificar si hay algún token o información de sesión
    const allLocalStorage = await page.evaluate(() => {
      const items = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        items[key] = localStorage.getItem(key);
      }
      return items;
    });
    console.log('🗄️ Todo el localStorage:', Object.keys(allLocalStorage));
    
    // Verificar auth_user específicamente
    const authUser = await page.evaluate(() => {
      const authUserData = localStorage.getItem('auth_user');
      return authUserData ? JSON.parse(authUserData) : null;
    });
    
    console.log('\n=== INFORMACIÓN DEL AUTH_USER ===');
    if (authUser) {
      console.log('👤 Usuario:', authUser.name);
      console.log('📧 Email:', authUser.email);
      console.log('🎭 Roles:', authUser.roles);
      console.log('🔑 Permisos:', authUser.permissions ? authUser.permissions.slice(0, 5) + '...' : 'No definidos');
      console.log('👑 ¿Es Admin?:', authUser.roles && authUser.roles.includes('admin'));
    } else {
      console.log('❌ No se encontró auth_user');
    }
    
    // Buscar el menú lateral
    console.log('\n🔍 Buscando menú lateral...');
    const sidebar = page.locator('[role="navigation"], .MuiDrawer-root, nav').first();
    
    if (await sidebar.isVisible()) {
      console.log('✅ Menú lateral encontrado');
    } else {
      console.log('❌ Menú lateral no visible');
    }
    
    // Buscar sección de Administración con selector más específico
    console.log('\n🔍 Buscando sección de Administración...');
    
    // Usar el primer elemento de Administration
    const adminSection = page.locator('text=Administration').first();
    
    if (await adminSection.isVisible()) {
      console.log('✅ Sección de Administración encontrada');
      
      // Hacer clic en la sección de Administración
      console.log('🖱️ Haciendo clic en Administración...');
      await adminSection.click();
      await page.waitForTimeout(2000);
      
      // Verificar elementos del menú expandido
      console.log('\n🔍 Verificando elementos del menú de administración...');
      const expectedItems = [
        'Users', 'Usuarios',
        'Roles', 
        'Permissions', 'Permisos',
        'Items', // Content Items se llama simplemente "Items"
        'Configuration', 'Configuración',
        'Audit Logs', 'Logs de Auditoría',
        'System Status', 'Estado del Sistema'
      ];
      
      for (const item of expectedItems) {
        const element = page.locator(`text=${item}`).first();
        if (await element.isVisible()) {
          console.log(`✅ Encontrado: ${item}`);
        } else {
          console.log(`❌ No encontrado: ${item}`);
        }
      }
      
      // Listar todos los elementos visibles en el menú expandido
      console.log('\n📋 Todos los elementos visibles en el menú de administración:');
      const adminMenuTexts = await page.locator('nav [role="button"]').allTextContents();
      adminMenuTexts.forEach((text, index) => {
        if (text.trim()) {
          console.log(`  ${index + 1}. "${text.trim()}"`);
        }
      });
    } else {
      console.log('❌ Sección de Administración no encontrada');
      
      // Listar todos los elementos de texto visibles en el menú
      console.log('\n📋 Elementos visibles en el menú:');
      const menuTexts = await page.locator('nav *').allTextContents();
      menuTexts.forEach((text, index) => {
        if (text.trim()) {
          console.log(`  ${index + 1}. "${text.trim()}"`);
        }
      });
    }
    
    // Tomar screenshot
    console.log('\n📸 Tomando screenshot...');
    await page.screenshot({ 
      path: 'debug-admin-menu-test.png',
      fullPage: true 
    });
    console.log('✅ Screenshot guardado como debug-admin-menu-test.png');
    
  } catch (error) {
    console.error('❌ Error durante el test:', error.message);
    await page.screenshot({ path: 'debug-error.png' });
  } finally {
    await browser.close();
    console.log('\n🏁 Test completado');
  }
}

// Ejecutar el test
testAdminMenu().catch(console.error); 