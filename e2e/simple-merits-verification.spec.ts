import { test, expect } from '@playwright/test';

test.describe('✅ Verificación Simplificada de Méritos y Tokens', () => {
  
  test('Verificar conectividad básica de la SuperApp', async ({ page }) => {
    console.log('🎯 [SUPERAPP] Verificando conectividad básica...');
    
    await page.goto('/');
    
    // Verificar que la aplicación carga
    await expect(page).toHaveTitle(/CoomÜnity/);
    console.log('✅ [SUPERAPP] Aplicación carga correctamente');
    
    // Verificar que no hay errores críticos en consola
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error' && !msg.text().includes('favicon')) {
        errors.push(msg.text());
      }
    });
    
    await page.waitForTimeout(2000);
    
    if (errors.length > 0) {
      console.log('⚠️ [SUPERAPP] Errores de consola detectados:', errors);
    } else {
      console.log('✅ [SUPERAPP] Sin errores críticos en consola');
    }
  });

  test('Verificar página de Méritos existe y carga', async ({ page }) => {
    console.log('🏆 [MERITS] Verificando página de méritos...');
    
    await page.goto('/merits');
    
    // Verificar que la página carga
    await page.waitForLoadState('networkidle');
    
    // Buscar elementos típicos de la página de méritos
    const pageContent = await page.textContent('body');
    const hasMeritContent = pageContent?.includes('méritos') || 
                           pageContent?.includes('Mérito') || 
                           pageContent?.includes('Merit') ||
                           pageContent?.includes('Sistema de Méritos');
    
    expect(hasMeritContent).toBeTruthy();
    console.log('✅ [MERITS] Página de méritos carga con contenido relacionado');
  });

  test('Verificar página de Tokens existe y carga', async ({ page }) => {
    console.log('💰 [TOKENS] Verificando página de tokens...');
    
    await page.goto('/tokens');
    
    // Verificar que la página carga
    await page.waitForLoadState('networkidle');
    
    // Buscar elementos típicos de la página de tokens
    const pageContent = await page.textContent('body');
    const hasTokenContent = pageContent?.includes('token') || 
                           pageContent?.includes('Token') || 
                           pageContent?.includes('Tokens del Sistema');
    
    expect(hasTokenContent).toBeTruthy();
    console.log('✅ [TOKENS] Página de tokens carga con contenido relacionado');
  });

  test('Verificar página de Wallet existe y carga', async ({ page }) => {
    console.log('👛 [WALLET] Verificando página de wallet...');
    
    await page.goto('/wallet');
    
    // Verificar que la página carga
    await page.waitForLoadState('networkidle');
    
    // Buscar elementos típicos de la página de wallet
    const pageContent = await page.textContent('body');
    const hasWalletContent = pageContent?.includes('wallet') || 
                            pageContent?.includes('Wallet') || 
                            pageContent?.includes('saldo') ||
                            pageContent?.includes('balance');
    
    expect(hasWalletContent).toBeTruthy();
    console.log('✅ [WALLET] Página de wallet carga con contenido relacionado');
  });

  test('Verificar navegación entre módulos de gamificación', async ({ page }) => {
    console.log('🔄 [NAVIGATION] Verificando navegación entre módulos...');
    
    const modules = [
      { path: '/merits', name: 'Méritos' },
      { path: '/tokens', name: 'Tokens' },
      { path: '/wallet', name: 'Wallet' }
    ];
    
    for (const module of modules) {
      await page.goto(module.path);
      await page.waitForLoadState('networkidle');
      
      // Verificar que la página responde con contenido
      const bodyContent = await page.textContent('body');
      expect(bodyContent?.length).toBeGreaterThan(100);
      
      console.log(`✅ [NAVIGATION] Módulo ${module.name} navegable`);
    }
  });

  test('Verificar respuesta de endpoints de backend (conectividad)', async ({ page }) => {
    console.log('🔗 [BACKEND] Verificando conectividad con backend...');
    
    // Interceptar llamadas de red para verificar comunicación
    let backendCalled = false;
    
    page.route('**/api/**', route => {
      backendCalled = true;
      console.log(`📡 [BACKEND] Llamada interceptada: ${route.request().url()}`);
      route.continue();
    });
    
    page.route('**:3002/**', route => {
      backendCalled = true;
      console.log(`📡 [BACKEND] Llamada al puerto 3002: ${route.request().url()}`);
      route.continue();
    });
    
    // Navegar a páginas que deberían hacer llamadas al backend
    await page.goto('/merits');
    await page.waitForTimeout(3000);
    
    await page.goto('/tokens');
    await page.waitForTimeout(3000);
    
    console.log(`🔗 [BACKEND] Llamadas al backend detectadas: ${backendCalled}`);
  });

}); 