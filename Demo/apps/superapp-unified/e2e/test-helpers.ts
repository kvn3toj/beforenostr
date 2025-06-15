/**
 * 🛠️ Test Helpers - Funciones Utilitarias para Tests E2E
 * 
 * Soluciones para problemas comunes de timing y navegación
 * identificados en el Diagnóstico del Día 3.
 */

// 🔧 SOLUCIÓN CRÍTICA: Login robusto con timing adecuado
export async function loginAs(page: any, email: string = 'user@gamifier.com', password: string = '123456') {
  await page.goto('/login');
  await page.waitForSelector('#root', { timeout: 10000 });
  
  // Llenar formulario de login
  await page.fill('[data-testid="login-email-input"] input', email);
  await page.fill('[data-testid="login-password-input"] input', password);
  await page.click('[data-testid="login-submit-button"]');
  
  // Esperar redirección exitosa
  await page.waitForURL('**/', { timeout: 15000 });
  
  // 🔧 SOLUCIÓN CRÍTICA: Dar tiempo para que la página home se renderice completamente
  await page.waitForLoadState('networkidle', { timeout: 10000 });
  await page.waitForTimeout(2000); // Dar tiempo adicional para que se renderice el sidebar/navigation
  
  // Verificar que los elementos de navegación están disponibles
  await page.waitForSelector('nav, [role="navigation"], .navigation, .sidebar', { timeout: 10000 });
  
  console.log(`✅ Login exitoso con ${email} - Página completamente cargada`);
}

// 🔧 SOLUCIÓN CRÍTICA: Navegación robusta a ÜPlay
export async function navigateToUPlay(page: any) {
  console.log('🎯 Navegando a ÜPlay de manera robusta...');
  
  // Intentar múltiples selectores para encontrar el enlace ÜPlay
  const uplaySelectors = [
    'a[href="/uplay"]',
    'a[href*="uplay"]',
    'nav a:has-text("ÜPlay")',
    'nav a:has-text("UPlay")',
    'nav a:has-text("Videos")',
    'button:has-text("ÜPlay")',
    'button:has-text("UPlay")',
    '[data-testid*="uplay"]',
    '.navigation a:has-text("ÜPlay")',
    '.sidebar a:has-text("ÜPlay")',
    // Agregar más opciones para mobile/responsive
    '.bottom-navigation a:has-text("ÜPlay")',
    '.mobile-nav a:has-text("ÜPlay")',
    '[aria-label*="uplay"], [aria-label*="videos"]'
  ];
  
  let clickedSuccessfully = false;
  
  for (const selector of uplaySelectors) {
    try {
      // Esperar a que el elemento esté disponible
      await page.waitForSelector(selector, { timeout: 5000 });
      
      if (await page.locator(selector).isVisible()) {
        console.log(`✅ Enlace ÜPlay encontrado con selector: ${selector}`);
        await page.click(selector);
        await page.waitForLoadState('networkidle');
        clickedSuccessfully = true;
        break;
      }
    } catch (error) {
      console.log(`ℹ️  Selector ${selector} no encontrado, probando siguiente...`);
      continue;
    }
  }
  
  if (!clickedSuccessfully) {
    // Si no encuentra ningún enlace, intentar navegación directa
    console.log('⚠️  No se encontró enlace ÜPlay, navegando directamente...');
    await page.goto('/uplay');
    await page.waitForLoadState('networkidle');
  }
  
  console.log('✅ Navegación a ÜPlay completada');
}

// 🔧 SOLUCIÓN CRÍTICA: Navegación robusta al Marketplace
export async function navigateToMarketplace(page: any) {
  console.log('🎯 Navegando al Marketplace de manera robusta...');
  
  const marketplaceSelectors = [
    'a[href="/marketplace"]',
    'a[href*="marketplace"]',
    'nav a:has-text("Marketplace")',
    'nav a:has-text("Market")',
    'button:has-text("Marketplace")',
    '[data-testid*="marketplace"]',
    '.navigation a:has-text("Marketplace")',
    '.sidebar a:has-text("Marketplace")',
    '.bottom-navigation a:has-text("Marketplace")',
    '.mobile-nav a:has-text("Marketplace")'
  ];
  
  let clickedSuccessfully = false;
  
  for (const selector of marketplaceSelectors) {
    try {
      await page.waitForSelector(selector, { timeout: 5000 });
      
      if (await page.locator(selector).isVisible()) {
        console.log(`✅ Enlace Marketplace encontrado con selector: ${selector}`);
        await page.click(selector);
        await page.waitForLoadState('networkidle');
        clickedSuccessfully = true;
        break;
      }
    } catch (error) {
      console.log(`ℹ️  Selector ${selector} no encontrado, probando siguiente...`);
      continue;
    }
  }
  
  if (!clickedSuccessfully) {
    console.log('⚠️  No se encontró enlace Marketplace, navegando directamente...');
    await page.goto('/marketplace');
    await page.waitForLoadState('networkidle');
  }
  
  console.log('✅ Navegación al Marketplace completada');
}

// 🔧 SOLUCIÓN CRÍTICA: Espera robusta para elementos después del login
export async function waitForAppToLoad(page: any, timeout: number = 10000) {
  console.log('⏳ Esperando a que la aplicación se cargue completamente...');
  
  // Esperar a que React se monte
  await page.waitForSelector('#root', { timeout });
  
  // Esperar a que la red esté tranquila
  await page.waitForLoadState('networkidle', { timeout });
  
  // Dar tiempo adicional para componentes dinámicos
  await page.waitForTimeout(1000);
  
  // Verificar que los elementos básicos de navegación están disponibles
  const navigationSelectors = [
    'nav',
    '[role="navigation"]', 
    '.navigation',
    '.sidebar',
    '.bottom-navigation',
    '.mobile-nav'
  ];
  
  let navigationFound = false;
  for (const selector of navigationSelectors) {
    try {
      await page.waitForSelector(selector, { timeout: 3000 });
      navigationFound = true;
      console.log(`✅ Navegación encontrada: ${selector}`);
      break;
    } catch (error) {
      continue;
    }
  }
  
  if (!navigationFound) {
    console.log('⚠️  No se encontró navegación estándar, pero continuando...');
  }
  
  console.log('✅ Aplicación cargada completamente');
}

// 🔧 SOLUCIÓN CRÍTICA: Diagnóstico de elementos UI disponibles
export async function debugAvailableNavigation(page: any) {
  console.log('🔍 Diagnosticando elementos de navegación disponibles...');
  
  // Buscar todos los enlaces de navegación
  const allLinks = await page.locator('a[href]').all();
  console.log(`📍 Total de enlaces encontrados: ${allLinks.length}`);
  
  // Listar los primeros 10 enlaces
  for (let i = 0; i < Math.min(allLinks.length, 10); i++) {
    try {
      const href = await allLinks[i].getAttribute('href');
      const text = await allLinks[i].textContent();
      console.log(`  🔗 ${i + 1}: ${href} - "${text}"`);
    } catch (error) {
      console.log(`  ❌ Error obteniendo info del enlace ${i + 1}`);
    }
  }
  
  // Buscar elementos específicos de navegación
  const navElements = await page.locator('nav, [role="navigation"], .navigation, .sidebar').all();
  console.log(`🧭 Elementos de navegación encontrados: ${navElements.length}`);
  
  // Verificar si hay elementos mobile/responsive
  const mobileNavElements = await page.locator('.bottom-navigation, .mobile-nav, .mobile-menu').all();
  console.log(`📱 Elementos de navegación mobile: ${mobileNavElements.length}`);
} 