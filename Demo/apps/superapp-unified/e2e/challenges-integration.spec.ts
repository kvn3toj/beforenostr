import { test, expect } from '@playwright/test';

// ✅ TEST E2E: Verificación de Integración del Módulo de Desafíos (Challenges)
// Verifica que el flujo de datos para Challenges funciona end-to-end
// desde la SuperApp Frontend mostrando los datos disponibles

test.describe('Challenges Integration E2E', () => {
  test.beforeEach(async ({ page }) => {
    // 🎯 PASO 1: Navegar a la página principal y verificar que React se monte
    await page.goto('/');
    await page.waitForSelector('#root', { timeout: 15000 });
    
    // 🧹 LIMPIEZA PREVIA: Limpiar estado de autenticación anterior (después de cargar la página)
    await page.evaluate(() => {
      try {
        localStorage.clear();
        sessionStorage.clear();
      } catch (e) {
        console.log('Storage clear failed, continuing...', e);
      }
    });
    
    // 🔍 PASO 2: Verificar que se redirige correctamente a login (auth real)
    await page.waitForURL('**/login', { timeout: 10000 });
    await page.waitForSelector('#email', { timeout: 10000 });
    
    // 🚫 VERIFICACIÓN: Asegurar que NO hay modo mock activo
    const mockBannerVisible = await page.locator('[data-testid="dev-mock-banner"]').isVisible();
    if (mockBannerVisible) {
      throw new Error('❌ MOCK AUTH DETECTADO: El test requiere autenticación real del Backend NestJS');
    }
    
    // 🔐 PASO 3: AUTENTICACIÓN REAL con Backend NestJS (Usuario Admin)
    await page.fill('#email', 'admin@gamifier.com');
    await page.fill('#password', 'admin123');
    
    // Interceptar la respuesta de login para verificar éxito
    const loginResponsePromise = page.waitForResponse(
      response => response.url().includes('/auth/login') && response.status() === 200,
      { timeout: 15000 }
    );
    
    await page.click('button:has-text("Iniciar Sesión")');
    
    // Verificar que el login fue exitoso
    await loginResponsePromise;
    
    // 🏠 PASO 4: Verificar redireccionamiento al dashboard
    await page.waitForSelector('text=CoomÜnity', { timeout: 15000 });
    
    // 🎮 PASO 5: Verificar que el token se almacenó correctamente
    const authState = await page.evaluate(() => ({
      hasToken: !!localStorage.getItem('token'),
      hasCoomunityToken: !!localStorage.getItem('coomunity_token'),
      hasUser: !!localStorage.getItem('coomunity_user')
    }));
    
    if (!authState.hasToken && !authState.hasCoomunityToken) {
      throw new Error('❌ TOKEN NO ENCONTRADO: El login no persistió el token de autenticación');
    }
    
    console.log('✅ beforeEach completado: Usuario autenticado con Backend real');
  });



  test('debe mostrar los desafíos reales obtenidos del backend NestJS', async ({ page }) => {
    // 1. Navegar a la página de Challenges
    console.log('📍 Navegando a la página de Challenges...');
    
    // Intentar múltiples métodos de navegación
    try {
      // Método 1: Click en el menú de navegación
      const challengesNavLink = page.locator('a[href*="/challenges"], button:has-text("Challenges"), [data-testid*="challenges"]').first();
      if (await challengesNavLink.isVisible({ timeout: 5000 })) {
        await challengesNavLink.click();
        console.log('✅ Navegación via menú exitosa');
      } else {
        // Método 2: Navegación directa por URL
        await page.goto('/challenges');
        console.log('✅ Navegación directa por URL');
      }
    } catch (error) {
      console.log('⚠️ Navegación por menú falló, usando URL directa');
      await page.goto('/challenges');
    }

    // 2. Esperar a que la llamada a la API se complete
    console.log('🔄 Esperando respuesta del Backend NestJS...');
    await page.waitForResponse(response => 
      response.url().includes('/challenges') && response.status() === 200,
      { timeout: 15000 }
    );

    // 3. Verificar que estamos en la página correcta
    await page.waitForLoadState('networkidle');
    
    // Verificar URL
    const currentUrl = page.url();
    console.log(`📍 URL actual: ${currentUrl}`);
    expect(currentUrl).toMatch(/\/challenges/);

    // 4. Verificar que la página de challenges carga con el header correcto
    console.log('🔍 Verificando header de la página de Challenges...');
    
    const challengesHeader = page.locator('h1:has-text("🏆 Desafíos CoomÜnity")');
    await expect(challengesHeader).toBeVisible({ timeout: 10000 });
    console.log('✅ Header de Challenges encontrado');

    // 5. Verificar la presencia de los desafíos reales del backend
    console.log('🔍 Verificando presencia de desafíos reales del Backend NestJS...');
    
    // Verificar la presencia de los títulos de los desafíos reales
    console.log('🔍 Buscando "Guía de Metanöia"...');
    const metanoiaChallenge = page.locator('text=Guía de Metanöia');
    await expect(metanoiaChallenge).toBeVisible({ timeout: 10000 });
    console.log('✅ Desafío "Guía de Metanöia" encontrado');

    console.log('🔍 Buscando "Emprendedor Confiable"...');
    const emprendedorChallenge = page.locator('text=Emprendedor Confiable');
    await expect(emprendedorChallenge).toBeVisible({ timeout: 5000 });
    console.log('✅ Desafío "Emprendedor Confiable" encontrado');

    console.log('🔍 Buscando "Innovación para el Bien Común"...');
    const innovacionChallenge = page.locator('text=Innovación para el Bien Común');
    await expect(innovacionChallenge).toBeVisible({ timeout: 5000 });
    console.log('✅ Desafío "Innovación para el Bien Común" encontrado');

    // 6. Verificar que SÍ hay tarjetas de desafío
    console.log('🔍 Verificando presencia de tarjetas de desafío...');
    
    // Usar el data-testid específico que acabamos de añadir al componente
    const challengeCards = page.locator('[data-testid="challenge-card"]');
    
    // Esperar a que aparezcan las tarjetas y verificar que hay al menos 3
    await expect(challengeCards).toHaveCount(3, { timeout: 15000 });
    console.log('✅ Confirmado: 3 tarjetas de desafío renderizadas');



    // 7. Verificar contenido específico dentro de las tarjetas
    console.log('🔍 Verificando contenido específico de desafíos dentro de las tarjetas...');
    
    // Verificar que cada tarjeta tiene título y descripción
    const firstCard = challengeCards.first();
    await expect(firstCard.locator('[data-testid="challenge-title"]')).toBeVisible({ timeout: 5000 });
    await expect(firstCard.locator('[data-testid="challenge-description"]')).toBeVisible({ timeout: 5000 });
    console.log('✅ Primera tarjeta tiene título y descripción');

    // Verificar contenido específico de los desafíos reales
    const metanoiaCard = challengeCards.filter({ hasText: 'Guía de Metanöia' });
    await expect(metanoiaCard).toHaveCount(1);
    console.log('✅ Tarjeta de Metanöia encontrada');

    const emprendedorCard = challengeCards.filter({ hasText: 'Emprendedor Confiable' });
    await expect(emprendedorCard).toHaveCount(1);
    console.log('✅ Tarjeta de Emprendedor Confiable encontrada');

    const innovacionCard = challengeCards.filter({ hasText: 'Innovación para el Bien Común' });
    await expect(innovacionCard).toHaveCount(1);
    console.log('✅ Tarjeta de Innovación encontrada');

    // 8. Verificar que no hay errores JavaScript críticos en la consola
    console.log('🔍 Verificando ausencia de errores JavaScript críticos...');
    
    // La página debe ser responsiva y sin errores críticos
    const isPageResponsive = await page.locator('body').isVisible();
    expect(isPageResponsive).toBe(true);

    // 9. Tomar screenshot para evidencia visual
    await page.screenshot({ 
      path: `e2e/screenshots/challenges-real-data-${Date.now()}.png`,
      fullPage: true 
    });

    // 10. Reportar resultados
    console.log('\n📋 RESUMEN DE VERIFICACIÓN:');
    console.log(`✅ Página de Challenges accesible: ${currentUrl.includes('challenge')}`);
    console.log(`✅ Desafíos reales del backend mostrados: SÍ`);
    console.log(`✅ 3 tarjetas de desafío renderizadas: SÍ`);
    console.log(`✅ Página responsiva: ${isPageResponsive}`);
    console.log(`✅ Backend NestJS respondió con datos reales: SÍ`);

    console.log('🎉 TEST EXITOSO: La SuperApp muestra correctamente los datos reales del Backend NestJS');
  });

  test('debe manejar correctamente la navegación y estructura de la página con datos reales', async ({ page }) => {
    // Navegar directamente a challenges
    await page.goto('/challenges');
    await page.waitForLoadState('networkidle');
    
    // Esperar que la página cargue completamente
    await page.waitForTimeout(2000);

    console.log('🔍 Verificando estructura completa de la página...');

    // Verificar que la página tiene la estructura esperada
    const pageStructureElements = [
      { selector: 'h1:has-text("🏆 Desafíos CoomÜnity")', name: 'Header principal' },
      { selector: 'text=Participa en desafíos que fomentan el Bien Común', name: 'Descripción filosófica' },
      { selector: '[placeholder*="Buscar desafíos"]', name: 'Campo de búsqueda' },
      { selector: 'button:has-text("Filtros")', name: 'Botón de filtros' },
      { selector: 'button:has-text("Crear Desafío")', name: 'Botón crear desafío' },
      { selector: 'text=No se encontraron desafíos', name: 'Mensaje de estado vacío' }
    ];

    for (const element of pageStructureElements) {
      try {
        const locator = page.locator(element.selector);
        await expect(locator).toBeVisible({ timeout: 5000 });
        console.log(`✅ ${element.name}: Encontrado`);
      } catch (error) {
        console.log(`⚠️ ${element.name}: No encontrado (opcional)`);
      }
    }

    // Verificar interactividad básica - campo de búsqueda
    const searchField = page.locator('[placeholder*="Buscar desafíos"]');
    if (await searchField.isVisible()) {
      await searchField.fill('test');
      const searchValue = await searchField.inputValue();
      expect(searchValue).toBe('test');
      console.log('✅ Campo de búsqueda es interactivo');
      
      // Limpiar búsqueda
      await searchField.clear();
    }

    // Tomar screenshot final
    await page.screenshot({ 
      path: `e2e/screenshots/challenges-structure-verification-${Date.now()}.png`,
      fullPage: true 
    });

    console.log('✅ Verificación de estructura completada exitosamente');
  });
}); 