import { chromium, Browser, Page } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';

interface InteractiveElement {
  type: 'button' | 'overlay' | 'decision' | 'control' | 'link' | 'unknown';
  id?: string;
  className?: string;
  text?: string;
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  visible: boolean;
  clickable: boolean;
  timeAppeared?: number;
  attributes: Record<string, string>;
  selector: string;
}

interface VideoState {
  playing: boolean;
  currentTime: number;
  duration: number;
  buffering: boolean;
  hasControls: boolean;
  isFullscreen: boolean;
  hasInteractionPoints: boolean;
}

interface InteractiveSession {
  timestamp: string;
  url: string;
  videoState: VideoState;
  interactiveElements: InteractiveElement[];
  screenshots: string[];
  totalElementsDetected: number;
  sessionDuration: number;
}

class RedPillInteractiveExplorer {
  private browser: Browser | null = null;
  private page: Page | null = null;
  private baseDir = './recovered_code/red_pill_interactive';
  private sessionsDir = `${this.baseDir}/sessions`;
  private screenshotsDir = `${this.baseDir}/screenshots`;
  private interactionMapsDir = `${this.baseDir}/interaction_maps`;
  
  private sessionStart = Date.now();
  private elementHistory: InteractiveElement[][] = [];

  // Known interaction patterns from the InteractiveVideoPlayer component
  private interactionSelectors = {
    // ReactPlayer controls
    playerControls: [
      '.react-player__controls',
      '[class*="react-player"]',
      'button[aria-label*="play"]',
      'button[aria-label*="pause"]',
      'button[aria-label*="volume"]',
      'button[aria-label*="fullscreen"]'
    ],
    
    // CoomÜnity custom elements
    interactionPoints: [
      '[class*="interaction"]',
      '[data-interaction]',
      '[class*="decision"]',
      '[data-decision]',
      '.absolute.z-30', // From the component CSS classes
      '[class*="top-8"]',
      '[class*="bottom-16"]',
      '[class*="translate"]'
    ],
    
    // Time-based overlays
    overlays: [
      '.absolute[class*="transition"]',
      '[class*="opacity"]',
      '[class*="fade"]',
      '.overlay',
      '[data-time]',
      '[data-start]',
      '[data-end]'
    ],
    
    // Interactive buttons
    buttons: [
      'button:not([disabled])',
      '[role="button"]',
      '.btn',
      '[onclick]',
      '[data-action]',
      'a[href*="red-pill"]',
      'a[href*="pilgrim"]',
      '[class*="choice"]',
      '[class*="option"]'
    ],
    
    // Video-specific elements
    videoElements: [
      'video',
      'iframe[src*="vimeo"]',
      'iframe[src*="youtube"]',
      '[class*="player"]',
      '[id*="player"]'
    ]
  };

  constructor() {
    this.ensureDirectories();
  }

  private ensureDirectories() {
    [this.baseDir, this.sessionsDir, this.screenshotsDir, this.interactionMapsDir].forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
  }

  private async takeScreenshot(context: string): Promise<string> {
    if (!this.page) return '';
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `interactive_${context}_${timestamp}.png`;
    const filepath = path.join(this.screenshotsDir, filename);
    
    await this.page.screenshot({ 
      path: filepath, 
      fullPage: true,
      type: 'png'
    });
    
    return filename;
  }

  private async detectVideoState(): Promise<VideoState> {
    if (!this.page) {
      return {
        playing: false,
        currentTime: 0,
        duration: 0,
        buffering: false,
        hasControls: false,
        isFullscreen: false,
        hasInteractionPoints: false
      };
    }

    try {
      return await this.page.evaluate(() => {
        // Check for video elements
        const videoElement = document.querySelector('video');
        const hasReactPlayer = !!document.querySelector('[class*="react-player"]');
        const hasVimeoPlayer = !!document.querySelector('iframe[src*="vimeo"]');
        
        let videoState = {
          playing: false,
          currentTime: 0,
          duration: 0,
          buffering: false,
          hasControls: false,
          isFullscreen: !!document.fullscreenElement,
          hasInteractionPoints: false
        };

        if (videoElement) {
          videoState.playing = !videoElement.paused;
          videoState.currentTime = videoElement.currentTime;
          videoState.duration = videoElement.duration || 0;
          videoState.buffering = videoElement.readyState < 3;
          videoState.hasControls = videoElement.controls;
        }

        // Check for interaction points (based on our component structure)
        const interactionElements = document.querySelectorAll(
          '.absolute.z-30, [data-interaction], [class*="interaction"], [class*="decision"]'
        );
        videoState.hasInteractionPoints = interactionElements.length > 0;

        return videoState;
      });
    } catch (error) {
      console.error('Error detecting video state:', error);
      return {
        playing: false,
        currentTime: 0,
        duration: 0,
        buffering: false,
        hasControls: false,
        isFullscreen: false,
        hasInteractionPoints: false
      };
    }
  }

  private async detectInteractiveElements(): Promise<InteractiveElement[]> {
    if (!this.page) return [];

    try {
      const elements: InteractiveElement[] = [];

      // Check each category of selectors
      for (const [category, selectors] of Object.entries(this.interactionSelectors)) {
        for (const selector of selectors) {
          try {
            const locator = this.page.locator(selector);
            const count = await locator.count();

            for (let i = 0; i < count; i++) {
              const element = locator.nth(i);
              
              try {
                const isVisible = await element.isVisible();
                const isEnabled = await element.isEnabled();
                const boundingBox = await element.boundingBox();
                
                if (boundingBox) {
                  const elementInfo = await element.evaluate((el) => ({
                    id: el.id,
                    className: el.className,
                    tagName: el.tagName,
                    text: el.textContent?.trim()?.substring(0, 100) || '',
                    attributes: Array.from(el.attributes).reduce((acc, attr) => {
                      acc[attr.name] = attr.value;
                      return acc;
                    }, {} as Record<string, string>)
                  }));

                  elements.push({
                    type: this.categorizeElement(category, elementInfo.tagName, elementInfo.className),
                    id: elementInfo.id,
                    className: elementInfo.className,
                    text: elementInfo.text,
                    position: {
                      x: boundingBox.x,
                      y: boundingBox.y,
                      width: boundingBox.width,
                      height: boundingBox.height
                    },
                    visible: isVisible,
                    clickable: isEnabled && isVisible,
                    timeAppeared: Date.now() - this.sessionStart,
                    attributes: elementInfo.attributes,
                    selector: selector
                  });
                }
              } catch (elementError) {
                // Skip problematic elements
                continue;
              }
            }
          } catch (selectorError) {
            // Skip problematic selectors
            continue;
          }
        }
      }

      return elements;
    } catch (error) {
      console.error('Error detecting interactive elements:', error);
      return [];
    }
  }

  private categorizeElement(category: string, tagName: string, className: string): InteractiveElement['type'] {
    if (category === 'buttons' || tagName === 'BUTTON') return 'button';
    if (category === 'overlays') return 'overlay';
    if (category === 'interactionPoints') return 'decision';
    if (category === 'playerControls') return 'control';
    if (tagName === 'A') return 'link';
    
    // Smart detection based on class names
    const lowerClass = className.toLowerCase();
    if (lowerClass.includes('decision') || lowerClass.includes('choice')) return 'decision';
    if (lowerClass.includes('control') || lowerClass.includes('player')) return 'control';
    if (lowerClass.includes('overlay') || lowerClass.includes('absolute')) return 'overlay';
    if (lowerClass.includes('btn') || lowerClass.includes('button')) return 'button';
    
    return 'unknown';
  }

  private async monitorInteractiveSession(url: string, duration: number = 120): Promise<InteractiveSession> {
    console.log(`🎮 Starting interactive monitoring session for ${duration}s`);
    console.log(`🌐 URL: ${url}`);

    const sessionId = Date.now();
    const screenshots: string[] = [];
    let maxElements = 0;

    // Navigate to the URL
    await this.page!.goto(url, { waitUntil: 'networkidle' });
    
    // Initial screenshot
    screenshots.push(await this.takeScreenshot(`session_${sessionId}_start`));

    const endTime = Date.now() + (duration * 1000);
    let iteration = 0;

    while (Date.now() < endTime) {
      iteration++;
      console.log(`\n🔍 Scan ${iteration} (${Math.floor((endTime - Date.now()) / 1000)}s remaining)`);

      // Detect current state
      const videoState = await this.detectVideoState();
      const elements = await this.detectInteractiveElements();
      
      // Track element history
      this.elementHistory.push(elements);
      maxElements = Math.max(maxElements, elements.length);

      // Log findings
      console.log(`   📺 Video: ${videoState.playing ? 'Playing' : 'Paused'} | Time: ${videoState.currentTime.toFixed(1)}s`);
      console.log(`   🎯 Interactive elements: ${elements.length}`);
      console.log(`   🔘 Clickable elements: ${elements.filter(e => e.clickable).length}`);
      console.log(`   ⚡ Interaction points: ${videoState.hasInteractionPoints ? 'YES' : 'NO'}`);

      // Take screenshot if significant changes
      if (elements.length > 0 && (iteration % 5 === 0 || elements.length !== (this.elementHistory[this.elementHistory.length - 2]?.length || 0))) {
        screenshots.push(await this.takeScreenshot(`session_${sessionId}_scan_${iteration}`));
      }

      // Try to interact with new elements
      const clickableElements = elements.filter(e => e.clickable && e.type === 'decision');
      if (clickableElements.length > 0) {
        console.log(`   🎯 Found ${clickableElements.length} decision elements!`);
        
        // Take screenshot before clicking
        screenshots.push(await this.takeScreenshot(`session_${sessionId}_decision_${iteration}`));
        
        // Click the first decision element
        try {
          const firstDecision = clickableElements[0];
          console.log(`   👆 Clicking: "${firstDecision.text}" (${firstDecision.selector})`);
          
          await this.page!.locator(firstDecision.selector).first().click();
          await this.page!.waitForTimeout(3000); // Wait for response
          
          // Take screenshot after clicking
          screenshots.push(await this.takeScreenshot(`session_${sessionId}_after_click_${iteration}`));
        } catch (clickError) {
          console.log(`   ❌ Click failed: ${clickError}`);
        }
      }

      // Wait before next scan
      await this.page!.waitForTimeout(3000);
    }

    // Final screenshot
    screenshots.push(await this.takeScreenshot(`session_${sessionId}_end`));

    // Final state detection
    const finalVideoState = await this.detectVideoState();
    const finalElements = await this.detectInteractiveElements();

    const session: InteractiveSession = {
      timestamp: new Date().toISOString(),
      url,
      videoState: finalVideoState,
      interactiveElements: finalElements,
      screenshots,
      totalElementsDetected: maxElements,
      sessionDuration: duration
    };

    // Save session data
    const sessionPath = path.join(this.sessionsDir, `interactive_session_${sessionId}.json`);
    fs.writeFileSync(sessionPath, JSON.stringify(session, null, 2));

    console.log(`\n📊 Session completed!`);
    console.log(`   📁 Session data: ${sessionPath}`);
    console.log(`   📸 Screenshots taken: ${screenshots.length}`);
    console.log(`   🎯 Max elements detected: ${maxElements}`);

    return session;
  }

  async explore(): Promise<void> {
    try {
      console.log('🎮 Red Pill Interactive Explorer Starting...');
      console.log('🎯 Focus: Interactive Elements, Decisions, Overlays');
      
      this.browser = await chromium.launch({ 
        headless: false,
        slowMo: 200
      });
      
      this.page = await this.browser.newPage();
      await this.page.setViewportSize({ width: 1920, height: 1080 });

      // Known working URLs with interactive elements
      const urlsToExplore = [
        'https://demo.coomunity.co/pilgrim/640baa58', // Has 4 interactive elements
        'https://demo.coomunity.co/go/c8862dd1'       // Red pill original
      ];

      const sessions: InteractiveSession[] = [];

      for (const url of urlsToExplore) {
        console.log(`\n🌐 === EXPLORING INTERACTIVE EXPERIENCE: ${url} ===`);
        
        const session = await this.monitorInteractiveSession(url, 60); // 1 minute per URL
        sessions.push(session);
        
        // Wait between sessions
        await this.page.waitForTimeout(2000);
      }

      // Generate comprehensive report
      this.generateInteractiveReport(sessions);

    } catch (error) {
      console.error('❌ Interactive exploration failed:', error);
    } finally {
      if (this.browser) {
        await this.browser.close();
      }
    }
  }

  private generateInteractiveReport(sessions: InteractiveSession[]): void {
    const report = {
      explorationDate: new Date().toISOString(),
      totalSessions: sessions.length,
      sessions,
      summary: {
        totalElementsFound: sessions.reduce((sum, s) => sum + s.totalElementsDetected, 0),
        totalScreenshots: sessions.reduce((sum, s) => sum + s.screenshots.length, 0),
        interactiveUrls: sessions.filter(s => s.totalElementsDetected > 0).length,
        elementTypes: this.analyzeElementTypes(sessions)
      }
    };

    const reportPath = path.join(this.interactionMapsDir, `interactive_exploration_${Date.now()}.json`);
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    console.log('\n🎯 === INTERACTIVE EXPLORATION SUMMARY ===');
    console.log(`📁 Report: ${reportPath}`);
    console.log(`🎮 Sessions: ${sessions.length}`);
    console.log(`🎯 Total elements: ${report.summary.totalElementsFound}`);
    console.log(`📸 Screenshots: ${report.summary.totalScreenshots}`);
    console.log(`✅ Interactive URLs: ${report.summary.interactiveUrls}/${sessions.length}`);
  }

  private analyzeElementTypes(sessions: InteractiveSession[]): Record<string, number> {
    const typeCounts: Record<string, number> = {};
    
    sessions.forEach(session => {
      session.interactiveElements.forEach(element => {
        typeCounts[element.type] = (typeCounts[element.type] || 0) + 1;
      });
    });

    return typeCounts;
  }
}

// Run the interactive explorer
const explorer = new RedPillInteractiveExplorer();
explorer.explore().then(() => {
  console.log('\n✨ Interactive exploration completed!');
  console.log('📁 Check ./recovered_code/red_pill_interactive/ for detailed results');
}); 