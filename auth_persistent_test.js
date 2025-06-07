const { chromium } = require('playwright');

async function runAuthPersistenceTest() {
  console.log('🔐 Iniciando test de persistencia de autenticación...\n');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 1000 
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();

  // Capturar errores de consola y página
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('❌ Console error:', msg.text());
    }
  });
  
  page.on('pageerror', error => {
    console.log('❌ Page error:', error.message);
  });

  try {
    // FASE 1: LOGIN INICIAL Y VERIFICACIÓN
    console.log('📋 FASE 1: Login inicial...');
    await page.goto('http://localhost:3000/login');
    await page.waitForLoadState('networkidle');

    // Rellenar credenciales de admin
    await page.fill('input[name="email"]', 'admin@gamifier.com');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');

    // Esperar redirección y verificar login exitoso
    await page.waitForURL('**/');
    
    // Verificación robusta de login exitoso
    try {
      await page.waitForSelector('nav, [role="navigation"], button[aria-label*="menu"]', { timeout: 5000 });
      console.log('✅ Login exitoso - Navegación detectada');
    } catch {
      const currentUrl = page.url();
      if (!currentUrl.includes('/login')) {
        console.log('✅ Login exitoso - Verificado por URL');
      } else {
        throw new Error('Login falló - Aún en página de login');
      }
    }

    // FASE 2: VERIFICAR PERSISTENCIA EN PÁGINA DE ROLES
    console.log('\n📋 FASE 2: Verificando página de Roles...');
    await page.goto('http://localhost:3000/roles');
    await page.waitForLoadState('networkidle');
    
    // Verificar que no nos redirige a login
    const rolesUrl = page.url();
    if (rolesUrl.includes('/login')) {
      console.log('❌ Roles: Redirigido a login - Problema de autenticación');
    } else {
      console.log('✅ Roles: Navegación exitosa, URL:', rolesUrl);
      
      // Verificar contenido de la página
      const rolesContent = await page.textContent('body');
      if (rolesContent.includes('401') || rolesContent.includes('Unauthorized')) {
        console.log('❌ Roles: Error 401 en contenido');
      } else if (rolesContent.includes('roles') || rolesContent.includes('Roles') || rolesContent.includes('permisos')) {
        console.log('✅ Roles: Contenido válido detectado');
      } else {
        console.log('⚠️ Roles: Página cargada pero contenido incierto');
      }
    }

    // FASE 3: VERIFICAR PERSISTENCIA EN PÁGINA DE MUNDOS
    console.log('\n📋 FASE 3: Verificando página de Mundos...');
    await page.goto('http://localhost:3000/mundos');
    await page.waitForLoadState('networkidle');
    
    const mundosUrl = page.url();
    if (mundosUrl.includes('/login')) {
      console.log('❌ Mundos: Redirigido a login - Problema de autenticación');
    } else {
      console.log('✅ Mundos: Navegación exitosa, URL:', mundosUrl);
      
      const mundosContent = await page.textContent('body');
      if (mundosContent.includes('401') || mundosContent.includes('Unauthorized')) {
        console.log('❌ Mundos: Error 401 en contenido');
      } else if (mundosContent.includes('mundos') || mundosContent.includes('Mundos') || mundosContent.includes('worlds')) {
        console.log('✅ Mundos: Contenido válido detectado');
      } else {
        console.log('⚠️ Mundos: Página cargada pero contenido incierto');
      }
    }

    // FASE 4: VERIFICAR PERSISTENCIA EN PÁGINA DE PLAYLISTS
    console.log('\n📋 FASE 4: Verificando página de Playlists...');
    await page.goto('http://localhost:3000/playlists');
    await page.waitForLoadState('networkidle');
    
    const playlistsUrl = page.url();
    if (playlistsUrl.includes('/login')) {
      console.log('❌ Playlists: Redirigido a login - Problema de autenticación');
    } else {
      console.log('✅ Playlists: Navegación exitosa, URL:', playlistsUrl);
      
      const playlistsContent = await page.textContent('body');
      if (playlistsContent.includes('401') || playlistsContent.includes('Unauthorized')) {
        console.log('❌ Playlists: Error 401 en contenido');
      } else if (playlistsContent.includes('playlist') || playlistsContent.includes('Playlist') || playlistsContent.includes('listas')) {
        console.log('✅ Playlists: Contenido válido detectado');
      } else {
        console.log('⚠️ Playlists: Página cargada pero contenido incierto');
      }
    }

    // FASE 5: VERIFICAR SOCIAL PAGE (Nueva implementación)
    console.log('\n📋 FASE 5: Verificando página Social...');
    await page.goto('http://localhost:3000/social');
    await page.waitForLoadState('networkidle');
    
    const socialUrl = page.url();
    if (socialUrl.includes('/login')) {
      console.log('❌ Social: Redirigido a login - Problema de autenticación');
    } else {
      console.log('✅ Social: Navegación exitosa, URL:', socialUrl);
      
      // Verificar que la página social carga con datos
      try {
        await page.waitForSelector('text=Red Social', { timeout: 3000 });
        console.log('✅ Social: Título detectado');
        
        // Verificar estadísticas sociales
        const stats = await page.locator('text=Publicaciones').count();
        if (stats > 0) {
          console.log('✅ Social: Estadísticas sociales cargadas');
        } else {
          console.log('⚠️ Social: Estadísticas no visibles');
        }
      } catch {
        console.log('⚠️ Social: Título no encontrado, pero página cargada');
      }
    }

    // FASE 6: VERIFICAR ESTADO DE AUTENTICACIÓN EN LOCALSTORAGE
    console.log('\n📋 FASE 6: Verificando estado de autenticación...');
    const token = await page.evaluate(() => localStorage.getItem('token'));
    const user = await page.evaluate(() => localStorage.getItem('user'));
    
    if (token) {
      console.log('✅ Token encontrado en localStorage:', token.substring(0, 20) + '...');
    } else {
      console.log('❌ No hay token en localStorage');
    }
    
    if (user) {
      console.log('✅ Usuario encontrado en localStorage:', user);
    } else {
      console.log('❌ No hay usuario en localStorage');
    }

    console.log('\n🎉 Test de persistencia de autenticación completado');

  } catch (error) {
    console.error('❌ Error durante el test:', error);
    await page.screenshot({ 
      path: `auth-persistence-error-${Date.now()}.png`,
      fullPage: true 
    });
  } finally {
    await browser.close();
  }
}

runAuthPersistenceTest().catch(console.error); 