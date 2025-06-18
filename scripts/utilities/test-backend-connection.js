/**
 * 🔍 Script simple para probar la conectividad del backend
 */

const API_BASE_URL = 'http://localhost:1111';

async function testConnection() {
  console.log('🔍 Testing backend connection...\n');

  // Test 1: Basic health check
  console.log('1. 🏥 Health Check...');
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    const data = await response.json();
    console.log('✅ Health OK:', data);
  } catch (error) {
    console.error('❌ Health FAILED:', error.message);
    return false;
  }

  // Test 2: CORS preflight check
  console.log('\n2. 🌐 CORS Preflight Check...');
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'OPTIONS',
      headers: {
        Origin: 'http://localhost:48752',
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type',
      },
    });
    console.log('✅ CORS Preflight Status:', response.status);
    console.log(
      '📋 CORS Headers:',
      Object.fromEntries(response.headers.entries())
    );
  } catch (error) {
    console.error('❌ CORS Preflight FAILED:', error.message);
  }

  // Test 3: Actual login attempt
  console.log('\n3. 🔐 Login Test...');
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Origin: 'http://localhost:48752',
      },
      body: JSON.stringify({
        email: 'admin@gamifier.com',
        password: 'admin123',
      }),
    });

    console.log('📊 Response Status:', response.status);
    console.log(
      '📋 Response Headers:',
      Object.fromEntries(response.headers.entries())
    );

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Login SUCCESS:', {
        hasToken: !!data.access_token,
        hasUser: !!data.user,
        userEmail: data.user?.email,
      });
      return true;
    } else {
      const errorData = await response.json();
      console.log('⚠️ Login Response Error:', errorData);
      return false;
    }
  } catch (error) {
    console.error('❌ Login Fetch FAILED:', error.message);
    console.error('📄 Full error:', error);
    return false;
  }
}

// Export para uso en Node.js si es necesario
if (typeof module !== 'undefined' && module.exports) {
  module.exports = testConnection;
} else {
  // Ejecutar en browser
  testConnection().then((success) => {
    console.log(`\n🎯 Test Result: ${success ? 'SUCCESS ✅' : 'FAILED ❌'}`);
  });
}
