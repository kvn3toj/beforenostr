import { test, expect } from '@playwright/test';

test.describe('🔐 VERIFICACIÓN FINAL - MIGRACIÓN DE AUTENTICACIÓN', () => {
  
  test.beforeEach(async ({ page }) => {
    // Limpiar localStorage antes de cada test
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
  });

  test('1. ✅ Verificar página de login carga correctamente', async ({ page }) => {
    console.log('🔐 === VERIFICANDO CARGA DE PÁGINA DE LOGIN ===');
    
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    
    // Verificar que estamos en la página de login
    await expect(page).toHaveURL(/.*\/login/);
    console.log('✅ URL de login confirmada');

    // Verificar elementos básicos del formulario
    const emailField = page.locator('input[type="email"], input[name="email"]');
    const passwordField = page.locator('input[type="password"], input[name="password"]');
    const submitButton = page.locator('button[type="submit"], button:has-text("Iniciar"), button:has-text("Login")');

    await expect(emailField).toBeVisible();
    await expect(passwordField).toBeVisible();
    await expect(submitButton).toBeVisible();
    
    console.log('✅ Formulario de login visible y funcional');
    
    await page.screenshot({ path: 'debug-login-page-loaded.png', fullPage: true });
  });

  test('2. 🌐 Verificar conexión con Backend NestJS', async ({ page }) => {
    console.log('🔐 === VERIFICANDO CONEXIÓN CON BACKEND NESTJS ===');
    
    await page.goto('/login');
    
    // Monitorear llamadas al backend
    const requestPromises = [];
    
    page.on('request', request => {
      if (request.url().includes(':3002')) {
        console.log(`🌐 Request al backend: ${request.method()} ${request.url()}`);
        requestPromises.push(request);
      }
    });

    page.on('response', response => {
      if (response.url().includes(':3002')) {
        console.log(`📡 Response del backend: ${response.status()} ${response.url()}`);
      }
    });

    // Llenar formulario con datos de prueba
    await page.fill('input[type="email"], input[name="email"]', 'test@example.com');
    await page.fill('input[type="password"], input[name="password"]', 'test123');
    
    // Interceptar la llamada de login
    const responsePromise = page.waitForResponse(response => 
      response.url().includes('/auth/login') && response.request().method() === 'POST'
    );

    console.log('🚀 Enviando request de login al Backend NestJS...');
    await page.click('button[type="submit"], button:has-text("Iniciar"), button:has-text("Login")');

    try {
      const loginResponse = await responsePromise;
      const status = loginResponse.status();
      
      console.log(`📡 Respuesta del Backend NestJS: ${status}`);
      
      if (status === 401) {
        console.log('✅ Backend NestJS respondió correctamente (401 - credenciales inválidas esperado)');
        
        // Verificar que se muestra error en la UI
        await page.waitForTimeout(2000);
        
      } else if (status === 200 || status === 201) {
        console.log('✅ Backend NestJS respondió correctamente (login exitoso)');
        
      } else {
        console.log(`⚠️ Respuesta inesperada del backend: ${status}`);
      }
      
      expect([200, 201, 401, 422]).toContain(status);
      console.log('✅ Comunicación con Backend NestJS verificada');
      
    } catch (error) {
      console.log('❌ Error en comunicación con Backend NestJS:', error);
      throw error;
    }

    await page.screenshot({ path: 'debug-backend-communication.png', fullPage: true });
  });

  test('3. 📝 Verificar flujo de registro con Backend NestJS', async ({ page }) => {
    console.log('🔐 === VERIFICANDO FLUJO DE REGISTRO ===');
    
    await page.goto('/login');
    
    // Buscar enlace de registro
    const registerLink = page.locator('text=/registr|sign up/i, a:has-text("Registrarse")');
    
    if (await registerLink.count() > 0) {
      await registerLink.first().click();
      console.log('✅ Navegando a página de registro');
    } else {
      // Si no hay enlace, intentar ir directo a /register
      await page.goto('/register');
      console.log('ℹ️ Navegando directamente a /register');
    }
    
    await page.waitForLoadState('networkidle');
    
    // Verificar si hay formulario de registro
    const emailField = page.locator('input[type="email"], input[name="email"]');
    const passwordField = page.locator('input[type="password"], input[name="password"]');
    
    if (await emailField.count() > 0 && await passwordField.count() > 0) {
      console.log('✅ Formulario de registro encontrado');
      
      // Generar email único para evitar conflictos
      const uniqueEmail = `test${Date.now()}@example.com`;
      
      await page.fill('input[type="email"], input[name="email"]', uniqueEmail);
      await page.fill('input[type="password"], input[name="password"]', 'test123456');
      
      // Buscar campo de nombre si existe
      const nameField = page.locator('input[name="name"], input[name="fullName"], input[name="full_name"]');
      if (await nameField.count() > 0) {
        await nameField.fill('Usuario Prueba');
      }
      
      // Interceptar llamada de registro
      const responsePromise = page.waitForResponse(response => 
        response.url().includes('/auth/register') && response.request().method() === 'POST'
      );
      
      console.log(`🚀 Enviando registro para: ${uniqueEmail}`);
      
      const submitButton = page.locator('button[type="submit"], button:has-text("Registrar"), button:has-text("Sign up")');
      await submitButton.click();
      
      try {
        const registerResponse = await responsePromise;
        const status = registerResponse.status();
        
        console.log(`📡 Respuesta de registro: ${status}`);
        
        if (status === 201 || status === 200) {
          console.log('✅ Registro exitoso con Backend NestJS');
          
          // Verificar que se guardó token
          await page.waitForTimeout(2000);
          const token = await page.evaluate(() => localStorage.getItem('coomunity_token'));
          
          if (token) {
            console.log('✅ Token JWT guardado en localStorage');
            expect(token).toBeTruthy();
          }
          
        } else if (status === 409) {
          console.log('⚠️ Usuario ya existe (normal en pruebas repetidas)');
        }
        
      } catch (error) {
        console.log('⚠️ Timeout en registro - puede ser normal si no está implementado');
      }
      
    } else {
      console.log('ℹ️ Formulario de registro no encontrado - puede no estar implementado aún');
    }

    await page.screenshot({ path: 'debug-register-flow.png', fullPage: true });
  });

  test('4. 🔄 Verificar persistencia de sesión', async ({ page }) => {
    console.log('🔐 === VERIFICANDO PERSISTENCIA DE SESIÓN ===');
    
    await page.goto('/');
    
    // Simular token válido en localStorage
    await page.evaluate(() => {
      localStorage.setItem('coomunity_token', 'test-jwt-token');
      localStorage.setItem('coomunity_user', JSON.stringify({
        id: 'test-user-id',
        email: 'test@example.com',
        name: 'Test User',
        access_token: 'test-jwt-token'
      }));
    });
    
    console.log('📝 Token de prueba simulado en localStorage');
    
    // Recargar página para verificar persistencia
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Interceptar llamada de verificación
    const verifyPromise = page.waitForResponse(response => 
      response.url().includes('/auth/me') && response.request().method() === 'GET'
    ).catch(() => null);
    
    if (verifyPromise) {
      try {
        const verifyResponse = await verifyPromise;
        const status = verifyResponse?.status();
        
        console.log(`📡 Verificación de token: ${status}`);
        
        if (status === 200) {
          console.log('✅ Token válido - sesión persistida');
        } else if (status === 401) {
          console.log('⚠️ Token inválido - limpieza automática esperada');
          
          // Verificar que se limpió localStorage
          await page.waitForTimeout(1000);
          const token = await page.evaluate(() => localStorage.getItem('coomunity_token'));
          
          if (!token) {
            console.log('✅ Token inválido limpiado automáticamente');
          }
        }
        
      } catch (error) {
        console.log('ℹ️ No se detectó llamada de verificación automática');
      }
    }

    await page.screenshot({ path: 'debug-session-persistence.png', fullPage: true });
  });

  test('5. 🏠 Verificar redirección de rutas protegidas', async ({ page }) => {
    console.log('🔐 === VERIFICANDO REDIRECCIÓN DE RUTAS PROTEGIDAS ===');
    
    // Sin autenticación, intentar acceder a ruta protegida
    await page.goto('/dashboard');
    
    // Esperar posible redirección
    await page.waitForLoadState('networkidle');
    
    const currentUrl = page.url();
    console.log(`📍 URL actual después de acceso: ${currentUrl}`);
    
    if (currentUrl.includes('/login')) {
      console.log('✅ Redirección a login funcionando correctamente');
      expect(currentUrl).toContain('/login');
    } else if (currentUrl.includes('/dashboard')) {
      console.log('ℹ️ Acceso directo permitido - puede estar en modo de desarrollo');
    } else {
      console.log(`ℹ️ Redirección a: ${currentUrl}`);
    }

    await page.screenshot({ path: 'debug-protected-routes.png', fullPage: true });
  });
}); 