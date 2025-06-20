import { test, expect } from '@playwright/test';

test.describe('Routes Verification - Fixed Missing Routes', () => {
  test.beforeEach(async ({ page }) => {
    // Navegar a la página de login
    await page.goto('/login');
    
    // Realizar login con credenciales válidas
    await page.fill('[data-testid="login-email-input"] input', 'admin@gamifier.com');
    await page.fill('[data-testid="login-password-input"] input', 'admin123');
    await page.click('[data-testid="login-submit-button"]');
    
    // Esperar a que la autenticación se complete y redirija
    await page.waitForURL('**/', { timeout: 15000 });
    
    // Verificar que React se haya montado
    await page.waitForSelector('#root', { timeout: 10000 });
  });

  test('should load Analytics page correctly', async ({ page }) => {
    // Navegar a la página de Analytics
    await page.goto('/analytics');
    
    // Verificar que React se haya montado
    await page.waitForSelector('#root', { timeout: 10000 });
    
    // Verificar que la URL es correcta
    expect(page.url()).toContain('/analytics');
    
    // Verificar que no hay errores críticos de JavaScript
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error' && !msg.text().includes('404')) {
        errors.push(msg.text());
      }
    });
    
    // Esperar un momento para que se cargue el componente
    await page.waitForTimeout(2000);
    
    // Verificar que no hay errores críticos
    expect(errors.filter(error => 
      !error.includes('admin.jpg') && 
      !error.includes('404')
    )).toHaveLength(0);
  });

  test('should load Groups page correctly', async ({ page }) => {
    // Navegar a la página de Groups
    await page.goto('/groups');
    
    // Verificar que React se haya montado
    await page.waitForSelector('#root', { timeout: 10000 });
    
    // Verificar que la URL es correcta
    expect(page.url()).toContain('/groups');
    
    // Verificar que no hay errores críticos de JavaScript
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error' && !msg.text().includes('404')) {
        errors.push(msg.text());
      }
    });
    
    // Esperar un momento para que se cargue el componente
    await page.waitForTimeout(2000);
    
    // Verificar que no hay errores críticos
    expect(errors.filter(error => 
      !error.includes('admin.jpg') && 
      !error.includes('404')
    )).toHaveLength(0);
  });

  test('should load Challenges page correctly', async ({ page }) => {
    // Navegar a la página de Challenges
    await page.goto('/challenges');
    
    // Verificar que React se haya montado
    await page.waitForSelector('#root', { timeout: 10000 });
    
    // Verificar que la URL es correcta
    expect(page.url()).toContain('/challenges');
    
    // Verificar que no hay errores críticos de JavaScript
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error' && !msg.text().includes('404')) {
        errors.push(msg.text());
      }
    });
    
    // Esperar un momento para que se cargue el componente
    await page.waitForTimeout(2000);
    
    // Verificar que no hay errores críticos
    expect(errors.filter(error => 
      !error.includes('admin.jpg') && 
      !error.includes('404')
    )).toHaveLength(0);
  });

  test('should load Mundos page correctly', async ({ page }) => {
    // Navegar a la página de Mundos
    await page.goto('/mundos');
    
    // Verificar que React se haya montado
    await page.waitForSelector('#root', { timeout: 10000 });
    
    // Verificar que la URL es correcta
    expect(page.url()).toContain('/mundos');
    
    // Verificar que no hay errores críticos de JavaScript
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error' && !msg.text().includes('404')) {
        errors.push(msg.text());
      }
    });
    
    // Esperar un momento para que se cargue el componente
    await page.waitForTimeout(2000);
    
    // Verificar que no hay errores críticos
    expect(errors.filter(error => 
      !error.includes('admin.jpg') && 
      !error.includes('404')
    )).toHaveLength(0);
  });

  test('should verify all routes are protected and require authentication', async ({ page }) => {
    // Limpiar el localStorage para simular usuario no autenticado
    await page.evaluate(() => {
      localStorage.clear();
    });
    
    const routesToTest = ['/analytics', '/groups', '/challenges', '/mundos'];
    
    for (const route of routesToTest) {
      // Intentar acceder a la ruta sin autenticación
      await page.goto(route);
      
      // Debería redirigir a login
      await page.waitForURL('**/login', { timeout: 10000 });
      
      // Verificar que estamos en la página de login
      expect(page.url()).toContain('/login');
    }
  });
}); 