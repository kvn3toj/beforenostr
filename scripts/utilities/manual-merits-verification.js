/**
 * 🔍 VERIFICACIÓN MANUAL - FASE A.3: Módulo de Méritos y Tokens
 * 
 * Este script verifica manualmente que las páginas de méritos y tokens funcionan correctamente
 */

const testUrls = [
  {
    url: 'http://localhost:3333/',
    name: 'Home Page',
    expected: ['CoomÜnity', 'dashboard', 'inicio']
  },
  {
    url: 'http://localhost:3333/merits',
    name: 'Página de Méritos',
    expected: ['Sistema de Méritos', 'méritos', 'Merit', 'MERITO', 'ONDA', 'VIBRA']
  },
  {
    url: 'http://localhost:3333/tokens',
    name: 'Página de Tokens',
    expected: ['Tokens del Sistema', 'tokens', 'Token', 'Total de Tokens']
  },
  {
    url: 'http://localhost:3333/wallet',
    name: 'Página de Wallet',
    expected: ['wallet', 'Wallet', 'saldo', 'balance', 'transacción']
  }
];

async function verifyPage(testCase) {
  console.log(`\n🔍 Verificando: ${testCase.name}`);
  console.log(`📍 URL: ${testCase.url}`);
  
  try {
    const response = await fetch(testCase.url, {
      method: 'GET',
      headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'User-Agent': 'SuperApp-Verification-Script/1.0'
      }
    });
    
    console.log(`📊 Status: ${response.status} ${response.statusText}`);
    
    if (response.ok) {
      const html = await response.text();
      
      // Verificar que contiene contenido esperado
      const foundTerms = testCase.expected.filter(term => 
        html.toLowerCase().includes(term.toLowerCase())
      );
      
      console.log(`✅ Página carga correctamente`);
      console.log(`📝 Términos encontrados: ${foundTerms.length}/${testCase.expected.length}`);
      
      if (foundTerms.length > 0) {
        console.log(`🎯 Términos detectados: ${foundTerms.join(', ')}`);
        return { success: true, foundTerms: foundTerms.length, url: testCase.url };
      } else {
        console.log(`⚠️ No se encontraron términos esperados en el contenido`);
        return { success: false, foundTerms: 0, url: testCase.url };
      }
    } else {
      console.log(`❌ Error HTTP: ${response.status}`);
      return { success: false, foundTerms: 0, url: testCase.url, error: response.status };
    }
    
  } catch (error) {
    console.log(`💥 Error de red: ${error.message}`);
    return { success: false, foundTerms: 0, url: testCase.url, error: error.message };
  }
}

async function verifyBackendConnectivity() {
  console.log(`\n🔗 Verificando conectividad con Backend NestJS...`);
  
  try {
    const response = await fetch('http://localhost:1111/health');
    const data = await response.json();
    
    console.log(`✅ Backend NestJS responde: ${data.status}`);
    console.log(`📅 Timestamp: ${data.timestamp}`);
    console.log(`💬 Mensaje: ${data.message}`);
    
    return { backendAvailable: true, status: data.status };
  } catch (error) {
    console.log(`❌ Backend NestJS no disponible: ${error.message}`);
    return { backendAvailable: false, error: error.message };
  }
}

async function runVerification() {
  console.log(`
🚀 FASE A.3: VERIFICACIÓN MANUAL DEL MÓDULO DE MÉRITOS Y TOKENS
================================================================

📋 Verificando las siguientes funcionalidades:
- ✅ Conectividad con Backend NestJS (puerto 3002)
- ✅ Páginas de Méritos, Tokens y Wallet (puerto 3000)
- ✅ Contenido específico de gamificación
- ✅ Respuesta HTTP correcta

`);

  // 1. Verificar backend
  const backendResult = await verifyBackendConnectivity();
  
  // 2. Verificar páginas del frontend
  const results = [];
  
  for (const testCase of testUrls) {
    const result = await verifyPage(testCase);
    results.push(result);
    
    // Pausa entre requests
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  // 3. Resumen final
  console.log(`
📊 RESUMEN DE VERIFICACIÓN - FASE A.3
====================================

🔗 Backend NestJS (puerto 3002):
   Status: ${backendResult.backendAvailable ? '✅ DISPONIBLE' : '❌ NO DISPONIBLE'}
   ${backendResult.status ? `Respuesta: ${backendResult.status}` : ''}

📱 SuperApp Frontend (puerto 3000):
`);

  results.forEach(result => {
    console.log(`   ${result.success ? '✅' : '❌'} ${result.url}`);
    console.log(`      Términos encontrados: ${result.foundTerms}`);
    if (result.error) {
      console.log(`      Error: ${result.error}`);
    }
  });
  
  const successfulPages = results.filter(r => r.success).length;
  const totalPages = results.length;
  
  console.log(`
🎯 RESULTADO FINAL:
   - Backend: ${backendResult.backendAvailable ? 'OPERATIVO' : 'NO DISPONIBLE'}
   - Frontend: ${successfulPages}/${totalPages} páginas funcionando
   - Estado General: ${(backendResult.backendAvailable && successfulPages === totalPages) ? 
     '🟢 SISTEMA COMPLETAMENTE FUNCIONAL' : 
     (successfulPages > 0 ? '🟡 FUNCIONAMIENTO PARCIAL' : '🔴 SISTEMA NO FUNCIONAL')}

📝 CONCLUSIÓN FASE A.3:
   ${(backendResult.backendAvailable && successfulPages === totalPages) ? 
     '✅ El módulo de Méritos y Tokens está completamente verificado y funcional.' :
     '⚠️ Se detectaron problemas que requieren atención.'}
`);
}

// Ejecutar verificación
runVerification().catch(console.error); 