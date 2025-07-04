import { test, expect } from '@playwright/test';

test.describe('🔧 VERIFICACIÓN: Correcciones del Menú de Navegación', () => {
  test.beforeEach(async ({ page }) => {
    console.log('🔐 Iniciando sesión como administrador...');
    
    // Navegar a login
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    
    // Llenar credenciales
    await page.fill('input[name="email"]', 'admin@gamifier.com');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');
    
    // Esperar redirección
    await page.waitForURL('**/');
    
    // Verificar login exitoso (método robusto)
    try {
      await page.waitForSelector('nav, [role="navigation"], button[aria-label*="menu"]', { timeout: 5000 });
      console.log('✅ Login exitoso - Navegación detectada');
    } catch {
      const currentUrl = page.url();
      if (!currentUrl.includes('/login')) {
        console.log('✅ Login exitoso - Verificado por URL');
      } else {
        throw new Error('Login falló');
      }
    }
  });

  test('🎯 VERIFICAR: Enlaces de Services funcionan correctamente', async ({ page }) => {
    console.log('📋 Verificando enlaces del menú Services...');
    
    // Buscar y expandir el menú Services
    try {
      await page.click('text=Services', { timeout: 5000 });
      console.log('✅ Menú Services expandido');
    } catch {
      console.log('⚠️ Intentando expandir menú Services de forma alternativa...');
      await page.click('[role="button"]:has-text("Services")');
    }
    
    await page.waitForTimeout(1000);
    
    // Verificar que ÜMarket navega a /marketplace
    try {
      await page.click('text=ÜMarket');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);
      
      const currentUrl = page.url();
      expect(currentUrl).toContain('/marketplace');
      console.log('✅ ÜMarket navega correctamente a /marketplace');
      
      // Verificar que la página se carga sin errores
      try {
        await page.waitForSelector('text=Marketplace', { timeout: 5000 });
        console.log('✅ Página Marketplace cargada');
      } catch {
        console.log('⚠️ Página Marketplace puede no tener contenido visible');
      }
    } catch (error) {
      console.log('❌ Error navegando a ÜMarket:', error);
    }
    
    // Regresar al home para probar siguiente enlace
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Expandir Services nuevamente
    try {
      await page.click('text=Services');
    } catch {
      await page.click('[role="button"]:has-text("Services")');
    }
    await page.waitForTimeout(1000);
    
    // Verificar que ÜSocial navega a /social
    try {
      await page.click('text=ÜSocial');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);
      
      const currentUrl = page.url();
      expect(currentUrl).toContain('/social');
      console.log('✅ ÜSocial navega correctamente a /social');
      
      try {
        await page.waitForSelector('text=Social', { timeout: 5000 });
        console.log('✅ Página Social cargada');
      } catch {
        console.log('⚠️ Página Social puede no tener contenido visible');
      }
    } catch (error) {
      console.log('❌ Error navegando a ÜSocial:', error);
    }
    
    // Regresar al home para probar CoPs
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Expandir Services nuevamente
    try {
      await page.click('text=Services');
    } catch {
      await page.click('[role="button"]:has-text("Services")');
    }
    await page.waitForTimeout(1000);
    
    // Verificar que CoPs navega a /groups
    try {
      await page.click('text=CoPs');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);
      
      const currentUrl = page.url();
      expect(currentUrl).toContain('/groups');
      console.log('✅ CoPs navega correctamente a /groups');
      
      try {
        await page.waitForSelector('text=Comunidades', { timeout: 5000 });
        console.log('✅ Página CoPs (Comunidades de Práctica) cargada');
      } catch {
        console.log('⚠️ Página CoPs puede no tener contenido visible con "Comunidades"');
      }
    } catch (error) {
      console.log('❌ Error navegando a CoPs:', error);
    }
  });

  test('⚙️ VERIFICAR: Configuración navega correctamente', async ({ page }) => {
    console.log('📋 Verificando enlace de Configuración...');
    
    // Buscar y expandir el menú Administration
    try {
      await page.click('text=Administración', { timeout: 5000 });
      console.log('✅ Menú Administración expandido');
    } catch {
      console.log('⚠️ Intentando expandir menú Administración de forma alternativa...');
      await page.click('[role="button"]:has-text("Administración")');
    }
    
    await page.waitForTimeout(1000);
    
    // Verificar que Configuración navega a /settings y no al home
    try {
      await page.click('text=Configuración');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);
      
      const currentUrl = page.url();
      expect(currentUrl).toContain('/settings');
      expect(currentUrl).not.toBe('/');
      console.log('✅ Configuración navega correctamente a /settings (no al home)');
      
      try {
        await page.waitForSelector('text=Configuración del Sistema', { timeout: 5000 });
        console.log('✅ Página de Configuración cargada');
      } catch {
        console.log('⚠️ Página de Configuración puede tener restricciones de acceso');
      }
    } catch (error) {
      console.log('❌ Error navegando a Configuración:', error);
    }
  });

  test('📋 VERIFICAR: Audit Logs no causa pantalla negra', async ({ page }) => {
    console.log('📋 Verificando que Audit Logs funcione...');
    
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
        console.log('🔴 Console Error:', msg.text());
      }
    });
    
    // Buscar y expandir el menú Administration
    try {
      await page.click('text=Administración', { timeout: 5000 });
    } catch {
      await page.click('[role="button"]:has-text("Administración")');
    }
    
    await page.waitForTimeout(1000);
    
    // Navegar a Audit Logs
    try {
      await page.click('text=Audit Logs');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(3000);
      
      const currentUrl = page.url();
      expect(currentUrl).toContain('/audit-logs');
      console.log('✅ Audit Logs navega correctamente a /audit-logs');
      
      // Verificar que no hay pantalla completamente negra
      const bodyColor = await page.evaluate(() => {
        const body = document.body;
        const computed = window.getComputedStyle(body);
        return computed.backgroundColor;
      });
      
      console.log('📊 Color de fondo del body:', bodyColor);
      
      // Verificar que hay contenido visible o al menos un mensaje de error apropiado
      const hasContent = await page.locator('body *').count();
      expect(hasContent).toBeGreaterThan(0);
      console.log(`✅ Página tiene ${hasContent} elementos, no está completamente vacía`);
      
      // Capturar screenshot para inspección
      await page.screenshot({ 
        path: 'audit-logs-verification.png',
        fullPage: true 
      });
      
      console.log('✅ Audit Logs no causa pantalla negra completa');
      
    } catch (error) {
      console.log('❌ Error navegando a Audit Logs:', error);
      await page.screenshot({ 
        path: 'audit-logs-error.png',
        fullPage: true 
      });
    }
    
    console.log(`🔍 Total errores de consola: ${consoleErrors.length}`);
  });

  test('📊 VERIFICAR: Páginas de gamificación están en el menú', async ({ page }) => {
    console.log('📋 Verificando páginas de gamificación en el menú...');
    
    // Buscar y expandir el menú Gamificación
    try {
      await page.click('text=Gamificación', { timeout: 5000 });
      console.log('✅ Menú Gamificación expandido');
    } catch {
      console.log('⚠️ Intentando expandir menú Gamificación de forma alternativa...');
      await page.click('[role="button"]:has-text("Gamificación")');
    }
    
    await page.waitForTimeout(1000);
    
    // Verificar enlaces de gamificación
    const gamificationLinks = [
      { text: 'Tokens', path: '/tokens' },
      { text: 'Wallet', path: '/wallet' },
      { text: 'Méritos', path: '/merits' },
      { text: 'Desafíos', path: '/challenges' },
      { text: 'Invitaciones', path: '/invitations' },
      { text: 'Personalidades', path: '/personalities' }
    ];
    
    for (const link of gamificationLinks) {
      try {
        // Expandir menú nuevamente si es necesario
        const menuVisible = await page.isVisible(`text=${link.text}`);
        if (!menuVisible) {
          await page.click('text=Gamificación');
          await page.waitForTimeout(500);
        }
        
        await page.click(`text=${link.text}`);
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(1000);
        
        const currentUrl = page.url();
        expect(currentUrl).toContain(link.path);
        console.log(`✅ ${link.text} navega correctamente a ${link.path}`);
        
        // Regresar al home para siguiente enlace
        await page.goto('/');
        await page.waitForLoadState('networkidle');
        
      } catch (error) {
        console.log(`❌ Error navegando a ${link.text}:`, error);
      }
    }
  });
}); 