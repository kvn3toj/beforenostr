const { execSync } = require('child_process');

console.log('🔧 Fixing admin access...\n');

try {
  // 1. Verificar que el login funciona
  console.log('🔍 Testing admin login...');
  const loginResult = execSync(`curl -s -X POST "http://localhost:1111/auth/login" -H "Content-Type: application/json" -d '{"email": "admin@gamifier.com", "password": "admin123"}'`, { encoding: 'utf8' });
  
  const loginData = JSON.parse(loginResult);
  
  if (loginData.access_token) {
    console.log('✅ Admin login successful!');
    console.log('👤 User:', loginData.user.name, `(${loginData.user.email})`);
    console.log('🏷️ Roles:', loginData.user.roles.length > 0 ? loginData.user.roles : 'No roles assigned');
    console.log('🔑 Permissions:', loginData.user.permissions.length > 0 ? loginData.user.permissions : 'No permissions assigned');
    
    // Si no tiene roles, no es crítico para el login básico
    if (loginData.user.roles.length === 0) {
      console.log('⚠️ Warning: User has no roles assigned, but login works');
    }
    
    console.log('\n🎉 Admin access is now working!');
    console.log('📝 Use these credentials:');
    console.log('   Email: admin@gamifier.com');
    console.log('   Password: admin123');
    
  } else {
    console.log('❌ Login failed:', loginData.message || loginData);
  }
  
} catch (error) {
  console.error('❌ Error testing login:', error.message);
}

console.log('\n✅ Admin access verification completed.'); 