import { test, expect } from '@playwright/test';

test.describe('ÜPlay Structure Explorer', () => {
  test('explore ÜPlay structure after login', async ({ page }) => {
    console.log('🔍 EXPLORANDO ESTRUCTURA DE ÜPLAY');

    // Ir a la página inicial
    await page.goto('http://localhost:3001');

    // Hacer login automáticamente si es necesario
    const currentUrl = page.url();
    if (currentUrl.includes('/login')) {
      console.log('🔐 Haciendo login automático...');

      await page.fill('[data-testid="login-email-input"] input', 'admin@gamifier.com');
      await page.fill('[data-testid="login-password-input"] input', 'admin123');
      await page.click('[data-testid="login-submit-button"]');

      // Esperar redirección
      await page.waitForURL('**/', { timeout: 15000 });
      console.log(`✅ Login exitoso, URL: ${page.url()}`);
    }

    // Esperar que cargue completamente
    await page.waitForLoadState('networkidle');
    console.log('📍 Página principal cargada');

    // Navegar a ÜPlay
    console.log('🎮 Navegando a ÜPlay...');

    // Intentar diferentes formas de llegar a ÜPlay
    const uplaySelectors = [
      'a[href="/uplay"]',
      'text=ÜPlay',
      'text=UPlay',
      '[data-testid*="uplay"]',
      'button:has-text("ÜPlay")',
      'button:has-text("UPlay")'
    ];

    let foundUPlay = false;
    for (const selector of uplaySelectors) {
      try {
        const element = page.locator(selector).first();
        const count = await element.count();
        if (count > 0) {
          console.log(`✅ Encontrado ÜPlay con selector: ${selector}`);
          await element.click();
          foundUPlay = true;
          break;
        }
      } catch (error) {
        // Continuar con el siguiente selector
      }
    }

    if (!foundUPlay) {
      console.log('⚠️ No se encontró enlace directo a ÜPlay, navegando manualmente...');
      await page.goto('http://localhost:3001/uplay');
    }

    // Esperar que cargue ÜPlay
    await page.waitForLoadState('networkidle');
    console.log('🎮 ÜPlay cargado');

    // Capturar screenshot inicial de ÜPlay
    await page.screenshot({ path: 'test-results/uplay-structure-full.png', fullPage: true });
    console.log('📸 Screenshot completo de ÜPlay guardado');

    // Explorar la estructura de ÜPlay
    console.log('\n🔍 EXPLORANDO ESTRUCTURA DE ÜPLAY:');

    // Buscar tabs/pestañas
    const tabSelectors = [
      '[role="tab"]',
      '.MuiTab-root',
      '[data-testid*="tab"]',
      'button[aria-selected]',
      'text=Videoteca',
      'text=Biblioteca',
      'text=Videos',
      'text=Contenido'
    ];

    console.log('\n📑 BUSCANDO TABS/PESTAÑAS:');
    for (const selector of tabSelectors) {
      try {
        const elements = page.locator(selector);
        const count = await elements.count();
        if (count > 0) {
          console.log(`   ✅ ${selector}: ${count} elementos`);
          for (let i = 0; i < Math.min(count, 3); i++) {
            const text = await elements.nth(i).textContent();
            console.log(`      ${i + 1}. "${text}"`);
          }
        }
      } catch (error) {
        // Continuar
      }
    }

    // Buscar cards/tarjetas de video
    const cardSelectors = [
      '[data-testid*="video"]',
      '[data-testid*="card"]',
      '.MuiCard-root',
      '[class*="card"]',
      'img[src*="youtube"]',
      'img[src*="placeholder"]'
    ];

    console.log('\n🃏 BUSCANDO CARDS/TARJETAS DE VIDEO:');
    for (const selector of cardSelectors) {
      try {
        const elements = page.locator(selector);
        const count = await elements.count();
        if (count > 0) {
          console.log(`   ✅ ${selector}: ${count} elementos`);
        }
      } catch (error) {
        // Continuar
      }
    }

    // Buscar botones principales
    console.log('\n🔘 BOTONES PRINCIPALES VISIBLES:');
    const buttons = page.locator('button:visible');
    const buttonCount = await buttons.count();
    console.log(`   Total botones: ${buttonCount}`);

    for (let i = 0; i < Math.min(buttonCount, 10); i++) {
      const text = await buttons.nth(i).textContent();
      if (text && text.trim()) {
        console.log(`   ${i + 1}. "${text.trim()}"`);
      }
    }

    // Buscar enlaces principales
    console.log('\n🔗 ENLACES PRINCIPALES VISIBLES:');
    const links = page.locator('a:visible');
    const linkCount = await links.count();
    console.log(`   Total enlaces: ${linkCount}`);

    for (let i = 0; i < Math.min(linkCount, 10); i++) {
      const text = await links.nth(i).textContent();
      const href = await links.nth(i).getAttribute('href');
      if (text && text.trim()) {
        console.log(`   ${i + 1}. "${text.trim()}" -> ${href}`);
      }
    }

    // Información de la página
    const title = await page.title();
    const url = page.url();
    console.log('\n📋 INFORMACIÓN DE PÁGINA:');
    console.log(`   Título: ${title}`);
    console.log(`   URL: ${url}`);

    console.log('\n🎯 AHORA PUEDES NAVEGAR MANUALMENTE');
    console.log('El test esperará 2 minutos para que explores.');
    console.log('Presiona Ctrl+C cuando termines.');

    // Esperar 2 minutos para navegación manual
    await page.waitForTimeout(2 * 60 * 1000);

    // Screenshot final
    await page.screenshot({ path: 'test-results/uplay-structure-final.png', fullPage: true });
    console.log('\n📸 Screenshot final guardado');
    console.log('✅ Exploración completada');

    // El test siempre pasa
    expect(true).toBe(true);
  });
});
