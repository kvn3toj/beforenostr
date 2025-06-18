const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Navegar exactamente igual que el test
  await page.goto('http://localhost:3333');
  await page.waitForLoadState('networkidle');
  
  // Replicar exactamente la lógica del test
  const buttonConsistency = await page.evaluate(() => {
    const buttons = document.querySelectorAll('button, .btn, [role="button"]');
    if (buttons.length === 0) return { consistent: false, count: 0 };

    const firstButton = buttons[0];
    const firstStyles = window.getComputedStyle(firstButton);
    const borderRadius = firstStyles.borderRadius;
    const padding = firstStyles.padding;

    let consistent = true;
    const allValues = [];
    
    for (let i = 0; i < Math.min(buttons.length, 5); i++) {
      const btn = buttons[i];
      const styles = window.getComputedStyle(btn);
      const currentRadius = styles.borderRadius;
      
      allValues.push({
        index: i,
        borderRadius: currentRadius,
        text: btn.textContent?.trim().slice(0, 15) || 'sin texto',
        classes: Array.from(btn.classList).slice(0, 2).join(' ')
      });
      
      if (currentRadius !== borderRadius) {
        consistent = false;
      }
    }

    return { 
      consistent, 
      count: buttons.length, 
      borderRadius, 
      padding,
      allValues,
      firstButtonRadius: borderRadius 
    };
  });

  console.log('=== REPLICACIÓN EXACTA DEL TEST ===');
  console.log(`Total de botones: ${buttonConsistency.count}`);
  console.log(`Consistente: ${buttonConsistency.consistent}`);
  console.log(`Border-radius del primer botón: ${buttonConsistency.firstButtonRadius}`);
  console.log('\nPrimeros 5 botones analizados:');
  
  buttonConsistency.allValues.forEach(btn => {
    const isConsistent = btn.borderRadius === buttonConsistency.firstButtonRadius ? '✅' : '❌';
    console.log(`  ${isConsistent} Botón ${btn.index}: "${btn.text}" -> ${btn.borderRadius} [${btn.classes}]`);
  });
  
  if (!buttonConsistency.consistent) {
    console.log('\n🔍 ANÁLISIS DEL PROBLEMA:');
    const uniqueValues = [...new Set(buttonConsistency.allValues.map(b => b.borderRadius))];
    console.log(`Valores únicos encontrados: ${uniqueValues.join(', ')}`);
    console.log('El test falla porque compara iconos circulares (50%) con botones regulares (12px)');
  }
  
  await browser.close();
})(); 