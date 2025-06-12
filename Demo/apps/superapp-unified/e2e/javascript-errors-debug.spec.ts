/**
 * 🔧 Test de Debug de Errores de JavaScript
 * 
 * Test específico para capturar errores de JavaScript que impiden
 * que los componentes se rendericen correctamente.
 */

import { test, expect } from '@playwright/test';

test.describe('🔧 Debug de Errores JavaScript', () => {
  
  test('🔍 [JS ERRORS] Capturar errores de JavaScript en el módulo social', async ({ page }) => {
    console.log('🎯 Iniciando captura de errores JavaScript...');

    // Arrays para almacenar errores
    const jsErrors: string[] = [];
    const consoleErrors: string[] = [];
    const networkErrors: string[] = [];

    // Interceptar errores de página
    page.on('pageerror', (error) => {
      jsErrors.push(`PAGE ERROR: ${error.message}\nStack: ${error.stack}`);
      console.error(`❌ [PAGE ERROR]`, error.message);
    });

    // Interceptar errores de consola
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(`CONSOLE ERROR: ${msg.text()}`);
        console.error(`❌ [CONSOLE ERROR]`, msg.text());
      } else if (msg.type() === 'warning') {
        console.warn(`⚠️ [CONSOLE WARNING]`, msg.text());
      } else if (msg.type() === 'log' && (msg.text().includes('error') || msg.text().includes('Error'))) {
        console.log(`📝 [CONSOLE LOG]`, msg.text());
      }
    });

    // Interceptar errores de red
    page.on('requestfailed', (request) => {
      networkErrors.push(`NETWORK ERROR: ${request.method()} ${request.url()} - ${request.failure()?.errorText}`);
      console.error(`❌ [NETWORK ERROR]`, request.url(), request.failure()?.errorText);
    });

    // Interceptar respuestas HTTP con errores
    page.on('response', (response) => {
      if (response.status() >= 400) {
        networkErrors.push(`HTTP ERROR: ${response.status()} ${response.url()}`);
        console.error(`❌ [HTTP ERROR]`, response.status(), response.url());
      }
    });

    console.log('📱 Navegando al login...');
    await page.goto('/login');
    
    // Esperar a que la página cargue
    await page.waitForSelector('#root', { timeout: 10000 });
    await page.waitForTimeout(2000);
    
    console.log('✅ Página de login cargada, intentando login...');
    
    // Hacer login
    await page.fill('[data-testid="login-email-input"] input', 'user@gamifier.com');
    await page.fill('[data-testid="login-password-input"] input', '123456');
    await page.click('[data-testid="login-submit-button"]');
    
    // Esperar un poco después del login
    await page.waitForTimeout(3000);
    
    console.log('📱 Navegando al módulo social...');
    await page.goto('/social');
    
    // Esperar más tiempo para que la página se cargue completamente
    await page.waitForTimeout(5000);
    
    // Buscar elementos específicos del componente social
    const elementAnalysis = {
      socialTabsContainer: await page.locator('[role="tablist"]').count(),
      muiTabs: await page.locator('.MuiTabs-root').count(),
      muiTabPanels: await page.locator('[role="tabpanel"]').count(),
      feedSocialText: await page.locator('text=Feed Social').count(),
      socialHeader: await page.locator('text=Social CoomÜnity').count(),
      socialContainer: await page.locator('text=Conecta con tu comunidad').count(),
      anyCards: await page.locator('.MuiCard-root').count(),
      anyContainers: await page.locator('.MuiContainer-root').count(),
      anyTypography: await page.locator('.MuiTypography-root').count(),
    };
    
    console.log('🎨 Análisis de elementos MUI:');
    Object.entries(elementAnalysis).forEach(([key, count]) => {
      console.log(`  - ${key}: ${count}`);
    });
    
    // Verificar si hay algún texto relevante en la página
    const pageContent = await page.textContent('body');
    const hasRelevantText = pageContent?.includes('Social') || pageContent?.includes('Feed') || pageContent?.includes('CoomÜnity');
    console.log(`📄 Página contiene texto relevante: ${hasRelevantText}`);
    
    // Verificar el HTML actual del componente raíz
    const rootHTML = await page.locator('#root').innerHTML();
    const htmlPreview = rootHTML.substring(0, 500) + (rootHTML.length > 500 ? '...' : '');
    console.log(`🔍 HTML del componente raíz (primeros 500 chars):`);
    console.log(htmlPreview);
    
    // Verificar si React está cargado
    const reactInfo = await page.evaluate(() => {
      return {
        reactExists: typeof window.React !== 'undefined',
        reactDevTools: !!(window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__,
        muiTheme: !!(window as any).muiTheme || document.querySelector('[data-mui-theme]'),
        reactRootMounted: !!document.querySelector('#root [data-reactroot], #root [data-react-helmet]')
      };
    });
    
    console.log('⚛️ Estado de React:');
    Object.entries(reactInfo).forEach(([key, value]) => {
      console.log(`  - ${key}: ${value}`);
    });
    
    // Capturar más detalles sobre errores
    console.log('📋 RESUMEN DE ERRORES:');
    console.log(`  - Errores de página: ${jsErrors.length}`);
    console.log(`  - Errores de consola: ${consoleErrors.length}`);
    console.log(`  - Errores de red: ${networkErrors.length}`);
    
    if (jsErrors.length > 0) {
      console.log('🚨 ERRORES DE PÁGINA:');
      jsErrors.forEach((error, index) => {
        console.log(`  ${index + 1}. ${error}`);
      });
    }
    
    if (consoleErrors.length > 0) {
      console.log('🚨 ERRORES DE CONSOLA:');
      consoleErrors.forEach((error, index) => {
        console.log(`  ${index + 1}. ${error}`);
      });
    }
    
    if (networkErrors.length > 0) {
      console.log('🚨 ERRORES DE RED:');
      networkErrors.forEach((error, index) => {
        console.log(`  ${index + 1}. ${error}`);
      });
    }
    
    // Tomar screenshot del estado final
    await page.screenshot({ path: 'js-errors-debug-final.png', fullPage: true });
    console.log('📸 Screenshot guardado como js-errors-debug-final.png');
    
    // El test pasa si encontramos elementos básicos o al menos React está montado
    expect(elementAnalysis.socialContainer + elementAnalysis.anyContainers).toBeGreaterThan(0);
  });
}); 