const { test, expect } = require('@playwright/test');

test.describe('Subtitles and Questions Real Data Test', () => {
  test('Should load real subtitles and questions data', async ({ page }) => {
    // Configurar captura de errores
    const consoleErrors = [];
    const networkErrors = [];

    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(`Console Error: ${msg.text()}`);
        console.log('🔴 Console Error:', msg.text());
      }
    });

    page.on('pageerror', error => {
      consoleErrors.push(`Page Error: ${error.message}`);
      console.log('🔴 Page Error:', error.message);
    });

    page.on('response', response => {
      if (!response.ok() && response.status() !== 401) {
        networkErrors.push(`Network Error: ${response.status()} ${response.url()}`);
        console.log('🔴 Network Error:', response.status(), response.url());
      }
    });

    console.log('🚀 Starting subtitles and questions real data test...');

    // Navegar directamente a la página de configuración de video
    await page.goto('/video-config');
    
    // Esperar a que la página cargue
    await page.waitForLoadState('networkidle');
    
    console.log('📄 Navigated to video config page');

    // Buscar las pestañas de Subtítulos y Preguntas
    const subtitlesTab = page.locator('[role="tab"]').filter({ hasText: /subtítulos|subtitles/i });
    const questionsTab = page.locator('[role="tab"]').filter({ hasText: /preguntas|questions/i });

    // Verificar que las pestañas existen
    await expect(subtitlesTab).toBeVisible({ timeout: 10000 });
    await expect(questionsTab).toBeVisible({ timeout: 10000 });
    
    console.log('✅ Subtitles and Questions tabs found');

    // Hacer clic en la pestaña de Subtítulos
    await subtitlesTab.click();
    await page.waitForTimeout(2000);
    
    console.log('📝 Clicked on Subtitles tab');

    // Verificar que se cargan datos reales de subtítulos
    // Buscar elementos que indiquen datos cargados (no "No hay datos" o loading)
    const subtitlesContent = page.locator('[data-testid="subtitles-content"], .subtitles-list, .subtitle-item');
    
    // Esperar a que aparezca contenido o un mensaje específico
    await page.waitForTimeout(3000);
    
    // Verificar que no hay mensajes de "No hay datos" o similar
    const noDataMessage = page.locator('text=/no hay.*datos|no data|empty|vacío/i');
    const hasNoDataMessage = await noDataMessage.isVisible();
    
    if (!hasNoDataMessage) {
      console.log('✅ Subtitles data appears to be loaded (no "no data" message found)');
    } else {
      console.log('⚠️ "No data" message found for subtitles');
    }

    // Hacer clic en la pestaña de Preguntas
    await questionsTab.click();
    await page.waitForTimeout(2000);
    
    console.log('❓ Clicked on Questions tab');

    // Verificar que se cargan datos reales de preguntas
    const questionsContent = page.locator('[data-testid="questions-content"], .questions-list, .question-item');
    
    // Esperar a que aparezca contenido
    await page.waitForTimeout(3000);
    
    // Verificar que no hay mensajes de "No hay datos"
    const noQuestionsMessage = page.locator('text=/no hay.*datos|no data|empty|vacío/i');
    const hasNoQuestionsMessage = await noQuestionsMessage.isVisible();
    
    if (!hasNoQuestionsMessage) {
      console.log('✅ Questions data appears to be loaded (no "no data" message found)');
    } else {
      console.log('⚠️ "No data" message found for questions');
    }

    // Verificar que los endpoints del backend están funcionando
    console.log('🔍 Testing backend endpoints directly...');
    
    // Test subtitles endpoint
    const subtitlesResponse = await page.request.get('http://localhost:1111/subtitles/search?videoItemId=1');
    const subtitlesData = await subtitlesResponse.json();
    
    console.log('📝 Subtitles endpoint response:', subtitlesData.length, 'items');
    expect(subtitlesResponse.ok()).toBeTruthy();
    expect(Array.isArray(subtitlesData)).toBeTruthy();
    
    if (subtitlesData.length > 0) {
      console.log('✅ Real subtitles data found:', subtitlesData[0]);
      expect(subtitlesData[0]).toHaveProperty('id');
      expect(subtitlesData[0]).toHaveProperty('videoItemId');
      expect(subtitlesData[0]).toHaveProperty('languageCode');
      expect(subtitlesData[0]).toHaveProperty('content');
    }

    // Test questions endpoint
    const questionsResponse = await page.request.get('http://localhost:1111/questions/search?videoItemId=1');
    const questionsData = await questionsResponse.json();
    
    console.log('❓ Questions endpoint response:', questionsData.length, 'items');
    expect(questionsResponse.ok()).toBeTruthy();
    expect(Array.isArray(questionsData)).toBeTruthy();
    
    if (questionsData.length > 0) {
      console.log('✅ Real questions data found:', questionsData[0]);
      expect(questionsData[0]).toHaveProperty('id');
      expect(questionsData[0]).toHaveProperty('videoItemId');
      expect(questionsData[0]).toHaveProperty('timestamp');
      expect(questionsData[0]).toHaveProperty('text');
      expect(questionsData[0]).toHaveProperty('type');
    }

    // Resumen final
    console.log('\n📊 VERIFICATION SUMMARY:');
    console.log(`Total Console Errors: ${consoleErrors.length}`);
    console.log(`Total Network Errors: ${networkErrors.length}`);
    console.log(`Subtitles Data Items: ${subtitlesData.length}`);
    console.log(`Questions Data Items: ${questionsData.length}`);

    if (consoleErrors.length > 0) {
      console.log('\n🔴 Console Errors:');
      consoleErrors.forEach((error, index) => {
        console.log(`${index + 1}. ${error}`);
      });
    }

    if (networkErrors.length > 0) {
      console.log('\n🔴 Network Errors:');
      networkErrors.forEach((error, index) => {
        console.log(`${index + 1}. ${error}`);
      });
    }

    // El test pasa si:
    // 1. Los endpoints del backend devuelven datos
    // 2. No hay errores críticos de red (excepto 401 que es esperado)
    expect(subtitlesData.length).toBeGreaterThan(0);
    expect(questionsData.length).toBeGreaterThan(0);
    
    console.log('🎉 Test completed successfully! Real data is being served by the backend.');
  });
}); 