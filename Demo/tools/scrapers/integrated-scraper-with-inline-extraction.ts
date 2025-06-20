import { chromium, Browser, Page } from 'playwright';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as cheerio from 'cheerio';
import InlineContentExtractor from './extract-inline-content';

interface ScrapingConfig {
  url: string;
  projectName: string;
  outputDir: string;
  extractInlineContent: boolean;
  downloadAssets: boolean;
  maxScrolls: number;
  scrollDelay: number;
  waitForNetworkIdle: boolean;
}

interface AssetInfo {
  url: string;
  type: 'css' | 'js' | 'image' | 'font' | 'other';
  filename: string;
  size: number;
  downloaded: boolean;
  error?: string;
}

interface ScrapingReport {
  config: ScrapingConfig;
  timestamp: string;
  htmlFile: string;
  assetsDownloaded: AssetInfo[];
  inlineContentExtracted: {
    cssFiles: string[];
    jsFiles: string[];
  };
  summary: {
    totalAssets: number;
    successfulDownloads: number;
    inlineCssBlocks: number;
    inlineJsBlocks: number;
  };
}

class IntegratedScraper {
  private browser: Browser | null = null;
  private page: Page | null = null;
  private inlineExtractor: InlineContentExtractor;

  constructor() {
    this.inlineExtractor = new InlineContentExtractor();
  }

  /**
   * Inicializa el navegador y la página
   */
  private async initBrowser(): Promise<void> {
    this.browser = await chromium.launch({
      headless: false, // Visible para debugging
      args: ['--disable-web-security', '--disable-features=VizDisplayCompositor']
    });
    
    this.page = await this.browser.newPage();
    
    // Configurar viewport
    await this.page.setViewportSize({ width: 1920, height: 1080 });
    
    // Configurar user agent
    await this.page.setUserAgent(
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    );
  }

  /**
   * Cierra el navegador
   */
  private async closeBrowser(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
      this.page = null;
    }
  }

  /**
   * Determina el tipo de asset basado en la URL
   */
  private getAssetType(url: string): AssetInfo['type'] {
    const ext = path.extname(url.split('?')[0]).toLowerCase();
    
    if (['.css'].includes(ext)) return 'css';
    if (['.js', '.mjs'].includes(ext)) return 'js';
    if (['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp', '.ico'].includes(ext)) return 'image';
    if (['.woff', '.woff2', '.ttf', '.eot'].includes(ext)) return 'font';
    
    return 'other';
  }

  /**
   * Genera un nombre de archivo seguro basado en la URL
   */
  private generateSafeFilename(url: string, type: AssetInfo['type']): string {
    try {
      const urlObj = new URL(url);
      let filename = path.basename(urlObj.pathname) || 'index';
      
      // Si no tiene extensión, agregar una basada en el tipo
      if (!path.extname(filename)) {
        const extensions = {
          css: '.css',
          js: '.js',
          image: '.png',
          font: '.woff2',
          other: '.txt'
        };
        filename += extensions[type];
      }
      
      // Sanitizar el nombre de archivo
      filename = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
      
      // Agregar hash del URL para evitar colisiones
      const hash = Buffer.from(url).toString('base64').slice(0, 8).replace(/[/+=]/g, '');
      const ext = path.extname(filename);
      const name = path.basename(filename, ext);
      
      return `${name}_${hash}${ext}`;
    } catch {
      // Fallback si la URL no es válida
      const hash = Buffer.from(url).toString('base64').slice(0, 16).replace(/[/+=]/g, '');
      return `asset_${hash}.${type === 'css' ? 'css' : type === 'js' ? 'js' : 'txt'}`;
    }
  }

  /**
   * Descarga un asset individual
   */
  private async downloadAsset(url: string, assetDir: string): Promise<AssetInfo> {
    const type = this.getAssetType(url);
    const filename = this.generateSafeFilename(url, type);
    const filePath = path.join(assetDir, type + 's', filename); // css/js/images/fonts/other
    
    const assetInfo: AssetInfo = {
      url,
      type,
      filename,
      size: 0,
      downloaded: false
    };

    try {
      // Crear directorio si no existe
      await fs.mkdir(path.dirname(filePath), { recursive: true });
      
      // Realizar la descarga
      if (!this.page) throw new Error('Page not initialized');
      
      const response = await this.page.context().request.get(url);
      
      if (!response.ok()) {
        throw new Error(`HTTP ${response.status()}: ${response.statusText()}`);
      }
      
      const content = await response.body();
      await fs.writeFile(filePath, content);
      
      assetInfo.size = content.length;
      assetInfo.downloaded = true;
      
      console.log(`✅ Downloaded ${type}: ${filename} (${content.length} bytes)`);
      
    } catch (error) {
      assetInfo.error = error instanceof Error ? error.message : String(error);
      console.log(`❌ Failed to download ${type}: ${filename} - ${assetInfo.error}`);
    }

    return assetInfo;
  }

  /**
   * Extrae y descarga todos los assets de una página
   */
  private async extractAssets(htmlContent: string, baseUrl: string, assetDir: string): Promise<AssetInfo[]> {
    const $ = cheerio.load(htmlContent);
    const assetUrls = new Set<string>();
    
    // Extraer CSS
    $('link[rel="stylesheet"]').each((_, element) => {
      const href = $(element).attr('href');
      if (href) {
        assetUrls.add(new URL(href, baseUrl).href);
      }
    });
    
    // Extraer JavaScript
    $('script[src]').each((_, element) => {
      const src = $(element).attr('src');
      if (src) {
        assetUrls.add(new URL(src, baseUrl).href);
      }
    });
    
    // Extraer imágenes
    $('img[src]').each((_, element) => {
      const src = $(element).attr('src');
      if (src && !src.startsWith('data:')) {
        assetUrls.add(new URL(src, baseUrl).href);
      }
    });
    
    // Extraer fuentes (CSS @font-face sería más complejo, esto es básico)
    $('link[rel="font"], link[href*=".woff"], link[href*=".ttf"]').each((_, element) => {
      const href = $(element).attr('href');
      if (href) {
        assetUrls.add(new URL(href, baseUrl).href);
      }
    });
    
    console.log(`🔍 Found ${assetUrls.size} unique assets to download`);
    
    // Descargar assets en paralelo (con límite de concurrencia)
    const assetInfos: AssetInfo[] = [];
    const concurrencyLimit = 5;
    const assetArray = Array.from(assetUrls);
    
    for (let i = 0; i < assetArray.length; i += concurrencyLimit) {
      const batch = assetArray.slice(i, i + concurrencyLimit);
      const batchPromises = batch.map(url => this.downloadAsset(url, assetDir));
      const batchResults = await Promise.all(batchPromises);
      assetInfos.push(...batchResults);
      
      console.log(`📦 Processed batch ${Math.floor(i/concurrencyLimit) + 1}/${Math.ceil(assetArray.length/concurrencyLimit)}`);
    }
    
    return assetInfos;
  }

  /**
   * Realiza scroll automático para cargar contenido dinámico
   */
  private async autoScroll(maxScrolls: number = 3, delay: number = 2000): Promise<void> {
    if (!this.page) return;
    
    console.log(`🔄 Performing auto-scroll (max ${maxScrolls} scrolls, ${delay}ms delay)`);
    
    for (let i = 0; i < maxScrolls; i++) {
      await this.page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight);
      });
      
      await this.page.waitForTimeout(delay);
      console.log(`   Scroll ${i + 1}/${maxScrolls} completed`);
    }
    
    // Volver al inicio
    await this.page.evaluate(() => {
      window.scrollTo(0, 0);
    });
    
    await this.page.waitForTimeout(1000);
  }

  /**
   * Scraping principal con extracción integrada
   */
  async scrapeWithInlineExtraction(config: ScrapingConfig): Promise<ScrapingReport> {
    const startTime = Date.now();
    const timestamp = new Date().toISOString();
    
    console.log(`🚀 Starting integrated scraping for: ${config.url}`);
    console.log(`📁 Project: ${config.projectName}`);
    
    // Crear directorios de salida
    const projectDir = path.join(config.outputDir, config.projectName);
    const assetDir = path.join(projectDir, 'assets');
    
    await fs.mkdir(projectDir, { recursive: true });
    await fs.mkdir(assetDir, { recursive: true });
    
    // Inicializar navegador
    await this.initBrowser();
    
    if (!this.page) {
      throw new Error('Failed to initialize browser page');
    }
    
    try {
      // Navegar a la página
      console.log(`🌐 Navigating to: ${config.url}`);
      await this.page.goto(config.url, { 
        waitUntil: config.waitForNetworkIdle ? 'networkidle' : 'domcontentloaded',
        timeout: 30000 
      });
      
      // Auto-scroll si está configurado
      if (config.maxScrolls > 0) {
        await this.autoScroll(config.maxScrolls, config.scrollDelay);
      }
      
      // Esperar un poco más para asegurar que todo se cargue
      await this.page.waitForTimeout(2000);
      
      // Capturar HTML final
      const htmlContent = await this.page.content();
      const htmlFilename = `${config.projectName}_${timestamp.replace(/[:.]/g, '-')}.html`;
      const htmlFilePath = path.join(projectDir, htmlFilename);
      
      await fs.writeFile(htmlFilePath, htmlContent, 'utf-8');
      console.log(`💾 HTML saved: ${htmlFilename}`);
      
      // Descargar assets si está configurado
      let assetsDownloaded: AssetInfo[] = [];
      if (config.downloadAssets) {
        console.log(`📦 Starting asset download...`);
        assetsDownloaded = await this.extractAssets(htmlContent, config.url, assetDir);
      }
      
      // Extraer contenido incrustado si está configurado
      let inlineContentExtracted = { cssFiles: [], jsFiles: [] };
      if (config.extractInlineContent) {
        console.log(`🔍 Extracting inline content...`);
        const extractionReport = await this.inlineExtractor.processHtmlFile(htmlFilePath);
        
        if (extractionReport) {
          inlineContentExtracted = {
            cssFiles: extractionReport.extractedFiles.css,
            jsFiles: extractionReport.extractedFiles.js
          };
        }
      }
      
      // Generar reporte final
      const report: ScrapingReport = {
        config,
        timestamp,
        htmlFile: htmlFilename,
        assetsDownloaded,
        inlineContentExtracted,
        summary: {
          totalAssets: assetsDownloaded.length,
          successfulDownloads: assetsDownloaded.filter(a => a.downloaded).length,
          inlineCssBlocks: inlineContentExtracted.cssFiles.length,
          inlineJsBlocks: inlineContentExtracted.jsFiles.length
        }
      };
      
      // Guardar reporte
      const reportPath = path.join(projectDir, `scraping_report_${timestamp.replace(/[:.]/g, '-')}.json`);
      await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
      
      const duration = (Date.now() - startTime) / 1000;
      
      console.log(`\n✅ Scraping completed successfully in ${duration.toFixed(2)}s`);
      console.log(`📊 Summary:`);
      console.log(`   - HTML file: ${htmlFilename}`);
      console.log(`   - Assets downloaded: ${report.summary.successfulDownloads}/${report.summary.totalAssets}`);
      console.log(`   - Inline CSS blocks: ${report.summary.inlineCssBlocks}`);
      console.log(`   - Inline JS blocks: ${report.summary.inlineJsBlocks}`);
      console.log(`   - Report saved: ${path.basename(reportPath)}`);
      
      return report;
      
    } finally {
      await this.closeBrowser();
    }
  }
}

// Configuraciones predefinidas
const PRESETS = {
  pilgrim: {
    url: 'https://demo.coomunity.co/pilgrim/',
    projectName: 'pilgrim_demo_integrated',
    outputDir: 'recovered_code',
    extractInlineContent: true,
    downloadAssets: true,
    maxScrolls: 3,
    scrollDelay: 2000,
    waitForNetworkIdle: true
  },
  merchant: {
    url: 'https://demo.coomunity.co/',
    projectName: 'merchant_demo_integrated',
    outputDir: 'recovered_code',
    extractInlineContent: true,
    downloadAssets: true,
    maxScrolls: 5,
    scrollDelay: 2000,
    waitForNetworkIdle: true
  }
};

// Función principal
async function main() {
  const args = process.argv.slice(2);
  const scraper = new IntegratedScraper();
  
  if (args.length === 0) {
    console.log(`
Usage:
  npx tsx integrated-scraper-with-inline-extraction.ts pilgrim    # Use pilgrim preset
  npx tsx integrated-scraper-with-inline-extraction.ts merchant   # Use merchant preset
  npx tsx integrated-scraper-with-inline-extraction.ts custom <url> <projectName>  # Custom scraping

Available presets: ${Object.keys(PRESETS).join(', ')}
    `);
    return;
  }
  
  let config: ScrapingConfig;
  
  if (args[0] === 'custom' && args.length >= 3) {
    // Configuración personalizada
    config = {
      url: args[1],
      projectName: args[2],
      outputDir: 'recovered_code',
      extractInlineContent: true,
      downloadAssets: true,
      maxScrolls: 3,
      scrollDelay: 2000,
      waitForNetworkIdle: true
    };
  } else if (args[0] in PRESETS) {
    // Usar preset
    config = PRESETS[args[0] as keyof typeof PRESETS];
  } else {
    console.error(`❌ Unknown preset: ${args[0]}`);
    console.log(`Available presets: ${Object.keys(PRESETS).join(', ')}`);
    return;
  }
  
  try {
    await scraper.scrapeWithInlineExtraction(config);
  } catch (error) {
    console.error(`❌ Scraping failed:`, error);
    process.exit(1);
  }
}

// Exportar para uso como módulo
export { IntegratedScraper, type ScrapingConfig, type ScrapingReport };

// Ejecutar si es el módulo principal
if (require.main === module) {
  main().catch(console.error);
} 