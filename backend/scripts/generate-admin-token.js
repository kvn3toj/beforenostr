require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Configuración del JWT (debe coincidir con la configuración del backend)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

console.log('🔧 Configuración JWT cargada:');
console.log(
  '- JWT_SECRET:',
  JWT_SECRET ? '✅ Configurado' : '❌ No encontrado'
);
console.log('- JWT_EXPIRES_IN:', JWT_EXPIRES_IN);
console.log('');

// Datos del usuario administrador
const adminUser = {
  id: 'admin-user-id',
  email: 'admin@gamifier.com',
  roles: ['admin', 'user'],
  firstName: 'Admin',
  lastName: 'User',
};

// Generar token JWT
const token = jwt.sign(
  {
    sub: adminUser.id,
    email: adminUser.email,
    roles: adminUser.roles,
    firstName: adminUser.firstName,
    lastName: adminUser.lastName,
  },
  JWT_SECRET,
  { expiresIn: JWT_EXPIRES_IN }
);

console.log('🎯 TOKEN JWT DE ADMINISTRADOR GENERADO:');
console.log('=====================================');
console.log(token);
console.log('=====================================');
console.log('');
console.log('📋 INSTRUCCIONES DE USO:');
console.log('1. Copia el token de arriba');
console.log('2. En tu cliente HTTP (Postman, curl, etc.), agrega el header:');
console.log('   Authorization: Bearer ' + token);
console.log('');
console.log('🔍 EJEMPLO DE USO CON CURL:');
console.log(
  `curl -H "Authorization: Bearer ${token}" http://localhost:3002/auth/me`
);
console.log('');
console.log(
  '⚠️  NOTA: Este token es válido por 7 días y tiene permisos de administrador.'
);
console.log('');

// También mostrar información de decodificación
try {
  const decoded = jwt.decode(token, { complete: true });
  console.log('🔓 INFORMACIÓN DEL TOKEN:');
  console.log('- Usuario ID:', decoded.payload.sub);
  console.log('- Email:', decoded.payload.email);
  console.log('- Roles:', decoded.payload.roles);
  console.log(
    '- Expira en:',
    new Date(decoded.payload.exp * 1000).toLocaleString()
  );
} catch (error) {
  console.log('Error al decodificar token:', error.message);
}
