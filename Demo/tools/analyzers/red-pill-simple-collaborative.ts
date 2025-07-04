import { chromium, Browser, Page } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';

interface VideoData {
  url: string;
  id: string;
  title?: string;
  duration?: number;
  currentTime?: number;
}

interface AnalysisData {
  timestamp: string;
  currentUrl: string;
  videos: VideoData[];
  iframes: number;
  buttons: number;
  options: number;
  newElementsDetected: boolean;
  screenshot?: string;
}

class RedPillCollaborativeExplorer {
  private browser: Browser | null = null;
  private page: Page | null = null;
  private baseDir = './recovered_code/red_pill_simple_collaborative';
  private analysisDir = `${this.baseDir}/analysis`;
  private capturesDir = `${this.baseDir}/captures`;
  private videosDir = `${this.baseDir}/videos`;
  private startTime = Date.now();
  private analysisCount = 0;
  private lastElementCounts = { videos: 0, buttons: 0, options: 0, iframes: 0 };

  constructor() {
    this.ensureDirectories();
  }

  private ensureDirectories() {
    [this.baseDir, this.analysisDir, this.capturesDir, this.videosDir].forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
  }

  private getElapsedTime(): number {
    return Math.floor((Date.now() - this.startTime) / 1000);
  }

  private async takeScreenshot(suffix: string = ''): Promise<string> {
    if (!this.page) return '';
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `screenshot_${timestamp}${suffix}.png`;
    const filepath = path.join(this.capturesDir, filename);
    
    await this.page.screenshot({ 
      path: filepath, 
      fullPage: true,
      type: 'png'
    });
    
    console.log(`📸 Screenshot saved: ${filename}`);
    return filename;
  }

  private async analyzeCurrentState(reason: string = 'auto'): Promise<void> {
    if (!this.page) return;

    try {
      this.analysisCount++;
      const elapsed = this.getElapsedTime();

      // Take screenshot
      const screenshotFile = await this.takeScreenshot(`_${reason}_${elapsed}s`);

      // Get current URL
      const currentUrl = this.page.url();

      // Count iframes
      const iframes = await this.page.locator('iframe').count();

      // Get video data from iframes
      const videos: VideoData[] = [];
      for (let i = 0; i < iframes; i++) {
        try {
          const iframe = this.page.locator('iframe').nth(i);
          const src = await iframe.getAttribute('src');
          if (src && src.includes('vimeo')) {
            const vimeoMatch = src.match(/\/video\/(\d+)/);
            if (vimeoMatch) {
              videos.push({
                url: src,
                id: vimeoMatch[1]
              });
            }
          }
        } catch (e) {
          // Skip problematic iframes
        }
      }

      // Count interactive elements
      const buttons = await this.page.locator('button, [role="button"], .button, input[type="button"], input[type="submit"]').count();
      const options = await this.page.locator('[data-option], .option, .choice, [role="option"]').count();

      // Check if new elements were detected
      const newElementsDetected = 
        videos.length > this.lastElementCounts.videos ||
        buttons > this.lastElementCounts.buttons ||
        options > this.lastElementCounts.options ||
        iframes > this.lastElementCounts.iframes;

      // Update counts
      this.lastElementCounts = {
        videos: videos.length,
        buttons,
        options,
        iframes
      };

      const analysis: AnalysisData = {
        timestamp: new Date().toISOString(),
        currentUrl,
        videos,
        iframes,
        buttons,
        options,
        newElementsDetected,
        screenshot: screenshotFile
      };

      // Save analysis
      const filename = `analysis_${this.analysisCount}_${reason}_${elapsed}s.json`;
      const filepath = path.join(this.analysisDir, filename);
      fs.writeFileSync(filepath, JSON.stringify(analysis, null, 2));

      // Console output
      console.log(`\n🔍 Analysis ${this.analysisCount} (${elapsed}s) - ${reason.toUpperCase()}`);
      console.log(`📍 URL: ${currentUrl}`);
      console.log(`🎬 Videos: ${videos.length} | 🖼️ iFrames: ${iframes} | 🔘 Buttons: ${buttons} | ⚡ Options: ${options}`);
      console.log(`📸 Screenshot: ${screenshotFile}`);
      
      if (newElementsDetected) {
        console.log(`🆕 NEW ELEMENTS DETECTED!`);
      }

      if (videos.length > 0) {
        videos.forEach((video, index) => {
          console.log(`   Video ${index + 1}: ID ${video.id}`);
        });
      }

    } catch (error) {
      console.error('Error during analysis:', error);
    }
  }

  private async waitForVideoLoad(): Promise<void> {
    if (!this.page) return;

    try {
      // Wait for iframes to load
      await this.page.waitForSelector('iframe', { timeout: 10000 });
      await this.page.waitForTimeout(2000); // Give time for iframe content to load

      console.log('✅ Video elements loaded');
    } catch (error) {
      console.log('⚠️ Timeout waiting for video elements, continuing...');
    }
  }

  private async waitForInteractiveElements(): Promise<boolean> {
    if (!this.page) return false;

    console.log('⏳ Waiting for interactive elements...');
    
    // Wait for buttons or options to appear
    try {
      await this.page.waitForSelector('button, [role="button"], .button, [data-option], .option, .choice', { 
        timeout: 30000 
      });
      
      console.log('✅ Interactive elements detected');
      return true;
    } catch (error) {
      console.log('⚠️ No interactive elements found within timeout');
      return false;
    }
  }

  private async clickFirstAvailableOption(): Promise<boolean> {
    if (!this.page) return false;

    try {
      // Look for various types of clickable elements
      const selectors = [
        'button:not([disabled])',
        '[role="button"]:not([disabled])',
        '.button:not([disabled])',
        '[data-option]',
        '.option',
        '.choice',
        'a[href*="red-pill"]',
        '[onclick]'
      ];

      for (const selector of selectors) {
        const elements = await this.page.locator(selector).all();
        
        for (const element of elements) {
          try {
            const isVisible = await element.isVisible();
            const isEnabled = await element.isEnabled();
            
            if (isVisible && isEnabled) {
              console.log(`🎯 Clicking element: ${selector}`);
              await element.click();
              await this.page.waitForTimeout(2000); // Wait for navigation/changes
              return true;
            }
          } catch (e) {
            // Continue to next element
          }
        }
      }

      console.log('❌ No clickable elements found');
      return false;
    } catch (error) {
      console.error('Error clicking element:', error);
      return false;
    }
  }

  async explore(startUrl: string = 'https://demo.coomunity.co/red-pill/c8862dd1'): Promise<void> {
    try {
      console.log('🚀 Launching browser...');
      this.browser = await chromium.launch({ 
        headless: false,
        slowMo: 1000
      });
      
      this.page = await this.browser.newPage();
      
      // Set viewport for consistent screenshots
      await this.page.setViewportSize({ width: 1920, height: 1080 });

      console.log(`🌐 Navigating to: ${startUrl}`);
      await this.page.goto(startUrl, { waitUntil: 'networkidle' });

      // Initial analysis and screenshot
      await this.analyzeCurrentState('initial');
      
      let iterationCount = 0;
      const maxIterations = 20;

      while (iterationCount < maxIterations) {
        iterationCount++;
        console.log(`\n🔄 === ITERATION ${iterationCount} ===`);

        // Wait for video content to load
        await this.waitForVideoLoad();
        
        // Analysis after video load
        await this.analyzeCurrentState('video_loaded');

        // Wait for interactive elements
        const hasInteractive = await this.waitForInteractiveElements();
        
        if (hasInteractive) {
          // Analysis when interactive elements appear
          await this.analyzeCurrentState('interactive_ready');
          
          // Try to click an option
          const clicked = await this.clickFirstAvailableOption();
          
          if (clicked) {
            console.log('✅ Successfully clicked an option');
            await this.analyzeCurrentState('after_click');
            
            // Wait a bit for new content to load
            await this.page.waitForTimeout(3000);
          } else {
            console.log('❌ No clickable options found');
            break;
          }
        } else {
          console.log('⏸️ No interactive elements, waiting longer...');
          await this.page.waitForTimeout(5000);
          await this.analyzeCurrentState('waiting');
        }

        // Check if URL changed (navigation occurred)
        const currentUrl = this.page.url();
        if (currentUrl !== startUrl) {
          console.log(`🔀 URL changed to: ${currentUrl}`);
          startUrl = currentUrl; // Update for next iteration
        }

        // Small delay between iterations
        await this.page.waitForTimeout(2000);
      }

      console.log(`\n🏁 Exploration completed after ${iterationCount} iterations`);
      await this.analyzeCurrentState('final');

    } catch (error) {
      console.error('❌ Exploration failed:', error);
    } finally {
      if (this.browser) {
        console.log('🔒 Closing browser...');
        await this.browser.close();
      }
    }
  }
}

// Run the explorer
const explorer = new RedPillCollaborativeExplorer();
explorer.explore().then(() => {
  console.log('✨ Exploration completed!');
  console.log('📁 Check the following directories for results:');
  console.log('   - Analysis: ./recovered_code/red_pill_simple_collaborative/analysis/');
  console.log('   - Screenshots: ./recovered_code/red_pill_simple_collaborative/captures/');
}); 