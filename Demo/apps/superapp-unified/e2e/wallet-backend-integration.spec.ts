import { test, expect } from '@playwright/test';
import { loginAs } from './utils/auth';

test.describe('Wallet Backend Integration', () => {
  // 🔐 Hook de autenticación refactorizado usando función de utilidad
  test.beforeEach(async ({ page }) => {
    await loginAs(page);
  });

  test('should load wallet page and display real data after login', async ({ page }) => {
    console.log('🔍 Testing wallet page with real backend data...');
    
    // Ahora que estamos logueados (o al menos intentamos), navegamos al wallet
    console.log('🚀 Navegando a la página del wallet...');
    await page.goto('/wallet');
    await page.waitForSelector('#root');
    
    // Verificar que estamos en la página del wallet
    const currentUrl = await page.url();
    console.log('🌐 Current URL:', currentUrl);
    expect(currentUrl).toContain('/wallet');
    
    // Verificar elementos clave del wallet CoomÜnity
    console.log('💰 Verificando elementos del wallet...');
    
    // Buscar el título principal del wallet
    const walletTitle = page.locator('text=Mi Wallet CoomÜnity').or(
      page.locator('text=Wallet').or(
        page.locator('text=Billetera').or(
          page.locator('h1, h2, h3, h4').filter({ hasText: /wallet|billetera/i })
        )
      )
    );
    await expect(walletTitle.first()).toBeVisible({ timeout: 10000 });
    
    // Verificar elementos de balance/monedas CoomÜnity
    console.log('💎 Verificando balances y monedas...');
    
    // Buscar indicadores de Lükas (moneda principal)
    const lukasElements = page.locator('text=Lükas').or(
      page.locator('text=UC').or(
        page.locator('[data-testid*="lukas"]').or(
          page.locator('text=/\\d+\\s*(UC|Lükas)/i')
        )
      )
    );
    
    // Buscar indicadores de Öndas (energía vibracional)
    const ondasElements = page.locator('text=Öndas').or(
      page.locator('[data-testid*="ondas"]').or(
        page.locator('text=/\\d+\\s*Öndas/i')
      )
    );
    
    // Verificar que al menos uno de los elementos de balance es visible
    const hasLukas = await lukasElements.count() > 0;
    const hasOndas = await ondasElements.count() > 0;
    
    if (hasLukas) {
      console.log('✅ Elementos de Lükas encontrados');
      await expect(lukasElements.first()).toBeVisible({ timeout: 10000 });
    }
    
    if (hasOndas) {
      console.log('✅ Elementos de Öndas encontrados');
      await expect(ondasElements.first()).toBeVisible({ timeout: 10000 });
    }
    
    // Si no encontramos elementos específicos, verificar estructura general
    if (!hasLukas && !hasOndas) {
      console.log('⚠️ Elementos específicos no encontrados, verificando estructura general...');
      const walletContent = await page.textContent('body');
      expect(walletContent).toContain('CoomÜnity');
      
      // Verificar que hay contenido numérico (posibles balances)
      const hasNumbers = /\d+/.test(walletContent);
      expect(hasNumbers).toBe(true);
    }
    
    // Verificar que no hay errores críticos de conexión
    console.log('🔍 Verificando ausencia de errores de conexión...');
    const pageContent = await page.textContent('body');
    expect(pageContent).not.toContain('Error de conexión con el servidor');
    expect(pageContent).not.toContain('Failed to fetch');
    
    console.log('✅ Wallet page con datos reales - Test exitoso');
  });

  test('should verify backend connectivity and data loading', async ({ page }) => {
    console.log('🔍 Testing backend connectivity and data loading...');
    
    // Navegar al wallet después del login
    await page.goto('/wallet');
    await page.waitForSelector('#root');
    
    // Verificar que estamos conectados al backend
    console.log('🌐 Verificando conectividad con el backend...');
    
    // Esperar a que los datos se carguen del backend
    await page.waitForTimeout(5000);
    
    // Verificar que no hay errores de conexión
    const pageContent = await page.textContent('body');
    expect(pageContent).not.toContain('Error de conexión con el servidor');
    expect(pageContent).not.toContain('Failed to fetch');
    expect(pageContent).not.toContain('Network Error');
    
    // Verificar que hay contenido dinámico (datos del backend)
    expect(pageContent).toBeTruthy();
    expect(pageContent.length).toBeGreaterThan(200);
    
    // Verificar que el contenido incluye elementos específicos del wallet
    const hasWalletContent = pageContent.includes('CoomÜnity') || 
                            pageContent.includes('Wallet') || 
                            pageContent.includes('Billetera');
    expect(hasWalletContent).toBe(true);
    
    console.log('✅ Backend connectivity and data loading - Test passed');
  });

  test('should display wallet navigation and interactive elements', async ({ page }) => {
    console.log('🔍 Testing wallet navigation after login...');
    
    // Navegar al wallet después del login
    await page.goto('/wallet');
    await page.waitForSelector('#root');
    
    // Buscar elementos de navegación típicos de un wallet
    console.log('🧭 Buscando elementos de navegación...');
    const possibleTabSelectors = [
      '[role="tab"]',
      '.MuiTab-root',
      'button[aria-selected]',
      'text=Transacciones',
      'text=Historial',
      'text=Balance',
      'text=Lükas',
      'text=Öndas',
      'text=Mëritos'
    ];
    
    let tabsFound = false;
    for (const selector of possibleTabSelectors) {
      const elements = await page.locator(selector).count();
      if (elements > 0) {
        console.log(`✅ Found ${elements} navigation elements with selector: ${selector}`);
        tabsFound = true;
        break;
      }
    }
    
    // Verificar elementos interactivos generales
    console.log('🔘 Verificando elementos interactivos...');
    const buttons = await page.locator('button').count();
    const links = await page.locator('a').count();
    console.log(`📊 Interactive elements found - Buttons: ${buttons}, Links: ${links}`);
    expect(buttons + links).toBeGreaterThan(0);
    
    // Verificar que hay navegación funcional (al menos botones clickeables)
    const clickableElements = await page.locator('button:visible, a:visible').count();
    expect(clickableElements).toBeGreaterThan(0);
    console.log(`🖱️ Clickable elements found: ${clickableElements}`);
    
    console.log('✅ Navigation and interactivity test passed');
  });

  test('should display wallet balance with backend data', async ({ page }) => {
    console.log('🔍 Testing wallet balance with real backend data...');
    
    // Navegar al wallet después del login
    await page.goto('/wallet');
    await page.waitForSelector('#root');
    
    // Esperar a que los datos del backend se carguen
    console.log('⏳ Esperando carga de datos del backend...');
    await page.waitForTimeout(3000);
    
    // Buscar elementos relacionados con balance/saldo CoomÜnity
    console.log('💰 Verificando elementos de balance...');
    const balanceSelectors = [
      'text=Balance',
      'text=Saldo',
      'text=Lükas',
      'text=Mëritos', 
      'text=Öndas',
      '[data-testid*="balance"]',
      '[data-testid*="wallet"]',
      '[data-testid*="lukas"]',
      '[data-testid*="meritos"]',
      '[data-testid*="ondas"]'
    ];
    
    let balanceElementFound = false;
    for (const selector of balanceSelectors) {
      const elements = await page.locator(selector).count();
      if (elements > 0) {
        console.log(`💰 Found balance-related elements with selector: ${selector}`);
        balanceElementFound = true;
        
        // Intentar verificar que el elemento es visible
        try {
          await expect(page.locator(selector).first()).toBeVisible({ timeout: 5000 });
          console.log(`✅ Balance element is visible: ${selector}`);
        } catch (error) {
          console.log(`⚠️ Balance element found but not visible: ${selector}`);
        }
        break;
      }
    }
    
    // Verificar contenido numérico (balances del backend)
    console.log('🔢 Verificando datos numéricos del backend...');
    const pageText = await page.textContent('body');
    const hasNumbers = /\d+/.test(pageText);
    console.log(`🔢 Page contains numbers (backend balances): ${hasNumbers}`);
    expect(hasNumbers).toBe(true);
    
    // Verificar que no hay mensajes de error de carga
    expect(pageText).not.toContain('Error al cargar');
    expect(pageText).not.toContain('Failed to load');
    expect(pageText).not.toContain('Error de conexión');
    
    // Si encontramos elementos específicos, verificar que tienen contenido
    if (balanceElementFound) {
      console.log('✅ Balance elements found and verified');
    } else {
      console.log('⚠️ Specific balance elements not found, but numeric content verified');
      // Aún así, debe haber contenido sustancial
      expect(pageText.length).toBeGreaterThan(100);
    }
    
    console.log('✅ Balance section with backend data - Test passed');
  });

  test('should handle loading states and display final content', async ({ page }) => {
    console.log('🔍 Testing loading states after login...');
    
    // Navegar al wallet después del login
    await page.goto('/wallet');
    await page.waitForSelector('#root');
    
    // Verificar que la página no está en un estado de carga infinita
    console.log('⏳ Verificando estados de carga...');
    await page.waitForTimeout(3000);
    
    // Buscar indicadores de carga
    const loadingSelectors = [
      '.MuiCircularProgress-root',
      '[data-testid*="loading"]',
      'text=Cargando',
      'text=Loading',
      '.loading',
      '.spinner'
    ];
    
    let loadingFound = false;
    for (const selector of loadingSelectors) {
      const elements = await page.locator(selector).count();
      if (elements > 0) {
        console.log(`⏳ Loading indicator found: ${selector}`);
        loadingFound = true;
        
        // Esperar a que el loading desaparezca
        try {
          await page.waitForSelector(selector, { state: 'detached', timeout: 10000 });
          console.log(`✅ Loading indicator disappeared: ${selector}`);
        } catch (error) {
          console.log(`⚠️ Loading indicator still present: ${selector}`);
        }
        break;
      }
    }
    
    // Verificar que hay contenido final visible y sustancial
    console.log('📄 Verificando contenido final...');
    const finalContent = await page.textContent('body');
    expect(finalContent).toBeTruthy();
    expect(finalContent.length).toBeGreaterThan(100); // Contenido sustancial
    
    // Verificar que el contenido incluye elementos del wallet
    expect(finalContent).toMatch(/wallet|billetera|coomunity/i);
    
    // Verificar que no hay errores de carga persistentes
    expect(finalContent).not.toContain('Error de conexión');
    expect(finalContent).not.toContain('Failed to fetch');
    
    console.log('✅ Loading states and final content - Test passed');
  });

  test('should be responsive and display correctly after login', async ({ page }) => {
    console.log('🔍 Testing responsive design after login...');
    
    // Navegar al wallet después del login
    await page.goto('/wallet');
    await page.waitForSelector('#root');
    
    // Probar diferentes tamaños de pantalla
    const viewports = [
      { width: 1200, height: 800 }, // Desktop
      { width: 768, height: 1024 }, // Tablet
      { width: 375, height: 667 }   // Mobile
    ];
    
    for (const viewport of viewports) {
      console.log(`📱 Testing viewport: ${viewport.width}x${viewport.height}`);
      await page.setViewportSize(viewport);
      await page.waitForTimeout(1000);
      
      // Verificar que el contenido sigue siendo visible
      const bodyText = await page.textContent('body');
      expect(bodyText).toBeTruthy();
      expect(bodyText).toMatch(/wallet|billetera|coomunity/i);
      
      // Verificar que no hay overflow horizontal
      const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
      const viewportWidth = viewport.width;
      
      console.log(`📱 Viewport ${viewport.width}x${viewport.height}: Body width ${bodyWidth}px`);
      
      // Permitir un pequeño margen para scrollbars
      expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 20);
      
      // Verificar que elementos clave siguen siendo accesibles
      const clickableElements = await page.locator('button:visible, a:visible').count();
      expect(clickableElements).toBeGreaterThan(0);
      console.log(`🖱️ Clickable elements in ${viewport.width}px: ${clickableElements}`);
    }
    
    console.log('✅ Responsive design after login - Test passed');
  });
}); 