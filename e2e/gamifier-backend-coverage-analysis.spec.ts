import { test, expect, Page } from '@playwright/test';

// Lista completa de módulos del backend a verificar
const BACKEND_MODULES = [
  // FASE 1 - Core
  { name: 'Users', routes: ['/users'], found: false },
  { name: 'Roles', routes: ['/roles'], found: false },
  { name: 'Permissions', routes: ['/permissions'], found: false },
  { name: 'Content Items', routes: ['/items', '/content'], found: false },
  { name: 'Mundos', routes: ['/mundos', '/worlds'], found: false },
  { name: 'Playlists', routes: ['/playlists'], found: false },
  
  // FASE 2 - Gamificación (CRÍTICO)
  { name: 'Tokens', routes: ['/tokens', '/gamification/tokens', '/wallet/tokens'], found: false },
  { name: 'Wallet', routes: ['/wallet', '/gamification/wallet', '/users/wallet'], found: false },
  { name: 'Merits', routes: ['/merits', '/gamification/merits', '/achievements'], found: false },
  { name: 'Challenges', routes: ['/challenges', '/gamification/challenges'], found: false },
  
  // FASE 3 - Monitoreo
  { name: 'Analytics', routes: ['/analytics', '/reports'], found: false },
  { name: 'Audit Logs', routes: ['/audit-logs', '/admin/audit', '/logs'], found: false },
  { name: 'Monitoring', routes: ['/monitoring', '/health', '/system'], found: false },
  
  // FASE 5 - Social
  { name: 'Social/Groups', routes: ['/social', '/groups', '/social/groups'], found: false },
  { name: 'Marketplace', routes: ['/marketplace'], found: false },
  { name: 'Invitations', routes: ['/invitations'], found: false },
  
  // FASE 6 - IA
  { name: 'Questions', routes: ['/questions'], found: false },
  { name: 'AI Generator', routes: [], found: false } // Se buscará en elementos de UI
];

test.describe('📊 ANÁLISIS DE COBERTURA DEL BACKEND', () => {
  let page: Page;
  let totalErrors = 0;
  
  test.beforeAll(async ({ browser }) => {
    console.log('🎯 === ANÁLISIS DE COBERTURA DEL BACKEND GAMIFIER ===\n');
    
    page = await browser.newPage();
    
    // Monitor errors
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        totalErrors++;
      }
    });

    // Login
    console.log('🔐 Realizando login...');
    await page.goto('/login');
    await page.fill('input[name="email"]', 'admin@gamifier.com');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/');
    console.log('✅ Login exitoso\n');
  });

  test.afterAll(async () => {
    await page.screenshot({ 
      path: 'backend-coverage-analysis.png',
      fullPage: true 
    });

    // Generar reporte final
    console.log('\n📊 === REPORTE FINAL DE COBERTURA ===');
    const foundModules = BACKEND_MODULES.filter(m => m.found);
    const missingModules = BACKEND_MODULES.filter(m => !m.found);
    const coverage = (foundModules.length / BACKEND_MODULES.length) * 100;

    console.log(`\n✅ MÓDULOS ENCONTRADOS (${foundModules.length}):`);
    foundModules.forEach(m => console.log(`   ✅ ${m.name}`));
    
    console.log(`\n❌ MÓDULOS NO ENCONTRADOS (${missingModules.length}):`);
    missingModules.forEach(m => console.log(`   ❌ ${m.name} - Rutas probadas: ${m.routes.join(', ')}`));
    
    console.log(`\n🎯 COBERTURA TOTAL: ${coverage.toFixed(1)}% (${foundModules.length}/${BACKEND_MODULES.length})`);
    console.log(`🔴 Total de errores detectados: ${totalErrors}`);

    // Análisis crítico para Tokens, Wallet y Merits
    const gamificationModules = ['Tokens', 'Wallet', 'Merits'];
    const foundGamification = foundModules.filter(m => gamificationModules.includes(m.name));
    
    console.log(`\n🪙 ANÁLISIS CRÍTICO - GAMIFICACIÓN:`);
    console.log(`   Módulos de gamificación encontrados: ${foundGamification.length}/3`);
    if (foundGamification.length === 0) {
      console.log('   ⚠️  CRÍTICO: No se encontraron módulos de gamificación en el frontend');
      console.log('   📝 RECOMENDACIÓN: Implementar interfaces para Tokens, Wallet y Merits');
    } else {
      console.log(`   ✅ Parcialmente implementado: ${foundGamification.map(m => m.name).join(', ')}`);
    }

    await page.close();
  });

  async function checkRoute(moduleName: string, route: string, timeout = 5000): Promise<boolean> {
    try {
      console.log(`🔍 Verificando ${moduleName} en ruta: ${route}`);
      
      await page.goto(route, { timeout });
      await page.waitForLoadState('domcontentloaded', { timeout: 3000 });
      
      // Buscar indicadores de que la página existe y funciona
      const indicators = [
        page.locator(`h1:has-text("${moduleName}"), h2:has-text("${moduleName}")`),
        page.locator(`text="${moduleName}"`),
        page.locator('table, .MuiDataGrid-root'),
        page.locator('button:has-text("Create"), button:has-text("Crear")'),
        page.locator('main, .main-content, .page-content')
      ];
      
      for (const indicator of indicators) {
        if (await indicator.isVisible({ timeout: 2000 }).catch(() => false)) {
          console.log(`   ✅ ${moduleName} - ENCONTRADO en ${route}`);
          return true;
        }
      }
      
      // Verificar si al menos la página no es 404
      const url = page.url();
      if (!url.includes('404') && !url.includes('not-found')) {
        const hasContent = await page.locator('body').textContent();
        if (hasContent && hasContent.length > 100) {
          console.log(`   ⚠️  ${moduleName} - Página existe pero sin contenido claro en ${route}`);
          return true; // Consideramos que existe aunque no esté completamente implementada
        }
      }
      
      console.log(`   ❌ ${moduleName} - NO encontrado en ${route}`);
      return false;
      
    } catch (error) {
      console.log(`   ❌ ${moduleName} - Error al acceder a ${route}: ${error.message}`);
      return false;
    }
  }

  test('🔍 Verificar todos los módulos del backend', async () => {
    for (const module of BACKEND_MODULES) {
      let found = false;
      
      // Probar todas las rutas posibles para este módulo
      for (const route of module.routes) {
        found = await checkRoute(module.name, route);
        if (found) {
          module.found = true;
          break;
        }
      }
      
      // Para AI Generator, buscar elementos específicos en páginas existentes
      if (module.name === 'AI Generator' && !found) {
        try {
          await page.goto('/items');
          await page.waitForLoadState('domcontentloaded', { timeout: 3000 });
          
          const aiElements = [
            'button:has-text("Generate")',
            'button:has-text("AI")',
            'text="Gemini"',
            'text="Generate Questions"'
          ];
          
          for (const selector of aiElements) {
            if (await page.locator(selector).isVisible({ timeout: 2000 }).catch(() => false)) {
              console.log(`   ✅ AI Generator - ENCONTRADO (elemento de UI)`);
              module.found = true;
              found = true;
              break;
            }
          }
        } catch (error) {
          console.log(`   ❌ AI Generator - Error al buscar elementos: ${error.message}`);
        }
      }
      
      await page.waitForTimeout(500); // Pequeña pausa entre verificaciones
    }
  });

  test('🔍 Análisis del menú principal', async () => {
    console.log('\n🔍 === ANÁLISIS DEL MENÚ PRINCIPAL ===');
    
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    
    // Buscar elementos del menú
    const menuSelectors = [
      'nav a',
      '.sidebar a',
      '.menu a',
      '[role="menuitem"]',
      'button[role="menuitem"]'
    ];
    
    let allMenuItems: string[] = [];
    
    for (const selector of menuSelectors) {
      try {
        const elements = await page.locator(selector).all();
        for (const element of elements) {
          const text = await element.textContent();
          if (text && text.trim()) {
            allMenuItems.push(text.trim());
          }
        }
      } catch (error) {
        // Continue with next selector
      }
    }
    
    // Eliminar duplicados
    allMenuItems = [...new Set(allMenuItems)];
    
    console.log('📋 Elementos de menú encontrados:');
    allMenuItems.forEach(item => console.log(`   - ${item}`));
    
    // Buscar específicamente elementos de gamificación
    const gamificationKeywords = ['token', 'wallet', 'merit', 'challenge', 'gamif', 'coin', 'reward'];
    const foundGamificationInMenu = allMenuItems.filter(item => 
      gamificationKeywords.some(keyword => 
        item.toLowerCase().includes(keyword.toLowerCase())
      )
    );
    
    if (foundGamificationInMenu.length > 0) {
      console.log('\n🪙 Elementos de gamificación en menú:');
      foundGamificationInMenu.forEach(item => console.log(`   ✅ ${item}`));
    } else {
      console.log('\n⚠️ No se encontraron elementos de gamificación en el menú principal');
    }
  });

  test('🔍 Verificar endpoints del backend disponibles', async () => {
    console.log('\n🔍 === VERIFICACIÓN DE ENDPOINTS DEL BACKEND ===');
    
    const backendEndpoints = [
      '/api/tokens',
      '/api/merits', 
      '/api/wallet',
      '/api/challenges',
      '/api/social',
      '/api/groups',
      '/api/marketplace',
      '/api/invitations',
      '/api/analytics',
      '/api/monitoring',
      '/api/audit-logs'
    ];
    
    for (const endpoint of backendEndpoints) {
      try {
        const response = await page.request.get(`http://localhost:3002${endpoint}`);
        const status = response.status();
        
        if (status === 200) {
          console.log(`   ✅ ${endpoint} - DISPONIBLE (200)`);
        } else if (status === 401 || status === 403) {
          console.log(`   ⚠️  ${endpoint} - PROTEGIDO (${status}) - Endpoint existe`);
        } else if (status === 404) {
          console.log(`   ❌ ${endpoint} - NO IMPLEMENTADO (404)`);
        } else {
          console.log(`   ⚠️  ${endpoint} - STATUS: ${status}`);
        }
      } catch (error) {
        console.log(`   ❌ ${endpoint} - ERROR: ${error.message}`);
      }
    }
  });
}); 