const { chromium } = require('playwright');

async function testMinimalDesign() {
  console.log('🎨 Iniciando test del diseño minimalista CoomÜnity...\n');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 1000 
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // 1. LOGIN
    console.log('📝 Realizando login...');
    await page.goto('http://localhost:3333/login');
    await page.waitForLoadState('networkidle');

    await page.fill('input[name="email"]', 'admin@gamifier.com');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/');

    // Verificar login exitoso
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

    // 2. VERIFICAR HEADER NEGRO
    console.log('\n🎨 Verificando header negro...');
    const header = await page.locator('header, [role="banner"], .MuiAppBar-root').first();
    if (await header.count() > 0) {
      const headerStyles = await header.evaluate(el => {
        const styles = window.getComputedStyle(el);
        return {
          backgroundColor: styles.backgroundColor,
          color: styles.color
        };
      });
      console.log('📊 Estilos del header:', headerStyles);
      
      // Verificar que el header tiene un color oscuro
      if (headerStyles.backgroundColor.includes('39, 39, 39') || 
          headerStyles.backgroundColor.includes('rgb(39, 39, 39)') ||
          headerStyles.backgroundColor === '#272727') {
        console.log('✅ Header tiene color negro/oscuro correcto');
      } else {
        console.log('⚠️ Header color:', headerStyles.backgroundColor);
      }
    }

    // 3. VERIFICAR MENÚ LATERAL NEGRO
    console.log('\n🎨 Verificando menú lateral negro...');
    const drawer = await page.locator('.MuiDrawer-paper, [role="navigation"]').first();
    if (await drawer.count() > 0) {
      const drawerStyles = await drawer.evaluate(el => {
        const styles = window.getComputedStyle(el);
        return {
          backgroundColor: styles.backgroundColor,
          color: styles.color
        };
      });
      console.log('📊 Estilos del menú:', drawerStyles);
      
      if (drawerStyles.backgroundColor.includes('39, 39, 39') || 
          drawerStyles.backgroundColor.includes('rgb(39, 39, 39)') ||
          drawerStyles.backgroundColor === '#272727') {
        console.log('✅ Menú lateral tiene color negro correcto');
      } else {
        console.log('⚠️ Menú color:', drawerStyles.backgroundColor);
      }
    }

    // 4. VERIFICAR LOGO EN MENÚ
    console.log('\n🎨 Verificando logo en menú lateral...');
    const logoInMenu = await page.locator('.MuiDrawer-paper svg, .MuiDrawer-paper img').first();
    if (await logoInMenu.count() > 0) {
      console.log('✅ Logo encontrado en menú lateral');
    } else {
      console.log('⚠️ Logo no encontrado en menú lateral');
    }

    // 5. VERIFICAR FONDO GRIS CLARO
    console.log('\n🎨 Verificando fondo gris claro...');
    const mainContent = await page.locator('main, [role="main"]').first();
    if (await mainContent.count() > 0) {
      const mainStyles = await mainContent.evaluate(el => {
        const styles = window.getComputedStyle(el);
        return {
          backgroundColor: styles.backgroundColor
        };
      });
      console.log('📊 Fondo principal:', mainStyles.backgroundColor);
      
      if (mainStyles.backgroundColor.includes('248, 249, 250') || 
          mainStyles.backgroundColor.includes('rgb(248, 249, 250)') ||
          mainStyles.backgroundColor === '#F8F9FA') {
        console.log('✅ Fondo tiene color gris claro correcto');
      } else {
        console.log('⚠️ Fondo color:', mainStyles.backgroundColor);
      }
    }

    // 6. VERIFICAR CARDS REDONDEADAS
    console.log('\n🎨 Verificando cards redondeadas...');
    const cards = await page.locator('.MuiCard-root').all();
    if (cards.length > 0) {
      console.log(`📊 Encontradas ${cards.length} cards`);
      
      const firstCard = cards[0];
      const cardStyles = await firstCard.evaluate(el => {
        const styles = window.getComputedStyle(el);
        return {
          borderRadius: styles.borderRadius,
          boxShadow: styles.boxShadow,
          border: styles.border
        };
      });
      console.log('📊 Estilos de card:', cardStyles);
      
      // Verificar border radius mayor a 12px
      const borderRadius = parseInt(cardStyles.borderRadius);
      if (borderRadius >= 12) {
        console.log('✅ Cards tienen bordes redondeados correctos');
      } else {
        console.log('⚠️ Border radius:', cardStyles.borderRadius);
      }
    }

    // 7. VERIFICAR ELEMENTOS DORADOS (HOVER)
    console.log('\n🎨 Verificando elementos dorados en hover...');
    const firstCard = await page.locator('.MuiCard-root').first();
    if (await firstCard.count() > 0) {
      // Hacer hover sobre la primera card
      await firstCard.hover();
      await page.waitForTimeout(500);
      
      const cardAfterHover = await firstCard.evaluate(el => {
        const styles = window.getComputedStyle(el);
        return {
          borderColor: styles.borderColor,
          boxShadow: styles.boxShadow
        };
      });
      console.log('📊 Card después de hover:', cardAfterHover);
      
      if (cardAfterHover.borderColor.includes('206, 169, 58') || 
          cardAfterHover.boxShadow.includes('206, 169, 58')) {
        console.log('✅ Efectos dorados en hover funcionando');
      } else {
        console.log('⚠️ Efectos hover:', cardAfterHover);
      }
    }

    // 8. CAPTURAR SCREENSHOT FINAL
    console.log('\n📸 Capturando screenshot del diseño...');
    await page.screenshot({ 
      path: `minimal-design-test-${Date.now()}.png`,
      fullPage: true 
    });

    console.log('\n🎉 Test de diseño minimalista completado exitosamente');

  } catch (error) {
    console.error('❌ Error durante el test:', error);
    await page.screenshot({ 
      path: `minimal-design-test-error-${Date.now()}.png`,
      fullPage: true 
    });
  } finally {
    await browser.close();
  }
}

testMinimalDesign().catch(console.error); 