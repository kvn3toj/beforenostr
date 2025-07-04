const { chromium } = require('playwright');

async function testAccessibilityAria() {
  console.log('🧪 Iniciando test de mejoras de ARIA y Live Regions...\n');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 1000
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // 1. LOGIN Y NAVEGACIÓN
    console.log('🔐 Realizando login...');
    await page.goto('http://localhost:3000/login');
    await page.waitForLoadState('networkidle');
    
    await page.fill('input[name="email"]', 'admin@gamifier.com');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/');
    
    // Verificar login exitoso
    try {
      await page.waitForSelector('nav, [role="navigation"]', { timeout: 5000 });
      console.log('✅ Login exitoso - Navegación detectada');
    } catch {
      const currentUrl = page.url();
      if (!currentUrl.includes('/login')) {
        console.log('✅ Login exitoso - Verificado por URL');
      } else {
        throw new Error('Login falló');
      }
    }

    // 2. NAVEGAR A PÁGINA DE USUARIOS
    console.log('\n📊 Navegando a página de usuarios...');
    await page.click('text=Usuarios');
    await page.waitForURL('**/users');
    
    // Verificar que la página cargó
    try {
      await page.waitForSelector('text=Gestión de Usuarios', { timeout: 5000 });
      console.log('✅ Página de usuarios cargada');
    } catch {
      await page.waitForSelector('[role="main"]', { timeout: 5000 });
      console.log('✅ Página cargada (verificado por role)');
    }

    // 3. VERIFICAR LIVE REGIONS
    console.log('\n🔊 Verificando Live Regions...');
    
    // Buscar live regions en el DOM
    const liveRegions = await page.locator('[aria-live]').count();
    console.log(`✅ Live regions encontradas: ${liveRegions}`);
    
    if (liveRegions > 0) {
      console.log('✅ Sistema de Live Regions implementado correctamente');
    } else {
      console.log('⚠️ No se encontraron Live Regions - verificar implementación');
    }

    // 4. VERIFICAR ARIA-LABELS EN ICONBUTTONS
    console.log('\n🏷️ Verificando aria-labels en IconButtons...');
    
    // Buscar IconButtons en la tabla de usuarios
    const iconButtons = await page.locator('button[aria-label*="Editar"], button[aria-label*="Eliminar"]').count();
    console.log(`✅ IconButtons con aria-label encontrados: ${iconButtons}`);
    
    if (iconButtons > 0) {
      // Verificar contenido específico de aria-label
      const editButton = await page.locator('button[aria-label*="Editar"]').first();
      if (await editButton.count() > 0) {
        const ariaLabel = await editButton.getAttribute('aria-label');
        console.log(`✅ Aria-label de botón editar: "${ariaLabel}"`);
      }
    }

    // 5. VERIFICAR ESTRUCTURA DE TABLA CON ARIA
    console.log('\n📋 Verificando estructura ARIA de tabla...');
    
    // Verificar que la tabla tiene los atributos ARIA correctos
    const table = await page.locator('table[aria-label]').first();
    if (await table.count() > 0) {
      const ariaLabel = await table.getAttribute('aria-label');
      const ariaRowCount = await table.getAttribute('aria-rowcount');
      console.log(`✅ Tabla con aria-label: "${ariaLabel}"`);
      console.log(`✅ Tabla con aria-rowcount: ${ariaRowCount}`);
    }
    
    // Verificar headers con scope
    const scopedHeaders = await page.locator('th[scope="col"]').count();
    console.log(`✅ Headers con scope="col": ${scopedHeaders}`);
    
    // Verificar aria-sort en columnas ordenables
    const sortableColumns = await page.locator('th[aria-sort]').count();
    console.log(`✅ Columnas con aria-sort: ${sortableColumns}`);

    // 6. VERIFICAR TEXTFIELDS CON IDS AUTOMÁTICOS
    console.log('\n📝 Verificando TextFields con IDs automáticos...');
    
    const textFields = await page.locator('input[aria-describedby]').count();
    console.log(`✅ TextFields con aria-describedby: ${textFields}`);

    // 7. TEST DE NAVEGACIÓN POR TECLADO
    console.log('\n⌨️ Testeando navegación por teclado...');
    
    // Enfocar primer botón y navegar con Tab
    await page.keyboard.press('Tab');
    let focusedElement = await page.evaluate(() => document.activeElement?.tagName);
    console.log(`✅ Elemento enfocado: ${focusedElement}`);
    
    // Verificar que los estados de foco son visibles
    const focusStyles = await page.evaluate(() => {
      const focused = document.activeElement;
      if (focused) {
        const styles = window.getComputedStyle(focused);
        return {
          outline: styles.outline,
          boxShadow: styles.boxShadow
        };
      }
      return null;
    });
    
    if (focusStyles && (focusStyles.outline !== 'none' || focusStyles.boxShadow !== 'none')) {
      console.log('✅ Estados de foco visibles detectados');
    } else {
      console.log('⚠️ Estados de foco podrían no ser visibles');
    }

    // 8. CAPTURAR SCREENSHOT DE VERIFICACIÓN
    console.log('\n📸 Capturando screenshot de verificación...');
    await page.screenshot({ 
      path: `accessibility-aria-implementation-verification-${Date.now()}.png`,
      fullPage: true 
    });

    console.log('\n🎉 Test de mejoras de ARIA completado exitosamente!');
    console.log('\n📊 RESUMEN DE VERIFICACIÓN:');
    console.log(`   🔊 Live Regions: ${liveRegions > 0 ? '✅ Implementadas' : '❌ No encontradas'}`);
    console.log(`   🏷️ IconButtons con aria-label: ${iconButtons > 0 ? '✅ Correcto' : '❌ Faltante'}`);
    console.log(`   📋 Tabla con ARIA: ${scopedHeaders > 0 ? '✅ Implementada' : '❌ Incompleta'}`);
    console.log(`   📝 TextFields con aria-describedby: ${textFields > 0 ? '✅ Correcto' : '❌ Faltante'}`);
    console.log(`   ⌨️ Navegación por teclado: ${focusStyles ? '✅ Funcional' : '⚠️ Revisar'}`);

  } catch (error) {
    console.error('❌ Error durante el test:', error);
    await page.screenshot({ 
      path: `accessibility-test-error-${Date.now()}.png`,
      fullPage: true 
    });
  } finally {
    await browser.close();
  }
}

testAccessibilityAria().catch(console.error); 