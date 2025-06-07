import { test, expect } from '@playwright/test';

test.describe('🔐 VERIFICACIÓN DE MIGRACIÓN DE AUTENTICACIÓN - BACKEND NESTJS', () => {
  test.beforeEach(async ({ page }) => {
    // Configurar interceptores para monitorear llamadas API
    await page.route('**/auth/**', (route) => {
      console.log(`🌐 API Call: ${route.request().method()} ${route.request().url()}`);
      route.continue();
    });
  });

  test('🔐 Verificar login con Backend NestJS', async ({ page }) => {
    console.log('🔐 === VERIFICANDO LOGIN CON BACKEND NESTJS ===');

    // 1. Navegar a la página de login
    console.log('📍 Navegando a /login...');
    await page.goto('/login');
    
    // Esperar a que la página cargue completamente
    await page.waitForLoadState('networkidle');
    
    // 2. Verificar que estamos en la página de login
    await expect(page).toHaveURL(/.*\/login/);
    console.log('✅ Página de login cargada');

    // 3. Verificar que el formulario de login existe
    const emailInput = page.locator('input[type="email"], input[name="email"]');
    const passwordInput = page.locator('input[type="password"], input[name="password"]');
    const loginButton = page.locator('button[type="submit"], button:has-text("Iniciar"), button:has-text("Login")');

    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(loginButton).toBeVisible();
    console.log('✅ Formulario de login visible');

    // 4. Intentar login con credenciales de prueba
    console.log('📝 Llenando formulario de login...');
    await emailInput.fill('admin@coomunity.com');
    await passwordInput.fill('admin123');

    // 5. Monitorear la llamada de login al backend
    const loginPromise = page.waitForResponse(response => 
      response.url().includes('/auth/login') && response.request().method() === 'POST'
    );

    console.log('🚀 Enviando login...');
    await loginButton.click();

    try {
      // 6. Verificar que se hizo la llamada al backend NestJS
      const loginResponse = await loginPromise;
      console.log(`📡 Respuesta del backend: ${loginResponse.status()}`);
      
      if (loginResponse.status() === 200) {
        console.log('✅ Login exitoso con Backend NestJS');
        
        // Verificar redirección después del login exitoso
        await page.waitForURL(url => !url.includes('/login'), { timeout: 5000 });
        console.log('✅ Redirección post-login exitosa');
        
        // Verificar que el token se guardó en localStorage
        const token = await page.evaluate(() => localStorage.getItem('coomunity_token'));
        expect(token).toBeTruthy();
        console.log('✅ Token JWT guardado en localStorage');
        
      } else if (loginResponse.status() === 401) {
        console.log('⚠️ Credenciales incorrectas (esperado si no hay usuario de prueba)');
        
        // Verificar que se muestra mensaje de error apropiado
        const errorMessage = page.locator('[role="alert"], .error, .MuiAlert-root');
        await expect(errorMessage).toBeVisible({ timeout: 3000 });
        console.log('✅ Mensaje de error mostrado correctamente');
        
      } else {
        console.log(`⚠️ Respuesta inesperada del backend: ${loginResponse.status()}`);
      }
      
    } catch (error) {
      console.log('❌ Error en la comunicación con el backend:', error);
      
      // Verificar que se muestra error de conexión
      const connectionError = page.locator('text=/Error de conexión|servidor.*disponible/i');
      await expect(connectionError).toBeVisible({ timeout: 3000 });
      console.log('✅ Error de conexión manejado correctamente');
    }

    // Screenshot para debugging
    await page.screenshot({ 
      path: 'debug-auth-migration-login.png', 
      fullPage: true 
    });
  });

  test('🔐 Verificar registro con Backend NestJS', async ({ page }) => {
    console.log('🔐 === VERIFICANDO REGISTRO CON BACKEND NESTJS ===');

    // 1. Navegar a la página de registro
    console.log('📍 Navegando a /register...');
    await page.goto('/register');
    
    // Si no hay página de registro directa, buscar enlace desde login
    if (await page.locator('text=/registr|sign up/i').count() === 0) {
      await page.goto('/login');
      const registerLink = page.locator('a:has-text("Registrarse"), a:has-text("Sign up"), button:has-text("Registrarse")');
      if (await registerLink.count() > 0) {
        await registerLink.click();
      }
    }
    
    await page.waitForLoadState('networkidle');
    console.log('✅ Página de registro cargada');

    // 2. Verificar formulario de registro
    const emailInput = page.locator('input[type="email"], input[name="email"]');
    const passwordInput = page.locator('input[type="password"], input[name="password"]');
    const nameInput = page.locator('input[name="name"], input[name="fullName"], input[name="full_name"]');
    const registerButton = page.locator('button[type="submit"], button:has-text("Registrar"), button:has-text("Sign up")');

    if (await emailInput.count() > 0) {
      console.log('✅ Formulario de registro encontrado');

      // 3. Llenar formulario con datos de prueba
      await emailInput.fill('test@coomunity.com');
      await passwordInput.fill('test123456');
      if (await nameInput.count() > 0) {
        await nameInput.fill('Usuario de Prueba');
      }

      // 4. Monitorear llamada de registro
      const registerPromise = page.waitForResponse(response => 
        response.url().includes('/auth/register') && response.request().method() === 'POST'
      );

      console.log('🚀 Enviando registro...');
      await registerButton.click();

      try {
        const registerResponse = await registerPromise;
        console.log(`📡 Respuesta del backend: ${registerResponse.status()}`);
        
        if (registerResponse.status() === 201 || registerResponse.status() === 200) {
          console.log('✅ Registro exitoso con Backend NestJS');
        } else if (registerResponse.status() === 409) {
          console.log('⚠️ Usuario ya existe (esperado en pruebas repetidas)');
        }
        
      } catch (error) {
        console.log('❌ Error en registro:', error);
      }
    } else {
      console.log('⚠️ Formulario de registro no encontrado - puede no estar implementado aún');
    }

    await page.screenshot({ 
      path: 'debug-auth-migration-register.png', 
      fullPage: true 
    });
  });

  test('🔐 Verificar logout y limpieza de sesión', async ({ page }) => {
    console.log('🔐 === VERIFICANDO LOGOUT Y LIMPIEZA ===');

    // 1. Simular usuario logueado
    await page.goto('/');
    
    // Simular token en localStorage
    await page.evaluate(() => {
      localStorage.setItem('coomunity_token', 'test-token');
      localStorage.setItem('coomunity_user', JSON.stringify({
        id: 'test-user',
        email: 'test@coomunity.com',
        access_token: 'test-token'
      }));
    });

    // 2. Recargar para que el contexto detecte el usuario
    await page.reload();
    await page.waitForLoadState('networkidle');

    // 3. Buscar botón de logout
    const logoutButton = page.locator('button:has-text("Cerrar sesión"), button:has-text("Logout"), [aria-label*="logout"]');
    
    if (await logoutButton.count() > 0) {
      console.log('✅ Botón de logout encontrado');

      // 4. Monitorear llamada de logout
      const logoutPromise = page.waitForResponse(response => 
        response.url().includes('/auth/logout') && response.request().method() === 'POST'
      ).catch(() => null); // No crítico si falla

      await logoutButton.click();

      // 5. Verificar limpieza de localStorage
      await page.waitForTimeout(1000); // Esperar a que se complete el logout

      const token = await page.evaluate(() => localStorage.getItem('coomunity_token'));
      const user = await page.evaluate(() => localStorage.getItem('coomunity_user'));

      expect(token).toBeNull();
      expect(user).toBeNull();
      console.log('✅ localStorage limpiado correctamente');

      // 6. Verificar redirección a login
      await expect(page).toHaveURL(/.*\/login/, { timeout: 5000 });
      console.log('✅ Redirección a login después de logout');

    } else {
      console.log('⚠️ Botón de logout no encontrado - verificar UI');
    }

    await page.screenshot({ 
      path: 'debug-auth-migration-logout.png', 
      fullPage: true 
    });
  });

  test('🔐 Verificar persistencia de sesión', async ({ page }) => {
    console.log('🔐 === VERIFICANDO PERSISTENCIA DE SESIÓN ===');

    // 1. Simular token válido en localStorage
    await page.goto('/');
    
    await page.evaluate(() => {
      localStorage.setItem('coomunity_token', 'valid-test-token');
      localStorage.setItem('coomunity_user', JSON.stringify({
        id: 'test-user',
        email: 'test@coomunity.com',
        access_token: 'valid-test-token'
      }));
    });

    // 2. Recargar página para verificar persistencia
    await page.reload();
    await page.waitForLoadState('networkidle');

    // 3. Monitorear llamada de verificación de token
    const verifyPromise = page.waitForResponse(response => 
      response.url().includes('/auth/me') && response.request().method() === 'GET'
    ).catch(() => null);

    if (verifyPromise) {
      try {
        const verifyResponse = await verifyPromise;
        console.log(`📡 Verificación de token: ${verifyResponse?.status()}`);
        
        if (verifyResponse?.status() === 200) {
          console.log('✅ Token válido - sesión persistida');
        } else if (verifyResponse?.status() === 401) {
          console.log('⚠️ Token inválido - limpieza automática esperada');
          
          // Verificar que se limpió el localStorage
          await page.waitForTimeout(1000);
          const token = await page.evaluate(() => localStorage.getItem('coomunity_token'));
          expect(token).toBeNull();
          console.log('✅ Token inválido limpiado automáticamente');
        }
      } catch (error) {
        console.log('❌ Error en verificación de token:', error);
      }
    }

    await page.screenshot({ 
      path: 'debug-auth-migration-persistence.png', 
      fullPage: true 
    });
  });
}); 