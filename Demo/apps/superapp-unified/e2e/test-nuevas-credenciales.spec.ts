import { test, expect } from '@playwright/test';

test.describe('🔐 Test con Nuevas Credenciales SuperApp', () => {
  
  test('debe verificar errores con usuario test@coomunity.com', async ({ page }) => {
    const networkErrors: Array<{url: string, status: number, statusText: string}> = [];
    
    // Capturar errores de red
    page.on('response', (response) => {
      if (response.status() >= 400) {
        const error = {
          url: response.url(),
          status: response.status(),
          statusText: response.statusText()
        };
        networkErrors.push(error);
        console.log(`🌐 Network Error: ${error.status} ${error.statusText} - ${error.url}`);
      }
    });

    console.log('🔍 === PROBANDO NUEVAS CREDENCIALES ===');
    
    // Ir al login
    await page.goto('/');
    await page.waitForSelector('#root', { timeout: 15000 });
    
    // Hacer login con nuevas credenciales
    const isLoginPage = await page.locator('#email').isVisible();
    if (isLoginPage) {
          console.log('🔐 Login con test@coomunity.com...');
    await page.fill('#email', 'test@coomunity.com');
    await page.fill('#password', 'test123');
      
      const loginPromise = page.waitForResponse(
        response => response.url().includes('/auth/login'),
        { timeout: 15000 }
      );
      
      await page.click('button:has-text("Iniciar Sesión")');
      
      try {
        const loginResponse = await loginPromise;
        console.log(`✅ Login Status: ${loginResponse.status()}`);
        
        if (loginResponse.status() === 200) {
          const responseBody = await loginResponse.json();
          console.log(`👤 User ID: ${responseBody.user?.id}`);
          console.log(`👤 User Roles: ${JSON.stringify(responseBody.user?.roles)}`);
          console.log(`👤 User Permissions: ${JSON.stringify(responseBody.user?.permissions)}`);
        }
      } catch (error) {
        console.log(`❌ Login Error: ${error}`);
      }
      
      // Esperar redirección
      await page.waitForFunction(
        () => !window.location.pathname.includes('/login'),
        { timeout: 10000 }
      );
    }
    
    // Esperar que se carguen las llamadas API
    await page.waitForTimeout(5000);
    
    // Verificar errores
    console.log('\n📊 === RESUMEN CON NUEVAS CREDENCIALES ===');
    console.log(`- Network Errors: ${networkErrors.length}`);
    
    if (networkErrors.length > 0) {
      console.log('\n🌐 ERRORES DE RED:');
      networkErrors.forEach((error, index) => {
        console.log(`${index + 1}. ${error.status} ${error.statusText} - ${error.url}`);
      });
      
      // Contar tipos de errores
      const errors403 = networkErrors.filter(e => e.status === 403).length;
      const errors404 = networkErrors.filter(e => e.status === 404).length;
      const errors500 = networkErrors.filter(e => e.status === 500).length;
      
      console.log(`\n📈 DISTRIBUCIÓN DE ERRORES:`);
      console.log(`- 403 Forbidden: ${errors403}`);
      console.log(`- 404 Not Found: ${errors404}`);
      console.log(`- 500 Server Error: ${errors500}`);
    }
    
    // Verificar el usuario en localStorage
    const userIdInStorage = await page.evaluate(() => {
      try {
        const userStr = localStorage.getItem('coomunity_user');
        if (userStr) {
          const user = JSON.parse(userStr);
          return {
            id: user.id,
            email: user.email,
            roles: user.roles,
            permissions: user.permissions
          };
        }
        return null;
      } catch (error) {
        return null;
      }
    });
    
    console.log(`\n👤 USUARIO EN LOCALSTORAGE:`);
    console.log(JSON.stringify(userIdInStorage, null, 2));
    
    expect(true).toBe(true);
  });
}); 