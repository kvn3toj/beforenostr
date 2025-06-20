import { test, expect } from '@playwright/test';

test.describe('Challenges Module - Fase A.8 Verification', () => {
  test.beforeEach(async ({ page }) => {
    // Navegar a la aplicación
    await page.goto('/');
    
    // Esperar a que la aplicación cargue completamente
    await page.waitForLoadState('networkidle');
    
    // Verificar que estamos en la página principal
    await expect(page).toHaveTitle(/CoomÜnity/);
  });

  test('should navigate to Challenges page from sidebar', async ({ page }) => {
    // Buscar y hacer clic en el enlace de Desafíos en el sidebar
    const challengesLink = page.getByRole('button', { name: /desafíos/i });
    await expect(challengesLink).toBeVisible();
    await challengesLink.click();

    // Verificar que navegamos a la página de desafíos
    await expect(page).toHaveURL(/\/challenges/);
    
    // Verificar que el título de la página es correcto
    await expect(page.getByRole('heading', { name: /desafíos/i })).toBeVisible();
  });

  test('should display challenges list with mock data', async ({ page }) => {
    // Navegar a la página de desafíos
    await page.goto('/challenges');
    await page.waitForLoadState('networkidle');

    // Verificar que se muestran las estadísticas rápidas
    await expect(page.getByText(/total/i)).toBeVisible();
    await expect(page.getByText(/activos/i)).toBeVisible();
    await expect(page.getByText(/participando/i)).toBeVisible();
    await expect(page.getByText(/completados/i)).toBeVisible();

    // Verificar que se muestran los desafíos mock
    await expect(page.getByText(/desafío de ayni diario/i)).toBeVisible();
    await expect(page.getByText(/innovación sostenible/i)).toBeVisible();
    await expect(page.getByText(/maestría en colaboración/i)).toBeVisible();

    // Verificar que se muestran los puntos y participantes
    await expect(page.getByText(/150 pts/i)).toBeVisible();
    await expect(page.getByText(/300 pts/i)).toBeVisible();
    await expect(page.getByText(/500 pts/i)).toBeVisible();
  });

  test('should filter challenges by search text', async ({ page }) => {
    await page.goto('/challenges');
    await page.waitForLoadState('networkidle');

    // Buscar el campo de búsqueda
    const searchInput = page.getByPlaceholder(/buscar desafíos/i);
    await expect(searchInput).toBeVisible();

    // Escribir en el campo de búsqueda
    await searchInput.fill('ayni');

    // Verificar que solo se muestra el desafío que contiene "ayni"
    await expect(page.getByText(/desafío de ayni diario/i)).toBeVisible();
    
    // Verificar que los otros desafíos no se muestran
    await expect(page.getByText(/innovación sostenible/i)).not.toBeVisible();
    await expect(page.getByText(/maestría en colaboración/i)).not.toBeVisible();
  });

  test('should switch between tabs', async ({ page }) => {
    await page.goto('/challenges');
    await page.waitForLoadState('networkidle');

    // Verificar que las pestañas están presentes
    await expect(page.getByRole('tab', { name: /todos/i })).toBeVisible();
    await expect(page.getByRole('tab', { name: /activos/i })).toBeVisible();
    await expect(page.getByRole('tab', { name: /mis desafíos/i })).toBeVisible();
    await expect(page.getByRole('tab', { name: /completados/i })).toBeVisible();

    // Hacer clic en la pestaña "Activos"
    await page.getByRole('tab', { name: /activos/i }).click();
    
    // Verificar que la pestaña está seleccionada
    await expect(page.getByRole('tab', { name: /activos/i })).toHaveAttribute('aria-selected', 'true');

    // Hacer clic en la pestaña "Mis Desafíos"
    await page.getByRole('tab', { name: /mis desafíos/i }).click();
    
    // Verificar que la pestaña está seleccionada
    await expect(page.getByRole('tab', { name: /mis desafíos/i })).toHaveAttribute('aria-selected', 'true');
  });

  test('should filter challenges by difficulty', async ({ page }) => {
    await page.goto('/challenges');
    await page.waitForLoadState('networkidle');

    // Buscar el filtro de dificultad
    const difficultyFilter = page.getByRole('button', { name: /dificultad/i });
    await expect(difficultyFilter).toBeVisible();
    await difficultyFilter.click();

    // Seleccionar "Principiante"
    await page.getByRole('option', { name: /principiante/i }).click();

    // Verificar que solo se muestra el desafío de principiante
    await expect(page.getByText(/desafío de ayni diario/i)).toBeVisible();
    
    // Los otros desafíos no deberían estar visibles
    await expect(page.getByText(/innovación sostenible/i)).not.toBeVisible();
    await expect(page.getByText(/maestría en colaboración/i)).not.toBeVisible();
  });

  test('should navigate to challenge details', async ({ page }) => {
    await page.goto('/challenges');
    await page.waitForLoadState('networkidle');

    // Hacer clic en el primer desafío
    const firstChallenge = page.getByText(/desafío de ayni diario/i).first();
    await firstChallenge.click();

    // Verificar que navegamos a la página de detalles
    await expect(page).toHaveURL(/\/challenges\/[^\/]+$/);
    
    // Verificar que se muestra el contenido de detalles
    await expect(page.getByRole('heading', { name: /desafío de ayni diario/i })).toBeVisible();
    await expect(page.getByText(/descripción/i)).toBeVisible();
    await expect(page.getByText(/progreso/i)).toBeVisible();
    await expect(page.getByText(/recompensas/i)).toBeVisible();
  });

  test('should show challenge details with correct information', async ({ page }) => {
    // Navegar directamente a un desafío específico usando el ID mock
    await page.goto('/challenges/challenge-1');
    await page.waitForLoadState('networkidle');

    // Verificar información del desafío
    await expect(page.getByRole('heading', { name: /desafío de ayni diario/i })).toBeVisible();
    await expect(page.getByText(/150 pts/i)).toBeVisible();
    await expect(page.getByText(/principiante/i)).toBeVisible();
    await expect(page.getByText(/comunidad/i)).toBeVisible();
    
    // Verificar que se muestra la descripción
    await expect(page.getByText(/practica el principio de ayni/i)).toBeVisible();
    
    // Verificar que se muestran las recompensas
    await expect(page.getByText(/méritos/i)).toBeVisible();
    await expect(page.getByText(/lükas/i)).toBeVisible();
    await expect(page.getByText(/öndas/i)).toBeVisible();
  });

  test('should handle join/leave challenge actions', async ({ page }) => {
    await page.goto('/challenges/challenge-1');
    await page.waitForLoadState('networkidle');

    // Buscar el botón de unirse (si no está participando)
    const joinButton = page.getByRole('button', { name: /unirse/i });
    
    if (await joinButton.isVisible()) {
      // Hacer clic en unirse
      await joinButton.click();
      
      // Verificar que aparece un mensaje de confirmación o cambio de estado
      await expect(page.getByText(/te has unido/i).or(page.getByRole('button', { name: /salir/i }))).toBeVisible();
    }

    // Buscar el botón de salir (si está participando)
    const leaveButton = page.getByRole('button', { name: /salir/i });
    
    if (await leaveButton.isVisible()) {
      // Hacer clic en salir
      await leaveButton.click();
      
      // Si hay un diálogo de confirmación, confirmarlo
      const confirmButton = page.getByRole('button', { name: /confirmar/i });
      if (await confirmButton.isVisible()) {
        await confirmButton.click();
      }
      
      // Verificar que aparece un mensaje de confirmación o cambio de estado
      await expect(page.getByText(/has salido/i).or(page.getByRole('button', { name: /unirse/i }))).toBeVisible();
    }
  });

  test('should display progress information', async ({ page }) => {
    await page.goto('/challenges/challenge-1');
    await page.waitForLoadState('networkidle');

    // Verificar que se muestra información de progreso
    await expect(page.getByText(/progreso/i)).toBeVisible();
    
    // Buscar indicadores de progreso (barras, porcentajes, etc.)
    const progressElements = page.locator('[role="progressbar"], .MuiLinearProgress-root, .progress');
    if (await progressElements.count() > 0) {
      await expect(progressElements.first()).toBeVisible();
    }
  });

  test('should show participant count and statistics', async ({ page }) => {
    await page.goto('/challenges');
    await page.waitForLoadState('networkidle');

    // Verificar que se muestran los contadores de participantes
    await expect(page.getByText(/67 participantes/i)).toBeVisible();
    await expect(page.getByText(/34 participantes/i)).toBeVisible();
    await expect(page.getByText(/12 participantes/i)).toBeVisible();
  });

  test('should handle empty states and loading states', async ({ page }) => {
    await page.goto('/challenges');
    
    // Verificar que no hay errores de carga
    const errorMessages = page.locator('text=/error|failed|falló/i');
    await expect(errorMessages).toHaveCount(0);
    
    // Verificar que el contenido se carga correctamente
    await page.waitForLoadState('networkidle');
    await expect(page.getByText(/desafío de ayni diario/i)).toBeVisible();
  });

  test('should be responsive on different screen sizes', async ({ page }) => {
    await page.goto('/challenges');
    await page.waitForLoadState('networkidle');

    // Probar en móvil
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.getByText(/desafíos/i)).toBeVisible();
    
    // Probar en tablet
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.getByText(/desafíos/i)).toBeVisible();
    
    // Volver a desktop
    await page.setViewportSize({ width: 1280, height: 720 });
    await expect(page.getByText(/desafíos/i)).toBeVisible();
  });

  test('should navigate back from challenge details to list', async ({ page }) => {
    await page.goto('/challenges');
    await page.waitForLoadState('networkidle');

    // Ir a detalles
    await page.getByText(/desafío de ayni diario/i).first().click();
    await expect(page).toHaveURL(/\/challenges\/[^\/]+$/);

    // Navegar de vuelta usando el botón del navegador
    await page.goBack();
    await expect(page).toHaveURL(/\/challenges$/);
    await expect(page.getByText(/desafío de ayni diario/i)).toBeVisible();
  });

  test('should display challenge categories correctly', async ({ page }) => {
    await page.goto('/challenges');
    await page.waitForLoadState('networkidle');

    // Verificar que se muestran las categorías
    await expect(page.getByText(/comunidad/i)).toBeVisible();
    await expect(page.getByText(/sostenibilidad/i)).toBeVisible();
    await expect(page.getByText(/social/i)).toBeVisible();
  });

  test('should show challenge duration and deadlines', async ({ page }) => {
    await page.goto('/challenges/challenge-1');
    await page.waitForLoadState('networkidle');

    // Verificar que se muestra información de duración
    const durationElements = page.locator('text=/días|semanas|meses|duración/i');
    if (await durationElements.count() > 0) {
      await expect(durationElements.first()).toBeVisible();
    }
  });
}); 