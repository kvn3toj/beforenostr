import { test, expect } from '@playwright/test';

test.describe('Debug App Rendering', () => {
  test('should capture console errors and check if React app renders', async ({ page }) => {
    // Capturar errores de consola
    const consoleErrors: string[] = [];
    const consoleWarnings: string[] = [];
    
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
        console.log('❌ Console Error:', msg.text());
      } else if (msg.type() === 'warning') {
        consoleWarnings.push(msg.text());
        console.log('⚠️ Console Warning:', msg.text());
      }
    });

    // Capturar errores de página
    page.on('pageerror', error => {
      console.log('💥 Page Error:', error.message);
      consoleErrors.push(`Page Error: ${error.message}`);
    });

    // Mock API responses para evitar errores de Supabase
    await page.route('**/rest/v1/**', async route => {
      const url = route.request().url();
      console.log('🔄 Intercepting API call:', url);
      
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
      } else {
        // Default empty response for other API calls
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([])
        });
      }
    });

    // Navegar a la página principal
    console.log('🔍 Navegando a la página principal...');
    await page.goto('/', { waitUntil: 'networkidle' });

    // Esperar un poco para que se cargue
    await page.waitForTimeout(3000);

    // Tomar screenshot para ver qué se renderiza
    await page.screenshot({ path: 'debug-homepage.png', fullPage: true });
    console.log('📸 Screenshot guardado como debug-homepage.png');

    // Verificar si hay algún elemento React básico
    const bodyContent = await page.textContent('body');
    console.log('📄 Contenido del body:', bodyContent?.substring(0, 200) + '...');

    // Verificar si hay elementos básicos de la aplicación
    const hasReactRoot = await page.locator('#root').count() > 0;
    console.log('🔍 ¿Existe #root?', hasReactRoot);

    if (hasReactRoot) {
      const rootContent = await page.textContent('#root');
      console.log('📦 Contenido de #root:', rootContent?.substring(0, 200) + '...');
    }

    // Verificar si hay elementos de MUI o React
    const hasMuiElements = await page.locator('[class*="Mui"]').count();
    console.log('🎨 Elementos MUI encontrados:', hasMuiElements);

    // Ahora intentar navegar a la página de configuración de video
    console.log('🔍 Navegando a la página de configuración de video...');
    await page.goto('/items/test-video-id/config', { waitUntil: 'networkidle' });
    
    // Esperar un poco más para que se procesen los mocks
    await page.waitForTimeout(5000);

    // Tomar otro screenshot
    await page.screenshot({ path: 'debug-video-config.png', fullPage: true });
    console.log('📸 Screenshot de video config guardado como debug-video-config.png');

    // Verificar contenido de esta página
    const configBodyContent = await page.textContent('body');
    console.log('📄 Contenido del body en config:', configBodyContent?.substring(0, 200) + '...');

    // Buscar tabs o elementos específicos
    const tabsCount = await page.locator('[role="tab"]').count();
    console.log('📑 Tabs encontrados:', tabsCount);

    if (tabsCount > 0) {
      const tabTexts = await page.locator('[role="tab"]').allTextContents();
      console.log('📑 Textos de tabs:', tabTexts);
      
      // Verificar específicamente el tab de subtítulos
      const subtitlesTab = page.getByRole('tab', { name: /subtítulos|subtitles/i });
      const subtitlesTabExists = await subtitlesTab.count() > 0;
      console.log('🎬 ¿Existe tab de Subtítulos?', subtitlesTabExists);
      
      if (subtitlesTabExists) {
        console.log('✅ ¡Tab de Subtítulos encontrado! Intentando hacer click...');
        await subtitlesTab.click();
        
        // Esperar a que se cargue el contenido del tab
        await page.waitForTimeout(2000);
        
        // Verificar si aparece el SubtitleManager
        const subtitleManager = page.getByRole('heading', { name: /administrador de subtítulos|subtitle manager/i });
        const subtitleManagerExists = await subtitleManager.count() > 0;
        console.log('🎬 ¿Existe Subtitle Manager?', subtitleManagerExists);
        
        // Tomar screenshot del tab de subtítulos
        await page.screenshot({ path: 'debug-subtitles-tab.png', fullPage: true });
        console.log('📸 Screenshot del tab de subtítulos guardado como debug-subtitles-tab.png');
      }
    }

    // Imprimir errores capturados (solo los primeros 10 para no saturar)
    if (consoleErrors.length > 0) {
      console.log('❌ Errores de consola capturados (primeros 10):');
      consoleErrors.slice(0, 10).forEach((error, index) => {
        console.log(`  ${index + 1}. ${error.substring(0, 100)}...`);
      });
      if (consoleErrors.length > 10) {
        console.log(`  ... y ${consoleErrors.length - 10} errores más`);
      }
    }

    if (consoleWarnings.length > 0) {
      console.log('⚠️ Warnings de consola capturados (primeros 5):');
      consoleWarnings.slice(0, 5).forEach((warning, index) => {
        console.log(`  ${index + 1}. ${warning.substring(0, 100)}...`);
      });
    }

    // El test no debe fallar, solo reportar información
    expect(true).toBe(true);
  });
}); 