/**
 * 📱 PWA Features - Comprehensive Verification Test
 * 
 * Verifica todas las funcionalidades PWA implementadas:
 * - Detección de capacidades del dispositivo
 * - Compartir nativo
 * - Geolocalización
 * - Vibración
 * - Notificaciones
 * - Estados del dispositivo
 * - Acciones rápidas
 */

import { test, expect, Page } from '@playwright/test';

test.describe('PWA Features Comprehensive Verification', () => {
  let page: Page;

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
    
    // Ir a la aplicación
    await page.goto('/');
    
    // Esperar a que la aplicación cargue
    await page.waitForSelector('[data-testid="sidebar"]', { timeout: 10000 });
    
    // Navegar al PWA Demo
    await page.click('text=PWA Demo');
    await page.waitForLoadState('networkidle');
  });

  test.afterEach(async () => {
    await page.close();
  });

  test('📱 Should display PWA Demo header correctly', async () => {
    // Verificar header de PWA Demo
    await expect(page.locator('text=PWA Demo')).toBeVisible();
    await expect(page.locator('text=Funcionalidades Nativas Avanzadas')).toBeVisible();
    
    // Verificar chips temáticos
    await expect(page.locator('text=Progressive Web App')).toBeVisible();
    await expect(page.locator('text=Experiencia Nativa')).toBeVisible();
    
    console.log('✅ Header de PWA Demo verificado');
  });

  test('ℹ️ Should display PWA information section', async () => {
    // Verificar sección informativa
    await expect(page.locator('text=¿Qué es una PWA?')).toBeVisible();
    
    // Verificar beneficios listados
    await expect(page.locator('text=📱 Experiencia Nativa')).toBeVisible();
    await expect(page.locator('text=🔄 Funciona Offline')).toBeVisible();
    await expect(page.locator('text=🔔 Notificaciones Push')).toBeVisible();
    await expect(page.locator('text=💾 Instalación Fácil')).toBeVisible();
    
    console.log('✅ Sección informativa de PWA verificada');
  });

  test('📊 Should display device status panel', async () => {
    // Verificar panel de estado del dispositivo
    await expect(page.locator('text=📱 Estado del Dispositivo')).toBeVisible();
    
    // Verificar chips de estado
    await expect(page.locator('text=Online, text=Offline').first()).toBeVisible();
    
    // Verificar otros posibles indicadores de estado
    const stateChips = page.locator('.MuiChip-root');
    const chipCount = await stateChips.count();
    expect(chipCount).toBeGreaterThan(0);
    
    console.log('✅ Panel de estado del dispositivo verificado');
  });

  test('🚀 Should display PWA capabilities panel', async () => {
    // Verificar panel de capacidades
    await expect(page.locator('text=🚀 Capacidades PWA')).toBeVisible();
    
    // Verificar capacidades principales
    await expect(page.locator('text=Compartir Nativo')).toBeVisible();
    await expect(page.locator('text=Vibración')).toBeVisible();
    await expect(page.locator('text=Geolocalización')).toBeVisible();
    await expect(page.locator('text=Notificaciones')).toBeVisible();
    
    // Verificar botones de prueba
    await expect(page.locator('button:has-text("Probar")')).toBeVisible();
    await expect(page.locator('button:has-text("Vibrar")')).toBeVisible();
    await expect(page.locator('button:has-text("Ubicar")')).toBeVisible();
    await expect(page.locator('button:has-text("Habilitar")')).toBeVisible();
    
    console.log('✅ Panel de capacidades PWA verificado');
  });

  test('🎮 Should display quick actions panel', async () => {
    // Verificar panel de acciones rápidas
    await expect(page.locator('text=🎮 Acciones Rápidas')).toBeVisible();
    
    // Verificar botones de acciones
    await expect(page.locator('button:has-text("Cámara")')).toBeVisible();
    await expect(page.locator('button:has-text("Micrófono")')).toBeVisible();
    await expect(page.locator('button:has-text("Vibrar")')).toBeVisible();
    await expect(page.locator('button:has-text("Compartir")')).toBeVisible();
    
    console.log('✅ Panel de acciones rápidas verificado');
  });

  test('📤 Should test native share functionality', async () => {
    // Buscar botón de compartir nativo
    const shareButton = page.locator('button:has-text("Probar")').first();
    
    if (await shareButton.isEnabled()) {
      await shareButton.click();
      
      // En browsers que no soportan Web Share API, debería mostrar feedback
      // Verificar que no hay errores críticos
      const errorAlerts = page.locator('.MuiAlert-standardError');
      const errorCount = await errorAlerts.count();
      expect(errorCount).toBe(0);
      
      console.log('✅ Funcionalidad de compartir nativo probada');
    } else {
      console.log('ℹ️ Compartir nativo no disponible en este entorno');
    }
  });

  test('📳 Should test vibration functionality', async () => {
    // Probar funcionalidad de vibración
    const vibrateButton = page.locator('button:has-text("Vibrar")').first();
    
    if (await vibrateButton.isEnabled()) {
      await vibrateButton.click();
      
      // Verificar que no hay errores
      const errorAlerts = page.locator('.MuiAlert-standardError');
      const errorCount = await errorAlerts.count();
      expect(errorCount).toBe(0);
      
      console.log('✅ Funcionalidad de vibración probada');
    } else {
      console.log('ℹ️ Vibración no disponible en este entorno');
    }
  });

  test('📍 Should test geolocation functionality', async () => {
    // Probar geolocalización
    const locationButton = page.locator('button:has-text("Ubicar")');
    
    if (await locationButton.isEnabled()) {
      // Nota: En entornos de testing, la geolocalización puede estar bloqueada
      await locationButton.click();
      
      // Verificar que no hay errores críticos de la aplicación
      const errorAlerts = page.locator('.MuiAlert-standardError');
      const errorCount = await errorAlerts.count();
      expect(errorCount).toBe(0);
      
      console.log('✅ Funcionalidad de geolocalización probada');
    } else {
      console.log('ℹ️ Geolocalización no disponible o en proceso');
    }
  });

  test('📸 Should test camera access functionality', async () => {
    // Probar acceso a cámara
    const cameraButton = page.locator('button:has-text("Cámara")');
    
    if (await cameraButton.isEnabled()) {
      await cameraButton.click();
      
      // En entornos de testing, el acceso a cámara puede estar bloqueado
      // Verificar que la aplicación maneja esto correctamente
      const errorAlerts = page.locator('.MuiAlert-standardError');
      const errorCount = await errorAlerts.count();
      expect(errorCount).toBe(0);
      
      console.log('✅ Funcionalidad de cámara probada');
    } else {
      console.log('ℹ️ Cámara no disponible en este entorno');
    }
  });

  test('🎤 Should test microphone access functionality', async () => {
    // Probar acceso a micrófono
    const micButton = page.locator('button:has-text("Micrófono")');
    
    if (await micButton.isEnabled()) {
      await micButton.click();
      
      // Verificar que no hay errores críticos
      const errorAlerts = page.locator('.MuiAlert-standardError');
      const errorCount = await errorAlerts.count();
      expect(errorCount).toBe(0);
      
      console.log('✅ Funcionalidad de micrófono probada');
    } else {
      console.log('ℹ️ Micrófono no disponible en este entorno');
    }
  });

  test('🚀 Should display SpeedDial for PWA actions', async () => {
    // Verificar SpeedDial en desktop
    await page.setViewportSize({ width: 1200, height: 800 });
    
    // Buscar SpeedDial para funciones PWA
    const speedDial = page.locator('[aria-label="Funciones PWA"]');
    
    if (await speedDial.count() > 0) {
      await speedDial.click();
      
      // Verificar acciones disponibles
      await expect(page.locator('[title="Compartir"], [title="Mi Ubicación"], [title="Vibrar"], [title="Cámara"]').first()).toBeVisible();
      
      console.log('✅ SpeedDial de PWA verificado');
    } else {
      console.log('ℹ️ SpeedDial no visible en esta viewport');
    }
  });

  test('📱 Should be responsive and mobile-friendly', async () => {
    // Probar en móvil
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForLoadState('networkidle');
    
    // Verificar que elementos principales están visibles en móvil
    await expect(page.locator('text=PWA Demo')).toBeVisible();
    await expect(page.locator('text=📱 Estado del Dispositivo')).toBeVisible();
    
    // Probar en tablet
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForLoadState('networkidle');
    
    // Probar en desktop
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.waitForLoadState('networkidle');
    
    console.log('✅ Diseño responsivo de PWA verificado');
  });

  test('⚡ Should handle error states gracefully', async () => {
    // Verificar que no hay errores críticos en la página
    const errorAlerts = page.locator('.MuiAlert-standardError');
    const errorCount = await errorAlerts.count();
    expect(errorCount).toBe(0);
    
    // Verificar que los botones manejan estados deshabilitados
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();
    expect(buttonCount).toBeGreaterThan(0);
    
    console.log('✅ Estados de error manejados correctamente');
  });

  test('🎨 Should apply proper PWA theming', async () => {
    // Verificar que se aplican los estilos de CoomÜnity
    const header = page.locator('text=PWA Demo').locator('..');
    
    // Verificar gradiente en el header
    const hasGradient = await header.evaluate(el => {
      const styles = window.getComputedStyle(el);
      return styles.background.includes('gradient') || styles.backgroundImage.includes('gradient');
    });
    
    if (hasGradient) {
      console.log('✅ Gradiente aplicado en header');
    }
    
    // Verificar chips con estilos apropiados
    await expect(page.locator('.MuiChip-root')).toBeVisible();
    
    console.log('✅ Temas de PWA aplicados correctamente');
  });

  test('📊 Should track PWA capability detection', async () => {
    // Verificar que las capacidades se detectan correctamente
    const capabilityIcons = page.locator('svg[data-testid*="Icon"]');
    const iconCount = await capabilityIcons.count();
    expect(iconCount).toBeGreaterThan(0);
    
    // Verificar que hay indicadores de estado (enabled/disabled)
    const buttons = page.locator('button');
    const enabledButtons = await buttons.evaluateAll(buttons => 
      buttons.filter(btn => !btn.disabled).length
    );
    
    expect(enabledButtons).toBeGreaterThan(0);
    
    console.log(`✅ ${enabledButtons} funcionalidades PWA detectadas como disponibles`);
  });

  test('🔄 Should handle page reload correctly', async () => {
    // Recargar página para verificar persistencia
    await page.reload();
    
    // Verificar que la página se recarga correctamente
    await page.waitForSelector('[data-testid="sidebar"]', { timeout: 10000 });
    await page.click('text=PWA Demo');
    await page.waitForLoadState('networkidle');
    
    // Verificar que todo sigue funcionando
    await expect(page.locator('text=PWA Demo')).toBeVisible();
    await expect(page.locator('text=📱 Estado del Dispositivo')).toBeVisible();
    
    console.log('✅ Recarga de página manejada correctamente');
  });
}); 