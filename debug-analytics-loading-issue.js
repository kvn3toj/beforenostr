const { chromium } = require('playwright');

async function debugAnalyticsLoadingIssue() {
  console.log('🔍 === DIAGNOSTICANDO PROBLEMA DE CARGA EN ANALYTICS ===\n');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 1000
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();

  // Capturar todos los errores y logs detallados
  const errors = [];
  const networkRequests = [];
  const failedRequests = [];
  
  page.on('console', (msg) => {
    const text = msg.text();
    console.log(`📜 Console [${msg.type()}]: ${text}`);
    
    if (msg.type() === 'error') {
      errors.push(`Console: ${text}`);
    }
    
    // Capturar logs específicos de React Query
    if (text.includes('useQuery') || text.includes('TanStack') || text.includes('react-query')) {
      console.log(`🔧 React Query: ${text}`);
    }
    
    // Capturar logs de API Service
    if (text.includes('[ApiService]')) {
      console.log(`🌐 API Service: ${text}`);
    }
  });
  
  page.on('pageerror', (error) => {
    console.log(`❌ Page Error: ${error.message}`);
    errors.push(`Page: ${error.message}`);
  });

  // Monitorear todas las solicitudes de red
  page.on('request', (request) => {
    if (request.url().includes('localhost:3002') || request.url().includes('analytics')) {
      console.log(`📤 REQUEST: ${request.method()} ${request.url()}`);
      networkRequests.push({
        method: request.method(),
        url: request.url(),
        headers: request.headers(),
        timestamp: new Date().toISOString()
      });
    }
  });

  page.on('response', (response) => {
    if (response.url().includes('localhost:3002') || response.url().includes('analytics')) {
      const status = response.status();
      const statusText = response.statusText();
      console.log(`📥 RESPONSE: ${status} ${statusText} - ${response.url()}`);
      
      if (status >= 400) {
        failedRequests.push({
          url: response.url(),
          status,
          statusText,
          timestamp: new Date().toISOString()
        });
      }
    }
  });

  // Monitor for requests that take too long
  const pendingRequests = new Map();
  
  page.on('request', (request) => {
    if (request.url().includes('analytics')) {
      pendingRequests.set(request.url(), Date.now());
    }
  });
  
  page.on('response', (response) => {
    if (response.url().includes('analytics')) {
      const startTime = pendingRequests.get(response.url());
      if (startTime) {
        const duration = Date.now() - startTime;
        console.log(`⏱️  Request duration: ${duration}ms - ${response.url()}`);
        pendingRequests.delete(response.url());
      }
    }
  });

  try {
    console.log('🔐 Step 1: Iniciando sesión...');
    await page.goto('http://localhost:3000/login');
    await page.waitForLoadState('networkidle');

    await page.fill('input[name="email"]', 'admin@gamifier.com');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/');

    console.log('✅ Login exitoso');

    console.log('\n📊 Step 2: Navegando a Analytics...');
    
    // Navegar a analytics y monitorear comportamiento
    await page.goto('http://localhost:3000/analytics');
    
    console.log('⏳ Esperando que la página cargue (30 segundos max)...');
    
    // Esperar a que aparezcan elementos específicos de analytics o timeout
    try {
      await Promise.race([
        // Esperar a elementos de analytics
        page.waitForSelector('text=Total Usuarios', { timeout: 10000 }),
        page.waitForSelector('[data-testid="analytics-dashboard"]', { timeout: 10000 }),
        page.waitForSelector('.analytics-metrics', { timeout: 10000 }),
        // O cualquier indicador de que terminó de cargar
        page.waitForFunction(() => {
          // Buscar indicadores de que React Query terminó de cargar
          const loadingElements = document.querySelectorAll('[data-testid*="loading"], .loading, .spinner');
          return loadingElements.length === 0;
        }, { timeout: 15000 })
      ]);
      
      console.log('✅ Página de Analytics cargada exitosamente');
      
    } catch (timeoutError) {
      console.log('⚠️  Timeout esperando carga de Analytics');
      console.log('📸 Tomando screenshot para debug...');
      await page.screenshot({ 
        path: `debug-analytics-timeout-${Date.now()}.png`,
        fullPage: true 
      });
    }

    // Verificar estado actual de la página
    console.log('\n🔍 Step 3: Analizando estado de la página...');
    
    const currentUrl = page.url();
    console.log(`📍 URL actual: ${currentUrl}`);
    
    // Verificar elementos visibles
    const visibleElements = await page.evaluate(() => {
      const selectors = [
        'h1, h2, h3',
        '[data-testid*="analytics"]',
        '.analytics',
        '.loading',
        '.spinner',
        '[role="progressbar"]',
        'text=Total',
        'text=Usuarios',
        'text=Playlists',
        'text=Mundos'
      ];
      
      const results = {};
      selectors.forEach(selector => {
        try {
          const elements = document.querySelectorAll(selector);
          results[selector] = elements.length;
        } catch (e) {
          results[selector] = 'error';
        }
      });
      
      return results;
    });
    
    console.log('👁️  Elementos visibles:', visibleElements);

    // Verificar solicitudes pendientes después de 20 segundos
    await page.waitForTimeout(5000);
    
    console.log('\n📊 Step 4: Estado final de solicitudes...');
    console.log(`📤 Total requests realizados: ${networkRequests.length}`);
    console.log(`❌ Requests fallidos: ${failedRequests.length}`);
    console.log(`⏳ Requests aún pendientes: ${pendingRequests.size}`);
    
    if (pendingRequests.size > 0) {
      console.log('🚨 SOLICITUDES PENDIENTES (posible causa del problema):');
      for (const [url, startTime] of pendingRequests.entries()) {
        const elapsed = Date.now() - startTime;
        console.log(`   - ${url} (${elapsed}ms pendiente)`);
      }
    }
    
    if (failedRequests.length > 0) {
      console.log('🚨 SOLICITUDES FALLIDAS:');
      failedRequests.forEach(req => {
        console.log(`   - ${req.status} ${req.statusText}: ${req.url}`);
      });
    }

    // Screenshot final
    await page.screenshot({ 
      path: `debug-analytics-final-state-${Date.now()}.png`,
      fullPage: true 
    });

    console.log('\n📋 RESUMEN:');
    console.log(`🔴 Errores detectados: ${errors.length}`);
    console.log(`📡 Requests totales: ${networkRequests.length}`);
    console.log(`❌ Requests fallidos: ${failedRequests.length}`);
    console.log(`⏳ Requests pendientes: ${pendingRequests.size}`);

    if (errors.length > 0) {
      console.log('\n🚨 ERRORES:');
      errors.forEach((error, index) => {
        console.log(`${index + 1}. ${error}`);
      });
    }

  } catch (error) {
    console.error('❌ Error durante el debug:', error);
    await page.screenshot({ 
      path: `debug-analytics-error-${Date.now()}.png`,
      fullPage: true 
    });
  } finally {
    await browser.close();
  }
}

debugAnalyticsLoadingIssue().catch(console.error); 