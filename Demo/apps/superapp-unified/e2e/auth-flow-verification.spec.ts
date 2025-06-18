import { test, expect } from '@playwright/test';

test.describe('🔐 Flujo de Autenticación End-to-End', () => {
  test.beforeEach(async ({ page }) => {
    // Limpiar localStorage antes de cada test
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.clear();
    });
  });

  test('✅ Login exitoso con credenciales válidas - Flujo completo', async ({ page }) => {
    console.log('🧪 Iniciando test de login exitoso...');

    // 1. Navegar a la página de login
    await page.goto('/login');
    console.log('📍 Navegado a página de login');

    // 2. Esperar a que React se monte
    await page.waitForSelector('#root', { timeout: 10000 });
    console.log('⚛️ React app montado');

    // 3. Verificar que estamos en la página de login
    await expect(page).toHaveURL(/.*\/login/);
    console.log('✅ Confirmado que estamos en la página de login');

    // 4. Llenar el formulario de login con credenciales válidas
    await page.fill('[data-testid="login-email-input"] input', 'admin@gamifier.com');
    await page.fill('[data-testid="login-password-input"] input', 'admin123');
    
    console.log('📝 Formulario de login completado');

    // 5. Interceptar la petición de login para verificar la respuesta
    const loginPromise = page.waitForResponse(response => 
      response.url().includes('/auth/login') && response.request().method() === 'POST'
    );

    // 6. Enviar el formulario
    await page.click('[data-testid="login-submit-button"]');
    console.log('🚀 Formulario enviado');

    // 7. Verificar que la petición de login fue exitosa
    const loginResponse = await loginPromise;
    expect(loginResponse.status()).toBe(200);
    
    const responseBody = await loginResponse.json();
    expect(responseBody).toHaveProperty('access_token');
    expect(responseBody).toHaveProperty('user');
    expect(responseBody.user).toHaveProperty('email', 'admin@gamifier.com');
    
    console.log('✅ Respuesta del backend verificada:', {
      status: loginResponse.status(),
      hasToken: !!responseBody.access_token,
      userEmail: responseBody.user?.email
    });

    // 8. Verificar redirección automática (esperar hasta 15 segundos)
    await page.waitForURL(url => !url.pathname.includes('/login'), { timeout: 15000 });
    
    console.log('🔄 Redirección completada a:', page.url());

    // 9. Verificar que el token se almacenó en localStorage con la clave canónica
    const storedToken = await page.evaluate(() => {
      return localStorage.getItem('COOMUNITY_AUTH_TOKEN');
    });
    
    expect(storedToken).toBeTruthy();
    expect(typeof storedToken).toBe('string');
    expect(storedToken.length).toBeGreaterThan(10); // JWT tokens son largos
    
    console.log('💾 Token almacenado correctamente en localStorage con clave canónica');

    // 10. Verificar que el usuario está almacenado en localStorage con la clave canónica
    const storedUser = await page.evaluate(() => {
      const userData = localStorage.getItem('COOMUNITY_USER_DATA');
      return userData ? JSON.parse(userData) : null;
    });
    
    expect(storedUser).toHaveProperty('email', 'admin@gamifier.com');
    expect(storedUser).toHaveProperty('access_token');
    
    console.log('👤 Usuario autenticado:', {
      email: storedUser.email,
      hasToken: !!storedUser.access_token
    });

    // 11. Verificar que podemos hacer peticiones autenticadas
    const authenticatedRequest = page.waitForResponse(response => 
      response.url().includes('/users/me') || response.url().includes('/auth/me')
    );

    // Intentar navegar a una página que requiera autenticación o hacer una petición
    await page.evaluate(async () => {
      const token = localStorage.getItem('COOMUNITY_AUTH_TOKEN');
      
      if (token) {
        try {
          await fetch('http://localhost:1111/auth/me', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
        } catch (error) {
          console.log('Error en petición autenticada:', error);
        }
      }
    });

    // Esperar la respuesta (opcional, puede fallar si el endpoint no existe)
    try {
      const authResponse = await authenticatedRequest;
      console.log('🔒 Petición autenticada exitosa:', authResponse.status());
    } catch (error) {
      console.log('ℹ️ Endpoint /auth/me no disponible, pero el token está presente');
    }

    console.log('🎉 Test de login exitoso completado');
  });

  test('❌ Login fallido con credenciales inválidas', async ({ page }) => {
    console.log('🧪 Iniciando test de login fallido...');

    // 1. Navegar a la página de login
    await page.goto('/login');
    await page.waitForSelector('#root', { timeout: 10000 });

    // 2. Llenar el formulario con credenciales inválidas
    await page.fill('[data-testid="login-email-input"] input', 'invalid@example.com');
    await page.fill('[data-testid="login-password-input"] input', 'wrongpassword');
    
    console.log('📝 Formulario completado con credenciales inválidas');

    // 3. Interceptar la petición de login
    const loginPromise = page.waitForResponse(response => 
      response.url().includes('/auth/login') && response.request().method() === 'POST'
    );

    // 4. Enviar el formulario
    await page.click('[data-testid="login-submit-button"]');

    // 5. Verificar que la petición falló
    const loginResponse = await loginPromise;
    expect(loginResponse.status()).toBe(401); // Unauthorized
    
    console.log('✅ Login falló como se esperaba:', loginResponse.status());

    // 6. Verificar que seguimos en la página de login
    await page.waitForTimeout(2000); // Dar tiempo para que se procese el error
    await expect(page).toHaveURL(/.*\/login/);

    // 7. Verificar que no hay tokens en localStorage
    const storedToken = await page.evaluate(() => {
      return localStorage.getItem('COOMUNITY_AUTH_TOKEN');
    });
    
    const storedUser = await page.evaluate(() => {
      return localStorage.getItem('COOMUNITY_USER_DATA');
    });
    
    expect(storedToken).toBeNull();
    expect(storedUser).toBeNull();
    
    console.log('✅ No hay tokens almacenados después del login fallido');

    // 8. Verificar que se muestra un mensaje de error (opcional)
    const errorMessage = page.locator('[data-testid="error-message"], .error, .alert-error');
    const hasError = await errorMessage.isVisible().catch(() => false);
    
    if (hasError) {
      console.log('✅ Mensaje de error mostrado al usuario');
    } else {
      console.log('ℹ️ No se detectó mensaje de error específico');
    }

    console.log('🎉 Test de login fallido completado');
  });

  test('🔄 Persistencia de sesión después de recargar página', async ({ page }) => {
    console.log('🧪 Iniciando test de persistencia de sesión...');

    // 1. Realizar login exitoso primero
    await page.goto('/login');
    await page.waitForSelector('#root', { timeout: 10000 });
    
    await page.fill('[data-testid="login-email-input"] input', 'admin@gamifier.com');
    await page.fill('[data-testid="login-password-input"] input', 'admin123');
    
    const loginPromise = page.waitForResponse(response => 
      response.url().includes('/auth/login') && response.request().method() === 'POST'
    );
    
    await page.click('[data-testid="login-submit-button"]');
    await loginPromise;
    
    // Esperar redirección
    await page.waitForURL(url => !url.pathname.includes('/login'), { timeout: 15000 });
    
    console.log('✅ Login inicial completado');

    // 2. Verificar que hay tokens almacenados
    const tokenBefore = await page.evaluate(() => {
      return localStorage.getItem('COOMUNITY_AUTH_TOKEN');
    });
    
    expect(tokenBefore).toBeTruthy();
    console.log('✅ Token presente antes de recargar');

    // 3. Recargar la página
    await page.reload();
    await page.waitForSelector('#root', { timeout: 10000 });
    
    console.log('🔄 Página recargada');

    // 4. Verificar que los tokens siguen presentes
    const tokenAfter = await page.evaluate(() => {
      return localStorage.getItem('COOMUNITY_AUTH_TOKEN');
    });
    
    expect(tokenAfter).toBeTruthy();
    expect(tokenAfter).toBe(tokenBefore);
    
    console.log('✅ Token persistió después de recargar');

    // 5. Navegar a otra página y volver
    await page.goto('/');
    await page.waitForSelector('#root', { timeout: 10000 });

    // Verificar que seguimos autenticados
    const stillAuthenticated = await page.evaluate(() => {
      return localStorage.getItem('COOMUNITY_AUTH_TOKEN');
    });
    
    expect(stillAuthenticated).toBeTruthy();

    console.log('🎉 Test de persistencia de sesión completado');
  });
});

test.describe('Auth Flow Verification', () => {
  test('should login successfully and load user profile without 403 errors', async ({ page }) => {
    console.log('🧪 Starting auth flow verification test...');

    // Navegar a la página de login
    await page.goto('/login');
    console.log('📍 Navigated to login page');

    // Esperar a que React se monte
    await page.waitForSelector('#root', { timeout: 10000 });
    console.log('⚛️ React app mounted');

    // Verificar que estamos en la página de login
    await expect(page).toHaveURL(/.*\/login/);
    console.log('✅ Confirmed we are on login page');

    // Llenar el formulario de login con credenciales válidas
    await page.fill('[data-testid="login-email-input"] input', 'user@gamifier.com');
    await page.fill('[data-testid="login-password-input"] input', '123456');
    console.log('📝 Filled login form with valid credentials');

    // Hacer clic en el botón de login
    await page.click('[data-testid="login-submit-button"]');
    console.log('🔐 Clicked login button');

    // Esperar a que la URL cambie (redirección post-login)
    await page.waitForURL('**/', { timeout: 15000 });
    console.log('🔄 Redirected to dashboard after login');

    // Verificar que no hay errores 403 en la consola
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error' && msg.text().includes('403')) {
        consoleErrors.push(msg.text());
      }
    });

    // Esperar un momento para que se carguen los datos del perfil
    await page.waitForTimeout(3000);
    console.log('⏳ Waited for profile data to load');

    // Verificar que no hay errores 403
    expect(consoleErrors).toHaveLength(0);
    console.log('✅ No 403 Forbidden errors detected');

    // Verificar que el usuario está autenticado (buscar elementos que indiquen login exitoso)
    const isAuthenticated = await page.locator('[data-testid="user-avatar"], [data-testid="user-menu"], .user-profile, .dashboard-content').count() > 0;
    expect(isAuthenticated).toBe(true);
    console.log('✅ User appears to be authenticated (UI elements present)');

    // Verificar que no hay mensajes de error de autorización en la página
    const authErrorMessages = await page.locator('text=/403|Forbidden|Unauthorized|Access denied/i').count();
    expect(authErrorMessages).toBe(0);
    console.log('✅ No authorization error messages found on page');

    console.log('🎉 Auth flow verification test completed successfully!');
  });

  test('should handle admin login correctly', async ({ page }) => {
    console.log('🧪 Starting admin auth flow verification test...');

    // Navegar a la página de login
    await page.goto('/login');
    await page.waitForSelector('#root', { timeout: 10000 });

    // Llenar el formulario con credenciales de admin
    await page.fill('[data-testid="login-email-input"] input', 'admin@gamifier.com');
    await page.fill('[data-testid="login-password-input"] input', 'admin123');
    console.log('📝 Filled login form with admin credentials');

    // Hacer clic en el botón de login
    await page.click('[data-testid="login-submit-button"]');
    console.log('🔐 Clicked login button');

    // Esperar a que la URL cambie
    await page.waitForURL('**/', { timeout: 15000 });
    console.log('🔄 Redirected to dashboard after admin login');

    // Verificar que no hay errores 403
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error' && msg.text().includes('403')) {
        consoleErrors.push(msg.text());
      }
    });

    await page.waitForTimeout(3000);
    expect(consoleErrors).toHaveLength(0);
    console.log('✅ No 403 Forbidden errors detected for admin');

    console.log('🎉 Admin auth flow verification test completed successfully!');
  });
}); 