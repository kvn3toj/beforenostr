const { PrismaClient } = require('./src/generated/prisma');

async function debugVideoDurations() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔍 Debugging Video Durations - Database Analysis\n');
    
    // Obtener todos los videos con sus duraciones
    const videos = await prisma.videoItem.findMany({
      select: {
        id: true,
        title: true,
        duration: true,
        content: true,
        isActive: true,
        createdAt: true
      },
      orderBy: {
        id: 'asc'
      }
    });
    
    console.log(`📊 Total videos found: ${videos.length}\n`);
    
    for (const video of videos) {
      console.log(`🎥 Video ID: ${video.id}`);
      console.log(`   Title: "${video.title}"`);
      console.log(`   Duration: ${video.duration || 'NULL'} seconds`);
      
      if (video.duration) {
        const minutes = Math.floor(video.duration / 60);
        const seconds = video.duration % 60;
        console.log(`   Duration formatted: ${minutes}:${seconds.toString().padStart(2, '0')}`);
      }
      
      // Extraer video ID de YouTube del contenido
      let youtubeId = null;
      try {
        if (video.content) {
          // Intentar parsear como JSON
          if (video.content.startsWith('{')) {
            const contentObj = JSON.parse(video.content);
            youtubeId = contentObj.videoId;
          } else {
            // Buscar en iframe
            const match = video.content.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]+)/);
            if (match) {
              youtubeId = match[1];
            }
          }
        }
      } catch (error) {
        console.log(`   ⚠️ Error parsing content: ${error.message}`);
      }
      
      console.log(`   YouTube ID: ${youtubeId || 'NOT FOUND'}`);
      console.log(`   Active: ${video.isActive}`);
      console.log(`   Created: ${video.createdAt}`);
      
      // Buscar videos con títulos que contengan "propósito" o "5 minutos"
      if (video.title.toLowerCase().includes('propósito') || 
          video.title.toLowerCase().includes('5 minutos') ||
          video.title.toLowerCase().includes('conocer')) {
        console.log(`   🎯 POTENTIAL MATCH for inconsistency issue!`);
      }
      
      console.log('');
    }
    
    // Buscar videos con duraciones específicas que podrían ser problemáticas
    console.log('\n🔍 Videos with specific durations that might be inconsistent:');
    
    const fiveMinuteVideos = videos.filter(v => v.duration === 300); // 5:00
    const tenMinuteVideos = videos.filter(v => v.duration === 600); // 10:00
    const eighteenMinuteVideos = videos.filter(v => v.duration === 1080); // 18:00
    
    if (fiveMinuteVideos.length > 0) {
      console.log(`\n📺 Videos with 5:00 duration (300s):`);
      fiveMinuteVideos.forEach(v => {
        console.log(`   - ID ${v.id}: "${v.title}"`);
      });
    }
    
    if (tenMinuteVideos.length > 0) {
      console.log(`\n📺 Videos with 10:00 duration (600s):`);
      tenMinuteVideos.forEach(v => {
        console.log(`   - ID ${v.id}: "${v.title}"`);
      });
    }
    
    if (eighteenMinuteVideos.length > 0) {
      console.log(`\n📺 Videos with 18:00 duration (1080s):`);
      eighteenMinuteVideos.forEach(v => {
        console.log(`   - ID ${v.id}: "${v.title}"`);
      });
    }
    
    // Buscar videos sin duración
    const videosWithoutDuration = videos.filter(v => !v.duration);
    if (videosWithoutDuration.length > 0) {
      console.log(`\n⚠️ Videos without duration (${videosWithoutDuration.length}):`);
      videosWithoutDuration.forEach(v => {
        console.log(`   - ID ${v.id}: "${v.title}"`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

debugVideoDurations().catch(console.error); 