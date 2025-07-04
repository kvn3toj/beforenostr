import { test, expect, Page } from '@playwright/test';

test.describe('🔐 VERIFICACIÓN DE LOGIN ADMIN Y PÁGINAS', () => {
  let page: Page;
  
  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    
    // Configurar para capturar errores
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        console.log(`🔴 Console Error: ${msg.text()}`);
      }
    });
  });

  test.afterAll(async () => {
    await page.screenshot({ 
      path: 'debug-login-verification.png',
      fullPage: true 
    });
    await page.close();
  });

  test('🔐 Verificar login de administrador', async () => {
    console.log('🔐 === VERIFICANDO LOGIN DE ADMINISTRADOR ===');
    
    // 1. Ir a la página de login
    console.log('📍 Navegando a /login...');
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    
    // 2. Llenar credenciales
    console.log('📝 Llenando credenciales...');
    await page.fill('input[name="email"]', 'admin@gamifier.com');
    await page.fill('input[name="password"]', 'admin123');
    
    // 3. Hacer clic en login
    console.log('🖱️ Haciendo clic en login...');
    await page.click('button[type="submit"]');
    
    // 4. Esperar redirección
    console.log('⏳ Esperando redirección...');
    await page.waitForURL('/', { timeout: 10000 });
    
    // 5. Verificar que estamos logueados
    console.log('✅ Verificando estado de login...');
    
    // Esperar un momento para que la página se cargue completamente
    await page.waitForTimeout(2000);
    
    // Tomar screenshot del estado post-login
    await page.screenshot({ 
      path: 'debug-after-login.png',
      fullPage: true 
    });
    
    // Verificar elementos que indican que estamos logueados
    const url = page.url();
    console.log(`📍 URL actual: ${url}`);
    
    // Verificar que no estamos en login
    expect(url).not.toContain('/login');
    
    // Buscar elementos de navegación o admin
    const hasNavigation = await page.locator('nav, [role="navigation"], .sidebar, .drawer').isVisible();
    const hasAdminText = await page.locator('text=/admin|dashboard|gamifier/i').isVisible();
    
    console.log(`🔍 Navegación visible: ${hasNavigation}`);
    console.log(`🔍 Texto de admin/dashboard visible: ${hasAdminText}`);
    
    if (!hasNavigation && !hasAdminText) {
      console.log('⚠️ No se detectaron elementos de admin claramente');
    } else {
      console.log('✅ Login exitoso confirmado');
    }
  });

  test('🔍 Verificar páginas básicas', async () => {
    console.log('\n🔍 === VERIFICANDO PÁGINAS BÁSICAS ===');
    
    const pagesToTest = [
      { name: 'Users', url: '/users' },
      { name: 'Roles', url: '/roles' },
      { name: 'Items', url: '/items' },
      { name: 'Mundos', url: '/mundos' },
      { name: 'Playlists', url: '/playlists' }
    ];
    
    for (const pageInfo of pagesToTest) {
      console.log(`\n📄 Verificando página: ${pageInfo.name} (${pageInfo.url})`);
      
      try {
        await page.goto(pageInfo.url);
        await page.waitForLoadState('domcontentloaded', { timeout: 5000 });
        
        const url = page.url();
        console.log(`   📍 URL final: ${url}`);
        
        // Verificar si nos redirigió a login (indica falta de autenticación)
        if (url.includes('/login')) {
          console.log(`   ❌ ${pageInfo.name} - REDIRIGIDO A LOGIN (no autenticado)`);
          continue;
        }
        
        // Verificar si la página tiene contenido
        const hasTable = await page.locator('table, .MuiDataGrid-root').isVisible({ timeout: 3000 }).catch(() => false);
        const hasContent = await page.locator('main, .main-content, h1, h2').isVisible({ timeout: 3000 }).catch(() => false);
        const bodyText = await page.locator('body').textContent();
        
        console.log(`   🔍 Tiene tabla/grid: ${hasTable}`);
        console.log(`   🔍 Tiene contenido principal: ${hasContent}`);
        console.log(`   🔍 Longitud del contenido: ${bodyText?.length || 0} caracteres`);
        
        if (hasTable || hasContent) {
          console.log(`   ✅ ${pageInfo.name} - PÁGINA FUNCIONAL`);
        } else if (bodyText && bodyText.length > 100) {
          console.log(`   ⚠️  ${pageInfo.name} - Página cargada pero sin elementos claros`);
        } else {
          console.log(`   ❌ ${pageInfo.name} - NO FUNCIONAL`);
        }
        
      } catch (error) {
        console.log(`   ❌ ${pageInfo.name} - ERROR: ${error.message}`);
      }
      
      await page.waitForTimeout(1000); // Pausa entre páginas
    }
  });

  test('🪙 Verificar páginas de gamificación específicamente', async () => {
    console.log('\n🪙 === VERIFICANDO PÁGINAS DE GAMIFICACIÓN ===');
    
    const gamificationPages = [
      { name: 'Tokens', url: '/tokens' },
      { name: 'Wallet', url: '/wallet' },
      { name: 'Merits', url: '/merits' },
      { name: 'Challenges', url: '/challenges' }
    ];
    
    for (const pageInfo of gamificationPages) {
      console.log(`\n🪙 Verificando: ${pageInfo.name} (${pageInfo.url})`);
      
      try {
        await page.goto(pageInfo.url);
        await page.waitForLoadState('domcontentloaded', { timeout: 5000 });
        
        const url = page.url();
        console.log(`   📍 URL final: ${url}`);
        
        // Verificar si nos redirigió a login
        if (url.includes('/login')) {
          console.log(`   ❌ ${pageInfo.name} - REDIRIGIDO A LOGIN (no autenticado)`);
          continue;
        }
        
        // Verificar si es página 404 o no encontrada
        if (url.includes('404') || url.includes('not-found')) {
          console.log(`   ❌ ${pageInfo.name} - PÁGINA 404/NO ENCONTRADA`);
          continue;
        }
        
        // Buscar indicadores específicos de la página
        const hasTitle = await page.locator(`h1:has-text("${pageInfo.name}"), h2:has-text("${pageInfo.name}")`).isVisible({ timeout: 3000 }).catch(() => false);
        const hasTable = await page.locator('table, .MuiDataGrid-root').isVisible({ timeout: 3000 }).catch(() => false);
        const hasCreateButton = await page.locator('button:has-text("Create"), button:has-text("Crear"), button:has-text("Add")').isVisible({ timeout: 3000 }).catch(() => false);
        const bodyText = await page.locator('body').textContent();
        
        console.log(`   🔍 Título específico: ${hasTitle}`);
        console.log(`   🔍 Tabla/grid: ${hasTable}`);
        console.log(`   🔍 Botón crear: ${hasCreateButton}`);
        console.log(`   🔍 Contenido total: ${bodyText?.length || 0} caracteres`);
        
        if (hasTitle && (hasTable || hasCreateButton)) {
          console.log(`   ✅ ${pageInfo.name} - COMPLETAMENTE IMPLEMENTADO`);
        } else if (hasTitle || (bodyText && bodyText.length > 200)) {
          console.log(`   ⚠️  ${pageInfo.name} - PARCIALMENTE IMPLEMENTADO`);
        } else {
          console.log(`   ❌ ${pageInfo.name} - NO IMPLEMENTADO`);
        }
        
        // Tomar screenshot de cada página de gamificación
        await page.screenshot({ 
          path: `debug-${pageInfo.name.toLowerCase()}-page.png`,
          fullPage: true 
        });
        
      } catch (error) {
        console.log(`   ❌ ${pageInfo.name} - ERROR: ${error.message}`);
      }
      
      await page.waitForTimeout(1000);
    }
  });

  test('🔍 Inspección detallada del menú', async () => {
    console.log('\n🔍 === INSPECCIÓN DETALLADA DEL MENÚ ===');
    
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    
    // Buscar todos los posibles elementos de menú
    const menuSelectors = [
      'nav a',
      '.sidebar a', 
      '.drawer a',
      '[role="menuitem"]',
      'button[role="button"]',
      '.menu-item',
      '.nav-link'
    ];
    
    console.log('📋 Elementos de navegación encontrados:');
    
    for (const selector of menuSelectors) {
      try {
        const elements = await page.locator(selector).all();
        if (elements.length > 0) {
          console.log(`\n🔍 Selector "${selector}" (${elements.length} elementos):`);
          for (let i = 0; i < Math.min(elements.length, 10); i++) {
            const text = await elements[i].textContent();
            const href = await elements[i].getAttribute('href').catch(() => null);
            if (text && text.trim()) {
              console.log(`   - "${text.trim()}" ${href ? `→ ${href}` : ''}`);
            }
          }
        }
      } catch (error) {
        // Continue with next selector
      }
    }
    
    // Tomar screenshot del estado del menú
    await page.screenshot({ 
      path: 'debug-menu-state.png',
      fullPage: true 
    });
  });
}); 