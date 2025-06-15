const { PrismaClient } = require('@prisma/client');
const fetch = require('node-fetch');

const prisma = new PrismaClient();

async function getYouTubeDuration(videoUrl) {
  console.log(`🔍 Getting duration for: ${videoUrl}`);
  
  // Extraer video ID
  const match = videoUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
  if (!match) {
    console.log('❌ Invalid YouTube URL');
    return null;
  }
  
  const videoId = match[1];
  console.log(`📹 Video ID: ${videoId}`);
  
  try {
    // Scraping directo de YouTube
    const response = await fetch(videoUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      timeout: 15000
    });
    
    if (!response.ok) {
      console.log(`❌ Failed to fetch: ${response.status}`);
      return null;
    }
    
    const html = await response.text();
    
    // Buscar duración en el HTML
    const durationPatterns = [
      /"lengthSeconds":"(\d+)"/,
      /"approxDurationMs":"(\d+)"/,
      /lengthSeconds":"(\d+)"/,
    ];
    
    for (const pattern of durationPatterns) {
      const match = html.match(pattern);
      if (match) {
        let duration;
        
        if (pattern.source.includes('lengthSeconds')) {
          duration = parseInt(match[1]);
        } else if (pattern.source.includes('approxDurationMs')) {
          duration = Math.round(parseInt(match[1]) / 1000);
        }
        
        if (duration > 0) {
          console.log(`✅ Found duration: ${duration} seconds (${Math.floor(duration/60)}:${(duration%60).toString().padStart(2,'0')})`);
          return duration;
        }
      }
    }
    
    console.log('⚠️ No duration pattern found');
    return null;
    
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    return null;
  }
}

async function fixVideoDurations() {
  console.log('🚀 Starting video duration fix...\n');
  
  try {
    // Obtener todos los videos
    const videos = await prisma.videoItem.findMany({
      where: {
        isDeleted: { not: true }
      },
      select: {
        id: true,
        title: true,
        content: true,
        duration: true
      }
    });
    
    console.log(`📊 Found ${videos.length} videos to process\n`);
    
    let updated = 0;
    let errors = 0;
    let verified = 0;
    
    for (const video of videos) {
      console.log(`\n🎯 Processing video ${video.id}: ${video.title}`);
      console.log(`   Current duration: ${video.duration} seconds`);
      console.log(`   Content: ${video.content}`);
      
      // Solo procesar videos de YouTube
      if (!video.content.includes('youtube.com') && !video.content.includes('youtu.be')) {
        console.log('⏭️ Skipping non-YouTube video');
        continue;
      }
      
      const realDuration = await getYouTubeDuration(video.content);
      
      if (realDuration && realDuration > 0) {
        if (video.duration !== realDuration) {
          // Actualizar en la base de datos
          await prisma.videoItem.update({
            where: { id: video.id },
            data: { duration: realDuration }
          });
          
          console.log(`✅ UPDATED: ${video.duration}s → ${realDuration}s`);
          updated++;
        } else {
          console.log(`✅ VERIFIED: Duration already correct (${realDuration}s)`);
          verified++;
        }
      } else {
        console.log(`❌ ERROR: Could not get duration`);
        errors++;
      }
      
      // Pausa para no sobrecargar YouTube
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    console.log(`\n🎉 COMPLETED!`);
    console.log(`   📊 Total videos: ${videos.length}`);
    console.log(`   ✅ Updated: ${updated}`);
    console.log(`   ✅ Verified: ${verified}`);
    console.log(`   ❌ Errors: ${errors}`);
    
  } catch (error) {
    console.error('❌ Script failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixVideoDurations().catch(console.error); 