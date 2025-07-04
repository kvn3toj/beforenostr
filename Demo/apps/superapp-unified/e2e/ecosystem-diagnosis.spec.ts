import { test, expect } from '@playwright/test';

/**
 * DIAGNÓSTICO DEL ECOSISTEMA
 * Test simple para entender qué está pasando en las páginas
 */

test.describe('🔍 Ecosystem Diagnosis', () => {
  test('📱 SuperApp - Diagnóstico de página', async ({ page }) => {
    console.log('🔗 Accediendo a SuperApp...');
    await page.goto('http://localhost:3001');
    await page.waitForLoadState('networkidle');
    
    // Tomar screenshot
    await page.screenshot({ path: 'superapp-diagnosis.png', fullPage: true });
    
    // Verificar título
    const title = await page.title();
    console.log(`📄 Título de la página: ${title}`);
    
    // Buscar elementos de login
    const emailInputs = await page.locator('input[type="email"], input[name="email"]').count();
    const passwordInputs = await page.locator('input[type="password"], input[name="password"]').count();
    const buttons = await page.locator('button').count();
    
    console.log(`📧 Inputs de email encontrados: ${emailInputs}`);
    console.log(`🔒 Inputs de password encontrados: ${passwordInputs}`);
    console.log(`🔘 Botones encontrados: ${buttons}`);
    
    // Listar todos los inputs visibles
    const allInputs = await page.locator('input').all();
    console.log(`📝 Total de inputs: ${allInputs.length}`);
    
    for (let i = 0; i < allInputs.length; i++) {
      const input = allInputs[i];
      const type = await input.getAttribute('type');
      const name = await input.getAttribute('name');
      const placeholder = await input.getAttribute('placeholder');
      const id = await input.getAttribute('id');
      console.log(`  Input ${i}: type="${type}", name="${name}", placeholder="${placeholder}", id="${id}"`);
    }
    
    // Verificar si hay errores en consola
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    await page.waitForTimeout(2000);
    
    if (errors.length > 0) {
      console.log('❌ Errores de consola encontrados:');
      errors.forEach(error => console.log(`  - ${error}`));
    } else {
      console.log('✅ No hay errores de consola');
    }
  });

  test('🏛️ Admin Frontend - Diagnóstico de página', async ({ page }) => {
    console.log('🔗 Accediendo a Admin Frontend...');
    await page.goto('http://localhost:3003');
    await page.waitForLoadState('networkidle');
    
    // Tomar screenshot
    await page.screenshot({ path: 'admin-diagnosis.png', fullPage: true });
    
    // Verificar título
    const title = await page.title();
    console.log(`📄 Título de la página: ${title}`);
    
    // Buscar elementos de login
    const emailInputs = await page.locator('input[type="email"], input[name="email"]').count();
    const passwordInputs = await page.locator('input[type="password"], input[name="password"]').count();
    const buttons = await page.locator('button').count();
    
    console.log(`📧 Inputs de email encontrados: ${emailInputs}`);
    console.log(`🔒 Inputs de password encontrados: ${passwordInputs}`);
    console.log(`🔘 Botones encontrados: ${buttons}`);
    
    // Listar todos los inputs visibles
    const allInputs = await page.locator('input').all();
    console.log(`📝 Total de inputs: ${allInputs.length}`);
    
    for (let i = 0; i < allInputs.length; i++) {
      const input = allInputs[i];
      const type = await input.getAttribute('type');
      const name = await input.getAttribute('name');
      const placeholder = await input.getAttribute('placeholder');
      const id = await input.getAttribute('id');
      console.log(`  Input ${i}: type="${type}", name="${name}", placeholder="${placeholder}", id="${id}"`);
    }
    
    // Verificar si hay errores en consola
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    await page.waitForTimeout(2000);
    
    if (errors.length > 0) {
      console.log('❌ Errores de consola encontrados:');
      errors.forEach(error => console.log(`  - ${error}`));
    } else {
      console.log('✅ No hay errores de consola');
    }
  });

  test('🔗 Verificación de conectividad', async ({ page }) => {
    console.log('🔍 Verificando conectividad del ecosistema...');
    
    // Verificar backend
    try {
      const backendResponse = await fetch('http://localhost:3002/health');
      const backendData = await backendResponse.json();
      console.log(`✅ Backend: ${backendResponse.status} - ${backendData.message}`);
    } catch (error) {
      console.log(`❌ Backend: Error - ${error}`);
    }
    
    // Verificar SuperApp
    try {
      const superappResponse = await fetch('http://localhost:3001');
      console.log(`✅ SuperApp: ${superappResponse.status}`);
    } catch (error) {
      console.log(`❌ SuperApp: Error - ${error}`);
    }
    
    // Verificar Admin
    try {
      const adminResponse = await fetch('http://localhost:3003');
      console.log(`✅ Admin: ${adminResponse.status}`);
    } catch (error) {
      console.log(`❌ Admin: Error - ${error}`);
    }
  });
}); 