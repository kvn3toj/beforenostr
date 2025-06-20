import { test, expect } from '@playwright/test';

test.describe('Subtitle and Questions Manager - Real Data E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Capturar errores de consola y página
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log('Browser console error:', msg.text());
      }
    });
    
    page.on('pageerror', error => {
      console.log('Browser page error:', error.message);
    });

    // Autenticación como administrador
    await page.goto('/login');
    await page.fill('input[name="email"]', 'admin@gamifier.com');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/');
    await expect(page.getByRole('heading', { name: 'Gamifier Admin' }).first()).toBeVisible();
  });

  test('should load subtitles tab and call API for videoItemId=2', async ({ page }) => {
    // Interceptar llamadas a la API
    let subtitlesApiCalled = false;
    
    page.on('request', request => {
      const url = request.url();
      if (url.includes('/subtitles/search?videoItemId=2')) {
        subtitlesApiCalled = true;
        console.log('Subtitles API called:', url);
      }
    });

    // Navegar a la página de configuración de video con un videoItemId que tiene datos reales
    await page.goto('/items/2/config');
    
    // Esperar a que la página cargue y hacer clic en la pestaña de Subtítulos
    await page.getByRole('tab', { name: /subtítulos|subtitles/i }).click();
    
    // Verificar que el administrador de subtítulos sea visible
    await expect(page.getByRole('heading', { name: /administrador de subtítulos|subtitle manager/i })).toBeVisible();
    
    // Esperar a que los datos se carguen
    await page.waitForTimeout(3000);
    
    // Verificar que la API fue llamada
    expect(subtitlesApiCalled).toBe(true);
    
    // Verificar que hay algún contenido de subtítulos (más flexible)
    const subtitleElements = page.locator('[data-testid*="subtitle"], .subtitle, [class*="subtitle"]');
    const hasSubtitleContent = await subtitleElements.count() > 0;
    
    if (!hasSubtitleContent) {
      // Si no hay elementos específicos, verificar que al menos no hay mensaje de error
      const errorMessage = page.getByText(/error|failed|falló/i);
      await expect(errorMessage).not.toBeVisible();
    }
  });

  test('should load questions tab and call API for videoItemId=2', async ({ page }) => {
    // Interceptar llamadas a la API
    let questionsApiCalled = false;
    
    page.on('request', request => {
      const url = request.url();
      if (url.includes('/questions/search?videoItemId=2')) {
        questionsApiCalled = true;
        console.log('Questions API called:', url);
      }
    });

    // Navegar a la página de configuración de video con un videoItemId que tiene datos reales
    await page.goto('/items/2/config');
    
    // Esperar a que la página cargue y hacer clic en la pestaña de Preguntas
    await page.getByRole('tab', { name: /preguntas|questions/i }).click();
    
    // Verificar que el administrador de preguntas sea visible
    await expect(page.getByRole('heading', { name: /administrador de preguntas|question manager/i })).toBeVisible();
    
    // Esperar a que los datos se carguen
    await page.waitForTimeout(3000);
    
    // Verificar que la API fue llamada
    expect(questionsApiCalled).toBe(true);
    
    // Verificar que hay algún contenido de preguntas (más flexible)
    const questionElements = page.locator('[data-testid*="question"], .question, [class*="question"]');
    const hasQuestionContent = await questionElements.count() > 0;
    
    if (!hasQuestionContent) {
      // Si no hay elementos específicos, verificar que al menos no hay mensaje de error
      const errorMessage = page.getByText(/error|failed|falló/i);
      await expect(errorMessage).not.toBeVisible();
    }
  });

  test('should verify both APIs are called when switching tabs', async ({ page }) => {
    // Interceptar las llamadas a la API para verificar que se estén haciendo correctamente
    let subtitlesApiCalled = false;
    let questionsApiCalled = false;
    
    page.on('request', request => {
      const url = request.url();
      if (url.includes('/subtitles/search')) {
        subtitlesApiCalled = true;
        console.log('Subtitles API called:', url);
      }
      if (url.includes('/questions/search')) {
        questionsApiCalled = true;
        console.log('Questions API called:', url);
      }
    });
    
    // Navegar a la página de configuración
    await page.goto('/items/2/config');
    
    // Hacer clic en la pestaña de Subtítulos
    await page.getByRole('tab', { name: /subtítulos|subtitles/i }).click();
    await page.waitForTimeout(1000);
    
    // Hacer clic en la pestaña de Preguntas
    await page.getByRole('tab', { name: /preguntas|questions/i }).click();
    await page.waitForTimeout(1000);
    
    // Verificar que las APIs fueron llamadas
    expect(subtitlesApiCalled).toBe(true);
    expect(questionsApiCalled).toBe(true);
  });
}); 