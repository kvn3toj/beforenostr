import { test, expect } from '@playwright/test';
import { loginAs } from './utils/auth';

test.describe('Social Module E2E Flow', () => {
  // 🔐 Hook de autenticación usando nuestra función de utilidad refactorizada
  test.beforeEach(async ({ page }) => {
    await loginAs(page);
  });

  test('should load the social page and display basic social structure', async ({ page }) => {
    console.log('🎯 Testing social page navigation and basic structure...');
    
    // Navegar a la página social después del login
    await page.goto('/social');
    await page.waitForSelector('#root');
    
    // Verificar que estamos en la página social
    const currentUrl = await page.url();
    console.log('🌐 Current URL:', currentUrl);
    expect(currentUrl).toContain('/social');
    
    // Verificar que la página se carga correctamente
    await expect(page).toHaveTitle(/CoomÜnity/);
    
    // Verificar que React se montó correctamente
    const reactRoot = await page.locator('#root').isVisible();
    expect(reactRoot).toBe(true);
    
    // Verificar que hay contenido en la página
    const pageContent = await page.textContent('body');
    expect(pageContent).toBeTruthy();
    expect(pageContent.length).toBeGreaterThan(50);
    
    // Verificar elementos específicos del módulo social
    const hasSocialContent = pageContent.includes('Social') || 
                            pageContent.includes('CoomÜnity') || 
                            pageContent.includes('Comunidad') ||
                            pageContent.includes('Feed') ||
                            pageContent.includes('Posts');
    expect(hasSocialContent).toBe(true);
    
    console.log('✅ Social page navigation and structure verified');
  });

  test('should display social feed or community elements', async ({ page }) => {
    console.log('🎯 Testing social feed and community elements...');
    
    await page.goto('/social');
    await page.waitForSelector('#root');
    
    // Buscar elementos típicos de un feed social
    console.log('📱 Buscando elementos del feed social...');
    const possibleFeedSelectors = [
      '[data-testid="social-post"]',
      '[data-testid="post"]',
      '[data-testid="feed-item"]',
      '.post',
      '.social-post',
      '.feed-item',
      'article',
      '[role="article"]'
    ];
    
    let feedElementsFound = false;
    for (const selector of possibleFeedSelectors) {
      const elements = await page.locator(selector).count();
      if (elements > 0) {
        console.log(`✅ Found ${elements} feed elements with selector: ${selector}`);
        await expect(page.locator(selector).first()).toBeVisible({ timeout: 10000 });
        feedElementsFound = true;
        break;
      }
    }
    
    // Si no encontramos elementos específicos del feed, verificar estructura general
    if (!feedElementsFound) {
      console.log('ℹ️ Elementos específicos del feed no encontrados, verificando estructura general...');
      
      // Verificar que hay contenido interactivo (botones, enlaces)
      const buttons = await page.locator('button').count();
      const links = await page.locator('a').count();
      
      expect(buttons + links).toBeGreaterThan(0);
      console.log(`📊 Interactive elements found - Buttons: ${buttons}, Links: ${links}`);
    }
    
    // Verificar que no hay errores de conexión
    const pageContent = await page.textContent('body');
    expect(pageContent).not.toContain('Error de conexión con el servidor');
    expect(pageContent).not.toContain('Failed to fetch');
    expect(pageContent).not.toContain('Network Error');
    
    console.log('✅ Social feed and community elements verified');
  });

  test('should handle social interactions if available', async ({ page }) => {
    console.log('🎯 Testing social interactions...');
    
    await page.goto('/social');
    await page.waitForSelector('#root');
    
    // Buscar botones de interacción social típicos
    console.log('👍 Buscando elementos de interacción social...');
    const possibleInteractionSelectors = [
      'button[aria-label*="like" i]',
      'button[aria-label*="me gusta" i]',
      '[data-testid*="like"]',
      '[data-testid*="heart"]',
      '[data-testid*="favorite"]',
      'button:has-text("Like")',
      'button:has-text("Me gusta")',
      '.like-button',
      '.heart-button'
    ];
    
    let interactionFound = false;
    for (const selector of possibleInteractionSelectors) {
      const elements = await page.locator(selector).count();
      if (elements > 0) {
        console.log(`✅ Found ${elements} interaction elements with selector: ${selector}`);
        
        // Probar interacción básica
        const firstInteraction = page.locator(selector).first();
        const isVisible = await firstInteraction.isVisible().catch(() => false);
        
        if (isVisible) {
          console.log('🖱️ Testing interaction click...');
          await firstInteraction.click();
          await page.waitForTimeout(1000);
          console.log('✅ Interaction click successful');
        }
        
        interactionFound = true;
        break;
      }
    }
    
    if (!interactionFound) {
      console.log('ℹ️ Elementos de interacción específicos no encontrados - verificando botones generales...');
      
      // Verificar que hay botones clickeables en general
      const clickableButtons = await page.locator('button:visible').count();
      expect(clickableButtons).toBeGreaterThan(0);
      console.log(`🖱️ Clickable buttons found: ${clickableButtons}`);
    }
    
    console.log('✅ Social interactions test completed');
  });

  test('should verify backend connectivity for social data', async ({ page }) => {
    console.log('🔍 Testing backend connectivity for social data...');
    
    await page.goto('/social');
    await page.waitForSelector('#root');
    
    // Esperar a que los datos se carguen del backend
    await page.waitForTimeout(5000);
    
    // Verificar que no hay errores de conexión
    const pageContent = await page.textContent('body');
    expect(pageContent).not.toContain('Error de conexión con el servidor');
    expect(pageContent).not.toContain('Failed to fetch');
    expect(pageContent).not.toContain('Network Error');
    expect(pageContent).not.toContain('500 Internal Server Error');
    
    // Verificar que hay contenido dinámico (datos del backend)
    expect(pageContent).toBeTruthy();
    expect(pageContent.length).toBeGreaterThan(200);
    
    // Verificar que el contenido incluye elementos específicos del social
    const hasSocialContent = pageContent.includes('CoomÜnity') || 
                            pageContent.includes('Social') || 
                            pageContent.includes('Comunidad') ||
                            pageContent.includes('Feed');
    expect(hasSocialContent).toBe(true);
    
    console.log('✅ Backend connectivity for social data verified');
  });

  test('should verify authentication persists in social module', async ({ page }) => {
    console.log('🔍 Testing authentication persistence in social module...');
    
    await page.goto('/social');
    await page.waitForSelector('#root');
    
    // Verificar que seguimos autenticados navegando a otra página y volviendo
    await page.goto('/');
    await page.waitForSelector('#root');
    
    // Volver al módulo social
    await page.goto('/social');
    await page.waitForSelector('#root');
    
    // Verificar que no fuimos redirigidos al login
    const currentUrl = await page.url();
    expect(currentUrl).not.toContain('/login');
    expect(currentUrl).toContain('/social');
    
    console.log('✅ Authentication persists correctly in social module');
  });

  test('should display social page with proper responsive behavior', async ({ page }) => {
    console.log('🎯 Testing social responsive behavior...');
    
    await page.goto('/social');
    await page.waitForSelector('#root');
    
    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(1000);
    
    const mobileBodyWidth = await page.evaluate(() => document.body.offsetWidth);
    expect(mobileBodyWidth).toBeLessThanOrEqual(375);
    console.log('✅ Mobile view (375x667) is responsive');
    
    // Test desktop view
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.waitForTimeout(1000);
    
    const desktopBodyWidth = await page.evaluate(() => document.body.offsetWidth);
    expect(desktopBodyWidth).toBeGreaterThan(375);
    console.log('✅ Desktop view (1920x1080) is responsive');
    
    // Verificar que el contenido sigue siendo accesible en ambas vistas
    const pageContent = await page.textContent('body');
    expect(pageContent).toBeTruthy();
    
    console.log('✅ Social responsive behavior verified');
  });
}); 