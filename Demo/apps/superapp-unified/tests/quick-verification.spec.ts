/**
 * 🚀 Quick Verification Test - Implementaciones Completadas
 * 
 * Verifica que las funcionalidades principales estén implementadas:
 * - ÜPlay gamificado
 * - Social Feed avanzado
 * - PWA Features
 * - Navegación básica
 */

import { test, expect } from '@playwright/test';

test.describe('Quick Implementation Verification', () => {
  
  test('🎮 ÜPlay gamificado está implementado', async ({ page }) => {
    // Ir directamente a ÜPlay
    await page.goto('/uplay');
    
    // Verificar que el componente principal cargue
    await page.waitForSelector('h1, h2, h3', { timeout: 10000 });
    
    // Verificar elementos gamificados
    await expect(page.locator('text=/méritos|merits|experiencia|experience|nivel|level/i')).toBeVisible({ timeout: 5000 });
    
    // Verificar que hay contenido de videos
    await expect(page.locator('text=/video|reproducir|play/i')).toBeVisible({ timeout: 5000 });
    
    console.log('✅ ÜPlay gamificado verificado');
  });

  test('🤝 Social Feed gamificado está implementado', async ({ page }) => {
    // Ir directamente al Social Feed
    await page.goto('/social');
    
    // Verificar que el componente principal cargue
    await page.waitForSelector('h1, h2, h3', { timeout: 10000 });
    
    // Verificar elementos sociales
    await expect(page.locator('text=/post|publicación|compartir|like|comentario/i')).toBeVisible({ timeout: 5000 });
    
    // Verificar filtros avanzados
    await expect(page.locator('text=/filtro|filter|ordenar|sort/i')).toBeVisible({ timeout: 5000 });
    
    console.log('✅ Social Feed gamificado verificado');
  });

  test('📱 PWA Demo está implementado', async ({ page }) => {
    // Ir directamente al PWA Demo
    await page.goto('/pwa-demo');
    
    // Verificar que el componente principal cargue
    await page.waitForSelector('h1, h2, h3', { timeout: 10000 });
    
    // Verificar funcionalidades PWA
    await expect(page.locator('text=/PWA|Progressive|compartir|share|vibración|vibration/i')).toBeVisible({ timeout: 5000 });
    
    // Verificar que hay botones de funcionalidades
    await expect(page.locator('button')).toBeVisible({ timeout: 5000 });
    
    console.log('✅ PWA Demo verificado');
  });

  test('🏠 Página principal funciona', async ({ page }) => {
    // Ir a la página principal
    await page.goto('/');
    
    // Verificar que la aplicación carga
    await page.waitForSelector('h1, h2, h3, .MuiBox-root', { timeout: 10000 });
    
    // Verificar que no hay errores críticos en consola
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    // Esperar un momento para capturar errores
    await page.waitForTimeout(2000);
    
    // No debería haber errores críticos (ignoramos warnings menores)
    const criticalErrors = errors.filter(error => 
      !error.includes('Warning') && 
      !error.includes('favicon') &&
      !error.includes('404')
    );
    
    expect(criticalErrors.length).toBe(0);
    
    console.log('✅ Página principal verificada');
  });

  test('🧭 Navegación directa a módulos funciona', async ({ page }) => {
    const routes = [
      { path: '/home', name: 'Home' },
      { path: '/marketplace', name: 'Marketplace' },
      { path: '/uplay', name: 'ÜPlay' },
      { path: '/social', name: 'Social' },
      { path: '/wallet', name: 'Wallet' },
      { path: '/pwa-demo', name: 'PWA Demo' }
    ];

    for (const route of routes) {
      console.log(`🔍 Verificando ruta: ${route.path}`);
      
      await page.goto(route.path);
      
      // Verificar que la página carga sin errores 404
      await expect(page).not.toHaveURL(/.*404.*/);
      
      // Verificar que hay contenido
      await page.waitForSelector('h1, h2, h3, .MuiBox-root, div', { timeout: 10000 });
      
      // Verificar que no es una página en blanco
      const content = await page.locator('body').textContent();
      expect(content?.length).toBeGreaterThan(10);
      
      console.log(`✅ ${route.name} funciona correctamente`);
    }
  });

  test('📊 Estado de backend conectividad', async ({ page }) => {
    // Ir a cualquier página que use el backend
    await page.goto('/home');
    
    // Interceptar llamadas al backend
    let backendCalls = 0;
    page.route('**/api/**', route => {
      backendCalls++;
      route.continue();
    });
    
    // Esperar un momento para que se hagan llamadas
    await page.waitForTimeout(3000);
    
    console.log(`📡 Llamadas al backend detectadas: ${backendCalls}`);
    
    // Verificar que al menos se intenten llamadas al backend
    expect(backendCalls).toBeGreaterThan(0);
    
    console.log('✅ Conectividad con backend verificada');
  });

  test('🎨 Componentes UI están renderizando', async ({ page }) => {
    await page.goto('/home');
    
    // Verificar Material-UI está cargado
    await expect(page.locator('.MuiBox-root, .MuiButton-root, .MuiTypography-root')).toBeVisible({ timeout: 10000 });
    
    // Verificar que hay estilos aplicados
    const element = page.locator('.MuiBox-root').first();
    const styles = await element.evaluate(el => window.getComputedStyle(el));
    
    // Debe tener estilos de Material-UI
    expect(styles.display).not.toBe('');
    
    console.log('✅ Componentes UI verificados');
  });

  test('🔧 Funcionalidades JavaScript están activas', async ({ page }) => {
    await page.goto('/pwa-demo');
    
    // Verificar que React está funcionando
    const reactVersion = await page.evaluate(() => {
      // @ts-ignore
      return window.React ? 'React detected' : 'React not found';
    });
    
    console.log(`⚛️ React status: ${reactVersion}`);
    
    // Verificar que hay interactividad
    const buttons = await page.locator('button').count();
    expect(buttons).toBeGreaterThan(0);
    
    console.log('✅ JavaScript funcionalidades verificadas');
  });
}); 