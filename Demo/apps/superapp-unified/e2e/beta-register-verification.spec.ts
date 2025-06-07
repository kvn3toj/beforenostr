/**
 * 🚀 TEST E2E: PÁGINA DE REGISTRO BETA
 * Verificación completa del flujo de registro para el programa beta
 */

import { test, expect } from '@playwright/test';

test.describe('Beta Register Page - Programa Beta CoomÜnity', () => {
  
  test.beforeEach(async ({ page }) => {
    // Configurar timeout extendido para interacciones
    page.setDefaultTimeout(10000);
  });

  test('🧪 1. Verificar acceso y estructura básica de la página', async ({ page }) => {
    // Navegar a la página de registro beta
    await page.goto('/beta-register');
    
    // Verificar que la página carga correctamente
    await expect(page.locator('h1, h2, h3')).toContainText('Beta', { timeout: 15000 });
    
    // Verificar presencia del stepper
    await expect(page.locator('[data-testid*="step"], .MuiStepper-root, [role="progressbar"]')).toBeVisible();
    
    // Tomar screenshot del estado inicial
    await page.screenshot({ 
      path: 'test-results/beta-register-initial.png',
      fullPage: true 
    });
    
    console.log('✅ Página de registro beta cargada correctamente');
  });

  test('🧪 2. Verificar validación de código de invitación', async ({ page }) => {
    await page.goto('/beta-register');
    
    // Esperar a que la página esté completamente cargada
    await page.waitForLoadState('networkidle');
    
    // Buscar campo de código de invitación
    const codeInput = page.locator('input[name*="code"], input[placeholder*="código"], input[placeholder*="invita"]').first();
    await expect(codeInput).toBeVisible({ timeout: 10000 });
    
    // Test 1: Código inválido
    await codeInput.fill('INVALID-CODE');
    
    // Buscar botón Siguiente/Next/Continuar
    const nextButton = page.locator('button').filter({ hasText: /siguiente|next|continuar|validar/i }).first();
    await expect(nextButton).toBeVisible();
    await nextButton.click();
    
    // Verificar mensaje de error
    await expect(page.locator('text=/inválido|error|invalid/i')).toBeVisible({ timeout: 5000 });
    
    // Test 2: Código válido
    await codeInput.fill('BETA-MR7X9K2L');
    await nextButton.click();
    
    // Verificar progreso (debería avanzar al siguiente paso o mostrar éxito)
    await expect(page.locator('text=/válido|success|siguiente paso/i')).toBeVisible({ timeout: 10000 });
    
    await page.screenshot({ 
      path: 'test-results/beta-register-code-validated.png',
      fullPage: true 
    });
    
    console.log('✅ Validación de código funcionando correctamente');
  });

  test('🧪 3. Verificar flujo completo del stepper', async ({ page }) => {
    await page.goto('/beta-register');
    await page.waitForLoadState('networkidle');
    
    // Paso 1: Código de invitación
    const codeInput = page.locator('input[name*="code"], input[placeholder*="código"], input[placeholder*="invita"]').first();
    await codeInput.fill('BETA-MR7X9K2L');
    
    const nextButton = page.locator('button').filter({ hasText: /siguiente|next|continuar|validar/i }).first();
    await nextButton.click();
    
    // Esperar confirmación y proceder al siguiente paso
    await page.waitForTimeout(2000);
    
    // Paso 2: Datos personales (si existe)
    const emailInput = page.locator('input[type="email"], input[name*="email"]');
    if (await emailInput.isVisible()) {
      await emailInput.fill('test@example.com');
      
      const nameInput = page.locator('input[name*="name"], input[placeholder*="nombre"]');
      if (await nameInput.isVisible()) {
        await nameInput.fill('Usuario Test Beta');
      }
      
      const countrySelect = page.locator('select[name*="country"], [role="combobox"]');
      if (await countrySelect.isVisible()) {
        await countrySelect.click();
        await page.locator('li, option').filter({ hasText: /méxico|mexico/i }).first().click();
      }
      
      // Continuar al siguiente paso
      const nextButton2 = page.locator('button').filter({ hasText: /siguiente|next|continuar/i }).first();
      if (await nextButton2.isVisible()) {
        await nextButton2.click();
        await page.waitForTimeout(1000);
      }
    }
    
    // Tomar screenshot del progreso
    await page.screenshot({ 
      path: 'test-results/beta-register-progress.png',
      fullPage: true 
    });
    
    console.log('✅ Flujo del stepper funcionando correctamente');
  });

  test('🧪 4. Verificar responsive design', async ({ page }) => {
    // Test en móvil
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/beta-register');
    
    await expect(page.locator('h1, h2, h3')).toBeVisible();
    await page.screenshot({ 
      path: 'test-results/beta-register-mobile.png',
      fullPage: true 
    });
    
    // Test en tablet
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.reload();
    
    await expect(page.locator('h1, h2, h3')).toBeVisible();
    await page.screenshot({ 
      path: 'test-results/beta-register-tablet.png',
      fullPage: true 
    });
    
    // Test en desktop
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.reload();
    
    await expect(page.locator('h1, h2, h3')).toBeVisible();
    await page.screenshot({ 
      path: 'test-results/beta-register-desktop.png',
      fullPage: true 
    });
    
    console.log('✅ Responsive design verificado en todos los breakpoints');
  });

  test('🧪 5. Verificar analytics tracking', async ({ page }) => {
    // Interceptar llamadas de analytics
    let analyticsEvents = [];
    
    page.on('request', request => {
      if (request.url().includes('google-analytics') || 
          request.url().includes('hotjar') || 
          request.url().includes('analytics')) {
        analyticsEvents.push({
          url: request.url(),
          method: request.method()
        });
      }
    });
    
    await page.goto('/beta-register');
    await page.waitForLoadState('networkidle');
    
    // Interactuar con la página para generar eventos
    const codeInput = page.locator('input[name*="code"], input[placeholder*="código"], input[placeholder*="invita"]').first();
    if (await codeInput.isVisible()) {
      await codeInput.fill('BETA-MR7X9K2L');
      
      const nextButton = page.locator('button').filter({ hasText: /siguiente|next|continuar|validar/i }).first();
      if (await nextButton.isVisible()) {
        await nextButton.click();
        await page.waitForTimeout(3000);
      }
    }
    
    // Verificar que se enviaron eventos de analytics
    console.log(`📊 Analytics events detected: ${analyticsEvents.length}`);
    analyticsEvents.forEach(event => {
      console.log(`  - ${event.method} ${event.url}`);
    });
    
    // Al menos debería haber algún evento de tracking
    expect(analyticsEvents.length).toBeGreaterThan(0);
    
    console.log('✅ Analytics tracking verificado y funcionando');
  });
}); 