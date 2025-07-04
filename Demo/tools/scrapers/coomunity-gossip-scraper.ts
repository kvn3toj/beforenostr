import { chromium, Browser, Page } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';

interface GossipScrapingResult {
  url: string;
  title: string;
  html: string;
  metadata: any;
  gossipFeatures: {
    communicationTools: any[];
    chatInterface: any;
    messageElements: any[];
    userInteractions: any[];
    matchConnection: any;
  };
  forms: any[];
  accessPath: string[];
  timestamp: string;
}

class CoomunityGossipScraper {
  private browser: Browser | null = null;
  private baseDir: string;
  private devUrl: string;
  private targetUrl: string;
  
  constructor() {
    this.baseDir = './coomunity_gossip';
    this.devUrl = 'https://dev.coomunity.co/merchant/a1598e94';
    this.targetUrl = 'https://coomunity.co/place/gossip/go/38000e9aad777d56';
  }

  async initialize(): Promise<void> {
    console.log('🚀 Inicializando Coomunity Gossip/Chat System Scraper...');
    
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
      `${this.baseDir}/gossip_data`,
      `${this.baseDir}/access_flow`,
      `${this.baseDir}/communication_analysis`
    ];

    dirs.forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`📁 Directorio creado: ${dir}`);
      }
    });
  }

  async scrapeGossipPage(): Promise<GossipScrapingResult> {
    if (!this.browser) {
      throw new Error('Browser no inicializado');
    }

    const page = await this.browser.newPage();
    const accessPath: string[] = [];
    
    console.log('🛤️ Iniciando flujo de acceso recomendado para gossip/chat...');
    
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
          hasGossipLinks: document.body.innerHTML.includes('gossip') || 
                         document.body.innerHTML.includes('chat'),
          hasMenuOptions: document.querySelectorAll('[class*="menu"]').length > 0,
          bodyText: document.body.textContent?.substring(0, 500) || ''
        };
      });

      console.log(`📋 Análisis del entorno dev:`, devPageAnalysis);

      // PASO 2: Navegar directamente a la URL del gossip/chat específico
      console.log(`💬 PASO 2: Navegando a la página de gossip/chat específica...`);
      console.log(`🌐 Navegando a: ${this.targetUrl}`);
      
      await page.goto(this.targetUrl, { 
        waitUntil: 'networkidle',
        timeout: 30000 
      });

      accessPath.push(`gossip_direct: ${this.targetUrl}`);

      // Capturar estado de la página de gossip
      await page.screenshot({ 
        path: `${this.baseDir}/screenshots/02_gossip_page.png`,
        fullPage: true 
      });

      await page.screenshot({ 
        path: `${this.baseDir}/screenshots/gossip_viewport.png`,
        fullPage: false 
      });

      console.log('📄 Página de gossip/chat cargada, analizando contenido...');

      // Esperar a que los elementos estén presentes
      await page.waitForTimeout(5000);

      // PASO 3: Análisis exhaustivo de la página de gossip/chat
      const gossipPageData = await page.evaluate(() => {
        // Extraer metadatos básicos
        const metaTags = Array.from(document.querySelectorAll('meta')).map(meta => ({
          name: meta.getAttribute('name'),
          property: meta.getAttribute('property'),
          content: meta.getAttribute('content'),
          charset: meta.getAttribute('charset')
        }));

        // Analizar funcionalidades específicas de gossip/chat
        const gossipFeatures = {
          communicationTools: Array.from(document.querySelectorAll('[class*="chat"], [class*="message"], [class*="gossip"], [class*="comment"]')).map(tool => ({
            text: tool.textContent?.trim() || '',
            className: tool.className,
            id: tool.id,
            tagName: tool.tagName
          })),
          
          chatInterface: {
            hasMessageInput: document.querySelector('input[type="text"], textarea') !== null,
            hasSendButton: document.querySelector('button[type="submit"], .send, .enviar') !== null,
            hasMessageHistory: document.querySelector('[class*="message"], [class*="chat-history"]') !== null,
            chatContainer: document.querySelector('[class*="chat"], [class*="conversation"]') ? {
              className: document.querySelector('[class*="chat"], [class*="conversation"]')?.className || '',
              id: document.querySelector('[class*="chat"], [class*="conversation"]')?.id || ''
            } : null
          },
          
          messageElements: Array.from(document.querySelectorAll('[class*="message"], [class*="msg"], [class*="comment"]')).map(msg => ({
            text: msg.textContent?.trim() || '',
            className: msg.className,
            id: msg.id,
            timestamp: msg.querySelector('[class*="time"], [class*="date"]')?.textContent?.trim() || 'No timestamp',
            author: msg.querySelector('[class*="author"], [class*="user"], [class*="name"]')?.textContent?.trim() || 'No author'
          })),
          
          userInteractions: Array.from(document.querySelectorAll('button, [class*="like"], [class*="reply"], [class*="share"]')).map(interaction => ({
            text: interaction.textContent?.trim() || '',
            className: interaction.className,
            id: interaction.id,
            type: interaction.tagName.toLowerCase()
          })),
          
          matchConnection: {
            matchId: window.location.pathname.split('/').pop() || 'unknown',
            hasBackToMatch: document.querySelector('[href*="matches"], [class*="back"]') !== null,
            matchContext: document.querySelector('[class*="match"], [class*="context"]')?.textContent?.trim() || 'No context found'
          }
        };

        // Extraer formularios específicos de gossip/chat
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
            isChatForm: form.innerHTML.includes('message') || 
                       form.innerHTML.includes('chat') ||
                       form.innerHTML.includes('gossip') ||
                       form.action?.includes('gossip') ||
                       form.querySelector('textarea') !== null
          };
        });

        // Detectar el tipo de página que obtuvimos
        const bodyText = document.body.textContent || '';
        const isLoginPage = document.querySelector('input[type="tel"]') !== null ||
                           document.querySelector('.intl-tel-input') !== null ||
                           bodyText.includes('Login Pläza');

        const isGossipContent = bodyText.includes('gossip') || 
                               bodyText.includes('chat') ||
                               bodyText.includes('message') ||
                               bodyText.includes('comentario') ||
                               bodyText.includes('38000e9aad777d56');

        const hasGossipFeatures = gossipFeatures.chatInterface.hasMessageInput ||
                                 gossipFeatures.messageElements.length > 0 ||
                                 gossipFeatures.communicationTools.length > 0;

        return {
          title: document.title,
          metaTags,
          gossipFeatures,
          forms,
          isLoginPage,
          isGossipContent,
          hasGossipFeatures,
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
            links: document.querySelectorAll('a').length,
            messageElements: document.querySelectorAll('[class*="message"], [class*="msg"]').length
          }
        };
      });

      // Guardar HTML completo
      const fullHTML = await page.content();
      fs.writeFileSync(
        `${this.baseDir}/html/gossip_page.html`,
        fullHTML,
        'utf8'
      );

      // Determinar el tipo de página que obtuvimos
      const pageType = gossipPageData.isLoginPage ? 'login' : 
                      gossipPageData.hasGossipFeatures ? 'gossip_chat' :
                      gossipPageData.isGossipContent ? 'gossip_public' : 'unknown';

      console.log(`📋 Tipo de página detectado: ${pageType}`);
      console.log(`📄 Título: ${gossipPageData.title}`);
      console.log(`🔒 ¿Es login?: ${gossipPageData.isLoginPage}`);
      console.log(`💬 ¿Tiene contenido de gossip?: ${gossipPageData.isGossipContent}`);
      console.log(`🎯 ¿Tiene funciones de chat?: ${gossipPageData.hasGossipFeatures}`);
      console.log(`📊 Elementos encontrados:`, gossipPageData.elementCounts);

      // Crear resultado
      const result: GossipScrapingResult = {
        url: this.targetUrl,
        title: gossipPageData.title,
        html: fullHTML,
        metadata: gossipPageData,
        gossipFeatures: gossipPageData.gossipFeatures,
        forms: gossipPageData.forms,
        accessPath: accessPath,
        timestamp: new Date().toISOString()
      };

      // Guardar análisis detallado
      await this.saveAnalysis(result, interceptedRequests, pageType, devPageAnalysis);

      console.log('✅ Scraping de gossip/chat completado exitosamente');
      return result;

    } catch (error) {
      console.error('❌ Error durante el scraping de gossip/chat:', error);
      throw error;
    } finally {
      await page.close();
    }
  }

  private async saveAnalysis(
    result: GossipScrapingResult, 
    requests: any[], 
    pageType: string,
    devAnalysis: any
  ): Promise<void> {
    // Análisis específico del gossip/chat
    const gossipAnalysis = {
      pageType,
      accessMethod: 'dev_environment_first',
      gossipFeatures: {
        hasChatInterface: result.gossipFeatures.chatInterface.hasMessageInput,
        communicationToolsCount: result.gossipFeatures.communicationTools.length,
        messageElementsCount: result.gossipFeatures.messageElements.length,
        userInteractionsCount: result.gossipFeatures.userInteractions.length,
        hasMatchConnection: result.gossipFeatures.matchConnection.matchId !== 'unknown'
      },
      matchId: result.gossipFeatures.matchConnection.matchId,
      functionality: {
        hasChatForms: result.forms.filter(f => f.isChatForm).length > 0,
        totalForms: result.forms.length,
        totalInputs: result.metadata.elementCounts.inputs,
        totalTextareas: result.metadata.elementCounts.textareas,
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
      gossipSpecificRequests: requests.filter(req => 
        req.url.includes('gossip') || 
        req.url.includes('chat') ||
        req.url.includes('message') ||
        req.url.includes('38000e9aad777d56')
      )
    };

    // Análisis detallado de comunicación
    const communicationAnalysis = {
      matchId: result.gossipFeatures.matchConnection.matchId,
      chatInterface: result.gossipFeatures.chatInterface,
      communicationTools: result.gossipFeatures.communicationTools,
      messageElements: result.gossipFeatures.messageElements,
      userInteractions: result.gossipFeatures.userInteractions,
      matchConnection: result.gossipFeatures.matchConnection
    };

    // Guardar análisis
    fs.writeFileSync(
      `${this.baseDir}/analysis/gossip_analysis.json`,
      JSON.stringify(gossipAnalysis, null, 2),
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
      `${this.baseDir}/communication_analysis/detailed_communication_analysis.json`,
      JSON.stringify(communicationAnalysis, null, 2),
      'utf8'
    );

    fs.writeFileSync(
      `${this.baseDir}/gossip_data/extracted_features.json`,
      JSON.stringify(result.gossipFeatures, null, 2),
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
    await this.generateReport(result, gossipAnalysis, accessFlowAnalysis, requestAnalysis, communicationAnalysis, devAnalysis);
  }

  private async generateReport(
    result: GossipScrapingResult, 
    gossipAnalysis: any, 
    accessFlowAnalysis: any,
    requestAnalysis: any,
    communicationAnalysis: any,
    devAnalysis: any
  ): Promise<void> {
    const report = `# CoomÜnity Gossip/Chat System Analysis Report

**Generated:** ${result.timestamp}
**Target URL:** ${result.url}
**Match ID:** ${communicationAnalysis.matchId}
**Access Method:** Development Environment First
**Final Page Type:** ${gossipAnalysis.pageType}

## Executive Summary

This report documents the analysis of the CoomÜnity gossip/chat page (\`/place/gossip/go/${communicationAnalysis.matchId}\`), accessed through the recommended development environment path. This page represents the communication/messaging system for specific matches in the marketplace.

## 🛤️ Access Flow Analysis

**Recommended Path Followed:**
1. **Dev Environment:** \`${accessFlowAnalysis.devAnalysis.url}\`
2. **Gossip/Chat Page:** \`${result.url}\`

**Dev Environment Analysis:**
- **Title:** ${accessFlowAnalysis.devAnalysis.title}
- **Has Login Form:** ${accessFlowAnalysis.devAnalysis.hasLoginForm ? 'Yes' : 'No'}
- **Has Gossip Links:** ${accessFlowAnalysis.devAnalysis.hasGossipLinks ? 'Yes' : 'No'}
- **Menu Options:** ${accessFlowAnalysis.devAnalysis.hasMenuOptions ? 'Yes' : 'No'}

## 🔒 Authentication & Access

- **Requires Authentication:** ${accessFlowAnalysis.authenticationRequired ? 'Yes' : 'No'}
- **Access Level:** ${gossipAnalysis.contentAccess}
- **Page Type:** ${gossipAnalysis.pageType}

## 💬 Gossip/Chat Features Analysis

**Core Communication Elements:**
- **Chat Interface:** ${gossipAnalysis.gossipFeatures.hasChatInterface ? '✅' : '❌'}
- **Communication Tools:** ${gossipAnalysis.gossipFeatures.communicationToolsCount} tools found
- **Message Elements:** ${gossipAnalysis.gossipFeatures.messageElementsCount} messages detected
- **User Interactions:** ${gossipAnalysis.gossipFeatures.userInteractionsCount} interactive elements
- **Match Connection:** ${gossipAnalysis.gossipFeatures.hasMatchConnection ? '✅' : '❌'} - ID: ${communicationAnalysis.matchId}

**Chat Functionality:**
- **Chat Forms:** ${gossipAnalysis.functionality.hasChatForms ? '✅' : '❌'} (${gossipAnalysis.functionality.totalForms} total forms)
- **Input Elements:** ${gossipAnalysis.functionality.totalInputs}
- **Text Areas:** ${gossipAnalysis.functionality.totalTextareas}
- **Action Buttons:** ${gossipAnalysis.functionality.totalButtons}
- **Images/Media:** ${gossipAnalysis.functionality.hasImages ? '✅' : '❌'} (${result.metadata.elementCounts.images} images)

## 📱 Chat Interface Details

**Interface Components:**
- **Message Input:** ${communicationAnalysis.chatInterface.hasMessageInput ? '✅ Available' : '❌ Not found'}
- **Send Button:** ${communicationAnalysis.chatInterface.hasSendButton ? '✅ Available' : '❌ Not found'}
- **Message History:** ${communicationAnalysis.chatInterface.hasMessageHistory ? '✅ Available' : '❌ Not found'}
- **Chat Container:** ${communicationAnalysis.chatInterface.chatContainer ? '✅ Present' : '❌ Not found'}

${communicationAnalysis.chatInterface.chatContainer ? `
**Chat Container Details:**
- **Class:** ${communicationAnalysis.chatInterface.chatContainer.className}
- **ID:** ${communicationAnalysis.chatInterface.chatContainer.id || 'No ID'}
` : ''}

## 💬 Message Analysis

**Messages Found:** ${communicationAnalysis.messageElements.length}
${communicationAnalysis.messageElements.length > 0 ? `
**Message Details:**
${communicationAnalysis.messageElements.slice(0, 5).map(msg => `- **Author:** ${msg.author} | **Time:** ${msg.timestamp} | **Content:** ${msg.text.substring(0, 100)}${msg.text.length > 100 ? '...' : ''}`).join('\n')}
${communicationAnalysis.messageElements.length > 5 ? `... and ${communicationAnalysis.messageElements.length - 5} more messages` : ''}
` : '**No messages found in current view.**'}

## 🤝 Match Connection

**Connection Details:**
- **Match ID:** ${communicationAnalysis.matchId}
- **Back to Match:** ${communicationAnalysis.matchConnection.hasBackToMatch ? '✅ Available' : '❌ Not found'}
- **Match Context:** ${communicationAnalysis.matchConnection.matchContext}

## 🎯 Communication Workflow

${result.forms.length > 0 ? `
**Form Details:**
${result.forms.map((form, i) => `
### Form ${i + 1} ${form.isChatForm ? '(Chat Form)' : ''}
- **Action:** ${form.action || 'No action'}
- **Method:** ${form.method || 'No method'}
- **Encoding:** ${form.enctype || 'No encoding specified'}
- **Inputs:** ${form.inputs.length}
- **Text Areas:** ${form.textareas.length}
- **Buttons:** ${form.buttons.length}
${form.buttons.length > 0 ? `- **Button Actions:** ${form.buttons.map(b => b.textContent).join(', ')}` : ''}
`).join('')}
` : '**No forms found on this page.**'}

## 👥 User Interactions

**Interactive Elements:** ${communicationAnalysis.userInteractions.length}
${communicationAnalysis.userInteractions.length > 0 ? `
**Interaction Types:**
${communicationAnalysis.userInteractions.slice(0, 8).map(interaction => `- ${interaction.text || 'No text'} (${interaction.type})`).join('\n')}
${communicationAnalysis.userInteractions.length > 8 ? `... and ${communicationAnalysis.userInteractions.length - 8} more interactions` : ''}
` : '**No user interactions detected.**'}

## 🌐 Network Analysis

**Total Requests:** ${requestAnalysis.totalRequests}

**By Resource Type:**
${Object.entries(requestAnalysis.byResourceType).map(([type, count]) => `- ${type}: ${count}`).join('\n')}

**Gossip/Chat Specific Requests:** ${requestAnalysis.gossipSpecificRequests.length}

## 📊 Key Findings

1. **Access Method:** ${accessFlowAnalysis.devEnvironmentFirst ? 'Successfully used development environment as entry point' : 'Direct access attempted'}
2. **Content Accessibility:** ${gossipAnalysis.contentAccess === 'accessible' ? 'Gossip/chat content is accessible' : 'Authentication required for chat access'}
3. **Chat Features:** ${gossipAnalysis.gossipFeatures.hasChatInterface ? 'Interactive chat interface available' : 'Limited chat functionality visible'}
4. **User Experience:** ${gossipAnalysis.functionality.hasChatForms ? 'Interactive communication features available' : 'Read-only communication view'}
5. **System Integration:** ${gossipAnalysis.gossipFeatures.hasMatchConnection ? 'Connected to match system' : 'Standalone communication system'}

## 📂 File Structure

\`\`\`
${this.baseDir}/
├── html/
│   └── gossip_page.html
├── screenshots/
│   ├── 01_dev_environment.png
│   ├── 02_gossip_page.png
│   └── gossip_viewport.png
├── analysis/
│   ├── gossip_analysis.json
│   ├── access_flow_analysis.json
│   └── request_analysis.json
├── communication_analysis/
│   └── detailed_communication_analysis.json
├── gossip_data/
│   └── extracted_features.json
├── metadata/
│   └── complete_metadata.json
├── access_flow/
│   └── access_path.json
└── gossip_report.md
\`\`\`

## 🎯 Recommendations

${accessFlowAnalysis.authenticationRequired ? `
**Authentication Required:** To access full chat functionality:
1. Complete phone verification through Login Pläza
2. Establish authenticated session
3. Re-scrape with authenticated access
4. Test chat interaction workflow
` : `
**Full Access Achieved:** Gossip/chat content has been successfully captured.
`}

**Next Steps:**
1. ${gossipAnalysis.gossipFeatures.hasChatInterface ? 'Test chat message sending and receiving' : 'Investigate chat interface requirements'}
2. ${communicationAnalysis.messageElements.length > 0 ? 'Analyze message patterns and user behavior' : 'Map message system requirements'}
3. ${gossipAnalysis.gossipFeatures.hasMatchConnection ? 'Test integration with match system' : 'Investigate match connection system'}
4. Map complete communication workflow within matches

## 🔍 Marketplace Impact

This gossip/chat system is **critical for the CoomÜnity marketplace ecosystem** as it:
- Enables direct communication between match participants
- Facilitates negotiation and agreement processes
- Provides informal discussion channels for business deals
- Supports relationship building within the marketplace

---

**Status:** ✅ **GOSSIP/CHAT ANALYSIS COMPLETE**

The CoomÜnity gossip/chat page (Match ID: ${communicationAnalysis.matchId}) has been analyzed using the recommended development environment access path.

**Access Strategy Confirmed:** Using \`dev.coomunity.co/merchant/a1598e94\` as entry point provides proper context for communication system access.

**Critical for Marketplace:** This page represents the core communication infrastructure that enables negotiations and relationship building within CoomÜnity matches.

**Last Updated:** ${result.timestamp}
`;

    fs.writeFileSync(`${this.baseDir}/gossip_report.md`, report, 'utf8');
    console.log('📄 Reporte de gossip/chat generado: gossip_report.md');
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
      const result = await this.scrapeGossipPage();
      
      console.log('\n🎉 GOSSIP/CHAT SCRAPING COMPLETADO EXITOSAMENTE!');
      console.log(`📁 Resultados guardados en: ${this.baseDir}/`);
      console.log(`📊 URL analizada: ${result.url}`);
      console.log(`🛤️ Ruta de acceso: ${result.accessPath.join(' → ')}`);
      console.log(`📋 Tipo de página: ${result.metadata.isLoginPage ? 'Login requerido' : 'Contenido accesible'}`);
      console.log(`💬 Match ID: ${result.gossipFeatures.matchConnection.matchId}`);
      console.log(`🎯 Funciones de chat: ${result.metadata.hasGossipFeatures ? 'Disponibles' : 'Limitadas'}`);
      
    } catch (error) {
      console.error('💥 Error durante la ejecución del gossip scraper:', error);
      throw error;
    } finally {
      await this.cleanup();
    }
  }
}

// Ejecutar el scraper
async function main() {
  const scraper = new CoomunityGossipScraper();
  await scraper.run();
}

if (require.main === module) {
  main().catch(console.error);
}

export { CoomunityGossipScraper }; 