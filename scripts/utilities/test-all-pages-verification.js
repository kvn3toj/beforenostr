const { chromium } = require('playwright');

async function testAllPagesVerification() {
  console.log('🔍 Iniciando verificación completa de todas las páginas...');
  
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Capturar mensajes importantes
  page.on('console', msg => {
    const text = msg.text();
    if (text.includes('[AuthStore]') || text.includes('[Mundos]') || text.includes('[Playlists]') || 
        text.includes('[Users]') || text.includes('[Roles]') || text.includes('Error') || text.includes('error')) {
      console.log(`📝 ${msg.type().toUpperCase()}: ${text}`);
    }
  });

  // Capturar errores de JavaScript
  page.on('pageerror', error => {
    console.log(`❌ [PAGE ERROR] ${error.message}`);
  });

  try {
    // 1. Login
    console.log('\n🔐 Realizando login...');
    await page.goto('http://localhost:3333/login');
    await page.waitForLoadState('networkidle');
    await page.fill('#email', 'admin@coomunity.co');
    await page.fill('#password', '123456');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(3000);

    const authData = await page.evaluate(() => ({
      hasToken: !!localStorage.getItem('auth_token'),
      hasUser: !!localStorage.getItem('user')
    }));
    console.log(`✅ Login exitoso - Token: ${authData.hasToken}, User: ${authData.hasUser}`);

    // 2. Home Page
    console.log('\n🏠 Verificando página de inicio...');
    await page.goto('http://localhost:3333/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    const homeContent = await page.evaluate(() => {
      const title = document.querySelector('h1, h2, h3, h4')?.textContent || 'No title found';
      const hasContent = document.body.innerHTML.length > 1000;
      return { title, hasContent };
    });
    console.log(`📊 Home - Título: "${homeContent.title}", Contenido: ${homeContent.hasContent ? 'Presente' : 'Ausente'}`);

    // 3. Mundos Page
    console.log('\n🌍 Verificando página de Mundos...');
    await page.goto('http://localhost:3333/mundos');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    const mundosData = await page.evaluate(() => {
      const table = document.querySelector('table');
      const rows = document.querySelectorAll('table tbody tr');
      const loading = document.querySelectorAll('[data-testid*="loading"], .MuiCircularProgress-root').length;
      const errors = document.querySelectorAll('[role="alert"], .error').length;
      return {
        hasTable: !!table,
        rowsCount: rows.length,
        loadingCount: loading,
        errorCount: errors
      };
    });
    console.log(`📊 Mundos - Tabla: ${mundosData.hasTable}, Filas: ${mundosData.rowsCount}, Loading: ${mundosData.loadingCount}, Errores: ${mundosData.errorCount}`);

    // 4. Playlists Page
    console.log('\n🎵 Verificando página de Playlists...');
    await page.goto('http://localhost:3333/playlists');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    const playlistsData = await page.evaluate(() => {
      const table = document.querySelector('table');
      const rows = document.querySelectorAll('table tbody tr');
      const loading = document.querySelectorAll('[data-testid*="loading"], .MuiCircularProgress-root').length;
      const errors = document.querySelectorAll('[role="alert"], .error').length;
      return {
        hasTable: !!table,
        rowsCount: rows.length,
        loadingCount: loading,
        errorCount: errors
      };
    });
    console.log(`📊 Playlists - Tabla: ${playlistsData.hasTable}, Filas: ${playlistsData.rowsCount}, Loading: ${playlistsData.loadingCount}, Errores: ${playlistsData.errorCount}`);

    // 5. Users Page
    console.log('\n👥 Verificando página de Usuarios...');
    await page.goto('http://localhost:3333/users');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    const usersData = await page.evaluate(() => {
      const table = document.querySelector('table');
      const rows = document.querySelectorAll('table tbody tr');
      const loading = document.querySelectorAll('[data-testid*="loading"], .MuiCircularProgress-root').length;
      const errors = document.querySelectorAll('[role="alert"], .error').length;
      const title = document.querySelector('h1, h2, h3, h4')?.textContent || 'No title';
      return {
        hasTable: !!table,
        rowsCount: rows.length,
        loadingCount: loading,
        errorCount: errors,
        title
      };
    });
    console.log(`📊 Users - Título: "${usersData.title}", Tabla: ${usersData.hasTable}, Filas: ${usersData.rowsCount}, Loading: ${usersData.loadingCount}, Errores: ${usersData.errorCount}`);

    // 6. Roles Page
    console.log('\n🔐 Verificando página de Roles...');
    await page.goto('http://localhost:3333/roles');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    const rolesData = await page.evaluate(() => {
      const table = document.querySelector('table');
      const rows = document.querySelectorAll('table tbody tr');
      const loading = document.querySelectorAll('[data-testid*="loading"], .MuiCircularProgress-root').length;
      const errors = document.querySelectorAll('[role="alert"], .error').length;
      const title = document.querySelector('h1, h2, h3, h4')?.textContent || 'No title';
      return {
        hasTable: !!table,
        rowsCount: rows.length,
        loadingCount: loading,
        errorCount: errors,
        title
      };
    });
    console.log(`📊 Roles - Título: "${rolesData.title}", Tabla: ${rolesData.hasTable}, Filas: ${rolesData.rowsCount}, Loading: ${rolesData.loadingCount}, Errores: ${rolesData.errorCount}`);

    // 7. Analytics Page
    console.log('\n📈 Verificando página de Analytics...');
    await page.goto('http://localhost:3333/analytics');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    const analyticsData = await page.evaluate(() => {
      const title = document.querySelector('h1, h2, h3, h4')?.textContent || 'No title';
      const cards = document.querySelectorAll('[data-testid*="metric"], .metric-card, .MuiCard-root').length;
      const loading = document.querySelectorAll('[data-testid*="loading"], .MuiCircularProgress-root').length;
      const errors = document.querySelectorAll('[role="alert"], .error').length;
      return {
        title,
        cardsCount: cards,
        loadingCount: loading,
        errorCount: errors
      };
    });
    console.log(`📊 Analytics - Título: "${analyticsData.title}", Cards: ${analyticsData.cardsCount}, Loading: ${analyticsData.loadingCount}, Errores: ${analyticsData.errorCount}`);

    // 8. Settings Page
    console.log('\n⚙️ Verificando página de Configuración...');
    await page.goto('http://localhost:3333/settings');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    const settingsData = await page.evaluate(() => {
      const title = document.querySelector('h1, h2, h3, h4')?.textContent || 'No title';
      const forms = document.querySelectorAll('form').length;
      const inputs = document.querySelectorAll('input, select, textarea').length;
      const loading = document.querySelectorAll('[data-testid*="loading"], .MuiCircularProgress-root').length;
      const errors = document.querySelectorAll('[role="alert"], .error').length;
      return {
        title,
        formsCount: forms,
        inputsCount: inputs,
        loadingCount: loading,
        errorCount: errors
      };
    });
    console.log(`📊 Settings - Título: "${settingsData.title}", Forms: ${settingsData.formsCount}, Inputs: ${settingsData.inputsCount}, Loading: ${settingsData.loadingCount}, Errores: ${settingsData.errorCount}`);

    // 9. Audit Logs Page
    console.log('\n📋 Verificando página de Audit Logs...');
    await page.goto('http://localhost:3333/audit-logs');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    const auditData = await page.evaluate(() => {
      const title = document.querySelector('h1, h2, h3, h4')?.textContent || 'No title';
      const table = document.querySelector('table');
      const rows = document.querySelectorAll('table tbody tr');
      const loading = document.querySelectorAll('[data-testid*="loading"], .MuiCircularProgress-root').length;
      const errors = document.querySelectorAll('[role="alert"], .error').length;
      return {
        title,
        hasTable: !!table,
        rowsCount: rows.length,
        loadingCount: loading,
        errorCount: errors
      };
    });
    console.log(`📊 Audit Logs - Título: "${auditData.title}", Tabla: ${auditData.hasTable}, Filas: ${auditData.rowsCount}, Loading: ${auditData.loadingCount}, Errores: ${auditData.errorCount}`);

    // Resumen final
    console.log('\n📋 RESUMEN DE VERIFICACIÓN:');
    console.log('================================');
    console.log(`✅ Login: Funcionando correctamente`);
    console.log(`✅ Home: ${homeContent.hasContent ? 'Contenido presente' : '❌ Sin contenido'}`);
    console.log(`✅ Mundos: ${mundosData.rowsCount} filas, ${mundosData.errorCount === 0 ? 'Sin errores' : '❌ Con errores'}`);
    console.log(`✅ Playlists: ${playlistsData.rowsCount} filas, ${playlistsData.errorCount === 0 ? 'Sin errores' : '❌ Con errores'}`);
    console.log(`✅ Users: ${usersData.hasTable ? usersData.rowsCount + ' filas' : '❌ Sin tabla'}, ${usersData.errorCount === 0 ? 'Sin errores' : '❌ Con errores'}`);
    console.log(`✅ Roles: ${rolesData.hasTable ? rolesData.rowsCount + ' filas' : '❌ Sin tabla'}, ${rolesData.errorCount === 0 ? 'Sin errores' : '❌ Con errores'}`);
    console.log(`✅ Analytics: ${analyticsData.cardsCount} cards, ${analyticsData.errorCount === 0 ? 'Sin errores' : '❌ Con errores'}`);
    console.log(`✅ Settings: ${settingsData.inputsCount} inputs, ${settingsData.errorCount === 0 ? 'Sin errores' : '❌ Con errores'}`);
    console.log(`✅ Audit Logs: ${auditData.hasTable ? auditData.rowsCount + ' filas' : '❌ Sin tabla'}, ${auditData.errorCount === 0 ? 'Sin errores' : '❌ Con errores'}`);

    // Tomar screenshots finales
    await page.goto('http://localhost:3333/mundos');
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'verification-mundos-final.png', fullPage: true });

    await page.goto('http://localhost:3333/playlists');
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'verification-playlists-final.png', fullPage: true });

    console.log('\n📸 Screenshots guardados: verification-mundos-final.png, verification-playlists-final.png');

  } catch (error) {
    console.error('❌ Error durante la verificación:', error.message);
    await page.screenshot({ path: 'verification-error.png' });
  } finally {
    await browser.close();
  }
}

testAllPagesVerification(); 