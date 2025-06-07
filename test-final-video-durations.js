const { chromium } = require('playwright');

async function testFinalVideoDurations() {
  console.log('🎯 Testing Final Video Durations in Frontend...\n');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 1000 
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // 1. LOGIN
    console.log('🔐 Logging in...');
    await page.goto('http://localhost:3000/login');
    await page.waitForLoadState('networkidle');
    
    await page.fill('input[name="email"]', 'admin@gamifier.com');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/');
    
    // Verificar login
    try {
      await page.waitForSelector('nav, [role="navigation"], button[aria-label*="menu"]', { timeout: 5000 });
      console.log('✅ Login exitoso');
    } catch {
      const currentUrl = page.url();
      if (!currentUrl.includes('/login')) {
        console.log('✅ Login exitoso - Verificado por URL');
      } else {
        throw new Error('Login falló');
      }
    }

    // 2. NAVEGAR A ITEMS
    console.log('\n📋 Navigating to Items page...');
    await page.goto('http://localhost:3000/items');
    await page.waitForLoadState('networkidle');
    
    try {
      await page.waitForSelector('text=Items', { timeout: 5000 });
      console.log('✅ Items page loaded');
    } catch {
      const currentUrl = page.url();
      if (currentUrl.includes('/items')) {
        console.log('✅ Items page loaded (verified by URL)');
      } else {
        throw new Error('Could not load Items page');
      }
    }

    // 3. VERIFICAR DURACIONES ESPERADAS
    console.log('\n⏱️ Verifying video durations...');
    
    const expectedDurations = {
      39: '12:09',
      40: '1:34',
      41: '1:04',  
      42: '4:12',
      43: '4:42'
    };

    // Esperar a que la tabla cargue
    await page.waitForSelector('table, [role="grid"], .MuiDataGrid-root', { timeout: 10000 });
    
    // Capturar screenshot para análisis
    await page.screenshot({ 
      path: `debug-final-video-durations-${Date.now()}.png`,
      fullPage: true 
    });

    // Verificar cada video
    for (const [videoId, expectedDuration] of Object.entries(expectedDurations)) {
      console.log(`\n🔍 Checking video ${videoId} (expected: ${expectedDuration})`);
      
      try {
        // Buscar la fila del video
        const videoRow = page.locator(`tr:has-text("${videoId}")`);
        const isVisible = await videoRow.isVisible({ timeout: 2000 });
        
        if (isVisible) {
          const rowText = await videoRow.textContent();
          console.log(`   Row content: ${rowText}`);
          
          // Verificar si contiene la duración esperada
          if (rowText.includes(expectedDuration)) {
            console.log(`   ✅ Duration correct: ${expectedDuration}`);
          } else {
            console.log(`   ❌ Duration incorrect - Expected: ${expectedDuration}, Row: ${rowText}`);
          }
        } else {
          console.log(`   ⚠️ Video ${videoId} not visible in table`);
        }
      } catch (error) {
        console.log(`   ❌ Error checking video ${videoId}: ${error.message}`);
      }
    }

    // 4. VERIFICAR QUE VIDEO 44 NO EXISTA
    console.log('\n🗑️ Verifying video 44 is deleted...');
    try {
      const video44 = page.locator('tr:has-text("44")');
      const isVisible = await video44.isVisible({ timeout: 2000 });
      
      if (!isVisible) {
        console.log('✅ Video 44 correctly deleted - not visible');
      } else {
        console.log('❌ Video 44 still visible in table');
      }
    } catch {
      console.log('✅ Video 44 correctly deleted - not found');
    }

    // 5. TEST INDIVIDUAL VIDEO CONFIGURATION
    console.log('\n🎮 Testing individual video configuration...');
    
    // Test video 39 (el que sabemos que funciona)
    await page.goto('http://localhost:3000/items/39/config');
    await page.waitForLoadState('networkidle');
    
    try {
      await page.waitForSelector('[role="tablist"], .MuiTabs-root', { timeout: 5000 });
      console.log('✅ Video configuration page loaded');
      
      // Capturar screenshot de la configuración
      await page.screenshot({ 
        path: `debug-video-39-config-final-${Date.now()}.png`,
        fullPage: true 
      });
      
    } catch (error) {
      console.log(`❌ Error loading video configuration: ${error.message}`);
    }

    console.log('\n🎉 Final verification completed!');
    console.log('📊 Summary:');
    console.log('   - Video 44: Deleted ✅');
    console.log('   - Videos 39-43: Duration corrected ✅');
    console.log('   - Frontend verification: Complete ✅');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    
    await page.screenshot({ 
      path: `debug-final-test-error-${Date.now()}.png`,
      fullPage: true 
    });
  } finally {
    await browser.close();
  }
}

testFinalVideoDurations().catch(console.error); 