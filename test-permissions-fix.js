const { chromium } = require('playwright');

async function testPermissionsFix() {
  console.log('🧪 Test: Verificación de permisos después del fix');
  console.log('============================================\n');
  
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    // 1. Ir a la página de login
    console.log('📍 1. Navegando a login...');
    await page.goto('http://localhost:3000/login');
    await page.waitForLoadState('networkidle', { timeout: 10000 });
    
    // 2. Hacer login con las credenciales correctas del admin
    console.log('🔐 2. Haciendo login...');
    await page.fill('input[name="email"]', 'admin@gamifier.com');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');
    
    // 3. Esperar redirección a home
    console.log('⏳ 3. Esperando redirección...');
    await page.waitForURL('**/');
    await page.waitForTimeout(2000);
    
    // 4. Verificar datos del usuario en localStorage
    console.log('📊 4. Verificando datos del usuario...');
    const userData = await page.evaluate(() => {
      const user = localStorage.getItem('auth_user');
      return user ? JSON.parse(user) : null;
    });
    
    if (userData) {
      console.log('✅ Usuario encontrado:');
      console.log(`   📧 Email: ${userData.email}`);
      console.log(`   👤 Nombre: ${userData.name}`);
      console.log(`   🎭 Roles: ${JSON.stringify(userData.roles)}`);
      console.log(`   🔑 Permisos: ${userData.permissions ? userData.permissions.length : 0} permisos`);
      if (userData.permissions) {
        console.log('   📜 Lista de permisos:');
        userData.permissions.forEach((perm, i) => {
          console.log(`      ${i + 1}. ${perm}`);
        });
      }
    } else {
      console.log('❌ No se encontraron datos del usuario');
    }
    
    // 5. Verificar menú de administración
    console.log('\n🔍 5. Verificando menú de administración...');
    
    // Buscar la sección de administración
    const adminSection = page.locator('text=Administration').first();
    if (await adminSection.isVisible()) {
      console.log('✅ Sección de Administración visible');
      
      // Hacer clic para expandir
      await adminSection.click();
      await page.waitForTimeout(1500);
      
      // Verificar opciones de menú
      const menuOptions = [
        'Users', 'Usuarios',
        'Roles',
        'Permissions', 'Permisos',
        'Items',
        'Configuration', 'Configuración',
        'Audit Logs', 'Logs de Auditoría',
        'System Status', 'Estado del Sistema'
      ];
      
      console.log('📋 Verificando opciones del menú:');
      for (const option of menuOptions) {
        const element = page.locator(`text=${option}`).first();
        if (await element.isVisible()) {
          console.log(`   ✅ ${option}`);
        } else {
          console.log(`   ❌ ${option}`);
        }
      }
      
    } else {
      console.log('❌ Sección de Administración NO visible');
    }
    
    // 6. Verificar página de permisos específicamente
    console.log('\n🔧 6. Verificando página de permisos...');
    await page.goto('http://localhost:3000/permissions');
    await page.waitForLoadState('networkidle');
    
    // Verificar botón "Crear Nuevo Permiso"
    const createButton = page.locator('button:has-text("Crear Nuevo Permiso")').first();
    if (await createButton.isVisible()) {
      const isEnabled = await createButton.isEnabled();
      console.log(`✅ Botón "Crear Nuevo Permiso" visible y ${isEnabled ? 'HABILITADO' : 'DESHABILITADO'}`);
    } else {
      console.log('❌ Botón "Crear Nuevo Permiso" NO encontrado');
    }
    
    // 7. Verificar página de roles
    console.log('\n👥 7. Verificando página de roles...');
    await page.goto('http://localhost:3000/roles');
    await page.waitForLoadState('networkidle');
    
    const createRoleButton = page.locator('button:has-text("Crear Nuevo Rol")').first();
    if (await createRoleButton.isVisible()) {
      const isEnabled = await createRoleButton.isEnabled();
      console.log(`✅ Botón "Crear Nuevo Rol" visible y ${isEnabled ? 'HABILITADO' : 'DESHABILITADO'}`);
    } else {
      console.log('❌ Botón "Crear Nuevo Rol" NO encontrado');
    }
    
    console.log('\n🎉 Test completado!');
    
  } catch (error) {
    console.error('❌ Error durante el test:', error.message);
  } finally {
    await browser.close();
  }
}

testPermissionsFix().catch(console.error); 