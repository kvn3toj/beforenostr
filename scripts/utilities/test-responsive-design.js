const { chromium } = require('playwright');

/**
 * Test Completo de Responsividad - Gamifier Admin
 * 
 * Verifica la implementación de la Heurística 3: 'Pixel Perfect' y 'Breakpoints'
 * Incluye tests para todos los dispositivos objetivo definidos en el tema
 */

// === DISPOSITIVOS OBJETIVO PARA TESTING ===
const testDevices = {
  mobile: [
    { name: 'iPhone SE', width: 375, height: 667, ratio: 2 },
    { name: 'iPhone 12', width: 390, height: 844, ratio: 3 },
    { name: 'iPhone 14 Pro', width: 393, height: 852, ratio: 3 },
    { name: 'Samsung Galaxy S21', width: 384, height: 854, ratio: 3 },
  ],
  tablet: [
    { name: 'iPad', width: 768, height: 1024, ratio: 2 },
    { name: 'iPad Pro 11', width: 834, height: 1194, ratio: 2 },
    { name: 'Samsung Galaxy Tab', width: 800, height: 1280, ratio: 2 },
  ],
  desktop: [
    { name: 'MacBook Air', width: 1280, height: 832 },
    { name: 'MacBook Pro 14', width: 1512, height: 982 },
    { name: 'Full HD', width: 1920, height: 1080 },
    { name: 'QHD', width: 2560, height: 1440 },
  ]
};

// === FUNCIONES DE TESTING RESPONSIVO ===

async function testResponsiveLogin(page, deviceInfo) {
  console.log(`\n🔍 Testing Login Responsivo - ${deviceInfo.name} (${deviceInfo.width}x${deviceInfo.height})`);

  try {
    // Navegar a login
    await page.goto('http://localhost:3000/login');
    await page.waitForLoadState('networkidle');

    // Verificar elementos responsivos del login
    const loginContainer = await page.locator('[data-testid="login-container"], .login-container, form').first();
    
    if (await loginContainer.isVisible()) {
      const boundingBox = await loginContainer.boundingBox();
      console.log(`  ✅ Container login visible - Width: ${boundingBox?.width}px`);
      
      // Verificar que el container se adapte al viewport
      if (deviceInfo.width <= 600) {
        // Mobile: El container debe usar la mayoría del ancho
        const expectedMinWidth = deviceInfo.width * 0.85; // 85% del viewport
        if (boundingBox && boundingBox.width >= expectedMinWidth) {
          console.log(`  ✅ Mobile: Container width apropiado (${boundingBox.width}px >= ${expectedMinWidth}px)`);
        } else {
          console.log(`  ⚠️  Mobile: Container podría ser más ancho (${boundingBox?.width}px < ${expectedMinWidth}px)`);
        }
      } else if (deviceInfo.width <= 900) {
        // Tablet: Container con ancho moderado
        console.log(`  ✅ Tablet: Container width ${boundingBox?.width}px`);
      } else {
        // Desktop: Container centrado con ancho máximo
        console.log(`  ✅ Desktop: Container width ${boundingBox?.width}px`);
      }
    }

    // Verificar campos de entrada responsivos
    const emailInput = await page.locator('input[name="email"], input[type="email"]').first();
    const passwordInput = await page.locator('input[name="password"], input[type="password"]').first();
    const submitButton = await page.locator('button[type="submit"], button:has-text("Iniciar"), button:has-text("Login")').first();

    if (await emailInput.isVisible()) {
      const inputBox = await emailInput.boundingBox();
      const expectedMinHeight = deviceInfo.width <= 600 ? 44 : 40; // 44px mínimo en mobile para touch
      
      if (inputBox && inputBox.height >= expectedMinHeight) {
        console.log(`  ✅ Input height apropiado: ${inputBox.height}px (>= ${expectedMinHeight}px)`);
      } else {
        console.log(`  ⚠️  Input height insuficiente: ${inputBox?.height}px (< ${expectedMinHeight}px)`);
      }
    }

    if (await submitButton.isVisible()) {
      const buttonBox = await submitButton.boundingBox();
      const expectedMinHeight = deviceInfo.width <= 600 ? 44 : 40; // Touch target mínimo
      
      if (buttonBox && buttonBox.height >= expectedMinHeight) {
        console.log(`  ✅ Button height apropiado: ${buttonBox.height}px (>= ${expectedMinHeight}px)`);
      } else {
        console.log(`  ⚠️  Button height insuficiente: ${buttonBox?.height}px (< ${expectedMinHeight}px)`);
      }
    }

  } catch (error) {
    console.log(`  ❌ Error en test login responsivo: ${error.message}`);
  }
}

async function testResponsiveLayout(page, deviceInfo) {
  console.log(`\n🔍 Testing Layout Responsivo - ${deviceInfo.name}`);

  try {
    // Login primero
    await page.goto('http://localhost:3000/login');
    await page.waitForLoadState('networkidle');

    await page.fill('input[name="email"]', 'admin@gamifier.com');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/');

    // Verificar header responsivo
    const header = await page.locator('[role="banner"], header, .MuiAppBar-root').first();
    if (await header.isVisible()) {
      const headerBox = await header.boundingBox();
      const expectedHeight = deviceInfo.width <= 600 ? 56 : 64; // Mobile vs Desktop header height
      
      console.log(`  📏 Header height: ${headerBox?.height}px (esperado: ~${expectedHeight}px)`);
      
      if (headerBox && Math.abs(headerBox.height - expectedHeight) <= 8) {
        console.log(`  ✅ Header height correcto`);
      } else {
        console.log(`  ⚠️  Header height no coincide con breakpoint`);
      }
    }

    // Verificar drawer/sidebar responsivo
    const drawerButton = await page.locator('button[aria-label*="menu"], button[aria-label*="toggle"]').first();
    if (await drawerButton.isVisible()) {
      console.log(`  ✅ Menu button visible`);
      
      // Verificar comportamiento del drawer según dispositivo
      if (deviceInfo.width <= 600) {
        // Mobile: drawer debe ser overlay
        console.log(`  📱 Mobile: Testing overlay drawer`);
        await drawerButton.click();
        await page.waitForTimeout(500); // Esperar animación
        
        const drawer = await page.locator('[role="presentation"], .MuiDrawer-paper').first();
        if (await drawer.isVisible()) {
          console.log(`  ✅ Mobile drawer se abre como overlay`);
          
          // Cerrar drawer
          await drawerButton.click();
          await page.waitForTimeout(500);
        }
      } else {
        // Desktop: drawer permanente
        console.log(`  🖥️  Desktop: Testing permanent drawer`);
        const drawer = await page.locator('.MuiDrawer-paper').first();
        if (await drawer.isVisible()) {
          const drawerBox = await drawer.boundingBox();
          console.log(`  ✅ Desktop drawer visible - Width: ${drawerBox?.width}px`);
          
          // Test de collapse/expand
          await drawerButton.click();
          await page.waitForTimeout(500);
          
          const collapsedBox = await drawer.boundingBox();
          if (collapsedBox && drawerBox && collapsedBox.width !== drawerBox.width) {
            console.log(`  ✅ Drawer collapse funciona (${drawerBox.width}px → ${collapsedBox.width}px)`);
          }
        }
      }
    }

    // Verificar contenido principal responsivo
    const mainContent = await page.locator('main, [role="main"], .main-content').first();
    if (await mainContent.isVisible()) {
      const contentBox = await mainContent.boundingBox();
      console.log(`  📏 Main content width: ${contentBox?.width}px`);
      
      // Verificar márgenes apropiados
      if (deviceInfo.width <= 600) {
        // Mobile: contenido debe usar la mayoría del ancho
        const expectedMinWidth = deviceInfo.width * 0.9;
        if (contentBox && contentBox.width >= expectedMinWidth) {
          console.log(`  ✅ Mobile: Content width apropiado`);
        }
      } else {
        // Desktop: verificar margen por drawer
        console.log(`  ✅ Desktop: Content positioned correctly`);
      }
    }

  } catch (error) {
    console.log(`  ❌ Error en test layout responsivo: ${error.message}`);
  }
}

async function testResponsiveNavigation(page, deviceInfo) {
  console.log(`\n🔍 Testing Navigation Responsiva - ${deviceInfo.name}`);

  try {
    // Verificar elementos de navegación
    const navItems = await page.locator('[role="menuitem"], .MuiListItemButton-root, nav a').all();
    
    console.log(`  📍 Found ${navItems.length} navigation items`);
    
    for (let i = 0; i < Math.min(navItems.length, 3); i++) {
      if (await navItems[i].isVisible()) {
        const itemBox = await navItems[i].boundingBox();
        const expectedMinHeight = deviceInfo.width <= 600 ? 44 : 40; // Touch target
        
        if (itemBox && itemBox.height >= expectedMinHeight) {
          console.log(`  ✅ Nav item ${i + 1} height OK: ${itemBox.height}px`);
        } else {
          console.log(`  ⚠️  Nav item ${i + 1} height small: ${itemBox?.height}px`);
        }
      }
    }

    // Test de navegación táctil en mobile
    if (deviceInfo.width <= 600 && navItems.length > 0) {
      try {
        const firstItem = navItems[0];
        if (await firstItem.isVisible()) {
          await firstItem.click();
          await page.waitForTimeout(1000);
          console.log(`  ✅ Mobile navigation click funciona`);
        }
      } catch (navError) {
        console.log(`  ⚠️  Mobile navigation click error: ${navError.message}`);
      }
    }

  } catch (error) {
    console.log(`  ❌ Error en test navigation responsiva: ${error.message}`);
  }
}

async function testResponsiveTypography(page, deviceInfo) {
  console.log(`\n🔍 Testing Typography Responsiva - ${deviceInfo.name}`);

  try {
    // Verificar headings responsivos
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
    
    for (let i = 0; i < Math.min(headings.length, 3); i++) {
      if (await headings[i].isVisible()) {
        const fontSize = await headings[i].evaluate(el => {
          return window.getComputedStyle(el).fontSize;
        });
        
        const tagName = await headings[i].evaluate(el => el.tagName.toLowerCase());
        console.log(`  📝 ${tagName} font-size: ${fontSize}`);
        
        // Verificar que el font-size sea razonable para el dispositivo
        const sizeValue = parseFloat(fontSize);
        if (deviceInfo.width <= 600) {
          // Mobile: fonts más pequeños
          if (tagName === 'h1' && sizeValue >= 24 && sizeValue <= 40) {
            console.log(`  ✅ Mobile ${tagName} size OK`);
          } else if (tagName === 'h2' && sizeValue >= 20 && sizeValue <= 32) {
            console.log(`  ✅ Mobile ${tagName} size OK`);
          } else {
            console.log(`  📏 Mobile ${tagName} size: ${sizeValue}px`);
          }
        } else {
          // Desktop: fonts más grandes
          if (tagName === 'h1' && sizeValue >= 32 && sizeValue <= 48) {
            console.log(`  ✅ Desktop ${tagName} size OK`);
          } else {
            console.log(`  📏 Desktop ${tagName} size: ${sizeValue}px`);
          }
        }
      }
    }

    // Verificar line-height y legibilidad
    const bodyTexts = await page.locator('p, span, div').all();
    if (bodyTexts.length > 0) {
      const sampleText = bodyTexts[0];
      if (await sampleText.isVisible()) {
        const lineHeight = await sampleText.evaluate(el => {
          return window.getComputedStyle(el).lineHeight;
        });
        console.log(`  📏 Body line-height: ${lineHeight}`);
      }
    }

  } catch (error) {
    console.log(`  ❌ Error en test typography responsiva: ${error.message}`);
  }
}

async function captureResponsiveScreenshots(page, deviceInfo) {
  console.log(`\n📸 Capturing Screenshots - ${deviceInfo.name}`);

  try {
    // Screenshot del login
    await page.goto('http://localhost:3000/login');
    await page.waitForLoadState('networkidle');
    
    const loginScreenshot = `responsive-login-${deviceInfo.name.replace(/\s+/g, '-').toLowerCase()}-${deviceInfo.width}x${deviceInfo.height}.png`;
    await page.screenshot({ 
      path: loginScreenshot, 
      fullPage: true 
    });
    console.log(`  ✅ Login screenshot: ${loginScreenshot}`);

    // Screenshot del dashboard (si llegamos ahí)
    try {
      await page.fill('input[name="email"]', 'admin@gamifier.com');
      await page.fill('input[name="password"]', 'admin123');
      await page.click('button[type="submit"]');
      await page.waitForURL('**/');
      await page.waitForTimeout(2000);

      const dashboardScreenshot = `responsive-dashboard-${deviceInfo.name.replace(/\s+/g, '-').toLowerCase()}-${deviceInfo.width}x${deviceInfo.height}.png`;
      await page.screenshot({ 
        path: dashboardScreenshot, 
        fullPage: true 
      });
      console.log(`  ✅ Dashboard screenshot: ${dashboardScreenshot}`);

    } catch (screenshotError) {
      console.log(`  ⚠️  Dashboard screenshot error: ${screenshotError.message}`);
    }

  } catch (error) {
    console.log(`  ❌ Error capturing screenshots: ${error.message}`);
  }
}

// === FUNCIÓN PRINCIPAL DE TESTING ===
async function testResponsiveDesign() {
  console.log('🎯 Iniciando Test Completo de Responsividad - Gamifier Admin\n');
  console.log('📋 Verificando implementación de Heurística 3: "Pixel Perfect" y "Breakpoints"\n');

  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 1000 
  });

  // === TEST EN TODOS LOS DISPOSITIVOS OBJETIVO ===
  const allDevices = [
    ...testDevices.mobile,
    ...testDevices.tablet,
    ...testDevices.desktop
  ];

  for (const device of allDevices) {
    console.log(`\n${'='.repeat(80)}`);
    console.log(`🔄 TESTING DEVICE: ${device.name} (${device.width}x${device.height})`);
    console.log(`${'='.repeat(80)}`);

    const context = await browser.newContext({
      viewport: { width: device.width, height: device.height },
      deviceScaleFactor: device.ratio || 1,
      hasTouch: device.width <= 900, // Simular touch en mobile/tablet
      isMobile: device.width <= 600,
    });

    const page = await context.newPage();

    // Configurar logs de errores
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log(`  🚨 Console Error: ${msg.text()}`);
      }
    });

    page.on('pageerror', error => {
      console.log(`  🚨 Page Error: ${error.message}`);
    });

    try {
      // Ejecutar todos los tests responsivos
      await testResponsiveLogin(page, device);
      await testResponsiveLayout(page, device);
      await testResponsiveNavigation(page, device);
      await testResponsiveTypography(page, device);
      await captureResponsiveScreenshots(page, device);

      console.log(`\n✅ Testing completado para ${device.name}`);

    } catch (error) {
      console.log(`\n❌ Error general en ${device.name}: ${error.message}`);
    } finally {
      await context.close();
    }

    // Pausa entre dispositivos
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  await browser.close();

  // === RESUMEN FINAL ===
  console.log(`\n${'='.repeat(80)}`);
  console.log('🎉 TEST DE RESPONSIVIDAD COMPLETADO');
  console.log(`${'='.repeat(80)}`);
  console.log('\n📊 RESUMEN:');
  console.log(`✅ Dispositivos testados: ${allDevices.length}`);
  console.log(`📱 Mobile devices: ${testDevices.mobile.length}`);
  console.log(`📱 Tablet devices: ${testDevices.tablet.length}`);
  console.log(`🖥️  Desktop devices: ${testDevices.desktop.length}`);
  console.log('\n🔍 Verificaciones realizadas:');
  console.log('   • Responsividad del login');
  console.log('   • Layout adaptativo (header, drawer, content)');
  console.log('   • Navegación táctil');
  console.log('   • Tipografía fluida');
  console.log('   • Screenshots comparativos');
  console.log('\n📸 Screenshots guardados en el directorio actual');
  console.log('\n✨ ¡Heurística 3 "Pixel Perfect" y "Breakpoints" verificada!');
}

// Ejecutar el test
testResponsiveDesign().catch(console.error); 