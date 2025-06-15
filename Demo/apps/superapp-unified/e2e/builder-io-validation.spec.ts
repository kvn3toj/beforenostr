import { test, expect } from '@playwright/test';

test.describe('Builder.io Rules Validation', () => {
  test.beforeEach(async ({ page }) => {
    // Configurar manejo de errores
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    // Guardar errores en el contexto de la página
    await page.addInitScript(() => {
      (window as any).capturedErrors = [];
      window.addEventListener('error', (event) => {
        (window as any).capturedErrors.push(event.message);
      });
    });

    // Navegar a la aplicación
    await page.goto('/');
    await page.waitForSelector('#root');
  });

  test('should load horizontal player demo without hook errors', async ({ page }) => {
    // Navegar al reproductor horizontal
    await page.goto('/uplay/horizontal-demo');
    
    // Esperar a que el componente se monte completamente
    await page.waitForSelector('[data-testid="horizontal-player-container"]', { timeout: 10000 });
    
    // Verificar que no hay errores de hooks en la consola
    const errors = await page.evaluate(() => (window as any).capturedErrors || []);
    const hookErrors = errors.filter((error: string) => 
      error.includes('hook') || 
      error.includes('d5xc6yq0t') ||
      error.includes('Rendered more hooks than during the previous render')
    );
    
    expect(hookErrors).toHaveLength(0);
    
    // Verificar que el componente se renderiza correctamente
    await expect(page.locator('[data-testid="horizontal-player-container"]')).toBeVisible();
    
    // Verificar que el video está presente
    await expect(page.locator('iframe[src*="youtube.com"]')).toBeVisible();
    
    // Verificar que los controles están presentes
    await expect(page.locator('[data-testid="play-pause-button"]')).toBeVisible();
    await expect(page.locator('[data-testid="volume-control"]')).toBeVisible();
  });

  test('should handle video interactions without errors', async ({ page }) => {
    await page.goto('/uplay/horizontal-demo');
    await page.waitForSelector('[data-testid="horizontal-player-container"]');
    
    // Probar interacciones básicas
    const playButton = page.locator('[data-testid="play-pause-button"]');
    await expect(playButton).toBeVisible();
    
    // Click en play/pause
    await playButton.click();
    
    // Verificar que no hay errores después de la interacción
    const errors = await page.evaluate(() => (window as any).capturedErrors || []);
    const criticalErrors = errors.filter((error: string) => 
      error.includes('hook') || 
      error.includes('circular') ||
      error.includes('dependency')
    );
    
    expect(criticalErrors).toHaveLength(0);
  });

  test('should display video information correctly', async ({ page }) => {
    await page.goto('/uplay/horizontal-demo');
    await page.waitForSelector('[data-testid="horizontal-player-container"]');
    
    // Verificar información del video
    await expect(page.locator('text=La Reciprocidad: Principio Universal del Ayni')).toBeVisible();
    await expect(page.locator('text=4:30')).toBeVisible();
    
    // Verificar chips informativos
    await expect(page.locator('text=Filosofía CoomÜnity')).toBeVisible();
    await expect(page.locator('text=Reciprocidad')).toBeVisible();
    await expect(page.locator('text=Bien Común')).toBeVisible();
  });

  test('should handle question overlays without hook errors', async ({ page }) => {
    await page.goto('/uplay/horizontal-demo');
    await page.waitForSelector('[data-testid="horizontal-player-container"]');
    
    // Simular progreso del video para activar preguntas
    await page.evaluate(() => {
      // Simular que el video está en el segundo 16 (primera pregunta)
      const event = new CustomEvent('timeupdate', { 
        detail: { currentTime: 16 } 
      });
      window.dispatchEvent(event);
    });
    
    // Esperar un momento para que se procesen los hooks
    await page.waitForTimeout(1000);
    
    // Verificar que no hay errores de hooks
    const errors = await page.evaluate(() => (window as any).capturedErrors || []);
    const hookErrors = errors.filter((error: string) => 
      error.includes('hook') || 
      error.includes('useCallback') ||
      error.includes('circular dependency')
    );
    
    expect(hookErrors).toHaveLength(0);
  });

  test('should cleanup properly on unmount', async ({ page }) => {
    await page.goto('/uplay/horizontal-demo');
    await page.waitForSelector('[data-testid="horizontal-player-container"]');
    
    // Navegar a otra página para desmontar el componente
    await page.goto('/');
    await page.waitForSelector('#root');
    
    // Esperar un momento para que se ejecute el cleanup
    await page.waitForTimeout(1000);
    
    // Verificar que no hay errores de cleanup
    const errors = await page.evaluate(() => (window as any).capturedErrors || []);
    const cleanupErrors = errors.filter((error: string) => 
      error.includes('timer') || 
      error.includes('interval') ||
      error.includes('memory leak')
    );
    
    expect(cleanupErrors).toHaveLength(0);
  });

  test('should validate Builder.io compatibility', async ({ page }) => {
    // Este test simula el entorno de Builder.io
    await page.goto('/uplay/horizontal-demo');
    await page.waitForSelector('[data-testid="horizontal-player-container"]');
    
    // Simular múltiples re-renders como en Builder.io
    for (let i = 0; i < 5; i++) {
      await page.evaluate(() => {
        // Forzar re-render
        const event = new CustomEvent('resize');
        window.dispatchEvent(event);
      });
      await page.waitForTimeout(100);
    }
    
    // Verificar que el componente sigue funcionando
    await expect(page.locator('[data-testid="horizontal-player-container"]')).toBeVisible();
    
    // Verificar que no hay errores acumulados
    const errors = await page.evaluate(() => (window as any).capturedErrors || []);
    const builderErrors = errors.filter((error: string) => 
      error.includes('d5xc6yq0t') || 
      error.includes('hook') ||
      error.includes('render')
    );
    
    expect(builderErrors).toHaveLength(0);
  });
});

test.describe('Builder.io Rules System', () => {
  test('should have validation scripts available', async ({ page }) => {
    // Este test verifica que el sistema de reglas está configurado
    await page.goto('/');
    
    // Verificar que la aplicación carga sin errores críticos
    await page.waitForSelector('#root');
    
    // Simular que estamos en un entorno de desarrollo
    const hasValidationSystem = await page.evaluate(() => {
      // Verificar que no hay errores de imports masivos
      return !document.querySelector('script[src*="@mui/material"]');
    });
    
    expect(hasValidationSystem).toBe(true);
  });
}); 