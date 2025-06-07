const { chromium } = require('playwright');

async function testJWTDebug() {
  console.log('🔐 === DIAGNÓSTICO JWT FRONTEND ===\n');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 1000 
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();

  // Capturar todas las solicitudes de red
  page.on('request', request => {
    if (request.url().includes('localhost:3002')) {
      console.log(`📡 REQUEST: ${request.method()} ${request.url()}`);
      const headers = request.headers();
      if (headers.authorization) {
        console.log(`   🔑 Authorization: ${headers.authorization.substring(0, 50)}...`);
      } else {
        console.log(`   ❌ Sin header Authorization`);
      }
    }
  });

  page.on('response', response => {
    if (response.url().includes('localhost:3002')) {
      console.log(`📨 RESPONSE: ${response.status()} ${response.url()}`);
    }
  });

  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      console.log(`🔴 Console Error: ${msg.text()}`);
    }
  });

  try {
    // 1. IR A LOGIN
    console.log('📍 Navegando a /login...');
    await page.goto('http://localhost:3000/login');
    await page.waitForLoadState('networkidle');
    
    // 2. HACER LOGIN
    console.log('📝 Realizando login...');
    await page.fill('input[name="email"]', 'admin@gamifier.com');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');
    
    // Esperar redirección
    await page.waitForURL('**/');
    await page.waitForTimeout(2000);
    
    // 3. VERIFICAR TOKEN EN LOCALSTORAGE
    console.log('\n🔍 === VERIFICANDO LOCALSTORAGE ===');
    const token = await page.evaluate(() => {
      return localStorage.getItem('auth_token');
    });
    
    const user = await page.evaluate(() => {
      return localStorage.getItem('auth_user');
    });
    
    console.log(`🔑 Token en localStorage: ${token ? 'SÍ EXISTE' : 'NO EXISTE'}`);
    if (token) {
      console.log(`   📏 Longitud token: ${token.length} caracteres`);
      console.log(`   🎯 Inicio token: ${token.substring(0, 50)}...`);
    }
    console.log(`👤 Usuario en localStorage: ${user ? 'SÍ EXISTE' : 'NO EXISTE'}`);
    
    // 4. NAVEGAR A PÁGINA PROTEGIDA
    console.log('\n📋 === NAVEGANDO A PÁGINA PROTEGIDA ===');
    console.log('📍 Navegando a /users...');
    await page.goto('http://localhost:3000/users');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);
    
    // 5. VERIFICAR CONTENIDO DE LA PÁGINA
    const pageContent = await page.textContent('body');
    const hasTable = await page.locator('table, .MuiDataGrid-root').isVisible().catch(() => false);
    const hasErrorMessage = await page.locator('text=/unauthorized|error|401/i').isVisible().catch(() => false);
    
    console.log(`📄 Página cargada: ${pageContent ? 'SÍ' : 'NO'}`);
    console.log(`📊 Tabla visible: ${hasTable ? 'SÍ' : 'NO'}`);
    console.log(`❌ Mensaje de error: ${hasErrorMessage ? 'SÍ' : 'NO'}`);
    console.log(`📏 Contenido length: ${pageContent?.length || 0} caracteres`);
    
    // Screenshot para análisis
    await page.screenshot({ 
      path: 'debug-jwt-test.png',
      fullPage: true 
    });
    
    console.log('\n✅ Test JWT completado - Revisar logs de red arriba');
    
  } catch (error) {
    console.error('❌ Error durante test JWT:', error);
    await page.screenshot({ 
      path: 'debug-jwt-error.png',
      fullPage: true 
    });
  } finally {
    await browser.close();
  }
}

testJWTDebug().catch(console.error); 