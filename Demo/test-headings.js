const { chromium } = require('playwright');

const pages = [
  { name: 'Home', url: 'http://localhost:3333' },
  { name: 'Profile', url: 'http://localhost:3333/profile' },
  { name: 'Wallet', url: 'http://localhost:3333/wallet' },
  { name: 'Marketplace', url: 'http://localhost:3333/marketplace' },
  { name: 'Social', url: 'http://localhost:3333/social' },
  { name: 'Pilgrim', url: 'http://localhost:3333/pilgrim' }
];

(async () => {
  const browser = await chromium.launch();
  
  for (const pageInfo of pages) {
    const page = await browser.newPage();
    
    try {
      console.log(`\n🔍 Analizando página: ${pageInfo.name} (${pageInfo.url})`);
      
      await page.goto(pageInfo.url, { waitUntil: 'networkidle' });
      await page.waitForTimeout(2000);
      
      const headings = await page.$$eval('h1, h2, h3, h4, h5, h6', elements => 
        elements.map(el => ({
          tag: el.tagName.toLowerCase(),
          text: el.textContent?.slice(0, 60),
        }))
      );
      
      const stats = headings.reduce((acc, h) => {
        acc[h.tag] = (acc[h.tag] || 0) + 1;
        return acc;
      }, {});
      
      const h1Count = stats.h1 || 0;
      const totalHeadings = headings.length;
      
      console.log(`   📊 Total headings: ${totalHeadings}`);
      console.log(`   📊 H1: ${h1Count}, H2: ${stats.h2 || 0}, H3: ${stats.h3 || 0}, H4: ${stats.h4 || 0}, H5: ${stats.h5 || 0}, H6: ${stats.h6 || 0}`);
      console.log(`   ${h1Count === 1 ? '✅' : '❌'} Jerarquía: ${h1Count === 1 ? 'CORRECTA' : 'INCORRECTA'}`);
      
      if (h1Count !== 1) {
        console.log(`   🔥 PROBLEMA DETECTADO: Se encontraron ${h1Count} elementos H1`);
        if (h1Count > 1) {
          const h1s = headings.filter(h => h.tag === 'h1');
          console.log(`   📝 H1s encontrados:`, h1s.map(h => h.text));
        }
      }
      
    } catch (error) {
      console.error(`   ❌ Error en ${pageInfo.name}:`, error.message);
    } finally {
      await page.close();
    }
  }
  
  await browser.close();
  console.log('\n🎯 Análisis completado');
})(); 