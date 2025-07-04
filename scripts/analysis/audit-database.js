const { PrismaClient } = require('./src/generated/prisma');

const prisma = new PrismaClient();

async function auditDatabase() {
  console.log('🔍 AUDITORÍA COMPLETA DE LA BASE DE DATOS - PROYECTO COOMUNITY');
  console.log('================================================================');
  console.log('');

  try {
    // 📊 Modelos principales del sistema
    console.log('📊 MODELOS PRINCIPALES:');
    console.log('------------------------');
    
    const userCount = await prisma.user.count();
    console.log(`👥 Users: ${userCount} registros`);
    
    const mundoCount = await prisma.mundo.count();
    console.log(`🌍 Mundos: ${mundoCount} registros`);
    
    const playlistCount = await prisma.playlist.count();
    console.log(`📋 Playlists: ${playlistCount} registros`);
    
    const videoItemCount = await prisma.videoItem.count();
    console.log(`🎥 VideoItems: ${videoItemCount} registros`);
    
    const questionCount = await prisma.question.count();
    console.log(`❓ Questions: ${questionCount} registros`);
    
    const answerOptionCount = await prisma.answerOption.count();
    console.log(`📝 AnswerOptions: ${answerOptionCount} registros`);
    
    console.log('');
    
    // 🎮 Modelos de gamificación
    console.log('🎮 GAMIFICACIÓN:');
    console.log('----------------');
    
    const meritCount = await prisma.merit.count();
    console.log(`🏆 Merits: ${meritCount} registros`);
    
    const walletCount = await prisma.wallet.count();
    console.log(`💰 Wallets: ${walletCount} registros`);
    
    const transactionCount = await prisma.transaction.count();
    console.log(`💸 Transactions: ${transactionCount} registros`);
    
    const challengeCount = await prisma.challenge.count();
    console.log(`🎯 Challenges: ${challengeCount} registros`);
    
    const userChallengeCount = await prisma.userChallenge.count();
    console.log(`🎯 UserChallenges: ${userChallengeCount} registros`);
    
    console.log('');
    
    // 🤝 Modelos sociales
    console.log('🤝 SOCIAL:');
    console.log('----------');
    
    const groupCount = await prisma.group.count();
    console.log(`👥 Groups: ${groupCount} registros`);
    
    const publicationCount = await prisma.publication.count();
    console.log(`📢 Publications: ${publicationCount} registros`);
    
    const commentCount = await prisma.comment.count();
    console.log(`💬 Comments: ${commentCount} registros`);
    
    const notificationCount = await prisma.notification.count();
    console.log(`🔔 Notifications: ${notificationCount} registros`);
    
    console.log('');
    
    // 🛒 Marketplace
    console.log('🛒 MARKETPLACE:');
    console.log('---------------');
    
    const marketplaceItemCount = await prisma.marketplaceItem.count();
    console.log(`🛍️ MarketplaceItems: ${marketplaceItemCount} registros`);
    
    console.log('');
    
    // 🔍 ANÁLISIS DETALLADO DE MODELOS CRÍTICOS
    console.log('🔍 ANÁLISIS DETALLADO:');
    console.log('======================');
    console.log('');
    
    // Usuarios con roles
    console.log('👥 USUARIOS CON ROLES:');
    const usersWithRoles = await prisma.user.findMany({
      include: {
        userRoles: {
          include: {
            role: true
          }
        }
      }
    });
    
    usersWithRoles.forEach(user => {
      const roles = user.userRoles.map(ur => ur.role.name).join(', ');
      console.log(`   📧 ${user.email} - Roles: [${roles}]`);
    });
    
    console.log('');
    
    // Videos con detalles
    console.log('🎥 VIDEOS CON DETALLES:');
    const videosWithDetails = await prisma.videoItem.findMany({
      include: {
        questions: true,
        playlist: true
      }
    });
    
    videosWithDetails.forEach(video => {
      console.log(`   🎬 "${video.title}" - ${video.questions.length} preguntas - Playlist: ${video.playlist.name}`);
      console.log(`      📺 Platform: ${video.platform}, ExternalId: ${video.externalId}`);
    });
    
    console.log('');
    
    // Preguntas por video
    console.log('❓ PREGUNTAS POR VIDEO:');
    const questionsGrouped = await prisma.question.groupBy({
      by: ['videoItemId'],
      _count: {
        id: true
      }
    });
    
    for (const group of questionsGrouped) {
      const video = await prisma.videoItem.findUnique({
        where: { id: group.videoItemId }
      });
      console.log(`   🎬 "${video?.title}" - ${group._count.id} preguntas`);
    }
    
    if (questionsGrouped.length === 0) {
      console.log('   ❌ NO HAY PREGUNTAS EN NINGÚN VIDEO');
    }
    
    console.log('');
    
    // Wallets con balances
    console.log('💰 WALLETS CON BALANCES:');
    const walletsWithUsers = await prisma.wallet.findMany({
      include: {
        user: true
      }
    });
    
    walletsWithUsers.forEach(wallet => {
      console.log(`   💳 ${wallet.user.email} - Balance: ${wallet.balance} ${wallet.currency}`);
    });
    
    console.log('');
    
    // 🚨 PROBLEMAS DETECTADOS
    console.log('🚨 PROBLEMAS DETECTADOS:');
    console.log('========================');
    
    const problems = [];
    
    if (questionCount === 0) {
      problems.push('❌ NO HAY PREGUNTAS - Los videos no tendrán interactividad');
    }
    
    if (videoItemCount === 0) {
      problems.push('❌ NO HAY VIDEOS - ÜPlay estará vacío');
    }
    
    if (userCount === 0) {
      problems.push('❌ NO HAY USUARIOS - No se puede hacer login');
    }
    
    if (walletCount === 0) {
      problems.push('❌ NO HAY WALLETS - Funcionalidad de pagos no funcionará');
    }
    
    if (problems.length === 0) {
      console.log('✅ No se detectaron problemas críticos');
    } else {
      problems.forEach(problem => console.log(problem));
    }
    
    console.log('');
    console.log('🎯 RECOMENDACIONES:');
    console.log('===================');
    
    if (questionCount === 0) {
      console.log('1. 🔧 Ejecutar: npm run seed para poblar preguntas');
    }
    
    if (videoItemCount < 5) {
      console.log('2. 🔧 Verificar que el seed incluye videos de prueba');
    }
    
    console.log('3. 🔧 Usar Prisma Studio en http://localhost:5555 para verificación visual');
    console.log('4. 🔧 Revisar prisma/seed.ts para asegurar datos completos');
    
  } catch (error) {
    console.error('❌ Error durante la auditoría:', error);
  } finally {
    await prisma.$disconnect();
  }
}

auditDatabase(); 