import { chromium, Browser, Page } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';

interface JourneyStep {
  stepNumber: number;
  url: string;
  title: string;
  interactiveElements: InteractiveElementData[];
  videoData: VideoInfo[];
  clickedElement?: InteractiveElementData;
  navigationSuccess: boolean;
  screenshots: string[];
  timestamp: string;
  timeSpent: number;
  jsExecution?: string;
  pageChanges?: string[];
}

interface InteractiveElementData {
  type: 'button' | 'link' | 'decision' | 'navigation' | 'video' | 'unknown';
  id?: string;
  className?: string;
  text?: string;
  href?: string;
  position: { x: number; y: number; width: number; height: number };
  clickable: boolean;
  selector: string;
  priority: number;
  onclick?: string;
  jsPath?: string;
}

interface VideoInfo {
  id: string;
  src: string;
  type: 'vimeo' | 'youtube' | 'other';
  status: 'working' | 'error' | 'loading';
  playerInfo?: any;
}

interface CompleteJourney {
  journeyId: string;
  startUrl: string;
  startTime: string;
  endTime: string;
  totalSteps: number;
  steps: JourneyStep[];
  discoveredUrls: string[];
  allVideos: VideoInfo[];
  navigationMap: Record<string, string[]>;
  failedAttempts: string[];
}

class RedPillEnhancedJourneyScraper {
  private browser: Browser | null = null;
  private page: Page | null = null;
  private baseDir = './recovered_code/red_pill_enhanced_journey';
  private journeyDir = `${this.baseDir}/video_journeys`;
  private screenshotsDir = `${this.baseDir}/screenshots`;
  private htmlDir = `${this.baseDir}/html_snapshots`;

  private visitedUrls = new Set<string>();
  private allVideos = new Map<string, VideoInfo>();
  private navigationMap = new Map<string, string[]>();
  private failedAttempts: string[] = [];

  // Enhanced navigation patterns
  private navigationSelectors = {
    highPriority: [
      'a[href*="starter"]',
      'a[href*="red-pill"]',
      'a[href*="pilgrim"]',
      'button[onclick*="navigate"]'
    ],
    mediumPriority: [
      '.btn-hexa',
      '.btn-primary',
      'button[onclick]',
      'a[href*="demo.coomunity"]',
      '[data-action]',
      '[data-navigate]'
    ],
    lowPriority: [
      'button:not([disabled])',
      'a[href]:not([href="#"])',
      '[role="button"]'
    ]
  };

  constructor() {
    this.ensureDirectories();
  }

  private ensureDirectories() {
    [this.baseDir, this.journeyDir, this.screenshotsDir, this.htmlDir].forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
  }

  private async takeScreenshot(context: string, stepNumber: number): Promise<string> {
    if (!this.page) return '';
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `step_${stepNumber.toString().padStart(2, '0')}_${context}_${timestamp}.png`;
    const filepath = path.join(this.screenshotsDir, filename);
    
    await this.page.screenshot({ 
      path: filepath, 
      fullPage: true,
      type: 'png'
    });
    
    return filename;
  }

  private async saveHtmlSnapshot(stepNumber: number): Promise<string> {
    if (!this.page) return '';
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `step_${stepNumber.toString().padStart(2, '0')}_${timestamp}.html`;
    const filepath = path.join(this.htmlDir, filename);
    
    const html = await this.page.content();
    fs.writeFileSync(filepath, html);
    
    return filename;
  }

  private async detectVideos(): Promise<VideoInfo[]> {
    if (!this.page) return [];

    try {
      return await this.page.evaluate(() => {
        const videos: VideoInfo[] = [];

        // Enhanced Vimeo detection
        document.querySelectorAll('iframe[src*="vimeo"]').forEach(iframe => {
          const src = iframe.getAttribute('src');
          if (src) {
            const match = src.match(/\/video\/(\d+)/);
            if (match && match[1]) {
              videos.push({
                id: match[1],
                src: src,
                type: 'vimeo',
                status: 'working',
                playerInfo: {
                  width: (iframe as HTMLIFrameElement).clientWidth,
                  height: (iframe as HTMLIFrameElement).clientHeight,
                  visible: (iframe as HTMLElement).offsetWidth > 0
                }
              });
            }
          }
        });

        // Check for embedded players
        document.querySelectorAll('[id*="player"], [class*="player"]').forEach(player => {
          const html = player.innerHTML;
          const vimeoMatch = html.match(/vimeo\.com\/video\/(\d+)/);
          if (vimeoMatch && vimeoMatch[1]) {
            videos.push({
              id: vimeoMatch[1],
              src: `https://vimeo.com/video/${vimeoMatch[1]}`,
              type: 'vimeo',
              status: 'working'
            });
          }
        });

        return videos;
      });
    } catch (error) {
      console.error('Error detecting videos:', error);
      return [];
    }
  }

  private async detectInteractiveElements(): Promise<InteractiveElementData[]> {
    if (!this.page) return [];

    const elements: InteractiveElementData[] = [];

    // Enhanced element detection with priority scoring
    const categories = [
      { selectors: this.navigationSelectors.highPriority, basePriority: 20 },
      { selectors: this.navigationSelectors.mediumPriority, basePriority: 10 },
      { selectors: this.navigationSelectors.lowPriority, basePriority: 5 }
    ];

    for (const category of categories) {
      for (const selector of category.selectors) {
        try {
          // Use page.evaluate for better element handling
          const elements_raw = await this.page.evaluate((sel) => {
            const found = [];
            try {
              const nodeList = document.querySelectorAll(sel);
              nodeList.forEach((el, index) => {
                if ((el as HTMLElement).offsetWidth > 0 && (el as HTMLElement).offsetHeight > 0) { // Only visible elements
                  const rect = el.getBoundingClientRect();
                  found.push({
                    index,
                    tagName: el.tagName,
                    id: (el as HTMLElement).id,
                    className: (el as HTMLElement).className,
                    text: el.textContent?.trim() || '',
                    href: el.getAttribute('href'),
                    onclick: el.getAttribute('onclick'),
                    rect: {
                      x: rect.x,
                      y: rect.y,
                      width: rect.width,
                      height: rect.height
                    }
                  });
                }
              });
            } catch (e) {
              // Skip problematic selectors
            }
            return found;
          }, selector);

          elements_raw.forEach((elementData, i) => {
            const priority = category.basePriority + this.calculateSpecificPriority(elementData.text, elementData.href);
            
            elements.push({
              type: this.categorizeElement(elementData.tagName, elementData.className, elementData.text, elementData.href),
              id: elementData.id,
              className: elementData.className,
              text: elementData.text,
              href: elementData.href,
              position: elementData.rect,
              clickable: true,
              selector: `${selector}:nth-child(${i + 1})`,
              priority,
              onclick: elementData.onclick,
              jsPath: this.generateJSPath(elementData)
            });
          });

        } catch (selectorError) {
          continue;
        }
      }
    }

    // Remove duplicates and sort by priority
    const uniqueElements = elements.filter((el, index, arr) => 
      arr.findIndex(e => e.text === el.text && e.href === el.href) === index
    );

    return uniqueElements.sort((a, b) => b.priority - a.priority);
  }

  private generateJSPath(elementData: any): string {
    if (elementData.id) {
      return `document.getElementById('${elementData.id}')`;
    }
    if (elementData.href) {
      return `document.querySelector('a[href="${elementData.href}"]')`;
    }
    if (elementData.text) {
      return `Array.from(document.querySelectorAll('*')).find(el => el.textContent?.trim() === '${elementData.text}')`;
    }
    return `document.querySelector('${elementData.tagName}')`;
  }

  private categorizeElement(tagName: string, className: string, text: string, href?: string): InteractiveElementData['type'] {
    if (tagName === 'A' && href) return 'link';
    if (tagName === 'BUTTON') return 'button';
    
    const lowerText = text.toLowerCase();
    const lowerClass = className.toLowerCase();
    
    if (lowerText.includes('continuar') || lowerText.includes('continue')) return 'navigation';
    if (lowerText.includes('red') || lowerText.includes('pill')) return 'decision';
    if (lowerClass.includes('btn')) return 'button';
    if (href && href.includes('vimeo')) return 'video';
    
    return 'unknown';
  }

  private calculateSpecificPriority(text: string, href?: string): number {
    let priority = 0;
    
    const lowerText = text.toLowerCase();
    
    // Maximum priority keywords
    if (lowerText.includes('continuar') || lowerText.includes('continue')) priority += 50;
    if (lowerText.includes('siguiente') || lowerText.includes('next')) priority += 40;
    if (lowerText.includes('empezar') || lowerText.includes('start')) priority += 35;
    
    // High priority
    if (lowerText.includes('red') || lowerText.includes('pill')) priority += 30;
    if (lowerText.includes('pilgrim')) priority += 25;
    
    // URL-based priority
    if (href) {
      if (href.includes('starter')) priority += 100;
      if (href.includes('red-pill')) priority += 80;
      if (href.includes('pilgrim')) priority += 60;
      if (href.includes('demo.coomunity')) priority += 20;
    }
    
    return priority;
  }

  private async tryMultipleClickMethods(element: InteractiveElementData): Promise<boolean> {
    if (!this.page) return false;

    const methods = [
      // Method 1: Direct href navigation (highest success rate for links)
      async () => {
        if (element.href && element.type === 'link') {
          await this.page!.goto(element.href);
          return 'direct_navigation';
        }
        throw new Error('Not a link');
      },
      
      // Method 2: JavaScript click via element text
      async () => {
        await this.page!.evaluate((text) => {
          const links = Array.from(document.querySelectorAll('a'));
          const targetLink = links.find(link => link.textContent?.trim() === text);
          if (targetLink) {
            targetLink.click();
            return true;
          }
          throw new Error('Link not found');
        }, element.text);
        return 'js_text_click';
      },
      
      // Method 3: Standard Playwright click
      async () => {
        await this.page!.locator(element.selector).first().click();
        return 'playwright_click';
      },
      
      // Method 4: JavaScript click via generated path
      async () => {
        await this.page!.evaluate((jsPath) => {
          const el = eval(jsPath);
          if (el) el.click();
        }, element.jsPath || '');
        return 'js_path_click';
      },
      
      // Method 5: Force click with coordinates
      async () => {
        await this.page!.mouse.click(
          element.position.x + element.position.width / 2,
          element.position.y + element.position.height / 2
        );
        return 'coordinate_click';
      },
      
      // Method 6: Execute onclick attribute
      async () => {
        if (element.onclick) {
          await this.page!.evaluate((onclick) => {
            eval(onclick);
          }, element.onclick);
          return 'onclick_execution';
        }
        throw new Error('No onclick');
      }
    ];

    for (let i = 0; i < methods.length; i++) {
      try {
        const methodName = await methods[i]();
        console.log(`   ✅ Success with method: ${methodName}`);
        return true;
      } catch (error) {
        console.log(`   ⚠️ Method ${i + 1} failed: ${error.message}`);
        continue;
      }
    }

    return false;
  }

  private async exploreStep(stepNumber: number, currentUrl: string): Promise<JourneyStep> {
    console.log(`\n🔍 === STEP ${stepNumber}: ${currentUrl} ===`);
    
    const stepStart = Date.now();
    const screenshots: string[] = [];
    const pageChanges: string[] = [];

    // Navigate to URL if not already there
    if (this.page!.url() !== currentUrl) {
      await this.page!.goto(currentUrl, { waitUntil: 'networkidle', timeout: 30000 });
    }

    // Wait for any dynamic content
    await this.page!.waitForTimeout(5000);

    // Take initial screenshot
    screenshots.push(await this.takeScreenshot('arrival', stepNumber));

    // Save HTML snapshot
    await this.saveHtmlSnapshot(stepNumber);

    // Get page title
    const title = await this.page!.title();

    // Detect videos
    const videoData = await this.detectVideos();
    console.log(`   🎬 Videos found: ${videoData.length}`);
    
    videoData.forEach(video => {
      this.allVideos.set(video.id, video);
      console.log(`      📺 Vimeo ID: ${video.id}`);
    });

    // Detect interactive elements
    const interactiveElements = await this.detectInteractiveElements();
    console.log(`   🎯 Interactive elements: ${interactiveElements.length}`);

    if (interactiveElements.length > 0) {
      console.log('   📋 Top interactive elements:');
      interactiveElements.slice(0, 5).forEach((element, i) => {
        console.log(`      ${i + 1}. [${element.type}] "${element.text}" (priority: ${element.priority})`);
        if (element.href) console.log(`         → ${element.href}`);
      });
    }

    // Try to interact with the highest priority elements
    let clickedElement: InteractiveElementData | undefined;
    let navigationSuccess = false;
    let jsExecution = '';

    for (const targetElement of interactiveElements.slice(0, 3)) { // Try top 3 elements
      console.log(`\n   👆 Attempting to interact with: "${targetElement.text}" (${targetElement.type})`);
      
      // Take screenshot before clicking
      screenshots.push(await this.takeScreenshot('before_click', stepNumber));

      const originalUrl = this.page!.url();
      
      try {
        const clickSuccess = await this.tryMultipleClickMethods(targetElement);
        
        if (clickSuccess) {
          clickedElement = targetElement;
          
          // Wait for potential navigation or changes
          await this.page!.waitForTimeout(5000);
          
          // Check for URL change
          const newUrl = this.page!.url();
          if (newUrl !== originalUrl) {
            console.log(`   ✅ Navigation successful: ${newUrl}`);
            navigationSuccess = true;
            
            // Update navigation map
            const nextUrls = this.navigationMap.get(currentUrl) || [];
            if (!nextUrls.includes(newUrl)) {
              nextUrls.push(newUrl);
              this.navigationMap.set(currentUrl, nextUrls);
            }
            
            pageChanges.push(`URL changed from ${originalUrl} to ${newUrl}`);
            break;
          } else {
            console.log(`   ⚠️ No URL change, checking for page content changes...`);
            
            // Check for dynamic content changes
            const hasNewContent = await this.page!.evaluate(() => {
              // Look for new elements that might have appeared
              const modals = document.querySelectorAll('[class*="modal"], [class*="popup"], [class*="overlay"]');
              const newVideos = document.querySelectorAll('iframe[src*="vimeo"]');
              return modals.length > 0 || newVideos.length > 0;
            });
            
            if (hasNewContent) {
              pageChanges.push('Dynamic content appeared');
              console.log(`   ⚡ Dynamic content detected`);
            }
          }
          
          // Take screenshot after clicking
          screenshots.push(await this.takeScreenshot('after_click', stepNumber));
        }
        
      } catch (clickError) {
        console.log(`   ❌ All click methods failed: ${clickError}`);
        this.failedAttempts.push(`Step ${stepNumber}: ${targetElement.text} - ${clickError}`);
      }
    }

    const timeSpent = Date.now() - stepStart;

    return {
      stepNumber,
      url: currentUrl,
      title,
      interactiveElements,
      videoData,
      clickedElement,
      navigationSuccess,
      screenshots,
      timestamp: new Date().toISOString(),
      timeSpent,
      jsExecution,
      pageChanges
    };
  }

  async exploreEnhancedJourney(startUrl: string = 'https://demo.coomunity.co/go/c8862dd1'): Promise<void> {
    try {
      console.log('🚀 Red Pill Enhanced Journey Scraper Starting...');
      console.log('🎯 Goal: Map the complete interactive chain with enhanced click methods');
      
      this.browser = await chromium.launch({ 
        headless: false,
        slowMo: 500
      });
      
      this.page = await this.browser.newPage();
      await this.page.setViewportSize({ width: 1920, height: 1080 });

      // Enable JavaScript
      await this.page.addInitScript(() => {
        // Override console.log to see page logs
        window.addEventListener('load', () => {
          console.log('Page loaded, ready for interaction');
        });
      });

      const journeyId = `enhanced_${Date.now()}`;
      const startTime = new Date().toISOString();
      const steps: JourneyStep[] = [];
      
      let currentUrl = startUrl;
      let stepNumber = 1;
      const maxSteps = 8; // Increased limit for longer chains

      this.visitedUrls.add(currentUrl);

      while (stepNumber <= maxSteps && currentUrl) {
        const step = await this.exploreStep(stepNumber, currentUrl);
        steps.push(step);

        // If navigation was successful and we have a new URL
        if (step.navigationSuccess && this.page) {
          const newUrl = this.page.url();
          
          // Check if we've been here before
          if (this.visitedUrls.has(newUrl)) {
            console.log(`\n🔄 Already visited ${newUrl}, stopping to avoid loops`);
            break;
          }
          
          this.visitedUrls.add(newUrl);
          currentUrl = newUrl;
          stepNumber++;
        } else {
          console.log(`\n🛑 No more navigation possible, journey complete`);
          break;
        }

        // Longer delay between steps for dynamic content
        await this.page.waitForTimeout(3000);
      }

      const endTime = new Date().toISOString();

      // Create complete journey report
      const journey: CompleteJourney = {
        journeyId,
        startUrl,
        startTime,
        endTime,
        totalSteps: steps.length,
        steps,
        discoveredUrls: Array.from(this.visitedUrls),
        allVideos: Array.from(this.allVideos.values()),
        navigationMap: Object.fromEntries(this.navigationMap),
        failedAttempts: this.failedAttempts
      };

      // Save journey data
      const journeyPath = path.join(this.journeyDir, `${journeyId}.json`);
      fs.writeFileSync(journeyPath, JSON.stringify(journey, null, 2));

      // Generate summary
      this.generateJourneySummary(journey);

    } catch (error) {
      console.error('❌ Enhanced journey exploration failed:', error);
    } finally {
      if (this.browser) {
        await this.browser.close();
      }
    }
  }

  private generateJourneySummary(journey: CompleteJourney): void {
    console.log('\n🗺️  === ENHANCED JOURNEY SUMMARY ===');
    console.log(`📁 Journey data: ${this.journeyDir}/${journey.journeyId}.json`);
    console.log(`⏱️  Duration: ${journey.startTime} → ${journey.endTime}`);
    console.log(`📍 Steps completed: ${journey.totalSteps}`);
    console.log(`🌐 URLs discovered: ${journey.discoveredUrls.length}`);
    console.log(`🎬 Videos found: ${journey.allVideos.length}`);
    console.log(`❌ Failed attempts: ${journey.failedAttempts.length}`);
    
    console.log('\n📋 Enhanced Journey Chain:');
    journey.steps.forEach((step, i) => {
      console.log(`   ${i + 1}. ${step.url}`);
      if (step.clickedElement) {
        console.log(`      → Clicked: "${step.clickedElement.text}" (${step.clickedElement.type})`);
      }
      if (step.pageChanges && step.pageChanges.length > 0) {
        step.pageChanges.forEach(change => {
          console.log(`      ⚡ Change: ${change}`);
        });
      }
    });

    if (journey.allVideos.length > 0) {
      console.log('\n🎥 All Videos in Enhanced Chain:');
      journey.allVideos.forEach((video, i) => {
        console.log(`   ${i + 1}. [${video.type.toUpperCase()}] ID: ${video.id}`);
      });
    }

    console.log('\n🔗 Navigation Map:');
    Object.entries(journey.navigationMap).forEach(([from, to]) => {
      console.log(`   ${from}`);
      to.forEach(url => console.log(`     → ${url}`));
    });

    if (journey.failedAttempts.length > 0) {
      console.log('\n❌ Failed Attempts:');
      journey.failedAttempts.forEach((attempt, i) => {
        console.log(`   ${i + 1}. ${attempt}`);
      });
    }
  }
}

// Run the enhanced journey scraper
const scraper = new RedPillEnhancedJourneyScraper();
scraper.exploreEnhancedJourney().then(() => {
  console.log('\n✨ Enhanced journey exploration finished!');
  console.log('📁 Check ./recovered_code/red_pill_enhanced_journey/ for detailed results');
}); 