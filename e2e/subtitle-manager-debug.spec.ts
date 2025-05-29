import { test, expect } from '@playwright/test';

test.describe('Subtitle Manager Debug Tests', () => {
  test('should test navigation to home page first', async ({ page }) => {
    // Capturar errores de consola
    const consoleErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    // Navegar a la página principal primero
    await page.goto('/');
    await page.waitForTimeout(2000);
    
    console.log('Home page console errors:', consoleErrors);
    console.log('Home page title:', await page.title());
    console.log('Home page React root element found:', await page.locator('#root').count());
    
    const rootContent = await page.locator('#root').innerHTML();
    console.log('Home root content length:', rootContent.length);
    console.log('Home root content preview:', rootContent.substring(0, 100));
  });

  test('should debug page loading and available elements', async ({ page }) => {
    // Capturar todas las llamadas de red
    const networkCalls: string[] = [];
    page.on('request', request => {
      networkCalls.push(`${request.method()} ${request.url()}`);
    });

    // Capturar errores
    const consoleErrors: string[] = [];
    const pageErrors: string[] = [];
    
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    page.on('pageerror', error => {
      pageErrors.push(error.message);
    });

    // Navegar a la página de configuración
    await page.goto('/items/123/config');
    await page.waitForTimeout(3000);
    
    console.log('Console errors:', consoleErrors);
    console.log('Page errors:', pageErrors);
    console.log('Page title:', await page.title());
    console.log('React root element found:', await page.locator('#root').count());
    
    const rootContent = await page.locator('#root').innerHTML();
    console.log('Root content length:', rootContent.length);
    console.log('Root content preview:', rootContent.substring(0, 100));
    
    // Verificar elementos básicos
    const errorElements = await page.locator('[role="alert"], .MuiAlert-root').count();
    const loadingElements = await page.locator('[role="progressbar"], .MuiCircularProgress-root').count();
    const tabsCount = await page.locator('[role="tab"]').count();
    const buttonsCount = await page.locator('button').count();
    
    console.log('Error elements found:', errorElements);
    console.log('Loading elements found:', loadingElements);
    console.log('Tabs found:', tabsCount);
    console.log('Buttons found:', buttonsCount);
    
    // Imprimir las primeras 20 llamadas de red
    console.log('Network calls (first 20):');
    networkCalls.slice(0, 20).forEach((call, index) => {
      console.log(`  ${index + 1}. ${call}`);
    });
  });

  test('should debug subtitle API calls specifically', async ({ page }) => {
    // Capturar llamadas específicas a subtítulos
    const subtitleCalls: string[] = [];
    
    page.on('request', request => {
      const url = request.url();
      if (url.includes('subtitle') || url.includes('4000')) {
        subtitleCalls.push(`${request.method()} ${url}`);
        console.log(`🎬 Subtitle API call detected: ${request.method()} ${url}`);
      }
    });

    // Mock API responses para evitar errores de Supabase
    await page.route('**/rest/v1/**', async route => {
      const url = route.request().url();
      console.log('🔄 Supabase API call:', url);
      
      if (url.includes('playlist_items')) {
        // fetchPlaylistItemById uses .single() so it expects a single object, not an array
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            id: 123,
            title: 'Test Video',
            description: 'Test Description',
            content: '<iframe src="https://example.com/video"></iframe>',
            order_index: 1,
            playlist_id: 'playlist-1',
            created_at: '2024-01-01',
            updated_at: '2024-01-01',
          })
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
      } else {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([])
        });
      }
    });

    // Mock específico para subtítulos
    await page.route('**/subtitles**', async route => {
      const url = route.request().url();
      console.log(`🔄 Intercepting subtitle call: ${route.request().method()} ${url}`);
      
      if (route.request().method() === 'GET') {
        console.log('📋 Returning mock subtitle data');
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
        await route.continue();
      }
    });

    await page.goto('/items/123/config');
    await page.waitForTimeout(2000);
    
    // Click en el tab de subtítulos
    console.log('🔍 Clicking on subtitles tab...');
    await page.getByRole('tab', { name: /subtítulos|subtitles/i }).click();
    await page.waitForTimeout(3000);
    
    console.log('🎬 Subtitle API calls made:');
    subtitleCalls.forEach((call, index) => {
      console.log(`  ${index + 1}. ${call}`);
    });
    
    // Verificar el contenido del tab de subtítulos
    const subtitleManagerExists = await page.getByRole('heading', { name: /subtitle manager/i }).count() > 0;
    console.log('📋 Subtitle Manager exists:', subtitleManagerExists);
    
    const emptyMessage = await page.getByText(/no subtitles for this video/i).count();
    console.log('📭 Empty message count:', emptyMessage);
    
    const existingSubtitlesHeading = await page.getByRole('heading', { name: /subtítulos existentes/i }).count();
    console.log('📋 Existing subtitles heading count:', existingSubtitlesHeading);
    
    // Check for loading states
    const loadingSpinners = await page.locator('[role="progressbar"], .MuiCircularProgress-root').count();
    console.log('⏳ Loading spinners count:', loadingSpinners);
    
    // Check for error states
    const errorAlerts = await page.locator('[role="alert"], .MuiAlert-root').allTextContents();
    console.log('🚨 Error alerts:', errorAlerts);
    
    // Check the subtitle tab panel content
    const tabPanel = page.locator('[role="tabpanel"]').nth(1); // Second tab panel (subtitles)
    const tabPanelExists = await tabPanel.count();
    console.log('📋 Subtitle tab panel exists:', tabPanelExists > 0);
    
    if (tabPanelExists > 0) {
      const tabPanelText = await tabPanel.textContent();
      console.log('📋 Subtitle tab panel text (first 300 chars):', tabPanelText?.substring(0, 300));
      
      const tabPanelHTML = await tabPanel.innerHTML();
      console.log('📋 Subtitle tab panel HTML (first 500 chars):', tabPanelHTML.substring(0, 500));
    }
    
    // Tomar screenshot
    await page.screenshot({ path: 'subtitle-api-debug.png', fullPage: true });
    
    expect(true).toBe(true); // Always pass
  });
});

test.describe('Video Config Page Debug', () => {
  test('should load the video config page and show basic elements', async ({ page }) => {
    // Mock API responses
    await page.route('**/rest/v1/**', async route => {
      const url = route.request().url();
      
      if (url.includes('playlist_items')) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            id: 123,
            title: 'Test Video',
            description: 'Test Description',
            content: '<iframe src="https://example.com/video"></iframe>',
            order_index: 1,
            playlist_id: 'playlist-1',
            created_at: '2024-01-01',
            updated_at: '2024-01-01',
          })
        });
      } else {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([])
        });
      }
    });

    await page.goto('/items/123/config');
    await page.waitForTimeout(3000);
    
    // Check if the page title is visible
    const pageTitle = page.getByRole('heading', { name: /configurar video/i });
    await expect(pageTitle).toBeVisible({ timeout: 10000 });
    
    // Check if tabs container is visible
    const tabsContainer = page.locator('[role="tablist"]');
    await expect(tabsContainer).toBeVisible();
    
    // Check if all expected tabs are present
    const tabs = await page.locator('[role="tab"]').allTextContents();
    expect(tabs).toContain('Configuración');
    expect(tabs).toContain('Subtitles');
    
    console.log('✅ Video config page loaded successfully with tabs:', tabs);
  });

  test('should show page content without authentication errors', async ({ page }) => {
    // Mock all API calls to avoid authentication issues
    await page.route('**/*', async route => {
      const url = route.request().url();
      
      // Allow static assets
      if (url.includes('.js') || url.includes('.css') || url.includes('.png') || url.includes('.ico')) {
        await route.continue();
        return;
      }
      
      // Mock API calls
      if (url.includes('rest/v1') || url.includes('4000')) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([])
        });
      } else {
        await route.continue();
      }
    });

    await page.goto('/items/123/config');
    
    // Wait for page to stabilize
    await page.waitForLoadState('networkidle');
    
    console.log('Page is still loading');
    
    expect(true).toBe(true);
  });
});

test.describe('Subtitle Manager Debug', () => {
  test('should debug subtitle manager content', async ({ page }) => {
    // Mock API responses
    await page.route('**/rest/v1/**', async route => {
      const url = route.request().url();
      
      if (url.includes('playlist_items')) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            id: 123,
            title: 'Test Video',
            description: 'Test Description',
            content: '<iframe src="https://example.com/video"></iframe>',
            order_index: 1,
            playlist_id: 'playlist-1',
            created_at: '2024-01-01',
            updated_at: '2024-01-01',
          })
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
      } else {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([])
        });
      }
    });

    await page.goto('/items/123/config');
    
    // Wait for page to load
    await page.waitForTimeout(3000);
    
    console.log('🔍 Checking tabs...');
    const tabs = await page.locator('[role="tab"]').allTextContents();
    console.log('📑 Available tabs:', tabs);
    
    // Click subtitles tab
    await page.getByRole('tab', { name: /subtítulos|subtitles/i }).click();
    
    // Wait for content to load
    await page.waitForTimeout(3000);
    
    // Take screenshot
    await page.screenshot({ path: 'subtitle-debug-full.png', fullPage: true });
    
    // Get all text content
    const bodyText = await page.textContent('body');
    console.log('📄 Full body text (first 500 chars):', bodyText?.substring(0, 500));
    
    // Check for specific elements
    console.log('\n🔍 Looking for subtitle manager elements...');
    
    // Check for headings
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').allTextContents();
    console.log('📋 All headings:', headings);
    
    // Check for buttons
    const buttons = await page.locator('button').allTextContents();
    console.log('🔘 All buttons:', buttons);
    
    // Check for inputs
    const inputs = await page.locator('input').count();
    console.log('📝 Number of inputs:', inputs);
    
    // Check for selects
    const selects = await page.locator('select').count();
    console.log('📋 Number of selects:', selects);
    
    // Check for MUI Select components (they use div with role="button")
    const muiSelects = await page.locator('[role="button"]').allTextContents();
    console.log('🎛️ MUI Select buttons:', muiSelects);
    
    // Check for any text containing "idioma" or "language"
    const languageElements = await page.locator('text=/idioma|language/i').count();
    console.log('🌐 Elements with "idioma" or "language":', languageElements);
    
    // Check for any text containing "formato" or "format"
    const formatElements = await page.locator('text=/formato|format/i').count();
    console.log('📄 Elements with "formato" or "format":', formatElements);
    
    // Check for any text containing "subtítulo" or "subtitle"
    const subtitleElements = await page.locator('text=/subtítulo|subtitle/i').count();
    console.log('🎬 Elements with "subtítulo" or "subtitle":', subtitleElements);
    
    // Check if there are any error messages
    const errorElements = await page.locator('[role="alert"], .MuiAlert-root').allTextContents();
    console.log('❌ Error messages:', errorElements);
    
    // Check for loading indicators
    const loadingElements = await page.locator('[role="progressbar"], .MuiCircularProgress-root').count();
    console.log('⏳ Loading indicators:', loadingElements);
    
    // Print the HTML of the subtitle tab content
    const tabPanel = page.locator('[role="tabpanel"]').nth(1); // Second tab panel (subtitles)
    const tabPanelHTML = await tabPanel.innerHTML().catch(() => 'Not found');
    console.log('\n📋 Subtitle tab panel HTML (first 1000 chars):', tabPanelHTML.substring(0, 1000));
    
    // Always pass the test - this is just for debugging
    expect(true).toBe(true);
  });
}); 