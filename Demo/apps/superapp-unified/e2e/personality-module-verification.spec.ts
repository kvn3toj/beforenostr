/**
 * 🧠 VERIFICACIÓN DEL MÓDULO DE PERSONALIDADES - FASE A.10
 * Test E2E para determinar si existe un sistema de personalidades/arquetipos en la SuperApp
 */

import { test, expect } from '@playwright/test';

test.describe('🧠 Personality Module Verification - Fase A.10', () => {
  
  test.beforeEach(async ({ page }) => {
    // Navegar a la SuperApp con mock auth activo
    await page.goto('/');
    await page.waitForSelector('#root');
    
    // Esperar a que la aplicación cargue completamente
    await page.waitForTimeout(2000);
  });

  test('🔍 Should search for personality-related content in main navigation', async ({ page }) => {
    console.log('🔍 Buscando módulo de personalidades en navegación principal...');
    
    // Verificar si hay enlaces o botones relacionados con personalidad en la navegación
    const personalityLinks = [
      'text=Personalidad',
      'text=Test de Personalidad', 
      'text=Arquetipo',
      'text=Perfil Psicológico',
      'text=Descubre tu Perfil',
      'text=Quiz de Personalidad',
      'text=Elementos',
      'text=Tu Arquetipo',
      '[data-testid*="personality"]',
      '[data-testid*="archetype"]',
      '[href*="personality"]',
      '[href*="test"]',
      '[href*="quiz"]'
    ];

    let foundPersonalityContent = false;
    
    for (const selector of personalityLinks) {
      try {
        const element = await page.locator(selector).first();
        if (await element.isVisible({ timeout: 1000 })) {
          console.log(`✅ Encontrado contenido de personalidad: ${selector}`);
          foundPersonalityContent = true;
          break;
        }
      } catch (error) {
        // Continuar buscando
      }
    }

    if (!foundPersonalityContent) {
      console.log('❌ No se encontró módulo de personalidades en navegación principal');
    }
  });

  test('🔍 Should search for personality content in user profile', async ({ page }) => {
    console.log('🔍 Buscando información de personalidad en perfil de usuario...');
    
    // Navegar al perfil de usuario
    try {
      await page.click('text=Perfil', { timeout: 5000 });
    } catch {
      try {
        await page.click('[href="/profile"]', { timeout: 5000 });
      } catch {
        try {
          await page.click('button[aria-label*="perfil"]', { timeout: 5000 });
        } catch {
          console.log('⚠️ No se pudo navegar al perfil de usuario');
          return;
        }
      }
    }

    await page.waitForTimeout(2000);

    // Buscar contenido relacionado con personalidad en el perfil
    const personalityContent = [
      'text=Personalidad',
      'text=Arquetipo', 
      'text=Elemento',
      'text=Fuego',
      'text=Agua',
      'text=Tierra',
      'text=Aire',
      'text=Test de Personalidad',
      'text=Quiz Filosófico',
      'text=Perfil Psicológico'
    ];

    let foundProfilePersonality = false;
    
    for (const selector of personalityContent) {
      try {
        const element = await page.locator(selector).first();
        if (await element.isVisible({ timeout: 1000 })) {
          console.log(`✅ Encontrado en perfil: ${selector}`);
          foundProfilePersonality = true;
        }
      } catch (error) {
        // Continuar buscando
      }
    }

    if (!foundProfilePersonality) {
      console.log('❌ No se encontró información de personalidad en el perfil');
    }
  });

  test('🔍 Should search for personality test in onboarding flow', async ({ page }) => {
    console.log('🔍 Buscando test de personalidad en flujo de onboarding...');
    
    // Verificar si hay un flujo de onboarding o registro que incluya test de personalidad
    try {
      // Intentar navegar al registro beta que sabemos que tiene quiz filosófico
      await page.goto('/beta-register');
      await page.waitForSelector('#root');
      await page.waitForTimeout(2000);

      // Buscar el quiz filosófico en el registro beta
      const quizElements = [
        'text=Quiz Filosófico',
        'text=Psychology',
        'text=Reciprocidad',
        'text=Bien Común',
        'text=reciprocidad consciente'
      ];

      let foundQuiz = false;
      
      for (const selector of quizElements) {
        try {
          const element = await page.locator(selector).first();
          if (await element.isVisible({ timeout: 1000 })) {
            console.log(`✅ Encontrado quiz filosófico: ${selector}`);
            foundQuiz = true;
          }
        } catch (error) {
          // Continuar buscando
        }
      }

      if (foundQuiz) {
        console.log('✅ Se encontró Quiz Filosófico en registro beta (relacionado con personalidad)');
      } else {
        console.log('❌ No se encontró quiz filosófico en registro beta');
      }

    } catch (error) {
      console.log('⚠️ No se pudo acceder al flujo de registro beta');
    }
  });

  test('🔍 Should search for personality-related API endpoints', async ({ page }) => {
    console.log('🔍 Verificando llamadas API relacionadas con personalidad...');
    
    // Interceptar llamadas de red para buscar endpoints relacionados
    const personalityEndpoints: string[] = [];
    
    page.on('request', request => {
      const url = request.url();
      if (url.includes('personality') || 
          url.includes('archetype') || 
          url.includes('quiz') || 
          url.includes('test') ||
          url.includes('psychology')) {
        personalityEndpoints.push(url);
        console.log(`🌐 Endpoint relacionado encontrado: ${url}`);
      }
    });

    // Navegar por diferentes secciones para activar llamadas API
    await page.goto('/');
    await page.waitForTimeout(1000);
    
    try {
      await page.goto('/profile');
      await page.waitForTimeout(1000);
    } catch (error) {
      // Continuar
    }

    if (personalityEndpoints.length > 0) {
      console.log(`✅ Se encontraron ${personalityEndpoints.length} endpoints relacionados con personalidad`);
      personalityEndpoints.forEach(endpoint => console.log(`   - ${endpoint}`));
    } else {
      console.log('❌ No se encontraron endpoints relacionados con personalidad');
    }
  });

  test('📋 Should generate comprehensive personality module report', async ({ page }) => {
    console.log('📋 Generando reporte completo del módulo de personalidades...');
    
    const report = {
      moduleExists: false,
      foundInNavigation: false,
      foundInProfile: false,
      foundInOnboarding: false,
      relatedFeatures: [] as string[],
      recommendations: [] as string[]
    };

    // Verificar navegación principal
    await page.goto('/');
    await page.waitForSelector('#root');
    
    const navContent = await page.content();
    if (navContent.includes('personalidad') || 
        navContent.includes('arquetipo') || 
        navContent.includes('test') ||
        navContent.includes('Psychology')) {
      report.foundInNavigation = true;
      report.relatedFeatures.push('Contenido en navegación principal');
    }

    // Verificar perfil
    try {
      await page.goto('/profile');
      await page.waitForTimeout(1000);
      const profileContent = await page.content();
      if (profileContent.includes('personalidad') || 
          profileContent.includes('arquetipo') || 
          profileContent.includes('elemento')) {
        report.foundInProfile = true;
        report.relatedFeatures.push('Información en perfil de usuario');
      }
    } catch (error) {
      // Continuar
    }

    // Verificar registro beta (quiz filosófico)
    try {
      await page.goto('/beta-register');
      await page.waitForTimeout(1000);
      const betaContent = await page.content();
      if (betaContent.includes('Quiz Filosófico') || 
          betaContent.includes('Psychology') || 
          betaContent.includes('Reciprocidad')) {
        report.foundInOnboarding = true;
        report.relatedFeatures.push('Quiz Filosófico en registro beta');
      }
    } catch (error) {
      // Continuar
    }

    // Determinar si el módulo existe
    report.moduleExists = report.foundInNavigation || report.foundInProfile || report.foundInOnboarding;

    // Generar recomendaciones
    if (!report.moduleExists) {
      report.recommendations.push('Implementar test de personalidad basado en elementos CoomÜnity (Fuego, Agua, Tierra, Aire)');
      report.recommendations.push('Integrar resultados de personalidad en el perfil de usuario');
      report.recommendations.push('Adaptar contenido basado en arquetipo del usuario');
      report.recommendations.push('Expandir el Quiz Filosófico del registro beta a un test completo');
    } else {
      report.recommendations.push('Expandir funcionalidades existentes del módulo de personalidades');
      report.recommendations.push('Mejorar integración con otros módulos de la SuperApp');
    }

    // Mostrar reporte
    console.log('\n📊 REPORTE FINAL - MÓDULO DE PERSONALIDADES:');
    console.log(`   🎯 Módulo existe: ${report.moduleExists ? '✅ SÍ' : '❌ NO'}`);
    console.log(`   🧭 En navegación: ${report.foundInNavigation ? '✅' : '❌'}`);
    console.log(`   👤 En perfil: ${report.foundInProfile ? '✅' : '❌'}`);
    console.log(`   🚀 En onboarding: ${report.foundInOnboarding ? '✅' : '❌'}`);
    console.log(`   🔧 Características encontradas: ${report.relatedFeatures.length}`);
    
    if (report.relatedFeatures.length > 0) {
      console.log('   📋 Características:');
      report.relatedFeatures.forEach(feature => console.log(`      - ${feature}`));
    }
    
    console.log('   💡 Recomendaciones:');
    report.recommendations.forEach(rec => console.log(`      - ${rec}`));

    // El test siempre pasa, es solo para generar el reporte
    expect(true).toBe(true);
  });
}); 