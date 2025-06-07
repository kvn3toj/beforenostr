import { chromium, Browser, Page, Response } from 'playwright';
import fs from 'fs/promises';
import path from 'path';
import { createWriteStream } from 'fs';
import { pipeline } from 'stream/promises';

// Configuración de directorios
const BASE_DIR = 'recovered_code/red_pill_demo';
const DIRECTORIES = {
  html: BASE_DIR,
  css: `${BASE_DIR}/assets/css`,
  js: `${BASE_DIR}/assets/js`,
  images: `${BASE_DIR}/assets/images`,
  fonts: `${BASE_DIR}/assets/fonts`,
  data: `${BASE_DIR}/assets/data`,
  other: `${BASE_DIR}/assets/other`,
  inlineCss: `${BASE_DIR}/inline_css`,
  inlineJs: `${BASE_DIR}/inline_js`
};

// URL objetivo
const TARGET_URL = 'https://demo.coomunity.co/red-pill/c8862dd1';

// Sets para evitar descargas duplicadas
const downloadedUrls = new Set<string>();
let responseCounter = 0;
let htmlCounter = 0;
let inlineCssCounter = 0;
let inlineJsCounter = 0;

/**
 * Crear todas las carpetas necesarias
 */
async function createDirectories(): Promise<void> {
  console.log('📁 Creando estructura de directorios...');
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

  // Verificar tipo de contenido primero
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
    
    if (contentType.includes('css')) {
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
 * Extraer contenido CSS en línea del HTML
 */
async function extractInlineCSS(htmlContent: string): Promise<void> {
  const styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi;
  let match;
  
  while ((match = styleRegex.exec(htmlContent)) !== null) {
    inlineCssCounter++;
    const cssContent = match[1];
    
    if (cssContent.trim()) {
      const fileName = `inline_style_block_${inlineCssCounter}.css`;
      const filePath = path.join(DIRECTORIES.inlineCss, fileName);
      
      await fs.writeFile(filePath, cssContent);
      console.log(`💄 CSS en línea extraído: ${fileName}`);
    }
  }
}

/**
 * Extraer contenido JavaScript en línea del HTML
 */
async function extractInlineJS(htmlContent: string): Promise<void> {
  // Script tags sin atributo src
  const scriptRegex = /<script(?![^>]*\ssrc\s*=)[^>]*>([\s\S]*?)<\/script>/gi;
  let match;
  
  while ((match = scriptRegex.exec(htmlContent)) !== null) {
    inlineJsCounter++;
    const jsContent = match[1];
    
    if (jsContent.trim()) {
      const fileName = `inline_script_block_${inlineJsCounter}.js`;
      const filePath = path.join(DIRECTORIES.inlineJs, fileName);
      
      await fs.writeFile(filePath, jsContent);
      console.log(`📜 JavaScript en línea extraído: ${fileName}`);
    }
  }
}

/**
 * Guardar HTML y extraer contenido en línea
 */
async function saveHTMLAndExtractInline(page: Page, suffix: string = ''): Promise<void> {
  try {
    htmlCounter++;
    const htmlContent = await page.content();
    const fileName = suffix 
      ? `red_pill_${suffix}.html` 
      : `red_pill_${htmlCounter === 1 ? 'index' : `state_${htmlCounter}`}.html`;
    
    const filePath = path.join(DIRECTORIES.html, fileName);
    
    await fs.writeFile(filePath, htmlContent);
    console.log(`📄 HTML guardado: ${fileName}`);
    
    // Extraer contenido en línea
    await extractInlineCSS(htmlContent);
    await extractInlineJS(htmlContent);
    
  } catch (error) {
    console.error('❌ Error guardando HTML:', error);
  }
}

/**
 * Simular scroll para cargar contenido dinámico
 */
async function simulateScrolling(page: Page): Promise<void> {
  console.log('📜 Iniciando simulación de scroll...');
  
  let previousHeight = 0;
  let currentHeight = await page.evaluate(() => document.body.scrollHeight);
  let scrollAttempts = 0;
  const maxScrollAttempts = 10;
  
  while (previousHeight !== currentHeight && scrollAttempts < maxScrollAttempts) {
    previousHeight = currentHeight;
    scrollAttempts++;
    
    console.log(`📜 Scroll ${scrollAttempts}: ${currentHeight}px`);
    
    // Scroll hasta el final
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
    
    // Esperar a que se cargue el contenido
    await page.waitForTimeout(2000);
    
    // Esperar a que la red esté inactiva
    await page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {
      console.log('⏰ Timeout esperando networkidle, continuando...');
    });
    
    currentHeight = await page.evaluate(() => document.body.scrollHeight);
    
    // Guardar HTML después del scroll
    await saveHTMLAndExtractInline(page, `after_scroll_${scrollAttempts}`);
  }
  
  console.log(`✅ Scroll completado después de ${scrollAttempts} intentos`);
}

/**
 * Simular clics en elementos interactivos
 */
async function simulateInteractions(page: Page): Promise<void> {
  console.log('🖱️ Buscando elementos interactivos...');
  
  // Selectores comunes para elementos que podrían cargar más contenido
  const interactiveSelectors = [
    'button[class*="load"], button[class*="more"]',
    'a[class*="load"], a[class*="more"]',
    '.tab-item:not(.active), .tab:not(.active)',
    '[role="tab"]:not([aria-selected="true"])',
    'button[class*="expand"], button[class*="toggle"]',
    '.pagination a, .page-link',
    '[data-toggle], [data-target]'
  ];
  
  for (const selector of interactiveSelectors) {
    try {
      const elements = await page.$$(selector);
      
      for (let i = 0; i < elements.length && i < 3; i++) { // Limitar a 3 clics por selector
        const element = elements[i];
        const isVisible = await element.isVisible();
        
        if (isVisible) {
          console.log(`🖱️ Haciendo clic en elemento: ${selector} (${i + 1})`);
          
          await element.click();
          await page.waitForTimeout(1500);
          
          // Esperar cambios en la red
          await page.waitForLoadState('networkidle', { timeout: 3000 }).catch(() => {
            console.log('⏰ Timeout esperando networkidle después del clic');
          });
          
          // Guardar HTML después del clic
          const selectorName = selector.replace(/[^a-zA-Z0-9]/g, '_');
          await saveHTMLAndExtractInline(page, `after_click_${selectorName}_${i + 1}`);
        }
      }
    } catch (error) {
      console.log(`⚠️ No se encontraron elementos para: ${selector}`);
    }
  }
}

/**
 * Función principal
 */
async function main(): Promise<void> {
  let browser: Browser | null = null;
  
  try {
    console.log('🚀 Iniciando Red Pill Comprehensive Scraper...');
    console.log(`🎯 URL objetivo: ${TARGET_URL}`);
    
    // Crear directorios
    await createDirectories();
    
    // Lanzar navegador
    browser = await chromium.launch({ 
      headless: false, // Cambiar a true para modo headless
      slowMo: 1000 // Ralentizar para ver las acciones
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
    
    // Guardar HTML inicial
    await saveHTMLAndExtractInline(page, 'initial');
    
    // Simular scrolling
    await simulateScrolling(page);
    
    // Simular interacciones
    await simulateInteractions(page);
    
    // Scroll final para asegurar que todo el contenido esté visible
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(1000);
    await saveHTMLAndExtractInline(page, 'final');
    
    console.log('🎉 Scraping completado exitosamente!');
    console.log(`📊 Estadísticas:`);
    console.log(`   - URLs descargadas: ${downloadedUrls.size}`);
    console.log(`   - Archivos HTML: ${htmlCounter}`);
    console.log(`   - Bloques CSS en línea: ${inlineCssCounter}`);
    console.log(`   - Bloques JS en línea: ${inlineJsCounter}`);
    
  } catch (error) {
    console.error('❌ Error durante el scraping:', error);
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