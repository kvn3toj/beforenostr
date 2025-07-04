import { chromium, Browser, Page, Response } from 'playwright';
import fs from 'fs/promises';
import path from 'path';

// Configuración para exploración colaborativa
const BASE_DIR = 'recovered_code/red_pill_collaborative';
const DIRECTORIES = {
  html: BASE_DIR,
  css: `${BASE_DIR}/assets/css`,
  js: `${BASE_DIR}/assets/js`,
  images: `${BASE_DIR}/assets/images`,
  videos: `${BASE_DIR}/assets/videos`,
  fonts: `${BASE_DIR}/assets/fonts`,
  data: `${BASE_DIR}/assets/data`,
  other: `${BASE_DIR}/assets/other`,
  journeys: `${BASE_DIR}/collaborative_journeys`,
  downloads: `${BASE_DIR}/video_downloads`
};

// URLs para explorar
const URLS_TO_EXPLORE = [
  'https://demo.coomunity.co/red-pill/c8862dd1',
  'https://demo.coomunity.co/pilgrim/640baa58'  // Nueva URL Pilgrim
];

// URL inicial (la elegiremos)
let INITIAL_URL = URLS_TO_EXPLORE[0];

// Variables de seguimiento
const capturedUrls = new Set<string>();
const videosFound = new Set<string>();
const realVideoUrls = new Set<string>();
let captureCounter = 0;
let sessionStartTime = Date.now();

/**
 * Crear directorios para la sesión colaborativa
 */
async function setupCollaborativeSession(): Promise<void> {
  console.log('🎬 Configurando sesión colaborativa...');
  
  for (const dir of Object.values(DIRECTORIES)) {
    await fs.mkdir(dir, { recursive: true });
  }
  
  console.log('✅ Directorios creados para sesión colaborativa');
  
  // Crear log de sesión
  const sessionLog = {
    sessionStart: new Date().toISOString(),
    initialUrl: INITIAL_URL,
    purpose: 'Exploración colaborativa manual de Red Pill Interactive',
    setup: 'Usuario navega manualmente, Playwright captura automáticamente'
  };
  
  await fs.writeFile(
    path.join(DIRECTORIES.journeys, 'session_start.json'),
    JSON.stringify(sessionLog, null, 2)
  );
}

/**
 * Interceptor inteligente de respuestas
 */
async function smartResponseHandler(response: Response): Promise<void> {
  try {
    const url = response.url();
    const status = response.status();
    
    // Solo procesar respuestas exitosas y URLs únicas
    if (status !== 200 || capturedUrls.has(url)) return;
    
    capturedUrls.add(url);
    
    // Detectar videos de Vimeo
    if (url.includes('vimeo.com')) {
      console.log(`🎥 VIMEO DETECTADO: ${url}`);
      
      // Extraer ID de video si es posible
      const vimeoIdMatch = url.match(/(?:video\/|\/|^)(\d+)/);
      if (vimeoIdMatch && vimeoIdMatch[1]) {
        videosFound.add(vimeoIdMatch[1]);
        console.log(`   📺 Video ID: ${vimeoIdMatch[1]}`);
      }
    }
    
    // Detectar URLs de video reales
    if (url.includes('.mp4') || url.includes('.webm') || url.includes('.m3u8') || 
        url.includes('vimeocdn.com') || url.includes('video/')) {
      realVideoUrls.add(url);
      console.log(`🎬 URL REAL DE VIDEO: ${url}`);
      
      // Intentar descargar información del video
      try {
        const videoInfo = {
          url,
          timestamp: new Date().toISOString(),
          headers: Object.fromEntries(response.headers()),
          status: response.status()
        };
        
        const infoPath = path.join(
          DIRECTORIES.videos, 
          `video_info_${Date.now()}.json`
        );
        
        await fs.writeFile(infoPath, JSON.stringify(videoInfo, null, 2));
        console.log(`   💾 Info guardada: ${path.basename(infoPath)}`);
        
      } catch (error) {
        console.log(`   ⚠️ Error guardando info: ${error}`);
      }
    }
    
    // Capturar recursos importantes
    const contentType = response.headers()['content-type'] || '';
    
    if (contentType.includes('text/html')) {
      // Capturar HTML de páginas importantes
      if (url.includes('coomunity.co') && !url.includes('static') && !url.includes('api/')) {
        try {
          const content = await response.text();
          const fileName = `page_${Date.now()}_${path.basename(new URL(url).pathname) || 'index'}.html`;
          const filePath = path.join(DIRECTORIES.html, fileName);
          
          await fs.writeFile(filePath, content);
          console.log(`📄 HTML capturado: ${fileName} (${url})`);
          
        } catch (error) {
          console.log(`⚠️ Error capturando HTML: ${error}`);
        }
      }
    }
    
  } catch (error) {
    // Silenciar errores de red para no interrumpir la navegación
  }
}

/**
 * Capturar estado actual de la página (versión corregida)
 */
async function capturePageState(page: Page, context: string): Promise<any> {
  try {
    captureCounter++;
    const timestamp = Date.now();
    const sessionTime = Math.round((timestamp - sessionStartTime) / 1000);
    
    console.log(`\n📸 [${sessionTime}s] Capturando estado: ${context}`);
    
    const currentUrl = page.url();
    const htmlContent = await page.content();
    
    // Analizar la página con manejo seguro de null
    const analysis = await page.evaluate(() => {
      const html = document.documentElement.outerHTML;
      
      // Buscar videos de Vimeo
      const vimeoIds = [];
      const vimeoMatches = html.match(/vimeo\.com\/video\/(\d+)/g) || [];
      vimeoMatches.forEach(match => {
        const id = match.match(/(\d+)/);
        if (id && id[1]) vimeoIds.push(id[1]);
      });
      
      // Analizar elementos interactivos con manejo seguro
      const interactiveElements = Array.from(
        document.querySelectorAll('button, a, [onclick], .btn, [data-action], input, select')
      ).map(el => {
        const rect = el.getBoundingClientRect();
        const textContent = el.textContent || '';
        return {
          tagName: el.tagName,
          id: (el as HTMLElement).id || '',
          className: (el as HTMLElement).className || '',
          text: textContent.trim().substring(0, 50) || '',
          href: (el as HTMLAnchorElement).href || '',
          onclick: (el as HTMLElement).getAttribute('onclick') || '',
          dataAction: (el as HTMLElement).getAttribute('data-action') || '',
          visible: rect.width > 0 && rect.height > 0,
          position: { x: rect.x, y: rect.y, width: rect.width, height: rect.height }
        };
      }).filter(el => el.visible);
      
      // Detectar reproductores y errores con manejo seguro
      const hasVimeoPlayer = !!document.querySelector('iframe[src*="vimeo"], #vimeo-player');
      const hasReactPlayer = !!document.querySelector('[data-react-player], .react-player');
      const hasVideoTag = !!document.querySelector('video');
      
      const bodyText = document.body ? document.body.textContent || '' : '';
      const hasPlayerError = bodyText.includes('Player error') || 
                           bodyText.includes('player is having trouble') ||
                           !!document.querySelector('.error, .vp-overlay-error');
      
      // Estado de elementos de Red Pill
      const hasRedPillOptions = !!document.getElementById('options') || 
                               !!document.querySelector('.red-pill, .blue-pill');
      const hasQuestions = !!document.getElementById('questions') || 
                          !!document.querySelector('.question, .quiz');
      const hasContinueButton = !!document.querySelector('[data-action*="continue"], button:contains("Continuar")');
      
      // Detectar elementos específicos de Pilgrim
      const hasPilgrimElements = !!document.querySelector('.pilgrim, [class*="pilgrim"]');
      const hasProgressIndicator = !!document.querySelector('.progress, .step, [class*="progress"]');
      
      return {
        url: window.location.href,
        title: document.title || '',
        vimeoIds: [...new Set(vimeoIds)],
        hasVimeoPlayer,
        hasReactPlayer,
        hasVideoTag,
        hasPlayerError,
        hasRedPillOptions,
        hasQuestions,
        hasContinueButton,
        hasPilgrimElements,
        hasProgressIndicator,
        interactiveElements: interactiveElements.slice(0, 20),
        totalInteractiveElements: interactiveElements.length,
        bodyText: bodyText.substring(0, 500) + '...'
      };
    });
    
    // Guardar HTML
    const htmlFileName = `state_${captureCounter}_${context}_${sessionTime}s.html`;
    const htmlPath = path.join(DIRECTORIES.html, htmlFileName);
    await fs.writeFile(htmlPath, htmlContent);
    
    // Guardar análisis
    const analysisFileName = `analysis_${captureCounter}_${context}_${sessionTime}s.json`;
    const analysisPath = path.join(DIRECTORIES.journeys, analysisFileName);
    const fullAnalysis = {
      captureNumber: captureCounter,
      sessionTimeSeconds: sessionTime,
      context,
      timestamp: new Date().toISOString(),
      ...analysis
    };
    
    await fs.writeFile(analysisPath, JSON.stringify(fullAnalysis, null, 2));
    
    // Reportar hallazgos
    console.log(`   📊 URL: ${currentUrl}`);
    console.log(`   🎬 Videos encontrados: ${analysis.vimeoIds.join(', ') || 'Ninguno'}`);
    console.log(`   🎮 Elementos interactivos: ${analysis.totalInteractiveElements}`);
    console.log(`   📹 Reproductores: ${[
      analysis.hasVimeoPlayer && 'Vimeo',
      analysis.hasReactPlayer && 'React',
      analysis.hasVideoTag && 'HTML5'
    ].filter(Boolean).join(', ') || 'Ninguno'}`);
    
    if (analysis.hasPlayerError) {
      console.log(`   ⚠️  ERROR DE REPRODUCTOR DETECTADO`);
    }
    
    if (analysis.hasPilgrimElements) {
      console.log(`   🧭 ELEMENTOS PILGRIM DETECTADOS`);
    }
    
    if (analysis.hasProgressIndicator) {
      console.log(`   📊 INDICADOR DE PROGRESO DETECTADO`);
    }
    
    if (analysis.vimeoIds.length > 0) {
      analysis.vimeoIds.forEach(id => videosFound.add(id));
    }
    
    return fullAnalysis;
    
  } catch (error) {
    console.error(`❌ Error capturando estado ${context}:`, error);
    return null;
  }
}

/**
 * Monitorear cambios en la página
 */
async function setupPageMonitoring(page: Page): Promise<void> {
  console.log('🎯 Configurando monitoreo automático...');
  
  // Capturar cambios de URL
  page.on('framenavigated', async (frame) => {
    if (frame === page.mainFrame()) {
      await capturePageState(page, 'navigation_detected');
    }
  });
  
  // Capturar errores de JavaScript
  page.on('pageerror', (error) => {
    console.log(`⚠️ Error de JavaScript detectado: ${error.message}`);
  });
  
  // Capturar mensajes de consola interesantes
  page.on('console', (msg) => {
    const text = msg.text();
    if (text.includes('video') || text.includes('vimeo') || text.includes('error')) {
      console.log(`🟡 Console: ${text}`);
    }
  });
}

/**
 * Función principal colaborativa mejorada
 */
async function collaborativeExploration(): Promise<void> {
  let browser: Browser | null = null;
  
  try {
    console.log('🚀 === RED PILL COLLABORATIVE EXPLORER (CORREGIDO) ===');
    console.log('🎬 Modo: Usuario navega manualmente + Playwright captura automáticamente');
    console.log('🔧 Correcciones: Manejo seguro de elementos null');
    console.log('🧭 Nuevo: Soporte para URLs de Pilgrim');
    console.log('');
    console.log('📋 URLs disponibles:');
    URLS_TO_EXPLORE.forEach((url, index) => {
      console.log(`   ${index + 1}. ${url}`);
    });
    console.log('');
    
    // Permitir seleccionar URL
    console.log('🎯 Seleccionando URL Pilgrim (más avanzada)...');
    INITIAL_URL = URLS_TO_EXPLORE[1]; // Pilgrim URL
    console.log(`✅ URL seleccionada: ${INITIAL_URL}`);
    console.log('');
    
    await setupCollaborativeSession();
    
    // Configurar navegador para colaboración
    browser = await chromium.launch({ 
      headless: false,  // IMPORTANTE: Visible para colaboración
      slowMo: 100,      // Pequeña pausa para mejor experiencia
      devtools: true    // Abrir DevTools para inspección
    });
    
    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      viewport: { width: 1920, height: 1080 },
      recordVideo: { 
        dir: DIRECTORIES.videos,
        size: { width: 1920, height: 1080 }
      }
    });
    
    const page = await context.newPage();
    
    // Configurar interceptores
    page.on('response', smartResponseHandler);
    await setupPageMonitoring(page);
    
    console.log('🌐 Navegando a URL Pilgrim...');
    await page.goto(INITIAL_URL, { waitUntil: 'networkidle', timeout: 30000 });
    
    // Captura inicial
    await capturePageState(page, 'initial_load_pilgrim');
    
    console.log('\n🎮 === NAVEGACIÓN MANUAL HABILITADA (PILGRIM) ===');
    console.log('✅ El navegador está listo para tu navegación manual');
    console.log('📸 El script capturará automáticamente cada cambio significativo');
    console.log('🎥 Todos los videos y URLs serán interceptados automáticamente');
    console.log('🧭 Detectará elementos específicos de Pilgrim');
    console.log('⌨️  Presiona Ctrl+C en esta terminal cuando termines\n');
    
    // Configurar capturas automáticas cada 30 segundos
    const autoCapture = setInterval(async () => {
      await capturePageState(page, 'auto_capture');
    }, 30000);
    
    // Configurar capturas por detección de cambios
    let lastUrl = page.url();
    const changeDetection = setInterval(async () => {
      const currentUrl = page.url();
      if (currentUrl !== lastUrl) {
        lastUrl = currentUrl;
        await capturePageState(page, 'url_change_detected');
      }
    }, 5000);
    
    // Mantener el script vivo para navegación manual
    await new Promise((resolve) => {
      process.on('SIGINT', () => {
        console.log('\n🛑 Finalizando sesión colaborativa...');
        clearInterval(autoCapture);
        clearInterval(changeDetection);
        resolve(undefined);
      });
      
      // Mantener vivo indefinidamente hasta Ctrl+C
      const keepAlive = () => {
        setTimeout(keepAlive, 10000);
      };
      keepAlive();
    });
    
  } catch (error) {
    console.error('❌ Error en exploración colaborativa:', error);
  } finally {
    if (browser) {
      // Captura final antes de cerrar
      try {
        const pages = await browser.contexts().then(contexts => 
          Promise.all(contexts.map(ctx => ctx.pages())).then(pagesArrays => 
            pagesArrays.flat()
          )
        );
        
        if (pages.length > 0) {
          await capturePageState(pages[0], 'final_capture');
        }
      } catch (error) {
        console.log('⚠️ Error en captura final:', error);
      }
      
      await browser.close();
      console.log('🔒 Navegador cerrado');
    }
    
    // Generar resumen final
    await generateFinalSummary();
  }
}

/**
 * Generar resumen final de la sesión
 */
async function generateFinalSummary(): Promise<void> {
  console.log('\n📊 Generando resumen de sesión colaborativa...');
  
  const sessionEndTime = Date.now();
  const totalDuration = Math.round((sessionEndTime - sessionStartTime) / 1000);
  
  const summary = {
    sessionDuration: `${totalDuration} segundos`,
    capturesTotal: captureCounter,
    videosFound: Array.from(videosFound),
    realVideoUrls: Array.from(realVideoUrls),
    urlsCaptured: capturedUrls.size,
    sessionEnd: new Date().toISOString(),
    directories: DIRECTORIES
  };
  
  const summaryPath = path.join(DIRECTORIES.journeys, 'collaborative_session_summary.json');
  await fs.writeFile(summaryPath, JSON.stringify(summary, null, 2));
  
  console.log(`\n🎉 === RESUMEN DE SESIÓN COLABORATIVA ===`);
  console.log(`⏱️  Duración total: ${totalDuration} segundos`);
  console.log(`📸 Capturas realizadas: ${captureCounter}`);
  console.log(`🎬 Videos únicos encontrados: ${summary.videosFound.length}`);
  console.log(`   - IDs: ${summary.videosFound.join(', ') || 'Ninguno'}`);
  console.log(`🎥 URLs reales de video: ${summary.realVideoUrls.size}`);
  console.log(`🌐 URLs totales capturadas: ${capturedUrls.size}`);
  console.log(`📁 Archivos guardados en: ${BASE_DIR}`);
  console.log(`📋 Resumen completo: ${summaryPath}`);
  
  console.log('\n✅ Sesión colaborativa completada exitosamente!');
}

// Ejecutar exploración colaborativa
if (require.main === module) {
  collaborativeExploration().catch(console.error);
}

export { collaborativeExploration }; 