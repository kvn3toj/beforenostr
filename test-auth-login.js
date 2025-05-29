const { chromium } = require('playwright');

async function testWithAuth() {
  console.log('🔐 Iniciando test con autenticación...');
  
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Capturar mensajes de consola importantes
  page.on('console', msg => {
    const text = msg.text();
    if (text.includes('[AuthStore]') || text.includes('[AuthService]') || text.includes('[Mundos]') || text.includes('[Playlists]')) {
      console.log(`📝 ${msg.type().toUpperCase()}: ${text}`);
    }
  });

  try {
    console.log('\n🔐 Navegando directamente a página de login...');
    await page.goto('http://localhost:3000/login');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Verificar que estamos en la página de login
    const emailField = await page.locator('#email').isVisible();
    if (!emailField) {
      console.log('❌ No se encontró el campo de email en la página de login');
      return;
    }

    console.log('✅ Página de login cargada correctamente');

    console.log('\n🔐 Realizando login con credenciales mock...');
    
    // Usar las credenciales válidas del mock
    await page.fill('#email', 'admin@coomunity.co');
    await page.fill('#password', '123456');
    
    console.log('📝 Credenciales ingresadas, haciendo clic en submit...');
    await page.click('button[type="submit"]');
    
    // Esperar a que el login se complete
    await page.waitForTimeout(5000);
    
    // Verificar que el login fue exitoso
    const currentUrl = page.url();
    console.log(`📍 URL después del login: ${currentUrl}`);
    
    if (currentUrl.includes('/login')) {
      console.log('❌ Login falló, aún en página de login');
      
      // Verificar si hay mensajes de error
      const errorMessage = await page.locator('[role="alert"]').textContent().catch(() => null);
      if (errorMessage) {
        console.log(`❌ Error mostrado: ${errorMessage}`);
      }
      return;
    } else {
      console.log('✅ Login exitoso, redirigido a:', currentUrl);
    }

    // Esperar un poco más para que la autenticación se estabilice
    await page.waitForTimeout(3000);

    // Verificar estado de autenticación en localStorage después del login
    const authDataAfterLogin = await page.evaluate(() => {
      return {
        token: localStorage.getItem('auth_token'),
        user: localStorage.getItem('user'),
        hasToken: !!localStorage.getItem('auth_token'),
        hasUser: !!localStorage.getItem('user')
      };
    });
    
    console.log('\n💾 Estado de autenticación después del login:');
    console.log(`Token presente: ${authDataAfterLogin.hasToken}`);
    console.log(`Usuario presente: ${authDataAfterLogin.hasUser}`);
    if (authDataAfterLogin.hasToken) {
      console.log(`Token: ${authDataAfterLogin.token.substring(0, 20)}...`);
    }

    console.log('\n🌍 Navegando a página de Mundos...');
    await page.goto('http://localhost:3000/mundos');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(5000);

    // Verificar contenido de mundos
    const mundosTableRows = await page.locator('table tbody tr').count();
    console.log(`📊 Filas en tabla de mundos: ${mundosTableRows}`);

    // Verificar si hay elementos de loading
    const mundosLoading = await page.locator('[data-testid*="loading"], .MuiCircularProgress-root, [role="progressbar"]').count();
    console.log(`⏳ Elementos de loading en mundos: ${mundosLoading}`);

    // Verificar si hay mensajes de error
    const mundosErrors = await page.locator('[role="alert"], .error').count();
    console.log(`❌ Elementos de error en mundos: ${mundosErrors}`);

    console.log('\n🎵 Navegando a página de Playlists...');
    await page.goto('http://localhost:3000/playlists');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(5000);

    // Verificar contenido de playlists
    const playlistsTableRows = await page.locator('table tbody tr').count();
    console.log(`📊 Filas en tabla de playlists: ${playlistsTableRows}`);

    const playlistsLoading = await page.locator('[data-testid*="loading"], .MuiCircularProgress-root, [role="progressbar"]').count();
    console.log(`⏳ Elementos de loading en playlists: ${playlistsLoading}`);

    const playlistsErrors = await page.locator('[role="alert"], .error').count();
    console.log(`❌ Elementos de error en playlists: ${playlistsErrors}`);

    // Tomar screenshots
    await page.goto('http://localhost:3000/mundos');
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'debug-mundos-auth.png', fullPage: true });
    console.log('📸 Screenshot de mundos con auth: debug-mundos-auth.png');

    await page.goto('http://localhost:3000/playlists');
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'debug-playlists-auth.png', fullPage: true });
    console.log('📸 Screenshot de playlists con auth: debug-playlists-auth.png');

    console.log('\n✅ Test con autenticación completado');

  } catch (error) {
    console.error('❌ Error durante el test:', error.message);
    await page.screenshot({ path: 'debug-auth-error.png' });
  } finally {
    await browser.close();
  }
}

testWithAuth(); 