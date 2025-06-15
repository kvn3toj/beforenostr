const { PrismaClient } = require('./src/generated/prisma');

async function checkPlaylists() {
  const prisma = new PrismaClient();
  
  try {
    console.log('=== Checking Playlists Data ===');
    
    // Contar total de playlists
    const count = await prisma.playlist.count();
    console.log(`Total playlists in database: ${count}`);
    
    // Obtener todas las playlists
    const playlists = await prisma.playlist.findMany({
      include: {
        videoItems: true,
        mundo: true
      }
    });
    
    console.log('\n=== All Playlists ===');
    playlists.forEach((playlist, index) => {
      console.log(`\n${index + 1}. Playlist:`);
      console.log(`   ID: ${playlist.id}`);
      console.log(`   Name: ${playlist.name}`);
      console.log(`   Description: ${playlist.description || 'No description'}`);
      console.log(`   Mundo ID: ${playlist.mundoId || 'No mundo assigned'}`);
      console.log(`   Mundo Name: ${playlist.mundo?.name || 'No mundo'}`);
      console.log(`   Video Items: ${playlist.videoItems?.length || 0}`);
      console.log(`   Created: ${playlist.createdAt}`);
      console.log(`   Updated: ${playlist.updatedAt}`);
    });
    
    // Verificar mundos también
    console.log('\n=== Checking Mundos ===');
    const mundos = await prisma.mundo.findMany();
    console.log(`Total mundos: ${mundos.length}`);
    mundos.forEach((mundo, index) => {
      console.log(`${index + 1}. ${mundo.name} (ID: ${mundo.id})`);
    });
    
    // Verificar video items
    console.log('\n=== Checking Video Items ===');
    const videoItems = await prisma.videoItem.findMany();
    console.log(`Total video items: ${videoItems.length}`);
    
  } catch (error) {
    console.error('Error checking playlists:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkPlaylists(); 