const { chromium } = require('playwright');

async function testFrontendBackendConnection() {
  console.log('🚀 Iniciando test de conectividad Frontend-Backend...');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 1000 
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Capturar errores de consola
  const consoleMessages = [];
  const networkErrors = [];
  
  page.on('console', msg => {
    const text = msg.text();
    consoleMessages.push({
      type: msg.type(),
      text: text,
      timestamp: new Date().toISOString()
    });
    
    if (msg.type() === 'error') {
      console.log(`🔴 Console Error: ${text}`);
    } else if (msg.type() === 'warning') {
      console.log(`🟡 Console Warning: ${text}`);
    }
  });
  
  // Capturar errores de red
  page.on('response', response => {
    if (!response.ok()) {
      networkErrors.push({
        url: response.url(),
        status: response.status(),
        statusText: response.statusText(),
        timestamp: new Date().toISOString()
      });
      console.log(`🔴 Network Error: ${response.status()} ${response.statusText()} - ${response.url()}`);
    } else if (response.url().includes('localhost:1111')) {
      console.log(`✅ Backend Response: ${response.status()} - ${response.url()}`);
    }
  });
  
  page.on('requestfailed', request => {
    networkErrors.push({
      url: request.url(),
      failure: request.failure()?.errorText || 'Unknown error',
      timestamp: new Date().toISOString()
    });
    console.log(`🔴 Request Failed: ${request.failure()?.errorText} - ${request.url()}`);
  });
  
  try {
    // Login
    console.log('\n🔐 Realizando login...');
    await page.goto('http://localhost:3333/login');
    await page.waitForLoadState('networkidle');
    
    await page.fill('input[name="email"]', 'admin@coomunity.co');
    await page.fill('input[name="password"]', '123456');
    await page.click('button[type="submit"]');
    
    await page.waitForURL('http://localhost:3333/', { timeout: 10000 });
    await page.waitForLoadState('networkidle');
    console.log('✅ Login exitoso');
    
    // Test 1: Verificar conectividad directa del backend desde el navegador
    console.log('\n🔍 Test 1: Verificando conectividad directa al backend...');
    
    const backendResponse = await page.evaluate(async () => {
      try {
        const response = await fetch('http://localhost:1111/mundos');
        const data = await response.json();
        return {
          success: true,
          status: response.status,
          dataLength: Array.isArray(data) ? data.length : 0,
          data: data
        };
      } catch (error) {
        return {
          success: false,
          error: error.message
        };
      }
    });
    
    if (backendResponse.success) {
      console.log(`✅ Conectividad directa OK - Status: ${backendResponse.status}, Mundos: ${backendResponse.dataLength}`);
      console.log(`📊 Datos recibidos:`, backendResponse.data.slice(0, 2)); // Mostrar primeros 2
    } else {
      console.log(`❌ Error en conectividad directa: ${backendResponse.error}`);
    }
    
    // Test 2: Verificar página de Mundos
    console.log('\n🔍 Test 2: Navegando a página de Mundos...');
    await page.goto('http://localhost:3333/mundos');
    await page.waitForLoadState('networkidle');
    
    // Esperar un poco para que las consultas se ejecuten
    await page.waitForTimeout(5000);
    
    // Verificar si hay datos en la tabla
    const tableData = await page.evaluate(() => {
      const table = document.querySelector('table');
      if (!table) return { hasTable: false };
      
      const rows = table.querySelectorAll('tbody tr');
      const headers = Array.from(table.querySelectorAll('thead th')).map(th => th.textContent?.trim());
      
      return {
        hasTable: true,
        rowCount: rows.length,
        headers: headers,
        firstRowData: rows.length > 0 ? Array.from(rows[0].querySelectorAll('td')).map(td => td.textContent?.trim()) : []
      };
    });
    
    console.log(`📊 Tabla de mundos:`, tableData);
    
    // Test 3: Verificar estado de React Query
    console.log('\n🔍 Test 3: Verificando estado de React Query...');
    
    const reactQueryState = await page.evaluate(() => {
      // Intentar acceder al estado de React Query desde el DevTools
      const queryClient = window.__REACT_QUERY_CLIENT__;
      if (queryClient) {
        const cache = queryClient.getQueryCache();
        const queries = cache.getAll();
        return {
          hasQueryClient: true,
          queryCount: queries.length,
          queries: queries.map(q => ({
            queryKey: q.queryKey,
            state: q.state.status,
            error: q.state.error?.message,
            data: q.state.data ? 'Has data' : 'No data'
          }))
        };
      }
      return { hasQueryClient: false };
    });
    
    console.log(`🔄 React Query State:`, reactQueryState);
    
    // Test 4: Verificar página de Playlists
    console.log('\n🔍 Test 4: Navegando a página de Playlists...');
    await page.goto('http://localhost:3333/playlists');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(5000);
    
    const playlistTableData = await page.evaluate(() => {
      const table = document.querySelector('table');
      if (!table) return { hasTable: false };
      
      const rows = table.querySelectorAll('tbody tr');
      return {
        hasTable: true,
        rowCount: rows.length,
        firstRowData: rows.length > 0 ? Array.from(rows[0].querySelectorAll('td')).map(td => td.textContent?.trim()) : []
      };
    });
    
    console.log(`📊 Tabla de playlists:`, playlistTableData);
    
    // Test 5: Verificar conectividad a playlists desde el navegador
    const playlistResponse = await page.evaluate(async () => {
      try {
        const response = await fetch('http://localhost:1111/playlists');
        const data = await response.json();
        return {
          success: true,
          status: response.status,
          dataLength: data.data ? data.data.length : 0,
          count: data.count
        };
      } catch (error) {
        return {
          success: false,
          error: error.message
        };
      }
    });
    
    if (playlistResponse.success) {
      console.log(`✅ Conectividad playlists OK - Status: ${playlistResponse.status}, Playlists: ${playlistResponse.dataLength}`);
    } else {
      console.log(`❌ Error en conectividad playlists: ${playlistResponse.error}`);
    }
    
    // Resumen de errores
    console.log('\n📋 RESUMEN DE ERRORES:');
    console.log(`🔴 Errores de consola: ${consoleMessages.filter(m => m.type === 'error').length}`);
    console.log(`🟡 Warnings de consola: ${consoleMessages.filter(m => m.type === 'warning').length}`);
    console.log(`🌐 Errores de red: ${networkErrors.length}`);
    
    if (consoleMessages.filter(m => m.type === 'error').length > 0) {
      console.log('\n🔴 ERRORES DE CONSOLA:');
      consoleMessages.filter(m => m.type === 'error').forEach((msg, index) => {
        console.log(`  ${index + 1}. ${msg.text}`);
      });
    }
    
    if (networkErrors.length > 0) {
      console.log('\n🌐 ERRORES DE RED:');
      networkErrors.forEach((error, index) => {
        console.log(`  ${index + 1}. ${error.url} - ${error.status || error.failure}`);
      });
    }
    
    // Tomar screenshots
    await page.screenshot({ 
      path: 'debug-mundos-connection.png',
      fullPage: true 
    });
    
  } catch (error) {
    console.error('❌ Error durante el test:', error.message);
    await page.screenshot({ path: 'debug-connection-error.png' });
  } finally {
    await browser.close();
    console.log('\n🏁 Test de conectividad completado');
  }
}

// Ejecutar el test
testFrontendBackendConnection().catch(console.error);

// Test simple para verificar conectividad frontend-backend
console.log('🔍 Testing frontend-backend connection...');

// Test 1: Verificar que las variables de entorno estén disponibles
console.log('Environment variables:');
console.log('- VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL);

// Test 2: Test de conectividad básica
async function testConnection() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:1111';
  
  try {
    console.log('🌐 Testing health endpoint...');
    const healthResponse = await fetch(`${API_BASE_URL}/health`);
    console.log('Health status:', healthResponse.status);
    const healthData = await healthResponse.json();
    console.log('Health data:', healthData);
    
    console.log('🔑 Testing auth endpoint...');
    const authResponse = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@gamifier.com',
        password: 'admin123'
      }),
    });
    
    console.log('Auth status:', authResponse.status);
    if (authResponse.ok) {
      const authData = await authResponse.json();
      console.log('Auth success! User:', authData.user.email);
      console.log('Token received:', authData.access_token ? 'YES' : 'NO');
    } else {
      const errorData = await authResponse.text();
      console.log('Auth error:', errorData);
    }
    
  } catch (error) {
    console.error('❌ Connection error:', error);
  }
}

// Ejecutar test cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', testConnection);
} else {
  testConnection();
} 