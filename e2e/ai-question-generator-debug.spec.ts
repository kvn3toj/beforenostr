import { test, expect } from '@playwright/test';

test.describe('AI Question Generator Debug', () => {
  test.beforeEach(async ({ page }) => {
    // Capturar errores de consola y de página
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log('❌ Console Error:', msg.text());
      } else if (msg.text().includes('AI') || msg.text().includes('question')) {
        console.log('🤖 AI/Question Log:', msg.text());
      }
    });

    page.on('pageerror', error => {
      console.log('❌ Page Error:', error.message);
    });

    // Login como administrador
    await page.goto('/login');
    await page.fill('input[name="email"]', 'admin@gamifier.com');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/');
    
    // Buscar el menú hamburguesa en la esquina superior izquierda
    const hamburgerMenu = page.locator('button[aria-label*="menu"], button[aria-label*="Menu"], [data-testid="menu-button"], .MuiIconButton-root').first();
    await expect(hamburgerMenu).toBeVisible({ timeout: 10000 });
  });

  test('should debug AI question generator for video 18', async ({ page }) => {
    console.log('🔍 Starting AI Question Generator Debug Test');

    // Navegar a la página de items
    await page.goto('/items');
    await page.waitForLoadState('networkidle');

    // Buscar el video ID 18 (El video danés)
    console.log('📹 Looking for video ID 18...');
    
    // Esperar a que la tabla se cargue
    await page.waitForSelector('table', { timeout: 10000 });
    
    // Buscar el video específico por título
    const videoRow = page.locator('tr').filter({ 
      hasText: 'El video danés que nos recuerda lo fácil que es encasillar a las personas' 
    });
    
    if (await videoRow.count() === 0) {
      console.log('❌ Video not found, checking all videos...');
      const allRows = await page.locator('tbody tr').all();
      for (let i = 0; i < Math.min(allRows.length, 5); i++) {
        const rowText = await allRows[i].textContent();
        console.log(`Row ${i + 1}:`, rowText?.substring(0, 100));
      }
      throw new Error('Video ID 18 not found in the table');
    }

    console.log('✅ Found video, clicking to open configuration...');
    
    // Hacer clic en el video para abrir la configuración
    await videoRow.click();
    await page.waitForLoadState('networkidle');

    // Verificar que estamos en la página de configuración del video
    await expect(page.locator('h1, h2, h3').filter({ hasText: /configuración|config/i })).toBeVisible({ timeout: 10000 });

    // Buscar y hacer clic en la pestaña de Preguntas
    console.log('📝 Looking for Questions tab...');
    const questionsTab = page.locator('button, div, span').filter({ hasText: /preguntas|questions/i }).first();
    await expect(questionsTab).toBeVisible({ timeout: 5000 });
    await questionsTab.click();
    await page.waitForTimeout(1000);

    // Buscar el botón del generador de IA
    console.log('🤖 Looking for AI Generator button...');
    const aiGeneratorButton = page.locator('button').filter({ 
      hasText: /generar con ia|ai|inteligencia artificial/i 
    }).first();
    
    await expect(aiGeneratorButton).toBeVisible({ timeout: 5000 });
    console.log('✅ Found AI Generator button, clicking...');
    await aiGeneratorButton.click();

    // Esperar a que aparezca el modal del generador
    await page.waitForSelector('[role="dialog"], .MuiDialog-root', { timeout: 5000 });
    console.log('✅ AI Generator modal opened');

    // Configurar el generador (usar configuración simple)
    console.log('⚙️ Configuring AI generator...');
    
    // Verificar que hay opciones de configuración
    const numberOfQuestionsInput = page.locator('input[type="number"], input').filter({ hasText: /número|number/i }).first();
    if (await numberOfQuestionsInput.count() > 0) {
      await numberOfQuestionsInput.fill('2');
    }

    // Buscar y hacer clic en el botón de generar
    console.log('🚀 Generating questions...');
    const generateButton = page.locator('button').filter({ 
      hasText: /generar|generate/i 
    }).first();
    
    await expect(generateButton).toBeVisible();
    await generateButton.click();

    // Esperar a que se generen las preguntas (puede tomar tiempo)
    console.log('⏳ Waiting for questions to be generated...');
    await page.waitForTimeout(5000); // Dar tiempo para la llamada a la IA

    // Buscar las preguntas generadas
    const questionsContainer = page.locator('[data-testid="generated-questions"], .generated-questions, .questions-preview').first();
    
    if (await questionsContainer.count() === 0) {
      // Si no hay contenedor específico, buscar texto de preguntas
      console.log('🔍 Looking for generated questions in the page...');
      const pageContent = await page.textContent('body');
      
      // Buscar palabras clave de gamificación
      const gamificationKeywords = ['gamificación', 'puntos', 'badges', 'leaderboard', 'recompensas'];
      const foundGamificationWords = gamificationKeywords.filter(word => 
        pageContent?.toLowerCase().includes(word.toLowerCase())
      );

      // Buscar palabras clave del video específico
      const videoKeywords = ['danés', 'encasillar', 'personas', 'prejuicios', 'estereotipos'];
      const foundVideoWords = videoKeywords.filter(word => 
        pageContent?.toLowerCase().includes(word.toLowerCase())
      );

      console.log('🎮 Gamification keywords found:', foundGamificationWords);
      console.log('🎬 Video-specific keywords found:', foundVideoWords);

      if (foundGamificationWords.length > 0) {
        console.log('❌ PROBLEM CONFIRMED: AI is still generating gamification questions!');
        console.log('📄 Page content sample:', pageContent?.substring(0, 500));
      } else if (foundVideoWords.length > 0) {
        console.log('✅ GOOD: AI is generating video-specific questions');
      } else {
        console.log('❓ UNCLEAR: No clear indication of question content');
      }
    } else {
      // Si hay contenedor específico, analizar su contenido
      const questionsText = await questionsContainer.textContent();
      console.log('📝 Generated questions content:', questionsText);
      
      // Verificar si contiene palabras de gamificación
      const hasGamificationContent = /gamificación|puntos|badges|leaderboard|recompensas/i.test(questionsText || '');
      const hasVideoContent = /danés|encasillar|personas|prejuicios|estereotipos/i.test(questionsText || '');
      
      if (hasGamificationContent) {
        console.log('❌ PROBLEM CONFIRMED: Generated questions contain gamification content!');
      } else if (hasVideoContent) {
        console.log('✅ GOOD: Generated questions are about the specific video');
      } else {
        console.log('❓ Generated questions content is unclear');
      }
    }

    // Tomar screenshot para evidencia
    await page.screenshot({ 
      path: 'debug-ai-generator-result.png', 
      fullPage: true 
    });
    console.log('📸 Screenshot saved as debug-ai-generator-result.png');

    // Mantener el modal abierto para inspección manual
    await page.waitForTimeout(2000);
  });

  test('should test AI generator API directly', async ({ page }) => {
    console.log('🔧 Testing AI Generator API directly');

    // Hacer login para obtener token
    await page.goto('/login');
    await page.fill('input[name="email"]', 'admin@gamifier.com');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/');

    // Verificar que el login fue exitoso buscando el menú hamburguesa
    const hamburgerMenu = page.locator('button[aria-label*="menu"], button[aria-label*="Menu"], [data-testid="menu-button"], .MuiIconButton-root').first();
    await expect(hamburgerMenu).toBeVisible({ timeout: 10000 });

    // Obtener el token del localStorage o hacer llamada directa
    const result = await page.evaluate(async () => {
      try {
        // Intentar obtener token del localStorage
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        
        if (!token) {
          throw new Error('No token found in storage');
        }

        console.log('🔑 Token found, making API call...');

        // Hacer llamada directa a la API
        const response = await fetch('http://localhost:3002/ai/generate-questions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            videoItemId: 18,
            numberOfQuestions: 2,
            focusContext: 'general',
            questionTypes: ['multiple-choice'],
            timeDistribution: 'distributed',
            difficultyLevel: 'medium',
            languageCode: 'es-ES',
            autoSave: false
          })
        });

        if (!response.ok) {
          throw new Error(`API call failed: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return { success: true, data };
      } catch (error) {
        return { success: false, error: error.message };
      }
    });

    if (result.success) {
      console.log('✅ API call successful');
      console.log('📝 Generated questions:', JSON.stringify(result.data.questions, null, 2));
      
      // Analizar el contenido de las preguntas
      const questionsText = JSON.stringify(result.data.questions);
      const hasGamificationContent = /gamificación|puntos|badges|leaderboard|recompensas/i.test(questionsText);
      const hasVideoContent = /danés|encasillar|personas|prejuicios|estereotipos/i.test(questionsText);
      
      if (hasGamificationContent) {
        console.log('❌ PROBLEM: API is returning gamification questions!');
        expect(hasGamificationContent).toBe(false);
      } else if (hasVideoContent) {
        console.log('✅ GOOD: API is returning video-specific questions');
      } else {
        console.log('❓ Questions content is unclear, but no gamification detected');
      }
    } else {
      console.log('❌ API call failed:', result.error);
      throw new Error(`API test failed: ${result.error}`);
    }
  });
}); 