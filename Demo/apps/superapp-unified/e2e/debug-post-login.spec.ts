import { test, expect } from '@playwright/test';

test.describe('Debug - Post Login con Autenticación Real', () => {
  test('debe verificar qué sucede después del login real', async ({ page }) => {
    // Ir a la página principal
    await page.goto('/');
    
    // Esperar a que React se monte
    await page.waitForSelector('#root');
    
    // Esperar a la redirección automática a login
    await page.waitForSelector('#email', { timeout: 10000 });
    
    console.log('=== ANTES DEL LOGIN ===');
    console.log('URL:', page.url());
    
    // Realizar login
    await page.fill('#email', 'test@coomunity.com');
    await page.fill('#password', 'test123');
    
    // Interceptar requests para ver qué pasa
    page.on('request', request => {
      console.log('REQUEST:', request.method(), request.url());
    });
    
    page.on('response', response => {
      console.log('RESPONSE:', response.status(), response.url());
    });
    
    await page.click('button:has-text("Iniciar Sesión")');
    
    // Esperar un poco después del login
    await page.waitForTimeout(5000);
    
    console.log('=== DESPUÉS DEL LOGIN ===');
    console.log('URL:', page.url());
    
    // Verificar token en localStorage
    const token = await page.evaluate(() => localStorage.getItem('token'));
    console.log('Token en localStorage:', token ? 'SÍ EXISTE' : 'NO EXISTE');
    
    // Tomar screenshot
    await page.screenshot({ path: 'debug-post-login.png', fullPage: true });
    
    // Verificar qué elementos están disponibles
    const availableText = await page.locator('h1, h2, h3, h4, h5, h6').allTextContents();
    console.log('=== TÍTULOS DISPONIBLES ===');
    availableText.forEach((text, i) => console.log(`${i}: "${text}"`));
    
    // Verificar navegación disponible
    const navLinks = await page.locator('a, button').allTextContents();
    console.log('=== NAVEGACIÓN DISPONIBLE ===');
    navLinks.slice(0, 15).forEach((text, i) => console.log(`${i}: "${text}"`));
    
    // Buscar específicamente ÜPlay
    const uplayElements = await page.locator(':has-text("ÜPlay"), :has-text("Üplay"), :has-text("uplay")').count();
    console.log('=== ELEMENTOS ÜPlay ===');
    console.log('Elementos que contienen "ÜPlay":', uplayElements);
    
    if (uplayElements > 0) {
      const uplayTexts = await page.locator(':has-text("ÜPlay"), :has-text("Üplay"), :has-text("uplay")').allTextContents();
      uplayTexts.forEach((text, i) => console.log(`ÜPlay ${i}: "${text}"`));
    }
    
    // Verificar si hay algún drawer o menú hamburguesa
    const menuElements = await page.locator('[aria-label*="menu"], [aria-label*="Menu"], button:has-text("☰")').count();
    console.log('Elementos de menú:', menuElements);
    
    // Verificar errores en consola
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    await page.waitForTimeout(2000);
    console.log('=== ERRORES DE CONSOLA ===');
    consoleErrors.forEach((error, i) => console.log(`Error ${i}: ${error}`));
    
    // Verificar HTML del body
    const bodyHTML = await page.locator('body').innerHTML();
    console.log('=== CONTENIDO DEL BODY (primeros 1500 chars) ===');
    console.log(bodyHTML.substring(0, 1500));
  });

  test('debe verificar si hay problemas de autenticación', async ({ page }) => {
    // Ir directamente a una ruta protegida después del login
    await page.goto('/');
    await page.waitForSelector('#root');
    await page.waitForSelector('#email', { timeout: 10000 });
    
    // Login
    await page.fill('#email', 'test@coomunity.com');
    await page.fill('#password', 'test123');
    await page.click('button:has-text("Iniciar Sesión")');
    
    // Esperar y verificar autenticación
    await page.waitForTimeout(3000);
    
    // Intentar ir directamente a ÜPlay
    console.log('=== INTENTANDO IR A /uplay DIRECTAMENTE ===');
    await page.goto('/uplay');
    await page.waitForTimeout(3000);
    
    console.log('URL después de ir a /uplay:', page.url());
    
    // Verificar si se redirige de vuelta al login
    const isBackToLogin = page.url().includes('/login');
    console.log('¿Se redirigió de vuelta al login?:', isBackToLogin);
    
    // Verificar el contenido de la página
    const pageTitle = await page.locator('h1, h2').first().textContent();
    console.log('Título de la página:', pageTitle);
    
    // Tomar screenshot
    await page.screenshot({ path: 'debug-uplay-direct-access.png', fullPage: true });
  });
}); 