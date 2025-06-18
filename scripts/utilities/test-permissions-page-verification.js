const { chromium } = require('playwright');
const fs = require('fs');

async function testPermissionsPage() {
  console.log('🚀 Iniciando verificación de la página de Permisos...');
  
  // Configurar navegador con modo visible
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 1000 // Ralentizar para poder observar
  });
  
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 }
  });
  
  const page = await context.newPage();
  
  // Interceptar peticiones de red para monitorear APIs
  const networkRequests = [];
  page.on('request', request => {
    if (request.url().includes('localhost:1111')) {
      networkRequests.push({
        url: request.url(),
        method: request.method(),
        timestamp: new Date().toISOString()
      });
      console.log(`📡 API Request: ${request.method()} ${request.url()}`);
    }
  });
  
  page.on('response', response => {
    if (response.url().includes('localhost:1111')) {
      console.log(`📡 API Response: ${response.status()} ${response.url()}`);
    }
  });
  
  // Interceptar errores de consola
  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
      console.log(`❌ Console Error: ${msg.text()}`);
    }
  });
  
  try {
    console.log('📍 Paso 1: Navegando al frontend...');
    await page.goto('http://localhost:3333', { waitUntil: 'networkidle' });
    await page.screenshot({ path: 'debug-permissions-step1-homepage.png' });
    
    console.log('📍 Paso 2: Iniciando sesión...');
    // Buscar campos de login
    await page.waitForSelector('input[type="email"], input[name="email"], input[placeholder*="email" i]', { timeout: 10000 });
    
    // Llenar formulario de login
    const emailInput = await page.locator('input[type="email"], input[name="email"], input[placeholder*="email" i]').first();
    const passwordInput = await page.locator('input[type="password"], input[name="password"], input[placeholder*="password" i]').first();
    
    await emailInput.fill('admin@coomunity.co');
    await passwordInput.fill('123456');
    await page.screenshot({ path: 'debug-permissions-step2-login-form.png' });
    
    // Buscar y hacer clic en botón de login
    const loginButton = await page.locator('button:has-text("Iniciar"), button:has-text("Login"), button[type="submit"]').first();
    await loginButton.click();
    
    console.log('📍 Paso 3: Esperando redirección después del login...');
    await page.waitForTimeout(3000);
    await page.screenshot({ path: 'debug-permissions-step3-after-login.png' });
    
    console.log('📍 Paso 4: Navegando a la página de Permisos...');
    // Intentar navegar directamente a /permissions
    await page.goto('http://localhost:3333/permissions', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'debug-permissions-step4-permissions-page.png' });
    
    console.log('📍 Paso 5: Analizando contenido de la página...');
    
    // Verificar si hay errores visibles en la página
    const errorElements = await page.locator('[class*="error"], [class*="Error"], .MuiAlert-standardError').count();
    console.log(`🔍 Elementos de error encontrados: ${errorElements}`);
    
    // Buscar elementos que indiquen permisos
    const permissionElements = await page.locator('text=/permission/i, text=/permiso/i').count();
    console.log(`🔍 Elementos relacionados con permisos: ${permissionElements}`);
    
    // Buscar tablas o listas que puedan contener permisos
    const tableRows = await page.locator('table tr, .MuiTableRow-root, [role="row"]').count();
    console.log(`🔍 Filas de tabla encontradas: ${tableRows}`);
    
    // Buscar texto específico de permisos del seeder
    const specificPermissions = [
      'users:read',
      'users:write', 
      'roles:read',
      'roles:write',
      'roles:manage'
    ];
    
    const foundPermissions = [];
    for (const permission of specificPermissions) {
      const found = await page.locator(`text="${permission}"`).count() > 0;
      if (found) {
        foundPermissions.push(permission);
      }
    }
    
    console.log(`🔍 Permisos específicos encontrados: ${foundPermissions.join(', ')}`);
    
    console.log('📍 Paso 6: Capturando estado final...');
    await page.screenshot({ path: 'debug-permissions-step6-final-state.png' });
    
    // Generar reporte
    const report = {
      timestamp: new Date().toISOString(),
      pageUrl: page.url(),
      networkRequests: networkRequests,
      consoleErrors: consoleErrors,
      uiAnalysis: {
        errorElements: errorElements,
        permissionElements: permissionElements,
        tableRows: tableRows,
        foundSpecificPermissions: foundPermissions
      }
    };
    
    // Guardar reporte
    fs.writeFileSync('permissions-page-report.json', JSON.stringify(report, null, 2));
    
    console.log('\n📊 RESUMEN DE LA VERIFICACIÓN:');
    console.log('=====================================');
    console.log(`🌐 URL final: ${page.url()}`);
    console.log(`📡 Peticiones API realizadas: ${networkRequests.length}`);
    console.log(`❌ Errores de consola: ${consoleErrors.length}`);
    console.log(`🔍 Elementos de error en UI: ${errorElements}`);
    console.log(`📋 Elementos relacionados con permisos: ${permissionElements}`);
    console.log(`📊 Filas de tabla: ${tableRows}`);
    console.log(`✅ Permisos específicos encontrados: ${foundPermissions.length}/5`);
    
    if (networkRequests.length > 0) {
      console.log('\n📡 PETICIONES API DETECTADAS:');
      networkRequests.forEach(req => {
        console.log(`   ${req.method} ${req.url}`);
      });
    }
    
    if (consoleErrors.length > 0) {
      console.log('\n❌ ERRORES DE CONSOLA:');
      consoleErrors.forEach(error => {
        console.log(`   ${error}`);
      });
    }
    
    console.log('\n📸 CAPTURAS GENERADAS:');
    console.log('   - debug-permissions-step1-homepage.png');
    console.log('   - debug-permissions-step2-login-form.png');
    console.log('   - debug-permissions-step3-after-login.png');
    console.log('   - debug-permissions-step4-permissions-page.png');
    console.log('   - debug-permissions-step6-final-state.png');
    console.log('   - permissions-page-report.json');
    
    // Mantener navegador abierto para inspección manual
    console.log('\n⏸️  Navegador permanecerá abierto para inspección manual...');
    console.log('   Presiona Ctrl+C cuando hayas terminado de inspeccionar.');
    
    // Esperar indefinidamente hasta que el usuario termine
    await new Promise(() => {});
    
  } catch (error) {
    console.error('💥 Error durante la verificación:', error);
    await page.screenshot({ path: 'debug-permissions-error.png' });
  } finally {
    // El navegador se cerrará cuando el usuario presione Ctrl+C
  }
}

// Ejecutar el test
testPermissionsPage().catch(console.error); 