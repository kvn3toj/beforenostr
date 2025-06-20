import { test, expect } from '@playwright/test';

// ✅ TEST E2E: Verificación específica de datos de Challenges (Backend NestJS)
// Test simplificado que verifica únicamente que los datos reales del backend se muestran correctamente
// Usa mock auth para evitar problemas de autenticación y enfocarse en la visualización de datos

test.describe('Challenges Data Verification', () => {
  test.beforeEach(async ({ page }) => {
    // 🎯 PASO 1: Configurar mock auth para test simplificado
    await page.goto('/');
    await page.waitForSelector('#root', { timeout: 15000 });
    
    // Habilitar mock auth temporalmente para el test
    await page.evaluate(() => {
      localStorage.setItem('coomunity_token', 'mock-jwt-token-for-testing');
      localStorage.setItem('coomunity_user', JSON.stringify({
        id: 'test-user-id',
        email: 'admin@gamifier.com',
        access_token: 'mock-jwt-token-for-testing'
      }));
    });
    
    console.log('✅ beforeEach completado: Mock auth configurado para test de datos');
  });

  test('debe mostrar los 3 desafíos reales del Backend NestJS', async ({ page }) => {
    console.log('🎯 TEST INICIADO: Verificación de datos reales de challenges');
    
    // 1. Navegar directamente a challenges
    console.log('📍 Navegando a /challenges...');
    await page.goto('/challenges');
    await page.waitForLoadState('networkidle');
    
    // 2. Esperar que la llamada a la API del backend se complete exitosamente
    console.log('🔄 Esperando respuesta del Backend NestJS...');
    const challengesResponse = await page.waitForResponse(
      response => response.url().includes('/challenges') && response.status() === 200,
      { timeout: 15000 }
    );
    
    // Verificar que la respuesta contiene datos
    const responseData = await challengesResponse.json();
    console.log('✅ Respuesta del backend recibida:', responseData.length, 'desafíos');
    expect(responseData.length).toBe(3);
    
    // 3. Verificar que la página carga correctamente
    console.log('🔍 Verificando carga de la página...');
    await page.waitForTimeout(2000); // Dar tiempo para que React renderice los datos
    
    // 4. Verificar header de la página
    const challengesHeader = page.locator('h1:has-text("🏆 Desafíos CoomÜnity"), h1:has-text("Desafíos"), h2:has-text("🏆 Desafíos CoomÜnity"), h2:has-text("Desafíos")');
    await expect(challengesHeader.first()).toBeVisible({ timeout: 10000 });
    console.log('✅ Header de Challenges encontrado');
    
    // 5. Verificar la presencia de los títulos específicos de los desafíos reales
    console.log('🔍 Verificando títulos de desafíos específicos...');
    
    // Desafío 1: Guía de Metanöia
    const metanoiaChallenge = page.locator('text=Guía de Metanöia');
    await expect(metanoiaChallenge).toBeVisible({ timeout: 10000 });
    console.log('✅ "Guía de Metanöia" encontrado');
    
    // Desafío 2: Emprendedor Confiable
    const emprendedorChallenge = page.locator('text=Emprendedor Confiable');
    await expect(emprendedorChallenge).toBeVisible({ timeout: 5000 });
    console.log('✅ "Emprendedor Confiable" encontrado');
    
    // Desafío 3: Innovación para el Bien Común
    const innovacionChallenge = page.locator('text=Innovación para el Bien Común');
    await expect(innovacionChallenge).toBeVisible({ timeout: 5000 });
    console.log('✅ "Innovación para el Bien Común" encontrado');
    
    // 6. Verificar descripciones específicas (palabras clave de las descripciones reales)
    console.log('🔍 Verificando contenido de descripciones...');
    
    // Verificar contenido de Metanöia
    const metanoiaDescription = page.locator('text*=5 nuevos miembros, text*=Metanöia, text*=transformación');
    await expect(metanoiaDescription.first()).toBeVisible({ timeout: 5000 });
    console.log('✅ Descripción de Metanöia verificada');
    
    // Verificar contenido de Emprendedor Confiable
    const emprendedorDescription = page.locator('text*=1000 Mëritos, text*=consistencia, text*=Emprendedores Confiables');
    await expect(emprendedorDescription.first()).toBeVisible({ timeout: 5000 });
    console.log('✅ Descripción de Emprendedor Confiable verificada');
    
    // Verificar contenido de Innovación
    const innovacionDescription = page.locator('text*=nueva idea, text*=beneficie, text*=comunidad');
    await expect(innovacionDescription.first()).toBeVisible({ timeout: 5000 });
    console.log('✅ Descripción de Innovación verificada');
    
    // 7. Verificar que hay elementos de recompensas
    console.log('🔍 Verificando sistema de recompensas...');
    
    const rewardsElements = page.locator('text*=Mëritos, text*=Lükas, text*=Badge');
    await expect(rewardsElements.first()).toBeVisible({ timeout: 5000 });
    console.log('✅ Elementos de recompensas encontrados');
    
    // 8. Tomar screenshot para evidencia
    await page.screenshot({ 
      path: `e2e/screenshots/challenges-real-data-verification-${Date.now()}.png`,
      fullPage: true 
    });
    
    // 9. Reportar resultados completos
    console.log('\n📋 RESUMEN DE VERIFICACIÓN COMPLETA:');
    console.log('✅ Backend NestJS respondió con 3 desafíos');
    console.log('✅ "Guía de Metanöia" visible');
    console.log('✅ "Emprendedor Confiable" visible');
    console.log('✅ "Innovación para el Bien Común" visible');
    console.log('✅ Descripciones específicas verificadas');
    console.log('✅ Sistema de recompensas presente');
    
    console.log('🎉 TEST EXITOSO: Los datos reales del Backend NestJS se muestran correctamente en la SuperApp');
  });

  test('debe verificar que NO se muestran datos mock antiguos', async ({ page }) => {
    console.log('🎯 TEST INICIADO: Verificación de ausencia de datos mock');
    
    // Navegar a challenges
    await page.goto('/challenges');
    await page.waitForLoadState('networkidle');
    
    // Esperar respuesta del backend
    await page.waitForResponse(
      response => response.url().includes('/challenges') && response.status() === 200,
      { timeout: 15000 }
    );
    
    await page.waitForTimeout(2000);
    
    // Verificar que NO aparecen los títulos de los desafíos mock antiguos
    console.log('🔍 Verificando ausencia de datos mock antiguos...');
    
    const mockChallengeTitles = [
      'Desafío de Ayni Diario',
      'Innovación Sostenible', 
      'Maestría en Colaboración'
    ];
    
    for (const title of mockChallengeTitles) {
      const mockElement = page.locator(`text=${title}`);
      await expect(mockElement).not.toBeVisible();
      console.log(`✅ Confirmado: "${title}" NO está presente (era mock)`);
    }
    
    console.log('🎉 TEST EXITOSO: No se muestran datos mock antiguos, solo datos reales del backend');
  });
}); 