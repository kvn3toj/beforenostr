import { test, expect } from '@playwright/test';

test.describe('🔍 Mundos Debug - Verificación Manual Simple', () => {
  test('Verificar navegación y contenido de Mundos', async ({ page }) => {
    console.log('🔍 Iniciando verificación manual de Mundos...');
    
    // Monitorear llamadas API
    const apiCalls = [];
    page.on('request', request => {
      if (request.url().includes('mundos') || request.url().includes('3002')) {
        apiCalls.push(`${request.method()} ${request.url()}`);
        console.log(`📡 API Call: ${request.method()} ${request.url()}`);
      }
    });
    
    // 1. Cargar página principal
    console.log('📍 PASO 1: Cargando página principal...');
    await page.goto('/');
    await page.waitForSelector('#root', { timeout: 10000 });
    
    // Capturar screenshot de la página principal
    await page.screenshot({ path: 'mundos-debug-home.png', fullPage: true });
    
    // Verificar navegación
    const navContent = await page.textContent('body');
    console.log(`📍 Navegación contiene "Mundos": ${navContent.includes('Mundos')}`);
    console.log(`📍 Navegación contiene "Worlds": ${navContent.includes('Worlds')}`);
    
    // 2. Navegar directamente a /mundos
    console.log('📍 PASO 2: Navegando directamente a /mundos...');
    await page.goto('/mundos');
    await page.waitForSelector('#root', { timeout: 10000 });
    await page.waitForTimeout(3000); // Esperar llamadas API
    
    // Capturar screenshot de la página de mundos
    await page.screenshot({ path: 'mundos-debug-page.png', fullPage: true });
    
    // Verificar contenido de la página
    const pageContent = await page.textContent('body');
    console.log(`📍 Página contiene "Mundos": ${pageContent.includes('Mundos')}`);
    console.log(`📍 Página contiene "Mundo": ${pageContent.includes('Mundo')}`);
    console.log(`📍 Página contiene "Desarrollo": ${pageContent.includes('Desarrollo')}`);
    console.log(`📍 Página contiene "Error": ${pageContent.includes('Error')}`);
    
    // 3. Verificar llamadas API
    console.log('📍 PASO 3: Verificando llamadas API...');
    console.log(`📡 Total de llamadas API detectadas: ${apiCalls.length}`);
    apiCalls.forEach((call, index) => {
      console.log(`📡 ${index + 1}. ${call}`);
    });
    
    // 4. Verificar backend directamente
    console.log('📍 PASO 4: Verificando backend directamente...');
    const backendResponse = await page.request.get('http://localhost:1111/mundos');
    console.log(`📍 Backend status: ${backendResponse.status()}`);
    
    if (backendResponse.status() === 200) {
      const backendData = await backendResponse.json();
      console.log(`📍 Backend data count: ${backendData.length}`);
      console.log(`📍 First mundo: ${backendData[0]?.title || 'No title'}`);
    }
    
    // El test siempre pasa - solo estamos recopilando información
    expect(true).toBe(true);
  });
}); 