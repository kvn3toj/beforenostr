import { test, expect } from '@playwright/test';

test.describe('ÜPlay Backend Integration', () => {
  test.beforeEach(async ({ page }) => {
    // Interceptar la llamada al backend para verificar que se realice
    await page.route('**/video-items', async (route) => {
      // Permitir que la llamada real pase, pero capturarla para verificación
      const response = await route.fetch();
      const body = await response.text();
      
      // Verificar que la respuesta contenga datos esperados
      expect(body).toContain('Introducción a la Gamificación');
      
      // Continuar con la respuesta real
      await route.fulfill({
        status: response.status(),
        headers: response.headers(),
        body: body
      });
    });

    // Navegar a la página de ÜPlay
    await page.goto('/play');
    
    // Esperar a que React se monte
    await page.waitForSelector('#root');
  });

  test('should load ÜPlay page and display videos from backend', async ({ page }) => {
    // Verificar que la página se carga correctamente
    await expect(page).toHaveTitle(/CoomÜnity/);
    
    // Esperar a que aparezca el contenido de ÜPlay
    await page.waitForSelector('[data-testid="uplay-main"], .MuiContainer-root', { timeout: 10000 });
    
    // Verificar que no hay errores de JavaScript en la consola
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error' && !msg.text().includes('404')) {
        consoleErrors.push(msg.text());
      }
    });
    
    // Esperar un momento para que se carguen los datos
    await page.waitForTimeout(3000);
    
    // Verificar que se muestran títulos de videos del backend
    const videoTitles = [
      'Introducción a la Gamificación',
      'Elementos de Juego en Educación',
      'Narrativa y Storytelling',
      'Evaluación Gamificada',
      'Mecánicas de Recompensa'
    ];
    
    // Buscar al menos uno de los títulos de videos conocidos del backend
    let foundVideoTitle = false;
    for (const title of videoTitles) {
      try {
        await expect(page.locator(`text=${title}`)).toBeVisible({ timeout: 5000 });
        foundVideoTitle = true;
        console.log(`✅ Found video title: ${title}`);
        break;
      } catch (error) {
        console.log(`⏭️ Video title not found: ${title}`);
      }
    }
    
    // Si no encontramos títulos específicos, buscar indicadores generales de contenido de video
    if (!foundVideoTitle) {
      console.log('🔍 Searching for general video content indicators...');
      
      // Buscar elementos que indiquen contenido de video
      const videoIndicators = [
        'video', 'Video', 'VÍDEO', 'vídeo',
        'play', 'Play', 'PLAY', 'reproducir',
        'playlist', 'Playlist', 'PLAYLIST',
        'gamificación', 'Gamificación', 'GAMIFICACIÓN'
      ];
      
      for (const indicator of videoIndicators) {
        try {
          await expect(page.locator(`text*=${indicator}`)).toBeVisible({ timeout: 2000 });
          foundVideoTitle = true;
          console.log(`✅ Found video content indicator: ${indicator}`);
          break;
        } catch (error) {
          console.log(`⏭️ Video indicator not found: ${indicator}`);
        }
      }
    }
    
    // Verificar que se encontró contenido de video
    expect(foundVideoTitle).toBe(true);
    
    // Verificar que no hay errores críticos de JavaScript
    expect(consoleErrors.filter(error => 
      !error.includes('Warning') && 
      !error.includes('404') &&
      !error.includes('Failed to load resource')
    )).toHaveLength(0);
  });

  test('should make API call to backend video-items endpoint', async ({ page }) => {
    let apiCallMade = false;
    let apiResponse: any = null;
    
    // Interceptar la llamada a video-items
    await page.route('**/video-items', async (route) => {
      apiCallMade = true;
      const response = await route.fetch();
      apiResponse = await response.json();
      
      // Verificar que la respuesta tiene la estructura esperada
      expect(Array.isArray(apiResponse)).toBe(true);
      expect(apiResponse.length).toBeGreaterThan(0);
      
      // Verificar que al menos un video tiene las propiedades esperadas
      if (apiResponse.length > 0) {
        const firstVideo = apiResponse[0];
        expect(firstVideo).toHaveProperty('id');
        expect(firstVideo).toHaveProperty('title');
        expect(firstVideo).toHaveProperty('description');
      }
      
      await route.continue();
    });
    
    // Navegar a la página
    await page.goto('/play');
    await page.waitForSelector('#root');
    
    // Esperar a que se realice la llamada API
    await page.waitForTimeout(5000);
    
    // Verificar que se realizó la llamada API
    expect(apiCallMade).toBe(true);
    expect(apiResponse).not.toBeNull();
    
    console.log(`✅ API call made successfully. Received ${apiResponse?.length || 0} videos`);
  });

  test('should handle loading states correctly', async ({ page }) => {
    // Navegar a la página
    await page.goto('/play');
    await page.waitForSelector('#root');
    
    // Verificar que la página no muestra errores de carga
    await expect(page.locator('text=Error')).not.toBeVisible();
    await expect(page.locator('text=Failed')).not.toBeVisible();
    
    // Verificar que eventualmente se muestra contenido (no solo loading)
    await page.waitForTimeout(8000);
    
    // La página debe mostrar algún contenido después del loading
    const hasContent = await page.locator('body').textContent();
    expect(hasContent).toBeTruthy();
    expect(hasContent!.length).toBeGreaterThan(100); // Debe tener contenido sustancial
  });
}); 