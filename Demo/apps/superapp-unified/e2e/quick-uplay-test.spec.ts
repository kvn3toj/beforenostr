import { test, expect } from '@playwright/test';

test.describe('UPlay Mock Diagnosis', () => {
  test('should diagnose UPlay video loading with mocks', async ({ page }) => {
    console.log('🚨 DIAGNÓSTICO: Verificando carga de videos en UPlay...');

    // Interceptar llamadas de red para ver qué está sucediendo
    const apiCalls: Array<{url: string, method: string}> = [];
    page.on('request', request => {
      if (request.url().includes('/video-items') || request.url().includes('/videos')) {
        apiCalls.push({
          url: request.url(),
          method: request.method()
        });
        console.log(`🌐 API Call intercepted: ${request.method()} ${request.url()}`);
      }
    });

    page.on('response', response => {
      if (response.url().includes('/video-items') || response.url().includes('/videos')) {
        console.log(`📥 API Response: ${response.status()} ${response.url()}`);
      }
    });

    // Capturar logs de consola
    page.on('console', msg => {
      if (msg.text().includes('MOCK') || msg.text().includes('video') || msg.text().includes('API')) {
        console.log(`🎯 Console: ${msg.text()}`);
      }
    });

    // Navegar a UPlay
    await page.goto('/uplay');
    console.log('✅ Navegación a UPlay completada');

    // Esperar un momento para que la página cargue
    await page.waitForTimeout(3000);

    // Verificar si VITE_ENABLE_MOCK_AUTH está activado
    const mockAuthEnabled = await page.evaluate(() => {
      return import.meta.env.VITE_ENABLE_MOCK_AUTH;
    });
    console.log(`🔧 VITE_ENABLE_MOCK_AUTH: ${mockAuthEnabled}`);

    // Buscar elementos de video de diferentes formas
    const videoCards = await page.locator('[data-testid="video-card"]').count();
    const muiCards = await page.locator('.MuiCard-root').count();
    const videoElements = await page.locator('video').count();
    const loadingElements = await page.locator('text=Cargando').count();
    const errorElements = await page.locator('text=Error').count();

    console.log(`📊 CONTADORES:
    - Video cards: ${videoCards}
    - MUI cards: ${muiCards}
    - Video elements: ${videoElements}
    - Loading elements: ${loadingElements}
    - Error elements: ${errorElements}
    - API calls made: ${apiCalls.length}`);

    // Mostrar el contenido de la página para debug
    const pageContent = await page.content();
    console.log(`📄 Page title: ${await page.title()}`);

    // Verificar si hay algún mensaje de error o loading visible
    const visibleText = await page.locator('body').textContent();
    console.log(`📝 Visible text includes:
    - "Cargando": ${visibleText?.includes('Cargando')}
    - "Error": ${visibleText?.includes('Error')}
    - "video": ${visibleText?.includes('video')}
    - "UPlay": ${visibleText?.includes('UPlay')}`);

    // Tomar screenshot para debug
    await page.screenshot({ path: 'debug-uplay-state.png', fullPage: true });

    console.log(`🔍 RESUMEN DIAGNÓSTICO:
    - Mock Auth Enabled: ${mockAuthEnabled}
    - API Calls: ${apiCalls.length}
    - Video Cards Found: ${videoCards}
    - Page loaded successfully: ${pageContent.includes('UPlay') || pageContent.includes('CoomÜnity')}`);

    // No hacer assertions que fallen, solo diagnosticar
    expect(true).toBe(true); // Always pass, this is just for diagnosis
  });
});
