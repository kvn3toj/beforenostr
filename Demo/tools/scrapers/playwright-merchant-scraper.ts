#!/usr/bin/env npx tsx

import { chromium, Browser, Page, Response } from 'playwright';
import { promises as fs } from 'fs';
import path from 'path';
import crypto from 'crypto';

/**
 * Script exhaustivo de Playwright para extraer código de CoomÜnity Merchant
 * Comienza en dev.coomunity.co/merchant/a1598e94 y sigue redirecciones hasta coomunity.co/place/home
 * Intercepta TODAS las respuestas de red y simula interacciones del usuario
 */

const INITIAL_URL = 'https://dev.coomunity.co/merchant/a1598e94';
const EXPECTED_FINAL_URL = 'https://coomunity.co/place/home';
const OUTPUT_DIR = 'recovered_code/merchant_dev';

// Directorios específicos para cada tipo de recurso
const ASSET_DIRS = {
  css: path.join(OUTPUT_DIR, 'assets', 'css'),
  js: path.join(OUTPUT_DIR, 'assets', 'js'),
  images: path.join(OUTPUT_DIR, 'assets', 'images'),
  fonts: path.join(OUTPUT_DIR, 'assets', 'fonts'),
  data: path.join(OUTPUT_DIR, 'assets', 'data'),
  other: path.join(OUTPUT_DIR, 'assets', 'other')
};

// Contadores para generar nombres únicos
const counters = {
  css: 0,
  js: 0,
  images: 0,
  fonts: 0,
  data: 0,
  other: 0
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
  currentUrl: string;
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
  
  // APIs y JSON (datos)
  if (contentTypeLower.includes('application/json') ||
      urlLower.includes('/api/') ||
      urlLower.endsWith('.json')) {
    return 'data';
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
      case 'data':
        extension = '.json';
        break;
      case 'other':
        if (contentType.includes('json')) {
          extension = '.json';
        } else if (contentType.includes('xml')) {
          extension = '.xml';
        } else {
          extension = '.txt';
        }
        break;
      default:
        extension = '.unknown';
    }
    
    // Sanitizar nombre de archivo
    const sanitizedName = nameWithoutExt.replace(/[<>:"/\\|?*]/g, '_');
    
    return `${String(counter).padStart(3, '0')}_${sanitizedName}_${hash}${extension}`;
  } catch (error) {
    console.warn(`⚠️ Error generando nombre para ${url}:`, error);
    counters.other++;
    const hash = crypto.createHash('md5').update(content).digest('hex').substring(0, 8);
    return `${String(counters.other).padStart(3, '0')}_resource_${hash}.unknown`;
  }
}

/**
 * Determina si un recurso debe ser descargado
 */
function shouldDownloadResource(url: string, contentType: string): boolean {
  const urlLower = url.toLowerCase();
  
  // Filtrar recursos irrelevantes o problemáticos
  const skipPatterns = [
    /^data:/, // Data URLs
    /^blob:/, // Blob URLs
    /\.map$/, // Source maps
    /analytics/,
    /tracking/,
    /gtag/,
    /google-analytics/,
    /facebook\.net/,
    /doubleclick/,
    /googleadservices/,
    /googlesyndication/
  ];
  
  return !skipPatterns.some(pattern => pattern.test(urlLower));
}

/**
 * Descarga un recurso interceptado de la red
 */
async function downloadInterceptedResource(
  response: Response, 
  capturedResources: CapturedResource[]
): Promise<void> {
  const url = response.url();
  const status = response.status();
  const contentType = response.headers()['content-type'] || 'unknown';
  
  // Solo procesar respuestas exitosas
  if (status < 200 || status >= 400) {
    return;
  }
  
  // Verificar si debemos descargar este recurso
  if (!shouldDownloadResource(url, contentType)) {
    return;
  }
  
  // Evitar duplicados
  const resourceKey = `${url}|${contentType}`;
  if (downloadedResources.has(resourceKey)) {
    return;
  }
  
  try {
    const buffer = await response.body();
    if (!buffer || buffer.length === 0) {
      console.warn(`⚠️ Recurso vacío: ${url}`);
      return;
    }
    
    const resourceType = getResourceType(url, contentType);
    const filename = generateUniqueFilename(url, contentType, buffer);
    const targetDir = ASSET_DIRS[resourceType as keyof typeof ASSET_DIRS] || ASSET_DIRS.other;
    const savePath = path.join(targetDir, filename);
    
    // Guardar archivo
    await fs.writeFile(savePath, buffer);
    
    // Generar hash para verificación
    const hash = crypto.createHash('md5').update(buffer).digest('hex');
    
    const capturedResource: CapturedResource = {
      url,
      type: resourceType,
      contentType,
      status,
      size: buffer.length,
      filename,
      hash,
      savedPath: savePath,
      timestamp: new Date().toISOString()
    };
    
    capturedResources.push(capturedResource);
    downloadedResources.add(resourceKey);
    
    console.log(`📥 [${resourceType.toUpperCase()}] ${filename} (${(buffer.length / 1024).toFixed(1)}KB)`);
    
  } catch (error) {
    console.error(`❌ Error descargando ${url}:`, error);
  }
}

/**
 * Configura la intercepción de red para capturar todos los recursos
 */
function setupNetworkInterception(page: Page, capturedResources: CapturedResource[]): void {
  console.log('🕸️ Configurando intercepción de red...');
  
  page.on('response', async (response) => {
    // Procesar la respuesta en paralelo sin bloquear la navegación
    downloadInterceptedResource(response, capturedResources).catch(error => {
      console.warn(`⚠️ Error procesando respuesta de ${response.url()}:`, error);
    });
  });
  
  console.log('✅ Intercepción de red configurada');
}

/**
 * Guarda un snapshot del HTML actual de la página
 */
async function saveHTMLSnapshot(page: Page, description: string): Promise<string> {
  htmlCounter++;
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `merchant_home_${String(htmlCounter).padStart(2, '0')}_${description}_${timestamp}.html`;
  const filePath = path.join(OUTPUT_DIR, filename);
  
  const html = await page.content();
  await fs.writeFile(filePath, html, 'utf8');
  
  console.log(`💾 HTML guardado: ${filename}`);
  return filename;
}

/**
 * Realiza desplazamiento inteligente hasta el final de la página
 */
async function performIntelligentScrolling(page: Page, interactionLogs: InteractionLog[], capturedResources: CapturedResource[]): Promise<void> {
  console.log('📜 Iniciando desplazamiento inteligente...');
  
  const resourceCountBefore = capturedResources.length;
  
  try {
    // Obtener altura inicial
    let previousHeight = await page.evaluate(() => document.body.scrollHeight);
    let scrollAttempts = 0;
    const maxScrollAttempts = 10;
    
    while (scrollAttempts < maxScrollAttempts) {
      // Scroll hacia abajo gradualmente
      await page.evaluate(() => {
        window.scrollBy(0, window.innerHeight * 0.8);
      });
      
      // Esperar que se cargue nuevo contenido
      await page.waitForTimeout(2000);
      
      // Verificar si hay nueva altura de página
      const newHeight = await page.evaluate(() => document.body.scrollHeight);
      
      if (newHeight === previousHeight) {
        scrollAttempts++;
        console.log(`  📏 Altura sin cambios: ${newHeight}px (intento ${scrollAttempts}/${maxScrollAttempts})`);
      } else {
        scrollAttempts = 0; // Reset si encontramos nuevo contenido
        console.log(`  📈 Nueva altura detectada: ${previousHeight}px → ${newHeight}px`);
        previousHeight = newHeight;
      }
      
      // Verificar scroll position
      const scrollPosition = await page.evaluate(() => window.pageYOffset + window.innerHeight);
      const documentHeight = await page.evaluate(() => document.body.scrollHeight);
      
      if (scrollPosition >= documentHeight - 100) {
        console.log('  🏁 Llegamos al final del documento');
        break;
      }
    }
    
    // Scroll hacia arriba al inicio
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(1000);
    
    const resourceCountAfter = capturedResources.length;
    const newResources = resourceCountAfter - resourceCountBefore;
    
    const htmlSnapshot = await saveHTMLSnapshot(page, 'after_scroll');
    
    interactionLogs.push({
      action: 'scroll',
      description: 'Desplazamiento completo hasta el final de la página',
      timestamp: new Date().toISOString(),
      htmlSnapshot,
      newResourcesFound: newResources,
      currentUrl: page.url()
    });
    
    console.log(`✅ Desplazamiento completado. Recursos nuevos encontrados: ${newResources}`);
    
  } catch (error) {
    console.error('❌ Error durante el desplazamiento:', error);
  }
}

/**
 * Busca y hace clic en elementos interactivos específicos de coomunity.co/place/home
 */
async function findAndClickInteractiveElements(page: Page, interactionLogs: InteractionLog[], capturedResources: CapturedResource[]): Promise<void> {
  console.log('🖱️ Buscando elementos interactivos específicos...');
  
  // Selectores específicos para coomunity.co/place/home
  const specificSelectors = [
    // Posibles selectores para CoomÜnity - estos son estimaciones basadas en patrones comunes
    '[data-testid*="menu"]',
    '[data-testid*="button"]',
    '[data-testid*="card"]',
    '[data-testid*="tab"]',
    '.btn:not([href])', // Botones que no son enlaces
    'button:not([disabled])',
    '[role="button"]:not([href])',
    '[role="tab"]',
    '[role="menuitem"]',
    '.card-clickable',
    '.interactive-element',
    '.expandable',
    '.collapsible',
    '.toggle',
    '.dropdown-toggle',
    '.modal-trigger',
    '.show-more',
    '.load-more',
    '.expand',
    '.collapse'
  ];
  
  // Selectores genéricos como respaldo
  const genericSelectors = [
    'button:not([disabled]):not([type="submit"])',
    '[role="button"]:not([href])',
    '.btn:not([href]):not([disabled])',
    '[data-toggle]',
    '[data-target]',
    '[onclick]:not([href])'
  ];
  
  const allSelectors = [...specificSelectors, ...genericSelectors];
  
  for (const selector of allSelectors) {
    try {
      const elements = await page.$$(selector);
      
      if (elements.length > 0) {
        console.log(`  🎯 Encontrados ${elements.length} elementos con selector: ${selector}`);
        
        // Limitar a los primeros 3 elementos para evitar interacciones excesivas
        const elementsToClick = elements.slice(0, 3);
        
        for (let i = 0; i < elementsToClick.length; i++) {
          const element = elementsToClick[i];
          const resourceCountBefore = capturedResources.length;
          
          try {
            // Verificar si el elemento es visible
            const isVisible = await element.isVisible();
            if (!isVisible) {
              console.log(`    ⏭️ Elemento ${i + 1} no visible, saltando`);
              continue;
            }
            
            // Scroll hasta el elemento
            await element.scrollIntoViewIfNeeded();
            await page.waitForTimeout(500);
            
            // Obtener información del elemento antes de hacer clic
            const elementInfo = await element.evaluate(el => ({
              tagName: el.tagName,
              className: el.className,
              id: el.id,
              textContent: el.textContent?.substring(0, 50) || '',
              dataset: Object.keys(el.dataset).length > 0 ? el.dataset : null
            }));
            
            console.log(`    🖱️ Haciendo clic en elemento ${i + 1}: ${elementInfo.tagName} "${elementInfo.textContent}"`);
            
            // Hacer clic con manejo de errores
            await Promise.race([
              element.click(),
              page.waitForTimeout(5000) // Timeout de 5 segundos
            ]);
            
            // Esperar que se procesen los cambios
            await page.waitForTimeout(3000);
            
            const resourceCountAfter = capturedResources.length;
            const newResources = resourceCountAfter - resourceCountBefore;
            
            if (newResources > 0) {
              console.log(`    ✨ Clic generó ${newResources} nuevos recursos`);
              
              const htmlSnapshot = await saveHTMLSnapshot(page, `click_${selector.replace(/[^a-zA-Z0-9]/g, '_')}_${i + 1}`);
              
              interactionLogs.push({
                action: 'click',
                description: `Clic en ${elementInfo.tagName} "${elementInfo.textContent}" (selector: ${selector})`,
                timestamp: new Date().toISOString(),
                htmlSnapshot,
                newResourcesFound: newResources,
                currentUrl: page.url()
              });
            }
            
          } catch (clickError) {
            console.warn(`    ⚠️ Error haciendo clic en elemento ${i + 1}:`, clickError);
          }
        }
      }
    } catch (selectorError) {
      // Silenciar errores de selectores no válidos
      continue;
    }
  }
  
  console.log('✅ Búsqueda de elementos interactivos completada');
}

/**
 * Explora enlaces internos relevantes (si los hay)
 */
async function exploreInternalLinks(page: Page, interactionLogs: InteractionLog[], capturedResources: CapturedResource[]): Promise<void> {
  console.log('🔗 Buscando enlaces internos relevantes...');
  
  try {
    const currentUrl = page.url();
    const currentDomain = new URL(currentUrl).hostname;
    
    // Buscar enlaces internos que no cambien de página principal
    const internalLinks = await page.$$eval('a[href]', (links, domain) => {
      return links
        .map(link => ({
          href: link.href,
          text: link.textContent?.trim() || '',
          pathname: new URL(link.href, window.location.origin).pathname
        }))
        .filter(link => {
          try {
            const linkUrl = new URL(link.href);
            return linkUrl.hostname === domain && 
                   !link.href.includes('#') && // No anchors
                   !link.href.includes('mailto:') &&
                   !link.href.includes('tel:') &&
                   link.pathname !== window.location.pathname; // No same page
          } catch {
            return false;
          }
        })
        .slice(0, 5); // Limitar a 5 enlaces
    }, currentDomain);
    
    if (internalLinks.length > 0) {
      console.log(`  🔍 Encontrados ${internalLinks.length} enlaces internos relevantes`);
      
      for (const link of internalLinks) {
        const resourceCountBefore = capturedResources.length;
        
        try {
          console.log(`  🌐 Navegando a: ${link.href}`);
          await page.goto(link.href, { waitUntil: 'networkidle', timeout: 30000 });
          
          // Esperar que se cargue completamente
          await page.waitForTimeout(5000);
          
          const resourceCountAfter = capturedResources.length;
          const newResources = resourceCountAfter - resourceCountBefore;
          
          const htmlSnapshot = await saveHTMLSnapshot(page, `internal_link_${link.pathname.replace(/[^a-zA-Z0-9]/g, '_')}`);
          
          interactionLogs.push({
            action: 'navigate',
            description: `Navegación a enlace interno: ${link.text} (${link.href})`,
            timestamp: new Date().toISOString(),
            htmlSnapshot,
            newResourcesFound: newResources,
            currentUrl: page.url()
          });
          
          console.log(`    ✨ Enlace generó ${newResources} nuevos recursos`);
          
        } catch (navError) {
          console.warn(`    ⚠️ Error navegando a ${link.href}:`, navError);
        }
      }
      
      // Regresar a la página principal
      console.log(`  🏠 Regresando a la página principal: ${EXPECTED_FINAL_URL}`);
      await page.goto(EXPECTED_FINAL_URL, { waitUntil: 'networkidle', timeout: 30000 });
      await page.waitForTimeout(3000);
      
    } else {
      console.log('  ℹ️ No se encontraron enlaces internos relevantes');
    }
    
  } catch (error) {
    console.error('❌ Error explorando enlaces internos:', error);
  }
}

/**
 * Genera un reporte de los recursos capturados
 */
async function generateResourceReport(capturedResources: CapturedResource[], interactionLogs: InteractionLog[]): Promise<void> {
  console.log('📊 Generando reporte de recursos...');
  
  // Agrupar recursos por tipo
  const resourcesByType = capturedResources.reduce((acc, resource) => {
    if (!acc[resource.type]) {
      acc[resource.type] = [];
    }
    acc[resource.type].push(resource);
    return acc;
  }, {} as Record<string, CapturedResource[]>);
  
  // Calcular estadísticas
  const totalSize = capturedResources.reduce((sum, r) => sum + r.size, 0);
  const totalResources = capturedResources.length;
  
  const report = {
    summary: {
      totalResources,
      totalSize: `${(totalSize / 1024 / 1024).toFixed(2)} MB`,
      timestamp: new Date().toISOString(),
      initialUrl: INITIAL_URL,
      finalUrl: EXPECTED_FINAL_URL
    },
    resourcesByType: Object.entries(resourcesByType).map(([type, resources]) => ({
      type,
      count: resources.length,
      totalSize: `${(resources.reduce((sum, r) => sum + r.size, 0) / 1024).toFixed(1)} KB`,
      files: resources.map(r => ({
        filename: r.filename,
        url: r.url,
        size: `${(r.size / 1024).toFixed(1)} KB`,
        status: r.status
      }))
    })),
    interactions: interactionLogs,
    counters: { ...counters }
  };
  
  const reportPath = path.join(OUTPUT_DIR, 'extraction_report.json');
  await fs.writeFile(reportPath, JSON.stringify(report, null, 2), 'utf8');
  
  console.log('📋 Reporte generado en:', reportPath);
  console.log(`📈 Resumen: ${totalResources} recursos, ${(totalSize / 1024 / 1024).toFixed(2)} MB total`);
}

/**
 * Función principal
 */
async function main(): Promise<void> {
  console.log('🚀 Iniciando extracción exhaustiva de CoomÜnity Merchant...');
  console.log(`📍 URL inicial: ${INITIAL_URL}`);
  console.log(`🎯 URL esperada final: ${EXPECTED_FINAL_URL}`);
  console.log(`📁 Directorio de salida: ${OUTPUT_DIR}`);
  
  // Crear estructura de directorios
  await createAssetDirectories();
  
  const browser = await chromium.launch({ 
    headless: false, // Visible para debugging
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--disable-gpu',
      '--window-size=1920,1080'
    ]
  });
  
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });
  
  const page = await context.newPage();
  
  const capturedResources: CapturedResource[] = [];
  const interactionLogs: InteractionLog[] = [];
  
  try {
    // Configurar intercepción de red
    setupNetworkInterception(page, capturedResources);
    
    // Navegar a la URL inicial y seguir redirecciones
    console.log(`🌐 Navegando a ${INITIAL_URL}...`);
    await page.goto(INITIAL_URL, { 
      waitUntil: 'networkidle', 
      timeout: 60000 
    });
    
    // Esperar que todas las redirecciones se completen
    await page.waitForTimeout(5000);
    
    const finalUrl = page.url();
    console.log(`📍 URL final después de redirecciones: ${finalUrl}`);
    
    // Verificar si llegamos donde esperábamos
    if (finalUrl.includes('coomunity.co/place/home')) {
      console.log('✅ Redirección exitosa a coomunity.co/place/home');
    } else {
      console.log(`⚠️ URL final inesperada. Esperada: ${EXPECTED_FINAL_URL}, Actual: ${finalUrl}`);
    }
    
    // Esperar que la página cargue completamente
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    // Guardar HTML inicial
    const initialSnapshot = await saveHTMLSnapshot(page, 'initial_load');
    interactionLogs.push({
      action: 'load',
      description: 'Carga inicial de la página después de redirecciones',
      timestamp: new Date().toISOString(),
      htmlSnapshot: initialSnapshot,
      newResourcesFound: capturedResources.length,
      currentUrl: finalUrl
    });
    
    console.log(`📦 Recursos iniciales capturados: ${capturedResources.length}`);
    
    // Realizar desplazamiento inteligente
    await performIntelligentScrolling(page, interactionLogs, capturedResources);
    
    // Buscar y hacer clic en elementos interactivos
    await findAndClickInteractiveElements(page, interactionLogs, capturedResources);
    
    // Explorar enlaces internos
    await exploreInternalLinks(page, interactionLogs, capturedResources);
    
    // Guardar snapshot final
    const finalSnapshot = await saveHTMLSnapshot(page, 'final_state');
    interactionLogs.push({
      action: 'complete',
      description: 'Estado final después de todas las interacciones',
      timestamp: new Date().toISOString(),
      htmlSnapshot: finalSnapshot,
      newResourcesFound: 0,
      currentUrl: page.url()
    });
    
    // Generar reporte final
    await generateResourceReport(capturedResources, interactionLogs);
    
    console.log('🎉 ¡Extracción completada exitosamente!');
    console.log(`📊 Total de recursos capturados: ${capturedResources.length}`);
    console.log(`🔄 Total de interacciones: ${interactionLogs.length}`);
    
  } catch (error) {
    console.error('❌ Error durante la extracción:', error);
    
    // Intentar guardar un snapshot de error
    try {
      await saveHTMLSnapshot(page, 'error_state');
    } catch (snapshotError) {
      console.error('❌ Error guardando snapshot de error:', snapshotError);
    }
    
  } finally {
    await browser.close();
    console.log('🔒 Navegador cerrado');
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  main().catch(console.error);
}

export { main }; 