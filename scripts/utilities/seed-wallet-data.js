const { PrismaClient } = require('./src/generated/prisma');

const prisma = new PrismaClient();

async function seedWalletData() {
  console.log('🪙 Iniciando seed de datos de Wallet y Transacciones...');

  try {
    // Obtener algunos usuarios existentes
    const users = await prisma.user.findMany({
      take: 5,
      select: { id: true, email: true, name: true }
    });

    if (users.length === 0) {
      console.log('❌ No hay usuarios en la base de datos. Ejecuta seed-data.js primero.');
      return;
    }

    console.log(`✅ Encontrados ${users.length} usuarios para crear wallets`);

    // Crear wallets para los usuarios
    for (const user of users) {
      const existingWallet = await prisma.wallet.findUnique({
        where: { userId: user.id }
      });

      if (!existingWallet) {
        const wallet = await prisma.wallet.create({
          data: {
            userId: user.id,
            blockchainAddress: `0x${Math.random().toString(16).substr(2, 40)}`,
            balanceUnits: Math.floor(Math.random() * 1000) + 100,
            balanceToins: Math.floor(Math.random() * 500) + 50,
            status: Math.random() > 0.2 ? 'ACTIVE' : 'INACTIVE'
          }
        });
        console.log(`✅ Wallet creado para ${user.email}: ${wallet.balanceUnits} units, ${wallet.balanceToins} toins`);
      } else {
        console.log(`ℹ️ Wallet ya existe para ${user.email}`);
      }
    }

    // Crear algunas transacciones
    const wallets = await prisma.wallet.findMany({
      take: 3,
      include: { user: true }
    });

    const transactionTypes = ['PAY', 'RECEIVE', 'EXCHANGE', 'RECHARGE', 'CONVERT', 'AWARD'];
    const tokenTypes = ['UNITS', 'TOINS', 'MERIT_POINTS'];
    const statuses = ['COMPLETED', 'PENDING', 'FAILED'];

    for (let i = 0; i < 10; i++) {
      const fromWallet = wallets[Math.floor(Math.random() * wallets.length)];
      const toWallet = wallets[Math.floor(Math.random() * wallets.length)];
      
      if (fromWallet.id !== toWallet.id) {
        await prisma.transaction.create({
          data: {
            fromUserId: Math.random() > 0.3 ? fromWallet.userId : null, // Algunas del sistema
            toUserId: toWallet.userId,
            amount: Math.floor(Math.random() * 100) + 10,
            tokenType: tokenTypes[Math.floor(Math.random() * tokenTypes.length)],
            type: transactionTypes[Math.floor(Math.random() * transactionTypes.length)],
            status: statuses[Math.floor(Math.random() * statuses.length)],
            description: `Transaction ${i + 1} - ${transactionTypes[Math.floor(Math.random() * transactionTypes.length)]}`
          }
        });
      }
    }

    console.log('✅ Transacciones de prueba creadas');

    // Verificar datos creados
    const walletCount = await prisma.wallet.count();
    const transactionCount = await prisma.transaction.count();

    console.log(`\n📊 Resumen:`);
    console.log(`   💰 Wallets: ${walletCount}`);
    console.log(`   🔄 Transacciones: ${transactionCount}`);

  } catch (error) {
    console.error('❌ Error seeding wallet data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedWalletData().catch(console.error); 