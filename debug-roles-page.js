const { chromium } = require('playwright');

async function debugRolesPage() {
  console.log('🔍 Inspeccionando página de Roles...\n');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 1000 
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // 1. LOGIN
    console.log('🔐 Iniciando sesión...');
    await page.goto('http://localhost:3000/login');
    await page.waitForLoadState('networkidle');

    await page.fill('input[name="email"]', 'admin@gamifier.com');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/');

    // 2. NAVEGACIÓN A ROLES
    console.log('📋 Navegando a la página de Roles...');
    await page.goto('http://localhost:3000/roles');
    await page.waitForLoadState('networkidle');

    // 3. INSPECCIONAR CONTENIDO
    console.log('🔍 Inspeccionando contenido de la página...');
    
    // Obtener todos los botones
    const allButtons = await page.locator('button').all();
    console.log(`\n📊 Total de botones encontrados: ${allButtons.length}`);
    
    for (let i = 0; i < allButtons.length; i++) {
      const button = allButtons[i];
      const text = await button.textContent();
      const isVisible = await button.isVisible();
      console.log(`  ${i + 1}. "${text}" (visible: ${isVisible})`);
    }
    
    // Buscar texto relacionado con permisos
    console.log('\n🔍 Buscando texto relacionado con permisos...');
    const permissionTexts = await page.locator('text=/permiso|permission|gestionar|manage/i').all();
    console.log(`📊 Elementos con texto de permisos: ${permissionTexts.length}`);
    
    for (let i = 0; i < permissionTexts.length; i++) {
      const element = permissionTexts[i];
      const text = await element.textContent();
      const tagName = await element.evaluate(el => el.tagName);
      console.log(`  ${i + 1}. <${tagName}> "${text}"`);
    }
    
    // Buscar iconos o elementos interactivos
    console.log('\n🔍 Buscando elementos interactivos...');
    const interactiveElements = await page.locator('[role="button"], button, a, [onclick], [data-testid*="edit"], [data-testid*="manage"]').all();
    console.log(`📊 Elementos interactivos: ${interactiveElements.length}`);
    
    // Tomar screenshot para inspección visual
    await page.screenshot({ 
      path: `debug-roles-page-${Date.now()}.png`,
      fullPage: true 
    });
    console.log('\n📸 Screenshot guardado para inspección visual');
    
    // Esperar para inspección manual
    console.log('\n⏳ Esperando 10 segundos para inspección manual...');
    await page.waitForTimeout(10000);

  } catch (error) {
    console.error('❌ Error durante la inspección:', error);
  } finally {
    await browser.close();
  }
}

debugRolesPage().catch(console.error); 