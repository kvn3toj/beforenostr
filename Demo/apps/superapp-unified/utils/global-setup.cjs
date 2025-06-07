const { detectSuperAppPort } = require('./port-detector.cjs');

/**
 * Setup global de Playwright para detectar automáticamente el puerto activo
 */
async function globalSetup() {
  console.log('🚀 [Playwright Global Setup] Iniciando detección de puerto...');
  
  try {
    // Detectar el puerto activo de la SuperApp
    const activePort = await detectSuperAppPort();
    
    // Configurar la variable de entorno para que todos los tests la usen
    process.env.PLAYWRIGHT_BASE_URL = `http://localhost:${activePort}`;
    
    console.log(`✅ [Playwright Global Setup] Puerto configurado: ${activePort}`);
    console.log(`🎯 [Playwright Global Setup] Base URL: http://localhost:${activePort}`);
    
    // Verificar que la aplicación esté respondiendo
    const response = await fetch(`http://localhost:${activePort}`);
    if (response.ok) {
      console.log('✅ [Playwright Global Setup] SuperApp está respondiendo correctamente');
    } else {
      console.log('⚠️  [Playwright Global Setup] SuperApp responde pero con errores');
    }
    
  } catch (error) {
    console.log('❌ [Playwright Global Setup] Error:', error.message);
    console.log('🔄 [Playwright Global Setup] Usando puerto por defecto: 3000');
    process.env.PLAYWRIGHT_BASE_URL = 'http://localhost:3000';
  }
}

module.exports = globalSetup; 