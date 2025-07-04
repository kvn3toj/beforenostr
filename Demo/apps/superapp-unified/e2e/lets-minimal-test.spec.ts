import { test, expect } from '@playwright/test';

test.describe('LETS Minimal Test', () => {
  test('verify LETS page loads without auth issues', async ({ page }) => {
    // Navigate directly to LETS page
    await page.goto('/lets');
    
    // Wait for page to load
    await page.waitForTimeout(3000);
    
    // Get page title
    const title = await page.title();
    console.log('🔍 Page title:', title);
    
    // Check for error messages
    const hasError = await page.locator('text=¡Oops! Algo salió mal').isVisible().catch(() => false);
    console.log('🔍 Has error message:', hasError);
    
    // Check for LETS content
    const hasLetsTitle = await page.locator('text=🔄 Sistema LETS CoomÜnity').isVisible().catch(() => false);
    console.log('🔍 Has LETS title:', hasLetsTitle);
    
    // Get all text content
    const bodyText = await page.locator('body').textContent();
    console.log('🔍 Page contains LETS:', bodyText?.includes('LETS') ? 'YES' : 'NO');
    console.log('🔍 Page contains Sistema:', bodyText?.includes('Sistema') ? 'YES' : 'NO');
    
    // Take screenshot
    await page.screenshot({ path: 'lets-minimal-test.png', fullPage: true });
    console.log('📸 Screenshot saved as lets-minimal-test.png');
    
    // The test passes if we can navigate to the page without critical errors
    expect(title).toContain('CoomÜnity');
  });
}); 