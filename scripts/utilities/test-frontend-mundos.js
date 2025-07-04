// Test script para verificar el servicio de Mundos del frontend
import { fetchMundos, fetchMundoById } from './src/services/mundo.service.js';

async function testFrontendMundosService() {
  console.log('🧪 Iniciando pruebas del servicio de Mundos del frontend...\n');

  try {
    // Test 1: Obtener lista de mundos
    console.log('1. Obteniendo lista de mundos...');
    const mundosResponse = await fetchMundos();
    console.log('✅ Mundos obtenidos:', mundosResponse);
    console.log(`   - Total de mundos: ${mundosResponse.data.length}`);
    
    if (mundosResponse.data.length > 0) {
      const primerMundo = mundosResponse.data[0];
      console.log('   - Primer mundo:', primerMundo);
      
      // Test 2: Obtener mundo específico por ID
      console.log('\n2. Obteniendo mundo específico por ID...');
      try {
        const mundo = await fetchMundoById(primerMundo.id);
        console.log('✅ Mundo específico obtenido:', mundo);
      } catch (error) {
        console.log('❌ Error al obtener mundo específico:', error.message);
      }
    }

    console.log('\n🎉 Pruebas del frontend completadas!');

  } catch (error) {
    console.error('\n❌ Error durante las pruebas del frontend:', error.message);
    console.error('   Stack:', error.stack);
  }
}

// Ejecutar las pruebas
testFrontendMundosService(); 