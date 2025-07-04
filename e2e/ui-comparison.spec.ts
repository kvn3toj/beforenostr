import { test, expect } from '@playwright/test';

test.describe('UI Comparison Screenshots', () => {
  test.beforeEach(async ({ page }) => {
    // Configurar listeners para errores
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        console.log(`Console error: ${msg.text()}`);
      }
    });
    
    page.on('pageerror', (err) => {
      console.log(`Page error: ${err.message}`);
    });

    // Realizar login
    await page.goto('/login');
    await page.fill('input[name="email"]', 'admin@gamifier.com');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/');
    
    // Usar un selector más específico para evitar strict mode violation
    await expect(page.getByRole('heading', { name: 'Gamifier Admin', exact: true }).first()).toBeVisible();
  });

  test('should capture subtitles tab screenshot', async ({ page }) => {
    // Navegar directamente a la página de configuración de video con un ID que exista
    const testVideoId = '51'; // ID que se usa en otros tests
    await page.goto(`/items/${testVideoId}/config`);
    await page.waitForTimeout(3000); // Más tiempo para cargar
    
    // Buscar pestañas o contenido relacionado con subtítulos
    const subtitlesTab = page.locator('button[role="tab"]:has-text("Subtítulos"), button[role="tab"]:has-text("Subtitles")');
    if (await subtitlesTab.isVisible()) {
      await subtitlesTab.click();
      await page.waitForTimeout(2000);
      
      // Capturar pantalla completa
      await page.screenshot({ 
        path: 'test-results/subtitles_tab_real_data.png',
        fullPage: true 
      });
      
      // También capturar solo el panel de subtítulos si existe
      const subtitlesPanel = page.locator('div[role="tabpanel"]').first();
      if (await subtitlesPanel.isVisible()) {
        await subtitlesPanel.screenshot({
          path: 'test-results/subtitles_panel_focused.png'
        });
      }
      console.log('✅ Captura de pantalla de subtítulos generada');
    } else {
      // Si no encontramos la página, capturar la página actual para debug
      await page.screenshot({ 
        path: 'test-results/subtitles_debug_page.png',
        fullPage: true 
      });
      console.log('❌ No se encontró la pestaña de subtítulos');
    }
  });

  test('should capture questions tab screenshot', async ({ page }) => {
    // Navegar directamente a la página de configuración de video con un ID que exista
    const testVideoId = '51'; // ID que se usa en otros tests
    await page.goto(`/items/${testVideoId}/config`);
    await page.waitForTimeout(3000); // Más tiempo para cargar
    
    // Buscar pestañas o contenido relacionado con preguntas
    const questionsTab = page.locator('button[role="tab"]:has-text("Preguntas"), button[role="tab"]:has-text("Questions")');
    if (await questionsTab.isVisible()) {
      await questionsTab.click();
      await page.waitForTimeout(2000);
      
      // Capturar pantalla completa
      await page.screenshot({ 
        path: 'test-results/questions_tab_real_data.png',
        fullPage: true 
      });
      
      // También capturar solo el panel de preguntas si existe
      const questionsPanel = page.locator('div[role="tabpanel"]').first();
      if (await questionsPanel.isVisible()) {
        await questionsPanel.screenshot({
          path: 'test-results/questions_panel_focused.png'
        });
      }
      console.log('✅ Captura de pantalla de preguntas generada');
    } else {
      // Si no encontramos la página, capturar la página actual para debug
      await page.screenshot({ 
        path: 'test-results/questions_debug_page.png',
        fullPage: true 
      });
      console.log('❌ No se encontró la pestaña de preguntas');
    }
  });
}); 