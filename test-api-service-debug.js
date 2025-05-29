import { chromium } from 'playwright';

async function testApiServiceDebug() {
  console.log('🚀 Iniciando debug del ApiService...');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 1000 
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Capturar todos los logs
  page.on('console', msg => {
    const text = msg.text();
    if (text.includes('[ApiService]') || text.includes('[Mundos]')) {
      console.log(`📝 ${msg.type().toUpperCase()}: ${text}`);
    }
  });
  
  try {
    // Login
    console.log('\n🔐 Realizando login...');
    await page.goto('http://localhost:3000/login');
    await page.waitForLoadState('networkidle');
    
    await page.fill('input[name="email"]', 'admin@coomunity.co');
    await page.fill('input[name="password"]', '123456');
    await page.click('button[type="submit"]');
    
    await page.waitForURL('http://localhost:3000/', { timeout: 10000 });
    await page.waitForLoadState('networkidle');
    console.log('✅ Login exitoso');
    
    // Test del ApiService directamente
    console.log('\n🔍 Test 1: Probando ApiService directamente...');
    
    const apiServiceTest = await page.evaluate(async () => {
      try {
        // Simular lo que hace el apiService
        const API_BASE_URL = 'http://localhost:3002';
        const endpoint = '/mundos';
        
        // Obtener headers como lo hace el apiService
        const token = localStorage.getItem('auth_token');
        const headers = {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        };
        
        console.log('[DEBUG] API_BASE_URL:', API_BASE_URL);
        console.log('[DEBUG] Endpoint:', endpoint);
        console.log('[DEBUG] Headers:', headers);
        console.log('[DEBUG] Full URL:', `${API_BASE_URL}${endpoint}`);
        
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
          method: 'GET',
          headers: headers,
        });
        
        console.log('[DEBUG] Response status:', response.status);
        console.log('[DEBUG] Response ok:', response.ok);
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.log('[DEBUG] Error data:', errorData);
          return {
            success: false,
            status: response.status,
            statusText: response.statusText,
            errorData: errorData
          };
        }
        
        const data = await response.json();
        console.log('[DEBUG] Success data length:', Array.isArray(data) ? data.length : 'Not array');
        
        return {
          success: true,
          status: response.status,
          dataLength: Array.isArray(data) ? data.length : 0,
          data: data
        };
        
      } catch (error) {
        console.log('[DEBUG] Catch error:', error.message);
        return {
          success: false,
          error: error.message,
          stack: error.stack
        };
      }
    });
    
    console.log('📊 Resultado del test ApiService:', apiServiceTest);
    
    // Test 2: Verificar variables de entorno
    console.log('\n🔍 Test 2: Verificando variables de entorno...');
    
    const envTest = await page.evaluate(() => {
      return {
        VITE_BACKEND_URL: import.meta.env?.VITE_BACKEND_URL,
        NODE_ENV: import.meta.env?.NODE_ENV,
        MODE: import.meta.env?.MODE,
        VITE_API_BASE_URL: import.meta.env?.VITE_API_BASE_URL,
        allEnvVars: import.meta.env
      };
    });
    
    console.log('🌍 Variables de entorno:', envTest);
    
    // Test 3: Navegar a mundos y capturar el proceso completo
    console.log('\n🔍 Test 3: Navegando a mundos y capturando proceso...');
    
    await page.goto('http://localhost:3000/mundos');
    await page.waitForLoadState('networkidle');
    
    // Esperar y capturar el proceso de carga
    await page.waitForTimeout(3000);
    
    const mundosPageState = await page.evaluate(() => {
      // Verificar si hay algún indicador de carga o error
      const loadingElements = document.querySelectorAll('[data-testid*="loading"], .loading, [role="progressbar"]');
      const errorElements = document.querySelectorAll('[data-testid*="error"], .error, [role="alert"]');
      const tableElements = document.querySelectorAll('table');
      const emptyStateElements = document.querySelectorAll('[data-testid*="empty"], .empty-state');
      
      return {
        loadingCount: loadingElements.length,
        errorCount: errorElements.length,
        tableCount: tableElements.length,
        emptyStateCount: emptyStateElements.length,
        bodyText: document.body.textContent?.substring(0, 500) // Primeros 500 caracteres
      };
    });
    
    console.log('📄 Estado de la página de mundos:', mundosPageState);
    
    // Test 4: Intentar ejecutar la query manualmente
    console.log('\n🔍 Test 4: Ejecutando query de mundos manualmente...');
    
    const manualQueryTest = await page.evaluate(async () => {
      try {
        // Intentar importar y usar el servicio directamente
        const response = await fetch('http://localhost:3002/mundos', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        return {
          success: true,
          data: data,
          dataType: typeof data,
          isArray: Array.isArray(data),
          length: Array.isArray(data) ? data.length : 'N/A'
        };
      } catch (error) {
        return {
          success: false,
          error: error.message
        };
      }
    });
    
    console.log('🔄 Resultado de query manual:', manualQueryTest);
    
    // Tomar screenshot
    await page.screenshot({ 
      path: 'debug-api-service.png',
      fullPage: true 
    });
    
  } catch (error) {
    console.error('❌ Error durante el debug:', error.message);
    await page.screenshot({ path: 'debug-api-error.png' });
  } finally {
    await browser.close();
    console.log('\n🏁 Debug del ApiService completado');
  }
}

// Ejecutar el test
testApiServiceDebug().catch(console.error); 