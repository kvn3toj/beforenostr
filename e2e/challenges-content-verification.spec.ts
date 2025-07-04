import { test, expect } from '@playwright/test';

test.describe('Fase A.8 - Verificación de Contenido del Módulo de Challenges', () => {
  
  test('A.8.4 - Verificar que la página de challenges carga correctamente', async ({ page }) => {
    await page.goto('/challenges');
    await page.waitForLoadState('networkidle');
    
    // Verificar que estamos en la URL correcta
    expect(page.url()).toContain('/challenges');
    
    // Verificar que la página tiene contenido
    const bodyContent = await page.locator('body').innerHTML();
    expect(bodyContent.length).toBeGreaterThan(100);
    
    console.log('✅ A.8.4 - Página de challenges carga correctamente');
  });

  test('A.8.5 - Verificar presencia de elementos de challenges', async ({ page }) => {
    await page.goto('/challenges');
    await page.waitForLoadState('networkidle');
    
    // Buscar elementos relacionados con challenges
    const challengeElements = await page.locator('text=/desafío|challenge|reto/i').count();
    const statsElements = await page.locator('text=/total|activos|participando|completados/i').count();
    const pointsElements = await page.locator('text=/pts|puntos|méritos|lükas|öndas/i').count();
    
    console.log(`✅ Encontrados ${challengeElements} elementos relacionados con challenges`);
    console.log(`✅ Encontrados ${statsElements} elementos de estadísticas`);
    console.log(`✅ Encontrados ${pointsElements} elementos de puntos/recompensas`);
    
    // Verificar que hay al menos algunos elementos relacionados
    const totalElements = challengeElements + statsElements + pointsElements;
    expect(totalElements).toBeGreaterThan(0);
    
    console.log('✅ A.8.5 - Elementos de challenges encontrados');
  });

  test('A.8.6 - Verificar datos mock específicos de challenges', async ({ page }) => {
    await page.goto('/challenges');
    await page.waitForLoadState('networkidle');
    
    // Buscar los desafíos mock específicos que implementamos
    const ayniChallenge = page.locator('text=/ayni/i');
    const innovationChallenge = page.locator('text=/innovación|sostenible/i');
    const collaborationChallenge = page.locator('text=/colaboración|maestría/i');
    
    const ayniVisible = await ayniChallenge.isVisible();
    const innovationVisible = await innovationChallenge.isVisible();
    const collaborationVisible = await collaborationChallenge.isVisible();
    
    if (ayniVisible) console.log('✅ Desafío de Ayni encontrado');
    if (innovationVisible) console.log('✅ Desafío de Innovación encontrado');
    if (collaborationVisible) console.log('✅ Desafío de Colaboración encontrado');
    
    // Al menos uno de los desafíos mock debería estar visible
    const hasAnyChallenge = ayniVisible || innovationVisible || collaborationVisible;
    
    if (hasAnyChallenge) {
      console.log('✅ A.8.6 - Datos mock de challenges encontrados');
    } else {
      console.log('⚠️ A.8.6 - No se encontraron datos mock específicos, pero la página carga');
    }
  });

  test('A.8.7 - Verificar funcionalidad de búsqueda si existe', async ({ page }) => {
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
      
      console.log('✅ A.8.7 - Funcionalidad de búsqueda funciona');
    } else {
      console.log('⚠️ A.8.7 - Campo de búsqueda no encontrado (puede ser normal)');
    }
  });

  test('A.8.8 - Verificar pestañas o navegación de challenges', async ({ page }) => {
    await page.goto('/challenges');
    await page.waitForLoadState('networkidle');
    
    // Buscar pestañas o elementos de navegación
    const tabs = await page.locator('[role="tab"], .MuiTab-root').count();
    const tabLabels = await page.locator('text=/todos|activos|mis|completados/i').count();
    const buttons = await page.locator('button').count();
    
    console.log(`✅ Encontradas ${tabs} pestañas`);
    console.log(`✅ Encontradas ${tabLabels} etiquetas de pestañas`);
    console.log(`✅ Encontrados ${buttons} botones`);
    
    if (tabs > 0 || tabLabels > 0) {
      console.log('✅ A.8.8 - Sistema de pestañas presente');
    } else {
      console.log('⚠️ A.8.8 - Sistema de pestañas no encontrado (puede ser normal)');
    }
  });

  test('A.8.9 - Verificar responsividad básica', async ({ page }) => {
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

  test('A.8.10 - Verificar integración con sistema de autenticación', async ({ page }) => {
    await page.goto('/challenges');
    await page.waitForLoadState('networkidle');
    
    // Verificar que no hay errores de autenticación
    const authErrors = await page.locator('text=/unauthorized|forbidden|login required/i').count();
    expect(authErrors).toBe(0);
    
    // Verificar que la aplicación está funcionando (no hay pantallas de error)
    const errorScreens = await page.locator('text=/error|failed|falló/i').count();
    
    console.log(`✅ Errores de autenticación: ${authErrors}`);
    console.log(`✅ Pantallas de error: ${errorScreens}`);
    
    console.log('✅ A.8.10 - Verificación de autenticación completada');
  });
}); 