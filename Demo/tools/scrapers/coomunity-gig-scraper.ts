import { chromium, Browser, Page } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';

interface GigScrapingResult {
  url: string;
  title: string;
  html: string;
  metadata: any;
  gigDetails: {
    title: string;
    description: string;
    author: string;
    category: string;
    price: string;
    tags: string[];
  };
  forms: any[];
  timestamp: string;
}

class CoomunityGigScraper {
  private browser: Browser | null = null;
  private baseDir: string;
  private targetUrl: string;
  
  constructor() {
    this.baseDir = './coomunity_gig_felicidad';
    this.targetUrl = 'https://coomunity.co/place/gigs/view/anado-valor-a-los-seres-humanos-que-buscan-ser-adictos-a-la-felicidad';
  }

  async initialize(): Promise<void> {
    console.log('🚀 Inicializando Coomunity Gig Scraper (Felicidad)...');
    
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
      `${this.baseDir}/metadata`,
      `${this.baseDir}/gig_data`
    ];

    dirs.forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`📁 Directorio creado: ${dir}`);
      }
    });
  }

  async scrapePage(): Promise<GigScrapingResult> {
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

      // Esperar a que los elementos estén presentes (podría ser login o contenido)
      await page.waitForTimeout(3000);

      // Capturar screenshot
      await page.screenshot({ 
        path: `${this.baseDir}/screenshots/gig_felicidad_full.png`,
        fullPage: true 
      });

      await page.screenshot({ 
        path: `${this.baseDir}/screenshots/gig_felicidad_viewport.png`,
        fullPage: false 
      });

      // Extraer información específica del gig
      const pageData = await page.evaluate(() => {
        // Extraer metadatos básicos
        const metaTags = Array.from(document.querySelectorAll('meta')).map(meta => ({
          name: meta.getAttribute('name'),
          property: meta.getAttribute('property'),
          content: meta.getAttribute('content'),
          charset: meta.getAttribute('charset')
        }));

        // Extraer información específica del gig (si está disponible)
        const gigData = {
          title: document.querySelector('h1')?.textContent?.trim() || 
                 document.querySelector('[class*="title"]')?.textContent?.trim() || 
                 'No title found',
          description: document.querySelector('[class*="description"]')?.textContent?.trim() ||
                      document.querySelector('p')?.textContent?.trim() ||
                      'No description found',
          author: document.querySelector('[class*="author"]')?.textContent?.trim() ||
                 document.querySelector('[class*="creator"]')?.textContent?.trim() ||
                 'No author found',
          category: document.querySelector('[class*="category"]')?.textContent?.trim() ||
                   'No category found',
          price: document.querySelector('[class*="price"]')?.textContent?.trim() ||
                document.querySelector('[class*="cost"]')?.textContent?.trim() ||
                'No price found',
          tags: Array.from(document.querySelectorAll('[class*="tag"]')).map(tag => 
            tag.textContent?.trim() || ''
          ).filter(tag => tag.length > 0)
        };

        // Extraer formularios
        const forms = Array.from(document.querySelectorAll('form')).map(form => {
          const inputs = Array.from(form.querySelectorAll('input')).map(input => ({
            type: input.type,
            name: input.name,
            id: input.id,
            value: input.value,
            placeholder: input.placeholder,
            required: input.required
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

        // Detectar si estamos en página de login o en el gig real
        const isLoginPage = document.querySelector('input[type="tel"]') !== null ||
                           document.querySelector('.intl-tel-input') !== null ||
                           document.body.innerHTML.includes('Login Pläza');

        // Extraer todo el contenido visible
        const allTextContent = document.body.textContent || '';
        const isGigContent = allTextContent.includes('felicidad') || 
                            allTextContent.includes('adictos') ||
                            allTextContent.includes('valor') ||
                            allTextContent.includes('seres humanos');

        return {
          title: document.title,
          metaTags,
          gigData,
          forms,
          isLoginPage,
          isGigContent,
          bodyHTML: document.body.innerHTML,
          headHTML: document.head.innerHTML,
          url: window.location.href,
          pathname: window.location.pathname,
          fullText: allTextContent.substring(0, 1000) // Primeros 1000 caracteres
        };
      });

      // Guardar HTML completo
      const fullHTML = await page.content();
      fs.writeFileSync(
        `${this.baseDir}/html/gig_felicidad_page.html`,
        fullHTML,
        'utf8'
      );

      // Determinar el tipo de página que obtuvimos
      const pageType = pageData.isLoginPage ? 'login' : 
                      pageData.isGigContent ? 'gig_content' : 'unknown';

      console.log(`📋 Tipo de página detectado: ${pageType}`);
      console.log(`📄 Título: ${pageData.title}`);
      console.log(`🎯 ¿Es login?: ${pageData.isLoginPage}`);
      console.log(`📝 ¿Contiene contenido del gig?: ${pageData.isGigContent}`);

      // Crear resultado
      const result: GigScrapingResult = {
        url: this.targetUrl,
        title: pageData.title,
        html: fullHTML,
        metadata: pageData,
        gigDetails: pageData.gigData,
        forms: pageData.forms,
        timestamp: new Date().toISOString()
      };

      // Guardar análisis detallado
      await this.saveAnalysis(result, interceptedRequests, pageType);

      console.log('✅ Scraping completado exitosamente');
      return result;

    } catch (error) {
      console.error('❌ Error durante el scraping:', error);
      throw error;
    } finally {
      await page.close();
    }
  }

  private async saveAnalysis(result: GigScrapingResult, requests: any[], pageType: string): Promise<void> {
    // Análisis específico del gig
    const gigAnalysis = {
      pageType,
      gigDetails: result.gigDetails,
      accessLevel: pageType === 'login' ? 'requires_authentication' : 'accessible',
      contentFound: {
        title: result.gigDetails.title !== 'No title found',
        description: result.gigDetails.description !== 'No description found',
        author: result.gigDetails.author !== 'No author found',
        price: result.gigDetails.price !== 'No price found',
        tags: result.gigDetails.tags.length > 0
      }
    };

    // Análisis de autenticación
    const authAnalysis = {
      requiresLogin: pageType === 'login',
      loginMethod: pageType === 'login' ? 'phone_whatsapp' : null,
      redirected: result.metadata.url !== result.url,
      actualUrl: result.metadata.url
    };

    // Análisis de requests
    const requestAnalysis = {
      totalRequests: requests.length,
      byResourceType: requests.reduce((acc: any, req) => {
        acc[req.resourceType] = (acc[req.resourceType] || 0) + 1;
        return acc;
      }, {}),
      gigSpecificRequests: requests.filter(req => 
        req.url.includes('gigs') || 
        req.url.includes('felicidad') ||
        req.url.includes('adictos')
      )
    };

    // Guardar análisis
    fs.writeFileSync(
      `${this.baseDir}/analysis/gig_analysis.json`,
      JSON.stringify(gigAnalysis, null, 2),
      'utf8'
    );

    fs.writeFileSync(
      `${this.baseDir}/analysis/auth_analysis.json`,
      JSON.stringify(authAnalysis, null, 2),
      'utf8'
    );

    fs.writeFileSync(
      `${this.baseDir}/analysis/request_analysis.json`,
      JSON.stringify(requestAnalysis, null, 2),
      'utf8'
    );

    fs.writeFileSync(
      `${this.baseDir}/gig_data/extracted_data.json`,
      JSON.stringify(result.gigDetails, null, 2),
      'utf8'
    );

    fs.writeFileSync(
      `${this.baseDir}/metadata/complete_metadata.json`,
      JSON.stringify(result.metadata, null, 2),
      'utf8'
    );

    // Generar reporte
    await this.generateReport(result, gigAnalysis, authAnalysis, requestAnalysis);
  }

  private async generateReport(
    result: GigScrapingResult, 
    gigAnalysis: any, 
    authAnalysis: any, 
    requestAnalysis: any
  ): Promise<void> {
    const report = `# CoomÜnity Gig Analysis Report - "Adictos a la Felicidad"

**Generated:** ${result.timestamp}
**Target URL:** ${result.url}
**Actual URL:** ${authAnalysis.actualUrl}
**Page Type:** ${gigAnalysis.pageType}

## Executive Summary

This report documents the analysis of the specific CoomÜnity gig: "Añado valor a los seres humanos que buscan ser adictos a la felicidad".

## 🎯 Access Analysis

- **Requires Login:** ${authAnalysis.requiresLogin ? 'Yes' : 'No'}
- **Login Method:** ${authAnalysis.loginMethod || 'N/A'}
- **Was Redirected:** ${authAnalysis.redirected ? 'Yes' : 'No'}
- **Access Level:** ${gigAnalysis.accessLevel}

## 📋 Gig Content Analysis

**Content Successfully Extracted:**
- **Title:** ${gigAnalysis.contentFound.title ? '✅' : '❌'} - "${result.gigDetails.title}"
- **Description:** ${gigAnalysis.contentFound.description ? '✅' : '❌'} - "${result.gigDetails.description.substring(0, 100)}..."
- **Author:** ${gigAnalysis.contentFound.author ? '✅' : '❌'} - "${result.gigDetails.author}"
- **Price:** ${gigAnalysis.contentFound.price ? '✅' : '❌'} - "${result.gigDetails.price}"
- **Tags:** ${gigAnalysis.contentFound.tags ? '✅' : '❌'} - ${result.gigDetails.tags.length} tags found

${result.gigDetails.tags.length > 0 ? `
**Tags Found:**
${result.gigDetails.tags.map(tag => `- ${tag}`).join('\n')}
` : ''}

## 🔒 Authentication Requirements

${authAnalysis.requiresLogin ? `
**Login Required:** This gig requires authentication to view full content.
- Phone number verification via WhatsApp
- Standard CoomÜnity Login Pläza interface
- Forms: ${result.forms.length} login form(s) detected
` : `
**Publicly Accessible:** Gig content was accessible without authentication.
`}

## 🌐 Network Analysis

**Total Requests:** ${requestAnalysis.totalRequests}

**By Resource Type:**
${Object.entries(requestAnalysis.byResourceType).map(([type, count]) => `- ${type}: ${count}`).join('\n')}

**Gig-Specific Requests:** ${requestAnalysis.gigSpecificRequests.length}

## 📊 Key Findings

1. **Content Access:** ${gigAnalysis.accessLevel === 'requires_authentication' ? 'Gig requires login to view detailed content' : 'Gig content is publicly accessible'}
2. **Data Quality:** ${Object.values(gigAnalysis.contentFound).filter(Boolean).length}/${Object.keys(gigAnalysis.contentFound).length} data fields successfully extracted
3. **Market Category:** ${result.gigDetails.category !== 'No category found' ? result.gigDetails.category : 'Category information requires authentication'}

## 📂 File Structure

\`\`\`
${this.baseDir}/
├── html/
│   └── gig_felicidad_page.html
├── screenshots/
│   ├── gig_felicidad_full.png
│   └── gig_felicidad_viewport.png
├── analysis/
│   ├── gig_analysis.json
│   ├── auth_analysis.json
│   └── request_analysis.json
├── gig_data/
│   └── extracted_data.json
├── metadata/
│   └── complete_metadata.json
└── gig_felicidad_report.md
\`\`\`

## 🔍 Next Steps

${authAnalysis.requiresLogin ? `
**Authentication Required:** To access full gig content, implement:
1. Phone authentication flow
2. WhatsApp verification
3. Session management for authenticated scraping
` : `
**Full Access Achieved:** Gig content has been successfully captured and analyzed.
`}

---

**Status:** ✅ **GIG ANALYSIS COMPLETE**

The "Adictos a la Felicidad" gig page has been analyzed and documented.

**Last Updated:** ${result.timestamp}
`;

    fs.writeFileSync(`${this.baseDir}/gig_felicidad_report.md`, report, 'utf8');
    console.log('📄 Reporte generado: gig_felicidad_report.md');
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
      
      console.log('\n🎉 GIG SCRAPING COMPLETADO EXITOSAMENTE!');
      console.log(`📁 Resultados guardados en: ${this.baseDir}/`);
      console.log(`📊 URL analizada: ${result.url}`);
      console.log(`📋 Tipo de página: ${result.metadata.isLoginPage ? 'Login requerido' : 'Contenido accesible'}`);
      console.log(`🎯 Título del gig: ${result.gigDetails.title}`);
      
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
  const scraper = new CoomunityGigScraper();
  await scraper.run();
}

if (require.main === module) {
  main().catch(console.error);
}

export { CoomunityGigScraper }; 