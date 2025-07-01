/**
 * 🧪 Test E2E: Consola de Experiencias - Flujo Vital Activado
 *
 * Test para verificar que el hook useConsoleData está conectado correctamente
 * al Backend NestJS y la Consola de Experiencias puede cargar y mostrar datos.
 */

import { test, expect } from '@playwright/test';

test.describe('🎮 Consola de Experiencias - Backend Integration', () => {
  test.beforeEach(async ({ page }) => {
    // 1. Navegar al admin frontend
    await page.goto('http://localhost:3000');
  });

  test('✅ CRÍTICO: Hook useConsoleData carga datos del Backend NestJS', async ({ page }) => {
    // 2. Login como admin - USANDO SELECTORES CORRECTOS
    await page.fill('#email', 'admin@gamifier.com');
    await page.fill('#password', 'admin123');
    await page.click('button[type="submit"]');

    // 3. Esperar redirección al dashboard
    await page.waitForURL('**/dashboard', { timeout: 15000 });

    // 4. Navegar a la Consola de Experiencias
    await page.click('text=Consola de Experiencias');

    // 5. Verificar que la página carga
    await expect(page.locator('text=Consola de Experiencias')).toBeVisible();

    // 6. Verificar que los datos del backend se cargan (métricas)
    await expect(page.locator('text=Usuarios Activos')).toBeVisible({ timeout: 10000 });

    // 7. Verificar que el contador de desafíos activos aparece
    await expect(page.locator('text=Desafíos Activos')).toBeVisible();

    // 8. Verificar que la lista de challenges se carga
    // Puede mostrar "El Lienzo Está Limpio" si no hay desafíos o mostrar la lista
    const hasChallenges = await page.locator('[data-testid="challenge-card"]').count();
    const hasEmptyState = await page.locator('text=El Lienzo Está Limpio').isVisible();

    expect(hasChallenges > 0 || hasEmptyState).toBeTruthy();

    // 9. Verificar que no hay errores de conexión
    await expect(page.locator('text=Error al cargar datos')).not.toBeVisible();

    console.log('✅ ÉXITO: Hook useConsoleData está funcionando correctamente');
  });

  test('🚀 CRÍTICO: Puede crear un nuevo desafío (Creación de Memes)', async ({ page }) => {
    // 2. Login como admin - USANDO SELECTORES CORRECTOS
    await page.fill('#email', 'admin@gamifier.com');
    await page.fill('#password', 'admin123');
    await page.click('button[type="submit"]');

    // 3. Navegar a la Consola de Experiencias
    await page.waitForURL('**/dashboard', { timeout: 15000 });
    await page.click('text=Consola de Experiencias');

    // 4. Hacer clic en "Crear Desafío" (puede ser botón principal o en estado vacío)
    const createButton = page.locator('text=Crear Primer Desafío, text=Crear Desafío').first();
    await createButton.click();

    // 5. Verificar que el editor de desafíos se abre
    await expect(page.locator('text=Editor de Desafíos')).toBeVisible({ timeout: 5000 });

    // 6. Llenar campos básicos del desafío
    await page.fill('[data-testid="challenge-title"]', 'Desafío de Prueba E2E');
    await page.fill('[data-testid="challenge-description"]', 'Este es un desafío creado durante el test E2E');

    // 7. Guardar el desafío
    await page.click('text=Crear Desafío, text=Guardar');

    // 8. Verificar que el desafío se guardó exitosamente
    await expect(page.locator('text=Desafío creado exitosamente')).toBeVisible({ timeout: 10000 });

    console.log('✅ ÉXITO: La creación de desafíos (memes) funciona correctamente');
  });

  test('📊 CRÍTICO: Métricas del Backend se muestran correctamente', async ({ page }) => {
    // 2. Login como admin - USANDO SELECTORES CORRECTOS
    await page.fill('#email', 'admin@gamifier.com');
    await page.fill('#password', 'admin123');
    await page.click('button[type="submit"]');

    // 3. Navegar a la Consola de Experiencias
    await page.waitForURL('**/dashboard', { timeout: 15000 });
    await page.click('text=Consola de Experiencias');

    // 4. Verificar que las métricas principales se cargan desde el backend
    await expect(page.locator('text=Usuarios Activos')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=Desafíos Activos')).toBeVisible();
    await expect(page.locator('text=Progreso a Solver')).toBeVisible();
    await expect(page.locator('text=Votos de Confianza')).toBeVisible();

    // 5. Verificar que hay valores numéricos (no placeholder data)
    const userMetric = await page.locator('text=Usuarios Activos').locator('..').locator('text=/\\d+/').first();
    await expect(userMetric).toBeVisible();

    console.log('✅ ÉXITO: Las métricas del backend se muestran correctamente');
  });
});
