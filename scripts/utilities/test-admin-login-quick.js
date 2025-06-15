const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testAdminLogin() {
  console.log('🔐 Probando login del administrador...');
  console.log('='.repeat(50));
  
  const loginData = {
    email: 'admin@gamifier.com',
    password: 'admin123'
  };
  
  try {
    console.log('📤 Enviando solicitud de login...');
    console.log('   Email:', loginData.email);
    console.log('   Password:', loginData.password);
    
    const response = await fetch('http://localhost:3002/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData)
    });
    
    console.log('📥 Respuesta recibida:');
    console.log('   Status:', response.status);
    console.log('   Status Text:', response.statusText);
    
    const responseData = await response.json();
    
    console.log('🔍 Respuesta completa:');
    console.log(JSON.stringify(responseData, null, 2));
    
    if (response.ok) {
      console.log('✅ ¡Login exitoso!');
      console.log('   Token:', responseData.token ? 'Presente' : 'Ausente');
      console.log('   Access Token:', responseData.access_token ? 'Presente' : 'Ausente');
      console.log('   Usuario:', responseData.user?.email || 'No disponible');
      console.log('   ID Usuario:', responseData.user?.id || 'No disponible');
      console.log('   Activo:', responseData.user?.isActive !== undefined ? responseData.user.isActive : 'No disponible');
      
      if (responseData.token) {
        console.log('🎯 Token JWT:', responseData.token.substring(0, 50) + '...');
      }
      
      if (responseData.access_token) {
        console.log('🎯 Access Token:', responseData.access_token.substring(0, 50) + '...');
      }
      
      // Probar una llamada autenticada
      if (responseData.token || responseData.access_token) {
        console.log('\n🔒 Probando llamada autenticada...');
        const token = responseData.token || responseData.access_token;
        
        const protectedResponse = await fetch('http://localhost:3002/users/profile', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        console.log('   Status de llamada protegida:', protectedResponse.status);
        
        if (protectedResponse.ok) {
          const profileData = await protectedResponse.json();
          console.log('   ✅ Perfil obtenido:', profileData.email);
        } else {
          console.log('   ❌ Error en llamada protegida');
        }
      }
      
    } else {
      console.log('❌ Error en login:');
      console.log('   Error:', responseData.message || responseData.error || 'Error desconocido');
      
      if (responseData.details) {
        console.log('   Detalles:', responseData.details);
      }
    }
    
  } catch (error) {
    console.log('❌ Error de conexión:');
    console.log('   Mensaje:', error.message);
    console.log('   Tipo:', error.code || 'Error de red');
    
    // Verificar si el backend está corriendo
    try {
      const healthCheck = await fetch('http://localhost:3002/health');
      if (healthCheck.ok) {
        console.log('🔍 Backend está corriendo, el problema es específico del login');
      }
    } catch (healthError) {
      console.log('🔍 Backend NO está respondiendo');
    }
  }
}

testAdminLogin(); 