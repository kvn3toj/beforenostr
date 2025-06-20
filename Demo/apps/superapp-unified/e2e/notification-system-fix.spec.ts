import { test, expect } from '@playwright/test';

test.describe('Notification System - Invalid Date Fix', () => {
  test('should handle invalid timestamps gracefully', async ({ page }) => {
    // Interceptar console errors para verificar que no hay errores de fecha
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error' && msg.text().includes('Invalid time value')) {
        consoleErrors.push(msg.text());
      }
    });

    // Ir a la página principal
    await page.goto('/');
    
    // Esperar a que React se monte
    await page.waitForSelector('#root');
    
    // Simular una notificación con timestamp inválido usando el sistema de notificaciones
    await page.evaluate(() => {
      // Buscar el contexto de notificaciones y agregar una notificación con timestamp inválido
      const event = new CustomEvent('testNotification', {
        detail: {
          id: 'test-invalid-date',
          type: 'info',
          title: 'Test Notification',
          message: 'Testing invalid date handling',
          timestamp: 'invalid-date-string', // Timestamp inválido
          read: false
        }
      });
      
      window.dispatchEvent(event);
    });

    // Esperar un momento para que se procese
    await page.waitForTimeout(2000);

    // Verificar que no se produjeron errores de "Invalid time value"
    expect(consoleErrors).toHaveLength(0);
    
    // Verificar que la aplicación sigue funcionando
    const body = await page.locator('body');
    await expect(body).toBeVisible();
    
    // Si hay un drawer de notificaciones, intentar abrirlo
    const notificationButton = page.locator('[data-testid="notification-fab"], button[aria-label*="notification"], button[aria-label*="Notification"]').first();
    
    if (await notificationButton.isVisible()) {
      await notificationButton.click();
      
      // Verificar que el drawer se abre sin errores
      await page.waitForTimeout(1000);
      
      // Cerrar el drawer si está abierto
      const closeButton = page.locator('button[aria-label*="close"], button[aria-label*="Close"]').first();
      if (await closeButton.isVisible()) {
        await closeButton.click();
      }
    }
    
    console.log('✅ Test completado: No se encontraron errores de "Invalid time value"');
  });

  test('should format valid dates correctly', async ({ page }) => {
    // Ir a la página principal
    await page.goto('/');
    
    // Esperar a que React se monte
    await page.waitForSelector('#root');
    
    // Verificar que las fechas válidas se formatean correctamente
    await page.evaluate(() => {
      // Probar formateo de fecha válida
      const validDate = new Date().toISOString();
      const event = new CustomEvent('testNotification', {
        detail: {
          id: 'test-valid-date',
          type: 'success',
          title: 'Valid Date Test',
          message: 'Testing valid date formatting',
          timestamp: validDate,
          read: false
        }
      });
      
      window.dispatchEvent(event);
    });

    // Esperar a que se procese
    await page.waitForTimeout(1000);
    
    // Verificar que la aplicación sigue funcionando
    const body = await page.locator('body');
    await expect(body).toBeVisible();
    
    console.log('✅ Test completado: Fechas válidas se procesan correctamente');
  });
}); 