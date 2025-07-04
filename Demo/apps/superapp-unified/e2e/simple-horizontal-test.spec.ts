import { test, expect } from '@playwright/test';

test.describe('Test Simple - Horizontal Demo', () => {
  test('Verificar que la página carga correctamente', async ({ page }) => {
    // Login
    await page.goto('/login');
    await page.fill('[data-testid="login-email-input"] input', 'admin@gamifier.com');
    await page.fill('[data-testid="login-password-input"] input', 'admin123');
    await page.click('[data-testid="login-submit-button"]');
    await page.waitForURL('**/', { timeout: 15000 });
    await page.waitForTimeout(3000);

    // Navegar a horizontal demo
    await page.goto('/uplay/horizontal-demo');
    await page.waitForSelector('#root', { timeout: 10000 });
    await page.waitForTimeout(3000);

    // Verificar elementos básicos
    console.log('URL actual:', page.url());
    
    // Capturar todos los h1 para debug
    const h1Elements = await page.locator('h1').allTextContents();
    console.log('H1 elements found:', h1Elements);
    
    // Verificar que hay contenido
    await expect(page.locator('h1')).toBeVisible();
    
    // Capturar screenshot
    await page.screenshot({ path: 'horizontal-demo-test.png', fullPage: true });
    
    // Verificar que contiene texto relacionado con ÜPlay
    const pageContent = await page.textContent('body');
    console.log('Page contains ÜPlay:', pageContent?.includes('ÜPlay'));
    console.log('Page contains Reciprocidad:', pageContent?.includes('Reciprocidad'));
    console.log('Page contains YouTube iframe:', await page.locator('iframe').count());
  });
}); 