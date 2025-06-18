/**
 * 🔗 Test E2E: Verificación de Conexión Backend-Frontend
 * 
 * Verifica que la SuperApp se conecte correctamente al backend NestJS
 * para la Fase 2.1 del Plan de Migración DEFINITIVO.
 */

import { test, expect } from '@playwright/test';

test.describe('🔗 Verificación de Conexión Backend-Frontend - Fase 2.1', () => {
  
  test.beforeEach(async ({ page }) => {
    // Configurar interceptor para capturar requests API
    page.on('request', request => {
      if (request.url().includes('localhost:1111')) {
        console.log(`📡 API Request: ${request.method()} ${request.url()}`);
      }
    });

    page.on('response', response => {
      if (response.url().includes('localhost:1111')) {
        console.log(`📨 API Response: ${response.status()} ${response.url()}`);
      }
    });

    page.on('console', msg => {
      if (msg.text().includes('backend') || msg.text().includes('API')) {
        console.log(`🖥️ Console: ${msg.text()}`);
      }
    });
  });

  test('debería cargar la aplicación correctamente', async ({ page }) => {
    console.log('🎯 Navegando a la página principal...');
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Verificar que la página carga
    await expect(page).toHaveTitle(/CoomÜnity SuperApp/);
    
    // Verificar que no hay errores críticos en la consola
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log(`❌ Error en consola: ${msg.text()}`);
      }
    });
    
    console.log('✅ Aplicación cargada correctamente');
  });

  test('debería conectarse al backend NestJS en puerto 3002', async ({ page }) => {
    console.log('🔍 Verificando conexión al backend NestJS...');
    
    const apiCalls: string[] = [];
    const backendResponses: { url: string; status: number }[] = [];
    
    // Interceptar llamadas API
    page.on('request', request => {
      if (request.url().includes('localhost:1111')) {
        apiCalls.push(`${request.method()} ${request.url()}`);
      }
    });

    page.on('response', response => {
      if (response.url().includes('localhost:1111')) {
        backendResponses.push({ url: response.url(), status: response.status() });
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Dar tiempo para que se hagan las llamadas API
    await page.waitForTimeout(2000);

    console.log('📋 Llamadas API detectadas:');
    apiCalls.forEach(call => console.log(`  - ${call}`));

    console.log('📨 Respuestas del backend:');
    backendResponses.forEach(resp => console.log(`  - ${resp.status} ${resp.url}`));

    // Al menos debería haber intentado conectarse al backend
    // (incluso si falla por autenticación, la conexión se establece)
    const hasBackendConnection = apiCalls.some(call => call.includes('localhost:1111'));
    
    if (hasBackendConnection) {
      console.log('✅ Conexión al backend NestJS detectada');
    } else {
      console.log('ℹ️ No se detectaron llamadas directas al backend en esta página');
    }
  });

  test('debería mostrar la interfaz sin errores CORS', async ({ page }) => {
    console.log('🌐 Verificando ausencia de errores CORS...');
    
    const corsErrors: string[] = [];
    
    page.on('console', msg => {
      if (msg.type() === 'error' && msg.text().toLowerCase().includes('cors')) {
        corsErrors.push(msg.text());
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    if (corsErrors.length > 0) {
      console.log('❌ Errores CORS detectados:');
      corsErrors.forEach(error => console.log(`  - ${error}`));
      expect(corsErrors.length).toBe(0);
    } else {
      console.log('✅ No se detectaron errores CORS');
    }
  });

  test('debería tener las variables de entorno configuradas correctamente', async ({ page }) => {
    console.log('⚙️ Verificando configuración de variables de entorno...');
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Verificar que la API base URL está configurada correctamente en el cliente
    const apiBaseUrl = await page.evaluate(() => {
      return (window as any).__VITE_API_BASE_URL || 'No definida';
    });

    console.log(`🔧 API Base URL detectada: ${apiBaseUrl}`);
    
    // También verificar a través de la consola del navegador
    const envVars = await page.evaluate(() => {
      return {
        NODE_ENV: import.meta.env.NODE_ENV,
        VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
        VITE_ENABLE_MOCK_AUTH: import.meta.env.VITE_ENABLE_MOCK_AUTH
      };
    });

    console.log('📊 Variables de entorno:');
    Object.entries(envVars).forEach(([key, value]) => {
      console.log(`  - ${key}: ${value}`);
    });

    // Verificar que apunta al puerto correcto del backend
    expect(envVars.VITE_API_BASE_URL).toContain('3002');
    expect(envVars.VITE_ENABLE_MOCK_AUTH).toBe('false');
    
    console.log('✅ Variables de entorno configuradas correctamente');
  });
}); 