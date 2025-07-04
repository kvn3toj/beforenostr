import { test, expect } from '@playwright/test';

test.describe('Reproductor Horizontal ÜPlay - Video de Reciprocidad', () => {
  test.beforeEach(async ({ page }) => {
    // Navegar a login
    await page.goto('/login');
    
    // Login con credenciales de administrador
    await page.fill('[data-testid="login-email-input"] input', 'admin@gamifier.com');
    await page.fill('[data-testid="login-password-input"] input', 'admin123');
    await page.click('[data-testid="login-submit-button"]');
    
    // Esperar redirección y estabilización
    await page.waitForURL('**/', { timeout: 15000 });
    await page.waitForSelector('#root', { timeout: 10000 });
    await page.waitForTimeout(2000);
  });

  test('Debe cargar el video de reciprocidad con información correcta', async ({ page }) => {
    // Navegar a la página del reproductor horizontal
    await page.goto('/uplay/horizontal-demo');
    await page.waitForSelector('#root', { timeout: 10000 });
    await page.waitForTimeout(2000);

    // Verificar título del video
    await expect(page.locator('text=La Reciprocidad: Principio Universal del Reciprocidad')).toBeVisible();
    
    // Verificar descripción
    await expect(page.locator('text=Explora el concepto ancestral de reciprocidad')).toBeVisible();
    
    // Verificar que muestra las estadísticas del video
    await expect(page.locator('text=4:30')).toBeVisible(); // Duración
    await expect(page.locator('text=4 Preguntas Interactivas')).toBeVisible();
    await expect(page.locator('text=110 Mëritos Totales')).toBeVisible();
  });

  test('Debe mostrar las preguntas sobre reciprocidad', async ({ page }) => {
    await page.goto('/uplay/horizontal-demo');
    await page.waitForSelector('#root', { timeout: 10000 });
    await page.waitForTimeout(2000);

    // Verificar que muestra la sección de preguntas
    await expect(page.locator('text=Preguntas sobre Reciprocidad y Reciprocidad')).toBeVisible();
    
    // Verificar que muestra las 4 preguntas
    await expect(page.locator('text=¿Qué significa "Reciprocidad" en la filosofía andina?')).toBeVisible();
    await expect(page.locator('text=¿cómo se aplica la reciprocidad en CoomÜnity?')).toBeVisible();
    await expect(page.locator('text=¿Cuál es el resultado de practicar la reciprocidad consciente?')).toBeVisible();
    await expect(page.locator('text=¿Cómo se relaciona la reciprocidad con la economía colaborativa?')).toBeVisible();
    
    // Verificar que muestra los timestamps
    await expect(page.locator('text=0:45')).toBeVisible(); // Primera pregunta
    await expect(page.locator('text=2:00')).toBeVisible(); // Segunda pregunta
    await expect(page.locator('text=3:20')).toBeVisible(); // Tercera pregunta
    await expect(page.locator('text=4:20')).toBeVisible(); // Cuarta pregunta
  });

  test('Debe mostrar el iframe de YouTube', async ({ page }) => {
    await page.goto('/uplay/horizontal-demo');
    await page.waitForSelector('#root', { timeout: 10000 });
    await page.waitForTimeout(2000);

    // Verificar que el iframe de YouTube está presente
    const iframe = page.locator('iframe[src*="youtube.com"]');
    await expect(iframe).toBeVisible();
    
    // Verificar que tiene el título correcto
    await expect(iframe).toHaveAttribute('title', 'La Reciprocidad: Principio Universal del Reciprocidad');
  });

  test('Debe mostrar las métricas de gamificación', async ({ page }) => {
    await page.goto('/uplay/horizontal-demo');
    await page.waitForSelector('#root', { timeout: 10000 });
    await page.waitForTimeout(2000);

    // Verificar métricas iniciales
    await expect(page.locator('text=6 Mëritos')).toBeVisible();
    await expect(page.locator('text=12 Öndas')).toBeVisible();
    await expect(page.locator('text=Nivel: 1')).toBeVisible();
    await expect(page.locator('text=Correctas: 0/4')).toBeVisible();
  });

  test('Debe mostrar las características del reproductor', async ({ page }) => {
    await page.goto('/uplay/horizontal-demo');
    await page.waitForSelector('#root', { timeout: 10000 });
    await page.waitForTimeout(2000);

    // Verificar características
    await expect(page.locator('text=Preguntas Interactivas')).toBeVisible();
    await expect(page.locator('text=Sistema de Recompensas Reciprocidad')).toBeVisible();
    await expect(page.locator('text=Gamificación con Mérit')).toBeVisible();
    await expect(page.locator('text=Diseño Adaptativo')).toBeVisible();
  });

  test('Debe ser responsive en móvil', async ({ page }) => {
    // Simular dispositivo móvil
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/uplay/horizontal-demo');
    await page.waitForSelector('#root', { timeout: 10000 });
    await page.waitForTimeout(2000);

    // Verificar que el contenido es visible en móvil
    await expect(page.locator('text=Reproductor Horizontal ÜPlay')).toBeVisible();
    await expect(page.locator('text=La Reciprocidad: Principio Universal del Reciprocidad')).toBeVisible();
    
    // Verificar que el iframe está presente
    const iframe = page.locator('iframe[src*="youtube.com"]');
    await expect(iframe).toBeVisible();
  });
}); 