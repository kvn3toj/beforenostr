import { test, expect } from '@playwright/test';

test.describe('Debug Login Issue', () => {
  test('should debug login connectivity and errors', async ({ page }) => {
    // Capturar todos los errores y logs
    const consoleMessages: string[] = [];
    const networkErrors: string[] = [];
    
    page.on('console', (msg) => {
      const message = `[${msg.type()}] ${msg.text()}`;
      consoleMessages.push(message);
      console.log('Browser console:', message);
    });
    
    page.on('pageerror', (error) => {
      const message = `Page error: ${error.message}`;
      networkErrors.push(message);
      console.error('Page error:', error.message);
    });
    
    page.on('requestfailed', (request) => {
      const message = `Request failed: ${request.method()} ${request.url()} - ${request.failure()?.errorText}`;
      networkErrors.push(message);
      console.error('Request failed:', message);
    });
    
    // Interceptar requests para ver qué está pasando
    page.on('request', (request) => {
      if (request.url().includes('localhost:1111')) {
        console.log('🌐 Request to backend:', request.method(), request.url());
      }
    });
    
    page.on('response', (response) => {
      if (response.url().includes('localhost:1111')) {
        console.log('📡 Response from backend:', response.status(), response.url());
      }
    });
    
    // Navegar a la página de login
    console.log('🔍 Navigating to login page...');
    await page.goto('/login');
    await page.waitForTimeout(2000);
    
    // Verificar que la página cargó
    await expect(page.getByRole('heading', { name: /login|iniciar sesión/i })).toBeVisible();
    console.log('✅ Login page loaded');
    
    // Verificar variables de entorno en el navegador
    const envVars = await page.evaluate(() => {
      return {
        VITE_API_BASE_URL: (window as any).import?.meta?.env?.VITE_API_BASE_URL || 'undefined',
        NODE_ENV: (window as any).import?.meta?.env?.NODE_ENV || 'undefined',
        MODE: (window as any).import?.meta?.env?.MODE || 'undefined'
      };
    });
    console.log('🔧 Environment variables:', envVars);
    
    // Test de conectividad directo desde el navegador
    console.log('🌐 Testing backend connectivity from browser...');
    const connectivityTest = await page.evaluate(async () => {
      const API_BASE_URL = 'http://localhost:1111'; // Hardcoded para test
      
      try {
        // Test health endpoint
        const healthResponse = await fetch(`${API_BASE_URL}/health`);
        const healthData = await healthResponse.json();
        
        return {
          success: true,
          healthStatus: healthResponse.status,
          healthData: healthData,
          apiUrl: API_BASE_URL
        };
      } catch (error: any) {
        return {
          success: false,
          error: error.message,
          apiUrl: API_BASE_URL
        };
      }
    });
    
    console.log('🔍 Connectivity test result:', connectivityTest);
    
    // Llenar el formulario de login
    console.log('📝 Filling login form...');
    await page.fill('input[name="email"]', 'admin@gamifier.com');
    await page.fill('input[name="password"]', 'admin123');
    
    // Hacer clic en submit y esperar
    console.log('🚀 Submitting login form...');
    await page.click('button[type="submit"]');
    
    // Esperar un momento para ver qué pasa
    await page.waitForTimeout(5000);
    
    // Verificar el estado después del login
    const currentUrl = page.url();
    console.log('📍 Current URL after login attempt:', currentUrl);
    
    // Reportar todos los errores capturados
    console.log('\n📊 SUMMARY:');
    console.log('- Console messages:', consoleMessages.length);
    console.log('- Network errors:', networkErrors.length);
    console.log('- Final URL:', currentUrl);
    
    if (networkErrors.length > 0) {
      console.log('\n❌ Network errors found:');
      networkErrors.forEach((error, index) => {
        console.log(`${index + 1}. ${error}`);
      });
    }
    
    if (consoleMessages.some(msg => msg.includes('error') || msg.includes('Error'))) {
      console.log('\n❌ Console errors found:');
      consoleMessages
        .filter(msg => msg.includes('error') || msg.includes('Error'))
        .forEach((error, index) => {
          console.log(`${index + 1}. ${error}`);
        });
    }
    
    // Tomar screenshot para debug
    await page.screenshot({ path: 'debug-login-issue.png', fullPage: true });
  });
}); 