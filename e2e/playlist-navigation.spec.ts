import { test, expect } from '@playwright/test';

test.describe('Playlist Navigation', () => {
  test.beforeEach(async ({ page }) => {
    // Navegar al home primero
    await page.goto('http://localhost:3333');
    await page.waitForLoadState('networkidle');
  });

  test('should navigate to /playlist-direct and check behavior', async ({ page }) => {
    console.log('Testing /playlist-direct route...');
    
    // Navegar directamente a /playlist-direct
    await page.goto('http://localhost:3333/playlist-direct');
    await page.waitForLoadState('networkidle');
    
    // Verificar la URL actual después de la navegación
    const currentUrl = page.url();
    console.log('Current URL after navigating to /playlist-direct:', currentUrl);
    
    // Verificar si hay contenido en la página
    const pageContent = await page.textContent('body');
    console.log('Page content:', pageContent?.substring(0, 200) + '...');
    
    // Verificar si hay errores en la consola
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log('Console error:', msg.text());
      }
    });
    
    // Tomar screenshot para debug
    await page.screenshot({ path: 'debug-playlist-direct.png', fullPage: true });
  });

  test('should navigate to /playlist and check behavior', async ({ page }) => {
    console.log('Testing /playlist route...');
    
    // Navegar directamente a /playlist
    await page.goto('http://localhost:3333/playlist');
    await page.waitForLoadState('networkidle');
    
    // Verificar la URL actual después de la navegación
    const currentUrl = page.url();
    console.log('Current URL after navigating to /playlist:', currentUrl);
    
    // Verificar si hay contenido en la página
    const pageContent = await page.textContent('body');
    console.log('Page content:', pageContent?.substring(0, 200) + '...');
    
    // Verificar si hay errores en la consola
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log('Console error:', msg.text());
      }
    });
    
    // Tomar screenshot para debug
    await page.screenshot({ path: 'debug-playlist.png', fullPage: true });
  });

  test('should check if playlists menu item exists and works', async ({ page }) => {
    console.log('Testing playlists menu navigation...');
    
    // Buscar el elemento del menú de playlists
    const playlistsMenuItem = page.locator('text=Playlists').or(page.locator('text=Gamified Playlists'));
    
    if (await playlistsMenuItem.count() > 0) {
      console.log('Found playlists menu item');
      await playlistsMenuItem.click();
      await page.waitForLoadState('networkidle');
      
      const currentUrl = page.url();
      console.log('URL after clicking playlists menu:', currentUrl);
      
      // Tomar screenshot
      await page.screenshot({ path: 'debug-playlists-menu-click.png', fullPage: true });
    } else {
      console.log('Playlists menu item not found');
      
      // Listar todos los elementos del menú disponibles
      const menuItems = await page.locator('nav a, nav button').allTextContents();
      console.log('Available menu items:', menuItems);
    }
  });
}); 