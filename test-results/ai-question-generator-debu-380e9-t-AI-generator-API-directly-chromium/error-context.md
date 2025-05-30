# Test info

- Name: AI Question Generator Debug >> should test AI generator API directly
- Location: /Users/kevinp/Movies/GAMIFIER copy/e2e/ai-question-generator-debug.spec.ts:170:7

# Error details

```
TimeoutError: page.fill: Timeout 10000ms exceeded.
Call log:
  - waiting for locator('input[name="email"]')

    at /Users/kevinp/Movies/GAMIFIER copy/e2e/ai-question-generator-debug.spec.ts:175:16
```

# Page snapshot

```yaml
- banner:
  - button "toggle menu"
  - paragraph: admin@gamifier.com
  - button "A"
- main:
  - heading "Bienvenido de vuelta" [level=1]
  - heading "Hola, admin 👋" [level=6]
  - heading "Resumen" [level=5]
  - button
  - heading "2" [level=4]
  - paragraph: Usuarios
  - button
  - heading "2" [level=4]
  - paragraph: Mundos
  - button
  - heading "3" [level=4]
  - paragraph: Playlists
  - button
  - heading "3" [level=4]
  - paragraph: Actividad
  - heading "Acciones Rápidas" [level=5]
  - heading "Crear Mundo" [level=6]
  - text: Nuevo mundo gamificado
  - button
  - heading "Gestionar Usuarios" [level=6]
  - text: Administrar usuarios
  - button
  - heading "Ver Analytics" [level=6]
  - text: Métricas y estadísticas
  - button
  - heading "Configuración" [level=6]
  - text: Ajustes del sistema
  - button
  - heading "Actividad Reciente" [level=5]
  - paragraph: Nuevo usuario registrado
  - text: Hace 30 min
  - separator
  - paragraph: Mundo "Educación" actualizado
  - text: Hace 2 h
  - separator
  - paragraph: Playlist creada exitosamente
  - text: Hace 4 h
  - button "Ver Todo"
- region "Notifications alt+T"
- button "Open Tanstack query devtools":
  - img
```

# Test source

```ts
   75 |     console.log('🤖 Looking for AI Generator button...');
   76 |     const aiGeneratorButton = page.locator('button').filter({ 
   77 |       hasText: /generar con ia|ai|inteligencia artificial/i 
   78 |     }).first();
   79 |     
   80 |     await expect(aiGeneratorButton).toBeVisible({ timeout: 5000 });
   81 |     console.log('✅ Found AI Generator button, clicking...');
   82 |     await aiGeneratorButton.click();
   83 |
   84 |     // Esperar a que aparezca el modal del generador
   85 |     await page.waitForSelector('[role="dialog"], .MuiDialog-root', { timeout: 5000 });
   86 |     console.log('✅ AI Generator modal opened');
   87 |
   88 |     // Configurar el generador (usar configuración simple)
   89 |     console.log('⚙️ Configuring AI generator...');
   90 |     
   91 |     // Verificar que hay opciones de configuración
   92 |     const numberOfQuestionsInput = page.locator('input[type="number"], input').filter({ hasText: /número|number/i }).first();
   93 |     if (await numberOfQuestionsInput.count() > 0) {
   94 |       await numberOfQuestionsInput.fill('2');
   95 |     }
   96 |
   97 |     // Buscar y hacer clic en el botón de generar
   98 |     console.log('🚀 Generating questions...');
   99 |     const generateButton = page.locator('button').filter({ 
  100 |       hasText: /generar|generate/i 
  101 |     }).first();
  102 |     
  103 |     await expect(generateButton).toBeVisible();
  104 |     await generateButton.click();
  105 |
  106 |     // Esperar a que se generen las preguntas (puede tomar tiempo)
  107 |     console.log('⏳ Waiting for questions to be generated...');
  108 |     await page.waitForTimeout(5000); // Dar tiempo para la llamada a la IA
  109 |
  110 |     // Buscar las preguntas generadas
  111 |     const questionsContainer = page.locator('[data-testid="generated-questions"], .generated-questions, .questions-preview').first();
  112 |     
  113 |     if (await questionsContainer.count() === 0) {
  114 |       // Si no hay contenedor específico, buscar texto de preguntas
  115 |       console.log('🔍 Looking for generated questions in the page...');
  116 |       const pageContent = await page.textContent('body');
  117 |       
  118 |       // Buscar palabras clave de gamificación
  119 |       const gamificationKeywords = ['gamificación', 'puntos', 'badges', 'leaderboard', 'recompensas'];
  120 |       const foundGamificationWords = gamificationKeywords.filter(word => 
  121 |         pageContent?.toLowerCase().includes(word.toLowerCase())
  122 |       );
  123 |
  124 |       // Buscar palabras clave del video específico
  125 |       const videoKeywords = ['danés', 'encasillar', 'personas', 'prejuicios', 'estereotipos'];
  126 |       const foundVideoWords = videoKeywords.filter(word => 
  127 |         pageContent?.toLowerCase().includes(word.toLowerCase())
  128 |       );
  129 |
  130 |       console.log('🎮 Gamification keywords found:', foundGamificationWords);
  131 |       console.log('🎬 Video-specific keywords found:', foundVideoWords);
  132 |
  133 |       if (foundGamificationWords.length > 0) {
  134 |         console.log('❌ PROBLEM CONFIRMED: AI is still generating gamification questions!');
  135 |         console.log('📄 Page content sample:', pageContent?.substring(0, 500));
  136 |       } else if (foundVideoWords.length > 0) {
  137 |         console.log('✅ GOOD: AI is generating video-specific questions');
  138 |       } else {
  139 |         console.log('❓ UNCLEAR: No clear indication of question content');
  140 |       }
  141 |     } else {
  142 |       // Si hay contenedor específico, analizar su contenido
  143 |       const questionsText = await questionsContainer.textContent();
  144 |       console.log('📝 Generated questions content:', questionsText);
  145 |       
  146 |       // Verificar si contiene palabras de gamificación
  147 |       const hasGamificationContent = /gamificación|puntos|badges|leaderboard|recompensas/i.test(questionsText || '');
  148 |       const hasVideoContent = /danés|encasillar|personas|prejuicios|estereotipos/i.test(questionsText || '');
  149 |       
  150 |       if (hasGamificationContent) {
  151 |         console.log('❌ PROBLEM CONFIRMED: Generated questions contain gamification content!');
  152 |       } else if (hasVideoContent) {
  153 |         console.log('✅ GOOD: Generated questions are about the specific video');
  154 |       } else {
  155 |         console.log('❓ Generated questions content is unclear');
  156 |       }
  157 |     }
  158 |
  159 |     // Tomar screenshot para evidencia
  160 |     await page.screenshot({ 
  161 |       path: 'debug-ai-generator-result.png', 
  162 |       fullPage: true 
  163 |     });
  164 |     console.log('📸 Screenshot saved as debug-ai-generator-result.png');
  165 |
  166 |     // Mantener el modal abierto para inspección manual
  167 |     await page.waitForTimeout(2000);
  168 |   });
  169 |
  170 |   test('should test AI generator API directly', async ({ page }) => {
  171 |     console.log('🔧 Testing AI Generator API directly');
  172 |
  173 |     // Hacer login para obtener token
  174 |     await page.goto('/login');
> 175 |     await page.fill('input[name="email"]', 'admin@gamifier.com');
      |                ^ TimeoutError: page.fill: Timeout 10000ms exceeded.
  176 |     await page.fill('input[name="password"]', 'admin123');
  177 |     await page.click('button[type="submit"]');
  178 |     await page.waitForURL('**/');
  179 |
  180 |     // Verificar que el login fue exitoso buscando el menú hamburguesa
  181 |     const hamburgerMenu = page.locator('button[aria-label*="menu"], button[aria-label*="Menu"], [data-testid="menu-button"], .MuiIconButton-root').first();
  182 |     await expect(hamburgerMenu).toBeVisible({ timeout: 10000 });
  183 |
  184 |     // Obtener el token del localStorage o hacer llamada directa
  185 |     const result = await page.evaluate(async () => {
  186 |       try {
  187 |         // Intentar obtener token del localStorage
  188 |         const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  189 |         
  190 |         if (!token) {
  191 |           throw new Error('No token found in storage');
  192 |         }
  193 |
  194 |         console.log('🔑 Token found, making API call...');
  195 |
  196 |         // Hacer llamada directa a la API
  197 |         const response = await fetch('http://localhost:3002/ai/generate-questions', {
  198 |           method: 'POST',
  199 |           headers: {
  200 |             'Content-Type': 'application/json',
  201 |             'Authorization': `Bearer ${token}`
  202 |           },
  203 |           body: JSON.stringify({
  204 |             videoItemId: 18,
  205 |             numberOfQuestions: 2,
  206 |             focusContext: 'general',
  207 |             questionTypes: ['multiple-choice'],
  208 |             timeDistribution: 'distributed',
  209 |             difficultyLevel: 'medium',
  210 |             languageCode: 'es-ES',
  211 |             autoSave: false
  212 |           })
  213 |         });
  214 |
  215 |         if (!response.ok) {
  216 |           throw new Error(`API call failed: ${response.status} ${response.statusText}`);
  217 |         }
  218 |
  219 |         const data = await response.json();
  220 |         return { success: true, data };
  221 |       } catch (error) {
  222 |         return { success: false, error: error.message };
  223 |       }
  224 |     });
  225 |
  226 |     if (result.success) {
  227 |       console.log('✅ API call successful');
  228 |       console.log('📝 Generated questions:', JSON.stringify(result.data.questions, null, 2));
  229 |       
  230 |       // Analizar el contenido de las preguntas
  231 |       const questionsText = JSON.stringify(result.data.questions);
  232 |       const hasGamificationContent = /gamificación|puntos|badges|leaderboard|recompensas/i.test(questionsText);
  233 |       const hasVideoContent = /danés|encasillar|personas|prejuicios|estereotipos/i.test(questionsText);
  234 |       
  235 |       if (hasGamificationContent) {
  236 |         console.log('❌ PROBLEM: API is returning gamification questions!');
  237 |         expect(hasGamificationContent).toBe(false);
  238 |       } else if (hasVideoContent) {
  239 |         console.log('✅ GOOD: API is returning video-specific questions');
  240 |       } else {
  241 |         console.log('❓ Questions content is unclear, but no gamification detected');
  242 |       }
  243 |     } else {
  244 |       console.log('❌ API call failed:', result.error);
  245 |       throw new Error(`API test failed: ${result.error}`);
  246 |     }
  247 |   });
  248 | }); 
```