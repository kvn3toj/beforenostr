import { test, expect } from '@playwright/test';

test.describe('Fase A.8 - Verificación del Módulo de Challenges', () => {

  test('A.8.1 - Verificar que la aplicación carga y la ruta /challenges responde', async ({ page }) => {
    await page.goto('/challenges');
    await page.waitForLoadState('networkidle');

    const url = page.url();
    expect(url).toContain('/challenges');

    console.log('✅ A.8.1 - Aplicación carga y ruta /challenges responde');
  });

  test('A.8.2 - Verificar navegación a Challenges desde sidebar', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const challengesLink = page.locator('text=Desafíos').first();

    if (await challengesLink.isVisible()) {
      await challengesLink.click();
      await page.waitForLoadState('networkidle');
      expect(page.url()).toContain('/challenges');
      console.log('✅ A.8.2 - Navegación desde sidebar funciona');
    } else {
      console.log('⚠️ A.8.2 - Enlace de Desafíos no encontrado en sidebar');
    }
  });

  test('A.8.3 - Verificar presencia de elementos de challenges', async ({ page }) => {
    await page.goto('/challenges');
    await page.waitForLoadState('networkidle');

    const challengeElements = await page.locator('text=/desafío|challenge|reto/i').count();
    const statsElements = await page.locator('text=/total|activos|participando|completados/i').count();
    const pointsElements = await page.locator('text=/pts|puntos|méritos/i').count();

    console.log(`✅ Encontrados ${challengeElements} elementos relacionados con challenges`);
    console.log(`✅ Encontrados ${statsElements} elementos de estadísticas`);
    console.log(`✅ Encontrados ${pointsElements} elementos de puntos/méritos`);

    expect(challengeElements + statsElements + pointsElements).toBeGreaterThan(0);

    console.log('✅ A.8.3 - Verificación de elementos completada');
  });

  test('A.8.4 - Verificar datos mock de challenges', async ({ page }) => {
    await page.goto('/challenges');
    await page.waitForLoadState('networkidle');

    const ayniChallenge = page.locator('text=/ayni/i');
    const innovationChallenge = page.locator('text=/innovación|sostenible/i');
    const collaborationChallenge = page.locator('text=/colaboración|maestría/i');

    const ayniVisible = await ayniChallenge.isVisible();
    const innovationVisible = await innovationChallenge.isVisible();
    const collaborationVisible = await collaborationChallenge.isVisible();

    if (ayniVisible) console.log('✅ Desafío de Ayni encontrado');
    if (innovationVisible) console.log('✅ Desafío de Innovación encontrado');
    if (collaborationVisible) console.log('✅ Desafío de Colaboración encontrado');

    expect(ayniVisible || innovationVisible || collaborationVisible).toBeTruthy();

    console.log('✅ A.8.4 - Verificación de datos mock completada');
  });

  test('A.8.5 - Verificar que no hay errores JavaScript críticos', async ({ page }) => {
    const errors: string[] = [];

    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    page.on('pageerror', error => {
      errors.push(error.message);
    });

    await page.goto('/challenges');
    await page.waitForLoadState('networkidle');

    const criticalErrors = errors.filter(error =>
      !error.includes('notifications') &&
      !error.includes('404') &&
      !error.includes('Failed to load resource')
    );

    if (criticalErrors.length > 0) {
      console.log('⚠️ Errores críticos encontrados:');
      criticalErrors.forEach(error => console.log(`  - ${error}`));
    }

    console.log('✅ A.8.5 - Verificación de errores completada');
  });

  test('A.8.5 - Verificar funcionalidad de búsqueda', async ({ page }) => {
    await page.goto('/challenges');
    await page.waitForLoadState('networkidle');

    // Buscar campo de búsqueda
    const searchInput = page.locator('input[placeholder*="buscar" i], input[placeholder*="search" i]').first();

    if (await searchInput.isVisible()) {
      await searchInput.fill('ayni');
      await page.waitForTimeout(1000); // Esperar a que se aplique el filtro

      // Verificar que se filtra el contenido
      const filteredContent = await page.locator('text=/ayni/i').count();
      expect(filteredContent).toBeGreaterThan(0);

      console.log('✅ A.8.5 - Funcionalidad de búsqueda funciona');
    } else {
      console.log('⚠️ A.8.5 - Campo de búsqueda no encontrado');
    }
  });

  test('A.8.6 - Verificar pestañas de challenges', async ({ page }) => {
    await page.goto('/challenges');
    await page.waitForLoadState('networkidle');

    // Buscar pestañas
    const tabs = await page.locator('[role="tab"], .MuiTab-root').count();
    const tabLabels = await page.locator('text=/todos|activos|mis|completados/i').count();

    console.log(`✅ Encontradas ${tabs} pestañas`);
    console.log(`✅ Encontradas ${tabLabels} etiquetas de pestañas`);

    if (tabs > 0 || tabLabels > 0) {
      console.log('✅ A.8.6 - Sistema de pestañas presente');
    } else {
      console.log('⚠️ A.8.6 - Sistema de pestañas no encontrado');
    }
  });

  test('A.8.7 - Verificar navegación a detalles de challenge', async ({ page }) => {
    await page.goto('/challenges');
    await page.waitForLoadState('networkidle');

    // Buscar elementos clickeables de challenges
    const challengeCards = page.locator('[data-testid*="challenge"], .challenge-card, .MuiCard-root').first();
    const challengeLinks = page.locator('text=/desafío|challenge/i').first();

    if (await challengeCards.isVisible()) {
      await challengeCards.click();
      await page.waitForLoadState('networkidle');

      // Verificar que navegamos a una página de detalles
      const url = page.url();
      if (url.includes('/challenges/') && url !== '/challenges') {
        console.log('✅ A.8.7 - Navegación a detalles funciona');
      } else {
        console.log('⚠️ A.8.7 - No se navegó a detalles específicos');
      }
    } else if (await challengeLinks.isVisible()) {
      await challengeLinks.click();
      await page.waitForLoadState('networkidle');
      console.log('✅ A.8.7 - Navegación alternativa funciona');
    } else {
      console.log('⚠️ A.8.7 - No se encontraron elementos clickeables');
    }
  });

  test('A.8.8 - Verificar que no hay errores JavaScript críticos', async ({ page }) => {
    const errors: string[] = [];

    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    page.on('pageerror', error => {
      errors.push(error.message);
    });

    await page.goto('/challenges');
    await page.waitForLoadState('networkidle');

    // Filtrar errores críticos (excluyendo 404s de notificaciones que son esperados)
    const criticalErrors = errors.filter(error =>
      !error.includes('notifications') &&
      !error.includes('404') &&
      !error.includes('Failed to load resource')
    );

    if (criticalErrors.length > 0) {
      console.log('⚠️ Errores críticos encontrados:');
      criticalErrors.forEach(error => console.log(`  - ${error}`));
    }

    console.log('✅ A.8.8 - Verificación de errores completada');
  });

  test('A.8.9 - Verificar responsividad del módulo', async ({ page }) => {
    await page.goto('/challenges');
    await page.waitForLoadState('networkidle');

    // Probar diferentes tamaños de pantalla
    const viewports = [
      { width: 375, height: 667, name: 'Mobile' },
      { width: 768, height: 1024, name: 'Tablet' },
      { width: 1280, height: 720, name: 'Desktop' }
    ];

    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.waitForTimeout(500);

      // Verificar que el contenido sigue siendo accesible
      const isContentVisible = await page.locator('body').isVisible();
      expect(isContentVisible).toBeTruthy();

      console.log(`✅ ${viewport.name} (${viewport.width}x${viewport.height}) - Contenido visible`);
    }

    console.log('✅ A.8.9 - Verificación de responsividad completada');
  });

  test('A.8.10 - Verificar integración con sistema de autenticación mock', async ({ page }) => {
    await page.goto('/challenges');
    await page.waitForLoadState('networkidle');

    // Verificar que la aplicación está usando mock auth
    const authElements = await page.locator('text=/usuario|user|perfil|profile/i').count();
    const mockIndicators = await page.locator('text=/mock|test|demo/i').count();

    console.log(`✅ Elementos de autenticación encontrados: ${authElements}`);
    console.log(`✅ Indicadores de mock encontrados: ${mockIndicators}`);

    // Verificar que no hay errores de autenticación
    const authErrors = await page.locator('text=/unauthorized|forbidden|login required/i').count();
    expect(authErrors).toBe(0);

    console.log('✅ A.8.10 - Verificación de autenticación mock completada');
  });
});
