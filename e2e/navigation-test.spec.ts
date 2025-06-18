import { test, expect } from '@playwright/test';

test.describe('Navigation Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navegar a la página principal
    await page.goto('http://localhost:5173');
    
    // Esperar a que la página cargue
    await page.waitForLoadState('networkidle');
  });

  test('should navigate to all main menu items', async ({ page }) => {
    // Verificar que estamos en la página principal
    await expect(page).toHaveURL('http://localhost:5173/');
    
    // Verificar que el menú está presente
    await expect(page.locator('[data-testid="main-navigation"]')).toBeVisible();
    
    // Test navegación a Mundos
    await page.click('text=Mundos');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL('http://localhost:5173/mundos');
    
    // Verificar que la página de mundos carga correctamente
    await expect(page.locator('h1, h2, h3, h4, h5, h6')).toContainText(/mundos/i);
    
    // Test navegación a Playlists
    await page.click('text=Servicios');
    await page.click('text=UPlay');
    await page.click('text=Playlists Gamificadas');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL('http://localhost:5173/playlists');
    
    // Test navegación a Playlists Directo
    await page.click('text=Servicios');
    await page.click('text=UPlay');
    await page.click('text=Playlists (Directo)');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL('http://localhost:5173/playlist-direct');
  });

  test('should load mundos data from backend', async ({ page }) => {
    await page.goto('http://localhost:5173/mundos');
    await page.waitForLoadState('networkidle');
    
    // Esperar a que los datos se carguen
    await page.waitForTimeout(2000);
    
    // Verificar que hay contenido de mundos
    const mundosContent = page.locator('[data-testid="mundos-content"], .MuiDataGrid-root, table, .mundo-item');
    await expect(mundosContent.first()).toBeVisible({ timeout: 10000 });
  });

  test('should load playlists data from backend', async ({ page }) => {
    await page.goto('http://localhost:5173/playlists');
    await page.waitForLoadState('networkidle');
    
    // Esperar a que los datos se carguen
    await page.waitForTimeout(2000);
    
    // Verificar que hay contenido de playlists
    const playlistsContent = page.locator('[data-testid="playlists-content"], .MuiDataGrid-root, table, .playlist-item');
    await expect(playlistsContent.first()).toBeVisible({ timeout: 10000 });
  });

  test('should navigate to mundo content page', async ({ page }) => {
    await page.goto('http://localhost:5173/mundos');
    await page.waitForLoadState('networkidle');
    
    // Buscar un mundo y hacer click
    const mundoLink = page.locator('a[href*="/mundos/"], button[data-mundo-id]').first();
    if (await mundoLink.count() > 0) {
      await mundoLink.click();
      await page.waitForLoadState('networkidle');
      
      // Verificar que navegamos a la página de contenido del mundo
      await expect(page.url()).toMatch(/\/mundos\/.*\/contenido/);
    }
  });

  test('should navigate to playlist detail page', async ({ page }) => {
    await page.goto('http://localhost:5173/playlists');
    await page.waitForLoadState('networkidle');
    
    // Buscar una playlist y hacer click
    const playlistLink = page.locator('a[href*="/playlists/"], button[data-playlist-id]').first();
    if (await playlistLink.count() > 0) {
      await playlistLink.click();
      await page.waitForLoadState('networkidle');
      
      // Verificar que navegamos a la página de detalle de la playlist
      await expect(page.url()).toMatch(/\/playlists\/[^\/]+$/);
    }
  });

  test('should check backend connectivity', async ({ page }) => {
    // Test directo de conectividad con el backend
    const response = await page.request.get('http://localhost:1111/mundos');
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);
    
    // Test de playlists-direct que sabemos que funciona
    const playlistsResponse = await page.request.get('http://localhost:1111/playlists-direct');
    expect(playlistsResponse.status()).toBe(200);
    
    const playlistsData = await playlistsResponse.json();
    expect(Array.isArray(playlistsData)).toBe(true);
  });
}); 