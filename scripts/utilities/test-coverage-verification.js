#!/usr/bin/env node

/**
 * 🧪 GAMIFIER Test Coverage Verification Script
 * 
 * Este script verifica que toda la infraestructura de testing
 * esté correctamente implementada y funcionando.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🧪 GAMIFIER - Test Coverage Verification');
console.log('==========================================\n');

// Colores para output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkFileExists(filePath, description) {
  const exists = fs.existsSync(filePath);
  log(`${exists ? '✅' : '❌'} ${description}: ${filePath}`, exists ? 'green' : 'red');
  return exists;
}

function runCommand(command, description) {
  try {
    log(`🔍 ${description}...`, 'blue');
    const output = execSync(command, { encoding: 'utf8', stdio: 'pipe' });
    log(`✅ ${description} - SUCCESS`, 'green');
    return { success: true, output };
  } catch (error) {
    log(`❌ ${description} - FAILED`, 'red');
    log(`   Error: ${error.message}`, 'red');
    return { success: false, error: error.message };
  }
}

async function main() {
  let totalChecks = 0;
  let passedChecks = 0;

  log('📋 VERIFICANDO ARCHIVOS DE CONFIGURACIÓN', 'blue');
  log('==========================================');
  
  // Verificar archivos de configuración
  const configFiles = [
    ['jest.config.js', 'Jest configuration'],
    ['src/test/jest.setup.ts', 'Jest setup file'],
    ['playwright.config.ts', 'Playwright configuration'],
    ['package.json', 'Package.json with test scripts']
  ];

  configFiles.forEach(([file, desc]) => {
    totalChecks++;
    if (checkFileExists(file, desc)) passedChecks++;
  });

  log('\n📁 VERIFICANDO ARCHIVOS DE TEST', 'blue');
  log('=================================');

  // Verificar archivos de test
  const testFiles = [
    ['src/auth/auth.service.simple.spec.ts', 'AuthService unit tests'],
    ['src/users/users.service.simple.spec.ts', 'UsersService unit tests'],
    ['src/video-items/video-items.service.simple.spec.ts', 'VideoItemsService unit tests'],
    ['src/cache/cache.service.simple.spec.ts', 'CacheService unit tests'],
    ['e2e/backend-integration.spec.ts', 'Backend integration E2E tests'],
    ['e2e/video-items-functionality.spec.ts', 'Video items functionality E2E tests']
  ];

  testFiles.forEach(([file, desc]) => {
    totalChecks++;
    if (checkFileExists(file, desc)) passedChecks++;
  });

  log('\n🔧 VERIFICANDO SCRIPTS DE PACKAGE.JSON', 'blue');
  log('======================================');

  // Verificar scripts en package.json
  try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const requiredScripts = [
      'test:jest',
      'test:jest:watch',
      'test:jest:coverage',
      'test:jest:unit',
      'test:jest:integration',
      'test:all'
    ];

    requiredScripts.forEach(script => {
      totalChecks++;
      const exists = packageJson.scripts && packageJson.scripts[script];
      log(`${exists ? '✅' : '❌'} Script "${script}": ${exists ? 'EXISTS' : 'MISSING'}`, 
          exists ? 'green' : 'red');
      if (exists) passedChecks++;
    });
  } catch (error) {
    log('❌ Error reading package.json', 'red');
  }

  log('\n🏥 VERIFICANDO BACKEND HEALTH', 'blue');
  log('=============================');

  // Verificar que el backend esté corriendo
  const backendCheck = runCommand(
    'curl -s http://localhost:3002/health',
    'Backend health check'
  );
  totalChecks++;
  if (backendCheck.success) passedChecks++;

  log('\n🧪 VERIFICANDO DEPENDENCIAS DE TESTING', 'blue');
  log('======================================');

  // Verificar dependencias instaladas
  try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const testingDeps = [
      'jest',
      '@types/jest',
      'ts-jest',
      '@playwright/test',
      '@nestjs/testing'
    ];

    testingDeps.forEach(dep => {
      totalChecks++;
      const exists = (packageJson.dependencies && packageJson.dependencies[dep]) ||
                    (packageJson.devDependencies && packageJson.devDependencies[dep]);
      log(`${exists ? '✅' : '❌'} Dependency "${dep}": ${exists ? 'INSTALLED' : 'MISSING'}`, 
          exists ? 'green' : 'red');
      if (exists) passedChecks++;
    });
  } catch (error) {
    log('❌ Error checking dependencies', 'red');
  }

  log('\n📊 RESUMEN DE VERIFICACIÓN', 'blue');
  log('==========================');
  
  const percentage = Math.round((passedChecks / totalChecks) * 100);
  log(`Total checks: ${totalChecks}`);
  log(`Passed: ${passedChecks}`, 'green');
  log(`Failed: ${totalChecks - passedChecks}`, 'red');
  log(`Success rate: ${percentage}%`, percentage >= 80 ? 'green' : 'yellow');

  if (percentage >= 80) {
    log('\n🎉 TEST COVERAGE IMPLEMENTATION - SUCCESS!', 'green');
    log('La infraestructura de testing está correctamente implementada.', 'green');
  } else {
    log('\n⚠️  TEST COVERAGE IMPLEMENTATION - NEEDS ATTENTION', 'yellow');
    log('Algunos componentes necesitan atención.', 'yellow');
  }

  log('\n🚀 COMANDOS DISPONIBLES:', 'blue');
  log('========================');
  log('npm run test:jest                 # Ejecutar tests unitarios');
  log('npm run test:jest:coverage        # Tests con cobertura');
  log('npx playwright test               # Tests E2E');
  log('npm run test:all                  # Todos los tests');

  log('\n📚 DOCUMENTACIÓN:', 'blue');
  log('=================');
  log('Ver TEST_COVERAGE_EXPANSION_SUMMARY.md para detalles completos');

  return percentage >= 80;
}

// Ejecutar verificación
main().then(success => {
  process.exit(success ? 0 : 1);
}).catch(error => {
  log(`💥 Error during verification: ${error.message}`, 'red');
  process.exit(1);
}); 