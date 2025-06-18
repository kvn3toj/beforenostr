const { request } = require('playwright');

async function testEndpoints() {
  const baseURL = 'http://localhost:1111';
  
  // Crear contexto de request con timeout más corto
  const requestContext = await request.newContext({
    timeout: 10000, // 10 segundos
  });
  
  console.log('🚀 Starting API endpoint verification...\n');
  
  try {
    // Test 1: Server health check
    console.log('🔍 Testing server health (/)...');
    try {
      const healthResponse = await requestContext.get(`${baseURL}/`);
      console.log('📊 Status:', healthResponse.status());
      
      if (healthResponse.status() === 200) {
        const healthBody = await healthResponse.text();
        console.log('📄 Response:', healthBody.substring(0, 100) + '...');
        console.log('✅ Server is running!\n');
      } else {
        console.log('❌ Server health check failed\n');
      }
    } catch (error) {
      console.log('❌ Server connection failed:', error.message, '\n');
      return; // Si no podemos conectar al servidor, no tiene sentido continuar
    }
    
    // Test 2: /users endpoint
    console.log('🔍 Testing /users endpoint...');
    try {
      const usersResponse = await requestContext.get(`${baseURL}/users`);
      console.log('📊 Status:', usersResponse.status());
      
      if (usersResponse.status() === 200) {
        const usersBody = await usersResponse.json();
        console.log('📄 Response structure:');
        console.log('  - data:', Array.isArray(usersBody.data) ? `Array with ${usersBody.data.length} items` : 'Not an array');
        console.log('  - total:', usersBody.total);
        console.log('  - page:', usersBody.page);
        console.log('  - pageSize:', usersBody.pageSize);
        
        if (usersBody.data && usersBody.data.length > 0) {
          console.log('  - First user sample:', {
            id: usersBody.data[0].id,
            email: usersBody.data[0].email,
            name: usersBody.data[0].name
          });
        }
        console.log('✅ /users endpoint working correctly!\n');
      } else {
        const errorBody = await usersResponse.text();
        console.log('❌ /users endpoint failed');
        console.log('📄 Error response:', errorBody, '\n');
      }
    } catch (error) {
      console.log('❌ /users request failed:', error.message, '\n');
    }
    
    // Test 3: /roles endpoint
    console.log('🔍 Testing /roles endpoint...');
    try {
      const rolesResponse = await requestContext.get(`${baseURL}/roles`);
      console.log('📊 Status:', rolesResponse.status());
      
      const rolesBody = await rolesResponse.text();
      
      if (rolesResponse.status() === 200) {
        try {
          const rolesJson = JSON.parse(rolesBody);
          console.log('📄 Success response:', JSON.stringify(rolesJson, null, 2));
          console.log('✅ /roles endpoint working correctly!\n');
        } catch (e) {
          console.log('📄 Response (not JSON):', rolesBody);
          console.log('✅ /roles endpoint responded but not JSON\n');
        }
      } else {
        console.log('❌ /roles endpoint failed with status:', rolesResponse.status());
        console.log('📄 Error response:', rolesBody);
        
        try {
          const errorJson = JSON.parse(rolesBody);
          console.log('🔍 Parsed error:', JSON.stringify(errorJson, null, 2));
        } catch (e) {
          console.log('📄 Raw error (not JSON):', rolesBody);
        }
        console.log('');
      }
    } catch (error) {
      console.log('❌ /roles request failed:', error.message, '\n');
    }
    
    // Test 4: Simple test endpoints
    console.log('🔍 Testing simple endpoints...');
    
    try {
      const usersTestResponse = await requestContext.get(`${baseURL}/users/test`);
      console.log('📊 /users/test status:', usersTestResponse.status());
      if (usersTestResponse.status() === 200) {
        const testBody = await usersTestResponse.json();
        console.log('📄 /users/test response:', JSON.stringify(testBody, null, 2));
      }
    } catch (error) {
      console.log('❌ /users/test failed:', error.message);
    }
    
    try {
      const usersSimpleResponse = await requestContext.get(`${baseURL}/users/simple`);
      console.log('📊 /users/simple status:', usersSimpleResponse.status());
      if (usersSimpleResponse.status() === 200) {
        const simpleBody = await usersSimpleResponse.json();
        console.log('📄 /users/simple response length:', Array.isArray(simpleBody) ? simpleBody.length : 'Not an array');
        if (Array.isArray(simpleBody) && simpleBody.length > 0) {
          console.log('📄 First item sample:', simpleBody[0]);
        }
      }
    } catch (error) {
      console.log('❌ /users/simple failed:', error.message);
    }
    
  } finally {
    await requestContext.dispose();
  }
  
  console.log('\n🏁 API endpoint verification completed!');
}

// Ejecutar las pruebas
testEndpoints().catch(console.error); 