#!/usr/bin/env npx tsx

import { chromium, Browser, Page, Response } from 'playwright';
import { promises as fs } from 'fs';
import path from 'path';
import crypto from 'crypto';

/**
 * Script exhaustivo de Playwright para extraer código de la demo de CoomÜnity Pilgrim
 * Intercepta TODAS las respuestas de red y simula interacciones del usuario
 */

const TARGET_URL = 'https://demo.coomunity.co/pilgrim/640baa58';
const OUTPUT_DIR = 'recovered_code/pilgrim_demo';

// Directorios específicos para cada tipo de recurso
const ASSET_DIRS = {
  css: path.join(OUTPUT_DIR, 'assets', 'css'),
  js: path.join(OUTPUT_DIR, 'assets', 'js'),
  images: path.join(OUTPUT_DIR, 'assets', 'images'),
  fonts: path.join(OUTPUT_DIR, 'assets', 'fonts'),
  other: path.join(OUTPUT_DIR, 'assets', 'other')
};

// Contadores para generar nombres únicos
const counters = {
  css: 0,
  js: 0,
  images: 0,
  fonts: 0,
  other: 0,
  api: 0
};

// Set para rastrear recursos ya descargados (evitar duplicados)
const downloadedResources = new Set<string>();

// Contador para nombres de archivos HTML
let htmlCounter = 0;

interface CapturedResource {
  url: string;
  type: string;
  contentType: string;
  status: number;
  size: number;
  filename: string;
  hash: string;
  savedPath: string;
  timestamp: string;
}

interface InteractionLog {
  action: string;
  description: string;
  timestamp: string;
  htmlSnapshot: string;
  newResourcesFound: number;
}

/**
 * Crea todos los directorios necesarios para organizar los recursos
 */
async function createAssetDirectories(): Promise<void> {
  console.log('📁 Creando estructura de directorios para assets...');
  
  try {
    // Crear directorio base
    await fs.mkdir(OUTPUT_DIR, { recursive: true });
    
    // Crear todos los subdirectorios de assets
    for (const [type, dir] of Object.entries(ASSET_DIRS)) {
      await fs.mkdir(dir, { recursive: true });
      console.log(`  ✅ ${type}: ${dir}`);
    }
    
    console.log('✅ Estructura de directorios creada exitosamente');
  } catch (error) {
    console.error('❌ Error creando directorios:', error);
    throw error;
  }
}

/**
 * Determina el tipo de recurso basado en la URL y Content-Type
 */
function getResourceType(url: string, contentType: string): string {
  const urlLower = url.toLowerCase();
  const contentTypeLower = contentType.toLowerCase();
  
  // CSS
  if (contentTypeLower.includes('text/css') || urlLower.endsWith('.css')) {
    return 'css';
  }
  
  // JavaScript
  if (contentTypeLower.includes('javascript') || 
      contentTypeLower.includes('text/javascript') ||
      contentTypeLower.includes('application/javascript') ||
      urlLower.endsWith('.js') || 
      urlLower.endsWith('.mjs') ||
      urlLower.endsWith('.jsx') ||
      urlLower.endsWith('.ts') ||
      urlLower.endsWith('.tsx')) {
    return 'js';
  }
  
  // Imágenes
  if (contentTypeLower.includes('image/') ||
      urlLower.match(/\.(jpg|jpeg|png|gif|svg|webp|ico|bmp|tiff?)$/)) {
    return 'images';
  }
  
  // Fuentes
  if (contentTypeLower.includes('font/') ||
      contentTypeLower.includes('application/font') ||
      urlLower.match(/\.(woff2?|ttf|otf|eot)$/)) {
    return 'fonts';
  }
  
  // APIs y JSON
  if (contentTypeLower.includes('application/json') ||
      urlLower.includes('/api/') ||
      urlLower.endsWith('.json')) {
    return 'other';
  }
  
  // Otros recursos importantes
  if (contentTypeLower.includes('text/') ||
      contentTypeLower.includes('application/') ||
      urlLower.match(/\.(xml|txt|md|yaml|yml)$/)) {
    return 'other';
  }
  
  return 'other';
}

/**
 * Genera un nombre de archivo único y descriptivo
 */
function generateUniqueFilename(url: string, contentType: string, content: Buffer): string {
  const resourceType = getResourceType(url, contentType);
  
  try {
    const urlObj = new URL(url);
    let baseName = path.basename(urlObj.pathname);
    
    // Si no hay nombre de archivo en la URL, generar uno basado en el path
    if (!baseName || baseName === '/') {
      const pathParts = urlObj.pathname.split('/').filter(part => part.length > 0);
      baseName = pathParts.length > 0 ? pathParts[pathParts.length - 1] : 'resource';
    }
    
    // Remover extension si existe para añadir la correcta después
    const nameWithoutExt = baseName.replace(/\.[^/.]+$/, '');
    
    // Generar hash del contenido para unicidad
    const hash = crypto.createHash('md5').update(content).digest('hex').substring(0, 8);
    
    // Incrementar contador para este tipo de recurso
    counters[resourceType as keyof typeof counters]++;
    const counter = counters[resourceType as keyof typeof counters];
    
    // Determinar extensión apropiada
    let extension = '';
    switch (resourceType) {
      case 'css':
        extension = '.css';
        break;
      case 'js':
        extension = '.js';
        break;
      case 'images':
        // Mantener extensión original o inferir del content-type
        const originalExt = path.extname(baseName);
        if (originalExt) {
          extension = originalExt;
        } else if (contentType.includes('png')) {
          extension = '.png';
        } else if (contentType.includes('jpeg') || contentType.includes('jpg')) {
          extension = '.jpg';
        } else if (contentType.includes('svg')) {
          extension = '.svg';
        } else if (contentType.includes('gif')) {
          extension = '.gif';
        } else if (contentType.includes('webp')) {
          extension = '.webp';
        } else {
          extension = '.img';
        }
        break;
      case 'fonts':
        const fontExt = path.extname(baseName);
        extension = fontExt || '.font';
        break;
      case 'other':
        if (contentType.includes('json')) {
          extension = '.json';
        } else if (contentType.includes('xml')) {
          extension = '.xml';
        } else {
          extension = path.extname(baseName) || '.data';
        }
        break;
    }
    
    // Formato final: [contador]_[nombre]_[hash].[ext]
    const finalName = `${counter.toString().padStart(3, '0')}_${nameWithoutExt}_${hash}${extension}`;
    
    // Limpiar caracteres problemáticos para nombres de archivo
    return finalName.replace(/[<>:"/\\|?*]/g, '_');
    
  } catch (error) {
    // Fallback si hay problemas con la URL
    const hash = crypto.createHash('md5').update(content).digest('hex').substring(0, 8);
    counters.other++;
    return `${counters.other.toString().padStart(3, '0')}_resource_${hash}.data`;
  }
}

/**
 * Determina si un recurso debe ser descargado basado en su URL y tipo
 */
function shouldDownloadResource(url: string, contentType: string): boolean {
  // Filtrar URLs de datos (data:) y otros protocolos no HTTP
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return false;
  }
  
  // Verificar si ya se descargó este recurso
  if (downloadedResources.has(url)) {
    return false;
  }
  
  // Filtrar algunos tipos de contenido que no necesitamos
  const contentTypeLower = contentType.toLowerCase();
  
  // Excluir streams de video/audio largos
  if (contentTypeLower.includes('video/') || contentTypeLower.includes('audio/')) {
    return false;
  }
  
  // Excluir algunos tipos de respuesta del navegador que no son útiles
  if (contentTypeLower.includes('text/event-stream')) {
    return false;
  }
  
  return true;
}

/**
 * Descarga y guarda un recurso interceptado
 */
async function downloadInterceptedResource(
  response: Response, 
  capturedResources: CapturedResource[]
): Promise<void> {
  const url = response.url();
  const status = response.status();
  const contentType = response.headers()['content-type'] || '';
  
  // Solo descargar respuestas exitosas
  if (status < 200 || status >= 300) {
    console.log(`⚠️  Saltando recurso con status ${status}: ${url}`);
    return;
  }
  
  // Verificar si debemos descargar este recurso
  if (!shouldDownloadResource(url, contentType)) {
    return;
  }
  
  try {
    // Obtener el contenido de la respuesta
    const buffer = await response.body();
    if (!buffer || buffer.length === 0) {
      console.log(`⚠️  Contenido vacío para: ${url}`);
      return;
    }
    
    // Marcar como descargado
    downloadedResources.add(url);
    
    // Determinar tipo de recurso y generar nombre de archivo
    const resourceType = getResourceType(url, contentType);
    const filename = generateUniqueFilename(url, contentType, buffer);
    const outputDir = ASSET_DIRS[resourceType as keyof typeof ASSET_DIRS];
    const outputPath = path.join(outputDir, filename);
    
    // Guardar el archivo
    await fs.writeFile(outputPath, buffer);
    
    // Generar hash del contenido para verificación
    const hash = crypto.createHash('sha256').update(buffer).digest('hex').substring(0, 16);
    
    // Registrar el recurso capturado
    const capturedResource: CapturedResource = {
      url,
      type: resourceType,
      contentType,
      status,
      size: buffer.length,
      filename,
      hash,
      savedPath: outputPath,
      timestamp: new Date().toISOString()
    };
    
    capturedResources.push(capturedResource);
    
    console.log(`✅ ${resourceType.toUpperCase()}: ${filename} (${(buffer.length / 1024).toFixed(1)}KB)`);
    
  } catch (error) {
    console.error(`❌ Error descargando ${url}:`, error);
  }
}

/**
 * Configura interceptación de todas las respuestas de red
 */
function setupNetworkInterception(page: Page, capturedResources: CapturedResource[]): void {
  console.log('🔍 Configurando interceptación de red...');
  
  // Interceptar todas las respuestas
  page.on('response', async (response) => {
    const url = response.url();
    const status = response.status();
    const contentType = response.headers()['content-type'] || '';
    
    console.log(`🌐 ${status} ${contentType.split(';')[0]} ${url}`);
    
    // Descargar el recurso de forma asíncrona
    downloadInterceptedResource(response, capturedResources).catch(error => {
      console.error(`❌ Error procesando respuesta de ${url}:`, error);
    });
  });
  
  // También interceptar solicitudes para logging adicional
  page.on('request', (request) => {
    const url = request.url();
    const resourceType = request.resourceType();
    console.log(`📤 ${resourceType}: ${url}`);
  });
  
  console.log('✅ Interceptación de red configurada');
}

/**
 * Guarda el HTML actual con un nombre descriptivo
 */
async function saveHTMLSnapshot(page: Page, description: string): Promise<string> {
  htmlCounter++;
  const filename = `${htmlCounter.toString().padStart(2, '0')}_demo_pilgrim_${description}.html`;
  const htmlPath = path.join(OUTPUT_DIR, filename);
  
  const html = await page.content();
  await fs.writeFile(htmlPath, html, 'utf-8');
  
  console.log(`📄 HTML guardado: ${filename} (${(html.length / 1024).toFixed(1)}KB)`);
  return filename;
}

/**
 * Realiza scroll inteligente para activar lazy loading
 */
async function performIntelligentScrolling(page: Page, interactionLogs: InteractionLog[], capturedResources: CapturedResource[]): Promise<void> {
  console.log('📜 Iniciando scroll inteligente para activar lazy loading...');
  
  const initialResourceCount = capturedResources.length;
  
  await page.evaluate(() => {
    return new Promise<void>((resolve) => {
      let totalHeight = 0;
      let distance = 150; // Scroll más lento para dar tiempo a cargar contenido
      let scrollDelay = 200; // Pausa entre scrolls
      
      const timer = setInterval(async () => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;
        
        // Pausa más larga en ciertos puntos para dar tiempo a cargar contenido
        if (totalHeight % 1000 === 0) {
          await new Promise(r => setTimeout(r, 1000));
        }
        
        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          // Volver al top gradualmente
          window.scrollTo({ top: 0, behavior: 'smooth' });
          setTimeout(resolve, 2000);
        }
      }, scrollDelay);
    });
  });
  
  // Esperar tiempo adicional para que se procesen las descargas
  await page.waitForTimeout(3000);
  
  const newResourceCount = capturedResources.length;
  const resourcesFound = newResourceCount - initialResourceCount;
  
  // Guardar snapshot después del scroll
  const htmlFile = await saveHTMLSnapshot(page, 'after_intelligent_scroll');
  
  interactionLogs.push({
    action: 'intelligent_scroll',
    description: 'Scroll inteligente completo con pausas para lazy loading',
    timestamp: new Date().toISOString(),
    htmlSnapshot: htmlFile,
    newResourcesFound: resourcesFound
  });
  
  console.log(`🎯 Scroll completado: ${resourcesFound} nuevos recursos encontrados`);
}

/**
 * Busca y hace clic en elementos interactivos comunes
 */
async function findAndClickInteractiveElements(page: Page, interactionLogs: InteractionLog[], capturedResources: CapturedResource[]): Promise<void> {
  console.log('🎯 Buscando elementos interactivos...');
  
  // Selectores comunes para elementos interactivos
  const interactiveSelectors = [
    // Pestañas y tabs
    { selector: '.nav-tabs a', description: 'pestañas de navegación' },
    { selector: '.tab-link', description: 'enlaces de pestaña' },
    { selector: '[role="tab"]', description: 'elementos con rol tab' },
    
    // Botones de "Ver más" o expandir
    { selector: 'button:has-text("Ver más")', description: 'botones Ver más' },
    { selector: 'button:has-text("Mostrar más")', description: 'botones Mostrar más' },
    { selector: 'a:has-text("Ver más")', description: 'enlaces Ver más' },
    { selector: '.btn-load-more', description: 'botones cargar más' },
    { selector: '.load-more', description: 'elementos cargar más' },
    
    // Accordions y collapsibles
    { selector: '.accordion-toggle', description: 'toggles de accordion' },
    { selector: '.collapse-toggle', description: 'toggles de colapso' },
    { selector: '[data-toggle="collapse"]', description: 'elementos colapsables' },
    
    // Modales y overlays
    { selector: '[data-toggle="modal"]', description: 'triggers de modal' },
    { selector: '.modal-trigger', description: 'activadores de modal' },
    
    // Menús dropdown
    { selector: '.dropdown-toggle', description: 'toggles de dropdown' },
    { selector: '[data-toggle="dropdown"]', description: 'elementos dropdown' },
    
    // Enlaces internos específicos de CoomÜnity
    { selector: 'a[href*="#"]', description: 'enlaces con anchors internos' },
    { selector: '.btn', description: 'botones generales' },
    { selector: '[onclick]', description: 'elementos con onclick' }
  ];
  
  for (const { selector, description } of interactiveSelectors) {
    try {
      console.log(`🔍 Buscando: ${description}`);
      
      const elements = await page.locator(selector).all();
      
      if (elements.length > 0) {
        console.log(`📋 Encontrados ${elements.length} elementos: ${description}`);
        
        // Hacer clic en los primeros 3 elementos de cada tipo (para evitar demasiadas interacciones)
        const elementsToClick = elements.slice(0, 3);
        
        for (let i = 0; i < elementsToClick.length; i++) {
          const element = elementsToClick[i];
          const initialResourceCount = capturedResources.length;
          
          try {
            // Verificar si el elemento es visible y clickeable
            const isVisible = await element.isVisible();
            if (!isVisible) continue;
            
            // Scroll hasta el elemento si es necesario
            await element.scrollIntoViewIfNeeded();
            await page.waitForTimeout(500);
            
            console.log(`👆 Haciendo clic en ${description} ${i + 1}/${elementsToClick.length}`);
            
            await element.click();
            
            // Esperar a que se procese la interacción
            await page.waitForTimeout(2000);
            
            const newResourceCount = capturedResources.length;
            const resourcesFound = newResourceCount - initialResourceCount;
            
            if (resourcesFound > 0 || i === 0) { // Guardar al menos el primer clic de cada tipo
              const htmlFile = await saveHTMLSnapshot(page, `after_click_${description.replace(/\s+/g, '_')}_${i + 1}`);
              
              interactionLogs.push({
                action: 'click',
                description: `Clic en ${description} ${i + 1}`,
                timestamp: new Date().toISOString(),
                htmlSnapshot: htmlFile,
                newResourcesFound: resourcesFound
              });
              
              console.log(`✅ Interacción completada: ${resourcesFound} nuevos recursos`);
            }
            
          } catch (clickError) {
            console.log(`⚠️  No se pudo hacer clic en ${description} ${i + 1}: ${clickError}`);
          }
        }
      }
      
    } catch (selectorError) {
      // Es normal que algunos selectores no existan, continuar silenciosamente
    }
  }
}

/**
 * Busca enlaces internos específicos de la demo y navega a ellos
 */
async function exploreInternalLinks(page: Page, interactionLogs: InteractionLog[], capturedResources: CapturedResource[]): Promise<void> {
  console.log('🔗 Explorando enlaces internos de la demo...');
  
  // Selectores específicos para enlaces internos que no cambien de página completamente
  const internalLinkSelectors = [
    'a[href^="#"]', // Enlaces con anchors
    'a[href*="pilgrim"][href*="#"]', // Enlaces internos de pilgrim con anchors
    '.nav a[href^="#"]', // Enlaces de navegación interna
    '.menu a[href^="#"]' // Enlaces de menú interno
  ];
  
  for (const selector of internalLinkSelectors) {
    try {
      const links = await page.locator(selector).all();
      
      if (links.length > 0) {
        console.log(`📋 Encontrados ${links.length} enlaces internos con selector: ${selector}`);
        
        // Navegar a los primeros 5 enlaces internos
        const linksToVisit = links.slice(0, 5);
        
        for (let i = 0; i < linksToVisit.length; i++) {
          const link = linksToVisit[i];
          const initialResourceCount = capturedResources.length;
          
          try {
            const href = await link.getAttribute('href');
            if (!href) continue;
            
            console.log(`🧭 Navegando a enlace interno: ${href}`);
            
            // Hacer clic en el enlace interno
            await link.click();
            await page.waitForTimeout(2000);
            
            const newResourceCount = capturedResources.length;
            const resourcesFound = newResourceCount - initialResourceCount;
            
            const htmlFile = await saveHTMLSnapshot(page, `internal_link_${href.replace('#', 'anchor_')}`);
            
            interactionLogs.push({
              action: 'internal_navigation',
              description: `Navegación a enlace interno: ${href}`,
              timestamp: new Date().toISOString(),
              htmlSnapshot: htmlFile,
              newResourcesFound: resourcesFound
            });
            
            console.log(`✅ Enlace interno visitado: ${resourcesFound} nuevos recursos`);
            
          } catch (linkError) {
            console.log(`⚠️  Error navegando enlace interno ${i + 1}: ${linkError}`);
          }
        }
      }
      
    } catch (selectorError) {
      // Continuar con el siguiente selector
    }
  }
}

/**
 * Función principal del script exhaustivo con interacciones
 */
async function main(): Promise<void> {
  console.log('🚀 Iniciando extracción SÚPER EXHAUSTIVA de CoomÜnity Pilgrim Demo');
  console.log(`🎯 URL objetivo: ${TARGET_URL}`);
  console.log('📋 Este script interceptará TODOS los recursos y simulará interacciones de usuario');
  
  let browser: Browser | null = null;
  let page: Page | null = null;
  const capturedResources: CapturedResource[] = [];
  const interactionLogs: InteractionLog[] = [];
  
  try {
    // Crear estructura de directorios
    await createAssetDirectories();
    
    // Lanzar navegador con configuraciones optimizadas
    console.log('🌐 Lanzando navegador Chromium...');
    browser = await chromium.launch({
      headless: true, // Cambiar a false para depuración visual
      args: [
        '--no-sandbox', 
        '--disable-setuid-sandbox',
        '--disable-web-security', // Permitir recursos cross-origin
        '--disable-features=VizDisplayCompositor'
      ]
    });
    
    // Crear nueva página con contexto que incluye user agent
    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      viewport: { width: 1920, height: 1080 }
    });
    
    page = await context.newPage();
    
    // CONFIGURAR INTERCEPTACIÓN DE RED ANTES DE NAVEGAR
    setupNetworkInterception(page, capturedResources);
    
    // Navegar a la URL objetivo
    console.log('📡 Navegando a la URL objetivo...');
    console.log('⏳ La interceptación de red está activa - capturando todos los recursos...');
    
    await page.goto(TARGET_URL, {
      waitUntil: 'networkidle', // Esperar hasta que no haya actividad de red
      timeout: 90000 // Timeout extendido para cargas complejas
    });
    
    console.log('⏳ Esperando carga inicial completa...');
    await page.waitForTimeout(5000);
    
    // Guardar HTML inicial
    const initialHtmlFile = await saveHTMLSnapshot(page, 'initial_load');
    interactionLogs.push({
      action: 'initial_load',
      description: 'Carga inicial de la página',
      timestamp: new Date().toISOString(),
      htmlSnapshot: initialHtmlFile,
      newResourcesFound: capturedResources.length
    });
    
    console.log('\n🎮 === FASE DE INTERACCIONES DEL USUARIO ===');
    
    // FASE 1: Scroll inteligente para activar lazy loading
    await performIntelligentScrolling(page, interactionLogs, capturedResources);
    
    // FASE 2: Buscar y hacer clic en elementos interactivos
    await findAndClickInteractiveElements(page, interactionLogs, capturedResources);
    
    // FASE 3: Explorar enlaces internos
    await exploreInternalLinks(page, interactionLogs, capturedResources);
    
    // FASE 4: Scroll final para capturar cualquier contenido nuevo
    console.log('🔄 Realizando scroll final...');
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(3000);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(2000);
    
    // Guardar HTML final después de todas las interacciones
    const finalHtmlFile = await saveHTMLSnapshot(page, 'final_after_all_interactions');
    interactionLogs.push({
      action: 'final_state',
      description: 'Estado final después de todas las interacciones',
      timestamp: new Date().toISOString(),
      htmlSnapshot: finalHtmlFile,
      newResourcesFound: 0
    });
    
    // Esperar un momento final para que terminen las descargas pendientes
    console.log('⏳ Finalizando descargas pendientes...');
    await page.waitForTimeout(3000);
    
    // Generar resumen exhaustivo con interacciones
    console.log('📊 Generando resumen exhaustivo con logs de interacciones...');
    
    const summary = {
      url: TARGET_URL,
      timestamp: new Date().toISOString(),
      totalResources: capturedResources.length,
      totalInteractions: interactionLogs.length,
      resourcesByType: {
        css: capturedResources.filter(r => r.type === 'css').length,
        js: capturedResources.filter(r => r.type === 'js').length,
        images: capturedResources.filter(r => r.type === 'images').length,
        fonts: capturedResources.filter(r => r.type === 'fonts').length,
        other: capturedResources.filter(r => r.type === 'other').length
      },
      totalSizeBytes: capturedResources.reduce((sum, r) => sum + r.size, 0),
      totalSizeMB: (capturedResources.reduce((sum, r) => sum + r.size, 0) / (1024 * 1024)).toFixed(2),
      interactionLog: interactionLogs,
      capturedResources: capturedResources.map(r => ({
        filename: r.filename,
        type: r.type,
        url: r.url,
        contentType: r.contentType,
        size: r.size,
        hash: r.hash,
        savedPath: r.savedPath.replace(process.cwd() + '/', ''),
        timestamp: r.timestamp
      }))
    };
    
    const summaryPath = path.join(OUTPUT_DIR, 'super_exhaustive_summary.json');
    await fs.writeFile(summaryPath, JSON.stringify(summary, null, 2), 'utf-8');
    console.log(`📋 Resumen súper exhaustivo guardado: ${summaryPath}`);
    
    // Estadísticas finales
    console.log('\n🎉 ¡Extracción SÚPER EXHAUSTIVA completada exitosamente!');
    console.log(`📂 Archivos guardados en: ${OUTPUT_DIR}`);
    console.log('\n📊 ESTADÍSTICAS FINALES:');
    console.log(`   📄 HTML snapshots: ${interactionLogs.length} archivos`);
    console.log(`   🎮 Interacciones simuladas: ${interactionLogs.length - 2} (excluyendo inicial y final)`);
    console.log(`   🎨 CSS: ${summary.resourcesByType.css} archivos`);
    console.log(`   📜 JavaScript: ${summary.resourcesByType.js} archivos`);
    console.log(`   🖼️  Imágenes: ${summary.resourcesByType.images} archivos`);
    console.log(`   🔤 Fuentes: ${summary.resourcesByType.fonts} archivos`);
    console.log(`   📦 Otros: ${summary.resourcesByType.other} archivos`);
    console.log(`   💾 Tamaño total: ${summary.totalSizeMB} MB`);
    console.log(`   🔢 Total recursos únicos: ${summary.totalResources}`);
    
    console.log('\n🎮 RESUMEN DE INTERACCIONES:');
    interactionLogs.forEach((log, index) => {
      console.log(`   ${index + 1}. ${log.action}: ${log.description} (${log.newResourcesFound} nuevos recursos)`);
    });
    
  } catch (error) {
    console.error('❌ Error durante la extracción súper exhaustiva:', error);
    throw error;
  } finally {
    // Limpiar recursos del navegador
    if (page) {
      await page.close();
    }
    if (browser) {
      await browser.close();
    }
    console.log('🧹 Recursos del navegador limpiados');
  }
}

// Ejecutar el script solo si se ejecuta directamente
if (require.main === module) {
  main()
    .then(() => {
      console.log('✅ Script súper exhaustivo ejecutado exitosamente');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Error fatal en script súper exhaustivo:', error);
      process.exit(1);
    });
}

export { main }; 