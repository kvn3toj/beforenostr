import { test, expect } from '@playwright/test';

test.describe('Debug Horizontal Demo', () => {
  test('Debug navegación a horizontal-demo', async ({ page }) => {
    // Habilitar logging de consola
    page.on('console', (msg) => {
      console.log(`[BROWSER ${msg.type()}]:`, msg.text());
    });

    // Habilitar logging de errores
    page.on('pageerror', (error) => {
      console.log(`[PAGE ERROR]:`, error.message);
    });

    // Navegar a login
    console.log('🔐 Navegando a login...');
    await page.goto('/login');
    
    // Login
    console.log('📝 Realizando login...');
    await page.fill('[data-testid="login-email-input"] input', 'admin@gamifier.com');
    await page.fill('[data-testid="login-password-input"] input', 'admin123');
    await page.click('[data-testid="login-submit-button"]');
    
    // Esperar redirección
    console.log('⏳ Esperando redirección...');
    await page.waitForURL('**/', { timeout: 15000 });
    
    // Verificar estado después del login
    console.log('✅ Login completado, verificando estado...');
    await page.waitForSelector('#root', { timeout: 10000 });
    
    // Capturar URL actual
    const currentUrl = page.url();
    console.log('📍 URL actual después del login:', currentUrl);
    
    // Capturar título de la página
    const title = await page.title();
    console.log('📄 Título de la página:', title);
    
    // Capturar todos los h1 presentes
    const h1Elements = await page.locator('h1').allTextContents();
    console.log('📝 Elementos H1 encontrados:', h1Elements);
    
    // Esperar estabilización
    await page.waitForTimeout(3000);
    
    // Navegar a horizontal-demo
    console.log('🎬 Navegando a horizontal-demo...');
    await page.goto('/uplay/horizontal-demo');
    
    // Esperar que la página cargue
    await page.waitForSelector('#root', { timeout: 10000 });
    await page.waitForTimeout(2000);
    
    // Capturar información después de la navegación
    const newUrl = page.url();
    console.log('📍 URL después de navegar a horizontal-demo:', newUrl);
    
    const newTitle = await page.title();
    console.log('📄 Nuevo título de la página:', newTitle);
    
    const newH1Elements = await page.locator('h1').allTextContents();
    console.log('📝 Nuevos elementos H1:', newH1Elements);
    
    // Verificar si hay elementos específicos del horizontal demo
    const hasVideoDemo = await page.locator('text=Video Demo').isVisible();
    console.log('🎥 ¿Tiene "Video Demo"?:', hasVideoDemo);
    
    const hasHorizontalTitle = await page.locator('text=Reproductor Horizontal').isVisible();
    console.log('🎬 ¿Tiene "Reproductor Horizontal"?:', hasHorizontalTitle);
    
    const hasGPL = await page.locator('text=GPL').isVisible();
    console.log('🎮 ¿Tiene "GPL"?:', hasGPL);
    
    // Verificar si está mostrando el dashboard en su lugar
    const hasDashboard = await page.locator('text=Módulos CoomÜnity').isVisible();
    console.log('🏠 ¿Está mostrando dashboard?:', hasDashboard);
    
    // Capturar screenshot para análisis
    await page.screenshot({ path: 'debug-horizontal-demo.png', fullPage: true });
    console.log('📸 Screenshot guardado como debug-horizontal-demo.png');
    
    // Verificar si hay errores de JavaScript
    const jsErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        jsErrors.push(msg.text());
      }
    });
    
    await page.waitForTimeout(2000);
    console.log('🚨 Errores JS encontrados:', jsErrors);
    
    // Verificar el estado del router
    const routerState = await page.evaluate(() => {
      return {
        pathname: window.location.pathname,
        search: window.location.search,
        hash: window.location.hash,
        href: window.location.href
      };
    });
    console.log('🛣️ Estado del router:', routerState);
  });
}); 