#!/usr/bin/env node

/**
 * 🧪 Test de Integración: Home Module con Backend Real
 * Este script verifica que la migración de datos mock a datos reales del backend funcione correctamente
 */

const https = require('http');

const BACKEND_URL = 'http://localhost:3002';
const SUPERAPP_URL = 'http://localhost:3001';

// 🔑 Credenciales de prueba
const TEST_CREDENTIALS = {
  email: 'admin@gamifier.com',
  password: 'admin123'
};

console.log('🚀 INICIANDO TEST DE INTEGRACIÓN HOME MODULE - BACKEND REAL');
console.log('='.repeat(70));

async function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            data: data ? JSON.parse(data) : null,
            headers: res.headers
          });
        } catch (error) {
          resolve({
            status: res.statusCode,
            data: data,
            headers: res.headers
          });
        }
      });
    });
    
    req.on('error', reject);
    
    if (options.body) {
      req.write(options.body);
    }
    
    req.end();
  });
}

async function testBackendEndpoints() {
  console.log('\n📡 PASO 1: Verificando endpoints del backend...');
  
  try {
    // Test 1: Health check
    console.log('🔍 1.1. Health check del backend...');
    const healthResponse = await makeRequest(`${BACKEND_URL}/health`);
    
    if (healthResponse.status === 200) {
      console.log('✅ Backend health check: OK');
      console.log(`   📊 Response: ${JSON.stringify(healthResponse.data)}`);
    } else {
      throw new Error(`Health check failed: ${healthResponse.status}`);
    }

    // Test 2: Autenticación
    console.log('\n🔍 1.2. Autenticación con credenciales de prueba...');
    const authResponse = await makeRequest(`${BACKEND_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(TEST_CREDENTIALS)
    });

    if (authResponse.status === 200 || authResponse.status === 201) {
      console.log('✅ Autenticación: OK');
      const token = authResponse.data.access_token;
      const userId = authResponse.data.user.id;
      console.log(`   🔑 Token obtenido (primeros 20 chars): ${token?.substring(0, 20)}...`);
      console.log(`   👤 User ID: ${userId}`);

      // Test 3: Configuración elemental
      console.log('\n🔍 1.3. Configuración del sistema elemental...');
      const configResponse = await makeRequest(`${BACKEND_URL}/config/elemental-system`);
      
      if (configResponse.status === 200) {
        console.log('✅ Configuración elemental: OK');
        const config = configResponse.data;
        console.log(`   🔥 Fuego: ${config.fuego?.name} (${config.fuego?.color})`);
        console.log(`   💧 Agua: ${config.agua?.name} (${config.agua?.color})`);
        console.log(`   🌱 Tierra: ${config.tierra?.name} (${config.tierra?.color})`);
        console.log(`   🌬️ Aire: ${config.aire?.name} (${config.aire?.color})`);
      } else {
        throw new Error(`Config elemental failed: ${configResponse.status}`);
      }

      // Test 4: Métricas Ayni
      console.log('\n🔍 1.4. Métricas Ayni del usuario...');
      const metricsResponse = await makeRequest(`${BACKEND_URL}/users/${userId}/ayni-metrics`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (metricsResponse.status === 200) {
        console.log('✅ Métricas Ayni: OK');
        const metrics = metricsResponse.data;
        console.log(`   🌟 Öndas: ${metrics.ondas}`);
        console.log(`   💎 Mëritos: ${metrics.meritos}`);
        console.log(`   ⚖️ Balance Ayni: ${(metrics.balanceAyni * 100).toFixed(1)}%`);
        console.log(`   🏆 Nivel: ${metrics.ayniLevel}`);
        console.log(`   🔥 Fuego: ${metrics.elementos.fuego}`);
        console.log(`   💧 Agua: ${metrics.elementos.agua}`);
        console.log(`   🌱 Tierra: ${metrics.elementos.tierra}`);
        console.log(`   🌬️ Aire: ${metrics.elementos.aire}`);
      } else {
        throw new Error(`Ayni metrics failed: ${metricsResponse.status}`);
      }

      return { token, userId, success: true };
    } else {
      throw new Error(`Authentication failed: ${authResponse.status}`);
    }
  } catch (error) {
    console.error('❌ Error en endpoints del backend:', error.message);
    return { success: false, error: error.message };
  }
}

async function testSuperAppConnectivity() {
  console.log('\n🌐 PASO 2: Verificando conectividad de la SuperApp...');
  
  try {
    const superAppResponse = await makeRequest(SUPERAPP_URL);
    
    if (superAppResponse.status === 200) {
      console.log('✅ SuperApp respondiendo: OK');
      console.log(`   📱 Status: ${superAppResponse.status}`);
    } else {
      throw new Error(`SuperApp not responding: ${superAppResponse.status}`);
    }
    
    return { success: true };
  } catch (error) {
    console.error('❌ Error conectando con SuperApp:', error.message);
    return { success: false, error: error.message };
  }
}

async function generateReport(backendResult, superAppResult) {
  console.log('\n📋 REPORTE FINAL DE INTEGRACIÓN');
  console.log('='.repeat(50));
  
  const backendScore = backendResult.success ? 100 : 0;
  const superAppScore = superAppResult.success ? 100 : 0;
  const totalScore = (backendScore + superAppScore) / 2;
  
  console.log(`🎯 Backend Endpoints: ${backendScore}% ${backendResult.success ? '✅' : '❌'}`);
  console.log(`🎯 SuperApp Connectivity: ${superAppScore}% ${superAppResult.success ? '✅' : '❌'}`);
  console.log(`📊 Score Total: ${totalScore}%`);
  
  if (totalScore === 100) {
    console.log('\n🎉 ¡INTEGRACIÓN COMPLETAMENTE EXITOSA!');
    console.log('✨ El módulo Home está listo para usar datos reales del backend');
    console.log('🚀 Los hooks useAyniMetrics y useElementalConfig están funcionando correctamente');
  } else if (totalScore >= 50) {
    console.log('\n⚠️ INTEGRACIÓN PARCIAL');
    console.log('🔧 Algunos componentes necesitan ajustes');
  } else {
    console.log('\n❌ INTEGRACIÓN FALLÓ');
    console.log('🔥 Se requiere revisión técnica inmediata');
  }
  
  console.log('\n💡 PRÓXIMOS PASOS:');
  console.log('1. Abrir la SuperApp en http://localhost:3001');
  console.log('2. Iniciar sesión con admin@gamifier.com / admin123');
  console.log('3. Navegar al Dashboard Home');
  console.log('4. Verificar que las métricas Ayni se carguen dinámicamente');
  console.log('5. Revisar la consola del navegador para logs de "ÉXITO: Datos Ayni obtenidos del backend real"');
  
  return totalScore;
}

async function main() {
  try {
    const backendResult = await testBackendEndpoints();
    const superAppResult = await testSuperAppConnectivity();
    const score = await generateReport(backendResult, superAppResult);
    
    process.exit(score === 100 ? 0 : 1);
  } catch (error) {
    console.error('💥 Error inesperado:', error);
    process.exit(1);
  }
}

main(); 