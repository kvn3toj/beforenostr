// Script de Diagnóstico para Errores de Importación de Módulos
// Error ID: 18428a68a88c4b8c9eb9f24041edddc1

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function diagnoseModuleError() {
  console.log('🔍 Iniciando diagnóstico de errores de importación de módulos...');
  
  const browser = await puppeteer.launch({ 
    headless: false,
    devtools: true,
    args: ['--disable-web-security', '--disable-features=VizDisplayCompositor']
  });

  try {
    const page = await browser.newPage();
    
    // Capturar errores de consola
    const consoleErrors = [];
    const networkErrors = [];
    
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push({
          text: msg.text(),
          location: msg.location(),
          timestamp: new Date().toISOString()
        });
        console.log('❌ Console Error:', msg.text());
      }
    });

    // Capturar errores de red
    page.on('response', response => {
      if (!response.ok()) {
        networkErrors.push({
          url: response.url(),
          status: response.status(),
          statusText: response.statusText(),
          timestamp: new Date().toISOString()
        });
        console.log('🌐 Network Error:', response.status(), response.url());
      }
    });

    // Capturar errores de página
    page.on('pageerror', error => {
      console.log('🚨 Page Error:', error.message);
      consoleErrors.push({
        text: error.message,
        stack: error.stack,
        type: 'pageerror',
        timestamp: new Date().toISOString()
      });
    });

    console.log('🌐 Navegando a http://localhost:2222...');
    await page.goto('http://localhost:2222', { 
      waitUntil: 'networkidle0',
      timeout: 30000 
    });

    // Esperar un poco para que todos los módulos se carguen
    await page.waitForTimeout(5000);

    // Verificar si React se cargó correctamente
    const reactLoaded = await page.evaluate(() => {
      return typeof window.React !== 'undefined' || typeof window.__REACT_DEVTOOLS_GLOBAL_HOOK__ !== 'undefined';
    });

    // Verificar si la aplicación se montó
    const appMounted = await page.evaluate(() => {
      const root = document.getElementById('root');
      return root && root.children.length > 0;
    });

    // Verificar módulos problemáticos comunes
    const moduleChecks = await page.evaluate(() => {
      const checks = {};
      
      // Verificar si las librerías críticas están disponibles
      checks.react = typeof window.React !== 'undefined';
      checks.materialUI = typeof window.__mui !== 'undefined' || document.querySelector('[data-mui-internal-clone-element]') !== null;
      checks.sentry = typeof window.__SENTRY__ !== 'undefined';
      checks.vitals = typeof window.webVitals !== 'undefined';
      
      return checks;
    });

    // Generar reporte
    const report = {
      timestamp: new Date().toISOString(),
      errorId: '18428a68a88c4b8c9eb9f24041edddc1',
      status: {
        reactLoaded,
        appMounted,
        moduleChecks
      },
      errors: {
        console: consoleErrors,
        network: networkErrors
      },
      url: 'http://localhost:2222',
      userAgent: await browser.userAgent()
    };

    // Guardar reporte
    const reportPath = path.join(__dirname, '../logs/module-error-diagnosis.json');
    await fs.promises.mkdir(path.dirname(reportPath), { recursive: true });
    await fs.promises.writeFile(reportPath, JSON.stringify(report, null, 2));

    // Mostrar resumen
    console.log('\n📊 RESUMEN DEL DIAGNÓSTICO:');
    console.log('==========================');
    console.log(`✅ React Cargado: ${reactLoaded ? 'SÍ' : 'NO'}`);
    console.log(`✅ App Montada: ${appMounted ? 'SÍ' : 'NO'}`);
    console.log(`🔍 Errores de Consola: ${consoleErrors.length}`);
    console.log(`🌐 Errores de Red: ${networkErrors.length}`);
    console.log(`📄 Reporte guardado en: ${reportPath}`);

    if (consoleErrors.length > 0) {
      console.log('\n🚨 ERRORES ENCONTRADOS:');
      consoleErrors.forEach((error, index) => {
        console.log(`${index + 1}. ${error.text}`);
      });
    }

    if (networkErrors.length > 0) {
      console.log('\n🌐 ERRORES DE RED:');
      networkErrors.forEach((error, index) => {
        console.log(`${index + 1}. ${error.status} - ${error.url}`);
      });
    }

    return report;

  } catch (error) {
    console.error('💥 Error durante el diagnóstico:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

// Ejecutar diagnóstico si se llama directamente
if (require.main === module) {
  diagnoseModuleError()
    .then(() => {
      console.log('\n✅ Diagnóstico completado');
      process.exit(0);
    })
    .catch(error => {
      console.error('\n❌ Error en el diagnóstico:', error);
      process.exit(1);
    });
}

module.exports = { diagnoseModuleError }; 