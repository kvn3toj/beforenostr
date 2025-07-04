import { chromium, Browser, Page, Response } from 'playwright';
import fs from 'fs/promises';
import path from 'path';

// Configuración de directorios
const BASE_DIR = 'recovered_code/red_pill_complete_journey';
const DIRECTORIES = {
  html: BASE_DIR,
  css: `${BASE_DIR}/assets/css`,
  js: `${BASE_DIR}/assets/js`,
  images: `${BASE_DIR}/assets/images`,
  videos: `${BASE_DIR}/assets/videos`,
  fonts: `${BASE_DIR}/assets/fonts`,
  data: `${BASE_DIR}/assets/data`,
  other: `${BASE_DIR}/assets/other`,
  inlineCss: `${BASE_DIR}/inline_css`,
  inlineJs: `${BASE_DIR}/inline_js`,
  journeys: `${BASE_DIR}/video_journeys`
};

// URL objetivo
const TARGET_URL = 'https://demo.coomunity.co/red-pill/c8862dd1';

// Variables de control de flujo
const downloadedUrls = new Set<string>();
const visitedStates = new Set<string>();
let journeyCounter = 0;
let stateCounter = 0;
let videoCounter = 0;

// Configuración para exploraciones exhaustivas
const JOURNEY_CONFIG = {
  maxDepth: 10,           // Máximo de niveles de profundidad
  maxVideosPerPath: 20,   // Máximo videos por recorrido
  waitTimeVideo: 120000,  // 2 minutos para videos
  waitTimeUI: 10000,      // 10 segundos para elementos UI
  explorationModes: ['red_pill', 'blue_pill', 'mixed_responses']
};

interface JourneyStep {
  stepNumber: number;
  url: string;
  title: string;
  interactiveElements: InteractiveElementData[];
  videoData: VideoInfo[];
  clickedElement?: InteractiveElementData;
  navigationSuccess: boolean;
  screenshots: string[];
  timestamp: string;
  timeSpent: number;
}

interface InteractiveElementData {
  type: 'button' | 'link' | 'decision' | 'navigation' | 'video' | 'unknown';
  id?: string;
  className?: string;
  text?: string;
  href?: string;
  position: { x: number; y: number; width: number; height: number };
  clickable: boolean;
  selector: string;
  priority: number; // Higher priority = more likely to be the next step
}

interface VideoInfo {
  id: string;
  src: string;
  type: 'vimeo' | 'youtube' | 'other';
  status: 'working' | 'error' | 'loading';
}

interface CompleteJourney {
  journeyId: string;
  startUrl: string;
  startTime: string;
  endTime: string;
  totalSteps: number;
  steps: JourneyStep[];
  discoveredUrls: string[];
  allVideos: VideoInfo[];
  navigationMap: Record<string, string[]>; // URL -> possible next URLs
}

/**
 * Crear estructura de directorios
 */
async function createDirectories(): Promise<void> {
  console.log('📁 Creando estructura para captura completa del recorrido...');
  for (const dir of Object.values(DIRECTORIES)) {
    await fs.mkdir(dir, { recursive: true });
  }
  console.log('✅ Directorios creados exitosamente');
}

/**
 * Funciones de descarga (reutilizadas)
 */
function getDestinationDirectory(url: string, contentType: string): string {
  const urlPath = new URL(url).pathname.toLowerCase();
  const extension = path.extname(urlPath);

  if (contentType.includes('video/') || ['.mp4', '.webm', '.mov', '.avi'].includes(extension)) {
    return DIRECTORIES.videos;
  }
  if (contentType.includes('text/css') || contentType.includes('stylesheet')) {
    return DIRECTORIES.css;
  }
  if (contentType.includes('javascript') || contentType.includes('application/javascript')) {
    return DIRECTORIES.js;
  }
  if (contentType.includes('image/')) {
    return DIRECTORIES.images;
  }
  if (contentType.includes('font/') || contentType.includes('application/font')) {
    return DIRECTORIES.fonts;
  }
  if (contentType.includes('application/json') || contentType.includes('text/json')) {
    return DIRECTORIES.data;
  }

  switch (extension) {
    case '.css': return DIRECTORIES.css;
    case '.js': case '.mjs': return DIRECTORIES.js;
    case '.jpg': case '.jpeg': case '.png': case '.gif': case '.svg': 
    case '.webp': case '.ico': return DIRECTORIES.images;
    case '.woff': case '.woff2': case '.ttf': case '.otf': return DIRECTORIES.fonts;
    case '.json': return DIRECTORIES.data;
    default: return DIRECTORIES.other;
  }
}

async function downloadResource(response: Response): Promise<void> {
  try {
    const url = response.url();
    if (response.status() !== 200 || downloadedUrls.has(url)) return;
    
    downloadedUrls.add(url);
    const contentType = response.headers()['content-type'] || '';
    const destinationDir = getDestinationDirectory(url, contentType);
    const fileName = path.basename(new URL(url).pathname) || `resource_${Date.now()}`;
    const filePath = path.join(destinationDir, fileName);
    
    const buffer = await response.body();
    await fs.writeFile(filePath, buffer);
    console.log(`📥 Descargado: ${fileName} (${buffer.length} bytes)`);
    
  } catch (error) {
    console.error(`❌ Error descargando ${response.url()}:`, error);
  }
}

/**
 * Guardar estado con información del recorrido
 */
async function saveJourneyState(page: Page, context: string, depth: number = 0): Promise<void> {
  try {
    stateCounter++;
    const currentUrl = page.url();
    const urlKey = `${currentUrl}_${context}_${depth}`;
    
    if (visitedStates.has(urlKey)) {
      console.log(`⚠️ Estado ya capturado: ${context}`);
      return;
    }
    
    visitedStates.add(urlKey);
    
    const htmlContent = await page.content();
    const fileName = `journey_${journeyCounter}_depth_${depth}_${context}_${stateCounter}.html`;
    const filePath = path.join(DIRECTORIES.html, fileName);
    
    await fs.writeFile(filePath, htmlContent);
    
    // Guardar información del recorrido
    const journeyInfo = {
      timestamp: new Date().toISOString(),
      url: currentUrl,
      context,
      depth,
      stateCounter,
      fileName
    };
    
    const journeyPath = path.join(DIRECTORIES.journeys, `journey_${journeyCounter}_log.json`);
    let journeyLog = [];
    
    try {
      const existingLog = await fs.readFile(journeyPath, 'utf8');
      journeyLog = JSON.parse(existingLog);
    } catch {
      // Archivo no existe, comenzar nuevo log
    }
    
    journeyLog.push(journeyInfo);
    await fs.writeFile(journeyPath, JSON.stringify(journeyLog, null, 2));
    
    console.log(`📄 Estado guardado: ${fileName} (Profundidad: ${depth})`);
    
  } catch (error) {
    console.error('❌ Error guardando estado del recorrido:', error);
  }
}

/**
 * Detectar si hay un video activo
 */
async function detectActiveVideo(page: Page): Promise<boolean> {
  try {
    const hasVimeoPlayer = await page.evaluate(() => {
      const vimeoIframe = document.querySelector('#vimeo, iframe[src*="vimeo"]');
      return !!vimeoIframe;
    });
    
    const hasVideoElement = await page.evaluate(() => {
      const videoElement = document.querySelector('video');
      return !!videoElement;
    });
    
    return hasVimeoPlayer || hasVideoElement;
  } catch {
    return false;
  }
}

/**
 * Esperar a que termine cualquier video activo
 */
async function waitForAnyVideoEnd(page: Page): Promise<boolean> {
  console.log('🎬 Detectando y esperando finalización de video...');
  
  try {
    // Intentar detectar reproductor de Vimeo
    const vimeoDetected = await page.waitForFunction(() => {
      return window.Vimeo && (window.player || document.querySelector('#vimeo'));
    }, { timeout: 5000 }).then(() => true).catch(() => false);
    
    if (vimeoDetected) {
      console.log('📺 Reproductor de Vimeo detectado');
      
      // Esperar a que termine y aparezcan opciones
      const videoEnded = await page.waitForFunction(() => {
        const optionsElement = document.getElementById('options');
        return optionsElement && optionsElement.style.display === 'block';
      }, { timeout: JOURNEY_CONFIG.waitTimeVideo }).then(() => true).catch(() => false);
      
      if (videoEnded) {
        console.log('✅ Video de Vimeo terminado - opciones visibles');
        return true;
      }
    }
    
    // Detectar videos HTML5
    const html5VideoDetected = await page.evaluate(() => {
      const videos = document.querySelectorAll('video');
      return videos.length > 0;
    });
    
    if (html5VideoDetected) {
      console.log('📹 Video HTML5 detectado');
      
      // Esperar a que termine el video
      const html5VideoEnded = await page.waitForFunction(() => {
        const videos = document.querySelectorAll('video');
        for (const video of videos) {
          if (video.ended || video.paused) {
            return true;
          }
        }
        return false;
      }, { timeout: JOURNEY_CONFIG.waitTimeVideo }).then(() => true).catch(() => false);
      
      if (html5VideoEnded) {
        console.log('✅ Video HTML5 terminado');
        return true;
      }
    }
    
    console.log('⚠️ No se detectaron videos o no terminaron en el tiempo esperado');
    return false;
    
  } catch (error) {
    console.log('⚠️ Error detectando videos:', error);
    return false;
  }
}

/**
 * Explorar opciones de video interactivo
 */
async function exploreVideoOptions(page: Page, depth: number): Promise<string[]> {
  console.log(`🎯 Explorando opciones de video (Profundidad: ${depth})...`);
  
  const foundPaths: string[] = [];
  
  try {
    // Buscar opciones izquierda/derecha
    const leftOption = await page.$('#left-option');
    const rightOption = await page.$('#right-option');
    
    if (leftOption && await leftOption.isVisible()) {
      console.log('🔴 Opción izquierda disponible');
      foundPaths.push('left_option');
    }
    
    if (rightOption && await rightOption.isVisible()) {
      console.log('🔵 Opción derecha disponible');
      foundPaths.push('right_option');
    }
    
    // Buscar otros botones interactivos
    const interactiveButtons = await page.$$('button[onclick*="video"], a[href*="video"], .video-option, [data-video]');
    
    if (interactiveButtons.length > 0) {
      console.log(`🎮 Encontrados ${interactiveButtons.length} botones interactivos adicionales`);
      for (let i = 0; i < interactiveButtons.length; i++) {
        foundPaths.push(`interactive_button_${i}`);
      }
    }
    
  } catch (error) {
    console.error('❌ Error explorando opciones de video:', error);
  }
  
  return foundPaths;
}

/**
 * Responder preguntas automáticamente con diferentes estrategias
 */
async function answerQuestions(page: Page, strategy: 'red_pill' | 'blue_pill' | 'mixed'): Promise<boolean> {
  console.log(`❓ Respondiendo preguntas con estrategia: ${strategy}`);
  
  try {
    // Buscar botones de respuesta
    const questionButtons = await page.$$('button[onclick*="loadAnimationMatch"]');
    
    if (questionButtons.length === 0) {
      console.log('⚠️ No se encontraron preguntas para responder');
      return false;
    }
    
    console.log(`📝 Encontradas ${questionButtons.length} preguntas`);
    
    let responsePattern: number[];
    
    switch (strategy) {
      case 'red_pill':
        responsePattern = [3, 3, 3]; // Respuestas más radicales
        break;
      case 'blue_pill':
        responsePattern = [-3, -3, -3]; // Respuestas más conservadoras
        break;
      case 'mixed':
        responsePattern = [1, -1, 2]; // Respuestas mixtas
        break;
    }
    
    // Agrupar botones por pregunta (asumiendo 7 botones por pregunta)
    for (let questionIndex = 0; questionIndex < Math.floor(questionButtons.length / 7); questionIndex++) {
      const baseIndex = questionIndex * 7;
      const responseValue = responsePattern[questionIndex % responsePattern.length];
      
      // Convertir valor de respuesta a índice de botón (0-6, donde 3 es neutral)
      const buttonIndex = responseValue + 3;
      const targetButtonIndex = baseIndex + buttonIndex;
      
      if (targetButtonIndex < questionButtons.length) {
        const button = questionButtons[targetButtonIndex];
        
        console.log(`🔘 Respondiendo pregunta ${questionIndex + 1} con valor ${responseValue}`);
        await button.click();
        await page.waitForTimeout(2000);
        
        // Guardar estado después de cada respuesta
        await saveJourneyState(page, `question_${questionIndex + 1}_answered`, 0);
      }
    }
    
    // Buscar y hacer clic en botón de envío
    const submitButton = await page.$('#sender-submit-button, button[type="submit"], .submit-btn');
    if (submitButton) {
      console.log('📤 Enviando respuestas...');
      await submitButton.click();
      await page.waitForTimeout(3000);
      
      // Esperar navegación o cambios
      await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {
        console.log('⚠️ Timeout esperando navegación después del envío');
      });
      
      return true;
    }
    
    return false;
    
  } catch (error) {
    console.error('❌ Error respondiendo preguntas:', error);
    return false;
  }
}

/**
 * Explorar recorrido completo de videos
 */
async function exploreCompleteJourney(page: Page, journeyType: string, depth: number = 0): Promise<void> {
  if (depth >= JOURNEY_CONFIG.maxDepth) {
    console.log(`🛑 Profundidad máxima alcanzada (${JOURNEY_CONFIG.maxDepth})`);
    return;
  }
  
  console.log(`🌟 Explorando recorrido completo: ${journeyType} (Profundidad: ${depth})`);
  
  // Guardar estado inicial de este nivel
  await saveJourneyState(page, `${journeyType}_start`, depth);
  
  // Detectar si hay video activo
  const hasVideo = await detectActiveVideo(page);
  
  if (hasVideo) {
    videoCounter++;
    console.log(`🎬 Video #${videoCounter} detectado en profundidad ${depth}`);
    
    // Esperar a que termine el video
    const videoEnded = await waitForAnyVideoEnd(page);
    
    if (videoEnded) {
      await saveJourneyState(page, `${journeyType}_video_${videoCounter}_ended`, depth);
      
      // Explorar opciones disponibles
      const availableOptions = await exploreVideoOptions(page, depth);
      
      if (availableOptions.length > 0) {
        // Explorar cada opción
        for (const option of availableOptions) {
          console.log(`🎯 Explorando opción: ${option}`);
          
          // Hacer clic en la opción
          if (option === 'left_option') {
            const leftBtn = await page.$('#left-option');
            if (leftBtn) {
              await leftBtn.click();
              await page.waitForTimeout(3000);
              await saveJourneyState(page, `${journeyType}_${option}`, depth);
              
              // Responder preguntas si aparecen
              const questionsAppeared = await page.$('#questions').then(el => el?.isVisible()).catch(() => false);
              if (questionsAppeared) {
                const strategy = journeyType.includes('red') ? 'red_pill' : 
                               journeyType.includes('blue') ? 'blue_pill' : 'mixed';
                const answered = await answerQuestions(page, strategy);
                
                if (answered) {
                  // Continuar recorrido después de responder
                  await exploreCompleteJourney(page, `${journeyType}_questions_answered`, depth + 1);
                }
              } else {
                // Continuar recorrido sin preguntas
                await exploreCompleteJourney(page, `${journeyType}_${option}`, depth + 1);
              }
            }
          } else if (option === 'right_option') {
            // Recargar página para explorar path derecho
            await page.reload();
            await page.waitForLoadState('networkidle');
            
            // Esperar video y hacer clic derecho
            await waitForAnyVideoEnd(page);
            const rightBtn = await page.$('#right-option');
            if (rightBtn) {
              await rightBtn.click();
              await page.waitForTimeout(3000);
              await saveJourneyState(page, `${journeyType}_${option}`, depth);
              
              // Continuar recorrido
              await exploreCompleteJourney(page, `${journeyType}_${option}`, depth + 1);
            }
          }
        }
      }
    }
  } else {
    console.log('ℹ️ No se detectaron videos en este nivel');
    
    // Buscar enlaces o botones que puedan llevar a más contenido
    const nextLinks = await page.$$('a[href*="video"], a[href*="next"], .continue-btn, .next-video');
    
    if (nextLinks.length > 0) {
      console.log(`🔗 Encontrados ${nextLinks.length} enlaces para continuar`);
      
      for (let i = 0; i < Math.min(nextLinks.length, 3); i++) {
        const link = nextLinks[i];
        
        try {
          await link.click();
          await page.waitForLoadState('networkidle', { timeout: 10000 });
          await exploreCompleteJourney(page, `${journeyType}_link_${i}`, depth + 1);
        } catch (error) {
          console.log(`⚠️ Error siguiendo enlace ${i}:`, error);
        }
      }
    }
  }
}

/**
 * Función principal del explorador completo
 */
async function main(): Promise<void> {
  let browser: Browser | null = null;
  
  try {
    console.log('🚀 Iniciando Red Pill Complete Journey Scraper...');
    console.log(`🎯 URL objetivo: ${TARGET_URL}`);
    console.log('🎬 Modo: Captura completa de toda la cadena de videos interactivos');
    
    await createDirectories();
    
    browser = await chromium.launch({ 
      headless: false,
      slowMo: 300
    });
    
    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      viewport: { width: 1920, height: 1080 }
    });
    
    const page = await context.newPage();
    
    // Interceptor de respuestas
    page.on('response', downloadResource);
    
    console.log('🌐 Navegando a la URL objetivo...');
    await page.goto(TARGET_URL, { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });
    
    // Explorar cada tipo de recorrido
    for (const mode of JOURNEY_CONFIG.explorationModes) {
      journeyCounter++;
      console.log(`\n🎭 === INICIANDO RECORRIDO ${journeyCounter}: ${mode.toUpperCase()} ===`);
      
      // Reiniciar contadores para este recorrido
      stateCounter = 0;
      videoCounter = 0;
      
      // Navegar de nuevo para estado limpio
      await page.goto(TARGET_URL, { waitUntil: 'networkidle' });
      
      // Explorar recorrido completo
      await exploreCompleteJourney(page, mode, 0);
      
      console.log(`✅ Recorrido ${mode} completado`);
      console.log(`📊 Estados capturados: ${stateCounter}, Videos: ${videoCounter}`);
    }
    
    console.log('\n🎉 Exploración completa de todos los recorridos finalizada!');
    console.log(`📊 Estadísticas finales:`);
    console.log(`   - Recorridos explorados: ${journeyCounter}`);
    console.log(`   - URLs descargadas: ${downloadedUrls.size}`);
    console.log(`   - Estados únicos: ${visitedStates.size}`);
    
  } catch (error) {
    console.error('❌ Error durante la exploración completa:', error);
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