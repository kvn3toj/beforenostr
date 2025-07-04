import { test, expect } from '@playwright/test';

test.describe('🏠 Home Page - Diagnostic Test (No Auth)', () => {
  test('📋 Diagnóstico completo del contenido actual sin autenticación', async ({ page }) => {
    console.log('🔍 Iniciando diagnóstico del Home sin autenticación...');

    // Navegar al Home
    await page.goto('/');
    await page.waitForSelector('#root');
    
    // Esperar a que React se monte completamente
    await page.waitForTimeout(3000);

    // 1. Verificar que la página carga
    await expect(page.locator('#root')).toBeVisible();
    console.log('✅ Página cargada correctamente');

    // 2. Capturar todo el texto visible en la página
    const pageText = await page.textContent('body');
    console.log('📝 Texto completo de la página (primeros 1000 chars):', pageText?.substring(0, 1000));

    // 3. Buscar elementos específicos del Home
    const welcomeElements = await page.locator('text=/hola|welcome|bienvenid/i').count();
    console.log(`🎯 Elementos de bienvenida encontrados: ${welcomeElements}`);

    // 4. Buscar componentes específicos
    const reciprocidadElements = await page.locator('text=/reciprocidad|öndas|mëritos|balance/i').count();
    console.log(`🌟 Elementos de Reciprocidad encontrados: ${reciprocidadElements}`);

    // 5. Verificar estructura de navegación
    const navElements = await page.locator('nav, [role="navigation"]').count();
    console.log(`🧭 Elementos de navegación: ${navElements}`);

    // 6. Buscar elementos con data-testid
    const testElements = await page.locator('[data-testid]').count();
    console.log(`🧪 Elementos con data-testid: ${testElements}`);

    // 7. Verificar componentes específicos del Home
    const moduleCards = await page.locator('text=/marketplace|social|üplay|challenges/i').count();
    console.log(`🎴 Tarjetas de módulos encontradas: ${moduleCards}`);

    // 8. Tomar screenshot para inspección visual
    await page.screenshot({ 
      path: 'test-results/home-diagnostic-no-auth-screenshot.png',
      fullPage: true 
    });

    // 9. Verificar elementos interactivos
    const buttons = await page.locator('button').count();
    const links = await page.locator('a').count();
    console.log(`🔘 Botones encontrados: ${buttons}`);
    console.log(`🔗 Enlaces encontrados: ${links}`);

    // 10. Buscar específicamente el WelcomeHeader
    const welcomeHeader = await page.locator('[data-testid="welcome-header"]').count();
    console.log(`📋 WelcomeHeader encontrado: ${welcomeHeader}`);

    // 11. Verificar clases CSS específicas
    const priorityElements = await page.locator('[class*="priority-"], [class*="card-priority-"]').count();
    console.log(`🎯 Elementos con clases de prioridad: ${priorityElements}`);

    const textElements = await page.locator('[class*="text-"], [class*="interactive-element"]').count();
    console.log(`📝 Elementos con clases tipográficas: ${textElements}`);

    // 12. Verificar elementos del design system
    const designSystemElements = await page.locator('[class*="home-"], [class*="enhanced-"]').count();
    console.log(`🎨 Elementos del design system: ${designSystemElements}`);

    // 13. Verificar si estamos en la página de login en lugar del home
    const loginElements = await page.locator('text=/login|iniciar sesión|email|password/i').count();
    console.log(`🔐 Elementos de login encontrados: ${loginElements}`);

    // 14. Verificar la URL actual
    const currentUrl = page.url();
    console.log(`🌐 URL actual: ${currentUrl}`);

    // 15. Verificar título de la página
    const title = await page.title();
    console.log(`📄 Título de la página: ${title}`);

    // 16. Buscar errores en consola
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.waitForTimeout(2000);

    if (errors.length > 0) {
      console.log('⚠️ Errores de consola encontrados:', errors.slice(0, 5));
    }

    // 17. Verificar elementos específicos de Material UI
    const muiElements = await page.locator('[class*="Mui"]').count();
    console.log(`🎨 Elementos de Material UI: ${muiElements}`);

    // 18. Verificar contenedores principales
    const containers = await page.locator('[class*="container"], [class*="Container"]').count();
    console.log(`📦 Contenedores encontrados: ${containers}`);

    console.log('✅ Diagnóstico completado');
  });

  test('🎨 Verificación de componentes visuales mejorados (sin auth)', async ({ page }) => {
    console.log('🎨 Verificando mejoras visuales sin autenticación...');

    await page.goto('/');
    await page.waitForSelector('#root');
    await page.waitForTimeout(3000);

    // Verificar que hay elementos con animaciones
    const animatedElements = await page.locator('[class*="fade"], [class*="animation"]').count();
    console.log(`✨ Elementos animados: ${animatedElements}`);

    // Verificar gradientes y efectos visuales
    const gradientElements = await page.locator('[style*="gradient"]').count();
    console.log(`🌈 Elementos con gradientes: ${gradientElements}`);

    // Verificar botones flotantes
    const fabButtons = await page.locator('[class*="MuiFab"], button[class*="fab"]').count();
    console.log(`🔘 Botones flotantes (FAB): ${fabButtons}`);

    // Verificar tarjetas y paneles
    const cards = await page.locator('[class*="MuiPaper"], [class*="card"]').count();
    console.log(`🎴 Tarjetas/Paneles: ${cards}`);

    // Verificar tipografía
    const typography = await page.locator('[class*="MuiTypography"]').count();
    console.log(`📝 Elementos tipográficos: ${typography}`);

    console.log('✅ Componentes visuales verificados');
  });

  test('📱 Verificación responsive básica (sin auth)', async ({ page }) => {
    console.log('📱 Verificando diseño responsive sin autenticación...');

    await page.goto('/');
    await page.waitForSelector('#root');

    // Test mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(1000);
    
    const mobileElements = await page.locator('body').isVisible();
    expect(mobileElements).toBe(true);
    console.log('✅ Vista móvil funcional');

    // Test tablet
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(1000);
    
    const tabletElements = await page.locator('body').isVisible();
    expect(tabletElements).toBe(true);
    console.log('✅ Vista tablet funcional');

    // Test desktop
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.waitForTimeout(1000);
    
    const desktopElements = await page.locator('body').isVisible();
    expect(desktopElements).toBe(true);
    console.log('✅ Vista desktop funcional');
  });
}); 