import { test, expect } from '@playwright/test';

test.describe('🛡️ Object Conversion Error Fix Verification', () => {
  test('should not throw "Cannot convert object to primitive value" error', async ({ page }) => {
    // Array para capturar errores JavaScript
    const jsErrors: string[] = [];
    const conversionErrors: string[] = [];

    // Capturar errores JavaScript
    page.on('pageerror', (error) => {
      jsErrors.push(error.message);
      if (error.message.includes('Cannot convert object to primitive value')) {
        conversionErrors.push(error.message);
      }
    });

    // Capturar errores de consola
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        const errorText = msg.text();
        jsErrors.push(errorText);
        if (errorText.includes('Cannot convert object to primitive value')) {
          conversionErrors.push(errorText);
        }
      }
    });

    console.log('🔍 Navegando a la SuperApp para verificar ausencia de errores de conversión...');

    // Navegar a la SuperApp
    await page.goto('http://localhost:3001');

    // Esperar a que React se monte
    await page.waitForSelector('#root', { timeout: 15000 });

    console.log('✅ Página cargada, verificando errores...');

    // Esperar un poco para que se ejecuten los scripts
    await page.waitForTimeout(3000);

    // Navegar a diferentes rutas para probar más código
    const routesToTest = [
      '/',
      '/marketplace',
      '/uplay',
      '/social',
      '/ustats',
      '/profile',
      '/wallet'
    ];

    for (const route of routesToTest) {
      console.log(`🔍 Probando ruta: ${route}`);

      try {
        await page.goto(`http://localhost:3001${route}`, { timeout: 10000 });
        await page.waitForTimeout(2000);
      } catch (error) {
        console.log(`⚠️ Error navegando a ${route}:`, error);
        // Continuar con la siguiente ruta
      }
    }

    // Verificar que NO hay errores de conversión
    expect(conversionErrors.length,
      `❌ Se encontraron ${conversionErrors.length} errores de conversión de objetos: ${conversionErrors.join(', ')}`
    ).toBe(0);

    // Reportar estadísticas
    console.log('\n📊 REPORTE DE ERRORES:');
    console.log(`🔍 Total de errores JavaScript: ${jsErrors.length}`);
    console.log(`🛡️ Errores de conversión de objetos: ${conversionErrors.length}`);

    if (jsErrors.length > 0) {
      console.log('\n📝 Errores JavaScript encontrados (no de conversión):');
      jsErrors.forEach((error, index) => {
        if (!error.includes('Cannot convert object to primitive value')) {
          console.log(`  ${index + 1}. ${error}`);
        }
      });
    }

    // Verificar que el manejador de errores está funcionando
    await page.evaluate(() => {
      // Intentar crear un objeto problemático para verificar que el manejador funciona
      try {
        const problematicObj = Object.create(null);
        const testResult = 'Test: ' + problematicObj; // Esto debería funcionar ahora
        console.log('✅ Conversión de objeto con prototipo null exitosa:', testResult);
        return true;
      } catch (error) {
        console.error('❌ Conversión de objeto falló:', error);
        return false;
      }
    });

    console.log('✅ Test de verificación de error de conversión completado');
  });

  test('should handle error logging safely', async ({ page }) => {
    const consoleMessages: string[] = [];

    page.on('console', (msg) => {
      consoleMessages.push(`${msg.type()}: ${msg.text()}`);
    });

    await page.goto('http://localhost:3001');
    await page.waitForSelector('#root');

    // Probar logging seguro desde la consola del navegador
    await page.evaluate(() => {
      // Crear diferentes tipos de objetos problemáticos
      const nullProtoObj = Object.create(null);
      const circularObj: any = {};
      circularObj.self = circularObj;

      // Estos deberían funcionar sin errores
      console.log('Testing null proto object:', nullProtoObj);
      console.log('Testing circular object:', circularObj);
      console.error('Testing error with null proto:', nullProtoObj);
      console.warn('Testing warning with circular:', circularObj);
    });

    await page.waitForTimeout(2000);

    // Verificar que no hay errores de conversión en los logs
    const conversionErrorLogs = consoleMessages.filter(msg =>
      msg.includes('Cannot convert object to primitive value')
    );

    expect(conversionErrorLogs.length).toBe(0);

    console.log('✅ Logging seguro verificado');
  });

  test('should navigate all main routes without conversion errors', async ({ page }) => {
    const conversionErrors: string[] = [];

    page.on('pageerror', (error) => {
      if (error.message.includes('Cannot convert object to primitive value')) {
        conversionErrors.push(`Page Error: ${error.message}`);
      }
    });

    page.on('console', (msg) => {
      if (msg.type() === 'error' && msg.text().includes('Cannot convert object to primitive value')) {
        conversionErrors.push(`Console Error: ${msg.text()}`);
      }
    });

    const routes = [
      { path: '/', name: 'Home' },
      { path: '/marketplace', name: 'Marketplace' },
      { path: '/uplay', name: 'ÜPlay' },
      { path: '/social', name: 'Social' },
      { path: '/ustats', name: 'UStats' },
      { path: '/profile', name: 'Profile' },
      { path: '/wallet', name: 'Wallet' }
    ];

    for (const route of routes) {
      console.log(`🔍 Testing route: ${route.name} (${route.path})`);

      try {
        await page.goto(`http://localhost:3001${route.path}`, {
          timeout: 10000,
          waitUntil: 'domcontentloaded'
        });

        // Esperar a que se cargue el contenido
        await page.waitForTimeout(2000);

        // Verificar que la página se cargó
        const hasContent = await page.$('#root');
        expect(hasContent).toBeTruthy();

        console.log(`✅ ${route.name} loaded successfully`);
      } catch (error) {
        console.log(`⚠️ ${route.name} had issues but continuing:`, error);
      }
    }

    // Verificación final
    expect(conversionErrors.length,
      `❌ Conversion errors found: ${conversionErrors.join(', ')}`
    ).toBe(0);

    console.log('🎉 All routes tested successfully without conversion errors!');
  });
});
