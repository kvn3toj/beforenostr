#!/usr/bin/env node

const { chromium } = require('playwright');
const fs = require('fs').promises;
const path = require('path');
const fetch = require('node-fetch');

/**
 * Versión simplificada del scraper en JavaScript puro
 * Para uso rápido sin configuración de TypeScript
 */

const TARGET_URL = 'https://demo.coomunity.co/pilgrim/640baa58';
const OUTPUT_DIR = 'recovered_code/pilgrim_demo';

async function quickScrape() {
  console.log('🚀 Iniciando extracción rápida...');
  
  let browser;
  
  try {
    // Crear directorio
    await fs.mkdir(OUTPUT_DIR, { recursive: true });
    
    // Lanzar navegador
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    
    // Navegar y esperar
    console.log('📡 Navegando a la URL...');
    await page.goto(TARGET_URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);
    
    // Obtener HTML
    console.log('📄 Extrayendo HTML...');
    const html = await page.content();
    
    // Guardar HTML
    const htmlPath = path.join(OUTPUT_DIR, 'demo_pilgrim_index.html');
    await fs.writeFile(htmlPath, html, 'utf-8');
    
    console.log(`✅ HTML guardado: ${htmlPath}`);
    console.log('🎉 ¡Extracción completada!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// Ejecutar si es el archivo principal
if (require.main === module) {
  quickScrape()
    .then(() => process.exit(0))
    .catch(err => {
      console.error(err);
      process.exit(1);
    });
}

module.exports = { quickScrape }; 