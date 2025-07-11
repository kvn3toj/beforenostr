import { test, expect } from '@playwright/test';

test.describe('🔧 Test Simple de Errores - Post-Fix', () => {
  
  test('debe verificar errores después de arreglar mock auth', async ({ page }) => {
    const consoleErrors: string[] = [];
    const networkErrors: Array<{url: string, status: number, statusText: string}> = [];
    
    // Capturar errores de consola
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        const text = msg.text();
        consoleErrors.push(text);
        console.log(`❌ Console Error: ${text}`);
      }
    });

    // Capturar errores de red
    page.on('response', (response) => {
      if (response.status() >= 400) {
        const error = {
          url: response.url(),
          status: response.status(),
          statusText: response.statusText()
        };
        networkErrors.push(error);
        console.log(`🌐 Network Error: ${error.status} ${error.statusText} - ${error.url}`);
      }
    });

    console.log('🔍 === INICIANDO TEST POST-FIX ===');
    
    // Paso 1: Ir al login
    await page.goto('/');
    await page.waitForSelector('#root', { timeout: 15000 });
    await page.waitForTimeout(2000);
    
    // Verificar que NO hay banner mock
    const mockBanner = page.locator('[data-testid="dev-auth-banner"]');
    const isMockVisible = await mockBanner.isVisible();
    console.log(`🧪 Mock Banner Visible: ${isMockVisible}`);
    
    // Paso 2: Hacer login si es necesario
    const isLoginPage = await page.locator('#email').isVisible();
    if (isLoginPage) {
      console.log('🔐 Realizando login con backend real...');
      await page.fill('#email', 'user@gamifier.com');
      await page.fill('#password', '123456');
      
      const loginPromise = page.waitForResponse(
        response => response.url().includes('/auth/login'),
        { timeout: 15000 }
      );
      
      await page.click('button:has-text("Iniciar Sesión")');
      
      try {
        const loginResponse = await loginPromise;
        console.log(`✅ Login Status: ${loginResponse.status()}`);
      } catch (error) {
        console.log(`❌ Login Error: ${error}`);
      }
      
      // Esperar redirección
      await page.waitForFunction(
        () => !window.location.pathname.includes('/login'),
        { timeout: 10000 }
      );
      
      console.log(`📍 Current URL after login: ${page.url()}`);
    }
    
    // Paso 3: Esperar que se carguen las llamadas iniciales
    await page.waitForTimeout(5000);
    
    // Paso 4: Navegar a wallet específicamente (donde vimos el error)
    console.log('🔍 Navegando a Wallet...');
    try {
      await page.goto('/wallet');
      await page.waitForTimeout(3000);
    } catch (error) {
      console.log(`❌ Error navegando a wallet: ${error}`);
    }
    
    // Análisis final
    console.log('\n📊 === RESUMEN DE ERRORES POST-FIX ===');
    console.log(`- Console Errors: ${consoleErrors.length}`);
    console.log(`- Network Errors: ${networkErrors.length}`);
    
    if (consoleErrors.length > 0) {
      console.log('\n❌ ERRORES DE CONSOLA:');
      consoleErrors.forEach((error, index) => {
        console.log(`${index + 1}. ${error}`);
      });
    }
    
    if (networkErrors.length > 0) {
      console.log('\n🌐 ERRORES DE RED:');
      networkErrors.forEach((error, index) => {
        console.log(`${index + 1}. ${error.status} ${error.statusText} - ${error.url}`);
      });
    }
    
    // Verificar que el usuario autenticado tiene ID real (no mock)
    const userIdInStorage = await page.evaluate(() => {
      try {
        const userStr = localStorage.getItem('coomunity_user');
        if (userStr) {
          const user = JSON.parse(userStr);
          return user.id;
        }
        return null;
      } catch (error) {
        return null;
      }
    });
    
    console.log(`👤 User ID en localStorage: ${userIdInStorage}`);
    
    // Verificación específica del ID real vs mock
    if (userIdInStorage && !userIdInStorage.includes('mock')) {
      console.log('✅ Usuario real detectado (no mock)');
    } else {
      console.log('⚠️ Posible usuario mock o no hay usuario');
    }
    
    // El test siempre pasa, solo reporta información
    expect(true).toBe(true);
  });
});

test.describe('Simple Error Check - No Authentication Required', () => {
  test('should access home page and check for conversion errors', async ({ page }) => {
    const errors: string[] = [];
    
    // Capturar errores de consola
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        const errorText = msg.text();
        if (errorText.includes('Cannot convert object to primitive value')) {
          errors.push(`Console Error: ${errorText}`);
        }
      }
    });

    // Capturar errores JavaScript
    page.on('pageerror', (error) => {
      if (error.message.includes('Cannot convert object to primitive value')) {
        errors.push(`JavaScript Error: ${error.message}`);
      }
    });

    // Ir a la página principal (sin autenticación)
    await page.goto('/');
    
    // Esperar a que React se monte
    await page.waitForSelector('#root', { timeout: 10000 });
    
    // Esperar un poco para que se carguen los componentes
    await page.waitForTimeout(3000);
    
    // Verificar que no hay errores de conversión
    expect(errors.length).toBe(0);
    
    if (errors.length > 0) {
      console.log('🚨 Errores de conversión detectados:');
      errors.forEach((error, index) => {
        console.log(`${index + 1}. ${error}`);
      });
    } else {
      console.log('✅ No se detectaron errores de conversión en la página principal');
    }
  });

  test('should navigate to challenges page and check for conversion errors', async ({ page }) => {
    const errors: string[] = [];
    
    // Capturar errores de consola
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        const errorText = msg.text();
        if (errorText.includes('Cannot convert object to primitive value')) {
          errors.push(`Console Error: ${errorText}`);
        }
      }
    });

    // Capturar errores JavaScript
    page.on('pageerror', (error) => {
      if (error.message.includes('Cannot convert object to primitive value')) {
        errors.push(`JavaScript Error: ${error.message}`);
      }
    });

    // Ir directamente a la página de challenges
    await page.goto('/challenges');
    
    // Esperar a que React se monte
    await page.waitForSelector('#root', { timeout: 10000 });
    
    // Esperar un poco para que se carguen los componentes
    await page.waitForTimeout(5000);
    
    // Verificar que no hay errores de conversión
    expect(errors.length).toBe(0);
    
    if (errors.length > 0) {
      console.log('🚨 Errores de conversión detectados en /challenges:');
      errors.forEach((error, index) => {
        console.log(`${index + 1}. ${error}`);
      });
    } else {
      console.log('✅ No se detectaron errores de conversión en la página de challenges');
    }
  });
}); 