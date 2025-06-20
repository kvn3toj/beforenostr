import { test, expect } from '@playwright/test';

test.describe('Mundos Data Display Integration', () => {
  test.beforeEach(async ({ page }) => {
    // Navegar a la página principal y esperar a que React se monte
    await page.goto('/');
    await page.waitForSelector('#root');
    
    // Esperar un momento para que la aplicación se inicialice completamente
    await page.waitForTimeout(1000);
  });

  test('should display mundos data from backend in the UI', async ({ page }) => {
    console.log('🌍 [TEST] Iniciando verificación de visualización de datos de Mundos...');
    
    // Navegar a la página de Mundos
    await page.goto('/mundos');
    await page.waitForSelector('#root');
    
    // Esperar a que la página de mundos cargue completamente
    await page.waitForTimeout(2000);
    
    // Verificar que estamos en la página correcta
    await expect(page).toHaveURL(/.*\/mundos/);
    console.log('✅ [TEST] Navegación a /mundos exitosa');
    
    // Verificar que el título de la página esté presente
    const pageTitle = page.locator('h1, h2, h3, h4').filter({ hasText: /mundo/i }).first();
    await expect(pageTitle).toBeVisible({ timeout: 10000 });
    console.log('✅ [TEST] Título de página de Mundos visible');
    
    // Verificar que se muestren datos de mundos del backend
    // Basándonos en los datos que vimos en el curl anterior: "Mundo de Desarrollo Profesional"
    const mundoDesarrollo = page.locator('text=Mundo de Desarrollo Profesional');
    await expect(mundoDesarrollo).toBeVisible({ timeout: 15000 });
    console.log('✅ [TEST] "Mundo de Desarrollo Profesional" visible en la UI');
    
    // Verificar que hay múltiples mundos (debería haber al menos 2-3 según el backend)
    const mundoCards = page.locator('[data-testid*="mundo"], .MuiCard-root, .mundo-card, tr').filter({ hasText: /mundo/i });
    const mundoCount = await mundoCards.count();
    expect(mundoCount).toBeGreaterThan(0);
    console.log(`✅ [TEST] Se encontraron ${mundoCount} elementos de mundos en la UI`);
    
    // Verificar que no hay errores de JavaScript en la consola relacionados con mundos
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error' && !msg.text().includes('404')) {
        consoleErrors.push(msg.text());
      }
    });
    
    // Esperar un momento para capturar posibles errores
    await page.waitForTimeout(2000);
    
    // Filtrar errores críticos (ignorar 404s que pueden ser normales)
    const criticalErrors = consoleErrors.filter(error => 
      !error.includes('404') && 
      !error.includes('favicon') &&
      !error.includes('manifest')
    );
    
    if (criticalErrors.length > 0) {
      console.warn('⚠️ [TEST] Errores de consola detectados:', criticalErrors);
    }
    
    console.log('🎉 [TEST] Verificación de visualización de Mundos completada exitosamente');
  });

  test('should navigate to mundo detail page', async ({ page }) => {
    console.log('🔍 [TEST] Iniciando verificación de navegación a detalle de Mundo...');
    
    // Navegar a la página de Mundos
    await page.goto('/mundos');
    await page.waitForSelector('#root');
    await page.waitForTimeout(2000);
    
    // Buscar el primer mundo disponible y hacer clic
    const firstMundoLink = page.locator('text=Mundo de Desarrollo Profesional').first();
    await expect(firstMundoLink).toBeVisible({ timeout: 10000 });
    
    // Hacer clic en el mundo para navegar al detalle
    await firstMundoLink.click();
    await page.waitForTimeout(2000);
    
    // Verificar que navegamos a una página de detalle
    // Puede ser /mundos/:id o /mundo/:id dependiendo del routing
    await expect(page).toHaveURL(/.*\/(mundo|mundos)\/[a-f0-9-]+/);
    console.log('✅ [TEST] Navegación a página de detalle exitosa');
    
    // Verificar que se muestra información detallada del mundo
    const detailTitle = page.locator('h1, h2, h3').filter({ hasText: /desarrollo profesional/i }).first();
    await expect(detailTitle).toBeVisible({ timeout: 10000 });
    console.log('✅ [TEST] Título del mundo en página de detalle visible');
    
    // Verificar que hay contenido adicional en la página de detalle
    const detailContent = page.locator('text=/descripción|contenido|playlist|video/i').first();
    await expect(detailContent).toBeVisible({ timeout: 5000 });
    console.log('✅ [TEST] Contenido adicional en página de detalle visible');
    
    console.log('🎉 [TEST] Verificación de navegación a detalle completada exitosamente');
  });

  test('should display loading states and handle data fetching', async ({ page }) => {
    console.log('⏳ [TEST] Iniciando verificación de estados de carga...');
    
    // Interceptar las llamadas a la API para verificar que se están haciendo
    let apiCallMade = false;
    page.on('request', (request) => {
      if (request.url().includes('/mundos') && request.url().includes('3002')) {
        apiCallMade = true;
        console.log('📡 [TEST] Llamada API detectada:', request.url());
      }
    });
    
    // Navegar a la página de mundos
    await page.goto('/mundos');
    await page.waitForSelector('#root');
    
    // Esperar a que se complete la carga
    await page.waitForTimeout(3000);
    
    // Verificar que se hizo la llamada a la API del backend
    expect(apiCallMade).toBe(true);
    console.log('✅ [TEST] Llamada a API del backend confirmada');
    
    // Verificar que los datos se cargaron (no hay mensaje de "sin datos" o similar)
    const noDataMessage = page.locator('text=/no hay mundos|sin datos|no data/i');
    await expect(noDataMessage).not.toBeVisible();
    console.log('✅ [TEST] Datos cargados correctamente (no hay mensaje de "sin datos")');
    
    console.log('🎉 [TEST] Verificación de estados de carga completada exitosamente');
  });
}); 