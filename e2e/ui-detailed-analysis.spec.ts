import { test, expect } from '@playwright/test';

test.describe('Detailed UI Analysis for Wireframe Comparison', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="email"]', 'admin@gamifier.com');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/');
    await expect(page.getByRole('heading', { name: 'Gamifier Admin', exact: true }).first()).toBeVisible();
  });

  test('detailed subtitles tab analysis', async ({ page }) => {
    const testVideoId = '51';
    await page.goto(`/items/${testVideoId}/config`);
    await page.waitForTimeout(3000);
    
    // Hacer clic en la pestaña de Subtítulos
    const subtitlesTab = page.locator('button[role="tab"]:has-text("Subtitles")');
    await subtitlesTab.click();
    await page.waitForTimeout(3000);
    
    console.log('\n📊 ANÁLISIS DETALLADO - PESTAÑA SUBTÍTULOS:');
    
    // Analizar el contenido completo del panel
    const activeTabPanel = page.locator('div[role="tabpanel"]:not([hidden])');
    
    if (await activeTabPanel.isVisible()) {
      console.log('✅ Panel de subtítulos visible');
      
      // Capturar todo el texto visible en el panel
      const allText = await activeTabPanel.textContent();
      console.log('📝 Texto completo del panel:');
      console.log(allText?.slice(0, 500) + '...');
      
      // Analizar todos los elementos visibles
      const allElements = await activeTabPanel.locator('*:visible').all();
      console.log(`🔢 Total elementos visibles: ${allElements.length}`);
      
      // Buscar elementos específicos
      const headings = await activeTabPanel.locator('h1, h2, h3, h4, h5, h6').allTextContents();
      console.log(`📋 Títulos encontrados: ${JSON.stringify(headings)}`);
      
      const buttons = await activeTabPanel.locator('button').allTextContents();
      console.log(`🔘 Botones encontrados: ${JSON.stringify(buttons.slice(0, 10))}`);
      
      const inputs = await activeTabPanel.locator('input').count();
      console.log(`📝 Campos input: ${inputs}`);
      
      // Buscar elementos de lista o tabla
      const listItems = await activeTabPanel.locator('li').count();
      const tableRows = await activeTabPanel.locator('tr').count();
      console.log(`📊 Elementos de lista: ${listItems}, Filas de tabla: ${tableRows}`);
      
      // Buscar elementos específicos de subtítulos
      const subtitleElements = await activeTabPanel.locator('*:has-text("subtitle"), *:has-text("idioma"), *:has-text("language")').count();
      console.log(`🎬 Elementos específicos de subtítulos: ${subtitleElements}`);
      
      // Tomar screenshot del panel específico
      await activeTabPanel.screenshot({
        path: 'test-results/subtitles_panel_detailed.png'
      });
      
    } else {
      console.log('❌ Panel de subtítulos no visible');
      
      // Debug: mostrar todos los paneles disponibles
      const allPanels = page.locator('div[role="tabpanel"]');
      const panelCount = await allPanels.count();
      console.log(`🔍 Total paneles encontrados: ${panelCount}`);
      
      for (let i = 0; i < panelCount; i++) {
        const panel = allPanels.nth(i);
        const isHidden = await panel.getAttribute('hidden');
        const text = await panel.textContent();
        console.log(`   Panel ${i + 1}: Hidden=${isHidden}, Texto: ${text?.slice(0, 100)}...`);
      }
    }
  });

  test('detailed questions tab analysis', async ({ page }) => {
    const testVideoId = '51';
    await page.goto(`/items/${testVideoId}/config`);
    await page.waitForTimeout(3000);
    
    // Hacer clic en la pestaña de Preguntas
    const questionsTab = page.locator('button[role="tab"]:has-text("Questions")');
    await questionsTab.click();
    await page.waitForTimeout(3000);
    
    console.log('\n❓ ANÁLISIS DETALLADO - PESTAÑA PREGUNTAS:');
    
    // Analizar el contenido completo del panel
    const activeTabPanel = page.locator('div[role="tabpanel"]:not([hidden])');
    
    if (await activeTabPanel.isVisible()) {
      console.log('✅ Panel de preguntas visible');
      
      // Capturar todo el texto visible en el panel
      const allText = await activeTabPanel.textContent();
      console.log('📝 Texto completo del panel:');
      console.log(allText?.slice(0, 500) + '...');
      
      // Analizar elementos específicos de preguntas
      const headings = await activeTabPanel.locator('h1, h2, h3, h4, h5, h6').allTextContents();
      console.log(`📋 Títulos encontrados: ${JSON.stringify(headings)}`);
      
      const buttons = await activeTabPanel.locator('button').allTextContents();
      console.log(`🔘 Botones encontrados: ${JSON.stringify(buttons.slice(0, 10))}`);
      
      // Buscar elementos específicos de preguntas
      const questionElements = await activeTabPanel.locator('*:has-text("pregunta"), *:has-text("question")').count();
      const binaryElements = await activeTabPanel.locator('*:has-text("verdadero"), *:has-text("falso"), *:has-text("true"), *:has-text("false")').count();
      console.log(`❓ Elementos de pregunta: ${questionElements}, Elementos binarios: ${binaryElements}`);
      
      const listItems = await activeTabPanel.locator('li').count();
      console.log(`📋 Items de lista: ${listItems}`);
      
      // Tomar screenshot del panel específico
      await activeTabPanel.screenshot({
        path: 'test-results/questions_panel_detailed.png'
      });
      
    } else {
      console.log('❌ Panel de preguntas no visible');
    }
  });

  test('capture wireframe reference screenshots', async ({ page }) => {
    console.log('\n📸 GENERANDO SCREENSHOTS DE REFERENCIA ADICIONALES:');
    
    const testVideoId = '51';
    await page.goto(`/items/${testVideoId}/config`);
    await page.waitForTimeout(3000);
    
    // Screenshot de la página completa en estado inicial
    await page.screenshot({
      path: 'test-results/video_config_page_full.png',
      fullPage: true
    });
    
    // Screenshot solo de la zona de pestañas
    const tabsContainer = page.locator('[role="tablist"]');
    if (await tabsContainer.isVisible()) {
      await tabsContainer.screenshot({
        path: 'test-results/tabs_container.png'
      });
    }
    
    // Screenshots de cada pestaña individualmente
    const tabNames = ['Subtitles', 'Questions'];
    
    for (const tabName of tabNames) {
      const tab = page.locator(`button[role="tab"]:has-text("${tabName}")`);
      if (await tab.isVisible()) {
        await tab.click();
        await page.waitForTimeout(2000);
        
        // Screenshot del área de contenido de la pestaña
        const contentArea = page.locator('div[role="tabpanel"]:not([hidden])');
        if (await contentArea.isVisible()) {
          await contentArea.screenshot({
            path: `test-results/${tabName.toLowerCase()}_content_area.png`
          });
        }
      }
    }
    
    console.log('✅ Screenshots de referencia generados');
  });
}); 