import { test, expect } from '@playwright/test';

test.describe('Fase A.7 - Verificación de Errores JavaScript en Grupos', () => {
  
  test('A.7.E1 - Verificar ausencia de errores JavaScript críticos', async ({ page }) => {
    const errors: string[] = [];
    
    // Escuchar errores de console
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    // Escuchar errores de página
    page.on('pageerror', (error) => {
      errors.push(`Page Error: ${error.message}`);
    });
    
    // Ir a la página de grupos
    await page.goto('http://localhost:3001/groups', { waitUntil: 'networkidle' });
    
    // Esperar a que la página se estabilice
    await page.waitForTimeout(3000);
    
    // Verificar que no hay errores de "Can't find variable"
    const criticalErrors = errors.filter(error => 
      error.includes("Can't find variable") || 
      error.includes("saving") ||
      error.includes("ReferenceError")
    );
    
    console.log('Errores detectados:', errors);
    console.log('Errores críticos:', criticalErrors);
    
    // Verificar que no hay errores críticos
    expect(criticalErrors).toHaveLength(0);
    
    console.log('✅ A.7.E1 - No se detectaron errores JavaScript críticos');
  });

  test('A.7.E2 - Verificar que la aplicación React monta correctamente', async ({ page }) => {
    await page.goto('http://localhost:3001/groups');
    
    // Esperar que React monte
    await page.waitForSelector('#root', { timeout: 10000 });
    
    // Verificar que hay contenido en el root
    const rootContent = await page.locator('#root').innerHTML();
    expect(rootContent.length).toBeGreaterThan(100);
    
    console.log('✅ A.7.E2 - Aplicación React monta correctamente');
  });

  test('A.7.E3 - Verificar navegación a grupos desde barra lateral', async ({ page }) => {
    await page.goto('http://localhost:3001/');
    
    // Esperar a que la página principal cargue
    await page.waitForSelector('#root', { timeout: 10000 });
    
    // Buscar el enlace de Grupos en la navegación
    const gruposLink = page.locator('a[href*="groups"], button:has-text("Grupos")').first();
    
    // Si existe el enlace, hacer click
    if (await gruposLink.count() > 0) {
      await gruposLink.click();
      
      // Verificar que llegamos a /groups
      await page.waitForURL('**/groups');
      expect(page.url()).toContain('/groups');
      
      console.log('✅ A.7.E3 - Navegación a grupos funciona correctamente');
    } else {
      console.log('⚠️ A.7.E3 - Enlace de Grupos no encontrado en navegación');
    }
  });
}); 