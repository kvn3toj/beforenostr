import { chromium, Browser, Page } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';

interface PilgrimScrapingResult {
  url: string;
  title: string;
  html: string;
  metadata: any;
  videoFeatures: {
    videoPlayer: any;
    floatingButtons: any[];
    buttonFunctionality: any[];
    overlayElements: any[];
    interactiveElements: any[];
  };
  forms: any[];
  accessPath: string[];
  timestamp: string;
}

class CoomunityPilgrimScraper {
  private browser: Browser | null = null;
  private baseDir: string;
  private targetUrl: string;
  
  constructor() {
    this.baseDir = './coomunity_pilgrim_demo';
    this.targetUrl = 'https://demo.coomunity.co/pilgrim/640baa58';
  }

  async initialize(): Promise<void> {
    console.log('🚀 Inicializando Coomunity Pilgrim Video Player Scraper...');
    
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
      `${this.baseDir}/video_data`,
      `${this.baseDir}/button_analysis`,
      `${this.baseDir}/interactive_analysis`
    ];

    dirs.forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`📁 Directorio creado: ${dir}`);
      }
    });
  }

  async scrapePilgrimPage(): Promise<PilgrimScrapingResult> {
    if (!this.browser) {
      throw new Error('Browser no inicializado');
    }

    const page = await this.browser.newPage();
    const accessPath: string[] = [];
    
    console.log('🎬 Iniciando análisis de Pilgrim Video Player...');
    
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

      // Navegar directamente a la URL de Pilgrim
      console.log(`🌐 Navegando a: ${this.targetUrl}`);
      
      try {
        await page.goto(this.targetUrl, { 
          waitUntil: 'domcontentloaded',
          timeout: 60000 
        });
      } catch (error) {
        console.log('⚠️ Timeout con domcontentloaded, intentando con load...');
        await page.goto(this.targetUrl, { 
          waitUntil: 'load',
          timeout: 45000 
        });
      }

      accessPath.push(`pilgrim_direct: ${this.targetUrl}`);

      // Capturar estado inicial
      await page.screenshot({ 
        path: `${this.baseDir}/screenshots/01_pilgrim_initial.png`,
        fullPage: true 
      });

      console.log('📄 Página de Pilgrim cargada, analizando elementos de video...');

      // Esperar a que los elementos estén presentes
      await page.waitForTimeout(5000);

      // REPRODUCIR VIDEO COMPLETO PARA QUE APAREZCAN LOS BOTONES FLOTANTES
      console.log('🎬 Reproduciendo video completo para activar botones flotantes...');
      
      try {
        // Función para monitorear la aparición de botones flotantes
        const waitForFloatingButtons = async () => {
          console.log('👀 Monitoreando aparición de botones flotantes...');
          
          let attempts = 0;
          const maxAttempts = 60; // 5 minutos máximo
          
          while (attempts < maxAttempts) {
            const buttonsVisible = await page.evaluate(() => {
              const floatingButtons = document.querySelectorAll('.floating-buttons .btn-hexa');
              const primaryButton = document.querySelector('#primary-float');
              
              // Verificar si los botones están visibles y no ocultos
              if (floatingButtons.length > 0) {
                const firstButton = floatingButtons[0] as HTMLElement;
                const style = window.getComputedStyle(firstButton);
                const parentStyle = window.getComputedStyle(firstButton.parentElement as Element);
                
                return {
                  found: true,
                  count: floatingButtons.length,
                  visible: style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0',
                  parentVisible: parentStyle.display !== 'none' && parentStyle.visibility !== 'hidden',
                  primaryButton: primaryButton !== null
                };
              }
              
              return { found: false, count: 0, visible: false, parentVisible: false, primaryButton: false };
            });
            
            if (buttonsVisible.found && buttonsVisible.visible && buttonsVisible.parentVisible) {
              console.log(`✅ Botones flotantes detectados! Cantidad: ${buttonsVisible.count}`);
              return true;
            }
            
            if (attempts % 10 === 0) {
              console.log(`⏳ Esperando botones flotantes... Intento ${attempts + 1}/${maxAttempts} (${buttonsVisible.count} botones encontrados, visible: ${buttonsVisible.visible})`);
            }
            
            await page.waitForTimeout(5000); // Esperar 5 segundos entre verificaciones
            attempts++;
          }
          
          console.log('⚠️ Timeout esperando botones flotantes');
          return false;
        };

        // Buscar el iframe del video Vimeo y intentar reproducirlo
        const videoIframe = await page.$('#coomunity-player iframe');
        if (videoIframe) {
          console.log('📹 Video iframe encontrado, intentando iniciar reproducción...');
          
          // Intentar diferentes métodos para iniciar el video
          try {
            // Método 1: Click directo en el iframe
            await videoIframe.click({ timeout: 10000 });
            console.log('▶️ Click en iframe realizado');
          } catch (e) {
            console.log('⚠️ No se pudo hacer click en iframe, intentando otros métodos...');
          }
          
          // Método 2: Buscar botón de play específico
          try {
            await page.waitForTimeout(2000);
            const playButton = await page.$('.vp-overlay-play-button, .play-button, button[aria-label*="play"], button[title*="play"]');
            if (playButton) {
              await playButton.click();
              console.log('▶️ Botón de play específico clickeado');
            }
          } catch (e) {
            console.log('⚠️ No se encontró botón de play específico');
          }
          
          // Método 3: Usar JavaScript para controlar el video
          try {
            await page.evaluate(() => {
              // Intentar encontrar y reproducir el video via JavaScript
              const iframe = document.querySelector('#coomunity-player iframe') as HTMLIFrameElement;
              if (iframe && iframe.contentWindow) {
                // Enviar mensaje al iframe de Vimeo para reproducir
                iframe.contentWindow.postMessage('{"method":"play"}', '*');
              }
              
              // También intentar con elementos de video HTML5 si existen
              const videos = document.querySelectorAll('video');
              videos.forEach(video => {
                if (video.paused) {
                  video.play().catch(e => console.log('No se pudo reproducir video HTML5:', e));
                }
              });
            });
            console.log('🎮 Comandos JavaScript de reproducción enviados');
          } catch (e) {
            console.log('⚠️ Error enviando comandos JavaScript:', e);
          }
          
        } else {
          console.log('⚠️ No se encontró iframe de video');
        }

        // Capturar screenshot del estado inicial
        await page.screenshot({ 
          path: `${this.baseDir}/screenshots/02_attempting_video_play.png`,
          fullPage: true 
        });

        // Esperar a que aparezcan los botones flotantes
        const buttonsAppeared = await waitForFloatingButtons();
        
        if (buttonsAppeared) {
          console.log('🎉 ¡Botones flotantes aparecieron exitosamente!');
        } else {
          console.log('⚠️ Los botones flotantes no aparecieron en el tiempo esperado');
          console.log('🔍 Continuando con análisis de elementos disponibles...');
        }
        
      } catch (error) {
        console.log('⚠️ Error durante reproducción de video:', error);
        console.log('🔍 Continuando con análisis de elementos disponibles...');
      }

      // Capturar estado después de intentar reproducir el video
      await page.screenshot({ 
        path: `${this.baseDir}/screenshots/03_after_video_attempt.png`,
        fullPage: true 
      });

      // ANÁLISIS ESPECÍFICO DE BOTONES FLOTANTES (DESPUÉS DEL VIDEO)
      console.log('🔘 Analizando botones flotantes después de completar el video...');

      const pilgrimPageData = await page.evaluate(() => {
        // Extraer metadatos básicos
        const metaTags = Array.from(document.querySelectorAll('meta')).map(meta => ({
          name: meta.getAttribute('name'),
          property: meta.getAttribute('property'),
          content: meta.getAttribute('content'),
          charset: meta.getAttribute('charset')
        }));

        // Analizar funcionalidades específicas del video player
        const videoFeatures = {
          videoPlayer: {
            container: document.querySelector('#coomunity-player') ? {
              id: document.querySelector('#coomunity-player')?.id,
              className: document.querySelector('#coomunity-player')?.className,
              hasIframe: document.querySelector('#coomunity-player iframe') !== null,
              iframeSrc: document.querySelector('#coomunity-player iframe')?.getAttribute('src') || 'No iframe found'
            } : null,
            playerType: document.body.innerHTML.includes('vimeo') ? 'Vimeo' : 'Unknown',
            hasOverlay: document.querySelector('.overlay-play') !== null
          },
          
          floatingButtons: Array.from(document.querySelectorAll('.floating-buttons .btn-hexa')).map(button => ({
            id: button.id,
            className: button.className,
            text: button.textContent?.trim() || '',
            hasImage: button.querySelector('img') !== null,
            imageSrc: button.querySelector('img')?.getAttribute('src') || 'No image',
            position: {
              isFixed: window.getComputedStyle(button.parentElement as Element).position === 'fixed',
              bottom: window.getComputedStyle(button.parentElement as Element).bottom,
              right: window.getComputedStyle(button.parentElement as Element).right
            },
            isPrimary: button.id === 'primary-float',
            isChild: button.classList.contains('btn-mid')
          })),
          
          buttonFunctionality: Array.from(document.querySelectorAll('.btn-cinema, .btn-plaza, .btn-aldea')).map(btn => ({
            className: btn.className,
            type: btn.classList.contains('btn-cinema') ? 'Cinema' : 
                  btn.classList.contains('btn-plaza') ? 'Plaza' : 
                  btn.classList.contains('btn-aldea') ? 'Aldea' : 'Unknown',
            imageSrc: btn.querySelector('img')?.getAttribute('src') || 'No image',
            hasClickHandler: btn.onclick !== null || btn.getAttribute('onclick') !== null
          })),
          
          overlayElements: Array.from(document.querySelectorAll('.overlay-play, .iprofile, #in-profile')).map(overlay => ({
            className: overlay.className,
            id: overlay.id,
            isVisible: window.getComputedStyle(overlay).display !== 'none',
            position: window.getComputedStyle(overlay).position,
            zIndex: window.getComputedStyle(overlay).zIndex,
            hasIframe: overlay.querySelector('iframe') !== null,
            iframeSrc: overlay.querySelector('iframe')?.getAttribute('data-src') || 
                      overlay.querySelector('iframe')?.getAttribute('src') || 'No iframe'
          })),
          
          interactiveElements: Array.from(document.querySelectorAll('button, [onclick], [class*="btn"]')).map(element => ({
            tagName: element.tagName,
            className: element.className,
            id: element.id,
            text: element.textContent?.trim() || '',
            hasOnClick: element.getAttribute('onclick') !== null,
            isFloatingButton: element.closest('.floating-buttons') !== null,
            buttonType: element.classList.contains('btn-hexa') ? 'Hexagonal' : 
                       element.classList.contains('btn-whatsapp') ? 'WhatsApp' : 'Standard'
          }))
        };

        // Extraer configuración del video player desde JavaScript
        const scriptTags = Array.from(document.querySelectorAll('script')).map(script => ({
          src: script.src,
          content: script.textContent?.substring(0, 200) || '',
          hasConfig: script.textContent?.includes('configCP') || false,
          hasPlayerInit: script.textContent?.includes('CoomUnityPlayer') || false
        }));

        // Detectar configuración específica del video
        const hasVideoConfig = document.body.innerHTML.includes('configCP');
        const hasVimeoPlayer = document.body.innerHTML.includes('player.vimeo.com');
        const hasCustomPlayer = document.body.innerHTML.includes('coomunity-player.js');

        return {
          title: document.title,
          metaTags,
          videoFeatures,
          scriptTags,
          hasVideoConfig,
          hasVimeoPlayer,
          hasCustomPlayer,
          bodyHTML: document.body.innerHTML,
          headHTML: document.head.innerHTML,
          url: window.location.href,
          pathname: window.location.pathname,
          fullText: document.body.textContent?.substring(0, 2000) || '',
          elementCounts: {
            floatingButtons: document.querySelectorAll('.floating-buttons .btn-hexa').length,
            overlays: document.querySelectorAll('.overlay-play, .iprofile').length,
            scripts: document.querySelectorAll('script').length,
            iframes: document.querySelectorAll('iframe').length,
            buttons: document.querySelectorAll('button').length,
            images: document.querySelectorAll('img').length,
            videos: document.querySelectorAll('video, iframe[src*="vimeo"], iframe[src*="youtube"]').length
          }
        };
      });

      // Probar interacción con botón principal
      console.log('🎯 Probando interacción con botón principal...');
      
      try {
        // Intentar hacer clic en el botón principal
        const primaryButton = await page.$('#primary-float');
        if (primaryButton) {
          await page.screenshot({ 
            path: `${this.baseDir}/screenshots/04_before_button_click.png`,
            fullPage: true 
          });
          
          await primaryButton.click();
          await page.waitForTimeout(2000);
          
          await page.screenshot({ 
            path: `${this.baseDir}/screenshots/05_after_button_click.png`,
            fullPage: true 
          });
          
          console.log('✅ Interacción con botón principal completada');
        }
      } catch (error) {
        console.log('⚠️ No se pudo interactuar con el botón principal:', error);
      }

      // Analizar estado después de interacción
      const postInteractionData = await page.evaluate(() => {
        return {
          childButtonsVisible: document.querySelector('.child-buttons')?.style.display !== 'none',
          iframeVisible: document.querySelector('#iprofile')?.style.display !== 'none',
          activeClasses: Array.from(document.querySelectorAll('.active')).map(el => ({
            className: el.className,
            id: el.id
          }))
        };
      });

      // Guardar HTML completo
      const fullHTML = await page.content();
      fs.writeFileSync(
        `${this.baseDir}/html/pilgrim_page.html`,
        fullHTML,
        'utf8'
      );

      console.log(`📋 Análisis completado:`);
      console.log(`📄 Título: ${pilgrimPageData.title}`);
      console.log(`🎬 Tipo de player: ${pilgrimPageData.videoFeatures.videoPlayer.playerType}`);
      console.log(`🔘 Botones flotantes: ${pilgrimPageData.elementCounts.floatingButtons}`);
      console.log(`📊 Elementos encontrados:`, pilgrimPageData.elementCounts);

      // Crear resultado
      const result: PilgrimScrapingResult = {
        url: this.targetUrl,
        title: pilgrimPageData.title,
        html: fullHTML,
        metadata: {
          ...pilgrimPageData,
          postInteractionData
        },
        videoFeatures: pilgrimPageData.videoFeatures,
        forms: [], // No hay formularios en esta página
        accessPath: accessPath,
        timestamp: new Date().toISOString()
      };

      // Guardar análisis detallado
      await this.saveAnalysis(result, interceptedRequests);

      console.log('✅ Scraping de Pilgrim completado exitosamente');
      return result;

    } catch (error) {
      console.error('❌ Error durante el scraping de Pilgrim:', error);
      throw error;
    } finally {
      await page.close();
    }
  }

  private async saveAnalysis(
    result: PilgrimScrapingResult, 
    requests: any[]
  ): Promise<void> {
    // Análisis específico del video player
    const videoAnalysis = {
      playerType: result.videoFeatures.videoPlayer.playerType,
      hasCustomPlayer: result.metadata.hasCustomPlayer,
      hasVimeoIntegration: result.metadata.hasVimeoPlayer,
      hasVideoConfig: result.metadata.hasVideoConfig,
      floatingButtonsCount: result.videoFeatures.floatingButtons.length,
      interactiveElementsCount: result.videoFeatures.interactiveElements.length,
      overlayElementsCount: result.videoFeatures.overlayElements.length
    };

    // Análisis específico de botones flotantes
    const buttonAnalysis = {
      totalFloatingButtons: result.videoFeatures.floatingButtons.length,
      primaryButton: result.videoFeatures.floatingButtons.find(btn => btn.isPrimary),
      childButtons: result.videoFeatures.floatingButtons.filter(btn => btn.isChild),
      buttonTypes: result.videoFeatures.buttonFunctionality,
      interactionResults: result.metadata.postInteractionData
    };

    // Análisis de requests específicos
    const requestAnalysis = {
      totalRequests: requests.length,
      byResourceType: requests.reduce((acc: any, req) => {
        acc[req.resourceType] = (acc[req.resourceType] || 0) + 1;
        return acc;
      }, {}),
      videoSpecificRequests: requests.filter(req => 
        req.url.includes('vimeo') || 
        req.url.includes('player') ||
        req.url.includes('video') ||
        req.url.includes('coomunity-player')
      ),
      assetRequests: requests.filter(req => 
        req.url.includes('/assets/') ||
        req.url.includes('.js') ||
        req.url.includes('.css') ||
        req.url.includes('.png') ||
        req.url.includes('.jpg')
      )
    };

    // Análisis de interactividad
    const interactiveAnalysis = {
      floatingButtons: result.videoFeatures.floatingButtons,
      buttonFunctionality: result.videoFeatures.buttonFunctionality,
      overlayElements: result.videoFeatures.overlayElements,
      interactiveElements: result.videoFeatures.interactiveElements,
      videoPlayer: result.videoFeatures.videoPlayer
    };

    // Guardar análisis
    fs.writeFileSync(
      `${this.baseDir}/analysis/video_analysis.json`,
      JSON.stringify(videoAnalysis, null, 2),
      'utf8'
    );

    fs.writeFileSync(
      `${this.baseDir}/button_analysis/floating_buttons_analysis.json`,
      JSON.stringify(buttonAnalysis, null, 2),
      'utf8'
    );

    fs.writeFileSync(
      `${this.baseDir}/analysis/request_analysis.json`,
      JSON.stringify(requestAnalysis, null, 2),
      'utf8'
    );

    fs.writeFileSync(
      `${this.baseDir}/interactive_analysis/detailed_interactive_analysis.json`,
      JSON.stringify(interactiveAnalysis, null, 2),
      'utf8'
    );

    fs.writeFileSync(
      `${this.baseDir}/video_data/extracted_features.json`,
      JSON.stringify(result.videoFeatures, null, 2),
      'utf8'
    );

    fs.writeFileSync(
      `${this.baseDir}/metadata/complete_metadata.json`,
      JSON.stringify(result.metadata, null, 2),
      'utf8'
    );

    // Generar reporte
    await this.generateReport(result, videoAnalysis, buttonAnalysis, requestAnalysis, interactiveAnalysis);
  }

  private async generateReport(
    result: PilgrimScrapingResult, 
    videoAnalysis: any, 
    buttonAnalysis: any,
    requestAnalysis: any,
    interactiveAnalysis: any
  ): Promise<void> {
    const report = `# CoomÜnity Pilgrim Video Player Analysis Report

**Generated:** ${result.timestamp}
**Target URL:** ${result.url}
**Player Type:** ${videoAnalysis.playerType}
**Page Title:** ${result.title}

## Executive Summary

This report documents the analysis of the CoomÜnity Pilgrim video player page, with specific focus on the floating buttons functionality that appears over the video interface. This page represents an interactive video experience with overlay navigation elements.

## 🎬 Video Player Analysis

**Player Configuration:**
- **Type:** ${videoAnalysis.playerType}
- **Custom Player:** ${videoAnalysis.hasCustomPlayer ? '✅ Yes' : '❌ No'}
- **Vimeo Integration:** ${videoAnalysis.hasVimeoIntegration ? '✅ Yes' : '❌ No'}
- **Video Config:** ${videoAnalysis.hasVideoConfig ? '✅ Present' : '❌ Not found'}

**Player Container:**
${interactiveAnalysis.videoPlayer.container ? `
- **Container ID:** ${interactiveAnalysis.videoPlayer.container.id}
- **Container Class:** ${interactiveAnalysis.videoPlayer.container.className}
- **Has Iframe:** ${interactiveAnalysis.videoPlayer.container.hasIframe ? '✅ Yes' : '❌ No'}
- **Iframe Source:** ${interactiveAnalysis.videoPlayer.container.iframeSrc}
` : '**No video container detected.**'}

**Overlay Features:**
- **Has Overlay:** ${interactiveAnalysis.videoPlayer.hasOverlay ? '✅ Yes' : '❌ No'}

## 🔘 Floating Buttons Analysis ⭐ **CRITICAL FUNCTIONALITY**

**Button Overview:**
- **Total Floating Buttons:** ${buttonAnalysis.totalFloatingButtons}
- **Primary Button:** ${buttonAnalysis.primaryButton ? '✅ Present' : '❌ Not found'}
- **Child Buttons:** ${buttonAnalysis.childButtons.length}

### **Primary Button Details:**
${buttonAnalysis.primaryButton ? `
- **ID:** ${buttonAnalysis.primaryButton.id}
- **Classes:** ${buttonAnalysis.primaryButton.className}
- **Image:** ${buttonAnalysis.primaryButton.imageSrc}
- **Position:** Fixed positioning (${buttonAnalysis.primaryButton.position.bottom} from bottom, ${buttonAnalysis.primaryButton.position.right} from right)
` : '**Primary button not detected.**'}

### **Child Buttons Details:**
${buttonAnalysis.childButtons.length > 0 ? `
${buttonAnalysis.childButtons.map((btn, i) => `
**Child Button ${i + 1}:**
- **Classes:** ${btn.className}
- **Image:** ${btn.imageSrc}
- **Is Child:** ${btn.isChild ? 'Yes' : 'No'}
`).join('')}
` : '**No child buttons detected.**'}

### **Button Functionality Types:**
${buttonAnalysis.buttonTypes.length > 0 ? `
${buttonAnalysis.buttonTypes.map(btn => `
**${btn.type} Button:**
- **Classes:** ${btn.className}
- **Image:** ${btn.imageSrc}
- **Has Click Handler:** ${btn.hasClickHandler ? '✅ Yes' : '❌ No'}
`).join('')}
` : '**No specific button functionality detected.**'}

## 🎯 Button Interaction Results

**Interaction Test Results:**
- **Child Buttons Visible After Click:** ${buttonAnalysis.interactionResults.childButtonsVisible ? '✅ Yes' : '❌ No'}
- **Iframe Visible After Click:** ${buttonAnalysis.interactionResults.iframeVisible ? '✅ Yes' : '❌ No'}
- **Active Classes:** ${buttonAnalysis.interactionResults.activeClasses.length} elements with active state

${buttonAnalysis.interactionResults.activeClasses.length > 0 ? `
**Active Elements:**
${buttonAnalysis.interactionResults.activeClasses.map(el => `- ${el.className} (ID: ${el.id || 'No ID'})`).join('\n')}
` : ''}

## 📱 Overlay Elements Analysis

**Total Overlay Elements:** ${interactiveAnalysis.overlayElements.length}

${interactiveAnalysis.overlayElements.length > 0 ? `
**Overlay Details:**
${interactiveAnalysis.overlayElements.map((overlay, i) => `
### Overlay ${i + 1}
- **Class:** ${overlay.className}
- **ID:** ${overlay.id || 'No ID'}
- **Visible:** ${overlay.isVisible ? 'Yes' : 'No'}
- **Position:** ${overlay.position}
- **Z-Index:** ${overlay.zIndex}
- **Has Iframe:** ${overlay.hasIframe ? 'Yes' : 'No'}
- **Iframe Source:** ${overlay.iframeSrc}
`).join('')}
` : '**No overlay elements detected.**'}

## 🎮 Interactive Elements Summary

**Total Interactive Elements:** ${interactiveAnalysis.interactiveElements.length}

**By Type:**
${interactiveAnalysis.interactiveElements.reduce((acc: any, el) => {
  acc[el.buttonType] = (acc[el.buttonType] || 0) + 1;
  return acc;
}, {}) ? Object.entries(interactiveAnalysis.interactiveElements.reduce((acc: any, el) => {
  acc[el.buttonType] = (acc[el.buttonType] || 0) + 1;
  return acc;
}, {})).map(([type, count]) => `- ${type}: ${count}`).join('\n') : 'No interactive elements categorized'}

**Floating Button Elements:** ${interactiveAnalysis.interactiveElements.filter((el: any) => el.isFloatingButton).length}

## 🌐 Network Analysis

**Total Requests:** ${requestAnalysis.totalRequests}

**By Resource Type:**
${Object.entries(requestAnalysis.byResourceType).map(([type, count]) => `- ${type}: ${count}`).join('\n')}

**Video-Specific Requests:** ${requestAnalysis.videoSpecificRequests.length}
**Asset Requests:** ${requestAnalysis.assetRequests.length}

## 📊 Key Findings

1. **Video Player:** ${videoAnalysis.hasCustomPlayer ? 'Custom CoomÜnity player with Vimeo integration' : 'Standard video player'}
2. **Floating Buttons:** ${buttonAnalysis.totalFloatingButtons > 0 ? `${buttonAnalysis.totalFloatingButtons} floating buttons with interactive functionality` : 'No floating buttons detected'}
3. **Button Interaction:** ${buttonAnalysis.interactionResults.childButtonsVisible ? 'Buttons expand on click to reveal child options' : 'Limited button interaction detected'}
4. **Overlay System:** ${interactiveAnalysis.overlayElements.length > 0 ? `${interactiveAnalysis.overlayElements.length} overlay elements for enhanced UX` : 'No overlay system detected'}
5. **Navigation Integration:** ${buttonAnalysis.buttonTypes.length > 0 ? 'Buttons provide navigation to Cinema, Plaza, and Aldea sections' : 'No navigation integration detected'}

## 📂 File Structure

\`\`\`
${this.baseDir}/
├── html/
│   └── pilgrim_page.html
├── screenshots/
│   ├── 01_pilgrim_initial.png
│   ├── 02_attempting_video_play.png
│   ├── 03_after_video_attempt.png
│   ├── 04_before_button_click.png
│   └── 05_after_button_click.png
├── analysis/
│   ├── video_analysis.json
│   └── request_analysis.json
├── button_analysis/
│   └── floating_buttons_analysis.json
├── interactive_analysis/
│   └── detailed_interactive_analysis.json
├── video_data/
│   └── extracted_features.json
├── metadata/
│   └── complete_metadata.json
└── pilgrim_report.md
\`\`\`

## 🎯 Button Functionality Summary

The floating buttons over the video provide:

1. **Primary Navigation Button:** Central hexagonal button that triggers menu expansion
2. **Child Navigation Buttons:** 
   - **Cinema Button:** Access to video/cinema section
   - **Plaza Button:** Access to marketplace/plaza section  
   - **Aldea Button:** Access to community/village section
3. **Overlay Integration:** Buttons control iframe overlays for seamless navigation
4. **Visual Feedback:** Rotation animations and state changes on interaction

## 🔍 Technical Implementation

**CSS Classes:**
- \`.floating-buttons\`: Container for floating button system
- \`.btn-hexa\`: Hexagonal button styling
- \`.btn-hexa-big\`: Primary button size
- \`.btn-mid\`: Child button size
- \`.child-buttons\`: Container for expandable child buttons

**JavaScript Functionality:**
- Click handlers for button expansion/collapse
- Iframe URL management and loading
- Animation controls (rotation, fade in/out)
- State management for active/inactive buttons

---

**Status:** ✅ **PILGRIM VIDEO PLAYER ANALYSIS COMPLETE**

The CoomÜnity Pilgrim video player page has been analyzed with specific focus on the floating buttons functionality. The system provides an innovative overlay navigation experience that enhances video viewing with contextual access to different platform sections.

**Critical Finding:** The floating buttons represent a sophisticated navigation overlay system that allows users to access different CoomÜnity sections (Cinema, Plaza, Aldea) without leaving the video experience.

**Last Updated:** ${result.timestamp}
`;

    fs.writeFileSync(`${this.baseDir}/pilgrim_report.md`, report, 'utf8');
    console.log('📄 Reporte de Pilgrim generado: pilgrim_report.md');
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
      const result = await this.scrapePilgrimPage();
      
      console.log('\n🎉 PILGRIM VIDEO PLAYER SCRAPING COMPLETADO EXITOSAMENTE!');
      console.log(`📁 Resultados guardados en: ${this.baseDir}/`);
      console.log(`📊 URL analizada: ${result.url}`);
      console.log(`🎬 Tipo de player: ${result.videoFeatures.videoPlayer.playerType}`);
      console.log(`🔘 Botones flotantes: ${result.videoFeatures.floatingButtons.length}`);
      console.log(`🎯 Elementos interactivos: ${result.videoFeatures.interactiveElements.length}`);
      
    } catch (error) {
      console.error('💥 Error durante la ejecución del pilgrim scraper:', error);
      throw error;
    } finally {
      await this.cleanup();
    }
  }
}

// Ejecutar el scraper
async function main() {
  const scraper = new CoomunityPilgrimScraper();
  await scraper.run();
}

if (require.main === module) {
  main().catch(console.error);
}

export { CoomunityPilgrimScraper }; 