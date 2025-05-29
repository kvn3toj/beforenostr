const { chromium } = require('playwright');

async function testSimpleDebug() {
  console.log('🔍 Iniciando test simple de debug...');
  
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Capturar todos los mensajes de consola
  const consoleMessages = [];
  page.on('console', msg => {
    const type = msg.type();
    const text = msg.text();
    consoleMessages.push({ type, text });
    console.log(`🔍 [${type.toUpperCase()}] ${text}`);
  });

  // Capturar errores de red
  const networkErrors = [];
  page.on('response', response => {
    if (!response.ok() && !response.url().includes('/@vite/')) {
      networkErrors.push({
        url: response.url(),
        status: response.status(),
        statusText: response.statusText()
      });
      console.log(`❌ [NETWORK ERROR] ${response.status()} ${response.url()}`);
    }
  });

  try {
    console.log('\n🏠 Navegando a página principal...');
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    console.log('\n🌍 Navegando a página de Mundos...');
    await page.goto('http://localhost:3000/mundos');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(5000); // Esperar más tiempo para React Query

    console.log('\n🎵 Navegando a página de Playlists...');
    await page.goto('http://localhost:3000/playlists');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(5000); // Esperar más tiempo para React Query

    console.log('\n📊 Resumen de errores capturados:');
    console.log(`Total mensajes de consola: ${consoleMessages.length}`);
    console.log(`Total errores de red: ${networkErrors.length}`);

    // Mostrar errores específicos
    const errors = consoleMessages.filter(msg => msg.type === 'error');
    const warnings = consoleMessages.filter(msg => msg.type === 'warning');

    if (errors.length > 0) {
      console.log('\n❌ ERRORES:');
      errors.forEach((error, index) => {
        console.log(`${index + 1}. ${error.text}`);
      });
    }

    if (warnings.length > 0) {
      console.log('\n⚠️ WARNINGS:');
      warnings.forEach((warning, index) => {
        console.log(`${index + 1}. ${warning.text}`);
      });
    }

    if (networkErrors.length > 0) {
      console.log('\n🌐 ERRORES DE RED:');
      networkErrors.forEach((error, index) => {
        console.log(`${index + 1}. ${error.status} ${error.url}`);
      });
    }

    // Verificar si hay datos en las tablas
    console.log('\n🔍 Verificando contenido de las páginas...');
    
    await page.goto('http://localhost:3000/mundos');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    const mundosTableRows = await page.locator('table tbody tr').count();
    console.log(`📊 Filas en tabla de mundos: ${mundosTableRows}`);

    // Verificar si hay elementos de loading
    const loadingElements = await page.locator('[data-testid*="loading"], .MuiCircularProgress-root, [role="progressbar"]').count();
    console.log(`⏳ Elementos de loading en mundos: ${loadingElements}`);

    await page.goto('http://localhost:3000/playlists');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    const playlistsTableRows = await page.locator('table tbody tr').count();
    console.log(`📊 Filas en tabla de playlists: ${playlistsTableRows}`);

    const playlistsLoadingElements = await page.locator('[data-testid*="loading"], .MuiCircularProgress-root, [role="progressbar"]').count();
    console.log(`⏳ Elementos de loading en playlists: ${playlistsLoadingElements}`);

    // Tomar screenshots para debug
    await page.goto('http://localhost:3000/mundos');
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'debug-mundos-connection.png', fullPage: true });
    console.log('📸 Screenshot de mundos guardado: debug-mundos-connection.png');

    await page.goto('http://localhost:3000/playlists');
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'debug-playlists-connection.png', fullPage: true });
    console.log('📸 Screenshot de playlists guardado: debug-playlists-connection.png');

  } catch (error) {
    console.error('❌ Error durante el test:', error.message);
  } finally {
    await browser.close();
  }
}

testSimpleDebug(); 