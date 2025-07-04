import { chromium, Browser, Page } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';

interface MatchEditScrapingResult {
  url: string;
  title: string;
  html: string;
  metadata: any;
  editFeatures: {
    editForms: any[];
    editableFields: any[];
    statusOptions: any[];
    saveActions: any[];
    matchManagement: any;
  };
  forms: any[];
  accessPath: string[];
  timestamp: string;
}

class CoomunityMatchEditScraper {
  private browser: Browser | null = null;
  private baseDir: string;
  private devUrl: string;
  private targetUrl: string;
  
  constructor() {
    this.baseDir = './coomunity_match_edit';
    this.devUrl = 'https://dev.coomunity.co/merchant/a1598e94';
    this.targetUrl = 'https://coomunity.co/place/matches/edit/38000e9aad777d56';
  }

  async initialize(): Promise<void> {
    console.log('🚀 Inicializando Coomunity Match Edit System Scraper...');
    
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
      `${this.baseDir}/edit_data`,
      `${this.baseDir}/access_flow`,
      `${this.baseDir}/management_analysis`
    ];

    dirs.forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`📁 Directorio creado: ${dir}`);
      }
    });
  }

  async scrapeMatchEditPage(): Promise<MatchEditScrapingResult> {
    if (!this.browser) {
      throw new Error('Browser no inicializado');
    }

    const page = await this.browser.newPage();
    const accessPath: string[] = [];
    
    console.log('🛤️ Iniciando flujo de acceso recomendado para edición de matches...');
    
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
          hasEditLinks: document.body.innerHTML.includes('edit') || 
                       document.body.innerHTML.includes('editar'),
          hasMenuOptions: document.querySelectorAll('[class*="menu"]').length > 0,
          bodyText: document.body.textContent?.substring(0, 500) || ''
        };
      });

      console.log(`📋 Análisis del entorno dev:`, devPageAnalysis);

      // PASO 2: Navegar directamente a la URL de edición del match específico
      console.log(`✏️ PASO 2: Navegando a la página de edición del match específico...`);
      console.log(`🌐 Navegando a: ${this.targetUrl}`);
      
      await page.goto(this.targetUrl, { 
        waitUntil: 'networkidle',
        timeout: 30000 
      });

      accessPath.push(`match_edit_direct: ${this.targetUrl}`);

      // Capturar estado de la página de edición
      await page.screenshot({ 
        path: `${this.baseDir}/screenshots/02_match_edit_page.png`,
        fullPage: true 
      });

      await page.screenshot({ 
        path: `${this.baseDir}/screenshots/match_edit_viewport.png`,
        fullPage: false 
      });

      console.log('📄 Página de edición de match cargada, analizando contenido...');

      // Esperar a que los elementos estén presentes
      await page.waitForTimeout(5000);

      // PASO 3: Análisis exhaustivo de la página de edición de match
      const matchEditPageData = await page.evaluate(() => {
        // Extraer metadatos básicos
        const metaTags = Array.from(document.querySelectorAll('meta')).map(meta => ({
          name: meta.getAttribute('name'),
          property: meta.getAttribute('property'),
          content: meta.getAttribute('content'),
          charset: meta.getAttribute('charset')
        }));

        // Analizar funcionalidades específicas de edición de matches
        const editFeatures = {
          editForms: Array.from(document.querySelectorAll('form, [class*="edit"], [class*="form"]')).map(form => ({
            tagName: form.tagName,
            className: form.className,
            id: form.id,
            action: form.getAttribute('action'),
            method: form.getAttribute('method'),
            hasInputs: form.querySelectorAll('input').length > 0,
            hasTextareas: form.querySelectorAll('textarea').length > 0,
            hasSelects: form.querySelectorAll('select').length > 0
          })),
          
          editableFields: Array.from(document.querySelectorAll('input, textarea, select, [contenteditable]')).map(field => ({
            type: (field as HTMLInputElement).type || field.tagName.toLowerCase(),
            name: field.getAttribute('name'),
            id: field.id,
            placeholder: (field as HTMLInputElement).placeholder,
            value: (field as HTMLInputElement).value,
            required: (field as HTMLInputElement).required,
            className: field.className,
            isContentEditable: field.getAttribute('contenteditable') === 'true'
          })),
          
          statusOptions: Array.from(document.querySelectorAll('select option, [class*="status"], [class*="estado"]')).map(option => ({
            value: (option as HTMLOptionElement).value,
            text: option.textContent?.trim() || '',
            selected: (option as HTMLOptionElement).selected,
            className: option.className
          })),
          
          saveActions: Array.from(document.querySelectorAll('button, [class*="save"], [class*="guardar"], [class*="submit"]')).map(action => ({
            text: action.textContent?.trim() || '',
            className: action.className,
            id: action.id,
            type: (action as HTMLButtonElement).type,
            tagName: action.tagName
          })),
          
          matchManagement: {
            matchId: window.location.pathname.split('/').pop() || 'unknown',
            hasDeleteOption: document.querySelector('[class*="delete"], [class*="eliminar"], [class*="remove"]') !== null,
            hasCancelOption: document.querySelector('[class*="cancel"], [class*="cancelar"]') !== null,
            hasBackToMatch: document.querySelector('[href*="matches"], [class*="back"]') !== null,
            editContext: document.querySelector('[class*="edit"], [class*="form"]')?.textContent?.trim() || 'No context found'
          }
        };

        // Extraer formularios específicos de edición
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
            value: textarea.value,
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
            isEditForm: form.innerHTML.includes('edit') || 
                       form.innerHTML.includes('editar') ||
                       form.innerHTML.includes('update') ||
                       form.action?.includes('edit') ||
                       inputs.some(input => input.name?.includes('edit') || input.id?.includes('edit'))
          };
        });

        // Detectar el tipo de página que obtuvimos
        const bodyText = document.body.textContent || '';
        const isLoginPage = document.querySelector('input[type="tel"]') !== null ||
                           document.querySelector('.intl-tel-input') !== null ||
                           bodyText.includes('Login Pläza');

        const isEditContent = bodyText.includes('edit') || 
                             bodyText.includes('editar') ||
                             bodyText.includes('modificar') ||
                             bodyText.includes('actualizar') ||
                             bodyText.includes('38000e9aad777d56');

        const hasEditFeatures = editFeatures.editableFields.length > 0 ||
                               editFeatures.editForms.length > 0 ||
                               editFeatures.saveActions.length > 0;

        return {
          title: document.title,
          metaTags,
          editFeatures,
          forms,
          isLoginPage,
          isEditContent,
          hasEditFeatures,
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
            images: document.querySelectorAll('img').length,
            links: document.querySelectorAll('a').length
          }
        };
      });

      // Guardar HTML completo
      const fullHTML = await page.content();
      fs.writeFileSync(
        `${this.baseDir}/html/match_edit_page.html`,
        fullHTML,
        'utf8'
      );

      // Determinar el tipo de página que obtuvimos
      const pageType = matchEditPageData.isLoginPage ? 'login' : 
                      matchEditPageData.hasEditFeatures ? 'match_edit' :
                      matchEditPageData.isEditContent ? 'edit_public' : 'unknown';

      console.log(`📋 Tipo de página detectado: ${pageType}`);
      console.log(`📄 Título: ${matchEditPageData.title}`);
      console.log(`🔒 ¿Es login?: ${matchEditPageData.isLoginPage}`);
      console.log(`✏️ ¿Tiene contenido de edición?: ${matchEditPageData.isEditContent}`);
      console.log(`🎯 ¿Tiene funciones de edición?: ${matchEditPageData.hasEditFeatures}`);
      console.log(`📊 Elementos encontrados:`, matchEditPageData.elementCounts);

      // Crear resultado
      const result: MatchEditScrapingResult = {
        url: this.targetUrl,
        title: matchEditPageData.title,
        html: fullHTML,
        metadata: matchEditPageData,
        editFeatures: matchEditPageData.editFeatures,
        forms: matchEditPageData.forms,
        accessPath: accessPath,
        timestamp: new Date().toISOString()
      };

      // Guardar análisis detallado
      await this.saveAnalysis(result, interceptedRequests, pageType, devPageAnalysis);

      console.log('✅ Scraping de edición de match completado exitosamente');
      return result;

    } catch (error) {
      console.error('❌ Error durante el scraping de edición de match:', error);
      throw error;
    } finally {
      await page.close();
    }
  }

  private async saveAnalysis(
    result: MatchEditScrapingResult, 
    requests: any[], 
    pageType: string,
    devAnalysis: any
  ): Promise<void> {
    // Análisis específico de edición de match
    const editAnalysis = {
      pageType,
      accessMethod: 'dev_environment_first',
      editFeatures: {
        hasEditForms: result.editFeatures.editForms.length > 0,
        editableFieldsCount: result.editFeatures.editableFields.length,
        statusOptionsCount: result.editFeatures.statusOptions.length,
        saveActionsCount: result.editFeatures.saveActions.length,
        hasMatchManagement: result.editFeatures.matchManagement.matchId !== 'unknown'
      },
      matchId: result.editFeatures.matchManagement.matchId,
      functionality: {
        hasEditForms: result.forms.filter(f => f.isEditForm).length > 0,
        totalForms: result.forms.length,
        totalInputs: result.metadata.elementCounts.inputs,
        totalTextareas: result.metadata.elementCounts.textareas,
        totalSelects: result.metadata.elementCounts.selects,
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
      editSpecificRequests: requests.filter(req => 
        req.url.includes('edit') || 
        req.url.includes('matches') ||
        req.url.includes('update') ||
        req.url.includes('38000e9aad777d56')
      )
    };

    // Análisis detallado de gestión
    const managementAnalysis = {
      matchId: result.editFeatures.matchManagement.matchId,
      editForms: result.editFeatures.editForms,
      editableFields: result.editFeatures.editableFields,
      statusOptions: result.editFeatures.statusOptions,
      saveActions: result.editFeatures.saveActions,
      matchManagement: result.editFeatures.matchManagement
    };

    // Guardar análisis
    fs.writeFileSync(
      `${this.baseDir}/analysis/edit_analysis.json`,
      JSON.stringify(editAnalysis, null, 2),
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
      `${this.baseDir}/management_analysis/detailed_management_analysis.json`,
      JSON.stringify(managementAnalysis, null, 2),
      'utf8'
    );

    fs.writeFileSync(
      `${this.baseDir}/edit_data/extracted_features.json`,
      JSON.stringify(result.editFeatures, null, 2),
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
    await this.generateReport(result, editAnalysis, accessFlowAnalysis, requestAnalysis, managementAnalysis, devAnalysis);
  }

  private async generateReport(
    result: MatchEditScrapingResult, 
    editAnalysis: any, 
    accessFlowAnalysis: any,
    requestAnalysis: any,
    managementAnalysis: any,
    devAnalysis: any
  ): Promise<void> {
    const report = `# CoomÜnity Match Edit System Analysis Report

**Generated:** ${result.timestamp}
**Target URL:** ${result.url}
**Match ID:** ${managementAnalysis.matchId}
**Access Method:** Development Environment First
**Final Page Type:** ${editAnalysis.pageType}

## Executive Summary

This report documents the analysis of the CoomÜnity match edit page (\`/place/matches/edit/${managementAnalysis.matchId}\`), accessed through the recommended development environment path. This page represents the match editing/management system for modifying existing agreements in the marketplace.

## 🛤️ Access Flow Analysis

**Recommended Path Followed:**
1. **Dev Environment:** \`${accessFlowAnalysis.devAnalysis.url}\`
2. **Match Edit Page:** \`${result.url}\`

**Dev Environment Analysis:**
- **Title:** ${accessFlowAnalysis.devAnalysis.title}
- **Has Login Form:** ${accessFlowAnalysis.devAnalysis.hasLoginForm ? 'Yes' : 'No'}
- **Has Edit Links:** ${accessFlowAnalysis.devAnalysis.hasEditLinks ? 'Yes' : 'No'}
- **Menu Options:** ${accessFlowAnalysis.devAnalysis.hasMenuOptions ? 'Yes' : 'No'}

## 🔒 Authentication & Access

- **Requires Authentication:** ${accessFlowAnalysis.authenticationRequired ? 'Yes' : 'No'}
- **Access Level:** ${editAnalysis.contentAccess}
- **Page Type:** ${editAnalysis.pageType}

## ✏️ Match Edit Features Analysis

**Core Edit Elements:**
- **Edit Forms:** ${editAnalysis.editFeatures.hasEditForms ? '✅' : '❌'} (${editAnalysis.editFeatures.editableFieldsCount} editable fields)
- **Status Options:** ${editAnalysis.editFeatures.statusOptionsCount} status options found
- **Save Actions:** ${editAnalysis.editFeatures.saveActionsCount} save/submit actions
- **Match Management:** ${editAnalysis.editFeatures.hasMatchManagement ? '✅' : '❌'} - ID: ${managementAnalysis.matchId}

**Edit Functionality:**
- **Edit Forms:** ${editAnalysis.functionality.hasEditForms ? '✅' : '❌'} (${editAnalysis.functionality.totalForms} total forms)
- **Input Elements:** ${editAnalysis.functionality.totalInputs}
- **Text Areas:** ${editAnalysis.functionality.totalTextareas}
- **Select Dropdowns:** ${editAnalysis.functionality.totalSelects}
- **Action Buttons:** ${editAnalysis.functionality.totalButtons}
- **Images/Media:** ${editAnalysis.functionality.hasImages ? '✅' : '❌'} (${result.metadata.elementCounts.images} images)

## 📝 Editable Fields Analysis

**Total Editable Fields:** ${managementAnalysis.editableFields.length}
${managementAnalysis.editableFields.length > 0 ? `
**Field Types:**
${managementAnalysis.editableFields.slice(0, 10).map(field => `- **${field.type}** (${field.name || field.id || 'no name'}): ${field.placeholder || 'no placeholder'}`).join('\n')}
${managementAnalysis.editableFields.length > 10 ? `... and ${managementAnalysis.editableFields.length - 10} more editable fields` : ''}
` : '**No editable fields found.**'}

## 📊 Status Management

**Status Options:** ${managementAnalysis.statusOptions.length}
${managementAnalysis.statusOptions.length > 0 ? `
**Available Status Options:**
${managementAnalysis.statusOptions.slice(0, 8).map(status => `- ${status.text || 'No text'} (value: ${status.value})`).join('\n')}
${managementAnalysis.statusOptions.length > 8 ? `... and ${managementAnalysis.statusOptions.length - 8} more status options` : ''}
` : '**No status options detected.**'}

## 🤝 Match Management

**Management Details:**
- **Match ID:** ${managementAnalysis.matchId}
- **Delete Option:** ${managementAnalysis.matchManagement.hasDeleteOption ? '✅ Available' : '❌ Not found'}
- **Cancel Option:** ${managementAnalysis.matchManagement.hasCancelOption ? '✅ Available' : '❌ Not found'}
- **Back to Match:** ${managementAnalysis.matchManagement.hasBackToMatch ? '✅ Available' : '❌ Not found'}
- **Edit Context:** ${managementAnalysis.matchManagement.editContext}

## 🎯 Edit Workflow

${result.forms.length > 0 ? `
**Form Details:**
${result.forms.map((form, i) => `
### Form ${i + 1} ${form.isEditForm ? '(Edit Form)' : ''}
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

## 💾 Save Actions

**Save/Submit Actions:** ${managementAnalysis.saveActions.length}
${managementAnalysis.saveActions.length > 0 ? `
**Action Types:**
${managementAnalysis.saveActions.slice(0, 6).map(action => `- ${action.text || 'No text'} (${action.tagName.toLowerCase()})`).join('\n')}
${managementAnalysis.saveActions.length > 6 ? `... and ${managementAnalysis.saveActions.length - 6} more save actions` : ''}
` : '**No save actions detected.**'}

## 🌐 Network Analysis

**Total Requests:** ${requestAnalysis.totalRequests}

**By Resource Type:**
${Object.entries(requestAnalysis.byResourceType).map(([type, count]) => `- ${type}: ${count}`).join('\n')}

**Edit-Specific Requests:** ${requestAnalysis.editSpecificRequests.length}

## 📊 Key Findings

1. **Access Method:** ${accessFlowAnalysis.devEnvironmentFirst ? 'Successfully used development environment as entry point' : 'Direct access attempted'}
2. **Content Accessibility:** ${editAnalysis.contentAccess === 'accessible' ? 'Match edit content is accessible' : 'Authentication required for edit access'}
3. **Edit Features:** ${editAnalysis.editFeatures.hasEditForms ? 'Interactive edit interface available' : 'Limited edit functionality visible'}
4. **User Experience:** ${editAnalysis.functionality.hasEditForms ? 'Interactive edit features available' : 'Read-only edit view'}
5. **System Integration:** ${editAnalysis.editFeatures.hasMatchManagement ? 'Connected to match management system' : 'Standalone edit system'}

## 📂 File Structure

\`\`\`
${this.baseDir}/
├── html/
│   └── match_edit_page.html
├── screenshots/
│   ├── 01_dev_environment.png
│   ├── 02_match_edit_page.png
│   └── match_edit_viewport.png
├── analysis/
│   ├── edit_analysis.json
│   ├── access_flow_analysis.json
│   └── request_analysis.json
├── management_analysis/
│   └── detailed_management_analysis.json
├── edit_data/
│   └── extracted_features.json
├── metadata/
│   └── complete_metadata.json
├── access_flow/
│   └── access_path.json
└── match_edit_report.md
\`\`\`

## 🎯 Recommendations

${accessFlowAnalysis.authenticationRequired ? `
**Authentication Required:** To access full edit functionality:
1. Complete phone verification through Login Pläza
2. Establish authenticated session
3. Re-scrape with authenticated access
4. Test match edit workflow
` : `
**Full Access Achieved:** Match edit content has been successfully captured.
`}

**Next Steps:**
1. ${editAnalysis.editFeatures.hasEditForms ? 'Test match editing and update functionality' : 'Investigate edit interface requirements'}
2. ${managementAnalysis.statusOptions.length > 0 ? 'Analyze status change workflows' : 'Map status management requirements'}
3. ${editAnalysis.editFeatures.hasMatchManagement ? 'Test complete match management lifecycle' : 'Investigate match management system'}
4. Map complete edit workflow from modification to save

## 🔍 Marketplace Impact

This match edit system is **critical for the CoomÜnity marketplace ecosystem** as it:
- Enables modification of existing match agreements
- Provides status management for match lifecycle
- Facilitates agreement updates and renegotiation
- Supports dynamic marketplace relationship management

---

**Status:** ✅ **MATCH EDIT ANALYSIS COMPLETE**

The CoomÜnity match edit page (Match ID: ${managementAnalysis.matchId}) has been analyzed using the recommended development environment access path.

**Access Strategy Confirmed:** Using \`dev.coomunity.co/merchant/a1598e94\` as entry point provides proper context for match edit system access.

**Critical for Marketplace:** This page represents the core match management infrastructure that enables dynamic agreement modification within CoomÜnity.

**Last Updated:** ${result.timestamp}
`;

    fs.writeFileSync(`${this.baseDir}/match_edit_report.md`, report, 'utf8');
    console.log('📄 Reporte de edición de match generado: match_edit_report.md');
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
      const result = await this.scrapeMatchEditPage();
      
      console.log('\n🎉 MATCH EDIT SCRAPING COMPLETADO EXITOSAMENTE!');
      console.log(`📁 Resultados guardados en: ${this.baseDir}/`);
      console.log(`📊 URL analizada: ${result.url}`);
      console.log(`🛤️ Ruta de acceso: ${result.accessPath.join(' → ')}`);
      console.log(`📋 Tipo de página: ${result.metadata.isLoginPage ? 'Login requerido' : 'Contenido accesible'}`);
      console.log(`✏️ Match ID: ${result.editFeatures.matchManagement.matchId}`);
      console.log(`🎯 Funciones de edición: ${result.metadata.hasEditFeatures ? 'Disponibles' : 'Limitadas'}`);
      
    } catch (error) {
      console.error('💥 Error durante la ejecución del match edit scraper:', error);
      throw error;
    } finally {
      await this.cleanup();
    }
  }
}

// Ejecutar el scraper
async function main() {
  const scraper = new CoomunityMatchEditScraper();
  await scraper.run();
}

if (require.main === module) {
  main().catch(console.error);
}

export { CoomunityMatchEditScraper }; 