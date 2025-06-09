/**
 * 🔍 Script de debugging para verificar la conexión de autenticación
 *
 * Prueba las siguientes funcionalidades:
 * 1. Conectividad con el backend
 * 2. Configuración CORS
 * 3. Endpoint de login con credenciales válidas
 * 4. Formato de respuesta del backend
 */

const API_BASE_URL = 'http://localhost:3002';

async function debugAuthConnection() {
  console.log('🔍 Iniciando debug de conexión de autenticación...\n');

  // Test 1: Health Check
  console.log('1. 🏥 Verificando health del backend...');
  try {
    const healthResponse = await fetch(`${API_BASE_URL}/health`);
    const healthData = await healthResponse.json();
    console.log('   ✅ Backend responde:', healthData);
  } catch (error) {
    console.error('   ❌ Error en health check:', error.message);
    return;
  }

  // Test 2: CORS Options preflight
  console.log('\n2. 🌐 Verificando CORS preflight...');
  try {
    const corsResponse = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'OPTIONS',
      headers: {
        Origin: window.location.origin,
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type',
      },
    });
    console.log('   ✅ CORS preflight status:', corsResponse.status);
    console.log(
      '   📋 CORS headers:',
      Object.fromEntries(corsResponse.headers.entries())
    );
  } catch (error) {
    console.error('   ❌ Error en CORS preflight:', error.message);
  }

  // Test 3: Login con credenciales incorrectas (debe devolver 401)
  console.log('\n3. 🔐 Probando login con credenciales incorrectas...');
  try {
    const wrongResponse = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Origin: window.location.origin,
      },
      body: JSON.stringify({
        email: 'wrong@test.com',
        password: 'wrongpassword',
      }),
    });

    const wrongData = await wrongResponse.json();
    console.log(
      '   ✅ Respuesta esperada (401):',
      wrongResponse.status,
      wrongData
    );
  } catch (error) {
    console.error('   ❌ Error en login incorrecto:', error.message);
  }

  // Test 4: Login con credenciales correctas
  console.log('\n4. 🎯 Probando login con credenciales correctas...');
  try {
    const loginResponse = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Origin: window.location.origin,
      },
      body: JSON.stringify({
        email: 'admin@gamifier.com',
        password: 'admin123',
      }),
    });

    if (loginResponse.ok) {
      const loginData = await loginResponse.json();
      console.log('   ✅ Login exitoso:', {
        status: loginResponse.status,
        hasToken: !!loginData.access_token,
        hasUser: !!loginData.user,
        userEmail: loginData.user?.email,
        userRoles: loginData.user?.roles,
        tokenLength: loginData.access_token?.length || 0,
      });
    } else {
      const errorData = await loginResponse.json();
      console.error('   ❌ Login falló:', loginResponse.status, errorData);
    }
  } catch (error) {
    console.error('   ❌ Error en login correcto:', error.message);
    console.error('   📄 Error completo:', error);
  }

  // Test 5: Verificar configuración del frontend
  console.log('\n5. ⚙️  Verificando configuración del frontend...');
  console.log('   📍 Current Origin:', window.location.origin);
  console.log('   🔧 API Base URL:', API_BASE_URL);
  console.log(
    '   🧪 Mock Auth:',
    import.meta?.env?.VITE_ENABLE_MOCK_AUTH || 'undefined'
  );
  console.log('   🌍 Environment:', import.meta?.env?.MODE || 'undefined');

  console.log('\n🎉 Debug completado!');
}

// Ejecutar el debug
debugAuthConnection().catch(console.error);
