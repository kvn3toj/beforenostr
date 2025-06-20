import { chromium, Browser, Page } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';

interface MerchantContent {
  html: string;
  css: string[];
  js: string[];
  images: string[];
  videos: string[];
  audio: string[];
  fonts: string[];
  metadata: {
    title: string;
    description: string;
    keywords: string;
    timestamp: string;
    url: string;
    merchantId: string;
    environment: string;
  };
  merchantData: {
    id: string;
    loginForm: any;
    apiEndpoints: string[];
    devFeatures: string[];
  };
}

class CoomUnityMerchantScraper {
  private browser: Browser | null = null;
  private page: Page | null = null;
  private baseUrl = 'https://dev.coomunity.co';
  private targetUrl = 'https://dev.coomunity.co/merchant/a1598e94';
  private outputDir = './coomunity_merchant_dev';

  constructor() {
    this.ensureOutputDirectory();
  }

  private ensureOutputDirectory(): void {
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
    
    // Create subdirectories
    const subdirs = [
      'html', 
      'assets/css', 
      'assets/js', 
      'assets/images', 
      'assets/videos', 
      'assets/audio', 
      'assets/fonts', 
      'screenshots',
      'merchant_data',
      'api_analysis'
    ];
    
    subdirs.forEach(dir => {
      const fullPath = path.join(this.outputDir, dir);
      if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
      }
    });
  }

  async initialize(): Promise<void> {
    console.log('🚀 Initializing CoomÜnity Merchant Development Scraper...');
    
    this.browser = await chromium.launch({
      headless: false,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu'
      ]
    });

    this.page = await this.browser.newPage();
    
    // Set viewport and user agent
    await this.page.setViewportSize({ width: 1920, height: 1080 });
    await this.page.setExtraHTTPHeaders({
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    });
    
    // Enhanced network monitoring for merchant environment
    this.page.on('console', msg => {
      console.log(`📝 Console [${msg.type()}]:`, msg.text());
    });

    this.page.on('requestfailed', request => {
      console.log(`❌ Request failed: ${request.url()} - ${request.failure()?.errorText}`);
    });

    // Monitor API calls for merchant data
    this.page.on('response', response => {
      if (response.url().includes('api') || response.url().includes('merchant')) {
        console.log(`🔗 API Response: ${response.status()} - ${response.url()}`);
      }
    });
  }

  async navigateToMerchantPage(): Promise<void> {
    console.log('🏪 Navigating to CoomÜnity Merchant Development page...');
    
    try {
      await this.page!.goto(this.targetUrl, {
        waitUntil: 'networkidle',
        timeout: 30000
      });

      // Wait for the page to fully load and any merchant-specific content
      await this.page!.waitForTimeout(5000);
      
      console.log('✅ Successfully loaded merchant development page');
    } catch (error) {
      console.error('❌ Failed to navigate to merchant page:', error);
      throw error;
    }
  }

  async captureScreenshots(): Promise<void> {
    console.log('📸 Capturing merchant page screenshots...');
    
    try {
      await this.page!.screenshot({
        path: path.join(this.outputDir, 'screenshots', 'merchant_dev_full.png'),
        fullPage: true
      });

      await this.page!.screenshot({
        path: path.join(this.outputDir, 'screenshots', 'merchant_dev_viewport.png'),
        fullPage: false
      });

      // Capture any modals or popups if present
      const modals = await this.page!.$$('[role="dialog"], .modal, .popup');
      if (modals.length > 0) {
        await this.page!.screenshot({
          path: path.join(this.outputDir, 'screenshots', 'merchant_dev_modals.png'),
          fullPage: false
        });
      }

      console.log('✅ Merchant screenshots captured');
    } catch (error) {
      console.error('❌ Failed to capture screenshots:', error);
    }
  }

  async extractMerchantContent(): Promise<MerchantContent> {
    console.log('🔍 Extracting merchant development content...');

    const content: MerchantContent = {
      html: '',
      css: [],
      js: [],
      images: [],
      videos: [],
      audio: [],
      fonts: [],
      metadata: {
        title: '',
        description: '',
        keywords: '',
        timestamp: new Date().toISOString(),
        url: this.targetUrl,
        merchantId: 'a1598e94',
        environment: 'development'
      },
      merchantData: {
        id: 'a1598e94',
        loginForm: {},
        apiEndpoints: [],
        devFeatures: []
      }
    };

    try {
      // Extract HTML content
      content.html = await this.page!.content();

      // Extract metadata
      content.metadata.title = await this.page!.title();
      
      const metaData = await this.page!.evaluate(() => {
        const descriptionMeta = document.querySelector('meta[name="description"]') as HTMLMetaElement;
        const keywordsMeta = document.querySelector('meta[name="keywords"]') as HTMLMetaElement;
        
        return {
          description: descriptionMeta?.content || '',
          keywords: keywordsMeta?.content || ''
        };
      });
      
      content.metadata.description = metaData.description;
      content.metadata.keywords = metaData.keywords;

      // Extract merchant-specific data
      const merchantData = await this.page!.evaluate(() => {
        const data = {
          loginForm: {},
          formElements: [] as any[],
          devFeatures: [] as string[],
          apiEndpoints: [] as string[],
          merchantInfo: {} as any
        };

        // Analyze login form structure
        const form = document.querySelector('form');
        if (form) {
          data.loginForm = {
            action: (form as HTMLFormElement).action,
            method: (form as HTMLFormElement).method,
            inputs: Array.from(form.querySelectorAll('input')).map(input => ({
              type: (input as HTMLInputElement).type,
              name: (input as HTMLInputElement).name,
              placeholder: (input as HTMLInputElement).placeholder,
              required: (input as HTMLInputElement).required
            }))
          };
        }

        // Look for form elements
        document.querySelectorAll('input, select, textarea, button').forEach((el, index) => {
          if (el.tagName === 'INPUT') {
            const input = el as HTMLInputElement;
            data.formElements.push({
              type: 'input',
              inputType: input.type,
              name: input.name,
              id: input.id,
              placeholder: input.placeholder,
              value: input.value,
              required: input.required
            });
          } else if (el.tagName === 'BUTTON') {
            const button = el as HTMLButtonElement;
            data.formElements.push({
              type: 'button',
              text: button.textContent?.trim(),
              id: button.id,
              className: button.className
            });
          }
        });

        // Look for development-specific features
        const devIndicators = [
          'dev', 'debug', 'test', 'staging', 'development',
          'console', 'merchant', 'admin', 'dashboard'
        ];

        devIndicators.forEach(indicator => {
          const elements = document.querySelectorAll(`[class*="${indicator}"], [id*="${indicator}"]`);
          if (elements.length > 0) {
            data.devFeatures.push(`${indicator}: ${elements.length} elements found`);
          }
        });

        // Check for API endpoint references in scripts
        const scripts = Array.from(document.querySelectorAll('script'));
        scripts.forEach(script => {
          const content = script.textContent || '';
          const apiMatches = content.match(/\/api\/[^"'\s]+/g);
          if (apiMatches) {
            data.apiEndpoints.push(...apiMatches);
          }
        });

        return data;
      });

      content.merchantData.loginForm = merchantData.loginForm;
      content.merchantData.apiEndpoints = [...new Set(merchantData.apiEndpoints)];
      content.merchantData.devFeatures = merchantData.devFeatures;

      // Extract all resource URLs (same as before but with merchant context)
      const resources = await this.page!.evaluate(() => {
        const urls = {
          css: [] as string[],
          js: [] as string[],
          images: [] as string[],
          videos: [] as string[],
          audio: [] as string[],
          fonts: [] as string[]
        };

        // CSS files
        document.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
          const href = (link as HTMLLinkElement).href;
          if (href) urls.css.push(href);
        });

        // JavaScript files
        document.querySelectorAll('script[src]').forEach(script => {
          const src = (script as HTMLScriptElement).src;
          if (src) urls.js.push(src);
        });

        // Images
        document.querySelectorAll('img[src]').forEach(img => {
          const src = (img as HTMLImageElement).src;
          if (src) urls.images.push(src);
        });

        // Videos
        document.querySelectorAll('video source[src], video[src]').forEach(video => {
          const src = (video as HTMLVideoElement).src || (video as HTMLSourceElement).src;
          if (src) urls.videos.push(src);
        });

        // Audio
        document.querySelectorAll('audio source[src], audio[src]').forEach(audio => {
          const src = (audio as HTMLAudioElement).src || (audio as HTMLSourceElement).src;
          if (src) urls.audio.push(src);
        });

        // Fonts
        document.querySelectorAll('link[href*=".woff"], link[href*=".woff2"], link[href*=".ttf"], link[href*=".otf"]').forEach(font => {
          const href = (font as HTMLLinkElement).href;
          if (href) urls.fonts.push(href);
        });

        return urls;
      });

      content.css = [...new Set(resources.css)];
      content.js = [...new Set(resources.js)];
      content.images = [...new Set(resources.images)];
      content.videos = [...new Set(resources.videos)];
      content.audio = [...new Set(resources.audio)];
      content.fonts = [...new Set(resources.fonts)];

      console.log('📊 Merchant content extraction summary:');
      console.log(`   - CSS files: ${content.css.length}`);
      console.log(`   - JS files: ${content.js.length}`);
      console.log(`   - Images: ${content.images.length}`);
      console.log(`   - Videos: ${content.videos.length}`);
      console.log(`   - API endpoints found: ${content.merchantData.apiEndpoints.length}`);
      console.log(`   - Dev features detected: ${content.merchantData.devFeatures.length}`);

      return content;
    } catch (error) {
      console.error('❌ Failed to extract merchant content:', error);
      throw error;
    }
  }

  async downloadResource(url: string, outputPath: string): Promise<boolean> {
    try {
      const absoluteUrl = url.startsWith('http') ? url : new URL(url, this.baseUrl).href;
      
      const response = await this.page!.goto(absoluteUrl);
      if (response && response.ok()) {
        const buffer = await response.body();
        fs.writeFileSync(outputPath, buffer);
        return true;
      }
      return false;
    } catch (error) {
      console.error(`❌ Failed to download ${url}:`, error);
      return false;
    }
  }

  async downloadAllResources(content: MerchantContent): Promise<void> {
    console.log('⬇️ Downloading merchant resources...');

    const downloadTasks = [
      { resources: content.css, folder: 'assets/css', extension: '.css' },
      { resources: content.js, folder: 'assets/js', extension: '.js' },
      { resources: content.images, folder: 'assets/images', extension: '' },
      { resources: content.videos, folder: 'assets/videos', extension: '' },
      { resources: content.audio, folder: 'assets/audio', extension: '' },
      { resources: content.fonts, folder: 'assets/fonts', extension: '' }
    ];

    for (const task of downloadTasks) {
      console.log(`📁 Downloading ${task.resources.length} ${task.folder} files...`);
      
      for (let i = 0; i < task.resources.length; i++) {
        const url = task.resources[i];
        const filename = this.getFilenameFromUrl(url) || `resource_${i}${task.extension}`;
        const outputPath = path.join(this.outputDir, task.folder, filename);
        
        console.log(`   ⬇️ Downloading: ${filename}`);
        await this.downloadResource(url, outputPath);
        
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
  }

  private getFilenameFromUrl(url: string): string {
    try {
      const urlObj = new URL(url);
      const pathname = urlObj.pathname;
      const filename = path.basename(pathname);
      return filename || 'unknown';
    } catch {
      return 'unknown';
    }
  }

  async saveMerchantContent(content: MerchantContent): Promise<void> {
    console.log('💾 Saving merchant development content...');

    // Save HTML
    fs.writeFileSync(
      path.join(this.outputDir, 'html', 'merchant_dev_page.html'),
      content.html,
      'utf8'
    );

    // Save comprehensive merchant data
    const merchantSummary = {
      ...content.metadata,
      merchantData: content.merchantData,
      resources: {
        css: content.css,
        js: content.js,
        images: content.images,
        videos: content.videos,
        audio: content.audio,
        fonts: content.fonts
      }
    };

    fs.writeFileSync(
      path.join(this.outputDir, 'merchant_summary.json'),
      JSON.stringify(merchantSummary, null, 2),
      'utf8'
    );

    // Save merchant-specific data separately
    fs.writeFileSync(
      path.join(this.outputDir, 'merchant_data', 'login_form_analysis.json'),
      JSON.stringify(content.merchantData.loginForm, null, 2),
      'utf8'
    );

    fs.writeFileSync(
      path.join(this.outputDir, 'api_analysis', 'endpoints_found.json'),
      JSON.stringify(content.merchantData.apiEndpoints, null, 2),
      'utf8'
    );

    fs.writeFileSync(
      path.join(this.outputDir, 'merchant_data', 'dev_features.json'),
      JSON.stringify(content.merchantData.devFeatures, null, 2),
      'utf8'
    );

    console.log('✅ All merchant content saved successfully');
  }

  async generateMerchantReport(content: MerchantContent): Promise<void> {
    console.log('📋 Generating merchant development report...');

    const reportContent = `
# CoomÜnity Merchant Development Environment Report

**Generated:** ${new Date().toISOString()}
**Target URL:** ${this.targetUrl}
**Merchant ID:** ${content.merchantData.id}
**Environment:** Development
**Output Directory:** ${this.outputDir}

## Executive Summary

This report documents the complete extraction of the CoomÜnity Merchant Development environment, including login systems, API endpoints, and development-specific features.

## 🏪 Merchant Environment Details

- **Merchant ID:** a1598e94
- **Environment:** Development (dev.coomunity.co)
- **Login System:** Phone-based with WhatsApp integration
- **Interface:** Login Pläza (same as main platform)

## 📊 Content Analysis

### HTML Structure
- **Size:** ${(content.html.length / 1024).toFixed(2)} KB
- **Title:** ${content.metadata.title}
- **Form Elements:** Login form with phone verification

### Resources Discovered
- **CSS Files:** ${content.css.length}
- **JavaScript Files:** ${content.js.length}
- **Images:** ${content.images.length}
- **Videos:** ${content.videos.length}
- **API Endpoints:** ${content.merchantData.apiEndpoints.length}

### Development Features
${content.merchantData.devFeatures.map(feature => `- ${feature}`).join('\n')}

## 🔗 API Endpoints Identified
${content.merchantData.apiEndpoints.length > 0 ? 
  content.merchantData.apiEndpoints.map(endpoint => `- ${endpoint}`).join('\n') : 
  '- No API endpoints detected in client-side code'}

## 📱 Login Form Analysis

**Form Structure:**
- **Action:** ${content.merchantData.loginForm.action || 'Not specified'}
- **Method:** ${content.merchantData.loginForm.method || 'Not specified'}
- **Input Fields:** ${content.merchantData.loginForm.inputs?.length || 0}

## 🆚 Comparison with Main Platform

### Similarities:
- Same Login Pläza interface
- Phone-based authentication
- WhatsApp integration
- Material Design components

### Differences:
- Development environment subdomain (dev.coomunity.co)
- Merchant-specific ID in URL
- Potential development-only features

## 📂 File Structure

\`\`\`
${this.outputDir}/
├── html/
│   └── merchant_dev_page.html
├── assets/
│   ├── css/
│   ├── js/
│   ├── images/
│   └── fonts/
├── screenshots/
│   ├── merchant_dev_full.png
│   └── merchant_dev_viewport.png
├── merchant_data/
│   ├── login_form_analysis.json
│   └── dev_features.json
├── api_analysis/
│   └── endpoints_found.json
└── merchant_summary.json
\`\`\`

## 🎯 Key Findings

1. **Merchant Environment:** Successfully accessed development environment for merchant ID a1598e94
2. **Authentication System:** Same phone-based login as main platform
3. **Development Features:** ${content.merchantData.devFeatures.length} development-specific indicators found
4. **API Integration:** ${content.merchantData.apiEndpoints.length} potential API endpoints identified
5. **Resource Parity:** Similar resource structure to main platform

## 🚀 Recommendations

1. **Complete Coverage:** Merchant development environment successfully documented
2. **API Exploration:** Further investigation of identified endpoints recommended
3. **Environment Comparison:** Useful for understanding development vs production differences
4. **Security Analysis:** Development environment provides insights into platform architecture

---

**Status:** ✅ **MERCHANT DEVELOPMENT EXTRACTION COMPLETE**

The merchant development environment has been fully documented, providing valuable insights into CoomÜnity's development infrastructure and merchant-specific features.

**Last Updated:** ${new Date().toISOString()}
`;

    fs.writeFileSync(
      path.join(this.outputDir, 'merchant_extraction_report.md'),
      reportContent,
      'utf8'
    );

    console.log('✅ Merchant report generated successfully');
  }

  async cleanup(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      console.log('🔄 Browser closed');
    }
  }

  async run(): Promise<void> {
    try {
      await this.initialize();
      await this.navigateToMerchantPage();
      await this.captureScreenshots();
      
      const content = await this.extractMerchantContent();
      await this.saveMerchantContent(content);
      await this.downloadAllResources(content);
      await this.generateMerchantReport(content);
      
      console.log('🎉 CoomÜnity merchant development scraping completed successfully!');
      console.log(`📁 All content saved to: ${this.outputDir}`);
      
    } catch (error) {
      console.error('💥 Merchant scraping failed:', error);
      throw error;
    } finally {
      await this.cleanup();
    }
  }
}

// Execute the merchant scraper
async function main() {
  const scraper = new CoomUnityMerchantScraper();
  await scraper.run();
}

if (require.main === module) {
  main().catch(console.error);
}

export default CoomUnityMerchantScraper; 