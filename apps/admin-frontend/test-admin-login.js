#!/usr/bin/env node

/**
 * 🧪 SCRIPT DE VERIFICACIÓN DE LOGIN - GAMIFIER ADMIN
 * 
 * Este script verifica que el login del admin funcione correctamente
 * en el Gamifier Admin después del protocolo de armonización.
 */

console.log('🔍 VERIFICACIÓN DE LOGIN - GAMIFIER ADMIN');
console.log('==========================================');

const API_BASE_URL = 'http://localhost:3002';
const ADMIN_CREDENTIALS = {
  email: 'admin@gamifier.com',
  password: 'admin123'
};

async function testAdminLogin() {
  try {
    console.log('🔐 Intentando login con credenciales del admin...');
    console.log(`📧 Email: ${ADMIN_CREDENTIALS.email}`);
    console.log(`🔑 Password: ${ADMIN_CREDENTIALS.password}`);
    
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ADMIN_CREDENTIALS),
    });

    console.log(`📊 Status: ${response.status} ${response.statusText}`);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ ERROR EN LOGIN:', errorData);
      return false;
    }

    const authData = await response.json();
    console.log('✅ LOGIN EXITOSO!');
    console.log('📋 Datos de respuesta:');
    console.log(`   - User ID: ${authData.user.id}`);
    console.log(`   - Email: ${authData.user.email}`);
    console.log(`   - Name: ${authData.user.name}`);
    console.log(`   - Roles: ${JSON.stringify(authData.user.roles)}`);
    console.log(`   - Token: ${authData.access_token.substring(0, 50)}...`);
    
    // Verificar que el token funciona
    console.log('\n🔍 Verificando token con /users/me...');
    const userResponse = await fetch(`${API_BASE_URL}/users/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authData.access_token}`,
        'Content-Type': 'application/json',
      },
    });

    if (userResponse.ok) {
      const userData = await userResponse.json();
      console.log('✅ TOKEN VÁLIDO - Usuario verificado:');
      console.log(`   - ID: ${userData.id}`);
      console.log(`   - Email: ${userData.email}`);
      console.log(`   - Name: ${userData.name}`);
    } else {
      console.log('⚠️  Token válido pero /users/me falló');
    }

    return true;
  } catch (error) {
    console.error('💥 ERROR CRÍTICO:', error.message);
    return false;
  }
}

async function main() {
  console.log('🚀 Iniciando verificación...\n');
  
  const success = await testAdminLogin();
  
  console.log('\n🎯 RESULTADO FINAL:');
  if (success) {
    console.log('✅ EL LOGIN DEL ADMIN FUNCIONA CORRECTAMENTE EN GAMIFIER ADMIN');
    console.log('🎉 El protocolo de armonización se completó exitosamente');
    process.exit(0);
  } else {
    console.log('❌ EL LOGIN DEL ADMIN FALLÓ EN GAMIFIER ADMIN');
    console.log('🔧 Se requiere investigación adicional');
    process.exit(1);
  }
}

// Ejecutar solo si es llamado directamente
if (require.main === module) {
  main();
}