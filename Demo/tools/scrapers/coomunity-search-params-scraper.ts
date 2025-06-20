import { chromium, Browser, Page } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';

interface ScrapingResult {
  url: string;
  title: string;
  html: string;
  metadata: any;
  forms: any[];
  parameters: {
    param: string;
    category: string;
  };
  timestamp: string;
}

class CoomunitySearchParamsScraper {
  private browser: Browser | null = null;
  private baseDir: string;
  private targetUrl: string;
  
  constructor() {
    this.baseDir = './coomunity_search_params';
    this.targetUrl = 'https://coomunity.co/place/search?param=coaching&category=trasciende';
  }

  async initialize(): Promise<void> {
    console.log('🚀 Inicializando Coomunity Search Parameters Scraper...');
    
    // Crear directorios
    this.createDirectories();
    
    // Lanzar browser
    this.browser = await chromium.launch({
      headless: false,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    console.log('✅ Browser iniciado correctamente');
  }

  private createDirectories(): void {
    const dirs = [
      this.baseDir,
      `${this.baseDir}/html`,
      `${this.baseDir}/assets`,
      `${this.baseDir}/assets/css`,
      `${this.baseDir}/assets/js`,
      `${this.baseDir}/assets/images`,
      `${this.baseDir}/screenshots`,
      `${this.baseDir}/analysis`,
      `${this.baseDir}/metadata`
    ];

    dirs.forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`📁 Directorio creado: ${dir}`);
      }
    });
  }

  async scrapePage(): Promise<ScrapingResult> {
    if (!this.browser) {
      throw new Error('Browser no inicializado');
    }

    const page = await this.browser.newPage();
    
    console.log(`🌐 Navegando a: ${this.targetUrl}`);
    
    try {
      // Interceptar requests para capturar recursos
      const interceptedRequests: any[] = [];
      
      page.on('request', request => {
        interceptedRequests.push({
          url: request.url(),
          method: request.method(),
          resourceType: request.resourceType(),
          headers: request.headers()
        });
      });

      // Navegar a la página
      await page.goto(this.targetUrl, { 
        waitUntil: 'networkidle',
        timeout: 30000 
      });

      console.log('📄 Página cargada, extrayendo contenido...');

      // Esperar a que los elementos clave estén presentes
      await page.waitForSelector('form', { timeout: 10000 });

      // Capturar screenshot
      await page.screenshot({ 
        path: `${this.baseDir}/screenshots/search_params_full.png`,
        fullPage: true 
      });

      await page.screenshot({ 
        path: `${this.baseDir}/screenshots/search_params_viewport.png`,
        fullPage: false 
      });

      // Extraer información de la página
      const pageData = await page.evaluate(() => {
        // Extraer metadatos
        const metaTags = Array.from(document.querySelectorAll('meta')).map(meta => ({
          name: meta.getAttribute('name'),
          property: meta.getAttribute('property'),
          content: meta.getAttribute('content'),
          charset: meta.getAttribute('charset')
        }));

        // Extraer información de formularios
        const forms = Array.from(document.querySelectorAll('form')).map(form => {
          const inputs = Array.from(form.querySelectorAll('input')).map(input => ({
            type: input.type,
            name: input.name,
            id: input.id,
            value: input.value,
            placeholder: input.placeholder,
            required: input.required,
            pattern: input.pattern
          }));

          const buttons = Array.from(form.querySelectorAll('button')).map(button => ({
            type: button.type,
            textContent: button.textContent?.trim(),
            className: button.className
          }));

          return {
            action: form.action,
            method: form.method,
            className: form.className,
            id: form.id,
            inputs: inputs,
            buttons: buttons
          };
        });

        // Extraer scripts específicos
        const scripts = Array.from(document.querySelectorAll('script')).map(script => ({
          src: script.src,
          content: script.src ? null : script.textContent?.substring(0, 200) + '...',
          type: script.type
        }));

        // Extraer links CSS
        const stylesheets = Array.from(document.querySelectorAll('link[rel="stylesheet"]')).map(link => ({
          href: link.getAttribute('href'),
          media: link.getAttribute('media')
        }));

        return {
          title: document.title,
          metaTags,
          forms,
          scripts: scripts.filter(s => s.content || s.src),
          stylesheets,
          bodyHTML: document.body.innerHTML,
          headHTML: document.head.innerHTML,
          url: window.location.href,
          search: window.location.search,
          pathname: window.location.pathname
        };
      });

      // Guardar HTML completo
      const fullHTML = await page.content();
      fs.writeFileSync(
        `${this.baseDir}/html/search_params_page.html`,
        fullHTML,
        'utf8'
      );

      // Descargar recursos CSS y JS principales
      await this.downloadAssets(page, pageData.stylesheets, pageData.scripts);

      // Analizar parámetros URL
      const urlParams = new URL(this.targetUrl);
      const parameters = {
        param: urlParams.searchParams.get('param') || '',
        category: urlParams.searchParams.get('category') || ''
      };

      // Crear resultado
      const result: ScrapingResult = {
        url: this.targetUrl,
        title: pageData.title,
        html: fullHTML,
        metadata: pageData,
        forms: pageData.forms,
        parameters,
        timestamp: new Date().toISOString()
      };

      // Guardar análisis detallado
      await this.saveAnalysis(result, interceptedRequests);

      console.log('✅ Scraping completado exitosamente');
      return result;

    } catch (error) {
      console.error('❌ Error durante el scraping:', error);
      throw error;
    } finally {
      await page.close();
    }
  }

  private async downloadAssets(page: Page, stylesheets: any[], scripts: any[]): Promise<void> {
    console.log('📦 Descargando assets...');

    // Descargar CSS
    for (const stylesheet of stylesheets) {
      if (stylesheet.href && stylesheet.href.startsWith('http')) {
        try {
          const response = await page.request.get(stylesheet.href);
          const content = await response.text();
          const filename = this.getFilenameFromUrl(stylesheet.href, '.css');
          fs.writeFileSync(`${this.baseDir}/assets/css/${filename}`, content, 'utf8');
          console.log(`  ✅ CSS descargado: ${filename}`);
        } catch (error) {
          console.log(`  ⚠️  Error descargando CSS: ${stylesheet.href}`);
        }
      }
    }

    // Descargar JS principales
    const mainScripts = scripts.filter(s => 
      s.src && 
      (s.src.includes('coomunity.co') || s.src.includes('jquery') || s.src.includes('bootstrap'))
    );

    for (const script of mainScripts) {
      if (script.src && script.src.startsWith('http')) {
        try {
          const response = await page.request.get(script.src);
          const content = await response.text();
          const filename = this.getFilenameFromUrl(script.src, '.js');
          fs.writeFileSync(`${this.baseDir}/assets/js/${filename}`, content, 'utf8');
          console.log(`  ✅ JS descargado: ${filename}`);
        } catch (error) {
          console.log(`  ⚠️  Error descargando JS: ${script.src}`);
        }
      }
    }
  }

  private getFilenameFromUrl(url: string, extension: string): string {
    try {
      const urlObj = new URL(url);
      let filename = path.basename(urlObj.pathname);
      if (!filename || filename === '/') {
        filename = 'main' + extension;
      }
      if (!filename.endsWith(extension)) {
        filename += extension;
      }
      return filename.replace(/[^a-zA-Z0-9.-]/g, '_');
    } catch {
      return 'asset' + extension;
    }
  }

  private async saveAnalysis(result: ScrapingResult, requests: any[]): Promise<void> {
    // Análisis de formularios
    const formAnalysis = {
      totalForms: result.forms.length,
      forms: result.forms.map((form, index) => ({
        index,
        action: form.action,
        method: form.method,
        inputCount: form.inputs.length,
        hasHiddenInputs: form.inputs.some((input: any) => input.type === 'hidden'),
        hasPhoneInput: form.inputs.some((input: any) => input.type === 'tel'),
        hasSubmitButton: form.buttons.some((button: any) => button.type === 'submit'),
        details: form
      }))
    };

    // Análisis de parámetros
    const parameterAnalysis = {
      parameters: result.parameters,
      impact: {
        affectsFormAction: result.forms.some(form => 
          form.action?.includes('coaching') || form.action?.includes('trasciende')
        ),
        hasSpecificScripts: result.metadata.scripts.some((script: any) => 
          script.content?.includes('coaching') || script.content?.includes('trasciende')
        ),
        hasSpecificMetadata: result.metadata.metaTags.some((meta: any) => 
          meta.content?.includes('coaching') || meta.content?.includes('trasciende')
        )
      }
    };

    // Análisis de requests
    const requestAnalysis = {
      totalRequests: requests.length,
      byResourceType: requests.reduce((acc: any, req) => {
        acc[req.resourceType] = (acc[req.resourceType] || 0) + 1;
        return acc;
      }, {}),
      parameterSpecificRequests: requests.filter(req => 
        req.url.includes('coaching') || req.url.includes('trasciende')
      )
    };

    // Guardar análisis
    fs.writeFileSync(
      `${this.baseDir}/analysis/form_analysis.json`,
      JSON.stringify(formAnalysis, null, 2),
      'utf8'
    );

    fs.writeFileSync(
      `${this.baseDir}/analysis/parameter_analysis.json`,
      JSON.stringify(parameterAnalysis, null, 2),
      'utf8'
    );

    fs.writeFileSync(
      `${this.baseDir}/analysis/request_analysis.json`,
      JSON.stringify(requestAnalysis, null, 2),
      'utf8'
    );

    fs.writeFileSync(
      `${this.baseDir}/metadata/complete_metadata.json`,
      JSON.stringify(result.metadata, null, 2),
      'utf8'
    );

    // Generar reporte
    await this.generateReport(result, formAnalysis, parameterAnalysis, requestAnalysis);
  }

  private async generateReport(
    result: ScrapingResult, 
    formAnalysis: any, 
    parameterAnalysis: any, 
    requestAnalysis: any
  ): Promise<void> {
    const report = `# CoomÜnity Search Parameters Analysis Report

**Generated:** ${result.timestamp}
**Target URL:** ${result.url}
**Parameters:** param=${result.parameters.param}, category=${result.parameters.category}

## Executive Summary

This report documents the analysis of CoomÜnity's search page with specific parameters for coaching and "trasciende" category.

## 🎯 URL Parameters Analysis

- **param:** ${result.parameters.param}
- **category:** ${result.parameters.category}
- **Impact on Forms:** ${parameterAnalysis.impact.affectsFormAction ? 'Yes' : 'No'}
- **Specific Scripts:** ${parameterAnalysis.impact.hasSpecificScripts ? 'Yes' : 'No'}
- **Specific Metadata:** ${parameterAnalysis.impact.hasSpecificMetadata ? 'Yes' : 'No'}

## 📋 Form Analysis

**Total Forms:** ${formAnalysis.totalForms}

${formAnalysis.forms.map((form: any) => `
### Form ${form.index + 1}
- **Action:** ${form.action}
- **Method:** ${form.method}
- **Input Count:** ${form.inputCount}
- **Has Phone Input:** ${form.hasPhoneInput ? 'Yes' : 'No'}
- **Has Hidden Inputs:** ${form.hasHiddenInputs ? 'Yes' : 'No'}
- **Has Submit Button:** ${form.hasSubmitButton ? 'Yes' : 'No'}
`).join('')}

## 🌐 Network Analysis

**Total Requests:** ${requestAnalysis.totalRequests}

**By Resource Type:**
${Object.entries(requestAnalysis.byResourceType).map(([type, count]) => `- ${type}: ${count}`).join('\n')}

**Parameter-Specific Requests:** ${requestAnalysis.parameterSpecificRequests.length}

## 📊 Key Findings

1. **Parameter Behavior:** ${parameterAnalysis.impact.affectsFormAction ? 'Parameters affect form behavior' : 'Parameters appear to be passive'}
2. **Content Specificity:** ${parameterAnalysis.impact.hasSpecificScripts || parameterAnalysis.impact.hasSpecificMetadata ? 'Page contains parameter-specific content' : 'Page content appears generic'}
3. **Network Impact:** ${requestAnalysis.parameterSpecificRequests.length > 0 ? 'Parameters trigger specific network requests' : 'No parameter-specific network activity detected'}

## 📂 File Structure

\`\`\`
${this.baseDir}/
├── html/
│   └── search_params_page.html
├── assets/
│   ├── css/
│   └── js/
├── screenshots/
│   ├── search_params_full.png
│   └── search_params_viewport.png
├── analysis/
│   ├── form_analysis.json
│   ├── parameter_analysis.json
│   └── request_analysis.json
├── metadata/
│   └── complete_metadata.json
└── search_params_report.md
\`\`\`

## 🔍 Comparison with Base URL

To compare with the base URL (without parameters), check the differences in:
- Form actions and hidden inputs
- JavaScript behavior
- Server-side routing
- Metadata and SEO tags

---

**Status:** ✅ **PARAMETER ANALYSIS COMPLETE**

The search page with coaching and trasciende parameters has been fully analyzed and documented.

**Last Updated:** ${result.timestamp}
`;

    fs.writeFileSync(`${this.baseDir}/search_params_report.md`, report, 'utf8');
    console.log('📄 Reporte generado: search_params_report.md');
  }

  async cleanup(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      console.log('🧹 Browser cerrado');
    }
  }

  async run(): Promise<void> {
    try {
      await this.initialize();
      const result = await this.scrapePage();
      
      console.log('\n🎉 SCRAPING COMPLETADO EXITOSAMENTE!');
      console.log(`📁 Resultados guardados en: ${this.baseDir}/`);
      console.log(`📊 URL analizada: ${result.url}`);
      console.log(`📋 Formularios encontrados: ${result.forms.length}`);
      console.log(`🎯 Parámetros: param=${result.parameters.param}, category=${result.parameters.category}`);
      
    } catch (error) {
      console.error('💥 Error durante la ejecución:', error);
      throw error;
    } finally {
      await this.cleanup();
    }
  }
}

// Ejecutar el scraper
async function main() {
  const scraper = new CoomunitySearchParamsScraper();
  await scraper.run();
}

if (require.main === module) {
  main().catch(console.error);
}

export { CoomunitySearchParamsScraper }; 