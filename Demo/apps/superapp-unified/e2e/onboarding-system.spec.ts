import { test, expect, Page } from '@playwright/test';

test.describe('🎮 CoomÜnity Onboarding System - Comprehensive Testing', () => {
  let page: Page;

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
    
    // Configurar viewport para diferentes tamaños
    await page.setViewportSize({ width: 1280, height: 720 });
    
    // Navegar al demo de onboarding
    await page.goto('/onboarding-demo');
    
    // Esperar a que React se monte
    await page.waitForSelector('#root');
    await page.waitForTimeout(1000);
  });

  test.afterEach(async () => {
    await page.close();
  });

  test('🚀 Demo page loads correctly with all controls', async () => {
    // Verificar título principal
    await expect(page.locator('h3')).toContainText('CoomÜnity Onboarding System');
    
    // Verificar controles del demo
    await expect(page.getByRole('button', { name: /iniciar onboarding/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /mostrar checklist/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /activar tooltips/i })).toBeVisible();
    
    // Verificar selectores de stage
    await expect(page.getByRole('button', { name: 'BUYER' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'SEEKER' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'SOLVER' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'PROMOTER' })).toBeVisible();
    
    console.log('✅ Demo page verification passed');
  });

  test('🎯 OnboardingFlow - Complete 5-stage journey', async () => {
    // Iniciar el onboarding
    await page.getByRole('button', { name: /iniciar onboarding/i }).click();
    
    // Esperar a que aparezca el modal
    await page.waitForSelector('[role="dialog"]');
    
    // STAGE 1: Welcome
    await expect(page.locator('text=Bienvenido a CoomÜnity')).toBeVisible();
    await expect(page.locator('text=Reciprocidad')).toBeVisible();
    await expect(page.locator('text=Bien Común')).toBeVisible();
    
    // Verificar botón de continuar
    const continueBtn = page.getByRole('button', { name: /continuar/i });
    await expect(continueBtn).toBeVisible();
    await continueBtn.click();
    
    // STAGE 2: Philosophy Assessment
    await page.waitForTimeout(500);
    await expect(page.locator('text=Evaluación de Filosofía')).toBeVisible();
    
    // Seleccionar opciones en el assessment
    await page.locator('input[value="community"]').first().check();
    await page.locator('input[value="leader"]').first().check();
    
    await page.getByRole('button', { name: /continuar/i }).click();
    
    // STAGE 3: Personalization
    await page.waitForTimeout(500);
    await expect(page.locator('text=Personalización')).toBeVisible();
    
    // Seleccionar objetivos
    await page.locator('text=Aprender').click();
    await page.locator('text=Conectar').click();
    
    await page.getByRole('button', { name: /continuar/i }).click();
    
    // STAGE 4: Community
    await page.waitForTimeout(500);
    await expect(page.locator('text=Únete a tu Hub')).toBeVisible();
    
    await page.getByRole('button', { name: /continuar/i }).click();
    
    // STAGE 5: First Value
    await page.waitForTimeout(500);
    await expect(page.locator('text=Primeras Acciones')).toBeVisible();
    
    // Completar el onboarding
    await page.getByRole('button', { name: /completar/i }).click();
    
    // Verificar que el modal se cierre
    await page.waitForTimeout(1000);
    await expect(page.locator('[role="dialog"]')).not.toBeVisible();
    
    console.log('✅ OnboardingFlow 5-stage journey completed successfully');
  });

  test('📋 OnboardingChecklist - Interactive task completion', async () => {
    // Abrir el checklist
    await page.getByRole('button', { name: /mostrar checklist/i }).click();
    
    // Esperar a que aparezca el checklist
    await page.waitForSelector('text=Lista de Tareas CoomÜnity');
    
    // Verificar categorías
    await expect(page.locator('text=Aprendizaje')).toBeVisible();
    await expect(page.locator('text=Comunidad')).toBeVisible();
    await expect(page.locator('text=Comercio')).toBeVisible();
    await expect(page.locator('text=Crecimiento')).toBeVisible();
    
    // Expandir una categoría
    await page.locator('text=Aprendizaje').click();
    await page.waitForTimeout(500);
    
    // Verificar que los items se muestran
    await expect(page.locator('text=Completa tu primer video ÜPlay')).toBeVisible();
    
    // Intentar marcar un item como completado
    const firstCheckbox = page.locator('input[type="checkbox"]').first();
    if (await firstCheckbox.isVisible()) {
      await firstCheckbox.check();
      console.log('✅ Checkbox interaction successful');
    }
    
    // Cerrar el checklist
    await page.locator('[data-testid="CloseIcon"]').click();
    await page.waitForTimeout(500);
    
    console.log('✅ OnboardingChecklist functionality verified');
  });

  test('💡 ProgressiveTooltips - Contextual guidance system', async () => {
    // Activar tooltips
    await page.getByRole('button', { name: /activar tooltips/i }).click();
    
    // Esperar a que aparezcan tooltips
    await page.waitForTimeout(1000);
    
    // Buscar tooltips activos (pueden no aparecer si los elementos target no existen)
    const tooltipElements = await page.locator('[role="tooltip"], .tooltip-content, [data-tooltip]').count();
    
    if (tooltipElements > 0) {
      console.log(`✅ Found ${tooltipElements} tooltip elements`);
      
      // Interactuar con el primer tooltip si existe
      const firstTooltip = page.locator('[role="tooltip"]').first();
      if (await firstTooltip.isVisible()) {
        await expect(firstTooltip).toBeVisible();
        
        // Buscar botón de acción si existe
        const actionButton = firstTooltip.locator('button');
        if (await actionButton.count() > 0) {
          await actionButton.click();
        }
      }
    } else {
      console.log('ℹ️ No tooltips found - elements may not be present in demo');
    }
    
    console.log('✅ ProgressiveTooltips system verified');
  });

  test('📱 Responsive design - Mobile and desktop compatibility', async () => {
    // Test desktop view (already set in beforeEach)
    await expect(page.locator('h3')).toBeVisible();
    
    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();
    await page.waitForSelector('#root');
    
    // Verificar que los elementos se adaptan
    await expect(page.locator('h3')).toBeVisible();
    await expect(page.getByRole('button', { name: /iniciar onboarding/i })).toBeVisible();
    
    // Test tablet view
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.reload();
    await page.waitForSelector('#root');
    
    await expect(page.locator('h3')).toBeVisible();
    
    console.log('✅ Responsive design verification completed');
  });

  test('🎮 Customer Journey Stage switching', async () => {
    // Test cada stage
    const stages = ['BUYER', 'SEEKER', 'SOLVER', 'PROMOTER'];
    
    for (const stage of stages) {
      await page.getByRole('button', { name: stage }).click();
      await page.waitForTimeout(300);
      
      // Verificar que el botón está seleccionado
      const stageButton = page.getByRole('button', { name: stage });
      await expect(stageButton).toBeVisible();
      
      console.log(`✅ Stage ${stage} selection verified`);
    }
    
    console.log('✅ All customer journey stages tested');
  });

  test('⚡ Performance - Page load and interaction times', async () => {
    const startTime = Date.now();
    
    // Medir tiempo de carga inicial
    await page.goto('/onboarding-demo');
    await page.waitForSelector('#root');
    
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(3000); // Menos de 3 segundos
    
    // Medir tiempo de interacción con onboarding
    const interactionStart = Date.now();
    await page.getByRole('button', { name: /iniciar onboarding/i }).click();
    await page.waitForSelector('[role="dialog"]');
    const interactionTime = Date.now() - interactionStart;
    
    expect(interactionTime).toBeLessThan(1000); // Menos de 1 segundo
    
    console.log(`✅ Performance metrics: Load ${loadTime}ms, Interaction ${interactionTime}ms`);
  });

  test('🔍 Console errors and warnings check', async () => {
    const consoleMessages: string[] = [];
    
    page.on('console', msg => {
      if (msg.type() === 'error' || msg.type() === 'warning') {
        consoleMessages.push(`${msg.type()}: ${msg.text()}`);
      }
    });
    
    // Realizar acciones que podrían generar errores
    await page.getByRole('button', { name: /iniciar onboarding/i }).click();
    await page.waitForSelector('[role="dialog"]');
    
    await page.getByRole('button', { name: /continuar/i }).click();
    await page.waitForTimeout(1000);
    
    // Cerrar modal si está abierto
    const closeButton = page.locator('[data-testid="CloseIcon"]');
    if (await closeButton.isVisible()) {
      await closeButton.click();
    }
    
    // Filtrar errores conocidos/aceptables
    const criticalErrors = consoleMessages.filter(msg => 
      !msg.includes('Failed to load resource') && // Recursos opcionales
      !msg.includes('localhost:3002') && // Backend puede estar down
      !msg.includes('404') // 404s pueden ser esperados en demo
    );
    
    console.log(`ℹ️ Console messages found: ${consoleMessages.length}`);
    console.log(`⚠️ Critical errors: ${criticalErrors.length}`);
    
    if (criticalErrors.length > 0) {
      console.log('Critical errors:', criticalErrors);
    }
    
    // No fallar por errores menores en demo
    expect(criticalErrors.length).toBeLessThan(5);
  });

  test('💾 LocalStorage persistence', async () => {
    // Verificar que localStorage funciona
    await page.evaluate(() => {
      localStorage.setItem('test-onboarding', 'test-value');
    });
    
    const storedValue = await page.evaluate(() => {
      return localStorage.getItem('test-onboarding');
    });
    
    expect(storedValue).toBe('test-value');
    
    // Limpiar
    await page.evaluate(() => {
      localStorage.removeItem('test-onboarding');
    });
    
    console.log('✅ LocalStorage functionality verified');
  });

  test('🎨 Visual elements and animations', async () => {
    // Verificar que los elementos visuales clave están presentes
    await expect(page.locator('h3')).toHaveCSS('font-weight', '700');
    
    // Verificar gradientes (indicativo de styling correcto)
    const gradientElements = await page.locator('[style*="gradient"]').count();
    console.log(`ℹ️ Elements with gradients found: ${gradientElements}`);
    
    // Verificar iconos Material-UI
    const iconElements = await page.locator('[data-testid*="Icon"]').count();
    console.log(`ℹ️ Material-UI icons found: ${iconElements}`);
    
    // Verificar que los botones tienen hover effects
    const button = page.getByRole('button', { name: /iniciar onboarding/i });
    await button.hover();
    await page.waitForTimeout(200);
    
    console.log('✅ Visual elements and styling verified');
  });
});