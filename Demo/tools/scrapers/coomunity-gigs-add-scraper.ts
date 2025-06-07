import { chromium, Browser, Page } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';

interface GigAddScrapingResult {
  url: string;
  title: string;
  html: string;
  metadata: any;
  gigCreationFeatures: {
    formFields: any[];
    categoryOptions: any[];
    pricingOptions: any[];
    mediaUpload: any[];
    descriptionFields: any[];
  };
  forms: any[];
  accessPath: string[];
  timestamp: string;
}

class CoomunityGigAddScraper {
  private browser: Browser | null = null;
  private baseDir: string;
  private devUrl: string;
  private targetUrl: string;
  
  constructor() {
    this.baseDir = './coomunity_gigs_add';
    this.devUrl = 'https://dev.coomunity.co/merchant/a1598e94';
    this.targetUrl = 'https://coomunity.co/place/gigs/add';
  }

  async initialize(): Promise<void> {
    console.log('🚀 Inicializando Coomunity Gig Creation Scraper...');
    
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
      `${this.baseDir}/gig_creation_data`,
      `${this.baseDir}/access_flow`,
      `${this.baseDir}/form_analysis`
    ];

    dirs.forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`📁 Directorio creado: ${dir}`);
      }
    });
  }

  async scrapeGigAddPage(): Promise<GigAddScrapingResult> {
    if (!this.browser) {
      throw new Error('Browser no inicializado');
    }

    const page = await this.browser.newPage();
    const accessPath: string[] = [];
    
    console.log('🛤️ Iniciando flujo de acceso recomendado para creación de gigs...');
    
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

      // PASO 1: Acceder primero al entorno de desarrollo (según instrucciones)
      console.log(`🔧 PASO 1: Accediendo al entorno de desarrollo...`);
      console.log(`🌐 Navegando a: ${this.devUrl}`);
      
      await page.goto(this.devUrl, { 
        waitUntil: 'networkidle',
        timeout: 30000 
      });
      
      accessPath.push(`dev_environment: ${this.devUrl}`);
      
      // Capturar estado del dev environment
      await page.screenshot({ 
        path: `${this.baseDir}/screenshots/01_dev_environment.png`,
        fullPage: true 
      });

      // Esperar y analizar el entorno de desarrollo
      await page.waitForTimeout(3000);

      const devPageAnalysis = await page.evaluate(() => {
        return {
          title: document.title,
          url: window.location.href,
          hasLoginForm: document.querySelector('input[type="tel"]') !== null,
          hasGigCreateLinks: document.body.innerHTML.includes('gigs/add') || 
                            document.body.innerHTML.includes('Crear anuncio'),
          hasMenuOptions: document.querySelectorAll('[class*="menu"]').length > 0,
          bodyText: document.body.textContent?.substring(0, 500) || ''
        };
      });

      console.log(`📋 Análisis del entorno dev:`, devPageAnalysis);

      // PASO 2: Navegar directamente a la URL de creación de gigs
      console.log(`📝 PASO 2: Navegando a la página de creación de gigs...`);
      console.log(`🌐 Navegando a: ${this.targetUrl}`);
      
      await page.goto(this.targetUrl, { 
        waitUntil: 'networkidle',
        timeout: 30000 
      });

      accessPath.push(`gig_add_direct: ${this.targetUrl}`);

      // Capturar estado de la página de creación de gigs
      await page.screenshot({ 
        path: `${this.baseDir}/screenshots/02_gig_add_page.png`,
        fullPage: true 
      });

      await page.screenshot({ 
        path: `${this.baseDir}/screenshots/gig_add_viewport.png`,
        fullPage: false 
      });

      console.log('📄 Página de creación de gigs cargada, analizando contenido...');

      // Esperar a que los elementos estén presentes
      await page.waitForTimeout(5000);

      // PASO 3: Análisis exhaustivo de la página de creación de gigs
      const gigAddPageData = await page.evaluate(() => {
        // Extraer metadatos básicos
        const metaTags = Array.from(document.querySelectorAll('meta')).map(meta => ({
          name: meta.getAttribute('name'),
          property: meta.getAttribute('property'),
          content: meta.getAttribute('content'),
          charset: meta.getAttribute('charset')
        }));

        // Analizar funcionalidades específicas de creación de gigs
        const gigCreationFeatures = {
          formFields: Array.from(document.querySelectorAll('input, textarea, select')).map(field => ({
            type: (field as HTMLInputElement).type || field.tagName.toLowerCase(),
            name: (field as HTMLElement).getAttribute('name'),
            id: (field as HTMLElement).id,
            placeholder: (field as HTMLInputElement).placeholder,
            required: (field as HTMLInputElement).required,
            className: (field as HTMLElement).className,
            value: (field as HTMLInputElement).value,
            tagName: field.tagName
          })),
          
          categoryOptions: Array.from(document.querySelectorAll('select option, [class*="category"] option, [class*="categoria"] option')).map(option => ({
            value: (option as HTMLOptionElement).value,
            text: option.textContent?.trim() || '',
            selected: (option as HTMLOptionElement).selected
          })),
          
          pricingOptions: Array.from(document.querySelectorAll('[class*="price"], [class*="precio"], [class*="cost"], [class*="costo"]')).map(pricing => ({
            text: pricing.textContent?.trim() || '',
            className: pricing.className,
            id: pricing.id,
            tagName: pricing.tagName
          })),
          
          mediaUpload: Array.from(document.querySelectorAll('input[type="file"], [class*="upload"], [class*="imagen"], [class*="photo"]')).map(upload => ({
            type: (upload as HTMLInputElement).type,
            accept: (upload as HTMLInputElement).accept,
            multiple: (upload as HTMLInputElement).multiple,
            className: upload.className,
            id: upload.id
          })),
          
          descriptionFields: Array.from(document.querySelectorAll('textarea, [class*="description"], [class*="descripcion"]')).map(desc => ({
            tagName: desc.tagName,
            name: desc.getAttribute('name'),
            id: desc.id,
            placeholder: (desc as HTMLTextAreaElement).placeholder,
            maxLength: (desc as HTMLTextAreaElement).maxLength,
            className: desc.className
          }))
        };

        // Extraer formularios específicos de creación de gigs
        const forms = Array.from(document.querySelectorAll('form')).map(form => {
          const inputs = Array.from(form.querySelectorAll('input')).map(input => ({
            type: input.type,
            name: input.name,
            id: input.id,
            value: input.value,
            placeholder: input.placeholder,
            required: input.required,
            className: input.className
          }));

          const textareas = Array.from(form.querySelectorAll('textarea')).map(textarea => ({
            name: textarea.name,
            id: textarea.id,
            placeholder: textarea.placeholder,
            required: textarea.required,
            maxLength: textarea.maxLength,
            className: textarea.className
          }));

          const selects = Array.from(form.querySelectorAll('select')).map(select => ({
            name: select.name,
            id: select.id,
            required: select.required,
            className: select.className,
            options: Array.from(select.options).map(option => ({
              value: option.value,
              text: option.text,
              selected: option.selected
            }))
          }));

          const buttons = Array.from(form.querySelectorAll('button')).map(button => ({
            type: button.type,
            textContent: button.textContent?.trim(),
            className: button.className,
            id: button.id
          }));

          return {
            action: form.action,
            method: form.method,
            enctype: form.enctype,
            className: form.className,
            id: form.id,
            inputs: inputs,
            textareas: textareas,
            selects: selects,
            buttons: buttons,
            isGigCreationForm: form.innerHTML.includes('gig') || 
                              form.innerHTML.includes('anuncio') ||
                              form.innerHTML.includes('servicio') ||
                              form.innerHTML.includes('producto') ||
                              form.action?.includes('gig')
          };
        });

        // Detectar el tipo de página que obtuvimos
        const bodyText = document.body.textContent || '';
        const isLoginPage = document.querySelector('input[type="tel"]') !== null ||
                           document.querySelector('.intl-tel-input') !== null ||
                           bodyText.includes('Login Pläza');

        const isGigCreationContent = bodyText.includes('crear') || 
                                   bodyText.includes('añadir') ||
                                   bodyText.includes('nuevo') ||
                                   bodyText.includes('gig') ||
                                   bodyText.includes('anuncio') ||
                                   bodyText.includes('servicio');

        const hasGigCreationFeatures = gigCreationFeatures.formFields.length > 0 ||
                                     gigCreationFeatures.categoryOptions.length > 0 ||
                                     forms.some(f => f.isGigCreationForm);

        return {
          title: document.title,
          metaTags,
          gigCreationFeatures,
          forms,
          isLoginPage,
          isGigCreationContent,
          hasGigCreationFeatures,
          bodyHTML: document.body.innerHTML,
          headHTML: document.head.innerHTML,
          url: window.location.href,
          pathname: window.location.pathname,
          fullText: bodyText.substring(0, 2000), // Primeros 2000 caracteres
          elementCounts: {
            forms: document.querySelectorAll('form').length,
            inputs: document.querySelectorAll('input').length,
            textareas: document.querySelectorAll('textarea').length,
            selects: document.querySelectorAll('select').length,
            buttons: document.querySelectorAll('button').length,
            fileInputs: document.querySelectorAll('input[type="file"]').length
          }
        };
      });

      // Guardar HTML completo
      const fullHTML = await page.content();
      fs.writeFileSync(
        `${this.baseDir}/html/gig_add_page.html`,
        fullHTML,
        'utf8'
      );

      // Determinar el tipo de página que obtuvimos
      const pageType = gigAddPageData.isLoginPage ? 'login' : 
                      gigAddPageData.hasGigCreationFeatures ? 'gig_creation_form' :
                      gigAddPageData.isGigCreationContent ? 'gig_creation_public' : 'unknown';

      console.log(`📋 Tipo de página detectado: ${pageType}`);
      console.log(`📄 Título: ${gigAddPageData.title}`);
      console.log(`🔒 ¿Es login?: ${gigAddPageData.isLoginPage}`);
      console.log(`📝 ¿Tiene contenido de creación?: ${gigAddPageData.isGigCreationContent}`);
      console.log(`🎯 ¿Tiene funciones de creación?: ${gigAddPageData.hasGigCreationFeatures}`);
      console.log(`📊 Elementos encontrados:`, gigAddPageData.elementCounts);

      // Crear resultado
      const result: GigAddScrapingResult = {
        url: this.targetUrl,
        title: gigAddPageData.title,
        html: fullHTML,
        metadata: gigAddPageData,
        gigCreationFeatures: gigAddPageData.gigCreationFeatures,
        forms: gigAddPageData.forms,
        accessPath: accessPath,
        timestamp: new Date().toISOString()
      };

      // Guardar análisis detallado
      await this.saveAnalysis(result, interceptedRequests, pageType, devPageAnalysis);

      console.log('✅ Scraping de creación de gigs completado exitosamente');
      return result;

    } catch (error) {
      console.error('❌ Error durante el scraping de creación de gigs:', error);
      throw error;
    } finally {
      await page.close();
    }
  }

  private async saveAnalysis(
    result: GigAddScrapingResult, 
    requests: any[], 
    pageType: string,
    devAnalysis: any
  ): Promise<void> {
    // Análisis específico de creación de gigs
    const gigCreationAnalysis = {
      pageType,
      accessMethod: 'dev_environment_first',
      gigCreationFeatures: {
        totalFormFields: result.gigCreationFeatures.formFields.length,
        categoryOptionsCount: result.gigCreationFeatures.categoryOptions.length,
        pricingOptionsCount: result.gigCreationFeatures.pricingOptions.length,
        mediaUploadCount: result.gigCreationFeatures.mediaUpload.length,
        descriptionFieldsCount: result.gigCreationFeatures.descriptionFields.length
      },
      functionality: {
        hasCreationForms: result.forms.filter(f => f.isGigCreationForm).length > 0,
        totalForms: result.forms.length,
        totalInputs: result.metadata.elementCounts.inputs,
        totalTextareas: result.metadata.elementCounts.textareas,
        totalSelects: result.metadata.elementCounts.selects,
        totalButtons: result.metadata.elementCounts.buttons,
        hasFileUpload: result.metadata.elementCounts.fileInputs > 0
      },
      contentAccess: pageType !== 'login' ? 'accessible' : 'requires_authentication'
    };

    // Análisis del flujo de acceso
    const accessFlowAnalysis = {
      recommendedPath: result.accessPath,
      devEnvironmentFirst: true,
      devAnalysis: devAnalysis,
      finalResult: pageType,
      authenticationRequired: pageType === 'login'
    };

    // Análisis de requests específicos
    const requestAnalysis = {
      totalRequests: requests.length,
      byResourceType: requests.reduce((acc: any, req) => {
        acc[req.resourceType] = (acc[req.resourceType] || 0) + 1;
        return acc;
      }, {}),
      gigCreationSpecificRequests: requests.filter(req => 
        req.url.includes('gigs') || 
        req.url.includes('add') ||
        req.url.includes('create') ||
        req.url.includes('form')
      )
    };

    // Análisis detallado de formularios
    const formAnalysis = {
      totalForms: result.forms.length,
      gigCreationForms: result.forms.filter(f => f.isGigCreationForm),
      fieldTypes: result.gigCreationFeatures.formFields.reduce((acc: any, field) => {
        acc[field.type] = (acc[field.type] || 0) + 1;
        return acc;
      }, {}),
      requiredFields: result.gigCreationFeatures.formFields.filter(f => f.required),
      categories: result.gigCreationFeatures.categoryOptions
    };

    // Guardar análisis
    fs.writeFileSync(
      `${this.baseDir}/analysis/gig_creation_analysis.json`,
      JSON.stringify(gigCreationAnalysis, null, 2),
      'utf8'
    );

    fs.writeFileSync(
      `${this.baseDir}/analysis/access_flow_analysis.json`,
      JSON.stringify(accessFlowAnalysis, null, 2),
      'utf8'
    );

    fs.writeFileSync(
      `${this.baseDir}/analysis/request_analysis.json`,
      JSON.stringify(requestAnalysis, null, 2),
      'utf8'
    );

    fs.writeFileSync(
      `${this.baseDir}/form_analysis/detailed_form_analysis.json`,
      JSON.stringify(formAnalysis, null, 2),
      'utf8'
    );

    fs.writeFileSync(
      `${this.baseDir}/gig_creation_data/extracted_features.json`,
      JSON.stringify(result.gigCreationFeatures, null, 2),
      'utf8'
    );

    fs.writeFileSync(
      `${this.baseDir}/metadata/complete_metadata.json`,
      JSON.stringify(result.metadata, null, 2),
      'utf8'
    );

    fs.writeFileSync(
      `${this.baseDir}/access_flow/access_path.json`,
      JSON.stringify(result.accessPath, null, 2),
      'utf8'
    );

    // Generar reporte
    await this.generateReport(result, gigCreationAnalysis, accessFlowAnalysis, requestAnalysis, formAnalysis, devAnalysis);
  }

  private async generateReport(
    result: GigAddScrapingResult, 
    gigCreationAnalysis: any, 
    accessFlowAnalysis: any,
    requestAnalysis: any,
    formAnalysis: any,
    devAnalysis: any
  ): Promise<void> {
    const report = `# CoomÜnity Gig Creation Analysis Report

**Generated:** ${result.timestamp}
**Target URL:** ${result.url}
**Access Method:** Development Environment First
**Final Page Type:** ${gigCreationAnalysis.pageType}

## Executive Summary

This report documents the analysis of the CoomÜnity gig creation page (\`/place/gigs/add\`), accessed through the recommended development environment path. This page is critical for marketplace functionality as it allows users to create and publish new gigs.

## 🛤️ Access Flow Analysis

**Recommended Path Followed:**
1. **Dev Environment:** \`${accessFlowAnalysis.devAnalysis.url}\`
2. **Gig Creation:** \`${result.url}\`

**Dev Environment Analysis:**
- **Title:** ${accessFlowAnalysis.devAnalysis.title}
- **Has Login Form:** ${accessFlowAnalysis.devAnalysis.hasLoginForm ? 'Yes' : 'No'}
- **Has Gig Create Links:** ${accessFlowAnalysis.devAnalysis.hasGigCreateLinks ? 'Yes' : 'No'}
- **Menu Options:** ${accessFlowAnalysis.devAnalysis.hasMenuOptions ? 'Yes' : 'No'}

## 🔒 Authentication & Access

- **Requires Authentication:** ${accessFlowAnalysis.authenticationRequired ? 'Yes' : 'No'}
- **Access Level:** ${gigCreationAnalysis.contentAccess}
- **Page Type:** ${gigCreationAnalysis.pageType}

## 📝 Gig Creation Features Analysis

**Core Creation Elements:**
- **Total Form Fields:** ${gigCreationAnalysis.gigCreationFeatures.totalFormFields}
- **Category Options:** ${gigCreationAnalysis.gigCreationFeatures.categoryOptionsCount} available
- **Pricing Options:** ${gigCreationAnalysis.gigCreationFeatures.pricingOptionsCount} elements
- **Media Upload:** ${gigCreationAnalysis.gigCreationFeatures.mediaUploadCount} upload fields
- **Description Fields:** ${gigCreationAnalysis.gigCreationFeatures.descriptionFieldsCount} text areas

**Form Functionality:**
- **Creation Forms:** ${gigCreationAnalysis.functionality.hasCreationForms ? '✅' : '❌'} (${gigCreationAnalysis.functionality.totalForms} total forms)
- **Input Elements:** ${gigCreationAnalysis.functionality.totalInputs}
- **Text Areas:** ${gigCreationAnalysis.functionality.totalTextareas}
- **Select Dropdowns:** ${gigCreationAnalysis.functionality.totalSelects}
- **Action Buttons:** ${gigCreationAnalysis.functionality.totalButtons}
- **File Upload:** ${gigCreationAnalysis.functionality.hasFileUpload ? '✅ Available' : '❌ Not Available'}

## 📋 Detailed Form Analysis

**Total Forms Found:** ${formAnalysis.totalForms}
**Gig Creation Forms:** ${formAnalysis.gigCreationForms.length}

**Field Types Distribution:**
${Object.entries(formAnalysis.fieldTypes).map(([type, count]) => `- ${type}: ${count}`).join('\n')}

**Required Fields:** ${formAnalysis.requiredFields.length}
${formAnalysis.requiredFields.length > 0 ? `
**Required Field Details:**
${formAnalysis.requiredFields.slice(0, 10).map(field => `- ${field.type} (${field.name || field.id || 'no name'}): ${field.placeholder || 'no placeholder'}`).join('\n')}
${formAnalysis.requiredFields.length > 10 ? `... and ${formAnalysis.requiredFields.length - 10} more required fields` : ''}
` : ''}

**Category Options:** ${formAnalysis.categories.length}
${formAnalysis.categories.length > 0 ? `
**Available Categories:**
${formAnalysis.categories.slice(0, 10).map(cat => `- ${cat.text} (value: ${cat.value})`).join('\n')}
${formAnalysis.categories.length > 10 ? `... and ${formAnalysis.categories.length - 10} more categories` : ''}
` : ''}

## 🎯 Gig Creation Workflow

${result.forms.length > 0 ? `
**Form Details:**
${result.forms.map((form, i) => `
### Form ${i + 1} ${form.isGigCreationForm ? '(Gig Creation Form)' : ''}
- **Action:** ${form.action || 'No action'}
- **Method:** ${form.method || 'No method'}
- **Encoding:** ${form.enctype || 'No encoding specified'}
- **Inputs:** ${form.inputs.length}
- **Text Areas:** ${form.textareas.length}
- **Selects:** ${form.selects.length}
- **Buttons:** ${form.buttons.length}
${form.buttons.length > 0 ? `- **Button Actions:** ${form.buttons.map(b => b.textContent).join(', ')}` : ''}
`).join('')}
` : '**No forms found on this page.**'}

## 🌐 Network Analysis

**Total Requests:** ${requestAnalysis.totalRequests}

**By Resource Type:**
${Object.entries(requestAnalysis.byResourceType).map(([type, count]) => `- ${type}: ${count}`).join('\n')}

**Gig Creation Specific Requests:** ${requestAnalysis.gigCreationSpecificRequests.length}

## 📊 Key Findings

1. **Access Method:** ${accessFlowAnalysis.devEnvironmentFirst ? 'Successfully used development environment as entry point' : 'Direct access attempted'}
2. **Content Accessibility:** ${gigCreationAnalysis.contentAccess === 'accessible' ? 'Gig creation interface is accessible' : 'Authentication required for gig creation'}
3. **Creation Features:** ${gigCreationAnalysis.gigCreationFeatures.totalFormFields > 0 ? 'Full creation interface available' : 'Limited creation functionality visible'}
4. **User Experience:** ${gigCreationAnalysis.functionality.hasCreationForms ? 'Interactive creation forms available' : 'No creation forms detected'}
5. **Media Support:** ${gigCreationAnalysis.functionality.hasFileUpload ? 'File upload functionality detected' : 'No file upload detected'}

## 📂 File Structure

\`\`\`
${this.baseDir}/
├── html/
│   └── gig_add_page.html
├── screenshots/
│   ├── 01_dev_environment.png
│   ├── 02_gig_add_page.png
│   └── gig_add_viewport.png
├── analysis/
│   ├── gig_creation_analysis.json
│   ├── access_flow_analysis.json
│   └── request_analysis.json
├── form_analysis/
│   └── detailed_form_analysis.json
├── gig_creation_data/
│   └── extracted_features.json
├── metadata/
│   └── complete_metadata.json
├── access_flow/
│   └── access_path.json
└── gig_creation_report.md
\`\`\`

## 🎯 Recommendations

${accessFlowAnalysis.authenticationRequired ? `
**Authentication Required:** To access gig creation functionality:
1. Complete phone verification through Login Pläza
2. Establish authenticated session
3. Re-scrape with authenticated access
4. Test gig creation workflow end-to-end
` : `
**Full Access Achieved:** Gig creation interface has been successfully captured.
`}

**Next Steps:**
1. ${gigCreationAnalysis.gigCreationFeatures.totalFormFields > 0 ? 'Analyze form field validation and requirements' : 'Investigate creation form requirements'}
2. ${gigCreationAnalysis.functionality.hasFileUpload ? 'Test media upload functionality' : 'Map media upload requirements'}
3. ${formAnalysis.categories.length > 0 ? 'Map complete category taxonomy for gigs' : 'Investigate category system'}
4. Test complete gig creation workflow (form submission → publication)

## 🔍 Marketplace Impact

This gig creation page is **critical for the CoomÜnity marketplace ecosystem** as it:
- Enables user-generated content (gigs)
- Facilitates marketplace growth
- Provides revenue generation opportunities
- Supports the creator economy within CoomÜnity

---

**Status:** ✅ **GIG CREATION ANALYSIS COMPLETE**

The CoomÜnity gig creation page has been analyzed using the recommended development environment access path.

**Access Strategy Confirmed:** Using \`dev.coomunity.co/merchant/a1598e94\` as entry point provides proper context for gig creation access.

**Critical for Marketplace:** This page enables the creation of new marketplace content, making it essential for platform growth.

**Last Updated:** ${result.timestamp}
`;

    fs.writeFileSync(`${this.baseDir}/gig_creation_report.md`, report, 'utf8');
    console.log('📄 Reporte de creación de gigs generado: gig_creation_report.md');
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
      const result = await this.scrapeGigAddPage();
      
      console.log('\n🎉 GIG CREATION SCRAPING COMPLETADO EXITOSAMENTE!');
      console.log(`📁 Resultados guardados en: ${this.baseDir}/`);
      console.log(`📊 URL analizada: ${result.url}`);
      console.log(`🛤️ Ruta de acceso: ${result.accessPath.join(' → ')}`);
      console.log(`📋 Tipo de página: ${result.metadata.isLoginPage ? 'Login requerido' : 'Contenido accesible'}`);
      console.log(`📝 Funciones de creación: ${result.metadata.hasGigCreationFeatures ? 'Disponibles' : 'Limitadas'}`);
      console.log(`📊 Campos de formulario: ${result.gigCreationFeatures.formFields.length}`);
      
    } catch (error) {
      console.error('💥 Error durante la ejecución del gig creation scraper:', error);
      throw error;
    } finally {
      await this.cleanup();
    }
  }
}

// Ejecutar el scraper
async function main() {
  const scraper = new CoomunityGigAddScraper();
  await scraper.run();
}

if (require.main === module) {
  main().catch(console.error);
}

export { CoomunityGigAddScraper }; 