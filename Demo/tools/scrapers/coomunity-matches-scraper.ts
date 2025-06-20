import { chromium, Browser, Page } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';

interface MatchScrapingResult {
  url: string;
  title: string;
  html: string;
  metadata: any;
  matchFeatures: {
    matchDetails: any;
    agreementInfo: any[];
    userProfiles: any[];
    communicationTools: any[];
    statusIndicators: any[];
  };
  forms: any[];
  accessPath: string[];
  timestamp: string;
}

class CoomunityMatchScraper {
  private browser: Browser | null = null;
  private baseDir: string;
  private devUrl: string;
  private targetUrl: string;
  
  constructor() {
    this.baseDir = './coomunity_matches';
    this.devUrl = 'https://dev.coomunity.co/merchant/a1598e94';
    this.targetUrl = 'https://coomunity.co/place/matches/view/38000e9aad777d56';
  }

  async initialize(): Promise<void> {
    console.log('🚀 Inicializando Coomunity Match System Scraper...');
    
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
      `${this.baseDir}/match_data`,
      `${this.baseDir}/access_flow`,
      `${this.baseDir}/agreement_analysis`
    ];

    dirs.forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`📁 Directorio creado: ${dir}`);
      }
    });
  }

  async scrapeMatchPage(): Promise<MatchScrapingResult> {
    if (!this.browser) {
      throw new Error('Browser no inicializado');
    }

    const page = await this.browser.newPage();
    const accessPath: string[] = [];
    
    console.log('🛤️ Iniciando flujo de acceso recomendado para matches...');
    
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
          hasMatchLinks: document.body.innerHTML.includes('matches') || 
                        document.body.innerHTML.includes('acuerdos'),
          hasMenuOptions: document.querySelectorAll('[class*="menu"]').length > 0,
          bodyText: document.body.textContent?.substring(0, 500) || ''
        };
      });

      console.log(`📋 Análisis del entorno dev:`, devPageAnalysis);

      // PASO 2: Navegar directamente a la URL del match específico
      console.log(`🤝 PASO 2: Navegando a la página del match específico...`);
      console.log(`🌐 Navegando a: ${this.targetUrl}`);
      
      await page.goto(this.targetUrl, { 
        waitUntil: 'networkidle',
        timeout: 30000 
      });

      accessPath.push(`match_direct: ${this.targetUrl}`);

      // Capturar estado de la página del match
      await page.screenshot({ 
        path: `${this.baseDir}/screenshots/02_match_page.png`,
        fullPage: true 
      });

      await page.screenshot({ 
        path: `${this.baseDir}/screenshots/match_viewport.png`,
        fullPage: false 
      });

      console.log('📄 Página de match cargada, analizando contenido...');

      // Esperar a que los elementos estén presentes
      await page.waitForTimeout(5000);

      // PASO 3: Análisis exhaustivo de la página del match
      const matchPageData = await page.evaluate(() => {
        // Extraer metadatos básicos
        const metaTags = Array.from(document.querySelectorAll('meta')).map(meta => ({
          name: meta.getAttribute('name'),
          property: meta.getAttribute('property'),
          content: meta.getAttribute('content'),
          charset: meta.getAttribute('charset')
        }));

        // Analizar funcionalidades específicas de matches
        const matchFeatures = {
          matchDetails: {
            matchId: window.location.pathname.split('/').pop() || 'unknown',
            title: document.querySelector('h1, [class*="title"], [class*="match"]')?.textContent?.trim() || 'No title found',
            description: document.querySelector('[class*="description"], [class*="detail"]')?.textContent?.trim() || 'No description found',
            status: document.querySelector('[class*="status"], [class*="estado"]')?.textContent?.trim() || 'No status found'
          },
          
          agreementInfo: Array.from(document.querySelectorAll('[class*="agreement"], [class*="acuerdo"], [class*="contract"]')).map(agreement => ({
            text: agreement.textContent?.trim() || '',
            className: agreement.className,
            id: agreement.id,
            tagName: agreement.tagName
          })),
          
          userProfiles: Array.from(document.querySelectorAll('[class*="profile"], [class*="user"], [class*="emprendedor"]')).map(profile => ({
            text: profile.textContent?.trim() || '',
            className: profile.className,
            id: profile.id,
            hasImage: profile.querySelector('img') !== null
          })),
          
          communicationTools: Array.from(document.querySelectorAll('[class*="chat"], [class*="message"], [class*="contact"]')).map(comm => ({
            text: comm.textContent?.trim() || '',
            className: comm.className,
            id: comm.id,
            type: comm.tagName.toLowerCase()
          })),
          
          statusIndicators: Array.from(document.querySelectorAll('[class*="status"], [class*="badge"], [class*="indicator"]')).map(status => ({
            text: status.textContent?.trim() || '',
            className: status.className,
            id: status.id
          }))
        };

        // Extraer formularios específicos de matches
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
            className: textarea.className
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
            buttons: buttons,
            isMatchRelated: form.innerHTML.includes('match') || 
                           form.innerHTML.includes('acuerdo') ||
                           form.innerHTML.includes('agreement') ||
                           form.action?.includes('match')
          };
        });

        // Detectar el tipo de página que obtuvimos
        const bodyText = document.body.textContent || '';
        const isLoginPage = document.querySelector('input[type="tel"]') !== null ||
                           document.querySelector('.intl-tel-input') !== null ||
                           bodyText.includes('Login Pläza');

        const isMatchContent = bodyText.includes('match') || 
                              bodyText.includes('acuerdo') ||
                              bodyText.includes('agreement') ||
                              bodyText.includes('emprendedor') ||
                              bodyText.includes('38000e9aad777d56');

        const hasMatchFeatures = matchFeatures.matchDetails.title !== 'No title found' ||
                                matchFeatures.agreementInfo.length > 0 ||
                                matchFeatures.userProfiles.length > 0;

        return {
          title: document.title,
          metaTags,
          matchFeatures,
          forms,
          isLoginPage,
          isMatchContent,
          hasMatchFeatures,
          bodyHTML: document.body.innerHTML,
          headHTML: document.head.innerHTML,
          url: window.location.href,
          pathname: window.location.pathname,
          fullText: bodyText.substring(0, 2000), // Primeros 2000 caracteres
          elementCounts: {
            forms: document.querySelectorAll('form').length,
            inputs: document.querySelectorAll('input').length,
            textareas: document.querySelectorAll('textarea').length,
            buttons: document.querySelectorAll('button').length,
            images: document.querySelectorAll('img').length,
            links: document.querySelectorAll('a').length
          }
        };
      });

      // Guardar HTML completo
      const fullHTML = await page.content();
      fs.writeFileSync(
        `${this.baseDir}/html/match_page.html`,
        fullHTML,
        'utf8'
      );

      // Determinar el tipo de página que obtuvimos
      const pageType = matchPageData.isLoginPage ? 'login' : 
                      matchPageData.hasMatchFeatures ? 'match_details' :
                      matchPageData.isMatchContent ? 'match_public' : 'unknown';

      console.log(`📋 Tipo de página detectado: ${pageType}`);
      console.log(`📄 Título: ${matchPageData.title}`);
      console.log(`🔒 ¿Es login?: ${matchPageData.isLoginPage}`);
      console.log(`🤝 ¿Tiene contenido de match?: ${matchPageData.isMatchContent}`);
      console.log(`🎯 ¿Tiene funciones de match?: ${matchPageData.hasMatchFeatures}`);
      console.log(`📊 Elementos encontrados:`, matchPageData.elementCounts);

      // Crear resultado
      const result: MatchScrapingResult = {
        url: this.targetUrl,
        title: matchPageData.title,
        html: fullHTML,
        metadata: matchPageData,
        matchFeatures: matchPageData.matchFeatures,
        forms: matchPageData.forms,
        accessPath: accessPath,
        timestamp: new Date().toISOString()
      };

      // Guardar análisis detallado
      await this.saveAnalysis(result, interceptedRequests, pageType, devPageAnalysis);

      console.log('✅ Scraping de match completado exitosamente');
      return result;

    } catch (error) {
      console.error('❌ Error durante el scraping de match:', error);
      throw error;
    } finally {
      await page.close();
    }
  }

  private async saveAnalysis(
    result: MatchScrapingResult, 
    requests: any[], 
    pageType: string,
    devAnalysis: any
  ): Promise<void> {
    // Análisis específico del match
    const matchAnalysis = {
      pageType,
      accessMethod: 'dev_environment_first',
      matchFeatures: {
        hasMatchDetails: result.matchFeatures.matchDetails.title !== 'No title found',
        agreementInfoCount: result.matchFeatures.agreementInfo.length,
        userProfilesCount: result.matchFeatures.userProfiles.length,
        communicationToolsCount: result.matchFeatures.communicationTools.length,
        statusIndicatorsCount: result.matchFeatures.statusIndicators.length
      },
      matchId: result.matchFeatures.matchDetails.matchId,
      functionality: {
        hasMatchForms: result.forms.filter(f => f.isMatchRelated).length > 0,
        totalForms: result.forms.length,
        totalInputs: result.metadata.elementCounts.inputs,
        totalButtons: result.metadata.elementCounts.buttons,
        hasImages: result.metadata.elementCounts.images > 0
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
      matchSpecificRequests: requests.filter(req => 
        req.url.includes('matches') || 
        req.url.includes('match') ||
        req.url.includes('agreement') ||
        req.url.includes('38000e9aad777d56')
      )
    };

    // Análisis detallado de acuerdos
    const agreementAnalysis = {
      matchId: result.matchFeatures.matchDetails.matchId,
      matchDetails: result.matchFeatures.matchDetails,
      agreementElements: result.matchFeatures.agreementInfo,
      userProfiles: result.matchFeatures.userProfiles,
      communicationAvailable: result.matchFeatures.communicationTools.length > 0,
      statusTracking: result.matchFeatures.statusIndicators
    };

    // Guardar análisis
    fs.writeFileSync(
      `${this.baseDir}/analysis/match_analysis.json`,
      JSON.stringify(matchAnalysis, null, 2),
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
      `${this.baseDir}/agreement_analysis/detailed_agreement_analysis.json`,
      JSON.stringify(agreementAnalysis, null, 2),
      'utf8'
    );

    fs.writeFileSync(
      `${this.baseDir}/match_data/extracted_features.json`,
      JSON.stringify(result.matchFeatures, null, 2),
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
    await this.generateReport(result, matchAnalysis, accessFlowAnalysis, requestAnalysis, agreementAnalysis, devAnalysis);
  }

  private async generateReport(
    result: MatchScrapingResult, 
    matchAnalysis: any, 
    accessFlowAnalysis: any,
    requestAnalysis: any,
    agreementAnalysis: any,
    devAnalysis: any
  ): Promise<void> {
    const report = `# CoomÜnity Match System Analysis Report

**Generated:** ${result.timestamp}
**Target URL:** ${result.url}
**Match ID:** ${agreementAnalysis.matchId}
**Access Method:** Development Environment First
**Final Page Type:** ${matchAnalysis.pageType}

## Executive Summary

This report documents the analysis of a specific CoomÜnity match page (\`/place/matches/view/${agreementAnalysis.matchId}\`), accessed through the recommended development environment path. This page represents the match/agreement system between users and entrepreneurs in the marketplace.

## 🛤️ Access Flow Analysis

**Recommended Path Followed:**
1. **Dev Environment:** \`${accessFlowAnalysis.devAnalysis.url}\`
2. **Match Page:** \`${result.url}\`

**Dev Environment Analysis:**
- **Title:** ${accessFlowAnalysis.devAnalysis.title}
- **Has Login Form:** ${accessFlowAnalysis.devAnalysis.hasLoginForm ? 'Yes' : 'No'}
- **Has Match Links:** ${accessFlowAnalysis.devAnalysis.hasMatchLinks ? 'Yes' : 'No'}
- **Menu Options:** ${accessFlowAnalysis.devAnalysis.hasMenuOptions ? 'Yes' : 'No'}

## 🔒 Authentication & Access

- **Requires Authentication:** ${accessFlowAnalysis.authenticationRequired ? 'Yes' : 'No'}
- **Access Level:** ${matchAnalysis.contentAccess}
- **Page Type:** ${matchAnalysis.pageType}

## 🤝 Match Features Analysis

**Core Match Elements:**
- **Match Details:** ${matchAnalysis.matchFeatures.hasMatchDetails ? '✅' : '❌'} - "${agreementAnalysis.matchDetails.title}"
- **Agreement Info:** ${matchAnalysis.matchFeatures.agreementInfoCount} elements found
- **User Profiles:** ${matchAnalysis.matchFeatures.userProfilesCount} profiles detected
- **Communication Tools:** ${matchAnalysis.matchFeatures.communicationToolsCount} tools available
- **Status Indicators:** ${matchAnalysis.matchFeatures.statusIndicatorsCount} status elements

**Match Functionality:**
- **Match-Related Forms:** ${matchAnalysis.functionality.hasMatchForms ? '✅' : '❌'} (${matchAnalysis.functionality.totalForms} total forms)
- **Input Elements:** ${matchAnalysis.functionality.totalInputs}
- **Action Buttons:** ${matchAnalysis.functionality.totalButtons}
- **Images/Media:** ${matchAnalysis.functionality.hasImages ? '✅' : '❌'} (${result.metadata.elementCounts.images} images)

## 📋 Match Details

**Match Information:**
- **Match ID:** ${agreementAnalysis.matchId}
- **Title:** ${agreementAnalysis.matchDetails.title}
- **Description:** ${agreementAnalysis.matchDetails.description !== 'No description found' ? agreementAnalysis.matchDetails.description : 'No description available'}
- **Status:** ${agreementAnalysis.matchDetails.status}

${agreementAnalysis.agreementElements.length > 0 ? `
**Agreement Elements Found:**
${agreementAnalysis.agreementElements.slice(0, 5).map(agreement => `- ${agreement.text || 'No text'} (${agreement.tagName})`).join('\n')}
${agreementAnalysis.agreementElements.length > 5 ? `... and ${agreementAnalysis.agreementElements.length - 5} more agreement elements` : ''}
` : ''}

${agreementAnalysis.userProfiles.length > 0 ? `
**User Profiles Detected:**
${agreementAnalysis.userProfiles.slice(0, 3).map(profile => `- ${profile.text || 'No text'} ${profile.hasImage ? '(with image)' : '(no image)'}`).join('\n')}
${agreementAnalysis.userProfiles.length > 3 ? `... and ${agreementAnalysis.userProfiles.length - 3} more profiles` : ''}
` : ''}

## 🎯 Agreement Workflow

${result.forms.length > 0 ? `
**Form Details:**
${result.forms.map((form, i) => `
### Form ${i + 1} ${form.isMatchRelated ? '(Match-Related)' : ''}
- **Action:** ${form.action || 'No action'}
- **Method:** ${form.method || 'No method'}
- **Encoding:** ${form.enctype || 'No encoding specified'}
- **Inputs:** ${form.inputs.length}
- **Text Areas:** ${form.textareas.length}
- **Buttons:** ${form.buttons.length}
${form.buttons.length > 0 ? `- **Button Actions:** ${form.buttons.map(b => b.textContent).join(', ')}` : ''}
`).join('')}
` : '**No forms found on this page.**'}

## 💬 Communication & Status

**Communication Tools:** ${agreementAnalysis.communicationAvailable ? 'Available' : 'Not detected'}
${agreementAnalysis.communicationAvailable ? `
- ${result.matchFeatures.communicationTools.length} communication elements found
` : ''}

**Status Tracking:** ${agreementAnalysis.statusTracking.length > 0 ? 'Available' : 'Not detected'}
${agreementAnalysis.statusTracking.length > 0 ? `
**Status Elements:**
${agreementAnalysis.statusTracking.slice(0, 3).map(status => `- ${status.text || 'No text'}`).join('\n')}
` : ''}

## 🌐 Network Analysis

**Total Requests:** ${requestAnalysis.totalRequests}

**By Resource Type:**
${Object.entries(requestAnalysis.byResourceType).map(([type, count]) => `- ${type}: ${count}`).join('\n')}

**Match-Specific Requests:** ${requestAnalysis.matchSpecificRequests.length}

## 📊 Key Findings

1. **Access Method:** ${accessFlowAnalysis.devEnvironmentFirst ? 'Successfully used development environment as entry point' : 'Direct access attempted'}
2. **Content Accessibility:** ${matchAnalysis.contentAccess === 'accessible' ? 'Match content is accessible' : 'Authentication required for match access'}
3. **Match Features:** ${matchAnalysis.matchFeatures.hasMatchDetails ? 'Match details are available' : 'Limited match information visible'}
4. **User Experience:** ${matchAnalysis.functionality.hasMatchForms ? 'Interactive match features available' : 'Read-only match view'}
5. **System Integration:** ${agreementAnalysis.communicationAvailable ? 'Communication tools integrated' : 'Basic match display only'}

## 📂 File Structure

\`\`\`
${this.baseDir}/
├── html/
│   └── match_page.html
├── screenshots/
│   ├── 01_dev_environment.png
│   ├── 02_match_page.png
│   └── match_viewport.png
├── analysis/
│   ├── match_analysis.json
│   ├── access_flow_analysis.json
│   └── request_analysis.json
├── agreement_analysis/
│   └── detailed_agreement_analysis.json
├── match_data/
│   └── extracted_features.json
├── metadata/
│   └── complete_metadata.json
├── access_flow/
│   └── access_path.json
└── match_report.md
\`\`\`

## 🎯 Recommendations

${accessFlowAnalysis.authenticationRequired ? `
**Authentication Required:** To access full match functionality:
1. Complete phone verification through Login Pläza
2. Establish authenticated session
3. Re-scrape with authenticated access
4. Test match interaction workflow
` : `
**Full Access Achieved:** Match content has been successfully captured.
`}

**Next Steps:**
1. ${matchAnalysis.matchFeatures.hasMatchDetails ? 'Analyze match interaction patterns' : 'Investigate match detail requirements'}
2. ${agreementAnalysis.communicationAvailable ? 'Test communication features' : 'Map communication system requirements'}
3. ${agreementAnalysis.statusTracking.length > 0 ? 'Track agreement status workflows' : 'Investigate status tracking system'}
4. Map complete match/agreement lifecycle

## 🔍 Marketplace Impact

This match system is **critical for the CoomÜnity marketplace ecosystem** as it:
- Facilitates connections between users and entrepreneurs
- Manages commercial agreements and contracts
- Provides communication channels for business deals
- Tracks the status of marketplace transactions

---

**Status:** ✅ **MATCH ANALYSIS COMPLETE**

The CoomÜnity match page (ID: ${agreementAnalysis.matchId}) has been analyzed using the recommended development environment access path.

**Access Strategy Confirmed:** Using \`dev.coomunity.co/merchant/a1598e94\` as entry point provides proper context for match system access.

**Critical for Marketplace:** This page represents the core agreement/connection system that drives commercial interactions within CoomÜnity.

**Last Updated:** ${result.timestamp}
`;

    fs.writeFileSync(`${this.baseDir}/match_report.md`, report, 'utf8');
    console.log('📄 Reporte de match generado: match_report.md');
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
      const result = await this.scrapeMatchPage();
      
      console.log('\n🎉 MATCH SCRAPING COMPLETADO EXITOSAMENTE!');
      console.log(`📁 Resultados guardados en: ${this.baseDir}/`);
      console.log(`📊 URL analizada: ${result.url}`);
      console.log(`🛤️ Ruta de acceso: ${result.accessPath.join(' → ')}`);
      console.log(`📋 Tipo de página: ${result.metadata.isLoginPage ? 'Login requerido' : 'Contenido accesible'}`);
      console.log(`🤝 Match ID: ${result.matchFeatures.matchDetails.matchId}`);
      console.log(`🎯 Funciones de match: ${result.metadata.hasMatchFeatures ? 'Disponibles' : 'Limitadas'}`);
      
    } catch (error) {
      console.error('💥 Error durante la ejecución del match scraper:', error);
      throw error;
    } finally {
      await this.cleanup();
    }
  }
}

// Ejecutar el scraper
async function main() {
  const scraper = new CoomunityMatchScraper();
  await scraper.run();
}

if (require.main === module) {
  main().catch(console.error);
}

export { CoomunityMatchScraper }; 