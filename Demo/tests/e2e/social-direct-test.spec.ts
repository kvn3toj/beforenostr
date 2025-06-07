/**
 * 🤝 Test Directo del Módulo Social
 * 
 * Verificación directa de la funcionalidad del módulo Social
 * sin problemas de navegación ambigua.
 */

import { test, expect } from '@playwright/test';

test.describe('Social Module - Direct Testing', () => {

  test('Verificar que el módulo Social carga correctamente', async ({ page }) => {
    // Ir directamente a la página de Social
    await page.goto('http://localhost:3000/social');
    await page.waitForLoadState('networkidle');

    console.log('🤝 Verificando carga del módulo Social...');

    // Verificar título principal
    await expect(page.locator('h1')).toContainText('Social CoomÜnity');
    
    // Verificar elementos principales
    await expect(page.locator('text=Conecta con tu comunidad')).toBeVisible();
    await expect(page.locator('text=Conversaciones')).toBeVisible();
    
    console.log('✅ Módulo Social carga correctamente');
  });

  test('Verificar lista de matches/conversaciones', async ({ page }) => {
    await page.goto('http://localhost:3000/social');
    await page.waitForLoadState('networkidle');

    console.log('💬 Verificando lista de conversaciones...');

    // Esperar a que los datos se carguen
    await page.waitForTimeout(2000);

    // Verificar que hay conversaciones
    const matchItems = page.locator('[data-testid="match-item"], .MuiListItem-root');
    await expect(matchItems.first()).toBeVisible({ timeout: 10000 });

    // Verificar que al menos aparece el match de Juan Manuel (del mock data)
    await expect(page.locator('text=Juan Manuel')).toBeVisible({ timeout: 5000 });
    
    console.log('✅ Lista de conversaciones funciona correctamente');
  });

  test('Verificar funcionalidad de búsqueda', async ({ page }) => {
    await page.goto('http://localhost:3000/social');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    console.log('🔍 Verificando búsqueda de conversaciones...');

    // Buscar por "Juan"
    const searchInput = page.locator('input[placeholder*="Buscar"]');
    await expect(searchInput).toBeVisible();
    
    await searchInput.fill('Juan');
    await page.waitForTimeout(1000);

    // Verificar que se filtra correctamente
    await expect(page.locator('text=Juan Manuel')).toBeVisible();
    
    console.log('✅ Búsqueda funciona correctamente');
  });

  test('Verificar selección de conversación y área de chat', async ({ page }) => {
    await page.goto('http://localhost:3000/social');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    console.log('💬 Verificando selección de conversación...');

    // Seleccionar primera conversación
    const firstMatch = page.locator('.MuiListItem-root').first();
    await firstMatch.click();
    await page.waitForTimeout(1000);

    // Verificar que aparece el área de chat
    await expect(page.locator('text=En línea', { timeout: 5000 })).toBeVisible();
    
    // Verificar input de mensaje
    const messageInput = page.locator('input[placeholder*="Escribe tu mensaje"]');
    await expect(messageInput).toBeVisible();

    console.log('✅ Área de chat funciona correctamente');
  });

  test('Verificar envío de mensaje', async ({ page }) => {
    await page.goto('http://localhost:3000/social');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    console.log('📝 Verificando envío de mensaje...');

    // Seleccionar primera conversación
    const firstMatch = page.locator('.MuiListItem-root').first();
    await firstMatch.click();
    await page.waitForTimeout(1000);

    // Escribir y enviar mensaje
    const messageInput = page.locator('input[placeholder*="Escribe tu mensaje"]');
    const testMessage = 'Mensaje de prueba desde Playwright';
    
    await messageInput.fill(testMessage);
    
    // Buscar botón de enviar
    const sendButton = page.locator('button[aria-label*="send"], button:has(svg)').last();
    await sendButton.click();
    
    // Verificar que el mensaje aparece
    await expect(page.locator(`text=${testMessage}`)).toBeVisible({ timeout: 5000 });
    
    console.log('✅ Envío de mensaje funciona correctamente');
  });

  test('Verificar estados de usuario', async ({ page }) => {
    await page.goto('http://localhost:3000/social');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    console.log('👤 Verificando estados de usuario...');

    // Verificar que hay indicadores de estado
    const statusIndicators = page.locator('[style*="background-color"], [style*="bgcolor"]');
    await expect(statusIndicators.first()).toBeVisible({ timeout: 5000 });
    
    console.log('✅ Estados de usuario funcionan correctamente');
  });

  test('Verificar responsive design', async ({ page }) => {
    console.log('📱 Verificando diseño responsive...');

    // Desktop
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('http://localhost:3000/social');
    await page.waitForLoadState('networkidle');
    
    // Verificar que en desktop se ven ambas columnas
    await expect(page.locator('text=Conversaciones')).toBeVisible();
    await expect(page.locator('text=Selecciona una conversación')).toBeVisible();

    // Mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(1000);
    
    // En mobile también debe funcionar
    await expect(page.locator('text=Conversaciones')).toBeVisible();
    
    console.log('✅ Diseño responsive funciona correctamente');
  });

  test('Verificar componentes de UI Material UI', async ({ page }) => {
    await page.goto('http://localhost:3000/social');
    await page.waitForLoadState('networkidle');

    console.log('🎨 Verificando componentes Material UI...');

    // Verificar elementos MUI específicos
    await expect(page.locator('.MuiPaper-root')).toBeVisible();
    await expect(page.locator('.MuiAvatar-root')).toBeVisible();
    await expect(page.locator('.MuiTypography-root')).toBeVisible();
    
    console.log('✅ Componentes Material UI funcionan correctamente');
  });

}); 