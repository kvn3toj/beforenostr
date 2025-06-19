import { test, expect } from '@playwright/test';

/**
 * 🎯 VERIFICACIÓN DE CORRECCIÓN DE VARIABLES MOCK - SUPERAPP COOMUNITY
 * 
 * Test que verifica que ya no hay errores de variables mock como:
 * - "Can't find variable: mockActivities"
 * - "Can't find variable: mockAchievements" 
 * - Otros errores de importación de módulos
 * 
 * ✅ Optimización: Una sola sesión de navegador reutilizable
 */

test.describe('SuperApp CoomÜnity - Verificación Variables Mock Corregidas', () => {
  test('Verificación completa sin errores de variables mock', async ({ page }) => {
    console.log('🚀 Iniciando verificación de corrección de variables mock...');

    // Capturar errores críticos de JavaScript
    const jsErrors: string[] = [];
    const consoleErrors: string[] = [];
    
    page.on('pageerror', (error) => {
      const errorMessage = error.message;
      jsErrors.push(errorMessage);
      console.log('❌ JavaScript Error:', errorMessage);
    });

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        const errorText = msg.text();
        consoleErrors.push(errorText);
        console.log('❌ Console Error:', errorText);
      }
    });

    // 🔍 STEP 1: Cargar la aplicación
    console.log('📍 Step 1: Cargando SuperApp...');
    await page.goto('/');
    
    // Esperar a que React se monte
    await page.waitForSelector('#root', { timeout: 15000 });
    console.log('✅ Step 1: SuperApp cargada correctamente');

    // 🔍 STEP 2: Verificar que no hay errores críticos de variables mock
    console.log('📍 Step 2: Verificando ausencia de errores mock...');
    
    // Verificar errores específicos de variables mock
    const hasMockActivityError = jsErrors.some(error => 
      error.includes('mockActivities') || error.includes("Can't find variable: mockActivities")
    );
    const hasMockAchievementsError = jsErrors.some(error => 
      error.includes('mockAchievements') || error.includes("Can't find variable: mockAchievements")
    );
    const hasImportErrors = jsErrors.some(error => 
      error.includes('Importing a module script failed') || 
      error.includes('504 (Outdated Optimize Dep)')
    );

    expect(hasMockActivityError, `❌ Error de mockActivities encontrado: ${jsErrors.filter(e => e.includes('mockActivities')).join(', ')}`).toBe(false);
    expect(hasMockAchievementsError, `❌ Error de mockAchievements encontrado: ${jsErrors.filter(e => e.includes('mockAchievements')).join(', ')}`).toBe(false);
    expect(hasImportErrors, `❌ Errores de importación encontrados: ${jsErrors.filter(e => e.includes('Importing') || e.includes('504')).join(', ')}`).toBe(false);
    
    console.log('✅ Step 2: No hay errores de variables mock');

    // 🔍 STEP 3: Verificar navegación básica sin errores
    console.log('📍 Step 3: Verificando navegación básica...');
    
    // Dar tiempo para que se cargue completamente
    await page.waitForTimeout(3000);
    
    // Intentar navegar a página de perfil
    const profileLink = page.locator('a[href="/profile"], button:has-text("Perfil"), [data-testid="profile-link"]').first();
    if (await profileLink.isVisible({ timeout: 5000 })) {
      await profileLink.click();
      await page.waitForTimeout(2000); // Dar tiempo para cualquier error
      console.log('✅ Step 3: Navegación a perfil sin errores críticos');
    } else {
      console.log('ℹ️ Step 3: Link de perfil no encontrado, continuando...');
    }
    
    // 🔍 STEP 4: Verificar que no aparecieron nuevos errores durante la navegación
    console.log('📍 Step 4: Verificación final de errores...');
    
    const finalMockErrors = jsErrors.filter(error => 
      error.includes('mock') && (error.includes('not defined') || error.includes("Can't find variable"))
    );
    
    expect(finalMockErrors.length, `❌ Errores mock restantes: ${finalMockErrors.join(', ')}`).toBe(0);
    console.log('✅ Step 4: No hay errores mock restantes');

    // 🔍 STEP 5: Verificar que la página es funcional
    console.log('📍 Step 5: Verificando funcionalidad básica...');
    
    // Verificar que hay contenido visible
    const hasVisibleContent = await page.locator('body').isVisible();
    expect(hasVisibleContent, '❌ No hay contenido visible en la página').toBe(true);
    
    // Verificar que no hay errores de CSS críticos (NaN en estilos)
    const hasNaNErrors = consoleErrors.some(error => 
      error.includes('NaN is an invalid value') || error.includes('width css style')
    );
    expect(hasNaNErrors, `❌ Errores de CSS NaN encontrados: ${consoleErrors.filter(e => e.includes('NaN')).join(', ')}`).toBe(false);
    
    console.log('✅ Step 5: Funcionalidad básica verificada');

    // 📊 RESUMEN FINAL
    console.log('\n🎉 ========== RESUMEN DE VERIFICACIÓN ==========');
    console.log(`📊 Total de errores JS: ${jsErrors.length}`);
    console.log(`📊 Total de errores de consola: ${consoleErrors.length}`);
    console.log(`✅ Variables mock corregidas: mockActivities, mockAchievements`);
    console.log(`✅ Errores de importación resueltos`);
    console.log(`✅ SuperApp funcional sin errores críticos`);
    console.log('🎉 =============================================\n');

    // Test debe pasar si no hay errores críticos
    expect(jsErrors.filter(e => e.includes('mock') || e.includes('Importing') || e.includes('504')).length).toBe(0);
  });
}); 