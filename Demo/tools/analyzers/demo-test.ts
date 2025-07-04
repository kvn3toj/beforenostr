#!/usr/bin/env npx tsx

import { chromium } from 'playwright';
import { promises as fs } from 'fs';
import path from 'path';

/**
 * Script de demo para probar funcionalidades básicas antes del scraping completo
 */

const TEST_URL = 'https://demo.coomunity.co/pilgrim/640baa58';
const TEST_OUTPUT = 'test_demo';

async function testDemo() {
  console.log('🧪 Ejecutando prueba de demo...');
  console.log(`🎯 URL de prueba: ${TEST_URL}`);
  
  let browser;
  let page;
  
  try {
    // Crear directorio de prueba
    await fs.mkdir(TEST_OUTPUT, { recursive: true });
    
    // Lanzar navegador
    console.log('🌐 Lanzando navegador para prueba...');
    browser = await chromium.launch({ 
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    page = await browser.newPage();
    
    // Configurar interceptación básica
    let resourceCount = 0;
    page.on('response', (response) => {
      const url = response.url();
      const status = response.status();
      const contentType = response.headers()['content-type'] || '';
      
      if (status >= 200 && status < 300) {
        resourceCount++;
        console.log(`📦 [${resourceCount}] ${status} ${contentType.split(';')[0]} ${url.substring(0, 80)}...`);
      }
    });
    
    // Navegar
    console.log('📡 Navegando a URL de prueba...');
    await page.goto(TEST_URL, { waitUntil: 'networkidle', timeout: 30000 });
    
    // Obtener info básica
    const title = await page.title();
    const url = page.url();
    
    console.log(`📄 Título: ${title}`);
    console.log(`🔗 URL final: ${url}`);
    console.log(`📊 Recursos interceptados: ${resourceCount}`);
    
    // Guardar HTML básico
    const html = await page.content();
    const htmlPath = path.join(TEST_OUTPUT, 'demo_test.html');
    await fs.writeFile(htmlPath, html, 'utf-8');
    
    console.log(`✅ HTML de prueba guardado: ${htmlPath}`);
    console.log(`📏 Tamaño HTML: ${(html.length / 1024).toFixed(1)}KB`);
    
    console.log('🎉 ¡Prueba de demo completada exitosamente!');
    console.log('💡 Ahora puedes ejecutar el script completo con: npm run scrape');
    
  } catch (error) {
    console.error('❌ Error en prueba de demo:', error);
  } finally {
    if (page) await page.close();
    if (browser) await browser.close();
  }
}

testDemo().catch(console.error); 