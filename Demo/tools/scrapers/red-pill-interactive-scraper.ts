import { chromium, Browser, Page, Response } from 'playwright';
import fs from 'fs/promises';
import path from 'path';

// Configuración de directorios
const BASE_DIR = 'recovered_code/red_pill_interactive';
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
  paths: `${BASE_DIR}/interaction_paths`
};

// URL objetivo
const TARGET_URL = 'https://demo.coomunity.co/red-pill/c8862dd1';

// Sets para evitar descargas duplicadas
const downloadedUrls = new Set<string>();
const capturedPaths = new Set<string>();
let responseCounter = 0;
let htmlCounter = 0;
let pathCounter = 0;

/**
 * Crear todas las carpetas necesarias
 */
async function createDirectories(): Promise<void> {
  console.log('📁 Creando estructura de directorios para captura interactiva...');
  for (const dir of Object.values(DIRECTORIES)) {
    await fs.mkdir(dir, { recursive: true });
  }
  console.log('✅ Directorios creados exitosamente');
}

/**
 * Determinar el directorio de destino basado en el tipo de archivo
 */
function getDestinationDirectory(url: string, contentType: string): string {
  const urlPath = new URL(url).pathname.toLowerCase();
  const extension = path.extname(urlPath);

  // Videos específicos
  if (contentType.includes('video/') || ['.mp4', '.webm', '.mov', '.avi'].includes(extension)) {
    return DIRECTORIES.videos;
  }

  // Verificar tipo de contenido
  if (contentType) {
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
  }

  // Fallback a extensión de archivo
  switch (extension) {
    case '.css':
      return DIRECTORIES.css;
    case '.js':
    case '.mjs':
      return DIRECTORIES.js;
    case '.jpg':
    case '.jpeg':
    case '.png':
    case '.gif':
    case '.svg':
    case '.webp':
    case '.ico':
      return DIRECTORIES.images;
    case '.woff':
    case '.woff2':
    case '.ttf':
    case '.otf':
      return DIRECTORIES.fonts;
    case '.json':
      return DIRECTORIES.data;
    default:
      return DIRECTORIES.other;
  }
}

/**
 * Generar nombre de archivo único
 */
function generateFileName(url: string, contentType: string): string {
  const urlObj = new URL(url);
  let fileName = path.basename(urlObj.pathname);
  
  // Si no hay nombre de archivo, generar uno basado en el tipo
  if (!fileName || fileName === '/') {
    responseCounter++;
    
    if (contentType.includes('video/')) {
      const ext = contentType.split('/')[1]?.split(';')[0] || 'mp4';
      fileName = `video_${responseCounter}.${ext}`;
    } else if (contentType.includes('css')) {
      fileName = `style_${responseCounter}.css`;
    } else if (contentType.includes('javascript')) {
      fileName = `script_${responseCounter}.js`;
    } else if (contentType.includes('json')) {
      fileName = `api_response_${responseCounter}.json`;
    } else if (contentType.includes('image/')) {
      const ext = contentType.split('/')[1]?.split(';')[0] || 'unknown';
      fileName = `image_${responseCounter}.${ext}`;
    } else {
      fileName = `resource_${responseCounter}`;
    }
  }

  return fileName;
}

/**
 * Descargar un recurso desde una respuesta
 */
async function downloadResource(response: Response): Promise<void> {
  try {
    const url = response.url();
    const status = response.status();
    
    // Solo procesar respuestas exitosas
    if (status !== 200) {
      return;
    }

    // Evitar duplicados
    if (downloadedUrls.has(url)) {
      return;
    }
    
    downloadedUrls.add(url);
    
    const contentType = response.headers()['content-type'] || '';
    const destinationDir = getDestinationDirectory(url, contentType);
    const fileName = generateFileName(url, contentType);
    const filePath = path.join(destinationDir, fileName);
    
    console.log(`📥 Descargando: ${url} -> ${filePath}`);
    
    const buffer = await response.body();
    await fs.writeFile(filePath, buffer);
    
    console.log(`✅ Guardado: ${fileName} (${buffer.length} bytes)`);
    
  } catch (error) {
    console.error(`❌ Error descargando ${response.url()}:`, error);
  }
}

/**
 * Guardar estado HTML con contexto específico
 */
async function saveHTMLState(page: Page, context: string): Promise<void> {
  try {
    htmlCounter++;
    const htmlContent = await page.content();
    const fileName = `red_pill_${context}_${htmlCounter}.html`;
    const filePath = path.join(DIRECTORIES.html, fileName);
    
    await fs.writeFile(filePath, htmlContent);
    console.log(`📄 HTML guardado: ${fileName}`);
    
  } catch (error) {
    console.error('❌ Error guardando HTML:', error);
  }
}

/**
 * Esperar a que termine el video principal de Vimeo
 */
async function waitForMainVideoEnd(page: Page): Promise<void> {
  console.log('🎬 Esperando a que termine el video principal de Vimeo...');
  
  try {
    // Esperar a que el reproductor de Vimeo esté listo
    await page.waitForFunction(() => {
      return window.Vimeo && window.player;
    }, { timeout: 30000 });
    
    console.log('📺 Reproductor de Vimeo detectado');
    
    // Opción 1: Esperar el evento 'ended' que se ve en el código JavaScript
    await page.waitForFunction(() => {
      const optionsElement = document.getElementById('options');
      return optionsElement && optionsElement.style.display === 'block';
    }, { timeout: 120000 }); // 2 minutos máximo para el video
    
    console.log('✅ Video principal terminado - opciones visibles');
    
  } catch (error) {
    console.log('⚠️ No se pudo detectar el final del video, continuando...');
    
    // Fallback: esperar un tiempo fijo y forzar la aparición de opciones
    await page.waitForTimeout(10000);
    
    // Intentar mostrar las opciones manualmente
    await page.evaluate(() => {
      const optionsElement = document.getElementById('options');
      if (optionsElement) {
        optionsElement.style.display = 'block';
      }
    });
  }
}

/**
 * Simular clic en opción izquierda (Red Pill path)
 */
async function exploreLeftOption(page: Page): Promise<void> {
  console.log('🔴 Explorando opción izquierda (Red Pill path)...');
  
  try {
    // Buscar y hacer clic en la opción izquierda
    const leftOption = await page.$('#left-option');
    if (leftOption && await leftOption.isVisible()) {
      console.log('🖱️ Haciendo clic en left-option...');
      await leftOption.click();
      
      // Esperar a que se carguen las nuevas interacciones
      await page.waitForTimeout(3000);
      
      // Esperar a que aparezcan las preguntas
      await page.waitForSelector('#questions', { timeout: 10000 }).catch(() => {
        console.log('⚠️ No se detectó la sección de preguntas');
      });
      
      // Guardar estado después del clic izquierdo
      await saveHTMLState(page, 'left_path');
      
      // Buscar tour que se menciona en el código
      try {
        await page.waitForFunction(() => {
          return typeof showTourBySlug === 'function';
        }, { timeout: 5000 });
        
        console.log('🎯 Tour detectado, explorando tutorial-1...');
        
      } catch (error) {
        console.log('⚠️ No se detectó el sistema de tours');
      }
      
    } else {
      console.log('❌ No se encontró el elemento left-option visible');
    }
    
  } catch (error) {
    console.error('❌ Error explorando opción izquierda:', error);
  }
}

/**
 * Simular clic en opción derecha (Blue Pill path) 
 */
async function exploreRightOption(page: Page): Promise<void> {
  console.log('🔵 Explorando opción derecha (Blue Pill path)...');
  
  try {
    // Primero volver al estado inicial si es necesario
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Esperar a que termine el video nuevamente
    await waitForMainVideoEnd(page);
    
    const rightOption = await page.$('#right-option');
    if (rightOption && await rightOption.isVisible()) {
      console.log('🖱️ Haciendo clic en right-option...');
      await rightOption.click();
      
      // Esperar la función rightOptionClick() que se ve en el HTML
      await page.waitForTimeout(3000);
      
      // Guardar estado después del clic derecho
      await saveHTMLState(page, 'right_path');
      
    } else {
      console.log('❌ No se encontró el elemento right-option visible');
    }
    
  } catch (error) {
    console.error('❌ Error explorando opción derecha:', error);
  }
}

/**
 * Explorar interacciones con las preguntas/sliders
 */
async function exploreQuestions(page: Page): Promise<void> {
  console.log('❓ Explorando sistema de preguntas...');
  
  try {
    // Buscar sliders que se mencionan en el código
    const sliders = await page.$$('.slider');
    console.log(`🎚️ Encontrados ${sliders.length} sliders`);
    
    if (sliders.length > 0) {
      // Interactuar con algunos sliders
      for (let i = 0; i < Math.min(sliders.length, 3); i++) {
        const slider = sliders[i];
        
        console.log(`🎚️ Interactuando con slider ${i + 1}...`);
        
        // Simular movimiento del slider
        await slider.click();
        await page.waitForTimeout(1000);
        
        // Guardar estado después de cada interacción
        await saveHTMLState(page, `slider_${i + 1}`);
      }
    }
    
    // Buscar botones de respuesta
    const responseButtons = await page.$$('.btn-id-1, .btn-id-2, .btn-id-3');
    console.log(`🔘 Encontrados ${responseButtons.length} botones de respuesta`);
    
    if (responseButtons.length > 0) {
      for (let i = 0; i < Math.min(responseButtons.length, 2); i++) {
        const button = responseButtons[i];
        
        if (await button.isVisible()) {
          console.log(`🔘 Haciendo clic en botón de respuesta ${i + 1}...`);
          await button.click();
          await page.waitForTimeout(2000);
          
          await saveHTMLState(page, `response_${i + 1}`);
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Error explorando preguntas:', error);
  }
}

/**
 * Intentar descargar videos específicos que se mencionan en el código
 */
async function downloadSpecificVideos(page: Page): Promise<void> {
  console.log('🎥 Intentando descargar videos específicos...');
  
  const videoUrls = [
    '/assets/videos/loop/LoopMorpheo.mp4',
    '/assets/videos/loop/LoopMorpheo.webm'
  ];
  
  for (const videoPath of videoUrls) {
    try {
      const fullUrl = new URL(videoPath, TARGET_URL).href;
      console.log(`🎥 Intentando acceder a: ${fullUrl}`);
      
      // Navegar al video directamente para forzar descarga
      const response = await page.goto(fullUrl, { timeout: 30000 });
      if (response && response.status() === 200) {
        console.log(`✅ Video encontrado: ${videoPath}`);
      }
      
    } catch (error) {
      console.log(`⚠️ No se pudo acceder al video: ${videoPath}`);
    }
  }
  
  // Volver a la página principal
  await page.goto(TARGET_URL, { waitUntil: 'networkidle' });
}

/**
 * Función principal especializada en interactividad
 */
async function main(): Promise<void> {
  let browser: Browser | null = null;
  
  try {
    console.log('🚀 Iniciando Red Pill Interactive Scraper...');
    console.log(`🎯 URL objetivo: ${TARGET_URL}`);
    console.log('🎬 Modo: Captura de interacciones de video');
    
    // Crear directorios
    await createDirectories();
    
    // Lanzar navegador
    browser = await chromium.launch({ 
      headless: false, // Mantener visible para ver las interacciones
      slowMo: 500
    });
    
    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      viewport: { width: 1920, height: 1080 }
    });
    
    const page = await context.newPage();
    
    // Configurar interceptor de respuestas
    page.on('response', async (response) => {
      await downloadResource(response);
    });
    
    console.log('🌐 Navegando a la URL objetivo...');
    
    // Navegar a la página
    await page.goto(TARGET_URL, { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });
    
    console.log('✅ Página cargada inicialmente');
    
    // Guardar estado inicial
    await saveHTMLState(page, 'initial');
    
    // === FASE 1: Esperar final del video principal ===
    await waitForMainVideoEnd(page);
    await saveHTMLState(page, 'video_ended');
    
    // === FASE 2: Explorar path izquierdo (Red Pill) ===
    await exploreLeftOption(page);
    await exploreQuestions(page);
    
    // === FASE 3: Explorar path derecho (Blue Pill) ===
    await exploreRightOption(page);
    
    // === FASE 4: Intentar descargar videos específicos ===
    await downloadSpecificVideos(page);
    
    // Guardar estado final
    await saveHTMLState(page, 'final');
    
    console.log('🎉 Scraping interactivo completado!');
    console.log(`📊 Estadísticas:`);
    console.log(`   - URLs descargadas: ${downloadedUrls.size}`);
    console.log(`   - Estados HTML capturados: ${htmlCounter}`);
    console.log(`   - Paths explorados: ${capturedPaths.size}`);
    
  } catch (error) {
    console.error('❌ Error durante el scraping interactivo:', error);
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