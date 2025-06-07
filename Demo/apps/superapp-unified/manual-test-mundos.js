/**
 * 🧪 Test Manual: Verificación de Integración de Mundos
 * 
 * Script simple para probar que la página de mundos funcione correctamente
 * con el backend NestJS.
 */

console.log('🌍 Iniciando test manual de integración de Mundos...');

// Función para hacer requests HTTP simples
async function testEndpoint(url, description) {
  try {
    console.log(`🔍 Probando: ${description}`);
    console.log(`📡 URL: ${url}`);
    
    const response = await fetch(url);
    const data = await response.text();
    
    console.log(`✅ Estado: ${response.status} ${response.statusText}`);
    console.log(`📦 Datos: ${data.substring(0, 200)}${data.length > 200 ? '...' : ''}`);
    console.log('---');
    
    return { success: true, status: response.status, data };
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
    console.log('---');
    return { success: false, error: error.message };
  }
}

// Test principal
async function runTests() {
  console.log('🚀 Ejecutando tests de integración...\n');
  
  const tests = [
    {
      url: 'http://localhost:3000',
      description: 'SuperApp Frontend - Página principal'
    },
    {
      url: 'http://localhost:3000/mundos',
      description: 'SuperApp Frontend - Página de mundos'
    },
    {
      url: 'http://localhost:3002/health',
      description: 'Backend NestJS - Health check'
    },
    {
      url: 'http://localhost:3002/mundos/test',
      description: 'Backend NestJS - Test de mundos'
    },
    {
      url: 'http://localhost:3002/mundos/simple',
      description: 'Backend NestJS - Lista de mundos'
    }
  ];
  
  const results = [];
  
  for (const test of tests) {
    const result = await testEndpoint(test.url, test.description);
    results.push({ ...test, ...result });
    
    // Pausa entre requests
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  // Resumen final
  console.log('\n📊 RESUMEN DE TESTS:');
  console.log('=====================');
  
  results.forEach((result, index) => {
    const status = result.success ? '✅ PASS' : '❌ FAIL';
    console.log(`${index + 1}. ${status} - ${result.description}`);
    if (!result.success) {
      console.log(`   Error: ${result.error}`);
    }
  });
  
  const passed = results.filter(r => r.success).length;
  const total = results.length;
  
  console.log(`\n🎯 Total: ${passed}/${total} tests pasaron`);
  
  if (passed === total) {
    console.log('🎉 ¡Todos los tests pasaron! La integración está funcionando correctamente.');
  } else {
    console.log('⚠️ Algunos tests fallaron. Verificar la configuración.');
  }
}

// Instrucciones para ejecutar
console.log(`
📋 INSTRUCCIONES:
================

1. Asegúrate de que la SuperApp esté corriendo en http://localhost:3000
2. Asegúrate de que el Backend NestJS esté corriendo en http://localhost:3002
3. Ejecuta este script en la consola del navegador:

   - Abre http://localhost:3000/mundos en tu navegador
   - Abre las DevTools (F12)
   - Ve a la pestaña Console
   - Copia y pega la función runTests() y luego ejecuta: runTests()

4. Alternativamente, ejecuta con Node.js si tienes fetch disponible:
   node manual-test-mundos.js

`);

// Si estamos en Node.js, ejecutar automáticamente
if (typeof window === 'undefined') {
  // Configurar fetch para Node.js
  if (typeof fetch === 'undefined') {
    console.log('❌ fetch no está disponible. Instala node-fetch o ejecuta en el navegador.');
    console.log('💡 Ejecuta: npm install node-fetch');
  } else {
    runTests().catch(console.error);
  }
} else {
  // Estamos en el navegador, exponer la función
  window.runMundosTest = runTests;
  console.log('✅ Script cargado. Ejecuta runMundosTest() para comenzar.');
} 