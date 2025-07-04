import { test, expect } from '@playwright/test';

test.describe('UI Structure Analysis for Wireframe Comparison', () => {
  test.beforeEach(async ({ page }) => {
    // Realizar login
    await page.goto('/login');
    await page.fill('input[name="email"]', 'admin@gamifier.com');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/');
    await expect(page.getByRole('heading', { name: 'Gamifier Admin', exact: true }).first()).toBeVisible();
  });

  test('analyze subtitles tab structure', async ({ page }) => {
    const testVideoId = '51';
    await page.goto(`/items/${testVideoId}/config`);
    await page.waitForTimeout(3000);
    
    // Hacer clic en la pestaña de Subtítulos
    const subtitlesTab = page.locator('button[role="tab"]:has-text("Subtítulos"), button[role="tab"]:has-text("Subtitles")');
    await subtitlesTab.click();
    await page.waitForTimeout(2000);
    
    console.log('\n🔍 ANÁLISIS ESTRUCTURA PESTAÑA SUBTÍTULOS:');
    
    // Analizar título/cabecera
    const pageTitle = page.getByRole('heading', { level: 1 });
    if (await pageTitle.isVisible()) {
      const titleText = await pageTitle.textContent();
      console.log(`📋 Título Principal: "${titleText}"`);
    }
    
    // Analizar pestañas
    const allTabs = page.locator('button[role="tab"]');
    const tabCount = await allTabs.count();
    console.log(`📊 Número de pestañas: ${tabCount}`);
    for (let i = 0; i < tabCount; i++) {
      const tabText = await allTabs.nth(i).textContent();
      const isSelected = await allTabs.nth(i).getAttribute('aria-selected');
      console.log(`   - Pestaña ${i + 1}: "${tabText}" (Seleccionada: ${isSelected})`);
    }
    
    // Analizar contenido del panel de subtítulos
    const tabPanel = page.locator('div[role="tabpanel"]').first();
    if (await tabPanel.isVisible()) {
      console.log('📦 Contenido del Panel de Subtítulos:');
      
      // Buscar título del panel
      const panelHeading = tabPanel.locator('h1, h2, h3, h4, h5, h6').first();
      if (await panelHeading.isVisible()) {
        const headingText = await panelHeading.textContent();
        console.log(`   📝 Título del Panel: "${headingText}"`);
      }
      
      // Buscar botones principales
      const buttons = tabPanel.locator('button:visible');
      const buttonCount = await buttons.count();
      console.log(`   🔘 Número de botones: ${buttonCount}`);
      for (let i = 0; i < Math.min(buttonCount, 5); i++) {
        const buttonText = await buttons.nth(i).textContent();
        console.log(`     - Botón ${i + 1}: "${buttonText?.trim()}"`);
      }
      
      // Buscar tabla o lista de elementos
      const table = tabPanel.locator('table').first();
      const list = tabPanel.locator('ul, ol').first();
      if (await table.isVisible()) {
        console.log('   📊 Contiene: TABLA');
        const rows = table.locator('tr');
        const rowCount = await rows.count();
        console.log(`     - Filas: ${rowCount}`);
      } else if (await list.isVisible()) {
        console.log('   📋 Contiene: LISTA');
        const items = list.locator('li');
        const itemCount = await items.count();
        console.log(`     - Items: ${itemCount}`);
      }
      
      // Buscar formularios o campos de entrada
      const inputs = tabPanel.locator('input:visible');
      const textareas = tabPanel.locator('textarea:visible');
      const selects = tabPanel.locator('select:visible');
      console.log(`   📝 Campos de formulario: ${await inputs.count()} inputs, ${await textareas.count()} textareas, ${await selects.count()} selects`);
      
      // Buscar elementos de estado (vacío, carga, etc.)
      const emptyState = tabPanel.locator(':has-text("No hay"), :has-text("vacío"), :has-text("empty")').first();
      if (await emptyState.isVisible()) {
        const emptyText = await emptyState.textContent();
        console.log(`   ⚪ Estado vacío detectado: "${emptyText?.trim()}"`);
      }
    }
    
    // Capturar información de colores y estilos básicos
    const tabPanelStyles = await tabPanel.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return {
        backgroundColor: styles.backgroundColor,
        padding: styles.padding,
        border: styles.border
      };
    });
    console.log(`   🎨 Estilos básicos del panel: ${JSON.stringify(tabPanelStyles)}`);
  });

  test('analyze questions tab structure', async ({ page }) => {
    const testVideoId = '51';
    await page.goto(`/items/${testVideoId}/config`);
    await page.waitForTimeout(3000);
    
    // Hacer clic en la pestaña de Preguntas
    const questionsTab = page.locator('button[role="tab"]:has-text("Preguntas"), button[role="tab"]:has-text("Questions")');
    await questionsTab.click();
    await page.waitForTimeout(2000);
    
    console.log('\n🔍 ANÁLISIS ESTRUCTURA PESTAÑA PREGUNTAS:');
    
    // Analizar pestañas (mismo análisis que en subtítulos)
    const allTabs = page.locator('button[role="tab"]');
    const tabCount = await allTabs.count();
    console.log(`📊 Número de pestañas: ${tabCount}`);
    for (let i = 0; i < tabCount; i++) {
      const tabText = await allTabs.nth(i).textContent();
      const isSelected = await allTabs.nth(i).getAttribute('aria-selected');
      console.log(`   - Pestaña ${i + 1}: "${tabText}" (Seleccionada: ${isSelected})`);
    }
    
    // Analizar contenido del panel de preguntas
    const tabPanel = page.locator('div[role="tabpanel"]').first();
    if (await tabPanel.isVisible()) {
      console.log('📦 Contenido del Panel de Preguntas:');
      
      // Buscar título del panel
      const panelHeading = tabPanel.locator('h1, h2, h3, h4, h5, h6').first();
      if (await panelHeading.isVisible()) {
        const headingText = await panelHeading.textContent();
        console.log(`   📝 Título del Panel: "${headingText}"`);
      }
      
      // Buscar botones principales
      const buttons = tabPanel.locator('button:visible');
      const buttonCount = await buttons.count();
      console.log(`   🔘 Número de botones: ${buttonCount}`);
      for (let i = 0; i < Math.min(buttonCount, 5); i++) {
        const buttonText = await buttons.nth(i).textContent();
        console.log(`     - Botón ${i + 1}: "${buttonText?.trim()}"`);
      }
      
      // Buscar lista de preguntas
      const questionsList = tabPanel.locator('[data-testid*="question"], .question-item, li').first();
      if (await questionsList.isVisible()) {
        console.log('   ❓ Contiene lista de preguntas');
        const questionItems = tabPanel.locator('[data-testid*="question"], .question-item, li');
        const questionCount = await questionItems.count();
        console.log(`     - Número de preguntas: ${questionCount}`);
      }
      
      // Buscar elementos específicos de preguntas binarias
      const binaryElements = tabPanel.locator(':has-text("Verdadero"), :has-text("Falso"), :has-text("True"), :has-text("False")');
      const binaryCount = await binaryElements.count();
      if (binaryCount > 0) {
        console.log(`   ⚡ Elementos de preguntas binarias detectados: ${binaryCount}`);
      }
      
      // Buscar formularios
      const inputs = tabPanel.locator('input:visible');
      const textareas = tabPanel.locator('textarea:visible');
      console.log(`   📝 Campos de formulario: ${await inputs.count()} inputs, ${await textareas.count()} textareas`);
      
      // Buscar elementos de estado
      const emptyState = tabPanel.locator(':has-text("No hay"), :has-text("vacío"), :has-text("empty")').first();
      if (await emptyState.isVisible()) {
        const emptyText = await emptyState.textContent();
        console.log(`   ⚪ Estado vacío detectado: "${emptyText?.trim()}"`);
      }
    }
  });
}); 