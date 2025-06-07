const { chromium } = require('playwright');

async function debugRolesPage() {
  console.log('🔍 === DEPURACIÓN ESPECÍFICA DE ROLES PAGE ===\n');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 500 
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();

  // Capturar errores de consola y red
  const consoleErrors = [];
  const networkErrors = [];
  
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
      console.log(`🔴 Console Error: ${msg.text()}`);
    } else if (msg.text().includes('RolesPage')) {
      console.log(`📝 RolesPage Log: ${msg.text()}`);
    }
  });
  
  page.on('requestfailed', (request) => {
    networkErrors.push(`${request.method()} ${request.url()} - ${request.failure()?.errorText}`);
    console.log(`🌐 Network Error: ${request.method()} ${request.url()}`);
  });

  try {
    // 1. LOGIN
    console.log('🔐 Realizando login...');
    await page.goto('http://localhost:3000/login');
    await page.waitForLoadState('networkidle');
    
    await page.fill('input[name="email"]', 'admin@gamifier.com');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');
    
    await page.waitForURL('**/');
    console.log('✅ Login exitoso');

    // 2. NAVEGAR A ROLES
    console.log('\n📋 Navegando a página de Roles...');
    await page.goto('http://localhost:3000/roles');
    await page.waitForLoadState('networkidle');
    
    // Esperar un poco para que carguen los datos
    await page.waitForTimeout(5000);
    
    // 3. VERIFICAR ESTADO DE LA PÁGINA
    console.log('\n🔍 Verificando estado de la página...');
    
    // Verificar si hay loading
    const isLoading = await page.locator('text=/Loading roles|Cargando/i').isVisible().catch(() => false);
    console.log(`📊 Loading state: ${isLoading}`);
    
    // Verificar si hay error
    const hasError = await page.locator('[role="alert"], .MuiAlert-root').isVisible().catch(() => false);
    if (hasError) {
      const errorText = await page.locator('[role="alert"], .MuiAlert-root').textContent();
      console.log(`❌ Error visible: ${errorText}`);
    }
    
    // Verificar si hay tabla
    const hasTable = await page.locator('table, .MuiDataGrid-root, [data-testid*="table"]').isVisible().catch(() => false);
    console.log(`📋 Table present: ${hasTable}`);
    
    // Verificar contenido específico
    const hasTitle = await page.locator('h1, h2, h4').isVisible().catch(() => false);
    console.log(`📝 Title present: ${hasTitle}`);
    
    if (hasTitle) {
      const titleText = await page.locator('h1, h2, h4').first().textContent();
      console.log(`📝 Title text: "${titleText}"`);
    }
    
    // Verificar si hay roles listados
    const roleCount = await page.locator('text=/admin|user|moderator/i').count();
    console.log(`👥 Roles detected: ${roleCount}`);
    
    // Verificar estructura de DataTable
    const dataTableElement = await page.locator('[data-testid*="data-table"], .data-table').isVisible().catch(() => false);
    console.log(`📊 DataTable component: ${dataTableElement}`);
    
    // Verificar mensaje vacío
    const emptyMessage = await page.locator('text=/No hay roles|No roles/i').isVisible().catch(() => false);
    console.log(`📭 Empty message: ${emptyMessage}`);
    
    // 4. VERIFICAR ELEMENTOS UI CLAVE
    console.log('\n🔧 Verificando elementos de UI...');
    
    const hasCreateButton = await page.locator('button:has-text("Crear")').isVisible().catch(() => false);
    console.log(`➕ Create button: ${hasCreateButton}`);
    
    const hasSearchField = await page.locator('input[label*="Buscar"], input[placeholder*="buscar"]').isVisible().catch(() => false);
    console.log(`🔍 Search field: ${hasSearchField}`);
    
    // 5. INSPECCIONAR RED Y DATOS
    console.log('\n🌐 Verificando llamadas de red...');
    
    // Verificar si se están haciendo las llamadas correctas
    const response = await page.waitForResponse(response => 
      response.url().includes('/roles') && response.request().method() === 'GET',
      { timeout: 3000 }
    ).catch(() => null);
    
    if (response) {
      console.log(`✅ API call detected: ${response.status()} ${response.url()}`);
      if (response.ok()) {
        try {
          const data = await response.json();
          console.log(`📊 Data received: ${Array.isArray(data) ? data.length + ' roles' : 'Invalid format'}`);
          if (Array.isArray(data) && data.length > 0) {
            console.log(`📝 First role: ${JSON.stringify(data[0], null, 2).substring(0, 200)}...`);
          }
        } catch (e) {
          console.log(`❌ Error parsing response: ${e.message}`);
        }
      }
    } else {
      console.log('❌ No API call detected within timeout');
    }
    
    // 6. SCREENSHOT PARA ANÁLISIS VISUAL
    await page.screenshot({ 
      path: 'debug-roles-detailed.png',
      fullPage: true 
    });
    
    console.log('\n📊 === RESUMEN DE DEPURACIÓN ===');
    console.log(`Console errors: ${consoleErrors.length}`);
    console.log(`Network errors: ${networkErrors.length}`);
    console.log(`Loading: ${isLoading}`);
    console.log(`Error visible: ${hasError}`);
    console.log(`Table present: ${hasTable}`);
    console.log(`Title present: ${hasTitle}`);
    console.log(`Roles detected: ${roleCount}`);
    
    if (consoleErrors.length > 0) {
      console.log('\n🔴 Console Errors:');
      consoleErrors.forEach((error, i) => console.log(`${i + 1}. ${error}`));
    }
    
    if (networkErrors.length > 0) {
      console.log('\n🌐 Network Errors:');
      networkErrors.forEach((error, i) => console.log(`${i + 1}. ${error}`));
    }
    
    console.log('\n📸 Screenshot saved as: debug-roles-detailed.png');
    
  } catch (error) {
    console.error('❌ Error durante la depuración:', error.message);
    await page.screenshot({ 
      path: `debug-roles-error-${Date.now()}.png`,
      fullPage: true 
    });
  } finally {
    await browser.close();
  }
}

debugRolesPage().catch(console.error); 