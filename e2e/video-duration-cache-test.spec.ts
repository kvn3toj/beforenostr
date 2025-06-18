import { test, expect } from '@playwright/test';

test.describe('Video Duration - Cache & Display Test', () => {
  test.beforeEach(async ({ page }) => {
    // Capturar errores de consola
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log('🔴 Frontend Console Error:', msg.text());
      }
    });

    // Protocolo de autenticación obligatorio
    await page.goto('/login');
    await page.fill('input[name="email"]', 'admin@gamifier.com');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/');
    await expect(page.getByText('Gamifier Admin')).toBeVisible();
  });

  test('backend API returns correct durations', async ({ page }) => {
    // Test directo del endpoint backend que usa el frontend
    const response = await page.request.get('http://localhost:1111/content/items/test');
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data.status).toBe('ok');
    expect(data.items).toBeDefined();
    
    // Buscar videos específicos
    const economiaVideo = data.items.find(item => item.id === 17);
    const hieloVideo = data.items.find(item => item.id === 28);
    const propositoVideo = data.items.find(item => item.id === 30);
    
    // Verificar duraciones correctas
    expect(economiaVideo?.duration).toBe(729); // 12:09
    expect(hieloVideo?.duration).toBe(480);    // 8:00  
    expect(propositoVideo?.duration).toBe(300); // 5:00
    
    console.log('✅ Backend API returns correct durations');
  });

  test('frontend displays correct durations in table', async ({ page }) => {
    // Navegar al Content Items con hard refresh para evitar caché
    await page.goto('/items', { waitUntil: 'networkidle' });
    
    // Forzar refresh de la página
    await page.reload({ waitUntil: 'networkidle' });
    
    // Esperar a que la tabla se cargue
    await page.waitForSelector('table', { timeout: 10000 });
    
    // Buscar filas específicas por título
    const economiaRow = page.locator('tr').filter({ hasText: 'Economía Sagrada' });
    const hieloRow = page.locator('tr').filter({ hasText: 'Dentro del mundo del hombre de hielo' });
    
    // Verificar que las filas existen
    await expect(economiaRow).toBeVisible();
    await expect(hieloRow).toBeVisible();
    
    // Verificar duraciones en la tabla
    // Buscar en la columna "Duration" 
    await expect(economiaRow.locator('td').nth(5)).toContainText('12:09');
    await expect(hieloRow.locator('td').nth(5)).toContainText('8:00');
    
    console.log('✅ Frontend table displays correct durations');
  });

  test('video configuration page shows correct duration', async ({ page }) => {
    // Navegar directamente al video 30 (que sabemos tiene 5:00)
    await page.goto('/items/30/config', { waitUntil: 'networkidle' });
    
    // Verificar que el timeline muestra la duración correcta
    await expect(page.locator('text=/5:00/')).toBeVisible({ timeout: 10000 });
    
    console.log('✅ Video config page shows correct duration');
  });

  test('clear browser cache and verify durations persist', async ({ context, page }) => {
    // Limpiar todo el storage
    await context.clearCookies();
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
    
    // Recargar página completamente
    await page.goto('/', { waitUntil: 'networkidle' });
    
    // Re-autenticar
    await page.goto('/login');
    await page.fill('input[name="email"]', 'admin@gamifier.com');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/');
    
    // Ir a items y verificar duraciones
    await page.goto('/items', { waitUntil: 'networkidle' });
    
    // Verificar que las duraciones correctas persisten después de limpiar caché
    const economiaRow = page.locator('tr').filter({ hasText: 'Economía Sagrada' });
    await expect(economiaRow.locator('td').nth(5)).toContainText('12:09');
    
    console.log('✅ Correct durations persist after cache clear');
  });
}); 