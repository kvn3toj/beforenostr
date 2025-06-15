import { test, expect } from '@playwright/test';

test.describe('Debug Login', () => {
  test('debug login process with console logs', async ({ page }) => {
    // Capturar logs de la consola
    const consoleLogs: string[] = [];
    page.on('console', msg => {
      consoleLogs.push(`[${msg.type()}] ${msg.text()}`);
    });

    // Capturar errores de la página
    const pageErrors: string[] = [];
    page.on('pageerror', error => {
      pageErrors.push(`Page Error: ${error.message}`);
    });

    // Capturar respuestas de red
    const networkResponses: { url: string; status: number; body?: string }[] = [];
    page.on('response', async response => {
      if (response.url().includes('/auth/login')) {
        let body = '';
        try {
          body = await response.text();
        } catch (e) {
          body = 'Could not read response body';
        }
        networkResponses.push({
          url: response.url(),
          status: response.status(),
          body: body
        });
      }
    });

    console.log('🧪 Starting debug login process...');
    
    // Navegar a la página de login
    await page.goto('/login');
    
    // Esperar a que React se monte
    await page.waitForSelector('#root');
    
    // Esperar a que el formulario de login esté visible
    await page.waitForSelector('[data-testid="login-email-input"]', { timeout: 10000 });
    
    console.log('📝 Login form is visible');
    
    // Llenar el formulario de login
    await page.fill('[data-testid="login-email-input"] input', 'user@gamifier.com');
    await page.fill('[data-testid="login-password-input"] input', '123456');
    
    console.log('📝 Form filled with credentials');
    
    // Hacer clic en el botón de login
    await page.click('[data-testid="login-submit-button"]');
    
    console.log('📝 Login button clicked');
    
    // Esperar un poco para que se procese la petición
    await page.waitForTimeout(5000);
    
    // Imprimir todos los logs capturados
    console.log('\n=== CONSOLE LOGS ===');
    consoleLogs.forEach(log => console.log(log));
    
    console.log('\n=== PAGE ERRORS ===');
    pageErrors.forEach(error => console.log(error));
    
    console.log('\n=== NETWORK RESPONSES ===');
    networkResponses.forEach(response => {
      console.log(`${response.status} ${response.url}`);
      console.log(`Body: ${response.body}`);
    });
    
    console.log(`\n=== FINAL URL ===`);
    console.log(`Current URL: ${page.url()}`);
    
    // Verificar si hay algún elemento de error visible
    const errorElements = await page.locator('text=/error|Error|ERROR/i').all();
    if (errorElements.length > 0) {
      console.log('\n=== ERROR ELEMENTS ===');
      for (const element of errorElements) {
        const text = await element.textContent();
        console.log(`Error text: ${text}`);
      }
    }
  });
}); 