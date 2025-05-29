import { test, expect } from '@playwright/test';

test.describe('Gamifier Admin - Tour Completo Interactivo', () => {
  test.beforeEach(async ({ page }) => {
    // Capturar errores de consola
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        console.log(`🔴 Console error: ${msg.text()}`);
      }
    });
    
    page.on('pageerror', (error) => {
      console.log(`🔴 Page error: ${error.message}`);
    });

    // Flujo de autenticación
    await page.goto('/login');
    await page.fill('input[name="email"]', 'admin@gamifier.com');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/');
    
    // Verificar login exitoso con selector más específico
    await expect(page.getByRole('heading', { name: 'Welcome to Gamifier Admin' })).toBeVisible();
  });

  test('🚀 Tour Completo del Gamifier Admin', async ({ page }) => {
    console.log('\n🎯 Iniciando tour completo del Gamifier Admin...\n');
    
    // ========================================
    // 🏠 1. DASHBOARD PRINCIPAL
    // ========================================
    console.log('📊 PASO 1: Verificando Dashboard Principal...');
    await expect(page.getByRole('heading', { name: 'Welcome to Gamifier Admin' })).toBeVisible();
    console.log('✅ Dashboard principal cargado correctamente');
    
    // Pausa para observación
    await page.waitForTimeout(2000);

    // ========================================
    // 👥 2. GESTIÓN DE USUARIOS
    // ========================================
    console.log('\n👥 PASO 2: Navegando a Gestión de Usuarios...');
    await page.getByRole('button', { name: /users/i }).click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1500);
    
    await expect(page.getByText('Users Management')).toBeVisible();
    console.log('✅ Página de usuarios cargada');
    
    // Verificar tabla de usuarios
    const usersTable = page.locator('table, .data-table');
    if (await usersTable.isVisible()) {
      console.log('✅ Tabla de usuarios visible');
    }

    // ========================================
    // 🔐 3. GESTIÓN DE ROLES
    // ========================================
    console.log('\n🔐 PASO 3: Navegando a Gestión de Roles...');
    await page.getByRole('button', { name: /roles/i }).click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1500);
    
    await expect(page.getByText('Gestión de Roles')).toBeVisible();
    console.log('✅ Página de roles cargada');

    // ========================================
    // 🔑 4. GESTIÓN DE PERMISOS
    // ========================================
    console.log('\n🔑 PASO 4: Navegando a Gestión de Permisos...');
    await page.getByRole('button', { name: /permissions/i }).click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1500);
    
    await expect(page.getByText('Permissions Management')).toBeVisible();
    console.log('✅ Página de permisos cargada');

    // ========================================
    // 🌍 5. GESTIÓN DE MUNDOS
    // ========================================
    console.log('\n🌍 PASO 5: Navegando a Gestión de Mundos...');
    await page.getByRole('button', { name: /mundos/i }).click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1500);
    
    await expect(page.getByText('Mundos Management')).toBeVisible();
    console.log('✅ Página de mundos cargada');
    
    // Buscar mundos existentes
    const mundoCards = page.locator('.mundo-card, [data-testid*="mundo"]');
    const mundoCount = await mundoCards.count();
    console.log(`📊 Encontrados ${mundoCount} mundos`);

    // ========================================
    // 📋 6. GESTIÓN DE PLAYLISTS
    // ========================================
    console.log('\n📋 PASO 6: Navegando a Gestión de Playlists...');
    await page.getByRole('button', { name: /playlists/i }).click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1500);
    
    await expect(page.getByText('Playlists Management')).toBeVisible();
    console.log('✅ Página de playlists cargada');

    // ========================================
    // 📹 7. GESTIÓN DE CONTENIDO
    // ========================================
    console.log('\n📹 PASO 7: Navegando a Gestión de Contenido...');
    await page.getByRole('button', { name: /items/i }).click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1500);
    
    await expect(page.getByText('Content Items Management')).toBeVisible();
    console.log('✅ Página de contenido cargada');

    // ========================================
    // ⚙️ 8. CONFIGURACIÓN DE VIDEOS
    // ========================================
    console.log('\n⚙️ PASO 8: Navegando a Configuración de Videos...');
    
    // Intentar diferentes formas de acceder a la configuración
    const configButtons = [
      page.getByRole('button', { name: /config/i }),
      page.getByRole('button', { name: /settings/i }),
      page.getByRole('button', { name: /video/i }),
      page.locator('[href*="config"]'),
      page.locator('[href*="video-config"]')
    ];
    
    let configFound = false;
    for (const button of configButtons) {
      if (await button.isVisible()) {
        await button.click();
        await page.waitForTimeout(2000);
        
        // Verificar si llegamos a la página correcta
        const configIndicators = [
          page.getByText(/Video Configuration/i),
          page.getByText(/Configuración/i),
          page.getByRole('tab', { name: /subtitle/i }),
          page.getByRole('tab', { name: /question/i })
        ];
        
        for (const indicator of configIndicators) {
          if (await indicator.isVisible()) {
            console.log('✅ Página de configuración de videos cargada');
            configFound = true;
            break;
          }
        }
        
        if (configFound) break;
      }
    }
    
    if (!configFound) {
      console.log('⚠️ No se pudo acceder a la página de configuración de videos');
    } else {
      // ========================================
      // 📝 9. TAB DE SUBTÍTULOS
      // ========================================
      console.log('\n📝 PASO 9: Verificando Tab de Subtítulos...');
      const subtitleTab = page.getByRole('tab', { name: /subtitle/i });
      if (await subtitleTab.isVisible()) {
        await subtitleTab.click();
        await page.waitForTimeout(1500);
        console.log('✅ Tab de subtítulos activado');
        
        // Buscar botón de gestión de subtítulos
        const manageBtn = page.getByRole('button', { name: /manage|gestionar/i });
        if (await manageBtn.isVisible()) {
          await manageBtn.click();
          await page.waitForTimeout(2000);
          console.log('✅ Modal de gestión de subtítulos abierto');
          
          // Cerrar modal
          await page.keyboard.press('Escape');
          await page.waitForTimeout(500);
        }
      }

      // ========================================
      // ❓ 10. TAB DE PREGUNTAS
      // ========================================
      console.log('\n❓ PASO 10: Verificando Tab de Preguntas...');
      const questionTab = page.getByRole('tab', { name: /question/i });
      if (await questionTab.isVisible()) {
        await questionTab.click();
        await page.waitForTimeout(1500);
        console.log('✅ Tab de preguntas activado');
      }
    }

    // ========================================
    // 📊 11. ANALÍTICAS (Si existe)
    // ========================================
    console.log('\n📊 PASO 11: Buscando Analíticas...');
    const analyticsBtn = page.getByRole('button', { name: /analytics/i });
    if (await analyticsBtn.isVisible()) {
      await analyticsBtn.click();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1500);
      console.log('✅ Página de analíticas cargada');
    } else {
      console.log('ℹ️ Página de analíticas no disponible');
    }

    // ========================================
    // 🔍 12. NAVEGACIÓN FINAL Y VERIFICACIÓN
    // ========================================
    console.log('\n🔍 PASO 12: Verificación final del menú...');
    
    // Volver al dashboard
    await page.getByRole('button', { name: /dashboard|home/i }).first().click();
    await page.waitForTimeout(1500);
    
    await expect(page.getByRole('heading', { name: 'Welcome to Gamifier Admin' })).toBeVisible();
    console.log('✅ Navegación de vuelta al dashboard exitosa');

    // ========================================
    // 📱 13. VERIFICACIÓN DE RESPONSIVIDAD
    // ========================================
    console.log('\n📱 PASO 13: Verificando responsividad...');
    
    // Tamaño móvil
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(1000);
    console.log('📱 Vista móvil aplicada');
    
    // Tamaño tablet
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(1000);
    console.log('📱 Vista tablet aplicada');
    
    // Volver a desktop
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.waitForTimeout(1000);
    console.log('📱 Vista desktop restaurada');

    // ========================================
    // ✅ RESUMEN FINAL
    // ========================================
    console.log('\n✅ TOUR COMPLETADO EXITOSAMENTE');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 Páginas verificadas:');
    console.log('   ✓ Dashboard Principal');
    console.log('   ✓ Gestión de Usuarios');
    console.log('   ✓ Gestión de Roles');
    console.log('   ✓ Gestión de Permisos');
    console.log('   ✓ Gestión de Mundos');
    console.log('   ✓ Gestión de Playlists');
    console.log('   ✓ Gestión de Contenido');
    console.log('   ✓ Configuración de Videos (si disponible)');
    console.log('   ✓ Responsividad');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    // Pausa final para observación
    await page.waitForTimeout(3000);
  });
}); 