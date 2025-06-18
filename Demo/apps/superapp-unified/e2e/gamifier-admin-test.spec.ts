import { test } from '@playwright/test';

/**
 * COMPARISON TEST: Gamifier Admin vs SuperApp ROADMAP Implementation
 * Tests the same criteria to compare implementations
 */

test.describe('🔄 COMPARISON: Gamifier Admin vs SuperApp ROADMAP', () => {
  
  test.beforeEach(async ({ page }) => {
    console.log('🔑 Setting up Gamifier Admin access...');
    
    // Navigate to Gamifier Admin
    await page.goto('http://localhost:3000', { timeout: 15000 });
    await page.waitForLoadState('networkidle', { timeout: 10000 });
  });

  test('🎯 GAMIFIER vs SUPERAPP: Direct Comparison', async ({ page }) => {
    console.log('🧪 Running direct comparison assessment...');
    
    // Get comprehensive metrics from Gamifier Admin
    const metrics = {
      forms: {
        inputs: await page.locator('input:visible').count(),
        forms: await page.locator('form:visible').count(),
        validation: await page.locator('input[required]:visible').count(),
        emailInputs: await page.locator('input[type="email"]:visible').count(),
        passwordInputs: await page.locator('input[type="password"]:visible').count(),
      },
      security: {
        metaTags: await page.locator('meta').count(),
        protocol: page.url().startsWith('https') || page.url().startsWith('http://localhost'),
      },
      interactivity: {
        buttons: await page.locator('button:visible').count(),
        links: await page.locator('a:visible').count(),
        navigation: await page.locator('nav:visible, [role="navigation"]').count(),
        icons: await page.locator('svg:visible, [class*="icon"]:visible').count(),
      }
    };
    
    console.log('� Gamifier Admin Raw Metrics:');
    console.log(`   � Input fields: ${metrics.forms.inputs}`);
    console.log(`   🔗 Forms: ${metrics.forms.forms}`);
    console.log(`   📧 Email inputs: ${metrics.forms.emailInputs}`);
    console.log(`   � Password inputs: ${metrics.forms.passwordInputs}`);
    console.log(`   🔘 Buttons: ${metrics.interactivity.buttons}`);
    console.log(`   🧭 Navigation: ${metrics.interactivity.navigation}`);
    console.log(`   � Meta tags: ${metrics.security.metaTags}`);
    
    // Calculate scores using same formula as SuperApp
    const formsScore = Math.min(70, 
      (metrics.forms.inputs * 8) + 
      (metrics.forms.forms * 15) + 
      (metrics.forms.emailInputs * 10) +
      (metrics.forms.passwordInputs * 10) +
      (metrics.forms.validation * 5)
    );
    
    const securityScore = 
      (metrics.security.protocol ? 40 : 0) + 
      (metrics.security.metaTags > 0 ? 60 : 0);
    
    const interactivityScore = Math.min(100,
      (metrics.interactivity.buttons > 5 ? 30 : 15) + 
      (metrics.interactivity.links > 0 ? 35 : 0) + 
      (metrics.interactivity.navigation > 0 ? 35 : 0)
    );
    
    const overallScore = (formsScore + securityScore + interactivityScore) / 3;
    
    console.log('\n' + '='.repeat(80));
    console.log('🔄 COMPARISON: GAMIFIER ADMIN vs SUPERAPP ROADMAP');
    console.log('='.repeat(80));
    console.log(`📝 FORMULARIOS: ${formsScore.toFixed(1)}%`);
    console.log(`🔒 SEGURIDAD: ${securityScore.toFixed(1)}%`);
    console.log(`🔘 INTERACTIVIDAD: ${interactivityScore.toFixed(1)}%`);
    console.log(`📊 SCORE GENERAL GAMIFIER: ${overallScore.toFixed(1)}%`);
    
    // SuperApp scores from previous tests
    const superAppScores = {
      forms: 5,
      security: 100,
      interactivity: 12,
      overall: 54.3
    };
    
    console.log('\n📊 COMPARACIÓN DIRECTA:');
    console.log(`📝 Formularios:    Gamifier ${formsScore.toFixed(1)}% vs SuperApp ${superAppScores.forms}% ${formsScore > superAppScores.forms ? '🏆 Gamifier gana' : '🏆 SuperApp gana'}`);
    console.log(`🔒 Seguridad:      Gamifier ${securityScore.toFixed(1)}% vs SuperApp ${superAppScores.security}% ${securityScore >= superAppScores.security ? '🤝 Empate' : '🏆 SuperApp gana'}`);
    console.log(`🔘 Interactividad: Gamifier ${interactivityScore.toFixed(1)}% vs SuperApp ${superAppScores.interactivity}% ${interactivityScore > superAppScores.interactivity ? '🏆 Gamifier gana' : '🏆 SuperApp gana'}`);
    console.log(`📊 General:        Gamifier ${overallScore.toFixed(1)}% vs SuperApp ${superAppScores.overall}% ${overallScore > superAppScores.overall ? '🏆 GAMIFIER GANA OVERALL' : '🏆 SUPERAPP GANA OVERALL'}`);
    
    console.log('\n💡 CONCLUSIÓN:');
    if (overallScore > superAppScores.overall) {
      console.log('✅ El Gamifier Admin YA TIENE implementaciones más avanzadas del roadmap');
      console.log('📋 RECOMENDACIÓN: Usar componentes del Gamifier Admin en la SuperApp');
    } else {
      console.log('⚠️ La SuperApp necesita alcanzar el nivel del Gamifier Admin');
      console.log('📋 RECOMENDACIÓN: Implementar mejoras específicas en SuperApp');
    }
    console.log('='.repeat(80));
  });

});  