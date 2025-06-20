import { test, expect } from '@playwright/test';

test.describe('Home Free Navigation - User Controlled', () => {
  test('Free Navigation - Close browser when done', async ({ page }) => {
    console.log('🎯 Iniciando navegación libre del Home...');
    console.log('🌐 Abriendo navegador para navegación manual...');
    
    // Navegar al Home
    await page.goto('/');
    
    // Esperar a que la página cargue completamente
    await page.waitForLoadState('networkidle');
    
    // Esperar a que aparezca el header de bienvenida
    await page.waitForSelector('[data-testid="welcome-header"]', { timeout: 10000 });
    
    console.log('✅ Home cargado correctamente');
    
    // Verificaciones iniciales rápidas
    await expect(page.locator('[data-testid="welcome-header"]')).toBeVisible();
    
    // Verificar que NO hay animaciones problemáticas
    const animatedElements = page.locator('.animate-gentle-pulse, .animate-flowing-wave, .animate-energy-flicker, .animate-light-float');
    const animatedCount = await animatedElements.count();
    console.log(`🔍 Elementos con animaciones problemáticas: ${animatedCount}`);
    
    // Verificar elementos flotantes eliminados
    const floatingElements = page.locator('.floating-element, .floating-element-delayed, .floating-element-slow');
    const floatingCount = await floatingElements.count();
    console.log(`🔍 Elementos flotantes: ${floatingCount}`);
    
    console.log('');
    console.log('🎮 NAVEGACIÓN LIBRE ACTIVADA');
    console.log('📋 Instrucciones para el usuario:');
    console.log('   ✅ Verifica que NO hay elementos moviéndose automáticamente');
    console.log('   ✅ Verifica que NO hay efecto de "olas del mar"');
    console.log('   ✅ Haz hover sobre las tarjetas para ver efectos suaves');
    console.log('   ✅ Navega por los diferentes módulos');
    console.log('   ✅ Prueba el scroll y las interacciones');
    console.log('   ✅ Verifica que la interfaz se ve estable y profesional');
    console.log('');
    console.log('🔴 PARA TERMINAR: Cierra la ventana del navegador cuando hayas terminado');
    console.log('⏳ El test esperará indefinidamente hasta que cierres el navegador...');
    console.log('');
    
    // Configurar listener para detectar cuando se cierre la página
    let pageIsClosed = false;
    page.on('close', () => {
      pageIsClosed = true;
      console.log('🔴 Navegador cerrado por el usuario');
    });
    
    // Esperar indefinidamente hasta que el usuario cierre la ventana
    try {
      while (!pageIsClosed) {
        // Verificar cada 5 segundos si la página sigue activa
        await page.waitForTimeout(5000);
        
        // Intentar hacer una verificación simple para mantener la conexión
        try {
          await page.locator('body').isVisible();
        } catch (error) {
          // Si hay error, probablemente la página se cerró
          console.log('🔴 Página cerrada detectada');
          break;
        }
      }
    } catch (error) {
      console.log('🔴 Navegación terminada:', error.message);
    }
    
    console.log('✅ Test de navegación libre completado');
    console.log('📊 Resumen de verificaciones:');
    console.log(`   - Animaciones problemáticas eliminadas: ${animatedCount === 0 ? '✅' : '❌'}`);
    console.log(`   - Elementos flotantes eliminados: ${floatingCount === 0 ? '✅' : '❌'}`);
    console.log('   - Navegación libre completada: ✅');
  });
}); 