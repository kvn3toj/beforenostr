const { chromium } = require('playwright');

async function testReactQueryDebug() {
  console.log('🔍 Iniciando test de debug de React Query...');
  
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Capturar TODOS los mensajes de consola
  const allMessages = [];
  page.on('console', msg => {
    const text = msg.text();
    const type = msg.type();
    allMessages.push({ type, text });
    console.log(`📝 [${type.toUpperCase()}] ${text}`);
  });

  // Capturar errores de JavaScript
  page.on('pageerror', error => {
    console.log(`❌ [PAGE ERROR] ${error.message}`);
    console.log(`Stack: ${error.stack}`);
  });

  try {
    // Login primero
    console.log('\n🔐 Realizando login...');
    await page.goto('http://localhost:3000/login');
    await page.waitForLoadState('networkidle');
    await page.fill('#email', 'admin@coomunity.co');
    await page.fill('#password', '123456');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(3000);

    console.log('\n🌍 Navegando a página de Mundos...');
    await page.goto('http://localhost:3000/mundos');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(5000);

    // Verificar el estado de React Query
    const reactQueryState = await page.evaluate(() => {
      // Intentar acceder al estado de React Query
      const queryClient = window.__REACT_QUERY_CLIENT__;
      if (queryClient) {
        const cache = queryClient.getQueryCache();
        const queries = cache.getAll();
        return {
          hasQueryClient: true,
          queriesCount: queries.length,
          queries: queries.map(q => ({
            queryKey: q.queryKey,
            state: q.state.status,
            data: q.state.data ? 'present' : 'null',
            error: q.state.error ? q.state.error.message : null
          }))
        };
      }
      return { hasQueryClient: false };
    });

    console.log('\n📊 Estado de React Query:', JSON.stringify(reactQueryState, null, 2));

    // Verificar si hay elementos en el DOM
    const tableInfo = await page.evaluate(() => {
      const table = document.querySelector('table');
      const tbody = document.querySelector('table tbody');
      const rows = document.querySelectorAll('table tbody tr');
      const loadingElements = document.querySelectorAll('[data-testid*="loading"], .MuiCircularProgress-root, [role="progressbar"]');
      const errorElements = document.querySelectorAll('[role="alert"], .error');
      
      return {
        hasTable: !!table,
        hasTbody: !!tbody,
        rowsCount: rows.length,
        loadingCount: loadingElements.length,
        errorCount: errorElements.length,
        tableHTML: table ? table.outerHTML.substring(0, 500) + '...' : 'No table found'
      };
    });

    console.log('\n🔍 Información del DOM:', JSON.stringify(tableInfo, null, 2));

    // Verificar si los componentes React están montados
    const reactInfo = await page.evaluate(() => {
      const reactRoot = document.querySelector('#root');
      const hasReactDevTools = !!window.__REACT_DEVTOOLS_GLOBAL_HOOK__;
      
      return {
        hasReactRoot: !!reactRoot,
        reactRootContent: reactRoot ? reactRoot.innerHTML.substring(0, 200) + '...' : 'No root found',
        hasReactDevTools,
        reactVersion: window.React ? window.React.version : 'Not found'
      };
    });

    console.log('\n⚛️ Información de React:', JSON.stringify(reactInfo, null, 2));

    // Tomar screenshot para análisis visual
    await page.screenshot({ path: 'debug-react-query-mundos.png', fullPage: true });
    console.log('📸 Screenshot guardado: debug-react-query-mundos.png');

    // Repetir para playlists
    console.log('\n🎵 Navegando a página de Playlists...');
    await page.goto('http://localhost:3000/playlists');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(5000);

    const playlistsTableInfo = await page.evaluate(() => {
      const table = document.querySelector('table');
      const tbody = document.querySelector('table tbody');
      const rows = document.querySelectorAll('table tbody tr');
      
      return {
        hasTable: !!table,
        hasTbody: !!tbody,
        rowsCount: rows.length,
        tableHTML: table ? table.outerHTML.substring(0, 500) + '...' : 'No table found'
      };
    });

    console.log('\n🎵 Información del DOM de Playlists:', JSON.stringify(playlistsTableInfo, null, 2));

    await page.screenshot({ path: 'debug-react-query-playlists.png', fullPage: true });
    console.log('📸 Screenshot de playlists guardado: debug-react-query-playlists.png');

    // Resumen de mensajes de consola
    console.log('\n📋 Resumen de mensajes de consola:');
    const messagesByType = allMessages.reduce((acc, msg) => {
      acc[msg.type] = (acc[msg.type] || 0) + 1;
      return acc;
    }, {});
    console.log('Mensajes por tipo:', messagesByType);

    const errors = allMessages.filter(msg => msg.type === 'error');
    if (errors.length > 0) {
      console.log('\n❌ Errores encontrados:');
      errors.forEach((error, index) => {
        console.log(`${index + 1}. ${error.text}`);
      });
    }

  } catch (error) {
    console.error('❌ Error durante el test:', error.message);
    await page.screenshot({ path: 'debug-react-query-error.png' });
  } finally {
    await browser.close();
  }
}

testReactQueryDebug(); 