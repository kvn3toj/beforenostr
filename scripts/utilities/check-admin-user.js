const { PrismaClient } = require('./src/generated/prisma');
const prisma = new PrismaClient();

async function checkAdmin() {
  try {
    console.log('🔍 Verificando usuario admin...');
    
    const admin = await prisma.user.findUnique({
      where: { email: 'admin@gamifier.com' }
    });
    
    if (admin) {
      console.log('✅ Usuario admin encontrado:');
      console.log('   Email:', admin.email);
      console.log('   ID:', admin.id);
      console.log('   Estado:', admin.isActive ? 'Activo' : 'Inactivo');
      console.log('   Password Hash:', admin.password ? 'Configurado' : 'NO configurado');
    } else {
      console.log('❌ Usuario admin NO encontrado');
    }
    
    const totalUsers = await prisma.user.count();
    console.log('📊 Total de usuarios en la BD:', totalUsers);
    
    if (totalUsers > 0) {
      const allUsers = await prisma.user.findMany({
        select: { id: true, email: true, isActive: true }
      });
      console.log('👥 Usuarios existentes:');
      allUsers.forEach(user => {
        console.log(`   - ${user.email} (ID: ${user.id}, ${user.isActive ? 'Activo' : 'Inactivo'})`);
      });
    }
    
  } catch (error) {
    console.log('❌ Error verificando admin:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkAdmin(); 