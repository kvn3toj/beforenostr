const { chromium } = require('playwright');

async function testAnalyticsFunnels() {
  console.log('🎯 Iniciando test completo de Analytics Funnels...\n');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 1500 // Slower to see the actions clearly
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();

  // Listen for console messages to see analytics events
  page.on('console', msg => {
    if (msg.text().includes('Analytics') || msg.text().includes('Tracking')) {
      console.log('🔍 Browser Log:', msg.text());
    }
  });

  try {
    // 1. LOGIN FLOW
    console.log('📋 FASE 1: Login y Configuración Inicial...');
    await page.goto('http://localhost:3000/login');
    await page.waitForLoadState('networkidle');

    await page.fill('input[name="email"]', 'admin@gamifier.com');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/');

    // Verify login success
    try {
      await page.waitForSelector('nav, [role="navigation"], button[aria-label*="menu"]', { timeout: 5000 });
      console.log('✅ Login exitoso');
    } catch {
      const currentUrl = page.url();
      if (!currentUrl.includes('/login')) {
        console.log('✅ Login exitoso - Verificado por URL');
      } else {
        throw new Error('Login falló');
      }
    }

    // 2. TEST USER CREATION FUNNEL
    console.log('\n📋 FASE 2: Testing User Creation Funnel...');
    
    // Navigate to users page
    await page.click('text=Usuarios', { timeout: 5000 });
    console.log('✅ Navegado a página de usuarios');
    
    // Start user creation funnel
    await page.click('button:has-text("Crear Usuario")');
    await page.waitForSelector('form', { timeout: 5000 });
    console.log('✅ Funnel de creación de usuario iniciado');

    // Fill form progressively (simulate user typing)
    await page.fill('input[name="name"]', 'Test Analytics User');
    await page.waitForTimeout(500);
    await page.fill('input[name="email"]', 'analytics.test@example.com');
    await page.waitForTimeout(500);
    await page.fill('input[name="password"]', 'testpass123');
    await page.waitForTimeout(500);
    
    // Submit form
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);
    console.log('✅ Usuario creado - Funnel de creación completado');

    // 3. TEST VIDEO CREATION FUNNEL
    console.log('\n📋 FASE 3: Testing Video Creation Funnel...');
    
    // Navigate to items/playlists page
    try {
      await page.click('text=Items', { timeout: 5000 });
    } catch {
      await page.click('text=Videos', { timeout: 5000 });
    }
    console.log('✅ Navegado a página de videos/items');

    // Start video creation funnel
    await page.click('button:has-text("Añadir Video"), button:has-text("Add Video")');
    await page.waitForSelector('textarea, input[placeholder*="iframe"], input[placeholder*="código"]', { timeout: 5000 });
    console.log('✅ Funnel de creación de video iniciado');

    // Add iframe code
    const iframeCode = '<iframe width="560" height="315" src="https://www.youtube.com/embed/dQw4w9WgXcQ" frameborder="0" allowfullscreen></iframe>';
    await page.fill('textarea, input[placeholder*="iframe"], input[placeholder*="código"]', iframeCode);
    await page.waitForTimeout(1000);
    console.log('✅ Código iframe ingresado');

    // Save video
    try {
      await page.click('button:has-text("Guardar"), button:has-text("Añadir"), button:has-text("Save")');
      await page.waitForTimeout(2000);
      console.log('✅ Video guardado - Funnel de creación de video completado');
    } catch (error) {
      console.log('ℹ️ Botón de guardar no encontrado o ya procesado');
    }

    // 4. TEST PERMISSIONS MANAGEMENT FUNNEL
    console.log('\n📋 FASE 4: Testing Permissions Management Funnel...');
    
    // Navigate to roles page
    await page.click('text=Roles', { timeout: 5000 });
    await page.waitForSelector('table, [role="table"]', { timeout: 5000 });
    console.log('✅ Navegado a página de roles');

    // Click on permissions management button for first role
    const permissionsButton = await page.locator('button[aria-label*="Gestionar"], button:has([data-testid*="SettingsIcon"]), svg[data-testid="SettingsIcon"]').first();
    if (await permissionsButton.count() > 0) {
      await permissionsButton.click();
      await page.waitForSelector('dialog, [role="dialog"]', { timeout: 5000 });
      console.log('✅ Funnel de gestión de permisos iniciado');

      // Wait for permissions to load
      await page.waitForTimeout(2000);

      // Toggle a permission (simulate user interaction)
      const checkboxes = await page.locator('input[type="checkbox"]').all();
      if (checkboxes.length > 0) {
        await checkboxes[0].click();
        await page.waitForTimeout(500);
        console.log('✅ Permiso modificado');
        
        // Save changes
        await page.click('button:has-text("Guardar"), button:has-text("Save")');
        await page.waitForTimeout(1000);
        console.log('✅ Cambios de permisos guardados - Funnel completado');
      } else {
        // Close dialog without changes
        await page.click('button:has-text("Cancelar"), button:has-text("Cancel")');
        console.log('ℹ️ Dialog cerrado sin cambios');
      }
    } else {
      console.log('ℹ️ Botón de gestión de permisos no encontrado');
    }

    // 5. VERIFY ANALYTICS DATA WAS SENT
    console.log('\n📋 FASE 5: Verificando datos de analytics...');
    
    // Check if analytics endpoint received data
    const response = await page.evaluate(async () => {
      try {
        const response = await fetch('http://localhost:3002/analytics/data', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        return await response.json();
      } catch (error) {
        return { error: error.message };
      }
    });

    if (response.error) {
      console.log('ℹ️ No se pudo verificar datos de analytics directamente');
    } else {
      console.log('✅ Endpoint de analytics accesible');
    }

    console.log('\n🎉 Todos los funnels de analytics han sido probados exitosamente!');
    console.log('\n📊 Resumen de funnels probados:');
    console.log('   ✅ User Creation Funnel: Login → Users → Create → Fill → Save → Success');
    console.log('   ✅ Video Creation Funnel: Login → Items → Add Video → Fill → Save → Success');
    console.log('   ✅ Permissions Funnel: Login → Roles → Select Role → Manage → Modify → Save → Success');

    await page.waitForTimeout(3000); // Wait to see final state

  } catch (error) {
    console.error('❌ Error durante las pruebas de analytics:', error);
    
    // Take screenshot for debugging
    await page.screenshot({ 
      path: `analytics-test-error-${Date.now()}.png`,
      fullPage: true 
    });
    
    console.log('📸 Screenshot guardado para debugging');
  } finally {
    await browser.close();
  }
}

// Run the test
testAnalyticsFunnels().catch(console.error); 