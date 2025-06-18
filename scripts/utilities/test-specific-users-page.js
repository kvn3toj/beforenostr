const { chromium } = require('playwright');

async function testUsersPageSpecific() {
  console.log('👥 === ANÁLISIS ESPECÍFICO PÁGINA USERS ===\n');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 1000 
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();

  // Capturar todas las solicitudes de red
  page.on('request', request => {
    if (request.url().includes('localhost:1111')) {
      console.log(`📡 REQUEST: ${request.method()} ${request.url()}`);
    }
  });

  page.on('response', response => {
    if (response.url().includes('localhost:1111')) {
      console.log(`📨 RESPONSE: ${response.status()} ${response.url()}`);
      if (response.status() !== 200) {
        console.log(`   ❌ Status Code: ${response.status()}`);
      }
    }
  });

  page.on('console', (msg) => {
    console.log(`🖥️ Console [${msg.type()}]: ${msg.text()}`);
  });

  try {
    // 1. LOGIN
    console.log('📍 Navegando a /login...');
    await page.goto('http://localhost:3333/login');
    await page.waitForLoadState('networkidle');
    
    await page.fill('input[name="email"]', 'admin@gamifier.com');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/');
    await page.waitForTimeout(2000);
    
    console.log('✅ Login completado');
    
    // 2. NAVEGAR A USERS
    console.log('\n📍 Navegando a /users...');
    await page.goto('http://localhost:3333/users');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(5000); // Dar más tiempo
    
    console.log('\n🔍 === ANÁLISIS DETALLADO DE LA PÁGINA ===');
    
    // 3. ANÁLISIS DETALLADO
    const pageTitle = await page.title();
    console.log(`📄 Título de página: "${pageTitle}"`);
    
    // Verificar elementos paso a paso
    const h1Elements = await page.locator('h1').count();
    const h2Elements = await page.locator('h2').count();
    const tableElements = await page.locator('table').count();
    const dataGridElements = await page.locator('.MuiDataGrid-root').count();
    const buttonElements = await page.locator('button').count();
    const rowElements = await page.locator('table tbody tr, .MuiDataGrid-row').count();
    
    console.log(`📊 Elementos encontrados:`);
    console.log(`   - H1: ${h1Elements}`);
    console.log(`   - H2: ${h2Elements}`);
    console.log(`   - Tables: ${tableElements}`);
    console.log(`   - DataGrids: ${dataGridElements}`);
    console.log(`   - Buttons: ${buttonElements}`);
    console.log(`   - Rows: ${rowElements}`);
    
    // Verificar texto específico
    const bodyText = await page.textContent('body');
    const hasUsersText = bodyText.includes('Users') || bodyText.includes('usuarios');
    const hasAdminText = bodyText.includes('admin@gamifier.com');
    const hasEmailText = bodyText.includes('Email') || bodyText.includes('@');
    const hasCreateButton = bodyText.toLowerCase().includes('create') || bodyText.toLowerCase().includes('crear');
    
    console.log(`📝 Contenido de texto:`);
    console.log(`   - Menciona "Users": ${hasUsersText}`);
    console.log(`   - Menciona admin email: ${hasAdminText}`);
    console.log(`   - Menciona Email: ${hasEmailText}`);
    console.log(`   - Botón crear: ${hasCreateButton}`);
    console.log(`   - Longitud total: ${bodyText.length} caracteres`);
    
    // Verificar estados de carga
    const loadingElements = await page.locator('[role="progressbar"], .loading, .spinner, .MuiCircularProgress-root').count();
    const errorElements = await page.locator('text=/error|401|unauthorized/i').count();
    const emptyElements = await page.locator('text=/no data|empty|sin datos/i').count();
    
    console.log(`⏳ Estados de la página:`);
    console.log(`   - Elementos de carga: ${loadingElements}`);
    console.log(`   - Mensajes de error: ${errorElements}`);
    console.log(`   - Mensajes vacíos: ${emptyElements}`);
    
    // Esperar un poco más y volver a verificar
    console.log('\n⏳ Esperando datos adicionales...');
    await page.waitForTimeout(3000);
    
    const finalRowCount = await page.locator('table tbody tr, .MuiDataGrid-row').count();
    const finalDataGrids = await page.locator('.MuiDataGrid-root').count();
    
    console.log(`📊 Estado final:`);
    console.log(`   - Filas finales: ${finalRowCount}`);
    console.log(`   - DataGrids finales: ${finalDataGrids}`);
    
    // Intentar encontrar datos específicos
    if (finalRowCount > 0) {
      console.log('\n✅ DATOS ENCONTRADOS - Analizando contenido...');
      const firstRowText = await page.locator('table tbody tr, .MuiDataGrid-row').first().textContent();
      console.log(`   Primera fila: "${firstRowText}"`);
    } else {
      console.log('\n❌ NO SE ENCONTRARON FILAS DE DATOS');
      
      // Verificar si hay paginación o filtros
      const paginationElements = await page.locator('.MuiPagination-root, .pagination').count();
      const filterElements = await page.locator('input[placeholder*="search"], input[placeholder*="filter"]').count();
      
      console.log(`   - Paginación: ${paginationElements}`);
      console.log(`   - Filtros: ${filterElements}`);
    }
    
    // Screenshot para análisis visual
    await page.screenshot({ 
      path: 'debug-users-page-analysis.png',
      fullPage: true 
    });
    
    console.log('\n✅ Análisis completado - Screenshot guardado');
    
  } catch (error) {
    console.error('❌ Error durante análisis:', error);
    await page.screenshot({ 
      path: 'debug-users-page-error.png',
      fullPage: true 
    });
  } finally {
    await browser.close();
  }
}

testUsersPageSpecific().catch(console.error); 