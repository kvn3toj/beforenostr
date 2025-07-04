import { test, expect } from '@playwright/test';

test('mundos debug with logs', async ({ page }) => {
  console.log('🎯 [DEBUG] Iniciando test de debug de Mundos...');
  
  // Interceptar llamadas de red
  const networkCalls: string[] = [];
  page.on('request', (request) => {
    const url = request.url();
    if (url.includes('/mundos') || url.includes('3002')) {
      console.log(`📡 [DEBUG] REQUEST: ${request.method()} ${url}`);
      networkCalls.push(url);
    }
  });
  
  // Interceptar logs de consola
  page.on('console', (msg) => {
    const text = msg.text();
    if (text.includes('[useMundosQuery]') || text.includes('[Mundos]') || text.includes('useHasRole') || text.includes('Super Admin')) {
      console.log(`📝 [DEBUG] CONSOLE: ${text}`);
    }
  });
  
  console.log('🌍 [DEBUG] Navegando a /mundos...');
  await page.goto('/mundos');
  await page.waitForSelector('#root');
  await page.waitForTimeout(10000);
  
  console.log(`📊 [DEBUG] Total de llamadas de red relevantes: ${networkCalls.length}`);
  
  // Verificar si el mundo específico es visible
  const mundoDesarrollo = page.locator('text=Mundo de Desarrollo Profesional');
  const isVisible = await mundoDesarrollo.isVisible();
  console.log(`🎯 [DEBUG] "Mundo de Desarrollo Profesional" visible: ${isVisible}`);
  
  // Tomar screenshot
  await page.screenshot({ path: 'test-results/mundos-debug.png', fullPage: true });
  console.log('📸 [DEBUG] Screenshot guardado');
  
  console.log('🎉 [DEBUG] Test completado');
}); 