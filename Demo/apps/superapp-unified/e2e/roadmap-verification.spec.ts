import { test, expect } from '@playwright/test';

/**
 * ROADMAP VERIFICATION TEST
 * Tests the critical priorities implementation without authentication requirements
 */

test.describe('🚨 ROADMAP DE ACCIÓN INMEDIATA - Verification', () => {

  test('📝 PRIORIDAD CRÍTICA 1: Formularios Completos con Validación', async ({ page }) => {
    console.log('🧪 Testing complete forms implementation...');
    
    // Navigate to login page
    await page.goto('http://localhost:3001/login', { timeout: 15000 });
    await page.waitForLoadState('networkidle', { timeout: 10000 });
    
    console.log('📍 Testing Login Form Implementation...');
    
    // Check for improved form elements with data-testid
    const formElements = {
      emailInput: await page.locator('[data-testid="login-email-input"]').count(),
      passwordInput: await page.locator('[data-testid="login-password-input"]').count(),
      submitButton: await page.locator('[data-testid="login-submit-button"]').count(),
      passwordToggle: await page.locator('[data-testid="toggle-password-visibility"]').count(),
      registerLink: await page.locator('[data-testid="register-link"]').count()
    };
    
    console.log('📊 Form Elements Status:');
    console.log(`   📧 Email Input with validation: ${formElements.emailInput > 0 ? '✅' : '❌'}`);
    console.log(`   🔐 Password Input with security: ${formElements.passwordInput > 0 ? '✅' : '❌'}`);
    console.log(`   🔘 Submit Button with states: ${formElements.submitButton > 0 ? '✅' : '❌'}`);
    console.log(`   👁️ Password Visibility Toggle: ${formElements.passwordToggle > 0 ? '✅' : '❌'}`);
    console.log(`   🔗 Register Form Link: ${formElements.registerLink > 0 ? '✅' : '❌'}`);
    
    // Test form validation
    if (formElements.emailInput > 0 && formElements.passwordInput > 0) {
      console.log('   🧪 Testing form validation behavior...');
      
      // Test email validation
      await page.fill('[data-testid="login-email-input"] input', 'invalid-email');
      await page.waitForTimeout(500);
      
      // Check if submit button is properly disabled
      const submitBtn = page.locator('[data-testid="login-submit-button"]');
      const isDisabled = await submitBtn.isDisabled();
      console.log(`   🔒 Form validation working: ${isDisabled ? '✅' : '❌'}`);
      
      // Test password toggle functionality
      if (formElements.passwordToggle > 0) {
        await page.fill('[data-testid="login-password-input"] input', 'testpass');
        await page.click('[data-testid="toggle-password-visibility"]');
        await page.waitForTimeout(200);
        
        const passwordInput = page.locator('[data-testid="login-password-input"] input');
        const inputType = await passwordInput.getAttribute('type');
        console.log(`   👁️ Password toggle functional: ${inputType === 'text' ? '✅' : '❌'}`);
      }
    }
    
    // Calculate forms score
    const formsScore = Object.values(formElements).reduce((sum, count) => sum + (count > 0 ? 20 : 0), 0);
    console.log(`🎯 FORMULARIOS SCORE: ${formsScore}%`);
    
    expect(formsScore).toBeGreaterThan(60); // Should have most form features
  });

  test('🔒 PRIORIDAD CRÍTICA 2: Seguridad Básica Implementada', async ({ page }) => {
    console.log('🧪 Testing basic security implementation...');
    
    await page.goto('http://localhost:3001/login', { timeout: 15000 });
    await page.waitForLoadState('networkidle', { timeout: 10000 });
    
    // Security checks
    const securityFeatures = {
      passwordFields: await page.locator('input[type="password"]').count(),
      requiredFields: await page.locator('input[required]').count(),
      autoCompleteAttrs: await page.locator('input[autocomplete]').count(),
      validationMessages: await page.locator('[role="alert"], .MuiFormHelperText-root').count(),
      secureLabels: await page.locator('input[aria-label], label[for]').count()
    };
    
    console.log('🔒 Security Features Assessment:');
    console.log(`   🔐 Password fields: ${securityFeatures.passwordFields} ${securityFeatures.passwordFields > 0 ? '✅' : '❌'}`);
    console.log(`   ✅ Required fields: ${securityFeatures.requiredFields} ${securityFeatures.requiredFields > 0 ? '✅' : '❌'}`);
    console.log(`   📝 Autocomplete attrs: ${securityFeatures.autoCompleteAttrs} ${securityFeatures.autoCompleteAttrs > 0 ? '✅' : '❌'}`);
    console.log(`   ⚠️ Validation messages: ${securityFeatures.validationMessages} ${securityFeatures.validationMessages > 0 ? '✅' : '❌'}`);
    console.log(`   🏷️ Accessible labels: ${securityFeatures.secureLabels} ${securityFeatures.secureLabels > 0 ? '✅' : '❌'}`);
    
    // Test input sanitization
    const emailInput = page.locator('input[type="email"]').first();
    if (await emailInput.count() > 0) {
      await emailInput.fill('<script>alert("test")</script>');
      await page.waitForTimeout(300);
      const inputValue = await emailInput.inputValue();
      const isSanitized = !inputValue.includes('<script>');
      console.log(`   🧹 Input sanitization: ${isSanitized ? '✅' : '❌'}`);
    }
    
    // Calculate security score
    const securityScore = Object.values(securityFeatures).reduce((sum, count) => sum + (count > 0 ? 20 : 0), 0);
    console.log(`🎯 SEGURIDAD SCORE: ${securityScore}%`);
    
    expect(securityScore).toBeGreaterThan(40); // Should have basic security features
  });

  test('🔘 PRIORIDAD CRÍTICA 3: Elementos Interactivos Expandidos', async ({ page }) => {
    console.log('🧪 Testing expanded interactive elements...');
    
    await page.goto('http://localhost:3001', { timeout: 15000 });
    await page.waitForLoadState('networkidle', { timeout: 10000 });
    
    // Interactive elements assessment
    const interactiveElements = {
      buttons: await page.locator('button:visible').count(),
      links: await page.locator('a[href]:visible').count(),
      clickableIcons: await page.locator('[data-testid*="button"], [role="button"]:visible').count(),
      navigationItems: await page.locator('[data-testid*="nav"]:visible').count(),
      tooltips: await page.locator('[title], [aria-label]:visible').count()
    };
    
    console.log('🔘 Interactive Elements Assessment:');
    console.log(`   🔘 Interactive buttons: ${interactiveElements.buttons} ${interactiveElements.buttons > 3 ? '✅' : '❌'}`);
    console.log(`   🔗 Clickable links: ${interactiveElements.links} ${interactiveElements.links > 2 ? '✅' : '❌'}`);
    console.log(`   ⚡ Interactive icons: ${interactiveElements.clickableIcons} ${interactiveElements.clickableIcons > 1 ? '✅' : '❌'}`);
    console.log(`   🧭 Navigation items: ${interactiveElements.navigationItems} ${interactiveElements.navigationItems > 0 ? '✅' : '❌'}`);
    console.log(`   💡 Accessible tooltips: ${interactiveElements.tooltips} ${interactiveElements.tooltips > 2 ? '✅' : '❌'}`);
    
    // Test button functionality
    const enabledButtons = await page.locator('button:enabled:visible').count();
    console.log(`   ✅ Enabled buttons: ${enabledButtons} ${enabledButtons > 1 ? '✅' : '❌'}`);
    
    // Test responsive behavior
    console.log('   📱 Testing responsive behavior...');
    await page.setViewportSize({ width: 768, height: 600 });
    await page.waitForTimeout(500);
    
    const mobileElements = await page.locator('button:visible, [role="button"]:visible').count();
    console.log(`   📱 Mobile interactive elements: ${mobileElements} ${mobileElements > 2 ? '✅' : '❌'}`);
    
    // Reset viewport
    await page.setViewportSize({ width: 1280, height: 720 });
    
    // Calculate interactivity score
    const scores = [
      interactiveElements.buttons > 3 ? 20 : 0,
      interactiveElements.links > 2 ? 20 : 0,
      interactiveElements.clickableIcons > 1 ? 20 : 0,
      interactiveElements.navigationItems > 0 ? 20 : 0,
      enabledButtons > 1 ? 20 : 0
    ];
    
    const interactivityScore = scores.reduce((sum, score) => sum + score, 0);
    console.log(`🎯 INTERACTIVIDAD SCORE: ${interactivityScore}%`);
    
    expect(interactivityScore).toBeGreaterThan(60); // Should have good interactivity
  });

  test('🎯 RESUMEN GENERAL: Estado del Roadmap Crítico', async ({ page }) => {
    console.log('🧪 Running overall roadmap assessment...');
    
    await page.goto('http://localhost:3001/login', { timeout: 15000 });
    await page.waitForLoadState('networkidle', { timeout: 10000 });
    
    // Quick comprehensive assessment
    const overallMetrics = {
      forms: {
        inputs: await page.locator('input[data-testid*="input"]').count(),
        validation: await page.locator('[data-testid*="input"]:invalid, .Mui-error').count(),
        buttons: await page.locator('[data-testid*="button"]').count()
      },
      security: {
        passwordFields: await page.locator('input[type="password"]').count(),
        requiredFields: await page.locator('input[required]').count(),
        labels: await page.locator('label, [aria-label]').count()
      },
      interactivity: {
        clickable: await page.locator('button, [role="button"], a[href]').count(),
        navigation: await page.locator('[data-testid*="nav"], nav').count(),
        responsive: await page.locator('.MuiButton-root, button').count()
      }
    };
    
    // Calculate scores
    const formsScore = Math.min(100, (overallMetrics.forms.inputs * 15) + (overallMetrics.forms.buttons * 10));
    const securityScore = Math.min(100, (overallMetrics.security.passwordFields * 25) + (overallMetrics.security.requiredFields * 10) + (overallMetrics.security.labels * 5));
    const interactivityScore = Math.min(100, (overallMetrics.interactivity.clickable * 10) + (overallMetrics.interactivity.navigation * 20));
    
    const overallScore = (formsScore + securityScore + interactivityScore) / 3;
    
    console.log('\n' + '='.repeat(80));
    console.log('🎯 RESUMEN ROADMAP DE ACCIÓN INMEDIATA');
    console.log('='.repeat(80));
    console.log(`📝 PRIORIDAD 1 - Formularios: ${formsScore.toFixed(1)}%`);
    console.log(`🔒 PRIORIDAD 2 - Seguridad: ${securityScore.toFixed(1)}%`);
    console.log(`🔘 PRIORIDAD 3 - Interactividad: ${interactivityScore.toFixed(1)}%`);
    console.log(`📊 SCORE GENERAL: ${overallScore.toFixed(1)}%`);
    
    // Status assessment
    let status: string;
    let message: string;
    
    if (overallScore >= 80) {
      status = '🎉 EXCELENTE';
      message = 'Roadmap crítico implementado exitosamente!';
    } else if (overallScore >= 60) {
      status = '✅ BUENO';
      message = 'Roadmap crítico bien encaminado';
    } else if (overallScore >= 40) {
      status = '⚠️ PROGRESO';
      message = 'Roadmap crítico en desarrollo';
    } else {
      status = '🔧 INICIAL';
      message = 'Roadmap crítico requiere más trabajo';
    }
    
    console.log(`🏆 STATUS: ${status}`);
    console.log(`💬 ${message}`);
    
    // Next steps based on scores
    console.log('\n📋 PRÓXIMOS PASOS:');
    if (formsScore < 60) console.log('   📝 Completar validación de formularios');
    if (securityScore < 60) console.log('   🔒 Reforzar medidas de seguridad');
    if (interactivityScore < 60) console.log('   🔘 Expandir elementos interactivos');
    
    console.log('\n🎯 OBJETIVO ACTUAL: 60% (Formularios + Seguridad implementados)');
    console.log(`📈 PROGRESO: ${overallScore >= 60 ? 'ALCANZADO ✅' : `${overallScore.toFixed(1)}% de 60%`}`);
    
    expect(overallScore).toBeGreaterThan(30); // Minimum progress threshold
  });
});

export default test;