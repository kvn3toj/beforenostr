const bcrypt = require('bcryptjs');

async function debugAdminLogin() {
  console.log('🔍 Debugging admin login issue...\n');
  
  // 1. Generar hash correcto para "admin123"
  const password = 'admin123';
  const saltRounds = 10;
  
  console.log('🔐 Generating correct password hash...');
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  console.log('Generated hash:', hashedPassword);
  
  // 2. Verificar que el hash funcione
  const isValid = await bcrypt.compare(password, hashedPassword);
  console.log('Hash verification:', isValid ? '✅ Valid' : '❌ Invalid');
  
  // 3. Probar hashes conocidos
  const knownHashes = [
    '$2b$10$EixZaYVK1fsbw1ZcfRHAu.Q4.X1pLkllX.iDo3TxOqRqoqAh5PQ6.',
    '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'
  ];
  
  console.log('\n🧪 Testing known hashes:');
  for (let i = 0; i < knownHashes.length; i++) {
    const hash = knownHashes[i];
    const isValidKnown = await bcrypt.compare(password, hash);
    console.log(`Hash ${i + 1}: ${isValidKnown ? '✅ Valid' : '❌ Invalid'} - ${hash}`);
  }
  
  console.log('\n📝 Use this SQL to update admin password:');
  console.log(`UPDATE users SET password = '${hashedPassword}' WHERE email = 'admin@gamifier.com';`);
}

debugAdminLogin().catch(console.error); 