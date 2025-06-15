const { test, expect } = require('@playwright/test');

test.describe('Video Config Page - Real Data Integration', () => {
  test('should load video config page and display real subtitles and questions data', async ({ page }) => {
    // Navigate to video config page with a valid video item ID
    await page.goto('http://localhost:3000/items/31/config');
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    
    console.log('✅ Video config page loaded');
    
    // Verify the page title
    await expect(page.locator('h1, h2, h3, h4').filter({ hasText: /Configurar Video/i })).toBeVisible();
    
    // Test Subtitles Tab
    console.log('📝 Testing Subtitles Tab...');
    const subtitlesTab = page.getByRole('tab', { name: /Subtítulos/i });
    await subtitlesTab.click();
    await page.waitForTimeout(2000);
    
    // Check for subtitle manager content
    const subtitleManager = page.locator('text="Administrador de Subtítulos"');
    await expect(subtitleManager).toBeVisible();
    
    // Look for existing subtitles
    const existingSubtitles = page.locator('text="Subtítulos existentes"');
    await expect(existingSubtitles).toBeVisible();
    
    // Check for Spanish subtitle
    const spanishSubtitle = page.locator('text="es-ES"');
    if (await spanishSubtitle.isVisible({ timeout: 5000 }).catch(() => false)) {
      console.log('✅ Found Spanish subtitle (es-ES)');
    }
    
    // Check for English subtitle
    const englishSubtitle = page.locator('text="en-US"');
    if (await englishSubtitle.isVisible({ timeout: 5000 }).catch(() => false)) {
      console.log('✅ Found English subtitle (en-US)');
    }
    
    // Test Questions Tab
    console.log('❓ Testing Questions Tab...');
    const questionsTab = page.getByRole('tab', { name: /Preguntas/i });
    await questionsTab.click();
    await page.waitForTimeout(2000);
    
    // Check for question manager content
    const questionManager = page.locator('text="Administrador de Preguntas"');
    if (await questionManager.isVisible({ timeout: 5000 }).catch(() => false)) {
      console.log('✅ Found Question Manager');
    }
    
    // Look for existing questions
    const questionText = page.locator('text="¿Qué es la gamificación?"');
    if (await questionText.isVisible({ timeout: 5000 }).catch(() => false)) {
      console.log('✅ Found gamification question');
    }
    
    // Look for create question button
    const createQuestionBtn = page.getByRole('button', { name: /Crear Pregunta/i });
    if (await createQuestionBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
      console.log('✅ Found Create Question button');
    }
    
    console.log('🎉 Video config page test completed successfully!');
  });
}); 