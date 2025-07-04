// Test script para verificar el servicio de Mundos refactorizado
const API_BASE_URL = 'http://localhost:3002';

async function testMundosService() {
  console.log('🧪 Iniciando pruebas del servicio de Mundos...\n');

  try {
    // Test 1: Verificar que el backend esté funcionando
    console.log('1. Verificando conexión con el backend...');
    const healthResponse = await fetch(`${API_BASE_URL}/health`);
    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      console.log('✅ Backend funcionando:', healthData);
    } else {
      throw new Error('Backend no responde');
    }

    // Test 2: Obtener lista de mundos
    console.log('\n2. Obteniendo lista de mundos...');
    const mundosResponse = await fetch(`${API_BASE_URL}/mundos`);
    if (mundosResponse.ok) {
      const mundosData = await mundosResponse.json();
      console.log('✅ Mundos obtenidos:', mundosData);
      console.log(`   - Total de mundos: ${Array.isArray(mundosData) ? mundosData.length : 'Formato no esperado'}`);
      
      if (Array.isArray(mundosData) && mundosData.length > 0) {
        console.log('   - Primer mundo:', mundosData[0]);
        
        // Test 3a: Obtener un mundo específico usando el endpoint original
        console.log('\n3a. Obteniendo mundo específico (endpoint original)...');
        const mundoId = mundosData[0].id;
        const mundoResponse = await fetch(`${API_BASE_URL}/mundos/${mundoId}`);
        if (mundoResponse.ok) {
          const mundoData = await mundoResponse.json();
          console.log('✅ Mundo específico obtenido (endpoint original):', mundoData);
        } else {
          console.log('❌ Error al obtener mundo específico (endpoint original):', mundoResponse.status);
          const errorText = await mundoResponse.text();
          console.log('   Error details:', errorText);
        }

        // Test 3b: Obtener un mundo específico usando el nuevo endpoint /id/:id
        console.log('\n3b. Obteniendo mundo específico (endpoint /id/:id)...');
        const mundoIdResponse = await fetch(`${API_BASE_URL}/mundos/id/${mundoId}`);
        if (mundoIdResponse.ok) {
          const mundoIdData = await mundoIdResponse.json();
          console.log('✅ Mundo específico obtenido (endpoint /id/:id):', mundoIdData);
        } else {
          console.log('❌ Error al obtener mundo específico (endpoint /id/:id):', mundoIdResponse.status);
          const errorText = await mundoIdResponse.text();
          console.log('   Error details:', errorText);
        }

        // Test 4: Obtener playlists del mundo
        console.log('\n4. Obteniendo playlists del mundo...');
        const playlistsResponse = await fetch(`${API_BASE_URL}/mundos/${mundoId}/playlists`);
        if (playlistsResponse.ok) {
          const playlistsData = await playlistsResponse.json();
          console.log('✅ Playlists del mundo obtenidas:', playlistsData);
          console.log(`   - Total de playlists: ${Array.isArray(playlistsData) ? playlistsData.length : 'Formato no esperado'}`);
        } else {
          console.log('❌ Error al obtener playlists del mundo:', playlistsResponse.status);
        }
      }
    } else {
      console.log('❌ Error al obtener mundos:', mundosResponse.status);
      const errorText = await mundosResponse.text();
      console.log('   Error details:', errorText);
    }

    // Test 5: Verificar endpoint de test
    console.log('\n5. Verificando endpoint de test...');
    const testResponse = await fetch(`${API_BASE_URL}/mundos/test`);
    if (testResponse.ok) {
      const testData = await testResponse.json();
      console.log('✅ Endpoint de test funcionando:', testData);
    } else {
      console.log('❌ Error en endpoint de test:', testResponse.status);
    }

    // Test 6: Verificar endpoint de db-test
    console.log('\n6. Verificando endpoint de db-test...');
    const dbTestResponse = await fetch(`${API_BASE_URL}/mundos/db-test`);
    if (dbTestResponse.ok) {
      const dbTestData = await dbTestResponse.json();
      console.log('✅ Endpoint de db-test funcionando:', dbTestData);
    } else {
      console.log('❌ Error en endpoint de db-test:', dbTestResponse.status);
    }

    console.log('\n🎉 Pruebas completadas exitosamente!');

  } catch (error) {
    console.error('\n❌ Error durante las pruebas:', error.message);
    console.error('   Stack:', error.stack);
  }
}

// Ejecutar las pruebas
testMundosService(); 