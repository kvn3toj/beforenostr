import { chromium, Browser, Page, Response } from 'playwright';
import fs from 'fs/promises';
import path from 'path';

// Configuración de directorios
const BASE_DIR = 'recovered_code/red_pill_direct_exploration';
const DIRECTORIES = {
  html: BASE_DIR,
  css: `${BASE_DIR}/assets/css`,
  js: `${BASE_DIR}/assets/js`,
  images: `${BASE_DIR}/assets/images`,
  videos: `${BASE_DIR}/assets/videos`,
  fonts: `${BASE_DIR}/assets/fonts`,
  data: `${BASE_DIR}/assets/data`,
  other: `${BASE_DIR}/assets/other`,
  journeys: `${BASE_DIR}/video_journeys`
};

const TARGET_URL = 'https://demo.coomunity.co/red-pill/c8862dd1';

// Variables globales
const downloadedUrls = new Set<string>();
let journeyCounter = 0;
let stateCounter = 0;
let videoCounter = 0;

/**
 * Crear directorios
 */
async function createDirectories(): Promise<void> {
  console.log('📁 Creando estructura para exploración directa...');
  for (const dir of Object.values(DIRECTORIES)) {
    await fs.mkdir(dir, { recursive: true });
  }
  console.log('✅ Directorios creados');
}

/**
 * Descarga de recursos
 */
async function downloadResource(response: Response): Promise<void> {
  try {
    const url = response.url();
    if (response.status() !== 200 || downloadedUrls.has(url)) return;
    
    downloadedUrls.add(url);
    
    // Solo reportar videos y recursos importantes
    const urlPath = new URL(url).pathname.toLowerCase();
    if (urlPath.includes('video') || urlPath.includes('.mp4') || urlPath.includes('.webm') || urlPath.includes('vimeo')) {
      console.log(`🎥 Video encontrado: ${urlPath}`);
    }
    
  } catch (error) {
    // Silenciar errores
  }
}

/**
 * Guardar estado con contexto
 */
async function saveState(page: Page, context: string): Promise<void> {
  try {
    stateCounter++;
    const htmlContent = await page.content();
    const fileName = `direct_exploration_${context}_${stateCounter}.html`;
    const filePath = path.join(DIRECTORIES.html, fileName);
    
    await fs.writeFile(filePath, htmlContent);
    console.log(`📄 Estado capturado: ${fileName}`);
    
    // Buscar menciones de videos en el HTML
    const videoMentions = await page.evaluate(() => {
      const html = document.documentElement.outerHTML;
      const vimeoMatches = html.match(/vimeo\.com\/video\/(\d+)/g) || [];
      const mp4Matches = html.match(/[^"'\s]+\.mp4/g) || [];
      const webmMatches = html.match(/[^"'\s]+\.webm/g) || [];
      
      return {
        vimeoVideos: vimeoMatches,
        mp4Videos: mp4Matches,
        webmVideos: webmMatches
      };
    });
    
    if (videoMentions.vimeoVideos.length > 0 || videoMentions.mp4Videos.length > 0 || videoMentions.webmVideos.length > 0) {
      console.log(`🎬 Videos encontrados en ${context}:`);
      console.log(`   - Vimeo: ${videoMentions.vimeoVideos.length} videos`);
      console.log(`   - MP4: ${videoMentions.mp4Videos.length} videos`);
      console.log(`   - WebM: ${videoMentions.webmVideos.length} videos`);
      
      // Guardar información de videos
      const videoInfo = {
        context,
        timestamp: new Date().toISOString(),
        ...videoMentions
      };
      
      const videoInfoPath = path.join(DIRECTORIES.journeys, `videos_found_${context}_${stateCounter}.json`);
      await fs.writeFile(videoInfoPath, JSON.stringify(videoInfo, null, 2));
    }
    
  } catch (error) {
    console.error(`❌ Error guardando estado ${context}:`, error);
  }
}

/**
 * Explorar directamente sin esperar video inicial
 */
async function exploreDirectly(page: Page, path: 'red_pill' | 'blue_pill'): Promise<void> {
  console.log(`🎯 Explorando directamente el camino: ${path}`);
  
  try {
    // Esperar un poco a que la página se cargue
    await page.waitForTimeout(5000);
    
    // Forzar la aparición de opciones (como si el video hubiera terminado)
    await page.evaluate(() => {
      const optionsElement = document.getElementById('options');
      if (optionsElement) {
        optionsElement.style.display = 'block';
      }
      
      // También iniciar el video de loop si existe
      const loopVideo = document.getElementById('loop') as HTMLVideoElement;
      if (loopVideo) {
        loopVideo.play().catch(() => {});
      }
    });
    
    await page.waitForTimeout(2000);
    await saveState(page, `${path}_options_forced`);
    
    // Hacer clic en la opción correspondiente
    const optionSelector = path === 'red_pill' ? '#left-option' : '#right-option';
    const option = await page.$(optionSelector);
    
    if (option) {
      console.log(`🖱️ Haciendo clic en ${path}...`);
      await option.click();
      await page.waitForTimeout(3000);
      
      await saveState(page, `${path}_clicked`);
      
      if (path === 'red_pill') {
        // Esperar a que aparezcan las preguntas
        await page.waitForTimeout(2000);
        
        // Desbloquear preguntas manualmente si es necesario
        await page.evaluate(() => {
          const questions = document.getElementById('questions');
          const sender = document.getElementById('sender');
          
          if (questions) {
            questions.classList.add('disable_blur');
          }
          if (sender) {
            sender.classList.add('disable_blur');
          }
        });
        
        await saveState(page, `${path}_questions_unlocked`);
        
        // Responder preguntas rápidamente
        await answerQuestionsDirectly(page);
        
        // Buscar y hacer clic en enviar
        const submitBtn = await page.$('#sender-submit-button, button[type="submit"], .btn-submit');
        if (submitBtn) {
          console.log('📤 Enviando respuestas...');
          
          // Habilitar el botón si está deshabilitado
          await page.evaluate(() => {
            const submitButton = document.querySelector('#sender-submit-button, button[type="submit"], .btn-submit') as HTMLButtonElement;
            if (submitButton) {
              submitButton.disabled = false;
            }
          });
          
          await submitBtn.click();
          await page.waitForTimeout(5000);
          
          // Esperar cualquier navegación
          await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {
            console.log('⚠️ No hubo navegación después del envío');
          });
          
          await saveState(page, `${path}_submitted`);
        }
      } else {
        // Para blue pill, simplemente esperar cualquier resultado
        await page.waitForTimeout(5000);
        await saveState(page, `${path}_result`);
      }
      
    } else {
      console.log(`❌ No se encontró la opción ${optionSelector}`);
    }
    
  } catch (error) {
    console.error(`❌ Error en exploración directa de ${path}:`, error);
  }
}

/**
 * Responder preguntas directamente
 */
async function answerQuestionsDirectly(page: Page): Promise<void> {
  console.log('📝 Respondiendo preguntas directamente...');
  
  try {
    // Buscar todas las preguntas
    const questions = await page.$$('.wrapper[data-id]');
    console.log(`📋 Encontradas ${questions.length} preguntas`);
    
    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];
      const questionId = await question.getAttribute('data-id');
      
      // Buscar botones de esta pregunta
      const buttons = await question.$$('button[onclick*="loadAnimationMatch"]');
      
      if (buttons.length >= 7) {
        // Respuesta radical (índice 6 = +3)
        const radicalButton = buttons[6];
        await radicalButton.click();
        await page.waitForTimeout(1000);
        
        console.log(`✅ Pregunta ${questionId} respondida`);
      }
    }
    
    await saveState(page, 'questions_answered');
    
  } catch (error) {
    console.error('❌ Error respondiendo preguntas:', error);
  }
}

/**
 * Buscar todos los videos en la página actual
 */
async function scanForAllVideos(page: Page): Promise<void> {
  console.log('🔍 Escaneando todos los videos en la página...');
  
  try {
    const allVideos = await page.evaluate(() => {
      // Buscar iframes de Vimeo
      const vimeoIframes = Array.from(document.querySelectorAll('iframe[src*="vimeo"]')).map(iframe => {
        return {
          type: 'vimeo',
          src: (iframe as HTMLIFrameElement).src,
          id: (iframe as HTMLElement).id || 'unnamed'
        };
      });
      
      // Buscar elementos de video HTML5
      const html5Videos = Array.from(document.querySelectorAll('video')).map(video => {
        const sources = Array.from(video.querySelectorAll('source')).map(source => ({
          src: (source as HTMLSourceElement).src,
          type: (source as HTMLSourceElement).type
        }));
        
        return {
          type: 'html5',
          id: (video as HTMLElement).id || 'unnamed',
          src: (video as HTMLVideoElement).src,
          sources
        };
      });
      
      // Buscar menciones en JavaScript
      const scripts = Array.from(document.querySelectorAll('script')).map(script => script.textContent || '').join('\n');
      const videoMentions = scripts.match(/vimeo\.com\/video\/\d+|[^"'\s]+\.mp4|[^"'\s]+\.webm/g) || [];
      
      return {
        vimeoIframes,
        html5Videos,
        videoMentions: [...new Set(videoMentions)] // Eliminar duplicados
      };
    });
    
    console.log('🎬 Videos encontrados:');
    console.log(`   - Iframes de Vimeo: ${allVideos.vimeoIframes.length}`);
    console.log(`   - Videos HTML5: ${allVideos.html5Videos.length}`);
    console.log(`   - Menciones en código: ${allVideos.videoMentions.length}`);
    
    // Mostrar detalles
    allVideos.vimeoIframes.forEach((video, i) => {
      console.log(`     📺 Vimeo ${i + 1}: ${video.src} (ID: ${video.id})`);
    });
    
    allVideos.html5Videos.forEach((video, i) => {
      console.log(`     📹 HTML5 ${i + 1}: ${video.id}`);
      video.sources.forEach((source, j) => {
        console.log(`       🎞️ Source ${j + 1}: ${source.src} (${source.type})`);
      });
    });
    
    allVideos.videoMentions.forEach((mention, i) => {
      console.log(`     💬 Mención ${i + 1}: ${mention}`);
    });
    
    // Guardar información completa de videos
    const videoScanPath = path.join(DIRECTORIES.journeys, `complete_video_scan_${stateCounter}.json`);
    await fs.writeFile(videoScanPath, JSON.stringify(allVideos, null, 2));
    
    videoCounter += allVideos.vimeoIframes.length + allVideos.html5Videos.length;
    
  } catch (error) {
    console.error('❌ Error escaneando videos:', error);
  }
}

/**
 * Función principal
 */
async function main(): Promise<void> {
  let browser: Browser | null = null;
  
  try {
    console.log('🚀 Iniciando Red Pill Direct Exploration Scraper...');
    console.log(`🎯 URL objetivo: ${TARGET_URL}`);
    console.log('🎬 Modo: Exploración directa sin esperar videos');
    
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
    
    console.log('🌐 Navegando a la URL objetivo...');
    await page.goto(TARGET_URL, { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });
    
    // Escanear videos iniciales
    await saveState(page, 'initial_load');
    await scanForAllVideos(page);
    
    // === EXPLORACIÓN 1: RED PILL PATH ===
    journeyCounter = 1;
    console.log('\n🎭 === EXPLORACIÓN 1: RED PILL PATH DIRECTO ===');
    await exploreDirectly(page, 'red_pill');
    await scanForAllVideos(page);
    
    // === EXPLORACIÓN 2: BLUE PILL PATH ===
    console.log('\n🎭 === EXPLORACIÓN 2: BLUE PILL PATH DIRECTO ===');
    
    // Recargar para estado limpio
    await page.goto(TARGET_URL, { waitUntil: 'networkidle' });
    journeyCounter = 2;
    
    await exploreDirectly(page, 'blue_pill');
    await scanForAllVideos(page);
    
    console.log('\n🎉 Exploración directa completada!');
    console.log(`📊 Estadísticas:`);
    console.log(`   - Estados capturados: ${stateCounter}`);
    console.log(`   - Videos totales encontrados: ${videoCounter}`);
    console.log(`   - URLs descargadas: ${downloadedUrls.size}`);
    
  } catch (error) {
    console.error('❌ Error durante la exploración directa:', error);
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