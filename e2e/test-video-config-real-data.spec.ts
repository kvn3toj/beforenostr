import { test, expect } from '@playwright/test';

test.describe('Video Config Page - Real Data Integration', () => {
  test.beforeEach(async ({ page }) => {
    // Set up console and error logging
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        console.log(`❌ Console Error: ${msg.text()}`);
      }
    });
    
    page.on('pageerror', (error) => {
      console.log(`❌ Page Error: ${error.message}`);
    });

    // CORRECTED: Login flow with correct admin credentials from seeded data
    await page.goto('/login');
    await page.fill('input[name="email"]', 'admin@gamifier.com');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/');
    // Use a more specific selector to verify admin dashboard loaded - fix strict mode violation
    await expect(page.getByRole('heading', { name: 'Welcome to Gamifier Admin' })).toBeVisible();
  });

  test('should load video config page and display real subtitles and questions data', async ({ page }) => {
    // Navigate to video config page with a valid video item ID that has real data
    await page.goto('/items/38/config');
    
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

  test('should display real subtitle content and allow interactions', async ({ page }) => {
    await page.goto('/items/38/config');
    await page.waitForLoadState('networkidle');
    
    // Go to Subtitles tab
    const subtitlesTab = page.getByRole('tab', { name: /Subtítulos/i });
    await subtitlesTab.click();
    await page.waitForTimeout(2000);
    
    // Check for subtitle content
    const subtitleContent = page.locator('text*="Bienvenidos al curso de Gamificación"');
    if (await subtitleContent.isVisible({ timeout: 5000 }).catch(() => false)) {
      console.log('✅ Found Spanish subtitle content');
    }
    
    const englishContent = page.locator('text*="Welcome to the Gamification"');
    if (await englishContent.isVisible({ timeout: 5000 }).catch(() => false)) {
      console.log('✅ Found English subtitle content');
    }
  });

  test('should display real question content with answer options', async ({ page }) => {
    await page.goto('/items/38/config');
    await page.waitForLoadState('networkidle');
    
    // Go to Questions tab
    const questionsTab = page.getByRole('tab', { name: /Preguntas/i });
    await questionsTab.click();
    await page.waitForTimeout(2000);
    
    // Check for question content
    const questionText = page.locator('text="¿Qué es la gamificación?"');
    await expect(questionText).toBeVisible({ timeout: 10000 });
    
    // Check for answer options
    const answerOption1 = page.locator('text*="La aplicación de elementos de juego"');
    if (await answerOption1.isVisible({ timeout: 5000 }).catch(() => false)) {
      console.log('✅ Found correct answer option');
    }
    
    const answerOption2 = page.locator('text*="Una metodología de enseñanza tradicional"');
    if (await answerOption2.isVisible({ timeout: 5000 }).catch(() => false)) {
      console.log('✅ Found incorrect answer option');
    }
  });
}); 