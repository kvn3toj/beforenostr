const { chromium } = require('playwright');

async function testDataVerification() {
  console.log('🚀 Iniciando verificación de datos en todas las páginas...');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 1500 
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    // Login
    console.log('🔐 Realizando login...');
    await page.goto('http://localhost:3000/login');
    await page.waitForLoadState('networkidle');
    
    await page.fill('input[name="email"]', 'admin@coomunity.co');
    await page.fill('input[name="password"]', '123456');
    await page.click('button[type="submit"]');
    
    await page.waitForURL('http://localhost:3000/', { timeout: 10000 });
    await page.waitForLoadState('networkidle');
    console.log('✅ Login exitoso');
    
    // Expandir menú de administración
    console.log('\n🔍 Expandiendo menú de administración...');
    const adminSection = page.locator('text=Administration').first();
    await adminSection.click();
    await page.waitForTimeout(2000);
    
    // Páginas que SÍ están implementadas según App.tsx
    const implementedPages = [
      {
        name: 'Home',
        url: '/',
        expectedElements: ['Welcome', 'Gamifier', 'Admin'],
        dataCheck: async () => {
          const hasContent = await page.locator('main').isVisible();
          console.log(`    📄 Contenido principal visible: ${hasContent}`);
        }
      },
      {
        name: 'Mundos',
        url: '/mundos',
        expectedElements: ['Worlds', 'Management', 'Create'],
        dataCheck: async () => {
          const table = page.locator('table, [role="table"]');
          const hasTable = await table.isVisible();
          console.log(`    📊 Tabla de mundos visible: ${hasTable}`);
          
          if (hasTable) {
            const rows = await page.locator('tbody tr, [role="row"]').count();
            console.log(`    📋 Filas de mundos encontradas: ${rows}`);
          }
          
          // Verificar datos específicos del backend
          const mundoTexts = await page.locator('text=Gamificación, text=Educación, text=Tecnología').count();
          console.log(`    🌍 Elementos relacionados con mundos encontrados: ${mundoTexts}`);
        }
      },
      {
        name: 'Playlists',
        url: '/playlists',
        expectedElements: ['Playlists', 'Gamified', 'Create'],
        dataCheck: async () => {
          const table = page.locator('table, [role="table"]');
          const hasTable = await table.isVisible();
          console.log(`    📊 Tabla de playlists visible: ${hasTable}`);
          
          if (hasTable) {
            const rows = await page.locator('tbody tr, [role="row"]').count();
            console.log(`    📋 Filas de playlists encontradas: ${rows}`);
          }
          
          // Verificar datos específicos del backend (según los logs vimos 3 playlists)
          const playlistTexts = await page.locator('text=Fundamentos, text=Técnicas, text=Evaluación').count();
          console.log(`    🎵 Elementos de playlists del backend encontrados: ${playlistTexts}`);
        }
      },
      {
        name: 'Playlist Direct',
        url: '/playlist-direct',
        expectedElements: ['Playlist', 'Direct'],
        dataCheck: async () => {
          const hasContent = await page.locator('main').isVisible();
          console.log(`    📄 Contenido principal visible: ${hasContent}`);
          
          // Verificar si muestra las 3 playlists del backend
          const playlistCount = await page.locator('[data-testid*="playlist"], .playlist-item, .playlist-card').count();
          console.log(`    🎵 Items de playlist encontrados: ${playlistCount}`);
        }
      },
      {
        name: 'Users',
        url: '/users',
        expectedElements: ['Users', 'Management', 'Create'],
        dataCheck: async () => {
          const table = page.locator('table, [role="table"]');
          const hasTable = await table.isVisible();
          console.log(`    📊 Tabla de usuarios visible: ${hasTable}`);
          
          if (hasTable) {
            const rows = await page.locator('tbody tr, [role="row"]').count();
            console.log(`    📋 Filas de usuarios encontradas: ${rows}`);
          }
          
          const createButton = page.locator('text=Create New User, text=Crear Nuevo Usuario').first();
          const hasCreateButton = await createButton.isVisible();
          console.log(`    ➕ Botón crear usuario visible: ${hasCreateButton}`);
        }
      },
      {
        name: 'Roles',
        url: '/roles',
        expectedElements: ['Roles', 'Management', 'Permissions'],
        dataCheck: async () => {
          const hasContent = await page.locator('main').isVisible();
          console.log(`    📄 Contenido principal visible: ${hasContent}`);
          
          const roleElements = await page.locator('text=admin, text=user, text=role').count();
          console.log(`    🎭 Elementos relacionados con roles encontrados: ${roleElements}`);
        }
      },
      {
        name: 'Analytics',
        url: '/analytics',
        expectedElements: ['Analytics', 'Metrics', 'Dashboard'],
        dataCheck: async () => {
          const hasContent = await page.locator('main').isVisible();
          console.log(`    📄 Contenido principal visible: ${hasContent}`);
          
          const analyticsElements = await page.locator('.metric, .chart, .analytics').count();
          console.log(`    📊 Elementos de analytics encontrados: ${analyticsElements}`);
        }
      },
      {
        name: 'Audit Logs',
        url: '/audit-logs',
        expectedElements: ['Audit', 'Logs', 'Activity'],
        dataCheck: async () => {
          const hasContent = await page.locator('main').isVisible();
          console.log(`    📄 Contenido principal visible: ${hasContent}`);
          
          const logElements = await page.locator('table, .log, .activity').count();
          console.log(`    📜 Elementos de logs encontrados: ${logElements}`);
        }
      },
      {
        name: 'Settings',
        url: '/settings',
        expectedElements: ['Settings', 'Configuration'],
        dataCheck: async () => {
          const hasContent = await page.locator('main').isVisible();
          console.log(`    📄 Contenido principal visible: ${hasContent}`);
          
          const settingsElements = await page.locator('form, input, .setting').count();
          console.log(`    ⚙️ Elementos de configuración encontrados: ${settingsElements}`);
        }
      }
    ];
    
    // Páginas que NO están implementadas (según App.tsx)
    const missingPages = [
      '/permissions',
      '/items', 
      '/admin/config',
      '/admin/audit-logs',
      '/admin/system/status'
    ];
    
    console.log('\n⚠️ RUTAS NO IMPLEMENTADAS DETECTADAS:');
    missingPages.forEach(route => {
      console.log(`    ❌ ${route} - Esta ruta no existe en App.tsx`);
    });
    
    // Verificar cada página implementada
    for (const pageInfo of implementedPages) {
      console.log(`\n🔍 Verificando página: ${pageInfo.name}`);
      console.log(`📍 Navegando a: ${pageInfo.url}`);
      
      try {
        await page.goto(`http://localhost:3000${pageInfo.url}`);
        await page.waitForLoadState('networkidle', { timeout: 15000 });
        
        // Verificar que la página cargó
        const title = await page.title();
        console.log(`    📄 Título de página: ${title}`);
        
        // Verificar elementos esperados
        console.log(`    🔍 Buscando elementos esperados...`);
        for (const element of pageInfo.expectedElements) {
          const found = await page.locator(`text=${element}`).first().isVisible();
          console.log(`    ${found ? '✅' : '❌'} "${element}": ${found ? 'Encontrado' : 'No encontrado'}`);
        }
        
        // Verificar si hay errores visibles
        const errorElements = await page.locator('text=Error, text=error, .error, [role="alert"]').count();
        if (errorElements > 0) {
          console.log(`    ⚠️ Posibles errores encontrados: ${errorElements}`);
          const errorTexts = await page.locator('text=Error, text=error, .error, [role="alert"]').allTextContents();
          errorTexts.forEach((error, index) => {
            if (error.trim()) {
              console.log(`      ${index + 1}. "${error.trim()}"`);
            }
          });
        } else {
          console.log(`    ✅ No se encontraron errores visibles`);
        }
        
        // Verificar si hay spinners de carga
        const loadingElements = await page.locator('.loading, [role="progressbar"]').count();
        const loadingTexts = await page.locator('text=Loading').count() + await page.locator('text=Cargando').count();
        if (loadingElements > 0 || loadingTexts > 0) {
          console.log(`    ⏳ Elementos de carga encontrados: ${loadingElements + loadingTexts}`);
          // Esperar un poco más para que termine la carga
          await page.waitForTimeout(3000);
        }
        
        // Ejecutar verificación específica de datos
        if (pageInfo.dataCheck) {
          console.log(`    📊 Verificando datos específicos...`);
          await pageInfo.dataCheck();
        }
        
        // Tomar screenshot
        await page.screenshot({ 
          path: `debug-page-${pageInfo.name.toLowerCase().replace(/\s+/g, '-')}.png`,
          fullPage: true 
        });
        console.log(`    📸 Screenshot guardado: debug-page-${pageInfo.name.toLowerCase().replace(/\s+/g, '-')}.png`);
        
      } catch (error) {
        console.log(`    ❌ Error al verificar página ${pageInfo.name}: ${error.message}`);
        await page.screenshot({ 
          path: `debug-error-${pageInfo.name.toLowerCase().replace(/\s+/g, '-')}.png` 
        });
      }
      
      // Pausa entre páginas
      await page.waitForTimeout(2000);
    }
    
    console.log('\n🎉 Verificación de datos completada');
    console.log('\n📋 RESUMEN:');
    console.log(`✅ Páginas implementadas verificadas: ${implementedPages.length}`);
    console.log(`❌ Rutas faltantes detectadas: ${missingPages.length}`);
    console.log('\n💡 RECOMENDACIÓN: Implementar las rutas faltantes o actualizar el menú para ocultar enlaces no implementados.');
    
  } catch (error) {
    console.error('❌ Error durante la verificación:', error.message);
    await page.screenshot({ path: 'debug-verification-error.png' });
  } finally {
    await browser.close();
    console.log('\n🏁 Test de verificación completado');
  }
}

// Ejecutar el test
testDataVerification().catch(console.error); 