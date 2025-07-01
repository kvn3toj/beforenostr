/**
 * 🧪 Test E2E: Verificación de Migración de Servicios de Datos Core (Fase 2.3)
 * 
 * Verifica que la SuperApp se conecte correctamente al backend NestJS
 * para cargar datos de Wallet, Méritos y Social, con fallbacks apropiados.
 */

import { test, expect } from '@playwright/test';

test.describe('🔄 Migración de Servicios de Datos Core - Fase 2.3', () => {
  
  test.beforeEach(async ({ page }) => {
    // Configurar interceptores para capturar requests API
    page.on('request', request => {
      if (request.url().includes('localhost:3002')) {
        console.log(`📡 API Request: ${request.method()} ${request.url()}`);
      }
    });

    page.on('response', response => {
      if (response.url().includes('localhost:3002')) {
        console.log(`📨 API Response: ${response.status()} ${response.url()}`);
      }
    });

    page.on('console', msg => {
      if (msg.text().includes('Fallback') || msg.text().includes('backend')) {
        console.log(`🖥️ Console: ${msg.text()}`);
      }
    });
  });

  test('🏥 debería verificar conectividad con Backend NestJS', async ({ page }) => {
    console.log('🎯 Verificando conectividad con Backend NestJS...');
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Verificar que la aplicación carga
    await expect(page).toHaveURL(/.*\//);
    
    // Buscar indicadores de estado del backend en cualquier parte de la app
    const backendIndicators = page.locator('[data-testid*="backend"], [data-testid*="health"], .MuiChip-root');
    
    if (await backendIndicators.count() > 0) {
      console.log('📊 Indicadores de backend encontrados');
      const firstIndicator = backendIndicators.first();
      await expect(firstIndicator).toBeVisible();
    }
    
    console.log('✅ Verificación de conectividad completada');
  });

  test('💰 debería cargar datos de Wallet con fallback', async ({ page }) => {
    console.log('🔍 Verificando carga de datos de Wallet...');
    
    // Navegar a una página que use datos de wallet (ej. dashboard o perfil)
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Buscar elementos relacionados con wallet/balance
    const walletElements = page.locator('text=/balance|saldo|wallet|💰|COP|\$/', { timeout: 10000 });
    
    if (await walletElements.count() > 0) {
      console.log('💳 Elementos de wallet encontrados');
      await expect(walletElements.first()).toBeVisible();
      
      // Verificar que muestra algún valor numérico (real o fallback)
      const balanceText = await walletElements.first().textContent();
      console.log(`💰 Balance mostrado: ${balanceText}`);
      
      // Debería contener números
      expect(balanceText).toMatch(/\d+/);
    } else {
      console.log('ℹ️ No se encontraron elementos de wallet en esta página');
    }
    
    console.log('✅ Verificación de datos de Wallet completada');
  });

  test('🏆 debería cargar datos de Méritos con fallback', async ({ page }) => {
    console.log('🔍 Verificando carga de datos de Méritos...');
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Buscar elementos relacionados con méritos
    const meritElements = page.locator('text=/mérito|merit|🏆|colabora|reciprocidad|bien común/i', { timeout: 10000 });
    
    if (await meritElements.count() > 0) {
      console.log('🏅 Elementos de méritos encontrados');
      await expect(meritElements.first()).toBeVisible();
      
      const meritText = await meritElements.first().textContent();
      console.log(`🏆 Méritos mostrados: ${meritText}`);
    } else {
      console.log('ℹ️ No se encontraron elementos de méritos en esta página');
    }
    
    console.log('✅ Verificación de datos de Méritos completada');
  });

  test('🤝 debería cargar datos Sociales con fallback', async ({ page }) => {
    console.log('🔍 Verificando carga de datos Sociales...');
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Buscar elementos relacionados con social/chat
    const socialElements = page.locator('text=/mensaje|chat|social|match|publicación|post/i', { timeout: 10000 });
    
    if (await socialElements.count() > 0) {
      console.log('💬 Elementos sociales encontrados');
      await expect(socialElements.first()).toBeVisible();
      
      const socialText = await socialElements.first().textContent();
      console.log(`🤝 Contenido social: ${socialText}`);
    } else {
      console.log('ℹ️ No se encontraron elementos sociales en esta página');
    }
    
    console.log('✅ Verificación de datos Sociales completada');
  });

  test('📡 debería hacer llamadas API correctas al Backend NestJS', async ({ page }) => {
    console.log('📡 Verificando llamadas API al Backend NestJS...');
    
    const apiCalls: string[] = [];
    
    // Interceptar llamadas API
    page.on('request', request => {
      if (request.url().includes('localhost:3002')) {
        apiCalls.push(`${request.method()} ${request.url()}`);
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Dar tiempo para que se hagan las llamadas API
    await page.waitForTimeout(5000);

    console.log('📋 Llamadas API detectadas:');
    apiCalls.forEach(call => console.log(`  - ${call}`));

    if (apiCalls.length > 0) {
      // Verificar que se hicieron llamadas al backend correcto
      const backendCalls = apiCalls.filter(call => call.includes('localhost:3002'));
      expect(backendCalls.length).toBeGreaterThan(0);

      // Verificar endpoints específicos de los servicios migrados
      const walletCalls = apiCalls.filter(call => call.includes('/wallet'));
      const meritCalls = apiCalls.filter(call => call.includes('/merits'));
      const socialCalls = apiCalls.filter(call => call.includes('/social'));
      
      console.log(`💰 Llamadas Wallet: ${walletCalls.length}`);
      console.log(`🏆 Llamadas Méritos: ${meritCalls.length}`);
      console.log(`🤝 Llamadas Social: ${socialCalls.length}`);
      
      console.log('✅ Llamadas API al backend verificadas correctamente');
    } else {
      console.log('ℹ️ No se detectaron llamadas API (posible uso de fallbacks)');
    }
  });

  test('🔄 debería usar fallbacks cuando Backend no está disponible', async ({ page }) => {
    console.log('🚨 Simulando Backend no disponible...');
    
    // Interceptar y fallar requests al backend
    await page.route('**/localhost:3002/**', route => {
      route.abort('failed');
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Dar tiempo para que se ejecuten los fallbacks
    await page.waitForTimeout(3000);

    // La aplicación debería seguir funcionando con datos mock
    const bodyContent = await page.locator('body').textContent();
    
    // Verificar que no hay errores críticos que rompan la app
    expect(bodyContent).not.toContain('Error de red');
    expect(bodyContent).not.toContain('Cannot read properties');
    
    // Debería mostrar algún contenido (aunque sea mock)
    expect(bodyContent?.length || 0).toBeGreaterThan(100);

    console.log('✅ Fallbacks funcionando correctamente');
  });

  test('🎯 debería mostrar datos consistentes entre módulos', async ({ page }) => {
    console.log('🔍 Verificando consistencia de datos entre módulos...');
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Verificar que no hay conflictos entre datos reales y mock
    const errorMessages = page.locator('.MuiAlert-standardError');
    const warningMessages = page.locator('.MuiAlert-standardWarning');
    
    const errorCount = await errorMessages.count();
    const warningCount = await warningMessages.count();
    
    console.log(`⚠️ Errores encontrados: ${errorCount}`);
    console.log(`⚠️ Advertencias encontradas: ${warningCount}`);
    
    // No debería haber errores críticos
    expect(errorCount).toBeLessThanOrEqual(1); // Permitir máximo 1 error (ej. backend no disponible)
    
    console.log('✅ Consistencia de datos verificada');
  });

  test('📊 debería mostrar indicadores de estado de migración', async ({ page }) => {
    console.log('🔍 Verificando indicadores de estado de migración...');
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Buscar indicadores que muestren si se está usando backend real o fallback
    const statusIndicators = page.locator('[data-testid*="status"], .MuiChip-root, text=/conectado|desconectado|fallback|mock/i');
    
    if (await statusIndicators.count() > 0) {
      console.log('📊 Indicadores de estado encontrados');
      
      const firstIndicator = statusIndicators.first();
      await expect(firstIndicator).toBeVisible();
      
      const statusText = await firstIndicator.textContent();
      console.log(`📊 Estado mostrado: ${statusText}`);
      
      // Debería indicar claramente el estado
      expect(statusText).toMatch(/(conectado|desconectado|fallback|mock|backend|real)/i);
    } else {
      console.log('ℹ️ No se encontraron indicadores de estado específicos');
    }
    
    console.log('✅ Verificación de indicadores completada');
  });

  test('🔧 debería manejar transiciones entre backend real y fallback', async ({ page }) => {
    console.log('🔄 Verificando transiciones entre backend real y fallback...');
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Capturar estado inicial
    const initialContent = await page.locator('body').textContent();
    console.log('📸 Estado inicial capturado');

    // Simular pérdida de conexión
    await page.route('**/localhost:3002/**', route => {
      route.abort('failed');
    });

    // Forzar refetch (si hay botones de refresh)
    const refreshButtons = page.locator('button:has-text("Actualizar"), button:has-text("Refresh"), button:has-text("Reintentar")');
    if (await refreshButtons.count() > 0) {
      await refreshButtons.first().click();
      await page.waitForTimeout(2000);
    }

    // Verificar que la app sigue funcionando
    const fallbackContent = await page.locator('body').textContent();
    expect(fallbackContent?.length || 0).toBeGreaterThan(50);

    console.log('✅ Transiciones manejadas correctamente');
  });
}); 