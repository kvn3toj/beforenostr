import { test, expect } from '@playwright/test';

test.describe('Mundos Fix Verification', () => {
  test('should display mundos data after fixing user permissions', async ({ page }) => {
    console.log('🔧 [FIX TEST] Verificando que la página de Mundos funciona después del fix...');
    
    // Interceptar llamadas de red para verificar que se llama a /mundos
    const networkCalls: string[] = [];
    page.on('request', (request) => {
      const url = request.url();
      if (url.includes('/mundos')) {
        console.log(`📡 [FIX TEST] Llamada detectada: ${request.method()} ${url}`);
        networkCalls.push(url);
      }
    });
    
    // Interceptar logs de la consola para verificar permisos
    const consoleLogs: string[] = [];
    page.on('console', (msg) => {
      const text = msg.text();
      if (text.includes('useHasRole') || text.includes('[MundosPage]') || text.includes('Super Admin')) {
        console.log(`📝 [FIX TEST] Console: ${text}`);
        consoleLogs.push(text);
      }
    });
    
    // Navegar a la página de Mundos
    await page.goto('/mundos');
    await page.waitForSelector('#root');
    
    // Esperar a que la página se cargue completamente
    await page.waitForTimeout(5000);
    
    // Verificar que estamos en la página correcta
    await expect(page).toHaveURL(/.*\/mundos/);
    console.log('✅ [FIX TEST] Navegación a /mundos exitosa');
    
    // Verificar que se realizó al menos una llamada a /mundos
    expect(networkCalls.length).toBeGreaterThan(0);
    console.log(`✅ [FIX TEST] Llamadas a /mundos detectadas: ${networkCalls.length}`);
    
    // Buscar el texto específico del primer mundo
    const mundoDesarrollo = page.locator('text=Mundo de Desarrollo Profesional');
    await expect(mundoDesarrollo).toBeVisible({ timeout: 10000 });
    console.log('✅ [FIX TEST] "Mundo de Desarrollo Profesional" visible en la UI');
    
    // Verificar que hay elementos de tabla o lista
    const tableRows = page.locator('tr, .MuiTableRow-root');
    const rowCount = await tableRows.count();
    expect(rowCount).toBeGreaterThan(1); // Al menos header + 1 fila de datos
    console.log(`✅ [FIX TEST] Filas de tabla encontradas: ${rowCount}`);
    
    // Verificar que no hay mensajes de error visibles
    const errorMessages = page.locator('text=/error|fallo|problema/i');
    const errorCount = await errorMessages.count();
    expect(errorCount).toBe(0);
    console.log(`✅ [FIX TEST] No hay mensajes de error visibles: ${errorCount}`);
    
    // Tomar screenshot de éxito
    await page.screenshot({ path: 'test-results/mundos-fix-success.png', fullPage: true });
    console.log('📸 [FIX TEST] Screenshot de éxito guardado');
    
    console.log('🎉 [FIX TEST] ¡Página de Mundos funcionando correctamente!');
  });
}); 