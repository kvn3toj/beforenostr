import { test, expect } from '@playwright/test';

test.describe('Subtitle Manager E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Mock API responses para evitar errores de Supabase
    await page.route('**/rest/v1/**', async route => {
      const url = route.request().url();
      
      if (url.includes('playlist_items')) {
        // Mock playlist item data
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
        // Mock categories data
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([
            { id: '1', name: 'Category 1' },
            { id: '2', name: 'Category 2' }
          ])
        });
      } else if (url.includes('item_categories')) {
        // Mock item categories data
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([])
        });
      } else if (url.includes('subtitles')) {
        // Mock subtitles data
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
            },
            {
              id: 2,
              videoItemId: 123,
              language: 'en',
              filename: 'subtitle-en.vtt',
              fileUrl: 'https://example.com/subtitle-en.vtt',
              isActive: false,
              createdAt: '2024-01-01',
              updatedAt: '2024-01-01',
            }
          ])
        });
      } else {
        // Default empty response for other API calls
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([])
        });
      }
    });

    // Navigate to the video configuration page
    // Using a test video ID - in a real scenario this would be a video that exists in the test database
    await page.goto('/items/test-video-id/config');
    
    // Wait for the page to load and click on the Subtitles tab
    await page.getByRole('tab', { name: /subtítulos|subtitles/i }).click();
    
    // Wait for the subtitle manager to be visible
    await expect(page.getByRole('heading', { name: /administrador de subtítulos|subtitle manager/i })).toBeVisible();
  });

  test('should render the Subtitles tab content', async ({ page }) => {
    // Verify that key elements of the subtitles tab appear
    await expect(page.getByRole('heading', { name: /administrador de subtítulos|subtitle manager/i })).toBeVisible();
    
    // Check for the upload form title
    await expect(page.getByRole('heading', { name: /cargar nuevo subtítulo|upload new subtitle/i })).toBeVisible();
    
    // Check for the file selection button
    await expect(page.getByRole('button', { name: /seleccionar archivo|select file/i })).toBeVisible();
    
    // Check for language selection field
    await expect(page.getByRole('combobox', { name: /idioma|language/i })).toBeVisible();
    
    // Check for format selection field
    await expect(page.getByRole('combobox', { name: /formato|format/i })).toBeVisible();
    
    // Check for upload button (should be disabled initially)
    const uploadButton = page.getByRole('button', { name: /cargar subtítulo|upload subtitle/i });
    await expect(uploadButton).toBeVisible();
    await expect(uploadButton).toBeDisabled();
    
    // Check for existing subtitles section
    await expect(page.getByRole('heading', { name: /subtítulos existentes|existing subtitles/i })).toBeVisible();
  });

  test('should upload a subtitle file successfully', async ({ page }) => {
    // Mock successful upload response
    await page.route('**/rest/v1/subtitles', async route => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({
            id: 3,
            videoItemId: 123,
            language: 'fr',
            filename: 'subtitle-fr.vtt',
            fileUrl: 'https://example.com/subtitle-fr.vtt',
            isActive: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          })
        });
      } else {
        await route.continue();
      }
    });

    // Select language
    await page.getByRole('combobox', { name: /idioma|language/i }).click();
    await page.getByRole('option', { name: /français|french/i }).click();
    
    // Select format
    await page.getByRole('combobox', { name: /formato|format/i }).click();
    await page.getByRole('option', { name: /vtt/i }).click();
    
    // Create a test file
    const fileContent = `WEBVTT

1
00:00:01.000 --> 00:00:05.000
Bonjour, ceci est un test de sous-titre.

2
00:00:05.000 --> 00:00:10.000
Deuxième ligne de sous-titre.`;
    
    // Upload file
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles({
      name: 'test-subtitle.vtt',
      mimeType: 'text/vtt',
      buffer: Buffer.from(fileContent)
    });
    
    // Click upload button
    const uploadButton = page.getByRole('button', { name: /cargar subtítulo|upload subtitle/i });
    await expect(uploadButton).toBeEnabled();
    await uploadButton.click();
    
    // Verify success message appears
    await expect(page.getByText(/subtítulo creado exitosamente|subtitle created successfully/i)).toBeVisible();
  });

  test('should delete a subtitle successfully', async ({ page }) => {
    // Mock successful delete response
    await page.route('**/rest/v1/subtitles?id=eq.1', async route => {
      if (route.request().method() === 'DELETE') {
        await route.fulfill({
          status: 204,
          contentType: 'application/json',
          body: ''
        });
      } else {
        await route.continue();
      }
    });

    // Find and click delete button for first subtitle
    const deleteButton = page.getByRole('button', { name: /eliminar|delete/i }).first();
    await deleteButton.click();
    
    // Confirm deletion in dialog
    await page.getByRole('button', { name: /eliminar|delete/i }).click();
    
    // Verify success message appears
    await expect(page.getByText(/subtítulo eliminado exitosamente|subtitle deleted successfully/i)).toBeVisible();
  });

  test('should toggle subtitle active/inactive status', async ({ page }) => {
    // Mock successful update response
    await page.route('**/rest/v1/subtitles?id=eq.2', async route => {
      if (route.request().method() === 'PATCH') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            id: 2,
            videoItemId: 123,
            language: 'en',
            filename: 'subtitle-en.vtt',
            fileUrl: 'https://example.com/subtitle-en.vtt',
            isActive: true, // Changed to active
            createdAt: '2024-01-01',
            updatedAt: new Date().toISOString(),
          })
        });
      } else {
        await route.continue();
      }
    });

    // Find and click toggle button for inactive subtitle (English)
    const toggleButton = page.getByRole('button', { name: /activar|activate/i }).first();
    await toggleButton.click();
    
    // Verify success message appears
    await expect(page.getByText(/subtítulo actualizado exitosamente|subtitle updated successfully/i)).toBeVisible();
  });

  test('should show validation errors for incomplete upload form', async ({ page }) => {
    // Try to upload without selecting language
    const uploadButton = page.getByRole('button', { name: /cargar subtítulo|upload subtitle/i });
    await expect(uploadButton).toBeDisabled();
    
    // Select only language but no file
    await page.getByRole('combobox', { name: /idioma|language/i }).click();
    await page.getByRole('option', { name: /español|spanish/i }).click();
    
    // Upload button should still be disabled
    await expect(uploadButton).toBeDisabled();
    
    // Select format but still no file
    await page.getByRole('combobox', { name: /formato|format/i }).click();
    await page.getByRole('option', { name: /srt/i }).click();
    
    // Upload button should still be disabled without file
    await expect(uploadButton).toBeDisabled();
  });

  test('should display loading state during upload', async ({ page }) => {
    // Mock slow upload response
    await page.route('**/rest/v1/subtitles', async route => {
      if (route.request().method() === 'POST') {
        // Delay response to simulate loading
        await new Promise(resolve => setTimeout(resolve, 1000));
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({
            id: 4,
            videoItemId: 123,
            language: 'de',
            filename: 'subtitle-de.vtt',
            fileUrl: 'https://example.com/subtitle-de.vtt',
            isActive: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          })
        });
      } else {
        await route.continue();
      }
    });

    // Fill form
    await page.getByRole('combobox', { name: /idioma|language/i }).click();
    await page.getByRole('option', { name: /deutsch|german/i }).click();
    
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles({
      name: 'test-subtitle.vtt',
      mimeType: 'text/vtt',
      buffer: Buffer.from('WEBVTT\n\n1\n00:00:01.000 --> 00:00:05.000\nTest subtitle.')
    });
    
    // Click upload and verify loading state
    const uploadButton = page.getByRole('button', { name: /cargar subtítulo|upload subtitle/i });
    await uploadButton.click();
    
    // Check for loading indicator
    await expect(page.locator('[role="progressbar"]')).toBeVisible();
  });

  test('should show empty state when no subtitles exist', async ({ page }) => {
    // Mock empty subtitles response
    await page.route('**/rest/v1/subtitles**', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([])
      });
    });

    // Reload page to get empty state
    await page.reload();
    await page.getByRole('tab', { name: /subtítulos|subtitles/i }).click();
    
    // Verify empty state message
    await expect(page.getByText(/no hay subtítulos|no subtitles/i)).toBeVisible();
  });

  test('should handle file format auto-detection', async ({ page }) => {
    // Upload SRT file and verify format is auto-detected
    const srtContent = `1
00:00:01,000 --> 00:00:05,000
This is an SRT subtitle.

2
00:00:05,000 --> 00:00:10,000
Second SRT subtitle line.`;
    
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles({
      name: 'test-subtitle.srt',
      mimeType: 'text/srt',
      buffer: Buffer.from(srtContent)
    });
    
    // Verify format is auto-detected as SRT
    const formatSelect = page.getByRole('combobox', { name: /formato|format/i });
    await expect(formatSelect).toHaveValue('srt');
  });

  test('should disable interactions during mutations', async ({ page }) => {
    // Mock slow mutation response
    await page.route('**/rest/v1/subtitles?id=eq.1', async route => {
      if (route.request().method() === 'PATCH') {
        await new Promise(resolve => setTimeout(resolve, 1000));
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({})
        });
      } else {
        await route.continue();
      }
    });

    // Click toggle button
    const toggleButton = page.getByRole('button', { name: /desactivar|deactivate/i }).first();
    await toggleButton.click();
    
    // Verify buttons are disabled during mutation
    await expect(toggleButton).toBeDisabled();
    await expect(page.getByRole('button', { name: /eliminar|delete/i }).first()).toBeDisabled();
  });

  test('should navigate back to video configuration', async ({ page }) => {
    // Test that we can navigate between tabs
    await page.getByRole('tab', { name: /configuración|configuration/i }).click();
    
    // Verify we're on the configuration tab
    await expect(page.getByRole('textbox', { name: /título del video|video title/i })).toBeVisible();
    
    // Navigate back to subtitles
    await page.getByRole('tab', { name: /subtítulos|subtitles/i }).click();
    
    // Verify we're back on the subtitles tab
    await expect(page.getByRole('heading', { name: /administrador de subtítulos|subtitle manager/i })).toBeVisible();
  });
}); 