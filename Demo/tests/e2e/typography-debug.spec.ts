import { test, expect } from '@playwright/test';

test.describe('Typography Consistency Debug', () => {
  const sections = [
    { name: 'Home', path: '/' },
    { name: 'Marketplace', path: '/marketplace' },
    { name: 'Social', path: '/social' },
    { name: 'Pilgrim', path: '/pilgrim' },
  ];

  test('should debug font family inconsistencies', async ({ page }) => {
    for (const section of sections) {
      console.log(`\n=== Testing ${section.name} ===`);
      
      // Navigate to section
      await page.goto(`http://localhost:3000${section.path}`);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000); // Wait for fonts to load

      // Get all h1 elements and their computed styles
      const h1Elements = await page.locator('h1').all();
      console.log(`Found ${h1Elements.length} h1 elements`);
      
      for (let i = 0; i < h1Elements.length; i++) {
        const h1 = h1Elements[i];
        const h1FontFamily = await h1.evaluate(el => {
          const styles = window.getComputedStyle(el);
          return styles.fontFamily;
        });
        console.log(`H1[${i}] font-family: ${h1FontFamily}`);
      }

      // Get all p elements and their computed styles
      const pElements = await page.locator('p').all();
      console.log(`Found ${pElements.length} p elements`);
      
      for (let i = 0; i < Math.min(5, pElements.length); i++) { // Limit to first 5 for brevity
        const p = pElements[i];
        const pFontFamily = await p.evaluate(el => {
          const styles = window.getComputedStyle(el);
          return styles.fontFamily;
        });
        console.log(`P[${i}] font-family: ${pFontFamily}`);
      }

      // Check for any elements still using problematic fonts
      const problematicFonts = await page.evaluate(() => {
        const problematicSelectors = [
          '*[style*="Roboto Slab"]',
          '*[style*="Montserrat"]',
          '*[style*="Times New Roman"]',
          '.title',
          '.card-title'
        ];
        
        const problems = [];
        for (const selector of problematicSelectors) {
          try {
            const elements = document.querySelectorAll(selector);
            for (const el of elements) {
              const styles = window.getComputedStyle(el);
              if (styles.fontFamily.includes('Roboto Slab') || 
                  styles.fontFamily.includes('Montserrat') ||
                  styles.fontFamily.includes('Times New Roman')) {
                problems.push({
                  selector,
                  fontFamily: styles.fontFamily,
                  text: el.textContent?.substring(0, 50) || 'No text'
                });
              }
            }
          } catch (e) {
            // Ignore invalid selectors
          }
        }
        return problems;
      });

      if (problematicFonts.length > 0) {
        console.log(`❌ Found problematic fonts in ${section.name}:`);
        problematicFonts.forEach(problem => {
          console.log(`  - ${problem.selector}: ${problem.fontFamily} (${problem.text})`);
        });
      } else {
        console.log(`✅ No problematic fonts found in ${section.name}`);
      }

      // Test the specific consistency check
      const typographyTest = await page.evaluate(() => {
        const h1Elements = document.querySelectorAll('h1');
        const pElements = document.querySelectorAll('p');
        
        if (h1Elements.length === 0 || pElements.length === 0) {
          return { 
            hasElements: false, 
            h1Count: h1Elements.length, 
            pCount: pElements.length 
          };
        }

        const h1Style = window.getComputedStyle(h1Elements[0]);
        const pStyle = window.getComputedStyle(pElements[0]);
        
        return {
          hasElements: true,
          h1Count: h1Elements.length,
          pCount: pElements.length,
          h1FontFamily: h1Style.fontFamily,
          pFontFamily: pStyle.fontFamily,
          areEqual: h1Style.fontFamily === pStyle.fontFamily,
          h1FontFamily_clean: h1Style.fontFamily.replace(/"/g, '').split(',')[0].trim(),
          pFontFamily_clean: pStyle.fontFamily.replace(/"/g, '').split(',')[0].trim()
        };
      });

      console.log(`Typography test for ${section.name}:`, typographyTest);
      
      if (typographyTest.hasElements && typographyTest.areEqual) {
        console.log(`✅ ${section.name}: Typography is consistent`);
      } else if (!typographyTest.hasElements) {
        console.log(`⚠️ ${section.name}: Missing h1 or p elements`);
      } else {
        console.log(`❌ ${section.name}: Typography inconsistent`);
        console.log(`   H1: ${typographyTest.h1FontFamily}`);
        console.log(`   P:  ${typographyTest.pFontFamily}`);
      }
    }
  });

  test('should simulate master UX validation typography test', async ({ page }) => {
    for (const section of sections) {
      console.log(`\n=== Master UX Validation Test - ${section.name} ===`);
      
      // Navigate to section
      await page.goto(`http://localhost:3000${section.path}`);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);

      // Simulate the exact logic from 00-master-ux-validation.spec.ts
      const typography = await page.evaluate(() => {
        const h1 = document.querySelector('h1');
        const h2 = document.querySelector('h2');
        const p = document.querySelector('p');
        
        const getFont = (el: Element | null) => {
          if (!el) return null;
          const styles = window.getComputedStyle(el);
          return {
            family: styles.fontFamily,
            size: styles.fontSize,
            weight: styles.fontWeight
          };
        };

        return {
          h1Font: getFont(h1),
          h2Font: getFont(h2),
          pFont: getFont(p)
        };
      });

      console.log(`Elements found - H1: ${!!typography.h1Font}, H2: ${!!typography.h2Font}, P: ${!!typography.pFont}`);
      
      if (typography.h1Font) {
        console.log(`H1 font: ${typography.h1Font.family}`);
      }
      if (typography.pFont) {
        console.log(`P font: ${typography.pFont.family}`);
      }

      const hasConsistentFonts = typography.h1Font && typography.pFont && 
        typography.h1Font.family === typography.pFont.family;
      
      console.log(`Typography consistency check result: ${hasConsistentFonts}`);
      
      if (!hasConsistentFonts) {
        console.log(`❌ ${section.name}: Master UX validation would FAIL`);
        if (!typography.h1Font) console.log(`   - No H1 element found`);
        if (!typography.pFont) console.log(`   - No P element found`);
        if (typography.h1Font && typography.pFont) {
          console.log(`   - H1 font: ${typography.h1Font.family}`);
          console.log(`   - P font: ${typography.pFont.family}`);
        }
      } else {
        console.log(`✅ ${section.name}: Master UX validation would PASS`);
      }
    }
  });
}); 