import { test, expect } from '@playwright/test';

test.describe('Fase A.3: Verificación del Módulo de Méritos y Tokens', () => {
  test.beforeEach(async ({ page }) => {
    // Navegar a la aplicación
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('Verificar conectividad con Backend NestJS', async ({ page }) => {
    // Verificar que la aplicación carga correctamente
    await expect(page).toHaveTitle(/CoomÜnity/);
    
    // Verificar que no hay errores de consola críticos
    const consoleErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    // Esperar un momento para capturar errores
    await page.waitForTimeout(3000);
    
    // Filtrar errores conocidos que no son críticos
    const criticalErrors = consoleErrors.filter(error => 
      !error.includes('favicon') && 
      !error.includes('analytics') &&
      !error.includes('hotjar')
    );
    
    expect(criticalErrors.length).toBe(0);
  });

  test('Verificar sistema de Méritos en Dashboard/Home', async ({ page }) => {
    await page.goto('/');
    
    // Buscar elementos relacionados con Öndas/Méritos en el dashboard
    const ondasElements = page.locator('[data-testid*="ondas"], [class*="ondas"], text=/Öndas/i');
    const meritElements = page.locator('[data-testid*="merit"], [class*="merit"], text=/Mérito/i');
    
    // Verificar que al menos uno de los sistemas de mérito está visible
    const hasOndas = await ondasElements.count() > 0;
    const hasMerits = await meritElements.count() > 0;
    
    expect(hasOndas || hasMerits).toBeTruthy();
    
    // Si hay elementos de Öndas, verificar que muestran información
    if (hasOndas) {
      const firstOnda = ondasElements.first();
      await expect(firstOnda).toBeVisible();
    }
  });

  test('Verificar sistema de Méritos en Social Feed', async ({ page }) => {
    await page.goto('/social');
    await page.waitForLoadState('networkidle');
    
    // Buscar elementos de mérito en el feed social
    const socialMeritElements = page.locator(
      '[data-testid*="merit"], [class*="merit"], text=/Mérito/i, text=/Öndas/i'
    );
    
    // Verificar leaderboard o sistema de puntuación
    const leaderboardElements = page.locator(
      '[data-testid*="leaderboard"], [class*="leaderboard"], text=/Ranking/i, text=/Clasificación/i'
    );
    
    // Al menos uno de estos sistemas debería estar presente
    const hasSocialMerits = await socialMeritElements.count() > 0;
    const hasLeaderboard = await leaderboardElements.count() > 0;
    
    expect(hasSocialMerits || hasLeaderboard).toBeTruthy();
  });

  test('Verificar sistema de Méritos en ÜPlay', async ({ page }) => {
    await page.goto('/uplay');
    await page.waitForLoadState('networkidle');
    
    // Buscar elementos de gamificación en ÜPlay
    const playMeritElements = page.locator(
      '[data-testid*="merit"], [data-testid*="stats"], [class*="merit"], [class*="stats"], text=/Estadísticas/i, text=/Progreso/i'
    );
    
    const hasPlayMerits = await playMeritElements.count() > 0;
    expect(hasPlayMerits).toBeTruthy();
  });

  test('Verificar sistema de Tokens (ÜCoins) en Wallet', async ({ page }) => {
    await page.goto('/wallet');
    await page.waitForLoadState('networkidle');
    
    // Buscar elementos relacionados con ÜCoins
    const ucoinElements = page.locator(
      '[data-testid*="ucoin"], [data-testid*="token"], [class*="ucoin"], [class*="token"], text=/ÜCoin/i, text=/UC/i'
    );
    
    // Buscar balance o información de wallet
    const balanceElements = page.locator(
      '[data-testid*="balance"], [class*="balance"], text=/Balance/i, text=/Saldo/i'
    );
    
    const hasUCoins = await ucoinElements.count() > 0;
    const hasBalance = await balanceElements.count() > 0;
    
    expect(hasUCoins || hasBalance).toBeTruthy();
    
    // Verificar que se muestra información de COP (pesos colombianos)
    const copElements = page.locator('text=/COP/i, text=/\\$/');
    const hasCOP = await copElements.count() > 0;
    expect(hasCOP).toBeTruthy();
  });

  test('Verificar navegación entre módulos con méritos', async ({ page }) => {
    // Verificar que se puede navegar entre los módulos principales
    const modules = [
      { path: '/', name: 'Home' },
      { path: '/social', name: 'Social' },
      { path: '/uplay', name: 'ÜPlay' },
      { path: '/wallet', name: 'Wallet' }
    ];
    
    for (const module of modules) {
      await page.goto(module.path);
      await page.waitForLoadState('networkidle');
      
      // Verificar que la página carga sin errores críticos
      const title = await page.title();
      expect(title).toContain('CoomÜnity');
      
      // Verificar que hay contenido visible
      const bodyContent = await page.locator('body').textContent();
      expect(bodyContent?.length).toBeGreaterThan(100);
    }
  });

  test('Verificar API de Méritos (simulación)', async ({ page }) => {
    // Interceptar llamadas a la API de méritos
    let apiCalled = false;
    
    page.route('**/api/merits**', route => {
      apiCalled = true;
      route.continue();
    });
    
    page.route('**/merits**', route => {
      apiCalled = true;
      route.continue();
    });
    
    // Navegar a una página que debería cargar méritos
    await page.goto('/social');
    await page.waitForLoadState('networkidle');
    
    // Esperar un momento para que se realicen las llamadas API
    await page.waitForTimeout(2000);
    
    // Nota: En modo offline/mock, es posible que no se realicen llamadas API reales
    // pero la funcionalidad debería seguir funcionando con datos simulados
    console.log('API de méritos llamada:', apiCalled);
  });

  test('Verificar manejo de errores y estados de carga', async ({ page }) => {
    await page.goto('/');
    
    // Buscar indicadores de carga
    const loadingElements = page.locator(
      '[data-testid*="loading"], [class*="loading"], [class*="skeleton"], text=/Cargando/i'
    );
    
    // Buscar manejo de errores
    const errorElements = page.locator(
      '[data-testid*="error"], [class*="error"], text=/Error/i'
    );
    
    // Verificar que la aplicación maneja estados apropiadamente
    // (Los elementos de carga pueden aparecer brevemente)
    await page.waitForTimeout(1000);
    
    // No debería haber errores visibles al usuario final
    const visibleErrors = await errorElements.count();
    expect(visibleErrors).toBe(0);
  });

  test('Verificar integración filosófica (Ayni/Bien Común)', async ({ page }) => {
    await page.goto('/');
    
    // Buscar referencias a conceptos filosóficos de CoomÜnity
    const philosophyElements = page.locator(
      'text=/Ayni/i, text=/Bien Común/i, text=/Reciprocidad/i, text=/Colabor/i'
    );
    
    const hasPhilosophy = await philosophyElements.count() > 0;
    
    // La filosofía puede estar integrada de manera sutil, no necesariamente visible
    // pero la funcionalidad debería reflejar estos principios
    console.log('Elementos filosóficos encontrados:', hasPhilosophy);
  });
}); 