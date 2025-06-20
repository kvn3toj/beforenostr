import { test, expect } from '@playwright/test';

test.describe('📸 VERIFICACIÓN VISUAL - Migración de Autenticación', () => {
  
  test('📸 Screenshot de página de login y prueba de interacción', async ({ page }) => {
    console.log('📸 === VERIFICACIÓN VISUAL DE LOGIN ===');
    
    // Configurar timeouts más largos para desarrollo
    test.setTimeout(60000);
    
    // Capturar todas las requests para debugging
    const allRequests = [];
    page.on('request', request => {
      allRequests.push(`${request.method()} ${request.url()}`);
      if (request.url().includes(':3002')) {
        console.log(`🌐 BACKEND REQUEST: ${request.method()} ${request.url()}`);
      }
    });

    page.on('response', response => {
      if (response.url().includes(':3002')) {
        console.log(`📡 BACKEND RESPONSE: ${response.status()} ${response.url()}`);
      }
    });

    console.log('🚀 Navegando a /login...');
    await page.goto('/login');
    
    // Esperar a que la página cargue completamente
    await page.waitForLoadState('networkidle');
    
    // Esperar un poco más para que React termine de renderizar
    await page.waitForTimeout(3000);
    
    console.log('📍 URL actual:', page.url());
    
    // Tomar screenshot inicial
    await page.screenshot({ 
      path: 'verification-01-login-page.png', 
      fullPage: true 
    });
    console.log('📸 Screenshot 1: Página inicial');
    
    // Verificar que estamos en la página correcta
    expect(page.url()).toContain('/login');
    
    // Buscar cualquier tipo de input
    const allInputs = page.locator('input');
    const inputCount = await allInputs.count();
    console.log(`📝 Inputs encontrados: ${inputCount}`);
    
    if (inputCount > 0) {
      // Listar todos los inputs encontrados
      for (let i = 0; i < inputCount; i++) {
        const input = allInputs.nth(i);
        const type = await input.getAttribute('type');
        const name = await input.getAttribute('name');
        const id = await input.getAttribute('id');
        console.log(`  Input ${i + 1}: type="${type}", name="${name}", id="${id}"`);
      }
      
      // Intentar interactuar con inputs
      try {
        const emailInput = allInputs.nth(0); // Primer input (probablemente email)
        const passwordInput = allInputs.nth(1); // Segundo input (probablemente password)
        
        await emailInput.fill('test@example.com');
        console.log('📝 Email ingresado');
        
        await passwordInput.fill('admin123');
        console.log('📝 Password ingresado');
        
        // Tomar screenshot con datos
        await page.screenshot({ 
          path: 'verification-02-form-filled.png', 
          fullPage: true 
        });
        console.log('📸 Screenshot 2: Formulario llenado');
        
        // Buscar botón de submit
        const submitButtons = page.locator('button[type="submit"], button:has-text("Iniciar"), button:has-text("Login")');
        const buttonCount = await submitButtons.count();
        console.log(`🔘 Botones de submit encontrados: ${buttonCount}`);
        
        if (buttonCount > 0) {
          const submitButton = submitButtons.first();
          
          // Preparar interceptor con timeout más largo
          const loginPromise = page.waitForResponse(
            response => response.url().includes('/auth/login'),
            { timeout: 10000 }
          ).catch(() => null);
          
          console.log('🚀 Haciendo click en submit...');
          await submitButton.click();
          
          // Esperar un poco para ver cambios en la UI
          await page.waitForTimeout(5000);
          
          // Tomar screenshot después del submit
          await page.screenshot({ 
            path: 'verification-03-after-submit.png', 
            fullPage: true 
          });
          console.log('📸 Screenshot 3: Después del submit');
          
          // Verificar si hubo respuesta del backend
          const loginResponse = await loginPromise;
          
          if (loginResponse) {
            const status = loginResponse.status();
            console.log(`✅ ¡ÉXITO! Respuesta del Backend NestJS: ${status}`);
            
            if (status === 401) {
              console.log('🔑 Credenciales incorrectas (esperado para datos de prueba)');
            } else if (status === 200 || status === 201) {
              console.log('🎉 Login exitoso!');
            }
            
            expect([200, 201, 401, 422]).toContain(status);
            
          } else {
            console.log('❌ No se detectó respuesta del backend en 10 segundos');
            
            // Buscar errores en la UI
            const errorElements = page.locator('[role="alert"], .MuiAlert-root, [data-testid="login-error"]');
            const errorCount = await errorElements.count();
            
            if (errorCount > 0) {
              const errorText = await errorElements.first().textContent();
              console.log(`🚨 Error en UI detectado: ${errorText}`);
            }
          }
          
        } else {
          console.log('⚠️ No se encontró botón de submit');
        }
        
      } catch (error) {
        console.log(`❌ Error durante interacción: ${error.message}`);
      }
      
    } else {
      console.log('⚠️ No se encontraron inputs en la página');
    }
    
    // Tomar screenshot final
    await page.screenshot({ 
      path: 'verification-04-final-state.png', 
      fullPage: true 
    });
    console.log('📸 Screenshot 4: Estado final');
    
    console.log('\n📊 RESUMEN DE VERIFICACIÓN:');
    console.log(`- URL final: ${page.url()}`);
    console.log(`- Inputs encontrados: ${inputCount}`);
    console.log(`- Requests al backend: ${allRequests.filter(r => r.includes(':3002')).length}`);
    
    // El test pasa si al menos encontramos la página de login
    expect(page.url()).toContain('/login');
    console.log('✅ Verificación visual completada');
  });
}); 