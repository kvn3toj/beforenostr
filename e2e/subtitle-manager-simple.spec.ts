import { test, expect } from '@playwright/test';

test.describe('Subtitle Manager Simple Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Mock API responses para evitar errores de Supabase
    await page.route('**/rest/v1/**', async route => {
      const url = route.request().url();
      
      if (url.includes('playlist_items')) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([{
            id: 123,
            title: 'Test Video',
            description: 'Test Description',
            content: '<iframe src="https://example.com/video"></iframe>',
            order_index: 1,
            playlist_id: 'playlist-1',
            created_at: '2024-01-01',
            updated_at: '2024-01-01',
          }])
        });
      } else if (url.includes('categories')) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([
            { id: '1', name: 'Category 1' },
            { id: '2', name: 'Category 2' }
          ])
        });
      } else if (url.includes('item_categories')) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([])
        });
      } else if (url.includes('subtitles')) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([
            {
              id: 1,
              videoItemId: 123,
              language: 'es',
              filename: 'subtitle-es.vtt',
              fileUrl: 'https://example.com/subtitle-es.vtt',
              isActive: true,
              createdAt: '2024-01-01',
              updatedAt: '2024-01-01',
            }
          ])
        });
      } else {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([])
        });
      }
    });

    await page.goto('/items/test-video-id/config');
    await page.getByRole('tab', { name: /subtítulos|subtitles/i }).click();
  });

  test('should render basic subtitle manager elements', async ({ page }) => {
    // Take screenshot for debugging
    await page.screenshot({ path: 'subtitle-manager-debug.png', fullPage: true });
    
    // Check if subtitle manager title exists
    const subtitleManagerTitle = page.getByRole('heading', { name: /administrador de subtítulos|subtitle manager/i });
    await expect(subtitleManagerTitle).toBeVisible();
    
    // Check if upload form title exists
    const uploadFormTitle = page.getByRole('heading', { name: /cargar nuevo subtítulo|upload new subtitle/i });
    await expect(uploadFormTitle).toBeVisible();
    
    // Check for file selection button (using text content)
    const fileButton = page.getByText(/seleccionar archivo|select file/i);
    await expect(fileButton).toBeVisible();
    
    // Check for language select (using MUI Select structure)
    const languageSelect = page.locator('[role="button"]').filter({ hasText: /idioma|language/i });
    await expect(languageSelect).toBeVisible();
    
    // Check for format select
    const formatSelect = page.locator('[role="button"]').filter({ hasText: /formato|format/i });
    await expect(formatSelect).toBeVisible();
    
    // Check for upload button
    const uploadButton = page.getByRole('button', { name: /cargar subtítulo|upload subtitle/i });
    await expect(uploadButton).toBeVisible();
    await expect(uploadButton).toBeDisabled(); // Should be disabled initially
    
    // Check for existing subtitles section
    const existingSubtitlesTitle = page.getByRole('heading', { name: /subtítulos existentes|existing subtitles/i });
    await expect(existingSubtitlesTitle).toBeVisible();
    
    console.log('✅ All basic elements found successfully!');
  });

  test('should show subtitle list items', async ({ page }) => {
    // Look for subtitle items in the list
    const subtitleItems = page.locator('text=subtitle-es.vtt');
    await expect(subtitleItems).toBeVisible();
    
    // Look for language indicator
    const languageIndicator = page.locator('text=es');
    await expect(languageIndicator).toBeVisible();
    
    console.log('✅ Subtitle list items found!');
  });

  test('should be able to click language select', async ({ page }) => {
    // Find and click the language select
    const languageSelect = page.locator('[role="button"]').filter({ hasText: /idioma|language/i });
    await languageSelect.click();
    
    // Check if options appear
    const spanishOption = page.getByRole('option', { name: /español/i });
    await expect(spanishOption).toBeVisible();
    
    const englishOption = page.getByRole('option', { name: /english/i });
    await expect(englishOption).toBeVisible();
    
    // Select Spanish
    await spanishOption.click();
    
    console.log('✅ Language selection works!');
  });

  test('should be able to click format select', async ({ page }) => {
    // Find and click the format select
    const formatSelect = page.locator('[role="button"]').filter({ hasText: /formato|format/i });
    await formatSelect.click();
    
    // Check if options appear
    const srtOption = page.getByRole('option', { name: /srt/i });
    await expect(srtOption).toBeVisible();
    
    const vttOption = page.getByRole('option', { name: /vtt/i });
    await expect(vttOption).toBeVisible();
    
    // Select VTT
    await vttOption.click();
    
    console.log('✅ Format selection works!');
  });

  test('should enable upload button when form is complete', async ({ page }) => {
    // Initially disabled
    const uploadButton = page.getByRole('button', { name: /cargar subtítulo|upload subtitle/i });
    await expect(uploadButton).toBeDisabled();
    
    // Select language
    const languageSelect = page.locator('[role="button"]').filter({ hasText: /idioma|language/i });
    await languageSelect.click();
    await page.getByRole('option', { name: /español/i }).click();
    
    // Still disabled (no file)
    await expect(uploadButton).toBeDisabled();
    
    // Add file
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles({
      name: 'test-subtitle.vtt',
      mimeType: 'text/vtt',
      buffer: Buffer.from('WEBVTT\n\n1\n00:00:01.000 --> 00:00:05.000\nTest subtitle.')
    });
    
    // Now should be enabled
    await expect(uploadButton).toBeEnabled();
    
    console.log('✅ Upload button enables correctly!');
  });
}); 