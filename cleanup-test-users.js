const { PrismaClient } = require('./src/generated/prisma');

const prisma = new PrismaClient();

async function cleanupTestUsers() {
  try {
    console.log('🧹 Cleaning up test users...');
    
    // Delete test users
    const result = await prisma.user.deleteMany({
      where: {
        email: {
          contains: 'test_auto@gamifier.com'
        }
      }
    });
    
    console.log(`✅ Deleted ${result.count} test users`);
    
    // Also clean up any other test data
    const worldsResult = await prisma.mundo.deleteMany({
      where: {
        name: {
          contains: 'Mundo de Prueba Automatizado'
        }
      }
    });
    
    console.log(`✅ Deleted ${worldsResult.count} test worlds`);
    
  } catch (error) {
    console.error('❌ Error cleaning up test data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanupTestUsers(); 