/**
 * 🔧 Debug Test para el Módulo Social
 * 
 * Test simple para identificar el error específico que está ocurriendo
 */

import { test, expect } from '@playwright/test';

test.describe('Social Module - Debug', () => {

  test('Debug: Verificar qué error específico está ocurriendo', async ({ page }) => {
    // Escuchar errores de consola
    const consoleMessages: string[] = [];
    const errors: string[] = [];
    
    page.on('console', (msg) => {
      consoleMessages.push(`${msg.type()}: ${msg.text()}`);
    });
    
    page.on('pageerror', (error) => {
      errors.push(error.message);
    });

    // Ir a la página de Social
    await page.goto('http://localhost:3333/social');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    console.log('=== CONSOLE MESSAGES ===');
    consoleMessages.forEach(msg => console.log(msg));
    
    console.log('=== PAGE ERRORS ===');
    errors.forEach(error => console.log(error));

    // Capturar el HTML actual
    const html = await page.content();
    console.log('=== PAGE TITLE ===');
    console.log(await page.title());
    
    console.log('=== H1 CONTENT ===');
    const h1Text = await page.locator('h1').textContent();
    console.log(h1Text);

    // Buscar si hay algún mensaje de error específico
    const errorMessages = await page.locator('[class*="error"], [class*="Error"]').allTextContents();
    console.log('=== ERROR MESSAGES ON PAGE ===');
    errorMessages.forEach(msg => console.log(msg));

    // Verificar si hay componentes React que fallaron
    const reactErrors = await page.locator('[data-reactroot] [role="alert"]').allTextContents();
    console.log('=== REACT ERROR BOUNDARIES ===');
    reactErrors.forEach(error => console.log(error));
  });

  test('Debug: Verificar imports y dependencias', async ({ page }) => {
    await page.goto('http://localhost:3333/social');
    await page.waitForLoadState('networkidle');
    
    // Ejecutar JavaScript para verificar qué está disponible
    const diagnostics = await page.evaluate(() => {
      return {
        reactVersion: window.React?.version || 'No React detected',
        reactQueryVersion: window.ReactQuery?.version || 'React Query not in window',
        muiPresent: !!window.MaterialUI || !!document.querySelector('[class*="Mui"]'),
        hasReactQuery: !!window.__REACT_QUERY_DEVTOOLS__ || !!window.ReactQuery,
        errorDetails: {
          scriptErrors: window.errorMessages || [],
          loadingErrors: window.networkErrors || []
        }
      };
    });

    console.log('=== DIAGNOSTICS ===');
    console.log(JSON.stringify(diagnostics, null, 2));
  });

}); 