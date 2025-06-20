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
  priority: number; // Higher priority = more likely to be the next step
}

interface VideoInfo {
  id: string;
  src: string;
  type: 'vimeo' | 'youtube' | 'other';
  status: 'working' | 'error' | 'loading';
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
  navigationMap: Record<string, string[]>; // URL -> possible next URLs
}

class RedPillCompleteChainScraper {
  private browser: Browser | null = null;
  private page: Page | null = null;
  private baseDir = './recovered_code/red_pill_complete_chain';
  private journeyDir = `${this.baseDir}/video_journeys`;
  private screenshotsDir = `${this.baseDir}/screenshots`;
  private htmlDir = `${this.baseDir}/html_snapshots`;

  private visitedUrls = new Set<string>();
  private allVideos = new Map<string, VideoInfo>();
  private navigationMap = new Map<string, string[]>();

  // Navigation patterns we want to follow
  private navigationSelectors = {
    primary: [
      'a[href*="starter"]',      // "Continuar" button
      'a[href*="red-pill"]',     // Red pill links
      'a[href*="pilgrim"]',      // Pilgrim links
      'button[id*="continue"]',   // Continue buttons
      '.btn:contains("Continuar")', // Spanish continue
      '.btn:contains("Continue")',  // English continue
    ],
    secondary: [
      '.btn-hexa',               // Hexagonal buttons
      '.btn-primary',            // Primary buttons
      'button[onclick]',         // Click handlers
      'a[href*="demo.coomunity"]', // Internal links
    ],
    fallback: [
      'button:not([disabled])',  // Any enabled button
      'a[href]:not([href="#"])', // Any real link
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

        // Find Vimeo iframes
        document.querySelectorAll('iframe[src*="vimeo"]').forEach(iframe => {
          const src = iframe.getAttribute('src');
          if (src) {
            const match = src.match(/\/video\/(\d+)/);
            if (match && match[1]) {
              videos.push({
                id: match[1],
                src: src,
                type: 'vimeo',
                status: 'working'
              });
            }
          }
        });

        // Find YouTube iframes
        document.querySelectorAll('iframe[src*="youtube"]').forEach(iframe => {
          const src = iframe.getAttribute('src');
          if (src) {
            const match = src.match(/\/embed\/([^?]+)/);
            if (match && match[1]) {
              videos.push({
                id: match[1],
                src: src,
                type: 'youtube',
                status: 'working'
              });
            }
          }
        });

        // Find HTML5 videos
        document.querySelectorAll('video[src]').forEach(video => {
          const src = video.getAttribute('src');
          if (src) {
            videos.push({
              id: src.split('/').pop() || 'unknown',
              src: src,
              type: 'other',
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

    // Check each category of selectors with different priorities
    const categories = [
      { selectors: this.navigationSelectors.primary, priority: 10 },
      { selectors: this.navigationSelectors.secondary, priority: 5 },
      { selectors: this.navigationSelectors.fallback, priority: 1 }
    ];

    for (const category of categories) {
      for (const selector of category.selectors) {
        try {
          const locator = this.page.locator(selector);
          const count = await locator.count();

          for (let i = 0; i < count; i++) {
            const element = locator.nth(i);
            
            try {
              const isVisible = await element.isVisible();
              const isEnabled = await element.isEnabled();
              const boundingBox = await element.boundingBox();
              
              if (isVisible && isEnabled && boundingBox) {
                const elementData = await element.evaluate((el) => ({
                  id: el.id,
                  className: el.className,
                  tagName: el.tagName,
                  text: el.textContent?.trim() || '',
                  href: el.getAttribute('href')
                }));

                // Skip if we already have this element
                const elementKey = `${elementData.tagName}:${elementData.text}:${elementData.href}`;
                if (elements.some(e => `${e.text}:${e.href}` === `${elementData.text}:${elementData.href}`)) {
                  continue;
                }

                elements.push({
                  type: this.categorizeElement(elementData.tagName, elementData.className, elementData.text, elementData.href),
                  id: elementData.id,
                  className: elementData.className,
                  text: elementData.text,
                  href: elementData.href,
                  position: {
                    x: boundingBox.x,
                    y: boundingBox.y,
                    width: boundingBox.width,
                    height: boundingBox.height
                  },
                  clickable: true,
                  selector: selector,
                  priority: category.priority + this.calculateSpecificPriority(elementData.text, elementData.href)
                });
              }
            } catch (elementError) {
              continue;
            }
          }
        } catch (selectorError) {
          continue;
        }
      }
    }

    // Sort by priority (highest first)
    return elements.sort((a, b) => b.priority - a.priority);
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
    
    // High priority keywords
    if (lowerText.includes('continuar') || lowerText.includes('continue')) priority += 20;
    if (lowerText.includes('next') || lowerText.includes('siguiente')) priority += 15;
    if (lowerText.includes('start') || lowerText.includes('comenzar')) priority += 15;
    
    // Medium priority
    if (lowerText.includes('red') || lowerText.includes('pill')) priority += 10;
    if (lowerText.includes('pilgrim')) priority += 10;
    
    // URL-based priority
    if (href) {
      if (href.includes('starter')) priority += 25;
      if (href.includes('red-pill')) priority += 20;
      if (href.includes('pilgrim')) priority += 15;
      if (href.includes('demo.coomunity')) priority += 5;
    }
    
    return priority;
  }

  private async exploreStep(stepNumber: number, currentUrl: string): Promise<JourneyStep> {
    console.log(`\n🔍 === STEP ${stepNumber}: ${currentUrl} ===`);
    
    const stepStart = Date.now();
    const screenshots: string[] = [];

    // Navigate to URL if not already there
    if (this.page!.url() !== currentUrl) {
      await this.page!.goto(currentUrl, { waitUntil: 'networkidle', timeout: 30000 });
    }

    // Wait for content to load
    await this.page!.waitForTimeout(3000);

    // Take initial screenshot
    screenshots.push(await this.takeScreenshot('arrival', stepNumber));

    // Save HTML snapshot
    await this.saveHtmlSnapshot(stepNumber);

    // Get page title
    const title = await this.page!.title();

    // Detect videos
    const videoData = await this.detectVideos();
    console.log(`   🎬 Videos found: ${videoData.length}`);
    
    // Store videos in global map
    videoData.forEach(video => {
      this.allVideos.set(video.id, video);
    });

    // Detect interactive elements
    const interactiveElements = await this.detectInteractiveElements();
    console.log(`   🎯 Interactive elements: ${interactiveElements.length}`);

    if (interactiveElements.length > 0) {
      console.log('   📋 Top interactive elements:');
      interactiveElements.slice(0, 3).forEach((element, i) => {
        console.log(`      ${i + 1}. [${element.type}] "${element.text}" (priority: ${element.priority})`);
        if (element.href) console.log(`         → ${element.href}`);
      });
    }

    // Try to click the highest priority element
    let clickedElement: InteractiveElementData | undefined;
    let navigationSuccess = false;

    if (interactiveElements.length > 0) {
      const targetElement = interactiveElements[0]; // Highest priority
      
      console.log(`\n   👆 Attempting to click: "${targetElement.text}" (${targetElement.type})`);
      
      // Take screenshot before clicking
      screenshots.push(await this.takeScreenshot('before_click', stepNumber));

      try {
        // Wait for element to be ready
        await this.page!.waitForSelector(targetElement.selector, { timeout: 5000 });
        
        // Click the element
        await this.page!.locator(targetElement.selector).first().click();
        
        // Wait for navigation or changes
        await this.page!.waitForTimeout(3000);
        
        // Check if URL changed
        const newUrl = this.page!.url();
        if (newUrl !== currentUrl) {
          console.log(`   ✅ Navigation successful: ${newUrl}`);
          navigationSuccess = true;
          
          // Update navigation map
          const nextUrls = this.navigationMap.get(currentUrl) || [];
          if (!nextUrls.includes(newUrl)) {
            nextUrls.push(newUrl);
            this.navigationMap.set(currentUrl, nextUrls);
          }
        } else {
          console.log(`   ⚠️ No URL change detected`);
        }
        
        clickedElement = targetElement;
        
        // Take screenshot after clicking
        screenshots.push(await this.takeScreenshot('after_click', stepNumber));
        
      } catch (clickError) {
        console.log(`   ❌ Click failed: ${clickError}`);
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
      timeSpent
    };
  }

  async exploreCompleteChain(startUrl: string = 'https://demo.coomunity.co/go/c8862dd1'): Promise<void> {
    try {
      console.log('🚀 Red Pill Complete Chain Scraper Starting...');
      console.log('🎯 Goal: Map the entire interactive experience chain');
      
      this.browser = await chromium.launch({ 
        headless: false,
        slowMo: 1000
      });
      
      this.page = await this.browser.newPage();
      await this.page.setViewportSize({ width: 1920, height: 1080 });

      const journeyId = `chain_${Date.now()}`;
      const startTime = new Date().toISOString();
      const steps: JourneyStep[] = [];
      
      let currentUrl = startUrl;
      let stepNumber = 1;
      const maxSteps = 10; // Prevent infinite loops

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

        // Small delay between steps
        await this.page.waitForTimeout(2000);
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
        navigationMap: Object.fromEntries(this.navigationMap)
      };

      // Save journey data
      const journeyPath = path.join(this.journeyDir, `${journeyId}.json`);
      fs.writeFileSync(journeyPath, JSON.stringify(journey, null, 2));

      // Generate summary
      this.generateJourneySummary(journey);

    } catch (error) {
      console.error('❌ Journey exploration failed:', error);
    } finally {
      if (this.browser) {
        await this.browser.close();
      }
    }
  }

  private generateJourneySummary(journey: CompleteJourney): void {
    console.log('\n🗺️  === COMPLETE CHAIN SUMMARY ===');
    console.log(`📁 Journey data: ${this.journeyDir}/${journey.journeyId}.json`);
    console.log(`⏱️  Duration: ${journey.startTime} → ${journey.endTime}`);
    console.log(`📍 Steps completed: ${journey.totalSteps}`);
    console.log(`🌐 URLs discovered: ${journey.discoveredUrls.length}`);
    console.log(`🎬 Videos found: ${journey.allVideos.length}`);
    
    console.log('\n📋 Journey Chain:');
    journey.steps.forEach((step, i) => {
      console.log(`   ${i + 1}. ${step.url}`);
      if (step.clickedElement) {
        console.log(`      → Clicked: "${step.clickedElement.text}" (${step.clickedElement.type})`);
      }
    });

    if (journey.allVideos.length > 0) {
      console.log('\n🎥 All Videos in Chain:');
      journey.allVideos.forEach((video, i) => {
        console.log(`   ${i + 1}. [${video.type.toUpperCase()}] ID: ${video.id}`);
      });
    }

    console.log('\n🔗 Navigation Map:');
    Object.entries(journey.navigationMap).forEach(([from, to]) => {
      console.log(`   ${from}`);
      to.forEach(url => console.log(`     → ${url}`));
    });
  }
}

// Run the complete chain scraper
const scraper = new RedPillCompleteChainScraper();
scraper.exploreCompleteChain().then(() => {
  console.log('\n✨ Complete chain exploration finished!');
  console.log('📁 Check ./recovered_code/red_pill_complete_chain/ for detailed results');
}); 