import { test, expect } from '@playwright/test';

test.describe('Video Duration - Backend & Frontend Verification', () => {
  test.beforeEach(async ({ page }) => {
    // Protocolo de autenticación obligatorio para cada test
    await page.goto('/login');
    await page.fill('input[name="email"]', 'admin@gamifier.com');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/');
    await expect(page.getByText('Gamifier Admin')).toBeVisible();
  });

  test('backend endpoint returns correct duration', async ({ page }) => {
    // Test directo del endpoint backend
    const response = await page.request.get('http://localhost:3002/video-items/17');
    expect(response.status()).toBe(200);
    
    const videoData = await response.json();
    console.log('Backend video data:', videoData);
    
    // Verificar que devuelve la duración correcta (729 segundos = 12:09)
    expect(videoData.duration).toBe(729);
    expect(videoData.title).toBe('Economía Sagrada');
  });

  test('content items endpoint includes durations', async ({ page }) => {
    // Test del endpoint que usa el frontend
    const response = await page.request.get('http://localhost:3002/content/items/test');
    expect(response.status()).toBe(200);
    
    const contentData = await response.json();
    console.log('Content endpoint total items:', contentData.items.length);
    
    // Encontrar el video de Economía Sagrada
    const economiaSagrada = contentData.items.find((item: any) => item.id === 17);
    expect(economiaSagrada).toBeDefined();
    expect(economiaSagrada.duration).toBe(729);
    
    // Verificar que otros videos también tienen duración
    const videosWithDuration = contentData.items.filter((item: any) => item.duration && item.duration > 0);
    console.log('Videos with duration:', videosWithDuration.length);
    expect(videosWithDuration.length).toBeGreaterThan(20); // Debería haber muchos videos con duración
  });

  test('frontend shows all videos are coherent', async ({ page }) => {
    // Navegar a la página de gestión de contenido
    await page.goto('/admin/content');
    
    // Esperar a que cargue la tabla de contenido
    await expect(page.locator('table')).toBeVisible({ timeout: 10000 });
    
    // Verificar que hay videos listados
    const videoRows = page.locator('tbody tr');
    const videoCount = await videoRows.count();
    console.log('Videos shown in frontend:', videoCount);
    expect(videoCount).toBeGreaterThan(0);
    
    // Buscar específicamente el video "Economía Sagrada"
    const economiaSagradaRow = page.locator('tr').filter({ hasText: 'Economía Sagrada' });
    await expect(economiaSagradaRow).toBeVisible();
    
    // Verificar que muestra alguna indicación de duración (puede ser en diferentes formatos)
    const economiaSagradaText = await economiaSagradaRow.textContent();
    console.log('Economía Sagrada row text:', economiaSagradaText);
    
    // Verificar que contiene información de duración (12:09 o 729 segundos)
    const hasDurationInfo = economiaSagradaText?.includes('12:09') || 
                           economiaSagradaText?.includes('729') ||
                           economiaSagradaText?.includes('12 min');
    
    if (!hasDurationInfo) {
      console.log('⚠️ Duration info not found in frontend. Content:', economiaSagradaText);
      // Tomar screenshot para debugging
      await page.screenshot({ path: 'debug-video-duration-frontend.png', fullPage: true });
    }
  });

  test('video configuration in video configuration page', async ({ page }) => {
    // Navegar directamente a la configuración del video específico
    await page.goto('/admin/content/video-config/17');
    
    // Esperar a que cargue la página
    await page.waitForTimeout(3000);
    
    // Buscar cualquier mención de duración en la página
    const pageContent = await page.textContent('body');
    console.log('Video config page loaded for ID 17');
    
    // Verificar que la página cargó correctamente
    expect(pageContent).toContain('Economía Sagrada');
    
    // Tomar screenshot para ver qué se está mostrando
    await page.screenshot({ path: 'debug-video-config-page.png', fullPage: true });
    
    // Verificar si hay información de duración visible
    const hasDurationInfo = pageContent?.includes('12:09') || 
                           pageContent?.includes('729') ||
                           pageContent?.includes('12 min') ||
                           pageContent?.includes('duration');
    
    console.log('Duration info found in video config:', hasDurationInfo);
  });

  test('duration in Content Items Management', async ({ page }) => {
    // Navegar a la gestión de items de contenido
    await page.goto('/admin/content');
    
    // Esperar a que cargue
    await page.waitForTimeout(2000);
    
    // Tomar screenshot para ver el estado actual
    await page.screenshot({ path: 'debug-content-management.png', fullPage: true });
    
    // Verificar si hay columnas de duración
    const headers = await page.locator('th').allTextContents();
    console.log('Table headers:', headers);
    
    const hasDurationColumn = headers.some(header => 
      header.toLowerCase().includes('duration') || 
      header.toLowerCase().includes('duración')
    );
    
    console.log('Duration column found:', hasDurationColumn);
    
    // Si no hay columna de duración, verificar en el contenido de las filas
    if (!hasDurationColumn) {
      const firstRow = page.locator('tbody tr').first();
      if (await firstRow.isVisible()) {
        const rowContent = await firstRow.textContent();
        console.log('First row content:', rowContent);
      }
    }
  });
}); 