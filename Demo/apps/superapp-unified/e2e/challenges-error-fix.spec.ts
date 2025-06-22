import { test, expect } from '@playwright/test';

test.describe('🛡️ Challenges Page Error Fix Verification', () => {
  test('should not throw "Cannot convert object to primitive value" in /challenges route', async ({ page }) => {
    // Array para capturar errores JavaScript
    const jsErrors: string[] = [];
    const conversionErrors: string[] = [];

    // Capturar errores JavaScript
    page.on('pageerror', (error) => {
      const errorMsg = error.message;
      jsErrors.push(errorMsg);
      console.log('🚨 JavaScript Error:', errorMsg);
      
      if (errorMsg.includes('Cannot convert object to primitive value')) {
        conversionErrors.push(errorMsg);
        console.log('🔥 CONVERSION ERROR DETECTED:', errorMsg);
      }
    });

    // Capturar errores de consola
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        const errorText = msg.text();
        jsErrors.push(errorText);
        console.log('🚨 Console Error:', errorText);
        
        if (errorText.includes('Cannot convert object to primitive value')) {
          conversionErrors.push(errorText);
          console.log('🔥 CONSOLE CONVERSION ERROR:', errorText);
        }
      }
    });

    console.log('🚀 Navegando a /challenges...');
    
    // Navegar a la página de challenges
    await page.goto('/challenges');
    
    // Esperar a que React se monte
    await page.waitForSelector('#root', { timeout: 15000 });
    console.log('✅ React root encontrado');
    
    // Esperar un poco más para que los componentes se carguen
    await page.waitForTimeout(5000);
    console.log('✅ Tiempo de espera completado');

    // Verificar que no hay errores de conversión de objetos
    console.log('🔍 Total JS Errors:', jsErrors.length);
    console.log('🔍 Conversion Errors:', conversionErrors.length);
    
    if (conversionErrors.length > 0) {
      console.log('🚨 ERRORES DE CONVERSIÓN ENCONTRADOS:');
      conversionErrors.forEach((error, index) => {
        console.log(`${index + 1}. ${error}`);
      });
    }

    // El test falla si hay errores de conversión
    expect(conversionErrors).toHaveLength(0);
    
    console.log('✅ No conversion errors detected in /challenges route');
  });

  test('should handle invalid challenge objects gracefully', async ({ page }) => {
    const jsErrors: string[] = [];
    
    page.on('pageerror', (error) => {
      jsErrors.push(error.message);
    });

    await page.goto('/challenges');
    await page.waitForSelector('#root', { timeout: 15000 });
    await page.waitForTimeout(3000);

    // Verificar que no hay errores críticos
    const criticalErrors = jsErrors.filter(error => 
      error.includes('Cannot convert object to primitive value') ||
      error.includes('TypeError') ||
      error.includes('ReferenceError')
    );

    expect(criticalErrors).toHaveLength(0);
    console.log('✅ Test de manejo de objetos inválidos completado sin errores de conversión');
  });
}); 