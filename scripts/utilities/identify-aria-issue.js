const { chromium } = require('playwright');

async function identifyAriaIssue() {
  console.log('🔍 Identifying specific ARIA issue...\n');
  
  const browser = await chromium.launch({ headless: false, slowMo: 500 });
  const page = await browser.newPage();
  
  try {
    console.log('📍 Navigating to login page...');
    await page.goto('http://localhost:3333/login');
    await page.waitForLoadState('networkidle');
    
    console.log('🔐 Performing login...');
    await page.fill('input[name="email"]', 'admin@gamifier.com');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');
    
    try {
      await page.waitForURL('**/');
      console.log('✅ Login successful');
    } catch {
      const currentUrl = page.url();
      if (!currentUrl.includes('/login')) {
        console.log('✅ Login successful (verified by URL)');
      } else {
        throw new Error('Login failed');
      }
    }
    
    console.log('🔍 Analyzing ARIA implementation...\n');
    
    // Check for ARIA issues
    const ariaAnalysis = await page.evaluate(() => {
      const analysis = {
        totalAriaLabels: 0,
        missingDescriptions: [],
        buttonIssues: [],
        skipLinkIssues: [],
        navigationIssues: [],
        enhancementOpportunities: []
      };
      
      // Count total aria-labels
      const elementsWithAriaLabel = document.querySelectorAll('[aria-label]');
      analysis.totalAriaLabels = elementsWithAriaLabel.length;
      
      // Check for elements with aria-label but missing aria-describedby
      elementsWithAriaLabel.forEach(el => {
        if (!el.getAttribute('aria-describedby') && (el.tagName === 'BUTTON' || el.tagName === 'A')) {
          analysis.missingDescriptions.push({
            tag: el.tagName,
            ariaLabel: el.getAttribute('aria-label'),
            id: el.id || 'no-id',
            className: el.className,
            textContent: el.textContent.trim().substring(0, 50)
          });
        }
      });
      
      // Check for buttons without proper ARIA
      const buttons = document.querySelectorAll('button');
      buttons.forEach(btn => {
        if (!btn.getAttribute('aria-label') && !btn.textContent.trim()) {
          analysis.buttonIssues.push({
            innerHTML: btn.innerHTML.substring(0, 100),
            className: btn.className,
            id: btn.id || 'no-id'
          });
        }
      });
      
      // Check skip links specifically
      const skipLinks = document.querySelectorAll('a[href^="#"]');
      skipLinks.forEach(link => {
        if (!link.getAttribute('aria-describedby')) {
          analysis.skipLinkIssues.push({
            href: link.href,
            text: link.textContent,
            hasAriaLabel: !!link.getAttribute('aria-label'),
            ariaLabel: link.getAttribute('aria-label')
          });
        }
      });
      
      // Check navigation ARIA
      const navElements = document.querySelectorAll('nav');
      navElements.forEach(nav => {
        if (!nav.getAttribute('aria-describedby')) {
          analysis.navigationIssues.push({
            ariaLabel: nav.getAttribute('aria-label'),
            hasAriaLabel: !!nav.getAttribute('aria-label'),
            id: nav.id || 'no-id',
            childrenCount: nav.children.length
          });
        }
      });
      
      // Look for enhancement opportunities
      // Check for complex widgets that could benefit from more ARIA
      const complexElements = document.querySelectorAll('[role="button"], [role="menuitem"], [role="tab"]');
      complexElements.forEach(el => {
        if (!el.getAttribute('aria-describedby') && !el.getAttribute('aria-expanded') && !el.getAttribute('aria-controls')) {
          analysis.enhancementOpportunities.push({
            role: el.getAttribute('role'),
            ariaLabel: el.getAttribute('aria-label'),
            id: el.id || 'no-id',
            suggestion: 'Could benefit from aria-describedby or state attributes'
          });
        }
      });
      
      return analysis;
    });
    
    console.log('📊 ARIA Analysis Results:');
    console.log(`   Total aria-labels found: ${ariaAnalysis.totalAriaLabels}`);
    console.log(`   Missing descriptions: ${ariaAnalysis.missingDescriptions.length}`);
    console.log(`   Button issues: ${ariaAnalysis.buttonIssues.length}`);
    console.log(`   Skip link issues: ${ariaAnalysis.skipLinkIssues.length}`);
    console.log(`   Navigation issues: ${ariaAnalysis.navigationIssues.length}`);
    console.log(`   Enhancement opportunities: ${ariaAnalysis.enhancementOpportunities.length}\n`);
    
    if (ariaAnalysis.missingDescriptions.length > 0) {
      console.log('🔧 Elements missing aria-describedby:');
      ariaAnalysis.missingDescriptions.forEach((item, index) => {
        console.log(`   ${index + 1}. ${item.tag} - "${item.ariaLabel}" (${item.id})`);
        console.log(`      Text: "${item.textContent}"`);
      });
      console.log('');
    }
    
    if (ariaAnalysis.skipLinkIssues.length > 0) {
      console.log('🔗 Skip links that could be enhanced:');
      ariaAnalysis.skipLinkIssues.forEach((item, index) => {
        console.log(`   ${index + 1}. "${item.text}" - Missing aria-describedby`);
        console.log(`      Has aria-label: ${item.hasAriaLabel}`);
        if (item.ariaLabel) console.log(`      Aria-label: "${item.ariaLabel}"`);
      });
      console.log('');
    }
    
    if (ariaAnalysis.navigationIssues.length > 0) {
      console.log('🧭 Navigation elements that could be enhanced:');
      ariaAnalysis.navigationIssues.forEach((item, index) => {
        console.log(`   ${index + 1}. Nav with aria-label: "${item.ariaLabel}" - Missing aria-describedby`);
        console.log(`      Children count: ${item.childrenCount}`);
      });
      console.log('');
    }
    
    if (ariaAnalysis.enhancementOpportunities.length > 0) {
      console.log('💡 Enhancement opportunities:');
      ariaAnalysis.enhancementOpportunities.forEach((item, index) => {
        console.log(`   ${index + 1}. ${item.role} element - "${item.ariaLabel}"`);
        console.log(`      Suggestion: ${item.suggestion}`);
      });
    }
    
    // Provide specific recommendations
    console.log('\n🎯 RECOMMENDATIONS FOR 100% SCORE:');
    
    if (ariaAnalysis.skipLinkIssues.length > 0) {
      console.log('   1. Add aria-describedby to skip links for better context');
    }
    
    if (ariaAnalysis.navigationIssues.length > 0) {
      console.log('   2. Add aria-describedby to navigation elements');
    }
    
    if (ariaAnalysis.missingDescriptions.length > 0) {
      console.log('   3. Add descriptive aria-describedby to interactive elements');
    }
    
    console.log('   4. Consider adding more contextual ARIA descriptions');
    console.log('   5. Enhance dynamic state announcements');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await browser.close();
  }
}

identifyAriaIssue().catch(console.error); 