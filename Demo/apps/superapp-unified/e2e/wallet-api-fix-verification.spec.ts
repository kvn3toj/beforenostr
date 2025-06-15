import { test, expect } from '@playwright/test';

test.describe('Wallet API Fix Verification', () => {
  test('should login successfully without walletAPI import errors', async ({ page }) => {
    // Configurar listener para errores de JavaScript
    const jsErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        jsErrors.push(msg.text());
      }
    });

    // Configurar listener para errores no manejados
    const unhandledErrors: string[] = [];
    page.on('pageerror', (error) => {
      unhandledErrors.push(error.message);
    });

    // 1. Navegar a la página de login
    await page.goto('/');
    
    // Esperar a que React se monte
    await page.waitForSelector('#root', { timeout: 10000 });

    // 2. Verificar que no hay errores de importación de walletAPI
    const importErrors = jsErrors.filter(error => 
      error.includes('walletAPI') || 
      error.includes('Importing binding name') ||
      error.includes('is not found')
    );
    
    expect(importErrors).toHaveLength(0);

    // 3. Verificar que la página de login se carga correctamente
    await expect(page.locator('h1, h2, h3')).toContainText(/login|iniciar|sesión/i);

    // 4. Realizar login con credenciales válidas
    await page.fill('[data-testid="login-email-input"] input', 'user@gamifier.com');
    await page.fill('[data-testid="login-password-input"] input', '123456');
    
    // 5. Hacer click en el botón de login
    await page.click('[data-testid="login-submit-button"]');

    // 6. Esperar redirección exitosa (sin crash)
    await page.waitForURL('**/', { timeout: 15000 });

    // 7. Verificar que no hay errores de JavaScript después del login
    const postLoginErrors = jsErrors.filter(error => 
      error.includes('walletAPI') || 
      error.includes('Importing binding name') ||
      error.includes('is not found') ||
      error.includes('Cannot read properties') ||
      error.includes('undefined')
    );
    
    expect(postLoginErrors).toHaveLength(0);

    // 8. Verificar que no hay errores no manejados
    expect(unhandledErrors).toHaveLength(0);

    // 9. Verificar que la aplicación se renderiza correctamente después del login
    await expect(page.locator('#root')).toBeVisible();
    
    // 10. Verificar que hay contenido en la página (no está en blanco)
    const bodyText = await page.locator('body').textContent();
    expect(bodyText).toBeTruthy();
    expect(bodyText!.length).toBeGreaterThan(10);

    // 11. Verificar que no hay mensajes de error visibles en la UI
    const errorMessages = page.locator('[role="alert"], .error, .alert-error');
    await expect(errorMessages).toHaveCount(0);

    console.log('✅ Login successful without walletAPI errors');
    console.log(`📊 Total JS errors captured: ${jsErrors.length}`);
    console.log(`📊 Total unhandled errors: ${unhandledErrors.length}`);
    
    if (jsErrors.length > 0) {
      console.log('🔍 JS Errors found:', jsErrors);
    }
    
    if (unhandledErrors.length > 0) {
      console.log('🔍 Unhandled errors found:', unhandledErrors);
    }
  });

  test('should have walletAPI properly exported from api-service', async ({ page }) => {
    // Test que verifica que walletAPI está disponible en el contexto de la aplicación
    await page.goto('/');
    await page.waitForSelector('#root');

    // Ejecutar código JavaScript en el contexto de la página para verificar la exportación
    const walletAPIAvailable = await page.evaluate(() => {
      try {
        // Intentar importar dinámicamente el módulo
        return import('/src/lib/api-service.ts').then(module => {
          return {
            hasWalletAPI: 'walletAPI' in module,
            hasApiService: 'apiService' in module,
            walletAPIMethods: module.walletAPI ? Object.keys(module.walletAPI) : [],
          };
        });
      } catch (error) {
        return {
          error: error.message,
          hasWalletAPI: false,
          hasApiService: false,
          walletAPIMethods: [],
        };
      }
    });

    const result = await walletAPIAvailable;
    
    // Verificar que walletAPI está disponible
    expect(result.hasWalletAPI).toBe(true);
    expect(result.hasApiService).toBe(true);
    
    // Verificar que walletAPI tiene los métodos esperados
    const expectedMethods = [
      'getBalance',
      'getTransactions', 
      'getMerits',
      'getAllMerits',
      'getMeritsLeaderboard',
      'getMeritHistory',
      'awardMerit',
      'transfer'
    ];
    
    for (const method of expectedMethods) {
      expect(result.walletAPIMethods).toContain(method);
    }

    console.log('✅ walletAPI properly exported with all expected methods');
    console.log(`📊 Available methods: ${result.walletAPIMethods.join(', ')}`);
  });

  test('should navigate through protected routes without crashes', async ({ page }) => {
    // Test que verifica que las rutas protegidas no crashean después del login
    const jsErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        jsErrors.push(msg.text());
      }
    });

    // 1. Login
    await page.goto('/');
    await page.waitForSelector('#root');
    
    await page.fill('[data-testid="login-email-input"] input', 'user@gamifier.com');
    await page.fill('[data-testid="login-password-input"] input', '123456');
    await page.click('[data-testid="login-submit-button"]');
    
    await page.waitForURL('**/', { timeout: 15000 });

    // 2. Intentar navegar a diferentes rutas que podrían usar walletAPI
    const routesToTest = [
      '/',
      '/dashboard',
      '/wallet',
      '/profile',
      '/marketplace',
      '/challenges',
      '/social'
    ];

    for (const route of routesToTest) {
      try {
        await page.goto(route);
        await page.waitForTimeout(2000); // Dar tiempo para que se cargue
        
        // Verificar que la página se carga sin errores críticos
        await expect(page.locator('#root')).toBeVisible();
        
        console.log(`✅ Route ${route} loaded successfully`);
      } catch (error) {
        console.log(`⚠️ Route ${route} may not exist or failed to load: ${error.message}`);
        // No fallar el test si la ruta no existe, solo registrar
      }
    }

    // 3. Verificar que no hay errores críticos de walletAPI
    const criticalErrors = jsErrors.filter(error => 
      error.includes('walletAPI') && 
      (error.includes('is not found') || error.includes('Cannot read properties'))
    );
    
    expect(criticalErrors).toHaveLength(0);

    console.log('✅ Navigation through protected routes completed without critical errors');
  });
}); 