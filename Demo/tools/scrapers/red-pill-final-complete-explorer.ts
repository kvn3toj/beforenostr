import { chromium, Browser, Page } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';

interface VideoDiscovery {
  id: string;
  src: string;
  type: 'vimeo' | 'youtube' | 'other';
  discoveredAt: string;
  pageUrl: string;
  context: string;
  status: 'found' | 'accessible' | 'blocked';
}

interface PageSnapshot {
  timestamp: string;
  context: string;
  url: string;
  title: string;
  screenshot: string;
  htmlFile: string;
  videosFound: VideoDiscovery[];
  interactiveElements: number;
  dynamicChanges: string[];
}

interface CompleteRedPillJourney {
  journeyId: string;
  startUrl: string;
  startTime: string;
  endTime: string;
  snapshots: PageSnapshot[];
  allVideosDiscovered: VideoDiscovery[];
  totalScreenshots: number;
  journeyPath: string[];
  summary: {
    uniqueVideos: number;
    totalInteractions: number;
    pageEvolutions: number;
    finalDestination: string;
  };
}

class RedPillFinalCompleteExplorer {
  private browser: Browser | null = null;
  private page: Page | null = null;
  private baseDir = './recovered_code/red_pill_final_complete';
  private screenshotsDir = `${this.baseDir}/screenshots`;
  private htmlDir = `${this.baseDir}/html_snapshots`;
  private journeyDir = `${this.baseDir}/complete_journeys`;
  private videosDir = `${this.baseDir}/videos_discovered`;

  private videosDiscovered = new Map<string, VideoDiscovery>();
  private journeyPath: string[] = [];

  constructor() {
    this.ensureDirectories();
  }

  private ensureDirectories() {
    [this.baseDir, this.screenshotsDir, this.htmlDir, this.journeyDir, this.videosDir].forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
  }

  private async takeScreenshot(context: string, step: number): Promise<string> {
    if (!this.page) return '';
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `step_${step.toString().padStart(2, '0')}_${context}_${timestamp}.png`;
    const filepath = path.join(this.screenshotsDir, filename);
    
    await this.page.screenshot({ 
      path: filepath, 
      fullPage: true,
      type: 'png'
    });
    
    return filename;
  }

  private async saveHtmlSnapshot(context: string, step: number): Promise<string> {
    if (!this.page) return '';
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `step_${step.toString().padStart(2, '0')}_${context}_${timestamp}.html`;
    const filepath = path.join(this.htmlDir, filename);
    
    const html = await this.page.content();
    fs.writeFileSync(filepath, html);
    
    return filename;
  }

  private async discoverVideos(context: string): Promise<VideoDiscovery[]> {
    if (!this.page) return [];

    try {
      const pageUrl = this.page.url();
      const timestamp = new Date().toISOString();

      return await this.page.evaluate(({pageUrl, timestamp, context}) => {
        const videos: VideoDiscovery[] = [];

        // Find all Vimeo iframes
        document.querySelectorAll('iframe[src*="vimeo"]').forEach(iframe => {
          const src = iframe.getAttribute('src') || '';
          const match = src.match(/\/video\/(\d+)/);
          if (match && match[1]) {
            videos.push({
              id: match[1],
              src,
              type: 'vimeo',
              discoveredAt: timestamp,
              pageUrl,
              context,
              status: 'found'
            });
          }
        });

        // Find YouTube iframes
        document.querySelectorAll('iframe[src*="youtube"]').forEach(iframe => {
          const src = iframe.getAttribute('src') || '';
          const match = src.match(/\/embed\/([^?]+)/);
          if (match && match[1]) {
            videos.push({
              id: match[1],
              src,
              type: 'youtube',
              discoveredAt: timestamp,
              pageUrl,
              context,
              status: 'found'
            });
          }
        });

        // Find HTML5 videos
        document.querySelectorAll('video[src]').forEach(video => {
          const src = video.getAttribute('src') || '';
          if (src) {
            videos.push({
              id: src.split('/').pop() || 'unknown',
              src,
              type: 'other',
              discoveredAt: timestamp,
              pageUrl,
              context,
              status: 'found'
            });
          }
        });

        return videos;
      }, { pageUrl, timestamp, context });
    } catch (error) {
      console.error('Error discovering videos:', error);
      return [];
    }
  }

  private async detectDynamicChanges(): Promise<string[]> {
    if (!this.page) return [];

    try {
      return await this.page.evaluate(() => {
        const changes: string[] = [];

        // Check for modals/overlays
        const modals = document.querySelectorAll('[class*="modal"], [class*="overlay"], [class*="popup"]');
        if (modals.length > 0) {
          changes.push(`${modals.length} modal/overlay elements detected`);
        }

        // Check for new videos
        const videos = document.querySelectorAll('iframe[src*="vimeo"], iframe[src*="youtube"], video');
        if (videos.length > 0) {
          changes.push(`${videos.length} video elements detected`);
        }

        // Check for forms or interactive content
        const forms = document.querySelectorAll('form, [class*="quiz"], [class*="question"]');
        if (forms.length > 0) {
          changes.push(`${forms.length} form/quiz elements detected`);
        }

        // Check for new buttons or links
        const interactives = document.querySelectorAll('button:not([style*="display: none"]), a[href]:not([href="#"])');
        if (interactives.length > 0) {
          changes.push(`${interactives.length} interactive elements detected`);
        }

        return changes;
      });
    } catch (error) {
      console.error('Error detecting dynamic changes:', error);
      return [];
    }
  }

  private async createPageSnapshot(context: string, step: number): Promise<PageSnapshot> {
    const timestamp = new Date().toISOString();
    const url = this.page!.url();
    const title = await this.page!.title();

    console.log(`\n📸 Creating snapshot ${step}: ${context}`);

    // Take screenshot
    const screenshot = await this.takeScreenshot(context, step);
    
    // Save HTML
    const htmlFile = await this.saveHtmlSnapshot(context, step);

    // Discover videos
    const videosFound = await this.discoverVideos(context);
    console.log(`   🎬 Videos discovered: ${videosFound.length}`);

    // Store new videos
    videosFound.forEach(video => {
      if (!this.videosDiscovered.has(video.id)) {
        this.videosDiscovered.set(video.id, video);
        console.log(`      📺 NEW VIDEO: ${video.id} (${video.type})`);
        
        // Save video info
        const videoInfoPath = path.join(this.videosDir, `${video.id}_${video.type}.json`);
        fs.writeFileSync(videoInfoPath, JSON.stringify(video, null, 2));
      }
    });

    // Detect dynamic changes
    const dynamicChanges = await this.detectDynamicChanges();
    if (dynamicChanges.length > 0) {
      console.log(`   ⚡ Dynamic changes: ${dynamicChanges.join(', ')}`);
    }

    // Count interactive elements
    const interactiveElements = await this.page!.evaluate(() => {
      return document.querySelectorAll('button, a[href], [onclick], [role="button"]').length;
    });

    return {
      timestamp,
      context,
      url,
      title,
      screenshot,
      htmlFile,
      videosFound,
      interactiveElements,
      dynamicChanges
    };
  }

  private async findAndClickElement(searchText: string): Promise<boolean> {
    try {
      return await this.page!.evaluate((searchText) => {
        const elements = Array.from(document.querySelectorAll('*'));
        const target = elements.find(el => {
          const text = el.textContent?.trim().toLowerCase() || '';
          return text.includes(searchText.toLowerCase());
        });
        
        if (target) {
          (target as HTMLElement).click();
          return true;
        }
        return false;
      }, searchText);
    } catch (error) {
      return false;
    }
  }

  private async navigateToHref(searchText: string): Promise<boolean> {
    try {
      const href = await this.page!.evaluate((searchText) => {
        const links = Array.from(document.querySelectorAll('a[href]'));
        const target = links.find(link => {
          const text = link.textContent?.trim().toLowerCase() || '';
          return text.includes(searchText.toLowerCase());
        });
        
        return target ? target.getAttribute('href') : null;
      }, searchText);

      if (href) {
        await this.page!.goto(href);
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  }

  async exploreCompleteRedPillJourney(startUrl: string = 'https://demo.coomunity.co/go/c8862dd1'): Promise<void> {
    try {
      console.log('🚀 Red Pill Final Complete Explorer Starting...');
      console.log('🎯 Goal: Map the COMPLETE Red Pill experience with all videos and content');
      
      this.browser = await chromium.launch({ 
        headless: false,
        slowMo: 1000
      });
      
      this.page = await this.browser.newPage();
      await this.page.setViewportSize({ width: 1920, height: 1080 });

      const journeyId = `complete_red_pill_${Date.now()}`;
      const startTime = new Date().toISOString();
      const snapshots: PageSnapshot[] = [];

      // Navigate to start URL
      console.log(`\n🌐 Starting journey at: ${startUrl}`);
      await this.page.goto(startUrl, { waitUntil: 'networkidle', timeout: 30000 });
      await this.page.waitForTimeout(3000);
      this.journeyPath.push(startUrl);

      // Step 1: Initial state
      snapshots.push(await this.createPageSnapshot('initial_state', 1));

      // Step 2: Look for and click "Continuar"
      console.log(`\n👆 Step 2: Looking for "Continuar" button...`);
      
      let navigationSuccess = false;
      
      // Try direct navigation first
      if (await this.navigateToHref('continuar')) {
        console.log(`   ✅ Direct navigation to Continuar link successful`);
        navigationSuccess = true;
        this.journeyPath.push(this.page.url());
      } else if (await this.findAndClickElement('continuar')) {
        console.log(`   ✅ JavaScript click on Continuar successful`);
        navigationSuccess = true;
      }

      await this.page.waitForTimeout(5000);
      snapshots.push(await this.createPageSnapshot('after_continuar', 2));

      // Step 3: Explore resulting content
      console.log(`\n🔍 Step 3: Exploring content after Continuar...`);
      await this.page.waitForTimeout(3000);
      snapshots.push(await this.createPageSnapshot('content_exploration', 3));

      // Step 4: Look for additional navigation options
      const additionalElements = await this.page.evaluate(() => {
        const elements = Array.from(document.querySelectorAll('a, button'));
        return elements
          .filter(el => {
            const text = el.textContent?.trim().toLowerCase() || '';
            return (
              text.includes('siguiente') || 
              text.includes('next') || 
              text.includes('empezar') ||
              text.includes('start') ||
              text.includes('red') ||
              text.includes('pill') ||
              text.includes('pilgrim')
            );
          })
          .map(el => ({
            text: el.textContent?.trim() || '',
            href: el.getAttribute('href'),
            tagName: el.tagName
          }))
          .slice(0, 5); // Limit to 5 elements
      });

      console.log(`\n🎯 Found ${additionalElements.length} additional navigation elements`);

      // Step 5-N: Explore additional elements
      for (let i = 0; i < additionalElements.length; i++) {
        const element = additionalElements[i];
        const stepNumber = 4 + i;
        
        console.log(`\n👆 Step ${stepNumber}: Trying "${element.text}"`);
        
        snapshots.push(await this.createPageSnapshot(`before_${element.text.replace(/\s+/g, '_')}`, stepNumber * 2 - 1));
        
        let success = false;
        if (element.href) {
          try {
            await this.page.goto(element.href);
            success = true;
            this.journeyPath.push(this.page.url());
            console.log(`   ✅ Navigated to: ${element.href}`);
          } catch (error) {
            console.log(`   ❌ Navigation failed: ${error}`);
          }
        } else {
          success = await this.findAndClickElement(element.text);
          if (success) {
            console.log(`   ✅ Clicked: ${element.text}`);
          } else {
            console.log(`   ❌ Click failed: ${element.text}`);
          }
        }
        
        if (success) {
          await this.page.waitForTimeout(5000);
          snapshots.push(await this.createPageSnapshot(`after_${element.text.replace(/\s+/g, '_')}`, stepNumber * 2));
          
          // Check if we've reached a different experience
          const currentUrl = this.page.url();
          if (!this.journeyPath.includes(currentUrl)) {
            this.journeyPath.push(currentUrl);
          }
        }
      }

      // Final snapshot
      snapshots.push(await this.createPageSnapshot('final_state', 99));

      const endTime = new Date().toISOString();

      // Create complete journey report
      const journey: CompleteRedPillJourney = {
        journeyId,
        startUrl,
        startTime,
        endTime,
        snapshots,
        allVideosDiscovered: Array.from(this.videosDiscovered.values()),
        totalScreenshots: snapshots.length,
        journeyPath: this.journeyPath,
        summary: {
          uniqueVideos: this.videosDiscovered.size,
          totalInteractions: snapshots.reduce((sum, s) => sum + s.interactiveElements, 0),
          pageEvolutions: snapshots.length,
          finalDestination: this.page.url()
        }
      };

      // Save journey data
      const journeyPath = path.join(this.journeyDir, `${journeyId}.json`);
      fs.writeFileSync(journeyPath, JSON.stringify(journey, null, 2));

      // Generate final summary
      this.generateFinalSummary(journey);

    } catch (error) {
      console.error('❌ Complete journey exploration failed:', error);
    } finally {
      if (this.browser) {
        await this.browser.close();
      }
    }
  }

  private generateFinalSummary(journey: CompleteRedPillJourney): void {
    console.log('\n🗺️  === FINAL COMPLETE RED PILL JOURNEY SUMMARY ===');
    console.log(`📁 Journey data: ${this.journeyDir}/${journey.journeyId}.json`);
    console.log(`⏱️  Duration: ${journey.startTime} → ${journey.endTime}`);
    console.log(`📸 Total snapshots: ${journey.totalScreenshots}`);
    console.log(`🎬 Unique videos discovered: ${journey.summary.uniqueVideos}`);
    console.log(`🎯 Total interactions: ${journey.summary.totalInteractions}`);
    console.log(`📈 Page evolutions: ${journey.summary.pageEvolutions}`);
    console.log(`🏁 Final destination: ${journey.summary.finalDestination}`);
    
    console.log('\n🛤️  Complete Journey Path:');
    journey.journeyPath.forEach((url, i) => {
      console.log(`   ${i + 1}. ${url}`);
    });

    console.log('\n📸 Snapshot Timeline:');
    journey.snapshots.forEach((snapshot, i) => {
      console.log(`   ${i + 1}. ${snapshot.context} - ${snapshot.videosFound.length} videos, ${snapshot.interactiveElements} elements`);
      if (snapshot.dynamicChanges.length > 0) {
        snapshot.dynamicChanges.forEach(change => {
          console.log(`      ⚡ ${change}`);
        });
      }
    });

    if (journey.allVideosDiscovered.length > 0) {
      console.log('\n🎥 Complete Video Discovery Map:');
      journey.allVideosDiscovered.forEach((video, i) => {
        console.log(`   ${i + 1}. [${video.type.toUpperCase()}] ID: ${video.id}`);
        console.log(`      📍 Discovered: ${video.context} at ${video.pageUrl}`);
        console.log(`      🕒 Time: ${video.discoveredAt}`);
      });
    }

    console.log('\n📊 Final Statistics:');
    console.log(`   🎬 Total videos: ${journey.summary.uniqueVideos}`);
    console.log(`   📸 Screenshots: ${journey.totalScreenshots}`);
    console.log(`   🌐 URLs visited: ${journey.journeyPath.length}`);
    console.log(`   📁 Files created: ${journey.totalScreenshots * 2 + journey.allVideosDiscovered.length + 1}`);
    console.log(`   💾 Data saved in: ${this.baseDir}`);
  }
}

// Run the final complete explorer
const explorer = new RedPillFinalCompleteExplorer();
explorer.exploreCompleteRedPillJourney().then(() => {
  console.log('\n✨ FINAL COMPLETE RED PILL EXPLORATION FINISHED! ✨');
  console.log('📁 Check ./recovered_code/red_pill_final_complete/ for the COMPLETE results');
  console.log('🎯 This includes ALL videos, screenshots, HTML snapshots, and journey data');
}); 