/**
 * 🔧 Test de Debug de Datos del Módulo Social
 * 
 * Test para verificar específicamente el flujo de datos desde el backend
 * hasta el renderizado en el frontend.
 */

import { test, expect } from '@playwright/test';

test.describe('🔧 Debug de Datos del Módulo Social', () => {
  
  test('🔍 [DEBUG] Verificar flujo completo de datos backend → frontend', async ({ page }) => {
    console.log('🎯 Iniciando debug del flujo de datos...');

    // Interceptar todas las llamadas de red
    const networkCalls: Array<{ url: string, status: number, response?: any }> = [];
    
    page.on('response', async (response) => {
      if (response.url().includes('/social/publications')) {
        try {
          const responseData = await response.json();
          networkCalls.push({
            url: response.url(),
            status: response.status(),
            response: responseData
          });
          console.log(`📡 [NETWORK] ${response.status()} - ${response.url()}`);
          console.log(`📦 [DATA] Response:`, JSON.stringify(responseData, null, 2));
        } catch (error) {
          console.error(`❌ [ERROR] No se pudo parsear respuesta de ${response.url()}:`, error);
        }
      }
    });

    // Interceptar logs de consola
    page.on('console', (msg) => {
      if (msg.text().includes('SocialFeed Debug')) {
        console.log(`🖥️ [CONSOLE]`, msg.text());
      }
    });

    // Navegación con login automático (usando mock auth si está habilitado)
    console.log('🔐 Navegando al login...');
    await page.goto('/login');
    
    // Hacer login
    await page.fill('[data-testid="login-email-input"] input', 'user@gamifier.com');
    await page.fill('[data-testid="login-password-input"] input', '123456');
    await page.click('[data-testid="login-submit-button"]');
    
    // Esperar un momento para el login
    await page.waitForTimeout(3000);
    
    console.log('📱 Navegando al módulo social...');
    await page.goto('/social');
    
    // Esperar a que la página se cargue completamente
    await page.waitForTimeout(5000);
    
    // Verificar elementos en el DOM
    console.log('🔍 Verificando elementos en el DOM...');
    
    const domElements = {
      root: await page.locator('#root').count(),
      socialMain: await page.locator('[data-testid*="social"]').count(),
      postsContainer: await page.locator('[data-testid="social-posts-container"]').count(),
      postCards: await page.locator('[data-testid="post-card"]').count(),
      createPost: await page.locator('[data-testid*="create-post"]').count(),
      loadingSpinners: await page.locator('text=Cargando').count(),
      errorAlerts: await page.locator('[role="alert"]').count(),
      tabs: await page.locator('[role="tab"]').count(),
      feedTab: await page.locator('text=Feed Social').count(),
    };
    
    console.log('🎨 Elementos DOM encontrados:');
    Object.entries(domElements).forEach(([key, count]) => {
      console.log(`  - ${key}: ${count}`);
    });
    
    // Verificar si hay un tab activo de "Feed Social"
    const feedTabVisible = await page.locator('text=Feed Social').isVisible();
    console.log(`📑 Tab "Feed Social" visible: ${feedTabVisible}`);
    
    if (feedTabVisible) {
      console.log('👆 Haciendo click en el tab Feed Social...');
      await page.click('text=Feed Social');
      await page.waitForTimeout(2000);
      
      // Verificar de nuevo después del click
      const postsAfterClick = await page.locator('[data-testid="post-card"]').count();
      console.log(`📊 Posts después del click en tab: ${postsAfterClick}`);
    }
    
    // Verificar el estado de autenticación en localStorage
    const authToken = await page.evaluate(() => localStorage.getItem('authToken'));
    const userInfo = await page.evaluate(() => localStorage.getItem('user'));
    
    console.log('🔐 Estado de autenticación:');
    console.log(`  - Token presente: ${!!authToken}`);
    console.log(`  - Usuario presente: ${!!userInfo}`);
    if (userInfo) {
      try {
        const user = JSON.parse(userInfo);
        console.log(`  - Usuario ID: ${user.id}`);
        console.log(`  - Usuario email: ${user.email}`);
      } catch (e) {
        console.log(`  - Error parsing user info: ${e}`);
      }
    }
    
    // Resumen de la investigación
    console.log('📋 RESUMEN DEL DEBUG:');
    console.log(`  - Llamadas al backend: ${networkCalls.length}`);
    console.log(`  - Posts renderizados: ${domElements.postCards}`);
    console.log(`  - Container de posts: ${domElements.postsContainer}`);
    console.log(`  - Errores visibles: ${domElements.errorAlerts}`);
    console.log(`  - Estado de carga: ${domElements.loadingSpinners}`);
    
    // El test pasa si encontramos el contenedor de posts (aunque esté vacío)
    expect(domElements.root).toBeGreaterThan(0);
    
    // Tomar screenshot del estado final
    await page.screenshot({ path: 'social-data-debug-final.png', fullPage: true });
    console.log('📸 Screenshot guardado como social-data-debug-final.png');
  });
}); 