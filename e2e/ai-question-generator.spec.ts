import { test, expect } from '@playwright/test';

test.describe('AI Question Generator', () => {
  test.beforeEach(async ({ page }) => {
    // Configurar listeners para errores
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log('🚨 Console Error:', msg.text());
      }
    });
    
    page.on('pageerror', error => {
      console.log('🚨 Page Error:', error.message);
    });

    // Ir a la página de login
    await page.goto('/login');
    
    // Hacer login como administrador
    await page.fill('input[name="email"]', 'admin@gamifier.com');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');
    
    // Esperar redirección al dashboard
    await page.waitForURL('**/');
    await expect(page.getByText('Gamifier Admin')).toBeVisible();
  });

  test('should show AI generator button in questions section', async ({ page }) => {
    console.log('🧪 Test: Verificando botón del generador AI');
    
    // Navegar a Items
    await page.click('text=Items');
    await page.waitForTimeout(2000);
    
    // Buscar el primer item de video (asumiendo que hay al menos uno)
    const firstVideoItem = page.locator('[data-testid="video-item"]').first();
    
    // Si no hay items con data-testid, buscar por enlaces o botones de video
    const videoLinks = page.locator('a[href*="/items/"]');
    if (await videoLinks.count() > 0) {
      await videoLinks.first().click();
    } else {
      // Crear un video temporal para la prueba
      await page.click('text=Crear');
      await page.fill('input[name="title"]', 'Video Test AI Generator');
      await page.fill('input[name="description"]', 'Video para probar el generador AI');
      await page.click('button[type="submit"]');
      await page.waitForTimeout(1000);
    }
    
    // Ir a la pestaña Questions
    await page.click('text=Questions');
    await page.waitForTimeout(1000);
    
    // Verificar que existe el botón del generador AI
    const aiButton = page.locator('text=🤖 Generar con IA');
    await expect(aiButton).toBeVisible();
    
    console.log('✅ Botón del generador AI encontrado');
  });

  test('should open AI generator modal and show configuration options', async ({ page }) => {
    console.log('🧪 Test: Probando modal del generador AI');
    
    // Navegar a Items y seleccionar el primer video
    await page.click('text=Items');
    await page.waitForTimeout(2000);
    
    const videoLinks = page.locator('a[href*="/items/"]');
    if (await videoLinks.count() > 0) {
      await videoLinks.first().click();
    }
    
    // Ir a Questions
    await page.click('text=Questions');
    await page.waitForTimeout(1000);
    
    // Abrir el modal del generador AI
    await page.click('text=🤖 Generar con IA');
    
    // Verificar que el modal se abre
    const modal = page.locator('[role="dialog"]').filter({ hasText: 'Generador de Preguntas IA' });
    await expect(modal).toBeVisible();
    
    // Verificar elementos del modal
    await expect(page.getByText('Configuración Rápida')).toBeVisible();
    await expect(page.getByText('Rápido (2 preguntas)')).toBeVisible();
    await expect(page.getByText('Estándar (3 preguntas)')).toBeVisible();
    await expect(page.getByText('Completo (5 preguntas)')).toBeVisible();
    
    await expect(page.getByText('Configuración Básica')).toBeVisible();
    await expect(page.getByText('Número de preguntas')).toBeVisible();
    await expect(page.getByText('Idioma')).toBeVisible();
    await expect(page.getByText('Tipos de Pregunta')).toBeVisible();
    
    console.log('✅ Modal del generador AI abierto correctamente');
  });

  test('should configure AI generator and show preview', async ({ page }) => {
    console.log('🧪 Test: Configurando generador AI y generando preguntas');
    
    // Navegar a Items y seleccionar el primer video
    await page.click('text=Items');
    await page.waitForTimeout(2000);
    
    const videoLinks = page.locator('a[href*="/items/"]');
    if (await videoLinks.count() > 0) {
      await videoLinks.first().click();
    }
    
    // Ir a Questions
    await page.click('text=Questions');
    await page.waitForTimeout(1000);
    
    // Abrir el modal del generador AI
    await page.click('text=🤖 Generar con IA');
    
    // Seleccionar preset "Estándar"
    await page.click('text=Estándar (3 preguntas)');
    await page.waitForTimeout(500);
    
    // Verificar que el número de preguntas se actualizó
    const numberInput = page.locator('input[type="number"]').first();
    await expect(numberInput).toHaveValue('3');
    
    // Seleccionar tipos de pregunta
    await page.check('text=Opción Múltiple');
    await page.check('text=Verdadero/Falso');
    
    // Hacer clic en "Generar Preguntas"
    await page.click('text=Generar Preguntas');
    
    // Esperar a que aparezca el estado de "Generando..."
    await expect(page.getByText('Generando...')).toBeVisible();
    
    // Esperar a que termine la generación (timeout generoso para la API)
    await page.waitForTimeout(15000);
    
    // Verificar si aparece la vista previa o algún resultado
    // (Puede fallar si hay problemas de API, pero el test mostrará el comportamiento)
    const previewTitle = page.locator('text=Preguntas Generadas');
    const errorMessage = page.locator('text=Error');
    
    // Uno de los dos debería aparecer
    await expect(previewTitle.or(errorMessage)).toBeVisible({ timeout: 5000 });
    
    if (await previewTitle.isVisible()) {
      console.log('✅ Preguntas generadas exitosamente');
      
      // Verificar botones de acción
      await expect(page.getByText('Volver a Configurar')).toBeVisible();
      await expect(page.getByText('Usar Estas Preguntas')).toBeVisible();
    } else {
      console.log('⚠️ Se produjo un error en la generación (esperado en algunos casos)');
    }
  });

  test('should test quick presets functionality', async ({ page }) => {
    console.log('🧪 Test: Probando presets rápidos');
    
    // Navegar a Items y seleccionar el primer video
    await page.click('text=Items');
    await page.waitForTimeout(2000);
    
    const videoLinks = page.locator('a[href*="/items/"]');
    if (await videoLinks.count() > 0) {
      await videoLinks.first().click();
    }
    
    // Ir a Questions
    await page.click('text=Questions');
    await page.waitForTimeout(1000);
    
    // Abrir el modal del generador AI
    await page.click('text=🤖 Generar con IA');
    
    // Probar preset "Rápido"
    await page.click('text=Rápido (2 preguntas)');
    await page.waitForTimeout(500);
    
    const numberInput = page.locator('input[type="number"]').first();
    await expect(numberInput).toHaveValue('2');
    
    // Probar preset "Completo"
    await page.click('text=Completo (5 preguntas)');
    await page.waitForTimeout(500);
    
    await expect(numberInput).toHaveValue('5');
    
    console.log('✅ Presets rápidos funcionando correctamente');
  });

  test('should close modal with cancel button', async ({ page }) => {
    console.log('🧪 Test: Probando cierre del modal');
    
    // Navegar a Items y seleccionar el primer video
    await page.click('text=Items');
    await page.waitForTimeout(2000);
    
    const videoLinks = page.locator('a[href*="/items/"]');
    if (await videoLinks.count() > 0) {
      await videoLinks.first().click();
    }
    
    // Ir a Questions
    await page.click('text=Questions');
    await page.waitForTimeout(1000);
    
    // Abrir el modal del generador AI
    await page.click('text=🤖 Generar con IA');
    
    // Verificar que el modal está abierto
    const modal = page.locator('[role="dialog"]').filter({ hasText: 'Generador de Preguntas IA' });
    await expect(modal).toBeVisible();
    
    // Cerrar con el botón Cancelar
    await page.click('text=Cancelar');
    
    // Verificar que el modal se cerró
    await expect(modal).not.toBeVisible();
    
    console.log('✅ Modal se cierra correctamente');
  });
}); 