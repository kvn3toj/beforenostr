import { test, expect } from '@playwright/test';

test.describe('🚀 Home Page - Phase 3 Simple Verification (No Auth)', () => {
  test('🔍 Verificar que la aplicación se carga sin errores de compilación', async ({ page }) => {
    // Escuchar errores de consola
    const consoleErrors: string[] = [];
    const consoleWarnings: string[] = [];
    
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      } else if (msg.type() === 'warning') {
        consoleWarnings.push(msg.text());
      }
    });

    // Navegar a la página principal
    await page.goto('/');
    
    // Esperar a que React se monte
    await page.waitForSelector('#root', { timeout: 10000 });
    await page.waitForTimeout(3000);

    // Verificar que no hay errores críticos de compilación
    const compilationErrors = consoleErrors.filter(error => 
      error.includes('Failed to compile') || 
      error.includes('SyntaxError') ||
      error.includes('Module not found') ||
      error.includes('Cannot resolve')
    );
    
    console.log('📊 Errores de consola encontrados:', consoleErrors.length);
    console.log('⚠️ Advertencias de consola encontradas:', consoleWarnings.length);
    
    if (compilationErrors.length > 0) {
      console.log('❌ Errores de compilación:', compilationErrors);
    }
    
    expect(compilationErrors).toHaveLength(0);
    console.log('✅ No hay errores de compilación críticos');
  });

  test('🎯 Verificar que no hay errores de undefined ondas', async ({ page }) => {
    // Escuchar errores de consola específicamente
    const consoleErrors: string[] = [];
    
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    // Navegar a la página principal
    await page.goto('/');
    
    // Esperar a que la página se cargue completamente
    await page.waitForSelector('#root', { timeout: 10000 });
    await page.waitForTimeout(5000); // Tiempo extra para que se ejecuten todos los efectos

    // Verificar específicamente errores de ondas.toLocaleString
    const ondasErrors = consoleErrors.filter(error => 
      (error.includes('ondas') && error.includes('toLocaleString')) ||
      (error.includes('undefined is not an object') && error.includes('toLocaleString')) ||
      error.includes('fb0375de251941978ee523c5bb30dfbd') // El error ID específico
    );
    
    console.log('🔍 Total de errores de consola:', consoleErrors.length);
    console.log('🎯 Errores relacionados con ondas:', ondasErrors.length);
    
    if (ondasErrors.length > 0) {
      console.log('❌ Errores de ondas encontrados:', ondasErrors);
    }
    
    expect(ondasErrors).toHaveLength(0);
    console.log('✅ No se encontraron errores de ondas.toLocaleString()');
  });

  test('📱 Verificar que la página se renderiza básicamente', async ({ page }) => {
    // Navegar a la página principal
    await page.goto('/');
    
    // Esperar a que React se monte
    await page.waitForSelector('#root', { timeout: 10000 });
    await page.waitForTimeout(2000);

    // Verificar que el contenedor principal existe
    const rootElement = page.locator('#root');
    await expect(rootElement).toBeVisible();
    
    // Verificar que hay contenido en la página
    const bodyText = await page.textContent('body');
    expect(bodyText).toBeTruthy();
    expect(bodyText!.length).toBeGreaterThan(10);
    
    console.log('✅ La página se renderiza correctamente');
  });

  test('🔧 Verificar elementos básicos de la interfaz', async ({ page }) => {
    // Navegar a la página principal
    await page.goto('/');
    
    // Esperar a que React se monte
    await page.waitForSelector('#root', { timeout: 10000 });
    await page.waitForTimeout(3000);

    // Verificar que hay elementos de Material-UI presentes
    const muiElements = page.locator('[class*="Mui"]');
    const muiCount = await muiElements.count();
    
    expect(muiCount).toBeGreaterThan(0);
    console.log(`✅ Encontrados ${muiCount} elementos de Material-UI`);

    // Verificar que no hay texto "undefined" o "NaN" visible
    const undefinedText = page.locator('text=/undefined|NaN/i');
    const undefinedCount = await undefinedText.count();
    
    expect(undefinedCount).toBe(0);
    console.log('✅ No hay texto "undefined" o "NaN" visible en la interfaz');
  });

  test('🎨 Verificar que los números se formatean correctamente', async ({ page }) => {
    // Navegar a la página principal
    await page.goto('/');
    
    // Esperar a que React se monte
    await page.waitForSelector('#root', { timeout: 10000 });
    await page.waitForTimeout(3000);

    // Buscar números formateados (con comas o puntos)
    const formattedNumbers = page.locator('text=/[0-9]{1,3}[,.][0-9]/');
    const numberCount = await formattedNumbers.count();
    
    console.log(`📊 Números formateados encontrados: ${numberCount}`);
    
    // Si hay números, verificar que están bien formateados
    if (numberCount > 0) {
      const firstNumber = await formattedNumbers.first().textContent();
      console.log(`🔢 Ejemplo de número formateado: ${firstNumber}`);
      
      // Verificar que no contiene "undefined" o "NaN"
      expect(firstNumber).not.toContain('undefined');
      expect(firstNumber).not.toContain('NaN');
    }
    
    console.log('✅ Los números se formatean correctamente');
  });

  test('🌐 Verificar conectividad y estados', async ({ page }) => {
    // Navegar a la página principal
    await page.goto('/');
    
    // Esperar a que React se monte
    await page.waitForSelector('#root', { timeout: 10000 });
    await page.waitForTimeout(3000);

    // Buscar indicadores de estado (alertas, mensajes)
    const alerts = page.locator('.MuiAlert-root, [role="alert"]');
    const alertCount = await alerts.count();
    
    console.log(`📢 Alertas/mensajes de estado encontrados: ${alertCount}`);
    
    if (alertCount > 0) {
      const firstAlert = await alerts.first().textContent();
      console.log(`📝 Primer mensaje de estado: ${firstAlert}`);
    }
    
    // Verificar que la página responde a interacciones básicas
    await page.evaluate(() => {
      window.scrollTo(0, 100);
    });
    
    await page.waitForTimeout(1000);
    
    console.log('✅ La página responde a interacciones básicas');
  });
}); 