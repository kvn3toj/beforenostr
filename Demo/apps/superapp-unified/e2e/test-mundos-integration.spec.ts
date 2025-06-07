/**
 * 🧪 Test E2E: Integración de Mundos con Backend NestJS
 * 
 * Verifica que la SuperApp se conecte correctamente al backend NestJS
 * para cargar y mostrar datos reales de mundos.
 */

import { test, expect } from '@playwright/test';

test.describe('🌍 Integración de Mundos con Backend NestJS', () => {
  
  test.beforeEach(async ({ page }) => {
    // Configurar interceptor para capturar requests API
    page.on('request', request => {
      if (request.url().includes('/mundos')) {
        console.log(`📡 API Request: ${request.method()} ${request.url()}`);
      }
    });

    page.on('response', response => {
      if (response.url().includes('/mundos')) {
        console.log(`📨 API Response: ${response.status()} ${response.url()}`);
      }
    });

    page.on('console', msg => {
      if (msg.text().includes('mundos') || msg.text().includes('backend')) {
        console.log(`🖥️ Console: ${msg.text()}`);
      }
    });
  });

  test('debería cargar la página de mundos correctamente', async ({ page }) => {
    console.log('🎯 Navegando a la página de mundos...');
    
    await page.goto('/mundos');
    await page.waitForLoadState('networkidle');

    // Verificar que la página carga
    await expect(page).toHaveURL(/.*\/mundos/);
    
    // Verificar título principal
    await expect(page.getByRole('heading', { name: /mundos coomunity/i })).toBeVisible();
    
    console.log('✅ Página de mundos cargada correctamente');
  });

  test('debería mostrar indicadores de estado del backend', async ({ page }) => {
    console.log('🔍 Verificando indicadores de estado del backend...');
    
    await page.goto('/mundos');
    await page.waitForLoadState('networkidle');

    // Esperar a que aparezcan los chips de estado
    await page.waitForSelector('[data-testid*="chip"], .MuiChip-root', { timeout: 10000 });

    // Verificar que hay indicadores de estado del backend
    const backendChips = page.locator('.MuiChip-root');
    const chipCount = await backendChips.count();
    
    expect(chipCount).toBeGreaterThan(0);
    console.log(`📊 Encontrados ${chipCount} indicadores de estado`);

    // Verificar que al menos uno menciona el backend
    const backendChip = page.locator('.MuiChip-root').filter({ hasText: /backend|conectado|desconectado/i });
    await expect(backendChip.first()).toBeVisible();
    
    console.log('✅ Indicadores de estado del backend visibles');
  });

  test('debería cargar mundos desde el backend NestJS', async ({ page }) => {
    console.log('🔗 Verificando carga de mundos desde backend NestJS...');
    
    await page.goto('/mundos');

    // Esperar el spinner de carga
    const loadingSpinner = page.locator('.MuiCircularProgress-root');
    if (await loadingSpinner.isVisible()) {
      console.log('⏳ Spinner de carga detectado, esperando...');
      await loadingSpinner.waitFor({ state: 'hidden', timeout: 15000 });
    }

    // Verificar que no hay errores mostrados
    const errorAlert = page.locator('.MuiAlert-standardError');
    const hasError = await errorAlert.isVisible();
    
    if (hasError) {
      const errorText = await errorAlert.textContent();
      console.log(`⚠️ Error detectado: ${errorText}`);
    }

    // Debería mostrar mundos o un mensaje de que no hay mundos
    const hasCards = await page.locator('.MuiCard-root').count() > 0;
    const hasEmptyMessage = await page.locator('text=No hay mundos disponibles').isVisible();
    
    expect(hasCards || hasEmptyMessage).toBeTruthy();
    
    if (hasCards) {
      const cardCount = await page.locator('.MuiCard-root').count();
      console.log(`🎯 ${cardCount} mundos cargados desde el backend`);
      
      // Verificar que las tarjetas tienen contenido esperado
      const firstCard = page.locator('.MuiCard-root').first();
      await expect(firstCard.locator('h6')).toBeVisible(); // Título del mundo
      await expect(firstCard.getByRole('button', { name: /explorar mundo/i })).toBeVisible();
      
      console.log('✅ Mundos cargados correctamente con datos del backend');
    } else {
      console.log('ℹ️ No hay mundos disponibles en el backend');
    }
  });

  test('debería mostrar información de debug en desarrollo', async ({ page }) => {
    console.log('🐛 Verificando información de debug...');
    
    await page.goto('/mundos');
    await page.waitForLoadState('networkidle');

    // Buscar la sección de debug (solo visible en desarrollo)
    const debugSection = page.locator('text=Debug Info');
    
    if (await debugSection.isVisible()) {
      console.log('🔍 Sección de debug encontrada');
      
      // Verificar que contiene información del backend
      await expect(page.locator('text=Backend URL')).toBeVisible();
      await expect(page.locator('text=Mundos cargados')).toBeVisible();
      await expect(page.locator('text=Health status')).toBeVisible();
      
      console.log('✅ Información de debug visible correctamente');
    } else {
      console.log('ℹ️ Sección de debug no visible (posiblemente en producción)');
    }
  });

  test('debería hacer llamadas API correctas al backend', async ({ page }) => {
    console.log('📡 Verificando llamadas API al backend...');
    
    const apiCalls: string[] = [];
    
    // Interceptar llamadas API
    page.on('request', request => {
      if (request.url().includes('localhost:3002')) {
        apiCalls.push(`${request.method()} ${request.url()}`);
      }
    });

    await page.goto('/mundos');
    await page.waitForLoadState('networkidle');
    
    // Dar tiempo para que se hagan las llamadas API
    await page.waitForTimeout(3000);

    console.log('📋 Llamadas API detectadas:');
    apiCalls.forEach(call => console.log(`  - ${call}`));

    // Verificar que se hicieron llamadas al backend correcto
    const backendCalls = apiCalls.filter(call => call.includes('localhost:3002'));
    expect(backendCalls.length).toBeGreaterThan(0);

    // Verificar que se llamó al endpoint de mundos
    const mundosCalls = apiCalls.filter(call => call.includes('/mundos'));
    expect(mundosCalls.length).toBeGreaterThan(0);

    console.log('✅ Llamadas API al backend verificadas correctamente');
  });

  test('debería manejar errores de conexión graciosamente', async ({ page }) => {
    console.log('🚨 Simulando error de conexión...');
    
    // Interceptar y fallar requests al backend
    await page.route('**/mundos/**', route => {
      route.abort('failed');
    });

    await page.goto('/mundos');
    await page.waitForLoadState('networkidle');

    // Debería mostrar un mensaje de error
    const errorAlert = page.locator('.MuiAlert-standardError');
    await expect(errorAlert).toBeVisible({ timeout: 10000 });

    // Debería mostrar botón de reintentar
    const retryButton = page.getByRole('button', { name: /reintentar/i });
    await expect(retryButton).toBeVisible();

    console.log('✅ Manejo de errores verificado correctamente');
  });

  test('debería refrescar datos cuando se hace clic en reintentar', async ({ page }) => {
    console.log('🔄 Verificando funcionalidad de reintentar...');
    
    let requestCount = 0;
    
    page.on('request', request => {
      if (request.url().includes('/mundos')) {
        requestCount++;
        console.log(`📡 Request #${requestCount} a mundos`);
      }
    });

    // Primero interceptar y fallar
    await page.route('**/mundos/**', route => {
      route.abort('failed');
    });

    await page.goto('/mundos');
    await page.waitForLoadState('networkidle');

    // Verificar que hay error
    const errorAlert = page.locator('.MuiAlert-standardError');
    await expect(errorAlert).toBeVisible();

    // Remover la intercepción para permitir que funcione
    await page.unroute('**/mundos/**');

    // Hacer clic en reintentar
    const retryButton = page.getByRole('button', { name: /reintentar/i });
    await retryButton.click();

    // Verificar que se hizo un nuevo request
    await page.waitForTimeout(2000);
    expect(requestCount).toBeGreaterThan(1);

    console.log('✅ Funcionalidad de reintentar verificada');
  });

}); 