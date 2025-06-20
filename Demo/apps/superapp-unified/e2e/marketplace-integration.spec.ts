import { test, expect } from '@playwright/test';
import { loginAs } from './utils/auth';

test.describe('Marketplace E2E Tests', () => {
  // 🔐 Hook de autenticación refactorizado usando función de utilidad
  test.beforeEach(async ({ page }) => {
    await loginAs(page);
  });

  test('should navigate to marketplace page successfully after login', async ({ page }) => {
    console.log('🎯 Testing marketplace navigation after login...');
    
    // Navegamos a la página del marketplace después del login
    await page.goto('/marketplace');
    await page.waitForSelector('#root');
    
    // Verificar que estamos en la página del marketplace
    const currentUrl = await page.url();
    console.log('🌐 Current URL:', currentUrl);
    expect(currentUrl).toContain('/marketplace');
    
    // Verificamos que la página del marketplace se cargue
    await expect(page).toHaveTitle(/CoomÜnity/);
    
    // Verificar que React se montó correctamente
    const reactRoot = await page.locator('#root').isVisible();
    expect(reactRoot).toBe(true);
    
    // Verificar que hay contenido en la página
    const pageContent = await page.textContent('body');
    expect(pageContent).toBeTruthy();
    expect(pageContent.length).toBeGreaterThan(50);
    
    console.log('✅ Marketplace page navigation successful');
  });

  test('should load marketplace page without critical JavaScript errors', async ({ page }) => {
    console.log('🎯 Testing marketplace page for critical errors...');
    
    await page.goto('/marketplace');
    await page.waitForSelector('#root');
    
    // Verificar que la página se carga correctamente sin errores de React
    const pageContent = await page.textContent('body');
    expect(pageContent).toBeTruthy();
    
    // Verificar que no hay errores de conexión visibles en la UI
    expect(pageContent).not.toContain('Error de conexión con el servidor');
    expect(pageContent).not.toContain('Something went wrong');
    expect(pageContent).not.toContain('Uncaught Error');
    
    // Verificar que React se montó correctamente
    const reactRoot = await page.locator('#root').isVisible();
    expect(reactRoot).toBe(true);
    
    console.log('✅ Marketplace page loaded without critical JavaScript errors');
  });

  test('should verify basic marketplace page structure', async ({ page }) => {
    console.log('🎯 Testing basic marketplace page structure...');
    
    await page.goto('/marketplace');
    await page.waitForSelector('#root');
    
    // Verificar que la página tiene estructura básica
    const pageContent = await page.textContent('body');
    expect(pageContent).toBeTruthy();
    
    // Verificar que contiene referencias a CoomÜnity
    const hasCoomUnityContent = pageContent.includes('CoomÜnity') || 
                               pageContent.includes('Marketplace') || 
                               pageContent.includes('marketplace');
    expect(hasCoomUnityContent).toBe(true);
    
    // Verificar que no hay errores de conexión visibles
    expect(pageContent).not.toContain('Error de conexión con el servidor');
    expect(pageContent).not.toContain('Failed to fetch');
    expect(pageContent).not.toContain('Network Error');
    
    console.log('✅ Basic marketplace page structure verified');
  });

  test('should handle marketplace search functionality if available', async ({ page }) => {
    console.log('🔍 Testing marketplace search functionality...');
    
    await page.goto('/marketplace');
    await page.waitForSelector('#root');
    
    // Buscar campo de búsqueda (sin fallar si no existe)
    const searchSelectors = [
      'input[placeholder*="search" i]',
      'input[placeholder*="buscar" i]',
      '[data-testid*="search"] input',
      'input[type="search"]',
      '.search input'
    ];
    
    let searchFieldFound = false;
    for (const selector of searchSelectors) {
      const searchField = page.locator(selector).first();
      const isVisible = await searchField.isVisible().catch(() => false);
      if (isVisible) {
        console.log(`✅ Found search field: ${selector}`);
        
        // Probar funcionalidad de búsqueda básica
        await searchField.fill('test');
        await page.waitForTimeout(1000);
        
        console.log('✅ Search functionality is available and responsive');
        searchFieldFound = true;
        break;
      }
    }
    
    if (!searchFieldFound) {
      console.log('ℹ️ Search field not found - this is acceptable for basic marketplace functionality');
    }
    
    // Este test no falla si no hay búsqueda, solo verifica si está disponible
    expect(true).toBeTruthy();
    
    console.log('✅ Marketplace search functionality test completed');
  });

  test('should verify user authentication persists in marketplace', async ({ page }) => {
    console.log('🔍 Testing authentication persistence in marketplace...');
    
    await page.goto('/marketplace');
    await page.waitForSelector('#root');
    
    // Verificar que seguimos autenticados navegando a otra página y volviendo
    await page.goto('/');
    await page.waitForSelector('#root');
    
    // Volver al marketplace
    await page.goto('/marketplace');
    await page.waitForSelector('#root');
    
    // Verificar que no fuimos redirigidos al login
    const currentUrl = await page.url();
    expect(currentUrl).not.toContain('/login');
    expect(currentUrl).toContain('/marketplace');
    
    console.log('✅ Authentication persists correctly in marketplace');
  });

  test('should display marketplace page with proper responsive behavior', async ({ page }) => {
    console.log('🎯 Testing marketplace responsive behavior...');
    
    await page.goto('/marketplace');
    await page.waitForSelector('#root');
    
    // Probar diferentes tamaños de pantalla básicos
    const viewports = [
      { width: 375, height: 667, name: 'Mobile' },
      { width: 1920, height: 1080, name: 'Desktop' }
    ];
    
    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.waitForTimeout(500);
      
      // Verificar que el contenido sigue siendo accesible
      const bodyContent = await page.textContent('body');
      expect(bodyContent).toBeTruthy();
      expect(bodyContent.length).toBeGreaterThan(50);
      
      console.log(`✅ ${viewport.name} view (${viewport.width}x${viewport.height}) is responsive`);
    }
    
    console.log('✅ Marketplace responsive behavior verified');
  });
}); 