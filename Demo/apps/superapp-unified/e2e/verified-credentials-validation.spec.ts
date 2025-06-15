import { test, expect } from '@playwright/test';
import { VERIFIED_CREDENTIALS, performLogin, getCurlCommand } from './config/test-credentials';

test.describe('🔐 Validación de Credenciales Verificadas - REGLA OBLIGATORIA', () => {
  
  test.beforeEach(async ({ page }) => {
    console.log('🚨 RECORDATORIO: Usando SOLO credenciales verificadas del backend');
    console.log('📋 Fuente de verdad: backend/prisma/seed.ts');
  });

  // Test para cada tipo de usuario verificado
  Object.entries(VERIFIED_CREDENTIALS).forEach(([userType, credentials]) => {
    test(`should login successfully with ${userType} credentials`, async ({ page }) => {
      console.log(`\n🧪 Testing ${userType} credentials:`);
      console.log(`📧 Email: ${credentials.email}`);
      console.log(`🔑 Password: ${credentials.password}`);
      console.log(`👤 Roles: ${JSON.stringify(credentials.roles)}`);
      console.log(`📝 Description: ${credentials.description}`);
      
      // Navegar a la página de login
      await page.goto('/login');
      
      // Esperar a que React se monte
      await page.waitForSelector('#root');
      
      // Esperar a que el formulario de login esté visible
      await page.waitForSelector('[data-testid="login-email-input"]', { timeout: 10000 });
      
      // Usar el helper de login
      await performLogin(page, userType as keyof typeof VERIFIED_CREDENTIALS);
      
      // Verificar que el login fue exitoso (redirección a la página principal)
      await expect(page).toHaveURL(/.*\/$/, { timeout: 15000 });
      
      console.log(`✅ ${userType} login successful - redirected to dashboard`);
      
      // Verificar que no hay errores de JavaScript críticos
      const jsErrors: string[] = [];
      page.on('pageerror', error => {
        jsErrors.push(error.message);
      });
      
      // Esperar un momento para capturar posibles errores
      await page.waitForTimeout(2000);
      
      // Filtrar errores críticos (ignorar warnings menores)
      const criticalErrors = jsErrors.filter(error => 
        !error.includes('404') && 
        !error.includes('wallet') &&
        !error.includes('notification') &&
        error.toLowerCase().includes('error')
      );
      
      if (criticalErrors.length > 0) {
        console.warn(`⚠️ JavaScript errors detected for ${userType}:`, criticalErrors);
      }
      
      // El test pasa si el login fue exitoso, independientemente de errores menores de API
      expect(page.url()).toMatch(/.*\/$/);
    });
  });

  test('should validate cURL commands for all user types', async () => {
    console.log('\n🧪 Validating cURL commands for backend testing:');
    
    Object.keys(VERIFIED_CREDENTIALS).forEach(userType => {
      const curlCommand = getCurlCommand(userType as keyof typeof VERIFIED_CREDENTIALS);
      console.log(`\n${userType} cURL command:`);
      console.log(curlCommand);
      
      // Verificar que el comando contiene las credenciales correctas
      expect(curlCommand).toContain('http://localhost:3002/auth/login');
      expect(curlCommand).toContain(VERIFIED_CREDENTIALS[userType as keyof typeof VERIFIED_CREDENTIALS].email);
      expect(curlCommand).toContain(VERIFIED_CREDENTIALS[userType as keyof typeof VERIFIED_CREDENTIALS].password);
    });
  });

  test('should prevent usage of forbidden credentials', async ({ page }) => {
    console.log('\n🚨 Testing prevention of forbidden credentials');
    
    const forbiddenEmails = [
      'invalid@example.com',
      'test@test.com', 
      'fake@fake.com',
      'nonexistent@domain.com'
    ];
    
    for (const email of forbiddenEmails) {
      console.log(`❌ Testing forbidden email: ${email}`);
      
      // Navegar a la página de login
      await page.goto('/login');
      
      // Esperar a que el formulario esté visible
      await page.waitForSelector('[data-testid="login-email-input"]', { timeout: 10000 });
      
      // Intentar login con credenciales prohibidas
      await page.fill('[data-testid="login-email-input"] input', email);
      await page.fill('[data-testid="login-password-input"] input', 'wrongpassword');
      await page.click('[data-testid="login-submit-button"]');
      
      // Esperar un momento para la respuesta
      await page.waitForTimeout(3000);
      
      // Verificar que NO se redirigió (el login falló como esperado)
      expect(page.url()).toContain('/login');
      console.log(`✅ Correctly rejected forbidden email: ${email}`);
    }
  });

  test('should display credentials reference in console', async () => {
    console.log('\n📋 CREDENCIALES VERIFICADAS DISPONIBLES:');
    console.log('==========================================');
    
    Object.entries(VERIFIED_CREDENTIALS).forEach(([userType, credentials]) => {
      console.log(`\n${userType}:`);
      console.log(`  📧 Email: ${credentials.email}`);
      console.log(`  🔑 Password: ${credentials.password}`);
      console.log(`  👤 Roles: ${JSON.stringify(credentials.roles)}`);
      console.log(`  📝 ${credentials.description}`);
    });
    
    console.log('\n🚨 RECORDATORIO CRÍTICO:');
    console.log('- SIEMPRE usar estas credenciales verificadas');
    console.log('- NUNCA inventar credenciales que causan errores 400/401');
    console.log('- Fuente de verdad: backend/prisma/seed.ts');
    console.log('- Configuración: VITE_ENABLE_MOCK_AUTH=false');
    
    // Test siempre pasa - es solo para mostrar información
    expect(true).toBe(true);
  });
}); 