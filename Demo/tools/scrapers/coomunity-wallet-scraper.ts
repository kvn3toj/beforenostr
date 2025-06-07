import { chromium, Browser, Page } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';

interface WalletScrapingResult {
  url: string;
  title: string;
  html: string;
  metadata: any;
  walletFeatures: {
    balanceDisplay: string;
    transactionHistory: any[];
    rechargeOptions: any[];
    paymentMethods: any[];
  };
  forms: any[];
  accessPath: string[];
  timestamp: string;
}

class CoomunityWalletScraper {
  private browser: Browser | null = null;
  private baseDir: string;
  private devUrl: string;
  private targetUrl: string;
  
  constructor() {
    this.baseDir = './coomunity_wallet';
    this.devUrl = 'https://dev.coomunity.co/merchant/a1598e94';
    this.targetUrl = 'https://coomunity.co/place/wallet';
  }

  async initialize(): Promise<void> {
    console.log('🚀 Inicializando Coomunity Wallet Scraper...');
    
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
      `${this.baseDir}/wallet_data`,
      `${this.baseDir}/access_flow`
    ];

    dirs.forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`📁 Directorio creado: ${dir}`);
      }
    });
  }

  async scrapeWalletPage(): Promise<WalletScrapingResult> {
    if (!this.browser) {
      throw new Error('Browser no inicializado');
    }

    const page = await this.browser.newPage();
    const accessPath: string[] = [];
    
    console.log('🛤️ Iniciando flujo de acceso recomendado...');
    
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
          hasWalletLinks: document.body.innerHTML.includes('wallet'),
          hasMenuOptions: document.querySelectorAll('[class*="menu"]').length > 0,
          bodyText: document.body.textContent?.substring(0, 500) || ''
        };
      });

      console.log(`📋 Análisis del entorno dev:`, devPageAnalysis);

      // PASO 2: Navegar directamente a la URL de wallet
      console.log(`💰 PASO 2: Navegando a la página de wallet...`);
      console.log(`🌐 Navegando a: ${this.targetUrl}`);
      
      await page.goto(this.targetUrl, { 
        waitUntil: 'networkidle',
        timeout: 30000 
      });

      accessPath.push(`wallet_direct: ${this.targetUrl}`);

      // Capturar estado de la página de wallet
      await page.screenshot({ 
        path: `${this.baseDir}/screenshots/02_wallet_page.png`,
        fullPage: true 
      });

      await page.screenshot({ 
        path: `${this.baseDir}/screenshots/wallet_viewport.png`,
        fullPage: false 
      });

      console.log('📄 Página de wallet cargada, analizando contenido...');

      // Esperar a que los elementos estén presentes
      await page.waitForTimeout(5000);

      // PASO 3: Análisis exhaustivo de la página de wallet
      const walletPageData = await page.evaluate(() => {
        // Extraer metadatos básicos
        const metaTags = Array.from(document.querySelectorAll('meta')).map(meta => ({
          name: meta.getAttribute('name'),
          property: meta.getAttribute('property'),
          content: meta.getAttribute('content'),
          charset: meta.getAttribute('charset')
        }));

        // Analizar contenido específico de wallet
        const walletFeatures = {
          balanceDisplay: document.querySelector('[class*="balance"]')?.textContent?.trim() ||
                         document.querySelector('[class*="saldo"]')?.textContent?.trim() ||
                         document.querySelector('[class*="amount"]')?.textContent?.trim() ||
                         'No balance display found',
          
          transactionHistory: Array.from(document.querySelectorAll('[class*="transaction"], [class*="historial"], [class*="history"]')).map(tx => ({
            text: tx.textContent?.trim() || '',
            className: tx.className,
            id: tx.id
          })),
          
          rechargeOptions: Array.from(document.querySelectorAll('[class*="recharge"], [class*="recarga"], [class*="reload"]')).map(option => ({
            text: option.textContent?.trim() || '',
            className: option.className,
            id: option.id,
            tagName: option.tagName
          })),
          
          paymentMethods: Array.from(document.querySelectorAll('[class*="payment"], [class*="pago"], [class*="method"]')).map(method => ({
            text: method.textContent?.trim() || '',
            className: method.className,
            id: method.id
          }))
        };

        // Extraer formularios específicos de wallet
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

          const buttons = Array.from(form.querySelectorAll('button')).map(button => ({
            type: button.type,
            textContent: button.textContent?.trim(),
            className: button.className,
            id: button.id
          }));

          return {
            action: form.action,
            method: form.method,
            className: form.className,
            id: form.id,
            inputs: inputs,
            buttons: buttons,
            isWalletRelated: form.innerHTML.includes('wallet') || 
                           form.innerHTML.includes('recarga') ||
                           form.innerHTML.includes('saldo') ||
                           form.innerHTML.includes('pago')
          };
        });

        // Detectar el tipo de página que obtuvimos
        const bodyText = document.body.textContent || '';
        const isLoginPage = document.querySelector('input[type="tel"]') !== null ||
                           document.querySelector('.intl-tel-input') !== null ||
                           bodyText.includes('Login Pläza');

        const isWalletContent = bodyText.includes('wallet') || 
                               bodyText.includes('saldo') ||
                               bodyText.includes('recarga') ||
                               bodyText.includes('balance') ||
                               bodyText.includes('Lükas');

        const hasWalletFeatures = walletFeatures.balanceDisplay !== 'No balance display found' ||
                                 walletFeatures.transactionHistory.length > 0 ||
                                 walletFeatures.rechargeOptions.length > 0;

        return {
          title: document.title,
          metaTags,
          walletFeatures,
          forms,
          isLoginPage,
          isWalletContent,
          hasWalletFeatures,
          bodyHTML: document.body.innerHTML,
          headHTML: document.head.innerHTML,
          url: window.location.href,
          pathname: window.location.pathname,
          fullText: bodyText.substring(0, 1500), // Primeros 1500 caracteres
          elementCounts: {
            forms: document.querySelectorAll('form').length,
            inputs: document.querySelectorAll('input').length,
            buttons: document.querySelectorAll('button').length,
            walletElements: document.querySelectorAll('[class*="wallet"], [class*="saldo"], [class*="balance"]').length
          }
        };
      });

      // Guardar HTML completo
      const fullHTML = await page.content();
      fs.writeFileSync(
        `${this.baseDir}/html/wallet_page.html`,
        fullHTML,
        'utf8'
      );

      // Determinar el tipo de página que obtuvimos
      const pageType = walletPageData.isLoginPage ? 'login' : 
                      walletPageData.hasWalletFeatures ? 'wallet_authenticated' :
                      walletPageData.isWalletContent ? 'wallet_public' : 'unknown';

      console.log(`📋 Tipo de página detectado: ${pageType}`);
      console.log(`📄 Título: ${walletPageData.title}`);
      console.log(`🔒 ¿Es login?: ${walletPageData.isLoginPage}`);
      console.log(`💰 ¿Tiene contenido de wallet?: ${walletPageData.isWalletContent}`);
      console.log(`🎯 ¿Tiene funciones de wallet?: ${walletPageData.hasWalletFeatures}`);
      console.log(`📊 Elementos encontrados:`, walletPageData.elementCounts);

      // Crear resultado
      const result: WalletScrapingResult = {
        url: this.targetUrl,
        title: walletPageData.title,
        html: fullHTML,
        metadata: walletPageData,
        walletFeatures: walletPageData.walletFeatures,
        forms: walletPageData.forms,
        accessPath: accessPath,
        timestamp: new Date().toISOString()
      };

      // Guardar análisis detallado
      await this.saveAnalysis(result, interceptedRequests, pageType, devPageAnalysis);

      console.log('✅ Scraping de wallet completado exitosamente');
      return result;

    } catch (error) {
      console.error('❌ Error durante el scraping de wallet:', error);
      throw error;
    } finally {
      await page.close();
    }
  }

  private async saveAnalysis(
    result: WalletScrapingResult, 
    requests: any[], 
    pageType: string,
    devAnalysis: any
  ): Promise<void> {
    // Análisis específico del wallet
    const walletAnalysis = {
      pageType,
      accessMethod: 'dev_environment_first',
      walletFeatures: {
        balanceVisible: result.walletFeatures.balanceDisplay !== 'No balance display found',
        transactionCount: result.walletFeatures.transactionHistory.length,
        rechargeOptionsCount: result.walletFeatures.rechargeOptions.length,
        paymentMethodsCount: result.walletFeatures.paymentMethods.length
      },
      functionality: {
        hasWalletForms: result.forms.filter(f => f.isWalletRelated).length > 0,
        totalForms: result.forms.length,
        totalInputs: result.metadata.elementCounts.inputs,
        totalButtons: result.metadata.elementCounts.buttons
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
      walletSpecificRequests: requests.filter(req => 
        req.url.includes('wallet') || 
        req.url.includes('balance') ||
        req.url.includes('transaction') ||
        req.url.includes('payment')
      )
    };

    // Guardar análisis
    fs.writeFileSync(
      `${this.baseDir}/analysis/wallet_analysis.json`,
      JSON.stringify(walletAnalysis, null, 2),
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
      `${this.baseDir}/wallet_data/extracted_features.json`,
      JSON.stringify(result.walletFeatures, null, 2),
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
    await this.generateReport(result, walletAnalysis, accessFlowAnalysis, requestAnalysis, devAnalysis);
  }

  private async generateReport(
    result: WalletScrapingResult, 
    walletAnalysis: any, 
    accessFlowAnalysis: any,
    requestAnalysis: any,
    devAnalysis: any
  ): Promise<void> {
    const report = `# CoomÜnity Wallet Analysis Report

**Generated:** ${result.timestamp}
**Target URL:** ${result.url}
**Access Method:** Development Environment First
**Final Page Type:** ${walletAnalysis.pageType}

## Executive Summary

This report documents the analysis of the CoomÜnity wallet page, accessed through the recommended development environment path.

## 🛤️ Access Flow Analysis

**Recommended Path Followed:**
1. **Dev Environment:** \`${accessFlowAnalysis.devAnalysis.url}\`
2. **Direct Wallet:** \`${result.url}\`

**Dev Environment Analysis:**
- **Title:** ${accessFlowAnalysis.devAnalysis.title}
- **Has Login Form:** ${accessFlowAnalysis.devAnalysis.hasLoginForm ? 'Yes' : 'No'}
- **Has Wallet Links:** ${accessFlowAnalysis.devAnalysis.hasWalletLinks ? 'Yes' : 'No'}
- **Menu Options:** ${accessFlowAnalysis.devAnalysis.hasMenuOptions ? 'Yes' : 'No'}

## 🔒 Authentication & Access

- **Requires Authentication:** ${accessFlowAnalysis.authenticationRequired ? 'Yes' : 'No'}
- **Access Level:** ${walletAnalysis.contentAccess}
- **Page Type:** ${walletAnalysis.pageType}

## 💰 Wallet Features Analysis

**Core Wallet Elements:**
- **Balance Display:** ${walletAnalysis.walletFeatures.balanceVisible ? '✅' : '❌'} - "${result.walletFeatures.balanceDisplay}"
- **Transaction History:** ${walletAnalysis.walletFeatures.transactionCount} entries found
- **Recharge Options:** ${walletAnalysis.walletFeatures.rechargeOptionsCount} options available
- **Payment Methods:** ${walletAnalysis.walletFeatures.paymentMethodsCount} methods found

**Wallet Functionality:**
- **Wallet-Related Forms:** ${walletAnalysis.functionality.hasWalletForms ? '✅' : '❌'} (${walletAnalysis.functionality.totalForms} total forms)
- **Input Elements:** ${walletAnalysis.functionality.totalInputs}
- **Action Buttons:** ${walletAnalysis.functionality.totalButtons}

${result.walletFeatures.rechargeOptions.length > 0 ? `
**Recharge Options Found:**
${result.walletFeatures.rechargeOptions.map(option => `- ${option.text || 'No text'} (${option.tagName})`).join('\n')}
` : ''}

${result.walletFeatures.transactionHistory.length > 0 ? `
**Transaction Elements:**
${result.walletFeatures.transactionHistory.slice(0, 5).map(tx => `- ${tx.text || 'No text'}`).join('\n')}
${result.walletFeatures.transactionHistory.length > 5 ? `... and ${result.walletFeatures.transactionHistory.length - 5} more` : ''}
` : ''}

## 📋 Forms Analysis

**Total Forms Found:** ${result.forms.length}
**Wallet-Related Forms:** ${result.forms.filter(f => f.isWalletRelated).length}

${result.forms.length > 0 ? `
**Form Details:**
${result.forms.map((form, i) => `
### Form ${i + 1} ${form.isWalletRelated ? '(Wallet-Related)' : ''}
- **Action:** ${form.action || 'No action'}
- **Method:** ${form.method || 'No method'}
- **Inputs:** ${form.inputs.length}
- **Buttons:** ${form.buttons.length}
${form.buttons.length > 0 ? `- **Button Text:** ${form.buttons.map(b => b.textContent).join(', ')}` : ''}
`).join('')}
` : '**No forms found on this page.**'}

## 🌐 Network Analysis

**Total Requests:** ${requestAnalysis.totalRequests}

**By Resource Type:**
${Object.entries(requestAnalysis.byResourceType).map(([type, count]) => `- ${type}: ${count}`).join('\n')}

**Wallet-Specific Requests:** ${requestAnalysis.walletSpecificRequests.length}

## 📊 Key Findings

1. **Access Method:** ${accessFlowAnalysis.devEnvironmentFirst ? 'Successfully used development environment as entry point' : 'Direct access attempted'}
2. **Content Accessibility:** ${walletAnalysis.contentAccess === 'accessible' ? 'Wallet content is accessible' : 'Authentication required for wallet access'}
3. **Wallet Features:** ${walletAnalysis.walletFeatures.balanceVisible ? 'Full wallet interface available' : 'Limited wallet functionality visible'}
4. **User Experience:** ${walletAnalysis.functionality.hasWalletForms ? 'Interactive wallet features available' : 'Read-only wallet view'}

## 📂 File Structure

\`\`\`
${this.baseDir}/
├── html/
│   └── wallet_page.html
├── screenshots/
│   ├── 01_dev_environment.png
│   ├── 02_wallet_page.png
│   └── wallet_viewport.png
├── analysis/
│   ├── wallet_analysis.json
│   ├── access_flow_analysis.json
│   └── request_analysis.json
├── wallet_data/
│   └── extracted_features.json
├── metadata/
│   └── complete_metadata.json
├── access_flow/
│   └── access_path.json
└── wallet_report.md
\`\`\`

## 🎯 Recommendations

${accessFlowAnalysis.authenticationRequired ? `
**Authentication Required:** To access full wallet functionality:
1. Complete phone verification through Login Pläza
2. Establish authenticated session
3. Re-scrape with authenticated access
` : `
**Full Access Achieved:** Wallet content has been successfully captured.
`}

**Next Steps:**
1. ${walletAnalysis.walletFeatures.balanceVisible ? 'Analyze wallet balance integration' : 'Investigate balance display requirements'}
2. ${walletAnalysis.functionality.hasWalletForms ? 'Test wallet transaction flows' : 'Map wallet functionality requirements'}
3. Compare dev vs production wallet environments

---

**Status:** ✅ **WALLET ANALYSIS COMPLETE**

The CoomÜnity wallet page has been analyzed using the recommended development environment access path.

**Access Strategy Confirmed:** Using \`dev.coomunity.co/merchant/a1598e94\` as entry point provides proper context for wallet access.

**Last Updated:** ${result.timestamp}
`;

    fs.writeFileSync(`${this.baseDir}/wallet_report.md`, report, 'utf8');
    console.log('📄 Reporte de wallet generado: wallet_report.md');
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
      const result = await this.scrapeWalletPage();
      
      console.log('\n🎉 WALLET SCRAPING COMPLETADO EXITOSAMENTE!');
      console.log(`📁 Resultados guardados en: ${this.baseDir}/`);
      console.log(`📊 URL analizada: ${result.url}`);
      console.log(`🛤️ Ruta de acceso: ${result.accessPath.join(' → ')}`);
      console.log(`📋 Tipo de página: ${result.metadata.isLoginPage ? 'Login requerido' : 'Contenido accesible'}`);
      console.log(`💰 Funciones de wallet: ${result.metadata.hasWalletFeatures ? 'Disponibles' : 'Limitadas'}`);
      
    } catch (error) {
      console.error('💥 Error durante la ejecución del wallet scraper:', error);
      throw error;
    } finally {
      await this.cleanup();
    }
  }
}

// Ejecutar el scraper
async function main() {
  const scraper = new CoomunityWalletScraper();
  await scraper.run();
}

if (require.main === module) {
  main().catch(console.error);
}

export { CoomunityWalletScraper }; 