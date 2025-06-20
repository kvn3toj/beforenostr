import { chromium, Browser, Page } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';

interface VideoData {
  id: string;
  url: string;
  title?: string;
  duration?: number;
  status: 'working' | 'error' | 'loading' | 'unknown';
  errorMessage?: string;
  foundAt?: string;
}

interface ExplorationResult {
  timestamp: string;
  currentUrl: string;
  videos: VideoData[];
  interactiveElements: number;
  playerError: boolean;
  screenshot?: string;
  userAgent: string;
}

class RedPillSmartExplorer {
  private browser: Browser | null = null;
  private page: Page | null = null;
  private baseDir = './recovered_code/red_pill_smart_exploration';
  private resultsDir = `${this.baseDir}/results`;
  private screenshotsDir = `${this.baseDir}/screenshots`;
  private videoMappingDir = `${this.baseDir}/video_mapping`;
  
  // Known video IDs from previous explorations
  private knownVideoIds = [
    '381951343', // From previous session
    '367807616', // Detected after
    '408458426'  // Original link
  ];

  // Different user agents to try
  private userAgents = [
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  ];

  // Red Pill entry points to try
  private entryPoints = [
    'https://demo.coomunity.co/red-pill/c8862dd1',
    'https://demo.coomunity.co/go/c8862dd1',
    'https://demo.coomunity.co/pilgrim/640baa58'
  ];

  constructor() {
    this.ensureDirectories();
  }

  private ensureDirectories() {
    [this.baseDir, this.resultsDir, this.screenshotsDir, this.videoMappingDir].forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
  }

  private async takeScreenshot(context: string): Promise<string> {
    if (!this.page) return '';
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `${context}_${timestamp}.png`;
    const filepath = path.join(this.screenshotsDir, filename);
    
    await this.page.screenshot({ 
      path: filepath, 
      fullPage: true,
      type: 'png'
    });
    
    return filename;
  }

  private async detectPlayerError(): Promise<{ hasError: boolean; message?: string }> {
    if (!this.page) return { hasError: false };

    try {
      // Check for Vimeo player errors
      const errorElement = await this.page.locator('text=Player error').first();
      const isVisible = await errorElement.isVisible().catch(() => false);
      
      if (isVisible) {
        const errorText = await this.page.locator('.vp-alert-text').textContent().catch(() => 'Unknown player error');
        return { hasError: true, message: errorText || 'Player error detected' };
      }

      // Check for other common error indicators
      const errorIndicators = [
        'text=The player is having trouble',
        'text=Video unavailable',
        'text=This video is private',
        '.vp-alert',
        '.error-message'
      ];

      for (const indicator of errorIndicators) {
        const element = await this.page.locator(indicator).first();
        const visible = await element.isVisible().catch(() => false);
        if (visible) {
          const text = await element.textContent().catch(() => 'Error detected');
          return { hasError: true, message: text || 'Error detected' };
        }
      }

      return { hasError: false };
    } catch (error) {
      return { hasError: false };
    }
  }

  private async extractVideoData(): Promise<VideoData[]> {
    if (!this.page) return [];

    try {
      return await this.page.evaluate(() => {
        const videos: VideoData[] = [];
        
        // Find Vimeo iframes
        const iframes = document.querySelectorAll('iframe[src*="vimeo"]');
        iframes.forEach((iframe) => {
          const src = iframe.getAttribute('src');
          if (src) {
            const match = src.match(/\/video\/(\d+)/);
            if (match && match[1]) {
              videos.push({
                id: match[1],
                url: src,
                status: 'unknown',
                foundAt: window.location.href
              });
            }
          }
        });

        // Look for video IDs in page content
        const pageContent = document.documentElement.outerHTML;
        const vimeoMatches = pageContent.match(/vimeo\.com\/video\/(\d+)/g) || [];
        vimeoMatches.forEach(match => {
          const idMatch = match.match(/(\d+)/);
          if (idMatch && idMatch[1]) {
            const id = idMatch[1];
            if (!videos.find(v => v.id === id)) {
              videos.push({
                id,
                url: `https://player.vimeo.com/video/${id}`,
                status: 'unknown',
                foundAt: window.location.href
              });
            }
          }
        });

        return videos;
      });
    } catch (error) {
      console.error('Error extracting video data:', error);
      return [];
    }
  }

  private async countInteractiveElements(): Promise<number> {
    if (!this.page) return 0;

    try {
      const selectors = [
        'button:not([disabled])',
        '[role="button"]:not([disabled])',
        '.button:not([disabled])',
        '[data-option]',
        '.option',
        '.choice',
        'a[href*="red-pill"]',
        'a[href*="pilgrim"]',
        '[onclick]'
      ];

      let totalCount = 0;
      for (const selector of selectors) {
        const count = await this.page.locator(selector).count();
        totalCount += count;
      }

      return totalCount;
    } catch (error) {
      return 0;
    }
  }

  private async exploreWithUserAgent(url: string, userAgent: string): Promise<ExplorationResult> {
    console.log(`\n🔍 Exploring ${url} with User Agent: ${userAgent.substring(0, 50)}...`);

    const context = await this.browser!.newContext({
      userAgent,
      viewport: { width: 1920, height: 1080 }
    });

    this.page = await context.newPage();

    try {
      // Navigate to URL
      await this.page.goto(url, { 
        waitUntil: 'networkidle',
        timeout: 30000 
      });

      // Wait a bit for content to load
      await this.page.waitForTimeout(3000);

      // Take screenshot
      const screenshot = await this.takeScreenshot(`explore_${url.split('/').pop()}`);

      // Check for player error
      const playerError = await this.detectPlayerError();

      // Extract video data
      const videos = await this.extractVideoData();

      // Count interactive elements
      const interactiveElements = await this.countInteractiveElements();

      const result: ExplorationResult = {
        timestamp: new Date().toISOString(),
        currentUrl: this.page.url(),
        videos: videos.map(v => ({
          ...v,
          status: playerError.hasError ? 'error' : 'working',
          errorMessage: playerError.hasError ? playerError.message : undefined
        })),
        interactiveElements,
        playerError: playerError.hasError,
        screenshot,
        userAgent
      };

      console.log(`   📍 Final URL: ${result.currentUrl}`);
      console.log(`   🎬 Videos found: ${videos.length}`);
      console.log(`   🔘 Interactive elements: ${interactiveElements}`);
      console.log(`   ❌ Player error: ${playerError.hasError ? 'YES' : 'NO'}`);
      if (playerError.hasError) {
        console.log(`   📝 Error: ${playerError.message}`);
      }

      return result;

    } catch (error) {
      console.error(`❌ Error exploring ${url}:`, error);
      return {
        timestamp: new Date().toISOString(),
        currentUrl: url,
        videos: [],
        interactiveElements: 0,
        playerError: true,
        userAgent,
        screenshot: await this.takeScreenshot(`error_${url.split('/').pop()}`)
      };
    } finally {
      await context.close();
    }
  }

  private async testDirectVideoAccess(): Promise<void> {
    console.log('\n🎬 Testing direct access to known videos...');

    for (const videoId of this.knownVideoIds) {
      const videoUrl = `https://vimeo.com/${videoId}`;
      const playerUrl = `https://player.vimeo.com/video/${videoId}`;

      console.log(`\n📹 Testing Video ID: ${videoId}`);

      // Test direct Vimeo access
      try {
        const response = await fetch(videoUrl, { method: 'HEAD' });
        console.log(`   Direct Vimeo (${videoUrl}): ${response.status}`);
      } catch (error) {
        console.log(`   Direct Vimeo (${videoUrl}): ERROR`);
      }

      // Test player embed access
      try {
        const response = await fetch(playerUrl, { method: 'HEAD' });
        console.log(`   Player Embed (${playerUrl}): ${response.status}`);
      } catch (error) {
        console.log(`   Player Embed (${playerUrl}): ERROR`);
      }
    }
  }

  async explore(): Promise<void> {
    try {
      console.log('🚀 Red Pill Smart Explorer Starting...');
      console.log('🎯 Features: Multiple User Agents, Error Detection, Video Mapping');
      
      this.browser = await chromium.launch({ 
        headless: false,
        slowMo: 500
      });

      const allResults: ExplorationResult[] = [];

      // Test direct video access first
      await this.testDirectVideoAccess();

      // Explore each entry point with different user agents
      for (const entryPoint of this.entryPoints) {
        console.log(`\n🌐 === EXPLORING ENTRY POINT: ${entryPoint} ===`);
        
        for (let i = 0; i < Math.min(2, this.userAgents.length); i++) {
          const userAgent = this.userAgents[i];
          const result = await this.exploreWithUserAgent(entryPoint, userAgent);
          allResults.push(result);

          // If we found working videos, no need to try more user agents for this URL
          if (!result.playerError && result.videos.length > 0) {
            console.log('✅ Found working videos, moving to next entry point');
            break;
          }

          // Small delay between attempts
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }

      // Save comprehensive results
      const summaryReport = {
        explorationDate: new Date().toISOString(),
        totalEntryPoints: this.entryPoints.length,
        totalAttempts: allResults.length,
        knownVideoIds: this.knownVideoIds,
        results: allResults,
        videoSummary: this.generateVideoSummary(allResults)
      };

      const reportPath = path.join(this.resultsDir, `red_pill_exploration_${Date.now()}.json`);
      fs.writeFileSync(reportPath, JSON.stringify(summaryReport, null, 2));

      console.log('\n📊 === EXPLORATION SUMMARY ===');
      console.log(`📁 Report saved: ${reportPath}`);
      console.log(`🎬 Unique videos found: ${summaryReport.videoSummary.uniqueVideos.length}`);
      console.log(`✅ Working videos: ${summaryReport.videoSummary.workingVideos}`);
      console.log(`❌ Error videos: ${summaryReport.videoSummary.errorVideos}`);
      console.log(`🔗 Entry points tested: ${this.entryPoints.length}`);

      if (summaryReport.videoSummary.uniqueVideos.length > 0) {
        console.log('\n🎥 Videos discovered:');
        summaryReport.videoSummary.uniqueVideos.forEach((videoId, i) => {
          console.log(`   ${i + 1}. Video ID: ${videoId}`);
        });
      }

    } catch (error) {
      console.error('❌ Exploration failed:', error);
    } finally {
      if (this.browser) {
        await this.browser.close();
      }
    }
  }

  private generateVideoSummary(results: ExplorationResult[]) {
    const allVideos = results.flatMap(r => r.videos);
    const uniqueVideos = Array.from(new Set(allVideos.map(v => v.id)));
    const workingVideos = allVideos.filter(v => v.status === 'working').length;
    const errorVideos = allVideos.filter(v => v.status === 'error').length;

    return {
      uniqueVideos,
      workingVideos,
      errorVideos,
      totalFindings: allVideos.length
    };
  }
}

// Run the smart explorer
const explorer = new RedPillSmartExplorer();
explorer.explore().then(() => {
  console.log('\n✨ Smart exploration completed!');
  console.log('📁 Check ./recovered_code/red_pill_smart_exploration/ for results');
}); 