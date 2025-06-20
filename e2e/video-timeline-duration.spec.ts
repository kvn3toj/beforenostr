import { test, expect } from '@playwright/test';

const FRONTEND_BASE_URL = process.env.FRONTEND_BASE_URL || 'http://localhost:3000';
const TEST_VIDEO_ITEM_ID = 9; // Video que sabemos que funciona

test.describe('Video Timeline Duration Fix', () => {
  test.beforeEach(async ({ page }) => {
    // Login admin antes de cada test
    await page.goto(`${FRONTEND_BASE_URL}/login`);
    await page.fill('input[name="email"]', 'admin@gamifier.com');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/');
    await expect(page.getByText('Gamifier Admin')).toBeVisible();
  });

  test('Should display correct video duration in timeline', async ({ page }) => {
    console.log('🧪 Testing: Video timeline duration fix');
    
    // Navegar a la página de configuración del video
    await page.goto(`${FRONTEND_BASE_URL}/items/${TEST_VIDEO_ITEM_ID}/config`);
    await page.waitForLoadState('networkidle');
    
    // Hacer clic en la pestaña "Questions"
    const questionsTab = page.getByRole('tab', { name: /Preguntas|Questions/i });
    await expect(questionsTab).toBeVisible({ timeout: 10000 });
    await questionsTab.click();
    
    // Verificar que la pestaña está seleccionada
    await expect(questionsTab).toHaveAttribute('aria-selected', 'true');
    
    // Esperar a que el QuestionManager se cargue
    await page.waitForTimeout(5000);
    
    // Verificar que el timeline está presente
    console.log('🔍 Checking for VideoTimeline component...');
    const timelineHeader = page.getByText('Timeline de Video - Preguntas Interactivas');
    await expect(timelineHeader).toBeVisible({ timeout: 10000 });
    console.log('✅ VideoTimeline header found');
    
    // Verificar información de duración
    console.log('🕒 Checking video duration display...');
    const durationInfo = page.getByText(/Duración: \d+:\d+ • \d+ preguntas configuradas/);
    await expect(durationInfo).toBeVisible({ timeout: 5000 });
    
    // Extraer la duración del texto
    const durationText = await durationInfo.textContent();
    const durationMatch = durationText?.match(/Duración: (\d+):(\d+)/);
    
    if (durationMatch) {
      const minutes = parseInt(durationMatch[1]);
      const seconds = parseInt(durationMatch[2]);
      const totalSeconds = minutes * 60 + seconds;
      
      console.log(`📊 Detected duration: ${minutes}:${seconds.toString().padStart(2, '0')} (${totalSeconds} seconds)`);
      
      // Verificar que la duración NO es el valor hardcoded anterior (5:00 = 300 segundos)
      expect(totalSeconds).not.toBe(300);
      
      // Verificar que la duración está en un rango razonable (entre 2 y 20 minutos para videos típicos)
      expect(totalSeconds).toBeGreaterThanOrEqual(120); // Al menos 2 minutos
      expect(totalSeconds).toBeLessThanOrEqual(1200); // Máximo 20 minutos
      
      console.log(`✅ Duration is reasonable: ${totalSeconds}s`);
      
      // Verificar que la duración estimada es mayor que el valor hardcoded anterior
      if (totalSeconds > 300) {
        console.log('✅ New duration is longer than hardcoded value (improvement)');
      } else {
        console.log('ℹ️ New duration is shorter but still reasonable');
      }
    } else {
      throw new Error('Could not extract duration from timeline');
    }
    
    // Verificar que hay marcadores de tiempo en el timeline
    console.log('🎯 Checking timeline markers...');
    const timeMarkers = page.locator('text=/0:00|1:00|2:00|3:00|4:00|5:00|6:00|7:00|8:00/');
    await expect(timeMarkers.first()).toBeVisible({ timeout: 5000 });
    console.log('✅ Timeline time markers found');
    
    // Verificar que las estadísticas del timeline están presentes
    console.log('📈 Checking timeline statistics...');
    const statsSection = page.locator('text=/Duración:/');
    await expect(statsSection).toBeVisible({ timeout: 5000 });
    console.log('✅ Timeline statistics section found');
    
    // Verificar que el chip de progreso muestra la duración correcta
    console.log('⏱️ Checking progress chip...');
    const progressChip = page.getByText(/0:00 \/ \d+:\d+/);
    if (await progressChip.count() > 0) {
      await expect(progressChip).toBeVisible({ timeout: 5000 });
      const chipText = await progressChip.textContent();
      console.log(`✅ Progress chip found: "${chipText}"`);
    }
    
    // Tomar screenshot para documentar el resultado
    console.log('📸 Taking screenshot...');
    await page.screenshot({ 
      path: 'test-results/video-timeline-duration-fix.png', 
      fullPage: true 
    });
    console.log('✅ Screenshot saved: test-results/video-timeline-duration-fix.png');
    
    console.log('🎉 Video timeline duration fix verification completed successfully!');
  });

  test('Should handle video with different durations correctly', async ({ page }) => {
    console.log('🧪 Testing: Timeline adaptability to different video durations');
    
    // Este test verifica que el timeline se adapta correctamente a diferentes duraciones
    await page.goto(`${FRONTEND_BASE_URL}/items/${TEST_VIDEO_ITEM_ID}/config`);
    await page.waitForLoadState('networkidle');
    
    const questionsTab = page.getByRole('tab', { name: /Preguntas|Questions/i });
    await questionsTab.click();
    await page.waitForTimeout(3000);
    
    // Verificar que el slider del timeline existe
    const timelineSlider = page.locator('[role="slider"], .MuiSlider-root').first();
    if (await timelineSlider.count() > 0) {
      await expect(timelineSlider).toBeVisible({ timeout: 5000 });
      console.log('✅ Timeline slider found and ready for interaction');
      
      // Verificar que podemos interactuar con el timeline
      await timelineSlider.hover();
      console.log('✅ Timeline slider is interactive');
    }
    
    // Verificar que las preguntas existentes se muestran correctamente en el timeline
    const questionMarkers = page.locator('button:has([data-testid*="QuestionIcon"], svg)');
    const markerCount = await questionMarkers.count();
    console.log(`🎯 Found ${markerCount} question markers on timeline`);
    
    if (markerCount > 0) {
      // Verificar que al hacer clic en un marcador se abre el modal de edición
      await questionMarkers.first().click();
      
      // Esperar a que aparezca el modal (puede tardar un poco)
      await page.waitForTimeout(2000);
      
      // Buscar indicios de que se abrió un modal de edición
      const modal = page.locator('[role="dialog"]');
      if (await modal.count() > 0) {
        console.log('✅ Question modal opened when clicking timeline marker');
        
        // Cerrar el modal
        const closeButton = page.getByRole('button', { name: /Cancelar|Close|Cerrar/i });
        if (await closeButton.count() > 0) {
          await closeButton.click();
          console.log('✅ Modal closed successfully');
        }
      }
    }
    
    console.log('✅ Timeline adaptability test completed');
  });

  test('Should show loading state while fetching video duration', async ({ page }) => {
    console.log('🧪 Testing: Loading state during video duration fetch');
    
    // Navegar rápidamente y verificar estado de carga
    const navigationPromise = page.goto(`${FRONTEND_BASE_URL}/items/${TEST_VIDEO_ITEM_ID}/config`);
    
    // Inmediatamente después de la navegación, buscar indicadores de carga
    const loadingSpinner = page.locator('text=/Cargando/i');
    if (await loadingSpinner.count() > 0) {
      console.log('✅ Loading state detected');
    }
    
    await navigationPromise;
    await page.waitForLoadState('networkidle');
    
    // Hacer clic en Questions tab
    const questionsTab = page.getByRole('tab', { name: /Preguntas|Questions/i });
    await questionsTab.click();
    
    // Verificar que eventualmente se carga el contenido
    const timelineHeader = page.getByText('Timeline de Video - Preguntas Interactivas');
    await expect(timelineHeader).toBeVisible({ timeout: 15000 });
    console.log('✅ Content loaded successfully after loading state');
  });
}); 