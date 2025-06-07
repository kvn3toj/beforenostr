#!/usr/bin/env node

const { execSync } = require('child_process');
const { detectSuperAppPort } = require('../utils/port-detector.cjs');

/**
 * Script para ejecutar tests de Playwright con detección automática de puertos
 * Uso: node scripts/test-with-port-detection.cjs [test-file] [options]
 */
async function runTestsWithPortDetection() {
  console.log('🚀 [Test Runner] Iniciando detección automática de puerto...');
  
  try {
    // Detectar el puerto activo
    const activePort = await detectSuperAppPort();
    console.log(`✅ [Test Runner] Puerto detectado: ${activePort}`);
    
    // Configurar variable de entorno
    process.env.PLAYWRIGHT_BASE_URL = `http://localhost:${activePort}`;
    
    // Obtener argumentos del comando
    const args = process.argv.slice(2);
    const testFile = args.find(arg => arg.endsWith('.spec.ts')) || '';
    const otherArgs = args.filter(arg => !arg.endsWith('.spec.ts'));
    
    // Construir comando de Playwright con configuración local
    let command = 'npx playwright test --config=playwright.config.ts';
    
    if (testFile) {
      command += ` ${testFile}`;
    }
    
    // Agregar argumentos adicionales
    if (otherArgs.length > 0) {
      command += ` ${otherArgs.join(' ')}`;
    }
    
    // Agregar --headed por defecto si no se especifica lo contrario
    if (!otherArgs.some(arg => arg.includes('headed'))) {
      command += ' --headed';
    }
    
    console.log(`🎯 [Test Runner] Ejecutando: ${command}`);
    console.log(`🌐 [Test Runner] Base URL: http://localhost:${activePort}`);
    console.log('─'.repeat(60));
    
    // Ejecutar el comando
    execSync(command, { 
      stdio: 'inherit',
      env: { 
        ...process.env, 
        PLAYWRIGHT_BASE_URL: `http://localhost:${activePort}` 
      }
    });
    
    console.log('─'.repeat(60));
    console.log('✅ [Test Runner] Tests completados exitosamente');
    
  } catch (error) {
    console.error('❌ [Test Runner] Error ejecutando tests:', error.message);
    process.exit(1);
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  runTestsWithPortDetection();
}

module.exports = { runTestsWithPortDetection }; 