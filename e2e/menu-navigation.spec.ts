import { test, expect } from '@playwright/test';

test.describe('Menu Navigation Inspection', () => {
  test.beforeEach(async ({ page }) => {
    // Navegar al home primero
    await page.goto('http://localhost:3333');
    await page.waitForLoadState('networkidle');
  });

  test('should inspect all menu items and their navigation', async ({ page }) => {
    console.log('=== INSPECTING MENU NAVIGATION ===');
    
    // Tomar screenshot inicial
    await page.screenshot({ path: 'menu-initial.png', fullPage: true });
    
    // Buscar todos los elementos del menú
    const menuItems = await page.locator('nav a, nav button, [role="menuitem"], [data-testid*="menu"]').all();
    console.log(`Found ${menuItems.length} potential menu items`);
    
    // Obtener todos los textos y hrefs
    const menuData = [];
    for (let i = 0; i < menuItems.length; i++) {
      const item = menuItems[i];
      const text = await item.textContent();
      const href = await item.getAttribute('href');
      const role = await item.getAttribute('role');
      const testId = await item.getAttribute('data-testid');
      
      menuData.push({
        index: i,
        text: text?.trim(),
        href,
        role,
        testId
      });
    }
    
    console.log('Menu items found:', JSON.stringify(menuData, null, 2));
    
    // Buscar específicamente elementos relacionados con playlists
    const playlistElements = await page.locator('text=/playlist/i').all();
    console.log(`Found ${playlistElements.length} playlist-related elements`);
    
    for (let i = 0; i < playlistElements.length; i++) {
      const element = playlistElements[i];
      const text = await element.textContent();
      const href = await element.getAttribute('href');
      console.log(`Playlist element ${i}: text="${text}", href="${href}"`);
    }
  });

  test('should test direct navigation to all playlist routes', async ({ page }) => {
    console.log('=== TESTING DIRECT NAVIGATION ===');
    
    const routes = [
      '/playlist-direct',
      '/playlist',
      '/playlists'
    ];
    
    for (const route of routes) {
      console.log(`\n--- Testing route: ${route} ---`);
      
      await page.goto(`http://localhost:3333${route}`);
      await page.waitForLoadState('networkidle');
      
      const currentUrl = page.url();
      const title = await page.title();
      const pageText = await page.textContent('body');
      
      console.log(`Route: ${route}`);
      console.log(`Final URL: ${currentUrl}`);
      console.log(`Title: ${title}`);
      console.log(`Page contains "playlist": ${pageText?.toLowerCase().includes('playlist')}`);
      console.log(`Page contains "error": ${pageText?.toLowerCase().includes('error')}`);
      
      // Tomar screenshot
      await page.screenshot({ path: `route-${route.replace('/', '')}.png`, fullPage: true });
      
      // Verificar si hay errores en la consola
      const logs = [];
      page.on('console', msg => {
        if (msg.type() === 'error') {
          logs.push(msg.text());
        }
      });
      
      if (logs.length > 0) {
        console.log(`Console errors for ${route}:`, logs);
      }
    }
  });

  test('should check sidebar navigation structure', async ({ page }) => {
    console.log('=== CHECKING SIDEBAR STRUCTURE ===');
    
    // Buscar el sidebar
    const sidebar = page.locator('nav, [role="navigation"], .sidebar, .menu');
    const sidebarCount = await sidebar.count();
    console.log(`Found ${sidebarCount} navigation elements`);
    
    if (sidebarCount > 0) {
      // Obtener la estructura del sidebar
      const sidebarContent = await sidebar.first().innerHTML();
      console.log('Sidebar HTML structure (first 500 chars):', sidebarContent.substring(0, 500));
      
      // Buscar todos los links en el sidebar
      const sidebarLinks = await sidebar.first().locator('a').all();
      console.log(`Found ${sidebarLinks.length} links in sidebar`);
      
      for (let i = 0; i < sidebarLinks.length; i++) {
        const link = sidebarLinks[i];
        const text = await link.textContent();
        const href = await link.getAttribute('href');
        console.log(`Sidebar link ${i}: "${text?.trim()}" -> "${href}"`);
      }
    }
    
    // Tomar screenshot del sidebar
    await page.screenshot({ path: 'sidebar-structure.png', fullPage: true });
  });

  test('should test clicking on menu items', async ({ page }) => {
    console.log('=== TESTING MENU CLICKS ===');
    
    // Buscar elementos que contengan "playlist" en el texto
    const playlistMenuItems = page.locator('text=/playlist/i');
    const count = await playlistMenuItems.count();
    
    console.log(`Found ${count} menu items containing "playlist"`);
    
    for (let i = 0; i < count; i++) {
      const item = playlistMenuItems.nth(i);
      const text = await item.textContent();
      const href = await item.getAttribute('href');
      
      console.log(`\n--- Clicking on item ${i}: "${text}" (href: ${href}) ---`);
      
      try {
        await item.click();
        await page.waitForLoadState('networkidle');
        
        const newUrl = page.url();
        console.log(`After clicking "${text}": URL = ${newUrl}`);
        
        // Tomar screenshot
        await page.screenshot({ path: `click-${i}-${text?.replace(/\s+/g, '-').toLowerCase()}.png`, fullPage: true });
        
      } catch (error) {
        console.log(`Error clicking on "${text}":`, error.message);
      }
    }
  });
}); 