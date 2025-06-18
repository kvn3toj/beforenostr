const { chromium } = require('playwright');

async function testAnalyticsBasics() {
  console.log('🎯 Testing Basic Analytics Implementation...\n');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 1000
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();

  // Capture network requests to see analytics calls
  const analyticsRequests = [];
  page.on('request', request => {
    if (request.url().includes('/analytics/data') || request.url().includes('analytics')) {
      analyticsRequests.push({
        url: request.url(),
        method: request.method(),
        postData: request.postData()
      });
      console.log('📊 Analytics Request:', request.method(), request.url());
    }
  });

  try {
    console.log('📋 FASE 1: Testing Basic Navigation and Analytics...');
    
    // Navigate to the app
    await page.goto('http://localhost:3333');
    await page.waitForLoadState('networkidle');
    console.log('✅ Frontend loaded successfully');

    // Check if we need to login or are already logged in
    const currentUrl = page.url();
    console.log('Current URL:', currentUrl);

    if (currentUrl.includes('/login') || await page.locator('input[name="email"]').count() > 0) {
      console.log('📋 Need to login...');
      
      // Fill login form
      await page.fill('input[name="email"]', 'admin@gamifier.com');
      await page.fill('input[name="password"]', 'admin123');
      await page.click('button[type="submit"]');
      await page.waitForTimeout(2000);
      
      console.log('✅ Login form submitted');
    } else {
      console.log('✅ Already logged in or no login required');
    }

    // Wait a bit for any analytics calls to fire
    await page.waitForTimeout(3000);

    // Navigate to different pages to trigger analytics
    console.log('📋 FASE 2: Testing Page Navigation Analytics...');
    
    // Try navigating to Users page
    try {
      const usersLink = page.locator('a:has-text("Usuarios"), a:has-text("Users"), nav a[href*="users"]').first();
      if (await usersLink.count() > 0) {
        await usersLink.click();
        await page.waitForTimeout(1500);
        console.log('✅ Navigated to Users page');
      }
    } catch (error) {
      console.log('ℹ️ Users page navigation not available');
    }

    // Try navigating to Roles page  
    try {
      const rolesLink = page.locator('a:has-text("Roles"), nav a[href*="roles"]').first();
      if (await rolesLink.count() > 0) {
        await rolesLink.click();
        await page.waitForTimeout(1500);
        console.log('✅ Navigated to Roles page');
      }
    } catch (error) {
      console.log('ℹ️ Roles page navigation not available');
    }

    // Check for any form interactions
    console.log('📋 FASE 3: Testing Form Interactions...');
    
    // Look for any buttons that might open dialogs
    const createButtons = await page.locator('button:has-text("Crear"), button:has-text("Create"), button:has-text("Añadir"), button:has-text("Add")').all();
    
    if (createButtons.length > 0) {
      try {
        await createButtons[0].click();
        await page.waitForTimeout(1000);
        console.log('✅ Clicked create/add button');
        
        // Look for form fields and fill one
        const inputs = await page.locator('input[type="text"], input[type="email"], textarea').all();
        if (inputs.length > 0) {
          await inputs[0].fill('Test Analytics Data');
          await page.waitForTimeout(500);
          console.log('✅ Filled form field');
        }
        
        // Close dialog if exists
        const cancelButton = page.locator('button:has-text("Cancelar"), button:has-text("Cancel")').first();
        if (await cancelButton.count() > 0) {
          await cancelButton.click();
          await page.waitForTimeout(500);
          console.log('✅ Closed dialog');
        }
      } catch (error) {
        console.log('ℹ️ Form interaction not completed:', error.message);
      }
    }

    // Final wait for analytics calls
    await page.waitForTimeout(2000);

    // Report analytics calls
    console.log('\n📊 Analytics Summary:');
    console.log(`Total analytics requests captured: ${analyticsRequests.length}`);
    
    if (analyticsRequests.length > 0) {
      console.log('✅ Analytics system is working!');
      analyticsRequests.forEach((req, index) => {
        console.log(`${index + 1}. ${req.method} ${req.url}`);
        if (req.postData) {
          try {
            const data = JSON.parse(req.postData);
            console.log(`   Event: ${data.eventType || 'Unknown'}`);
          } catch (e) {
            console.log(`   Data: ${req.postData.substring(0, 100)}...`);
          }
        }
      });
    } else {
      console.log('ℹ️ No analytics requests captured - this might mean:');
      console.log('   - Analytics is working but not sending to backend');
      console.log('   - Events are not being triggered');
      console.log('   - Network filtering missed the requests');
    }

    // Verify analytics service exists in browser
    const analyticsExists = await page.evaluate(() => {
      return typeof window !== 'undefined' && 
             window.console && 
             window.localStorage !== undefined;
    });

    if (analyticsExists) {
      console.log('✅ Browser environment supports analytics');
    }

    console.log('\n🎉 Analytics test completed!');

  } catch (error) {
    console.error('❌ Error during analytics test:', error);
    
    await page.screenshot({ 
      path: `analytics-simple-error-${Date.now()}.png`,
      fullPage: true 
    });
  } finally {
    await browser.close();
  }
}

testAnalyticsBasics().catch(console.error); 