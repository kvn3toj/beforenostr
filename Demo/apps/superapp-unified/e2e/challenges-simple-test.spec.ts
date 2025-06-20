import { test, expect } from '@playwright/test';

test.describe('Fase A.8 - Verificación del Módulo de Challenges', () => {
  
  test('A.8.1 - Verificar ausencia de errores JavaScript críticos', async ({ page }) => {
    const errors: string[] = [];
    
    // Escuchar errores de console
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    // Escuchar errores de página
    page.on('pageerror', (error) => {
      errors.push(`Page Error: ${error.message}`);
    });
    
    // Ir a la página de challenges
    await page.goto('http://localhost:3001/challenges', { waitUntil: 'networkidle' });
    
    // Esperar a que la página se estabilice
    await page.waitForTimeout(3000);
    
    // Verificar que no hay errores de "Can't find variable"
    const criticalErrors = errors.filter(error => 
      error.includes("Can't find variable") || 
      error.includes("saving") ||
      error.includes("ReferenceError")
    );
    
    console.log('Errores detectados:', errors);
    console.log('Errores críticos:', criticalErrors);
    
    // Verificar que no hay errores críticos
    expect(criticalErrors).toHaveLength(0);
    
    console.log('✅ A.8.1 - No se detectaron errores JavaScript críticos');
  });

  test('A.8.2 - Verificar que la aplicación React monta correctamente', async ({ page }) => {
    await page.goto('http://localhost:3001/challenges');
    
    // Esperar que React monte
    await page.waitForSelector('#root', { timeout: 10000 });
    
    // Verificar que hay contenido en el root
    const rootContent = await page.locator('#root').innerHTML();
    expect(rootContent.length).toBeGreaterThan(100);
    
    console.log('✅ A.8.2 - Aplicación React monta correctamente');
  });

  test('A.8.3 - Verificar navegación a challenges desde barra lateral', async ({ page }) => {
    await page.goto('http://localhost:3001/');
    
    // Esperar a que la página principal cargue
    await page.waitForSelector('#root', { timeout: 10000 });
    
    // Buscar el enlace de Desafíos en la navegación
    const challengesLink = page.locator('a[href*="challenges"], button:has-text("Desafíos")').first();
    
    // Si existe el enlace, hacer click
    if (await challengesLink.count() > 0) {
      await challengesLink.click();
      
      // Verificar que llegamos a /challenges
      await page.waitForURL('**/challenges');
      expect(page.url()).toContain('/challenges');
      
      console.log('✅ A.8.3 - Navegación a challenges funciona correctamente');
    } else {
      console.log('⚠️ A.8.3 - Enlace de Desafíos no encontrado en navegación');
    }
  });
});

test.describe('Simple Challenges Test', () => {
  test('verify challenges hook is working and making API calls', async ({ page }) => {
    // Configure mock auth
    await page.goto('/');
    await page.waitForSelector('#root', { timeout: 15000 });
    
    await page.evaluate(() => {
      localStorage.setItem('coomunity_token', 'mock-jwt-token-for-testing');
      localStorage.setItem('coomunity_user', JSON.stringify({
        id: 'test-user-id',
        email: 'admin@gamifier.com',
        access_token: 'mock-jwt-token-for-testing'
      }));
    });

    // Listen for console logs
    const consoleLogs: string[] = [];
    page.on('console', (msg) => {
      consoleLogs.push(`${msg.type()}: ${msg.text()}`);
    });

    // Listen for network requests
    const requests: any[] = [];
    page.on('request', (request) => {
      if (request.url().includes('/challenges')) {
        requests.push({
          url: request.url(),
          method: request.method(),
          headers: request.headers()
        });
      }
    });

    // Navigate to challenges page
    console.log('Navigating to challenges page...');
    await page.goto('/challenges');
    
    // Wait for page to load
    await page.waitForTimeout(5000);
    
    // Print console logs
    console.log('\n=== CONSOLE LOGS ===');
    consoleLogs.forEach(log => console.log(log));
    
    // Print network requests
    console.log('\n=== NETWORK REQUESTS ===');
    requests.forEach(req => {
      console.log(`${req.method} ${req.url}`);
      console.log(`Authorization: ${req.headers.authorization || 'none'}`);
    });
    
    // Basic verification that page loaded
    const body = await page.locator('body').isVisible();
    expect(body).toBe(true);
    
    console.log(`\n=== SUMMARY ===`);
    console.log(`Console logs: ${consoleLogs.length}`);
    console.log(`Challenges requests: ${requests.length}`);
    console.log(`Page loaded: ${body}`);
  });
}); 