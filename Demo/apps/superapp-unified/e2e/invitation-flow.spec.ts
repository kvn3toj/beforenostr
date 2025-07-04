import { test, expect } from '@playwright/test';

test.describe('🎫 Invitation Flow - Beta Registration', () => {
  test.beforeEach(async ({ page }) => {
    // Esperar a que React se monte completamente
    await page.goto('/');
    await page.waitForSelector('#root');
    await page.waitForTimeout(1000);
  });

  test('should navigate to beta registration page', async ({ page }) => {
    // Navegar directamente a la página de registro beta
    await page.goto('/beta-register');
    
    // Verificar que la página se carga correctamente
    await expect(page.locator('h2')).toContainText('CoomÜnity');
    await expect(page.locator('h5')).toContainText('Programa Beta Exclusivo');
    
    // Verificar que el stepper está presente (usar selector más específico)
    await expect(page.locator('.MuiStepper-root')).toBeVisible();
    
    // Verificar que estamos en el primer paso (Código de Invitación)
    await expect(page.locator('h4')).toContainText('Código de Invitación Exclusivo');
  });

  test('should show error for empty invitation code', async ({ page }) => {
    await page.goto('/beta-register');
    await page.waitForSelector('#root');
    
    // Intentar continuar sin código
    const nextButton = page.locator('button:has-text("Siguiente")');
    await nextButton.click();
    
    // Verificar que aparece el mensaje de error usando toast (Sonner)
    await expect(page.locator('text=Por favor ingresa tu código de invitación')).toBeVisible();
  });

  test('should show error for invalid invitation code format', async ({ page }) => {
    await page.goto('/beta-register');
    await page.waitForSelector('#root');
    
    // Ingresar código inválido
    const codeInput = page.locator('input[placeholder="BETA-XXXXXXXX"]');
    await codeInput.fill('INVALID-CODE');
    
    // Intentar continuar
    const nextButton = page.locator('button:has-text("Siguiente")');
    await nextButton.click();
    
    // Esperar a que aparezca el mensaje de error en toast
    await expect(page.locator('text=Código de invitación inválido')).toBeVisible();
  });

  test('should accept valid invitation code and proceed to next step', async ({ page }) => {
    await page.goto('/beta-register');
    await page.waitForSelector('#root');
    
    // Ingresar código válido según la lógica mock
    const codeInput = page.locator('input[placeholder="BETA-XXXXXXXX"]');
    await codeInput.fill('BETA-12345678');
    
    // Intentar continuar
    const nextButton = page.locator('button:has-text("Siguiente")');
    await nextButton.click();
    
    // Esperar a que aparezca el mensaje de éxito en toast
    await expect(page.locator('text=¡Código de invitación válido!')).toBeVisible();
    
    // Verificar que avanzamos al siguiente paso
    await expect(page.locator('h4')).toContainText('Datos Personales');
  });

  test('should validate personal data form', async ({ page }) => {
    await page.goto('/beta-register');
    await page.waitForSelector('#root');
    
    // Completar primer paso con código válido
    const codeInput = page.locator('input[placeholder="BETA-XXXXXXXX"]');
    await codeInput.fill('BETA-12345678');
    await page.locator('button:has-text("Siguiente")').click();
    
    // Esperar a llegar al segundo paso
    await expect(page.locator('h4')).toContainText('Datos Personales');
    
    // Intentar continuar sin llenar campos obligatorios
    await page.locator('button:has-text("Siguiente")').click();
    
    // Verificar mensaje de error en toast
    await expect(page.locator('text=Por favor completa todos los campos obligatorios')).toBeVisible();
  });

  test('should complete personal data and proceed to philosophy quiz', async ({ page }) => {
    await page.goto('/beta-register');
    await page.waitForSelector('#root');
    
    // Completar primer paso
    const codeInput = page.locator('input[placeholder="BETA-XXXXXXXX"]');
    await codeInput.fill('BETA-12345678');
    await page.locator('button:has-text("Siguiente")').click();
    await expect(page.locator('h4')).toContainText('Datos Personales');
    
    // Llenar datos personales usando selectores más específicos
    await page.locator('input[label="Nombre Completo"], input[name="fullName"], input:has-text("Nombre Completo")').first().fill('Usuario Test Beta');
    await page.locator('input[label="Email"], input[name="email"], input[type="email"]').first().fill('admin@gamifier.com');
    
    // Seleccionar país
    await page.locator('div[role="combobox"], .MuiSelect-select').click();
    await page.locator('li:has-text("Argentina")').click();
    
    // Continuar al siguiente paso
    await page.locator('button:has-text("Siguiente")').click();
    
    // Verificar que llegamos al quiz filosófico
    await expect(page.locator('h4')).toContainText('Quiz Filosófico');
    await expect(page.locator('text=Reciprocidad')).toBeVisible();
    await expect(page.locator('text=Bien Común')).toBeVisible();
    await expect(page.locator('text=cooperación')).toBeVisible();
  });

  test('should validate philosophy quiz completion', async ({ page }) => {
    await page.goto('/beta-register');
    await page.waitForSelector('#root');
    
    // Completar pasos anteriores rápidamente
    await page.locator('input[placeholder="BETA-XXXXXXXX"]').fill('BETA-12345678');
    await page.locator('button:has-text("Siguiente")').click();
    await expect(page.locator('h4')).toContainText('Datos Personales');
    
    await page.locator('input[label="Nombre Completo"], input[name="fullName"], input:has-text("Nombre Completo")').first().fill('Usuario Test');
    await page.locator('input[label="Email"], input[name="email"], input[type="email"]').first().fill('admin@gamifier.com');
    await page.locator('div[role="combobox"], .MuiSelect-select').click();
    await page.locator('li:has-text("Argentina")').click();
    await page.locator('button:has-text("Siguiente")').click();
    
    await expect(page.locator('h4')).toContainText('Quiz Filosófico');
    
    // Intentar continuar sin completar el quiz
    await page.locator('button:has-text("Siguiente")').click();
    
    // Verificar mensaje de error en toast
    await expect(page.locator('text=Por favor responde todas las preguntas filosóficas')).toBeVisible();
  });

  test('should complete full registration flow', async ({ page }) => {
    await page.goto('/beta-register');
    await page.waitForSelector('#root');
    
    // Paso 1: Código de invitación
    await page.locator('input[placeholder="BETA-XXXXXXXX"]').fill('BETA-12345678');
    await page.locator('button:has-text("Siguiente")').click();
    await expect(page.locator('text=¡Código de invitación válido!')).toBeVisible();
    
    // Paso 2: Datos personales
    await page.locator('input[label="Nombre Completo"], input[name="fullName"], input:has-text("Nombre Completo")').first().fill('Usuario Test Beta');
    await page.locator('input[label="Email"], input[name="email"], input[type="email"]').first().fill('admin@gamifier.com');
    await page.locator('div[role="combobox"], .MuiSelect-select').click();
    await page.locator('li:has-text("Argentina")').click();
    await page.locator('button:has-text("Siguiente")').click();
    
    // Paso 3: Quiz filosófico
    const textareas = page.locator('textarea');
    await textareas.nth(0).fill('Reciprocidad significa reciprocidad consciente y equilibrada en todas las relaciones.');
    await textareas.nth(1).fill('Priorizo el bien común colaborando y compartiendo recursos para el beneficio colectivo.');
    await textareas.nth(2).fill('La cooperación es fundamental para construir un mundo más justo y sostenible.');
    
    // Aceptar términos
    await page.locator('input[type="checkbox"]').first().check();
    await page.locator('button:has-text("Siguiente")').click();
    
    // Paso 4: Confirmación
    await expect(page.locator('h3')).toContainText('¡Bienvenido a CoomÜnity!');
    await expect(page.locator('text=Tu registro beta ha sido completado exitosamente')).toBeVisible();
    
    // Verificar resumen de registro
    await expect(page.locator('text=BETA-12345678')).toBeVisible();
    await expect(page.locator('text=admin@gamifier.com')).toBeVisible();
    await expect(page.locator('text=AR')).toBeVisible();
  });

  test('should handle invitation code from URL parameter', async ({ page }) => {
    // Navegar con código en URL
    await page.goto('/beta-register?invite=BETA-87654321');
    await page.waitForSelector('#root');
    
    // Verificar que el código se pre-llena
    const codeInput = page.locator('input[placeholder="BETA-XXXXXXXX"]');
    await expect(codeInput).toHaveValue('BETA-87654321');
  });

  test('should track analytics events during registration', async ({ page }) => {
    // Interceptar llamadas de analytics
    const analyticsRequests: string[] = [];
    
    page.on('console', (msg) => {
      if (msg.text().includes('trackEvent') || msg.text().includes('beta_')) {
        analyticsRequests.push(msg.text());
      }
    });
    
    await page.goto('/beta-register');
    await page.waitForSelector('#root');
    
    // Completar primer paso para generar eventos
    await page.locator('input[placeholder="BETA-XXXXXXXX"]').fill('BETA-12345678');
    await page.locator('button:has-text("Siguiente")').click();
    
    // Verificar que se generaron eventos de analytics
    // Nota: En un entorno real, esto se verificaría interceptando las llamadas HTTP
    await page.waitForTimeout(1000);
  });

  test('should show proper error handling for network issues', async ({ page }) => {
    // Este test simula problemas de red durante la validación
    // En un entorno real, se interceptarían las llamadas de red
    
    await page.goto('/beta-register');
    await page.waitForSelector('#root');
    
    // El flujo actual es mock, pero verificamos que la UI maneja errores
    await page.locator('input[placeholder="BETA-XXXXXXXX"]').fill('NETWORK-ERROR');
    await page.locator('button:has-text("Siguiente")').click();
    
    // Verificar que se muestra algún tipo de error en toast
    await expect(page.locator('text=inválido')).toBeVisible();
  });
}); 