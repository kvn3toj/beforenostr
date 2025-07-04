import { chromium, Browser, Page, Response } from 'playwright';
import fs from 'fs/promises';
import path from 'path';

// Configuración de directorios
const BASE_DIR = 'recovered_code/red_pill_improved_complete';
const DIRECTORIES = {
  html: BASE_DIR,
  css: `${BASE_DIR}/assets/css`,
  js: `${BASE_DIR}/assets/js`,
  images: `${BASE_DIR}/assets/images`,
  videos: `${BASE_DIR}/assets/videos`,
  fonts: `${BASE_DIR}/assets/fonts`,
  data: `${BASE_DIR}/assets/data`,
  other: `${BASE_DIR}/assets/other`,
  journeys: `${BASE_DIR}/video_journeys`,
  downloads: `${BASE_DIR}/video_downloads`
};

// URLs principales y videos conocidos
const MAIN_URLS = [
  'https://demo.coomunity.co/red-pill/c8862dd1',
  'https://demo.coomunity.co/go/c8862dd1'
];

// Variables globales
const downloadedUrls = new Set<string>();
const allVideosFound = new Set<string>();
let stateCounter = 0;
let journeyStep = 0;
let maxDepth = 0;

/**
 * Crear directorios
 */
async function createDirectories(): Promise<void> {
  console.log('📁 Creando estructura mejorada...');
  for (const dir of Object.values(DIRECTORIES)) {
    await fs.mkdir(dir, { recursive: true });
  }
  console.log('✅ Directorios creados');
}

/**
 * Interceptor de respuestas simplificado
 */
async function downloadResource(response: Response): Promise<void> {
  try {
    const url = response.url();
    if (response.status() !== 200 || downloadedUrls.has(url)) return;
    
    downloadedUrls.add(url);
    
    // Solo reportar videos importantes
    if (url.includes('vimeo.com/video/') || url.includes('.mp4') || url.includes('.webm')) {
      console.log(`🎥 VIDEO DETECTADO: ${url}`);
      
      const vimeoMatch = url.match(/video\/(\d+)/);
      if (vimeoMatch && vimeoMatch[1]) {
        allVideosFound.add(vimeoMatch[1]);
        console.log(`   📺 ID: ${vimeoMatch[1]}`);
      }
    }
    
  } catch (error) {
    // Silenciar errores
  }
}

/**
 * Guardar estado mejorado
 */
async function saveState(page: Page, context: string, step: number): Promise<any> {
  try {
    stateCounter++;
    journeyStep = Math.max(journeyStep, step);
    
    const currentUrl = page.url();
    const htmlContent = await page.content();
    const fileName = `improved_step_${step}_${context}_${stateCounter}.html`;
    const filePath = path.join(DIRECTORIES.html, fileName);
    
    await fs.writeFile(filePath, htmlContent);
    console.log(`📄 [Step ${step}] ${context} guardado: ${fileName}`);
    
    // Análisis de la página
    const analysis = await page.evaluate(() => {
      const html = document.documentElement.outerHTML;
      
      // Buscar videos de Vimeo
      const vimeoMatches = html.match(/vimeo\.com\/video\/(\d+)/g) || [];
      const vimeoIds = vimeoMatches.map(match => match.match(/(\d+)/)?.[1]).filter(Boolean);
      
      // Buscar elementos interactivos
      const interactiveElements = Array.from(document.querySelectorAll('button, a, [onclick], .btn')).map(el => ({
        tagName: el.tagName,
        id: (el as HTMLElement).id || '',
        className: (el as HTMLElement).className || '',
        text: el.textContent?.trim().substring(0, 30) || '',
        href: (el as HTMLAnchorElement).href || '',
        onclick: (el as HTMLElement).getAttribute('onclick') || '',
        visible: el.offsetWidth > 0 && el.offsetHeight > 0
      })).filter(el => el.visible);
      
      // Detectar estado del reproductor
      const hasVimeoPlayer = !!document.querySelector('#vimeo, iframe[src*="vimeo"]');
      const hasVideoOptions = !!document.getElementById('options');
      const hasQuestions = !!document.getElementById('questions');
      
      return {
        url: window.location.href,
        title: document.title,
        vimeoIds: [...new Set(vimeoIds)],
        hasVimeoPlayer,
        hasVideoOptions,
        hasQuestions,
        interactiveElements: interactiveElements.slice(0, 10), // Limitar a 10
        totalInteractiveElements: interactiveElements.length
      };
    });
    
    // Reportar videos encontrados
    if (analysis.vimeoIds.length > 0) {
      console.log(`🎬 Videos en página: ${analysis.vimeoIds.join(', ')}`);
      analysis.vimeoIds.forEach(id => allVideosFound.add(id));
    }
    
    console.log(`🎮 Elementos interactivos: ${analysis.totalInteractiveElements}`);
    
    // Guardar análisis
    const analysisPath = path.join(DIRECTORIES.journeys, `analysis_step_${step}_${context}_${stateCounter}.json`);
    await fs.writeFile(analysisPath, JSON.stringify(analysis, null, 2));
    
    return analysis;
    
  } catch (error) {
    console.error(`❌ Error guardando estado ${context}:`, error);
    return null;
  }
}

/**
 * Manejar video de forma simplificada
 */
async function handleVideo(page: Page, step: number, waitForEnd: boolean = false): Promise<boolean> {
  console.log(`🎬 [Step ${step}] Manejando video (waitForEnd: ${waitForEnd})...`);
  
  try {
    if (waitForEnd) {
      // Esperar a que aparezcan las opciones (indica que el video terminó)
      console.log('⏳ Esperando opciones del video...');
      
      const optionsAppeared = await page.waitForFunction(() => {
        const options = document.getElementById('options');
        return options && options.style.display === 'block';
      }, { timeout: 60000 }).then(() => true).catch(() => {
        console.log('⚠️ Timeout esperando opciones del video');
        return false;
      });
      
      if (optionsAppeared) {
        console.log('✅ Opciones del video aparecieron');
        await saveState(page, 'video_options_appeared', step);
        return true;
      } else {
        // Forzar aparición de opciones
        await page.evaluate(() => {
          const options = document.getElementById('options');
          if (options) {
            options.style.display = 'block';
          }
        });
        
        await page.waitForTimeout(2000);
        await saveState(page, 'video_options_forced', step);
        return true;
      }
    } else {
      // Solo detectar si hay video
      const hasVideo = await page.evaluate(() => {
        return !!document.querySelector('#vimeo, iframe[src*="vimeo"], video');
      });
      
      console.log(`📺 Video detectado: ${hasVideo ? 'Sí' : 'No'}`);
      return hasVideo;
    }
    
  } catch (error) {
    console.error('❌ Error manejando video:', error);
    return false;
  }
}

/**
 * Responder preguntas Red Pill
 */
async function answerRedPillQuestions(page: Page, step: number): Promise<boolean> {
  console.log(`📝 [Step ${step}] Respondiendo preguntas Red Pill...`);
  
  try {
    // Verificar si hay preguntas
    const hasQuestions = await page.evaluate(() => {
      return !!document.getElementById('questions');
    });
    
    if (!hasQuestions) {
      console.log('⚠️ No se encontraron preguntas');
      return false;
    }
    
    // Desbloquear preguntas
    await page.evaluate(() => {
      const questions = document.getElementById('questions');
      const sender = document.getElementById('sender');
      
      if (questions) {
        questions.classList.add('disable_blur');
        questions.style.filter = 'none';
      }
      if (sender) {
        sender.classList.add('disable_blur');
        sender.style.filter = 'none';
      }
    });
    
    await page.waitForTimeout(2000);
    await saveState(page, 'questions_unlocked', step);
    
    // Responder todas las preguntas con respuesta radical
    const questionsAnswered = await page.evaluate(() => {
      const questionWrappers = document.querySelectorAll('.wrapper[data-id]');
      let answered = 0;
      
      questionWrappers.forEach((wrapper, index) => {
        const buttons = wrapper.querySelectorAll('button[onclick*="loadAnimationMatch"]');
        if (buttons.length >= 7) {
          // Índice 6 = respuesta +3 (más radical)
          const radicalButton = buttons[6] as HTMLButtonElement;
          
          try {
            radicalButton.click();
            answered++;
          } catch (e) {
            // Si no funciona el clic, ejecutar el onclick directamente
            const onclickAttr = radicalButton.getAttribute('onclick');
            if (onclickAttr) {
              try {
                // Ejecutar la función de forma segura
                const func = new Function(onclickAttr);
                func();
                answered++;
              } catch (ex) {
                console.log('Error ejecutando onclick:', ex);
              }
            }
          }
        }
      });
      
      // Habilitar botón de envío
      const submitBtn = document.querySelector('#sender-submit-button') as HTMLButtonElement;
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.style.pointerEvents = 'auto';
        submitBtn.style.opacity = '1';
      }
      
      return answered;
    });
    
    console.log(`✅ Preguntas respondidas: ${questionsAnswered}`);
    await page.waitForTimeout(2000);
    await saveState(page, 'questions_answered', step);
    
    // Enviar respuestas
    const submitBtn = await page.$('#sender-submit-button');
    if (submitBtn) {
      console.log('📤 Enviando respuestas...');
      
      await submitBtn.click();
      await page.waitForTimeout(5000);
      
      // Esperar navegación
      await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {
        console.log('⚠️ Sin navegación automática detectada');
      });
      
      await saveState(page, 'answers_submitted', step + 1);
      return true;
    }
    
    return false;
    
  } catch (error) {
    console.error('❌ Error respondiendo preguntas:', error);
    return false;
  }
}

/**
 * Buscar y seguir elementos interactivos
 */
async function followInteractiveElements(page: Page, step: number): Promise<boolean> {
  console.log(`🎯 [Step ${step}] Buscando elementos interactivos...`);
  
  try {
    const analysis = await saveState(page, 'searching_interactive', step);
    if (!analysis) return false;
    
    // Priorizar elementos específicos
    const priorityElements = analysis.interactiveElements.filter((el: any) => 
      el.text.toLowerCase().includes('continuar') ||
      el.text.toLowerCase().includes('siguiente') ||
      el.text.toLowerCase().includes('next') ||
      el.id.includes('option') ||
      el.href.includes('video') ||
      el.href.includes('/go/')
    );
    
    if (priorityElements.length > 0) {
      console.log(`🎮 Elementos prioritarios encontrados: ${priorityElements.length}`);
      
      for (const element of priorityElements.slice(0, 3)) {
        console.log(`🖱️ Probando: "${element.text}" (${element.tagName})`);
        
        try {
          let clicked = false;
          
          if (element.id) {
            const elementHandle = await page.$(`#${element.id}`);
            if (elementHandle && await elementHandle.isVisible()) {
              await elementHandle.click();
              clicked = true;
            }
          }
          
          if (!clicked && element.text) {
            // Buscar por texto
            const textSelector = `text="${element.text.trim()}"`;
            const textElement = await page.$(textSelector);
            if (textElement && await textElement.isVisible()) {
              await textElement.click();
              clicked = true;
            }
          }
          
          if (clicked) {
            console.log(`✅ Clic exitoso en: "${element.text}"`);
            await page.waitForTimeout(3000);
            
            // Verificar si hubo cambios
            const newUrl = page.url();
            await saveState(page, `after_click_${element.id || 'unknown'}`, step + 1);
            
            // Si hay nuevo video, manejarlo
            const hasNewVideo = await handleVideo(page, step + 1, false);
            if (hasNewVideo) {
              console.log('🎬 Nuevo video detectado tras interacción');
              return true;
            }
            
            // Continuar explorando recursivamente
            return await followInteractiveElements(page, step + 2);
          }
          
        } catch (error) {
          console.log(`⚠️ Error con elemento "${element.text}": ${error}`);
        }
      }
    }
    
    // Si no hay elementos prioritarios, buscar cualquier enlace interesante
    const allLinks = await page.$$('a[href*="video"], a[href*="/go/"], a[href*="next"], button:not([disabled])');
    
    for (let i = 0; i < Math.min(allLinks.length, 3); i++) {
      const link = allLinks[i];
      
      try {
        const isVisible = await link.isVisible();
        if (!isVisible) continue;
        
        const text = await link.textContent() || '';
        const href = await link.getAttribute('href') || '';
        
        console.log(`🔗 Probando enlace: "${text.substring(0, 30)}" -> ${href}`);
        
        await link.click();
        await page.waitForTimeout(3000);
        
        await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});
        
        const newUrl = page.url();
        console.log(`🚀 Nueva URL: ${newUrl}`);
        
        await saveState(page, `link_followed_${i}`, step + 1);
        
        // Verificar si hay nuevos videos
        const hasNewVideo = await handleVideo(page, step + 1, false);
        if (hasNewVideo) {
          console.log('🎬 Nuevo video tras seguir enlace');
          return true;
        }
        
        return true;
        
      } catch (error) {
        console.log(`⚠️ Error con enlace ${i + 1}`);
      }
    }
    
    console.log('⚠️ No se encontraron más elementos para seguir');
    return false;
    
  } catch (error) {
    console.error('❌ Error siguiendo elementos interactivos:', error);
    return false;
  }
}

/**
 * Explorar URL completa
 */
async function exploreUrl(page: Page, url: string, startStep: number): Promise<number> {
  console.log(`\n🌟 === EXPLORANDO: ${url} (Step ${startStep}) ===`);
  
  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(3000);
    
    let currentStep = startStep;
    
    // Estado inicial
    const initialAnalysis = await saveState(page, 'initial_load', currentStep);
    currentStep++;
    
    // Si hay video, manejarlo
    if (initialAnalysis?.hasVimeoPlayer) {
      const videoHandled = await handleVideo(page, currentStep, true);
      currentStep++;
      
      if (videoHandled && initialAnalysis?.hasVideoOptions) {
        // Buscar opciones Red Pill/Blue Pill
        const leftOption = await page.$('#left-option');
        if (leftOption && await leftOption.isVisible()) {
          console.log('🔴 Seleccionando Red Pill...');
          await leftOption.click();
          await page.waitForTimeout(3000);
          
          await saveState(page, 'red_pill_selected', currentStep);
          currentStep++;
          
          // Manejar preguntas si aparecen
          const questionsHandled = await answerRedPillQuestions(page, currentStep);
          if (questionsHandled) {
            currentStep += 2; // Se incrementa dentro de la función también
          }
        }
      }
    }
    
    // Continuar explorando elementos interactivos
    let canContinue = true;
    let attempts = 0;
    const maxAttempts = 5;
    
    while (canContinue && attempts < maxAttempts) {
      console.log(`\n🔄 [Intento ${attempts + 1}/${maxAttempts}] Continuando exploración...`);
      
      canContinue = await followInteractiveElements(page, currentStep);
      currentStep++;
      attempts++;
      
      if (canContinue) {
        await page.waitForTimeout(2000);
      }
    }
    
    console.log(`✅ Exploración de ${url} completada en ${currentStep - startStep} pasos`);
    return currentStep;
    
  } catch (error) {
    console.error(`❌ Error explorando ${url}:`, error);
    return startStep + 1;
  }
}

/**
 * Función principal mejorada
 */
async function main(): Promise<void> {
  let browser: Browser | null = null;
  
  try {
    console.log('🚀 Iniciando Red Pill Improved Explorer...');
    console.log('🎬 Objetivos: Exploración completa sin errores + Seguir toda la cadena');
    
    await createDirectories();
    
    browser = await chromium.launch({ 
      headless: false,
      slowMo: 200
    });
    
    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      viewport: { width: 1920, height: 1080 }
    });
    
    const page = await context.newPage();
    page.on('response', downloadResource);
    
    let currentStep = 1;
    
    // Explorar todas las URLs principales
    for (const url of MAIN_URLS) {
      currentStep = await exploreUrl(page, url, currentStep);
      maxDepth = Math.max(maxDepth, currentStep);
    }
    
    console.log('\n🎉 Exploración mejorada completada!');
    console.log(`📊 Estadísticas finales:`);
    console.log(`   - Estados HTML capturados: ${stateCounter}`);
    console.log(`   - Pasos totales del recorrido: ${journeyStep}`);
    console.log(`   - Profundidad máxima: ${maxDepth}`);
    console.log(`   - Videos únicos encontrados: ${allVideosFound.size}`);
    console.log(`   - IDs de videos: ${Array.from(allVideosFound).join(', ')}`);
    console.log(`   - URLs interceptadas: ${downloadedUrls.size}`);
    
    // Guardar resumen final mejorado
    const finalSummary = {
      timestamp: new Date().toISOString(),
      totalStates: stateCounter,
      journeySteps: journeyStep,
      maxDepth,
      uniqueVideos: Array.from(allVideosFound),
      exploredUrls: MAIN_URLS,
      totalInterceptions: downloadedUrls.size,
      success: true
    };
    
    const summaryPath = path.join(DIRECTORIES.journeys, 'improved_final_summary.json');
    await fs.writeFile(summaryPath, JSON.stringify(finalSummary, null, 2));
    
  } catch (error) {
    console.error('❌ Error durante la exploración mejorada:', error);
  } finally {
    if (browser) {
      await browser.close();
      console.log('🔒 Navegador cerrado');
    }
  }
}

// Ejecutar script
if (require.main === module) {
  main().catch(console.error);
}

export { main }; 