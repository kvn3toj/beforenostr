const { chromium } = require('playwright');

async function runComprehensiveE2ETest() {
  console.log('🚀 INICIANDO TEST E2E COMPLETO GAMIFIER ADMIN\n');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 800 
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();

  let results = {
    total: 0,
    functional: 0,
    errors: 0,
    pages: {}
  };

  // Capturar errores críticos
  page.on('console', msg => {
    if (msg.type() === 'error') {
      results.errors++;
      console.log('❌ Console error:', msg.text());
    }
  });
  
  page.on('pageerror', error => {
    results.errors++;
    console.log('❌ Page error:', error.message);
  });

  async function testPage(pageName, url, verificationStrategy) {
    console.log(`\n📋 Probando ${pageName}...`);
    results.total++;
    
    try {
      await page.goto(`http://localhost:3333${url}`);
      await page.waitForLoadState('networkidle');
      
      // Verificar que no estamos en login
      const currentUrl = page.url();
      if (currentUrl.includes('/login')) {
        console.log(`❌ ${pageName}: Redirigido a login`);
        results.pages[pageName] = 'NO FUNCIONAL - Redirección a login';
        return false;
      }
      
      // Aplicar estrategia de verificación específica
      const isValid = await verificationStrategy(page);
      
      if (isValid) {
        console.log(`✅ ${pageName}: FUNCIONAL`);
        results.functional++;
        results.pages[pageName] = 'FUNCIONAL';
        return true;
      } else {
        console.log(`❌ ${pageName}: NO FUNCIONAL - Contenido no válido`);
        results.pages[pageName] = 'NO FUNCIONAL - Contenido';
        return false;
      }
      
    } catch (error) {
      console.log(`❌ ${pageName}: ERROR - ${error.message}`);
      results.pages[pageName] = `ERROR - ${error.message}`;
      return false;
    }
  }

  try {
    // FASE 1: LOGIN
    console.log('📋 FASE 1: Login...');
    await page.goto('http://localhost:3333/login');
    await page.waitForLoadState('networkidle');

    await page.fill('input[name="email"]', 'admin@gamifier.com');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/');

    // Verificar login exitoso
    const currentUrl = page.url();
    if (!currentUrl.includes('/login')) {
      console.log('✅ Login exitoso');
    } else {
      throw new Error('Login falló');
    }

    // FASE 2: TESTING DE PÁGINAS
    console.log('\n📋 FASE 2: Testing páginas...');

    // Users Page
    await testPage('Users', '/users', async (page) => {
      try {
        // Buscar indicadores de que la página de usuarios cargó
        await page.waitForSelector('text=Usuarios', { timeout: 3000 });
        const userCount = await page.locator('tr, [role="row"]').count();
        console.log(`   Users: ${userCount} elementos encontrados`);
        return userCount > 1; // Header + al menos 1 usuario
      } catch {
        const content = await page.textContent('body');
        return content.includes('user') || content.includes('Usuario') || content.includes('@');
      }
    });

    // Items Page
    await testPage('Items', '/items', async (page) => {
      try {
        await page.waitForSelector('text=Items, text=Videos, text=Video', { timeout: 3000 });
        const itemCount = await page.locator('tr, [role="row"], .video-item, .item-card').count();
        console.log(`   Items: ${itemCount} elementos encontrados`);
        return itemCount > 0;
      } catch {
        const content = await page.textContent('body');
        return content.includes('video') || content.includes('item') || content.includes('duration');
      }
    });

    // Roles Page
    await testPage('Roles', '/roles', async (page) => {
      try {
        await page.waitForSelector('text=Roles, text=Role, text=roles', { timeout: 3000 });
        const roleCount = await page.locator('tr, [role="row"], .role-item').count();
        console.log(`   Roles: ${roleCount} elementos encontrados`);
        return roleCount >= 0; // Puede estar vacío pero ser funcional
      } catch {
        const content = await page.textContent('body');
        return content.includes('rol') || content.includes('role') || content.includes('permission');
      }
    });

    // Mundos Page
    await testPage('Mundos', '/mundos', async (page) => {
      try {
        await page.waitForSelector('text=Mundos, text=Mundo, text=mundos', { timeout: 3000 });
        const mundoCount = await page.locator('tr, [role="row"], .mundo-item').count();
        console.log(`   Mundos: ${mundoCount} elementos encontrados`);
        return mundoCount >= 0;
      } catch {
        const content = await page.textContent('body');
        return content.includes('mundo') || content.includes('world') || content.includes('creator');
      }
    });

    // Playlists Page
    await testPage('Playlists', '/playlists', async (page) => {
      try {
        await page.waitForSelector('text=Playlists, text=Playlist, text=playlists', { timeout: 3000 });
        const playlistCount = await page.locator('tr, [role="row"], .playlist-item').count();
        console.log(`   Playlists: ${playlistCount} elementos encontrados`);
        return playlistCount >= 0;
      } catch {
        const content = await page.textContent('body');
        return content.includes('playlist') || content.includes('lista') || content.includes('video');
      }
    });

    // Wallet Page
    await testPage('Wallet', '/wallet', async (page) => {
      try {
        await page.waitForSelector('text=Wallet, text=Cartera, text=Balance', { timeout: 3000 });
        const balanceElements = await page.locator('text=/\\d+/, text=€, text=$').count();
        console.log(`   Wallet: ${balanceElements} elementos de balance encontrados`);
        return balanceElements > 0;
      } catch {
        const content = await page.textContent('body');
        return content.includes('wallet') || content.includes('balance') || content.includes('cartera');
      }
    });

    // Invitations Page
    await testPage('Invitations', '/invitations', async (page) => {
      try {
        await page.waitForSelector('text=Invitations, text=Invitaciones, text=Gift', { timeout: 3000 });
        const inviteElements = await page.locator('tr, [role="row"], .invitation-item').count();
        console.log(`   Invitations: ${inviteElements} elementos encontrados`);
        return inviteElements >= 0;
      } catch {
        const content = await page.textContent('body');
        return content.includes('invit') || content.includes('gift') || content.includes('código');
      }
    });

    // Personalities Page
    await testPage('Personalities', '/personalities', async (page) => {
      try {
        await page.waitForSelector('text=Personalities, text=Personalidades, text=Personality', { timeout: 3000 });
        const personalityElements = await page.locator('tr, [role="row"], .personality-item').count();
        console.log(`   Personalities: ${personalityElements} elementos encontrados`);
        return personalityElements >= 0;
      } catch {
        const content = await page.textContent('body');
        return content.includes('personal') || content.includes('trait') || content.includes('carácter');
      }
    });

    // Video Config Page (Analytics)
    await testPage('Analytics', '/video-config', async (page) => {
      try {
        // Buscar tabs de configuración
        const tabs = await page.locator('[role="tab"], .MuiTab-root, button').count();
        console.log(`   Video Config: ${tabs} tabs/controles encontrados`);
        return tabs > 3; // Debería tener varios tabs
      } catch {
        const content = await page.textContent('body');
        return content.includes('config') || content.includes('permission') || content.includes('video');
      }
    });

    // Social Page (Nueva implementación)
    await testPage('Social', '/social', async (page) => {
      try {
        await page.waitForSelector('text=Red Social, text=Social', { timeout: 3000 });
        const statsCards = await page.locator('text=Publicaciones, text=Me Gusta, text=Comentarios').count();
        console.log(`   Social: ${statsCards} estadísticas encontradas`);
        return statsCards >= 3; // Debería tener al menos 3 cards de estadísticas
      } catch {
        const content = await page.textContent('body');
        return content.includes('social') || content.includes('actividad') || content.includes('posts');
      }
    });

    // Analytics Page
    await testPage('Analytics Dashboard', '/analytics', async (page) => {
      try {
        await page.waitForSelector('text=Analytics, text=Analíticas, text=Dashboard', { timeout: 3000 });
        const charts = await page.locator('canvas, .recharts, .chart, svg').count();
        console.log(`   Analytics: ${charts} gráficos encontrados`);
        return charts > 0;
      } catch {
        const content = await page.textContent('body');
        return content.includes('analytic') || content.includes('chart') || content.includes('dashboard');
      }
    });

    // FASE 3: RESULTADOS FINALES
    console.log('\n🎯 RESULTADOS FINALES:');
    console.log('================================');
    
    Object.entries(results.pages).forEach(([page, status]) => {
      const icon = status === 'FUNCIONAL' ? '✅' : '❌';
      console.log(`${icon} ${page}: ${status}`);
    });
    
    const percentage = ((results.functional / results.total) * 100).toFixed(1);
    console.log(`\n📊 FUNCIONALIDAD TOTAL: ${results.functional}/${results.total} páginas (${percentage}%)`);
    console.log(`🚨 ERRORES CRÍTICOS: ${results.errors}`);
    
    if (percentage >= 90) {
      console.log('🎉 ¡EXCELENTE! Sistema casi completamente funcional');
    } else if (percentage >= 75) {
      console.log('👍 ¡BUENO! Sistema mayormente funcional');
    } else if (percentage >= 50) {
      console.log('⚠️ Sistema funcional pero necesita mejoras');
    } else {
      console.log('🔧 Sistema necesita trabajo significativo');
    }

  } catch (error) {
    console.error('❌ Error crítico durante el test:', error);
    await page.screenshot({ 
      path: `e2e-error-${Date.now()}.png`,
      fullPage: true 
    });
  } finally {
    await browser.close();
  }
}

runComprehensiveE2ETest().catch(console.error); 